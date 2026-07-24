"use client";

import React, { Suspense } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { KeyRound, Mail, ArrowRight, ShieldCheck, Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import {
  verifyOtpSchema,
  type IVerifyOtp,
} from "@/_features/auth/schemas/auth-schemas";
import { useVerifyOtpMutation } from "@/_features/auth/hooks/auth-hooks";
import { Text } from "@/_components/Text";
import Error from "@/_components/Error";

function VerifyOtpForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const emailParam = searchParams.get("email") || "";

  const verifyOtpMutation = useVerifyOtpMutation();

  const {
    register,
    handleSubmit,
    clearErrors,
    formState: { errors },
    reset,
  } = useForm<IVerifyOtp>({
    resolver: zodResolver(verifyOtpSchema as any),
    mode: "onBlur",
    defaultValues: {
      email: emailParam,
      otp: "",
    },
  });

  const onSubmit = (data: IVerifyOtp) => {
    verifyOtpMutation.mutate(
      {
        email: data.email.trim(),
        otp: String(data.otp).trim(),
      },
      {
        onSuccess: (res: any) => {
          toast.success(
            res?.message || res?.data?.message || "Account verified successfully! Please sign in.",
          );
          router.push("/auth/login");
          reset();
        },
        onError: (error: any) => {
          toast.error(
            error?.response?.data?.message ||
              "Invalid or expired OTP token. Please try again.",
          );
        },
      },
    );
  };

  return (
    <div className="w-full max-w-md glass-card p-8 md:p-10 transition-all duration-300">
      {/* Top Header Icon */}
      <div className="mb-6 text-center">
        <div className="mx-auto w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary mb-4">
          <KeyRound className="h-8 w-8" />
        </div>
        <Text
          as="h1"
          size="3xl"
          font="bold"
          color="primary"
          className="tracking-tight mb-2"
        >
          Verify OTP Code
        </Text>
        <Text size="sm" color="secondary">
          Enter the 6-digit verification code sent to your email
        </Text>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* Email Field */}
        <div className="space-y-1.5">
          <Label htmlFor="email">Email Address</Label>
          <div className="relative">
            <span className="absolute inset-y-0 left-3.5 flex items-center text-textSecondary/60">
              <Mail className="h-4.5 w-4.5" />
            </span>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              disabled={verifyOtpMutation.isPending}
              className={`pl-11 ${errors.email ? "border-destructive/60 focus-visible:ring-destructive/10" : ""}`}
              {...register("email", {
                onChange: () => clearErrors("email"),
              })}
            />
          </div>
          <Error error={errors.email?.message} />
        </div>

        {/* OTP Code Field */}
        <div className="space-y-1.5">
          <Label htmlFor="otp">6-Digit OTP Code</Label>
          <div className="relative">
            <span className="absolute inset-y-0 left-3.5 flex items-center text-textSecondary/60">
              <ShieldCheck className="h-4.5 w-4.5" />
            </span>
            <Input
              id="otp"
              type="text"
              inputMode="numeric"
              placeholder="123456"
              maxLength={6}
              disabled={verifyOtpMutation.isPending}
              className={`pl-11 tracking-widest font-mono text-base ${errors.otp ? "border-destructive/60 focus-visible:ring-destructive/10" : ""}`}
              {...register("otp", {
                onChange: () => clearErrors("otp"),
              })}
            />
          </div>
          <Error error={errors.otp?.message} />
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          disabled={verifyOtpMutation.isPending}
          className="w-full bg-primary hover:bg-primaryHover text-primary-foreground font-semibold py-6 rounded-xl transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 cursor-pointer mt-2"
        >
          {verifyOtpMutation.isPending ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Verifying OTP...</span>
            </>
          ) : (
            <>
              <span>Verify Account</span>
              <ArrowRight className="h-4 w-4" />
            </>
          )}
        </Button>
      </form>

      {/* Footer Link */}
      <div className="mt-8 text-center border-t border-borderPrimary/40 pt-6">
        <Text size="xs" color="secondary">
          Already verified?{" "}
          <Link
            href="/auth/login"
            className="text-primary hover:underline font-semibold"
          >
            Sign in
          </Link>
        </Text>
      </div>
    </div>
  );
}

export default function VerifyOtpPage() {
  return (
    <Suspense
      fallback={
        <div className="w-full max-w-md glass-card p-8 text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
        </div>
      }
    >
      <VerifyOtpForm />
    </Suspense>
  );
}
