import type { APIRoute } from "astro";
import { servicios } from "@/data/servicios";
import { blogApi } from "@/api";

export const GET: APIRoute = async () => {
  const siteUrl = "https://celigcr.com";

  // Páginas estáticas
  const staticPages = [
    { url: "", priority: "1.0", changefreq: "weekly" },
    { url: "/contenido", priority: "0.8", changefreq: "weekly" },
    { url: "/testimonios", priority: "0.7", changefreq: "monthly" },
  ];

  // Páginas de servicios
  const servicePages = servicios.map((service) => ({
    url: `/servicios/${service.slug}`,
    priority: "0.9",
    changefreq: "monthly",
  }));

  // Obtener blogs dinámicamente
  let blogPages: Array<{
    url: string;
    priority: string;
    changefreq: string;
    lastmod?: string;
  }> = [];
  try {
    const response = await blogApi.getBlogsByTag();
    if (response.status === 200 && response.body?.blogs) {
      blogPages = response.body.blogs.map((blog: any) => ({
        url: `/blogs/${blog.slug}`,
        priority: "0.8",
        changefreq: "weekly",
        lastmod: blog.updatedAt || blog.createdAt,
      }));
    }
  } catch (error) {
    console.error("Error fetching blogs for sitemap:", error);
  }

  // Combinar todas las páginas
  const allPages = [...staticPages, ...servicePages, ...blogPages];

  // Generar XML
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
        xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">
${allPages
  .map(
    (page) => `  <url>
    <loc>${siteUrl}${page.url}</loc>
    ${
      page.lastmod
        ? `<lastmod>${new Date(page.lastmod).toISOString()}</lastmod>`
        : ""
    }
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`
  )
  .join("\n")}
</urlset>`;

  return new Response(sitemap, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
};
