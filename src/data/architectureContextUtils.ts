import { 
  ArchitectureData, ProcessContextData, JourneyData, ArchNodeL1, ArchNodeL2, ArchNodeL3, ArchNodeL4, BusinessIndicator, DomainAlert,
  OperationalProcessDetail
} from '../types/architectureContextTypes';
import { mockOperationalProcessDetails } from './architectureContextMock';

/**
 * Utilitários para manipular a camada centralizada de dados mockados
 * de Arquitetura e Contexto de Processos.
 */

// --- BUSCAS BÁSICAS ---

/** Localizar nó L1 por ID ou Nome com tolerância */
export function findDomainNode(archData: ArchitectureData, identifier: string): ArchNodeL1 | undefined {
  if (!identifier) return undefined;
  const term = identifier.toLowerCase().trim();
  return archData.domainsL1.find(d => 
    d.id.toLowerCase() === term || 
    d.name.toLowerCase() === term ||
    d.name.toLowerCase().includes(term) ||
    term.includes(d.name.toLowerCase())
  );
}

/** Buscar todos os processos pertencentes a um determinado L4 */
export function getProcessesByL4(archData: ArchitectureData, l4Id: string): ProcessContextData[] {
  for (const l1 of archData.domainsL1) {
    for (const l2 of l1.childrenL2) {
      for (const l3 of l2.childrenL3) {
        for (const l4 of l3.childrenL4) {
          if (l4.id === l4Id) {
            return l4.processes;
          }
        }
      }
    }
  }
  return [];
}

/** Buscar processo por ID em toda a arquitetura */
export function getProcessById(archData: ArchitectureData, processId: string): ProcessContextData | undefined {
  for (const l1 of archData.domainsL1) {
    for (const l2 of l1.childrenL2) {
      for (const l3 of l2.childrenL3) {
        for (const l4 of l3.childrenL4) {
          const process = l4.processes.find(p => p.id === processId);
          if (process) return process;
        }
      }
    }
  }
  return undefined;
}

/** Buscar todas as jornadas em que um dado processo participa */
export function getJourneysByProcess(archData: ArchitectureData, processId: string): JourneyData[] {
  return archData.journeys.filter(j => j.participatingProcessIds.includes(processId));
}

// --- CONSOLIDAÇÃO DE NÍVEIS E SISTEMAS ---

/** Calcular e consolidar quais L1, L2, L3 e L4 uma jornada cruza dinamicamente baseada nos seus processos */
export function calculateJourneyCoverage(archData: ArchitectureData, journey: JourneyData) {
  const coveredL1 = new Set<string>();
  const coveredL2 = new Set<string>();
  const coveredL3 = new Set<string>();
  const coveredL4 = new Set<string>();

  for (const l1 of archData.domainsL1) {
    for (const l2 of l1.childrenL2) {
      for (const l3 of l2.childrenL3) {
        for (const l4 of l3.childrenL4) {
          const hasParticipatingProcess = l4.processes.some(p => journey.participatingProcessIds.includes(p.id));
          if (hasParticipatingProcess) {
            coveredL1.add(l1.name);
            coveredL2.add(l2.name);
            coveredL3.add(l3.name);
            coveredL4.add(l4.name);
          }
        }
      }
    }
  }

  return {
    l1: Array.from(coveredL1),
    l2: Array.from(coveredL2),
    l3: Array.from(coveredL3),
    l4: Array.from(coveredL4)
  };
}

/** Consolidar todos os sistemas utilizados pelos processos dentro de um Domínio (L1) específico */
export function getSystemsByDomain(archData: ArchitectureData, l1IdOrName: string): string[] {
  const systems = new Set<string>();
  const l1 = findDomainNode(archData, l1IdOrName);
  if (!l1) return [];

  const addSystemsFromProcess = (p: ProcessContextData) => p.systemsUsed.forEach(s => systems.add(s.systemName));

  l1.childrenL2.forEach(l2 => {
    l2.childrenL3.forEach(l3 => {
      l3.childrenL4.forEach(l4 => {
        l4.processes.forEach(addSystemsFromProcess);
      });
    });
  });

  return Array.from(systems);
}

/** Consolidar sistemas envolvidos em uma jornada específica */
export function getSystemsByJourney(journey: JourneyData): string[] {
  const systems = new Set<string>(journey.systemsInvolved);
  journey.steps.forEach(step => {
    if (step.systemUsage) systems.add(step.systemUsage.systemName);
  });
  return Array.from(systems);
}

// --- INDICADORES E COBERTURA ---

