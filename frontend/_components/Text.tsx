"use client";

import { cva } from "class-variance-authority";
import type { VariantProps } from "class-variance-authority";
import { forwardRef, ElementType } from "react";
import { cn } from "@/lib/utils";

const textVariants = cva("transition-colors", {
  variants: {
    font: {
      default: "font-normal",
      black: "font-black",
      extraBold: "font-extrabold",
      bold: "font-bold",
      semiBold: "font-semibold",
      normal: "font-normal",
      medium: "font-medium",
      light: "font-light",
      thin: "font-thin",
    },

    size: {
      default: "text-base",
      xs: "text-xs",
      sm: "text-sm",
      lg: "text-lg",
      xl: "text-xl",
      "2xl": "text-2xl",
      "3xl": "text-3xl",
      "32": "text-[32px]",
      "4xl": "text-4xl",
      "5xl": "text-5xl",
    },

    color: {
      default: "text-primary-900",
      muted: "text-muted-foreground",
      white: "text-white",
      black: "text-black",
      warning: "text-warning-500",
      primary: "text-textPrimary",
      secondary: "text-textSecondary",
      error: "text-textError",
    },
  },

  defaultVariants: {
    font: "default",
    size: "default",
    color: "default",
  },
});

interface TextProps
  extends
    Omit<React.HTMLAttributes<HTMLElement>, "color">,
    VariantProps<typeof textVariants> {
  as?: ElementType;
}

const Text = forwardRef<HTMLElement, TextProps>(
  ({ className, font, color, size, as: Component = "p", ...props }, ref) => {
    return (
      <Component
        ref={ref as React.Ref<HTMLElement>}
        className={cn(textVariants({ font, color, size }), className)}
        {...props}
      />
    );
  },
);

Text.displayName = "Text";

export { Text, textVariants };
export type { TextProps };
