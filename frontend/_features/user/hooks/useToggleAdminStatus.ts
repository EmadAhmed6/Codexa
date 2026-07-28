import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toggleAdminStatus } from "../api/toggleAdminStatus";
import { toast } from "sonner";

export const useToggleAdminStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userId: string) => toggleAdminStatus(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
    onError: (error: any) => {
      const message =
        error?.response?.data?.data?.message ||
        error?.response?.data?.message ||
        "Failed to toggle admin status";
      toast.error(message);
    },
  });
};
