"use client";

import React from "react";
import Link from "next/link";
import { User, Mail, Lock, ArrowRight, Briefcase } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { registerSchema, type IRegister } from "@/_features/auth/schemas/auth";
import { useRegisterMutation } from "@/_features/auth/hooks";
import { Text } from "@/_components/Text";
import Error from "@/_components/Error";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const registerMutation = useRegisterMutation();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    reset,
    clearErrors,
    formState: { errors },
  } = useForm<IRegister>({
    resolver: zodResolver(registerSchema as any),
    mode: "onBlur",
    defaultValues: {
      username: "",
      email: "",
      password: "",
      jobTitle: "",
    },
  });

  const onSubmit = (data: IRegister) => {
    registerMutation.mutate(data, {
      onSuccess: () => {
        toast.success(
          "Account created successfully! Please verify your OTP code.",
        );
        router.push(`/auth/verify-otp?email=${encodeURIComponent(data.email)}`);
        reset();
      },
      onError: (err: any) => {
        toast.error(
          err?.response?.data?.message ||
            "Error registering account. Email or username might already exist.",
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
            <span className="absolute inset-y-0 left-3.5 z-10 flex items-center text-textSecondary/60 pointer-events-none">
              <User className="h-4.5 w-4.5" />
            </span>
            <Input
              id="username"
              type="text"
              placeholder="emad_121"
              disabled={registerMutation.isPending}
              className={`pl-11 ${errors.username ? "border-destructive/60 focus-visible:ring-destructive/10" : ""}`}
              {...register("username", {
                onChange: () => clearErrors("username"),
              })}
            />
          </div>
          <Error error={errors.username?.message} />
        </div>

        {/* Email Field */}
        <div className="space-y-1.5">
          <Label htmlFor="email">Email address</Label>
          <div className="relative">
            <span className="absolute inset-y-0 left-3.5 z-10 flex items-center text-textSecondary/60 pointer-events-none">
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
        {/* Job Title Field (Optional) */}
        <div className="space-y-1.5">
          <Label htmlFor="jobTitle">Job Title (Optional)</Label>
          <div className="relative">
            <span className="absolute inset-y-0 left-3.5 z-10 flex items-center text-textSecondary/60 pointer-events-none">
              <Briefcase className="h-4.5 w-4.5" />
            </span>
            <Input
              id="jobTitle"
              type="text"
              placeholder="Frontend Developer"
              disabled={registerMutation.isPending}
              className="pl-11"
              {...register("jobTitle" as any)}
            />
          </div>
        </div>
        {/* Password Field */}
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
              disabled={registerMutation.isPending}
              className={`pl-11 ${errors.password ? "border-destructive/60 focus-visible:ring-destructive/10" : ""}`}
              {...register("password", {
                onChange: () => clearErrors("password"),
              })}
            />
          </div>
          <Error error={errors.password?.message} />
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          disabled={registerMutation.isPending}
          size="lg"
          className="w-full"
        >
          {registerMutation.isPending ? (
            <div className="flex items-center gap-2">
              <span className="h-4 w-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
              <Text as="span" font="semiBold" color="white">
                Creating Account...
              </Text>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Text as="span" font="semiBold" color="white">
                Create Account
              </Text>
              <ArrowRight className="h-4.5 w-4.5 group-hover/button:translate-x-1 transition-transform" />
            </div>
          )}
        </Button>
      </form>

      {/* Footer Link */}
      <div className="mt-2 text-center border-t border-borderPrimary/40 pt-4">
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
