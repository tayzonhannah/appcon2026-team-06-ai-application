"use client";

import { FormEvent, useState } from "react";
import { GrowthAction, saveGrowthAction } from "@/lib/growth-store";
import { KidChallenge, saveChallenge } from "@/lib/challenge-store";

interface Challenge {
  name: string;
  description: string;
  milestones: string[];
  timeline: string;
  minutes: number;
}

const timelineOptions = ["1 week", "2 weeks", "1 month", "Custom timeline"];
const minuteOptions = [10, 15, 20, 30];

export default function ChallengePage() {
  const [actionName, setActionName] = useState("");
  const [actionDescription, setActionDescription] = useState("");
  const [definitionOfDone, setDefinitionOfDone] = useState("");
  const [actionStatus, setActionStatus] = useState<GrowthAction["status"]>("active");
  const [activeAction, setActiveAction] = useState<GrowthAction | null>(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [milestones, setMilestones] = useState(["", ""]);
  const [timeline, setTimeline] = useState(timelineOptions[0]);
  const [minutes, setMinutes] = useState(minuteOptions[1]);
  const [activeChallenge, setActiveChallenge] = useState<Challenge | null>(null);

  const updateMilestone = (index: number, value: string) => {
    setMilestones((current) => current.map((item, itemIndex) => (itemIndex === index ? value : item)));
  };

  const addMilestone = () => setMilestones((current) => [...current, ""]);

  const removeMilestone = (index: number) => {
    setMilestones((current) => current.filter((_, itemIndex) => itemIndex !== index));
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const cleanedMilestones = milestones.map((milestone) => milestone.trim()).filter(Boolean);
    const draft: Challenge = {
      name: name.trim(),
      description: description.trim(),
      milestones: cleanedMilestones,
      timeline,
      minutes,
    };
    setActiveChallenge(draft);
    const challenge: KidChallenge = {
      id: `challenge-${Date.now()}`,
      childId: "kid-101",
      title: draft.name,
      description: draft.description,
      milestones: cleanedMilestones,
      timeline,
      minutes,
      status: "active",
      progress: "assigned",
      createdAt: new Date().toISOString(),
    };
    saveChallenge(challenge);
  };

  const handleActionSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const action: GrowthAction = {
      id: `action-${Date.now()}`,
      childId: "kid-101",
      name: actionName.trim(),
      description: actionDescription.trim(),
      definitionOfDone: definitionOfDone.trim(),
      status: actionStatus,
      progress: "assigned",
      createdAt: new Date().toISOString(),
    };
    saveGrowthAction(action);
    setActiveAction(action);
    setActionName("");
    setActionDescription("");
    setDefinitionOfDone("");
  };

  return (
    <div className="flex flex-col gap-6 py-6">
      <section className="flex flex-col gap-4 border-b-2 border-[#4A3B2C]/20 pb-6">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[#162660]/60">Offline action</p>
          <h2 className="mt-1 text-2xl font-black tracking-tight text-[#162660]">Choose an action</h2>
          <p className="mt-1 text-sm font-bold text-[#162660]/70">Define one small thing your kid can practice today.</p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1.3fr)_minmax(280px,0.7fr)]">
          <form onSubmit={handleActionSubmit} className="aralkada-card flex flex-col gap-4 p-5 sm:p-6">
            <div>
              <label htmlFor="action-name" className="mb-1.5 block text-xs font-black uppercase tracking-wider text-[#162660]">Action name</label>
              <input id="action-name" required value={actionName} onChange={(event) => setActionName(event.target.value)} placeholder="Pack away devices before dinner" className="aralkada-input w-full px-4 py-3 text-sm" />
            </div>

            <div>
              <label htmlFor="action-description" className="mb-1.5 block text-xs font-black uppercase tracking-wider text-[#162660]">Action description</label>
              <textarea id="action-description" required value={actionDescription} onChange={(event) => setActionDescription(event.target.value)} placeholder="What should your kid do?" rows={3} className="aralkada-input w-full resize-y px-4 py-3 text-sm" />
            </div>

            <div>
              <label htmlFor="definition-of-done" className="mb-1.5 block text-xs font-black uppercase tracking-wider text-[#162660]">Definition of done</label>
              <input id="definition-of-done" required value={definitionOfDone} onChange={(event) => setDefinitionOfDone(event.target.value)} placeholder="Devices are in the charging basket by 6 PM" className="aralkada-input w-full px-4 py-3 text-sm" />
            </div>

            <button
              type="button"
              onClick={() => setActionStatus((status) => status === "active" ? "complete" : "active")}
              className={`w-full rounded-xl border-2 border-[#4A3B2C] px-4 py-3 text-sm font-black uppercase tracking-wider shadow-[0_3px_0_#4A3B2C] transition hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-[#162660] ${actionStatus === "active" ? "bg-[#D0E6FD] text-[#162660]" : "bg-[#B7E4C7] text-[#162660]"}`}
              aria-pressed={actionStatus === "complete"}
            >
              Status: {actionStatus === "active" ? "Active" : "Complete"}
            </button>

            <button type="submit" className="aralkada-btn-primary mt-1 flex w-full items-center justify-center gap-2 py-3 text-sm">Save action</button>
          </form>

          <aside className="aralkada-card-beige h-fit p-5 sm:p-6">
            <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[#162660]/60">Currently active</p>
            {activeAction ? (
              <div className="mt-3">
                <div className="flex items-start justify-between gap-3">
                  <h3 className="text-xl font-black text-[#162660]">{activeAction.name}</h3>
                  <span className="rounded-full border-2 border-[#4A3B2C] bg-[#D0E6FD] px-2 py-1 text-[10px] font-black uppercase text-[#162660]">{activeAction.status}</span>
                </div>
                <p className="mt-2 text-sm font-bold leading-relaxed text-[#162660]/75">{activeAction.description}</p>
                <div className="mt-4 rounded-xl border-2 border-[#4A3B2C]/30 bg-white p-3">
                  <p className="text-[10px] font-black uppercase tracking-wider text-[#162660]/60">Definition of done</p>
                  <p className="mt-1 text-sm font-bold text-[#162660]">{activeAction.definitionOfDone}</p>
                </div>
                <div className="mt-4 rounded-xl border-2 border-[#162660] bg-[#B7E4C7] p-3 text-sm font-black text-[#162660]" aria-live="polite">
                  Assigned to Leo — now visible on kid home under Offline actions.
                </div>
                <a href="/dashboard" className="mt-3 inline-flex min-h-[44px] items-center justify-center rounded-xl border-2 border-[#162660] bg-white px-4 py-2.5 text-xs font-black uppercase tracking-wider text-[#162660] shadow-[0_2px_0_#162660]">Review in Parent Overview →</a>
              </div>
            ) : (
              <div className="mt-4 rounded-xl border-2 border-dashed border-[#4A3B2C]/40 bg-white/60 p-5 text-sm font-bold leading-relaxed text-[#162660]/65">Your active action will appear here after you save it.</div>
            )}
          </aside>
        </div>
      </section>

      <div className="flex flex-col gap-2 border-b-2 border-[#4A3B2C]/20 pb-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[#162660]/60">Offline skill building</p>
          <h1 className="mt-1 text-2xl font-black tracking-tight text-[#162660] sm:text-3xl">Create a challenge</h1>
          <p className="mt-1 max-w-xl text-sm font-bold text-[#162660]/70">Give your kid a clear goal, small steps, and a timeline they can see.</p>
        </div>
        <span className="w-fit rounded-full border-2 border-[#4A3B2C] bg-[#D0E6FD] px-3 py-1 text-[10px] font-black uppercase tracking-wider text-[#162660] shadow-[0_2px_0_#4A3B2C]">Draft challenge</span>
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1.3fr)_minmax(280px,0.7fr)]">
        <form onSubmit={handleSubmit} className="aralkada-card flex flex-col gap-5 p-5 sm:p-6">
          <div>
            <label htmlFor="challenge-name" className="mb-1.5 block text-xs font-black uppercase tracking-wider text-[#162660]">Challenge name</label>
            <input id="challenge-name" required value={name} onChange={(event) => setName(event.target.value)} placeholder="Try a screen-free morning" className="aralkada-input w-full px-4 py-3 text-sm" />
          </div>

          <div>
            <label htmlFor="challenge-description" className="mb-1.5 block text-xs font-black uppercase tracking-wider text-[#162660]">Description</label>
            <textarea id="challenge-description" required value={description} onChange={(event) => setDescription(event.target.value)} placeholder="What will your kid practice or accomplish?" rows={4} className="aralkada-input w-full resize-y px-4 py-3 text-sm" />
          </div>

          <div>
            <div className="mb-2 flex items-center justify-between gap-3">
              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-[#162660]">Milestones</label>
                <p className="mt-1 text-xs font-bold text-[#162660]/60">Break the challenge into visible wins.</p>
              </div>
              <button type="button" onClick={addMilestone} className="rounded-xl border-2 border-[#162660] bg-[#D0E6FD] px-3 py-2 text-[10px] font-black uppercase tracking-wider text-[#162660] shadow-[0_2px_0_#162660] transition hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-[#162660]">+ Add milestone</button>
            </div>
            <div className="flex flex-col gap-2">
              {milestones.map((milestone, index) => (
                <div key={index} className="flex items-center gap-2">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border-2 border-[#4A3B2C] bg-[#F8F1E5] text-xs font-black text-[#162660]">{index + 1}</span>
                  <input aria-label={`Milestone ${index + 1}`} value={milestone} onChange={(event) => updateMilestone(index, event.target.value)} placeholder={`Milestone ${index + 1}`} className="aralkada-input min-w-0 flex-1 px-3 py-2.5 text-sm" />
                  {milestones.length > 1 && <button type="button" onClick={() => removeMilestone(index)} aria-label={`Remove milestone ${index + 1}`} className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border-2 border-[#4A3B2C] bg-white text-lg font-black text-[#162660] transition hover:bg-[#F1E4D1] focus:outline-none focus:ring-2 focus:ring-[#162660]">×</button>}
                </div>
              ))}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="challenge-timeline" className="mb-1.5 block text-xs font-black uppercase tracking-wider text-[#162660]">Timeline</label>
              <select id="challenge-timeline" value={timeline} onChange={(event) => setTimeline(event.target.value)} className="aralkada-input w-full px-4 py-3 text-sm">
                {timelineOptions.map((option) => <option key={option}>{option}</option>)}
              </select>
            </div>
            <div>
              <label htmlFor="challenge-minutes" className="mb-1.5 block text-xs font-black uppercase tracking-wider text-[#162660]">Screentime reward</label>
              <select id="challenge-minutes" value={minutes} onChange={(event) => setMinutes(Number(event.target.value))} className="aralkada-input w-full px-4 py-3 text-sm">
                {minuteOptions.map((option) => <option key={option} value={option}>+{option} min</option>)}
              </select>
            </div>
          </div>

          <button type="submit" className="aralkada-btn-primary mt-1 flex w-full items-center justify-center gap-2 py-3 text-sm">Create challenge</button>
        </form>

        <aside className="aralkada-card-beige h-fit p-5 sm:p-6">
          <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[#162660]/60">Preview</p>
          {activeChallenge ? (
            <div className="mt-3">
              <h2 className="text-2xl font-black text-[#162660]">{activeChallenge.name}</h2>
              <p className="mt-2 text-sm font-bold leading-relaxed text-[#162660]/75">{activeChallenge.description}</p>
              <div className="mt-5 rounded-xl border-2 border-[#4A3B2C]/30 bg-white p-3">
                <div className="flex items-center justify-between text-xs font-black text-[#162660]"><span>{activeChallenge.milestones.length} milestones</span><span>{activeChallenge.timeline} • +{activeChallenge.minutes} min</span></div>
                <ol className="mt-3 flex flex-col gap-2">
                  {activeChallenge.milestones.map((milestone, index) => <li key={`${milestone}-${index}`} className="flex items-start gap-2 text-sm font-bold text-[#162660]/80"><span className="font-black text-[#162660]">{index + 1}.</span>{milestone}</li>)}
                </ol>
              </div>
              <div className="mt-4 rounded-xl border-2 border-[#162660] bg-[#B7E4C7] p-3 text-sm font-black text-[#162660]" aria-live="polite">
                Assigned to Leo — visible under Kid Challenges. Approval earns +{activeChallenge.minutes} min.
              </div>
            </div>
          ) : (
            <div className="mt-4 rounded-xl border-2 border-dashed border-[#4A3B2C]/40 bg-white/60 p-5 text-sm font-bold leading-relaxed text-[#162660]/65">Your challenge preview will appear here after you create it.</div>
          )}
        </aside>
      </div>
    </div>
  );
}
