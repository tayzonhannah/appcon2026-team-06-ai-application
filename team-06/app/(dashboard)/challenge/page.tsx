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

  const handleAiGenerateChallenge = () => {
    if (!activeChild) return;
    const ideas = [
      {
        title: "Focus Pomodoro & Reflection Trial",
        description: "Work on school lessons with zero digital distraction and note one thing learned.",
        targetFocusArea: "Homework & Academic Focus" as const,
        earnedMinutes: 30,
        milestones: [
          "Set 25-minute Pomodoro focus clock",
          "Complete worksheet without device interruption",
          "Explain one concept to a parent or sibling",
        ],
        category: "Academic",
        status: "ongoing" as const,
      },
      {
        title: "Emotional Cool-Down Breathing Quest",
        description: "Practice calm breathing and identify triggers when feeling frustrated.",
        targetFocusArea: "Emotional Regulation" as const,
        earnedMinutes: 25,
        milestones: [
          "Take 4 deep belly breaths when frustrated",
          "Name the emotion on the Feelings Wheel",
          "Return calmly to the activity",
        ],
        category: "Mindfulness",
        status: "ongoing" as const,
      },
      {
        title: "Screen-Free Creative Craft Marathon",
        description: "Design and build a paper origami or drawing project without watching screen videos.",
        targetFocusArea: "Creative Practice" as any,
        earnedMinutes: 35,
        milestones: [
          "Draft initial idea on blank paper",
          "Build craft continuously for 20 minutes",
          "Showcase project during family dinner",
        ],
        category: "Creative",
        status: "ongoing" as const,
      },
    ];

    const pick = ideas[Math.floor(Math.random() * ideas.length)];
    addChallenge({
      childId: activeChild.childId,
      ...pick,
    });
  };

  const handleAiGenerateAction = () => {
    if (!activeChild) return;
    const actionIdeas = [
      { title: "Organize Backpack & Bookshelf", category: "DAILY ROUTINE", earnedMinutes: 15 },
      { title: "15-Min Outdoor Run or Jump Rope", category: "PHYSICAL HABIT", earnedMinutes: 20 },
      { title: "Help Clean Dinner Table Dishes", category: "FAMILY & CHORES", earnedMinutes: 15 },
      { title: "10-Minute Evening Gratitude Reflection", category: "MINDFULNESS", earnedMinutes: 10 },
      { title: "Water Balcony Houseplants", category: "FAMILY & CHORES", earnedMinutes: 10 },
      { title: "Draw 1 Creative Scene or Comic", category: "CREATIVE PRACTICE", earnedMinutes: 20 },
    ];

    const pick = actionIdeas[Math.floor(Math.random() * actionIdeas.length)];
    addAction({
      childId: activeChild.childId,
      title: pick.title,
      category: pick.category,
      earnedMinutes: pick.earnedMinutes,
      status: "pending",
    });
  };

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
            children={children}
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

            <div className="flex items-center gap-2">
              {/* AI Generate Challenge Button */}
              <button
                type="button"
                onClick={handleAiGenerateChallenge}
                className="px-3 py-1.5 rounded-xl bg-[#D0E6FD] border-2 border-[#162660] text-[#162660] text-xs font-black flex items-center gap-1.5 shadow-[0_2px_0_#162660] hover:bg-[#B8DAF9] active:translate-y-0.5 transition-all cursor-pointer"
                title="Generate tailored challenge with AI mascot"
              >
                <svg className="w-3.5 h-3.5 text-[#162660]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                <span>AI Generate</span>
              </button>

              {/* + Button to Add Challenge */}
              <button
                type="button"
                onClick={() => setIsChallengeModalOpen(true)}
                className="px-3 py-1.5 rounded-xl aralkada-btn-primary text-xs flex items-center gap-1.5 cursor-pointer"
              >
                <span>+ Add Challenge</span>
              </button>
            </div>
          </div>

          {/* Challenges 2x2 Grid (4 Boxes) */}
          {childChallenges.length === 0 ? (
            <div className="aralkada-card-beige p-8 text-center flex flex-col items-center justify-center gap-2 flex-1">
              <p className="text-sm font-black text-[#162660]">No challenges assigned yet</p>
              <p className="text-xs font-bold text-[#4A3B2C]/60">
                Click &quot;+ Add Challenge&quot; or &quot;AI Generate&quot; to assign a resilience challenge.
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

            <div className="flex items-center gap-2">
              {/* AI Generate Action Button */}
              <button
                type="button"
                onClick={handleAiGenerateAction}
                className="px-3 py-1.5 rounded-xl bg-[#D0E6FD] border-2 border-[#162660] text-[#162660] text-xs font-black flex items-center gap-1.5 shadow-[0_2px_0_#162660] hover:bg-[#B8DAF9] active:translate-y-0.5 transition-all cursor-pointer"
                title="Generate tailored habit action with AI mascot"
              >
                <svg className="w-3.5 h-3.5 text-[#162660]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                <span>AI Generate</span>
              </button>

              {/* + Button to Add Action */}
              <button
                type="button"
                onClick={() => setIsActionModalOpen(true)}
                className="px-3 py-1.5 rounded-xl aralkada-btn-secondary text-xs flex items-center gap-1.5 cursor-pointer"
              >
                <span>+ Add Action</span>
              </button>
            </div>
          </div>

          {/* Actions List (fills equal height) */}
          {childActions.length === 0 ? (
            <div className="aralkada-card-beige p-8 text-center flex flex-col items-center justify-center gap-2 flex-1">
              <p className="text-sm font-black text-[#162660]">No actions created yet</p>
              <p className="text-xs font-bold text-[#4A3B2C]/60">
                Click &quot;+ Add Action&quot; or &quot;AI Generate&quot; to add quick daily routine actions.
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
