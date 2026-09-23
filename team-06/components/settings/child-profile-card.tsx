"use client";

import { useState } from "react";
import { ChildAnalytics } from "@/lib/constants/analytics";
import { ChildProfileForm } from "./child-profile-form";

interface Props {
  child: ChildAnalytics;
  onSave: (updated: ChildAnalytics) => void;
}

// Strictly palette colors: Powder Blue and Warm Beige
const FOCUS_COLORS: Record<string, string> = {
  "Emotional Regulation": "bg-[#D0E6FD] text-[#162660] border-[#162660]",
  "Homework & Academic Focus": "bg-[#E8DAC4] text-[#162660] border-[#4A3B2C]",
  "Sharing & Social Skills": "bg-[#D0E6FD] text-[#162660] border-[#162660]",
  "Friendship & Peer Relationships": "bg-[#E8DAC4] text-[#162660] border-[#4A3B2C]",
  "Handling Frustration / Losing": "bg-[#D0E6FD] text-[#162660] border-[#162660]",
  "Following Routines & Instructions": "bg-[#E8DAC4] text-[#162660] border-[#4A3B2C]",
  "Physical Activity Habits": "bg-[#D0E6FD] text-[#162660] border-[#162660]",
  "Screen Time Balance": "bg-[#E8DAC4] text-[#162660] border-[#4A3B2C]",
};

export function ChildProfileCard({ child, onSave }: Props) {
  const [showForm, setShowForm] = useState(false);

  const focusAreas = child.profile.focusAreas || [];
  const visibleFocus = focusAreas.slice(0, 3);
  const extraFocusCount = focusAreas.length > 3 ? focusAreas.length - 3 : 0;
  const totalTasksDone = (child.actions?.done || 0) + (child.challenges?.done || 0);

  return (
    <>
      <div className="aralkada-card p-4 flex flex-col gap-3 hover:translate-y-[-2px] transition-transform duration-200">
        {/* ── Header: Profile Name, Age, Description ── */}
        <div className="flex items-center gap-3">
          {/* Avatar (Royal Blue from palette) */}
          <div
            className="w-12 h-12 rounded-2xl flex items-center justify-center text-xl font-black text-[#F1E4D1] border-2 border-[#4A3B2C] shadow-[0_3px_0_#4A3B2C] shrink-0 bg-[#162660]"
          >
            {child.avatarLetter}
          </div>

          {/* Name, Age & Personality */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-base font-black text-[#162660] leading-none">
                {child.childName}
              </h3>
              <span className="text-[10px] font-bold text-[#162660]/50">
                Age {child.profile.age} · {child.profile.grade}
              </span>
            </div>
            <p className="text-[11px] font-bold text-[#4A3B2C]/70 mt-0.5 truncate italic">
              &quot;{child.profile.personality}&quot;
            </p>
          </div>

          {/* Edit button */}
          <button
            onClick={() => setShowForm(true)}
            className="shrink-0 w-8 h-8 rounded-xl bg-[#F1E4D1] border-2 border-[#4A3B2C] shadow-[0_2px_0_#4A3B2C] flex items-center justify-center hover:bg-[#E6D4BA] transition-all active:translate-y-[2px] active:shadow-[0_0px_0_#4A3B2C] cursor-pointer"
            aria-label={`Edit ${child.childName}'s profile`}
          >
            <svg className="w-4 h-4 text-[#162660]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5"
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
            </svg>
          </button>
        </div>

        {/* ── Focus Areas (Max 3 visible + badge for extra) ── */}
        {focusAreas.length > 0 && (
          <div className="flex flex-wrap gap-1.5 items-center">
            {visibleFocus.map((area) => (
              <span
                key={area}
                className={`text-[9px] font-black border-2 rounded-full px-2.5 py-0.5 uppercase tracking-wide ${FOCUS_COLORS[area] ?? "bg-[#D0E6FD] text-[#162660] border-[#162660]"}`}
              >
                {area}
              </span>
            ))}
            {extraFocusCount > 0 && (
              <span className="text-[10px] font-black bg-[#E8DAC4] text-[#162660] border-2 border-[#4A3B2C] rounded-full px-2 py-0.5 shadow-sm" title={`${extraFocusCount} more focus areas`}>
                +{extraFocusCount}
              </span>
            )}
          </div>
        )}

        {/* ── Stats Divider: Time Left & Tasks Done (Palette Blue & Beige) ── */}
        <div className="border-t-2 border-dashed border-[#4A3B2C]/20 pt-3 flex flex-col gap-1.5">
          <p className="text-[9px] font-black text-[#162660]/40 uppercase tracking-widest">
            This Week
          </p>

          <div className="grid grid-cols-2 gap-3">
            {/* Time Left (Warm Beige) */}
            <div className="flex flex-col items-center justify-center bg-[#E8DAC4] border-2 border-[#4A3B2C] rounded-xl p-2.5 shadow-[0_2px_0_#4A3B2C]">
              <span className="text-base font-black text-[#162660]">{child.tokens.remainingHours}h</span>
              <span className="text-[9px] font-black text-[#162660]/70 uppercase tracking-wide">time left</span>
            </div>

            {/* Tasks Done (Powder Blue) */}
            <div className="flex flex-col items-center justify-center bg-[#D0E6FD] border-2 border-[#162660] rounded-xl p-2.5 shadow-[0_2px_0_#162660]">
              <span className="text-base font-black text-[#162660]">{totalTasksDone}</span>
              <span className="text-[9px] font-black text-[#162660]/70 uppercase tracking-wide">tasks done</span>
            </div>
          </div>
        </div>
      </div>

      {/* Edit modal */}
      {showForm && (
        <ChildProfileForm
          child={child}
          onSave={(updated) => { onSave(updated); setShowForm(false); }}
          onClose={() => setShowForm(false)}
        />
      )}
    </>
  );
}
