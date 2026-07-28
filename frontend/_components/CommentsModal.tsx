"use client";

import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { X, MessageSquare, Repeat } from "lucide-react";
import CommentSection from "@/_components/CommentSection";
import { Text } from "@/_components/Text";
import { useLanguage } from "@/context/LanguageContext";

interface CommentsModalProps {
  isOpen: boolean;
  onClose: () => void;
  postId: string;
  postTitle?: string;
  postAuthorName?: string;
  sharesCount?: number;
}

export default function CommentsModal({
  isOpen,
  onClose,
  postId,
  postTitle,
  postAuthorName,
  sharesCount,
}: CommentsModalProps) {
  const { t } = useLanguage();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Disable body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen || !mounted) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-100 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="bg-bgSecondary border border-borderPrimary/60 w-full max-w-2xl rounded-2xl shadow-2xl overflow-visible flex flex-col h-[82vh] max-h-162.5 animate-in zoom-in-95 duration-200 relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header (Fixed Top) */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-borderPrimary/40 bg-bgSecondary/90 backdrop-blur-md shrink-0 z-20">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="p-2 rounded-xl bg-primary/10 text-primary shrink-0">
              <MessageSquare className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <Text as="h3" size="default" font="bold" color="primary" className="truncate">
                {t.post.discussionComments || "Comments"}
              </Text>
              {postTitle && (
                <Text as="p" size="xs" color="secondary" className="truncate text-xs">
                  {postAuthorName ? `${postAuthorName} • ` : ""}
                  {postTitle}
                </Text>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3">
            {sharesCount !== undefined && (
              <div
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-primary/10 text-primary text-xs font-semibold"
                title={t.post.shared || "Shares"}
              >
                <Repeat className="h-3.5 w-3.5 text-primary" />
                <Text as="span" size="xs" font="semiBold" color="primary">
                  {sharesCount}
                </Text>
              </div>
            )}

            <button
              onClick={onClose}
              className="p-1.5 rounded-xl text-textSecondary hover:text-textPrimary hover:bg-bgPrimary/60 transition-colors cursor-pointer"
              aria-label="Close modal"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Modal Body - Embedded CommentSection with Pinned Input Form */}
        <div className="flex-1 overflow-visible min-h-0 relative flex flex-col">
          <CommentSection postId={postId} hideHeader={true} isModal={true} onCloseModal={onClose} />
        </div>
      </div>
    </div>,
    document.body,
  );
}
