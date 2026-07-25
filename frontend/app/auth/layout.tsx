"use client";

import React, { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="min-h-screen bg-bgPrimary flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-center overflow-x-hidden p-4 md:p-6">
      {/* Animated Background Mesh & Grids */}
      <div className="absolute inset-0 -z-50 overflow-hidden bg-bgPrimary">
        {/* Subtle Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(128,128,128,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(128,128,128,0.04)_1px,transparent_1px)] bg-size:24px_24px mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)" />

        {/* Glowing Orbs */}
        <div className="absolute -top-10% left-[5%] md:left-[20%] w-87.5 md:w-150 h-87.5 md:h-150 rounded-full bg-primary/10 dark:bg-primary/20 blur-[80px] md:blur-[120px] animate-pulse-slow" />
        <div
          className="absolute -bottom-10% right-[5%] md:right-[20%] w-300px md:w-125 h-75 md:h-125 rounded-full bg-primary/5 dark:bg-primary/10 blur-[60px] md:blur-[100px] animate-pulse-slow"
          style={{ animationDelay: "2s" }}
        />
      </div>

      {/* Authentication Card Section */}
      <main className="w-full flex items-center justify-center z-10 py-6">
        {children}
      </main>

      {/* Footer */}
      <footer className="w-full max-w-7xl mx-auto px-6 py-4 text-center text-xs text-textSecondary/60 select-none z-10">
        <p>© {new Date().getFullYear()} Codexa. All rights reserved.</p>
      </footer>
    </div>
  );
}
