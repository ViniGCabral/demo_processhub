export type ContextCategory =
  | "estrategico"
  | "regulatorio"
  | "politica"
  | "consulta";

export interface ActiveContextDocument {
  id: string;
  title: string;
  category: ContextCategory;
  sourceOrg: string; // ex: "Anatel / Gov. Federal", "Diretoria de Estratégia", "Jurídico"
  fileName: string;
  fileType: "PDF" | "DOCX" | "XLSX" | "TXT" | "NORMA";
  fileSize: string;
  uploadedAt: string;
  enabled: boolean;
  summary: string;
  extractedRules: string[];
  relatedAreas: string[];
  areaId?: string; // vínculo principal com perfil de área
}

export interface PassiveContextSource {
  id: "processos" | "regras_negocio" | "indicadores" | "pessoas_raci" | "normativos_internos";
  title: string;
  description: string;
  enabled: boolean;
  badgeLabel: string;
  sampleItems: { code: string; name: string; detail: string }[];
}

export interface PolicyImpactItem {
  id: string;
  code: string;
  title: string;
  origin: "interno_passivo" | "regulatorio_externo" | "estrategico_ativo";
  originLabel: string;
  severity: "bloqueio_legal" | "conflito_alto" | "revisao_necessaria" | "alinhado";
  clauseAffected: string;
  currentRuleText: string;
  conflictExplanation: string;
  requiredAdjustment: string;
}

export interface IndicatorImpactItem {
  id: string;
  code: string;
  name: string;
  area: string;
  direction: "positivo" | "negativo";
  currentValue: string;
  projectedValue: string;
  deltaLabel: string;
  confidence: "Alta" | "Média" | "Moderada";
  rationale: string;
}

export type StanceStatus = "favoravel" | "ressalvas" | "resistente";

export interface CommitteeRepresentative {
  id: string;
  areaId?: string;
  areaName: string;
  shortArea: string;
  agentName: string;
  agentRole: string;
  avatarColor: string;
  avatarInitials: string;
  impactLevel: "Crítico" | "Alto" | "Médio";
  raciRole: "Aprovador (A)" | "Responsável (R)" | "Consultado (C)" | "Informado (I)";
  stance: StanceStatus;
  stanceSummary: string;
  affectedProcesses: string[];
  affectedSystems: string[];
  mainConcerns: string[];
  positivePointsSeen: string[];
  negotiationConditions: string[];
  openingStatement: string;
}

export interface RiskItem {
  id: string;
  category: "Regulatório & Legal" | "Reputacional & CX" | "Operacional & Atendimento" | "Técnico & Sistemas" | "Financeiro";
  title: string;
  severity: "Crítico" | "Alto" | "Médio" | "Baixo";
  probability: "Alta" | "Média" | "Baixa";
  description: string;
  mitigation: string;
}

export interface BenefitItem {
  id: string;
  category: "Financeiro & Caixa" | "Eficiência Operacional" | "Comportamento de Pagamento" | "Governança";
  title: string;
  impactEstimate: string;
  horizon: "Imediato (30 dias)" | "Curto Prazo (90 dias)" | "Médio Prazo (6 meses)";
  description: string;
}

export interface AffectedProcessItem {
  id: string;
  code: string;
  name: string;
  valueChainPath: string;
  ownerArea: string;
  businessRulesAffected: string[];
  changeRequired: string;
}

export interface SimulationAnalysis {
  id: string;
  title: string;
  domainTag: string;
  userDirectivePrompt: string;
  currentDirectiveAsIs: string;
  proposedDirectiveToBe: string;
  refinedDirectiveToBe?: string;
  isConsensusApplied?: boolean;
  overallRiskScore: number; // 0-100
  viabilityStatus: "Requer Adequação Regulatória e Técnica" | "Viável com Condicionantes" | "Alto Risco de Execução" | "Aprovado pelo Comitê (Com Ajustes)";
  executiveSummary: string;
  reasoningSteps: string[];
  policiesImpacted: PolicyImpactItem[];
  indicatorsImpacted: IndicatorImpactItem[];
  areasAndCommittee: CommitteeRepresentative[];
  affectedProcesses: AffectedProcessItem[];
  risks: RiskItem[];
  benefits: BenefitItem[];
  recommendedConsensusProposal: {
    title: string;
    description: string;
    adjustedDirectiveText: string;
    keyChanges: string[];
  };
  impactExecutiveSummary?: ImpactExecutiveSummary;
  relationshipMap?: RelationshipMapData;
}

export interface ClarifyingQuestionOption {
  id: string;
  label: string;
  description?: string;
}

export interface ClarifyingQuestion {
  id: string;
  stepNumber: number;
  category: string;
  question: string;
  contextHint: string;
  options: ClarifyingQuestionOption[];
  allowCustomWriteIn: boolean;
  customWriteInPlaceholder?: string;
}

export interface ImpactExecutiveSummary {
  headline: string;
  subtitle: string;
  effect: "Positivo" | "Negativo" | "Incerto" | "Controlado";
  size: "Pequeno" | "Médio" | "Grande";
  sizeDots: 1 | 2 | 3;
  confidence: "Alta" | "Média" | "Baixa";
  confidenceBars: 1 | 2 | 3;
  escalation: string;
  narrativeParagraph: string;
  keyBenefitsSummary: string[];
  keyRisksSummary: string[];
}

export interface RelationshipMapNodeItem {
  id: string;
  label: string;
  detail?: string;
  code?: string;
  direction?: "positivo" | "negativo" | "incerto";
  confidence?: "Forte" | "Média" | "Fraca";
  delta?: string;
}

export interface RelationshipMapBranch {
  id: string;
  title: string;
  position: "top" | "bottom";
  colorTheme: "blue" | "cyan" | "pink" | "orange" | "amber" | "yellow" | "emerald" | "purple";
  branchDirection?: "positivo" | "negativo" | "incerto";
  branchConfidence?: "Forte" | "Média" | "Fraca";
  items: RelationshipMapNodeItem[];
}

export interface RelationshipMapData {
  centralNodeLabel: string;
  topBranches: RelationshipMapBranch[];
  bottomBranches: RelationshipMapBranch[];
}

export interface SimulatorChatMessage {
  id: string;
  sender: "user" | "agent";
  timestamp: string;
  content: string;
  reasoningTraces?: string[];
  updatedFieldNotice?: string;
}

export interface CommitteeChatMessage {
  id: string;
  senderType: "user" | "moderator" | "representative";
  representativeId?: string;
  senderName: string;
  senderRole?: string;
  areaBadge?: string;
  avatarColor?: string;
  avatarInitials?: string;
  stanceAtTime?: StanceStatus;
  timestamp: string;
  content: string;
  replyToArea?: string;
  highlightBox?: {
    type: "objecao" | "concessao" | "acordo";
    text: string;
  };
}

// ============================================================================
// NOVOS TIPOS: PERFIS DE ÁREA, CHAT DE DÚVIDAS E SESSÕES GUARDA-CHUVA
// ============================================================================

export interface AreaAgentProfile {
  id: string;
  areaName: string;
  shortArea: string;
  description: string;
  avatarColor: string;
  avatarInitials: string;
  hasAgentGenerated: boolean;
  agentName: string;
  agentRole: string;
  agentPersona: string;
  lastTrainedAt: string;
  mappedProcesses: { code: string; name: string; level: string }[];
  businessRules: { code: string; summary: string }[];
  keyIndicators: { code: string; name: string; current: string; target: string }[];
  sampleQuestions: string[];
}

export interface AreaQAChatMessage {
  id: string;
  sender: "user" | "agent";
  timestamp: string;
  content: string;
  routedAreaId?: string;
  routedAreaName?: string;
  wasAutoRouted?: boolean;
  agentName?: string;
  agentRole?: string;
  avatarColor?: string;
  avatarInitials?: string;
  citedSources?: {
    code: string;
    title: string;
    type: "Processo" | "Regra" | "Documento" | "Indicador";
    linkType?: "internal" | "external";
    internalPath?: string;
    externalUrl?: string;
    moduleLabel?: string;
    summary?: string;
  }[];
}

export type NegotiationDecisionStatus = "pending" | "accepted" | "rejected";

export interface NegotiationRequestItem {
  id: string;
  repId: string;
  areaShortName: string;
  agentName: string;
  avatarColor: string;
  avatarInitials: string;
  title: string;
  description: string;
  clauseAddedToProposal: string;
  riskReductionDelta: number;
  status: NegotiationDecisionStatus;
}

export interface SimulationReportVersion {
  versionNumber: number;
  versionLabel: string;
  createdAt: string;
  authorNote: string;
  acceptedConditionsCount: number;
  rejectedConditionsCount: number;
  analysis: SimulationAnalysis;
}

export interface SimulationUmbrellaSession {
  id: string;
  title: string;
  initialPrompt: string;
  domainTag: string;
  createdAt: string;
  updatedAt: string;
  activeVersionNumber: number;
  versions: SimulationReportVersion[];
  negotiationItems: NegotiationRequestItem[];
  draftProposalText: string;
  committeeMessages: CommitteeChatMessage[];
}

// ============================================================================
// 0. PERFIS DAS ÁREAS E SEUS AGENTES ESPECIALISTAS
// ============================================================================
export const INITIAL_AREA_PROFILES: AreaAgentProfile[] = [
  {
    id: "area-jur",
    areaName: "Jurídico, Compliance & Assuntos Regulatórios",
    shortArea: "Jurídico & Regulatório",
    description:
      "Responsável pela conformidade regulatória (Anatel, SENACON, LGPD), análise de contratos de adesão, contencioso e validação legal de políticas corporativas.",
    avatarColor: "#7c3aed",
    avatarInitials: "HV",
    hasAgentGenerated: true,
    agentName: "Dra. Helena Vasconcelos",
    agentRole: "Agente Especialista · Jurídico & Regulação",
    agentPersona:
      "Especialista em Direito Regulatório de Telecomunicações (Resolução Anatel 632/2014), Código de Defesa do Consumidor (Lei 8.078/90) e Governança Contratual.",
    lastTrainedAt: "18/10/2026 às 09:30",
    mappedProcesses: [
      { code: "JUR-03.1", name: "Gestão de Contencioso e Órgãos Reguladores (Anatel/Procon)", level: "L3" },
      { code: "GOV-01.2", name: "Atualização e Aditamento de Contratos de Adesão SCM", level: "L3" },
      { code: "JUR-01.4", name: "Parecer Preventivo em Mudanças de Regras de Clientes", level: "L3" },
    ],
    businessRules: [
      { code: "Art. 90/91 RGC", summary: "Suspensão parcial (redução de velocidade) exige notificação prévia formal e prazo mínimo de 15 dias pós-notificação." },
      { code: "CDC Art. 42", summary: "Vedada exposição do consumidor inadimplente a constrangimento ou corte abrupto sem aviso prévio claro." },
      { code: "Cláusula 8.2 SCM", summary: "Alterações de critérios operacionais contratuais exigem aviso prévio de 30 dias na fatura." },
    ],
    keyIndicators: [
      { code: "IND-REG-02", name: "Índice de Reclamações Anatel / Consumidor.gov", current: "1,12 / mil", target: "<= 1,20 / mil" },
      { code: "IND-JUR-04", name: "Taxa de Procedência em Processos Procon", current: "14,2%", target: "<= 15,0%" },
    ],
    sampleQuestions: [
      "Qual é o prazo legal da Anatel antes de podermos reduzir a velocidade de um cliente inadimplente?",
      "Precisamos avisar o cliente com quantos dias de antecedência para mudar uma regra do contrato de adesão?",
      "Podemos exibir um banner de aviso de fatura atrasada no navegador em D+1 sem violar a Resolução 632?",
    ],
  },
  {
    id: "area-fin",
    areaName: "Diretoria Financeira, Crédito & Cobrança (O2C)",
    shortArea: "Finanças & Cobrança",
    description:
      "Gere o ciclo Order-to-Cash (O2C), políticas de crédito, régua de cobrança, conciliação bancária (CNAB/Pix), tesouraria e controle orçamentário (FP&A).",
    avatarColor: "#0284c7",
    avatarInitials: "RA",
    hasAgentGenerated: true,
    agentName: "Roberto Almeida",
    agentRole: "Agente Especialista · Finanças, Cobrança & FP&A",
    agentPersona:
      "Focado em eficiência de capital de giro, redução do Prazo Médio de Recebimento (PMR/DSO), mitigação de PDD e aderência ao orçamento de OPEX.",
    lastTrainedAt: "18/10/2026 às 10:15",
    mappedProcesses: [
      { code: "O2C-04.2", name: "Gestão de Faturamento, Cobrança e Régua de Inadimplência", level: "L3" },
      { code: "O2C-04.5", name: "Conciliação Bancária CNAB 240/400 e Liquidação Pix", level: "L3" },
      { code: "FIN-02.1", name: "Controle de Execução Orçamentária OPEX e Alçadas", level: "L3" },
    ],
    businessRules: [
      { code: "RN-COB-012", summary: "Franquia atual de 5 dias corridos pós-vencimento (Grace Period D+5) mantendo 100% da banda." },
      { code: "RN-COB-015", summary: "Baixa bancária e reabilitação automática em até 2h após confirmação Pix ou CNAB." },
      { code: "POL-FIN-018", summary: "Política Corporativa de Crédito, Cobrança e Inadimplência (Seção 3.4)." },
    ],
    keyIndicators: [
      { code: "IND-FIN-01", name: "Inadimplência de Curto Prazo (D+1 a D+15)", current: "8,4%", target: "<= 6,5%" },
      { code: "IND-FIN-02", name: "Prazo Médio de Recebimento (PMR / DSO)", current: "34,2 dias", target: "<= 31,0 dias" },
      { code: "IND-FIN-09", name: "Aderência ao Orçamento de OPEX Discricionário", current: "94,2%", target: ">= 98,0%" },
    ],
    sampleQuestions: [
      "Como funciona hoje a régua de cobrança entre o vencimento (D+0) e o bloqueio parcial?",
      "Qual é o impacto financeiro dos atrasos entre D+1 e D+5 no nosso fluxo de caixa?",
      "Como funciona a compensação de boletos bancários comparada ao Pix no nosso ERP?",
    ],
  },
  {
    id: "area-cx",
    areaName: "Diretoria de Atendimento, CX & Retenção",
    shortArea: "Atendimento & CX",
    description:
      "Gere a jornada de relacionamento com o cliente, suporte técnico N1/N2, URA, canais digitais (WhatsApp/App), ouvidoria e células de retenção (Churn).",
    avatarColor: "#ea580c",
    avatarInitials: "CM",
    hasAgentGenerated: true,
    agentName: "Camila Mendes",
    agentRole: "Agente Especialista · Customer Experience & Suporte",
    agentPersona:
      "Guardiã do NPS, da resolução no primeiro contato (FCR) e da contenção de custos de atendimento humano no Call Center.",
    lastTrainedAt: "17/10/2026 às 16:40",
    mappedProcesses: [
      { code: "CX-01.4", name: "Atendimento de Suporte Técnico e Retenção N1/N2", level: "L3" },
      { code: "CX-01.1", name: "Autoatendimento Digital (URA, App e Bot WhatsApp)", level: "L3" },
      { code: "CX-02.1", name: "Retenção e Reversão de Cancelamento (Save Desk)", level: "L3" },
    ],
    businessRules: [
      { code: "RN-CX-008", summary: "Desbloqueio em Confiança: permite reabilitar sinal por 72h mediante autodeclaração de pagamento no App." },
      { code: "PRO-CX-045", summary: "Procedimento de Atendimento a Clientes com Velocidade Reduzida e Script de Retenção." },
    ],
    keyIndicators: [
      { code: "IND-CX-01", name: "NPS Transacional (Jornada Fatura & Suporte)", current: "66 pts", target: ">= 65 pts" },
      { code: "IND-CX-04", name: "Volume de Chamadas Retidas no Call Center Humano", current: "42.500/mês", target: "<= 40.000/mês" },
      { code: "IND-COM-03", name: "Churn Voluntário Mensal", current: "1,45% a.m.", target: "<= 1,30% a.m." },
    ],
    sampleQuestions: [
      "Como funciona a regra de Desbloqueio em Confiança (RN-CX-008) para clientes com fatura atrasada?",
      "Por que mudanças na regra de bloqueio costumam aumentar as ligações de suporte técnico?",
      "Qual é a trava estratégica do Conselho para o NPS da empresa?",
    ],
  },
  {
    id: "area-ti",
    areaName: "Engenharia de Redes, TI & Sistemas de Billing",
    shortArea: "TI, Rede & Billing",
    description:
      "Responsável pela infraestrutura de rede (BRAS/Radius), provisionamento QoS, barramento de integração (SOA/Webhooks) e sistemas de faturamento (ERP/CRM).",
    avatarColor: "#059669",
    avatarInitials: "MO",
    hasAgentGenerated: true,
    agentName: "Marcos Oliveira",
    agentRole: "Agente Especialista · Arquitetura de TI, Rede & Billing",
    agentPersona:
      "Especialista técnico em integrações ERP-Radius, processamento batch CNAB, eventos em tempo real e estabilidade de sessões PPPoE/IPoE.",
    lastTrainedAt: "17/10/2026 às 14:20",
    mappedProcesses: [
      { code: "NET-02.1", name: "Provisionamento e Controle de Qualidade de Banda (QoS)", level: "L3" },
      { code: "TI-05.3", name: "Processamento Batch de Faturamento e Baixa Bancária CNAB", level: "L3" },
    ],
    businessRules: [
      { code: "IT-TI-112", summary: "Instrução Técnica de Integração Billing-Radius: lote noturno de redução de banda executado às 02:00h." },
      { code: "SLA-TI-04", summary: "Webhook Pix processa baixa e comando CoA (Change of Authorization) em até 3 minutos." },
    ],
    keyIndicators: [
      { code: "IND-TI-01", name: "Disponibilidade do Barramento Billing-Radius", current: "99,94%", target: ">= 99,90%" },
      { code: "IND-TI-03", name: "Latência Média de Baixa via Webhook Pix", current: "1,8 min", target: "<= 5,0 min" },
    ],
    sampleQuestions: [
      "Quanto tempo demora para um boleto pago no vencimento ser baixado no nosso ERP e no Radius?",
      "Como funciona a integração técnica entre o sistema de Billing e o servidor Radius para reduzir velocidade?",
      "Qual é a diferença técnica entre derrubar sessão PPPoE e usar Change of Authorization (CoA)?",
    ],
  },
  {
    id: "area-sup",
    areaName: "Diretoria de Suprimentos & Procurement (P2P)",
    shortArea: "Suprimentos (P2P)",
    description:
      "Conduz o processo Procure-to-Pay (P2P), homologação de fornecedores, gestão de contratos guarda-chuva, compras spot e governança de alçadas no SAP Ariba.",
    avatarColor: "#0d9488",
    avatarInitials: "PN",
    hasAgentGenerated: true,
    agentName: "Patrícia Nogueira",
    agentRole: "Agente Especialista · Suprimentos & Compras (P2P)",
    agentPersona:
      "Especialista na cadeia de compras, matriz de alçadas de aprovação, prevenção a Maverick Spend e automação no SAP Ariba.",
    lastTrainedAt: "16/10/2026 às 11:00",
    mappedProcesses: [
      { code: "P2P-03.1", name: "Aprovação de Requisições e Pedidos de Compra (Procure-to-Pay)", level: "L3" },
      { code: "SUP-02.3", name: "Gestão de Contratos Guarda-Chuva e Catálogos Homologados", level: "L3" },
    ],
    businessRules: [
      { code: "POL-GOV-002", summary: "Gerentes possuem alçada individual até R$ 50 mil para itens de OPEX previstos em orçamento." },
      { code: "PRO-SUP-019", summary: "Chamadas de entrega (Call-offs) de contratos guarda-chuva seguem fluxo simplificado." },
    ],
    keyIndicators: [
      { code: "IND-SUP-01", name: "Lead Time Médio de Aprovação de Compras (Ciclo P2P)", current: "4,2 dias", target: "<= 5,0 dias" },
      { code: "IND-COMP-02", name: "Índice de Compras Fora de Contrato (Maverick Spend)", current: "14,0%", target: "<= 8,0%" },
    ],
    sampleQuestions: [
      "Qual é a alçada atual de aprovação de compras para gerentes e quando exige diretor?",
      "Qual a diferença de fluxo entre uma compra Spot (avulsa) e um pedido de Contrato Guarda-Chuva?",
      "Como evitamos o fracionamento de pedidos de compra (Split Orders) no SAP?",
    ],
  },
  {
    id: "area-ops",
    areaName: "Diretoria de Operações de Campo & Manutenção",
    shortArea: "Operações & Campo",
    description:
      "Gerencia equipes de campo, instalação e reparo, manutenção preventiva e corretiva de infraestrutura e reposição de materiais críticos.",
    avatarColor: "#d97706",
    avatarInitials: "FC",
    hasAgentGenerated: false,
    agentName: "Eng. Fernando Costa",
    agentRole: "Agente Especialista · Operações & Manutenção",
    agentPersona:
      "Focado em continuidade operacional, SLA de reparo em campo, disponibilidade de infraestrutura e agilidade no acionamento de contratos de manutenção.",
    lastTrainedAt: "Não gerado",
    mappedProcesses: [
      { code: "OPS-04.1", name: "Manutenção Corretiva e Preventiva de Infraestrutura", level: "L3" },
      { code: "OPS-01.2", name: "Agendamento e Execução de Ordens de Serviço de Campo", level: "L3" },
    ],
    businessRules: [
      { code: "SLA-OPS-01", summary: "Reparos críticos de rede backbone exigem acionamento de fornecedor em até 4h." },
    ],
    keyIndicators: [
      { code: "IND-OPS-01", name: "Cumprimento de SLA de Reparo em Campo", current: "92,4%", target: ">= 95,0%" },
    ],
    sampleQuestions: [
      "Como funciona o acionamento emergencial de manutenção corretiva em campo?",
      "Quais são os SLAs operacionais para reparo de infraestrutura crítica?",
    ],
  },
  {
    id: "area-rh",
    areaName: "Recursos Humanos, Pessoas & Cultura Organizacional",
    shortArea: "RH & Pessoas",
    description:
      "Gere políticas de trabalho híbrido/remoto, treinamento operacional, estrutura de cargos, RACI corporativo e gestão de mudança.",
    avatarColor: "#db2777",
    avatarInitials: "LM",
    hasAgentGenerated: false,
    agentName: "Luciana Martins",
    agentRole: "Agente Especialista · Pessoas, Cultura & Change Management",
    agentPersona:
      "Especialista em políticas de RH, capacitação de equipes operacionais (Academy), matriz RACI e gestão de impactos organizacionais.",
    lastTrainedAt: "Não gerado",
    mappedProcesses: [
      { code: "H2R-02.1", name: "Treinamento e Certificação de Equipes de Operação", level: "L3" },
      { code: "H2R-04.3", name: "Gestão de Políticas Internas e Trabalho Flexível", level: "L3" },
    ],
    businessRules: [
      { code: "POL-RH-009", summary: "Mudanças de processos críticos exigem trilha de capacitação prévia para equipes de N1/N2." },
    ],
    keyIndicators: [
      { code: "IND-RH-02", name: "Taxa de Adesão a Treinamentos de Novos Processos", current: "88%", target: ">= 95%" },
    ],
    sampleQuestions: [
      "Quais são os requisitos de treinamento quando mudamos um procedimento operacional do Call Center?",
      "Quem são os donos de processo (Accountable) mapeados na nossa matriz RACI?",
    ],
  },
];

