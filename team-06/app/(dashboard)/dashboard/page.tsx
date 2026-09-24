"use client";

import { useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { ChildDropdown } from "@/components/child-dropdown";
import { useChildProfiles, getAgeCap } from "@/lib/hooks/useChildProfiles";
import {
  approveGrowthAction,
  readGrowthActions,
  rejectGrowthAction,
  subscribeToGrowthActions,
  type GrowthAction,
} from "@/lib/growth-store";
import {
  approveChallenge,
  readChallenges,
  rejectChallenge,
  subscribeToChallenges,
  type KidChallenge,
} from "@/lib/challenge-store";

const SERVER_ACTIONS_SNAPSHOT: GrowthAction[] = [];
const SERVER_CHALLENGES_SNAPSHOT: KidChallenge[] = [];

function getServerActionsSnapshot() {
  return SERVER_ACTIONS_SNAPSHOT;
}

function getServerChallengesSnapshot() {
  return SERVER_CHALLENGES_SNAPSHOT;
}

function SubmittedActionRow({
  actionId,
  name,
  definitionOfDone,
  completionNote,
}: {
  actionId: string;
  name: string;
  definitionOfDone: string;
  completionNote?: string;
}) {
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedback, setFeedback] = useState("");

  return (
    <div className="flex flex-col gap-3 rounded-xl border-2 border-[#4A3B2C]/25 bg-[#F8F1E5] p-3">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="font-black text-[#162660]">{name}</h3>
          <p className="mt-1 text-xs font-bold text-[#162660]/65">{definitionOfDone}</p>
          {completionNote ? (
            <p className="mt-2 rounded-lg border border-[#4A3B2C]/20 bg-white p-2 text-xs font-bold text-[#162660]">
              Kid: &ldquo;{completionNote}&rdquo;
            </p>
          ) : null}
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setShowFeedback((v) => !v)}
            className="rounded-lg border-2 border-[#4A3B2C] bg-white px-3 py-2 text-[10px] font-black uppercase text-[#162660] transition hover:bg-[#F1E4D1]"
          >
            Needs work
          </button>
          <button
            type="button"
            onClick={() => approveGrowthAction(actionId)}
            className="rounded-lg border-2 border-[#162660] bg-[#B7E4C7] px-3 py-2 text-[10px] font-black uppercase text-[#162660] shadow-[0_2px_0_#162660] transition hover:-translate-y-0.5"
          >
            Approve +15m
          </button>
        </div>
      </div>
      {showFeedback ? (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            rejectGrowthAction(actionId, feedback || "Try one more time — almost there.");
            setShowFeedback(false);
            setFeedback("");
          }}
          className="flex flex-col gap-2 rounded-lg border-2 border-[#4A3B2C]/20 bg-white p-2.5"
        >
          <label
            htmlFor={`feedback-${actionId}`}
            className="text-[10px] font-black uppercase tracking-wider text-[#162660]/60"
          >
            What should the kid try again?
          </label>
          <input
            id={`feedback-${actionId}`}
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            placeholder="e.g. Add one more calm minute and tell me how it felt"
            className="w-full rounded-lg border-2 border-[#4A3B2C]/30 px-3 py-2 text-xs font-bold outline-none focus:border-[#162660]"
          />
          <button
            type="submit"
            className="rounded-lg border-2 border-[#4A3B2C] bg-[#F1E4D1] px-3 py-2 text-[10px] font-black uppercase text-[#162660]"
          >
            Send back to kid
          </button>
        </form>
      ) : null}
    </div>
  );
}

