import { ImageResponse } from "next/og";
import { BrandMarkSvg } from "@/lib/brand-mark";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

/**
 * The same mark as `icon.tsx`, at the size iOS home screens want. It doubles as
 * the Organization logo in the structured data, which needs at least 112px.
 */
export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#0d1014",
        }}
      >
        <BrandMarkSvg size={132} />
      </div>
    ),
    size,
  );
}
