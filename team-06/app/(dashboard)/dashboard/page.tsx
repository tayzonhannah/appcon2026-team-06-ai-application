"use client";

import { useState } from "react";
import { AnalyticsCard } from "@/components/dashboard/analytics-card";
import { ActionCards } from "@/components/dashboard/action-cards";
import { ChildDropdown } from "@/components/dashboard/child-dropdown";
import { MOCK_CHILDREN_LIST } from "@/lib/constants/analytics";

export default function DashboardPage() {
  const [selectedChildId, setSelectedChildId] = useState(MOCK_CHILDREN_LIST[0].childId);

  const activeChild =
    MOCK_CHILDREN_LIST.find((c) => c.childId === selectedChildId) ?? MOCK_CHILDREN_LIST[0];

  return (
    /* Full height of parent (the capped main), flex column so heading + grid share space */
    <div className="h-full flex flex-col gap-3">

      {/* Top Banner / Heading — fixed height, doesn't stretch */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b-2 border-[#4A3B2C]/20 shrink-0">
        <div>
          <h1 className="text-2xl font-black text-[#162660] tracking-tight">
            Parent Overview
          </h1>
          <p className="text-xs font-bold text-[#162660]/70 mt-0.5">
            Monitor offline habit growth, verify completed quests, and support emotion coaching.
          </p>
        </div>

        <ChildDropdown
          children={MOCK_CHILDREN_LIST}
          selected={activeChild}
          onSelect={(child) => setSelectedChildId(child.childId)}
        />
      </div>

      {/* Main Grid — takes all remaining height, columns stretch equally */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 flex-1 min-h-0">
        {/* Left: Analytics Card — stretches full height */}
        <div className="lg:col-span-5 min-h-0">
          <AnalyticsCard data={activeChild} />
        </div>

        {/* Right: Action Cards — stretches full height */}
        <div className="lg:col-span-7 min-h-0">
          <ActionCards />
        </div>
      </div>
    </div>
  );
}
