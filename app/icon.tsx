import { ImageResponse } from "next/og";
import { FaviconMarkSvg } from "@/lib/brand-mark";

/**
 * The browser-tab icon, in three sizes: 32 px for tabs, 192 and 512 px for the
 * web app manifest (an installable app needs both). The mark fills the canvas;
 * see `FaviconMarkSvg`.
 */
const SIZES = [32, 192, 512] as const;

export function generateImageMetadata() {
  return SIZES.map((px) => ({ id: String(px), size: { width: px, height: px }, contentType: "image/png" }));
}

export default async function Icon({ id }: { id: Promise<string | number> }) {
  const px = Number(await id);
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex" }}>
        <FaviconMarkSvg size={px} />
      </div>
    ),
    { width: px, height: px },
  );
}
