export interface ChildAnalytics {
  childId: string;
  childName: string;
  avatarLetter: string;
  challenges: {
    ongoing: number;
    done: number;
  };
  actions: {
    ongoing: number;
    done: number;
  };
  tokens: {
    earnedHours: number;
    usedHours: number;
    remainingHours: number;
    totalTokens: number;
  };
}

export const MOCK_CHILDREN_LIST: ChildAnalytics[] = [
  {
    childId: "kid-101",
    childName: "Leo",
    avatarLetter: "L",
    challenges: {
      ongoing: 3,
      done: 8,
    },
    actions: {
      ongoing: 5,
      done: 19,
    },
    tokens: {
      earnedHours: 4.5,
      usedHours: 2.0,
      remainingHours: 2.5,
      totalTokens: 90,
    },
  },
  {
    childId: "kid-102",
    childName: "Maya",
    avatarLetter: "M",
    challenges: {
      ongoing: 2,
      done: 11,
    },
    actions: {
      ongoing: 4,
      done: 22,
    },
    tokens: {
      earnedHours: 5.0,
      usedHours: 1.5,
      remainingHours: 3.5,
      totalTokens: 110,
    },
  },
];

export const MOCK_CHILD_ANALYTICS: ChildAnalytics = MOCK_CHILDREN_LIST[0];
