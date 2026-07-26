"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import Cookies from "js-cookie";
import {
  translations,
  type Language,
  type TranslationSchema,
} from "@/lib/translations";

type Direction = "ltr" | "rtl";

interface LanguageContextType {
  language: Language;
  dir: Direction;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  t: TranslationSchema;
  isArabic: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined,
);

const LANG_COOKIE_KEY = "NEXT_LOCALE";

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>("en");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const savedLang = (Cookies.get(LANG_COOKIE_KEY) ||
      localStorage.getItem("lang")) as Language | null;
    if (savedLang && (savedLang === "en" || savedLang === "ar")) {
      setLanguageState(savedLang);
    }
    setMounted(true);
  }, []);

  const dir: Direction = language === "ar" ? "rtl" : "ltr";

  const applyDomAttributes = useCallback((lang: Language, direction: Direction) => {
    if (typeof document !== "undefined") {
      document.documentElement.lang = lang;
      document.documentElement.dir = direction;
      if (lang === "ar") {
        document.documentElement.classList.add("font-cairo");
      } else {
        document.documentElement.classList.remove("font-cairo");
      }
    }
  }, []);

  useEffect(() => {
    if (mounted) {
      applyDomAttributes(language, dir);
    }
  }, [language, dir, mounted, applyDomAttributes]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    Cookies.set(LANG_COOKIE_KEY, lang, { expires: 365 });
    localStorage.setItem("lang", lang);
    applyDomAttributes(lang, lang === "ar" ? "rtl" : "ltr");
  };

  const toggleLanguage = () => {
    const nextLang: Language = language === "en" ? "ar" : "en";
    setLanguage(nextLang);
  };

  const currentTranslations = translations[language] || translations.en;

  return (
    <LanguageContext.Provider
      value={{
        language,
        dir,
        setLanguage,
        toggleLanguage,
        t: currentTranslations,
        isArabic: language === "ar",
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
