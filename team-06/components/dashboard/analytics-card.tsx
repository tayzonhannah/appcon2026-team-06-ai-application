import { ChildAnalytics } from "@/lib/constants/analytics";

interface AnalyticsCardProps {
  data: ChildAnalytics;
}

export function AnalyticsCard({ data }: AnalyticsCardProps) {
  return (
    <div className="aralkada-card p-6 flex flex-col gap-6">
      {/* Header with Child Profile Pill */}
      <div className="flex items-center justify-between border-b-2 border-[#4A3B2C]/20 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#162660] text-[#F1E4D1] font-black text-lg flex items-center justify-center border-2 border-[#4A3B2C] shadow-[0_2px_0_#4A3B2C]">
            {data.avatarLetter}
          </div>
          <div>
            <h3 className="font-black text-lg text-[#162660] leading-none">
              {data.childName}'s Growth Analytics
            </h3>
            <span className="text-[11px] font-bold text-[#162660]/70 uppercase tracking-wider">
              Connected Profile
            </span>
          </div>
        </div>

        <div className="px-3 py-1 rounded-full bg-[#D0E6FD] border-2 border-[#4A3B2C] shadow-[0_2px_0_#4A3B2C] text-[10px] font-black text-[#162660] uppercase tracking-wider">
          Live Tracking
        </div>
      </div>

      {/* Metrics Section: Actions & Challenges */}
      <div className="flex flex-col gap-4">
        {/* Actions Box */}
        <div className="rounded-2xl border-2 border-[#4A3B2C] bg-[#F8F1E5] p-4 shadow-[0_3px_0_#4A3B2C]">
          <div className="flex items-center justify-between mb-3">
            <span className="font-black text-xs text-[#162660] uppercase tracking-wider">
              Offline Actions
            </span>
            <span className="text-xs font-extrabold text-[#162660]/60">
              Total: {data.actions.ongoing + data.actions.done}
            </span>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-xl bg-white border-2 border-[#4A3B2C]/30 p-3 text-center">
              <span className="block text-[11px] font-bold text-[#162660]/70 uppercase">
                Ongoing
              </span>
              <span className="text-2xl font-black text-[#162660]">
                {data.actions.ongoing}
              </span>
            </div>
            <div className="rounded-xl bg-white border-2 border-[#4A3B2C]/30 p-3 text-center">
              <span className="block text-[11px] font-bold text-[#162660]/70 uppercase">
                Done
              </span>
              <span className="text-2xl font-black text-[#162660]">
                {data.actions.done}
              </span>
            </div>
          </div>
        </div>

        {/* Challenges Box */}
        <div className="rounded-2xl border-2 border-[#4A3B2C] bg-[#F8F1E5] p-4 shadow-[0_3px_0_#4A3B2C]">
          <div className="flex items-center justify-between mb-3">
            <span className="font-black text-xs text-[#162660] uppercase tracking-wider">
              Challenges
            </span>
            <span className="text-xs font-extrabold text-[#162660]/60">
              Total: {data.challenges.ongoing + data.challenges.done}
            </span>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-xl bg-white border-2 border-[#4A3B2C]/30 p-3 text-center">
              <span className="block text-[11px] font-bold text-[#162660]/70 uppercase">
                Ongoing
              </span>
              <span className="text-2xl font-black text-[#162660]">
                {data.challenges.ongoing}
              </span>
            </div>
            <div className="rounded-xl bg-white border-2 border-[#4A3B2C]/30 p-3 text-center">
              <span className="block text-[11px] font-bold text-[#162660]/70 uppercase">
                Done
              </span>
              <span className="text-2xl font-black text-[#162660]">
                {data.challenges.done}
              </span>
            </div>
          </div>
        </div>

        {/* Tokens & Earned Screen Time Box */}
        <div className="rounded-2xl border-2 border-[#4A3B2C] bg-[#D0E6FD] p-4 shadow-[0_3px_0_#4A3B2C]">
          <div className="flex items-center justify-between mb-3">
            <span className="font-black text-xs text-[#162660] uppercase tracking-wider">
              Tokens & Screen Time Earned
            </span>
            <span className="text-xs font-extrabold text-[#162660]/70">
              {data.tokens.totalTokens} Tokens
            </span>
          </div>

          <div className="rounded-xl bg-white border-2 border-[#4A3B2C] p-4 flex flex-col gap-2">
            <div className="flex items-baseline justify-between">
              <span className="text-xs font-black text-[#162660] uppercase">
                Earned Screen Time:
              </span>
              <span className="text-2xl font-black text-[#162660]">
                {data.tokens.earnedHours} hrs
              </span>
            </div>

            <div className="w-full bg-[#F1E4D1] h-3 rounded-full overflow-hidden border border-[#4A3B2C]/30">
              <div
                className="bg-[#162660] h-full rounded-full transition-all"
                style={{
                  width: `${(data.tokens.usedHours / data.tokens.earnedHours) * 100}%`,
                }}
              />
            </div>

            <div className="flex justify-between items-center text-[11px] font-extrabold text-[#162660]/75 pt-1">
              <span>Used: {data.tokens.usedHours} hrs</span>
              <span>Available: {data.tokens.remainingHours} hrs</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
