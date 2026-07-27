"use client";

import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";

interface ImageModalProps {
  src: string | null;
  alt?: string;
  onClose: () => void;
}

export default function ImageModal({ src, alt, onClose }: ImageModalProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!src) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [src, onClose]);

  if (!mounted || !src) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-100 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-in fade-in duration-200"
      onClick={onClose}
    >
      {/* Close Button */}
      <button
        onClick={onClose}
        className="absolute top-4 ltr:right-4 rtl:left-4 p-2.5 rounded-full bg-black/60 text-white/90 hover:text-white hover:bg-black/90 transition-colors z-101 cursor-pointer"
        aria-label="Close image preview"
      >
        <X className="h-6 w-6" />
      </button>

      {/* Image Container */}
      <div
        className="relative max-w-[92vw] max-h-[90vh] flex flex-col items-center justify-center animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <img
          src={src}
          alt={alt || "Image preview"}
          className="max-w-full max-h-[85vh] object-contain rounded-2xl shadow-2xl border border-white/10"
        />
        {alt && (
          <p className="text-xs text-white/70 mt-3 text-center max-w-md truncate font-medium">
            {alt}
          </p>
        )}
      </div>
    </div>,
    document.body,
  );
}