/** Calcular indicadores gerais de cobertura da arquitetura */
export function getArchitectureCoverageIndicators(archData: ArchitectureData) {
  let totalProcesses = 0;
  let processesWithDocs = 0;
  let processesValidated = 0;

  archData.domainsL1.forEach(l1 => {
    l1.childrenL2.forEach(l2 => {
      l2.childrenL3.forEach(l3 => {
        l3.childrenL4.forEach(l4 => {
          l4.processes.forEach(p => {
            totalProcesses++;
            if (p.documentationStatus === 'approved') processesWithDocs++;
            if (p.contextValidationStatus === 'validated') processesValidated++;
          });
        });
      });
    });
  });

  return {
    totalProcesses,
    docCoveragePercent: totalProcesses ? (processesWithDocs / totalProcesses) * 100 : 0,
    validationCoveragePercent: totalProcesses ? (processesValidated / totalProcesses) * 100 : 0
  };
}

/** Obter todos os indicadores de negócio atrelados aos processos de um domínio inteiro (L1) */
export function getBusinessIndicatorsByDomain(archData: ArchitectureData, l1IdOrName: string): BusinessIndicator[] {
  const indicatorsMap = new Map<string, BusinessIndicator>();
  const l1 = findDomainNode(archData, l1IdOrName);
  if (!l1) return [];

  l1.childrenL2.forEach(l2 => {
    l2.childrenL3.forEach(l3 => {
      l3.childrenL4.forEach(l4 => {
        l4.processes.forEach(p => {
          p.businessIndicators.forEach(ind => {
            if (!indicatorsMap.has(ind.id)) {
              indicatorsMap.set(ind.id, ind);
            }
          });
        });
      });
    });
  });

  return Array.from(indicatorsMap.values());
}

/** Gerar alertas acionáveis específicos para um domínio L1 */
export function getDomainAlerts(archData: ArchitectureData, l1IdOrName: string): DomainAlert[] {
  const l1 = findDomainNode(archData, l1IdOrName);
  if (!l1) return [];

  const alerts: DomainAlert[] = [];

  l1.childrenL2.forEach(l2 => {
    l2.childrenL3.forEach(l3 => {
      l3.childrenL4.forEach(l4 => {
        l4.processes.forEach(p => {
          // Processo sem documentação aprovada
          if (p.documentationStatus !== 'approved') {
            alerts.push({
              id: `alert-doc-${p.id}`,
              type: 'process_no_doc',
              title: `Documentação pendente: ${p.name}`,
              description: `O processo está em status "${p.documentationStatus === 'in_progress' ? 'Em elaboração' : 'Pendente'}" e requer aprovação formal.`,
              severity: 'medium',
              targetType: 'process',
              targetId: p.id,
              targetName: p.name
            });
          }

          // Processo com contexto não validado
          if (p.contextValidationStatus !== 'validated') {
            alerts.push({
              id: `alert-ctx-${p.id}`,
              type: 'process_pending_context',
              title: `Contexto não validado: ${p.name}`,
              description: `As regras de negócio e dependências deste processo ainda não foram validadas pelo especialista.`,
              severity: 'low',
              targetType: 'process',
              targetId: p.id,
              targetName: p.name
            });
          }

          // Dependência de planilha / uso manual
          const manualSpreadsheet = p.systemsUsed.find(s => s.isManual || s.systemName.toLowerCase().includes('planilha') || s.systemName.toLowerCase().includes('excel'));
          if (manualSpreadsheet) {
            alerts.push({
              id: `alert-sheet-${p.id}`,
              type: 'manual_spreadsheet_dependency',
              title: `Risco Operacional: Dependência de Planilhas em ${p.name}`,
              description: `Operação manual identificada via ${manualSpreadsheet.systemName}. Recomenda-se automação ou integração ao ERP.`,
              severity: 'high',
              targetType: 'system',
              targetId: p.id,
              targetName: manualSpreadsheet.systemName
            });
          }

          // Dúvidas abertas
          if (p.openQuestions && p.openQuestions.length > 0) {
            alerts.push({
              id: `alert-question-${p.id}`,
              type: 'open_question',
              title: `Dúvida em aberto no processo ${p.name}`,
              description: p.openQuestions[0].value,
              severity: 'low',
              targetType: 'process',
              targetId: p.id,
              targetName: p.name
            });
          }
        });
      });
    });
  });

  return alerts;
}

/** Filtrar processos que requerem atenção */
export function getProcessesNeedingAttention(archData: ArchitectureData): ProcessContextData[] {
  const results: ProcessContextData[] = [];

  archData.domainsL1.forEach(l1 => {
    l1.childrenL2.forEach(l2 => {
      l2.childrenL3.forEach(l3 => {
        l3.childrenL4.forEach(l4 => {
          l4.processes.forEach(p => {
            if (p.documentationStatus === 'pending' || p.contextValidationStatus === 'unvalidated') {
              results.push(p);
            }
          });
        });
      });
    });
  });

  return results;
}

/** Localizar nó L2 em toda a arquitetura */
export function findL2Node(archData: ArchitectureData, l2Id: string): { l1: ArchNodeL1; l2: ArchNodeL2 } | undefined {
  for (const l1 of archData.domainsL1) {
    for (const l2 of l1.childrenL2) {
      if (l2.id === l2Id || l2.name.toLowerCase() === l2Id.toLowerCase()) {
        return { l1, l2 };
      }
    }
  }
  return undefined;
}

