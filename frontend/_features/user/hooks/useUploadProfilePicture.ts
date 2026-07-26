import { useMutation, useQueryClient } from "@tanstack/react-query";
import { uploadProfilePicture } from "../api/uploadProfilePicture";
import { toast } from "@/lib/toast";

export const useUploadProfilePicture = (userId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (file: File) => uploadProfilePicture(userId, file),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userProfile", userId] });
      queryClient.invalidateQueries({ queryKey: ["authMe"] });
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      toast.success("Profile picture updated!");
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || "Failed to upload profile picture.");
    },
  });
};
