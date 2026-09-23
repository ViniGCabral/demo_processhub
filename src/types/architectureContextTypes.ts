// Tipos para a nova experiência do Módulo de Arquitetura de Processos
// Centralizando Hierarquia, Contexto Rico, Relações, Jornadas e Indicadores

// ── 0. METADADOS DE VALIDAÇÃO (CAMADA DE CONFIANÇA) ──────────

export type ValidationState = 'sugerido_ia' | 'declarado_usuario' | 'observado_evidencia' | 'em_validacao' | 'confirmado' | 'rejeitado' | 'contraditorio' | 'obsoleto' | 'nao_aplicavel';

export interface ValidationMetadata {
  state: ValidationState;
  origin: string;
  confidence: number;
  responsible: string;
  date: string;
  justification: string;
  evidenceId?: string;
}

export interface ValidatableString {
  value: string;
  validation: ValidationMetadata;
}

// ── 1. INDICADORES ───────────────────────────────────────────

export type IndicatorTrend = 'up' | 'down' | 'stable';
export type IndicatorStatus = 'dentro_da_meta' | 'atencao' | 'critico' | 'sem_dados';
export type IndicatorValueSource = 'proprio' | 'consolidado' | 'herdado' | 'estimado' | 'nao_agregavel';
export type IndicatorUpdateStatus = 'atualizado' | 'proximo_vencimento' | 'pendente' | 'em_atraso' | 'sem_medicao';
export type IndicatorDataSource = 'manual' | 'importacao' | 'integracao' | 'calculado';

export type BusinessIndicatorCategory = 
  | 'Eficiência' 
  | 'Qualidade' 
  | 'Prazo/SLA' 
  | 'Volume' 
  | 'Custo' 
  | 'Satisfação' 
  | 'Risco' 
  | 'Resultado';

export type IndicatorPolarity = 'maior_melhor' | 'menor_melhor';

export interface IndicatorMeasurement {
  id: string;
  indicatorId?: string;
  referencePeriod: string; // Ex: "2026-09" ou "Setembro/2026"
  period?: string; // Alias de compatibilidade
  measuredValue: string;
  targetApplied?: string;
  status?: IndicatorStatus;
  registeredAt?: string; // Data ISO YYYY-MM-DD
  entryDate?: string; // Alias de compatibilidade
  registeredBy?: string;
  source?: string;
  comment?: string;
  evidence?: string;
  correctionReason?: string;
  correctedBy?: string;
  correctedAt?: string;
}

export interface BaseIndicator {
  id: string;
  name: string;
  objective: string;
  unit: string;
  currentValue: string; // Derivado da medição mais recente
  target: string;
  trend: IndicatorTrend; // Calculado
  status: IndicatorStatus; // Status de desempenho calculado
  updateStatus?: IndicatorUpdateStatus; // Status de atualização calculado
  lastMeasurementDate?: string;
  lastMeasurementPeriod?: string;
  valueSource: IndicatorValueSource;
  periodicity: string;
  responsible: string;
  source: string;
  formula?: string;
  measurementHistory: Array<{ date: string; value: string }>;
  measurements?: IndicatorMeasurement[];
  polarity?: IndicatorPolarity;
  category?: BusinessIndicatorCategory;
  domainId?: string;
  l2Id?: string;
  processId?: string;
  processName?: string;
  journeyId?: string;
  
  // Configurações de prazo e acompanhamento
  updateDeadlineDays?: number;
  trackingStartDate?: string;
  dataSourceType?: IndicatorDataSource;

  // Campos preparados para integrações futuras
  integrationMethod?: string;
  sourceSystem?: string;
  externalId?: string;
  lastSyncAt?: string;
  syncStatus?: string;
}

export interface ContextIndicator extends BaseIndicator {
  type: 'context';
  aggregationRule?: string;
}

export interface BusinessIndicator extends BaseIndicator {
  type: 'business';
  alertBand: string;
  scope: string;
  aggregationRule: 'soma' | 'media_ponderada' | 'maior_valor' | 'percentual_recalculado' | 'nao_agregavel';
}

export interface StrategicIndicator extends BaseIndicator {
  type: 'strategic';
  alertBand: string;
  scope: string;
  aggregationRule: 'soma' | 'media_ponderada' | 'maior_valor' | 'percentual_recalculado' | 'nao_agregavel';
}

