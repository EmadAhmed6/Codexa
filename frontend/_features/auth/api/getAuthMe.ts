import { axiosClient } from "@/lib/axiosClient";
import type { AuthMe } from "../types/auth";

export const getAuthMe = async (): Promise<AuthMe> => {
  const response = await axiosClient.get<any>("/auth/me");
  return response.data?.data || response.data?.user || response.data;
};
