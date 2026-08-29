export type AcademyRole = "manager" | "learner";

export type TrainingStatus =
  | "Não iniciado"
  | "Em andamento"
  | "Aguardando quiz"
  | "Reforço necessário"
  | "Concluído"
  | "Atrasado";

export interface TrainingProcess {
  id: string;
  name: string;
  code: string;
  area: string;
  valueChain: string;
  owner: string;
  sopVersion: string;
  updatedAt: string;
  minutes: number;
  objective: string;
  expectedResult: string;
  systems: string[];
  required: boolean;
  status: TrainingStatus;
  progress: number;
  score?: number;
}

export interface Participant {
  id: string;
  name: string;
  role: string;
  area: string;
  email: string;
  progress: number;
  score?: number;
  status: TrainingStatus;
  lastActivity: string;
}

export interface TrainingGroup {
  id: string;
  name: string;
  description: string;
  role: string;
  department: string;
  objective: string;
  owner: string;
  status: "Rascunho" | "Publicado" | "Suspenso" | "Arquivado";
  dueDate: string;
  passingScore: number;
  maxAttempts: number;
  allowRetries: boolean;
  requireReading: boolean;
  requireAcknowledgment: boolean;
  requireQuiz: boolean;
  issueCertificate: boolean;
  participantIds: string[];
  processIds: string[];
}

export interface PersonalNote {
  id: string;
  processId: string;
  processName: string;
  step?: string;
  category: "Importante" | "Dúvida" | "Lembrete";
  content: string;
  pinned: boolean;
  sopVersion: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProcessProgress {
  processId: string;
  progress: number;
  understoodSteps: number[];
  readingCompleted: boolean;
  acknowledged: boolean;
  quizScore?: number;
  quizPassed: boolean;
  attempts: number;
  completedAt?: string;
}

export interface QuizQuestionContent {
  id: string;
  statement: string;
  options: string[];
  correct: number;
  explanation: string;
  reference: string;
}

export interface ProcessLearningContent {
  processId: string;
  overview: {
    objective: string;
    expectedResult: string;
    frequency: string;
    userRole: string;
    systems: string;
    inputs: string;
    outputs: string;
    averageTime: string;
  };
  beforeYouStart: string[];
  attentionPoints: Array<{ title: string; description: string }>;
  operationalSummary: {
    essentials: string;
    owners: string;
    systems: string;
    approvals: string;
    evidence: string;
    finalChecklist: string[];
  };
  questions: QuizQuestionContent[];
  updatedAt: string;
}
