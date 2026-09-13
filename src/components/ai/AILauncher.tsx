"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Sparkles, X } from "lucide-react";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/get-dictionary";
import AIChat from "./AIChat";

// Distinctive launcher: not a generic speech bubble, not WhatsApp/Messenger
// styling. A filled circular mark with a subtle pulse, in the brand purple.
export default function AILauncher({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label={dict.ai.name}
        className="fixed bottom-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-white shadow-lg shadow-primary/30 transition-transform hover:scale-105 ltr:right-6 rtl:left-6"
      >
        <span className="absolute inset-0 animate-ping rounded-full bg-primary/40" />
        {open ? <X size={22} /> : <Sparkles size={22} />}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.98 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="fixed bottom-24 z-50 h-[70vh] w-[92vw] max-w-sm overflow-hidden rounded-2xl border border-border/50 bg-paper shadow-2xl ltr:right-6 rtl:left-6 md:h-[600px]"
          >
            <AIChat locale={locale} dict={dict} onClose={() => setOpen(false)} />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
