import "server-only";
import type { Lang } from "@/lib/copy";

export type ApiPost = {
  id: string;
  locale: Lang;
  title: string;
  slug: string;
  excerpt: string;
  published_at: string;
  reading_minutes: number;
  featured_image_url: string;
  featured_image_alt: string;
  tags: { id: string; name: string; slug: string }[];
  translations: { locale: Lang; slug: string }[];
  created_at: string;
  updated_at: string;
  status: string;
};
export type ApiPostDetail = ApiPost & { content: string; html: string };

function endpoint(path: string) {
  return `${(process.env.BLOG_API_URL || "https://cms.harnix.vn/api/v1").replace(/\/$/, "")}${path}`;
}

export async function fetchPosts(locale: Lang, opts: { limit?: number; tag?: string } = {}): Promise<ApiPost[]> {
  try {
    const posts: ApiPost[] = [];
    let page = 1;
    let totalPages = 1;
    do {
      const query = new URLSearchParams({ locale, limit: String(opts.limit ?? 100), page: String(page) });
      if (opts.tag) query.set("tag", opts.tag);
      const response = await fetch(endpoint(`/posts?${query}`), { next: { revalidate: 60 }, signal: AbortSignal.timeout(5000) });
      if (!response.ok) throw new Error(`CMS list returned ${response.status}`);
      const result = await response.json() as { data: ApiPost[]; meta: { total_pages: number } };
      posts.push(...result.data);
      totalPages = result.meta.total_pages;
      page++;
    } while (!opts.limit && page <= totalPages);
    return opts.limit ? posts.slice(0, opts.limit) : posts;
  } catch {
    console.error("CMS posts unavailable");
    return [];
  }
}

export async function fetchPost(locale: Lang, slug: string): Promise<ApiPostDetail | null> {
  try {
    const response = await fetch(endpoint(`/posts/${encodeURIComponent(slug)}?locale=${locale}`), { next: { revalidate: 60 }, signal: AbortSignal.timeout(5000) });
    if (response.status === 404) return null;
    if (!response.ok) throw new Error(`CMS post returned ${response.status}`);
    const result = await response.json() as { data: ApiPostDetail };
    return result.data.locale === locale ? result.data : null;
  } catch {
    console.error("CMS post unavailable");
    return null;
  }
}
