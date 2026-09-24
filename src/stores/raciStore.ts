import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type RaciRole = 'R' | 'A' | 'C' | 'I';

export interface RaciCell {
  roles: RaciRole[];
  note?: string; // Observações como "Insight de Inovação", "Olhar de canais", etc.
}

export interface RaciRow {
  id: string;
  etapa?: string; // Ex: "Conceituação"
  procedure: string; // Título exibido na coluna "Procedimento"
  subDetail?: string; // Detalhe em itálico como "olhar estratégico de Qualidade, DLL e Regulatório"
  cells: Record<string, RaciCell>; // chave é o nome da área
}

export interface RaciMatrixData {
  nodeId: string;
  nodeTitle: string;
  areas: string[];
  rows: RaciRow[];
}

export interface RaciStore {
  matrices: Record<string, RaciMatrixData>;
  getMatrix: (nodeId: string, nodeTitle?: string, fallbackProcedures?: { id: string; name: string }[]) => RaciMatrixData;
  updateCellRoles: (nodeId: string, rowId: string, area: string, roles: RaciRole[], note?: string) => void;
  addArea: (nodeId: string, areaName: string) => void;
  removeArea: (nodeId: string, areaName: string) => void;
  addRow: (nodeId: string, procedureName: string, subDetail?: string, etapa?: string) => void;
  removeRow: (nodeId: string, rowId: string) => void;
  resetToDefault: (nodeId: string) => void;
}

// ── Mock canônico da Matriz RACI da etapa Conceituação (Print fornecido) ──
export const NATURA_CONCEITUACAO_AREAS: string[] = [
  'Inovação',
  'Mercado',
  'Marca, Comms e CX',
  'Int. de Mkt e Consu.',
  'P&D',
  'Plataforma Comercial',
  'Finanças',
  'O&L',
  'PMO / Gov.'
];

export const NATURA_CONCEITUACAO_ROWS: RaciRow[] = [
  {
    id: 'row-1',
    etapa: 'Conceituação',
    procedure: 'Identificação de oportunidades para Negócio',
    cells: {
      'Inovação': { roles: ['R', 'A'] },
      'Mercado': { roles: ['C'] },
      'Marca, Comms e CX': { roles: ['C'] },
      'Int. de Mkt e Consu.': { roles: ['C'], note: 'Insight de Inovação' },
      'P&D': { roles: ['C'] },
      'PMO / Gov.': { roles: ['I'] }
    }
  },
  {
    id: 'row-2',
    etapa: 'Conceituação',
    procedure: 'Desenvolvimento de conceito e proposta de valor',
    cells: {
      'Inovação': { roles: ['R', 'A'] },
      'Marca, Comms e CX': { roles: ['C'] },
      'Int. de Mkt e Consu.': { roles: ['C'], note: 'Insight de Inovação' }
    }
  },
  {
    id: 'row-3',
    etapa: 'Conceituação',
    procedure: 'Pesquisa e validação de conceito e proposta de valor',
    cells: {
      'Inovação': { roles: ['A'] },
      'Marca, Comms e CX': { roles: ['C'] },
      'Int. de Mkt e Consu.': { roles: ['R'], note: 'Insight de Inovação' }
    }
  },
  {
    id: 'row-4',
    etapa: 'Conceituação',
    procedure: 'Design for build',
    subDetail: 'olhar estratégico de Qualidade, DLL e Regulatório',
    cells: {
      'Inovação': { roles: ['A', 'C'] },
      'P&D': { roles: ['C'] },
      'O&L': { roles: ['C'] },
      'PMO / Gov.': { roles: ['R'] }
    }
  },
  {
    id: 'row-5',
    etapa: 'Conceituação',
    procedure: 'Desenho da arquitetura de portfólio',
    cells: {
      'Inovação': { roles: ['R', 'A'] },
      'Mercado': { roles: ['C'], note: 'Olhar de canais' },
      'Int. de Mkt e Consu.': { roles: ['C'] },
      'PMO / Gov.': { roles: ['I'] }
    }
  },
  {
    id: 'row-6',
    etapa: 'Conceituação',
    procedure: 'Diretrizes de design',
    cells: {
      'Inovação': { roles: ['R', 'A'] },
      'Marca, Comms e CX': { roles: ['C'] },
      'Int. de Mkt e Consu.': { roles: ['C'] },
      'P&D': { roles: ['C'] },
      'O&L': { roles: ['C'] }
    }
  },
  {
    id: 'row-7',
    etapa: 'Conceituação',
    procedure: 'Diretrizes de Qualidade',
    cells: {
      'O&L': { roles: ['R'] }
    }
  },
  {
    id: 'row-8',
    etapa: 'Conceituação',
    procedure: 'Impacto ambiental',
    cells: {
      'P&D': { roles: ['R'] }
    }
  },
  {
    id: 'row-9',
    etapa: 'Conceituação',
    procedure: 'Construção do BC',
    subDetail: '(Levantamento de custos target, despesas por área e estimativa de volume)',
    cells: {
      'Inovação': { roles: ['R'] },
      'Mercado': { roles: ['C'], note: 'Proj. G, GG' },
      'Marca, Comms e CX': { roles: ['C'] },
      'Int. de Mkt e Consu.': { roles: ['C'] },
      'P&D': { roles: ['C'] },
      'Finanças': { roles: ['C'] },
      'O&L': { roles: ['C'] },
      'PMO / Gov.': { roles: ['I'] }
    }
  },
  {
    id: 'row-10',
    etapa: 'Conceituação',
    procedure: 'Análise financeira',
    cells: {
      'Inovação': { roles: ['C'] },
      'Finanças': { roles: ['R', 'A'] },
      'PMO / Gov.': { roles: ['I'] }
    }
  },
  {
    id: 'row-11',
    etapa: 'Conceituação',
    procedure: 'Criação do projeto no sistema e carga inicial das infos estratégicas',
    cells: {
      'Inovação': { roles: ['R'] },
      'PMO / Gov.': { roles: ['C'] }
    }
  },
  {
    id: 'row-12',
    etapa: 'Conceituação',
    procedure: 'Gate BF — aprovação e passagem de gate',
    cells: {
      'Inovação': { roles: ['R', 'A'] },
      'Finanças': { roles: ['C'] },
      'PMO / Gov.': { roles: ['I'], note: 'Governança formaliza no sistema' }
    }
  }
];

