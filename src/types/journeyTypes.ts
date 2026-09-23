// Types for the Journey Module — Process Architecture Evolution
// A Journey represents an end-to-end flow that traverses multiple L4/L3/L2/L1 nodes,
// connecting processes in a sequence to deliver a business outcome.

export type JourneyCategory = 'customer' | 'operational' | 'compliance' | 'financial';
export type JourneyStatus = 'draft' | 'active' | 'archived';

export interface JourneyKPI {
  id: string;
  name: string;
  value: string;
  target?: string;
  unit?: string;
  trend?: 'up' | 'down' | 'stable';
}

export interface JourneyStep {
  id: string;
  order: number;
  processId: string;         // ID of the process in processStore
  processName: string;       // Denormalized for fast rendering
  l4Name?: string;           // L4 grouping this process belongs to
  l3Name?: string;
  l2Name?: string;
  l1Name?: string;
  actorRole?: string;        // Role/actor responsible at this step
  systemIds?: string[];      // Systems involved at this step
  notes?: string;
  estimatedDuration?: string; // e.g. "2h", "1 dia"
}

export interface Journey {
  id: string;
  name: string;
  namePT: string;
  nameEN: string;
  description?: string;
  category: JourneyCategory;
  status: JourneyStatus;
  owner?: string;
  triggerEvent?: string;      // What triggers this journey
  expectedOutcome?: string;   // Expected business outcome
  avgDuration?: string;       // Average end-to-end duration
  slaTarget?: string;         // SLA target for the journey
  steps: JourneyStep[];
  // Cross-cutting metadata (aggregated from participating processes)
  involvedL1Names?: string[];
  involvedSystems?: string[];
  kpis?: JourneyKPI[];
  createdAt?: string;
  updatedAt?: string;
}
