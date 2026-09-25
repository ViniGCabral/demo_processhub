import { useProcessFlowStore, ProcessFlow, FlowNode } from '@/stores/processFlowStore';
import { ProcessConnection } from '@/stores/processConnectionStore';
import {
  l4_1, l4_2, l4_3, l4_4, l4_5, l4_6,
  l4_7, l4_8, l4_9, l4_10, l4_11, l4_12
} from '@/data/naturaArchitectureMock';

const MOCK_PROCESS_METADATA: Record<string, { area: string; responsible: string; systems: string }> = {
  'l4-1': { area: 'Inovação', responsible: 'Inovação e Consumer Insights', systems: 'Sistema de gestão de inovação' },
  'l4-2': { area: 'Inovação', responsible: 'Inovação de Produtos', systems: 'Repositório de conceitos' },
  'l4-3': { area: 'Inteligência de Mercado e Consumidor', responsible: 'Consumer Insights', systems: 'Plataforma de pesquisa' },
  'l4-4': { area: 'PMO/Governança', responsible: 'PMO / Governança', systems: 'Sistema de qualidade / DLL' },
  'l4-5': { area: 'Inovação', responsible: 'Gestão de Portfólio', systems: 'Portfólio de produtos' },
  'l4-6': { area: 'Inovação', responsible: 'Design e Marca', systems: 'Repositório de design' },
  'l4-7': { area: 'O&L', responsible: 'Qualidade e Segurança', systems: 'Sistema de qualidade' },
  'l4-8': { area: 'P&D', responsible: 'Sustentabilidade e Inovação', systems: 'Ferramentas de avaliação ambiental' },
  'l4-9': { area: 'Inovação', responsible: 'Finanças de Negócio e Portfólio', systems: 'Sistema de portfólio / ERP' },
  'l4-10': { area: 'Finanças', responsible: 'Finanças de Negócio e Controladoria', systems: 'ERP Financeiro' },
  'l4-11': { area: 'Inovação', responsible: 'PMO e Governança', systems: 'Sistema de registro de projetos' },
  'l4-12': { area: 'Inovação', responsible: 'Comitê de Inovação e Portfólio', systems: 'Sistema de aprovação de gate' },
};

function normalizeText(text?: string): string {
  return (text || '').trim().toLowerCase();
}

function matchesProcess(node: FlowNode, targetId: string, targetName?: string): boolean {
  if (node.type !== 'activity') return false;
  const nId = normalizeText(node.processId || node.id);
  const nLabel = normalizeText(node.label);
  const tId = normalizeText(targetId);
  const tName = normalizeText(targetName || targetId);

  return (
    (tId !== '' && (nId === tId || nLabel === tId)) ||
    (tName !== '' && (nId === tName || nLabel === tName))
  );
}

function getProcessMeta(procId?: string, label?: string) {
  const key = procId || '';
  if (MOCK_PROCESS_METADATA[key]) {
    return MOCK_PROCESS_METADATA[key];
  }
  const matchByName = Object.entries(MOCK_PROCESS_METADATA).find(([_, meta]) =>
    label && normalizeText(label).includes(normalizeText(meta.responsible))
  );
  if (matchByName) return matchByName[1];

  return {
    area: 'Inovação',
    responsible: 'Operações e Inovação',
    systems: 'Sistema de Gestão Integrada',
  };
}

/**
 * Automatically infers predecessors (left/upstream) and successors (right/downstream)
 * for a given process from the available process flows.
 */
