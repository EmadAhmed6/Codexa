import { useMutation, useQueryClient } from "@tanstack/react-query";
import { likeComment } from "../api/likeComment";
import { toast } from "sonner";

export const useLikeComment = (postId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (commentId: string) => likeComment(commentId, postId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments", postId] });
      toast.success("Comment reaction updated!");
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || "Failed to react to comment.");
    },
  });
};
