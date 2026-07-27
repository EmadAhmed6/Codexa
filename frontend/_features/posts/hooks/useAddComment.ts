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
      queryClient.invalidateQueries({ queryKey: ["posts"] });

      queryClient.setQueryData(["post", postId], (oldPost: any) => {
        if (!oldPost) return oldPost;
        return {
          ...oldPost,
          commentsCount: (oldPost.commentsCount || 0) + 1,
        };
      });

      queryClient.setQueriesData({ queryKey: ["posts"] }, (oldData: any) => {
        if (!oldData) return oldData;
        if (oldData.pages) {
          return {
            ...oldData,
            pages: oldData.pages.map((page: any) => ({
              ...page,
              data: page.data?.map((p: any) =>
                p._id === postId ? { ...p, commentsCount: (p.commentsCount || 0) + 1 } : p
              ),
              posts: page.posts?.map((p: any) =>
                p._id === postId ? { ...p, commentsCount: (p.commentsCount || 0) + 1 } : p
              ),
            })),
          };
        }
        if (Array.isArray(oldData)) {
          return oldData.map((p: any) =>
            p._id === postId ? { ...p, commentsCount: (p.commentsCount || 0) + 1 } : p
          );
        }
        if (oldData.posts && Array.isArray(oldData.posts)) {
          return {
            ...oldData,
            posts: oldData.posts.map((p: any) =>
              p._id === postId ? { ...p, commentsCount: (p.commentsCount || 0) + 1 } : p
            ),
          };
        }
        if (oldData.data && Array.isArray(oldData.data)) {
          return {
            ...oldData,
            data: oldData.data.map((p: any) =>
              p._id === postId ? { ...p, commentsCount: (p.commentsCount || 0) + 1 } : p
            ),
          };
        }
        return oldData;
      });

      toast.success("Comment added.");
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || "Failed to add comment.");
    },
  });
};
