import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Area {
  id: string;
  code: string;
  name: string;
  description: string;
  color: string;
  processCount: number;
}

export interface Position {
  id: string;
  name: string;
  description: string;
  areaId: string;
}

export interface UploadedFile {
  filename: string;
  filesize: string;
  dimensions?: string;
  uploadedAt: string;
  type: string;
  url: string;
}

export interface SettingsData {
  companyName: string;
  valueChain: {
    l1: string[];
    l2: string[];
    l3: string[];
    l4: string[];
  };
  companyLogo: UploadedFile | null;
  areas: Area[];
  positions: Position[];
  documentationTemplate: UploadedFile | null;
  useDefaultTemplate: boolean;
  updatedAt: string;
}

interface SettingsStore {
  settings: SettingsData;
  setCompanyName: (name: string) => void;
  updateValueChain: (level: 'l1' | 'l2' | 'l3' | 'l4', items: string[]) => void;
  addValueChainItem: (level: 'l1' | 'l2' | 'l3' | 'l4', item: string) => void;
  removeValueChainItem: (level: 'l1' | 'l2' | 'l3' | 'l4', index: number) => void;
  updateValueChainItem: (level: 'l1' | 'l2' | 'l3' | 'l4', index: number, value: string) => void;
  setCompanyLogo: (file: UploadedFile | null) => void;
  addArea: (area: Omit<Area, 'id' | 'processCount'>) => void;
  updateArea: (id: string, area: Partial<Area>) => void;
  deleteArea: (id: string) => void;
  addPosition: (position: Omit<Position, 'id'>) => void;
  updatePosition: (id: string, position: Partial<Position>) => void;
  deletePosition: (id: string) => void;
  getPositionsByArea: (areaId: string) => Position[];
  getAllPositions: () => Position[];
  setDocumentationTemplate: (file: UploadedFile | null) => void;
  setUseDefaultTemplate: (value: boolean) => void;
  resetToDefaults: () => void;
  // Getters for integration
  getAreaCodes: () => string[];
  getL1Options: () => string[];
  getL2Options: () => string[];
  getL3Options: () => string[];
  getL4Options: () => string[];
}

const defaultSettings: SettingsData = {
  companyName: '',
  valueChain: {
    l1: ['Source to Pay', 'Hire to Retire', 'Operations', 'Finance', 'IT Services', 'Order to Cash'],
    l2: ['Gestão de Frete', 'Treinamento', 'Quality', 'Support', 'Budget', 'Performance', 'Cotação', 'Financeiro', 'Recrutamento'],
    l3: ['Emergencial', 'Padrão', 'Especial', 'EHS', 'Inspection', 'Incidents', 'Approval', 'Evaluation'],
    l4: ['Envio', 'Aprovação', 'Recebimento', 'Validação', 'Cronogramas', 'Resolution', 'Multi-level', 'Annual'],
  },
  companyLogo: null,
  areas: [
    { id: '1', code: 'S2P', name: 'Source to Pay', description: 'Processo de compra até pagamento', color: '#0C1BA8', processCount: 1 },
    { id: '2', code: 'H2R', name: 'Hire to Retire', description: 'Gestão de pessoas', color: '#10B981', processCount: 2 },
    { id: '3', code: 'OPS', name: 'Operations', description: 'Operações', color: '#F59E0B', processCount: 1 },
    { id: '4', code: 'IT', name: 'IT', description: 'Tecnologia da Informação', color: '#8B5CF6', processCount: 1 },
    { id: '5', code: 'FIN', name: 'Finance', description: 'Finanças', color: '#EC4899', processCount: 1 },
    { id: '6', code: 'HR', name: 'HR', description: 'Recursos Humanos', color: '#14B8A6', processCount: 1 },
  ],
  positions: [
    { id: '1', name: 'Analista JR', description: 'Analista Júnior', areaId: '1' },
    { id: '2', name: 'Analista Pl', description: 'Analista Pleno', areaId: '1' },
    { id: '3', name: 'Analista Sr', description: 'Analista Sênior', areaId: '1' },
    { id: '4', name: 'Gerente', description: 'Gerente de Área', areaId: '1' },
  ],
  documentationTemplate: null,
  useDefaultTemplate: true,
  updatedAt: new Date().toISOString(),
};