/** Localizar nó L3 em toda a arquitetura */
export function findL3Node(archData: ArchitectureData, l3Id: string): { l1: ArchNodeL1; l2: ArchNodeL2; l3: ArchNodeL3 } | undefined {
  for (const l1 of archData.domainsL1) {
    for (const l2 of l1.childrenL2) {
      for (const l3 of l2.childrenL3) {
        if (l3.id === l3Id || l3.name.toLowerCase() === l3Id.toLowerCase()) {
          return { l1, l2, l3 };
        }
      }
    }
  }
  return undefined;
}

/** Localizar nó L4 em toda a arquitetura */
export function findL4Node(archData: ArchitectureData, l4Id: string): { l1: ArchNodeL1; l2: ArchNodeL2; l3: ArchNodeL3; l4: ArchNodeL4 } | undefined {
  for (const l1 of archData.domainsL1) {
    for (const l2 of l1.childrenL2) {
      for (const l3 of l2.childrenL3) {
        for (const l4 of l3.childrenL4) {
          if (l4.id === l4Id || l4.name.toLowerCase() === l4Id.toLowerCase()) {
            return { l1, l2, l3, l4 };
          }
        }
      }
    }
  }
  return undefined;
}

/** Obter detalhamento operacional (BPMN, SOP, Automação) de um processo */
export function getOperationalProcessDetails(archData: ArchitectureData, processId: string): OperationalProcessDetail {
  if (mockOperationalProcessDetails[processId]) {
    return mockOperationalProcessDetails[processId];
  }

  // Fallback construído a partir do ProcessContextData
  const p = getProcessById(archData, processId);
  const name = p?.name || 'Processo Operacional';
  const desc = p?.description || 'Processo executável com governança e regras modeladas.';

  return {
    id: processId,
    name,
    description: desc,
    code: 'SOP-' + processId.slice(-3).toUpperCase(),
    sopCode: 'SOP-' + processId.slice(-3).toUpperCase(),
    sopVersion: 'v1.0',
    responsible: p?.responsible || 'Responsável Operacional',
    businessUnit: p?.area || 'Unidade de Negócio',
    dimensioning: {
      allocatedFte: 4,
      unit: 'FTs',
      referenceDate: '2026-09-01',
      validationStatus: 'estimado'
    },
    validationConfidence: p?.contextValidationStatus === 'validated' ? 85 : 60,
    revisionDate: '15 set 2026',
    flowSteps: [
      { id: 'st-1', name: '1. Iniciar Execução', type: 'event_start', description: 'Gatilho operacional de entrada', status: 'good' },
      { id: 'st-2', name: '2. Analisar Dados e Pré-requisitos', type: 'activity', description: 'Validação de consistência cadastral', status: 'normal' },
      { id: 'st-gw', name: 'Critérios atendidos?', type: 'gateway_exclusive', description: 'Ponto de decisão operacional' },
      { id: 'st-3', name: '3. Executar Atividade Principal', type: 'activity', description: 'Operação padrão no sistema de registro', status: 'good' },
      { id: 'st-4', name: '4. Concluir e Notificar', type: 'event_end', description: 'Finalização do ciclo e handoff' }
    ],
    exceptionsNote: 'Exceção modelada: divergências de pré-requisitos geram reprocessamento ou devolução com registro de motivo.',
    handoffsNote: 'Handoff estruturado entre a etapa de validação e a etapa de execução.',
    automationReadiness: [
      {
        title: 'Triagem e validação cadastral',
        score: 75,
        description: 'Automação de conferência de regras e integridade de dados.',
        recommendation: 'Motor de Regras / Validação Automática'
      },
      {
        title: 'Notificação e Handoff',
        score: 85,
        description: 'Disparo de eventos e sincronização entre sistemas.',
        recommendation: 'Workflow de Integração via Webhook'
      }
    ],
    objective: `Garantir a execução eficiente e rastreável de ${name}.`,
    outcome: 'Resultado operacional entregue conforme os critérios de aceitação e SLA.',
    trigger: 'Recebimento de demanda ou evento antecedente na cadeia.',
    closingCriteria: 'Conclusão das atividades com atualização do sistema e registro de conformidade.',
    systemsUsed: p?.systemsUsed.map(s => s.systemName) || ['ERP Corporativo', 'CRM'],
    dataObjects: p?.dataObjects.map(d => d.value) || ['Registro Operacional', 'Comprovante'],
    policies: [
      {
        id: 'pol-default-1',
        name: 'Política de Conformidade e Controles Internos',
        type: 'Política Corporativa',
        version: 'v2.0',
        status: 'vigente',
        complianceStatus: 'conforme'
      }
    ],
    evidence: p?.evidences.map(e => e.value) || ['Logs do sistema', 'Evidência de execução']
  };
}
