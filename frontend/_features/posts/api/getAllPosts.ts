import { axiosClient } from "@/lib/axiosClient";
import { Post } from "../types/Post";

export interface GetPostsParams {
  page?: number;
  pageNumber?: number;
  search?: string;
  category?: string;
  userId?: string;
}

export const getAllPosts = async (params?: GetPostsParams): Promise<Post[]> => {
  const queryParams: Record<string, any> = {};
  const pNum = params?.pageNumber || params?.page || 1;
  queryParams.pageNumber = pNum;

  if (params?.category && params.category !== "All") {
    queryParams.category = params.category;
  }
  if (params?.search) {
    queryParams.search = params.search;
  }
  if (params?.userId) {
    queryParams.userId = params.userId;
  }

  const response = await axiosClient.get<any>("/posts", { params: queryParams });
  if (Array.isArray(response.data)) {
    return response.data;
  }
  return response.data?.posts || response.data?.data || [];
};
