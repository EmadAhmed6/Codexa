"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import {
  Eye,
  EyeOff,
  User,
  Mail,
  Lock,
  Briefcase,
  Search,
  FileText,
  Camera,
  Type,
  Image as ImageIcon,
  Edit3,
  LucideIcon,
} from "lucide-react";

const ICON_MAP: Record<string, LucideIcon> = {
  user: User,
  mail: Mail,
  lock: Lock,
  briefcase: Briefcase,
  search: Search,
  file: FileText,
  camera: Camera,
  type: Type,
  image: ImageIcon,
  edit: Edit3,
};

export type IconName = keyof typeof ICON_MAP;

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: IconName | React.ReactNode;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, icon, ...props }, ref) => {
    const [showPassword, setShowPassword] = React.useState(false);

    const isPassword = type === "password";
    const actualType = isPassword ? (showPassword ? "text" : "password") : type;

    const renderIcon = () => {
      if (!icon) return null;
      if (typeof icon === "string" && ICON_MAP[icon]) {
        const IconComponent = ICON_MAP[icon];
        return <IconComponent className="h-4.5 w-4.5" />;
      }
      return icon;
    };

    const hasIcon = Boolean(icon);
    const iconElement = renderIcon();

    return (
      <div className="relative w-full flex items-center">
        {hasIcon && (
          <span className="absolute ltr:left-3.5 rtl:right-3.5 z-10 flex items-center text-textSecondary/60 pointer-events-none">
            {iconElement}
          </span>
        )}

        <input
          type={actualType}
          suppressHydrationWarning
          className={cn(
            "flex h-11 w-full rounded-lg border border-borderPrimary bg-bgPrimary/50 px-4 py-3 text-sm text-textPrimary placeholder:text-textSecondary/60 shadow-sm transition-all focus-visible:outline-none focus-visible:border-primary focus-visible:ring-1 focus-visible:ring-ringPrimary/20 disabled:cursor-not-allowed disabled:opacity-50",
            hasIcon && "ltr:pl-11 rtl:pr-11",
            isPassword && "ltr:pr-11 rtl:pl-11",
            className,
          )}
          ref={ref}
          {...props}
        />

        {isPassword && (
          <button
            type="button"
            onMouseDown={(e) => e.preventDefault()}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setShowPassword((prev) => !prev);
            }}
            className={cn(
              "absolute ltr:right-3.5 rtl:left-3.5 z-10 p-1 transition-colors cursor-pointer",
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
        )}
      </div>
    );
  },
);
Input.displayName = "Input";

export { Input };
