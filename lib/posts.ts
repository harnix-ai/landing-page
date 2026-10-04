import "server-only";
import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { POST_COVERS, type Post, type PostCover } from "@/content/posts";
import type { Lang } from "@/lib/copy";
import { slugify } from "@/lib/slug";

const POSTS_DIR = path.join(process.cwd(), "content/posts");

/**
 * Splits a post body on its own line, separating the Vietnamese body (the
 * language posts are written in) from an optional English translation below
 * it. It is real MDX comment syntax, so a post that forgets to translate
 * simply renders as Vietnamese-only rather than leaking the marker.
 */
const EN_BODY_SPLIT = /\n{1,}\{\/\*\s*en\s*\*\/\}\n{1,}/;

type PostFrontmatter = {
  date: string;
  readingMinutes: number;
  title: string;
  excerpt: string;
  /** Optional; falls back to "Blog" and the `data` cover. */
  tag?: string;
  cover?: string;
  tags?: string[];
  en?: { title: string; excerpt: string; tag?: string; tags?: string[] };
};

export type PostBodyContent = { vi: string; en: string | null };

function splitBody(content: string): PostBodyContent {
  const [vi, en] = content.split(EN_BODY_SPLIT);
  return { vi: vi.trim(), en: en ? en.trim() : null };
}

function filenames(): string[] {
  return fs.readdirSync(POSTS_DIR).filter((name) => name.endsWith(".mdx"));
}

function readFile(filename: string) {
  const raw = fs.readFileSync(path.join(POSTS_DIR, filename), "utf8");
  return matter(raw);
}

function toPost(slug: string, data: PostFrontmatter): Post {
  return {
    slug,
    date: data.date,
    readingMinutes: data.readingMinutes,
    title: data.title,
    excerpt: data.excerpt,
    url: `/blog/${slug}`,
    tag: data.tag ?? "Blog",
    cover: POST_COVERS.includes(data.cover as PostCover) ? (data.cover as PostCover) : "data",
    tags: data.tags ?? [],
    en: data.en,
  };
}

/** Every post, newest first. Used by the landing page's card grid, `/api/posts` and `/blog`. */
export function getAllPosts(): Post[] {
  return filenames()
    .map((filename) => {
      const slug = filename.replace(/\.mdx$/, "");
      const { data } = readFile(filename);
      return toPost(slug, data as PostFrontmatter);
    })
    .sort((a, b) => b.date.localeCompare(a.date));
}

export function getAllSlugs(): string[] {
  return filenames().map((filename) => filename.replace(/\.mdx$/, ""));
}

/**
 * A single post's front matter plus its raw MDX body, or `null` if the slug
 * does not match a file on disk. The membership check against the real
 * directory listing (rather than reading straight from the request's `slug`)
 * is what keeps this safe against a path-traversal-shaped param.
 */
export function getPostSource(slug: string): { post: Post; content: PostBodyContent } | null {
  const filename = `${slug}.mdx`;
  if (!filenames().includes(filename)) return null;

  const { data, content } = readFile(filename);
  return { post: toPost(slug, data as PostFrontmatter), content: splitBody(content) };
}

export type LocalizedPost = {
  post: Post;
  title: string;
  excerpt: string;
  /** Raw MDX for `lang`, falling back to the Vietnamese body when untranslated. */
  body: string;
  /** False when `lang` is "en" but the post has no English title/excerpt/body yet. */
  hasTranslation: boolean;
  /** The body's `##` headings, in order — the post's table of contents. */
  headings: PostHeading[];
  /** Whether the body opens with a `<Summary>` block (it gets its own TOC entry). */
  hasSummary: boolean;
};

export type PostHeading = { id: string; text: string };

/** Top-level `##` lines outside fenced code blocks. */
function extractHeadings(body: string): PostHeading[] {
  const headings: PostHeading[] = [];
  let inFence = false;
  for (const line of body.split("\n")) {
    if (line.trimStart().startsWith("```")) inFence = !inFence;
    if (inFence) continue;
    const match = /^##\s+(.+?)\s*$/.exec(line);
    if (match) {
      const text = match[1].replace(/[*_`]/g, "");
      headings.push({ id: slugify(text), text });
    }
  }
  return headings;
}

/**
 * A single post localized for `lang`, with vi-fallback baked in — the one
 * function every `/en/blog/*` and `/blog/*` page needs to render its content.
 */
export function getPost(slug: string, lang: Lang): LocalizedPost | null {
  const source = getPostSource(slug);
  if (!source) return null;

  const { post, content } = source;
  const hasEnBody = content.en !== null;
  const hasTranslation = lang === "vi" || (!!post.en && hasEnBody);
  const { title, excerpt } =
    lang === "en" && post.en ? post.en : { title: post.title, excerpt: post.excerpt };
  const body = lang === "en" && hasEnBody ? (content.en as string) : content.vi;

  return {
    post,
    title,
    excerpt,
    body,
    hasTranslation,
    headings: extractHeadings(body),
    hasSummary: /<Summary[\s>]/.test(body),
  };
}
