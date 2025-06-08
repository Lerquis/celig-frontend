import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Form } from "../ui/form";
import { ContactFormField } from "../molecules/ContactFormField";

export function ContactForm({ children }) {
  const contactSchema = z.object({
    name: z.string().min(3),
    email: z.string().min(5),
    message: z.string().min(10),
  });

  const form = useForm({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      email: "",
      name: "",
      message: "",
    },
  });

  const handleSubmit = async () => {
    console.log("submitted");
  };

  const isLoading = form.formState.isSubmitting;

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleSubmit)}
          className="col-start-1 col-span-4 space-y-[30px]"
        >
          <ContactFormField
            name="name"
            label="Nombre"
            form={form}
            isLoading={isLoading}
          />
          <ContactFormField
            name="email"
            label="Correo electrónico"
            form={form}
            isLoading={isLoading}
          />
          <ContactFormField
            name="message"
            label="Mensaje"
            type="textarea"
            form={form}
            isLoading={isLoading}
          />
          {children}
        </form>
      </Form>
    </>
  );
}
