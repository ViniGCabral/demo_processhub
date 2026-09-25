import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// ── Types ──────────────────────────────────────────────────────

export type FlowNodeType = 'start' | 'end' | 'activity' | 'gateway';

export interface FlowBranch {
  id: string;
  label: string;
  nodes: FlowNode[];
}

export interface FlowNode {
  id: string;
  type: FlowNodeType;
  /** For 'activity' type: the id of the process this node references */
  processId?: string;
  /** Display label (auto-filled from process name for activities) */
  label: string;
  /** Optional label on gateway branches (e.g. "Sim", "Não") */
  branchLabel?: string;
  /** Position index in the flow (left-to-right order) */
  order: number;
  /** For 'gateway' type: whether it is split into multiple paths */
  isSplit?: boolean;
  /** For 'gateway' type: the branches array */
  branches?: FlowBranch[];
}

export interface FlowConnection {
  id: string;
  sourceNodeId: string;
  targetNodeId: string;
  /** Label on the connection line (e.g. for gateway branches) */
  label?: string;
}

export interface ProcessFlow {
  id: string;
  /** The architecture node (last-level) this flow belongs to */
  parentNodeId: string;
  name: string;
  description?: string;
  nodes: FlowNode[];
  connections: FlowConnection[];
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}

// ── Store Interface ────────────────────────────────────────────

interface ProcessFlowStore {
  flows: Record<string, ProcessFlow[]>; // keyed by parentNodeId

  getFlows: (parentNodeId: string) => ProcessFlow[];
  getDefaultFlow: (parentNodeId: string) => ProcessFlow | null;
  getFlowById: (flowId: string) => ProcessFlow | null;

  createFlow: (parentNodeId: string, name: string, description?: string) => ProcessFlow;
  updateFlow: (flowId: string, updates: Partial<Pick<ProcessFlow, 'name' | 'description'>>) => void;
  deleteFlow: (flowId: string) => void;
  setDefaultFlow: (parentNodeId: string, flowId: string) => void;
  clearDefault: (parentNodeId: string) => void;

  // Node operations
  addNode: (flowId: string, node: Omit<FlowNode, 'id'>) => string;
  updateNode: (flowId: string, nodeId: string, updates: Partial<FlowNode>) => void;
  removeNode: (flowId: string, nodeId: string) => void;
  reorderNodes: (flowId: string, nodeIds: string[]) => void;

  // Connection operations
  addConnection: (flowId: string, sourceNodeId: string, targetNodeId: string, label?: string) => string;
  removeConnection: (flowId: string, connectionId: string) => void;

  // Bulk: replace all nodes/connections at once (used by editor save)
  replaceFlowContent: (flowId: string, nodes: FlowNode[], connections: FlowConnection[]) => void;
}

// ── Helpers ────────────────────────────────────────────────────

const genId = () => Math.random().toString(36).slice(2, 11);

