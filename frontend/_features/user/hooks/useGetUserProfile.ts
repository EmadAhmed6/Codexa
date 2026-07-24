import { useQuery } from "@tanstack/react-query";
import { getUserById } from "../api/getUserById";

export const useGetUserProfile = (userId: string) => {
  return useQuery({
    queryKey: ["userProfile", userId],
    queryFn: () => getUserById(userId),
    enabled: !!userId,
  });
};
