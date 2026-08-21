import { useCallback } from "react";
import { podcastApi } from "@/api";
import { usePaginatedList } from "@/hooks/usePaginatedList";
import { PaginationControls } from "@/components/molecules/PaginationControls";

export const ContenidoPodcastsReact = ({ initialData = { podcasts: [] }, itemsPerPage = 6 }) => {
  const fetchPage = useCallback(
    (page) => podcastApi.getPodcasts({ page, limit: itemsPerPage }),
    [itemsPerPage]
  );

  const {
    items: podcasts,
    page: currentPage,
    totalPages,
    loading,
    setPage,
  } = usePaginatedList({
    fetchPage,
    legacyKey: "podcasts",
    itemsPerPage,
    initialData,
  });

  const PodcastItemSkeleton = () => (
    <div className="h-[152px] w-full rounded-[12px] bg-gray-200/80 animate-pulse" />
  );

  if (!loading && podcasts.length === 0) {
    return (
      <p className="text-center text-gray-600 py-8 montreg tracking-[1px] text-[16px]">
        Aún no existen podcasts disponibles. ¡Pronto tendremos contenido nuevo para ti!
      </p>
    );
  }

  const skeletonCount = podcasts.length > 0 ? podcasts.length : Math.min(itemsPerPage, 6);

  return (
    <div className="space-y-[20px] w-full">
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-[10px]">
        {loading
          ? Array.from({ length: skeletonCount }).map((_, index) => (
              <PodcastItemSkeleton key={`podcast-skeleton-${index}`} />
            ))
          : podcasts.map((podcast) => (
              <iframe
                key={podcast.id}
                className="rounded-[12px]"
                src={podcast.url}
                width="100%"
                height="152"
                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                loading="lazy"
              />
            ))}
      </div>

      <PaginationControls
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setPage}
        disabled={loading}
      />
    </div>
  );
};
