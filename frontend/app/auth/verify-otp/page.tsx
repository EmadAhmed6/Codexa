"use client";

import React, { useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { KeyRound, ArrowRight, Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import {
  verifyOtpSchema,
  type IVerifyOtp,
} from "@/_features/auth/schemas/auth";
import { useVerifyOtpMutation } from "@/_features/auth/hooks";
import { Text } from "@/_components/Text";
import Error from "@/_components/Error";
import Link from "next/link";

function VerifyOtpForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const emailQuery = searchParams.get("email") || "";

  const verifyOtpMutation = useVerifyOtpMutation();

  const {
    register,
    handleSubmit,
    reset,
    clearErrors,
    formState: { errors },
  } = useForm<IVerifyOtp>({
    resolver: zodResolver(verifyOtpSchema as any),
    mode: "onBlur",
    defaultValues: {
      email: emailQuery,
      otp: "",
    },
  });

  const onSubmit = (data: IVerifyOtp) => {
    verifyOtpMutation.mutate(
      {
        email: data.email.trim(),
        otp: data.otp.trim(),
      },
      {
        onSuccess: (res: any) => {
          toast.success(
            res?.message ||
              res?.data?.message ||
              "Account verified successfully! Please sign in.",
          );
          router.push("/auth/login");
          reset();
        },
        onError: (err: any) => {
          toast.error(
            err?.response?.data?.message ||
              "Invalid OTP code or expired code. Please try again.",
          );
        },
      },
    );
  };

  return (
    <div className="w-full max-w-md glass-card p-8 md:p-10 transition-all duration-300">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="w-14 h-14 rounded-2xl bg-primary/10 border border-primary/20 text-primary flex items-center justify-center mx-auto mb-4">
          <KeyRound className="h-7 w-7" />
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
        {/* Email Field (hidden or readonly display) */}
        <div className="space-y-1.5">
          <Label htmlFor="email">Email address</Label>
          <Input
            id="email"
            type="email"
            placeholder="you@example.com"
            disabled={verifyOtpMutation.isPending}
            className={`bg-bgSecondary/50 ${errors.email ? "border-destructive/60 focus-visible:ring-destructive/10" : ""}`}
            {...register("email", { onChange: () => clearErrors("email") })}
          />
          <Error error={errors.email?.message} />
        </div>

        {/* OTP Field */}
        <div className="space-y-1.5">
          <Label htmlFor="otp">6-Digit OTP Code</Label>
          <div className="relative">
            <span className="absolute inset-y-0 left-3.5 flex items-center text-textSecondary/60">
              <KeyRound className="h-4.5 w-4.5" />
            </span>
            <Input
              id="otp"
              type="text"
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
          size="lg"
          className="w-full"
        >
          {verifyOtpMutation.isPending ? (
            <div className="flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin text-white" />
              <Text as="span" font="semiBold" color="white">
                Verifying OTP...
              </Text>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Text as="span" font="semiBold" color="white">
                Verify Account
              </Text>
              <ArrowRight className="h-4.5 w-4.5 group-hover/button:translate-x-1 transition-transform" />
            </div>
          )}
        </Button>
      </form>

      {/* Footer Link */}
      <div className="mt-2 text-center border-t border-borderPrimary/40 pt-4">
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
