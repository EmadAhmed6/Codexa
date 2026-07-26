"use client";

import React from "react";
import Link from "next/link";
import { User as UserIcon, ExternalLink } from "lucide-react";
import Tooltip from "./Tooltip";
import { Text } from "./Text";

interface UserHoverCardProps {
  user?: {
    _id?: string;
    username?: string;
    profilePicture?: {
      url?: string;
    };
  };
  children: React.ReactNode;
}

export default function UserHoverCard({ user, children }: UserHoverCardProps) {
  if (!user || !user._id) return <>{children}</>;

  const content = (
    <div className="p-2.5 max-w-xs space-y-2 min-w-42.5 text-left">
      <div className="flex items-center gap-2.5">
        {user.profilePicture?.url ? (
          <img
            src={user.profilePicture.url}
            alt={user.username || "User"}
            className="h-8 w-8 rounded-full object-cover border border-borderPrimary shrink-0"
          />
        ) : (
          <div className="h-8 w-8 rounded-full bg-primary/15 text-primary flex items-center justify-center shrink-0 font-bold text-xs">
            <UserIcon className="h-4 w-4" />
          </div>
        )}
        <Text
          as="h4"
          size="xs"
          font="bold"
          color="primary"
          className="truncate leading-tight"
        >
          {user.username || "User"}
        </Text>
      </div>

      <div className="pt-1.5 text-right border-t border-borderPrimary/20">
        <Link
          href={`/profile/${user._id}`}
          onClick={(e) => e.stopPropagation()}
          className="inline-flex items-center gap-1 text-[11px] font-semibold text-primary hover:underline cursor-pointer"
        >
          <span>View Profile</span>
          <ExternalLink className="h-3 w-3" />
        </Link>
      </div>
    </div>
  );

  return (
    <Tooltip position="top" content={content}>
      {children}
    </Tooltip>
  );
}
