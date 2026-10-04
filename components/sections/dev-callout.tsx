"use client";

import { RUN_POST_PATH } from "@/components/sections/audiences";
import { useSite } from "@/components/providers";
import { btn } from "@/components/ui";
import { siteConfig } from "@/lib/config";
import { localizeHref } from "@/lib/i18n";

/** "Đội kỹ thuật của bạn sẽ muốn đọc phần này" — the hand-off under the Run story. */
export function DevCallout() {
  const { c, lang } = useSite();
  const d = c.devCallout;
  const docsHref = siteConfig.docsUrl[lang];

  return (
    <section className="bg-night">
      <div className="mx-auto max-w-[1280px] px-5 pb-[clamp(64px,8vw,104px)]">
        <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,340px),1fr))] items-center gap-6 rounded-3xl border border-night-line bg-night-panel p-[clamp(24px,3.5vw,36px)]">
          <div className="flex flex-col gap-2">
            <strong className="text-[clamp(20px,2.4vw,26px)] font-bold tracking-[-0.02em]">{d.title}</strong>
            <span className="text-[16px] leading-[1.6] text-on-night3">{d.body}</span>
          </div>
          <div className="flex flex-wrap justify-start gap-[10px] min-[760px]:justify-end">
            <a href={localizeHref(lang, RUN_POST_PATH)} className={`${btn.ghost} h-[50px] px-5 text-[15px]`}>
              {d.post}
            </a>
            {docsHref && (
              <a href={docsHref} className={`${btn.ghost} h-[50px] px-5 text-[15px]`}>
                {d.docs}
              </a>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
