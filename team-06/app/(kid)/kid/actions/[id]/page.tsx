"use client";

import Link from "next/link";
import { FormEvent, useState, useSyncExternalStore } from "react";
import { useParams } from "next/navigation";
import {
  readGrowthActions,
  submitGrowthAction,
  subscribeToGrowthActions,
  type GrowthAction,
} from "@/lib/growth-store";

const SERVER_ACTIONS_SNAPSHOT: GrowthAction[] = [];

function getServerActionsSnapshot() {
  return SERVER_ACTIONS_SNAPSHOT;
}

export default function KidActionDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [completionNote, setCompletionNote] = useState("");
  const actions = useSyncExternalStore(subscribeToGrowthActions, readGrowthActions, getServerActionsSnapshot);
  const action = actions.find((candidate) => candidate.id === id && candidate.childId === "kid-101");

  if (!action) {
    return (
      <div className="mx-auto w-full max-w-2xl py-10">
        <div className="rounded-[24px] border-4 border-[#0F172A] bg-white p-8 text-center shadow-[0_7px_0_#0F172A]">
          <h1 className="text-3xl font-black">Action not found</h1>
          <p className="mt-3 font-bold text-[#475569]">This action may be completed or is no longer assigned to you.</p>
          <Link href="/kid" className="mt-6 inline-flex rounded-xl border-2 border-[#0F172A] bg-[#F59E0B] px-4 py-3 text-xs font-black uppercase shadow-[0_3px_0_#0F172A]">Back to home</Link>
        </div>
      </div>
    );
  }

  const isSubmitted = action.progress === "submitted";
  const isApproved = action.progress === "approved";

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    submitGrowthAction(action.id, completionNote);
  };

  return (
    <div className="mx-auto w-full max-w-3xl py-2 sm:py-10">
      <Link href="/kid" className="inline-flex min-h-[44px] items-center rounded-lg px-3 py-2 text-xs font-black uppercase tracking-wider text-[#2563EB] underline underline-offset-4 touch-manipulation">← Back to home</Link>
      <div className="mt-4 rounded-[24px] border-4 border-[#0F172A] bg-white p-5 shadow-[0_7px_0_#0F172A] sm:p-8">
        <div className="flex flex-col gap-3 border-b-2 border-[#0F172A]/10 pb-5 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.18em] text-[#2563EB]">Offline action</p>
            <h1 className="mt-2 text-3xl font-black leading-tight sm:text-4xl">{action.name}</h1>
          </div>
          <span className="w-fit rounded-lg border-2 border-[#0F172A] bg-[#D0E6FD] px-3 py-2 text-[10px] font-black uppercase">{isApproved ? "Approved" : isSubmitted ? "In review" : "Assigned"}</span>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border-2 border-[#0F172A]/20 bg-[#EFF6FF] p-4">
            <p className="text-[10px] font-black uppercase tracking-wider text-[#475569]">What to do</p>
            <p className="mt-2 text-sm font-bold leading-relaxed">{action.description}</p>
          </div>
          <div className="rounded-2xl border-2 border-[#0F172A]/20 bg-[#FDE68A] p-4">
            <p className="text-[10px] font-black uppercase tracking-wider text-[#475569]">Definition of done</p>
            <p className="mt-2 text-sm font-black leading-relaxed">{action.definitionOfDone}</p>
          </div>
        </div>

        {isApproved ? (
          <div className="mt-6 rounded-2xl border-2 border-[#0F172A] bg-[#B7E4C7] p-5 text-sm font-black">Your parent approved this action. Nice work showing up.</div>
        ) : isSubmitted ? (
          <div className="mt-6 rounded-2xl border-2 border-[#0F172A] bg-[#D0E6FD] p-5 text-sm font-black">Your parent is reviewing this action. You can return home while you wait.</div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-6 rounded-2xl border-2 border-[#0F172A]/20 bg-[#F8F1E5] p-4 sm:p-5">
            <label htmlFor="completion-note" className="block text-xs font-black uppercase tracking-wider">What did you notice?</label>
            <textarea id="completion-note" value={completionNote} onChange={(event) => setCompletionNote(event.target.value)} rows={4} placeholder="Tell your parent how it went (optional)" className="mt-2 min-h-[96px] w-full resize-y rounded-xl border-2 border-[#0F172A]/30 bg-white px-4 py-3 text-base font-bold outline-none focus:border-[#2563EB] focus:ring-4 focus:ring-[#2563EB]/20" style={{ fontSize: "16px" }} />
            <button type="submit" className="mt-4 min-h-[56px] w-full rounded-xl border-2 border-[#0F172A] bg-[#EC4899] px-4 py-3 text-xs font-black uppercase tracking-wider text-white shadow-[0_3px_0_#0F172A] transition hover:-translate-y-0.5 active:translate-y-0 active:shadow-none focus:outline-none focus:ring-4 focus:ring-[#EC4899]/30 touch-manipulation">Submit for parent review</button>
          </form>
        )}
      </div>
    </div>
  );
}