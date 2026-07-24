import { axiosClient } from "@/lib/axiosClient";

export const deleteComment = async (
  commentId: string,
  postId?: string,
): Promise<any> => {
  const url = postId
    ? `/posts/${postId}/comments/${commentId}`
    : `/posts/comments/${commentId}`;
  const response = await axiosClient.delete(url);
  return response.data;
};
