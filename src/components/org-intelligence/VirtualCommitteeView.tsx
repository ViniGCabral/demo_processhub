import { useState, useRef, useEffect, useMemo } from "react";
import {
  Users,
  Send,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Scale,
  Handshake,
  Flame,
  ArrowLeft,
  MessageSquare,
  Check,
  CornerDownRight,
  Gavel,
  FileDiff,
  X,
  RefreshCw,
  ThumbsUp,
  ThumbsDown,
  Layers,
} from "lucide-react";
import { useOrgIntelligenceStore } from "@/stores/orgIntelligenceStore";
import { StanceStatus, CommitteeRepresentative } from "@/data/orgIntelligenceMockData";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

function getStanceConfig(stance: StanceStatus) {
  if (stance === "favoravel") {
    return {
      label: "Favorável",
      shortLabel: "Favorável",
      badgeClass: "bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-200",
      dotClass: "bg-emerald-500",
      borderClass: "border-l-emerald-500",
      ringClass: "ring-emerald-500",
      weight: 1,
    };
  }
  if (stance === "ressalvas") {
    return {
      label: "Com Ressalvas",
      shortLabel: "Ressalvas",
      badgeClass: "bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-200",
      dotClass: "bg-amber-500",
      borderClass: "border-l-amber-500",
      ringClass: "ring-amber-500",
      weight: 0.5,
    };
  }
  return {
    label: "Resistente / Veto",
    shortLabel: "Veto",
    badgeClass: "bg-rose-50 text-rose-700 ring-1 ring-inset ring-rose-200",
    dotClass: "bg-rose-500",
    borderClass: "border-l-rose-500",
    ringClass: "ring-rose-500",
    weight: 0,
  };
}

const HIGHLIGHT_CONFIG = {
  objecao: {
    label: "Objeção / Alerta",
    Icon: AlertTriangle,
    className: "bg-rose-50 border-rose-200 text-rose-900",
    iconClass: "text-rose-600",
  },
  concessao: {
    label: "Condicionante",
    Icon: Scale,
    className: "bg-amber-50 border-amber-200 text-amber-900",
    iconClass: "text-amber-600",
  },
  acordo: {
    label: "Acordo Incorporado",
    Icon: Handshake,
    className: "bg-emerald-50 border-emerald-200 text-emerald-900",
    iconClass: "text-emerald-600",
  },
} as const;

