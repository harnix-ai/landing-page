"use client";

import type { ReactNode } from "react";
import { useSite } from "@/components/providers";
import { btn, Container, sectionPad } from "@/components/ui";
import { siteConfig } from "@/lib/config";
import { localizeHref } from "@/lib/i18n";

/** The post the developer group and the Run callout both point at. */
export const RUN_POST_PATH = "/blog/moi-cau-tra-loi-la-mot-run";

/**
 * "Quản AI như quản một nhân viên giỏi" — one paper section, two clearly
 * labelled groups: what leadership gets (a bento of outcomes) and what the
 * tech team gets (integration facts on a night panel).
 */
export function Audiences() {
  const { c, lang } = useSite();
  const a = c.audiences;
  const b = a.bento;
  const docsHref = siteConfig.docsUrl[lang];

  return (
    <section className="bg-paper text-ink">
      <Container className={`flex flex-col gap-12 ${sectionPad}`}>
        <h2 className="m-0 max-w-[960px] text-[clamp(34px,5.5vw,68px)] leading-[1.02] font-extrabold tracking-[-0.04em] text-balance">
          {a.title} <span className="text-ink-300">{a.titleMuted}</span>
        </h2>

        <div className="flex flex-col gap-4">
          <GroupBar
            index="01"
            dark={false}
            forLabel={a.forLabel}
            name={a.biz.name}
            youGet={a.youGet}
            gets={a.biz.gets}
            roles={a.biz.roles}
          />
          <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,280px),1fr))] gap-4">
            <BentoCard wide tone="night" title={b.report.title} body={b.report.body} />
            <BentoCard title={b.stop.title} body={b.stop.body} />
            <BentoCard
              tone="accent"
              title={b.cost.title}
              body={b.cost.body}
              lead={
                <span className="text-[44px] font-extrabold tracking-[-0.04em] text-accent">{b.cost.figure}</span>
              }
            />
            <BentoCard title={b.vendor.title} body={b.vendor.body} />
            <BentoCard title={b.data.title} body={b.data.body} />
            <BentoCard wide title={b.durable.title} body={b.durable.body} />
          </div>
        </div>

        <div className="flex flex-col gap-4 border-t border-line2 pt-[clamp(24px,4vw,40px)]">
          <GroupBar
            index="02"
            dark
            forLabel={a.forLabel}
            name={a.dev.name}
            youGet={a.youGet}
            gets={a.dev.gets}
            roles={a.dev.roles}
          />
          <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,260px),1fr))] gap-3 rounded-3xl bg-night p-3">
            {a.devCards.map((card) => (
              <div
                key={card.title}
                className="flex flex-col gap-[10px] rounded-[18px] border border-night-line bg-night-card p-6"
              >
                <strong className="text-[19px] font-bold text-white">{card.title}</strong>
                <span className="text-[15px] leading-[1.6] text-on-night3">{card.body}</span>
              </div>
            ))}
          </div>
          <div className="flex flex-wrap gap-[10px]">
            {docsHref && (
              <a href={docsHref} className={`${btn.dark} h-[52px] px-[22px] text-[16px]`}>
                {a.docsCta}
              </a>
            )}
            <a href={localizeHref(lang, RUN_POST_PATH)} className={`${btn.outline} h-[52px] px-[22px] text-[16px]`}>
              {a.runPostCta}
            </a>
          </div>
        </div>
      </Container>
    </section>
  );
}

function GroupBar({
  index,
  dark,
  forLabel,
  name,
  youGet,
  gets,
  roles,
}: {
  index: string;
  dark: boolean;
  forLabel: string;
  name: string;
  youGet: string;
  gets: string;
  roles: string[];
}) {
  return (
    <div
      className={`grid grid-cols-[repeat(auto-fit,minmax(min(100%,380px),1fr))] items-end gap-x-10 gap-y-4 rounded-[20px] border px-6 py-[22px] ${dark ? "border-night bg-night" : "border-line bg-card"}`}
    >
      <div className="flex items-center gap-4">
        <span
          aria-hidden="true"
          className={`flex h-[52px] w-[52px] shrink-0 items-center justify-center rounded-[14px] text-[20px] font-extrabold ${dark ? "bg-accent text-white" : "bg-accent-soft text-accent"}`}
        >
          {index}
        </span>
        <div className="flex flex-col gap-1">
          <span className={`text-[12px] font-bold tracking-[0.1em] uppercase ${dark ? "text-accent-label" : "text-accent"}`}>
            {forLabel}
          </span>
          <h3 className={`m-0 text-[clamp(20px,2.4vw,26px)] font-bold tracking-[-0.02em] ${dark ? "text-white" : "text-ink"}`}>
            {name}
          </h3>
        </div>
      </div>
      <div className="flex flex-col gap-[10px]">
        <p className={`m-0 text-[15px] leading-[1.5] ${dark ? "text-on-night3" : "text-ink-700"}`}>
          <strong className={dark ? "text-white" : "text-ink"}>{youGet}</strong> {gets}
        </p>
        <ul className="m-0 flex list-none flex-wrap gap-[6px] p-0">
          {roles.map((role) => (
            <li
              key={role}
              className={`rounded-lg border px-3 py-[6px] text-[14px] font-semibold whitespace-nowrap ${dark ? "border-night-line2 bg-night-card text-on-night2" : "border-line2 bg-card text-ink-700"}`}
            >
              {role}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function BentoCard({
  title,
  body,
  lead,
  wide = false,
  tone = "paper",
}: {
  title: string;
  body: string;
  lead?: ReactNode;
  wide?: boolean;
  tone?: "paper" | "night" | "accent";
}) {
  const surface =
    tone === "night"
      ? "bg-night text-white"
      : tone === "accent"
        ? "bg-accent-soft"
        : "border border-line bg-card";

  return (
    <div
      className={`flex min-w-0 flex-col justify-end gap-[10px] rounded-3xl p-8 ${surface} ${wide ? "min-h-[230px] bento:col-span-2" : "min-h-[240px]"}`}
    >
      {lead}
      <h4 className={`m-0 font-bold tracking-[-0.02em] ${wide ? "text-[30px]" : "text-[24px]"}`}>{title}</h4>
      <p
        className={`m-0 max-w-[460px] leading-[1.6] ${wide ? "text-[17px]" : "text-[16px]"} ${tone === "night" ? "text-on-night3" : "text-ink-700"}`}
      >
        {body}
      </p>
    </div>
  );
}
