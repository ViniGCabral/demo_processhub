import { useState, useMemo } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { 
  L1Process, 
  L2Process, 
  L3Process,
  L4Task
} from "@/stores/valueChainStore";
import { useValueChainCounts } from "@/hooks/useValueChainCounts";
import { useTaxonomy, TaxonomyLevel } from "@/stores/taxonomyStore";
import { BusinessIndicator, ProcessContextData, DomainAlert } from "@/types/architectureContextTypes";
import { IndicatorCard } from "./IndicatorCard";
import { DomainIndicatorsView } from "./DomainIndicatorsView";
import { DomainContextRibbon } from "./DomainContextRibbon";
import { CreateEditBusinessIndicatorModal } from "./modals/CreateEditBusinessIndicatorModal";
import { CreateEditL2Modal } from "./modals/CreateEditL2Modal";
import { LogMeasurementModal } from "./modals/LogMeasurementModal";
import { IndicatorHistoryModal } from "./modals/IndicatorHistoryModal";
import { mockArchitectureData } from "@/data/architectureContextMock";
import { 
  findDomainNode,
  getProcessesByL4, 
  getBusinessIndicatorsByDomain,
  getSystemsByDomain,
  getDomainAlerts
} from "@/data/architectureContextUtils";
import { useIndicatorStore } from "@/stores/indicatorStore";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { 
  FileText, CheckCircle2, Monitor, Route, TrendingUp, AlertTriangle, 
  HelpCircle, FileCheck, ArrowRight, ShieldCheck, UserCheck, Plus, 
  ExternalLink, Layers, Sparkles, AlertCircle, Info, Calendar, User, Building, Clock, Filter
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface L1DetailViewProps {
  l1: L1Process;
  onSelectL2: (l2Id: string) => void;
  onCreateL2: () => void;
}

export function L1DetailView({ l1, onSelectL2, onCreateL2 }: L1DetailViewProps) {
  const { language } = useLanguage();
  const pt = language === "PT";
  const { label: lvl, maxLevel } = useTaxonomy();
  const { l1Counts, l2Counts } = useValueChainCounts();

  const counts = l1Counts(l1);
  const getL1Name = (x: L1Process) => (pt ? x.namePT : x.nameEN);
  const domainName = getL1Name(l1);

  // Active tab state
  const [activeTab, setActiveTab] = useState<string>("overview");

  // Indicator Modal State
  const [indicatorModalOpen, setIndicatorModalOpen] = useState(false);
  const [editingIndicator, setEditingIndicator] = useState<BusinessIndicator | null>(null);

  // Modais de medição e histórico
  const [logModalOpen, setLogModalOpen] = useState(false);
  const [selectedIndicatorForLog, setSelectedIndicatorForLog] = useState<BusinessIndicator | null>(null);
  const [historyModalOpen, setHistoryModalOpen] = useState(false);
  const [selectedIndicatorForHistory, setSelectedIndicatorForHistory] = useState<BusinessIndicator | null>(null);

  // Modal Criar L2
  const [createL2ModalOpen, setCreateL2ModalOpen] = useState(false);

  // Filtros hierárquicos para Sistemas e Jornadas
  const [systemsFilterLevel, setSystemsFilterLevel] = useState<"all" | "l2" | "l3" | "l4">("all");
  const [systemsFilterNodeId, setSystemsFilterNodeId] = useState<string>("all");

  const [journeysFilterLevel, setJourneysFilterLevel] = useState<"all" | "l2" | "l3" | "l4">("all");
  const [journeysFilterNodeId, setJourneysFilterNodeId] = useState<string>("all");

  // Indicators from reactive store
  const storeIndicators = useIndicatorStore((s) => s.indicators);
  const deleteIndicator = useIndicatorStore((s) => s.deleteIndicator);

  // -- Mock Data Extraction for this L1 --
  const mockDomain = useMemo(() => {
    return findDomainNode(mockArchitectureData, domainName) || findDomainNode(mockArchitectureData, l1.id);
  }, [l1, domainName]);

  const domainCategory = l1.category || mockDomain?.category || "PRIMARY";

  // Extração hierárquica para filtros
  const l2Nodes = useMemo(() => {
    return mockDomain?.childrenL2 || [];
  }, [mockDomain]);

  const l3Nodes = useMemo(() => {
    return l2Nodes.flatMap((l2) => l2.childrenL3.map((l3) => ({ ...l3, parentL2Name: l2.name })));
  }, [l2Nodes]);

  const l4Nodes = useMemo(() => {
    return l3Nodes.flatMap((l3) => l3.childrenL4.map((l4) => ({ ...l4, parentL3Name: l3.name })));
  }, [l3Nodes]);

  // Journeys crossing this domain
  const journeys = useMemo(() => {
    return mockArchitectureData.journeys.filter(j => 
      j.coveredL1.some(d => d.toLowerCase().includes(domainName.toLowerCase()) || domainName.toLowerCase().includes(d.toLowerCase()))
    );
  }, [domainName]);

  // Aggregate process data from mock architecture
  const { 
    allProcesses, 
    docsApproved, 
    contextValidated, 
    openQuestionsCount, 
    evidencesCount,
    processesWithoutOwner,
    processesWithoutSystems,
    processesWithoutRegulations
  } = useMemo(() => {
    const procs: ProcessContextData[] = [];
    if (mockDomain) {
      mockDomain.childrenL2.forEach(l2 => {
        l2.childrenL3.forEach(l3 => {
          l3.childrenL4.forEach(l4 => {
            procs.push(...l4.processes);
          });
        });
      });
    }

    const docs = procs.filter(p => p.documentationStatus === 'approved').length;
    const ctx = procs.filter(p => p.contextValidationStatus === 'validated').length;
    const questions = procs.reduce((acc, p) => acc + p.openQuestions.length, 0);
    const evs = procs.reduce((acc, p) => acc + p.evidences.length, 0);
    const noOwner = procs.filter(p => !p.responsible || p.responsible.trim() === '').length;
    const noSys = procs.filter(p => !p.systemsUsed || p.systemsUsed.length === 0).length;
    const noReg = procs.filter(p => !p.regulations || p.regulations.length === 0).length;

    return { 
      allProcesses: procs, 
      docsApproved: docs, 
      contextValidated: ctx, 
      openQuestionsCount: questions, 
      evidencesCount: evs,
      processesWithoutOwner: noOwner,
      processesWithoutSystems: noSys,
      processesWithoutRegulations: noReg
    };
  }, [mockDomain]);

  // Combined Business Indicators for this domain (from mock + user store)
  const businessIndicators = useMemo(() => {
    // Filter indicators by domain id, name or scope
    const term = domainName.toLowerCase();
    const domainIdTerm = mockDomain?.id ? mockDomain.id.toLowerCase() : l1.id.toLowerCase();

    return storeIndicators.filter(i => 
      (i.domainId && (i.domainId.toLowerCase() === domainIdTerm || i.domainId.toLowerCase() === term)) ||
      (i.scope && (i.scope.toLowerCase().includes(term) || term.includes(i.scope.toLowerCase())))
    );
  }, [storeIndicators, domainName, mockDomain, l1.id]);

  // System stats
  const systemStats = useMemo(() => {
    if (!mockDomain) return [];
    const stats = new Map<string, { 
      systemName: string; 
      isManual: boolean; 
      operationTypes: Set<string>;
      dataObjects: Set<string>;
      processes: Set<string>; 
      journeys: Set<string> 
    }>();

    mockDomain.childrenL2.forEach(l2 => {
      l2.childrenL3.forEach(l3 => {
        l3.childrenL4.forEach(l4 => {
          l4.processes.forEach(p => {
            p.systemsUsed.forEach(sys => {
              if (!stats.has(sys.systemName)) {
                stats.set(sys.systemName, { 
                  systemName: sys.systemName, 
                  isManual: sys.isManual, 
                  operationTypes: new Set(),
                  dataObjects: new Set(),
                  processes: new Set(), 
                  journeys: new Set() 
                });
              }
              const s = stats.get(sys.systemName)!;
              s.processes.add(p.id);
              if (sys.operation) s.operationTypes.add(sys.operation);
              sys.dataObjects.forEach(obj => s.dataObjects.add(obj));

              journeys.forEach(j => {
                if (j.systemsInvolved.includes(sys.systemName) && j.participatingProcessIds.includes(p.id)) {
                  s.journeys.add(j.id);
                }
              });
            });
          });
        });
      });
    });

    return Array.from(stats.values());
  }, [mockDomain, journeys]);

  // Process IDs alvo para filtro de Sistemas
  const systemsTargetProcessIds = useMemo(() => {
    if (systemsFilterLevel === "all" || systemsFilterNodeId === "all") return null;
    const pIds = new Set<string>();
    if (systemsFilterLevel === "l2") {
      const l2 = l2Nodes.find((x) => x.id === systemsFilterNodeId);
      l2?.childrenL3.forEach((l3) => l3.childrenL4.forEach((l4) => l4.processes.forEach((p) => pIds.add(p.id))));
    } else if (systemsFilterLevel === "l3") {
      const l3 = l3Nodes.find((x) => x.id === systemsFilterNodeId);
      l3?.childrenL4.forEach((l4) => l4.processes.forEach((p) => pIds.add(p.id)));
    } else if (systemsFilterLevel === "l4") {
      const l4 = l4Nodes.find((x) => x.id === systemsFilterNodeId);
      l4?.processes.forEach((p) => pIds.add(p.id));
    }
    return pIds;
  }, [systemsFilterLevel, systemsFilterNodeId, l2Nodes, l3Nodes, l4Nodes]);

  const filteredSystemStats = useMemo(() => {
    if (!systemsTargetProcessIds) return systemStats;
    return systemStats.filter((sys) => {
      for (const pId of sys.processes) {
        if (systemsTargetProcessIds.has(pId)) return true;
      }
      return false;
    });
  }, [systemStats, systemsTargetProcessIds]);

  // Process IDs alvo para filtro de Jornadas
  const journeysTargetProcessIds = useMemo(() => {
    if (journeysFilterLevel === "all" || journeysFilterNodeId === "all") return null;
    const pIds = new Set<string>();
    if (journeysFilterLevel === "l2") {
      const l2 = l2Nodes.find((x) => x.id === journeysFilterNodeId);
      l2?.childrenL3.forEach((l3) => l3.childrenL4.forEach((l4) => l4.processes.forEach((p) => pIds.add(p.id))));
    } else if (journeysFilterLevel === "l3") {
      const l3 = l3Nodes.find((x) => x.id === journeysFilterNodeId);
      l3?.childrenL4.forEach((l4) => l4.processes.forEach((p) => pIds.add(p.id)));
    } else if (journeysFilterLevel === "l4") {
      const l4 = l4Nodes.find((x) => x.id === journeysFilterNodeId);
      l4?.processes.forEach((p) => pIds.add(p.id));
    }
    return pIds;
  }, [journeysFilterLevel, journeysFilterNodeId, l2Nodes, l3Nodes, l4Nodes]);

  const filteredJourneys = useMemo(() => {
    if (!journeysTargetProcessIds) return journeys;
    return journeys.filter((j) => {
      return j.participatingProcessIds.some((pId) => journeysTargetProcessIds.has(pId));
    });
  }, [journeys, journeysTargetProcessIds]);

  // Domain Alerts
  const domainAlerts: DomainAlert[] = useMemo(() => {
    if (!mockDomain) return [];
    return getDomainAlerts(mockArchitectureData, mockDomain.id);
  }, [mockDomain]);

  // Main KPI Calculation / Retrieval
  const mainKpi = useMemo(() => {
    if (businessIndicators.length > 0) {
      const top = businessIndicators[0];
      return { name: top.name, value: `${top.currentValue}${top.unit !== 'BRL' ? top.unit : ''}` };
    }
    if (mockDomain?.mainKpi) {
      return { name: pt ? "SLA Comercial" : "Main SLA", value: mockDomain.mainKpi };
    }
    return { name: pt ? "SLA Principal" : "Main SLA", value: allProcesses.length > 0 ? "92%" : (pt ? "Sem dados" : "No data") };
  }, [businessIndicators, mockDomain, allProcesses.length, pt]);

  // Percentages with mathematical exactness
  const docPercent = allProcesses.length > 0 
    ? Math.round((docsApproved / allProcesses.length) * 100) 
    : 0;

  const contextPercent = allProcesses.length > 0 
    ? Math.round((contextValidated / allProcesses.length) * 100) 
    : 0;

  // Metadata items
  const responsible = mockDomain?.responsible || l1.responsible || (pt ? "Mariana Vasconcelos — Diretora Comercial" : "Mariana Vasconcelos — Commercial Director");
  const businessUnit = mockDomain?.businessUnit || l1.businessUnit || (pt ? "Divisão Corporativa" : "Corporate Division");
  const lastUpdate = mockDomain?.lastUpdate || (pt ? "14 de Setembro de 2026" : "September 14, 2026");
  const criticality = mockDomain?.criticality || (domainCategory === "PRIMARY" ? "Crítica" : "Alta");

  // Handlers
  const handleOpenNewIndicator = () => {
    setEditingIndicator(null);
    setIndicatorModalOpen(true);
  };

  const handleEditIndicator = (ind: BusinessIndicator) => {
    setEditingIndicator(ind);
    setIndicatorModalOpen(true);
  };

  const handleDeleteIndicator = (indId: string) => {
    deleteIndicator(indId);
    toast.success(pt ? "Indicador de negócio removido" : "Business indicator removed");
  };

  return (
    <div className="flex flex-col h-full space-y-6 animate-in fade-in zoom-in-95 duration-200">
      
      {/* ══════════════════════════════════════════════════════════
          CABEÇALHO REESTRUTURADO DO L1 (PANORAMA DO DOMÍNIO)
          ══════════════════════════════════════════════════════════ */}
      <div className="bg-white border border-[#A5A7B0]/25 rounded-md p-6 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6 mb-6">
          <div className="space-y-3 flex-1">
            {/* Top Tag Badge */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-sm bg-[#0C1BA8]/10 text-[#0C1BA8] uppercase tracking-wider">
                {pt ? "Domínio L1" : "Domain L1"}
              </span>
            </div>

            {/* Domain Title & Description */}
            <h1 className="text-2xl lg:text-3xl font-bold text-[#272727] tracking-tight">
              {domainName}
            </h1>
            <p className="text-sm text-[#6B7280] max-w-4xl leading-relaxed">
              {l1.description || mockDomain?.domain || (pt ? "Cadeia estratégica de ponta a ponta com visão consolidada de processos, indicadores de negócio, sistemas e jornadas." : "Strategic value chain with consolidated view of processes, KPIs, systems and journeys.")}
            </p>

            {/* Key Metadata Row */}
            <div className="flex flex-wrap items-center gap-y-2 gap-x-6 pt-2 text-xs text-[#6B7280]">
              <div className="flex items-center gap-1.5">
                <User className="h-3.5 w-3.5 text-[#0C1BA8]" />
                <span>{pt ? "Responsável:" : "Owner:"} <strong className="text-[#272727]">{responsible}</strong></span>
              </div>
              <div className="flex items-center gap-1.5">
                <Building className="h-3.5 w-3.5 text-[#0C1BA8]" />
                <span>{pt ? "Unidade:" : "Unit:"} <strong className="text-[#272727]">{businessUnit}</strong></span>
              </div>
              <div className="flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5 text-[#0C1BA8]" />
                <span>{pt ? "Última atualização:" : "Last update:"} <strong className="text-[#272727]">{lastUpdate}</strong></span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <Button 
              onClick={handleOpenNewIndicator}
              variant="outline"
              className="border-[#0C1BA8]/30 text-[#0C1BA8] hover:bg-[#0C1BA8]/5 font-semibold text-xs h-9"
            >
              <Plus className="h-3.5 w-3.5 mr-1.5" />
              {pt ? "Adicionar indicador de negócio" : "Add business indicator"}
            </Button>
            <Button 
              onClick={() => {
                setCreateL2ModalOpen(true);
                onCreateL2?.();
              }} 
              className="bg-[#0C1BA8] hover:bg-[#04223D] text-white font-semibold text-xs h-9 shadow-xs"
            >
              <Plus className="h-3.5 w-3.5 mr-1.5" />
              {pt ? `Criar novo ${lvl("l2")}` : `Create new ${lvl("l2")}`}
            </Button>
          </div>
        </div>

        {/* FAIXA RESUMIDA DO DOMÍNIO (FULL RIBBON) */}
        <div className="pt-2">
          <DomainContextRibbon
            domainName={domainName}
            domainCategory={domainCategory}
            totalProcesses={allProcesses.length || counts.processes}
            docPercent={docPercent}
            contextPercent={contextPercent}
            journeysCount={journeys.length}
            systemsCount={systemStats.length}
            mainKpiName={mainKpi.name}
            mainKpiValue={mainKpi.value}
            variant="full"
          />
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════
          ABAS DE NAVEGAÇÃO E APROFUNDAMENTO
          ══════════════════════════════════════════════════════════ */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1">
        <TabsList className="bg-transparent border-b border-[#A5A7B0]/20 w-full justify-start rounded-none p-0 h-auto space-x-6">
          <TabsTrigger 
            value="overview" 
            className="data-[state=active]:border-b-2 data-[state=active]:border-[#0C1BA8] data-[state=active]:shadow-none rounded-none bg-transparent px-2 py-3 text-sm font-semibold text-[#6B7280] data-[state=active]:text-[#0C1BA8]"
          >
            {pt ? "Panorama do Domínio" : "Domain Overview"}
          </TabsTrigger>
          <TabsTrigger 
            value="indicators" 
            className="data-[state=active]:border-b-2 data-[state=active]:border-[#0C1BA8] data-[state=active]:shadow-none rounded-none bg-transparent px-2 py-3 text-sm font-semibold text-[#6B7280] data-[state=active]:text-[#0C1BA8]"
          >
            {pt ? "Indicadores" : "Indicators"}
            <span className="ml-1.5 px-1.5 py-0.2 rounded-full bg-gray-100 text-[#272727] text-[10px]">
              {businessIndicators.length + 2}
            </span>
          </TabsTrigger>
          <TabsTrigger 
            value="systems" 
            className="data-[state=active]:border-b-2 data-[state=active]:border-[#0C1BA8] data-[state=active]:shadow-none rounded-none bg-transparent px-2 py-3 text-sm font-semibold text-[#6B7280] data-[state=active]:text-[#0C1BA8]"
          >
            {pt ? "Sistemas e Dados" : "Systems & Data"}
            <span className="ml-1.5 px-1.5 py-0.2 rounded-full bg-gray-100 text-[#272727] text-[10px]">
              {filteredSystemStats.length}
            </span>
          </TabsTrigger>
          <TabsTrigger 
            value="journeys" 
            className="data-[state=active]:border-b-2 data-[state=active]:border-[#0C1BA8] data-[state=active]:shadow-none rounded-none bg-transparent px-2 py-3 text-sm font-semibold text-[#6B7280] data-[state=active]:text-[#0C1BA8]"
          >
            {pt ? "Jornadas de Valor" : "Value Journeys"}
            <span className="ml-1.5 px-1.5 py-0.2 rounded-full bg-gray-100 text-[#272727] text-[10px]">
              {filteredJourneys.length}
            </span>
          </TabsTrigger>
        </TabsList>

        <div className="mt-6">
          {/* ══════════════════════════════════════════════════════
              TAB 1: PANORAMA DO DOMÍNIO (VISÃO GERAL CONSOLIDADA)
              ══════════════════════════════════════════════════════ */}
          <TabsContent value="overview" className="m-0 space-y-8 outline-none">
            {/* 4.2 Desempenho do Negócio (Indicadores de Negócio Mockados + CRUD) */}
            <div className="bg-white border border-[#A5A7B0]/20 rounded-md p-6 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4 pb-3 border-b border-gray-100">
                <div className="flex items-center gap-2.5">
                  <TrendingUp className="h-5 w-5 text-[#0C1BA8]" />
                  <div>
                    <h3 className="font-bold text-[#272727] text-base">
                      {pt ? "Desempenho do Negócio (Indicadores Ativos)" : "Business Performance (Active KPIs)"}
                    </h3>
                    <p className="text-xs text-[#6B7280]">
                      {pt ? "Mede os resultados reais da operação (SLA, tempo de ciclo, volumes e conversão)" : "Measures real operational outcome (SLA, cycle time, volume and conversion)"}
                    </p>
                  </div>
                </div>

                <Button 
                  onClick={handleOpenNewIndicator}
                  className="bg-[#0C1BA8] hover:bg-[#04223D] text-white text-xs h-8 px-3"
                >
                  <Plus className="h-3.5 w-3.5 mr-1" />
                  {pt ? "Adicionar indicador de negócio" : "Add business indicator"}
                </Button>
              </div>

              {businessIndicators.length === 0 ? (
                <div className="p-8 text-center bg-gray-50 rounded-md border border-dashed border-gray-200">
                  <TrendingUp className="h-8 w-8 text-[#A5A7B0] mx-auto mb-2 opacity-50" />
                  <p className="text-sm font-semibold text-[#272727]">
                    {pt ? "Nenhum indicador de negócio mapeado para este domínio." : "No business indicators mapped for this domain."}
                  </p>
                  <p className="text-xs text-[#6B7280] mt-1 max-w-md mx-auto">
                    {pt ? "Você pode cadastrar novos indicadores de desempenho como SLA, Tempo de Ciclo, Volume ou Satisfação." : "You can add operational KPIs like SLA, Cycle Time, Volume or Satisfaction."}
                  </p>
                  <Button 
                    onClick={handleOpenNewIndicator}
                    className="mt-3 bg-[#0C1BA8] hover:bg-[#04223D] text-white text-xs"
                  >
                    <Plus className="h-3.5 w-3.5 mr-1" />
                    {pt ? "Adicionar indicador de negócio agora" : "Add business indicator now"}
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-stretch">
                  {businessIndicators.map(ind => (
                    <div key={ind.id} className="min-h-[255px] flex flex-col">
                      <IndicatorCard 
                        indicator={ind} 
                        aggregationRule={ind.aggregationRule}
                        onEdit={() => handleEditIndicator(ind)}
                        onDelete={() => handleDeleteIndicator(ind.id)}
                        onViewHistory={() => {
                          setSelectedIndicatorForHistory(ind);
                          setHistoryModalOpen(true);
                        }}
                        onLogMeasurement={() => {
                          setSelectedIndicatorForLog(ind);
                          setLogModalOpen(true);
                        }}
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* 4.3 Estrutura do Domínio (Cards L2 Ricos com Métricas e Drill-down) */}
            <div className="bg-white border border-[#A5A7B0]/20 rounded-md p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-100">
                <div className="flex items-center gap-2">
                  <Layers className="h-5 w-5 text-[#0C1BA8]" />
                  <div>
                    <h3 className="font-bold text-[#272727] text-base">
                      {pt ? `Estrutura do Domínio (Níveis ${lvl("l2")})` : `Domain Structure (${lvl("l2")} Levels)`}
                    </h3>
                    <p className="text-xs text-[#6B7280]">
                      {pt ? "Visão consolidada dos agrupamentos do domínio. Clique para continuar o drill-down." : "Consolidated view of domain branches. Click to drill-down."}
                    </p>
                  </div>
                </div>
                <span className="text-xs font-semibold text-[#6B7280]">
                  {l1.l2Processes.length} {lvl("l2")} {pt ? "cadastrados" : "registered"}
                </span>
              </div>

              {l1.l2Processes.length === 0 ? (
                <div className="p-8 text-center bg-gray-50 border border-gray-200 rounded-md">
                  <p className="text-[#6B7280]">{pt ? `Nenhum ${lvl("l2")} cadastrado ainda.` : `No ${lvl("l2")} registered yet.`}</p>
                  <Button onClick={onCreateL2} className="mt-3 bg-[#0C1BA8] hover:bg-[#04223D] text-white text-xs">
                    <Plus className="h-3 w-3 mr-1" /> {pt ? `Criar primeiro ${lvl("l2")}` : `Create first ${lvl("l2")}`}
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {l1.l2Processes.map(l2 => {
                    const c = l2Counts(l2);
                    // Match with mockDomain L2 if available for rich context
                    const mockL2 = mockDomain?.childrenL2.find(m => m.id === l2.id || m.name === l2.name);
                    const l2Procs: ProcessContextData[] = [];
                    if (mockL2) {
                      mockL2.childrenL3.forEach(l3 => l3.childrenL4.forEach(l4 => l2Procs.push(...l4.processes)));
                    }
                    const l2DocPercent = l2Procs.length ? Math.round((l2Procs.filter(p => p.documentationStatus === 'approved').length / l2Procs.length) * 100) : (l2.name.includes("Prospecção") ? 80 : 75);
                    const l2CtxPercent = l2Procs.length ? Math.round((l2Procs.filter(p => p.contextValidationStatus === 'validated').length / l2Procs.length) * 100) : (l2.name.includes("Prospecção") ? 65 : 70);
                    const l2SysCount = l2Procs.reduce((acc, p) => acc + p.systemsUsed.length, 0) || (l2.name.includes("Prospecção") ? 3 : 2);
                    const l2JourneysCount = journeys.filter(j => j.coveredL2.includes(l2.name)).length || 1;

                    return (
                      <div 
                        key={l2.id} 
                        className="bg-white border border-[#A5A7B0]/25 rounded-md p-4 hover:border-[#0C1BA8] hover:shadow-md cursor-pointer transition-all duration-150 group flex flex-col justify-between"
                        onClick={() => onSelectL2(l2.id)}
                      >
                        <div>
                          {/* Header do Card L2 */}
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-sm bg-[#c9dcf2] text-[#0C1BA8] uppercase tracking-wide">
                              {lvl("l2")}
                            </span>
                            <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                              {pt ? "Operacional" : "Active"}
                            </span>
                          </div>

                          <h4 className="font-bold text-[#272727] text-base group-hover:text-[#0C1BA8] transition-colors line-clamp-1">
                            {l2.name}
                          </h4>
                          <p className="text-xs text-[#6B7280] line-clamp-2 mt-1 mb-3">
                            {l2.description || (pt ? "Agrupamento estrutural de processos." : "Structural process grouping.")}
                          </p>

                          {/* Grid de Métricas do L2 */}
                          <div className="grid grid-cols-2 gap-2 bg-gray-50 p-2.5 rounded-sm border border-gray-100 mb-3 text-xs">
                            <div>
                              <span className="text-[10px] text-[#A5A7B0] uppercase block">{pt ? "Hierarquia" : "Hierarchy"}</span>
                              <span className="font-semibold text-[#272727]">
                                {c.l3} {lvl("l3")} · {c.l4} {lvl("l4")}
                              </span>
                            </div>
                            <div>
                              <span className="text-[10px] text-[#A5A7B0] uppercase block">{pt ? "Processos" : "Processes"}</span>
                              <span className="font-bold text-[#0C1BA8]">
                                {c.processes || l2Procs.length} proc.
                              </span>
                            </div>
                            <div>
                              <span className="text-[10px] text-[#A5A7B0] uppercase block">{pt ? "Doc / Contexto" : "Doc / Context"}</span>
                              <span className="font-semibold text-gray-700">
                                {l2DocPercent}% / {l2CtxPercent}%
                              </span>
                            </div>
                            <div>
                              <span className="text-[10px] text-[#A5A7B0] uppercase block">{pt ? "Sistemas / Jornadas" : "Sys / Journeys"}</span>
                              <span className="font-semibold text-gray-700">
                                {l2SysCount} sys · {l2JourneysCount} jor.
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Footer do Card L2 */}
                        <div className="flex items-center justify-between pt-2 border-t border-gray-100 mt-2 text-xs font-semibold text-[#0C1BA8] group-hover:translate-x-1 transition-transform">
                          <span>{pt ? "Explorar Níveis L3 e L4" : "Explore L3 and L4"}</span>
                          <ArrowRight className="h-4 w-4 ml-1" />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Bloco 4 & 5: Jornadas Relacionadas & Sistemas Utilizados */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* 4.4 Jornadas Relacionadas */}
              <div className="bg-white border border-[#A5A7B0]/20 rounded-md p-5 shadow-sm flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-4 pb-2 border-b border-gray-100">
                    <div className="flex items-center gap-2">
                      <Route className="h-5 w-5 text-purple-600" />
                      <h3 className="font-bold text-[#272727] text-base">
                        {pt ? "Jornadas Relacionadas" : "Related Value Journeys"}
                      </h3>
                    </div>
                    <span className="text-xs font-semibold text-[#6B7280]">
                      {journeys.length} {pt ? "jornadas atravessam este domínio" : "journeys cross this domain"}
                    </span>
                  </div>

                  {journeys.length === 0 ? (
                    <div className="p-8 text-center text-[#6B7280] text-xs">
                      {pt ? "Nenhuma jornada mapeada cruza este domínio ainda." : "No journeys cross this domain yet."}
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {journeys.slice(0, 3).map(j => {
                        const role = j.domainRoles?.[domainName] || 'principal';
                        const otherDomains = j.coveredL1.filter(d => d !== domainName);

                        return (
                          <div 
                            key={j.id}
                            className="p-3 bg-gray-50 border border-gray-200/80 rounded-md hover:border-[#0C1BA8] transition-colors"
                          >
                            <div className="flex justify-between items-start gap-2 mb-1">
                              <h4 className="font-bold text-[#272727] text-sm hover:text-[#0C1BA8]">
                                {j.name}
                              </h4>
                              <span className={cn(
                                "text-[9px] font-bold px-2 py-0.5 rounded-sm uppercase tracking-wide shrink-0",
                                role === 'principal' ? "bg-blue-100 text-blue-800" :
                                role === 'participante' ? "bg-green-100 text-green-800" :
                                "bg-amber-100 text-amber-800"
                              )}>
                                {role}
                              </span>
                            </div>
                            <p className="text-xs text-[#6B7280] line-clamp-1 mb-2" title={j.objective}>
                              {j.objective}
                            </p>
                            <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] text-[#6B7280] pt-2 border-t border-gray-200/50">
                              <span>
                                <strong>{j.participatingProcessIds.length}</strong> {pt ? "processos" : "processes"} · <strong>{j.systemsInvolved.length}</strong> {pt ? "sistemas" : "systems"}
                                {otherDomains.length > 0 && ` · Outros: ${otherDomains.join(', ')}`}
                              </span>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-6 text-xs text-[#0C1BA8] hover:bg-[#0C1BA8]/5 px-1.5"
                                onClick={() => {
                                  const params = new URLSearchParams(window.location.search);
                                  params.set('view', 'journeys');
                                  params.set('journeyId', j.id);
                                  window.history.pushState(null, '', `?${params.toString()}`);
                                  window.dispatchEvent(new Event('popstate'));
                                }}
                              >
                                {pt ? "Detalhar" : "Details"} <ArrowRight className="h-3 w-3 ml-1" />
                              </Button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                <div className="pt-3 border-t border-gray-100 flex justify-end">
                  <Button
                    variant="link"
                    className="text-xs text-[#0C1BA8] p-0 h-auto"
                    onClick={() => setActiveTab('journeys')}
                  >
                    {pt ? "Ver todas as jornadas na aba Jornadas →" : "View all journeys in Journeys tab →"}
                  </Button>
                </div>
              </div>

              {/* 4.5 Sistemas Utilizados */}
              <div className="bg-white border border-[#A5A7B0]/20 rounded-md p-5 shadow-sm flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-4 pb-2 border-b border-gray-100">
                    <div className="flex items-center gap-2">
                      <Monitor className="h-5 w-5 text-gray-700" />
                      <h3 className="font-bold text-[#272727] text-base">
                        {pt ? "Sistemas Utilizados" : "Systems Identified"}
                      </h3>
                    </div>
                    <span className="text-xs font-semibold text-[#6B7280]">
                      {systemStats.length} {pt ? "aplicações corporativas" : "corporate apps"}
                    </span>
                  </div>

                  {systemStats.length === 0 ? (
                    <div className="p-8 text-center text-[#6B7280] text-xs">
                      {pt ? "Nenhum sistema mapeado para este domínio ainda." : "No systems mapped for this domain yet."}
                    </div>
                  ) : (
                    <div className="space-y-2.5">
                      {systemStats.slice(0, 4).map(stat => (
                        <div 
                          key={stat.systemName}
                          className={cn(
                            "p-3 rounded-md border flex items-center justify-between gap-3 text-xs",
                            stat.isManual ? "bg-amber-50/60 border-amber-200" : "bg-gray-50 border-gray-200"
                          )}
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            {stat.isManual ? (
                              <AlertTriangle className="h-4 w-4 text-amber-600 shrink-0" />
                            ) : (
                              <Monitor className="h-4 w-4 text-gray-500 shrink-0" />
                            )}
                            <div className="min-w-0">
                              <h5 className="font-bold text-[#272727] truncate">{stat.systemName}</h5>
                              {stat.isManual && (
                                <span className="text-[10px] text-amber-700 font-bold uppercase block">
                                  {pt ? "Alerta: Dependência manual recorrente" : "Alert: Recurring manual dependency"}
                                </span>
                              )}
                            </div>
                          </div>

                          <div className="flex items-center gap-4 shrink-0 text-right">
                            <div>
                              <strong className="text-sm font-bold text-[#272727]">{stat.processes.size}</strong>
                              <span className="text-[10px] text-[#A5A7B0] uppercase block">{pt ? "Processos" : "Processes"}</span>
                            </div>
                            <div>
                              <strong className="text-sm font-bold text-[#272727]">{stat.journeys.size}</strong>
                              <span className="text-[10px] text-[#A5A7B0] uppercase block">{pt ? "Jornadas" : "Journeys"}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="pt-3 border-t border-gray-100 flex justify-end">
                  <Button
                    variant="link"
                    className="text-xs text-[#0C1BA8] p-0 h-auto"
                    onClick={() => setActiveTab('systems')}
                  >
                    {pt ? "Ver matriz de sistemas completa →" : "View full systems matrix →"}
                  </Button>
                </div>
              </div>
            </div>

            {/* Seção 10: Relação com Normativos (Preparação de visualização) */}
            <div className="bg-white border border-[#A5A7B0]/20 rounded-md p-5 shadow-sm">
              <div className="flex items-center justify-between mb-3 pb-2 border-b border-gray-100">
                <div className="flex items-center gap-2">
                  <FileCheck className="h-5 w-5 text-gray-600" />
                  <h3 className="font-bold text-[#272727] text-base">
                    {pt ? "Normativos e Políticas Corporativas Vinculadas" : "Associated Regulations & Corporate Policies"}
                  </h3>
                </div>
                <span className="text-xs text-[#6B7280] font-medium">
                  {pt ? "2 políticas ativas vinculadas a este domínio" : "2 active policies attached to this domain"}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="p-3 rounded border border-gray-200 bg-gray-50 flex items-start justify-between gap-3">
                  <div>
                    <h5 className="font-bold text-[#272727]">Política Comercial Corporativa (Rev. 2026)</h5>
                    <p className="text-[#6B7280] text-[11px] mt-0.5">Define alçadas de aprovação de desconto e limites de contratação.</p>
                    <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded mt-2 inline-block border border-emerald-200">
                      {pt ? "Status: Conforme · Próxima revisão: Nov/2026" : "Status: Compliant · Next review: Nov/2026"}
                    </span>
                  </div>
                  <ShieldCheck className="h-5 w-5 text-emerald-600 shrink-0" />
                </div>

                <div className="p-3 rounded border border-gray-200 bg-gray-50 flex items-start justify-between gap-3">
                  <div>
                    <h5 className="font-bold text-[#272727]">LGPD - Governança e Tratamento de Dados Comerciais</h5>
                    <p className="text-[#6B7280] text-[11px] mt-0.5">Regulamenta o armazenamento e opt-in de contatos e decisores B2B no CRM.</p>
                    <span className="text-[10px] font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded mt-2 inline-block border border-blue-200">
                      {pt ? "Status: Conforme · Próxima revisão: Jan/2027" : "Status: Compliant · Next review: Jan/2027"}
                    </span>
                  </div>
                  <ShieldCheck className="h-5 w-5 text-blue-600 shrink-0" />
                </div>
              </div>
            </div>

          </TabsContent>

          {/* ══════════════════════════════════════════════════════
              TAB 2: INDICADORES (CONTEXTO VS NEGÓCIO ESTRUTURADOS)
              ══════════════════════════════════════════════════════ */}
          <TabsContent value="indicators" className="m-0 space-y-6 outline-none">
            <DomainIndicatorsView
              l1={l1}
              mockDomain={mockDomain}
              journeys={journeys}
              businessIndicators={businessIndicators}
              onAddIndicator={handleOpenNewIndicator}
              onEditIndicator={handleEditIndicator}
              onDeleteIndicator={handleDeleteIndicator}
            />
          </TabsContent>

          {/* ══════════════════════════════════════════════════════
              TAB 3: SISTEMAS E DADOS (MAPA TRANSVERSAL)
              ══════════════════════════════════════════════════════ */}
          <TabsContent value="systems" className="m-0 space-y-6 outline-none">
            <div className="bg-white border border-[#A5A7B0]/20 rounded-md p-6 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4 pb-3 border-b border-gray-100">
                <div>
                  <h3 className="font-bold text-[#272727] text-base">
                    {pt ? "Relação: Sistema → Processos → Jornadas → Domínios" : "Relation: System → Processes → Journeys → Domains"}
                  </h3>
                  <p className="text-xs text-[#6B7280]">
                    {pt ? "Camada sistêmica transversal operada no domínio com rastreabilidade operacional." : "Transversal systemic layer operated in this domain with operational traceability."}
                  </p>
                </div>
                <span className="text-xs font-semibold text-[#0C1BA8]">
                  {filteredSystemStats.length} {pt ? "sistemas mapeados" : "systems mapped"}
                </span>
              </div>

              {/* Filtros Hierárquicos por Nível (L2, L3, L4) */}
              <div className="flex flex-wrap items-center gap-3 p-3 bg-gray-50/80 rounded-md border border-gray-200 mb-6 text-xs">
                <div className="flex items-center gap-1.5 text-[#6B7280] font-semibold">
                  <Filter className="h-3.5 w-3.5 text-[#0C1BA8]" />
                  <span>{pt ? "Filtrar por nível:" : "Filter by level:"}</span>
                </div>
                <div className="flex items-center gap-1">
                  {(["all", "l2", "l3", "l4"] as const).map((level) => (
                    <button
                      key={level}
                      type="button"
                      onClick={() => {
                        setSystemsFilterLevel(level);
                        setSystemsFilterNodeId("all");
                      }}
                      className={cn(
                        "px-2.5 py-1 rounded text-xs font-medium transition-colors",
                        systemsFilterLevel === level
                          ? "bg-[#0C1BA8] text-white"
                          : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
                      )}
                    >
                      {level === "all" ? (pt ? "Todos" : "All") : level.toUpperCase()}
                    </button>
                  ))}
                </div>

                {systemsFilterLevel !== "all" && (
                  <div className="flex items-center gap-2 ml-auto">
                    <span className="text-[#6B7280]">
                      {systemsFilterLevel === "l2" && (pt ? "Selecionar L2:" : "Select L2:")}
                      {systemsFilterLevel === "l3" && (pt ? "Selecionar L3:" : "Select L3:")}
                      {systemsFilterLevel === "l4" && (pt ? "Selecionar L4:" : "Select L4:")}
                    </span>
                    <select
                      value={systemsFilterNodeId}
                      onChange={(e) => setSystemsFilterNodeId(e.target.value)}
                      className="border border-gray-300 rounded px-2.5 py-1 text-xs bg-white text-[#272727] max-w-[240px] truncate focus:outline-none focus:ring-1 focus:ring-[#0C1BA8]"
                    >
                      <option value="all">{pt ? "Todos deste nível" : "All of this level"}</option>
                      {systemsFilterLevel === "l2" &&
                        l2Nodes.map((node) => (
                          <option key={node.id} value={node.id}>
                            {node.code} - {node.name}
                          </option>
                        ))}
                      {systemsFilterLevel === "l3" &&
                        l3Nodes.map((node) => (
                          <option key={node.id} value={node.id}>
                            {node.code} - {node.name}
                          </option>
                        ))}
                      {systemsFilterLevel === "l4" &&
                        l4Nodes.map((node) => (
                          <option key={node.id} value={node.id}>
                            {node.code} - {node.name}
                          </option>
                        ))}
                    </select>
                  </div>
                )}
              </div>

              {filteredSystemStats.length === 0 ? (
                <div className="p-8 text-center bg-gray-50 rounded border text-xs text-[#6B7280]">
                  {pt ? "Nenhum sistema encontrado para o filtro selecionado." : "No systems found for the selected filter."}
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredSystemStats.sort((a, b) => b.processes.size - a.processes.size).map(stat => (
                    <div 
                      key={stat.systemName} 
                      className={cn(
                        "p-4 rounded-md border flex flex-col md:flex-row md:items-center justify-between gap-4",
                        stat.isManual ? "bg-amber-50/70 border-amber-200" : "bg-gray-50 border-gray-200"
                      )}
                    >
                      <div className="flex items-start gap-3">
                        {stat.isManual ? (
                          <AlertTriangle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
                        ) : (
                          <Monitor className="h-5 w-5 text-gray-600 shrink-0 mt-0.5" />
                        )}
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-bold text-[#272727] text-sm">{stat.systemName}</h4>
                            <span className={cn(
                              "text-[9px] font-bold px-2 py-0.5 rounded uppercase tracking-wide",
                              stat.isManual ? "bg-amber-200 text-amber-900" : "bg-blue-100 text-blue-800"
                            )}>
                              {stat.isManual ? (pt ? "Uso Manual" : "Manual Usage") : (pt ? "Integrado" : "Integrated")}
                            </span>
                          </div>

                          {stat.isManual && (
                            <span className="text-[11px] text-amber-800 font-semibold block mt-0.5">
                              {pt ? "Alerta: Dependência manual recorrente — risco de inconsistência de dados" : "Alert: Manual recurring dependency — risk of data inconsistency"}
                            </span>
                          )}

                          {stat.dataObjects.size > 0 && (
                            <div className="flex flex-wrap gap-1.5 mt-2">
                              {Array.from(stat.dataObjects).map(obj => (
                                <span key={obj} className="text-[10px] bg-white border border-gray-200 text-[#6B7280] px-1.5 py-0.5 rounded">
                                  {obj}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex gap-6 text-sm shrink-0">
                        <div className="flex flex-col items-center">
                          <span className="font-bold text-[#272727] text-base">{stat.processes.size}</span>
                          <span className="text-[10px] text-[#A5A7B0] uppercase">{pt ? "Processos" : "Processes"}</span>
                        </div>
                        <div className="flex flex-col items-center">
                          <span className="font-bold text-[#272727] text-base">{stat.journeys.size}</span>
                          <span className="text-[10px] text-[#A5A7B0] uppercase">{pt ? "Jornadas" : "Journeys"}</span>
                        </div>
                        <div className="flex flex-col items-center">
                          <span className="font-bold text-[#272727] text-base">1</span>
                          <span className="text-[10px] text-[#A5A7B0] uppercase">{pt ? "Domínio" : "Domain"}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>

          {/* ══════════════════════════════════════════════════════
              TAB 4: JORNADAS DE VALOR (DETALHAMENTO)
              ══════════════════════════════════════════════════════ */}
          <TabsContent value="journeys" className="m-0 space-y-6 outline-none">
            {/* Filtros Hierárquicos por Nível (L2, L3, L4) */}
            <div className="flex flex-wrap items-center gap-3 p-3 bg-white rounded-md border border-gray-200 shadow-2xs text-xs">
              <div className="flex items-center gap-1.5 text-[#6B7280] font-semibold">
                <Filter className="h-3.5 w-3.5 text-[#0C1BA8]" />
                <span>{pt ? "Filtrar por nível:" : "Filter by level:"}</span>
              </div>
              <div className="flex items-center gap-1">
                {(["all", "l2", "l3", "l4"] as const).map((level) => (
                  <button
                    key={level}
                    type="button"
                    onClick={() => {
                      setJourneysFilterLevel(level);
                      setJourneysFilterNodeId("all");
                    }}
                    className={cn(
                      "px-2.5 py-1 rounded text-xs font-medium transition-colors",
                      journeysFilterLevel === level
                        ? "bg-[#0C1BA8] text-white"
                        : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
                    )}
                  >
                    {level === "all" ? (pt ? "Todas" : "All") : level.toUpperCase()}
                  </button>
                ))}
              </div>

              {journeysFilterLevel !== "all" && (
                <div className="flex items-center gap-2 ml-auto">
                  <span className="text-[#6B7280]">
                    {journeysFilterLevel === "l2" && (pt ? "Selecionar L2:" : "Select L2:")}
                    {journeysFilterLevel === "l3" && (pt ? "Selecionar L3:" : "Select L3:")}
                    {journeysFilterLevel === "l4" && (pt ? "Selecionar L4:" : "Select L4:")}
                  </span>
                  <select
                    value={journeysFilterNodeId}
                    onChange={(e) => setJourneysFilterNodeId(e.target.value)}
                    className="border border-gray-300 rounded px-2.5 py-1 text-xs bg-white text-[#272727] max-w-[240px] truncate focus:outline-none focus:ring-1 focus:ring-[#0C1BA8]"
                  >
                    <option value="all">{pt ? "Todas deste nível" : "All of this level"}</option>
                    {journeysFilterLevel === "l2" &&
                      l2Nodes.map((node) => (
                        <option key={node.id} value={node.id}>
                          {node.code} - {node.name}
                        </option>
                      ))}
                    {journeysFilterLevel === "l3" &&
                      l3Nodes.map((node) => (
                        <option key={node.id} value={node.id}>
                          {node.code} - {node.name}
                        </option>
                      ))}
                    {journeysFilterLevel === "l4" &&
                      l4Nodes.map((node) => (
                        <option key={node.id} value={node.id}>
                          {node.code} - {node.name}
                        </option>
                      ))}
                  </select>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredJourneys.length === 0 ? (
                <div className="col-span-full p-8 text-center bg-white border border-[#A5A7B0]/20 rounded-md">
                  <p className="text-[#6B7280]">{pt ? "Nenhuma jornada encontrada para o filtro selecionado." : "No value journeys found for the selected filter."}</p>
                </div>
              ) : (
                filteredJourneys.map(j => {
                  const role = j.domainRoles?.[domainName] || 'principal';
                  const l1ProcsInJourney = allProcesses.filter(p => j.participatingProcessIds.includes(p.id));
                  
                  return (
                    <div key={j.id} className="bg-white border border-[#A5A7B0]/20 rounded-md p-5 flex flex-col justify-between shadow-xs">
                      <div>
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-bold text-[#0C1BA8] text-base">{j.name}</h4>
                          <span className={cn(
                            "text-[10px] font-bold px-2 py-0.5 rounded-sm uppercase tracking-wide",
                            role === 'principal' ? "bg-blue-100 text-blue-800" :
                            role === 'participante' ? "bg-green-100 text-green-800" :
                            role === 'suporte' ? "bg-amber-100 text-amber-800" :
                            "bg-gray-200 text-gray-700"
                          )}>
                            {role}
                          </span>
                        </div>
                        <p className="text-xs text-[#6B7280] mb-4 line-clamp-2" title={j.objective}>
                          {j.objective}
                        </p>
                        
                        <div className="bg-gray-50 border border-gray-100 p-3 rounded-md mb-4">
                          <h5 className="text-[10px] font-bold text-[#A5A7B0] uppercase mb-2">
                            {pt ? "Processos deste Domínio Participantes" : "Participating Domain Processes"}
                          </h5>
                          {l1ProcsInJourney.length === 0 ? (
                            <span className="text-xs text-[#A5A7B0] italic">
                              {pt ? "Processos em mapeamento" : "Processes being mapped"}
                            </span>
                          ) : (
                            <ul className="space-y-1.5">
                              {l1ProcsInJourney.map(p => (
                                <li key={p.id} className="text-xs text-[#272727] flex items-center gap-2">
                                  <div className="h-1.5 w-1.5 bg-[#0C1BA8] rounded-full shrink-0" />
                                  <span className="truncate" title={p.name}>{p.name}</span>
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center justify-between mt-auto pt-3 border-t border-gray-100 text-xs">
                        <div className="text-[11px] font-medium text-[#6B7280]">
                          <Route className="inline h-3.5 w-3.5 mr-1 text-purple-600" />
                          {j.participatingProcessIds.length} {pt ? "processos totais na jornada" : "total processes in journey"}
                        </div>
                        <Button 
                          variant="ghost" 
                          className="h-8 text-xs text-[#0C1BA8] hover:bg-[#0C1BA8]/5 font-semibold"
                          onClick={() => {
                            const params = new URLSearchParams(window.location.search);
                            params.set('view', 'journeys');
                            params.set('journeyId', j.id);
                            window.history.pushState(null, '', `?${params.toString()}`);
                            window.dispatchEvent(new Event('popstate'));
                          }}
                        >
                          {pt ? "Detalhar Jornada" : "Journey Details"} <ArrowRight className="ml-1 h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </TabsContent>

        </div>
      </Tabs>

      {/* MODAL DE CRIAÇÃO / EDIÇÃO DE INDICADOR DE NEGÓCIO */}
      <CreateEditBusinessIndicatorModal
        open={indicatorModalOpen}
        onOpenChange={setIndicatorModalOpen}
        domainName={domainName}
        domainId={mockDomain?.id || l1.id}
        editingIndicator={editingIndicator}
      />

      {/* MODAIS DE MEDIÇÃO E HISTÓRICO */}
      <LogMeasurementModal
        open={logModalOpen}
        onOpenChange={setLogModalOpen}
        indicator={selectedIndicatorForLog}
      />

      <IndicatorHistoryModal
        open={historyModalOpen}
        onOpenChange={setHistoryModalOpen}
        indicator={selectedIndicatorForHistory}
        onLogNewMeasurement={() => {
          setSelectedIndicatorForLog(selectedIndicatorForHistory);
          setLogModalOpen(true);
        }}
      />

      {/* MODAL DE CRIAÇÃO / EDIÇÃO DE L2 */}
      <CreateEditL2Modal
        isOpen={createL2ModalOpen}
        onClose={() => setCreateL2ModalOpen(false)}
        l1Id={l1.id}
        editingL2={null}
      />

    </div>
  );
}
