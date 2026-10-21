import { useState } from "react";
import {
  Scale,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle2,
  ShieldAlert,
  Users,
  GitBranch,
  FileText,
  ArrowRight,
  MessageSquare,
  Layers,
  Check,
  Activity,
  Monitor,
  Cog,
  Sparkles,
  Plus,
  History,
  ArrowLeft,
  RefreshCw,
  Clock,
  X,
  SlidersHorizontal,
  ShieldCheck,
  Network,
  ZoomIn,
  ZoomOut,
  Maximize2,
  UserCheck,
  Minus,
} from "lucide-react";
import { useOrgIntelligenceStore } from "@/stores/orgIntelligenceStore";
import {
  StanceStatus,
  RelationshipMapBranch,
  getImpactExecutiveSummaryForAnalysis,
  getRelationshipMapForAnalysis,
} from "@/data/orgIntelligenceMockData";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

type ReportTab =
  | "executive_summary"
  | "relationship_map"
  | "change_details"
  | "indicators_map"
  | "processes_map";

function getBranchThemeClasses(theme: RelationshipMapBranch["colorTheme"]) {
  switch (theme) {
    case "blue":
      return {
        categoryCard: "bg-blue-50/90 border-blue-300 text-blue-900",
        leafBorder: "border-blue-200 hover:border-blue-400",
      };
    case "cyan":
      return {
        categoryCard: "bg-sky-50/90 border-sky-300 text-sky-900",
        leafBorder: "border-sky-200 hover:border-sky-400",
      };
    case "pink":
      return {
        categoryCard: "bg-pink-50/90 border-pink-300 text-pink-900",
        leafBorder: "border-pink-200 hover:border-pink-400",
      };
    case "orange":
      return {
        categoryCard: "bg-orange-50/90 border-orange-300 text-orange-900",
        leafBorder: "border-orange-200 hover:border-orange-400",
      };
    case "amber":
      return {
        categoryCard: "bg-amber-50/90 border-amber-300 text-amber-900",
        leafBorder: "border-amber-200 hover:border-amber-400",
      };
    case "yellow":
      return {
        categoryCard: "bg-yellow-50/90 border-yellow-300 text-yellow-900",
        leafBorder: "border-yellow-200 hover:border-yellow-400",
      };
    case "emerald":
      return {
        categoryCard: "bg-emerald-50/90 border-emerald-300 text-emerald-900",
        leafBorder: "border-emerald-200 hover:border-emerald-400",
      };
    case "purple":
      return {
        categoryCard: "bg-purple-50/90 border-purple-300 text-purple-900",
        leafBorder: "border-purple-200 hover:border-purple-400",
      };
  }
}

function getStanceBadge(stance: StanceStatus) {
  if (stance === "favoravel") {
    return {
      label: "Favorável",
      bg: "bg-emerald-50 text-emerald-800 border-emerald-200",
      dot: "bg-emerald-500",
    };
  }
  if (stance === "ressalvas") {
    return {
      label: "Com Ressalvas",
      bg: "bg-amber-50 text-amber-800 border-amber-200",
      dot: "bg-amber-500",
    };
  }
  return {
    label: "Resistente / Alerta",
    bg: "bg-rose-50 text-rose-800 border-rose-200",
    dot: "bg-rose-500",
  };
}

