import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/config";

/**
 * The route handlers under /api are data endpoints, not pages — keeping them
 * out of the index avoids JSON showing up in results. Everything else is
 * crawlable; there is nothing gated on this site.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: "/api/",
    },
    // The docs app (harnix-ai/harnix, proxied in at /docs) publishes its own
    // sitemap; robots.txt only exists at the domain root, so it is listed here.
    sitemap: [`${siteConfig.url}/sitemap.xml`, `${siteConfig.url}/docs/sitemap.xml`],
    host: siteConfig.url,
  };
}
