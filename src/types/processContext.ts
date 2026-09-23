// Types for the Process Context Module (Contextus)

export type EvidenceNature = 'observed' | 'declared' | 'inferred' | 'confirmed';
export type EvidenceStatus = 'declared' | 'observed' | 'inferred' | 'confirmed' | 'conflicting';

export type QuestionStatus = 'suggested' | 'pending' | 'answered' | 'awaiting_validation' | 'confirmed' | 'unknown' | 'contested' | 'deferred';

export type TransferMechanism = 'manual' | 'file_export_import' | 'direct_api' | 'scheduled_batch' | 'unknown';

export type RuleType = 'formal_policy' | 'reported_practice' | 'expert_heuristic';

export type TShapedStatus = 'suggested' | 'confirmed_focus' | 'dismissed';

export type ReadinessScope = 'operational_docs' | 'hypothesis_exploration' | 'structured_redesign' | 'financial_gain_quant' | 'ai_agents';

export interface ContextEvidence {
  id: string;
  type: 'video_clip' | 'transcript_excerpt' | 'document' | 'screen_capture' | 'human_confirmation';
  sourceTitle: string;
  sourceReference: string; // e.g. "Vídeo de execução aos 04:18" or "Manual Normativo TI-04"
  snippet?: string;
  authorOrSpeaker?: string;
  recordedAt: string;
  nature: EvidenceNature;
  confidenceScore?: number; // 0-100
}

export interface ContextRule {
  id: string;
  title: string;
  description: string;
  ruleType: RuleType;
  source: string;
  responsibleRole?: string;
  effectiveDate?: string;
  evidenceId?: string;
  isConfirmed: boolean;
}

export type RuleStatus = 'suggested' | 'in_validation' | 'active' | 'suspended' | 'expired' | 'superseded';

export interface ContextPolicy {
  id: string;
  code: string;
  title: string;
  version: string;
  previousVersion?: string;
  effectiveDate: string;
  expiryDate?: string;
  responsibleRole: string;
  summary: string;
  sourceDocument: string;
  status: 'active' | 'superseded' | 'draft';
}

export interface BusinessRule {
  id: string;
  code: string;
  name: string;
  description: string;
  policyId?: string; // If absent, registers a formal policy gap / governance risk
  policyTitle?: string;
  policyVersion?: string;
  evidenceSection?: string;
  processId: string;
  activityIds: string[];
  decisionId: string;
  requiredDataFieldIds: string[];
  conditionExpression: string;
  resultingAction: string;
  authorityLimits: string;
  exceptions?: string[];
  missingDataTreatment: string;
  scope: string;
  responsibleRole: string;
  effectiveDate: string;
  expiryDate?: string;
  status: RuleStatus;
  dependentAgents: string[];
  dependentAutomations: string[];
  hasPolicyGap?: boolean;
}

export interface PolicyImpactSimulation {
  policyId: string;
  policyTitle: string;
  currentVersion: string;
  proposedVersion: string;
  changeSummary: string;
  affectedRules: string[];
  affectedProcesses: string[];
  affectedActivities: string[];
  affectedAgents: string[];
  pendingActionItems: string[];
  confirmationRequiredRoles: string[];
}

export interface AgentContextSpecification {
  agentName: string;
  role: string;
  governingPolicies: string[];
  activeRules: string[];
  strictAuthorityLimits: string;
  requiredDataContract: string[];
  humanEscalationTriggers: string[];
}

export interface ContextDecision {
  id: string;
  title: string;
  question: string;
  inputDataIds: string[];
  criteria: string[];
  possibleOutcomes: string[];
  responsibleRole: string;
  handlingMissingInfo: string;
  rules: ContextRule[];
  associatedBusinessRuleId?: string;
  policyReference?: string;
  authorityThreshold?: string;
  evidenceId?: string;
  status: QuestionStatus;
}

export interface ContextField {
  name: string;
  description: string;
  exampleValue?: string;
  isRequired: boolean;
  isKeyIdentifier?: boolean;
}

