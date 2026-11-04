import { getCopy, type Lang } from "@/lib/copy";
import { siteConfig } from "@/lib/config";
import { getAllPosts } from "@/lib/posts";
import { absoluteUrl } from "@/lib/seo";

export const revalidate = 3600;

/**
 * /llms.txt — the llmstxt.org convention: a short Markdown map of the site for
 * language models (ChatGPT, Claude, Perplexity, Gemini and their crawlers), so
 * an answer about Harnix can quote the right pages. One file, both languages,
 * Vietnamese first; the docs publish their own at /docs/llms.txt.
 */
export async function GET() {
  const vi = getCopy("vi");
  const en = getCopy("en");
  const [viPosts, enPosts] = await Promise.all([getAllPosts("vi"), getAllPosts("en")]);

  const postLines = (posts: Awaited<ReturnType<typeof getAllPosts>>, lang: Lang) =>
    posts.slice(0, 25).map(post => `- [${post.title}](${absoluteUrl(lang, `/blog/${post.slug}`)}): ${post.excerpt}`);

  const lines = [
    `# ${siteConfig.name}`,
    "",
    `> ${vi.meta.description}`,
    "",
    `${en.meta.description}`,
    "",
    "Harnix is a platform for running AI assistants inside a company's own apps: agents with their own knowledge bases and tools, an embeddable chat widget, and a console that records every answer step by step (documents read, tools called, tokens spent). Vietnamese is the primary language; every page also exists in English.",
    "",
    "## Sản phẩm / Product",
    "",
    `- [Trang chủ (tiếng Việt)](${absoluteUrl("vi", "/")}): ${vi.meta.title}`,
    `- [Home (English)](${absoluteUrl("en", "/")}): ${en.meta.title}`,
    "",
    "## Tài liệu / Documentation",
    "",
    `- [Tài liệu Harnix](${siteConfig.url}/docs/): hướng dẫn dùng console, tạo agent, kết nối công cụ (MCP), nhúng widget, tham chiếu API`,
    `- [Harnix docs (English)](${siteConfig.url}/docs/en): guides for the console, agents, connectors (MCP), the chat widget and the API reference`,
    `- [llms.txt của tài liệu](${siteConfig.url}/docs/llms.txt): the docs' own index for language models`,
    `- [llms-full.txt](${siteConfig.url}/docs/llms-full.txt): the full docs as one Markdown file`,
    "",
    "## Blog (tiếng Việt)",
    "",
    ...postLines(viPosts, "vi"),
    "",
    "## Blog (English)",
    "",
    ...postLines(enPosts, "en"),
    "",
    "## Optional",
    "",
    `- [Sitemap](${siteConfig.url}/sitemap.xml)`,
    ...(siteConfig.social.linkedin ? [`- [LinkedIn](${siteConfig.social.linkedin})`] : []),
    `- Contact: ${siteConfig.email}`,
    "",
  ];

  return new Response(lines.join("\n"), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
