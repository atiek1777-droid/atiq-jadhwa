# Atiq Al-Jadhwa — Personal Brand Platform

عتيق الجذوة — منصة العلامة الشخصية الكاملة: تطوير أعمال، حلول رقمية، وذكاء اصطناعي.

A bilingual (Arabic-first RTL / English LTR) Next.js platform with a real
CMS-backed portfolio, a dedicated Restaurant Business Solutions product
area, a branded AI business advisor ("Atiq AI"), and a full admin dashboard
— built on Next.js App Router, TypeScript, Tailwind, and Supabase.

## 1. Architecture

```
src/
  app/
    [locale]/           # every public page, locale-scoped (ar | en)
    admin/               # authenticated CMS dashboard (English UI, LTR)
    api/
      ai/chat/           # Atiq AI — Groq -> OpenRouter fallback, rate limited
      ai/feedback/       # thumbs up/down on assistant replies
      contact/           # contact form submission
    sitemap.ts / robots.ts
  components/            # layout, home, work, restaurant, ai, admin, ui
  lib/
    i18n/                # locale config + ar.json / en.json dictionaries
    supabase/            # browser / server / service-role clients + types
    ai/                  # provider abstraction + structured knowledge
    data/                # real project data (local fallback) + article fetchers
    hooks/                # useAdminAuth, useSupabaseCollection
    seo/                 # shared metadata builder
sql/
  schema.sql             # full Postgres schema
  policies.sql           # row-level security
  seed.sql               # real projects + restaurant framework + FAQs only
public/
  fonts/                 # Cairo, Amiri, EleganceArPro (selected from the 92-file pack)
  images/atiq-portrait.png
```

The site works in two modes:

1. **No Supabase configured** (`NEXT_PUBLIC_SUPABASE_URL` unset): the public
   site renders from the local, real project list in
   `src/lib/data/projects.ts` and the dictionaries in `src/lib/i18n/`. Admin
   routes show an honest "not connected" screen instead of a fake dashboard.
2. **Supabase configured**: the admin dashboard becomes fully functional
   (auth, CRUD, media, AI knowledge, leads), and article/insight pages read
   live from the `articles` table. No code changes are needed to switch —
   only environment variables.

## 2. Typography

The supplied 92-file Arabic font library was inspected file by file. Most
entries are ornamental/dingbat fonts (frames, borders, leaf and heart
glyphs) — not usable as UI or body text. Three families were kept:

| Role                  | Family            | Why |
|------------------------|-------------------|-----|
| Primary UI / body      | **Cairo**         | Clean, modern, legible at small sizes, full weight range |
| Display / editorial    | **Amiri**         | Naskh-based, premium/editorial feel for Hero/H1/H2 |
| Decorative accent only | **EleganceArPro** | Used sparingly — numerals, section eyebrows — never body text |

Latin typography: the pack contains no English typeface. The site currently
falls back to the OS UI font for English; before launch, pair a licensed or
`next/font/google` Latin family (e.g. Inter) in `src/styles/fonts.css` and
`tailwind.config.ts` (`fontFamily.latin`).

## 3. Setup

```bash
npm install
cp .env.example .env.local   # fill in real values, see below
npm run dev
```

### Supabase

1. Create a project at supabase.com.
2. In the SQL editor, run in order: `sql/schema.sql`, then `sql/policies.sql`,
   then `sql/seed.sql`.
3. Create an admin user under Authentication → Users, then insert a matching
   row: `insert into profiles (id, full_name, role) values ('<user-uuid>', 'Atiq', 'owner');`
4. Copy the project URL and anon/service-role keys into `.env.local`.

### AI providers

Get a `GROQ_API_KEY` (fast, cheap, primary) and optionally an
`OPENROUTER_API_KEY` (automatic fallback if Groq fails or times out). Both
are read server-side only — see `src/lib/ai/providers.ts`.

### Environment variables

See `.env.example` for the full list and inline comments.

## 4. What's implemented

- Full bilingual routing (`/ar`, `/en`) via middleware + root-layout
  server-side `lang`/`dir` (no client flash, no hydration mismatch)
- Hero with art-directed portrait (distinct desktop/mobile compositions,
  no card/circle treatment)
- Build/Improve/Grow framework, capabilities grid, featured work
- Restaurant Business Solutions: sequential Diagnose→Cost→Control→
  Organize→Improve→Grow framework + problem areas + CTA
