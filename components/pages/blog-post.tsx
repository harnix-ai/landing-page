import { MDXRemote } from "next-mdx-remote/rsc";
import { notFound } from "next/navigation";
import { FloatingActions } from "@/components/floating-actions";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { getMdxComponents } from "@/components/mdx-components";
import { PostCard, PostCover } from "@/components/post-card";
import { CopyLinkButton, ReadingProgress, TableOfContents } from "@/components/post-chrome";
import { SkipLink } from "@/components/skip-link";
import { btn } from "@/components/ui";
import { postCopy, type Post } from "@/content/posts";
import { siteConfig } from "@/lib/config";
import { formatDate, getCopy, readingTime, type Lang } from "@/lib/copy";
import { localizeHref } from "@/lib/i18n";
import { getAllPosts, getPost } from "@/lib/posts";
import { absoluteUrl } from "@/lib/seo";

/**
 * The Run post's cover: the six steps of a Run that crashes mid-way and
 * resumes until the customer gets an answer.
 */
function RunTimeline({ lang }: { lang: Lang }) {
  const steps =
    lang === "vi"
      ? ["Khách hỏi", "Tra tài liệu", "Có căn cứ", "Sự cố giữa chừng", "Chạy tiếp", "Khách nhận câu trả lời"]
      : ["Customer asks", "Checks documents", "Evidence found", "Fault mid-way", "Resumes", "Customer gets the answer"];
  const events = ["user_message", "tool_call", "tool_result", "worker crash", "resume", "completed"];

  return (
    <ol className="m-0 grid list-none grid-cols-[repeat(auto-fit,minmax(min(100%,150px),1fr))] gap-[10px] p-0">
      {events.map((event, i) => {
        const crash = i === 3;
        const resume = i === 4;
        const done = i === 5;
        return (
          <li
            key={event}
            className={`flex flex-col gap-2 rounded-[14px] p-[14px] ${crash ? "border border-[#5a2a28] bg-[#2a1414]" : done ? "bg-accent" : `border bg-night-card ${resume ? "border-accent-deep-line" : "border-night-line"}`}`}
          >
            <span
              aria-hidden="true"
              className={`h-[10px] w-[10px] rounded-full ${crash ? "bg-err" : resume ? "bg-warn" : done ? "bg-white" : "bg-accent-on-night"}`}
            />
            <span className={`text-[13px] font-semibold ${crash ? "text-err-soft" : done ? "text-accent-pale" : "text-accent-label"}`}>
              {event}
            </span>
            <span className={`text-[14px] ${crash ? "text-[#f3d4d2]" : done ? "font-semibold text-white" : "text-on-night2"}`}>
              {steps[i]}
            </span>
          </li>
        );
      })}
    </ol>
  );
}

/** Up to two other posts, newest first. */
function relatedPosts(current: Post): Post[] {
  return getAllPosts()
    .filter((post) => post.slug !== current.slug)
    .slice(0, 2);
}

/** Shared shell for `/blog/[slug]` and `/en/blog/[slug]` — `getPost` resolves the right-language title/body, with a vi fallback baked in. */
export function BlogPostPage({ lang, slug }: { lang: Lang; slug: string }) {
  const result = getPost(slug, lang);
  if (!result) notFound();

  const c = getCopy(lang);
  const { post, title, excerpt, body, hasTranslation, headings, hasSummary } = result;
  const { tag, tags } = postCopy(post, lang);
  const shareUrl = absoluteUrl(lang, post.url);
  const related = relatedPosts(post);
  const docsHref = siteConfig.docsUrl[lang];
  const demoHref = localizeHref(lang, "/#demo");
  const toc = [...(hasSummary ? [{ id: "tom-tat", text: c.post.summaryToc }] : []), ...headings];
  const isRun = post.cover === "run";

  return (
    <div id="top">
      <ReadingProgress />
      <SkipLink />
      <Header page="blog" />
      <div className="bg-night text-white">

        <div className="relative overflow-hidden">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -top-[200px] -right-[200px] h-[700px] w-[700px] rounded-full bg-accent opacity-[0.22] blur-[140px]"
          />
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
            {!hasTranslation && <p className="m-0 text-[15px] text-on-night-muted italic">{c.post.viOnly}</p>}
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
                    <time dateTime={post.date}>{formatDate(post.date, lang)}</time> · {readingTime(c, post.readingMinutes)}
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
              {isRun ? (
                <div className="p-[clamp(20px,3vw,32px)]">
                  <RunTimeline lang={lang} />
                </div>
              ) : (
                <div className="flex">
                  <PostCover cover={post.cover} tag={tag} size="lg" />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-paper text-ink">
        <main
          id="main"
          className="mx-auto grid max-w-[1080px] items-start gap-[clamp(32px,5vw,64px)] px-5 pt-[clamp(40px,6vw,72px)] pb-[clamp(56px,8vw,96px)] toc:grid-cols-[220px_minmax(0,1fr)]"
        >
          <TableOfContents items={toc} runLink={isRun} />

          <article className="flex max-w-[720px] min-w-0 flex-col gap-7 text-[clamp(18px,1.6vw,20px)] leading-[1.75] text-ink-body">
            <MDXRemote source={body} components={getMdxComponents(c.post.summaryLabel)} />

            <div className="mt-4 flex flex-wrap items-center justify-between gap-4 border-t border-line pt-6">
              <ul className="m-0 flex list-none flex-wrap gap-2 p-0">
                {[tag, ...tags.filter((t) => t !== tag)].map((t) => (
                  <li key={t} className="rounded-lg bg-subtle px-3 py-[6px] text-[14px] font-semibold text-ink-700">
                    {t}
                  </li>
                ))}
              </ul>
              <CopyLinkButton url={shareUrl} tone="paper" />
            </div>
          </article>
        </main>

        <section className="mx-auto max-w-[1080px] px-5 pb-[clamp(56px,8vw,96px)]">
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
        <section className="border-t border-line bg-card text-ink">
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
      )}

      <Footer />
      <FloatingActions demoHref={demoHref} />
    </div>
  );
}
