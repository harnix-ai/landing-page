"use client";

import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { LogoMark, Wordmark } from "@/components/logo";
import { useSite } from "@/components/providers";
import { btn } from "@/components/ui";
import { siteConfig } from "@/lib/config";
import { localizeHref, toViPath } from "@/lib/i18n";
import { useFocusTrap } from "@/lib/use-focus-trap";

type NavItem = {
  /** Section id on the home page this item tracks. */
  id: string;
  href: string;
  label: string;
  desc: string;
  external?: boolean;
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

function useNavItems(page: "home" | "blog") {
  const { c, lang } = useSite();
  const onHome = page === "home";
  const home = (hash: string) => (onHome ? hash : localizeHref(lang, `/${hash}`));

  const items: NavItem[] = [
    { id: "cach-hoat-dong", href: home("#cach-hoat-dong"), ...c.nav.product },
    { id: "run", href: home("#run"), ...c.nav.run },
    ...(siteConfig.pricingEnabled ? [{ id: "bang-gia", href: home("#bang-gia"), ...c.nav.pricing }] : []),
    { id: "blog", href: onHome ? "#blog" : localizeHref(lang, "/blog"), ...c.nav.blog },
    ...(siteConfig.pricingEnabled ? [] : [{ id: "hoi-dap", href: home("#hoi-dap"), ...c.nav.faq }]),
  ];

  return { items, onHome, home };
}

/**
 * The floating header: a rounded, blurred bar with a caption under every nav
 * item saying what is there. Full nav from 1240px; below that a ☰ button
 * opens the same items (captions included) inside the bar.
 *
 * Below 768px the bar is replaced by the 1a editorial header: a flush 60px
 * row and a full-screen menu. Desktop ≥768 stays exactly as it was.
 *
 * `page="blog"` links the items back to the home page's sections and marks
 * Blog as current.
 */
export function Header({ page = "home" }: { page?: "home" | "blog" }) {
  const { c, lang } = useSite();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const { items, onHome, home } = useNavItems(page);

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
    <header className="sticky top-0 z-20">
      <div className="hidden px-3 pt-3 md:block">
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
      </div>

      <MobileHeader page={page} current={current} />
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

function MobileHeader({ page, current }: { page: "home" | "blog"; current: string | null }) {
  const { c, lang, overlay, setOverlay } = useSite();
  const pathname = usePathname();
  const { items, onHome, home } = useNavItems(page);
  const open = overlay === "menu";
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const close = useCallback(() => setOverlay(null), [setOverlay]);
  const toggle = () => setOverlay(open ? null : "menu");

  useFocusTrap(open, menuRef, close);

  const docsHref = siteConfig.docsUrl[lang];
  const otherLang = lang === "vi" ? "en" : "vi";
  const otherHref = localizeHref(otherLang, toViPath(pathname));

  const menuItems: NavItem[] = [
    ...items,
    {
      id: "docs",
      href: docsHref || "#",
      label: c.nav.docs.label,
      desc: docsHref ? c.nav.docs.desc : c.nav.docsSoon,
      external: true,
    },
  ];

  return (
    <div className="md:hidden">
      <div className="border-b border-night-rule bg-[rgba(13,16,20,0.92)] backdrop-blur-[16px]">
        <nav aria-label="Harnix" className="flex h-[60px] items-center gap-2.5 pr-3 pl-[18px]">
          <a
            href={onHome ? "#top" : localizeHref(lang, "/")}
            aria-label={c.nav.home}
            className="flex shrink-0 items-center gap-2 text-white"
          >
            <LogoMark size={30} />
            <Wordmark className="text-[21px] leading-none font-semibold tracking-[-0.02em]" />
          </a>
          <a
            href={home("#demo")}
            className="ml-auto flex h-[42px] items-center rounded-xl border border-accent-on-night bg-accent px-3.5 text-[14px] font-semibold whitespace-nowrap text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.28),0_0_0_3px_rgba(71,196,150,0.14)]"
          >
            {c.nav.cta}
          </a>
          <button
            ref={buttonRef}
            type="button"
            onClick={toggle}
            aria-expanded={open}
            aria-controls="hx-menu-mobile"
            aria-label={open ? c.nav.menuClose : c.nav.menuOpen}
            className="flex h-11 w-11 shrink-0 cursor-pointer flex-col items-center justify-center gap-[5px] rounded-xl border border-night-line2 bg-night-card"
          >
            <span className="h-0.5 w-[18px] rounded-[2px] bg-white" />
            <span className="ml-1.5 h-0.5 w-3 rounded-[2px] bg-accent-on-night" />
          </button>
        </nav>
      </div>

      {open && (
        <div
          ref={menuRef}
          id="hx-menu-mobile"
          role="dialog"
          aria-modal="true"
          aria-label={c.nav.menuOpen}
          tabIndex={-1}
          className="fixed inset-0 z-50 flex flex-col bg-night"
        >
          <div className="flex h-[60px] items-center justify-between pr-3 pl-[18px]">
            <span className="flex items-center gap-2">
              <LogoMark size={30} />
              <Wordmark className="text-[21px] font-semibold tracking-[-0.02em]" />
            </span>
            <button
              type="button"
              onClick={close}
              aria-label={c.nav.menuClose}
              className="flex h-11 w-11 cursor-pointer items-center justify-center rounded-xl border border-night-line2 bg-night-card text-[22px] text-white"
            >
              ×
            </button>
          </div>
          <nav className="flex flex-col px-5 pt-3">
            {menuItems.map((item, i) => {
              const disabled = item.id === "docs" && !docsHref;
              const isCurrent = current === item.id;
              const n = String(i + 1).padStart(2, "0");
              const arrow = item.external ? (
                <span aria-hidden="true" className="text-[20px] text-accent-on-night">
                  ↗
                </span>
              ) : (
                <span aria-hidden="true" className="text-[20px] text-on-night-faint">
                  →
                </span>
              );
              const body = (
                <>
                  <span className="w-5 text-[13px] font-bold text-accent-on-night">{n}</span>
                  <span className="flex flex-1 flex-col gap-[3px]">
                    <span className={`text-[28px] font-bold tracking-[-0.03em] ${disabled ? "text-on-night-faint" : "text-white"}`}>
                      {item.label}
                    </span>
                    <span className={`text-[14px] ${disabled ? "text-on-night-faint" : "text-on-night-muted"}`}>{item.desc}</span>
                  </span>
                  {arrow}
                </>
              );
              const row = `flex items-center gap-4 py-[18px] ${i < menuItems.length - 1 ? "border-b border-night-rule" : ""}`;
              if (disabled) {
                return (
                  <span key={item.id} aria-disabled="true" className={row}>
                    {body}
                  </span>
                );
              }
              return (
                <a
                  key={item.id}
                  href={item.href}
                  onClick={close}
                  aria-current={isCurrent ? (onHome ? "location" : "page") : undefined}
                  className={`${row} hover:text-white`}
                >
                  {body}
                </a>
              );
            })}
          </nav>
          <div className="mt-auto flex flex-col gap-3.5 px-5 pb-[34px]">
            <a
              href={otherHref}
              hrefLang={otherLang}
              onClick={close}
              className="flex h-11 w-fit items-center gap-2 self-start rounded-xl border border-night-line2 px-3.5 text-[14px] font-semibold text-on-night-muted"
            >
              <span className={lang === "vi" ? "text-white" : ""}>VI</span>
              <span aria-hidden="true" className="text-night-line3">
                /
              </span>
              <span className={lang === "en" ? "text-white" : ""}>{lang === "vi" ? "English" : "EN"}</span>
            </a>
            <a
              href={home("#demo")}
              onClick={close}
              className="flex h-14 items-center justify-center rounded-[14px] border border-accent-on-night bg-accent text-[17px] font-semibold text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.28),0_0_0_3px_rgba(71,196,150,0.14)]"
            >
              {c.nav.cta}
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
