import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { User, UserRole } from "@/lib/types";
import { getDemoUser } from "@/lib/data/seed";

interface UserState {
  currentUser: User | null;
  demoRole: UserRole;
  setCurrentUser: (user: User) => void;
  switchDemoRole: (role: UserRole) => void;
  logout: () => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      currentUser: getDemoUser("employee"),
      demoRole: "employee",
      setCurrentUser: (user) => set({ currentUser: user }),
      switchDemoRole: (role) =>
        set({ demoRole: role, currentUser: getDemoUser(role) }),
      logout: () => set({ currentUser: null, demoRole: "employee" }),
    }),
    { name: "strata-user" }
  )
);
