import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateUser, UpdateUserPayload } from "../api/updateUser";
import { toast } from "@/lib/toast";

export const useUpdateUser = (userId?: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: UpdateUserPayload & { userId?: string }) => {
      const { userId: payloadUserId, ...data } = payload;
      const targetId = payloadUserId || userId;
      if (!targetId) {
        throw new Error("User ID is missing.");
      }
      return updateUser(targetId, data);
    },
    onSuccess: (_, variables) => {
      const targetId = variables.userId || userId;
      if (targetId) {
        queryClient.invalidateQueries({ queryKey: ["userProfile", targetId] });
      }
      queryClient.invalidateQueries({ queryKey: ["userProfile"] });
      queryClient.invalidateQueries({ queryKey: ["authMe"] });
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast.success("Profile updated successfully!");
    },
    onError: (err: any) => {
      const errorMsg =
        err?.response?.data?.data?.message ||
        err?.response?.data?.message ||
        err?.message ||
        "Failed to update profile.";
      toast.error(errorMsg);
    },
  });
};
