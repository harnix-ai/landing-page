import type { NextConfig } from "next";

/**
 * Multi-zones: the docs site is a separate Next.js app (Fumadocs, built with
 * `basePath: "/docs"`) deployed as its own Vercel project. Unset in any
 * environment where it isn't live yet — the rewrite/redirect entries are
 * then skipped entirely rather than pointing at an empty origin.
 */
const docsOrigin = process.env.DOCS_ORIGIN?.replace(/\/$/, "");

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // The docs are a static export with trailing-slash URLs (/docs/x/), and
  // their host redirects /docs/x → /docs/x/. Next's own trailing-slash
  // redirect goes the other way, so together they loop forever. Turn Next's
  // off globally; `proxy.ts` puts it back for every path outside /docs.
  skipTrailingSlashRedirect: true,
};

if (docsOrigin) {
  // Catches anyone guessing the old locale-prefixed shape.
  nextConfig.redirects = async () => [
    { source: "/en/docs", destination: "/docs/en/", permanent: false },
    { source: "/en/docs/:path*", destination: "/docs/en/:path*", permanent: false },
  ];

  nextConfig.rewrites = async () => [
    // Slash forms first, so the trailing slash survives the rewrite — the
    // docs host only serves pages at their slash form.
    { source: "/docs/", destination: `${docsOrigin}/docs/` },
    { source: "/docs/:path*/", destination: `${docsOrigin}/docs/:path*/` },
    { source: "/docs", destination: `${docsOrigin}/docs` },
    { source: "/docs/:path*", destination: `${docsOrigin}/docs/:path*` },
  ];
}

export default nextConfig;
