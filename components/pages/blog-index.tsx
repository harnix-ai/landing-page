import { FloatingActions } from "@/components/floating-actions";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { FeaturedPostCard, PostCard } from "@/components/post-card";
import { SkipLink } from "@/components/skip-link";
import { getCopy, type Lang } from "@/lib/copy";
import { localizeHref } from "@/lib/i18n";
import { getAllPosts } from "@/lib/posts";

/**
 * `/blog` and `/en/blog`: a night header in the post page's style, then the
 * newest post featured full width and every other post as a card.
 */
export function BlogIndexPage({ lang }: { lang: Lang }) {
  const c = getCopy(lang);
  const posts = getAllPosts();
  const [featured, ...rest] = posts;

  return (
    <div id="top">
      <SkipLink />
      <Header page="blog" />
      <div className="bg-night text-white">
        <div className="relative overflow-hidden">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -top-[200px] -right-[200px] h-[700px] w-[700px] rounded-full bg-accent opacity-[0.22] blur-[140px]"
          />
          <header className="relative mx-auto flex max-w-[1280px] animate-[hx-rise_0.8s_both] flex-col gap-5 px-5 pt-[clamp(48px,7vw,96px)] pb-[clamp(48px,6vw,80px)]">
            <span className="text-[15px] font-semibold text-accent-label">{c.blog.label}</span>
            <h1 className="m-0 max-w-[900px] text-[clamp(40px,6.5vw,84px)] leading-none font-extrabold tracking-[-0.045em] text-balance">
              {c.blogIndex.title}
            </h1>
            <p className="m-0 max-w-[720px] text-[clamp(18px,2vw,22px)] leading-[1.55] text-pretty text-on-night3">
              {c.blogIndex.sub}
            </p>
            <span className="text-[15px] text-on-night-muted">{c.blogIndex.count.replace("{N}", String(posts.length))}</span>
          </header>
        </div>
      </div>

      <main id="main" className="bg-paper text-ink">
        <div className="mx-auto max-w-[1280px] px-5 py-[clamp(48px,7vw,96px)]">
          {featured ? (
            <div className="flex flex-col gap-5">
              <FeaturedPostCard post={featured} />
              {rest.length > 0 && (
                <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,320px),1fr))] gap-5">
                  {rest.map((post) => (
                    <PostCard key={post.slug} post={post} />
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="rounded-[28px] border border-dashed border-line3 bg-card p-10 text-center">
              <div className="text-[20px] font-bold">{c.blog.emptyTitle}</div>
              <div className="mt-2 text-[16px] text-ink-700">{c.blog.emptyBody}</div>
            </div>
          )}
        </div>
      </main>

      <Footer />
      <FloatingActions demoHref={localizeHref(lang, "/#demo")} />
    </div>
  );
}
