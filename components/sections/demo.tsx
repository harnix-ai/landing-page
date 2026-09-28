"use client";

import { useState } from "react";
import { ClockIcon, PlayIcon } from "@/components/icons";
import { useSite } from "@/components/providers";
import { Section, SectionHeading } from "@/components/ui";
import { siteConfig } from "@/lib/config";

const isReady = siteConfig.demo.status === "ready";

export function Demo() {
  const { t, lang } = useSite();
  const [playing, setPlaying] = useState(false);
  const { transcriptUrl } = siteConfig.demo;
  const videoUrl = siteConfig.demo.videoUrl[lang];
  const posterUrl = siteConfig.demo.posterUrl[lang];

  return (
    <Section id="demo">
      <SectionHeading>{t("demoHead")}</SectionHeading>
      <p className="mt-3 mb-0 max-w-[60ch] text-base text-text2">
        {t("demoSub")}
      </p>

      <div className="relative mt-6 aspect-video w-full overflow-hidden rounded-xl border border-line bg-surface2">
        {playing && videoUrl ? (
          <video
            src={videoUrl}
            poster={posterUrl}
            title={t("demoHead")}
            autoPlay
            controls
            playsInline
            preload="metadata"
            className="absolute inset-0 h-full w-full"
          />
        ) : (
          <>
            <img
              src={posterUrl}
              alt=""
              className="absolute inset-0 h-full w-full object-cover"
              style={{ opacity: isReady ? 1 : 0.45 }}
            />
            {isReady ? (
              <button
                type="button"
                aria-label={t("playLabel")}
                onClick={() => setPlaying(true)}
                className="absolute top-1/2 left-1/2 grid h-16 w-16 -translate-x-1/2 -translate-y-1/2 cursor-pointer place-items-center rounded-full border-0 bg-accent text-accent-ink"
              >
                <PlayIcon />
              </button>
            ) : (
              <div className="absolute top-1/2 left-1/2 inline-flex -translate-x-1/2 -translate-y-1/2 items-center gap-2 rounded-full border border-line2 bg-surface px-[14px] py-2 text-sm text-text">
                <ClockIcon size={15} />
                <span>{t("demoSoonPill")}</span>
              </div>
            )}
          </>
        )}
      </div>

      <div className="mt-3 flex flex-col gap-2">
        {isReady
          ? transcriptUrl && (
              <a href={transcriptUrl} className="link text-[13.5px]">
                {t("transcriptLink")}
              </a>
            )
          : (
              <a
                href="#waitlist"
                className="self-start rounded-lg border border-line2 px-[14px] py-[10px] text-center text-sm font-semibold text-text no-underline hover:bg-surface2"
              >
                {t("notifyCta")}
              </a>
            )}
      </div>
    </Section>
  );
}
