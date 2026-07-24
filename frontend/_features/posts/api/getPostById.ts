import { axiosClient } from "@/lib/axiosClient";
import { Post } from "../types/Post";

export const getPostById = async (postId: string): Promise<Post> => {
  const response = await axiosClient.get<any>(`/posts/${postId}`);
  return response.data?.data || response.data;
};
