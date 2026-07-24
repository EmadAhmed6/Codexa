import { axiosClient } from "@/lib/axiosClient";
import { Post } from "../types/Post";

export const sharePost = async (postId: string): Promise<Post> => {
  const response = await axiosClient.post<any>(`/posts/${postId}/share`, {});
  return response.data?.data || response.data;
};
