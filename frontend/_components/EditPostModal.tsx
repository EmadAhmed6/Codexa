"use client";

import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { X, Loader2, Edit3, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useUpdatePost } from "@/_features/posts/hooks";
import { useQueryClient } from "@tanstack/react-query";
import { Post } from "@/_features/posts/types/Post";
import { postFormSchema, type IPostForm } from "@/_features/posts/schemas/post";
import Error from "@/_components/Error";
import { toast } from "@/lib/toast";
import { Text } from "@/_components/Text";
import { useLanguage } from "@/context/LanguageContext";

interface EditPostModalProps {
  isOpen: boolean;
  onClose: () => void;
  post: Post;
}

export default function EditPostModal({
  isOpen,
  onClose,
  post,
}: EditPostModalProps) {
  const queryClient = useQueryClient();
  const updatePostMutation = useUpdatePost();
  const { t, isArabic } = useLanguage();
  const [mounted, setMounted] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const {
    register,
    handleSubmit,
    reset,
    clearErrors,
    watch,
    formState: { errors },
  } = useForm<IPostForm>({
    resolver: zodResolver(postFormSchema as any),
    mode: "onChange",
    defaultValues: {
      title: post?.title || "",
    },
  });

  useEffect(() => {
    if (isOpen && post) {
      reset({
        title: post.title || "",
      });
      setImagePreview(post.postImage?.url || post.image?.url || null);
      setImageFile(null);
    }
  }, [post, isOpen, reset]);

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

  const watchTitle = watch("title") || "";

  if (!isOpen || !mounted) return null;

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

      await updatePostMutation.mutateAsync({
        postId: post._id,
        postData: {
          title: data.title.trim(),
          postImageFile: imageFile,
        },
      });

      queryClient.invalidateQueries({ queryKey: ["posts"] });
      queryClient.invalidateQueries({ queryKey: ["post", post._id] });
      queryClient.invalidateQueries({ queryKey: ["userProfile"] });
      queryClient.invalidateQueries({ queryKey: ["authMe"] });

      setImageFile(null);
      toast.success(
        isArabic ? "تم تعديل البوست بنجاح!" : "Post updated successfully!",
      );
      onClose();
    } catch (err: any) {
      toast.error(
        err?.response?.data?.message ||
          (isArabic
            ? "حدث خطأ أثناء تعديل البوست."
            : "Failed to update post. Please try again."),
      );
    } finally {
      setIsUploading(false);
    }
  };

  return createPortal(
    <div className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200" onClick={onClose}>
      <div className="relative w-full max-w-lg bg-bgSecondary border border-borderPrimary/60 rounded-2xl shadow-2xl p-6 md:p-7 max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-borderPrimary/40 mb-5">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-primary/10 text-primary">
              <Edit3 className="h-5 w-5" />
            </div>
            <div>
              <Text as="h2" size="lg" font="bold" color="primary">
                {t.createEditPost.editTitle}
              </Text>
              <Text as="p" size="xs" color="secondary">
                {t.createEditPost.editSubtitle}
              </Text>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-bgPrimary/60 text-textSecondary hover:text-textPrimary transition-colors cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Post Content / Title */}
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <Text
                as="label"
                size="xs"
                font="semiBold"
                color="secondary"
                className="block uppercase tracking-wider"
              >
                {isArabic ? "محتوى البوست" : "Post Content"}
              </Text>
              <Text
                as="span"
                size="xs"
                color="secondary"
                className="text-[11px]"
              >
                {watchTitle.length}/32
              </Text>
            </div>
            <textarea
              rows={3}
              maxLength={32}
              placeholder={isArabic ? "اكتب محتوى البوست هنا..." : "Write post content here..."}
              {...register("title", {
                onChange: () => clearErrors("title"),
              })}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit(onSubmit)();
                }
              }}
              className="w-full p-3.5 text-xs sm:text-sm rounded-xl bg-bgPrimary/70 border border-borderPrimary/60 text-textPrimary placeholder:text-textSecondary/50 outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all resize-none"
            />
            <Error error={errors.title?.message} />
          </div>

          {/* Featured Image */}
          <div>
            <Text
              as="label"
              size="xs"
              font="semiBold"
              color="secondary"
              className="block uppercase tracking-wider mb-1.5"
            >
              {t.createEditPost.imageLabel}
            </Text>
            {imagePreview && (
              <div className="relative rounded-xl overflow-hidden border border-borderPrimary/50 max-h-56 mb-2 group bg-black/5 dark:bg-white/5 flex items-center justify-center">
                <img
                  src={imagePreview}
                  alt="Post preview"
                  className="w-full h-auto max-h-52 object-contain rounded-xl"
                />
                <button
                  type="button"
                  onClick={() => {
                    setImageFile(null);
                    setImagePreview(null);
                  }}
                  className="absolute top-2 ltr:right-2 rtl:left-2 p-1.5 bg-black/70 rounded-full text-white hover:bg-black transition-colors cursor-pointer"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            )}

            <label className="flex items-center justify-center gap-2 p-3 rounded-xl border border-dashed border-borderPrimary/60 hover:border-primary/50 bg-bgPrimary/60 hover:bg-primary/5 text-textSecondary hover:text-primary transition-all cursor-pointer text-xs font-semibold">
              <ImageIcon className="h-4 w-4 text-primary" />
              <span>{imagePreview ? t.createEditPost.changeImage : t.createEditPost.uploadImage}</span>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </label>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-borderPrimary/30">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="rounded-xl border-borderPrimary/60 cursor-pointer"
            >
              <Text as="span" size="xs" font="semiBold" color="primary">
                {t.createEditPost.cancel}
              </Text>
            </Button>
            <Button
              type="submit"
              disabled={updatePostMutation.isPending || isUploading || !watchTitle.trim()}
              className="rounded-xl bg-primary hover:bg-primaryHover text-primary-foreground font-semibold px-5 cursor-pointer"
            >
              {updatePostMutation.isPending || isUploading ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <Text as="span" size="xs" font="semiBold" color="white">
                    {t.post.saving}
                  </Text>
                </span>
              ) : (
                <Text as="span" size="xs" font="semiBold" color="white">
                  {t.createEditPost.saveChanges}
                </Text>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>,
    document.body,
  );
}
