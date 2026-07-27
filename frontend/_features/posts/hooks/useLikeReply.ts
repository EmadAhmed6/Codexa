import { useMutation, useQueryClient } from "@tanstack/react-query";
import { likeReply } from "../api/likeReply";
import { toast } from "sonner";

export const useLikeReply = (postId: string, commentId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (replyCommentId: string) =>
      likeReply({ postId, commentId, replyCommentId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["replies", postId, commentId] });
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || "Could not update reply reaction.");
    },
  });
};
