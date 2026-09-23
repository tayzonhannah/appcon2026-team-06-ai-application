"use client";

import Link from "next/link";
import { useState } from "react";
import { COMPASS_FLOW, nextNode } from "@/lib/constants/compass-flow";
import { detectEmotionNudge } from "@/lib/constants/emotions";
import EmotionNudge from "@/components/emotion-nudge";

export default function KidChatbotPage() {
  const [nodeId, setNodeId] = useState("start");
  const [trail, setTrail] = useState<string[]>(["start"]);
  const [feeling, setFeeling] = useState("");
  const [nudge, setNudge] = useState<{ emotion: string; message: string } | null>(null);
  const node = COMPASS_FLOW[nodeId] ?? COMPASS_FLOW.start;

  const choose = (choiceId: string) => {
    const next = nextNode(nodeId, choiceId);
    setNodeId(next.id);
    setTrail((t) => [...t, next.id]);
  };

  const goBack = () => {
    if (trail.length <= 1) return;
    const prev = trail.slice(0, -1);
    setTrail(prev);
    setNodeId(prev[prev.length - 1]);
  };

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
            <p className="mt-2 text-sm font-bold leading-relaxed text-[#475569]">A friendly place to pause, think, and choose your next small step. Compass asks — you decide.</p>
          </div>
        </div>

        <div className="mt-6 rounded-2xl border-2 border-[#0F172A]/20 bg-[#F8F1E5] p-5" aria-live="polite">
          <p className="text-xs font-black uppercase tracking-wider text-[#475569]">Compass asks</p>
          <p className="mt-2 text-base font-black leading-relaxed text-[#0F172A]">{node.prompt}</p>
          {node.support ? (
            <p className="mt-2 text-sm font-bold leading-relaxed text-[#475569]">{node.support}</p>
          ) : null}
        </div>

        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {node.choices.map((choice) => (
            <button
              key={choice.id}
              type="button"
              onClick={() => choose(choice.id)}
              className="min-h-[60px] rounded-2xl border-2 border-[#0F172A]/25 bg-[#EFF6FF] p-4 text-left text-[15px] font-black transition hover:border-[#2563EB] active:scale-[0.98] active:border-[#2563EB] focus:outline-none focus:ring-4 focus:ring-[#2563EB]/25 touch-manipulation"
            >
              {choice.label}
            </button>
          ))}
        </div>

        <div className="mt-4 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={goBack}
            disabled={trail.length <= 1}
            className="inline-flex min-h-[44px] items-center rounded-lg px-3 py-2 text-xs font-black uppercase tracking-wider text-[#2563EB] underline underline-offset-4 disabled:opacity-40 touch-manipulation"
          >
            ← Back one step
          </button>
          <button
            type="button"
            onClick={() => {
              setNodeId("start");
              setTrail(["start"]);
            }}
            className="inline-flex min-h-[44px] items-center rounded-lg px-3 py-2 text-xs font-black uppercase tracking-wider text-[#475569] underline underline-offset-4 touch-manipulation"
          >
            Restart
          </button>
        </div>

        <form
          className="mt-6 rounded-2xl border-2 border-[#0F172A]/20 bg-[#EFF6FF] p-4"
          onSubmit={(e) => {
            e.preventDefault();
            const found = detectEmotionNudge(feeling);
            setNudge(found);
            if (found && typeof window !== "undefined" && "Notification" in window && Notification.permission === "granted") {
              try {
                new Notification("Compass nudge", { body: found.message });
              } catch {
                /* demo-safe: ignore if notifications blocked */
              }
            }
          }}
        >
          <label htmlFor="feeling-input" className="block text-xs font-black uppercase tracking-wider text-[#475569]">
            Share how you feel (early-feelings check)
          </label>
          <div className="mt-2 flex flex-col gap-2 sm:flex-row">
            <input
              id="feeling-input"
              value={feeling}
              onChange={(e) => setFeeling(e.target.value)}
              placeholder="e.g. I feel sad about my mission"
              className="min-h-[48px] flex-1 rounded-xl border-2 border-[#0F172A]/30 bg-white px-4 py-2.5 text-base font-bold outline-none focus:border-[#2563EB]"
              style={{ fontSize: "16px" }}
            />
            <button type="submit" className="inline-flex min-h-[48px] items-center justify-center rounded-xl border-2 border-[#0F172A] bg-[#2563EB] px-4 py-2.5 text-xs font-black uppercase tracking-wider text-white shadow-[0_3px_0_#0F172A] touch-manipulation">
              Check in
            </button>
          </div>
          <button
            type="button"
            onClick={() => {
              if (typeof window !== "undefined" && "Notification" in window) {
                Notification.requestPermission().catch(() => {});
              }
            }}
            className="mt-2 text-xs font-black uppercase tracking-wider text-[#2563EB] underline underline-offset-4 touch-manipulation"
          >
            Enable gentle reminders
          </button>
        </form>

        {nudge ? (
          <div className="mt-4">
            <EmotionNudge title={`Noticing: ${nudge.emotion}`} message={nudge.message} onDismiss={() => setNudge(null)} />
          </div>
        ) : null}

        <div className="mt-4 rounded-2xl border-2 border-[#0F172A] bg-[#FDE68A] p-4 text-sm font-bold leading-relaxed">
          Need help from a grown-up? Tell your parent or another trusted adult what is going on.
        </div>
      </section>
    </div>
  );
}
