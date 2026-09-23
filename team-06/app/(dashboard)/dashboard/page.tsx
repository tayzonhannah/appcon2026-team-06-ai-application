"use client";

import { useState } from "react";
import { AnalyticsCard } from "@/components/analytics-card";
import { ActionCards } from "@/components/action-cards";
import { ChildDropdown } from "@/components/child-dropdown";
import { MOCK_CHILDREN_LIST } from "@/lib/constants/analytics";
import {
  approveGrowthAction,
  readGrowthActions,
  rejectGrowthAction,
  subscribeToGrowthActions,
  type GrowthAction,
} from "@/lib/growth-store";
import { useSyncExternalStore } from "react";

const SERVER_ACTIONS_SNAPSHOT: GrowthAction[] = [];

function getServerActionsSnapshot() {
  return SERVER_ACTIONS_SNAPSHOT;
}

export default function DashboardPage() {
  const [selectedChildId, setSelectedChildId] = useState(MOCK_CHILDREN_LIST[0].childId);

  const activeChild =
    MOCK_CHILDREN_LIST.find((c) => c.childId === selectedChildId) ?? MOCK_CHILDREN_LIST[0];
  const submittedActions = useSyncExternalStore(
    subscribeToGrowthActions,
    readGrowthActions,
    getServerActionsSnapshot,
  ).filter((action) => action.childId === selectedChildId && action.progress === "submitted");

  return (
    /* Flex column with vertical margin auto for clean centering */
    <div className="flex flex-col gap-4 my-auto">

      {/* Top Banner / Heading — fixed height */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b-2 border-[#4A3B2C]/20 shrink-0">
        <div>
          <h1 className="text-2xl font-black text-[#162660] tracking-tight">
            Parent Overview
          </h1>
        </div>

        <ChildDropdown
          childOptions={MOCK_CHILDREN_LIST}
          selected={activeChild}
          onSelect={(child) => setSelectedChildId(child.childId)}
        />
      </div>

      {/* Main Grid — natural height matching left and right columns */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch">
        {/* Left: Analytics Card */}
        <div className="lg:col-span-5">
          <AnalyticsCard data={activeChild} />
        </div>

        {/* Right: Action Cards */}
        <div className="lg:col-span-7 flex flex-col justify-between">
          <ActionCards />
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
              <div key={action.id} className="flex flex-col gap-3 rounded-xl border-2 border-[#4A3B2C]/25 bg-[#F8F1E5] p-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h3 className="font-black text-[#162660]">{action.name}</h3>
                  <p className="mt-1 text-xs font-bold text-[#162660]/65">{action.definitionOfDone}</p>
                </div>
                <div className="flex gap-2">
                  <button type="button" onClick={() => rejectGrowthAction(action.id)} className="rounded-lg border-2 border-[#4A3B2C] bg-white px-3 py-2 text-[10px] font-black uppercase text-[#162660] transition hover:bg-[#F1E4D1]">Needs work</button>
                  <button type="button" onClick={() => approveGrowthAction(action.id)} className="rounded-lg border-2 border-[#162660] bg-[#B7E4C7] px-3 py-2 text-[10px] font-black uppercase text-[#162660] shadow-[0_2px_0_#162660] transition hover:-translate-y-0.5">Approve +15m</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
