"use client";

import React from "react";
import Link from "next/link";
import { User, Mail, Lock, ArrowRight, ArrowLeft, Briefcase } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/lib/toast";
import { registerSchema, type IRegister } from "@/_features/auth/schemas/auth";
import { useRegisterMutation } from "@/_features/auth/hooks";
import { Text } from "@/_components/Text";
import Error from "@/_components/Error";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/context/LanguageContext";

export default function RegisterPage() {
  const registerMutation = useRegisterMutation();
  const router = useRouter();
  const { t, isArabic } = useLanguage();

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
          isArabic ? "تم إنشاء الحساب بنجاح! أكد الكود اللى اتبعتلك." : "Account created successfully! Please verify your OTP code.",
        );
        router.push(`/auth/verify-otp?email=${encodeURIComponent(data.email)}`);
        reset();
      },
      onError: (err: any) => {
        toast.error(
          err?.response?.data?.message ||
            (isArabic ? "مش عارفين نعمل حساب. الإيميل أو اسم المستخدم مستخدم قبل كدا." : "Error registering account. Email or username might already exist."),
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
          {t.auth.startCreating}
        </Text>
        <Text size="sm" color="secondary">
          {t.auth.startCreatingDesc}
        </Text>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* Username Field */}
        <div className="space-y-1.5">
          <Label htmlFor="username">{t.auth.usernameLabel}</Label>
          <div className="relative">
            <span className="absolute inset-y-0 ltr:left-3.5 rtl:right-3.5 z-10 flex items-center text-textSecondary/60 pointer-events-none">
              <User className="h-4.5 w-4.5" />
            </span>
            <Input
              id="username"
              type="text"
              placeholder={t.auth.usernamePlaceholder}
              disabled={registerMutation.isPending}
              className={`ltr:pl-11 rtl:pr-11 ${errors.username ? "border-destructive/60 focus-visible:ring-destructive/10" : ""}`}
              {...register("username", {
                onChange: () => clearErrors("username"),
              })}
            />
          </div>
          <Error error={errors.username?.message} />
        </div>

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
              disabled={registerMutation.isPending}
              className={`ltr:pl-11 rtl:pr-11 ${errors.email ? "border-destructive/60 focus-visible:ring-destructive/10" : ""}`}
              {...register("email", { onChange: () => clearErrors("email") })}
            />
          </div>
          <Error error={errors.email?.message} />
        </div>

        {/* Job Title Field (Optional) */}
        <div className="space-y-1.5">
          <Label htmlFor="jobTitle">{t.auth.jobTitleLabel}</Label>
          <div className="relative">
            <span className="absolute inset-y-0 ltr:left-3.5 rtl:right-3.5 z-10 flex items-center text-textSecondary/60 pointer-events-none">
              <Briefcase className="h-4.5 w-4.5" />
            </span>
            <Input
              id="jobTitle"
              type="text"
              placeholder={t.auth.jobTitlePlaceholder}
              disabled={registerMutation.isPending}
              className="ltr:pl-11 rtl:pr-11"
              {...register("jobTitle" as any)}
            />
          </div>
        </div>

        {/* Password Field */}
        <div className="space-y-1.5">
          <Label htmlFor="password">{t.auth.passwordLabel}</Label>
          <div className="relative">
            <span className="absolute inset-y-0 ltr:left-3.5 rtl:right-3.5 z-10 flex items-center text-textSecondary/60 pointer-events-none">
              <Lock className="h-4.5 w-4.5" />
            </span>
            <Input
              id="password"
              type="password"
              placeholder={t.auth.passwordPlaceholder}
              disabled={registerMutation.isPending}
              className={`ltr:pl-11 rtl:pr-11 ${errors.password ? "border-destructive/60 focus-visible:ring-destructive/10" : ""}`}
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
          className="w-full cursor-pointer"
        >
          {registerMutation.isPending ? (
            <div className="flex items-center gap-2">
              <span className="h-4 w-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
              <Text as="span" font="semiBold" color="white">
                {t.auth.creatingAccountBtn}
              </Text>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Text as="span" font="semiBold" color="white">
                {t.auth.createAccountBtn}
              </Text>
              <SubmitIcon className="h-4.5 w-4.5 group-hover/button:translate-x-1 transition-transform" />
            </div>
          )}
        </Button>
      </form>

      {/* Footer Link */}
      <div className="mt-2 text-center border-t border-borderPrimary/40 pt-4">
        <Text size="xs" color="secondary">
          {t.auth.alreadyHaveAccount}{" "}
          <Link
            href="/auth/login"
            className="text-primary hover:underline font-semibold"
          >
            {t.auth.signInBtn}
          </Link>
        </Text>
      </div>
    </div>
  );
}
