export type EmotionKind = "sad" | "angry" | "scared" | "stuck";

const KEYWORDS: Record<EmotionKind, string[]> = {
  sad: ["sad", "cry", "lonely", "down", "upset"],
  angry: ["angry", "mad", "annoyed", "frustrated"],
  scared: ["scared", "afraid", "worried", "nervous"],
  stuck: ["stuck", "hard", "can't", "cannot", "give up"],
};

const NUDGES: Record<EmotionKind, string> = {
  sad: "It's okay to feel sad. Try your calm corner for 5 minutes, then tell someone one good thing.",
  angry: "Angry feelings are signals. Take a brave pause — 3 slow breaths — before your next step.",
  scared: "Feeling scared means you care. Pick the tiniest step and ask a grown-up to stay close.",
  stuck: "Stuck is normal. Make the step smaller or ask Compass for one idea.",
};

export function detectEmotionNudge(text: string): { emotion: EmotionKind; message: string } | null {
  const lower = text.toLowerCase();
  for (const emotion of Object.keys(KEYWORDS) as EmotionKind[]) {
    if (KEYWORDS[emotion].some((word) => lower.includes(word))) {
      return { emotion, message: NUDGES[emotion] };
    }
  }
  return null;
}

export function maybeStallNudge(incompleteCount: number): string | null {
  if (incompleteCount >= 2) {
    return "Two missions are waiting. Pick the smallest one — one small win counts.";
  }
  return null;
}
