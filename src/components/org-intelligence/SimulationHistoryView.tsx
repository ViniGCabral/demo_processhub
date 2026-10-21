import { useState } from "react";
import {
  History,
  ArrowLeft,
  Plus,
  Layers,
  Clock,
  ArrowRight,
  FileText,
  Users,
  RefreshCw,
} from "lucide-react";
import { useOrgIntelligenceStore } from "@/stores/orgIntelligenceStore";

export function SimulationHistoryView() {
  const {
    simulationSessions,
    openSimulationSession,
    setActiveModuleTab,
  } = useOrgIntelligenceStore();

  const [expandedSessionId, setExpandedSessionId] = useState<string | null>(
    simulationSessions[0]?.id || null
  );

  return (
    <div className="max-w-6xl mx-auto px-6 py-8 space-y-6">
      {/* Cabeçalho da Tela de Histórico */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="space-y-1">
          <button
            onClick={() => setActiveModuleTab("home")}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 mb-1 cursor-pointer"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Voltar ao Menu</span>
          </button>
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl font-bold text-slate-900">
              Histórico de Simulações & Relatórios
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-100 text-slate-700 border border-slate-200">
              {simulationSessions.length} sessões
            </span>
          </div>
          <p className="text-xs text-slate-500">
            Acompanhe todas as suas simulações e navegue pelas versões geradas (Versão 1 inicial e Versões pós-negociação na Mesa Redonda).
          </p>
        </div>

        <button
          onClick={() => setActiveModuleTab("home")}
          className="px-4 py-2.5 rounded-xl bg-[#ea580c] hover:bg-[#c2410c] text-white text-xs font-bold flex items-center gap-2 shadow-sm transition-colors cursor-pointer"
        >
          <Plus className="h-4 w-4" />
          <span>Nova Simulação</span>
        </button>
      </div>

      {/* Lista de Guarda-Chuvas de Simulação */}
      <div className="space-y-4">
        {simulationSessions.map((session) => {
          const latestVer = session.versions[session.versions.length - 1];
          const firstVer = session.versions[0];
          const isExpanded = expandedSessionId === session.id;
          const acceptedCount = session.negotiationItems.filter(
            (i) => i.status === "accepted"
          ).length;

          return (
            <div
              key={session.id}
              className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden transition-all"
            >
              <div className="p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="space-y-1.5 max-w-2xl">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-700 border border-slate-200">
                      {session.domainTag}
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-orange-50 text-[#ea580c] border border-orange-200 flex items-center gap-1">
                      <Layers className="h-3 w-3" />
                      {session.versions.length}{" "}
                      {session.versions.length === 1
                        ? "Relatório (v1)"
                        : `Relatórios (v1 a v${session.versions.length})`}
                    </span>
                    <span className="text-[11px] text-slate-400 flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {session.updatedAt}
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-slate-900">{session.title}</h3>
                  <p className="text-xs text-slate-500 line-clamp-2">
                    <strong className="text-slate-700">Solicitação Inicial:</strong> "
                    {session.initialPrompt}"
                  </p>
                </div>

                {/* Indicador de Risco + Ações */}
                <div className="flex flex-wrap items-center gap-2.5 shrink-0">
                  <div className="bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 flex items-center gap-3">
                    <div>
                      <div className="text-[9px] font-bold uppercase tracking-wider text-slate-400">
                        Risco v1
                      </div>
                      <div className="text-xs font-bold text-rose-700 tabular-nums">
                        {firstVer.analysis.overallRiskScore}/100
                      </div>
                    </div>
                    {session.versions.length > 1 && (
                      <>
                        <ArrowRight className="h-3.5 w-3.5 text-slate-400" />
                        <div>
                          <div className="text-[9px] font-bold uppercase tracking-wider text-emerald-700">
                            Atual (v{latestVer.versionNumber})
                          </div>
                          <div className="text-xs font-bold text-emerald-700 tabular-nums">
                            {latestVer.analysis.overallRiskScore}/100
                          </div>
                        </div>
                      </>
                    )}
                  </div>

                  <button
                    onClick={() =>
                      openSimulationSession(session.id, latestVer.versionNumber, "simulator")
                    }
                    className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-colors"
                  >
                    <FileText className="h-3.5 w-3.5" />
                    <span>Abrir Relatório (v{latestVer.versionNumber})</span>
                  </button>

                  <button
                    onClick={() =>
                      openSimulationSession(session.id, latestVer.versionNumber, "committee")
                    }
                    className="px-3.5 py-2 rounded-xl border border-orange-200 bg-orange-50/70 hover:bg-orange-100/80 text-[#ea580c] text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-colors"
                  >
                    <Users className="h-3.5 w-3.5" />
                    <span>Mesa Redonda</span>
                  </button>

                  <button
                    onClick={() => setExpandedSessionId(isExpanded ? null : session.id)}
                    className="px-2.5 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 cursor-pointer"
                  >
                    {isExpanded ? "Ocultar Versões" : "Ver Versões"}
                  </button>
                </div>
              </div>

              {isExpanded && (
                <div className="bg-slate-50/80 border-t border-slate-200 px-5 py-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                      Relatórios gerados abaixo desta simulação inicial:
                    </span>
                    <span className="text-[11px] text-slate-500">
                      {acceptedCount} de {session.negotiationItems.length} condições das áreas aceitas
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {session.versions.map((ver) => {
                      const isRiskLow = ver.analysis.overallRiskScore <= 35;
                      return (
                        <div
                          key={ver.versionNumber}
                          className="bg-white rounded-xl border border-slate-200 p-3.5 flex flex-col justify-between gap-3 hover:border-slate-300 transition-all shadow-2xs"
                        >
                          <div className="space-y-1.5">
                            <div className="flex items-center justify-between gap-2">
                              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-900 text-white">
                                {ver.versionLabel}
                              </span>
                              <span
                                className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                  isRiskLow
                                    ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                    : "bg-rose-50 text-rose-700 border border-rose-200"
                                }`}
                              >
                                Risco: {ver.analysis.overallRiskScore}/100
                              </span>
                            </div>
                            <div className="text-[11px] text-slate-400">{ver.createdAt}</div>
                            <p className="text-xs text-slate-600 leading-relaxed">
                              {ver.authorNote}
                            </p>
                          </div>

                          <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                            <span className="text-[10px] font-semibold text-slate-500">
                              {ver.analysis.viabilityStatus}
                            </span>
                            <button
                              onClick={() =>
                                openSimulationSession(session.id, ver.versionNumber, "simulator")
                              }
                              className="text-xs font-bold text-[#ea580c] hover:underline flex items-center gap-1 cursor-pointer"
                            >
                              <span>Abrir v{ver.versionNumber}</span>
                              <ArrowRight className="h-3 w-3" />
                            </button>
                          </div>
                        </div>
                      );
                    })}

                    <button
                      onClick={() =>
                        openSimulationSession(session.id, latestVer.versionNumber, "committee")
                      }
                      className="rounded-xl border-2 border-dashed border-slate-300 hover:border-[#ea580c] bg-white/60 hover:bg-orange-50/20 p-3.5 flex flex-col items-center justify-center text-center gap-1.5 transition-all cursor-pointer min-h-[110px]"
                    >
                      <div className="w-8 h-8 rounded-full bg-orange-50 text-[#ea580c] flex items-center justify-center">
                        <RefreshCw className="h-4 w-4" />
                      </div>
                      <span className="text-xs font-bold text-slate-800">
                        Negociar & Gerar v{session.versions.length + 1}
                      </span>
                      <span className="text-[11px] text-slate-500">
                        Ir para a Mesa Redonda desta simulação
                      </span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
