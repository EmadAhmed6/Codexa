import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import { register } from "../api/register";
import { AuthResponse } from "../types/auth";
import { AxiosError } from "axios";
import { IRegister } from "../schemas/auth";

export const useRegisterMutation = (
  options?: UseMutationOptions<AuthResponse, AxiosError, IRegister>,
) => {
  return useMutation({
    mutationFn: register,
    ...options,
  });
};
