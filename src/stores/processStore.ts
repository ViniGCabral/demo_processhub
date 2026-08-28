import { create } from 'zustand';
import { supabase } from '@/integrations/supabase/client';
import { EDUCATION_DEMO_PROCESSES } from '@/data/educationProcesses';


export type DocumentationStatus = 'pending' | 'generated';

export interface ProcessData {
  id: string;
  area: string;
  name: string;
  description: string;
  hasDocumentation: boolean;
  documentationStatus?: DocumentationStatus;
  isFavorite?: boolean;
  isTemplate?: boolean;
  businessUnit?: string;
  l1?: string;
  l2?: string;
  l3?: string;
  l4?: string;
  automation?: { maturity: number; risk: number };
  dataIntegrity?: { maturity: number; risk: number };
  governance?: { maturity: number; risk: number };
  executor?: string;
  approver?: string;
  frequency?: string;
  avgTime?: string;

  owner?: string;
  supportTeam?: string;
  adhocMonthly?: string;
  sla?: string;
  createdAt?: string;
  lastReview?: string;
  regulations?: string;
  kpis?: string;
  systems?: string[];
  version?: string;
  docLastReview?: string;
  docNextReview?: string;
  executionEffort?: Array<{ id: string; positionId: string; name: string; people: number; hours: number }>;
  useCases?: Array<{ id: string; title: string; category: string }>;

  lastUpdate?: string;
}

interface ProcessStore {
  processes: ProcessData[];
  loading: boolean;
  loaded: boolean;
  fetchProcesses: () => Promise<void>;
  seedInitialProcesses: () => Promise<void>;
  addProcess: (process: Omit<ProcessData, 'id' | 'hasDocumentation' | 'lastUpdate' | 'documentationStatus'>) => Promise<string>;
  updateProcess: (id: string, updates: Partial<ProcessData>) => void;
  deleteProcess: (id: string) => void;
  updateProcessDocumentation: (id: string, status: DocumentationStatus) => void;
  toggleFavorite: (id: string) => void;
}

// Map DB row to ProcessData
function dbToProcess(row: any): ProcessData {
  return {
    id: row.id,
    area: row.area || '',
    name: row.name,
    description: row.description || '',
    hasDocumentation: row.has_documentation,
    documentationStatus: row.documentation_status as DocumentationStatus,
    isFavorite: row.is_favorite,
    isTemplate: row.is_template,
    businessUnit: row.business_unit,
    l1: row.l1,
    l2: row.l2,
    l3: row.l3,
    l4: row.l4,
    automation: row.automation,
    dataIntegrity: row.data_integrity,
    governance: row.governance,
    executor: row.executor,
    approver: row.approver,
    frequency: row.frequency,
    avgTime: row.avg_time,
    owner: row.owner,
    supportTeam: row.support_team,
    adhocMonthly: row.adhoc_monthly,
    sla: row.sla,
    regulations: row.regulations,
    kpis: row.kpis,
    systems: row.systems,
    version: row.version,
    docLastReview: row.doc_last_review,
    docNextReview: row.doc_next_review,
    executionEffort: row.execution_effort,
    useCases: row.use_cases || [],
    lastReview: row.last_review,
    lastUpdate: row.updated_at ? new Date(row.updated_at).toLocaleDateString('pt-BR', { day: 'numeric', month: 'short', year: 'numeric' }).replace('.', ',') : undefined,
    createdAt: row.created_at,
  };
}

