-- ============================================================================
-- news-cms database schema
-- Run this once in the Supabase SQL editor (Project → SQL Editor → New query)
-- ============================================================================

create extension if not exists "pgcrypto"; -- gives us gen_random_uuid()

-- ----------------------------------------------------------------------------
-- CATEGORIES
-- ----------------------------------------------------------------------------
create table if not exists categories (
  id         uuid primary key default gen_random_uuid(),
  name       text not null,
  slug       text not null unique,
  created_at timestamptz not null default now()
);

-- ----------------------------------------------------------------------------
-- POSTS
-- ----------------------------------------------------------------------------
create table if not exists posts (
  id               uuid primary key default gen_random_uuid(),
  category_id      uuid references categories(id) on delete set null,
  title            text not null,
  slug             text not null unique,
  excerpt          text,
  body             text not null,          -- HTML/markdown from the editor
  cover_image_url  text,                    -- main photo shown in listings
  status           text not null default 'draft' check (status in ('draft', 'published')),
  views            integer not null default 0,
  published_at     timestamptz,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);

create index if not exists posts_status_published_idx on posts (status, published_at desc);
create index if not exists posts_category_idx on posts (category_id);

-- ----------------------------------------------------------------------------
-- POST_IMAGES  (extra photos inside a post's gallery/body, beyond the cover)
-- ----------------------------------------------------------------------------
create table if not exists post_images (
  id         uuid primary key default gen_random_uuid(),
  post_id    uuid not null references posts(id) on delete cascade,
  image_url  text not null,
  caption    text,
  position   integer not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists post_images_post_idx on post_images (post_id);

-- ----------------------------------------------------------------------------
-- ADS  (a banner creative — the image + where it links)
-- ----------------------------------------------------------------------------
create table if not exists ads (
  id               uuid primary key default gen_random_uuid(),
  advertiser_name  text not null,
  image_url        text not null,
  link_url         text not null,
  active           boolean not null default true,
  starts_at        date,
  ends_at          date,
  impressions      integer not null default 0,
  clicks           integer not null default 0,
  created_at       timestamptz not null default now()
);

-- ----------------------------------------------------------------------------
-- AD_PLACEMENTS  (which slot(s) an ad runs in, and in what priority order)
-- slot_name examples: 'homepage-top', 'homepage-sidebar', 'article-inline'
-- ----------------------------------------------------------------------------
create table if not exists ad_placements (
  id         uuid primary key default gen_random_uuid(),
  ad_id      uuid not null references ads(id) on delete cascade,
  slot_name  text not null,
  priority   integer not null default 0, -- higher = shown first when multiple ads share a slot
  created_at timestamptz not null default now()
);

create index if not exists ad_placements_slot_idx on ad_placements (slot_name, priority desc);

-- ----------------------------------------------------------------------------
-- ATOMIC COUNTERS
-- Using RPC functions instead of "read, add 1, write" from the app avoids a
-- race condition when two requests land at the same instant (e.g. two readers
-- opening the same article, or a burst of ad impressions).
-- ----------------------------------------------------------------------------
create or replace function increment_post_views(p_post_id uuid)
returns void as $$
  update posts set views = views + 1 where id = p_post_id;
$$ language sql;

create or replace function increment_ad_impressions(p_ad_id uuid)
returns void as $$
  update ads set impressions = impressions + 1 where id = p_ad_id;
$$ language sql;

create or replace function increment_ad_clicks(p_ad_id uuid)
returns void as $$
  update ads set clicks = clicks + 1 where id = p_ad_id;
$$ language sql;

-- ----------------------------------------------------------------------------
-- updated_at auto-touch on posts
-- ----------------------------------------------------------------------------
create or replace function touch_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists posts_touch_updated_at on posts;
create trigger posts_touch_updated_at
  before update on posts
  for each row execute function touch_updated_at();

-- ============================================================================
-- ROW LEVEL SECURITY
--
-- This is a single-admin CMS: you (the one authenticated Supabase user) can
-- read/write everything. The public site only ever reads published content
-- through the anon key, and only ever writes via the two counter RPCs above.
-- ============================================================================

alter table categories    enable row level security;
alter table posts         enable row level security;
alter table post_images   enable row level security;
alter table ads           enable row level security;
alter table ad_placements enable row level security;

-- Public (anon key) can read categories freely
create policy "categories are publicly readable"
  on categories for select
  using (true);

-- Public can only read PUBLISHED posts
create policy "published posts are publicly readable"
  on posts for select
  using (status = 'published');

-- Public can read images belonging to published posts
create policy "images of published posts are publicly readable"
  on post_images for select
  using (
    exists (
      select 1 from posts
      where posts.id = post_images.post_id
      and posts.status = 'published'
    )
  );

-- Public can read active ads (the app additionally filters by start/end date)
create policy "active ads are publicly readable"
  on ads for select
  using (active = true);

create policy "ad placements are publicly readable"
  on ad_placements for select
  using (true);

-- Authenticated (you, logged into /admin) can do everything on every table
create policy "authenticated full access to categories"
  on categories for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

create policy "authenticated full access to posts"
  on posts for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

create policy "authenticated full access to post_images"
  on post_images for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

create policy "authenticated full access to ads"
  on ads for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

create policy "authenticated full access to ad_placements"
  on ad_placements for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

-- ============================================================================
-- STORAGE  (photo + banner uploads)
-- Creates a public bucket called "media". Public READ (so images render on
-- the site without signed URLs), but only authenticated (you) can upload.
-- ============================================================================

insert into storage.buckets (id, name, public)
values ('media', 'media', true)
on conflict (id) do nothing;

create policy "media is publicly readable"
  on storage.objects for select
  using (bucket_id = 'media');

create policy "authenticated can upload media"
  on storage.objects for insert
  with check (bucket_id = 'media' and auth.role() = 'authenticated');

create policy "authenticated can update media"
  on storage.objects for update
  using (bucket_id = 'media' and auth.role() = 'authenticated');

create policy "authenticated can delete media"
  on storage.objects for delete
  using (bucket_id = 'media' and auth.role() = 'authenticated');

-- ============================================================================
-- SEED DATA (a few starter categories — edit freely, or delete this block)
-- ============================================================================

insert into categories (name, slug) values
  ('Lajme', 'lajme'),
  ('Politikë', 'politike'),
  ('Sport', 'sport'),
  ('Ekonomi', 'ekonomi')
on conflict (slug) do nothing;
