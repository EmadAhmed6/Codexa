import { Language } from "@/lib/translations";

export interface ProfileTranslations {
  userProfile: string;
  myProfile: string;
  editProfile: string;
  articlesPublished: string;
  totalLikes: string;
  joined: string;
  noPostsYet: string;
  userPosts: string;
  changePhoto: string;
  jobTitle: string;
  bio: string;
  saveProfile: string;
  owner: string;
  admin: string;
  editUser: string;
  setAdmin: string;
  removeAdmin: string;
  viewProfile: string;
}

export const profileTranslations: Record<Language, ProfileTranslations> = {
  en: {
    userProfile: "User Profile",
    myProfile: "My Profile",
    editProfile: "Edit Profile",
    articlesPublished: "Posts Published",
    totalLikes: "Total Likes Received",
    joined: "Joined",
    noPostsYet: "No posts published yet.",
    userPosts: "User Posts",
    changePhoto: "Change Photo",
    jobTitle: "Job Title",
    bio: "Bio",
    saveProfile: "Save Profile",
    owner: "Owner",
    admin: "Admin",
    editUser: "Edit User",
    setAdmin: "Set as Admin",
    removeAdmin: "Remove Admin",
    viewProfile: "View Profile",
  },
  ar: {
    userProfile: "الملف الشخصي",
    myProfile: "بروفايلي",
    editProfile: "تعديل البروفايل",
    articlesPublished: "البوستات المنشورة",
    totalLikes: "إجمالي اللايكات اللي جته",
    joined: "انضم في",
    noPostsYet: "لسه مانشرش أي بوستات.",
    userPosts: "بوستات المستخدم",
    changePhoto: "تغيير الصورة",
    jobTitle: "المسمى الوظيفي",
    bio: "نبذة عنه",
    saveProfile: "حفظ البروفايل",
    owner: "صاحب الموقع",
    admin: "أدمن",
    editUser: "تعديل بيانات اليوزر",
    setAdmin: "خليه أدمن",
    removeAdmin: "شيل صلاحية الأدمن",
    viewProfile: "شوف البروفايل",
  },
};
