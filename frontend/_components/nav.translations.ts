import { Language } from "@/lib/translations";

export interface NavTranslations {
  searchPlaceholder: string;
  noUsersFound: string;
  signIn: string;
  signUp: string;
  myProfile: string;
  adminDashboard: string;
  dashboard: string;
  logOut: string;
  themeLight: string;
  themeDark: string;
  account: string;
  user: string;
  language: string;
  english: string;
  arabic: string;
}

export const navTranslations: Record<Language, NavTranslations> = {
  en: {
    searchPlaceholder: "Search user by name or username...",
    noUsersFound: "No users found",
    signIn: "Sign In",
    signUp: "Sign Up",
    myProfile: "My Profile",
    adminDashboard: "Admin Dashboard",
    dashboard: "Dashboard",
    logOut: "Log Out",
    themeLight: "Switch to Light Mode",
    themeDark: "Switch to Dark Mode",
    account: "Account",
    user: "User",
    language: "Language",
    english: "English",
    arabic: "عربي (مصري)",
  },
  ar: {
    searchPlaceholder: "ابحث عن مستخدم بالاسم أو اليوزر نيم...",
    noUsersFound: "مفيش مستخدم بالاسم ده",
    signIn: "سجل دخول",
    signUp: "اعمل حساب",
    myProfile: "بروفايلي",
    adminDashboard: "الداشبورد",
    dashboard: "الداشبورد",
    logOut: "تسجيل خروج",
    themeLight: "المود الفاتح",
    themeDark: "المود الضلمة",
    account: "الحساب",
    user: "يوزر",
    language: "اللغة",
    english: "English",
    arabic: "عربي (مصري)",
  },
};
