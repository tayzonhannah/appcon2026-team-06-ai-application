/**
 * CompassMascot — single background-only buddy for the kid section.
 * Decorative SVG compass character. Never intercepts taps.
 */
export default function CompassMascot() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed bottom-[92px] right-3 z-0 sm:bottom-6 sm:right-8"
    >
      <div className="kid-float w-20 select-none sm:w-28">
        <svg viewBox="0 0 120 120" className="h-auto w-full drop-shadow-[0_4px_0_rgba(15,23,42,1)]">
          {/* little arms */}
          <ellipse cx="18" cy="78" rx="9" ry="6" fill="#F59E0B" stroke="#0F172A" strokeWidth="3" transform="rotate(-20 18 78)" />
          <ellipse cx="102" cy="78" rx="9" ry="6" fill="#F59E0B" stroke="#0F172A" strokeWidth="3" transform="rotate(20 102 78)" />
          {/* body */}
          <circle cx="60" cy="62" r="44" fill="#2563EB" stroke="#0F172A" strokeWidth="4" />
          {/* face */}
          <circle cx="60" cy="62" r="30" fill="#FFFFFF" stroke="#0F172A" strokeWidth="3" />
          {/* compass needle */}
          <g transform="rotate(24 60 62)">
            <polygon points="60,40 66,62 60,84 54,62" fill="#EC4899" stroke="#0F172A" strokeWidth="2" strokeLinejoin="round" />
            <circle cx="60" cy="62" r="5" fill="#F59E0B" stroke="#0F172A" strokeWidth="2" />
          </g>
          {/* eyes */}
          <circle cx="50" cy="54" r="4.5" fill="#0F172A" />
          <circle cx="70" cy="54" r="4.5" fill="#0F172A" />
          <circle cx="51.5" cy="52.5" r="1.5" fill="#FFFFFF" />
          <circle cx="71.5" cy="52.5" r="1.5" fill="#FFFFFF" />
          {/* smile */}
          <path d="M51 68 Q60 75 69 68" fill="none" stroke="#0F172A" strokeWidth="3" strokeLinecap="round" />
          {/* cheeks */}
          <circle cx="43" cy="64" r="4" fill="#EC4899" opacity="0.7" />
          <circle cx="77" cy="64" r="4" fill="#EC4899" opacity="0.7" />
          {/* explorer hat */}
          <path d="M34 34 Q60 10 86 34 L82 40 Q60 26 38 40 Z" fill="#F59E0B" stroke="#0F172A" strokeWidth="3" strokeLinejoin="round" />
          <rect x="56" y="16" width="8" height="12" rx="3" fill="#EC4899" stroke="#0F172A" strokeWidth="2" />
        </svg>
      </div>
    </div>
  );
}
