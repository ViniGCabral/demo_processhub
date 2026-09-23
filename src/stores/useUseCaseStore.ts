import { create } from "zustand";

export interface UseCaseMock {
  id: string;
  title: string;
  description: string;
  effort: "low" | "medium" | "high";
  impact: "incremental" | "relevant" | "transformative";
  technologies: string[];
}

interface SavedUseCase extends UseCaseMock {
  nodeName: string;
  savedAt: string;
}

interface UseCaseStore {
  savedCases: SavedUseCase[];
  saveUseCase: (useCase: UseCaseMock, nodeName: string) => void;
  removeUseCase: (id: string) => void;
  isSaved: (id: string) => boolean;
}

export const useUseCaseStore = create<UseCaseStore>((set, get) => ({
  savedCases: [],
  saveUseCase: (useCase, nodeName) => {
    if (!get().isSaved(useCase.id)) {
      set((state) => ({
        savedCases: [
          ...state.savedCases,
          { ...useCase, nodeName, savedAt: new Date().toISOString() },
        ],
      }));
    }
  },
  removeUseCase: (id) =>
    set((state) => ({
      savedCases: state.savedCases.filter((uc) => uc.id !== id),
    })),
  isSaved: (id) => get().savedCases.some((uc) => uc.id === id),
}));
