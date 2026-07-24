import { axiosClient } from "@/lib/axiosClient";
import type { IRegister } from "../schemas/auth";
import type { AuthResponse } from "../types/auth";

export const register = async (data: IRegister): Promise<AuthResponse> => {
  const response = await axiosClient.post<AuthResponse>("/auth/register", data);
  return response.data;
};
