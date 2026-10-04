/**
 * The Harnix mark: a rounded square (the 14px button radius echoes it), a
 * staircase path climbing to an accent block. `filled` puts it on a night
 * tile so it reads on top of the accent-green chat launcher.
 */
export function LogoMark({ size = 34, filled = false }: { size?: number; filled?: boolean }) {
  return (
    <svg width={size} height={size} viewBox="0 0 34 34" fill="none" aria-hidden="true" className="shrink-0">
      {filled ? (
        <>
          <rect x="0" y="0" width="34" height="34" rx="9" fill="#0d1014" />
          <rect x="1.5" y="1.5" width="31" height="31" rx="8" stroke="#fff" strokeWidth="1.8" />
        </>
      ) : (
        <rect x="1" y="1" width="32" height="32" rx="9" stroke="currentColor" strokeWidth="2" />
      )}
      <path
        d="M8 25H11.5V21H15V16.5H18.5V12.5H21"
        stroke={filled ? "#fff" : "currentColor"}
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="8" cy="25" r="2.2" fill={filled ? "#fff" : "currentColor"} />
      <rect x="21" y="7.5" width="6" height="6" rx="1.6" fill="#47c496" />
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
