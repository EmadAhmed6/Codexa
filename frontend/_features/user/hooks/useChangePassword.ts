import { useMutation, useQueryClient } from "@tanstack/react-query";
import { changePassword, ChangePasswordPayload } from "../api/changePassword";
import { toast } from "@/lib/toast";

export const useChangePassword = (userId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: ChangePasswordPayload) => changePassword(userId, data),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["userProfile", userId] });
      queryClient.invalidateQueries({ queryKey: ["authMe"] });
      const successMsg = res?.data?.message || res?.message || "Password changed successfully!";
      toast.success(successMsg);
    },
    onError: (err: any) => {
      const errorMsg =
        err?.response?.data?.data?.message ||
        err?.response?.data?.message ||
        "Failed to change password.";
      toast.error(errorMsg);
    },
  });
};
