// BPMN Editor Types

export type EditorMode = "viewer" | "editor";

export type VersionStatus = "Published" | "Draft" | "Archived";

export interface Version {
  id: string;
  label: string;
  date: string;
  status: VersionStatus;
}

export type BPMNElementType = 
  | "start-event"
  | "start-event-message"
  | "start-event-timer"
  | "end-event"
  | "end-event-message"
  | "intermediate-event"
  | "task"
  | "send-task"
  | "receive-task"
  | "user-task"
  | "manual-task"
  | "sub-process"
  | "call-activity"
  | "gateway-exclusive"
  | "gateway-inclusive"
  | "gateway-parallel"
  | "gateway-event"
  | "gateway-complex"
  | "sequence-flow"
  | "message-flow"
  | "association"
  | "data-object"
  | "data-store"
  | "text-annotation"
  | "group"
  | "pool"
  | "lane";

export interface BPMNElement {
  id: string;
  type: BPMNElementType;
  x: number;
  y: number;
  width: number;
  height: number;
  label: string;
  documentation?: string;
  fillColor?: string;
  strokeColor?: string;
  textColor?: string;
  linkedPOPStep?: string;
  rotation?: number;
}

export interface BPMNConnection {
  id: string;
  type: "sequence-flow" | "message-flow" | "association";
  sourceId: string;
  targetId: string;
  sourcePoint: { x: number; y: number };
  targetPoint: { x: number; y: number };
  waypoints?: { x: number; y: number }[];
  label?: string;
}

export interface BPMNPhase {
  id: string | number;
  label: string;
  y: number;
  height: number;
  color: string;
}

export interface BPMNDiagram {
  elements: BPMNElement[];
  connections: BPMNConnection[];
}

export interface PaletteItem {
  id: BPMNElementType;
  label: string;
  icon: string;
  category: string;
}

export interface HistoryState {
  diagram: BPMNDiagram;
  timestamp: number;
}
