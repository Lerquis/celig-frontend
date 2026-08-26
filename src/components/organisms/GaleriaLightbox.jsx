import { useEffect, useRef, useState } from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { Dialog, DialogOverlay, DialogPortal, DialogTitle } from "@/components/ui/dialog";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";

/**
 * Lightbox de la galería: fondo a pantalla completa con desenfoque (blur) y opacidad,
 * imagen grande navegable y responsive (centrada vertical y horizontalmente para
 * imágenes tanto altas/verticales como panorámicas) + fila de miniaturas sincronizada.
 */
export function GaleriaLightbox({ images, selectedIndex, onClose }) {
  const isOpen = selectedIndex !== null && selectedIndex !== undefined;
  const [mainApi, setMainApi] = useState();
  const [thumbsApi, setThumbsApi] = useState();
  const [activeIndex, setActiveIndex] = useState(selectedIndex ?? 0);
  const containerRef = useRef(null);

  useEffect(() => {
    if (selectedIndex !== null && selectedIndex !== undefined) {
      setActiveIndex(selectedIndex);
      if (mainApi) {
        mainApi.scrollTo(selectedIndex, true);
      }
      if (thumbsApi) {
        thumbsApi.scrollTo(selectedIndex, true);
      }
    }
  }, [selectedIndex, mainApi, thumbsApi]);

  useEffect(() => {
    if (!mainApi || !thumbsApi) return;

    const onSelect = () => {
      const idx = mainApi.selectedScrollSnap();
      setActiveIndex(idx);
      thumbsApi.scrollTo(idx); // con align:"center" esto deja la miniatura activa centrada
    };

    onSelect();
    mainApi.on("select", onSelect).on("reInit", onSelect);
    return () => {
      mainApi.off("select", onSelect);
    };
  }, [mainApi, thumbsApi]);

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogPortal>
        <DialogOverlay className="fixed inset-0 z-[9999] bg-black/90 backdrop-blur-xl data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <DialogPrimitive.Content
          aria-describedby="lightbox-description"
          onOpenAutoFocus={(event) => {
            event.preventDefault();
            containerRef.current?.focus();
          }}
          className="fixed inset-0 z-[9999] flex flex-col justify-between w-screen h-screen p-3 sm:p-5 md:p-6 text-white outline-none select-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0"
        >
          <DialogTitle className="sr-only">Galería de imágenes</DialogTitle>
          <DialogDescription id="lightbox-description" className="sr-only">Visualizador de imágenes a pantalla completa</DialogDescription>

          {/* Barra superior con contador a la izquierda y botón de cerrar centrado encima de las imágenes */}
          <div className="relative flex items-center justify-center w-full shrink-0 z-30 px-2 sm:px-4 pt-1 sm:pt-2 min-h-[44px]">
            <div className="absolute left-2 sm:left-6 flex items-center">
              <span className="text-xs sm:text-sm font-medium tracking-wide text-white/90 bg-white/10 px-3.5 py-1.5 rounded-full border border-white/15 backdrop-blur-md select-none">
                {activeIndex + 1} / {images.length}
              </span>
            </div>

            {/* Botón de cerrar X en el puro medio */}
            <button
              type="button"
              onClick={onClose}
              className="p-2 sm:p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white/90 hover:text-white border border-white/15 transition-all duration-200 backdrop-blur-md cursor-pointer hover:scale-105 active:scale-95 shadow-lg"
              aria-label="Cerrar galería"
            >
              <X className="size-5 sm:size-6" />
            </button>
          </div>

          {/* Contenedor principal de imagen y navegación */}
          <div
            ref={containerRef}
            tabIndex={-1}
            onKeyDown={(event) => {
              if (event.key === "ArrowLeft") {
                event.preventDefault();
                mainApi?.scrollPrev();
              } else if (event.key === "ArrowRight") {
                event.preventDefault();
                mainApi?.scrollNext();
              }
            }}
            className="flex-1 min-h-0 w-full relative flex items-center justify-center outline-none my-2 sm:my-3"
          >
            <Carousel
              setApi={setMainApi}
              opts={{ startIndex: selectedIndex, loop: false }}
              className="w-full h-full flex flex-col justify-center items-center relative max-w-6xl mx-auto"
            >
              <CarouselContent
                wrapperClassName="h-full w-full"
                className="h-full -ml-0 items-center"
              >
                {images.map((image, index) => (
                  <CarouselItem
                    key={image.id ?? index}
                    className="h-full w-full flex items-center justify-center pl-0 p-1 sm:p-3 min-h-0 select-none"
                  >
                    <div className="relative flex items-center justify-center w-full h-full max-h-full">
                      <img
                        src={image.url || "/placeholder.svg"}
                        alt={`Imagen ${index + 1}`}
                        loading={Math.abs(index - activeIndex) <= 1 ? "eager" : "lazy"}
                        decoding="async"
                        className="max-h-[calc(100vh-210px)] max-w-[calc(100vw-32px)] sm:max-w-[80vw] md:max-w-[75vw] w-auto h-auto object-contain rounded-lg shadow-2xl transition-all duration-300 pointer-events-auto select-none"
                      />
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="left-2 sm:left-4 md:-left-12 lg:-left-14 z-30 size-10 sm:size-12 bg-white/10 hover:bg-white/25 text-white border-white/15 hover:text-white backdrop-blur-md transition-all shadow-xl hover:scale-110 disabled:opacity-20 disabled:hover:scale-100 cursor-pointer" />
              <CarouselNext className="right-2 sm:right-4 md:-right-12 lg:-right-14 z-30 size-10 sm:size-12 bg-white/10 hover:bg-white/25 text-white border-white/15 hover:text-white backdrop-blur-md transition-all shadow-xl hover:scale-110 disabled:opacity-20 disabled:hover:scale-100 cursor-pointer" />
            </Carousel>
          </div>

          {/* Fila de miniaturas sincronizada */}
          <div className="shrink-0 w-full max-w-3xl mx-auto z-30 pb-1 sm:pb-2 px-4">
            <Carousel
              setApi={setThumbsApi}
              opts={{ containScroll: "keepSnaps", dragFree: true, align: "center" }}
              className="w-full"
            >
              <CarouselContent className="-ml-2 py-1 items-center">
                {images.map((image, index) => (
                  <CarouselItem key={image.id ?? index} className="basis-auto pl-2">
                    <button
                      type="button"
                      onClick={() => mainApi?.scrollTo(index)}
                      className="block transition-transform duration-200 hover:scale-105 cursor-pointer focus:outline-hidden"
                      aria-label={`Ver imagen ${index + 1}`}
                    >
                      <img
                        src={image.url || "/placeholder.svg"}
                        alt={`Miniatura ${index + 1}`}
                        loading="lazy"
                        decoding="async"
                        className={cn(
                          "h-14 w-14 sm:h-16 sm:w-16 object-cover rounded-md transition-all duration-200 shadow-sm",
                          index === activeIndex
                            ? "opacity-100 ring-2 ring-white scale-105 shadow-md"
                            : "opacity-40 hover:opacity-80"
                        )}
                      />
                    </button>
                  </CarouselItem>
                ))}
              </CarouselContent>
            </Carousel>
          </div>
        </DialogPrimitive.Content>
      </DialogPortal>
    </Dialog>
  );
}
