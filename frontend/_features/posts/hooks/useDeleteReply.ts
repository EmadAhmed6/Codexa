import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteReply } from "../api/deleteReply";
import { toast } from "sonner";

export const useDeleteReply = (postId: string, commentId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (replyCommentId: string) =>
      deleteReply({ postId, commentId, replyCommentId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["replies", postId, commentId] });
      queryClient.invalidateQueries({ queryKey: ["comments", postId] });
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      queryClient.invalidateQueries({ queryKey: ["post", postId] });
      toast.success("Reply deleted!");
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || "Failed to delete reply.");
    },
  });
};
