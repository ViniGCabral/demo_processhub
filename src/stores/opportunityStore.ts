import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { MockOpportunity } from "@/data/discoverMockData";

export type SavedOpportunityStatus = "backlog" | "em_transformacao" | "concluida";
export type SavedOpportunitySourceMode = "simulate" | "goal" | "scope";

export interface SavedOpportunity extends MockOpportunity {
  // Original mock id (used for de-duplication / "isOpportunitySaved")
  originalId: string;
  // Unique store id
  uid: string;
  savedAt: string; // ISO
  sourceMode: SavedOpportunitySourceMode;
  sourceContext: string;
  status: SavedOpportunityStatus;
}

interface SaveInput {
  op: MockOpportunity;
  sourceMode: SavedOpportunitySourceMode;
  sourceContext: string;
  status?: SavedOpportunityStatus;
}

interface OpportunityState {
  savedOpportunities: SavedOpportunity[];
  saveOpportunity: (input: SaveInput) => SavedOpportunity;
  removeOpportunity: (uid: string) => void;
  isOpportunitySaved: (originalId: string) => boolean;
  getByOriginalId: (originalId: string) => SavedOpportunity | undefined;
  setStatus: (uid: string, status: SavedOpportunityStatus) => void;
}

const genId = () =>
  (typeof crypto !== "undefined" && "randomUUID" in crypto)
    ? crypto.randomUUID()
    : `op_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;

export const useOpportunityStore = create<OpportunityState>()(
  persist(
    (set, get) => ({
      savedOpportunities: [],
      saveOpportunity: ({ op, sourceMode, sourceContext, status = "backlog" }) => {
        const existing = get().savedOpportunities.find((s) => s.originalId === op.id);
        if (existing) return existing;
        const saved: SavedOpportunity = {
          ...op,
          originalId: op.id,
          uid: genId(),
          savedAt: new Date().toISOString(),
          sourceMode,
          sourceContext,
          status,
        };
        set((s) => ({ savedOpportunities: [saved, ...s.savedOpportunities] }));
        return saved;
      },
      removeOpportunity: (uid) =>
        set((s) => ({ savedOpportunities: s.savedOpportunities.filter((o) => o.uid !== uid) })),
      isOpportunitySaved: (originalId) =>
        !!get().savedOpportunities.find((s) => s.originalId === originalId),
      getByOriginalId: (originalId) =>
        get().savedOpportunities.find((s) => s.originalId === originalId),
      setStatus: (uid, status) =>
        set((s) => ({
          savedOpportunities: s.savedOpportunities.map((o) =>
            o.uid === uid ? { ...o, status } : o
          ),
        })),
    }),
    { name: "saved-opportunities-v1" }
  )
);
