import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createPost } from "../api/createPost";
import { toast } from "sonner";

export const useCreatePost = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createPost,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      toast.success("Post published successfully!");
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || "Failed to publish post.");
    },
  });
};
