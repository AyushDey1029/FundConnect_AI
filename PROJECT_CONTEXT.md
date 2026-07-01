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

## 2. Current Progress: Phases 1 to 5 Completed
As of the latest session, **Phase 1 (Foundation)**, **Phase 2 (API Completion)**, **Phase 3 (Frontend Feed & Navigation)**, **Phase 4 (Campaign Lifecycle)**, and **Phase 5 (Donations & Profiles)** are 100% complete.

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
   - **Donations:** Secure, idempotent intent creation and signature verification flow.
   - **Interactions:** Comments (with nested replies) and Likes.
   - **Users & Notifications:** Profile management, saved campaigns, and real-time styled notifications system.
   - **Admin:** Moderation capabilities for users, reports, campaigns, and withdrawals.
   - **AI:** Trust Score evaluation endpoint (`evaluateCampaign`), AI rewrite, and summarization endpoints.
5. **Frontend Core (React + Vite):**
   - Routing and pages for Feed, Campaign Details, Profile, Authentication.
   - Core Social Media style feed component.
   - Reusable UI components (layout, ui, common).
6. **Campaign Lifecycle UI:**
   - 4-step Campaign Creation Wizard with validation and media uploads (Cloudinary).
   - AI Writer Assistant integrated into the creation flow (OpenRouter).
   - Comprehensive Campaign Details UI with story, updates, comments, donations, and AI Trust Summary.
7. **Donations & Profiles UI:**
   - **My Campaigns Dashboard:** Analytics and management for campaign creators.
   - **Razorpay Checkout:** Secure, responsive checkout modal with custom and preset amounts.
   - **Donation History:** Table view of all user donations with downloadable receipts.

## 3. What to do next: Phase 6
We are currently entering **Phase 6: Admin Moderation & Quality Checker**.

### Tasks for Phase 6:
1. Build the Admin Dashboard for user and campaign moderation.
2. Implement the AI Trust Score generation UI to allow admins to evaluate campaigns.
3. Integrate report management and withdrawal approvals.

## 4. Future Phases Overview
- **Phase 7:** Final Polish & Deployment Preparation.

*(Note to Agent: If you are reading this after a restart, refer to this document as the single source of truth for the project's current state and proceed directly to Phase 6).*
