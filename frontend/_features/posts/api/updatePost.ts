import { axiosClient } from "@/lib/axiosClient";
import { Post } from "../types/Post";

export const updatePost = async (
  postId: string,
  postData: Partial<Post> & { postImageFile?: File | null },
): Promise<Post> => {
  const { postImageFile, ...data } = postData;
  let payload: any = data;
  let headers = {};

  if (postImageFile) {
    const formData = new FormData();
    if (data.title) formData.append("title", data.title);
    formData.append("postImage", postImageFile);
    payload = formData;
    headers = { "Content-Type": "multipart/form-data" };
  }

  const response = await axiosClient.put<any>(`/posts/${postId}`, payload, { headers });
  return response.data?.data || response.data;
};
