"use client";

import { useChildProfiles } from "@/lib/hooks/useChildProfiles";
import { ChildProfileCard } from "@/components/settings/child-profile-card";
import { RewardConfigPanel } from "@/components/settings/reward-config-panel";

export default function SettingsPage() {
  const { children, rewardConfig, updateChild, updateRewardConfig } = useChildProfiles();

  return (
    <div className="flex flex-col gap-5">
      {/* ── Page Header ── */}
      <div className="flex items-center justify-between pb-3 border-b-2 border-[#4A3B2C]/20">
        <div>
          <h1 className="text-2xl font-black text-[#162660] tracking-tight">Settings</h1>
          <p className="text-xs font-bold text-[#162660]/50 mt-0.5">
            Child profiles · Screen time & reward configuration
          </p>
        </div>
      </div>

      {/* ── Two-column layout ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">

        {/* Left: Child Profile Cards */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <p className="text-[10px] font-black text-[#162660]/50 uppercase tracking-widest">
              Linked Children
            </p>
            <span className="text-[10px] font-bold text-[#162660]/40">
              {children.length} profile{children.length !== 1 ? "s" : ""}
            </span>
          </div>

          {children.map((child) => (
            <ChildProfileCard
              key={child.childId}
              child={child}
              onSave={updateChild}
            />
          ))}
        </div>

        {/* Right: Reward Config */}
        <div className="lg:col-span-7">
          <RewardConfigPanel config={rewardConfig} onChange={updateRewardConfig} />
        </div>

      </div>
    </div>
  );
}
