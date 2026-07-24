import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import { resetPassword, ResetPasswordPayload } from "../api/resetPassword";
import { AuthResponse } from "../types/auth";
import { AxiosError } from "axios";

export const useResetPasswordMutation = (
  options?: UseMutationOptions<AuthResponse, AxiosError, ResetPasswordPayload>,
) => {
  return useMutation({
    mutationFn: resetPassword,
    ...options,
  });
};
