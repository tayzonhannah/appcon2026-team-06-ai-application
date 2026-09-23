"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useState, useSyncExternalStore } from "react";
import {
  KID_MISSIONS,
  completeMission,
  readMissionCompletions,
  subscribeToMissions,
} from "@/lib/constants/missions";

const SERVER_COMPLETIONS_SNAPSHOT: Record<string, string> = {};

function getServerCompletionsSnapshot() {
  return SERVER_COMPLETIONS_SNAPSHOT;
}

export default function KidMissionDetailPage() {
  const { id } = useParams<{ id: string }>();
  const mission = KID_MISSIONS.find((candidate) => candidate.id === id);
  const [checked, setChecked] = useState<boolean[]>(() =>
    mission ? mission.steps.map(() => false) : [],
  );
  const completions = useSyncExternalStore(
    subscribeToMissions,
    readMissionCompletions,
    getServerCompletionsSnapshot,
  );

  if (!mission) {
    return (
      <div className="mx-auto w-full max-w-2xl py-10">
        <div className="rounded-[24px] border-4 border-[#0F172A] bg-white p-8 text-center shadow-[0_7px_0_#0F172A]">
          <h1 className="text-3xl font-black">Mission not found</h1>
          <p className="mt-3 font-bold text-[#475569]">This mission may have been removed. Pick another one.</p>
          <Link href="/kid/missions" className="mt-6 inline-flex rounded-xl border-2 border-[#0F172A] bg-[#F59E0B] px-4 py-3 text-xs font-black uppercase shadow-[0_3px_0_#0F172A]">Back to missions</Link>
        </div>
      </div>
    );
  }

  const isDone = Boolean(completions[mission.id]);
  const allChecked = checked.length === mission.steps.length && checked.every(Boolean);

  const toggleStep = (index: number) => {
    if (isDone) return;
    setChecked((prev) => prev.map((value, i) => (i === index ? !value : value)));
  };

  return (
    <div className="mx-auto w-full max-w-3xl py-2 sm:py-10">
      <div className="flex items-center gap-2">
        <Link href="/kid/missions" className="inline-flex min-h-[44px] items-center rounded-lg px-3 py-2 text-xs font-black uppercase tracking-wider text-[#2563EB] underline underline-offset-4 focus:outline-none focus:ring-2 focus:ring-[#2563EB] touch-manipulation">
          ← All missions
        </Link>
        <span aria-hidden="true" className="text-[#0F172A]/30">•</span>
        <Link href="/kid" className="inline-flex min-h-[44px] items-center rounded-lg px-3 py-2 text-xs font-black uppercase tracking-wider text-[#2563EB] underline underline-offset-4 focus:outline-none focus:ring-2 focus:ring-[#2563EB] touch-manipulation">
          Home
        </Link>
      </div>

      <div className={`mt-4 rounded-[24px] border-4 border-[#0F172A] p-5 shadow-[0_7px_0_#0F172A] sm:p-8 ${mission.color}`}>
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border-2 border-[#0F172A] bg-white text-2xl font-black" aria-hidden="true">{mission.icon}</span>
            <div>
              <p className="text-xs font-black uppercase tracking-[0.18em] text-[#0F172A]/60">One small mission</p>
              <h1 className="mt-1 text-2xl font-black leading-tight sm:text-4xl">{mission.title}</h1>
            </div>
          </div>
          <span className="shrink-0 rounded-lg border-2 border-[#0F172A] bg-white px-3 py-2 text-[10px] font-black uppercase">{isDone ? "Done ✓" : mission.reward}</span>
        </div>

        <p className="mt-4 text-base font-bold leading-relaxed text-[#0F172A]/75">{mission.detail}</p>

        <div className="mt-6 rounded-2xl border-2 border-[#0F172A]/20 bg-white/80 p-3 sm:p-4">
          <p className="text-[10px] font-black uppercase tracking-wider text-[#475569]">Do it step by step — tap each step when finished</p>
          <ol className="mt-3 flex flex-col gap-2.5">
            {mission.steps.map((step, index) => {
              const done = checked[index] || isDone;
              return (
                <li key={step}>
                  <button
                    type="button"
                    onClick={() => toggleStep(index)}
                    disabled={isDone}
                    aria-pressed={done}
                    className={`flex min-h-[60px] w-full items-center gap-3 rounded-xl border-2 px-3 py-3 text-left text-[15px] font-bold transition active:scale-[0.99] focus:outline-none focus:ring-4 focus:ring-[#2563EB]/30 touch-manipulation ${done ? "border-[#0F172A] bg-[#B7E4C7]" : "border-[#0F172A]/20 bg-white hover:border-[#2563EB] active:border-[#2563EB]"} ${isDone ? "cursor-default" : "cursor-pointer"}`}
                  >
                    <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border-2 border-[#0F172A] text-base font-black ${done ? "bg-[#0F172A] text-white" : "bg-white"}`} aria-hidden="true">
                      {done ? "✓" : index + 1}
                    </span>
                    <span className={done ? "line-through opacity-70" : ""}>{step}</span>
                  </button>
                </li>
              );
            })}
          </ol>
        </div>

        {isDone ? (
          <div className="mt-6 rounded-2xl border-2 border-[#0F172A] bg-[#B7E4C7] p-5">
            <p className="text-base font-black">Nice work! You finished this mission. {mission.reward}</p>
            <div className="mt-4 flex flex-col gap-2.5 sm:flex-row">
              <Link href="/kid/missions" className="inline-flex min-h-[52px] items-center justify-center rounded-xl border-2 border-[#0F172A] bg-white px-4 py-3 text-center text-xs font-black uppercase tracking-wider shadow-[0_3px_0_#0F172A] active:translate-y-0.5 active:shadow-none touch-manipulation">Pick another mission</Link>
              <Link href="/kid" className="inline-flex min-h-[52px] items-center justify-center rounded-xl border-2 border-[#0F172A] bg-[#0F172A] px-4 py-3 text-center text-xs font-black uppercase tracking-wider text-white shadow-[0_3px_0_#0F172A] active:translate-y-0.5 active:shadow-none touch-manipulation">Back to home</Link>
            </div>
          </div>
        ) : (
          <div className="mt-6">
            <button
              type="button"
              disabled={!allChecked}
              onClick={() => completeMission(mission.id)}
              className="min-h-[56px] w-full rounded-xl border-2 border-[#0F172A] bg-[#F59E0B] px-4 py-4 text-sm font-black uppercase tracking-wider shadow-[0_4px_0_#0F172A] transition hover:-translate-y-0.5 active:translate-y-0 active:shadow-none focus:outline-none focus:ring-4 focus:ring-white/60 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0 touch-manipulation"
            >
              {allChecked ? `Finish mission • ${mission.reward}` : "Finish all steps to complete"}
            </button>
            <p className="mt-3 text-center text-xs font-bold text-[#0F172A]/60">
              Stuck? <Link href="/kid/chatbot" className="font-black underline underline-offset-4">Ask Compass for an idea</Link>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
