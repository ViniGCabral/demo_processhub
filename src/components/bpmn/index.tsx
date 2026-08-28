import { useState, useCallback } from "react";
import { ArrowLeft, Eye, Edit2, Clock, MoreHorizontal, Download, History, Trash2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/contexts/LanguageContext";
import { BPMNVersionSidebar } from "./BPMNVersionSidebar";
import { BPMNPalette } from "./BPMNPalette";
import { BPMNToolbar } from "./BPMNToolbar";
import { BPMNCanvas } from "./BPMNCanvas";
import { BPMNPropertiesPanel } from "./BPMNPropertiesPanel";
import { BPMNImageViewer } from "./BPMNImageViewer";
import { EditorMode, Version, BPMNElement, BPMNConnection, BPMNElementType, HistoryState } from "./types";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { SOPStep } from "@/stores/sopStore";
import { bpmnDataMap } from "@/data/bpmnData";

export interface BPMNEditorProps {
  hasBPMN: boolean;
  hasPOP: boolean;
  isNewlyGenerated?: boolean;
  popSteps?: SOPStep[];
  processId?: string;
  processName?: string;
  onBack?: () => void;
}

const isSpanLayerDemo = (name?: string) => {
  if (!name) return false;
  const n = name.toLowerCase();
  return n.includes("span") && n.includes("layer");
};

export function BPMNEditor({ hasBPMN, hasPOP, isNewlyGenerated = false, popSteps = [], processId, processName, onBack }: BPMNEditorProps) {
  const { language } = useLanguage();
  const [mode, setMode] = useState<EditorMode>("viewer");
  const [zoom, setZoom] = useState(100);
  const [selectedVersion, setSelectedVersion] = useState("v1");
  const [selectedElementId, setSelectedElementId] = useState<string | null>(null);
  
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
    // FASE 1 - Fluxo linear
    { id: "c1", type: "sequence-flow", sourceId: "start", targetId: "task-1-1", sourcePoint: { x: 0, y: 0 }, targetPoint: { x: 0, y: 0 } },
    { id: "c2", type: "sequence-flow", sourceId: "task-1-1", targetId: "task-1-2", sourcePoint: { x: 0, y: 0 }, targetPoint: { x: 0, y: 0 } },
    { id: "c3", type: "sequence-flow", sourceId: "task-1-2", targetId: "task-1-3", sourcePoint: { x: 0, y: 0 }, targetPoint: { x: 0, y: 0 } },
    { id: "c4", type: "sequence-flow", sourceId: "task-1-3", targetId: "gw-1", sourcePoint: { x: 0, y: 0 }, targetPoint: { x: 0, y: 0 } },
    { id: "c5", type: "sequence-flow", sourceId: "gw-1", targetId: "task-1-4", sourcePoint: { x: 0, y: 0 }, targetPoint: { x: 0, y: 0 }, label: "NÃO" },
    { id: "c6", type: "sequence-flow", sourceId: "gw-1", targetId: "task-1-5", sourcePoint: { x: 0, y: 0 }, targetPoint: { x: 0, y: 0 }, label: "SIM" },
    { id: "c7", type: "sequence-flow", sourceId: "task-1-4", targetId: "task-1-5", sourcePoint: { x: 0, y: 0 }, targetPoint: { x: 0, y: 0 } },

    // FASE 1 -> FASE 2
    { id: "c8", type: "sequence-flow", sourceId: "task-1-5", targetId: "task-2-1", sourcePoint: { x: 0, y: 0 }, targetPoint: { x: 0, y: 0 } },

    // FASE 2 - Fluxo com gateway
    { id: "c9", type: "sequence-flow", sourceId: "task-2-1", targetId: "task-2-2", sourcePoint: { x: 0, y: 0 }, targetPoint: { x: 0, y: 0 } },
    { id: "c10", type: "sequence-flow", sourceId: "task-2-2", targetId: "gw-2", sourcePoint: { x: 0, y: 0 }, targetPoint: { x: 0, y: 0 } },
    { id: "c11", type: "sequence-flow", sourceId: "gw-2", targetId: "task-2-3a", sourcePoint: { x: 0, y: 0 }, targetPoint: { x: 0, y: 0 }, label: "> 500km" },
    { id: "c12", type: "sequence-flow", sourceId: "gw-2", targetId: "task-2-3b", sourcePoint: { x: 0, y: 0 }, targetPoint: { x: 0, y: 0 }, label: "≤ 500km" },
    { id: "c13", type: "sequence-flow", sourceId: "task-2-3a", targetId: "task-2-4", sourcePoint: { x: 0, y: 0 }, targetPoint: { x: 0, y: 0 } },
    { id: "c14", type: "sequence-flow", sourceId: "task-2-3b", targetId: "task-2-4", sourcePoint: { x: 0, y: 0 }, targetPoint: { x: 0, y: 0 } },

    // FASE 2 -> FASE 3
    { id: "c15", type: "sequence-flow", sourceId: "task-2-4", targetId: "task-3-1", sourcePoint: { x: 0, y: 0 }, targetPoint: { x: 0, y: 0 } },

    // FASE 3 - Fluxo com gateway
    { id: "c16", type: "sequence-flow", sourceId: "task-3-1", targetId: "gw-3", sourcePoint: { x: 0, y: 0 }, targetPoint: { x: 0, y: 0 } },
    { id: "c17", type: "sequence-flow", sourceId: "gw-3", targetId: "task-3-2", sourcePoint: { x: 0, y: 0 }, targetPoint: { x: 0, y: 0 }, label: "SIM" },
    { id: "c18", type: "sequence-flow", sourceId: "gw-3", targetId: "task-3-3", sourcePoint: { x: 0, y: 0 }, targetPoint: { x: 0, y: 0 }, label: "NÃO" },
    { id: "c19", type: "sequence-flow", sourceId: "task-3-3", targetId: "task-3-4", sourcePoint: { x: 0, y: 0 }, targetPoint: { x: 0, y: 0 } },

    // FASE 3 -> FASE 4
    { id: "c20", type: "sequence-flow", sourceId: "task-3-2", targetId: "task-4-1", sourcePoint: { x: 0, y: 0 }, targetPoint: { x: 0, y: 0 } },
    { id: "c21", type: "sequence-flow", sourceId: "task-3-4", targetId: "task-4-1", sourcePoint: { x: 0, y: 0 }, targetPoint: { x: 0, y: 0 } },

    // FASE 4 - Fluxo final
    { id: "c22", type: "sequence-flow", sourceId: "task-4-1", targetId: "task-4-2", sourcePoint: { x: 0, y: 0 }, targetPoint: { x: 0, y: 0 } },
    { id: "c23", type: "sequence-flow", sourceId: "task-4-2", targetId: "task-4-3", sourcePoint: { x: 0, y: 0 }, targetPoint: { x: 0, y: 0 } },
    { id: "c24", type: "sequence-flow", sourceId: "task-4-3", targetId: "end", sourcePoint: { x: 0, y: 0 }, targetPoint: { x: 0, y: 0 } },
  ];

  const spanLayerDemo = isSpanLayerDemo(processName);

  // Get BPMN data from map if available, otherwise use IT Prepaid as demo default
  // DEMO MODE: For new processes (no explicit data), use IT Prepaid mock data
  const getInitialData = () => {
    if (spanLayerDemo && bpmnDataMap["span-layer"]) {
      return bpmnDataMap["span-layer"];
    }
    if (processId && bpmnDataMap[processId]) {
      return bpmnDataMap[processId];
    }
    // Return IT Prepaid data as demo default, otherwise fall back to default elements
    return bpmnDataMap["7"] || { elements: defaultElements, connections: defaultConnections };
  };

  const initialData = getInitialData();
  const [elements, setElements] = useState<BPMNElement[]>(initialData.elements);
  const [connections, setConnections] = useState<BPMNConnection[]>(initialData.connections);

  // Version management - always start as V1 Draft for demo
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
    popSteps.forEach((step, idx) => {
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

  const popStepsForPanel = popSteps.map((s) => ({ id: s.id, title: s.title }));

  return (
    <div className="flex h-full animate-fade-in">
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
                        document.body.removeChild(a);
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
            
            {/* SVG Viewer for all processes in Viewer Mode - always show the SVG diagram */}
            {mode === "viewer" ? (
              <BPMNImageViewer 
                imageSrc={spanLayerDemo ? "/documents/BPMN_Span_Layer.jpg" : "/documents/BPMN_IT_Prepaid_Amortization_Process.svg"}
                alt={spanLayerDemo ? "Span & Layer BPMN Diagram" : "IT Prepaid Amortization Process BPMN Diagram"}
                zoom={zoom}
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
    </div>
  );
}

export * from "./types";
