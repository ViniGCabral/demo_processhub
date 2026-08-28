import { create } from "zustand";
import { persist } from "zustand/middleware";

interface BusinessUnitState {
  units: string[];
  addUnit: (name: string) => void;
  removeUnit: (name: string) => void;
  setUnits: (units: string[]) => void;
}

const DEFAULT_UNITS = ["SOMOS/Saber", "Red Ballon", "PROFS"];

export const useBusinessUnitStore = create<BusinessUnitState>()(
  persist(
    (set) => ({
      units: DEFAULT_UNITS,

      addUnit: (name) =>
        set((state) => {
          const clean = name.trim();
          if (!clean || state.units.some((u) => u.toLowerCase() === clean.toLowerCase())) {
            return state;
          }
          return { units: [...state.units, clean] };
        }),

      removeUnit: (name) =>
        set((state) => ({ units: state.units.filter((u) => u !== name) })),

      setUnits: (units) => set({ units }),
    }),
    {
      name: "business-units-storage",
      version: 4,
      // Refresh the seeded example units for existing sessions.
      migrate: () => ({ units: DEFAULT_UNITS }) as Partial<BusinessUnitState>,
    }
  )
);
