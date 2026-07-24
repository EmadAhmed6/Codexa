import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import { forgotPassword } from "../api/forgotPassword";
import { AuthResponse } from "../types/auth";
import { AxiosError } from "axios";
import { IForgotPassword } from "../schemas/auth";

export const useForgotPasswordMutation = (
  options?: UseMutationOptions<AuthResponse, AxiosError, IForgotPassword>,
) => {
  return useMutation({
    mutationFn: forgotPassword,
    ...options,
  });
};
