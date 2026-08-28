import { create } from "zustand";

export interface UseCase {
  id: string;
  session_id: string;
  title: string;
  description: string;
  category: string;
  effort: string;
  impact: string;
  source_reference: string;
  potential_gains: { title: string; description: string }[];
  key_indicators: string[];
  key_technologies: string[];
  impacted_processes_count: number;
  benchmarking: any | null;
  screen_match: any | null;
  business_case: any | null;
  status: string;
}

export interface UseCaseSession {
  id: string;
  company_name: string;
  area: string;
  source_level: string;
  source_ids: string[];
  source_names: string[];
  process_names: string[];
  assessment_problems: string;
  observations: string;
}

interface UseCaseState {
  currentStep: number;
  session: UseCaseSession | null;
  useCases: UseCase[];
  selectedUseCaseId: string | null;
  isGenerating: boolean;
  
  setStep: (step: number) => void;
  setSession: (session: UseCaseSession) => void;
  setUseCases: (useCases: UseCase[]) => void;
  setSelectedUseCaseId: (id: string | null) => void;
  setIsGenerating: (v: boolean) => void;
  updateUseCase: (id: string, data: Partial<UseCase>) => void;
  reset: () => void;
}

export const useUseCaseStore = create<UseCaseState>((set) => ({
  currentStep: 0,
  session: null,
  useCases: [],
  selectedUseCaseId: null,
  isGenerating: false,

  setStep: (step) => set({ currentStep: step }),
  setSession: (session) => set({ session }),
  setUseCases: (useCases) => set({ useCases }),
  setSelectedUseCaseId: (id) => set({ selectedUseCaseId: id }),
  setIsGenerating: (v) => set({ isGenerating: v }),
  updateUseCase: (id, data) =>
    set((state) => ({
      useCases: state.useCases.map((uc) =>
        uc.id === id ? { ...uc, ...data } : uc
      ),
    })),
  reset: () =>
    set({
      currentStep: 0,
      session: null,
      useCases: [],
      selectedUseCaseId: null,
      isGenerating: false,
    }),
}));
