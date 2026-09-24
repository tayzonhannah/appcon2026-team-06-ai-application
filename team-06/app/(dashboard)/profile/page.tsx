"use client";

import Link from "next/link";
import { useSyncExternalStore } from "react";
import { DEFAULT_PROFILE_TRAITS, PROFILE_DATA_KEY, ProfileTrait } from "@/lib/constants/profile";

const readSavedTraits = (): ProfileTrait[] => {
  if (typeof window === "undefined") return DEFAULT_PROFILE_TRAITS;
  const savedProfile = localStorage.getItem(PROFILE_DATA_KEY);
  if (!savedProfile) return DEFAULT_PROFILE_TRAITS;

  try {
    return JSON.parse(savedProfile) as ProfileTrait[];
  } catch {
    return DEFAULT_PROFILE_TRAITS;
  }
};

export default function ProfilePage() {
  const traits = useSyncExternalStore(
    () => () => undefined,
    readSavedTraits,
    () => DEFAULT_PROFILE_TRAITS,
  );

  return (
    <div className="mx-auto w-full max-w-4xl py-6 sm:py-10">
      <div className="flex flex-col gap-4 border-b-2 border-[#4A3B2C]/20 pb-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[#162660]/60">Parent profile</p>
          <h1 className="mt-1 text-3xl font-black tracking-tight text-[#162660]">Your emotional toolkit</h1>
          <p className="mt-2 max-w-2xl text-sm font-bold leading-relaxed text-[#162660]/70">A qualitative snapshot of the strengths and reflection habits you bring to family growth.</p>
        </div>
        <Link href="/assessment" className="aralkada-btn-secondary w-fit px-4 py-2.5 text-xs">Retake assessment</Link>
      </div>
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        {traits.map((trait) => (
          <article key={trait.name} className="aralkada-card p-5">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-xl font-black text-[#162660]">{trait.name}</h2>
              <span className="rounded-full border-2 border-[#4A3B2C] px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-[#162660]" style={{ backgroundColor: `${trait.color}35` }}>{trait.label}</span>
            </div>
            <div className="mt-4 flex gap-1.5" aria-label={`${trait.name}: ${trait.label}`}>
              {["Growing", "Developing", "Strong"].map((label) => <span key={label} className={`h-3 flex-1 rounded-full border border-[#4A3B2C]/30 ${label === trait.label || (trait.label === "Strong" && label !== "Growing") || (trait.label === "Developing" && label === "Growing") ? "opacity-100" : "opacity-25"}`} style={{ backgroundColor: trait.color }} />)}
            </div>
            <p className="mt-4 text-sm font-bold leading-relaxed text-[#162660]/70">{trait.description}</p>
          </article>
        ))}
      </div>
      <div className="mt-6 rounded-2xl border-2 border-[#4A3B2C]/30 bg-[#D0E6FD] p-5 text-sm font-bold leading-relaxed text-[#162660]">This profile is a reflection tool, not a clinical assessment. Use it to start conversations and choose small experiments that support your family.</div>
    </div>
  );
}