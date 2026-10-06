-- =====================================================================
-- BeginTech, blog schema
--
-- Run the whole file once in the Supabase SQL Editor. It is idempotent:
-- running it again creates nothing twice and deletes no data.
--   * tables use CREATE TABLE IF NOT EXISTS
--   * functions use CREATE OR REPLACE
--   * policies/triggers are dropped-if-exists and recreated (this removes
--     only the policy/trigger definition, never rows)
--
-- Security model
--   * Every table has Row Level Security enabled.
--   * Anonymous visitors can read categories and PUBLISHED posts whose
--     published_at is in the past, nothing else.
--   * Writes require public.is_admin(): an authenticated user whose row in
--     public.profiles has role = 'admin'. Merely being signed in is not
--     enough.
--   * Nobody can make themselves an admin through the API: profiles has no
--     INSERT/UPDATE/DELETE policy for clients. Roles are granted from the
--     SQL Editor (see supabase/README.md).
-- =====================================================================

create extension if not exists pgcrypto;

-- ---------------------------------------------------------------------
-- Shared: updated_at trigger function
-- ---------------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ---------------------------------------------------------------------
-- profiles
-- ---------------------------------------------------------------------
create table if not exists public.profiles (
  id          uuid primary key references auth.users (id) on delete cascade,
  full_name   text,
  role        text not null default 'user' check (role in ('user', 'admin')),
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

comment on table public.profiles is 'One row per auth user. role = admin grants blog management.';

drop trigger if exists profiles_set_updated_at on public.profiles;
create trigger profiles_set_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

-- Every new auth user gets a non-admin profile automatically.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, coalesce(new.raw_user_meta_data ->> 'full_name', null))
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Backfill profiles for users that existed before this migration.
insert into public.profiles (id)
select u.id from auth.users u
on conflict (id) do nothing;

-- Admin check used by every write policy. SECURITY DEFINER so it can read
-- profiles regardless of the caller's own RLS visibility; search_path is
-- pinned so it cannot be hijacked.
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.profiles p
    where p.id = auth.uid() and p.role = 'admin'
  );
$$;

revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to anon, authenticated;

