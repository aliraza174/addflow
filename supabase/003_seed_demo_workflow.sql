-- Optional demo workflow seed for dashboards/queues.
-- Run after 001 and 002 if you want real data visible immediately.

with client_user as (
  insert into public.users (name, email, password_hash, role, status)
  values (
    'Demo Client',
    'client@adflow.pro',
    '$2b$10$FA6tP2j7Y7WZl9Uud3fW9.u5hU0Y2WwYK6xF34qv0w9YpS6fyYhQa',
    'client',
    'active'
  )
  on conflict (email) do update set name = excluded.name
  returning id
),
pkg as (
  select id from public.packages where name = 'standard' limit 1
),
cat as (
  select id from public.categories where slug = 'services' limit 1
),
cty as (
  select id from public.cities where slug = 'karachi' limit 1
)
insert into public.ads (
  user_id, package_id, title, slug, category_id, city_id, description, status, publish_at, expire_at
)
select
  (select id from client_user),
  (select id from pkg),
  'Professional logo design package',
  'professional-logo-design-package',
  (select id from cat),
  (select id from cty),
  'Modern brand identity service with fast turnaround and full source files.',
  'under_review',
  null,
  null
on conflict (slug) do nothing;

insert into public.ad_media (ad_id, source_type, original_url, thumbnail_url, validation_status)
select
  a.id,
  'youtube',
  'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
  'https://img.youtube.com/vi/dQw4w9WgXcQ/hqdefault.jpg',
  'ok'
from public.ads a
where a.slug = 'professional-logo-design-package'
on conflict do nothing;

update public.ads
set status = 'payment_submitted'
where slug = 'professional-logo-design-package';

insert into public.payments (ad_id, amount, method, transaction_ref, sender_name, status)
select
  a.id,
  24.00,
  'Bank transfer',
  'TRX-ADFLOW-1001',
  'Demo Client',
  'submitted'
from public.ads a
where a.slug = 'professional-logo-design-package'
on conflict (transaction_ref) do nothing;

