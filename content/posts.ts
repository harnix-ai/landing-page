import type { Lang } from "@/lib/copy";

/** Which drawn cover a post card uses — covers are shapes, not images. */
export type PostCover = "run" | "data" | "console";

export const POST_COVERS: readonly PostCover[] = ["run", "data", "console"];

export type Post = {
  slug: string;
  /** ISO date — formatted for display at render time. */
  date: string;
  readingMinutes: number;
  /** Vietnamese, the language the posts are written in. */
  title: string;
  excerpt: string;
  url: string;
  /** Short topic label shown on the cover, e.g. "Run engine". */
  tag: string;
  cover: PostCover;
  /** Free-form topic chips at the foot of the article. */
  tags: string[];
  /**
   * English rendering of the card. A post without it keeps its Vietnamese
   * title and excerpt in English mode rather than showing nothing — the post
   * itself is still Vietnamese, so that is the honest fallback.
   */
  en?: { title: string; excerpt: string; tag?: string; tags?: string[] };
};

export function postCopy(post: Post, lang: Lang) {
  const en = lang === "en" ? post.en : undefined;
  return {
    title: en?.title ?? post.title,
    excerpt: en?.excerpt ?? post.excerpt,
    tag: en?.tag ?? post.tag,
    tags: en?.tags ?? post.tags,
  };
}
