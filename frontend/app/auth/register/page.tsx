"use client";

import React, { useState } from "react";
import Link from "next/link";
import { User, Mail, Lock, Eye, EyeOff, ArrowRight, Briefcase } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import Cookies from "js-cookie";
import {
  registerSchema,
  type IRegister,
} from "@/_features/auth/schemas/auth-schemas";
import { useRegisterMutation } from "@/_features/auth/hooks/auth-hooks";
import { Text } from "@/_components/Text";
import Error from "@/_components/Error";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const registerMutation = useRegisterMutation();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    clearErrors,
    formState: { errors },
    reset,
  } = useForm<IRegister>({
    resolver: zodResolver(registerSchema as any),
    mode: "onBlur",
    defaultValues: {
      username: "",
      jobTitle: "",
      email: "",
      password: "",
    },
  });

  const onSubmit = (data: IRegister) => {
    registerMutation.mutate(data, {
      onSuccess: () => {
        toast.success("Account created successfully! Please verify your OTP code.");
        router.push(`/auth/verify-otp?email=${encodeURIComponent(data.email)}`);
        reset();
      },
      onError: (error: any) => {
        toast.error(
          error?.response?.data?.message ||
            "Failed to create account. Please try again.",
        );
      },
    });
  };

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
          Start Creating
        </Text>
        <Text size="sm" color="secondary">
          Join our network of writers and developers today
        </Text>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* Username Field */}
        <div className="space-y-1.5">
          <Label htmlFor="username">Username</Label>
          <div className="relative">
            <span className="absolute inset-y-0 left-3.5 flex items-center text-textSecondary/60">
              <User className="h-4.5 w-4.5" />
            </span>
            <Input
              id="username"
              type="text"
              placeholder="aura_writer"
              disabled={registerMutation.isPending}
              className={`pl-11 ${errors.username ? "border-destructive/60 focus-visible:ring-destructive/10" : ""}`}
              {...register("username", {
                onChange: () => clearErrors("username"),
              })}
            />
          </div>
          <Error error={errors.username?.message} />
        </div>

        {/* Job Title Field (Optional) */}
        <div className="space-y-1.5">
          <Label htmlFor="jobTitle">Job Title (Optional)</Label>
          <div className="relative">
            <span className="absolute inset-y-0 left-3.5 flex items-center text-textSecondary/60">
              <Briefcase className="h-4.5 w-4.5" />
            </span>
            <Input
              id="jobTitle"
              type="text"
              placeholder="e.g. Frontend Developer"
              disabled={registerMutation.isPending}
              className={`pl-11 ${(errors as any).jobTitle ? "border-destructive/60 focus-visible:ring-destructive/10" : ""}`}
              {...register("jobTitle" as any, {
                onChange: () => clearErrors("jobTitle" as any),
              })}
            />
          </div>
          <Error error={(errors as any).jobTitle?.message} />
        </div>

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
              disabled={registerMutation.isPending}
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
              disabled={registerMutation.isPending}
              className={`pl-11 pr-11 ${errors.password ? "border-destructive/60 focus-visible:ring-destructive/10" : ""}`}
              {...register("password", {
                onChange: () => clearErrors("password"),
              })}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              disabled={registerMutation.isPending}
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

        {/* Submit Button */}
        <Button
          type="submit"
          disabled={registerMutation.isPending}
          className="w-full bg-primary hover:bg-primaryHover text-primary-foreground font-semibold py-6 rounded-xl transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 cursor-pointer mt-2"
        >
          {registerMutation.isPending ? (
            <span>Creating Account...</span>
          ) : (
            <>
              <span>Create Account</span>
              <ArrowRight className="h-4 w-4" />
            </>
          )}
        </Button>
      </form>

      {/* Footer Link */}
      <div className="mt-8 text-center border-t border-borderPrimary/40 pt-6">
        <Text size="xs" color="secondary">
          Already have an account?{" "}
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
