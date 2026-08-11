# BOUNDUP — Social Networking Platform

> **"Connect. Share. Discover. Bound Up."**

BOUNDUP is a modern, production-grade social networking platform built with a high-performance monorepo architecture. It features real-time messaging, stories, ranking feed algorithms, explore masonry grid, reels video player, notifications, media storage abstractions, and an admin moderation panel.

---

## 🎨 Visual Aesthetics & Design System

- **Primary Color**: Vibrant Orange (`#FF5722`)
- **Secondary Color**: Amber Gold (`#FFC107`)
- **Background**: Soft Warm Tint (`#FCF9F8` / `#FFFFFF`)
- **Typography**: *Plus Jakarta Sans* (Headings/Brand) & *Inter* (Body/Inputs)
- **UI Elements**: Glassmorphic headers and bottom navigation, 16px radius cards, ambient shadows, tonal layering.

---

## 🚀 Key Features

1. **Authentic User Authentication**:
   - Secure account registration & login with password hashing (bcrypt).
   - JWT access & refresh token rotation with session management.
   - Zero artificial metrics or fake followers/likes.
2. **Dynamic Ranked Home Feed**:
   - Custom scoring function: `score = recencyScore + relationshipScore + engagementScore`.
   - Stories carousel with active amber-to-orange gradient rings.
   - Double-tap to like with heart animation, comments modal, and save collections.
3. **Explore & Debounced Search**:
   - Masonry-style media grid layout.
   - Real-time debounced search for users, hashtags, and posts.
   - Category filtering (Photography, Travel, Food, Art, Tech, Sports, etc.).
   - Real database-driven trending hashtag counts.
4. **Short Video Reels**:
   - Full-bleed vertical video scrolling player with scroll snap.
   - Play/pause/mute toggle and social action buttons.
5. **Real-time Socket.IO Messaging**:
   - 1-on-1 and Group chats.
   - Real-time typing indicators, read receipts, and online status.
   - Text, media attachments, post shares, and reactions.
6. **Stories System**:
   - 24-hour expiration TTL index.
   - Story creation, viewer list, and auto-progress viewing.
7. **Admin Moderation Panel**:
   - System stats dashboard (Users, Posts, Reports, Suspensions).
   - User status toggle (Suspend/Unsuspend).
   - Content moderation queue for reviewing reported items.
8. **Responsive Breakpoints**:
   - Fixed glass bottom navigation bar (64px height with active orange dot) on Mobile.
   - Lightweight left navigation sidebar on Desktop.
   - Optimized across Mobile, Tablet, Laptop, and Desktop monitors (max-width: 1200px).

---

## 📁 Repository Structure

```
boundup/
├── apps/
│   ├── web/                     # React + Vite + TypeScript + Tailwind CSS
│   │   ├── src/
│   │   │   ├── components/      # UI, Feed, Chat, Explore, Reels, Layouts
│   │   │   ├── pages/           # Home, Explore, Search, Reels, Messages, Profile, Admin
│   │   │   ├── services/        # API fetch client & Socket.IO client
│   │   │   ├── store/           # Zustand Auth & Chat stores
│   │   │   └── index.css        # Design tokens & glassmorphic utilities
│   │   └── package.json
│   │
│   └── api/                     # Node.js + Express + TypeScript + Socket.IO
│       ├── src/
│       │   ├── controllers/     # Auth, User, Post, Story, Chat, Explore, Admin
│       │   ├── models/          # User, Post, Comment, Follow, Story, Message, etc.
│       │   ├── services/        # Feed ranking & Media upload service
│       │   ├── sockets/         # Authenticated Socket.IO handlers
│       │   └── index.ts         # Server entry point
│       └── package.json
│
├── packages/
│   └── shared/                  # Shared TypeScript types and Zod validation schemas
├── uploads/                     # Local media uploads directory
├── docker-compose.yml
├── .env.example
└── package.json                 # Monorepo workspace configuration
```

---

## ⚙️ Installation & Development

### 1. Prerequisites
- Node.js >= 18.x
- MongoDB (running locally on `mongodb://localhost:27017/boundup` or via MongoDB Atlas)

### 2. Setup Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

### 3. Install Dependencies
```bash
npm install
```

### 4. Build Shared Package
```bash
npm run build:shared
```

### 5. Run API & Web Client concurrently
```bash
npm run dev
```
- **Web App**: http://localhost:5173
- **API Server**: http://localhost:5000

---

## 🧪 Testing

Run tests across packages:
```bash
npm run test
```

---

## ⚡ API Endpoints Summary

- `POST   /api/auth/register` — User registration
- `POST   /api/auth/login` — Authentication & JWT issue
- `GET    /api/auth/me` — Verify current user session
- `GET    /api/users/:username` — Get user profile & stats
- `PATCH  /api/users/me` — Update profile & avatar
- `POST   /api/users/:id/follow` — Follow user / send request
- `GET    /api/posts/feed` — Get ranked home feed
- `POST   /api/posts` — Create new post
- `POST   /api/posts/:id/like` — Like post
- `GET    /api/stories` — Get non-expired feed stories
- `POST   /api/stories` — Create 24h story
- `GET    /api/chat/conversations` — List active conversations
- `POST   /api/chat/messages` — Send real-time chat message
- `GET    /api/explore` — Get masonry explore grid
- `GET    /api/search` — Real-time debounced search
- `GET    /api/admin/stats` — Admin dashboard analytics

---

## 📄 License
MIT License. Created for **BOUNDUP**.
