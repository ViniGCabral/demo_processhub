import { useMemo, useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { JourneyData, JourneyStepData, ProcessContextData } from "@/types/architectureContextTypes";
import { mockArchitectureData } from "@/data/architectureContextMock";
import { getProcessById } from "@/data/architectureContextUtils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { IndicatorCard } from "./IndicatorCard";
import { ValidationBadge } from "./ValidationBadge";
import { ProcessDetailModal } from "./ProcessDetailModal";
import { ProcessConnectionMapModal } from "@/components/process/connections/ProcessConnectionMapModal";
import { useProcessConnectionStore, RELATIONSHIP_LABELS } from "@/stores/processConnectionStore";
import { 
  Network, Settings, Clock, ArrowRight, ArrowLeft, ShieldCheck, Settings2, FileWarning, 
  Map, Monitor, GitBranch, BarChart3, Users, Building2, CheckCircle2, AlertTriangle, Info,
  Zap, Flag, Layers, Database, ExternalLink, GitFork, ChevronRight, Check, Activity, DollarSign,
  Briefcase, FileText, CornerDownRight, PlayCircle
} from "lucide-react";
import { cn } from "@/lib/utils";

interface JourneyDetailViewProps {
  journeyId: string;
  onGoBack: () => void;
  onEditJourney?: (journey: JourneyData) => void;
}

export function JourneyDetailView({ journeyId, onGoBack, onEditJourney }: JourneyDetailViewProps) {
  const { language } = useLanguage();
  const pt = language === "PT";

  const { getPredecessors, getSuccessors } = useProcessConnectionStore();

  const journey = useMemo(() => 
    mockArchitectureData.journeys.find(j => j.id === journeyId), 
  [journeyId]);

  // Tab ativa: padrão 'overview' conforme especificação!
  const [activeTab, setActiveTab] = useState<string>("overview");

  // Estado para visualização de processo em modal
  const [selectedProcessId, setSelectedProcessId] = useState<string | null>(null);
  const selectedProcess = useMemo(() => 
    selectedProcessId ? getProcessById(mockArchitectureData, selectedProcessId) || null : null, 
  [selectedProcessId]);

  // Estado para o Sheet lateral de detalhes da etapa do fluxo
  const [selectedStepForSheet, setSelectedStepForSheet] = useState<JourneyStepData | null>(null);

  // Estado para o Mapa de Conexões Locais do processo
  const [selectedProcessForConnMap, setSelectedProcessForConnMap] = useState<{
    id: string;
    name: string;
    domain?: string;
  } | null>(null);

  if (!journey) {
    return (
      <div className="p-8 text-center bg-white rounded-md border border-[#A5A7B0]/20">
        <p className="text-[#6B7280]">{pt ? "Jornada não encontrada." : "Journey not found."}</p>
        <Button onClick={onGoBack} className="mt-4" variant="outline">
          {pt ? "Voltar" : "Go Back"}
        </Button>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "validated": return "text-emerald-700 bg-emerald-50 border-emerald-200";
      case "validating": return "text-amber-700 bg-amber-50 border-amber-200";
      case "reference": return "text-blue-700 bg-blue-50 border-blue-200";
      default: return "text-gray-700 bg-gray-50 border-gray-200";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "validated": return pt ? "Validada" : "Validated";
      case "validating": return pt ? "Em Validação" : "Validating";
      case "reference": return pt ? "Referência" : "Reference";
      default: return status;
    }
  };

  // Pre-computar processos participantes completos
  const processDetails = useMemo(() => {
    return journey.participatingProcessIds
      .map(id => getProcessById(mockArchitectureData, id))
      .filter(Boolean) as ProcessContextData[];
  }, [journey]);

  // Agrupamento de etapas por Domínio para a Raia (Swimlanes)
  const swimlanesByDomain = useMemo(() => {
    const domainMap: Record<string, JourneyStepData[]> = {};

    journey.steps.forEach(step => {
      const proc = step.processId ? getProcessById(mockArchitectureData, step.processId) : null;
      const domain = step.domain || proc?.area || journey.mainDomain || "Geral";
      if (!domainMap[domain]) {
        domainMap[domain] = [];
      }
      domainMap[domain].push(step);
    });

    return Object.entries(domainMap).map(([domainName, steps]) => {
      const role = journey.domainRoles?.[domainName] || 
        (domainName === journey.mainDomain ? 'principal' : 'participante');
      return {
        domainName,
        role,
        steps: steps.sort((a, b) => a.order - b.order),
      };
    });
  }, [journey]);

  // Predecessores e sucessores da etapa selecionada para o Sheet lateral
  const stepProcessConnections = useMemo(() => {
    if (!selectedStepForSheet?.processId) return { predecessors: [], successors: [] };
    return {
      predecessors: getPredecessors(selectedStepForSheet.processId),
      successors: getSuccessors(selectedStepForSheet.processId),
    };
  }, [selectedStepForSheet, getPredecessors, getSuccessors]);

  return (
    <div className="flex flex-col h-full space-y-6 animate-in fade-in duration-200 pb-12">
      
      {/* HEADER SUPERIOR */}
      <div className="bg-white border border-[#A5A7B0]/20 rounded-xl p-6 shadow-sm">
        <div className="flex items-center justify-between gap-2 mb-4">
          <Button 
            variant="ghost" 
            onClick={onGoBack} 
            className="h-auto p-0 text-[#A5A7B0] hover:text-[#0C1BA8] flex items-center gap-1 font-semibold text-xs"
          >
            <ArrowLeft className="h-4 w-4" />
            {pt ? "Voltar para Jornadas" : "Back to Journeys"}
          </Button>

          <div className="flex items-center gap-2">
            {onEditJourney && (
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => onEditJourney(journey)} 
                className="h-8 text-xs border-[#0C1BA8]/30 text-[#0C1BA8] hover:bg-[#0C1BA8]/5"
              >
                <Settings2 className="h-3.5 w-3.5 mr-1.5" />
                {pt ? "Editar Jornada" : "Edit Journey"}
              </Button>
            )}
            {journey.status !== "validated" && (
              <Button 
                size="sm"
                className="h-8 text-xs bg-[#0C1BA8] hover:bg-[#04223D] text-white"
              >
                <CheckCircle2 className="h-3.5 w-3.5 mr-1.5" />
                {pt ? "Validar Jornada" : "Validate Journey"}
              </Button>
            )}
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between gap-6">
          <div className="flex-1 space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-[#0C1BA8]/10 text-[#0C1BA8] uppercase tracking-wide">
                {journey.mainDomain}
              </span>
              <span className={cn("text-[11px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wide border", getStatusColor(journey.status))}>
                {getStatusLabel(journey.status)}
              </span>
              {journey.suggestionConfidence && (
                <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-purple-50 text-purple-700 border border-purple-200 uppercase tracking-wide flex items-center gap-1">
                  <ShieldCheck className="h-3 w-3" />
                  {pt ? "Confiabilidade" : "Confidence"}: {journey.suggestionConfidence}%
                </span>
              )}
            </div>
            
            <h1 className="text-2xl font-black text-[#272727] tracking-tight">{journey.name}</h1>
            <p className="text-sm text-[#6B7280] max-w-4xl">{journey.description}</p>
          </div>
        </div>
      </div>

      {/* TABS DE NAVEGAÇÃO — 7 ABAS RIGOROSAMENTE DEFINIDAS */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
        <TabsList className="bg-transparent border-b border-[#A5A7B0]/20 w-full justify-start rounded-none p-0 h-auto space-x-1 sm:space-x-4 overflow-x-auto overflow-y-hidden pb-px">
          <TabsTrigger 
            value="overview" 
            className="data-[state=active]:border-b-2 data-[state=active]:border-[#0C1BA8] data-[state=active]:shadow-none rounded-none bg-transparent px-3 py-3 text-xs sm:text-sm font-bold text-[#6B7280] data-[state=active]:text-[#0C1BA8] flex items-center gap-1.5"
          >
            <Layers className="h-4 w-4" />
            {pt ? "Visão Geral" : "Overview"}
          </TabsTrigger>
          <TabsTrigger 
            value="flow" 
            className="data-[state=active]:border-b-2 data-[state=active]:border-[#0C1BA8] data-[state=active]:shadow-none rounded-none bg-transparent px-3 py-3 text-xs sm:text-sm font-bold text-[#6B7280] data-[state=active]:text-[#0C1BA8] flex items-center gap-1.5"
          >
            <GitBranch className="h-4 w-4" />
            {pt ? "Fluxo Ponta a Ponta" : "End-to-End Flow"}
          </TabsTrigger>
          <TabsTrigger 
            value="processes" 
            className="data-[state=active]:border-b-2 data-[state=active]:border-[#0C1BA8] data-[state=active]:shadow-none rounded-none bg-transparent px-3 py-3 text-xs sm:text-sm font-bold text-[#6B7280] data-[state=active]:text-[#0C1BA8] flex items-center gap-1.5"
          >
            <Network className="h-4 w-4" />
            {pt ? "Processos Participantes" : "Processes"} ({journey.participatingProcessIds.length})
          </TabsTrigger>
          <TabsTrigger 
            value="indicators" 
            className="data-[state=active]:border-b-2 data-[state=active]:border-[#0C1BA8] data-[state=active]:shadow-none rounded-none bg-transparent px-3 py-3 text-xs sm:text-sm font-bold text-[#6B7280] data-[state=active]:text-[#0C1BA8] flex items-center gap-1.5"
          >
            <BarChart3 className="h-4 w-4" />
            {pt ? "Indicadores" : "Indicators"}
          </TabsTrigger>
          <TabsTrigger 
            value="systems" 
            className="data-[state=active]:border-b-2 data-[state=active]:border-[#0C1BA8] data-[state=active]:shadow-none rounded-none bg-transparent px-3 py-3 text-xs sm:text-sm font-bold text-[#6B7280] data-[state=active]:text-[#0C1BA8] flex items-center gap-1.5"
          >
            <Monitor className="h-4 w-4" />
            {pt ? "Sistemas e Integrações" : "Systems & Integrations"}
          </TabsTrigger>
          <TabsTrigger 
            value="context" 
            className="data-[state=active]:border-b-2 data-[state=active]:border-[#0C1BA8] data-[state=active]:shadow-none rounded-none bg-transparent px-3 py-3 text-xs sm:text-sm font-bold text-[#6B7280] data-[state=active]:text-[#0C1BA8] flex items-center gap-1.5"
          >
            <Users className="h-4 w-4" />
            {pt ? "Contexto Organizacional" : "Context"}
          </TabsTrigger>
          <TabsTrigger 
            value="valuechain" 
            className="data-[state=active]:border-b-2 data-[state=active]:border-[#0C1BA8] data-[state=active]:shadow-none rounded-none bg-transparent px-3 py-3 text-xs sm:text-sm font-bold text-[#6B7280] data-[state=active]:text-[#0C1BA8] flex items-center gap-1.5"
          >
            <Building2 className="h-4 w-4" />
            {pt ? "Cadeia de Valor" : "Value Chain"}
          </TabsTrigger>
        </TabsList>

        <div className="mt-6 flex-1">
          
          {/* ══════════════════════════════════════════════════════════════════
              ABA 1: VISÃO GERAL (OVERVIEW) — ABA PADRÃO INICIAL
             ══════════════════════════════════════════════════════════════════ */}
          <TabsContent value="overview" className="m-0 outline-none space-y-6">
            
            {/* 4.1 Identificação da Jornada */}
            <div className="bg-white border border-[#A5A7B0]/20 rounded-xl p-5 shadow-2xs space-y-4">
              <h3 className="text-xs font-bold text-[#272727] uppercase tracking-wider flex items-center gap-2">
                <Info className="h-4 w-4 text-[#0C1BA8]" />
                {pt ? "4.1 Identificação e Escopo da Entrega de Valor" : "4.1 Journey Identification"}
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-1">
                <div className="p-3 bg-gray-50 rounded-lg border border-gray-100">
                  <span className="text-[10px] font-bold text-[#A5A7B0] uppercase block">
                    {pt ? "Líder / Responsável" : "Journey Owner"}
                  </span>
                  <span className="text-xs font-semibold text-[#272727] mt-0.5 block">
                    {journey.owner || "Mariana Vasconcelos (Comercial)"}
                  </span>
                </div>

                <div className="p-3 bg-gray-50 rounded-lg border border-gray-100">
                  <span className="text-[10px] font-bold text-[#A5A7B0] uppercase block">
                    {pt ? "Domínio Principal" : "Primary Domain"}
                  </span>
                  <span className="text-xs font-semibold text-[#0C1BA8] mt-0.5 block">
                    {journey.mainDomain}
                  </span>
                </div>

                <div className="p-3 bg-gray-50 rounded-lg border border-gray-100">
                  <span className="text-[10px] font-bold text-[#A5A7B0] uppercase block">
                    {pt ? "Papéis dos Domínios" : "Domain Roles"}
                  </span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {journey.domainRoles ? (
                      Object.entries(journey.domainRoles).map(([dom, role]) => (
                        <span key={dom} className="text-[10px] bg-white border border-gray-200 px-1.5 py-0.2 rounded font-medium text-gray-700">
                          {dom}: <strong className="text-[#0C1BA8]">{role}</strong>
                        </span>
                      ))
                    ) : (
                      <span className="text-xs text-gray-600">Principal</span>
                    )}
                  </div>
                </div>

                <div className="p-3 bg-gray-50 rounded-lg border border-gray-100">
                  <span className="text-[10px] font-bold text-[#A5A7B0] uppercase block">
                    {pt ? "Status da Jornada" : "Journey Status"}
                  </span>
                  <span className="text-xs font-semibold text-emerald-700 mt-0.5 block">
                    {getStatusLabel(journey.status)}
                  </span>
                </div>
              </div>

              {/* Gatilho e Resultado Esperado */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                <div className="p-3.5 bg-blue-50/60 border border-blue-100 rounded-lg flex items-start gap-3">
                  <div className="w-8 h-8 rounded-md bg-blue-100 text-blue-700 flex items-center justify-center shrink-0 mt-0.5">
                    <PlayCircle className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-blue-700 uppercase tracking-wider block">
                      {pt ? "Gatilho de Início da Jornada" : "Journey Trigger Event"}
                    </span>
                    <p className="text-xs text-gray-800 font-medium mt-0.5">
                      {journey.triggerEvent || (pt ? "Demanda originada por solicitação de cotação ou abertura de oportunidade B2B" : "Triggered upon B2B quote request")}
                    </p>
                  </div>
                </div>

                <div className="p-3.5 bg-emerald-50/60 border border-emerald-100 rounded-lg flex items-start gap-3">
                  <div className="w-8 h-8 rounded-md bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                    <Flag className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider block">
                      {pt ? "Resultado Esperado da Entrega de Valor" : "Expected Business Outcome"}
                    </span>
                    <p className="text-xs text-gray-800 font-medium mt-0.5">
                      {journey.expectedOutcome || journey.objective}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* 4.2 Indicadores-Resumo da Jornada (8 Cards) */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-[#272727] uppercase tracking-wider flex items-center gap-2">
                <Activity className="h-4 w-4 text-[#0C1BA8]" />
                {pt ? "4.2 Indicadores-Resumo da Jornada (8 Indicadores)" : "4.2 Journey Summary KPIs"}
              </h3>

              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
                {/* 1. Total de Processos */}
                <div className="bg-white border border-gray-200 rounded-xl p-3 shadow-2xs text-center flex flex-col justify-center">
                  <span className="text-[10px] font-bold text-[#A5A7B0] uppercase line-clamp-1">
                    {pt ? "Processos" : "Processes"}
                  </span>
                  <span className="text-lg font-black text-[#272727] mt-1">
                    {journey.participatingProcessIds.length}
                  </span>
                  <span className="text-[9px] text-gray-500">{pt ? "participantes" : "total"}</span>
                </div>

                {/* 2. Domínios Envolvidos */}
                <div className="bg-white border border-gray-200 rounded-xl p-3 shadow-2xs text-center flex flex-col justify-center">
                  <span className="text-[10px] font-bold text-[#A5A7B0] uppercase line-clamp-1">
                    {pt ? "Domínios L1" : "Domains"}
                  </span>
                  <span className="text-lg font-black text-[#272727] mt-1">
                    {journey.coveredL1.length}
                  </span>
                  <span className="text-[9px] text-gray-500">{pt ? "envolvidos" : "involved"}</span>
                </div>

                {/* 3. Tempo Total Estimado (Lead Time) */}
                <div className="bg-white border border-gray-200 rounded-xl p-3 shadow-2xs text-center flex flex-col justify-center">
                  <span className="text-[10px] font-bold text-[#A5A7B0] uppercase line-clamp-1">
                    {pt ? "Lead Time" : "Lead Time"}
                  </span>
                  <span className="text-sm font-black text-[#0C1BA8] mt-1">
                    {journey.leadTime || "14 dias"}
                  </span>
                  <span className="text-[9px] text-gray-500">{pt ? "estimado" : "estimated"}</span>
                </div>

                {/* 4. Custo Total Estimado */}
                <div className="bg-white border border-gray-200 rounded-xl p-3 shadow-2xs text-center flex flex-col justify-center">
                  <span className="text-[10px] font-bold text-[#A5A7B0] uppercase line-clamp-1">
                    {pt ? "Custo Médio" : "Avg Cost"}
                  </span>
                  <span className="text-xs font-black text-gray-800 mt-1">
                    {journey.totalCost || "R$ 4.250"}
                  </span>
                  <span className="text-[9px] text-gray-500">{pt ? "por ciclo" : "per cycle"}</span>
                </div>

                {/* 5. % Automação */}
                <div className="bg-white border border-gray-200 rounded-xl p-3 shadow-2xs text-center flex flex-col justify-center">
                  <span className="text-[10px] font-bold text-[#A5A7B0] uppercase line-clamp-1">
                    {pt ? "Automação" : "Automation"}
                  </span>
                  <span className="text-lg font-black text-emerald-700 mt-1">
                    {journey.automationRate || 68}%
                  </span>
                  <span className="text-[9px] text-gray-500">{pt ? "sistêmica" : "systemic"}</span>
                </div>

                {/* 6. % Processos Validados */}
                <div className="bg-white border border-gray-200 rounded-xl p-3 shadow-2xs text-center flex flex-col justify-center">
                  <span className="text-[10px] font-bold text-[#A5A7B0] uppercase line-clamp-1">
                    {pt ? "Validados" : "Validated"}
                  </span>
                  <span className="text-lg font-black text-blue-700 mt-1">
                    {journey.maturityRate || 85}%
                  </span>
                  <span className="text-[9px] text-gray-500">{pt ? "maduros" : "mature"}</span>
                </div>

                {/* 7. Sistemas Envolvidos */}
                <div className="bg-white border border-gray-200 rounded-xl p-3 shadow-2xs text-center flex flex-col justify-center">
                  <span className="text-[10px] font-bold text-[#A5A7B0] uppercase line-clamp-1">
                    {pt ? "Sistemas" : "Systems"}
                  </span>
                  <span className="text-lg font-black text-[#272727] mt-1">
                    {journey.systemsInvolved.length}
                  </span>
                  <span className="text-[9px] text-gray-500">{pt ? "conectados" : "connected"}</span>
                </div>

                {/* 8. Integrações Mapeadas */}
                <div className="bg-white border border-gray-200 rounded-xl p-3 shadow-2xs text-center flex flex-col justify-center">
                  <span className="text-[10px] font-bold text-[#A5A7B0] uppercase line-clamp-1">
                    {pt ? "Integrações" : "Integrations"}
                  </span>
                  <span className="text-lg font-black text-purple-700 mt-1">
                    {journey.integrationsCount || 4}
                  </span>
                  <span className="text-[9px] text-gray-500">{pt ? "mapeadas" : "mapped"}</span>
                </div>
              </div>
            </div>

            {/* 4.3 Fluxo Resumido da Jornada (Visual Stepper) */}
            <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-2xs space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xs font-bold text-[#272727] uppercase tracking-wider flex items-center gap-2">
                    <GitBranch className="h-4 w-4 text-[#0C1BA8]" />
                    {pt ? "4.3 Fluxo Resumido da Sequência de Entrega" : "4.3 Summary Journey Delivery Flow"}
                  </h3>
                  <p className="text-[11px] text-gray-500 mt-0.5">
                    {pt ? "Sequência ordenada dos processos com passagem de bastão (handoffs)" : "Ordered sequence of processes with handoffs"}
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setActiveTab("flow")}
                  className="text-xs h-7 text-[#0C1BA8] border-[#0C1BA8]/30 hover:bg-[#0C1BA8]/5 font-semibold gap-1"
                >
                  {pt ? "Ver Fluxo Detalhado" : "View Detailed Flow"}
                  <ArrowRight className="w-3.5 h-3.5" />
                </Button>
              </div>

              {/* Stepper Horizontal */}
              <div className="flex items-center overflow-x-auto py-2 gap-2">
                {journey.steps.map((step, idx) => {
                  const proc = step.processId ? getProcessById(mockArchitectureData, step.processId) : null;
                  return (
                    <div key={step.id} className="flex items-center shrink-0">
                      <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg w-[200px] hover:border-[#0C1BA8] transition-colors shadow-2xs">
                        <div className="flex items-center justify-between gap-1 mb-1.5">
                          <span className="w-5 h-5 rounded-full bg-[#0C1BA8] text-white text-[10px] font-black flex items-center justify-center">
                            {idx + 1}
                          </span>
                          <span className="text-[9px] font-semibold text-gray-500 uppercase truncate">
                            {step.domain || proc?.area || "Geral"}
                          </span>
                        </div>
                        <h5 className="text-xs font-bold text-[#272727] line-clamp-2" title={step.stepName}>
                          {step.stepName}
                        </h5>
                        <div className="mt-2 pt-2 border-t border-gray-100 flex items-center justify-between text-[10px] text-gray-500">
                          <span>{step.duration || "2 dias"}</span>
                          <span className="font-semibold text-gray-700 truncate max-w-[90px]">
                            {step.systemUsage?.systemName || "Manual"}
                          </span>
                        </div>
                      </div>

                      {idx < journey.steps.length - 1 && (
                        <div className="px-2 text-gray-300 flex items-center">
                          <ArrowRight className="w-4 h-4 text-[#0C1BA8]" />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 4.4 Resumo de Sistemas e Dados & 4.5 Lacunas Registradas */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* 4.4 Resumo de Sistemas e Dados */}
              <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-2xs space-y-4">
                <h3 className="text-xs font-bold text-[#272727] uppercase tracking-wider flex items-center gap-2">
                  <Monitor className="h-4 w-4 text-[#0C1BA8]" />
                  {pt ? "4.4 Sistemas e Documentos Transferidos" : "4.4 Systems and Data Objects"}
                </h3>

                <div className="space-y-3">
                  <div>
                    <span className="text-[10px] font-bold text-[#A5A7B0] uppercase block mb-1.5">
                      {pt ? "Sistemas Utilizados de Ponta a Ponta" : "Systems Involved"}
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {journey.systemsInvolved.map((sys) => {
                        const isManual = sys.toLowerCase().includes("excel") || sys.toLowerCase().includes("planilha");
                        return (
                          <span
                            key={sys}
                            className={cn(
                              "text-xs px-2.5 py-1 rounded-md border font-medium flex items-center gap-1",
                              isManual
                                ? "bg-amber-50 border-amber-200 text-amber-800"
                                : "bg-blue-50 border-blue-100 text-blue-800"
                            )}
                          >
                            <Monitor className="w-3 h-3" />
                            {sys}
                            {isManual && <span className="text-[9px] font-bold text-amber-700 ml-1">({pt ? "Manual" : "Manual"})</span>}
                          </span>
                        );
                      })}
                    </div>
                  </div>

                  <div className="pt-2 border-t border-gray-100">
                    <span className="text-[10px] font-bold text-[#A5A7B0] uppercase block mb-1.5">
                      {pt ? "Objetos e Documentos de Negócio que Trafegam" : "Business Objects & Documents"}
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {journey.dataObjectsInvolved.map((obj) => (
                        <span
                          key={obj}
                          className="text-xs px-2.5 py-1 rounded-md bg-gray-100 text-gray-700 border border-gray-200 font-medium flex items-center gap-1"
                        >
                          <FileText className="w-3 h-3 text-gray-500" />
                          {obj}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* 4.5 Lacunas registradas nos processos participantes */}
              <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-2xs space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold text-gray-800 uppercase tracking-wider flex items-center gap-2">
                    <FileWarning className="h-4 w-4 text-amber-600" />
                    {pt ? "4.5 Lacunas Registradas nos Processos Participantes" : "4.5 Gaps in Participating Processes"}
                  </h3>
                  <Badge variant="outline" className="text-[10px] bg-amber-50 text-amber-800 border-amber-200">
                    {journey.gaps.length} {pt ? "registradas" : "logged"}
                  </Badge>
                </div>
                <p className="text-[11px] text-gray-500">
                  {pt
                    ? "Gaps operacionais registrados previamente nas fichas dos processos componentes (sem diagnóstico ou julgamento de criticidade)."
                    : "Operational gaps inherited from participating process attribute files."}
                </p>

                {journey.gaps.length === 0 ? (
                  <div className="p-4 bg-emerald-50/50 rounded-lg border border-emerald-100 text-center text-xs text-emerald-800 font-medium">
                    {pt ? "Nenhuma lacuna registrada nos processos desta jornada." : "No gaps logged in participating processes."}
                  </div>
                ) : (
                  <div className="space-y-2">
                    {journey.gaps.map((gap, i) => (
                      <div key={i} className="p-3 bg-amber-50/60 rounded-lg border border-amber-100 text-xs text-gray-800 space-y-1">
                        <p className="font-semibold text-gray-900">{gap.value}</p>
                        {gap.validation && (
                          <div className="flex items-center gap-2 text-[10px] text-gray-500 pt-0.5">
                            <span>{pt ? "Origem:" : "Origin:"} {gap.validation.origin}</span>
                            <span>•</span>
                            <span>{pt ? "Responsável:" : "Owner:"} {gap.validation.responsible}</span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

            </div>
          </TabsContent>

          {/* ══════════════════════════════════════════════════════════════════
              ABA 2: FLUXO PONTA A PONTA (FLOW) — RAIAS POR DOMÍNIO & SHEET
             ══════════════════════════════════════════════════════════════════ */}
          <TabsContent value="flow" className="m-0 outline-none space-y-6">
            <div className="bg-white border border-[#A5A7B0]/20 rounded-xl p-6 shadow-sm space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-gray-100">
                <div>
                  <h3 className="font-bold text-[#272727] text-base flex items-center gap-2">
                    <GitBranch className="h-5 w-5 text-[#0C1BA8]" />
                    {pt ? "Fluxo Ponta a Ponta por Domínios (Swimlanes)" : "End-to-End Flow by Domain Swimlanes"}
                  </h3>
                  <p className="text-xs text-[#A5A7B0] mt-0.5">
                    {pt
                      ? "Visualização distribuída por domínios/áreas funcionais sem rolagem horizontal infinita. Clique em qualquer etapa para abrir os detalhes operacionais."
                      : "Swimlanes grouped by domain/functional area. Click any step to inspect handoffs and systems."}
                  </p>
                </div>

                <div className="flex items-center gap-2 text-xs">
                  <span className="flex items-center gap-1 text-gray-500">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" />
                    {pt ? "Processo Validado" : "Validated"}
                  </span>
                  <span className="flex items-center gap-1 text-gray-500 ml-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-400 inline-block" />
                    {pt ? "Em Validação" : "Validating"}
                  </span>
                </div>
              </div>

              {/* RAIAS (SWIMLANES) POR DOMÍNIO */}
              <div className="space-y-4">
                {swimlanesByDomain.map((lane) => (
                  <div 
                    key={lane.domainName}
                    className="border border-gray-200 rounded-xl overflow-hidden bg-gray-50/40"
                  >
                    {/* Cabeçalho da Raia (Swimlane Header) */}
                    <div className="bg-gray-100/80 px-4 py-2.5 border-b border-gray-200 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Building2 className="w-4 h-4 text-[#0C1BA8]" />
                        <span className="text-xs font-bold text-[#272727] uppercase tracking-wide">
                          {lane.domainName}
                        </span>
                        <Badge variant="outline" className="text-[9px] bg-white text-gray-700 uppercase font-semibold">
                          {lane.role}
                        </Badge>
                      </div>
                      <span className="text-[11px] font-medium text-gray-500">
                        {lane.steps.length} {pt ? "etapa(s) neste domínio" : "step(s)"}
                      </span>
                    </div>

                    {/* Cards de Etapas na Raia */}
                    <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                      {lane.steps.map((step) => {
                        const proc = step.processId ? getProcessById(mockArchitectureData, step.processId) : null;
                        const isProcValidated = proc?.documentationStatus === 'approved';

                        return (
                          <div
                            key={step.id}
                            onClick={() => setSelectedStepForSheet(step)}
                            className="bg-white rounded-lg border border-gray-200 p-3.5 shadow-2xs hover:border-[#0C1BA8] hover:shadow-xs transition-all cursor-pointer group flex flex-col justify-between"
                          >
                            <div className="space-y-2">
                              <div className="flex items-start justify-between gap-1">
                                <span className="w-6 h-6 rounded-md bg-[#0C1BA8] text-white text-xs font-black flex items-center justify-center shrink-0">
                                  #{step.order}
                                </span>
                                <Badge
                                  variant="outline"
                                  className={`text-[9px] font-medium ${
                                    isProcValidated
                                      ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                      : "bg-amber-50 text-amber-700 border-amber-200"
                                  }`}
                                >
                                  {isProcValidated ? (pt ? "Validado" : "Validated") : (pt ? "Em Validação" : "Validating")}
                                </Badge>
                              </div>

                              <h4 className="text-xs font-bold text-[#272727] group-hover:text-[#0C1BA8] transition-colors leading-snug">
                                {step.stepName}
                              </h4>

                              {step.input && (
                                <div className="text-[10px] text-gray-600 flex items-center gap-1 pt-1">
                                  <span className="font-semibold text-gray-700">{pt ? "Entrada:" : "In:"}</span>
                                  <span className="truncate">{step.input}</span>
                                </div>
                              )}

                              {step.output && (
                                <div className="text-[10px] text-gray-600 flex items-center gap-1">
                                  <span className="font-semibold text-gray-700">{pt ? "Saída:" : "Out:"}</span>
                                  <span className="truncate">{step.output}</span>
                                </div>
                              )}
                            </div>

                            <div className="mt-3 pt-2 border-t border-gray-100 flex items-center justify-between text-[10px] text-gray-500">
                              <span className="flex items-center gap-1">
                                <Clock className="w-3 h-3 text-gray-400" />
                                {step.duration || "2 dias"}
                              </span>
                              <span className="font-semibold text-[#0C1BA8] flex items-center gap-0.5 group-hover:underline">
                                {pt ? "Ver Detalhes" : "Details"}
                                <ChevronRight className="w-3 h-3" />
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* ══════════════════════════════════════════════════════════════════
              ABA 3: PROCESSOS PARTICIPANTES (PROCESSES)
             ══════════════════════════════════════════════════════════════════ */}
          <TabsContent value="processes" className="m-0 outline-none space-y-4">
            <div className="bg-white border border-[#A5A7B0]/20 rounded-xl overflow-hidden shadow-2xs">
              <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                <div>
                  <h3 className="text-xs font-bold text-[#272727] uppercase tracking-wide">
                    {pt ? "Catálogo de Processos Participantes da Jornada" : "Participating Process Catalog"}
                  </h3>
                  <p className="text-[11px] text-gray-500">
                    {pt ? "Relação dos processos organizacionais que realizam as etapas desta jornada" : "Processes carrying out the steps of this journey"}
                  </p>
                </div>
                <Badge variant="secondary" className="text-xs">
                  {journey.participatingProcessIds.length} {pt ? "processos" : "processes"}
                </Badge>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-gray-50 text-[#6B7280] font-bold uppercase text-[10px] border-b border-gray-200">
                    <tr>
                      <th className="px-4 py-3 w-14 text-center">#</th>
                      <th className="px-4 py-3">{pt ? "Nome do Processo" : "Process Name"}</th>
                      <th className="px-4 py-3">{pt ? "Domínio / Área" : "Domain / Area"}</th>
                      <th className="px-4 py-3">{pt ? "Responsável" : "Owner"}</th>
                      <th className="px-4 py-3">{pt ? "Sistemas Core" : "Core Systems"}</th>
                      <th className="px-4 py-3 text-center">{pt ? "Documentação" : "Documentation"}</th>
                      <th className="px-4 py-3 text-right">{pt ? "Ações" : "Actions"}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {journey.steps.map((step) => {
                      const proc = step.processId ? getProcessById(mockArchitectureData, step.processId) : null;
                      return (
                        <tr key={step.id} className="hover:bg-gray-50/60 transition-colors">
                          <td className="px-4 py-3 text-center font-bold text-gray-700">
                            #{step.order}
                          </td>
                          <td className="px-4 py-3">
                            <span className="font-bold text-[#272727] block">{step.stepName}</span>
                            {proc && (
                              <span className="text-[10px] text-gray-400">ID: {proc.id}</span>
                            )}
                          </td>
                          <td className="px-4 py-3">
                            <span className="text-xs font-semibold text-[#0C1BA8] block">
                              {step.domain || proc?.area || "Geral"}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-gray-600">
                            {proc?.responsible || "Equipe Operacional"}
                          </td>
                          <td className="px-4 py-3">
                            <span className="px-2 py-0.5 rounded bg-gray-100 text-gray-700 text-[11px] font-medium">
                              {step.systemUsage?.systemName || "ERP / CRM"}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-center">
                            <span
                              className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                                proc?.documentationStatus === "approved"
                                  ? "bg-emerald-50 text-emerald-700"
                                  : "bg-amber-50 text-amber-700"
                              }`}
                            >
                              {proc?.documentationStatus === "approved"
                                ? pt ? "Aprovada" : "Approved"
                                : pt ? "Pendente" : "Pending"}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              {proc && (
                                <>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setSelectedProcessId(proc.id)}
                                    className="h-7 text-[11px] px-2 text-[#0C1BA8] border-[#0C1BA8]/30 hover:bg-[#0C1BA8]/5"
                                  >
                                    <ExternalLink className="w-3 h-3 mr-1" />
                                    {pt ? "Detalhes" : "Details"}
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() =>
                                      setSelectedProcessForConnMap({
                                        id: proc.id,
                                        name: proc.name,
                                        domain: proc.area,
                                      })
                                    }
                                    title={pt ? "Ver Mapa de Conexões" : "Connection Map"}
                                    className="h-7 text-[11px] px-2 text-purple-700 hover:bg-purple-50"
                                  >
                                    <GitFork className="w-3 h-3 mr-1" />
                                    {pt ? "Conexões" : "Map"}
                                  </Button>
                                </>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </TabsContent>

          {/* ══════════════════════════════════════════════════════════════════
              ABA 4: INDICADORES (INDICATORS) — DA JORNADA VS DOS PROCESSOS
             ══════════════════════════════════════════════════════════════════ */}
          <TabsContent value="indicators" className="m-0 outline-none space-y-6">
            
            {/* Bloco A: Indicadores Globais da Jornada */}
            <div className="bg-white border border-[#A5A7B0]/20 rounded-xl p-5 shadow-2xs space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-gray-100">
                <div>
                  <h3 className="text-xs font-bold text-[#0C1BA8] uppercase tracking-wide flex items-center gap-2">
                    <BarChart3 className="w-4 h-4" />
                    {pt ? "A. Indicadores Globais da Jornada (Ponta a Ponta)" : "A. Global Journey Indicators"}
                  </h3>
                  <p className="text-[11px] text-gray-500">
                    {pt ? "Medem o resultado ponta a ponta da experiência e entrega de valor" : "End-to-end outcome metrics"}
                  </p>
                </div>
              </div>

              {journey.businessIndicators.length === 0 ? (
                <div className="p-6 text-center text-xs text-gray-400 italic">
                  {pt ? "Nenhum indicador global associado a esta jornada." : "No global KPIs attached."}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {journey.businessIndicators.map((ind) => (
                    <IndicatorCard
                      key={ind.id}
                      indicator={ind}
                      aggregationRule={(ind as any).aggregationRule}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Bloco B: Indicadores dos Processos Participantes */}
            <div className="bg-white border border-[#A5A7B0]/20 rounded-xl p-5 shadow-2xs space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-gray-100">
                <div>
                  <h3 className="text-xs font-bold text-gray-800 uppercase tracking-wide flex items-center gap-2">
                    <Network className="w-4 h-4 text-gray-500" />
                    {pt ? "B. Indicadores dos Processos Participantes (Herdados)" : "B. Inherited Process KPIs"}
                  </h3>
                  <p className="text-[11px] text-gray-500">
                    {pt ? "Indicadores operacionais pertencentes a cada processo componente" : "Operational metrics from component processes"}
                  </p>
                </div>
              </div>

              {processDetails.flatMap((p) => p.businessIndicators).length === 0 ? (
                <div className="p-6 text-center text-xs text-gray-400 italic">
                  {pt ? "Nenhum indicador cadastrado nos processos participantes." : "No KPIs found on component processes."}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {processDetails.flatMap((p) =>
                    p.businessIndicators.map((ind) => (
                      <div key={`${p.id}-${ind.id}`} className="space-y-1">
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
                          {p.name}
                        </span>
                        <IndicatorCard indicator={ind} aggregationRule={ind.aggregationRule} />
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>

          </TabsContent>

          {/* ══════════════════════════════════════════════════════════════════
              ABA 5: SISTEMAS E INTEGRAÇÕES (SYSTEMS)
             ══════════════════════════════════════════════════════════════════ */}
          <TabsContent value="systems" className="m-0 outline-none space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* Inventário de Sistemas */}
              <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-2xs space-y-4">
                <h3 className="text-xs font-bold text-[#272727] uppercase tracking-wide flex items-center gap-2">
                  <Monitor className="w-4 h-4 text-[#0C1BA8]" />
                  {pt ? "Sistemas Utilizados na Jornada" : "Systems Inventory"}
                </h3>

                <div className="space-y-2.5">
                  {journey.systemsInvolved.map((sys) => {
                    const isManual = sys.toLowerCase().includes("excel") || sys.toLowerCase().includes("planilha");
                    return (
                      <div
                        key={sys}
                        className="p-3 rounded-lg border border-gray-100 bg-gray-50 flex items-center justify-between"
                      >
                        <div className="flex items-center gap-2">
                          <Monitor className="w-4 h-4 text-gray-600" />
                          <span className="text-xs font-bold text-gray-800">{sys}</span>
                        </div>
                        <Badge
                          variant="outline"
                          className={`text-[10px] font-semibold ${
                            isManual
                              ? "bg-amber-50 text-amber-800 border-amber-200"
                              : "bg-blue-50 text-blue-800 border-blue-200"
                          }`}
                        >
                          {isManual ? (pt ? "Entrada Manual" : "Manual Tool") : (pt ? "Sistema Core" : "Core System")}
                        </Badge>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Objetos e Integrações entre Etapas */}
              <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-2xs space-y-4">
                <h3 className="text-xs font-bold text-[#272727] uppercase tracking-wide flex items-center gap-2">
                  <Database className="w-4 h-4 text-[#0C1BA8]" />
                  {pt ? "Tráfego de Dados e Objetos entre Etapas" : "Data Traffic Between Steps"}
                </h3>

                <div className="space-y-2.5">
                  {journey.steps.map((step, idx) => (
                    <div
                      key={step.id}
                      className="p-3 rounded-lg border border-gray-100 bg-gray-50/70 text-xs space-y-1.5"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-gray-800">
                          #{step.order} {step.stepName}
                        </span>
                        <span className="text-[10px] text-gray-500 font-medium">
                          {step.systemUsage?.systemName || "Manual"}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-[11px] text-gray-600">
                        <span className="bg-white border border-gray-200 px-2 py-0.5 rounded font-medium text-gray-700">
                          {pt ? "Entrada:" : "In:"} {step.input || "Demanda"}
                        </span>
                        <ArrowRight className="w-3 h-3 text-gray-400" />
                        <span className="bg-blue-50 border border-blue-100 px-2 py-0.5 rounded font-medium text-blue-800">
                          {pt ? "Saída:" : "Out:"} {step.output || "Entrega"}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </TabsContent>

          {/* ══════════════════════════════════════════════════════════════════
              ABA 6: CONTEXTO ORGANIZACIONAL (CONTEXT)
             ══════════════════════════════════════════════════════════════════ */}
          <TabsContent value="context" className="m-0 outline-none space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* Papéis e Stakeholders */}
              <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-2xs space-y-4">
                <h3 className="text-xs font-bold text-[#272727] uppercase tracking-wide flex items-center gap-2">
                  <Users className="w-4 h-4 text-[#0C1BA8]" />
                  {pt ? "Papéis e Stakeholders Envolvidos" : "Roles and Stakeholders"}
                </h3>

                <div className="space-y-3 text-xs">
                  <div className="p-3 bg-gray-50 rounded-lg border border-gray-100">
                    <span className="font-bold text-gray-800 block">{pt ? "Cliente Final / Comprador B2B" : "B2B Buyer"}</span>
                    <p className="text-[11px] text-gray-500 mt-0.5">
                      {pt ? "Solicita cotações, recebe proposta e assina digitalmente o contrato." : "Requests quote, reviews proposal and signs contract."}
                    </p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg border border-gray-100">
                    <span className="font-bold text-gray-800 block">{pt ? "Executivos Comerciais (SDRs e Closers)" : "Commercial Executives"}</span>
                    <p className="text-[11px] text-gray-500 mt-0.5">
                      {pt ? "Conduzem o diagnóstico, simulam margem de desconto e apresentam proposta." : "Run diagnostic and present proposal."}
                    </p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg border border-gray-100">
                    <span className="font-bold text-gray-800 block">{pt ? "Consultor Jurídico Corporativo" : "Legal Counsel"}</span>
                    <p className="text-[11px] text-gray-500 mt-0.5">
                      {pt ? "Revisa cláusulas de exceção e valida minutas de grande porte." : "Reviews exception clauses and contract drafts."}
                    </p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg border border-gray-100">
                    <span className="font-bold text-gray-800 block">{pt ? "Analista de Faturamento e Contas a Receber" : "Billing Analyst"}</span>
                    <p className="text-[11px] text-gray-500 mt-0.5">
                      {pt ? "Emite a fatura no ERP SAP e realiza a baixa contábil." : "Generates invoices in SAP ERP."}
                    </p>
                  </div>
                </div>
              </div>

              {/* Regras de Conformidade & Políticas */}
              <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-2xs space-y-4">
                <h3 className="text-xs font-bold text-[#272727] uppercase tracking-wide flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#0C1BA8]" />
                  {pt ? "Regras de Conformidade e Políticas" : "Compliance and Policies"}
                </h3>

                <div className="space-y-3 text-xs">
                  <div className="p-3 bg-blue-50/50 rounded-lg border border-blue-100">
                    <span className="font-bold text-blue-900 block">{pt ? "Alçada de Desconto Comercial" : "Discount Threshold"}</span>
                    <p className="text-[11px] text-gray-600 mt-0.5">
                      {pt ? "Descontos acima de 15% requerem aprovação da Diretoria Comercial antes da emissão da proposta." : "Discounts above 15% require director approval."}
                    </p>
                  </div>
                  <div className="p-3 bg-blue-50/50 rounded-lg border border-blue-100">
                    <span className="font-bold text-blue-900 block">{pt ? "Conformidade LGPD" : "LGPD Compliance"}</span>
                    <p className="text-[11px] text-gray-600 mt-0.5">
                      {pt ? "Dados de decisores coletados na prospecção devem respeitar consentimento e política de privacidade corporativa." : "Decision-maker data must respect data privacy."}
                    </p>
                  </div>
                  <div className="p-3 bg-blue-50/50 rounded-lg border border-blue-100">
                    <span className="font-bold text-blue-900 block">{pt ? "Validade da Assinatura Digital" : "Digital Signature Policy"}</span>
                    <p className="text-[11px] text-gray-600 mt-0.5">
                      {pt ? "Contratos devem possuir certificado ICP-Brasil ou assinatura avançada DocuSign com trilha de auditoria completa." : "Contracts require DocuSign advanced signature with audit trail."}
                    </p>
                  </div>
                </div>
              </div>

            </div>
          </TabsContent>

          {/* ══════════════════════════════════════════════════════════════════
              ABA 7: CADEIA DE VALOR (VALUE CHAIN)
             ══════════════════════════════════════════════════════════════════ */}
          <TabsContent value="valuechain" className="m-0 outline-none space-y-6">
            <div className="bg-white border border-[#A5A7B0]/20 rounded-xl p-6 shadow-sm space-y-6">
              <div className="border-b border-gray-100 pb-4">
                <h3 className="font-bold text-[#272727] text-base flex items-center gap-2">
                  <Building2 className="h-5 w-5 text-[#0C1BA8]" />
                  {pt ? "Matriz de Alinhamento com a Cadeia de Valor" : "Value Chain Alignment Matrix"}
                </h3>
                <p className="text-xs text-[#A5A7B0] mt-0.5">
                  {pt ? "Demonstra como esta jornada transversal se conecta aos domínios L1 e macroprocessos L2" : "Demonstrates how this cross-functional journey touches L1 and L2 macroprocesses"}
                </p>
              </div>

              <div className="space-y-4">
                {journey.coveredL1.map((l1Name) => {
                  const l1Node = mockArchitectureData.domainsL1.find((d) => d.name === l1Name);
                  const role = journey.domainRoles?.[l1Name] || "participante";

                  return (
                    <div key={l1Name} className="p-4 rounded-xl border border-gray-200 bg-gray-50/50 space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Building2 className="w-4 h-4 text-[#0C1BA8]" />
                          <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wide">
                            {l1Name}
                          </h4>
                          <Badge variant="outline" className="text-[10px] bg-white text-[#0C1BA8] font-bold">
                            {role}
                          </Badge>
                        </div>
                        {l1Node && (
                          <span className="text-[11px] text-gray-500">
                            {l1Node.responsible}
                          </span>
                        )}
                      </div>

                      {/* Processos associados a este L1 */}
                      <div className="flex flex-wrap gap-2 pt-1">
                        {journey.steps
                          .filter((s) => {
                            const proc = s.processId ? getProcessById(mockArchitectureData, s.processId) : null;
                            return s.domain === l1Name || proc?.area === l1Name;
                          })
                          .map((s) => (
                            <span
                              key={s.id}
                              className="text-xs bg-white border border-gray-200 px-2.5 py-1 rounded-md text-gray-800 font-medium shadow-2xs"
                            >
                              #{s.order} {s.stepName}
                            </span>
                          ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </TabsContent>

        </div>
      </Tabs>

      {/* ── SHEET LATERAL: DETALHES DA ETAPA DO FLUXO ──────────────────── */}
      <Sheet 
        open={!!selectedStepForSheet} 
        onOpenChange={(open) => !open && setSelectedStepForSheet(null)}
      >
        <SheetContent className="w-[90vw] sm:max-w-lg overflow-y-auto p-6 space-y-6">
          {selectedStepForSheet && (
            <>
              <SheetHeader className="border-b pb-4">
                <div className="flex items-center gap-2 mb-1">
                  <span className="w-6 h-6 rounded-md bg-[#0C1BA8] text-white text-xs font-black flex items-center justify-center">
                    #{selectedStepForSheet.order}
                  </span>
                  <span className="text-[10px] font-bold text-[#0C1BA8] uppercase tracking-wider">
                    {selectedStepForSheet.domain || "Domínio"}
                  </span>
                </div>
                <SheetTitle className="text-lg font-bold text-gray-900 text-left">
                  {selectedStepForSheet.stepName}
                </SheetTitle>
                <SheetDescription className="text-xs text-gray-500 text-left">
                  {pt ? "Detalhamento operacional da etapa na entrega de valor" : "Operational step details"}
                </SheetDescription>
              </SheetHeader>

              {/* Informações da Etapa */}
              <div className="space-y-4 text-xs">
                <div className="grid grid-cols-2 gap-3 p-3 bg-gray-50 rounded-lg border border-gray-100">
                  <div>
                    <span className="text-[10px] font-bold text-[#A5A7B0] uppercase block">
                      {pt ? "Duração Estimada" : "Estimated Duration"}
                    </span>
                    <span className="text-xs font-semibold text-gray-800 mt-0.5 block">
                      {selectedStepForSheet.duration || "2 dias úteis"}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-[#A5A7B0] uppercase block">
                      {pt ? "Ferramenta / Sistema" : "System / Tool"}
                    </span>
                    <span className="text-xs font-semibold text-[#0C1BA8] mt-0.5 block">
                      {selectedStepForSheet.systemUsage?.systemName || "Manual"}
                    </span>
                  </div>
                </div>

                {/* Entradas e Saídas */}
                <div className="space-y-2">
                  <div className="p-3 bg-blue-50/50 rounded-lg border border-blue-100">
                    <span className="text-[10px] font-bold text-blue-700 uppercase block">
                      {pt ? "Entrada (Input) Necessária" : "Input Required"}
                    </span>
                    <span className="text-xs font-semibold text-gray-800 block mt-0.5">
                      {selectedStepForSheet.input || "Demanda / Oportunidade"}
                    </span>
                  </div>

                  <div className="p-3 bg-emerald-50/50 rounded-lg border border-emerald-100">
                    <span className="text-[10px] font-bold text-emerald-700 uppercase block">
                      {pt ? "Saída (Output) Entregue" : "Output Delivered"}
                    </span>
                    <span className="text-xs font-semibold text-gray-800 block mt-0.5">
                      {selectedStepForSheet.output || "Entrega Formal"}
                    </span>
                  </div>
                </div>

                {/* Predecessores e Sucessores Imediatos do Store de Conexões */}
                <div className="space-y-3 pt-2 border-t border-gray-100">
                  <h4 className="text-xs font-bold text-gray-800 uppercase tracking-wide flex items-center gap-1.5">
                    <GitFork className="w-3.5 h-3.5 text-[#0C1BA8]" />
                    {pt ? "Conexões Locais Registradas" : "Registered Local Connections"}
                  </h4>

                  <div className="space-y-2">
                    <span className="text-[10px] font-bold text-gray-400 uppercase block">
                      {pt ? "Predecessores (Fornecem para este):" : "Predecessors:"}
                    </span>
                    {stepProcessConnections.predecessors.length === 0 ? (
                      <p className="text-[11px] text-gray-400 italic">
                        {pt ? "Nenhum predecessor direto cadastrado." : "No direct predecessor."}
                      </p>
                    ) : (
                      stepProcessConnections.predecessors.map((c) => (
                        <div key={c.id} className="p-2 rounded bg-gray-50 border border-gray-200 flex items-center justify-between">
                          <span className="font-semibold text-gray-800 text-[11px]">{c.sourceProcessName}</span>
                          <span className="text-[9px] bg-purple-100 text-purple-700 px-1.5 py-0.2 rounded font-medium">
                            {RELATIONSHIP_LABELS[c.relationshipType]?.pt || c.relationshipType}
                          </span>
                        </div>
                      ))
                    )}
                  </div>

                  <div className="space-y-2 pt-1">
                    <span className="text-[10px] font-bold text-gray-400 uppercase block">
                      {pt ? "Sucessores (Recebem deste):" : "Successors:"}
                    </span>
                    {stepProcessConnections.successors.length === 0 ? (
                      <p className="text-[11px] text-gray-400 italic">
                        {pt ? "Nenhum sucessor direto cadastrado." : "No direct successor."}
                      </p>
                    ) : (
                      stepProcessConnections.successors.map((c) => (
                        <div key={c.id} className="p-2 rounded bg-gray-50 border border-gray-200 flex items-center justify-between">
                          <span className="font-semibold text-gray-800 text-[11px]">{c.targetProcessName}</span>
                          <span className="text-[9px] bg-blue-100 text-blue-700 px-1.5 py-0.2 rounded font-medium">
                            {RELATIONSHIP_LABELS[c.relationshipType]?.pt || c.relationshipType}
                          </span>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* Botões de Ação do Sheet */}
                <div className="pt-4 border-t border-gray-100 space-y-2">
                  {selectedStepForSheet.processId && (
                    <>
                      <Button
                        variant="corporate"
                        size="sm"
                        onClick={() => {
                          const pId = selectedStepForSheet.processId!;
                          setSelectedStepForSheet(null);
                          setSelectedProcessId(pId);
                        }}
                        className="w-full text-xs h-8 gap-1.5"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        {pt ? "Abrir Detalhe Completo do Processo" : "Open Process Details"}
                      </Button>

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          const pId = selectedStepForSheet.processId!;
                          const pName = selectedStepForSheet.stepName;
                          const pDom = selectedStepForSheet.domain;
                          setSelectedStepForSheet(null);
                          setSelectedProcessForConnMap({ id: pId, name: pName, domain: pDom });
                        }}
                        className="w-full text-xs h-8 gap-1.5 border-[#0C1BA8]/30 text-[#0C1BA8] hover:bg-[#0C1BA8]/5"
                      >
                        <GitFork className="w-3.5 h-3.5" />
                        {pt ? "Ver no Mapa de Conexões Locais" : "View in Local Connection Map"}
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>

      {/* ── MODAL: DETALHE DO PROCESSO ──────────────────────────────────── */}
      {selectedProcess && (
        <ProcessDetailModal
          open={!!selectedProcessId}
          onOpenChange={(open) => !open && setSelectedProcessId(null)}
          process={selectedProcess}
        />
      )}

      {/* ── MODAL: MAPA DE CONEXÕES LOCAIS DO PROCESSO ────────────────── */}
      {selectedProcessForConnMap && (
        <ProcessConnectionMapModal
          open={!!selectedProcessForConnMap}
          onOpenChange={(open) => !open && setSelectedProcessForConnMap(null)}
          initialProcessId={selectedProcessForConnMap.id}
          initialProcessName={selectedProcessForConnMap.name}
          initialDomain={selectedProcessForConnMap.domain}
          onNavigateToProcess={(id) => {
            setSelectedProcessForConnMap(null);
            setSelectedProcessId(id);
          }}
        />
      )}

    </div>
  );
}
