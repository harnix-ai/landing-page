"use client";

import { useSite } from "@/components/providers";

export function SkipLink() {
  const { c } = useSite();

  return (
    <a
      href="#main"
      className="sr-only rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-white focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-100"
    >
      {c.meta.skip}
    </a>
  );
}
