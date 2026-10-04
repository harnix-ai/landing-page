"use client";

import { useSite } from "@/components/providers";
import { Container, sectionPad } from "@/components/ui";
import { siteConfig } from "@/lib/config";

/**
 * Native `<details>` accordion, first item open. The pricing answer depends on
 * whether the pricing section is live; the JSON-LD reads the same text via
 * `getFaqs`.
 */
export function Faq() {
  const { c } = useSite();
  const f = c.faq;
  const price = f.price;

  const items = [
    ...f.items.map((item) => ({ q: item.q, a: <>{item.a}</> })),
    {
      q: price.q,
      a: siteConfig.pricingEnabled ? (
        <>
          {price.aEnabled}{" "}
          <a href="#bang-gia" className="font-semibold text-accent hover:underline">
            {price.link}
          </a>
          .
        </>
      ) : (
        <>{price.aDisabled}</>
      ),
    },
  ];

  return (
    <section id="hoi-dap" className="bg-paper text-ink">
      <Container className={`grid grid-cols-[repeat(auto-fit,minmax(min(100%,380px),1fr))] items-start gap-10 ${sectionPad}`}>
        <h2 className="m-0 text-[clamp(30px,4.5vw,52px)] leading-[1.05] font-extrabold tracking-[-0.035em]">{f.title}</h2>
        <div className="flex flex-col gap-[10px]">
          {items.map((item, i) => (
            <details key={item.q} open={i === 0} className="group rounded-[18px] border border-line bg-card px-6">
              <summary className="flex cursor-pointer list-none justify-between gap-4 py-[22px] text-[18px] font-semibold">
                {item.q}
                <span
                  aria-hidden="true"
                  className="text-ink-500 transition-transform duration-200 group-open:rotate-45"
                >
                  +
                </span>
              </summary>
              <p className="m-0 mb-[22px] text-[16px] leading-[1.65] text-ink-700">{item.a}</p>
            </details>
          ))}
        </div>
      </Container>
    </section>
  );
}
