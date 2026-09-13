"use client";

import { useState } from "react";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/get-dictionary";
import Button from "./Button";

type Status = "idle" | "sending" | "success" | "error" | "not_configured";

export default function ContactForm({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const [status, setStatus] = useState<Status>("idle");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");
    const form = new FormData(e.currentTarget);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.get("name"),
          email: form.get("email"),
          message: form.get("message"),
          locale,
        }),
      });

      if (res.status === 503) {
        setStatus("not_configured");
        return;
      }
      if (!res.ok) throw new Error("failed");
      setStatus("success");
      (e.target as HTMLFormElement).reset();
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return <p className="rounded-xl border border-border/50 bg-paper p-6 text-sm">{dict.contact.success}</p>;
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5" noValidate>
      <div>
        <label htmlFor="name" className="mb-1 block text-sm text-muted">
          {dict.contact.formName}
        </label>
        <input
          id="name"
          name="name"
          required
          maxLength={120}
          className="w-full rounded-lg border border-border/60 bg-paper px-4 py-3 text-sm outline-none focus-visible:border-primary"
        />
      </div>
      <div>
        <label htmlFor="email" className="mb-1 block text-sm text-muted">
          {dict.contact.formEmail}
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          className="w-full rounded-lg border border-border/60 bg-paper px-4 py-3 text-sm outline-none focus-visible:border-primary"
        />
      </div>
      <div>
        <label htmlFor="message" className="mb-1 block text-sm text-muted">
          {dict.contact.formMessage}
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={5}
          maxLength={4000}
          className="w-full rounded-lg border border-border/60 bg-paper px-4 py-3 text-sm outline-none focus-visible:border-primary"
        />
      </div>

      {(status === "error" || status === "not_configured") && (
        <p className="text-sm text-secondary">{dict.contact.error}</p>
      )}

      <Button type="submit" variant="primary" loading={status === "sending"} disabled={status === "sending"}>
        {dict.contact.formSubmit}
      </Button>
    </form>
  );
}
