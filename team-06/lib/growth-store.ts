export type ActionStatus = "active" | "complete";
export type ActionProgress = "assigned" | "submitted";

export interface GrowthAction {
  id: string;
  childId: string;
  name: string;
  description: string;
  definitionOfDone: string;
  status: ActionStatus;
  progress: ActionProgress;
  createdAt: string;
}

export const GROWTH_ACTIONS_KEY = "conscious-future-growth-actions";
export const GROWTH_ACTIONS_EVENT = "conscious-future-growth-actions-updated";

let cachedActionsRaw: string | null = null;
let cachedActions: GrowthAction[] = [];

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

export function submitGrowthAction(actionId: string) {
  const actions = readGrowthActions().map((action) =>
    action.id === actionId ? { ...action, progress: "submitted" as const } : action,
  );
  const serialized = JSON.stringify(actions);
  cachedActionsRaw = serialized;
  cachedActions = actions;
  window.localStorage.setItem(GROWTH_ACTIONS_KEY, serialized);
  window.dispatchEvent(new Event(GROWTH_ACTIONS_EVENT));
}

export function subscribeToGrowthActions(onChange: () => void) {
  window.addEventListener("storage", onChange);
  window.addEventListener(GROWTH_ACTIONS_EVENT, onChange);
  return () => {
    window.removeEventListener("storage", onChange);
    window.removeEventListener(GROWTH_ACTIONS_EVENT, onChange);
  };
}