function SubmittedChallengeRow({
  challengeId,
  title,
  minutes,
  report,
}: {
  challengeId: string;
  title: string;
  minutes: number;
  report?: string;
}) {
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedback, setFeedback] = useState("");

  return (
    <div className="flex flex-col gap-3 rounded-xl border-2 border-[#4A3B2C]/25 bg-[#F8F1E5] p-3">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="font-black text-[#162660]">{title}</h3>
          <p className="mt-1 text-xs font-bold text-[#162660]/65">
            Self-paced challenge • +{minutes} min on approval
          </p>
          {report ? (
            <p className="mt-2 rounded-lg border border-[#4A3B2C]/20 bg-white p-2 text-xs font-bold text-[#162660]">
              Kid report: &ldquo;{report}&rdquo;
            </p>
          ) : null}
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setShowFeedback((v) => !v)}
            className="rounded-lg border-2 border-[#4A3B2C] bg-white px-3 py-2 text-[10px] font-black uppercase text-[#162660] transition hover:bg-[#F1E4D1]"
          >
            Needs work
          </button>
          <button
            type="button"
            onClick={() => approveChallenge(challengeId)}
            className="rounded-lg border-2 border-[#162660] bg-[#B7E4C7] px-3 py-2 text-[10px] font-black uppercase text-[#162660] shadow-[0_2px_0_#162660] transition hover:-translate-y-0.5"
          >
            Approve +{minutes}m
          </button>
        </div>
      </div>
      {showFeedback ? (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            rejectChallenge(challengeId, feedback || "Add one more detail and resend your report.");
            setShowFeedback(false);
            setFeedback("");
          }}
          className="flex flex-col gap-2 rounded-lg border-2 border-[#4A3B2C]/20 bg-white p-2.5"
        >
          <label
            htmlFor={`challenge-feedback-${challengeId}`}
            className="text-[10px] font-black uppercase tracking-wider text-[#162660]/60"
          >
            What should the kid add?
          </label>
          <input
            id={`challenge-feedback-${challengeId}`}
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            placeholder="e.g. Tell me which milestone was hardest"
            className="w-full rounded-lg border-2 border-[#4A3B2C]/30 px-3 py-2 text-xs font-bold outline-none focus:border-[#162660]"
          />
          <button
            type="submit"
            className="rounded-lg border-2 border-[#4A3B2C] bg-[#F1E4D1] px-3 py-2 text-[10px] font-black uppercase text-[#162660]"
          >
            Send back to kid
          </button>
        </form>
      ) : null}
    </div>
  );
}

