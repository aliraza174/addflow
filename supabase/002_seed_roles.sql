-- Create professional demo accounts for moderator/admin.
-- Run after 001_init.sql in Supabase SQL Editor.
-- Password for these demo accounts: Change immediately in production.

insert into public.users (name, email, password_hash, role, status)
values
  ('System Moderator', 'moderator@adflow.pro', '$2b$10$JjcidQhmaFwTOcxmaWXLceCdJyPXmvQcomH1IA.RQuIECN.nvdQbC', 'moderator', 'active'),
  ('Platform Admin', 'admin@adflow.pro', '$2b$10$JjcidQhmaFwTOcxmaWXLceCdJyPXmvQcomH1IA.RQuIECN.nvdQbC', 'admin', 'active')
on conflict (email) do update
set
  role = excluded.role,
  name = excluded.name,
  status = excluded.status,
  password_hash = excluded.password_hash;

-- The bcrypt hash above corresponds to: password123
-- You should rotate these credentials after first login.

