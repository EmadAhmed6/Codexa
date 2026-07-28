"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Users, FileText } from "lucide-react";
import { Text } from "@/_components/Text";
import { UserProfile } from "@/_features/posts/types/Post";
import { useLanguage } from "@/context/LanguageContext";

interface AdminSidebarProps {
  currentUser?: UserProfile | null;
  totalUsers?: number;
  totalPosts?: number;
}

export default function AdminSidebar({
  currentUser,
  totalUsers = 0,
  totalPosts = 0,
}: AdminSidebarProps) {
  const pathname = usePathname();
  const { t } = useLanguage();

  const isUsersActive =
    pathname === "/admin/dashboard/users" || pathname === "/admin/dashboard";
  const isPostsActive = pathname === "/admin/dashboard/posts";

  return (
    <aside className="bg-bgSecondary/60 border border-borderPrimary/50 rounded-2xl p-4 shadow-sm backdrop-blur-xs">
      <Text
        as="p"
        size="xs"
        font="bold"
        color="secondary"
        className="uppercase tracking-wider px-3 mb-3"
      >
        {t.admin.navMenu}
      </Text>

      <nav className="flex flex-col gap-1.5">
        {/* Users Route Link */}
        <Link
          href="/admin/dashboard/users"
          className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all cursor-pointer ${
            isUsersActive
              ? "bg-primary text-primary-foreground shadow-md shadow-primary/20"
              : "text-textSecondary hover:text-textPrimary hover:bg-bgSecondary/90"
          }`}
        >
          <div className="flex items-center gap-2.5">
            <Users className="h-4 w-4" />
            <Text
              as="span"
              size="xs"
              font="semiBold"
              color={isUsersActive ? "white" : "primary"}
            >
              {t.admin.usersManagement}
            </Text>
          </div>
          <span
            className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
              isUsersActive
                ? "bg-white/20 text-white"
                : "bg-borderPrimary/40 text-textSecondary"
            }`}
          >
            {totalUsers}
          </span>
        </Link>

        {/* Posts Route Link */}
        <Link
          href="/admin/dashboard/posts"
          className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all cursor-pointer ${
            isPostsActive
              ? "bg-primary text-primary-foreground shadow-md shadow-primary/20"
              : "text-textSecondary hover:text-textPrimary hover:bg-bgSecondary/90"
          }`}
        >
          <div className="flex items-center gap-2.5">
            <FileText className="h-4 w-4" />
            <Text
              as="span"
              size="xs"
              font="semiBold"
              color={isPostsActive ? "white" : "primary"}
            >
              {t.admin.postsManagement}
            </Text>
          </div>
          <span
            className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
              isPostsActive
                ? "bg-white/20 text-white"
                : "bg-borderPrimary/40 text-textSecondary"
            }`}
          >
            {totalPosts}
          </span>
        </Link>
      </nav>

      {/* Admin Profile Info Link */}
      {currentUser && (
        <Link
          href={`/profile/${currentUser._id}`}
          className="mt-6 pt-4 border-t border-borderPrimary/40 px-3 flex items-center gap-3 hover:opacity-80 transition-all group cursor-pointer"
        >
          {currentUser.profilePicture?.url ? (
            <img
              src={currentUser.profilePicture.url}
              alt={currentUser.username}
              className="h-9 w-9 rounded-xl object-cover border border-borderPrimary group-hover:border-primary transition-colors"
            />
          ) : (
            <div className="h-9 w-9 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center font-bold text-xs">
              {currentUser.username?.[0]?.toUpperCase()}
            </div>
          )}
          <div className="overflow-hidden">
            <Text
              as="p"
              size="xs"
              font="bold"
              color="primary"
              className="truncate group-hover:text-primary transition-colors"
            >
              {currentUser.username}
            </Text>
            <Text
              as="span"
              size="xs"
              font="semiBold"
              className="text-[10px] text-amber-500 uppercase block tracking-wider"
            >
              {t.admin.adminBadge}
            </Text>
          </div>
        </Link>
      )}
    </aside>
  );
}
