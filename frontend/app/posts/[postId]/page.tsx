"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Navbar from "@/_components/Navbar";
import CommentSection from "@/_components/CommentSection";
import EditPostModal from "@/_components/EditPostModal";
import DeleteConfirmModal from "@/_components/DeleteConfirmModal";
import {
  useGetPostById,
  useDeletePost,
  useLikePost,
  useSharePost,
} from "@/_features/posts/hooks";
import { useGetAuthMeQuery } from "@/_features/auth/hooks";
import {
  Calendar,
  Heart,
  Share2,
  Trash2,
  Edit2,
  ArrowLeft,
  Loader2,
  User as UserIcon,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import Cookies from "js-cookie";
import { formatRelativeTime } from "@/lib/utils";
import { Text } from "@/_components/Text";
import Tooltip from "@/_components/Tooltip";
import UserListTooltip from "@/_components/UserListTooltip";

export default function SinglePostPage() {
  const params = useParams();
  const postId = params.postId as string;
  const router = useRouter();

  const token = Cookies.get("token");
  const { data: currentUser } = useGetAuthMeQuery();
  const { data: post, isLoading, isError } = useGetPostById(postId);

  const deletePostMutation = useDeletePost();
  const likePostMutation = useLikePost();
  const sharePostMutation = useSharePost();

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const currentUserId = currentUser?._id || (currentUser as any)?.id;
  const postUserId =
    typeof post?.user === "string"
      ? post.user
      : post?.user?._id || (post?.user as any)?.id;

  const isOwnerOrAdmin = Boolean(
    currentUser &&
      post &&
      currentUserId &&
      postUserId &&
      (String(postUserId) === String(currentUserId) || currentUser.isAdmin),
  );

  const isLiked = Boolean(
    currentUserId &&
    post &&
    Array.isArray(post.likes) &&
    post.likes.some((item) => {
      const id = typeof item === "string" ? item : item?._id;
      return id === currentUserId;
    }),
  );

  const likesCount =
    post?.likesCount !== undefined
      ? post.likesCount
      : Array.isArray(post?.likes)
        ? post.likes.length
        : 0;

  const sharesCount =
    post?.sharesCount !== undefined
      ? post.sharesCount
      : Array.isArray(post?.shares)
        ? post.shares.length
        : 0;

  const handleLike = () => {
    if (!token) return;
    likePostMutation.mutate(postId);
  };

  const handleDeletePost = () => {
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDeletePost = async () => {
    try {
      await deletePostMutation.mutateAsync(postId);
      setIsDeleteModalOpen(false);
      router.push("/");
    } catch {
      // error handled in mutation
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-bgPrimary text-textPrimary flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center py-24">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  if (isError || !post) {
    return (
      <div className="min-h-screen bg-bgPrimary text-textPrimary flex flex-col">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center py-24 text-center px-4">
          <Text as="h2" size="2xl" font="bold" color="primary" className="mb-2">
            Article Not Found
          </Text>
          <Text as="p" size="xs" color="secondary" className="mb-6">
            The article you requested could not be retrieved.
          </Text>
          <Link href="/">
            <Button className="rounded-xl bg-primary text-primary-foreground">
              <Text as="span" size="xs" font="semiBold" color="white">
                Back to Feed
              </Text>
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const formattedDate = formatRelativeTime(post.createdAt);

  return (
    <div className="min-h-screen bg-bgPrimary text-textPrimary flex flex-col justify-between">
      <Navbar />

      <main className="flex-1 w-full max-w-4xl mx-auto px-4 sm:px-6 py-8 md:py-12">
        {/* Back Link with Tooltip */}
        <Tooltip position="right" content="Return to Feed">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-textSecondary hover:text-primary transition-colors mb-6"
          >
            <ArrowLeft className="h-4 w-4" />
            <Text as="span" size="xs" font="semiBold" color="secondary">
              Back to Feed
            </Text>
          </Link>
        </Tooltip>

        {/* Author Header Bar (Top) */}
        <div className="flex items-center justify-between gap-4 p-4 rounded-2xl bg-bgSecondary/60 border border-borderPrimary/40 mb-6">
          <Link
            href={`/profile/${post.user?._id || "me"}`}
            className="flex items-center gap-3 group cursor-pointer"
          >
            {post.user?.profilePicture?.url ? (
              <img
                src={post.user.profilePicture.url}
                alt={post.user.username}
                className="h-10 w-10 rounded-full object-cover border border-borderPrimary"
              />
            ) : (
              <div className="h-10 w-10 rounded-full bg-primary/15 flex items-center justify-center text-primary">
                <UserIcon className="h-5 w-5" />
              </div>
            )}
            <div>
              <Text
                as="p"
                size="sm"
                font="bold"
                color="primary"
                className="group-hover:text-primary transition-colors"
              >
                {post.user?.username || "Anonymous Author"}
              </Text>
              <Text as="p" size="xs" font="medium" color="secondary" className="text-[11px]">
                {post.user?.jobTitle || "Developer"}
              </Text>
            </div>
          </Link>

          {/* Owner / Admin Actions (Edit & Delete) */}
          {isOwnerOrAdmin && (
            <div className="flex items-center gap-2">
              <Tooltip position="bottom" content="Edit Article">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsEditModalOpen(true)}
                  className="rounded-xl text-xs flex items-center gap-1.5 cursor-pointer border-borderPrimary"
                >
                  <Edit2 className="h-3.5 w-3.5" />
                  <Text as="span" size="xs" font="semiBold" color="primary">
                    Edit
                  </Text>
                </Button>
              </Tooltip>

              <Tooltip position="bottom" content="Delete Article">
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={handleDeletePost}
                  disabled={deletePostMutation.isPending}
                  className="rounded-xl text-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  <Text as="span" size="xs" font="semiBold" color="white">
                    Delete
                  </Text>
                </Button>
              </Tooltip>
            </div>
          )}
        </div>

        {/* Category & Date Header */}
        <div className="flex items-center justify-between gap-4 mb-4">
          <Text
            as="span"
            size="xs"
            font="bold"
            color="primary"
            className="uppercase tracking-wider px-3 py-1 rounded-md bg-primary/10 border border-primary/20"
          >
            {post.category || "General"}
          </Text>
          <div className="flex items-center gap-1.5">
            <Calendar className="h-3.5 w-3.5 text-textSecondary" />
            <Text as="span" size="xs" font="medium" color="secondary">
              {formattedDate}
            </Text>
          </div>
        </div>

        {/* Article Title */}
        <Text
          as="h1"
          size="3xl"
          font="black"
          color="primary"
          className="leading-tight tracking-tight mb-6 md:text-5xl"
        >
          {post.title}
        </Text>

        {/* Cloudinary Header Cover Image */}
        {post.image?.url && (
          <div className="w-full mb-10 overflow-hidden rounded-2xl border border-borderPrimary/50 shadow-lg max-h-120">
            <img
              src={post.image.url}
              alt={post.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Article Body Content */}
        <Text
          as="article"
          size="default"
          color="primary"
          className="prose prose-slate dark:prose-invert max-w-none text-textPrimary leading-relaxed whitespace-pre-line mb-10 text-base md:text-lg"
        >
          {post.description}
        </Text>

        {/* Article Bottom Actions */}
        <div className="flex items-center justify-between p-4 rounded-2xl bg-bgSecondary/40 border border-borderPrimary/40 mb-10">
          <div className="flex items-center gap-4">
            <Tooltip
              position="top"
              content={<UserListTooltip users={post.likes} type="like" />}
            >
              <button
                onClick={handleLike}
                disabled={likePostMutation.isPending}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl font-semibold text-xs transition-all cursor-pointer ${
                  isLiked
                    ? "bg-rose-500 text-white shadow-md shadow-rose-500/20"
                    : "bg-rose-500/10 hover:bg-rose-500/20 text-rose-500"
                }`}
              >
                <Heart
                  className={`h-4 w-4 ${isLiked ? "fill-white text-white" : "fill-rose-500/20"}`}
                />
                <Text
                  as="span"
                  size="xs"
                  font="semiBold"
                  className={isLiked ? "text-white" : "text-rose-500"}
                >
                  Like Article ({likesCount})
                </Text>
              </button>
            </Tooltip>

            <Tooltip
              position="top"
              content={<UserListTooltip users={post.shares} type="share" />}
            >
              <button
                onClick={() => sharePostMutation.mutate(postId)}
                disabled={sharePostMutation.isPending}
                className="group flex items-center gap-2 px-4 py-2 rounded-xl bg-bgPrimary hover:bg-bgSecondary border border-borderPrimary/40 text-textSecondary hover:text-textPrimary font-semibold text-xs transition-all cursor-pointer"
              >
                <Share2 className="h-4 w-4 text-textSecondary group-hover:text-textPrimary transition-colors" />
                <Text
                  as="span"
                  size="xs"
                  font="semiBold"
                  className="text-textSecondary group-hover:text-textPrimary transition-colors"
                >
                  Share ({sharesCount})
                </Text>
              </button>
            </Tooltip>
          </div>
        </div>

        {/* Comments Section */}
        <CommentSection postId={postId} />
      </main>

      {/* Edit Modal */}
      {post && (
        <EditPostModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          post={post}
        />
      )}

      {/* Delete Post Modal */}
      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDeletePost}
        title="Delete Article"
        description="Are you sure you want to delete this article? This action cannot be undone."
        confirmText="Delete Article"
        isPending={deletePostMutation.isPending}
      />
    </div>
  );
}
