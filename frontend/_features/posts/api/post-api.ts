import { axiosClient } from "@/lib/axiosClient";
import { Post, Comment, PostsResponse } from "../types/Post";

export interface GetPostsParams {
  page?: number;
  pageNumber?: number;
  search?: string;
  category?: string;
  userId?: string;
}

export const getAllPosts = async (params?: GetPostsParams): Promise<Post[]> => {
  const queryParams: Record<string, any> = {};
  const pNum = params?.pageNumber || params?.page || 1;
  queryParams.pageNumber = pNum;

  if (params?.category && params.category !== "All") {
    queryParams.category = params.category;
  }
  if (params?.search) {
    queryParams.search = params.search;
  }
  if (params?.userId) {
    queryParams.userId = params.userId;
  }

  const response = await axiosClient.get<any>("/posts", { params: queryParams });
  if (Array.isArray(response.data)) {
    return response.data;
  }
  return response.data?.posts || response.data?.data || [];
};

export const getPostById = async (postId: string): Promise<Post> => {
  const response = await axiosClient.get<any>(`/posts/${postId}`);
  return response.data?.data || response.data;
};

export const createPost = async (postData: {
  title: string;
  description: string;
  category: string;
  image?: { url?: string; publicId?: string };
}): Promise<Post> => {
  const response = await axiosClient.post<any>("/posts", postData);
  return response.data?.data || response.data;
};

export const updatePost = async (
  postId: string,
  postData: Partial<Post>,
): Promise<Post> => {
  const response = await axiosClient.put<any>(`/posts/${postId}`, postData);
  return response.data?.data || response.data;
};

export const deletePost = async (postId: string): Promise<any> => {
  const response = await axiosClient.delete(`/posts/${postId}`);
  return response.data;
};

export const uploadPostImage = async (
  postId: string,
  file: File,
): Promise<{ url?: string; publicId?: string }> => {
  const formData = new FormData();
  formData.append("image", file);
  const response = await axiosClient.post<any>(
    `/posts/${postId}/upload`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    },
  );
  const data = response.data?.data || response.data;
  const imageObj = data?.image || data;
  return {
    url: imageObj?.url || "",
    publicId: imageObj?.publicId || null,
  };
};

export const uploadCommentImage = async (
  postId: string,
  commentId: string,
  file: File,
): Promise<{ url?: string; publicId?: string }> => {
  const formData = new FormData();
  formData.append("image", file);
  const response = await axiosClient.post<any>(
    `/posts/${postId}/comments/${commentId}/upload`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    },
  );
  const data = response.data?.data || response.data;
  const imageObj = data?.image || data;
  return {
    url: imageObj?.url || "",
    publicId: imageObj?.publicId || null,
  };
};

export const likePost = async (postId: string): Promise<Post> => {
  // Support PUT /posts/:id/like or POST /posts/:id/like
  try {
    const response = await axiosClient.put<any>(`/posts/${postId}/like`);
    return response.data?.data || response.data;
  } catch (err) {
    const response = await axiosClient.post<any>(`/posts/${postId}/like`);
    return response.data?.data || response.data;
  }
};

export const sharePost = async (postId: string): Promise<Post> => {
  const response = await axiosClient.post<any>(`/posts/${postId}/share`, {});
  return response.data?.data || response.data;
};

export const addComment = async (
  postId: string,
  commentData: { text: string; image?: { url?: string; publicId?: string } },
): Promise<Comment> => {
  const response = await axiosClient.post<any>(
    `/posts/${postId}/comments`,
    commentData,
  );
  return response.data?.data || response.data;
};

export const getComments = async (postId: string): Promise<Comment[]> => {
  const response = await axiosClient.get<any>(`/posts/${postId}/comments`);
  if (Array.isArray(response.data)) return response.data;
  return response.data?.comments || response.data?.data || [];
};

export const updateComment = async (
  commentId: string,
  commentData: { text: string },
  postId?: string,
): Promise<Comment> => {
  const url = postId
    ? `/posts/${postId}/comments/${commentId}`
    : `/posts/comments/${commentId}`;
  const response = await axiosClient.put<any>(url, commentData);
  return response.data?.data || response.data;
};

export const deleteComment = async (
  commentId: string,
  postId?: string,
): Promise<any> => {
  const url = postId
    ? `/posts/${postId}/comments/${commentId}`
    : `/posts/comments/${commentId}`;
  const response = await axiosClient.delete(url);
  return response.data;
};

export const likeComment = async (
  commentId: string,
  postId?: string,
): Promise<Comment> => {
  if (postId) {
    try {
      const response = await axiosClient.put<any>(
        `/posts/${postId}/comments/${commentId}/like`,
      );
      return response.data?.data || response.data;
    } catch {
      // Fallback to non-postId routes if needed
    }
  }

  try {
    const response = await axiosClient.put<any>(
      `/posts/comments/${commentId}/like`,
    );
    return response.data?.data || response.data;
  } catch {
    const response = await axiosClient.post<any>(`/comments/${commentId}/like`);
    return response.data?.data || response.data;
  }
};
