import { axiosClient } from "@/lib/axiosClient";
import { Reply } from "../types/Post";

export const updateReply = async ({
  postId,
  commentId,
  replyCommentId,
  text,
  replyImageFile,
}: {
  postId: string;
  commentId: string;
  replyCommentId: string;
  text: string;
  replyImageFile?: File | null;
}): Promise<Reply> => {
  let payload: any = { text };
  let headers = {};

  if (replyImageFile) {
    const formData = new FormData();
    formData.append("text", text);
    formData.append("replyImage", replyImageFile);
    payload = formData;
    headers = { "Content-Type": "multipart/form-data" };
  }

  const response = await axiosClient.put<any>(
    `/posts/${postId}/comments/${commentId}/replies/${replyCommentId}`,
    payload,
    { headers },
  );
  return response.data?.data || response.data;
};
