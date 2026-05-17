import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { GoalSheet, QuarterlyUpdate, PreMeetingBrief } from "@/lib/types";
import { GOAL_SHEETS, QUARTERLY_UPDATES, PRE_MEETING_BRIEFS } from "@/lib/data/seed";

interface DataState {
  goalSheets: GoalSheet[];
  updates: QuarterlyUpdate[];
  briefs: PreMeetingBrief[];
  saveGoalSheet: (sheet: GoalSheet) => void;
  updateGoalSheetStatus: (sheetId: string, status: GoalSheet["status"]) => void;
  addUpdate: (update: QuarterlyUpdate) => void;
  addBrief: (brief: PreMeetingBrief) => void;
}

export const useDataStore = create<DataState>()(
  persist(
    (set) => ({
      goalSheets: GOAL_SHEETS,
      updates: QUARTERLY_UPDATES,
      briefs: PRE_MEETING_BRIEFS,
      
      saveGoalSheet: (sheet) => set((state) => {
        const exists = state.goalSheets.find(s => s.id === sheet.id);
        if (exists) {
          return { goalSheets: state.goalSheets.map(s => s.id === sheet.id ? sheet : s) };
        }
        return { goalSheets: [...state.goalSheets, sheet] };
      }),
      
      updateGoalSheetStatus: (sheetId, status) => set((state) => ({
        goalSheets: state.goalSheets.map(s => s.id === sheetId ? { ...s, status } : s)
      })),
      
      addUpdate: (update) => set((state) => ({
        updates: [...state.updates, update]
      })),
      
      addBrief: (brief) => set((state) => ({
        briefs: [...state.briefs, brief]
      }))
    }),
    {
      name: "strata-data-storage",
    }
  )
);
