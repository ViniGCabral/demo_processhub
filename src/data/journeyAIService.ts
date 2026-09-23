// AI Service Stub for Journey generation.
// All functions return deterministic results based on mock data.
// Replace these implementations with real API calls when integrating actual AI.

import type { Journey, JourneyStep } from '@/types/journeyTypes';

const generateId = () => Math.random().toString(36).substr(2, 9);

/**
 * Simulates AI-powered journey generation from a set of selected processes.
 * Returns a Promise to match future async API integration patterns.
 *
 * @param processes — Array of { id, name, l1, l2, l3, l4, executor }
 * @returns A draft Journey with the processes arranged as sequential steps.
 */
export async function generateJourneyFromProcesses(
  processes: Array<{
    id: string;
    name: string;
    l1?: string;
    l2?: string;
    l3?: string;
    l4?: string;
    executor?: string;
    systems?: string[];
  }>
): Promise<Journey> {
  // Simulate AI processing time
  await new Promise((resolve) => setTimeout(resolve, 1500));

  const steps: JourneyStep[] = processes.map((p, idx) => ({
    id: generateId(),
    order: idx + 1,
    processId: p.id,
    processName: p.name,
    l4Name: p.l4,
    l3Name: p.l3,
    l2Name: p.l2,
    l1Name: p.l1,
    actorRole: p.executor || 'A definir',
    systemIds: p.systems || [],
    notes: '',
    estimatedDuration: '',
  }));

  const involvedL1Names = [...new Set(processes.map((p) => p.l1).filter(Boolean))] as string[];
  const involvedSystems = [...new Set(processes.flatMap((p) => p.systems || []))];

  const journeyId = generateId();
  return {
    id: journeyId,
    name: `Jornada Gerada — ${processes.length} processos`,
    namePT: `Jornada Gerada — ${processes.length} processos`,
    nameEN: `Generated Journey — ${processes.length} processes`,
    description: `Jornada gerada automaticamente a partir de ${processes.length} processos selecionados, cruzando ${involvedL1Names.length} cadeia(s) de valor.`,
    category: 'operational',
    status: 'draft',
    owner: '',
    triggerEvent: '',
    expectedOutcome: '',
    avgDuration: '',
    slaTarget: '',
    steps,
    involvedL1Names,
    involvedSystems,
    kpis: [],
    createdAt: new Date().toISOString().slice(0, 10),
    updatedAt: new Date().toISOString().slice(0, 10),
  };
}

/**
 * Simulates AI-powered suggestion of next steps for a journey.
 * Returns a small set of mock process suggestions.
 *
 * @param _journeyId — The journey to suggest steps for (unused in stub)
 * @param existingProcessNames — Names of processes already in the journey
 * @returns Array of suggested JourneyStep stubs
 */
export async function suggestJourneySteps(
  _journeyId: string,
  existingProcessNames: string[]
): Promise<JourneyStep[]> {
  // Simulate AI processing time
  await new Promise((resolve) => setTimeout(resolve, 1200));

  // Deterministic suggestions based on what's already in the journey
  const suggestions: JourneyStep[] = [];

  if (!existingProcessNames.includes('Quality Control')) {
    suggestions.push({
      id: generateId(),
      order: 0, // Will be assigned proper order by the caller
      processId: '',
      processName: 'Quality Control',
      l3Name: 'Inspection',
      l2Name: 'Quality',
      l1Name: 'Operations',
      actorRole: 'Quality Analyst',
      systemIds: ['SAP QM'],
      notes: 'Sugestão de IA: Adicionar verificação de qualidade ao fluxo',
    });
  }

  if (!existingProcessNames.includes('Budget Approval')) {
    suggestions.push({
      id: generateId(),
      order: 0,
      processId: '',
      processName: 'Budget Approval',
      l4Name: 'Multi-level',
      l3Name: 'Approval',
      l2Name: 'Budget',
      l1Name: 'Finance',
      actorRole: 'Financial Analyst',
      systemIds: ['SAP FI'],
      notes: 'Sugestão de IA: Fluxo requer aprovação financeira',
    });
  }

  if (!existingProcessNames.includes('Incident Management')) {
    suggestions.push({
      id: generateId(),
      order: 0,
      processId: '',
      processName: 'Incident Management',
      l4Name: 'Resolution',
      l3Name: 'Incidents',
      l2Name: 'Support',
      l1Name: 'IT Services',
      actorRole: 'IT Analyst',
      systemIds: ['ServiceNow'],
      notes: 'Sugestão de IA: Considerar gestão de incidentes no fluxo',
    });
  }

  return suggestions.slice(0, 2);
}
