import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updatePost } from "../api/updatePost";
import { appToast as toast } from "@/lib/toast";

export const useUpdatePost = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ postId, postData }: { postId: string; postData: any }) =>
      updatePost(postId, postData),
    onSuccess: (data, variables) => {
      if (data) {
        queryClient.setQueryData(["post", variables.postId], data);
      }
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      queryClient.invalidateQueries({ queryKey: ["post", variables.postId] });
      queryClient.invalidateQueries({ queryKey: ["userProfile"] });
      queryClient.invalidateQueries({ queryKey: ["authMe"] });
      toast.success("Post updated successfully!");
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || "Failed to update post.");
    },
  });
};
