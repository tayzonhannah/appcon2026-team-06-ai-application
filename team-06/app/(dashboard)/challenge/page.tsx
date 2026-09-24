"use client";

import { useState } from "react";
import { useChildProfiles } from "@/lib/hooks/useChildProfiles";
import { useChildChallenges } from "@/lib/hooks/useChildChallenges";
import { ChildDropdown } from "@/components/child-dropdown";
import { ChallengeCard } from "@/components/challenge/challenge-card";
import { ActionListItem } from "@/components/challenge/action-list-item";
import { AddChallengeModal } from "@/components/challenge/add-challenge-modal";
import { AddActionModal } from "@/components/challenge/add-action-modal";

export default function ChallengePage() {
  const { children } = useChildProfiles();
  const [selectedChildId, setSelectedChildId] = useState(children[0]?.childId || "kid-101");
  const [isChallengeModalOpen, setIsChallengeModalOpen] = useState(false);
  const [isActionModalOpen, setIsActionModalOpen] = useState(false);

  const activeChild = children.find((c) => c.childId === selectedChildId) || children[0];

  const {
    childChallenges,
    childActions,
    addChallenge,
    toggleChallengeStatus,
    addAction,
    toggleActionStatus,
  } = useChildChallenges(activeChild?.childId || "kid-101");

  return (
    <div className="flex flex-col gap-5">
      {/* ── Page Header (Image 1 Standard Header Style) ── */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b-2 border-[#4A3B2C]/20 shrink-0">
        <div>
          <h1 className="text-2xl font-black text-[#162660] tracking-tight">
            Challenge &amp; Action
          </h1>
        </div>

        {/* Child Selector Dropdown */}
        {activeChild && (
          <ChildDropdown
            childOptions={children}
            selected={activeChild}
            onSelect={(child) => setSelectedChildId(child.childId)}
          />
        )}
      </div>

      {/* ── Two-Column Layout: Challenges on Left, Actions on Right (Equal Height) ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        {/* ── Left: Challenges (2x2 Grid of 4 Boxes) ── */}
        <div className="lg:col-span-7 flex flex-col gap-3.5 h-full">
          <div className="flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2">
              <p className="text-[10px] font-black text-[#162660]/60 uppercase tracking-widest">
                Challenges
              </p>
              <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-[#E8DAC4] border border-[#4A3B2C]/30 text-[#162660]">
                {childChallenges.length}
              </span>
            </div>

            {/* + Button to Add Challenge (Pop-up contains AI Auto-Fill) */}
            <button
              type="button"
              onClick={() => setIsChallengeModalOpen(true)}
              className="px-3.5 py-1.5 rounded-xl aralkada-btn-primary text-xs flex items-center gap-1.5 cursor-pointer"
            >
              <span>+ Add Challenge</span>
            </button>
          </div>

          {/* Challenges 2x2 Grid (4 Boxes) */}
          {childChallenges.length === 0 ? (
            <div className="aralkada-card-beige p-8 text-center flex flex-col items-center justify-center gap-2 flex-1">
              <p className="text-sm font-black text-[#162660]">No challenges assigned yet</p>
              <p className="text-xs font-bold text-[#4A3B2C]/60">
                Click &quot;+ Add Challenge&quot; to assign a resilience challenge.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 flex-1">
              {childChallenges.map((challenge) => (
                <ChallengeCard
                  key={challenge.id}
                  challenge={challenge}
                  onToggleStatus={toggleChallengeStatus}
                />
              ))}
            </div>
          )}
        </div>

        {/* ── Right: Quick Actions (Equal Height to Challenges) ── */}
        <div className="lg:col-span-5 flex flex-col gap-3.5 h-full">
          <div className="flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2">
              <p className="text-[10px] font-black text-[#162660]/60 uppercase tracking-widest">
                Quick Actions
              </p>
              <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-[#E8DAC4] border border-[#4A3B2C]/30 text-[#162660]">
                {childActions.length}
              </span>
            </div>

            {/* + Button to Add Action (Pop-up contains AI Auto-Fill) */}
            <button
              type="button"
              onClick={() => setIsActionModalOpen(true)}
              className="px-3.5 py-1.5 rounded-xl aralkada-btn-secondary text-xs flex items-center gap-1.5 cursor-pointer"
            >
              <span>+ Add Action</span>
            </button>
          </div>

          {/* Actions List (fills equal height) */}
          {childActions.length === 0 ? (
            <div className="aralkada-card-beige p-8 text-center flex flex-col items-center justify-center gap-2 flex-1">
              <p className="text-sm font-black text-[#162660]">No actions created yet</p>
              <p className="text-xs font-bold text-[#4A3B2C]/60">
                Click &quot;+ Add Action&quot; to add quick daily routine actions.
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-3 flex-1 justify-between">
              {childActions.map((action, idx) => (
                <ActionListItem
                  key={action.id}
                  action={action}
                  index={idx}
                  onToggleStatus={toggleActionStatus}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── Modals ── */}
      {isChallengeModalOpen && activeChild && (
        <AddChallengeModal
          childId={activeChild.childId}
          childName={activeChild.childName}
          onAdd={addChallenge}
          onClose={() => setIsChallengeModalOpen(false)}
        />
      )}

      {isActionModalOpen && activeChild && (
        <AddActionModal
          childId={activeChild.childId}
          childName={activeChild.childName}
          onAdd={addAction}
          onClose={() => setIsActionModalOpen(false)}
        />
      )}
    </div>
  );
}
