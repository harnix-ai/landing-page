"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { LogoMark, Wordmark } from "@/components/logo";
import { useSite } from "@/components/providers";
import { btn } from "@/components/ui";
import { siteConfig } from "@/lib/config";
import { localizeHref, toViPath } from "@/lib/i18n";

type NavItem = {
  /** Section id on the home page this item tracks. */
  id: string;
  href: string;
  label: string;
  desc: string;
};

/** How far below the viewport top a section has to reach to count as "current". */
const SPY_OFFSET = 160;

/**
 * Highlights the nav item whose section the reader is in. Picks the section
 * whose top most recently crossed the offset, so it works whatever order the
 * sections sit in on the page.
 */
function useScrollSpy(ids: string[], enabled: boolean) {
  const [active, setActive] = useState<string | null>(null);
  const key = ids.join(",");

  useEffect(() => {
    if (!enabled) return;
    const sectionIds = key.split(",");
    const onScroll = () => {
      let best: string | null = null;
      let bestTop = -Infinity;
      for (const id of sectionIds) {
        const top = document.getElementById(id)?.getBoundingClientRect().top;
        if (top !== undefined && top < SPY_OFFSET && top > bestTop) {
          best = id;
          bestTop = top;
        }
      }
      setActive(best);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [key, enabled]);

  return active;
}

/**
 * The floating header: a rounded, blurred bar with a caption under every nav
 * item saying what is there. Full nav from 1240px; below that a ☰ button
 * opens the same items (captions included) inside the bar.
 *
 * `page="blog"` links the items back to the home page's sections and marks
 * Blog as current.
 */
export function Header({ page = "home" }: { page?: "home" | "blog" }) {
  const { c, lang } = useSite();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const onHome = page === "home";
  const home = (hash: string) => (onHome ? hash : localizeHref(lang, `/${hash}`));

  const items: NavItem[] = [
    { id: "cach-hoat-dong", href: home("#cach-hoat-dong"), ...c.nav.product },
    { id: "run", href: home("#run"), ...c.nav.run },
    ...(siteConfig.pricingEnabled ? [{ id: "bang-gia", href: home("#bang-gia"), ...c.nav.pricing }] : []),
    { id: "blog", href: onHome ? "#blog" : localizeHref(lang, "/blog"), ...c.nav.blog },
    ...(siteConfig.pricingEnabled ? [] : [{ id: "hoi-dap", href: home("#hoi-dap"), ...c.nav.faq }]),
  ];

  const spied = useScrollSpy(
    items.map((item) => item.id),
    onHome,
  );
  const current = onHome ? spied : "blog";

  const docsHref = siteConfig.docsUrl[lang];
  const otherLang = lang === "vi" ? "en" : "vi";
  const otherHref = localizeHref(otherLang, toViPath(pathname));

  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setMenuOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [menuOpen]);

  const close = () => setMenuOpen(false);

  return (
    <header className="sticky top-0 z-20 px-3 pt-3">
      <div className="mx-auto max-w-[1280px] rounded-[18px] border border-night-line bg-[rgba(18,22,27,0.82)] shadow-[0_12px_40px_-14px_rgba(0,0,0,0.7),inset_0_1px_0_rgba(255,255,255,0.05)] backdrop-blur-[16px]">
        <nav aria-label="Harnix" className="flex h-[66px] items-center gap-[18px] pr-[9px] pl-4">
          <a
            href={onHome ? "#top" : localizeHref(lang, "/")}
            aria-label={c.nav.home}
            className="flex shrink-0 items-center gap-[10px] text-white"
          >
            <LogoMark size={34} />
            <span className="max-[379px]:hidden">
              <Wordmark className="text-[24px] leading-none font-semibold tracking-[-0.02em]" />
            </span>
          </a>

          <span aria-hidden="true" className="hidden h-7 w-px shrink-0 bg-night-line wide:block" />
          <div className="hidden gap-[2px] whitespace-nowrap wide:flex">
            {items.map((item) => {
              const isCurrent = current === item.id;
              return (
                <a
                  key={item.id}
                  href={item.href}
                  aria-current={isCurrent ? (onHome ? "location" : "page") : undefined}
                  className={`flex flex-col gap-[3px] rounded-xl px-[14px] py-[9px] leading-[1.15] transition-colors hover:bg-night-hover ${isCurrent ? "bg-night-hover" : ""}`}
                >
                  <span className="flex items-center gap-[6px] text-[14.5px] font-semibold text-white">
                    {item.label}
                    <span
                      aria-hidden="true"
                      className="h-[5px] w-[5px] rounded-[2px] bg-accent-on-night transition-opacity"
                      style={{ opacity: isCurrent ? 1 : 0 }}
                    />
                  </span>
                  <span className="text-[12px] font-normal text-on-night-muted">{item.desc}</span>
                </a>
              );
            })}
          </div>

          <div className="ml-auto flex items-center gap-2">
            <div className="hidden items-center gap-2 wide:flex">
              {docsHref ? (
                <a
                  href={docsHref}
                  className="flex h-11 items-center gap-1 rounded-xl px-[10px] text-[14px] font-semibold whitespace-nowrap text-on-night2 transition-colors hover:bg-night-hover hover:text-white"
                >
                  {c.nav.docs.label}
                  <span aria-hidden="true" className="text-[12px] text-on-night-muted">
                    ↗
                  </span>
                </a>
              ) : (
                <span
                  aria-disabled="true"
                  title={c.nav.docsSoon}
                  className="flex h-11 items-center gap-[6px] px-[10px] text-[14px] font-semibold whitespace-nowrap text-on-night-faint"
                >
                  {c.nav.docs.label}
                  <span className="text-[11px] font-medium">· {c.nav.docsSoon}</span>
                </span>
              )}
              <a
                href={otherHref}
                hrefLang={otherLang}
                title={c.nav.other.label}
                className="flex h-11 items-center gap-[6px] rounded-xl px-3 text-[13px] font-semibold text-on-night-muted transition-colors hover:bg-night-hover hover:text-white"
              >
                <span className={lang === "vi" ? "text-white" : ""}>VI</span>
                <span aria-hidden="true" className="text-night-line3">
                  /
                </span>
                <span className={lang === "en" ? "text-white" : ""}>EN</span>
              </a>
            </div>

            <a href={home("#demo")} className={`${btn.primary} h-[46px] rounded-xl! px-5 text-[15px]`}>
              {c.nav.cta}
            </a>

            <button
              type="button"
              onClick={() => setMenuOpen((open) => !open)}
              aria-expanded={menuOpen}
              aria-controls="hx-menu"
              aria-label={menuOpen ? c.nav.menuClose : c.nav.menuOpen}
              className="flex h-[46px] w-[46px] shrink-0 cursor-pointer flex-col items-center justify-center gap-[5px] rounded-xl border border-night-line2 bg-night-card wide:hidden"
            >
              <span
                className="h-[2px] w-[18px] rounded-[2px] bg-white transition-transform"
                style={{ transform: menuOpen ? "translateY(3.5px) rotate(45deg)" : undefined }}
              />
              <span
                className="ml-[6px] h-[2px] w-3 rounded-[2px] bg-accent-on-night transition-transform"
                style={{ transform: menuOpen ? "translate(-3px,-3.5px) rotate(-45deg) scaleX(1.5)" : undefined }}
              />
            </button>
          </div>
        </nav>

        {menuOpen && (
          <div id="hx-menu" className="flex flex-col gap-[2px] border-t border-night-line px-[6px] pt-2 pb-[10px] wide:hidden">
            {items.map((item) => (
              <MenuLink
                key={item.id}
                href={item.href}
                label={item.label}
                desc={item.desc}
                current={current === item.id}
                onClick={close}
              />
            ))}
            {docsHref ? (
              <MenuLink href={docsHref} label={c.nav.docs.label} desc={c.nav.docs.desc} external onClick={close} />
            ) : (
              <div aria-disabled="true" className="flex flex-col gap-1 rounded-[14px] px-3 py-[14px]">
                <span className="text-[19px] font-semibold text-on-night-faint">{c.nav.docs.label}</span>
                <span className="text-[14px] text-on-night-faint">{c.nav.docsSoon}</span>
              </div>
            )}
            <MenuLink href={otherHref} label={c.nav.other.label} desc={c.nav.other.desc} external onClick={close} />
          </div>
        )}
      </div>
    </header>
  );
}

function MenuLink({
  href,
  label,
  desc,
  current = false,
  external = false,
  onClick,
}: {
  href: string;
  label: string;
  desc: string;
  current?: boolean;
  external?: boolean;
  onClick: () => void;
}) {
  return (
    <a
      href={href}
      onClick={onClick}
      aria-current={current ? "location" : undefined}
      className={`flex items-center justify-between gap-3 rounded-[14px] px-3 py-[14px] transition-colors hover:bg-night-hover ${current ? "bg-night-hover" : ""}`}
    >
      <span className="flex flex-col gap-1">
        <span className="text-[19px] font-semibold text-white">{label}</span>
        <span className="text-[14px] text-on-night-muted">{desc}</span>
      </span>
      {external && (
        <span aria-hidden="true" className="text-[18px] text-accent-on-night">
          ↗
        </span>
      )}
    </a>
  );
}
