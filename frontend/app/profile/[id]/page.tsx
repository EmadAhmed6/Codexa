"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Cookies from "js-cookie";
import Navbar from "@/_components/Navbar";
import PostCard from "@/_components/PostCard";
import CreatePostModal from "@/_components/CreatePostModal";
import {
  useGetUserProfile,
  useUploadProfilePicture,
  useUpdateUser,
  useDeleteUser,
} from "@/_features/user/hooks";
import { useGetPosts } from "@/_features/posts/hooks";
import { useGetAuthMeQuery } from "@/_features/auth/hooks";
import {
  User as UserIcon,
  Camera,
  Mail,
  Loader2,
  FileText,
  Edit,
  Trash2,
  X,
  ShieldCheck,
  Calendar,
  Briefcase,
  PlusCircle,
} from "lucide-react";
import DeleteConfirmModal from "@/_components/DeleteConfirmModal";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  editProfileSchema,
  type IEditProfile,
} from "@/_features/posts/schemas/post";
import Error from "@/_components/Error";
import { toast } from "sonner";
import { Text } from "@/_components/Text";
import { Post } from "@/_features/posts/types/Post";

export default function UserProfilePage() {
  const params = useParams();
  const router = useRouter();
  const routeUserId = params.id as string;

  const { data: currentUser } = useGetAuthMeQuery();

  const targetUserId =
    routeUserId === "me" ? currentUser?._id || "" : routeUserId;

  const isOwnProfile =
    routeUserId === "me" ||
    (currentUser && String(currentUser._id) === String(targetUserId));

  const { data: profileUser, isLoading: isUserLoading } =
    useGetUserProfile(targetUserId);
  const { data: userPosts, isLoading: isPostsLoading } = useGetPosts({
    userId: targetUserId,
  });

  const uploadProfileMutation = useUploadProfilePicture(targetUserId);
  const updateUserMutation = useUpdateUser(targetUserId);
  const deleteUserMutation = useDeleteUser();

  const [isUploading, setIsUploading] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteUserModalOpen, setIsDeleteUserModalOpen] = useState(false);

  const userToDisplay =
    profileUser || (isOwnProfile ? currentUser : null) || currentUser;

  const handleDeleteAccount = async () => {
    const deleteId = targetUserId || currentUser?._id;
    if (!deleteId) return;
    try {
      await deleteUserMutation.mutateAsync(deleteId);
      setIsDeleteUserModalOpen(false);
      if (isOwnProfile) {
        Cookies.remove("token", { path: "/" });
        if (typeof window !== "undefined") {
          localStorage.removeItem("token");
        }
        router.push("/auth/login");
      } else {
        router.push("/");
      }
    } catch {
      // error handled in mutation
    }
  };

  const {
    register,
    handleSubmit,
    reset,
    clearErrors,
    formState: { errors },
  } = useForm<IEditProfile>({
    resolver: zodResolver(editProfileSchema as any),
    mode: "onBlur",
    defaultValues: {
      username: userToDisplay?.username || "",
      jobTitle: userToDisplay?.jobTitle || "",
      email: userToDisplay?.email || "",
    },
  });

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsUploading(true);
      try {
        await uploadProfileMutation.mutateAsync(file);
      } finally {
        setIsUploading(false);
      }
    }
  };

  const handleOpenEditModal = () => {
    reset({
      username: userToDisplay?.username || "",
      jobTitle: userToDisplay?.jobTitle || "",
      email: userToDisplay?.email || "",
    });
    setIsEditModalOpen(true);
  };

  const handleUpdateProfile = async (data: IEditProfile) => {
    try {
      await updateUserMutation.mutateAsync({
        username: data.username.trim(),
        jobTitle: data.jobTitle ? data.jobTitle.trim() : "",
        email: data.email.trim(),
      });
      setIsEditModalOpen(false);
    } catch {
      // error handled in mutation
    }
  };

  const rawPosts: any[] =
    Array.isArray((userToDisplay as any)?.posts) &&
    (userToDisplay as any).posts.length > 0
      ? (userToDisplay as any).posts
      : userPosts || [];

  const displayUserPosts = rawPosts.filter((post: any) => {
    if (!targetUserId) return true;
    const pUserId =
      typeof post.user === "string"
        ? post.user
        : post.user?._id || post.user?.id;
    if (!pUserId) return true;
    return String(pUserId) === String(targetUserId);
  });

  return (
    <div className="min-h-screen bg-bgPrimary text-textPrimary flex flex-col justify-between">
      <Navbar />

      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 py-8 md:py-12">
        {/* User Hero Header Card */}
        <div className="relative rounded-3xl bg-bgSecondary/60 border border-borderPrimary/50 p-6 md:p-10 mb-10 overflow-hidden shadow-xl">
          <div className="absolute top-0 right-0 w-80 h-80 bg-primary/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />

          {isUserLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6 md:gap-8 relative z-10">
              {/* Avatar Section */}
              <div className="relative group shrink-0">
                {userToDisplay?.profilePicture?.url ? (
                  <img
                    src={userToDisplay.profilePicture.url}
                    alt={userToDisplay.username}
                    className="h-28 w-28 md:h-32 md:w-32 rounded-3xl object-cover border-2 border-primary/30 shadow-md"
                  />
                ) : (
                  <div className="h-28 w-28 md:h-32 md:w-32 rounded-3xl bg-primary/15 flex items-center justify-center text-primary border-2 border-primary/30 shadow-md">
                    <UserIcon className="h-14 w-14" />
                  </div>
                )}

                {/* Upload Avatar Overlay (Owner Only) */}
                {isOwnProfile && (
                  <label className="absolute inset-0 rounded-3xl bg-black/60 flex flex-col items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                    {isUploading ? (
                      <Loader2 className="h-6 w-6 animate-spin" />
                    ) : (
                      <>
                        <Camera className="h-6 w-6 mb-1" />
                        <Text
                          as="span"
                          size="xs"
                          font="bold"
                          color="white"
                          className="text-[10px] uppercase"
                        >
                          Upload
                        </Text>
                      </>
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarChange}
                      className="hidden"
                      disabled={isUploading}
                    />
                  </label>
                )}
              </div>

              {/* User Info Details */}
              <div className="flex-1 text-center md:text-left space-y-3">
                <div className="flex flex-col md:flex-row items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2 justify-center md:justify-start">
                      <Text
                        as="h1"
                        size="2xl"
                        font="extraBold"
                        color="primary"
                        className="tracking-tight md:text-4xl"
                      >
                        {userToDisplay?.username || "Developer"}
                      </Text>
                      {userToDisplay?.isAdmin ? (
                        <span className="text-[11px] font-bold uppercase px-2.5 py-0.5 rounded-full bg-amber-500/15 text-amber-500 border border-amber-500/30 flex items-center gap-1">
                          <ShieldCheck className="h-3.5 w-3.5" />
                          Admin
                        </span>
                      ) : (
                        <span className="text-[11px] font-bold uppercase px-2.5 py-0.5 rounded-full bg-primary/15 text-primary border border-primary/30 flex items-center gap-1">
                          <UserIcon className="h-3.5 w-3.5" />
                          User
                        </span>
                      )}
                    </div>
                    {userToDisplay?.jobTitle && (
                      <div className="flex items-center justify-center md:justify-start gap-1.5 mt-1">
                        <Briefcase className="h-3.5 w-3.5 text-primary" />
                        <Text as="p" size="xs" font="semiBold" color="primary">
                          {userToDisplay.jobTitle}
                        </Text>
                      </div>
                    )}
                    {userToDisplay?.email && (
                      <div className="flex items-center justify-center md:justify-start gap-1.5 mt-1">
                        <Mail className="h-3.5 w-3.5 text-textSecondary" />
                        <Text as="p" size="xs" color="secondary">
                          {userToDisplay.email}
                        </Text>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    {isOwnProfile && (
                      <>
                        <Button
                          onClick={() => setIsCreateModalOpen(true)}
                          size="sm"
                          className="rounded-xl bg-primary hover:bg-primaryHover text-primary-foreground text-xs flex items-center gap-1.5 cursor-pointer font-semibold"
                        >
                          <PlusCircle className="h-3.5 w-3.5" />
                          <Text
                            as="span"
                            size="xs"
                            font="semiBold"
                            color="white"
                          >
                            Create Article
                          </Text>
                        </Button>
                        <Button
                          onClick={handleOpenEditModal}
                          variant="outline"
                          size="sm"
                          className="rounded-xl border-borderPrimary text-xs flex items-center gap-1.5 cursor-pointer"
                        >
                          <Edit className="h-3.5 w-3.5" />
                          <Text
                            as="span"
                            size="xs"
                            font="semiBold"
                            color="primary"
                          >
                            Edit Profile
                          </Text>
                        </Button>
                      </>
                    )}

                    {(isOwnProfile || currentUser?.isAdmin) && (
                      <Button
                        onClick={() => setIsDeleteUserModalOpen(true)}
                        variant="destructive"
                        size="sm"
                        disabled={deleteUserMutation.isPending}
                        className="rounded-xl text-xs flex items-center gap-1.5 cursor-pointer"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        <Text as="span" size="xs" font="semiBold" color="white">
                          {isOwnProfile ? "Delete Account" : "Delete User"}
                        </Text>
                      </Button>
                    )}
                  </div>
                </div>

                {/* Stats & Details Pills */}
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 pt-2">
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-bgPrimary/80 border border-borderPrimary/40">
                    <FileText className="h-4 w-4 text-primary" />
                    <Text as="span" size="xs" font="semiBold" color="primary">
                      {displayUserPosts.length} Articles
                    </Text>
                  </div>
                  {userToDisplay?.createdAt && (
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-bgPrimary/80 border border-borderPrimary/40">
                      <Calendar className="h-4 w-4 text-primary/70" />
                      <Text
                        as="span"
                        size="xs"
                        font="semiBold"
                        color="secondary"
                      >
                        Joined{" "}
                        {new Date(userToDisplay.createdAt).toLocaleDateString(
                          "en-US",
                          { month: "short", day: "numeric", year: "numeric" },
                        )}
                      </Text>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Profile User Posts Section */}
        <div className="space-y-6">
          <div className="flex items-center justify-between pb-2 border-b border-borderPrimary/40">
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              <Text as="h2" size="xl" font="bold" color="primary">
                {isOwnProfile
                  ? "My Published Articles"
                  : `${userToDisplay?.username}'s Articles`}
              </Text>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-primary/10 text-primary font-bold">
                {displayUserPosts.length}
              </span>
            </div>

            {isOwnProfile && (
              <Button
                onClick={() => setIsCreateModalOpen(true)}
                size="sm"
                className="rounded-xl bg-primary hover:bg-primaryHover text-primary-foreground text-xs flex items-center gap-1.5 cursor-pointer font-semibold"
              >
                <PlusCircle className="h-3.5 w-3.5" />
                <Text as="span" size="xs" font="semiBold" color="white">
                  New Article
                </Text>
              </Button>
            )}
          </div>

          {isPostsLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : displayUserPosts.length === 0 ? (
            <div className="text-center py-12 p-8 rounded-2xl bg-bgSecondary/40 border border-borderPrimary/40">
              <FileText className="h-10 w-10 text-textSecondary mx-auto mb-3 opacity-40" />
              <Text as="p" size="sm" font="semiBold" color="primary">
                No articles published yet
              </Text>
              <Text as="p" size="xs" color="secondary" className="mt-1 mb-4">
                {isOwnProfile
                  ? "Create your first post to get started."
                  : "This user hasn't published any articles yet."}
              </Text>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {displayUserPosts.map((post: Post) => (
                <PostCard key={post._id} post={post} />
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Create Article Modal */}
      <CreatePostModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />

      {/* Edit Profile Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="relative w-full max-w-md bg-bgSecondary border border-borderPrimary rounded-2xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-borderPrimary/40 pb-3">
              <Text as="h3" size="lg" font="bold" color="primary">
                Edit Profile Settings
              </Text>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="p-1.5 rounded-lg text-textSecondary hover:text-textPrimary"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form
              onSubmit={handleSubmit(handleUpdateProfile)}
              className="space-y-4"
            >
              <div>
                <Text
                  as="label"
                  size="xs"
                  font="semiBold"
                  color="secondary"
                  className="block mb-1"
                >
                  Username (3-10 characters)
                </Text>
                <input
                  type="text"
                  {...register("username", {
                    onChange: () => clearErrors("username"),
                  })}
                  className="w-full px-3.5 py-2 text-sm rounded-xl bg-bgPrimary border border-borderPrimary text-textPrimary outline-none focus:ring-2 focus:ring-primary"
                />
                <Error error={errors.username?.message} />
              </div>

              <div>
                <Text
                  as="label"
                  size="xs"
                  font="semiBold"
                  color="secondary"
                  className="block mb-1"
                >
                  Job Title (Optional)
                </Text>
                <input
                  type="text"
                  placeholder="e.g. Frontend Developer"
                  {...register("jobTitle" as any, {
                    onChange: () => clearErrors("jobTitle" as any),
                  })}
                  className="w-full px-3.5 py-2 text-sm rounded-xl bg-bgPrimary border border-borderPrimary text-textPrimary outline-none focus:ring-2 focus:ring-primary"
                />
                <Error error={(errors as any).jobTitle?.message} />
              </div>

              <div>
                <Text
                  as="label"
                  size="xs"
                  font="semiBold"
                  color="secondary"
                  className="block mb-1"
                >
                  Email Address
                </Text>
                <input
                  type="email"
                  {...register("email", {
                    onChange: () => clearErrors("email"),
                  })}
                  className="w-full px-3.5 py-2 text-sm rounded-xl bg-bgPrimary border border-borderPrimary text-textPrimary outline-none focus:ring-2 focus:ring-primary"
                />
                <Error error={errors.email?.message} />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setIsEditModalOpen(false)}
                  className="rounded-xl text-xs"
                >
                  <Text as="span" size="xs" color="secondary">
                    Cancel
                  </Text>
                </Button>
                <Button
                  type="submit"
                  size="sm"
                  disabled={updateUserMutation.isPending}
                  className="rounded-xl bg-primary text-primary-foreground text-xs"
                >
                  <Text as="span" size="xs" font="semiBold" color="white">
                    {updateUserMutation.isPending
                      ? "Saving..."
                      : "Save Changes"}
                  </Text>
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete User Modal */}
      <DeleteConfirmModal
        isOpen={isDeleteUserModalOpen}
        onClose={() => setIsDeleteUserModalOpen(false)}
        onConfirm={handleDeleteAccount}
        title={isOwnProfile ? "Delete My Account" : "Delete User Account"}
        description={
          isOwnProfile
            ? "Are you sure you want to delete your account? All associated posts and data will be permanently removed. This action cannot be undone."
            : "Are you sure you want to delete this user account? All associated posts and data will be permanently removed. This action cannot be undone."
        }
        confirmText={isOwnProfile ? "Delete My Account" : "Delete User"}
        isPending={deleteUserMutation.isPending}
      />
    </div>
  );
}