export type Indicator = ContextIndicator | BusinessIndicator | StrategicIndicator;

export interface DomainAlert {
  id: string;
  type: 'process_no_doc' | 'process_pending_context' | 'kpi_below_target' | 'journey_unmapped_step' | 'manual_spreadsheet_dependency' | 'open_question' | 'regulation_near_review' | 'system_critical';
  title: string;
  description: string;
  severity: 'low' | 'medium' | 'high';
  targetType: 'process' | 'indicator' | 'journey' | 'system' | 'regulation';
  targetId?: string;
  targetName?: string;
}


// ── 2. RELAÇÕES ENTRE COMPONENTES E PROCESSOS ─────────────────

export type ProcessRelationType = 
  | 'precede'
  | 'sucede'
  | 'dispara'
  | 'fornece_entrada_para'
  | 'recebe_saida_de'
  | 'depende_de'
  | 'transfere_responsabilidade_para'
  | 'compartilha_dados_com'
  | 'executa_em_paralelo_com'
  | 'reprocessa'
  | 'retorna_para'
  | 'e_alternativa_a';

export interface ProcessRelation {
  id: string;
  sourceProcessId: string;
  targetProcessId: string;
  sourceName?: string;
  targetName?: string;
  type: ProcessRelationType;
  description: string;
  evidenceOrJustification?: string;
  validationStatus: 'unvalidated' | 'validating' | 'validated';
  confidence: number; // 0 a 100
}

// ── 2.1 ESTRUTURAS DE GOVERNANÇA, FTs E POLÍTICAS ─────────────

export interface ArchitecturePolicyLink {
  id: string;
  name: string;
  type: string; // Ex: 'Política Corporativa', 'Norma Regulatória', 'Certificação ISO', 'Lei Federal'
  version: string; // Ex: 'Rev. 2026', 'v3.2'
  status: 'vigente' | 'em_revisao' | 'obsoleto' | 'rascunho';
  effectiveDate?: string;
  reviewDueDate?: string;
  responsible?: string;
  applicabilityStatus?: 'total' | 'parcial' | 'informativa';
  complianceStatus?: 'conforme' | 'em_adequacao' | 'nao_conforme' | 'nao_avaliado';
  documentUrl?: string;
  notes?: string;
}

export interface ComponentDimensioning {
  allocatedFte: number;
  unit?: string; // 'FTs' | 'FTEs' | 'Profissionais'
  referenceDate?: string;
  isEstimated?: boolean;
  source?: string;
  validationStatus?: 'estimado' | 'validado';
}

export interface ComponentResponsible {
  name: string;
  role?: string; // 'Dono do Domínio' | 'Process Owner' | 'Responsável Operacional' | 'Gestor da Unidade'
  title?: string; // Cargo
  email?: string;
}

export interface BpmnFlowStep {
  id: string;
  name: string;
  type: 'event_start' | 'activity' | 'gateway_exclusive' | 'gateway_parallel' | 'event_end';
  description?: string;
  system?: string;
  sla?: string;
  responsible?: string;
  status?: 'normal' | 'good' | 'risk';
  lane?: string;
}

export interface OperationalProcessDetail {
  id: string;
  name: string;
  description: string;
  code?: string;
  sopCode?: string;
  sopVersion?: string;
  responsible?: ComponentResponsible | string;
  businessUnit?: string;
  dimensioning?: ComponentDimensioning;
  validationConfidence?: number;
  revisionDate?: string;
  
  // BPMN model
  flowSteps: BpmnFlowStep[];
  exceptionsNote?: string;
  handoffsNote?: string;
  
  // Automação
  automationReadiness?: Array<{
    title: string;
    score: number;
    description: string;
    recommendation: string;
  }>;
  
  // Escopo & Contexto
  objective: string;
  outcome?: string;
  valueProposition?: string;
  trigger: string;
  closingCriteria: string;
  systemsUsed: string[];
  dataObjects: string[];
  policies: ArchitecturePolicyLink[];
  evidence?: string[];
  painPoints?: string[];
}


// ── 3. CONTEXTO DOS PROCESSOS ────────────────────────────────

export type SystemOperationType = 'leitura' | 'escrita' | 'cálculo' | 'aprovação' | 'consulta' | 'transferência' | 'integração';

