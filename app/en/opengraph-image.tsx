import { ogAlt, OG_SIZE, renderOgCard } from "@/lib/og-card";

export const alt = ogAlt("en");
export const size = OG_SIZE;
export const contentType = "image/png";

export default function OpengraphImage() {
  return renderOgCard("en");
}
