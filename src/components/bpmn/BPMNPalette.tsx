import { useState } from "react";
import { ChevronDown, ChevronRight, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { BPMNElementType } from "./types";
import { useLanguage } from "@/contexts/LanguageContext";

interface PaletteSection {
  id: string;
  title: string;
  titlePT: string;
  items: {
    id: BPMNElementType;
    label: string;
    labelPT: string;
  }[];
}

const paletteSections: PaletteSection[] = [
  {
    id: "events",
    title: "Events",
    titlePT: "Eventos",
    items: [
      { id: "start-event", label: "Start Event", labelPT: "Iniciar processo" },
      { id: "start-event-message", label: "Start (Message)", labelPT: "Iniciar por mensagem" },
      { id: "start-event-timer", label: "Start (Timer)", labelPT: "Iniciar por tempo" },
      { id: "end-event", label: "End Event", labelPT: "Fim do processo" },
      { id: "end-event-message", label: "End (Message)", labelPT: "Fim com mensagem" },
      { id: "intermediate-event", label: "Intermediate", labelPT: "Evento intermediário" },
    ],
  },
  {
    id: "activities",
    title: "Activities",
    titlePT: "Atividades",
    items: [
      { id: "task", label: "Task", labelPT: "Atividade padrão" },
      { id: "send-task", label: "Send Task", labelPT: "Enviar dados" },
      { id: "receive-task", label: "Receive Task", labelPT: "Receber dados" },
      { id: "user-task", label: "User Task", labelPT: "Tarefa de usuário" },
      { id: "manual-task", label: "Manual Task", labelPT: "Tarefa manual" },
      { id: "sub-process", label: "Sub-Process", labelPT: "Sub-processo" },
      { id: "call-activity", label: "Call Activity", labelPT: "Chamar atividade" },
    ],
  },
  {
    id: "gateways",
    title: "Gateways",
    titlePT: "Gateways",
    items: [
      { id: "gateway-exclusive", label: "Exclusive (XOR)", labelPT: "Decisão XOR" },
      { id: "gateway-inclusive", label: "Inclusive (OR)", labelPT: "Decisão OR" },
      { id: "gateway-parallel", label: "Parallel (AND)", labelPT: "Paralelismo AND" },
      { id: "gateway-event", label: "Event-Based", labelPT: "Baseado em evento" },
      { id: "gateway-complex", label: "Complex", labelPT: "Gateway complexo" },
    ],
  },
  {
    id: "connectors",
    title: "Connectors",
    titlePT: "Conectores",
    items: [
      { id: "sequence-flow", label: "Sequence Flow", labelPT: "Fluxo sequencial" },
      { id: "message-flow", label: "Message Flow", labelPT: "Fluxo de mensagem" },
      { id: "association", label: "Association", labelPT: "Associação" },
    ],
  },
  {
    id: "data",
    title: "Data",
    titlePT: "Dados",
    items: [
      { id: "data-object", label: "Data Object", labelPT: "Objeto de dados" },
      { id: "data-store", label: "Data Store", labelPT: "Armazenamento dados" },
      { id: "text-annotation", label: "Annotation", labelPT: "Anotação" },
      { id: "group", label: "Group", labelPT: "Agrupamento" },
    ],
  },
  {
    id: "swimlanes",
    title: "Swimlanes",
    titlePT: "Swimlanes",
    items: [
      { id: "pool", label: "Pool", labelPT: "Pool (participante)" },
      { id: "lane", label: "Lane", labelPT: "Lane (responsável)" },
    ],
  },
];

interface BPMNPaletteProps {
  onDragStart: (elementType: BPMNElementType) => void;
  onGenerateFromPOP: () => void;
  hasPOP: boolean;
}

function ElementIcon({ type, size = 20 }: { type: BPMNElementType; size?: number }) {
  const iconStyle = { width: size, height: size };

  // Events
  if (type === "start-event") {
    return (
      <div style={iconStyle} className="flex items-center justify-center">
        <div className="w-4 h-4 rounded-full border-2 border-current" />
      </div>
    );
  }
  if (type === "start-event-message") {
    return (
      <div style={iconStyle} className="flex items-center justify-center">
        <div className="w-4 h-4 rounded-full border-2 border-current relative">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-2 h-1.5 border border-current" />
          </div>
        </div>
      </div>
    );
  }
  if (type === "start-event-timer") {
    return (
      <div style={iconStyle} className="flex items-center justify-center">
        <div className="w-4 h-4 rounded-full border-2 border-current relative">
          <div className="absolute inset-0 flex items-center justify-center text-[6px]">⏱</div>
        </div>
      </div>
    );
  }
  if (type === "end-event") {
    return (
      <div style={iconStyle} className="flex items-center justify-center">
        <div className="w-4 h-4 rounded-full border-[3px] border-current" />
      </div>
    );
  }
  if (type === "end-event-message") {
    return (
      <div style={iconStyle} className="flex items-center justify-center">
        <div className="w-4 h-4 rounded-full border-[3px] border-current relative">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-2 h-1.5 bg-current" />
          </div>
        </div>
      </div>
    );
  }
  if (type === "intermediate-event") {
    return (
      <div style={iconStyle} className="flex items-center justify-center">
        <div className="w-4 h-4 rounded-full border-2 border-current relative">
          <div className="absolute inset-0.5 rounded-full border border-current" />
        </div>
      </div>
    );
  }

  // Activities
  if (type === "task" || type === "send-task" || type === "receive-task" || 
      type === "user-task" || type === "manual-task") {
    return (
      <div style={iconStyle} className="flex items-center justify-center">
        <div className="w-5 h-3.5 rounded border-2 border-current" />
      </div>
    );
  }
  if (type === "sub-process" || type === "call-activity") {
    return (
      <div style={iconStyle} className="flex items-center justify-center">
        <div className="w-5 h-3.5 rounded border-2 border-current relative">
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 text-[8px]">+</div>
        </div>
      </div>
    );
  }

  // Gateways
  if (type.startsWith("gateway")) {
    return (
      <div style={iconStyle} className="flex items-center justify-center">
        <div className="w-3.5 h-3.5 rotate-45 border-2 border-current" />
      </div>
    );
  }

  // Connectors
  if (type === "sequence-flow") {
    return (
      <div style={iconStyle} className="flex items-center justify-center">
        <svg viewBox="0 0 20 10" className="w-5 h-2.5">
          <line x1="0" y1="5" x2="15" y2="5" stroke="currentColor" strokeWidth="2" />
          <polygon points="20,5 14,2 14,8" fill="currentColor" />
        </svg>
      </div>
    );
  }
  if (type === "message-flow") {
    return (
      <div style={iconStyle} className="flex items-center justify-center">
        <svg viewBox="0 0 20 10" className="w-5 h-2.5">
          <line x1="0" y1="5" x2="15" y2="5" stroke="currentColor" strokeWidth="2" strokeDasharray="3,2" />
          <polygon points="20,5 14,2 14,8" fill="none" stroke="currentColor" strokeWidth="1" />
        </svg>
      </div>
    );
  }
  if (type === "association") {
    return (
      <div style={iconStyle} className="flex items-center justify-center">
        <svg viewBox="0 0 20 10" className="w-5 h-2.5">
          <line x1="0" y1="5" x2="20" y2="5" stroke="currentColor" strokeWidth="1" strokeDasharray="2,2" />
        </svg>
      </div>
    );
  }

  // Data
  if (type === "data-object") {
    return (
      <div style={iconStyle} className="flex items-center justify-center text-[14px]">📄</div>
    );
  }
  if (type === "data-store") {
    return (
      <div style={iconStyle} className="flex items-center justify-center text-[14px]">🗃</div>
    );
  }
  if (type === "text-annotation") {
    return (
      <div style={iconStyle} className="flex items-center justify-center text-[14px]">📋</div>
    );
  }
  if (type === "group") {
    return (
      <div style={iconStyle} className="flex items-center justify-center">
        <div className="w-4 h-3 border border-dashed border-current rounded" />
      </div>
    );
  }

  // Swimlanes
  if (type === "pool") {
    return (
      <div style={iconStyle} className="flex items-center justify-center">
        <div className="w-5 h-3 border-2 border-current flex">
          <div className="w-1 border-r border-current" />
          <div className="flex-1" />
        </div>
      </div>
    );
  }
  if (type === "lane") {
    return (
      <div style={iconStyle} className="flex items-center justify-center">
        <div className="w-5 h-2.5 border border-current" />
      </div>
    );
  }

  return null;
}

export function BPMNPalette({ onDragStart, onGenerateFromPOP, hasPOP }: BPMNPaletteProps) {
  const { language } = useLanguage();
  const [expandedSections, setExpandedSections] = useState<string[]>(
    paletteSections.map((s) => s.id)
  );

  const toggleSection = (id: string) => {
    setExpandedSections((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };

  const handleDragStart = (e: React.DragEvent, type: BPMNElementType) => {
    e.dataTransfer.setData("bpmn-element-type", type);
    e.dataTransfer.effectAllowed = "copy";
    onDragStart(type);
  };

  return (
    <div className="w-[200px] bg-card border-r border-border flex flex-col h-full overflow-hidden">
      {/* Header */}
      <div className="p-3 border-b border-border">
        <h3 className="text-[11px] font-semibold uppercase tracking-[0.5px] text-muted-foreground mb-3">
          {language === "PT" ? "Elementos BPMN" : "BPMN Elements"}
        </h3>
        
        {hasPOP && (
          <button
            onClick={onGenerateFromPOP}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-primary/10 text-primary rounded-lg text-xs font-medium hover:bg-primary/20 transition-colors"
          >
            <Sparkles className="h-3.5 w-3.5" />
            {language === "PT" ? "Gerar do POP" : "Generate from SOP"}
          </button>
        )}
      </div>

      {/* Sections */}
      <div className="flex-1 overflow-y-auto p-2">
        {paletteSections.map((section) => {
          const isExpanded = expandedSections.includes(section.id);
          
          return (
            <div key={section.id} className="mb-1">
              <button
                onClick={() => toggleSection(section.id)}
                className="w-full flex items-center gap-1 px-2 py-1.5 text-xs font-semibold text-foreground hover:bg-muted/50 rounded transition-colors"
              >
                {isExpanded ? (
                  <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
                ) : (
                  <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />
                )}
                {language === "PT" ? section.titlePT : section.title}
              </button>
              
              {isExpanded && (
                <div className="mt-0.5 space-y-0.5">
                  {section.items.map((item) => (
                    <div
                      key={item.id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, item.id)}
                      className="flex items-center gap-2 px-2 py-2 rounded-md cursor-grab hover:bg-muted/50 transition-colors group"
                    >
                      <div className="text-muted-foreground group-hover:text-primary transition-colors">
                        <ElementIcon type={item.id} />
                      </div>
                      <span className="text-xs text-foreground truncate">
                        {language === "PT" ? item.labelPT : item.label}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
