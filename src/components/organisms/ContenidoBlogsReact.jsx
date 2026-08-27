import { useCallback, useState, useMemo } from "react";
import { blogApi } from "@/api";
import { formatDateToDDMMYYYY } from "@/lib/dateFormatter";
import { usePaginatedList } from "@/hooks/usePaginatedList";
import { PaginationControls } from "@/components/molecules/PaginationControls";
import { translations } from "@/i18n/ui";
import { TAG_DEFINITIONS, getTranslatedTag } from "@/lib/tagTranslations";

export const ContenidoBlogsReact = ({
  initialData = { blogs: [] },
  itemsPerPage = 9,
  lang = "es",
}) => {
  const t = translations[lang] || translations.es;
  const [selectedTag, setSelectedTag] = useState("");

  const tagList = useMemo(() => {
    return TAG_DEFINITIONS.map((def) => ({
      apiKey: def.apiKey,
      label: t.contenidoPage?.tags?.[def.labelKey] || def.apiKey,
    }));
  }, [t]);

  const fetchPage = useCallback(
    async (page) => {
      const res = await blogApi.getBlogsByTag(selectedTag, { page, limit: itemsPerPage });
      if (selectedTag && res.status === 200 && res.body?.blogs) {
        const filtered = res.body.blogs.filter((b) =>
          Array.isArray(b.tags) &&
          b.tags.some(
            (tagStr) =>
              tagStr.trim().toLowerCase() === selectedTag.trim().toLowerCase()
          )
        );
        return { status: 200, body: { blogs: filtered } };
      }
      return res;
    },
    [selectedTag, itemsPerPage]
  );

  const {
    items: blogs,
    page: currentPage,
    totalPages,
    total,
    loading,
    setPage,
    reset,
  } = usePaginatedList({
    fetchPage,
    legacyKey: "blogs",
    itemsPerPage,
    initialData,
  });

  const handleTagClick = async (tagApiKey) => {
    const nextTag = selectedTag === tagApiKey ? "" : tagApiKey;
    setSelectedTag(nextTag);

    await reset(async (page) => {
      const res = await blogApi.getBlogsByTag(nextTag, { page, limit: itemsPerPage });
      if (nextTag && res.status === 200 && res.body?.blogs) {
        const filtered = res.body.blogs.filter((b) =>
          Array.isArray(b.tags) &&
          b.tags.some(
            (tagStr) =>
              tagStr.trim().toLowerCase() === nextTag.trim().toLowerCase()
          )
        );
        return { status: 200, body: { blogs: filtered } };
      }
      return res;
    });
  };

  const createButtonPride = (text, href, customClass = "") => {
    return (
      <a
        href={href}
        className={`bg-black text-white font-semibold py-3 px-6 rounded-[4px] relative overflow-hidden cursor-pointer ${customClass} buttonAnimation montreg text-[12px] md:text-[16px] inline-block no-underline hover:bg-gray-800 transition-colors`}
      >
        <span className="relative z-[5]">{text}</span>
      </a>
    );
  };

  const readMoreText =
    t.contenidoPage?.readMore || (lang === "en" ? "Read more" : "Leer más");

  const BlogItem = ({ blog }) => {
    const hasEnglishVersion = Boolean(blog.title_en);

    const displayTitle = lang === "en"
      ? (blog.title_en || blog.title || "")
      : (blog.title || "");

    const rawContent = lang === "en"
      ? (blog.content_en || blog.content || "")
      : (blog.content || "");

    const displayContent = lang === "en"
      ? (blog.excerpt_en ?? blog.excerpt ?? rawContent)
      : (blog.excerpt ?? rawContent);

    const displayTags = Array.isArray(blog.tags)
      ? blog.tags.map((tag) => getTranslatedTag(tag, lang))
      : [];

    return (
      <div className="bg-white px-4 py-2 md:py-6 md:px-6 flex flex-col space-y-[20px] shadow-2xl rounded-sm">
        {/* Header con título y tags */}
        <div className="space-y-[5px]">
          <h3 className="montreg text-[20px] xl:text-[24px] tracking-[1px] !leading-[25px]">
            {displayTitle}
          </h3>
          <p className="text-[12px]">{displayTags.join(", ")}</p>
        </div>

        {/* Aviso: sin traducción al inglés todavía */}
        {lang === "en" && !hasEnglishVersion && (
          <p className="text-[12px] italic text-gray-500">
            {t.contenidoPage?.noEnglishVersion ||
              "This article isn't available in English yet — showing the Spanish version. We apologize for the inconvenience."}
          </p>
        )}

        {/* Contenido */}
        <p className="montreg tracking-[1px] text-[16px] !leading-[25px] truncate-multiline">
          {displayContent}
        </p>

        {/* Footer con fecha y botón */}
        <div className="flex justify-between items-end">
          <p className="montreg tracking-[1px] text-[16px] !leading-[25px]">
            {formatDateToDDMMYYYY(blog.updatedAt || blog.createdAt, false)}
          </p>
          {createButtonPride(
            readMoreText,
            `/blogs/${blog.slug}${lang === "en" ? "?lang=en" : ""}`,
            "w-fit self-end"
          )}
        </div>
      </div>
    );
  };

  const BlogItemSkeleton = () => (
    <div className="bg-white px-4 py-4 md:py-6 md:px-6 flex flex-col space-y-[20px] shadow-2xl rounded-sm animate-pulse min-h-[220px] justify-between">
      {/* Header con título y tags */}
      <div className="space-y-[10px]">
        <div className="h-6 md:h-7 bg-gray-200 rounded w-3/4" />
        <div className="h-3.5 bg-gray-200 rounded w-1/4" />
      </div>

      {/* Contenido */}
      <div className="space-y-2.5">
        <div className="h-4 bg-gray-200 rounded w-full" />
        <div className="h-4 bg-gray-200 rounded w-5/6" />
        <div className="h-4 bg-gray-200 rounded w-2/3" />
      </div>

      {/* Footer con fecha y botón */}
      <div className="flex justify-between items-end pt-2">
        <div className="h-4 bg-gray-200 rounded w-28" />
        <div className="h-11 bg-gray-200 rounded w-28" />
      </div>
    </div>
  );

  return (
    <div className="space-y-[35px] w-full">
      {/* Barra de etiquetas interactiva */}
      <div className="flex gap-4 overflow-hidden items-center w-full">
        <p className="montreg tracking-[1px] text-[16px] leading-[25px] flex-shrink-0">
          {t.contenidoPage?.tagsLabel || "Etiquetas:"}
        </p>
        <div className="flex overflow-x-auto gap-2 scrollbar-hide py-1">
          {tagList.map((item) => {
            const isSelected = selectedTag === item.apiKey;
            return (
              <button
                key={item.apiKey}
                type="button"
                onClick={() => handleTagClick(item.apiKey)}
                className={`py-2 px-4 border-[1px] rounded-[4px] montreg cursor-pointer whitespace-nowrap transition-all !min-w-fit text-[12px] select-none ${
                  isSelected
                    ? "tag-selected bg-black text-white border-solid border-black shadow-md"
                    : "bg-transparent text-black border-dashed border-black/40 hover:scale-[1.05] hover:border-black"
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Listado de blogs o estado vacío */}
      {!loading && blogs.length === 0 ? (
        <div className="space-y-[20px] w-full">
          <p className="text-center text-gray-600 py-8 montreg tracking-[1px] text-[16px]">
            {t.contenidoPage?.noBlogs ||
              "Aún no existen blogs disponibles. ¡Pronto tendremos contenido nuevo para ti!"}
          </p>
        </div>
      ) : (
        <div className="space-y-[20px] w-full">
          {/* Blogs de la página actual o Skeletons durante loading */}
          <div className="space-y-[20px]">
            {loading
              ? Array.from({ length: blogs.length > 0 ? blogs.length : Math.min(itemsPerPage, 3) }).map((_, index) => (
                  <BlogItemSkeleton key={`blog-skeleton-${index}`} />
                ))
              : blogs.map((blog) => <BlogItem key={blog.id || blog._id || blog.slug} blog={blog} />)}
          </div>

          {/* Controles de paginación */}
          <PaginationControls
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setPage}
            disabled={loading}
          />

          {/* Información de la página */}
          <div className="text-center text-sm text-gray-600 mt-4 min-h-[20px]">
            {!loading && (
              <>
                {lang === "en"
                  ? `Showing ${((currentPage - 1) * itemsPerPage) + 1}-${((currentPage - 1) * itemsPerPage) + blogs.length} of ${total} blogs`
                  : `Mostrando ${((currentPage - 1) * itemsPerPage) + 1}-${((currentPage - 1) * itemsPerPage) + blogs.length} de ${total} blogs`}
                {totalPages > 1 &&
                  (lang === "en"
                    ? ` • Page ${currentPage} of ${totalPages}`
                    : ` • Página ${currentPage} of ${totalPages}`)}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
