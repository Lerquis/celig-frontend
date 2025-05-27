import { useRef, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { Form } from "../ui/form";
import { Button } from "../ui/button";
import { FormFieldCMS } from "../molecules/FormFieldCMS";
import { ButtonCMS } from "../atoms/ButtonCMS";
import { Trash2 } from "lucide-react";
import { testimonialApi } from "@/api";
import { getCookieValueJSX } from "@/lib/auth";

const testimonialSchema = z.object({
  names: z.string().min(1, "El nombre es obligatorio"),
  content: z.string().min(1, "El contenido es obligatorio"),
  image: z.string().optional(),
});

export const TestimonialForm = ({
  testimonialEdit = null,
  loadData,
  handleClose,
}) => {
  const fileInputRef = useRef(null);

  const form = useForm({
    resolver: zodResolver(testimonialSchema),
    defaultValues: {
      names: testimonialEdit?.names || "",
      content: testimonialEdit?.content || "",
      image: testimonialEdit?.imageUrl || "",
    },
  });

  const isLoading = form.formState.isSubmitting;
  const imageValue =
    form.watch("image") === "delete" ? "" : form.watch("image");

  const handleImageChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validTypes = ["image/png", "image/jpeg", "image/jpg"];
    if (!validTypes.includes(file.type)) {
      toast.error("Solo se permiten imágenes PNG o JPG");
      return;
    }

    const base64 = await toBase64(file);
    form.setValue("image", base64);
  };

  const toBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
    });

  const handleImageRemove = () => {
    if (testimonialEdit.imageUrl) form.setValue("image", "delete");
    else form.setValue("image", "");
  };

  const handleSubmit = async () => {
    toast("Guardando testimonio");
    let response = null;
    if (testimonialEdit) {
      response = await testimonialApi.updateTestimonial(
        testimonialEdit.id,
        {
          names: form.getValues().names,
          content: form.getValues().content,
          ...(form.getValues().image !== testimonialEdit?.imageUrl && {
            image: form.getValues().image,
          }),
        },
        getCookieValueJSX("token")
      );
    } else {
      response = await testimonialApi.createTestimonial(
        form.getValues(),
        getCookieValueJSX("token")
      );
    }
    if (response.status == 200 || response.status == 201) {
      toast.success("Testimonio guardado correctamente");
      loadData();
      handleClose();
    } else {
      toast.error("Algo salió mal guardando el testimonio");
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormFieldCMS
          name="names"
          label="Nombres"
          placeholder="Ariana y Camila"
          form={form}
          isLoading={isLoading}
        />

        <FormFieldCMS
          name="content"
          label="Contenido"
          placeholder="Contenido del testimonio"
          form={form}
          isLoading={isLoading}
          type="textarea"
        />

        {/* Campo de imagen */}
        <div className="space-y-2">
          <label className="text-sm font-medium flex items-center gap-2">
            Imagen <span className="text-[10px] font-bold">Opcional</span>
          </label>
          {imageValue ? (
            <div className="relative group break-inside-avoid mb-4">
              <div className="relative overflow-hidden rounded-lg bg-muted">
                <img
                  src={imageValue || "/placeholder.svg"}
                  alt="Imagen"
                  className="w-full h-auto object-cover transition-all duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300">
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 h-8 w-8"
                    onClick={() => handleImageRemove()}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <label
              htmlFor="image-upload"
              className="cursor-pointer flex flex-col items-center justify-center border border-dashed rounded-md h-32 text-sm text-muted-foreground"
            >
              <span>Haz clic o arrastra para subir una imagen</span>
              <input
                type="file"
                id="image-upload"
                accept="image/png, image/jpeg, image/jpg"
                className="hidden"
                onChange={handleImageChange}
                ref={fileInputRef}
              />
            </label>
          )}
        </div>

        <div className="flex justify-between mt-4">
          <Button onClick={handleClose} variant="outline" type="button">
            Cancelar
          </Button>
          <ButtonCMS
            customClass="cursor-pointer"
            type="submit"
            loading={isLoading}
          >
            Guardar
          </ButtonCMS>
        </div>
      </form>
    </Form>
  );
};
