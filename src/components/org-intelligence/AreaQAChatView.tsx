import { useState, useRef, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  Send,
  Sparkles,
  Bot,
  FileText,
  GitBranch,
  ArrowLeft,
  ArrowRight,
  HelpCircle,
  Compass,
  FolderOpen,
  Cog,
  PanelRightClose,
  PanelRightOpen,
  ExternalLink,
  Link2,
  BarChart3,
  X,
  ShieldCheck,
} from "lucide-react";
import { useOrgIntelligenceStore } from "@/stores/orgIntelligenceStore";
import { AreaQAChatMessage } from "@/data/orgIntelligenceMockData";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

type CitedShortcutItem = NonNullable<AreaQAChatMessage["citedSources"]>[number] & {
  citedAt: string;
  agentName?: string;
  areaName?: string;
};

function renderFormattedText(text: string) {
  const lines = text.split("\n");
  return (
    <div className="space-y-1.5">
      {lines.map((line, lIdx) => {
        const trimmed = line.trim();
        if (!trimmed) {
          return <div key={lIdx} className="h-1" />;
        }
        const isBullet = trimmed.startsWith("•") || trimmed.startsWith("-");
        const content = isBullet ? trimmed.replace(/^[•-]\s*/, "") : line;

        const parts = content.split(/(\*\*[^*]+\*\*)/g);
        const parsedLine = parts.map((part, pIdx) => {
          if (part.startsWith("**") && part.endsWith("**")) {
            return (
              <strong key={pIdx} className="font-semibold text-slate-900">
                {part.slice(2, -2)}
              </strong>
            );
          }
          return part;
        });

        if (isBullet) {
          return (
            <div key={lIdx} className="flex items-start gap-2 text-[13px] leading-relaxed">
              <span className="text-indigo-500 font-bold select-none">•</span>
              <span className="flex-1">{parsedLine}</span>
            </div>
          );
        }

        return (
          <p key={lIdx} className="text-[13px] leading-relaxed">
            {parsedLine}
          </p>
        );
      })}
    </div>
  );
}

