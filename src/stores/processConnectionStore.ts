import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type ProcessConnectionType =
  | 'fornece_insumo_para'       // "Fornece insumo para"
  | 'recebe_insumo_de'          // "Recebe insumo de"
  | 'dispara'                   // "Dispara"
  | 'acionado_por'              // "É acionado por"
  | 'depende_de'                // "Depende de"
  | 'bloqueia'                  // "Bloqueia"
  | 'bloqueado_por'             // "É bloqueado por"
  | 'compartilha_dado_com'      // "Compartilha dado com"
  | 'depende_aprovacao_de';     // "Depende de aprovação de"

export interface ProcessConnection {
  id: string;
  sourceProcessId: string;       // Origem / Predecessor
  sourceProcessName: string;
  sourceDomain?: string;
  targetProcessId: string;       // Destino / Sucessor
  targetProcessName: string;
  targetDomain?: string;
  relationshipType: ProcessConnectionType;
  description: string;
  transferredObject?: string;   // Insumo ou dado transferido (opcional)
  relatedSystem?: string;       // Sistema envolvido (opcional)
  validationStatus: 'validada' | 'pendente';
  notes?: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export const RELATIONSHIP_LABELS: Record<ProcessConnectionType, { pt: string; en: string }> = {
  fornece_insumo_para: { pt: 'Fornece insumo para', en: 'Provides input to' },
  recebe_insumo_de: { pt: 'Recebe insumo de', en: 'Receives input from' },
  dispara: { pt: 'Dispara', en: 'Triggers' },
  acionado_por: { pt: 'É acionado por', en: 'Is triggered by' },
  depende_de: { pt: 'Depende de', en: 'Depends on' },
  bloqueia: { pt: 'Bloqueia', en: 'Blocks' },
  bloqueado_por: { pt: 'É bloqueado por', en: 'Is blocked by' },
  compartilha_dado_com: { pt: 'Compartilha dado com', en: 'Shares data with' },
  depende_aprovacao_de: { pt: 'Depende de aprovação de', en: 'Requires approval from' },
};

// Seed de conexões iniciais alinhadas com o fluxo de Gestão Comercial e Precificação
export const INITIAL_PROCESS_CONNECTIONS: ProcessConnection[] = [
  // ── 1. Predecessor 1: Receber Requisitos Comerciais -> Precificação ──
  {
    id: 'conn-prec-pred-1',
    sourceProcessId: 'proc-requisitos-comerciais',
    sourceProcessName: 'Receber Requisitos Comerciais',
    sourceDomain: 'Gestão Comercial',
    targetProcessId: 'proc-precificacao',
    targetProcessName: 'Precificação e Análise de Margem Comercial',
    targetDomain: 'Gestão Comercial',
    relationshipType: 'fornece_insumo_para',
    description: 'Transfere os requisitos técnicos, premissas de volume e escopo comercial levantados para a modelagem de preços e custos.',
    transferredObject: 'Requisitos técnicos e comerciais da proposta',
    relatedSystem: 'CRM Salesforce / E-mail Corporativo',
    validationStatus: 'validada',
    createdBy: 'Lucas Nogueira',
    createdAt: '2026-08-10',
    updatedAt: '2026-08-10',
  },
  // ── 2. Predecessor 2: Qualificar Oportunidade -> Precificação ──
  {
    id: 'conn-prec-pred-2',
    sourceProcessId: 'proc-qualificar-opp',
    sourceProcessName: 'Qualificar Oportunidade',
    sourceDomain: 'Gestão Comercial',
    targetProcessId: 'proc-precificacao',
    targetProcessName: 'Precificação e Análise de Margem Comercial',
    targetDomain: 'Gestão Comercial',
    relationshipType: 'dispara',
    description: 'Dispara a etapa de precificação customizada quando a oportunidade é qualificada com alto potencial e requisitos não-tabelados.',
    transferredObject: 'Oportunidade qualificada com demanda de precificação customizada',
    relatedSystem: 'CRM Salesforce',
    validationStatus: 'validada',
    createdBy: 'Lucas Nogueira',
    createdAt: '2026-08-12',
    updatedAt: '2026-08-12',
  },
  // ── 3. Sucessor 1: Precificação -> Elaborar e Apresentar Proposta Comercial ──
  {
    id: 'conn-prec-succ-1',
    sourceProcessId: 'proc-precificacao',
    sourceProcessName: 'Precificação e Análise de Margem Comercial',
    sourceDomain: 'Gestão Comercial',
    targetProcessId: 'proc-elaborar-proposta',
    targetProcessName: 'Elaborar e Apresentar Proposta Comercial',
    targetDomain: 'Gestão Comercial',
    relationshipType: 'fornece_insumo_para',
    description: 'Fornece a planilha de precificação e margem aprovada para consolidação do documento comercial e cronograma de pagamento.',
    transferredObject: 'Planilha de precificação e margem aprovada',
    relatedSystem: 'Planilhas Comerciais (Excel) / Salesforce',
    validationStatus: 'validada',
    createdBy: 'Mariana Vasconcelos',
    createdAt: '2026-08-15',
    updatedAt: '2026-08-15',
  },
  // ── 4. Sucessor 2: Precificação -> Solicitar Aprovação de Exceção ──
  {
    id: 'conn-prec-succ-2',
    sourceProcessId: 'proc-precificacao',
    sourceProcessName: 'Precificação e Análise de Margem Comercial',
    sourceDomain: 'Gestão Comercial',
    targetProcessId: 'proc-excecao',
    targetProcessName: 'Solicitar Aprovação de Exceção',
    targetDomain: 'Gestão Comercial / Governança Comercial',
    relationshipType: 'depende_aprovacao_de',
    description: 'Aciona comitê executivo e governança de alçadas quando a margem comercial solicitada fica abaixo da margem mínima estabelecida.',
    transferredObject: 'Alçada comercial acima do limite padrão',
    relatedSystem: 'Portal de Aprovações / Workflow',
    validationStatus: 'pendente',
    createdBy: 'Mariana Vasconcelos',
    createdAt: '2026-08-16',
    updatedAt: '2026-08-16',
  },
  // ── 5. Downstream Contínuo: Elaborar Proposta -> Formalização Contratual ──
  {
    id: 'conn-downstream-1',
    sourceProcessId: 'proc-elaborar-proposta',
    sourceProcessName: 'Elaborar e Apresentar Proposta Comercial',
    sourceDomain: 'Gestão Comercial',
    targetProcessId: 'proc-contrato',
    targetProcessName: 'Formalização e Assinatura Eletrônica de Contrato',
    targetDomain: 'Gestão Comercial',
    relationshipType: 'dispara',
    description: 'Após aceitação formal da proposta comercial pelo cliente, dispara a confecção da minuta contratual para assinatura digital.',
    transferredObject: 'Proposta Comercial Validada e Aceite do Cliente',
    relatedSystem: 'DocuSign / CRM Salesforce',
    validationStatus: 'validada',
    createdBy: 'Lucas Nogueira',
    createdAt: '2026-08-18',
    updatedAt: '2026-08-18',
  },
  // ── 6. Downstream Contínuo: Formalização Contratual -> Faturamento ──
  {
    id: 'conn-downstream-2',
    sourceProcessId: 'proc-contrato',
    sourceProcessName: 'Formalização e Assinatura Eletrônica de Contrato',
    sourceDomain: 'Gestão Comercial',
    targetProcessId: 'proc-faturamento',
    targetProcessName: 'Faturamento',
    targetDomain: 'Financeiro',
    relationshipType: 'fornece_insumo_para',
    description: 'Envia o contrato assinado com validade jurídica, prazos de pagamento e marco inicial para emissão da nota fiscal de faturamento.',
    transferredObject: 'Contrato Digital Assinado e Condições de Faturamento',
    relatedSystem: 'ERP Financeiro SAP',
    validationStatus: 'validada',
    createdBy: 'Mariana Vasconcelos',
    createdAt: '2026-08-20',
    updatedAt: '2026-08-20',
  },
  // ── 7. Downstream Contínuo: Faturamento -> Registrar Pagamento ──
  {
    id: 'conn-downstream-3',
    sourceProcessId: 'proc-faturamento',
    sourceProcessName: 'Faturamento',
    sourceDomain: 'Financeiro',
    targetProcessId: 'proc-pagamento',
    targetProcessName: 'Registrar Pagamento',
    targetDomain: 'Financeiro',
    relationshipType: 'fornece_insumo_para',
    description: 'Disponibiliza os títulos a receber faturados para conciliação bancária e baixa do pagamento pelo cliente.',
    transferredObject: 'Fatura e Título a Receber Emitido',
    relatedSystem: 'ERP Financeiro SAP / Internet Banking',
    validationStatus: 'validada',
    createdBy: 'Mariana Vasconcelos',
    createdAt: '2026-08-22',
    updatedAt: '2026-08-22',
  },
  // ── Conexão inicial inbound para completar a cadeia ──
  {
    id: 'conn-inbound-qualif',
    sourceProcessId: 'proc-inbound',
    sourceProcessName: 'Captação e Triagem de Leads Inbound',
    sourceDomain: 'Gestão Comercial',
    targetProcessId: 'proc-qualificar-opp',
    targetProcessName: 'Qualificar Oportunidade',
    targetDomain: 'Gestão Comercial',
    relationshipType: 'dispara',
    description: 'Encaminha leads com score MQL validado para início do diagnóstico comercial com o SDR.',
    transferredObject: 'Lead Qualificado (MQL)',
    relatedSystem: 'HubSpot Marketing / Salesforce',
    validationStatus: 'validada',
    createdBy: 'Mariana Vasconcelos',
    createdAt: '2026-08-08',
    updatedAt: '2026-08-08',
  },
];

interface ProcessConnectionStoreState {
  connections: ProcessConnection[];
  addConnection: (
    conn: Omit<ProcessConnection, 'id' | 'createdAt' | 'updatedAt'>
  ) => string;
  updateConnection: (id: string, updates: Partial<ProcessConnection>) => void;
  deleteConnection: (id: string) => void;
  getPredecessors: (processId: string, processName?: string) => ProcessConnection[];
  getSuccessors: (processId: string, processName?: string) => ProcessConnection[];
  getConnectionsForProcess: (processId: string, processName?: string) => {
    predecessors: ProcessConnection[];
    successors: ProcessConnection[];
  };
  getAllConnections: () => ProcessConnection[];
  resetToDefaults: () => void;
}

export const useProcessConnectionStore = create<ProcessConnectionStoreState>()(
  persist(
    (set, get) => ({
      connections: INITIAL_PROCESS_CONNECTIONS,

      addConnection: (connData) => {
        // Validação: não conectar consigo mesmo
        if (connData.sourceProcessId === connData.targetProcessId) {
          throw new Error('Um processo não pode ser predecessor ou sucessor de si mesmo.');
        }

        // Validação: duplicata exata
        const existing = get().connections.find(
          (c) =>
            c.sourceProcessId === connData.sourceProcessId &&
            c.targetProcessId === connData.targetProcessId &&
            c.relationshipType === connData.relationshipType
        );
        if (existing) {
          throw new Error('Esta conexão exata já está cadastrada.');
        }

        const id = `conn-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`;
        const now = new Date().toISOString().split('T')[0];

        const newConn: ProcessConnection = {
          ...connData,
          id,
          createdAt: now,
          updatedAt: now,
        };

        set((state) => ({
          connections: [newConn, ...state.connections],
        }));

        return id;
      },

      updateConnection: (id, updates) => {
        const now = new Date().toISOString().split('T')[0];
        set((state) => ({
          connections: state.connections.map((c) =>
            c.id === id ? { ...c, ...updates, updatedAt: now } : c
          ),
        }));
      },

      deleteConnection: (id) => {
        set((state) => ({
          connections: state.connections.filter((c) => c.id !== id),
        }));
      },

      getPredecessors: (processId: string, processName?: string) => {
        const idLower = (processId || '').trim().toLowerCase();
        const nameLower = (processName || processId || '').trim().toLowerCase();
        return get().connections.filter((c) => {
          const tId = c.targetProcessId.trim().toLowerCase();
          const tName = c.targetProcessName.trim().toLowerCase();
          return tId === idLower || tName === nameLower || tId === nameLower || tName === idLower;
        });
      },

      getSuccessors: (processId: string, processName?: string) => {
        const idLower = (processId || '').trim().toLowerCase();
        const nameLower = (processName || processId || '').trim().toLowerCase();
        return get().connections.filter((c) => {
          const sId = c.sourceProcessId.trim().toLowerCase();
          const sName = c.sourceProcessName.trim().toLowerCase();
          return sId === idLower || sName === nameLower || sId === nameLower || sName === idLower;
        });
      },

      getConnectionsForProcess: (processId: string, processName?: string) => {
        const predecessors = get().getPredecessors(processId, processName);
        const successors = get().getSuccessors(processId, processName);
        return { predecessors, successors };
      },

      getAllConnections: () => get().connections,

      resetToDefaults: () => set({ connections: INITIAL_PROCESS_CONNECTIONS }),
    }),
    {
      name: 'process-connections-storage',
      version: 3,
    }
  )
);
