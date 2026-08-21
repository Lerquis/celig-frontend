import { useCallback, useEffect, useState } from "react";
import { blogApi } from "@/api";
import { formatDateToDDMMYYYY } from "@/lib/dateFormatter";
import { usePaginatedList } from "@/hooks/usePaginatedList";
import { PaginationControls } from "@/components/molecules/PaginationControls";

export const ContenidoBlogsReact = ({ initialData = { blogs: [] }, itemsPerPage = 9 }) => {
  const [selectedTags, setSelectedTags] = useState([]);

  const fetchPage = useCallback(
    (page) => {
      const tag = selectedTags.map((t) => encodeURIComponent(t));
      return blogApi.getBlogsByTag(tag, { page, limit: itemsPerPage });
    },
    [selectedTags, itemsPerPage]
  );

  const { items: blogs, page: currentPage, totalPages, total, loading, setPage, reset } =
    usePaginatedList({
      fetchPage,
      legacyKey: "blogs",
      itemsPerPage,
      initialData,
    });

  const handleTagClick = async (tagText) => {
    const newSelectedTags = selectedTags.includes(tagText) ? [] : [tagText];
    setSelectedTags(newSelectedTags);

    // Se pasa un fetcher explícito para evitar depender del closure de `fetchPage`,
    // que todavía no refleja `newSelectedTags` en este mismo ciclo de render.
    const encodedTags = newSelectedTags.map((tag) => encodeURIComponent(tag));
    await reset((page) => blogApi.getBlogsByTag(encodedTags, { page, limit: itemsPerPage }));
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

  const BlogItem = ({ blog }) => (
    <div className="bg-white px-4 py-2 md:py-6 md:px-6 flex flex-col space-y-[20px] shadow-2xl rounded-sm">
      {/* Header con título y tags */}
      <div className="space-y-[5px]">
        <h3 className="montreg text-[20px] xl:text-[24px] tracking-[1px] !leading-[25px]">
          {blog.title}
        </h3>
        <p className="text-[12px]">{blog.tags.join(", ")}</p>
      </div>

      {/* Contenido */}
      <p className="montreg tracking-[1px] text-[16px] !leading-[25px] truncate-multiline">
        {blog.excerpt ?? blog.content}
      </p>

      {/* Footer con fecha y botón */}
      <div className="flex justify-between items-end">
        <p className="montreg tracking-[1px] text-[16px] !leading-[25px]">
          {formatDateToDDMMYYYY(blog.updatedAt, false)}
        </p>
        {createButtonPride("Leer más", `/blogs/${blog.slug}`, "w-fit self-end")}
      </div>
    </div>
  );

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

  useEffect(() => {
    // Actualizar tags cuando cambian los blogs filtrados
    const tags = document.querySelectorAll(".content-blog-tag");

    const handleTagClickEvent = (e) => {
      e.preventDefault();
      const tagText = e.target.textContent.trim();

      // Primero remover la clase de todos los tags
      tags.forEach((tag) => tag.classList.remove("tag-selected"));

      // Si el tag clickeado no estaba seleccionado, seleccionarlo
      if (!selectedTags.includes(tagText)) {
        e.target.classList.add("tag-selected");
      }

      handleTagClick(tagText);
    };

    tags.forEach((tag) => {
      tag.removeEventListener("click", handleTagClickEvent);
      tag.addEventListener("click", handleTagClickEvent);
    });

    return () => {
      tags.forEach((tag) => {
        tag.removeEventListener("click", handleTagClickEvent);
      });
    };
  }, [selectedTags]);

  if (!loading && blogs.length === 0) {
    return (
      <div className="space-y-[20px] w-full">
        <p className="text-center text-gray-600 py-8 montreg tracking-[1px] text-[16px]">
          Aún no existen blogs disponibles. ¡Pronto tendremos contenido nuevo para ti!
        </p>
      </div>
    );
  }

  const skeletonCount = blogs.length > 0 ? blogs.length : Math.min(itemsPerPage, 3);
  const startIndex = (currentPage - 1) * itemsPerPage;

  return (
    <div className="space-y-[20px] w-full">
      {/* Blogs de la página actual o Skeletons durante loading */}
      <div className="space-y-[20px]">
        {loading
          ? Array.from({ length: skeletonCount }).map((_, index) => (
              <BlogItemSkeleton key={`blog-skeleton-${index}`} />
            ))
          : blogs.map((blog) => <BlogItem key={blog.id} blog={blog} />)}
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
            Mostrando {startIndex + 1}-{startIndex + blogs.length} de {total} blogs
            {totalPages > 1 && ` • Página ${currentPage} de ${totalPages}`}
          </>
        )}
      </div>
    </div>
  );
};
