import { BPMNElement, BPMNConnection, BPMNPhase } from "@/components/bpmn/types";

export interface BPMNProcessData {
  elements: BPMNElement[];
  connections: BPMNConnection[];
  phases?: BPMNPhase[];
}

// BPMN data map - process ID to BPMN diagram data
export const bpmnDataMap: Record<string, BPMNProcessData> = {
  // IT Prepaid Amortization Process (ID 7)
  "7": {
    phases: [
      {
        id: 1,
        label: "IT Financial Management Associate",
        y: 50,
        height: 340,
        color: "#E3F2FD",
      },
      {
        id: 2,
        label: "VMO Leadership",
        y: 390,
        height: 200,
        color: "#F3E5F5",
      },
    ],
    elements: [
      // ========== LANE 1: IT Financial Management Associate ==========
      
      // Start Event
      { id: "start", type: "start-event", x: 60, y: 180, width: 36, height: 36, label: "Amortization Request Received from R2R Team", fillColor: "#C8E6C9", strokeColor: "#388E3C" },
      
      // Task 1: Access received email
      { id: "task-1", type: "task", x: 140, y: 165, width: 160, height: 60, label: "Access received email and download invoice spreadsheet", fillColor: "#E3F2FD", strokeColor: "#1976D2" },
      
      // Task 2: Open S4 IT Purchase Orders
      { id: "task-2", type: "task", x: 340, y: 165, width: 160, height: 60, label: "Open \"S4 IT Purchase Orders [Year]\" Spreadsheet", fillColor: "#E3F2FD", strokeColor: "#1976D2" },
      
      // Task 3: Locate Corresponding Purchase Order
      { id: "task-3", type: "task", x: 540, y: 165, width: 160, height: 60, label: "Locate Corresponding Purchase Order", fillColor: "#E3F2FD", strokeColor: "#1976D2" },
      
      // Task 4: Verify allocation codes
      { id: "task-4", type: "task", x: 740, y: 165, width: 160, height: 60, label: "Verify the allocation codes and, if necessary, correct", fillColor: "#E3F2FD", strokeColor: "#1976D2" },
      
      // Link A (catch) - receives from VMO correction loop
      { id: "link-catch", type: "intermediate-event", x: 920, y: 178, width: 36, height: 36, label: "Link A", fillColor: "#BBDEFB", strokeColor: "#1976D2" },
      
      // Gateway 1: Converging (merges main flow with correction loop)
      { id: "gw-merge-1", type: "gateway-exclusive", x: 990, y: 175, width: 44, height: 44, label: "", fillColor: "#FFF9C4", strokeColor: "#F57F17" },
      
      // Task 5: Populate Invoice File
      { id: "task-5", type: "task", x: 1070, y: 165, width: 160, height: 60, label: "Populate Invoice File with Accounting Data", fillColor: "#E3F2FD", strokeColor: "#1976D2" },
      
      // Gateway 2: Is Invoice Partial?
      { id: "gw-partial", type: "gateway-exclusive", x: 1270, y: 175, width: 44, height: 44, label: "Is Invoice Partial?", fillColor: "#FFF9C4", strokeColor: "#F57F17" },
      
      // Task 6: Flag Invoice as Partial (Yes branch)
      { id: "task-6", type: "task", x: 1360, y: 90, width: 140, height: 50, label: "Flag Invoice as Partial", fillColor: "#FFECB3", strokeColor: "#FF8F00" },
      
      // Gateway 3: Converging (merges partial and non-partial paths)
      { id: "gw-merge-2", type: "gateway-exclusive", x: 1540, y: 175, width: 44, height: 44, label: "", fillColor: "#FFF9C4", strokeColor: "#F57F17" },
      
      // Task 7: Send File to VMO Leadership
      { id: "task-7", type: "send-task", x: 1620, y: 165, width: 160, height: 60, label: "Send File to VMO Leadership", fillColor: "#E1BEE7", strokeColor: "#7B1FA2" },
      
      // ========== LANE 2: VMO Leadership ==========
      
      // Task 8: Review Accounting Classification
      { id: "task-8", type: "task", x: 1620, y: 450, width: 160, height: 60, label: "Review Accounting Classification", fillColor: "#F3E5F5", strokeColor: "#7B1FA2" },
      
      // Gateway 4: Approved?
      { id: "gw-approved", type: "gateway-exclusive", x: 1430, y: 465, width: 44, height: 44, label: "Approved?", fillColor: "#FFF9C4", strokeColor: "#F57F17" },
      
      // Task 9: Request Corrections (No branch)
      { id: "task-9", type: "task", x: 1260, y: 450, width: 140, height: 60, label: "Request Corrections", fillColor: "#FFCDD2", strokeColor: "#C62828" },
      
      // Link A (throw) - sends back to Associate lane
      { id: "link-throw", type: "intermediate-event", x: 1160, y: 465, width: 36, height: 36, label: "Link A", fillColor: "#FFCDD2", strokeColor: "#C62828" },
      
      // End Event: Send Approved File to R2R Team (Yes branch from Approved?)
      { id: "end", type: "end-event", x: 1330, y: 560, width: 36, height: 36, label: "Send Approved File to R2R Team", fillColor: "#FFCDD2", strokeColor: "#C62828" },
    ],
    connections: [
      // Lane 1 Flow: Start -> Task 1 -> Task 2 -> Task 3 -> Task 4
      { id: "c1", type: "sequence-flow", sourceId: "start", targetId: "task-1", sourcePoint: { x: 0, y: 0 }, targetPoint: { x: 0, y: 0 } },
      { id: "c2", type: "sequence-flow", sourceId: "task-1", targetId: "task-2", sourcePoint: { x: 0, y: 0 }, targetPoint: { x: 0, y: 0 } },
      { id: "c3", type: "sequence-flow", sourceId: "task-2", targetId: "task-3", sourcePoint: { x: 0, y: 0 }, targetPoint: { x: 0, y: 0 } },
      { id: "c4", type: "sequence-flow", sourceId: "task-3", targetId: "task-4", sourcePoint: { x: 0, y: 0 }, targetPoint: { x: 0, y: 0 } },
      
      // Task 4 -> Merge Gateway 1
      { id: "c5", type: "sequence-flow", sourceId: "task-4", targetId: "gw-merge-1", sourcePoint: { x: 0, y: 0 }, targetPoint: { x: 0, y: 0 } },
      
      // Link A (catch) -> Merge Gateway 1
      { id: "c6", type: "sequence-flow", sourceId: "link-catch", targetId: "gw-merge-1", sourcePoint: { x: 0, y: 0 }, targetPoint: { x: 0, y: 0 } },
      
      // Merge Gateway 1 -> Task 5
      { id: "c7", type: "sequence-flow", sourceId: "gw-merge-1", targetId: "task-5", sourcePoint: { x: 0, y: 0 }, targetPoint: { x: 0, y: 0 } },
      
      // Task 5 -> Gateway Partial?
      { id: "c8", type: "sequence-flow", sourceId: "task-5", targetId: "gw-partial", sourcePoint: { x: 0, y: 0 }, targetPoint: { x: 0, y: 0 } },
      
      // Gateway Partial -> Task 6 (Yes)
      { id: "c9", type: "sequence-flow", sourceId: "gw-partial", targetId: "task-6", sourcePoint: { x: 0, y: 0 }, targetPoint: { x: 0, y: 0 }, label: "Yes" },
      
      // Gateway Partial -> Merge Gateway 2 (No)
      { id: "c10", type: "sequence-flow", sourceId: "gw-partial", targetId: "gw-merge-2", sourcePoint: { x: 0, y: 0 }, targetPoint: { x: 0, y: 0 }, label: "No" },
      
      // Task 6 -> Merge Gateway 2
      { id: "c11", type: "sequence-flow", sourceId: "task-6", targetId: "gw-merge-2", sourcePoint: { x: 0, y: 0 }, targetPoint: { x: 0, y: 0 } },
      
      // Merge Gateway 2 -> Task 7
      { id: "c12", type: "sequence-flow", sourceId: "gw-merge-2", targetId: "task-7", sourcePoint: { x: 0, y: 0 }, targetPoint: { x: 0, y: 0 } },
      
      // Task 7 -> Task 8 (cross-lane)
      { id: "c13", type: "sequence-flow", sourceId: "task-7", targetId: "task-8", sourcePoint: { x: 0, y: 0 }, targetPoint: { x: 0, y: 0 } },
      
      // Lane 2 Flow: Task 8 -> Gateway Approved?
      { id: "c14", type: "sequence-flow", sourceId: "task-8", targetId: "gw-approved", sourcePoint: { x: 0, y: 0 }, targetPoint: { x: 0, y: 0 } },
      
      // Gateway Approved -> Task 9 (No)
      { id: "c15", type: "sequence-flow", sourceId: "gw-approved", targetId: "task-9", sourcePoint: { x: 0, y: 0 }, targetPoint: { x: 0, y: 0 }, label: "No" },
      
      // Task 9 -> Link A (throw)
      { id: "c16", type: "sequence-flow", sourceId: "task-9", targetId: "link-throw", sourcePoint: { x: 0, y: 0 }, targetPoint: { x: 0, y: 0 } },
      
      // Gateway Approved -> End Event (Yes)
      { id: "c17", type: "sequence-flow", sourceId: "gw-approved", targetId: "end", sourcePoint: { x: 0, y: 0 }, targetPoint: { x: 0, y: 0 }, label: "Yes" },
    ],
  },

  // Span & Layer (demo for new "Span & Layer" process)
  "span-layer": {
    phases: [
      { id: 1, label: "Analista de People", y: 50, height: 380, color: "#E3F2FD" },
      { id: 2, label: "Business Partners", y: 430, height: 200, color: "#F3E5F5" },
      { id: 3, label: "Time de Finanças", y: 630, height: 220, color: "#FFF3E0" },
    ],
    elements: [
      // ===== Lane 1: Analista de People =====
      { id: "start", type: "start-event", x: 60, y: 222, width: 36, height: 36, label: "Início do ciclo trimestral", fillColor: "#C8E6C9", strokeColor: "#388E3C" },

      { id: "ds-1", type: "data-store", x: 150, y: 110, width: 50, height: 50, label: "Workday" },
      { id: "task-1", type: "task", x: 130, y: 190, width: 150, height: 80, label: "Extrair relatório Open and Filled Positions Master", fillColor: "#FFF9C4", strokeColor: "#F57F17" },

      { id: "ds-2", type: "data-store", x: 320, y: 110, width: 50, height: 50, label: "Workday" },
      { id: "task-2", type: "task", x: 300, y: 190, width: 150, height: 80, label: "Extrair relatório Supervisory Organization", fillColor: "#FFF9C4", strokeColor: "#F57F17" },

      { id: "ds-3", type: "data-store", x: 490, y: 110, width: 50, height: 50, label: "Workday" },
      { id: "task-3", type: "task", x: 470, y: 190, width: 150, height: 80, label: "Exportar relatórios do Workday em formato Excel", fillColor: "#FFF9C4", strokeColor: "#F57F17" },

      { id: "ds-4", type: "data-store", x: 660, y: 110, width: 50, height: 50, label: "Google Drive" },
      { id: "task-4", type: "task", x: 640, y: 190, width: 150, height: 80, label: "Mover arquivos para Google Drive e abrir no Sheets", fillColor: "#FFF9C4", strokeColor: "#F57F17" },

      { id: "ds-5", type: "data-store", x: 830, y: 110, width: 50, height: 50, label: "Google Sheets" },
      { id: "task-5", type: "task", x: 810, y: 190, width: 150, height: 80, label: "Calcular níveis hierárquicos a partir do Supervisory Org.", fillColor: "#FFF9C4", strokeColor: "#F57F17" },

      { id: "ds-6", type: "data-store", x: 1000, y: 110, width: 50, height: 50, label: "Google Sheets" },
      { id: "task-6", type: "task", x: 980, y: 190, width: 150, height: 80, label: "Calcular span por gestor contando reportes diretos", fillColor: "#FFF9C4", strokeColor: "#F57F17" },

      { id: "gw-incons", type: "gateway-exclusive", x: 1160, y: 218, width: 44, height: 44, label: "Inconsistência identificada?", fillColor: "#FFF9C4", strokeColor: "#F57F17" },
      { id: "gw-merge-1", type: "gateway-exclusive", x: 1260, y: 218, width: 44, height: 44, label: "", fillColor: "#FFF9C4", strokeColor: "#F57F17" },
      { id: "gw-custos", type: "gateway-exclusive", x: 1340, y: 218, width: 44, height: 44, label: "Custos disponíveis?", fillColor: "#FFF9C4", strokeColor: "#F57F17" },

      { id: "ds-7", type: "data-store", x: 1480, y: 110, width: 50, height: 50, label: "Google Sheets" },
      { id: "task-7", type: "task", x: 1460, y: 190, width: 150, height: 80, label: "Criar tabelas dinâmicas e gráficos no Google Sheets", fillColor: "#FFF9C4", strokeColor: "#F57F17" },

      { id: "ds-8", type: "data-store", x: 1650, y: 110, width: 50, height: 50, label: "Google Sheets" },
      { id: "task-8", type: "task", x: 1630, y: 190, width: 150, height: 80, label: "Inserir gráficos na apresentação para reuniões", fillColor: "#FFF9C4", strokeColor: "#F57F17" },

      { id: "ds-9", type: "data-store", x: 1820, y: 110, width: 50, height: 50, label: "Google Sheets" },
      { id: "task-9", type: "task", x: 1800, y: 190, width: 150, height: 80, label: "Abrir dados por vice-presidência e área", fillColor: "#FFF9C4", strokeColor: "#F57F17" },

      { id: "ds-10", type: "data-store", x: 1990, y: 110, width: 50, height: 50, label: "Google Sheets" },
      { id: "task-10", type: "task", x: 1970, y: 190, width: 150, height: 80, label: "Mapear bandas de compensação e construir pirâmide", fillColor: "#FFF9C4", strokeColor: "#F57F17" },

      { id: "ds-11", type: "data-store", x: 2160, y: 110, width: 50, height: 50, label: "Google Sheets" },
      { id: "task-11", type: "task", x: 2140, y: 190, width: 150, height: 80, label: "Classificar por públicos manualmente", fillColor: "#FFF9C4", strokeColor: "#F57F17" },

      { id: "end", type: "end-event", x: 2320, y: 222, width: 36, height: 36, label: "Fim do processo", fillColor: "#FFCDD2", strokeColor: "#C62828" },

      // ===== Lane 2: Business Partners =====
      { id: "task-bp-1", type: "task", x: 1100, y: 490, width: 150, height: 70, label: "Validar estrutura correta com Business Partner", fillColor: "#E1BEE7", strokeColor: "#7B1FA2" },
      { id: "ds-bp", type: "data-store", x: 1300, y: 460, width: 50, height: 50, label: "Google Sheets" },
      { id: "task-bp-2", type: "task", x: 1280, y: 530, width: 150, height: 70, label: "Realizar ajustes manuais na base conforme retorno", fillColor: "#E1BEE7", strokeColor: "#7B1FA2" },

      // ===== Lane 3: Time de Finanças =====
      { id: "task-fin-1", type: "task", x: 1320, y: 700, width: 150, height: 70, label: "Aplicar custos médios por banda e país", fillColor: "#FFE0B2", strokeColor: "#EF6C00" },
      { id: "ds-fin-1", type: "data-store", x: 1380, y: 790, width: 50, height: 50, label: "Excel" },
      { id: "gw-fin", type: "gateway-exclusive", x: 1500, y: 718, width: 44, height: 44, label: "", fillColor: "#FFF9C4", strokeColor: "#F57F17" },
      { id: "task-fin-2", type: "task", x: 1570, y: 700, width: 150, height: 70, label: "Incorporar custos reais das pessoas no baseline", fillColor: "#FFE0B2", strokeColor: "#EF6C00" },
      { id: "ds-fin-2", type: "data-store", x: 1630, y: 790, width: 50, height: 50, label: "Excel" },
    ],
    connections: [
      // Lane 1 main flow
      { id: "sl1", type: "sequence-flow", sourceId: "start", targetId: "task-1", sourcePoint: { x: 0, y: 0 }, targetPoint: { x: 0, y: 0 } },
      { id: "sl2", type: "sequence-flow", sourceId: "task-1", targetId: "task-2", sourcePoint: { x: 0, y: 0 }, targetPoint: { x: 0, y: 0 } },
      { id: "sl3", type: "sequence-flow", sourceId: "task-2", targetId: "task-3", sourcePoint: { x: 0, y: 0 }, targetPoint: { x: 0, y: 0 } },
      { id: "sl4", type: "sequence-flow", sourceId: "task-3", targetId: "task-4", sourcePoint: { x: 0, y: 0 }, targetPoint: { x: 0, y: 0 } },
      { id: "sl5", type: "sequence-flow", sourceId: "task-4", targetId: "task-5", sourcePoint: { x: 0, y: 0 }, targetPoint: { x: 0, y: 0 } },
      { id: "sl6", type: "sequence-flow", sourceId: "task-5", targetId: "task-6", sourcePoint: { x: 0, y: 0 }, targetPoint: { x: 0, y: 0 } },
      { id: "sl7", type: "sequence-flow", sourceId: "task-6", targetId: "gw-incons", sourcePoint: { x: 0, y: 0 }, targetPoint: { x: 0, y: 0 } },

      // Inconsistência? No -> merge | Sim -> BP lane
      { id: "sl8", type: "sequence-flow", sourceId: "gw-incons", targetId: "gw-merge-1", sourcePoint: { x: 0, y: 0 }, targetPoint: { x: 0, y: 0 }, label: "Não" },
      { id: "sl9", type: "sequence-flow", sourceId: "gw-incons", targetId: "task-bp-1", sourcePoint: { x: 0, y: 0 }, targetPoint: { x: 0, y: 0 }, label: "Sim" },
      { id: "sl10", type: "sequence-flow", sourceId: "task-bp-1", targetId: "task-bp-2", sourcePoint: { x: 0, y: 0 }, targetPoint: { x: 0, y: 0 } },
      { id: "sl11", type: "sequence-flow", sourceId: "task-bp-2", targetId: "gw-merge-1", sourcePoint: { x: 0, y: 0 }, targetPoint: { x: 0, y: 0 } },

      // Merge -> Custos disponíveis?
      { id: "sl12", type: "sequence-flow", sourceId: "gw-merge-1", targetId: "gw-custos", sourcePoint: { x: 0, y: 0 }, targetPoint: { x: 0, y: 0 } },

      // Custos? Sim -> task-7 | Não -> finanças
      { id: "sl13", type: "sequence-flow", sourceId: "gw-custos", targetId: "task-7", sourcePoint: { x: 0, y: 0 }, targetPoint: { x: 0, y: 0 }, label: "Sim" },
      { id: "sl14", type: "sequence-flow", sourceId: "gw-custos", targetId: "task-fin-1", sourcePoint: { x: 0, y: 0 }, targetPoint: { x: 0, y: 0 }, label: "Não" },
      { id: "sl15", type: "sequence-flow", sourceId: "task-fin-1", targetId: "gw-fin", sourcePoint: { x: 0, y: 0 }, targetPoint: { x: 0, y: 0 } },
      { id: "sl16", type: "sequence-flow", sourceId: "gw-fin", targetId: "task-fin-2", sourcePoint: { x: 0, y: 0 }, targetPoint: { x: 0, y: 0 } },
      { id: "sl17", type: "sequence-flow", sourceId: "task-fin-2", targetId: "task-7", sourcePoint: { x: 0, y: 0 }, targetPoint: { x: 0, y: 0 } },

      // Tail
      { id: "sl18", type: "sequence-flow", sourceId: "task-7", targetId: "task-8", sourcePoint: { x: 0, y: 0 }, targetPoint: { x: 0, y: 0 } },
      { id: "sl19", type: "sequence-flow", sourceId: "task-8", targetId: "task-9", sourcePoint: { x: 0, y: 0 }, targetPoint: { x: 0, y: 0 } },
      { id: "sl20", type: "sequence-flow", sourceId: "task-9", targetId: "task-10", sourcePoint: { x: 0, y: 0 }, targetPoint: { x: 0, y: 0 } },
      { id: "sl21", type: "sequence-flow", sourceId: "task-10", targetId: "task-11", sourcePoint: { x: 0, y: 0 }, targetPoint: { x: 0, y: 0 } },
      { id: "sl22", type: "sequence-flow", sourceId: "task-11", targetId: "end", sourcePoint: { x: 0, y: 0 }, targetPoint: { x: 0, y: 0 } },
    ],
  },
};
