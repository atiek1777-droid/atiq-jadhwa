import { isLocale, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getPublishedArticles } from "@/lib/data/get-articles";

import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo/build-metadata";

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  const locale = isLocale(params.locale) ? (params.locale as Locale) : "ar";
  const dict = await getDictionary(locale);
  return buildMetadata({ title: dict.insights.title, description: dict.insights.sub, locale, path: "/insights" });
}

export default async function InsightsPage({ params }: { params: { locale: string } }) {
  if (!isLocale(params.locale)) notFound();
  const locale = params.locale as Locale;
  const dict = await getDictionary(locale);
  const articles = await getPublishedArticles();

  return (
    <section className="mx-auto max-w-content px-6 py-20">
      <h1 className="font-arabic-display text-4xl md:text-5xl">{dict.insights.title}</h1>
      <p className="mt-4 max-w-xl text-lg text-muted">{dict.insights.sub}</p>

      {articles.length === 0 ? (
        <div className="mt-16 rounded-2xl border border-dashed border-border/60 p-10 text-center text-sm text-muted">
          {dict.insights.empty}
        </div>
      ) : (
        <div className="mt-10">
          {articles.map((a) => (
            <Link
              key={a.slug}
              href={`/${locale}/insights/${a.slug}`}
              className="block border-t border-border/50 py-8 first:border-t-0"
            >
              <h2 className="font-arabic-display text-2xl">{locale === "ar" ? a.title_ar : a.title_en}</h2>
              {(locale === "ar" ? a.excerpt_ar : a.excerpt_en) && (
                <p className="mt-2 text-sm text-muted">
                  {locale === "ar" ? a.excerpt_ar : a.excerpt_en}
                </p>
              )}
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}
