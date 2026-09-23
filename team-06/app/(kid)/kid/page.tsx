"use client";

import Link from "next/link";
import { useSyncExternalStore } from "react";
import {
  readGrowthActions,
  submitGrowthAction,
  subscribeToGrowthActions,
} from "@/lib/growth-store";

const missions = [
  {
    title: "Build a calm corner",
    detail: "Make a cozy spot where your brain can reset.",
    reward: "+20 stars",
    color: "bg-[#D0E6FD]",
    icon: "✦",
  },
  {
    title: "Notice one good thing",
    detail: "Find a tiny win from today and write it down.",
    reward: "+15 stars",
    color: "bg-[#FDE68A]",
    icon: "●",
  },
  {
    title: "Take a brave pause",
    detail: "Try three slow breaths before your next task.",
    reward: "+10 stars",
    color: "bg-[#FBCFE8]",
    icon: "~",
  },
];

export default function KidHomePage() {
  const actions = useSyncExternalStore(
    subscribeToGrowthActions,
    readGrowthActions,
    () => [],
  ).filter((action) => action.childId === "kid-101" && action.status === "active");

  return (
    <div className="my-auto space-y-6">
      <section className="grid gap-5 lg:grid-cols-[1.25fr_0.75fr]">
        <div className="relative overflow-hidden rounded-[24px] border-4 border-[#0F172A] bg-[#2563EB] p-6 text-white shadow-[0_7px_0_#0F172A] sm:p-8">
          <div className="absolute -right-8 -top-10 h-36 w-36 rounded-full border-4 border-[#0F172A]/15 bg-[#60A5FA]" />
          <div className="relative">
            <p className="mb-2 text-xs font-black uppercase tracking-[0.2em] text-[#DBEAFE]">Your learning lab</p>
            <h1 className="max-w-xl text-4xl font-black leading-[0.95] tracking-tight sm:text-5xl">
              Hey, Kai. Ready for one small win?
            </h1>
            <p className="mt-4 max-w-lg text-base font-bold leading-relaxed text-[#EFF6FF]">
              Your choices build your adventure. Pick a mission, earn stars, and keep your streak moving.
            </p>
            <Link
              href="/challenge"
              className="mt-6 inline-flex items-center gap-2 rounded-xl border-2 border-[#0F172A] bg-[#F59E0B] px-5 py-3 text-sm font-black uppercase tracking-wider text-[#0F172A] shadow-[0_4px_0_#0F172A] transition hover:-translate-y-0.5 focus:outline-none focus:ring-4 focus:ring-white/50"
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
            <span>320 stars</span>
            <span className="text-[#475569]">400 to level 5</span>
          </div>
          <div className="mt-2 h-4 overflow-hidden rounded-full border-2 border-[#0F172A] bg-[#F1F5FD]" aria-label="80 percent progress">
            <div className="h-full w-4/5 rounded-full bg-[#EC4899]" />
          </div>
          <p className="mt-4 text-sm font-bold leading-relaxed text-[#475569]">You are 80% of the way there. Nice work showing up.</p>
        </aside>
      </section>

      <section>
        <div className="mb-3 flex items-end justify-between gap-3">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.18em] text-[#2563EB]">Choose your next move</p>
            <h2 className="mt-1 text-2xl font-black tracking-tight sm:text-3xl">Today&apos;s missions</h2>
          </div>
          <Link href="/challenge" className="text-xs font-black uppercase tracking-wider text-[#2563EB] underline underline-offset-4 focus:outline-none focus:ring-2 focus:ring-[#2563EB]">See all</Link>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {missions.map((mission) => (
            <Link
              href="/challenge"
              key={mission.title}
              className={`${mission.color} group rounded-[20px] border-4 border-[#0F172A] p-5 shadow-[0_5px_0_#0F172A] transition hover:-translate-y-1 focus:outline-none focus:ring-4 focus:ring-[#2563EB]/30`}
            >
              <div className="flex items-center justify-between">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl border-2 border-[#0F172A] bg-white text-xl font-black" aria-hidden="true">{mission.icon}</span>
                <span className="rounded-lg border-2 border-[#0F172A] bg-white px-2 py-1 text-[10px] font-black uppercase">{mission.reward}</span>
              </div>
              <h3 className="mt-5 text-xl font-black leading-tight">{mission.title}</h3>
              <p className="mt-2 text-sm font-bold leading-relaxed text-[#0F172A]/70">{mission.detail}</p>
              <span className="mt-5 inline-block text-xs font-black uppercase tracking-wider underline underline-offset-4">Open mission →</span>
            </Link>
          ))}
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
              <article key={action.id} className="rounded-[20px] border-4 border-[#0F172A] bg-white p-5 shadow-[0_5px_0_#0F172A]">
                <div className="flex items-start justify-between gap-3">
                  <h3 className="text-xl font-black leading-tight">{action.name}</h3>
                  <span className="shrink-0 rounded-lg border-2 border-[#0F172A] bg-[#D0E6FD] px-2 py-1 text-[10px] font-black uppercase">Assigned</span>
                </div>
                <p className="mt-3 text-sm font-bold leading-relaxed text-[#475569]">{action.description}</p>
                <div className="mt-4 rounded-xl border-2 border-[#0F172A]/20 bg-[#EFF6FF] p-3">
                  <p className="text-[10px] font-black uppercase tracking-wider text-[#475569]">How you finish it</p>
                  <p className="mt-1 text-sm font-black">{action.definitionOfDone}</p>
                </div>
                <button
                  type="button"
                  onClick={() => submitGrowthAction(action.id)}
                  className="mt-4 w-full rounded-xl border-2 border-[#0F172A] bg-[#EC4899] px-4 py-3 text-xs font-black uppercase tracking-wider text-white shadow-[0_3px_0_#0F172A] transition hover:-translate-y-0.5 focus:outline-none focus:ring-4 focus:ring-[#EC4899]/30"
                >
                  Submit for parent review
                </button>
              </article>
            ))}
          </div>
        )}
      </section>

      <section className="flex flex-col items-start justify-between gap-4 rounded-[20px] border-4 border-[#0F172A] bg-[#F59E0B] p-5 shadow-[0_5px_0_#0F172A] sm:flex-row sm:items-center">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.18em]">Need a teammate?</p>
          <h2 className="mt-1 text-xl font-black">Ask Compass anything about your day.</h2>
        </div>
        <Link href="/chatbot" className="rounded-xl border-2 border-[#0F172A] bg-white px-4 py-3 text-xs font-black uppercase tracking-wider shadow-[0_3px_0_#0F172A] transition hover:-translate-y-0.5 focus:outline-none focus:ring-4 focus:ring-white/60">Chat with Compass</Link>
      </section>
    </div>
  );
}