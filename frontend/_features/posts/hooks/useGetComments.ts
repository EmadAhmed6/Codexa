import { useQuery } from "@tanstack/react-query";
import { getComments } from "../api/getComments";

export const useGetComments = (postId: string) => {
  return useQuery({
    queryKey: ["comments", postId],
    queryFn: () => getComments(postId),
    enabled: !!postId,
  });
};
