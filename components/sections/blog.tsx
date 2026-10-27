"use client";

import { CompactPostCard, FeaturedPostCard } from "@/components/post-card";
import { useSite } from "@/components/providers";
import { Container } from "@/components/ui";
import type { Post } from "@/content/posts";
import { localizeHref } from "@/lib/i18n";

/**
 * "Harnix có gì mới" — the newest post as a big featured card; beside it the
 * next two as compact cards and a light "see all" card, stretched to the
 * featured card's height. Phones stack the same pieces (mobile 1a). Posts come
 * from the server, so the titles are in the first HTML response.
 */
export function Blog({ posts }: { posts: Post[] }) {
  const { c, lang } = useSite();
  const b = c.blog;
  const [featured, ...rest] = posts.slice(0, 3);

  return (
    <section id="blog" className="bg-paper text-ink">
      <Container className={`flex flex-col gap-6 md:gap-12 py-16 md:py-[clamp(72px,10vw,140px)]`}>
        <div className="flex max-w-[720px] flex-col gap-3 md:gap-[14px]">
          <span className="text-[14px] font-semibold text-accent md:text-[15px]">{b.label}</span>
          <h2 className="m-0 text-[34px] leading-[1.04] font-extrabold tracking-[-0.04em] text-balance md:text-[clamp(34px,5.5vw,68px)] md:leading-[1.02]">
            {b.title}
          </h2>
          <p className="m-0 text-[16px] leading-[1.6] text-ink-700 md:text-[clamp(17px,1.8vw,20px)]">{b.sub}</p>
        </div>

        {featured ? (
          <div className="grid grid-cols-1 gap-6 md:gap-5 blog:grid-cols-[minmax(0,1.7fr)_minmax(0,1fr)]">
            <FeaturedPostCard post={featured} compactMobile />
            <div className="flex min-w-0 flex-col gap-6 md:gap-4">
              {rest.map((post) => (
                <CompactPostCard key={post.slug} post={post} />
              ))}
              <a
                href={localizeHref(lang, "/blog")}
                className="group flex h-[52px] items-center justify-center gap-4 rounded-[14px] border border-line3 bg-card text-[16px] font-semibold text-ink transition-colors duration-200 hover:border-accent hover:text-accent md:h-auto md:justify-between md:rounded-3xl md:border-line2 md:bg-transparent md:px-6 md:py-5 md:text-[17px]"
              >
                {b.all}
                <span aria-hidden="true" className="hidden text-[20px] text-accent md:inline">
                  →
                </span>
              </a>
            </div>
          </div>
        ) : (
          <div className="rounded-[28px] border border-dashed border-line3 bg-card p-10 text-center">
            <div className="text-[20px] font-bold">{b.emptyTitle}</div>
            <div className="mt-2 text-[16px] text-ink-700">{b.emptyBody}</div>
          </div>
        )}
      </Container>
    </section>
  );
}