// Map ProcessData to DB insert/update
function processToDb(p: Partial<ProcessData>, userId?: string) {
  const row: any = {};
  if (userId) row.user_id = userId;
  if (p.area !== undefined) row.area = p.area;
  if (p.name !== undefined) row.name = p.name;
  if (p.description !== undefined) row.description = p.description;
  if (p.hasDocumentation !== undefined) row.has_documentation = p.hasDocumentation;
  if (p.documentationStatus !== undefined) row.documentation_status = p.documentationStatus;
  if (p.isFavorite !== undefined) row.is_favorite = p.isFavorite;
  if (p.isTemplate !== undefined) row.is_template = p.isTemplate;
  if (p.businessUnit !== undefined) row.business_unit = p.businessUnit;
  if (p.l1 !== undefined) row.l1 = p.l1;
  if (p.l2 !== undefined) row.l2 = p.l2;
  if (p.l3 !== undefined) row.l3 = p.l3;
  if (p.l4 !== undefined) row.l4 = p.l4;
  if (p.automation !== undefined) row.automation = p.automation;
  if (p.dataIntegrity !== undefined) row.data_integrity = p.dataIntegrity;
  if (p.governance !== undefined) row.governance = p.governance;
  if (p.executor !== undefined) row.executor = p.executor;
  if (p.approver !== undefined) row.approver = p.approver;
  if (p.frequency !== undefined) row.frequency = p.frequency;
  if (p.avgTime !== undefined) row.avg_time = p.avgTime;
  if (p.owner !== undefined) row.owner = p.owner;
  if (p.supportTeam !== undefined) row.support_team = p.supportTeam;
  if (p.adhocMonthly !== undefined) row.adhoc_monthly = p.adhocMonthly;
  if (p.sla !== undefined) row.sla = p.sla;
  if (p.regulations !== undefined) row.regulations = p.regulations;
  if (p.kpis !== undefined) row.kpis = p.kpis;
  if (p.systems !== undefined) row.systems = p.systems;
  if (p.version !== undefined) row.version = p.version;
  if (p.docLastReview !== undefined) row.doc_last_review = p.docLastReview;
  if (p.docNextReview !== undefined) row.doc_next_review = p.docNextReview;
  if (p.executionEffort !== undefined) row.execution_effort = p.executionEffort;
  if (p.useCases !== undefined) row.use_cases = p.useCases;
  if (p.lastReview !== undefined) row.last_review = p.lastReview;
  return row;
}

const initialProcesses: Omit<ProcessData, 'id'>[] = [
  { 
    area: "S2P", name: "Cotação de Frete Emergencial", 
    description: "Processo de cotação e contratação de fretes emergenciais", 
    hasDocumentation: true, isFavorite: true,
    l1: "Source to Pay", l2: "Gestão de Frete", l3: "Cotação", l4: "Emergencial",
    automation: { maturity: 72, risk: 28 }, dataIntegrity: { maturity: 85, risk: 15 }, governance: { maturity: 68, risk: 42 },
    executor: "Analista de Logística", approver: "Coord. de Fretes", frequency: "Sob demanda", avgTime: "2–3 dias",
  },
  { 
    area: "H2R", name: "Adjust EHS Learning Schedules", 
    description: "Adjust expiration dates of EHS learning schedules in Workday Learning", 
    hasDocumentation: true,
    l1: "Hire to Retire", l2: "Treinamento", l3: "EHS", l4: "Cronogramas",
    automation: { maturity: 45, risk: 55 }, dataIntegrity: { maturity: 78, risk: 22 }, governance: { maturity: 82, risk: 18 },
    executor: "Analista de RH", approver: "Gerente de RH", frequency: "Mensal", avgTime: "1 dia",
  },
  { 
    area: "Operations", name: "Quality Control", 
    description: "Product quality inspection and compliance verification", 
    hasDocumentation: false, isFavorite: true,
    l1: "Operations", l2: "Quality", l3: "Inspection",
    automation: { maturity: 60, risk: 40 }, dataIntegrity: { maturity: 70, risk: 30 }, governance: { maturity: 55, risk: 45 },
    executor: "Quality Analyst", approver: "Quality Manager", frequency: "Diário", avgTime: "4 horas",
  },
  { 
    area: "IT", name: "Incident Management", 
    description: "IT incident logging, escalation, and resolution process", 
    hasDocumentation: true,
    l1: "IT Services", l2: "Support", l3: "Incidents", l4: "Resolution",
    automation: { maturity: 88, risk: 12 }, dataIntegrity: { maturity: 92, risk: 8 }, governance: { maturity: 85, risk: 15 },
    executor: "IT Analyst", approver: "IT Manager", frequency: "Contínuo", avgTime: "2 horas",
  },
  { 
    area: "Finance", name: "Budget Approval", 
    description: "Multi-level budget request and approval workflow", 
    hasDocumentation: true,
    l1: "Finance", l2: "Budget", l3: "Approval", l4: "Multi-level",
    automation: { maturity: 35, risk: 65 }, dataIntegrity: { maturity: 80, risk: 20 }, governance: { maturity: 90, risk: 10 },
    executor: "Financial Analyst", approver: "CFO", frequency: "Trimestral", avgTime: "5 dias",
  },
  { 
    area: "HR", name: "Performance Review", 
    description: "Annual performance evaluation and feedback process", 
    hasDocumentation: false,
    l1: "Hire to Retire", l2: "Performance", l3: "Evaluation", l4: "Annual",
    automation: { maturity: 50, risk: 50 }, dataIntegrity: { maturity: 65, risk: 35 }, governance: { maturity: 75, risk: 25 },
    executor: "HR Business Partner", approver: "HR Director", frequency: "Anual", avgTime: "30 dias",
  },
  { 
    area: "IT", name: "IT Prepaid Amortization Process", 
    description: "Procedure for identifying, validating, and coding IT prepaid expenses received from the R2R team for accurate amortization entries in Blackline", 
    hasDocumentation: true, isTemplate: true,
    l1: "Record to Report", l2: "IT Financial Management", l3: "Prepaid Expenses", l4: "Amortization",
    automation: { maturity: 30, risk: 70 }, dataIntegrity: { maturity: 75, risk: 25 }, governance: { maturity: 85, risk: 15 },
    executor: "IT Financial Management Associate", approver: "VMO Leadership", frequency: "Monthly", avgTime: "15-30 min",
  },
];

