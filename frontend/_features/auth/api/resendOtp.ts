import { axiosClient } from "@/lib/axiosClient";

export const resendOtp = async (email: string) => {
  const response = await axiosClient.post("/auth/resend-otp", { email });
  return response.data;
};
