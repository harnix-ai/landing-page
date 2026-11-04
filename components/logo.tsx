/**
 * The Harnix mark: a rounded square (the 14px button radius echoes it), a
 * three-step staircase climbing to an accent block. `filled` puts it on a night
 * tile so it reads on top of the accent-green chat launcher.
 */
export function LogoMark({ size = 34, filled = false }: { size?: number; filled?: boolean }) {
  // Same geometry as the console's mark (harnix/frontend/design/contract.json
  // #patterns.brand): a three-step staircase, viewBox 28.
  const ink = filled ? "#fff" : "currentColor";
  return (
    <svg width={size} height={size} viewBox="0 0 28 28" fill="none" aria-hidden="true" className="shrink-0">
      <rect
        x="1.25"
        y="1.25"
        width="25.5"
        height="25.5"
        rx="7.5"
        stroke={ink}
        strokeWidth="1.5"
        fill={filled ? "#0d1014" : "none"}
      />
      <path
        d="M7 19.5 L11.5 19.5 L11.5 13 L16.5 13 L16.5 8.5 L20 8.5"
        stroke={ink}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="7" cy="19.5" r="1.9" fill={ink} />
      <rect x="17.6" y="6.1" width="4.8" height="4.8" rx="1.4" fill="#47c496" />
    </svg>
  );
}

/**
 * "harnıx" — the i is a dotless ı (U+0131) so the accent square can take the
 * tittle slot. Sized in `em`, so it follows whatever font size it is set in.
 */
export function Wordmark({ className = "", radius = "0.04em" }: { className?: string; radius?: string }) {
  return (
    <>
      <span aria-hidden="true" className={className}>
        harn
        <span className="relative">
          ı
          <span
            className="absolute top-[0.2em] left-1/2 h-[0.2em] w-[0.2em] -translate-x-1/2 bg-accent-on-night"
            style={{ borderRadius: radius }}
          />
        </span>
        x
      </span>
      <span className="sr-only">Harnix</span>
    </>
  );
}
