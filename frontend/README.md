# Codexa Frontend 🎨

> The client-side application for Codexa technical engineering blog, built with **Next.js 16 (App Router)**, **React 19**, **TypeScript**, **TanStack React Query (v5)**, and **Tailwind CSS**.

---

## 🚀 Overview

The **Codexa Frontend** is designed with high visual excellence, micro-interactions, responsive design, and modular feature architecture. It offers seamless client-side data caching, form handling, custom tooltips, and client-side page transitions.

---

## 📦 Key Architectural Patterns

### 1. Modular Feature Architecture (`_features/`)
Instead of grouping code strictly by type (e.g. putting all hooks in one folder), Codexa organizes code by **domain features**:

```
frontend/
└── _features/
    ├── auth/
    │   ├── api/          # Isolated API request handlers (login, register, me, etc.)
    │   ├── hooks/        # Dedicated TanStack Query hooks (useLoginMutation, useGetAuthMeQuery)
    │   ├── schemas/      # Zod validation schemas
    │   └── types/        # TypeScript interfaces & types
    ├── posts/
    │   ├── api/          # Post API requests (getPosts, createPost, likePost, etc.)
    │   ├── hooks/        # Custom post hooks (useGetPosts, useLikePost, useSharePost)
    │   ├── schemas/      # Post creation & comment Zod schemas
    │   └── types/        # Post & Comment interfaces
    └── user/
        ├── api/          # User profile API requests
        ├── hooks/        # Custom user profile hooks
        └── types/        # UserProfile interfaces
```

---

### 2. Unified `<Text />` Typography System
All text elements across the app (`h1`-`h3`, `p`, `span`, `label`) use a unified typography component located at `@/_components/Text.tsx`:

```tsx
import { Text } from "@/_components/Text";

<Text
  as="h1" | "h2" | "h3" | "p" | "span" | "label"
  size="xs" | "sm" | "default" | "lg" | "xl" | "2xl" | "3xl" | "4xl"
  font="default" | "medium" | "semiBold" | "bold" | "extraBold" | "black"
  color="primary" | "secondary" | "white" | "black" | "muted" | "error" | "warning"
  className="tracking-tight"
>
  Content Goes Here
</Text>
```

---

### 3. Interactive Tooltips & User Popovers
Codexa features a custom, reusable Tooltip engine (`_components/Tooltip.tsx`) supporting four positions (`top`, `bottom`, `left`, `right`) with 200ms hide delay, pointer-events interactivity, and an invisible hover bridge that keeps tooltips open smoothly while hovering into popovers.

- **`<Tooltip position="top" content="...">`**: Provides immediate text labels for icon buttons and navigation elements.
- **`<UserListTooltip users={post.likes} type="like" />`**: Renders an interactive popover listing users who liked or shared an article (including avatars, usernames, job titles, and clickable links to profile pages `/profile/${userId}`).
- **`<AuthorProfileTooltip user={authorObj} userId={authorId} />`**: Displays a detailed user card in Admin Tables on author hover (showing avatar, username, admin badge, job title, email, and user ID).

```tsx
<Tooltip position="bottom" content={<UserListTooltip users={post.likes} type="like" />}>
  <button onClick={handleLike}>
    <Heart className="h-4 w-4" />
    <span>{likesCount}</span>
  </button>
</Tooltip>
```

---

### 4. Smart Input Component (`@/components/ui/input.tsx`)
The base `<Input />` component manages password visibility toggling internally:
- When `type="password"`, an Eye icon is rendered inside the input.
- Toggling visibility preserves input focus via `onMouseDown={(e) => e.preventDefault()}`, preventing premature `onBlur` validation errors in React Hook Form.
- Configured with `suppressHydrationWarning` to eliminate browser extension attribute conflicts.

---

### 5. Dedicated Admin Dashboard Routes
The Admin Dashboard is built with dedicated Next.js App Router pages:
- **`/admin/dashboard/users`**: User statistics, real-time search, user management table, styled icon-only delete buttons (`<Trash2 />`) with pre-hover red highlights and confirmation modals.
- **`/admin/dashboard/posts`**: Article statistics, real-time search, post management table with unified clickable article links (image + title hover effects), rich `<AuthorProfileTooltip />` popovers on author hover, reaction tooltips (`position="bottom"`), and delete modals.
- **`AdminSidebar.tsx`**: Shared sidebar featuring active route highlighting using Next.js `usePathname()`.

---

## 🛠️ Tech Stack & Dependencies

| Dependency | Purpose |
| :--- | :--- |
| **Next.js 16** | App Router framework, SSR, dynamic routing |
| **React 19** | Modern UI rendering library |
| **TypeScript** | Type safety across components and API responses |
| **TanStack React Query (v5)** | Server state management, caching, optimistic updates |
| **Tailwind CSS** | Styling, glassmorphism, responsive utilities |
| **Lucide React** | Icons library |
| **React Hook Form** | High-performance form state management |
| **Zod** | Schema validation for forms and inputs |
| **JS-Cookie & Axios** | Cookie token management & HTTP requests |
| **Sonner** | Toast notifications |

---

## 📂 Frontend Directory Structure

```
frontend/
├── _components/          # Shared components
│   ├── AdminSidebar.tsx  # Admin dashboard navigation sidebar
│   ├── CommentSection.tsx# Article discussion & comment thread
│   ├── CreatePostModal.tsx# Article creation modal with image upload
│   ├── DeleteConfirmModal.tsx# Framer motion confirmation modal
│   ├── EditPostModal.tsx # Article editing modal
│   ├── Error.tsx         # Animated form validation error message
│   ├── Navbar.tsx        # Application header with theme switcher & profile dropdown
│   ├── PostCard.tsx      # Interactive article card with tooltips & link overlay
│   ├── Text.tsx          # Design system typography component
│   ├── Tooltip.tsx       # Reusable multi-position tooltip engine
│   └── UserListTooltip.tsx# Popover component for user interactions
│
├── _features/            # Domain-driven feature modules (auth, posts, user)
├── app/                  # Next.js App Router routes & pages
│   ├── admin/dashboard/  # Admin sub-routes (/users, /posts)
│   ├── auth/             # Login, Register, OTP, Reset Password pages
│   ├── posts/[postId]/   # Single article reader page
│   ├── profile/[id]/     # User profile page
│   ├── globals.css       # Design tokens, CSS variables, & custom utility classes
│   ├── layout.tsx        # Root layout with QueryProvider & ThemeProvider
│   └── page.tsx          # Home page & main article feed
│
├── components/ui/        # Base shadcn UI elements (Button, Input, Label)
├── lib/                  # Utilities (axios instance, cn helper, date formatters)
├── stores/               # Client-side stores
├── package.json
└── tailwind.config.ts
```

---

## 🚦 Available Scripts

In the `frontend` directory, you can run:

```bash
# Start development server
pnpm dev # or npm run dev

# Run TypeScript type-checking without emitting files
pnpm tsc --noEmit # or npx tsc --noEmit

# Build production bundle
pnpm build # or npm run build

# Start production server
pnpm start # or npm run start
```

---

## ⚙️ Environment Variables

Create a `.env` file in the `frontend` root:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```