// Processo de demonstração sempre presente na lista (protótipo)
export const SPAN_LAYER_DEMO_ID = 'demo-span-layer';

const spanLayerDemoProcess: ProcessData = {
  id: SPAN_LAYER_DEMO_ID,
  area: 'HR',
  name: 'Span & Layer',
  description:
    'Ciclo trimestral de análise de Span of Control e Layers da estrutura organizacional, hoje executado em Excel a partir de extrações manuais do Workday, com geração de relatórios para a liderança.',
  hasDocumentation: true,
  documentationStatus: 'generated',
  isFavorite: true,
  l1: 'Hire to Retire',
  l2: 'People Analytics',
  l3: 'Organizational Design',
  l4: 'Span & Layer',
  automation: { maturity: 0, risk: 41 },
  dataIntegrity: { maturity: 85, risk: 17 },
  governance: { maturity: 100, risk: 0 },
  executor: 'Analista Workforce',
  approver: 'Head de RH',
  frequency: 'Trimestral',
  avgTime: '6h',
  version: '1.0',
  lastUpdate: new Date().toLocaleDateString('pt-BR', { day: 'numeric', month: 'short', year: 'numeric' }).replace('.', ','),
};

const isSpanLayer = (p: ProcessData) =>
  !!p.name && p.name.toLowerCase().includes('span') && p.name.toLowerCase().includes('layer');

// Garante que o processo demo exista sempre no topo da lista
function withDemoProcess(processes: ProcessData[]): ProcessData[] {
  const base = processes.some(isSpanLayer) ? processes : [spanLayerDemoProcess, ...processes];
  const existing = new Set(base.map((p) => p.name.toLowerCase()));
  const eduMissing = EDUCATION_DEMO_PROCESSES.filter((p) => !existing.has(p.name.toLowerCase()));
  return [...base, ...eduMissing];
}


