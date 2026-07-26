import { axiosClient } from "@/lib/axiosClient";
import { Reply } from "../types/Post";

export const addReply = async ({
  postId,
  commentId,
  text,
  replyImageFile,
}: {
  postId: string;
  commentId: string;
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

  const response = await axiosClient.post<any>(
    `/posts/${postId}/comments/${commentId}/replies`,
    payload,
    { headers },
  );
  return response.data?.data || response.data;
};
