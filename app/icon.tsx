import { ImageResponse } from "next/og";
import { BrandMarkSvg } from "@/lib/brand-mark";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

/** The mark on its own, for the browser tab. */
export default function Icon() {
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
          borderRadius: 7,
        }}
      >
        <BrandMarkSvg size={28} />
      </div>
    ),
    size,
  );
}
