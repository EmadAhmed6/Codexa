import { useQueryClient } from "@tanstack/react-query";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { toast } from "@/lib/toast";

export const useLogout = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  const logout = () => {
    Cookies.remove("token", { path: "/" });
    Cookies.remove("token");
    queryClient.removeQueries({ queryKey: ["authMe"] });
    toast.success("Signed out successfully!");
    router.refresh();
    router.push("/auth/login");
  };

  return logout;
};
