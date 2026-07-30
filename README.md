# ⚡ Fluxion — Modern Engineering Social Media Platform

> A full-stack engineering social platform and technical blogging suite built with **Next.js 16 (App Router)**, **React 19**, **TypeScript**, **Express.js**, **MongoDB (Mongoose)**, **TanStack React Query (v5)**, **Cloudinary**, and **Tailwind CSS**.

---

## 🌟 Overview

**Fluxion** is a sleek, high-contrast, dual-language-capable social platform engineered for developers and tech professionals. It provides a real-time interactive user experience with atomic multipart image uploads, nested comment & inline reply threads, interactive user hover cards, reaction popovers, profile bio management, and administrative dashboards.

---

## 🚀 Key Features

### 💻 Client Side (Frontend)
- **⚡ Next.js 16 App Router & React 19**: Powered by client/server components, SSR, and dynamic route optimization.
- **🎨 Glassmorphism & High-Contrast Design**: Tailored theme palette with dark mode support, smooth micro-interactions, and custom typography system (`<Text />`).
- **👑 Multi-Tiered Role System (Super Admin / Admin / User)**:
  - **Super Admin (OWNER)**: Dynamic database-driven role (`isSuperAdmin`) with top priority sorting, distinct golden 👑 OWNER badge with Egyptian Arabic localized translations (`صاحب الموقع`), exclusive ability to promote/demote admins, and immunity from deletion/editing by regular admins.
  - **Admin**: Has administrative access to dashboard and user editing, with custom 🛡️ Admin badge (`أدمن`).
  - **User**: Standard user role.
- **🔄 Single Atomic Multipart Uploads**: Text and image uploads (`postImage`, `commentImage`, `replyImage`) are processed in single atomic `FormData` HTTP requests to eliminate image flickering and premature toasts.
- **💬 Nested Comments & Inline Replies**: Real-time comment threads supporting multi-level replies (`ReplySection`), inline editing, image attachments, and likes.
- **🗂️ React Query Cache Strategy**: Instant UI updates across Feed, Single Post Pages, Profile Pages, and Admin Dashboard via global cache invalidation (`["posts"]`, `["post", postId]`, `["userProfile"]`, `["users"]`, `["authMe"]`).
- **🎴 Interactive Hover Cards**: Hover over any username or avatar (in posts, comments, replies, or admin dashboard) to reveal user profile details (`<UserHoverCard />`) or reaction lists (`<UserListTooltip />`).
- **👤 Profile & Bio Management**: Editable profile fields (`username` up to 50 chars, `jobTitle` up to 50 chars, `bio` up to 250 chars) and profile avatar uploads.
- **🔑 Account Password Change Modal**: Interactive Change Password modal (`ChangePasswordModal.tsx`) with real-time Zod schema requirement indicators, password visibility toggles, and strict owner-only access (`isOwnProfile === true`).
- **🛡️ Admin Dashboard**: Dedicated administrative panels (`/admin/dashboard/users` & `/admin/dashboard/posts`) with real-time search, role-based filter cards, top-sorted Super Admin listing, and role management buttons.

### ⚙️ Server Side (Backend)
- **🚀 Node.js & Express.js REST API**: Modular controller architecture written in TypeScript.
- **🔐 Role-Based Access Control (RBAC)**: Fine-grained token verification middlewares (`verifyToken`, `verifyAdminToken`, `verifySuperAdminToken`, `verifyAuthorizedToken`).
- **🛡️ Super Admin Protection**: Strict server-side safeguards preventing regular admins from editing or deleting Super Admin (Owner) profiles, restricting `PATCH /users/:id/toggle-admin` to Super Admins, and enforcing profile owner isolation on `POST /users/:userId/change-password`.
- **🔐 Bulletproof Authentication & Security**: JWT authorization, bcrypt password hashing, rate-limiting (`express-rate-limit` with 10 req/min on sensitive password/auth endpoints), and email verification (OTP via Nodemailer with hidden schema selection).
- **🗄️ MongoDB & Mongoose ORM**: Schema definitions with deep populates (`user`, `likes`, `shares`, `comments`, `replies`).
- **☁️ Cloudinary Integration**: Automated image uploading and legacy Cloudinary asset cleanup on file replacements or deletions.
- **🛡️ Validation & Sanitation**: Strict Zod schemas validating user inputs across register, login, change password (`currentPassword` & `newPassword`), profile updates, posts, comments, and replies.


---

## 🏗️ Tech Stack

| Domain | Technologies |
| :--- | :--- |
| **Frontend Core** | Next.js 16 (App Router), React 19, TypeScript |
| **Frontend Styling** | Tailwind CSS v4, Lucide Icons, Custom Design Tokens |
| **State & Data Fetching** | TanStack React Query v5, React Hook Form, Zod |
| **Backend Core** | Node.js, Express.js (v5), TypeScript (ESM) |
| **Database & ODM** | MongoDB, Mongoose |
| **Authentication & Protection**| JWT, Bcrypt.js, Helmet, CORS, Express-Rate-Limit |
| **File Storage & Mail** | Cloudinary, Multer, Nodemailer |

---

## 📁 Repository Structure

```
Codexa/
├── frontend/                   # Next.js 16 Frontend Application
│   ├── _components/            # Shared UI Components (Navbar, PostCard, UserHoverCard, Tooltip, etc.)
│   ├── _features/              # Domain-driven features (auth, posts, user)
│   │   ├── auth/               # Auth API, hooks, Zod schemas, types
│   │   ├── posts/              # Post, comment, reply API, hooks, schemas
│   │   └── user/               # Profile API, hooks, Zod schemas, types
│   ├── app/                    # Next.js App Router Pages (Feed, Auth, Profile, Admin)

│   └── components/ui/          # Base Primitives (Button, Input, etc.)
│
├── backend/                    # Express.js REST API
│   ├── src/
│   │   ├── config/             # DB & Mail Transporter Configurations
│   │   ├── middlewares/        # Auth, Rate-Limiters, Error Handlers
│   │   ├── modules/            # Domain Modules (auth, posts, comment, reply, user)
│   │   └── utils/              # Cloudinary, SendEmail helpers
│   ├── API-Docs.md             # Complete API Specification Document
│   └── package.json
└── README.md                   # Project Overview (This File)
```

---

## 🚦 Getting Started

### 1. Prerequisites
- Node.js (v18.x or higher)
- npm / pnpm / yarn
- MongoDB Instance (Local or MongoDB Atlas)
- Cloudinary Account & Credentials

---

### 2. Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the `backend/` directory:
   ```env
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/fluxion
   JWT_SECRET_KEY=your_jwt_secret_key
   FRONTEND_URL=http://localhost:3000

   # Cloudinary Credentials
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret

   # Email Credentials (Nodemailer)
   APP_EMAIL_ADDRESS=your_email@gmail.com
   APP_EMAIL_PASSWORD=your_app_password
   ```
4. Start the backend development server:
   ```bash
   npm run dev
   ```

---

### 3. Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd ../frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env.local` file in the `frontend/` directory:
   ```env
   NEXT_PUBLIC_API_BASE_URL=http://localhost:5000/api
   ```
4. Start the frontend development server:
   ```bash
   npm run dev
   ```
5. Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📝 License

Distributed under the ISC License. Made by **Emad Ahmed**.
