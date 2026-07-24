import { axiosClient } from "@/lib/axiosClient";
import { Post } from "../types/Post";

export const likePost = async (postId: string): Promise<Post> => {
  try {
    const response = await axiosClient.put<any>(`/posts/${postId}/like`);
    return response.data?.data || response.data;
  } catch (err) {
    const response = await axiosClient.post<any>(`/posts/${postId}/like`);
    return response.data?.data || response.data;
  }
};
