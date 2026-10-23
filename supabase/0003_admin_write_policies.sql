-- ============================================================
--  0003_admin_write_policies.sql
--  Lets a logged-in admin (matched by email in public.admins,
--  exactly how the admin panel's auth-context identifies them)
--  INSERT / UPDATE / DELETE on all content tables, and read
--  unpublished (draft) articles. Public still only reads
--  published content. Run this in Supabase -> SQL Editor.
-- ============================================================

-- Helper: is the current logged-in user a registered admin?
-- SECURITY DEFINER so it can check public.admins without being
-- blocked by that table's own RLS.
create or replace function public.is_admin()
returns boolean
language sql
security definer
stable
set search_path = public
as $$
  select exists (
    select 1 from public.admins
    where lower(email) = lower(auth.jwt() ->> 'email')
  );
$$;

-- Let a logged-in admin read their own admins row (profile load)
drop policy if exists "admin reads own row" on public.admins;
create policy "admin reads own row" on public.admins
  for select to authenticated
  using ( lower(email) = lower(auth.jwt() ->> 'email') );

-- Admins can read ALL articles, including drafts (panel listing)
drop policy if exists "admin read all articles" on public.article;
create policy "admin read all articles" on public.article
  for select to authenticated
  using ( public.is_admin() );

-- Full write access for logged-in admins on every content table
drop policy if exists "admin write authors" on public.authors;
create policy "admin write authors" on public.authors
  for all to authenticated
  using ( public.is_admin() ) with check ( public.is_admin() );

drop policy if exists "admin write categories" on public.categories_article;
create policy "admin write categories" on public.categories_article
  for all to authenticated
  using ( public.is_admin() ) with check ( public.is_admin() );

drop policy if exists "admin write tags" on public.tags_article;
create policy "admin write tags" on public.tags_article
  for all to authenticated
  using ( public.is_admin() ) with check ( public.is_admin() );

drop policy if exists "admin write article" on public.article;
create policy "admin write article" on public.article
  for all to authenticated
  using ( public.is_admin() ) with check ( public.is_admin() );

drop policy if exists "admin write article_categories" on public.article_categories;
create policy "admin write article_categories" on public.article_categories
  for all to authenticated
  using ( public.is_admin() ) with check ( public.is_admin() );

drop policy if exists "admin write article_tags" on public.article_tags;
create policy "admin write article_tags" on public.article_tags
  for all to authenticated
  using ( public.is_admin() ) with check ( public.is_admin() );

-- Admins can manage the admins table (add / edit other admins)
drop policy if exists "admin write admins" on public.admins;
create policy "admin write admins" on public.admins
  for all to authenticated
  using ( public.is_admin() ) with check ( public.is_admin() );
