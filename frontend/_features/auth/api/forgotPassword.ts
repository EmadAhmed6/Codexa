import { axiosClient } from "@/lib/axiosClient";
import type { IForgotPassword } from "../schemas/auth";
import type { AuthResponse } from "../types/auth";

export const forgotPassword = async (
  data: IForgotPassword,
): Promise<AuthResponse> => {
  const response = await axiosClient.post<AuthResponse>(
    "/auth/forgot-password",
    data,
  );
  return response.data;
};
