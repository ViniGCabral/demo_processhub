import React, { useState, useMemo } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { 
  L1Process, 
  L2Process, 
  L3Process,
  L4Task
} from "@/stores/valueChainStore";
import { 
  ArchNodeL1, 
  ArchNodeL2, 
  ArchNodeL3, 
  ArchNodeL4, 
  ProcessContextData, 
  BusinessIndicator, 
  ContextIndicator, 
  JourneyData 
} from "@/types/architectureContextTypes";
import { IndicatorCard, IndicatorBadgeOrigin } from "./IndicatorCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  ChevronRight, 
  RotateCcw, 
  Plus, 
  TrendingUp, 
  FileCheck, 
  Layers, 
  Route, 
  Filter, 
  CheckCircle2, 
  AlertTriangle, 
  Info, 
  ArrowRight,
  ShieldCheck,
  Building,
  Monitor,
  ExternalLink,
  Search
} from "lucide-react";
import { LogMeasurementModal } from "./modals/LogMeasurementModal";
import { IndicatorHistoryModal } from "./modals/IndicatorHistoryModal";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export type ArchitectureScopeType = 'all' | 'l2' | 'l3' | 'l4' | 'process' | 'journeys';
export type IndicatorNatureFilter = 'all' | 'business' | 'context' | 'proprio' | 'consolidado' | 'jornada';

interface DomainIndicatorsViewProps {
  l1: L1Process;
  mockDomain?: ArchNodeL1;
  journeys: JourneyData[];
  businessIndicators: BusinessIndicator[];
  onAddIndicator: () => void;
  onEditIndicator: (ind: BusinessIndicator) => void;
  onDeleteIndicator: (id: string) => void;
}

