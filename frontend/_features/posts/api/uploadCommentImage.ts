import { axiosClient } from "@/lib/axiosClient";

export const uploadCommentImage = async (
  postId: string,
  commentId: string,
  file: File,
): Promise<{ url?: string; publicId?: string }> => {
  const formData = new FormData();
  formData.append("image", file);
  const response = await axiosClient.post<any>(
    `/posts/${postId}/comments/${commentId}/upload`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    },
  );
  const data = response.data?.data || response.data;
  const imageObj = data?.image || data;
  return {
    url: imageObj?.url || "",
    publicId: imageObj?.publicId || null,
  };
};
