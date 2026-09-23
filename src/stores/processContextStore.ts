import { create } from 'zustand';
import type {
  ProcessContextModel,
  ContextQuestion,
  QuestionStatus,
  TShapedStatus,
  ContextEvidence,
  ContextSpecData,
  ContextGap,
  GapStatus,
  FunctionalRequirement,
  BusinessRuleSpec,
} from '@/types/processContext';
import { itAmortizationContext, getProcessContext } from '@/data/processContextMockData';
import { itAmortizationSpecData, getContextSpecData } from '@/data/contextSpecMockData';

// ── Navigation Types ──
export type ContextMainTab = 'overview' | 'validation' | 'specification';
export type SpecSubView = 'requirements' | 'rules' | 'gaps';
export type SpecViewMode = 'list' | 'map';

// Legacy sub-tab type (kept for backward compat)
export type ContextSubTab = 'map' | 'review' | 'data-systems' | 'rules-policies' | 'evidences';

export interface SelectedContextItem {
  type: 'stage' | 'capability' | 'activity' | 'data' | 'system' | 'decision' | 'rule' | 'policy' | 't_shaped' | 'question';
  id: string;
}

export interface SelectedSpecItem {
  type: 'rf' | 'rn' | 'gap' | 'stage';
  id: string;
}

interface SpecFilters {
  search: string;
  stageId: string;
  status: string;
  responsible: string;
  hasGap: string; // 'all' | 'yes' | 'no'
}

interface ProcessContextState {
  // ── Legacy state (kept for backward compat) ──
  contextByProcessId: Record<string, ProcessContextModel>;
  activeSubTab: ContextSubTab;
  selectedItem: SelectedContextItem | null;
  isDrawerOpen: boolean;
  stageFilter: string;
  systemFilter: string;

  // ── New state for redesigned Context tab ──
  currentProcessId: string | null;
  specDataByProcessId: Record<string, ContextSpecData>;
  activeMainTab: ContextMainTab;
  specSubView: SpecSubView;
  specViewMode: SpecViewMode;
  selectedSpecItem: SelectedSpecItem | null;
  isSpecDrawerOpen: boolean;
  specFilters: SpecFilters;

  // ── Actions: initialization ──
  initializeContext: (processId: string, processName?: string) => void;

  // ── Actions: legacy navigation ──
  setActiveSubTab: (subTab: ContextSubTab) => void;
  setSelectedItem: (item: SelectedContextItem | null) => void;
  closeDrawer: () => void;
  setStageFilter: (stageId: string) => void;
  setSystemFilter: (systemId: string) => void;

  // ── Actions: new navigation ──
  setActiveMainTab: (tab: ContextMainTab) => void;
  setSpecSubView: (view: SpecSubView) => void;
  setSpecViewMode: (mode: SpecViewMode) => void;
  setSelectedSpecItem: (item: SelectedSpecItem | null) => void;
  closeSpecDrawer: () => void;
  setSpecFilters: (filters: Partial<SpecFilters>) => void;
  resetSpecFilters: () => void;

  // ── Actions: GAP management ──
  respondToGap: (processId: string, gapId: string, answer: string, respondedBy?: string) => void;
  confirmGapUpdate: (processId: string, gapId: string) => void;
  rejectGapUpdate: (processId: string, gapId: string) => void;
  setGapStatus: (processId: string, gapId: string, status: GapStatus) => void;

  // ── Actions: legacy question management ──
  answerQuestion: (processId: string, questionId: string, updates: {
    status: QuestionStatus;
    answer?: string;
    note?: string;
    delegatedTo?: string;
  }) => void;
  confirmQuestion: (processId: string, questionId: string, validatedBy: string) => void;

  // ── Actions: legacy misc ──
  setTShapedStatus: (processId: string, focusId: string, status: TShapedStatus) => void;
  attachEvidence: (processId: string, evidence: ContextEvidence) => void;
}

const defaultSpecFilters: SpecFilters = {
  search: '',
  stageId: 'all',
  status: 'all',
  responsible: 'all',
  hasGap: 'all',
};

