export interface KidMission {
  id: string;
  title: string;
  detail: string;
  steps: string[];
  reward: string;
  stars: number;
  color: string;
  icon: string;
}

export const KID_MISSIONS: KidMission[] = [
  {
    id: "calm-corner",
    title: "Build a calm corner",
    detail: "Make a cozy spot where your brain can reset.",
    steps: ["Choose a quiet spot", "Add one comforting item", "Spend five calm minutes there"],
    reward: "+20 stars",
    stars: 20,
    color: "bg-[#D0E6FD]",
    icon: "✦",
  },
  {
    id: "good-thing",
    title: "Notice one good thing",
    detail: "Find a tiny win from today and write it down.",
    steps: ["Think about your day", "Choose one good moment", "Write or tell someone about it"],
    reward: "+15 stars",
    stars: 15,
    color: "bg-[#FDE68A]",
    icon: "●",
  },
  {
    id: "brave-pause",
    title: "Take a brave pause",
    detail: "Try three slow breaths before your next task.",
    steps: ["Put both feet on the floor", "Breathe in slowly", "Breathe out slowly three times"],
    reward: "+10 stars",
    stars: 10,
    color: "bg-[#FBCFE8]",
    icon: "~",
  },
];

export const MISSION_COMPLETION_KEY = "conscious-future-mission-completions";
export const MISSIONS_UPDATED_EVENT = "conscious-future-missions-updated";

let cachedCompletionsRaw: string | null = null;
let cachedCompletions: Record<string, string> = {};

export function readMissionCompletions(): Record<string, string> {
  if (typeof window === "undefined") return cachedCompletions;
  const saved = window.localStorage.getItem(MISSION_COMPLETION_KEY);
  if (saved === cachedCompletionsRaw) return cachedCompletions;
  if (!saved) {
    cachedCompletionsRaw = saved;
    // Keep returning the same empty reference until something is stored.
    if (Object.keys(cachedCompletions).length !== 0) {
      cachedCompletions = {};
    }
    return cachedCompletions;
  }
  try {
    cachedCompletionsRaw = saved;
    cachedCompletions = JSON.parse(saved) as Record<string, string>;
    return cachedCompletions;
  } catch {
    cachedCompletionsRaw = saved;
    cachedCompletions = {};
    return cachedCompletions;
  }
}

export function completeMission(id: string) {
  const current = readMissionCompletions();
  const firstCompletion = !current[id];
  const next = { ...current, [id]: current[id] ?? new Date().toISOString() };
  const serialized = JSON.stringify(next);
  cachedCompletionsRaw = serialized;
  cachedCompletions = next;
  window.localStorage.setItem(MISSION_COMPLETION_KEY, serialized);
  window.dispatchEvent(new Event(MISSIONS_UPDATED_EVENT));
  return firstCompletion;
}

export function subscribeToMissions(onChange: () => void) {
  window.addEventListener("storage", onChange);
  window.addEventListener(MISSIONS_UPDATED_EVENT, onChange);
  return () => {
    window.removeEventListener("storage", onChange);
    window.removeEventListener(MISSIONS_UPDATED_EVENT, onChange);
  };
}
