import { axiosClient } from "@/lib/axiosClient";

export const deleteReply = async ({
  postId,
  commentId,
  replyCommentId,
}: {
  postId: string;
  commentId: string;
  replyCommentId: string;
}): Promise<void> => {
  await axiosClient.delete(
    `/posts/${postId}/comments/${commentId}/replies/${replyCommentId}`,
  );
};
