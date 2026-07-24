import { axiosClient } from "@/lib/axiosClient";
import { UserProfile } from "../../posts/types/Post";

export interface UpdateUserPayload {
  username?: string;
  jobTitle?: string;
  email?: string;
  password?: string;
}

export const getAllUsers = async (): Promise<UserProfile[]> => {
  const response = await axiosClient.get<any>("/users");
  if (Array.isArray(response.data)) return response.data;
  return response.data?.data || response.data?.users || [];
};

export const getUserById = async (userId: string): Promise<UserProfile> => {
  const response = await axiosClient.get<any>(`/users/${userId}`);
  return response.data?.data || response.data?.user || response.data;
};

export const updateUser = async (
  userId: string,
  data: UpdateUserPayload,
): Promise<UserProfile> => {
  const response = await axiosClient.put<any>(`/users/${userId}`, data);
  return response.data?.data || response.data?.user || response.data;
};

export const uploadProfilePicture = async (
  userId: string,
  file: File,
): Promise<UserProfile> => {
  const formData = new FormData();
  formData.append("profilePicture", file);

  const response = await axiosClient.post<any>(`/users/${userId}/upload`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data?.data || response.data?.user || response.data;
};

export const deleteUser = async (userId: string): Promise<{ message: string }> => {
  const response = await axiosClient.delete<any>(`/users/${userId}`);
  return response.data;
};
