"use client";

import { useSite } from "@/components/providers";
import { btn, Container, sectionPad } from "@/components/ui";

/**
 * Three monthly tiers, the middle one highlighted. The numbers are the
 * design's placeholders. Rendered only while `siteConfig.pricingEnabled` is
 * on (`NEXT_PUBLIC_PRICING_ENABLED=true`) — the pricing model is not settled,
 * so the home page hides it and the header/footer/FAQ fall back to non-price
 * copy. Kept intact so it can be switched back on unchanged.
 */
export function Pricing() {
  const { c } = useSite();
  const p = c.pricing;

  return (
    <section id="bang-gia" className="bg-night">
      <Container className={`flex flex-col gap-12 ${sectionPad}`}>
        <div className="flex flex-col items-center gap-4 text-center">
          <span className="text-[15px] font-semibold text-accent-label">{p.label}</span>
          <h2 className="m-0 text-[clamp(34px,5.5vw,68px)] leading-[1.02] font-extrabold tracking-[-0.04em]">
            {p.title}
          </h2>
          <p className="m-0 max-w-[520px] text-[17px] leading-[1.6] text-on-night3">{p.sub}</p>
        </div>

        <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,300px),1fr))] items-stretch gap-4">
          {p.plans.map((plan, i) => {
            const featured = i === 1;
            const isQuote = i === p.plans.length - 1;
            return (
              <div
                key={plan.name}
                className={`flex flex-col gap-[22px] rounded-3xl p-8 ${featured ? "bg-card text-ink shadow-[0_0_0_4px_#0f8f6a]" : "border border-night-line bg-night-card"}`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="m-0 mb-[6px] text-[22px] font-bold">{plan.name}</h3>
                    <span className={`text-[15px] ${featured ? "text-ink-500" : "text-on-night-muted"}`}>{plan.desc}</span>
                  </div>
                  {featured && (
                    <span className="rounded-full bg-accent px-3 py-1 text-[12px] font-semibold text-white">{p.popular}</span>
                  )}
                </div>
                <div className="flex flex-wrap items-baseline gap-[6px]">
                  <span className="text-[42px] font-extrabold tracking-[-0.04em]">{plan.price}</span>
                  {!isQuote && (
                    <span className={`text-[15px] ${featured ? "text-ink-500" : "text-on-night-muted"}`}>{p.perMonth}</span>
                  )}
                </div>
                <ul
                  className={`m-0 flex list-none flex-col gap-[10px] border-t p-0 pt-5 text-[15px] ${featured ? "border-line text-ink-700" : "border-night-line text-on-night2"}`}
                >
                  {plan.features.map((f) => (
                    <li key={f}>{f}</li>
                  ))}
                </ul>
                <a
                  href="#demo"
                  className={`mt-auto w-full ${featured ? `${btn.primary} h-[54px] px-7 text-[16px]` : `${btn.ghost} h-[52px]`}`}
                >
                  {plan.cta}
                </a>
              </div>
            );
          })}
        </div>
        <p className="m-0 text-center text-[13px] text-on-night-muted italic">{p.note}</p>
      </Container>
    </section>
  );
}
