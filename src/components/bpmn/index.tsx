import { useState, useCallback, useRef } from "react";
import { ArrowLeft, Eye, Edit2, Clock, MoreHorizontal, Download, History, Trash2, AlertCircle, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/contexts/LanguageContext";
import { BPMNVersionSidebar } from "./BPMNVersionSidebar";
import { BPMNPalette } from "./BPMNPalette";
import { BPMNToolbar } from "./BPMNToolbar";
import { BPMNCanvas } from "./BPMNCanvas";
import { BpmnIoViewer } from "./BpmnIoViewer";
import { BPMNPropertiesPanel } from "./BPMNPropertiesPanel";

import { EditorMode, Version, BPMNElement, BPMNConnection, BPMNElementType, HistoryState } from "./types";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { SOPStep } from "@/stores/sopStore";
import { bpmnDataMap } from "@/data/bpmnData";
import { cadastroContaBancariaXml } from "@/data/bpmnXmlData";
import { DocAIEditSidebar, type BPMNEditProposal } from "@/components/process/DocAIEditSidebar";
import { useToast } from "@/hooks/use-toast";

export interface BPMNEditorProps {
  hasBPMN: boolean;
  hasPOP: boolean;
  isNewlyGenerated?: boolean;
  popSteps?: SOPStep[];
  processId?: string;
  processName?: string;
  onBack?: () => void;
}

const isSpanLayerDemo = (name?: string, id?: string) => {
  if (id === "demo-span-layer" || id === "span-layer" || id === "proc-cadastro-conta-bancaria") return true;
  if (!name) return false;
  const n = name.toLowerCase();
  if (n.includes("cadastro") && n.includes("conta")) return true;
  return n.includes("span") && n.includes("layer");
};

const BPMN_NS = "http://www.omg.org/spec/BPMN/20100524/MODEL";
const BPMNDI_NS = "http://www.omg.org/spec/BPMN/20100524/DI";
const DC_NS = "http://www.omg.org/spec/DD/20100524/DC";
const DI_NS = "http://www.omg.org/spec/DD/20100524/DI";

function applyProposalToBpmnXml(xml: string, proposal: BPMNEditProposal): string {
  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(xml, "text/xml");

    if (proposal.kind === "bpmn-rename-element") {
      const allElements = Array.from(doc.getElementsByTagName("*"));
      const target = allElements.find((el) => el.getAttribute("id") === proposal.elementId);
      if (target) {
        target.setAttribute("name", proposal.afterLabel);
      }
      return new XMLSerializer().serializeToString(doc);
    }

    if (proposal.kind === "bpmn-add-element") {
      const processEl = doc.getElementsByTagName("bpmn:process")[0];
      const planeEl = doc.getElementsByTagName("bpmndi:BPMNPlane")[0];
      const laneEl = doc.getElementsByTagName("bpmn:lane")[0];
      if (!processEl || !planeEl) return xml;

      const allShapes = Array.from(doc.getElementsByTagName("bpmndi:BPMNShape"));
      const afterShape = allShapes.find((s) => s.getAttribute("bpmnElement") === proposal.afterElementId);
      const afterBounds = afterShape?.getElementsByTagName("dc:Bounds")[0];

      const refX = parseFloat(afterBounds?.getAttribute("x") || "486");
      const refY = parseFloat(afterBounds?.getAttribute("y") || "160");
      const refW = parseFloat(afterBounds?.getAttribute("width") || "100");
      const refH = parseFloat(afterBounds?.getAttribute("height") || "80");

      const shiftX = 200;
      const isGw = proposal.newElementType === "gateway-exclusive";
      const newW = isGw ? 50 : 100;
      const newH = isGw ? 50 : 80;
      const newX = refX + shiftX;
      const newY = isGw ? refY + (refH - newH) / 2 : refY;

      // 1. Shift downstream shapes and expand pool/lane width
      allShapes.forEach((shape) => {
        const bpmnElId = shape.getAttribute("bpmnElement") || "";
        const b = shape.getElementsByTagName("dc:Bounds")[0];
        if (!b) return;
        if (bpmnElId.includes("participant") || bpmnElId.includes("lane")) {
          const w = parseFloat(b.getAttribute("width") || "2200");
          b.setAttribute("width", String(w + shiftX));
          return;
        }
        const x = parseFloat(b.getAttribute("x") || "0");
        if (x > refX + 20) {
          b.setAttribute("x", String(x + shiftX));
          const labelBounds = shape.getElementsByTagName("bpmndi:BPMNLabel")[0]?.getElementsByTagName("dc:Bounds")[0];
          if (labelBounds) {
            const lx = parseFloat(labelBounds.getAttribute("x") || "0");
            labelBounds.setAttribute("x", String(lx + shiftX));
          }
        }
      });

      // 2. Shift downstream edge waypoints
      const allEdges = Array.from(doc.getElementsByTagName("bpmndi:BPMNEdge"));
      allEdges.forEach((edge) => {
        const waypoints = Array.from(edge.getElementsByTagName("di:waypoint"));
        waypoints.forEach((wp) => {
          const wx = parseFloat(wp.getAttribute("x") || "0");
          if (wx > refX + refW + 5) {
            wp.setAttribute("x", String(wx + shiftX));
          }
        });
        const labelBounds = edge.getElementsByTagName("bpmndi:BPMNLabel")[0]?.getElementsByTagName("dc:Bounds")[0];
        if (labelBounds) {
          const lx = parseFloat(labelBounds.getAttribute("x") || "0");
          if (lx > refX + refW + 5) {
            labelBounds.setAttribute("x", String(lx + shiftX));
          }
        }
      });

      // 3. Find outgoing sequenceFlow from afterElementId
      const allFlows = Array.from(doc.getElementsByTagName("bpmn:sequenceFlow"));
      const outFlow = allFlows.find((f) => f.getAttribute("sourceRef") === proposal.afterElementId);
      const oldTargetId = outFlow?.getAttribute("targetRef") || "end_cadastrado";
      const outFlowId = outFlow?.getAttribute("id") || `f_in_${proposal.generatedId}`;
      const newFlowId = `f_out_${proposal.generatedId}`;

      if (outFlow) {
        outFlow.setAttribute("targetRef", proposal.generatedId);
      }

      // 4. Create the new BPMN node
      const newNode = doc.createElementNS(
        BPMN_NS,
        isGw ? "bpmn:exclusiveGateway" : "bpmn:userTask"
      );
      newNode.setAttribute("id", proposal.generatedId);
      newNode.setAttribute("name", proposal.label);
      if (isGw) {
        newNode.setAttribute("gatewayDirection", "Diverging");
      }

      const incomingEl = doc.createElementNS(BPMN_NS, "bpmn:incoming");
      incomingEl.textContent = outFlowId;
      const outgoingEl = doc.createElementNS(BPMN_NS, "bpmn:outgoing");
      outgoingEl.textContent = newFlowId;
      newNode.appendChild(incomingEl);
      newNode.appendChild(outgoingEl);
      processEl.appendChild(newNode);

      if (laneEl) {
        const refEl = doc.createElementNS(BPMN_NS, "bpmn:flowNodeRef");
        refEl.textContent = proposal.generatedId;
        laneEl.appendChild(refEl);
      }

      // 5. Create new sequenceFlow from newNode to oldTargetId
      const newFlow = doc.createElementNS(BPMN_NS, "bpmn:sequenceFlow");
      newFlow.setAttribute("id", newFlowId);
      newFlow.setAttribute("name", isGw ? "Sim" : "");
      newFlow.setAttribute("sourceRef", proposal.generatedId);
      newFlow.setAttribute("targetRef", oldTargetId);
      processEl.appendChild(newFlow);

      // 6. Create BPMNShape for newNode
      const newShape = doc.createElementNS(BPMNDI_NS, "bpmndi:BPMNShape");
      newShape.setAttribute("id", `BPMNShape_${proposal.generatedId}`);
      newShape.setAttribute("bpmnElement", proposal.generatedId);
      if (isGw) {
        newShape.setAttribute("isMarkerVisible", "true");
      }
      const newBounds = doc.createElementNS(DC_NS, "dc:Bounds");
      newBounds.setAttribute("x", String(newX));
      newBounds.setAttribute("y", String(newY));
      newBounds.setAttribute("width", String(newW));
      newBounds.setAttribute("height", String(newH));
      newShape.appendChild(newBounds);
      planeEl.appendChild(newShape);

      // 7. Update existing outFlow BPMNEdge and add newFlow BPMNEdge
      const midY = refY + refH / 2;
      const outEdge = allEdges.find((e) => e.getAttribute("bpmnElement") === outFlowId);
      let oldEndPoint = { x: newX + newW + 100, y: midY };

      if (outEdge) {
        const wps = Array.from(outEdge.getElementsByTagName("di:waypoint"));
        if (wps.length >= 2) {
          const lastWp = wps[wps.length - 1];
          oldEndPoint = {
            x: parseFloat(lastWp.getAttribute("x") || String(newX + newW + 100)),
            y: parseFloat(lastWp.getAttribute("y") || String(midY)),
          };
          while (outEdge.firstChild) outEdge.removeChild(outEdge.firstChild);
          const wp1 = doc.createElementNS(DI_NS, "di:waypoint");
          wp1.setAttribute("x", String(refX + refW));
          wp1.setAttribute("y", String(midY));
          const wp2 = doc.createElementNS(DI_NS, "di:waypoint");
          wp2.setAttribute("x", String(newX));
          wp2.setAttribute("y", String(midY));
          outEdge.appendChild(wp1);
          outEdge.appendChild(wp2);
        }
      }

      const newEdge = doc.createElementNS(BPMNDI_NS, "bpmndi:BPMNEdge");
      newEdge.setAttribute("id", `BPMNEdge_${newFlowId}`);
      newEdge.setAttribute("bpmnElement", newFlowId);
      const nwp1 = doc.createElementNS(DI_NS, "di:waypoint");
      nwp1.setAttribute("x", String(newX + newW));
      nwp1.setAttribute("y", String(midY));
      const nwp2 = doc.createElementNS(DI_NS, "di:waypoint");
      nwp2.setAttribute("x", String(oldEndPoint.x));
      nwp2.setAttribute("y", String(oldEndPoint.y));
      newEdge.appendChild(nwp1);
      newEdge.appendChild(nwp2);
      planeEl.appendChild(newEdge);

      return new XMLSerializer().serializeToString(doc);
    }

    if (proposal.kind === "bpmn-remove-element") {
      const allElements = Array.from(doc.getElementsByTagName("*"));
      const targetNode = allElements.find((el) => el.getAttribute("id") === proposal.elementId);
      const allFlows = Array.from(doc.getElementsByTagName("bpmn:sequenceFlow"));
      const inFlow = allFlows.find((f) => f.getAttribute("targetRef") === proposal.elementId);
      const outFlow = allFlows.find((f) => f.getAttribute("sourceRef") === proposal.elementId);

      if (inFlow && outFlow) {
        const nextTarget = outFlow.getAttribute("targetRef") || "";
        inFlow.setAttribute("targetRef", nextTarget);

        const allEdges = Array.from(doc.getElementsByTagName("bpmndi:BPMNEdge"));
        const inEdge = allEdges.find((e) => e.getAttribute("bpmnElement") === inFlow.getAttribute("id"));
        const outEdge = allEdges.find((e) => e.getAttribute("bpmnElement") === outFlow.getAttribute("id"));

        if (inEdge && outEdge) {
          const inWps = Array.from(inEdge.getElementsByTagName("di:waypoint"));
          const outWps = Array.from(outEdge.getElementsByTagName("di:waypoint"));
          if (inWps.length > 0 && outWps.length > 0) {
            const lastOut = outWps[outWps.length - 1];
            const lastIn = inWps[inWps.length - 1];
            lastIn.setAttribute("x", lastOut.getAttribute("x") || "0");
            lastIn.setAttribute("y", lastOut.getAttribute("y") || "0");
          }
          outEdge.parentNode?.removeChild(outEdge);
        }
        outFlow.parentNode?.removeChild(outFlow);
      }

      const allShapes = Array.from(doc.getElementsByTagName("bpmndi:BPMNShape"));
      const shape = allShapes.find((s) => s.getAttribute("bpmnElement") === proposal.elementId);
      shape?.parentNode?.removeChild(shape);
      targetNode?.parentNode?.removeChild(targetNode);

      return new XMLSerializer().serializeToString(doc);
    }

    return xml;
  } catch (e) {
    console.error("Failed to mutate BPMN XML", e);
    return xml;
  }
}

