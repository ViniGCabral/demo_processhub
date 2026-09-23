import { JourneyCategory, JourneyStatus } from "@/types/journeyTypes";
import { AIMatchStatus } from "@/data/aiDiscoveryMock";

export type StudioMode = "manual" | "ai";
export type StudioStepNumber = 1 | 2;

export interface StudioJourneyMetadata {
  namePT: string;
  nameEN: string;
  description: string;
  category: JourneyCategory;
  status: JourneyStatus;
  owner: string;
  objective: string;
  triggerEvent: string;
  expectedOutcome: string;
  startProcess?: string;
  endProcess?: string;
  avgDuration?: string;
  slaTarget?: string;
}

export interface StudioFlowStep {
  id: string;
  order: number;
  stepName: string;
  processId?: string;
  processName?: string;
  domain?: string;
  level?: string;
  system?: string;
  hasDocumentation?: boolean;
  matchStatus?: AIMatchStatus;
  matchConfidence?: number;
  matchReason?: string;
  isProvisional?: boolean;
  notes?: string;
  userAction?: 'manter' | 'confirmar' | 'substituir' | 'remover' | 'criar_provisorio' | 'sem_vinculo' | 'pendente';
}

export interface StudioAIInput {
  prompt: string;
  domain?: string;
  objective?: string;
  systems?: string;
  context?: string;
}
