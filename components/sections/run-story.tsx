"use client";

import { useEffect, useRef, useState } from "react";
import { useSite } from "@/components/providers";

const STEPS = 6;
/** Pinning needs room: below this the story just renders finished, in flow. */
const PIN_MIN_WIDTH = 1000;
const PIN_MIN_HEIGHT = 680;

type StepState = "completed" | "measured" | "running" | "queued";

const DEV_EVENTS = [
  "user_message",
  "tool_call knowledge_search",
  "tool_result · 3 chunks",
  "llm_call · gpt-4o-mini",
  "token_usage · 1,240",
  "state_change · completed",
];
const DEV_TIMES = ["00.00s", "00.14s", "00.61s", "00.72s", "02.38s", "02.40s"];
const DEV_METRICS = [
  { label: "Tokens in", value: "1,024" },
  { label: "Tokens out", value: "216" },
  { label: "Latency", value: "2.40s" },
];

const STATE_STYLE: Record<StepState, string> = {
  completed: "bg-accent-deep text-accent-on-night",
  measured: "bg-accent-deep text-accent-on-night",
  running: "bg-warn-deep text-warn",
  queued: "bg-night-row text-on-night-muted",
};

/**
 * Pins the section for 440vh and advances one Run step per sixth of the
 * scroll. Returns the current step, and whether pinning is on at all — on
 * short or narrow screens the story renders statically at its last step.
 */
function useScrollStep(ref: React.RefObject<HTMLElement | null>) {
  const [pinned, setPinned] = useState(false);
  const [step, setStep] = useState(0);

  useEffect(() => {
    const measure = () =>
      setPinned(window.innerWidth >= PIN_MIN_WIDTH && window.innerHeight >= PIN_MIN_HEIGHT);
    const onScroll = () => {
      const el = ref.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const p = Math.min(0.999, Math.max(0, -r.top / Math.max(1, r.height - window.innerHeight)));
      setStep(Math.floor(p * STEPS));
    };
    measure();
    onScroll();
    window.addEventListener("resize", measure);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("resize", measure);
      window.removeEventListener("scroll", onScroll);
    };
  }, [ref]);

  return { pinned, step: pinned ? step : STEPS - 1 };
}

/**
 * "Mỗi câu trả lời là một Run." — the Run engine, told twice: a plain answer
 * log for business readers, and the raw trace for engineers, behind a toggle.
 * Scrolling plays the Run one step at a time.
 */
