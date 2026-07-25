"use client";

import React, { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";

export type TooltipPosition = "top" | "bottom" | "left" | "right";

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
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  if (!content) return <>{children}</>;

  const handleMouseEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
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

  const positionClasses: Record<TooltipPosition, string> = {
    top: "bottom-full left-1/2 -translate-x-1/2 mb-1.5 pb-2.5",
    bottom: "top-full left-1/2 -translate-x-1/2 mt-1.5 pt-2.5",
    left: "right-full top-1/2 -translate-y-1/2 mr-1.5 pr-2.5",
    right: "left-full top-1/2 -translate-y-1/2 ml-1.5 pl-2.5",
  };

  const bridgeClasses: Record<TooltipPosition, string> = {
    top: "after:absolute after:top-full after:left-0 after:right-0 after:h-4 after:content-['']",
    bottom: "after:absolute after:bottom-full after:left-0 after:right-0 after:h-4 after:content-['']",
    left: "after:absolute after:left-full after:top-0 after:bottom-0 after:w-4 after:content-['']",
    right: "after:absolute after:right-full after:top-0 after:bottom-0 after:w-4 after:content-['']",
  };

  const arrowClasses: Record<TooltipPosition, string> = {
    top: "top-full left-1/2 -translate-x-1/2 -mt-1 border-t-bgSecondary border-x-transparent border-b-transparent",
    bottom: "bottom-full left-1/2 -translate-x-1/2 -mb-1 border-b-bgSecondary border-x-transparent border-t-transparent",
    left: "left-full top-1/2 -translate-y-1/2 -ml-1 border-l-bgSecondary border-y-transparent border-r-transparent",
    right: "right-full top-1/2 -translate-y-1/2 -mr-1 border-r-bgSecondary border-y-transparent border-l-transparent",
  };

  return (
    <div
      className={cn("relative inline-flex items-center group", className)}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {children}

      {isVisible && (
        <div
          className={cn(
            "absolute z-50 pointer-events-auto transition-all duration-150 animate-in fade-in zoom-in-95",
            positionClasses[position],
            bridgeClasses[position],
            tooltipClassName
          )}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <div className="relative bg-bgSecondary border border-borderPrimary/80 rounded-xl shadow-2xl p-2.5 min-w-max max-w-xs text-xs text-textPrimary">
            {content}
            <div
              className={cn("absolute w-0 h-0 border-4", arrowClasses[position])}
            />
          </div>
        </div>
      )}
    </div>
  );
}
