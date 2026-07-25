"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, Trash2, X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Text } from "@/_components/Text";

interface DeleteConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void | Promise<void>;
  title: string;
  description: string;
  confirmText?: string;
  isPending?: boolean;
}

export default function DeleteConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = "Delete",
  isPending = false,
}: DeleteConfirmModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/70 backdrop-blur-xs"
          />

          {/* Modal Card */}
          <motion.div
            initial={{ scale: 0.92, opacity: 0, y: 10 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.92, opacity: 0, y: 10 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="relative w-full max-w-md bg-bgSecondary border border-borderPrimary rounded-3xl p-6 md:p-8 shadow-2xl z-10 overflow-hidden"
          >
            {/* Top Close Button */}
            <button
              type="button"
              onClick={onClose}
              className="absolute top-4 right-4 p-2 rounded-xl text-textSecondary hover:text-textPrimary hover:bg-bgPrimary transition-colors cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>

            {/* Warning Icon Banner */}
            <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-rose-500/10 text-rose-500 border border-rose-500/20 mb-5">
              <AlertTriangle className="h-7 w-7" />
            </div>

            {/* Title & Description */}
            <Text as="h3" size="xl" font="bold" color="primary" className="mb-2">
              {title}
            </Text>
            <Text
              as="p"
              size="sm"
              color="secondary"
              className="leading-relaxed mb-6 text-xs md:text-sm"
            >
              {description}
            </Text>

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-3 pt-2 border-t border-borderPrimary/40">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={isPending}
                className="rounded-xl border-borderPrimary px-4 text-xs font-semibold"
              >
                <Text as="span" size="xs" font="semiBold" color="primary">
                  Cancel
                </Text>
              </Button>
              <Button
                type="button"
                onClick={onConfirm}
                disabled={isPending}
                className="rounded-xl px-5 text-xs font-semibold flex items-center gap-2 cursor-pointer bg-rose-600 hover:bg-rose-700 text-white shadow-md shadow-rose-600/20"
              >
                {isPending ? (
                  <>
                    <Loader2 className="h-3.5 w-3.5 animate-spin text-white" />
                    <Text as="span" size="xs" font="semiBold" color="white">
                      Deleting...
                    </Text>
                  </>
                ) : (
                  <>
                    <Trash2 className="h-3.5 w-3.5 text-white" />
                    <Text as="span" size="xs" font="semiBold" color="white">
                      {confirmText}
                    </Text>
                  </>
                )}
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
