import { axiosClient } from "@/lib/axiosClient";

export const deleteUser = async (userId: string): Promise<{ message: string }> => {
  const response = await axiosClient.delete<any>(`/users/${userId}`);
  return response.data;
};
