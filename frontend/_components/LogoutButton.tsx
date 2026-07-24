"use client";

import React from "react";
import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLogout } from "@/_features/auth/hooks";

interface LogoutButtonProps {
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  size?: "default" | "sm" | "lg" | "icon";
  className?: string;
  showIcon?: boolean;
  children?: React.ReactNode;
}

export const LogoutButton: React.FC<LogoutButtonProps> = ({
  variant = "destructive",
  size = "default",
  className = "",
  showIcon = true,
  children,
}) => {
  const logout = useLogout();

  return (
    <Button
      variant={variant}
      size={size}
      onClick={logout}
      className={`cursor-pointer transition-all ${className}`}
    >
      {showIcon && <LogOut className="h-4 w-4 mr-2" />}
      {children || "Logout"}
    </Button>
  );
};

export default LogoutButton;
