"use client";

import Script from "next/script";

/** Queue page traffic immediately; fetch and execute GA after load at browser idle. */
export function DeferredAnalytics({ gaId }: { gaId: string }) {
  return (
    <>
      <Script id="harnix-ga-init" strategy="afterInteractive">{`
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', ${JSON.stringify(gaId).replace(/</g, "\\u003c")});
      `}</Script>
      <Script
        id="harnix-ga"
        src={`https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(gaId)}`}
        strategy="lazyOnload"
      />
    </>
  );
}

/** Preserve lead events while the vendor script is still queued. */
export function sendGAEvent(..._args: unknown[]) {
  const target = window as unknown as { dataLayer?: unknown[] };
  (target.dataLayer ??= []).push(arguments);
}
