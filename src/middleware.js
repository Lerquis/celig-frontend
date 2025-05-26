import { getUserFromRequest } from "./lib/auth.js";

export async function onRequest(context, next) {
  const { pathname } = context.url;
  if (pathname.startsWith("/admin")) {
    const user = getUserFromRequest(context.request);

    if (pathname.includes("login")) {
      if (user) {
        return Response.redirect(new URL("/admin/dashboard", context.url));
      }
      return next();
    } else {
      if (!user) {
        return Response.redirect(new URL("/admin/login", context.url));
      }
    }
  }
  return next();
}
