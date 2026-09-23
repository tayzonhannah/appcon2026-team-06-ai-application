"use client";

import Link from "next/link";
import { useEffect, useState, useSyncExternalStore } from "react";
import {
  readGrowthActions,
  readAvailableTokens,
  subscribeToGrowthActions,
  type GrowthAction,
  type TokenAward,
} from "@/lib/growth-store";
import {
  KID_MISSIONS,
  readMissionCompletions,
  subscribeToMissions,
} from "@/lib/constants/missions";

const SERVER_ACTIONS_SNAPSHOT: GrowthAction[] = [];
const SERVER_TOKENS_SNAPSHOT: TokenAward[] = [];
const SERVER_COMPLETIONS_SNAPSHOT: Record<string, string> = {};

function getServerActionsSnapshot() {
  return SERVER_ACTIONS_SNAPSHOT;
}

function getKidTokensSnapshot() {
  return readAvailableTokens("kid-101");
}

function getServerTokensSnapshot() {
  return SERVER_TOKENS_SNAPSHOT;
}

function getServerCompletionsSnapshot() {
  return SERVER_COMPLETIONS_SNAPSHOT;
}

export default function KidHomePage() {
  const [currentTime, setCurrentTime] = useState(0);
  useEffect(() => {
    const initialClock = window.setTimeout(() => setCurrentTime(Date.now()), 0);
    const timer = window.setInterval(() => setCurrentTime(Date.now()), 60000);
    return () => {
      window.clearTimeout(initialClock);
      window.clearInterval(timer);
    };
  }, []);

  const actions = useSyncExternalStore(
    subscribeToGrowthActions,
    readGrowthActions,
    getServerActionsSnapshot,
  ).filter((action) => action.childId === "kid-101" && action.status === "active" && action.progress !== "approved");
  const tokenAwards = useSyncExternalStore(
    subscribeToGrowthActions,
    getKidTokensSnapshot,
    getServerTokensSnapshot,
  );
  const completions = useSyncExternalStore(
    subscribeToMissions,
    readMissionCompletions,
    getServerCompletionsSnapshot,
  );
  const nextTokenExpiry = tokenAwards[0]?.expiresAt;
  const minutesRemaining = nextTokenExpiry
    ? Math.max(0, Math.ceil((new Date(nextTokenExpiry).getTime() - currentTime) / 60000))
    : 0;

  return (
    <div className="my-auto space-y-6">
      <section className="grid gap-5 lg:grid-cols-[1.25fr_0.75fr]">
        <div className="relative overflow-hidden rounded-[24px] border-4 border-[#0F172A] bg-[#2563EB] p-6 text-white shadow-[0_7px_0_#0F172A] sm:p-8">
          <div className="absolute -right-8 -top-10 h-36 w-36 rounded-full border-4 border-[#0F172A]/15 bg-[#60A5FA]" />
          <div className="relative">
            <p className="mb-2 text-xs font-black uppercase tracking-[0.2em] text-[#DBEAFE]">Your learning lab</p>
            <h1 className="max-w-xl text-3xl font-black leading-[0.95] tracking-tight sm:text-5xl">
              Hey, Kai. Ready for one small win?
            </h1>
            <p className="mt-4 max-w-lg text-base font-bold leading-relaxed text-[#EFF6FF]">
              Your choices build your adventure. Pick a mission, earn stars, and keep your streak moving.
            </p>
            <Link
              href="/kid/missions"
              className="mt-6 inline-flex min-h-[52px] w-full items-center justify-center gap-2 rounded-xl border-2 border-[#0F172A] bg-[#F59E0B] px-5 py-3 text-sm font-black uppercase tracking-wider text-[#0F172A] shadow-[0_4px_0_#0F172A] transition hover:-translate-y-0.5 active:translate-y-0 active:shadow-none focus:outline-none focus:ring-4 focus:ring-white/50 touch-manipulation sm:w-auto"
            >
              Start today&apos;s mission <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>

        <aside className="rounded-[24px] border-4 border-[#0F172A] bg-white p-6 shadow-[0_7px_0_#0F172A]">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.18em] text-[#475569]">Level 4</p>
              <h2 className="mt-1 text-2xl font-black">Curious mind</h2>
            </div>
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl border-2 border-[#0F172A] bg-[#EC4899] text-xl font-black text-white">★</span>
          </div>
          <div className="mt-7 flex items-end justify-between text-sm font-black">
            <span>{tokenAwards.reduce((total, token) => total + token.minutes, 0)} token minutes</span>
            <span className="text-[#475569]">400 to level 5</span>
          </div>
          <div className="mt-2 h-4 overflow-hidden rounded-full border-2 border-[#0F172A] bg-[#F1F5FD]" aria-label="80 percent progress">
            <div className="h-full w-4/5 rounded-full bg-[#EC4899]" />
          </div>
          <p className="mt-4 text-sm font-bold leading-relaxed text-[#475569]">{minutesRemaining ? `${minutesRemaining} minutes left before your next token expires.` : "Complete an approved action to earn screen-time tokens."}</p>
        </aside>
      </section>

      <section>
        <div className="mb-3 flex items-end justify-between gap-3">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.18em] text-[#2563EB]">Choose your next move</p>
            <h2 className="mt-1 text-2xl font-black tracking-tight sm:text-3xl">Today&apos;s missions</h2>
            <p className="mt-1 text-xs font-bold text-[#475569] sm:hidden">Swipe to explore →</p>
          </div>
          <Link href="/kid/missions" className="min-h-[44px] inline-flex items-center rounded-lg px-3 py-2 text-xs font-black uppercase tracking-wider text-[#2563EB] underline underline-offset-4 focus:outline-none focus:ring-2 focus:ring-[#2563EB] touch-manipulation">See all</Link>
        </div>
        {/* Mobile: horizontal snap carousel. Desktop: 3-col grid. */}
        <div className="-mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-2 pt-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:mx-0 md:grid md:grid-cols-3 md:overflow-visible md:px-0">
          {KID_MISSIONS.map((mission) => {
            const isDone = Boolean(completions[mission.id]);
            return (
              <Link
                href={`/kid/missions/${mission.id}`}
                key={mission.id}
                className={`${mission.color} group w-[82%] shrink-0 snap-center rounded-[20px] border-4 border-[#0F172A] p-5 shadow-[0_5px_0_#0F172A] transition hover:-translate-y-1 active:translate-y-0 active:scale-[0.98] focus:outline-none focus:ring-4 focus:ring-[#2563EB]/30 touch-manipulation sm:w-[70%] md:w-auto`}
              >
                <div className="flex items-center justify-between">
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl border-2 border-[#0F172A] bg-white text-xl font-black" aria-hidden="true">{mission.icon}</span>
                  <span className="rounded-lg border-2 border-[#0F172A] bg-white px-2 py-1 text-[10px] font-black uppercase">{isDone ? "Done ✓" : mission.reward}</span>
                </div>
                <h3 className="mt-5 text-xl font-black leading-tight">{mission.title}</h3>
                <p className="mt-2 text-sm font-bold leading-relaxed text-[#0F172A]/70">{mission.detail}</p>
                <span className="mt-5 inline-flex min-h-[44px] items-center text-xs font-black uppercase tracking-wider underline underline-offset-4">Open mission →</span>
              </Link>
            );
          })}
        </div>
      </section>

      <section>
        <div className="mb-3">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-[#2563EB]">From your parent</p>
          <h2 className="mt-1 text-2xl font-black tracking-tight sm:text-3xl">Offline actions</h2>
        </div>
        {actions.length === 0 ? (
          <div className="rounded-[20px] border-4 border-dashed border-[#0F172A]/30 bg-white/70 p-6 text-sm font-bold text-[#475569]">
            No new actions yet. Check back when your parent adds one.
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {actions.map((action) => (
              <Link href={`/kid/actions/${action.id}`} key={action.id} className="block rounded-[20px] border-4 border-[#0F172A] bg-white p-5 shadow-[0_5px_0_#0F172A] transition hover:-translate-y-1 active:translate-y-0 active:scale-[0.99] focus:outline-none focus:ring-4 focus:ring-[#2563EB]/30 touch-manipulation">
                <div className="flex items-start justify-between gap-3">
                  <h3 className="text-xl font-black leading-tight">{action.name}</h3>
                  <span className="shrink-0 rounded-lg border-2 border-[#0F172A] bg-[#D0E6FD] px-2 py-1 text-[10px] font-black uppercase">{action.progress === "submitted" ? "In review" : "Assigned"}</span>
                </div>
                <p className="mt-3 text-sm font-bold leading-relaxed text-[#475569]">{action.description}</p>
                <div className="mt-4 rounded-xl border-2 border-[#0F172A]/20 bg-[#EFF6FF] p-3">
                  <p className="text-[10px] font-black uppercase tracking-wider text-[#475569]">How you finish it</p>
                  <p className="mt-1 text-sm font-black">{action.definitionOfDone}</p>
                </div>
                <span className="mt-4 inline-flex min-h-[44px] items-center text-xs font-black uppercase tracking-wider underline underline-offset-4">Open action →</span>
              </Link>
            ))}
          </div>
        )}
      </section>

      <section className="flex flex-col items-stretch justify-between gap-4 rounded-[20px] border-4 border-[#0F172A] bg-[#F59E0B] p-5 shadow-[0_5px_0_#0F172A] sm:flex-row sm:items-center">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.18em]">Need a teammate?</p>
          <h2 className="mt-1 text-xl font-black">Ask Compass anything about your day.</h2>
        </div>
        <Link href="/kid/chatbot" className="inline-flex min-h-[52px] items-center justify-center rounded-xl border-2 border-[#0F172A] bg-white px-4 py-3 text-xs font-black uppercase tracking-wider shadow-[0_3px_0_#0F172A] transition hover:-translate-y-0.5 active:translate-y-0 active:shadow-none focus:outline-none focus:ring-4 focus:ring-white/60 touch-manipulation">Chat with Compass</Link>
      </section>
    </div>
  );
}