export function buildCanonicalConceituacaoFlow(parentNodeId: string = 'l3-conceituacao'): ProcessFlow {
  const now = '2026-09-24T20:00:00.000Z';
  const nodes: FlowNode[] = [
    { id: 'fn-start', type: 'start', label: 'Início', order: 0 },
    { id: 'fn-1', type: 'activity', processId: 'l4-1', label: 'Identificar oportunidades para o negócio', order: 1 },
    { id: 'fn-2', type: 'activity', processId: 'l4-2', label: 'Desenvolver conceito e proposta de valor', order: 2 },
    { id: 'fn-3', type: 'activity', processId: 'l4-3', label: 'Validar conceito e proposta de valor', order: 3 },
    { id: 'fn-4', type: 'activity', processId: 'l4-4', label: 'Avaliar requisitos de Design, Qualidade e Regulatório', order: 4 },
    { id: 'fn-5', type: 'activity', processId: 'l4-5', label: 'Definir arquitetura de portfólio', order: 5 },
    {
      id: 'fn-gw-parallel',
      type: 'gateway',
      label: 'Divergência Técnica',
      order: 6,
      isSplit: true,
      branches: [
        {
          id: 'br-design',
          label: 'Inovação',
          nodes: [
            { id: 'fn-6', type: 'activity', processId: 'l4-6', label: 'Consolidar diretrizes de design', order: 0 },
          ],
        },
        {
          id: 'br-qualidade',
          label: 'O&L',
          nodes: [
            { id: 'fn-7', type: 'activity', processId: 'l4-7', label: 'Definir diretrizes de qualidade', order: 0 },
          ],
        },
        {
          id: 'br-sustentabilidade',
          label: 'P&D',
          nodes: [
            { id: 'fn-8', type: 'activity', processId: 'l4-8', label: 'Analisar impacto ambiental', order: 0 },
          ],
        },
      ],
    },
    { id: 'fn-9', type: 'activity', processId: 'l4-9', label: 'Construir Business Case inicial', order: 7 },
    { id: 'fn-10', type: 'activity', processId: 'l4-10', label: 'Realizar análise financeira', order: 8 },
    { id: 'fn-11', type: 'activity', processId: 'l4-11', label: 'Criação do projeto no sistema', order: 9 },
    { id: 'fn-12', type: 'activity', processId: 'l4-12', label: 'Aprovar Gate BF', order: 10 },
    {
      id: 'fn-gw-gatebf',
      type: 'gateway',
      label: 'Decisão Gate BF',
      order: 11,
      isSplit: true,
      branches: [
        {
          id: 'br-aprovado',
          label: 'Aprovado',
          nodes: [
            { id: 'fn-end-aprovado', type: 'end', label: 'Formaliza o kick-off técnico', order: 0 },
          ],
        },
        {
          id: 'br-reprovado',
          label: 'Reprovado',
          nodes: [
            { id: 'fn-end-reprovado', type: 'end', label: 'Retorna para revisão da conceituação', order: 0 },
          ],
        },
      ],
    },
  ];

  const connections: FlowConnection[] = [];
  for (let i = 0; i < nodes.length - 1; i++) {
    connections.push({
      id: `conn-canonical-${i}`,
      sourceNodeId: nodes[i].id,
      targetNodeId: nodes[i + 1].id,
    });
  }

  return {
    id: `flow-conceituacao-canonical-${parentNodeId}`,
    parentNodeId,
    name: 'Jornada de Conceituação e Briefing',
    description: 'Fluxo oficial estruturado de conceituação com divergência paralela (Design, Qualidade, Sustentabilidade) e decisão de Gate BF com desfechos distintos.',
    nodes,
    connections,
    isDefault: true,
    createdAt: now,
    updatedAt: now,
  };
}

const initialSeedFlows: Record<string, ProcessFlow[]> = {
  'l3-conceituacao': [buildCanonicalConceituacaoFlow('l3-conceituacao')],
  'l4-conceituacao': [buildCanonicalConceituacaoFlow('l4-conceituacao')],
};

// ── Store Implementation ───────────────────────────────────────

