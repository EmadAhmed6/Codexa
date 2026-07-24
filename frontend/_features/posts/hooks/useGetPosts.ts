import { useQuery } from "@tanstack/react-query";
import { getAllPosts, GetPostsParams } from "../api/getAllPosts";

export const useGetPosts = (params?: GetPostsParams) => {
  return useQuery({
    queryKey: ["posts", params],
    queryFn: () => getAllPosts(params),
  });
};