function BoardSeat({
  rep,
  isTarget,
  canRemove,
  onSelect,
  onRemove,
}: {
  rep: CommitteeRepresentative;
  isTarget: boolean;
  canRemove: boolean;
  onSelect: () => void;
  onRemove: (e: React.MouseEvent) => void;
}) {
  const cfg = getStanceConfig(rep.stance);
  const isPositiveImpact = rep.id === "rep-fin" || rep.id === "rep-fpa" || rep.id === "rep-comp";

  return (
    <div
      onClick={onSelect}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onSelect();
        }
      }}
      aria-pressed={isTarget}
      className={cn(
        "group relative min-w-[190px] flex-1 text-left rounded-xl border bg-white p-3 transition-all cursor-pointer",
        isTarget
          ? "border-[#ea580c] shadow-md ring-1 ring-[#ea580c]/30"
          : "border-slate-200 hover:border-slate-300 hover:shadow-2xs"
      )}
    >
      {canRemove && (
        <button
          type="button"
          onClick={onRemove}
          title={`Remover ${rep.shortArea} da Mesa Redonda`}
          className="opacity-0 group-hover:opacity-100 focus:opacity-100 absolute top-2 right-2 w-5 h-5 rounded-md bg-slate-100 hover:bg-rose-100 text-slate-400 hover:text-rose-600 flex items-center justify-center transition-all cursor-pointer"
        >
          <X className="h-3 w-3" />
        </button>
      )}

      <div className="flex items-start gap-2.5 pr-4">
        <div className="relative shrink-0">
          <span
            className="w-9 h-9 rounded-lg text-xs font-bold text-white flex items-center justify-center"
            style={{ backgroundColor: rep.avatarColor }}
          >
            {rep.avatarInitials}
          </span>
          <span
            className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white ${cfg.dotClass}`}
          />
        </div>
        <div className="min-w-0 flex-1">
          <div className="text-xs font-bold text-slate-900 truncate">{rep.shortArea}</div>
          <div className="text-[10px] text-slate-500 truncate">{rep.agentName}</div>
        </div>
      </div>
      <div className="mt-2.5 flex items-center justify-between gap-1.5">
        <span className={`px-1.5 py-0.5 rounded-md text-[10px] font-semibold ${cfg.badgeClass}`}>
          {cfg.shortLabel}
        </span>
        <span
          className={cn(
            "text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded",
            isPositiveImpact
              ? "bg-emerald-50 text-emerald-700"
              : "bg-rose-50 text-rose-700"
          )}
        >
          {isPositiveImpact ? "Impacto +" : "Impacto -"}
        </span>
      </div>
    </div>
  );
}

export function VirtualCommitteeView() {
  const {
    currentAnalysis,
    simulationSessions,
    activeSessionId,
    areaProfiles,
    committeeMessages,
    selectedTargetRepId,
    setSelectedTargetRepId,
    sendCommitteeMessage,
    triggerCommitteeRound,
    updateNegotiationDecision,
    updateDraftProposalText,
    reprocessSimulationFromRoundtable,
    addAreaToCommittee,
    removeAreaFromCommittee,
    setActiveModuleTab,
  } = useOrgIntelligenceStore();

  const [inputText, setInputText] = useState("");
  const [isManageAreasOpen, setIsManageAreasOpen] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const activeSession =
    simulationSessions.find((s) => s.id === activeSessionId) || simulationSessions[0];
  const negotiationItems = activeSession?.negotiationItems || [];
  const draftProposalText =
    activeSession?.draftProposalText || currentAnalysis.proposedDirectiveToBe;
  const nextVersionNumber = (activeSession?.versions.length || 1) + 1;

  const reps = currentAnalysis.areasAndCommittee;
  const targetRep = reps.find((r) => r.id === selectedTargetRepId);

  // Áreas disponíveis no ecossistema corporativo que ainda não estão na Mesa Redonda
  const availableAreasToAdd = useMemo(() => {
    return areaProfiles.filter(
      (area) =>
        !reps.some(
          (r) =>
            r.areaId === area.id ||
            r.shortArea.toLowerCase() === area.shortArea.toLowerCase() ||
            r.id === `rep-${area.id.replace("area-", "")}`
        )
    );
  }, [areaProfiles, reps]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [committeeMessages.length]);

  const handleSend = () => {
    if (!inputText.trim()) return;
    sendCommitteeMessage(inputText, selectedTargetRepId);
    setInputText("");
  };

  const negotiationStats = useMemo(() => {
    const accepted = negotiationItems.filter((i) => i.status === "accepted").length;
    const rejected = negotiationItems.filter((i) => i.status === "rejected").length;
    const pending = negotiationItems.filter((i) => i.status === "pending").length;
    const baseRisk = activeSession?.versions[0]?.analysis.overallRiskScore || currentAnalysis.overallRiskScore;
    const riskReduction = negotiationItems
      .filter((i) => i.status === "accepted")
      .reduce((acc, i) => acc + i.riskReductionDelta, 0);
    const projectedRisk = Math.max(22, baseRisk - riskReduction);
    return { accepted, rejected, pending, baseRisk, projectedRisk };
  }, [negotiationItems, activeSession, currentAnalysis.overallRiskScore]);

  const negotiationPrompts =
    currentAnalysis.id === "telecom-throttling-d1"
      ? [
          "Se aguardarmos 48h úteis para boletos, isentarmos bons pagadores e usarmos Aviso Interativo com Pix em D+1 sem reduzir a banda antes do prazo da Anatel, todos aprovam?",
          "Jurídico, qual é a saída legal para acionarmos o cliente em D+1 sem violar a Resolução 632 da Anatel?",
          "CX e TI, como garantimos que o cliente pague no digital sem ligar para o Suporte Técnico?",
        ]
      : currentAnalysis.id === "telecom-speed-400mb"
        ? [
            "Se fizermos o upgrade para 400MB em 3 ondas pelas OLTs com folga (<75%) e ativarmos diagnóstico Wi-Fi no App sem trocar ONT de toda a base, fechamos acordo?",
            "TI e Operações de Campo, como evitamos visitas técnicas improdutivas de clientes com roteador Wi-Fi legado?",
          ]
        : [
            "Se mantivermos alçada de R$ 50k para contratos guarda-chuva já homologados e aplicarmos R$ 10k apenas para compras Spot com trava anti-fracionamento, todos concordam?",
            "Operações, quais categorias de manutenção não podem esperar aprovação de Diretor?",
          ];

  return (
    <div className="flex flex-col h-[calc(100vh-64px)] bg-slate-50 overflow-hidden relative">
      {/* =====================================================================
          1. CABEÇALHO DA MESA REDONDA + ÁREAS ENVOLVIDAS
      ===================================================================== */}
      <header className="bg-white border-b border-slate-200 shrink-0">
        <div className="px-5 pt-3.5 pb-3 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-start gap-3 min-w-0">
            <button
              onClick={() => setActiveModuleTab("simulator")}
              className="mt-0.5 px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-1.5 cursor-pointer"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Voltar à Simulação (Versão {activeSession?.activeVersionNumber || 1})</span>
            </button>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-[#ea580c]">
                  <Gavel className="h-3 w-3" />
                  Mesa Redonda · Negociação com Áreas Impactadas
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700 flex items-center gap-1">
                  <Layers className="h-3 w-3 text-slate-500" />
                  Versão Atual: v{activeSession?.activeVersionNumber || 1}
                </span>
              </div>
              <h2 className="text-sm font-bold text-slate-900 mt-0.5 line-clamp-1">
                {currentAnalysis.title}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              type="button"
              onClick={() => setIsManageAreasOpen(true)}
              className="h-9 px-3 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700 flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Users className="h-3.5 w-3.5 text-[#ea580c]" />
              <span>Gerenciar Áreas ({reps.length})</span>
            </button>

            <button
              onClick={() => {
                triggerCommitteeRound("clash");
                toast.info("Debate cruzado entre as áreas iniciado!");
              }}
              className="h-9 px-3 rounded-lg border border-slate-200 bg-white hover:bg-amber-50 hover:border-amber-300 text-xs font-semibold text-slate-700 flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Flame className="h-4 w-4 text-amber-500" />
              <span>Debater Divergências</span>
            </button>

            <button
              onClick={() => {
                reprocessSimulationFromRoundtable();
                toast.success(`Gerando Versão ${nextVersionNumber} (v${nextVersionNumber}) da simulação após negociação!`);
              }}
              className="h-9 px-4 rounded-lg bg-[#ea580c] hover:bg-[#c2410c] text-xs font-bold text-white flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              <span>Gerar Versão {nextVersionNumber} da Simulação (v{nextVersionNumber})</span>
            </button>
          </div>
        </div>

        {/* Assentos das Áreas Impactadas + Botão Adicionar Área */}
        <div className="px-5 pb-3">
          <div className="flex gap-2 overflow-x-auto pb-1 items-stretch">
            <button
              onClick={() => setSelectedTargetRepId("all")}
              className={cn(
                "min-w-[140px] rounded-xl border p-3 text-left transition-all cursor-pointer shrink-0",
                selectedTargetRepId === "all"
                  ? "border-[#ea580c] bg-orange-50/60 shadow-sm ring-1 ring-[#ea580c]/30"
                  : "border-dashed border-slate-300 bg-slate-50 hover:bg-white"
              )}
            >
              <span className="w-8 h-8 rounded-lg bg-slate-900 text-white flex items-center justify-center">
                <Users className="h-4 w-4" />
              </span>
              <div className="mt-2 text-xs font-bold text-slate-900">Toda a Mesa</div>
              <div className="text-[10px] text-slate-500">{reps.length} áreas na discussão</div>
            </button>

            {reps.map((rep) => (
              <BoardSeat
                key={rep.id}
                rep={rep}
                isTarget={selectedTargetRepId === rep.id}
                canRemove={reps.length > 1}
                onSelect={() => setSelectedTargetRepId(rep.id)}
                onRemove={(e) => {
                  e.stopPropagation();
                  removeAreaFromCommittee(rep.id);
                  toast.info(`${rep.shortArea} foi removida da discussão.`);
                }}
              />
            ))}

            {/* Botão Direto na Mesa para Adicionar/Gerenciar Áreas */}
            <button
              type="button"
              onClick={() => setIsManageAreasOpen(true)}
              className="min-w-[155px] rounded-xl border border-dashed border-slate-300 hover:border-[#ea580c] bg-slate-50/60 hover:bg-orange-50/40 p-3 text-left transition-all flex flex-col justify-between cursor-pointer shrink-0 group"
            >
              <span className="w-8 h-8 rounded-lg bg-white border border-slate-200 group-hover:border-orange-200 text-[#ea580c] flex items-center justify-center text-base font-bold">
                +
              </span>
              <div className="mt-2">
                <div className="text-xs font-bold text-slate-800 group-hover:text-[#ea580c]">
                  + Adicionar Área
                </div>
                <div className="text-[10px] text-slate-500">
                  {availableAreasToAdd.length > 0
                    ? `${availableAreasToAdd.length} disponível(is)`
                    : "Gerenciar participantes"}
                </div>
              </div>
            </button>
          </div>
        </div>
      </header>

      {/* MODAL DE GERENCIAMENTO DE ÁREAS NA DISCUSSÃO (ADICIONAR / REMOVER) */}
      {isManageAreasOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="max-w-2xl w-full bg-white rounded-2xl border border-slate-200 shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#ea580c]">
                  Composição do Comitê Virtual
                </span>
                <h3 className="text-base font-bold text-slate-900">
                  Adicionar ou Remover Áreas na Mesa Redonda
                </h3>
                <p className="text-xs text-slate-500">
                  Convoque outras diretorias para opinar ou remova áreas que não precisam deliberar nesta versão
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsManageAreasOpen(false)}
                className="w-8 h-8 rounded-lg hover:bg-slate-100 flex items-center justify-center text-slate-500 cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-6">
              {/* 1. Áreas Atualmente na Discussão */}
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Áreas Participantes na Discussão ({reps.length})
                  </h4>
                  <span className="text-[11px] text-slate-400">
                    Mínimo de 1 área ativa
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {reps.map((rep) => {
                    const st = getStanceConfig(rep.stance);
                    return (
                      <div
                        key={rep.id}
                        className="flex items-center justify-between gap-3 p-3 rounded-xl border border-slate-200 bg-slate-50/60"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <span
                            className="w-8 h-8 rounded-lg text-white font-bold text-xs flex items-center justify-center shrink-0"
                            style={{ backgroundColor: rep.avatarColor }}
                          >
                            {rep.avatarInitials}
                          </span>
                          <div className="min-w-0">
                            <div className="text-xs font-bold text-slate-900 truncate">
                              {rep.shortArea}
                            </div>
                            <div className="text-[10px] text-slate-500 truncate">
                              {rep.agentName} ·{" "}
                              <span className="font-semibold">{st.shortLabel}</span>
                            </div>
                          </div>
                        </div>

                        <button
                          type="button"
                          disabled={reps.length <= 1}
                          onClick={() => {
                            removeAreaFromCommittee(rep.id);
                            toast.info(`${rep.shortArea} removida da Mesa Redonda.`);
                          }}
                          className="px-2.5 py-1 rounded-lg border border-rose-200 bg-white hover:bg-rose-50 disabled:opacity-40 text-[11px] font-semibold text-rose-600 shrink-0 transition-colors cursor-pointer"
                        >
                          Remover
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* 2. Áreas Disponíveis para Convocar */}
              <div className="space-y-2.5">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Áreas Disponíveis para Convocar ({availableAreasToAdd.length})
                </h4>

                {availableAreasToAdd.length === 0 ? (
                  <div className="rounded-xl border border-dashed border-slate-200 p-4 text-center text-xs text-slate-500">
                    Todas as diretorias mapeadas já estão participando desta Mesa Redonda.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {availableAreasToAdd.map((area) => (
                      <div
                        key={area.id}
                        className="flex items-center justify-between gap-3 p-3 rounded-xl border border-slate-200 bg-white hover:border-[#ea580c]/50 transition-all"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <span
                            className="w-8 h-8 rounded-lg text-white font-bold text-xs flex items-center justify-center shrink-0"
                            style={{ backgroundColor: area.avatarColor }}
                          >
                            {area.avatarInitials}
                          </span>
                          <div className="min-w-0">
                            <div className="text-xs font-bold text-slate-900 truncate">
                              {area.shortArea}
                            </div>
                            <div className="text-[10px] text-slate-500 truncate">
                              {area.agentName}
                            </div>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => {
                            addAreaToCommittee(area.id);
                            toast.success(
                              `${area.shortArea} convocada e adicionada à Mesa Redonda!`
                            );
                          }}
                          className="px-3 py-1.5 rounded-lg bg-[#ea580c] hover:bg-[#c2410c] text-white text-[11px] font-bold shrink-0 transition-colors cursor-pointer"
                        >
                          + Incluir
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="px-6 py-3.5 border-t border-slate-100 bg-slate-50 flex items-center justify-end">
              <button
                type="button"
                onClick={() => setIsManageAreasOpen(false)}
                className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold cursor-pointer"
              >
                Concluir
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          2. CORPO: CONVERSA DA MESA (ESQ) + SOLICITAÇÕES & EDIÇÃO PROPOSTA (DIR)
      ===================================================================== */}
      <div className="flex-1 flex flex-col lg:flex-row min-h-0">
        {/* COLUNA ESQUERDA: CONVERSA E NEGOCIAÇÃO COM OS AGENTES */}
        <section className="flex-1 flex flex-col min-h-0 lg:border-r border-slate-200 bg-white">
          <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
            {committeeMessages.map((msg) => {
              if (msg.senderType === "moderator") {
                return (
                  <div key={msg.id} className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-700">
                        <span className="w-5 h-5 rounded-md bg-[#ea580c] text-white flex items-center justify-center">
                          <Sparkles className="h-3 w-3" />
                        </span>
                        {msg.senderName}
                      </span>
                      <span className="text-[10px] text-slate-400">{msg.timestamp}</span>
                    </div>
                    <p className="text-xs text-slate-700 leading-relaxed whitespace-pre-line">{msg.content}</p>
                  </div>
                );
              }

              if (msg.senderType === "user") {
                return (
                  <div key={msg.id} className="flex flex-col items-end">
                    <div className="flex items-center gap-2 mb-1 px-1">
                      <span className="text-[11px] font-semibold text-slate-700">{msg.senderName}</span>
                      <span className="text-[10px] text-slate-400">{msg.timestamp}</span>
                    </div>
                    <div className="max-w-[82%] rounded-2xl rounded-br-xs bg-slate-900 text-white px-4 py-3 text-xs leading-relaxed shadow-2xs">
                      {msg.content}
                    </div>
                  </div>
                );
              }

              const stanceCfg = getStanceConfig(msg.stanceAtTime || "ressalvas");
              const highlight = msg.highlightBox ? HIGHLIGHT_CONFIG[msg.highlightBox.type] : null;

              return (
                <article key={msg.id} className="flex items-start gap-3">
                  <span
                    className="w-9 h-9 rounded-lg text-white font-bold text-xs flex items-center justify-center shrink-0 mt-0.5"
                    style={{ backgroundColor: msg.avatarColor || "#475569" }}
                  >
                    {msg.avatarInitials}
                  </span>

                  <div
                    className={`flex-1 min-w-0 bg-white rounded-xl border border-l-4 ${stanceCfg.borderClass} border-slate-200 p-4 shadow-2xs`}
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs font-bold text-slate-900">{msg.senderName}</span>
                        <span className="text-[11px] text-slate-500">· {msg.areaBadge}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`px-1.5 py-0.5 rounded-md text-[10px] font-semibold ${stanceCfg.badgeClass}`}>
                          {stanceCfg.label}
                        </span>
                        <span className="text-[10px] text-slate-400">{msg.timestamp}</span>
                      </div>
                    </div>

                    {msg.replyToArea && (
                      <div className="mt-1 inline-flex items-center gap-1 text-[11px] text-slate-500">
                        <CornerDownRight className="h-3 w-3" />
                        em resposta a <strong className="font-semibold text-slate-700">{msg.replyToArea}</strong>
                      </div>
                    )}

                    <p className="mt-2 text-xs text-slate-700 leading-relaxed whitespace-pre-line">
                      {msg.content}
                    </p>

                    {highlight && msg.highlightBox && (
                      <div className={`mt-2.5 rounded-lg border px-3 py-2 flex items-start gap-2 ${highlight.className}`}>
                        <highlight.Icon className={`h-4 w-4 shrink-0 mt-0.5 ${highlight.iconClass}`} />
                        <div className="min-w-0">
                          <div className="text-[10px] font-bold uppercase tracking-wider opacity-80">
                            {highlight.label}
                          </div>
                          <div className="text-xs font-medium leading-relaxed">{msg.highlightBox.text}</div>
                        </div>
                      </div>
                    )}
                  </div>
                </article>
              );
            })}
            <div ref={chatEndRef} />
          </div>

          {/* Composer de Conversa com as Áreas */}
          <div className="border-t border-slate-200 bg-white px-5 py-3.5 space-y-2.5">
            <div className="flex gap-1.5 overflow-x-auto pb-0.5">
              {negotiationPrompts.map((p, idx) => (
                <button
                  key={idx}
                  onClick={() => sendCommitteeMessage(p, "all")}
                  className="shrink-0 max-w-[300px] inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-slate-200 bg-slate-50 hover:bg-orange-50 hover:border-orange-300 text-[11px] text-slate-700 transition-colors cursor-pointer"
                >
                  <MessageSquare className="h-3 w-3 text-[#ea580c] shrink-0" />
                  <span className="truncate">{p}</span>
                </button>
              ))}
            </div>

            <div className="rounded-xl border border-slate-300 bg-white focus-within:border-[#ea580c] p-2">
              <div className="flex items-center gap-2 px-2 pb-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Conversando com:
                </span>
                {targetRep ? (
                  <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-slate-100 text-[11px] font-semibold text-slate-800">
                    <span>{targetRep.agentName} ({targetRep.shortArea})</span>
                    <button
                      onClick={() => setSelectedTargetRepId("all")}
                      className="text-slate-400 hover:text-slate-700 cursor-pointer"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-orange-50 text-[11px] font-semibold text-[#ea580c]">
                    Toda a Mesa Redonda
                  </span>
                )}
              </div>
              <div className="flex items-end gap-2">
                <textarea
                  rows={2}
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSend();
                    }
                  }}
                  placeholder={
                    targetRep
                      ? `Negocie com ${targetRep.agentName} (${targetRep.shortArea})...`
                      : "Negocie condições com as áreas na mesa redonda..."
                  }
                  className="w-full resize-none border-0 bg-transparent text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none px-2 py-0.5"
                />
                <button
                  onClick={handleSend}
                  disabled={!inputText.trim()}
                  className="h-8 px-3.5 rounded-lg bg-slate-900 hover:bg-slate-800 disabled:opacity-40 text-white text-xs font-semibold flex items-center gap-1.5 shrink-0 cursor-pointer"
                >
                  <span>Enviar</span>
                  <Send className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* ===================================================================
            COLUNA DIREITA: ACEITAR/NEGAR SOLICITAÇÕES + PROPOSTA EDITADA + REPROCESSAR
        =================================================================== */}
        <aside className="w-full lg:w-[460px] xl:w-[500px] shrink-0 overflow-y-auto p-5 space-y-5 bg-slate-50">
          {/* 1. PAINEL DE SOLICITAÇÕES DAS ÁREAS (ACEITAR OU NEGAR) */}
          <section className="bg-white rounded-2xl border border-slate-200 p-4 shadow-2xs space-y-3.5">
            <div className="flex items-center justify-between gap-2">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#ea580c]">
                  Deliberação por Área
                </span>
                <h3 className="text-sm font-bold text-slate-900">
                  Solicitações das Áreas Impactadas ({negotiationItems.length})
                </h3>
                <p className="text-[11px] text-slate-500">
                  Aceite ou negue o que cada área solicita — a proposta abaixo é editada automaticamente
                </p>
              </div>
              <button
                onClick={() => {
                  triggerCommitteeRound("consensus");
                  toast.success("Todas as solicitações foram aceitas na proposta!");
                }}
                className="px-2.5 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-[11px] font-bold shrink-0 cursor-pointer"
              >
                Aceitar Todas
              </button>
            </div>

            <div className="space-y-2.5">
              {negotiationItems.map((item) => {
                const isAccepted = item.status === "accepted";
                const isRejected = item.status === "rejected";

                return (
                  <div
                    key={item.id}
                    className={cn(
                      "rounded-xl border p-3.5 space-y-2.5 transition-all",
                      isAccepted
                        ? "border-emerald-300 bg-emerald-50/30"
                        : isRejected
                          ? "border-rose-200 bg-rose-50/20 opacity-80"
                          : "border-slate-200 bg-slate-50/60"
                    )}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2 min-w-0">
                        <span
                          className="w-6 h-6 rounded-md text-white font-bold text-[10px] flex items-center justify-center shrink-0"
                          style={{ backgroundColor: item.avatarColor }}
                        >
                          {item.avatarInitials}
                        </span>
                        <div className="min-w-0">
                          <div className="text-xs font-bold text-slate-900 truncate">
                            {item.areaShortName}
                          </div>
                          <div className="text-[10px] text-slate-500 truncate">{item.agentName}</div>
                        </div>
                      </div>

                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 shrink-0">
                        -{item.riskReductionDelta} pts de risco
                      </span>
                    </div>

                    <div>
                      <h4 className="text-xs font-bold text-slate-900 leading-snug">{item.title}</h4>
                      <p className="text-[11px] text-slate-600 leading-relaxed mt-0.5">
                        {item.description}
                      </p>
                    </div>

                    {/* Botões Aceitar / Negar Solicitação */}
                    <div className="flex items-center gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() => {
                          updateNegotiationDecision(
                            item.id,
                            isAccepted ? "pending" : "accepted"
                          );
                          if (!isAccepted) {
                            toast.success(`Solicitação de ${item.areaShortName} aceita e incluída na proposta!`);
                          }
                        }}
                        className={cn(
                          "flex-1 py-1.5 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer border",
                          isAccepted
                            ? "bg-emerald-600 text-white border-emerald-600 shadow-2xs"
                            : "bg-white text-slate-700 border-slate-200 hover:border-emerald-400 hover:text-emerald-700"
                        )}
                      >
                        <ThumbsUp className="h-3.5 w-3.5" />
                        <span>{isAccepted ? "Solicitação Aceita" : "Aceitar"}</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          updateNegotiationDecision(
                            item.id,
                            isRejected ? "pending" : "rejected"
                          );
                          if (!isRejected) {
                            toast.info(`Solicitação de ${item.areaShortName} negada.`);
                          }
                        }}
                        className={cn(
                          "flex-1 py-1.5 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer border",
                          isRejected
                            ? "bg-rose-600 text-white border-rose-600 shadow-2xs"
                            : "bg-white text-slate-700 border-slate-200 hover:border-rose-400 hover:text-rose-700"
                        )}
                      >
                        <ThumbsDown className="h-3.5 w-3.5" />
                        <span>{isRejected ? "Negada" : "Negar"}</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* 2. PROPOSTA DA SIMULAÇÃO EDITADA EM TEMPO REAL + REPROCESSAMENTO */}
          <section className="bg-white rounded-2xl border border-slate-200 p-4 shadow-2xs space-y-3.5">
            <div className="flex items-center justify-between gap-2">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                  <FileDiff className="h-3 w-3 text-[#ea580c]" />
                  Minuta Viva da Simulação
                </span>
                <h3 className="text-sm font-bold text-slate-900">
                  Proposta Editada para Reprocessamento (v{nextVersionNumber})
                </h3>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700">
                {negotiationStats.accepted} aceitas · {negotiationStats.rejected} negadas
              </span>
            </div>

            <div className="space-y-1.5">
              <label className="block text-[11px] font-semibold text-slate-600">
                Texto da proposta (atualizado automaticamente ao aceitar/negar ou editável manualmente):
              </label>
              <textarea
                rows={6}
                value={draftProposalText}
                onChange={(e) => updateDraftProposalText(e.target.value)}
                className="w-full rounded-xl border border-slate-300 bg-slate-50 focus:bg-white p-3 text-xs text-slate-800 leading-relaxed focus:outline-none focus:border-[#ea580c]"
              />
            </div>

            {/* Resumo do Impacto Estimado antes de Reprocessar */}
            <div className="rounded-xl bg-slate-900 text-white p-3.5 flex items-center justify-between gap-3">
              <div>
                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Projeção de Risco no Novo Relatório
                </div>
                <div className="text-xs font-semibold text-slate-200 mt-0.5">
                  Risco Original: <span className="line-through text-slate-400">{negotiationStats.baseRisk}/100</span>{" "}
                  →{" "}
                  <strong className="text-emerald-400 font-bold">
                    Novo Risco Estimado: {negotiationStats.projectedRisk}/100
                  </strong>
                </div>
              </div>
              <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0" />
            </div>

            <button
              type="button"
              onClick={() => {
                reprocessSimulationFromRoundtable();
                toast.success(`Simulação submetida! Gerando o Relatório v${nextVersionNumber} abaixo do guarda-chuva.`);
              }}
              className="w-full py-3 px-4 rounded-xl bg-[#ea580c] hover:bg-[#c2410c] text-white text-xs font-bold flex items-center justify-center gap-2 shadow-sm transition-colors cursor-pointer"
            >
              <RefreshCw className="h-4 w-4" />
              <span>Reprocessar Simulação & Gerar Relatório v{nextVersionNumber}</span>
            </button>
          </section>
        </aside>
      </div>
    </div>
  );
}
