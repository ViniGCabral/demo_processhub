import React, { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/contexts/LanguageContext";
import { ProcessData, useProcessStore } from "@/stores/processStore";
import {
  StudioJourneyMetadata,
  StudioFlowStep,
  StudioMode,
} from "./types";
import {
  useProcessConnectionStore,
  RELATIONSHIP_LABELS,
} from "@/stores/processConnectionStore";
import {
  ProcessConnectionMapModal,
} from "@/components/process/connections/ProcessConnectionMapModal";
import {
  Search,
  Plus,
  ArrowDown,
  ArrowUp,
  Trash2,
  GitFork,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  ExternalLink,
  ChevronRight,
  Database,
  User,
  Building2,
  Layers,
  ArrowLeft,
  Clock,
  Zap,
  Flag,
  FileText,
  X,
  Check,
  RotateCcw,
  CornerDownRight,
  Info,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface JourneyFlowCompositionStepProps {
  mode?: StudioMode;
  metadata?: StudioJourneyMetadata;
  steps: StudioFlowStep[];
  onStepsChange: (steps: StudioFlowStep[]) => void;
  availableProcesses?: ProcessData[];
  aiConfidence?: number;
  onBackToDefinition?: () => void;
  onSaveDraft?: () => void;
  onPublish?: () => void;
  onNavigateToProcess?: (processId: string) => void;
}

export function JourneyFlowCompositionStep({
  mode = "manual",
  metadata,
  steps,
  onStepsChange,
  availableProcesses: propProcesses,
  aiConfidence = 88,
  onBackToDefinition,
  onSaveDraft,
  onPublish,
  onNavigateToProcess,
}: JourneyFlowCompositionStepProps) {
  const { language } = useLanguage();
  const pt = language === "PT";

  const { processes: storeProcesses } = useProcessStore();
  const availableProcesses = useMemo(() => {
    if (propProcesses && propProcesses.length > 0) return propProcesses;
    return Object.values(storeProcesses);
  }, [propProcesses, storeProcesses]);

  const { getAllConnections } = useProcessConnectionStore();
  const allConnections = useMemo(() => getAllConnections(), [getAllConnections]);

  // Filtros da Biblioteca de Processos (Painel Esquerdo)
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDomain, setSelectedDomain] = useState("all");
  const [selectedLevel, setSelectedLevel] = useState("all");

  // Etapa selecionada para inspeção no Painel Direito
  const [selectedStepId, setSelectedStepId] = useState<string | null>(
    steps.length > 0 ? steps[0].id : null
  );

  // Conexões sugeridas que o usuário optou por ignorar
  const [dismissedConnectionKeys, setDismissedConnectionKeys] = useState<Set<string>>(new Set());

  // Modal de Mapa de Conexões Locais do processo
  const [connMapProcess, setConnMapProcess] = useState<{
    id: string;
    name: string;
    domain?: string;
  } | null>(null);

  // Modal de substituição de processo da etapa
  const [substitutingStepId, setSubstitutingStepId] = useState<string | null>(null);

  // Lista de domínios existentes
  const domainOptions = useMemo(() => {
    const set = new Set<string>();
    availableProcesses.forEach((p) => {
      if (p.l1) set.add(p.l1);
    });
    return Array.from(set);
  }, [availableProcesses]);

  // Processos filtrados na biblioteca
  const filteredProcesses = useMemo(() => {
    return availableProcesses.filter((p) => {
      if (selectedDomain !== "all" && p.l1 !== selectedDomain) return false;
      if (selectedLevel !== "all") {
        if (selectedLevel === "l4" && !p.l4) return false;
        if (selectedLevel === "l3" && !p.l3) return false;
      }
      if (searchTerm.trim()) {
        const q = searchTerm.toLowerCase();
        return (
          p.name.toLowerCase().includes(q) ||
          (p.l1 && p.l1.toLowerCase().includes(q)) ||
          (p.l4 && p.l4.toLowerCase().includes(q)) ||
          (p.description && p.description.toLowerCase().includes(q))
        );
      }
      return true;
    });
  }, [availableProcesses, searchTerm, selectedDomain, selectedLevel]);

  // Conjunto de IDs dos processos já adicionados ao fluxo
  const addedProcessIds = useMemo(() => {
    return new Set(steps.map((s) => s.processId).filter(Boolean));
  }, [steps]);

  // Etapa ativa selecionada para o painel de detalhes
  const activeStep = useMemo(() => {
    return steps.find((s) => s.id === selectedStepId) || null;
  }, [steps, selectedStepId]);

  // Dados completos do processo da etapa ativa
  const activeStepProcessData = useMemo(() => {
    if (!activeStep) return null;
    return (
      availableProcesses.find(
        (p) =>
          (activeStep.processId && p.id === activeStep.processId) ||
          p.name.trim().toLowerCase() === activeStep.stepName.trim().toLowerCase()
      ) || null
    );
  }, [activeStep, availableProcesses]);

  // Métricas do resumo da jornada
  const metrics = useMemo(() => {
    const totalSteps = steps.length;
    const linkedSteps = steps.filter((s) => Boolean(s.processId) && s.matchStatus !== "nao_localizado").length;
    const pendingSteps = totalSteps - linkedSteps;
    const uniqueDomains = new Set(
      steps.map((s) => s.domain).filter(Boolean)
    ).size;

    return { totalSteps, linkedSteps, pendingSteps, uniqueDomains };
  }, [steps]);

  // -------------------------------------------------------------------------
  // Manipulação do Fluxo (Adicionar, Inserir, Reordenar, Remover)
  // -------------------------------------------------------------------------
  const handleAddProcessToFlow = (process: ProcessData, insertAtIndex?: number) => {
    const newStep: StudioFlowStep = {
      id: `step-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      order: (insertAtIndex !== undefined ? insertAtIndex : steps.length) + 1,
      stepName: process.name,
      processId: process.id,
      processName: process.name,
      domain: process.l1 || "Gestão Comercial",
      level: process.l4 ? "L4" : process.l3 ? "L3" : "Processo",
      system: process.systems?.[0] || "Sistema Corporativo",
      hasDocumentation: process.hasDocumentation,
      matchStatus: "confirmado_usuario",
      matchConfidence: 100,
    };

    let updated: StudioFlowStep[] = [];
    if (insertAtIndex !== undefined) {
      updated = [
        ...steps.slice(0, insertAtIndex),
        newStep,
        ...steps.slice(insertAtIndex),
      ];
    } else {
      updated = [...steps, newStep];
    }

    // Recalcular ordens
    const reordered = updated.map((s, idx) => ({ ...s, order: idx + 1 }));
    onStepsChange(reordered);
    setSelectedStepId(newStep.id);
    toast.success(pt ? `Etapa "${process.name}" adicionada ao fluxo` : `Step added`);
  };

  const handleRemoveStep = (stepId: string) => {
    const remaining = steps
      .filter((s) => s.id !== stepId)
      .map((s, idx) => ({ ...s, order: idx + 1 }));
    onStepsChange(remaining);
    if (selectedStepId === stepId) {
      setSelectedStepId(remaining.length > 0 ? remaining[0].id : null);
    }
  };

  const handleMoveStep = (index: number, direction: "up" | "down") => {
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= steps.length) return;

    const copy = [...steps];
    const [moved] = copy.splice(index, 1);
    copy.splice(targetIndex, 0, moved);

    const reordered = copy.map((s, idx) => ({ ...s, order: idx + 1 }));
    onStepsChange(reordered);
  };

  // Ações de Etapas da IA
  const handleUpdateAIStepAction = (
    stepId: string,
    action: StudioFlowStep["userAction"],
    linkedProcess?: ProcessData
  ) => {
    const updated = steps.map((s) => {
      if (s.id !== stepId) return s;
      if (action === "confirmar" || action === "manter") {
        return {
          ...s,
          userAction: action,
          matchStatus: "confirmado_usuario" as const,
        };
      }
      if (action === "substituir" && linkedProcess) {
        return {
          ...s,
          stepName: linkedProcess.name,
          processId: linkedProcess.id,
          processName: linkedProcess.name,
          domain: linkedProcess.l1 || s.domain,
          level: linkedProcess.l4 ? "L4" : s.level,
          system: linkedProcess.systems?.[0] || s.system,
          hasDocumentation: linkedProcess.hasDocumentation,
          matchStatus: "confirmado_usuario" as const,
          userAction: "confirmar" as const,
        };
      }
      if (action === "criar_provisorio") {
        return {
          ...s,
          isProvisional: true,
          userAction: "criar_provisorio" as const,
          matchStatus: "pendente_validacao" as const,
        };
      }
      if (action === "sem_vinculo") {
        return {
          ...s,
          processId: undefined,
          processName: undefined,
          userAction: "sem_vinculo" as const,
          matchStatus: "nao_localizado" as const,
        };
      }
      return { ...s, userAction: action };
    });

    onStepsChange(updated);
    setSubstitutingStepId(null);
  };

  // -------------------------------------------------------------------------
  // Helper para verificar conexões entre etapas consecutivas (Regra 5)
  // -------------------------------------------------------------------------
  const findRegisteredConnection = (sourceName: string, targetName: string) => {
    return allConnections.find(
      (c) =>
        c.sourceProcessName.trim().toLowerCase() === sourceName.trim().toLowerCase() &&
        c.targetProcessName.trim().toLowerCase() === targetName.trim().toLowerCase()
    );
  };

  return (
    <div className="flex flex-col h-[calc(100vh-64px)] max-h-[92vh] overflow-hidden bg-[#fcfcfd]">
      {/* ========================================================================= */}
      {/* BARRA SUPERIOR / CABEÇALHO DO EDITOR (Header & Resumo) */}
      {/* ========================================================================= */}
      <div className="bg-white border-b border-gray-200 px-6 py-3 shrink-0 flex flex-col lg:flex-row lg:items-center justify-between gap-3 shadow-2xs">
        <div className="flex items-center gap-3 min-w-0">
          <Button
            variant="ghost"
            size="sm"
            onClick={onBackToDefinition}
            className="text-xs text-gray-600 hover:text-gray-900 gap-1.5 h-8 px-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            {pt ? "Voltar" : "Back"}
          </Button>

          <div className="h-4 w-px bg-gray-200" />

          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-base font-bold text-[#272727] truncate">
                {metadata.namePT || "Nova Jornada"}
              </h2>
              {mode === "ai" ? (
                <Badge className="bg-indigo-100 text-indigo-800 border-0 text-[10px] font-semibold flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-amber-500" />
                  {pt ? "Sugerida por IA · Confiança: 88%" : "AI Suggested · Confidence: 88%"}
                </Badge>
              ) : (
                <Badge variant="outline" className="text-[10px] text-gray-600 bg-gray-50 border-gray-200">
                  {pt ? "Composição Manual" : "Manual Flow"}
                </Badge>
              )}
              {metrics.pendingSteps > 0 && (
                <Badge variant="outline" className="bg-amber-50 text-amber-800 border-amber-300 text-[10px] font-medium">
                  {metrics.pendingSteps} {pt ? "pendência(s)" : "pending"}
                </Badge>
              )}
            </div>
            {(metadata.triggerEvent || metadata.expectedOutcome) && (
              <p className="text-[11px] text-gray-500 truncate mt-0.5 max-w-xl">
                <span className="font-semibold text-gray-600">{pt ? "Gatilho:" : "Trigger:"}</span> {metadata.triggerEvent || "—"} &nbsp;·&nbsp;
                <span className="font-semibold text-gray-600">{pt ? "Resultado:" : "Outcome:"}</span> {metadata.expectedOutcome || "—"}
              </p>
            )}
          </div>
        </div>

        {/* Resumo de Métricas & Ações de Salvamento */}
        <div className="flex items-center gap-3 shrink-0 flex-wrap">
          <div className="hidden sm:flex items-center gap-3 bg-gray-50 px-3 py-1.5 rounded-md border border-gray-200 text-xs">
            <span className="text-gray-500">
              {pt ? "Etapas:" : "Steps:"} <strong className="text-gray-800">{metrics.totalSteps}</strong>
            </span>
            <span className="text-gray-300">|</span>
            <span className="text-gray-500">
              {pt ? "Processos:" : "Processes:"} <strong className="text-emerald-700">{metrics.linkedSteps}/{metrics.totalSteps}</strong>
            </span>
            <span className="text-gray-300">|</span>
            <span className="text-gray-500">
              {pt ? "Domínios:" : "Domains:"} <strong className="text-gray-800">{metrics.uniqueDomains}</strong>
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onSaveDraft}
              className="text-xs h-8 text-gray-700 border-gray-300 hover:bg-gray-100"
            >
              {pt ? "Salvar como rascunho" : "Save as draft"}
            </Button>
            <Button
              type="button"
              size="sm"
              onClick={onPublish}
              className="bg-[#0C1BA8] hover:bg-[#04223D] text-white text-xs h-8 px-4 font-semibold shadow-xs"
            >
              {pt ? "Salvar e publicar" : "Save & publish"}
            </Button>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* CORPO DO EDITOR: 3 COLUNAS */}
      {/* ========================================================================= */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden">
        
        {/* ── PAINEL ESQUERDO: BIBLIOTECA DE PROCESSOS DISPONÍVEIS (3 colunas / ~300px) ── */}
        <div className="lg:col-span-3 border-r border-gray-200 bg-white flex flex-col overflow-hidden">
          <div className="p-3.5 border-b border-gray-100 space-y-2.5">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-[#272727] uppercase tracking-wider flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-[#0C1BA8]" />
                {pt ? "Processos Disponíveis" : "Available Processes"}
              </h3>
              <span className="text-[11px] text-gray-400 font-medium">
                {filteredProcesses.length} {pt ? "encontrados" : "found"}
              </span>
            </div>

            {/* Campo de Busca */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <Input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder={pt ? "Buscar processo..." : "Search process..."}
                className="pl-8 h-8 text-xs rounded-md border-gray-200"
              />
            </div>

            {/* Filtros de Domínio e Nível */}
            <div className="grid grid-cols-2 gap-2">
              <select
                value={selectedDomain}
                onChange={(e) => setSelectedDomain(e.target.value)}
                className="text-[11px] h-7 px-2 rounded border border-gray-200 bg-gray-50 text-gray-700 outline-hidden"
              >
                <option value="all">{pt ? "Todos os domínios" : "All domains"}</option>
                {domainOptions.map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>

              <select
                value={selectedLevel}
                onChange={(e) => setSelectedLevel(e.target.value)}
                className="text-[11px] h-7 px-2 rounded border border-gray-200 bg-gray-50 text-gray-700 outline-hidden"
              >
                <option value="all">{pt ? "Todos os níveis" : "All levels"}</option>
                <option value="l4">L4</option>
                <option value="l3">L3</option>
              </select>
            </div>
          </div>

          {/* Lista de Processos */}
          <div className="flex-1 overflow-y-auto p-3 space-y-2">
            {filteredProcesses.length === 0 ? (
              <div className="text-center py-8 text-xs text-gray-400">
                {pt ? "Nenhum processo localizado." : "No process found."}
              </div>
            ) : (
              filteredProcesses.map((proc) => {
                const isAlreadyAdded = addedProcessIds.has(proc.id);
                return (
                  <div
                    key={proc.id}
                    className={cn(
                      "p-2.5 rounded-lg border transition-all flex flex-col gap-1.5",
                      isAlreadyAdded
                        ? "bg-slate-50 border-gray-200 opacity-80"
                        : "bg-white border-gray-200 hover:border-[#0C1BA8]/50 hover:shadow-2xs"
                    )}
                  >
                    <div className="flex items-start justify-between gap-1.5">
                      <div className="min-w-0">
                        <span className="text-[10px] font-bold text-[#0C1BA8] uppercase tracking-wide block truncate">
                          {proc.l1 || "Geral"} · {proc.l4 ? "L4" : "L3"}
                        </span>
                        <h4 className="text-xs font-bold text-[#272727] leading-snug truncate" title={proc.name}>
                          {proc.name}
                        </h4>
                      </div>
                      <span
                        className="w-2 h-2 rounded-full shrink-0 mt-1"
                        style={{ background: proc.hasDocumentation ? "#22c55e" : "#cbd5e1" }}
                        title={proc.hasDocumentation ? "Documentado" : "Pendente"}
                      />
                    </div>

                    <div className="flex items-center justify-between pt-1 border-t border-gray-100 text-[10px]">
                      <span className="text-gray-400 truncate max-w-[150px]">
                        {proc.systems?.[0] || proc.executor || "Manual"}
                      </span>
                      {isAlreadyAdded ? (
                        <span className="text-emerald-700 font-semibold flex items-center gap-0.5">
                          <Check className="w-3 h-3" /> {pt ? "Adicionado" : "Added"}
                        </span>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleAddProcessToFlow(proc)}
                          className="text-[#0C1BA8] hover:bg-[#0C1BA8]/10 px-2 py-0.5 rounded font-bold transition-colors cursor-pointer"
                        >
                          + {pt ? "Adicionar" : "Add"}
                        </button>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* ── PAINEL CENTRAL: FLUXO VISUAL DA JORNADA (6 colunas) ── */}
        <div className="lg:col-span-6 bg-gray-50/50 flex flex-col overflow-y-auto p-4 sm:p-6">
          <div className="max-w-xl mx-auto w-full space-y-4">
            
            {/* Banner de Pendências caso existam processos não vinculados */}
            {metrics.pendingSteps > 0 && (
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg flex items-start gap-2.5 text-xs text-amber-900">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div className="flex-1">
                  <span className="font-bold">
                    {pt ? `Pendências da composição: ${metrics.pendingSteps}` : `Composition pending: ${metrics.pendingSteps}`}
                  </span>
                  <ul className="mt-1 list-disc list-inside text-[11px] text-amber-800 space-y-0.5">
                    {steps
                      .filter((s) => !s.processId || s.matchStatus === "nao_localizado")
                      .map((s) => (
                        <li key={s.id}>
                          {s.stepName} {pt ? "(sem processo vinculado)" : "(no linked process)"}
                        </li>
                      ))}
                  </ul>
                </div>
              </div>
            )}

            {/* ESTADO VAZIO */}
            {steps.length === 0 ? (
              <div className="py-16 px-6 text-center border-2 border-dashed border-gray-300 rounded-xl bg-white space-y-3">
                <div className="w-12 h-12 rounded-full bg-blue-50 text-[#0C1BA8] flex items-center justify-center mx-auto">
                  <Layers className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-[#272727]">
                    {pt ? "O fluxo da jornada está vazio" : "Journey flow is empty"}
                  </h4>
                  <p className="text-xs text-gray-500 mt-1 max-w-sm mx-auto">
                    {pt
                      ? "Selecione processos na biblioteca à esquerda para começar a montar a sequência de valor."
                      : "Pick processes from the left library to build your value stream sequence."}
                  </p>
                </div>
                <div className="pt-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      // Carregar 6 etapas canônicas de Order to Cash
                      const o2c = [
                        availableProcesses.find((p) => p.name.includes("Qualificar")) || availableProcesses[0],
                        availableProcesses.find((p) => p.name.includes("Precificação")) || availableProcesses[1],
                        availableProcesses.find((p) => p.name.includes("Proposta")) || availableProcesses[2],
                        availableProcesses.find((p) => p.name.includes("Contrato")) || availableProcesses[3],
                        availableProcesses.find((p) => p.name.includes("Faturamento")) || availableProcesses[4],
                        availableProcesses.find((p) => p.name.includes("Pagamento")) || availableProcesses[5],
                      ].filter(Boolean) as ProcessData[];

                      o2c.forEach((p, idx) => handleAddProcessToFlow(p, idx));
                    }}
                    className="text-xs border-[#0C1BA8]/40 text-[#0C1BA8] hover:bg-blue-50"
                  >
                    ⚡ {pt ? "Carregar fluxo canônico Order to Cash" : "Load canonical Order to Cash flow"}
                  </Button>
                </div>
              </div>
            ) : (
              /* LISTA SEQUENCIAL DE ETAPAS */
              <div className="space-y-2">
                {steps.map((step, idx) => {
                  const isSelected = selectedStepId === step.id;
                  const nextStep = steps[idx + 1];
                  const registeredConn = nextStep
                    ? findRegisteredConnection(step.stepName, nextStep.stepName)
                    : null;
                  const connKey = registeredConn ? `${step.stepName}->${nextStep.stepName}` : null;
                  const isConnDismissed = connKey ? dismissedConnectionKeys.has(connKey) : false;

                  return (
                    <React.Fragment key={step.id}>
                      {/* CARD DA ETAPA */}
                      <div
                        onClick={() => setSelectedStepId(step.id)}
                        className={cn(
                          "bg-white rounded-xl border-2 p-3.5 shadow-2xs transition-all cursor-pointer relative group",
                          isSelected
                            ? "border-[#0C1BA8] shadow-sm ring-2 ring-[#0C1BA8]/10"
                            : "border-gray-200 hover:border-gray-300"
                        )}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-start gap-2.5 min-w-0">
                            {/* Número da Etapa */}
                            <div className="w-6 h-6 rounded-full bg-[#EEF0FF] text-[#0C1BA8] font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                              {step.order}
                            </div>

                            <div className="space-y-1 min-w-0">
                              <div className="flex items-center gap-1.5 flex-wrap">
                                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                                  {step.domain || "Gestão Comercial"}
                                </span>
                                {step.level && (
                                  <Badge variant="outline" className="text-[9px] py-0 px-1 border-gray-300 text-gray-600">
                                    {step.level}
                                  </Badge>
                                )}
                                {step.hasDocumentation && (
                                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" title="Documentado" />
                                )}
                              </div>

                              <h4 className="text-sm font-bold text-[#272727] leading-tight">
                                {step.stepName}
                              </h4>

                              {step.system && (
                                <div className="flex items-center gap-1 text-[11px] text-gray-500">
                                  <Database className="w-3 h-3 text-gray-400" />
                                  <span>{step.system}</span>
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Reordenação e Ações Rápidas */}
                          <div className="flex items-center gap-1 shrink-0">
                            <button
                              type="button"
                              disabled={idx === 0}
                              onClick={(e) => {
                                e.stopPropagation();
                                handleMoveStep(idx, "up");
                              }}
                              className="p-1 text-gray-400 hover:text-gray-700 disabled:opacity-30 rounded hover:bg-gray-100"
                              title={pt ? "Mover para cima" : "Move up"}
                            >
                              <ArrowUp className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              disabled={idx === steps.length - 1}
                              onClick={(e) => {
                                e.stopPropagation();
                                handleMoveStep(idx, "down");
                              }}
                              className="p-1 text-gray-400 hover:text-gray-700 disabled:opacity-30 rounded hover:bg-gray-100"
                              title={pt ? "Mover para baixo" : "Move down"}
                            >
                              <ArrowDown className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleRemoveStep(step.id);
                              }}
                              className="p-1 text-gray-400 hover:text-rose-600 rounded hover:bg-rose-50"
                              title={pt ? "Remover da jornada" : "Remove"}
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                        {/* BADGES E AÇÕES DE IA (Quando no modo IA ou etapa sugerida) */}
                        {step.matchStatus && (
                          <div className="mt-2.5 pt-2 border-t border-gray-100 flex items-center justify-between gap-2 flex-wrap text-xs">
                            <div className="flex items-center gap-1.5">
                              {step.matchStatus === "encontrado_alta" && (
                                <Badge className="bg-emerald-50 text-emerald-800 border-emerald-200 text-[10px] font-medium">
                                  ✓ {pt ? "Encontrado na arquitetura (Alta corr.)" : "Found in architecture"}
                                </Badge>
                              )}
                              {step.matchStatus === "correspondencia_parcial" && (
                                <Badge className="bg-blue-50 text-blue-800 border-blue-200 text-[10px] font-medium">
                                  ≈ {pt ? "Correspondência parcial" : "Partial match"}
                                </Badge>
                              )}
                              {step.matchStatus === "sugerido_ia" && (
                                <Badge className="bg-purple-50 text-purple-800 border-purple-200 text-[10px] font-medium flex items-center gap-1">
                                  <Sparkles className="w-2.5 h-2.5 text-purple-600" />
                                  {pt ? "Sugerido pela IA" : "AI Suggested"}
                                </Badge>
                              )}
                              {step.matchStatus === "confirmado_usuario" && (
                                <Badge className="bg-emerald-100 text-emerald-900 border-0 text-[10px] font-bold">
                                  ✓ {pt ? "Confirmado" : "Confirmed"}
                                </Badge>
                              )}
                              {step.matchStatus === "nao_localizado" && (
                                <Badge className="bg-amber-100 text-amber-900 border-0 text-[10px] font-bold">
                                  ⚠ {pt ? "Não localizado" : "Unmapped"}
                                </Badge>
                              )}
                              {step.isProvisional && (
                                <Badge variant="outline" className="text-[9px] border-dashed border-amber-400 text-amber-700">
                                  {pt ? "Provisório" : "Provisional"}
                                </Badge>
                              )}
                            </div>

                            {/* Ações de Revisão da IA */}
                            {mode === "ai" && step.matchStatus !== "confirmado_usuario" && (
                              <div className="flex items-center gap-1">
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleUpdateAIStepAction(step.id, "confirmar");
                                  }}
                                  className="text-[10px] text-emerald-700 hover:bg-emerald-50 px-2 py-0.5 rounded font-bold"
                                >
                                  {pt ? "Confirmar" : "Confirm"}
                                </button>
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setSubstitutingStepId(step.id);
                                  }}
                                  className="text-[10px] text-blue-700 hover:bg-blue-50 px-2 py-0.5 rounded font-medium"
                                >
                                  {pt ? "Substituir" : "Replace"}
                                </button>
                              </div>
                            )}
                          </div>
                        )}

                        {/* Tratamento de Etapas Não Localizadas (Regras 7 e 8) */}
                        {step.matchStatus === "nao_localizado" && (
                          <div className="mt-2 p-2 bg-amber-50/80 border border-amber-200 rounded-lg text-xs space-y-1.5">
                            <p className="text-amber-800 text-[11px] font-medium">
                              {pt ? "Nenhum processo correspondente encontrado na arquitetura." : "No matching process found in architecture."}
                            </p>
                            <div className="flex items-center gap-2 flex-wrap">
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSubstitutingStepId(step.id);
                                }}
                                className="text-[10px] text-[#0C1BA8] font-bold hover:underline"
                              >
                                [{pt ? "Buscar processo" : "Search process"}]
                              </button>
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleUpdateAIStepAction(step.id, "sem_vinculo");
                                }}
                                className="text-[10px] text-gray-600 font-medium hover:underline"
                              >
                                [{pt ? "Deixar sem vínculo" : "Leave unlinked"}]
                              </button>
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleUpdateAIStepAction(step.id, "criar_provisorio");
                                }}
                                className="text-[10px] text-amber-800 font-bold hover:underline"
                              >
                                [{pt ? "Criar processo provisório" : "Create provisional"}]
                              </button>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* CONECTOR ENTRE ETAPAS + SUGESTÃO DE CONEXÃO REGISTRADA (Regra 5) */}
                      {nextStep && (
                        <div className="py-1 flex flex-col items-center justify-center relative">
                          {/* Sugestão de Conexão Predecessor/Sucessor Existente */}
                          {registeredConn && !isConnDismissed ? (
                            <div className="my-1.5 w-full bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-200 p-2 rounded-lg flex items-center justify-between gap-2 text-xs shadow-2xs">
                              <div className="flex items-center gap-2 min-w-0">
                                <GitFork className="w-3.5 h-3.5 text-purple-700 shrink-0" />
                                <div className="min-w-0">
                                  <span className="text-[10px] font-bold text-purple-900 block truncate">
                                    {pt ? "Conexão cadastrada encontrada:" : "Registered connection found:"}
                                  </span>
                                  <span className="text-[11px] text-purple-800 font-medium truncate block">
                                    {step.stepName} &rarr; {nextStep.stepName}
                                  </span>
                                </div>
                              </div>
                              <div className="flex items-center gap-1.5 shrink-0">
                                <Button
                                  type="button"
                                  size="sm"
                                  variant="outline"
                                  onClick={() => {
                                    toast.success(pt ? "Conexão adotada como referência de fluxo" : "Connection referenced");
                                  }}
                                  className="h-6 text-[10px] border-purple-300 text-purple-800 hover:bg-purple-100/50 px-2"
                                >
                                  {pt ? "Usar como referência" : "Use reference"}
                                </Button>
                                <Button
                                  type="button"
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => {
                                    if (connKey) {
                                      setDismissedConnectionKeys(new Set(dismissedConnectionKeys).add(connKey));
                                    }
                                  }}
                                  className="h-6 text-[10px] text-gray-500 hover:text-gray-700 px-1.5"
                                >
                                  {pt ? "Ignorar" : "Dismiss"}
                                </Button>
                              </div>
                            </div>
                          ) : (
                            /* Seta normal e botão discreto de inserir etapa intermediária */
                            <div className="flex items-center justify-center gap-2 my-1 group/connector">
                              <div className="w-px h-3 bg-gray-300" />
                              <ArrowDown className="w-3.5 h-3.5 text-gray-400" />
                              <button
                                type="button"
                                onClick={() => {
                                  // Adiciona processo entre as etapas
                                  const proc = availableProcesses[0];
                                  if (proc) handleAddProcessToFlow(proc, idx + 1);
                                }}
                                className="text-[10px] text-gray-400 hover:text-[#0C1BA8] opacity-0 group-hover/connector:opacity-100 transition-opacity bg-white border border-gray-200 px-1.5 py-0.5 rounded shadow-2xs"
                              >
                                + {pt ? "Inserir etapa aqui" : "Insert here"}
                              </button>
                            </div>
                          )}
                        </div>
                      )}
                    </React.Fragment>
                  );
                })}

                {/* Botão de Adicionar ao Final */}
                <div className="pt-2 text-center">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const unused = availableProcesses.find((p) => !addedProcessIds.has(p.id));
                      if (unused) {
                        handleAddProcessToFlow(unused);
                      } else {
                        toast.info(pt ? "Todos os processos da biblioteca já foram adicionados" : "All processes added");
                      }
                    }}
                    className="text-xs border-dashed border-[#0C1BA8]/40 text-[#0C1BA8] hover:bg-blue-50 gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    {pt ? "Adicionar etapa ao final" : "Add step at end"}
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ── PAINEL DIREITO: DETALHES DA ETAPA SELECIONADA (3 colunas / ~340px) ── */}
        <div className="lg:col-span-3 border-l border-gray-200 bg-white flex flex-col overflow-hidden">
          {activeStep ? (
            <div className="flex flex-col h-full overflow-hidden">
              {/* Header do Painel de Detalhes */}
              <div className="p-4 border-b border-gray-100 bg-gray-50/50">
                <div className="flex items-center justify-between mb-1">
                  <Badge className="bg-[#0C1BA8] text-white text-[9px] uppercase tracking-wider">
                    {pt ? `Etapa ${activeStep.order}` : `Step ${activeStep.order}`}
                  </Badge>
                  <span className="text-[10px] text-gray-400">
                    {activeStep.domain || "Gestão Comercial"} · {activeStep.level || "L4"}
                  </span>
                </div>
                <h3 className="text-sm font-bold text-[#272727] leading-snug">
                  {activeStep.stepName}
                </h3>
              </div>

              {/* Informações detalhadas do Processo */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
                {activeStepProcessData?.description && (
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
                      {pt ? "Descrição Operacional" : "Description"}
                    </span>
                    <p className="text-gray-600 text-[11px] leading-relaxed bg-gray-50 p-2 rounded border border-gray-100">
                      {activeStepProcessData.description}
                    </p>
                  </div>
                )}

                {/* Atributos: Responsável, Sistemas, SLA */}
                <div className="space-y-2 pt-1 border-t border-gray-100">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-gray-500 font-medium flex items-center gap-1">
                      <User className="w-3.5 h-3.5 text-gray-400" />
                      {pt ? "Responsável:" : "Owner:"}
                    </span>
                    <span className="font-semibold text-gray-800">
                      {activeStepProcessData?.executor || activeStepProcessData?.owner || "Account Executive"}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-gray-500 font-medium flex items-center gap-1">
                      <Database className="w-3.5 h-3.5 text-gray-400" />
                      {pt ? "Sistemas:" : "Systems:"}
                    </span>
                    <span className="font-semibold text-gray-800">
                      {activeStepProcessData?.systems?.join(", ") || activeStep.system || "Salesforce"}
                    </span>
                  </div>

                  {activeStepProcessData?.sla && (
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-gray-500 font-medium flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-gray-400" />
                        {pt ? "SLA Operacional:" : "SLA:"}
                      </span>
                      <span className="font-semibold text-gray-800">
                        {activeStepProcessData.sla}
                      </span>
                    </div>
                  )}
                </div>

                {/* Conexões Predecessor/Sucessor do Processo */}
                <div className="pt-2 border-t border-gray-100 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                      {pt ? "Conexões Mapeadas" : "Mapped Connections"}
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        setConnMapProcess({
                          id: activeStep.processId || activeStep.id,
                          name: activeStep.stepName,
                          domain: activeStep.domain,
                        })
                      }
                      className="text-[10px] text-[#0C1BA8] font-bold hover:underline flex items-center gap-0.5"
                    >
                      <GitFork className="w-3 h-3" />
                      {pt ? "Ver mapa" : "View map"}
                    </button>
                  </div>
                  <p className="text-[10px] text-gray-400">
                    {pt
                      ? "A ordem na jornada é independente e não altera os relacionamentos globais."
                      : "Journey step order is independent and does not alter global relations."}
                  </p>
                </div>

                {/* Observações da Etapa */}
                <div className="pt-2 border-t border-gray-100 space-y-1.5">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
                    {pt ? "Observação desta Etapa" : "Step Note"}
                  </span>
                  <Input
                    value={activeStep.notes || ""}
                    onChange={(e) => {
                      const updated = steps.map((s) =>
                        s.id === activeStep.id ? { ...s, notes: e.target.value } : s
                      );
                      onStepsChange(updated);
                    }}
                    placeholder={pt ? "Adicione notas específicas da jornada..." : "Add journey-specific notes..."}
                    className="text-xs h-8 rounded-md"
                  />
                </div>
              </div>

              {/* Ações no Rodapé do Painel Direito */}
              <div className="p-3 border-t border-gray-200 bg-gray-50 flex items-center justify-between gap-2">
                {activeStep.processId && onNavigateToProcess && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => onNavigateToProcess(activeStep.processId!)}
                    className="h-8 text-xs border-gray-300 text-gray-700 hover:bg-white flex items-center gap-1"
                  >
                    <ExternalLink className="w-3 h-3" />
                    {pt ? "Abrir processo" : "Open process"}
                  </Button>
                )}

                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => handleRemoveStep(activeStep.id)}
                  className="h-8 text-xs text-rose-600 hover:bg-rose-50 hover:text-rose-700 ml-auto"
                >
                  <Trash2 className="w-3.5 h-3.5 mr-1" />
                  {pt ? "Remover" : "Remove"}
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-6 text-center text-gray-400 text-xs">
              <Layers className="w-8 h-8 mb-2 stroke-1 text-gray-300" />
              <p className="font-medium text-gray-600">{pt ? "Nenhuma etapa selecionada" : "No step selected"}</p>
              <p className="text-[11px] text-gray-400 mt-1">
                {pt ? "Clique em uma etapa no fluxo central para visualizar seus detalhes." : "Click a step to view its details."}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Modal de Mapa de Conexões Locais do Processo */}
      {connMapProcess && (
        <ProcessConnectionMapModal
          open={!!connMapProcess}
          onOpenChange={(isOpen) => !isOpen && setConnMapProcess(null)}
          initialProcessId={connMapProcess.id}
          initialProcessName={connMapProcess.name}
          initialDomain={connMapProcess.domain}
        />
      )}

      {/* Modal / Popover para Substituição de Processo da Etapa */}
      {substitutingStepId && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-5 shadow-2xl border border-gray-200 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-gray-100">
              <h4 className="text-sm font-bold text-[#272727]">
                {pt ? "Substituir Processo da Etapa" : "Replace Step Process"}
              </h4>
              <button
                type="button"
                onClick={() => setSubstitutingStepId(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-gray-500">
              {pt ? "Selecione o processo da arquitetura que deve ser associado a esta etapa:" : "Select the architectural process to link:"}
            </p>

            <div className="max-h-60 overflow-y-auto space-y-1.5 pr-1">
              {availableProcesses.map((proc) => (
                <button
                  key={proc.id}
                  type="button"
                  onClick={() => handleUpdateAIStepAction(substitutingStepId, "substituir", proc)}
                  className="w-full text-left p-2 rounded-lg border border-gray-200 hover:border-[#0C1BA8] hover:bg-blue-50/50 transition-colors text-xs flex items-center justify-between"
                >
                  <div>
                    <span className="text-[10px] font-bold text-[#0C1BA8] block">
                      {proc.l1 || "Geral"} · {proc.l4 ? "L4" : "L3"}
                    </span>
                    <span className="font-semibold text-gray-800">{proc.name}</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                </button>
              ))}
            </div>

            <div className="pt-2 border-t border-gray-100 flex justify-end">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSubstitutingStepId(null)}
                className="text-xs"
              >
                {pt ? "Cancelar" : "Cancel"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
