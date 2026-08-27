import { defaultLang, supportedLangs, translations, type Locale } from "./ui";

/**
 * Determina el idioma activo a partir de la URL.
 *
 * El idioma se decide ÚNICAMENTE por el parámetro query `?lang=en` / `?lang=es`
 * de la URL actual. Si la URL no trae ese parámetro, siempre es español (`es`),
 * sin importar qué idioma se haya visto en una página anterior.
 *
 * (El segundo parámetro `cookieHeader` se mantiene por compatibilidad con los
 * call sites existentes, pero ya no se usa para decidir el idioma.)
 */
export function getLangFromUrl(
  urlOrString: URL | string,
  _cookieHeader?: string | null
): Locale {
  let langParam: string | null = null;

  try {
    if (typeof urlOrString === "string") {
      const parsedUrl = new URL(urlOrString, "https://celigcr.com");
      langParam = parsedUrl.searchParams.get("lang");
    } else if (urlOrString instanceof URL) {
      langParam = urlOrString.searchParams.get("lang");
    }
  } catch {
    langParam = null;
  }

  if (langParam && (supportedLangs as string[]).includes(langParam.toLowerCase())) {
    return langParam.toLowerCase() as Locale;
  }

  return defaultLang;
}

/**
 * Helper para obtener traducciones tipadas o anidadas por path separado por puntos.
 * Ej: t("home.landing.title1") o t("nav.address")
 */
export function useTranslations(lang: Locale) {
  const dict = translations[lang] || translations[defaultLang];

  return function t(keyPath: string, fallback?: string): any {
    const keys = keyPath.split(".");
    let current: any = dict;

    for (const k of keys) {
      if (current && typeof current === "object" && k in current) {
        current = current[k];
      } else {
        // Fallback al diccionario en español si no se encuentra en el actual
        let fallbackVal: any = translations[defaultLang];
        for (const fbKey of keys) {
          if (fallbackVal && typeof fallbackVal === "object" && fbKey in fallbackVal) {
            fallbackVal = fallbackVal[fbKey];
          } else {
            fallbackVal = undefined;
            break;
          }
        }
        return fallbackVal !== undefined ? fallbackVal : fallback || keyPath;
      }
    }

    return current;
  };
}

/**
 * Genera una ruta localizada preservando el parámetro de idioma y hashes existentes.
 * Ej: getLocalizedPath("/servicios", "en") -> "/servicios?lang=en"
 *     getLocalizedPath("#contacto", "en") -> "#contacto"
 *     getLocalizedPath("/#contacto", "en") -> "/?lang=en#contacto"
 */
export function getLocalizedPath(path: string, lang: Locale): string {
  if (!path) return path;

  // Si es un enlace puramente hash dentro de la misma página (#contacto)
  if (path.startsWith("#")) {
    return path;
  }

  // Si es un enlace externo (http/https/mailto/tel/wa)
  if (/^(https?:|mailto:|tel:|\/\/)/i.test(path)) {
    return path;
  }

  const [baseAndQuery, hash] = path.split("#");
  const hashPart = hash ? `#${hash}` : "";
  const [pathname, queryString] = baseAndQuery.split("?");

  const params = new URLSearchParams(queryString || "");

  if (lang === "en") {
    params.set("lang", "en");
  } else {
    params.delete("lang");
  }

  const newQuery = params.toString();
  const queryPart = newQuery ? `?${newQuery}` : "";

  return `${pathname || "/"}${queryPart}${hashPart}`;
}
