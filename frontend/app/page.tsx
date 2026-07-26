"use client";

import React, { useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Navbar from "@/_components/Navbar";
import PostCard from "@/_components/PostCard";
import CreatePostModal from "@/_components/CreatePostModal";
import { useGetPosts } from "@/_features/posts/hooks";
import {
  Zap,
  ChevronLeft,
  ChevronRight,
  FileText,
  PlusCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Cookies from "js-cookie";
import { Text } from "@/_components/Text";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";

const CATEGORIES = [
  "All",
  "Development",
  "React & Next.js",
  "Backend & API",
  "Design & UX",
  "AI & ML",
  "DevOps & Cloud",
] as const;

function HomeContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = Cookies.get("token");
  const { t, isArabic } = useLanguage();

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const pageNumber = parseInt(
    searchParams.get("pageNumber") || searchParams.get("page") || "1",
    10,
  );
  const search = searchParams.get("search") || "";
  const selectedCategory = searchParams.get("category") || "All";

  const { data: posts, isLoading } = useGetPosts({
    pageNumber,
    search: search || undefined,
    category: selectedCategory !== "All" ? selectedCategory : undefined,
  });

  const handleCategorySelect = (category: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (category === "All") {
      params.delete("category");
    } else {
      params.set("category", category);
    }
    params.set("pageNumber", "1");
    params.delete("page");
    router.push(`/?${params.toString()}`);
  };

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("pageNumber", newPage.toString());
    params.delete("page");
    router.push(`/?${params.toString()}`);
  };

  const PrevIcon = isArabic ? ChevronRight : ChevronLeft;
  const NextIcon = isArabic ? ChevronLeft : ChevronRight;

  return (
    <div className="min-h-screen bg-bgPrimary text-textPrimary flex flex-col justify-between relative">
      {/* Background Ambient Gradient */}
      <div className="fixed inset-0 -z-50 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(128,128,128,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(128,128,128,0.02)_1px,transparent_1px)] bg-size:32px_32px" />
        <div className="absolute top-[15%] left-[5%] w-96 h-96 rounded-full bg-primary/10 blur-[120px]" />
        <div className="absolute bottom-[20%] right-[5%] w-96 h-96 rounded-full bg-primary/5 blur-[120px]" />
      </div>

      <Navbar />

      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 py-8 md:py-12">
        {/* Banner / Hero Section */}
        <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-xs font-bold text-primary mb-4">
              <Zap className="h-3.5 w-3.5 text-primary fill-primary/20" />
              <Text as="span" size="xs" font="bold" color="primary">
                {t.home.feedBadge}
              </Text>
            </div>
            <Text
              as="h1"
              size="4xl"
              font="black"
              color="primary"
              className="tracking-tight leading-tight mb-4 md:text-5xl"
            >
              {t.home.heroTitlePrefix} <br className="hidden md:block" />
              <span className="bg-linear-to-r from-primary via-indigo-500 to-primaryHover bg-clip-text text-transparent">
                {t.home.heroTitleHighlight}
              </span>
            </Text>
            <Text
              as="p"
              size="default"
              color="secondary"
              className="leading-relaxed text-sm md:text-base"
            >
              {t.home.heroSubtitle}
            </Text>
          </div>
        </div>

        {/* Category Pill Filters */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 no-scrollbar scroll-smooth">
          {CATEGORIES.map((cat) => {
            const isActive = selectedCategory === cat;
            const translatedCat =
              t.categories[cat as keyof typeof t.categories] || cat;
            return (
              <button
                key={cat}
                onClick={() => handleCategorySelect(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-bold shrink-0 transition-all cursor-pointer border ${
                  isActive
                    ? "bg-primary text-primary-foreground border-primary shadow-md shadow-primary/20"
                    : "bg-bgSecondary/60 text-textSecondary border-borderPrimary/40 hover:bg-bgSecondary hover:text-textPrimary"
                }`}
              >
                <Text
                  as="span"
                  size="xs"
                  font="bold"
                  color={isActive ? "white" : "secondary"}
                >
                  {translatedCat}
                </Text>
              </button>
            );
          })}
        </div>

        {/* Search indicator message */}
        {search && (
          <div className="mb-6 flex items-center justify-between p-3.5 rounded-xl bg-bgSecondary/60 border border-borderPrimary/40">
            <Text as="span" size="xs" color="secondary">
              {t.home.showingResults}{" "}
              <strong className="text-textPrimary">"{search}"</strong>
            </Text>
            <button
              onClick={() => router.push("/")}
              className="text-xs font-bold text-primary hover:underline cursor-pointer"
            >
              <Text as="span" size="xs" font="bold" color="primary">
                {t.home.clearSearch}
              </Text>
            </button>
          </div>
        )}

        {/* Posts Grid Feed */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((idx) => (
              <div
                key={idx}
                className="h-80 rounded-2xl bg-bgSecondary/40 border border-borderPrimary/30 animate-pulse p-6 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="h-4 w-24 bg-borderPrimary/40 rounded-md" />
                  <div className="h-6 w-3/4 bg-borderPrimary/40 rounded-md" />
                  <div className="h-16 w-full bg-borderPrimary/30 rounded-md" />
                </div>
                <div className="h-8 w-full bg-borderPrimary/40 rounded-md" />
              </div>
            ))}
          </div>
        ) : posts && posts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
              <PostCard key={post._id} post={post} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 px-4 text-center rounded-3xl bg-bgSecondary/30 border border-borderPrimary/40">
            <div className="h-16 w-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-4">
              <FileText className="h-8 w-8" />
            </div>
            <Text
              as="h3"
              size="xl"
              font="bold"
              color="primary"
              className="mb-2"
            >
              {t.home.noArticlesTitle}
            </Text>
            <Text
              as="p"
              size="xs"
              color="secondary"
              className="max-w-md mb-6 md:text-sm"
            >
              {t.home.noArticlesDesc}
            </Text>
          </div>
        )}

        {/* Compact Centered Pagination Controls */}
        <div className="mt-12 flex items-center justify-center gap-3">
          <Button
            variant="outline"
            size="sm"
            disabled={pageNumber <= 1}
            onClick={() => handlePageChange(pageNumber - 1)}
            className="w-fit rounded-xl border-borderPrimary/60 px-3 py-1.5 h-8 text-xs font-semibold shrink-0 cursor-pointer"
          >
            <PrevIcon className="h-3.5 w-3.5 ltr:mr-1 rtl:ml-1" />
            <Text as="span" size="xs" font="semiBold" color="primary">
              {t.home.prev}
            </Text>
          </Button>

          <Text
            as="span"
            size="xs"
            font="bold"
            color="primary"
            className="px-2"
          >
            {pageNumber}
          </Text>

          <Button
            variant="outline"
            size="sm"
            disabled={!posts || posts.length < 5}
            onClick={() => handlePageChange(pageNumber + 1)}
            className="w-fit rounded-xl border-borderPrimary/60 px-3 py-1.5 h-8 text-xs font-semibold shrink-0 cursor-pointer"
          >
            <Text as="span" size="xs" font="semiBold" color="primary">
              {t.home.next}
            </Text>
            <NextIcon className="h-3.5 w-3.5 ltr:ml-1 rtl:mr-1" />
          </Button>
        </div>
      </main>

      {/* Floating Action Button (FAB) for Create Post */}
      {token && (
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="fixed bottom-6 ltr:right-6 rtl:left-6 z-40 p-4 rounded-full bg-primary hover:bg-primaryHover text-primary-foreground shadow-2xl shadow-primary/40 flex items-center gap-2 font-bold text-xs transition-all transform hover:scale-105 active:scale-95 cursor-pointer"
          title={t.home.createPost}
        >
          <PlusCircle className="h-5 w-5" />
          <Text
            as="span"
            size="xs"
            font="bold"
            color="white"
            className="hidden sm:inline"
          >
            {t.home.createPost}
          </Text>
        </button>
      )}

      {/* Create Post Modal */}
      <CreatePostModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />

      {/* Footer */}
      <footer className="w-full max-w-7xl mx-auto px-6 py-8 border-t border-borderPrimary/20 text-center md:text-left flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-textSecondary">
        <Text as="p" size="xs" color="secondary">
          © {new Date().getFullYear()} {t.home.footerRights}{" "}
          <Link
            className="transition-all duration-300"
            href={"https://emad-site.vercel.app/"}
            target="_blank"
          >
            <Text as="span" size="xs" font="bold" color="primary" className="hover:text-primary hover:underline">
              Emad Ahmed
            </Text>
          </Link>
        </Text>
        <div className="flex gap-4">
          <Text as="span" size="xs" color="secondary">
            {t.home.terms}
          </Text>
          <Text as="span" size="xs" color="secondary">
            {t.home.privacy}
          </Text>
          <Text as="span" size="xs" color="secondary">
            {t.home.apiDoc}
          </Text>
        </div>
      </footer>
    </div>
  );
}

export default function HomePage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-bgPrimary" />}>
      <HomeContent />
    </Suspense>
  );
}
