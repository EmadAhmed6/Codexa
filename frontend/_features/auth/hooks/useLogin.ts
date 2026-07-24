import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import { login } from "../api/login";
import { AuthResponse } from "../types/auth";
import { AxiosError } from "axios";
import { ILogin } from "../schemas/auth";

export const useLoginMutation = (
  options?: UseMutationOptions<AuthResponse, AxiosError, ILogin>,
) => {
  return useMutation({
    mutationFn: login,
    ...options,
  });
};
