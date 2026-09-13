"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/get-dictionary";
import LanguageSwitcher from "./LanguageSwitcher";
import MobileMenu from "./MobileMenu";
import Button from "@/components/ui/Button";

export default function Nav({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const links = [
    { href: `/${locale}/about`, label: dict.nav.about },
    { href: `/${locale}/services`, label: dict.nav.services },
    { href: `/${locale}/work`, label: dict.nav.work },
    { href: `/${locale}/services/restaurant-business-solutions`, label: dict.nav.restaurant },
    { href: `/${locale}/insights`, label: dict.nav.insights },
  ];

  return (
    <header
      className={`sticky top-0 z-40 border-b transition-colors duration-300 ${
        scrolled ? "border-border/60 bg-canvas/90 backdrop-blur" : "border-transparent bg-transparent"
      }`}
    >
      <div className="mx-auto flex max-w-content items-center justify-between px-6 py-4">
        <Link href={`/${locale}`} className="font-arabic-display text-lg tracking-tight">
          {dict.brand.name}
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="text-sm text-ink/80 transition-colors hover:text-ink"
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-5 md:flex">
          <LanguageSwitcher locale={locale} />
          <Button href={`/${locale}/contact`} variant="primary">
            {dict.nav.cta}
          </Button>
        </div>

        <MobileMenu locale={locale} dict={dict} />
      </div>
    </header>
  );
}
