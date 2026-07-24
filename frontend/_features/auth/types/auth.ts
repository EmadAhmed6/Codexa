export interface AuthResponse {
  success: boolean;
  message: string;
  token?: string;
  data?: any;
}

export interface ForgotPasswordData {
  email: string;
}

export interface AuthMe {
  _id: string;
  username: string;
  jobTitle?: string;
  email: string;
  bio?: string;
  isAdmin?: boolean;
  isVerified?: boolean;
  postsCount: number;
  profilePicture: {
    url: string;
    publicId: string;
  };
  createdAt: string;
  updatedAt: string;
}
