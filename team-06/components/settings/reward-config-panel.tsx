"use client";

import { useState } from "react";
import { RewardConfig, CustomTask } from "@/lib/constants/analytics";
import {
  computeEarnedMinutes,
  FrictionLevel,
  BehaviorCategory,
} from "@/lib/hooks/useChildProfiles";

interface Props {
  config: RewardConfig;
  onChange: (updated: RewardConfig) => void;
}

/* ─── Mode A: Live Formula Preview ─── */
function FormulaPreview() {
  const [duration, setDuration] = useState(20);
  const [friction, setFriction] = useState<FrictionLevel>("moderate");
  const [category, setCategory] = useState<BehaviorCategory>("academic");

  const earned = computeEarnedMinutes(duration, friction, category);

  const FRICTION_LABELS: Record<FrictionLevel, { label: string; di: string; desc: string }> = {
    low: { label: "Low", di: "×0.75", desc: "Simple chores, making bed" },
    moderate: { label: "Moderate", di: "×1.00", desc: "Reading, sports practice" },
    high: { label: "High", di: "×1.25", desc: "Math study, emotional regulation" },
  };

  const CAT_LABELS: Record<BehaviorCategory, { label: string; wi: string }> = {
    physical: { label: "Physical / Chores", wi: "×1.00" },
    social: { label: "Social / Interpersonal", wi: "×1.10" },
    academic: { label: "Academic / Deep Focus", wi: "×1.20" },
    emotional: { label: "Emotional / Mindfulness", wi: "×1.30" },
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Formula display */}
      <div className="bg-[#162660] rounded-2xl p-4 text-[#F1E4D1]">
        <p className="text-[9px] font-black uppercase tracking-widest opacity-60 mb-1">Formula</p>
        <p className="text-sm font-black font-mono">Mi = round( di × Di × Wi )</p>
        <div className="flex gap-3 mt-2 text-[10px] font-bold opacity-70 flex-wrap">
          <span>di = task duration</span>
          <span>Di = friction multiplier</span>
          <span>Wi = behavior weight</span>
        </div>
      </div>

      {/* Duration */}
      <div>
        <div className="flex justify-between mb-1">
          <label className="text-[10px] font-black text-[#162660]/60 uppercase tracking-wider">
            Task Duration (di)
          </label>
          <span className="text-xs font-black text-[#162660]">{duration} min</span>
        </div>
        <input
          type="range"
          min={5}
          max={60}
          step={5}
          value={duration}
          onChange={(e) => setDuration(Number(e.target.value))}
          className="w-full accent-[#162660]"
        />
        <div className="flex justify-between text-[9px] text-[#162660]/40 font-bold mt-0.5">
          <span>5 min</span><span>60 min</span>
        </div>
      </div>

      {/* Friction (Di) */}
      <div>
        <label className="text-[10px] font-black text-[#162660]/60 uppercase tracking-wider block mb-2">
          Cognitive Friction (Di)
        </label>
        <div className="flex flex-col gap-1.5">
          {(Object.keys(FRICTION_LABELS) as FrictionLevel[]).map((f) => {
            const { label, di, desc } = FRICTION_LABELS[f];
            return (
              <label
                key={f}
                className={`flex items-center gap-3 p-2.5 rounded-xl border-2 cursor-pointer transition-all ${
                  friction === f
                    ? "bg-[#D0E6FD] border-[#162660]"
                    : "bg-white border-[#4A3B2C]/20 hover:border-[#162660]/40"
                }`}
              >
                <input
                  type="radio"
                  name="friction"
                  value={f}
                  checked={friction === f}
                  onChange={() => setFriction(f)}
                  className="accent-[#162660]"
                />
                <div className="flex-1">
                  <span className="text-xs font-black text-[#162660]">{label} Friction</span>
                  <span className="text-[10px] text-[#4A3B2C]/60 font-bold ml-1">{desc}</span>
                </div>
                <span className="text-xs font-black text-[#162660] bg-white border border-[#162660]/30 px-2 py-0.5 rounded-lg">{di}</span>
              </label>
            );
          })}
        </div>
      </div>

      {/* Category (Wi) */}
      <div>
        <label className="text-[10px] font-black text-[#162660]/60 uppercase tracking-wider block mb-2">
          Behavioral Category (Wi)
        </label>
        <div className="flex flex-col gap-1.5">
          {(Object.keys(CAT_LABELS) as BehaviorCategory[]).map((c) => {
            const { label, wi } = CAT_LABELS[c];
            return (
              <label
                key={c}
                className={`flex items-center gap-3 p-2.5 rounded-xl border-2 cursor-pointer transition-all ${
                  category === c
                    ? "bg-[#D0E6FD] border-[#162660]"
                    : "bg-white border-[#4A3B2C]/20 hover:border-[#162660]/40"
                }`}
              >
                <input
                  type="radio"
                  name="category"
                  value={c}
                  checked={category === c}
                  onChange={() => setCategory(c)}
                  className="accent-[#162660]"
                />
                <span className="flex-1 text-xs font-black text-[#162660]">{label}</span>
                <span className="text-xs font-black text-[#162660] bg-white border border-[#162660]/30 px-2 py-0.5 rounded-lg">{wi}</span>
              </label>
            );
          })}
        </div>
      </div>

      {/* Live result */}
      <div className="bg-[#D4EDDA] border-2 border-[#276749] rounded-2xl p-4 flex items-center justify-between shadow-[0_3px_0_#276749]">
        <div>
          <p className="text-[10px] font-black text-[#276749]/70 uppercase tracking-wider">Earned Screen Time</p>
          <p className="text-xs font-bold text-[#276749]/60 mt-0.5">
            {duration} × {FRICTION_LABELS[friction].di} × {CAT_LABELS[category].wi}
          </p>
        </div>
        <div className="text-right">
          <p className="text-3xl font-black text-[#276749]">{earned}</p>
          <p className="text-[10px] font-black text-[#276749]/70">minutes</p>
        </div>
      </div>

      {/* Age caps reference */}
      <div className="aralkada-card-beige p-3">
        <p className="text-[9px] font-black text-[#162660]/50 uppercase tracking-widest mb-2">Daily Screen Cap (WHO/AAP)</p>
        <div className="grid grid-cols-3 gap-2 text-center">
          {[
            { range: "Ages 2–5", cap: "60 min" },
            { range: "Ages 6–12", cap: "120 min" },
            { range: "Ages 13–18", cap: "240 min" },
          ].map(({ range, cap }) => (
            <div key={range} className="bg-white rounded-xl border border-[#4A3B2C]/20 p-2">
              <p className="text-[9px] font-bold text-[#4A3B2C]/60">{range}</p>
              <p className="text-xs font-black text-[#162660]">{cap}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─── Mode B: Custom Task Table ─── */
function CustomMode({ config, onChange }: { config: RewardConfig; onChange: (c: RewardConfig) => void }) {
  const [newTask, setNewTask] = useState({ name: "", durationMin: 15, earnedMin: 15 });
  const [newActivity, setNewActivity] = useState("");
  const [editId, setEditId] = useState<string | null>(null);

  function addTask() {
    if (!newTask.name.trim()) return;
    const task: CustomTask = { id: Date.now().toString(), ...newTask, name: newTask.name.trim() };
    onChange({ ...config, customTasks: [...config.customTasks, task] });
    setNewTask({ name: "", durationMin: 15, earnedMin: 15 });
  }

  function removeTask(id: string) {
    onChange({ ...config, customTasks: config.customTasks.filter((t) => t.id !== id) });
  }

  function saveEdit(id: string, field: "durationMin" | "earnedMin", value: number) {
    onChange({
      ...config,
      customTasks: config.customTasks.map((t) => t.id === id ? { ...t, [field]: value } : t),
    });
  }

  function addActivity() {
    if (!newActivity.trim()) return;
    onChange({ ...config, freeActivities: [...config.freeActivities, newActivity.trim()] });
    setNewActivity("");
  }

  function removeActivity(name: string) {
    onChange({ ...config, freeActivities: config.freeActivities.filter((a) => a !== name) });
  }

  return (
    <div className="flex flex-col gap-5">
      {/* Custom Tasks */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <p className="text-[10px] font-black text-[#162660]/60 uppercase tracking-widest">Custom Tasks</p>
        </div>

        {/* Task rows */}
        <div className="flex flex-col gap-2 mb-3">
          {config.customTasks.length === 0 && (
            <p className="text-xs font-bold text-[#4A3B2C]/40 italic text-center py-4">
              No custom tasks yet — add one below
            </p>
          )}
          {config.customTasks.map((task) => (
            <div key={task.id} className="bg-white border-2 border-[#4A3B2C]/20 rounded-xl p-3 flex items-center gap-3">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-black text-[#162660] truncate">{task.name}</p>
                <p className="text-[10px] font-bold text-[#4A3B2C]/50">
                  {task.durationMin} min effort
                </p>
              </div>

              {editId === task.id ? (
                <div className="flex items-center gap-2 shrink-0">
                  <input
                    type="number"
                    min={1}
                    max={120}
                    defaultValue={task.earnedMin}
                    onBlur={(e) => { saveEdit(task.id, "earnedMin", Number(e.target.value)); setEditId(null); }}
                    className="aralkada-input w-16 px-2 py-1 text-sm text-center"
                    autoFocus
                  />
                  <span className="text-xs font-bold text-[#4A3B2C]/60">min</span>
                </div>
              ) : (
                <button
                  onClick={() => setEditId(task.id)}
                  className="shrink-0 flex items-center gap-1.5 bg-[#D0E6FD] border-2 border-[#162660]/30 rounded-xl px-3 py-1.5 cursor-pointer hover:border-[#162660]"
                >
                  <span className="text-sm font-black text-[#162660]">{task.earnedMin}</span>
                  <span className="text-[9px] font-bold text-[#162660]/60">min ✏</span>
                </button>
              )}

              <button
                onClick={() => removeTask(task.id)}
                className="shrink-0 w-7 h-7 rounded-lg bg-[#FDD0D0] border border-[#7A1E1E]/20 flex items-center justify-center cursor-pointer hover:bg-[#f8a0a0]"
              >
                <svg className="w-3.5 h-3.5 text-[#7A1E1E]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          ))}
        </div>

        {/* Add task form */}
        <div className="aralkada-card-beige p-3 flex flex-col gap-2">
          <p className="text-[9px] font-black text-[#162660]/50 uppercase tracking-widest">Add Task</p>
          <input
            className="aralkada-input px-3 py-2 text-sm"
            placeholder="Task name (e.g., Read 10 pages)"
            value={newTask.name}
            onChange={(e) => setNewTask((p) => ({ ...p, name: e.target.value }))}
            onKeyDown={(e) => e.key === "Enter" && addTask()}
          />
          <div className="grid grid-cols-2 gap-2">
            <div className="flex flex-col gap-1">
              <label className="text-[9px] font-bold text-[#4A3B2C]/60">Duration (min)</label>
              <input
                type="number"
                min={1}
                max={120}
                className="aralkada-input px-3 py-1.5 text-sm"
                value={newTask.durationMin}
                onChange={(e) => setNewTask((p) => ({ ...p, durationMin: Number(e.target.value) }))}
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-[9px] font-bold text-[#4A3B2C]/60">Earns (min screen)</label>
              <input
                type="number"
                min={1}
                max={120}
                className="aralkada-input px-3 py-1.5 text-sm"
                value={newTask.earnedMin}
                onChange={(e) => setNewTask((p) => ({ ...p, earnedMin: Number(e.target.value) }))}
              />
            </div>
          </div>
          <button
            onClick={addTask}
            disabled={!newTask.name.trim()}
            className="aralkada-btn-primary py-2 text-xs cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
          >
            + Add Task
          </button>
        </div>
      </div>

      {/* Free Activities */}
      <div>
        <p className="text-[10px] font-black text-[#162660]/60 uppercase tracking-widest mb-2">
          Free Activities <span className="normal-case font-bold text-[#162660]/40">(no tracking needed)</span>
        </p>
        <div className="flex flex-wrap gap-2 mb-3">
          {config.freeActivities.map((a) => (
            <div key={a} className="flex items-center gap-1.5 bg-[#D4EDDA] border-2 border-[#276749]/30 rounded-full px-3 py-1">
              <span className="text-xs font-bold text-[#276749]">{a}</span>
              <button onClick={() => removeActivity(a)} className="cursor-pointer text-[#276749]/60 hover:text-[#276749]">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          ))}
        </div>
        <div className="flex gap-2">
          <input
            className="aralkada-input flex-1 px-3 py-2 text-sm"
            placeholder="e.g., Outdoor play"
            value={newActivity}
            onChange={(e) => setNewActivity(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addActivity()}
          />
          <button
            onClick={addActivity}
            disabled={!newActivity.trim()}
            className="aralkada-btn-secondary px-4 py-2 text-xs cursor-pointer disabled:opacity-40"
          >
            + Add
          </button>
        </div>
      </div>

      {/* Custom Daily Cap */}
      <div>
        <div className="flex justify-between mb-1">
          <label className="text-[10px] font-black text-[#162660]/60 uppercase tracking-wider">Custom Daily Cap</label>
          <span className="text-xs font-black text-[#162660]">{config.customDailyCap} min</span>
        </div>
        <input
          type="range"
          min={30}
          max={300}
          step={15}
          value={config.customDailyCap}
          onChange={(e) => onChange({ ...config, customDailyCap: Number(e.target.value) })}
          className="w-full accent-[#162660]"
        />
        <div className="flex justify-between text-[9px] text-[#162660]/40 font-bold mt-0.5">
          <span>30 min</span><span>5 hours</span>
        </div>
      </div>
    </div>
  );
}

/* ─── Main Panel ─── */
export function RewardConfigPanel({ config, onChange }: Props) {
  const isAI = config.mode === "ai";

  function setMode(mode: "ai" | "custom") {
    onChange({ ...config, mode });
  }

  return (
    <div className="aralkada-card p-5 flex flex-col gap-5 h-full">
      {/* Header */}
      <div>
        <h2 className="text-base font-black text-[#162660]">Screen Time & Reward Mode</h2>
        <p className="text-[11px] font-bold text-[#4A3B2C]/60 mt-0.5">
          Applies to all linked children
        </p>
      </div>

      {/* Mode Toggle */}
      <div className="flex bg-[#F1E4D1] border-2 border-[#4A3B2C]/30 rounded-2xl p-1 gap-1">
        <button
          onClick={() => setMode("ai")}
          className={`flex-1 py-2.5 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center justify-center gap-2 ${
            isAI
              ? "bg-[#162660] text-[#F1E4D1] shadow-[0_2px_0_#0D1638]"
              : "text-[#162660]/60 hover:text-[#162660]"
          }`}
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
              d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
          AI Formula (Mode A)
        </button>
        <button
          onClick={() => setMode("custom")}
          className={`flex-1 py-2.5 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center justify-center gap-2 ${
            !isAI
              ? "bg-[#162660] text-[#F1E4D1] shadow-[0_2px_0_#0D1638]"
              : "text-[#162660]/60 hover:text-[#162660]"
          }`}
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
          </svg>
          Custom Rates (Mode B)
        </button>
      </div>

      {/* Panel content */}
      <div className="flex-1 overflow-y-auto">
        {isAI ? <FormulaPreview /> : <CustomMode config={config} onChange={onChange} />}
      </div>
    </div>
  );
}
