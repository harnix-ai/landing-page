"use client";

import { useSite } from "@/components/providers";
import { postCopy, type Post } from "@/content/posts";
import { formatDate, readingTime } from "@/lib/copy";

type Size = "lg" | "sm";

export function PostCover({ image, imageAlt = "", tag, size, compactMobile = false }: {
  image: string | null; imageAlt?: string; tag: string; size: Size; compactMobile?: boolean;
}) {
  return <div className={`relative overflow-hidden bg-accent ${size === "lg" ? "min-h-[clamp(260px,32vw,420px)] flex-1" : "h-[200px] w-full"} ${compactMobile ? "max-md:min-h-[220px]" : ""}`}>
    {image ? <img src={image} alt={imageAlt} className="absolute inset-0 h-full w-full object-cover" /> : <div aria-hidden="true" className="absolute bottom-8 left-8 flex gap-3"><span className="size-14 rounded-xl bg-white" /><span className="size-14 rounded-xl border-2 border-white/60" /><span className="size-14 rounded-xl border-2 border-white/35" /></div>}
    <span className="relative m-5 inline-block rounded-lg bg-night/70 px-3 py-1.5 text-[13px] font-semibold text-white">{tag}</span>
  </div>;
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
    <a href={post.url} className={`${cardBase} ${m ? "max-md:rounded-3xl" : ""} ${className}`}>
      <PostCover image={post.image} imageAlt={post.imageAlt} tag={tag} size="lg" compactMobile={m} />
      <div className={`flex flex-col gap-3 p-[clamp(22px,3vw,32px)] ${m ? "max-md:gap-[10px] max-md:p-5" : ""}`}>
        <span className={`text-[15px] text-ink-500 ${m ? "max-md:text-[14px]" : ""}`}>
          {c.blog.latest} · {formatDate(post.publishedAt, lang)} · {readingTime(c, post.readingMinutes)}
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

function PostThumb({ post }: { post: Post }) {
  return <span className="relative flex-none size-[88px] overflow-hidden rounded-[14px] bg-accent md:size-[120px] md:rounded-[18px]">
    {post.image ? <img src={post.image} alt={post.imageAlt} className="h-full w-full object-cover" /> : <span aria-hidden="true" className="absolute inset-5 rounded-lg border-2 border-white/60" />}
  </span>;
}

/** Thumbnail on the left, then topic, title and date · reading time ("Harnix có gì mới" right column). */
export function CompactPostCard({ post }: { post: Post }) {
  const { c, lang } = useSite();
  const { title, tag } = postCopy(post, lang);

  return (
    <a
      href={post.url}
      className="flex items-center gap-[14px] rounded-[20px] border border-line bg-card p-3 text-ink transition-[transform,box-shadow] duration-250 hover:text-ink motion-safe:hover:-translate-y-[3px] hover:shadow-[0_20px_40px_-24px_rgba(17,20,24,0.25)] md:gap-5 md:rounded-3xl md:p-4 blog:flex-1"
    >
      <PostThumb post={post} />
      <span className="flex min-w-0 flex-col gap-[6px] md:gap-2">
        <span className="text-[12px] font-semibold text-accent-strong md:text-[13px]">{tag}</span>
        <strong className="text-[18px] leading-[1.25] font-bold md:text-[22px] md:tracking-[-0.02em]">{title}</strong>
        <span className="text-[13px] text-ink-500 md:text-[14px]">
          {formatDate(post.publishedAt, lang)} · {readingTime(c, post.readingMinutes)}
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
    <a href={post.url} className={`${cardBase} ${radius}`}>
      <PostCover image={post.image} imageAlt={post.imageAlt} tag={tag} size="sm" />
      <div className="flex flex-col gap-[10px] px-6 pt-[22px] pb-[26px]">
        <span className="text-[14px] text-ink-500">
          {formatDate(post.publishedAt, lang)} · {readingTime(c, post.readingMinutes)}
        </span>
        <strong className="text-[24px] leading-[1.2] font-bold tracking-[-0.02em]">{title}</strong>
      </div>
    </a>
  );
}
