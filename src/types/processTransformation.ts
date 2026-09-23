export type TransformationStatus = 'draft' | 'in_analysis' | 'reviewed' | 'approved' | 'archived';
export type AnalysisStatus = 'draft' | 'ready' | 'processing' | 'completed';

export interface TransformationHypothesis {
  id: string;
  text: string;
  description?: string;
  author: string;
  date: string;
  status: 'pending' | 'validated' | 'discarded';
  expectedOutcome: string;
  relatedEntityId?: string; // ID of an activity or capability
  comments: string[];
}

export type InputCategory = 'restriction' | 'evidence' | 'external_reference' | 'norm' | 'policy' | 'opportunity' | 'tech_requirement' | 'premise';

export interface TransformationInput {
  id: string;
  title: string;
  url?: string;
  category: InputCategory;
  dateAdded: string;
  addedBy: string;
  description: string;
}

export interface UnderutilizationAlert {
  id: string;
  systemId: string;
  featureIdentified: string;
  currentProcess: string;
  potentialApplication: string;
  potentialBenefit: string;
  estimatedEffort: string;
  evidence: string;
  needsConfirmation: boolean;
  status: 'hypothesis' | 'validated' | 'discarded' | 'in_investigation';
}

export interface ValueOpportunity {
  id: string;
  dimension: string; // e.g. "Recuperação de valor", "Redução de custo", "Experiência"
  description: string;
  relatedActivityId?: string;
  valueLever: string;
  indicator: string;
  baseline: string; // E.g. "R$ 5M/mês" or "Não estimado — falta dado histórico validado"
  target: string;
  source: string;
  confidence: 'low' | 'medium' | 'high';
  dependencies: string[];
}

export interface ValueTreeNode {
  id: string;
  type: 'business_result' | 'value_dimension' | 'value_lever' | 'capability' | 'action' | 'technology' | 'indicator';
  description: string;
  expectedValue?: string;
  baseline?: string;
  target?: string;
  relatedActivityId?: string;
  requiredDataIds?: string[];
  possibleTechnology?: string;
  responsible?: string;
  dependencies?: string[]; // IDs of other nodes or gaps
  effort?: 'low' | 'medium' | 'high';
  impact?: 'low' | 'medium' | 'high';
  confidence?: 'low' | 'medium' | 'high';
  evidence?: string;
  childrenIds: string[];
}

export interface ModelRequirement {
  id: string;
  name: string;
  questionAnswered: string;
  dataUsed: string[];
  possibleModelType: string;
  dependencies: string[];
  evaluationMetric: string;
  updateFrequency: string;
  explainabilityNeeded: boolean;
  responsible: string;
  processUsage: string;
}

export type Swimlane = 'client' | 'person' | 'agent' | 'system' | 'integration' | 'control';

export interface ToBeActivity {
  id: string;
  originalActivityId?: string; // If mapped from AS-IS
  swimlane: Swimlane;
  code: string;
  name: string;
  executor: string; // Human, AI Agent, System
  objective: string;
  autonomyLevel: 1 | 2 | 3 | 4 | 5 | 6 | 7; // 1: Human exec, 2: Copilot rec, 3: Agent preps, 4: Agent exec w/ approval, 5: Autonomy in limits, 6: Deterministic, 7: System records
  type: 'support' | 'enabler' | 'control' | 'value_generator';
  isHighValueMine: boolean; // "Jazida de valor"
  valueMineDetails?: {
    reason: string;
    influencedResult: string;
    affectedDimension: string;
    requiredAnalysis: string;
    estimatedEffort: string;
    potentialReturn: string;
    missingData: string[];
    risks: string[];
    nextStep: string;
  };
  impactPotential: 'low' | 'medium' | 'high';
  transformationComplexity: 'low' | 'medium' | 'high';
  needsAnalytics: boolean;
  modelRequirement?: ModelRequirement;
  needsML: boolean;
  needsAgent: boolean;
  requiredData: string[];
  dependencies: string[];
  buildEffort: 'low' | 'medium' | 'high';
  potentialReturn: 'low' | 'medium' | 'high';
  priority: 'primary' | 'secondary' | 'quick_win' | 'complex';
  systemIds: string[];
  ruleIds: string[];
  controls: string[];
  exceptions: string[];
  statusChange: 'new' | 'modified' | 'moved' | 'deleted' | 'unchanged';
}

export interface AdherenceAndGovernance {
  policiesMet: string[];
  policiesPartiallyMet: string[];
  rulesWithoutNormativeSource: string[];
  existingControls: string[];
  missingControls: string[];
  decisionsWithoutExplicitCriteria: string[];
  exceptionsWithoutDefinedTreatment: string[];
}

export interface FoundationalGap {
  id: string;
  title: string;
  type: 'data' | 'integration' | 'system' | 'security' | 'policy' | 'governance' | 'people' | 'capability' | 'architecture' | 'metric' | 'change_management';
  criticality: 'blocker' | 'critical' | 'relevant';
  affectedInitiative: string;
  affectedToBeElementId?: string; // Link to ToBeActivity or ValueTreeNode
  enabledValue: string;
  impactIfNotResolved: string;
  responsible: string;
  dependencies: string[]; // Links to other gaps
  recommendedAction: string;
  completionCriteria: string;
  estimatedEffort: string;
  status: 'open' | 'in_progress' | 'resolved';
}

export interface ActionPlanWave {
  id: string;
  name: string; // e.g. "Onda 1 - Fundamentos"
  actions: ActionPlanTask[];
}

export interface ActionPlanTask {
  id: string;
  objective: string;
  benefit: string;
  relatedActivityId?: string;
  resolvesGapId?: string; // Link to gap
  responsible: string;
  dependencies: string[]; // Link to other actions
  effort: 'low' | 'medium' | 'high';
  estimatedTimeframe: string;
  successCriteria: string;
  indicator: string;
  risk: string;
  status: 'planned' | 'in_progress' | 'completed' | 'blocked';
}

export interface TransformationScenario {
  id: string;
  processId: string;
  name: string;
  description: string;
  status: TransformationStatus;
  analysisStatus: AnalysisStatus;
  baseContextVersion: string;
  dateAnalyzed?: string;
  
  hypotheses: TransformationHypothesis[];
  inputs: TransformationInput[];
  underutilizationAlerts: UnderutilizationAlert[];
  
  executiveSummary: {
    situation: string;
    currentSituationDetails: {
      expectedResult: string;
      mainCapabilities: string[];
      macroSteps: string[];
      criticalActivities: string[];
      systemsAndData: string[];
      mainRulesAndPolicies: string[];
      bottlenecks: string[];
      manualDependencies: string[];
      risks: string[];
      pointsWithoutEvidence: string[];
    };
    diagnosis: string;
    adherenceAndGovernance: AdherenceAndGovernance;
    valueOpportunities: ValueOpportunity[];
    recommendation: {
      centralProblem: string;
      recommendedChange: string;
      obtainableBenefits: string;
      activitiesConcentratingValue: string;
      blockingGaps: string;
      policiesToPreserveOrUpdate: string;
      confidenceLevel: string;
      executiveDecisionNeeded: string;
    }
  };
  
  valueTreeNodes: ValueTreeNode[];
  toBeActivities: ToBeActivity[];
  foundationalGaps: FoundationalGap[];
  actionPlanWaves: ActionPlanWave[];
}
