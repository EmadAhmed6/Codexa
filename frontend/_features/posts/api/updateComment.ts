import { axiosClient } from "@/lib/axiosClient";
import { Comment } from "../types/Post";

export const updateComment = async (
  commentId: string,
  commentData: { text: string },
  postId?: string,
): Promise<Comment> => {
  const url = postId
    ? `/posts/${postId}/comments/${commentId}`
    : `/posts/comments/${commentId}`;
  const response = await axiosClient.put<any>(url, commentData);
  return response.data?.data || response.data;
};
