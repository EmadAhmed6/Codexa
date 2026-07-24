import { useQueryClient } from "@tanstack/react-query";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export const useLogout = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  const logout = () => {
    Cookies.remove("token", { path: "/" });
    if (typeof window !== "undefined") {
      localStorage.removeItem("token");
    }
    queryClient.removeQueries({ queryKey: ["authMe"] });
    toast.success("Signed out successfully!");
    router.push("/auth/login");
  };

  return logout;
};
