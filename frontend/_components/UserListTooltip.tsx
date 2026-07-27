"use client";

import React from "react";
import Link from "next/link";
import { User as UserIcon, Heart, Share2 } from "lucide-react";
import { Text } from "@/_components/Text";
import { PostUserSummary } from "@/_features/posts/types/Post";
import { useLanguage } from "@/context/LanguageContext";

interface UserListTooltipProps {
  users?: (string | PostUserSummary)[];
  type: "like" | "share";
}

export default function UserListTooltip({
  users,
  type,
}: UserListTooltipProps) {
  const { isArabic } = useLanguage();

  const rawUserObjects = Array.isArray(users)
    ? (users.filter(
        (item) => typeof item === "object" && item !== null,
      ) as PostUserSummary[])
    : [];

  // Deduplicate users by ID / username and count occurrences per user
  const userCounts: Record<string, number> = {};
  const uniqueUserObjects: PostUserSummary[] = [];

  for (const u of rawUserObjects) {
    const key = u._id || (u as any).id || u.username;
    if (!key) continue;
    if (!userCounts[key]) {
      userCounts[key] = 1;
      uniqueUserObjects.push(u);
    } else {
      userCounts[key] += 1;
    }
  }

  const count = uniqueUserObjects.length;

  if (count === 0) {
    return (
      <div className="flex items-center gap-1.5 px-1 py-0.5">
        {type === "like" ? (
          <Heart className="h-3.5 w-3.5 text-rose-500 fill-rose-500/20" />
        ) : (
          <Share2 className="h-3.5 w-3.5 text-primary" />
        )}
        <Text as="span" size="xs" color="secondary">
          {type === "like"
            ? isArabic
              ? "مفيش إعجابات لسه"
              : "No likes yet"
            : isArabic
              ? "مفيش شيرات لسه"
              : "No shares yet"}
        </Text>
      </div>
    );
  }

  const displayUsers = uniqueUserObjects.slice(0, 5);
  const remainingCount = count - displayUsers.length;

  const headerTitle =
    type === "like"
      ? isArabic
        ? "أعجب بواسطة"
        : "Liked by"
      : isArabic
        ? "تمت المشاركة بواسطة"
        : "Shared by";

  return (
    <div className="space-y-2 min-w-44 p-0.5">
      <div className="flex items-center gap-1.5 pb-1.5 border-b border-borderPrimary/40">
        {type === "like" ? (
          <Heart className="h-3.5 w-3.5 text-rose-500 fill-rose-500" />
        ) : (
          <Share2 className="h-3.5 w-3.5 text-primary" />
        )}
        <Text as="span" size="xs" font="bold" color="primary">
          {headerTitle} ({count})
        </Text>
      </div>

      <div className="space-y-1 max-h-48 overflow-y-auto pr-1">
        {displayUsers.map((u, idx) => {
          const userId = u._id || (u as any).id || u.username;
          const shareCount = userId ? userCounts[userId] || 1 : 1;
          const displayName = u.fullName || u.username || (isArabic ? "مستخدم" : "User");
          return (
            <Link
              key={userId || idx}
              href={`/profile/${userId || "me"}`}
              onClick={(e) => e.stopPropagation()}
              className="flex items-center justify-between gap-2 p-1.5 rounded-lg hover:bg-primary/10 transition-colors group/user cursor-pointer"
            >
              <div className="flex items-center gap-2 min-w-0">
                {u.profilePicture?.url ? (
                  <img
                    src={u.profilePicture.url}
                    alt={displayName}
                    className="h-6 w-6 rounded-full object-cover border border-borderPrimary/60 shrink-0 group-hover/user:scale-105 transition-transform"
                  />
                ) : (
                  <div className="h-6 w-6 rounded-full bg-primary/15 text-primary flex items-center justify-center shrink-0 group-hover/user:bg-primary/25 transition-colors">
                    <UserIcon className="h-3 w-3" />
                  </div>
                )}
                <Text
                  as="span"
                  size="xs"
                  font="bold"
                  color="primary"
                  className="truncate leading-tight text-[11px] group-hover/user:text-primary group-hover/user:underline"
                >
                  {displayName}
                </Text>
              </div>

              {type === "share" && shareCount > 1 && (
                <span className="text-[10px] font-extrabold text-primary bg-primary/15 px-1.5 py-0.5 rounded-md border border-primary/20 shrink-0">
                  {shareCount}x
                </span>
              )}
            </Link>
          );
        })}
      </div>

      {remainingCount > 0 && (
        <div className="pt-1 border-t border-borderPrimary/30 text-center">
          <Text
            as="span"
            size="xs"
            color="secondary"
            className="text-[10px] font-semibold"
          >
            {isArabic
              ? `+ ${remainingCount} مستخدمين آخرين`
              : `+ ${remainingCount} more ${remainingCount === 1 ? "user" : "users"}`}
          </Text>
        </div>
      )}
    </div>
  );
}
