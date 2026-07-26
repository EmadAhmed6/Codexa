"use client";

import React from "react";
import { User as UserIcon, Mail, ExternalLink, ShieldCheck } from "lucide-react";
import { Text } from "@/_components/Text";
import { PostUserSummary } from "@/_features/posts/types/Post";

interface AuthorProfileTooltipProps {
  user?: PostUserSummary | null;
  userId?: string;
}

export default function AuthorProfileTooltip({
  user,
  userId,
}: AuthorProfileTooltipProps) {
  const username = user?.username || "Unknown Author";
  const id = user?._id || userId;
  const avatarUrl = user?.profilePicture?.url;
  const jobTitle = user?.jobTitle;
  const email = (user as any)?.email;
  const isAdmin = (user as any)?.isAdmin;

  return (
    <div className="p-3 min-w-56 space-y-2.5">
      {/* Header Info */}
      <div className="flex items-center gap-3 pb-2 border-b border-borderPrimary/40">
        {avatarUrl ? (
          <img
            src={avatarUrl}
            alt={username}
            className="h-10 w-10 rounded-full object-cover border border-borderPrimary shrink-0"
          />
        ) : (
          <div className="h-10 w-10 rounded-full bg-primary/15 text-primary flex items-center justify-center font-bold text-xs shrink-0">
            {username?.[0]?.toUpperCase() || "U"}
          </div>
        )}
        <div className="flex flex-col truncate">
          <div className="flex items-center gap-1.5">
            <Text
              as="span"
              size="xs"
              font="bold"
              color="primary"
              className="truncate"
            >
              {username}
            </Text>
            {isAdmin && (
              <span className="text-[9px] font-bold uppercase px-1.5 py-0.5 rounded-md bg-amber-500/15 text-amber-500 border border-amber-500/30 flex items-center gap-0.5 shrink-0">
                <ShieldCheck className="h-2.5 w-2.5" />
                Admin
              </span>
            )}
          </div>
          {jobTitle ? (
            <Text
              as="span"
              size="xs"
              color="secondary"
              className="truncate text-[11px]"
            >
              {jobTitle}
            </Text>
          ) : (
            <Text
              as="span"
              size="xs"
              color="secondary"
              className="text-[10px] opacity-70"
            >
              Community Member
            </Text>
          )}
        </div>
      </div>

      {/* Details List */}
      <div className="space-y-1 text-[11px]">
        {email && (
          <div className="flex items-center gap-1.5 text-textSecondary">
            <Mail className="h-3 w-3 shrink-0 text-primary/80" />
            <span className="truncate">{email}</span>
          </div>
        )}
        {id && (
          <div className="flex items-center gap-1.5 text-textSecondary/70 text-[10px]">
            <span className="font-semibold text-textSecondary">ID:</span>
            <span className="truncate font-mono">{id}</span>
          </div>
        )}
        {(user as any)?.bio && (
          <p className="text-[11px] text-textSecondary italic leading-relaxed line-clamp-2 pt-1 border-t border-borderPrimary/30">
            "{(user as any).bio}"
          </p>
        )}
      </div>

      {/* Footer Prompt */}
      <div className="pt-2 border-t border-borderPrimary/30 flex items-center justify-between text-[10px] text-primary font-semibold">
        <span>Click to view profile</span>
        <ExternalLink className="h-3 w-3" />
      </div>
    </div>
  );
}
