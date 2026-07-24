import { axiosClient } from "@/lib/axiosClient";
import { Comment } from "../types/Post";

export const getComments = async (postId: string): Promise<Comment[]> => {
  const response = await axiosClient.get<any>(`/posts/${postId}/comments`);
  if (Array.isArray(response.data)) return response.data;
  return response.data?.comments || response.data?.data || [];
};