// ============================================================================
// 1. FONTES DE CONTEXTO ATIVO PRÉ-CADASTRADAS (UPLOADS / BASES EXTERNAS)
// ============================================================================
export const INITIAL_ACTIVE_CONTEXT_DOCS: ActiveContextDocument[] = [
  {
    id: "doc-reg-anatel-632",
    title: "Resolução Anatel nº 632/2014 — Regulamento Geral de Direitos do Consumidor (RGC)",
    category: "regulatorio",
    sourceOrg: "ANATEL / Regulamentação Federal",
    fileName: "Resolucao_Anatel_632_RGC_Cobranca_Suspensao.pdf",
    fileType: "PDF",
    fileSize: "2.4 MB",
    uploadedAt: "12/10/2026",
    enabled: true,
    areaId: "area-jur",
    summary:
      "Estabelece as regras e prazos legais obrigatórios para notificação ao consumidor, suspensão parcial (redução de velocidade) e suspensão total de serviços de telecomunicações em caso de inadimplência.",
    extractedRules: [
      "Art. 90: A prestadora deve notificar o consumidor em até 15 dias após o vencimento sobre a existência de débito.",
      "Art. 91: A suspensão parcial (redução de velocidade) só pode ocorrer após decorridos 15 (quinze) dias da notificação formal de existência de débito ao consumidor.",
      "Art. 97: O restabelecimento da velocidade integral deve ocorrer em até 24 horas após a quitação ou confirmação bancária do débito.",
    ],
    relatedAreas: ["Jurídico & Regulatório", "Finanças & Cobrança", "TI, Rede & Billing", "Atendimento & CX"],
  },
  {
    id: "doc-reg-cdc",
    title: "Código de Defesa do Consumidor (Lei 8.078/90) — Diretrizes de Cobrança e Boa-Fé",
    category: "regulatorio",
    sourceOrg: "Legislação Federal / SENACON",
    fileName: "CDC_Diretrizes_Cobranca_Suspensao_Servicos.pdf",
    fileType: "PDF",
    fileSize: "1.8 MB",
    uploadedAt: "10/10/2026",
    enabled: true,
    areaId: "area-jur",
    summary:
      "Diretrizes jurídicas sobre cobrança de dívidas, vedação a constrangimento, dever de aviso prévio claro e proporcionalidade na restrição de serviços essenciais.",
    extractedRules: [
      "Art. 42: Na cobrança de débitos, o consumidor inadimplente não será exposto a ridículo nem submetido a qualquer tipo de constrangimento ou corte abrupto sem aviso prévio.",
      "Dever de Transparência: Qualquer alteração nos critérios de tolerância contratual exige comunicação prévia mínima de 30 dias aos clientes da base ativa.",
    ],
    relatedAreas: ["Jurídico & Regulatório", "Atendimento & CX"],
  },
  {
    id: "doc-est-2026",
    title: "Planejamento Estratégico Corporativo 2026–2028 (OKRs e Diretrizes Globais)",
    category: "estrategico",
    sourceOrg: "Conselho de Administração & CSO",
    fileName: "Planejamento_Estrategico_2026_2028_OKRs.pdf",
    fileType: "PDF",
    fileSize: "4.1 MB",
    uploadedAt: "05/10/2026",
    enabled: true,
    areaId: "transversal",
    summary:
      "Documento transversal da companhia que define os pilares estratégicos globais: (1) Eficiência de Caixa e Redução do DSO em 12%, (2) Liderança em Experiência do Cliente com meta de NPS >= 68, e (3) Redução de Churn.",
    extractedRules: [
      "OKR Financeiro Q4: Reduzir a perda por inadimplência (PDD) de 4,2% para 3,4% da receita bruta e antecipar o fluxo de recebimento em até 3 dias.",
      "OKR Cliente Q4: Manter o NPS Global acima de 65 pontos e reduzir o custo unitário de atendimento humano no Call Center em 15%.",
      "Diretriz Transversal: Nenhuma iniciativa setorial pode gerar degradação superior a 3 pontos no NPS do segmento de alto valor.",
    ],
    relatedAreas: ["Todas as Áreas (Transversal)"],
  },
  {
    id: "doc-estudo-atraso",
    title: "Estudo Técnico: Compensação Bancária, Atraso Técnico (D+1 a D+5) e Elasticidade de Churn",
    category: "consulta",
    sourceOrg: "Data Analytics & Inteligência de Crédito",
    fileName: "Estudo_Compensacao_Bancaria_Churn_D1_D5.xlsx",
    fileType: "XLSX",
    fileSize: "3.2 MB",
    uploadedAt: "14/10/2026",
    enabled: true,
    areaId: "area-ti",
    summary:
      "Levantamento histórico mostrando que 64% dos atrasos entre D+1 e D+3 decorrem de mero esquecimento ou janela de compensação de boletos bancários (que levam até 48h úteis para baixa no ERP).",
    extractedRules: [
      "Falso-Positivo em D+1: 38% dos clientes que pagam por boleto na data de vencimento só têm a baixa processada no sistema de Billing entre D+1 (final do dia) e D+2.",
      "Comportamento do Esquecido: Clientes com histórico de bom pagamento (> 12 meses sem atraso) quando sofrem bloqueio ou redução em D+1 apresentam probabilidade 3,4x maior de solicitar cancelamento (Churn) nos 30 dias seguintes.",
      "Efetividade de Cobrança Digital: Lembretes via WhatsApp com Pix Copia-e-Cola em D+1 convertem 52% dos atrasados sem necessidade de intervenção na rede.",
    ],
    relatedAreas: ["Finanças & Cobrança", "TI, Rede & Billing", "Atendimento & CX"],
  },
  {
    id: "doc-pol-alcadas",
    title: "Política Corporativa de Governança, Alçadas de Compras e Comitê de Regras",
    category: "politica",
    sourceOrg: "Governança Corporativa & Suprimentos",
    fileName: "POL_GOV_004_Comite_Mudancas_Alcadas.docx",
    fileType: "DOCX",
    fileSize: "940 KB",
    uploadedAt: "01/10/2026",
    enabled: true,
    areaId: "area-sup",
    summary:
      "Determina as alçadas de aprovação do ciclo P2P (R$ 50 mil gerencial para itens orçados) e exige validação conjunta para mudanças que afetem clientes ou SLAs operacionais.",
    extractedRules: [
      "Cláusula 2.1: Gerentes possuem alçada individual até R$ 50 mil para pedidos de contratos guarda-chuva homologados e dentro do budget.",
      "Cláusula 4.2: Mudanças na régua de cobrança e bloqueio exigem parecer obrigatório do Jurídico/Regulatório e teste de capacidade de atendimento com a Diretoria de CX.",
      "Cláusula 5.1: Alterações de parâmetros em sistemas de provisionamento de rede exigem janela de homologação pela Engenharia de TI.",
    ],
    relatedAreas: ["Suprimentos (P2P)", "Jurídico & Regulatório", "Finanças & Cobrança", "Atendimento & CX", "TI, Rede & Billing"],
  },
  {
    id: "doc-cx-manual-retencao",
    title: "Manual de Experiência do Cliente, URA e Desbloqueio em Confiança",
    category: "politica",
    sourceOrg: "Diretoria de Atendimento & CX",
    fileName: "Manual_CX_Desbloqueio_Confianca_2026.pdf",
    fileType: "PDF",
    fileSize: "1.6 MB",
    uploadedAt: "08/10/2026",
    enabled: true,
    areaId: "area-cx",
    summary:
      "Regulamenta o atendimento a clientes com fatura vencida, regras de Desbloqueio em Confiança por 72h e contenção de chamadas indevidas no suporte técnico N1.",
    extractedRules: [
      "Regra CX-08: Clientes adimplentes nos últimos 6 meses têm direito ao Desbloqueio em Confiança imediato via App/WhatsApp.",
      "Meta de Contenção Digital: Pelo menos 78% das demandas de 2ª via e religação devem ser resolvidas sem transbordo humano.",
    ],
    relatedAreas: ["Atendimento & CX", "Finanças & Cobrança"],
  },
];

// ============================================================================
// 2. FONTES DE CONTEXTO PASSIVO (DA PLATAFORMA)
// ============================================================================
export const INITIAL_PASSIVE_CONTEXT_SOURCES: PassiveContextSource[] = [
  {
    id: "processos",
    title: "Cadeia de Valor & Processos Mapeados (BPMN / POPs)",
    description:
      "Fluxos AS-IS, atividades L1 a L4, integrações de sistemas e procedimentos operacionais padrão cadastrados na plataforma.",
    enabled: true,
    badgeLabel: "Sincronizado com Arquitetura & Processos",
    sampleItems: [
      { code: "O2C-04.2", name: "Gestão de Faturamento, Cobrança e Régua de Inadimplência", detail: "L3 · Order to Cash · 14 atividades mapeadas" },
      { code: "NET-02.1", name: "Provisionamento e Controle de Qualidade de Banda (QoS)", detail: "L3 · Operações de Rede · Integração Radius/BRAS" },
      { code: "CX-01.4", name: "Atendimento de Suporte Técnico e Retenção N1/N2", detail: "L3 · Customer Experience · URA & Call Center" },
      { code: "P2P-03.1", name: "Aprovação de Requisições e Pedidos de Compra", detail: "L3 · Procure to Pay · SAP Ariba / S4HANA" },
    ],
  },
  {
    id: "regras_negocio",
    title: "Regras de Negócio (RNs) & Requisitos Funcionais",
    description:
      "Regras parametrizadas nos processos, condições de decisão de gateways BPMN, SLAs e travas sistêmicas.",
    enabled: true,
    badgeLabel: "Sincronizado com Contexto de Processos",
    sampleItems: [
      { code: "RN-COB-012", name: "Tolerância de Inadimplência (Grace Period D+5)", detail: "Mantém 100% da banda contratada durante os primeiros 5 dias corridos após o vencimento." },
      { code: "RN-COB-015", name: "Baixa Bancária e Reabilitação Automática de Sinal", detail: "Reabilita velocidade original em até 2h após confirmação de Pix ou compensação CNAB." },
      { code: "RN-CX-008", name: "Promessa de Pagamento (Desbloqueio em Confiança)", detail: "Permite ao cliente reabilitar velocidade por 72h mediante autodeclaração de pagamento no App." },
    ],
  },
  {
    id: "indicadores",
    title: "Indicadores de Desempenho (KPIs & Árvore de Métricas)",
    description:
      "Indicadores estratégicos e operacionais com séries históricas, metas, faixas de alerta e polaridades.",
    enabled: true,
    badgeLabel: "Sincronizado com Módulo de Indicadores",
    sampleItems: [
      { code: "IND-FIN-01", name: "Índice de Inadimplência Curto Prazo (D+1 a D+15)", detail: "Atual: 8,4% · Meta: <= 6,5% · Polaridade: Menor é melhor" },
      { code: "IND-FIN-02", name: "Prazo Médio de Recebimento (PMR / DSO)", detail: "Atual: 34,2 dias · Meta: 31,0 dias · Polaridade: Menor é melhor" },
      { code: "IND-CX-01", name: "NPS Transacional (Jornada Fatura & Suporte)", detail: "Atual: 66 pts · Meta: >= 65 pts · Polaridade: Maior é melhor" },
      { code: "IND-CX-04", name: "Volume de Chamadas Retidas no Call Center Humano", detail: "Atual: 42.500/mês · Meta: <= 40.000/mês · Polaridade: Menor é melhor" },
      { code: "IND-REG-02", name: "Índice de Reclamações Anatel / Consumidor.gov", detail: "Atual: 1,12 por mil clientes · Meta: <= 1,20 · Polaridade: Menor é melhor" },
    ],
  },
  {
    id: "pessoas_raci",
    title: "Pessoas, Papéis & Matriz de Responsabilidades (RACI)",
    description:
      "Donos de processos, executores, aprovadores e estrutura organizacional de áreas envolvidas na operação.",
    enabled: true,
    badgeLabel: "Sincronizado com Matriz RACI",
    sampleItems: [
      { code: "RACI-FIN", name: "Diretoria Financeira & Operações de Crédito (O2C)", detail: "Accountable (A) pela Régua de Cobrança e Políticas de Crédito" },
      { code: "RACI-CX", name: "Diretoria de Atendimento, CX e Retenção", detail: "Responsible (R) pelo Atendimento de Clientes Impactados e Ouvidoria" },
      { code: "RACI-JUR", name: "Jurídico & Regulatório", detail: "Consulted (C) obrigatório para alterações contratuais e regulatórias" },
      { code: "RACI-TI", name: "Engenharia de Redes, TI & Sistemas de Billing", detail: "Responsible (R) pela parametrização técnica no CRM/ERP e BRAS" },
    ],
  },
  {
    id: "normativos_internos",
    title: "Normativos, Políticas e Procedimentos Internos",
    description:
      "Acervo vigente de Políticas (POL), Procedimentos (PRO) e Instruções de Trabalho (IT) publicadas na plataforma.",
    enabled: true,
    badgeLabel: "Sincronizado com Módulo de Normativos",
    sampleItems: [
      { code: "POL-FIN-018", name: "Política Corporativa de Crédito, Cobrança e Inadimplência", detail: "Vigente · Seção 3.4 define franquia de 5 dias de tolerância pós-vencimento" },
      { code: "PRO-CX-045", name: "Procedimento de Atendimento a Clientes com Velocidade Reduzida", detail: "Vigente · Define script de atendimento e regra de Desbloqueio em Confiança" },
      { code: "IT-TI-112", name: "Instrução Técnica de Integração Billing-Radius (Throttling)", detail: "Vigente · Lote noturno de redução de banda executado em D+6 às 02:00h" },
    ],
  },
];

