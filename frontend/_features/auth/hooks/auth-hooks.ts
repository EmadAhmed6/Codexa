import { useMutation, useQuery, useQueryClient, UseMutationOptions } from "@tanstack/react-query";
import {
  register,
  verifyOtp,
  forgotPassword,
  resetPassword,
  login,
  getAuthMe,
  ResetPasswordPayload,
  VerifyOtpPayload,
} from "../api/auth-api";
import { AuthMe, AuthResponse } from "../types/auth.types";
import { AxiosError } from "axios";
import {
  ILogin,
  IRegister,
  IForgotPassword,
  IResetPassword,
  IVerifyOtp,
} from "../schemas/auth-schemas";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export const useLoginMutation = (
  options?: UseMutationOptions<AuthResponse, AxiosError, ILogin>,
) => {
  return useMutation({
    mutationFn: login,
    ...options,
  });
};

export const useRegisterMutation = (
  options?: UseMutationOptions<AuthResponse, AxiosError, IRegister>,
) => {
  return useMutation({
    mutationFn: register,
    ...options,
  });
};

export const useVerifyOtpMutation = (
  options?: UseMutationOptions<AuthResponse, AxiosError, VerifyOtpPayload>,
) => {
  return useMutation({
    mutationFn: verifyOtp,
    ...options,
  });
};

export const useForgotPasswordMutation = (
  options?: UseMutationOptions<AuthResponse, AxiosError, IForgotPassword>,
) => {
  return useMutation({
    mutationFn: forgotPassword,
    ...options,
  });
};

export const useResetPasswordMutation = (
  options?: UseMutationOptions<AuthResponse, AxiosError, ResetPasswordPayload>,
) => {
  return useMutation({
    mutationFn: resetPassword,
    ...options,
  });
};

export const useGetAuthMeQuery = () => {
  const token = Cookies.get("token");
  return useQuery<AuthMe, AxiosError>({
    queryKey: ["authMe"],
    queryFn: getAuthMe,
    enabled: !!token,
  });
};

export const useLogout = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  const logout = () => {
    Cookies.remove("token", { path: "/" });
    if (typeof window !== "undefined") {
      localStorage.removeItem("token");
    }
    queryClient.removeQueries({ queryKey: ["authMe"] });
    toast.success("Signed out successfully!");
    router.push("/auth/login");
  };

  return logout;
};
