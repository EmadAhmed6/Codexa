import { axiosClient } from "@/lib/axiosClient";
import { UserProfile } from "../../posts/types/Post";

export const uploadProfilePicture = async (
  userId: string,
  file: File,
): Promise<UserProfile> => {
  const formData = new FormData();
  formData.append("profilePicture", file);

  const response = await axiosClient.put<any>(`/users/${userId}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data?.data || response.data?.user || response.data;
};