export function AreaQAChatView() {
  const navigate = useNavigate();
  const {
    areaProfiles,
    activeDocuments,
    selectedQAAreaId,
    setSelectedQAAreaId,
    qaChatHistories,
    sendQAMessage,
    setActiveModuleTab,
    setSelectedAreaProfileId,
    generateAgentForArea,
  } = useOrgIntelligenceStore();

  const [questionText, setQuestionText] = useState("");
  const [isRightSidebarOpen, setIsRightSidebarOpen] = useState(true);
  const [pendingExternalLink, setPendingExternalLink] = useState<{
    code: string;
    title: string;
    url: string;
    sourceLabel?: string;
    summary?: string;
  } | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const selectedArea =
    selectedQAAreaId === "general"
      ? null
      : areaProfiles.find((a) => a.id === selectedQAAreaId) || null;

  // Inicializa mensagem de boas-vindas da área caso ainda não exista histórico
  const currentMessages: AreaQAChatMessage[] =
    qaChatHistories[selectedQAAreaId] ||
    (selectedArea
      ? [
          {
            id: `welcome-${selectedArea.id}`,
            sender: "agent",
            timestamp: "Online",
            routedAreaId: selectedArea.id,
            routedAreaName: selectedArea.shortArea,
            agentName: selectedArea.agentName,
            agentRole: selectedArea.agentRole,
            avatarColor: selectedArea.avatarColor,
            avatarInitials: selectedArea.avatarInitials,
            content: `Olá! Sou **${selectedArea.agentName}** (${selectedArea.agentRole}).\n\nTenho acesso integral a todos os processos mapeados (${selectedArea.mappedProcesses.map((p) => p.code).join(", ")}), regras de negócio e documentações vigentes de **${selectedArea.shortArea}**.\n\nQual dúvida pontual sobre nossa área você gostaria de esclarecer?`,
          },
        ]
      : []);

  // Compila todos os atalhos (documentos, políticas, processos, indicadores) citados pelo agente nas respostas
  const citedShortcuts = useMemo<CitedShortcutItem[]>(() => {
    const map = new Map<string, CitedShortcutItem>();
    // Percorre da mensagem mais recente para a mais antiga para destacar os últimos citados no topo
    for (let i = currentMessages.length - 1; i >= 0; i--) {
      const msg = currentMessages[i];
      if (msg.sender === "agent" && msg.citedSources) {
        for (const src of msg.citedSources) {
          if (!map.has(src.code)) {
            map.set(src.code, {
              ...src,
              citedAt: msg.timestamp,
              agentName: msg.agentName,
              areaName: msg.routedAreaName,
            });
          }
        }
      }
    }
    return Array.from(map.values());
  }, [currentMessages]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [currentMessages.length, selectedQAAreaId]);

  const handleSend = () => {
    if (!questionText.trim()) return;
    sendQAMessage(questionText, selectedQAAreaId);
    setQuestionText("");
    // Se a barra lateral estiver colapsada quando o agente citar fontes, garante visibilidade ou mantém o badge atualizado
  };

  // Trata o clique em um atalho (Link Interno do Sistema vs. Pop-up de Link Externo)
  const handleShortcutClick = (src: {
    code: string;
    title: string;
    type?: "Processo" | "Regra" | "Documento" | "Indicador";
    linkType?: "internal" | "external";
    internalPath?: string;
    externalUrl?: string;
    moduleLabel?: string;
    summary?: string;
  }) => {
    const isExternal =
      src.linkType === "external" || Boolean(src.externalUrl);

    if (isExternal) {
      setPendingExternalLink({
        code: src.code,
        title: src.title,
        url:
          src.externalUrl ||
          "https://informacoes.anatel.gov.br/legislacao/resolucoes/2014/750-resolucao-632",
        sourceLabel: src.moduleLabel || "Documento / Regulamentação Externa",
        summary: src.summary,
      });
      return;
    }

    // Link interno do próprio sistema: redireciona para o módulo correspondente
    const targetPath =
      src.internalPath ||
      (src.type === "Processo"
        ? "/architecture"
        : src.type === "Indicador"
          ? "/process-analysis"
          : "/normatives");

    toast.info(`Redirecionando para ${src.moduleLabel || "o módulo do sistema"} (${src.code})...`);
    navigate(targetPath);
  };

  const suggestedQuestions = selectedArea
    ? selectedArea.sampleQuestions
    : [
        "Qual é o prazo legal da Anatel antes de podermos reduzir a velocidade de um cliente inadimplente?",
        "Qual é a alçada atual de aprovação de compras para gerentes e quando exige diretor?",
        "Quanto tempo demora para um boleto pago no vencimento ser baixado no ERP e no Radius?",
        "Como funciona a regra de Desbloqueio em Confiança no Atendimento?",
      ];

  const areaDocs = selectedArea
    ? activeDocuments.filter(
        (d) =>
          d.enabled &&
          (d.areaId === selectedArea.id ||
            d.areaId === "transversal" ||
            d.relatedAreas.includes(selectedArea.shortArea))
      )
    : activeDocuments.filter((d) => d.enabled);

  return (
    <div className="flex flex-col lg:flex-row h-[calc(100vh-64px)] bg-[#f8fafc] overflow-hidden relative">
      {/* =====================================================================
          COLUNA ESQUERDA: SELETOR DE CHAT GERAL OU CHAT POR ÁREA (280px)
      ===================================================================== */}
      <aside className="w-full lg:w-[280px] border-r border-slate-200 bg-white flex flex-col h-full shrink-0">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between gap-2">
          <button
            onClick={() => setActiveModuleTab("home")}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 cursor-pointer"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Voltar ao Início</span>
          </button>
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
            Consulta & Dúvidas
          </span>
        </div>

        <div className="flex-1 overflow-y-auto p-3 space-y-4">
          {/* Opção 1: Chat Geral com Roteamento Inteligente */}
          <div className="space-y-1.5">
            <div className="px-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Sem escolher área (Roteamento IA)
            </div>
            <button
              onClick={() => setSelectedQAAreaId("general")}
              className={cn(
                "w-full text-left p-3 rounded-xl border transition-all cursor-pointer flex items-start gap-3",
                selectedQAAreaId === "general"
                  ? "bg-indigo-50/70 border-indigo-400 shadow-2xs ring-1 ring-indigo-400/30"
                  : "bg-slate-50/70 border-slate-200 hover:bg-slate-100"
              )}
            >
              <div className="w-9 h-9 rounded-lg bg-slate-900 text-white flex items-center justify-center shrink-0 mt-0.5">
                <Compass className="h-4 w-4 text-indigo-300" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-xs font-bold text-slate-900">Chat Geral (Roteador)</div>
                <p className="text-[11px] text-slate-500 leading-snug mt-0.5">
                  Pergunte sem escolher área: a IA identifica, roteia e responde pela área certa
                </p>
              </div>
            </button>
          </div>

          {/* Opção 2: Conversar Direto com Cada Área */}
          <div className="space-y-1.5">
            <div className="px-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Tirar dúvida direto com a Área
            </div>
            <div className="space-y-1">
              {areaProfiles.map((area) => {
                const isSelected = selectedQAAreaId === area.id;
                return (
                  <button
                    key={area.id}
                    onClick={() => setSelectedQAAreaId(area.id)}
                    className={cn(
                      "w-full text-left p-2.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-2",
                      isSelected
                        ? "bg-white border-slate-900 shadow-2xs ring-1 ring-slate-900/10"
                        : "bg-white border-transparent hover:bg-slate-50 hover:border-slate-200"
                    )}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span
                        className="w-8 h-8 rounded-lg text-white font-bold text-[11px] flex items-center justify-center shrink-0"
                        style={{ backgroundColor: area.avatarColor }}
                      >
                        {area.avatarInitials}
                      </span>
                      <div className="min-w-0">
                        <div className="text-xs font-bold text-slate-900 truncate">
                          {area.shortArea}
                        </div>
                        <div className="text-[10px] text-slate-500 truncate">
                          {area.hasAgentGenerated ? area.agentName : "Agente não gerado"}
                        </div>
                      </div>
                    </div>

                    <span
                      className={cn(
                        "w-2 h-2 rounded-full shrink-0",
                        area.hasAgentGenerated ? "bg-emerald-500" : "bg-amber-400"
                      )}
                      title={
                        area.hasAgentGenerated
                          ? "Agente Especialista Ativo"
                          : "Agente Pendente"
                      }
                    />
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </aside>

      {/* =====================================================================
          COLUNA CENTRAL: CONVERSA E RESPOSTAS DO AGENTE
      ===================================================================== */}
      <section className="flex-1 flex flex-col h-full bg-white min-w-0">
        {/* Header do Chat Ativo */}
        <header className="px-6 py-3.5 border-b border-slate-200 bg-white flex flex-wrap items-center justify-between gap-3 shrink-0">
          {selectedArea ? (
            <div className="flex items-center gap-3 min-w-0">
              <div
                className="w-10 h-10 rounded-xl text-white font-bold text-xs flex items-center justify-center shrink-0"
                style={{ backgroundColor: selectedArea.avatarColor }}
              >
                {selectedArea.avatarInitials}
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="text-sm font-bold text-slate-900 truncate">
                    Chat Direto · {selectedArea.shortArea}
                  </h2>
                  {selectedArea.hasAgentGenerated ? (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      Agente Especialista Ativo
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
                      Agente Pendente
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-500 truncate">
                  Respondido por <strong className="text-slate-700">{selectedArea.agentName}</strong> com base nos processos e documentos vigentes da área
                </p>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center shrink-0">
                <Compass className="h-5 w-5 text-indigo-300" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-sm font-bold text-slate-900">
                    Chat Geral de Dúvidas (Roteamento Automático)
                  </h2>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
                    Multi-Áreas
                  </span>
                </div>
                <p className="text-xs text-slate-500">
                  Faça qualquer pergunta genérica — identificamos a área responsável e adicionamos os documentos/processos usados na barra lateral
                </p>
              </div>
            </div>
          )}

          {/* Controles à direita do Header (Incluindo botão de expandir/recolher painel lateral) */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsRightSidebarOpen((prev) => !prev)}
              className={cn(
                "px-3 py-1.5 rounded-lg border text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer",
                isRightSidebarOpen
                  ? "border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100"
                  : "border-indigo-200 bg-indigo-50 text-indigo-700 hover:bg-indigo-100"
              )}
              title={
                isRightSidebarOpen
                  ? "Recolher barra lateral de atalhos e documentos"
                  : "Expandir barra lateral de atalhos e documentos"
              }
            >
              {isRightSidebarOpen ? (
                <>
                  <PanelRightClose className="h-3.5 w-3.5" />
                  <span>Ocultar Fontes</span>
                </>
              ) : (
                <>
                  <PanelRightOpen className="h-3.5 w-3.5" />
                  <span>Ver Fontes & Atalhos</span>
                  {citedShortcuts.length > 0 && (
                    <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-indigo-600 text-white">
                      {citedShortcuts.length}
                    </span>
                  )}
                </>
              )}
            </button>
          </div>
        </header>

        {/* Caso a área selecionada ainda não tenha agente gerado */}
        {selectedArea && !selectedArea.hasAgentGenerated ? (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-slate-50/50">
            <div className="max-w-md bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs space-y-4">
              <div
                className="w-12 h-12 rounded-2xl text-white font-bold text-sm flex items-center justify-center mx-auto"
                style={{ backgroundColor: selectedArea.avatarColor }}
              >
                {selectedArea.avatarInitials}
              </div>
              <div className="space-y-1">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
                  Agente ainda não gerado para {selectedArea.shortArea}
                </span>
                <h3 className="text-base font-bold text-slate-900 pt-1">
                  Gerar Agente Especialista de {selectedArea.shortArea}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Esta diretoria possui <strong>{selectedArea.mappedProcesses.length} processos mapeados</strong> e{" "}
                  <strong>{selectedArea.businessRules.length} regras de negócio</strong> prontas para indexação. Gere o agente agora para habilitar o chat de dúvidas com{" "}
                  <strong>{selectedArea.agentName}</strong>.
                </p>
              </div>
              <div className="flex items-center justify-center gap-2 pt-2">
                <button
                  onClick={() => {
                    generateAgentForArea(selectedArea.id);
                    toast.success(`Agente de ${selectedArea.shortArea} gerado e pronto para responder dúvidas!`);
                  }}
                  className="px-4 py-2.5 rounded-xl bg-[#ea580c] hover:bg-[#c2410c] text-white text-xs font-bold flex items-center gap-2 cursor-pointer shadow-sm"
                >
                  <Bot className="h-4 w-4" />
                  <span>Gerar Agente de {selectedArea.shortArea} Agora</span>
                </button>
                <button
                  onClick={() => {
                    setSelectedAreaProfileId(selectedArea.id);
                    setActiveModuleTab("context");
                  }}
                  className="px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer"
                >
                  Ver Documentações
                </button>
              </div>
            </div>
          </div>
        ) : (
          <>
            {/* Lista de Mensagens */}
            <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5 bg-slate-50/40">
              {currentMessages.map((msg) => {
                const isUser = msg.sender === "user";
                return (
                  <div
                    key={msg.id}
                    className={cn("flex flex-col", isUser ? "items-end" : "items-start")}
                  >
                    {/* Header da mensagem */}
                    <div className="flex items-center gap-2 mb-1.5 px-1">
                      {!isUser && (
                        <span
                          className="w-5 h-5 rounded-md text-[10px] font-bold text-white flex items-center justify-center"
                          style={{ backgroundColor: msg.avatarColor || "#0f172a" }}
                        >
                          {msg.avatarInitials || "IA"}
                        </span>
                      )}
                      <span className="text-xs font-bold text-slate-800">
                        {isUser ? "Você" : msg.agentName || "Agente Org. Intelligence"}
                      </span>
                      {!isUser && msg.routedAreaName && (
                        <span className="px-2 py-0.2 rounded text-[10px] font-semibold bg-slate-200/80 text-slate-700">
                          {msg.routedAreaName}
                        </span>
                      )}
                      <span className="text-[10px] text-slate-400">{msg.timestamp}</span>
                    </div>

                    {/* Badge de Roteamento Automático quando veio do Chat Geral */}
                    {!isUser && msg.wasAutoRouted && msg.routedAreaId && (
                      <div className="mb-2 max-w-[88%] rounded-xl bg-indigo-50 border border-indigo-200 px-3.5 py-2 flex flex-wrap items-center justify-between gap-2">
                        <div className="flex items-center gap-2 text-xs text-indigo-950">
                          <Sparkles className="h-3.5 w-3.5 text-indigo-600 shrink-0" />
                          <span>
                            Área identificada e acionada:{" "}
                            <strong className="font-bold">{msg.routedAreaName}</strong> ({msg.agentName})
                          </span>
                        </div>
                        <button
                          onClick={() => setSelectedQAAreaId(msg.routedAreaId!)}
                          className="text-[11px] font-bold text-indigo-700 hover:text-indigo-900 underline flex items-center gap-1 cursor-pointer"
                        >
                          <span>Abrir chat exclusivo de {msg.routedAreaName}</span>
                          <ArrowRight className="h-3 w-3" />
                        </button>
                      </div>
                    )}

                    {/* Bolha de Conteúdo */}
                    <div
                      className={cn(
                        "max-w-[88%] rounded-2xl px-4 py-3.5 shadow-2xs",
                        isUser
                          ? "bg-slate-900 text-white rounded-br-xs text-[13px]"
                          : "bg-white border border-slate-200 text-slate-800 rounded-bl-xs"
                      )}
                    >
                      {isUser ? (
                        <p className="whitespace-pre-line leading-relaxed">{msg.content}</p>
                      ) : (
                        renderFormattedText(msg.content)
                      )}

                      {/* Fontes, Processos e Documentos Clicáveis na Resposta */}
                      {!isUser && msg.citedSources && msg.citedSources.length > 0 && (
                        <div className="mt-3.5 pt-3 border-t border-slate-100 space-y-2">
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                              Fontes e Processos utilizados (adicionados aos atalhos à direita):
                            </span>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {msg.citedSources.map((src, sIdx) => {
                              const isExt =
                                src.linkType === "external" || Boolean(src.externalUrl);
                              return (
                                <button
                                  key={sIdx}
                                  type="button"
                                  onClick={() => handleShortcutClick(src)}
                                  className="group inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-slate-50 hover:bg-indigo-50 border border-slate-200 hover:border-indigo-300 text-[11px] text-slate-700 transition-all cursor-pointer"
                                  title={
                                    src.moduleLabel ||
                                    (isExt ? "Abrir link externo" : "Abrir módulo interno")
                                  }
                                >
                                  <span className="font-bold text-indigo-700">
                                    {src.code}
                                  </span>
                                  <span className="text-slate-400">·</span>
                                  <span className="font-medium group-hover:text-indigo-950">
                                    {src.title}
                                  </span>
                                  {isExt ? (
                                    <ExternalLink className="h-3 w-3 text-slate-400 group-hover:text-indigo-600 shrink-0 ml-0.5" />
                                  ) : (
                                    <ArrowRight className="h-3 w-3 text-slate-400 group-hover:text-indigo-600 shrink-0 ml-0.5" />
                                  )}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            {/* Sugestões Rápidas + Composer */}
            <div className="p-4 border-t border-slate-200 bg-white space-y-3">
              <div>
                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5 px-1">
                  {selectedArea
                    ? `Dúvidas sugeridas para ${selectedArea.shortArea}:`
                    : "Exemplos de dúvidas gerais (serão roteadas automaticamente para a área responsável):"}
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {suggestedQuestions.map((q, idx) => (
                    <button
                      key={idx}
                      onClick={() => sendQAMessage(q, selectedQAAreaId)}
                      className="flex items-center gap-1.5 text-left px-2.5 py-1.5 rounded-lg bg-slate-50 hover:bg-indigo-50/70 border border-slate-200 hover:border-indigo-200 text-[11px] text-slate-700 transition-colors cursor-pointer"
                    >
                      <HelpCircle className="h-3 w-3 text-indigo-500 shrink-0" />
                      <span className="line-clamp-1">{q}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-end gap-2 bg-slate-50 rounded-xl border border-slate-300 focus-within:bg-white focus-within:border-indigo-600 focus-within:ring-2 focus-within:ring-indigo-600/15 p-2">
                <textarea
                  rows={2}
                  value={questionText}
                  onChange={(e) => setQuestionText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSend();
                    }
                  }}
                  placeholder={
                    selectedArea
                      ? `Tire uma dúvida com ${selectedArea.agentName} sobre processos, políticas ou regras de ${selectedArea.shortArea}...`
                      : "Digite qualquer dúvida corporativa (o agente identificará a área ideal para responder)..."
                  }
                  className="w-full resize-none border-0 bg-transparent text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none px-2 py-1"
                />
                <button
                  onClick={handleSend}
                  disabled={!questionText.trim()}
                  className="h-9 px-4 rounded-lg bg-slate-900 hover:bg-slate-800 disabled:opacity-40 text-white text-xs font-semibold flex items-center gap-1.5 shrink-0 transition-colors cursor-pointer"
                >
                  <span>Perguntar</span>
                  <Send className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </>
        )}
      </section>

      {/* =====================================================================
          COLUNA DIREITA COLAPSÁVEL: ATALHOS DE FONTES CITADAS PELO AGENTE
      ===================================================================== */}
      {isRightSidebarOpen ? (
        <aside className="w-full lg:w-[340px] bg-slate-50 border-l border-slate-200 flex flex-col h-full shrink-0 transition-all">
          {/* Topo da Sidebar Direita com Botão de Colapsar */}
          <div className="p-4 bg-white border-b border-slate-200 flex items-center justify-between gap-2 shrink-0">
            <div className="flex items-center gap-2 min-w-0">
              <div className="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-600 border border-indigo-200/80 flex items-center justify-center shrink-0">
                <Link2 className="h-3.5 w-3.5" />
              </div>
              <div className="min-w-0">
                <h3 className="text-xs font-bold text-slate-900 truncate">
                  Atalhos & Fontes Citadas
                </h3>
                <p className="text-[10px] text-slate-500 truncate">
                  Documentos, políticas e processos da conversa
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsRightSidebarOpen(false)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
              title="Colapsar painel lateral"
            >
              <PanelRightClose className="h-4 w-4" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-5">
            {/* 1. ATALHOS ADICIONADOS PELAS RESPOSTAS DO AGENTE */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between px-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-700">
                  Citados na Resposta ({citedShortcuts.length})
                </span>
                {citedShortcuts.length > 0 && (
                  <span className="text-[10px] text-slate-400">
                    Clique para acessar
                  </span>
                )}
              </div>

              {citedShortcuts.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-slate-300 bg-white/80 p-4 text-center space-y-2">
                  <Sparkles className="h-5 w-5 text-indigo-400 mx-auto" />
                  <div className="text-xs font-semibold text-slate-700">
                    Nenhum atalho citado ainda nesta conversa
                  </div>
                  <p className="text-[11px] text-slate-500 leading-relaxed">
                    Assim que o agente responder sua dúvida usando uma política, norma externa ou processo, o atalho aparecerá aqui para acesso rápido.
                  </p>
                </div>
              ) : (
                <div className="space-y-2.5">
                  {citedShortcuts.map((src) => {
                    const isExternal =
                      src.linkType === "external" || Boolean(src.externalUrl);
                    const TypeIcon =
                      src.type === "Processo"
                        ? GitBranch
                        : src.type === "Indicador"
                          ? BarChart3
                          : src.type === "Regra"
                            ? ShieldCheck
                            : FileText;

                    return (
                      <button
                        key={src.code}
                        type="button"
                        onClick={() => handleShortcutClick(src)}
                        className="w-full text-left bg-white hover:bg-indigo-50/40 rounded-2xl border border-slate-200 hover:border-indigo-300 p-3.5 shadow-2xs transition-all space-y-2 group cursor-pointer"
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-slate-900 text-white text-[10px] font-bold">
                            <TypeIcon className="h-3 w-3 text-orange-400" />
                            <span>{src.code}</span>
                          </span>

                          <span
                            className={cn(
                              "px-2 py-0.5 rounded-full text-[10px] font-semibold flex items-center gap-1",
                              isExternal
                                ? "bg-amber-50 text-amber-800 border border-amber-200"
                                : "bg-indigo-50 text-indigo-700 border border-indigo-200"
                            )}
                          >
                            {isExternal ? (
                              <>
                                <span>Link Externo</span>
                                <ExternalLink className="h-2.5 w-2.5" />
                              </>
                            ) : (
                              <>
                                <span>Módulo Interno</span>
                                <ArrowRight className="h-2.5 w-2.5" />
                              </>
                            )}
                          </span>
                        </div>

                        <div>
                          <div className="text-xs font-bold text-slate-900 group-hover:text-indigo-700 leading-snug">
                            {src.title}
                          </div>
                          {src.summary && (
                            <p className="text-[11px] text-slate-500 mt-1 leading-snug">
                              {src.summary}
                            </p>
                          )}
                        </div>

                        <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[10px]">
                          <span className="text-slate-400 truncate">
                            Fonte: {src.areaName || "Org. Intelligence"}
                          </span>
                          <span className="font-bold text-indigo-600 group-hover:underline shrink-0">
                            {src.moduleLabel ||
                              (isExternal ? "Abrir link externo" : "Acessar no sistema")}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* 2. PROCESSOS E DOCUMENTOS DE REFERÊNCIA DA ÁREA (TAMBÉM CLICÁVEIS) */}
            <div className="space-y-2.5 pt-2 border-t border-slate-200/80">
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-1">
                {selectedArea
                  ? `Base Vigente de ${selectedArea.shortArea} (${areaDocs.length})`
                  : `Acervo Corporativo Disponível (${areaDocs.length})`}
              </div>

              {selectedArea && (
                <div className="space-y-1.5">
                  {selectedArea.mappedProcesses.map((p) => (
                    <button
                      key={p.code}
                      type="button"
                      onClick={() =>
                        handleShortcutClick({
                          code: p.code,
                          title: p.name,
                          type: "Processo",
                          linkType: "internal",
                          internalPath: "/architecture",
                          moduleLabel: "Abrir em Arquitetura de Processos",
                        })
                      }
                      className="w-full text-left rounded-xl bg-white hover:bg-slate-100 border border-slate-200/80 p-2.5 text-[11px] flex items-center justify-between gap-2 transition-colors cursor-pointer"
                    >
                      <div className="min-w-0">
                        <span className="font-bold text-slate-900">{p.code}: </span>
                        <span className="text-slate-600">{p.name}</span>
                      </div>
                      <ArrowRight className="h-3 w-3 text-slate-400 shrink-0" />
                    </button>
                  ))}
                </div>
              )}

              <div className="space-y-1.5">
                {areaDocs.map((doc) => {
                  const isExternalReg = doc.category === "regulatorio";
                  const externalUrlMap: Record<string, string> = {
                    "doc-reg-anatel-632":
                      "https://informacoes.anatel.gov.br/legislacao/resolucoes/2014/750-resolucao-632",
                    "doc-reg-cdc":
                      "https://www.planalto.gov.br/ccivil_03/leis/l8078compilado.htm",
                  };

                  return (
                    <button
                      key={doc.id}
                      type="button"
                      onClick={() =>
                        handleShortcutClick({
                          code: doc.fileType,
                          title: doc.title,
                          type: "Documento",
                          linkType: isExternalReg ? "external" : "internal",
                          externalUrl: isExternalReg
                            ? externalUrlMap[doc.id] ||
                              "https://www.gov.br/anatel/pt-br"
                            : undefined,
                          internalPath: "/normatives",
                          moduleLabel: isExternalReg
                            ? `Portal Externo (${doc.sourceOrg})`
                            : "Abrir no Módulo de Normativos",
                          summary: doc.summary,
                        })
                      }
                      className="w-full text-left rounded-xl bg-white hover:bg-slate-100 border border-slate-200/80 p-3 text-[11px] space-y-1 transition-colors cursor-pointer group"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <span className="font-bold text-slate-800 group-hover:text-indigo-700 leading-snug">
                          {doc.title}
                        </span>
                        {isExternalReg ? (
                          <ExternalLink className="h-3 w-3 text-slate-400 group-hover:text-indigo-600 shrink-0 mt-0.5" />
                        ) : (
                          <ArrowRight className="h-3 w-3 text-slate-400 group-hover:text-indigo-600 shrink-0 mt-0.5" />
                        )}
                      </div>
                      <div className="text-[10px] text-slate-400 flex items-center justify-between">
                        <span>
                          {doc.fileType} · {doc.sourceOrg}
                        </span>
                        <span className="text-indigo-600 font-semibold">
                          {isExternalReg ? "Link Externo" : "Normativo Interno"}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>

              <button
                onClick={() => {
                  setSelectedAreaProfileId(selectedArea ? selectedArea.id : null);
                  setActiveModuleTab("context");
                }}
                className="w-full mt-2 py-2 px-3 rounded-xl border border-slate-200 bg-white hover:bg-slate-100 text-xs font-semibold text-slate-700 flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <FolderOpen className="h-3.5 w-3.5" />
                <span>Gerenciar Base em Configurações</span>
              </button>
            </div>
          </div>
        </aside>
      ) : (
        /* Barra Lateral Direita Colapsada (Faixa estreita para reabrir) */
        <aside className="hidden lg:flex w-12 bg-white border-l border-slate-200 flex-col items-center py-4 gap-3 shrink-0">
          <button
            type="button"
            onClick={() => setIsRightSidebarOpen(true)}
            className="w-8 h-8 rounded-xl bg-slate-100 hover:bg-indigo-50 text-slate-600 hover:text-indigo-600 flex items-center justify-center transition-colors cursor-pointer"
            title="Expandir Atalhos & Fontes Citadas"
          >
            <PanelRightOpen className="h-4 w-4" />
          </button>

          {citedShortcuts.length > 0 && (
            <button
              type="button"
              onClick={() => setIsRightSidebarOpen(true)}
              className="w-7 h-7 rounded-full bg-indigo-600 text-white text-[11px] font-bold flex items-center justify-center shadow-xs cursor-pointer"
              title={`${citedShortcuts.length} fonte(s) citada(s) na conversa`}
            >
              {citedShortcuts.length}
            </button>
          )}
        </aside>
      )}

      {/* =====================================================================
          POP-UP / MODAL DE CONFIRMAÇÃO PARA REDIRECIONAMENTO A LINK EXTERNO
      ===================================================================== */}
      {pendingExternalLink && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-white rounded-3xl border border-slate-200 p-6 shadow-2xl space-y-4">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-amber-50 border border-amber-200 text-amber-700 flex items-center justify-center shrink-0">
                  <ExternalLink className="h-5 w-5" />
                </div>
                <div>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-50 text-amber-800">
                    Redirecionamento Externo
                  </span>
                  <h3 className="text-base font-bold text-slate-900 mt-0.5">
                    Deseja abrir este link externo?
                  </h3>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setPendingExternalLink(null)}
                className="w-8 h-8 rounded-lg hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="rounded-2xl bg-slate-50 border border-slate-200/80 p-4 space-y-2">
              <div className="text-xs font-bold text-slate-900">
                {pendingExternalLink.title}
              </div>
              {pendingExternalLink.summary && (
                <p className="text-xs text-slate-600 leading-relaxed">
                  {pendingExternalLink.summary}
                </p>
              )}
              <div className="pt-2 border-t border-slate-200/60 text-[11px] text-indigo-600 font-medium break-all">
                {pendingExternalLink.url}
              </div>
            </div>

            <p className="text-xs text-slate-500 leading-relaxed">
              Você está prestes a acessar uma fonte externa oficial fora do ambiente do sistema. O documento será aberto em uma nova guia do navegador.
            </p>

            <div className="flex items-center justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={() => setPendingExternalLink(null)}
                className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={() => {
                  window.open(
                    pendingExternalLink.url,
                    "_blank",
                    "noopener,noreferrer"
                  );
                  setPendingExternalLink(null);
                }}
                className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-indigo-600 text-white text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <span>Ir para o Link Externo</span>
                <ExternalLink className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
