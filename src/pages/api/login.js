export const prerender = false;
export async function POST({ request, cookies }) {
  const body = await request.json();
  try {
    const response = await fetch(
      `${import.meta.env.PUBLIC_API_BASE_URL}/login/`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      }
    );
    if (response.status === 200) {
      const data = await response.json();
      cookies.set("token", data.access_token, {
        path: "/",
        maxAge: data.expires_in, // 1 día
      });
      return new Response("Login exitoso", {
        status: 200,
      });
    } else {
      return new Response(response.statusText, {
        status: response.status,
      });
    }
  } catch (error) {
    console.log(error);
    return new Response("Internal Server Error", {
      status: 500,
    });
  }
}
