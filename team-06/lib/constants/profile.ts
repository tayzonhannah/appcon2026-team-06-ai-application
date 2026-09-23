export type ProfileLabel = "Growing" | "Developing" | "Strong";

export interface ProfileTrait {
  name: string;
  label: ProfileLabel;
  description: string;
  color: string;
}

export interface AssessmentQuestion {
  prompt: string;
  options: {
    label: string;
    traits: Partial<Record<"empathy" | "selfAwareness" | "resilience" | "introversion", number>>;
  }[];
}

export const PROFILE_COMPLETION_KEY = "conscious-future-parent-profile-complete";
export const PROFILE_DATA_KEY = "conscious-future-parent-profile-data";

export const ASSESSMENT_QUESTIONS: AssessmentQuestion[] = [
  {
    prompt: "When someone close to you is having a hard day, what feels most natural?",
    options: [
      { label: "I notice their mood and make space to listen.", traits: { empathy: 2 } },
      { label: "I offer practical help and check in later.", traits: { empathy: 1, selfAwareness: 1 } },
      { label: "I give them room until they are ready to talk.", traits: { introversion: 2 } },
    ],
  },
  {
    prompt: "After a difficult moment, how do you usually find your footing?",
    options: [
      { label: "I reflect on what happened and name what I need.", traits: { selfAwareness: 2 } },
      { label: "I reset with a small routine and try again.", traits: { resilience: 2 } },
      { label: "I need quiet time before I can make sense of it.", traits: { introversion: 1, selfAwareness: 1 } },
    ],
  },
  {
    prompt: "When a new family plan is suggested, how do you tend to respond?",
    options: [
      { label: "I get curious and help everyone find a comfortable starting point.", traits: { empathy: 1, resilience: 1 } },
      { label: "I like to think it through before I commit.", traits: { introversion: 2 } },
      { label: "I am happy to experiment and adjust as we learn.", traits: { resilience: 2 } },
    ],
  },
  {
    prompt: "What helps you create a connected moment with your child?",
    options: [
      { label: "Being fully present and asking how their world feels.", traits: { empathy: 2 } },
      { label: "Doing something side by side without pressure to talk.", traits: { introversion: 1, empathy: 1 } },
      { label: "Turning a challenge into a small, hopeful next step.", traits: { resilience: 1, selfAwareness: 1 } },
    ],
  },
];

export const DEFAULT_PROFILE_TRAITS: ProfileTrait[] = [
  {
    name: "Empathy",
    label: "Strong",
    description: "You make room for other people’s feelings and notice the moments when connection matters most.",
    color: "#2563EB",
  },
  {
    name: "Self-awareness",
    label: "Developing",
    description: "You are building a thoughtful habit of checking in with your own needs before choosing your next step.",
    color: "#EC4899",
  },
  {
    name: "Resilience",
    label: "Strong",
    description: "You tend to turn setbacks into useful information and look for a practical way forward.",
    color: "#F59E0B",
  },
  {
    name: "Introversion",
    label: "Growing",
    description: "Quiet reflection is an important source of energy and helps you show up with intention.",
    color: "#14B8A6",
  },
];

export function getProfileTraits(answers: number[]): ProfileTrait[] {
  const totals = answers.reduce<Record<string, number>>((result, answerIndex, questionIndex) => {
    const selected = ASSESSMENT_QUESTIONS[questionIndex]?.options[answerIndex];
    Object.entries(selected?.traits ?? {}).forEach(([trait, value]) => {
      result[trait] = (result[trait] ?? 0) + (value ?? 0);
    });
    return result;
  }, {});

  return DEFAULT_PROFILE_TRAITS.map((trait) => {
    const key = trait.name === "Self-awareness" ? "selfAwareness" : trait.name.toLowerCase();
    const total = totals[key] ?? 0;
    const label: ProfileLabel = total >= 5 ? "Strong" : total >= 3 ? "Developing" : "Growing";
    return { ...trait, label };
  });
}
