import axiosInstance from "@/config/axios-instance";
import { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";
import Toast from "react-native-toast-message";

export type MethodType =
  "get" | "post" | "delete" | "patch" | "put" | "head" | "options";

export type ApiRequestConfig<TData = unknown> = {
  url: string;
  method: MethodType;
  data?: TData;
  params?: Record<string, unknown>;
  headers?: Record<string, string>;
  silent?: boolean;
  debug?: boolean;
  timeout?: number;
  onError?: (error: Error) => void;
};

async function requestAPI<TResponse = unknown, TRequest = unknown>(
  config: ApiRequestConfig<TRequest>,
): Promise<TResponse> {
  const shouldDebug = config.debug ?? false;

  if (shouldDebug) {
    console.group(
      `🌐 API Request: ${config.method.toUpperCase()} ${config.url}`,
    );
    console.log("Headers:", config.headers || "Default headers");
    if (config.data) console.log("Payload:", config.data);
    if (config.params) console.log("Params:", config.params);
    console.groupEnd();
  }

  try {
    const axiosConfig: AxiosRequestConfig = {
      url: config.url,
      method: config.method,
      data: config.data,
      params: config.params,
      headers: config.headers,
      timeout: config.timeout,
    };

    const response: AxiosResponse = await axiosInstance(axiosConfig);

    if (shouldDebug) {
      console.group(
        `✅ API Response: ${config.method.toUpperCase()} ${config.url}`,
      );
      console.log("Status:", response.status);
      console.log("Data:", response.data);
      console.groupEnd();
    }

    return extractResponseData<TResponse>(response);
  } catch (error) {
    if (shouldDebug) {
      console.group(
        `❌ API Error: ${config.method.toUpperCase()} ${config.url}`,
      );
      console.error("Error:", error);
      console.groupEnd();
    }

    return handleApiError(error as Error | AxiosError, config);
  }
}

function extractResponseData<T>(response: AxiosResponse): T {
  if (response?.data?.data !== undefined) {
    return response.data.data;
  } else if (response?.data !== undefined) {
    return response.data;
  }
  return response as unknown as T;
}

function handleApiError(
  error: Error | AxiosError,
  config: ApiRequestConfig,
): never {
  let errorMessage = "An unexpected error occurred";
  let errorCode: number | undefined;

  if (isAxiosError(error)) {
    if (!error.response) {
      errorMessage = "Network error: Unable to connect to server";
    } else {
      errorCode = error.response.status;

      errorMessage =
        (error.response.data as unknown as { message?: string })?.message ||
        (error.response.data as unknown as { error?: string })?.error ||
        error.message ||
        `HTTP Error ${errorCode}`;

      // Don't toast on 401 for normal routes — the interceptor handles those
      // But DO toast on 401 for auth routes (invalid credentials)
      const isAuthRoute =
        config.url?.includes("/auth/login") ||
        config.url?.includes("/auth/register") ||
        config.url?.includes("/auth/refresh");

      if (errorCode === 401 && !isAuthRoute) {
        throw error;
      }

      if (errorCode >= 500) {
        errorMessage = `Server Error: ${errorMessage}`;
      }
    }
  } else {
    errorMessage = error.message || errorMessage;
  }

  const enrichedError = createEnrichedError(
    error,
    errorMessage,
    errorCode,
    config,
  );

  if (config.onError) {
    config.onError(enrichedError);
  }

  if (!config.silent) {
    const { title, description } = parseErrorMessage(errorMessage);
    console.log("🚀 ~ handleApiError ~ errorMessage:", errorMessage);
    Toast.show({
      type: "error",
      text1: title,
      text2: description,
      visibilityTime: 4000,
    });
  }

  throw enrichedError;
}

function createEnrichedError(
  originalError: Error | AxiosError,
  message: string,
  statusCode: number | undefined,
  config: ApiRequestConfig,
): Error & {
  originalError: Error | AxiosError;
  endpoint: string;
  method: string;
  statusCode?: number;
} {
  const enrichedError = new Error(message);
  enrichedError.name = statusCode ? `ApiError(${statusCode})` : "ApiError";
  return Object.assign(enrichedError, {
    originalError,
    endpoint: config.url,
    method: config.method,
    statusCode,
  });
}

function isAxiosError(error: any): error is AxiosError {
  return error && error.isAxiosError === true;
}

function parseErrorMessage(message: string): {
  title: string;
  description: string;
} {
  const hasColon = message.includes(":");
  if (hasColon) {
    const [title, ...descriptionParts] = message.split(":");
    return {
      title: title.toUpperCase(),
      description: descriptionParts.join(":").trim(),
    };
  }
  return { title: "ERROR", description: message };
}

export default requestAPI;
