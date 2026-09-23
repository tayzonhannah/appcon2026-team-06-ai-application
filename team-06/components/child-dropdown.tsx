"use client";

import { useState, useRef, useEffect } from "react";
import { ChildAnalytics } from "@/lib/constants/analytics";

interface ChildDropdownProps {
  children: ChildAnalytics[];
  selected: ChildAnalytics;
  onSelect: (child: ChildAnalytics) => void;
}

export function ChildDropdown({ children, selected, onSelect }: ChildDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  /* Close on outside click */
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={ref} className="relative">
      {/* Trigger pill */}
      <button
        type="button"
        id="active-child-dropdown"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        onClick={() => setIsOpen((v) => !v)}
        className="flex items-center gap-2.5 px-4 py-2 rounded-full bg-[#E8DAC4] border-2 border-[#4A3B2C] shadow-[0_3px_0_#4A3B2C] hover:bg-[#DDD0B8] transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#162660]/30 select-none"
      >
        {/* Status dot */}
        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />

        {/* Avatar letter */}
        <span className="w-6 h-6 rounded-lg bg-[#162660] text-[#F1E4D1] text-[11px] font-black flex items-center justify-center shrink-0">
          {selected.avatarLetter}
        </span>

        {/* Label */}
        <span className="text-xs font-black text-[#162660] tracking-wide">
          {selected.childName}
        </span>

        {/* Chevron — rotates when open */}
        <svg
          className={`w-3.5 h-3.5 text-[#162660] transition-transform duration-200 ${
            isOpen ? "rotate-180" : "rotate-0"
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Dropdown panel */}
      {isOpen && (
        <div
          role="listbox"
          aria-label="Select active child"
          className="absolute right-0 top-[calc(100%+8px)] z-50 w-52 bg-white border-2 border-[#4A3B2C] rounded-2xl shadow-[0_6px_0_#4A3B2C] overflow-hidden"
          style={{ animation: "dropdownFadeIn 0.15s ease" }}
        >
          {/* Panel header */}
          <div className="px-4 py-2.5 bg-[#F8F1E5] border-b-2 border-[#4A3B2C]/20">
            <span className="text-[10px] font-black text-[#162660]/60 uppercase tracking-widest">
              Select Active Child
            </span>
          </div>

          {/* Options */}
          <ul className="py-1.5">
            {children.map((child) => {
              const isSelected = child.childId === selected.childId;
              return (
                <li key={child.childId}>
                  <button
                    type="button"
                    role="option"
                    aria-selected={isSelected}
                    onClick={() => {
                      onSelect(child);
                      setIsOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors cursor-pointer ${
                      isSelected
                        ? "bg-[#D0E6FD]"
                        : "hover:bg-[#F8F1E5]"
                    }`}
                  >
                    {/* Avatar */}
                    <span
                      className={`w-8 h-8 rounded-xl text-sm font-black flex items-center justify-center shrink-0 border-2 ${
                        isSelected
                          ? "bg-[#162660] text-[#F1E4D1] border-[#162660]"
                          : "bg-[#E8DAC4] text-[#162660] border-[#4A3B2C]/30"
                      }`}
                    >
                      {child.avatarLetter}
                    </span>

                    {/* Name + quick stat */}
                    <div className="flex flex-col min-w-0">
                      <span className="text-sm font-black text-[#162660] leading-none">
                        {child.childName}
                      </span>
                      <span className="text-[10px] font-bold text-[#162660]/60 mt-0.5">
                        {child.tokens.totalTokens} tokens · {child.tokens.earnedHours} hrs
                      </span>
                    </div>

                    {/* Check mark for selected */}
                    {isSelected && (
                      <svg
                        className="w-4 h-4 text-[#162660] ml-auto shrink-0"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2.5"
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}
