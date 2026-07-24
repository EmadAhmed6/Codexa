import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getAllUsers,
  getUserById,
  updateUser,
  uploadProfilePicture,
  deleteUser,
  UpdateUserPayload,
} from "./api/user-api";
import { toast } from "sonner";

export const useGetAllUsers = () => {
  return useQuery({
    queryKey: ["users"],
    queryFn: getAllUsers,
  });
};

export const useGetUserProfile = (userId: string) => {
  return useQuery({
    queryKey: ["userProfile", userId],
    queryFn: () => getUserById(userId),
    enabled: !!userId,
  });
};

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
