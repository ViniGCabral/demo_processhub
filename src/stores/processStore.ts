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

type InitialProcessItem = Omit<ProcessData, 'id'> & { id?: string };

const initialProcesses: InitialProcessItem[] = [
  // ── Gestão Comercial — Cadeia de Valor Mockada ──
  {
    id: "proc-requisitos-comerciais",
    area: "Vendas",
    name: "Receber Requisitos Comerciais",
    description: "Recepção e consolidação dos requisitos técnicos e comerciais levantados pelo cliente para estruturação da proposta.",
    hasDocumentation: true,
    isFavorite: false,
    documentationStatus: 'generated',
    l1: "Gestão Comercial",
    l2: "Negociação e Fechamento",
    l3: "Elaboração de Propostas e Precificação",
    l4: "Precificação e Margem Comercial",
    automation: { maturity: 60, risk: 40 },
    dataIntegrity: { maturity: 80, risk: 20 },
    governance: { maturity: 70, risk: 30 },
    executor: "SDR Pleno / Account Executive",
    approver: "Coordenador Comercial",
    frequency: "Diário",
    avgTime: "30 min",
    systems: ["CRM Salesforce", "E-mail Corporativo"],
    sla: "4h",
    owner: "Lucas Nogueira",
  },
  {
    id: "proc-qualificar-opp",
    area: "Vendas",
    name: "Qualificar Oportunidade",
    description: "Avaliação diagnóstica do perfil de compra, orçamento, tomadores de decisão e timing do cliente (metodologia BANT).",
    hasDocumentation: true,
    isFavorite: false,
    documentationStatus: 'generated',
    l1: "Gestão Comercial",
    l2: "Prospecção e Qualificação",
    l3: "Qualificação e Agendamento (SDR)",
    l4: "Agendamento de Demonstrações",
    automation: { maturity: 75, risk: 25 },
    dataIntegrity: { maturity: 85, risk: 15 },
    governance: { maturity: 85, risk: 15 },
    executor: "SDR Sênior",
    approver: "Coordenador de Vendas",
    frequency: "Diário",
    avgTime: "40 min",
    systems: ["CRM Salesforce"],
    sla: "12h",
    owner: "Lucas Nogueira",
  },
  {
    id: "proc-precificacao",
    area: "Vendas",
    name: "Precificação e Análise de Margem Comercial",
    description: "Cálculo de margem de contribuição, desconto comercial e aprovação de tabela de preços sob medida.",
    hasDocumentation: true,
    isFavorite: true,
    documentationStatus: 'generated',
    l1: "Gestão Comercial",
    l2: "Negociação e Fechamento",
    l3: "Elaboração de Propostas e Precificação",
    l4: "Precificação e Margem Comercial",
    automation: { maturity: 40, risk: 60 },
    dataIntegrity: { maturity: 65, risk: 35 },
    governance: { maturity: 75, risk: 25 },
    executor: "Account Executive Sênior",
    approver: "Diretora Comercial",
    frequency: "Sob demanda",
    avgTime: "2 horas",
    systems: ["Planilhas Comerciais (Excel)", "CRM Salesforce", "ERP Financeiro SAP"],
    sla: "4h",
    owner: "Mariana Vasconcelos",
  },
  {
    id: "proc-elaborar-proposta",
    area: "Vendas",
    name: "Elaborar e Apresentar Proposta Comercial",
    description: "Geração formal da proposta com escopo, cronograma, condições de pagamento e validação executiva.",
    hasDocumentation: true,
    isFavorite: true,
    documentationStatus: 'generated',
    l1: "Gestão Comercial",
    l2: "Negociação e Fechamento",
    l3: "Elaboração de Propostas e Precificação",
    l4: "Envio e Apresentação de Proposta",
    automation: { maturity: 80, risk: 20 },
    dataIntegrity: { maturity: 90, risk: 10 },
    governance: { maturity: 90, risk: 10 },
    executor: "Account Executive",
    approver: "Gerente Comercial",
    frequency: "Diário",
    avgTime: "1 hora",
    systems: ["CRM Salesforce"],
    sla: "24h",
    owner: "Lucas Nogueira",
  },
  {
    id: "proc-excecao",
    area: "Vendas",
    name: "Solicitar Aprovação de Exceção",
    description: "Submissão e deliberação de alçadas comerciais especiais quando o desconto ou condição ultrapassa a política comercial padrão.",
    hasDocumentation: true,
    isFavorite: false,
    documentationStatus: 'generated',
    l1: "Gestão Comercial",
    l2: "Negociação e Fechamento",
    l3: "Elaboração de Propostas e Precificação",
    l4: "Precificação e Margem Comercial",
    automation: { maturity: 50, risk: 50 },
    dataIntegrity: { maturity: 70, risk: 30 },
    governance: { maturity: 90, risk: 10 },
    executor: "Account Executive Sênior",
    approver: "Diretora Comercial / Governança",
    frequency: "Sob demanda",
    avgTime: "1 dia",
    systems: ["Portal de Aprovações / Workflow", "CRM Salesforce"],
    sla: "24h",
    owner: "Mariana Vasconcelos",
  },
  {
    id: "proc-contrato",
    area: "Vendas",
    name: "Formalização e Assinatura Eletrônica de Contrato",
    description: "Envio da minuta contratual, validação de procurações e coleta de assinaturas digitais com validade jurídica.",
    hasDocumentation: true,
    isFavorite: true,
    documentationStatus: 'generated',
    l1: "Gestão Comercial",
    l2: "Negociação e Fechamento",
    l3: "Formalização Contratual",
    l4: "Assinatura Digital de Contrato",
    automation: { maturity: 90, risk: 10 },
    dataIntegrity: { maturity: 95, risk: 5 },
    governance: { maturity: 95, risk: 5 },
    executor: "RevOps Specialist",
    approver: "Diretora Comercial",
    frequency: "Diário",
    avgTime: "30 min",
    systems: ["DocuSign", "CRM Salesforce"],
    sla: "48h",
    owner: "Mariana Vasconcelos",
  },
  {
    id: "proc-faturamento",
    area: "Financeiro",
    name: "Faturamento",
    description: "Processamento do faturamento pós-fechamento de contrato, emissão de nota fiscal e conciliação bancária.",
    hasDocumentation: true,
    isFavorite: false,
    documentationStatus: 'generated',
    l1: "Financeiro",
    l2: "Contas a Receber",
    l3: "Faturamento e Emissão",
    l4: "Emissão de Fatura e Boleto",
    automation: { maturity: 85, risk: 15 },
    dataIntegrity: { maturity: 95, risk: 5 },
    governance: { maturity: 95, risk: 5 },
    executor: "Analista Financeiro Pleno",
    approver: "Coordenador Financeiro",
    frequency: "Diário",
    avgTime: "20 min",
    systems: ["ERP Financeiro SAP", "Portal Bancário"],
    sla: "2h",
    owner: "Mariana Vasconcelos",
  },
  {
    id: "proc-pagamento",
    area: "Financeiro",
    name: "Registrar Pagamento",
    description: "Conciliação bancária do recebimento de clientes, baixa de títulos e emissão de recibo de quitação.",
    hasDocumentation: true,
    isFavorite: false,
    documentationStatus: 'generated',
    l1: "Financeiro",
    l2: "Contas a Receber",
    l3: "Conciliação e Baixa",
    l4: "Baixa e Conciliação Bancária",
    automation: { maturity: 90, risk: 10 },
    dataIntegrity: { maturity: 95, risk: 5 },
    governance: { maturity: 90, risk: 10 },
    executor: "Analista de Tesouraria",
    approver: "Coordenador Financeiro",
    frequency: "Diário",
    avgTime: "15 min",
    systems: ["ERP Financeiro SAP", "Portal Bancário"],
    sla: "2h",
    owner: "Mariana Vasconcelos",
  },
  {
    id: "proc-inbound",
    area: "Vendas",
    name: "Captação e Triagem de Leads Inbound",
    description: "Recepção, qualificação inicial e atribuição de leads originados de canais digitais.",
    hasDocumentation: true,
    isFavorite: true,
    documentationStatus: 'generated',
    l1: "Gestão Comercial",
    l2: "Prospecção e Qualificação",
    l3: "Geração e Enriquecimento de Leads",
    l4: "Captação e Triagem Inbound",
    automation: { maturity: 85, risk: 15 },
    dataIntegrity: { maturity: 90, risk: 10 },
    governance: { maturity: 95, risk: 5 },
    executor: "Analista de SDR Inbound",
    approver: "Gerente Comercial",
    frequency: "Diário",
    avgTime: "15 min",
    systems: ["CRM Salesforce", "HubSpot Marketing"],
    sla: "15 min",
    owner: "Mariana Vasconcelos",
  },
  {
    id: "proc-outbound",
    area: "Vendas",
    name: "Prospecção Ativa Outbound B2B",
    description: "Pesquisa de contas estratégicas (ICP), enriquecimento de dados e cadência de contato ativo.",
    hasDocumentation: true,
    isFavorite: true,
    documentationStatus: 'generated',
    l1: "Gestão Comercial",
    l2: "Prospecção e Qualificação",
    l3: "Geração e Enriquecimento de Leads",
    l4: "Prospecção Ativa Outbound",
    automation: { maturity: 70, risk: 30 },
    dataIntegrity: { maturity: 85, risk: 15 },
    governance: { maturity: 80, risk: 20 },
    executor: "Especialista em BDR",
    approver: "Coordenador de Vendas",
    frequency: "Diário",
    avgTime: "30 min",
    systems: ["CRM Salesforce", "Apollo.io / LinkedIn Sales Nav"],
    sla: "48h",
    owner: "Lucas Nogueira",
  },
  {
    id: "proc-reunioes",
    area: "Vendas",
    name: "Qualificação Diagnóstica e Agendamento",
    description: "Realização de diagnóstico de dores e agendamento de apresentação técnica com Account Executive.",
    hasDocumentation: true,
    isFavorite: false,
    documentationStatus: 'generated',
    l1: "Gestão Comercial",
    l2: "Prospecção e Qualificação",
    l3: "Qualificação e Agendamento (SDR)",
    l4: "Agendamento de Demonstrações",
    automation: { maturity: 75, risk: 25 },
    dataIntegrity: { maturity: 88, risk: 12 },
    governance: { maturity: 85, risk: 15 },
    executor: "SDR Pleno",
    approver: "Coordenador de Vendas",
    frequency: "Diário",
    avgTime: "45 min",
    systems: ["CRM Salesforce", "Google Calendar"],
    sla: "24h",
    owner: "Lucas Nogueira",
  },
  {
    id: "proc-onboarding",
    area: "Pós-Venda",
    name: "Kickoff e Passagem de Bastão para Customer Success",
    description: "Reunião de alinhamento entre equipe comercial, pós-venda e cliente para início da implantação.",
    hasDocumentation: false,
    isFavorite: false,
    documentationStatus: 'pending',
    l1: "Gestão Comercial",
    l2: "Pós-Venda e Sucesso do Cliente",
    l3: "Ativação e Adoção Inicial",
    l4: "Kickoff e Adoção do Cliente",
    automation: { maturity: 30, risk: 70 },
    dataIntegrity: { maturity: 50, risk: 50 },
    governance: { maturity: 40, risk: 60 },
    executor: "Customer Success Manager",
    approver: "Head de CS",
    frequency: "Semanal",
    avgTime: "1 dia",
    systems: ["CRM Salesforce", "Slack"],
    sla: "5 dias úteis",
    owner: "Beatriz Fontes",
  },

  // ── Suprimentos e Logística (4 processos) ──
  {
    area: "Suprimentos", name: "Cotação de Materiais Estratégicos",
    description: "Equalização técnica e negociação de preços de insumos industriais.",
    hasDocumentation: true, isFavorite: false, documentationStatus: 'generated',
    l1: "Suprimentos e Logística", l2: "Gestão de Compras", l3: "Compras Estratégicas", l4: "Cotação de Materiais Estratégicos",
    automation: { maturity: 65, risk: 35 }, dataIntegrity: { maturity: 80, risk: 20 }, governance: { maturity: 70, risk: 30 },
    executor: "Comprador Pleno", approver: "Gerente de Compras", frequency: "Semanal", avgTime: "3 dias",
    systems: ["SAP Ariba"], owner: "Carlos Eduardo Mendes",
  },
  {
    area: "Suprimentos", name: "Negociação e Pedido de Compra",
    description: "Emissão e formalização de Ordens de Compra (PO).",
    hasDocumentation: true, isFavorite: false, documentationStatus: 'generated',
    l1: "Suprimentos e Logística", l2: "Gestão de Compras", l3: "Compras Estratégicas", l4: "Negociação e Pedido de Compra",
    automation: { maturity: 70, risk: 30 }, dataIntegrity: { maturity: 85, risk: 15 }, governance: { maturity: 80, risk: 20 },
    executor: "Comprador Sênior", approver: "Diretor de Operações", frequency: "Diário", avgTime: "1 dia",
    systems: ["SAP Ariba"], owner: "Carlos Eduardo Mendes",
  },
  {
    area: "Cadastro", name: "Qualificação e Homologação de Fornecedores",
    description: "Validação cadastral, certidões e compliance fiscal.",
    hasDocumentation: false, isFavorite: false, documentationStatus: 'pending',
    l1: "Suprimentos e Logística", l2: "Gestão de Fornecedores", l3: "Homologação e Cadastro", l4: "Qualificação e Homologação",
    automation: { maturity: 50, risk: 50 }, dataIntegrity: { maturity: 60, risk: 40 }, governance: { maturity: 60, risk: 40 },
    executor: "Analista de Cadastro", approver: "Coordenador de Suprimentos", frequency: "Sob demanda", avgTime: "5 dias",
    systems: ["Portal de Fornecedores", "Serasa Experian"], owner: "Carlos Eduardo Mendes",
  },
  {
    area: "Qualidade", name: "Auditoria de Desempenho de Fornecedores",
    description: "Avaliação do nível de serviço e pontualidade na entrega de insumos.",
    hasDocumentation: false, isFavorite: false, documentationStatus: 'pending',
    l1: "Suprimentos e Logística", l2: "Gestão de Fornecedores", l3: "Monitoramento de Desempenho", l4: "Auditoria de Desempenho de Fornecedores",
    automation: { maturity: 40, risk: 60 }, dataIntegrity: { maturity: 55, risk: 45 }, governance: { maturity: 50, risk: 50 },
    executor: "Analista de Qualidade", approver: "Gerente de Operações", frequency: "Trimestral", avgTime: "1 semana",
    systems: ["SAP Ariba"], owner: "Carlos Eduardo Mendes",
  },
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
  const initialMissing = initialProcesses
    .filter((p) => !existing.has(p.name.toLowerCase()))
    .map((p, idx) => ({
      ...p,
      id: p.id || `init-${idx}`,
      documentationStatus: p.documentationStatus || 'generated',
    } as ProcessData));
  const eduMissing = EDUCATION_DEMO_PROCESSES.filter((p) => !existing.has(p.name.toLowerCase()));
  return [...base, ...initialMissing, ...eduMissing];
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
            id: p.id || `local-seed-${i}`,
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
