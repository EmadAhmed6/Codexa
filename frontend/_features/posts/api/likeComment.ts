import { axiosClient } from "@/lib/axiosClient";
import { Comment } from "../types/Post";

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
