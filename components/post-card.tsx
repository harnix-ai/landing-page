"use client";

import { useSite } from "@/components/providers";
import { postCopy, type Post, type PostCover as CoverKind } from "@/content/posts";
import { formatDate, readingTime } from "@/lib/copy";
import { localizeHref } from "@/lib/i18n";

type Size = "lg" | "sm";

/**
 * Covers are drawn from type and simple shapes, one motif per topic — no
 * stock imagery. `lg` is the featured slot, `sm` a regular card.
 */
export function PostCover({ cover, tag, size }: { cover: CoverKind; tag: string; size: Size }) {
  const lg = size === "lg";

  if (cover === "run") {
    return (
      <div
        className={`relative flex flex-col justify-between overflow-hidden bg-night ${lg ? "min-h-[clamp(260px,32vw,420px)] flex-1 p-[clamp(20px,3vw,32px)]" : "h-[200px] p-[22px]"}`}
      >
        <div
          aria-hidden="true"
          className="absolute -top-[120px] -right-[120px] h-[420px] w-[420px] rounded-full bg-accent opacity-35 blur-[90px]"
        />
        <span className="relative self-start rounded-lg bg-accent-deep px-3 py-[6px] text-[13px] font-semibold text-accent-label">
          {tag}
        </span>
        <div aria-hidden="true" className="relative flex items-end justify-between gap-5">
          <span
            className={`leading-[0.78] font-extrabold tracking-[-0.06em] text-accent-on-night ${lg ? "text-[clamp(96px,14vw,200px)]" : "text-[96px]"}`}
          >
            Run
          </span>
          <div className="flex flex-col gap-2 pb-2">
            {[96, 72, 110, 60].map((w, i) => (
              <span key={w} className="flex items-center gap-2">
                <span className={`h-2 w-2 rounded-full ${i === 3 ? "bg-warn" : "bg-accent-on-night"}`} />
                <span className="h-[6px] rounded-[3px] bg-night-ghost" style={{ width: lg ? w : w * 0.6 }} />
              </span>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (cover === "console") {
    return (
      <div
        className={`flex flex-col justify-between overflow-hidden bg-accent-soft ${lg ? "min-h-[clamp(260px,32vw,420px)] flex-1 p-[clamp(20px,3vw,32px)]" : "h-[200px] p-[22px]"}`}
      >
        <span className="self-start rounded-lg bg-card px-3 py-[6px] text-[13px] font-semibold text-accent-strong">{tag}</span>
        <div
          aria-hidden="true"
          className={`grid gap-2 rounded-xl border border-accent-soft-line bg-card p-2 ${lg ? "h-[clamp(140px,16vw,200px)] grid-cols-[72px_1fr]" : "h-[84px] grid-cols-[44px_1fr]"}`}
        >
          <span className="rounded-lg bg-night" />
          <span className="relative overflow-hidden rounded-lg bg-subtle">
            <span className="absolute inset-x-0 top-0 h-[14px] bg-[repeating-linear-gradient(90deg,#d0453e_0_6px,transparent_6px_12px)] opacity-50" />
          </span>
        </div>
      </div>
    );
  }

  const block = lg ? "h-[clamp(56px,7vw,88px)] w-[clamp(56px,7vw,88px)] rounded-[16px]" : "h-14 w-14 rounded-xl";
  return (
    <div
      className={`flex flex-col justify-between overflow-hidden bg-accent ${lg ? "min-h-[clamp(260px,32vw,420px)] flex-1 p-[clamp(20px,3vw,32px)]" : "h-[200px] p-[22px]"}`}
    >
      <span className="self-start rounded-lg bg-night/[0.22] px-3 py-[6px] text-[13px] font-semibold text-white">{tag}</span>
      <div aria-hidden="true" className="flex items-end gap-2">
        <span className={`${block} bg-white`} />
        <span className={`${block} border-2 border-white/60`} />
        <span className={`${block} border-2 border-white/60`} />
        <span className={`${block} border-2 border-white/35`} />
      </div>
    </div>
  );
}

const cardBase =
  "flex flex-col overflow-hidden rounded-[28px] border border-line bg-card text-ink transition-[transform,box-shadow] duration-250 hover:-translate-y-1 hover:shadow-[0_24px_48px_-24px_rgba(17,20,24,0.25)]";

/** The big card: cover, "Mới nhất" meta line, title and excerpt. */
export function FeaturedPostCard({ post, className = "" }: { post: Post; className?: string }) {
  const { c, lang } = useSite();
  const { title, excerpt, tag } = postCopy(post, lang);

  return (
    <a href={localizeHref(lang, post.url)} className={`${cardBase} ${className}`}>
      <PostCover cover={post.cover} tag={tag} size="lg" />
      <div className="flex flex-col gap-3 p-[clamp(22px,3vw,32px)]">
        <span className="text-[15px] text-ink-500">
          {c.blog.latest} · {formatDate(post.date, lang)} · {readingTime(c, post.readingMinutes)}
        </span>
        <strong className="text-[clamp(26px,3vw,36px)] leading-[1.15] font-extrabold tracking-[-0.025em] text-balance">
          {title}
        </strong>
        <span className="text-[17px] leading-[1.55] text-ink-700">{excerpt}</span>
      </div>
    </a>
  );
}

/** A regular card: cover, date · reading time, title. No excerpt, by design. */
export function PostCard({ post, radius = "rounded-[28px]" }: { post: Post; radius?: string }) {
  const { c, lang } = useSite();
  const { title, tag } = postCopy(post, lang);

  return (
    <a href={localizeHref(lang, post.url)} className={`${cardBase} ${radius}`}>
      <PostCover cover={post.cover} tag={tag} size="sm" />
      <div className="flex flex-col gap-[10px] px-6 pt-[22px] pb-[26px]">
        <span className="text-[14px] text-ink-500">
          {formatDate(post.date, lang)} · {readingTime(c, post.readingMinutes)}
        </span>
        <strong className="text-[24px] leading-[1.2] font-bold tracking-[-0.02em]">{title}</strong>
      </div>
    </a>
  );
}
