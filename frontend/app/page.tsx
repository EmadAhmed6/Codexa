"use client";

import React, { useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Navbar from "@/_components/Navbar";
import PostCard from "@/_components/PostCard";
import CreatePostModal from "@/_components/CreatePostModal";
import { useGetPosts } from "@/_features/posts/post-hooks";
import {
  Sparkles,
  ChevronLeft,
  ChevronRight,
  FileText,
  PlusCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Cookies from "js-cookie";

const CATEGORIES = [
  "All",
  "Development",
  "React & Next.js",
  "Backend & API",
  "Design & UX",
  "AI & ML",
  "DevOps & Cloud",
];

function HomeContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = Cookies.get("token");

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
        {/* Banner / Hero Section with Create Post Button */}
        <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-xs font-bold text-primary mb-4">
              <Sparkles className="h-3.5 w-3.5" />
              <span>DevQuill Technical Community Feed</span>
            </div>
            <h1 className="text-3xl md:text-5xl font-black tracking-tight text-textPrimary leading-tight mb-4">
              Architecting the Future of <br className="hidden md:block" />
              <span className="bg-linear-to-r from-primary via-indigo-500 to-primaryHover bg-clip-text text-transparent">
                Software & Web Engineering
              </span>
            </h1>
            <p className="text-sm md:text-base text-textSecondary leading-relaxed">
              Discover peer-reviewed tutorials, architecture breakdowns, and
              developer insights directly from experts.
            </p>
          </div>
        </div>

        {/* Category Pill Filters */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 no-scrollbar scroll-smooth">
          {CATEGORIES.map((cat) => {
            const isActive = selectedCategory === cat;
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
                {cat}
              </button>
            );
          })}
        </div>

        {/* Search indicator message */}
        {search && (
          <div className="mb-6 flex items-center justify-between p-3.5 rounded-xl bg-bgSecondary/60 border border-borderPrimary/40">
            <span className="text-xs text-textSecondary">
              Showing search results for:{" "}
              <strong className="text-textPrimary">"{search}"</strong>
            </span>
            <button
              onClick={() => router.push("/")}
              className="text-xs font-bold text-primary hover:underline cursor-pointer"
            >
              Clear Search
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
            <h3 className="text-xl font-bold text-textPrimary mb-2">
              No Articles Found
            </h3>
            <p className="text-xs md:text-sm text-textSecondary max-w-md mb-6">
              We couldn't find any published articles matching your current
              filter criteria.
            </p>
            <Button
              onClick={() => router.push("/")}
              className="rounded-xl bg-primary hover:bg-primaryHover text-primary-foreground text-xs font-semibold cursor-pointer"
            >
              Reset Filters
            </Button>
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
            <ChevronLeft className="h-3.5 w-3.5 mr-1" />
            Prev
          </Button>

          <span className="text-xs font-bold text-textPrimary px-2">
            {pageNumber}
          </span>

          <Button
            variant="outline"
            size="sm"
            disabled={!posts || posts.length < 5}
            onClick={() => handlePageChange(pageNumber + 1)}
            className="w-fit rounded-xl border-borderPrimary/60 px-3 py-1.5 h-8 text-xs font-semibold shrink-0 cursor-pointer"
          >
            Next
            <ChevronRight className="h-3.5 w-3.5 ml-1" />
          </Button>
        </div>
      </main>

      {/* Floating Action Button (FAB) for Create Post */}
      {token && (
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="fixed bottom-6 right-6 z-40 p-4 rounded-full bg-primary hover:bg-primaryHover text-primary-foreground shadow-2xl shadow-primary/40 flex items-center gap-2 font-bold text-xs transition-all transform hover:scale-105 active:scale-95 cursor-pointer"
          title="Create New Post"
        >
          <PlusCircle className="h-5 w-5" />
          <span className="hidden sm:inline">Create Post</span>
        </button>
      )}

      {/* Create Post Modal */}
      <CreatePostModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />

      {/* Footer */}
      <footer className="w-full max-w-7xl mx-auto px-6 py-8 border-t border-borderPrimary/20 text-center md:text-left flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-textSecondary">
        <p>
          © {new Date().getFullYear()} DevQuill Engineering Blog. Built with
          Next.js 16 & Tailwind CSS.
        </p>
        <div className="flex gap-4">
          <span>Terms</span>
          <span>Privacy</span>
          <span>API Documentation</span>
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