export interface ContextDataObject {
  id: string;
  name: string;
  businessMeaning: string;
  collectionOrFormat: string; // e.g., "Planilha Excel (.xlsx)", "Tabela de Pedidos SAP", "JSON / REST"
  essentialFields: ContextField[];
  sourceActivityId?: string;
  targetActivityIds: string[];
  transferMechanism: TransferMechanism;
  transferDetails?: string;
  refreshRequirement?: string; // e.g., "Diário às 08h", "Em tempo real"
  qualityRules?: string[];
  knownOwner?: string;
  evidenceId?: string;
  validationStatus: EvidenceStatus;
}

export interface ContextSystemOperation {
  name: string;
  description: string;
  operationType: 'read' | 'write' | 'calculate' | 'approve' | 'export' | 'import';
}

export interface ContextSystem {
  id: string;
  name: string;
  purpose: string;
  category: 'erp_core' | 'internal_portal' | 'spreadsheet' | 'ticketing' | 'messaging' | 'external_vendor';
  moduleOrInterface?: string;
  operations: ContextSystemOperation[];
  associatedActivityIds: string[];
  dataObjectIds: string[];
  couplingType: TransferMechanism;
  limitations?: string[];
  evidenceId?: string;
  validationStatus: EvidenceStatus;
}

export interface ContextCapability {
  id: string;
  code: string;
  name: string;
  description: string;
  strategicObjective: string;
  maturityLevel: 'initial' | 'structured' | 'optimized';
}

export interface ContextActivity {
  id: string;
  code: string;
  name: string;
  description: string;
  stageId: string;
  capabilityIds: string[];
  executorRole: string;
  systemIds: string[];
  consumedDataIds: string[];
  producedDataIds: string[];
  decisions: ContextDecision[];
  exceptionsNotes?: string;
  evidenceId?: string;
  validationStatus: EvidenceStatus;
}

export interface TShapedRecommendation {
  id: string;
  stageId: string;
  capabilityId: string;
  title: string;
  expectedContribution: string;
  investigationRationale: string;
  availableEvidences: string[];
  uncertainties: string[];
  investigativeQuestions: string[];
  status: TShapedStatus;
}

export interface ContextQuestion {
  id: string;
  targetEntity: 'activity' | 'data' | 'system' | 'decision' | 'rule' | 'handoff';
  targetId: string;
  targetName: string;
  questionText: string;
  sourceContext: string;
  aiUnderstanding: string;
  rationaleWhyItMatters: string;
  suggestedAnswer?: string;
  currentAnswer?: string;
  suggestedResponseOptions?: string[];
  probableResponsible: string;
  impactOnUseCases: string[];
  status: QuestionStatus;
  userNote?: string;
  delegatedTo?: string;
  attachedEvidence?: string;
  respondedAt?: string;
  validatedBy?: string;
  validatedAt?: string;
}

export interface ContextStage {
  id: string;
  order: number;
  name: string;
  description: string;
  capabilityIds: string[];
  activityIds: string[];
  externalInputs?: string[];
  externalDeliverables?: string[];
  hasPendingQuestions?: boolean;
}

export interface UseCaseRequirement {
  id: string;
  title: string;
  description: string;
  isMet: boolean;
  blockingQuestionId?: string;
  responsibleArea: string;
}

export interface UseCaseReadiness {
  scope: ReadinessScope;
  label: string;
  description: string;
  scorePercentage: number;
  status: 'ready' | 'partially_ready' | 'blocked';
  requirements: UseCaseRequirement[];
}

export interface ContextVersion {
  version: string;
  date: string;
  author: string;
  summary: string;
  pendingCount: number;
  confirmedCount: number;
  isCurrent: boolean;
}

export interface ProcessContextModel {
  processId: string;
  processName: string;
  valueProposition: string; // Valor pretendido
  expectedOutcome: string;  // Resultado observável esperado
  currentVersion: string;
  updatedAt: string;
  
