import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

const ELLIPSIS = "ellipsis";

/**
 * Genera la lista de páginas a mostrar, truncando con elipsis cuando hay muchas.
 * Ej. con totalPages=21 y currentPage=10 → [1, "ellipsis", 9, 10, 11, "ellipsis", 21]
 * en vez de listar las 21 páginas seguidas.
 */
function generatePageNumbers(currentPage, totalPages, siblingCount = 1) {
  const totalPageNumbers = siblingCount * 2 + 5;

  if (totalPages <= totalPageNumbers) {
    return range(1, totalPages);
  }

  const leftSiblingIndex = Math.max(currentPage - siblingCount, 1);
  const rightSiblingIndex = Math.min(currentPage + siblingCount, totalPages);

  const shouldShowLeftEllipsis = leftSiblingIndex > 2;
  const shouldShowRightEllipsis = rightSiblingIndex < totalPages - 1;

  if (!shouldShowLeftEllipsis && shouldShowRightEllipsis) {
    const leftRange = range(1, 3 + siblingCount * 2);
    return [...leftRange, ELLIPSIS, totalPages];
  }

  if (shouldShowLeftEllipsis && !shouldShowRightEllipsis) {
    const rightRange = range(totalPages - (3 + siblingCount * 2) + 1, totalPages);
    return [1, ELLIPSIS, ...rightRange];
  }

  return [1, ELLIPSIS, ...range(leftSiblingIndex, rightSiblingIndex), ELLIPSIS, totalPages];
}

function range(start, end) {
  const length = end - start + 1;
  return Array.from({ length }, (_, i) => start + i);
}

import { cn } from "@/lib/utils";

export function PaginationControls({ currentPage, totalPages, onPageChange, disabled = false }) {
  if (totalPages <= 1) return null;

  const pages = generatePageNumbers(currentPage, totalPages);

  return (
    <div className={cn("flex justify-center mt-8 transition-opacity duration-200", disabled && "pointer-events-none opacity-60")}>
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              onClick={() => !disabled && onPageChange(Math.max(currentPage - 1, 1))}
              className={
                currentPage === 1 || disabled
                  ? "pointer-events-none opacity-50"
                  : "cursor-pointer"
              }
            />
          </PaginationItem>

          {pages.map((page, index) =>
            page === ELLIPSIS ? (
              <PaginationItem key={`ellipsis-${index}`}>
                <PaginationEllipsis />
              </PaginationItem>
            ) : (
              <PaginationItem key={page}>
                <PaginationLink
                  isActive={currentPage === page}
                  onClick={() => !disabled && onPageChange(page)}
                  className={disabled ? "pointer-events-none" : "cursor-pointer"}
                >
                  {page}
                </PaginationLink>
              </PaginationItem>
            )
          )}

          <PaginationItem>
            <PaginationNext
              onClick={() => !disabled && onPageChange(Math.min(currentPage + 1, totalPages))}
              className={
                currentPage === totalPages || disabled
                  ? "pointer-events-none opacity-50"
                  : "cursor-pointer"
              }
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}
