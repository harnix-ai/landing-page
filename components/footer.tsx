"use client";

import { usePathname } from "next/navigation";
import { Wordmark } from "@/components/logo";
import { useSite } from "@/components/providers";
import { siteConfig } from "@/lib/config";
import { localizeHref, toViPath } from "@/lib/i18n";

/** Tagline and links on top; the oversized "harnıx" wordmark, dot in accent, below. */
export function Footer() {
  const { c, lang } = useSite();
  const pathname = usePathname();
  const docsHref = siteConfig.docsUrl[lang];
  const otherLang = lang === "vi" ? "en" : "vi";

  const links = [
    siteConfig.pricingEnabled
      ? { label: c.nav.pricing.label, href: localizeHref(lang, "/#bang-gia") }
      : { label: c.nav.faq.label, href: localizeHref(lang, "/#hoi-dap") },
    { label: c.nav.blog.label, href: localizeHref(lang, "/blog") },
    { label: c.nav.docs.label, href: docsHref },
    { label: c.footer.partner, href: localizeHref(lang, "/#demo") },
    { label: "LinkedIn", href: siteConfig.social.linkedin, external: true },
    { label: "Facebook", href: siteConfig.social.facebook, external: true },
    { label: "GitHub", href: siteConfig.social.github, external: true },
  ];

  return (
    <footer className="border-t border-night-rule bg-night text-white">
      <div className="mx-auto flex max-w-[1280px] flex-col gap-12 px-5 pt-14 pb-10">
        <div className="flex flex-wrap justify-between gap-8">
          <span className="max-w-[340px] text-[15px] leading-[1.6] text-on-night3">{c.footer.tagline}</span>
          <nav aria-label="Footer" className="flex flex-wrap gap-x-6 gap-y-3 text-[15px] text-on-night2">
            {links.map((link) =>
              link.href ? (
                <a
                  key={link.label}
                  href={link.href}
                  className="transition-colors hover:text-accent-on-night"
                  {...(link.external ? { target: "_blank", rel: "me noopener noreferrer" } : {})}
                >
                  {link.label}
                </a>
              ) : (
                <span key={link.label} aria-disabled="true" title={c.footer.soon} className="text-on-night-faint">
                  {link.label}
                </span>
              ),
            )}
            <a
              href={localizeHref(otherLang, toViPath(pathname))}
              hrefLang={otherLang}
              className="transition-colors hover:text-accent-on-night"
            >
              {c.nav.other.label}
            </a>
          </nav>
        </div>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <Wordmark
            radius="0.03em"
            className="text-[clamp(72px,18vw,240px)] leading-[0.8] font-extrabold tracking-[-0.06em] text-night-rule"
          />
          <span className="text-[14px] text-on-night-muted">
            {c.footer.rights.replace("{Y}", String(new Date().getFullYear()))}
          </span>
        </div>
      </div>
    </footer>
  );
}