export const useProcessContextStore = create<ProcessContextState>((set, get) => ({
  // ── Legacy initial state ──
  contextByProcessId: {
    'local-seed-0': itAmortizationContext,
  },
  activeSubTab: 'map',
  selectedItem: null,
  isDrawerOpen: false,
  stageFilter: 'all',
  systemFilter: 'all',

  // ── New initial state ──
  currentProcessId: 'local-seed-0',
  specDataByProcessId: {
    'local-seed-0': itAmortizationSpecData,
  },
  activeMainTab: 'overview',
  specSubView: 'requirements',
  specViewMode: 'list',
  selectedSpecItem: null,
  isSpecDrawerOpen: false,
  specFilters: { ...defaultSpecFilters },

  // ── Initialize ──
  initializeContext: (processId: string, processName?: string) => {
    const { contextByProcessId, specDataByProcessId } = get();
    const updates: Partial<ProcessContextState> = { currentProcessId: processId };

    if (!contextByProcessId[processId]) {
      updates.contextByProcessId = {
        ...contextByProcessId,
        [processId]: getProcessContext(processId, processName),
      };
    }
    if (!specDataByProcessId[processId]) {
      updates.specDataByProcessId = {
        ...specDataByProcessId,
        [processId]: getContextSpecData(processId, processName),
      };
    }
    set(updates as any);
  },

  // ── Legacy navigation ──
  setActiveSubTab: (subTab) => set({ activeSubTab: subTab }),
  setSelectedItem: (item) => {
    if (item) {
      set({ selectedItem: item, isDrawerOpen: true });
    } else {
      set({ selectedItem: null, isDrawerOpen: false });
    }
  },
  closeDrawer: () => set({ isDrawerOpen: false, selectedItem: null }),
  setStageFilter: (stageId) => set({ stageFilter: stageId }),
  setSystemFilter: (systemId) => set({ systemFilter: systemId }),

  // ── New navigation ──
  setActiveMainTab: (tab) => set({ activeMainTab: tab }),
  setSpecSubView: (view) => set({ specSubView: view }),
  setSpecViewMode: (mode) => set({ specViewMode: mode }),
  setSelectedSpecItem: (item) => {
    if (item) {
      set({ selectedSpecItem: item, isSpecDrawerOpen: true });
    } else {
      set({ selectedSpecItem: null, isSpecDrawerOpen: false });
    }
  },
  closeSpecDrawer: () => set({ isSpecDrawerOpen: false, selectedSpecItem: null }),
  setSpecFilters: (filters) => set((state) => ({
    specFilters: { ...state.specFilters, ...filters },
  })),
  resetSpecFilters: () => set({ specFilters: { ...defaultSpecFilters } }),

  // ── GAP management ──
  respondToGap: (processId, gapId, answer, respondedBy = 'Você') => {
    const { specDataByProcessId } = get();
    const specData = specDataByProcessId[processId];
    if (!specData) return;

    const updatedGaps = specData.gaps.map((gap) => {
      if (gap.id === gapId) {
        return {
          ...gap,
          status: 'answered' as GapStatus,
          currentAnswer: answer,
          responseHistory: [
            ...gap.responseHistory,
            {
              id: `resp-${Date.now()}`,
              answer,
              respondedBy,
              respondedAt: 'Agora',
              note: undefined,
            },
          ],
          updatedAt: 'Agora',
        };
      }
      return gap;
    });

    set({
      specDataByProcessId: {
        ...specDataByProcessId,
        [processId]: { ...specData, gaps: updatedGaps },
      },
    });
  },

  confirmGapUpdate: (processId, gapId) => {
    const { specDataByProcessId } = get();
    const specData = specDataByProcessId[processId];
    if (!specData) return;

    const gap = specData.gaps.find((g) => g.id === gapId);
    if (!gap || !gap.impactPreview) return;

    // Apply impact preview changes to RFs and RNs
    const updatedRFs = specData.functionalRequirements.map((rf) => {
      const impact = gap.impactPreview?.find((p) => p.itemId === rf.id && p.itemType === 'rf');
      if (impact) {
        return {
          ...rf,
          validationStatus: 'updated' as const,
          changeHistory: [
            ...rf.changeHistory,
            {
              id: `ch-${Date.now()}-${rf.id}`,
              date: 'Agora',
              author: 'Sistema',
              fieldChanged: impact.fieldChanged,
              previousValue: impact.before,
              newValue: impact.after,
              originGapId: gapId,
            },
          ],
        };
      }
      return rf;
    });

    const updatedRNs = specData.businessRules.map((rn) => {
      const impact = gap.impactPreview?.find((p) => p.itemId === rn.id && p.itemType === 'rn');
      if (impact) {
        return {
          ...rn,
          status: 'updated' as const,
          changeHistory: [
            ...rn.changeHistory,
            {
              id: `ch-${Date.now()}-${rn.id}`,
              date: 'Agora',
              author: 'Sistema',
              fieldChanged: impact.fieldChanged,
              previousValue: impact.before,
              newValue: impact.after,
              originGapId: gapId,
            },
          ],
        };
      }
      return rn;
    });

    const updatedGaps = specData.gaps.map((g) =>
      g.id === gapId ? { ...g, status: 'confirmed' as GapStatus, updatedAt: 'Agora' } : g
    );

    set({
      specDataByProcessId: {
        ...specDataByProcessId,
        [processId]: {
          ...specData,
          gaps: updatedGaps,
          functionalRequirements: updatedRFs,
          businessRules: updatedRNs,
        },
      },
    });
  },

  rejectGapUpdate: (processId, gapId) => {
    const { specDataByProcessId } = get();
    const specData = specDataByProcessId[processId];
    if (!specData) return;

    const updatedGaps = specData.gaps.map((g) =>
      g.id === gapId ? { ...g, status: 'rejected' as GapStatus, updatedAt: 'Agora' } : g
    );

    set({
      specDataByProcessId: {
        ...specDataByProcessId,
        [processId]: { ...specData, gaps: updatedGaps },
      },
    });
  },

  setGapStatus: (processId, gapId, status) => {
    const { specDataByProcessId } = get();
    const specData = specDataByProcessId[processId];
    if (!specData) return;

    const updatedGaps = specData.gaps.map((g) =>
      g.id === gapId ? { ...g, status, updatedAt: 'Agora' } : g
    );

    set({
      specDataByProcessId: {
        ...specDataByProcessId,
        [processId]: { ...specData, gaps: updatedGaps },
      },
    });
  },

  // ── Legacy question management ──
  answerQuestion: (processId, questionId, updates) => {
    const { contextByProcessId } = get();
    const context = contextByProcessId[processId] || itAmortizationContext;

    const updatedQuestions = context.questions.map((q) => {
      if (q.id === questionId) {
        return {
          ...q,
          status: updates.status,
          currentAnswer: updates.answer !== undefined ? updates.answer : q.currentAnswer,
          userNote: updates.note !== undefined ? updates.note : q.userNote,
          delegatedTo: updates.delegatedTo !== undefined ? updates.delegatedTo : q.delegatedTo,
          respondedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
      }
      return q;
    });

    const updatedReadiness = context.useCaseReadiness.map((uc) => {
      const updatedReqs = uc.requirements.map((r) => {
        if (r.blockingQuestionId === questionId && (updates.status === 'confirmed' || updates.status === 'answered')) {
          return { ...r, isMet: true };
        }
        return r;
      });
      const metCount = updatedReqs.filter((r) => r.isMet).length;
      const score = Math.round((metCount / updatedReqs.length) * 100);
      const newStatus = score >= 90 ? 'ready' : score >= 60 ? 'partially_ready' : 'blocked';
      return {
        ...uc,
        scorePercentage: score,
        status: newStatus as any,
        requirements: updatedReqs,
      };
    });

    const confirmedCount = updatedQuestions.filter((q) => q.status === 'confirmed').length;
    const pendingCount = updatedQuestions.filter((q) => q.status === 'pending' || q.status === 'suggested').length;

    const updatedContext: ProcessContextModel = {
      ...context,
      questions: updatedQuestions,
      useCaseReadiness: updatedReadiness,
      updatedAt: 'Agora mesmo',
      versionsHistory: context.versionsHistory.map((v) =>
        v.isCurrent ? { ...v, pendingCount, confirmedCount, date: 'Agora' } : v
      ),
    };

    set({
      contextByProcessId: {
        ...contextByProcessId,
        [processId]: updatedContext,
      },
    });
  },

  confirmQuestion: (processId, questionId, validatedBy) => {
    const { answerQuestion } = get();
    answerQuestion(processId, questionId, {
      status: 'confirmed',
    });
    const { contextByProcessId } = get();
    const context = contextByProcessId[processId];
    if (!context) return;
    const questions = context.questions.map((q) =>
      q.id === questionId
        ? {
            ...q,
            status: 'confirmed' as QuestionStatus,
            validatedBy,
            validatedAt: 'Hoje, ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          }
        : q
    );
    set({
      contextByProcessId: {
        ...contextByProcessId,
        [processId]: { ...context, questions },
      },
    });
  },

  setTShapedStatus: (processId, focusId, status) => {
    const { contextByProcessId } = get();
    const context = contextByProcessId[processId];
    if (!context) return;
    const updated = context.tShapedRecommendations.map((t) =>
      t.id === focusId ? { ...t, status } : t
    );
    set({
      contextByProcessId: {
        ...contextByProcessId,
        [processId]: { ...context, tShapedRecommendations: updated },
      },
    });
  },

  attachEvidence: (processId, evidence) => {
    const { contextByProcessId } = get();
    const context = contextByProcessId[processId];
    if (!context) return;
    set({
      contextByProcessId: {
        ...contextByProcessId,
        [processId]: {
          ...context,
          evidences: [evidence, ...context.evidences],
        },
      },
    });
  },
}));
