"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Heart,
  MessageSquare,
  Share2,
  Calendar,
  User as UserIcon,
  Edit2,
  Trash2,
  Repeat,
} from "lucide-react";
import { Post } from "@/_features/posts/types/Post";
import {
  useLikePost,
  useSharePost,
  useDeletePost,
} from "@/_features/posts/hooks";
import { useGetAuthMeQuery } from "@/_features/auth/hooks";
import Cookies from "js-cookie";
import EditPostModal from "./EditPostModal";
import DeleteConfirmModal from "./DeleteConfirmModal";
import { formatRelativeTime } from "@/lib/utils";
import { Text } from "@/_components/Text";
import Tooltip from "@/_components/Tooltip";
import UserListTooltip from "@/_components/UserListTooltip";
import UserHoverCard from "@/_components/UserHoverCard";
import { useLanguage } from "@/context/LanguageContext";

interface PostCardProps {
  post: Post;
}

export default function PostCard({ post }: PostCardProps) {
  const token = Cookies.get("token");
  const { data: currentUser } = useGetAuthMeQuery();
  const { t } = useLanguage();

  const likePostMutation = useLikePost();
  const sharePostMutation = useSharePost();
  const deletePostMutation = useDeletePost();

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const currentUserId = currentUser?._id || (currentUser as any)?.id;
  const postUserId =
    typeof post.user === "string"
      ? post.user
      : post.user?._id || (post.user as any)?.id;

  // Determine display author (If shared post, display original post author)
  const displayAuthor =
    post.sharedPost &&
    typeof post.sharedPost === "object" &&
    post.sharedPost.user
      ? post.sharedPost.user
      : post.user;

  // Check if current user is owner of this post OR Admin
  const isOwnerOrAdmin = Boolean(
    currentUser &&
      currentUserId &&
      postUserId &&
      (String(postUserId) === String(currentUserId) || currentUser.isAdmin),
  );

  // Derived like status from server data
  const isLikedFromServer = Boolean(
    currentUserId &&
    Array.isArray(post.likes) &&
    post.likes.some((item) => {
      const id = typeof item === "string" ? item : item?._id;
      return id === currentUserId;
    }),
  );

  const [userLikedState, setUserLikedState] = useState<boolean | null>(null);
  const [likesCountDelta, setLikesCountDelta] = useState<number>(0);

  // Reset local overrides when server post data updates
  useEffect(() => {
    setUserLikedState(null);
    setLikesCountDelta(0);
  }, [post.likes, post.likesCount]);

  const isLiked = userLikedState !== null ? userLikedState : isLikedFromServer;

  const baseLikesCount =
    post.likesCount !== undefined
      ? post.likesCount
      : Array.isArray(post.likes)
        ? post.likes.length
        : 0;

  const displayLikesCount = Math.max(0, baseLikesCount + likesCountDelta);

  const commentsCount =
    post.commentsCount !== undefined
      ? post.commentsCount
      : Array.isArray(post.comments)
        ? post.comments.length
        : 0;

  const sharesCount =
    post.sharesCount !== undefined
      ? post.sharesCount
      : Array.isArray(post.shares)
        ? post.shares.length
        : 0;

  const formattedDate = formatRelativeTime(post.createdAt);

  const handleLike = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!token) return;

    if (isLiked) {
      setUserLikedState(false);
      setLikesCountDelta((prev) => prev - 1);
    } else {
      setUserLikedState(true);
      setLikesCountDelta((prev) => prev + 1);
    }

    likePostMutation.mutate(post._id);
  };

  const handleShare = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    sharePostMutation.mutate(post._id);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await deletePostMutation.mutateAsync(post._id);
      setIsDeleteModalOpen(false);
    } catch {
      // Handled in mutation
    }
  };

  const handleOpenEdit = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsEditModalOpen(true);
  };

  const translatedCategory =
    post.category && t.categories[post.category as keyof typeof t.categories]
      ? t.categories[post.category as keyof typeof t.categories]
      : post.category || t.post.general;

  return (
    <>
      <article className="group flex flex-col justify-between bg-bgSecondary/60 hover:bg-bgSecondary border border-borderPrimary/50 hover:border-primary/40 rounded-2xl p-5 md:p-6 shadow-xs hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 relative overflow-visible">
        {/* Full Card Link Overlay */}
        <Link
          href={`/posts/${post._id}`}
          className="absolute inset-0 z-0"
          aria-label={post.title || t.post.viewArticle}
        />

        {/* Featured Cover Image */}
        {(post.postImage?.url || post.image?.url) && (
          <div className="block mb-4 overflow-hidden rounded-xl border border-borderPrimary/30 aspect-video relative z-10 pointer-events-none">
            <img
              src={post.postImage?.url || post.image?.url}
              alt={post.title || "Cover Image"}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </div>
        )}

        {/* Post Content */}
        <div className="flex-1 flex flex-col justify-between relative z-10 pointer-events-none">
          <div>
            {/* Header Info: Category Badge, Date, & Owner/Admin Controls */}
            <div className="flex items-center justify-between gap-2 mb-3">
              <div className="flex items-center gap-2">
                <Text
                  as="span"
                  size="xs"
                  font="bold"
                  color="primary"
                  className="inline-block text-[11px] uppercase tracking-wide px-2.5 py-1 rounded-md bg-primary/10 border border-primary/20"
                >
                  {translatedCategory}
                </Text>
                {post.sharedPost && (
                  <Text
                    as="span"
                    size="xs"
                    font="semiBold"
                    color="primary"
                    className="inline-flex items-center gap-1 text-[10px] bg-primary/5 px-2 py-0.5 rounded-md border border-primary/10"
                  >
                    <Repeat className="h-3 w-3" />
                    {t.post.shared}
                  </Text>
                )}
              </div>

              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1">
                  <Calendar className="h-3 w-3 text-textSecondary" />
                  <Text as="span" size="xs" font="medium" color="secondary" className="text-[11px]">
                    {formattedDate}
                  </Text>
                </div>

                {/* Edit & Delete Controls */}
                {isOwnerOrAdmin && (
                  <div className="flex items-center gap-1 ltr:ml-2 ltr:border-l rtl:mr-2 rtl:border-r border-borderPrimary/40 ltr:pl-2 rtl:pr-2 pointer-events-auto">
                    <Tooltip position="top" content={t.post.edit}>
                      <button
                        onClick={handleOpenEdit}
                        className="p-1 rounded-md text-textSecondary hover:text-primary hover:bg-primary/10 transition-colors cursor-pointer"
                        title={t.post.edit}
                      >
                        <Edit2 className="h-3.5 w-3.5" />
                      </button>
                    </Tooltip>

                    <Tooltip position="top" content={t.post.delete}>
                      <button
                        onClick={handleDelete}
                        disabled={deletePostMutation.isPending}
                        className="p-1 rounded-md text-textSecondary hover:text-rose-500 hover:bg-rose-500/10 transition-colors cursor-pointer"
                        title={t.post.delete}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </Tooltip>
                  </div>
                )}
              </div>
            </div>

            {/* Title */}
            {post.title && (
              <Text
                as="h2"
                size="lg"
                font="extraBold"
                color="primary"
                className="group-hover:text-primary transition-colors line-clamp-2 mb-2 leading-snug md:text-xl"
              >
                {post.title}
              </Text>
            )}

            {/* Description Excerpt */}
            {post.description && (
              <Text
                as="p"
                size="sm"
                color="secondary"
                className="line-clamp-3 leading-relaxed mb-3 text-xs md:text-sm"
              >
                {post.description}
              </Text>
            )}
          </div>

          {/* Footer: Author Info & Interactive Actions */}
          <div className="pt-4 border-t border-borderPrimary/30 flex items-center justify-between gap-2 mt-auto">
            {/* Author Details */}
            <UserHoverCard user={displayAuthor as any}>
              <Link
                href={`/profile/${displayAuthor?._id || "me"}`}
                className="flex items-center gap-2 group/author cursor-pointer pointer-events-auto relative z-10"
                onClick={(e) => e.stopPropagation()}
              >
                {displayAuthor?.profilePicture?.url ? (
                  <img
                    src={displayAuthor.profilePicture.url}
                    alt={displayAuthor.username}
                    className="h-7 w-7 rounded-full object-cover border border-borderPrimary"
                  />
                ) : (
                  <div className="h-7 w-7 rounded-full bg-primary/15 flex items-center justify-center text-primary">
                    <UserIcon className="h-3.5 w-3.5" />
                  </div>
                )}
                <div>
                  <Text
                    as="span"
                    size="xs"
                    font="semiBold"
                    color="primary"
                    className="group-hover/author:text-primary transition-colors block truncate max-w-36"
                  >
                    {displayAuthor?.username || t.post.anonymous}
                  </Text>
                  {displayAuthor?.jobTitle && (
                    <Text
                      as="span"
                      size="xs"
                      color="secondary"
                      className="text-[10px] block truncate max-w-36"
                    >
                      {displayAuthor.jobTitle}
                    </Text>
                  )}
                </div>
              </Link>
            </UserHoverCard>

            {/* Actions: Likes, Comments, Share */}
            <div className="flex items-center gap-2 pointer-events-auto relative z-10">
              {/* Like Button with User List Tooltip */}
              <Tooltip
                position="top"
                content={<UserListTooltip users={post.likes} type="like" />}
              >
                <button
                  onClick={handleLike}
                  disabled={likePostMutation.isPending}
                  className={`flex items-center gap-1.5 text-xs font-bold transition-all p-1.5 rounded-lg cursor-pointer ${
                    isLiked
                      ? "text-rose-500 bg-rose-500/10"
                      : "text-textSecondary hover:text-rose-500 hover:bg-rose-500/10"
                  }`}
                >
                  <Heart
                    className={`h-4 w-4 transition-transform active:scale-125 ${
                      isLiked
                        ? "fill-rose-500 text-rose-500"
                        : "text-textSecondary fill-transparent"
                    }`}
                  />
                  <Text
                    as="span"
                    size="xs"
                    font="bold"
                    className={isLiked ? "text-rose-500" : "text-textSecondary"}
                  >
                    {displayLikesCount}
                  </Text>
                </button>
              </Tooltip>

              {/* Comment Counter */}
              <Tooltip position="top" content={t.post.viewComments}>
                <Link
                  href={`/posts/${post._id}#comments`}
                  className="group/comment flex items-center gap-1.5 text-xs font-semibold text-textSecondary hover:text-primary transition-colors p-1.5 rounded-lg hover:bg-primary/10 relative z-10"
                  onClick={(e) => e.stopPropagation()}
                >
                  <MessageSquare className="h-4 w-4 text-textSecondary group-hover/comment:text-primary transition-colors" />
                  <Text
                    as="span"
                    size="xs"
                    font="semiBold"
                    className="text-textSecondary group-hover/comment:text-primary transition-colors"
                  >
                    {commentsCount}
                  </Text>
                </Link>
              </Tooltip>

              {/* Share Counter with User List Tooltip */}
              <Tooltip
                position="top"
                content={<UserListTooltip users={post.shares} type="share" />}
              >
                <button
                  onClick={handleShare}
                  disabled={sharePostMutation.isPending}
                  className="group/share flex items-center gap-1.5 text-xs font-semibold text-textSecondary hover:text-primary transition-colors p-1.5 rounded-lg hover:bg-primary/10 cursor-pointer"
                >
                  <Share2 className="h-4 w-4 text-textSecondary group-hover/share:text-primary transition-colors" />
                  <Text
                    as="span"
                    size="xs"
                    font="semiBold"
                    className="text-textSecondary group-hover/share:text-primary transition-colors"
                  >
                    {sharesCount}
                  </Text>
                </button>
              </Tooltip>
            </div>
          </div>
        </div>
      </article>

      {/* Edit Modal */}
      <EditPostModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        post={post}
      />

      {/* Delete Post Modal */}
      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title={t.post.deleteTitle}
        description={t.post.deleteDesc}
        confirmText={t.post.deleteConfirm}
        isPending={deletePostMutation.isPending}
      />
    </>
  );
}
