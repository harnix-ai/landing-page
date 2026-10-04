import { Fragment, type ReactNode } from "react";

/**
 * Buttons, per the redesign: 14px radius (the logo's square), no icons.
 * Primary is accent with a bright border and a soft halo that grows on hover;
 * the outline variants turn their border accent on hover.
 */
export const btn = {
  primary:
    "inline-flex items-center justify-center rounded-[14px] border border-accent-on-night bg-accent font-semibold whitespace-nowrap text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.28),0_0_0_3px_rgba(71,196,150,0.14),0_10px_28px_-10px_rgba(15,143,106,0.8)] transition-[box-shadow,transform,background-color] duration-200 hover:-translate-y-px hover:bg-accent-hover hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.32),0_0_0_5px_rgba(71,196,150,0.22),0_14px_34px_-10px_rgba(15,143,106,0.95)] disabled:translate-y-0 disabled:cursor-default disabled:opacity-70",
  /** Outline on night sections. */
  ghost:
    "inline-flex items-center justify-center rounded-[14px] border border-night-line3 bg-white/[0.03] font-semibold text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] transition-[border-color,background-color] duration-200 hover:border-accent-on-night hover:bg-accent-on-night/[0.08]",
  /** Outline on paper sections. */
  outline:
    "inline-flex items-center justify-center rounded-[14px] border border-line3 bg-card font-semibold text-ink shadow-[0_1px_0_rgba(17,20,24,0.04)] transition-colors duration-200 hover:border-accent hover:text-accent",
  /** Solid night on paper sections. */
  dark: "inline-flex items-center justify-center rounded-[14px] border border-night bg-night font-semibold text-white transition-colors duration-200 hover:bg-night-hover",
} as const;

/** The shared content column: 1280px with 20px gutters. */
export function Container({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`mx-auto max-w-[1280px] px-5 ${className}`}>{children}</div>;
}

/** Vertical rhythm of a full-bleed section. */
export const sectionPad = "py-[clamp(72px,10vw,140px)]";

/**
 * Renders `**emphasis**` in copy strings through `em` — a highlighter mark, a
 * bold span, an accent span, whatever the context calls for.
 */
export function Rich({
  text,
  em = (part) => <strong>{part}</strong>,
}: {
  text: string;
  em?: (part: string) => ReactNode;
}) {
  return (
    <>
      {text.split("**").map((part, i) => (
        <Fragment key={i}>{i % 2 === 1 ? em(part) : part}</Fragment>
      ))}
    </>
  );
}
