import { useCallback, useEffect, useRef, useState } from "react";
import Masonry from "react-masonry-css";
import { galleryApi } from "@/api";
import { GaleriaLightbox } from "@/components/organisms/GaleriaLightbox";

const breakpointColumnsObj = {
  default: 4,
  1100: 3,
  700: 2,
  500: 1,
};

function normalizeInitial(data) {
  if (data && Array.isArray(data.items)) {
    return { images: data.items, hasMore: Boolean(data.hasMore) };
  }
  // Modo legacy: el backend ya trajo todas las imágenes de una vez, no hay más que cargar.
  return { images: data?.images ?? [], hasMore: false };
}

export default function GaleriaMasonry({ initialData, itemsPerPage = 20 }) {
  const initial = normalizeInitial(initialData);
  const [images, setImages] = useState(initial.images);
  const [hasMore, setHasMore] = useState(initial.hasMore);
  const [page, setPage] = useState(1);
  const [loadingMore, setLoadingMore] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(null);
  const sentinelRef = useRef(null);

  const loadMore = useCallback(async () => {
    if (loadingMore || !hasMore) return;
    setLoadingMore(true);
    try {
      const nextPage = page + 1;
      const response = await galleryApi.getGallery({ page: nextPage, limit: itemsPerPage });
      if (response.status === 200 && Array.isArray(response.body.items)) {
        setImages((prev) => [...prev, ...response.body.items]);
        setPage(nextPage);
        setHasMore(Boolean(response.body.hasMore));
      } else {
        setHasMore(false);
      }
    } finally {
      setLoadingMore(false);
    }
  }, [loadingMore, hasMore, page, itemsPerPage]);

  useEffect(() => {
    if (!hasMore || !sentinelRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) loadMore();
      },
      { rootMargin: "400px" }
    );

    observer.observe(sentinelRef.current);
    return () => observer.disconnect();
  }, [hasMore, loadMore]);

  return (
    <div>
      <Masonry
        breakpointCols={breakpointColumnsObj}
        className="flex ml-4 w-auto"
        columnClassName="pl-4"
      >
        {images.map((image, i) => (
          <button
            key={image.id ?? i}
            type="button"
            onClick={() => setLightboxIndex(i)}
            className="block w-full mb-4 cursor-zoom-in"
            aria-label="Ver imagen en grande"
          >
            <img
              src={image.url || "/placeholder.svg"}
              alt="Imagen"
              loading="lazy"
              decoding="async"
              className="w-full h-auto object-cover transition-all duration-300 hover:scale-105"
            />
          </button>
        ))}
      </Masonry>

      {hasMore && (
        <div ref={sentinelRef} className="flex justify-center py-8">
          <button
            type="button"
            onClick={loadMore}
            disabled={loadingMore}
            className="bg-black text-white font-semibold py-3 px-6 rounded-[4px] montreg text-[12px] md:text-[16px] hover:bg-gray-800 transition-colors disabled:opacity-50"
          >
            {loadingMore ? "Cargando..." : "Cargar más"}
          </button>
        </div>
      )}

      <GaleriaLightbox
        images={images}
        selectedIndex={lightboxIndex}
        onClose={() => setLightboxIndex(null)}
      />
    </div>
  );
}
