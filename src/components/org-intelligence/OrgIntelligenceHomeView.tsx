import { useState } from "react";
import {
  MessageSquare,
  GitBranch,
  History,
  Settings2,
  ArrowRight,
  BrainCircuit,
  Sparkles,
  Compass,
  FileText,
  Layers,
} from "lucide-react";
import { useOrgIntelligenceStore } from "@/stores/orgIntelligenceStore";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

type PromptIntentMode = "qa_chat" | "simulation";

const CHAT_SUGGESTIONS = [
  "Qual é o prazo legal da Anatel antes de reduzir a velocidade por inadimplência?",
  "Qual é a alçada atual de aprovação de compras para gerentes?",
  "Quanto tempo demora a compensação bancária de boleto no ERP e Radius?",
];

const SIMULATION_SUGGESTIONS = [
  {
    label: "Redução de velocidade por atraso em D+1",
    prompt:
      "Reduzir o prazo de tolerância após o vencimento da fatura de D+5 para D+1, aplicando redução automática da velocidade da internet já no primeiro dia de atraso.",
    scenarioKey: "telecom-throttling-d1",
  },
  {
    label: "Reduzir alçada de compras para R$ 10 mil",
    prompt:
      "Reduzir a alçada de aprovação exclusiva de gerentes em requisições de compras de R$ 50.000 para R$ 10.000, exigindo dupla assinatura de Diretoria acima desse valor.",
    scenarioKey: "procurement-alcada-10k",
  },
  {
    label: "Automatizar conciliação via PIX D+0",
    prompt:
      "Substituir conciliação bancária D+1 por baixa automática via webhook PIX em tempo real com liberação imediata de sinal.",
  },
];

