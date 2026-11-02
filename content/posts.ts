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

export function postCopy(post: Post, _lang: Lang) {
  return { title: post.title, excerpt: post.excerpt, tag: post.tag, tags: post.tags };
}
