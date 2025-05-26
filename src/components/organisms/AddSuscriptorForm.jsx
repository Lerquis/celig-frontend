import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Form } from "../ui/form.js";
import { FormFieldCMS } from "../molecules/FormFieldCMS.jsx";
import { toast } from "sonner";
import { ButtonCMS } from "../atoms/ButtonCMS.jsx";
import { Plus } from "../icons/Plus.jsx";
import { suscriptorApi } from "@/api/suscriptor.js";
import { getCookieValueJSX } from "@/lib/auth.js";

export function AddSuscriptorForm({ fetchData }) {
  const loginSchema = z.object({
    email: z.string().min("1"),
  });

  const form = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
    },
  });

  const handleCreate = async () => {
    toast("Creado suscripcion");
    const response = await suscriptorApi.createSuscriptor(
      getCookieValueJSX("token"),
      form.getValues()
    );

    if (response.status === 201) {
      toast.success("Suscriptor agregado");
      fetchData();
    } else {
      toast.error("Algo salio mal creando el usuario");
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
              name="email"
              label="Correo electrónico"
              placeholder="correo@gmail.com"
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
