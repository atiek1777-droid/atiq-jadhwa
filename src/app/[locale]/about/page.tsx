import { isLocale, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { notFound } from "next/navigation";

import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo/build-metadata";

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  const locale = isLocale(params.locale) ? (params.locale as Locale) : "ar";
  const dict = await getDictionary(locale);
  return buildMetadata({ title: dict.about.title, description: dict.about.positioning, locale, path: "/about" });
}

export default async function AboutPage({ params }: { params: { locale: string } }) {
  if (!isLocale(params.locale)) notFound();
  const locale = params.locale as Locale;
  const dict = await getDictionary(locale);

  return (
    <section className="mx-auto max-w-content px-6 py-20">
      <h1 className="font-arabic-display text-4xl md:text-5xl">{dict.about.title}</h1>
      <p className="mt-8 max-w-2xl text-lg leading-relaxed">{dict.about.positioning}</p>
      <p className="mt-6 max-w-2xl text-base leading-relaxed text-muted">{dict.about.approach}</p>

      <div className="mt-14 grid gap-6 border-t border-border/50 pt-10 md:grid-cols-3">
        {dict.framework && (
          <>
            {(["build", "improve", "grow"] as const).map((k) => (
              <div key={k}>
                <h3 className="font-arabic-display text-xl">{dict.framework[k].label}</h3>
                <p className="mt-2 text-sm text-muted">{dict.framework[k].desc}</p>
              </div>
            ))}
          </>
        )}
      </div>
    </section>
  );
}
