import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addComment } from "../api/addComment";
import { toast } from "@/lib/toast";

export const useAddComment = (postId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (commentData: { text: string; commentImageFile?: File | null }) =>
      addComment(postId, commentData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments", postId] });
      queryClient.invalidateQueries({ queryKey: ["post", postId] });
      toast.success("Comment added.");
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || "Failed to add comment.");
    },
  });
};
