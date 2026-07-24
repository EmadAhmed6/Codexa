import { axiosClient } from "@/lib/axiosClient";
import { Post } from "../types/Post";

export const createPost = async (postData: {
  title: string;
  description: string;
  category: string;
  image?: { url?: string; publicId?: string };
}): Promise<Post> => {
  const response = await axiosClient.post<any>("/posts", postData);
  return response.data?.data || response.data;
};
