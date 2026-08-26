import es from "./locales/es.json";
import en from "./locales/en.json";

export type Locale = "es" | "en";

export const defaultLang: Locale = "es";
export const supportedLangs: Locale[] = ["es", "en"];

export const translations = {
  es,
  en,
} as const;

export type TranslationDict = typeof es;
