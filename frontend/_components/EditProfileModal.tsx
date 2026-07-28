"use client";

import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  editProfileSchema,
  type IEditProfile,
} from "@/_features/posts/schemas/post";
import { useUpdateUser } from "@/_features/user/hooks";
import Error from "@/_components/Error";
import { Text } from "@/_components/Text";
import { useLanguage } from "@/context/LanguageContext";

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: any;
  targetUserId: string;
}

export default function EditProfileModal({
  isOpen,
  onClose,
  user,
  targetUserId,
}: EditProfileModalProps) {
  const { t, isArabic } = useLanguage();
  const [mounted, setMounted] = useState(false);
  const updateUserMutation = useUpdateUser(targetUserId);

  useEffect(() => {
    setMounted(true);
  }, []);

  const {
    register,
    handleSubmit,
    reset,
    clearErrors,
    formState: { errors },
  } = useForm<IEditProfile>({
    resolver: zodResolver(editProfileSchema as any),
    mode: "onBlur",
    defaultValues: {
      fullName: user?.fullName || "",
      username: user?.username || "",
      jobTitle: user?.jobTitle || "",
      bio: user?.bio || "",
      email: user?.email || "",
    },
  });

  useEffect(() => {
    if (isOpen && user) {
      reset({
        fullName: user.fullName || "",
        username: user.username || "",
        jobTitle: user.jobTitle || "",
        bio: user.bio || "",
        email: user.email || "",
      });
    }
  }, [user, isOpen, reset]);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen || !mounted) return null;

  const handleUpdateProfile = async (data: IEditProfile) => {
    try {
      await updateUserMutation.mutateAsync({
        fullName: data.fullName.trim(),
        username: data.username.trim(),
        jobTitle: data.jobTitle ? data.jobTitle.trim() : "",
        bio: data.bio ? data.bio.trim() : "",
        email: data.email.trim(),
      });
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
        <div className="flex items-center justify-between border-b border-borderPrimary/40 pb-3">
          <Text as="h3" size="lg" font="bold" color="primary">
            {t.profile.editProfile}
          </Text>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-textSecondary hover:text-textPrimary cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <form
          onSubmit={handleSubmit(handleUpdateProfile)}
          className="space-y-4"
        >
          <div>
            <Text
              as="label"
              size="xs"
              font="semiBold"
              color="secondary"
              className="block mb-1"
            >
              {isArabic ? "الاسم بالكامل" : "Full Name"}
            </Text>
            <Input
              type="text"
              icon="user"
              placeholder={isArabic ? "الاسم بالكامل" : "Full Name"}
              hasError={!!errors.fullName}
              {...register("fullName", {
                onChange: () => clearErrors("fullName"),
              })}
            />
            <Error error={errors.fullName?.message} />
          </div>

          <div>
            <Text
              as="label"
              size="xs"
              font="semiBold"
              color="secondary"
              className="block mb-1"
            >
              {t.auth.usernameLabel}
            </Text>
            <Input
              type="text"
              icon="user"
              placeholder="Username"
              hasError={!!errors.username}
              {...register("username", {
                onChange: () => clearErrors("username"),
              })}
            />
            <Error error={errors.username?.message} />
          </div>

          <div>
            <Text
              as="label"
              size="xs"
              font="semiBold"
              color="secondary"
              className="block mb-1"
            >
              {t.profile.jobTitle}
            </Text>
            <Input
              type="text"
              icon="briefcase"
              placeholder="e.g. Frontend Developer"
              hasError={!!(errors as any).jobTitle}
              {...register("jobTitle" as any, {
                onChange: () => clearErrors("jobTitle" as any),
              })}
            />
            <Error error={(errors as any).jobTitle?.message} />
          </div>

          <div>
            <Text
              as="label"
              size="xs"
              font="semiBold"
              color="secondary"
              className="block mb-1"
            >
              {t.profile.bio}
            </Text>
            <Input
              type="text"
              icon="file"
              placeholder="Tell us about yourself..."
              hasError={!!(errors as any).bio}
              {...register("bio" as any, {
                onChange: () => clearErrors("bio" as any),
              })}
            />
            <Error error={(errors as any).bio?.message} />
          </div>

          <div>
            <Text
              as="label"
              size="xs"
              font="semiBold"
              color="secondary"
              className="block mb-1"
            >
              Email Address
            </Text>
            <Input
              type="email"
              icon="mail"
              placeholder="Email"
              hasError={!!errors.email}
              {...register("email", {
                onChange: () => clearErrors("email"),
              })}
            />
            <Error error={errors.email?.message} />
          </div>

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
              disabled={updateUserMutation.isPending}
              className="rounded-xl bg-primary text-primary-foreground text-xs cursor-pointer"
            >
              <Text as="span" size="xs" font="semiBold" color="white">
                {updateUserMutation.isPending
                  ? t.post.saving
                  : t.profile.saveProfile}
              </Text>
            </Button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
}
