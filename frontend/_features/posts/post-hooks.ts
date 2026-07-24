import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getAllPosts,
  getPostById,
  createPost,
  updatePost,
  deletePost,
  likePost,
  sharePost,
  addComment,
  getComments,
  updateComment,
  deleteComment,
  likeComment,
  GetPostsParams,
} from "./api/post-api";
import { toast } from "sonner";

export const useGetPosts = (params?: GetPostsParams) => {
  return useQuery({
    queryKey: ["posts", params],
    queryFn: () => getAllPosts(params),
  });
};

export const useGetPostById = (postId: string) => {
  return useQuery({
    queryKey: ["post", postId],
    queryFn: () => getPostById(postId),
    enabled: !!postId,
  });
};

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
      toast.success("Post updated!");
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || "Failed to update post.");
    },
  });
};

export const useDeletePost = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deletePost,
    onSuccess: (_, postId) => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      queryClient.invalidateQueries({ queryKey: ["post", postId] });
      queryClient.invalidateQueries({ queryKey: ["userProfile"] });
      queryClient.invalidateQueries({ queryKey: ["authMe"] });
      toast.success("Post deleted successfully.");
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || "Failed to delete post.");
    },
  });
};

export const useLikePost = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: likePost,
    onSuccess: (data, postId) => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      queryClient.invalidateQueries({ queryKey: ["post", postId] });
      toast.success("Post reaction updated!");
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || "Could not update post reaction.");
    },
  });
};

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

export const useGetComments = (postId: string) => {
  return useQuery({
    queryKey: ["comments", postId],
    queryFn: () => getComments(postId),
    enabled: !!postId,
  });
};

export const useAddComment = (postId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (commentData: { text: string; image?: any }) =>
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

export const useUpdateComment = (postId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ commentId, text }: { commentId: string; text: string }) =>
      updateComment(commentId, { text }, postId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments", postId] });
      toast.success("Comment updated.");
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || "Failed to update comment.");
    },
  });
};

export const useDeleteComment = (postId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (commentId: string) => deleteComment(commentId, postId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments", postId] });
      queryClient.invalidateQueries({ queryKey: ["post", postId] });
      toast.success("Comment deleted.");
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || "Failed to delete comment.");
    },
  });
};

export const useLikeComment = (postId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (commentId: string) => likeComment(commentId, postId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments", postId] });
      toast.success("Comment reaction updated!");
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || "Failed to react to comment.");
    },
  });
};