export function buildDefaultNaturaMatrix(nodeId: string, nodeTitle: string = 'Conceituação e Briefing'): RaciMatrixData {
  return {
    nodeId,
    nodeTitle,
    areas: [...NATURA_CONCEITUACAO_AREAS],
    rows: JSON.parse(JSON.stringify(NATURA_CONCEITUACAO_ROWS))
  };
}

// Fallback genérico para nós L4 que possuem processos vinculados
export function buildGenericL4Matrix(
  nodeId: string,
  nodeTitle: string,
  procedures: { id: string; name: string; description?: string }[]
): RaciMatrixData {
  const defaultAreas = ['Operações', 'Qualidade', 'Sistemas / TI', 'Compliance', 'Gestão / PMO'];
  const rows: RaciRow[] = (procedures.length > 0 ? procedures : [
    { id: 'proc-1', name: 'Execução do procedimento padrão' },
    { id: 'proc-2', name: 'Validação e controle de conformidade' },
    { id: 'proc-3', name: 'Registro de evidências e encerramento' }
  ]).map((p, idx) => ({
    id: `row-gen-${p.id || idx}`,
    procedure: p.name,
    subDetail: p.description,
    cells: {
      'Operações': { roles: idx === 0 ? ['R', 'A'] : ['R'] },
      'Qualidade': { roles: idx === 1 ? ['R', 'A'] : ['C'] },
      'Compliance': { roles: ['C'] },
      'Gestão / PMO': { roles: ['I'] }
    }
  }));

  return {
    nodeId,
    nodeTitle,
    areas: defaultAreas,
    rows
  };
}

