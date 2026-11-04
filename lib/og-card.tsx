import { readFile } from "node:fs/promises";
import path from "node:path";
import { ImageResponse } from "next/og";
import type { Lang } from "@/lib/copy";
import { BrandMarkSvg } from "@/lib/brand-mark";

export const OG_SIZE = { width: 1200, height: 630 } as const;

const CARD = {
  vi: {
    alt: "Harnix — Giao việc cho AI. Nắm từng bước.",
    kicker: "Nền tảng vận hành trợ lý AI cho doanh nghiệp",
    line1: "Giao việc cho AI.",
    line2: "Nắm từng bước.",
  },
  en: {
    alt: "Harnix — Hand work to AI. See every step.",
    kicker: "The AI assistant operations platform for businesses",
    line1: "Hand work to AI.",
    line2: "See every step.",
  },
} as const;

export function ogAlt(lang: "vi" | "en"): string {
  return CARD[lang].alt;
}

/** Tokens are inlined because satori has no CSS variables. */
const NIGHT = "#0d1014";
const MUTED = "#b8bec8";
const ACCENT = "#47c496";
const PAD = 80;

async function font(file: string) {
  return readFile(path.join(process.cwd(), "assets", "fonts", file));
}

/** The hero, as a social card: kicker, the two-line headline, the wordmark — in the page's language. */
export async function renderOgCard(lang: Lang) {
  const t = CARD[lang];
  const [bold, extraBold] = await Promise.all([
    font("BeVietnamPro-Bold.ttf"),
    font("BeVietnamPro-ExtraBold.ttf"),
  ]);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: NIGHT,
          color: "#fff",
          padding: PAD,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          fontFamily: "Be Vietnam Pro",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            left: 300,
            top: -420,
            width: 900,
            height: 700,
            borderRadius: 9999,
            background: "#0f8f6a",
            opacity: 0.35,
            filter: "blur(120px)",
          }}
        />
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <BrandMarkSvg size={60} />
          <span style={{ fontSize: 44, fontWeight: 700, letterSpacing: "-0.02em" }}>harnix</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <span style={{ fontSize: 30, fontWeight: 700, color: MUTED }}>
            {t.kicker}
          </span>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              fontSize: 104,
              fontWeight: 800,
              lineHeight: 0.98,
              letterSpacing: "-0.045em",
            }}
          >
            <span>{t.line1}</span>
            <span style={{ color: ACCENT }}>{t.line2}</span>
          </div>
        </div>
      </div>
    ),
    {
      ...OG_SIZE,
      fonts: [
        { name: "Be Vietnam Pro", data: bold, weight: 700, style: "normal" },
        { name: "Be Vietnam Pro", data: extraBold, weight: 800, style: "normal" },
      ],
    },
  );
}
