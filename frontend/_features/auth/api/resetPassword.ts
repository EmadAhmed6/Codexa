import { axiosClient } from "@/lib/axiosClient";
import type { IResetPassword } from "../schemas/auth";
import type { AuthResponse } from "../types/auth";

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
