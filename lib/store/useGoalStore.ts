import { create } from "zustand";
import type { Goal, GoalSheet, GoalSheetStatus } from "@/lib/types";

interface GoalDraft {
  intentionStatement: string;
  goals: Partial<Goal>[];
  lastSaved?: Date;
}

interface GoalState {
  draft: GoalDraft;
  activeSheet: GoalSheet | null;
  isFirstLayerCeremonyDone: boolean;
  setDraft: (draft: Partial<GoalDraft>) => void;
  addGoalToDraft: (goal: Partial<Goal>) => void;
  updateGoalInDraft: (index: number, updates: Partial<Goal>) => void;
  removeGoalFromDraft: (index: number) => void;
  updateWeightage: (index: number, weightage: number) => void;
  setActiveSheet: (sheet: GoalSheet | null) => void;
  markFirstLayerCeremonyDone: () => void;
  clearDraft: () => void;
  saveDraft: () => void;
}

const DEFAULT_DRAFT: GoalDraft = {
  intentionStatement: "",
  goals: [],
};

export const useGoalStore = create<GoalState>()((set, get) => ({
  draft: DEFAULT_DRAFT,
  activeSheet: null,
  isFirstLayerCeremonyDone: false,

  setDraft: (updates) =>
    set((state) => ({ draft: { ...state.draft, ...updates } })),

  addGoalToDraft: (goal) =>
    set((state) => ({
      draft: {
        ...state.draft,
        goals: [...state.draft.goals, { ...goal, displayOrder: state.draft.goals.length + 1 }],
      },
    })),

  updateGoalInDraft: (index, updates) =>
    set((state) => ({
      draft: {
        ...state.draft,
        goals: state.draft.goals.map((g, i) => (i === index ? { ...g, ...updates } : g)),
      },
    })),

  removeGoalFromDraft: (index) =>
    set((state) => ({
      draft: {
        ...state.draft,
        goals: state.draft.goals.filter((_, i) => i !== index).map((g, i) => ({ ...g, displayOrder: i + 1 })),
      },
    })),

  updateWeightage: (index, weightage) =>
    set((state) => ({
      draft: {
        ...state.draft,
        goals: state.draft.goals.map((g, i) => (i === index ? { ...g, weightage } : g)),
      },
    })),

  setActiveSheet: (sheet) => set({ activeSheet: sheet }),

  markFirstLayerCeremonyDone: () => set({ isFirstLayerCeremonyDone: true }),

  clearDraft: () => set({ draft: DEFAULT_DRAFT }),

  saveDraft: () =>
    set((state) => ({
      draft: { ...state.draft, lastSaved: new Date() },
    })),
}));
