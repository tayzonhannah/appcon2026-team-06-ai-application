"use client";

import { useState } from "react";
import { FOCUS_AREA_OPTIONS, FocusArea } from "@/lib/constants/analytics";
import { ChildChallenge } from "@/lib/constants/challenges";

interface Props {
  childId: string;
  childName: string;
  onAdd: (challenge: Omit<ChildChallenge, "id">) => void;
  onClose: () => void;
}

export function AddChallengeModal({ childId, childName, onAdd, onClose }: Props) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [targetFocusArea, setTargetFocusArea] = useState<FocusArea>(FOCUS_AREA_OPTIONS[0]);
  const [earnedMinutes, setEarnedMinutes] = useState(30);
  const [milestonesText, setMilestonesText] = useState("");
  const [category, setCategory] = useState("Academic");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const milestones = milestonesText
      .split("\n")
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    onAdd({
      childId,
      title: title.trim(),
      description: description.trim(),
      targetFocusArea,
      earnedMinutes: Number(earnedMinutes) || 15,
      milestones: milestones.length > 0 ? milestones : ["Complete offline goal"],
      status: "ongoing",
      category,
    });
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="aralkada-card w-full max-w-lg max-h-[90vh] overflow-y-auto p-6 flex flex-col gap-4 shadow-[0_8px_0_#4A3B2C]">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b-2 border-[#4A3B2C]/15">
          <div>
            <h2 className="text-lg font-black text-[#162660]">Create New Challenge</h2>
            <p className="text-xs font-bold text-[#162660]/60 mt-0.5">
              Assigning to <span className="text-[#162660] font-black">{childName}</span>
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-xl bg-[#F1E4D1] border-2 border-[#4A3B2C] flex items-center justify-center hover:bg-[#E6D4BA] cursor-pointer"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3.5">
          {/* Title */}
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-black uppercase tracking-wider text-[#4A3B2C]/70">
              Challenge Title
            </label>
            <input
              required
              className="aralkada-input px-3.5 py-2.5 text-sm"
              placeholder="e.g., Mindful Homework Sprint"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          {/* Description */}
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-black uppercase tracking-wider text-[#4A3B2C]/70">
              Description
            </label>
            <input
              className="aralkada-input px-3.5 py-2.5 text-sm"
              placeholder="e.g., Complete math workbook chapter with zero distractions"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          {/* Target Focus Area & Earned Minutes */}
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-black uppercase tracking-wider text-[#4A3B2C]/70">
                Target Focus Area
              </label>
              <select
                className="w-full bg-[#F8F1E5] border-2 border-[#4A3B2C] rounded-xl px-3 py-2 text-xs font-bold text-[#162660] focus:outline-none"
                value={targetFocusArea}
                onChange={(e) => setTargetFocusArea(e.target.value as FocusArea)}
              >
                {FOCUS_AREA_OPTIONS.map((area) => (
                  <option key={area} value={area}>{area}</option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-black uppercase tracking-wider text-[#4A3B2C]/70">
                Earned Time (Mins)
              </label>
              <input
                type="number"
                min={5}
                max={120}
                step={5}
                required
                className="aralkada-input px-3 py-2 text-xs font-bold text-center"
                value={earnedMinutes}
                onChange={(e) => setEarnedMinutes(Number(e.target.value))}
              />
            </div>
          </div>

          {/* Milestones / Goals */}
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-black uppercase tracking-wider text-[#4A3B2C]/70">
              Goals to Achieve (1 per line)
            </label>
            <textarea
              rows={3}
              className="w-full min-h-[70px] bg-[#F8F1E5] border-2 border-[#4A3B2C] rounded-xl p-3 text-xs font-semibold text-[#162660] focus:outline-none leading-relaxed placeholder:text-xs placeholder:text-[#162660]/40"
              placeholder="• Set 25-minute Pomodoro timer&#10;• Review answers with parent&#10;• Note one mistake learned"
              value={milestonesText}
              onChange={(e) => setMilestonesText(e.target.value)}
            />
          </div>

          {/* Action buttons */}
          <div className="flex gap-3 mt-2 pt-3 border-t-2 border-[#4A3B2C]/15">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 aralkada-btn-outline text-xs cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 aralkada-btn-primary text-xs cursor-pointer"
            >
              Add Challenge
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
