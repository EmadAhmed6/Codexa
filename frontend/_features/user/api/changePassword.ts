import { axiosClient } from "@/lib/axiosClient";

export interface ChangePasswordPayload {
  currentPassword: string;
  newPassword: string;
}

export interface ChangePasswordResponse {
  success: boolean;
  message: string;
  data?: {
    message?: string;
  };
}

export const changePassword = async (
  userId: string,
  data: ChangePasswordPayload,
): Promise<ChangePasswordResponse> => {
  const response = await axiosClient.post<ChangePasswordResponse>(
    `/users/${userId}/change-password`,
    data,
  );
  return response.data;
};
