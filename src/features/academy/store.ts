import { useEffect, useState } from "react";
import { initialGroup, initialLearningContent } from "./data";
import type { PersonalNote, ProcessLearningContent, ProcessProgress, TrainingGroup } from "./types";

const STORAGE_KEY = "processhub-academy-v1";

interface AcademyState {
  groups: TrainingGroup[];
  notes: PersonalNote[];
  progress: Record<string, ProcessProgress>;
  learningContent: Record<string, ProcessLearningContent>;
}

const initialState: AcademyState = {
  groups: [initialGroup],
  notes: [{ id: "n1", processId: "criar-conta", processName: "Criar conta contábil", step: "Pesquisar contas equivalentes", category: "Importante", content: "Sempre comparar natureza e grupo da conta antes de seguir com o cadastro.", pinned: true, sopVersion: "v2.4", createdAt: "27/08/2026", updatedAt: "27/08/2026" }],
  progress: { "criar-conta": { processId: "criar-conta", progress: 60, understoodSteps: [0, 1], readingCompleted: false, acknowledged: false, quizPassed: false, attempts: 0 } },
  learningContent: initialLearningContent,
};

export function useAcademyStore() {
  const [state, setState] = useState<AcademyState>(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "null");
      return saved ? { ...initialState, ...saved, learningContent: { ...initialLearningContent, ...(saved.learningContent || {}) } } : initialState;
    }
    catch { return initialState; }
  });

  useEffect(() => { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); }, [state]);

  return {
    ...state,
    saveGroup: (group: TrainingGroup) => setState((s) => ({ ...s, groups: s.groups.some((g) => g.id === group.id) ? s.groups.map((g) => g.id === group.id ? group : g) : [...s.groups, group] })),
    archiveGroup: (id: string) => setState((s) => ({ ...s, groups: s.groups.map((g) => g.id === id ? { ...g, status: "Arquivado" } : g) })),
    duplicateGroup: (id: string) => setState((s) => { const source = s.groups.find((g) => g.id === id); return source ? { ...s, groups: [...s.groups, { ...source, id: `${id}-${Date.now()}`, name: `${source.name} — cópia`, status: "Rascunho" }] } : s; }),
    saveNote: (note: PersonalNote) => setState((s) => ({ ...s, notes: s.notes.some((n) => n.id === note.id) ? s.notes.map((n) => n.id === note.id ? note : n) : [note, ...s.notes] })),
    deleteNote: (id: string) => setState((s) => ({ ...s, notes: s.notes.filter((n) => n.id !== id) })),
    togglePin: (id: string) => setState((s) => ({ ...s, notes: s.notes.map((n) => n.id === id ? { ...n, pinned: !n.pinned } : n) })),
    updateProgress: (processId: string, patch: Partial<ProcessProgress>) => setState((s) => ({ ...s, progress: { ...s.progress, [processId]: { ...(s.progress[processId] || { processId, progress: 0, understoodSteps: [], readingCompleted: false, acknowledged: false, quizPassed: false, attempts: 0 }), ...patch } } })),
    saveLearningContent: (content: ProcessLearningContent) => setState((s) => ({ ...s, learningContent: { ...s.learningContent, [content.processId]: { ...content, updatedAt: new Date().toISOString() } } })),
  };
}