export default function DashboardPage() {
  const { children } = useChildProfiles();
  const [selectedChildId, setSelectedChildId] = useState(children[0]?.childId || "kid-101");

  const activeChild = children.find((c) => c.childId === selectedChildId) || children[0];
  const dailyCapMin = getAgeCap(activeChild?.profile?.age || 8);
  const dailyCapHours = (dailyCapMin / 60).toFixed(1);

  const usedPercentage = activeChild?.tokens?.earnedHours
    ? Math.min(
        100,
        Math.round((activeChild.tokens.usedHours / activeChild.tokens.earnedHours) * 100)
      )
    : 0;

  const submittedActions = useSyncExternalStore(
    subscribeToGrowthActions,
    readGrowthActions,
    getServerActionsSnapshot,
  ).filter((action) => action.childId === (activeChild?.childId || selectedChildId) && action.progress === "submitted");

  const submittedChallenges = useSyncExternalStore(
    subscribeToChallenges,
    readChallenges,
    getServerChallengesSnapshot,
  ).filter((challenge) => challenge.childId === (activeChild?.childId || selectedChildId) && challenge.progress === "submitted");

  return (
    <div className="flex flex-col gap-4 my-auto">
      {/* ── Page Header: Image 1 Style ── */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b-2 border-[#4A3B2C]/20 shrink-0">
        <div>
          <h1 className="text-2xl font-black text-[#162660] tracking-tight">
            Parent Overview
          </h1>
        </div>

        {activeChild && (
          <ChildDropdown
            childOptions={children}
            selected={activeChild}
            onSelect={(child) => setSelectedChildId(child.childId)}
          />
        )}
      </div>

      {/* ── Bento Box Grid Layout ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-4 items-stretch">

        {/* ── BENTO TILE 1: Child Growth & Focus Areas (lg:col-span-7) ── */}
        <div className="lg:col-span-7 aralkada-card p-5 flex flex-col justify-between gap-4">
          <div>
            {/* Top row with Avatar, Name, and Status */}
            <div className="flex items-center justify-between border-b border-[#4A3B2C]/15 pb-3">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-[#162660] text-[#F1E4D1] font-black text-lg flex items-center justify-center border-2 border-[#4A3B2C] shadow-[0_3px_0_#4A3B2C] shrink-0">
                  {activeChild?.avatarLetter}
                </div>
                <div>
                  <h2 className="font-black text-lg text-[#162660] leading-none">
                    {activeChild?.childName}&apos;s Growth Analytics
                  </h2>
                  <span className="text-[10px] font-bold text-[#162660]/70 uppercase tracking-wider mt-0.5 block">
                    Age {activeChild?.profile?.age} · {activeChild?.profile?.grade} · &quot;{activeChild?.profile?.personality}&quot;
                  </span>
                </div>
              </div>

              <div className="px-3 py-1 rounded-full bg-[#D0E6FD] border-2 border-[#162660] shadow-[0_2px_0_#162660] text-[9px] font-black text-[#162660] uppercase tracking-wider shrink-0">
                Live Tracking
              </div>
            </div>

            {/* Focus Area Section with dedicated header for clean alignment (Image 2 Fix) */}
            {activeChild?.profile?.focusAreas && activeChild.profile.focusAreas.length > 0 && (
              <div className="flex flex-col gap-1.5 mt-3">
                <span className="text-[9px] font-black text-[#162660]/50 uppercase tracking-widest">
                  Active Focus:
                </span>
                <div className="flex flex-wrap gap-1.5 items-center">
                  {activeChild.profile.focusAreas.slice(0, 3).map((area, idx) => (
                    <span
                      key={area}
                      className={`text-[9px] font-black border-2 rounded-full px-2.5 py-0.5 uppercase tracking-wide ${idx % 2 === 0
                          ? "bg-[#D0E6FD] text-[#162660] border-[#162660]"
                          : "bg-[#E8DAC4] text-[#162660] border-[#4A3B2C]"
                        }`}
                    >
                      {area}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Offline Actions & Challenges 2-Column Sub-grid */}
          <div className="grid grid-cols-2 gap-3 mt-1">
            {/* Actions Box */}
            <div className="rounded-2xl border-2 border-[#4A3B2C] bg-[#F8F1E5] p-3 shadow-[0_3px_0_#4A3B2C] flex flex-col justify-between">
              <span className="font-black text-[10px] text-[#162660] uppercase tracking-wider mb-2 block">
                Offline Actions
              </span>
              <div className="grid grid-cols-2 gap-2">
                <div className="rounded-xl bg-white border-2 border-[#4A3B2C]/25 p-2 text-center">
                  <span className="block text-[9px] font-bold text-[#162660]/60 uppercase">Ongoing</span>
                  <span className="text-lg font-black text-[#162660]">{activeChild?.actions?.ongoing ?? 0}</span>
                </div>
                <div className="rounded-xl bg-white border-2 border-[#4A3B2C]/25 p-2 text-center">
                  <span className="block text-[9px] font-bold text-[#162660]/60 uppercase">Done</span>
                  <span className="text-lg font-black text-[#162660]">{activeChild?.actions?.done ?? 0}</span>
                </div>
              </div>
            </div>

            {/* Challenges Box */}
            <div className="rounded-2xl border-2 border-[#4A3B2C] bg-[#F8F1E5] p-3 shadow-[0_3px_0_#4A3B2C] flex flex-col justify-between">
              <span className="font-black text-[10px] text-[#162660] uppercase tracking-wider mb-2 block">
                Challenges
              </span>
              <div className="grid grid-cols-2 gap-2">
                <div className="rounded-xl bg-white border-2 border-[#4A3B2C]/25 p-2 text-center">
                  <span className="block text-[9px] font-bold text-[#162660]/60 uppercase">Ongoing</span>
                  <span className="text-lg font-black text-[#162660]">{activeChild?.challenges?.ongoing ?? 0}</span>
                </div>
                <div className="rounded-xl bg-white border-2 border-[#4A3B2C]/25 p-2 text-center">
                  <span className="block text-[9px] font-bold text-[#162660]/60 uppercase">Done</span>
                  <span className="text-lg font-black text-[#162660]">{activeChild?.challenges?.done ?? 0}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── BENTO TILE 2: Earned Screen Time & Daily Health Cap (lg:col-span-5) ── */}
        <div className="lg:col-span-5 aralkada-card p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between border-b-2 border-[#4A3B2C]/15 pb-2.5">
            <span className="font-black text-xs text-[#162660] uppercase tracking-wider">
              Screen Time Balance
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-[#F8F1E5] border-2 border-[#4A3B2C]/30 text-[9px] font-black text-[#162660]">
              WHO Cap: {dailyCapHours} hrs/day
            </span>
          </div>

          {/* Centered Content (No nested inner box) */}
          <div className="flex-1 flex flex-col justify-center gap-3 py-4">
            <div className="flex items-baseline justify-between">
              <span className="text-xs sm:text-sm font-black text-[#162660] uppercase tracking-wide">
                Total Earned Time:
              </span>
              <span className="text-2xl sm:text-3xl font-black text-[#162660]">
                {activeChild?.tokens?.earnedHours ?? 0} hrs
              </span>
            </div>

            {/* Visual Progress Bar */}
            <div className="w-full bg-[#E8DAC4] h-3.5 rounded-full overflow-hidden border-2 border-[#4A3B2C]/30 my-0.5">
              <div
                className="bg-[#162660] h-full rounded-full transition-all duration-300"
                style={{ width: `${usedPercentage}%` }}
              />
            </div>

            <div className="flex justify-between items-center text-xs font-black text-[#162660]/80">
              <span>Used: {activeChild?.tokens?.usedHours ?? 0} hrs</span>
              <span className="text-[#162660] font-black underline">
                Available: {activeChild?.tokens?.remainingHours ?? 0} hrs
              </span>
            </div>
          </div>
        </div>

        {/* ── BENTO TILE 3: Chatbot (lg:col-span-6) ── */}
        <div className="lg:col-span-6 aralkada-card p-5 flex flex-col justify-between gap-4">
          <div>
            <div className="flex items-center justify-between mb-2.5">
              <span className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-[#D0E6FD] border-2 border-[#162660] shadow-[0_2px_0_#162660] text-[9px] font-black text-[#162660] uppercase tracking-wider">
                Chatbot
              </span>
            </div>

            <h3 className="text-lg font-black text-[#162660] mb-1.5 tracking-tight">
              Express a Concern to Chatbot
            </h3>
            <p className="text-xs font-bold text-[#4A3B2C]/70 mb-3">
              Get grounded, multi-framework coaching for everyday parenting moments tonight.
            </p>

            {/* Prompt Suggestions */}
            <div className="flex flex-wrap gap-1.5 mb-2">
              <span className="px-2.5 py-1 rounded-xl bg-[#F8F1E5] border-2 border-[#4A3B2C]/20 text-[11px] font-bold text-[#162660]">
                &quot;Handling anger when turning off iPad&quot;
              </span>
              <span className="px-2.5 py-1 rounded-xl bg-[#F8F1E5] border-2 border-[#4A3B2C]/20 text-[11px] font-bold text-[#162660]">
                &quot;Encouraging resilience after failure&quot;
              </span>
            </div>
          </div>

          <Link
            href="/chatbot"
            className="w-full py-2.5 aralkada-btn-primary flex items-center justify-center gap-2 text-xs cursor-pointer"
          >
            <svg className="w-4 h-4 text-[#F1E4D1]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2.2"
                d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
              />
            </svg>
            <span>CHAT WITH CHATBOT</span>
          </Link>
        </div>

        {/* ── BENTO TILE 4: Make an Action or Challenge (lg:col-span-6) ── */}
        <div className="lg:col-span-6 aralkada-card p-5 flex flex-col justify-between gap-4">
          <div>
            <div className="flex items-center justify-between mb-2.5">
              <span className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-[#E8DAC4] border-2 border-[#4A3B2C] shadow-[0_2px_0_#4A3B2C] text-[9px] font-black text-[#162660] uppercase tracking-wider">
                Offline Skill Building
              </span>
            </div>

            <h3 className="text-lg font-black text-[#162660] mb-1 tracking-tight">
              Make an Action or Challenge
            </h3>
            <p className="text-xs font-bold text-[#4A3B2C]/75 mb-3">
              Every minute of offline hard work unlocks healthy screen time.
            </p>

            {/* Quick Stats Summary (Image 3/4 Fix: 1 Min Effort = 1 Min Screen) */}
            <div className="grid grid-cols-2 gap-2.5 mb-2">
              <div className="p-2.5 rounded-2xl bg-[#F8F1E5] border-2 border-[#4A3B2C]/25 text-center shadow-sm flex flex-col justify-center">
                <span className="block text-[9px] font-black text-[#162660]/60 uppercase tracking-wider">
                  Reward Rate
                </span>
                <span className="text-xs sm:text-sm font-black text-[#162660] leading-tight mt-0.5">
                  1 Min Effort = 1 Min Screen
                </span>
              </div>
              <div className="p-2.5 rounded-2xl bg-[#F8F1E5] border-2 border-[#4A3B2C]/25 text-center shadow-sm flex flex-col justify-center">
                <span className="block text-[9px] font-black text-[#162660]/60 uppercase tracking-wider">
                  Max Daily Cap
                </span>
                <span className="text-xs sm:text-sm font-black text-[#162660] leading-tight mt-0.5">
                  {dailyCapHours} hrs / day
                </span>
              </div>
            </div>
          </div>

          <Link
            href="/challenge"
            className="w-full py-2.5 aralkada-btn-secondary flex items-center justify-center gap-2 text-center text-xs cursor-pointer"
          >
            <svg className="w-4 h-4 text-[#162660]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M12 4v16m8-8H4" />
            </svg>
            <span>CREATE ACTION / CHALLENGE</span>
          </Link>
        </div>

      </div>

      <section className="aralkada-card p-4">
        <div className="flex items-center justify-between gap-3 border-b border-[#4A3B2C]/15 pb-3">
          <div>
            <p className="text-[10px] font-black uppercase tracking-wider text-[#162660]/60">Parent review</p>
            <h2 className="mt-1 text-lg font-black text-[#162660]">Submitted actions</h2>
          </div>
          <span className="rounded-full border-2 border-[#4A3B2C] bg-[#D0E6FD] px-2.5 py-1 text-[10px] font-black uppercase text-[#162660]">{submittedActions.length} pending</span>
        </div>
        {submittedActions.length === 0 ? (
          <p className="pt-4 text-sm font-bold text-[#162660]/65">Completed child actions will appear here for verification.</p>
        ) : (
          <div className="mt-3 flex flex-col gap-3">
            {submittedActions.map((action) => (
              <SubmittedActionRow key={action.id} actionId={action.id} name={action.name} definitionOfDone={action.definitionOfDone} completionNote={action.completionNote} />
            ))}
          </div>
        )}
      </section>

      <section className="aralkada-card p-4">
        <div className="flex items-center justify-between gap-3 border-b border-[#4A3B2C]/15 pb-3">
          <div>
            <p className="text-[10px] font-black uppercase tracking-wider text-[#162660]/60">Parent review</p>
            <h2 className="mt-1 text-lg font-black text-[#162660]">Submitted challenges</h2>
          </div>
          <span className="rounded-full border-2 border-[#4A3B2C] bg-[#D0E6FD] px-2.5 py-1 text-[10px] font-black uppercase text-[#162660]">{submittedChallenges.length} pending</span>
        </div>
        {submittedChallenges.length === 0 ? (
          <p className="pt-4 text-sm font-bold text-[#162660]/65">Kid challenge reports will appear here with milestones and feedback tools.</p>
        ) : (
          <div className="mt-3 flex flex-col gap-3">
            {submittedChallenges.map((challenge) => (
              <SubmittedChallengeRow key={challenge.id} challengeId={challenge.id} title={challenge.title} minutes={challenge.minutes} report={challenge.report} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
