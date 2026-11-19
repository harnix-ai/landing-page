/**
 * The logo mark as a plain SVG for `next/og` image routes (favicon, apple
 * icon, OG card), which cannot use Tailwind or CSS variables. Same geometry
 * as `LogoMark` in `components/logo.tsx`.
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
