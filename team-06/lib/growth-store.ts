export type ActionStatus = "active" | "complete";
export type ActionProgress = "assigned" | "submitted" | "approved";

export interface GrowthAction {
  id: string;
  childId: string;
  name: string;
  description: string;
  definitionOfDone: string;
  status: ActionStatus;
  progress: ActionProgress;
  completionNote?: string;
  feedback?: string;
  createdAt: string;
}

export interface TokenAward {
  id: string;
  childId: string;
  actionId: string;
  minutes: number;
  earnedAt: string;
  expiresAt: string;
}

export const GROWTH_ACTIONS_KEY = "conscious-future-growth-actions";
export const GROWTH_TOKENS_KEY = "conscious-future-growth-tokens";
export const GROWTH_ACTIONS_EVENT = "conscious-future-growth-actions-updated";

let cachedActionsRaw: string | null = null;
let cachedActions: GrowthAction[] = [];
let cachedTokensKey = "";
let cachedAvailableTokens: TokenAward[] = [];

export function readGrowthActions(): GrowthAction[] {
  if (typeof window === "undefined") return [];

  const savedActions = window.localStorage.getItem(GROWTH_ACTIONS_KEY);
  if (savedActions === cachedActionsRaw) return cachedActions;
  if (!savedActions) {
    cachedActionsRaw = null;
    cachedActions = [];
    return cachedActions;
  }

  try {
    cachedActionsRaw = savedActions;
    cachedActions = JSON.parse(savedActions) as GrowthAction[];
    return cachedActions;
  } catch {
    cachedActionsRaw = savedActions;
    cachedActions = [];
    return [];
  }
}

export function saveGrowthAction(action: GrowthAction) {
  const actions = readGrowthActions().filter((current) => current.id !== action.id);
  const nextActions = [action, ...actions];
  const serialized = JSON.stringify(nextActions);
  cachedActionsRaw = serialized;
  cachedActions = nextActions;
  window.localStorage.setItem(GROWTH_ACTIONS_KEY, serialized);
  window.dispatchEvent(new Event(GROWTH_ACTIONS_EVENT));
}

export function submitGrowthAction(actionId: string, completionNote = "") {
  const actions = readGrowthActions().map((action) =>
    action.id === actionId
      ? { ...action, progress: "submitted" as const, completionNote: completionNote.trim() }
      : action,
  );
  const serialized = JSON.stringify(actions);
  cachedActionsRaw = serialized;
  cachedActions = actions;
  window.localStorage.setItem(GROWTH_ACTIONS_KEY, serialized);
  window.dispatchEvent(new Event(GROWTH_ACTIONS_EVENT));
}

export const MISSION_TOKEN_MINUTES = 5;
export const ACTION_TOKEN_MINUTES = 15;

export function mintTokenAward(childId: string, actionId: string, minutes: number) {
  if (typeof window === "undefined") return;
  const earnedAt = new Date();
  const award: TokenAward = {
    id: `token-${actionId}-${Date.now()}`,
    childId,
    actionId,
    minutes,
    earnedAt: earnedAt.toISOString(),
    expiresAt: new Date(earnedAt.getTime() + 24 * 60 * 60 * 1000).toISOString(),
  };
  const tokens = readTokenAwards().filter((token) => token.actionId !== actionId);
  window.localStorage.setItem(GROWTH_TOKENS_KEY, JSON.stringify([award, ...tokens]));
  window.dispatchEvent(new Event(GROWTH_ACTIONS_EVENT));
}

export function approveGrowthAction(actionId: string, minutes = ACTION_TOKEN_MINUTES) {
  const action = readGrowthActions().find((current) => current.id === actionId);
  if (!action) return;

  const actions = readGrowthActions().map((current) =>
    current.id === actionId ? { ...current, progress: "approved" as const, feedback: "" } : current,
  );
  const serialized = JSON.stringify(actions);
  cachedActionsRaw = serialized;
  cachedActions = actions;
  window.localStorage.setItem(GROWTH_ACTIONS_KEY, serialized);

  mintTokenAward(action.childId, actionId, minutes);
}

export function rejectGrowthAction(actionId: string, feedback = "") {
  const actions = readGrowthActions().map((action) =>
    action.id === actionId
      ? { ...action, progress: "assigned" as const, feedback: feedback.trim() }
      : action,
  );
  const serialized = JSON.stringify(actions);
  cachedActionsRaw = serialized;
  cachedActions = actions;
  window.localStorage.setItem(GROWTH_ACTIONS_KEY, serialized);
  window.dispatchEvent(new Event(GROWTH_ACTIONS_EVENT));
}

export function readTokenAwards(): TokenAward[] {
  if (typeof window === "undefined") return [];
  const savedTokens = window.localStorage.getItem(GROWTH_TOKENS_KEY);
  if (!savedTokens) return [];
  try {
    return JSON.parse(savedTokens) as TokenAward[];
  } catch {
    return [];
  }
}

export function readAvailableTokens(childId: string) {
  const nowMinute = Math.floor(Date.now() / 60000);
  const rawTokens = typeof window === "undefined" ? "" : window.localStorage.getItem(GROWTH_TOKENS_KEY) ?? "";
  const cacheKey = `${childId}:${nowMinute}:${rawTokens}`;
  if (cacheKey === cachedTokensKey) return cachedAvailableTokens;

  cachedTokensKey = cacheKey;
  cachedAvailableTokens = readTokenAwards().filter(
    (token) => token.childId === childId && new Date(token.expiresAt).getTime() > Date.now(),
  );
  return cachedAvailableTokens;
}

export function subscribeToGrowthActions(onChange: () => void) {
  window.addEventListener("storage", onChange);
  window.addEventListener(GROWTH_ACTIONS_EVENT, onChange);
  return () => {
    window.removeEventListener("storage", onChange);
    window.removeEventListener(GROWTH_ACTIONS_EVENT, onChange);
  };
}

export function seedDemoKid() {
  if (typeof window === "undefined") return;
  if (!window.localStorage.getItem(GROWTH_ACTIONS_KEY)) {
    const demoAction: GrowthAction = {
      id: "action-demo-tidy",
      childId: "kid-101",
      name: "Tidy your calm corner",
      description: "Put three things back where they belong in your calm corner.",
      definitionOfDone: "Corner looks tidy and you sat there for one calm minute.",
      status: "active",
      progress: "submitted",
      completionNote: "I put my books back and sat quietly!",
      createdAt: new Date().toISOString(),
    };
    const serialized = JSON.stringify([demoAction]);
    cachedActionsRaw = serialized;
    cachedActions = [demoAction];
    window.localStorage.setItem(GROWTH_ACTIONS_KEY, serialized);
  }
  if (!window.localStorage.getItem(GROWTH_TOKENS_KEY)) {
    const earnedAt = new Date(Date.now() - 2 * 60 * 60 * 1000);
    const award: TokenAward = {
      id: `token-seed-${Date.now()}`,
      childId: "kid-101",
      actionId: "seed-welcome",
      minutes: 10,
      earnedAt: earnedAt.toISOString(),
      expiresAt: new Date(earnedAt.getTime() + 24 * 60 * 60 * 1000).toISOString(),
    };
    window.localStorage.setItem(GROWTH_TOKENS_KEY, JSON.stringify([award]));
  }
  window.dispatchEvent(new Event(GROWTH_ACTIONS_EVENT));
}
