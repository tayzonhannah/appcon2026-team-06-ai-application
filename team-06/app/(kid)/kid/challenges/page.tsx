"use client";

import Link from "next/link";
import { useSyncExternalStore } from "react";
import { readChallenges, subscribeToChallenges, type KidChallenge } from "@/lib/challenge-store";

const SERVER_SNAPSHOT: KidChallenge[] = [];
function getServerSnapshot() {
  return SERVER_SNAPSHOT;
}

export default function KidChallengesPage() {
  const challenges = useSyncExternalStore(subscribeToChallenges, readChallenges, getServerSnapshot).filter(
    (c) => c.childId === "kid-101" && c.progress !== "approved",
  );

  return (
    <div className="mx-auto w-full max-w-5xl py-2 sm:py-10">
      <Link href="/kid" className="inline-flex min-h-[44px] items-center rounded-lg px-3 py-2 text-xs font-black uppercase tracking-wider text-[#2563EB] underline underline-offset-4 touch-manipulation">
        ← Back to home
      </Link>
      <div className="mt-4">
        <p className="text-xs font-black uppercase tracking-[0.18em] text-[#2563EB]">Self-sufficiency • self-paced</p>
        <h1 className="mt-1 text-3xl font-black tracking-tight sm:text-4xl">My challenges</h1>
        <p className="mt-2 max-w-2xl text-[15px] font-bold leading-relaxed text-[#475569]">
          Build your own project step by step. Finish milestones, send a report, earn minutes.
        </p>
      </div>
      {challenges.length === 0 ? (
        <div className="mt-6 rounded-[20px] border-4 border-dashed border-[#0F172A]/30 bg-white/70 p-6 text-sm font-bold text-[#475569]">
          No challenges yet. Ask your parent to create one from the dashboard.
        </div>
      ) : (
        <div className="mt-6 grid gap-5 sm:grid-cols-2">
          {challenges.map((challenge) => (
            <article key={challenge.id} className="rounded-[22px] border-4 border-[#0F172A] bg-white p-5 shadow-[0_6px_0_#0F172A]">
              <div className="flex items-start justify-between gap-3">
                <h2 className="text-xl font-black leading-tight">{challenge.title}</h2>
                <span className="shrink-0 rounded-lg border-2 border-[#0F172A] bg-[#D0E6FD] px-2 py-1 text-[10px] font-black uppercase">
                  {challenge.progress === "submitted" ? "In review" : `+${challenge.minutes} min`}
                </span>
              </div>
              <p className="mt-2 text-sm font-bold leading-relaxed text-[#475569]">{challenge.description}</p>
              <p className="mt-2 text-xs font-black uppercase tracking-wider text-[#475569]">
                {challenge.milestones.length} milestones • {challenge.timeline}
              </p>
              <Link
                href={`/kid/challenges/${challenge.id}`}
                className="mt-4 flex min-h-[52px] w-full items-center justify-center rounded-xl border-2 border-[#0F172A] bg-[#F59E0B] px-4 py-3 text-center text-xs font-black uppercase tracking-wider shadow-[0_3px_0_#0F172A] touch-manipulation"
              >
                Open challenge →
              </Link>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
