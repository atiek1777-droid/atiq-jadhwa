-- ATIQ AL-JADHWA PLATFORM — SCHEMA
-- Postgres / Supabase. Run in the Supabase SQL editor or via `supabase db push`.

create extension if not exists "pgcrypto";

-- ─────────────────────────────────────────────
-- PROFILES (admin users; Supabase Auth extension)
-- ─────────────────────────────────────────────
create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  role text not null default 'editor' check (role in ('owner', 'editor')),
  created_at timestamptz not null default now()
);

-- ─────────────────────────────────────────────
-- PROJECTS
-- ─────────────────────────────────────────────
create table if not exists projects (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title_ar text not null,
  title_en text not null,
  category text[] not null default '{}',
  industry text,
  short_description_ar text,
  short_description_en text,
  role text,
  services text[] default '{}',
  project_date date,
  cover_image text,
  external_url text,
  challenge text,
  approach text,
  solution text,
  outcome text,
  tools text[] default '{}',
  featured boolean not null default false,
  published boolean not null default false,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists project_images (
  id uuid primary key default gen_random_uuid(),
  project_id uuid references projects(id) on delete cascade,
  image_url text not null,
  alt_text text,
  orientation text check (orientation in ('landscape', 'portrait', 'square')),
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

-- ─────────────────────────────────────────────
-- SERVICES
-- ─────────────────────────────────────────────
create table if not exists services (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  pillar text check (pillar in ('build', 'improve', 'grow')),
  title_ar text not null,
  title_en text not null,
  description_ar text,
  description_en text,
  sort_order int not null default 0,
  published boolean not null default true,
  created_at timestamptz not null default now()
);

-- ─────────────────────────────────────────────
-- RESTAURANT SOLUTIONS (framework areas)
-- ─────────────────────────────────────────────
create table if not exists restaurant_solutions (
  id uuid primary key default gen_random_uuid(),
  stage text check (stage in ('diagnose', 'cost', 'control', 'organize', 'improve', 'grow')),
  title_ar text not null,
  title_en text not null,
  description_ar text,
  description_en text,
  sort_order int not null default 0,
  published boolean not null default true,
  created_at timestamptz not null default now()
);

-- ─────────────────────────────────────────────
-- ARTICLES (Insights)
-- ─────────────────────────────────────────────
create table if not exists articles (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title_ar text not null,
  title_en text not null,
  excerpt_ar text,
  excerpt_en text,
  body_ar text,
  body_en text,
  cover_image text,
  published boolean not null default false,
  published_at timestamptz,
  created_at timestamptz not null default now()
);

-- ─────────────────────────────────────────────
-- MEDIA LIBRARY
-- ─────────────────────────────────────────────
create table if not exists media (
  id uuid primary key default gen_random_uuid(),
  url text not null,
  alt_text text,
  width int,
  height int,
  orientation text check (orientation in ('landscape', 'portrait', 'square')),
  source_note text, -- e.g. "unassigned: image relationship not confirmed"
  assigned_project_id uuid references projects(id) on delete set null,
  created_at timestamptz not null default now()
);

-- ─────────────────────────────────────────────
-- CONTACT SUBMISSIONS
-- ─────────────────────────────────────────────
create table if not exists contact_submissions (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  message text not null,
  locale text default 'ar',
  source text default 'contact_form',
  created_at timestamptz not null default now()
);

-- ─────────────────────────────────────────────
-- SITE SETTINGS / HOMEPAGE / SOCIAL (key-value CMS)
-- ─────────────────────────────────────────────
create table if not exists site_settings (
  key text primary key,
  value jsonb not null,
  updated_at timestamptz not null default now()
);

create table if not exists homepage_sections (
  id uuid primary key default gen_random_uuid(),
  section_key text unique not null, -- 'hero', 'framework', 'capabilities', etc.
  content jsonb not null default '{}',
  sort_order int not null default 0,
  visible boolean not null default true
);

create table if not exists social_links (
  id uuid primary key default gen_random_uuid(),
  platform text not null,
  url text not null,
  sort_order int not null default 0
);

-- ─────────────────────────────────────────────
-- AI: SESSIONS / MESSAGES / LEADS / FEEDBACK
-- ─────────────────────────────────────────────
create table if not exists ai_sessions (
  id uuid primary key default gen_random_uuid(),
  locale text default 'ar',
  source text default 'website',
  created_at timestamptz not null default now()
);

create table if not exists ai_messages (
  id uuid primary key default gen_random_uuid(),
  session_id uuid references ai_sessions(id) on delete cascade,
  role text not null check (role in ('user', 'assistant')),
  content text not null,
  created_at timestamptz not null default now()
);

create table if not exists ai_leads (
  id uuid primary key default gen_random_uuid(),
  session_id uuid references ai_sessions(id) on delete set null,
  name text,
  phone text,
  business_type text,
  summary text,
  status text default 'new' check (status in ('new', 'contacted', 'closed')),
  created_at timestamptz not null default now()
);

create table if not exists ai_feedback (
  id uuid primary key default gen_random_uuid(),
  message_id uuid references ai_messages(id) on delete cascade,
  rating int check (rating in (-1, 1)),
  note text,
  created_at timestamptz not null default now()
);

-- ─────────────────────────────────────────────
-- AI: KNOWLEDGE BASE (CMS-editable, structured — not one giant prompt)
-- ─────────────────────────────────────────────
create table if not exists ai_knowledge (
  id uuid primary key default gen_random_uuid(),
  domain text not null check (domain in
    ('profile', 'services', 'restaurant_solutions', 'projects', 'nextra_ai', 'policies', 'assistant_rules')),
  key text not null,
  content_ar text,
  content_en text,
  updated_at timestamptz not null default now(),
  unique (domain, key)
);

create table if not exists ai_faqs (
  id uuid primary key default gen_random_uuid(),
  question_ar text not null,
  question_en text not null,
  answer_ar text not null,
  answer_en text not null,
  sort_order int not null default 0,
  published boolean not null default true
);

-- updated_at trigger helper
create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists trg_projects_updated on projects;
create trigger trg_projects_updated before update on projects
  for each row execute function set_updated_at();
