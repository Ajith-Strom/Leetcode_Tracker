# DSA Progress Tracker

A full-stack LeetCode progress tracker that goes beyond a solved-problems list: adaptive confidence-based spaced repetition, blind revision mode for honest self-testing, custom pattern tagging, and a personal playbook you can export before an interview.

## Stack

**Frontend** — Next.js 16 (App Router, Turbopack) · React 19 · TypeScript · Tailwind CSS v4 · Recharts · Vitest
**Backend** — Express · TypeScript · MySQL (`mysql2`, raw SQL migrations, no ORM) · Vitest + Supertest
**Data & infra** — Aiven (managed MySQL) · LeetCode's unofficial public GraphQL API

## Features

**Core**
- LeetCode ingestion via manual Sync (title, difficulty, tags, full question text)
- Problem list, topic-wise weak-area chart, revision-gap detection
- Approach/review notes per problem, multiple entries over time

**Adaptive revision**
- Blind Revision Mode — hides tags/difficulty/notes until you attempt it or hit Reveal, simulating real interview conditions
- Confidence-based spaced repetition — rate each review Struggled / Shaky / Satisfactory / Mastered, and the next interval adapts (3d / 7d / 14d / 30d+, doubling on repeated mastery)
- Manual reschedule — override a problem's next-review date directly; clears automatically on your next real review
- Custom pattern tagging (e.g. "Fast & Slow Pointers") layered on top of LeetCode's built-in tags

**Insight & output**
- Dashboard overview: solve count, due-for-revision count, streak, weakest topics, recent activity
- GitHub-style activity heatmap with streak stats and month labels
- Confidence-distribution donut chart and difficulty-progression-over-time chart
- Playbook exporter — compiles all review notes by topic into a one-click Markdown cheatsheet

## Setup

1. Have MySQL running (local install, Docker, or a managed instance like Aiven).
2. Copy `backend/.env.example` to `backend/.env` and fill in your DB credentials, `LEETCODE_USERNAME`, and `APP_TIMEZONE` (your local IANA timezone, e.g. `Asia/Kolkata` — used so revision due-dates/streaks are computed in your timezone rather than the DB server's).
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

### Tests

```
cd backend && npm test    # Vitest — unit tests + Supertest integration tests against a live DB
cd frontend && npm test   # Vitest — unit tests for pure logic (intervals, markdown export, date/heatmap math)
```

## Known limitation

LeetCode's public `recentAcSubmissionList` GraphQL query only returns your ~20 most recent accepted submissions, regardless of the requested limit. Sync captures that recent window plus everything solved going forward — it does not backfill your entire LeetCode history in one shot.

## Routes

- `/` — dashboard overview
- `/problems` — full problem list + Sync
- `/problems/[id]` — problem detail: question text, patterns, notes
- `/stats` — Insights: activity heatmap, confidence/difficulty charts, weak areas
- `/revision` — due-for-revision board (with Blind Mode), full schedule, manual reschedule
- `/playbook` — review notes compiled by topic, exportable to Markdown