// ============================================================================
// 3. CENÁRIOS COMPLETOS DE SIMULAÇÃO DE DIRETRIZES
// ============================================================================
export const SIMULATION_SCENARIOS: Record<string, SimulationAnalysis> = {
  "telecom-throttling-d1": {
    id: "telecom-throttling-d1",
    title: "Redução de Velocidade da Internet por Atraso: De D+5 para D+1 após Vencimento",
    domainTag: "Cobrança, Rede & Regulatório",
    userDirectivePrompt:
      "Atualmente temos a diretriz de não reduzir a velocidade da internet caso o usuário não pague nos primeiros 5 dias após o vencimento. Estamos estudando mudar essa diretriz para reduzir a velocidade em 1 dia após o vencimento. Quais os impactos na empresa?",
    currentDirectiveAsIs:
      "Tolerância de 5 dias corridos após o vencimento (D+5) mantendo 100% da velocidade contratada antes de qualquer restrição cautelar.",
    proposedDirectiveToBe:
      "Redução automática da velocidade da internet (throttling) já em 1 dia após o vencimento (D+1) para toda a base inadimplente.",
    overallRiskScore: 82,
    viabilityStatus: "Requer Adequação Regulatória e Técnica",
    executiveSummary:
      "A mudança da diretriz de D+5 para D+1 gera ganho financeiro imediato na antecipação de caixa (redução de 2,8 dias no PMR), porém apresenta 2 impedimentos críticos na forma proposta: (1) Conflito direto com a Resolução Anatel nº 632/2014 (Art. 90/91), que exige notificação prévia e prazo regulamentar antes da suspensão parcial/redução de velocidade; e (2) Risco operacional severo devido à janela de compensação bancária de boletos (até 48h úteis), que faria com que 38% dos clientes que pagaram em dia sofressem redução indevida de internet em D+1, disparando chamadas no Call Center (+31%) e queda no NPS (-8 pts).",
    reasoningSteps: [
      "Mapeando processos afetados na Cadeia de Valor: O2C-04.2 (Cobrança), NET-02.1 (Provisionamento QoS) e CX-01.4 (Suporte N1)...",
      "Cruzando proposta com Normativos Internos (POL-FIN-018, PRO-CX-045, IT-TI-112)...",
      "Verificando Base Regulatória Externa: Resolução Anatel nº 632/2014 (RGC) e Código de Defesa do Consumidor...",
      "Analisando série histórica de Indicadores (Inadimplência, PMR, NPS, Volume Call Center, Churn) e Estudo de Compensação Bancária...",
      "Identificando 4 Diretorias impactadas na Matriz RACI e preparando Mesa Redonda com Representantes...",
    ],
    policiesImpacted: [
      {
        id: "pol-1",
        code: "RES-ANATEL-632",
        title: "Resolução Anatel nº 632/2014 (Regulamento Geral de Direitos do Consumidor - RGC)",
        origin: "regulatorio_externo",
        originLabel: "Norma Regulatória Governamental (Contexto Ativo)",
        severity: "bloqueio_legal",
        clauseAffected: "Art. 90 e Art. 91 — Da Suspensão Parcial do Serviço (Redução de Velocidade)",
        currentRuleText:
          "A prestadora somente pode aplicar suspensão parcial (redução da velocidade contratada) após notificar formalmente o consumidor sobre o débito e aguardar o prazo regulamentar de 15 dias pós-notificação.",
        conflictExplanation:
          "Reduzir a velocidade automaticamente em D+1 configura infração regulatória direta de suspensão parcial prematura sem aviso prévio válido, sujeitando a empresa a Processo de Apuração de Descumprimento de Obrigações (PADO), multa da Anatel e bloqueio cautelar pelo Procon.",
        requiredAdjustment:
          "Substituir a redução de velocidade em D+1 por régua de alerta multicanal (Push/WhatsApp/Banner no navegador) e aplicar redução de velocidade apenas após cumprido o rito de notificação ou como redirecionamento de portal cativo informativo sem degradar a banda contratada.",
      },
      {
        id: "pol-2",
        code: "POL-FIN-018",
        title: "Política Corporativa de Crédito, Cobrança e Inadimplência",
        origin: "interno_passivo",
        originLabel: "Normativo Interno (Contexto Passivo)",
        severity: "conflito_alto",
        clauseAffected: "Seção 3.4 — Franquia de Tolerância Pós-Vencimento (Grace Period)",
        currentRuleText:
          "Estabelece franquia padrão de 5 (cinco) dias corridos após o vencimento da fatura para compensação bancária e regularização espontânea sem impacto na prestação do serviço.",
        conflictExplanation:
          "A cláusula atual protege clientes que pagam via boleto bancário (compensação em D+1/D+2). Alterar para D+1 exige revogação da Seção 3.4 e redefinição do tratamento por meio de pagamento.",
        requiredAdjustment:
          "Revisar a POL-FIN-018 diferenciando meios de liquidação instantânea (Pix/Cartão/Débito Automático) de boletos bancários (que exigem janela mínima de 48h úteis de compensação).",
      },
      {
        id: "pol-3",
        code: "CDC-LEI-8078",
        title: "Código de Defesa do Consumidor & Contratos de Adesão Vigentes",
        origin: "regulatorio_externo",
        originLabel: "Legislação Federal (Contexto Ativo)",
        severity: "conflito_alto",
        clauseAffected: "Art. 42 e Cláusula 8.2 do Contrato de Prestação de Serviços (SCM)",
        currentRuleText:
          "O contrato padrão vigente assinado pelos clientes prevê tolerância de 5 dias antes de ações restritivas e comunicação com 30 dias de antecedência para mudanças de regra.",
        conflictExplanation:
          "Aplicar a regra de D+1 sobre contratos ativos sem aditivo e sem aviso prévio de 30 dias gera risco de ações judiciais individuais e coletivas por descumprimento contratual.",
        requiredAdjustment:
          "Emitir comunicado prévio de 30 dias na fatura e aplicar novas regras prioritariamente para novas safras ou mediante gatilho compatível com o contrato.",
      },
      {
        id: "pol-4",
        code: "OKR-EST-2026",
        title: "Planejamento Estratégico 2026–2028 (Guarda-Chuva de Experiência do Cliente)",
        origin: "estrategico_ativo",
        originLabel: "Planejamento Estratégico (Contexto Ativo)",
        severity: "revisao_necessaria",
        clauseAffected: "Diretriz Estratégica #2 — Proteção de NPS e Redução de Custo de Atendimento",
        currentRuleText:
          "Nenhuma iniciativa de eficiência financeira pode causar queda superior a 3 pontos no NPS ou elevar o volume de chamadas humanas no Call Center.",
        conflictExplanation:
          "A redução em D+1 projeta queda de 8 pontos no NPS Transacional e aumento de 31% nas ligações de suporte técnico ('Minha internet está lenta'), violando a trava estratégica do Conselho.",
        requiredAdjustment:
          "Incluir isenção para clientes adimplentes recorrentes (Score Alto / Pagadores em Dia nos últimos 6 meses) e automação de autoatendimento na URA/App.",
      },
      {
        id: "pol-5",
        code: "PRO-CX-045 & IT-TI-112",
        title: "Procedimento de Desbloqueio em Confiança e Integração Billing-Radius",
        origin: "interno_passivo",
        originLabel: "Procedimentos Operacionais (Contexto Passivo)",
        severity: "revisao_necessaria",
        clauseAffected: "Rotina Batch de Throttling (IT-TI-112) e Script de Retenção N1 (PRO-CX-045)",
        currentRuleText:
          "O job de redução de velocidade roda em lote noturno em D+6 e a URA só oferece a opção 'Informar Pagamento' a partir do 5º dia de atraso.",
        conflictExplanation:
          "Se a redução ocorrer em D+1 e a URA não estiver parametrizada para oferecer desbloqueio no 1º dia, 100% dos clientes afetados transbordarão para atendentes humanos.",
        requiredAdjustment:
          "Antecipar a árvore de autoatendimento na URA/WhatsApp para D+1 e mudar a integração Billing-Radius de batch noturno para eventos em tempo real via webhook Pix.",
      },
    ],
    indicatorsImpacted: [
      {
        id: "ind-pos-1",
        code: "IND-FIN-01",
        name: "Inadimplência de Curto Prazo (Atraso D+1 a D+10)",
        area: "Finanças & Cobrança",
        direction: "positivo",
        currentValue: "8,4%",
        projectedValue: "5,9%",
        deltaLabel: "-2,5 p.p. (Melhora de 29%)",
        confidence: "Alta",
        rationale:
          "O efeito imediato na percepção do serviço faz com que clientes que esqueceram a fatura priorizem a quitação via Pix logo nas primeiras 24h.",
      },
      {
        id: "ind-pos-2",
        code: "IND-FIN-02",
        name: "Prazo Médio de Recebimento (PMR / DSO)",
        area: "Finanças & Tesouraria",
        direction: "positivo",
        currentValue: "34,2 dias",
        projectedValue: "31,4 dias",
        deltaLabel: "-2,8 dias no ciclo de caixa",
        confidence: "Alta",
        rationale:
          "Antecipação estimada de R$ 14,5 milhões em fluxo de caixa mensal que antes ficava retido entre o 1º e o 5º dia após o vencimento.",
      },
      {
        id: "ind-pos-3",
        code: "IND-FIN-03",
        name: "Migração de Pagamento para Pix / Débito Automático",
        area: "Finanças & Canais Digitais",
        direction: "positivo",
        currentValue: "46% da base",
        projectedValue: "58% da base",
        deltaLabel: "+12 p.p. em meios instantâneos",
        confidence: "Média",
        rationale:
          "Para evitar a redução de velocidade e ter liberação imediata do sinal, clientes abandonam o boleto tradicional em favor do Pix no App.",
      },
      {
        id: "ind-neg-1",
        code: "IND-CX-01",
        name: "NPS Transacional (Jornada Fatura & Conectividade)",
        area: "Atendimento & CX",
        direction: "negativo",
        currentValue: "66 pts",
        projectedValue: "58 pts",
        deltaLabel: "-8 pts (Abaixo da meta de 65)",
        confidence: "Alta",
        rationale:
          "Forte atrito com clientes adimplentes históricos que atrasaram apenas 1 dia por esquecimento ou cujo boleto pago no vencimento ainda não compensou.",
      },
      {
        id: "ind-neg-2",
        code: "IND-CX-04",
        name: "Volume de Chamadas no Call Center (Suporte Técnico + Financeiro)",
        area: "Operações de Atendimento",
        direction: "negativo",
        currentValue: "42.500 lig/mês",
        projectedValue: "55.700 lig/mês",
        deltaLabel: "+31% (+13.200 chamadas/mês)",
        confidence: "Alta",
        rationale:
          "Muitos clientes não associam lentidão em D+1 a atraso de fatura; ligam para o Suporte Técnico achando que é defeito no Wi-Fi/Fibra, gerando custo extra de R$ 198 mil/mês em atendimento.",
      },
      {
        id: "ind-neg-3",
        code: "IND-REG-02",
        name: "Índice de Reclamações Anatel & Consumidor.gov",
        area: "Jurídico & Ouvidoria",
        direction: "negativo",
        currentValue: "1,12 / mil",
        projectedValue: "1,68 / mil",
        deltaLabel: "+50% (Ultrapassa teto regulatório)",
        confidence: "Alta",
        rationale:
          "Clientes penalizados antes do prazo legal da Resolução 632 registram queixa direta no aplicativo Anatel Consumidor por 'Suspensão/Redução Indevida'.",
      },
      {
        id: "ind-neg-4",
        code: "IND-COM-03",
        name: "Churn Voluntário Mensal (Cancelamento a Pedido)",
        area: "Comercial & Retenção",
        direction: "negativo",
        currentValue: "1,45% a.m.",
        projectedValue: "1,78% a.m.",
        deltaLabel: "+0,33 p.p. (~2.100 clientes perdidos/mês)",
        confidence: "Média",
        rationale:
          "Segundo o Estudo de Elasticidade interno, clientes com bom score que sofrem redução abrupta em D+1 sentem quebra de confiança e migram para concorrentes locais.",
      },
    ],
    areasAndCommittee: [
      {
        id: "rep-fin",
        areaId: "area-fin",
        areaName: "Diretoria Financeira & Cobrança (O2C)",
        shortArea: "Financeiro & Cobrança",
        agentName: "Roberto Almeida",
        agentRole: "Diretor de Crédito, Cobrança & Tesouraria",
        avatarColor: "#0284c7",
        avatarInitials: "RA",
        impactLevel: "Alto",
        raciRole: "Aprovador (A)",
        stance: "favoravel",
        stanceSummary: "Defende a antecipação de caixa, mas reconhece o problema dos boletos em compensação.",
        affectedProcesses: ["O2C-04.2 Gestão de Faturamento e Régua de Cobrança", "O2C-04.5 Conciliação Bancária CNAB/Pix"],
        affectedSystems: ["SAP S/4HANA FI-CA", "Motor de Régua de Cobrança", "Gateway Pix"],
        mainConcerns: [
          "Precisamos reduzir o DSO em pelo menos 2,5 dias neste trimestre para bater a meta de caixa do Conselho.",
          "Hoje o cliente sabe que nada acontece nos primeiros 5 dias, o que cria um hábito de atraso recorrente entre D+1 e D+5.",
        ],
        positivePointsSeen: [
          "Injeção rápida de R$ 14,5M no capital de giro da companhia.",
          "Estímulo forte para que a base migre do boleto bancário para Pix e Débito Automático.",
        ],
        negotiationConditions: [
          "Disparar gatilho de notificação interativa em D+1 com Pix Copia-e-Cola para capturar a antecipação de caixa sem precisar punir quem pagou por boleto.",
          "Para clientes reincidentes crônicos (atraso nos últimos 3 meses), aplicar régua mais rigorosa a partir de D+3.",
        ],
        openingStatement:
          "Pelo lado Financeiro, essa mudança ataca uma dor real: temos mais de R$ 40 milhões flutuando entre D+1 e D+5 todo mês porque o cliente aprendeu que a tolerância de 5 dias não tem consequência. Porém, concordo que punir quem já pagou boleto e está aguardando compensação bancária vai sair caro. Podemos calibrar essa regra por perfil de risco e meio de pagamento.",
      },
      {
        id: "rep-cx",
        areaId: "area-cx",
        areaName: "Diretoria de Atendimento, CX & Retenção",
        shortArea: "Atendimento & CX",
        agentName: "Camila Mendes",
        agentRole: "Diretora de Experiência do Cliente (CX)",
        avatarColor: "#ea580c",
        avatarInitials: "CM",
        impactLevel: "Crítico",
        raciRole: "Consultado (C)",
        stance: "resistente",
        stanceSummary: "Contrária à redução em D+1 sem filtro de score; alerta para colapso no suporte técnico e queda no NPS.",
        affectedProcesses: ["CX-01.4 Suporte Técnico N1/N2", "CX-02.1 Retenção e Reversão de Cancelamento", "CX-01.1 Autoatendimento URA/App"],
        affectedSystems: ["Genesys Cloud (Call Center)", "Salesforce Service Cloud", "Bot WhatsApp / App Cliente"],
        mainConcerns: [
          "Em D+1 o cliente não sabe que a internet ficou lenta por causa da fatura que venceu ontem; ele acha que o roteador estragou e liga para o Suporte Técnico.",
          "Vamos receber +13 mil chamadas humanas por mês, estourando o TMA e gerando quase R$ 200 mil/mês de custo adicional na operação de atendimento.",
          "Penalizar em D+1 um cliente fiel (que paga em dia há 2 anos e esqueceu um único mês) destrói o NPS e gera mais de 2.000 cancelamentos (Churn) por mês.",
        ],
        positivePointsSeen: [
          "Se usarmos o D+1 para uma notificação transparente na tela (Portal Cativo / Push com Pix Copia-e-Cola) em vez de cortar a velocidade silenciosamente, o cliente resolve sozinho no digital.",
        ],
        negotiationConditions: [
          "Isentar clientes de Bom Score / Adimplentes Históricos nos primeiros 5 dias, enviando apenas lembrete amigável.",
          "Antes de qualquer restrição, exibir aviso claro no App/WhatsApp com botão de Pix e 'Desbloqueio em Confiança' em 1 clique.",
        ],
        openingStatement:
          "Da cadeira de CX e Atendimento, reduzir a velocidade em D+1 para toda a base é um tiro no pé. O ganho financeiro no caixa será corroído pelo custo de +13 mil ligações no Call Center e pela perda de mais de 2 mil clientes no Churn. Além disso, 38% dos boletos pagos no vencimento ainda não compensaram em D+1! Precisamos proteger o bom pagador e avisar antes de restringir.",
      },
      {
        id: "rep-jur",
        areaId: "area-jur",
        areaName: "Jurídico & Assuntos Regulatórios",
        shortArea: "Jurídico & Regulatório",
        agentName: "Dra. Helena Vasconcelos",
        agentRole: "Head de Jurídico, Compliance & Regulação",
        avatarColor: "#7c3aed",
        avatarInitials: "HV",
        impactLevel: "Crítico",
        raciRole: "Aprovador (A)",
        stance: "resistente",
        stanceSummary: "Bloqueio regulatório para suspensão parcial em D+1; viola o Art. 90/91 da Resolução Anatel nº 632/2014.",
        affectedProcesses: ["JUR-03.1 Gestão de Contencioso e Órgãos Reguladores", "GOV-01.2 Atualização de Contratos de Adesão"],
        affectedSystems: ["Sistema Integrado Anatel Consumidor", "Gestão de Contratos e Aditivos"],
        mainConcerns: [
          "A Resolução Anatel nº 632/2014 (Art. 90 e 91) classifica a redução de velocidade como 'Suspensão Parcial', que exige notificação prévia formal e decurso de 15 dias após a notificação.",
          "Nosso Contrato de Adesão registrado prevê expressamente 5 dias de tolerância operacional; mudar isso unilateralmente para D+1 viola o CDC (Art. 42 e dever de informação).",
          "O risco de abertura de PADO na Anatel e multa milionária é altíssimo se reduzirmos a velocidade em 24h após o vencimento.",
        ],
        positivePointsSeen: [
          "A regulação permite notificar o cliente a partir de D+1 (via SMS, WhatsApp, E-mail e Aviso no Browser) e oferecer incentivos para pagamento imediato.",
        ],
        negotiationConditions: [
          "Substituir a redução de banda em D+1 por 'Aviso Interativo de Fatura em Aberto' (Wall Garden informativo dispensável, sem degradar a velocidade antes do prazo legal de 15 dias da Anatel).",
          "Comunicar a alteração de régua de relacionamento com 30 dias de antecedência nas faturas conforme o CDC.",
        ],
        openingStatement:
          "Como Jurídico e Regulatório, preciso registrar um alerta vermelho: não podemos simplesmente reduzir a velocidade em D+1. Pela Resolução 632 da Anatel, redução de velocidade por inadimplência é suspensão parcial e exige notificação prévia + prazo legal. Se fizermos isso em D+1, seremos autuados pela Anatel e pelos Procons na primeira semana. A saída jurídica segura é usar um alerta informativo (redirecionamento amigável com QR Code Pix que libera a navegação normal após visualização) em vez de reduzir a banda em D+1.",
      },
      {
        id: "rep-ti",
        areaId: "area-ti",
        areaName: "Engenharia de Redes, TI & Sistemas de Billing",
        shortArea: "TI, Rede & Billing",
        agentName: "Marcos Oliveira",
        agentRole: "Head de Engenharia de Redes & Sistemas de Billing",
        avatarColor: "#059669",
        avatarInitials: "MO",
        impactLevel: "Alto",
        raciRole: "Responsável (R)",
        stance: "ressalvas",
        stanceSummary: "Aponta gargalo técnico na compensação CNAB de boletos em D+1 e sobrecarga de comandos no BRAS/Radius.",
        affectedProcesses: ["NET-02.1 Provisionamento e QoS de Banda", "TI-05.3 Processamento Batch de Faturamento e Baixa CNAB"],
        affectedSystems: ["BRAS / Servidor Radius (Controle de Banda)", "Barramento de Integração SOA/Webhook", "ERP Billing"],
        mainConcerns: [
          "Os arquivos de retorno bancário (CNAB de boletos pagos no vencimento) só terminam de ser processados no nosso ERP entre 14h de D+1 e 10h de D+2. Se o comando de redução rodar às 00h01 de D+1, vamos derrubar a velocidade de milhares de clientes que já pagaram!",
          "Atualmente nosso servidor Radius processa lotes de redução em D+6 (volume menor). Executar em D+1 quintuplica o volume de sessões PPPoE/IPoE reiniciadas simultaneamente na rede.",
        ],
        positivePointsSeen: [
          "Já temos webhook em tempo real para pagamentos via Pix que consegue retirar qualquer alerta ou restrição em menos de 3 minutos.",
        ],
        negotiationConditions: [
          "Aguardar janela mínima de 48h úteis (D+3 útil) para faturas emitidas em Boleto Bancário antes de qualquer ação na rede.",
          "Utilizar injeção de notificação HTTP/Push ou perfil dinâmico CoA sem derrubar as sessões PPPoE no Radius.",
        ],
        openingStatement:
          "Falando pela Engenharia de Redes e TI: tecnicamente, rodar redução em D+1 cria uma armadilha grave com a compensação bancária. Quem pagou boleto ontem às 19h só vai constar como 'pago' no nosso Billing amanhã à tarde. Se reduzirmos em D+1 cedo, vamos punir quem já pagou. Além disso, reiniciar centenas de milhares de sessões no Radius em D+1 vai gerar pico de sinalização na rede. Precisamos respeitar a janela bancária de 48h úteis.",
      },
    ],
    affectedProcesses: [
      {
        id: "proc-1",
        code: "O2C-04.2",
        name: "Gestão de Faturamento, Cobrança e Régua de Inadimplência",
        valueChainPath: "Order to Cash (O2C) > Faturamento e Recebimento > Gestão de Inadimplência",
        ownerArea: "Finanças & Cobrança",
        businessRulesAffected: ["RN-COB-012 (Grace Period D+5)", "RN-COB-015 (Reabilitação Pós-Baixa)"],
        changeRequired:
          "Redesenhar o fluxo da régua preventiva (D+1 a D+5), separando a trilha de clientes Pix/Cartão da trilha de Boleto Bancário e inserindo trava de verificação de notificação regulatória.",
      },
      {
        id: "proc-2",
        code: "NET-02.1",
        name: "Provisionamento e Controle de Qualidade de Banda (QoS / Throttling)",
        valueChainPath: "Operações de Rede > Gerenciamento de Tráfego > Controle de Banda",
        ownerArea: "TI, Rede & Billing",
        businessRulesAffected: ["IT-TI-112 (Batch de Redução de Banda no Radius/BRAS)"],
        changeRequired:
          "Alterar integração batch para arquitetura orientada a eventos (CoA - Change of Authorization) e configurar Portal de Aviso Amigável em vez de degradação prematura de banda.",
      },
      {
        id: "proc-3",
        code: "CX-01.4",
        name: "Atendimento de Suporte Técnico N1 e Retenção",
        valueChainPath: "Customer Experience (CX) > Atendimento ao Cliente > Suporte & Retenção",
        ownerArea: "Atendimento & CX",
        businessRulesAffected: ["RN-CX-008 (Desbloqueio em Confiança)", "PRO-CX-045 (Script de Velocidade Reduzida)"],
        changeRequired:
          "Atualizar árvore da URA e WhatsApp para identificar chamadas de clientes em atraso recente, oferecendo envio de 2ª via Pix e liberação imediata sem transbordo para fila técnica.",
      },
    ],
    risks: [
      {
        id: "risk-1",
        category: "Regulatório & Legal",
        title: "Autuação da Anatel (PADO) e Multa por Suspensão Parcial fora do Prazo Legal",
        severity: "Crítico",
        probability: "Alta",
        description:
          "A redução de velocidade em D+1 sem o prazo legal de 15 dias pós-notificação previsto no Art. 91 da Resolução 632/2014 expõe a empresa a sanções regulatórias e medidas cautelares de Procons.",
        mitigation:
          "Substituir a redução de velocidade em D+1/D+2 por Aviso Interativo de Fatura (Push/WhatsApp/Banner) e manter a redução efetiva de banda estritamente após o cumprimento do prazo legal de notificação.",
      },
      {
        id: "risk-2",
        category: "Técnico & Sistemas",
        title: "Falso-Positivo por Latência de Compensação Bancária (CNAB de Boletos)",
        severity: "Crítico",
        probability: "Alta",
        description:
          "38% dos clientes que pagam boleto na data de vencimento têm compensação apenas entre D+1 e D+2. Reduzir em D+1 afetará clientes adimplentes que já pagaram.",
        mitigation:
          "Criar trava sistêmica no Billing que aguarda 48h úteis para faturas emitidas em modalidade Boleto e libera em tempo real mediante comprovante ou Pix.",
      },
      {
        id: "risk-3",
        category: "Operacional & Atendimento",
        title: "Transbordo Massivo para o Suporte Técnico N1 (+13.200 chamadas/mês)",
        severity: "Alto",
        probability: "Alta",
        description:
          "Clientes percebem lentidão em D+1 como falha técnica da fibra/roteador e acionam o suporte humano, elevando o custo operacional em R$ 198 mil/mês.",
        mitigation:
          "Configurar aviso explicativo na tela/App informando o status da fatura com QR Code Pix e botão de autorregularização instantânea.",
      },
      {
        id: "risk-4",
        category: "Reputacional & CX",
        title: "Aumento de Churn em Clientes de Bom Histórico (+2.100 cancelamentos/mês)",
        severity: "Alto",
        probability: "Média",
        description:
          "Clientes com alto tempo de casa (LTV alto) que esquecem o pagamento por 1 dia sentem quebra de relacionamento ao sofrer restrição imediata.",
        mitigation:
          "Segmentar a régua por Score de Comportamento: clientes 'Adimplentes Históricos' mantêm tolerância estendida e recebem apenas lembrete amigável.",
      },
    ],
    benefits: [
      {
        id: "ben-1",
        category: "Financeiro & Caixa",
        title: "Antecipação de Fluxo de Caixa em R$ 14,5 Milhões/mês (-2,8 dias no PMR)",
        impactEstimate: "+R$ 14,5M em liquidez mensal",
        horizon: "Imediato (30 dias)",
        description:
          "Reduz o volume de receitas retidas na janela D+1 a D+5, melhorando diretamente o capital de giro e reduzindo necessidade de captação.",
      },
      {
        id: "ben-2",
        category: "Comportamento de Pagamento",
        title: "Redução de 29% na Inadimplência de Curto Prazo (D+1 a D+10)",
        impactEstimate: "-2,5 p.p. na inadimplência curta",
        horizon: "Curto Prazo (90 dias)",
        description:
          "Elimina a inércia de esquecimento nos primeiros dias pós-vencimento através de acionamento imediato.",
      },
      {
        id: "ben-3",
        category: "Eficiência Operacional",
        title: "Aceleração da Migração do Boleto para Pix e Débito Automático (+12 p.p.)",
        impactEstimate: "Economia de R$ 85 mil/mês em tarifas bancárias",
        horizon: "Médio Prazo (6 meses)",
        description:
          "Incentiva a liquidação instantânea via Pix Copia-e-Cola integrado aos avisos digitais.",
      },
    ],
    recommendedConsensusProposal: {
      title: "Proposta de Consenso do Comitê: Régua Inteligente Segmentada (D+1 Digital / D+3 Boleto / Respeito ao RGC)",
      description:
        "Acordo construído entre Financeiro, CX, Jurídico e TI que preserva 85% do ganho de caixa sem violar a Resolução 632 da Anatel e sem punir boletos em compensação:",
      adjustedDirectiveText:
        "1) Em D+1: Disparo de Notificação oficial + Lembrete Interativo via WhatsApp/App com Pix Copia-e-Cola (sem reduzir a banda contratada, cumprindo a Resolução Anatel 632). 2) Em D+3 útil (após janela de compensação de boletos): Aviso de Navegação (Banner informativo dispensável) apenas para clientes com Score de Risco Médio/Alto, isentando clientes Adimplentes Históricos. 3) Redução de velocidade (Suspensão Parcial) aplicada estritamente após o prazo legal de 15 dias da notificação formal.",
      keyChanges: [
        "⚖️ Jurídico/Regulatório: Substitui redução de banda em D+1 por Notificação Oficial + Aviso Interativo sem degradar velocidade antes do prazo legal da Anatel (Risco regulatório cai a zero).",
        "⚙️ TI & Billing: Respeita janela de 48h úteis de compensação de boletos CNAB, eliminando falsos-positivos em clientes que já pagaram.",
        "🎧 Atendimento & CX: Isenta clientes de Bom Histórico nos primeiros 5 dias e adiciona Pix 1-Clique no alerta, reduzindo o impacto no NPS de -8 pts para -0,5 pt.",
        "💼 Financeiro: Captura 85% da antecipação de caixa projetada (PMR cai 2,3 dias) através da conversão imediata do alerta interativo Pix em D+1/D+2.",
      ],
    },
  },

  "procurement-alcada-10k": {
    id: "procurement-alcada-10k",
    title: "Redução da Alçada de Aprovação Automática de Compras: De R$ 50 mil para R$ 10 mil",
    domainTag: "Suprimentos, Governança & Operações",
    userDirectivePrompt:
      "Atualmente compras operacionais até R$ 50.000 são aprovadas automaticamente pelo gerente da área se estiverem dentro do orçamento. Estamos estudando reduzir essa alçada para R$ 10.000, exigindo assinatura de 2 Diretores acima disso. Quais os impactos?",
    currentDirectiveAsIs:
      "Aprovação automática por Gerente de Área para requisições de compras operacionais até R$ 50.000 dentro do budget anual.",
    proposedDirectiveToBe:
      "Redução do limite de aprovação gerencial para R$ 10.000; qualquer compra acima de R$ 10.000 passa a exigir dupla aprovação de Diretores.",
    overallRiskScore: 68,
    viabilityStatus: "Viável com Condicionantes",
    executiveSummary:
      "A redução linear da alçada de R$ 50k para R$ 10k aumenta o controle sobre despesas discricionárias (economia projetada de 6,5% em OPEX avulso), mas gera um gargalo operacional severo: +410 requisições/mês subirão para a fila de Diretores, aumentando o Lead Time médio de compras (P2P) de 4,2 dias para 11,5 dias e colocando em risco o SLA de manutenção corretiva de campo e reposição de estoque.",
    reasoningSteps: [
      "Mapeando processo P2P-03.1 (Aprovação de Requisições e Pedidos de Compra) e Matriz de Alçadas...",
      "Cruzando volume histórico de pedidos entre R$ 10k e R$ 50k nos últimos 12 meses...",
      "Avaliando impactos em SLAs operacionais de Manutenção de Rede, TI e Operações de Campo...",
      "Convocando representantes de Suprimentos, FP&A/Finanças, Operações e Compliance...",
    ],
    policiesImpacted: [
      {
        id: "pol-p2p-1",
        code: "POL-GOV-002",
        title: "Política Corporativa de Alçadas e Procurações Financeiras",
        origin: "interno_passivo",
        originLabel: "Normativo Interno (Contexto Passivo)",
        severity: "revisao_necessaria",
        clauseAffected: "Tabela de Alçadas Nível 3 (Gerentes Seniores) e Nível 2 (Diretores)",
        currentRuleText:
          "Gerentes possuem alçada individual até R$ 50 mil para itens de OPEX previstos em orçamento anual aprovado.",
        conflictExplanation:
          "Exige reconfiguração das matrizes de workflow no SAP Ariba/S4HANA e alteração formal do regimento de alçadas.",
        requiredAdjustment:
          "Atualizar Anexo I da POL-GOV-002 e criar regra de exceção para compras emergenciais de parada de operação.",
      },
      {
        id: "pol-p2p-2",
        code: "PRO-SUP-019",
        title: "Procedimento de Compras de Emergência e Contratos Guarda-Chuva",
        origin: "interno_passivo",
        originLabel: "Procedimento Operacional (Contexto Passivo)",
        severity: "conflito_alto",
        clauseAffected: "Seção 2.1 — Liberação de Pedidos de Contratos Já Homologados",
        currentRuleText:
          "Chamadas de entrega (Call-offs) de contratos guarda-chuva já licitados seguem a alçada simplificada de até R$ 50 mil.",
        conflictExplanation:
          "Exigir dupla assinatura de Diretores para pedidos de contratos que já foram negociados e aprovados anteriormente gera retrabalho burocrático sem ganho financeiro adicional.",
        requiredAdjustment:
          "Manter alçada de R$ 50 mil para pedidos vinculados a Contratos Guarda-Chuva vigentes e aplicar o teto de R$ 10 mil apenas para compras Spot (avulsas).",
      },
    ],
    indicatorsImpacted: [
      {
        id: "ind-p2p-pos1",
        code: "IND-FIN-09",
        name: "Aderência ao Orçamento de OPEX Discricionário",
        area: "FP&A & Controladoria",
        direction: "positivo",
        currentValue: "94,2%",
        projectedValue: "98,8%",
        deltaLabel: "+4,6 p.p. (Economia de R$ 420k/mês)",
        confidence: "Alta",
        rationale:
          "O escrutínio executivo inibe requisições avulsas não essenciais entre R$ 10k e R$ 50k.",
      },
      {
        id: "ind-p2p-pos2",
        code: "IND-COMP-02",
        name: "Índice de Compras Fora de Contrato (Maverick Spend)",
        area: "Suprimentos & Compliance",
        direction: "positivo",
        currentValue: "14,0%",
        projectedValue: "7,5%",
        deltaLabel: "-6,5 p.p. em compras avulsas",
        confidence: "Alta",
        rationale:
          "Áreas solicitantes passam a consolidar demandas em contratos anuais para evitar o fluxo mais lento.",
      },
      {
        id: "ind-p2p-neg1",
        code: "IND-SUP-01",
        name: "Lead Time Médio de Aprovação de Compras (Ciclo P2P)",
        area: "Suprimentos & Operações",
        direction: "negativo",
        currentValue: "4,2 dias",
        projectedValue: "11,5 dias",
        deltaLabel: "+7,3 dias de atraso médio",
        confidence: "Alta",
        rationale:
          "A agenda de dois Diretores adiciona em média 5 a 7 dias úteis de espera na fila de aprovação do SAP.",
      },
      {
        id: "ind-p2p-neg2",
        code: "IND-COMP-05",
        name: "Risco de Fracionamento de Pedidos (Split Orders < R$ 10k)",
        area: "Auditoria & Compliance",
        direction: "negativo",
        currentValue: "1,8% dos pedidos",
        projectedValue: "9,4% dos pedidos",
        deltaLabel: "+7,6 p.p. em fracionamento",
        confidence: "Média",
        rationale:
          "Quando o limite cai drasticamente para R$ 10k sem distinção de urgência, gestores tendem a dividir uma compra de R$ 24k em 3 pedidos de R$ 8k para contornar o gargalo.",
      },
    ],
    areasAndCommittee: [
      {
        id: "rep-fpa",
        areaId: "area-fin",
        areaName: "Controladoria & FP&A (Finanças)",
        shortArea: "Controladoria & FP&A",
        agentName: "Ricardo Tavares",
        agentRole: "Diretor de FP&A e Controle Orçamentário",
        avatarColor: "#0284c7",
        avatarInitials: "RT",
        impactLevel: "Alto",
        raciRole: "Aprovador (A)",
        stance: "favoravel",
        stanceSummary: "Apoia o maior rigor sobre despesas avulsas, mas não quer assinar 400 pedidos operacionais por mês.",
        affectedProcesses: ["FIN-02.1 Controle de Execução Orçamentária OPEX"],
        affectedSystems: ["SAP S/4HANA CO", "PowerBI Budget Tracker"],
        mainConcerns: [
          "Tivemos desvio de R$ 3,2M em compras avulsas entre R$ 15k e R$ 45k no último semestre.",
          "Porém, se a minha diretoria tiver que aprovar manualmente cada reposição de insumo de R$ 12 mil, vamos travar a agenda executiva.",
        ],
        positivePointsSeen: ["Visibilidade preventiva do gasto antes da emissão do Pedido de Compra (PO)."],
        negotiationConditions: [
          "Restringir a alçada de R$ 10k apenas para compras Spot (sem contrato) ou para centros de custo que já ultrapassaram 85% do budget mensal.",
        ],
        openingStatement:
          "Como FP&A, quero fechar a torneira dos gastos avulsos entre R$ 10k e R$ 50k. Mas aprovar manualmente 410 requisições rotineiras por mês é inviável para os Diretores. Devemos aplicar a trava de R$ 10k apenas para compras fora de contrato (Spot) ou áreas estouradas no orçamento.",
      },
      {
        id: "rep-ops",
        areaId: "area-ops",
        areaName: "Diretoria de Operações & Manutenção",
        shortArea: "Operações & Campo",
        agentName: "Eng. Fernando Costa",
        agentRole: "Diretor de Operações e Continuidade",
        avatarColor: "#ea580c",
        avatarInitials: "FC",
        impactLevel: "Crítico",
        raciRole: "Consultado (C)",
        stance: "resistente",
        stanceSummary: "Alerta que esperar 11 dias por duas assinaturas de Diretor vai parar manutenções críticas.",
        affectedProcesses: ["OPS-04.1 Manutenção Corretiva e Preventiva", "SUP-02.3 Reposição de Materiais Críticos"],
        affectedSystems: ["SAP PM (Manutenção)", "SAP Ariba"],
        mainConcerns: [
          "Qualquer peça de reposição ou serviço especializado custa entre R$ 15k e R$ 40k. Esperar 11 dias por duas assinaturas de Diretor significa deixar equipamento parado.",
        ],
        positivePointsSeen: ["Nenhum ganho direto para a agilidade operacional se aplicado de forma linear."],
        negotiationConditions: [
          "Manter alçada de R$ 50k para itens de Manutenção Crítica e para pedidos de Contratos Guarda-Chuva já homologados.",
        ],
        openingStatement:
          "Na Operação, um atraso de 7 dias na aprovação de um serviço de R$ 18 mil custa muito mais caro em indisponibilidade do que a economia pretendida. Se o contrato já foi licitado por Suprimentos e tem budget aprovado, não faz sentido exigir dupla assinatura de Diretor a cada pedido.",
      },
      {
        id: "rep-sup",
        areaId: "area-sup",
        areaName: "Diretoria de Suprimentos (Procurement)",
        shortArea: "Suprimentos (P2P)",
        agentName: "Patrícia Nogueira",
        agentRole: "Head de Procurement & Compras",
        avatarColor: "#059669",
        avatarInitials: "PN",
        impactLevel: "Alto",
        raciRole: "Responsável (R)",
        stance: "ressalvas",
        stanceSummary: "Sugere diferenciar Compras Spot (R$ 10k) de Pedidos de Contrato Catalogado (R$ 50k).",
        affectedProcesses: ["P2P-03.1 Aprovação de Requisições e Pedidos de Compra"],
        affectedSystems: ["SAP Ariba Buying", "Portal de Fornecedores"],
        mainConcerns: [
          "Queda brusca para R$ 10k incentiva as áreas a fracionarem compras (emitir 3 pedidos de R$ 9.500 em vez de 1 de R$ 28.500).",
        ],
        positivePointsSeen: ["Fortalece a adesão aos catálogos e contratos corporativos negociados por Suprimentos."],
        negotiationConditions: [
          "Catálogos e Contratos ativos mantêm aprovação gerencial até R$ 50k; Compras Spot sem contrato caem para R$ 10k.",
        ],
        openingStatement:
          "Em Suprimentos, apoiamos reduzir o Maverick Spend (compras sem contrato). A solução inteligente é: se a área comprar dentro de um Catálogo/Contrato já homologado por Suprimentos, mantém alçada de R$ 50k. Se for compra avulsa (Spot), aplica o limite rigoroso de R$ 10k.",
      },
      {
        id: "rep-comp",
        areaId: "area-jur",
        areaName: "Compliance & Auditoria Interna",
        shortArea: "Compliance & Riscos",
        agentName: "Dr. André Linhares",
        agentRole: "Gerente Executivo de Compliance e Controles Internos",
        avatarColor: "#7c3aed",
        avatarInitials: "AL",
        impactLevel: "Médio",
        raciRole: "Consultado (C)",
        stance: "favoravel",
        stanceSummary: "Favorável ao princípio dos 4 olhos, desde que haja regra anti-fracionamento no SAP.",
        affectedProcesses: ["GOV-02.4 Monitoramento Contínuo de Controles Internos (SOX)"],
        affectedSystems: ["SAP GRC Access & Process Control"],
        mainConcerns: [
          "Sem bloqueio automático de fracionamento (Split PO) no sistema, a redução de alçada gera mais burla de controle do que governança.",
        ],
        positivePointsSeen: ["Reforça segregação de funções (SoD) em despesas não recorrentes."],
        negotiationConditions: [
          "Implementar regra no SAP GRC que soma requisições do mesmo centro de custo/fornecedor nos últimos 30 dias para impedir fracionamento.",
        ],
        openingStatement:
          "Do ponto de vista de Compliance, reduzir alçada só funciona se o SAP somar o acumulado de 30 dias por fornecedor para impedir o fracionamento de notas. Com a distinção entre Contrato Homologado (R$ 50k) e Compra Spot (R$ 10k), teremos controle sem travar a empresa.",
      },
    ],
    affectedProcesses: [
      {
        id: "proc-p2p-1",
        code: "P2P-03.1",
        name: "Aprovação de Requisições e Pedidos de Compra (Procure-to-Pay)",
        valueChainPath: "Suprimentos (P2P) > Gestão de Requisições > Workflow de Alçadas",
        ownerArea: "Suprimentos",
        businessRulesAffected: ["RN-SUP-004 (Matriz de Alçada OPEX)", "RN-SUP-011 (Validação Anti-Fracionamento)"],
        changeRequired:
          "Separar regra de workflow no SAP Ariba entre 'Compra Catalogada/Contrato' (até R$ 50k gerencial) e 'Compra Spot/Avulsa' (acima de R$ 10k exige Diretor).",
      },
    ],
    risks: [
      {
        id: "risk-p2p-1",
        category: "Operacional & Atendimento",
        title: "Atraso de +7,3 dias na Contratação de Manutenção e Reposição Operacional",
        severity: "Crítico",
        probability: "Alta",
        description:
          "A fila de dupla assinatura diretora eleva o ciclo de aprovação de 4,2 para 11,5 dias.",
        mitigation:
          "Isentar pedidos de Contratos Guarda-Chuva já licitados e criar fast-track com SLA de 4h no mobile para emergências operacionais.",
      },
      {
        id: "risk-p2p-2",
        category: "Regulatório & Legal",
        title: "Aumento de Fracionamento Artificial de Pedidos (Split Orders)",
        severity: "Alto",
        probability: "Média",
        description:
          "Gestores podem dividir compras de R$ 25k em três requisições menores que R$ 10k.",
        mitigation:
          "Ativar trava no SAP GRC que acumula o valor por fornecedor/família de compra nos últimos 30 dias.",
      },
    ],
    benefits: [
      {
        id: "ben-p2p-1",
        category: "Financeiro & Caixa",
        title: "Redução de R$ 420 mil/mês em Despesas Avulsas (OPEX Spot)",
        impactEstimate: "R$ 5,04M/ano em economia",
        horizon: "Imediato (30 dias)",
        description: "Inibe contratações avulsas fora de catálogo e melhora a aderência ao orçamento.",
      },
    ],
    recommendedConsensusProposal: {
      title: "Proposta de Consenso do Comitê: Alçada Dual Inteligente (Spot R$ 10k vs. Contrato Homologado R$ 50k)",
      description:
        "Acordo entre FP&A, Operações, Suprimentos e Compliance que controla gastos avulsos sem burocratizar a operação recorrente:",
      adjustedDirectiveText:
        "1) Reduzir a alçada para R$ 10.000 exclusivamente para Compras Spot (fora de contrato/catálogo) ou Centros de Custo acima de 85% do budget mensal. 2) Manter alçada gerencial de até R$ 50.000 para pedidos vinculados a Contratos Guarda-Chuva já licitados por Suprimentos. 3) Ativar trava automática anti-fracionamento (acumulado 30 dias por fornecedor) no SAP.",
      keyChanges: [
        "💼 FP&A: Garante controle sobre 100% dos gastos Spot e desvios de budget sem sobrecarregar agendas de Diretores.",
        "⚙️ Operações: Mantém agilidade de 4 dias para acionar fornecedores de manutenção e insumos já contratados.",
        "📦 Suprimentos & Compliance: Incentiva uso de contratos homologados e bloqueia fracionamento de pedidos via SAP GRC.",
      ],
    },
  },

  "telecom-speed-400mb": {
    id: "telecom-speed-400mb",
    title: "Aumento de Velocidade para 400MB para a Base de Clientes B2C",
    domainTag: "Produto, Rede, Operações & CX",
    userDirectivePrompt:
      "Estamos avaliando aumentar a velocidade para 400MB para toda a base de clientes B2C abaixo desse patamar (+75 mil assinantes) para reduzir o churn voluntário e fortalecer a competitividade da marca. Quais os impactos na empresa?",
    currentDirectiveAsIs:
      "Base B2C legado operando em planos de 100MB a 300MB, com upgrades condicionados à solicitação ativa do cliente e recontratação comercial.",
    proposedDirectiveToBe:
      "Upgrade massivo da base de clientes B2C para 400MB (+75 mil clientes) visando redução de churn voluntário e blindagem competitiva.",
    overallRiskScore: 76,
    viabilityStatus: "Viável com Condicionantes",
    executiveSummary:
      "Aumentar a velocidade para 400MB para mais de 75 mil clientes visa diretamente reduzir o churn e melhorar a satisfação, fortalecendo a marca. Contudo, essa ação agressiva impõe uma pressão extrema sobre a capacidade da rede, os processos de provisionamento em massa e as equipes de campo e atendimento. Os principais riscos são a degradação da qualidade do serviço para toda a base, o esgotamento dos colaboradores e a necessidade de um CAPEX significativo em curto prazo. O sucesso da iniciativa depende de uma execução impecável, começando com uma validação rigorosa da capacidade da infraestrutura e uma implementação gradual.",
    reasoningSteps: [
      "Mapeando processos de Capacidade de Rede (NET-02.1), Provisionamento (O2C-02.3) e Operações de Campo...",
      "Cruzando com Regulamento de Qualidade Anatel (RQUAL / RGC) e requisitos de homologação de equipamentos ONT...",
      "Simulando impacto em Voice of Customer (IQP, NPS Relacional, Speedtest, Churn) e Voice of Employee (Turnover, Absenteísmo)...",
      "Projetando sobrecarga de tráfego nas OLTs, taxa de visita improdutiva e pressão em CAPEX/Receita...",
    ],
    policiesImpacted: [
      {
        id: "pol-400-1",
        code: "ANATEL-RQUAL-717",
        title: "Regulamento de Qualidade dos Serviços de Telecomunicações (RQUAL - Anatel)",
        origin: "regulatorio_externo",
        originLabel: "Norma Regulatória (Contexto Ativo)",
        severity: "conflito_alto",
        clauseAffected: "Meta de Velocidade Contratada vs. Entregue e Latência em Horário de Maior Movimento (HMM)",
        currentRuleText:
          "A operadora deve garantir os limiares mínimos de velocidade instantânea e média sobre a nova banda nominal de 400MB, sem degradação de latência e disponibilidade.",
        conflictExplanation:
          "Se o upgrade ocorrer para 75 mil clientes sem validação de portas PON/OLTs e sem troca de ONTs Wi-Fi 4 legadas, o indicador de velocidade percebida ficará abaixo da meta regulatória no horário de pico.",
        requiredAdjustment:
          "Fasear o upgrade em 3 ondas conforme folga de capacidade das OLTs regionais e comunicar requisitos técnicos de Wi-Fi 5/6.",
      },
      {
        id: "pol-400-2",
        code: "ANATEL-RGC-632",
        title: "Regulamento Geral de Direitos do Consumidor de Serviços de Telecomunicações (RGC)",
        origin: "regulatorio_externo",
        originLabel: "Norma Regulatória (Contexto Ativo)",
        severity: "revisao_necessaria",
        clauseAffected: "Alteração de Plano de Serviço e Vedação à Renovação Automática de Fidelidade sem Aceite",
        currentRuleText:
          "Benefícios concedidos unilateralmente pela prestadora não podem impor nova carência (fidelidade) nem reajuste tarifário automático sem consentimento expresso do consumidor.",
        conflictExplanation:
          "Caso o upgrade para 400MB seja aplicado de forma automática (push), não é permitido atrelar multa de fidelidade sem opt-in registrado.",
        requiredAdjustment:
          "Conceder o upgrade sem trava fidelizatória compulsória ou capturar aceite digital em 1-clique via App Meu Provedor.",
      },
    ],
    indicatorsImpacted: [
      {
        id: "ind-400-pos1",
        code: "IND-VOC-01",
        name: "Churn Rate (Voluntário) & NPS Relacional",
        area: "Atendimento & CX",
        direction: "positivo",
        currentValue: "1,62% a.m. | NPS 64",
        projectedValue: "1,24% a.m. | NPS 69",
        deltaLabel: "-0,38 p.p. em Churn (+5 pts NPS)",
        confidence: "Alta",
        rationale:
          "Melhora expressiva na percepção de valor (IQP e NPS Ookla/Speedtest), blindando a base contra ofertas de concorrentes.",
      },
      {
        id: "ind-400-pos2",
        code: "IND-BIZ-01",
        name: "Brand Preference, Market Share & Estabilização de ARPU",
        area: "Finanças & Estratégia",
        direction: "positivo",
        currentValue: "Share 28,4%",
        projectedValue: "Share 29,8%",
        deltaLabel: "+1,4 p.p. Market Share",
        confidence: "Alta",
        rationale:
          "Aumento da lealdade protege a receita recorrente (ARPU) e acelera a penetração em Homes Passed.",
      },
      {
        id: "ind-400-neg1",
        code: "IND-OPS-01",
        name: "Utilização de Capacidade de Rede & Visitas Improdutivas",
        area: "TI, Rede & Operações",
        direction: "negativo",
        currentValue: "72% cap. | 8% improdutiva",
        projectedValue: "89% cap. | 17,2% improdutiva",
        deltaLabel: "+17 p.p. ocupação rede (+9,2% visitas)",
        confidence: "Alta",
        rationale:
          "Sobrecarga nas portas PON em horário de pico e chamados de clientes cujo roteador Wi-Fi legado não entrega 400MB.",
      },
      {
        id: "ind-400-neg2",
        code: "IND-VOE-01",
        name: "Turnover e Absenteísmo (Campo & Call Center) + Pressão CAPEX",
        area: "Operações & Pessoas",
        direction: "negativo",
        currentValue: "Turnover 3,1%",
        projectedValue: "Turnover 5,2%",
        deltaLabel: "+2,1 p.p. Turnover (+3,8 p.p. CAPEX/Rec)",
        confidence: "Média",
        rationale:
          "Esgotamento das equipes de suporte e campo com o pico de agendamentos e necessidade de substituição de ONTs.",
      },
    ],
    areasAndCommittee: [
      {
        id: "rep-ti",
        areaId: "area-ti",
        areaName: "Engenharia de Redes, TI & Sistemas de Billing",
        shortArea: "TI, Rede & Billing",
        agentName: "Marcos Oliveira",
        agentRole: "Head de Engenharia de Redes & Sistemas de Billing",
        avatarColor: "#059669",
        avatarInitials: "MO",
        impactLevel: "Crítico",
        raciRole: "Responsável (R)",
        stance: "resistente",
        stanceSummary: "Alerta para saturação de OLTs em 22% dos clusters e limitação de roteadores Wi-Fi 4 na base legada.",
        affectedProcesses: ["NET-02.1 Service & Resource Capacity Management", "O2C-02.3 Customer Order Processing & Provisioning"],
        affectedSystems: ["OLTs / Backbone IP", "Servidor Radius / ACS TR-069"],
        mainConcerns: [
          "Subir 75 mil clientes para 400MB em virada única vai elevar a ocupação de 14 OLTs regionais acima de 90% no horário nobre, degradando latência e disponibilidade.",
          "18% dessa base possui ONT Wi-Fi 4 que fisicamente só entrega até 150MB no sem fio; o cliente vai achar que a rede está com defeito.",
        ],
        positivePointsSeen: [
          "Em 78% das OLTs já temos folga óptica para provisionar 400MB remotamente via TR-069 sem visita técnica.",
        ],
        negotiationConditions: [
          "Executar rollout faseado em 3 ondas de 30 dias validando a capacidade de OLT/Backbone antes da liberação.",
        ],
        openingStatement:
          "Pela Engenharia de Redes: se liberarmos 400MB para 75 mil clientes da noite para o dia, vamos saturar 14 clusters de OLT no horário de pico e degradar a navegação de toda a base. Precisamos fazer o rollout faseado em 3 ondas, começando apenas pelas regiões com folga de capacidade comprovada.",
      },
      {
        id: "rep-cx",
        areaId: "area-cx",
        areaName: "Diretoria de Atendimento, CX & Retenção",
        shortArea: "Atendimento & CX",
        agentName: "Camila Mendes",
        agentRole: "Diretora de Experiência do Cliente (CX)",
        avatarColor: "#ea580c",
        avatarInitials: "CM",
        impactLevel: "Crítico",
        raciRole: "Aprovador (A)",
        stance: "favoravel",
        stanceSummary: "Forte apoio pelo ganho em NPS Relacional e redução de Churn, mas pede régua educativa de Wi-Fi no App.",
        affectedProcesses: ["MKT-03.1 Marketing Campaign & Retention", "CX-01.4 Suporte Técnico N1"],
        affectedSystems: ["App Meu Provedor", "Genesys Call Center"],
        mainConcerns: [
          "Quando anunciarmos 400MB, milhares de clientes vão rodar Speedtest no celular antigo e ligar reclamando que bateu 180MB (Contact Rate +14%).",
        ],
        positivePointsSeen: [
          "Redução projetada de 0,38 p.p. no Churn Voluntário e salto no IQP e NPS Ookla/Speedtest.",
        ],
        negotiationConditions: [
          "Ativar jornada de ativação no App com diagnóstico automático de Wi-Fi e orientação sobre cobertura antes de abrir chamado técnico.",
        ],
        openingStatement:
          "Para CX e Retenção, o upgrade para 400MB é um divisor de águas para blindar nossa base e derrubar o Churn Voluntário! Meu único ponto de atenção é o Contact Rate: precisamos incluir no App um aviso educativo sobre alcance de Wi-Fi e diagnóstico automático para evitar enxurrada de chamadas no N1.",
      },
      {
        id: "rep-ops",
        areaId: "area-ops",
        areaName: "Diretoria de Operações de Campo & Manutenção",
        shortArea: "Operações & Campo",
        agentName: "Eng. Fernando Costa",
        agentRole: "Diretor de Operações de Campo",
        avatarColor: "#d97706",
        avatarInitials: "FC",
        impactLevel: "Crítico",
        raciRole: "Responsável (R)",
        stance: "resistente",
        stanceSummary: "Risco elevado de visitas improdutivas (+9,2%), quebra de agendamento e aumento de turnover das equipes.",
        affectedProcesses: ["OPS-01.2 Agendamento e Despacho de Campo", "OPS-03.1 Troca de Equipamentos CPE/ONT"],
        affectedSystems: ["WFM Gestão de Técnicos em Campo", "Controle de Estoque CPE"],
        mainConcerns: [
          "Se o Call Center agendar visita técnica para todo cliente cujo Wi-Fi 2.4GHz não bate 400MB, nossa taxa de visita improdutiva vai explodir e vamos descumprir agendamentos de reparo real.",
          "A pressão sobre os técnicos de campo eleva o esgotamento e o turnover da equipe (+2,1 p.p.).",
        ],
        positivePointsSeen: [
          "Se o upgrade for 100% remoto para quem já tem ONT Dual Band (5GHz), protegemos a frota de campo.",
        ],
        negotiationConditions: [
          "Bloquear abertura de visita técnica de velocidade sem teste remoto prévio na OLT e limitar trocas físicas de ONT à cota semanal da região.",
        ],
        openingStatement:
          "Na Operação de Campo, esse projeto pode virar um caos se não houver trava: não temos frota para trocar 15 mil roteadores de uma vez nem absorver visitas improdutivas de clientes testando velocidade no Wi-Fi 2.4GHz. Exijo trava de diagnóstico remoto obrigatório e limite semanal de ordens de serviço de upgrade.",
      },
      {
        id: "rep-fin",
        areaId: "area-fin",
        areaName: "Diretoria Financeira & Controladoria (FP&A)",
        shortArea: "Financeiro & FP&A",
        agentName: "Roberto Almeida",
        agentRole: "Diretor Financeiro & FP&A",
        avatarColor: "#0284c7",
        avatarInitials: "RA",
        impactLevel: "Alto",
        raciRole: "Aprovador (A)",
        stance: "ressalvas",
        stanceSummary: "Apoia a proteção da receita (ARPU via retenção), mas exige teto para o CAPEX de troca de equipamentos.",
        affectedProcesses: ["FIN-01.3 Planejamento de CAPEX e Retorno sobre Investimento"],
        affectedSystems: ["SAP S/4HANA FI/CO"],
        mainConcerns: [
          "A troca massiva de ONTs e ampliação de placas de OLT pode pressionar o indicador CAPEX/Receita em +3,8 p.p. no trimestre.",
        ],
        positivePointsSeen: [
          "A retenção dos clientes preserva o ARPU recorrente e sustenta o crescimento de receita YoY (+4,2%).",
        ],
        negotiationConditions: [
          "Priorizar na Onda 1 e 2 apenas clientes cujo equipamento atual já suporte 400MB (Zero CAPEX de CPE), condicionando trocas físicas a clientes de alto LTV.",
        ],
        openingStatement:
          "Pelo Financeiro, proteger o ARPU e reduzir o Churn tem VPL positivo, desde que não explodamos o CAPEX trocando roteador de toda a base. Nossa condição é iniciar o upgrade nos ~60 mil clientes que já possuem ONT compatível (custo zero de hardware) e escalonar o CAPEX de rede em 3 trimestres.",
      },
    ],
    affectedProcesses: [
      {
        id: "proc-400-1",
        code: "NET-02.1",
        name: "Service & Resource Capacity Management (Gestão de Capacidade de Rede)",
        valueChainPath: "Engenharia & Operações > Gerenciamento de Capacidade > OLTs e Backbone",
        ownerArea: "TI, Rede & Billing",
        businessRulesAffected: ["RN-NET-012 (Limiar de Ocupação PON 80%)", "RN-NET-019 (Perfil QoS 400MB)"],
        changeRequired: "Validar ocupação por porta PON antes da execução do script de upgrade e balancear tráfego.",
      },
      {
        id: "proc-400-2",
        code: "O2C-02.3",
        name: "Customer Order Processing & Mass Provisioning Management",
        valueChainPath: "Order-to-Cash > Provisionamento > Atualização de Perfil de Velocidade",
        ownerArea: "TI & Operações",
        businessRulesAffected: ["RN-PRV-008 (Elegibilidade Técnica CPE Dual Band)"],
        changeRequired: "Automatizar provisionamento em lotes noturnos sincronizados com a capacidade de atendimento.",
      },
    ],
    risks: [
      {
        id: "risk-400-1",
        category: "Técnico & Sistemas",
        title: "Degradação Massiva da Qualidade do Serviço (Velocidade, Latência e Disponibilidade)",
        severity: "Crítico",
        probability: "Alta",
        description:
          "Sobrecarga da capacidade da rede nas OLTs com ocupação >85%, impactando todos os clientes do cluster e elevando reclamações na Anatel.",
        mitigation: "Faseamento em 3 ondas por folga de capacidade de OLT e expansão prévia de uplinks críticos.",
      },
      {
        id: "risk-400-2",
        category: "Operacional & Atendimento",
        title: "Esgotamento e Aumento de Turnover nas Equipes de Campo e Atendimento",
        severity: "Alto",
        probability: "Alta",
        description:
          "Sobrecarga de chamados técnicos e visitas improdutivas (+9,2%) geradas por clientes com roteadores antigos.",
        mitigation: "Filtro digital de diagnóstico Wi-Fi no App e cota semanal de agendamentos de troca de CPE.",
      },
    ],
    benefits: [
      {
        id: "ben-400-1",
        category: "Financeiro & Caixa",
        title: "Fortalecimento da Competitividade, Ganho de Market Share e Redução do Churn Voluntário",
        impactEstimate: "-0,38 p.p. em Churn | +1,4 p.p. Market Share",
        horizon: "Curto Prazo (90 dias)",
        description:
          "Melhora direta na percepção de qualidade (IQP e Speedtest) e valor entregue ao cliente B2C.",
      },
      {
        id: "ben-400-2",
        category: "Financeiro & Caixa",
        title: "Estabilização da Base de Receita Recorrente (ARPU)",
        impactEstimate: "+4,2% Crescimento de Receita (YoY)",
        horizon: "Médio Prazo (6 meses)",
        description:
          "Aumenta a lealdade do cliente e protege a base contra ataques de preço de concorrentes regionais.",
      },
    ],
    recommendedConsensusProposal: {
      title: "Proposta de Consenso: Upgrade Faseado para 400MB em 3 Ondas com Trava de Capacidade OLT e Diagnóstico Digital",
      description:
        "Plano integrado entre Rede, CX, Operações de Campo e Finanças para capturar a queda de Churn sem degradar a rede e sem esgotar as equipes:",
      adjustedDirectiveText:
        "1) Executar o upgrade para 400MB em 3 ondas ao longo de 90 dias, iniciando pelas OLTs com ocupação < 75% e clientes com ONT Dual Band compatível (Zero CAPEX imediato). 2) Incluir diagnóstico automático de Wi-Fi no App Meu Provedor para evitar visitas técnicas improdutivas. 3) Limitar trocas físicas de roteadores à capacidade semanal das equipes de campo, priorizando clientes de alto risco de churn.",
      keyChanges: [
        "⚙️ TI & Rede: Faseamento por capacidade de OLT evita saturação de banda e protege latência/disponibilidade.",
        "🛠️ Operações de Campo: Trava de diagnóstico remoto reduz visitas improdutivas e protege o clima/turnover das equipes.",
        "🎧 Atendimento & CX: Comunicação transparente no App eleva NPS Relacional (+5 pts) e contém o Contact Rate.",
        "💼 Financeiro: Preserva o ARPU e dilui o CAPEX de substituição de ONTs legadas em 3 trimestres.",
      ],
    },
  },
};

