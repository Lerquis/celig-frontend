import { useState, useEffect } from "react";
import { blogApi } from "@/api";
import { formatDateToDDMMYYYY } from "@/lib/dateFormatter";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

const ITEMS_PER_PAGE = 5;

export const ContenidoBlogsReact = ({ initialBlogs = [] }) => {
  const [blogs, setBlogs] = useState(initialBlogs);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [selectedTags, setSelectedTags] = useState([]);

  // Calcular blogs para la página actual
  const totalPages = Math.ceil(blogs.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentBlogs = blogs.slice(startIndex, endIndex);

  const handleTagClick = async (tagText) => {
    setLoading(true);
    let newSelectedTags;
    
    if (selectedTags.includes(tagText)) {
      // Si el tag ya está seleccionado, deseleccionarlo (permitir mostrar todos)
      newSelectedTags = [];
    } else {
      // Si no está seleccionado, seleccionar solo este (reemplazar cualquier selección anterior)
      newSelectedTags = [tagText];
    }
    
    setSelectedTags(newSelectedTags);
    
    try {
      // Codificar los tags para manejar caracteres especiales como "+"
      const encodedTags = newSelectedTags.map(tag => encodeURIComponent(tag));
      const response = await blogApi.getBlogsByTag(encodedTags);
      if (response.status === 200) {
        setBlogs(response.body.blogs);
        setCurrentPage(1); // Reset to first page when filtering
      }
    } catch (error) {
      console.error("Error fetching blogs:", error);
    } finally {
      setLoading(false);
    }
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
        {blog.content}
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

  const PaginationControls = () => {
    if (totalPages <= 1) return null;

    const generatePageNumbers = () => {
      const pages = [];
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
      return pages;
    };

    return (
      <div className="flex justify-center mt-8">
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
              />
            </PaginationItem>
            
            {generatePageNumbers().map((page) => (
              <PaginationItem key={page}>
                <PaginationLink
                  isActive={currentPage === page}
                  onClick={() => setCurrentPage(page)}
                  className="cursor-pointer"
                >
                  {page}
                </PaginationLink>
              </PaginationItem>
            ))}
            
            <PaginationItem>
              <PaginationNext
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    );
  };

  useEffect(() => {
    // Actualizar tags cuando cambian los blogs filtrados
    const tags = document.querySelectorAll(".content-blog-tag");
    
    const handleTagClickEvent = (e) => {
      e.preventDefault();
      const tagText = e.target.textContent.trim();
      
      // Primero remover la clase de todos los tags
      tags.forEach(tag => tag.classList.remove("tag-selected"));
      
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

  if (loading) {
    return (
      <div className="space-y-[20px] w-full">
        <div className="flex flex-col items-center justify-center min-h-[200px] p-10">
          <div className="w-12 h-12 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin mb-4"></div>
          <p className="text-gray-600">Cargando blogs...</p>
        </div>
      </div>
    );
  }

  if (blogs.length === 0) {
    return (
      <div className="space-y-[20px] w-full">
        <p className="text-center text-gray-600 py-8 montreg tracking-[1px] text-[16px]">
          Aún no existen blogs disponibles. ¡Pronto tendremos contenido nuevo para ti!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-[20px] w-full">
      {/* Blogs de la página actual */}
      <div className="space-y-[20px]">
        {currentBlogs.map((blog) => (
          <BlogItem key={blog.id} blog={blog} />
        ))}
      </div>

      {/* Controles de paginación */}
      <PaginationControls />

      {/* Información de la página */}
      <div className="text-center text-sm text-gray-600 mt-4">
        Mostrando {startIndex + 1}-{Math.min(endIndex, blogs.length)} de {blogs.length} blogs
        {totalPages > 1 && ` • Página ${currentPage} de ${totalPages}`}
      </div>
    </div>
  );
};