"use client";

import React, { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/utils";

export type TooltipPosition = "top" | "bottom" | "left" | "right";
export type Alignment = "center" | "left" | "right";

interface TooltipProps {
  content: React.ReactNode;
  position?: TooltipPosition;
  children: React.ReactNode;
  className?: string;
  tooltipClassName?: string;
  delayHide?: number;
}

export default function Tooltip({
  content,
  position = "top",
  children,
  className,
  tooltipClassName,
  delayHide = 200,
}: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [coords, setCoords] = useState<{
    top: number;
    left: number;
    activePos: TooltipPosition;
    align: Alignment;
  }>({
    top: 0,
    left: 0,
    activePos: position,
    align: "center",
  });

  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  if (!content) return <>{children}</>;

  const updateCoords = () => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();

    let activePos = position;
    if (position === "top" && rect.top < 220) {
      activePos = "bottom";
    } else if (position === "bottom" && window.innerHeight - rect.bottom < 220) {
      activePos = "top";
    }

    let align: Alignment = "center";
    let left = rect.left + rect.width / 2;

    // Check boundary distance from viewport edges
    if (rect.left < 160) {
      align = "left";
      left = rect.left;
    } else if (window.innerWidth - rect.right < 160) {
      align = "right";
      left = rect.right;
    }

    let top = 0;
    if (activePos === "top") {
      top = rect.top - 8;
    } else if (activePos === "bottom") {
      top = rect.bottom + 8;
    } else if (activePos === "left") {
      top = rect.top + rect.height / 2;
      left = rect.left - 8;
    } else if (activePos === "right") {
      top = rect.top + rect.height / 2;
      left = rect.right + 8;
    }

    setCoords({ top, left, activePos, align });
  };

  const handleMouseEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    updateCoords();
    setIsVisible(true);
  };

  const handleMouseLeave = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => {
      setIsVisible(false);
    }, delayHide);
  };

  const renderTooltipPortal = () => {
    if (!isVisible || !mounted || typeof window === "undefined") return null;

    const { top, left, activePos, align } = coords;

    const positionStyle: React.CSSProperties = {
      position: "fixed",
      top: `${top}px`,
      left: `${left}px`,
      zIndex: 999999,
    };

    let transformClass = "";
    if (activePos === "top") {
      if (align === "left") transformClass = "-translate-y-full";
      else if (align === "right") transformClass = "-translate-x-full -translate-y-full";
      else transformClass = "-translate-x-1/2 -translate-y-full";
    } else if (activePos === "bottom") {
      if (align === "left") transformClass = "";
      else if (align === "right") transformClass = "-translate-x-full";
      else transformClass = "-translate-x-1/2";
    } else if (activePos === "left") {
      transformClass = "-translate-x-full -translate-y-1/2";
    } else if (activePos === "right") {
      transformClass = "-translate-y-1/2";
    }

    // Bridge styles for hover continuity
    let bridgeClass = "";
    if (activePos === "top") bridgeClass = "pb-2.5 after:absolute after:top-full after:left-0 after:right-0 after:h-4 after:content-['']";
    else if (activePos === "bottom") bridgeClass = "pt-2.5 after:absolute after:bottom-full after:left-0 after:right-0 after:h-4 after:content-['']";
    else if (activePos === "left") bridgeClass = "pr-2.5 after:absolute after:left-full after:top-0 after:bottom-0 after:w-4 after:content-['']";
    else if (activePos === "right") bridgeClass = "pl-2.5 after:absolute after:right-full after:top-0 after:bottom-0 after:w-4 after:content-['']";

    let arrowClass = "";
    if (activePos === "top") {
      arrowClass = "top-full -mt-1 border-t-bgSecondary border-x-transparent border-b-transparent";
      if (align === "left") arrowClass += " ltr:left-4 rtl:right-4";
      else if (align === "right") arrowClass += " ltr:right-4 rtl:left-4";
      else arrowClass += " left-1/2 -translate-x-1/2";
    } else if (activePos === "bottom") {
      arrowClass = "bottom-full -mb-1 border-b-bgSecondary border-x-transparent border-t-transparent";
      if (align === "left") arrowClass += " ltr:left-4 rtl:right-4";
      else if (align === "right") arrowClass += " ltr:right-4 rtl:left-4";
      else arrowClass += " left-1/2 -translate-x-1/2";
    } else if (activePos === "left") {
      arrowClass = "left-full top-1/2 -translate-y-1/2 -ml-1 border-l-bgSecondary border-y-transparent border-r-transparent";
    } else if (activePos === "right") {
      arrowClass = "right-full top-1/2 -translate-y-1/2 -mr-1 border-r-bgSecondary border-y-transparent border-l-transparent";
    }

    return createPortal(
      <div
        style={positionStyle}
        className={cn(
          "pointer-events-auto transition-all duration-150 animate-in fade-in zoom-in-95",
          transformClass,
          bridgeClass,
          tooltipClassName,
        )}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div className="relative bg-bgSecondary border border-borderPrimary/80 rounded-xl shadow-2xl p-2.5 min-w-max max-w-xs text-xs text-textPrimary">
          {content}
          <div className={cn("absolute w-0 h-0 border-4", arrowClass)} />
        </div>
      </div>,
      document.body,
    );
  };

  return (
    <div
      ref={containerRef}
      className={cn("relative inline-flex items-center group", className)}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {children}
      {renderTooltipPortal()}
    </div>
  );
}
