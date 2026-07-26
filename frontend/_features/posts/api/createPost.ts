import { axiosClient } from "@/lib/axiosClient";
import { Post } from "../types/Post";

export const createPost = async (postData: {
  title: string;
  description: string;
  category: string;
  postImageFile?: File | null;
}): Promise<Post> => {
  let payload: any = {
    title: postData.title,
    description: postData.description,
    category: postData.category,
  };
  let headers = {};

  if (postData.postImageFile) {
    const formData = new FormData();
    formData.append("title", postData.title);
    formData.append("description", postData.description);
    formData.append("category", postData.category);
    formData.append("postImage", postData.postImageFile);
    payload = formData;
    headers = { "Content-Type": "multipart/form-data" };
  }

  const response = await axiosClient.post<any>("/posts", payload, { headers });
  return response.data?.data || response.data;
};
