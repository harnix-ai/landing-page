import { siteConfig } from "@/lib/config";
import { getCopy, type Lang } from "@/lib/copy";
import type { Post } from "@/content/posts";
import { absoluteUrl, ogImageUrl } from "@/lib/seo";

/**
 * JSON-LD for a blog post: a BlogPosting (what search and answer engines read
 * to date, attribute and summarise it) and the breadcrumb Home › Blog › post
 * that Google shows under the result. Both point at the Organization node the
 * homepage defines (`#organization`), so the publisher is one entity.
 */
export function ArticleStructuredData({ lang, post, title }: { lang: Lang; post: Post; title: string }) {
  const url = absoluteUrl(post.locale, `/blog/${post.slug}`);
  const inLanguage = lang === "vi" ? "vi-VN" : "en-US";
  const organizationId = `${siteConfig.url}/#organization`;
  const c = getCopy(lang);

  const graph = [
    {
      "@type": "BlogPosting",
      "@id": `${url}#article`,
      mainEntityOfPage: { "@type": "WebPage", "@id": url },
      url,
      headline: title,
      description: post.excerpt,
      image: post.image ?? ogImageUrl(lang),
      datePublished: post.publishedAt,
      dateModified: post.updatedAt,
      inLanguage,
      ...(post.tags.length ? { keywords: post.tags.join(", ") } : {}),
      author: { "@id": organizationId },
      publisher: { "@id": organizationId },
    },
    {
      "@type": "BreadcrumbList",
      "@id": `${url}#breadcrumb`,
      itemListElement: [
        { "@type": "ListItem", position: 1, name: siteConfig.name, item: absoluteUrl(lang, "/") },
        { "@type": "ListItem", position: 2, name: c.nav.blog.label, item: absoluteUrl(lang, "/blog") },
        { "@type": "ListItem", position: 3, name: title, item: url },
      ],
    },
  ];

  return (
    <script
      type="application/ld+json"
      // Built from CMS fields and local constants; JSON.stringify escapes quotes,
      // and "</script" is neutralised below.
      dangerouslySetInnerHTML={{
        __html: JSON.stringify({ "@context": "https://schema.org", "@graph": graph }).replace(/</g, "\\u003c"),
      }}
    />
  );
}
