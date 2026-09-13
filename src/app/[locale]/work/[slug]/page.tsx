import type { Metadata } from "next";
import { isLocale, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { notFound } from "next/navigation";
import { getProjectBySlug, projects } from "@/lib/data/projects";
import Button from "@/components/ui/Button";
import { buildMetadata } from "@/lib/seo/build-metadata";

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: { locale: string; slug: string };
}): Promise<Metadata> {
  const locale = isLocale(params.locale) ? (params.locale as Locale) : "ar";
  const project = getProjectBySlug(params.slug);
  if (!project) return {};
  const title = locale === "ar" ? project.title_ar : project.title_en;
  const description = locale === "ar" ? project.short_description_ar : project.short_description_en;
  return buildMetadata({ title, description: description ?? undefined, locale, path: `/work/${project.slug}` });
}

export default async function ProjectDetailPage({
  params,
}: {
  params: { locale: string; slug: string };
}) {
  if (!isLocale(params.locale)) notFound();
  const locale = params.locale as Locale;
  const dict = await getDictionary(locale);
  const project = getProjectBySlug(params.slug);
  if (!project) notFound();

  const title = locale === "ar" ? project.title_ar : project.title_en;
  const desc = locale === "ar" ? project.short_description_ar : project.short_description_en;

  return (
    <article className="mx-auto max-w-content px-6 py-20">
      <p className="text-sm text-muted">{project.categories.join(" · ")}</p>
      <h1 className="mt-4 font-arabic-display text-4xl md:text-5xl">{title}</h1>
      {desc && <p className="mt-6 max-w-2xl text-lg text-muted">{desc}</p>}

      <div className="mt-10 flex flex-wrap gap-4">
        <Button href={project.external_url} variant="primary">
          {dict.work.visitSite}
        </Button>
      </div>

      {/* Challenge / Approach / Solution / Outcome render only when the
          admin has entered real, verified content — never placeholder text
          (PRD §20 / §70). */}
      {(project.challenge || project.approach || project.solution || project.outcome) && (
        <div className="mt-16 grid gap-10 border-t border-border/50 pt-10 md:grid-cols-2">
          {project.challenge && (
            <div>
              <h2 className="text-sm font-semibold text-muted">
                {locale === "ar" ? "التحدي" : "Challenge"}
              </h2>
              <p className="mt-2 text-base leading-relaxed">{project.challenge}</p>
            </div>
          )}
          {project.approach && (
            <div>
              <h2 className="text-sm font-semibold text-muted">
                {locale === "ar" ? "المنهج" : "Approach"}
              </h2>
              <p className="mt-2 text-base leading-relaxed">{project.approach}</p>
            </div>
          )}
          {project.solution && (
            <div>
              <h2 className="text-sm font-semibold text-muted">
                {locale === "ar" ? "الحل" : "Solution"}
              </h2>
              <p className="mt-2 text-base leading-relaxed">{project.solution}</p>
            </div>
          )}
          {project.outcome && (
            <div>
              <h2 className="text-sm font-semibold text-muted">
                {locale === "ar" ? "النتيجة" : "Outcome"}
              </h2>
              <p className="mt-2 text-base leading-relaxed">{project.outcome}</p>
            </div>
          )}
        </div>
      )}
    </article>
  );
}
