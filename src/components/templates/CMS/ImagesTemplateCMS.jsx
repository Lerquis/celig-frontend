import { useEffect, useState } from "react";
import { CardTemplate } from "../../organisms/CMS/CardTemplate";
import { galleryApi } from "@/api";
import { AddImageForm } from "../../organisms/CMS/AddImageForm";
import { toast } from "sonner";
import { ImageGridContainer } from "../../molecules/CMS/ImageGridContainer";
import Masonry from "react-masonry-css";
import { Loader } from "../../icons/Loader";

const breakpointColumnsObj = {
  default: 4,
  1100: 3,
  700: 2,
  500: 1,
};

export const ImagesTemplateCMS = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadData = async () => {
    setLoading(true);
    const images = await galleryApi.getGallery();
    if (images.status === 200) {
      setData(images.body.images);
    } else {
      toast.error("Algo salio mal obteniendo los datos");
      setData([]);
    }
    setLoading(false);
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
        {loading ? (
          <div className="min-h-[100px] flex items-center">
            <Loader customClass="!text-black mx-auto" />
          </div>
        ) : data.length === 0 ? (
          <p className="font-semibold">No existen imágenes aun!</p>
        ) : (
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
        )}
      </CardTemplate>
    </div>
  );
};