// ============================================================================
// 4. GERADOR DE SOLICITAÇÕES DE NEGOCIAÇÃO DA MESA REDONDA POR CENÁRIO
// ============================================================================
export function buildNegotiationItemsForAnalysis(analysis: SimulationAnalysis): NegotiationRequestItem[] {
  if (analysis.id === "telecom-speed-400mb") {
    return [
      {
        id: "neg-400-ti",
        repId: "rep-ti",
        areaShortName: "TI, Rede & Billing",
        agentName: "Marcos Oliveira",
        avatarColor: "#059669",
        avatarInitials: "MO",
        title: "Rollout Faseado em 3 Ondas por Capacidade de OLT (< 75% ocupação)",
        description:
          "Liberar 400MB inicialmente nos clusters com folga óptica comprovada, evitando degradação de latência e disponibilidade no horário de pico.",
        clauseAddedToProposal:
          "Executar o upgrade para 400MB de forma faseada em 3 ondas de 30 dias, condicionado à validação de capacidade das OLTs (< 75% de ocupação).",
        riskReductionDelta: 20,
        status: "pending",
      },
      {
        id: "neg-400-ops",
        repId: "rep-ops",
        areaShortName: "Operações & Campo",
        agentName: "Eng. Fernando Costa",
        avatarColor: "#d97706",
        avatarInitials: "FC",
        title: "Trava de Diagnóstico Remoto + Cota Semanal de Troca de ONT em Campo",
        description:
          "Impedir abertura de visitas improdutivas por limitação de Wi-Fi 2.4GHz e limitar despachos físicos à capacidade da escala de campo, evitando turnover.",
        clauseAddedToProposal:
          "Exigir diagnóstico remoto antes de agendar visita técnica e escalonar trocas físicas de ONT conforme capacidade operacional de campo.",
        riskReductionDelta: 15,
        status: "pending",
      },
      {
        id: "neg-400-fin",
        repId: "rep-fin",
        areaShortName: "Financeiro & FP&A",
        agentName: "Roberto Almeida",
        avatarColor: "#0284c7",
        avatarInitials: "RA",
        title: "Priorização Zero-CAPEX (Clientes com ONT 5GHz já instalada na Onda 1)",
        description:
          "Capturar 80% do benefício de retenção imediatamente nos ~60 mil clientes cujo equipamento já suporta 400MB sem necessidade de compra de hardware.",
        clauseAddedToProposal:
          "Priorizar na Onda 1 os clientes com ONT Dual Band já compatível (Zero CAPEX de CPE) e direcionar substituições de hardware para perfis de alto LTV/risco de churn.",
        riskReductionDelta: 12,
        status: "pending",
      },
      {
        id: "neg-400-cx",
        repId: "rep-cx",
        areaShortName: "Atendimento & CX",
        agentName: "Camila Mendes",
        avatarColor: "#ea580c",
        avatarInitials: "CM",
        title: "Jornada Educativa no App + Autodiagnóstico Wi-Fi para conter Contact Rate",
        description:
          "Notificar o upgrade no App Meu Provedor explicando a diferença de desempenho Cabo vs. Wi-Fi para evitar +14% de chamadas no Suporte N1.",
        clauseAddedToProposal:
          "Disparar régua educativa no App com autodiagnóstico de Wi-Fi integrado no momento da ativação dos 400MB.",
        riskReductionDelta: 9,
        status: "pending",
      },
    ];
  }

  if (analysis.id === "telecom-throttling-d1") {
    return [
      {
        id: "neg-jur-1",
        repId: "rep-jur",
        areaShortName: "Jurídico & Regulatório",
        agentName: "Dra. Helena Vasconcelos",
        avatarColor: "#7c3aed",
        avatarInitials: "HV",
        title: "Substituir redução de banda em D+1 por Aviso Interativo (RGC Anatel Art. 91)",
        description:
          "Manter 100% da velocidade contratada nos primeiros 15 dias pós-notificação, exibindo em D+1 apenas um Portal de Aviso Interativo dispensável com QR Code Pix.",
        clauseAddedToProposal:
          "Em D+1, disparar Notificação Oficial e exibir Aviso Interativo com Pix Copia-e-Cola sem degradar a velocidade contratada antes do prazo legal de 15 dias da Resolução Anatel 632.",
        riskReductionDelta: 22,
        status: "pending",
      },
      {
        id: "neg-ti-1",
        repId: "rep-ti",
        areaShortName: "TI, Rede & Billing",
        agentName: "Marcos Oliveira",
        avatarColor: "#059669",
        avatarInitials: "MO",
        title: "Janela de 48h úteis para compensação de Boletos (CNAB) + Webhook Pix",
        description:
          "Aguardar D+3 útil para faturas emitidas em boleto bancário (evitando falso-positivo em quem pagou no vencimento) e usar Change of Authorization (CoA) sem derrubar sessões PPPoE.",
        clauseAddedToProposal:
          "Respeitar janela de 48h úteis (D+3 útil) para compensação bancária de boletos CNAB e liberar alertas em tempo real via Webhook Pix.",
        riskReductionDelta: 15,
        status: "pending",
      },
      {
        id: "neg-cx-1",
        repId: "rep-cx",
        areaShortName: "Atendimento & CX",
        agentName: "Camila Mendes",
        avatarColor: "#ea580c",
        avatarInitials: "CM",
        title: "Isenção de 5 dias para Clientes 'Bom Pagador' + Botão Desbloqueio 1-Clique",
        description:
          "Preservar clientes adimplentes nos últimos 12 meses de restrições nos primeiros 5 dias e incluir autoatendimento de Desbloqueio em Confiança no alerta digital.",
        clauseAddedToProposal:
          "Isentar clientes Adimplentes Históricos (Score Alto) nos primeiros 5 dias e disponibilizar botão de Desbloqueio em Confiança e Pix 1-Clique no App/WhatsApp.",
        riskReductionDelta: 14,
        status: "pending",
      },
      {
        id: "neg-fin-1",
        repId: "rep-fin",
        areaShortName: "Financeiro & Cobrança",
        agentName: "Roberto Almeida",
        avatarColor: "#0284c7",
        avatarInitials: "RA",
        title: "Régua Acelerada D+1 para Reincidentes Crônicos com Incentivo Pix",
        description:
          "Acionar já em D+1 clientes com atraso recorrente nos últimos 3 meses via WhatsApp e Push com chave Pix Copia-e-Cola para capturar 85% da antecipação de PMR.",
        clauseAddedToProposal:
          "Acionar em D+1 clientes de risco médio/alto e reincidentes com régua digital intensiva focada em conversão imediata para Pix.",
        riskReductionDelta: 5,
        status: "pending",
      },
    ];
  }

  if (analysis.id === "procurement-alcada-10k") {
    return [
      {
        id: "neg-ops-p2p",
        repId: "rep-ops",
        areaShortName: "Operações & Campo",
        agentName: "Eng. Fernando Costa",
        avatarColor: "#ea580c",
        avatarInitials: "FC",
        title: "Manter alçada de R$ 50k para Contratos Guarda-Chuva e Manutenção Crítica",
        description:
          "Evitar parada operacional mantendo aprovação gerencial até R$ 50 mil quando o pedido for de contrato já homologado por Suprimentos ou emergência de campo.",
        clauseAddedToProposal:
          "Manter alçada gerencial de até R$ 50.000 para pedidos vinculados a Contratos Guarda-Chuva já licitados e itens de manutenção crítica.",
        riskReductionDelta: 18,
        status: "pending",
      },
      {
        id: "neg-fpa-p2p",
        repId: "rep-fpa",
        areaShortName: "Controladoria & FP&A",
        agentName: "Ricardo Tavares",
        avatarColor: "#0284c7",
        avatarInitials: "RT",
        title: "Aplicar limite de R$ 10k apenas para Compras Spot ou Centros de Custo > 85% do Budget",
        description:
          "Focar o rigor executivo de dupla assinatura de Diretores exclusivamente nas compras fora de contrato (Spot) ou áreas com orçamento pressionado.",
        clauseAddedToProposal:
          "Aplicar o novo limite de R$ 10.000 exclusivamente para Compras Spot (avulsas sem contrato) ou Centros de Custo que ultrapassarem 85% do budget mensal.",
        riskReductionDelta: 12,
        status: "pending",
      },
      {
        id: "neg-comp-p2p",
        repId: "rep-comp",
        areaShortName: "Compliance & Riscos",
        agentName: "Dr. André Linhares",
        avatarColor: "#7c3aed",
        avatarInitials: "AL",
        title: "Trava automática Anti-Fracionamento (30 dias por CNPJ) no SAP GRC",
        description:
          "Bloquear divisão artificial de pedidos (Split PO) somando todas as requisições para o mesmo fornecedor em janela móvel de 30 dias.",
        clauseAddedToProposal:
          "Ativar trava sistêmica no SAP Ariba/GRC somando o acumulado de 30 dias por fornecedor para cálculo da alçada.",
        riskReductionDelta: 10,
        status: "pending",
      },
    ];
  }

  return analysis.areasAndCommittee.map((rep, idx) => ({
    id: `neg-custom-${rep.id}-${idx}`,
    repId: rep.id,
    areaShortName: rep.shortArea,
    agentName: rep.agentName,
    avatarColor: rep.avatarColor,
    avatarInitials: rep.avatarInitials,
    title: `Salvaguarda operacional de ${rep.shortArea}`,
    description: rep.negotiationConditions[0] || `Condição técnica solicitada por ${rep.shortArea} para mitigar riscos na área.`,
    clauseAddedToProposal: rep.negotiationConditions[0] || `Respeitar salvaguarda operacional de ${rep.shortArea}.`,
    riskReductionDelta: 10,
    status: "pending" as const,
  }));
}

