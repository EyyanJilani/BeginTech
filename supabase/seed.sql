-- =====================================================================
-- BeginTech, SAMPLE blog data (development / testing only)
--
-- Run AFTER blog_schema.sql. Do NOT run this against production unless you
-- want these sample posts live. Every sample post has a slug starting with
-- "sample-" and an excerpt starting with "[Sample]" so they are easy to spot
-- and remove.
--
-- Covers: two published posts in the same category (related posts), one
-- published post in another category, and one DRAFT (must never appear on
-- /blog or in the sitemap).
--
-- To remove all sample data afterwards:
--   delete from public.posts where slug like 'sample-%';
-- (Categories are real-world ones you may want to keep; delete them in the
--  admin if not.)
-- =====================================================================

insert into public.categories (name, slug, description) values
  ('Web Development', 'web-development', 'Building fast, maintainable websites and web applications.'),
  ('Mobile Development', 'mobile-development', 'iOS, Android and cross-platform app development.'),
  ('AI & Machine Learning', 'ai-machine-learning', 'Practical AI: chatbots, automation and retrieval systems.'),
  ('UI/UX Design', 'ui-ux-design', 'Interface design, research and design systems.'),
  ('Business', 'business', 'Planning, budgeting and running digital projects.'),
  ('Technology', 'technology', 'Tools, platforms and engineering practice.')
on conflict (slug) do nothing;

insert into public.posts
  (title, slug, excerpt, content, category_id, status, published_at,
   seo_title, seo_description, seo_keywords, reading_time)
values
(
  'What to Check Before You Hire a Web Development Agency',
  'sample-hire-a-web-development-agency',
  '[Sample] A practical checklist for comparing web development agencies: ownership, performance, SEO foundations and support after launch.',
  $md$
Choosing a web development agency is mostly about asking the right questions **before** the contract is signed.

## 1. Who owns the code?

You should. Ask whether the project lives in *your* repository and whether you get admin access to hosting, domains and analytics.

## 2. How is performance measured?

A good agency agrees on targets up front:

- Largest Contentful Paint under 2.5 seconds on mobile
- No layout shift when images load
- A Lighthouse report at handover

## 3. Is SEO part of the build?

Technical SEO is cheapest when it is built in, not bolted on:

1. Clean, descriptive URLs
2. Unique titles and meta descriptions
3. Structured data and an XML sitemap

> A redesign that loses your existing search rankings is not an upgrade.

## 4. What happens after launch?

Ask about support windows, documentation and how changes are requested. See our [web development service](https://begintech.co/services/web-development) for how we handle it.
$md$,
  (select id from public.categories where slug = 'web-development'),
  'published', now() - interval '10 days',
  'How to Choose a Web Development Agency: A Practical Checklist',
  'Comparing web development agencies? Use this checklist on code ownership, performance targets, SEO foundations and post-launch support.',
  'web development agency, hire web developer, website checklist',
  3
),
(
  'Static Site, CMS or Web App: Picking the Right Architecture',
  'sample-static-cms-or-web-app',
  '[Sample] How to decide between a static site, a CMS-driven site and a full web application based on how often content changes.',
  $md$
Not every website needs a database. The right architecture depends on **how often content changes** and **who changes it**.

## Static sites

Best for marketing sites that change a few times a month. Fast, cheap to host and hard to break.

## CMS-driven sites

Best when a marketing team publishes weekly. A headless CMS keeps editing simple while the front end stays fast.

## Web applications

Needed when users log in, create data or pay. Plan for authentication, permissions and backups from day one.

```text
changes rarely      -> static
changes weekly      -> CMS
users create data   -> web app
```
$md$,
  (select id from public.categories where slug = 'web-development'),
  'published', now() - interval '4 days',
  null, null,
  'website architecture, headless cms, static site',
  2
),
(
  'Do You Actually Need an AI Chatbot?',
  'sample-do-you-need-an-ai-chatbot',
  '[Sample] Three questions to answer before building an AI chatbot for your website or WhatsApp.',
  $md$
AI chatbots can take real load off a support team, but only when the questions are repetitive and the answers are written down somewhere.

## Ask these three questions first

1. **Do the same questions come up every day?** If not, a FAQ page may be enough.
2. **Is the answer documented?** A chatbot can only be as good as the content it answers from.
3. **Who handles what the bot cannot?** Every bot needs a clean handover to a person.

## Measure resolution, not conversations

The useful number is how many questions were *resolved* without a human, not how many chats were started.

Read more about our [AI chatbot development](https://begintech.co/services/ai-chatbot-development) service.
$md$,
  (select id from public.categories where slug = 'ai-machine-learning'),
  'published', now() - interval '1 day',
  'Do You Need an AI Chatbot? 3 Questions to Answer First',
  'Before building an AI chatbot for your website or WhatsApp, answer these three questions about volume, documentation and human handover.',
  'ai chatbot development, whatsapp chatbot, customer support chatbot',
  2
),
(
  'Draft: Mobile App Launch Checklist',
  'sample-mobile-app-launch-checklist',
  '[Sample] DRAFT, this post must not appear on the public blog or in the sitemap.',
  $md$
## Work in progress

This draft exists to test that unpublished posts stay private.
$md$,
  (select id from public.categories where slug = 'mobile-development'),
  'draft', null,
  null, null, null, 1
)
on conflict (slug) do nothing;
