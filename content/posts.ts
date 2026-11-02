import type { Lang } from "@/lib/copy";

export type Post = {
  id: string;
  slug: string;
  locale: Lang;
  publishedAt: string;
  readingMinutes: number;
  title: string;
  excerpt: string;
  url: string;
  tag: string;
  tags: string[];
  image: string | null;
  imageAlt: string;
  translations: { locale: Lang; slug: string }[];
};

// Tags are shared across a post's translations in the CMS and written in
// Vietnamese, so English pages swap the known ones.
const EN_TAGS: Record<string, string> = {
  "Kỹ thuật": "Engineering",
  "Sản phẩm": "Product",
  "Hướng dẫn": "Guide",
};

export function tagLabel(tag: string, lang: Lang): string {
  return lang === "en" ? (EN_TAGS[tag] ?? tag) : tag;
}

export function postCopy(post: Post, lang: Lang) {
  return {
    title: post.title,
    excerpt: post.excerpt,
    tag: tagLabel(post.tag, lang),
    tags: post.tags.map((t) => tagLabel(t, lang)),
  };
}
