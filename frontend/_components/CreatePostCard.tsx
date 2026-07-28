"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Loader2,
  Image as ImageIcon,
  X,
  Send,
  User as UserIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCreatePost } from "@/_features/posts/hooks";
import { postFormSchema, type IPostForm } from "@/_features/posts/schemas/post";
import { useGetAuthMeQuery } from "@/_features/auth/hooks";
import Error from "@/_components/Error";
import { toast } from "@/lib/toast";
import { Text } from "@/_components/Text";
import { useLanguage } from "@/context/LanguageContext";

export default function CreatePostCard() {
  const queryClient = useQueryClient();
  const { t, isArabic } = useLanguage();
  const { data: currentUser } = useGetAuthMeQuery();

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const createPostMutation = useCreatePost();

  const {
    register,
    handleSubmit,
    reset,
    clearErrors,
    watch,
    formState: { errors },
  } = useForm<IPostForm>({
    resolver: zodResolver(postFormSchema as any),
    defaultValues: {
      title: "",
    },
  });

  const watchTitle = watch("title") || "";

  if (!currentUser) return null;

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error(
          isArabic
            ? "حجم الصورة لازم يكون أقل من 5 ميجابايت."
            : "Image file size should be less than 5MB.",
        );
        return;
      }
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const onSubmit = async (data: IPostForm) => {
    try {
      setIsUploading(true);

      await createPostMutation.mutateAsync({
        title: data.title.trim(),
        postImageFile: imageFile,
      });

      queryClient.invalidateQueries({ queryKey: ["posts"] });
      queryClient.invalidateQueries({ queryKey: ["userProfile"] });
      queryClient.invalidateQueries({ queryKey: ["authMe"] });

      reset();
      setImageFile(null);
      setImagePreview(null);
      toast.success(
        isArabic ? "تم نشر البوست بنجاح!" : "Post published successfully!",
      );
    } catch (err: any) {
      toast.error(
        err?.response?.data?.message ||
          (isArabic
            ? "حصل مشكلة أثناء نشر البوست. حاول تاني."
            : "Error creating post. Please try again."),
      );
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="bg-bgSecondary/70 border border-borderPrimary/50 rounded-2xl p-4 md:p-5 shadow-sm hover:shadow-md transition-all">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Header / Avatar & Textarea */}
        <div className="flex items-start gap-3">
          <Link
            href={`/profile/${currentUser._id}`}
            className="shrink-0 mt-0.5 hover:opacity-80 transition-opacity"
            title={currentUser.fullName || currentUser.username}
          >
            {currentUser.profilePicture?.url ? (
              <img
                src={currentUser.profilePicture.url}
                alt={currentUser.fullName || currentUser.username}
                className="h-10 w-10 rounded-full object-cover border border-borderPrimary"
              />
            ) : (
              <div className="h-10 w-10 rounded-full bg-primary/15 flex items-center justify-center text-primary">
                <UserIcon className="h-5 w-5" />
              </div>
            )}
          </Link>

          <div className="flex-1 space-y-1">
            {(() => {
              const firstName = (
                currentUser.fullName ||
                currentUser.username ||
                ""
              ).split(" ")[0];
              return (
                <textarea
                  rows={2}
                  placeholder={
                    isArabic
                      ? `بماذا تفكر يا ${firstName}؟`
                      : `What's on your mind, ${firstName}?`
                  }
                  {...register("title", {
                    onChange: () => clearErrors("title"),
                  })}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSubmit(onSubmit)();
                    }
                  }}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-bgPrimary/60 border border-borderPrimary/40 text-textPrimary text-sm placeholder:text-textSecondary/50 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all resize-none"
                />
              );
            })()}
            <Error error={errors.title?.message} />
          </div>
        </div>

        {/* Image Preview Thumbnail if attached */}
        {imagePreview && (
          <div className="relative rounded-xl overflow-hidden border border-borderPrimary/40 max-h-48 group">
            <img
              src={imagePreview}
              alt="Attached preview"
              className="w-full h-44 object-cover"
            />
            <button
              type="button"
              onClick={() => {
                setImageFile(null);
                setImagePreview(null);
              }}
              className="absolute top-2 ltr:right-2 rtl:left-2 p-1.5 rounded-full bg-black/70 text-white hover:bg-black transition-colors cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        )}

        {/* Footer Actions Row */}
        <div className="flex items-center justify-between pt-2 border-t border-borderPrimary/30">
          <div className="flex items-center gap-2">
            <label className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-borderPrimary/40 hover:border-primary/40 bg-bgPrimary/40 hover:bg-primary/5 text-textSecondary hover:text-primary transition-all cursor-pointer text-xs font-semibold">
              <ImageIcon className="h-4 w-4 text-primary" />
              <span>
                {imagePreview
                  ? isArabic
                    ? "تغيير الصورة"
                    : "Change Image"
                  : isArabic
                    ? "صورة"
                    : "Image"}
              </span>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </label>

            <Text
              as="span"
              size="xs"
              color="secondary"
              className="text-[11px] ltr:ml-2 rtl:mr-2"
            >
              {watchTitle.length}/32
            </Text>
          </div>

          <Button
            type="submit"
            disabled={
              createPostMutation.isPending || isUploading || !watchTitle.trim()
            }
            size="sm"
            className="rounded-xl bg-primary hover:bg-primaryHover text-primary-foreground font-semibold px-5 cursor-pointer text-xs flex items-center gap-1.5 shadow-sm shadow-primary/20"
          >
            {createPostMutation.isPending || isUploading ? (
              <span className="flex items-center gap-1.5">
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                <span>{isArabic ? "جاري النشر..." : "Publishing..."}</span>
              </span>
            ) : (
              <span className="flex items-center gap-1.5">
                <Send className="h-3.5 w-3.5" />
                <span>{isArabic ? "نشر" : "Post"}</span>
              </span>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
