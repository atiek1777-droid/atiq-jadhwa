-- ATIQ AL-JADHWA PLATFORM — ROW LEVEL SECURITY POLICIES
-- Model: public read of published content; writes require an authenticated
-- admin (a row in `profiles`). AI/session tables are insert-only from the
-- public (via the server-side API route, never directly from the browser
-- with the anon key for writes that matter) and readable only by admins.

alter table profiles enable row level security;
alter table projects enable row level security;
alter table project_images enable row level security;
alter table services enable row level security;
alter table restaurant_solutions enable row level security;
alter table articles enable row level security;
alter table media enable row level security;
alter table contact_submissions enable row level security;
alter table site_settings enable row level security;
alter table homepage_sections enable row level security;
alter table social_links enable row level security;
alter table ai_sessions enable row level security;
alter table ai_messages enable row level security;
alter table ai_leads enable row level security;
alter table ai_feedback enable row level security;
alter table ai_knowledge enable row level security;
alter table ai_faqs enable row level security;

-- Helper: is the current user an admin?
create or replace function is_admin()
returns boolean as $$
  select exists (select 1 from profiles where id = auth.uid());
$$ language sql stable security definer;

-- PROFILES: a user can read their own row; only owners manage roles.
create policy "profiles_self_read" on profiles for select using (id = auth.uid());
create policy "profiles_admin_all" on profiles for all using (is_admin()) with check (is_admin());

-- PROJECTS: public reads published rows; admins do everything.
create policy "projects_public_read" on projects for select using (published = true);
create policy "projects_admin_all" on projects for all using (is_admin()) with check (is_admin());

create policy "project_images_public_read" on project_images for select using (
  exists (select 1 from projects p where p.id = project_id and p.published = true)
);
create policy "project_images_admin_all" on project_images for all using (is_admin()) with check (is_admin());

-- SERVICES / RESTAURANT SOLUTIONS: public reads published; admins manage.
create policy "services_public_read" on services for select using (published = true);
create policy "services_admin_all" on services for all using (is_admin()) with check (is_admin());

create policy "restaurant_public_read" on restaurant_solutions for select using (published = true);
create policy "restaurant_admin_all" on restaurant_solutions for all using (is_admin()) with check (is_admin());

-- ARTICLES: public reads published; admins manage.
create policy "articles_public_read" on articles for select using (published = true);
create policy "articles_admin_all" on articles for all using (is_admin()) with check (is_admin());

-- MEDIA: admin-only (assignment happens through the admin UI; public pages
-- read image URLs denormalized onto projects/articles, not this table directly).
create policy "media_admin_all" on media for all using (is_admin()) with check (is_admin());

-- CONTACT SUBMISSIONS: anyone can insert (the contact form); only admins read.
create policy "contact_public_insert" on contact_submissions for insert with check (true);
create policy "contact_admin_read" on contact_submissions for select using (is_admin());
create policy "contact_admin_manage" on contact_submissions for update using (is_admin()) with check (is_admin());
create policy "contact_admin_delete" on contact_submissions for delete using (is_admin());

-- SITE SETTINGS / HOMEPAGE / SOCIAL: public read, admin write.
create policy "settings_public_read" on site_settings for select using (true);
create policy "settings_admin_write" on site_settings for all using (is_admin()) with check (is_admin());

create policy "homepage_public_read" on homepage_sections for select using (visible = true);
create policy "homepage_admin_write" on homepage_sections for all using (is_admin()) with check (is_admin());

create policy "social_public_read" on social_links for select using (true);
create policy "social_admin_write" on social_links for all using (is_admin()) with check (is_admin());

-- AI SESSIONS / MESSAGES: inserted only via the server-side API route using
-- the service role key (bypasses RLS by design — see src/app/api/ai/chat/route.ts).
-- No public policy is defined here on purpose: the anon key must not be able
-- to write or read these tables directly from the browser.
create policy "ai_sessions_admin_read" on ai_sessions for select using (is_admin());
create policy "ai_messages_admin_read" on ai_messages for select using (is_admin());
create policy "ai_leads_admin_all" on ai_leads for all using (is_admin()) with check (is_admin());
create policy "ai_feedback_admin_read" on ai_feedback for select using (is_admin());

-- AI KNOWLEDGE / FAQS: public reads published FAQs; knowledge base itself is
-- consumed server-side only (never shipped to the client), so no public
-- select policy is granted on ai_knowledge.
create policy "ai_faqs_public_read" on ai_faqs for select using (published = true);
create policy "ai_faqs_admin_all" on ai_faqs for all using (is_admin()) with check (is_admin());
create policy "ai_knowledge_admin_all" on ai_knowledge for all using (is_admin()) with check (is_admin());
