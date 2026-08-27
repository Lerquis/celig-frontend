import { translations } from "@/i18n/ui";
import type { Locale } from "@/i18n";

export interface TagDefinition {
  apiKey: string;
  labelKey: string;
}

export const TAG_DEFINITIONS: TagDefinition[] = [
  { apiKey: "Derechos de la Comunidad LGBTIQ+", labelKey: "derechosLgbtiq" },
  { apiKey: "Derecho Familia", labelKey: "derechoFamilia" },
  { apiKey: "Derecho Laboral", labelKey: "derechoLaboral" },
  { apiKey: "Derecho Migratorio", labelKey: "derechoMigratorio" },
  { apiKey: "Derecho Familias Homoparentales", labelKey: "familiasHomoparentales" },
];

export const getTranslatedTag = (tag: string, lang: Locale | string = "es"): string => {
  if (!tag) return "";
  if (lang !== "en") return tag;

  const t = translations[lang] || translations.es;
  const match = TAG_DEFINITIONS.find(
    (def) => def.apiKey.trim().toLowerCase() === tag.trim().toLowerCase()
  );

  if (match && t?.contenidoPage?.tags && t.contenidoPage.tags[match.labelKey]) {
    return t.contenidoPage.tags[match.labelKey];
  }

  return tag;
};
