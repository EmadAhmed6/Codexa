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
  Globe,
  Menu,
  X,
} from "lucide-react";
import Cookies from "js-cookie";
import { useGetAuthMeQuery, useLogout } from "@/_features/auth/hooks";
import { Button } from "@/components/ui/button";
import { Text } from "@/_components/Text";
import Tooltip from "@/_components/Tooltip";
import Image from "next/image";
import { useLanguage } from "@/context/LanguageContext";

const Navbar = () => {
  const { theme, setTheme } = useTheme();
  const { language, toggleLanguage, t, isArabic } = useLanguage();
  const [mounted, setMounted] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
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
      setMobileMenuOpen(false);
    } else {
      router.push("/");
    }
  };

  return (
    <header className="w-full border-b border-borderPrimary/40 bg-bgPrimary/85 backdrop-blur-xl sticky top-0 z-40 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between gap-3">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2 shrink-0 group">
          <Image src="/logo.png" alt="Logo" width={34} height={34} />
          <Text
            as="span"
            size="xl"
            font="extraBold"
            color="primary"
            className="inline-block"
          >
            Fluxion
          </Text>
        </Link>

        {/* Global Search Bar (Desktop View) */}
        <form
          onSubmit={handleSearchSubmit}
          className="hidden md:flex flex-1 max-w-md relative"
          suppressHydrationWarning
        >
          <Search className="absolute ltr:left-3.5 rtl:right-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-textSecondary" />
          <input
            type="text"
            placeholder={t.nav.searchPlaceholder}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full ltr:pl-10 ltr:pr-4 rtl:pr-10 rtl:pl-4 py-2 text-xs sm:text-sm rounded-xl bg-bgSecondary/80 border border-borderPrimary/60 text-textPrimary placeholder:text-textSecondary/60 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
            suppressHydrationWarning
          />
        </form>

        {/* Right Action Items (Desktop View) */}
        <div className="hidden md:flex items-center gap-2.5 shrink-0">
          {/* Language Switcher */}
          {mounted && (
            <Tooltip
              position="bottom"
              content={isArabic ? "تغيير للإنجليزية (English)" : "تغيير للغة العربية (عامية مصرية)"}
            >
              <button
                onClick={toggleLanguage}
                className="flex items-center gap-1.5 px-2.5 py-2 rounded-xl bg-bgSecondary/60 hover:bg-bgSecondary border border-borderPrimary/40 text-textSecondary hover:text-textPrimary transition-all cursor-pointer text-xs font-bold"
                aria-label="Toggle Language"
              >
                <Globe className="h-4 w-4 text-primary" />
                <span className="font-extrabold text-[11px] text-primary">
                  {language === "en" ? "عربي" : "EN"}
                </span>
              </button>
            </Tooltip>
          )}

          {/* Theme Switcher */}
          {mounted && (
            <Tooltip
              position="bottom"
              content={
                theme === "dark"
                  ? t.nav.themeLight
                  : t.nav.themeDark
              }
            >
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
            </Tooltip>
          )}

          {/* Admin Dashboard Quick Button */}
          {mounted && token && user?.isAdmin && (
            <Tooltip position="bottom" content={t.nav.adminDashboard}>
              <Link href="/admin/dashboard/users">
                <Button
                  variant="outline"
                  size="sm"
                  className="group rounded-xl border-amber-500/30 bg-amber-500/10 hover:bg-amber-500/20 text-amber-500 hover:text-amber-400 text-xs items-center gap-1.5 cursor-pointer font-bold transition-all"
                >
                  <LayoutDashboard className="h-3.5 w-3.5 group-hover:scale-110 transition-transform" />
                  <Text
                    as="span"
                    size="xs"
                    font="bold"
                    className="text-amber-500 group-hover:text-amber-400 transition-colors"
                  >
                    {t.nav.dashboard}
                  </Text>
                </Button>
              </Link>
            </Tooltip>
          )}

          {/* User Dropdown / Auth Links */}
          {mounted &&
            (token ? (
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2 p-1.5 rounded-xl bg-bgSecondary/60 hover:bg-bgSecondary border border-borderPrimary/40 transition-all cursor-pointer"
                  suppressHydrationWarning
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
                    className="max-w-25 truncate"
                  >
                    {user?.username || t.nav.account}
                  </Text>
                  <ChevronDown className="h-3.5 w-3.5 text-textSecondary" />
                </button>

                {dropdownOpen && (
                  <div
                    onMouseLeave={() => setDropdownOpen(false)}
                    className="absolute ltr:right-0 rtl:left-0 mt-2 w-48 rounded-2xl bg-bgSecondary border border-borderPrimary shadow-xl py-1.5 z-50 animate-in fade-in slide-in-from-top-2 duration-150"
                  >
                    <div className="px-4 py-2 border-b border-borderPrimary/40">
                      <Text
                        as="p"
                        size="xs"
                        font="bold"
                        color="primary"
                        className="truncate"
                      >
                        {user?.username || t.nav.user}
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
                      className="flex items-center gap-2 px-4 py-2 text-xs font-medium text-textSecondary hover:text-textPrimary hover:bg-bgPrimary transition-colors"
                    >
                      <UserIcon className="h-4 w-4 text-primary" />
                      <Text as="span" size="xs" font="medium" color="primary">
                        {t.nav.myProfile}
                      </Text>
                    </Link>

                    {user?.isAdmin && (
                      <Link
                        href="/admin/dashboard/users"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 text-xs font-medium text-amber-500 hover:bg-amber-500/10 transition-colors"
                      >
                        <LayoutDashboard className="h-4 w-4 text-amber-500" />
                        <Text
                          as="span"
                          size="xs"
                          font="medium"
                          className="text-amber-500"
                        >
                          {t.nav.adminDashboard}
                        </Text>
                      </Link>
                    )}

                    <button
                      onClick={() => {
                        setDropdownOpen(false);
                        logout();
                      }}
                      className="w-full flex items-center gap-2 px-4 py-2 text-xs font-medium text-rose-500 hover:bg-rose-500/10 transition-colors ltr:text-left rtl:text-right cursor-pointer"
                    >
                      <LogOut className="h-4 w-4" />
                      <Text
                        as="span"
                        size="xs"
                        font="medium"
                        className="text-rose-500"
                      >
                        {t.nav.logOut}
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
                      {t.nav.signIn}
                    </Text>
                  </Button>
                </Link>
                <Link href="/auth/register">
                  <Button
                    size="sm"
                    className="rounded-xl bg-primary hover:bg-primaryHover text-primary-foreground text-xs cursor-pointer"
                  >
                    <Text as="span" size="xs" font="semiBold" color="white">
                      {t.nav.signUp}
                    </Text>
                  </Button>
                </Link>
              </div>
            ))}
        </div>

        {/* Mobile Hamburger Toggle Button */}
        <div className="flex items-center gap-2 md:hidden">
          {mounted && (
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl bg-bgSecondary/60 border border-borderPrimary/40 text-textPrimary cursor-pointer transition-colors"
              aria-label="Toggle Mobile Menu"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          )}
        </div>
      </div>

      {/* Mobile Drawer / Collapsible Menu */}
      {mounted && mobileMenuOpen && (
        <div className="md:hidden border-t border-borderPrimary/40 bg-bgPrimary/95 backdrop-blur-xl px-4 py-4 space-y-4 animate-in slide-in-from-top duration-200">
          {/* Mobile Search Input */}
          <form onSubmit={handleSearchSubmit} className="relative w-full">
            <Search className="absolute ltr:left-3.5 rtl:right-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-textSecondary" />
            <input
              type="text"
              placeholder={t.nav.searchPlaceholder}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full ltr:pl-10 ltr:pr-4 rtl:pr-10 rtl:pl-4 py-2 text-xs rounded-xl bg-bgSecondary border border-borderPrimary/60 text-textPrimary placeholder:text-textSecondary/60 outline-none"
            />
          </form>

          {/* Quick Actions Row: Language & Theme */}
          <div className="flex items-center justify-between pt-1">
            <button
              onClick={toggleLanguage}
              className="flex items-center gap-2 px-3 py-2 rounded-xl bg-bgSecondary border border-borderPrimary/40 text-xs font-bold text-primary cursor-pointer"
            >
              <Globe className="h-4 w-4 text-primary" />
              <span>{language === "en" ? "العربية (مصري)" : "English"}</span>
            </button>

            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="flex items-center gap-2 px-3 py-2 rounded-xl bg-bgSecondary border border-borderPrimary/40 text-xs font-medium text-textPrimary cursor-pointer"
            >
              {theme === "dark" ? (
                <>
                  <Sun className="h-4 w-4 text-amber-400" />
                  <span>{t.nav.themeLight}</span>
                </>
              ) : (
                <>
                  <Moon className="h-4 w-4 text-slate-600" />
                  <span>{t.nav.themeDark}</span>
                </>
              )}
            </button>
          </div>

          {/* Admin Dashboard button on Mobile */}
          {token && user?.isAdmin && (
            <Link
              href="/admin/dashboard/users"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2.5 p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-500 font-bold text-xs"
            >
              <LayoutDashboard className="h-4 w-4" />
              <span>{t.nav.adminDashboard}</span>
            </Link>
          )}

          {/* User Links on Mobile */}
          {token ? (
            <div className="pt-2 border-t border-borderPrimary/40 space-y-2">
              <Link
                href={`/profile/${user?._id || "me"}`}
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 p-2.5 rounded-xl bg-bgSecondary/60 hover:bg-bgSecondary text-xs font-semibold text-textPrimary transition-colors"
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
                <div>
                  <p className="font-bold text-textPrimary">{user?.username}</p>
                  <p className="text-[11px] text-textSecondary">{user?.email}</p>
                </div>
              </Link>

              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  logout();
                }}
                className="w-full flex items-center gap-2 p-2.5 rounded-xl bg-rose-500/10 text-rose-500 text-xs font-semibold hover:bg-rose-500/20 transition-colors cursor-pointer"
              >
                <LogOut className="h-4 w-4" />
                <span>{t.nav.logOut}</span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-borderPrimary/40">
              <Link href="/auth/login" onClick={() => setMobileMenuOpen(false)}>
                <Button variant="outline" className="w-full text-xs rounded-xl cursor-pointer">
                  {t.nav.signIn}
                </Button>
              </Link>
              <Link href="/auth/register" onClick={() => setMobileMenuOpen(false)}>
                <Button className="w-full text-xs rounded-xl bg-primary text-white cursor-pointer">
                  {t.nav.signUp}
                </Button>
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
};

export default Navbar;
