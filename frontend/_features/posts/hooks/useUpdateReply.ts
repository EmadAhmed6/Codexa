import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateReply } from "../api/updateReply";
import { toast } from "sonner";

export const useUpdateReply = (postId: string, commentId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { replyCommentId: string; text: string; replyImageFile?: File | null }) =>
      updateReply({ postId, commentId, ...data }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["replies", postId, commentId] });
      toast.success("Reply updated!");
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || "Failed to update reply.");
    },
  });
};
