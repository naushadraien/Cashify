import { tokenManager } from "@/config/axios-instance";
import { useAuth } from "@/providers";
import requestAPI from "@/utils/request-api";
import { AuthTokens, LoginInput, RegisterInput } from "@repo/schemas";
import { useMutation } from "@tanstack/react-query";

export function useLoginMutation() {
  const { saveAuthData } = useAuth();

  return useMutation({
    mutationFn: async (data: LoginInput) => {
      const response = await requestAPI<AuthTokens>({
        url: "/auth/login",
        method: "post",
        data,
      });
      return response;
    },
    onSuccess: async (data) => {
      await saveAuthData(data);
    },
  });
}

export function useRegisterMutation() {
  return useMutation({
    mutationFn: async (data: RegisterInput) => {
      const response = await requestAPI({
        url: "/auth/register",
        method: "post",
        data,
      });
      return response;
    },
  });
}

export function useBiometricLoginMutation() {
  const { saveAuthData } = useAuth();

  return useMutation({
    mutationFn: async () => {
      const refreshToken = await tokenManager.getRefreshToken();
      if (!refreshToken) {
        throw new Error(
          "No refresh token available. Please login with password first.",
        );
      }

      const response = await requestAPI<AuthTokens>({
        url: "/auth/refresh",
        method: "post",
        data: { refreshToken },
      });
      return response;
    },
    onSuccess: async (data) => {
      await saveAuthData(data);
    },
  });
}
