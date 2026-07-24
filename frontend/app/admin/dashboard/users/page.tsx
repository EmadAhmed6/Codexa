"use client";

import React, { useState } from "react";
import Link from "next/link";
import Navbar from "@/_components/Navbar";
import AdminSidebar from "@/_components/AdminSidebar";
import { Text } from "@/_components/Text";
import { useGetAllUsers, useDeleteUser } from "@/_features/user/hooks";
import { useGetPosts } from "@/_features/posts/hooks";
import { useGetAuthMeQuery } from "@/_features/auth/hooks";
import {
  Users,
  ShieldCheck,
  ShieldAlert,
  Trash2,
  Loader2,
  Mail,
  Calendar,
  Briefcase,
  User as UserIcon,
  Search,
  ArrowLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import DeleteConfirmModal from "@/_components/DeleteConfirmModal";

export default function AdminUsersPage() {
  const { data: currentUser, isLoading: isAuthLoading } = useGetAuthMeQuery();
  const { data: users, isLoading: isUsersLoading } = useGetAllUsers();
  const { data: posts } = useGetPosts();
  const deleteUserMutation = useDeleteUser();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUserToDelete, setSelectedUserToDelete] = useState<{
    id: string;
    username: string;
  } | null>(null);

  if (isAuthLoading) {
    return (
      <div className="min-h-screen bg-bgPrimary text-textPrimary flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center py-24">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  if (!currentUser?.isAdmin) {
    return (
      <div className="min-h-screen bg-bgPrimary text-textPrimary flex flex-col justify-between">
        <Navbar />
        <main className="flex-1 max-w-xl mx-auto px-4 py-20 text-center flex flex-col items-center justify-center">
          <div className="w-16 h-16 rounded-3xl bg-rose-500/10 border border-rose-500/20 text-rose-500 flex items-center justify-center mb-6">
            <ShieldAlert className="h-8 w-8" />
          </div>
          <Text as="h1" size="2xl" font="extraBold" color="primary" className="mb-2">
            Access Denied
          </Text>
          <Text as="p" size="xs" color="secondary" className="mb-6 leading-relaxed">
            You do not have administrative privileges to access the Admin Dashboard.
          </Text>
          <Link href="/">
            <Button className="rounded-xl bg-primary text-primary-foreground text-xs font-semibold cursor-pointer">
              <ArrowLeft className="h-4 w-4 mr-1.5" />
              <Text as="span" size="xs" font="semiBold" color="white">
                Back to Home
              </Text>
            </Button>
          </Link>
        </main>
      </div>
    );
  }

  const allUsersList = Array.isArray(users) ? users : [];
  const allPostsList = Array.isArray(posts) ? posts : [];

  const filteredUsers = allUsersList.filter((u) => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      u.username?.toLowerCase().includes(q) ||
      u.email?.toLowerCase().includes(q) ||
      u.jobTitle?.toLowerCase().includes(q)
    );
  });

  const totalUsers = allUsersList.length;
  const adminUsersCount = allUsersList.filter((u) => u.isAdmin).length;
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
            <Text as="h1" size="3xl" font="extraBold" color="primary" className="tracking-tight">
              Admin Control Center
            </Text>
            <Text as="p" size="xs" color="secondary">
              Manage system users, published articles, and platform metrics
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
                  User Accounts Management
                </Text>
                <Text as="p" size="xs" color="secondary">
                  View accounts, user credentials, roles, and remove accounts
                </Text>
              </div>

              <div className="relative w-full md:w-72">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-textSecondary" />
                <input
                  type="text"
                  placeholder="Search users by name, email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 text-xs rounded-xl bg-bgSecondary border border-borderPrimary text-textPrimary outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>

            {/* Stats Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-5 rounded-2xl bg-bgSecondary/70 border border-borderPrimary/50 shadow-xs flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                  <Users className="h-6 w-6" />
                </div>
                <div>
                  <Text as="p" size="xs" font="medium" color="secondary">
                    Total Registered
                  </Text>
                  <Text as="h3" size="2xl" font="black" color="primary">
                    {totalUsers}
                  </Text>
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-bgSecondary/70 border border-borderPrimary/50 shadow-xs flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
                  <ShieldCheck className="h-6 w-6" />
                </div>
                <div>
                  <Text as="p" size="xs" font="medium" color="secondary">
                    Administrators
                  </Text>
                  <Text as="h3" size="2xl" font="black" color="primary">
                    {adminUsersCount}
                  </Text>
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-bgSecondary/70 border border-borderPrimary/50 shadow-xs flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
                  <Users className="h-6 w-6" />
                </div>
                <div>
                  <Text as="p" size="xs" font="medium" color="secondary">
                    Standard Users
                  </Text>
                  <Text as="h3" size="2xl" font="black" color="primary">
                    {regularUsersCount}
                  </Text>
                </div>
              </div>
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
                    No users found matching your search query.
                  </Text>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-bgSecondary/90 text-textSecondary font-semibold uppercase tracking-wider border-b border-borderPrimary/40">
                      <tr>
                        <th className="px-6 py-4">User</th>
                        <th className="px-6 py-4">Email</th>
                        <th className="px-6 py-4">Job Title</th>
                        <th className="px-6 py-4">Role</th>
                        <th className="px-6 py-4">Joined Date</th>
                        <th className="px-6 py-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-borderPrimary/30 text-textPrimary font-medium">
                      {filteredUsers.map((userItem) => (
                        <tr
                          key={userItem._id}
                          className="hover:bg-bgSecondary/80 transition-colors"
                        >
                          <td className="px-6 py-4 whitespace-nowrap">
                            <Link
                              href={`/profile/${userItem._id}`}
                              className="flex items-center gap-3 group"
                            >
                              {userItem.profilePicture?.url ? (
                                <img
                                  src={userItem.profilePicture.url}
                                  alt={userItem.username}
                                  className="h-9 w-9 rounded-xl object-cover border border-borderPrimary"
                                />
                              ) : (
                                <div className="h-9 w-9 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                                  <UserIcon className="h-4 w-4" />
                                </div>
                              )}
                              <div>
                                <Text
                                  as="p"
                                  size="xs"
                                  font="bold"
                                  color="primary"
                                  className="group-hover:text-primary transition-colors"
                                >
                                  {userItem.username}
                                </Text>
                                <Text
                                  as="span"
                                  size="xs"
                                  color="secondary"
                                  className="text-[10px]"
                                >
                                  ID: {userItem._id}
                                </Text>
                              </div>
                            </Link>
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
                              <Text as="span" size="xs" color="secondary" className="italic opacity-50">
                                —
                              </Text>
                            )}
                          </td>

                          <td className="px-6 py-4 whitespace-nowrap">
                            {userItem.jobTitle ? (
                              <div className="flex items-center gap-1.5 text-primary">
                                <Briefcase className="h-3.5 w-3.5" />
                                <Text as="span" size="xs" font="medium" color="primary">
                                  {userItem.jobTitle}
                                </Text>
                              </div>
                            ) : (
                              <Text as="span" size="xs" color="secondary" className="italic opacity-50">
                                —
                              </Text>
                            )}
                          </td>

                          <td className="px-6 py-4 whitespace-nowrap">
                            {userItem.isAdmin ? (
                              <span className="text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full bg-amber-500/15 text-amber-500 border border-amber-500/30 flex items-center gap-1 w-fit">
                                <ShieldCheck className="h-3 w-3" />
                                Admin
                              </span>
                            ) : (
                              <span className="text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full bg-slate-500/15 text-textSecondary border border-borderPrimary/40 w-fit">
                                User
                              </span>
                            )}
                          </td>

                          <td className="px-6 py-4 whitespace-nowrap">
                            {userItem.createdAt ? (
                              <div className="flex items-center gap-1.5">
                                <Calendar className="h-3.5 w-3.5 text-textSecondary/70" />
                                <Text as="span" size="xs" color="secondary">
                                  {new Date(userItem.createdAt).toLocaleDateString(
                                    "en-US",
                                    { month: "short", day: "numeric", year: "numeric" },
                                  )}
                                </Text>
                              </div>
                            ) : (
                              <Text as="span" size="xs" color="secondary" className="italic opacity-50">
                                —
                              </Text>
                            )}
                          </td>

                          <td className="px-6 py-4 whitespace-nowrap text-right">
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
                              className="rounded-xl text-xs flex items-center gap-1.5 cursor-pointer ml-auto"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                              <Text as="span" size="xs" font="semiBold" color="white">
                                Delete User
                              </Text>
                            </Button>
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

      <DeleteConfirmModal
        isOpen={!!selectedUserToDelete}
        onClose={() => setSelectedUserToDelete(null)}
        onConfirm={handleConfirmDeleteUser}
        title="Delete User Account"
        description={`Are you sure you want to delete user account "${selectedUserToDelete?.username}"? All associated posts and comments will be permanently removed.`}
        confirmText="Delete User"
        isPending={deleteUserMutation.isPending}
      />
    </div>
  );
}