// ============================================================================
// 5. GERADOR INTELIGENTE PARA NOVAS DIRETRIZES OU REFINAMENTOS
// ============================================================================
export function buildCustomSimulationFromPrompt(
  prompt: string,
  activeDocs: ActiveContextDocument[]
): SimulationAnalysis {
  const lower = prompt.toLowerCase();

  if (
    lower.includes("400mb") ||
    lower.includes("400 mb") ||
    (lower.includes("aument") && lower.includes("velocidade")) ||
    lower.includes("upgrade")
  ) {
    return SIMULATION_SCENARIOS["telecom-speed-400mb"];
  }

  if (
    lower.includes("velocidade") ||
    lower.includes("internet") ||
    (lower.includes("5 dias") && lower.includes("1 dia")) ||
    lower.includes("vencimento") ||
    lower.includes("inadimpl")
  ) {
    return SIMULATION_SCENARIOS["telecom-throttling-d1"];
  }

  if (
    lower.includes("alçada") ||
    lower.includes("alcada") ||
    lower.includes("compra") ||
    lower.includes("suprimento") ||
    lower.includes("50")
  ) {
    return SIMULATION_SCENARIOS["procurement-alcada-10k"];
  }

  const enabledRegDocs = activeDocs.filter((d) => d.enabled && d.category === "regulatorio");
  const enabledStratDocs = activeDocs.filter((d) => d.enabled && d.category === "estrategico");

  return {
    id: `custom-sim-${Date.now()}`,
    title: `Simulação de Mudança: "${prompt.slice(0, 72)}${prompt.length > 72 ? "..." : ""}"`,
    domainTag: "Análise Multidimensional de Diretriz",
    userDirectivePrompt: prompt,
    currentDirectiveAsIs:
      "Operação regida pelos parâmetros vigentes nos Normativos Internos (POL/PRO) e SLAs padrões mapeados na Cadeia de Valor.",
    proposedDirectiveToBe: prompt,
    overallRiskScore: 64,
    viabilityStatus: "Viável com Condicionantes",
    executiveSummary: `A análise cruzou a nova diretriz proposta com os processos da Cadeia de Valor, Regras de Negócio, Matriz RACI e ${activeDocs.filter((d) => d.enabled).length} documentos ativos na Base de Contexto. A mudança gera ganhos de eficiência e controle no curto prazo, mas exige revisão de 3 normativos internos, atenção às restrições regulatórias vigentes (${enabledRegDocs.map((d) => d.title.split("—")[0]).join(", ") || "Base Legal"}) e alinhamento prévio na Mesa Redonda entre Operações, Financeiro, CX e Jurídico para evitar impacto negativo nos indicadores de nível de serviço.`,
    reasoningSteps: [
      "Interpretando a mudança de diretriz proposta e identificando entidades de negócio...",
      "Cruzando com Processos Mapeados, Regras de Negócio (RNs) e Matriz RACI da plataforma...",
      `Verificando conformidade com ${enabledRegDocs.length} Normas Regulatórias e ${enabledStratDocs.length} documentos de Planejamento Estratégico...`,
      "Calculando balança de trade-offs nos Indicadores (KPIs positivos vs. negativos) e convocando 4 áreas para a Mesa Redonda...",
    ],
    policiesImpacted: [
      {
        id: "cust-pol-1",
        code: "POL-CORP-001",
        title: "Política Interna de Operações e Níveis de Serviço",
        origin: "interno_passivo",
        originLabel: "Normativo Interno (Contexto Passivo)",
        severity: "conflito_alto",
        clauseAffected: "Seção 4 — Parâmetros Operacionais e Critérios de Exceção",
        currentRuleText: "Define os prazos, critérios de elegibilidade e alçadas atuais do processo.",
        conflictExplanation: `A proposta ("${prompt.slice(0, 90)}...") altera diretamente a regra operacional vigente e exige atualização formal do normativo e dos fluxos BPMN associados.`,
        requiredAdjustment: "Publicar revisão da política com regra de transição e atualizar parâmetros de sistema.",
      },
      {
        id: "cust-pol-2",
        code: enabledRegDocs[0]?.id.toUpperCase().slice(0, 12) || "NORMA-REG-EXT",
        title: enabledRegDocs[0]?.title || "Marco Regulatório Setorial & Código de Defesa do Consumidor",
        origin: "regulatorio_externo",
        originLabel: "Norma Regulatória (Contexto Ativo)",
        severity: "revisao_necessaria",
        clauseAffected: "Diretrizes de Transparência, Prazos Legais e Comunicação Prévia",
        currentRuleText:
          enabledRegDocs[0]?.extractedRules[0] ||
          "Alterações que impactem direitos de clientes ou parceiros exigem notificação prévia e respeito aos prazos mínimos legais.",
        conflictExplanation:
          "A aplicação imediata sem janela de comunicação prévia pode gerar questionamentos em órgãos reguladores.",
        requiredAdjustment: "Incluir aviso prévio regulamentar e salvaguarda para casos em andamento.",
      },
    ],
    indicatorsImpacted: [
      {
        id: "cust-ind-1",
        code: "IND-EFE-01",
        name: "Eficiência Financeira / Redução de Perdas Operacionais",
        area: "Finanças & Performance",
        direction: "positivo",
        currentValue: "Baseline Atual",
        projectedValue: "+14% a +20%",
        deltaLabel: "+17% estimado em eficiência",
        confidence: "Alta",
        rationale: "A nova diretriz aperta o controle sobre o processo e acelera o resultado esperado pela área proponente.",
      },
      {
        id: "cust-ind-2",
        code: "IND-GOV-02",
        name: "Padronização e Conformidade de Execução",
        area: "Governança & Processos",
        direction: "positivo",
        currentValue: "82%",
        projectedValue: "94%",
        deltaLabel: "+12 p.p. em aderência",
        confidence: "Média",
        rationale: "Reduz subjetividade na ponta operacional com critério objetivo.",
      },
      {
        id: "cust-ind-3",
        code: "IND-CX-02",
        name: "Satisfação na Jornada / Volume de Contestações",
        area: "Atendimento & CX",
        direction: "negativo",
        currentValue: "Índice Base",
        projectedValue: "+18% em acionamentos",
        deltaLabel: "+18% em dúvidas/reclamações no 1º mês",
        confidence: "Alta",
        rationale: "Mudanças de diretriz geram atrito inicial na base e aumento de contatos de esclarecimento ou exceção.",
      },
      {
        id: "cust-ind-4",
        code: "IND-OPS-03",
        name: "Carga Operacional de Tratamento de Exceções",
        area: "Operações & TI",
        direction: "negativo",
        currentValue: "4,5h / dia",
        projectedValue: "7,2h / dia",
        deltaLabel: "+60% na fase de transição",
        confidence: "Média",
        rationale: "Casos limítrofes exigirão análise manual até que as regras sistêmicas estejam 100% automatizadas.",
      },
    ],
    areasAndCommittee: SIMULATION_SCENARIOS["telecom-throttling-d1"].areasAndCommittee.map((rep) => ({
      ...rep,
      stanceSummary: `Avaliando os impactos de "${prompt.slice(0, 50)}..." nos indicadores e processos de ${rep.shortArea}.`,
    })),
    affectedProcesses: [
      {
        id: "cust-proc-1",
        code: "PROC-CORE-01",
        name: "Processo Principal Impactado pela Diretriz",
        valueChainPath: "Cadeia de Valor Principal > Operações & Regras de Negócio",
        ownerArea: "Operações & Finanças",
        businessRulesAffected: ["RN-001 (Critério de Elegibilidade e Prazo)", "RN-004 (Fluxo de Exceção)"],
        changeRequired: "Atualizar árvore de decisão no BPMN, parametrizar regra no ERP/CRM e revisar POP da operação.",
      },
    ],
    risks: [
      {
        id: "cust-risk-1",
        category: "Operacional & Atendimento",
        title: "Sobrecarga nas Equipes de Atendimento e Operação durante a Virada de Chave",
        severity: "Alto",
        probability: "Alta",
        description: "A aplicação abrupta da diretriz sem régua de transição gera pico de chamados e dúvidas.",
        mitigation: "Fazer rollout faseado (piloto em 10% da base) e treinar equipes de N1 com script atualizado.",
      },
      {
        id: "cust-risk-2",
        category: "Regulatório & Legal",
        title: "Questionamento por Mudança de Critério sem Comunicação Prévia",
        severity: "Médio",
        probability: "Média",
        description: "Impacto em regras vigentes exige alinhamento com cláusulas contratuais e normas setoriais.",
        mitigation: "Validar parecer jurídico e comunicar partes afetadas com antecedência.",
      },
    ],
    benefits: [
      {
        id: "cust-ben-1",
        category: "Financeiro & Caixa",
        title: "Ganho Direto no Objetivo Central da Diretriz",
        impactEstimate: "+15% a +22% de melhoria no indicador-alvo",
        horizon: "Curto Prazo (90 dias)",
        description: "Captura rápida do benefício financeiro e operacional esperado pela mudança de regra.",
      },
    ],
    recommendedConsensusProposal: {
      title: "Proposta de Consenso do Comitê: Implementação Faseada com Trava de Proteção",
      description:
        "Acordo recomendado entre as áreas para capturar o benefício da diretriz mitigando os efeitos colaterais em CX, TI e Jurídico:",
      adjustedDirectiveText: `${prompt} — Aplicada com comunicação prévia automatizada, regra de exceção para perfis de baixo risco e piloto assistido de 30 dias antes do rollout total.`,
      keyChanges: [
        "⚖️ Jurídico: Garante conformidade regulatória com aviso prévio formal.",
        "🎧 CX & Atendimento: Cria fluxo digital de autoatendimento para absorver dúvidas sem onerar o Call Center.",
        "⚙️ TI & Operações: Define janela de parametrização sistêmica sem processamento manual.",
      ],
    },
  };
}