export const useProcessStore = create<ProcessStore>()((set, get) => ({
  processes: [],
  loading: false,
  loaded: false,

  fetchProcesses: async () => {
    if (get().loading) return;
    set({ loading: true });
    
    const { data, error } = await supabase
      .from('processes')
      .select('*')
      .order('created_at', { ascending: true });
    
    if (error) {
      console.error('Error fetching processes:', error);
      set({ loading: false, loaded: true });
      return;
    }

    const processes = (data || []).map(dbToProcess);
    set({ processes: withDemoProcess(processes), loading: false, loaded: true });

    // If no processes exist, seed initial demo data
    if (processes.length === 0) {
      get().seedInitialProcesses();
    }
  },

  seedInitialProcesses: async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      // Protótipo sem sessão real: popula demo localmente
      set({
        processes: withDemoProcess(
          initialProcesses.map((p, i) => ({
            ...p,
            id: `local-seed-${i}`,
            documentationStatus: p.documentationStatus || 'pending',
          })) as ProcessData[],
        ),
      });
      return;
    }


    const rows = initialProcesses.map(p => ({
      ...processToDb(p, user.id),
      has_documentation: p.hasDocumentation,
      documentation_status: p.documentationStatus || 'pending',
      is_favorite: p.isFavorite || false,
      is_template: p.isTemplate || false,
    }));

    const { data, error } = await supabase
      .from('processes')
      .insert(rows)
      .select();

    if (error) {
      console.error('Error seeding processes:', error);
      return;
    }

    if (data) {
      set({ processes: withDemoProcess(data.map(dbToProcess)) });
    }
  },

  addProcess: async (processData) => {
    const { data: { user } } = await supabase.auth.getUser();


    const demoScores = {
      automation: { maturity: Math.floor(Math.random() * 30) + 55, risk: Math.floor(Math.random() * 25) + 20 },
      dataIntegrity: { maturity: Math.floor(Math.random() * 25) + 60, risk: Math.floor(Math.random() * 20) + 15 },
      governance: { maturity: Math.floor(Math.random() * 30) + 50, risk: Math.floor(Math.random() * 30) + 25 },
    };

    const newProcess: Partial<ProcessData> = {
      ...processData,
      hasDocumentation: false,
      documentationStatus: 'pending',
      automation: processData.automation || demoScores.automation,
      dataIntegrity: processData.dataIntegrity || demoScores.dataIntegrity,
      governance: processData.governance || demoScores.governance,
    };

    // Fallback local (protótipo/login fake, sem sessão): cria só no estado
    const createLocal = () => {
      const local: ProcessData = {
        id: (crypto?.randomUUID?.() ?? `local-${Date.now()}`),
        area: newProcess.area || '',
        name: newProcess.name || '',
        description: newProcess.description || '',
        ...newProcess,
        hasDocumentation: false,
        documentationStatus: 'pending',
        lastUpdate: new Date().toLocaleDateString('pt-BR', { day: 'numeric', month: 'short', year: 'numeric' }).replace('.', ','),
      } as ProcessData;
      set((state) => ({ processes: [...state.processes, local] }));
      return local.id;
    };

    if (!user) return createLocal();

    const row = {
      ...processToDb(newProcess, user.id),
      has_documentation: false,
      documentation_status: 'pending',
    };

    const { data, error } = await supabase
      .from('processes')
      .insert(row)
      .select()
      .single();

    if (error) {
      console.error('Error adding process:', error);
      return createLocal();
    }

    const created = dbToProcess(data);
    set((state) => ({ processes: [...state.processes, created] }));
    return created.id;

  },

  updateProcess: async (id, updates) => {
    // Optimistic update
    set((state) => ({
      processes: state.processes.map(p =>
        p.id === id ? { ...p, ...updates } : p
      )
    }));

    const dbUpdates = processToDb(updates);
    const { error } = await supabase
      .from('processes')
      .update(dbUpdates)
      .eq('id', id);

    if (error) {
      console.error('Error updating process:', error);
      // Refetch on error
      get().fetchProcesses();
    }
  },

  deleteProcess: async (id) => {
    // Optimistic delete
    set((state) => ({
      processes: state.processes.filter(p => p.id !== id)
    }));

    const { error } = await supabase
      .from('processes')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting process:', error);
      get().fetchProcesses();
    }
  },

  updateProcessDocumentation: async (id, status) => {
    set((state) => ({
      processes: state.processes.map(p =>
        p.id === id
          ? { ...p, documentationStatus: status, hasDocumentation: status === 'generated' }
          : p
      )
    }));

    const { error } = await supabase
      .from('processes')
      .update({
        documentation_status: status,
        has_documentation: status === 'generated',
      })
      .eq('id', id);

    if (error) {
      console.error('Error updating documentation:', error);
      get().fetchProcesses();
    }
  },

  toggleFavorite: async (id) => {
    const process = get().processes.find(p => p.id === id);
    if (!process) return;

    const newFav = !process.isFavorite;
    set((state) => ({
      processes: state.processes.map(p =>
        p.id === id ? { ...p, isFavorite: newFav } : p
      )
    }));

    const { error } = await supabase
      .from('processes')
      .update({ is_favorite: newFav })
      .eq('id', id);

    if (error) {
      console.error('Error toggling favorite:', error);
      get().fetchProcesses();
    }
  },
}));
