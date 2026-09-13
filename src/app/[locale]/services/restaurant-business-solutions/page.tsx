import { isLocale, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { notFound } from "next/navigation";
import Button from "@/components/ui/Button";
import RestaurantFramework from "@/components/restaurant/RestaurantFramework";
import { buildWhatsAppUrl } from "@/lib/utils/whatsapp";

import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo/build-metadata";

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  const locale = isLocale(params.locale) ? (params.locale as Locale) : "ar";
  const dict = await getDictionary(locale);
  return buildMetadata({ title: dict.restaurant.titleAr, description: dict.restaurant.intro, locale, path: "/services/restaurant-business-solutions" });
}

export default async function RestaurantSolutionsPage({
  params,
}: {
  params: { locale: string };
}) {
  if (!isLocale(params.locale)) notFound();
  const locale = params.locale as Locale;
  const dict = await getDictionary(locale);

  return (
    <>
      <section className="mx-auto max-w-content px-6 py-20">
        <p className="text-sm text-secondary">
          {locale === "ar" ? "حلول أعمال المطاعم" : "Restaurant Business Solutions"}
        </p>
        <h1 className="mt-4 max-w-3xl font-arabic-display text-4xl md:text-5xl">
          {dict.restaurant.titleAr}
        </h1>
        <p className="mt-6 max-w-2xl text-lg text-muted">{dict.restaurant.intro}</p>
      </section>

      <RestaurantFramework dict={dict} />

      <section className="mx-auto max-w-content px-6 py-16">
        <div className="grid gap-x-10 gap-y-6 md:grid-cols-2">
          {dict.restaurant.areas.map((area) => (
            <div key={area} className="rule pt-5 text-sm leading-relaxed">
              {area}
            </div>
          ))}
        </div>
      </section>

      <section className="border-t border-border/50 bg-ink py-16 text-canvas">
        <div className="mx-auto max-w-content px-6 text-center">
          <h2 className="font-arabic-display text-2xl md:text-3xl">{dict.restaurant.cta}</h2>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Button href={buildWhatsAppUrl()} variant="accent">
              {dict.nav.whatsapp}
            </Button>
            <Button href={`/${locale}#ai`} variant="secondary" className="border-canvas/30 text-canvas">
              {dict.restaurant.ctaStart}
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
