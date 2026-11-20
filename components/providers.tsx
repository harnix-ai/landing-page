"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { getCopy, type Copy, type Lang } from "@/lib/copy";

export type Overlay = "menu" | "chat" | null;

type SiteContextValue = {
  lang: Lang;
  /** The whole dictionary for `lang`: `const { c } = useSite(); c.hero.title`. */
  c: Copy;
};

const OverlayContext = createContext<{ overlay: Overlay; setOverlay: (overlay: Overlay) => void } | null>(null);

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
  const [overlay, setOverlayState] = useState<Overlay>(null);
  const setOverlay = useCallback((next: Overlay) => setOverlayState(next), []);

  useEffect(() => {
    // Only the phone menu and chat sheet cover the page; the desktop chat panel leaves it scrollable.
    if (!overlay || !window.matchMedia("(max-width: 767px)").matches) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [overlay]);

  const value = useMemo<SiteContextValue>(
    () => ({ lang, c: getCopy(lang) }),
    [lang],
  );
  const overlayValue = useMemo(() => ({ overlay, setOverlay }), [overlay, setOverlay]);
  return (
    <SiteContext.Provider value={value}>
      <OverlayContext.Provider value={overlayValue}>{children}</OverlayContext.Provider>
    </SiteContext.Provider>
  );
}

export function useSite(): SiteContextValue {
  const ctx = useContext(SiteContext);
  if (!ctx) throw new Error("useSite must be used inside <SiteProviders>");
  return ctx;
}

/** Overlay updates only notify the menu and floating controls, not the page copy. */
export function useOverlay() {
  const ctx = useContext(OverlayContext);
  if (!ctx) throw new Error("useOverlay must be used inside <SiteProviders>");
  return ctx;
}
