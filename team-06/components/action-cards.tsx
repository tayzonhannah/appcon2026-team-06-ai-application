import Link from "next/link";

export function ActionCards() {
  return (
    <div className="flex flex-col gap-4 h-full">
      {/* Option 1: Chatbot (Mascot) Card */}
      <div className="aralkada-card p-4 flex flex-col flex-1">
        <div>
          <div className="flex items-center justify-between mb-3">
            <span className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-[#D0E6FD] border-2 border-[#4A3B2C] shadow-[0_2px_0_#4A3B2C] text-[10px] font-black text-[#162660] uppercase tracking-wider">
              Parent AI Mascot
            </span>
          </div>

          <h3 className="text-lg font-black text-[#162660] mb-1.5 tracking-tight">
            Express a Concern to Chatbot
          </h3>

          <p className="text-xs font-bold text-[#162660]/75 leading-relaxed mb-3">
            Share what your child is struggling with (screen tantrums, setbacks, frustration).
            The AI mascot provides proven Gottman emotion-coaching scripts and offline resources.
          </p>

          {/* Prompt Suggestion Pills */}
          <div className="flex flex-wrap gap-1.5 mb-3">
            <span className="px-2.5 py-1 rounded-xl bg-[#F8F1E5] border-2 border-[#4A3B2C]/20 text-[11px] font-bold text-[#162660]">
              &quot;Handling anger when turning off iPad&quot;
            </span>
            <span className="px-2.5 py-1 rounded-xl bg-[#F8F1E5] border-2 border-[#4A3B2C]/20 text-[11px] font-bold text-[#162660]">
              &quot;Encouraging resilience after failure&quot;
            </span>
          </div>
        </div>

        <Link
          href="/chatbot"
          className="mt-auto w-full py-3 aralkada-btn-primary flex items-center justify-center gap-2 text-center text-sm cursor-pointer"
        >
          <svg className="w-4 h-4 text-[#F1E4D1]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2.2"
              d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
            />
          </svg>
          <span>CHAT WITH MASCOT</span>
        </Link>
      </div>

      {/* Option 2: Make Action / Challenge Card */}
      <div className="aralkada-card p-4 flex flex-col flex-1">
        <div>
          <div className="flex items-center justify-between mb-3">
            <span className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-[#E8DAC4] border-2 border-[#4A3B2C] shadow-[0_2px_0_#4A3B2C] text-[10px] font-black text-[#162660] uppercase tracking-wider">
              Offline Skill Building
            </span>
          </div>

          <h3 className="text-lg font-black text-[#162660] mb-1.5 tracking-tight">
            Make an Action or Challenge
          </h3>

          <p className="text-xs font-bold text-[#162660]/75 leading-relaxed mb-3">
            Create real-world offline quests for your kid. Once verified, each completed
            challenge or action releases tokens that unlock earned screen time.
          </p>

          {/* Quick Stats Summary */}
          <div className="grid grid-cols-2 gap-2 mb-3">
            <div className="p-2.5 rounded-xl bg-[#F8F1E5] border-2 border-[#4A3B2C]/30 text-center">
              <span className="block text-[10px] font-black text-[#162660]/60 uppercase">
                Reward Rate
              </span>
              <span className="text-sm font-black text-[#162660]">1 Action = 15m</span>
            </div>
            <div className="p-2.5 rounded-xl bg-[#F8F1E5] border-2 border-[#4A3B2C]/30 text-center">
              <span className="block text-[10px] font-black text-[#162660]/60 uppercase">
                Max Daily Cap
              </span>
              <span className="text-sm font-black text-[#162660]">2.5 hrs / day</span>
            </div>
          </div>
        </div>

        <Link
          href="/challenge"
          className="mt-auto w-full py-3 aralkada-btn-secondary flex items-center justify-center gap-2 text-center text-sm cursor-pointer"
        >
          <svg className="w-4 h-4 text-[#162660]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M12 4v16m8-8H4" />
          </svg>
          <span>CREATE ACTION / CHALLENGE</span>
        </Link>
      </div>
    </div>
  );
}
