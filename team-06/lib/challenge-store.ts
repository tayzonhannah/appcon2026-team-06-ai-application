import { mintTokenAward } from "@/lib/growth-store";

export type ChallengeStatus = "active" | "complete";
export type ChallengeProgress = "assigned" | "submitted" | "approved";

export interface KidChallenge {
  id: string;
  childId: string;
  title: string;
  description: string;
  milestones: string[];
  timeline: string;
  minutes: number;
  status: ChallengeStatus;
  progress: ChallengeProgress;
  report?: string;
  feedback?: string;
  createdAt: string;
}

export const KID_CHALLENGES_KEY = "conscious-future-kid-challenges";
export const KID_CHALLENGES_EVENT = "conscious-future-kid-challenges-updated";

let cachedRaw: string | null = null;
let cached: KidChallenge[] = [];

export function readChallenges(): KidChallenge[] {
  if (typeof window === "undefined") return [];
  const saved = window.localStorage.getItem(KID_CHALLENGES_KEY);
  if (saved === cachedRaw) return cached;
  if (!saved) {
    cachedRaw = null;
    cached = [];
    return cached;
  }
  try {
    cachedRaw = saved;
    cached = JSON.parse(saved) as KidChallenge[];
    return cached;
  } catch {
    cachedRaw = saved;
    cached = [];
    return [];
  }
}

function persist(next: KidChallenge[]) {
  const serialized = JSON.stringify(next);
  cachedRaw = serialized;
  cached = next;
  window.localStorage.setItem(KID_CHALLENGES_KEY, serialized);
  window.dispatchEvent(new Event(KID_CHALLENGES_EVENT));
}

export function saveChallenge(challenge: KidChallenge) {
  const next = [challenge, ...readChallenges().filter((c) => c.id !== challenge.id)];
  persist(next);
}

export function submitChallenge(id: string, report = "") {
  const next = readChallenges().map((c) =>
    c.id === id ? { ...c, progress: "submitted" as const, report: report.trim() } : c,
  );
  persist(next);
}

export function approveChallenge(id: string) {
  const challenge = readChallenges().find((c) => c.id === id);
  if (!challenge) return;
  const next = readChallenges().map((c) =>
    c.id === id ? { ...c, progress: "approved" as const, feedback: "" } : c,
  );
  persist(next);
  mintTokenAward(challenge.childId, `challenge-${id}`, challenge.minutes);
}

export function rejectChallenge(id: string, feedback = "") {
  const next = readChallenges().map((c) =>
    c.id === id ? { ...c, progress: "assigned" as const, feedback: feedback.trim() } : c,
  );
  persist(next);
}

export function subscribeToChallenges(onChange: () => void) {
  window.addEventListener("storage", onChange);
  window.addEventListener(KID_CHALLENGES_EVENT, onChange);
  return () => {
    window.removeEventListener("storage", onChange);
    window.removeEventListener(KID_CHALLENGES_EVENT, onChange);
  };
}
