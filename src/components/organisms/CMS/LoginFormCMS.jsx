import { useState } from "react";
import { toast } from "sonner";
import { Loader } from "@/components/icons/Loader";

export function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email.trim()) {
      toast.error("El correo electrónico es obligatorio");
      return;
    }
    if (!password || password.length < 6) {
      toast.error("La contraseña debe tener al menos 6 caracteres");
      return;
    }

    setIsLoading(true);
    toast.loading("Iniciando sesión...", { id: "login-toast" });

    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), password }),
      });

      if (response.ok || response.status === 200) {
        toast.success("¡Inicio de sesión exitoso!", { id: "login-toast" });
        window.location.href = "/admin/dashboard";
        return;
      } else {
        const errorData = await response.json().catch(() => ({}));
        toast.error(
          errorData.message || "Error al iniciar sesión. Verifica tus credenciales.",
          { id: "login-toast" }
        );
        setPassword("");
      }
    } catch (error) {
      console.error("Error al iniciar sesión:", error);
      toast.error("Error de conexión al iniciar sesión", { id: "login-toast" });
      setPassword("");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full">
      <div className="flex flex-col gap-2">
        <label
          htmlFor="email"
          className="text-sm font-medium leading-none text-gray-700"
        >
          Correo electrónico
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          autoComplete="email"
          placeholder="correo@gmail.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={isLoading}
          className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-black placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-black focus:border-black disabled:cursor-not-allowed disabled:opacity-50"
        />
      </div>

      <div className="flex flex-col gap-2">
        <label
          htmlFor="password"
          className="text-sm font-medium leading-none text-gray-700"
        >
          Contraseña
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          autoComplete="current-password"
          placeholder="Tu contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={isLoading}
          className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-black placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-black focus:border-black disabled:cursor-not-allowed disabled:opacity-50"
        />
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black bg-black text-white hover:bg-black/90 h-10 px-4 py-2 mt-4 cursor-pointer shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading && <Loader customClass="!text-white mr-2" />}
        {isLoading ? "Iniciando sesión..." : "Iniciar sesión"}
      </button>
    </form>
  );
}
