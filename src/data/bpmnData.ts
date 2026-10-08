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

  "phases": [
    {
      "id": "lane_cadastro",
      "label": "Equipe de Cadastro (Operador SAP)",
      "y": 80.0,
      "height": 720.0,
      "color": "#E3F2FD"
    }
  ],
  "elements": [
    {
      "id": "macro_start",
      "type": "start-event",
      "x": 150.0,
      "y": 182.0,
      "width": 36.0,
      "height": 36.0,
      "label": "Solicita\u00e7\u00e3o de cadastro recebida",
      "fillColor": "#C8E6C9",
      "strokeColor": "#388E3C"
    },
    {
      "id": "end_cadastrado",
      "type": "end-event",
      "x": 2118.0,
      "y": 342.0,
      "width": 36.0,
      "height": 36.0,
      "label": "Banco cadastrado e solicitante informada",
      "fillColor": "#FFCDD2",
      "strokeColor": "#C62828"
    },
    {
      "id": "end_preexistente",
      "type": "end-event",
      "x": 2286.0,
      "y": 182.0,
      "width": 36.0,
      "height": 36.0,
      "label": "Atendimento encerrado sem novo cadastro",
      "fillColor": "#FFCDD2",
      "strokeColor": "#C62828"
    },
    {
      "id": "act_receber",
      "type": "task",
      "x": 286.0,
      "y": 160.0,
      "width": 100.0,
      "height": 80.0,
      "label": "Receber e conferir solicita\u00e7\u00e3o banc\u00e1ria",
      "fillColor": "#E3F2FD",
      "strokeColor": "#1976D2"
    },
    {
      "id": "act_consultar",
      "type": "task",
      "x": 486.0,
      "y": 160.0,
      "width": 100.0,
      "height": 80.0,
      "label": "Consultar Bank Key no SAP",
      "fillColor": "#E3F2FD",
      "strokeColor": "#1976D2"
    },
    {
      "id": "act_criar",
      "type": "task",
      "x": 836.0,
      "y": 320.0,
      "width": 100.0,
      "height": 80.0,
      "label": "Criar cadastro do banco com dados principais",
      "fillColor": "#E3F2FD",
      "strokeColor": "#1976D2"
    },
    {
      "id": "act_endereco",
      "type": "task",
      "x": 1336.0,
      "y": 320.0,
      "width": 100.0,
      "height": 80.0,
      "label": "Preencher endere\u00e7o do banco",
      "fillColor": "#E3F2FD",
      "strokeColor": "#1976D2"
    },
    {
      "id": "act_sem_endereco",
      "type": "task",
      "x": 1336.0,
      "y": 640.0,
      "width": 100.0,
      "height": 80.0,
      "label": "Seguir cadastro sem endere\u00e7o",
      "fillColor": "#E3F2FD",
      "strokeColor": "#1976D2"
    },
    {
      "id": "act_salvar",
      "type": "task",
      "x": 1686.0,
      "y": 320.0,
      "width": 100.0,
      "height": 80.0,
      "label": "Salvar cadastro do banco",
      "fillColor": "#E3F2FD",
      "strokeColor": "#1976D2"
    },
    {
      "id": "act_tratar_alerta",
      "type": "task",
      "x": 1886.0,
      "y": 480.0,
      "width": 100.0,
      "height": 80.0,
      "label": "Tratar alerta de banco j\u00e1 existente",
      "fillColor": "#E3F2FD",
      "strokeColor": "#1976D2"
    },
    {
      "id": "act_informar_existente",
      "type": "task",
      "x": 2086.0,
      "y": 160.0,
      "width": 100.0,
      "height": 80.0,
      "label": "Informar banco j\u00e1 cadastrado",
      "fillColor": "#E3F2FD",
      "strokeColor": "#1976D2"
    },
    {
      "id": "act_confirmar",
      "type": "task",
      "x": 1886.0,
      "y": 320.0,
      "width": 100.0,
      "height": 80.0,
      "label": "Confirmar cadastro \u00e0 solicitante",
      "fillColor": "#E3F2FD",
      "strokeColor": "#1976D2"
    },
    {
      "id": "gw_existe",
      "type": "gateway-exclusive",
      "x": 686.0,
      "y": 175.0,
      "width": 50.0,
      "height": 50.0,
      "label": "O Bank Key solicitado j\u00e1 est\u00e1 cadastrado no SAP?",
      "fillColor": "#FFF9C4",
      "strokeColor": "#F57F17"
    },
    {
      "id": "gw_endereco",
      "type": "gateway-exclusive",
      "x": 1036.0,
      "y": 335.0,
      "width": 50.0,
      "height": 50.0,
      "label": "A \u00e1rea solicitante informou o endere\u00e7o do banco?",
      "fillColor": "#FFF9C4",
      "strokeColor": "#F57F17"
    },
    {
      "id": "gw_endereco_join",
      "type": "gateway-exclusive",
      "x": 1536.0,
      "y": 335.0,
      "width": 50.0,
      "height": 50.0,
      "label": "",
      "fillColor": "#FFF9C4",
      "strokeColor": "#F57F17"
    },
    {
      "id": "gw_endereco3",
      "type": "gateway-exclusive",
      "x": 1186.0,
      "y": 495.0,
      "width": 50.0,
      "height": 50.0,
      "label": "A solicitante informou o endere\u00e7o do banco?",
      "fillColor": "#FFF9C4",
      "strokeColor": "#F57F17"
    },
    {
      "id": "bnd_duplicado",
      "type": "intermediate-event",
      "x": 1718.0,
      "y": 382.0,
      "width": 36.0,
      "height": 36.0,
      "label": "Alerta de banco j\u00e1 existente",
      "fillColor": "#FFECB3",
      "strokeColor": "#FF8F00"
    }
  ],
  "connections": [
    {
      "id": "f_start_receber",
      "type": "sequence-flow",
      "sourceId": "macro_start",
      "targetId": "act_receber",
      "sourcePoint": {
        "x": 0,
        "y": 0
      },
      "targetPoint": {
        "x": 0,
        "y": 0
      },
      "label": ""
    },
    {
      "id": "f_receber_consultar",
      "type": "sequence-flow",
      "sourceId": "act_receber",
      "targetId": "act_consultar",
      "sourcePoint": {
        "x": 0,
        "y": 0
      },
      "targetPoint": {
        "x": 0,
        "y": 0
      },
      "label": ""
    },
    {
      "id": "f_consultar_gw",
      "type": "sequence-flow",
      "sourceId": "act_consultar",
      "targetId": "gw_existe",
      "sourcePoint": {
        "x": 0,
        "y": 0
      },
      "targetPoint": {
        "x": 0,
        "y": 0
      },
      "label": ""
    },
    {
      "id": "f_gw_existente",
      "type": "sequence-flow",
      "sourceId": "gw_existe",
      "targetId": "act_informar_existente",
      "sourcePoint": {
        "x": 0,
        "y": 0
      },
      "targetPoint": {
        "x": 0,
        "y": 0
      },
      "label": "Bank Key j\u00e1 cadastrado"
    },
    {
      "id": "f_gw_novo",
      "type": "sequence-flow",
      "sourceId": "gw_existe",
      "targetId": "act_criar",
      "sourcePoint": {
        "x": 0,
        "y": 0
      },
      "targetPoint": {
        "x": 0,
        "y": 0
      },
      "label": "Bank Key n\u00e3o localizado"
    },
    {
      "id": "f_criar_gwend",
      "type": "sequence-flow",
      "sourceId": "act_criar",
      "targetId": "gw_endereco",
      "sourcePoint": {
        "x": 0,
        "y": 0
      },
      "targetPoint": {
        "x": 0,
        "y": 0
      },
      "label": ""
    },
    {
      "id": "f_gwend_sim",
      "type": "sequence-flow",
      "sourceId": "gw_endereco",
      "targetId": "act_endereco",
      "sourcePoint": {
        "x": 0,
        "y": 0
      },
      "targetPoint": {
        "x": 0,
        "y": 0
      },
      "label": "Endere\u00e7o informado"
    },
    {
      "id": "f_gwend_nao",
      "type": "sequence-flow",
      "sourceId": "gw_endereco",
      "targetId": "gw_endereco3",
      "sourcePoint": {
        "x": 0,
        "y": 0
      },
      "targetPoint": {
        "x": 0,
        "y": 0
      },
      "label": "Endere\u00e7o n\u00e3o informado"
    },
    {
      "id": "f_endereco_join",
      "type": "sequence-flow",
      "sourceId": "act_endereco",
      "targetId": "gw_endereco_join",
      "sourcePoint": {
        "x": 0,
        "y": 0
      },
      "targetPoint": {
        "x": 0,
        "y": 0
      },
      "label": ""
    },
    {
      "id": "f_semendereco_join",
      "type": "sequence-flow",
      "sourceId": "act_sem_endereco",
      "targetId": "gw_endereco_join",
      "sourcePoint": {
        "x": 0,
        "y": 0
      },
      "targetPoint": {
        "x": 0,
        "y": 0
      },
      "label": ""
    },
    {
      "id": "f_join_salvar",
      "type": "sequence-flow",
      "sourceId": "gw_endereco_join",
      "targetId": "act_salvar",
      "sourcePoint": {
        "x": 0,
        "y": 0
      },
      "targetPoint": {
        "x": 0,
        "y": 0
      },
      "label": ""
    },
    {
      "id": "f_salvar_confirmar",
      "type": "sequence-flow",
      "sourceId": "act_salvar",
      "targetId": "act_confirmar",
      "sourcePoint": {
        "x": 0,
        "y": 0
      },
      "targetPoint": {
        "x": 0,
        "y": 0
      },
      "label": ""
    },
    {
      "id": "f_confirmar_end",
      "type": "sequence-flow",
      "sourceId": "act_confirmar",
      "targetId": "end_cadastrado",
      "sourcePoint": {
        "x": 0,
        "y": 0
      },
      "targetPoint": {
        "x": 0,
        "y": 0
      },
      "label": ""
    },
    {
      "id": "f_bnd_tratar",
      "type": "sequence-flow",
      "sourceId": "bnd_duplicado",
      "targetId": "act_tratar_alerta",
      "sourcePoint": {
        "x": 0,
        "y": 0
      },
      "targetPoint": {
        "x": 0,
        "y": 0
      },
      "label": ""
    },
    {
      "id": "f_tratar_informar",
      "type": "sequence-flow",
      "sourceId": "act_tratar_alerta",
      "targetId": "act_informar_existente",
      "sourcePoint": {
        "x": 0,
        "y": 0
      },
      "targetPoint": {
        "x": 0,
        "y": 0
      },
      "label": ""
    },
    {
      "id": "f_informar_end",
      "type": "sequence-flow",
      "sourceId": "act_informar_existente",
      "targetId": "end_preexistente",
      "sourcePoint": {
        "x": 0,
        "y": 0
      },
      "targetPoint": {
        "x": 0,
        "y": 0
      },
      "label": ""
    },
    {
      "id": "f_gwend3_sim",
      "type": "sequence-flow",
      "sourceId": "gw_endereco3",
      "targetId": "act_endereco",
      "sourcePoint": {
        "x": 0,
        "y": 0
      },
      "targetPoint": {
        "x": 0,
        "y": 0
      },
      "label": "Endere\u00e7o informado"
    },
    {
      "id": "f_gwend3_nao",
      "type": "sequence-flow",
      "sourceId": "gw_endereco3",
      "targetId": "act_sem_endereco",
      "sourcePoint": {
        "x": 0,
        "y": 0
      },
      "targetPoint": {
        "x": 0,
        "y": 0
      },
      "label": "Endere\u00e7o n\u00e3o informado"
    }
  ]

  },
};
