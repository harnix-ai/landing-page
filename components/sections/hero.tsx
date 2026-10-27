"use client";

import { useState } from "react";
import { useSite } from "@/components/providers";
import { btn } from "@/components/ui";
import { siteConfig } from "@/lib/config";

const isReady = siteConfig.demo.status === "ready";

export function Hero() {
  const { c, lang } = useSite();
  const h = c.hero;

  return (
    <section className="relative overflow-hidden">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-[-160px] left-1/2 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-accent opacity-20 blur-[100px] md:top-[-30%] md:h-[900px] md:w-[1100px] md:opacity-[0.18] md:blur-[140px]"
      />
      <div className="relative mx-auto flex max-w-[1280px] flex-col items-start gap-[22px] px-5 pt-11 pb-12 text-left md:items-center md:gap-7 md:pt-[clamp(64px,10vw,140px)] md:pb-[clamp(40px,6vw,72px)] md:text-center">
        <div className="flex max-w-full animate-[hx-rise_0.7s_both] justify-start md:justify-center">
          <p className="m-0 flex items-center justify-center gap-3 text-[15px] leading-[1.5] md:text-[clamp(15px,1.8vw,19px)]">
            <span aria-hidden="true" className="hidden h-px w-5 shrink-0 bg-night-line3 sm:w-9 md:block" />
            <span className="text-balance text-on-night3">
              {h.kicker}{" "}
              <span className="border-b-2 border-accent-on-night pb-0.5 font-semibold text-white md:pb-[3px]">{h.kickerEm}</span>
            </span>
            <span aria-hidden="true" className="hidden h-px w-5 shrink-0 bg-night-line3 sm:w-9 md:block" />
          </p>
        </div>

        <h1 className="relative m-0 max-w-[1100px] animate-[hx-rise_0.9s_0.1s_cubic-bezier(.2,.7,.2,1)_both] text-[50px] leading-[0.98] font-extrabold tracking-[-0.045em] text-balance md:text-[clamp(48px,9.5vw,128px)]">
          {h.title}
          <br />
          <span className="text-accent-on-night">{h.titleAccent}</span>
        </h1>

        <p className="relative m-0 max-w-[640px] animate-[hx-rise_0.9s_0.2s_both] text-[17px] leading-[1.6] text-pretty text-on-night3 md:text-[clamp(18px,2vw,21px)]">
          {h.sub}
        </p>

        <div className="relative flex w-full animate-[hx-rise_0.9s_0.3s_both] flex-col gap-2.5 md:w-auto md:flex-row md:flex-wrap md:justify-center md:gap-3">
          <a href="#demo" className={`${btn.primary} h-14 px-7 text-[17px] md:h-[58px]`}>
            {h.ctaDemo}
          </a>
          <a href="#video" className={`${btn.ghost} h-14 px-[26px] text-[17px] md:h-[58px]`}>
            {h.ctaVideo}
          </a>
        </div>
      </div>

      <div id="video" className="relative mx-auto mt-2.5 max-w-[1180px] px-5 pb-12 md:mt-0 md:pb-[clamp(64px,9vw,120px)]">
        <HeroVideo
          videoUrl={siteConfig.demo.videoUrl[lang]}
          posterUrl={siteConfig.demo.posterUrl[lang]}
        />
        {isReady && siteConfig.demo.transcriptUrl && (
          <a
            href={siteConfig.demo.transcriptUrl}
            className="mt-3 inline-block text-[15px] font-semibold text-accent-on-night hover:underline"
          >
            {h.transcript}
          </a>
        )}
      </div>
    </section>
  );
}

/** Poster with a caption bar until clicked, then the film itself, inline. */
function HeroVideo({ videoUrl, posterUrl }: { videoUrl: string; posterUrl: string }) {
  const { c } = useSite();
  const h = c.hero;
  const [playing, setPlaying] = useState(false);

  return (
    <div className="reveal-grow relative overflow-hidden rounded-[22px] border border-night-ghost bg-night-card md:aspect-video md:rounded-[28px]">
      {playing ? (
        <video
          src={videoUrl}
          poster={posterUrl}
          title={h.videoTitle}
          autoPlay
          controls
          playsInline
          preload="metadata"
          className="aspect-video w-full bg-black md:absolute md:inset-0 md:h-full md:aspect-auto"
        />
      ) : (
        <>
          {/* eslint-disable-next-line @next/next/no-img-element -- remote poster, no loader configured */}
          <img
            src={posterUrl}
            alt={h.videoAlt}
            className="block aspect-video w-full object-cover md:h-full md:aspect-auto"
            style={{ opacity: isReady ? 1 : 0.45 }}
          />
          <div className="flex items-center gap-3.5 px-[18px] py-4 text-left md:absolute md:inset-x-0 md:bottom-0 md:flex-wrap md:justify-between md:gap-4 md:bg-[linear-gradient(transparent,rgba(13,16,20,0.85))] md:px-[clamp(16px,3vw,28px)] md:py-[clamp(16px,3vw,24px)]">
            <div className="flex min-w-0 flex-1 flex-col gap-1 md:gap-1">
              <strong className="text-[16px] font-semibold md:text-[clamp(16px,2vw,20px)]">{h.videoTitle}</strong>
              <span className="text-[14px] leading-[1.45] text-on-night3 md:hidden">{h.videoSub}</span>
              <span className="hidden text-[15px] text-on-night2 md:block">{h.videoSub}</span>
            </div>
            {isReady ? (
              <button
                type="button"
                onClick={() => setPlaying(true)}
                aria-label={h.play}
                className="flex h-12 w-12 shrink-0 cursor-pointer items-center justify-center rounded-full border-0 bg-white transition-transform hover:scale-105 md:h-16 md:w-16"
              >
                <span
                  aria-hidden="true"
                  className="ml-1 h-0 w-0 border-y-[9px] border-l-[14px] border-y-transparent border-l-night md:ml-[5px] md:border-y-[11px] md:border-l-[18px]"
                />
              </button>
            ) : (
              <span className="rounded-full border border-night-line2 bg-night-card px-[14px] py-2 text-[14px] font-semibold">
                {h.soon}
              </span>
            )}
          </div>
        </>
      )}
    </div>
  );
}
