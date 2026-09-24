import { useMemo, useState } from "react";
import { 
  Building2, User, Clock, FileText, CheckCircle2, AlertCircle, 
  ShieldCheck, TrendingUp, Layers, Plus, Pencil, Share2, 
  ExternalLink, ArrowRight, CornerDownRight, Check, AlertTriangle,
  HelpCircle, ChevronRight, ArrowLeft, Target, Gem, Sparkles, Component,
  Milestone, ArrowUpRight, ArrowDownLeft, Users, TableProperties
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
}: ScopeContextSheetProps) {
  const { language } = useLanguage();
  const pt = language === "PT";
  const { label: lvl, maxLevel, isLeaf } = useTaxonomy();

  // Nome formatado do nível
  const currentLevelLabel = lvl(levelKey);
  const childLevelKey = (`l${Math.min(4, Number(levelKey.slice(1)) + 1)}` as TaxonomyLevel);
  const childLevelLabel = lvl(childLevelKey);

  const [isIndicatorsModalOpen, setIsIndicatorsModalOpen] = useState(false);
  const [isGapsModalOpen, setIsGapsModalOpen] = useState(false);
  const [isRaciModalOpen, setIsRaciModalOpen] = useState(false);

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
    <div className="flex flex-col w-full gap-4 animate-in fade-in-50 duration-200">
      {/* ── Top Breadcrumb ── */}
      <nav className="flex items-center gap-2 text-xs text-[#71809A] flex-wrap px-1">
        {breadcrumbs.map((crumb, idx) => (
          <span key={idx} className="flex items-center gap-2">
            {idx > 0 && <ChevronRight className="h-3.5 w-3.5 text-[#A5A7B0]" />}
            <button
              onClick={crumb.onClick}
              className={cn(
                "transition-all flex items-center gap-1.5",
                idx === breadcrumbs.length - 1 
                  ? "font-bold text-[#15233B] cursor-default bg-white px-2.5 py-1.5 rounded-md shadow-sm border border-[#DFE5EF]" 
                  : "text-[#4D5A72] font-medium hover:bg-white hover:text-[#1327b9] hover:shadow-sm px-2.5 py-1.5 rounded-md"
              )}
            >
              {crumb.label}
            </button>
          </span>
        ))}
      </nav>

      <div className="flex flex-col lg:flex-row items-start gap-4 w-full">
        
        {/* ── Left Sidebar (Header & Meta) ── */}
        <aside className="w-full lg:w-[280px] xl:w-[300px] shrink-0 lg:sticky lg:top-4 flex flex-col gap-2">

        <div className="bg-white border border-[#DFE5EF] rounded-xl shadow-[0_8px_32px_rgba(20,35,70,0.05)] p-4 relative overflow-hidden flex flex-col">
          {/* Subtle background glow effect for premium feel */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-[#1327b9]/[0.02] to-transparent rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl pointer-events-none" />
          
          <div className="relative z-10 flex flex-col flex-1">
            
            {/* Tags */}
            <div className="inline-flex items-center gap-2 mb-4">
              <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded bg-[#E8EDFF] text-[#1327b9]">
                {levelKey.toUpperCase()} · {currentLevelLabel}
              </span>
              {code && (
                <span className="text-[11px] font-mono text-[#71809A] bg-[#F5F7FB] px-1.5 py-0.5 rounded border border-[#DFE5EF]">
                  {code}
                </span>
              )}
            </div>

            {/* Título e Descrição */}
            <h1 className="text-2xl font-bold text-[#15233B] tracking-tight leading-tight mb-3">
              {name}
            </h1>

            {description && (
              <p className="text-[13px] text-[#71809A] leading-relaxed mb-4">
                {description}
              </p>
            )}

            {/* Metadados obrigatórios em coluna */}
            <div className="flex flex-col gap-2 pt-3 border-t border-[#DFE5EF]/60">
              <div className="flex items-center gap-2 bg-[#F5F7FB] border border-[#DFE5EF] px-2.5 py-1.5 rounded-lg text-xs text-[#4D5A72]">
                <User className="h-3.5 w-3.5 text-[#1327b9] shrink-0" />
                <div className="flex flex-col">
                  <span className="text-[9px] text-[#71809A] uppercase tracking-wider font-semibold">{pt ? "Responsável" : "Responsible"}</span>
                  <strong className="text-[#15233B] font-semibold leading-tight text-[11px]">
                    {responsibleName}
                    {responsibleRole && <span className="font-normal text-[#71809A]"> ({responsibleRole})</span>}
                  </strong>
                </div>
              </div>

              <div className="flex items-center gap-2 bg-[#F5F7FB] border border-[#DFE5EF] px-2.5 py-1.5 rounded-lg text-xs text-[#4D5A72]">
                <Building2 className="h-3.5 w-3.5 text-[#7648E7] shrink-0" />
                <div className="flex flex-col">
                  <span className="text-[9px] text-[#71809A] uppercase tracking-wider font-semibold">{pt ? "Unidade de negócio" : "Business Unit"}</span>
                  <strong className="text-[#15233B] font-semibold leading-tight text-[11px]">
                    {businessUnit || (pt ? "Não informada" : "Not specified")}
                  </strong>
                </div>
              </div>

              <div className="flex items-center gap-2 bg-[#F5F7FB] border border-[#DFE5EF] px-2.5 py-1.5 rounded-lg text-xs text-[#4D5A72]">
                <div className="h-3.5 w-3.5 flex items-center justify-center shrink-0">
                  <span className="h-2 w-2 rounded-full bg-[#1327b9]" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[9px] text-[#71809A] uppercase tracking-wider font-semibold">{pt ? "Dimensionamento" : "Sizing"}</span>
                  <div className="flex items-center gap-1.5 leading-tight">
                    <strong className="text-[#15233B] font-semibold text-[11px]">
                      {dimensioning 
                        ? `${dimensioning.allocatedFte} ${dimensioning.unit || "FTE"}`
                        : (pt ? "N/A" : "N/A")}
                    </strong>
                    {dimensioning && (
                      <span className={cn(
                        "text-[8px] px-1 py-0.5 rounded font-bold uppercase tracking-wider",
                        dimensioning.validationStatus === "validado" ? "bg-[#E3FAEF] text-[#008B5C]" : "bg-[#FFF2D2] text-[#B97100]"
                      )}>
                        {dimensioning.validationStatus === "validado" ? (pt ? "validado" : "validated") : (pt ? "estimado" : "estimated")}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {validationPercent !== undefined && (
                <div className="flex items-center gap-2 bg-[#F5F7FB] border border-[#DFE5EF] px-2.5 py-1.5 rounded-lg text-xs text-[#4D5A72]">
                  <ShieldCheck className="h-3.5 w-3.5 text-[#008B5C] shrink-0" />
                  <div className="flex flex-col">
                    <span className="text-[9px] text-[#71809A] uppercase tracking-wider font-semibold">{pt ? "Documentação gerada" : "Generated documentation"}</span>
                    <strong className="text-[#008B5C] font-semibold leading-tight text-[11px]">{validationPercent}%</strong>
                  </div>
                </div>
              )}

              {lastUpdate && (
                <div className="flex items-center gap-2 bg-[#F5F7FB] border border-[#DFE5EF] px-2.5 py-1.5 rounded-lg text-xs text-[#4D5A72]">
                  <Clock className="h-3.5 w-3.5 text-[#8A96A9] shrink-0" />
                  <div className="flex flex-col">
                    <span className="text-[9px] text-[#71809A] uppercase tracking-wider font-semibold">{pt ? "Revisão" : "Revision"}</span>
                    <strong className="text-[#15233B] font-semibold leading-tight text-[11px]">{lastUpdate}</strong>
                  </div>
                </div>
              )}

              {/* Botão Matriz RACI (especificamente no nível L4 e etapa correspondente) */}
              {(levelKey === "l4" || id === "l3-conceituacao" || levelKey === "l3") && (
                <div className="pt-2 mt-2 border-t border-[#DFE5EF]/60">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsRaciModalOpen(true)}
                    className="w-full text-xs h-9 bg-gradient-to-r from-[#F0F4FF] to-[#E8EDFF] hover:from-[#E4ECFF] hover:to-[#D8E4FF] text-[#1327b9] border border-[#CCD9FF] font-semibold shadow-xs flex items-center justify-between px-3 group transition-all duration-200"
                  >
                    <div className="flex items-center gap-2">
                      <TableProperties className="h-4 w-4 text-[#1327b9] group-hover:scale-105 transition-transform" />
                      <span>{pt ? "Matriz RACI" : "RACI Matrix"}</span>
                    </div>
                    <span className="text-[9px] px-1.5 py-0.5 rounded font-bold uppercase tracking-wider bg-[#1327b9]/10 text-[#1327b9]">
                      RACI
                    </span>
                  </Button>
                </div>
              )}
            </div>

            {/* Ações de cabeçalho */}
            <div className="flex flex-col gap-2 pt-4 mt-2 border-t border-[#DFE5EF]/60">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={onEdit || (() => toast.info(pt ? "Edição da ficha em breve" : "Editing coming soon"))}
                className="text-[11px] h-8 border-[#CFD7E6] text-[#1A2A48] hover:border-[#1327b9] hover:text-[#1327b9] w-full"
              >
                <Pencil className="h-3 w-3 mr-1.5" />
                {pt ? "Editar" : "Edit"}
              </Button>

              {onViewRelations && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={onViewRelations}
                  className="text-[11px] h-8 border-[#CFD7E6] text-[#1A2A48] hover:border-[#1327b9] hover:text-[#1327b9] w-full"
                >
                  <Share2 className="h-3 w-3 mr-1.5" />
                  {pt ? "Relações" : "Relations"}
                </Button>
              )}

              <Button 
                size="sm" 
                onClick={onAddChild || (() => toast.info(pt ? `Adicionar ${childLevelLabel}` : `Add ${childLevelLabel}`))}
                className="text-[11px] h-8 bg-[#1327b9] hover:bg-[#2743D7] text-white w-full"
              >
                <Plus className="h-3 w-3 mr-1.5" />
                {centralMapType === "leaf_parent"
                  ? (pt ? "Criar processo" : "Create process")
                  : (pt ? `Adicionar ${childLevelLabel}` : `Add ${childLevelLabel}`)}
              </Button>
            </div>
          </div>
        </div>
      </aside>

      {/* ── Main Area (Content) ── */}
      <main className="flex-1 min-w-0 space-y-4">
      {/* ── Hero Cards: Objetivo & Proposta de Valor ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Objetivo — Premium Blue Hero */}
        <div className="relative overflow-hidden rounded-2xl border border-[#C8D4F0] bg-gradient-to-br from-[#1327b9]/[0.06] via-[#E8EDFF]/80 to-white p-4 lg:p-5 shadow-[0_6px_24px_rgba(19,39,185,0.06)] hover:shadow-[0_12px_36px_rgba(19,39,185,0.12)] transition-all duration-300 group">
          {/* Decorative glow */}
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-[#1327b9]/[0.06] rounded-full blur-2xl pointer-events-none group-hover:scale-125 transition-transform duration-500" />
          <div className="absolute bottom-0 left-0 w-20 h-20 bg-[#5B6DE8]/[0.04] rounded-full blur-xl pointer-events-none" />
          <div className="relative z-10">
            <div className="flex items-center gap-2.5 mb-3">
              <div className="w-8 h-8 rounded-lg bg-[#1327b9]/10 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-300">
                <Target className="h-4.5 w-4.5 text-[#1327b9]" />
              </div>
              <h3 className="text-[11px] font-extrabold uppercase tracking-[0.12em] text-[#1327b9]">
                {pt ? "Objetivo" : "Objective"}
              </h3>
            </div>
            <p className="text-[13px] text-[#1A2A48] font-medium leading-[1.7] tracking-[-0.01em]">
              {objective || (pt ? "Objetivo não informado para este componente." : "Objective not specified.")}
            </p>
          </div>
        </div>

        {/* Proposta de Valor — Premium Amber Hero */}
        <div className="relative overflow-hidden rounded-2xl border border-[#F0DBA0] bg-gradient-to-br from-[#ED9C12]/[0.06] via-[#FFF8E7]/80 to-white p-4 lg:p-5 shadow-[0_6px_24px_rgba(237,156,18,0.06)] hover:shadow-[0_12px_36px_rgba(237,156,18,0.12)] transition-all duration-300 group">
          {/* Decorative glow */}
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-[#ED9C12]/[0.06] rounded-full blur-2xl pointer-events-none group-hover:scale-125 transition-transform duration-500" />
          <div className="absolute bottom-0 left-0 w-20 h-20 bg-[#F5C542]/[0.04] rounded-full blur-xl pointer-events-none" />
          <div className="relative z-10">
            <div className="flex items-center gap-2.5 mb-3">
              <div className="w-8 h-8 rounded-lg bg-[#ED9C12]/10 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-300">
                <Gem className="h-4.5 w-4.5 text-[#C17E00]" />
              </div>
              <h3 className="text-[11px] font-extrabold uppercase tracking-[0.12em] text-[#C17E00]">
                {pt ? "Proposta de valor" : "Value proposition"}
              </h3>
            </div>
            <p className="text-[13px] text-[#1A2A48] font-medium leading-[1.7] tracking-[-0.01em]">
              {valueProposition || (pt ? "Proposta de valor não informada para este componente." : "Value proposition not specified.")}
            </p>
          </div>
        </div>
      </div>

      {/* ── Escopo e Contexto ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Fronteira de Escopo / Início e Fim */}
        {startCondition || endCondition ? (
          <>
            <div className="bg-white border border-[#DFE5EF] rounded-xl p-4 shadow-[0_4px_16px_rgba(20,35,70,0.03)]">
              <h3 className="text-[10px] font-bold uppercase tracking-wider text-[#72809A] mb-1.5">
                {pt ? "Condição de início" : "Start condition"}
              </h3>
              <p className="text-xs text-[#34445F] leading-relaxed">
                {startCondition || (pt ? "Não informado" : "Not specified")}
              </p>
            </div>
            <div className="bg-white border border-[#DFE5EF] rounded-xl p-4 shadow-[0_4px_16px_rgba(20,35,70,0.03)]">
              <h3 className="text-[10px] font-bold uppercase tracking-wider text-[#72809A] mb-1.5">
                {pt ? "Condição de término" : "End condition"}
              </h3>
              <p className="text-xs text-[#34445F] leading-relaxed">
                {endCondition || (pt ? "Não informado" : "Not specified")}
              </p>
            </div>
          </>
        ) : (
          <div className="md:col-span-2 bg-white border border-[#DFE5EF] rounded-xl overflow-hidden shadow-[0_4px_16px_rgba(20,35,70,0.03)]">
            <div className="flex items-center gap-2 px-5 py-3 border-b border-[#DFE5EF] bg-[#F8FAFF]">
              <Milestone className="h-3.5 w-3.5 text-[#1327b9]" />
              <h3 className="text-[11px] font-bold uppercase tracking-wider text-[#1327b9]">
                {pt ? "Fronteira de escopo" : "Scope boundary"}
              </h3>
            </div>
            <p className="text-xs text-[#34445F] leading-relaxed px-5 py-3">
              {scopeBoundary || (pt ? "Não informado" : "Not specified")}
            </p>
          </div>
        )}

        {/* Bloco de Entradas, Stakeholders e Saídas */}
        <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Entradas */}
          <div className="bg-white border border-[#DFE5EF] rounded-xl overflow-hidden shadow-[0_4px_16px_rgba(20,35,70,0.03)]">
            <div className="flex items-center gap-2 px-5 py-3 border-b border-[#DFE5EF] bg-[#F8FAFF]">
              <ArrowDownLeft className="h-3.5 w-3.5 text-[#1327b9]" />
              <h3 className="text-[11px] font-bold uppercase tracking-wider text-[#1327b9]">
                {pt ? "Entradas e Direcionadores" : "Inputs and Drivers"}
              </h3>
            </div>
            <p className="text-xs text-[#34445F] leading-relaxed px-5 py-3">
              {inputs || (pt ? "Entradas não detalhadas formalmente." : "Inputs not detailed formally.")}
            </p>
          </div>
          
          {/* Stakeholders / Destinos */}
          <div className="bg-white border border-[#DFE5EF] rounded-xl overflow-hidden shadow-[0_4px_16px_rgba(20,35,70,0.03)]">
            <div className="flex items-center gap-2 px-5 py-3 border-b border-[#DFE5EF] bg-[#F8FAFF]">
              <Users className="h-3.5 w-3.5 text-[#7648E7]" />
              <h3 className="text-[11px] font-bold uppercase tracking-wider text-[#7648E7]">
                {pt ? "Stakeholders / Destinos" : "Stakeholders / Destinations"}
              </h3>
            </div>
            <p className="text-xs text-[#34445F] leading-relaxed px-5 py-3">
              {stakeholders || (pt ? "Público-alvo não detalhado formalmente." : "Stakeholders not detailed formally.")}
            </p>
          </div>

          {/* Saídas */}
          <div className="bg-white border border-[#DFE5EF] rounded-xl overflow-hidden shadow-[0_4px_16px_rgba(20,35,70,0.03)]">
            <div className="flex items-center gap-2 px-5 py-3 border-b border-[#DFE5EF] bg-[#F8FAFF]">
              <ArrowUpRight className="h-3.5 w-3.5 text-[#008B5C]" />
              <h3 className="text-[11px] font-bold uppercase tracking-wider text-[#008B5C]">
                {pt ? "Saídas e Entregas" : "Outputs and Deliverables"}
              </h3>
            </div>
            <p className="text-xs text-[#34445F] leading-relaxed px-5 py-3">
              {outputs || (pt ? "Saídas não detalhadas formalmente." : "Outputs not detailed formally.")}
            </p>
          </div>
        </div>
      </div>

      {/* ── MAPA CENTRAL DE COMPOSIÇÃO — Premium Section ── */}
      <div className="relative overflow-hidden rounded-2xl border border-[#D4DAE8] bg-gradient-to-b from-white via-white to-[#F8FAFF] p-5 lg:p-6 shadow-[0_8px_32px_rgba(20,35,70,0.05)] space-y-4">
        {/* Decorative accent line */}
        <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-[#1327b9] via-[#7648E7] to-[#1327b9]/20" />
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#7648E7]/15 to-[#1327b9]/10 flex items-center justify-center shadow-sm">
              <Component className="h-5 w-5 text-[#6633D0]" />
            </div>
            <div>
              <h3 className="text-[15px] font-bold tracking-tight text-[#15233B] flex items-center gap-2">
                {pt ? "Composição do Domínio" : "Domain Composition"}
              </h3>
              <p className="text-[11px] text-[#8A96A9] mt-0.5">
                {childrenComponents.length} {childrenComponents.length === 1 ? (pt ? "componente" : "component") : (pt ? "componentes" : "components")} {childLevelLabel}
              </p>
            </div>
          </div>
          <span className="inline-flex items-center gap-1.5 bg-[#EFE8FF] text-[#6633D0] px-3 py-1 rounded-lg text-[11px] font-bold uppercase tracking-wider">
            <Sparkles className="h-3.5 w-3.5" />
            {childLevelLabel}
          </span>
        </div>

        {/* Conteúdo dinâmico do mapa */}
        {childrenComponents.length === 0 ? (
          <div className="bg-[#FBFCFF] border border-dashed border-[#DFE5EF] rounded-xl p-10 text-center text-xs text-[#8A96A9] flex flex-col items-center justify-center">
            <div className="w-12 h-12 rounded-full bg-[#F0F3F8] flex items-center justify-center mb-3">
              <Layers className="h-6 w-6 text-[#A5A7B0]" />
            </div>
            <p className="text-sm text-[#71809A] font-medium">
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
                    className="w-[260px] text-left p-4 bg-white border border-[#DCE3EF] rounded-xl transition-all duration-200 hover:border-[#7648E7] hover:shadow-[0_12px_32px_rgba(118,72,231,0.1)] hover:-translate-y-0.5 group relative overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-[#7648E7]/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="relative z-10">
                      <span className="text-[9px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-sm bg-[#EFE8FF] text-[#6633D0]">
                        {child.levelLabel}
                      </span>
                      <b className="block text-[13px] text-[#263754] font-semibold mt-2 group-hover:text-[#6633D0] transition-colors">
                        {child.name}
                      </b>
                      {child.description && (
                        <small className="block text-[11px] text-[#7C889E] mt-1.5 line-clamp-2 leading-relaxed">
                          {child.description}
                        </small>
                      )}
                    </div>
                  </button>

                  {idx < childrenComponents.length - 1 && (
                    <div className="flex flex-col items-center gap-0.5 shrink-0">
                      <span className="text-[#7648E7] text-xl">→</span>
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
                    ? "border-[#B8E6D4] hover:border-[#008B5C] hover:shadow-[0_12px_32px_rgba(0,139,92,0.1)]"
                    : "border-[#DCE3EF] hover:border-[#7648E7] hover:shadow-[0_12px_32px_rgba(118,72,231,0.1)]"
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
        <div className="bg-white border border-[#DFE5EF] rounded-xl p-4 shadow-[0_4px_16px_rgba(20,35,70,0.03)] flex flex-col">
          <div className="flex items-center justify-between mb-3 border-b border-[#DFE5EF] pb-2.5">
            <h3 className="text-xs font-bold text-[#15233B] flex items-center gap-1.5">
              <TrendingUp className="h-4 w-4 text-[#1327b9]" />
              {pt ? "Indicadores de Saúde" : "Health Indicators"}
            </h3>
            {indicators.length > 0 && (
              <Badge variant="outline" className="text-[10px] bg-[#F5F7FB] border-[#DFE5EF] text-[#63718A]">
                {indicators.length} {indicators.length === 1 ? (pt ? "indicador" : "indicator") : (pt ? "indicadores" : "indicators")}
              </Badge>
            )}
          </div>
          {indicators.length === 0 ? (
            <div className="flex flex-col items-center justify-center flex-1 py-6 text-center">
              <div className="h-8 w-8 rounded-full bg-[#F5F7FB] flex items-center justify-center mb-2">
                <TrendingUp className="h-4 w-4 text-[#A5A7B0]" />
              </div>
              <p className="text-xs text-[#8A96A9] italic max-w-[200px]">
                {pt ? "Nenhum indicador vinculado a este nível no momento." : "No indicators linked to this level."}
              </p>
            </div>
          ) : (
            <div className="flex-1 flex flex-col justify-between">
              <ul className="divide-y divide-[#F0F3F8] mb-4">
                {indicators.slice(0, 3).map((ind, i) => (
                  <li key={i} className="py-2.5 flex items-center justify-between text-xs group">
                    <span className="flex items-center gap-2.5 text-[#4D5A72] flex-1">
                      <span className={cn(
                        "h-2 w-2 rounded-full shrink-0 shadow-sm",
                        ind.status === "dentro_da_meta" ? "bg-[#008B5C] shadow-[#008B5C]/40" :
                        ind.status === "atencao" ? "bg-[#ED9C12] shadow-[#ED9C12]/40" :
                        ind.status === "critico" ? "bg-[#E2484E] shadow-[#E2484E]/40" : "bg-[#A5A7B0]"
                      )} />
                      <span className="font-medium text-[#15233B] truncate group-hover:text-[#1327b9] transition-colors">{ind.name}</span>
                    </span>
                    <span className="text-xs font-semibold text-[#15233B] whitespace-nowrap pl-2">
                      {ind.currentValue} {ind.unit || ""} 
                    </span>
                  </li>
                ))}
                {indicators.length > 3 && (
                  <li className="py-2 text-center">
                    <span className="text-[10px] text-[#8A96A9] font-medium">
                      + {indicators.length - 3} {pt ? "indicadores ocultos" : "more indicators"}
                    </span>
                  </li>
                )}
              </ul>
              
              <Button 
                variant="outline" 
                className="w-full h-9 mt-auto border-[#DFE5EF] text-[#34445F] text-xs font-semibold hover:border-[#1327b9] hover:text-[#1327b9] bg-white transition-all shadow-sm hover:shadow-[0_4px_12px_rgba(19,39,185,0.06)] group"
                onClick={() => setIsIndicatorsModalOpen(true)}
              >
                {pt ? "Ver Todos os Indicadores" : "View All Indicators"}
                <ArrowRight className="h-3.5 w-3.5 ml-1.5 opacity-70 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
              </Button>
            </div>
          )}
        </div>

        {/* Painel: Sistemas */}
        <div className="bg-white border border-[#DFE5EF] rounded-xl p-4 shadow-[0_4px_16px_rgba(20,35,70,0.03)]">
          <h3 className="text-xs font-bold text-[#15233B] flex items-center gap-1.5 mb-3 border-b border-[#DFE5EF] pb-2.5">
            <Layers className="h-4 w-4 text-[#7648E7]" />
            {pt ? "Sistemas Utilizados" : "Systems Used"}
          </h3>
          {systems.length === 0 ? (
            <p className="text-xs text-[#8A96A9] italic">
              {pt ? "Nenhum sistema mapeado." : "No systems mapped."}
            </p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {systems.map((sys, idx) => (
                <span key={idx} className="text-xs bg-[#F5F7FB] border border-[#DFE5EF] px-2.5 py-1 rounded-sm text-[#34445F] font-medium">
                  {sys}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Painel: Normativos e Políticas */}
        <div className="bg-white border border-[#DFE5EF] rounded-xl p-4 shadow-[0_4px_16px_rgba(20,35,70,0.03)]">
          <h3 className="text-xs font-bold text-[#15233B] flex items-center gap-1.5 mb-3 border-b border-[#DFE5EF] pb-2.5">
            <ShieldCheck className="h-4 w-4 text-[#008B5C]" />
            {pt ? "Normativos e Políticas" : "Policies & Regulations"}
          </h3>
          {policies.length === 0 ? (
            <p className="text-xs text-[#8A96A9] italic">
              {pt ? "Nenhum normativo associado." : "No policies linked."}
            </p>
          ) : (
            <ul className="divide-y divide-dashed divide-[#E0E5ED]">
              {policies.map((pol) => (
                <li key={pol.id} className="py-2.5 text-xs flex items-center justify-between gap-2">
                  <div>
                    <b className="block text-[#15233B] font-medium">{pol.name}</b>
                    <span className="text-[10px] text-[#71809A]">
                      {pol.type} · {pol.version}
                    </span>
                  </div>
                  <span className={cn(
                    "text-[9px] font-bold px-1.5 py-0.5 rounded-sm uppercase tracking-wider shrink-0",
                    pol.complianceStatus === "conforme" ? "bg-[#E3FAEF] text-[#008B5C]" : "bg-[#FFF2D2] text-[#B97100]"
                  )}>
                    {pol.complianceStatus || pol.status}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Painel: Dores e Riscos — card próprio */}
        <div className="bg-white border border-[#DFE5EF] rounded-xl p-4 shadow-[0_4px_16px_rgba(20,35,70,0.03)] flex flex-col">
          <h3 className="text-xs font-bold text-[#15233B] flex items-center gap-1.5 mb-3 border-b border-[#DFE5EF] pb-2.5">
            <AlertCircle className="h-4 w-4 text-[#ED9C12]" />
            {pt ? "Dores e Riscos" : "Pain Points & Risks"}
          </h3>
          {painPoints.length === 0 && openQuestions.length === 0 ? (
            <div className="flex flex-col items-center justify-center flex-1 py-6 text-center">
              <div className="h-8 w-8 rounded-full bg-[#FFF8ED] flex items-center justify-center mb-2">
                <AlertCircle className="h-4 w-4 text-[#F0C060]" />
              </div>
              <p className="text-xs text-[#8A96A9] italic">
                {pt ? "Nenhuma dor ou risco mapeado." : "No pain points or risks mapped."}
              </p>
            </div>
          ) : (
            <div className="flex-1 flex flex-col justify-between">
              <ul className="space-y-2 text-xs text-[#4D5A72] mb-4">
                {painPoints.map((pain, idx) => (
                  <li key={idx} className="flex items-start gap-1.5 leading-snug">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#E2484E] mt-1 shrink-0" />
                    <span>{pain}</span>
                  </li>
                ))}
                {openQuestions.map((q, idx) => (
                  <li key={idx} className="flex items-start gap-1.5 leading-snug">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#ED9C12] mt-1 shrink-0" />
                    <span className="text-[#B97100] font-medium">{q}</span>
                  </li>
                ))}
              </ul>
              <Button
                variant="outline"
                size="sm"
                className="w-full mt-auto h-8 text-[11px] border-[#DFE5EF] text-[#4D5A72] hover:border-[#ED9C12] hover:text-[#B97100] transition-all"
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
        levelLabel={`${levelKey.toUpperCase()} - ${currentLevelLabel}`}
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
    </div>
  );
}
