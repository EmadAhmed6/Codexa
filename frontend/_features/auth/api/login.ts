import { axiosClient } from "@/lib/axiosClient";
import type { ILogin } from "../schemas/auth";
import type { AuthResponse } from "../types/auth";

export const login = async (data: ILogin): Promise<AuthResponse> => {
  const identifier = data.email.trim();
  const isEmail = identifier.includes("@");

  const payload = isEmail
    ? { email: identifier, password: data.password }
    : { username: identifier, password: data.password };

  const response = await axiosClient.post<AuthResponse>("/auth/login", payload);
  return response.data;
};
