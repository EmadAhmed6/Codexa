import { axiosClient } from "@/lib/axiosClient";
import { Post } from "../types/Post";

export const updatePost = async (
  postId: string,
  postData: Partial<Post>,
): Promise<Post> => {
  const response = await axiosClient.put<any>(`/posts/${postId}`, postData);
  return response.data?.data || response.data;
};
