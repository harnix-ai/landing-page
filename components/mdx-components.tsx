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
      className="flex scroll-mt-[110px] flex-col gap-[14px] rounded-[22px] border border-accent-soft-line bg-accent-soft p-[clamp(22px,3vw,30px)] [&_li]:relative [&_li]:pl-10 [&_li]:before:absolute [&_li]:before:left-0 [&_li]:before:font-extrabold [&_li]:before:text-accent [&_li]:before:content-[counter(hx)] [&_li]:[counter-increment:hx] [&_ol]:m-0 [&_ol]:flex [&_ol]:list-none [&_ol]:flex-col [&_ol]:gap-[10px] [&_ol]:p-0 [&_ol]:text-[17px] [&_ol]:leading-[1.55] [&_ol]:text-ink [&_ol]:[counter-reset:hx] [&_p]:m-0 [&_p]:text-[17px]"
    >
      <span className="text-[13px] font-bold tracking-[0.08em] text-accent-strong uppercase">{label}</span>
      {children}
    </div>
  );
}

/**
 * `<Points>` — a numbered markdown list rendered as side-by-side cards with
 * a large accent number each.
 */
function Points({ children }: { children: ReactNode }) {
  return (
    <div className="[&_li]:rounded-[18px] [&_li]:border [&_li]:border-line [&_li]:bg-card [&_li]:p-[22px] [&_li]:text-[17px] [&_li]:leading-[1.6] [&_li]:before:mb-[10px] [&_li]:before:block [&_li]:before:text-[36px] [&_li]:before:leading-none [&_li]:before:font-extrabold [&_li]:before:tracking-[-0.04em] [&_li]:before:text-accent [&_li]:before:content-[counter(hx,decimal-leading-zero)] [&_li]:[counter-increment:hx] [&_ol]:m-0 [&_ol]:grid [&_ol]:list-none [&_ol]:grid-cols-[repeat(auto-fit,minmax(min(100%,280px),1fr))] [&_ol]:gap-[14px] [&_ol]:p-0 [&_ol]:[counter-reset:hx] [&_p]:m-0 [&_p]:text-[17px]">
      {children}
    </div>
  );
}

/**
 * `<Compare labels="Tình huống|Không có Run|Có Run" caption="…">` with one
 * `<Row cells="…|…|…" />` per line. The last column is the Harnix side and is
 * highlighted.
 */
function Compare({ labels, caption, children }: { labels: string; caption?: string; children: ReactNode }) {
  const head = cells(labels);
  const rows = Children.toArray(children)
    .filter((child) => isValidElement<{ cells?: string }>(child) && typeof child.props.cells === "string")
    .map((child) => cells((child as React.ReactElement<{ cells: string }>).props.cells));

  return (
    <figure className="my-3 flex flex-col gap-3">
      <div className="overflow-x-auto rounded-[22px] border border-line bg-card">
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
      {caption && <figcaption className="text-[14px] text-ink-500">{caption}</figcaption>}
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
        className="mt-6 mb-0 scroll-mt-[110px] text-[clamp(28px,3.4vw,40px)] leading-[1.15] font-extrabold tracking-[-0.03em] text-ink"
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
        className="rounded-md bg-accent-soft px-2 py-px font-sans text-[0.86em] font-semibold whitespace-nowrap text-accent-strong"
        {...props}
      />
    ),
    blockquote: ({ children }: Props<"blockquote">) => (
      <blockquote className="my-2 border-l-4 border-accent-on-night py-2 pl-[clamp(20px,3vw,32px)] text-[clamp(24px,2.8vw,32px)] leading-[1.3] font-bold tracking-[-0.02em] text-balance text-ink [&_p]:m-0">
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
