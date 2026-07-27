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
  },
};
