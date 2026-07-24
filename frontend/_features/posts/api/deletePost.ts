import { axiosClient } from "@/lib/axiosClient";

export const deletePost = async (postId: string): Promise<any> => {
  const response = await axiosClient.delete(`/posts/${postId}`);
  return response.data;
};
