-- ATIQ AL-JADHWA PLATFORM — SEED DATA
-- Only real, known information. No fake clients, metrics, testimonials, or
-- projects are seeded. Empty/unknown fields (industry, dates, challenge/
-- approach/solution/outcome, images) are left NULL to be filled in via
-- /admin once verified — never guessed here.

insert into projects
  (slug, title_ar, title_en, category, short_description_ar, short_description_en, external_url, featured, published, sort_order)
values
  ('raum-marketing', 'راوم للتسويق', 'RAUM Marketing', array['branding','web','marketing','business-development'],
   'بناء الهوية والحضور الرقمي لـ RAUM MARKETING مع تطوير تجربة بصرية متكاملة لخدمات التشطيب والتأثيث وإدارة العقارات.',
   'Building the identity and digital presence for RAUM MARKETING, with a complete visual experience for interior finishing, furnishing, and property management services.',
   'https://www.raummarketing.com/', true, true, 1),

  ('khairat-yemen', 'نظام معامل خيرات اليمن', 'Khairat Yemen Factory System', array['systems','operations'],
   'نظام رقمي داخلي لمعامل خيرات اليمن.', 'An internal digital system for Khairat Yemen''s factories.',
   'https://khairat-yemen.vercel.app', false, true, 2),

  ('nextra-ai', 'نكسترا AI', 'Nextra AI', array['ai','digital'],
   'المنصة التقنية التي من خلالها تُبنى حلول الذكاء الاصطناعي والأتمتة.',
   'The technology platform behind the AI and automation solutions built for clients.',
   'https://nextra-ai-clean.vercel.app', true, true, 3),

  ('davinci-furniture', 'دافنشي للأثاث', 'Da Vinci Furniture', array['web','branding'],
   'موقع متعدد الصفحات لشركة دافنشي لتصنيع الأثاث.', 'A multi-page website for Da Vinci Furniture manufacturing.',
   'https://davinci-furniture-website-v3.vercel.app', true, true, 4),

  ('pizza-factory', 'بيتزا فاكتوري', 'Pizza Factory', array['web','restaurant'],
   'موقع رقمي لمشروع بيتزا فاكتوري.', 'A digital website for the Pizza Factory project.',
   'https://pizza-factory-website-1.vercel.app', false, true, 5),

  ('enjaz', 'إنجاز', 'Enjaz', array['web'],
   'موقع مشروع إنجاز.', 'The Enjaz project website.',
   'https://enjaz-2026.vercel.app', false, true, 6),

  ('egtiaz', 'اعتياز', 'EGTIAZ', array['web'],
   'موقع مشروع اعتياز.', 'The EGTIAZ project website.',
   'https://egtiaz.vercel.app', false, true, 7),

  ('salah-enjaz', 'صلاح إنجاز', 'Salah Enjaz', array['web'],
   'موقع مشروع صلاح إنجاز.', 'The Salah Enjaz project website.',
   'https://salah-enjaz-vercel.vercel.app/', false, true, 8),

  ('allahza-travel', 'الأهزة للسفر والسياحة', 'Allahza Travel', array['web','marketing'],
   'موقع رقمي لوكالة الأهزة للسفر والسياحة.', 'A digital website for Allahza Travel agency.',
   'https://allahza-travel1.vercel.app/?hl=ar-001', false, true, 9),

  ('personal-landing', 'الصفحة الشخصية', 'Personal Landing', array['web','branding'],
   'الصفحة الشخصية التعريفية السابقة لعتيق الجذوة.', 'Atiq Al-Jadhwa''s earlier personal landing page.',
   'https://atiek1777-droid.github.io/atiq-landing/', false, true, 10)
on conflict (slug) do nothing;

insert into restaurant_solutions (stage, title_ar, title_en, sort_order) values
  ('diagnose', 'تشخيص', 'Diagnose', 1),
  ('cost', 'التكلفة', 'Cost', 2),
  ('control', 'الضبط', 'Control', 3),
  ('organize', 'التنظيم', 'Organize', 4),
  ('improve', 'تطوير', 'Improve', 5),
  ('grow', 'نمو', 'Grow', 6)
on conflict do nothing;

insert into ai_faqs (question_ar, question_en, answer_ar, answer_en, sort_order) values
  ('كيف أتواصل معك؟', 'How can I reach you?',
   'أسرع طريقة هي واتساب على 967779339333+.', 'The fastest way is WhatsApp at +967779339333.', 1),
  ('هل تعمل مع المطاعم فقط؟', 'Do you only work with restaurants?',
   'لا، أعمل مع مختلف الأعمال، والمطاعم مجال متخصص لدي لأن مشاكلها التشغيلية واضحة وقابلة للحل بشكل منهجي.',
   'No, I work across different businesses. Restaurants are a specialty area because their operational problems are clear and solvable systematically.', 2)
on conflict do nothing;