export function ImpactSimulatorView() {
  const {
    currentAnalysis,
    simulationSessions,
    activeSessionId,
    areaProfiles,
    isSimulating,
    simulationLoadingMode,
    simulationLoadingSteps,
    selectSessionVersion,
    initiateSimulationFlow,
    startNewSimulationFromPrompt,
    openCommitteeForArea,
    setActiveModuleTab,
  } = useOrgIntelligenceStore();

  const [activeReportTab, setActiveReportTab] = useState<ReportTab>("executive_summary");
  const [selectedIndicatorAreaFilter, setSelectedIndicatorAreaFilter] = useState<string>("all");
  const [selectedProcessAreaFilter, setSelectedProcessAreaFilter] = useState<string>("all");
  const [isNewSimModalOpen, setIsNewSimModalOpen] = useState(false);
  const [newPromptText, setNewPromptText] = useState("");
  const [mapZoom, setMapZoom] = useState<number>(1);

  const activeSession =
    simulationSessions.find((s) => s.id === activeSessionId) || simulationSessions[0];
  const activeVersionObj =
    activeSession?.versions.find(
      (v) => v.versionNumber === activeSession.activeVersionNumber
    ) || activeSession?.versions[0];
  const firstVersionObj = activeSession?.versions[0];
  const currentVersionNumber = activeVersionObj?.versionNumber || 1;
  const nextVersionNumber = (activeSession?.versions.length || 1) + 1;

  const execSummary = getImpactExecutiveSummaryForAnalysis(
    currentAnalysis,
    currentVersionNumber
  );
  const relationshipMap = getRelationshipMapForAnalysis(currentAnalysis);

  const positiveIndicators = currentAnalysis.indicatorsImpacted.filter(
    (i) => i.direction === "positivo"
  );
  const negativeIndicators = currentAnalysis.indicatorsImpacted.filter(
    (i) => i.direction === "negativo"
  );

  const acceptedNegotiationItems = (activeSession?.negotiationItems || []).filter(
    (item) => item.status === "accepted"
  );
  const rejectedNegotiationItems = (activeSession?.negotiationItems || []).filter(
    (item) => item.status === "rejected"
  );
  const pendingNegotiationItems = (activeSession?.negotiationItems || []).filter(
    (item) => item.status === "pending"
  );

  // Agrupa indicadores por Área para construir a Árvore / Mapa Mental
  const indicatorAreasMap = currentAnalysis.areasAndCommittee.map((rep) => {
    const matchedIndicators = currentAnalysis.indicatorsImpacted.filter((ind) => {
      const indAreaLower = ind.area.toLowerCase();
      const repShortLower = rep.shortArea.toLowerCase();
      const repNameLower = rep.areaName.toLowerCase();
      return (
        indAreaLower.includes(repShortLower.split(" ")[0]) ||
        repShortLower.includes(indAreaLower.split(" ")[0]) ||
        repNameLower.includes(indAreaLower.split(" ")[0])
      );
    });
    return {
      rep,
      indicators: matchedIndicators,
    };
  });

  // Indicadores que não caíram em nenhuma área específica (se houver) são associados à área mais próxima
  const assignedIndIds = new Set(
    indicatorAreasMap.flatMap((g) => g.indicators.map((i) => i.id))
  );
  const unassignedIndicators = currentAnalysis.indicatorsImpacted.filter(
    (i) => !assignedIndIds.has(i.id)
  );
  if (unassignedIndicators.length > 0 && indicatorAreasMap.length > 0) {
    indicatorAreasMap[0].indicators = [
      ...indicatorAreasMap[0].indicators,
      ...unassignedIndicators,
    ];
  }

  // Agrupa processos por Área para construir a Árvore / Mapa Mental de Processos
  const processAreasMap = currentAnalysis.areasAndCommittee.map((rep) => {
    const directProcesses = currentAnalysis.affectedProcesses.filter((proc) => {
      const ownerLower = proc.ownerArea.toLowerCase();
      const repShortLower = rep.shortArea.toLowerCase();
      return (
        ownerLower.includes(repShortLower.split(" ")[0]) ||
        repShortLower.includes(ownerLower.split(" ")[0]) ||
        rep.affectedProcesses.some((ap) => ap.includes(proc.code))
      );
    });

    // Complementa com processos mapeados da área caso a área tenha códigos em rep.affectedProcesses
    const areaProfile = areaProfiles.find(
      (ap) =>
        ap.id === rep.areaId ||
        ap.shortArea.toLowerCase().includes(rep.shortArea.split(" ")[0].toLowerCase())
    );

    const extraProcesses =
      directProcesses.length > 0
        ? []
        : rep.affectedProcesses.map((procLabel, idx) => {
            const [codePart, ...nameParts] = procLabel.split(" - ");
            const matchedFromProfile = areaProfile?.mappedProcesses.find(
              (mp) => mp.code === codePart?.trim()
            );
            return {
              id: `proc-rep-${rep.id}-${idx}`,
              code: codePart?.trim() || `PRC-0${idx + 1}`,
              name:
                nameParts.join(" - ").trim() ||
                matchedFromProfile?.name ||
                procLabel,
              valueChainPath: `${rep.shortArea} > Operação Core`,
              ownerArea: rep.shortArea,
              businessRulesAffected:
                areaProfile?.businessRules.slice(0, 2).map((r) => r.code) || [
                  "RN-GERAL-01",
                ],
              changeRequired:
                currentVersionNumber > 1 && rep.stance === "favoravel"
                  ? `Fluxo ajustado na v${currentVersionNumber} com as salvaguardas acordadas na Mesa Redonda para ${rep.shortArea}.`
                  : rep.mainConcerns[0] ||
                    `Adequação de fluxo operacional e parâmetros sistêmicos em ${rep.shortArea}.`,
            };
          });

    return {
      rep,
      processes: [...directProcesses, ...extraProcesses],
    };
  });

  const handleCreateNewSimulation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPromptText.trim()) {
      toast.error("Descreva a mudança que você deseja simular.");
      return;
    }
    setIsNewSimModalOpen(false);
    initiateSimulationFlow(newPromptText.trim());
    setNewPromptText("");
  };

  // Decomposição estruturada dos parâmetros da mudança proposta
  const structuredChangeDimensions = [
    {
      category: "Regra Operacional & Gatilho Proposto",
      status: currentVersionNumber > 1 ? `Calibrado na v${currentVersionNumber}` : "Proposta Original (v1)",
      isCalibrated: currentVersionNumber > 1,
      currentBaseline: currentAnalysis.currentDirectiveAsIs,
      proposedSpecification: currentAnalysis.proposedDirectiveToBe,
      technicalDetails:
        currentVersionNumber > 1
          ? `A versão v${currentVersionNumber} substitui a aplicação cega da regra original por um gatilho condicional que respeita janelas de compensação e notificações obrigatórias.`
          : "Aplicação direta e imediata da nova regra sobre 100% da base assim que o gatilho temporal é atingido, sem filtro prévio de perfil ou meio de pagamento.",
    },
    ...currentAnalysis.areasAndCommittee.map((rep) => {
      const areaNegotiation = (activeSession?.negotiationItems || []).find(
        (n) => n.repId === rep.id
      );
      const isAcceptedInSession =
        currentVersionNumber > 1 &&
        (areaNegotiation?.status === "accepted" || rep.stance === "favoravel");

      return {
        category: `Escopo & Regras em ${rep.shortArea}`,
        status: isAcceptedInSession
          ? `Acordo Incorporado na v${currentVersionNumber}`
          : rep.stance === "favoravel"
            ? "Alinhado com a Área"
            : "Exige Ajuste na Mesa Redonda",
        isCalibrated: isAcceptedInSession,
        currentBaseline: `Processos impactados: ${rep.affectedProcesses.join(", ")} · Sistemas: ${rep.affectedSystems.join(", ")}`,
        proposedSpecification: isAcceptedInSession
          ? areaNegotiation?.clauseAddedToProposal ||
            rep.negotiationConditions[0] ||
            rep.stanceSummary
          : rep.mainConcerns[0] || rep.stanceSummary,
        technicalDetails: isAcceptedInSession
          ? `Cláusula negociada e aprovada com ${rep.agentName}: "${areaNegotiation?.title || rep.negotiationConditions[0]}".`
          : `Condição solicitada pela área na Mesa Redonda: "${rep.negotiationConditions[0] || "Revisar parâmetros técnicos antes da entrada em produção"}".`,
      };
    }),
  ];

  return (
    <div className="min-h-[calc(100vh-64px)] bg-[#f8fafc] flex flex-col lg:flex-row relative">
      {/* =====================================================================
          SIDEBAR ESQUERDA: EXECUTIVA, CLEAN & ALINHADA AO DESIGN SYSTEM
      ===================================================================== */}
      <aside className="w-full lg:w-[300px] bg-white border-b lg:border-b-0 lg:border-r border-slate-200/90 flex flex-col shrink-0 lg:sticky lg:top-16 lg:h-[calc(100vh-64px)]">
        {/* 1. Navegação Superior Discreta */}
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between gap-2">
          <button
            type="button"
            onClick={() => setActiveModuleTab("home")}
            className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
          >
            <ArrowLeft className="h-3.5 w-3.5 text-slate-400" />
            <span>Voltar ao Início</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveModuleTab("history")}
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <History className="h-3.5 w-3.5 text-slate-400" />
            <span>Histórico</span>
          </button>
        </div>

        {/* 2. Corpo da Sidebar */}
        <div className="flex-1 overflow-y-auto px-5 py-5 space-y-6">
          {/* BLOCO A: VERSÕES DA SIMULAÇÃO (TIMELINE EXECUTIVA) */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-900">
                Versões da Simulação
              </span>
              <span className="text-[11px] text-slate-400 font-medium whitespace-nowrap">
                {activeSession?.versions.length || 1}{" "}
                {(activeSession?.versions.length || 1) === 1 ? "versão" : "versões"}
              </span>
            </div>

            <div className="space-y-2">
              {activeSession?.versions.map((ver) => {
                const isSelected = ver.versionNumber === currentVersionNumber;
                const risk = ver.analysis.overallRiskScore;
                return (
                  <button
                    key={ver.versionNumber}
                    type="button"
                    onClick={() =>
                      selectSessionVersion(activeSession.id, ver.versionNumber)
                    }
                    className={cn(
                      "w-full text-left p-3.5 rounded-xl border transition-all cursor-pointer space-y-1.5",
                      isSelected
                        ? "bg-white border-slate-900 shadow-xs ring-1 ring-slate-900/5"
                        : "bg-slate-50/60 border-slate-200/80 hover:bg-white hover:border-slate-300"
                    )}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2 min-w-0">
                        <span
                          className={cn(
                            "px-1.5 py-0.5 rounded text-[11px] font-bold shrink-0 whitespace-nowrap",
                            isSelected
                              ? "bg-slate-900 text-white"
                              : "bg-slate-200/80 text-slate-700"
                          )}
                        >
                          v{ver.versionNumber}
                        </span>
                        <span className="text-xs font-semibold text-slate-900 truncate">
                          {ver.versionNumber === 1
                            ? "Proposta Inicial"
                            : "Pós-Mesa Redonda"}
                        </span>
                      </div>

                      <span
                        className={cn(
                          "px-2 py-0.5 rounded-md text-[10px] font-semibold shrink-0 whitespace-nowrap",
                          risk >= 70
                            ? "bg-rose-50 text-rose-700 border border-rose-200/60"
                            : risk >= 45
                              ? "bg-amber-50 text-amber-800 border border-amber-200/60"
                              : "bg-emerald-50 text-emerald-700 border border-emerald-200/60"
                        )}
                      >
                        Risco {risk}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-slate-400 pt-0.5">
                      <span>{ver.createdAt}</span>
                      {ver.versionNumber > 1 && (
                        <span className="text-emerald-700 font-medium">
                          {ver.acceptedConditionsCount} ajuste(s)
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}

              {/* Indicador discreto da próxima versão */}
              <div className="px-3 py-2.5 rounded-xl border border-dashed border-slate-200 bg-slate-50/40 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-slate-100 text-slate-500 shrink-0">
                    v{nextVersionNumber}
                  </span>
                  <span className="text-[11px] text-slate-500 truncate">
                    Gerada após Mesa Redonda
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="h-px bg-slate-100" />

          {/* BLOCO B: PAINEL EXECUTIVO DA MESA REDONDA */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-900">
                Mesa Redonda
              </span>
              <span className="text-[11px] text-slate-400 font-medium whitespace-nowrap">
                {currentAnalysis.areasAndCommittee.length} áreas
              </span>
            </div>

            <div className="rounded-2xl border border-slate-200/90 bg-slate-50/50 p-4 space-y-4">
              <p className="text-xs text-slate-600 leading-relaxed">
                Alinhe condicionantes com os representantes de cada área e reprocesse para gerar a{" "}
                <strong className="font-semibold text-slate-900">
                  Versão {nextVersionNumber}
                </strong>
                .
              </p>

              {/* Lista Executiva de Áreas e Posturas */}
              <div className="space-y-1.5">
                {currentAnalysis.areasAndCommittee.map((rep) => {
                  const st = getStanceBadge(rep.stance);
                  return (
                    <button
                      key={rep.id}
                      type="button"
                      onClick={() => openCommitteeForArea(rep.id)}
                      className="w-full flex items-center justify-between gap-2 px-3 py-2 rounded-xl bg-white hover:bg-slate-50 border border-slate-200/70 transition-colors cursor-pointer text-left"
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <span
                          className="w-2 h-2 rounded-full shrink-0"
                          style={{ backgroundColor: rep.avatarColor }}
                        />
                        <span className="text-xs font-medium text-slate-800 truncate">
                          {rep.shortArea}
                        </span>
                      </div>

                      <span className="inline-flex items-center gap-1 text-[10px] font-medium text-slate-500 shrink-0 whitespace-nowrap">
                        <span className={`w-1.5 h-1.5 rounded-full ${st.dot}`} />
                        <span>
                          {rep.stance === "favoravel"
                            ? "Favorável"
                            : rep.stance === "ressalvas"
                              ? "Ressalvas"
                              : "Alerta"}
                        </span>
                      </span>
                    </button>
                  );
                })}
              </div>

              <button
                type="button"
                onClick={() => openCommitteeForArea()}
                className="w-full py-2.5 px-4 rounded-xl bg-[#ea580c] hover:bg-[#c2410c] text-white text-xs font-semibold flex items-center justify-center gap-2 shadow-2xs transition-colors cursor-pointer"
              >
                <Users className="h-3.5 w-3.5" />
                <span>Abrir Mesa Redonda</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* 3. Rodapé da Sidebar */}
        <div className="p-4 border-t border-slate-100">
          <button
            type="button"
            onClick={() => setActiveModuleTab("new_simulation")}
            className="w-full py-2 px-3 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-xs font-medium text-slate-700 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          >
            <Plus className="h-3.5 w-3.5 text-slate-500" />
            <span>Nova Simulação</span>
          </button>
        </div>
      </aside>

      {/* =====================================================================
          ÁREA PRINCIPAL DIREITA: RELATÓRIO DA VERSÃO SELECIONADA
      ===================================================================== */}
      <div className="flex-1 min-w-0 flex flex-col">
        {/* 1. HEADER EXECUTIVO OTIMIZADO EM LARGURA TOTAL */}
        <div className="bg-white border-b border-slate-200 px-6 sm:px-8 pt-6 pb-0">
          <div className="w-full space-y-4">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div className="space-y-1.5 max-w-4xl">
                <div className="flex items-center gap-2 flex-wrap text-xs text-slate-500">
                  <span className="font-semibold text-slate-900">
                    Versão {currentVersionNumber}
                  </span>
                  <span>·</span>
                  <span>{currentAnalysis.domainTag}</span>
                  <span>·</span>
                  <span className="inline-flex items-center gap-1 text-slate-400">
                    <Clock className="h-3 w-3" />
                    <span>{activeVersionObj?.createdAt}</span>
                  </span>
                  {currentVersionNumber > 1 && (
                    <span className="px-2 py-0.5 rounded-md text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      Calibrada na Mesa Redonda
                    </span>
                  )}
                </div>

                <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                  {currentAnalysis.title}
                </h1>

                <p className="text-xs text-slate-500">
                  <strong className="font-medium text-slate-700">
                    Demanda analisada:
                  </strong>{" "}
                  &ldquo;{activeSession?.initialPrompt || currentAnalysis.userDirectivePrompt}&rdquo;
                </p>
              </div>

              {/* Card Compacto de Risco Sistêmico */}
              <div className="bg-slate-50 rounded-2xl border border-slate-200/90 px-5 py-3.5 flex items-center gap-4 shrink-0">
                <div>
                  <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                    Risco Sistêmico · v{currentVersionNumber}
                  </div>
                  <div className="flex items-baseline gap-2 mt-0.5">
                    <span
                      className={cn(
                        "text-2xl font-bold tabular-nums",
                        currentAnalysis.overallRiskScore >= 70
                          ? "text-rose-600"
                          : currentAnalysis.overallRiskScore >= 45
                            ? "text-amber-600"
                            : "text-emerald-600"
                      )}
                    >
                      {currentAnalysis.overallRiskScore}/100
                    </span>
                    {firstVersionObj &&
                      currentVersionNumber > 1 &&
                      firstVersionObj.analysis.overallRiskScore !==
                        currentAnalysis.overallRiskScore && (
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-emerald-100 text-emerald-800 whitespace-nowrap">
                          v1: {firstVersionObj.analysis.overallRiskScore}/100
                        </span>
                      )}
                  </div>
                  <div className="text-[11px] font-medium text-slate-600 mt-0.5">
                    {currentAnalysis.viabilityStatus}
                  </div>
                </div>
              </div>
            </div>

            {/* 2. BARRA DE ABAS DO RELATÓRIO (SEM SCROLL HORIZONTAL) */}
            <div className="flex items-center gap-1 sm:gap-2 border-t border-slate-100 pt-1 overflow-x-hidden flex-wrap xl:flex-nowrap">
              <button
                type="button"
                onClick={() => setActiveReportTab("executive_summary")}
                className={cn(
                  "px-3.5 py-2.5 text-xs font-semibold border-b-2 flex items-center gap-2 transition-all whitespace-nowrap cursor-pointer shrink-0",
                  activeReportTab === "executive_summary"
                    ? "border-[#ea580c] text-slate-900"
                    : "border-transparent text-slate-500 hover:text-slate-900"
                )}
              >
                <FileText className="h-4 w-4 text-[#ea580c]" />
                <span>Resumo Executivo</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveReportTab("relationship_map")}
                className={cn(
                  "px-3.5 py-2.5 text-xs font-semibold border-b-2 flex items-center gap-2 transition-all whitespace-nowrap cursor-pointer shrink-0",
                  activeReportTab === "relationship_map"
                    ? "border-[#ea580c] text-slate-900"
                    : "border-transparent text-slate-500 hover:text-slate-900"
                )}
              >
                <Network className="h-4 w-4 text-[#ea580c]" />
                <span>Mapa de Relações</span>
                <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-orange-50 text-[#ea580c] font-bold">
                  8 dimensões
                </span>
              </button>

              <button
                type="button"
                onClick={() => setActiveReportTab("change_details")}
                className={cn(
                  "px-3.5 py-2.5 text-xs font-semibold border-b-2 flex items-center gap-2 transition-all whitespace-nowrap cursor-pointer shrink-0",
                  activeReportTab === "change_details"
                    ? "border-[#ea580c] text-slate-900"
                    : "border-transparent text-slate-500 hover:text-slate-900"
                )}
              >
                <SlidersHorizontal className="h-4 w-4 text-[#ea580c]" />
                <span>Regras & Políticas</span>
                <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-slate-100 text-slate-600">
                  {currentAnalysis.policiesImpacted.length}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setActiveReportTab("indicators_map")}
                className={cn(
                  "px-3.5 py-2.5 text-xs font-semibold border-b-2 flex items-center gap-2 transition-all whitespace-nowrap cursor-pointer shrink-0",
                  activeReportTab === "indicators_map"
                    ? "border-[#ea580c] text-slate-900"
                    : "border-transparent text-slate-500 hover:text-slate-900"
                )}
              >
                <Activity className="h-4 w-4 text-[#ea580c]" />
                <span>Indicadores por Área</span>
                <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-slate-100 text-slate-600">
                  +{positiveIndicators.length} / -{negativeIndicators.length}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setActiveReportTab("processes_map")}
                className={cn(
                  "px-3.5 py-2.5 text-xs font-semibold border-b-2 flex items-center gap-2 transition-all whitespace-nowrap cursor-pointer shrink-0",
                  activeReportTab === "processes_map"
                    ? "border-[#ea580c] text-slate-900"
                    : "border-transparent text-slate-500 hover:text-slate-900"
                )}
              >
                <GitBranch className="h-4 w-4 text-[#ea580c]" />
                <span>Processos por Área</span>
                <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-slate-100 text-slate-600">
                  {currentAnalysis.areasAndCommittee.length} áreas
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* =====================================================================
            CONTEÚDO DAS ABAS (LARGURA TOTAL SEM BORDAS VAZIAS)
        ===================================================================== */}
        <div className="flex-1 px-6 sm:px-8 py-6">
          <div className="w-full space-y-6">
            {/* =================================================================
                ABA 0A: RESUMO EXECUTIVO DO IMPACTO (DESIGN REFERÊNCIA EXECUTIVA)
            ================================================================= */}
            {activeReportTab === "executive_summary" && (
              <div className="space-y-6">
                <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-2xs space-y-6">
                  {/* Topo: Tag RESUMO DO IMPACTO + Ações Rápidas */}
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="inline-flex items-center gap-2">
                      <span className="w-7 h-7 rounded-lg bg-indigo-50 border border-indigo-200/80 text-indigo-700 flex items-center justify-center">
                        <FileText className="h-3.5 w-3.5" />
                      </span>
                      <span className="text-xs font-bold uppercase tracking-wider text-indigo-900">
                        Resumo do Impacto
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setActiveReportTab("relationship_map")}
                        className="px-3.5 py-2 rounded-xl border border-slate-200 hover:border-[#ea580c] bg-white hover:bg-orange-50/40 text-xs font-semibold text-slate-700 flex items-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <Network className="h-3.5 w-3.5 text-[#ea580c]" />
                        <span>Ver Mapa de Relações</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => openCommitteeForArea()}
                        className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-[#ea580c] text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <Users className="h-3.5 w-3.5" />
                        <span>Alinhar na Mesa Redonda</span>
                      </button>
                    </div>
                  </div>

                  {/* Manchete Executiva (Headline) + Subtítulo */}
                  <div className="space-y-2">
                    <h2 className="text-lg sm:text-xl font-bold text-slate-900 leading-snug tracking-tight">
                      {execSummary.headline}
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-400 font-medium">
                      {execSummary.subtitle}
                    </p>
                  </div>

                  {/* Barra de 4 Indicadores Executivos: EFEITO | TAMANHO | CONFIANÇA | ESCALONAMENTO */}
                  <div className="rounded-xl border border-slate-200/90 bg-slate-50/40 grid grid-cols-2 sm:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-slate-200/80">
                    {/* Coluna 1: EFEITO */}
                    <div className="p-4 space-y-1.5">
                      <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        Efeito
                      </div>
                      <div className="flex items-center gap-2">
                        {execSummary.effect === "Positivo" ? (
                          <TrendingUp className="h-4 w-4 text-emerald-600 shrink-0" />
                        ) : execSummary.effect === "Negativo" ? (
                          <TrendingDown className="h-4 w-4 text-rose-600 shrink-0" />
                        ) : (
                          <Minus className="h-4 w-4 text-amber-500 shrink-0" />
                        )}
                        <span className="text-sm font-bold text-slate-900">
                          {execSummary.effect}
                        </span>
                      </div>
                    </div>

                    {/* Coluna 2: TAMANHO */}
                    <div className="p-4 space-y-1.5">
                      <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        Tamanho
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1">
                          {[1, 2, 3].map((dot) => (
                            <span
                              key={dot}
                              className={cn(
                                "w-2.5 h-2.5 rounded-full",
                                dot <= execSummary.sizeDots
                                  ? "bg-slate-900"
                                  : "bg-slate-200"
                              )}
                            />
                          ))}
                        </div>
                        <span className="text-sm font-bold text-slate-900">
                          {execSummary.size}
                        </span>
                      </div>
                    </div>

                    {/* Coluna 3: CONFIANÇA */}
                    <div className="p-4 space-y-1.5">
                      <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        Confiança
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex items-end gap-0.5 h-3.5">
                          <span
                            className={cn(
                              "w-1 rounded-xs h-1.5",
                              execSummary.confidenceBars >= 1
                                ? "bg-slate-900"
                                : "bg-slate-200"
                            )}
                          />
                          <span
                            className={cn(
                              "w-1 rounded-xs h-2.5",
                              execSummary.confidenceBars >= 2
                                ? "bg-slate-900"
                                : "bg-slate-200"
                            )}
                          />
                          <span
                            className={cn(
                              "w-1 rounded-xs h-3.5",
                              execSummary.confidenceBars >= 3
                                ? "bg-slate-900"
                                : "bg-slate-200"
                            )}
                          />
                        </div>
                        <span className="text-sm font-bold text-slate-900">
                          {execSummary.confidence}
                        </span>
                      </div>
                    </div>

                    {/* Coluna 4: ESCALONAMENTO */}
                    <div className="p-4 space-y-1.5">
                      <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        Escalonamento
                      </div>
                      <div className="flex items-center gap-2">
                        <UserCheck className="h-4 w-4 text-indigo-600 shrink-0" />
                        <span className="text-sm font-bold text-slate-900">
                          {execSummary.escalation}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Parágrafo Narrativo de Síntese Executiva */}
                  <p className="text-sm text-slate-700 leading-relaxed">
                    {execSummary.narrativeParagraph}
                  </p>

                  {/* Grid Lado a Lado: BENEFÍCIOS vs RISCOS */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">
                    {/* Card BENEFÍCIOS */}
                    <div className="rounded-2xl border border-slate-200 bg-white p-5 space-y-4">
                      <div className="flex items-center gap-2 text-emerald-700">
                        <TrendingUp className="h-4 w-4" />
                        <h3 className="text-xs font-bold uppercase tracking-wider">
                          Benefícios
                        </h3>
                      </div>

                      <div className="space-y-3.5">
                        {execSummary.keyBenefitsSummary.map((bText, idx) => (
                          <div key={idx} className="flex items-start gap-3">
                            {/* Ícone de Barras de Força (Verde) */}
                            <div className="flex items-end gap-0.5 h-3.5 mt-1 shrink-0">
                              <span className="w-1 h-1.5 rounded-xs bg-emerald-500" />
                              <span className="w-1 h-2.5 rounded-xs bg-emerald-500" />
                              <span className="w-1 h-3.5 rounded-xs bg-emerald-500" />
                            </div>
                            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                              {bText}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Card RISCOS */}
                    <div className="rounded-2xl border border-slate-200 bg-white p-5 space-y-4">
                      <div className="flex items-center gap-2 text-amber-700">
                        <AlertTriangle className="h-4 w-4" />
                        <h3 className="text-xs font-bold uppercase tracking-wider">
                          Riscos
                        </h3>
                      </div>

                      <div className="space-y-3.5">
                        {execSummary.keyRisksSummary.map((rText, idx) => (
                          <div key={idx} className="flex items-start gap-3">
                            {/* Ícone de Barras de Força (Vermelho) */}
                            <div className="flex items-end gap-0.5 h-3.5 mt-1 shrink-0">
                              <span className="w-1 h-1.5 rounded-xs bg-rose-500" />
                              <span className="w-1 h-2.5 rounded-xs bg-rose-500" />
                              <span className="w-1 h-3.5 rounded-xs bg-rose-500" />
                            </div>
                            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                              {rText}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* =================================================================
                ABA 0B: MAPA DE RELAÇÕES SISTÊMICAS (GRAFO VISUAL CENTRALIZADO)
            ================================================================= */}
            {activeReportTab === "relationship_map" && (
              <div className="space-y-4">
                <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden flex flex-col">
                  {/* Cabeçalho do Mapa de Relações */}
                  <div className="px-6 py-4 border-b border-slate-100 flex flex-wrap items-center justify-between gap-4">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#ea580c]">
                        Topologia Sistêmica de Impactos · Versão {currentVersionNumber}
                      </span>
                      <h2 className="text-base font-bold text-slate-900">
                        Mapa de Relações: Regulação, Processos, Produtos, Reclamações & Indicadores
                      </h2>
                      <p className="text-xs text-slate-500">
                        Visão consolidada de todas as conexões geradas pela iniciativa na organização
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setActiveReportTab("executive_summary")}
                        className="px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-xs font-semibold text-slate-700 cursor-pointer"
                      >
                        Ver Resumo Executivo
                      </button>
                      <button
                        type="button"
                        onClick={() => openCommitteeForArea()}
                        className="px-3.5 py-1.5 rounded-lg bg-[#ea580c] hover:bg-[#c2410c] text-white text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                      >
                        <Users className="h-3.5 w-3.5" />
                        <span>Discutir na Mesa Redonda</span>
                      </button>
                    </div>
                  </div>

                  {/* Canvas Pontilhado do Grafo de Relações */}
                  <div
                    className="relative overflow-x-auto p-6 sm:p-8 min-h-[680px] flex flex-col justify-between"
                    style={{
                      backgroundColor: "#ffffff",
                      backgroundImage:
                        "radial-gradient(#cbd5e1 1px, transparent 1px)",
                      backgroundSize: "18px 18px",
                    }}
                  >
                    <div
                      className="min-w-[1040px] mx-auto transition-transform origin-top"
                      style={{ transform: `scale(${mapZoom})` }}
                    >
                      {/* =======================================================
                          BLOCO SUPERIOR: 4 COLUNAS DE ENTRADA / ENTIDADES AFETADAS
                          (Folhas no topo -> Categoria abaixo -> Linha até o Nó Central)
                      ======================================================= */}
                      <div className="grid grid-cols-4 gap-5 items-end">
                        {relationshipMap.topBranches.map((branch) => {
                          const theme = getBranchThemeClasses(branch.colorTheme);
                          return (
                            <div
                              key={branch.id}
                              className="flex flex-col items-center"
                            >
                              {/* Lista de Nós Folha Empilhados Acima da Categoria */}
                              <div className="w-full space-y-2">
                                {branch.items.map((item) => (
                                  <div
                                    key={item.id}
                                    className={cn(
                                      "relative bg-white rounded-lg border px-3 py-2 shadow-2xs transition-all",
                                      theme.leafBorder
                                    )}
                                  >
                                    <div className="flex items-start justify-between gap-1.5">
                                      <span className="text-[11px] font-medium text-slate-800 leading-snug">
                                        {item.label}
                                      </span>
                                      {item.code && (
                                        <span className="text-[9px] font-bold text-slate-400 shrink-0">
                                          {item.code}
                                        </span>
                                      )}
                                    </div>
                                    {item.detail && (
                                      <div className="text-[10px] text-slate-400 mt-0.5 truncate">
                                        {item.detail}
                                      </div>
                                    )}
                                  </div>
                                ))}
                              </div>

                              {/* Conector Vertical Folhas -> Nó de Categoria */}
                              <div className="w-0.5 h-3 bg-slate-300" />

                              {/* Nó da Categoria Superior (Regulação, Processos, Produtos, Reclamações) */}
                              <div
                                className={cn(
                                  "w-full rounded-xl border-2 px-3 py-2.5 text-center shadow-xs",
                                  theme.categoryCard
                                )}
                              >
                                <span className="text-xs font-bold">
                                  {branch.title}
                                </span>
                              </div>

                              {/* Haste Vertical Descendo para o Barramento Central */}
                              <div className="w-0.5 h-6 bg-slate-400" />
                            </div>
                          );
                        })}
                      </div>

                      {/* =======================================================
                          BARRAMENTO SUPERIOR -> NÓ CENTRAL AZUL -> BARRAMENTO INFERIOR
                      ======================================================= */}
                      <div className="flex flex-col items-center">
                        {/* Linha Horizontal Superior que conecta as 4 colunas de cima */}
                        <div className="w-[76%] h-0.5 bg-slate-400" />
                        <div className="w-0.5 h-5 bg-slate-400" />

                        {/* NÓ CENTRAL (A INICIATIVA / MUDANÇA SIMULADA) */}
                        <div className="max-w-sm w-full rounded-2xl bg-[#1d4ed8] text-white px-6 py-4 text-center shadow-lg border-2 border-blue-700">
                          <div className="text-xs sm:text-sm font-bold leading-snug">
                            {relationshipMap.centralNodeLabel}
                          </div>
                        </div>

                        {/* Haste Vertical Descendo do Nó Central para as Métricas */}
                        <div className="w-0.5 h-5 bg-emerald-600" />
                        {/* Linha Horizontal Inferior que distribui para as 4 categorias de indicadores */}
                        <div className="w-[76%] h-0.5 bg-slate-400" />
                      </div>

                      {/* =======================================================
                          BLOCO INFERIOR: 4 COLUNAS DE INDICADORES & MÉTRICAS
                          (Linha colorida -> Categoria -> Folhas de Indicadores abaixo)
                      ======================================================= */}
                      <div className="grid grid-cols-4 gap-5 items-start">
                        {relationshipMap.bottomBranches.map((branch) => {
                          const theme = getBranchThemeClasses(branch.colorTheme);
                          const connectorColor =
                            branch.branchDirection === "positivo"
                              ? "bg-emerald-600"
                              : branch.branchDirection === "negativo"
                                ? "bg-rose-600"
                                : "bg-slate-400";

                          return (
                            <div
                              key={branch.id}
                              className="flex flex-col items-center"
                            >
                              {/* Haste Vertical Colorida pelo Sentido do Impacto */}
                              <div className={cn("w-0.5 h-6", connectorColor)} />

                              {/* Nó da Categoria Inferior (Voice of Customer, Voice of Employee, etc.) */}
                              <div
                                className={cn(
                                  "w-full rounded-xl border-2 px-3 py-2.5 text-center shadow-xs",
                                  theme.categoryCard
                                )}
                              >
                                <span className="text-xs font-bold">
                                  {branch.title}
                                </span>
                              </div>

                              {/* Conector Categoria -> Lista de Indicadores */}
                              <div className="w-0.5 h-3 bg-slate-300" />

                              {/* Lista de Indicadores da Categoria */}
                              <div className="w-full space-y-2">
                                {branch.items.map((item) => {
                                  const dirBadge =
                                    item.direction === "positivo"
                                      ? "text-emerald-700 bg-emerald-50 border-emerald-200"
                                      : item.direction === "negativo"
                                        ? "text-rose-700 bg-rose-50 border-rose-200"
                                        : "text-slate-600 bg-slate-50 border-slate-200";
                                  return (
                                    <div
                                      key={item.id}
                                      className={cn(
                                        "bg-white rounded-lg border px-3 py-2 shadow-2xs transition-all",
                                        theme.leafBorder
                                      )}
                                    >
                                      <div className="flex items-start justify-between gap-1.5">
                                        <span className="text-[11px] font-medium text-slate-800 leading-snug">
                                          {item.label}
                                        </span>
                                      </div>
                                      {item.delta && (
                                        <div className="mt-1 flex items-center justify-between gap-1">
                                          <span
                                            className={cn(
                                              "px-1.5 py-0.2 rounded text-[9px] font-semibold border",
                                              dirBadge
                                            )}
                                          >
                                            {item.delta}
                                          </span>
                                          {item.confidence && (
                                            <span className="text-[9px] text-slate-400">
                                              Conf. {item.confidence}
                                            </span>
                                          )}
                                        </div>
                                      )}
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Controles Flutuantes de Zoom (Canto Inferior Esquerdo como na Referência) */}
                    <div className="sticky bottom-4 left-4 mt-6 inline-flex flex-col rounded-xl border border-slate-200 bg-white shadow-md overflow-hidden w-9">
                      <button
                        type="button"
                        onClick={() =>
                          setMapZoom((z) => Math.min(1.15, Number((z + 0.08).toFixed(2))))
                        }
                        title="Aumentar Zoom"
                        className="h-9 flex items-center justify-center text-slate-700 hover:bg-slate-100 border-b border-slate-100 cursor-pointer"
                      >
                        <ZoomIn className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          setMapZoom((z) => Math.max(0.75, Number((z - 0.08).toFixed(2))))
                        }
                        title="Reduzir Zoom"
                        className="h-9 flex items-center justify-center text-slate-700 hover:bg-slate-100 border-b border-slate-100 cursor-pointer"
                      >
                        <ZoomOut className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setMapZoom(1)}
                        title="Resetar Escala (100%)"
                        className="h-9 flex items-center justify-center text-slate-700 hover:bg-slate-100 cursor-pointer"
                      >
                        <Maximize2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Rodapé com Legenda de INDICADORES e CONFIANÇA (Idêntico à Referência) */}
                  <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-4 text-xs">
                    <div className="flex flex-wrap items-center gap-6">
                      {/* Legenda INDICADORES */}
                      <div className="flex items-center gap-3">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                          Indicadores
                        </span>
                        <span className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-700">
                          <span className="w-4 h-0.5 bg-emerald-600 rounded-full" />
                          <span>Positivo</span>
                        </span>
                        <span className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-700">
                          <span className="w-4 h-0.5 bg-rose-600 rounded-full" />
                          <span>Negativo</span>
                        </span>
                        <span className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-700">
                          <span className="w-4 h-0.5 bg-slate-400 rounded-full" />
                          <span>Incerto</span>
                        </span>
                      </div>

                      {/* Legenda CONFIANÇA */}
                      <div className="flex items-center gap-3">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                          Confiança
                        </span>
                        <span className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-700">
                          <span className="w-4 h-1 bg-slate-700 rounded-full" />
                          <span>Forte</span>
                        </span>
                        <span className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-700">
                          <span className="w-4 h-0.5 bg-slate-500 rounded-full" />
                          <span>Média</span>
                        </span>
                        <span className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-700">
                          <span className="w-4 h-px bg-slate-300 rounded-full" />
                          <span>Fraca</span>
                        </span>
                      </div>
                    </div>

                    <span className="text-[11px] text-slate-400">
                      Zoom: {Math.round(mapZoom * 100)}%
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* =================================================================
                ABA 1: DETALHAMENTO DA MUDANÇA, REGRAS & POLÍTICAS
            ================================================================= */}
            {activeReportTab === "change_details" && (
              <div className="space-y-6">
                {/* 1.1 Diagnóstico Geral e Diretriz Completa desta Versão */}
                <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs space-y-5">
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div>
                      <h2 className="text-base font-bold text-slate-900">
                        Especificação da Mudança & Regras Operacionais (v{currentVersionNumber})
                      </h2>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Síntese executiva da diretriz e detalhamento dos parâmetros por área
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => openCommitteeForArea()}
                      className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-[#ea580c] text-white text-xs font-semibold flex items-center gap-2 transition-colors cursor-pointer"
                    >
                      <Users className="h-3.5 w-3.5" />
                      <span>Negociar na Mesa Redonda</span>
                    </button>
                  </div>

                  {/* Redação Consolidada da Proposta na Versão Atual */}
                  <div className="rounded-xl bg-slate-50 border border-slate-200/90 p-4 space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-semibold text-slate-500">
                        Diretriz Consolidada · Versão {currentVersionNumber}
                      </span>
                      {currentVersionNumber > 1 && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-100 text-emerald-800">
                          Atualizada após Mesa Redonda
                        </span>
                      )}
                    </div>
                    <p className="text-sm font-semibold text-slate-900 leading-relaxed">
                      {currentAnalysis.proposedDirectiveToBe}
                    </p>
                    <p className="text-xs text-slate-600 leading-relaxed pt-2 border-t border-slate-200/70">
                      {currentAnalysis.executiveSummary}
                    </p>
                  </div>

                  {/* Painel de Evolução de Negociação (Cláusulas das Áreas na Mesa Redonda) */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                        Detalhamento das Regras Operacionais e Condicionantes por Área
                      </h3>
                      <span className="text-xs text-slate-500">
                        {acceptedNegotiationItems.length} aceita(s) ·{" "}
                        {rejectedNegotiationItems.length} negada(s) ·{" "}
                        {pendingNegotiationItems.length} pendente(s)
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {structuredChangeDimensions.map((dim, idx) => (
                        <div
                          key={idx}
                          className={cn(
                            "rounded-xl border p-4 space-y-2.5",
                            dim.isCalibrated
                              ? "bg-emerald-50/30 border-emerald-200"
                              : "bg-slate-50/70 border-slate-200"
                          )}
                        >
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-xs font-bold text-slate-900">
                              {dim.category}
                            </span>
                            <span
                              className={cn(
                                "px-2 py-0.5 rounded-full text-[10px] font-bold",
                                dim.isCalibrated
                                  ? "bg-emerald-100 text-emerald-800"
                                  : "bg-amber-100 text-amber-800"
                              )}
                            >
                              {dim.status}
                            </span>
                          </div>

                          <div className="space-y-1.5 text-xs">
                            <div className="text-slate-500">
                              <strong className="text-slate-700">Escopo / Base: </strong>
                              {dim.currentBaseline}
                            </div>
                            <div className="text-slate-800 font-medium bg-white p-2.5 rounded-lg border border-slate-200/80">
                              <strong className="text-[#ea580c]">
                                Detalhe da Mudança:{" "}
                              </strong>
                              {dim.proposedSpecification}
                            </div>
                            <div className="text-[11px] text-slate-500 leading-relaxed">
                              {dim.technicalDetails}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* 1.2 Políticas Internas, Normativos e Regulação Impactados */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-base font-bold text-slate-900">
                        Políticas Internas, Regras e Normas Impactadas pela Mudança
                      </h3>
                      <p className="text-xs text-slate-500">
                        Cruzamento cláusula a cláusula do que precisa ser alterado nas políticas da empresa para viabilizar a mudança
                      </p>
                    </div>
                  </div>

                  {currentAnalysis.policiesImpacted.map((pol) => {
                    const isBlocked = pol.severity === "bloqueio_legal";
                    const isHigh = pol.severity === "conflito_alto";
                    const isAligned = pol.severity === "alinhado";

                    return (
                      <div
                        key={pol.id}
                        className={cn(
                          "bg-white rounded-2xl border p-5 shadow-2xs space-y-4",
                          isBlocked
                            ? "border-rose-300"
                            : isHigh
                              ? "border-amber-300"
                              : isAligned
                                ? "border-emerald-300"
                                : "border-slate-200"
                        )}
                      >
                        <div className="flex flex-wrap items-start justify-between gap-3">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="px-2 py-0.5 rounded text-xs font-bold bg-slate-900 text-white">
                                {pol.code}
                              </span>
                              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-slate-100 text-slate-700">
                                {pol.originLabel}
                              </span>
                              <span className="text-xs font-semibold text-slate-500">
                                {pol.clauseAffected}
                              </span>
                            </div>
                            <h4 className="text-sm font-bold text-slate-900">
                              {pol.title}
                            </h4>
                          </div>

                          <span
                            className={cn(
                              "px-3 py-1 rounded-full text-xs font-bold border",
                              isBlocked
                                ? "bg-rose-50 text-rose-700 border-rose-200"
                                : isHigh
                                  ? "bg-amber-50 text-amber-800 border-amber-200"
                                  : isAligned
                                    ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                    : "bg-blue-50 text-blue-700 border-blue-200"
                            )}
                          >
                            {isBlocked
                              ? "Bloqueio Regulatório / Legal"
                              : isHigh
                                ? "Conflito Alto de Política"
                                : isAligned
                                  ? `Equacionado na v${currentVersionNumber}`
                                  : "Revisão de Política Necessária"}
                          </span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                          <div className="rounded-xl bg-slate-50 p-3.5 border border-slate-200/70 space-y-1">
                            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                              Texto Atual da Norma / Política
                            </div>
                            <p className="text-slate-700 leading-relaxed">
                              {pol.currentRuleText}
                            </p>
                          </div>

                          <div
                            className={cn(
                              "rounded-xl p-3.5 border space-y-1",
                              isAligned
                                ? "bg-emerald-50/40 border-emerald-200"
                                : "bg-rose-50/40 border-rose-200/70"
                            )}
                          >
                            <div
                              className={cn(
                                "text-[10px] font-bold uppercase tracking-wider",
                                isAligned ? "text-emerald-700" : "text-rose-700"
                              )}
                            >
                              Impacto da Mudança Proposta
                            </div>
                            <p className="text-slate-800 leading-relaxed">
                              {pol.conflictExplanation}
                            </p>
                          </div>

                          <div className="rounded-xl bg-indigo-50/40 p-3.5 border border-indigo-200/70 space-y-1">
                            <div className="text-[10px] font-bold uppercase tracking-wider text-indigo-700">
                              Mudança / Aditivo Necessário na Regra
                            </div>
                            <p className="text-slate-800 font-medium leading-relaxed">
                              {pol.requiredAdjustment}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* =================================================================
                ABA 2: MAPA MENTAL / ÁRVORE DE INDICADORES POR ÁREA
                (Mudança Central ──► Áreas ──► Indicadores Positivos / Negativos)
            ================================================================= */}
            {activeReportTab === "indicators_map" && (
              <div className="space-y-6">
                {/* Header & Filtros do Mapa de Indicadores */}
                <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs flex flex-wrap items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-indigo-50 text-indigo-700 border border-indigo-200">
                        Árvore de Impacto em Indicadores
                      </span>
                      <span className="text-xs text-slate-500">
                        Mudança Proposta → Áreas Impactadas → Indicadores (+ Positivos vs. - Negativos)
                      </span>
                    </div>
                    <h2 className="text-base font-bold text-slate-900">
                      Mapa Mental de Indicadores por Área (Versão {currentVersionNumber})
                    </h2>
                  </div>

                  {/* Filtro rápido por área */}
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <button
                      type="button"
                      onClick={() => setSelectedIndicatorAreaFilter("all")}
                      className={cn(
                        "px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer border",
                        selectedIndicatorAreaFilter === "all"
                          ? "bg-slate-900 text-white border-slate-900"
                          : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"
                      )}
                    >
                      Todas as Áreas ({indicatorAreasMap.length})
                    </button>
                    {indicatorAreasMap.map(({ rep }) => (
                      <button
                        key={rep.id}
                        type="button"
                        onClick={() => setSelectedIndicatorAreaFilter(rep.id)}
                        className={cn(
                          "px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer border flex items-center gap-1.5",
                          selectedIndicatorAreaFilter === rep.id
                            ? "bg-slate-900 text-white border-slate-900"
                            : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                        )}
                      >
                        <span
                          className="w-2 h-2 rounded-full"
                          style={{ backgroundColor: rep.avatarColor }}
                        />
                        <span>{rep.shortArea}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* CANVAS DO MAPA MENTAL (ÁRVORE VISUAL) */}
                <div
                  className="bg-white rounded-3xl border border-slate-200 p-6 lg:p-8 shadow-xs overflow-x-auto"
                  style={{
                    backgroundImage:
                      "radial-gradient(#cbd5e1 1px, transparent 1px)",
                    backgroundSize: "18px 18px",
                  }}
                >
                  <div className="min-w-[860px] flex items-center gap-0">
                    {/* NÓ RAIZ (ESQUERDA): A MUDANÇA INICIADA */}
                    <div className="w-[250px] shrink-0 bg-slate-900 text-white rounded-2xl p-5 shadow-lg border-2 border-[#ea580c] relative z-10 space-y-3">
                      <div className="flex items-center justify-between gap-2">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-[#ea580c] text-white">
                          Mudança · v{currentVersionNumber}
                        </span>
                        <span className="text-[11px] font-bold text-orange-300">
                          Risco {currentAnalysis.overallRiskScore}/100
                        </span>
                      </div>
                      <h3 className="text-sm font-bold leading-snug text-white">
                        {currentAnalysis.title}
                      </h3>
                      <p className="text-[11px] text-slate-300 line-clamp-3 leading-relaxed">
                        {currentAnalysis.proposedDirectiveToBe}
                      </p>
                      <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[11px]">
                        <span className="text-emerald-400 font-bold">
                          +{positiveIndicators.length} Positivos
                        </span>
                        <span className="text-rose-400 font-bold">
                          -{negativeIndicators.length} Negativos
                        </span>
                      </div>
                    </div>

                    {/* CONECTOR TRONCO RAIZ -> RAMOS DAS ÁREAS */}
                    <div className="w-10 shrink-0 flex items-center justify-center">
                      <div className="w-full h-0.5 bg-slate-400" />
                    </div>

                    {/* COLUNA DE RAMOS POR ÁREA + FOLHAS DE INDICADORES */}
                    <div className="flex-1 space-y-6 border-l-2 border-slate-300 pl-8 py-2">
                      {indicatorAreasMap
                        .filter(
                          (g) =>
                            selectedIndicatorAreaFilter === "all" ||
                            g.rep.id === selectedIndicatorAreaFilter
                        )
                        .map(({ rep, indicators }) => {
                          const posCount = indicators.filter(
                            (i) => i.direction === "positivo"
                          ).length;
                          const negCount = indicators.filter(
                            (i) => i.direction === "negativo"
                          ).length;

                          return (
                            <div
                              key={rep.id}
                              className="flex items-center gap-0 relative"
                            >
                              {/* Conector horizontal do tronco para a Área */}
                              <div className="absolute -left-8 top-1/2 -translate-y-1/2 w-8 h-0.5 bg-slate-300" />
                              <div
                                className="absolute -left-[35px] top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full border-2 border-white"
                                style={{ backgroundColor: rep.avatarColor }}
                              />

                              {/* NÓ DA ÁREA (NÍVEL 1 DA ÁRVORE) */}
                              <div className="w-[230px] shrink-0 bg-white rounded-2xl border-2 border-slate-200 p-4 shadow-sm space-y-2.5 relative z-10">
                                <div className="flex items-center gap-2.5">
                                  <span
                                    className="w-9 h-9 rounded-xl text-white font-bold text-xs flex items-center justify-center shrink-0"
                                    style={{ backgroundColor: rep.avatarColor }}
                                  >
                                    {rep.avatarInitials}
                                  </span>
                                  <div className="min-w-0">
                                    <div className="text-xs font-bold text-slate-900 truncate">
                                      {rep.shortArea}
                                    </div>
                                    <div className="text-[10px] text-slate-500 truncate">
                                      {rep.agentName}
                                    </div>
                                  </div>
                                </div>

                                <div className="flex items-center gap-1.5 text-[10px] font-bold">
                                  {posCount > 0 && (
                                    <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200">
                                      +{posCount} Positivo{posCount > 1 ? "s" : ""}
                                    </span>
                                  )}
                                  {negCount > 0 && (
                                    <span className="px-2 py-0.5 rounded-md bg-rose-50 text-rose-700 border border-rose-200">
                                      -{negCount} Negativo{negCount > 1 ? "s" : ""}
                                    </span>
                                  )}
                                </div>
                              </div>

                              {/* Conector da Área para os seus Indicadores */}
                              <div className="w-8 shrink-0 flex items-center">
                                <div className="w-full h-0.5 bg-slate-300" />
                              </div>

                              {/* NÓS DOS INDICADORES DAQUELA ÁREA (NÍVEL 2 DA ÁRVORE) */}
                              <div className="flex-1 space-y-3 border-l-2 border-slate-200 pl-6 py-1">
                                {indicators.map((ind) => {
                                  const isPositive = ind.direction === "positivo";
                                  const isMitigated =
                                    !isPositive &&
                                    (ind.deltaLabel
                                      .toLowerCase()
                                      .includes("mitigado") ||
                                      ind.deltaLabel
                                        .toLowerCase()
                                        .includes("reduzido"));

                                  return (
                                    <div
                                      key={ind.id}
                                      className={cn(
                                        "relative rounded-2xl border p-4 bg-white shadow-2xs transition-all",
                                        isPositive
                                          ? "border-emerald-300 bg-emerald-50/20"
                                          : isMitigated
                                            ? "border-amber-300 bg-amber-50/20"
                                            : "border-rose-300 bg-rose-50/20"
                                      )}
                                    >
                                      {/* Linha horizontal conectando ao indicador */}
                                      <div
                                        className={cn(
                                          "absolute -left-6 top-1/2 -translate-y-1/2 w-6 h-0.5",
                                          isPositive
                                            ? "bg-emerald-400"
                                            : isMitigated
                                              ? "bg-amber-400"
                                              : "bg-rose-400"
                                        )}
                                      />

                                      <div className="flex flex-wrap items-start justify-between gap-2">
                                        <div className="space-y-0.5">
                                          <div className="flex items-center gap-2">
                                            <span
                                              className={cn(
                                                "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold border",
                                                isPositive
                                                  ? "bg-emerald-100 text-emerald-800 border-emerald-300"
                                                  : isMitigated
                                                    ? "bg-amber-100 text-amber-800 border-amber-300"
                                                    : "bg-rose-100 text-rose-800 border-rose-300"
                                              )}
                                            >
                                              {isPositive ? (
                                                <>
                                                  <TrendingUp className="h-3 w-3" />
                                                  <span>Impacto Positivo (+)</span>
                                                </>
                                              ) : (
                                                <>
                                                  <TrendingDown className="h-3 w-3" />
                                                  <span>
                                                    {isMitigated
                                                      ? "Impacto Negativo Mitigado"
                                                      : "Impacto Negativo (-)"}
                                                  </span>
                                                </>
                                              )}
                                            </span>
                                            <span className="text-[11px] font-bold text-slate-400">
                                              {ind.code}
                                            </span>
                                          </div>
                                          <h4 className="text-sm font-bold text-slate-900">
                                            {ind.name}
                                          </h4>
                                        </div>

                                        {/* Projeção Numérica */}
                                        <div className="text-right">
                                          <div className="flex items-center gap-1.5 text-xs font-bold">
                                            <span className="text-slate-400 line-through">
                                              {ind.currentValue}
                                            </span>
                                            <ArrowRight className="h-3 w-3 text-slate-400" />
                                            <span
                                              className={cn(
                                                isPositive
                                                  ? "text-emerald-700"
                                                  : isMitigated
                                                    ? "text-amber-700"
                                                    : "text-rose-700"
                                              )}
                                            >
                                              {ind.projectedValue}
                                            </span>
                                          </div>
                                          <span
                                            className={cn(
                                              "inline-block mt-0.5 px-2 py-0.5 rounded text-[10px] font-bold",
                                              isPositive
                                                ? "bg-emerald-100/80 text-emerald-800"
                                                : isMitigated
                                                  ? "bg-amber-100/80 text-amber-900"
                                                  : "bg-rose-100/80 text-rose-800"
                                            )}
                                          >
                                            {ind.deltaLabel}
                                          </span>
                                        </div>
                                      </div>

                                      <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                                        {ind.rationale}
                                      </p>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          );
                        })}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* =================================================================
                ABA 3: MAPA MENTAL / ÁRVORE DE PROCESSOS POR ÁREA
                (Mudança Central ──► Áreas ──► Processos Impactados & Regras)
            ================================================================= */}
            {activeReportTab === "processes_map" && (
              <div className="space-y-6">
                {/* Header & Filtros do Mapa de Processos */}
                <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs flex flex-wrap items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-orange-50 text-[#ea580c] border border-orange-200">
                        Árvore de Processos Impactados
                      </span>
                      <span className="text-xs text-slate-500">
                        Mudança Proposta → Áreas Envolvidas → Processos, Sistemas e Regras de Negócio
                      </span>
                    </div>
                    <h2 className="text-base font-bold text-slate-900">
                      Mapa Mental de Processos por Área (Versão {currentVersionNumber})
                    </h2>
                  </div>

                  {/* Filtro rápido por área */}
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <button
                      type="button"
                      onClick={() => setSelectedProcessAreaFilter("all")}
                      className={cn(
                        "px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer border",
                        selectedProcessAreaFilter === "all"
                          ? "bg-slate-900 text-white border-slate-900"
                          : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"
                      )}
                    >
                      Todas as Áreas ({processAreasMap.length})
                    </button>
                    {processAreasMap.map(({ rep }) => (
                      <button
                        key={rep.id}
                        type="button"
                        onClick={() => setSelectedProcessAreaFilter(rep.id)}
                        className={cn(
                          "px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer border flex items-center gap-1.5",
                          selectedProcessAreaFilter === rep.id
                            ? "bg-slate-900 text-white border-slate-900"
                            : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                        )}
                      >
                        <span
                          className="w-2 h-2 rounded-full"
                          style={{ backgroundColor: rep.avatarColor }}
                        />
                        <span>{rep.shortArea}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* CANVAS DO MAPA MENTAL DE PROCESSOS */}
                <div
                  className="bg-white rounded-3xl border border-slate-200 p-6 lg:p-8 shadow-xs overflow-x-auto"
                  style={{
                    backgroundImage:
                      "radial-gradient(#cbd5e1 1px, transparent 1px)",
                    backgroundSize: "18px 18px",
                  }}
                >
                  <div className="min-w-[860px] flex items-center gap-0">
                    {/* NÓ RAIZ (ESQUERDA): A MUDANÇA PROPOSTA */}
                    <div className="w-[250px] shrink-0 bg-slate-900 text-white rounded-2xl p-5 shadow-lg border-2 border-[#ea580c] relative z-10 space-y-3">
                      <div className="flex items-center justify-between gap-2">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-[#ea580c] text-white">
                          Cadeia de Valor · v{currentVersionNumber}
                        </span>
                      </div>
                      <h3 className="text-sm font-bold leading-snug text-white">
                        {currentAnalysis.title}
                      </h3>
                      <p className="text-[11px] text-slate-300 leading-relaxed">
                        Mapeamento de como a diretriz proposta altera fluxos, atividades, regras de negócio e integrações em cada área.
                      </p>
                      <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-300">
                        <span>
                          <strong className="text-white">
                            {currentAnalysis.areasAndCommittee.length}
                          </strong>{" "}
                          Áreas
                        </span>
                        <span>
                          <strong className="text-orange-400">
                            {processAreasMap.reduce(
                              (acc, g) => acc + g.processes.length,
                              0
                            )}
                          </strong>{" "}
                          Processos
                        </span>
                      </div>
                    </div>

                    {/* CONECTOR TRONCO RAIZ -> ÁREAS */}
                    <div className="w-10 shrink-0 flex items-center justify-center">
                      <div className="w-full h-0.5 bg-slate-400" />
                    </div>

                    {/* RAMOS DE ÁREAS -> PROCESSOS */}
                    <div className="flex-1 space-y-6 border-l-2 border-slate-300 pl-8 py-2">
                      {processAreasMap
                        .filter(
                          (g) =>
                            selectedProcessAreaFilter === "all" ||
                            g.rep.id === selectedProcessAreaFilter
                        )
                        .map(({ rep, processes }) => {
                          const st = getStanceBadge(rep.stance);
                          return (
                            <div
                              key={rep.id}
                              className="flex items-center gap-0 relative"
                            >
                              {/* Conector horizontal do tronco para a Área */}
                              <div className="absolute -left-8 top-1/2 -translate-y-1/2 w-8 h-0.5 bg-slate-300" />
                              <div
                                className="absolute -left-[35px] top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full border-2 border-white"
                                style={{ backgroundColor: rep.avatarColor }}
                              />

                              {/* NÓ DA ÁREA (NÍVEL 1) */}
                              <div className="w-[240px] shrink-0 bg-white rounded-2xl border-2 border-slate-200 p-4 shadow-sm space-y-2.5 relative z-10">
                                <div className="flex items-center gap-2.5">
                                  <span
                                    className="w-9 h-9 rounded-xl text-white font-bold text-xs flex items-center justify-center shrink-0"
                                    style={{ backgroundColor: rep.avatarColor }}
                                  >
                                    {rep.avatarInitials}
                                  </span>
                                  <div className="min-w-0">
                                    <div className="text-xs font-bold text-slate-900 truncate">
                                      {rep.shortArea}
                                    </div>
                                    <div className="text-[10px] text-slate-500 truncate">
                                      Papel RACI: {rep.raciRole}
                                    </div>
                                  </div>
                                </div>

                                <div className="flex items-center justify-between gap-1.5">
                                  <span
                                    className={`px-2 py-0.5 rounded-md text-[10px] font-bold border ${st.bg}`}
                                  >
                                    {st.label}
                                  </span>
                                  <span className="text-[10px] font-semibold text-slate-500">
                                    Impacto {rep.impactLevel}
                                  </span>
                                </div>

                                {/* Sistemas da Área */}
                                <div className="flex flex-wrap gap-1 pt-1 border-t border-slate-100">
                                  {rep.affectedSystems.map((sys) => (
                                    <span
                                      key={sys}
                                      className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-slate-100 text-[10px] text-slate-600 font-medium"
                                    >
                                      <Monitor className="h-2.5 w-2.5 text-slate-400" />
                                      <span>{sys}</span>
                                    </span>
                                  ))}
                                </div>
                              </div>

                              {/* Conector da Área para seus Processos */}
                              <div className="w-8 shrink-0 flex items-center">
                                <div className="w-full h-0.5 bg-slate-300" />
                              </div>

                              {/* NÓS DOS PROCESSOS DAQUELA ÁREA (NÍVEL 2) */}
                              <div className="flex-1 space-y-3 border-l-2 border-slate-200 pl-6 py-1">
                                {processes.map((proc) => (
                                  <div
                                    key={proc.id}
                                    className="relative rounded-2xl border border-slate-200/90 hover:border-slate-300 p-4 bg-white shadow-2xs space-y-2.5"
                                  >
                                    {/* Conector horizontal para o processo */}
                                    <div
                                      className="absolute -left-6 top-1/2 -translate-y-1/2 w-6 h-0.5"
                                      style={{ backgroundColor: rep.avatarColor }}
                                    />

                                    <div className="flex flex-wrap items-start justify-between gap-2">
                                      <div className="space-y-0.5">
                                        <div className="flex items-center gap-2 flex-wrap">
                                          <span className="px-2 py-0.5 rounded text-xs font-bold bg-slate-900 text-white">
                                            {proc.code}
                                          </span>
                                          <span className="text-[11px] text-slate-400 font-medium">
                                            {proc.valueChainPath}
                                          </span>
                                        </div>
                                        <h4 className="text-sm font-bold text-slate-900">
                                          {proc.name}
                                        </h4>
                                      </div>

                                      {/* Regras de Negócio Afetadas no Processo */}
                                      <div className="flex flex-wrap gap-1">
                                        {proc.businessRulesAffected.map((rn) => (
                                          <span
                                            key={rn}
                                            className="px-2 py-0.5 rounded-md bg-orange-50 text-[#ea580c] border border-orange-200/70 text-[10px] font-bold"
                                          >
                                            {rn}
                                          </span>
                                        ))}
                                      </div>
                                    </div>

                                    <div className="rounded-xl bg-slate-50 border border-slate-200/60 p-3 text-xs text-slate-700 leading-relaxed">
                                      <strong className="text-slate-900">
                                        Como este processo é impactado:{" "}
                                      </strong>
                                      {proc.changeRequired}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          );
                        })}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* =====================================================================
          MODAL PARA INICIAR UMA NOVA SIMULAÇÃO DO ZERO
      ===================================================================== */}
      {isNewSimModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="max-w-xl w-full bg-white rounded-2xl border border-slate-200 p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-orange-50 text-[#ea580c]">
                  Nova Simulação (Versão 1)
                </span>
                <h3 className="text-base font-bold text-slate-900 mt-1">
                  Qual mudança na empresa você deseja simular?
                </h3>
              </div>
              <button
                onClick={() => setIsNewSimModalOpen(false)}
                className="w-8 h-8 rounded-lg hover:bg-slate-100 flex items-center justify-center text-slate-500 cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleCreateNewSimulation} className="space-y-4">
              <textarea
                rows={4}
                value={newPromptText}
                onChange={(e) => setNewPromptText(e.target.value)}
                placeholder="Ex: Reduzir a alçada de aprovação de compras de gerentes de R$ 50 mil para R$ 10 mil..."
                className="w-full rounded-xl border border-slate-300 p-3.5 text-xs text-slate-800 focus:outline-none focus:border-[#ea580c]"
              />
              <div className="flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsNewSimModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#ea580c] hover:bg-[#c2410c] text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                >
                  <Sparkles className="h-3.5 w-3.5" />
                  <span>Gerar Versão 1 (v1)</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
