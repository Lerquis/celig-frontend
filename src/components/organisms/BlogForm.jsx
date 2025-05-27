import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Form } from "../ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { FormFieldCMS } from "../molecules/FormFieldCMS";
import { ButtonCMS } from "../atoms/ButtonCMS";
import { Button } from "../ui/button";
import { blogApi } from "@/api";
import { getCookieValueJSX } from "@/lib/auth";

// Lista de etiquetas disponibles (asegúrate de pasarla como prop o importar según tu estructura)
const availableTags = [
  "Derechos del Comunidad LGBTIQ+",
  "Derecho Familia",
  "Derecho Laboral",
  "Derecho Migratorio",
  "Derecho Familias Homoparentales",
];

const blogSchema = z.object({
  title: z.string().min(1, "El título es obligatorio"),
  content: z.string().min(1, "El contenido es obligatorio"),
  tags: z.array(z.string()).min(1, "Al menos un tag es obligatorio"),
});

export const BlogForm = ({ blogEdit = null, loadData, handleClose }) => {
  const form = useForm({
    resolver: zodResolver(blogSchema),
    defaultValues: {
      title: blogEdit ? blogEdit.title : "",
      content: blogEdit ? blogEdit.content : "",
      tags: blogEdit ? blogEdit.tags : [],
    },
  });

  const handleSubmit = async () => {
    toast("Guardando blog");
    let response = null;
    if (blogEdit) {
      response = await blogApi.updateBlog(
        blogEdit.id,
        form.getValues(),
        getCookieValueJSX("token")
      );
    } else {
      response = await blogApi.createBlog(
        form.getValues(),
        getCookieValueJSX("token")
      );
    }

    if (response.status == 200 || response.status == 201) {
      toast.success("Blog guardado correctamente");
      loadData();
      handleClose();
    } else {
      toast.error("Algo salió mal guardando el blog");
    }
  };

  const isLoading = form.formState.isSubmitting;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormFieldCMS
          name="title"
          label="Título"
          placeholder="Tu título"
          form={form}
          isLoading={isLoading}
        />

        <FormField
          control={form.control}
          name="tags"
          render={() => (
            <FormItem className="space-y-2">
              <FormLabel>Etiquetas</FormLabel>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-h-32 overflow-y-auto">
                {availableTags.map((tag) => (
                  <FormField
                    key={tag}
                    control={form.control}
                    name="tags"
                    render={({ field }) => {
                      const isChecked = field.value?.includes(tag);
                      return (
                        <FormItem className="flex flex-row items-center space-x-2 space-y-0">
                          <FormControl>
                            <Checkbox
                              checked={isChecked}
                              onCheckedChange={(checked) => {
                                return checked
                                  ? field.onChange([...field.value, tag])
                                  : field.onChange(
                                      field.value.filter((v) => v !== tag)
                                    );
                              }}
                            />
                          </FormControl>
                          <FormLabel
                            htmlFor={`tag-${tag}`}
                            className="cursor-pointer text-sm font-normal"
                          >
                            {tag}
                          </FormLabel>
                        </FormItem>
                      );
                    }}
                  />
                ))}
              </div>

              <FormMessage />
            </FormItem>
          )}
        />

        <FormFieldCMS
          name="content"
          label="Contenido"
          placeholder="Contenido del blog"
          form={form}
          isLoading={isLoading}
          type="textarea"
        />

        <div className="flex justify-between  mt-4">
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
