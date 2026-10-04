import { readFile } from "node:fs/promises";
import path from "node:path";
import { ImageResponse } from "next/og";
import { BrandMarkSvg } from "@/lib/brand-mark";

export const alt = "Harnix — Giao việc cho AI. Nắm từng bước.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/** Tokens are inlined because satori has no CSS variables. */
const NIGHT = "#0d1014";
const MUTED = "#b8bec8";
const ACCENT = "#47c496";
const PAD = 80;

async function font(file: string) {
  return readFile(path.join(process.cwd(), "assets", "fonts", file));
}

/** The hero, as a social card: kicker, the two-line headline, the wordmark. */
export default async function OpengraphImage() {
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
            Nền tảng vận hành trợ lý AI cho doanh nghiệp
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
            <span>Giao việc cho AI.</span>
            <span style={{ color: ACCENT }}>Nắm từng bước.</span>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Be Vietnam Pro", data: bold, weight: 700, style: "normal" },
        { name: "Be Vietnam Pro", data: extraBold, weight: 800, style: "normal" },
      ],
    },
  );
}
