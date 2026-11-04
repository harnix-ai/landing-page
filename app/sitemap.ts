export const revalidate = 60;

import type { MetadataRoute } from "next";
import { getAllPosts } from "@/lib/posts";
import { absoluteUrl } from "@/lib/seo";

/** Every static (non-post) route, as a canonical vi-rooted path. */
const STATIC_PATHS: { path: string; changeFrequency: "weekly" | "daily"; priority: number }[] = [
  { path: "/", changeFrequency: "weekly", priority: 1 },
  { path: "/blog", changeFrequency: "daily", priority: 0.7 },
];

/**
 * Every page, in both locales — landing, blog index, and every post — with matching hreflang alternates.
 *
 * `lastmod` is only given where it is true: a post's publish date, and the blog index's latest
 * post. The landing has no content date, so it carries none — stamping "now" on every request
 * teaches Google to ignore the field for the whole sitemap.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = (await Promise.all([getAllPosts("vi"), getAllPosts("en")])).flat();
  const latestPost = posts.map(post => post.publishedAt).sort().at(-1);
  const lastModifiedOf = (path: string) => (path === "/blog" && latestPost ? new Date(latestPost) : undefined);

  const entries: MetadataRoute.Sitemap = STATIC_PATHS.flatMap(({ path, changeFrequency, priority }) => {
    const languages = { vi: absoluteUrl("vi", path), en: absoluteUrl("en", path) };
    return [
      { url: languages.vi, lastModified: lastModifiedOf(path), changeFrequency, priority, alternates: { languages } },
      { url: languages.en, lastModified: lastModifiedOf(path), changeFrequency, priority, alternates: { languages } },
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
