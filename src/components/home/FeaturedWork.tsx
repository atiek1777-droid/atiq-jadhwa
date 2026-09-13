import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/get-dictionary";
import { getFeaturedProjects } from "@/lib/data/projects";
import ProjectCard from "@/components/work/ProjectCard";
import Button from "@/components/ui/Button";

export default function FeaturedWork({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const featured = getFeaturedProjects();

  return (
    <section className="border-t border-border/50 bg-paper py-20">
      <div className="mx-auto max-w-content px-6">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <h2 className="font-arabic-display text-3xl md:text-4xl">{dict.work.title}</h2>
          <Button href={`/${locale}/work`} variant="text">
            {dict.work.viewProject}
          </Button>
        </div>

        <div className="mt-8">
          {featured.map((project) => (
            <ProjectCard key={project.slug} project={project} locale={locale} />
          ))}
        </div>
      </div>
    </section>
  );
}
