import React, {
  createContext,
  useContext,
  useCallback,
  useEffect,
  useState,
} from "react";
import requestAPI from "@/utils/request-api";
import { tokenManager, setLogoutHandler } from "@/config/axios-instance";
import { safeAsyncStorage } from "@/utils/storage";
import { AUTH_CONSTANTS } from "@/constants/auth";
import { AuthTokens, AuthUser } from "@repo/schemas";

interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isAuthLoading: boolean;
  isLoginLoading: boolean;
  biometricAvailable: boolean;
  saveAuthData: (tokens: AuthTokens) => Promise<void>;
  onLogout: () => Promise<void>;
  enableBiometric: () => Promise<void>;
  disableBiometric: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [isLoginLoading, setIsLoginLoading] = useState(false);
  const [biometricAvailable, setBiometricAvailable] = useState(false);

  // Initialize auth state
  useEffect(() => {
    const initAuth = async () => {
      try {
        const storedToken = await tokenManager.getAccessToken();
        const storedUser = await safeAsyncStorage.getItem<AuthUser>(
          AUTH_CONSTANTS.USER,
        );

        if (storedToken && storedUser) {
          setToken(storedToken);
          setUser(storedUser);

          // Check biometric flag for this user
          const bioKey = `${AUTH_CONSTANTS.BIOMETRIC_ENABLED_PREFIX}${storedUser.email}`;
          const isBioEnabled = await safeAsyncStorage.getItem<boolean>(bioKey);
          if (isBioEnabled) {
            setBiometricAvailable(true);
          }
        } else {
          // If no full session, check if we at least have a refresh token and user email for biometric
          // We'll rely on the useBiometric hook inside onBiometricLogin for full hardware check,
          // but we can set a basic availability flag here if we want to show the button.
          const refreshToken = await tokenManager.getRefreshToken();
          if (refreshToken) {
            setBiometricAvailable(true);
          }
        }
      } catch (error) {
        console.error("Failed to initialize auth state:", error);
      } finally {
        setIsAuthLoading(false);
      }
    };

    initAuth();
  }, []);

  const handleLogout = useCallback(async (keptBiometrics = false) => {
    setToken(null);
    setUser(null);
    if (!keptBiometrics) {
      setBiometricAvailable(false);
    }
  }, []);

  useEffect(() => {
    setLogoutHandler(handleLogout);
    return () => setLogoutHandler(() => {});
  }, [handleLogout]);

  const saveAuthData = async (tokens: AuthTokens) => {
    await tokenManager.setTokens(tokens.accessToken, tokens.refreshToken);
    await safeAsyncStorage.setItem(AUTH_CONSTANTS.USER, tokens.user);
    setToken(tokens.accessToken);
    setUser(tokens.user);
  };

  const onLogout = async () => {
    // For this implementation, we will assume standard logout keeps biometrics active.
    // A "Remove Account" feature could pass false to wipe everything.
    const keepBiometrics = biometricAvailable;

    setIsLoginLoading(true);
    try {
      const refreshToken = await tokenManager.getRefreshToken();
      if (refreshToken && !keepBiometrics) {
        await requestAPI({
          url: "/auth/logout",
          method: "post",
          data: { refreshToken },
          silent: true,
        });
      }
    } catch (e) {
      console.warn("Logout API failed, continuing local logout");
    } finally {
      if (keepBiometrics) {
        await tokenManager.clearAccessToken();
      } else {
        await tokenManager.clearTokens();
      }
      await safeAsyncStorage.removeItem(AUTH_CONSTANTS.USER);
      handleLogout(keepBiometrics);
      setIsLoginLoading(false);
    }
  };

  const enableBiometric = async () => {
    if (user?.email) {
      const bioKey = `${AUTH_CONSTANTS.BIOMETRIC_ENABLED_PREFIX}${user.email}`;
      await safeAsyncStorage.setItem(bioKey, true);
      setBiometricAvailable(true);
    }
  };

  const disableBiometric = async () => {
    if (user?.email) {
      const bioKey = `${AUTH_CONSTANTS.BIOMETRIC_ENABLED_PREFIX}${user.email}`;
      await safeAsyncStorage.removeItem(bioKey);
      setBiometricAvailable(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!token,
        isAuthLoading,
        isLoginLoading,
        biometricAvailable,
        saveAuthData,
        onLogout,
        enableBiometric,
        disableBiometric,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
