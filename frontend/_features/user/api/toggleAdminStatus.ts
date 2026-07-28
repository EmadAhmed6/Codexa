import { axiosClient } from "@/lib/axiosClient";

export const toggleAdminStatus = async (userId: string) => {
  const response = await axiosClient.patch(`/users/${userId}`);
  return response.data;
};
