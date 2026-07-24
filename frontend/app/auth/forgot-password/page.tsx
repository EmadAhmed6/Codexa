"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Mail,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  RotateCcw,
} from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

import {
  forgotPasswordSchema,
  type IForgotPassword,
} from "@/_features/auth/schemas/auth-schemas";
import { useForgotPasswordMutation } from "@/_features/auth/hooks/auth-hooks";
import { Text } from "@/_components/Text";
import Error from "@/_components/Error";

export default function ForgotPasswordPage() {
  const [isSent, setIsSent] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const [submittedEmail, setSubmittedEmail] = useState("");

  const forgotMutation = useForgotPasswordMutation();

  const {
    register,
    handleSubmit,
    clearErrors,
    formState: { errors },
    reset,
  } = useForm<IForgotPassword>({
    resolver: zodResolver(forgotPasswordSchema as any),
    defaultValues: {
      email: "",
    },
  });

  // Handle countdown for resending
  useEffect(() => {
    if (resendCooldown <= 0) return;
    const timer = setTimeout(() => {
      setResendCooldown((prev) => prev - 1);
    }, 1000);
    return () => clearTimeout(timer);
  }, [resendCooldown]);

  const onSubmit = (data: IForgotPassword) => {
    forgotMutation.mutate(data, {
      onSuccess: () => {
        setSubmittedEmail(data.email);
        setIsSent(true);
        setResendCooldown(30); // 30-second cooldown
        toast.success("Recovery link sent!");
        reset();
      },
      onError: (error: any) => {
        const errorText =
          error?.response?.data?.message ||
          "Failed to send reset link. Please try again.";
        toast.error(errorText);
      },
    });
  };

  const handleResend = () => {
    if (resendCooldown > 0) return;
    onSubmit({ email: submittedEmail });
  };

  // Render Sent Success State
  if (isSent) {
    return (
      <div className="w-full max-w-md glass-card p-8 md:p-10 text-center transition-all animate-in zoom-in-95 duration-200">
        <div className="mx-auto h-16 w-16 rounded-full bg-emerald-500/10 dark:bg-emerald-500/20 flex items-center justify-center mb-6 text-emerald-500 animate-bounce">
          <CheckCircle2 className="h-10 w-10" />
        </div>

        <Text as="h1" size="2xl" font="bold" color="primary" className="mb-3">
          Check your email
        </Text>
        <Text size="sm" color="secondary" className="leading-relaxed mb-6">
          We've sent recovery link to your inbox. Check spam if not found.{" "}
          <Text as="strong" color="primary" font="bold">
            {submittedEmail}
          </Text>
        </Text>

        {/* Resend Cooldown Option */}
        <div className="mb-8">
          {resendCooldown > 0 ? (
            <Text
              size="xs"
              color="secondary"
              className="bg-bgPrimary/40 py-2.5 px-4 rounded-xl inline-flex items-center gap-2"
            >
              <span className="h-2 w-2 rounded-full bg-primary animate-ping" />
              You can resend in {resendCooldown}s
            </Text>
          ) : (
            <Button
              onClick={handleResend}
              disabled={forgotMutation.isPending}
              variant="outline"
              size="sm"
              className="font-semibold text-primary hover:text-primaryHover border-primary/25 hover:border-primary/50 gap-1.5 focus-ring cursor-pointer"
            >
              <RotateCcw
                className={`h-3.5 w-3.5 ${forgotMutation.isPending ? "animate-spin" : ""}`}
              />
              <Text as="span" size="xs" font="semiBold">
                Resend Email
              </Text>
            </Button>
          )}
        </div>

        {/* Back link */}
        <Link
          href="/auth/login"
          className="inline-flex items-center gap-1.5 transition-colors group"
        >
          <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform text-textSecondary" />
          <Text
            as="span"
            size="sm"
            font="semiBold"
            color="secondary"
            className="group-hover:text-textPrimary"
          >
            Back to login
          </Text>
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md glass-card p-8 md:p-10 transition-all duration-300">
      {/* Back button link */}
      <Link href="/auth/login" className="inline-flex items-center gap-1 mb-6 group">
        <ArrowLeft className="h-3.5 w-3.5 group-hover:-translate-x-0.5 transition-transform text-textSecondary" />
        <Text
          as="span"
          size="xs"
          font="semiBold"
          color="secondary"
          className="group-hover:text-textPrimary"
        >
          Back to login
        </Text>
      </Link>

      {/* Title */}
      <div className="mb-8">
        <Text
          as="h1"
          size="3xl"
          font="bold"
          color="primary"
          className="tracking-tight mb-2"
        >
          Forgot Password
        </Text>
        <Text size="sm" color="secondary">
          Enter your email to receive recovery instructions
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
              disabled={forgotMutation.isPending}
              className={`pl-11 ${errors.email ? "border-destructive/60 focus-visible:ring-destructive/10" : ""}`}
              {...register("email", { onChange: () => clearErrors("email") })}
            />
          </div>
          <Error error={errors.email?.message} />
        </div>

        {/* Submit Button */}
        <Button type="submit" disabled={forgotMutation.isPending} size="lg">
          {forgotMutation.isPending ? (
            <div className="flex items-center gap-2">
              <span className="h-4 w-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
              <Text as="span" font="semiBold" color="white">
                Sending link...
              </Text>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Text as="span" font="semiBold" color="white">
                Send Email
              </Text>
              <ArrowRight className="h-4.5 w-4.5 group-hover/button:translate-x-1 transition-transform" />
            </div>
          )}
        </Button>
      </form>
    </div>
  );
}