export function RunStory() {
  const { c } = useSite();
  const r = c.run;
  const sectionRef = useRef<HTMLElement>(null);
  const { pinned, step } = useScrollStep(sectionRef);
  const [view, setView] = useState<"biz" | "dev">("biz");

  const stateOf = (i: number): StepState => {
    const done = i < step || (i === STEPS - 1 && step === STEPS - 1);
    if (done) return i === 4 ? "measured" : "completed";
    return i === step ? "running" : "queued";
  };
  const dotOf = (i: number) => (i < step ? "bg-ok" : i === step ? "bg-accent" : "bg-night-line3");
  const fade = (i: number) => ({ opacity: i <= step ? 1 : 0.28 });

  return (
    <section
      id="run"
      ref={sectionRef}
      className="relative border-t border-night-rule bg-night"
      style={{ height: pinned ? "440vh" : "auto" }}
    >
      <div
        className="mx-auto grid max-w-[1280px] grid-cols-[repeat(auto-fit,minmax(min(100%,440px),1fr))] content-center items-center gap-[clamp(16px,4vw,64px)] px-5 py-[clamp(40px,5vw,48px)]"
        style={
          pinned
            ? { position: "sticky", top: 84, height: "calc(100vh - 84px)" }
            : { paddingTop: "clamp(72px,10vw,140px)", paddingBottom: "clamp(40px,6vw,64px)" }
        }
      >
        <div className="flex flex-col gap-[clamp(12px,1.8vw,22px)]">
          <span className="self-start rounded-lg border border-accent-deep-line bg-accent-deeper px-3 py-[6px] text-[13px] font-semibold text-accent-label">
            {r.badge}
          </span>
          <h2 className="m-0 text-[clamp(32px,4.6vw,60px)] leading-[1.02] font-extrabold tracking-[-0.04em] text-balance">
            {r.title} <span className="text-accent-on-night">{r.titleAccent}</span>.
          </h2>
          <p className="m-0 max-w-[520px] text-[clamp(16px,1.6vw,19px)] leading-[1.6] text-pretty text-on-night3">
            {r.sub}
          </p>

          {pinned && (
            <>
              <div className="flex items-center gap-4 pt-[6px]" aria-hidden="true">
                <span className="text-[clamp(40px,5vw,64px)] leading-[0.9] font-extrabold tracking-[-0.05em] tabular-nums">
                  {String(step + 1).padStart(2, "0")}
                </span>
                <div className="h-[3px] flex-1 overflow-hidden rounded-[3px] bg-night-line">
                  <div
                    className="h-full bg-accent transition-[width] duration-400"
                    style={{ width: `${((step + 1) / STEPS) * 100}%` }}
                  />
                </div>
                <span className="text-[15px] font-semibold text-on-night-faint">06</span>
              </div>
              <div className="relative min-h-[130px]" aria-live="polite">
                {r.steps.map((s, i) => (
                  <div
                    key={s.tag}
                    aria-hidden={i !== step}
                    className="absolute inset-0 flex flex-col gap-2 transition-opacity duration-400"
                    style={{ opacity: i === step ? 1 : 0 }}
                  >
                    <span className="self-start rounded-md bg-accent-deep px-[10px] py-[3px] text-[13px] font-semibold text-accent-label">
                      {s.tag}
                    </span>
                    <h3 className="m-0 text-[clamp(22px,2.6vw,30px)] font-bold tracking-[-0.02em]">{s.title}</h3>
                    <p className="m-0 text-[17px] leading-[1.55] text-on-night3">{s.body}</p>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        <div className="flex flex-col gap-3">
          <div
            role="tablist"
            aria-label={r.viewsLabel}
            className="flex gap-1 self-start rounded-xl border border-night-line bg-night-card p-1"
          >
            {(["biz", "dev"] as const).map((key) => {
              const active = view === key;
              return (
                <button
                  key={key}
                  type="button"
                  role="tab"
                  id={`run-tab-${key}`}
                  aria-selected={active}
                  aria-controls="run-panel"
                  onClick={() => setView(key)}
                  className={`h-[38px] cursor-pointer rounded-[9px] border-0 px-3 text-[13px] font-semibold whitespace-nowrap max-[379px]:px-2 max-[379px]:text-[12px] sm:px-4 sm:text-[14px] transition-colors ${active ? "bg-white text-night" : "bg-transparent text-on-night3 hover:text-white"}`}
                >
                  {key === "biz" ? r.tabBiz : r.tabDev}
                </button>
              );
            })}
          </div>

          <div
            id="run-panel"
            role="tabpanel"
            aria-labelledby={`run-tab-${view}`}
            className="rounded-[22px] border border-night-line bg-night-card p-[clamp(16px,2.5vw,24px)]"
          >
            {view === "biz" ? (
              <div className="flex flex-col gap-[clamp(8px,1.4vw,14px)]">
                <div className="flex items-center justify-between border-b border-night-line pb-3">
                  <span className="text-[15px] font-semibold">{r.bizHead}</span>
                  <span className="text-[13px] text-on-night-muted italic">{r.sample}</span>
                </div>
                {r.bizRows.map((row, i) => (
                  <div key={row.label} className="flex flex-col gap-[10px] transition-opacity duration-400" style={fade(i)}>
                    <div className="grid grid-cols-[18px_minmax(0,1fr)_auto] items-center gap-3">
                      <span className={`h-[10px] w-[10px] rounded-full transition-colors ${dotOf(i)}`} />
                      <span
                        className={`text-[16px] ${i === STEPS - 1 ? "font-semibold text-accent-on-night" : ""}`}
                      >
                        {row.label}
                      </span>
                      <span className="text-[14px] text-on-night-muted tabular-nums">{row.time}</span>
                    </div>
                    {i === 2 && (
                      <div className="ml-[30px] rounded-xl border border-night-line bg-night px-[14px] py-3 text-[14px] leading-[1.5] text-on-night2">
                        <span className="font-semibold text-accent-label">{r.citeSource}</span>
                        <br />
                        {r.citeQuote}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-night-line pb-3">
                  <span className="text-[15px] font-semibold">{r.devHead}</span>
                  <span className="text-[13px] text-on-night-muted">{r.devSub}</span>
                </div>
                {DEV_EVENTS.map((event, i) => {
                  const state = stateOf(i);
                  return (
                    <div
                      key={event}
                      className="grid grid-cols-[24px_minmax(0,1fr)_auto] items-center gap-[10px] border-b border-night-row py-[9px] transition-opacity duration-400"
                      style={fade(i)}
                    >
                      <span className="text-[13px] text-on-night-faint tabular-nums">{String(i + 1).padStart(2, "0")}</span>
                      <span className="flex flex-wrap items-center gap-2 text-[15px] font-medium text-white">
                        {event}
                        <span
                          className={`rounded-md px-2 py-[2px] text-[11px] font-bold tracking-[0.06em] uppercase ${STATE_STYLE[state]}`}
                        >
                          {state}
                        </span>
                      </span>
                      <span className="text-[13px] text-on-night-muted tabular-nums">{DEV_TIMES[i]}</span>
                    </div>
                  );
                })}
                <dl className="m-0 grid grid-cols-3 gap-2 pt-[14px]">
                  {DEV_METRICS.map((m) => (
                    <div key={m.label} className="rounded-[10px] bg-night px-3 py-[10px]">
                      <dt className="text-[12px] text-on-night-muted">{m.label}</dt>
                      <dd className="m-0 text-[17px] font-semibold tabular-nums">{m.value}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