// ============================================================================
// 5B. GERADOR DE PERGUNTAS DE ESCLARECIMENTO DO AGENTE (4 A 5 PERGUNTAS)
// ============================================================================
export function generateClarifyingQuestionsForPrompt(
  prompt: string,
  scenarioKey?: string
): ClarifyingQuestion[] {
  const lower = prompt.toLowerCase();

  if (
    scenarioKey === "telecom-speed-400mb" ||
    lower.includes("400mb") ||
    lower.includes("400 mb") ||
    (lower.includes("aumentar") && lower.includes("velocidade")) ||
    lower.includes("upgrade")
  ) {
    return [
      {
        id: "q-scope-400",
        stepNumber: 1,
        category: "Escopo e Elegibilidade da Base",
        question: "Para qual recorte da base de clientes B2C o upgrade para 400MB será aplicado?",
        contextHint: "Identifiquei +75 mil assinantes com planos abaixo de 400MB na topologia atual de Fibra (FTTH).",
        options: [
          {
            id: "opt-all-b2c",
            label: "Toda a base B2C abaixo de 400MB (~75 mil clientes)",
            description: "Upgrade massivo automático para blindagem competitiva imediata.",
          },
          {
            id: "opt-churn-risk",
            label: "Apenas clientes com alto risco de Churn ou fidelidade vencendo (~22 mil)",
            description: "Ação cirúrgica de retenção preventiva com menor pressão na rede.",
          },
          {
            id: "opt-adimplentes",
            label: "Clientes adimplentes há mais de 12 meses sem troca de ONT (~48 mil)",
            description: "Foco em clientes de bom score cuja infraestrutura óptica já suporta 400MB remotamente.",
          },
        ],
        allowCustomWriteIn: true,
        customWriteInPlaceholder: "Ou especifique outro critério de elegibilidade da base...",
      },
      {
        id: "q-rollout-400",
        stepNumber: 2,
        category: "Estratégia de Rollout e Rede",
        question: "Qual será a cadência de implementação técnica nas OLTs e equipamentos de cliente (CPE/ONT)?",
        contextHint: "18% da base legada possui roteadores Wi-Fi 4 que limitam a velocidade percebida acima de 200MB.",
        options: [
          {
            id: "opt-phased-olt",
            label: "Rollout faseado em 3 ondas por capacidade de OLT (90 dias)",
            description: "Valida folga de backbone regional antes de liberar o aprovisionamento em massa.",
          },
          {
            id: "opt-bigbang",
            label: "Virada única imediata via script no servidor Radius/BRAS (D+0)",
            description: "Impacto comercial imediato, mas eleva risco de saturação e visitas técnicas.",
          },
          {
            id: "opt-optin-app",
            label: "Ativação sob demanda via App (Opt-in gratuito pelo cliente)",
            description: "Dilui a curva de ativação organicamente e gera engajamento digital no App.",
          },
        ],
        allowCustomWriteIn: true,
        customWriteInPlaceholder: "Ou descreva como deseja fasear a entrega técnica...",
      },
      {
        id: "q-pricing-400",
        stepNumber: 3,
        category: "Política Comercial e ARPU",
        question: "Como essa mudança será posicionada em relação à mensalidade (ARPU) e fidelização?",
        contextHint: "Avaliando impacto nas métricas de Receita Recorrente, Brand Preference e RGC da Anatel.",
        options: [
          {
            id: "opt-free-loyalty",
            label: "Upgrade 100% gratuito sem renovação compulsória de fidelidade",
            description: "Maximiza NPS e evita atrito regulatório com a Anatel (RGC).",
          },
          {
            id: "opt-free-renew",
            label: "Upgrade gratuito mediante aceite de renovação de fidelidade por 12 meses",
            description: "Trava o Churn contratualmente, mas exige opt-in formal do assinante.",
          },
          {
            id: "opt-more-for-more",
            label: "Estratégia 'More for More' (+R$ 9,90/mês no próximo ciclo de reajuste)",
            description: "Compensa o CAPEX de rede com expansão de ARPU.",
          },
        ],
        allowCustomWriteIn: true,
        customWriteInPlaceholder: "Ou defina outra condição comercial/preço...",
      },
      {
        id: "q-ops-400",
        stepNumber: 4,
        category: "Capacidade Operacional & Atendimento",
        question: "Qual salvaguarda operacional devemos adotar para o Call Center e Equipes de Campo?",
        contextHint: "Aumentos massivos de velocidade costumam gerar chamados de clientes cuja rede Wi-Fi interna não atinge 400MB no Speedtest.",
        options: [
          {
            id: "opt-proactive-msg",
            label: "Comunicação educativa sobre Wi-Fi + Diagnóstico automático no App",
            description: "Explica diferença entre velocidade no cabo vs. Wi-Fi e filtra visitas improdutivas.",
          },
          {
            id: "opt-cpe-swap",
            label: "Troca preventiva de roteador (Mesh/Wi-Fi 6) para clientes VIP",
            description: "Garante qualidade percebida máxima, porém eleva CAPEX logístico.",
          },
          {
            id: "opt-standard-support",
            label: "Absorver demanda com a escala atual de atendimento N1 e campo",
            description: "Sem custo prévio de preparação, assumindo risco de fila no Call Center.",
          },
        ],
        allowCustomWriteIn: true,
        customWriteInPlaceholder: "Ou especifique a regra de suporte e atendimento...",
      },
    ];
  }

  if (
    scenarioKey === "telecom-throttling-d1" ||
    (lower.includes("5 dias") && lower.includes("1 dia")) ||
    lower.includes("vencimento") ||
    lower.includes("inadimpl") ||
    (lower.includes("reduzir") && lower.includes("velocidade"))
  ) {
    return [
      {
        id: "q-d1-scope",
        stepNumber: 1,
        category: "Segmentação de Clientes & Risco",
        question: "A redução de velocidade em D+1 deve ser aplicada para toda a base ou haverá filtro por histórico?",
        contextHint: "Na base atual, 62% dos atrasos em D+1 são de clientes adimplentes recorrentes que esqueceram o vencimento.",
        options: [
          {
            id: "opt-d1-all",
            label: "Aplicar para 100% dos clientes em atraso já em D+1 (Regra Linear)",
            description: "Maximiza pressão de caixa imediata, mas afeta clientes fiéis de alto NPS.",
          },
          {
            id: "opt-d1-recurrent",
            label: "Aplicar em D+1 apenas para reincidentes; manter D+5 para 'Bons Pagadores'",
            description: "Protege o cliente adimplente histórico e foca nos atrasos crônicos.",
          },
          {
            id: "opt-d1-score",
            label: "Escalonar por Score de Crédito (Alto Score D+5 / Médio D+3 / Baixo D+1)",
            description: "Abordagem calibrada por risco financeiro e propensão a Churn.",
          },
        ],
        allowCustomWriteIn: true,
        customWriteInPlaceholder: "Ou digite o critério de elegibilidade desejado...",
      },
      {
        id: "q-d1-payment",
        stepNumber: 2,
        category: "Janela de Compensação Bancária",
        question: "Como tratar clientes cuja fatura foi emitida em Boleto Bancário (compensação CNAB em até 48h)?",
        contextHint: "38% dos clientes pagam via boleto no vencimento, mas o banco só confirma a baixa no ERP entre D+1 à tarde e D+2.",
        options: [
          {
            id: "opt-d1-ignore-cnab",
            label: "Executar em D+1 independente do meio de pagamento",
            description: "Gera risco elevado de reduzir a internet de quem já pagou o boleto na véspera.",
          },
          {
            id: "opt-d1-wait-boleto",
            label: "Atuar em D+1 apenas para Pix/Cartão vencidos e aguardar D+3 útil para Boletos",
            description: "Elimina falsos-positivos de compensação bancária CNAB.",
          },
          {
            id: "opt-d1-trust-unlock",
            label: "Executar em D+1 mas liberar 'Desbloqueio em Confiança' automático no App/URA",
            description: "Permite que o cliente informe o pagamento e restabeleça a banda em 1 clique.",
          },
        ],
        allowCustomWriteIn: true,
        customWriteInPlaceholder: "Ou descreva a regra para boletos em compensação...",
      },
      {
        id: "q-d1-anatel",
        stepNumber: 3,
        category: "Conformidade Regulatória (Anatel RGC)",
        question: "Qual mecanismo técnico você pretende acionar em D+1 diante da Resolução Anatel nº 632?",
        contextHint: "O Art. 90/91 da Anatel exige notificação prévia e prazo de 15 dias antes de aplicar suspensão parcial (throttling).",
        options: [
          {
            id: "opt-d1-hard-throttle",
            label: "Redução direta da banda contratada (Throttling no Radius) em D+1",
            description: "Testar o impacto bruto da medida mesmo com alerta de bloqueio regulatório.",
          },
          {
            id: "opt-d1-wallgarden",
            label: "Aviso Interativo no navegador + WhatsApp com QR Code Pix (sem cortar banda)",
            description: "Converte o pagamento em D+1 sem infringir o prazo legal de 15 dias da Anatel.",
          },
          {
            id: "opt-d1-hybrid",
            label: "Notificação formal em D+1 + restrição cautelar após prazo regulamentar",
            description: "Rito 100% aderente ao RGC com régua digital acelerada.",
          },
        ],
        allowCustomWriteIn: true,
        customWriteInPlaceholder: "Ou especifique o mecanismo técnico/regulatório...",
      },
      {
        id: "q-d1-goal",
        stepNumber: 4,
        category: "Prioridade Executiva do Trade-off",
        question: "Qual é o objetivo prioritário da Diretoria ao avaliar esta simulação?",
        contextHint: "Isso calibrará os pesos da análise entre Caixa (Finanças), Retenção (CX) e Risco Legal (Jurídico).",
        options: [
          {
            id: "opt-d1-cash",
            label: "Maximizar geração de caixa imediata e reduzir o PMR em pelo menos 2,5 dias",
            description: "Prioridade financeira de curto prazo no trimestre.",
          },
          {
            id: "opt-d1-pix",
            label: "Acelerar migração estrutural do Boleto para Pix e Débito Automático",
            description: "Mudança de comportamento de pagamento da base.",
          },
          {
            id: "opt-d1-balance",
            label: "Reduzir inadimplência sem permitir queda superior a 2 pts no NPS",
            description: "Equilíbrio entre eficiência de cobrança e proteção da base.",
          },
        ],
        allowCustomWriteIn: true,
        customWriteInPlaceholder: "Ou informe a meta principal desta simulação...",
      },
    ];
  }

  if (
    scenarioKey === "procurement-alcada-10k" ||
    lower.includes("alçada") ||
    lower.includes("alcada") ||
    lower.includes("compra") ||
    lower.includes("suprimento") ||
    lower.includes("50")
  ) {
    return [
      {
        id: "q-p2p-1",
        stepNumber: 1,
        category: "Escopo das Categorias de Compra",
        question: "O novo teto de R$ 10 mil com dupla assinatura de Diretor valerá para quais tipos de requisição?",
        contextHint: "No histórico do SAP Ariba, 68% dos pedidos entre R$ 10k e R$ 50k são chamadas de contratos já licitados.",
        options: [
          {
            id: "opt-p2p-all",
            label: "Todas as compras operacionais (Spot e Contratos Homologados)",
            description: "Controle máximo, mas adiciona +410 aprovações/mês na fila da Diretoria.",
          },
          {
            id: "opt-p2p-spot",
            label: "Apenas para Compras Spot (fora de catálogo/contrato); manter R$ 50k para contratos ativos",
            description: "Foca o rigor onde há risco de desvio de preço sem travar a operação recorrente.",
          },
          {
            id: "opt-p2p-budget",
            label: "Apenas para Centros de Custo que já consumiram mais de 85% do budget mensal",
            description: "Gatilho dinâmico baseado na saúde orçamentária da área.",
          },
        ],
        allowCustomWriteIn: true,
        customWriteInPlaceholder: "Ou defina a regra de abrangência das compras...",
      },
      {
        id: "q-p2p-2",
        stepNumber: 2,
        category: "Exceções de Continuidade Operacional",
        question: "Como devem ser tratadas as compras emergenciais de manutenção crítica e parada de operação?",
        contextHint: "A Diretoria de Operações aponta que aguardar 2 Diretores pode elevar o Lead Time de 4 para 11 dias.",
        options: [
          {
            id: "opt-p2p-fast",
            label: "Criar workflow Fast-Track com aprovação em até 4h para manutenções críticas",
            description: "Protege o SLA operacional mantendo visibilidade executiva.",
          },
          {
            id: "opt-p2p-no-exc",
            label: "Sem exceção: toda compra acima de R$ 10k aguarda o fluxo normal de 2 Diretores",
            description: "Rigor absoluto de governança, com alto risco de atraso em campo.",
          },
          {
            id: "opt-p2p-post",
            label: "Permitir liberação gerencial de emergência com ratificação da Diretoria em 24h",
            description: "Não para a operação e audita o uso da exceção no dia seguinte.",
          },
        ],
        allowCustomWriteIn: true,
        customWriteInPlaceholder: "Ou especifique a regra para emergências...",
      },
      {
        id: "q-p2p-3",
        stepNumber: 3,
        category: "Prevenção a Fracionamento (Compliance)",
        question: "Deseja incluir alguma trava sistêmica contra o fracionamento de pedidos (Split PO)?",
        contextHint: "Reduções bruscas de alçada historicamente aumentam em 4x a divisão de compras em notas menores de R$ 9,9 mil.",
        options: [
          {
            id: "opt-p2p-grc",
            label: "Ativar trava no SAP GRC somando pedidos do mesmo fornecedor em janela de 30 dias",
            description: "Bloqueia automaticamente o fracionamento artificial de requisições.",
          },
          {
            id: "opt-p2p-audit",
            label: "Monitorar via auditoria amostral mensal pós-faturamento",
            description: "Sem bloqueio preventivo no sistema, menor custo de parametrização TI.",
          },
        ],
        allowCustomWriteIn: true,
        customWriteInPlaceholder: "Ou descreva o controle de compliance desejado...",
      },
      {
        id: "q-p2p-4",
        stepNumber: 4,
        category: "Meta Executiva Principal",
        question: "Qual indicador de sucesso é mais importante para validar esta mudança?",
        contextHint: "Ajuda o agente a calibrar as projeções de impacto e a pauta da Mesa Redonda.",
        options: [
          {
            id: "opt-p2p-saving",
            label: "Redução imediata de OPEX discricionário em pelo menos R$ 400 mil/mês",
            description: "Foco em captura rápida de economia orçamentária.",
          },
          {
            id: "opt-p2p-maverick",
            label: "Reduzir o índice de compras fora de contrato (Maverick Spend) abaixo de 8%",
            description: "Foco em disciplina de suprimentos e uso de catálogos.",
          },
          {
            id: "opt-p2p-sox",
            label: "Fortalecer conformidade de auditoria externa e controles SOX",
            description: "Foco em governança corporativa e segregação de funções.",
          },
        ],
        allowCustomWriteIn: true,
        customWriteInPlaceholder: "Ou informe o objetivo central...",
      },
    ];
  }

  // Perguntas adaptativas inteligentes para qualquer outra diretriz digitada pelo usuário
  const cleanSnippet = prompt.length > 70 ? `${prompt.slice(0, 67)}...` : prompt;
  
  // Detecta se o prompt fala de clientes/comercial, operações/sistemas ou financeiro/orçamento
  const isCustomerTheme =
    lower.includes("cliente") ||
    lower.includes("venda") ||
    lower.includes("comercial") ||
    lower.includes("nps") ||
    lower.includes("churn") ||
    lower.includes("cancelamento") ||
    lower.includes("fidelidade") ||
    lower.includes("atendimento") ||
    lower.includes("preço") ||
    lower.includes("preco");

  const isFinancialTheme =
    lower.includes("custo") ||
    lower.includes("gasto") ||
    lower.includes("orçamento") ||
    lower.includes("orcamento") ||
    lower.includes("financeiro") ||
    lower.includes("caixa") ||
    lower.includes("faturamento") ||
    lower.includes("margem");

  return [
    {
      id: "q-gen-1",
      stepNumber: 1,
      category: "Escopo e Abrangência da Proposta",
      question: `Para qual público ou área operacional você planeja aplicar "${cleanSnippet}" inicialmente?`,
      contextHint: `O Agente identificou esta demanda como uma diretriz de impacto transversal. Precisamos definir a primeira frente de implantação.`,
      options: isCustomerTheme
        ? [
            {
              id: "opt-gen-all",
              label: "100% da base ativa de clientes / todas as regiões simultaneamente",
              description: "Rollout nacional unificado para maximizar tração imediata.",
            },
            {
              id: "opt-gen-phased",
              label: "Faseamento piloto com clientes selecionados (30 a 60 dias de validação)",
              description: "Permite calibrar satisfação e capacidade operacional antes da liberação geral.",
            },
            {
              id: "opt-gen-segment",
              label: "Apenas segmento prioritário (ex: clientes VIP, contratos novos ou alto risco de saída)",
              description: "Ação cirúrgica de validação com menor exposição de risco institucional.",
            },
          ]
        : isFinancialTheme
          ? [
              {
                id: "opt-gen-fin-all",
                label: "Aplicação imediata em todos os centros de custo e contratos corporativos",
                description: "Captura máxima de economia no curto prazo.",
              },
              {
                id: "opt-gen-fin-thresh",
                label: "Aplicação escalonada para despesas acima de um teto de relevância",
                description: "Foca o controle nos maiores volumes sem engessar transações menores.",
              },
              {
                id: "opt-gen-fin-pilot",
                label: "Projeto piloto nas diretorias mais demandantes antes do desdobramento",
                description: "Avalia a adaptação dos processos de compras e finanças.",
              },
            ]
          : [
              {
                id: "opt-gen-all",
                label: "Aplicação integral e imediata em 100% dos processos e operações elegíveis",
                description: "Captura máxima do benefício, concentrando riscos operacionais no início.",
              },
              {
                id: "opt-gen-phased",
                label: "Implementação faseada em 3 ondas (Piloto controlado de 30 dias)",
                description: "Permite validar indicadores e ajustar processos antes da escala corporativa.",
              },
              {
                id: "opt-gen-segment",
                label: "Aplicação segmentada por criticidade ou perfil de unidade",
                description: "Isenta casos de missão crítica na primeira fase de adaptação.",
              },
            ],
      allowCustomWriteIn: true,
      customWriteInPlaceholder: "Ou digite sua própria regra de escopo ou público...",
    },
    {
      id: "q-gen-2",
      stepNumber: 2,
      category: "Capacidade Operacional & Sistemas",
      question: "Qual será o mecanismo de execução e o nível de automação sistêmica?",
      contextHint: "O Agente cruzou a demanda com os sistemas legados e arquitetura de processos corporativos.",
      options: [
        {
          id: "opt-gen-auto",
          label: "100% Automatizado via parametrização nos sistemas atuais (ERP/CRM/Workflows)",
          description: "Exige sprint técnica prévia de TI, mas elimina retrabalho manual das equipes.",
        },
        {
          id: "opt-gen-hybrid",
          label: "Modelo Híbrido: Regras automáticas no sistema com tratamento manual de exceções",
          description: "Entra em produção rapidamente, com impacto controlado no tempo de atendimento (TMA).",
        },
        {
          id: "opt-gen-manual",
          label: "Operação imediata via revisão de Procedimento Operacional Padrão (POP)",
          description: "Sem dependência de desenvolvimento de TI no D+0, assumindo maior esforço humano.",
        },
      ],
      allowCustomWriteIn: true,
      customWriteInPlaceholder: "Ou descreva como seus sistemas e equipes irão operar...",
    },
    {
      id: "q-gen-3",
      stepNumber: 3,
      category: "Governança, Regulação & Transição",
      question: "Qual salvaguarda de governança e comunicação você deseja adotar?",
      contextHint: "O Agente verificou normas internas e exigências regulatórias no Contexto da empresa.",
      options: [
        {
          id: "opt-gen-comm30",
          label: "Aviso prévio formal (30 dias) + revisão de contratos e manuais de compliance",
          description: "Mitiga riscos legais, garante segurança jurídica e treina os times de ponta.",
        },
        {
          id: "opt-gen-comm-fast",
          label: "Comunicação digital ágil direta nos canais com suporte proativo",
          description: "Acelera a captura do objetivo estratégico com alinhamento contínuo com Jurídico e CX.",
        },
        {
          id: "opt-gen-comm-optin",
          label: "Adesão voluntária / Opt-in com incentivos ou benefícios exclusivos",
          description: "Transforma a mudança em oportunidade de valor sem atritos compulsórios.",
        },
      ],
      allowCustomWriteIn: true,
      customWriteInPlaceholder: "Ou defina a salvaguarda de governança / conformidade...",
    },
    {
      id: "q-gen-4",
      stepNumber: 4,
      category: "Prioridade Executiva do Trade-off",
      question: "Qual dimensão estratégica deve guiar o parecer dos diretores no Comitê?",
      contextHint: "Isso define os pesos que os agentes das diretorias usarão na Mesa Redonda de Negociação.",
      options: [
        {
          id: "opt-gen-fin",
          label: "Eficiência Financeira, Margem de Lucro e Retorno Econômico Rápido",
          description: "Prioriza resultado financeiro e racionalização de custos.",
        },
        {
          id: "opt-gen-cx",
          label: "Experiência do Cliente (NPS), Reputação da Marca e Retenção",
          description: "Prioriza satisfação, qualidade percebida e proteção contra churn.",
        },
        {
          id: "opt-gen-gov",
          label: "Conformidade Regulatória, Continuidade Operacional e Mitigação de Riscos",
          description: "Prioriza governança corporativa estrita e estabilidade dos serviços.",
        },
      ],
      allowCustomWriteIn: true,
      customWriteInPlaceholder: "Ou informe qual é a meta número 1 desta simulação...",
    },
  ];
}

// ============================================================================
// 5C. GERADOR DO RESUMO EXECUTIVO DO IMPACTO (ESTILO REFERÊNCIA EXECUTIVA)
// ============================================================================
export function getImpactExecutiveSummaryForAnalysis(
  analysis: SimulationAnalysis,
  versionNumber = 1
): ImpactExecutiveSummary {
  if (analysis.impactExecutiveSummary && versionNumber === 1) {
    return analysis.impactExecutiveSummary;
  }

  const isCalibrated = versionNumber > 1 || analysis.overallRiskScore <= 45;

  if (analysis.id === "telecom-speed-400mb") {
    return {
      headline: isCalibrated
        ? `A iniciativa de aumentar a velocidade para 400MB (Versão v${versionNumber} calibrada em ondas) captura forte ganho competitivo e redução de churn, com riscos de rede e atendimento devidamente mitigados.`
        : "A iniciativa de aumentar a velocidade para 400MB é estrategicamente positiva para reduzir churn e fortalecer a competitividade, mas acarreta riscos operacionais e financeiros que podem degradar o serviço se não forem mitigados com um plano de execução faseado.",
      subtitle: "Aumento de velocidade para 400MB para a base de clientes B2C",
      effect: isCalibrated ? "Positivo" : "Incerto",
      size: "Grande",
      sizeDots: 3,
      confidence: "Alta",
      confidenceBars: 3,
      escalation: "VP",
      narrativeParagraph: isCalibrated
        ? `Com o faseamento acordado na Mesa Redonda (v${versionNumber}), o upgrade para 400MB em mais de 75 mil clientes preserva a capacidade das OLTs regionais, inclui diagnóstico proativo de Wi-Fi no App e evita o pico de chamadas no Call Center. O risco sistêmico caiu para ${analysis.overallRiskScore}/100, mantendo a captura integral da redução do churn voluntário e elevação do NPS.`
        : "Aumentar a velocidade para 400MB para mais de 75 mil clientes visa diretamente reduzir o churn e melhorar a satisfação, fortalecendo a marca. Contudo, essa ação agressiva impõe uma pressão extrema sobre a capacidade da rede, os processos de provisionamento em massa e as equipes de campo e atendimento. Os principais riscos são a degradação da qualidade do serviço para toda a base, o esgotamento dos colaboradores e a necessidade de um CAPEX significativo em curto prazo. O sucesso da iniciativa depende de uma execução impecável, começando com uma validação rigorosa da capacidade da infraestrutura e uma implementação gradual.",
      keyBenefitsSummary: [
        "Fortalecimento da competitividade e da marca, com potencial para ganho de market share e redução do churn voluntário através da melhora na percepção de qualidade e valor pelo cliente.",
        "Estabilização da base de receita recorrente (ARPU) ao aumentar a lealdade do cliente, protegendo a base contra ofertas agressivas de provedores regionais.",
        "Elevação projetada no IQP (Índice de Qualidade Percebida) e no NPS Relacional e Ookla/Speedtest nos clientes com CPE compatível.",
      ],
      keyRisksSummary: [
        "Risco de degradação massiva da qualidade do serviço (velocidade, latência, disponibilidade) por sobrecarga da capacidade da rede, impactando todos os clientes e aumentando as reclamações.",
        "Esgotamento e aumento de turnover nas equipes de campo e atendimento devido à sobrecarga de chamados técnicos e visitas improdutivas por limitação de Wi-Fi legado.",
        "Pressão relevante sobre CAPEX/Receita no curto prazo caso seja necessária substituição acelerada de ONTs/Roteadores e ampliação de portas de backbone.",
      ],
    };
  }

  if (analysis.id === "telecom-throttling-d1") {
    return {
      headline: isCalibrated
        ? `A régua inteligente em D+1 (Versão v${versionNumber} pós-Mesa Redonda) antecipa R$ 12,4M em caixa com conformidade integral à Resolução Anatel 632 e proteção aos clientes adimplentes e boletos em compensação.`
        : "A redução da tolerância de atraso de D+5 para D+1 é altamente eficaz para antecipar R$ 14,5M em caixa e acelerar o Pix, mas gera bloqueio regulatório na Anatel e forte atrito operacional se aplicada linearmente sem respeitar a compensação bancária.",
      subtitle: analysis.title,
      effect: isCalibrated ? "Positivo" : "Incerto",
      size: "Grande",
      sizeDots: 3,
      confidence: "Alta",
      confidenceBars: 3,
      escalation: "VP / Diretoria Executiva",
      narrativeParagraph: isCalibrated
        ? `Após deliberação na Mesa Redonda (v${versionNumber}), a substituição do corte de banda em D+1 por Aviso Digital Interativo com Pix Copia-e-Cola, somada à janela de 48h úteis para boletos CNAB e isenção de 5 dias para Bons Pagadores, reduziu o risco sistêmico de 82 para ${analysis.overallRiskScore}/100. A empresa captura 85% do benefício de caixa sem autuação regulatória e sem sobrecarregar o Call Center.`
        : "Antecipar a ação de cobrança de D+5 para D+1 ataca mais de R$ 40 milhões que flutuam nos primeiros dias após o vencimento, reduzindo o PMR em 2,8 dias. Entretanto, a aplicação automática de redução de velocidade em 24h esbarra no Art. 90/91 da Resolução Anatel nº 632 (que exige notificação prévia + 15 dias) e atinge injustamente 38% dos clientes que pagaram boleto no vencimento (cuja baixa bancária CNAB ocorre em D+1/D+2), projetando +13.200 ligações/mês no suporte técnico e queda de 8 pontos no NPS.",
      keyBenefitsSummary: [
        "Antecipação imediata de R$ 14,5 milhões em liquidez mensal de caixa, reduzindo o Prazo Médio de Recebimento (PMR) de 34,2 para 31,4 dias.",
        "Redução de 29% na inadimplência de curto prazo (D+1 a D+10), eliminando o hábito de atraso por esquecimento nos primeiros 5 dias.",
        "Aceleração de +12 p.p. na migração estrutural do Boleto Bancário para meios instantâneos (Pix e Débito Automático), economizando tarifas bancárias.",
      ],
      keyRisksSummary: [
        "Risco de infração direta à Resolução Anatel nº 632/2014 (Suspensão Parcial prematura sem decurso de 15 dias pós-notificação), sujeitando a empresa a PADO e multa.",
        "Sobrecarga severa no Call Center (+31% / +13.200 chamadas/mês) e falso-positivo em clientes que pagaram via boleto bancário ainda em janela de compensação CNAB.",
        "Queda projetada de 8 pontos no NPS Transacional e aumento de +0,33 p.p. no Churn Voluntário (~2.100 cancelamentos/mês) por atrito com bons pagadores.",
      ],
    };
  }

  if (analysis.id === "procurement-alcada-10k") {
    return {
      headline: isCalibrated
        ? `A política de Alçada Dual (Versão v${versionNumber}: R$ 10k para Spot e R$ 50k para Contratos Homologados) captura R$ 5M/ano em economia de OPEX sem atrasar a manutenção crítica de campo.`
        : "Reduzir a alçada de aprovação de compras de R$ 50 mil para R$ 10 mil fortalece a governança de OPEX e reduz gastos avulsos, mas impõe risco de paralisação operacional e aumento de 173% no Lead Time de compras se aplicada a contratos já licitados.",
      subtitle: analysis.title,
      effect: isCalibrated ? "Positivo" : "Incerto",
      size: "Médio",
      sizeDots: 2,
      confidence: "Alta",
      confidenceBars: 3,
      escalation: "Diretoria / CFO",
      narrativeParagraph: isCalibrated
        ? `Na versão calibrada (v${versionNumber}), o limite rigoroso de R$ 10 mil com dupla assinatura de Diretor é focado exclusivamente em Compras Spot (fora de catálogo) e centros de custo estourados, preservando a alçada gerencial de R$ 50 mil para Contratos Guarda-Chuva e emergências operacionais, além de ativar trava anti-fracionamento no SAP GRC.`
        : "A redução linear da alçada gerencial para R$ 10 mil visa conter desvios orçamentários em despesas discricionárias, projetando economia de R$ 420 mil/mês. Contudo, a medida desloca +410 requisições mensais para a fila de Diretores, elevando o ciclo de aprovação (P2P) de 4,2 para 11,5 dias. Sem distinção entre compras avulsas (Spot) e pedidos de contratos já homologados, há risco crítico de atraso em manutenções de campo e incentivo ao fracionamento artificial de pedidos (Split PO).",
      keyBenefitsSummary: [
        "Economia direta estimada em R$ 420 mil/mês (R$ 5,04M/ano) com a inibição de gastos avulsos discricionários entre R$ 10 mil e R$ 50 mil.",
        "Redução de 6,5 p.p. no índice de compras fora de contrato (Maverick Spend), forçando maior adesão aos catálogos negociados por Suprimentos.",
      ],
      keyRisksSummary: [
        "Aumento do Lead Time médio de compras de 4,2 para 11,5 dias (+7,3 dias), comprometendo o SLA de reposição e manutenção corretiva de operações.",
        "Risco elevado de fracionamento artificial de pedidos (emissão de múltiplas requisições abaixo de R$ 10 mil) caso não haja trava acumulada no SAP GRC.",
      ],
    };
  }

  return {
    headline: isCalibrated
      ? `A diretriz calibrada na Versão v${versionNumber} equilibra a captura de eficiência operacional e financeira com salvaguardas regulatórias e de atendimento acordadas entre as áreas.`
      : `A iniciativa "${analysis.title}" apresenta potencial relevante de geração de valor e eficiência, mas acarreta riscos operacionais, sistêmicos e regulatórios que exigem mitigação faseada antes da entrada em vigor.`,
    subtitle: analysis.userDirectivePrompt.slice(0, 110),
    effect: isCalibrated ? "Positivo" : "Incerto",
    size: "Grande",
    sizeDots: 3,
    confidence: "Alta",
    confidenceBars: 3,
    escalation: "VP / Diretoria",
    narrativeParagraph: analysis.executiveSummary,
    keyBenefitsSummary: analysis.benefits.map((b) => `${b.title}: ${b.description} (${b.impactEstimate}).`),
    keyRisksSummary: analysis.risks.map((r) => `${r.title}: ${r.description} (Severidade ${r.severity}).`),
  };
}

