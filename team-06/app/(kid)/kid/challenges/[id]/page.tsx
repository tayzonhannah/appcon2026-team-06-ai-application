"use client";

import Link from "next/link";
import { FormEvent, useState, useSyncExternalStore } from "react";
import { useParams } from "next/navigation";
import {
  readChallenges,
  submitChallenge,
  subscribeToChallenges,
  type KidChallenge,
} from "@/lib/challenge-store";

const SERVER_SNAPSHOT: KidChallenge[] = [];
function getServerSnapshot() {
  return SERVER_SNAPSHOT;
}

export default function KidChallengeDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [checked, setChecked] = useState<boolean[]>([]);
  const [report, setReport] = useState("");
  const challenges = useSyncExternalStore(subscribeToChallenges, readChallenges, getServerSnapshot);
  const challenge = challenges.find((c) => c.id === id && c.childId === "kid-101");

  if (!challenge) {
    return (
      <div className="mx-auto w-full max-w-2xl py-10">
        <div className="rounded-[24px] border-4 border-[#0F172A] bg-white p-8 text-center shadow-[0_7px_0_#0F172A]">
          <h1 className="text-3xl font-black">Challenge not found</h1>
          <Link href="/kid/challenges" className="mt-6 inline-flex rounded-xl border-2 border-[#0F172A] bg-[#F59E0B] px-4 py-3 text-xs font-black uppercase shadow-[0_3px_0_#0F172A]">Back to challenges</Link>
        </div>
      </div>
    );
  }

  const steps = challenge.milestones;
  const withDefaults = steps.map((_, i) => checked[i] ?? false);
  const allChecked = withDefaults.length > 0 && withDefaults.every(Boolean);
  const isSubmitted = challenge.progress === "submitted";
  const isApproved = challenge.progress === "approved";

  const toggle = (index: number) => {
    if (isSubmitted || isApproved) return;
    setChecked(() => {
      const next = [...withDefaults];
      next[index] = !next[index];
      return next;
    });
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    submitChallenge(challenge.id, report);
  };

  return (
    <div className="mx-auto w-full max-w-3xl py-2 sm:py-10">
      <Link href="/kid/challenges" className="inline-flex min-h-[44px] items-center rounded-lg px-3 py-2 text-xs font-black uppercase tracking-wider text-[#2563EB] underline underline-offset-4 touch-manipulation">
        ← All challenges
      </Link>
      <div className="mt-4 rounded-[24px] border-4 border-[#0F172A] bg-white p-5 shadow-[0_7px_0_#0F172A] sm:p-8">
        <p className="text-xs font-black uppercase tracking-[0.18em] text-[#2563EB]">Self-paced project • +{challenge.minutes} min</p>
        <h1 className="mt-1 text-2xl font-black sm:text-4xl">{challenge.title}</h1>
        <p className="mt-3 text-sm font-bold leading-relaxed text-[#475569]">{challenge.description}</p>

        <div className="mt-6 rounded-2xl border-2 border-[#0F172A]/20 bg-[#EFF6FF] p-4">
          <p className="text-[10px] font-black uppercase tracking-wider text-[#475569]">Milestones — tap when done</p>
          <ol className="mt-3 flex flex-col gap-2.5">
            {steps.map((step, index) => {
              const done = withDefaults[index] || isSubmitted || isApproved;
              return (
                <li key={`${step}-${index}`}>
                  <button
                    type="button"
                    onClick={() => toggle(index)}
                    disabled={isSubmitted || isApproved}
                    aria-pressed={done}
                    className={`flex min-h-[56px] w-full items-center gap-3 rounded-xl border-2 px-3 py-3 text-left text-[15px] font-bold touch-manipulation ${done ? "border-[#0F172A] bg-[#B7E4C7]" : "border-[#0F172A]/20 bg-white"}`}
                  >
                    <span className={`flex h-9 w-9 items-center justify-center rounded-lg border-2 border-[#0F172A] text-base font-black ${done ? "bg-[#0F172A] text-white" : "bg-white"}`} aria-hidden="true">
                      {done ? "✓" : index + 1}
                    </span>
                    <span className={done ? "line-through opacity-70" : ""}>{step}</span>
                  </button>
                </li>
              );
            })}
          </ol>
        </div>

        {isApproved ? (
          <div className="mt-6 rounded-2xl border-2 border-[#0F172A] bg-[#B7E4C7] p-5">
            <p className="text-sm font-black">Approved — +{challenge.minutes} min added to your balance.</p>
            <Link href="/kid/rewards" className="mt-3 inline-flex min-h-[48px] items-center justify-center rounded-xl border-2 border-[#0F172A] bg-white px-4 py-2.5 text-xs font-black uppercase tracking-wider shadow-[0_3px_0_#0F172A] touch-manipulation">See my minutes →</Link>
          </div>
        ) : isSubmitted ? (
          <div className="mt-6 rounded-2xl border-2 border-[#0F172A] bg-[#D0E6FD] p-5 text-sm font-black">
            Sent! Your parent is reviewing your report. Stuck? <Link href="/kid/chatbot" className="underline underline-offset-4">Ask Compass for an idea</Link>.
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-6 rounded-2xl border-2 border-[#0F172A]/20 bg-[#F8F1E5] p-4">
            <label htmlFor="challenge-report" className="block text-xs font-black uppercase tracking-wider">My report — what did you finish?</label>
            <textarea
              id="challenge-report"
              value={report}
              onChange={(e) => setReport(e.target.value)}
              rows={4}
              placeholder="Tell your parent which milestones you finished and what was hard (optional)"
              className="mt-2 min-h-[96px] w-full resize-y rounded-xl border-2 border-[#0F172A]/30 bg-white px-4 py-3 text-base font-bold outline-none focus:border-[#2563EB]"
              style={{ fontSize: "16px" }}
            />
            <button
              type="submit"
              disabled={!allChecked}
              className="mt-4 min-h-[56px] w-full rounded-xl border-2 border-[#0F172A] bg-[#EC4899] px-4 py-3 text-xs font-black uppercase tracking-wider text-white shadow-[0_3px_0_#0F172A] disabled:opacity-50 touch-manipulation"
            >
              {allChecked ? "Send report for parent review" : "Finish all milestones to send"}
            </button>
            {challenge.feedback ? (
              <div className="mt-4 rounded-xl border-2 border-[#0F172A] bg-[#FDE68A] p-4" aria-live="polite">
                <p className="text-[10px] font-black uppercase tracking-wider text-[#475569]">Parent says — try again</p>
                <p className="mt-2 text-sm font-black">“{challenge.feedback}”</p>
              </div>
            ) : null}
          </form>
        )}
      </div>
    </div>
  );
}