export function OrgIntelligenceHomeView() {
  const {
    areaProfiles,
    activeDocuments,
    simulationSessions,
    openQAChat,
    initiateSimulationFlow,
    setActiveModuleTab,
    setSelectedAreaProfileId,
  } = useOrgIntelligenceStore();

  const [intentMode, setIntentMode] = useState<PromptIntentMode>("qa_chat");
  const [selectedChatArea, setSelectedChatArea] = useState<"general" | string>("general");
  const [inputText, setInputText] = useState("");

  const activeAgentsCount = areaProfiles.filter((a) => a.hasAgentGenerated).length;
  const activeDocsCount = activeDocuments.filter((d) => d.enabled).length;
  const totalVersionsCount = simulationSessions.reduce(
    (acc, s) => acc + s.versions.length,
    0
  );

  const selectedAreaObj =
    selectedChatArea === "general"
      ? null
      : areaProfiles.find((a) => a.id === selectedChatArea) || null;

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const trimmed = inputText.trim();

    if (intentMode === "qa_chat") {
      if (!trimmed) {
        openQAChat(selectedChatArea);
        return;
      }
      openQAChat(selectedChatArea, trimmed);
      setInputText("");
    } else {
      if (!trimmed) {
        toast.info("Descreva a mudança que você deseja simular.");
        return;
      }
      initiateSimulationFlow(trimmed);
      setInputText("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] bg-[#fafbfc] flex flex-col justify-between px-6 sm:px-10 lg:px-16 py-10 relative overflow-hidden">
      {/* Glow sutil de fundo */}
      <div
        className="pointer-events-none absolute top-[38%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[960px] h-[420px] rounded-full blur-3xl opacity-60 transition-colors duration-500"
        style={{
          background:
            intentMode === "qa_chat"
              ? "radial-gradient(circle, rgba(99,102,241,0.09) 0%, rgba(255,255,255,0) 70%)"
              : "radial-gradient(circle, rgba(234,88,12,0.09) 0%, rgba(255,255,255,0) 70%)",
        }}
      />

      <div className="max-w-5xl w-full mx-auto my-auto space-y-10 relative z-10">
        {/* =====================================================================
            1. LOGO & HERO CENTRALIZADO COM MELHOR PROPORÇÃO
        ===================================================================== */}
        <div className="text-center space-y-2.5 max-w-3xl mx-auto">
          <div className="inline-flex items-center justify-center gap-2.5 px-3.5 py-1.5 rounded-full bg-white border border-slate-200/90 shadow-2xs mb-1">
            <div className="w-6 h-6 rounded-md bg-orange-50 border border-orange-200/70 flex items-center justify-center">
              <BrainCircuit className="h-3.5 w-3.5 text-[#ea580c]" />
            </div>
            <span className="text-sm font-bold text-slate-900 tracking-tight">
              Org. Intelligence
            </span>
          </div>

          <p className="text-2xl sm:text-3xl font-medium text-slate-400 tracking-tight">
            Consultar. Simular. Decidir.
          </p>
          <h1 className="text-3xl sm:text-4xl lg:text-[42px] font-bold text-slate-900 tracking-tight leading-[1.15]">
            Suas decisões conectadas aos processos da empresa.
          </h1>
        </div>

        {/* =====================================================================
            2. COMPOSER AMPLO EM DESTAQUE (CHAT DE DÚVIDAS OU SIMULAÇÃO)
        ===================================================================== */}
        <div className="w-full space-y-4">
          <form
            onSubmit={handleSubmit}
            className="bg-white rounded-3xl border border-slate-200/90 shadow-[0_16px_48px_-12px_rgba(15,23,42,0.08)] hover:border-slate-300 focus-within:border-slate-300 focus-within:shadow-[0_20px_60px_-12px_rgba(15,23,42,0.12)] transition-all overflow-hidden"
          >
            {/* Área de Digitação Principal */}
            <div className="px-6 pt-6 pb-3">
              <textarea
                rows={3}
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={
                  intentMode === "qa_chat"
                    ? selectedAreaObj
                      ? `Pergunte diretamente para ${selectedAreaObj.shortArea} (${selectedAreaObj.agentName}) sobre processos, SLAs ou regras vigentes...`
                      : "Digite sua dúvida sobre processos, políticas ou SLAs (o orquestrador identifica e aciona a área certa)..."
                    : "O que você quer simular? Descreva a mudança de política, alçada, prazo ou processo para gerar o relatório de impacto..."
                }
                className="w-full resize-none bg-transparent text-base sm:text-lg text-slate-900 placeholder:text-slate-400 focus:outline-hidden leading-relaxed"
              />
            </div>

            {/* Se estiver no modo Chat de Dúvidas: Pílulas elegantes para escolher Geral ou Área */}
            {intentMode === "qa_chat" && (
              <div className="px-6 pb-3 flex items-center gap-1.5 flex-wrap">
                <span className="text-[11px] font-semibold text-slate-400 mr-1">
                  Direcionar para:
                </span>
                <button
                  type="button"
                  onClick={() => setSelectedChatArea("general")}
                  className={cn(
                    "px-2.5 py-1 rounded-full text-xs font-medium inline-flex items-center gap-1.5 transition-all cursor-pointer border",
                    selectedChatArea === "general"
                      ? "bg-indigo-50 text-indigo-700 border-indigo-200 font-semibold shadow-2xs"
                      : "bg-slate-50 text-slate-600 border-slate-200/80 hover:bg-slate-100"
                  )}
                >
                  <Compass className="h-3 w-3 text-indigo-600" />
                  <span>Geral (Auto-roteamento)</span>
                </button>

                {areaProfiles.map((area) => {
                  const isSelected = selectedChatArea === area.id;
                  return (
                    <button
                      key={area.id}
                      type="button"
                      onClick={() => setSelectedChatArea(area.id)}
                      className={cn(
                        "px-2.5 py-1 rounded-full text-xs font-medium inline-flex items-center gap-1.5 transition-all cursor-pointer border",
                        isSelected
                          ? "bg-slate-900 text-white border-slate-900 font-semibold shadow-2xs"
                          : "bg-white text-slate-600 border-slate-200/80 hover:bg-slate-50 hover:border-slate-300"
                      )}
                    >
                      <span
                        className="w-2 h-2 rounded-full shrink-0"
                        style={{ backgroundColor: area.avatarColor }}
                      />
                      <span>{area.shortArea}</span>
                    </button>
                  );
                })}
              </div>
            )}

            {/* Barra Inferior da Caixa de Comando (Toggle + Botão de Ação) */}
            <div className="px-5 py-3.5 bg-slate-50/70 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
              {/* Toggle Clean: Chat de Dúvidas vs. Criar Simulação */}
              <div className="inline-flex items-center bg-slate-200/70 p-1 rounded-xl border border-slate-200">
                <button
                  type="button"
                  onClick={() => setIntentMode("qa_chat")}
                  className={cn(
                    "px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer",
                    intentMode === "qa_chat"
                      ? "bg-white text-slate-900 shadow-2xs"
                      : "text-slate-600 hover:text-slate-900"
                  )}
                >
                  <MessageSquare
                    className={cn(
                      "h-3.5 w-3.5",
                      intentMode === "qa_chat" ? "text-indigo-600" : "text-slate-400"
                    )}
                  />
                  <span>Chat de Dúvidas</span>
                </button>

                <button
                  type="button"
                  onClick={() => setIntentMode("simulation")}
                  className={cn(
                    "px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer",
                    intentMode === "simulation"
                      ? "bg-white text-slate-900 shadow-2xs"
                      : "text-slate-600 hover:text-slate-900"
                  )}
                >
                  <GitBranch
                    className={cn(
                      "h-3.5 w-3.5",
                      intentMode === "simulation" ? "text-[#ea580c]" : "text-slate-400"
                    )}
                  />
                  <span>Criar Simulação</span>
                </button>
              </div>

              {/* Ações à direita */}
              <div className="flex items-center gap-2.5">
                {intentMode === "qa_chat" ? (
                  <button
                    type="button"
                    onClick={() => openQAChat(selectedChatArea)}
                    className="px-3 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-200/50 transition-colors cursor-pointer"
                  >
                    Abrir chat sem pergunta
                  </button>
                ) : (
                  <span className="hidden sm:inline-flex items-center gap-1.5 text-xs font-medium text-slate-500">
                    <Sparkles className="h-3.5 w-3.5 text-[#ea580c]" />
                    <span>Gera relatório de impacto + Mesa Redonda</span>
                  </span>
                )}

                <button
                  type="submit"
                  className={cn(
                    "px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer shadow-2xs",
                    intentMode === "qa_chat"
                      ? "bg-slate-900 hover:bg-indigo-600 text-white"
                      : "bg-[#ea580c] hover:bg-[#c2410c] text-white"
                  )}
                >
                  <span>
                    {intentMode === "qa_chat" ? "Perguntar no Chat" : "Gerar Simulação"}
                  </span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </form>

          {/* Sugestões Rápidas Abaixo do Campo */}
          <div className="flex flex-wrap items-center justify-center gap-2.5">
            {intentMode === "qa_chat"
              ? CHAT_SUGGESTIONS.map((suggestion) => (
                  <button
                    key={suggestion}
                    type="button"
                    onClick={() => openQAChat(selectedChatArea, suggestion)}
                    className="px-4 py-2 rounded-xl bg-white hover:bg-indigo-50/50 hover:border-indigo-200 border border-slate-200/90 text-xs font-medium text-slate-700 shadow-2xs transition-all cursor-pointer"
                  >
                    {suggestion}
                  </button>
                ))
              : SIMULATION_SUGGESTIONS.map((preset) => (
                  <button
                    key={preset.label}
                    type="button"
                    onClick={() =>
                      initiateSimulationFlow(preset.prompt, preset.scenarioKey)
                    }
                    className="px-4 py-2 rounded-xl bg-white hover:bg-orange-50/50 hover:border-orange-200 border border-slate-200/90 text-xs font-medium text-slate-700 shadow-2xs transition-all cursor-pointer"
                  >
                    {preset.label}
                  </button>
                ))}
          </div>
        </div>

        {/* =====================================================================
            3. DOIS CARDS DE APOIO EM DESTAQUE (HISTÓRICO & CONFIGURAÇÕES)
        ===================================================================== */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
          {/* Card 1: Histórico de Simulações */}
          <button
            type="button"
            onClick={() => setActiveModuleTab("history")}
            className="group text-left bg-white rounded-2xl border border-slate-200/90 hover:border-slate-300 p-6 shadow-xs hover:shadow-md transition-all flex flex-col justify-between gap-5 cursor-pointer"
          >
            <div className="space-y-4">
              <div className="flex items-start justify-between gap-3">
                <div className="w-12 h-12 rounded-2xl bg-slate-900 text-white flex items-center justify-center shadow-2xs shrink-0 group-hover:bg-[#ea580c] transition-colors">
                  <History className="h-5 w-5" />
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200/80 whitespace-nowrap">
                    {simulationSessions.length} simulações · {totalVersionsCount} relatórios
                  </span>
                </div>
              </div>

              <div className="space-y-1.5">
                <h2 className="text-lg font-bold text-slate-900 group-hover:text-[#ea580c] transition-colors">
                  Histórico de Simulações & Relatórios
                </h2>
                <p className="text-sm text-slate-500 leading-relaxed">
                  Consulte todas as simulações já realizadas, compare versões de relatórios (v1, v2, vN) e retome negociações na Mesa Redonda.
                </p>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-xs text-slate-500 min-w-0">
                <FileText className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                <span className="truncate">
                  Última: <strong className="font-semibold text-slate-700">{simulationSessions[0]?.title}</strong>
                </span>
              </div>
              <span className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-900 group-hover:text-[#ea580c] shrink-0">
                <span>Abrir Histórico</span>
                <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
              </span>
            </div>
          </button>

          {/* Card 2: Configurações (Perfis das Áreas & Base de Contexto) */}
          <button
            type="button"
            onClick={() => {
              setSelectedAreaProfileId(null);
              setActiveModuleTab("context");
            }}
            className="group text-left bg-white rounded-2xl border border-slate-200/90 hover:border-slate-300 p-6 shadow-xs hover:shadow-md transition-all flex flex-col justify-between gap-5 cursor-pointer"
          >
            <div className="space-y-4">
              <div className="flex items-start justify-between gap-3">
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-200/80 text-emerald-700 flex items-center justify-center shadow-2xs shrink-0 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                  <Settings2 className="h-5 w-5" />
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/70 whitespace-nowrap">
                    {activeAgentsCount} agentes · {activeDocsCount} docs vigentes
                  </span>
                </div>
              </div>

              <div className="space-y-1.5">
                <h2 className="text-lg font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
                  Configurações de Agentes & Contexto
                </h2>
                <p className="text-sm text-slate-500 leading-relaxed">
                  Acesse o perfil de cada área, gere ou atualize agentes especialistas e controle todas as documentações e políticas vigentes.
                </p>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
              <div className="flex items-center gap-1.5">
                <div className="flex -space-x-1.5">
                  {areaProfiles.map((area) => (
                    <span
                      key={area.id}
                      title={`${area.shortArea} (${area.agentName})`}
                      className="w-6 h-6 rounded-full text-[9px] font-bold text-white flex items-center justify-center ring-2 ring-white"
                      style={{ backgroundColor: area.avatarColor }}
                    >
                      {area.avatarInitials}
                    </span>
                  ))}
                </div>
                <span className="text-xs text-slate-500 pl-1">
                  <Layers className="h-3 w-3 inline mr-1 text-slate-400" />
                  {areaProfiles.length} áreas mapeadas
                </span>
              </div>
              <span className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-900 group-hover:text-emerald-700 shrink-0">
                <span>Configurar Áreas</span>
                <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
              </span>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
