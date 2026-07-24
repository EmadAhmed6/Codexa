import { axiosClient } from "@/lib/axiosClient";
import { Comment } from "../types/Post";

export const addComment = async (
  postId: string,
  commentData: { text: string; image?: { url?: string; publicId?: string } },
): Promise<Comment> => {
  const response = await axiosClient.post<any>(
    `/posts/${postId}/comments`,
    commentData,
  );
  return response.data?.data || response.data;
};
