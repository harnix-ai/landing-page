/**
 * The logo mark as a plain SVG for `next/og` image routes (favicon, apple
 * icon, OG card), which cannot use Tailwind or CSS variables. Same geometry
 * as `LogoMark` in `components/logo.tsx`.
 */
export function BrandMarkSvg({ size, stroke = "#ffffff" }: { size: number; stroke?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 34 34" fill="none">
      <rect x="1" y="1" width="32" height="32" rx="9" stroke={stroke} strokeWidth="2" />
      <path
        d="M8 25H11.5V21H15V16.5H18.5V12.5H21"
        stroke={stroke}
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="8" cy="25" r="2.2" fill={stroke} />
      <rect x="21" y="7.5" width="6" height="6" rx="1.6" fill="#47c496" />
    </svg>
  );
}
