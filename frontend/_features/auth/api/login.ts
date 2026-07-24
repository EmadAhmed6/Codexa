import { axiosClient } from "@/lib/axiosClient";
import type { ILogin } from "../schemas/auth";
import type { AuthResponse } from "../types/auth";

export const login = async (data: ILogin): Promise<AuthResponse> => {
  const response = await axiosClient.post<AuthResponse>("/auth/login", data);
  return response.data;
};
