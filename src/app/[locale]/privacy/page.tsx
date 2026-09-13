import { isLocale, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { notFound } from "next/navigation";

export default async function PrivacyPage({ params }: { params: { locale: string } }) {
  if (!isLocale(params.locale)) notFound();
  const locale = params.locale as Locale;
  await getDictionary(locale);

  return (
    <section className="mx-auto max-w-content px-6 py-20">
      <h1 className="font-arabic-display text-4xl">
        {locale === "ar" ? "سياسة الخصوصية" : "Privacy Policy"}
      </h1>
      <p className="mt-6 max-w-2xl text-sm leading-relaxed text-muted">
        {locale === "ar"
          ? "هذا النص التزام مبدئي يجب استبداله بسياسة خصوصية فعلية تعكس ما يجمعه الموقع فعلاً (نموذج التواصل، جلسات عتيق AI) قبل الإطلاق."
          : "This is placeholder legal copy and must be replaced with an actual privacy policy reflecting what the site really collects (contact form, Atiq AI sessions) before launch."}
      </p>
    </section>
  );
}
