"use client";

import { useSite } from "@/components/providers";
import { Container, Rich } from "@/components/ui";

/** "Chatbot khác chỉ trả lời." — three numbered rows, keywords highlighted. */
export function Proof() {
  const { c } = useSite();
  const p = c.proof;

  return (
    <section className="bg-paper text-ink">
      <Container className="flex flex-col gap-8 py-16 md:gap-[clamp(40px,6vw,64px)] md:py-[clamp(72px,10vw,140px)]">
        <h2 className="m-0 text-[36px] leading-[1.02] font-extrabold tracking-[-0.04em] text-balance md:text-[clamp(36px,6vw,80px)] md:leading-none">
          {p.title}
          <br />
          <span className="text-accent">{p.titleAccent}</span>
        </h2>
        <div className="flex flex-col border-t border-line2">
          {p.rows.map((row, i) => (
            <div
              key={row.title}
              className="reveal flex flex-col gap-3 border-b border-line2 py-[26px] md:grid md:grid-cols-[repeat(auto-fit,minmax(min(100%,340px),1fr))] md:items-baseline md:gap-x-12 md:gap-y-[14px] md:py-9"
            >
              <div className="flex items-baseline gap-3.5 md:gap-[18px]">
                <span className="text-[14px] font-bold text-accent tabular-nums md:text-[15px]">{String(i + 1).padStart(2, "0")}</span>
                <h3 className="m-0 text-[23px] font-bold tracking-[-0.02em] text-balance md:text-[clamp(24px,3vw,34px)]">
                  {row.title}
                </h3>
              </div>
              <p className="m-0 text-[17px] leading-[1.6] text-pretty text-ink-700 md:text-[clamp(18px,1.9vw,22px)]">
                <Rich text={row.body} em={(part) => <mark className="hx-mark">{part}</mark>} />
              </p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
