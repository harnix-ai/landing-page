import { NextResponse, type NextRequest } from "next/server";

/**
 * Restores Next's default "drop the trailing slash" redirect for the landing
 * page's own routes. It is switched off globally in next.config.ts
 * (`skipTrailingSlashRedirect`) because the docs under /docs need their
 * trailing slash kept — see the comment there.
 */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (pathname === "/" || !pathname.endsWith("/")) return NextResponse.next();
  if (pathname === "/docs/" || pathname.startsWith("/docs/")) return NextResponse.next();

  // A plain URL, not `nextUrl.clone()`: NextURL re-applies the trailing
  // slash it was parsed with.
  const url = new URL(request.url);
  url.pathname = pathname.replace(/\/+$/, "") || "/";
  return NextResponse.redirect(url, 308);
}

export const config = {
  // Pages only — static files and image optimisation never carry a slash.
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
