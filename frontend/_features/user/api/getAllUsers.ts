import { axiosClient } from "@/lib/axiosClient";
import { UserProfile } from "../../posts/types/Post";

export const getAllUsers = async (): Promise<UserProfile[]> => {
  const response = await axiosClient.get<any>("/users");
  if (Array.isArray(response.data)) return response.data;
  return response.data?.data || response.data?.users || [];
};
