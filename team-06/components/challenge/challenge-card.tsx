"use client";

import { ChildChallenge } from "@/lib/constants/challenges";

interface Props {
  challenge: ChildChallenge;
  onToggleStatus: (id: string) => void;
}

export function ChallengeCard({ challenge, onToggleStatus }: Props) {
  const isDone = challenge.status === "done";

  return (
    <div className={`aralkada-card p-5 flex flex-col justify-between gap-4 transition-all duration-200 hover:translate-y-[-2px] ${
      isDone ? "opacity-80 bg-[#F8F1E5]" : "bg-white"
    }`}>
      {/* Top row: Icon Badge & Status */}
      <div className="flex items-start justify-between gap-3">
        <div className="w-10 h-10 rounded-2xl bg-[#D0E6FD] border-2 border-[#162660] shadow-[0_2px_0_#162660] flex items-center justify-center shrink-0">
          <svg className="w-5 h-5 text-[#162660]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>

        {/* Minutes Worth Badge (Powder Blue) */}
        <span className="px-3 py-1 rounded-full bg-[#D0E6FD] border-2 border-[#162660] shadow-[0_2px_0_#162660] text-[10px] font-black text-[#162660] uppercase tracking-wider">
          +{challenge.earnedMinutes}m Screen Time
        </span>
      </div>

      {/* Main Title & Description */}
      <div>
        <h3 className={`text-base font-black text-[#162660] leading-snug tracking-tight ${
          isDone ? "line-through opacity-70" : ""
        }`}>
          {challenge.title}
        </h3>
        <p className="text-xs font-bold text-[#4A3B2C]/75 mt-1 leading-relaxed">
          {challenge.description}
        </p>
      </div>

      {/* Bullet points of what should be achieved */}
      {challenge.milestones && challenge.milestones.length > 0 && (
        <div className="bg-[#F8F1E5] border-2 border-[#4A3B2C]/20 rounded-xl p-3 flex flex-col gap-1.5">
          <p className="text-[9px] font-black uppercase tracking-widest text-[#162660]/60">
            Goals to Achieve:
          </p>
          <ul className="flex flex-col gap-1">
            {challenge.milestones.map((m, idx) => (
              <li key={idx} className="flex items-start gap-2 text-xs font-bold text-[#162660]/90 leading-tight">
                <span className="text-[#162660] font-black shrink-0">•</span>
                <span>{m}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Focus Area Badge & Action Button */}
      <div className="flex items-center justify-between gap-2 pt-2 border-t-2 border-dashed border-[#4A3B2C]/15 mt-auto flex-wrap">
        <span className="px-2.5 py-1 rounded-full bg-[#E8DAC4] border-2 border-[#4A3B2C] text-[9px] font-black uppercase text-[#162660] tracking-wide">
          {challenge.targetFocusArea}
        </span>

        <button
          type="button"
          onClick={() => onToggleStatus(challenge.id)}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
            isDone
              ? "aralkada-btn-outline"
              : "aralkada-btn-primary"
          }`}
        >
          {isDone ? "Mark Incomplete" : "Mark Complete ✓"}
        </button>
      </div>
    </div>
  );
}
