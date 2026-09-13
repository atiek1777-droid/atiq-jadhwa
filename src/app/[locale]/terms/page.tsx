import { isLocale, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { notFound } from "next/navigation";

export default async function TermsPage({ params }: { params: { locale: string } }) {
  if (!isLocale(params.locale)) notFound();
  const locale = params.locale as Locale;
  await getDictionary(locale);

  return (
    <section className="mx-auto max-w-content px-6 py-20">
      <h1 className="font-arabic-display text-4xl">
        {locale === "ar" ? "الشروط والأحكام" : "Terms of Service"}
      </h1>
      <p className="mt-6 max-w-2xl text-sm leading-relaxed text-muted">
        {locale === "ar"
          ? "هذا النص التزام مبدئي يجب استبداله بشروط استخدام فعلية قبل الإطلاق."
          : "This is placeholder legal copy and must be replaced with real terms of service before launch."}
      </p>
    </section>
  );
}
