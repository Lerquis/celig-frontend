import cookie from "cookie";

export function getUserFromRequest(req) {
  const cookies = cookie.parse(req.headers.get("cookie") || "");
  if (!cookies.token) return null;
  return cookies.token;
}

export const getCookieValue = (Astro, name) => {
  const headers = Astro.request.headers;
  const cookieHeader = headers.get("cookie") || "";
  const value =
    cookieHeader
      .split("; ")
      .find((c) => c.startsWith(`${name}=`))
      ?.split("=")[1] || null;

  return value || null;
};

export const getCookieValueJSX = (name) => {
  const cookies = document.cookie.split("; ");
  for (const cookie of cookies) {
    const [key, value] = cookie.split("=");
    if (key === name) return decodeURIComponent(value);
  }
  return null;
};
