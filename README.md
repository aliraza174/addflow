# AdFlow Pro

Production-style sponsored listing marketplace with moderation, package-based ranking, payment verification workflow, scheduling/expiry automation, and analytics dashboards.

## Current Status

- Premium UI shell + public pages (landing, explore, ad detail, packages, policy pages)
- Role-protected auth flow (currently mock-cookie based)
- Client / Moderator / Admin / Super Admin dashboards
- Domain logic implemented:
  - lifecycle transitions
  - external media normalization (YouTube/image/fallback)
  - rank score + active-only search/filter/pagination
  - cron-like publish/expire actions
- Mock API routes available:
  - `GET /api/ads`
  - `GET /api/ads/:slug`
  - `GET /api/packages`
  - `GET /api/questions/random`
  - `GET /api/health/db`
  - `POST /api/cron/publish-scheduled`
  - `POST /api/cron/expire-ads`

## Local Run

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Supabase Setup (Step-by-Step)

### 1) Create project
- Create a new Supabase project.
- Wait until DB is provisioned.

### 2) Run SQL schema
- Open Supabase **SQL Editor**.
- Paste and run: `supabase/001_init.sql`.
- Then run: `supabase/002_seed_roles.sql` (adds moderator/admin demo users).
- Optional demo data: `supabase/003_seed_demo_workflow.sql`.
- Optional hardening: `supabase/004_rls_policies.sql`.

### 3) Collect keys
- In Supabase Project Settings > API copy:
  - Project URL
  - Anon key
  - Service role key

### 4) Configure environment
- Copy `.env.example` to `.env.local`.
- Fill:
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - `SUPABASE_SERVICE_ROLE_KEY`

### 5) Share keys when prompted
- Share URL + anon first.
- Share service role key when backend write/cron integration starts.

## SQL You Need to Run in Supabase

Run this exact file:
- `supabase/001_init.sql`
- `supabase/002_seed_roles.sql`
- `supabase/003_seed_demo_workflow.sql` (optional)
- `supabase/004_rls_policies.sql` (optional)

It includes:
- enums for role/status/payment
- core workflow tables
- constraints + indexes
- starter seed rows (packages/categories/cities/questions)
"# addfow" 
