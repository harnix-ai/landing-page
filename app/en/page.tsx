import type { Metadata } from "next";
import { HomePage } from "@/components/pages/home";
import { getCopy } from "@/lib/copy";
import { buildPageMetadata } from "@/lib/seo";

const copy = getCopy("en");

export const metadata: Metadata = buildPageMetadata({
  lang: "en",
  path: "/",
  title: `Harnix — ${copy.meta.title}`,
  description: copy.meta.description,
});

export default function Page() {
  return <HomePage lang="en" />;
}
