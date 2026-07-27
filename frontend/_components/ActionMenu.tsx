"use client";

import React, { useState, useRef, useEffect } from "react";
import { MoreVertical, Edit2, Trash2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";

interface ActionMenuProps {
  onEdit?: () => void;
  onDelete?: () => void;
  editLabel?: string;
  deleteLabel?: string;
  align?: "left" | "right";
}

export default function ActionMenu({
  onEdit,
  onDelete,
  editLabel,
  deleteLabel,
  align = "right",
}: ActionMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const { t, isArabic } = useLanguage();

  const finalEditLabel = editLabel || t.post.edit;
  const finalDeleteLabel = deleteLabel || t.post.delete;

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className="relative inline-block text-left" ref={menuRef}>
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          e.preventDefault();
          setIsOpen((prev) => !prev);
        }}
        className="p-1 rounded-xl text-textSecondary hover:text-textPrimary hover:bg-bgPrimary/80 transition-colors cursor-pointer"
        aria-label="More options"
      >
        <MoreVertical className="h-4 w-4" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -4 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -4 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className={`absolute ${
              isArabic
                ? align === "right"
                  ? "left-0"
                  : "right-0"
                : align === "right"
                  ? "right-0"
                  : "left-0"
            } top-full mt-1 w-36 rounded-xl bg-bgSecondary border border-borderPrimary/60 shadow-xl z-50 p-1.5 space-y-0.5`}
            onClick={(e) => e.stopPropagation()}
          >
            {onEdit && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  setIsOpen(false);
                  onEdit();
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold rounded-lg text-textPrimary hover:bg-primary/10 hover:text-primary transition-colors cursor-pointer text-start"
              >
                <Edit2 className="h-3.5 w-3.5 text-primary shrink-0" />
                <span>{finalEditLabel}</span>
              </button>
            )}

            {onDelete && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  setIsOpen(false);
                  onDelete();
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold rounded-lg text-rose-500 hover:bg-rose-500/10 transition-colors cursor-pointer text-start"
              >
                <Trash2 className="h-3.5 w-3.5 text-rose-500 shrink-0" />
                <span>{finalDeleteLabel}</span>
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
