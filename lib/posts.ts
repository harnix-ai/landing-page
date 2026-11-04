import "server-only";
import { fetchPosts, fetchPost, type ApiPost } from "@/lib/cms";
import type { Post } from "@/content/posts";
import type { Lang } from "@/lib/copy";

function toPost(post: ApiPost): Post {
  return {
    id: post.id, locale: post.locale, slug: post.slug,
    title: post.title, excerpt: post.excerpt,
    publishedAt: post.published_at, updatedAt: post.updated_at || post.published_at, readingMinutes: post.reading_minutes,
    url: `${post.locale === "en" ? "/en" : ""}/blog/${post.slug}`,
    tag: post.tags[0]?.name ?? "Blog", tags: post.tags.map(tag => tag.name),
    image: post.featured_image_url || null, imageAlt: post.featured_image_alt,
    translations: post.translations,
  };
}

export async function getAllPosts(lang: Lang, opts?: { limit?: number; tag?: string }): Promise<Post[]> {
  return (await fetchPosts(lang, opts)).map(toPost).sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
}

export type PostHeading = { id: string; text: string };
function decodeEntities(text: string) {
  return text.replace(/&(#x[0-9a-f]+|#\d+|amp|lt|gt|quot|apos|nbsp);/gi, (entity, value: string) => {
    if (value.startsWith("#")) {
      const code = value[1].toLowerCase() === "x" ? parseInt(value.slice(2), 16) : Number(value.slice(1));
      return code > 0 && code <= 0x10ffff ? String.fromCodePoint(code) : entity;
    }
    return ({ amp: "&", lt: "<", gt: ">", quot: '"', apos: "'", nbsp: " " } as Record<string, string>)[value.toLowerCase()] ?? entity;
  });
}
function extractHeadings(html: string): PostHeading[] {
  const headings: PostHeading[] = [];
  for (const match of html.matchAll(/<h2\b([^>]*)>([\s\S]*?)<\/h2\s*>/gi)) {
    const id = /(?:^|\s)id\s*=\s*(?:"([^"]+)"|'([^']+)'|([^\s"'=<>`]+))/i.exec(match[1]);
    if (id) headings.push({ id: decodeEntities(id[1] ?? id[2] ?? id[3]), text: decodeEntities(match[2].replace(/<[^>]*>/g, "")).trim() });
  }
  return headings;
}

export async function getPost(lang: Lang, slug: string) {
  const data = await fetchPost(lang, slug);
  if (!data) return null;
  return { post: toPost(data), title: data.title, excerpt: data.excerpt, html: data.html, headings: extractHeadings(data.html) };
}
