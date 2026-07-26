"use client";

import { CircleAlert } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { Text } from "./Text";
import { useLanguage } from "@/context/LanguageContext";

export const errorVariants = {
  initial: { y: -10, opacity: 0 },
  animate: { y: 0, opacity: 1 },
  exit: { y: -10, opacity: 0 },
};

const validationErrorsAr: Record<string, string> = {
  "Title is required": "عنوان البوست مطلوب",
  "Title must not exceed 32 characters": "العنوان ماينفعش يزيد عن 32 حرف",
  "Category is required": "اختيار الفئة مطلوب",
  "Content description is required": "وصف البوست مطلوب",
  "Content description must not exceed 250 characters": "وصف البوست ماينفعش يزيد عن 250 حرف",
  "Comment text cannot be empty": "اكتب كومنت الأول",
  "Username is required": "اسم المستخدم مطلوب",
  "Username must be at least 3 characters": "اسم المستخدم لازم يكون 3 حروف على الأقل",
  "Username must be at least 3 characters long": "اسم المستخدم لازم يكون 3 حروف على الأقل",
  "Username must not exceed 50 characters": "اسم المستخدم ماينفعش يزيد عن 50 حرف",
  "Job title must not exceed 50 characters": "المسمى الوظيفي ماينفعش يزيد عن 50 حرف",
  "Bio must not exceed 250 characters": "النبذة الشخصية ماينفعش تزيد عن 250 حرف",
  "Invalid email address": "اكتب إيميل صح",
  "Please enter a valid email address": "اكتب إيميل صح",
  "Email is required": "الإيميل مطلوب",
  "Password is required": "الباسورد مطلوب",
  "Password must be at least 8 characters long": "الباسورد لازم يكون 8 حروف أو أرقام على الأقل",
  "Please confirm your password": "أكد الباسورد بتاعك",
  "Passwords do not match": "الباسوردين مش متطابقين",
  "OTP is required": "رمز التحقق مطلوب",
  "OTP must be a 6-digit code": "رمز التحقق لازم يكون 6 أرقام",
};

const Error = ({ error }: { error: string | undefined }) => {
  let isAr = false;
  try {
    const context = useLanguage();
    isAr = context.isArabic;
  } catch {
    isAr = typeof document !== "undefined" && document.documentElement.lang === "ar";
  }

  const displayedError =
    isAr && error && validationErrorsAr[error]
      ? validationErrorsAr[error]
      : error;

  return (
    <AnimatePresence>
      {displayedError && (
        <motion.div
          key="error-message"
          variants={errorVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={{
            ease: "easeInOut",
            duration: 0.2,
            stiffness: 120,
          }}
          className="flex items-center gap-2 text-textError mt-1"
        >
          <CircleAlert className="w-4 h-4 text-textError shrink-0" />
          <Text as={"span"} font={"medium"} size={"sm"} color={"error"}>
            {displayedError}
          </Text>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Error;
