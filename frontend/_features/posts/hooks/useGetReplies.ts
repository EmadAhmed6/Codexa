import { useQuery } from "@tanstack/react-query";
import { getReplies } from "../api/getReplies";

export const useGetReplies = (
  postId: string,
  commentId: string,
  enabled = true,
) => {
  return useQuery({
    queryKey: ["replies", postId, commentId],
    queryFn: () => getReplies(postId, commentId),
    enabled: enabled && !!postId && !!commentId,
  });
};
