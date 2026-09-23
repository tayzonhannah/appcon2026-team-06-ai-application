"use client";

import Link from "next/link";
import { useState } from "react";

const prompts = [
  "I feel stuck on my mission",
  "I made a mistake",
  "I need a calm-down idea",
  "I want to try again",
];

const replies: Record<string, string> = {
  "I feel stuck on my mission": "That happens to every learner. Try one tiny step, or ask what information is missing.",
  "I made a mistake": "A mistake is a clue, not a label. You can choose a new strategy and try one small part again.",
  "I need a calm-down idea": "Put both feet on the floor, breathe in slowly, and breathe out slowly three times.",
  "I want to try again": "That is a brave choice. Pick the easiest next step and notice what you learn.",
};

export default function KidChatbotPage() {
  const [selectedPrompt, setSelectedPrompt] = useState("");

  return (
    <div className="mx-auto w-full max-w-3xl py-2 sm:py-10">
      <Link href="/kid" className="inline-flex min-h-[44px] items-center rounded-lg px-3 py-2 text-xs font-black uppercase tracking-wider text-[#2563EB] underline underline-offset-4 focus:outline-none focus:ring-2 focus:ring-[#2563EB] touch-manipulation">
        ← Back to home
      </Link>
      <section className="mt-4 rounded-[24px] border-4 border-[#0F172A] bg-white p-5 shadow-[0_7px_0_#0F172A] sm:p-8">
        <div className="flex items-start gap-4 border-b-2 border-[#0F172A]/10 pb-5">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border-2 border-[#0F172A] bg-[#2563EB] text-2xl font-black text-white shadow-[0_3px_0_#0F172A]">C</div>
          <div>
            <p className="text-xs font-black uppercase tracking-[0.18em] text-[#2563EB]">Kid support</p>
            <h1 className="mt-1 text-3xl font-black tracking-tight">Compass</h1>
            <p className="mt-2 text-sm font-bold leading-relaxed text-[#475569]">A friendly place to pause, think, and choose your next small step.</p>
          </div>
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          {prompts.map((prompt) => (
            <button
              key={prompt}
              type="button"
              onClick={() => setSelectedPrompt(prompt)}
              aria-pressed={selectedPrompt === prompt}
              className={`min-h-[60px] rounded-2xl border-2 p-4 text-left text-[15px] font-black transition active:scale-[0.98] focus:outline-none focus:ring-4 focus:ring-[#2563EB]/25 touch-manipulation ${selectedPrompt === prompt ? "border-[#162660] bg-[#D0E6FD] shadow-[0_3px_0_#162660]" : "border-[#0F172A]/25 bg-[#EFF6FF] hover:border-[#2563EB] active:border-[#2563EB]"}`}
            >
              {prompt}
            </button>
          ))}
        </div>

        <div className="mt-6 min-h-28 rounded-2xl border-2 border-[#0F172A]/20 bg-[#F8F1E5] p-5">
          {selectedPrompt ? (
            <>
              <p className="text-xs font-black uppercase tracking-wider text-[#475569]">Compass says</p>
              <p className="mt-2 text-base font-black leading-relaxed text-[#0F172A]">{replies[selectedPrompt]}</p>
            </>
          ) : (
            <p className="text-sm font-bold leading-relaxed text-[#475569]">Choose a prompt to get a gentle idea. Compass does not judge or grade you.</p>
          )}
        </div>

        <div className="mt-6 rounded-2xl border-2 border-[#0F172A] bg-[#FDE68A] p-4 text-sm font-bold leading-relaxed">
          Need help from a grown-up? Tell your parent or another trusted adult what is going on.
        </div>
      </section>
    </div>
  );
}
