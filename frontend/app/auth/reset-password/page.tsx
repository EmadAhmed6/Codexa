"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useParams, useSearchParams } from "next/navigation";
import { Lock, ArrowRight, ShieldCheck } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/lib/toast";

import {
  resetPasswordSchema,
  type IResetPassword,
} from "@/_features/auth/schemas/auth";
import { useResetPasswordMutation } from "@/_features/auth/hooks";
import { Text } from "@/_components/Text";
import Error from "@/_components/Error";

interface ResetPasswordPageProps {
  params?:
    | { userId?: string; token?: string }
    | Promise<{ userId?: string; token?: string }>;
}

export default function ResetPasswordPage({
  params: initialParams,
}: ResetPasswordPageProps = {}) {
  const router = useRouter();
  const routeParams = useParams();
  const searchParams = useSearchParams();

  const resolvedPropsParams =
    initialParams && typeof (initialParams as any).then === "function"
      ? React.use(initialParams as Promise<{ userId?: string; token?: string }>)
      : (initialParams as { userId?: string; token?: string });

  const userId =
    resolvedPropsParams?.userId ||
    (routeParams?.userId as string) ||
    searchParams.get("userId") ||
    searchParams.get("id") ||
    "";
  const token =
    resolvedPropsParams?.token ||
    (routeParams?.token as string) ||
    searchParams.get("token") ||
    "";

  // UX states
  const [isSuccess, setIsSuccess] = useState(false);
  const [redirectCount, setRedirectCount] = useState(5);

  const resetMutation = useResetPasswordMutation();

  const {
    register,
    handleSubmit,
    clearErrors,
    formState: { errors },
    reset,
  } = useForm<IResetPassword>({
    resolver: zodResolver(resetPasswordSchema as any),
    mode: "onBlur",
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  // Handle redirect timer
  useEffect(() => {
    if (!isSuccess) return;
    if (redirectCount <= 0) {
      router.push("/auth/login");
      return;
    }
    const timer = setTimeout(() => {
      setRedirectCount((prev) => prev - 1);
    }, 1000);
    return () => clearTimeout(timer);
  }, [isSuccess, redirectCount, router]);

  const onSubmit = (data: IResetPassword) => {
    resetMutation.mutate(
      {
        userId,
        token,
        ...data,
      },
      {
        onSuccess: () => {
          setIsSuccess(true);
          toast.success("Password changed successfully!");
          reset();
        },
        onError: (error: any) => {
          toast.error(
            error?.response?.data?.message ||
              "Failed to reset password. Please try again.",
          );
        },
      },
    );
  };

  // Success state render
  if (isSuccess) {
    return (
      <div className="w-full max-w-md glass-card p-8 md:p-10 text-center transition-all duration-300 animate-in zoom-in-95 ">
        <div className="mx-auto h-16 w-16 rounded-full bg-emerald-500/10 dark:bg-emerald-500/20 flex items-center justify-center mb-6 text-emerald-500 animate-pulse">
          <ShieldCheck className="h-10 w-10" />
        </div>

        <Text as="h1" size="2xl" font="bold" color="primary" className="mb-3">
          Password Updated
        </Text>
        <Text size="sm" color="secondary" className="leading-relaxed mb-6">
          Your password has been changed successfully. Redirecting you to
          login...
        </Text>

        {/* Redirect timer */}
        <div className="mb-6">
          <Text
            size="xs"
            color="secondary"
            className="bg-bgPrimary/50 py-2.5 px-4 rounded-xl inline-flex items-center gap-2"
          >
            <span className="h-2 w-2 rounded-full bg-primary animate-ping" />
            Redirecting you in {redirectCount}s
          </Text>
        </div>

        <Link
          href="/auth/login"
          className="inline-flex items-center gap-1.5 transition-colors group"
        >
          <Text
            as="span"
            size="sm"
            font="semiBold"
            className="text-primary hover:underline hover:text-primaryHover"
          >
            Back to login
          </Text>
          <ArrowRight className="h-4 w-4 text-primary" />
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md glass-card p-8 md:p-10 transition-all duration-300">
      {/* Title */}
      <div className="mb-8 text-center">
        <Text
          as="h1"
          size="3xl"
          font="bold"
          color="primary"
          className="tracking-tight mb-2"
        >
          New Password
        </Text>
        <Text size="sm" color="secondary">
          Choose a secure password for your account
        </Text>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* Password field */}
        <div className="space-y-1.5">
          <Label htmlFor="password">Password</Label>
          <div className="relative">
            <span className="absolute inset-y-0 left-3.5 z-10 flex items-center text-textSecondary/60 pointer-events-none">
              <Lock className="h-4.5 w-4.5" />
            </span>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              disabled={resetMutation.isPending}
              className={`pl-11 ${errors.password ? "border-destructive/60 focus-visible:ring-destructive/10" : ""}`}
              {...register("password", {
                onChange: () => clearErrors("password"),
              })}
            />
          </div>
          <Error error={errors.password?.message} />
        </div>

        {/* Confirm password field */}
        <div className="space-y-1.5">
          <Label htmlFor="confirmPassword">Confirm Password</Label>
          <div className="relative">
            <span className="absolute inset-y-0 left-3.5 z-10 flex items-center text-textSecondary/60 pointer-events-none">
              <Lock className="h-4.5 w-4.5" />
            </span>
            <Input
              id="confirmPassword"
              type="password"
              placeholder="••••••••"
              disabled={resetMutation.isPending}
              className={`pl-11 ${errors.confirmPassword ? "border-destructive/60 focus-visible:ring-destructive/10" : ""}`}
              {...register("confirmPassword", {
                onChange: () => clearErrors("confirmPassword"),
              })}
            />
          </div>
          <Error error={errors.confirmPassword?.message} />
        </div>

        {/* Submit button */}
        <Button
          type="submit"
          disabled={resetMutation.isPending}
          size="lg"
          className={"w-full"}
        >
          {resetMutation.isPending ? (
            <div className="flex items-center gap-2">
              <span className="h-4 w-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
              <Text as="span" font="semiBold" color="white">
                Updating...
              </Text>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Text as="span" font="semiBold" color="white">
                Update Password
              </Text>
              <ArrowRight className="h-4.5 w-4.5 group-hover/button:translate-x-1 transition-transform" />
            </div>
          )}
        </Button>
      </form>
    </div>
  );
}
