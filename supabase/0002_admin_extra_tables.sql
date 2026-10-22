-- ============================================================
--  Pickleballreads — extra tables the b2bmine admin panel expects
--  (its "Posts" and "SaaS" sections). Pickleball itself does NOT use
--  these — they stay empty — but creating them stops the admin
--  dashboard from erroring ("Could not find the table public.posts").
--  Run AFTER 0001_schema.sql, in Supabase → SQL Editor.
-- ============================================================

create extension if not exists pgcrypto;

-- ── simple taxonomies (second blog system) ──
create table if not exists public.categories (
  id   uuid primary key default gen_random_uuid(),
  name text not null unique
);

create table if not exists public.tags (
  id   uuid primary key default gen_random_uuid(),
  name text not null unique
);

-- ── posts (b2bmine's second blog system) ──
create table if not exists public.posts (
  id                 uuid primary key default gen_random_uuid(),
  title              text not null,
  slug               text not null unique,
  content            text,
  featured_image_url text,
  published          boolean default false,
  author_id          uuid references public.authors(id) on delete set null,
  excerpt            text,
  seo_title          text,
  seo_description    text,
  seo_keywords       text,
  created_at         timestamptz default now(),
  updated_at         timestamptz default now()
);

create table if not exists public.post_categories (
  post_id     uuid not null references public.posts(id) on delete cascade,
  category_id uuid not null references public.categories(id) on delete cascade,
  primary key (category_id, post_id)
);

create table if not exists public.post_tags (
  post_id uuid not null references public.posts(id) on delete cascade,
  tag_id  uuid not null references public.tags(id) on delete cascade,
  primary key (tag_id, post_id)
);

-- ── SaaS directory (b2bmine product — unused here) ──
create table if not exists public.saas_categories (
  id          text primary key,
  title       text not null,
  full_name   text not null,
  description text,
  category    text,
  color       text,
  products    integer,
  created_at  timestamptz default now(),
  updated_at  timestamptz default now()
);

create table if not exists public.saas_products (
  id                   bigint generated always as identity primary key,
  title                text not null,
  description          text,
  category             text,
  rating               numeric default 0.00,
  votes                integer default 0,
  image_url            text,
  slug                 text unique,
  saas_categories_id   text references public.saas_categories(id),
  created_at           timestamptz default now(),
  updated_at           timestamptz default now(),
  author_id            uuid references public.authors(id),
  tags                 jsonb,
  full_description     text,
  publish_date         date,
  website_url          varchar,
  is_top_project       boolean default false,
  is_promoted          boolean default false,
  seo_title            text,
  seo_description      text,
  seo_keywords         text,
  company_name         text,
  headquarters         text,
  founded_year         integer,
  features             jsonb,
  deployment_options   jsonb,
  customer_support     jsonb,
  language_support     jsonb,
  customization_level  text,
  used_by              jsonb,
  social_media         jsonb,
  alternatives         jsonb,
  screenshots          jsonb,
  faqs                 jsonb,
  about_company        text,
  integration_support  jsonb,
  security_compliance  jsonb,
  api_available        boolean default false,
  free_trial_available boolean default false,
  free_plan_available  boolean default false,
  platforms            jsonb
);

create table if not exists public.saas_pricing (
  id              uuid primary key default gen_random_uuid(),
  saas_product_id bigint not null references public.saas_products(id) on delete cascade,
  plan_name       text not null,
  plan_type       text not null,
  price           numeric,
  currency        text default 'USD',
  billing_cycle   text,
  features        jsonb,
  user_limit      integer,
  storage_limit   text,
  api_calls_limit integer,
  support_level   text,
  is_popular      boolean default false,
  is_custom       boolean default false,
  display_order   integer default 0,
  created_at      timestamptz default now(),
  updated_at      timestamptz default now()
);

create table if not exists public.saas_comparisons (
  id              uuid primary key default gen_random_uuid(),
  title           text not null,
  slug            text not null unique,
  description     text,
  custom_content  text,
  product_a_id    bigint not null references public.saas_products(id),
  product_b_id    bigint not null references public.saas_products(id),
  seo_title       text,
  seo_description text,
  seo_keywords    text,
  is_published    boolean default false,
  views_count     integer default 0,
  created_at      timestamptz default now(),
  updated_at      timestamptz default now(),
  author_id       uuid references public.authors(id),
  image_url       text
);

-- RLS: locked (no public policies). The admin panel reaches these with the
-- service_role key, which bypasses RLS; the public site never touches them.
alter table public.categories       enable row level security;
alter table public.tags             enable row level security;
alter table public.posts            enable row level security;
alter table public.post_categories  enable row level security;
alter table public.post_tags        enable row level security;
alter table public.saas_categories  enable row level security;
alter table public.saas_products    enable row level security;
alter table public.saas_pricing     enable row level security;
alter table public.saas_comparisons enable row level security;
