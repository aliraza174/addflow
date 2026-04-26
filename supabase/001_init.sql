-- AdFlow Pro initial schema (run in Supabase SQL Editor)
-- Step 1: enable extension
create extension if not exists "pgcrypto";

-- Step 2: enums
do $$ begin
  create type app_role as enum ('client', 'moderator', 'admin', 'super_admin');
exception when duplicate_object then null; end $$;

do $$ begin
  create type ad_status as enum (
    'draft',
    'submitted',
    'under_review',
    'payment_pending',
    'payment_submitted',
    'payment_verified',
    'scheduled',
    'published',
    'expired',
    'archived',
    'rejected'
  );
exception when duplicate_object then null; end $$;

do $$ begin
  create type payment_status as enum ('submitted', 'verified', 'rejected');
exception when duplicate_object then null; end $$;

-- Step 3: core tables
create table if not exists public.users (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text unique not null,
  password_hash text not null,
  role app_role not null default 'client',
  status text not null default 'active',
  created_at timestamptz not null default now()
);

create table if not exists public.seller_profiles (
  user_id uuid primary key references public.users(id) on delete cascade,
  display_name text not null,
  business_name text,
  phone text,
  city text,
  is_verified boolean not null default false
);

create table if not exists public.packages (
  id uuid primary key default gen_random_uuid(),
  name text unique not null,
  duration_days int not null check (duration_days > 0),
  weight int not null check (weight > 0),
  is_featured boolean not null default false,
  price numeric(10,2) not null check (price >= 0)
);

create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique not null,
  is_active boolean not null default true
);

create table if not exists public.cities (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique not null,
  is_active boolean not null default true
);

create table if not exists public.ads (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  package_id uuid references public.packages(id),
  title text not null,
  slug text unique not null,
  category_id uuid references public.categories(id),
  city_id uuid references public.cities(id),
  description text not null,
  status ad_status not null default 'draft',
  featured boolean not null default false,
  admin_boost int not null default 0,
  publish_at timestamptz,
  expire_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.ad_media (
  id uuid primary key default gen_random_uuid(),
  ad_id uuid not null references public.ads(id) on delete cascade,
  source_type text not null,
  original_url text not null,
  thumbnail_url text not null,
  validation_status text not null default 'ok'
);

create table if not exists public.payments (
  id uuid primary key default gen_random_uuid(),
  ad_id uuid not null references public.ads(id) on delete cascade,
  amount numeric(10,2) not null check (amount >= 0),
  method text not null,
  transaction_ref text not null,
  sender_name text,
  screenshot_url text,
  status payment_status not null default 'submitted',
  created_at timestamptz not null default now(),
  unique (transaction_ref)
);

create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  title text not null,
  message text not null,
  type text not null default 'info',
  is_read boolean not null default false,
  link text,
  created_at timestamptz not null default now()
);

create table if not exists public.audit_logs (
  id uuid primary key default gen_random_uuid(),
  actor_id uuid references public.users(id),
  action_type text not null,
  target_type text not null,
  target_id text not null,
  old_value jsonb,
  new_value jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.ad_status_history (
  id uuid primary key default gen_random_uuid(),
  ad_id uuid not null references public.ads(id) on delete cascade,
  previous_status ad_status,
  new_status ad_status not null,
  changed_by uuid references public.users(id),
  note text,
  changed_at timestamptz not null default now()
);

create table if not exists public.learning_questions (
  id uuid primary key default gen_random_uuid(),
  question text not null,
  answer text not null,
  topic text,
  difficulty text,
  is_active boolean not null default true
);

create table if not exists public.system_health_logs (
  id uuid primary key default gen_random_uuid(),
  source text not null,
  response_ms int,
  checked_at timestamptz not null default now(),
  status text not null
);

-- Step 4: default packages and taxonomy
insert into public.packages (name, duration_days, weight, is_featured, price)
values
  ('basic', 7, 1, false, 9),
  ('standard', 15, 2, false, 24),
  ('premium', 30, 3, true, 59)
on conflict (name) do nothing;

insert into public.categories (name, slug) values
  ('Services', 'services'),
  ('Real Estate', 'real-estate'),
  ('Jobs', 'jobs'),
  ('Electronics', 'electronics'),
  ('Vehicles', 'vehicles'),
  ('Education', 'education')
on conflict (slug) do nothing;

insert into public.cities (name, slug) values
  ('Karachi', 'karachi'),
  ('Lahore', 'lahore'),
  ('Islamabad', 'islamabad'),
  ('Multan', 'multan'),
  ('Faisalabad', 'faisalabad')
on conflict (slug) do nothing;

insert into public.learning_questions (question, answer, topic, difficulty, is_active) values
  (
    'How does ranking differ from newest-first sorting?',
    'Ranking adds package weight, featured boost, freshness, and admin boosts.',
    'ranking',
    'medium',
    true
  ),
  (
    'Why hide expired ads from public results?',
    'To keep trust and prevent stale listings from polluting search results.',
    'workflow',
    'easy',
    true
  )
on conflict do nothing;

-- Step 5: useful indexes
create index if not exists idx_ads_status on public.ads(status);
create index if not exists idx_ads_publish_at on public.ads(publish_at);
create index if not exists idx_ads_expire_at on public.ads(expire_at);
create index if not exists idx_ads_category_city on public.ads(category_id, city_id);
create index if not exists idx_notifications_user on public.notifications(user_id, created_at desc);

