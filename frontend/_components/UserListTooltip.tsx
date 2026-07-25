"use client";

import React from "react";
import { User as UserIcon, Heart, Share2 } from "lucide-react";
import { Text } from "@/_components/Text";
import { PostUserSummary } from "@/_features/posts/types/Post";

interface UserListTooltipProps {
  users?: (string | PostUserSummary)[];
  type: "like" | "share";
}

export default function UserListTooltip({ users, type }: UserListTooltipProps) {
  const userObjects = Array.isArray(users)
    ? (users.filter((item) => typeof item === "object" && item !== null) as PostUserSummary[])
    : [];

  const count = userObjects.length;

  if (count === 0) {
    return (
      <div className="flex items-center gap-1.5 px-1 py-0.5">
        {type === "like" ? (
          <Heart className="h-3.5 w-3.5 text-rose-500 fill-rose-500/20" />
        ) : (
          <Share2 className="h-3.5 w-3.5 text-primary" />
        )}
        <Text as="span" size="xs" color="secondary">
          No {type === "like" ? "likes" : "shares"} yet
        </Text>
      </div>
    );
  }

  const displayUsers = userObjects.slice(0, 5);
  const remainingCount = count - displayUsers.length;

  return (
    <div className="space-y-2 min-w-44 p-0.5">
      <div className="flex items-center gap-1.5 pb-1.5 border-b border-borderPrimary/40">
        {type === "like" ? (
          <Heart className="h-3.5 w-3.5 text-rose-500 fill-rose-500" />
        ) : (
          <Share2 className="h-3.5 w-3.5 text-primary" />
        )}
        <Text as="span" size="xs" font="bold" color="primary">
          {type === "like" ? "Liked by" : "Shared by"} ({count})
        </Text>
      </div>

      <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
        {displayUsers.map((u, idx) => (
          <div key={u._id || idx} className="flex items-center gap-2">
            {u.profilePicture?.url ? (
              <img
                src={u.profilePicture.url}
                alt={u.username || "User"}
                className="h-6 w-6 rounded-full object-cover border border-borderPrimary shrink-0"
              />
            ) : (
              <div className="h-6 w-6 rounded-full bg-primary/15 text-primary flex items-center justify-center shrink-0">
                <UserIcon className="h-3 w-3" />
              </div>
            )}
            <div className="flex flex-col truncate">
              <Text
                as="span"
                size="xs"
                font="bold"
                color="primary"
                className="truncate leading-tight text-[11px]"
              >
                {u.username || "User"}
              </Text>
              {u.jobTitle && (
                <Text
                  as="span"
                  size="xs"
                  color="secondary"
                  className="truncate text-[10px] opacity-80"
                >
                  {u.jobTitle}
                </Text>
              )}
            </div>
          </div>
        ))}
      </div>

      {remainingCount > 0 && (
        <div className="pt-1 border-t border-borderPrimary/30 text-center">
          <Text as="span" size="xs" color="secondary" className="text-[10px] font-semibold">
            + {remainingCount} more {remainingCount === 1 ? "user" : "users"}
          </Text>
        </div>
      )}
    </div>
  );
}
