import { useQuery } from "@tanstack/react-query";
import { getAuthMe } from "../api/getAuthMe";
import { AuthMe } from "../types/auth";
import { AxiosError } from "axios";
import Cookies from "js-cookie";

export const useGetAuthMeQuery = () => {
  const token = Cookies.get("token");
  return useQuery<AuthMe, AxiosError>({
    queryKey: ["authMe"],
    queryFn: getAuthMe,
    enabled: !!token,
  });
};
