import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateUser, UpdateUserPayload } from "../api/updateUser";
import { toast } from "@/lib/toast";

export const useUpdateUser = (userId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: UpdateUserPayload) => updateUser(userId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userProfile", userId] });
      queryClient.invalidateQueries({ queryKey: ["authMe"] });
      toast.success("Profile updated successfully!");
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || "Failed to update profile.");
    },
  });
};
