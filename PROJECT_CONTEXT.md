# FundConnect AI - Project Context

This file serves as a persistent state and context tracker for the FundConnect AI project. If the AI assistant is ever restarted or loses context, reading this file will bring it back up to speed immediately.

## 1. Project Overview
**FundConnect AI** is an AI-powered social crowdfunding platform built on the MERN stack (MongoDB, Express, React, Node.js). It functions like a modern social media feed (mixing Instagram/LinkedIn UI) where every campaign is a post.

### Core Architecture & Tech Stack
- **Backend:** Node.js, Express, MongoDB Atlas, Mongoose.
- **Frontend:** React, Vite, Tailwind CSS, Redux Toolkit, React Router DOM.
- **External Services:** 
  - **OpenRouter (`google/gemini-2.5-flash`):** AI Campaign Writer & Trust Score generator.
  - **Cloudinary:** Image & Video hosting.
  - **Razorpay:** Payment gateway (Test mode).
- **Deployment:** Vercel (monorepo).

## 2. Current Progress: Phase 1 & 2 Completed
As of the latest session, **Phase 1 (Foundation)** and **Phase 2 (API Completion)** are 100% complete.

### What has been built so far:
1. **MongoDB Models (`backend/src/models/`):**
   - User, Campaign, CampaignUpdate, Donation, Comment, Like, Notification, Report, Withdrawal.
2. **Database Seeding (`backend/src/scripts/seed.js`):**
   - Robust faker data generation including campaigns, users, comments, donations, campaign updates, reports, and withdrawals.
3. **External Services (`backend/src/services/`):**
   - Cloudinary (Media uploads).
   - Razorpay (Payment intent & signature verification).
   - OpenRouter (AI text generation).
4. **Backend API (Controllers, Routes, & Middlewares):**
   - **Validation:** Implemented `express-validator` and `validation.middleware.js`.
   - **Campaigns:** CRUD, trending, newest, category-specific feeds, and nested updates.
   - **Donations:** Secure intent creation and signature verification flow. Receipt downloads.
   - **Interactions:** Comments (with nested replies) and Likes.
   - **Users & Notifications:** Profile management, saved campaigns, and real-time styled notifications system.
   - **Admin:** Moderation capabilities for users, reports, campaigns, and withdrawals.
   - **AI:** Trust Score evaluation endpoint (`evaluateCampaign`), AI rewrite, and summarization endpoints.
   - All endpoints successfully wired into `app.js`.

## 3. What to do next: Phase 3
The next immediate step is to start **Phase 3: Frontend Feed & Navigation**.

### Tasks for Phase 3:
1. Ensure the user has verified backend endpoints via Postman or Thunder Client.
2. Setup React Router for the main frontend pages (Feed, Campaign Details, Profile, Dashboard).
3. Build the core Social Media style feed (fetching from `/api/v1/campaigns/feed`).
4. Implement "Load More" pagination for the feed.
5. Create standard reusable UI components (Buttons, Modals, Cards, Navbars) with Tailwind CSS.

## 4. Future Phases Overview
- **Phase 4:** Campaign Lifecycle (Creation form, AI writer assistant, Campaign details UI).
- **Phase 5:** Donations & Profiles (Razorpay checkout UI, User dashboard).
- **Phase 6:** Admin Moderation & Quality Checker (Admin dashboard for approvals and AI Trust Score generation UI).

*(Note to Agent: If you are reading this after a restart, refer to this document as the single source of truth for the project's current state and proceed directly to Phase 3).*
