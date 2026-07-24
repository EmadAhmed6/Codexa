import { axiosClient } from "@/lib/axiosClient";
import type {
  ILogin,
  IRegister,
  IForgotPassword,
  IResetPassword,
} from "../schemas/auth-schemas";
import { AuthMe, AuthResponse, ForgotPasswordData } from "../types/auth.types";

export const login = async (data: ILogin): Promise<AuthResponse> => {
  const response = await axiosClient.post<AuthResponse>("/auth/login", data);
  return response.data;
};

export interface VerifyOtpPayload {
  email: string;
  otp: string | number;
}

export const verifyOtp = async (data: VerifyOtpPayload): Promise<AuthResponse> => {
  const response = await axiosClient.post<AuthResponse>("/auth/verify-otp", data);
  return response.data;
};

export const register = async (data: IRegister): Promise<AuthResponse> => {
  const response = await axiosClient.post<AuthResponse>("/auth/register", data);
  return response.data;
};

export const forgotPassword = async (
  data: IForgotPassword,
): Promise<AuthResponse> => {
  const response = await axiosClient.post<AuthResponse>(
    "/auth/forgot-password",
    data,
  );
  return response.data;
};

export interface ResetPasswordPayload extends Partial<IResetPassword> {
  userId?: string;
  token?: string;
}

export const resetPassword = async (
  payload: ResetPasswordPayload,
): Promise<AuthResponse> => {
  const { userId, token, ...bodyData } = payload;
  if (!userId || !token) {
    throw new Error("User ID and Token are required to reset password.");
  }
  const url = `/auth/reset-password/${userId}/${token}`;
  const response = await axiosClient.post<AuthResponse>(url, bodyData);
  return response.data;
};

export const getAuthMe = async (): Promise<AuthMe> => {
  const response = await axiosClient.get<any>("/auth/me");
  return response.data?.data || response.data?.user || response.data;
};
