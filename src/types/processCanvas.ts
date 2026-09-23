export type EvidenceStatus = 'observed' | 'declared' | 'inferred' | 'validated';
export type DataInteractionType = 'receives' | 'reads' | 'creates' | 'updates' | 'sends' | 'archives';
export type IntegrationMechanism = 'manual' | 'api' | 'integration-layer' | 'file' | 'email' | 'rpa' | 'unknown';
export type HandoffType = 'human-to-human' | 'human-to-system' | 'system-to-human' | 'system-to-system';

export interface ProcessStage { id: string; processId: string; name: string; description?: string; order: number; ownerAreaId?: string; }
export interface ProcessActivity {
  id: string; processId: string; stageId: string; name: string; description?: string; order: number;
  actorIds: string[]; areaIds: string[]; systemIds: string[]; predecessorActivityIds?: string[];
  successorActivityIds?: string[]; evidenceIds?: string[]; evidenceStatus: EvidenceStatus;
}
export interface ProcessActor { id: string; name: string; role?: string; areaId?: string; }
export interface BusinessArea { id: string; name: string; description?: string; }
export interface ProcessSystem {
  id: string; name: string; description?: string; systemType?: 'core' | 'crm' | 'erp' | 'portal' | 'spreadsheet' | 'email' | 'document' | 'other';
  moduleOrScreen?: string; evidenceIds?: string[]; evidenceStatus: EvidenceStatus;
}
export interface ProcessDataObject {
  id: string; name: string; description?: string; category?: 'master-data' | 'transaction' | 'document' | 'status' | 'financial' | 'operational' | 'other';
  containsSensitiveData?: boolean; evidenceIds?: string[]; evidenceStatus: EvidenceStatus;
}
export interface ActivityDataInteraction {
  id: string; activityId: string; dataObjectId: string; systemId?: string; interactionType: DataInteractionType;
  notes?: string; evidenceIds?: string[]; evidenceStatus: EvidenceStatus;
}
export interface ProcessHandoff {
  id: string; fromActivityId: string; toActivityId: string; fromActorId?: string; toActorId?: string;
  fromSystemId?: string; toSystemId?: string; dataObjectIds?: string[]; handoffType: HandoffType;
  mechanism: IntegrationMechanism; notes?: string; evidenceIds?: string[]; evidenceStatus: EvidenceStatus;
}
export interface ProcessEvidence { id: string; type: 'video' | 'transcript' | 'screenshot' | 'sop' | 'document' | 'interview' | 'system-log'; title: string; reference?: string; notes?: string; }
export interface ProcessCanvas { id: string; processId: string; status: 'draft' | 'in_review' | 'validated'; updatedAt: string; stages: ProcessStage[]; activities: ProcessActivity[]; actors: ProcessActor[]; areas: BusinessArea[]; systems: ProcessSystem[]; dataObjects: ProcessDataObject[]; dataInteractions: ActivityDataInteraction[]; handoffs: ProcessHandoff[]; evidences: ProcessEvidence[]; }
