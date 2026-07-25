"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Mail, Lock, Eye, EyeOff, ArrowRight } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { loginSchema, type ILogin } from "@/_features/auth/schemas/auth";
import { useLoginMutation } from "@/_features/auth/hooks";
import Cookies from "js-cookie";
import { toast } from "sonner";
import { Text } from "@/_components/Text";
import Error from "@/_components/Error";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const loginMutation = useLoginMutation();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    reset,
    clearErrors,
    formState: { errors },
  } = useForm<ILogin>({
    resolver: zodResolver(loginSchema as any),
    mode: "onBlur",
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = (data: ILogin) => {
    loginMutation.mutate(data, {
      onSuccess: (res) => {
        const token = res.data?.token || res.token;
        if (token) {
          Cookies.set("token", token, { expires: 7, path: "/" });
          if (typeof window !== "undefined") {
            localStorage.setItem("token", token);
          }
          toast.success("Signed in successfully! Welcome back.");
          router.push("/");
          reset();
        } else {
          toast.error("Login successful but token missing from server response.");
        }
      },
      onError: (err: any) => {
        toast.error(
          err?.response?.data?.message ||
            "Invalid email or password. Please try again.",
        );
      },
    });
  };

  return (
    <div className="w-full max-w-md glass-card p-8 md:p-10 transition-all duration-300">
      {/* Header */}
      <div className="text-center mb-8">
        <Text
          as="h1"
          size="3xl"
          font="bold"
          color="primary"
          className="tracking-tight mb-2"
        >
          Welcome Back
        </Text>
        <Text size="sm" color="secondary">
          Enter your credentials to access your account
        </Text>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* Email Field */}
        <div className="space-y-1.5">
          <Label htmlFor="email">Email address</Label>
          <div className="relative">
            <span className="absolute inset-y-0 left-3.5 flex items-center text-textSecondary/60">
              <Mail className="h-4.5 w-4.5" />
            </span>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              disabled={loginMutation.isPending}
              className={`pl-11 ${errors.email ? "border-destructive/60 focus-visible:ring-destructive/10" : ""}`}
              {...register("email", { onChange: () => clearErrors("email") })}
            />
          </div>
          <Error error={errors.email?.message} />
        </div>

        {/* Password Field */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Password</Label>
          </div>

          <div className="relative">
            <span className="absolute inset-y-0 left-3.5 flex items-center text-textSecondary/60">
              <Lock className="h-4.5 w-4.5" />
            </span>
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              disabled={loginMutation.isPending}
              className={`pl-11 pr-11 ${errors.password ? "border-destructive/60 focus-visible:ring-destructive/10" : ""}`}
              {...register("password", {
                onChange: () => clearErrors("password"),
              })}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-3 flex items-center text-textSecondary hover:text-textPrimary transition-colors cursor-pointer"
              aria-label="Toggle Password Visibility"
            >
              {showPassword ? (
                <EyeOff className="h-4.5 w-4.5" />
              ) : (
                <Eye className="h-4.5 w-4.5" />
              )}
            </button>
          </div>
          <Error error={errors.password?.message} />
        </div>

        {/* Forgot Password Link */}
        <div className="flex justify-end">
          <Link
            href="/auth/forgot-password"
            className="text-xs font-semibold text-primary hover:underline"
          >
            Forgot password?
          </Link>
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          disabled={loginMutation.isPending}
          size="lg"
          className="w-full"
        >
          {loginMutation.isPending ? (
            <div className="flex items-center gap-2">
              <span className="h-4 w-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
              <Text as="span" font="semiBold" color="white">
                Signing In...
              </Text>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Text as="span" font="semiBold" color="white">
                Sign In
              </Text>
              <ArrowRight className="h-4.5 w-4.5 group-hover/button:translate-x-1 transition-transform" />
            </div>
          )}
        </Button>
      </form>

      {/* Switch to register link */}
      <div className="mt-2 text-center border-t border-borderPrimary/40 pt-4">
        <Text size="xs" color="secondary">
          Don't have an account?{" "}
          <Link
            href="/auth/register"
            className="text-primary hover:underline font-semibold"
          >
            Create one now
          </Link>
        </Text>
      </div>
    </div>
  );
}
