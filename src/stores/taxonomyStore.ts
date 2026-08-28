import { create } from "zustand";
import { persist } from "zustand/middleware";

export type TaxonomyLevel = "l1" | "l2" | "l3" | "l4";

export interface TaxonomyLabels {
  l1: string;
  l2: string;
  l3: string;
  l4: string;
}

export const DEFAULT_TAXONOMY_LABELS: TaxonomyLabels = {
  l1: "L1",
  l2: "L2",
  l3: "L3",
  l4: "L4",
};

interface TaxonomyStore {
  labels: TaxonomyLabels;
  /** Deepest level in use. Processes are attached to this level. */
  maxLevel: 2 | 3 | 4;
  setLabel: (level: TaxonomyLevel, value: string) => void;
  setMaxLevel: (level: 2 | 3 | 4) => void;
  resetTaxonomy: () => void;
}

export const useTaxonomyStore = create<TaxonomyStore>()(
  persist(
    (set) => ({
      labels: DEFAULT_TAXONOMY_LABELS,
      maxLevel: 4,
      setLabel: (level, value) =>
        set((state) => ({ labels: { ...state.labels, [level]: value } })),
      setMaxLevel: (maxLevel) => set({ maxLevel }),
      resetTaxonomy: () => set({ labels: DEFAULT_TAXONOMY_LABELS, maxLevel: 4 }),
    }),
    { name: "taxonomy-storage" }
  )
);

/** Helpers for components: labels with fallback + depth checks. */
export function useTaxonomy() {
  const labels = useTaxonomyStore((s) => s.labels);
  const maxLevel = useTaxonomyStore((s) => s.maxLevel);

  const label = (level: TaxonomyLevel) =>
    (labels[level] || DEFAULT_TAXONOMY_LABELS[level]).trim() ||
    DEFAULT_TAXONOMY_LABELS[level];

  const depth = (level: TaxonomyLevel) => Number(level.slice(1));

  return {
    labels,
    maxLevel,
    label,
    /** true when the level exists in the configured taxonomy */
    hasLevel: (level: TaxonomyLevel) => depth(level) <= maxLevel,
    /** true when the level is the deepest one (processes live here) */
    isLeaf: (level: TaxonomyLevel) => depth(level) === maxLevel,
    leafLabel: label(`l${maxLevel}` as TaxonomyLevel),
  };
}
