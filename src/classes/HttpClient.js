import { getCookieValue } from "@/lib/auth.js";

export class HttpClient {
  constructor(basePath = "") {
    this.baseUrl = import.meta.env.PUBLIC_API_BASE_URL || "";
    this.basePath = basePath;

    if (!this.baseUrl) {
      throw new Error("API_BASE_URL no está definido en .env");
    }
  }

  buildUrl(endpoint = "", params) {
    let url = `${this.baseUrl}${this.basePath}${endpoint}`;
    if (params) {
      Object.keys(params).forEach((key) => {
        url = url.replace(`{${key}}`, encodeURIComponent(params[key]));
      });
    }
    return url;
  }

  handleUnauthorized() {
    // En el cliente, eliminar cookie y redirigir
    if (typeof window !== "undefined") {
      document.cookie = "token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;";
      window.location.href = "/admin/login";
    }
    // En el servidor, solo devolvemos un objeto de error sin lanzar excepción
    // El error será manejado por el código que llama al HttpClient
  }

  async request({
    method = "GET",
    endpoint = "",
    params,
    body,
    token,
    headers = {},
  }) {
    const url = this.buildUrl(endpoint, params);

    const finalHeaders = {
      ...(typeof body === "string"
        ? { "Content-Type": "text/plain" }
        : { "Content-Type": "application/json" }),
      ...headers,
    };

    if (token) {
      finalHeaders["Authorization"] = `${token}`;
    }
    try {
      const response = await fetch(url, {
        method,
        headers: finalHeaders,
        body:
          ["POST", "PUT", "PATCH", "DELETE"].includes(method.toUpperCase()) &&
          body
            ? typeof body === "string"
              ? body
              : JSON.stringify(body)
            : undefined,
      });

      if (!response.ok) {
        if (response.status === 401) {
          this.handleUnauthorized();
          return { status: 401, body: { message: "Unauthorized", shouldRedirect: true } };
        }
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Error en la solicitud");
      }

      return { status: response.status, body: await response.json() };
    } catch (error) {
      console.log(error);
      console.log(error.message);

      // Verificar si el error es de tipo Unauthorized
      if (error.message === "Unauthorized") {
        this.handleUnauthorized();
        return { status: 401, body: { message: "Unauthorized", shouldRedirect: true } };
      }

      return {
        status: 500,
        body: { message: error.message || "Error en la solicitud" },
      };
    }
  }
}
