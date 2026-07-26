"use client";

import React from "react";
import Link from "next/link";
import { Mail, Lock, ArrowRight, ArrowLeft } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { loginSchema, type ILogin } from "@/_features/auth/schemas/auth";
import { useLoginMutation } from "@/_features/auth/hooks";
import Cookies from "js-cookie";
import { toast } from "@/lib/toast";
import { Text } from "@/_components/Text";
import Error from "@/_components/Error";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/context/LanguageContext";

export default function LoginPage() {
  const loginMutation = useLoginMutation();
  const router = useRouter();
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
          if (typeof window !== "undefined") {
            localStorage.setItem("token", token);
          }
          toast.success(isArabic ? "تم تسجيل الدخول بنجاح! مرحب بيك." : "Signed in successfully! Welcome back.");
          router.push("/");
          reset();
        } else {
          toast.error(isArabic ? "تم الدخول بنجاح لكن مفيش توكن." : "Login successful but token missing from server response.");
        }
      },
      onError: (err: any) => {
        toast.error(
          err?.response?.data?.message ||
            (isArabic ? "الإيميل أو الباسورد غلط. حاول تاني." : "Invalid email or password. Please try again."),
        );
      },
    });
  };

  const SubmitIcon = isArabic ? ArrowLeft : ArrowRight;

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
          <div className="relative">
            <span className="absolute inset-y-0 ltr:left-3.5 rtl:right-3.5 z-10 flex items-center text-textSecondary/60 pointer-events-none">
              <Mail className="h-4.5 w-4.5" />
            </span>
            <Input
              id="email"
              type="email"
              placeholder={t.auth.emailPlaceholder}
              disabled={loginMutation.isPending}
              className={`ltr:pl-11 rtl:pr-11 ${errors.email ? "border-destructive/60 focus-visible:ring-destructive/10" : ""}`}
              {...register("email", { onChange: () => clearErrors("email") })}
            />
          </div>
          <Error error={errors.email?.message} />
        </div>

        {/* Password Field */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">{t.auth.passwordLabel}</Label>
          </div>

          <div className="relative">
            <span className="absolute inset-y-0 ltr:left-3.5 rtl:right-3.5 z-10 flex items-center text-textSecondary/60 pointer-events-none">
              <Lock className="h-4.5 w-4.5" />
            </span>
            <Input
              id="password"
              type="password"
              placeholder={t.auth.passwordPlaceholder}
              disabled={loginMutation.isPending}
              className={`ltr:pl-11 rtl:pr-11 ${errors.password ? "border-destructive/60 focus-visible:ring-destructive/10" : ""}`}
              {...register("password", {
                onChange: () => clearErrors("password"),
              })}
            />
          </div>
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
