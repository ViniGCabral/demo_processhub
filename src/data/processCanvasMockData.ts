import type { ProcessCanvas } from '@/types/processCanvas';

export const processCanvasDemo: ProcessCanvas = {
  id: 'canvas-purchase-request', processId: 'demo', status: 'in_review', updatedAt: 'Hoje, 09:42',
  stages: [
    { id: 's1', processId: 'demo', name: 'Recebimento', order: 1, ownerAreaId: 'a1' },
    { id: 's2', processId: 'demo', name: 'Validação', order: 2, ownerAreaId: 'a2' },
    { id: 's3', processId: 'demo', name: 'Aprovação', order: 3, ownerAreaId: 'a3' },
    { id: 's4', processId: 'demo', name: 'Registro', order: 4, ownerAreaId: 'a2' },
    { id: 's5', processId: 'demo', name: 'Comunicação', order: 5, ownerAreaId: 'a1' },
  ],
  activities: [
    { id: 'act1', processId: 'demo', stageId: 's1', name: 'Registrar solicitação', description: 'Solicitante registra a necessidade de compra e anexa os documentos disponíveis.', order: 1, actorIds: ['u1'], areaIds: ['a1'], systemIds: ['sys1'], successorActivityIds: ['act2'], evidenceIds: ['ev1'], evidenceStatus: 'observed' },
    { id: 'act2', processId: 'demo', stageId: 's2', name: 'Conferir dados e centro de custo', description: 'Compras verifica os campos obrigatórios e a disponibilidade do centro de custo.', order: 2, actorIds: ['u2'], areaIds: ['a2'], systemIds: ['sys1', 'sys2'], predecessorActivityIds: ['act1'], successorActivityIds: ['act3'], evidenceStatus: 'declared' },
    { id: 'act3', processId: 'demo', stageId: 's3', name: 'Aprovar solicitação', description: 'Financeiro revisa o valor solicitado e aprova ou devolve a solicitação.', order: 3, actorIds: ['u3'], areaIds: ['a3'], systemIds: ['sys2'], predecessorActivityIds: ['act2'], successorActivityIds: ['act4'], evidenceIds: ['ev2'], evidenceStatus: 'validated' },
    { id: 'act4', processId: 'demo', stageId: 's4', name: 'Criar pedido no ERP', description: 'Compras cria o pedido de compra a partir da solicitação aprovada.', order: 4, actorIds: ['u2'], areaIds: ['a2'], systemIds: ['sys2'], predecessorActivityIds: ['act3'], successorActivityIds: ['act5'], evidenceStatus: 'inferred' },
    { id: 'act5', processId: 'demo', stageId: 's5', name: 'Comunicar número do pedido', description: 'Solicitante recebe a confirmação e o número do pedido.', order: 5, actorIds: ['u1'], areaIds: ['a1'], systemIds: ['sys3'], predecessorActivityIds: ['act4'], evidenceStatus: 'declared' },
  ],
  actors: [{ id: 'u1', name: 'Mariana Costa', role: 'Solicitante', areaId: 'a1' }, { id: 'u2', name: 'Analista de Compras', role: 'Executor', areaId: 'a2' }, { id: 'u3', name: 'Analista Financeiro', role: 'Aprovador', areaId: 'a3' }],
  areas: [{ id: 'a1', name: 'Solicitante' }, { id: 'a2', name: 'Compras' }, { id: 'a3', name: 'Financeiro' }],
  systems: [{ id: 'sys1', name: 'Portal do Colaborador', systemType: 'portal', moduleOrScreen: 'Nova solicitação', evidenceStatus: 'observed' }, { id: 'sys2', name: 'ERP Corporativo', systemType: 'erp', moduleOrScreen: 'Compras > Pedidos', evidenceStatus: 'validated' }, { id: 'sys3', name: 'E-mail', systemType: 'email', evidenceStatus: 'declared' }],
  dataObjects: [{ id: 'd1', name: 'Solicitação', category: 'transaction', evidenceStatus: 'observed' }, { id: 'd2', name: 'Centro de custo', category: 'master-data', evidenceStatus: 'validated' }, { id: 'd3', name: 'Valor solicitado', category: 'financial', containsSensitiveData: true, evidenceStatus: 'declared' }, { id: 'd4', name: 'Status da solicitação', category: 'status', evidenceStatus: 'inferred' }, { id: 'd5', name: 'Número do pedido', category: 'transaction', evidenceStatus: 'validated' }],
  dataInteractions: [
    { id: 'di1', activityId: 'act1', dataObjectId: 'd1', systemId: 'sys1', interactionType: 'creates', evidenceStatus: 'observed' }, { id: 'di2', activityId: 'act2', dataObjectId: 'd2', systemId: 'sys2', interactionType: 'reads', evidenceStatus: 'validated' }, { id: 'di3', activityId: 'act2', dataObjectId: 'd3', systemId: 'sys1', interactionType: 'reads', evidenceStatus: 'declared' }, { id: 'di4', activityId: 'act3', dataObjectId: 'd4', systemId: 'sys2', interactionType: 'updates', evidenceStatus: 'validated' }, { id: 'di5', activityId: 'act4', dataObjectId: 'd5', systemId: 'sys2', interactionType: 'creates', evidenceStatus: 'validated' }, { id: 'di6', activityId: 'act5', dataObjectId: 'd5', systemId: 'sys3', interactionType: 'sends', evidenceStatus: 'declared' },
  ],
  handoffs: [{ id: 'h1', fromActivityId: 'act1', toActivityId: 'act2', fromActorId: 'u1', toActorId: 'u2', dataObjectIds: ['d1'], handoffType: 'human-to-human', mechanism: 'manual', evidenceStatus: 'declared' }, { id: 'h2', fromActivityId: 'act3', toActivityId: 'act4', fromSystemId: 'sys2', toSystemId: 'sys2', dataObjectIds: ['d1', 'd4'], handoffType: 'system-to-system', mechanism: 'unknown', notes: 'Transição registrada no ERP; mecanismo técnico a confirmar.', evidenceStatus: 'inferred' }, { id: 'h3', fromActivityId: 'act4', toActivityId: 'act5', fromSystemId: 'sys2', toSystemId: 'sys3', dataObjectIds: ['d5'], handoffType: 'system-to-human', mechanism: 'email', evidenceStatus: 'observed' }],
  evidences: [{ id: 'ev1', type: 'screenshot', title: 'Tela de nova solicitação', reference: 'Screenshot #04' }, { id: 'ev2', type: 'sop', title: 'SOP — Aprovação de compras', reference: 'SOP-COM-014 · pág. 6' }],
};

export function getProcessCanvas(processId: string): ProcessCanvas {
  return { ...processCanvasDemo, processId, id: `canvas-${processId}` };
}
