import { isLocale, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { notFound } from "next/navigation";
import Button from "@/components/ui/Button";
import ContactForm from "@/components/ui/ContactForm";
import { buildWhatsAppUrl } from "@/lib/utils/whatsapp";

import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo/build-metadata";

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  const locale = isLocale(params.locale) ? (params.locale as Locale) : "ar";
  const dict = await getDictionary(locale);
  return buildMetadata({ title: dict.contact.title, description: dict.contact.sub, locale, path: "/contact" });
}

export default async function ContactPage({ params }: { params: { locale: string } }) {
  if (!isLocale(params.locale)) notFound();
  const locale = params.locale as Locale;
  const dict = await getDictionary(locale);

  return (
    <section className="mx-auto max-w-content px-6 py-20">
      <div className="grid gap-14 md:grid-cols-2">
        <div>
          <h1 className="font-arabic-display text-4xl md:text-5xl">{dict.contact.title}</h1>
          <p className="mt-6 max-w-md text-lg text-muted">{dict.contact.sub}</p>

          <div className="mt-10">
            <Button href={buildWhatsAppUrl()} variant="accent">
              {dict.contact.whatsappCta}
            </Button>
          </div>
        </div>

        <ContactForm locale={locale} dict={dict} />
      </div>
    </section>
  );
}
