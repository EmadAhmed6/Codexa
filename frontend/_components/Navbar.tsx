"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import {
  Sun,
  Moon,
  User as UserIcon,
  Search,
  LogOut,
  ChevronDown,
  LayoutDashboard,
} from "lucide-react";
import Cookies from "js-cookie";
import { useGetAuthMeQuery, useLogout } from "@/_features/auth/hooks";
import { Button } from "@/components/ui/button";
import { Text } from "@/_components/Text";

const Navbar = () => {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const token = Cookies.get("token");
  const { data: user } = useGetAuthMeQuery();
  const logout = useLogout();
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      router.push("/");
    }
  };

  return (
    <header className="w-full border-b border-borderPrimary/40 bg-bgPrimary/85 backdrop-blur-xl sticky top-0 z-40 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2.5 shrink-0 group">
          <div className="h-9 w-9 rounded-xl bg-primary flex items-center justify-center shadow-md shadow-primary/25 group-hover:scale-105 transition-all">
            <span className="text-primary-foreground font-black text-lg select-none">
              C
            </span>
          </div>
          <Text
            as="span"
            size="xl"
            font="extraBold"
            color="primary"
            className="tracking-tight hidden sm:inline-block"
          >
            Codexa
          </Text>
        </Link>

        {/* Global Search Bar */}
        <form
          onSubmit={handleSearchSubmit}
          className="flex-1 max-w-md relative"
        >
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-textSecondary" />
          <input
            type="text"
            placeholder="Search posts, topics, or keywords..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm rounded-xl bg-bgSecondary/80 border border-borderPrimary/60 text-textPrimary placeholder:text-textSecondary/60 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
          />
        </form>

        {/* Right Action Items */}
        <div className="flex items-center gap-2.5 shrink-0">
          {/* Theme Switcher */}
          {mounted && (
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="p-2 rounded-xl bg-bgSecondary/60 hover:bg-bgSecondary border border-borderPrimary/40 text-textSecondary hover:text-textPrimary transition-all cursor-pointer"
              aria-label="Toggle Theme"
            >
              {theme === "dark" ? (
                <Sun className="h-4 w-4 text-amber-400" />
              ) : (
                <Moon className="h-4 w-4 text-slate-600" />
              )}
            </button>
          )}

          {/* Admin Dashboard Quick Button */}
          {token && user?.isAdmin && (
            <Link href="/admin/dashboard/users">
              <Button
                variant="outline"
                size="sm"
                className="rounded-xl border-amber-500/30 bg-amber-500/10 hover:bg-amber-500/20 text-amber-500 text-xs flex items-center gap-1.5 cursor-pointer font-bold hidden sm:flex"
              >
                <LayoutDashboard className="h-3.5 w-3.5" />
                <Text as="span" size="xs" font="bold" className="text-amber-500">
                  Dashboard
                </Text>
              </Button>
            </Link>
          )}

          {/* User Dropdown / Auth Links */}
          {token ? (
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2 p-1.5 rounded-xl bg-bgSecondary/60 hover:bg-bgSecondary border border-borderPrimary/40 transition-all cursor-pointer"
              >
                {user?.profilePicture?.url ? (
                  <img
                    src={user.profilePicture.url}
                    alt={user.username}
                    className="h-7 w-7 rounded-lg object-cover"
                  />
                ) : (
                  <div className="h-7 w-7 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                    <UserIcon className="h-4 w-4" />
                  </div>
                )}
                <Text
                  as="span"
                  size="xs"
                  font="bold"
                  color="primary"
                  className="hidden md:inline-block max-w-25 truncate"
                >
                  {user?.username || "Account"}
                </Text>
                <ChevronDown className="h-3.5 w-3.5 text-textSecondary hidden md:inline-block" />
              </button>

              {dropdownOpen && (
                <div
                  onMouseLeave={() => setDropdownOpen(false)}
                  className="absolute right-0 mt-2 w-48 rounded-2xl bg-bgSecondary border border-borderPrimary shadow-xl py-1.5 z-50 animate-in fade-in slide-in-from-top-2 duration-150"
                >
                  <div className="px-4 py-2 border-b border-borderPrimary/40">
                    <Text
                      as="p"
                      size="xs"
                      font="bold"
                      color="primary"
                      className="truncate"
                    >
                      {user?.username || "User"}
                    </Text>
                    <Text
                      as="p"
                      size="xs"
                      color="secondary"
                      className="text-[11px] truncate"
                    >
                      {user?.email || ""}
                    </Text>
                  </div>

                  <Link
                    href={`/profile/${user?._id || "me"}`}
                    onClick={() => setDropdownOpen(false)}
                    className="flex items-center gap-2 px-4 py-2 text-xs font-medium text-textPrimary hover:bg-bgPrimary transition-colors"
                  >
                    <UserIcon className="h-4 w-4 text-primary" />
                    <Text as="span" size="xs" font="medium" color="primary">
                      My Profile
                    </Text>
                  </Link>

                  {user?.isAdmin && (
                    <Link
                      href="/admin/dashboard/users"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-xs font-medium text-amber-500 hover:bg-amber-500/10 transition-colors"
                    >
                      <LayoutDashboard className="h-4 w-4 text-amber-500" />
                      <Text as="span" size="xs" font="medium" className="text-amber-500">
                        Admin Dashboard
                      </Text>
                    </Link>
                  )}

                  <button
                    onClick={() => {
                      setDropdownOpen(false);
                      logout();
                    }}
                    className="w-full flex items-center gap-2 px-4 py-2 text-xs font-medium text-rose-500 hover:bg-rose-500/10 transition-colors text-left cursor-pointer"
                  >
                    <LogOut className="h-4 w-4" />
                    <Text as="span" size="xs" font="medium" className="text-rose-500">
                      Log Out
                    </Text>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link href="/auth/login">
                <Button
                  variant="ghost"
                  size="sm"
                  className="rounded-xl text-xs cursor-pointer"
                >
                  <Text as="span" size="xs" font="semiBold" color="primary">
                    Sign In
                  </Text>
                </Button>
              </Link>
              <Link href="/auth/register">
                <Button
                  size="sm"
                  className="rounded-xl bg-primary hover:bg-primaryHover text-primary-foreground text-xs cursor-pointer"
                >
                  <Text as="span" size="xs" font="semiBold" color="white">
                    Sign Up
                  </Text>
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
