import type { Metadata } from "next";
import { isLocale, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { notFound } from "next/navigation";
import Hero from "@/components/home/Hero";
import Framework from "@/components/home/Framework";
import Capabilities from "@/components/home/Capabilities";
import FeaturedWork from "@/components/home/FeaturedWork";
import RestaurantTeaser from "@/components/restaurant/RestaurantTeaser";
import NextraTeaser from "@/components/home/NextraTeaser";

export async function generateMetadata({
  params,
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const locale = isLocale(params.locale) ? params.locale : "ar";
  const dict = await getDictionary(locale);
  return {
    title: `${dict.brand.name} — ${dict.brand.tagline}`,
    description: dict.hero.sub,
  };
}

export default async function HomePage({ params }: { params: { locale: string } }) {
  if (!isLocale(params.locale)) notFound();
  const locale = params.locale as Locale;
  const dict = await getDictionary(locale);

  return (
    <>
      <Hero locale={locale} dict={dict} />
      <Framework dict={dict} />
      <Capabilities dict={dict} />
      <FeaturedWork locale={locale} dict={dict} />
      <RestaurantTeaser locale={locale} dict={dict} />
      <NextraTeaser locale={locale} dict={dict} />
    </>
  );
}
