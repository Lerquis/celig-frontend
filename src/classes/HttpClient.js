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
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Error en la solicitud");
      }

      return { status: response.status, body: await response.json() };
    } catch (error) {
      console.log(error);
      return {
        status: 500,
        body: { message: error.message || "Error en la solicitud" },
      };
    }
  }
}
