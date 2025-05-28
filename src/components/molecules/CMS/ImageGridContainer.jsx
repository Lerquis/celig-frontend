import { Trash2 } from "lucide-react";
import { Button } from "../../ui/button";
import { formatDateToDDMMYYYY } from "@/lib/dateFormatter";
import { galleryApi } from "@/api";
import { getCookieValueJSX } from "@/lib/auth";
import { toast } from "sonner";
import { Loader } from "../../icons/Loader";
import { useState } from "react";

export const ImageGridContainer = ({ image, loadData }) => {
  const [loading, setLoading] = useState(false);
  const handleDelete = async (name) => {
    setLoading(true);
    toast("Eliminando imagen");
    const response = await galleryApi.deleteImage(
      getCookieValueJSX("token"),
      name
    );
    if (response.status === 200) {
      toast.success("Imagen eliminada");
      loadData();
    } else {
      toast.error("Algo salio mal al eliminar la imagen");
    }
    setLoading(false);
  };

  return (
    <div key={image.id} className="relative group break-inside-avoid mb-4">
      <div className="relative overflow-hidden rounded-lg bg-muted">
        <img
          src={image.url || "/placeholder.svg"}
          alt="Imagen"
          className="w-full h-auto object-cover transition-all duration-300 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300">
          <Button
            variant="destructive"
            size="icon"
            className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 h-8 w-8"
            onClick={() => handleDelete(image.name)}
          >
            {loading ? <Loader /> : <Trash2 className="h-4 w-4" />}
          </Button>
        </div>
      </div>
      <p className="font-medium text-sm">
        {formatDateToDDMMYYYY(image.createdAt)}
      </p>
    </div>
  );
};
