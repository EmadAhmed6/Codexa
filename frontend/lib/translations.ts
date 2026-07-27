export type Language = "en" | "ar";

export interface TranslationSchema {
  nav: {
    searchPlaceholder: string;
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
  };
  home: {
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
  };
  categories: {
    All: string;
    Development: string;
    "React & Next.js": string;
    "Backend & API": string;
    "Design & UX": string;
    "AI & ML": string;
    "DevOps & Cloud": string;
    "Career & Insights": string;
  };
  post: {
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
  };
  createEditPost: {
    createTitle: string;
    createSubtitle: string;
    editTitle: string;
    editSubtitle: string;
    titleLabel: string;
    titlePlaceholder: string;
    contentLabel: string;
    contentPlaceholder: string;
    categoryLabel: string;
    imageLabel: string;
    clickToUpload: string;
    imageFormatHint: string;
    changeImage: string;
    uploadImage: string;
    publish: string;
    publishing: string;
    saveChanges: string;
    cancel: string;
  };
  profile: {
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
  };
  admin: {
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
  };
  auth: {
    welcomeBack: string;
    welcomeBackDesc: string;
    startCreating: string;
    startCreatingDesc: string;
    forgotPasswordTitle: string;
    forgotPasswordDesc: string;
    resetPasswordTitle: string;
    resetPasswordDesc: string;
    verifyOtpTitle: string;
    verifyOtpDesc: string;
    emailLabel: string;
    emailPlaceholder: string;
    passwordLabel: string;
    passwordPlaceholder: string;
    usernameLabel: string;
    usernamePlaceholder: string;
    jobTitleLabel: string;
    jobTitlePlaceholder: string;
    confirmPasswordLabel: string;
    confirmPasswordPlaceholder: string;
    forgotPasswordLink: string;
    signInBtn: string;
    signingInBtn: string;
    createAccountBtn: string;
    creatingAccountBtn: string;
    sendEmailBtn: string;
    sendingLinkBtn: string;
    resetPasswordBtn: string;
    resettingBtn: string;
    verifyAccountBtn: string;
    verifyingOtpBtn: string;
    dontHaveAccount: string;
    createOneNow: string;
    alreadyHaveAccount: string;
    backToLogin: string;
    checkYourEmail: string;
    checkEmailDesc: string;
    canResendIn: string;
    resendEmail: string;
    enter6DigitCode: string;
    alreadyVerified: string;
  };
}

