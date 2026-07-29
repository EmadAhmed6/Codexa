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
import ImageModal from "@/_components/ImageModal";
import EditPostModal from "@/_components/EditPostModal";
import DeleteConfirmModal from "@/_components/DeleteConfirmModal";
import CommentsModal from "@/_components/CommentsModal";
import ActionMenu from "@/_components/ActionMenu";
import { formatRelativeTime } from "@/lib/utils";
import { Text } from "@/_components/Text";
import Tooltip from "@/_components/Tooltip";
import UserListTooltip from "@/_components/UserListTooltip";
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
  const [isCommentsModalOpen, setIsCommentsModalOpen] = useState(false);

  const currentUserId = currentUser?._id || (currentUser as any)?.id;
  const currentUsername = currentUser?.username?.toLowerCase();

  const postUserId =
    typeof post.user === "string"
      ? post.user
      : post.user?._id || (post.user as any)?.id;
  const postUsername =
    typeof post.user === "object"
      ? post.user?.username?.toLowerCase()
      : undefined;

  // Determine display author (If shared post, display original post author)
  const displayAuthor =
    post.sharedPost &&
    typeof post.sharedPost === "object" &&
    post.sharedPost.user
      ? post.sharedPost.user
      : post.user;

  const displayAuthorId =
    typeof displayAuthor === "string"
      ? displayAuthor
      : displayAuthor?._id || (displayAuthor as any)?.id;
  const displayAuthorUsername =
    typeof displayAuthor === "object"
      ? displayAuthor?.username?.toLowerCase()
      : undefined;

  const authorDisplayName = displayAuthor?.fullName || t.post.anonymous;

  // Check if current user is owner of this post
  const isPostOwner = Boolean(
    currentUser &&
    ((currentUserId &&
      postUserId &&
      String(postUserId) === String(currentUserId)) ||
      (currentUserId &&
        displayAuthorId &&
        String(displayAuthorId) === String(currentUserId)) ||
      (currentUsername && postUsername && postUsername === currentUsername) ||
      (currentUsername &&
        displayAuthorUsername &&
        displayAuthorUsername === currentUsername)),
  );

  // Is the post's author a SuperAdmin? Admins cannot delete SuperAdmin posts.
  const postAuthorIsSuperAdmin = Boolean(
    typeof post.user === "object" && (post.user as any)?.role === "SuperAdmin",
  );

  // Admin can act on posts UNLESS the post belongs to a SuperAdmin
  const canAdminDelete = Boolean(
    (currentUser?.role === "Admin" || currentUser?.role === "SuperAdmin") &&
    !(
      currentUser?.role === "Admin" &&
      postAuthorIsSuperAdmin
    ),
  );

  // Show action menu to owner or to admins (with superadmin restriction)
  const isOwnerOrAdmin = Boolean(isPostOwner || canAdminDelete);

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

  const [sharesCountDelta, setSharesCountDelta] = useState<number>(0);
  const [localSharesUsers, setLocalSharesUsers] = useState<any[]>(
    post.shares || [],
  );

  // Reset local overrides when server post data updates
  useEffect(() => {
    setUserLikedState(null);
    setLikesCountDelta(0);
    setSharesCountDelta(0);
    setLocalSharesUsers(post.shares || []);
  }, [post.likes, post.likesCount, post.shares, post.sharesCount]);

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

  const baseSharesCount =
    post.sharesCount !== undefined
      ? post.sharesCount
      : Array.isArray(post.shares)
        ? post.shares.length
        : 0;

  const displaySharesCount = Math.max(0, baseSharesCount + sharesCountDelta);

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

    // Increment share counter dynamically
    setSharesCountDelta((prev) => prev + 1);

    // Maintain list of users who have shared the post
    if (currentUser) {
      setLocalSharesUsers((prev) => [...prev, currentUser]);
    }

    sharePostMutation.mutate(post._id);
  };

  const handleOpenComments = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsCommentsModalOpen(true);
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

  return (
    <>
      <article className="group flex flex-col justify-between bg-bgSecondary/60 hover:bg-bgSecondary border border-borderPrimary/50 hover:border-primary/40 rounded-2xl p-5 md:p-6 shadow-xs hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 relative overflow-visible">
        {/* Full Card Link Overlay */}
        <Link
          href={`/posts/${post._id}`}
          className="absolute inset-0 z-0"
          aria-label={post.title || t.post.viewArticle}
        />

        {/* 1. TOP HEADER: Author Info & Controls */}
        <div className="flex items-center justify-between gap-2 mb-4 relative z-30">
          {/* Author Details */}
          <Link
            href={`/profile/${displayAuthor?._id || "me"}`}
            className="flex items-center gap-2.5 group/author cursor-pointer pointer-events-auto relative z-10"
            onClick={(e) => e.stopPropagation()}
          >
            {displayAuthor?.profilePicture?.url ? (
              <img
                src={displayAuthor.profilePicture.url}
                alt={authorDisplayName}
                className="h-9 w-9 rounded-full object-cover border border-borderPrimary"
              />
            ) : (
              <div className="h-9 w-9 rounded-full bg-primary/15 flex items-center justify-center text-primary">
                <UserIcon className="h-4 w-4" />
              </div>
            )}
            <div>
              <Text
                as="span"
                size="xs"
                font="bold"
                color="primary"
                className="group-hover/author:text-primary transition-colors block truncate max-w-40"
              >
                {authorDisplayName}
              </Text>
              <div className="flex items-center gap-2">
                {displayAuthor?.jobTitle && (
                  <Text
                    as="span"
                    size="xs"
                    color="secondary"
                    className="text-[10px] block truncate max-w-32"
                  >
                    {displayAuthor.jobTitle}
                  </Text>
                )}
                <div className="flex items-center gap-1">
                  <Calendar className="h-3 w-3 text-textSecondary" />
                  <Text
                    as="span"
                    size="xs"
                    font="medium"
                    color="secondary"
                    className="text-[10px]"
                  >
                    {formattedDate}
                  </Text>
                </div>
              </div>
            </div>
          </Link>

          {/* Shared Post Badge & Owner/Admin Controls */}
          <div className="flex items-center gap-2 pointer-events-auto relative z-30">
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

            {/* Action Menu: Edit for Post Owner only, Delete for Owner or Admin */}
            {isOwnerOrAdmin && (
              <ActionMenu
                onEdit={
                  isPostOwner ? () => setIsEditModalOpen(true) : undefined
                }
                onDelete={() => setIsDeleteModalOpen(true)}
              />
            )}
          </div>
        </div>

        {/* 2. POST CONTENT */}
        <div className="flex-1 flex flex-col justify-between relative z-0 pointer-events-none mb-3">
          <div>
            {post.title && (
              <Text
                as="h2"
                size="lg"
                font="medium"
                color="primary"
                dir="auto"
                className="group-hover:text-primary transition-colors mb-2 leading-snug md:text-xl bidi-text"
              >
                {post.title}
              </Text>
            )}
          </div>
        </div>

        {/* 3. FEATURED COVER IMAGE */}
        {(post.postImage?.url || post.image?.url) && (
          <div className="block mb-4 overflow-hidden rounded-xl border border-borderPrimary/30 aspect-video relative z-10 pointer-events-none">
            <img
              src={post.postImage?.url || post.image?.url}
              alt={post.title || "Cover Image"}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </div>
        )}

        {/* 4. BOTTOM ACTION BAR: Likes, Comments, Share */}
        <div className="pt-3 border-t border-borderPrimary/30 flex items-center justify-between gap-2 pointer-events-auto relative z-10 mt-auto">
          <div className="flex items-center gap-3">
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

            {/* Comment Counter Button */}
            <Tooltip
              position="top"
              content={
                <div className="flex items-center gap-1.5 px-0.5">
                  <MessageSquare className="h-3.5 w-3.5 text-primary" />
                  <span>{t.post.viewComments}</span>
                </div>
              }
            >
              <button
                type="button"
                onClick={handleOpenComments}
                className="group/comment flex items-center gap-1.5 text-xs font-semibold text-textSecondary hover:text-primary transition-colors p-1.5 rounded-lg hover:bg-primary/10 cursor-pointer"
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
              </button>
            </Tooltip>

            {/* Share Counter with User List Tooltip */}
            <Tooltip
              position="top"
              content={
                <UserListTooltip users={localSharesUsers} type="share" />
              }
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
                  {displaySharesCount}
                </Text>
              </button>
            </Tooltip>
          </div>
        </div>
      </article>

      {/* Comments Modal */}
      <CommentsModal
        isOpen={isCommentsModalOpen}
        onClose={() => setIsCommentsModalOpen(false)}
        postId={post._id}
        postTitle={post.title}
        postAuthorName={authorDisplayName}
        sharesCount={displaySharesCount}
      />

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
