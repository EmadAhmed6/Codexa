"use client";

import React, { useState } from "react";
import { X, Loader2, Sparkles, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCreatePost } from "@/_features/posts/hooks";
import { uploadPostImage } from "@/_features/posts/api";
import { postFormSchema, type IPostForm } from "@/_features/posts/schemas/post";
import Error from "@/_components/Error";
import { toast } from "sonner";
import { Text } from "@/_components/Text";

interface CreatePostModalProps {
  isOpen: boolean;
  onClose: () => void;
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

export default function CreatePostModal({
  isOpen,
  onClose,
}: CreatePostModalProps) {
  const queryClient = useQueryClient();
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
    mode: "onBlur",
    defaultValues: {
      title: "",
      category: CATEGORIES[0],
      description: "",
    },
  });

  const watchTitle = watch("title") || "";
  const watchDescription = watch("description") || "";

  if (!isOpen) return null;

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image file size should be less than 5MB.");
        return;
      }
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const onSubmit = async (data: IPostForm) => {
    try {
      setIsUploading(true);

      const createdPost = await createPostMutation.mutateAsync({
        title: data.title.trim(),
        category: data.category,
        description: data.description.trim(),
      });

      if (imageFile && createdPost?._id) {
        try {
          await uploadPostImage(createdPost._id, imageFile);
          queryClient.invalidateQueries({ queryKey: ["posts"] });
        } catch {
          toast.error("Article published, but image upload failed.");
        }
      }

      reset();
      setImageFile(null);
      setImagePreview(null);
      onClose();
    } catch (err: any) {
      toast.error(
        err?.response?.data?.message ||
          "Error creating post. Please try again.",
      );
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-bgSecondary border border-borderPrimary rounded-2xl shadow-2xl p-6 md:p-8 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-borderPrimary/40 mb-6">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-primary/10 text-primary">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <Text as="h2" size="xl" font="bold" color="primary">
                Create New Article
              </Text>
              <Text as="p" size="xs" color="secondary">
                Share your technical insights with the DevQuill community
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
              placeholder="e.g. Building Scalable Apps"
              {...register("title", {
                onChange: () => clearErrors("title"),
              })}
              className="w-full px-4 py-3 rounded-xl bg-bgPrimary border border-borderPrimary text-textPrimary text-sm font-semibold placeholder:text-textSecondary/50 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
            />
            <Error error={errors.title?.message} />
          </div>

          {/* Content Description */}
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
              placeholder="Write your article content here..."
              {...register("description", {
                onChange: () => clearErrors("description"),
              })}
              className="w-full px-4 py-3 rounded-xl bg-bgPrimary border border-borderPrimary text-textPrimary text-sm placeholder:text-textSecondary/50 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all resize-none"
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
          {/* Featured Image */}
          <div>
            <Text
              as="label"
              size="xs"
              font="semiBold"
              color="secondary"
              className="block uppercase tracking-wider mb-2"
            >
              Featured Cover Image (Optional)
            </Text>
            <div className="flex flex-col gap-3">
              {imagePreview ? (
                <div className="relative rounded-xl overflow-hidden border border-borderPrimary max-h-48 group">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-48 object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setImageFile(null);
                      setImagePreview(null);
                    }}
                    className="absolute top-3 right-3 p-1.5 rounded-full bg-black/70 text-white hover:bg-black transition-colors cursor-pointer"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-borderPrimary/60 rounded-xl hover:border-primary/50 bg-bgPrimary/50 hover:bg-bgPrimary transition-all cursor-pointer">
                  <ImageIcon className="h-8 w-8 text-primary mb-2 opacity-70" />
                  <Text as="span" size="xs" font="semiBold" color="primary">
                    Click to upload cover image
                  </Text>
                  <Text
                    as="span"
                    size="xs"
                    color="secondary"
                    className="text-[11px] mt-1"
                  >
                    PNG, JPG, WebP up to 5MB
                  </Text>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>
              )}
            </div>
          </div>

          {/* Action Buttons */}
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
              disabled={createPostMutation.isPending || isUploading}
              className="rounded-xl bg-primary hover:bg-primaryHover text-primary-foreground font-semibold px-6 cursor-pointer"
            >
              {createPostMutation.isPending || isUploading ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <Text as="span" size="xs" font="semiBold" color="white">
                    Publishing...
                  </Text>
                </span>
              ) : (
                <Text as="span" size="xs" font="semiBold" color="white">
                  Publish Article
                </Text>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