export function DomainIndicatorsView({
  l1,
  mockDomain,
  journeys,
  businessIndicators,
  onAddIndicator,
  onEditIndicator,
  onDeleteIndicator,
}: DomainIndicatorsViewProps) {
  const { language } = useLanguage();
  const pt = language === "PT";

  const domainName = pt ? l1.namePT : l1.nameEN;

  // ── 1. ESTADOS DE NAVEGAÇÃO E ESCOPO ────────────────────────
  const [scopeType, setScopeType] = useState<ArchitectureScopeType>('all');
  const [selectedL2Id, setSelectedL2Id] = useState<string>('');
  const [selectedL3Id, setSelectedL3Id] = useState<string>('');
  const [selectedL4Id, setSelectedL4Id] = useState<string>('');
  const [selectedProcessId, setSelectedProcessId] = useState<string>('');
  const [selectedJourneyId, setSelectedJourneyId] = useState<string>('all');

  // Filtro por natureza e busca por texto
  const [natureFilter, setNatureFilter] = useState<IndicatorNatureFilter>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');

  // Modais de medição e histórico
  const [logModalOpen, setLogModalOpen] = useState<boolean>(false);
  const [selectedIndicatorForLog, setSelectedIndicatorForLog] = useState<BusinessIndicator | null>(null);
  const [historyModalOpen, setHistoryModalOpen] = useState<boolean>(false);
  const [selectedIndicatorForHistory, setSelectedIndicatorForHistory] = useState<BusinessIndicator | null>(null);

  // ── 2. EXTRAÇÃO HIERÁRQUICA DA ÁRVORE ───────────────────────
  const l2List = useMemo(() => {
    if (mockDomain?.childrenL2 && mockDomain.childrenL2.length > 0) {
      return mockDomain.childrenL2;
    }
    return (l1.l2Processes || []).map(l2 => ({
      id: l2.id,
      name: l2.name,
      childrenL3: (l2.l3Processes || []).map(l3 => ({
        id: l3.id,
        name: l3.name,
        childrenL4: (l3.l4Tasks || []).map(l4 => ({
          id: l4.id,
          name: l4.name,
          processes: [] as ProcessContextData[]
        }))
      }))
    })) as ArchNodeL2[];
  }, [mockDomain, l1]);

  // Lista de nós L3 disponíveis
  const availableL3List = useMemo(() => {
    if (selectedL2Id) {
      const foundL2 = l2List.find(l => l.id === selectedL2Id);
      return foundL2 ? foundL2.childrenL3 : [];
    }
    return l2List.flatMap(l => l.childrenL3);
  }, [l2List, selectedL2Id]);

  // Lista de nós L4 disponíveis
  const availableL4List = useMemo(() => {
    if (selectedL3Id) {
      const foundL3 = availableL3List.find(l => l.id === selectedL3Id);
      return foundL3 ? foundL3.childrenL4 : [];
    }
    return availableL3List.flatMap(l => l.childrenL4);
  }, [availableL3List, selectedL3Id]);

  // Lista de todos os processos do domínio
  const allDomainProcesses = useMemo(() => {
    const list: ProcessContextData[] = [];
    l2List.forEach(l2 => {
      l2.childrenL3.forEach(l3 => {
        l3.childrenL4.forEach(l4 => {
          list.push(...l4.processes);
        });
      });
    });
    return list;
  }, [l2List]);

  // Processos do escopo ativo
  const activeProcesses = useMemo(() => {
    if (scopeType === 'all') {
      return allDomainProcesses;
    }
    if (scopeType === 'l2' && selectedL2Id) {
      const l2 = l2List.find(x => x.id === selectedL2Id);
      if (!l2) return [];
      const procs: ProcessContextData[] = [];
      l2.childrenL3.forEach(l3 => l3.childrenL4.forEach(l4 => procs.push(...l4.processes)));
      return procs;
    }
    if (scopeType === 'l3' && selectedL3Id) {
      const l3 = availableL3List.find(x => x.id === selectedL3Id);
      if (!l3) return [];
      const procs: ProcessContextData[] = [];
      l3.childrenL4.forEach(l4 => procs.push(...l4.processes));
      return procs;
    }
    if (scopeType === 'l4' && selectedL4Id) {
      const l4 = availableL4List.find(x => x.id === selectedL4Id);
      return l4 ? l4.processes : [];
    }
    if (scopeType === 'process' && selectedProcessId) {
      const proc = allDomainProcesses.find(p => p.id === selectedProcessId);
      return proc ? [proc] : [];
    }
    if (scopeType === 'journeys') {
      if (selectedJourneyId && selectedJourneyId !== 'all') {
        const j = journeys.find(x => x.id === selectedJourneyId);
        return j ? allDomainProcesses.filter(p => j.participatingProcessIds.includes(p.id)) : allDomainProcesses;
      }
      return allDomainProcesses;
    }
    return allDomainProcesses;
  }, [scopeType, selectedL2Id, selectedL3Id, selectedL4Id, selectedProcessId, selectedJourneyId, l2List, availableL3List, availableL4List, allDomainProcesses, journeys]);

  // Entidades ativas selecionadas para montagem do Breadcrumb
  const activeL2 = useMemo(() => l2List.find(x => x.id === selectedL2Id), [l2List, selectedL2Id]);
  const activeL3 = useMemo(() => availableL3List.find(x => x.id === selectedL3Id), [availableL3List, selectedL3Id]);
  const activeL4 = useMemo(() => availableL4List.find(x => x.id === selectedL4Id), [availableL4List, selectedL4Id]);
  const activeProcess = useMemo(() => allDomainProcesses.find(x => x.id === selectedProcessId), [allDomainProcesses, selectedProcessId]);
  const activeJourney = useMemo(() => journeys.find(x => x.id === selectedJourneyId), [journeys, selectedJourneyId]);

  // Jornadas relacionadas ao escopo ativo
  const activeScopeJourneys = useMemo(() => {
    if (scopeType === 'all') return journeys;
    if (scopeType === 'journeys') {
      if (selectedJourneyId !== 'all') {
        const j = journeys.find(x => x.id === selectedJourneyId);
        return j ? [j] : [];
      }
      return journeys;
    }
    const procIds = new Set(activeProcesses.map(p => p.id));
    return journeys.filter(j => 
      j.participatingProcessIds.some(id => procIds.has(id)) ||
      (activeL2 && j.coveredL2.includes(activeL2.name)) ||
      (activeL3 && j.coveredL3.includes(activeL3.name)) ||
      (activeL4 && j.coveredL4.includes(activeL4.name))
    );
  }, [scopeType, journeys, selectedJourneyId, activeProcesses, activeL2, activeL3, activeL4]);

  // ── 3. NAVEGAÇÃO E TRANSIÇÕES DE ESCOPO ─────────────────────
  const resetToL1 = () => {
    setScopeType('all');
    setSelectedL2Id('');
    setSelectedL3Id('');
    setSelectedL4Id('');
    setSelectedProcessId('');
    setSelectedJourneyId('all');
  };

  const handleSelectScopeType = (type: ArchitectureScopeType) => {
    setScopeType(type);
    if (type === 'all') {
      resetToL1();
    } else if (type === 'l2') {
      if (!selectedL2Id && l2List.length > 0) setSelectedL2Id(l2List[0].id);
      setSelectedL3Id('');
      setSelectedL4Id('');
      setSelectedProcessId('');
    } else if (type === 'l3') {
      if (!selectedL2Id && l2List.length > 0) setSelectedL2Id(l2List[0].id);
      const l2 = l2List.find(x => x.id === (selectedL2Id || l2List[0]?.id));
      if (l2 && l2.childrenL3.length > 0 && !selectedL3Id) {
        setSelectedL3Id(l2.childrenL3[0].id);
      }
      setSelectedL4Id('');
      setSelectedProcessId('');
    } else if (type === 'l4') {
      if (!selectedL2Id && l2List.length > 0) setSelectedL2Id(l2List[0].id);
      const l2 = l2List.find(x => x.id === (selectedL2Id || l2List[0]?.id));
      const l3 = l2?.childrenL3[0];
      if (l3) {
        setSelectedL3Id(l3.id);
        if (l3.childrenL4.length > 0 && !selectedL4Id) {
          setSelectedL4Id(l3.childrenL4[0].id);
        }
      }
      setSelectedProcessId('');
    } else if (type === 'process') {
      if (!selectedProcessId && allDomainProcesses.length > 0) {
        const firstProc = allDomainProcesses[0];
        setSelectedProcessId(firstProc.id);
        // Atualizar hierarquia correspondente
        for (const l2 of l2List) {
          for (const l3 of l2.childrenL3) {
            for (const l4 of l3.childrenL4) {
              if (l4.processes.some(p => p.id === firstProc.id)) {
                setSelectedL2Id(l2.id);
                setSelectedL3Id(l3.id);
                setSelectedL4Id(l4.id);
                break;
              }
            }
          }
        }
      }
    } else if (type === 'journeys') {
      setSelectedJourneyId('all');
    }
  };

  const handleSelectL2 = (l2Id: string) => {
    setSelectedL2Id(l2Id);
    setScopeType('l2');
    setSelectedL3Id('');
    setSelectedL4Id('');
    setSelectedProcessId('');
  };

  const handleSelectL3 = (l3Id: string) => {
    setSelectedL3Id(l3Id);
    setScopeType('l3');
    for (const l2 of l2List) {
      if (l2.childrenL3.some(l3 => l3.id === l3Id)) {
        setSelectedL2Id(l2.id);
        break;
      }
    }
    setSelectedL4Id('');
    setSelectedProcessId('');
  };

  const handleSelectL4 = (l4Id: string) => {
    setSelectedL4Id(l4Id);
    setScopeType('l4');
    for (const l2 of l2List) {
      for (const l3 of l2.childrenL3) {
        if (l3.childrenL4.some(l4 => l4.id === l4Id)) {
          setSelectedL2Id(l2.id);
          setSelectedL3Id(l3.id);
          break;
        }
      }
    }
    setSelectedProcessId('');
  };

  const handleSelectProcess = (procId: string) => {
    setSelectedProcessId(procId);
    setScopeType('process');
    for (const l2 of l2List) {
      for (const l3 of l2.childrenL3) {
        for (const l4 of l3.childrenL4) {
          if (l4.processes.some(p => p.id === procId)) {
            setSelectedL2Id(l2.id);
            setSelectedL3Id(l3.id);
            setSelectedL4Id(l4.id);
            return;
          }
        }
      }
    }
  };

  // ── 4. INDICADORES DE CONTEXTO DO ESCOPO ATIVO ─────────────
  const contextMetrics = useMemo(() => {
    const total = activeProcesses.length;
    const docsApproved = activeProcesses.filter(p => p.documentationStatus === 'approved').length;
    const contextValidated = activeProcesses.filter(p => p.contextValidationStatus === 'validated').length;
    const evidencesCount = activeProcesses.reduce((acc, p) => acc + (p.evidences ? p.evidences.length : 0), 0);
    const openQuestionsCount = activeProcesses.reduce((acc, p) => acc + (p.openQuestions ? p.openQuestions.length : 0), 0);
    const processesWithoutOwner = activeProcesses.filter(p => !p.responsible || p.responsible.trim() === '').length;
    const processesWithoutRegulations = activeProcesses.filter(p => !p.regulations || p.regulations.length === 0).length;

    const docPercent = total > 0 ? Math.round((docsApproved / total) * 100) : 0;
    const contextPercent = total > 0 ? Math.round((contextValidated / total) * 100) : 0;

    return {
      total,
      docsApproved,
      contextValidated,
      docPercent,
      contextPercent,
      evidencesCount,
      openQuestionsCount,
      processesWithoutOwner,
      processesWithoutRegulations
    };
  }, [activeProcesses]);

  // ── 5. INDICADORES DE NEGÓCIO DO ESCOPO ATIVO ──────────────
  interface DisplayIndicator {
    indicator: BusinessIndicator;
    originBadge: IndicatorBadgeOrigin;
    consolidatedInfo?: string;
    scopeLabel?: string;
    isOwn: boolean;
  }

  const scopeBusinessIndicators: DisplayIndicator[] = useMemo(() => {
    const results: DisplayIndicator[] = [];
    const seenIds = new Set<string>();

    if (scopeType === 'all') {
      // Indicadores do Domínio L1
      businessIndicators.forEach(ind => {
        const isConsolidated = ind.valueSource === 'consolidado';
        results.push({
          indicator: ind,
          originBadge: isConsolidated ? 'consolidado' : 'proprio',
          consolidatedInfo: isConsolidated 
            ? `${pt ? "Consolidado de" : "Consolidated from"} ${allDomainProcesses.length} ${pt ? "processos" : "processes"}` 
            : undefined,
          scopeLabel: `${domainName} — L1`,
          isOwn: !isConsolidated
        });
        seenIds.add(ind.id);
      });
      return results;
    }

    if (scopeType === 'process' && activeProcess) {
      // Indicadores operacionais do processo selecionado
      activeProcess.businessIndicators.forEach(ind => {
        results.push({
          indicator: ind,
          originBadge: 'operacional',
          scopeLabel: `${pt ? "Processo:" : "Process:"} ${activeProcess.name}`,
          isOwn: true
        });
        seenIds.add(ind.id);
      });
      return results;
    }

    if (scopeType === 'journeys') {
      // Indicadores relacionados às jornadas
      activeScopeJourneys.forEach(j => {
        j.businessIndicators.forEach(ind => {
          if (!seenIds.has(ind.id)) {
            results.push({
              indicator: ind,
              originBadge: 'jornada',
              scopeLabel: `${pt ? "Jornada:" : "Journey:"} ${j.name}`,
              isOwn: false
            });
            seenIds.add(ind.id);
          }
        });
      });
      return results;
    }

    // Para L2, L3 e L4:
    // 1. Indicadores próprios deste agrupamento (se existirem)
    const scopeIdentifier = scopeType === 'l2' ? activeL2?.name : scopeType === 'l3' ? activeL3?.name : activeL4?.name;
    const scopeId = scopeType === 'l2' ? activeL2?.id : scopeType === 'l3' ? activeL3?.id : activeL4?.id;

    if (scopeIdentifier) {
      businessIndicators.forEach(ind => {
        if (ind.l2Id === scopeId || (ind.scope && ind.scope.toLowerCase().includes(scopeIdentifier.toLowerCase()))) {
          results.push({
            indicator: ind,
            originBadge: 'proprio',
            scopeLabel: `${scopeIdentifier} — ${scopeType.toUpperCase()}`,
            isOwn: true
          });
          seenIds.add(ind.id);
        }
      });
    }

    // 2. Indicadores consolidados a partir dos processos filhos
    const indContributionMap = new Map<string, { ind: BusinessIndicator; procNames: string[] }>();
    activeProcesses.forEach(proc => {
      proc.businessIndicators.forEach(ind => {
        if (!indContributionMap.has(ind.id)) {
          indContributionMap.set(ind.id, { ind, procNames: [proc.name] });
        } else {
          indContributionMap.get(ind.id)!.procNames.push(proc.name);
        }
      });
    });

    indContributionMap.forEach(({ ind, procNames }) => {
      if (!seenIds.has(ind.id)) {
        const procCount = procNames.length;
        results.push({
          indicator: ind,
          originBadge: 'consolidado',
          consolidatedInfo: `${pt ? "Consolidado de" : "Consolidated from"} ${procCount} ${procCount === 1 ? (pt ? "processo" : "process") : (pt ? "processos" : "processes")}`,
          scopeLabel: `${scopeIdentifier || ''} — ${scopeType.toUpperCase()}`,
          isOwn: false
        });
        seenIds.add(ind.id);
      }
    });

    return results;
  }, [scopeType, activeProcess, activeScopeJourneys, businessIndicators, domainName, allDomainProcesses.length, activeL2, activeL3, activeL4, activeProcesses, pt]);

  // Indicadores de jornadas resumidos para o domínio
  const domainJourneyIndicators = useMemo(() => {
    const list: DisplayIndicator[] = [];
    const seen = new Set<string>();
    journeys.forEach(j => {
      j.businessIndicators.forEach(ind => {
        if (!seen.has(ind.id)) {
          list.push({
            indicator: ind,
            originBadge: 'jornada',
            scopeLabel: `${pt ? "Jornada:" : "Journey:"} ${j.name}`,
            isOwn: false
          });
          seen.add(ind.id);
        }
      });
    });
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      return list.filter(i => 
        i.indicator.name.toLowerCase().includes(q) ||
        i.indicator.objective?.toLowerCase().includes(q)
      );
    }
    return list;
  }, [journeys, pt, searchTerm]);

  // ── 6. APLICAÇÃO DO FILTRO POR NATUREZA E BUSCA ──────────────
  const filteredBusinessIndicators = useMemo(() => {
    let list = scopeBusinessIndicators;
    if (natureFilter === 'context') return [];
    if (natureFilter === 'proprio') list = list.filter(i => i.originBadge === 'proprio' || i.originBadge === 'operacional');
    else if (natureFilter === 'consolidado') list = list.filter(i => i.originBadge === 'consolidado');
    else if (natureFilter === 'jornada') list = list.filter(i => i.originBadge === 'jornada');

    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      list = list.filter(i => 
        i.indicator.name.toLowerCase().includes(q) || 
        i.indicator.objective?.toLowerCase().includes(q) ||
        i.indicator.category?.toLowerCase().includes(q)
      );
    }
    return list;
  }, [natureFilter, scopeBusinessIndicators, searchTerm]);

  // Visibilidade das seções
  const showContextSection = natureFilter === 'all' || natureFilter === 'context';
  const showBusinessSection = natureFilter !== 'context' && natureFilter !== 'jornada';
  const showJourneysSection = (natureFilter === 'all' && scopeType === 'all') || natureFilter === 'jornada' || scopeType === 'journeys';

  // Contagem total de indicadores no escopo ativo
  const totalCountInScope = useMemo(() => {
    let count = 0;
    if (showContextSection) count += 2; // Contexto: Cobertura + Validação
    if (showBusinessSection) count += filteredBusinessIndicators.length;
    if (showJourneysSection && scopeType === 'all') count += domainJourneyIndicators.length;
    return count;
  }, [showContextSection, showBusinessSection, showJourneysSection, filteredBusinessIndicators.length, domainJourneyIndicators.length, scopeType]);

  // Rótulo do escopo atual para o cabeçalho
  const scopeHeaderTitle = useMemo(() => {
    switch (scopeType) {
      case 'all': return pt ? "Indicadores do Domínio" : "Domain Indicators";
      case 'l2': return pt ? "Indicadores do Agrupamento L2" : "L2 Branch Indicators";
      case 'l3': return pt ? "Indicadores do Subprocesso L3" : "L3 Subprocess Indicators";
      case 'l4': return pt ? "Indicadores da Atividade L4" : "L4 Activity Indicators";
      case 'process': return pt ? "Indicadores Operacionais do Processo" : "Process Operational KPIs";
      case 'journeys': return pt ? "Indicadores de Jornadas de Valor" : "Value Journey Indicators";
      default: return pt ? "Indicadores de Arquitetura" : "Architecture Indicators";
    }
  }, [scopeType, pt]);

  const scopeHeaderSubtitle = useMemo(() => {
    switch (scopeType) {
      case 'all': return `${domainName} — L1`;
      case 'l2': return activeL2 ? `${activeL2.name} — L2` : `L2 (${l2List.length} ${pt ? "agrupamentos" : "groups"})`;
      case 'l3': return activeL3 ? `${activeL3.name} — L3` : "L3";
      case 'l4': return activeL4 ? `${activeL4.name} — L4` : "L4";
      case 'process': return activeProcess ? `${activeProcess.name} — ${pt ? "Processo Operacional" : "Operational Process"}` : pt ? "Processo" : "Process";
      case 'journeys': return activeJourney ? `${activeJourney.name}` : pt ? "Todas as Jornadas Vinculadas" : "All Linked Journeys";
      default: return domainName;
    }
  }, [scopeType, domainName, activeL2, activeL3, activeL4, activeProcess, activeJourney, l2List.length, pt]);

  return (
    <div className="space-y-6">
      
      {/* ══════════════════════════════════════════════════════════
          1. BARRA SUPERIOR DE ESCOPO E TRILHA DE NAVEGAÇÃO
          ══════════════════════════════════════════════════════════ */}
      <div className="bg-white border border-[#A5A7B0]/20 rounded-md p-5 shadow-xs space-y-4">
        
        {/* Cabeçalho de Escopo e Ação */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-3 border-b border-gray-100">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-sm bg-[#0C1BA8]/10 text-[#0C1BA8] uppercase tracking-wider">
                {pt ? "Escopo Ativo" : "Active Scope"}
              </span>
              <h3 className="text-base font-bold text-[#272727]">
                {scopeHeaderTitle}
              </h3>
            </div>
            <p className="text-xs font-semibold text-[#0C1BA8] mt-0.5">
              {scopeHeaderSubtitle}
            </p>
            <span className="text-[11px] text-[#6B7280]">
              {totalCountInScope} {pt ? "indicadores visíveis neste escopo" : "indicators visible in this scope"}
            </span>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {scopeType !== 'all' && (
              <Button
                variant="outline"
                size="sm"
                onClick={resetToL1}
                className="h-8 text-xs text-[#0C1BA8] border-[#0C1BA8]/30 hover:bg-[#0C1BA8]/5 font-semibold"
              >
                <RotateCcw className="h-3.5 w-3.5 mr-1.5" />
                {pt ? "Voltar ao Domínio (L1)" : "Back to Domain (L1)"}
              </Button>
            )}

            <Button
              onClick={onAddIndicator}
              className="bg-[#0C1BA8] hover:bg-[#04223D] text-white text-xs h-8 px-3 shadow-xs font-semibold"
            >
              <Plus className="h-3.5 w-3.5 mr-1.5" />
              {pt ? "Adicionar indicador de negócio" : "Add business indicator"}
            </Button>
          </div>
        </div>

        {/* TRILHA HIERÁRQUICA (BREADCRUMB CLICÁVEL) */}
        <div className="flex items-center gap-1.5 text-xs text-[#6B7280] overflow-x-auto py-1 scrollbar-thin">
          <span className="font-semibold text-[#272727] text-[11px] uppercase tracking-wider shrink-0 mr-1">
            {pt ? "Hierarquia:" : "Path:"}
          </span>

          {/* L1 Breadcrumb */}
          <button
            onClick={resetToL1}
            className={cn(
              "px-2 py-1 rounded transition-colors shrink-0 font-semibold flex items-center gap-1",
              scopeType === 'all' 
                ? "bg-[#0C1BA8]/10 text-[#0C1BA8] font-bold" 
                : "hover:bg-gray-100 text-[#272727] hover:text-[#0C1BA8]"
            )}
          >
            <span>{domainName}</span>
            <span className="text-[9px] px-1 rounded bg-white/80 border border-gray-200 text-gray-600">L1</span>
          </button>

          {/* L2 Breadcrumb */}
          {(scopeType === 'l2' || scopeType === 'l3' || scopeType === 'l4' || scopeType === 'process') && activeL2 && (
            <>
              <ChevronRight className="h-3.5 w-3.5 text-[#A5A7B0] shrink-0" />
              <button
                onClick={() => handleSelectL2(activeL2.id)}
                className={cn(
                  "px-2 py-1 rounded transition-colors shrink-0 font-semibold flex items-center gap-1",
                  scopeType === 'l2' 
                    ? "bg-[#0C1BA8]/10 text-[#0C1BA8] font-bold" 
                    : "hover:bg-gray-100 text-[#272727] hover:text-[#0C1BA8]"
                )}
              >
                <span>{activeL2.name}</span>
                <span className="text-[9px] px-1 rounded bg-white/80 border border-gray-200 text-gray-600">L2</span>
              </button>
            </>
          )}

          {/* L3 Breadcrumb */}
          {(scopeType === 'l3' || scopeType === 'l4' || scopeType === 'process') && activeL3 && (
            <>
              <ChevronRight className="h-3.5 w-3.5 text-[#A5A7B0] shrink-0" />
              <button
                onClick={() => handleSelectL3(activeL3.id)}
                className={cn(
                  "px-2 py-1 rounded transition-colors shrink-0 font-semibold flex items-center gap-1",
                  scopeType === 'l3' 
                    ? "bg-[#0C1BA8]/10 text-[#0C1BA8] font-bold" 
                    : "hover:bg-gray-100 text-[#272727] hover:text-[#0C1BA8]"
                )}
              >
                <span>{activeL3.name}</span>
                <span className="text-[9px] px-1 rounded bg-white/80 border border-gray-200 text-gray-600">L3</span>
              </button>
            </>
          )}

          {/* L4 Breadcrumb */}
          {(scopeType === 'l4' || scopeType === 'process') && activeL4 && (
            <>
              <ChevronRight className="h-3.5 w-3.5 text-[#A5A7B0] shrink-0" />
              <button
                onClick={() => handleSelectL4(activeL4.id)}
                className={cn(
                  "px-2 py-1 rounded transition-colors shrink-0 font-semibold flex items-center gap-1",
                  scopeType === 'l4' 
                    ? "bg-[#0C1BA8]/10 text-[#0C1BA8] font-bold" 
                    : "hover:bg-gray-100 text-[#272727] hover:text-[#0C1BA8]"
                )}
              >
                <span>{activeL4.name}</span>
                <span className="text-[9px] px-1 rounded bg-white/80 border border-gray-200 text-gray-600">L4</span>
              </button>
            </>
          )}

          {/* Process Breadcrumb */}
          {scopeType === 'process' && activeProcess && (
            <>
              <ChevronRight className="h-3.5 w-3.5 text-[#A5A7B0] shrink-0" />
              <span className="px-2 py-1 rounded bg-[#0C1BA8]/10 text-[#0C1BA8] font-bold shrink-0 flex items-center gap-1">
                <span>{activeProcess.name}</span>
                <span className="text-[9px] px-1 rounded bg-white/80 border border-gray-200 text-gray-600">{pt ? "Processo" : "Proc"}</span>
              </span>
            </>
          )}

          {/* Journeys Breadcrumb */}
          {scopeType === 'journeys' && (
            <>
              <ChevronRight className="h-3.5 w-3.5 text-[#A5A7B0] shrink-0" />
              <span className="px-2 py-1 rounded bg-amber-100/70 text-amber-900 font-bold shrink-0">
                {activeJourney ? activeJourney.name : (pt ? "Todas as Jornadas de Valor" : "All Value Journeys")}
              </span>
            </>
          )}
        </div>

        {/* ══════════════════════════════════════════════════════
            CONTROLES DE FILTRO DE ESCOPO E TIPO DE INDICADOR
            ══════════════════════════════════════════════════════ */}
        <div className="pt-2 border-t border-gray-100 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          
          {/* Seletor de Nível Arquitetural */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-semibold text-[#6B7280] uppercase tracking-wider">
              {pt ? "Visualizar indicadores de:" : "View indicators of:"}
            </span>
            
            <div className="inline-flex rounded-md shadow-2xs bg-gray-100/80 p-0.5 border border-gray-200">
              <button
                type="button"
                onClick={() => handleSelectScopeType('all')}
                className={cn(
                  "px-2.5 py-1 text-xs font-semibold rounded-sm transition-all",
                  scopeType === 'all' 
                    ? "bg-white text-[#0C1BA8] shadow-xs" 
                    : "text-gray-600 hover:text-gray-900"
                )}
              >
                {pt ? "Domínio inteiro — L1" : "Full Domain — L1"}
              </button>
              <button
                type="button"
                onClick={() => handleSelectScopeType('l2')}
                className={cn(
                  "px-2.5 py-1 text-xs font-semibold rounded-sm transition-all",
                  scopeType === 'l2' 
                    ? "bg-white text-[#0C1BA8] shadow-xs" 
                    : "text-gray-600 hover:text-gray-900"
                )}
              >
                L2
              </button>
              <button
                type="button"
                onClick={() => handleSelectScopeType('l3')}
                className={cn(
                  "px-2.5 py-1 text-xs font-semibold rounded-sm transition-all",
                  scopeType === 'l3' 
                    ? "bg-white text-[#0C1BA8] shadow-xs" 
                    : "text-gray-600 hover:text-gray-900"
                )}
              >
                L3
              </button>
              <button
                type="button"
                onClick={() => handleSelectScopeType('l4')}
                className={cn(
                  "px-2.5 py-1 text-xs font-semibold rounded-sm transition-all",
                  scopeType === 'l4' 
                    ? "bg-white text-[#0C1BA8] shadow-xs" 
                    : "text-gray-600 hover:text-gray-900"
                )}
              >
                L4
              </button>
              <button
                type="button"
                onClick={() => handleSelectScopeType('process')}
                className={cn(
                  "px-2.5 py-1 text-xs font-semibold rounded-sm transition-all",
                  scopeType === 'process' 
                    ? "bg-white text-[#0C1BA8] shadow-xs" 
                    : "text-gray-600 hover:text-gray-900"
                )}
              >
                {pt ? "Processo" : "Process"}
              </button>
              <button
                type="button"
                onClick={() => handleSelectScopeType('journeys')}
                className={cn(
                  "px-2.5 py-1 text-xs font-semibold rounded-sm transition-all",
                  scopeType === 'journeys' 
                    ? "bg-white text-purple-700 shadow-xs" 
                    : "text-gray-600 hover:text-gray-900"
                )}
              >
                {pt ? "Jornadas" : "Journeys"}
              </button>
            </div>
          </div>

          {/* Busca e Filtro por Natureza do Indicador */}
          <div className="flex items-center gap-2.5 flex-wrap">
            <div className="relative min-w-[220px] max-w-xs">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <Input
                type="text"
                placeholder={pt ? "Buscar indicador por nome..." : "Search indicator by name..."}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="h-8 pl-8 text-xs bg-white border-[#A5A7B0]/30"
              />
            </div>

            <div className="flex items-center gap-1.5">
              <span className="text-xs font-semibold text-[#6B7280] flex items-center gap-1">
                <Filter className="h-3.5 w-3.5 text-[#0C1BA8]" />
                {pt ? "Tipo:" : "Type:"}
              </span>

              <select
                value={natureFilter}
                onChange={(e) => setNatureFilter(e.target.value as IndicatorNatureFilter)}
                className="text-xs font-semibold bg-white border border-[#A5A7B0]/30 rounded px-2.5 py-1 text-[#272727] focus:outline-none focus:ring-1 focus:ring-[#0C1BA8] h-8"
              >
                <option value="all">{pt ? "Todos os tipos" : "All types"}</option>
                <option value="business">{pt ? "Indicadores de negócio" : "Business KPIs"}</option>
                <option value="context">{pt ? "Indicadores de contexto" : "Context indicators"}</option>
                <option value="proprio">{pt ? "Indicadores próprios" : "Own indicators"}</option>
                <option value="consolidado">{pt ? "Indicadores consolidados" : "Consolidated indicators"}</option>
                <option value="jornada">{pt ? "Indicadores de jornadas" : "Journey indicators"}</option>
              </select>
            </div>
          </div>
        </div>

        {/* SELETORES HIERÁRQUICOS DINÂMICOS (SEGUNDA LINHA QUANDO NÃO ESTÁ EM L1) */}
        {scopeType !== 'all' && (
          <div className="bg-gray-50 border border-gray-200/70 rounded-md p-3 flex flex-wrap items-center gap-3 text-xs">
            
            {/* Seletor de L2 */}
            {(scopeType === 'l2' || scopeType === 'l3' || scopeType === 'l4' || scopeType === 'process') && (
              <div className="flex items-center gap-1.5">
                <span className="font-semibold text-gray-700">L2:</span>
                <select
                  value={selectedL2Id}
                  onChange={(e) => handleSelectL2(e.target.value)}
                  className="bg-white border border-gray-300 rounded px-2 py-1 text-xs font-medium text-gray-800"
                >
                  {l2List.map(l2 => (
                    <option key={l2.id} value={l2.id}>{l2.name}</option>
                  ))}
                </select>
              </div>
            )}

            {/* Seletor de L3 */}
            {(scopeType === 'l3' || scopeType === 'l4' || scopeType === 'process') && availableL3List.length > 0 && (
              <div className="flex items-center gap-1.5">
                <span className="font-semibold text-gray-700">L3:</span>
                <select
                  value={selectedL3Id}
                  onChange={(e) => handleSelectL3(e.target.value)}
                  className="bg-white border border-gray-300 rounded px-2 py-1 text-xs font-medium text-gray-800 max-w-[200px]"
                >
                  {availableL3List.map(l3 => (
                    <option key={l3.id} value={l3.id}>{l3.name}</option>
                  ))}
                </select>
              </div>
            )}

            {/* Seletor de L4 */}
            {(scopeType === 'l4' || scopeType === 'process') && availableL4List.length > 0 && (
              <div className="flex items-center gap-1.5">
                <span className="font-semibold text-gray-700">L4:</span>
                <select
                  value={selectedL4Id}
                  onChange={(e) => handleSelectL4(e.target.value)}
                  className="bg-white border border-gray-300 rounded px-2 py-1 text-xs font-medium text-gray-800 max-w-[200px]"
                >
                  {availableL4List.map(l4 => (
                    <option key={l4.id} value={l4.id}>{l4.name}</option>
                  ))}
                </select>
              </div>
            )}

            {/* Seletor de Processo */}
            {scopeType === 'process' && allDomainProcesses.length > 0 && (
              <div className="flex items-center gap-1.5">
                <span className="font-semibold text-gray-700">{pt ? "Processo:" : "Process:"}</span>
                <select
                  value={selectedProcessId}
                  onChange={(e) => handleSelectProcess(e.target.value)}
                  className="bg-white border border-gray-300 rounded px-2 py-1 text-xs font-medium text-gray-800 max-w-[260px]"
                >
                  {allDomainProcesses.map(proc => (
                    <option key={proc.id} value={proc.id}>{proc.name}</option>
                  ))}
                </select>
              </div>
            )}

            {/* Seletor de Jornadas */}
            {scopeType === 'journeys' && (
              <div className="flex items-center gap-1.5">
                <span className="font-semibold text-gray-700">{pt ? "Jornada:" : "Journey:"}</span>
                <select
                  value={selectedJourneyId}
                  onChange={(e) => setSelectedJourneyId(e.target.value)}
                  className="bg-white border border-gray-300 rounded px-2 py-1 text-xs font-medium text-gray-800"
                >
                  <option value="all">{pt ? "Todas as Jornadas do Domínio" : "All Domain Journeys"}</option>
                  {journeys.map(j => (
                    <option key={j.id} value={j.id}>{j.name}</option>
                  ))}
                </select>
              </div>
            )}

          </div>
        )}

      </div>

      {/* ══════════════════════════════════════════════════════════
          2. SEÇÃO DE INDICADORES DE CONTEXTO E COBERTURA
          ══════════════════════════════════════════════════════════ */}
      {showContextSection && (
        <div className="bg-white border border-[#A5A7B0]/20 rounded-md p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-gray-100">
            <div className="flex items-center gap-2">
              <FileCheck className="h-5 w-5 text-gray-700" />
              <div>
                <h4 className="font-bold text-[#272727] text-sm">
                  {pt ? "Indicadores de Contexto" : "Context Indicators"}
                </h4>
                <p className="text-[11px] text-[#6B7280]">
                  {scopeType === 'process' && activeProcess
                    ? (pt ? `Governança e maturidade do conhecimento para o processo: ${activeProcess.name}` : `Governance & knowledge maturity for process: ${activeProcess.name}`)
                    : (pt ? `Completude, governança e conformidade recalculadas para o escopo selecionado (${contextMetrics.total} processos)` : `Completeness, governance & compliance recalculated for this scope (${contextMetrics.total} processes)`)}
                </p>
              </div>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider bg-blue-50 text-blue-700 border border-blue-200">
              {pt ? "Contexto & Governança" : "Context & Governance"}
            </span>
          </div>

          {/* Visão de Contexto: Nível Agrupado (L1, L2, L3, L4 ou Jornadas) */}
          {scopeType !== 'process' ? (
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3 text-xs">
              
              <div className="p-3 bg-gray-50 border border-gray-100 rounded-sm">
                <span className="text-[10px] font-semibold text-[#6B7280] uppercase block">
                  {pt ? "Cobertura Doc." : "Doc Coverage"}
                </span>
                <span className="text-xl font-bold text-[#272727] mt-1 block">
                  {contextMetrics.docPercent}%
                </span>
                <span className="text-[10px] text-[#A5A7B0]">
                  {contextMetrics.docsApproved} {pt ? "de" : "of"} {contextMetrics.total} {pt ? "aprovados" : "approved"}
                </span>
              </div>

              <div className="p-3 bg-gray-50 border border-gray-100 rounded-sm">
                <span className="text-[10px] font-semibold text-[#6B7280] uppercase block">
                  {pt ? "Contexto Validado" : "Validated Context"}
                </span>
                <span className="text-xl font-bold text-emerald-700 mt-1 block">
                  {contextMetrics.contextPercent}%
                </span>
                <span className="text-[10px] text-[#A5A7B0]">
                  {contextMetrics.contextValidated} {pt ? "de" : "of"} {contextMetrics.total} {pt ? "validados" : "validated"}
                </span>
              </div>

              <div className="p-3 bg-gray-50 border border-gray-100 rounded-sm">
                <span className="text-[10px] font-semibold text-[#6B7280] uppercase block">
                  {pt ? "Evidências" : "Evidences"}
                </span>
                <span className="text-xl font-bold text-blue-700 mt-1 block">
                  {contextMetrics.evidencesCount}
                </span>
                <span className="text-[10px] text-[#A5A7B0]">
                  {pt ? "Confirmadas" : "Confirmed"}
                </span>
              </div>

              <div className="p-3 bg-gray-50 border border-gray-100 rounded-sm">
                <span className="text-[10px] font-semibold text-[#6B7280] uppercase block">
                  {pt ? "Dúvidas Abertas" : "Open Questions"}
                </span>
                <span className={cn("text-xl font-bold mt-1 block", contextMetrics.openQuestionsCount > 0 ? "text-amber-600" : "text-gray-700")}>
                  {contextMetrics.openQuestionsCount}
                </span>
                <span className="text-[10px] text-[#A5A7B0]">
                  {pt ? "Pendentes" : "Pending"}
                </span>
              </div>

              <div className="p-3 bg-gray-50 border border-gray-100 rounded-sm">
                <span className="text-[10px] font-semibold text-[#6B7280] uppercase block">
                  {pt ? "Sem Responsável" : "Without Owner"}
                </span>
                <span className={cn("text-xl font-bold mt-1 block", contextMetrics.processesWithoutOwner > 0 ? "text-amber-600" : "text-emerald-700")}>
                  {contextMetrics.processesWithoutOwner}
                </span>
                <span className="text-[10px] text-[#A5A7B0]">
                  {pt ? "Processos" : "Processes"}
                </span>
              </div>

              <div className="p-3 bg-gray-50 border border-gray-100 rounded-sm">
                <span className="text-[10px] font-semibold text-[#6B7280] uppercase block">
                  {pt ? "Sem Normativos" : "Without Regs"}
                </span>
                <span className="text-xl font-bold text-gray-700 mt-1 block">
                  {contextMetrics.processesWithoutRegulations}
                </span>
                <span className="text-[10px] text-[#A5A7B0]">
                  {pt ? "Processos" : "Processes"}
                </span>
              </div>

              <div className="p-3 bg-gray-50 border border-gray-100 rounded-sm">
                <span className="text-[10px] font-semibold text-[#6B7280] uppercase block">
                  {pt ? "Relações Inválidas" : "Invalid Rel."}
                </span>
                <span className="text-xl font-bold text-gray-700 mt-1 block">
                  0
                </span>
                <span className="text-[10px] text-[#A5A7B0]">
                  {pt ? "Inconsistências" : "Issues"}
                </span>
              </div>

            </div>
          ) : (
            /* Visão de Contexto Específica para PROCESSO SELECIONADO */
            activeProcess && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                
                {/* Coluna 1: Status de Documentação & Validação */}
                <div className="p-3.5 bg-gray-50 border border-gray-200/80 rounded space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-[#6B7280]">{pt ? "Status Documental:" : "Documentation:"}</span>
                    <span className={cn(
                      "text-[10px] font-bold px-2 py-0.5 rounded uppercase",
                      activeProcess.documentationStatus === 'approved' ? "bg-emerald-100 text-emerald-800" :
                      activeProcess.documentationStatus === 'in_progress' ? "bg-amber-100 text-amber-800" :
                      "bg-gray-200 text-gray-800"
                    )}>
                      {activeProcess.documentationStatus === 'approved' ? (pt ? "Aprovado" : "Approved") :
                       activeProcess.documentationStatus === 'in_progress' ? (pt ? "Em Elaboração" : "In Progress") :
                       (pt ? "Pendente" : "Pending")}
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-[#6B7280]">{pt ? "Validação de Contexto:" : "Context Validation:"}</span>
                    <span className={cn(
                      "text-[10px] font-bold px-2 py-0.5 rounded uppercase",
                      activeProcess.contextValidationStatus === 'validated' ? "bg-emerald-100 text-emerald-800" :
                      activeProcess.contextValidationStatus === 'validating' ? "bg-blue-100 text-blue-800" :
                      "bg-amber-100 text-amber-800"
                    )}>
                      {activeProcess.contextValidationStatus === 'validated' ? (pt ? "Validado" : "Validated") :
                       activeProcess.contextValidationStatus === 'validating' ? (pt ? "Em Validação" : "Validating") :
                       (pt ? "Não Validado" : "Unvalidated")}
                    </span>
                  </div>

                  <div className="flex justify-between items-center pt-2 border-t border-gray-200/60">
                    <span className="text-[#6B7280]">{pt ? "Responsável:" : "Owner:"}</span>
                    <strong className="text-[#272727] truncate max-w-[140px]" title={activeProcess.responsible || '-'}>
                      {activeProcess.responsible || (pt ? "Não atribuído" : "Unassigned")}
                    </strong>
                  </div>
                </div>

                {/* Coluna 2: Evidências e Dúvidas */}
                <div className="p-3.5 bg-gray-50 border border-gray-200/80 rounded space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-[#6B7280]">{pt ? "Evidências Confirmadas:" : "Confirmed Evidences:"}</span>
                    <strong className="text-sm font-bold text-blue-700">{activeProcess.evidences?.length || 0}</strong>
                  </div>
                  {activeProcess.evidences && activeProcess.evidences.length > 0 && (
                    <p className="text-[11px] text-gray-600 line-clamp-1 italic" title={activeProcess.evidences[0].value}>
                      "{activeProcess.evidences[0].value}"
                    </p>
                  )}

                  <div className="flex justify-between items-center pt-2 border-t border-gray-200/60">
                    <span className="text-[#6B7280]">{pt ? "Dúvidas em Aberto:" : "Open Questions:"}</span>
                    <strong className={cn("text-sm font-bold", (activeProcess.openQuestions?.length || 0) > 0 ? "text-amber-600" : "text-emerald-700")}>
                      {activeProcess.openQuestions?.length || 0}
                    </strong>
                  </div>
                  {activeProcess.openQuestions && activeProcess.openQuestions.length > 0 && (
                    <p className="text-[11px] text-amber-800 line-clamp-1 italic" title={activeProcess.openQuestions[0].value}>
                      "{activeProcess.openQuestions[0].value}"
                    </p>
                  )}
                </div>

                {/* Coluna 3: Sistemas e Relação com Normativos */}
                <div className="p-3.5 bg-gray-50 border border-gray-200/80 rounded space-y-2">
                  <div>
                    <span className="text-[10px] font-bold text-[#A5A7B0] uppercase block">
                      {pt ? "Sistemas Utilizados" : "Systems Used"}
                    </span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {activeProcess.systemsUsed && activeProcess.systemsUsed.length > 0 ? (
                        activeProcess.systemsUsed.map(s => (
                          <span key={s.systemName} className="text-[10px] px-1.5 py-0.5 rounded bg-white border border-gray-200 text-gray-700">
                            {s.systemName}
                          </span>
                        ))
                      ) : (
                        <span className="text-[11px] text-gray-500 italic">{pt ? "Nenhum sistema mapeado" : "No systems mapped"}</span>
                      )}
                    </div>
                  </div>

                  <div className="pt-2 border-t border-gray-200/60">
                    <span className="text-[10px] font-bold text-[#A5A7B0] uppercase block">
                      {pt ? "Normativos e Políticas" : "Regulations & Policies"}
                    </span>
                    <span className="text-xs text-[#272727] font-medium">
                      {activeProcess.regulations && activeProcess.regulations.length > 0
                        ? `${activeProcess.regulations.length} ${pt ? "políticas vinculadas" : "policies linked"}`
                        : (pt ? "Sem normativos vinculados" : "No regulations linked")}
                    </span>
                  </div>
                </div>

              </div>
            )
          )}
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════
          3. SEÇÃO DE INDICADORES DE DESEMPENHO DO NEGÓCIO
          ══════════════════════════════════════════════════════════ */}
      {showBusinessSection && (
        <div className="bg-white border border-[#A5A7B0]/20 rounded-md p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-gray-100">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-[#0C1BA8]" />
              <div>
                <h4 className="font-bold text-[#272727] text-sm">
                  {pt ? "Indicadores de Desempenho do Negócio" : "Business Performance Indicators"}
                </h4>
                <p className="text-[11px] text-[#6B7280]">
                  {pt ? "Métricas de resultado, eficiência e SLA com separação inequívoca entre indicadores próprios e consolidados." : "Outcome, efficiency and SLA metrics with strict separation between own and consolidated KPIs."}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-[#0C1BA8]">
                {filteredBusinessIndicators.length} {pt ? "indicadores" : "KPIs"}
              </span>
            </div>
          </div>

          {/* Grid de Cards de Negócio */}
          {filteredBusinessIndicators.length === 0 ? (
            <div className="p-8 text-center bg-gray-50 rounded-md border border-dashed border-gray-200 text-xs text-[#6B7280] space-y-2">
              <Info className="h-8 w-8 text-[#A5A7B0] mx-auto opacity-70" />
              <p className="font-bold text-[#272727] text-sm">
                {natureFilter === 'proprio' 
                  ? (pt ? "Este nível ainda não possui indicadores próprios cadastrados." : "This level does not have own indicators registered yet.")
                  : scopeType === 'process'
                  ? (pt ? "Não há indicadores de negócio cadastrados para este processo." : "No business KPIs registered for this process.")
                  : (pt ? "Nenhum indicador de negócio encontrado para o filtro e escopo selecionados." : "No business indicators found for selected filter and scope.")}
              </p>
              <p className="max-w-md mx-auto text-gray-500">
                {natureFilter === 'proprio' && (scopeType === 'l2' || scopeType === 'l3' || scopeType === 'l4')
                  ? (pt ? "Você pode consultar os indicadores consolidados dos processos abaixo alterando o filtro de tipo para 'Indicadores consolidados' ou 'Todos'." : "You can check the consolidated KPIs from underlying processes by changing the filter to 'Consolidated' or 'All'.")
                  : (pt ? "Você pode cadastrar um novo indicador de negócio para este nível clicando no botão abaixo." : "You can register a new KPI for this level by clicking below.")}
              </p>
              <Button
                onClick={onAddIndicator}
                variant="outline"
                className="mt-2 text-xs text-[#0C1BA8] border-[#0C1BA8]/30 hover:bg-[#0C1BA8]/5 font-semibold"
              >
                <Plus className="h-3.5 w-3.5 mr-1" />
                {pt ? "Adicionar indicador de negócio agora" : "Add business indicator now"}
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredBusinessIndicators.map(({ indicator, originBadge, consolidatedInfo, scopeLabel }) => (
                <div key={indicator.id} className="min-h-[245px]">
                  <IndicatorCard
                    indicator={indicator}
                    aggregationRule={indicator.aggregationRule}
                    originBadge={originBadge}
                    consolidatedInfo={consolidatedInfo}
                    scopeLabel={scopeLabel}
                    onEdit={() => onEditIndicator(indicator)}
                    onDelete={() => onDeleteIndicator(indicator.id)}
                    onViewHistory={() => {
                      setSelectedIndicatorForHistory(indicator);
                      setHistoryModalOpen(true);
                    }}
                    onLogMeasurement={() => {
                      setSelectedIndicatorForLog(indicator);
                      setLogModalOpen(true);
                    }}
                  />
                </div>
              ))}
            </div>
          )}

        </div>
      )}

      {/* ══════════════════════════════════════════════════════════
          4. SEÇÃO DE INDICADORES DE JORNADAS DE VALOR
          ══════════════════════════════════════════════════════════ */}
      {showJourneysSection && (
        <div className="bg-white border border-[#A5A7B0]/20 rounded-md p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-gray-100">
            <div className="flex items-center gap-2">
              <Route className="h-5 w-5 text-purple-600" />
              <div>
                <h4 className="font-bold text-[#272727] text-sm">
                  {pt ? "Indicadores Vinculados a Jornadas de Valor" : "Value Journey Linked Indicators"}
                </h4>
                <p className="text-[11px] text-[#6B7280]">
                  {pt ? "Indicadores de desempenho atrelados aos fluxos de ponta a ponta que cruzam este domínio." : "Performance KPIs linked to end-to-end flows crossing this domain."}
                </p>
              </div>
            </div>

            <span className="text-xs font-semibold text-purple-700">
              {domainJourneyIndicators.length} {pt ? "indicadores de jornada" : "journey KPIs"}
            </span>
          </div>

          {domainJourneyIndicators.length === 0 ? (
            <div className="p-6 text-center bg-gray-50 border border-gray-100 rounded text-xs text-[#6B7280]">
              {pt ? "Nenhum indicador cadastrado nas jornadas vinculadas." : "No KPIs registered in linked journeys."}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {domainJourneyIndicators.map(({ indicator, scopeLabel }) => (
                <div key={indicator.id} className="min-h-[245px]">
                  <IndicatorCard
                    indicator={indicator}
                    aggregationRule={indicator.aggregationRule}
                    originBadge="jornada"
                    scopeLabel={scopeLabel}
                    onEdit={() => onEditIndicator(indicator)}
                    onDelete={() => onDeleteIndicator(indicator.id)}
                    onViewHistory={() => {
                      setSelectedIndicatorForHistory(indicator);
                      setHistoryModalOpen(true);
                    }}
                    onLogMeasurement={() => {
                      setSelectedIndicatorForLog(indicator);
                      setLogModalOpen(true);
                    }}
                  />
                </div>
              ))}
            </div>
          )}

          {/* Relação limpa das jornadas que utilizam este processo ou escopo (sem métricas de representatividade) */}
          <div className="pt-3 border-t border-gray-100">
            <h5 className="text-xs font-bold text-[#272727] mb-2">
              {scopeType === 'process' && activeProcess
                ? (pt ? `Jornadas que utilizam o processo "${activeProcess.name}":` : `Journeys utilizing process "${activeProcess.name}":`)
                : (pt ? "Jornadas que cruzam este escopo:" : "Journeys crossing this scope:")}
            </h5>

            {activeScopeJourneys.length === 0 ? (
              <p className="text-xs text-gray-500 italic">
                {pt ? "Nenhuma jornada mapeada cruza este nível no momento." : "No journeys crossing this level currently."}
              </p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {activeScopeJourneys.map(j => (
                  <div 
                    key={j.id} 
                    className="p-2 bg-gray-50 border border-gray-200 rounded text-xs flex items-center justify-between gap-3 hover:border-[#0C1BA8] transition-colors"
                  >
                    <div>
                      <strong className="text-[#272727] block">{j.name}</strong>
                      <span className="text-[10px] text-[#6B7280]">{j.objective}</span>
                    </div>
                    <span className="text-[9px] font-bold px-2 py-0.5 rounded bg-purple-100 text-purple-800 uppercase shrink-0">
                      {pt ? "Jornada" : "Journey"}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

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

    </div>
  );
}
