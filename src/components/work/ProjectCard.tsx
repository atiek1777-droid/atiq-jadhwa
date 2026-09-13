import Link from "next/link";
import type { Project } from "@/lib/data/projects";
import type { Locale } from "@/lib/i18n/config";

export default function ProjectCard({ project, locale }: { project: Project; locale: Locale }) {
  const title = locale === "ar" ? project.title_ar : project.title_en;
  const desc = locale === "ar" ? project.short_description_ar : project.short_description_en;

  return (
    <Link
      href={`/${locale}/work/${project.slug}`}
      className="group block border-t border-border/50 py-8 transition-colors first:border-t-0"
    >
      <div className="flex items-baseline justify-between gap-6">
        <h3 className="font-arabic-display text-2xl transition-transform group-hover:translate-x-1 rtl:group-hover:-translate-x-1 md:text-3xl">
          {title}
        </h3>
        <span className="shrink-0 text-sm text-muted">
          {project.categories[0]?.replace("-", " ")}
        </span>
      </div>
      {desc && <p className="mt-3 max-w-2xl text-sm text-muted">{desc}</p>}
    </Link>
  );
}
