"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  CornerDownRight,
  Heart,
  User as UserIcon,
  Loader2,
} from "lucide-react";
import {
  useGetReplies,
  useDeleteReply,
  useLikeReply,
} from "@/_features/posts/hooks";
import { Reply } from "@/_features/posts/types/Post";
import { formatRelativeTime } from "@/lib/utils";
import { Text } from "@/_components/Text";
import { cn } from "@/lib/utils";
import Tooltip from "@/_components/Tooltip";
import UserListTooltip from "@/_components/UserListTooltip";
import ActionMenu from "@/_components/ActionMenu";
import ImageModal from "@/_components/ImageModal";
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
  /** Called when user clicks "Edit Reply" — passes data up to CommentSection's shared bottom form */
  onEditReply?: (replyId: string, commentId: string, text: string, imageUrl?: string) => void;
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
  onEditReply,
}: ReplySectionProps) {
  const { t, isArabic } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const { data: replies, isLoading } = useGetReplies(postId, commentId, isOpen);
  const deleteReplyMutation = useDeleteReply(postId, commentId);
  const likeReplyMutation = useLikeReply(postId, commentId);

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

      // 3. Fallback to commentAuthorId if targetUserId is still unknown
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
                currentUser &&
                (isReplyOwner ||
                  currentUser.role === "SuperAdmin" ||
                  (currentUser.role === "Admin" && (reply.user as any)?.role !== "SuperAdmin"))
              );
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

                    {/* Owner / Admin Controls Menu — Edit triggers parent form */}
                    {isReplyOwnerOrAdmin && (
                      <ActionMenu
                        onEdit={
                          isReplyOwner && onEditReply
                            ? () => onEditReply(reply._id, commentId, reply.text, replyImageSrc)
                            : undefined
                        }
                        onDelete={() => deleteReplyMutation.mutate(reply._id)}
                        editLabel={t.post.editComment}
                        deleteLabel={t.post.deleteComment}
                      />
                    )}
                  </div>

                  {/* Reply Text */}
                  <Text
                    as="p"
                    size="xs"
                    color="primary"
                    dir="auto"
                    className="leading-relaxed whitespace-pre-line text-xs sm:text-sm bidi-text"
                  >
                    {renderReplyTextWithMention(reply.text, reply.user?._id)}
                  </Text>

                  {/* Attached Reply Image */}
                  {replyImageSrc && (
                    <div className="mt-2 overflow-hidden rounded-xl border border-borderPrimary/40 max-w-md bg-bgPrimary/30 inline-block group/replyImg">
                      <img
                        src={replyImageSrc}
                        alt="Reply Attachment"
                        onClick={() => setSelectedImage(replyImageSrc)}
                        className="max-h-80 w-auto h-auto object-contain rounded-xl cursor-pointer hover:opacity-90 transition-opacity"
                      />
                    </div>
                  )}

                  {/* Reply Action Row: Like + Reply */}
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

                    {token && (
                      <button
                        type="button"
                        onClick={() => handleTriggerReply(replyAuthorDisplayName, reply.user?._id)}
                        className="flex items-center gap-1 text-[11px] font-semibold text-textSecondary hover:text-primary transition-colors cursor-pointer"
                      >
                        <CornerDownRight className="h-3 w-3" />
                        <span>{t.post.reply}</span>
                      </button>
                    )}
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

      {/* Full Image Preview Modal */}
      <ImageModal
        src={selectedImage}
        onClose={() => setSelectedImage(null)}
      />
    </div>
  );
}
