"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Zap, Code, Users } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export default function SplashScreen() {
  const [visible, setVisible] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { isArabic } = useLanguage();

  useEffect(() => {
    setMounted(true);
    // Check if splash screen was already shown in this session
    const hasSeenSplash = sessionStorage.getItem("fluxion_splash_shown");
    if (!hasSeenSplash) {
      setVisible(true);

      // Auto-hide after 3.2 seconds
      const timer = setTimeout(() => {
        handleDismiss();
      }, 3200);

      return () => clearTimeout(timer);
    }
  }, []);

  const handleDismiss = () => {
    sessionStorage.setItem("fluxion_splash_shown", "true");
    setVisible(false);
  };

  if (!mounted || !visible) return null;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.05, filter: "blur(8px)" }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="fixed inset-0 z-99999 flex flex-col items-center justify-between bg-slate-950 text-white select-none overflow-hidden"
        >
          {/* Ambient Lighting Orbs */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <motion.div
              animate={{
                scale: [1, 1.25, 1],
                opacity: [0.25, 0.45, 0.25],
              }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -top-32 -left-32 w-120 h-120 rounded-full bg-primary/30 blur-[140px]"
            />
            <motion.div
              animate={{
                scale: [1.25, 1, 1.25],
                opacity: [0.2, 0.4, 0.2],
              }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -bottom-32 -right-32 w-120 h-120 rounded-full bg-indigo-600/30 blur-[140px]"
            />
          </div>

          {/* Top Bar: Skip Button */}
          <div className="w-full max-w-5xl px-6 pt-6 flex justify-end relative z-10">
            <motion.button
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              onClick={handleDismiss}
              className="px-3.5 py-1.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/15 text-xs font-semibold backdrop-blur-md transition-all cursor-pointer flex items-center gap-1.5 text-slate-300 hover:text-white"
            >
              <span>{isArabic ? "تخطي" : "Skip"}</span>
            </motion.button>
          </div>

          {/* Center Brand Animation */}
          <div className="flex flex-col items-center text-center px-4 relative z-10 my-auto">
            {/* Logo Container with glowing ring */}
            <motion.div
              initial={{ scale: 0.3, opacity: 0, rotate: -15 }}
              animate={{ scale: 1, opacity: 1, rotate: 0 }}
              transition={{ duration: 0.8, ease: [0.34, 1.56, 0.64, 1] }}
              className="relative mb-6"
            >
              <div className="absolute -inset-4 rounded-3xl bg-linear-to-r from-primary via-indigo-500 to-purple-600 opacity-60 blur-xl animate-pulse" />
              <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-slate-900/90 border border-white/20 p-4 flex items-center justify-center shadow-2xl backdrop-blur-xl">
                <Image
                  src="/logo.png"
                  alt="Fluxion"
                  width={96}
                  height={96}
                  className="w-full h-full object-contain"
                  priority
                />
              </div>
            </motion.div>

            {/* Brand Title */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.7 }}
              className="text-4xl sm:text-6xl font-extrabold tracking-tight bg-linear-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent mb-3"
            >
              Fluxion
            </motion.h1>

            {/* Slogan */}
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.7 }}
              className="text-sm sm:text-base text-slate-300 max-w-md font-medium leading-relaxed mb-8"
            >
              {isArabic
                ? "حيث تلتقي الأفكار والمطورين — منصتك الأولى لمشاركة المقالات والتجارب التقنية"
                : "Where ideas flow & developers connect — Your home for tech articles and insights"}
            </motion.p>

            {/* Feature Badges */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.7 }}
              className="flex flex-wrap items-center justify-center gap-2 sm:gap-3"
            >
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-xs text-slate-300 backdrop-blur-md">
                <Code className="h-3.5 w-3.5 text-primary" />
                <span>{isArabic ? "مقالات برمجية" : "Tech Blogs"}</span>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-xs text-slate-300 backdrop-blur-md">
                <Users className="h-3.5 w-3.5 text-indigo-400" />
                <span>{isArabic ? "مجتمع المطورين" : "Dev Community"}</span>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-xs text-slate-300 backdrop-blur-md">
                <Zap className="h-3.5 w-3.5 text-amber-400" />
                <span>{isArabic ? "تفاعل لحظي" : "Instant Engagement"}</span>
              </div>
            </motion.div>
          </div>

          {/* Bottom Loading Progress Bar */}
          <div className="w-full max-w-md px-6 pb-8 relative z-10 flex flex-col items-center gap-3">
            <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
              <motion.div
                initial={{ x: "-100%" }}
                animate={{ x: "0%" }}
                transition={{ duration: 3, ease: "easeInOut" }}
                className="w-full h-full bg-linear-to-r from-primary via-indigo-400 to-purple-500"
              />
            </div>
            <span className="text-[11px] text-slate-400 font-mono tracking-wider">
              FLUXION © 2026
            </span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
