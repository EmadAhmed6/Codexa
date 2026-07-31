"use client";

import React, { Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";
import { KeyRound, ArrowRight, ArrowLeft, Loader2 } from "lucide-react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { toast } from "@/lib/toast";
import {
  verifyOtpSchema,
  type IVerifyOtp,
} from "@/_features/auth/schemas/auth";
import {
  useVerifyOtpMutation,
  useResendOtpMutation,
} from "@/_features/auth/hooks";
import { Text } from "@/_components/Text";
import Error from "@/_components/Error";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";

function VerifyOtpForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const emailQuery = searchParams.get("email") || "";
  const { t, isArabic } = useLanguage();

  React.useEffect(() => {
    if (!emailQuery || !emailQuery.trim()) {
      toast.error(
        isArabic
          ? "يجب إنشاء حساب أولاً لتأكيد الكود."
          : "Please register first to verify your account.",
      );
      router.replace("/auth/register");
    }
  }, [emailQuery, router, isArabic]);

  const verifyOtpMutation = useVerifyOtpMutation();
  const resendOtpMutation = useResendOtpMutation();

  const {
    register,
    handleSubmit,
    control,
    getValues,
    clearErrors,
    formState: { errors },
  } = useForm<IVerifyOtp>({
    resolver: zodResolver(verifyOtpSchema as any),
    mode: "onChange",
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
              (isArabic
                ? "تم تأكيد الحساب بنجاح! سجل دخول دلوقتي."
                : "Account verified successfully! Please sign in."),
          );
          router.push("/auth/login");
        },
        onError: (err: any) => {
          toast.error(
            err?.response?.data?.message ||
              (isArabic
                ? "كود الـ OTP غلط أو انتهى. حاول تاني."
                : "Invalid OTP code or expired code. Please try again."),
          );
        },
      },
    );
  };

  const SubmitIcon = isArabic ? ArrowLeft : ArrowRight;

  if (!emailQuery || !emailQuery.trim()) {
    return null;
  }

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
        
        <Text
          as="h1"
          size="3xl"
          font="bold"
          color="primary"
          className="tracking-tight mb-2"
        >
          {t.auth.verifyOtpTitle}
        </Text>
        <Text size="sm" color="secondary">
          {t.auth.verifyOtpDesc}
        </Text>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Email Field */}
        <div className="space-y-1.5">
          <Label htmlFor="email">{t.auth.emailLabel}</Label>
          <Input
            id="email"
            type="email"
            placeholder={t.auth.emailPlaceholder}
            disabled={verifyOtpMutation.isPending}
            className={`bg-bgSecondary/50 ${errors.email ? "border-destructive/60 focus-visible:ring-destructive/10" : ""}`}
            {...register("email", { onChange: () => clearErrors("email") })}
          />
          <Error error={errors.email?.message} />
        </div>

        {/* Shadcn InputOTP Component */}
        <div className="space-y-2">
          <Label className="block text-center text-xs font-semibold text-textSecondary mb-6">
            {t.auth.enter6DigitCode}
          </Label>
          <div className="flex justify-center">
            <Controller
              name="otp"
              control={control}
              render={({ field }) => (
                <InputOTP
                  maxLength={6}
                  value={field.value}
                  onChange={(val) => {
                    field.onChange(val);
                    if (val.length === 6 && !verifyOtpMutation.isPending) {
                      clearErrors("otp");
                      const currentEmail = getValues("email");
                      if (currentEmail) {
                        onSubmit({ email: currentEmail, otp: val });
                      }
                    }
                  }}
                  disabled={verifyOtpMutation.isPending}
                >
                  <InputOTPGroup>
                    <InputOTPSlot index={0} className="rounded-sm" />
                    <InputOTPSlot index={1} className="rounded-sm" />
                    <InputOTPSlot index={2} className="rounded-sm" />
                    <InputOTPSlot index={3} className="rounded-sm" />
                    <InputOTPSlot index={4} className="rounded-sm" />
                    <InputOTPSlot index={5} className="rounded-sm" />
                  </InputOTPGroup>
                </InputOTP>
              )}
            />
          </div>
          <div className="text-center mt-1">
            <Error error={errors.otp?.message} />
          </div>
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          disabled={verifyOtpMutation.isPending}
          size="lg"
          className="w-full rounded-2xl cursor-pointer"
        >
          {verifyOtpMutation.isPending ? (
            <div className="flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin text-white" />
              <Text as="span" font="semiBold" color="white">
                {t.auth.verifyingOtpBtn}
              </Text>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Text as="span" font="semiBold" color="white">
                {t.auth.verifyAccountBtn}
              </Text>
              <SubmitIcon className="h-4.5 w-4.5 group-hover/button:translate-x-1 transition-transform" />
            </div>
          )}
        </Button>

        {/* Resend Code Option */}
        <div className="text-center pt-2">
          <button
            type="button"
            onClick={() => {
              const email = getValues("email") || emailQuery;
              if (!email) {
                toast.error(
                  isArabic
                    ? "يرجى كتابة البريد الإلكتروني فوق أولاً"
                    : "Please enter your email address above first",
                );
                return;
              }
              resendOtpMutation.mutate(email.trim());
            }}
            disabled={resendOtpMutation.isPending}
            className="text-xs font-semibold text-primary hover:underline cursor-pointer disabled:opacity-50"
          >
            {resendOtpMutation.isPending
              ? isArabic
                ? "جاري إرسال كود جديد..."
                : "Resending Code..."
              : isArabic
                ? "لم يصلك كود؟ إعادة إرسال OTP"
                : "Didn't receive a code? Resend OTP"}
          </button>
        </div>
      </form>

      {/* Footer Link */}
      <div className="mt-6 text-center border-t border-borderPrimary/40 pt-4">
        <Text size="xs" color="secondary">
          {t.auth.alreadyVerified}{" "}
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
