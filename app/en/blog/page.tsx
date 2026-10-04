import type { Metadata } from "next";
import { BlogIndexPage } from "@/components/pages/blog-index";
import { getCopy } from "@/lib/copy";
import { buildPageMetadata } from "@/lib/seo";

const copy = getCopy("en");

export const metadata: Metadata = buildPageMetadata({
  lang: "en",
  path: "/blog",
  title: copy.blogIndex.title,
  description: copy.blogIndex.sub,
});

export default function Page() {
  return <BlogIndexPage lang="en" />;
}
