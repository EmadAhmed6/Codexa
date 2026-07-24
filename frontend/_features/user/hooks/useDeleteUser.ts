import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteUser } from "../api/deleteUser";
import { toast } from "sonner";

export const useDeleteUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (userId: string) => deleteUser(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast.success("User account deleted.");
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || "Failed to delete user.");
    },
  });
};
