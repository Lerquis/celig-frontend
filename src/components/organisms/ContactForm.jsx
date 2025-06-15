import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Form } from "../ui/form";
import { ContactFormField } from "../molecules/ContactFormField";
import { toast } from "sonner";

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
    const response = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...form.getValues(),
        access_key: "ff8e5031-c4a0-4b0d-959c-d665ef02380f",
        from_name: "Formulario CELIG",
        subject: "Nuevo mensaje del sitio web",
      }),
    });
    const data = await response.json();
    if (data.success) toast.success("Correo enviado!");
    else toast.error("Algo salio mal enviando el correo.");
    form.reset();
  };

  const isLoading = form.formState.isSubmitting;

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleSubmit)}
          className="col-start-1 col-span-4 md:col-span-8 space-y-[50px] xl:col-span-6"
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
