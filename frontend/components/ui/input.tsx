"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Eye, EyeOff } from "lucide-react";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    const [showPassword, setShowPassword] = React.useState(false);

    const isPassword = type === "password";
    const actualType = isPassword ? (showPassword ? "text" : "password") : type;

    if (isPassword) {
      return (
        <div className="relative w-full flex items-center">
          <input
            type={actualType}
            suppressHydrationWarning
            className={cn(
              "flex h-11 w-full rounded-lg border border-borderPrimary bg-bgPrimary/50 px-4 py-3 text-sm text-textPrimary placeholder:text-textSecondary/60 shadow-sm transition-all focus-visible:outline-none focus-visible:border-primary focus-visible:ring-1 focus-visible:ring-ringPrimary/20 disabled:cursor-not-allowed disabled:opacity-50 pr-11",
              className,
            )}
            ref={ref}
            {...props}
          />
          <button
            type="button"
            onMouseDown={(e) => e.preventDefault()}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setShowPassword((prev) => !prev);
            }}
            className={cn(
              "absolute right-3.5 z-10 p-1 transition-colors cursor-pointer",
              showPassword
                ? "text-primary hover:text-primaryHover"
                : "text-textSecondary hover:text-textPrimary",
            )}
            aria-label={showPassword ? "Hide password" : "Show password"}
            tabIndex={-1}
          >
            {showPassword ? (
              <EyeOff className="h-4.5 w-4.5" />
            ) : (
              <Eye className="h-4.5 w-4.5" />
            )}
          </button>
        </div>
      );
    }

    return (
      <input
        type={actualType}
        suppressHydrationWarning
        className={cn(
          "flex h-11 w-full rounded-lg border border-borderPrimary bg-bgPrimary/50 px-4 py-3 text-sm text-textPrimary placeholder:text-textSecondary/60 shadow-sm transition-all focus-visible:outline-none focus-visible:border-primary focus-visible:ring-1 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-50",
          className,
        )}
        ref={ref}
        {...props}
      />
    );
  },
);
Input.displayName = "Input";

export { Input };
