"use client";

import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { useParams, useRouter } from "next/navigation";
import Cookies from "js-cookie";
import Navbar from "@/_components/Navbar";
import PostCard from "@/_components/PostCard";
import CreatePostCard from "@/_components/CreatePostCard";
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
  Edit2,
  Trash2,
  X,
  ShieldCheck,
  Calendar,
  Briefcase,
  Eye,
} from "lucide-react";
import ImageModal from "@/_components/ImageModal";
import DeleteConfirmModal from "@/_components/DeleteConfirmModal";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  editProfileSchema,
  type IEditProfile,
} from "@/_features/posts/schemas/post";
import Error from "@/_components/Error";
import { Text } from "@/_components/Text";
import { Post } from "@/_features/posts/types/Post";
import { Input } from "@/components/ui/input";
import { useLanguage } from "@/context/LanguageContext";

export default function UserProfilePage() {
  const params = useParams();
  const router = useRouter();
  const routeUserId = params.id as string;
  const { t, isArabic } = useLanguage();

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

  const [mounted, setMounted] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteUserModalOpen, setIsDeleteUserModalOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const userToDisplay =
    profileUser || (isOwnProfile ? currentUser : null) || currentUser;

  const currentEmail = userToDisplay?.email || currentUser?.email || "";

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
      fullName: userToDisplay?.fullName || "",
      username: userToDisplay?.username || "",
      jobTitle: userToDisplay?.jobTitle || "",
      bio: (userToDisplay as any)?.bio || "",
      email: currentEmail,
    },
  });

  useEffect(() => {
    if (userToDisplay) {
      reset({
        fullName: userToDisplay.fullName || "",
        username: userToDisplay.username || "",
        jobTitle: userToDisplay.jobTitle || "",
        bio: (userToDisplay as any)?.bio || "",
        email: userToDisplay.email || currentUser?.email || "",
      });
    }
  }, [userToDisplay, currentUser, reset]);

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
      fullName: userToDisplay?.fullName || "",
      username: userToDisplay?.username || "",
      jobTitle: userToDisplay?.jobTitle || "",
      bio: (userToDisplay as any)?.bio || "",
      email: userToDisplay?.email || currentUser?.email || "",
    });
    setIsEditModalOpen(true);
  };

  const handleUpdateProfile = async (data: IEditProfile) => {
    try {
      await updateUserMutation.mutateAsync({
        fullName: data.fullName.trim(),
        username: data.username.trim(),
        jobTitle: data.jobTitle ? data.jobTitle.trim() : "",
        bio: data.bio ? data.bio.trim() : "",
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

  const joinedDateFormatted = userToDisplay?.createdAt
    ? new Date(userToDisplay.createdAt).toLocaleDateString(
        isArabic ? "ar-EG" : "en-US",
        { month: "short", day: "numeric", year: "numeric" },
      )
    : "";

  return (
    <div className="min-h-screen bg-bgPrimary text-textPrimary flex flex-col justify-between">
      <Navbar />

      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 py-8 md:py-12">
        {/* User Hero Header Card */}
        <div className="relative rounded-3xl bg-bgSecondary/60 border border-borderPrimary/50 p-6 md:p-10 mb-10 overflow-hidden shadow-xl">
          <div className="absolute top-0 ltr:right-0 rtl:left-0 w-80 h-80 bg-primary/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />

          {isUserLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6 md:gap-8 relative z-10">
              {/* Avatar Section */}
              <div className="relative shrink-0 group">
                <div
                  onClick={() => {
                    if (userToDisplay?.profilePicture?.url) {
                      setPreviewImage(userToDisplay.profilePicture.url);
                    }
                  }}
                  className={`relative ${userToDisplay?.profilePicture?.url ? "cursor-pointer" : ""}`}
                  title={
                    userToDisplay?.profilePicture?.url
                      ? isArabic
                        ? "اضغط لتكبير الصورة"
                        : "Click to view photo"
                      : undefined
                  }
                >
                  {userToDisplay?.profilePicture?.url ? (
                    <div className="relative rounded-full overflow-hidden">
                      <img
                        src={userToDisplay.profilePicture.url}
                        alt={userToDisplay.fullName || userToDisplay.username}
                        className="h-28 w-28 md:h-32 md:w-32 rounded-full object-cover border-2 border-primary/30 shadow-md group-hover:scale-105 transition-transform duration-200"
                      />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white pointer-events-none z-10">
                        <Eye className="h-6 w-6 text-white mb-0.5" />
                        <span className="text-[10px] font-bold uppercase tracking-wider">
                          {isArabic ? "عرض الصورة" : "View Image"}
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="h-28 w-28 md:h-32 md:w-32 rounded-full bg-primary/15 flex items-center justify-center text-primary border-2 border-primary/30 shadow-md">
                      <UserIcon className="h-14 w-14" />
                    </div>
                  )}
                </div>

                {/* Edit Avatar Pen Button (Owner Only) */}
                {isOwnProfile && (
                  <label
                    onClick={(e) => e.stopPropagation()}
                    className="absolute -bottom-1 ltr:-right-1 rtl:-left-1 p-2.5 rounded-2xl bg-primary hover:bg-primaryHover text-white shadow-lg border-2 border-bgSecondary transition-transform hover:scale-110 cursor-pointer z-20"
                    title={t.profile.changePhoto}
                  >
                    {isUploading ? (
                      <Loader2 className="h-4 w-4 animate-spin text-white" />
                    ) : (
                      <Edit2 className="h-4 w-4 text-white" />
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
              <div className="flex-1 text-center ltr:md:text-left rtl:md:text-right space-y-3">
                <div className="flex flex-col md:flex-row items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2 justify-center ltr:md:justify-start rtl:md:justify-end">
                      <Text
                        as="h1"
                        size="2xl"
                        font="extraBold"
                        color="primary"
                        className="tracking-tight md:text-4xl"
                      >
                        {userToDisplay?.fullName ||
                          userToDisplay?.username ||
                          "Developer"}
                      </Text>
                      {userToDisplay?.isAdmin ? (
                        <span className="text-[11px] font-bold uppercase px-2.5 py-0.5 rounded-full bg-amber-500/15 text-amber-500 border border-amber-500/30 flex items-center gap-1">
                          <ShieldCheck className="h-3.5 w-3.5" />
                          {t.admin.admin}
                        </span>
                      ) : (
                        <span className="text-[11px] font-bold uppercase px-2.5 py-0.5 rounded-full bg-primary/15 text-primary border border-primary/30 flex items-center gap-1">
                          <UserIcon className="h-3.5 w-3.5" />
                          {t.admin.user}
                        </span>
                      )}
                    </div>

                    {userToDisplay?.fullName && (
                      <Text
                        as="p"
                        size="xs"
                        color="secondary"
                        className="font-semibold text-xs mt-0.5"
                      >
                        @{userToDisplay.username}
                      </Text>
                    )}

                    {userToDisplay?.jobTitle && (
                      <div className="flex items-center justify-center ltr:md:justify-start rtl:md:justify-end gap-1.5 mt-1">
                        <Briefcase className="h-3.5 w-3.5 text-primary" />
                        <Text as="p" size="xs" font="semiBold" color="primary">
                          {userToDisplay.jobTitle}
                        </Text>
                      </div>
                    )}
                    {userToDisplay?.email && (
                      <div className="flex items-center justify-center ltr:md:justify-start rtl:md:justify-end gap-1.5 mt-1">
                        <Mail className="h-3.5 w-3.5 text-textSecondary" />
                        <Text as="p" size="xs" color="secondary">
                          {userToDisplay.email}
                        </Text>
                      </div>
                    )}
                    {(userToDisplay as any)?.bio && (
                      <Text
                        as="p"
                        size="xs"
                        color="secondary"
                        className="mt-2 text-xs leading-relaxed max-w-md italic"
                      >
                        "{(userToDisplay as any).bio}"
                      </Text>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    {isOwnProfile && (
                      <Button
                        onClick={handleOpenEditModal}
                        variant="outline"
                        size="sm"
                        className="group/editBtn rounded-xl border border-borderPrimary hover:border-primary/50 hover:bg-primary/10 transition-all duration-200 text-xs flex items-center gap-1.5 cursor-pointer hover:shadow-md hover:scale-105 active:scale-95"
                      >
                        <Edit className="h-3.5 w-3.5 text-textPrimary group-hover/editBtn:text-primary transition-colors" />
                        <Text
                          as="span"
                          size="xs"
                          font="semiBold"
                          color="primary"
                          className="group-hover/editBtn:text-primary transition-colors"
                        >
                          {t.profile.editProfile}
                        </Text>
                      </Button>
                    )}

                    {(isOwnProfile || currentUser?.isAdmin) && (
                      <Button
                        onClick={() => setIsDeleteUserModalOpen(true)}
                        variant="destructive"
                        size="sm"
                        disabled={deleteUserMutation.isPending}
                        className="group/delBtn rounded-xl text-xs flex items-center gap-1.5 cursor-pointer bg-rose-500/15 border border-rose-500/30 hover:bg-rose-600 transition-all"
                      >
                        <Trash2 className="h-3.5 w-3.5 text-rose-700 group-hover/delBtn:text-white transition-colors" />
                        <Text
                          as="span"
                          size="xs"
                          font="semiBold"
                          className="text-rose-700 group-hover/delBtn:text-white transition-colors"
                        >
                          {isOwnProfile
                            ? isArabic
                              ? "مسح الحساب"
                              : "Delete Account"
                            : t.admin.deleteUser}
                        </Text>
                      </Button>
                    )}
                  </div>
                </div>

                {/* Stats & Details Pills */}
                <div className="flex flex-wrap items-center justify-center ltr:md:justify-start rtl:md:justify-end gap-3 pt-2">
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-bgPrimary/80 border border-borderPrimary/40">
                    <FileText className="h-4 w-4 text-primary" />
                    <Text as="span" size="xs" font="semiBold" color="primary">
                      {displayUserPosts.length} {t.profile.articlesPublished}
                    </Text>
                  </div>
                  {userToDisplay?.createdAt && (
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-bgPrimary/80 border border-borderPrimary/40">
                      <Calendar className="h-4 w-4 text-primary/70" />
                      <Text as="span" size="xs" font="semiBold" color="primary">
                        {t.profile.joined} {joinedDateFormatted}
                      </Text>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Profile User Posts Section */}
        <div className="space-y-6 max-w-2xl mx-auto w-full">
          <div className="flex items-center pb-2 border-b border-borderPrimary/40 w-full">
            <div className="flex items-center gap-2.5">
              <FileText className="h-5 w-5 text-primary" />
              <Text as="h2" size="xl" font="bold" color="primary">
                {isOwnProfile
                  ? isArabic
                    ? "البوستات بتاعتي"
                    : "My Published Posts"
                  : `${userToDisplay?.fullName || userToDisplay?.username || ""} - ${t.profile.userPosts}`}
              </Text>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-primary/10 text-primary font-bold">
                {displayUserPosts.length}
              </span>
            </div>
          </div>

          {/* Inline Create Post Box if viewing own profile */}
          {isOwnProfile && (
            <div className="w-full">
              <CreatePostCard />
            </div>
          )}

          {isPostsLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : displayUserPosts.length === 0 ? (
            <div className="text-center py-12 p-8 rounded-2xl bg-bgSecondary/40 border border-borderPrimary/40 w-full">
              <FileText className="h-10 w-10 text-textSecondary mx-auto mb-3 opacity-40" />
              <Text as="p" size="sm" font="semiBold" color="primary">
                {t.profile.noPostsYet}
              </Text>
            </div>
          ) : (
            <div className="space-y-6 w-full">
              {displayUserPosts.map((post: Post) => (
                <PostCard key={post._id} post={post} />
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Edit Profile Modal */}
      {isEditModalOpen &&
        mounted &&
        createPortal(
          <div
            className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200"
            onClick={() => setIsEditModalOpen(false)}
          >
            <div
              className="relative w-full max-w-md bg-bgSecondary border border-borderPrimary rounded-2xl p-6 shadow-2xl space-y-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between border-b border-borderPrimary/40 pb-3">
                <Text as="h3" size="lg" font="bold" color="primary">
                  {t.profile.editProfile}
                </Text>
                <button
                  onClick={() => setIsEditModalOpen(false)}
                  className="p-1.5 rounded-lg text-textSecondary hover:text-textPrimary cursor-pointer"
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
                    {isArabic ? "الاسم بالكامل" : "Full Name"}
                  </Text>
                  <Input
                    type="text"
                    icon="user"
                    placeholder={isArabic ? "الاسم بالكامل" : "Full Name"}
                    {...register("fullName", {
                      onChange: () => clearErrors("fullName"),
                    })}
                  />
                  <Error error={errors.fullName?.message} />
                </div>

                <div>
                  <Text
                    as="label"
                    size="xs"
                    font="semiBold"
                    color="secondary"
                    className="block mb-1"
                  >
                    {t.auth.usernameLabel}
                  </Text>
                  <Input
                    type="text"
                    icon="user"
                    placeholder="Username"
                    {...register("username", {
                      onChange: () => clearErrors("username"),
                    })}
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
                    {t.profile.jobTitle}
                  </Text>
                  <Input
                    type="text"
                    icon="briefcase"
                    placeholder="e.g. Frontend Developer"
                    {...register("jobTitle" as any, {
                      onChange: () => clearErrors("jobTitle" as any),
                    })}
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
                    {t.profile.bio}
                  </Text>
                  <Input
                    type="text"
                    icon="file"
                    placeholder="Tell us about yourself..."
                    {...register("bio" as any, {
                      onChange: () => clearErrors("bio" as any),
                    })}
                  />
                  <Error error={(errors as any).bio?.message} />
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
                  <Input
                    type="email"
                    icon="mail"
                    placeholder="Email"
                    {...register("email", {
                      onChange: () => clearErrors("email"),
                    })}
                  />
                  <Error error={errors.email?.message} />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setIsEditModalOpen(false)}
                    className="rounded-xl text-xs cursor-pointer"
                  >
                    <Text as="span" size="xs" color="secondary">
                      {t.post.cancel}
                    </Text>
                  </Button>
                  <Button
                    type="submit"
                    size="sm"
                    disabled={updateUserMutation.isPending}
                    className="rounded-xl bg-primary text-primary-foreground text-xs cursor-pointer"
                  >
                    <Text as="span" size="xs" font="semiBold" color="white">
                      {updateUserMutation.isPending
                        ? t.post.saving
                        : t.profile.saveProfile}
                    </Text>
                  </Button>
                </div>
              </form>
            </div>
          </div>,
          document.body,
        )}

      {/* Delete User Modal */}
      <DeleteConfirmModal
        isOpen={isDeleteUserModalOpen}
        onClose={() => setIsDeleteUserModalOpen(false)}
        onConfirm={handleDeleteAccount}
        title={
          isOwnProfile
            ? isArabic
              ? "مسح الحساب"
              : "Delete My Account"
            : t.admin.deleteUser
        }
        description={
          isOwnProfile
            ? isArabic
              ? "انت متأكد انك عايز تمسح حسابك؟ كل البيانات والبوستات هتتمسح نهائياً."
              : "Are you sure you want to delete your account? All associated posts and data will be permanently removed."
            : isArabic
              ? "انت متأكد انك عايز تمسح حساب اليوزر ده؟ كل بياناته وهتتمسح."
              : "Are you sure you want to delete this user account?"
        }
        confirmText={
          isOwnProfile
            ? isArabic
              ? "امسح حسابي"
              : "Delete My Account"
            : t.admin.deleteUser
        }
        isPending={deleteUserMutation.isPending}
      />

      {/* Image Preview Modal */}
      {previewImage && (
        <ImageModal
          src={previewImage}
          alt={userToDisplay?.fullName || userToDisplay?.username}
          onClose={() => setPreviewImage(null)}
        />
      )}
    </div>
  );
}
