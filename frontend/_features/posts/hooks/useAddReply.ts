import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addReply } from "../api/addReply";
import { toast } from "@/lib/toast";

export const useAddReply = (postId: string, commentId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { text: string; replyImageFile?: File | null }) =>
      addReply({ postId, commentId, ...data }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["replies", postId, commentId] });
      queryClient.invalidateQueries({ queryKey: ["comments", postId] });
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      queryClient.invalidateQueries({ queryKey: ["post", postId] });
      toast.success("Reply posted successfully!");
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || "Failed to post reply.");
    },
  });
};
