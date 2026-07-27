import { Language } from "@/lib/translations";

export interface AdminTranslations {
  dashboard: string;
  navMenu: string;
  usersManagement: string;
  postsManagement: string;
  adminBadge: string;
  searchUsers: string;
  searchPosts: string;
  actions: string;
  role: string;
  admin: string;
  user: string;
  makeAdmin: string;
  removeAdmin: string;
  deleteUser: string;
  deletePost: string;
}

export const adminTranslations: Record<Language, AdminTranslations> = {
  en: {
    dashboard: "Admin Control Dashboard",
    navMenu: "Navigation Menu",
    usersManagement: "Users Management",
    postsManagement: "Posts Management",
    adminBadge: "Administrator",
    searchUsers: "Search users...",
    searchPosts: "Search posts...",
    actions: "Actions",
    role: "Role",
    admin: "Admin",
    user: "User",
    makeAdmin: "Make Admin",
    removeAdmin: "Remove Admin",
    deleteUser: "Delete User",
    deletePost: "Delete Post",
  },
  ar: {
    dashboard: "الداشبورد للأدمن",
    navMenu: "القائمة الرئيسية",
    usersManagement: "إدارة المستخدمين",
    postsManagement: "إدارة البوستات",
    adminBadge: "أدمن النظام",
    searchUsers: "دور على يوزر...",
    searchPosts: "دور على بوست...",
    actions: "الإجراءات",
    role: "الصلاحية",
    admin: "أدمن",
    user: "مستخدم",
    makeAdmin: "خيله أدمن",
    removeAdmin: "شيل صلاحية الأدمن",
    deleteUser: "مسح اليوزر",
    deletePost: "مسح البوست",
  },
};
