"use client";

import { useEffect, useState } from "react";
import { LogoMark } from "@/components/logo";
import { useSite } from "@/components/providers";
import { siteConfig } from "@/lib/config";

/** Scroll distance before "back to top" appears. */
const SHOW_AFTER = 700;

/**
 * Bottom-right stack, always visible rather than hidden in a menu: the
 * back-to-top button (a staircase climbing to an accent arrow, from the logo)
 * and — once `siteConfig.chatEnabled` is on — the "Hỏi Harnix" launcher.
 * Back to top steps aside while the chat panel is open so the two never overlap.
 */
export function FloatingActions({ demoHref = "#demo" }: { demoHref?: string }) {
  const { c } = useSite();
  const [scrolled, setScrolled] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > SHOW_AFTER);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const showTop = scrolled && !chatOpen;

  return (
    <>
      {siteConfig.chatEnabled && chatOpen && (
        <ChatPanel demoHref={demoHref} onClose={() => setChatOpen(false)} />
      )}
      <div className="fixed right-4 bottom-4 z-41 flex flex-col items-end gap-[10px]">
        <button
          type="button"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          aria-label={c.backToTop}
          title={c.backToTop}
          tabIndex={showTop ? 0 : -1}
          aria-hidden={!showTop}
          className="flex h-12 w-12 cursor-pointer items-center justify-center rounded-[14px] border border-night-line3 bg-[rgba(18,22,27,0.9)] text-white shadow-[0_10px_30px_-10px_rgba(0,0,0,0.5)] backdrop-blur-[10px] transition-[opacity,transform,border-color] duration-250 hover:border-accent-on-night hover:bg-night-hover"
          style={{
            opacity: showTop ? 1 : 0,
            transform: showTop ? "none" : "translateY(8px)",
            pointerEvents: showTop ? "auto" : "none",
          }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M3.5 20H8V15.5H12.5V11H17" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M17 3.5V11M13.5 7L17 3.5L20.5 7" stroke="#47c496" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>

        {siteConfig.chatEnabled && (
          <button
            type="button"
            onClick={() => setChatOpen((open) => !open)}
            aria-label={c.chat.openLabel}
            aria-expanded={chatOpen}
            className="flex h-14 cursor-pointer items-center gap-3 rounded-2xl border border-accent-on-night bg-accent pr-5 pl-[10px] text-[16px] font-semibold text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.28),0_0_0_3px_rgba(71,196,150,0.16),0_16px_36px_-12px_rgba(15,143,106,0.9)] transition-[transform,background-color] duration-200 hover:-translate-y-px hover:bg-accent-hover"
          >
            <LogoMark size={38} filled />
            {chatOpen ? c.chat.close : c.chat.open}
          </button>
        )}
      </div>
    </>
  );
}

/** Preview UI only — the input does not answer yet. Behind `siteConfig.chatEnabled`. */
function ChatPanel({ demoHref, onClose }: { demoHref: string; onClose: () => void }) {
  const { c } = useSite();
  const ch = c.chat;
  const chip =
    "rounded-[10px] border border-accent-deep-line bg-accent-deeper px-[14px] py-[9px] text-left text-[14px] font-medium text-accent-pale transition-colors hover:border-accent-on-night";

  return (
    <div
      role="dialog"
      aria-label={ch.title}
      className="fixed right-4 bottom-[88px] z-40 w-[min(380px,calc(100vw-32px))] animate-[hx-rise_0.3s_both] overflow-hidden rounded-[22px] border border-night-line2 bg-night-panel text-white shadow-[0_30px_80px_-20px_rgba(0,0,0,0.7)]"
    >
      <div className="flex items-center gap-3 border-b border-night-line px-4 pt-4 pb-[14px]">
        <LogoMark size={40} filled />
        <div className="flex flex-1 flex-col gap-[2px]">
          <strong className="text-[16px] font-semibold">{ch.title}</strong>
          <span className="text-[13px] text-on-night-muted">{ch.sub}</span>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label={ch.closeLabel}
          className="h-10 w-10 cursor-pointer rounded-[10px] border border-night-line2 bg-transparent text-[18px] text-on-night2 hover:border-accent-on-night"
        >
          ×
        </button>
      </div>
      <div className="flex flex-col gap-[14px] px-4 py-[18px]">
        <div className="max-w-[88%] self-start rounded-[14px_14px_14px_4px] bg-night-hover px-[14px] py-3 text-[15px] leading-[1.55]">
          {ch.greeting}
        </div>
        <div className="flex flex-col items-start gap-2">
          {ch.suggestions.map((s) => (
            <button key={s} type="button" className={`${chip} cursor-pointer`}>
              {s}
            </button>
          ))}
          <a href={demoHref} onClick={onClose} className={chip}>
            {ch.bookDemo}
          </a>
        </div>
      </div>
      <form className="flex gap-2 border-t border-night-line p-3" onSubmit={(e) => e.preventDefault()}>
        <input
          aria-label={ch.placeholder}
          placeholder={ch.placeholder}
          className="h-[46px] min-w-0 flex-1 rounded-xl border border-night-line2 bg-night px-[14px] text-[15px] text-white outline-none focus:border-accent-on-night"
        />
        <button
          type="submit"
          className="h-[46px] cursor-pointer rounded-xl border border-accent-on-night bg-accent px-4 text-[15px] font-semibold text-white"
        >
          {ch.send}
        </button>
      </form>
    </div>
  );
}
