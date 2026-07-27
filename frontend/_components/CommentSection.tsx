"use client";

import React, { useState, useRef } from "react";
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
  Reply as ReplyIcon,
} from "lucide-react";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import {
  useGetComments,
  useAddComment,
  useUpdateComment,
  useDeleteComment,
  useLikeComment,
} from "@/_features/posts/hooks";
import { addReply } from "@/_features/posts/api/addReply";
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
import { cn, formatRelativeTime } from "@/lib/utils";
import { Text } from "@/_components/Text";
import Tooltip from "@/_components/Tooltip";
import UserListTooltip from "@/_components/UserListTooltip";
import ReplySection from "@/_components/ReplySection";
import ActionMenu from "@/_components/ActionMenu";
import { useLanguage } from "@/context/LanguageContext";

interface CommentSectionProps {
  postId: string;
  hideHeader?: boolean;
  isModal?: boolean;
  onCloseModal?: () => void;
}

interface ReplyingToState {
  commentId: string;
  authorName: string;
  authorUserId?: string;
}

export default function CommentSection({
  postId,
  hideHeader = false,
  isModal = false,
  onCloseModal,
}: CommentSectionProps) {
  const queryClient = useQueryClient();
  const token = Cookies.get("token");
  const { data: currentUser } = useGetAuthMeQuery();
  const { data: comments, isLoading } = useGetComments(postId);
  const { t, isArabic } = useLanguage();

  const addCommentMutation = useAddComment(postId);
  const updateCommentMutation = useUpdateComment(postId);
  const deleteCommentMutation = useDeleteComment(postId);
  const likeCommentMutation = useLikeComment(postId);

  // Dynamic Reply Mutation from main comment box
  const addReplyMutation = useMutation({
    mutationFn: (data: { commentId: string; text: string; replyImageFile?: File | null }) =>
      addReply({ postId, ...data }),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["replies", postId, variables.commentId] });
      queryClient.invalidateQueries({ queryKey: ["comments", postId] });
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      queryClient.invalidateQueries({ queryKey: ["post", postId] });
    },
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  // Active reply state
  const [replyingTo, setReplyingTo] = useState<ReplyingToState | null>(null);

  // Edit Comment state
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [editText, setEditText] = useState("");
  const [editImageFile, setEditImageFile] = useState<File | null>(null);
  const [editImagePreview, setEditImagePreview] = useState<string | null>(null);

  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    clearErrors,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ICommentForm>({
    resolver: zodResolver(commentFormSchema as any),
    mode: "onSubmit",
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

  const handleEditImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setEditImageFile(file);
      setEditImagePreview(URL.createObjectURL(file));
    }
  };

  // Start Reply Callback from any comment or sub-reply
  const handleStartReply = (commentId: string, authorName: string, authorUserId?: string) => {
    setReplyingTo({ commentId, authorName, authorUserId });
    const mentionPrefix = `@${authorName} `;
    let currentText = watchText;
    if (!currentText.startsWith(mentionPrefix)) {
      currentText = `${mentionPrefix}${currentText.replace(/^@[^\s]+(?:\s+[^\s]+)?\s*/, "")}`;
      setValue("text", currentText);
    }
    setTimeout(() => {
      if (textareaRef.current) {
        textareaRef.current.focus();
        const len = textareaRef.current.value.length;
        textareaRef.current.setSelectionRange(len, len);
      }
    }, 60);
  };

  const onSubmitComment = async (data: ICommentForm) => {
    try {
      if (imageFile) {
        setIsUploading(true);
      }

      if (replyingTo) {
        await addReplyMutation.mutateAsync({
          commentId: replyingTo.commentId,
          text: data.text.trim(),
          replyImageFile: imageFile,
        });
        setReplyingTo(null);
      } else {
        await addCommentMutation.mutateAsync({
          text: data.text.trim(),
          commentImageFile: imageFile,
        });
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
      setIsUploading(true);
      await updateCommentMutation.mutateAsync({
        commentId,
        text: editText.trim(),
        commentImageFile: editImageFile,
      });

      setEditingCommentId(null);
      setEditText("");
      setEditImageFile(null);
      setEditImagePreview(null);
    } catch {
      // Handled in mutation
    } finally {
      setIsUploading(false);
    }
  };

  const commentsCount = comments ? comments.length : 0;

  const { ref: registerTextRef, ...textRegisterProps } = register("text", {
    onChange: () => clearErrors("text"),
  });

  // Render Form Component
  const renderCommentForm = () => (
    token ? (
      <form onSubmit={handleSubmit(onSubmitComment)} className="w-full">
        <div className="rounded-xl bg-bgSecondary/90 border border-borderPrimary/50 shadow-xs focus-within:border-primary/50 transition-all p-2 sm:p-2.5">
          {/* Active Replying-To Banner */}
          {replyingTo && (
            <div className="flex items-center justify-between px-3 py-1.5 mb-2 rounded-lg bg-primary/10 border border-primary/20 text-xs text-primary font-semibold animate-in fade-in duration-150">
              <div className="flex items-center gap-1.5">
                <ReplyIcon className="h-3.5 w-3.5" />
                <span>
                  {isArabic ? `رد على ${replyingTo.authorName}` : `Replying to ${replyingTo.authorName}`}
                </span>
              </div>
              <button
                type="button"
                onClick={() => {
                  setReplyingTo(null);
                  setValue("text", "");
                }}
                className="p-0.5 rounded-md hover:bg-primary/20 text-primary transition-colors cursor-pointer"
                title="Cancel reply"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          )}

          <textarea
            ref={(e) => {
              registerTextRef(e);
              textareaRef.current = e;
            }}
            rows={1}
            placeholder={
              replyingTo
                ? isArabic
                  ? `اكتب رداً على ${replyingTo.authorName}...`
                  : `Write a reply to ${replyingTo.authorName}...`
                : t.post.commentPlaceholder
            }
            {...textRegisterProps}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSubmit(onSubmitComment)();
              }
            }}
            className="w-full bg-transparent text-textPrimary placeholder:text-textSecondary/50 outline-none resize-none text-xs py-0.5"
          />
          <Error error={errors.text?.message} />

          {/* Optional Image Preview */}
          {imagePreview && (
            <div className="relative inline-block mt-1 rounded-lg overflow-hidden border border-borderPrimary max-h-20">
              <img
                src={imagePreview}
                alt="Upload preview"
                className="h-16 object-cover"
              />
              <button
                type="button"
                onClick={() => {
                  setImageFile(null);
                  setImagePreview(null);
                }}
                className="absolute top-1 ltr:right-1 rtl:left-1 p-0.5 bg-black/70 rounded-full text-white hover:bg-black transition-colors cursor-pointer"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          )}

          {/* Bottom Actions Bar */}
          <div className="flex items-center justify-between border-t border-borderPrimary/30 pt-1.5 mt-1">
            <div className="flex items-center gap-3">
              <label className="flex items-center gap-1 text-xs text-textSecondary hover:text-primary transition-colors cursor-pointer">
                <ImageIcon className="h-3.5 w-3.5 text-primary" />
                <Text as="span" size="xs" font="medium" color="secondary" className="text-[11px]">
                  {t.post.attachImage}
                </Text>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>

              <Text as="span" size="xs" color="secondary" className="text-[10px]">
                {watchText.length}/500
              </Text>
            </div>

            <Button
              type="submit"
              size="sm"
              disabled={
                !watchText.trim() ||
                addCommentMutation.isPending ||
                addReplyMutation.isPending ||
                isUploading
              }
              className="rounded-xl bg-primary hover:bg-primaryHover text-primary-foreground font-semibold cursor-pointer h-7 text-[11px] px-3 py-1"
            >
              {addCommentMutation.isPending || addReplyMutation.isPending || isUploading ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <>
                  <Text as="span" size="xs" font="semiBold" color="white" className="text-[11px]">
                    {replyingTo ? (isArabic ? "رد" : "Reply") : t.post.postComment}
                  </Text>
                  <Send className="h-3 w-3 ltr:ml-1 rtl:mr-1 rtl:-scale-x-1" />
                </>
              )}
            </Button>
          </div>
        </div>
      </form>
    ) : (
      <div className="p-2.5 rounded-xl bg-bgSecondary/40 border border-borderPrimary/40 text-center">
        <Text as="p" size="xs" color="secondary">
          {t.post.loginToComment}
        </Text>
      </div>
    )
  );

  // Render Comment List Items
  const renderCommentsList = () => (
    isLoading ? (
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

          const commentAuthorDisplayName =
            comment.user?.fullName || comment.user?.username || t.post.anonymous;

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
                      onClick={() => onCloseModal?.()}
                      className="flex items-center gap-2.5 group/commentAuthor hover:opacity-80 transition-opacity"
                    >
                      {comment.user?.profilePicture?.url ? (
                        <img
                          src={comment.user.profilePicture.url}
                          alt={commentAuthorDisplayName}
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
                          {commentAuthorDisplayName}
                        </Text>
                        {comment.createdAt && (
                          <Text
                            as="span"
                            size="xs"
                            color="secondary"
                            className="text-[10px] ltr:ml-2 rtl:mr-2"
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
                          {t.post.anonymous}
                        </Text>
                        {comment.createdAt && (
                          <Text
                            as="span"
                            size="xs"
                            color="secondary"
                            className="text-[10px] ltr:ml-2 rtl:mr-2"
                          >
                            {formatRelativeTime(comment.createdAt)}
                          </Text>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Edit & Delete Comment Action Menu */}
                {isOwner && !isEditing && (
                  <ActionMenu
                    onEdit={() => {
                      setEditingCommentId(comment._id);
                      setEditText(comment.text);
                      setEditImagePreview(comment.commentImage?.url || (comment as any).image?.url || null);
                      setEditImageFile(null);
                    }}
                    onDelete={() => deleteCommentMutation.mutate(comment._id)}
                    editLabel={t.post.editComment}
                    deleteLabel={t.post.deleteComment}
                  />
                )}
              </div>

              {/* Comment Content / Edit Form */}
              {isEditing ? (
                <div className="space-y-2 pt-1">
                  <textarea
                    rows={2}
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        handleSaveEdit(comment._id);
                      }
                    }}
                    className="w-full p-2.5 text-xs rounded-xl bg-bgPrimary border border-borderPrimary text-textPrimary outline-none focus:ring-1 focus:ring-primary resize-none"
                  />

                  {/* Edit Image Preview */}
                  {editImagePreview && (
                    <div className="relative inline-block rounded-xl overflow-hidden border border-borderPrimary max-h-24">
                      <img
                        src={editImagePreview}
                        alt="Edit preview"
                        className="h-20 object-cover rounded-xl"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setEditImageFile(null);
                          setEditImagePreview(null);
                        }}
                        className="absolute top-1 ltr:right-1 rtl:left-1 p-0.5 bg-black/70 rounded-full text-white hover:bg-black transition-colors cursor-pointer"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-1">
                    <label className="flex items-center gap-1 text-xs text-textSecondary hover:text-primary transition-colors cursor-pointer">
                      <ImageIcon className="h-3.5 w-3.5 text-primary" />
                      <Text as="span" size="xs" font="medium" color="secondary" className="text-[11px]">
                        {editImagePreview ? t.post.changeImage : t.post.attachImage}
                      </Text>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleEditImageChange}
                        className="hidden"
                      />
                    </label>

                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => {
                          setEditingCommentId(null);
                          setEditImageFile(null);
                          setEditImagePreview(null);
                        }}
                        className="h-7 text-xs rounded-lg px-2.5 cursor-pointer"
                      >
                        {t.post.cancel}
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => handleSaveEdit(comment._id)}
                        disabled={updateCommentMutation.isPending || isUploading}
                        className="h-7 text-xs rounded-lg bg-primary text-primary-foreground px-3 cursor-pointer"
                      >
                        {updateCommentMutation.isPending || isUploading ? (
                          <Loader2 className="h-3 w-3 animate-spin" />
                        ) : (
                          t.post.save
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              ) : (
                <>
                  <Text
                    as="p"
                    size="xs"
                    color="primary"
                    className="leading-relaxed whitespace-pre-wrap text-xs sm:text-sm"
                  >
                    {comment.text}
                  </Text>

                  {/* Comment Image */}
                  {(comment.commentImage?.url || comment.image?.url) && (
                    <div className="mt-2 rounded-xl overflow-hidden border border-borderPrimary/40 max-w-md">
                      <img
                        src={comment.commentImage?.url || comment.image?.url}
                        alt="Comment attachment"
                        className="w-full h-auto max-h-64 object-cover"
                      />
                    </div>
                  )}
                </>
              )}

              {/* Like Button & Reply Action for Comment */}
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

                {token && (
                  <button
                    type="button"
                    onClick={() => handleStartReply(comment._id, commentAuthorDisplayName, comment.user?._id)}
                    className="flex items-center gap-1 text-[11px] font-semibold text-textSecondary hover:text-primary transition-colors cursor-pointer"
                  >
                    <ReplyIcon className="h-3.5 w-3.5" />
                    <span>{t.post.reply}</span>
                  </button>
                )}
              </div>

              {/* Reply Section Component */}
              <ReplySection
                postId={postId}
                commentId={comment._id}
                commentAuthorName={commentAuthorDisplayName}
                commentAuthorId={comment.user?._id}
                replyCommentsCount={comment.replyCommentsCount}
                currentUser={currentUser}
                token={token}
                onReplyTo={(targetAuthorName, targetUserId) =>
                  handleStartReply(comment._id, targetAuthorName, targetUserId)
                }
                onCloseModal={onCloseModal}
              />
            </div>
          );
        })}
      </div>
    ) : (
      <div className="text-center py-8">
        <Text as="p" size="xs" color="secondary">
          {t.post.noCommentsYet}
        </Text>
      </div>
    )
  );

  // If in Modal view: Flex layout with scrollable list in middle and pinned input at bottom
  if (isModal) {
    return (
      <div className="flex flex-col h-full overflow-hidden">
        {/* Scrollable Comments Thread */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 custom-scrollbar">
          {renderCommentsList()}
        </div>

        {/* Pinned Input Form at Modal Bottom */}
        <div className="p-4 border-t border-borderPrimary/40 bg-bgSecondary/95 backdrop-blur-md shrink-0">
          {renderCommentForm()}
        </div>
      </div>
    );
  }

  // Standard Page View
  return (
    <div className="space-y-6 pb-24">
      {!hideHeader && (
        <div className="flex items-center gap-2 pb-3 border-b border-borderPrimary/40">
          <MessageSquare className="h-5 w-5 text-primary" />
          <Text as="h3" size="lg" font="bold" color="primary">
            {t.post.discussionComments} ({commentsCount})
          </Text>
        </div>
      )}

      {renderCommentsList()}

      {/* Fixed Floating Bottom Comment Box (Sized to box only) */}
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 w-full max-w-4xl px-4 sm:px-6 z-40 pointer-events-none">
        <div className="pointer-events-auto shadow-2xl rounded-2xl">
          {renderCommentForm()}
        </div>
      </div>
    </div>
  );
}
