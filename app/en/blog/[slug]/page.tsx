import type { Metadata } from "next";
import { BlogPostPage } from "@/components/pages/blog-post";
import { getPost } from "@/lib/posts";
import { absoluteUrl, buildPageMetadata } from "@/lib/seo";

type Props = { params: Promise<{ slug: string }> };

export const revalidate = 60;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const result = await getPost("en", slug);
  if (!result) return {};

  const metadata = buildPageMetadata({
    lang: "en",
    path: `/blog/${slug}`,
    title: result.title,
    description: result.excerpt,
    type: "article",
    publishedTime: result.post.publishedAt,
  });
  metadata.alternates = {
    canonical: absoluteUrl(result.post.locale, `/blog/${result.post.slug}`),
    languages: Object.fromEntries(result.post.translations.map(t => [t.locale, absoluteUrl(t.locale, `/blog/${t.slug}`)])),
  };
  return metadata;
}

export default async function Page({ params }: Props) {
  const { slug } = await params;
  return <BlogPostPage lang="en" slug={slug} />;
}
