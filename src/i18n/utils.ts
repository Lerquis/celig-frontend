import { defaultLang, supportedLangs, translations, type Locale } from "./ui";

/**
 * Obtiene el valor de una cookie por su nombre a partir del string header Cookie.
 */
function parseCookie(cookieHeader: string | null | undefined, name: string): string | null {
  if (!cookieHeader) return null;
  const match = cookieHeader.match(new RegExp(`(^|;\\s*)(${name})=([^;]*)`));
  return match ? decodeURIComponent(match[3]) : null;
}

/**
 * Determina el idioma activo a partir de la URL y/o las cookies.
 * Prioridad:
 * 1. Parámetro query `?lang=en` o `?lang=es` en la URL.
 * 2. Cookie `celig_lang` enviada en la cabecera HTTP o disponible en `document.cookie`.
 * 3. Idioma por defecto: 'es'.
 */
export function getLangFromUrl(
  urlOrString: URL | string,
  cookieHeader?: string | null
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

  // Verificar en cookie de la petición SSR
  if (cookieHeader) {
    const cookieLang = parseCookie(cookieHeader, "celig_lang");
    if (cookieLang && (supportedLangs as string[]).includes(cookieLang.toLowerCase())) {
      return cookieLang.toLowerCase() as Locale;
    }
  }

  // Verificar en navegador (cliente)
  if (typeof document !== "undefined") {
    const clientCookieLang = parseCookie(document.cookie, "celig_lang");
    if (clientCookieLang && (supportedLangs as string[]).includes(clientCookieLang.toLowerCase())) {
      return clientCookieLang.toLowerCase() as Locale;
    }
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
