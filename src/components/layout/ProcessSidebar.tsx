import { List, FileText, GitBranch, SlidersHorizontal, ArrowLeft, Check, Settings2, Database, BookOpen, Plug, Wand2, Workflow } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/contexts/LanguageContext";

interface ProcessSidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  onBack: () => void;
  processName: string;
  hasPOP?: boolean;
  hasBPMN?: boolean;
  hasAttributes?: boolean;
  hasPreMapping?: boolean;
  mode?: "as-is" | "to-be";
  onModeChange?: (mode: "as-is" | "to-be") => void;
  toBeGenerated?: boolean;
  onOpenTransformPipeline?: () => void;
}

export function ProcessSidebar({ 
  activeTab, 
  onTabChange, 
  onBack, 
  processName,
  hasPOP = true,
  hasBPMN = true,
  hasAttributes = true,
  hasPreMapping = false,
  mode = "as-is",
  onModeChange,
  toBeGenerated = false,
  onOpenTransformPipeline,
}: ProcessSidebarProps) {
  const { language } = useLanguage();

  const asIsItems = [
    { id: "overview", label: language === "PT" ? "Visão Geral" : "Overview", icon: List, hasContent: false },
    { id: "pre-mapping", label: language === "PT" ? "Pré-Mapeamento" : "Pre-Mapping", icon: Wand2, hasContent: hasPreMapping },
    { id: "pop-sop", label: language === "PT" ? "POP" : "SOP", icon: FileText, hasContent: hasPOP },
    { id: "bpmn", label: "BPMN", icon: GitBranch, hasContent: hasBPMN },
    { id: "assessment", label: "Assessment", icon: SlidersHorizontal, hasContent: hasAttributes },
    { id: "process-attributes", label: language === "PT" ? "Atributos" : "Attributes", icon: Settings2, hasContent: false },
  ];

  const toBeItems = [
    { id: "tobe-bpmn", label: "BPMN (TO-BE)", icon: GitBranch, hasContent: false },
    { id: "tobe-fields", label: "Fields", icon: Database, hasContent: false },
    { id: "tobe-user-stories", label: "User Stories", icon: BookOpen, hasContent: false },
    // { id: "tobe-integrations", label: "Integrations", icon: Plug, hasContent: false },
  ];

  const navItems = mode === "to-be" ? (toBeGenerated ? toBeItems : []) : asIsItems;

  return (
    <aside className="w-[220px] shrink-0 border-r border-border bg-card flex flex-col fixed h-[calc(100vh-56px)] z-10">
      <div className="p-4 pt-5">
        {/* Breadcrumb */}
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-[13px] text-muted-foreground hover:text-primary transition-colors mb-6 group"
        >
          <ArrowLeft className="h-4 w-4 group-hover:-translate-x-0.5 transition-transform" />
          {language === "PT" ? "Voltar aos Processos" : "Back to Processes"}
        </button>
        
        {/* Process Name */}
        <h2 className="font-semibold text-foreground text-[16px] leading-[1.3] mb-4 line-clamp-2">
          {processName}
        </h2>

      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 px-3">
        <div className="space-y-1">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={cn(
                "w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-[14px] transition-all duration-150",
                activeTab === item.id
                  ? "bg-sidebar-accent text-primary border-l-[3px] border-primary pl-[9px] font-medium"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
              )}
            >
              <item.icon className="h-4 w-4 shrink-0" />
              <span className="flex-1 text-left">{item.label}</span>
              {item.hasContent && (
                <Check className="h-4 w-4 text-green-500 shrink-0" />
              )}
            </button>
          ))}
        </div>
      </nav>

      {/* Highlighted: Transformation Pipeline */}
      {onOpenTransformPipeline && (
        <div className="px-3 pt-2 pb-4">
          <button
            onClick={onOpenTransformPipeline}
            className={cn(
              "w-full group relative overflow-hidden rounded-lg p-3 text-left transition-all duration-200 hover:shadow-md",
              activeTab === "transform-pipeline" && "ring-2 ring-offset-2 ring-primary/40"
            )}
            style={{
              background: "linear-gradient(135deg, #0C1BA8 0%, #1E35D4 100%)",
              color: "#fff",
              boxShadow: "0 4px 14px rgba(12,27,168,0.25)",
            }}
          >
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-md bg-white/15 flex items-center justify-center shrink-0">
                <Workflow className="h-4 w-4" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-[12.5px] font-semibold leading-tight">
                  {language === "PT" ? "Esteira de Transformação" : "Transformation Pipeline"}
                </div>
              </div>
            </div>
          </button>
        </div>
      )}
    </aside>
  );
}
