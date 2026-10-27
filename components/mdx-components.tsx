import { Children, isValidElement, type JSX, type ReactNode } from "react";
import { slugify } from "@/lib/slug";

type Props<T extends keyof JSX.IntrinsicElements> = JSX.IntrinsicElements[T];

/** Plain text of a heading's children, for its anchor id. */
function textOf(node: ReactNode): string {
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(textOf).join("");
  if (isValidElement<{ children?: ReactNode }>(node)) return textOf(node.props.children);
  return "";
}

/** Splits a `"a|b|c"` string prop — MDX here runs with JS expressions blocked, so props are strings. */
const cells = (value: string) => value.split("|").map((cell) => cell.trim());

/**
 * `<Summary>` — the "30-second summary" box. Write a numbered markdown list
 * inside it; it becomes the numbered grid. Its anchor is `#tom-tat`.
 */
function Summary({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div
      id="tom-tat"
      className="flex scroll-mt-[105px] md:scroll-mt-[110px] flex-col max-md:gap-3 md:gap-[14px] max-md:rounded-[18px] md:rounded-[22px] border border-accent-soft-line bg-accent-soft max-md:p-[18px] md:p-[clamp(22px,3vw,30px)] [&_li]:relative max-md:[&_li]:pl-6 md:[&_li]:pl-10 [&_li]:before:absolute [&_li]:before:left-0 [&_li]:before:font-extrabold [&_li]:before:text-accent [&_li]:before:content-[counter(hx)] [&_li]:[counter-increment:hx] [&_ol]:m-0 [&_ol]:flex [&_ol]:list-none [&_ol]:flex-col max-md:[&_ol]:gap-2 md:[&_ol]:gap-[10px] [&_ol]:p-0 max-md:[&_ol]:text-[15px] md:[&_ol]:text-[17px] [&_ol]:leading-[1.55] [&_ol]:text-ink [&_ol]:[counter-reset:hx] [&_p]:m-0 max-md:[&_p]:text-[15px] md:[&_p]:text-[17px]"
    >
      <span className="max-md:text-[11px] md:text-[13px] font-bold tracking-[0.08em] text-accent-strong uppercase">{label}</span>
      {children}
    </div>
  );
}

/**
 * `<Points>` — a numbered markdown list rendered as side-by-side cards with
 * a large accent number each on desktop, and a vertical list on mobile.
 */
function Points({ children }: { children: ReactNode }) {
  return (
    <div className="max-md:border-t max-md:border-line [&_ol]:m-0 [&_ol]:p-0 [&_ol]:list-none [&_ol]:[counter-reset:hx] max-md:[&_ol]:flex max-md:[&_ol]:flex-col md:[&_ol]:grid md:[&_ol]:grid-cols-[repeat(auto-fit,minmax(min(100%,280px),1fr))] md:[&_ol]:gap-[14px] [&_li]:[counter-increment:hx] max-md:[&_li]:border-b max-md:[&_li]:border-line max-md:[&_li]:py-[14px] max-md:[&_li]:px-0 max-md:[&_li]:grid max-md:[&_li]:grid-cols-[36px_minmax(0,1fr)] max-md:[&_li]:gap-2 max-md:[&_li]:text-[15px] max-md:[&_li]:leading-[1.6] md:[&_li]:rounded-[18px] md:[&_li]:border md:[&_li]:border-line md:[&_li]:bg-card md:[&_li]:p-[22px] md:[&_li]:text-[17px] md:[&_li]:leading-[1.6] [&_li]:before:block [&_li]:before:font-extrabold [&_li]:before:text-accent [&_li]:before:content-[counter(hx,decimal-leading-zero)] max-md:[&_li]:before:text-[20px] max-md:[&_li]:before:leading-[1.3] max-md:[&_li]:before:mb-0 md:[&_li]:before:mb-[10px] md:[&_li]:before:text-[36px] md:[&_li]:before:leading-none md:[&_li]:before:tracking-[-0.04em] [&_p]:m-0 max-md:[&_p]:text-[15px] md:[&_p]:text-[17px]">
      {children}
    </div>
  );
}

/**
 * `<Compare labels="Tình huống|Không có Run|Có Run" caption="…">` with one
 * `<Row cells="…|…|…" />` per line. The last column is the Harnix side and is
 * highlighted. On mobile, rendered as a two-column grid per spec 2b.
 */
