"use client";

import { useSite } from "@/components/providers";
import { Container, Rich, sectionPad } from "@/components/ui";

/** "Chatbot khác chỉ trả lời." — three numbered rows, keywords highlighted. */
export function Proof() {
  const { c } = useSite();
  const p = c.proof;

  return (
    <section className="bg-paper text-ink">
      <Container className={`flex flex-col gap-[clamp(40px,6vw,64px)] ${sectionPad}`}>
        <h2 className="m-0 text-[clamp(36px,6vw,80px)] leading-none font-extrabold tracking-[-0.04em] text-balance">
          {p.title}
          <br />
          <span className="text-accent">{p.titleAccent}</span>
        </h2>
        <div className="flex flex-col border-t border-line2">
          {p.rows.map((row, i) => (
            <div
              key={row.title}
              className="reveal grid grid-cols-[repeat(auto-fit,minmax(min(100%,340px),1fr))] items-baseline gap-x-12 gap-y-[14px] border-b border-line2 py-9"
            >
              <div className="flex items-baseline gap-[18px]">
                <span className="text-[15px] font-bold text-accent tabular-nums">{String(i + 1).padStart(2, "0")}</span>
                <h3 className="m-0 text-[clamp(24px,3vw,34px)] font-bold tracking-[-0.02em] text-balance">
                  {row.title}
                </h3>
              </div>
              <p className="m-0 text-[clamp(18px,1.9vw,22px)] leading-[1.6] text-pretty text-ink-700">
                <Rich text={row.body} em={(part) => <mark className="hx-mark">{part}</mark>} />
              </p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
