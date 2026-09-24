export interface CompassChoice {
  id: string;
  label: string;
  next: string;
}

export interface CompassNode {
  id: string;
  prompt: string;
  choices: CompassChoice[];
  support?: string;
}

/**
 * Guiding (Socratic) sample flow — Compass asks, never tells directly.
 * Entry nodes match the 4 quick prompts already on the kid chatbot page.
 */
export const COMPASS_FLOW: Record<string, CompassNode> = {
  start: {
    id: "start",
    prompt: "What feels biggest right now?",
    choices: [
      { id: "stuck", label: "I feel stuck on my mission", next: "stuck-tried" },
      { id: "mistake", label: "I made a mistake", next: "mistake-part" },
      { id: "calm", label: "I need a calm-down idea", next: "calm-body" },
      { id: "retry", label: "I want to try again", next: "retry-small" },
    ],
  },
  "stuck-tried": {
    id: "stuck-tried",
    prompt: "That happens to every learner. What have you already tried?",
    choices: [
      { id: "one-step", label: "Only the first step", next: "stuck-next" },
      { id: "all-steps", label: "All the steps", next: "stuck-next" },
      { id: "not-yet", label: "Nothing yet", next: "stuck-next" },
    ],
  },
  "stuck-next": {
    id: "stuck-next",
    prompt: "What tiny step could you try in the next 5 minutes?",
    choices: [
      { id: "ask-info", label: "Ask what info is missing", next: "done-plan" },
      { id: "smaller", label: "Make the step smaller", next: "done-plan" },
      { id: "compass-help", label: "Ask Compass for an idea", next: "done-plan" },
    ],
    support: "Pick the easiest one. Small wins build brave brains.",
  },
  "mistake-part": {
    id: "mistake-part",
    prompt: "A mistake is a clue, not a label. Which part felt tricky?",
    choices: [
      { id: "start-part", label: "Starting", next: "mistake-retry" },
      { id: "middle-part", label: "The middle", next: "mistake-retry" },
      { id: "finish-part", label: "Finishing", next: "mistake-retry" },
    ],
  },
  "mistake-retry": {
    id: "mistake-retry",
    prompt: "What is one small part you could try with a new strategy?",
    choices: [
      { id: "slower", label: "Try it slower", next: "done-plan" },
      { id: "ask-grown", label: "Ask a grown-up to watch once", next: "done-plan" },
      { id: "different", label: "Try a different way", next: "done-plan" },
    ],
    support: "Mistakes help your brain grow stronger.",
  },
  "calm-body": {
    id: "calm-body",
    prompt: "Let's check your body. Where do you feel wobbly?",
    choices: [
      { id: "breath", label: "Tight chest / fast breath", next: "calm-practice" },
      { id: "hands", label: "Shaky hands", next: "calm-practice" },
      { id: "head", label: "Busy head", next: "calm-practice" },
    ],
  },
  "calm-practice": {
    id: "calm-practice",
    prompt: "Try this: feet flat, breathe in slowly, breathe out slowly 3 times. How do you feel now?",
    choices: [
      { id: "calmer", label: "A little calmer", next: "done-plan" },
      { id: "same", label: "About the same", next: "done-plan" },
      { id: "worse", label: "Still wobbly", next: "done-grownup" },
    ],
    support: "You can repeat the brave pause anytime.",
  },
  "retry-small": {
    id: "retry-small",
    prompt: "That is a brave choice. What is the easiest next step?",
    choices: [
      { id: "first", label: "Redo the first step", next: "done-plan" },
      { id: "favorite", label: "Do my favorite part", next: "done-plan" },
      { id: "together", label: "Do it with someone", next: "done-plan" },
    ],
  },
  "done-plan": {
    id: "done-plan",
    prompt: "Nice plan. Say it back: what will you try first?",
    choices: [
      { id: "got-it", label: "I have my tiny step", next: "done-cheer" },
      { id: "not-sure", label: "Still not sure", next: "done-grownup" },
    ],
    support: "You chose it yourself — that is self-sufficiency growing.",
  },
  "done-cheer": {
    id: "done-cheer",
    prompt: "You did it — that was self-sufficiency in action! One small win changes everything. What do you want to do next?",
    choices: [
      { id: "go-missions", label: "Go to my missions ✦", next: "start" },
      { id: "restart", label: "Talk to Compass again", next: "start" },
    ],
    support: "Every brave choice builds a stronger you. Keep going.",
  },
  "done-grownup": {
    id: "done-grownup",
    prompt: "Thank you for noticing. Please tell your parent or another trusted adult what is going on.",
    choices: [{ id: "restart", label: "Start over", next: "start" }],
  },
};

export function nextNode(currentId: string, choiceId: string): CompassNode {
  const current = COMPASS_FLOW[currentId] ?? COMPASS_FLOW.start;
  const choice = current.choices.find((c) => c.id === choiceId);
  return COMPASS_FLOW[choice?.next ?? "start"] ?? COMPASS_FLOW.start;
}
