import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Form } from "../../ui/form.js";
import { FormFieldCMS } from "../../molecules/CMS/FormFieldCMS.jsx";
import { toast } from "sonner";
import { ButtonCMS } from "@/components/atoms/CMS/ButtonCMS.jsx";
import { Plus } from "../../icons/Plus.jsx";
import { getCookieValueJSX } from "@/lib/auth.js";
import { podcastApi } from "@/api/podcasts.js";

export function AddPodcastForm({ fetchData }) {
  const loginSchema = z.object({
    url: z.string().min("1"),
  });

  const form = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      url: "",
    },
  });

  const handleCreate = async () => {
    toast("Creando podcast");
    const response = await podcastApi.createPodcast(
      getCookieValueJSX("token"),
      form.getValues()
    );

    if (response.status === 201) {
      toast.success("Podcast agregado");
      form.reset();
      fetchData();
    } else {
      toast.error("Algo salio mal creando el podcast");
    }
  };

  const isLoading = form.formState.isSubmitting;

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleCreate)}
          className="grid grid-cols-[1fr_1fr] gap-2 items-end"
        >
          <div className="col-start-1 col-span-10">
            <FormFieldCMS
              name="url"
              label="URL del podcast"
              placeholder="https://open.spotify.com/episode/6piL112ObyBmyslq6DFHlW?si=ecbfe77820564ec2"
              form={form}
              isLoading={isLoading}
            />
          </div>
          <div className="col-start-12 col-span-12">
            <ButtonCMS
              customClass="cursor-pointer"
              type="submit"
              loading={isLoading}
            >
              <Plus />
              Agregar
            </ButtonCMS>
          </div>
        </form>
      </Form>
    </>
  );
}
