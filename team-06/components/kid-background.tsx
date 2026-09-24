/**
 * KidBackground — playful, background-only layer for the kid section.
 * Pure CSS + inline SVG, no images. Never intercepts taps.
 */
export default function KidBackground() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden bg-gradient-to-b from-[#EFF6FF] via-[#E4F1FF] to-[#FFF6E3]"
    >
      {/* soft sun glow */}
      <div className="absolute -left-20 -top-20 h-64 w-64 rounded-full bg-[#FDE68A]/50 blur-2xl" />
      <div className="absolute -right-16 top-24 h-56 w-56 rounded-full bg-[#FBCFE8]/40 blur-2xl" />

      {/* twinkling stars */}
      <span className="kid-twinkle absolute left-[12%] top-[88px] text-lg text-[#F59E0B]">★</span>
      <span className="kid-twinkle absolute left-[42%] top-[120px] text-sm text-[#EC4899] [animation-delay:1.2s]">★</span>
      <span className="kid-twinkle absolute right-[18%] top-[92px] text-base text-[#2563EB]/60 [animation-delay:2s]">★</span>
      <span className="kid-twinkle absolute left-[68%] top-[180px] hidden text-sm text-[#F59E0B]/70 [animation-delay:0.6s] sm:block">★</span>

      {/* drifting clouds */}
      <div className="kid-cloud absolute left-[-40px] top-[140px] flex w-36 opacity-90">
        <Cloud />
      </div>
      <div className="kid-cloud absolute right-[-30px] top-[210px] flex w-28 opacity-80 [animation-delay:3s] [animation-duration:11s]">
        <Cloud />
      </div>
      <div className="kid-cloud absolute left-[30%] top-[64px] hidden w-24 opacity-70 [animation-delay:1.5s] sm:flex">
        <Cloud />
      </div>

      {/* rolling hills at the very bottom */}
      <svg
        className="absolute inset-x-0 bottom-0 h-28 w-full sm:h-36"
        viewBox="0 0 1440 160"
        preserveAspectRatio="none"
      >
        <path
          d="M0,96 C240,40 420,40 720,88 C1020,136 1200,96 1440,64 L1440,160 L0,160 Z"
          fill="#D0E6FD"
          opacity="0.9"
        />
        <path
          d="M0,120 C260,80 520,80 780,112 C1040,144 1240,120 1440,104 L1440,160 L0,160 Z"
          fill="#BBF7D0"
          opacity="0.8"
        />
        {/* tiny flowers dotted on hills */}
        <g fontSize="14">
          <text x="120" y="140">🌼</text>
          <text x="420" y="148">🌷</text>
          <text x="980" y="142">🌼</text>
          <text x="1280" y="146">🌷</text>
        </g>
      </svg>
    </div>
  );
}

function Cloud() {
  return (
    <span className="relative block h-10 w-full">
      <span className="absolute bottom-0 left-0 h-8 w-full rounded-full bg-white shadow-sm" />
      <span className="absolute -top-2 left-5 h-8 w-10 rounded-full bg-white" />
      <span className="absolute -top-4 left-12 h-10 w-12 rounded-full bg-white" />
      <span className="absolute -top-1 right-5 h-7 w-9 rounded-full bg-white" />
    </span>
  );
}
