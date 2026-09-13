import { envs } from "@/config/envs";
import { AUTH_CONSTANTS } from "@/constants/auth";
import { safeAsyncStorage, safeSecureStore } from "@/utils/storage";
import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";

// ─── Config ──────────────────────────────────────────────────────────────────

const CONFIG = {
  TIMEOUT: 30_000,
  MAX_RETRY_ATTEMPTS: 3,
};

// ─── Token Manager ───────────────────────────────────────────────────────────

export const tokenManager = {
  getAccessToken: async (): Promise<string | null> => {
    try {
      return await safeSecureStore.getItem<string>(AUTH_CONSTANTS.TOKEN_KEY);
    } catch (error) {
      console.error("Error getting access token:", error);
      return null;
    }
  },

  getRefreshToken: async (): Promise<string | null> => {
    try {
      return await safeSecureStore.getItem<string>(
        AUTH_CONSTANTS.REFRESH_TOKEN,
      );
    } catch (error) {
      console.error("Error getting refresh token:", error);
      return null;
    }
  },

  setTokens: async (
    accessToken: string,
    refreshToken?: string,
  ): Promise<boolean> => {
    try {
      await safeSecureStore.setItem(AUTH_CONSTANTS.TOKEN_KEY, accessToken);
      if (refreshToken) {
        await safeSecureStore.setItem(
          AUTH_CONSTANTS.REFRESH_TOKEN,
          refreshToken,
        );
      }
      return true;
    } catch (error) {
      console.error("Error setting tokens:", error);
      return false;
    }
  },

  clearAccessToken: async (): Promise<boolean> => {
    try {
      await safeSecureStore.removeItem(AUTH_CONSTANTS.TOKEN_KEY);
      return true;
    } catch (error) {
      console.error("Error clearing access token:", error);
      return false;
    }
  },

  clearTokens: async (): Promise<boolean> => {
    try {
      await safeSecureStore.removeItem(AUTH_CONSTANTS.TOKEN_KEY);
      await safeSecureStore.removeItem(AUTH_CONSTANTS.REFRESH_TOKEN);
      return true;
    } catch (error) {
      console.error("Error clearing tokens:", error);
      return false;
    }
  },
};

// ─── Refresh Logic ───────────────────────────────────────────────────────────

let isRefreshing = false;
let refreshAttempts = 0;
let failedQueue: Array<{
  resolve: (value: unknown) => void;
  reject: (reason?: unknown) => void;
  config: InternalAxiosRequestConfig;
}> = [];

const processQueue = (error: Error | null, token: string | null) => {
  failedQueue.forEach(({ resolve, reject, config }) => {
    if (error) {
      reject(error);
    } else if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      resolve(axiosInstance(config));
    }
  });
  failedQueue = [];
};

const refreshAccessToken = async (): Promise<string | null> => {
  try {
    if (refreshAttempts >= CONFIG.MAX_RETRY_ATTEMPTS) {
      console.log("❌ Max refresh attempts reached");
      refreshAttempts = 0;
      return null;
    }

    refreshAttempts++;

    const refreshToken = await tokenManager.getRefreshToken();
    if (!refreshToken) {
      console.log("❌ No refresh token available");
      return null;
    }

    if (__DEV__) {
      console.log("🔄 Refreshing access token...");
    }

    const response = await axios.post(`${envs.apiUrl}/auth/refresh`, {
      refreshToken,
    });

    const accessToken = response.data?.accessToken;
    const newRefreshToken = response.data?.refreshToken;

    if (!accessToken) {
      console.log("❌ No access token in refresh response");
      return null;
    }

    const saved = await tokenManager.setTokens(accessToken, newRefreshToken);
    if (!saved) {
      console.log("❌ Failed to save new tokens");
      return null;
    }

    if (__DEV__) {
      console.log("✅ Token refreshed successfully");
    }

    refreshAttempts = 0;
    return accessToken;
  } catch (error: any) {
    if (__DEV__) {
      console.error(
        "❌ Token refresh failed:",
        error?.response?.data || error?.message,
      );
    }
    return null;
  }
};

// ─── Logout Handler ──────────────────────────────────────────────────────────

let logoutHandler: ((keepRefreshToken?: boolean) => void) | null = null;

export const setLogoutHandler = (
  handler: (keepRefreshToken?: boolean) => void,
): void => {
  logoutHandler = handler;
};

const handleLogout = async (keepRefreshToken = false): Promise<void> => {
  isRefreshing = false;
  refreshAttempts = 0;
  const queueCopy = [...failedQueue];
  failedQueue = [];

  queueCopy.forEach(({ reject }) => {
    reject(new Error("Session expired. Please login again."));
  });

  if (keepRefreshToken) {
    await tokenManager.clearAccessToken();
  } else {
    await tokenManager.clearTokens();
  }
  await safeAsyncStorage.removeItem(AUTH_CONSTANTS.USER);

  if (logoutHandler) {
    logoutHandler(keepRefreshToken);
  }
};

// ─── Axios Instance ──────────────────────────────────────────────────────────

const axiosInstance = axios.create({
  baseURL: envs.apiUrl,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  timeout: CONFIG.TIMEOUT,
});

// Request interceptor — attach access token
axiosInstance.interceptors.request.use(
  async (config) => {
    try {
      const token = await tokenManager.getAccessToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      if (__DEV__) {
        console.error("Error in request interceptor:", error);
      }
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// Response interceptor — handle 401 with refresh
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };
    if (!originalRequest) return Promise.reject(error);

    const isAuthRoute =
      originalRequest.url?.includes("/auth/login") ||
      originalRequest.url?.includes("/auth/register") ||
      originalRequest.url?.includes("/auth/refresh");

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !isAuthRoute
    ) {
      if (isRefreshing) {
        if (__DEV__) {
          console.log("🔄 Token refresh in progress, queuing request...");
        }
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject, config: originalRequest });
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const newToken = await refreshAccessToken();
        if (newToken) {
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          processQueue(null, newToken);
          isRefreshing = false;
          return axiosInstance(originalRequest);
        } else {
          processQueue(new Error("Token refresh failed"), null);
          await handleLogout();
          return Promise.reject(
            new Error("Session expired. Please login again."),
          );
        }
      } catch (refreshError) {
        processQueue(refreshError as Error, null);
        isRefreshing = false;
        await handleLogout();
        return Promise.reject(refreshError);
      }
    }

    if (__DEV__) {
      console.log(
        "🚀 [API ERROR]:",
        error.config?.url,
        `Status ${error.response?.status}`,
        "\nData:",
        JSON.stringify(error.response?.data, null, 2),
      );
    }

    return Promise.reject(error);
  },
);

export default axiosInstance;