  stages: ContextStage[];
  capabilities: ContextCapability[];
  activities: ContextActivity[];
  dataObjects: ContextDataObject[];
  systems: ContextSystem[];
  decisions: ContextDecision[];
  rules: ContextRule[];
  policies: ContextPolicy[];
  businessRules: BusinessRule[];
  policySimulations?: PolicyImpactSimulation[];
  agentContexts?: AgentContextSpecification[];
  tShapedRecommendations: TShapedRecommendation[];
  questions: ContextQuestion[];
  evidences: ContextEvidence[];
  useCaseReadiness: UseCaseReadiness[];
  versionsHistory: ContextVersion[];
}

// ====================================================================
// NEW TYPES — Redesigned Context Tab (Specification & Validation)
// ====================================================================

export type GapStatus =
  | 'open'
  | 'awaiting_response'
  | 'answered'
  | 'in_review'
  | 'confirmed'
  | 'rejected'
  | 'not_applicable'
  | 'reopened';

export interface GapResponse {
  id: string;
  answer: string;
  respondedBy: string;
  respondedAt: string;
  note?: string;
}

export interface GapImpactPreview {
  itemId: string;      // RF-xxx or RN-xxx
  itemType: 'rf' | 'rn';
  itemTitle: string;
  fieldChanged: string;
  before: string;
  after: string;
}

export interface ContextGap {
  id: string;             // "GAP-001"
  title: string;
  question: string;
  explanation: string;
  whyNeeded: string;
  impact: 'high' | 'medium' | 'low';
  affectedRFIds: string[];
  affectedRNIds: string[];
  relatedStageId: string;
  suggestedResponsible: string;
  status: GapStatus;
  responseOptions?: string[];
  currentAnswer?: string;
  responseHistory: GapResponse[];
  impactPreview?: GapImpactPreview[];
  updatedAt: string;
}

export type SpecItemStatus =
  | 'draft'
  | 'in_validation'
  | 'confirmed'
  | 'pending_gap'
  | 'updated'
  | 'deprecated';

export interface ChangeRecord {
  id: string;
  date: string;
  author: string;
  fieldChanged: string;
  previousValue: string;
  newValue: string;
  originGapId?: string;
  approvedBy?: string;
}

export interface FunctionalRequirement {
  id: string;             // "RF-001"
  title: string;
  description: string;
  objective: string;
  relatedStageId: string;
  actor: string;
  inputs: string[];
  expectedOutput: string;
  exceptions: string[];
  acceptanceCriteria: string[];
  relatedRNIds: string[];
  relatedGapIds: string[];
  validationStatus: SpecItemStatus;
  changeHistory: ChangeRecord[];
}

export interface BusinessRuleSpec {
  id: string;             // "RN-001"
  title: string;
  statement: string;
  condition: string;
  expectedBehavior: string;
  exceptions: string[];
  relatedStageId: string;
  relatedRFIds: string[];
  relatedGapIds: string[];
  acceptanceCriteria: string[];
  status: SpecItemStatus;
  changeHistory: ChangeRecord[];
}

export interface ProcessMacroStage {
  id: string;
  order: number;
  name: string;
  description: string;
  rfIds: string[];
  rnIds: string[];
  gapIds: string[];
  hasHumanDecision: boolean;
  hasExceptions: boolean;
}

export type SpecificationStatus =
  | 'draft'
  | 'in_validation'
  | 'ready_for_approval'
  | 'approved'
  | 'superseded'
  | 'archived';

export interface SpecificationModel {
  status: SpecificationStatus;
  version: string;
  lastUpdatedBy: string;
  lastUpdatedAt: string;
  approvedBy?: string;
  approvedAt?: string;
}

export interface ContextSpecData {
  processId: string;
  processName: string;
  specification: SpecificationModel;
  gaps: ContextGap[];
  functionalRequirements: FunctionalRequirement[];
  businessRules: BusinessRuleSpec[];
  macroStages: ProcessMacroStage[];
}
