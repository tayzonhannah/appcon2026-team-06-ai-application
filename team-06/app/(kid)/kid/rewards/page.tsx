"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useSyncExternalStore } from "react";
import {
  readAvailableTokens,
  readTokenAwards,
  subscribeToGrowthActions,
  type TokenAward,
} from "@/lib/growth-store";
import { KID_MISSIONS } from "@/lib/constants/missions";

const SERVER_TOKENS_SNAPSHOT: TokenAward[] = [];
const SERVER_ALL_SNAPSHOT: TokenAward[] = [];

function getServerTokensSnapshot() {
  return SERVER_TOKENS_SNAPSHOT;
}

function getServerAllSnapshot() {
  return SERVER_ALL_SNAPSHOT;
}

function getKidTokensSnapshot() {
  return readAvailableTokens("kid-101");
}

function getAllTokensSnapshot() {
  return readTokenAwards();
}

function tokenLabel(actionId: string) {
  if (actionId.startsWith("mission-")) {
    const mission = KID_MISSIONS.find((m) => `mission-${m.id}` === actionId);
    return mission ? `Mission: ${mission.title}` : "Mission";
  }
  return "Parent-approved action";
}

function RewardsBody() {
  const params = useSearchParams();
  const earned = Number(params.get("earned") ?? "0");
  const tokens = useSyncExternalStore(
    subscribeToGrowthActions,
    getKidTokensSnapshot,
    getServerTokensSnapshot,
  );
  const all = useSyncExternalStore(
    subscribeToGrowthActions,
    getAllTokensSnapshot,
    getServerAllSnapshot,
  );
  const balance = tokens.reduce((total, token) => total + token.minutes, 0);

  return (
    <div className="mx-auto w-full max-w-3xl py-2 sm:py-10">
      <Link href="/kid" className="inline-flex min-h-[44px] items-center rounded-lg px-3 py-2 text-xs font-black uppercase tracking-wider text-[#2563EB] underline underline-offset-4 touch-manipulation">
        ← Back to home
      </Link>

      {earned > 0 ? (
        <div className="mt-4 rounded-[20px] border-4 border-[#0F172A] bg-[#B7E4C7] p-5 shadow-[0_5px_0_#0F172A]" aria-live="polite">
          <p className="text-xs font-black uppercase tracking-[0.18em]">You earned it</p>
          <p className="mt-1 text-3xl font-black tabular-nums">+{earned} min</p>
          <p className="mt-1 text-sm font-bold text-[#0F172A]/70">Added to your minutes balance. Minutes last 24 hours.</p>
        </div>
      ) : null}

      <div className="mt-4 rounded-[24px] border-4 border-[#0F172A] bg-[#0F172A] p-6 text-white shadow-[0_7px_0_#0F172A] sm:p-8">
        <p className="text-xs font-black uppercase tracking-[0.2em] text-[#DBEAFE]">My minutes</p>
        <p className="mt-1 text-5xl font-black tabular-nums">{balance}<span className="ml-2 align-middle text-lg font-black text-[#DBEAFE]">min</span></p>
        <p className="mt-3 text-sm font-bold leading-relaxed text-[#EFF6FF]">
          {balance > 0
            ? "Show this to your parent when you want screen time."
            : "Finish a mission (+5m) or get an action approved (+15m) to earn minutes."}
        </p>
        <Link href="/kid/missions" className="mt-5 inline-flex min-h-[52px] w-full items-center justify-center rounded-xl border-2 border-[#0F172A] bg-[#F59E0B] px-5 py-3 text-sm font-black uppercase tracking-wider text-[#0F172A] shadow-[0_4px_0_#0F172A] touch-manipulation sm:w-auto">
          Earn more →
        </Link>
      </div>

<h2 className="mt-8 text-xl font-black">Mission history</h2>
        {all.length === 0 ? (
          <div className="mt-3 rounded-[20px] border-4 border-dashed border-[#0F172A]/30 bg-white/70 p-6 text-sm font-bold text-[#475569]">
            No missions yet. Complete missions to earn minutes.
          </div>
        ) : (
          <ul className="mt-3 flex flex-col gap-3">
            {all.map((token) => {
              return (
                <li key={token.id} className="rounded-[18px] border-4 border-[#0F172A] p-4 shadow-[0_4px_0_#0F172A]">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-black">{tokenLabel(token.actionId)}</p>
                      <p className="mt-1 text-xs font-bold text-[#475569]">Active</p>
                    </div>
                    <span className="shrink-0 rounded-lg border-2 border-[#0F172A] bg-[#D0E6FD] px-2.5 py-1 text-xs font-black tabular-nums">+{token.minutes}m</span>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
    </div>
  );
}

export default function KidRewardsPage() {
  return (
    <Suspense fallback={<div className="mx-auto w-full max-w-3xl py-10 text-sm font-bold">Loading tokens…</div>}>
      <RewardsBody />
    </Suspense>
  );
}
