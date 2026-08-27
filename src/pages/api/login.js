export const prerender = false;

export async function POST({ request, cookies }) {
  try {
    const body = await request.json();
    const rawBaseUrl = import.meta.env.PUBLIC_API_BASE_URL || "";
    const baseUrl = rawBaseUrl.replace(/\/+$/, "");

    if (!baseUrl) {
      return new Response(
        JSON.stringify({ message: "PUBLIC_API_BASE_URL no está configurada" }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    const response = await fetch(`${baseUrl}/login/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (response.status === 200) {
      const data = await response.json();
      cookies.set("token", data.access_token || data.token, {
        path: "/",
        maxAge: data.expires_in || 86400, // 1 día por defecto
      });
      return new Response(JSON.stringify({ message: "Login exitoso" }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    } else {
      const errorData = await response.json().catch(() => ({}));
      return new Response(
        JSON.stringify({
          message:
            errorData.message ||
            response.statusText ||
            "Credenciales incorrectas",
        }),
        {
          status: response.status || 401,
          headers: { "Content-Type": "application/json" },
        }
      );
    }
  } catch (error) {
    console.error("Error en API route /api/login:", error);
    return new Response(
      JSON.stringify({ message: error.message || "Error interno del servidor" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
