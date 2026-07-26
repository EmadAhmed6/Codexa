import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatRelativeTime(
  dateInput?: string | Date | null,
  forcedLang?: string,
): string {
  const isAr =
    forcedLang === "ar" ||
    (typeof document !== "undefined" && document.documentElement.lang === "ar");

  if (!dateInput) return isAr ? "مؤخراً" : "Recently";
  const date = new Date(dateInput);
  if (isNaN(date.getTime())) return isAr ? "مؤخراً" : "Recently";

  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 0 || diffInSeconds < 10) {
    return isAr ? "دلوقتي" : "Just now";
  }
  if (diffInSeconds < 60) {
    return isAr ? `منذ ${diffInSeconds} ثانية` : `${diffInSeconds}s ago`;
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return isAr ? `منذ ${diffInMinutes} دقيقة` : `${diffInMinutes}m ago`;
  }

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return isAr ? `منذ ${diffInHours} ساعة` : `${diffInHours}h ago`;
  }

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays === 1) {
    return isAr ? "منذ يوم" : "1d ago";
  }
  if (diffInDays < 30) {
    return isAr ? `منذ ${diffInDays} يوم` : `${diffInDays}d ago`;
  }

  const diffInMonths = Math.floor(diffInDays / 30);
  if (diffInMonths < 12) {
    return isAr ? `منذ ${diffInMonths} شهر` : `${diffInMonths}mo ago`;
  }

  const diffInYears = Math.floor(diffInDays / 365);
  return isAr ? `منذ ${diffInYears} سنة` : `${diffInYears}y ago`;
}
