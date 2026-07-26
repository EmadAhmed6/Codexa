import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateComment } from "../api/updateComment";
import { toast } from "@/lib/toast";

export const useUpdateComment = (postId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ commentId, text, commentImageFile }: { commentId: string; text: string; commentImageFile?: File | null }) =>
      updateComment(commentId, { text, commentImageFile }, postId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments", postId] });
      toast.success("Comment updated.");
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || "Failed to update comment.");
    },
  });
};
