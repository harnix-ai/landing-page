import { notFound } from "next/navigation";
import { FloatingActions } from "@/components/floating-actions";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { PostCard, PostCover } from "@/components/post-card";
import { CopyLinkButton, MobilePostChrome, ReadingProgress, TableOfContents } from "@/components/post-chrome";
import { SkipLink } from "@/components/skip-link";
import { btn } from "@/components/ui";
import { postCopy, type Post } from "@/content/posts";
import { siteConfig } from "@/lib/config";
import { formatDate, getCopy, readingTime, type Lang } from "@/lib/copy";
import { localizeHref } from "@/lib/i18n";
import { getAllPosts, getPost } from "@/lib/posts";
import { absoluteUrl } from "@/lib/seo";

async function relatedPosts(current: Post, lang: Lang): Promise<Post[]> {
  return (await getAllPosts(lang)).filter(post => post.id !== current.id).slice(0, 2);
}
function MobileRelatedCard({ post }: { post: Post; lang: Lang }) {
  return <PostCard post={post} />;
}

/** Shared shell for `/blog/[slug]` and `/en/blog/[slug]` — `getPost` resolves the right-language title/body, using published translations. */
export async function BlogPostPage({ lang, slug }: { lang: Lang; slug: string }) {
  const result = await getPost(lang, slug);
  if (!result) notFound();

  const c = getCopy(lang);
  const { post, title, excerpt, html, headings } = result;
  const { tag, tags } = postCopy(post, lang);
  const shareUrl = absoluteUrl(post.locale, `/blog/${post.slug}`);
  const related = await relatedPosts(post, lang);
  const docsHref = siteConfig.docsUrl[lang];
  const demoHref = localizeHref(lang, "/#demo");
  const toc = headings;

  return (
    <div id="top">
      {/* Mobile-only chrome (Option 2b: sticky header, chips, progress, bottom bar, menu) */}
      <MobilePostChrome items={toc} shareUrl={shareUrl} demoHref={demoHref} />

      {/* Desktop reading progress */}
      <div className="max-md:hidden">
        <ReadingProgress />
      </div>

      <SkipLink />

      {/* Desktop floating nav */}
      <div className="max-md:hidden">
        <Header page="blog" translations={post.translations} />
      </div>

      <div className="bg-night text-white">
        <div className="relative overflow-hidden">
          {/* Mobile ambient glow (2b: top -160px, left -160px, 400x400, blur 90px) */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -top-[160px] -left-[160px] h-[400px] w-[400px] rounded-full bg-accent opacity-[0.22] blur-[90px] md:hidden"
          />
          {/* Desktop ambient glow */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -top-[200px] -right-[200px] h-[700px] w-[700px] rounded-full bg-accent opacity-[0.22] blur-[140px] max-md:hidden"
          />

          {/* Mobile Hero (Option 2b Compact) */}
          <div className="relative flex flex-col gap-3.5 p-5 pb-6 text-white md:hidden">
            <span className="self-start rounded-lg bg-accent-deep px-2.5 py-1 text-[12px] font-semibold text-accent-label">
              {tag}
            </span>
            <h1 className="m-0 text-[32px] leading-[1.06] font-extrabold tracking-[-0.04em] text-balance">
              {title}
            </h1>
            <p className="m-0 text-[16px] leading-[1.55] text-on-night3">{excerpt}</p>
            <span className="text-[13px] text-on-night-muted">
              {c.post.author} · <time dateTime={post.publishedAt}>{formatDate(post.publishedAt, lang)}</time> · {readingTime(c, post.readingMinutes)}
            </span>
            <div>
              <div className="overflow-hidden rounded-xl border border-night-line">
                  <PostCover seed={post.id} image={post.image} imageAlt={post.imageAlt} tag={tag} size="sm" />
                </div>
            </div>
          </div>

          {/* Desktop Hero (≥ 768px, identical to original) */}
          <div className="max-md:hidden">
            <header className="relative mx-auto flex max-w-[1080px] animate-[hx-rise_0.8s_both] flex-col gap-6 px-5 pt-[clamp(48px,7vw,96px)] pb-[clamp(40px,5vw,64px)]">
              <div className="flex flex-wrap items-center gap-[10px] text-[15px] text-on-night-muted">
                <a href={localizeHref(lang, "/blog")} className="font-medium text-on-night3 hover:text-accent-on-night">
                  {c.post.crumb}
                </a>
                <span aria-hidden="true" className="text-night-line3">
                  /
                </span>
                <span className="rounded-lg bg-accent-deep px-[10px] py-1 text-[13px] font-semibold text-accent-label">{tag}</span>
              </div>
              <h1 className="m-0 text-[clamp(40px,6.5vw,84px)] leading-none font-extrabold tracking-[-0.045em] text-balance">
                {title}
              </h1>
              <p className="m-0 max-w-[760px] text-[clamp(19px,2.2vw,24px)] leading-[1.5] text-pretty text-on-night3">{excerpt}</p>
              <div className="flex flex-wrap items-center justify-between gap-4 border-t border-night-line pt-5">
                <div className="flex items-center gap-3">
                  <span
                    aria-hidden="true"
                    className="flex h-11 w-11 items-center justify-center rounded-xl border-[1.5px] border-white text-[17px] font-bold"
                  >
                    H
                  </span>
                  <div className="flex flex-col gap-[2px]">
                    <span className="text-[16px] font-semibold">{c.post.author}</span>
                    <span className="text-[14px] text-on-night-muted">
                      <time dateTime={post.publishedAt}>{formatDate(post.publishedAt, lang)}</time> · {readingTime(c, post.readingMinutes)}
                    </span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <CopyLinkButton url={shareUrl} tone="night" />
                  <a
                    href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`${btn.ghost} h-[42px] rounded-xl! px-4 text-[14px]`}
                  >
                    {c.post.shareLinkedIn}
                  </a>
                </div>
              </div>
            </header>

            <div className="relative mx-auto max-w-[1080px] px-5">
              <div className="overflow-hidden rounded-t-[28px] border border-b-0 border-night-line bg-night-panel">
                <div className="flex">
                    <PostCover seed={post.id} image={post.image} imageAlt={post.imageAlt} tag={tag} size="lg" />
                  </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-paper text-ink">
        <main
          id="main"
          className="max-md:block max-md:p-0 md:mx-auto md:grid md:max-w-[1080px] md:items-start md:gap-[clamp(32px,5vw,64px)] md:px-5 md:pt-[clamp(40px,6vw,72px)] md:pb-[clamp(56px,8vw,96px)] md:toc:grid-cols-[220px_minmax(0,1fr)]"
        >
          <TableOfContents items={toc} runLink={false} />

          <article className="flex min-w-0 flex-col max-md:p-5 max-md:pb-10 max-md:gap-5 max-md:text-[17px] max-md:leading-[1.7] md:max-w-[720px] md:gap-7 md:text-[clamp(18px,1.6vw,20px)] md:leading-[1.75] text-ink-body [&>p:first-of-type]:max-md:text-[19px] [&>p:first-of-type]:max-md:leading-[1.6] [&>p:first-of-type]:max-md:text-ink">
            <div className="post-body contents" dangerouslySetInnerHTML={{ __html: html }} />

            <div className="flex flex-wrap items-center justify-between border-t border-line max-md:mt-0 max-md:pt-4 max-md:gap-1.5 md:mt-4 md:pt-6 md:gap-4">
              <ul className="m-0 flex list-none flex-wrap p-0 max-md:gap-1.5 md:gap-2">
                {[tag, ...tags.filter((t) => t !== tag)].map((t) => (
                  <li
                    key={t}
                    className="font-semibold text-ink-700 bg-subtle max-md:rounded-lg max-md:px-2.5 max-md:py-[5px] max-md:text-[13px] md:rounded-lg md:px-3 md:py-[6px] md:text-[14px]"
                  >
                    {t}
                  </li>
                ))}
              </ul>
              <div className="max-md:hidden">
                <CopyLinkButton url={shareUrl} tone="paper" />
              </div>
            </div>
          </article>
        </main>

        {/* Mobile CTA (2b) */}
        <section className="px-5 pb-9 md:hidden">
          <div className="flex flex-col gap-2.5 rounded-[20px] bg-night p-5 text-white">
            <span className="text-[12px] font-semibold text-accent-label">{c.post.ctaLabel}</span>
            <strong className="text-[22px] leading-[1.15] font-extrabold tracking-[-0.03em]">
              {c.post.ctaTitle}
            </strong>
            <span className="text-[14px] leading-[1.55] text-on-night3">{c.post.ctaBody}</span>
            {docsHref && (
              <a href={docsHref} className="text-[14px] font-semibold text-accent-on-night hover:underline">
                {c.post.ctaDocs} →
              </a>
            )}
          </div>
        </section>

        {/* Desktop CTA (≥ 768px, identical to original) */}
        <section className="mx-auto max-w-[1080px] px-5 pb-[clamp(56px,8vw,96px)] max-md:hidden">
          <div className="relative grid grid-cols-[repeat(auto-fit,minmax(min(100%,360px),1fr))] items-center gap-7 overflow-hidden rounded-[28px] bg-night p-[clamp(28px,5vw,56px)] text-white">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -bottom-[220px] -left-[160px] h-[560px] w-[560px] rounded-full bg-accent opacity-25 blur-[120px]"
            />
            <div className="relative flex flex-col gap-3">
              <span className="text-[14px] font-semibold text-accent-label">{c.post.ctaLabel}</span>
              <strong className="text-[clamp(28px,3.6vw,44px)] leading-[1.08] font-extrabold tracking-[-0.035em] text-balance">
                {c.post.ctaTitle}
              </strong>
            </div>
            <div className="relative flex flex-col items-start gap-[14px]">
              <span className="text-[17px] leading-[1.6] text-on-night3">{c.post.ctaBody}</span>
              <div className="flex flex-wrap gap-[10px]">
                <a href={demoHref} className={`${btn.primary} h-[54px] px-[26px] text-[16px]`}>
                  {c.post.ctaDemo}
                </a>
                {docsHref && (
                  <a href={docsHref} className={`${btn.ghost} h-[54px] px-[22px] text-[16px]`}>
                    {c.post.ctaDocs}
                  </a>
                )}
              </div>
            </div>
          </div>
        </section>
      </div>

      {related.length > 0 && (
        <>
          {/* Mobile Related Section (2b) */}
          <section className="py-8 pb-9 border-t border-line bg-card flex flex-col gap-3.5 md:hidden">
            <div className="px-5 flex justify-between items-baseline">
              <h2 className="m-0 text-[22px] leading-[1.2] tracking-[-0.03em] font-extrabold text-ink">
                {c.post.readNextRelated}
              </h2>
            </div>
            <p className="m-0 px-5 text-[14px] leading-[1.55] text-ink-700">
              {c.post.readNextRelatedSub}
            </p>
            <div className="flex gap-2.5 overflow-x-auto [scroll-snap-type:x_mandatory] [scroll-padding:0_20px] px-5 [scrollbar-width:none]">
              {related.map((p) => (
                <MobileRelatedCard key={p.slug} post={p} lang={lang} />
              ))}
            </div>
            <a
              href={localizeHref(lang, "/blog")}
              className="px-5 font-semibold text-[14px] text-accent hover:underline"
            >
              {c.post.allUpdates} →
            </a>
          </section>

          {/* Desktop Related Section (≥ 768px, identical to original) */}
          <section className="border-t border-line bg-card text-ink max-md:hidden">
            <div className="mx-auto flex max-w-[1080px] flex-col gap-8 px-5 py-[clamp(56px,8vw,96px)]">
              <div className="flex flex-wrap items-end justify-between gap-4">
                <h2 className="m-0 text-[clamp(28px,3.6vw,44px)] font-extrabold tracking-[-0.035em]">{c.post.readNext}</h2>
                <a href={localizeHref(lang, "/blog")} className="text-[16px] font-semibold text-accent hover:underline">
                  {c.post.allPosts}
                </a>
              </div>
              <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,320px),1fr))] gap-5">
                {related.map((p) => (
                  <PostCard key={p.slug} post={p} radius="rounded-3xl" />
                ))}
              </div>
            </div>
          </section>
        </>
      )}

      {/* Mobile Footer (2b) */}
      <footer className="md:hidden bg-night text-white px-5 pt-8 pb-[120px] flex flex-col gap-5">
        <span className="text-[14px] leading-[1.5] text-on-night3">
          {c.footer.tagline}
        </span>
        <div className="flex flex-wrap gap-x-[18px] gap-y-2.5 text-[14px] text-on-night2">
          <a
            href={
              siteConfig.pricingEnabled
                ? localizeHref(lang, "/#bang-gia")
                : localizeHref(lang, "/#hoi-dap")
            }
            className="hover:text-accent-on-night"
          >
            {c.nav.pricing.label}
          </a>
          <a href={localizeHref(lang, "/blog")} className="hover:text-accent-on-night">
            {c.post.mobileCategory}
          </a>
          {docsHref && (
            <a href={docsHref} className="hover:text-accent-on-night">
              {c.nav.docs.label}
            </a>
          )}
          <a href={demoHref} className="hover:text-accent-on-night">
            {c.footer.partner}
          </a>
          <a
            href={siteConfig.social.linkedin}
            target="_blank"
            rel="me noopener noreferrer"
            className="hover:text-accent-on-night"
          >
            LinkedIn
          </a>
          <a
            href={siteConfig.social.facebook}
            target="_blank"
            rel="me noopener noreferrer"
            className="hover:text-accent-on-night"
          >
            Facebook
          </a>
          <a
            href={siteConfig.social.github}
            target="_blank"
            rel="me noopener noreferrer"
            className="hover:text-accent-on-night"
          >
            GitHub
          </a>
        </div>
        <span className="text-[12px] text-on-night-muted">
          {c.footer.rights.replace("{Y}", String(new Date().getFullYear()))}
        </span>
      </footer>

      {/* Desktop Footer (≥ 768px) */}
      <div className="max-md:hidden">
        <Footer />
      </div>

      {/* Desktop Floating Actions (≥ 768px) */}
      <div className="max-md:hidden">
        <FloatingActions demoHref={demoHref} />
      </div>
    </div>
  );
}
