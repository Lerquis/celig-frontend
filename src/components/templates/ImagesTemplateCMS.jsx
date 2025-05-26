import { useEffect, useState } from "react";
import { CardTemplate } from "../organisms/CardTemplate";
import { galleryApi } from "@/api";
import { AddImageForm } from "../organisms/AddImageForm";
import { toast } from "sonner";
import { ImageGridContainer } from "../molecules/ImageGridContainer";
import Masonry from "react-masonry-css";

const breakpointColumnsObj = {
  default: 4,
  1100: 3,
  700: 2,
  500: 1,
};

export const ImagesTemplateCMS = () => {
  const [data, setData] = useState([]);

  const loadData = async () => {
    const images = await galleryApi.getGallery();
    if (images.status === 200) {
      setData(images.body.images);
    } else {
      toast.error("Algo salio mal obteniendo los datos");
      setData([]);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <div className="space-y-6">
      <CardTemplate title="Añadir nueva imagen">
        <AddImageForm loadData={loadData} />
      </CardTemplate>

      <CardTemplate title="Galería">
        <Masonry
          breakpointCols={breakpointColumnsObj}
          className="flex -ml-4 w-auto"
          columnClassName="pl-4"
        >
          {data.map((image) => (
            <ImageGridContainer
              key={image.id}
              loadData={loadData}
              image={image}
            />
          ))}
        </Masonry>
      </CardTemplate>
    </div>
  );
};
