import { axiosClient } from "@/lib/axiosClient";

export const likeReply = async ({
  postId,
  commentId,
  replyCommentId,
}: {
  postId: string;
  commentId: string;
  replyCommentId: string;
}): Promise<any> => {
  const response = await axiosClient.put(
    `/posts/${postId}/comments/${commentId}/replies/${replyCommentId}/like`,
  );
  return response.data?.data || response.data;
};
