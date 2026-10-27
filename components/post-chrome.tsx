"use client";

import { useEffect, useState } from "react";
import { useSite } from "@/components/providers";
import { btn } from "@/components/ui";
import { siteConfig } from "@/lib/config";
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

/**
 * Mobile post chrome per spec 2b "Compact":
 * - Sticky header with logo, section label, 2-line menu button
 * - Position-tracking TOC chips row
 * - Integrated 2px reading progress bar
 * - Floating bottom bar with demo CTA and copy link
 * - Full-screen accessible mobile menu
 */
export function MobilePostChrome({
  items,
  shareUrl,
  demoHref,
}: {
  items: TocItem[];
  shareUrl: string;
  demoHref: string;
}) {
  const { c, lang } = useSite();
  const [menuOpen, setMenuOpen] = useState(false);
  const [progress, setProgress] = useState(0);
  const [activeToc, setActiveToc] = useState(-1);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const timer = setTimeout(() => setCopied(false), 2000);
    return () => clearTimeout(timer);
  }, [copied]);

  async function copy() {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
    } catch {
      // Clipboard blocked
    }
  }

  const key = items.map((item) => item.id).join(",");
  useEffect(() => {
    const ids = key ? key.split(",") : [];
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const p = max > 0 ? Math.min(100, Math.round((window.scrollY / max) * 100)) : 0;
      setProgress(p);

      let current = -1;
      ids.forEach((id, i) => {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top < 170) {
          current = i;
        }
      });
      setActiveToc(current);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [key]);

  useEffect(() => {
    if (!menuOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [menuOpen]);

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = "";
      };
    }
  }, [menuOpen]);

  const showChips = activeToc >= 0 || progress > 8;

  const scrollToItem = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (!el) return;
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const top = el.getBoundingClientRect().top + window.scrollY - 105;
    window.scrollTo({
      top,
      behavior: prefersReducedMotion ? "auto" : "smooth",
    });
  };

  const docsHref = siteConfig.docsUrl[lang];
  const pricingHref = siteConfig.pricingEnabled
    ? localizeHref(lang, "/#bang-gia")
    : localizeHref(lang, "/#hoi-dap");

  return (
    <>
      {/* Mobile Sticky Header (2b) */}
      <header className="sticky top-0 z-20 bg-night text-white md:hidden">
        <div className="flex h-[54px] items-center gap-3 pr-3 pl-[18px]">
          <a
            href={localizeHref(lang, "/")}
            aria-label="Harnix"
            className="flex items-center gap-2 text-white hover:text-white rounded-lg focus-visible:outline-2 focus-visible:outline-accent-on-night"
          >
            <svg width="28" height="28" viewBox="0 0 34 34" fill="none" aria-hidden="true">
              <rect x="1" y="1" width="32" height="32" rx="9" stroke="#fff" strokeWidth="2" />
              <path
                d="M8 25H11.5V21H15V16.5H18.5V12.5H21"
                stroke="#fff"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <circle cx="8" cy="25" r="2.2" fill="#fff" />
              <rect x="21" y="7.5" width="6" height="6" rx="1.6" fill="#47c496" />
            </svg>
            <span className="text-[19px] font-semibold leading-none tracking-[-0.02em]">
              harn
              <span className="relative">
                ı
                <span
                  aria-hidden="true"
                  className="absolute top-[0.2em] left-1/2 h-[0.2em] w-[0.2em] -translate-x-1/2 rounded-[0.04em] bg-accent-on-night"
                />
              </span>
              x
            </span>
          </a>

          <span aria-hidden="true" className="h-5 w-px bg-night-line2" />
          <span className="text-[14px] font-semibold text-accent-label">
            {c.post.mobileCategory}
          </span>

          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            aria-label={menuOpen ? c.nav.menuClose : c.nav.menuOpen}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            className="ml-auto flex h-11 w-11 shrink-0 cursor-pointer flex-col items-center justify-center gap-[5px] rounded-xl border-0 bg-night-card hover:bg-night-hover focus-visible:outline-2 focus-visible:outline-accent-on-night"
          >
            <span aria-hidden="true" className="h-0.5 w-[18px] rounded-[2px] bg-white" />
            <span aria-hidden="true" className="ml-1.5 h-0.5 w-3 rounded-[2px] bg-accent-on-night" />
          </button>
        </div>

        {/* Position-tracking TOC chips row */}
        {showChips && items.length > 0 && (
          <nav
            aria-label={c.post.inThisPost}
            className="flex gap-1.5 overflow-x-auto px-4 pt-0.5 pb-2.5 [scrollbar-width:none]"
          >
            {items.map((item, i) => {
              const active = activeToc === i;
              return (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  onClick={(e) => scrollToItem(e, item.id)}
                  aria-current={active ? "location" : undefined}
                  className={`relative flex h-[34px] shrink-0 items-center rounded-full px-3 text-[13px] font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-accent-on-night after:absolute after:-inset-y-[5px] after:inset-x-0 ${
                    active ? "bg-accent-on-night text-night" : "bg-night-card text-on-night2 hover:text-white"
                  }`}
                >
                  {item.text}
                </a>
              );
            })}
          </nav>
        )}

        {/* Integrated 2px reading progress bar */}
        <div
          role="progressbar"
          aria-valuenow={progress}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={c.post.inThisPost}
          className="h-[2px] bg-night-rule"
        >
          <div
            className="h-full bg-accent-on-night transition-[width] duration-100 ease-linear"
            style={{ width: `${progress}%` }}
          />
        </div>
      </header>

      {/* Floating Bottom Bar (2b) */}
      {!menuOpen && (
        <div
          role="region"
          aria-label="Actions"
          className="fixed right-3 bottom-6 left-3 z-40 flex gap-1.5 rounded-[20px] border border-night-line2 bg-[rgba(23,27,33,0.9)] p-1.5 shadow-[0_16px_40px_-12px_rgba(0,0,0,0.5)] backdrop-blur-[14px] md:hidden"
        >
          <a
            href={demoHref}
            className="flex h-[50px] flex-1 items-center justify-center rounded-[14px] border border-accent-on-night bg-accent text-[16px] font-semibold text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.28)] transition-colors hover:bg-accent-hover focus-visible:outline-2 focus-visible:outline-accent-on-night"
          >
            {c.post.ctaDemo}
          </a>
          <button
            type="button"
            onClick={copy}
            className="h-[50px] cursor-pointer whitespace-nowrap rounded-[14px] border border-night-line3 bg-night px-3.5 text-[14px] font-semibold text-white transition-colors hover:border-accent-on-night focus-visible:outline-2 focus-visible:outline-accent-on-night"
          >
            <span aria-live="polite">{copied ? c.post.copied : c.post.copyLink}</span>
          </button>
        </div>
      )}

      {/* Mobile Menu Overlay (2b) */}
      {menuOpen && (
        <div
          id="mobile-menu"
          role="dialog"
          aria-modal="true"
          aria-label={c.post.menuTitle}
          className="fixed inset-0 z-60 flex flex-col overflow-y-auto bg-night pt-0 pb-[34px] text-white md:hidden"
        >
          <div className="flex h-[54px] items-center justify-between pr-3 pl-[18px]">
            <span className="text-[14px] font-semibold text-on-night-muted">{c.post.menuTitle}</span>
            <button
              type="button"
              onClick={() => setMenuOpen(false)}
              aria-label={c.nav.menuClose}
              className="flex h-11 w-11 cursor-pointer items-center justify-center rounded-xl border-0 bg-night-card text-[22px] text-white hover:bg-night-hover focus-visible:outline-2 focus-visible:outline-accent-on-night"
            >
              ×
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2 px-4 pt-2">
            <a
              href={localizeHref(lang, "/#product")}
              onClick={() => setMenuOpen(false)}
              className="flex h-[132px] flex-col justify-end gap-[3px] rounded-[18px] border border-night-line bg-night-card p-4 text-white hover:border-night-line2 focus-visible:outline-2 focus-visible:outline-accent-on-night"
            >
              <strong className="text-[19px] font-bold">{c.nav.product.label}</strong>
              <span className="text-[12px] text-on-night-muted">{c.nav.product.desc}</span>
            </a>
            <a
              href={localizeHref(lang, "/#run")}
              onClick={() => setMenuOpen(false)}
              className="flex h-[132px] flex-col justify-end gap-[3px] rounded-[18px] border border-night-line bg-night-card p-4 text-white hover:border-night-line2 focus-visible:outline-2 focus-visible:outline-accent-on-night"
            >
              <strong className="text-[19px] font-bold">{c.nav.run.label}</strong>
              <span className="text-[12px] text-on-night-muted">{c.nav.run.desc}</span>
            </a>
            <a
              href={pricingHref}
              onClick={() => setMenuOpen(false)}
              className="flex h-[132px] flex-col justify-end gap-[3px] rounded-[18px] border border-night-line bg-night-card p-4 text-white hover:border-night-line2 focus-visible:outline-2 focus-visible:outline-accent-on-night"
            >
              <strong className="text-[19px] font-bold">{c.nav.pricing.label}</strong>
              <span className="text-[12px] text-on-night-muted">{c.nav.pricing.desc}</span>
            </a>
            <a
              href={localizeHref(lang, "/blog")}
              onClick={() => setMenuOpen(false)}
              className="flex h-[132px] flex-col justify-end gap-[3px] rounded-[18px] border border-accent-deep-line bg-accent-deeper p-4 text-white focus-visible:outline-2 focus-visible:outline-accent-on-night"
            >
              <strong className="text-[19px] font-bold">{c.post.mobileCategory}</strong>
              <span className="text-[12px] text-on-night3">{c.post.mobileCategoryDesc}</span>
            </a>
          </div>

          <div className="px-5 pt-4">
            <a
              href={docsHref}
              onClick={() => setMenuOpen(false)}
              className="flex items-center justify-between py-4 text-white hover:text-white rounded-lg focus-visible:outline-2 focus-visible:outline-accent-on-night"
            >
              <span className="flex flex-col gap-[3px]">
                <span className="text-[17px] font-semibold">{c.nav.docs.label}</span>
                <span className="text-[13px] text-on-night-muted">{c.nav.docs.desc}</span>
              </span>
              <span className="text-[20px] text-accent-on-night">↗</span>
            </a>
          </div>

          <div className="mt-auto px-4 pt-4">
            <a
              href={demoHref}
              onClick={() => setMenuOpen(false)}
              className="flex h-14 items-center justify-center rounded-[14px] border border-accent-on-night bg-accent text-[17px] font-semibold text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.28),0_0_0_3px_rgba(71,196,150,0.14)] hover:bg-accent-hover focus-visible:outline-2 focus-visible:outline-accent-on-night"
            >
              {c.nav.cta}
            </a>
          </div>
        </div>
      )}
    </>
  );
}
