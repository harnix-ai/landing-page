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
};

if (docsOrigin) {
  // Catches anyone guessing the old locale-prefixed shape.
  nextConfig.redirects = async () => [
    { source: "/en/docs", destination: "/docs/en", permanent: false },
    { source: "/en/docs/:path*", destination: "/docs/en/:path*", permanent: false },
  ];

  nextConfig.rewrites = async () => [
    { source: "/docs", destination: `${docsOrigin}/docs` },
    { source: "/docs/:path*", destination: `${docsOrigin}/docs/:path*` },
  ];
}

export default nextConfig;
