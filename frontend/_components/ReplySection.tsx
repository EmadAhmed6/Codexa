"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  CornerDownRight,
  Heart,
  User as UserIcon,
  Edit2,
  Trash2,
  Send,
  Loader2,
  Image as ImageIcon,
  X,
} from "lucide-react";
import {
  useGetReplies,
  useAddReply,
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
import UserHoverCard from "@/_components/UserHoverCard";

interface ReplySectionProps {
  postId: string;
  commentId: string;
  replyCommentsCount?: number;
  currentUser?: any;
  token?: string;
}

export default function ReplySection({
  postId,
  commentId,
  replyCommentsCount = 0,
  currentUser,
  token,
}: ReplySectionProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [showInput, setShowInput] = useState(false);

  // Input state
  const [replyText, setReplyText] = useState("");
  const [replyImageFile, setReplyImageFile] = useState<File | null>(null);
  const [replyImagePreview, setReplyImagePreview] = useState<string | null>(null);

  // Edit Reply state
  const [editingReplyId, setEditingReplyId] = useState<string | null>(null);
  const [editReplyText, setEditReplyText] = useState("");
  const [editReplyImageFile, setEditReplyImageFile] = useState<File | null>(null);
  const [editReplyImagePreview, setEditReplyImagePreview] = useState<string | null>(null);

  const { data: replies, isLoading } = useGetReplies(postId, commentId, isOpen || showInput);
  const addReplyMutation = useAddReply(postId, commentId);
  const updateReplyMutation = useUpdateReply(postId, commentId);
  const deleteReplyMutation = useDeleteReply(postId, commentId);
  const likeReplyMutation = useLikeReply(postId, commentId);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setReplyImageFile(file);
      setReplyImagePreview(URL.createObjectURL(file));
    }
  };

  const handleEditImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setEditReplyImageFile(file);
      setEditReplyImagePreview(URL.createObjectURL(file));
    }
  };

  const handlePostReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim() || addReplyMutation.isPending) return;
    try {
      await addReplyMutation.mutateAsync({
        text: replyText.trim(),
        replyImageFile,
      });
      setReplyText("");
      setReplyImageFile(null);
      setReplyImagePreview(null);
      setIsOpen(true);
    } catch {
      // Handled in mutation
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

  const totalRepliesCount = Math.max(
    replyCommentsCount,
    replies ? replies.length : 0,
  );

  return (
    <div className="mt-2 space-y-3">
      {/* Controls Bar: View Replies & Add Reply Buttons */}
      <div className="flex items-center gap-3">
        {totalRepliesCount > 0 && (
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center gap-1 text-[11px] font-semibold text-primary hover:underline cursor-pointer"
          >
            <CornerDownRight className="h-3 w-3" />
            <span>
              {isOpen ? "Hide Replies" : `View Replies (${totalRepliesCount})`}
            </span>
          </button>
        )}

        {token && (
          <button
            onClick={() => {
              setShowInput(!showInput);
              if (!isOpen) setIsOpen(true);
            }}
            className="flex items-center gap-1 text-[11px] font-semibold text-textSecondary hover:text-primary transition-colors cursor-pointer"
          >
            <CornerDownRight className="h-3 w-3" />
            <span>Reply</span>
          </button>
        )}
      </div>

      {/* Add Reply Input Form */}
      {showInput && token && (
        <form
          onSubmit={handlePostReply}
          className="p-3 rounded-xl bg-bgPrimary/80 border border-borderPrimary/60 space-y-2 ml-4 md:ml-6"
        >
          <textarea
            rows={2}
            placeholder="Write a reply..."
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            className="w-full bg-transparent text-textPrimary placeholder:text-textSecondary/50 text-xs outline-none resize-none"
          />

          {replyImagePreview && (
            <div className="relative inline-block rounded-lg overflow-hidden border border-borderPrimary max-h-24">
              <img
                src={replyImagePreview}
                alt="Reply preview"
                className="h-20 object-cover rounded-md"
              />
              <button
                type="button"
                onClick={() => {
                  setReplyImageFile(null);
                  setReplyImagePreview(null);
                }}
                className="absolute top-1 right-1 p-0.5 bg-black/70 rounded-full text-white hover:bg-black transition-colors"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          )}

          <div className="flex items-center justify-between pt-1">
            <label className="flex items-center gap-1 text-[11px] text-textSecondary hover:text-primary transition-colors cursor-pointer">
              <ImageIcon className="h-3.5 w-3.5 text-primary" />
              <span>Attach Image</span>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </label>

            <div className="flex items-center gap-2">
              <Button
                type="button"
                size="sm"
                variant="ghost"
                onClick={() => {
                  setShowInput(false);
                  setReplyText("");
                  setReplyImageFile(null);
                  setReplyImagePreview(null);
                }}
                className="h-7 text-xs rounded-lg px-2.5"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                size="sm"
                disabled={!replyText.trim() || addReplyMutation.isPending}
                className="h-7 text-xs rounded-lg bg-primary text-primary-foreground px-3 font-semibold"
              >
                {addReplyMutation.isPending ? (
                  <Loader2 className="h-3 w-3 animate-spin" />
                ) : (
                  <>
                    <span>Reply</span>
                    <Send className="h-3 w-3 ml-1" />
                  </>
                )}
              </Button>
            </div>
          </div>
        </form>
      )}

      {/* Replies List */}
      {isOpen && (
        <div className="pl-4 md:pl-6 border-l-2 border-primary/20 space-y-3 mt-2">
          {isLoading ? (
            <div className="flex items-center gap-2 py-2 text-xs text-textSecondary">
              <Loader2 className="h-3.5 w-3.5 animate-spin text-primary" />
              <span>Loading replies...</span>
            </div>
          ) : replies && replies.length > 0 ? (
            replies.map((reply: Reply) => {
              const isReplyOwner =
                currentUser &&
                (currentUser._id === reply.user?._id || currentUser.isAdmin);
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

              return (
                <div
                  key={reply._id}
                  className="p-3 rounded-xl bg-bgPrimary/60 border border-borderPrimary/40 space-y-2"
                >
                  {/* Author Header */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {reply.user?._id ? (
                        <UserHoverCard user={reply.user as any}>
                          <Link
                            href={`/profile/${reply.user._id}`}
                            className="flex items-center gap-2 group/replyAuthor hover:opacity-80 transition-opacity"
                          >
                            {reply.user?.profilePicture?.url ? (
                              <img
                                src={reply.user.profilePicture.url}
                                alt={reply.user.username}
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
                                {reply.user?.username || "Anonymous"}
                              </Text>
                              {reply.createdAt && (
                                <Text
                                  as="span"
                                  size="xs"
                                  color="secondary"
                                  className="text-[10px] ml-2"
                                >
                                  {formatRelativeTime(reply.createdAt)}
                                </Text>
                              )}
                            </div>
                          </Link>
                        </UserHoverCard>
                      ) : (
                        <div className="flex items-center gap-2">
                          <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                            <UserIcon className="h-3 w-3" />
                          </div>
                          <Text as="span" size="xs" font="bold" color="primary">
                            Anonymous
                          </Text>
                        </div>
                      )}
                    </div>

                    {/* Owner / Admin Controls */}
                    {isReplyOwner && !isEditingReply && (
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => {
                            setEditingReplyId(reply._id);
                            setEditReplyText(reply.text);
                            setEditReplyImagePreview(replyImageSrc || null);
                            setEditReplyImageFile(null);
                          }}
                          className="p-1 rounded-md text-textSecondary hover:text-primary transition-colors cursor-pointer"
                          title="Edit Reply"
                        >
                          <Edit2 className="h-3 w-3" />
                        </button>
                        <button
                          onClick={() => deleteReplyMutation.mutate(reply._id)}
                          disabled={deleteReplyMutation.isPending}
                          className="p-1 rounded-md text-textSecondary hover:text-rose-500 transition-colors cursor-pointer"
                          title="Delete Reply"
                        >
                          <Trash2 className="h-3 w-3" />
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Reply Content or Edit Form */}
                  {isEditingReply ? (
                    <div className="space-y-2 pt-1">
                      <textarea
                        value={editReplyText}
                        onChange={(e) => setEditReplyText(e.target.value)}
                        className="w-full p-2 text-xs rounded-lg bg-bgPrimary border border-borderPrimary text-textPrimary outline-none focus:ring-1 focus:ring-primary"
                      />

                      {editReplyImagePreview && (
                        <div className="relative inline-block rounded-lg overflow-hidden border border-borderPrimary max-h-24">
                          <img
                            src={editReplyImagePreview}
                            alt="Edit preview"
                            className="h-20 object-cover rounded-md"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              setEditReplyImageFile(null);
                              setEditReplyImagePreview(null);
                            }}
                            className="absolute top-1 right-1 p-0.5 bg-black/70 rounded-full text-white hover:bg-black transition-colors"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </div>
                      )}

                      <div className="flex items-center justify-between pt-1">
                        <label className="flex items-center gap-1 text-[11px] text-textSecondary hover:text-primary transition-colors cursor-pointer">
                          <ImageIcon className="h-3.5 w-3.5 text-primary" />
                          <span>
                            {editReplyImagePreview ? "Change Image" : "Attach Image"}
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
                            className="h-7 text-xs rounded-lg px-2"
                          >
                            Cancel
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => handleSaveEditReply(reply._id)}
                            disabled={updateReplyMutation.isPending}
                            className="h-7 text-xs rounded-lg bg-primary text-primary-foreground px-3"
                          >
                            {updateReplyMutation.isPending ? "Saving..." : "Save"}
                          </Button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <Text
                      as="p"
                      size="xs"
                      color="primary"
                      className="leading-relaxed whitespace-pre-line text-xs"
                    >
                      {reply.text}
                    </Text>
                  )}

                  {/* Attached Reply Image (Only in non-editing mode to prevent duplication) */}
                  {!isEditingReply && replyImageSrc && (
                    <div className="mt-1.5 overflow-hidden rounded-lg border border-borderPrimary/40 max-w-xs">
                      <img
                        src={replyImageSrc}
                        alt="Reply Attachment"
                        className="max-h-36 object-cover rounded-lg"
                      />
                    </div>
                  )}

                  {/* Reply Like Action */}
                  <div className="flex items-center gap-2 pt-0.5">
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
                          "flex items-center gap-1 text-[10px] font-semibold transition-colors cursor-pointer p-0.5 rounded-md hover:bg-rose-500/10",
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
              No replies yet. Be the first to reply!
            </Text>
          )}
        </div>
      )}
    </div>
  );
}
