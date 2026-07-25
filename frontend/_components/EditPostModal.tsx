"use client";

import React, { useEffect } from "react";
import { X, Loader2, Edit3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useUpdatePost } from "@/_features/posts/hooks";
import { Post } from "@/_features/posts/types/Post";
import { postFormSchema, type IPostForm } from "@/_features/posts/schemas/post";
import Error from "@/_components/Error";
import { toast } from "sonner";
import { Text } from "@/_components/Text";

interface EditPostModalProps {
  isOpen: boolean;
  onClose: () => void;
  post: Post;
}

const CATEGORIES = [
  "Development",
  "React & Next.js",
  "Backend & API",
  "Design & UX",
  "AI & ML",
  "DevOps & Cloud",
  "Career & Insights",
];

export default function EditPostModal({
  isOpen,
  onClose,
  post,
}: EditPostModalProps) {
  const updatePostMutation = useUpdatePost();

  const {
    register,
    handleSubmit,
    reset,
    clearErrors,
    watch,
    formState: { errors },
  } = useForm<IPostForm>({
    resolver: zodResolver(postFormSchema as any),
    mode: "onBlur",
    defaultValues: {
      title: post?.title || "",
      category: post?.category || CATEGORIES[0],
      description: post?.description || "",
    },
  });

  useEffect(() => {
    if (post) {
      reset({
        title: post.title || "",
        category: post.category || CATEGORIES[0],
        description: post.description || "",
      });
    }
  }, [post, reset]);

  const watchTitle = watch("title") || "";
  const watchDescription = watch("description") || "";

  if (!isOpen) return null;

  const onSubmit = async (data: IPostForm) => {
    try {
      await updatePostMutation.mutateAsync({
        postId: post._id,
        postData: {
          title: data.title.trim(),
          category: data.category,
          description: data.description.trim(),
        },
      });
      onClose();
    } catch {
      // Error handled in mutation
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-bgSecondary border border-borderPrimary rounded-2xl shadow-2xl p-6 md:p-8 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-borderPrimary/40 mb-6">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-primary/10 text-primary">
              <Edit3 className="h-5 w-5" />
            </div>
            <div>
              <Text as="h2" size="xl" font="bold" color="primary">
                Edit Article
              </Text>
              <Text as="p" size="xs" color="secondary">
                Update article details and category
              </Text>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-bgPrimary text-textSecondary hover:text-textPrimary transition-colors cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Title */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <Text
                as="label"
                size="xs"
                font="semiBold"
                color="secondary"
                className="block uppercase tracking-wider"
              >
                Title
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
            <input
              type="text"
              {...register("title", {
                onChange: () => clearErrors("title"),
              })}
              className="w-full px-4 py-3 rounded-xl bg-bgPrimary border border-borderPrimary text-textPrimary text-sm font-semibold outline-none focus:ring-2 focus:ring-primary transition-all"
            />
            <Error error={errors.title?.message} />
          </div>

          {/* Description */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <Text
                as="label"
                size="xs"
                font="semiBold"
                color="secondary"
                className="block uppercase tracking-wider"
              >
                Content & Description
              </Text>
              <Text
                as="span"
                size="xs"
                color="secondary"
                className="text-[11px]"
              >
                {watchDescription.length}/250
              </Text>
            </div>
            <textarea
              rows={6}
              {...register("description", {
                onChange: () => clearErrors("description"),
              })}
              className="w-full px-4 py-3 rounded-xl bg-bgPrimary border border-borderPrimary text-textPrimary text-sm outline-none focus:ring-2 focus:ring-primary transition-all resize-none"
            />
            <Error error={errors.description?.message} />
          </div>
          {/* Category */}
          <div>
            <Text
              as="label"
              size="xs"
              font="semiBold"
              color="secondary"
              className="block uppercase tracking-wider mb-2"
            >
              Category
            </Text>
            <select
              {...register("category", {
                onChange: () => clearErrors("category"),
              })}
              className="w-full px-4 py-2.5 rounded-xl bg-bgPrimary border border-borderPrimary text-textPrimary text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all cursor-pointer"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
            <Error error={errors.category?.message} />
          </div>
          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-borderPrimary/30">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="rounded-xl border-borderPrimary"
            >
              <Text as="span" size="xs" font="semiBold" color="primary">
                Cancel
              </Text>
            </Button>
            <Button
              type="submit"
              disabled={updatePostMutation.isPending}
              className="rounded-xl bg-primary hover:bg-primaryHover text-primary-foreground font-semibold px-6 cursor-pointer"
            >
              {updatePostMutation.isPending ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <Text as="span" size="xs" font="semiBold" color="white">
                    Saving...
                  </Text>
                </span>
              ) : (
                <Text as="span" size="xs" font="semiBold" color="white">
                  Save Changes
                </Text>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
