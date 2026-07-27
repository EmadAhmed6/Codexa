import { Language } from "@/lib/translations";

export interface PostTranslations {
  general: string;
  shared: string;
  edit: string;
  delete: string;
  viewComments: string;
  viewArticle: string;
  anonymous: string;
  anonymousAuthor: string;
  deleteTitle: string;
  deleteDesc: string;
  deleteConfirm: string;
  deleting: string;
  cancel: string;
  backToFeed: string;
  returnToFeed: string;
  articleNotFound: string;
  articleNotFoundDesc: string;
  likeArticle: string;
  share: string;
  discussionComments: string;
  writeResponse: string;
  commentPlaceholder: string;
  attachImage: string;
  changeImage: string;
  postComment: string;
  loginToComment: string;
  noCommentsYet: string;
  editComment: string;
  deleteComment: string;
  save: string;
  saving: string;
  reply: string;
  replies: string;
}

export interface CreateEditPostTranslations {
  createTitle: string;
  createSubtitle: string;
  editTitle: string;
  editSubtitle: string;
  titleLabel: string;
  titlePlaceholder: string;
  contentLabel: string;
  contentPlaceholder: string;
  imageLabel: string;
  clickToUpload: string;
  imageFormatHint: string;
  changeImage: string;
  uploadImage: string;
  publish: string;
  publishing: string;
  saveChanges: string;
  cancel: string;
}

export const postTranslations: Record<Language, PostTranslations> = {
  en: {
    general: "General",
    shared: "Shared",
    edit: "Edit Post",
    delete: "Delete Post",
    viewComments: "View Comments",
    viewArticle: "View Post",
    anonymous: "Anonymous",
    anonymousAuthor: "Anonymous Author",
    deleteTitle: "Delete Post",
    deleteDesc:
      "Are you sure you want to delete this post? This action cannot be undone.",
    deleteConfirm: "Delete Post",
    deleting: "Deleting...",
    cancel: "Cancel",
    backToFeed: "Back to Feed",
    returnToFeed: "Return to Feed",
    articleNotFound: "Post Not Found",
    articleNotFoundDesc: "The post you requested could not be retrieved.",
    likeArticle: "Like Post",
    share: "Share",
    discussionComments: "Discussion & Comments",
    writeResponse: "Write a response",
    commentPlaceholder: "What are your thoughts on this post?",
    attachImage: "Attach Image",
    changeImage: "Change Image",
    postComment: "Post Comment",
    loginToComment:
      "Please log in to join the conversation and post comments.",
    noCommentsYet: "No comments yet. Be the first to share your thoughts!",
    editComment: "Edit Comment",
    deleteComment: "Delete Comment",
    save: "Save",
    saving: "Saving...",
    reply: "Reply",
    replies: "Replies",
  },
  ar: {
    general: "عام",
    shared: "متشير",
    edit: "عدل البوست",
    delete: "امسح البوست",
    viewComments: "شوف الكومنتات",
    viewArticle: "اقرأ البوست",
    anonymous: "مجهول",
    anonymousAuthor: "كاتب مجهول",
    deleteTitle: "مسح البوست",
    deleteDesc:
      "انت متأكد انك عايز تمسح البوست ده؟ الحركة دي مش هينفع ترجع فيها.",
    deleteConfirm: "امسح البوست",
    deleting: "جاري المسح...",
    cancel: "إلغاء",
    backToFeed: "ارجع للأخبار",
    returnToFeed: "الرجوع للأخبار",
    articleNotFound: "ملقيناش البوست ده!",
    articleNotFoundDesc: "البوست اللي طلبته مش موجود أو اتمسح.",
    likeArticle: "إعجاب بالبوست",
    share: "شير",
    discussionComments: "النقاشات والكومنتات",
    writeResponse: "اكتب ردك",
    commentPlaceholder: "إيه رأيك في البوست ده؟",
    attachImage: "ارفق صورة",
    changeImage: "غير الصورة",
    postComment: "انشر الكومنت",
    loginToComment: "سجل دخول الأول عشان تقدر تشارك في النقاش وتكتب كومنتات.",
    noCommentsYet: "مفيش كومنتات لسه. خليك أول واحد يقول رأيه!",
    editComment: "تعديل الكومنت",
    deleteComment: "مسح الكومنت",
    save: "حفظ",
    saving: "جاري الحفظ...",
    reply: "رد",
    replies: "ردود",
  },
};

export const createEditPostTranslations: Record<
  Language,
  CreateEditPostTranslations
> = {
  en: {
    createTitle: "Create New Post",
    createSubtitle:
      "Share your technical insights with the Fluxion community",
    editTitle: "Edit Post",
    editSubtitle: "Update post details",
    titleLabel: "Title",
    titlePlaceholder: "e.g. Building Scalable Apps",
    contentLabel: "Content & Description",
    contentPlaceholder: "Write your post content here...",
    imageLabel: "Featured Cover Image (Optional)",
    clickToUpload: "Click to upload cover image",
    imageFormatHint: "PNG, JPG, WebP up to 5MB",
    changeImage: "Change Post Image",
    uploadImage: "Upload Post Image",
    publish: "Publish Post",
    publishing: "Publishing...",
    saveChanges: "Save Changes",
    cancel: "Cancel",
  },
  ar: {
    createTitle: "انشر بوست جديد",
    createSubtitle: "شارك خبرتك التقنية وأفكارك مع مجتمع Fluxion",
    editTitle: "عدل البوست",
    editSubtitle: "حدث بيانات البوست والفئة بتاعته",
    titleLabel: "العنوان",
    titlePlaceholder: "مثلاً: ازاي تبني سيستم يستحمل ملايين المستخدمين",
    contentLabel: "المحتوى والوصف",
    contentPlaceholder: "اكتب تفاصيل الموضوع بتاعك هنا...",
    imageLabel: "صورة غلاف البوست (اختياري)",
    clickToUpload: "اضغط هنا لرفع صورة الغلاف",
    imageFormatHint: "صور PNG أو JPG أو WebP لحد 5 ميجا",
    changeImage: "غير صورة البوست",
    uploadImage: "ارفق صورة للبوست",
    publish: "انشر البوست",
    publishing: "جاري النشر...",
    saveChanges: "حفظ التغييرات",
    cancel: "إلغاء",
  },
};
