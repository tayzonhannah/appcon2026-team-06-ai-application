"use client";

import Link from "next/link";
import { useState, useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";
import {
  readChallenges,
  saveChallenge,
  subscribeToChallenges,
  type KidChallenge,
} from "@/lib/challenge-store";

const SERVER_SNAPSHOT: KidChallenge[] = [];
function getServerSnapshot() {
  return SERVER_SNAPSHOT;
}

/** Simple uid for demo purposes */
function makeId() {
  return `kid-challenge-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

export default function KidChallengesPage() {
  const router = useRouter();
  const challenges = useSyncExternalStore(
    subscribeToChallenges,
    readChallenges,
    getServerSnapshot,
  ).filter((c) => c.childId === "kid-101" && c.progress !== "approved");

  /* ── Create form state ── */
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [milestones, setMilestones] = useState(["", "", ""]);
  const [timeline, setTimeline] = useState("");
  const [minutes, setMinutes] = useState(20);
  const [submitting, setSubmitting] = useState(false);

  const updateMilestone = (index: number, value: string) => {
    setMilestones((prev) => prev.map((m, i) => (i === index ? value : m)));
  };

  const addMilestone = () => {
    if (milestones.length < 4) setMilestones((prev) => [...prev, ""]);
  };

  const removeMilestone = (index: number) => {
    if (milestones.length <= 1) return;
    setMilestones((prev) => prev.filter((_, i) => i !== index));
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanMilestones = milestones.map((m) => m.trim()).filter(Boolean);
    if (!title.trim() || cleanMilestones.length === 0) return;

    setSubmitting(true);
    const newChallenge: KidChallenge = {
      id: makeId(),
      childId: "kid-101",
      title: title.trim(),
      description: description.trim() || "A self-paced project I designed myself.",
      milestones: cleanMilestones,
      timeline: timeline.trim() || "This week",
      minutes,
      status: "active",
      progress: "assigned",
      createdAt: new Date().toISOString(),
    };

    saveChallenge(newChallenge);

    // Reset form
    setTitle("");
    setDescription("");
    setMilestones(["", "", ""]);
    setTimeline("");
    setMinutes(20);
    setShowForm(false);
    setSubmitting(false);

    router.push(`/kid/challenges/${newChallenge.id}`);
  };

  return (
    <div className="mx-auto w-full max-w-5xl py-2 sm:py-10">
      <Link
        href="/kid"
        className="inline-flex min-h-[44px] items-center rounded-lg px-3 py-2 text-xs font-black uppercase tracking-wider text-[#2563EB] underline underline-offset-4 touch-manipulation"
      >
        ← Back to home
      </Link>

      {/* Page header */}
      <div className="mt-4 flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.18em] text-[#2563EB]">Self-sufficiency • self-paced</p>
          <h1 className="mt-1 text-3xl font-black tracking-tight sm:text-4xl">My challenges</h1>
          <p className="mt-2 max-w-2xl text-[15px] font-bold leading-relaxed text-[#475569]">
            Build your own project step by step. Finish milestones, send a report, earn minutes.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setShowForm((v) => !v)}
          className="shrink-0 inline-flex min-h-[48px] items-center gap-2 rounded-xl border-2 border-[#0F172A] bg-[#F59E0B] px-4 py-2.5 text-xs font-black uppercase tracking-wider shadow-[0_3px_0_#0F172A] transition hover:-translate-y-0.5 active:translate-y-0 active:shadow-none touch-manipulation"
        >
          <span aria-hidden="true" className="text-base">＋</span>
          Create my own challenge
        </button>
      </div>

      {/* ── Create-your-own challenge form ── */}
      {showForm && (
        <form
          onSubmit={handleCreate}
          className="mt-6 rounded-[22px] border-4 border-[#0F172A] bg-white p-5 shadow-[0_6px_0_#0F172A] sm:p-7"
        >
          {/* Form header */}
          <div className="flex items-center gap-3 border-b-2 border-[#0F172A]/10 pb-4">
            <span
              className="flex h-11 w-11 items-center justify-center rounded-xl border-2 border-[#0F172A] bg-[#F59E0B] text-xl font-black"
              aria-hidden="true"
            >
              ✦
            </span>
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[#2563EB]">Design your project</p>
              <h2 className="text-xl font-black leading-tight">New challenge</h2>
            </div>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="ml-auto flex h-8 w-8 items-center justify-center rounded-lg border-2 border-[#0F172A]/20 bg-[#F8F1E5] text-sm font-black text-[#475569] hover:bg-[#FDE68A] touch-manipulation"
              aria-label="Close form"
            >
              ✕
            </button>
          </div>

          <div className="mt-5 flex flex-col gap-4">
            {/* Title */}
            <div>
              <label htmlFor="challenge-title" className="block text-[10px] font-black uppercase tracking-wider text-[#475569]">
                Challenge name <span className="text-[#EC4899]">*</span>
              </label>
              <input
                id="challenge-title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                placeholder="e.g. Read 5 books this month"
                className="mt-1.5 min-h-[48px] w-full rounded-xl border-2 border-[#0F172A]/25 bg-[#F8F1E5] px-4 py-2.5 text-base font-bold outline-none focus:border-[#2563EB] focus:ring-4 focus:ring-[#2563EB]/15"
                style={{ fontSize: "16px" }}
              />
            </div>

            {/* Description */}
            <div>
              <label htmlFor="challenge-description" className="block text-[10px] font-black uppercase tracking-wider text-[#475569]">
                What is this challenge about?
              </label>
              <textarea
                id="challenge-description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={2}
                placeholder="Describe your challenge in a sentence or two (optional)"
                className="mt-1.5 w-full resize-y rounded-xl border-2 border-[#0F172A]/25 bg-[#F8F1E5] px-4 py-2.5 text-base font-bold outline-none focus:border-[#2563EB] focus:ring-4 focus:ring-[#2563EB]/15"
                style={{ fontSize: "16px" }}
              />
            </div>

            {/* Milestones */}
            <div>
              <div className="flex items-center justify-between">
                <label className="block text-[10px] font-black uppercase tracking-wider text-[#475569]">
                  Milestones — steps to complete <span className="text-[#EC4899]">*</span>
                </label>
                {milestones.length < 4 && (
                  <button
                    type="button"
                    onClick={addMilestone}
                    className="text-[10px] font-black uppercase tracking-wider text-[#2563EB] underline underline-offset-4 touch-manipulation"
                  >
                    + Add step
                  </button>
                )}
              </div>
              <div className="mt-2 flex flex-col gap-2">
                {milestones.map((m, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border-2 border-[#0F172A]/20 bg-[#EFF6FF] text-xs font-black text-[#2563EB]">
                      {i + 1}
                    </span>
                    <input
                      type="text"
                      value={m}
                      onChange={(e) => updateMilestone(i, e.target.value)}
                      placeholder={`Step ${i + 1}`}
                      className="min-h-[44px] flex-1 rounded-xl border-2 border-[#0F172A]/25 bg-[#F8F1E5] px-3 py-2 text-sm font-bold outline-none focus:border-[#2563EB]"
                      style={{ fontSize: "16px" }}
                    />
                    {milestones.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeMilestone(i)}
                        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border-2 border-[#0F172A]/10 bg-[#F8F1E5] text-xs text-[#475569] hover:bg-[#FDE68A] touch-manipulation"
                        aria-label={`Remove step ${i + 1}`}
                      >
                        ✕
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {/* Timeline */}
              <div>
                <label htmlFor="challenge-timeline" className="block text-[10px] font-black uppercase tracking-wider text-[#475569]">
                  Timeline
                </label>
                <input
                  id="challenge-timeline"
                  type="text"
                  value={timeline}
                  onChange={(e) => setTimeline(e.target.value)}
                  placeholder="e.g. This week, 2 weeks"
                  className="mt-1.5 min-h-[48px] w-full rounded-xl border-2 border-[#0F172A]/25 bg-[#F8F1E5] px-4 py-2.5 text-sm font-bold outline-none focus:border-[#2563EB]"
                  style={{ fontSize: "16px" }}
                />
              </div>

              {/* Minutes requested */}
              <div>
                <label htmlFor="challenge-minutes" className="block text-[10px] font-black uppercase tracking-wider text-[#475569]">
                  Screen time I&apos;m asking for (min)
                </label>
                <div className="mt-1.5 flex items-center gap-3">
                  <input
                    id="challenge-minutes"
                    type="range"
                    min={5}
                    max={60}
                    step={5}
                    value={minutes}
                    onChange={(e) => setMinutes(Number(e.target.value))}
                    className="flex-1 accent-[#2563EB]"
                  />
                  <span className="w-14 shrink-0 rounded-xl border-2 border-[#0F172A]/20 bg-[#EFF6FF] px-2 py-1.5 text-center text-sm font-black tabular-nums text-[#2563EB]">
                    {minutes} min
                  </span>
                </div>
                <p className="mt-1 text-[10px] font-bold text-[#475569]">Your parent will approve the final amount.</p>
              </div>
            </div>
          </div>

          {/* Submit */}
          <div className="mt-6 flex flex-col gap-2 sm:flex-row">
            <button
              type="submit"
              disabled={submitting || !title.trim()}
              className="flex-1 min-h-[56px] rounded-xl border-2 border-[#0F172A] bg-[#2563EB] px-4 py-3 text-sm font-black uppercase tracking-wider text-white shadow-[0_4px_0_#0F172A] transition hover:-translate-y-0.5 active:translate-y-0 active:shadow-none disabled:opacity-50 touch-manipulation"
            >
              {submitting ? "Creating…" : "Create my challenge →"}
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="min-h-[56px] rounded-xl border-2 border-[#0F172A]/20 bg-[#F8F1E5] px-5 py-3 text-sm font-black uppercase text-[#475569] hover:bg-[#FDE68A] touch-manipulation"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Existing challenges list */}
      {challenges.length === 0 && !showForm ? (
        <div className="mt-6 rounded-[20px] border-4 border-dashed border-[#0F172A]/30 bg-white/70 p-8 text-center">
          <p className="text-base font-black text-[#0F172A]">No challenges yet.</p>
          <p className="mt-1 text-sm font-bold text-[#475569]">Create your own above, or ask your parent to assign one from the dashboard.</p>
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
                className="mt-4 flex min-h-[52px] w-full items-center justify-center rounded-xl border-2 border-[#0F172A] bg-[#F59E0B] px-4 py-3 text-center text-xs font-black uppercase tracking-wider shadow-[0_3px_0_#0F172A] transition hover:-translate-y-0.5 active:translate-y-0 active:shadow-none touch-manipulation"
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