-- ---------------------------------------------------------------------
-- categories
-- ---------------------------------------------------------------------
create table if not exists public.categories (
  id           uuid primary key default gen_random_uuid(),
  name         text not null check (char_length(name) between 1 and 80),
  slug         text not null unique check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  description  text check (description is null or char_length(description) <= 500),
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

drop trigger if exists categories_set_updated_at on public.categories;
create trigger categories_set_updated_at
  before update on public.categories
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------
-- posts
-- ---------------------------------------------------------------------
create table if not exists public.posts (
  id               uuid primary key default gen_random_uuid(),
  title            text not null check (char_length(title) between 1 and 200),
  slug             text not null unique check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  excerpt          text check (excerpt is null or char_length(excerpt) <= 500),
  content          text not null default '',
  featured_image   text,
  -- Deleting a category keeps its posts; they just become uncategorised.
  category_id      uuid references public.categories (id) on delete set null,
  author_id        uuid references public.profiles (id) on delete set null,
  status           text not null default 'draft' check (status in ('draft', 'published')),
  published_at     timestamptz,
  seo_title        text check (seo_title is null or char_length(seo_title) <= 120),
  seo_description  text check (seo_description is null or char_length(seo_description) <= 320),
  seo_keywords     text,
  reading_time     integer check (reading_time is null or reading_time > 0),
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);

create index if not exists posts_status_idx       on public.posts (status);
create index if not exists posts_published_at_idx on public.posts (published_at desc);
create index if not exists posts_category_id_idx  on public.posts (category_id);
create index if not exists posts_author_id_idx    on public.posts (author_id);
create index if not exists posts_public_feed_idx  on public.posts (status, published_at desc);
-- slug already has a unique index from its UNIQUE constraint.

drop trigger if exists posts_set_updated_at on public.posts;
create trigger posts_set_updated_at
  before update on public.posts
  for each row execute function public.set_updated_at();

-- A post can never be "published" without a publish date.
create or replace function public.posts_set_published_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if new.status = 'published' and new.published_at is null then
    new.published_at = now();
  end if;
  return new;
end;
$$;

drop trigger if exists posts_set_published_at on public.posts;
create trigger posts_set_published_at
  before insert or update on public.posts
  for each row execute function public.posts_set_published_at();

-- ---------------------------------------------------------------------
-- Row Level Security
-- ---------------------------------------------------------------------
alter table public.profiles   enable row level security;
alter table public.categories enable row level security;
alter table public.posts      enable row level security;

-- profiles --------------------------------------------------------------
-- Visitors may only see the id + display name of someone who authored a
-- published post (enforced by the column grant below and the policy).
revoke select on public.profiles from anon;
grant select (id, full_name) on public.profiles to anon;

drop policy if exists "profiles: public reads published authors" on public.profiles;
create policy "profiles: public reads published authors"
  on public.profiles for select
  to anon
  using (
    exists (
      select 1 from public.posts p
      where p.author_id = profiles.id
        and p.status = 'published'
        and p.published_at <= now()
    )
  );

drop policy if exists "profiles: users read own, admins read all" on public.profiles;
create policy "profiles: users read own, admins read all"
  on public.profiles for select
  to authenticated
  using (id = auth.uid() or public.is_admin());

-- No insert/update/delete policies on profiles: clients cannot change roles.

-- categories ------------------------------------------------------------
drop policy if exists "categories: anyone can read" on public.categories;
create policy "categories: anyone can read"
  on public.categories for select
  to anon, authenticated
  using (true);

drop policy if exists "categories: admins insert" on public.categories;
create policy "categories: admins insert"
  on public.categories for insert
  to authenticated
  with check (public.is_admin());

drop policy if exists "categories: admins update" on public.categories;
create policy "categories: admins update"
  on public.categories for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "categories: admins delete" on public.categories;
create policy "categories: admins delete"
  on public.categories for delete
  to authenticated
  using (public.is_admin());

-- posts -----------------------------------------------------------------
drop policy if exists "posts: public reads published" on public.posts;
create policy "posts: public reads published"
  on public.posts for select
  to anon, authenticated
  using (status = 'published' and published_at <= now());

drop policy if exists "posts: admins read all" on public.posts;
create policy "posts: admins read all"
  on public.posts for select
  to authenticated
  using (public.is_admin());

drop policy if exists "posts: admins insert" on public.posts;
create policy "posts: admins insert"
  on public.posts for insert
  to authenticated
  with check (public.is_admin());

drop policy if exists "posts: admins update" on public.posts;
create policy "posts: admins update"
  on public.posts for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "posts: admins delete" on public.posts;
create policy "posts: admins delete"
  on public.posts for delete
  to authenticated
  using (public.is_admin());

-- ---------------------------------------------------------------------
-- Storage: blog-images bucket
-- Public read (served via public URL); only admins can upload/replace/delete.
-- The bucket itself enforces a 5 MB limit and an image-only MIME list.
-- ---------------------------------------------------------------------
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'blog-images',
  'blog-images',
  true,
  5242880,
  array['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/avif']
)
on conflict (id) do update
  set public = excluded.public,
      file_size_limit = excluded.file_size_limit,
      allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "blog-images: admins upload" on storage.objects;
create policy "blog-images: admins upload"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'blog-images' and public.is_admin());

drop policy if exists "blog-images: admins update" on storage.objects;
create policy "blog-images: admins update"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'blog-images' and public.is_admin())
  with check (bucket_id = 'blog-images' and public.is_admin());

drop policy if exists "blog-images: admins delete" on storage.objects;
create policy "blog-images: admins delete"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'blog-images' and public.is_admin());

-- Admins can list the bucket (the media picker needs it). Public files are
-- still served to everyone through their public URL without this policy.
drop policy if exists "blog-images: admins list" on storage.objects;
create policy "blog-images: admins list"
  on storage.objects for select
  to authenticated
  using (bucket_id = 'blog-images' and public.is_admin());
