"use client";

import { useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { X, Menu } from "lucide-react";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/get-dictionary";
import { buildWhatsAppUrl } from "@/lib/utils/whatsapp";
import LanguageSwitcher from "./LanguageSwitcher";

const links = (locale: Locale, dict: Dictionary) => [
  { href: `/${locale}/about`, label: dict.nav.about },
  { href: `/${locale}/services`, label: dict.nav.services },
  { href: `/${locale}/work`, label: dict.nav.work },
  { href: `/${locale}/services/restaurant-business-solutions`, label: dict.nav.restaurant },
  { href: `/${locale}/insights`, label: dict.nav.insights },
  { href: `/${locale}/contact`, label: dict.nav.contact },
];

export default function MobileMenu({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const [open, setOpen] = useState(false);
  const items = links(locale, dict);

  return (
    <div className="md:hidden">
      <button
        aria-label={open ? "Close menu" : "Open menu"}
        onClick={() => setOpen((v) => !v)}
        className="p-2"
      >
        {open ? <X size={22} /> : <Menu size={22} />}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-50 flex flex-col bg-canvas px-6 py-6"
          >
            <div className="flex items-center justify-between">
              <span className="font-arabic-display text-lg">{dict.brand.name}</span>
              <button aria-label="Close menu" onClick={() => setOpen(false)}>
                <X size={24} />
              </button>
            </div>

            <nav className="mt-12 flex flex-1 flex-col gap-6">
              {items.map((item, i) => (
                <motion.div
                  key={item.href}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 * i, duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                >
                  <Link
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className="font-arabic-display text-3xl"
                  >
                    {item.label}
                  </Link>
                </motion.div>
              ))}
            </nav>

            <div className="flex items-center justify-between border-t border-border/50 pt-6">
              <LanguageSwitcher locale={locale} />
              <a href={buildWhatsAppUrl()} className="text-sm font-medium text-accent">
                {dict.nav.whatsapp}
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
