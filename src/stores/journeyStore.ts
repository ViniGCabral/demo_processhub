import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Journey, JourneyStep } from '@/types/journeyTypes';
import { buildMockJourneys } from '@/data/journeyMockData';

const generateId = () => Math.random().toString(36).substr(2, 9);

interface JourneyStore {
  journeys: Journey[];

  // CRUD — Journeys
  addJourney: (journey: Omit<Journey, 'id' | 'createdAt' | 'updatedAt'> & { id?: string; steps?: JourneyStep[] }) => string;
  updateJourney: (id: string, data: Partial<Journey>) => void;
  deleteJourney: (id: string) => void;

  // CRUD — Steps within a journey
  addStep: (journeyId: string, step: Omit<JourneyStep, 'id' | 'order'>) => void;
  updateStep: (journeyId: string, stepId: string, data: Partial<JourneyStep>) => void;
  deleteStep: (journeyId: string, stepId: string) => void;
  reorderSteps: (journeyId: string, orderedStepIds: string[]) => void;

  // Aggregation helpers (pure getters, no state mutation)
  getJourneyById: (id: string) => Journey | undefined;
  getJourneysForProcess: (processName: string) => Journey[];
  getUniqueL1Names: (journeyId: string) => string[];
  getUniqueSystems: (journeyId: string) => string[];
}

const initialJourneys = buildMockJourneys();

export const useJourneyStore = create<JourneyStore>()(
  persist(
    (set, get) => ({
      journeys: initialJourneys,

      // ── Journey CRUD ──────────────────────────────────────────

      addJourney: (journeyData) => {
        const id = journeyData.id || generateId();
        const now = new Date().toISOString().slice(0, 10);
        set((state) => ({
          journeys: [
            ...state.journeys,
            {
              ...journeyData,
              id,
              steps: journeyData.steps || [],
              createdAt: now,
              updatedAt: now,
            },
          ],
        }));
        return id;
      },

      updateJourney: (id, data) =>
        set((state) => ({
          journeys: state.journeys.map((j) =>
            j.id === id
              ? { ...j, ...data, updatedAt: new Date().toISOString().slice(0, 10) }
              : j
          ),
        })),

      deleteJourney: (id) =>
        set((state) => ({
          journeys: state.journeys.filter((j) => j.id !== id),
        })),

      // ── Step CRUD ─────────────────────────────────────────────

      addStep: (journeyId, stepData) =>
        set((state) => ({
          journeys: state.journeys.map((j) => {
            if (j.id !== journeyId) return j;
            const order = j.steps.length + 1;
            return {
              ...j,
              steps: [...j.steps, { ...stepData, id: generateId(), order }],
              updatedAt: new Date().toISOString().slice(0, 10),
            };
          }),
        })),

      updateStep: (journeyId, stepId, data) =>
        set((state) => ({
          journeys: state.journeys.map((j) => {
            if (j.id !== journeyId) return j;
            return {
              ...j,
              steps: j.steps.map((s) => (s.id === stepId ? { ...s, ...data } : s)),
              updatedAt: new Date().toISOString().slice(0, 10),
            };
          }),
        })),

      deleteStep: (journeyId, stepId) =>
        set((state) => ({
          journeys: state.journeys.map((j) => {
            if (j.id !== journeyId) return j;
            const remaining = j.steps
              .filter((s) => s.id !== stepId)
              .map((s, idx) => ({ ...s, order: idx + 1 }));
            return {
              ...j,
              steps: remaining,
              updatedAt: new Date().toISOString().slice(0, 10),
            };
          }),
        })),

      reorderSteps: (journeyId, orderedStepIds) =>
        set((state) => ({
          journeys: state.journeys.map((j) => {
            if (j.id !== journeyId) return j;
            const stepMap = new Map(j.steps.map((s) => [s.id, s]));
            const reordered = orderedStepIds
              .map((id, idx) => {
                const step = stepMap.get(id);
                return step ? { ...step, order: idx + 1 } : null;
              })
              .filter(Boolean) as JourneyStep[];
            return {
              ...j,
              steps: reordered,
              updatedAt: new Date().toISOString().slice(0, 10),
            };
          }),
        })),

      // ── Getters ───────────────────────────────────────────────

      getJourneyById: (id) => get().journeys.find((j) => j.id === id),

      getJourneysForProcess: (processName) =>
        get().journeys.filter((j) =>
          j.steps.some((s) => s.processName === processName)
        ),

      getUniqueL1Names: (journeyId) => {
        const j = get().journeys.find((x) => x.id === journeyId);
        if (!j) return [];
        return [...new Set(j.steps.map((s) => s.l1Name).filter(Boolean))] as string[];
      },

      getUniqueSystems: (journeyId) => {
        const j = get().journeys.find((x) => x.id === journeyId);
        if (!j) return [];
        return [...new Set(j.steps.flatMap((s) => s.systemIds || []))];
      },
    }),
    {
      name: 'journey-storage',
      version: 1,
      migrate: () =>
        ({ journeys: buildMockJourneys() }) as never,
    }
  )
);
