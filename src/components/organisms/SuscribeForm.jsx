import { suscriptorApi } from "@/api";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Form } from "../ui/form";
import { ContactFormField } from "../molecules/ContactFormField";
import { toast, Toaster } from "sonner";

export function SuscribeForm({ children }) {
  const suscribeSchema = z.object({
    email: z.string().email(),
  });

  const form = useForm({
    resolver: zodResolver(suscribeSchema),
    defaultValues: {
      email: "",
    },
  });

  const handleSubmit = async () => {
    const response = await suscriptorApi.createSuscriptor("", form.getValues());
    if (response.status === 200) {
      toast.success("Te has suscrito a nuestros blogs");
    } else {
      toast.error("Algo salio mal en la suscripcion");
    }
  };

  const isLoading = form.formState.isSubmitting;

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleSubmit)}
          className="col-start-1 col-span-4 flex gap-4 md:col-span-6"
        >
          <ContactFormField
            name="email"
            label="Suscribete a nuestro blog"
            form={form}
            isLoading={isLoading}
          />
          {children}
        </form>
      </Form>
    </>
  );
}
