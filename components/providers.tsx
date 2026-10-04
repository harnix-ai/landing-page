"use client";

import { createContext, useContext, useMemo, type ReactNode } from "react";
import { getCopy, type Copy, type Lang } from "@/lib/copy";

type SiteContextValue = {
  lang: Lang;
  /** The whole dictionary for `lang`: `const { c } = useSite(); c.hero.title`. */
  c: Copy;
};

const SiteContext = createContext<SiteContextValue | null>(null);

/**
 * `lang` comes from the root layout that rendered this tree (one per locale
 * route, see `components/root-shell.tsx`) and never changes client-side —
 * switching language is a real navigation to the other locale's URL, so the
 * server always renders the right language on first paint.
 */
export function SiteProviders({
  lang,
  children,
}: {
  lang: Lang;
  children: ReactNode;
}) {
  const value = useMemo<SiteContextValue>(() => ({ lang, c: getCopy(lang) }), [lang]);
  return <SiteContext.Provider value={value}>{children}</SiteContext.Provider>;
}

export function useSite(): SiteContextValue {
  const ctx = useContext(SiteContext);
  if (!ctx) throw new Error("useSite must be used inside <SiteProviders>");
  return ctx;
}
