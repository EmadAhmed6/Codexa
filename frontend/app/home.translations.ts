import { Language } from "@/lib/translations";

export interface HomeTranslations {
  feedBadge: string;
  heroTitlePrefix: string;
  heroTitleHighlight: string;
  heroSubtitle: string;
  showingResults: string;
  clearSearch: string;
  noArticlesTitle: string;
  noArticlesDesc: string;
  prev: string;
  next: string;
  createPost: string;
  footerRights: string;
  terms: string;
  privacy: string;
  apiDoc: string;
  reachedEnd: string;
}

export const homeTranslations: Record<Language, HomeTranslations> = {
  en: {
    feedBadge: "Fluxion Technical Feed",
    heroTitlePrefix: "Architecting the Future of ",
    heroTitleHighlight: "Software & Web Engineering",
    heroSubtitle:
      "Discover peer-reviewed posts, architecture breakdowns, and developer insights directly from experts.",
    showingResults: "Showing search results for:",
    clearSearch: "Clear Search",
    noArticlesTitle: "No Posts Found",
    noArticlesDesc:
      "We couldn't find any published posts matching your current filter criteria.",
    prev: "Prev",
    next: "Next",
    createPost: "Create Post",
    footerRights: "Fluxion Social Media app. made by",
    terms: "Terms",
    privacy: "Privacy",
    apiDoc: "API Documentation",
    reachedEnd: "You've reached the end of the feed",
  },
  ar: {
    feedBadge: "أحدث بوستات مجتمع Fluxion التقني",
    heroTitlePrefix: "بنبني مستقبل ",
    heroTitleHighlight: "البرمجة وهندسة الويب",
    heroSubtitle:
      "استكشف أحدث البوستات، تحليلات السيستم، وخبرات المطورين من التقال في المجال.",
    showingResults: "نتائج البحث عن:",
    clearSearch: "امسح البحث",
    noArticlesTitle: "ملقيناش بوستات!",
    noArticlesDesc:
      "ملقيناش أي بوستات تنطبق عليها الفلاتر اللي اخترتها دلوقتي.",
    prev: "السابق",
    next: "التالي",
    createPost: "اكتب بوست",
    footerRights: "تطبيق Fluxion للمجتمع التقني. اتعمل بواسطة",
    terms: "الشروط",
    privacy: "الخصوصية",
    apiDoc: "توثيق الـ API",
    reachedEnd: "وصلنا للاخر خلاص",
  },
};
