import { FocusArea } from "./analytics";

export interface ChildChallenge {
  id: string;
  childId: string;
  title: string;
  description: string;
  earnedMinutes: number;
  targetFocusArea: FocusArea;
  milestones: string[];
  status: "ongoing" | "done";
  category: string;
}

export interface ChildAction {
  id: string;
  childId: string;
  title: string;
  category: string;
  earnedMinutes: number;
  status: "pending" | "completed";
}

export const INITIAL_CHALLENGES: ChildChallenge[] = [
  {
    id: "ch-1",
    childId: "kid-101",
    title: "Mindful Homework Sprint",
    description: "Complete math workbook chapter with zero device interruptions and log reflections.",
    earnedMinutes: 30,
    targetFocusArea: "Homework & Academic Focus",
    milestones: [
      "Set a 25-minute Pomodoro focus timer",
      "Complete exercises without switching to tablet",
      "Re-check answers and note one mistake learned",
    ],
    status: "ongoing",
    category: "Academic",
  },
  {
    id: "ch-2",
    childId: "kid-101",
    title: "Board Game Sportsmanship Trial",
    description: "Play a competitive family game with focus on calm breathing when losing a turn.",
    earnedMinutes: 25,
    targetFocusArea: "Emotional Regulation",
    milestones: [
      "Congratulate winner immediately after game",
      "Practice 3 deep belly breaths when frustrated",
      "Help pack up the board game pieces",
    ],
    status: "ongoing",
    category: "Emotional",
  },
  {
    id: "ch-3",
    childId: "kid-101",
    title: "Offline Reading Marathon",
    description: "Read an illustrated chapter book outdoors or in the reading nook.",
    earnedMinutes: 20,
    targetFocusArea: "Homework & Academic Focus",
    milestones: [
      "Read 15 consecutive pages without prompts",
      "Summarize the main character to a parent",
    ],
    status: "done",
    category: "Academic",
  },
  {
    id: "ch-4",
    childId: "kid-102",
    title: "Creative Storyboarding & Sharing",
    description: "Draft a 4-panel comic strip and share it during dinner with family.",
    earnedMinutes: 35,
    targetFocusArea: "Sharing & Social Skills",
    milestones: [
      "Draw 4 comic panels with dialogue",
      "Explain the story to family without rushing",
      "Ask for one piece of positive feedback",
    ],
    status: "ongoing",
    category: "Creative",
  },
  {
    id: "ch-5",
    childId: "kid-102",
    title: "Frustration Cool-Down Challenge",
    description: "Use the Feelings Wheel when angry instead of shutting down.",
    earnedMinutes: 20,
    targetFocusArea: "Handling Frustration / Losing",
    milestones: [
      "Name the emotion on the Feelings Wheel",
      "Take a 5-minute movement break",
      "Return to the task with a fresh try",
    ],
    status: "ongoing",
    category: "Mindfulness",
  },
];

export const INITIAL_ACTIONS: ChildAction[] = [
  {
    id: "act-1",
    childId: "kid-101",
    title: "Make Bed & Tidy Workspace",
    category: "DAILY ROUTINE",
    earnedMinutes: 15,
    status: "pending",
  },
  {
    id: "act-2",
    childId: "kid-101",
    title: "20-Min Outdoor Bike Ride",
    category: "PHYSICAL HABIT",
    earnedMinutes: 20,
    status: "pending",
  },
  {
    id: "act-3",
    childId: "kid-101",
    title: "Help Set & Clear Dinner Table",
    category: "FAMILY & CHORES",
    earnedMinutes: 15,
    status: "completed",
  },
  {
    id: "act-4",
    childId: "kid-101",
    title: "10-Minute Evening Meditation",
    category: "MINDFULNESS",
    earnedMinutes: 10,
    status: "pending",
  },
  {
    id: "act-5",
    childId: "kid-102",
    title: "Practice Piano Pieces (15 mins)",
    category: "CREATIVE PRACTICE",
    earnedMinutes: 20,
    status: "pending",
  },
  {
    id: "act-6",
    childId: "kid-102",
    title: "Organize School Backpack",
    category: "DAILY ROUTINE",
    earnedMinutes: 15,
    status: "completed",
  },
  {
    id: "act-7",
    childId: "kid-102",
    title: "Help Water Houseplants",
    category: "FAMILY & CHORES",
    earnedMinutes: 10,
    status: "pending",
  },
];
