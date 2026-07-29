"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Navbar from "@/_components/Navbar";
import AdminSidebar from "@/_components/AdminSidebar";
import { Text } from "@/_components/Text";
import { useGetAllUsers, useDeleteUser, useToggleAdminStatus } from "@/_features/user/hooks";
import { useGetPosts } from "@/_features/posts/hooks";
import { useGetAuthMeQuery } from "@/_features/auth/hooks";
import {
  Users,
  ShieldCheck,
  ShieldAlert,
  ShieldOff,
  Trash2,
  Loader2,
  Mail,
  Calendar,
  Briefcase,
  User as UserIcon,
  Search,
  ArrowLeft,
  ArrowRight,
  Edit,
  Crown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import DeleteConfirmModal from "@/_components/DeleteConfirmModal";
import EditProfileModal from "@/_components/EditProfileModal";
import Tooltip from "@/_components/Tooltip";
import UserHoverCard from "@/_components/UserHoverCard";
import { useLanguage } from "@/context/LanguageContext";

export default function AdminUsersPage() {
  const { data: currentUser, isLoading: isAuthLoading } = useGetAuthMeQuery();
  const { data: users, isLoading: isUsersLoading } = useGetAllUsers();
  const { data: posts } = useGetPosts();
  const deleteUserMutation = useDeleteUser();
  const toggleAdminMutation = useToggleAdminStatus();
  const { t, isArabic } = useLanguage();

  const [mounted, setMounted] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<"all" | "admin" | "user">("all");
  const [userToEdit, setUserToEdit] = useState<string | null>(null);
  const [selectedUserToDelete, setSelectedUserToDelete] = useState<{
    id: string;
    username: string;
  } | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || isAuthLoading) {
    return (
      <div className="min-h-screen bg-bgPrimary text-textPrimary flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center py-24">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  const BackIcon = isArabic ? ArrowRight : ArrowLeft;

  if (currentUser?.role !== "Admin" && currentUser?.role !== "SuperAdmin") {
    return (
      <div className="min-h-screen bg-bgPrimary text-textPrimary flex flex-col justify-between">
        <Navbar />
        <main className="flex-1 max-w-xl mx-auto px-4 py-20 text-center flex flex-col items-center justify-center">
          <div className="w-16 h-16 rounded-3xl bg-rose-500/10 border border-rose-500/20 text-rose-500 flex items-center justify-center mb-6">
            <ShieldAlert className="h-8 w-8" />
          </div>
          <Text
            as="h1"
            size="2xl"
            font="extraBold"
            color="primary"
            className="mb-2"
          >
            {isArabic ? "غير مسموح بالدخول" : "Access Denied"}
          </Text>
          <Text
            as="p"
            size="xs"
            color="secondary"
            className="mb-6 leading-relaxed"
          >
            {isArabic
              ? "معندكش صلاحيات أدمن عشان تدخل لوحة التحكم."
              : "You do not have administrative privileges to access the Admin Dashboard."}
          </Text>
          <Link href="/">
            <Button className="rounded-xl bg-primary text-primary-foreground text-xs font-semibold cursor-pointer">
              <BackIcon className="h-4 w-4 ltr:mr-1.5 rtl:ml-1.5" />
              <Text as="span" size="xs" font="semiBold" color="white">
                {t.post.backToFeed}
              </Text>
            </Button>
          </Link>
        </main>
      </div>
    );
  }

  const allUsersList = Array.isArray(users) ? users : [];
  const allPostsList = Array.isArray(posts) ? posts : [];

  const filteredUsers = allUsersList
    .filter((u) => {
      if (roleFilter === "admin" && u.role !== "Admin" && u.role !== "SuperAdmin") return false;
      if (roleFilter === "user" && (u.role === "Admin" || u.role === "SuperAdmin")) return false;

      const q = searchQuery.toLowerCase().trim();
      if (!q) return true;
      return (
        u.username?.toLowerCase().includes(q) ||
        u.email?.toLowerCase().includes(q) ||
        u.jobTitle?.toLowerCase().includes(q) ||
        u.fullName?.toLowerCase().includes(q)
      );
    })
    .sort((a, b) => {
      if (a.role === "SuperAdmin" && b.role !== "SuperAdmin") return -1;
      if (a.role !== "SuperAdmin" && b.role === "SuperAdmin") return 1;

      if ((a.role === "Admin" || a.role === "SuperAdmin") && b.role === "User") return -1;
      if (a.role === "User" && (b.role === "Admin" || b.role === "SuperAdmin")) return 1;

      return 0;
    });

  const totalUsers = allUsersList.length;
  const adminUsersCount = allUsersList.filter((u) => u.role === "Admin" || u.role === "SuperAdmin").length;
  const regularUsersCount = totalUsers - adminUsersCount;

  const handleConfirmDeleteUser = async () => {
    if (!selectedUserToDelete) return;
    try {
      await deleteUserMutation.mutateAsync(selectedUserToDelete.id);
      setSelectedUserToDelete(null);
    } catch {
      // Handled in mutation
    }
  };

  return (
    <div className="min-h-screen bg-bgPrimary text-textPrimary flex flex-col justify-between">
      <Navbar />

      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 py-8 md:py-12">
        {/* Top Header */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center border border-amber-500/20">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <div>
            <Text
              as="h1"
              size="3xl"
              font="extraBold"
              color="primary"
              className="tracking-tight"
            >
              {t.admin.dashboard}
            </Text>
            <Text as="p" size="xs" color="secondary">
              {isArabic
                ? "إدارة اليوزرات والبوستات المنشورة وإحصائيات السيستم"
                : "Manage system users, published posts, and platform metrics"}
            </Text>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Sidebar */}
          <div className="lg:col-span-3">
            <AdminSidebar
              currentUser={currentUser}
              totalUsers={totalUsers}
              totalPosts={allPostsList.length}
            />
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-9 space-y-6">
            {/* Section Header & Search */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <Text as="h2" size="xl" font="bold" color="primary">
                  {t.admin.usersManagement}
                </Text>
              </div>

              <div className="relative w-full md:w-72">
                <Search className="absolute ltr:left-3.5 rtl:right-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-textSecondary" />
                <input
                  type="text"
                  placeholder={t.admin.searchUsers}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full ltr:pl-10 ltr:pr-4 rtl:pr-10 rtl:pl-4 py-2 text-xs rounded-xl bg-bgSecondary border border-borderPrimary text-textPrimary outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>

            {/* Stats Summary Cards (Filterable) */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <button
                type="button"
                onClick={() => setRoleFilter("all")}
                className={`p-5 rounded-2xl bg-bgSecondary/70 border transition-all text-left rtl:text-right flex items-center gap-4 cursor-pointer hover:border-primary ${
                  roleFilter === "all"
                    ? "border-primary ring-2 ring-primary/20 shadow-md"
                    : "border-borderPrimary/50"
                }`}
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                  <Users className="h-6 w-6" />
                </div>
                <div>
                  <Text as="p" size="xs" font="medium" color="secondary">
                    {isArabic ? "إجمالي المسجلين" : "Total Registered"}
                  </Text>
                  <Text as="h3" size="2xl" font="black" color="primary">
                    {totalUsers}
                  </Text>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setRoleFilter("admin")}
                className={`p-5 rounded-2xl bg-bgSecondary/70 border transition-all text-left rtl:text-right flex items-center gap-4 cursor-pointer hover:border-amber-500 ${
                  roleFilter === "admin"
                    ? "border-amber-500 ring-2 ring-amber-500/20 shadow-md"
                    : "border-borderPrimary/50"
                }`}
              >
                <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
                  <ShieldCheck className="h-6 w-6" />
                </div>
                <div>
                  <Text as="p" size="xs" font="medium" color="secondary">
                    {isArabic ? "الأدمنز" : "Administrators"}
                  </Text>
                  <Text as="h3" size="2xl" font="black" color="primary">
                    {adminUsersCount}
                  </Text>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setRoleFilter("user")}
                className={`p-5 rounded-2xl bg-bgSecondary/70 border transition-all text-left rtl:text-right flex items-center gap-4 cursor-pointer hover:border-emerald-500 ${
                  roleFilter === "user"
                    ? "border-emerald-500 ring-2 ring-emerald-500/20 shadow-md"
                    : "border-borderPrimary/50"
                }`}
              >
                <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
                  <Users className="h-6 w-6" />
                </div>
                <div>
                  <Text as="p" size="xs" font="medium" color="secondary">
                    {isArabic ? "مستخدمين عاديين" : "Standard Users"}
                  </Text>
                  <Text as="h3" size="2xl" font="black" color="primary">
                    {regularUsersCount}
                  </Text>
                </div>
              </button>
            </div>

            {/* Users Table */}
            <div className="rounded-2xl bg-bgSecondary/50 border border-borderPrimary/50 overflow-hidden shadow-lg">
              {isUsersLoading ? (
                <div className="flex justify-center py-16">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : filteredUsers.length === 0 ? (
                <div className="py-16 text-center">
                  <Text as="p" size="xs" color="secondary">
                    {isArabic
                      ? "ملقيناش أي يوزر يطابق البحث أو الفلتر."
                      : "No users found matching your search query or filter."}
                  </Text>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full ltr:text-left rtl:text-right text-xs">
                    <thead className="bg-bgSecondary/90 text-textSecondary font-semibold uppercase tracking-wider border-b border-borderPrimary/40">
                      <tr>
                        <th className="px-6 py-4">
                          {isArabic ? "اليوزر" : "User"}
                        </th>
                        <th className="px-6 py-4">Email</th>
                        <th className="px-6 py-4">{t.profile.jobTitle}</th>
                        <th className="px-6 py-4">{t.admin.role}</th>
                        <th className="px-6 py-4">{t.profile.joined}</th>
                        <th className="px-6 py-4 ltr:text-right rtl:text-left">
                          {t.admin.actions}
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-borderPrimary/30 text-textPrimary font-medium">
                      {filteredUsers.map((userItem) => (
                        <tr
                          key={userItem._id}
                          className="hover:bg-bgSecondary/80 transition-colors"
                        >
                          <td className="px-6 py-4 whitespace-nowrap">
                            <UserHoverCard
                              user={userItem as any}
                              position={isArabic ? "left" : "right"}
                            >
                              <Link
                                href={`/profile/${userItem._id}`}
                                className="flex items-center gap-3 group"
                              >
                                {userItem.profilePicture?.url ? (
                                  <img
                                    src={userItem.profilePicture.url}
                                    alt={userItem.username}
                                    className="h-9 w-9 rounded-xl object-cover border border-borderPrimary group-hover:border-primary transition-colors"
                                  />
                                ) : (
                                  <div className="h-9 w-9 rounded-xl bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                                    <UserIcon className="h-4 w-4" />
                                  </div>
                                )}
                                <div>
                                  <Text
                                    as="p"
                                    size="xs"
                                    font="bold"
                                    color="primary"
                                    className="group-hover:text-primary transition-colors flex items-center gap-1.5"
                                  >
                                    {userItem.username}
                                  </Text>
                                  {userItem.fullName && (
                                    <Text
                                      as="p"
                                      size="xs"
                                      color="secondary"
                                      className="text-[11px] opacity-75"
                                    >
                                      {userItem.fullName}
                                    </Text>
                                  )}
                                </div>
                              </Link>
                            </UserHoverCard>
                          </td>

                          <td className="px-6 py-4 whitespace-nowrap">
                            {userItem.email ? (
                              <div className="flex items-center gap-1.5">
                                <Mail className="h-3.5 w-3.5 text-textSecondary/70" />
                                <Text as="span" size="xs" color="secondary">
                                  {userItem.email}
                                </Text>
                              </div>
                            ) : (
                              <Text
                                as="span"
                                size="xs"
                                color="secondary"
                                className="italic opacity-50"
                              >
                                —
                              </Text>
                            )}
                          </td>

                          <td className="px-6 py-4 whitespace-nowrap">
                            {userItem.jobTitle ? (
                              <div className="flex items-center gap-1.5 text-primary">
                                <Briefcase className="h-3.5 w-3.5" />
                                <Text
                                  as="span"
                                  size="xs"
                                  font="medium"
                                  color="primary"
                                >
                                  {userItem.jobTitle}
                                </Text>
                              </div>
                            ) : (
                              <Text
                                as="span"
                                size="xs"
                                color="secondary"
                                className="italic opacity-50"
                              >
                                —
                              </Text>
                            )}
                          </td>

                          <td className="px-6 py-4 whitespace-nowrap">
                            {userItem.role === "SuperAdmin" ? (
                              <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full text-amber-400 border border-amber-400/40 flex items-center gap-1.5 w-fit">
                                <Crown className="h-3 w-3 text-amber-400" />
                                OWNER
                              </span>
                            ) : userItem.role === "Admin" ? (
                              <span className="text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full bg-amber-500/15 text-amber-500 border border-amber-500/30 flex items-center gap-1 w-fit">
                                <ShieldCheck className="h-3 w-3" />
                                {t.admin.admin}
                              </span>
                            ) : (
                              <span className="text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full bg-slate-500/15 text-textSecondary border border-borderPrimary/40 w-fit">
                                {t.admin.user}
                              </span>
                            )}
                          </td>

                          <td className="px-6 py-4 whitespace-nowrap">
                            {userItem.createdAt ? (
                              <div className="flex items-center gap-1.5">
                                <Calendar className="h-3.5 w-3.5 text-textSecondary/70" />
                                <Text as="span" size="xs" color="secondary">
                                  {new Date(
                                    userItem.createdAt,
                                  ).toLocaleDateString(
                                    isArabic ? "ar-EG" : "en-US",
                                    {
                                      month: "short",
                                      day: "numeric",
                                      year: "numeric",
                                    },
                                  )}
                                </Text>
                              </div>
                            ) : (
                              <Text
                                as="span"
                                size="xs"
                                color="secondary"
                                className="italic opacity-50"
                              >
                                —
                              </Text>
                            )}
                          </td>

                          <td className="px-6 py-4 whitespace-nowrap ltr:text-right rtl:text-left">
                            <div className="flex items-center justify-end gap-2">
                              {/* Edit button: hidden for non-superAdmin users when viewing superAdmin rows */}
                              {(userItem.role !== "SuperAdmin" || currentUser?.role === "SuperAdmin") && (
                                <Tooltip
                                  position="top"
                                  content={
                                    isArabic
                                      ? "تعديل بيانات اليوزر"
                                      : "Edit User Profile"
                                  }
                                >
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setUserToEdit(userItem._id)}
                                    className="h-8 w-8 p-0 rounded-xl cursor-pointer hover:border-primary hover:text-primary transition-all hover:scale-105"
                                  >
                                    <Edit className="h-3.5 w-3.5 text-textSecondary hover:text-primary" />
                                  </Button>
                                </Tooltip>
                              )}

                              {userItem._id && (
                                <Tooltip
                                  position="top"
                                  content={t.profile.userProfile}
                                >
                                  <Link href={`/profile/${userItem._id}`}>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      className="h-8 w-8 p-0 rounded-xl cursor-pointer hover:border-primary hover:text-primary transition-all hover:scale-105"
                                    >
                                      <UserIcon className="h-3.5 w-3.5 text-textSecondary hover:text-primary" />
                                    </Button>
                                  </Link>
                                </Tooltip>
                              )}

                              {/* Remove Admin button - visible only to superAdmin, only on admin users (not superAdmin themselves) */}
                              {currentUser?.role === "SuperAdmin" &&
                                userItem.role === "Admin" && (
                                  <Tooltip
                                    position="top"
                                    content={
                                      isArabic
                                        ? "إلغاء صلاحية الأدمن"
                                        : "Remove Admin"
                                    }
                                  >
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() =>
                                        toggleAdminMutation.mutate(userItem._id)
                                      }
                                      disabled={
                                        toggleAdminMutation.isPending
                                      }
                                      className="h-8 w-8 p-0 rounded-xl cursor-pointer bg-amber-500/10 text-amber-500 border border-amber-500/30 hover:bg-amber-500 hover:text-white hover:border-amber-500 transition-all hover:scale-105"
                                    >
                                      <ShieldOff className="h-3.5 w-3.5" />
                                    </Button>
                                  </Tooltip>
                                )}

                              <Tooltip
                                position="top"
                                content={t.admin.deleteUser}
                              >
                                <Button
                                  variant="destructive"
                                  size="sm"
                                  onClick={() =>
                                    setSelectedUserToDelete({
                                      id: userItem._id,
                                      username: userItem.username,
                                    })
                                  }
                                  disabled={
                                    deleteUserMutation.isPending &&
                                    selectedUserToDelete?.id === userItem._id
                                  }
                                  className="group/delete h-8 w-8 p-0 rounded-xl flex items-center justify-center cursor-pointer bg-rose-500/15 text-rose-500 border border-rose-500/30 hover:bg-rose-600 hover:text-white hover:border-rose-600 transition-all hover:scale-105"
                                >
                                  <Trash2 className="h-3.5 w-3.5 text-rose-500 group-hover/delete:text-white transition-colors" />
                                </Button>
                              </Tooltip>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Edit User Modal */}
      {userToEdit && (() => {
        const freshUser = allUsersList.find((u) => u._id === userToEdit);
        if (!freshUser) return null;
        return (
          <EditProfileModal
            isOpen={true}
            onClose={() => setUserToEdit(null)}
            user={freshUser}
            targetUserId={freshUser._id}
          />
        );
      })()}

      {/* Delete User Modal */}
      <DeleteConfirmModal
        isOpen={!!selectedUserToDelete}
        onClose={() => setSelectedUserToDelete(null)}
        onConfirm={handleConfirmDeleteUser}
        title={t.admin.deleteUser}
        description={
          isArabic
            ? `انت متأكد انك عايز تمسح حساب "${selectedUserToDelete?.username}"؟ كل مقالاته وكومنتاته هتتمسح نهائياً.`
            : `Are you sure you want to delete user account "${selectedUserToDelete?.username}"? All associated posts and comments will be permanently removed.`
        }
        confirmText={t.admin.deleteUser}
        isPending={deleteUserMutation.isPending}
      />
    </div>
  );
}
