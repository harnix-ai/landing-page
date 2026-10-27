"use client";

import { useSite } from "@/components/providers";
import { Container } from "@/components/ui";
import { siteConfig } from "@/lib/config";

const REVEAL = ["reveal", "reveal reveal-2", "reveal reveal-3"];

/**
 * "Tài liệu bạn đã có." — three outcome cards, each split into what you do
 * ("Bạn chỉ cần") and what Harnix does. The last card is accent-filled.
 */
export function HowItWorks() {
  const { c } = useSite();
  const h = c.how;

  return (
    <section id="cach-hoat-dong" className="border-t border-night-rule bg-night">
      <Container className="flex flex-col gap-8 py-16 md:gap-14 md:py-[clamp(72px,10vw,140px)]">
        <div className="flex flex-col gap-3.5 md:gap-4">
          <span className="text-[14px] font-semibold text-accent-label md:text-[15px]">{h.label}</span>
          <h2 className="m-0 max-w-[900px] text-[34px] leading-[1.04] font-extrabold tracking-[-0.04em] text-balance md:text-[clamp(34px,5.5vw,68px)] md:leading-[1.02]">
            {h.title} <span className="text-accent-on-night">{h.titleAccent}</span>
          </h2>
          <p className="m-0 max-w-[640px] text-[17px] leading-[1.6] text-pretty text-on-night3 md:text-[clamp(18px,1.9vw,21px)]">
            {h.sub}
          </p>
        </div>

        <div className="flex flex-col gap-3.5 md:grid md:grid-cols-[repeat(auto-fit,minmax(min(100%,320px),1fr))] md:gap-5">
          {h.cards.map((card, i) => {
            const filled = i === h.cards.length - 1;
            const tag = siteConfig.stepTags[i] ?? "available";
            const tagLabel = tag === "available" || tag === "soon" ? h.tags[tag] : tag;
            const rule = filled ? "border-white/20" : "border-night-line";

            return (
              <div
                key={card.title}
                className={`${REVEAL[i] ?? "reveal"} flex flex-col gap-[18px] rounded-[22px] p-6 md:gap-6 md:rounded-3xl md:p-8 ${filled ? "bg-accent" : "border border-night-line bg-night-card"}`}
              >
                <div className="flex items-center justify-between gap-3">
                  <span
                    aria-hidden="true"
                    className={`text-[48px] leading-[0.8] font-extrabold tracking-[-0.05em] md:text-[56px] ${filled ? "text-white/35" : "text-night-ghost"}`}
                  >
                    {i + 1}
                  </span>
                  <span className={`text-[13px] font-semibold ${filled ? "text-accent-pale" : "text-accent-on-night"}`}>
                    {tagLabel}
                  </span>
                </div>
                <h3 className="m-0 text-[22px] leading-[1.25] font-bold tracking-[-0.02em] text-balance md:text-[clamp(24px,2.4vw,30px)] md:leading-[1.2]">
                  {card.title}
                </h3>
                <dl className={`m-0 mt-auto flex flex-col border-t ${rule}`}>
                  <div className={`grid grid-cols-[84px_minmax(0,1fr)] gap-3 border-b py-3 md:grid-cols-[92px_minmax(0,1fr)] md:py-[14px] ${rule}`}>
                    <dt className={`text-[13px] font-semibold md:text-[14px] ${filled ? "text-accent-pale" : "text-on-night-muted"}`}>
                      {h.youNeed}
                    </dt>
                    <dd className={`m-0 text-[15px] leading-[1.5] md:text-[16px] ${filled ? "text-white" : "text-on-night2"}`}>{card.need}</dd>
                  </div>
                  <div className="grid grid-cols-[84px_minmax(0,1fr)] gap-3 pt-3 md:grid-cols-[92px_minmax(0,1fr)] md:pt-[14px]">
                    <dt className={`text-[13px] font-semibold md:text-[14px] ${filled ? "text-white" : "text-accent-on-night"}`}>
                      {h.harnixDoes}
                    </dt>
                    <dd className="m-0 text-[15px] leading-[1.5] font-medium text-white md:text-[16px]">{card.does}</dd>
                  </div>
                </dl>
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