export interface SystemUsage {
  systemName: string;
  operation: SystemOperationType;
  dataObjects: string[];
  dependencies: string[];
  isManual: boolean;
  validation?: ValidationMetadata;
}

export interface ProcessContextData {
  id: string;
  name: string;
  description: string;
  
  documentationStatus: 'pending' | 'in_progress' | 'approved';
  contextValidationStatus: 'unvalidated' | 'validating' | 'validated';
  
  responsible: string;
  area: string;
  
  systemsUsed: SystemUsage[];
  dataObjects: ValidatableString[];
  businessRules: ValidatableString[];
  regulations: ValidatableString[];
  painPoints: ValidatableString[];
  evidences: ValidatableString[];
  openQuestions: ValidatableString[];
  
  businessIndicators: BusinessIndicator[];
  contextIndicators: ContextIndicator[];
  
  relations: ProcessRelation[]; // Relações em que este processo é a origem
}


// ── 4. ARQUITETURA ───────────────────────────────────────────

export interface ArchBaseScopeFields {
  description?: string;
  objective?: string;
  valueProposition?: string;
  scopeBoundary?: string;
  startCondition?: string;
  endCondition?: string;
  inputs?: string;
  outputs?: string;
  stakeholders?: string;
  responsible?: string;
  responsibleDetail?: ComponentResponsible;
  businessUnit?: string;
  dimensioning?: ComponentDimensioning;
  lastUpdate?: string;
  policies?: ArchitecturePolicyLink[];
  explicitRelations?: ProcessRelation[];
  documentationStatus?: 'pending' | 'in_progress' | 'approved';
  contextValidationPercent?: number;
}

export interface ArchNodeL4 extends ArchBaseScopeFields {
  id: string;
  name: string;
  code?: string;
  processes: ProcessContextData[];
}

export interface ArchNodeL3 extends ArchBaseScopeFields {
  id: string;
  name: string;
  code?: string;
  childrenL4: ArchNodeL4[];
}

export interface ArchNodeL2 extends ArchBaseScopeFields {
  id: string;
  name: string;
  code?: string;
  childrenL3: ArchNodeL3[];
}

export interface ArchNodeL1 extends ArchBaseScopeFields {
  id: string;
  name: string;
  domain: string;
  code?: string;
  category?: 'PRIMARY' | 'SUPPORT';
  criticality?: 'Baixa' | 'Média' | 'Alta' | 'Crítica';
  mainKpi?: string;
  childrenL2: ArchNodeL2[];
}


// ── 5. JORNADAS ──────────────────────────────────────────────

export interface JourneyStepData {
  id: string;
  order: number;
  processId?: string; // Opcional (para testar etapa sem processo relacionado)
  stepName: string; 
  domain?: string;
  duration?: string;
  systemUsage?: SystemUsage;
  input?: string;
  output?: string;
  integrationStatus?: 'existing' | 'missing' | 'n/a';
}

export interface JourneyStepRelation {
  sourceStepId: string;
  targetStepId: string;
  type: ProcessRelationType;
}

export interface JourneyData {
  id: string;
  name: string;
  description: string;
  objective: string;
  triggerEvent?: string;       // Gatilho de início da jornada
  expectedOutcome?: string;    // Resultado esperado da entrega de valor
  mainDomain: string;
  domainRoles?: Record<string, 'principal' | 'participante' | 'suporte' | 'impactado'>;
  status: 'reference' | 'validating' | 'validated';
  owner?: string;
  leadTime?: string;           // Tempo total estimado da jornada
  totalCost?: string;          // Custo total estimado da jornada
  automationRate?: number;     // % de automação da jornada
  maturityRate?: number;       // % de processos validados/maduros
  integrationsCount?: number;  // Total de integrações mapeadas
  
  participatingProcessIds: string[];
  steps: JourneyStepData[];
  stepRelations: JourneyStepRelation[];
  
  coveredL1: string[];
  coveredL2: string[];
  coveredL3: string[];
  coveredL4: string[];
  
  systemsInvolved: string[];
  dataObjectsInvolved: string[];
  
  businessIndicators: BusinessIndicator[];
  contextIndicators: ContextIndicator[];
  
  gaps: ValidatableString[];
  suggestionConfidence?: number;
}

export interface ArchitectureData {
  domainsL1: ArchNodeL1[];
  journeys: JourneyData[];
}