export const useSettingsStore = create<SettingsStore>()(
  persist(
    (set, get) => ({
      settings: defaultSettings,

      setCompanyName: (name) =>
        set((state) => ({
          settings: { ...state.settings, companyName: name, updatedAt: new Date().toISOString() },
        })),
      
      updateValueChain: (level, items) =>
        set((state) => ({
          settings: {
            ...state.settings,
            valueChain: { ...state.settings.valueChain, [level]: items },
            updatedAt: new Date().toISOString(),
          },
        })),
      
      addValueChainItem: (level, item) =>
        set((state) => {
          if (state.settings.valueChain[level].includes(item)) return state;
          return {
            settings: {
              ...state.settings,
              valueChain: {
                ...state.settings.valueChain,
                [level]: [...state.settings.valueChain[level], item],
              },
              updatedAt: new Date().toISOString(),
            },
          };
        }),
      
      removeValueChainItem: (level, index) =>
        set((state) => ({
          settings: {
            ...state.settings,
            valueChain: {
              ...state.settings.valueChain,
              [level]: state.settings.valueChain[level].filter((_, i) => i !== index),
            },
            updatedAt: new Date().toISOString(),
          },
        })),
      
      updateValueChainItem: (level, index, value) =>
        set((state) => ({
          settings: {
            ...state.settings,
            valueChain: {
              ...state.settings.valueChain,
              [level]: state.settings.valueChain[level].map((item, i) =>
                i === index ? value : item
              ),
            },
            updatedAt: new Date().toISOString(),
          },
        })),
      
      setCompanyLogo: (file) =>
        set((state) => ({
          settings: {
            ...state.settings,
            companyLogo: file,
            updatedAt: new Date().toISOString(),
          },
        })),
      
      addArea: (area) =>
        set((state) => {
          const exists = state.settings.areas.some(a => a.code.toUpperCase() === area.code.toUpperCase());
          if (exists) return state;
          return {
            settings: {
              ...state.settings,
              areas: [
                ...state.settings.areas,
                { ...area, id: Date.now().toString(), processCount: 0 },
              ],
              updatedAt: new Date().toISOString(),
            },
          };
        }),
      
      updateArea: (id, area) =>
        set((state) => ({
          settings: {
            ...state.settings,
            areas: state.settings.areas.map((a) =>
              a.id === id ? { ...a, ...area } : a
            ),
            updatedAt: new Date().toISOString(),
          },
        })),
      
      deleteArea: (id) =>
        set((state) => ({
          settings: {
            ...state.settings,
            areas: (state.settings.areas || []).filter((a) => a.id !== id),
            // Also delete positions associated with this area
            positions: (state.settings.positions || []).filter((p) => p.areaId !== id),
            updatedAt: new Date().toISOString(),
          },
        })),
      
      addPosition: (position) =>
        set((state) => ({
          settings: {
            ...state.settings,
            positions: [
              ...(state.settings.positions || []),
              { ...position, id: Date.now().toString() },
            ],
            updatedAt: new Date().toISOString(),
          },
        })),
      
      updatePosition: (id, position) =>
        set((state) => ({
          settings: {
            ...state.settings,
            positions: (state.settings.positions || []).map((p) =>
              p.id === id ? { ...p, ...position } : p
            ),
            updatedAt: new Date().toISOString(),
          },
        })),
      
      deletePosition: (id) =>
        set((state) => ({
          settings: {
            ...state.settings,
            positions: (state.settings.positions || []).filter((p) => p.id !== id),
            updatedAt: new Date().toISOString(),
          },
        })),
      
      getPositionsByArea: (areaId) => (get().settings.positions || []).filter((p) => p.areaId === areaId),
      
      getAllPositions: () => get().settings.positions || [],
      
      setDocumentationTemplate: (file) =>
        set((state) => ({
          settings: {
            ...state.settings,
            documentationTemplate: file,
            useDefaultTemplate: file === null,
            updatedAt: new Date().toISOString(),
          },
        })),
      
      setUseDefaultTemplate: (value) =>
        set((state) => ({
          settings: {
            ...state.settings,
            useDefaultTemplate: value,
            updatedAt: new Date().toISOString(),
          },
        })),
      
      resetToDefaults: () =>
        set(() => ({
          settings: { ...defaultSettings, updatedAt: new Date().toISOString() },
        })),

      // Getters for integration with NewProcess
      getAreaCodes: () => get().settings.areas.map(a => a.code),
      getL1Options: () => get().settings.valueChain.l1,
      getL2Options: () => get().settings.valueChain.l2,
      getL3Options: () => get().settings.valueChain.l3,
      getL4Options: () => get().settings.valueChain.l4,
    }),
    {
      name: 'settings-storage',
      merge: (persistedState, currentState) => {
        const persisted = (persistedState as any) ?? {};
        const persistedSettings = persisted.settings ?? {};

        return {
          ...currentState,
          settings: {
            ...defaultSettings,
            ...persistedSettings,
            valueChain: {
              ...defaultSettings.valueChain,
              ...(persistedSettings.valueChain ?? {}),
            },
            areas: persistedSettings.areas ?? defaultSettings.areas,
            positions: persistedSettings.positions ?? defaultSettings.positions,
          },
        };
      },
    }
  )
);
