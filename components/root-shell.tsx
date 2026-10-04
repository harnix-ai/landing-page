import type { ReactNode } from "react";
import { GoogleAnalytics } from "@next/third-parties/google";
import { Be_Vietnam_Pro } from "next/font/google";
import { SiteProviders } from "@/components/providers";
import { siteConfig } from "@/lib/config";
import type { Lang } from "@/lib/copy";
import "@/app/globals.css";

/**
 * One family for headings, body and figures — picked in the redesign because
 * it is drawn for Vietnamese diacritics and reads as business, not dev.
 */
const beVietnamPro = Be_Vietnam_Pro({
  subsets: ["latin", "vietnamese"],
  weight: ["400", "500", "600", "700", "800"],
  style: ["normal", "italic"],
  variable: "--font-be-vietnam-pro",
  display: "swap",
});

/**
 * The shared `<html>`/`<body>` shell for both locale root layouts
 * (`app/(vi)/layout.tsx` and `app/en/layout.tsx`). Next.js allows multiple
 * root layouts as long as each lives under its own top-level segment with no
 * shared `app/layout.tsx` above it — that's what lets `<html lang>` differ
 * per locale while the markup itself stays in one place.
 */
export function RootShell({
  lang,
  children,
}: {
  lang: Lang;
  children: ReactNode;
}) {
  return (
    <html lang={lang} className={beVietnamPro.variable}>
      <body>
        <SiteProviders lang={lang}>{children}</SiteProviders>
        {siteConfig.gaMeasurementId && <GoogleAnalytics gaId={siteConfig.gaMeasurementId} />}
      </body>
    </html>
  );
}
