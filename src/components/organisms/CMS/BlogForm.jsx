import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Form } from "../../ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { FormFieldCMS } from "../../molecules/CMS/FormFieldCMS";
import { ButtonCMS } from "@/components/atoms/CMS/ButtonCMS";
import { Button } from "../../ui/button";
import { blogApi } from "@/api";
import { getCookieValueJSX } from "@/lib/auth";

const availableTags = [
  "Derechos de la Comunidad LGBTIQ+",
  "Derecho Familia",
  "Derecho Laboral",
  "Derecho Migratorio",
  "Derecho Familias Homoparentales",
];

const blogSchema = z.object({
  title: z.string().min(1, "El título en español es obligatorio"),
  content: z.string().min(1, "El contenido en español es obligatorio"),
  title_en: z.string().optional(),
  content_en: z.string().optional(),
  tags: z.array(z.string()).min(1, "Al menos una etiqueta es obligatoria"),
});

export const BlogForm = ({ blogEdit = null, loadData, handleClose }) => {
  const initialTitle = blogEdit?.title || "";
  const initialContent = blogEdit?.content || "";
  const initialTitleEn = blogEdit?.title_en || "";
  const initialContentEn = blogEdit?.content_en || "";

  const form = useForm({
    resolver: zodResolver(blogSchema),
    defaultValues: {
      title: initialTitle,
      content: initialContent,
      title_en: initialTitleEn,
      content_en: initialContentEn,
      tags: blogEdit ? blogEdit.tags || [] : [],
    },
  });

  const handleSubmit = async () => {
    toast("Guardando blog");
    let response = null;
    const values = form.getValues();
    const payload = {
      title: values.title,
      content: values.content,
      title_en: values.title_en || "",
      content_en: values.content_en || "",
      tags: values.tags,
    };

    if (blogEdit) {
      response = await blogApi.updateBlog(
        blogEdit.id,
        payload,
        getCookieValueJSX("token")
      );
    } else {
      response = await blogApi.createBlog(
        payload,
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
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        {/* Sección de contenido en Español */}
        <div className="space-y-4 rounded-md border p-4 bg-muted/20">
          <div className="flex items-center gap-2 pb-2 border-b">
            <span className="text-base font-semibold">Español (Principal)</span>
            <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full font-medium">Requerido</span>
          </div>

          <FormFieldCMS
            name="title"
            label="Título en español"
            placeholder="Título del artículo en español"
            form={form}
            isLoading={isLoading}
          />

          <FormFieldCMS
            name="content"
            label="Contenido en español"
            placeholder="Escribe el contenido del blog en español..."
            form={form}
            isLoading={isLoading}
            type="textarea"
          />
        </div>

        {/* Sección de contenido en Inglés */}
        <div className="space-y-4 rounded-md border p-4 bg-muted/20">
          <div className="flex items-center gap-2 pb-2 border-b">
            <span className="text-base font-semibold">Inglés (English Translation)</span>
            <span className="text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded-full font-medium">Opcional</span>
          </div>

          <FormFieldCMS
            name="title_en"
            label="Título en inglés"
            placeholder="Article title in English (optional)"
            form={form}
            isLoading={isLoading}
          />

          <FormFieldCMS
            name="content_en"
            label="Contenido en inglés"
            placeholder="Write blog content in English (optional)..."
            form={form}
            isLoading={isLoading}
            type="textarea"
          />
        </div>

        {/* Sección de Etiquetas */}
        <FormField
          control={form.control}
          name="tags"
          render={() => (
            <FormItem className="space-y-2">
              <FormLabel>Etiquetas</FormLabel>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 max-h-36 overflow-y-auto p-2 border rounded-md">
                {availableTags.map((tag) => (
                  <FormField
                    key={tag}
                    control={form.control}
                    name="tags"
                    render={({ field }) => {
                      const isChecked = field.value?.includes(tag);
                      return (
                        <FormItem className="flex flex-row items-center space-x-2 space-y-0 py-1">
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
                            className="cursor-pointer text-sm font-normal select-none"
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

        <div className="flex justify-between mt-6 pt-2 border-t">
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
