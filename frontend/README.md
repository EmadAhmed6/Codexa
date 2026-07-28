# 🎨 Fluxion Frontend — Technical Platform Client

> The client-side application for the **Fluxion** social media and technical engineering platform, built with **Next.js 16 (App Router)**, **React 19**, **TypeScript**, **TanStack React Query (v5)**, and **Tailwind CSS**.

---

## 🚀 Overview

The **Fluxion Frontend** delivers an intuitive user experience with visual excellence, micro-interactions, responsive design, and modular feature architecture. It offers real-time client-side data caching, single atomic multipart uploads, rich tooltips, nested comments with inline replies, and dedicated administrative management tools.

---

## 📦 Architecture & Key Features

### 1. Domain-Driven Feature Architecture (`_features/`)
Code is organized into domain feature modules rather than generic file-type folders:

```
frontend/
└── _features/
    ├── auth/
    │   ├── api/          # Auth endpoints (login, register, getAuthMe, verifyOtp, etc.)
    │   ├── hooks/        # Dedicated hooks (useLoginMutation, useGetAuthMeQuery)
    │   ├── schemas/      # Zod validation schemas (loginSchema, registerSchema)
    │   └── types/        # Auth interfaces
    ├── posts/
    │   ├── api/          # Posts, comments, replies API handlers
    │   ├── hooks/        # React Query hooks (useGetPosts, useLikePost, useAddReply, etc.)
    │   ├── schemas/      # Post, comment, & edit profile Zod schemas
    │   └── types/        # Post, Comment, & Reply interfaces
    └── user/
        ├── api/          # User profile API requests (getUserProfile, updateUser, uploadAvatar)
        ├── hooks/        # User profile hooks (useGetUserProfile, useUpdateUser)
        └── types/        # UserProfile interfaces
```

---

### 2. Single Atomic Multipart Upload Pipeline
All image updates and text updates (posts, comments, and replies) are sent atomically in a single `Multipart/FormData` HTTP request:
- Prevents UI image flickering or temporary reversion during state updates.
- Eliminates premature toast alerts before file uploads finish on Cloudinary.
- Automatically handles image removal or replacement.

---

### 3. TanStack React Query Cache Invalidation Engine
All post, comment, reply, and profile mutations trigger targeted invalidation across all key query scopes:
- `["posts"]`: Main feed posts
- `["post", postId]`: Single post view
- `["userProfile", userId]`: User profile details & post history
- `["users"]`: All users list (admin dashboard table & user dropdowns)
- `["authMe"]`: Current authenticated user session

---

### 4. Interactive Hover Cards & Reaction Popovers
- **`<UserHoverCard />`**: Hovering over author links (post author, comment author, reply author, or table rows) opens an interactive popover showing avatar, username, role badges (👑 OWNER, 🛡️ Admin, or User), clickable profile link (`/profile/${userId}`), and administrative actions (**Set as Admin / Remove Admin** for Super Admin, and **Edit User** for Admins on non-SuperAdmin targets).
- **`<UserListTooltip />`**: Hovering over like or share buttons displays a popover list of users who reacted (featuring avatars and usernames).
- **`<AuthorProfileTooltip />`**: Displays comprehensive profile details in Admin Dashboard tables.

---

### 5. Unified Typography System (`@/_components/Text.tsx`)
All text elements (`h1`-`h3`, `p`, `span`, `label`) use a unified design component:

```tsx
import { Text } from "@/_components/Text";

<Text
  as="h1" | "h2" | "h3" | "p" | "span" | "label"
  size="xs" | "sm" | "default" | "lg" | "xl" | "2xl" | "3xl" | "4xl"
  font="default" | "medium" | "semiBold" | "bold" | "extraBold" | "black"
  color="primary" | "secondary" | "white" | "black" | "muted" | "error" | "warning"
>
  Content Goes Here
</Text>
```

---

### 6. Admin Dashboard & Multi-Tiered Access Privileges
Dedicated administrative routes guarded for `isAdmin` and `isSuperAdmin` users:
- **`/admin/dashboard/users`**: Manage registered user accounts, filter by role (All/Admins/Users), search by username/email/jobTitle, edit user profiles, toggle admin status (Super Admin only), and delete accounts. Super Admins are sorted at the top of the table automatically. Regular admins cannot edit or delete Super Admin profiles or toggle admin statuses.
- **`/admin/dashboard/posts`**: Manage published articles, inspect engagement counts, search articles, and delete posts.
- **Admin Profile Editing**: Admins can edit user profile details and change profile photos directly from profile pages or hover cards, with protection for Super Admin (Owner) profiles.

---

## 🛠️ Tech Stack

| Dependency | Purpose |
| :--- | :--- |
| **Next.js 16** | App Router framework, SSR, dynamic routing |
| **React 19** | Modern UI rendering engine |
| **TypeScript** | Type safety across components, props, and API interfaces |
| **TanStack React Query (v5)** | Server state management, caching, optimistic updates |
| **Tailwind CSS v4** | Styling, glassmorphism, responsive utilities |
| **Lucide React** | Icon system |
| **Zod & React Hook Form** | Form management & client-side schema validation |

---

## 🏃 Running Locally

1. Install dependencies:
   ```bash
   npm install
   ```
2. Configure `.env.local`:
   ```env
   NEXT_PUBLIC_API_BASE_URL=http://localhost:5000/api
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```
4. Verify TypeScript compilation:
   ```bash
   npx tsc --noEmit
   ```
