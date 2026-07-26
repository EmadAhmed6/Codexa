import { axiosClient } from "@/lib/axiosClient";

export const uploadPostImage = async (
  postId: string,
  file: File,
): Promise<{ url?: string; publicId?: string }> => {
  const formData = new FormData();
  formData.append("postImage", file);
  const response = await axiosClient.put<any>(
    `/posts/${postId}`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    },
  );
  const data = response.data?.data || response.data;
  const imageObj = data?.postImage || data?.image || data;
  return {
    url: imageObj?.url || "",
    publicId: imageObj?.publicId || null,
  };
};
