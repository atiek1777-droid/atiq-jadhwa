import { notFound } from "next/navigation";
import { isLocale, locales, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import Nav from "@/components/layout/Nav";
import Footer from "@/components/layout/Footer";
import AILauncher from "@/components/ai/AILauncher";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  if (!isLocale(params.locale)) notFound();
  const locale = params.locale as Locale;
  const dict = await getDictionary(locale);

  return (
    <>
      <Nav locale={locale} dict={dict} />
      <main>{children}</main>
      <Footer locale={locale} dict={dict} />
      <AILauncher locale={locale} dict={dict} />
    </>
  );
}
