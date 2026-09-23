"use client";

import { useState } from "react";
import { AnalyticsCard } from "@/components/analytics-card";
import { ActionCards } from "@/components/action-cards";
import { ChildDropdown } from "@/components/child-dropdown";
import { MOCK_CHILDREN_LIST } from "@/lib/constants/analytics";

export default function DashboardPage() {
  const [selectedChildId, setSelectedChildId] = useState(MOCK_CHILDREN_LIST[0].childId);

  const activeChild =
    MOCK_CHILDREN_LIST.find((c) => c.childId === selectedChildId) ?? MOCK_CHILDREN_LIST[0];

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
    </div>
  );
}
