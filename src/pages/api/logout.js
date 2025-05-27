export const prerender = false;
export async function GET({ cookies }) {
  try {
    cookies.delete("token", { path: "/" });
    return new Response("Logout exitoso", {
      status: 200,
    });
  } catch (error) {
    console.log(error);
    return new Response("Internal Server Error", {
      status: 500,
    });
  }
}
