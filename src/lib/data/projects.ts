/**
 * Real projects only. No fabricated clients, metrics, or testimonials.
 * This file is the local fallback used when Supabase is not yet configured
 * (no NEXT_PUBLIC_SUPABASE_URL). Once Supabase is wired up, `getProjects()`
 * in `src/lib/data/get-projects.ts` reads from the `projects` table instead,
 * using the exact same `Project` shape — so switching data sources requires
 * no changes to any page or component.
 *
 * Fields left empty (challenge/approach/solution/outcome) are intentionally
 * blank rather than invented — see PRD rule #21 / #70: only real, known
 * information may be shown. Fill them in via /admin/projects once verified.
 */

export type ProjectCategory =
  | "business-development"
  | "branding"
  | "digital"
  | "web"
  | "marketing"
  | "restaurant"
  | "operations"
  | "systems"
  | "ai";

export interface Project {
  slug: string;
  title_ar: string;
  title_en: string;
  short_description_ar: string;
  short_description_en: string;
  categories: ProjectCategory[];
  external_url: string;
  cover_image: string | null;
  gallery: string[];
  featured: boolean;
  /** Left null until confirmed; never guessed. */
  year: number | null;
  challenge?: string;
  approach?: string;
  solution?: string;
  outcome?: string;
}

export const projects: Project[] = [
  {
    slug: "raum-marketing",
    title_ar: "راوم للتسويق",
    title_en: "RAUM Marketing",
    short_description_ar:
      "بناء الهوية والحضور الرقمي لـ RAUM MARKETING مع تطوير تجربة بصرية متكاملة لخدمات التشطيب والتأثيث وإدارة العقارات.",
    short_description_en:
      "Building the identity and digital presence for RAUM MARKETING, with a complete visual experience for interior finishing, furnishing, and property management services.",
    categories: ["branding", "web", "marketing", "business-development"],
    external_url: "https://www.raummarketing.com/",
    cover_image: null,
    gallery: [],
    featured: true,
    year: null,
  },
  {
    slug: "khairat-yemen",
    title_ar: "نظام معامل خيرات اليمن",
    title_en: "Khairat Yemen Factory System",
    short_description_ar: "نظام رقمي داخلي لمعامل خيرات اليمن.",
    short_description_en: "An internal digital system for Khairat Yemen's factories.",
    categories: ["systems", "operations"],
    external_url: "https://khairat-yemen.vercel.app",
    cover_image: null,
    gallery: [],
    featured: false,
    year: null,
  },
  {
    slug: "nextra-ai",
    title_ar: "نكسترا AI",
    title_en: "Nextra AI",
    short_description_ar:
      "المنصة التقنية التي من خلالها تُبنى حلول الذكاء الاصطناعي والأتمتة.",
    short_description_en:
      "The technology platform behind the AI and automation solutions built for clients.",
    categories: ["ai", "digital"],
    external_url: "https://nextra-ai-clean.vercel.app",
    cover_image: null,
    gallery: [],
    featured: true,
    year: null,
  },
  {
    slug: "davinci-furniture",
    title_ar: "دافنشي للأثاث",
    title_en: "Da Vinci Furniture",
    short_description_ar: "موقع متعدد الصفحات لشركة دافنشي لتصنيع الأثاث.",
    short_description_en: "A multi-page website for Da Vinci Furniture manufacturing.",
    categories: ["web", "branding"],
    external_url: "https://davinci-furniture-website-v3.vercel.app",
    cover_image: null,
    gallery: [],
    featured: true,
    year: null,
  },
  {
    slug: "pizza-factory",
    title_ar: "بيتزا فاكتوري",
    title_en: "Pizza Factory",
    short_description_ar: "موقع رقمي لمشروع بيتزا فاكتوري.",
    short_description_en: "A digital website for the Pizza Factory project.",
    categories: ["web", "restaurant"],
    external_url: "https://pizza-factory-website-1.vercel.app",
    cover_image: null,
    gallery: [],
    featured: false,
    year: null,
  },
  {
    slug: "enjaz",
    title_ar: "إنجاز",
    title_en: "Enjaz",
    short_description_ar: "موقع مشروع إنجاز.",
    short_description_en: "The Enjaz project website.",
    categories: ["web"],
    external_url: "https://enjaz-2026.vercel.app",
    cover_image: null,
    gallery: [],
    featured: false,
    year: null,
  },
  {
    slug: "egtiaz",
    title_ar: "اعتياز",
    title_en: "EGTIAZ",
    short_description_ar: "موقع مشروع اعتياز.",
    short_description_en: "The EGTIAZ project website.",
    categories: ["web"],
    external_url: "https://egtiaz.vercel.app",
    cover_image: null,
    gallery: [],
    featured: false,
    year: null,
  },
  {
    slug: "salah-enjaz",
    title_ar: "صلاح إنجاز",
    title_en: "Salah Enjaz",
    short_description_ar: "موقع مشروع صلاح إنجاز.",
    short_description_en: "The Salah Enjaz project website.",
    categories: ["web"],
    external_url: "https://salah-enjaz-vercel.vercel.app/",
    cover_image: null,
    gallery: [],
    featured: false,
    year: null,
  },
  {
    slug: "allahza-travel",
    title_ar: "الأهزة للسفر والسياحة",
    title_en: "Allahza Travel",
    short_description_ar: "موقع رقمي لوكالة الأهزة للسفر والسياحة.",
    short_description_en: "A digital website for Allahza Travel agency.",
    categories: ["web", "marketing"],
    external_url: "https://allahza-travel1.vercel.app/?hl=ar-001",
    cover_image: null,
    gallery: [],
    featured: false,
    year: null,
  },
  {
    slug: "personal-landing",
    title_ar: "الصفحة الشخصية",
    title_en: "Personal Landing",
    short_description_ar: "الصفحة الشخصية التعريفية السابقة لعتيق الجذوة.",
    short_description_en: "Atiq Al-Jadhwa's earlier personal landing page.",
    categories: ["web", "branding"],
    external_url: "https://atiek1777-droid.github.io/atiq-landing/",
    cover_image: null,
    gallery: [],
    featured: false,
    year: null,
  },
];

export function getFeaturedProjects(): Project[] {
  return projects.filter((p) => p.featured);
}

export function getProjectBySlug(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}
