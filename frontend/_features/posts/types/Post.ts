export interface UserProfile {
  _id: string;
  username: string;
  jobTitle?: string;
  email?: string;
  isAdmin?: boolean;
  isVerified?: boolean;
  postsCount?: number;
  profilePicture?: {
    url?: string;
    publicId?: string;
  };
  bio?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface PostImage {
  url?: string;
  publicId?: string;
}

export interface Comment {
  _id: string;
  postId?: string;
  text: string;
  user: {
    _id: string;
    username: string;
    profilePicture?: {
      url?: string;
    };
  };
  image?: {
    url?: string;
    publicId?: string;
  };
  likes?: (string | { _id: string; username?: string })[];
  commentLikesCount?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface Post {
  _id: string;
  title: string;
  description: string;
  category: string;
  user: {
    _id: string;
    username: string;
    jobTitle?: string;
    profilePicture?: {
      url?: string;
    };
  };
  image?: {
    url?: string;
    publicId?: string;
  };
  likes?: (string | { _id: string; username?: string })[];
  likesCount?: number;
  shares?: (string | { _id: string })[];
  sharesCount?: number;
  comments?: Comment[];
  commentsCount?: number;
  sharedPost?: Post | string;
  createdAt?: string;
  updatedAt?: string;
}

export interface PostsResponse {
  posts?: Post[];
  data?: Post[];
  total?: number;
  page?: number;
  totalPages?: number;
}

