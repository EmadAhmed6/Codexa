import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteComment } from "../api/deleteComment";
import { toast } from "sonner";

export const useDeleteComment = (postId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (commentId: string) => deleteComment(commentId, postId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments", postId] });
      queryClient.invalidateQueries({ queryKey: ["post", postId] });
      toast.success("Comment deleted.");
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || "Failed to delete comment.");
    },
  });
};
