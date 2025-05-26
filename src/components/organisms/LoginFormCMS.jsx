import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Form } from "../ui/form.js";
import { FormFieldCMS } from "../molecules/FormFieldCMS.jsx";
import { toast } from "sonner";
import { ButtonCMS } from "../atoms/ButtonCMS.jsx";

export function LoginForm() {
  const loginSchema = z.object({
    email: z.string().min("1"),
    password: z
      .string()
      .min(6, "La contraseña debe tener al menos 6 caracteres"),
  });

  const form = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const handleSubmit = async () => {
    toast("Iniciando sesión...");

    try {
      const response = await fetch("/api/login/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form.getValues()),
      });

      if (response.status === 200) {
        window.location.href = "/admin/dashboard";
        return;
      } else {
        toast.error("Error al iniciar sesión");
        form.resetField("password");
      }
    } catch (error) {
      console.log(error);
      toast.error("Error al iniciar sesión");
      form.resetField("password");
    }
  };

  const isLoading = form.formState.isSubmitting;

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleSubmit)}
          className="flex flex-col gap-4"
        >
          <FormFieldCMS
            name="email"
            label="Correo electrónico"
            placeholder="correo@gmail.com"
            form={form}
            isLoading={isLoading}
          />
          <FormFieldCMS
            name="password"
            label="Contraseña"
            type="password"
            placeholder="Tu contrasena"
            form={form}
            isLoading={isLoading}
          />
          <ButtonCMS
            customClass="w-full mt-4 cursor-pointer"
            type="submit"
            loading={isLoading}
          >
            Iniciar sesión
          </ButtonCMS>
        </form>
      </Form>
    </>
  );
}
