import { axiosClient } from "@/lib/axiosClient";
import { Comment } from "../types/Post";

export const addComment = async (
  postId: string,
  commentData: { text: string; commentImageFile?: File | null },
): Promise<Comment> => {
  let payload: any = { text: commentData.text };
  let headers = {};

  if (commentData.commentImageFile) {
    const formData = new FormData();
    formData.append("text", commentData.text);
    formData.append("commentImage", commentData.commentImageFile);
    payload = formData;
    headers = { "Content-Type": "multipart/form-data" };
  }

  const response = await axiosClient.post<any>(
    `/posts/${postId}/comments`,
    payload,
    { headers },
  );
  return response.data?.data || response.data;
};
