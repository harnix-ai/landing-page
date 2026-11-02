export const revalidate = 60;

import type { MetadataRoute } from "next";
import { getAllPosts } from "@/lib/posts";
import { absoluteUrl } from "@/lib/seo";

/** Every static (non-post) route, as a canonical vi-rooted path. */
const STATIC_PATHS: { path: string; changeFrequency: "weekly" | "daily"; priority: number }[] = [
  { path: "/", changeFrequency: "weekly", priority: 1 },
  { path: "/blog", changeFrequency: "daily", priority: 0.7 },
];

/** Every page, in both locales — landing, blog index, and every post — with matching hreflang alternates. */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const posts = (await Promise.all([getAllPosts("vi"), getAllPosts("en")])).flat();

  const entries: MetadataRoute.Sitemap = STATIC_PATHS.flatMap(({ path, changeFrequency, priority }) => {
    const languages = { vi: absoluteUrl("vi", path), en: absoluteUrl("en", path) };
    return [
      { url: languages.vi, lastModified: now, changeFrequency, priority, alternates: { languages } },
      { url: languages.en, lastModified: now, changeFrequency, priority, alternates: { languages } },
    ];
  });

  const seen = new Set<string>();
  for (const post of posts) {
    const languages = Object.fromEntries(post.translations.map(t => [t.locale, absoluteUrl(t.locale, `/blog/${t.slug}`)]));
    for (const translation of post.translations) {
      const url = absoluteUrl(translation.locale, `/blog/${translation.slug}`);
      if (seen.has(url)) continue;
      seen.add(url);
      entries.push({ url, lastModified: new Date(post.publishedAt), changeFrequency: "yearly", priority: 0.6, alternates: { languages } });
    }
  }
  return entries;
}
