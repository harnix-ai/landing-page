"use client";

import { FeaturedPostCard, PostCard } from "@/components/post-card";
import { useSite } from "@/components/providers";
import { btn, Container, sectionPad } from "@/components/ui";
import type { Post } from "@/content/posts";
import { localizeHref } from "@/lib/i18n";

/**
 * "Đang xây dựng công khai" — the newest post as a big featured card, the
 * next two stacked beside it. Posts come from the server, so the titles are
 * in the first HTML response.
 */
export function Blog({ posts }: { posts: Post[] }) {
  const { c, lang } = useSite();
  const b = c.blog;
  const [featured, ...rest] = posts.slice(0, 3);

  return (
    <section id="blog" className="bg-paper text-ink">
      <Container className={`flex flex-col gap-12 ${sectionPad}`}>
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div className="flex max-w-[720px] flex-col gap-[14px]">
            <span className="text-[15px] font-semibold text-accent">{b.label}</span>
            <h2 className="m-0 text-[clamp(34px,5.5vw,68px)] leading-[1.02] font-extrabold tracking-[-0.04em] text-balance">
              {b.title}
            </h2>
            <p className="m-0 text-[clamp(17px,1.8vw,20px)] leading-[1.6] text-ink-700">{b.sub}</p>
          </div>
          <a href={localizeHref(lang, "/blog")} className={`${btn.outline} h-[52px] px-[22px] text-[16px]`}>
            {b.all}
          </a>
        </div>

        {featured ? (
          <div className="grid grid-cols-1 gap-5 blog:grid-cols-[minmax(0,1.7fr)_minmax(0,1fr)]">
            <FeaturedPostCard post={featured} className="blog:row-span-2" />
            {rest.map((post) => (
              <PostCard key={post.slug} post={post} />
            ))}
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
