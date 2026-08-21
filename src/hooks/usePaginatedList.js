import { useCallback, useState } from "react";

/**
 * Hook compartido para listados paginados en modo dual, usado por blogs y podcasts
 * en la página pública `/contenido`.
 *
 * El backend puede responder de dos formas distintas (ver BACKEND_PAGINATION_CHANGES.md):
 * - Modo paginado (nuevo): `{ items, total, totalPages }` — solo trae la página pedida.
 * - Modo legacy (actual, mientras el backend no se actualice): array completo bajo
 *   `legacyKey` (ej. `{ blogs: [...] }`), sin paginar en el servidor.
 *
 * Este hook detecta automáticamente cuál de los dos modos está devolviendo el backend
 * y, si es legacy, pagina en memoria con `.slice()` como fallback — así la UI de
 * paginación (con elipsis) funciona correctamente hoy mismo, y se vuelve realmente
 * eficiente en cuanto el backend soporte `page`/`limit` sin tener que tocar este código.
 *
 * @param {Object} params
 * @param {(page: number) => Promise<{status:number, body:any}>} params.fetchPage - pide una página al backend.
 * @param {string} params.legacyKey - nombre de la key del array en modo legacy (ej. "blogs", "podcasts").
 * @param {number} params.itemsPerPage - tamaño de página a usar cuando el backend está en modo legacy.
 * @param {any} params.initialData - body crudo ya traído por SSR para la página 1.
 */
export function usePaginatedList({
  fetchPage,
  legacyKey,
  itemsPerPage,
  initialData,
}) {
  const [page, setPageState] = useState(1);
  const [loading, setLoading] = useState(false);
  const [current, setCurrent] = useState(() =>
    normalize(initialData, legacyKey)
  );

  const totalPages =
    current.mode === "paginated"
      ? Math.max(1, current.totalPages || 1)
      : Math.max(1, Math.ceil(current.items.length / itemsPerPage));

  const total =
    current.mode === "paginated" ? current.total ?? current.items.length : current.items.length;

  const pageItems =
    current.mode === "paginated"
      ? current.items
      : current.items.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  const setPage = useCallback(
    async (nextPage) => {
      if (nextPage === page || nextPage < 1) return;

      // Modo legacy: ya tenemos el dataset completo en memoria, solo cambia la "vista".
      if (current.mode === "legacy") {
        setPageState(nextPage);
        return;
      }

      setLoading(true);
      try {
        const response = await fetchPage(nextPage);
        if (response.status === 200) {
          setCurrent(normalize(response.body, legacyKey));
          setPageState(nextPage);
        }
      } finally {
        setLoading(false);
      }
    },
    [current.mode, fetchPage, legacyKey, page]
  );

  // Para usar cuando cambia un filtro (ej. tag de blog): vuelve a pedir la página 1.
  // Acepta un `fetchOverride` opcional para evitar closures obsoletos cuando el filtro
  // nuevo aún no se reflejó en el `fetchPage` memoizado del caller.
  const reset = useCallback(
    async (fetchOverride) => {
      setLoading(true);
      try {
        const fetcher = fetchOverride || fetchPage;
        const response = await fetcher(1);
        if (response.status === 200) {
          setCurrent(normalize(response.body, legacyKey));
          setPageState(1);
        }
      } finally {
        setLoading(false);
      }
    },
    [fetchPage, legacyKey]
  );

  return { items: pageItems, page, totalPages, total, loading, setPage, reset };
}

function normalize(body, legacyKey) {
  if (body && Array.isArray(body.items)) {
    return {
      mode: "paginated",
      items: body.items,
      total: body.total,
      totalPages: body.totalPages,
    };
  }
  return { mode: "legacy", items: body?.[legacyKey] ?? [] };
}
