"use client";

import React from "react";

export default function PostCardSkeleton() {
  return (
    <div className="bg-bgSecondary/60 border border-borderPrimary/50 rounded-2xl p-5 md:p-6 shadow-xs animate-pulse space-y-4">
      {/* 1. Top Header: Author Avatar & Name + Category badge */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="h-9 w-9 rounded-full bg-borderPrimary/40 shrink-0" />
          <div className="space-y-1.5">
            <div className="h-3.5 w-28 bg-borderPrimary/40 rounded-md" />
            <div className="h-2.5 w-20 bg-borderPrimary/30 rounded-md" />
          </div>
        </div>
        <div className="h-5 w-16 bg-borderPrimary/40 rounded-md shrink-0" />
      </div>

      {/* 2. Content: Title & Description */}
      <div className="space-y-2 py-1">
        <div className="h-5 w-3/4 bg-borderPrimary/40 rounded-md" />
        <div className="h-3.5 w-full bg-borderPrimary/30 rounded-md" />
        <div className="h-3.5 w-4/5 bg-borderPrimary/30 rounded-md" />
      </div>

      {/* 3. Cover Image Skeleton */}
      <div className="w-full aspect-video rounded-xl bg-borderPrimary/30" />

      {/* 4. Bottom Action Bar */}
      <div className="pt-3 border-t border-borderPrimary/30 flex items-center gap-4">
        <div className="h-6 w-14 bg-borderPrimary/40 rounded-lg" />
        <div className="h-6 w-14 bg-borderPrimary/40 rounded-lg" />
        <div className="h-6 w-14 bg-borderPrimary/40 rounded-lg" />
      </div>
    </div>
  );
}
