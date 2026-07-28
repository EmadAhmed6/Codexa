"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  CornerDownRight,
  Heart,
  User as UserIcon,
  Edit2,
  Trash2,
  Loader2,
  Image as ImageIcon,
  X,
  Reply as ReplyIcon,
} from "lucide-react";
import {
  useGetReplies,
  useUpdateReply,
  useDeleteReply,
  useLikeReply,
} from "@/_features/posts/hooks";
import { Reply } from "@/_features/posts/types/Post";
import { formatRelativeTime } from "@/lib/utils";
import { Text } from "@/_components/Text";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Tooltip from "@/_components/Tooltip";
import UserListTooltip from "@/_components/UserListTooltip";
import ActionMenu from "@/_components/ActionMenu";
import { useLanguage } from "@/context/LanguageContext";

interface ReplySectionProps {
  postId: string;
  commentId: string;
  commentAuthorName?: string;
  commentAuthorId?: string;
  replyCommentsCount?: number;
  currentUser?: any;
  token?: string;
  onReplyTo?: (targetAuthorName: string, targetUserId?: string) => void;
  onCloseModal?: () => void;
}

export default function ReplySection({
  postId,
  commentId,
  commentAuthorName,
  commentAuthorId,
  replyCommentsCount = 0,
  currentUser,
  token,
  onReplyTo,
  onCloseModal,
}: ReplySectionProps) {
  const { t, isArabic } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);

  // Edit Reply state
  const [editingReplyId, setEditingReplyId] = useState<string | null>(null);
  const [editReplyText, setEditReplyText] = useState("");
  const [editReplyImageFile, setEditReplyImageFile] = useState<File | null>(null);
  const [editReplyImagePreview, setEditReplyImagePreview] = useState<string | null>(null);

  const { data: replies, isLoading } = useGetReplies(postId, commentId, isOpen);
  const updateReplyMutation = useUpdateReply(postId, commentId);
  const deleteReplyMutation = useDeleteReply(postId, commentId);
  const likeReplyMutation = useLikeReply(postId, commentId);

  const handleEditImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setEditReplyImageFile(file);
      setEditReplyImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSaveEditReply = async (replyCommentId: string) => {
    if (!editReplyText.trim() || updateReplyMutation.isPending) return;
    try {
      await updateReplyMutation.mutateAsync({
        replyCommentId,
        text: editReplyText.trim(),
        replyImageFile: editReplyImageFile,
      });
      setEditingReplyId(null);
      setEditReplyText("");
      setEditReplyImageFile(null);
      setEditReplyImagePreview(null);
    } catch {
      // Handled in mutation
    }
  };

  const handleTriggerReply = (authorName?: string, userId?: string) => {
    const targetAuthor = authorName || commentAuthorName || "User";
    if (onReplyTo) {
      onReplyTo(targetAuthor, userId);
    }
  };

  const totalRepliesCount = Math.max(
    replyCommentsCount,
    replies ? replies.length : 0,
  );

  // Render mention as a clickable Link to target user profile
  const renderReplyTextWithMention = (text: string, replyAuthorId?: string) => {
    const mentionRegex = /^(@[^\s]+(?:\s+[^\s]+)?)/;
    const match = text.match(mentionRegex);

    if (match) {
      const mention = match[1];
      const rest = text.slice(mention.length);

      const mentionNameClean = mention.replace(/^@/, "").trim().toLowerCase();

      let targetUserId: string | undefined = undefined;

      // 1. Check if mention matches the parent comment author
      if (
        commentAuthorId &&
        commentAuthorName &&
        commentAuthorName.toLowerCase() === mentionNameClean
      ) {
        targetUserId = commentAuthorId;
      }

      // 2. Check if mention matches any replier in the current thread
      if (!targetUserId && replies) {
        const foundReply = replies.find(
          (r) =>
            (r.user?.fullName && r.user.fullName.toLowerCase() === mentionNameClean) ||
            (r.user?.username && r.user.username.toLowerCase() === mentionNameClean),
        );
        if (foundReply && foundReply.user?._id) {
          targetUserId = foundReply.user._id;
        }
      }

      // 3. Fallback to commentAuthorId if targetUserId is still unknown (never use replyAuthorId)
      const finalTargetId = targetUserId || commentAuthorId;

      return (
        <>
          {finalTargetId ? (
            <Link
              href={`/profile/${finalTargetId}`}
              onClick={(e) => {
                e.stopPropagation();
                onCloseModal?.();
              }}
              className="font-bold text-primary bg-primary/10 hover:bg-primary/20 transition-colors px-1.5 py-0.5 rounded-md ltr:mr-1 rtl:ml-1 inline-block text-xs cursor-pointer hover:underline"
            >
              {mention}
            </Link>
          ) : (
            <span className="font-bold text-primary bg-primary/10 px-1.5 py-0.5 rounded-md ltr:mr-1 rtl:ml-1 inline-block text-xs">
              {mention}
            </span>
          )}
          {rest}
        </>
      );
    }
    return text;
  };

  return (
    <div className="mt-2 space-y-3">
      {/* Controls Bar: View Replies Toggle */}
      {totalRepliesCount > 0 && (
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center gap-1 text-[11px] font-semibold text-primary hover:underline cursor-pointer"
          >
            <CornerDownRight className="h-3 w-3" />
            <span>
              {isOpen
                ? isArabic
                  ? "إخفاء الردود"
                  : "Hide Replies"
                : isArabic
                  ? `عرض الردود (${totalRepliesCount})`
                  : `View Replies (${totalRepliesCount})`}
            </span>
          </button>
        </div>
      )}

      {/* Replies List */}
      {isOpen && (
        <div className="ltr:pl-3 rtl:pr-3 md:ltr:pl-5 md:rtl:pr-5 ltr:border-l-2 rtl:border-r-2 border-primary/20 space-y-3 mt-2">
          {isLoading ? (
            <div className="flex items-center gap-2 py-2 text-xs text-textSecondary">
              <Loader2 className="h-3.5 w-3.5 animate-spin text-primary" />
              <span>{isArabic ? "جاري تحميل الردود..." : "Loading replies..."}</span>
            </div>
          ) : replies && replies.length > 0 ? (
            replies.map((reply: Reply) => {
              const isReplyOwner = Boolean(
                currentUser &&
                  (currentUser._id === reply.user?._id ||
                    (currentUser as any)?.id === reply.user?._id)
              );
              const isReplyOwnerOrAdmin = Boolean(
                currentUser && (isReplyOwner || currentUser.isAdmin)
              );
              const isEditingReply = editingReplyId === reply._id;
              const replyImageSrc =
                reply.commentImage?.url || reply.image?.url;

              const isLiked = currentUser
                ? Array.isArray(reply.likes) &&
                  reply.likes.some((like) =>
                    typeof like === "string"
                      ? like === currentUser._id
                      : like._id === currentUser._id,
                  )
                : false;

              const likesCount =
                reply.replyLikesCount !== undefined
                  ? reply.replyLikesCount
                  : Array.isArray(reply.likes)
                    ? reply.likes.length
                    : 0;

              const replyAuthorDisplayName =
                reply.user?.fullName || reply.user?.username || (isArabic ? "مجهول" : "Anonymous");

              return (
                <div
                  key={reply._id}
                  className="p-3.5 rounded-2xl bg-bgSecondary/50 border border-borderPrimary/40 space-y-2.5"
                >
                  {/* Author Header */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {reply.user?._id ? (
                        <Link
                          href={`/profile/${reply.user._id}`}
                          onClick={() => onCloseModal?.()}
                          className="flex items-center gap-2 group/replyAuthor hover:opacity-80 transition-opacity"
                        >
                          {reply.user?.profilePicture?.url ? (
                            <img
                              src={reply.user.profilePicture.url}
                              alt={replyAuthorDisplayName}
                              className="h-6 w-6 rounded-full object-cover border border-borderPrimary"
                            />
                          ) : (
                            <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                              <UserIcon className="h-3 w-3" />
                            </div>
                          )}
                          <div>
                            <Text
                              as="span"
                              size="xs"
                              font="bold"
                              color="primary"
                              className="group-hover/replyAuthor:text-primary group-hover/replyAuthor:underline text-xs"
                            >
                              {replyAuthorDisplayName}
                            </Text>
                            {reply.createdAt && (
                              <Text
                                as="span"
                                size="xs"
                                color="secondary"
                                className="text-[10px] ltr:ml-2 rtl:mr-2"
                              >
                                {formatRelativeTime(reply.createdAt)}
                              </Text>
                            )}
                          </div>
                        </Link>
                      ) : (
                        <div className="flex items-center gap-2">
                          <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                            <UserIcon className="h-3 w-3" />
                          </div>
                          <Text as="span" size="xs" font="bold" color="primary">
                            {isArabic ? "مجهول" : "Anonymous"}
                          </Text>
                        </div>
                      )}
                    </div>

                    {/* Owner / Admin Controls Menu */}
                    {isReplyOwnerOrAdmin && !isEditingReply && (
                      <ActionMenu
                        onEdit={
                          isReplyOwner
                            ? () => {
                                setEditingReplyId(reply._id);
                                setEditReplyText(reply.text);
                                setEditReplyImagePreview(replyImageSrc || null);
                                setEditReplyImageFile(null);
                              }
                            : undefined
                        }
                        onDelete={() => deleteReplyMutation.mutate(reply._id)}
                        editLabel={t.post.editComment}
                        deleteLabel={t.post.deleteComment}
                      />
                    )}
                  </div>

                  {/* Reply Content or Edit Form */}
                  {isEditingReply ? (
                    <div className="space-y-2 pt-1">
                      <textarea
                        value={editReplyText}
                        onChange={(e) => setEditReplyText(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && !e.shiftKey) {
                            e.preventDefault();
                            handleSaveEditReply(reply._id);
                          }
                        }}
                        className="w-full p-2.5 text-xs rounded-xl bg-bgPrimary border border-borderPrimary text-textPrimary outline-none focus:ring-1 focus:ring-primary"
                      />

                      {editReplyImagePreview && (
                        <div className="relative inline-block rounded-xl overflow-hidden border border-borderPrimary max-h-24">
                          <img
                            src={editReplyImagePreview}
                            alt="Edit preview"
                            className="h-20 object-cover rounded-xl"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              setEditReplyImageFile(null);
                              setEditReplyImagePreview(null);
                            }}
                            className="absolute top-1 ltr:right-1 rtl:left-1 p-0.5 bg-black/70 rounded-full text-white hover:bg-black transition-colors"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </div>
                      )}

                      <div className="flex items-center justify-between pt-1">
                        <label className="flex items-center gap-1 text-[11px] text-textSecondary hover:text-primary transition-colors cursor-pointer">
                          <ImageIcon className="h-3.5 w-3.5 text-primary" />
                          <span>
                            {editReplyImagePreview ? t.post.changeImage : t.post.attachImage}
                          </span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleEditImageChange}
                            className="hidden"
                          />
                        </label>

                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => {
                              setEditingReplyId(null);
                              setEditReplyImageFile(null);
                              setEditReplyImagePreview(null);
                            }}
                            className="h-7 text-xs rounded-lg px-2.5 cursor-pointer"
                          >
                            {t.post.cancel}
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => handleSaveEditReply(reply._id)}
                            disabled={updateReplyMutation.isPending}
                            className="h-7 text-xs rounded-lg bg-primary text-primary-foreground px-3 font-semibold cursor-pointer"
                          >
                            {updateReplyMutation.isPending ? t.post.saving : t.post.save}
                          </Button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <Text
                      as="p"
                      size="xs"
                      color="primary"
                      className="leading-relaxed whitespace-pre-line text-xs sm:text-sm"
                    >
                      {renderReplyTextWithMention(reply.text, reply.user?._id)}
                    </Text>
                  )}

                  {/* Attached Reply Image */}
                  {!isEditingReply && replyImageSrc && (
                    <div className="mt-1.5 overflow-hidden rounded-xl border border-borderPrimary/40 max-w-xs">
                      <img
                        src={replyImageSrc}
                        alt="Reply Attachment"
                        className="max-h-36 object-cover rounded-xl"
                      />
                    </div>
                  )}

                  {/* Reply Action Row: Like */}
                  <div className="flex items-center gap-4 pt-1">
                    <Tooltip
                      position="top"
                      content={
                        <UserListTooltip
                          users={reply.likes as any}
                          type="like"
                        />
                      }
                    >
                      <button
                        onClick={() => token && likeReplyMutation.mutate(reply._id)}
                        disabled={likeReplyMutation.isPending}
                        className={cn(
                          "flex items-center gap-1 text-[11px] font-semibold transition-colors cursor-pointer p-0.5 rounded-md hover:bg-rose-500/10",
                          isLiked
                            ? "text-rose-500"
                            : "text-textSecondary hover:text-rose-500",
                        )}
                      >
                        <Heart
                          className={cn(
                            "h-3 w-3",
                            isLiked && "fill-rose-500 text-rose-500",
                          )}
                        />
                        <span>{likesCount}</span>
                      </button>
                    </Tooltip>
                  </div>
                </div>
              );
            })
          ) : (
            <Text as="p" size="xs" color="secondary" className="italic text-xs py-1">
              {isArabic ? "مفيش ردود لسه. خليك أول واحد يرد!" : "No replies yet. Be the first to reply!"}
            </Text>
          )}
        </div>
      )}
    </div>
  );
}
