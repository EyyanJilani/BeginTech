# BeginTech blog — Supabase setup

The blog and admin dashboard use Supabase for the database, authentication
and image storage. The website itself is a static Vite app, so **all security
is enforced inside Supabase** by Row Level Security (RLS) and the
`public.is_admin()` function — not by the browser.

| File | Purpose |
|---|---|
| `blog_schema.sql` | Tables, indexes, triggers, RLS policies, `blog-images` storage bucket. **Run this.** |
| `seed.sql` | Optional sample categories + 3 published sample posts + 1 draft, for testing. |

---

## 1. Create the schema

1. Open the Supabase dashboard → your project → **SQL Editor** → **New query**.
2. Paste the **entire** contents of `supabase/blog_schema.sql`.
3. Click **Run**. It should finish with "Success. No rows returned".

The script is safe to run again later: it never drops tables or deletes rows.

## 2. (Optional) Load sample data

Only for testing — the sample posts are live on `/blog` once loaded.

1. SQL Editor → New query → paste `supabase/seed.sql` → **Run**.
2. Remove the sample posts when you're done:

   ```sql
   delete from public.posts where slug like 'sample-%';
   ```

## 3. Lock down sign-ups (recommended)

Only you should have accounts. In **Authentication → Sign In / Providers**
(called *Providers → Email* in some dashboard versions), turn **off** "Allow
new users to sign up". Even if someone did sign up, they would get
`role = 'user'` and no access — but there is no reason to allow it.

## 4. Create the first admin

1. **Authentication → Users → Add user → Create new user.**
   Enter your email and a strong password, and tick **Auto Confirm User**.
2. Copy the new user's **UID** from the users table (click the user to see it).
3. SQL Editor → New query → run (replace both values):

   ```sql
   insert into public.profiles (id, full_name, role)
   values ('PASTE-USER-UID-HERE', 'Your Name', 'admin')
   on conflict (id) do update
     set role = 'admin', full_name = excluded.full_name;
   ```

   A profile row is created automatically for every new user (with
   `role = 'user'`); this statement promotes it to admin. `full_name` is shown
   as the author on published posts.
4. Check it worked:

   ```sql
   select id, full_name, role from public.profiles;
   ```

To remove admin access later: `update public.profiles set role = 'user' where id = '…';`

## 5. Log in

- Local: run `npm run dev`, open <http://localhost:5173/admin> → you are sent to
  `/admin/login` → sign in with the email/password from step 4.
- Production: <https://begintech.co/admin>.

## 6. Publishing and the sitemap

Published posts are visible on `/blog` **immediately** (the page reads from
Supabase in the browser). Their prerendered HTML and their `sitemap.xml`
entries are generated at **build time**, so a new post reaches the sitemap on
the next deploy. To make that automatic:

1. Vercel → Project → **Settings → Git → Deploy Hooks** → create a hook
   (branch `main`) and copy its URL.
2. Supabase → **Database → Webhooks → Create a new hook**:
   - Table: `public.posts`, events: **Insert, Update, Delete**
   - Type: **HTTP Request**, method **POST**, URL: the Vercel deploy hook URL.

Every create/edit/publish/delete then triggers a rebuild (about 1–2 minutes).
Keep the deploy hook URL private — anyone with it can trigger builds.

## Security summary

- RLS is enabled on `profiles`, `categories` and `posts`.
- Visitors (`anon`) can read categories, **published** posts whose
  `published_at` is in the past, and the display name of their authors — nothing else.
- Every insert/update/delete — and reading drafts — requires
  `public.is_admin()`: a signed-in user whose profile has `role = 'admin'`.
- Clients cannot change `profiles` at all, so nobody can promote themselves.
- Storage: `blog-images` is publicly readable; only admins can upload,
  replace or delete. The bucket rejects non-images and files over 5 MB.
- The site only uses the **publishable** key. The service-role / secret key is
  not used anywhere and must never be added to the frontend or to a
  `VITE_*` variable.