export const translations: Record<Language, TranslationSchema> = {
  en: {
    nav: {
      searchPlaceholder: "Search posts, topics, or keywords...",
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
    home: {
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
    },
    categories: {
      All: "All",
      Development: "Development",
      "React & Next.js": "React & Next.js",
      "Backend & API": "Backend & API",
      "Design & UX": "Design & UX",
      "AI & ML": "AI & ML",
      "DevOps & Cloud": "DevOps & Cloud",
      "Career & Insights": "Career & Insights",
    },
    post: {
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
      loginToComment: "Please log in to join the conversation and post comments.",
      noCommentsYet: "No comments yet. Be the first to share your thoughts!",
      editComment: "Edit Comment",
      deleteComment: "Delete Comment",
      save: "Save",
      saving: "Saving...",
      reply: "Reply",
      replies: "Replies",
    },
    createEditPost: {
      createTitle: "Create New Post",
      createSubtitle: "Share your technical insights with the Fluxion community",
      editTitle: "Edit Post",
      editSubtitle: "Update post details",
      titleLabel: "Title",
      titlePlaceholder: "e.g. Building Scalable Apps",
      contentLabel: "Content & Description",
      contentPlaceholder: "Write your post content here...",
      categoryLabel: "Category",
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
    profile: {
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
    admin: {
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
    auth: {
      welcomeBack: "Welcome Back",
      welcomeBackDesc: "Enter your credentials to access your account",
      startCreating: "Start Creating",
      startCreatingDesc: "Join our network of writers and developers today",
      forgotPasswordTitle: "Forgot Password",
      forgotPasswordDesc: "Enter your email to receive recovery instructions",
      resetPasswordTitle: "Reset Password",
      resetPasswordDesc: "Enter your new password below",
      verifyOtpTitle: "Verify OTP Code",
      verifyOtpDesc: "Enter the 6-digit verification code sent to your email",
      emailLabel: "Email address",
      emailPlaceholder: "you@example.com",
      passwordLabel: "Password",
      passwordPlaceholder: "••••••••",
      usernameLabel: "Username",
      usernamePlaceholder: "emad_121",
      jobTitleLabel: "Job Title (Optional)",
      jobTitlePlaceholder: "Frontend Developer",
      confirmPasswordLabel: "Confirm Password",
      confirmPasswordPlaceholder: "••••••••",
      forgotPasswordLink: "Forgot password?",
      signInBtn: "Sign In",
      signingInBtn: "Signing In...",
      createAccountBtn: "Create Account",
      creatingAccountBtn: "Creating Account...",
      sendEmailBtn: "Send Email",
      sendingLinkBtn: "Sending link...",
      resetPasswordBtn: "Reset Password",
      resettingBtn: "Resetting...",
      verifyAccountBtn: "Verify Account",
      verifyingOtpBtn: "Verifying OTP...",
      dontHaveAccount: "Don't have an account?",
      createOneNow: "Create one now",
      alreadyHaveAccount: "Already have an account?",
      backToLogin: "Back to login",
      checkYourEmail: "Check your email",
      checkEmailDesc: "We've sent recovery link to your inbox. Check spam if not found.",
      canResendIn: "You can resend in",
      resendEmail: "Resend Email",
      enter6DigitCode: "Enter 6-Digit Code",
      alreadyVerified: "Already verified?",
    },
  },
  ar: {
    nav: {
      searchPlaceholder: "دور على بوستات، مواضيع، أو كلمات...",
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
    home: {
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
    },
    categories: {
      All: "الكل",
      Development: "تطوير وبرمجة",
      "React & Next.js": "React و Next.js",
      "Backend & API": "باك إند و API",
      "Design & UX": "ديزاين و UX",
      "AI & ML": "ذكاء اصطناعي",
      "DevOps & Cloud": "DevOps وسحابة",
      "Career & Insights": "خبرات ونصايح",
    },
    post: {
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
    createEditPost: {
      createTitle: "انشر بوست جديد",
      createSubtitle: "شارك خبرتك التقنية وأفكارك مع مجتمع Fluxion",
      editTitle: "عدل البوست",
      editSubtitle: "حدث بيانات البوست والفئة بتاعته",
      titleLabel: "العنوان",
      titlePlaceholder: "مثلاً: ازاي تبني سيستم يستحمل ملايين المستخدمين",
      contentLabel: "المحتوى والوصف",
      contentPlaceholder: "اكتب تفاصيل الموضوع بتاعك هنا...",
      categoryLabel: "الفئة",
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
    profile: {
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
    admin: {
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
    auth: {
      welcomeBack: "أهلاً بيك تاني",
      welcomeBackDesc: "ادخل بياناتك عشان تفتح حسابك",
      startCreating: "ابدأ انشر أفكارك",
      startCreatingDesc: "انضم لمجتمع المطورين والكتّاب بتاعنا النهاردة",
      forgotPasswordTitle: "نسيت الباسورد؟",
      forgotPasswordDesc: "اكتب إيميلك وهنبعتلك رابط استرجاع الحساب",
      resetPasswordTitle: "تغيير الباسورد",
      resetPasswordDesc: "اكتب الباسورد الجديد بتاعك",
      verifyOtpTitle: "تأكيد كود الـ OTP",
      verifyOtpDesc: "اكتب كود الـ 6 أرقام اللي اتبعت على إيميلك",
      emailLabel: "عنوان الإيميل",
      emailPlaceholder: "you@example.com",
      passwordLabel: "الباسورد",
      passwordPlaceholder: "••••••••",
      usernameLabel: "اسم المستخدم",
      usernamePlaceholder: "مثلاً: emad_121",
      jobTitleLabel: "المسمى الوظيفي (اختياري)",
      jobTitlePlaceholder: "مثلاً: فرونت إند ديفيلوبر",
      confirmPasswordLabel: "تأكيد الباسورد",
      confirmPasswordPlaceholder: "••••••••",
      forgotPasswordLink: "نسيت الباسورد؟",
      signInBtn: "سجل دخول",
      signingInBtn: "جاري تسجيل الدخول...",
      createAccountBtn: "اعمل حساب جديد",
      creatingAccountBtn: "جاري إنشاء الحساب...",
      sendEmailBtn: "ابعت الإيميل",
      sendingLinkBtn: "جاري الإرسال...",
      resetPasswordBtn: "غير الباسورد",
      resettingBtn: "جاري التغيير...",
      verifyAccountBtn: "أكد الحساب",
      verifyingOtpBtn: "جاري التأكيد...",
      dontHaveAccount: "مش عندك حساب؟",
      createOneNow: "سجل حساب دلوقتي",
      alreadyHaveAccount: "عندك حساب بالفعل؟",
      backToLogin: "ارجع لتسجيل الدخول",
      checkYourEmail: "افحص إيميلك",
      checkEmailDesc: "بعتنالك رابط الاسترجاع على إيميلك.",
      canResendIn: "تقدر تبعت تاني خلال",
      resendEmail: "عادة إرسال الإيميل",
      enter6DigitCode: "ادخل كود الـ 6 أرقام",
      alreadyVerified: "مـتأكد بالفعل؟",
    },
  },
};
