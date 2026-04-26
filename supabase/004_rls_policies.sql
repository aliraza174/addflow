-- Optional RLS policies for production hardening.
-- This project currently uses server-side service role for privileged operations,
-- so these are optional but recommended for future client-side Supabase reads.

alter table public.users enable row level security;
alter table public.ads enable row level security;
alter table public.payments enable row level security;
alter table public.notifications enable row level security;
alter table public.ad_status_history enable row level security;
alter table public.audit_logs enable row level security;

-- Read own user record
drop policy if exists users_select_self on public.users;
create policy users_select_self on public.users
for select using (auth.jwt() ->> 'email' = email);

-- Client can read own ads
drop policy if exists ads_select_own on public.ads;
create policy ads_select_own on public.ads
for select using (
  exists (
    select 1 from public.users u
    where u.id = ads.user_id
      and u.email = (auth.jwt() ->> 'email')
  )
);

-- Public can read published ads
drop policy if exists ads_select_published on public.ads;
create policy ads_select_published on public.ads
for select using (status = 'published');

-- Client can insert own ads
drop policy if exists ads_insert_own on public.ads;
create policy ads_insert_own on public.ads
for insert with check (
  exists (
    select 1 from public.users u
    where u.id = ads.user_id
      and u.email = (auth.jwt() ->> 'email')
      and u.role = 'client'
  )
);

-- Client can see own notifications
drop policy if exists notifications_select_own on public.notifications;
create policy notifications_select_own on public.notifications
for select using (
  exists (
    select 1 from public.users u
    where u.id = notifications.user_id
      and u.email = (auth.jwt() ->> 'email')
  )
);

