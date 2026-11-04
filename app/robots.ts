import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/config";

/**
 * Crawlers and AI answer engines that may read the public site. Naming them is
 * a statement, not a need (`*` already allows everything): the marketing pages
 * and the docs are meant to be quoted by ChatGPT, Claude, Perplexity and Gemini.
 * Groups do not inherit, so each repeats the /api/ rule. Whoever owns the policy
 * can move a name to `disallow` — the training crawlers (GPTBot, ClaudeBot,
 * Google-Extended, Applebot-Extended, CCBot, Meta-ExternalAgent) are the usual candidates.
 */
const AI_CRAWLERS = [
  // OpenAI: search index, user-triggered fetches, training
  "OAI-SearchBot",
  "ChatGPT-User",
  "GPTBot",
  // Anthropic
  "Claude-SearchBot",
  "Claude-User",
  "ClaudeBot",
  // Perplexity
  "PerplexityBot",
  "Perplexity-User",
  // Google's Gemini training/grounding switch (Googlebot itself is under `*`) and Apple's
  "Google-Extended",
  "Applebot-Extended",
  // Common Crawl, Meta
  "CCBot",
  "Meta-ExternalAgent",
];

/**
 * The route handlers under /api are data endpoints, not pages — keeping them
 * out of the index avoids JSON showing up in results. Everything else is
 * crawlable; there is nothing gated on this site.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: "/api/" },
      { userAgent: AI_CRAWLERS, allow: "/", disallow: "/api/" },
    ],
    // The docs app (harnix-ai/harnix, proxied in at /docs) publishes its own
    // sitemap; robots.txt only exists at the domain root, so it is listed here.
    sitemap: [`${siteConfig.url}/sitemap.xml`, `${siteConfig.url}/docs/sitemap.xml`],
    host: siteConfig.url,
  };
}
