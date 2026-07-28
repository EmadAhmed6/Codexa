import { useMutation } from "@tanstack/react-query";
import { resendOtp } from "../api/resendOtp";
import { toast } from "@/lib/toast";

export const useResendOtpMutation = () => {
  return useMutation({
    mutationFn: (email: string) => resendOtp(email),
    onSuccess: (data: any) => {
      toast.success(
        data?.message || "Verification code resent successfully to your email!",
      );
    },
    onError: (err: any) => {
      toast.error(
        err?.response?.data?.message || "Failed to resend verification code.",
      );
    },
  });
};
