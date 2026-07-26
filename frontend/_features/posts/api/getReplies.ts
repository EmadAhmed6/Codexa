import { axiosClient } from "@/lib/axiosClient";
import { Reply } from "../types/Post";

export const getReplies = async (
  postId: string,
  commentId: string,
): Promise<Reply[]> => {
  const response = await axiosClient.get<any>(
    `/posts/${postId}/comments/${commentId}/replies`,
  );
  return response.data?.data || response.data || [];
};