export function inferConnectionsFromFlows(
  targetProcessId: string,
  targetProcessName?: string,
  targetDomain: string = 'Gestão da Inovação de Produtos',
  flowsRecord?: Record<string, ProcessFlow[]>
): { predecessors: ProcessConnection[]; successors: ProcessConnection[] } {
  const flowsMap = flowsRecord || useProcessFlowStore.getState().flows;
  const allFlows: ProcessFlow[] = Object.values(flowsMap).flat();

  const predList: ProcessConnection[] = [];
  const succList: ProcessConnection[] = [];
  const seenPred = new Set<string>();
  const seenSucc = new Set<string>();

  const targetName = targetProcessName || targetProcessId;

  for (const flow of allFlows) {
    const topNodes = [...flow.nodes].sort((a, b) => a.order - b.order);

    // 1. Check if target is at top-level
    const topIdx = topNodes.findIndex((n) => matchesProcess(n, targetProcessId, targetProcessName));

    if (topIdx !== -1) {
      const targetNode = topNodes[topIdx];
      const targetLabel = targetNode.label || targetName;

      // ── Upstream: all nodes to the left (topIdx - 1 down to 0) ──
      for (let i = topIdx - 1; i >= 0; i--) {
        const node = topNodes[i];
        const isImmediate = i === topIdx - 1;

        if (node.type === 'activity') {
          const key = normalizeText(node.label);
          if (!seenPred.has(key) && key !== normalizeText(targetLabel)) {
            seenPred.add(key);
            const meta = getProcessMeta(node.processId, node.label);
            predList.push({
              id: `flow-pred-${flow.id}-${node.id}-${targetNode.id}`,
              sourceProcessId: node.processId || node.id,
              sourceProcessName: node.label,
              sourceDomain: targetDomain,
              targetProcessId: targetNode.processId || targetNode.id,
              targetProcessName: targetLabel,
              targetDomain: targetDomain,
              relationshipType: isImmediate ? 'fornece_insumo_para' : 'depende_de',
              description: isImmediate
                ? `Predecessor direto no fluxo '${flow.name}'`
                : `Etapa a montante (upstream) no fluxo '${flow.name}'`,
              transferredObject: `Insumo operacional / Handoff de ${node.label}`,
              relatedSystem: meta.systems,
              validationStatus: 'validada',
              notes: 'Identificado automaticamente pelo fluxo de processo',
              createdBy: 'Fluxo Automático',
              createdAt: '2026-09-24',
              updatedAt: '2026-09-24',
            });
          }
        } else if (node.type === 'gateway' && node.branches) {
          // If preceding node is a gateway, all branches that converge are upstream!
          node.branches.forEach((branch) => {
            const bNodes = branch.nodes.filter((n) => n.type === 'activity');
            bNodes.forEach((bNode, bIdx) => {
              const key = normalizeText(bNode.label);
              if (!seenPred.has(key) && key !== normalizeText(targetLabel)) {
                seenPred.add(key);
                const isBranchDirect = isImmediate && bIdx === bNodes.length - 1;
                const meta = getProcessMeta(bNode.processId, bNode.label);
                predList.push({
                  id: `flow-pred-${flow.id}-${bNode.id}-${targetNode.id}`,
                  sourceProcessId: bNode.processId || bNode.id,
                  sourceProcessName: bNode.label,
                  sourceDomain: targetDomain,
                  targetProcessId: targetNode.processId || targetNode.id,
                  targetProcessName: targetLabel,
                  targetDomain: targetDomain,
                  relationshipType: isBranchDirect ? 'fornece_insumo_para' : 'depende_de',
                  description: isBranchDirect
                    ? `Predecessor paralelo direto (Ramo '${branch.label}') no fluxo '${flow.name}'`
                    : `Etapa a montante (Ramo '${branch.label}') no fluxo '${flow.name}'`,
                  transferredObject: `Diretriz / Insumo validado de ${bNode.label}`,
                  relatedSystem: meta.systems,
                  validationStatus: 'validada',
                  notes: 'Identificado automaticamente pelo fluxo de processo',
                  createdBy: 'Fluxo Automático',
                  createdAt: '2026-09-24',
                  updatedAt: '2026-09-24',
                });
              }
            });
          });
        }
      }

      // ── Downstream: all nodes to the right (topIdx + 1 to end) ──
      for (let i = topIdx + 1; i < topNodes.length; i++) {
        const node = topNodes[i];
        const isImmediate = i === topIdx + 1;

        if (node.type === 'activity') {
          const key = normalizeText(node.label);
          if (!seenSucc.has(key) && key !== normalizeText(targetLabel)) {
            seenSucc.add(key);
            const meta = getProcessMeta(node.processId, node.label);
            succList.push({
              id: `flow-succ-${flow.id}-${targetNode.id}-${node.id}`,
              sourceProcessId: targetNode.processId || targetNode.id,
              sourceProcessName: targetLabel,
              sourceDomain: targetDomain,
              targetProcessId: node.processId || node.id,
              targetProcessName: node.label,
              targetDomain: targetDomain,
              relationshipType: isImmediate ? 'fornece_insumo_para' : 'dispara',
              description: isImmediate
                ? `Sucessor direto no fluxo '${flow.name}'`
                : `Etapa a jusante (downstream) no fluxo '${flow.name}'`,
              transferredObject: `Entrega / Handoff para ${node.label}`,
              relatedSystem: meta.systems,
              validationStatus: 'validada',
              notes: 'Identificado automaticamente pelo fluxo de processo',
              createdBy: 'Fluxo Automático',
              createdAt: '2026-09-24',
              updatedAt: '2026-09-24',
            });
          }
        } else if (node.type === 'gateway' && node.branches) {
          // If subsequent node is a gateway, activities in its branches are successors!
          node.branches.forEach((branch) => {
            const bNodes = branch.nodes.filter((n) => n.type === 'activity');
            bNodes.forEach((bNode, bIdx) => {
              const key = normalizeText(bNode.label);
              if (!seenSucc.has(key) && key !== normalizeText(targetLabel)) {
                seenSucc.add(key);
                const isBranchDirect = isImmediate && bIdx === 0;
                const meta = getProcessMeta(bNode.processId, bNode.label);
                succList.push({
                  id: `flow-succ-${flow.id}-${targetNode.id}-${bNode.id}`,
                  sourceProcessId: targetNode.processId || targetNode.id,
                  sourceProcessName: targetLabel,
                  sourceDomain: targetDomain,
                  targetProcessId: bNode.processId || bNode.id,
                  targetProcessName: bNode.label,
                  targetDomain: targetDomain,
                  relationshipType: isBranchDirect ? 'dispara' : 'fornece_insumo_para',
                  description: isBranchDirect
                    ? `Sucessor paralelo direto (Ramo '${branch.label}') no fluxo '${flow.name}'`
                    : `Etapa a jusante (Ramo '${branch.label}') no fluxo '${flow.name}'`,
                  transferredObject: `Direcionador / Handoff para ${bNode.label}`,
                  relatedSystem: meta.systems,
                  validationStatus: 'validada',
                  notes: 'Identificado automaticamente pelo fluxo de processo',
                  createdBy: 'Fluxo Automático',
                  createdAt: '2026-09-24',
                  updatedAt: '2026-09-24',
                });
              }
            });
          });
        }
      }

      continue;
    }

    // 2. Check if target is inside a gateway branch
    for (let gwIdx = 0; gwIdx < topNodes.length; gwIdx++) {
      const gwNode = topNodes[gwIdx];
      if (gwNode.type !== 'gateway' || !gwNode.branches) continue;

      for (const branch of gwNode.branches) {
        const bIdx = branch.nodes.findIndex((n) => matchesProcess(n, targetProcessId, targetProcessName));
        if (bIdx === -1) continue;

        const targetNode = branch.nodes[bIdx];
        const targetLabel = targetNode.label || targetName;

        // Inside the branch - previous nodes
        for (let j = bIdx - 1; j >= 0; j--) {
          const bNode = branch.nodes[j];
          if (bNode.type === 'activity') {
            const key = normalizeText(bNode.label);
            if (!seenPred.has(key) && key !== normalizeText(targetLabel)) {
              seenPred.add(key);
              const meta = getProcessMeta(bNode.processId, bNode.label);
              predList.push({
                id: `flow-pred-${flow.id}-${bNode.id}-${targetNode.id}`,
                sourceProcessId: bNode.processId || bNode.id,
                sourceProcessName: bNode.label,
                sourceDomain: targetDomain,
                targetProcessId: targetNode.processId || targetNode.id,
                targetProcessName: targetLabel,
                targetDomain: targetDomain,
                relationshipType: 'fornece_insumo_para',
                description: `Predecessor no mesmo ramo ('${branch.label}') no fluxo '${flow.name}'`,
                transferredObject: `Insumo interno de ${bNode.label}`,
                relatedSystem: meta.systems,
                validationStatus: 'validada',
                notes: 'Identificado automaticamente pelo fluxo de processo',
                createdBy: 'Fluxo Automático',
                createdAt: '2026-09-24',
                updatedAt: '2026-09-24',
              });
            }
          }
        }

        // Inside the branch - subsequent nodes
        for (let j = bIdx + 1; j < branch.nodes.length; j++) {
          const bNode = branch.nodes[j];
          if (bNode.type === 'activity') {
            const key = normalizeText(bNode.label);
            if (!seenSucc.has(key) && key !== normalizeText(targetLabel)) {
              seenSucc.add(key);
              const meta = getProcessMeta(bNode.processId, bNode.label);
              succList.push({
                id: `flow-succ-${flow.id}-${targetNode.id}-${bNode.id}`,
                sourceProcessId: targetNode.processId || targetNode.id,
                sourceProcessName: targetLabel,
                sourceDomain: targetDomain,
                targetProcessId: bNode.processId || bNode.id,
                targetProcessName: bNode.label,
                targetDomain: targetDomain,
                relationshipType: 'fornece_insumo_para',
                description: `Sucessor no mesmo ramo ('${branch.label}') no fluxo '${flow.name}'`,
                transferredObject: `Entrega interna para ${bNode.label}`,
                relatedSystem: meta.systems,
                validationStatus: 'validada',
                notes: 'Identificado automaticamente pelo fluxo de processo',
                createdBy: 'Fluxo Automático',
                createdAt: '2026-09-24',
                updatedAt: '2026-09-24',
              });
            }
          }
        }

        // Outside the gateway - all top-level nodes before the gateway (upstream predecessors)
        for (let i = gwIdx - 1; i >= 0; i--) {
          const node = topNodes[i];
          const isImmediate = i === gwIdx - 1 && bIdx === 0;

          if (node.type === 'activity') {
            const key = normalizeText(node.label);
            if (!seenPred.has(key) && key !== normalizeText(targetLabel)) {
              seenPred.add(key);
              const meta = getProcessMeta(node.processId, node.label);
              predList.push({
                id: `flow-pred-${flow.id}-${node.id}-${targetNode.id}`,
                sourceProcessId: node.processId || node.id,
                sourceProcessName: node.label,
                sourceDomain: targetDomain,
                targetProcessId: targetNode.processId || targetNode.id,
                targetProcessName: targetLabel,
                targetDomain: targetDomain,
                relationshipType: isImmediate ? 'fornece_insumo_para' : 'depende_de',
                description: isImmediate
                  ? `Predecessor direto antes da ramificação no fluxo '${flow.name}'`
                  : `Etapa a montante no fluxo '${flow.name}'`,
                transferredObject: `Diretrizes consolidadas de ${node.label}`,
                relatedSystem: meta.systems,
                validationStatus: 'validada',
                notes: 'Identificado automaticamente pelo fluxo de processo',
                createdBy: 'Fluxo Automático',
                createdAt: '2026-09-24',
                updatedAt: '2026-09-24',
              });
            }
          }
        }

        // Outside the gateway - all top-level nodes after the gateway (downstream successors)
        // If the branch converges (doesn't terminate with end event)
        const branchEnds = branch.nodes.some((n) => n.type === 'end');
        if (!branchEnds) {
          for (let i = gwIdx + 1; i < topNodes.length; i++) {
            const node = topNodes[i];
            const isImmediate = i === gwIdx + 1 && bIdx === branch.nodes.length - 1;

            if (node.type === 'activity') {
              const key = normalizeText(node.label);
              if (!seenSucc.has(key) && key !== normalizeText(targetLabel)) {
                seenSucc.add(key);
                const meta = getProcessMeta(node.processId, node.label);
                succList.push({
                  id: `flow-succ-${flow.id}-${targetNode.id}-${node.id}`,
                  sourceProcessId: targetNode.processId || targetNode.id,
                  sourceProcessName: targetLabel,
                  sourceDomain: targetDomain,
                  targetProcessId: node.processId || node.id,
                  targetProcessName: node.label,
                  targetDomain: targetDomain,
                  relationshipType: isImmediate ? 'fornece_insumo_para' : 'dispara',
                  description: isImmediate
                    ? `Sucessor direto na convergência do fluxo '${flow.name}'`
                    : `Etapa a jusante no fluxo '${flow.name}'`,
                  transferredObject: `Insumo consolidado do ramo '${branch.label}' para ${node.label}`,
                  relatedSystem: meta.systems,
                  validationStatus: 'validada',
                  notes: 'Identificado automaticamente pelo fluxo de processo',
                  createdBy: 'Fluxo Automático',
                  createdAt: '2026-09-24',
                  updatedAt: '2026-09-24',
                });
              }
            }
          }
        }
      }
    }
  }

  return { predecessors: predList, successors: succList };
}

