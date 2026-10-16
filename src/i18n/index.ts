import type { TranslationKeys, Locale } from "../types";
import { en } from "./en";
import { fr } from "./fr";

export const translations: Record<Locale, TranslationKeys> = { en, fr };
export const defaultLocale: Locale = "en";
export const locales: Locale[] = ["en", "fr"];

export function getTranslation(locale: Locale): TranslationKeys {
  return translations[locale] ?? translations[defaultLocale];
}

export function isValidLocale(locale: string): locale is Locale {
  return locales.includes(locale as Locale);
}

// ⬇️ NOUVEAU : Helper pour le switch de langue
export function getAlternateLocale(current: Locale): Locale {
  return current === "en" ? "fr" : "en";
}

export function getLocalePath(locale: Locale): string {
  return `/${locale}/`;
}

export type { TranslationKeys, Locale };