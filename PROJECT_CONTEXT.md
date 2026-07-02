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

## 2. Current Progress: Phases 1 to 5 & Premium UI Polish Completed
As of the latest session, **Phase 1 (Foundation)**, **Phase 2 (API Completion)**, **Phase 3 (Frontend Feed & Navigation)**, **Phase 4 (Campaign Lifecycle)**, **Phase 5 (Donations & Profiles)**, and **Premium SaaS UI Polish** are 100% complete.

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
8. **Premium SaaS UI Polish:**
   - **Typography & Layouts:** Inter font integration, tightened spacing, and high-conversion hero sections.
   - **Design Aesthetics:** Vercel/Linear inspired minimalistic approach, dropping heavy blobs/shadows for crisp components (`CampaignCard` redesign).
   - **Animations:** Fluid staggered entrances (`framer-motion`) and dynamic physics-based spring counters (`CountUp.jsx`).
   - **User Experience:** Comprehensive empty states across the application and fixed layout shifts on dynamic updates.

## 3. Phase 6.5: Project Management & Team Handoff
As the platform matures, we have transitioned into a team-based workflow:
- **AI Automation:** Created `.agents/AGENTS.md` to automatically onboard teammates' AI assistants with the project context, stack, and strict git branching rules.
- **Git Workflow:** Enforced strict branch protection on `main`. All new features (including those written by AI) must go through a feature branch (`feat/*`) and a Pull Request.
- **Branding Polish:** Integrated custom Logo and updated browser tab favicons across the frontend.

## 4. What to do next: Managing the Team
The Project Lead has transitioned from sole developer to managing the backlog via GitHub Issues. 

### Tasks Pending (Assigned to Team):
- **Phase 7 (Admin Moderation Dashboard):** User management, report handling, withdrawal approvals.
- **Additional Polish Issues:** Saved campaigns, UI tweaks, Notification Bells, and Explore Causes functionalities.

*(Note to Agent: If you are reading this after a restart, refer to this document as the single source of truth. Your primary role right now is assisting the Project Lead in managing Pull Requests, DevOps, and unblocking team members, unless explicitly asked to write code).*
