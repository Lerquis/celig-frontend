// src/components/GalleryMasonry.tsx
import Masonry from "react-masonry-css";

const breakpointColumnsObj = {
  default: 4,
  1100: 3,
  700: 2,
  500: 1,
};

export default function GalleryMasonry({ images }) {
  return (
    <Masonry
      breakpointCols={breakpointColumnsObj}
      className="flex ml-4 w-auto"
      columnClassName="pl-4"
    >
      {images.map((image, i) => (
        <img
          key={i}
          src={image.url || "/placeholder.svg"}
          alt="Imagen"
          className="w-full h-auto object-cover transition-all duration-300 group-hover:scale-105"
        />
      ))}
    </Masonry>
  );
}
