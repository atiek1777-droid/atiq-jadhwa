import { isLocale, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { notFound } from "next/navigation";
import Link from "next/link";
import Framework from "@/components/home/Framework";

import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo/build-metadata";

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  const locale = isLocale(params.locale) ? (params.locale as Locale) : "ar";
  const dict = await getDictionary(locale);
  return buildMetadata({ title: dict.capabilities.title, description: dict.about.positioning, locale, path: "/services" });
}

export default async function ServicesPage({ params }: { params: { locale: string } }) {
  if (!isLocale(params.locale)) notFound();
  const locale = params.locale as Locale;
  const dict = await getDictionary(locale);

  return (
    <>
      <section className="mx-auto max-w-content px-6 py-20">
        <h1 className="font-arabic-display text-4xl md:text-5xl">{dict.capabilities.title}</h1>
        <p className="mt-6 max-w-2xl text-lg text-muted">{dict.about.positioning}</p>
      </section>

      <Framework dict={dict} />

      <section className="border-t border-border/50 py-20">
        <div className="mx-auto max-w-content px-6">
          <div className="grid gap-x-10 gap-y-8 md:grid-cols-2">
            {dict.capabilities.items.map((item) => (
              <div key={item.title} className="rule pt-6">
                <h3 className="text-lg font-semibold">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{item.desc}</p>
              </div>
            ))}
          </div>

          <div className="mt-14 rounded-2xl border border-border/50 bg-paper p-8">
            <p className="text-sm text-muted">
              {locale === "ar" ? "مطعم أو عمل غذائي؟" : "Running a restaurant or food business?"}
            </p>
            <Link
              href={`/${locale}/services/restaurant-business-solutions`}
              className="mt-2 inline-block font-arabic-display text-2xl underline decoration-border underline-offset-4 hover:decoration-ink"
            >
              {dict.restaurant.titleAr}
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
