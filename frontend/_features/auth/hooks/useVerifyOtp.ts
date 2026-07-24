import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import { verifyOtp, VerifyOtpPayload } from "../api/verifyOtp";
import { AuthResponse } from "../types/auth";
import { AxiosError } from "axios";

export const useVerifyOtpMutation = (
  options?: UseMutationOptions<AuthResponse, AxiosError, VerifyOtpPayload>,
) => {
  return useMutation({
    mutationFn: verifyOtp,
    ...options,
  });
};