export const useProcessFlowStore = create<ProcessFlowStore>()(
  persist(
    (set, get) => ({
      flows: initialSeedFlows,

      getFlows: (parentNodeId) => {
        const existing = get().flows[parentNodeId];
        if (existing && existing.length > 0) return existing;
        if (parentNodeId === 'l3-conceituacao' || parentNodeId === 'l4-conceituacao' || parentNodeId.includes('conceitua')) {
          return [buildCanonicalConceituacaoFlow(parentNodeId)];
        }
        return [];
      },

      getDefaultFlow: (parentNodeId) => {
        const list = get().getFlows(parentNodeId);
        return list.find((f) => f.isDefault) || list[0] || null;
      },

      getFlowById: (flowId) => {
        for (const list of Object.values(get().flows)) {
          const found = list.find((f) => f.id === flowId);
          if (found) return found;
        }
        return null;
      },

      createFlow: (parentNodeId, name, description) => {
        const now = new Date().toISOString();
        const startNode: FlowNode = { id: genId(), type: 'start', label: 'Início', order: 0 };
        const endNode: FlowNode = { id: genId(), type: 'end', label: 'Fim', order: 1 };
        const conn: FlowConnection = { id: genId(), sourceNodeId: startNode.id, targetNodeId: endNode.id };

        const flow: ProcessFlow = {
          id: genId(),
          parentNodeId,
          name,
          description,
          nodes: [startNode, endNode],
          connections: [conn],
          isDefault: false,
          createdAt: now,
          updatedAt: now,
        };

        set((state) => ({
          flows: {
            ...state.flows,
            [parentNodeId]: [...(state.flows[parentNodeId] || []), flow],
          },
        }));

        return flow;
      },

      updateFlow: (flowId, updates) => {
        set((state) => {
          const newFlows = { ...state.flows };
          for (const key of Object.keys(newFlows)) {
            newFlows[key] = newFlows[key].map((f) =>
              f.id === flowId
                ? { ...f, ...updates, updatedAt: new Date().toISOString() }
                : f
            );
          }
          return { flows: newFlows };
        });
      },

      deleteFlow: (flowId) => {
        set((state) => {
          const newFlows = { ...state.flows };
          for (const key of Object.keys(newFlows)) {
            newFlows[key] = newFlows[key].filter((f) => f.id !== flowId);
          }
          return { flows: newFlows };
        });
      },

      setDefaultFlow: (parentNodeId, flowId) => {
        set((state) => ({
          flows: {
            ...state.flows,
            [parentNodeId]: (state.flows[parentNodeId] || []).map((f) => ({
              ...f,
              isDefault: f.id === flowId,
            })),
          },
        }));
      },

      clearDefault: (parentNodeId) => {
        set((state) => ({
          flows: {
            ...state.flows,
            [parentNodeId]: (state.flows[parentNodeId] || []).map((f) => ({
              ...f,
              isDefault: false,
            })),
          },
        }));
      },

      addNode: (flowId, nodeData) => {
        const nodeId = genId();
        set((state) => {
          const newFlows = { ...state.flows };
          for (const key of Object.keys(newFlows)) {
            newFlows[key] = newFlows[key].map((f) => {
              if (f.id !== flowId) return f;
              return {
                ...f,
                nodes: [...f.nodes, { ...nodeData, id: nodeId }],
                updatedAt: new Date().toISOString(),
              };
            });
          }
          return { flows: newFlows };
        });
        return nodeId;
      },

      updateNode: (flowId, nodeId, updates) => {
        set((state) => {
          const newFlows = { ...state.flows };
          for (const key of Object.keys(newFlows)) {
            newFlows[key] = newFlows[key].map((f) => {
              if (f.id !== flowId) return f;
              return {
                ...f,
                nodes: f.nodes.map((n) => (n.id === nodeId ? { ...n, ...updates } : n)),
                updatedAt: new Date().toISOString(),
              };
            });
          }
          return { flows: newFlows };
        });
      },

      removeNode: (flowId, nodeId) => {
        set((state) => {
          const newFlows = { ...state.flows };
          for (const key of Object.keys(newFlows)) {
            newFlows[key] = newFlows[key].map((f) => {
              if (f.id !== flowId) return f;
              return {
                ...f,
                nodes: f.nodes.filter((n) => n.id !== nodeId),
                connections: f.connections.filter(
                  (c) => c.sourceNodeId !== nodeId && c.targetNodeId !== nodeId
                ),
                updatedAt: new Date().toISOString(),
              };
            });
          }
          return { flows: newFlows };
        });
      },

      reorderNodes: (flowId, nodeIds) => {
        set((state) => {
          const newFlows = { ...state.flows };
          for (const key of Object.keys(newFlows)) {
            newFlows[key] = newFlows[key].map((f) => {
              if (f.id !== flowId) return f;
              const nodeMap = new Map(f.nodes.map((n) => [n.id, n]));
              const reordered = nodeIds
                .map((id, idx) => {
                  const node = nodeMap.get(id);
                  return node ? { ...node, order: idx } : null;
                })
                .filter(Boolean) as FlowNode[];
              return { ...f, nodes: reordered, updatedAt: new Date().toISOString() };
            });
          }
          return { flows: newFlows };
        });
      },

      addConnection: (flowId, sourceNodeId, targetNodeId, label) => {
        const connId = genId();
        set((state) => {
          const newFlows = { ...state.flows };
          for (const key of Object.keys(newFlows)) {
            newFlows[key] = newFlows[key].map((f) => {
              if (f.id !== flowId) return f;
              return {
                ...f,
                connections: [
                  ...f.connections,
                  { id: connId, sourceNodeId, targetNodeId, label },
                ],
                updatedAt: new Date().toISOString(),
              };
            });
          }
          return { flows: newFlows };
        });
        return connId;
      },

      removeConnection: (flowId, connectionId) => {
        set((state) => {
          const newFlows = { ...state.flows };
          for (const key of Object.keys(newFlows)) {
            newFlows[key] = newFlows[key].map((f) => {
              if (f.id !== flowId) return f;
              return {
                ...f,
                connections: f.connections.filter((c) => c.id !== connectionId),
                updatedAt: new Date().toISOString(),
              };
            });
          }
          return { flows: newFlows };
        });
      },

      replaceFlowContent: (flowId, nodes, connections) => {
        set((state) => {
          const newFlows = { ...state.flows };
          for (const key of Object.keys(newFlows)) {
            newFlows[key] = newFlows[key].map((f) => {
              if (f.id !== flowId) return f;
              return { ...f, nodes, connections, updatedAt: new Date().toISOString() };
            });
          }
          return { flows: newFlows };
        });
      },
    }),
    {
      name: 'processhub-process-flows',
      version: 3,
      migrate: () => ({
        flows: initialSeedFlows,
      }) as never,
      partialize: (state) => ({ flows: state.flows }),
    }
  )
);
