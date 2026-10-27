"use client";

import { useSite } from "@/components/providers";
import { Container } from "@/components/ui";
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
      <Container className="grid grid-cols-1 items-start gap-6 py-16 md:grid-cols-[repeat(auto-fit,minmax(min(100%,380px),1fr))] md:gap-10 md:py-[clamp(72px,10vw,140px)]">
        <h2 className="m-0 text-[30px] leading-[1.05] font-extrabold tracking-[-0.035em] md:text-[clamp(30px,4.5vw,52px)]">{f.title}</h2>
        <div className="flex flex-col gap-2 md:gap-[10px]">
          {items.map((item, i) => (
            <details key={item.q} open={i === 0} className="group rounded-2xl border border-line bg-card px-[18px] md:rounded-[18px] md:px-6">
              <summary className="flex min-h-11 cursor-pointer list-none justify-between gap-3.5 py-[18px] text-[16px] font-semibold md:gap-4 md:py-[22px] md:text-[18px]">
                {item.q}
                <span
                  aria-hidden="true"
                  className="text-ink-500 transition-transform duration-200 group-open:rotate-45"
                >
                  +
                </span>
              </summary>
              <p className="m-0 mb-[18px] text-[15px] leading-[1.65] text-ink-700 md:mb-[22px] md:text-[16px]">{item.a}</p>
            </details>
          ))}
        </div>
      </Container>
    </section>
  );
}
