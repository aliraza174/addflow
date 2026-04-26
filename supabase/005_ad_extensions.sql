-- AdFlow Pro extensions migration

-- 1. Extend ads table
alter table public.ads
  add column if not exists subcategory_id uuid references public.categories(id),
  add column if not exists tags text[] default '{}',
  add column if not exists condition text,
  add column if not exists price numeric(10,2),
  add column if not exists negotiable boolean default false,
  add column if not exists quantity int default 1,
  add column if not exists region text,
  add column if not exists address text,
  add column if not exists latitude numeric(10,7),
  add column if not exists longitude numeric(10,7),
  add column if not exists attributes jsonb default '{}'::jsonb,
  add column if not exists view_count int default 0;

-- 2. Extend seller_profiles table
alter table public.seller_profiles
  add column if not exists whatsapp_number text,
  add column if not exists public_email text,
  add column if not exists avatar_url text,
  add column if not exists response_rate numeric(5,2),
  add column if not exists response_time text;

-- 3. Create saved_ads table
create table if not exists public.saved_ads (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  ad_id uuid not null references public.ads(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (user_id, ad_id)
);

-- 4. Create reports table
create table if not exists public.reports (
  id uuid primary key default gen_random_uuid(),
  reporter_id uuid references public.users(id) on delete set null,
  ad_id uuid not null references public.ads(id) on delete cascade,
  reason text not null,
  details text,
  status text not null default 'pending',
  created_at timestamptz not null default now()
);

-- 5. Helpful indexes
create index if not exists idx_saved_ads_user on public.saved_ads(user_id);
create index if not exists idx_reports_ad on public.reports(ad_id);
