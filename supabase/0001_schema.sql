-- ============================================================
--  Pickleballreads — database schema
--  Article / blog system + admins  (matches the b2bmine admin panel
--  and the site's data layer). Run in Supabase → SQL Editor.
--
--  Reads:  the public site uses the ANON key and only sees PUBLISHED
--          articles (Row Level Security below).
--  Writes: the admin panel uses the SERVICE_ROLE key, which bypasses
--          RLS, so no write policies are needed here.
-- ============================================================

create extension if not exists pgcrypto;   -- gen_random_uuid()

-- ─────────────── authors ───────────────
create table if not exists public.authors (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  email       text not null unique,
  bio         text,
  avatar_url  text,
  created_at  timestamptz default now()
);

-- ─────────────── categories (articles) ───────────────
create table if not exists public.categories_article (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  slug        text unique,
  description text,
  created_at  timestamptz not null default now()
);

-- ─────────────── tags (articles) ───────────────
create table if not exists public.tags_article (
  id          uuid primary key default gen_random_uuid(),
  name        text not null unique,
  created_at  timestamptz not null default now()
);

-- ─────────────── articles ───────────────
create table if not exists public.article (
  id                 uuid primary key default gen_random_uuid(),
  title              text not null,
  slug               text not null unique,
  content            text,
  excerpt            text,
  featured_image_url text,
  published          boolean not null default false,
  author_id          uuid references public.authors(id) on delete set null,
  seo_title          text,
  seo_description    text,
  seo_keywords       text,
  created_at         timestamptz not null default now(),
  updated_at         timestamptz not null default now()
);
create index if not exists article_published_idx on public.article (published, created_at desc);
create index if not exists article_slug_idx       on public.article (slug);
create index if not exists article_author_idx     on public.article (author_id);

-- ─────────────── article ↔ category (M:N) ───────────────
create table if not exists public.article_categories (
  post_id     uuid not null references public.article(id)            on delete cascade,
  category_id uuid not null references public.categories_article(id) on delete cascade,
  primary key (post_id, category_id)
);
create index if not exists article_categories_cat_idx on public.article_categories (category_id);

-- ─────────────── article ↔ tag (M:N) ───────────────
create table if not exists public.article_tags (
  post_id uuid not null references public.article(id)       on delete cascade,
  tag_id  uuid not null references public.tags_article(id)  on delete cascade,
  primary key (post_id, tag_id)
);
create index if not exists article_tags_tag_idx on public.article_tags (tag_id);

-- ─────────────── admins (linked to Supabase Auth) ───────────────
create table if not exists public.admins (
  id            uuid primary key default gen_random_uuid(),
  name          text not null,
  email         text not null unique,
  password_hash text default 'managed_by_supabase_auth',
  role          text default 'admin',
  avatar_url    text,
  last_login    timestamptz,
  auth_user_id  uuid references auth.users(id) on delete cascade,
  created_at    timestamptz default now(),
  updated_at    timestamptz default now()
);

-- ─────────────── keep updated_at fresh ───────────────
create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end $$;

drop trigger if exists touch_article on public.article;
create trigger touch_article before update on public.article
  for each row execute function public.touch_updated_at();

drop trigger if exists touch_admins on public.admins;
create trigger touch_admins before update on public.admins
  for each row execute function public.touch_updated_at();

-- ============================================================
--  Row Level Security
--  Public read for the site (anon key); published articles only.
--  Admin writes go through the service_role key (bypasses RLS).
-- ============================================================
alter table public.authors            enable row level security;
alter table public.categories_article enable row level security;
alter table public.tags_article       enable row level security;
alter table public.article            enable row level security;
alter table public.article_categories enable row level security;
alter table public.article_tags       enable row level security;
alter table public.admins             enable row level security;

drop policy if exists "read published articles" on public.article;
create policy "read published articles" on public.article
  for select using (published = true);

drop policy if exists "read authors" on public.authors;
create policy "read authors" on public.authors for select using (true);

drop policy if exists "read categories" on public.categories_article;
create policy "read categories" on public.categories_article for select using (true);

drop policy if exists "read tags" on public.tags_article;
create policy "read tags" on public.tags_article for select using (true);

drop policy if exists "read article_categories" on public.article_categories;
create policy "read article_categories" on public.article_categories for select using (true);

drop policy if exists "read article_tags" on public.article_tags;
create policy "read article_tags" on public.article_tags for select using (true);

-- admins table: no public policy — only the service_role key can touch it.

-- ============================================================
--  After running this:
--  1) Supabase → Authentication → Users → "Add user" (your admin email + password).
--  2) Copy that user's UUID, then insert your admin row:
--
--     insert into public.admins (name, email, role, auth_user_id)
--     values ('Your Name', 'you@example.com', 'admin', '<auth-user-uuid>');
--
--  3) (Optional) seed the four site categories:
--
--     insert into public.categories_article (name, slug, description) values
--       ('Pickleball Basics','pickleball-basics','Fundamentals for new players.'),
--       ('Rules & Scoring','rules-scoring','How the game is played and scored.'),
--       ('Tips & Strategy','tips-strategy','Drills, tactics and shot selection.'),
--       ('Gear & Paddles','gear-paddles','Paddle reviews and equipment guides.')
--     on conflict (slug) do nothing;
-- ============================================================
