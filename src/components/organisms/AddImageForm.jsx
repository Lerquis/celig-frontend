import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Upload, X } from "lucide-react";
import { toast } from "sonner";
import { galleryApi } from "@/api";
import { getCookieValueJSX } from "@/lib/auth";

const fileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file); // Incluye encabezado: data:image/png;base64,...
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
};

export const AddImageForm = ({ loadData }) => {
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const acceptedTypes = ["image/jpeg", "image/jpg", "image/png"];
  const maxFileSize = 5 * 1024 * 1024; // 5MB

  const validateFile = (file) => {
    if (!acceptedTypes.includes(file.type)) {
      toast.error("Tipo de archivo no válido");
      return false;
    }

    if (file.size > maxFileSize) {
      toast.error("Archivo muy grande");
      return false;
    }

    return true;
  };

  const processFiles = useCallback((files) => {
    const validFiles = [];

    Array.from(files).forEach((file) => {
      if (validateFile(file)) {
        const preview = URL.createObjectURL(file);
        validFiles.push({
          file,
          preview,
          id: Math.random().toString(36).substr(2, 9),
        });
      }
    });

    setUploadedFiles((prev) => [...prev, ...validFiles]);
  }, []);

  const handleDrop = useCallback(
    (e) => {
      e.preventDefault();
      setIsDragOver(false);

      const files = e.dataTransfer.files;
      if (files.length > 0) {
        processFiles(files);
      }
    },
    [processFiles]
  );

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleFileSelect = useCallback(
    (e) => {
      const files = e.target.files;
      if (files && files.length > 0) {
        processFiles(files);
      }
      e.target.value = "";
    },
    [processFiles]
  );

  const removeFile = (id) => {
    setUploadedFiles((prev) => {
      const updated = prev.filter((file) => file.id !== id);
      const fileToRemove = prev.find((file) => file.id === id);
      if (fileToRemove) {
        URL.revokeObjectURL(fileToRemove.preview);
      }
      return updated;
    });
  };

  const uploadFiles = async () => {
    if (uploadedFiles.length === 0) return;

    setIsUploading(true);

    try {
      for (const uploadedFile of uploadedFiles) {
        const base64 = await fileToBase64(uploadedFile.file);

        const response = await galleryApi.createImage(
          getCookieValueJSX("token"),
          base64
        );

        if (response.status === 201) {
          loadData();
          toast.success("Imágen subida");
        } else {
          toast.error("Error al subir una imágen");
        }
      }

      uploadedFiles.forEach((file) => URL.revokeObjectURL(file.preview));
      setUploadedFiles([]);
    } catch (error) {
      toast.error("Error");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div
        className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
          isDragOver
            ? "border-primary bg-primary/5"
            : "border-muted-foreground/25 hover:border-muted-foreground/50"
        }`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        <input
          type="file"
          multiple
          accept="image/jpeg,image/jpg,image/png"
          onChange={handleFileSelect}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
        <div className="flex flex-col items-center space-y-2">
          <Upload className="h-10 w-10 text-muted-foreground" />
          <div>
            <p className="text-lg font-medium">
              Arrastra y suelta tus imágenes aquí
            </p>
            <p className="text-sm text-muted-foreground">
              o haz clic para seleccionar archivos
            </p>
          </div>
          <p className="text-xs text-muted-foreground">
            JPEG, JPG, PNG hasta 5MB cada una
          </p>
        </div>
      </div>

      {uploadedFiles.length > 0 && (
        <div className="space-y-4">
          <h3 className="font-medium">Archivos seleccionados:</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {uploadedFiles.map((uploadedFile) => (
              <div key={uploadedFile.id} className="relative group">
                <div className="aspect-square rounded-lg overflow-hidden bg-muted">
                  <img
                    src={uploadedFile.preview || "/placeholder.svg"}
                    alt={uploadedFile.file.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <Button
                  variant="destructive"
                  size="icon"
                  className="absolute top-2 right-2 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => removeFile(uploadedFile.id)}
                >
                  <X className="h-3 w-3" />
                </Button>
                <p className="mt-1 text-xs text-muted-foreground truncate">
                  {uploadedFile.file.name}
                </p>
              </div>
            ))}
          </div>
          <div className="flex justify-end">
            <Button onClick={uploadFiles} disabled={isUploading}>
              {isUploading
                ? "Subiendo..."
                : `Subir ${uploadedFiles.length} imagen(es)`}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
