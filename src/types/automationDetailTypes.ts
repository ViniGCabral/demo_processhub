export type Classification = "ME" | "MS" | "MA" | "SA" | "AU" | "MNA";

export type TechnologyRole = "primary" | "alternative" | "fallback";

export type ValidationStatus = "needs_validation" | "validated" | "candidate" | "technically_validated";

export type ImplementationProfile = "quick_win" | "intermediate" | "transformative";

export type ImpactLevel = "incremental" | "relevant" | "transformative" | "not_assessed";

export type SolutionStatus =
  | "future_state_proposal"
  | "needs_validation"
  | "technically_validated"
  | "insufficient_data";

export type TechnologyFamily =
  | "spreadsheet_automation"
  | "data_transformation"
  | "rpa"
  | "workflow"
  | "system_integration"
  | "decision_rules"
  | "monitoring"
  | "document_management"
  | "ai_assistance"
  | "other";

export interface TechnologyOption {
  id?: string;
  name: string;
  family?: TechnologyFamily;
  roleDescription?: string;
  whyConsidered?: string;
  whenItMakesSense?: string;
  status?: "candidate" | "needs_validation" | "technically_validated";
  limitations?: string[];
  // Legacy / fallback compatibility:
  role?: TechnologyRole;
  rationale?: string;
  validationStatus?: ValidationStatus;
}

export type EffortLevel = "not_applicable" | "low" | "medium" | "high" | "very_high";
export type EffortConfidence = "low" | "medium" | "high";

export interface EffortEstimate {
  level: EffortLevel;
  score?: number;
  confidence: EffortConfidence;
  drivers: string[];
  unknowns: string[];
}

export interface ImplementationPath {
  id: string;
  profile: ImplementationProfile;
  name: string;
  description: string;
  whenItMakesSense: string;
  benefits: string[];
  effort: EffortEstimate;
  technologies: TechnologyOption[];
  validations: string[];
  mechanism?: string; // Ex: Tabela de decisão como mecanismo de regras
}

export interface MacroBlock {
  id: string;
  order: number;
  number?: string;
  name: string;
  description?: string;
  objective?: string;
  stepCount: number;
  inputs?: string;
  outputs?: string;
  supportingAgents?: string[];
  stepIds?: string[];
  solutionIds?: string[];
  /** Short contextual cards to display inside the framework strip (instead of step titles) */
  contextCards?: string[];
}

export interface ProcessStepSubstep {
  id: string; // Ex: "05.1", "05.2"
  sourceRef?: string;
  description: string;
  title?: string;
  classification?: Classification | string;
}

export interface StepEvidence {
  rawDescription?: string;
  sourceReference?: string;
  systemsMentioned?: string[];
  inputs?: string[];
  outputs?: string[];
  stakeholders?: string[];
}

export interface StepAIInterpretation {
  classificationRationale?: string;
  macroBlockRationale?: string;
  workPatternIdentified?: string;
  evidenceNotes?: string;
}

export interface StepHumanInTheLoop {
  hasHumanControl: boolean;
  summary: string;
  mandatoryApproval?: boolean;
  technicalDecision?: boolean;
  exceptionHandling?: boolean;
  sensitiveActionPause?: boolean;
  details?: string;
}

export interface ProcessStepDetail {
  id: string; // Ex: "01", "1.1.1", "step-01"
  number?: string;
  sourceRef?: string;
  sourceStep?: string;
  title: string;
  description: string;
  classification: Classification | string;
  classifications?: (Classification | string)[];
  macroBlockId: string;
  macroBlockName?: string;
  substeps?: ProcessStepSubstep[];
  capabilityId?: string;
  capabilityName?: string;
  solutionId?: string;
  solutionIds?: string[];
  solutionName?: string;
  technologyType?: string; // "Agentes" | "RPA" | "Workflows" | "Integrações" | "Motores de regras" | "Automação de planilha" | "Humano"
  technology?: string; // Legado
  technologyOptions?: TechnologyOption[];
  rationale?: string;
  evidence?: StepEvidence;
  aiInterpretation?: StepAIInterpretation;
  effort?: EffortEstimate;
  humanInTheLoop?: StepHumanInTheLoop;
  humanControl?: {
    required: boolean;
    description: string;
  };
}

export interface SolutionImpact {
  level: ImpactLevel;
  rationale?: string;
}

export interface SolutionRecommendation {
  id: string;
  macroBlockId: string;
  macroBlockName?: string;
  capabilityId: string;
  capabilityName: string;
  name: string;
  description: string;
  stepIds: string[];
  technologyType?: string; // "Agentes" | "RPA" | "Workflows" | "Integrações" | "Motores de regras" | "Automação de planilha" | "Humano"
  whySelected?: string;
  evidence?: string[];
  status: SolutionStatus;
  humanInTheLoop?: {
    hasHumanControl: boolean;
    description: string;
    level?: "yes" | "no" | "partial";
  };
  impact?: SolutionImpact;
  implementationPaths?: ImplementationPath[];
  // Campos de compatibilidade / legado:
  technologyOptions: TechnologyOption[];
  effort?: EffortEstimate;
}

export interface DigitalLayerOrchestrator {
  id: string;
  name: string;
  transversal: boolean;
  startMacroBlockId: string;
}

export interface DigitalLayerIntegration {
  id: string;
  name: string;
  transversal: boolean;
  technologyTypes: string[];
}

export interface DigitalLayerAnomaly {
  id: string;
  name: string;
  transversal: boolean;
  afterMacroBlockIds: string[];
  exceptionMacroBlockId: string;
  codificationMacroBlockId: string;
}

export interface ProcessDigitalLayers {
  orchestrator?: DigitalLayerOrchestrator;
  integrationLayer?: DigitalLayerIntegration;
  anomalyDetection?: DigitalLayerAnomaly;
}

export interface HumanControlItem {
  id: string;
  label: string;
  macroBlockIds: string[];
}

export interface ProcessAutomationDetailData {
  processId: string;
  processName: string;
  sopCode?: string;
  sopTitle?: string;
  summaryText?: string;
  volumetrySummary?: string;
  macroBlocks: MacroBlock[];
  steps: ProcessStepDetail[];
  solutions: SolutionRecommendation[];
  digitalLayers?: ProcessDigitalLayers;
  humanControls?: HumanControlItem[];
  isDemoMode?: boolean;
}