// ============================================================================
// 5D. GERADOR DO MAPA DE RELAÇÕES SISTÊMICAS (ESTILO GRAFO DE IMPACTOS)
// ============================================================================
export function getRelationshipMapForAnalysis(analysis: SimulationAnalysis): RelationshipMapData {
  if (analysis.relationshipMap) {
    return analysis.relationshipMap;
  }

  if (analysis.id === "telecom-speed-400mb") {
    return {
      centralNodeLabel: "Aumento de velocidade para 400MB para a base de clientes B2C",
      topBranches: [
        {
          id: "br-reg",
          title: "Regulação",
          position: "top",
          colorTheme: "blue",
          branchDirection: "incerto",
          branchConfidence: "Forte",
          items: [
            { id: "r1", label: "Regulamento de Qualidade dos Serviços de Telecomunicações (RQUAL)", code: "ANATEL-717", direction: "negativo", confidence: "Forte" },
            { id: "r2", label: "Regulamento Geral de Direitos do Consumidor (RGC)", code: "ANATEL-632", direction: "incerto", confidence: "Forte" },
            { id: "r3", label: "Regulamento de Avaliação da Conformidade e Homologação", code: "ANATEL-715", direction: "incerto", confidence: "Média" },
            { id: "r4", label: "Regulamento de Segurança Cibernética Aplicada às Telecomunicações", code: "ANATEL-740", direction: "incerto", confidence: "Fraca" },
          ],
        },
        {
          id: "br-proc",
          title: "Processos",
          position: "top",
          colorTheme: "cyan",
          branchDirection: "incerto",
          branchConfidence: "Forte",
          items: [
            { id: "p1", label: "Service Strategy Management", code: "STR-01.1", direction: "positivo", confidence: "Forte" },
            { id: "p2", label: "Service Capacity Management", code: "NET-02.1", direction: "negativo", confidence: "Forte" },
            { id: "p3", label: "Resource Capacity Management (Backbone & OLTs)", code: "NET-02.4", direction: "negativo", confidence: "Forte" },
            { id: "p4", label: "Product Specification & Offering Development", code: "PRD-01.2", direction: "positivo", confidence: "Média" },
            { id: "p5", label: "Customer Order Processing & Provisioning Management", code: "O2C-02.3", direction: "negativo", confidence: "Forte" },
            { id: "p6", label: "Marketing Campaign & Retention Management", code: "MKT-03.1", direction: "positivo", confidence: "Forte" },
          ],
        },
        {
          id: "br-prod",
          title: "Produtos e serviços",
          position: "top",
          colorTheme: "pink",
          branchDirection: "positivo",
          branchConfidence: "Forte",
          items: [
            { id: "pr1", label: "Fibra (Banda Larga FTTH B2C)", detail: "Upgrade de 200/300MB para 400MB", direction: "positivo", confidence: "Forte" },
            { id: "pr2", label: "Planos Convergentes Total (Fibra + Móvel)", detail: "Reforço de valor percebido no bundle", direction: "positivo", confidence: "Média" },
            { id: "pr3", label: "Casa 5G / Wi-Fi Mesh Residencial", detail: "Demanda por extensores Wi-Fi 6", direction: "incerto", confidence: "Média" },
            { id: "pr4", label: "App (Meu Provedor / Autoatendimento)", detail: "Jornada de ativação e diagnóstico Wi-Fi", direction: "positivo", confidence: "Forte" },
          ],
        },
        {
          id: "br-rec",
          title: "Reclamações",
          position: "top",
          colorTheme: "orange",
          branchDirection: "negativo",
          branchConfidence: "Forte",
          items: [
            { id: "rc1", label: "Lentidão ou velocidade reduzida de conexão — SCM", detail: "Percepção de Wi-Fi abaixo de 400MB", direction: "negativo", confidence: "Forte" },
            { id: "rc2", label: "Sem conexão de dados — SCM (Banda Larga)", detail: "Quedas no reboot massivo de ONTs", direction: "negativo", confidence: "Média" },
            { id: "rc3", label: "Interrupção do serviço em um bairro / localidade", detail: "Saturação de porta PON em horário de pico", direction: "negativo", confidence: "Média" },
            { id: "rc4", label: "Instalação ou habilitação não realizada — SCM", detail: "Fila de troca de equipamentos legados", direction: "negativo", confidence: "Forte" },
            { id: "rc5", label: "Não cumprimento de agendamento de reparo / visita", detail: "Sobrecarga das equipes técnicas de campo", direction: "negativo", confidence: "Forte" },
          ],
        },
      ],
      bottomBranches: [
        {
          id: "br-voc",
          title: "Voice of Customer",
          position: "bottom",
          colorTheme: "amber",
          branchDirection: "positivo",
          branchConfidence: "Forte",
          items: [
            { id: "vc1", label: "IQP (Índice de Qualidade Percebida)", delta: "+4,2 pts", direction: "positivo", confidence: "Forte" },
            { id: "vc2", label: "NPS Relacional (próprio)", delta: "+5 pts", direction: "positivo", confidence: "Forte" },
            { id: "vc3", label: "Churn Rate (Voluntário)", delta: "-0,38 p.p.", direction: "positivo", confidence: "Forte" },
            { id: "vc4", label: "NPS Ookla / Speedtest", delta: "+11 pts", direction: "positivo", confidence: "Forte" },
            { id: "vc5", label: "NPS Transacional (Suporte Técnico)", delta: "-3 pts (curto prazo)", direction: "negativo", confidence: "Média" },
            { id: "vc6", label: "Contact Rate (Chamadas / Base)", delta: "+14% no 1º mês", direction: "negativo", confidence: "Forte" },
          ],
        },
        {
          id: "br-voe",
          title: "Voice of Employee",
          position: "bottom",
          colorTheme: "yellow",
          branchDirection: "negativo",
          branchConfidence: "Média",
          items: [
            { id: "ve1", label: "Turnover (Equipes de Atendimento e Campo)", delta: "+2,1 p.p.", direction: "negativo", confidence: "Média" },
            { id: "ve2", label: "Absenteísmo (Call Center N1)", delta: "+1,8 p.p.", direction: "negativo", confidence: "Média" },
            { id: "ve3", label: "Aderência à Escala Operacional", delta: "-4,5 p.p.", direction: "negativo", confidence: "Média" },
            { id: "ve4", label: "eNPS (Clima Operações & Rede)", delta: "-6 pts", direction: "negativo", confidence: "Fraca" },
          ],
        },
        {
          id: "br-ops",
          title: "Métricas Operacionais",
          position: "bottom",
          colorTheme: "emerald",
          branchDirection: "negativo",
          branchConfidence: "Forte",
          items: [
            { id: "mo1", label: "Utilização de Capacidade (Backbone / OLTs)", delta: "72% → 89%", direction: "negativo", confidence: "Forte" },
            { id: "mo2", label: "Velocidade Média Entregue (Download)", delta: "210MB → 385MB", direction: "positivo", confidence: "Forte" },
            { id: "mo3", label: "Latência Média em Horário de Pico", delta: "11ms → 18ms", direction: "negativo", confidence: "Média" },
            { id: "mo4", label: "Reincidência Técnica (30d)", delta: "+6,4%", direction: "negativo", confidence: "Média" },
            { id: "mo5", label: "Disponibilidade de Rede (SLA)", delta: "99,82% → 99,65%", direction: "negativo", confidence: "Média" },
            { id: "mo6", label: "Taxa de Visita Improdutiva (Wi-Fi legado)", delta: "+9,2%", direction: "negativo", confidence: "Forte" },
          ],
        },
        {
          id: "br-biz",
          title: "Métricas de Negócio",
          position: "bottom",
          colorTheme: "purple",
          branchDirection: "positivo",
          branchConfidence: "Forte",
          items: [
            { id: "mb1", label: "Market Share (Banda Larga Regional)", delta: "+1,4 p.p.", direction: "positivo", confidence: "Média" },
            { id: "mb2", label: "Brand Preference & Consideração", delta: "+6,0 pts", direction: "positivo", confidence: "Forte" },
            { id: "mb3", label: "ARPU — Receita Média por Usuário", delta: "Estável / Protegido", direction: "incerto", confidence: "Forte" },
            { id: "mb4", label: "CAPEX / Receita (Troca de ONTs + Rede)", delta: "+3,8 p.p.", direction: "negativo", confidence: "Forte" },
            { id: "mb5", label: "Crescimento de Receita (YoY)", delta: "+4,2% (via retenção)", direction: "positivo", confidence: "Média" },
            { id: "mb6", label: "Penetração em Homes Passed (HP)", delta: "+2,1 p.p.", direction: "positivo", confidence: "Média" },
          ],
        },
      ],
    };
  }

  if (analysis.id === "telecom-throttling-d1") {
    return {
      centralNodeLabel: "Redução de velocidade da internet de D+5 para D+1 após vencimento",
      topBranches: [
        {
          id: "br-reg-d1",
          title: "Regulação & Normativos",
          position: "top",
          colorTheme: "blue",
          branchDirection: "negativo",
          branchConfidence: "Forte",
          items: [
            { id: "rd1", label: "Resolução Anatel nº 632/2014 — RGC (Art. 90 e 91)", code: "RES-632", direction: "negativo", confidence: "Forte" },
            { id: "rd2", label: "Código de Defesa do Consumidor & Contratos SCM", code: "CDC-42", direction: "negativo", confidence: "Forte" },
            { id: "rd3", label: "Política Interna de Crédito e Cobrança (Grace Period)", code: "POL-FIN-018", direction: "incerto", confidence: "Forte" },
            { id: "rd4", label: "Diretriz Estratégica de Proteção de NPS 2026", code: "OKR-EST-02", direction: "negativo", confidence: "Média" },
          ],
        },
        {
          id: "br-proc-d1",
          title: "Processos",
          position: "top",
          colorTheme: "cyan",
          branchDirection: "incerto",
          branchConfidence: "Forte",
          items: [
            { id: "pd1", label: "Gestão de Faturamento e Régua de Cobrança", code: "O2C-04.2", direction: "positivo", confidence: "Forte" },
            { id: "pd2", label: "Conciliação Bancária CNAB 240 e Baixa Pix", code: "O2C-04.5", direction: "negativo", confidence: "Forte" },
            { id: "pd3", label: "Provisionamento Dinâmico e QoS no Radius/BRAS", code: "NET-02.1", direction: "negativo", confidence: "Forte" },
            { id: "pd4", label: "Suporte Técnico N1 e Diagnóstico de Lentidão", code: "CX-01.4", direction: "negativo", confidence: "Forte" },
            { id: "pd5", label: "Autoatendimento URA/App e Desbloqueio em Confiança", code: "CX-01.1", direction: "incerto", confidence: "Média" },
          ],
        },
        {
          id: "br-prod-d1",
          title: "Produtos e Canais",
          position: "top",
          colorTheme: "pink",
          branchDirection: "positivo",
          branchConfidence: "Média",
          items: [
            { id: "prd1", label: "Fibra Banda Larga B2C (Planos Residenciais)", direction: "incerto", confidence: "Forte" },
            { id: "prd2", label: "Gateway de Pagamento Instantâneo (Pix Copia-e-Cola)", direction: "positivo", confidence: "Forte" },
            { id: "prd3", label: "Boleto Bancário Tradicional (Compensação D+1/D+2)", direction: "negativo", confidence: "Forte" },
            { id: "prd4", label: "Portal Cativo / Aviso Interativo no Browser e App", direction: "positivo", confidence: "Média" },
          ],
        },
        {
          id: "br-rec-d1",
          title: "Reclamações & Atritos",
          position: "top",
          colorTheme: "orange",
          branchDirection: "negativo",
          branchConfidence: "Forte",
          items: [
            { id: "rcd1", label: "Suspensão ou redução indevida de velocidade — Anatel", direction: "negativo", confidence: "Forte" },
            { id: "rcd2", label: "Lentidão de conexão para cliente com boleto já pago", direction: "negativo", confidence: "Forte" },
            { id: "rcd3", label: "Falta de notificação prévia antes de restrição do serviço", direction: "negativo", confidence: "Forte" },
            { id: "rcd4", label: "Fila de espera no suporte técnico N1 por queixa de Wi-Fi", direction: "negativo", confidence: "Média" },
          ],
        },
      ],
      bottomBranches: [
        {
          id: "br-voc-d1",
          title: "Voice of Customer",
          position: "bottom",
          colorTheme: "amber",
          branchDirection: "negativo",
          branchConfidence: "Forte",
          items: [
            { id: "vcd1", label: "NPS Transacional (Jornada Fatura & Conexão)", delta: "-8 pts (v1) / -0,5 pt (v2)", direction: "negativo", confidence: "Forte" },
            { id: "vcd2", label: "Churn Voluntário Mensal (Bons Pagadores)", delta: "+0,33 p.p.", direction: "negativo", confidence: "Média" },
            { id: "vcd3", label: "Índice de Reclamações Anatel Consumidor", delta: "+50% (1,68/mil)", direction: "negativo", confidence: "Forte" },
            { id: "vcd4", label: "Resolução no Autoatendimento Digital (App/WhatsApp)", delta: "+24%", direction: "positivo", confidence: "Média" },
          ],
        },
        {
          id: "br-voe-d1",
          title: "Voice of Employee",
          position: "bottom",
          colorTheme: "yellow",
          branchDirection: "negativo",
          branchConfidence: "Média",
          items: [
            { id: "ved1", label: "Sobrecarga por Atendimento no Call Center N1", delta: "+13.200 lig/mês", direction: "negativo", confidence: "Forte" },
            { id: "ved2", label: "Desgaste em Chamadas de Retenção / Ouvidoria", delta: "+28%", direction: "negativo", confidence: "Média" },
            { id: "ved3", label: "Aderência à Escala de Atendimento", delta: "-5,2 p.p.", direction: "negativo", confidence: "Média" },
          ],
        },
        {
          id: "br-ops-d1",
          title: "Métricas Operacionais",
          position: "bottom",
          colorTheme: "emerald",
          branchDirection: "incerto",
          branchConfidence: "Forte",
          items: [
            { id: "mod1", label: "Volume de Sessões PPPoE/CoA Reiniciadas no Radius", delta: "5x maior em D+1", direction: "negativo", confidence: "Forte" },
            { id: "mod2", label: "Falsos-Positivos por Janela CNAB de Boleto (48h)", delta: "38% dos boletos", direction: "negativo", confidence: "Forte" },
            { id: "mod3", label: "Tempo de Religação Automática via Webhook Pix", delta: "< 3 minutos", direction: "positivo", confidence: "Forte" },
            { id: "mod4", label: "Custo Operacional de Atendimento Humano", delta: "+R$ 198 mil/mês", direction: "negativo", confidence: "Forte" },
          ],
        },
        {
          id: "br-biz-d1",
          title: "Métricas de Negócio",
          position: "bottom",
          colorTheme: "purple",
          branchDirection: "positivo",
          branchConfidence: "Forte",
          items: [
            { id: "mbd1", label: "Inadimplência de Curto Prazo (D+1 a D+10)", delta: "8,4% → 5,9% (-2,5 p.p.)", direction: "positivo", confidence: "Forte" },
            { id: "mbd2", label: "Prazo Médio de Recebimento (PMR / DSO)", delta: "-2,8 dias no ciclo", direction: "positivo", confidence: "Forte" },
            { id: "mbd3", label: "Antecipação de Fluxo de Caixa Mensal", delta: "+R$ 14,5 milhões", direction: "positivo", confidence: "Forte" },
            { id: "mbd4", label: "Share de Pagamentos Instantâneos (Pix / Débito)", delta: "46% → 58% (+12 p.p.)", direction: "positivo", confidence: "Média" },
          ],
        },
      ],
    };
  }

  // Mapa padrão rico para Alçada de Compras ou Simulações Customizadas
  return {
    centralNodeLabel: analysis.title.replace(/^Simulação de Mudança:\s*/i, ""),
    topBranches: [
      {
        id: "br-reg-gen",
        title: "Regulação & Governança",
        position: "top",
        colorTheme: "blue",
        branchDirection: "incerto",
        branchConfidence: "Forte",
        items: analysis.policiesImpacted.map((p) => ({
          id: p.id,
          label: p.title,
          code: p.code,
          direction: p.severity === "alinhado" ? "positivo" : p.severity === "bloqueio_legal" ? "negativo" : "incerto",
          confidence: "Forte",
        })),
      },
      {
        id: "br-proc-gen",
        title: "Processos",
        position: "top",
        colorTheme: "cyan",
        branchDirection: "incerto",
        branchConfidence: "Forte",
        items: [
          ...analysis.affectedProcesses.map((proc) => ({
            id: proc.id,
            label: proc.name,
            code: proc.code,
            direction: "incerto" as const,
            confidence: "Forte" as const,
          })),
          ...analysis.areasAndCommittee.flatMap((rep) =>
            rep.affectedProcesses.map((ap, idx) => ({
              id: `ap-${rep.id}-${idx}`,
              label: ap,
              direction: rep.stance === "favoravel" ? ("positivo" as const) : ("negativo" as const),
              confidence: "Média" as const,
            }))
          ).slice(0, 4),
        ],
      },
      {
        id: "br-prod-gen",
        title: "Sistemas & Serviços",
        position: "top",
        colorTheme: "pink",
        branchDirection: "positivo",
        branchConfidence: "Média",
        items: analysis.areasAndCommittee.flatMap((rep) =>
          rep.affectedSystems.map((sys, idx) => ({
            id: `sys-${rep.id}-${idx}`,
            label: sys,
            detail: rep.shortArea,
            direction: "incerto" as const,
            confidence: "Média" as const,
          }))
        ).slice(0, 5),
      },
      {
        id: "br-rec-gen",
        title: "Riscos & Reclamações",
        position: "top",
        colorTheme: "orange",
        branchDirection: "negativo",
        branchConfidence: "Forte",
        items: analysis.risks.map((r) => ({
          id: r.id,
          label: r.title,
          detail: r.category,
          direction: "negativo" as const,
          confidence: r.probability === "Alta" ? ("Forte" as const) : ("Média" as const),
        })),
      },
    ],
    bottomBranches: [
      {
        id: "br-voc-gen",
        title: "Voice of Customer & Stakeholders",
        position: "bottom",
        colorTheme: "amber",
        branchDirection: "incerto",
        branchConfidence: "Forte",
        items: [
          ...analysis.indicatorsImpacted
            .filter((i) => i.area.toLowerCase().includes("cx") || i.area.toLowerCase().includes("atendimento") || i.name.toLowerCase().includes("nps"))
            .map((i) => ({
              id: i.id,
              label: i.name,
              delta: i.deltaLabel,
              direction: i.direction,
              confidence: "Forte" as const,
            })),
          { id: "voc-extra-1", label: "Satisfação dos Solicitantes Internos / Clientes", delta: "Monitorado", direction: "incerto", confidence: "Média" },
          { id: "voc-extra-2", label: "Taxa de Contestação / Pedidos de Exceção", delta: "+12% na transição", direction: "negativo", confidence: "Média" },
        ],
      },
      {
        id: "br-voe-gen",
        title: "Voice of Employee",
        position: "bottom",
        colorTheme: "yellow",
        branchDirection: "negativo",
        branchConfidence: "Média",
        items: [
          { id: "voe-1", label: "Carga Operacional de Aprovação e Análise", delta: "+22% no 1º mês", direction: "negativo", confidence: "Forte" },
          { id: "voe-2", label: "Aderência ao Novo Procedimento (POP)", delta: "85% → 96%", direction: "positivo", confidence: "Média" },
          { id: "voe-3", label: "Atrito entre Áreas na Transição", delta: "Moderado", direction: "incerto", confidence: "Média" },
        ],
      },
      {
        id: "br-ops-gen",
        title: "Métricas Operacionais",
        position: "bottom",
        colorTheme: "emerald",
        branchDirection: "negativo",
        branchConfidence: "Forte",
        items: analysis.indicatorsImpacted
          .filter((i) => i.direction === "negativo")
          .map((i) => ({
            id: `ops-${i.id}`,
            label: i.name,
            delta: i.deltaLabel,
            direction: i.direction,
            confidence: i.confidence === "Alta" ? ("Forte" as const) : ("Média" as const),
          })),
      },
      {
        id: "br-biz-gen",
        title: "Métricas de Negócio",
        position: "bottom",
        colorTheme: "purple",
        branchDirection: "positivo",
        branchConfidence: "Forte",
        items: analysis.indicatorsImpacted
          .filter((i) => i.direction === "positivo")
          .map((i) => ({
            id: `biz-${i.id}`,
            label: i.name,
            delta: i.deltaLabel,
            direction: i.direction,
            confidence: i.confidence === "Alta" ? ("Forte" as const) : ("Média" as const),
          })),
      },
    ],
  };
}