function Compare({ labels, caption, children }: { labels: string; caption?: string; children: ReactNode }) {
  const head = cells(labels);
  const rows = Children.toArray(children)
    .filter((child) => isValidElement<{ cells?: string }>(child) && typeof child.props.cells === "string")
    .map((child) => cells((child as React.ReactElement<{ cells: string }>).props.cells));

  return (
    <figure className="max-md:my-1.5 md:my-3 flex flex-col max-md:gap-2.5 md:gap-3">
      {/* Mobile 2-column comparison layout (2b) */}
      <div className="md:hidden rounded-[16px] overflow-hidden border border-line bg-card grid grid-cols-2 text-[14px] leading-[1.45]">
        <div className="py-2.5 px-3.5 bg-subtle font-semibold text-ink-500">
          {head[1] ?? ""}
        </div>
        <div className="py-2.5 px-3.5 bg-night font-bold text-accent-on-night">
          {head[2] ?? ""}
        </div>
        {rows.map((row) => (
          <div key={row[0]} className="contents">
            <div className="col-span-2 px-3.5 pt-2.5 pb-0 text-[12px] font-bold tracking-[0.06em] uppercase text-ink border-t border-[#eceef1]">
              {row[0]}
            </div>
            <div className="px-3.5 pt-1.5 pb-3 text-ink-500">
              {row[1] ?? ""}
            </div>
            <div className="px-3.5 pt-1.5 pb-3 text-accent-strong font-semibold">
              {row[2] ?? ""}
            </div>
          </div>
        ))}
      </div>

      {/* Desktop table layout */}
      <div className="hidden md:block overflow-x-auto rounded-[22px] border border-line bg-card">
        <table className="w-full min-w-[480px] border-collapse text-left text-[15px] leading-[1.45]">
          <thead>
            <tr>
              {head.map((label, i) => (
                <th
                  key={label}
                  scope="col"
                  className={`px-[18px] py-[14px] ${i === head.length - 1 ? "bg-night font-bold text-accent-on-night" : "bg-subtle font-semibold text-ink-500"}`}
                >
                  {label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row[0]}>
                {row.map((cell, i) =>
                  i === 0 ? (
                    <th key={i} scope="row" className="border-t border-subtle px-[18px] py-4 font-semibold text-ink">
                      {cell}
                    </th>
                  ) : (
                    <td
                      key={i}
                      className={`border-t border-subtle px-[18px] py-4 ${i === row.length - 1 ? "bg-accent-tint font-semibold text-accent-strong" : "text-ink-500"}`}
                    >
                      {cell}
                    </td>
                  ),
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {caption && <figcaption className="text-[13px] md:text-[14px] text-ink-500">{caption}</figcaption>}
    </figure>
  );
}

/** Marker element read by `<Compare>`; renders nothing on its own. */
function Row(_: { cells: string }) {
  return null;
}

/** Typography for a post body on the paper background. */
export function getMdxComponents(summaryLabel: string) {
  return {
    h2: ({ children, ...props }: Props<"h2">) => (
      <h2
        id={slugify(textOf(children))}
        className="max-md:mt-3 max-md:text-[25px] max-md:leading-[1.15] max-md:tracking-[-0.03em] max-md:font-extrabold max-md:scroll-mt-[105px] md:mt-6 mb-0 md:scroll-mt-[110px] md:text-[clamp(28px,3.4vw,40px)] md:leading-[1.15] md:font-extrabold md:tracking-[-0.03em] text-ink text-balance"
        {...props}
      >
        {children}
      </h2>
    ),
    h3: (props: Props<"h3">) => (
      <h3 className="mt-4 mb-0 text-[clamp(22px,2.4vw,26px)] leading-[1.25] font-bold tracking-[-0.02em] text-ink" {...props} />
    ),
    p: (props: Props<"p">) => <p className="m-0" {...props} />,
    ul: (props: Props<"ul">) => <ul className="m-0 flex list-disc flex-col gap-2 pl-6 marker:text-accent" {...props} />,
    ol: (props: Props<"ol">) => <ol className="m-0 flex list-decimal flex-col gap-2 pl-6 marker:font-bold marker:text-accent" {...props} />,
    li: (props: Props<"li">) => <li {...props} />,
    a: (props: Props<"a">) => (
      <a className="font-semibold text-accent underline decoration-accent/30 underline-offset-4 hover:decoration-accent" {...props} />
    ),
    strong: (props: Props<"strong">) => <strong className="font-semibold text-ink" {...props} />,
    code: (props: Props<"code">) => (
      <code
        className="rounded-md max-md:rounded-[6px] bg-accent-soft px-2 max-md:px-[7px] py-px max-md:py-[1px] font-sans text-[0.86em] max-md:text-[0.84em] font-semibold whitespace-nowrap text-accent-strong"
        {...props}
      />
    ),
    blockquote: ({ children }: Props<"blockquote">) => (
      <blockquote className="max-md:my-1 max-md:p-[18px] max-md:rounded-[16px] max-md:bg-night max-md:text-white max-md:text-[21px] max-md:leading-[1.3] max-md:tracking-[-0.02em] max-md:font-bold max-md:border-0 md:my-2 md:border-l-4 md:border-accent-on-night md:py-2 md:pl-[clamp(20px,3vw,32px)] md:text-[clamp(24px,2.8vw,32px)] md:leading-[1.3] md:font-bold md:tracking-[-0.02em] md:text-ink text-balance [&_p]:m-0">
        <span aria-hidden="true" className="hidden max-md:block w-7 h-[3px] mb-3 bg-accent-on-night" />
        {children}
      </blockquote>
    ),
    hr: () => <hr className="my-2 border-0 border-t border-line" />,
    Summary: ({ children }: { children: ReactNode }) => <Summary label={summaryLabel}>{children}</Summary>,
    Points,
    Compare,
    Row,
  };
}
