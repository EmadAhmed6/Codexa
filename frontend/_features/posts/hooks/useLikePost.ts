import { useMutation, useQueryClient } from "@tanstack/react-query";
import { likePost } from "../api/likePost";
import { toast } from "sonner";

export const useLikePost = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: likePost,
    onSuccess: (data, postId) => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      queryClient.invalidateQueries({ queryKey: ["post", postId] });
      queryClient.invalidateQueries({ queryKey: ["userProfile"] });
      queryClient.invalidateQueries({ queryKey: ["authMe"] });
      toast.success("Post reaction updated!");
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || "Could not update post reaction.");
    },
  });
};
