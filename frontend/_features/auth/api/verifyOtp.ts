import { axiosClient } from "@/lib/axiosClient";
import type { AuthResponse } from "../types/auth";

export interface VerifyOtpPayload {
  email: string;
  otp: string | number;
}

export const verifyOtp = async (
  data: VerifyOtpPayload,
): Promise<AuthResponse> => {
  const response = await axiosClient.post<AuthResponse>(
    "/auth/verify-otp",
    data,
  );
  return response.data;
};
