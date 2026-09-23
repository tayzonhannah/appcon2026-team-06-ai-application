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
    <div className="py-4 sm:py-6 flex flex-col gap-6 min-h-0">
      {/* Top Banner / Heading */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-2 border-b-2 border-[#4A3B2C]/20">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#162660] tracking-tight">
            Parent Overview
          </h1>
          <p className="text-xs sm:text-sm font-bold text-[#162660]/70 mt-0.5">
            Monitor offline habit growth, verify completed quests, and support emotion coaching.
          </p>
        </div>

        {/* Custom Active Child Dropdown */}
        <ChildDropdown
          children={MOCK_CHILDREN_LIST}
          selected={activeChild}
          onSelect={(child) => setSelectedChildId(child.childId)}
        />
      </div>

      {/* Main Grid: Left Analytics + Right Action Cards — equal heights */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Left Side: Analytics Card */}
        <div className="lg:col-span-5 w-full">
          <AnalyticsCard data={activeChild} />
        </div>

        {/* Right Side: Action Cards */}
        <div className="lg:col-span-7 w-full">
          <ActionCards />
        </div>
      </div>
    </div>
  );
}
