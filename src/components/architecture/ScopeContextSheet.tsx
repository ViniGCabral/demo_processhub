import { useMemo, useState } from "react";
import { 
  Building2, User, Clock, FileText, CheckCircle2, AlertCircle, 
  ShieldCheck, TrendingUp, Layers, Plus, Pencil, Share2, 
  ExternalLink, ArrowRight, CornerDownRight, Check, AlertTriangle,
  HelpCircle, ChevronRight, ArrowLeft, Target, Gem, Sparkles, Component,
  Milestone, ArrowUpRight, ArrowDownLeft, Users, TableProperties,
  LayoutGrid, GitBranch, ChevronDown, Network, MoreHorizontal, Download
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTaxonomy, TaxonomyLevel } from "@/stores/taxonomyStore";
import { 
  ArchBaseScopeFields, ArchitecturePolicyLink, ComponentDimensioning, 
  ComponentResponsible, ProcessRelation, ProcessContextData, BusinessIndicator 
} from "@/types/architectureContextTypes";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { ArchitectureIndicatorsModal } from "./ArchitectureIndicatorsModal";
import { GapsDetailModal } from "./GapsDetailModal";
import { RaciMatrixModal } from "./modals/RaciMatrixModal";
import { ProcessFlowEditor } from "./ProcessFlowEditor";
import { useProcessFlowStore } from "@/stores/processFlowStore";
import { ArchitectureActionButtons } from "./ArchitectureActionButtons";

export interface BreadcrumbStep {
  label: string;
  levelLabel?: string;
  onClick: () => void;
}

export interface ChildComponentCard {
  id: string;
  name: string;
  description?: string;
  levelKey: TaxonomyLevel | "process";
  levelLabel: string;
  statsText?: string;
  isOperationalProcess?: boolean;
  bpmnAvailable?: boolean;
  activitiesCount?: number;
  systemsCount?: number;
  exceptionsCount?: number;
  onClick: () => void;
}

export interface ScopeContextSheetProps {
  // Identificação do nó
  id: string;
  name: string;
  description?: string;
  levelKey: TaxonomyLevel;
  code?: string;
  
  // Breadcrumb
  breadcrumbs: BreadcrumbStep[];
  
  // Governança & Dimensionamento
  responsible?: ComponentResponsible | string;
  businessUnit?: string;
  dimensioning?: ComponentDimensioning;
  lastUpdate?: string;
  validationPercent?: number;
  
  // Escopo
  objective?: string;
  valueProposition?: string;
  scopeBoundary?: string;
  startCondition?: string;
  endCondition?: string;
  inputs?: string;
  outputs?: string;
  stakeholders?: string;
  
  // Relações & Mapa Central
  centralMapType: "superior" | "intermediate" | "leaf_parent";
  childrenComponents?: ChildComponentCard[];
  explicitRelations?: ProcessRelation[];
  
  // Listagens inferiores
  policies?: ArchitecturePolicyLink[];
  indicators?: Array<{
    name: string;
    currentValue: string;
    target: string;
    unit?: string;
    status?: "dentro_da_meta" | "atencao" | "critico" | "sem_dados";
  }>;
  systems?: string[];
  painPoints?: string[];
  evidences?: string[];
  openQuestions?: string[];
  
  // Ações
  onEdit?: () => void;
  onAddChild?: () => void;
  onViewRelations?: () => void;
  onSelectProcess?: (process: any) => void;
  siblingComponents?: ChildComponentCard[];
}

