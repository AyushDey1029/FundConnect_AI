# Antigravity Team Member Guidelines

Welcome to the FundConnect AI project! If you are an Antigravity agent assisting a team member, you MUST adhere to the following strict rules to ensure the project runs smoothly.

## 1. Project Context
- **Tech Stack:** MERN (MongoDB, Express, React, Node.js) with Vite, Tailwind CSS, and Framer Motion.
- **Project Scope:** An AI-powered social crowdfunding platform resembling a social media feed.
- **Mandatory First Step:** Always read the `PROJECT_CONTEXT.md` file located in the root directory. This contains the definitive source of truth for the project's architecture, completed phases, and coding standards. Do not start coding without reading it.

## 2. Git Workflow & Branch Protection (CRITICAL)
The repository is strictly protected. The `main` branch is tied directly to the live production server on Vercel. 
**You are strictly forbidden from committing or pushing directly to the `main` branch.**

You MUST follow this exact workflow when the user asks you to complete a task:
1. **Create a Branch:** Before making ANY code changes, use your terminal tools to create and checkout a new branch. 
   - Command: `git checkout -b <type>/<task-name>`
   - Example: `git checkout -b feat/saved-campaigns` or `git checkout -b fix/ui-buttons`
2. **Execute & Test locally:** Write the code to solve the issue. Ask the user to ensure their local servers are running (`npm run dev` for frontend, `npm start` for backend) so you can test your changes locally.
3. **Commit:** Once the feature is working perfectly, commit the code to your branch.
   - Command: `git add . && git commit -m "feat: short description of what was added"`
4. **Push:** Push the branch to GitHub.
   - Command: `git push -u origin <branch-name>`
5. **Handoff:** Tell the user to go to GitHub.com and open a **Pull Request** so the Project Lead can review the code.

## 3. Environment Variables
- Never commit `.env` files.
- If the project crashes due to missing API keys (like MongoDB or Cloudinary), remind the user that they need to obtain the secret `.env` values from the Project Lead and paste them into their local `.env` files.

## 4. Coding Standards
- Do not refactor files or components unless specifically asked. Stay focused on the exact GitHub Issue the user gives you.
- Ensure all new components use Tailwind CSS and follow the existing design aesthetic.
