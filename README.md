# DSA Progress Tracker

Full-stack LeetCode progress tracker with spaced-repetition revision gaps and per-problem notes.

## Stack
- `frontend/` — Next.js (App Router, TypeScript), Recharts
- `backend/` — Express (TypeScript), MySQL (`mysql2`, raw SQL migrations)

## Setup

1. Have MySQL running locally (or via Docker: `docker run --name dsa-mysql -e MYSQL_ROOT_PASSWORD=<pw> -p 3306:3306 -d mysql:8`).
2. Copy `backend/.env.example` to `backend/.env` and fill in your DB credentials + `LEETCODE_USERNAME`.
3. Install deps and run migrations:
   ```
   cd backend
   npm install
   npm run migrate
   npm run dev
   ```
4. In another terminal:
   ```
   cd frontend
   npm install
   npm run dev
   ```
5. Open http://localhost:3000, click **Sync** to pull your recent accepted submissions from LeetCode.

## Known limitation

LeetCode's public `recentAcSubmissionList` GraphQL query only returns your ~20 most recent accepted submissions, regardless of the requested limit. Sync will capture recent history plus everything solved going forward — it will not backfill your entire LeetCode history in one shot.

## Routes

- `/` — problem list + Sync button
- `/stats` — topic-wise weak-area bar chart
- `/revision` — problems overdue for revision (configurable interval)
- `/problems/[id]` — problem detail + approach/review notes
