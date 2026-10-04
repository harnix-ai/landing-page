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
        className="pointer-events-none absolute top-[-30%] left-1/2 h-[900px] w-[1100px] -translate-x-1/2 rounded-full bg-accent opacity-[0.18] blur-[140px]"
      />
      <div className="relative mx-auto flex max-w-[1280px] flex-col items-center gap-7 px-5 pt-[clamp(64px,10vw,140px)] pb-[clamp(40px,6vw,72px)] text-center">
        <div className="flex max-w-full animate-[hx-rise_0.7s_both] justify-center">
          <p className="m-0 flex items-center justify-center gap-3 text-[clamp(15px,1.8vw,19px)]">
            <span aria-hidden="true" className="h-px w-5 shrink-0 bg-night-line3 sm:w-9" />
            <span className="text-balance text-on-night3">
              {h.kicker}{" "}
              <span className="border-b-2 border-accent-on-night pb-[3px] font-semibold text-white">{h.kickerEm}</span>
            </span>
            <span aria-hidden="true" className="h-px w-5 shrink-0 bg-night-line3 sm:w-9" />
          </p>
        </div>

        <h1 className="m-0 max-w-[1100px] animate-[hx-rise_0.9s_0.1s_cubic-bezier(.2,.7,.2,1)_both] text-[clamp(48px,9.5vw,128px)] leading-[0.98] font-extrabold tracking-[-0.045em] text-balance">
          {h.title}
          <br />
          <span className="text-accent-on-night">{h.titleAccent}</span>
        </h1>

        <p className="m-0 max-w-[640px] animate-[hx-rise_0.9s_0.2s_both] text-[clamp(18px,2vw,21px)] leading-[1.6] text-pretty text-on-night3">
          {h.sub}
        </p>

        <div className="flex animate-[hx-rise_0.9s_0.3s_both] flex-wrap justify-center gap-3">
          <a href="#demo" className={`${btn.primary} h-[58px] px-7 text-[17px]`}>
            {h.ctaDemo}
          </a>
          <a href="#video" className={`${btn.ghost} h-[58px] px-[26px] text-[17px]`}>
            {h.ctaVideo}
          </a>
        </div>
      </div>

      <div id="video" className="relative mx-auto max-w-[1180px] px-5 pb-[clamp(64px,9vw,120px)]">
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
    <div className="reveal-grow relative aspect-video overflow-hidden rounded-[28px] border border-night-ghost bg-night-card">
      {playing ? (
        <video
          src={videoUrl}
          poster={posterUrl}
          title={h.videoTitle}
          autoPlay
          controls
          playsInline
          preload="metadata"
          className="absolute inset-0 h-full w-full bg-black"
        />
      ) : (
        <>
          {/* eslint-disable-next-line @next/next/no-img-element -- remote poster, no loader configured */}
          <img
            src={posterUrl}
            alt={h.videoAlt}
            className="block h-full w-full object-cover"
            style={{ opacity: isReady ? 1 : 0.45 }}
          />
          <div className="absolute inset-x-0 bottom-0 flex flex-wrap items-center justify-between gap-4 bg-[linear-gradient(transparent,rgba(13,16,20,0.85))] px-[clamp(16px,3vw,28px)] py-[clamp(16px,3vw,24px)] text-left">
            <div className="flex flex-col gap-1">
              <strong className="text-[clamp(16px,2vw,20px)] font-semibold">{h.videoTitle}</strong>
              <span className="hidden text-[15px] text-on-night2 sm:block">{h.videoSub}</span>
            </div>
            {isReady ? (
              <button
                type="button"
                onClick={() => setPlaying(true)}
                aria-label={h.play}
                className="flex h-16 w-16 shrink-0 cursor-pointer items-center justify-center rounded-full border-0 bg-white transition-transform hover:scale-105"
              >
                <span
                  aria-hidden="true"
                  className="ml-[5px] h-0 w-0 border-y-[11px] border-l-[18px] border-y-transparent border-l-night"
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