export function BPMNEditor({ hasBPMN, hasPOP, isNewlyGenerated = false, popSteps = [], processId, processName, onBack }: BPMNEditorProps) {
  const { language } = useLanguage();
  const { toast } = useToast();
  const [mode, setMode] = useState<EditorMode>("viewer");
  const [zoom, setZoom] = useState(100);
  const [selectedVersion, setSelectedVersion] = useState("v1");
  const [selectedElementId, setSelectedElementId] = useState<string | null>(null);
  const [aiChatOpen, setAiChatOpen] = useState(true);
  const [aiHighlightedElementId, setAiHighlightedElementId] = useState<string | null>(null);
  const [aiModifiedElementIds, setAiModifiedElementIds] = useState<string[]>([]);
  const [bpmnXml, setBpmnXml] = useState<string>(cadastroContaBancariaXml);
  const previousStatesRef = useRef<
    Record<
      string,
      {
        xml: string;
        elements: BPMNElement[];
        connections: BPMNConnection[];
        modifiedIds: string[];
      }
    >
  >({});

  // History for undo/redo
  const [history, setHistory] = useState<HistoryState[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  // Default BPMN Data - Fluxo: Cotação de Frete Emergencial (fallback)
  const defaultElements: BPMNElement[] = [
    // FASE 1 - ANÁLISE INICIAL (y ~150)
    { id: "start", type: "start-event", x: 100, y: 170, width: 36, height: 36, label: "", fillColor: "#C8E6C9", strokeColor: "#388E3C" },
    { id: "task-1-1", type: "task", x: 200, y: 170, width: 130, height: 50, label: "Acessar ServiceNow", fillColor: "#E3F2FD", strokeColor: "#1976D2" },
    { id: "task-1-2", type: "task", x: 370, y: 170, width: 130, height: 50, label: "Localizar Chamado", fillColor: "#E3F2FD", strokeColor: "#1976D2" },
    { id: "task-1-3", type: "task", x: 540, y: 170, width: 120, height: 50, label: "Validar Dados", fillColor: "#E3F2FD", strokeColor: "#1976D2" },
    { id: "gw-1", type: "gateway-exclusive", x: 700, y: 170, width: 44, height: 44, label: "", fillColor: "#FFF9C4", strokeColor: "#F57F17" },
    { id: "task-1-4", type: "task", x: 700, y: 270, width: 130, height: 50, label: "Atualizar Campos", fillColor: "#E3F2FD", strokeColor: "#1976D2" },
    { id: "task-1-5", type: "task", x: 870, y: 170, width: 160, height: 50, label: "Inserir E-mails Transportadoras", fillColor: "#E3F2FD", strokeColor: "#1976D2" },

    // FASE 2 - CÁLCULO DO FRETE (y ~420)
    { id: "task-2-1", type: "task", x: 150, y: 420, width: 150, height: 50, label: "Acessar Simulador Frete", fillColor: "#E3F2FD", strokeColor: "#1976D2" },
    { id: "task-2-2", type: "task", x: 340, y: 420, width: 160, height: 50, label: "Preencher Origem/Destino", fillColor: "#E3F2FD", strokeColor: "#1976D2" },
    { id: "gw-2", type: "gateway-exclusive", x: 540, y: 420, width: 44, height: 44, label: "", fillColor: "#FFF9C4", strokeColor: "#F57F17" },
    { id: "task-2-3a", type: "task", x: 670, y: 350, width: 130, height: 46, label: "Calculadora Lotação", fillColor: "#E3F2FD", strokeColor: "#1976D2" },
    { id: "task-2-3b", type: "task", x: 670, y: 490, width: 140, height: 46, label: "Calculadora Fracionado", fillColor: "#E3F2FD", strokeColor: "#1976D2" },
    { id: "task-2-4", type: "task", x: 870, y: 420, width: 130, height: 50, label: "Verificar Resultado", fillColor: "#E3F2FD", strokeColor: "#1976D2" },

    // FASE 3 - COMPARAÇÃO & SELEÇÃO (y ~640)
    { id: "task-3-1", type: "task", x: 150, y: 640, width: 140, height: 50, label: "Analisar Comparativo", fillColor: "#E3F2FD", strokeColor: "#1976D2" },
    { id: "gw-3", type: "gateway-exclusive", x: 340, y: 640, width: 44, height: 44, label: "", fillColor: "#FFF9C4", strokeColor: "#F57F17" },
    { id: "task-3-2", type: "task", x: 480, y: 570, width: 140, height: 46, label: "Selecionar Modalidade", fillColor: "#E3F2FD", strokeColor: "#1976D2" },
    { id: "task-3-3", type: "task", x: 480, y: 710, width: 150, height: 46, label: "Escalar para Gerente", fillColor: "#E3F2FD", strokeColor: "#1976D2" },
    { id: "task-3-4", type: "task", x: 680, y: 710, width: 140, height: 46, label: "Selecionar Modalidade", fillColor: "#E3F2FD", strokeColor: "#1976D2" },

    // FASE 4 - REGISTRO & FINALIZAÇÃO (y ~860)
    { id: "task-4-1", type: "task", x: 150, y: 860, width: 140, height: 50, label: "Registrar Valor Final", fillColor: "#E3F2FD", strokeColor: "#1976D2" },
    { id: "task-4-2", type: "task", x: 340, y: 860, width: 180, height: 50, label: "Registrar em Excel (Auditoria)", fillColor: "#E3F2FD", strokeColor: "#1976D2" },
    { id: "task-4-3", type: "task", x: 560, y: 860, width: 130, height: 50, label: "Salvar Chamado", fillColor: "#E3F2FD", strokeColor: "#1976D2" },
    { id: "end", type: "end-event", x: 750, y: 860, width: 36, height: 36, label: "", fillColor: "#FFCDD2", strokeColor: "#C62828" },
  ];

  const defaultConnections: BPMNConnection[] = [
    { id: "c1", type: "sequence-flow", sourceId: "start", targetId: "task-1-1", sourcePoint: { x: 0, y: 0 }, targetPoint: { x: 0, y: 0 } },
    { id: "c2", type: "sequence-flow", sourceId: "task-1-1", targetId: "task-1-2", sourcePoint: { x: 0, y: 0 }, targetPoint: { x: 0, y: 0 } },
    { id: "c3", type: "sequence-flow", sourceId: "task-1-2", targetId: "task-1-3", sourcePoint: { x: 0, y: 0 }, targetPoint: { x: 0, y: 0 } },
    { id: "c4", type: "sequence-flow", sourceId: "task-1-3", targetId: "gw-1", sourcePoint: { x: 0, y: 0 }, targetPoint: { x: 0, y: 0 } },
    { id: "c5", type: "sequence-flow", sourceId: "gw-1", targetId: "task-1-4", sourcePoint: { x: 0, y: 0 }, targetPoint: { x: 0, y: 0 }, label: "NÃO" },
    { id: "c6", type: "sequence-flow", sourceId: "gw-1", targetId: "task-1-5", sourcePoint: { x: 0, y: 0 }, targetPoint: { x: 0, y: 0 }, label: "SIM" },
    { id: "c7", type: "sequence-flow", sourceId: "task-1-4", targetId: "task-1-5", sourcePoint: { x: 0, y: 0 }, targetPoint: { x: 0, y: 0 } },
    { id: "c8", type: "sequence-flow", sourceId: "task-1-5", targetId: "task-2-1", sourcePoint: { x: 0, y: 0 }, targetPoint: { x: 0, y: 0 } },
    { id: "c9", type: "sequence-flow", sourceId: "task-2-1", targetId: "task-2-2", sourcePoint: { x: 0, y: 0 }, targetPoint: { x: 0, y: 0 } },
    { id: "c10", type: "sequence-flow", sourceId: "task-2-2", targetId: "gw-2", sourcePoint: { x: 0, y: 0 }, targetPoint: { x: 0, y: 0 } },
    { id: "c11", type: "sequence-flow", sourceId: "gw-2", targetId: "task-2-3a", sourcePoint: { x: 0, y: 0 }, targetPoint: { x: 0, y: 0 }, label: "> 500km" },
    { id: "c12", type: "sequence-flow", sourceId: "gw-2", targetId: "task-2-3b", sourcePoint: { x: 0, y: 0 }, targetPoint: { x: 0, y: 0 }, label: "≤ 500km" },
    { id: "c13", type: "sequence-flow", sourceId: "task-2-3a", targetId: "task-2-4", sourcePoint: { x: 0, y: 0 }, targetPoint: { x: 0, y: 0 } },
    { id: "c14", type: "sequence-flow", sourceId: "task-2-3b", targetId: "task-2-4", sourcePoint: { x: 0, y: 0 }, targetPoint: { x: 0, y: 0 } },
    { id: "c15", type: "sequence-flow", sourceId: "task-2-4", targetId: "task-3-1", sourcePoint: { x: 0, y: 0 }, targetPoint: { x: 0, y: 0 } },
    { id: "c16", type: "sequence-flow", sourceId: "task-3-1", targetId: "gw-3", sourcePoint: { x: 0, y: 0 }, targetPoint: { x: 0, y: 0 } },
    { id: "c17", type: "sequence-flow", sourceId: "gw-3", targetId: "task-3-2", sourcePoint: { x: 0, y: 0 }, targetPoint: { x: 0, y: 0 }, label: "SIM" },
    { id: "c18", type: "sequence-flow", sourceId: "gw-3", targetId: "task-3-3", sourcePoint: { x: 0, y: 0 }, targetPoint: { x: 0, y: 0 }, label: "NÃO" },
    { id: "c19", type: "sequence-flow", sourceId: "task-3-3", targetId: "task-3-4", sourcePoint: { x: 0, y: 0 }, targetPoint: { x: 0, y: 0 } },
    { id: "c20", type: "sequence-flow", sourceId: "task-3-2", targetId: "task-4-1", sourcePoint: { x: 0, y: 0 }, targetPoint: { x: 0, y: 0 } },
    { id: "c21", type: "sequence-flow", sourceId: "task-3-4", targetId: "task-4-1", sourcePoint: { x: 0, y: 0 }, targetPoint: { x: 0, y: 0 } },
    { id: "c22", type: "sequence-flow", sourceId: "task-4-1", targetId: "task-4-2", sourcePoint: { x: 0, y: 0 }, targetPoint: { x: 0, y: 0 } },
    { id: "c23", type: "sequence-flow", sourceId: "task-4-2", targetId: "task-4-3", sourcePoint: { x: 0, y: 0 }, targetPoint: { x: 0, y: 0 } },
    { id: "c24", type: "sequence-flow", sourceId: "task-4-3", targetId: "end", sourcePoint: { x: 0, y: 0 }, targetPoint: { x: 0, y: 0 } },
  ];

  const spanLayerDemo = isSpanLayerDemo(processName, processId);

  const getInitialData = () => {
    if (spanLayerDemo && bpmnDataMap["span-layer"]) {
      return bpmnDataMap["span-layer"];
    }
    if (processId && bpmnDataMap[processId]) {
      return bpmnDataMap[processId];
    }
    return bpmnDataMap["7"] || { elements: defaultElements, connections: defaultConnections };
  };

  const initialData = getInitialData();
  const [elements, setElements] = useState<BPMNElement[]>(initialData.elements);
  const [connections, setConnections] = useState<BPMNConnection[]>(initialData.connections);

  const [versions, setVersions] = useState<Version[]>([
    { id: "v1", label: "v1.0", date: new Date().toLocaleDateString("pt-BR", { day: "numeric", month: "short", year: "numeric" }), status: "Draft" }
  ]);

  const currentVersion = versions.find((v) => v.id === selectedVersion);
  const isDraft = currentVersion?.status === "Draft";
  const selectedElement = elements.find((e) => e.id === selectedElementId) || null;

  const handleZoomIn = () => setZoom((z) => Math.min(200, z + 10));
  const handleZoomOut = () => setZoom((z) => Math.max(50, z - 10));
  const handleZoomReset = () => setZoom(100);

  const handleElementsChange = useCallback((newElements: BPMNElement[]) => {
    setElements(newElements);
  }, []);

  const handleUpdateElement = useCallback((updates: Partial<BPMNElement>) => {
    if (!selectedElementId) return;
    setElements((prev) =>
      prev.map((el) => (el.id === selectedElementId ? { ...el, ...updates } : el))
    );
  }, [selectedElementId]);

  const handleDelete = useCallback(() => {
    if (!selectedElementId) return;
    setElements((prev) => prev.filter((el) => el.id !== selectedElementId));
    setConnections((prev) =>
      prev.filter((c) => c.sourceId !== selectedElementId && c.targetId !== selectedElementId)
    );
    setSelectedElementId(null);
  }, [selectedElementId]);

  const handleAddVersion = () => {
    const newVersion: Version = {
      id: `v${versions.length + 1}`,
      label: `v${versions.length + 1}.0`,
      date: new Date().toLocaleDateString("pt-BR", { day: "numeric", month: "short", year: "numeric" }),
      status: "Draft",
    };
    setVersions((prev) => [newVersion, ...prev]);
    setSelectedVersion(newVersion.id);
  };

  const handleGenerateFromPOP = () => {
    if (!popSteps.length) return;
    
    const newElements: BPMNElement[] = [
      { id: "start-gen", type: "start-event", x: 60, y: 200, width: 40, height: 40, label: "" },
    ];
    
    let xPos = 160;
    popSteps.forEach((step) => {
      newElements.push({
        id: `step-${step.id}`,
        type: "sub-process",
        x: xPos,
        y: 200,
        width: 140,
        height: 80,
        label: step.title,
        linkedPOPStep: step.id,
      });
      xPos += 180;
    });
    
    newElements.push({
      id: "end-gen",
      type: "end-event",
      x: xPos,
      y: 200,
      width: 40,
      height: 40,
      label: "",
    });

    setElements(newElements);
  };

  const handleFocusBPMNElement = (elementId: string) => {
    setAiHighlightedElementId(elementId);
    setSelectedElementId(elementId);
    window.setTimeout(() => {
      setAiHighlightedElementId((prev) => (prev === elementId ? null : prev));
    }, 4500);
  };

  const getProposalKey = (p: BPMNEditProposal) => {
    if (p.kind === "bpmn-add-element") return p.generatedId;
    return `${p.kind}-${p.elementId}`;
  };

  const handleApplyBPMNProposal = (proposal: BPMNEditProposal, revert = false) => {
    const key = getProposalKey(proposal);

    if (revert) {
      const snapshot = previousStatesRef.current[key];
      if (snapshot) {
        setBpmnXml(snapshot.xml);
        setElements(snapshot.elements);
        setConnections(snapshot.connections);
        setAiModifiedElementIds(snapshot.modifiedIds);
      }
      toast({
        title: language === "PT" ? "Alteração desfeita no BPMN" : "BPMN change reverted",
        description: language === "PT" ? "O estado anterior do diagrama foi restaurado." : "Previous diagram state was restored.",
      });
      return;
    }

    // Save snapshot for clean revert
    previousStatesRef.current[key] = {
      xml: bpmnXml,
      elements: [...elements],
      connections: [...connections],
      modifiedIds: [...aiModifiedElementIds],
    };

    // 1. Update XML (used when spanLayerDemo is active)
    const updatedXml = applyProposalToBpmnXml(bpmnXml, proposal);
    setBpmnXml(updatedXml);

    // 2. Update elements & connections (used when BPMNCanvas is active)
    if (proposal.kind === "bpmn-rename-element") {
      setElements((prev) =>
        prev.map((el) =>
          el.id === proposal.elementId
            ? { ...el, label: proposal.afterLabel, fillColor: "#ECFDF5", strokeColor: "#10B981" }
            : el
        )
      );
      setAiModifiedElementIds((prev) => Array.from(new Set([...prev, proposal.elementId])));
      handleFocusBPMNElement(proposal.elementId);
    } else if (proposal.kind === "bpmn-add-element") {
      const refEl = elements.find((e) => e.id === proposal.afterElementId) || elements[1] || elements[0];
      const refX = refEl ? refEl.x : 300;
      const refY = refEl ? refEl.y : 180;
      const shiftX = 180;
      const isGw = proposal.newElementType === "gateway-exclusive";

      const newEl: BPMNElement = {
        id: proposal.generatedId,
        type: proposal.newElementType,
        x: refX + shiftX,
        y: refY,
        width: isGw ? 48 : 150,
        height: isGw ? 48 : 56,
        label: proposal.label,
        fillColor: "#ECFDF5",
        strokeColor: "#10B981",
      };

      setElements((prev) => [
        ...prev.map((e) => (e.x > refX + 20 ? { ...e, x: e.x + shiftX } : e)),
        newEl,
      ]);

      setConnections((prev) => {
        const outConn = prev.find((c) => c.sourceId === proposal.afterElementId);
        if (!outConn) {
          return [
            ...prev,
            {
              id: `conn-${proposal.generatedId}`,
              type: "sequence-flow",
              sourceId: proposal.afterElementId,
              targetId: proposal.generatedId,
              sourcePoint: { x: 0, y: 0 },
              targetPoint: { x: 0, y: 0 },
            },
          ];
        }
        return [
          ...prev.map((c) =>
            c.id === outConn.id ? { ...c, targetId: proposal.generatedId } : c
          ),
          {
            id: `conn-${proposal.generatedId}`,
            type: "sequence-flow",
            sourceId: proposal.generatedId,
            targetId: outConn.targetId,
            sourcePoint: { x: 0, y: 0 },
            targetPoint: { x: 0, y: 0 },
            label: isGw ? "SIM" : undefined,
          },
        ];
      });

      setAiModifiedElementIds((prev) => Array.from(new Set([...prev, proposal.generatedId])));
      handleFocusBPMNElement(proposal.generatedId);
    } else if (proposal.kind === "bpmn-remove-element") {
      const inConn = connections.find((c) => c.targetId === proposal.elementId);
      const outConn = connections.find((c) => c.sourceId === proposal.elementId);

      setConnections((prev) => {
        let next = prev.filter(
          (c) => c.sourceId !== proposal.elementId && c.targetId !== proposal.elementId
        );
        if (inConn && outConn) {
          next = [
            ...next,
            {
              ...inConn,
              id: `conn-bridge-${Date.now()}`,
              targetId: outConn.targetId,
            },
          ];
        }
        return next;
      });
      setElements((prev) => prev.filter((e) => e.id !== proposal.elementId));
    }

    toast({
      title: language === "PT" ? "Fluxo BPMN atualizado pela IA" : "BPMN Flow updated by AI",
      description:
        language === "PT"
          ? "A alteração foi aplicada ao diagrama BPMN."
          : "The change has been applied to the BPMN diagram.",
    });
  };

  const popStepsForPanel = popSteps.map((s) => ({ id: s.id, title: s.title }));

  return (
    <div className="fixed inset-0 top-16 left-[312px] flex animate-fade-in bg-card z-10">
      {/* Version Sidebar */}
      <BPMNVersionSidebar
        versions={versions}
        selectedVersion={selectedVersion}
        onSelectVersion={setSelectedVersion}
        onAddVersion={handleAddVersion}
      />

      {/* Main Editor Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <div className="h-16 border-b border-border bg-card px-6 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-4">
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-semibold text-foreground">
                  {language === "PT" ? "Diagrama BPMN" : "BPMN Diagram"}
                </h1>
                {isDraft && (
                  <Badge className="bg-[#FEF3C7] text-[#92400E] text-[11px]">
                    {language === "PT" ? "Rascunho" : "Draft"}
                  </Badge>
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                {currentVersion?.label} - {currentVersion?.date}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Status */}
            <div className="flex items-center gap-2 bg-muted/50 px-3 py-1.5 rounded-md">
              <div className={cn("w-2 h-2 rounded-full", mode === "editor" ? "bg-primary" : "bg-green-500")} />
              <span className="text-xs font-medium">
                {mode === "editor" ? (language === "PT" ? "Editando" : "Editing") : (language === "PT" ? "Visualizando" : "Viewing")}
              </span>
            </div>

            {/* Mode Toggle */}
            <div className="flex items-center bg-muted/50 rounded-lg p-0.5">
              <button
                onClick={() => setMode("viewer")}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-all",
                  mode === "viewer" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                )}
              >
                <Eye className="h-3.5 w-3.5" />
                {language === "PT" ? "Visualizar" : "View"}
              </button>
              <button
                onClick={() => setMode("editor")}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-all",
                  mode === "editor" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                )}
              >
                <Edit2 className="h-3.5 w-3.5" />
                {language === "PT" ? "Editar" : "Edit"}
              </button>
            </div>

            {/* Editar com IA Button */}
            <button
              type="button"
              onClick={() => setAiChatOpen((prev) => !prev)}
              className={cn(
                "inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-[13px] font-semibold border transition-all shrink-0",
                aiChatOpen
                  ? "bg-primary/10 border-primary/40 text-primary shadow-sm"
                  : "bg-card border-border text-foreground hover:border-primary/40 hover:text-primary"
              )}
            >
              <Sparkles className="h-3.5 w-3.5 text-primary" />
              {language === "PT" ? "Editar com IA" : "Edit with AI"}
            </button>

            {mode === "editor" && (
              <>
                <Button variant="ghost" size="sm" className="h-8 text-muted-foreground">
                  <Clock className="h-3.5 w-3.5 mr-1.5" />
                  {language === "PT" ? "Salvar Rascunho" : "Save Draft"}
                </Button>
                <Button variant="corporate" size="sm" className="h-8">
                  {language === "PT" ? "Publicar" : "Publish"}
                </Button>
              </>
            )}

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem 
                  onClick={() => {
                    fetch("/documents/IT_Prepaid_Amortization_Process.bpmn")
                      .then(response => response.blob())
                      .then(blob => {
                        const url = window.URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        a.href = url;
                        a.download = 'IT_Prepaid_Amortization_Process.bpmn';
                        document.body.appendChild(a);
                        a.click();
                        a.remove();
                        window.URL.revokeObjectURL(url);
                      });
                  }}
                  className="flex items-center cursor-pointer"
                >
                  <Download className="h-4 w-4 mr-2" />
                  {language === "PT" ? "Baixar BPMN (XML)" : "Download BPMN (XML)"}
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <History className="h-4 w-4 mr-2" />
                  {language === "PT" ? "Histórico" : "History"}
                </DropdownMenuItem>
                <DropdownMenuItem className="text-destructive">
                  <Trash2 className="h-4 w-4 mr-2" />
                  {language === "PT" ? "Excluir" : "Delete"}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Draft Alert */}
        {isDraft && isNewlyGenerated && (
          <div className="px-6 py-3 bg-[#FEF3C7]/30 border-b border-[#F59E0B]/20 flex items-center gap-3">
            <AlertCircle className="h-4 w-4 text-[#92400E] shrink-0" />
            <p className="text-sm text-muted-foreground">
              {language === "PT"
                ? "Este diagrama foi gerado pela IA e está salvo como rascunho. Revise e publique quando estiver satisfeito."
                : "This diagram was generated by AI and is saved as draft. Review and publish when satisfied."}
            </p>
          </div>
        )}

        {/* Editor Content */}
        <div className="flex-1 flex overflow-hidden">
          {/* Palette - Only in Editor Mode */}
          {mode === "editor" && (
            <BPMNPalette
              onDragStart={() => {}}
              onGenerateFromPOP={handleGenerateFromPOP}
              hasPOP={hasPOP}
            />
          )}

          {/* Canvas Area */}
          <div className="flex-1 flex flex-col min-w-0">
            <BPMNToolbar
              mode={mode}
              zoom={zoom}
              onZoomIn={handleZoomIn}
              onZoomOut={handleZoomOut}
              onZoomReset={handleZoomReset}
              onUndo={() => {}}
              onRedo={() => {}}
              onDelete={handleDelete}
              onAlignLeft={() => {}}
              onAlignCenter={() => {}}
              onAlignRight={() => {}}
              onDistribute={() => {}}
              canUndo={historyIndex > 0}
              canRedo={historyIndex < history.length - 1}
              hasSelection={!!selectedElementId}
            />
            {spanLayerDemo ? (
              <BpmnIoViewer
                xml={bpmnXml}
                highlightedElementId={aiHighlightedElementId}
                modifiedElementIds={aiModifiedElementIds}
              />
            ) : (
              <BPMNCanvas
                mode={mode}
                elements={elements}
                connections={connections}
                phases={initialData.phases}
                zoom={zoom}
                onElementsChange={handleElementsChange}
                onConnectionsChange={setConnections}
                onSelectionChange={setSelectedElementId}
                selectedElementId={selectedElementId}
              />
            )}
          </div>

          {/* Properties Panel - Only in Editor Mode */}
          {mode === "editor" && (
            <BPMNPropertiesPanel
              selectedElement={selectedElement}
              onUpdateElement={handleUpdateElement}
              popSteps={popStepsForPanel}
            />
          )}
        </div>
      </div>

      {/* Right-side AI Edit Copilot Sidebar */}
      <DocAIEditSidebar
        mode="bpmn"
        open={aiChatOpen}
        onToggle={() => setAiChatOpen((prev) => !prev)}
        processName={processName}
        bpmnElements={elements}
        bpmnConnections={connections}
        bpmnXml={spanLayerDemo ? bpmnXml : undefined}
        onApplyBPMNProposal={handleApplyBPMNProposal}
        onFocusBPMNElement={handleFocusBPMNElement}
      />
    </div>
  );
}

export * from "./types";
