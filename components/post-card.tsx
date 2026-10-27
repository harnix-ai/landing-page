"use client";

import type { CSSProperties } from "react";
import { useSite } from "@/components/providers";
import { postCopy, type Post, type PostCover as CoverKind } from "@/content/posts";
import { formatDate, readingTime } from "@/lib/copy";
import { localizeHref } from "@/lib/i18n";

type Size = "lg" | "sm";

/**
 * Covers are drawn from type and simple shapes, one motif per topic — no
 * stock imagery. `lg` is the featured slot, `sm` a regular card.
 */
export function PostCover({
  cover,
  tag,
  size,
  compactMobile = false,
}: {
  cover: CoverKind;
  tag: string;
  size: Size;
  /** Home "Harnix có gì mới" on phones: a 220px cover with a 110px "Run" (mobile 1a). */
  compactMobile?: boolean;
}) {
  const lg = size === "lg";
  const m = lg && compactMobile;

  if (cover === "run") {
    return (
      <div
        className={`relative flex flex-col justify-between overflow-hidden bg-night ${lg ? "min-h-[clamp(260px,32vw,420px)] flex-1 p-[clamp(20px,3vw,32px)]" : "h-[200px] p-[22px]"} ${m ? "max-md:h-[220px] max-md:min-h-0 max-md:flex-none max-md:p-5" : ""}`}
      >
        <div
          aria-hidden="true"
          className={`absolute -top-[120px] -right-[120px] h-[420px] w-[420px] rounded-full bg-accent opacity-35 blur-[90px] ${m ? "max-md:h-[320px] max-md:w-[320px] max-md:blur-[80px]" : ""}`}
        />
        <span
          className={`relative self-start rounded-lg bg-accent-deep px-3 py-[6px] text-[13px] font-semibold text-accent-label ${m ? "max-md:px-[11px] max-md:py-[5px] max-md:text-[12px]" : ""}`}
        >
          {tag}
        </span>
        <div aria-hidden="true" className={`relative flex items-end justify-between gap-5 ${m ? "max-md:gap-4" : ""}`}>
          <span
            className={`leading-[0.78] font-extrabold tracking-[-0.06em] text-accent-on-night ${lg ? "text-[clamp(96px,14vw,200px)]" : "text-[96px]"} ${m ? "max-md:text-[110px]" : ""}`}
          >
            Run
          </span>
          <div className={`flex flex-col gap-2 pb-2 ${m ? "max-md:gap-[7px] max-md:pb-[6px]" : ""}`}>
            {/* Phones show three rows (70/52/40, last amber); wider screens all four. */}
            {[96, 72, 110, 60].map((w, i) => (
              <span
                key={w}
                className={`flex items-center gap-2 ${m ? "max-md:gap-[7px]" : ""} ${m && i === 2 ? "max-md:hidden" : ""}`}
              >
                <span
                  className={`h-2 w-2 rounded-full ${i === 3 ? "bg-warn" : "bg-accent-on-night"} ${m ? "max-md:h-[7px] max-md:w-[7px]" : ""}`}
                />
                <span
                  className={`h-[6px] w-(--bar) rounded-[3px] bg-night-ghost ${m ? "max-md:h-[5px] max-md:w-(--bar-m)" : ""}`}
                  style={
                    {
                      "--bar": `${lg ? w : w * 0.6}px`,
                      "--bar-m": `${[70, 52, 0, 40][i]}px`,
                    } as CSSProperties
                  }
                />
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
        className={`flex flex-col justify-between overflow-hidden bg-accent-soft ${lg ? "min-h-[clamp(260px,32vw,420px)] flex-1 p-[clamp(20px,3vw,32px)]" : "h-[200px] p-[22px]"} ${m ? "max-md:h-[220px] max-md:min-h-0 max-md:flex-none max-md:p-5" : ""}`}
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
      className={`flex flex-col justify-between overflow-hidden bg-accent ${lg ? "min-h-[clamp(260px,32vw,420px)] flex-1 p-[clamp(20px,3vw,32px)]" : "h-[200px] p-[22px]"} ${m ? "max-md:h-[220px] max-md:min-h-0 max-md:flex-none max-md:p-5" : ""}`}
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
export function FeaturedPostCard({
  post,
  className = "",
  compactMobile = false,
}: {
  post: Post;
  className?: string;
  /** Tighter phone layout used by the home section (mobile 1a). */
  compactMobile?: boolean;
}) {
  const { c, lang } = useSite();
  const { title, excerpt, tag } = postCopy(post, lang);
  const m = compactMobile;

  return (
    <a href={localizeHref(lang, post.url)} className={`${cardBase} ${m ? "max-md:rounded-3xl" : ""} ${className}`}>
      <PostCover cover={post.cover} tag={tag} size="lg" compactMobile={m} />
      <div className={`flex flex-col gap-3 p-[clamp(22px,3vw,32px)] ${m ? "max-md:gap-[10px] max-md:p-5" : ""}`}>
        <span className={`text-[15px] text-ink-500 ${m ? "max-md:text-[14px]" : ""}`}>
          {c.blog.latest} · {formatDate(post.date, lang)} · {readingTime(c, post.readingMinutes)}
        </span>
        <strong
          className={`text-[clamp(26px,3vw,36px)] leading-[1.15] font-extrabold tracking-[-0.025em] text-balance ${m ? "max-md:text-[24px] max-md:leading-[1.18]" : ""}`}
        >
          {title}
        </strong>
        <span className={`text-[17px] leading-[1.55] text-ink-700 ${m ? "max-md:text-[16px]" : ""}`}>{excerpt}</span>
      </div>
    </a>
  );
}

/**
 * The square cover of a compact card: 120px on wide screens, 88px on phones.
 * Same motif per `cover` as the big covers, drawn small.
 */
function PostThumb({ cover }: { cover: CoverKind }) {
  const box = "flex-none size-[88px] rounded-[14px] p-3 md:size-[120px] md:rounded-[18px] md:p-4";

  if (cover === "data") {
    return (
      <span aria-hidden="true" className={`${box} grid grid-cols-2 gap-[6px] bg-accent md:gap-2`}>
        <span className="rounded-[6px] bg-white md:rounded-lg" />
        <span className="rounded-[6px] border-2 border-white/60 md:rounded-lg" />
        <span className="rounded-[6px] border-2 border-white/60 md:rounded-lg" />
        <span className="rounded-[6px] border-2 border-white/35 md:rounded-lg" />
      </span>
    );
  }

  if (cover === "console") {
    return (
      <span aria-hidden="true" className={`${box} flex bg-accent-soft`}>
        <span className="grid flex-1 grid-cols-[18px_1fr] gap-[5px] rounded-lg border border-accent-soft-line bg-card p-[5px] md:grid-cols-[24px_1fr] md:gap-[6px] md:rounded-[10px] md:p-[7px]">
          <span className="rounded-[4px] bg-night md:rounded-[5px]" />
          <span className="rounded-[4px] bg-subtle md:rounded-[5px]" />
        </span>
      </span>
    );
  }

  return (
    <span aria-hidden="true" className={`${box} relative flex flex-col justify-between overflow-hidden bg-night`}>
      <span className="absolute -top-10 -right-10 size-[120px] rounded-full bg-accent opacity-35 blur-[30px]" />
      <span className="relative flex flex-col gap-1">
        {[28, 20, 24].map((w, i) => (
          <span key={w} className="flex items-center gap-1">
            <span className={`size-[5px] rounded-full ${i === 2 ? "bg-warn" : "bg-accent-on-night"}`} />
            <span className="h-[3px] rounded-[2px] bg-night-ghost" style={{ width: w }} />
          </span>
        ))}
      </span>
      <span className="relative text-[34px] leading-[0.78] font-extrabold tracking-[-0.06em] text-accent-on-night md:text-[44px]">
        Run
      </span>
    </span>
  );
}

/** Thumbnail on the left, then topic, title and date · reading time ("Harnix có gì mới" right column). */
export function CompactPostCard({ post }: { post: Post }) {
  const { c, lang } = useSite();
  const { title, tag } = postCopy(post, lang);

  return (
    <a
      href={localizeHref(lang, post.url)}
      className="flex items-center gap-[14px] rounded-[20px] border border-line bg-card p-3 text-ink transition-[transform,box-shadow] duration-250 hover:text-ink motion-safe:hover:-translate-y-[3px] hover:shadow-[0_20px_40px_-24px_rgba(17,20,24,0.25)] md:gap-5 md:rounded-3xl md:p-4 blog:flex-1"
    >
      <PostThumb cover={post.cover} />
      <span className="flex min-w-0 flex-col gap-[6px] md:gap-2">
        <span className="text-[12px] font-semibold text-accent-strong md:text-[13px]">{tag}</span>
        <strong className="text-[18px] leading-[1.25] font-bold md:text-[22px] md:tracking-[-0.02em]">{title}</strong>
        <span className="text-[13px] text-ink-500 md:text-[14px]">
          {formatDate(post.date, lang)} · {readingTime(c, post.readingMinutes)}
        </span>
      </span>
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
