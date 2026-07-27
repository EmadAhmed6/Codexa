import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteComment } from "../api/deleteComment";
import { toast } from "@/lib/toast";

export const useDeleteComment = (postId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (commentId: string) => deleteComment(commentId, postId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments", postId] });
      queryClient.invalidateQueries({ queryKey: ["post", postId] });
      queryClient.invalidateQueries({ queryKey: ["posts"] });

      queryClient.setQueryData(["post", postId], (oldPost: any) => {
        if (!oldPost) return oldPost;
        return {
          ...oldPost,
          commentsCount: Math.max(0, (oldPost.commentsCount || 0) - 1),
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
                p._id === postId ? { ...p, commentsCount: Math.max(0, (p.commentsCount || 0) - 1) } : p
              ),
              posts: page.posts?.map((p: any) =>
                p._id === postId ? { ...p, commentsCount: Math.max(0, (p.commentsCount || 0) - 1) } : p
              ),
            })),
          };
        }
        if (Array.isArray(oldData)) {
          return oldData.map((p: any) =>
            p._id === postId ? { ...p, commentsCount: Math.max(0, (p.commentsCount || 0) - 1) } : p
          );
        }
        if (oldData.posts && Array.isArray(oldData.posts)) {
          return {
            ...oldData,
            posts: oldData.posts.map((p: any) =>
              p._id === postId ? { ...p, commentsCount: Math.max(0, (p.commentsCount || 0) - 1) } : p
            ),
          };
        }
        if (oldData.data && Array.isArray(oldData.data)) {
          return {
            ...oldData,
            data: oldData.data.map((p: any) =>
              p._id === postId ? { ...p, commentsCount: Math.max(0, (p.commentsCount || 0) - 1) } : p
            ),
          };
        }
        return oldData;
      });

      toast.success("Comment deleted.");
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || "Failed to delete comment.");
    },
  });
};
