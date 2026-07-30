"use client";

import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { X, Lock, Eye, EyeOff, Check, KeyRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useChangePassword } from "@/_features/user/hooks";
import Error from "@/_components/Error";
import { Text } from "@/_components/Text";
import { useLanguage } from "@/context/LanguageContext";
import {
  changePasswordSchema,
  IChangePassword,
} from "@/_features/user/schema/changePassword";

interface ChangePasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetUserId: string;
}

export default function ChangePasswordModal({
  isOpen,
  onClose,
  targetUserId,
}: ChangePasswordModalProps) {
  const { t, isArabic } = useLanguage();
  const [mounted, setMounted] = useState(false);
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const changePasswordMutation = useChangePassword(targetUserId);

  useEffect(() => {
    setMounted(true);
  }, []);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    clearErrors,
    formState: { errors },
  } = useForm<IChangePassword>({
    resolver: zodResolver(changePasswordSchema),
    mode: "onBlur",
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmNewPassword: "",
    },
  });

  const watchNewPassword = watch("newPassword", "");

  // Real-time password requirement flags
  const hasMinLength =
    watchNewPassword.length >= 6 && watchNewPassword.length <= 72;
  const hasUppercase = /[A-Z]/.test(watchNewPassword);
  const hasLowercase = /[a-z]/.test(watchNewPassword);
  const hasNumber = /\d/.test(watchNewPassword);

  useEffect(() => {
    if (isOpen) {
      reset({
        currentPassword: "",
        newPassword: "",
        confirmNewPassword: "",
      });
      setShowOldPassword(false);
      setShowNewPassword(false);
      setShowConfirmPassword(false);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen, reset]);

  if (!isOpen || !mounted) return null;

  const onSubmit = async (data: IChangePassword) => {
    try {
      await changePasswordMutation.mutateAsync({
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      });
      reset();
      onClose();
    } catch {
      // error handled in mutation toast
    }
  };

  return createPortal(
    <div
      className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-md bg-bgSecondary border border-borderPrimary rounded-2xl p-6 shadow-2xl space-y-4"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-borderPrimary/40 pb-3">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-primary/10 text-primary">
              <KeyRound className="h-5 w-5" />
            </div>
            <Text as="h3" size="lg" font="bold" color="primary">
              {t.profile.changePassword}
            </Text>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-textSecondary hover:text-textPrimary hover:bg-bgPrimary transition-colors cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Current Password */}
          <div>
            <Text
              as="label"
              size="xs"
              font="semiBold"
              color="secondary"
              className="block mb-1"
            >
              {t.profile.oldPassword}
            </Text>
            <div className="relative">
              <Input
                type={showOldPassword ? "text" : "password"}
                icon="lock"
                placeholder={
                  isArabic
                    ? "أدخل كلمة المرور الحالية"
                    : "Enter current password"
                }
                hasError={!!errors.currentPassword}
                {...register("currentPassword", {
                  onChange: () => clearErrors("currentPassword"),
                })}
              />
            </div>
            <Error error={errors.currentPassword?.message} />
          </div>

          {/* New Password */}
          <div>
            <Text
              as="label"
              size="xs"
              font="semiBold"
              color="secondary"
              className="block mb-1"
            >
              {t.profile.newPassword}
            </Text>
            <div className="relative">
              <Input
                type={showNewPassword ? "text" : "password"}
                icon="lock"
                placeholder={
                  isArabic ? "أدخل كلمة المرور الجديدة" : "Enter new password"
                }
                hasError={!!errors.newPassword}
                {...register("newPassword", {
                  onChange: () => clearErrors("newPassword"),
                })}
              />
            </div>
            <Error error={errors.newPassword?.message} />
          </div>

          {/* Password Requirements Badges */}
          <div className="p-3 rounded-xl bg-bgPrimary/60 border border-borderPrimary/40 space-y-1.5 text-xs">
            <Text
              as="p"
              size="xs"
              font="semiBold"
              color="secondary"
              className="mb-1 text-[11px]"
            >
              {isArabic ? "شروط كلمة المرور:" : "Password Requirements:"}
            </Text>
            <div className="grid grid-cols-2 gap-1.5 text-[11px]">
              <div
                className={`flex items-center gap-1.5 ${hasMinLength ? "text-emerald-500 font-medium" : "text-textSecondary"}`}
              >
                <Check
                  className={`h-3.5 w-3.5 ${hasMinLength ? "opacity-100" : "opacity-30"}`}
                />
                <span>
                  {isArabic ? "6 أحرف على الأقل" : "Min 6 characters"}
                </span>
              </div>
              <div
                className={`flex items-center gap-1.5 ${hasUppercase ? "text-emerald-500 font-medium" : "text-textSecondary"}`}
              >
                <Check
                  className={`h-3.5 w-3.5 ${hasUppercase ? "opacity-100" : "opacity-30"}`}
                />
                <span>{isArabic ? "حرف كبير (A-Z)" : "Uppercase letter"}</span>
              </div>
              <div
                className={`flex items-center gap-1.5 ${hasLowercase ? "text-emerald-500 font-medium" : "text-textSecondary"}`}
              >
                <Check
                  className={`h-3.5 w-3.5 ${hasLowercase ? "opacity-100" : "opacity-30"}`}
                />
                <span>{isArabic ? "حرف صغير (a-z)" : "Lowercase letter"}</span>
              </div>
              <div
                className={`flex items-center gap-1.5 ${hasNumber ? "text-emerald-500 font-medium" : "text-textSecondary"}`}
              >
                <Check
                  className={`h-3.5 w-3.5 ${hasNumber ? "opacity-100" : "opacity-30"}`}
                />
                <span>{isArabic ? "رقم (0-9)" : "Number (0-9)"}</span>
              </div>
            </div>
          </div>

          {/* Confirm New Password */}
          <div>
            <Text
              as="label"
              size="xs"
              font="semiBold"
              color="secondary"
              className="block mb-1"
            >
              {t.profile.confirmNewPassword}
            </Text>
            <div className="relative">
              <Input
                type={showConfirmPassword ? "text" : "password"}
                icon="lock"
                placeholder={
                  isArabic
                    ? "أعد كتابة كلمة المرور الجديدة"
                    : "Confirm new password"
                }
                hasError={!!errors.confirmNewPassword}
                {...register("confirmNewPassword", {
                  onChange: () => clearErrors("confirmNewPassword"),
                })}
              />
            </div>
            <Error error={errors.confirmNewPassword?.message} />
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onClose}
              className="rounded-xl text-xs cursor-pointer"
            >
              <Text as="span" size="xs" color="secondary">
                {t.post.cancel}
              </Text>
            </Button>
            <Button
              type="submit"
              size="sm"
              disabled={changePasswordMutation.isPending}
              className="rounded-xl bg-primary text-primary-foreground text-xs cursor-pointer"
            >
              <Text as="span" size="xs" font="semiBold" color="white">
                {changePasswordMutation.isPending
                  ? t.post.saving
                  : t.profile.savePassword}
              </Text>
            </Button>
          </div>
        </form>
      </div>
    </div>,
    document.body,
  );
}
