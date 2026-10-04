"use client";

import { useEffect, useState } from "react";
import { useSite } from "@/components/providers";
import { btn } from "@/components/ui";
import { localizeHref } from "@/lib/i18n";

/** Thin accent bar across the top of the viewport, tracking how far the reader is. */
export function ReadingProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(max > 0 ? Math.min(100, (window.scrollY / max) * 100) : 0);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <div
      aria-hidden="true"
      className="fixed top-0 left-0 z-30 h-[3px] bg-accent-on-night transition-[width] duration-100 ease-linear"
      style={{ width: `${progress}%` }}
    />
  );
}

export function CopyLinkButton({ url, tone }: { url: string; tone: "night" | "paper" }) {
  const { c } = useSite();
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const timer = setTimeout(() => setCopied(false), 2000);
    return () => clearTimeout(timer);
  }, [copied]);

  async function copy() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
    } catch {
      // Clipboard blocked (insecure context, permissions) — nothing to confirm.
    }
  }

  return (
    <button
      type="button"
      onClick={copy}
      className={`${tone === "night" ? btn.ghost : btn.outline} h-[42px] cursor-pointer rounded-xl! px-4 text-[14px]`}
    >
      <span aria-live="polite">{copied ? c.post.copied : c.post.copyLink}</span>
    </button>
  );
}

export type TocItem = { id: string; text: string };

/** How far below the viewport top a heading has to reach to count as "current". */
const TOC_OFFSET = 160;

/**
 * Sticky "Trong bài" list, the current heading lit in accent. `runLink`
 * adds the "see it visually" card pointing at the home page's Run story.
 */
export function TableOfContents({ items, runLink }: { items: TocItem[]; runLink: boolean }) {
  const { c, lang } = useSite();
  const [active, setActive] = useState(0);
  const key = items.map((item) => item.id).join(",");

  useEffect(() => {
    const ids = key.split(",");
    const onScroll = () => {
      let current = 0;
      ids.forEach((id, i) => {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top < TOC_OFFSET) current = i;
      });
      setActive(current);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [key]);

  return (
    <aside className="sticky top-[110px] hidden flex-col gap-[18px] toc:flex">
      {items.length > 0 && (
        <nav aria-label={c.post.inThisPost} className="flex flex-col gap-[18px]">
          <span className="text-[13px] font-semibold tracking-[0.08em] text-ink-500 uppercase">{c.post.inThisPost}</span>
          <div className="flex flex-col">
            {items.map((item, i) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                aria-current={i === active ? "location" : undefined}
                className={`border-l-2 py-[10px] pl-4 text-[15px] font-semibold transition-colors hover:text-accent ${i === active ? "border-accent text-ink" : "border-line text-ink-500"}`}
              >
                {item.text}
              </a>
            ))}
          </div>
        </nav>
      )}
      {runLink && (
        <a
          href={localizeHref(lang, "/#run")}
          className="flex flex-col gap-[6px] rounded-2xl border border-line bg-card p-4 transition-colors hover:border-accent"
        >
          <span className="text-[13px] font-semibold text-accent">{c.post.seeVisualLabel}</span>
          <span className="text-[15px] leading-[1.4] font-semibold text-ink">{c.post.seeVisualBody}</span>
        </a>
      )}
    </aside>
  );
}
