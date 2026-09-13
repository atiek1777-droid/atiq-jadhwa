import { isLocale, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { notFound } from "next/navigation";
import Button from "@/components/ui/Button";
import { getProjectBySlug } from "@/lib/data/projects";

import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo/build-metadata";

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  const locale = isLocale(params.locale) ? (params.locale as Locale) : "ar";
  const dict = await getDictionary(locale);
  return buildMetadata({ title: dict.nextra.title, description: dict.nextra.body, locale, path: "/nextra-ai" });
}

export default async function NextraAiPage({ params }: { params: { locale: string } }) {
  if (!isLocale(params.locale)) notFound();
  const locale = params.locale as Locale;
  const dict = await getDictionary(locale);
  const project = getProjectBySlug("nextra-ai");

  return (
    <section className="mx-auto max-w-content px-6 py-20">
      <h1 className="font-arabic-display text-4xl md:text-5xl">{dict.nextra.title}</h1>
      <p className="mt-6 max-w-2xl text-lg text-muted">{dict.nextra.body}</p>

      <div className="mt-8 flex flex-col gap-2 text-sm text-muted md:flex-row md:gap-8">
        <span>{dict.nextra.roles.atiq}</span>
        <span>{dict.nextra.roles.nextra}</span>
      </div>

      {project && (
        <div className="mt-14 border-t border-border/50 pt-10">
          <Button href={project.external_url} variant="primary">
            {dict.work.visitSite}
          </Button>
        </div>
      )}
    </section>
  );
}
