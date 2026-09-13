import "server-only";
import type { Locale } from "./config";
import ar from "./dictionaries/ar.json";
import en from "./dictionaries/en.json";

const dictionaries = { ar, en };

export type Dictionary = typeof ar;

export async function getDictionary(locale: Locale): Promise<Dictionary> {
  return dictionaries[locale] ?? dictionaries.ar;
}
