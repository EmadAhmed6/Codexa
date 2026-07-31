"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, ArrowLeft } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { loginSchema, type ILogin } from "@/_features/auth/schemas/auth";
import { useLoginMutation } from "@/_features/auth/hooks";
import { useQueryClient } from "@tanstack/react-query";
import Cookies from "js-cookie";
import { toast } from "@/lib/toast";
import { Text } from "@/_components/Text";
import Error from "@/_components/Error";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/context/LanguageContext";

export default function LoginPage() {
  const loginMutation = useLoginMutation();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { t, isArabic } = useLanguage();

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
          queryClient.invalidateQueries({ queryKey: ["authMe"] });
          toast.success(
            isArabic
              ? "تم تسجيل الدخول بنجاح! مرحب بيك."
              : "Signed in successfully! Welcome back.",
          );
          router.refresh();
          router.push("/");
          reset();
        } else {
          toast.error(
            isArabic
              ? "تم الدخول بنجاح لكن مفيش توكن."
              : "Login successful but token missing from server response.",
          );
        }
      },
      onError: (err: any) => {
        const errorMsg =
          err?.response?.data?.message ||
          (isArabic
            ? "الإيميل أو الباسورد غلط. حاول تاني."
            : "Invalid email or password. Please try again.");

        toast.error(errorMsg);

        if (
          err?.response?.status === 403 ||
          err?.response?.data?.isVerified === false ||
          errorMsg.toLowerCase().includes("verify")
        ) {
          const userEmail = data.email.trim();
          setTimeout(() => {
            router.push(
              `/auth/verify-otp?email=${encodeURIComponent(userEmail)}`,
            );
          }, 1200);
        }
      },
    });
  };

  const SubmitIcon = isArabic ? ArrowLeft : ArrowRight;

  return (
    <div className="w-full max-w-md glass-card p-8 md:p-10 transition-all duration-300">
      {/* Header */}
      <div className="text-center mb-8 flex flex-col items-center">
        <Link href="/" className="mb-4 inline-block group">
          <Image
            src="/logo.png"
            alt="Fluxion Logo"
            width={48}
            height={48}
            className="mx-auto group-hover:scale-105 transition-transform"
          />
        </Link>
        <Text as="h1" size="3xl" font="bold" color="primary" className=" mb-2">
          {t.auth.welcomeBack}
        </Text>
        <Text size="sm" color="secondary">
          {t.auth.welcomeBackDesc}
        </Text>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* Email Field */}
        <div className="space-y-1.5">
          <Label htmlFor="email">{t.auth.emailLabel}</Label>
          <Input
            id="email"
            type="email"
            icon="mail"
            placeholder={t.auth.emailPlaceholder}
            disabled={loginMutation.isPending}
            hasError={!!errors.email}
            {...register("email", { onChange: () => clearErrors("email") })}
          />
          <Error error={errors.email?.message} />
        </div>

        {/* Password Field */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">{t.auth.passwordLabel}</Label>
          </div>

          <Input
            id="password"
            type="password"
            icon="lock"
            placeholder={t.auth.passwordPlaceholder}
            disabled={loginMutation.isPending}
            hasError={!!errors.password}
            {...register("password", {
              onChange: () => clearErrors("password"),
            })}
          />
          <Error error={errors.password?.message} />
        </div>

        {/* Forgot Password Link */}
        <div className="flex justify-end">
          <Link
            href="/auth/forgot-password"
            className="text-xs font-semibold text-primary hover:underline"
          >
            {t.auth.forgotPasswordLink}
          </Link>
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          disabled={loginMutation.isPending}
          size="lg"
          className="w-full cursor-pointer"
        >
          {loginMutation.isPending ? (
            <div className="flex items-center gap-2">
              <span className="h-4 w-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
              <Text as="span" font="semiBold" color="white">
                {t.auth.signingInBtn}
              </Text>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Text as="span" font="semiBold" color="white">
                {t.auth.signInBtn}
              </Text>
              <SubmitIcon className="h-4.5 w-4.5 group-hover/button:translate-x-1 transition-transform" />
            </div>
          )}
        </Button>
      </form>

      {/* Switch to register link */}
      <div className="mt-2 text-center border-t border-borderPrimary/40 pt-4">
        <Text size="xs" color="secondary">
          {t.auth.dontHaveAccount}{" "}
          <Link
            href="/auth/register"
            className="text-primary hover:underline font-semibold"
          >
            {t.auth.createOneNow}
          </Link>
        </Text>
      </div>
    </div>
  );
}