export const useRaciStore = create<RaciStore>()(
  persist(
    (set, get) => ({
      matrices: {
        'l4-conceituacao': buildDefaultNaturaMatrix('l4-conceituacao', 'Conceituação e Briefing'),
        'l3-conceituacao': buildDefaultNaturaMatrix('l3-conceituacao', 'Conceituação e Briefing')
      },

      getMatrix: (nodeId: string, nodeTitle?: string, fallbackProcedures?: { id: string; name: string }[]) => {
        const state = get();
        // Se já existe no estado, retorna
        if (state.matrices[nodeId]) {
          return state.matrices[nodeId];
        }

        // Se for um nó do Funil de Inovação (l4-conceituacao, l4-1 a l4-12 ou l3-conceituacao)
        const isNaturaConceituacao = 
          nodeId === 'l4-conceituacao' ||
          nodeId === 'l3-conceituacao' || 
          nodeId.startsWith('l4-') || 
          (nodeTitle && nodeTitle.toLowerCase().includes('conceitua'));

        let newMatrix: RaciMatrixData;
        if (isNaturaConceituacao) {
          newMatrix = buildDefaultNaturaMatrix(nodeId, nodeTitle || 'Conceituação e Briefing');
        } else {
          newMatrix = buildGenericL4Matrix(nodeId, nodeTitle || 'Procedimentos do L4', fallbackProcedures || []);
        }

        set((s) => ({
          matrices: {
            ...s.matrices,
            [nodeId]: newMatrix
          }
        }));

        return newMatrix;
      },

      updateCellRoles: (nodeId, rowId, area, roles, note) => {
        set((s) => {
          const current = s.matrices[nodeId] || get().getMatrix(nodeId);
          const updatedRows = current.rows.map((row) => {
            if (row.id !== rowId) return row;
            return {
              ...row,
              cells: {
                ...row.cells,
                [area]: { roles, note }
              }
            };
          });

          return {
            matrices: {
              ...s.matrices,
              [nodeId]: {
                ...current,
                rows: updatedRows
              }
            }
          };
        });
      },

      addArea: (nodeId, areaName) => {
        const trimmed = areaName.trim();
        if (!trimmed) return;
        set((s) => {
          const current = s.matrices[nodeId] || get().getMatrix(nodeId);
          if (current.areas.includes(trimmed)) return s;

          return {
            matrices: {
              ...s.matrices,
              [nodeId]: {
                ...current,
                areas: [...current.areas, trimmed]
              }
            }
          };
        });
      },

      removeArea: (nodeId, areaName) => {
        set((s) => {
          const current = s.matrices[nodeId];
          if (!current) return s;

          const updatedAreas = current.areas.filter((a) => a !== areaName);
          const updatedRows = current.rows.map((row) => {
            const newCells = { ...row.cells };
            delete newCells[areaName];
            return {
              ...row,
              cells: newCells
            };
          });

          return {
            matrices: {
              ...s.matrices,
              [nodeId]: {
                ...current,
                areas: updatedAreas,
                rows: updatedRows
              }
            }
          };
        });
      },

      addRow: (nodeId, procedureName, subDetail, etapa) => {
        const trimmed = procedureName.trim();
        if (!trimmed) return;
        set((s) => {
          const current = s.matrices[nodeId] || get().getMatrix(nodeId);
          const newRow: RaciRow = {
            id: `row-${Date.now()}`,
            etapa: etapa || 'Conceituação',
            procedure: trimmed,
            subDetail: subDetail?.trim(),
            cells: {}
          };

          return {
            matrices: {
              ...s.matrices,
              [nodeId]: {
                ...current,
                rows: [...current.rows, newRow]
              }
            }
          };
        });
      },

      removeRow: (nodeId, rowId) => {
        set((s) => {
          const current = s.matrices[nodeId];
          if (!current) return s;

          return {
            matrices: {
              ...s.matrices,
              [nodeId]: {
                ...current,
                rows: current.rows.filter((r) => r.id !== rowId)
              }
            }
          };
        });
      },

      resetToDefault: (nodeId) => {
        set((s) => {
          const isNatura = nodeId === 'l3-conceituacao' || nodeId.startsWith('l4-');
          const resetMatrix = isNatura 
            ? buildDefaultNaturaMatrix(nodeId)
            : buildGenericL4Matrix(nodeId, 'Procedimentos do L4', []);

          return {
            matrices: {
              ...s.matrices,
              [nodeId]: resetMatrix
            }
          };
        });
      }
    }),
    {
      name: 'processhub-raci-store',
      partialize: (state) => ({ matrices: state.matrices })
    }
  )
);
