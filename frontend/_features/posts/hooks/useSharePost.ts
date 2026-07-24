import { useMutation, useQueryClient } from "@tanstack/react-query";
import { sharePost } from "../api/sharePost";
import { toast } from "sonner";

export const useSharePost = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: sharePost,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      queryClient.invalidateQueries({ queryKey: ["userProfile"] });
      queryClient.invalidateQueries({ queryKey: ["authMe"] });
      toast.success("Post shared to your feed!");
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || "Could not share post.");
    },
  });
};