// ============================================================================
// 5E. CONSTRUTOR DE REPRESENTANTE PARA ADICIONAR NOVAS ÁREAS À MESA REDONDA
// ============================================================================
export function buildRepresentativeFromAreaProfile(
  area: AreaAgentProfile,
  analysisTitle: string
): {
  representative: CommitteeRepresentative;
  negotiationItem: NegotiationRequestItem;
} {
  const repId = `rep-${area.id.replace("area-", "")}`;

  const defaultConcernsByArea: Record<string, {
    stance: StanceStatus;
    impactLevel: "Crítico" | "Alto" | "Médio";
    raciRole: "Aprovador (A)" | "Responsável (R)" | "Consultado (C)" | "Informado (I)";
    stanceSummary: string;
    mainConcerns: string[];
    positivePointsSeen: string[];
    negotiationConditions: string[];
    openingStatement: string;
    negTitle: string;
    negDesc: string;
    negClause: string;
  }> = {
    "area-rh": {
      stance: "ressalvas",
      impactLevel: "Médio",
      raciRole: "Consultado (C)",
      stanceSummary: "Alerta para impacto em turnover, pressão nas equipes de linha de frente e necessidade de trilha de treinamento antes do rollout.",
      mainConcerns: [
        "Mudanças abruptas de regra aumentam o desgaste emocional e o turnover no Call Center e nas equipes de campo (+2,1 p.p.).",
        "As equipes operacionais precisam de pelo menos 7 dias de capacitação no novo script e atualização das metas variáveis antes da virada.",
      ],
      positivePointsSeen: [
        "Clareza nas regras reduz conflitos decisórios depois que a curva de aprendizagem estabiliza.",
      ],
      negotiationConditions: [
        "Garantir janela prévia de capacitação das equipes de atendimento/campo e neutralizar penalizações de TMA/metas durante os primeiros 30 dias.",
      ],
      openingStatement: `Olá pessoal! Que bom que incluíram **${area.shortArea}** na Mesa Redonda. Olhando pelo lado de Pessoas e Clima Organizacional (Voice of Employee), qualquer mudança desse porte sem preparação da ponta gera pico de estresse, absenteísmo e turnover no Call Center e no Campo. Nossa condição para apoiar é simples: incluir uma trilha rápida de treinamento pré-rollout e proteger a remuneração variável das equipes nos primeiros 30 dias de transição.`,
      negTitle: "Trilha de Capacitação Pré-Rollout + Proteção de Metas (30 dias)",
      negDesc: "Treinar as equipes operacionais antes da virada de chave e expurgar desvios de TMA da meta variável no 1º mês.",
      negClause: "Realizar capacitação prévia das equipes de atendimento/operação e aplicar expurgo de transição nas metas operacionais nos primeiros 30 dias.",
    },
    "area-ops": {
      stance: "resistente",
      impactLevel: "Crítico",
      raciRole: "Responsável (R)",
      stanceSummary: "Preocupação elevada com sobrecarga de ordens de serviço em campo e visitas técnicas improdutivas.",
      mainConcerns: [
        "A mudança pode disparar agendamentos técnicos de campo sem folga na frota atual, comprometendo o SLA de reparo e instalação.",
      ],
      positivePointsSeen: [
        "Se houver filtro digital prévio no App, evitamos deslocamento desnecessário de técnicos.",
      ],
      negotiationConditions: [
        "Incluir diagnóstico automático remoto antes de abrir Ordem de Serviço de campo e fasear o rollout por região operacional.",
      ],
      openingStatement: `Entrando na discussão pela **${area.shortArea}**: precisamos ter muito cuidado com o impacto na capacidade de campo. Se essa diretriz gerar aumento de visitas técnicas sem filtro prévio no atendimento digital, vamos estourar o SLA de agendamento. Solicito incluir trava de diagnóstico remoto obrigatório e rollout regionalizado.`,
      negTitle: "Diagnóstico Remoto Obrigatório + Rollout Regionalizado de Campo",
      negDesc: "Exigir validação remota automatizada antes de despachar técnico a campo e escalonar a ativação por capacidade regional.",
      negClause: "Condicionar abertura de visitas técnicas à validação remota prévia e fasear a implementação conforme capacidade regional de campo.",
    },
    "area-sup": {
      stance: "ressalvas",
      impactLevel: "Médio",
      raciRole: "Consultado (C)",
      stanceSummary: "Requer alinhamento de estoque de equipamentos (CPE/ONT) e contratos com fornecedores parceiros.",
      mainConcerns: [
        "Necessidade de validar disponibilidade de estoque de equipamentos e aditivos com parceiros logísticos antes de acelerar a demanda.",
      ],
      positivePointsSeen: [
        "Permite planejar compras consolidadas com melhores condições comerciais se houver previsibilidade.",
      ],
      negotiationConditions: [
        "Validar cobertura de estoque regulador para 60 dias e acionar contratos guarda-chuva com fornecedores homologados.",
      ],
      openingStatement: `Pela **${area.shortArea}**, destaco que mudanças que alteram demanda de equipamentos ou serviços terceirizados precisam conversar com o nosso estoque regulador e Lead Time de fornecedores. Nossa condição na mesa é vincular o cronograma à disponibilidade de estoque homologado.`,
      negTitle: "Trava de Estoque Regulador (60 dias) e Fornecedores Homologados",
      negDesc: "Garantir cobertura logística e contratual em Suprimentos antes da expansão massiva.",
      negClause: "Sincronizar o cronograma de liberação com a cobertura de estoque regulador de 60 dias em Suprimentos.",
    },
  };

  const preset = defaultConcernsByArea[area.id];

  const representative: CommitteeRepresentative = {
    id: repId,
    areaId: area.id,
    areaName: area.areaName,
    shortArea: area.shortArea,
    agentName: area.agentName,
    agentRole: area.agentRole,
    avatarColor: area.avatarColor,
    avatarInitials: area.avatarInitials,
    impactLevel: preset?.impactLevel || "Alto",
    raciRole: preset?.raciRole || "Consultado (C)",
    stance: preset?.stance || "ressalvas",
    stanceSummary:
      preset?.stanceSummary ||
      `Convocado para avaliar os impactos nos processos (${area.mappedProcesses.map((p) => p.code).join(", ")}) e indicadores de ${area.shortArea}.`,
    affectedProcesses: area.mappedProcesses.map((p) => `${p.code} ${p.name}`),
    affectedSystems: ["ERP / Portal Corporativo", "Painel de Indicadores da Área"],
    mainConcerns: preset?.mainConcerns || [
      `Garantir que as regras de negócio de ${area.shortArea} (${area.businessRules.map((b) => b.code).join(", ")}) sejam respeitadas na transição.`,
      `Proteger os indicadores-chave da diretoria (${area.keyIndicators.map((k) => k.name).join(", ")}).`,
    ],
    positivePointsSeen: preset?.positivePointsSeen || [
      `Alinhamento transversal antecipado com ${area.shortArea} evita retrabalho pós-implantação.`,
    ],
    negotiationConditions: preset?.negotiationConditions || [
      `Incorporar salvaguarda operacional de ${area.shortArea} para preservar o SLA de ${area.keyIndicators[0]?.name || "qualidade"}.`,
    ],
    openingStatement:
      preset?.openingStatement ||
      `Olá a todos! Fui convocado para representar **${area.shortArea}** nesta Mesa Redonda sobre *"${analysisTitle}"*. Analisando nossos processos (${area.mappedProcesses.map((p) => p.code).join(", ")}) e indicadores, temos ressalvas importantes que precisam entrar na proposta para evitarmos efeitos colaterais na operação.`,
  };

  const negotiationItem: NegotiationRequestItem = {
    id: `neg-added-${area.id}-${Date.now()}`,
    repId,
    areaShortName: area.shortArea,
    agentName: area.agentName,
    avatarColor: area.avatarColor,
    avatarInitials: area.avatarInitials,
    title: preset?.negTitle || `Salvaguarda operacional e de SLA para ${area.shortArea}`,
    description:
      preset?.negDesc ||
      representative.negotiationConditions[0] ||
      `Ajustar regra de transição para proteger os processos e metas de ${area.shortArea}.`,
    clauseAddedToProposal:
      preset?.negClause ||
      representative.negotiationConditions[0] ||
      `Respeitar os limites operacionais e SLAs vigentes de ${area.shortArea}.`,
    riskReductionDelta: 8,
    status: "pending",
  };

  return { representative, negotiationItem };
}

// ============================================================================
// 6. ROTEADOR INTELIGENTE DE DÚVIDAS (CHAT GERAL OU POR ÁREA)
// ============================================================================
export function generateAreaQAResponse(
  question: string,
  selectedAreaId: "general" | string,
  areas: AreaAgentProfile[]
): Omit<AreaQAChatMessage, "id" | "timestamp"> {
  const lower = question.toLowerCase();

  let targetArea: AreaAgentProfile | undefined;
  const wasAutoRouted = selectedAreaId === "general";

  if (selectedAreaId !== "general") {
    targetArea = areas.find((a) => a.id === selectedAreaId);
  } else {
    // Roteamento semântico automático pela pergunta
    if (
      lower.includes("anatel") ||
      lower.includes("lei") ||
      lower.includes("jurídic") ||
      lower.includes("juridic") ||
      lower.includes("cdc") ||
      lower.includes("contrato") ||
      lower.includes("multa") ||
      lower.includes("resolução") ||
      lower.includes("resolucao") ||
      lower.includes("legal") ||
      lower.includes("prazo")
    ) {
      targetArea = areas.find((a) => a.id === "area-jur");
    } else if (
      lower.includes("compra") ||
      lower.includes("alçada") ||
      lower.includes("alcada") ||
      lower.includes("suprimento") ||
      lower.includes("fornecedor") ||
      lower.includes("ariba") ||
      lower.includes("spot") ||
      lower.includes("fracionamento")
    ) {
      targetArea = areas.find((a) => a.id === "area-sup");
    } else if (
      lower.includes("radius") ||
      lower.includes("rede") ||
      lower.includes("cnab") ||
      lower.includes("sistema") ||
      lower.includes("ti") ||
      lower.includes("webhook") ||
      lower.includes("pppoe") ||
      lower.includes("compensação") ||
      lower.includes("compensacao")
    ) {
      targetArea = areas.find((a) => a.id === "area-ti");
    } else if (
      lower.includes("nps") ||
      lower.includes("call center") ||
      lower.includes("atendimento") ||
      lower.includes("suporte") ||
      lower.includes("confiança") ||
      lower.includes("confianca") ||
      lower.includes("ura") ||
      lower.includes("churn")
    ) {
      targetArea = areas.find((a) => a.id === "area-cx");
    } else if (
      lower.includes("campo") ||
      lower.includes("manutenção") ||
      lower.includes("manutencao") ||
      lower.includes("reparo") ||
      lower.includes("técnico")
    ) {
      targetArea = areas.find((a) => a.id === "area-ops");
    } else if (
      lower.includes("treinamento") ||
      lower.includes("rh") ||
      lower.includes("raci") ||
      lower.includes("pessoas")
    ) {
      targetArea = areas.find((a) => a.id === "area-rh");
    } else {
      targetArea = areas.find((a) => a.id === "area-fin");
    }
  }

  const area = targetArea || areas[0];

  // Constrói resposta rica baseada na área identificada
  if (area.id === "area-jur") {
    return {
      sender: "agent",
      routedAreaId: area.id,
      routedAreaName: area.shortArea,
      wasAutoRouted,
      agentName: area.agentName,
      agentRole: area.agentRole,
      avatarColor: area.avatarColor,
      avatarInitials: area.avatarInitials,
      content: `${
        wasAutoRouted
          ? `🔎 **Roteamento Inteligente:** Identifiquei que sua dúvida envolve normas regulatórias e contratuais. Direcionei a consulta para o agente de **${area.shortArea}**.\n\n`
          : ""
      }Pela base normativa e pelos processos do **${area.shortArea}**, aqui está a orientação oficial:\n\n• **Regra da Anatel (Suspensão Parcial / Redução de Velocidade):** Conforme os **Arts. 90 e 91 da Resolução Anatel nº 632/2014 (RGC)**, a empresa **não pode reduzir a velocidade contratada** logo no 1º dia de atraso. É obrigatório notificar o consumidor formalmente sobre o débito e aguardar o decurso de **15 dias após a notificação**.\n• **O que é permitido fazer em D+1:** A regulação permite enviar avisos digitais (WhatsApp, Push, SMS) e até exibir um **Banner/Portal Informativo dispensável** no navegador com QR Code Pix, desde que a velocidade contratada não seja degradada antes do prazo legal.\n• **Alterações Contratuais (CDC):** Pela Cláusula 8.2 do Contrato SCM e Art. 42 do CDC, qualquer mudança em critérios de tolerância exige comunicação prévia mínima de **30 dias** aos clientes.`,
      citedSources: [
        {
          code: "RES-ANATEL-632",
          title: "Resolução Anatel nº 632/2014 (Art. 90 e 91 — RGC)",
          type: "Documento",
          linkType: "external",
          externalUrl: "https://informacoes.anatel.gov.br/legislacao/resolucoes/2014/750-resolucao-632",
          moduleLabel: "Portal Legislação Anatel (Externo)",
          summary: "Exige notificação prévia e prazo de 15 dias antes de suspensão parcial ou redução de velocidade.",
        },
        {
          code: "CDC-LEI-8078",
          title: "Código de Defesa do Consumidor — Lei nº 8.078/1990 (Art. 42)",
          type: "Documento",
          linkType: "external",
          externalUrl: "https://www.planalto.gov.br/ccivil_03/leis/l8078compilado.htm",
          moduleLabel: "Portal Planalto.gov.br (Externo)",
          summary: "Veda exposição do consumidor inadimplente a constrangimento e exige aviso prévio de 30 dias para alterações.",
        },
        {
          code: "JUR-03.1",
          title: "Gestão de Contencioso e Órgãos Reguladores",
          type: "Processo",
          linkType: "internal",
          internalPath: "/architecture",
          moduleLabel: "Abrir em Arquitetura de Processos",
          summary: "Fluxo interno de análise preventiva e resposta a ofícios da Anatel e Procon.",
        },
      ],
    };
  }

  if (area.id === "area-sup") {
    return {
      sender: "agent",
      routedAreaId: area.id,
      routedAreaName: area.shortArea,
      wasAutoRouted,
      agentName: area.agentName,
      agentRole: area.agentRole,
      avatarColor: area.avatarColor,
      avatarInitials: area.avatarInitials,
      content: `${
        wasAutoRouted
          ? `🔎 **Roteamento Inteligente:** Sua pergunta trata de regras de compras, contratos e alçadas (P2P). Consultei o agente de **${area.shortArea}**.\n\n`
          : ""
      }De acordo com o processo **P2P-03.1** e a política **POL-GOV-002** vigentes em **${area.shortArea}**:\n\n• **Alçada Vigente de Aprovação:** Gerentes Seniores (Nível 3) possuem alçada automática para aprovar requisições de até **R$ 50.000**, desde que o item esteja previsto no orçamento anual (OPEX) do centro de custo.\n• **Contratos Guarda-Chuva vs. Compras Spot:** Pedidos emitidos contra Contratos Guarda-Chuva já licitados por Suprimentos (Call-offs, **PRO-SUP-019**) têm fluxo rápido de 4,2 dias. Já compras Spot (avulsas sem contrato) passam por validação adicional.\n• **Prevenção a Fracionamento:** O módulo SAP GRC monitora emissões múltiplas para o mesmo CNPJ para evitar que compras maiores sejam divididas artificialmente.`,
      citedSources: [
        {
          code: "P2P-03.1",
          title: "Aprovação de Requisições e Pedidos de Compra",
          type: "Processo",
          linkType: "internal",
          internalPath: "/architecture",
          moduleLabel: "Abrir em Arquitetura de Processos",
          summary: "Fluxo BPMN completo do ciclo Procure-to-Pay e alçadas no SAP Ariba.",
        },
        {
          code: "POL-GOV-002",
          title: "Política Corporativa de Alçadas Financeiras",
          type: "Documento",
          linkType: "internal",
          internalPath: "/normatives",
          moduleLabel: "Abrir no Módulo de Normativos",
          summary: "Normativo interno que estabelece os limites de aprovação por nível hierárquico.",
        },
        {
          code: "PRO-SUP-019",
          title: "Procedimento de Contratos Homologados (Call-off)",
          type: "Regra",
          linkType: "internal",
          internalPath: "/normatives",
          moduleLabel: "Abrir no Módulo de Normativos",
          summary: "Regras de emissão rápida de pedidos vinculados a contratos já licitados.",
        },
      ],
    };
  }

  if (area.id === "area-ti") {
    return {
      sender: "agent",
      routedAreaId: area.id,
      routedAreaName: area.shortArea,
      wasAutoRouted,
      agentName: area.agentName,
      agentRole: area.agentRole,
      avatarColor: area.avatarColor,
      avatarInitials: area.avatarInitials,
      content: `${
        wasAutoRouted
          ? `🔎 **Roteamento Inteligente:** Sua dúvida envolve integrações sistêmicas, compensação bancária e rede. Acionei o agente de **${area.shortArea}**.\n\n`
          : ""
      }Consultando a arquitetura técnica mapeada em **${area.shortArea}** (**NET-02.1** e **IT-TI-112**):\n\n• **Janela de Compensação de Boletos (CNAB):** Cerca de **38% dos boletos pagos na data de vencimento** só têm o arquivo de retorno bancário processado no ERP entre as 14h de D+1 e as 10h de D+2. Por isso, qualquer ação automática em D+1 sobre boletos gera falso-positivo em clientes adimplentes.\n• **Liquidação via Pix:** Pagamentos via Pix acionam nosso Webhook em tempo real (**SLA-TI-04**) e liberam qualquer restrição no servidor Radius em **menos de 3 minutos**.\n• **Controle de Banda no Radius/BRAS:** Recomendamos utilizar pacotes dinâmicos **CoA (Change of Authorization)** ou redirecionamento HTTP leve em vez de derrubar sessões PPPoE em massa.`,
      citedSources: [
        {
          code: "NET-02.1",
          title: "Provisionamento e Controle de Banda (QoS)",
          type: "Processo",
          linkType: "internal",
          internalPath: "/architecture",
          moduleLabel: "Abrir em Arquitetura de Processos",
          summary: "Processo técnico de integração entre o sistema de Billing e os servidores BRAS/Radius.",
        },
        {
          code: "IT-TI-112",
          title: "Instrução Técnica de Integração Billing-Radius",
          type: "Regra",
          linkType: "internal",
          internalPath: "/normatives",
          moduleLabel: "Abrir no Módulo de Normativos",
          summary: "Define limites de fila CoA e janelas de processamento de arquivos CNAB 240/400.",
        },
        {
          code: "RFC-5176-COA",
          title: "Especificação Técnica RADIUS Dynamic Authorization (RFC 5176)",
          type: "Documento",
          linkType: "external",
          externalUrl: "https://datatracker.ietf.org/doc/html/rfc5176",
          moduleLabel: "Documentação Técnica IETF (Externo)",
          summary: "Padrão de protocolo externo para alteração dinâmica de banda sem desconexão PPPoE.",
        },
      ],
    };
  }

  if (area.id === "area-cx") {
    return {
      sender: "agent",
      routedAreaId: area.id,
      routedAreaName: area.shortArea,
      wasAutoRouted,
      agentName: area.agentName,
      agentRole: area.agentRole,
      avatarColor: area.avatarColor,
      avatarInitials: area.avatarInitials,
      content: `${
        wasAutoRouted
          ? `🔎 **Roteamento Inteligente:** Identifiquei relação direta com jornada do cliente, atendimento e retenção. Direcionei para **${area.shortArea}**.\n\n`
          : ""
      }Pelos procedimentos operacionais de **${area.shortArea}** (**CX-01.4** e **PRO-CX-045**):\n\n• **Desbloqueio em Confiança (RN-CX-008):** Clientes adimplentes que declararem pagamento pelo App, WhatsApp ou URA têm a velocidade integral restabelecida imediatamente por **72 horas** enquanto aguardam a compensação bancária.\n• **Impacto no Suporte Técnico N1:** Quando um cliente sofre redução de velocidade sem um aviso visual claro, ele acredita que é falha técnica no Wi-Fi/Fibra e liga para o Suporte N1 (custo médio de R$ 15/chamada).\n• **Trava Estratégica de NPS:** Pelo Planejamento Estratégico 2026–2028, nossa meta piso de NPS Transacional é **65 pontos** (atual: 66 pts).`,
      citedSources: [
        {
          code: "CX-01.4",
          title: "Atendimento de Suporte Técnico e Retenção N1/N2",
          type: "Processo",
          linkType: "internal",
          internalPath: "/architecture",
          moduleLabel: "Abrir em Arquitetura de Processos",
          summary: "Fluxo de triagem na URA, autoatendimento digital e transbordo para atendimento humano.",
        },
        {
          code: "PRO-CX-045",
          title: "Procedimento de Desbloqueio em Confiança (72h)",
          type: "Regra",
          linkType: "internal",
          internalPath: "/normatives",
          moduleLabel: "Abrir no Módulo de Normativos",
          summary: "Regras de elegibilidade para religação imediata em confiança via App e WhatsApp.",
        },
        {
          code: "IND-CX-01",
          title: "Painel de NPS Transacional & Contenção Digital",
          type: "Indicador",
          linkType: "internal",
          internalPath: "/process-analysis",
          moduleLabel: "Abrir em Análise de Indicadores",
          summary: "Acompanhamento em tempo real do NPS da jornada de fatura e suporte.",
        },
      ],
    };
  }

  // Default: Finanças & Cobrança (ou demais áreas)
  return {
    sender: "agent",
    routedAreaId: area.id,
    routedAreaName: area.shortArea,
    wasAutoRouted,
    agentName: area.agentName,
    agentRole: area.agentRole,
    avatarColor: area.avatarColor,
    avatarInitials: area.avatarInitials,
    content: `${
      wasAutoRouted
        ? `🔎 **Roteamento Inteligente:** Direcionei sua pergunta para o agente especialista de **${area.shortArea}** (${area.agentName}).\n\n`
        : ""
    }Com base nos processos, regras de negócio e documentos vigentes de **${area.shortArea}**:\n\n• **Processo e Regra Vigente:** No fluxo **${area.mappedProcesses[0]?.code || "O2C-04.2"} (${area.mappedProcesses[0]?.name || "Gestão de Faturamento e Cobrança"})**, operamos hoje com uma franquia de tolerância de **5 dias corridos (D+5)** pós-vencimento (**RN-COB-012** / **POL-FIN-018**).\n• **Indicadores Atuais da Área:** Nosso Índice de Inadimplência Curto Prazo está em **8,4%** (meta <= 6,5%) e o Prazo Médio de Recebimento (PMR/DSO) está em **34,2 dias** (meta <= 31 dias), com cerca de R$ 40 milhões flutuando entre D+1 e D+5.\n• **Recomendações Vigentes:** A conversão para meios instantâneos (Pix Copia-e-Cola via WhatsApp em D+1) já recupera 52% dos atrasos por esquecimento sem atrito operacional.`,
    citedSources: [
      {
        code: area.mappedProcesses[0]?.code || "O2C-04.2",
        title: area.mappedProcesses[0]?.name || "Gestão de Cobrança e Régua de Inadimplência",
        type: "Processo",
        linkType: "internal",
        internalPath: "/architecture",
        moduleLabel: "Abrir em Arquitetura de Processos",
        summary: "Processo ponta a ponta de faturamento, régua preventiva e recuperação de crédito.",
      },
      {
        code: "POL-FIN-018",
        title: "Política Corporativa de Crédito, Cobrança e Inadimplência",
        type: "Documento",
        linkType: "internal",
        internalPath: "/normatives",
        moduleLabel: "Abrir no Módulo de Normativos",
        summary: "Define a franquia de tolerância de 5 dias (D+5) e critérios de negativação.",
      },
      {
        code: "IND-FIN-01",
        title: "Indicadores de Inadimplência Curto Prazo & PMR",
        type: "Indicador",
        linkType: "internal",
        internalPath: "/process-analysis",
        moduleLabel: "Abrir em Análise de Indicadores",
        summary: "Série histórica de DSO/PMR e curva de recuperação entre D+1 e D+15.",
      },
    ],
  };
}