/**
 * Returns all flow-inferred connections across all flows.
 */
export function getAllFlowConnections(
  targetDomain: string = 'Gestão da Inovação de Produtos',
  flowsRecord?: Record<string, ProcessFlow[]>
): ProcessConnection[] {
  const flowsMap = flowsRecord || useProcessFlowStore.getState().flows;
  const allFlows: ProcessFlow[] = Object.values(flowsMap).flat();
  const allConnections: ProcessConnection[] = [];
  const seenPair = new Set<string>();

  allFlows.forEach((flow) => {
    const activities: { id: string; label: string; processId?: string }[] = [];
    flow.nodes.forEach((n) => {
      if (n.type === 'activity') {
        activities.push({ id: n.id, label: n.label, processId: n.processId });
      } else if (n.type === 'gateway' && n.branches) {
        n.branches.forEach((b) => {
          b.nodes.forEach((bn) => {
            if (bn.type === 'activity') {
              activities.push({ id: bn.id, label: bn.label, processId: bn.processId });
            }
          });
        });
      }
    });

    activities.forEach((act) => {
      const res = inferConnectionsFromFlows(act.processId || act.id, act.label, targetDomain, flowsMap);
      res.successors.forEach((conn) => {
        const pairKey = `${normalizeText(conn.sourceProcessName)}->${normalizeText(conn.targetProcessName)}`;
        if (!seenPair.has(pairKey)) {
          seenPair.add(pairKey);
          allConnections.push(conn);
        }
      });
    });
  });

  return allConnections;
}

