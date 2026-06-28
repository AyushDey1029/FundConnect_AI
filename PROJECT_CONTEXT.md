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

## 2. Current Progress: Phase 1 Completed
As of the latest session, **Phase 1 (Foundation & Seeders)** is 100% complete.

### What has been built so far:
1. **MongoDB Models Created (`backend/src/models/`):**
   - `User`: Includes roles (user, admin), `isVerified`, and `savedCampaigns`.
   - `Campaign`: Includes Trust Score, Categories (Medical, Education, etc.), goal/raised amounts, deadline, and `isVerified`.
   - `CampaignUpdate`: For campaign owners to post updates.
   - `Donation`: Tracks Razorpay order IDs and payment status.
   - `Comment`: Supports nested replies (parentCommentId).
   - `Like`: Tracks campaign likes.
   - `Notification`: Tracks donations, comments, approvals, etc.
   - `Report`: For moderation (reporting campaigns/users/comments).
   - `Withdrawal`: Simplified model for admin payout approval.
2. **Database Seeding (`backend/src/scripts/seed.js`):**
   - Implemented a robust data seeder using `@faker-js/faker`.
   - The database is currently populated with 22 users, 30 campaigns, 148 donations, and 78 comments.
   - IP whitelist for MongoDB Atlas has been set to `0.0.0.0/0`.

## 3. What to do next: Phase 2
The next immediate step is to start **Phase 2: External Services & API Completion**.

### Tasks for Phase 2:
1. Implement `cloudinary.service.js` for media uploads.
2. Implement `razorpay.service.js` for payment processing.
3. Implement `openrouter.service.js` (defaulting to `gemini-2.5-flash`) for AI features.
4. Build out the remaining backend API controllers (`campaigns`, `campaignUpdates`, `donations`, `users`, `interactions`, `admin`, `ai`) so the frontend has all endpoints required.

## 4. Future Phases Overview
- **Phase 3:** Frontend Feed & Navigation (Building the social media style feed with "Load More" pagination).
- **Phase 4:** Campaign Lifecycle (Creation form, AI writer assistant, Campaign details).
- **Phase 5:** Donations & Profiles (Razorpay checkout UI, User dashboard).
- **Phase 6:** Admin Moderation & Quality Checker (Admin dashboard for approvals and AI Trust Score generation).

*(Note to Agent: If you are reading this after a restart, refer to this document as the single source of truth for the project's current state and proceed directly to Phase 2).*
