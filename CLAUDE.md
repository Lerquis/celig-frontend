# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev        # Start dev server at localhost:4321
npm run host       # Start dev server accessible on local network
npm run build      # Production build
npm run preview    # Preview production build
```

## Environment Variables

`PUBLIC_API_BASE_URL` must be set in `.env` — it's the base URL for the backend REST API. The `HttpClient` class will throw on startup if this is missing.

## Architecture

**Framework:** Astro 5 with React islands, deployed to Vercel (SSR via `@astrojs/vercel`). Most pages set `export const prerender = false`. Tailwind CSS v4 is configured via the Vite plugin (not the Astro integration).

**Component structure follows Atomic Design:**
- `src/components/atoms/` — smallest UI primitives (buttons, tags, typography wrappers)
- `src/components/molecules/` — composed of atoms (nav, blog item, testimonial item)
- `src/components/organisms/` — page sections (Landing, Footer, NuestrosServicios, etc.)
- `src/components/templates/` — full page layouts composed of organisms
- `src/components/ui/` — shadcn/ui components (new-york style, neutral base color, lucide icons)

**Two layouts:**
- `src/layouts/Layout.astro` — public site; includes `Navigation`, `WhatsApp` button, `SEO` component, GSAP/Lenis scripts
- `src/layouts/DashboardLayout.astro` — CMS admin area; includes `SideBarCMS`, no public navigation

**API layer:**
- `src/classes/HttpClient.js` — base class wrapping `fetch`; reads `PUBLIC_API_BASE_URL`, handles 401 redirects to `/admin/login`
- `src/api/` — resource-specific classes extending `HttpClient` (`BlogApi`, `PodcastApi`, etc.), each exported as a singleton instance (e.g., `blogApi`)
- `src/api/index.js` — re-exports all API modules

**Auth:** JWT stored in a `token` cookie. Server-side parsing via `src/lib/auth.js` (`getCookieValue`). Client-side via `getCookieValueJSX`. On 401, `HttpClient` clears the cookie and redirects to `/admin/login`.

**Path alias:** `@/` maps to `src/`.

**Admin CMS** lives at `/admin/` — login page + dashboard sub-pages for blogs, testimonials, podcasts, images, and subscribers. All CMS pages are SSR (`prerender = false`) and use `DashboardLayout`.

**SEO:** The `SEO.astro` component accepts `title`, `description`, `canonical`, `ogImage`, `ogType`, `article` metadata, `noindex`, and a `schema` JSON-LD object. Pages pass a page-specific Schema.org object or fall back to the default `Organization` schema.

**Animations:** GSAP runs the intro animation on the homepage (`IntroAnimation.astro`). Lenis provides smooth scrolling.
