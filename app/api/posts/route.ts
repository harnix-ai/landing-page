import { NextRequest, NextResponse } from "next/server";
import { getAllPosts } from "@/lib/posts";

export async function GET(request: NextRequest) {
  const locale = request.nextUrl.searchParams.get("locale") === "en" ? "en" : "vi";
  const latest = await getAllPosts(locale, { limit: 3 });
  return NextResponse.json({ posts: latest }, { headers: { "Cache-Control": "public, s-maxage=60, stale-while-revalidate=60" } });
}
