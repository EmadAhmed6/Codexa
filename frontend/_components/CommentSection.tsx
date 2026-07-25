"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  MessageSquare,
  Send,
  Heart,
  Edit2,
  Trash2,
  Image as ImageIcon,
  X,
  Loader2,
  User as UserIcon,
} from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import {
  useGetComments,
  useAddComment,
  useUpdateComment,
  useDeleteComment,
  useLikeComment,
} from "@/_features/posts/hooks";
import { uploadCommentImage } from "@/_features/posts/api";
import { useGetAuthMeQuery } from "@/_features/auth/hooks";
import Cookies from "js-cookie";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  commentFormSchema,
  type ICommentForm,
} from "@/_features/posts/schemas/post";
import Error from "@/_components/Error";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { cn, formatRelativeTime } from "@/lib/utils";
import { Text } from "@/_components/Text";
import Tooltip from "@/_components/Tooltip";
import UserListTooltip from "@/_components/UserListTooltip";

interface CommentSectionProps {
  postId: string;
}

export default function CommentSection({ postId }: CommentSectionProps) {
  const queryClient = useQueryClient();
  const token = Cookies.get("token");
  const { data: currentUser } = useGetAuthMeQuery();
  const { data: comments, isLoading } = useGetComments(postId);

  const addCommentMutation = useAddComment(postId);
  const updateCommentMutation = useUpdateComment(postId);
  const deleteCommentMutation = useDeleteComment(postId);
  const likeCommentMutation = useLikeComment(postId);

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  // Edit Comment state
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [editText, setEditText] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    clearErrors,
    watch,
    formState: { errors },
  } = useForm<ICommentForm>({
    resolver: zodResolver(commentFormSchema as any),
    mode: "onBlur",
    defaultValues: {
      text: "",
    },
  });

  const watchText = watch("text") || "";

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const onSubmitComment = async (data: ICommentForm) => {
    try {
      if (imageFile) {
        setIsUploading(true);
      }

      const createdComment = await addCommentMutation.mutateAsync({
        text: data.text.trim(),
      });

      const createdCommentId = createdComment?._id;
      if (imageFile && createdCommentId) {
        await uploadCommentImage(postId, createdCommentId, imageFile);
        queryClient.invalidateQueries({ queryKey: ["comments", postId] });
      }

      reset();
      setImageFile(null);
      setImagePreview(null);
    } catch {
      // Handled in mutation
    } finally {
      setIsUploading(false);
    }
  };

  const handleSaveEdit = async (commentId: string) => {
    if (!editText.trim()) return;
    try {
      await updateCommentMutation.mutateAsync({
        commentId,
        text: editText.trim(),
      });
      setEditingCommentId(null);
      setEditText("");
    } catch {
      // Handled in mutation
    }
  };

  const commentsCount = comments ? comments.length : 0;

  return (
    <div id="comments" className="space-y-6 pt-8 border-t border-borderPrimary/40">
      {/* Section Title */}
      <div className="flex items-center gap-2">
        <MessageSquare className="h-5 w-5 text-primary" />
        <Text as="h3" size="lg" font="bold" color="primary">
          Discussion & Comments ({commentsCount})
        </Text>
      </div>

      {/* Add Comment Input Form */}
      {token ? (
        <form onSubmit={handleSubmit(onSubmitComment)} className="space-y-3">
          <div className="p-4 rounded-2xl bg-bgSecondary/60 border border-borderPrimary/50 shadow-sm focus-within:border-primary/50 transition-all">
            <div className="flex justify-between items-center mb-2">
              <Text as="span" size="xs" font="semiBold" color="secondary">
                Write a response
              </Text>
              <Text as="span" size="xs" color="secondary" className="text-[11px]">
                {watchText.length}/500
              </Text>
            </div>

            <textarea
              rows={3}
              placeholder="What are your thoughts on this article?"
              {...register("text", {
                onChange: () => clearErrors("text"),
              })}
              className="w-full bg-transparent text-textPrimary placeholder:text-textSecondary/50 text-xs sm:text-sm outline-none resize-none"
            />
            <Error error={errors.text?.message} />

            {/* Optional Image Preview */}
            {imagePreview && (
              <div className="relative inline-block mt-2 rounded-xl overflow-hidden border border-borderPrimary max-h-32">
                <img
                  src={imagePreview}
                  alt="Upload preview"
                  className="h-28 object-cover"
                />
                <button
                  type="button"
                  onClick={() => {
                    setImageFile(null);
                    setImagePreview(null);
                  }}
                  className="absolute top-1 right-1 p-1 bg-black/70 rounded-full text-white hover:bg-black transition-colors"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            )}

            {/* Bottom Actions Bar */}
            <div className="flex items-center justify-between pt-3 border-t border-borderPrimary/30 mt-2">
              <label className="flex items-center gap-1.5 text-xs text-textSecondary hover:text-primary transition-colors cursor-pointer">
                <ImageIcon className="h-4 w-4 text-primary" />
                <Text as="span" size="xs" font="medium" color="secondary">
                  Attach Image
                </Text>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>

              <Button
                type="submit"
                size="sm"
                disabled={
                  !watchText.trim() ||
                  addCommentMutation.isPending ||
                  isUploading
                }
                className="rounded-xl bg-primary hover:bg-primaryHover text-primary-foreground text-xs font-semibold px-4 cursor-pointer"
              >
                {addCommentMutation.isPending || isUploading ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <>
                    <Text as="span" size="xs" font="semiBold" color="white">
                      Post Comment
                    </Text>
                    <Send className="h-3.5 w-3.5 ml-1.5" />
                  </>
                )}
              </Button>
            </div>
          </div>
        </form>
      ) : (
        <div className="p-4 rounded-2xl bg-bgSecondary/40 border border-borderPrimary/40 text-center mb-8">
          <Text as="p" size="xs" color="secondary">
            Please log in to join the conversation and post comments.
          </Text>
        </div>
      )}

      {/* Comment List */}
      {isLoading ? (
        <div className="flex justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
        </div>
      ) : comments && comments.length > 0 ? (
        <div className="space-y-4">
          {comments.map((comment) => {
            const isOwner =
              currentUser && currentUser._id === comment.user?._id;
            const isEditing = editingCommentId === comment._id;
            const likesCount =
              comment.commentLikesCount !== undefined
                ? comment.commentLikesCount
                : Array.isArray(comment.likes)
                  ? comment.likes.length
                  : 0;

            const isLiked = currentUser
              ? Array.isArray(comment.likes) &&
                comment.likes.some((like) =>
                  typeof like === "string"
                    ? like === currentUser._id
                    : like._id === currentUser._id,
                )
              : false;

            return (
              <div
                key={comment._id}
                className="p-4 md:p-5 rounded-2xl bg-bgSecondary/50 border border-borderPrimary/40 space-y-3"
              >
                {/* Author Info */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    {comment.user?._id ? (
                      <Link
                        href={`/profile/${comment.user._id}`}
                        className="flex items-center gap-2.5 group/commentAuthor hover:opacity-80 transition-opacity"
                      >
                        {comment.user?.profilePicture?.url ? (
                          <img
                            src={comment.user.profilePicture.url}
                            alt={comment.user.username}
                            className="h-7 w-7 rounded-full object-cover border border-borderPrimary"
                          />
                        ) : (
                          <div className="h-7 w-7 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                            <UserIcon className="h-4 w-4" />
                          </div>
                        )}
                        <div>
                          <Text
                            as="span"
                            size="xs"
                            font="bold"
                            color="primary"
                            className="group-hover/commentAuthor:text-primary group-hover/commentAuthor:underline"
                          >
                            {comment.user?.username || "Anonymous"}
                          </Text>
                          {comment.createdAt && (
                            <Text
                              as="span"
                              size="xs"
                              color="secondary"
                              className="text-[10px] ml-2"
                            >
                              {formatRelativeTime(comment.createdAt)}
                            </Text>
                          )}
                        </div>
                      </Link>
                    ) : (
                      <div className="flex items-center gap-2.5">
                        <div className="h-7 w-7 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                          <UserIcon className="h-4 w-4" />
                        </div>
                        <div>
                          <Text as="span" size="xs" font="bold" color="primary">
                            Anonymous
                          </Text>
                          {comment.createdAt && (
                            <Text
                              as="span"
                              size="xs"
                              color="secondary"
                              className="text-[10px] ml-2"
                            >
                              {formatRelativeTime(comment.createdAt)}
                            </Text>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Owner Controls */}
                  {isOwner && !isEditing && (
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => {
                          setEditingCommentId(comment._id);
                          setEditText(comment.text);
                        }}
                        className="p-1 rounded-md text-textSecondary hover:text-primary transition-colors cursor-pointer"
                        title="Edit Comment"
                      >
                        <Edit2 className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() =>
                          deleteCommentMutation.mutate(comment._id)
                        }
                        disabled={deleteCommentMutation.isPending}
                        className="p-1 rounded-md text-textSecondary hover:text-rose-500 transition-colors cursor-pointer"
                        title="Delete Comment"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  )}
                </div>

                {/* Comment Text or Edit Form */}
                {isEditing ? (
                  <div className="space-y-2">
                    <textarea
                      value={editText}
                      onChange={(e) => setEditText(e.target.value)}
                      className="w-full p-2.5 text-xs rounded-xl bg-bgPrimary border border-borderPrimary text-textPrimary outline-none focus:ring-1 focus:ring-primary"
                    />
                    <div className="flex gap-2 justify-end">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setEditingCommentId(null)}
                        className="text-xs rounded-lg"
                      >
                        <Text as="span" size="xs" color="secondary">
                          Cancel
                        </Text>
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => handleSaveEdit(comment._id)}
                        disabled={updateCommentMutation.isPending}
                        className="text-xs rounded-lg bg-primary text-primary-foreground"
                      >
                        <Text as="span" size="xs" font="semiBold" color="white">
                          Save
                        </Text>
                      </Button>
                    </div>
                  </div>
                ) : (
                  <Text
                    as="p"
                    size="sm"
                    color="primary"
                    className="leading-relaxed whitespace-pre-line text-xs md:text-sm"
                  >
                    {comment.text}
                  </Text>
                )}

                {/* Attached Image */}
                {comment.image?.url && (
                  <div className="mt-2 overflow-hidden rounded-xl border border-borderPrimary/40 max-w-sm">
                    <img
                      src={comment.image.url}
                      alt="Attachment"
                      className="max-h-48 object-cover rounded-xl"
                    />
                  </div>
                )}

                {/* Like Button for Comment with UserListTooltip */}
                <div className="flex items-center gap-4 pt-1">
                  <Tooltip
                    position="top"
                    content={
                      <UserListTooltip
                        users={comment.likes as any}
                        type="like"
                      />
                    }
                  >
                    <button
                      onClick={() =>
                        token && likeCommentMutation.mutate(comment._id)
                      }
                      disabled={likeCommentMutation.isPending}
                      className={cn(
                        "flex items-center gap-1 text-[11px] font-semibold transition-colors cursor-pointer p-1 rounded-md hover:bg-rose-500/10",
                        isLiked
                          ? "text-rose-500"
                          : "text-textSecondary hover:text-rose-500",
                      )}
                    >
                      <Heart
                        className={cn(
                          "h-3.5 w-3.5",
                          isLiked && "fill-rose-500 text-rose-500",
                        )}
                      />
                      <Text
                        as="span"
                        size="xs"
                        font="semiBold"
                        className={isLiked ? "text-rose-500" : "text-textSecondary"}
                      >
                        {likesCount}
                      </Text>
                    </button>
                  </Tooltip>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-6">
          <Text as="p" size="xs" color="secondary">
            No comments yet. Be the first to share your thoughts!
          </Text>
        </div>
      )}
    </div>
  );
}
