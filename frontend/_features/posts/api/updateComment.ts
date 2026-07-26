import { axiosClient } from "@/lib/axiosClient";
import { Comment } from "../types/Post";

export const updateComment = async (
  commentId: string,
  commentData: { text: string; commentImageFile?: File | null },
  postId?: string,
): Promise<Comment> => {
  const url = postId
    ? `/posts/${postId}/comments/${commentId}`
    : `/posts/comments/${commentId}`;

  let payload: any = { text: commentData.text };
  let headers = {};

  if (commentData.commentImageFile) {
    const formData = new FormData();
    formData.append("text", commentData.text);
    formData.append("commentImage", commentData.commentImageFile);
    payload = formData;
    headers = { "Content-Type": "multipart/form-data" };
  }

  const response = await axiosClient.put<any>(url, payload, { headers });
  return response.data?.data || response.data;
};