- NEXTRA-AI relationship section
- Work index + real project detail pages (only verified projects — see §5)
- Insights: reads real published articles from Supabase; honest empty state
  when none exist (no fabricated posts)
- Contact form → `contact_submissions` table, with WhatsApp as the primary
  channel throughout
- **Atiq AI**: branded launcher + full chat panel, quick actions, structured
  system prompt (`src/lib/ai/knowledge.ts`) built from real profile/services/
  restaurant/project data, Groq→OpenRouter provider fallback, rate limiting,
  session/message persistence, thumbs up/down feedback, WhatsApp handoff
- **Admin dashboard** (`/admin`, Supabase Auth-gated): live counts,
  Projects CRUD (publish/feature/reorder/delete + per-project image
  gallery), general Media Library with project assignment, Services CMS,
  Restaurant Solutions CMS, Articles/Insights CMS, Homepage section
  overrides, AI Knowledge CMS (by domain), AI FAQs, read-only AI
  Conversations viewer, Leads (contact + AI-qualified), Site Settings +
  Social Links
- SEO: per-page `generateMetadata` (canonical + hreflang + OG/Twitter),
  `sitemap.ts`, `robots.ts` (disallows `/admin`)
- Accessibility: semantic headings, alt text on every image, `aria-label`
  on every icon-only control, visible focus states, `prefers-reduced-motion`
  respected globally
- Security: `SUPABASE_SERVICE_ROLE_KEY` is only ever imported in the two
  API route files (`api/ai/chat`, `api/ai/feedback`, `api/contact`) —
  verified by static scan, never in a `"use client"` file; RLS policies for
  every table; Zod validation on both API routes

## 5. Content honesty

No fake clients, projects, statistics, testimonials, awards, or pricing
exist anywhere in this codebase. The only projects present are the ten
listed in the original brief, with only their real URLs and (where given)
real one-line descriptions — every other field (`industry`, `year`,
`challenge`/`approach`/`solution`/`outcome`, gallery images) is left empty
until an admin fills it in with verified information via `/admin/projects`.

The 113 portfolio images referenced in the brief could not be inspected —
this environment has no network access to `raw.githubusercontent.com`. The
Media Library (`/admin/media`) is built specifically for this: paste each
confirmed image URL once uploaded to Supabase Storage (or verified from the
GitHub repo), and assign it to the correct project by hand. No image-to-
project relationship is guessed anywhere in the code.

## 6. What you need to do outside this environment

- `npm install` and `npm run build` (not run here — no network/npm access
  in this sandbox; the code has been reviewed manually for import/type
  correctness instead, see §7)
- Create the Supabase project and run the three SQL files
- Add real API keys (Groq, optionally OpenRouter, Supabase) to your
  deployment's environment variables (Vercel dashboard or `.env.local`)
- Upload the real portfolio images to Supabase Storage (or confirm the
  GitHub repo URLs) and assign them via `/admin/media` + `/admin/projects`
- Write real Privacy Policy / Terms of Service copy — the current pages at
  `/privacy` and `/terms` are explicitly labeled placeholder legal text
- Pair a Latin typeface for English content (see §2)
- Replace `NEXT_PUBLIC_SITE_URL` in `.env.local` with the real production
  domain before relying on the generated sitemap/canonical URLs

## 7. Manual QA performed in this environment

Since `npm install`/`npm run build` could not run here, the following was
verified by static analysis instead:

- Every `@/...` import resolves to a real file (scripted check, zero misses)
- Every Supabase table referenced in code exists in `schema.sql`, and every
  table in `schema.sql` is referenced by the app (no dead SQL)
- No `TODO`/`FIXME`/"Coming soon" markers anywhere in `src/`
- No image is missing `alt` text; no icon-only button is missing
  `aria-label`
- `createServiceRoleClient` is only imported by the three server-only API
  route files, never by a `"use client"` component
- `.env.example` contains no real secrets

A real `npm run build` should still be run once before deploying — static
analysis catches structural issues, not every TypeScript edge case.

## 8. Deploying

```bash
git init && git add . && git commit -m "Initial commit"
git remote add origin <your-repo-url>
git push -u origin main
```

Then import the repo in Vercel, add the environment variables from
`.env.example` with real values, and deploy.