export function ScopeContextSheet({
  id,
  name,
  description,
  levelKey,
  code,
  breadcrumbs,
  responsible,
  businessUnit,
  dimensioning,
  lastUpdate,
  validationPercent,
  objective,
  valueProposition,
  scopeBoundary,
  startCondition,
  endCondition,
  inputs,
  outputs,
  stakeholders,
  centralMapType,
  childrenComponents = [],
  explicitRelations = [],
  policies = [],
  indicators = [],
  systems = [],
  painPoints = [],
  evidences = [],
  openQuestions = [],
  onEdit,
  onAddChild,
  onViewRelations,
  onSelectProcess,
  siblingComponents,
}: ScopeContextSheetProps) {
  const { language } = useLanguage();
  const pt = language === "PT";
  const { label: lvl, maxLevel, isLeaf, sidebarVisibility } = useTaxonomy();

  // Nome formatado do nível
  const currentLevelLabel = lvl(levelKey);
  const childLevelKey = (`l${Math.min(4, Number(levelKey.slice(1)) + 1)}` as TaxonomyLevel);
  const childLevelLabel = lvl(childLevelKey);

  const [isIndicatorsModalOpen, setIsIndicatorsModalOpen] = useState(false);
  const [isGapsModalOpen, setIsGapsModalOpen] = useState(false);
  const [isRaciModalOpen, setIsRaciModalOpen] = useState(false);

  // ── Process Flow toggle: cards vs flow ──
  const hasDefaultFlow = useProcessFlowStore(
    (s) => !!(s.flows[id] || []).find((f) => f.isDefault)
  );
  // Only start in 'flow' mode if it's a leaf node
  const [viewMode, setViewMode] = useState<"cards" | "flow">(isLeaf(levelKey) && hasDefaultFlow ? "flow" : "cards");

  // Responsável formatado
  const responsibleName = typeof responsible === "string" 
    ? responsible 
    : responsible?.name || "Não informado";
  const responsibleRole = typeof responsible === "object" && responsible?.role 
    ? responsible.role 
    : typeof responsible === "object" && responsible?.title 
      ? responsible.title 
      : null;

  return (
    <div className="flex flex-col lg:flex-row items-start w-full bg-[#f8fafc] animate-in fade-in-50 duration-200 h-[calc(100vh-125px)] overflow-hidden">
      
      {/* ── Left Sidebar (Tree & Governance) ── */}
      <aside className="w-full lg:w-[320px] shrink-0 h-full overflow-y-auto bg-white border-r border-[#e5e7eb] flex flex-col py-4 px-5">
        
        {/* Back to Cadeia de Valor */}
        <button onClick={breadcrumbs[0]?.onClick} className="text-[#ea580c] hover:underline flex items-center gap-2 text-xs font-semibold mb-4 w-fit">
          <ArrowLeft className="h-3.5 w-3.5" />
          <span className="flex items-center gap-1.5"><Layers className="h-4 w-4" /> {pt ? "Cadeia de Valor" : "Value Chain"}</span>
        </button>

        {/* Title and Badge */}
        <div className="mb-4">
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight leading-tight mb-2">
            {name}
          </h1>
          <div className="flex items-center gap-2">
            <span className="bg-orange-100 text-orange-600 text-[10px] font-bold px-2 py-0.5 rounded-sm uppercase tracking-wider">
              {currentLevelLabel} {code && code}
            </span>
          </div>
        </div>

        {/* Actions (Editar / Exportar / ...) */}
        <div className="flex items-center gap-2 mb-5 border-b border-slate-100 pb-4">
          <Button variant="outline" className="flex-1 border-orange-200 text-orange-600 hover:bg-orange-50 hover:text-orange-700 h-9 text-xs font-medium bg-orange-50/30" onClick={onEdit}>
            <Pencil className="h-3.5 w-3.5 mr-2" /> {pt ? "Editar nível" : "Edit level"}
          </Button>
          <Button variant="outline" className="flex-1 border-slate-200 text-slate-600 hover:bg-slate-50 h-9 text-xs font-medium">
            <Download className="h-3.5 w-3.5 mr-2" /> {pt ? "Exportar" : "Export"}
          </Button>
          <Button variant="outline" className="w-9 h-9 p-0 border-slate-200 text-slate-600 hover:bg-slate-50">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </div>

        {/* CADEIA DE VALOR Tree */}
        <div className="mb-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{pt ? "Cadeia de Valor" : "Value Chain"}</span>
            <span className="text-[10px] font-medium text-slate-400">{pt ? "Contexto ativo" : "Active context"}</span>
          </div>

          <div className="flex flex-col relative before:absolute before:left-[11px] before:top-3 before:bottom-4 before:w-px before:bg-slate-200 ml-1">
            {/* Breadcrumb path to current node */}
            {breadcrumbs.slice(1, -1).map((crumb, idx) => (
              <div key={idx} onClick={crumb.onClick} className="flex items-start gap-3 relative z-10 mb-2 group cursor-pointer hover:-translate-y-px transition-transform">
                <div className="w-6 h-6 rounded bg-slate-50 border border-slate-200 flex items-center justify-center shrink-0 group-hover:bg-slate-100">
                  <CornerDownRight className="h-3 w-3 text-slate-400" />
                </div>
                <div className="flex items-center gap-2 pt-0.5">
                  <span className="text-[9px] font-bold bg-slate-100 text-slate-500 px-1.5 rounded">{crumb.levelLabel || "N0"}</span>
                  <span className="text-xs font-medium text-slate-600 group-hover:text-slate-900">{crumb.label}</span>
                </div>
              </div>
            ))}

            {/* Current Node and Siblings */}
            {siblingComponents && siblingComponents.length > 0 ? (
              siblingComponents.map((sib) => {
                if (sib.id === id) {
                  return (
                    <div key={sib.id} className="flex items-start gap-3 relative z-10 mb-2 mt-1">
                      <div className="w-6 h-6 rounded bg-orange-100 flex items-center justify-center shrink-0 ring-4 ring-white">
                        <Layers className="h-3.5 w-3.5 text-orange-600" />
                      </div>
                      <div className="flex items-center gap-2 pt-0.5">
                        <span className="text-[9px] font-bold bg-orange-500 text-white px-1.5 rounded">{currentLevelLabel}</span>
                        <span className="text-xs font-bold text-orange-600">{sib.name}</span>
                      </div>
                    </div>
                  );
                } else {
                  return (
                    <div key={sib.id} onClick={sib.onClick} className="flex items-start gap-3 relative z-10 mb-2 group cursor-pointer hover:-translate-y-px transition-transform">
                      <div className="w-6 h-6 rounded bg-slate-50 border border-slate-200 flex items-center justify-center shrink-0 group-hover:bg-slate-100">
                        <Layers className="h-3.5 w-3.5 text-slate-400" />
                      </div>
                      <div className="flex items-center gap-2 pt-0.5">
                        <span className="text-[9px] font-bold bg-slate-100 text-slate-500 px-1.5 rounded">{sib.levelLabel}</span>
                        <span className="text-xs font-medium text-slate-600 group-hover:text-slate-900">{sib.name}</span>
                      </div>
                    </div>
                  );
                }
              })
            ) : (
              <div className="flex items-start gap-3 relative z-10 mb-2 mt-1">
                <div className="w-6 h-6 rounded bg-orange-100 flex items-center justify-center shrink-0 ring-4 ring-white">
                  <Layers className="h-3.5 w-3.5 text-orange-600" />
                </div>
                <div className="flex items-center gap-2 pt-0.5">
                  <span className="text-[9px] font-bold bg-orange-500 text-white px-1.5 rounded">{currentLevelLabel}</span>
                  <span className="text-xs font-bold text-orange-600">{name}</span>
                </div>
              </div>
            )}

            {/* Children Nodes (only if not showing siblings) */}
            {(!siblingComponents || siblingComponents.length === 0) && childrenComponents.map((child, idx) => (
              <div key={child.id} onClick={child.onClick} className="flex items-start gap-3 relative z-10 mb-1 group cursor-pointer hover:-translate-y-px transition-transform pl-[3px]">
                <div className="absolute left-[-15px] top-3 w-3.5 h-px bg-slate-200" />
                <div className="w-5 h-5 rounded bg-white border border-slate-200 flex items-center justify-center shrink-0 group-hover:bg-slate-50">
                  <Network className="h-2.5 w-2.5 text-slate-400" />
                </div>
                <div className="flex items-center gap-2 pt-0.5">
                  <span className="text-[9px] font-bold bg-slate-100 text-slate-500 px-1.5 rounded">{child.levelLabel}</span>
                  <span className="text-[11px] font-medium text-slate-600 group-hover:text-slate-900 truncate">{child.name}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CONTEXTO E GOVERNANÇA */}
        <div>
          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">{pt ? "Contexto e Governança" : "Context and Governance"}</div>
          <div className="flex flex-col gap-2">
            {sidebarVisibility.responsible && (
              <div>
                <span className="block text-[9px] font-bold text-slate-400 uppercase mb-0.5">{pt ? "Responsável" : "Responsible"}</span>
                <span className="text-xs font-semibold text-slate-700">{responsibleName}</span>
              </div>
            )}
            {sidebarVisibility.businessUnit && (
              <div>
                <span className="block text-[9px] font-bold text-slate-400 uppercase mb-0.5">{pt ? "Unidade de Negócio" : "Business Unit"}</span>
                <span className="text-xs font-semibold text-slate-700 flex items-center gap-2">
                  {businessUnit || (pt ? "Não informada" : "Not specified")} 
                  <span className="w-5 h-5 rounded-full bg-fuchsia-500 text-white flex items-center justify-center text-[10px] font-bold">J</span>
                </span>
              </div>
            )}
            {sidebarVisibility.sizing && (
              <div className="flex items-center gap-3 mt-1">
                <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center shrink-0">
                  <Users className="h-4 w-4 text-slate-400" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[9px] text-slate-400 uppercase">{pt ? "Dimensionamento" : "Sizing"}</span>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-slate-700">{dimensioning ? `${dimensioning.allocatedFte} ${dimensioning.unit || "FTE"}` : "N/A"}</span>
                    {dimensioning && (
                      <span className="text-[8px] font-bold uppercase text-emerald-600 tracking-wider">
                        - {dimensioning.validationStatus === "validado" ? (pt ? "Validado" : "Validated") : (pt ? "Estimado" : "Estimated")}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            )}
            {sidebarVisibility.documentationPercent && validationPercent !== undefined && (
              <div className="flex items-center gap-3 mt-1">
                <div className="w-8 h-8 rounded-full bg-orange-50 flex items-center justify-center shrink-0">
                  <FileText className="h-4 w-4 text-orange-400" />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-end mb-1">
                    <span className="text-[9px] text-slate-400 uppercase">{pt ? "Documentação gerada" : "Generated documentation"}</span>
                    <span className="text-xs font-bold text-slate-700">{validationPercent}%</span>
                  </div>
                  <div className="h-1 bg-slate-200 rounded-full overflow-hidden">
                    <div className="h-full bg-orange-500 rounded-full" style={{ width: `${validationPercent}%` }} />
                  </div>
                </div>
              </div>
            )}
            {sidebarVisibility.lastUpdate && lastUpdate && (
              <div className="flex items-center gap-3 mt-1">
                <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center shrink-0">
                  <Clock className="h-4 w-4 text-slate-400" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[9px] text-slate-400 uppercase">{pt ? "Revisão" : "Revision"}</span>
                  <span className="text-xs font-bold text-slate-700">{lastUpdate}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* ── Main Area (Content) ── */}
      <main className="flex-1 min-w-0 p-8 h-full overflow-y-auto">
        {/* Top Breadcrumb Nav */}
        <div className="flex items-center gap-2 mb-8 bg-white border border-slate-200 px-3 py-2 rounded-lg shadow-sm w-fit">
          <button onClick={breadcrumbs.length > 1 ? breadcrumbs[breadcrumbs.length - 2].onClick : breadcrumbs[0].onClick} className="text-orange-500 hover:text-orange-600 transition-colors flex items-center gap-2 text-xs font-semibold">
             <ArrowLeft className="h-4 w-4" />
             {breadcrumbs.length > 1 ? breadcrumbs[breadcrumbs.length - 2].label : breadcrumbs[0].label}
          </button>
          <ChevronRight className="h-3 w-3 text-slate-300" />
          <span className="bg-orange-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider">
            {pt ? "Nível Ativo" : "Active Level"}
          </span>
          <span className="text-xs font-bold text-orange-600 flex items-center gap-1">
            {currentLevelLabel} - {name} <ChevronDown className="h-3 w-3 ml-1" />
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
            <div className="flex items-center gap-2.5 mb-3">
              <div className="w-8 h-8 rounded-full bg-orange-50 flex items-center justify-center">
                <Target className="h-4 w-4 text-orange-500" />
              </div>
              <h3 className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                {pt ? "Objetivo" : "Objective"}
              </h3>
            </div>
            <p className="text-[13px] text-slate-700 font-medium leading-relaxed">
              {objective || (pt ? "Objetivo não informado para este componente." : "Objective not specified.")}
            </p>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
            <div className="flex items-center gap-2.5 mb-3">
              <div className="w-8 h-8 rounded-full bg-orange-50 flex items-center justify-center">
                <Gem className="h-4 w-4 text-orange-500" />
              </div>
              <h3 className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                {pt ? "Proposta de valor" : "Value proposition"}
              </h3>
            </div>
            <p className="text-[13px] text-slate-700 font-medium leading-relaxed">
              {valueProposition || (pt ? "Proposta de valor não informada para este componente." : "Value proposition not specified.")}
            </p>
          </div>
        </div>

      {/* ── Escopo e Contexto ── */}
      {/* ── Escopo e Contexto ── */}
      <div className="grid grid-cols-1 gap-4 mb-4">
        {/* Fronteira de Escopo / Início e Fim */}
        {startCondition || endCondition ? (
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
              <h3 className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-2">
                {pt ? "Condição de início" : "Start condition"}
              </h3>
              <p className="text-xs text-slate-700 leading-relaxed">
                {startCondition || (pt ? "Não informado" : "Not specified")}
              </p>
            </div>
            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
              <h3 className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-2">
                {pt ? "Condição de término" : "End condition"}
              </h3>
              <p className="text-xs text-slate-700 leading-relaxed">
                {endCondition || (pt ? "Não informado" : "Not specified")}
              </p>
            </div>
          </div>
        ) : (
          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
            <div className="flex items-center gap-2 px-5 py-3 border-b border-slate-100">
              <Milestone className="h-4 w-4 text-orange-500" />
              <h3 className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                {pt ? "Fronteira de escopo" : "Scope boundary"}
              </h3>
            </div>
            <p className="text-xs text-slate-700 leading-relaxed px-5 py-4">
              {scopeBoundary || (pt ? "Não informado" : "Not specified")}
            </p>
          </div>
        )}

        {/* Bloco de Entradas, Stakeholders e Saídas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
            <div className="flex items-center gap-2 px-5 py-3 border-b border-slate-100">
              <ArrowDownLeft className="h-4 w-4 text-orange-500" />
              <h3 className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                {pt ? "Entradas e Direcionadores" : "Inputs and Drivers"}
              </h3>
            </div>
            <p className="text-xs text-slate-700 leading-relaxed px-5 py-4">
              {inputs || (pt ? "Entradas não detalhadas formalmente." : "Inputs not detailed formally.")}
            </p>
          </div>
          
          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
            <div className="flex items-center gap-2 px-5 py-3 border-b border-slate-100">
              <Users className="h-4 w-4 text-orange-500" />
              <h3 className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                {pt ? "Stakeholders / Destinos" : "Stakeholders / Destinations"}
              </h3>
            </div>
            <p className="text-xs text-slate-700 leading-relaxed px-5 py-4">
              {stakeholders || (pt ? "Público-alvo não detalhado formalmente." : "Stakeholders not detailed formally.")}
            </p>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
            <div className="flex items-center gap-2 px-5 py-3 border-b border-slate-100">
              <ArrowUpRight className="h-4 w-4 text-orange-500" />
              <h3 className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                {pt ? "Saídas e Entregas" : "Outputs and Deliverables"}
              </h3>
            </div>
            <p className="text-xs text-slate-700 leading-relaxed px-5 py-4">
              {outputs || (pt ? "Saídas não detalhadas formalmente." : "Outputs not detailed formally.")}
            </p>
          </div>
        </div>
      </div>

      {/* ── MAPA CENTRAL DE COMPOSIÇÃO — Premium Section ── */}
      {/* ── MAPA CENTRAL DE COMPOSIÇÃO — Premium Section ── */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm mb-4">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-slate-50 flex items-center justify-center shadow-sm border border-slate-100">
              <Component className="h-4 w-4 text-slate-500" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                {childLevelLabel} {pt ? "relacionados" : "related"}
              </h3>
              <p className="text-[11px] text-slate-400 mt-0.5">
                {childrenComponents.length} {childrenComponents.length === 1 ? (pt ? "componente conectado a este nível" : "component connected to this level") : (pt ? "componentes conectados a este nível" : "components connected to this level")}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {/* Toggle: Cards / Flow (apenas no último nível) */}
            {isLeaf(levelKey) && (
              <div className="flex items-center bg-[#F0F3F8] rounded-lg p-0.5">
                <button
                  onClick={() => setViewMode("cards")}
                  className={cn(
                    "flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[11px] font-semibold transition-all",
                    viewMode === "cards"
                      ? "bg-white text-[#1A2A48] shadow-sm"
                      : "text-[#7C889E] hover:text-[#4D5A72]"
                  )}
                >
                  <LayoutGrid className="h-3.5 w-3.5" />
                  {pt ? "Etapas/Processos" : "Steps/Processes"}
                </button>
                <button
                  onClick={() => setViewMode("flow")}
                  className={cn(
                    "flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[11px] font-semibold transition-all",
                    viewMode === "flow"
                      ? "bg-white text-[#1A2A48] shadow-sm"
                      : "text-[#7C889E] hover:text-[#4D5A72]"
                  )}
                >
                  <GitBranch className="h-3.5 w-3.5" />
                  {pt ? "Fluxos" : "Flows"}
                </button>
              </div>
            )}
            <span className="inline-flex items-center gap-1.5 hover:bg-slate-50 text-slate-600 border border-slate-200 cursor-pointer px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors">
              <Plus className="h-3.5 w-3.5" />
              {pt ? "Adicionar " : "Add "}{childLevelLabel}
            </span>
          </div>
        </div>

        {/* Conteúdo dinâmico do mapa — Cards view or Flow view */}
        {viewMode === "flow" && isLeaf(levelKey) ? (
          <ProcessFlowEditor
            parentNodeId={id}
            parentNodeName={name}
            availableProcesses={childrenComponents.map((c) => ({
              id: c.id,
              name: c.name,
              description: c.description,
            }))}
            visible={true}
            onSelectProcess={onSelectProcess}
          />
        ) : childrenComponents.length === 0 ? (
          <div className="bg-slate-50 border border-dashed border-slate-200 rounded-xl p-10 text-center text-xs text-slate-400 flex flex-col items-center justify-center">
            <div className="w-10 h-10 rounded-full bg-white border border-slate-100 flex items-center justify-center mb-3">
              <Layers className="h-5 w-5 text-slate-300" />
            </div>
            <p className="text-sm text-slate-500 font-medium">
              {centralMapType === "leaf_parent"
                ? (pt ? "Nenhum processo operacional vinculado ainda." : "No operational processes linked yet.")
                : (pt ? `Nenhum componente ${childLevelLabel} cadastrado neste nível.` : `No ${childLevelLabel} components registered.`)}
            </p>
          </div>
        ) : centralMapType === "intermediate" && explicitRelations.length > 0 ? (
          /* Layout de dependências */
          <div className="space-y-3">
            <div className="flex items-center gap-4 overflow-x-auto py-3 px-1">
              {childrenComponents.map((child, idx) => (
                <div key={child.id} className="flex items-center gap-4 shrink-0">
                  <button
                    onClick={child.onClick}
                    className="w-[260px] text-left p-4 bg-white border border-slate-200 rounded-xl transition-all duration-200 hover:border-orange-500 hover:shadow-md group relative overflow-hidden"
                  >
                    <div className="relative z-10">
                      <span className="text-[9px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-sm bg-orange-100 text-orange-600">
                        {child.levelLabel}
                      </span>
                      <b className="block text-[13px] text-slate-700 font-semibold mt-2 group-hover:text-orange-600 transition-colors">
                        {child.name}
                      </b>
                      {child.description && (
                        <small className="block text-[11px] text-slate-500 mt-1.5 line-clamp-2 leading-relaxed">
                          {child.description}
                        </small>
                      )}
                    </div>
                  </button>

                  {idx < childrenComponents.length - 1 && (
                    <div className="flex flex-col items-center gap-0.5 shrink-0">
                      <span className="text-orange-500 text-xl">→</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ) : (
          /* Grid padrão — Elevated cards */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {childrenComponents.map((child) => (
              <button
                key={child.id}
                onClick={child.onClick}
                className={cn(
                  "text-left p-4 bg-white border rounded-xl transition-all duration-200 hover:-translate-y-0.5 group flex flex-col justify-between min-h-[110px] relative overflow-hidden",
                  child.isOperationalProcess
                    ? "border-emerald-200 hover:border-emerald-500 hover:shadow-md"
                    : "border-slate-200 hover:border-orange-500 hover:shadow-md"
                )}
              >
                {/* Hover gradient overlay */}
                <div className={cn(
                  "absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300",
                  child.isOperationalProcess
                    ? "bg-gradient-to-br from-[#008B5C]/[0.02] to-transparent"
                    : "bg-gradient-to-br from-[#7648E7]/[0.02] to-transparent"
                )} />
                <div className="relative z-10">
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <span className={cn(
                      "text-[9px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded",
                      child.isOperationalProcess 
                        ? "bg-[#E3FAEF] text-[#008B5C]" 
                        : "bg-[#EFE8FF] text-[#6633D0]"
                    )}>
                      {child.levelLabel}
                    </span>
                    <ArrowRight className={cn(
                      "h-3.5 w-3.5 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all duration-200",
                      child.isOperationalProcess ? "text-[#008B5C]" : "text-[#7648E7]"
                    )} />
                  </div>

                  <b className={cn(
                    "block text-[13px] font-semibold transition-colors leading-snug",
                    child.isOperationalProcess
                      ? "text-[#263754] group-hover:text-[#008B5C]"
                      : "text-[#263754] group-hover:text-[#6633D0]"
                  )}>
                    {child.name}
                  </b>

                  {child.description && (
                    <small className="block text-[11px] text-[#7C889E] mt-1.5 line-clamp-2 leading-relaxed">
                      {child.description}
                    </small>
                  )}
                </div>

                {child.statsText && (
                  <div className="relative z-10 text-[10px] text-[#8A96A9] mt-3 pt-2 border-t border-[#DFE5EF]/60 font-medium">
                    {child.statsText}
                  </div>
                )}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* ── Painéis Inferiores em Múltiplas Colunas ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Painel: Indicadores */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-orange-500" />
              {pt ? "Indicadores de Saúde" : "Health Indicators"}
            </h3>
          </div>
          {indicators.length === 0 ? (
            <div className="flex flex-col items-center justify-center flex-1 py-4 text-center">
              <p className="text-xs text-slate-400 italic">
                {pt ? "Nenhum indicador vinculado a este nível no momento." : "No indicators linked to this level."}
              </p>
            </div>
          ) : (
            <div className="flex-1 flex flex-col justify-between">
              <ul className="space-y-3 mb-4">
                {indicators.slice(0, 3).map((ind, i) => (
                  <li key={i} className="flex items-center justify-between text-xs group">
                    <span className="flex items-center gap-2 text-slate-600 flex-1">
                      <span className="font-medium truncate">{ind.name}</span>
                    </span>
                    <span className={cn(
                      "text-xs font-bold whitespace-nowrap pl-2",
                      ind.status === "dentro_da_meta" ? "text-emerald-500" :
                      ind.status === "atencao" ? "text-orange-500" :
                      ind.status === "critico" ? "text-red-500" : "text-slate-600"
                    )}>
                      {ind.currentValue} {ind.unit || ""} 
                    </span>
                  </li>
                ))}
              </ul>
              
              <Button 
                variant="ghost" 
                className="w-full h-8 text-orange-600 text-[11px] font-bold hover:bg-orange-50 hover:text-orange-700 transition-colors"
                onClick={() => setIsIndicatorsModalOpen(true)}
              >
                {pt ? "Ver Todos os Indicadores" : "View All Indicators"}
              </Button>
            </div>
          )}
        </div>

        {/* Painel: Sistemas */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
          <h3 className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2 mb-4">
            <Layers className="h-4 w-4 text-orange-500" />
            {pt ? "Sistemas Utilizados" : "Systems Used"}
          </h3>
          {systems.length === 0 ? (
            <p className="text-xs text-slate-400 italic">
              {pt ? "Nenhum sistema mapeado." : "No systems mapped."}
            </p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {systems.map((sys, idx) => (
                <span key={idx} className="text-[10px] font-bold bg-slate-100 text-slate-600 px-2 py-1 rounded-sm">
                  {sys}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Painel: Normativos e Políticas */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
          <h3 className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2 mb-4">
            <ShieldCheck className="h-4 w-4 text-orange-500" />
            {pt ? "Normativos e Políticas" : "Policies & Regulations"}
          </h3>
          {policies.length === 0 ? (
            <p className="text-xs text-slate-400 italic">
              {pt ? "Nenhum normativo associado." : "No policies linked."}
            </p>
          ) : (
            <ul className="space-y-3">
              {policies.map((pol) => (
                <li key={pol.id} className="text-xs flex items-center justify-between gap-2 border-b border-slate-100 pb-2 last:border-0 last:pb-0">
                  <div className="flex flex-col">
                    <span className="text-slate-600 font-medium">{pol.name}</span>
                  </div>
                  <span className={cn(
                    "text-[9px] font-bold px-1.5 py-0.5 rounded-sm uppercase tracking-wider shrink-0",
                    pol.complianceStatus === "conforme" ? "text-emerald-600" : "text-orange-600"
                  )}>
                    {pol.complianceStatus || pol.status}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Painel: Dores e Riscos — card próprio */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm flex flex-col">
          <h3 className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2 mb-4">
            <AlertCircle className="h-4 w-4 text-orange-500" />
            {pt ? "Dores e Riscos" : "Pain Points & Risks"}
          </h3>
          {painPoints.length === 0 && openQuestions.length === 0 ? (
            <div className="flex flex-col items-center justify-center flex-1 py-4 text-center">
              <p className="text-xs text-slate-400 italic">
                {pt ? "Nenhuma dor ou risco mapeado." : "No pain points or risks mapped."}
              </p>
            </div>
          ) : (
            <div className="flex-1 flex flex-col justify-between">
              <ul className="space-y-2 text-xs text-slate-600 mb-4 list-disc pl-4">
                {painPoints.map((pain, idx) => (
                  <li key={idx} className="leading-snug text-slate-600 font-medium">
                    {pain}
                  </li>
                ))}
                {openQuestions.map((q, idx) => (
                  <li key={idx} className="leading-snug text-slate-600 font-medium">
                    {q}
                  </li>
                ))}
              </ul>
              <Button
                variant="ghost"
                size="sm"
                className="w-full mt-auto h-8 text-[11px] font-bold text-orange-600 hover:bg-orange-50 hover:text-orange-700 transition-colors"
                onClick={() => setIsGapsModalOpen(true)}
              >
                {pt ? "Detalhar Gaps / Casos de Uso" : "Detail Gaps / Use Cases"}
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* ── Nota de Rodapé Conceitual ── */}
      <p className="text-center text-[11px] text-[#8190A8] py-2 mt-4">
        {pt 
          ? "Estrutura visual padronizada; os campos e a nomenclatura de níveis são configuráveis por empresa." 
          : "Standardized visual architecture sheet; level labels and fields adapt to company settings."}
      </p>

      {/* ── Modal de Indicadores ── */}
      <ArchitectureIndicatorsModal
        isOpen={isIndicatorsModalOpen}
        onOpenChange={setIsIndicatorsModalOpen}
        levelLabel={currentLevelLabel}
        indicators={indicators}
      />
      
      {/* ── Modal de Gaps / Casos de Uso ── */}
      <GapsDetailModal
        open={isGapsModalOpen}
        onOpenChange={setIsGapsModalOpen}
        nodeName={name}
        initialGaps={painPoints}
      />

      {/* ── Modal da Matriz RACI ── */}
      <RaciMatrixModal
        open={isRaciModalOpen}
        onOpenChange={setIsRaciModalOpen}
        nodeId={id}
        nodeTitle={name}
        stageName={name}
        breadcrumbPath={breadcrumbs.map((b) => b.label).join(" › ")}
        fallbackProcedures={childrenComponents.map((c) => ({
          id: c.id,
          name: c.name,
          description: c.description
        }))}
      />
      </main>
    </div>
  );
}
