# Lajme Ditore — mini CMS

A single-admin news blog: log in, write daily posts with photos, manage banner
ads, all from your own dashboard. Built with Next.js (App Router) + Supabase.

## Stack

- **Next.js 14** (App Router, Server Actions, Server Components)
- **Supabase**: Postgres database, Auth (your login), Storage (photo/banner uploads)
- **Tailwind CSS** for styling
- Deploys to **Vercel**

## 1. Create the Supabase project

1. Go to [supabase.com](https://supabase.com) → New project.
2. Once it's up, open **SQL Editor** → New query, paste the entire contents
   of [`supabase/schema.sql`](./supabase/schema.sql), and run it. This creates
   every table, the RLS policies, the `media` storage bucket, and a few
   starter categories (Lajme, Politikë, Sport, Ekonomi — edit or delete as
   you like, either in the SQL or later from the database directly).
3. **Create your admin login**: Authentication → Users → Add user. Use your
   own email + a password. This is the only account that will ever exist —
   there's no public sign-up page.
4. Grab your keys: Project Settings → API.
   - `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon` `public` key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role` key → `SUPABASE_SERVICE_ROLE_KEY` (not currently used by
     the app, but kept available for any future server-only script — never
     put this in a `NEXT_PUBLIC_` variable or ship it to the browser)

## 2. Run it locally

```bash
npm install
cp .env.example .env.local   # then fill in the three Supabase values above
npm run dev
```

- Public site: http://localhost:3000
- Admin login: http://localhost:3000/admin/login (use the email/password you
  created in step 1.3)

## 3. Deploy to Vercel

1. Push this project to a GitHub repo.
2. In Vercel: New Project → import that repo.
3. Add the same three environment variables from `.env.example` in the
   Vercel project's Settings → Environment Variables.
4. Deploy. That's it — Vercel builds and hosts the Next.js app, Supabase
   hosts the database/auth/storage.

## How the pieces fit together

- **Writing a post**: `/admin/posts/new` → saved as a `draft` → you land on
  its edit page → add a cover photo, gallery photos, write the body, then
  set status to "Publikuar" and save. It appears on the homepage instantly
  (no rebuild needed — it's a live database read).
- **Photos**: uploaded straight from the browser to a Supabase Storage
  bucket called `media`, organized into `posts/...` and `ads/...` folders.
  The public URL is stored on the post/ad row.
- **Ads**: `/admin/ads/new` — upload a banner, set the destination link,
  tick which slot(s) it should appear in (homepage top, homepage sidebar,
  inside articles), optionally set a start/end date. The site checks the
  slot on every page load and shows the highest-priority active ad for it.
- **Tracking**: every time an ad banner renders, `ads.impressions` ticks up.
  Every click goes through `/api/ads/click/[id]`, which increments
  `ads.clicks` and then redirects to the real destination — so you get a
  click-through rate per ad without any third-party analytics. Post views
  work the same way via `posts.views`.
- **Auth**: middleware (`middleware.ts`) checks your Supabase session on
  every request to `/admin/*` and bounces anyone without one to
  `/admin/login`. There's no separate "roles" system since it's just you.

## Adding a new ad slot later

Slots are just strings, defined in one place: `lib/ad-slots.ts`. To add a new
spot for ads (say, a slot inside category pages):

1. Add `{ value: "category-inline", label: "Brenda kategorisë" }` to `AD_SLOTS`.
2. Drop `<AdBanner slot="category-inline" />` wherever you want it to render,
   e.g. in `app/kategori/[slug]/page.tsx`.
3. It'll show up as a checkbox option in the ad editor immediately.

## Notes on what's intentionally simple (for a v1)

- **Post body is plain text**, not a rich-text editor — a blank line starts
  a new paragraph. This was a deliberate tradeoff to avoid pulling in a
  WYSIWYG editor and having to sanitize arbitrary HTML for a single-admin
  site. If you later want bold/links/embedded images inline, swapping in an
  editor like Tiptap and switching `PostBody` to render sanitized HTML is a
  contained change (`components` + `app/post/[slug]/page.tsx`).
- **One admin, one role.** If you ever bring on a second writer, Supabase
  Auth already supports multiple users — you'd just add a `role` column and
  a bit of UI to scope what non-admins can edit.
- **No comments/newsletter/RSS yet** — not asked for, but the data model
  (one `posts` table, slugs, categories) is normal enough that any of those
  bolt on without a redesign.
