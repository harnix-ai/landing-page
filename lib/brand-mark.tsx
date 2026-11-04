/**
 * The logo mark as a plain SVG for `next/og` image routes (favicon, apple
 * icon, OG card), which cannot use Tailwind or CSS variables. Same geometry
 * as `LogoMark` in `components/logo.tsx`, and as the console, the sign-in pages,
 * the docs and the emails: the three-step staircase of
 * `harnix/frontend/design/contract.json#patterns.brand` (viewBox 28).
 */
export function BrandMarkSvg({ size, stroke = "#ffffff" }: { size: number; stroke?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 28 28" fill="none">
      <rect x="1.25" y="1.25" width="25.5" height="25.5" rx="7.5" stroke={stroke} strokeWidth="1.5" />
      <path
        d="M7 19.5 L11.5 19.5 L11.5 13 L16.5 13 L16.5 8.5 L20 8.5"
        stroke={stroke}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="7" cy="19.5" r="1.9" fill={stroke} />
      <rect x="17.6" y="6.1" width="4.8" height="4.8" rx="1.4" fill="#47c496" />
    </svg>
  );
}

/**
 * The mark as a browser-tab icon: the night tile IS the frame (no second frame
 * inside it) and the strokes are heavier, so the steps still read at 16 px.
 * Fills its whole canvas; `size` is the canvas edge in px.
 */
export function FaviconMarkSvg({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 28 28" fill="none">
      <rect x="0.9" y="0.9" width="26.2" height="26.2" rx="7.6" fill="#0d1014" stroke="#ffffff" strokeWidth="1.8" />
      <path
        d="M7 19.5 L11.5 19.5 L11.5 13 L16.5 13 L16.5 8.5 L20 8.5"
        stroke="#ffffff"
        strokeWidth="2.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="7" cy="19.5" r="2.4" fill="#ffffff" />
      <rect x="17.2" y="5.7" width="5.6" height="5.6" rx="1.6" fill="#47c496" />
    </svg>
  );
}
