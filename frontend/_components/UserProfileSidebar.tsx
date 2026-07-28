"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  User as UserIcon,
  LogIn,
  FileText,
  CheckCircle2,
  Briefcase,
  Crown,
} from "lucide-react";
import { useGetAuthMeQuery } from "@/_features/auth/hooks";
import { Text } from "@/_components/Text";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/context/LanguageContext";

interface UserProfileSidebarProps {
  onOpenCreatePost?: () => void;
}

export default function UserProfileSidebar({
  onOpenCreatePost,
}: UserProfileSidebarProps) {
  const [mounted, setMounted] = useState(false);
  const { data: currentUser, isLoading } = useGetAuthMeQuery();
  const { t } = useLanguage();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || isLoading) {
    return (
      <div className="bg-bgSecondary/60 border border-borderPrimary/40 rounded-2xl p-5 shadow-xs animate-pulse space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-borderPrimary/40 shrink-0" />
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-borderPrimary/40 rounded-md w-3/4" />
            <div className="h-3 bg-borderPrimary/30 rounded-md w-1/2" />
          </div>
        </div>
        <div className="h-10 bg-borderPrimary/30 rounded-xl" />
      </div>
    );
  }

  if (!currentUser) {
    return (
      <div className="bg-bgSecondary/60 border border-borderPrimary/50 rounded-2xl p-5 shadow-xs space-y-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
            <UserIcon className="h-5 w-5" />
          </div>
          <div>
            <Text as="h3" size="sm" font="bold" color="primary">
              {t.auth.startCreating || "Welcome to Fluxion"}
            </Text>
            <Text as="p" size="xs" color="secondary">
              {t.auth.startCreatingDesc || "Join our developer community"}
            </Text>
          </div>
        </div>

        <div className="flex flex-col gap-2 pt-2">
          <Link href="/auth/login" className="w-full">
            <Button
              variant="default"
              className="w-full justify-center gap-2 rounded-xl text-xs font-bold py-2 cursor-pointer"
            >
              <LogIn className="h-4 w-4" />
              {t.nav.signIn || "Sign In"}
            </Button>
          </Link>
          <Link href="/auth/register" className="w-full">
            <Button
              variant="outline"
              className="w-full justify-center gap-2 rounded-xl text-xs font-bold py-2 cursor-pointer"
            >
              {t.nav.signUp || "Create Account"}
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const displayName = currentUser.fullName;
  const userBio = (currentUser as any).bio;

  return (
    <div className="bg-bgSecondary/60 border border-borderPrimary/50 rounded-2xl p-5 shadow-xs hover:shadow-md transition-shadow relative overflow-hidden space-y-5">
      {/* Cover Header Accent */}
      <div className="absolute top-0 inset-x-0 h-16 bg-linear-to-r from-primary/20 via-indigo-500/10 to-primary/10 z-0" />

      {/* User Header */}
      <div className="relative z-10 pt-2 flex flex-col items-start gap-3">
        <Link href={`/profile/${currentUser._id}`} className="group block">
          {currentUser.profilePicture?.url ? (
            <img
              src={currentUser.profilePicture.url}
              alt={displayName}
              className="h-16 w-16 rounded-full object-cover border-2 border-bgSecondary ring-2 ring-primary/30 group-hover:ring-primary transition-all shadow-md"
            />
          ) : (
            <div className="h-16 w-16 rounded-full bg-primary/15 text-primary flex items-center justify-center border-2 border-bgSecondary ring-2 ring-primary/30 group-hover:ring-primary transition-all shadow-md">
              <UserIcon className="h-8 w-8" />
            </div>
          )}
        </Link>

        <div>
          <Link
            href={`/profile/${currentUser._id}`}
            className="group flex items-center gap-1.5"
          >
            <Text
              as="h3"
              size="default"
              font="bold"
              color="primary"
              className="group-hover:text-primary transition-colors truncate max-w-44"
            >
              {displayName}
            </Text>
            {currentUser.isVerified && (
              <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />
            )}
            {currentUser.isSuperAdmin ? (
              <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full text-amber-400 border border-amber-400/40 flex items-center gap-1.5 w-fit">
                <Crown className="h-3 w-3 text-amber-400" />
                {t.profile.owner}
              </span>
            ) : currentUser.isAdmin ? (
              <span className="text-[10px] uppercase font-extrabold px-1.5 py-0.5 rounded-md bg-amber-500/10 text-amber-500 border border-amber-500/20">
                {t.profile.admin}
              </span>
            ) : null}
          </Link>

          {currentUser.jobTitle && (
            <div className="flex items-center gap-1.5 mt-0.5 text-xs text-textSecondary font-medium">
              <Briefcase className="h-3.5 w-3.5 text-primary shrink-0" />
              <span className="text-xs">{currentUser.jobTitle}</span>
            </div>
          )}

          {userBio && (
            <Text
              as="p"
              size="xs"
              color="secondary"
              className="text-xs font-medium italic mt-0.5 wrap-gbreak-words"
            >
              {userBio}
            </Text>
          )}
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 gap-2 pt-3 border-t border-borderPrimary/40">
        <div className="flex items-center justify-between p-2.5 rounded-xl bg-bgPrimary/40 border border-borderPrimary/30">
          <div className="flex items-center gap-2">
            <FileText className="h-4 w-4 text-primary" />
            <Text as="span" size="xs" font="medium" color="secondary">
              {t.profile.articlesPublished || "Total Posts"}
            </Text>
          </div>
          <Text as="span" size="xs" font="bold" color="primary">
            {currentUser.postsCount || 0}
          </Text>
        </div>
      </div>

      {/* Profile Link */}
      <Link
        href={`/profile/${currentUser._id}`}
        className="block text-center text-xs font-semibold text-primary hover:underline pt-1"
      >
        {t.nav.myProfile || "View Full Profile →"}
      </Link>
    </div>
  );
}
