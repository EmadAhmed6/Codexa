import { useQuery } from "@tanstack/react-query";
import { getPostById } from "../api/getPostById";

export const useGetPostById = (postId: string) => {
  return useQuery({
    queryKey: ["post", postId],
    queryFn: () => getPostById(postId),
    enabled: !!postId,
  });
};
