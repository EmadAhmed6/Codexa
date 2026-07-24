import { axiosClient } from "@/lib/axiosClient";
import { UserProfile } from "../../posts/types/Post";

export interface UpdateUserPayload {
  username?: string;
  jobTitle?: string;
  email?: string;
  password?: string;
}

export const updateUser = async (
  userId: string,
  data: UpdateUserPayload,
): Promise<UserProfile> => {
  const response = await axiosClient.put<any>(`/users/${userId}`, data);
  return response.data?.data || response.data?.user || response.data;
};
