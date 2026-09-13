import type { Metadata } from "next";
import { isLocale, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { notFound } from "next/navigation";
import { getArticleBySlug } from "@/lib/data/get-articles";
import { buildMetadata } from "@/lib/seo/build-metadata";

export async function generateMetadata({
  params,
}: {
  params: { locale: string; slug: string };
}): Promise<Metadata> {
  const locale = isLocale(params.locale) ? (params.locale as Locale) : "ar";
  const article = await getArticleBySlug(params.slug);
  if (!article) return {};
  const title = locale === "ar" ? article.title_ar : article.title_en;
  const description = locale === "ar" ? article.excerpt_ar : article.excerpt_en;
  return buildMetadata({ title, description: description ?? undefined, locale, path: `/insights/${article.slug}` });
}

export default async function ArticlePage({
  params,
}: {
  params: { locale: string; slug: string };
}) {
  if (!isLocale(params.locale)) notFound();
  const locale = params.locale as Locale;
  await getDictionary(locale);
  const article = await getArticleBySlug(params.slug);
  if (!article) notFound();

  const title = locale === "ar" ? article.title_ar : article.title_en;
  const body = locale === "ar" ? article.body_ar : article.body_en;

  return (
    <article className="mx-auto max-w-2xl px-6 py-20">
      <h1 className="font-arabic-display text-4xl">{title}</h1>
      {body && (
        <div className="mt-8 whitespace-pre-wrap text-base leading-relaxed text-ink/90">{body}</div>
      )}
    </article>
  );
}
