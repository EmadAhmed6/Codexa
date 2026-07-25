# Codexa 🚀

> A modern, full-stack technical blogging and engineering publishing platform built with **Next.js 16 (App Router)**, **TypeScript**, **Express.js**, and **MongoDB**.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Next.js](https://img.shields.io/badge/Next.js-16.x-black?logo=next.js)
![React](https://img.shields.io/badge/React-19.x-blue?logo=react)
![Node.js](https://img.shields.io/badge/Node.js-20.x-green?logo=node.js)
![Express.js](https://img.shields.io/badge/Express.js-4.x-gray?logo=express)
![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-emerald?logo=mongodb)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?logo=typescript)

---

## 📖 Overview

**Codexa** is a feature-rich, high-performance platform designed for software engineers, developers, and tech enthusiasts to share knowledge, publish technical articles, and engage in peer discussions. 

Built using a scalable monorepo structure with a **Next.js frontend** and an **Express/MongoDB backend**, Codexa includes full authentication workflows, media uploads, interactive tooltips, real-time feedback, and an administrative control panel.

---

## ✨ Features & Key Highlights

### 🎨 Frontend & Design System
- **Next.js 16 App Router**: Server-Side Rendering (SSR), Client Components, and dynamic routing (`/posts/[postId]`, `/profile/[id]`, `/admin/dashboard/*`).
- **Feature-Based Modular Architecture**: Isolated `_features/auth`, `_features/posts`, and `_features/user` directories with independent API handlers and custom React Query hooks.
- **Unified `<Text />` Typography Engine**: Reusable typography component governing all headings (`h1`-`h3`), paragraphs, labels, and spans across the entire app.
- **Interactive Tooltip System**: Custom `<Tooltip />` supporting `top`, `bottom`, `left`, `right` positions with smooth animations and dynamic popovers (`<UserListTooltip />`) displaying user avatars, usernames, and job titles on Like/Share hovers.
- **Smart Password Input**: Built-in visibility toggling with eye icons and focus preservation to prevent premature `onBlur` validation errors.
- **Hydration Mismatch Protection**: SSR-guarded state management ensuring clean hydration without browser extension conflicts.

### ⚙️ Backend & API
- **Express.js RESTful API**: Structured modular controllers, routes, and Mongoose schemas.
- **JWT & Cookie Authentication**: Secure token authentication, password hashing with bcrypt, and OTP verification workflows.
- **Role-Based Access Control (RBAC)**: Admin routes for user and post management.
- **Cloudinary Integration**: Cloud-based image storage and transformation for post covers and profile avatars.
- **Complex Mongoose Aggregations & Populates**: Deep population of users, likes, comments, and shares.

---

## 🛠️ Technology Stack

| Layer | Technologies Used |
| :--- | :--- |
| **Frontend Core** | Next.js 16 (App Router), React 19, TypeScript |
| **Styling & UI** | Tailwind CSS, Lucide React, Framer Motion, Sonner Toast |
| **State & Data Fetching** | TanStack React Query (v5), Axios, JS-Cookie |
| **Forms & Validation** | React Hook Form, Zod Schema Validation |
| **Backend Core** | Node.js, Express.js, TypeScript |
| **Database & ODM** | MongoDB, Mongoose |
| **Auth & Security** | JSON Web Tokens (JWT), Bcrypt.js, Express Async Handler |
| **Media Storage** | Cloudinary API & Multer Storage |

---

## 📁 Repository Structure

```
Codexa/
├── backend/                  # Express.js REST API Backend
│   ├── src/
│   │   ├── config/           # Database connection & env variables
│   │   ├── middleware/       # JWT auth & error handling middlewares
│   │   ├── modules/
│   │   │   ├── auth/         # Auth routes, controllers, OTP schemas
│   │   │   ├── posts/        # Posts routes, controllers, models, schemas
│   │   │   └── user/         # User routes, profile controllers, models
│   │   └── utils/            # Cloudinary & helper utilities
│   ├── package.json
│   └── tsconfig.json
│
└── frontend/                 # Next.js 16 Client Application
    ├── _components/          # Core reusable components (Navbar, PostCard, Tooltip, Text)
    ├── _features/            # Domain-driven feature modules (api, hooks, schemas, types)
    │   ├── auth/
    │   ├── posts/
    │   └── user/
    ├── app/                  # Next.js App Router pages & routes
    │   ├── admin/dashboard/  # Admin user and post management sub-pages
    │   ├── auth/             # Login, Register, OTP, Reset Password pages
    │   ├── posts/[postId]/   # Single article reader page
    │   └── profile/[id]/     # User profile page
    ├── components/ui/        # Base UI elements (Button, Input, Label)
    ├── lib/                  # Utilities, Axios instances, & helpers
    ├── package.json
    └── tailwind.config.ts
```

---

## 🚀 Quick Start & Setup Guide

### Prerequisites
- **Node.js** v18.0.0 or higher
- **pnpm** or **npm**
- **MongoDB** instance (local or MongoDB Atlas)
- **Cloudinary Account** (for image upload functionality)

---

### 1. Backend Setup

```bash
# Navigate to the backend directory
cd backend

# Install dependencies
npm install

# Create environment configuration file
cp .env.example .env
```

#### Configure `backend/.env`:
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/codexa
JWT_SECRET=your_super_secret_jwt_key
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

#### Start Backend Development Server:
```bash
npm run dev
# Server running at http://localhost:5000
```

---

### 2. Frontend Setup

```bash
# Navigate to the frontend directory
cd ../frontend

# Install dependencies
pnpm install # or npm install

# Create environment configuration file
cp .env.example .env
```

#### Configure `frontend/.env`:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

#### Start Frontend Development Server:
```bash
pnpm dev # or npm run dev
# Application running at http://localhost:3000
```

---

## 🔌 API Endpoints Summary

### Authentication Routes (`/api/auth`)
| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| `POST` | `/auth/register` | Register a new user | Public |
| `POST` | `/auth/login` | Login user & return JWT token | Public |
| `POST` | `/auth/verify-otp` | Verify 6-digit OTP code | Public |
| `GET` | `/auth/me` | Fetch authenticated user profile | Private |
| `POST` | `/auth/forgot-password` | Request password reset email | Public |
| `POST` | `/auth/reset-password` | Reset user password with token | Public |

### Posts Routes (`/api/posts`)
| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| `GET` | `/posts` | Get paginated posts with filters | Public |
| `GET` | `/posts/:postId` | Get single post details with comments | Public |
| `POST` | `/posts` | Create a new article | Private |
| `PUT` | `/posts/:postId` | Update post content & category | Private (Owner/Admin) |
| `DELETE` | `/posts/:postId` | Delete article | Private (Owner/Admin) |
| `POST` | `/posts/:postId/upload` | Upload cover image to Cloudinary | Private (Owner) |
| `PUT` | `/posts/:postId/like` | Like or unlike post | Private |
| `POST` | `/posts/:postId/share` | Share an article | Private |

### User Routes (`/api/users`)
| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| `GET` | `/users/:id` | Get user profile details | Public |
| `PUT` | `/users/:id` | Update username, job title, email | Private (Owner/Admin) |
| `DELETE` | `/users/:id` | Delete user account & associated posts | Private (Owner/Admin) |
| `POST` | `/users/:id/upload` | Upload profile avatar | Private (Owner) |

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check out the issues page.

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.
