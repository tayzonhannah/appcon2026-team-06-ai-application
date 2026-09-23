"use client";

import { useState } from "react";
import { ChildAction } from "@/lib/constants/challenges";

interface Props {
  childId: string;
  childName: string;
  onAdd: (action: Omit<ChildAction, "id">) => void;
  onClose: () => void;
}

const CATEGORIES = [
  "DAILY ROUTINE",
  "PHYSICAL HABIT",
  "FAMILY & CHORES",
  "MINDFULNESS",
  "CREATIVE PRACTICE",
];

export function AddActionModal({ childId, childName, onAdd, onClose }: Props) {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [earnedMinutes, setEarnedMinutes] = useState(15);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    onAdd({
      childId,
      title: title.trim(),
      category,
      earnedMinutes: Number(earnedMinutes) || 10,
      status: "pending",
    });
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="aralkada-card w-full max-w-sm p-6 flex flex-col gap-4 shadow-[0_8px_0_#4A3B2C]">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b-2 border-[#4A3B2C]/15">
          <div>
            <h2 className="text-lg font-black text-[#162660]">Add Quick Action</h2>
            <p className="text-xs font-bold text-[#162660]/60 mt-0.5">
              For <span className="text-[#162660] font-black">{childName}</span>
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
          {/* Action Title */}
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-black uppercase tracking-wider text-[#4A3B2C]/70">
              Action Title
            </label>
            <input
              required
              className="aralkada-input px-3.5 py-2.5 text-sm"
              placeholder="e.g., Make Bed & Clean Room"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          {/* Category */}
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-black uppercase tracking-wider text-[#4A3B2C]/70">
              Category
            </label>
            <select
              className="w-full bg-[#F8F1E5] border-2 border-[#4A3B2C] rounded-xl px-3 py-2.5 text-xs font-bold text-[#162660] focus:outline-none"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          {/* Earned Minutes */}
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-black uppercase tracking-wider text-[#4A3B2C]/70">
              Earned Minutes
            </label>
            <input
              type="number"
              min={5}
              max={60}
              step={5}
              required
              className="aralkada-input px-3.5 py-2.5 text-sm text-center font-bold"
              value={earnedMinutes}
              onChange={(e) => setEarnedMinutes(Number(e.target.value))}
            />
          </div>

          {/* Buttons */}
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
              Add Action
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
