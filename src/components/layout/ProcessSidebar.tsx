import { List, FileText, GitBranch, SlidersHorizontal, ArrowLeft, Check, Settings2, Database, BookOpen, Wand2, Wrench, Workflow, Layers, Sparkles, BarChart3, type LucideIcon } from "lucide-react";
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
  customizationCount?: number;
}

interface SidebarItem {
  id: string;
  label: string;
  icon: LucideIcon;
  hasContent: boolean;
  count?: number;
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
  customizationCount = 0,
}: ProcessSidebarProps) {
  const { language } = useLanguage();

  const asIsGroups = [
    {
      name: "",
      items: [
        { id: "overview", label: language === "PT" ? "Visão Geral" : "Overview", icon: List, hasContent: false },
      ]
    },
    {
      name: language === "PT" ? "Diagnóstico & Contexto" : "Diagnosis & Context",
      items: [
        { id: "context", label: language === "PT" ? "Contexto" : "Context", icon: Layers, hasContent: true },
        { id: "assessment", label: "Assessment", icon: SlidersHorizontal, hasContent: hasAttributes },
        { id: "pre-mapping", label: language === "PT" ? "Pré-Mapeamento" : "Pre-Mapping", icon: Wand2, hasContent: hasPreMapping },
      ]
    },
    {
      name: language === "PT" ? "Processos & Documentação" : "Processes & Documentation",
      items: [
        { id: "bpmn", label: "BPMN", icon: GitBranch, hasContent: hasBPMN },
        { id: "pop-sop", label: language === "PT" ? "POP" : "SOP", icon: FileText, hasContent: hasPOP },
        { id: "process-attributes", label: language === "PT" ? "Atributos" : "Attributes", icon: Settings2, hasContent: false },
      ]
    },
    {
      name: language === "PT" ? "Gestão & Melhoria" : "Management & Improvement",
      items: [
        { id: "indicators", label: language === "PT" ? "Indicadores" : "Indicators", icon: BarChart3, hasContent: true },
        { id: "modifications", label: language === "PT" ? "Modificações" : "Modifications", icon: Wrench, hasContent: false, count: customizationCount },
        { id: "transformation", label: language === "PT" ? "Transformação" : "Transformation", icon: Sparkles, hasContent: true },
      ]
    }
  ];

  const toBeGroups = [
    {
      name: "",
      items: [
        { id: "tobe-bpmn", label: "BPMN (TO-BE)", icon: GitBranch, hasContent: false },
        { id: "tobe-fields", label: "Fields", icon: Database, hasContent: false },
        { id: "tobe-user-stories", label: "User Stories", icon: BookOpen, hasContent: false },
      ]
    }
  ];

  const navGroups = mode === "to-be" ? (toBeGenerated ? toBeGroups : []) : asIsGroups;

  return (
    <aside className="w-[240px] shrink-0 border-r border-border bg-card flex flex-col fixed h-[calc(100vh-56px)] z-10">
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
      <nav className="flex-1 overflow-y-auto px-3 pb-4">
        <div className="space-y-5">
          {navGroups.map((group, groupIdx) => (
            <div key={groupIdx}>
              {group.name && (
                <h3 className="px-3 text-[10px] font-bold text-muted-foreground uppercase tracking-[0.06em] mb-1.5">
                  {group.name}
                </h3>
              )}
              <div className="space-y-1">
                {group.items.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => onTabChange(item.id)}
                    className={cn(
                      "w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13px] font-medium transition-all duration-150",
                      activeTab === item.id
                        ? "bg-sidebar-accent text-primary border-l-[3px] border-primary pl-[9px]"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                    )}
                  >
                    <item.icon className="h-4 w-4 shrink-0" />
                    <span className="flex-1 text-left">{item.label}</span>
                    {typeof item.count === "number" && item.count > 0 && (
                      <span className={cn(
                        "min-w-5 h-5 px-1.5 rounded-full flex items-center justify-center text-[10px] font-semibold",
                        activeTab === item.id ? "bg-primary text-primary-foreground" : "bg-violet-100 text-violet-700"
                      )}>
                        {item.count}
                      </span>
                    )}
                    {item.hasContent && (
                      <Check className="h-3.5 w-3.5 text-green-500 shrink-0" />
                    )}
                  </button>
                ))}
              </div>
            </div>
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
