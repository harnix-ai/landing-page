import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/config";
import { getCopy } from "@/lib/copy";

/** Night background and theme colour, so an installed shortcut opens on the header's own ink. */
export default function manifest(): MetadataRoute.Manifest {
  const copy = getCopy("vi");
  return {
    name: `${siteConfig.name} — ${copy.meta.title}`,
    short_name: siteConfig.name,
    description: copy.meta.description,
    lang: "vi",
    start_url: "/",
    display: "standalone",
    background_color: "#0d1014",
    theme_color: "#0d1014",
    icons: [
      { src: "/icon", sizes: "32x32", type: "image/png" },
      { src: "/apple-icon", sizes: "180x180", type: "image/png" },
    ],
  };
}
