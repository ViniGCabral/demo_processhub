import { useState, useRef, useEffect } from "react";
import {
  Sparkles,
  ArrowLeft,
  History,
  Network,
  ShoppingCart,
  ArrowRight,
  GitBranch,
  CheckCircle2,
  Send,
  Zap,
  FastForward,
  Check,
  PenLine,
  HelpCircle,
  BrainCircuit,
  FileText,
  Lightbulb,
  Edit3,
} from "lucide-react";
import { useOrgIntelligenceStore } from "@/stores/orgIntelligenceStore";
import {
  ClarifyingQuestion,
  generateClarifyingQuestionsForPrompt,
} from "@/data/orgIntelligenceMockData";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface AnsweredClarification {
  questionId: string;
  category: string;
  question: string;
  answer: string;
}

export function NewSimulationView() {
  const {
    startNewSimulationFromPrompt,
    setActiveModuleTab,
    simulationSessions,
    pendingSimulationPrompt,
    setPendingSimulationPrompt,
  } = useOrgIntelligenceStore();

  const [promptInput, setPromptInput] = useState("");
  const [selectedPresetKey, setSelectedPresetKey] = useState<string | undefined>(
    undefined
  );

  // Estado do fluxo conversacional de perguntas de refinamento do agente
  const [isInterviewActive, setIsInterviewActive] = useState(false);
  const [questions, setQuestions] = useState<ClarifyingQuestion[]>([]);
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [answers, setAnswers] = useState<AnsweredClarification[]>([]);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [customAnswerText, setCustomAnswerText] = useState("");
  const [isCustomMode, setIsCustomMode] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);

  // Auto-inicia o fluxo de perguntas quando houver uma demanda vinda da Home ou de outro ponto
  useEffect(() => {
    if (pendingSimulationPrompt && pendingSimulationPrompt.prompt) {
      startAgentClarificationFlow(
        pendingSimulationPrompt.prompt,
        pendingSimulationPrompt.scenarioKey
      );
      setPendingSimulationPrompt(null);
    }
  }, [pendingSimulationPrompt]);

  useEffect(() => {
    if (isInterviewActive) {
      containerRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [isInterviewActive, currentQuestionIdx]);

  const presets = [
    {
      key: "telecom-speed-400mb",
      title: "Aumento de velocidade para 400MB para a base de clientes B2C",
      tag: "Produto, Rede, Operações & CX",
      icon: Zap,
      prompt:
        "Estamos avaliando aumentar a velocidade para 400MB para toda a base de clientes B2C abaixo desse patamar (+75 mil assinantes) para reduzir o churn voluntário e fortalecer a competitividade da marca. Quais os impactos na empresa?",
    },
    {
      key: "telecom-throttling-d1",
      title: "Reduzir velocidade da internet de D+5 para D+1 após vencimento",
      tag: "Cobrança, Rede & Regulatório",
      icon: Network,
      prompt:
        "Atualmente temos a diretriz de não reduzir a velocidade da internet caso o usuário não pague nos primeiros 5 dias após o vencimento. Estamos estudando mudar essa diretriz para reduzir a velocidade em 1 dia após o vencimento. Quais os impactos na empresa?",
    },
    {
      key: "procurement-alcada-10k",
      title: "Reduzir alçada de aprovação de compras de R$ 50 mil para R$ 10 mil",
      tag: "Suprimentos, Governança & Operações",
      icon: ShoppingCart,
      prompt:
        "Atualmente compras operacionais até R$ 50.000 são aprovadas automaticamente pelo gerente da área se estiverem dentro do orçamento. Estamos estudando reduzir essa alçada para R$ 10.000, exigindo assinatura de 2 Diretores acima disso. Quais os impactos?",
    },
  ];

  const startAgentClarificationFlow = (text: string, presetKey?: string) => {
    const trimmed = text.trim();
    if (!trimmed) {
      toast.error("Descreva a mudança ou diretriz que você deseja simular.");
      return;
    }
    const generatedQuestions = generateClarifyingQuestionsForPrompt(
      trimmed,
      presetKey
    );
    setPromptInput(trimmed);
    setSelectedPresetKey(presetKey);
    setQuestions(generatedQuestions);
    setCurrentQuestionIdx(0);
    setAnswers([]);
    setSelectedOptionId(generatedQuestions[0]?.options[0]?.id || null);
    setCustomAnswerText("");
    setIsCustomMode(false);
    setIsInterviewActive(true);
  };

  const handleInitialSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    startAgentClarificationFlow(promptInput, selectedPresetKey);
  };

  const handleConfirmCurrentQuestion = () => {
    const currentQ = questions[currentQuestionIdx];
    if (!currentQ) return;

    let finalAnswer = "";
    if (isCustomMode) {
      if (!customAnswerText.trim()) {
        toast.error("Digite sua resposta personalizada ou selecione uma opção.");
        return;
      }
      finalAnswer = customAnswerText.trim();
    } else {
      const chosenOpt = currentQ.options.find((o) => o.id === selectedOptionId);
      if (!chosenOpt) {
        toast.error("Selecione uma das opções ou escreva sua resposta.");
        return;
      }
      finalAnswer = chosenOpt.label;
    }

    const newAnswerObj: AnsweredClarification = {
      questionId: currentQ.id,
      category: currentQ.category,
      question: currentQ.question,
      answer: finalAnswer,
    };

    const updatedAnswers = [...answers, newAnswerObj];
    setAnswers(updatedAnswers);

    const nextIdx = currentQuestionIdx + 1;
    if (nextIdx < questions.length) {
      setCurrentQuestionIdx(nextIdx);
      setSelectedOptionId(questions[nextIdx]?.options[0]?.id || null);
      setCustomAnswerText("");
      setIsCustomMode(false);
    } else {
      // Finalizou todas as perguntas -> Gera a simulação completa
      startNewSimulationFromPrompt(
        promptInput,
        selectedPresetKey,
        updatedAnswers.map((a) => ({
          question: a.question,
          category: a.category,
          answer: a.answer,
        }))
      );
    }
  };

  const handleSkipAndGenerateNow = () => {
    startNewSimulationFromPrompt(
      promptInput,
      selectedPresetKey,
      answers.map((a) => ({
        question: a.question,
        category: a.category,
        answer: a.answer,
      }))
    );
  };

  const activeQuestion = questions[currentQuestionIdx];

  return (
    <div ref={containerRef} className="min-h-[calc(100vh-64px)] bg-[#f8fafc] py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* =====================================================================
            TOP NAVIGATION BAR (BREADCRUMB & AÇÕES SUPERIORES)
        ===================================================================== */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <button
              onClick={() => {
                if (isInterviewActive) {
                  setIsInterviewActive(false);
                } else {
                  setActiveModuleTab("home");
                }
              }}
              className="inline-flex items-center gap-1.5 font-semibold text-slate-700 hover:text-slate-900 transition-colors cursor-pointer"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>{isInterviewActive ? "Alterar Demanda Inicial" : "Voltar ao Hub"}</span>
            </button>
            <span>/</span>
            <span className="font-medium text-slate-400">
              {isInterviewActive ? "Alinhamento com o Agente" : "Nova Simulação"}
            </span>
          </div>

          <button
            onClick={() => setActiveModuleTab("history")}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-slate-200 hover:bg-slate-50 text-xs font-semibold text-slate-700 transition-colors shadow-2xs cursor-pointer"
          >
            <History className="h-3.5 w-3.5 text-[#ea580c]" />
            <span>Histórico ({simulationSessions.length})</span>
          </button>
        </div>

        {/* =====================================================================
            MODO 1: ENTRADA INICIAL DA DEMANDA OU SELEÇÃO DE CENÁRIO
        ===================================================================== */}
        {!isInterviewActive && (
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-6 sm:p-10 space-y-8">
            <div className="space-y-3 max-w-3xl">
              <div className="w-10 h-10 rounded-xl bg-orange-50 border border-orange-200/80 text-[#ea580c] flex items-center justify-center shadow-2xs">
                <BrainCircuit className="h-5 w-5" />
              </div>
              <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                Simulador de Impacto Organizacional
              </h1>
              <p className="text-sm text-slate-500 leading-relaxed">
                Descreva a diretriz, mudança de política, alçada ou produto que deseja avaliar. O{" "}
                <strong className="font-semibold text-slate-700">
                  Agente Orquestrador
                </strong>{" "}
                fará até 4 perguntas rápidas de refinamento para calibrar o escopo e, em seguida, gerará o{" "}
                <strong className="font-semibold text-slate-700">
                  Resumo Executivo, Mapa de Relações e Mesa Redonda com as Áreas
                </strong>
                .
              </p>
            </div>

            <form onSubmit={handleInitialSubmit} className="space-y-4">
              <div className="rounded-2xl border border-slate-300 bg-white focus-within:border-[#ea580c] focus-within:ring-2 focus-within:ring-[#ea580c]/15 p-4 sm:p-5 transition-all shadow-2xs">
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                  Qual diretriz ou mudança você deseja simular?
                </label>
                <textarea
                  rows={4}
                  value={promptInput}
                  onChange={(e) => {
                    setPromptInput(e.target.value);
                    setSelectedPresetKey(undefined);
                  }}
                  placeholder="Ex: Estamos avaliando aumentar a velocidade para 400MB para a base de clientes B2C para reduzir o churn e fortalecer a competitividade da marca..."
                  className="w-full resize-none bg-transparent text-sm sm:text-base text-slate-900 placeholder:text-slate-400 focus:outline-none leading-relaxed"
                />
              </div>

              <div className="flex flex-wrap items-center justify-between gap-4 pt-1">
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <HelpCircle className="h-4 w-4 text-[#ea580c] shrink-0" />
                  <span>
                    O agente fará 4 perguntas de múltipla escolha (com opção de escrita livre) antes de gerar o relatório.
                  </span>
                </div>

                <button
                  type="submit"
                  className="px-6 py-3 rounded-xl bg-[#ea580c] hover:bg-[#c2410c] text-white text-sm font-bold flex items-center gap-2 shadow-xs transition-all cursor-pointer"
                >
                  <Sparkles className="h-4 w-4" />
                  <span>Iniciar com o Agente</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </form>

            {/* Cenários de Demonstração Rápida */}
            <div className="pt-6 border-t border-slate-100 space-y-3">
              <div className="text-xs font-semibold text-slate-400">
                Ou inicie a partir de um cenário estratégico homologado:
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {presets.map((p) => {
                  const Icon = p.icon;
                  return (
                    <button
                      key={p.key}
                      type="button"
                      onClick={() => startAgentClarificationFlow(p.prompt, p.key)}
                      className="text-left p-4 rounded-xl border border-slate-200/90 hover:border-[#ea580c] bg-slate-50/40 hover:bg-white transition-all flex flex-col justify-between gap-3 cursor-pointer group shadow-2xs hover:shadow-xs"
                    >
                      <div className="space-y-2">
                        <div className="flex items-center justify-between gap-2">
                          <div className="w-8 h-8 rounded-lg bg-white border border-slate-200 text-[#ea580c] flex items-center justify-center shrink-0">
                            <Icon className="h-4 w-4" />
                          </div>
                          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 text-right truncate">
                            {p.tag}
                          </span>
                        </div>
                        <div className="text-xs font-bold text-slate-900 group-hover:text-[#ea580c] leading-snug">
                          {p.title}
                        </div>
                      </div>
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#ea580c] pt-1">
                        Iniciar perguntas <ArrowRight className="h-3 w-3 group-hover:translate-x-0.5 transition-transform" />
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* =====================================================================
            MODO 2: ENTREVISTA EXECUTIVA DE REFINAMENTO COM O AGENTE (CLEAN CORPORATE)
        ===================================================================== */}
        {isInterviewActive && (
          <div className="space-y-6">
            {/* 1. STEPPER SUPERIOR EXECUTIVO */}
            <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-2xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-orange-50 border border-orange-200/80 text-[#ea580c] flex items-center justify-center shrink-0 shadow-2xs">
                    <Sparkles className="h-4 w-4" />
                  </div>
                  <div>
                    <h2 className="text-sm font-bold text-slate-900">
                      Refinamento de Escopo & Premissas com o Agente
                    </h2>
                    <p className="text-xs text-slate-500">
                      Valide 4 dimensões-chave para calibrar os impactos em indicadores, sistemas e processos
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleSkipAndGenerateNow}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-white text-xs font-semibold text-slate-700 transition-colors cursor-pointer self-start sm:self-auto shrink-0"
                >
                  <FastForward className="h-3.5 w-3.5 text-[#ea580c]" />
                  <span>Pular e Gerar com Padrões</span>
                </button>
              </div>

              {/* Stepper Visual de 4 Pilares */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 pt-2 border-t border-slate-100">
                {questions.map((q, idx) => {
                  const isDone = idx < answers.length;
                  const isCurrent = idx === currentQuestionIdx;
                  return (
                    <div
                      key={q.id}
                      className={cn(
                        "rounded-xl p-2.5 border transition-all text-left",
                        isDone
                          ? "bg-emerald-50/40 border-emerald-200/80 text-emerald-950"
                          : isCurrent
                            ? "bg-orange-50/40 border-orange-300 ring-1 ring-[#ea580c]/20 text-slate-900"
                            : "bg-slate-50/50 border-slate-200/70 text-slate-400"
                      )}
                    >
                      <div className="flex items-center justify-between gap-1 mb-1">
                        <span className="text-[10px] font-bold uppercase tracking-wider">
                          Pilar {idx + 1}
                        </span>
                        {isDone ? (
                          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                        ) : isCurrent ? (
                          <span className="w-2 h-2 rounded-full bg-[#ea580c] animate-pulse" />
                        ) : (
                          <span className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                        )}
                      </div>
                      <div className="text-xs font-bold truncate">
                        {q.category}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 2. CARD COMPACTO: DEMANDA EM ANÁLISE */}
            <div className="bg-slate-900 text-white rounded-2xl p-4 sm:p-5 shadow-xs flex items-start justify-between gap-4">
              <div className="space-y-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-white/10 text-orange-300">
                    Demanda Submetida
                  </span>
                  <span className="text-xs text-slate-400">· Em análise pelo Agente</span>
                </div>
                <p className="text-xs sm:text-sm text-slate-200 font-medium leading-relaxed italic">
                  &ldquo;{promptInput}&rdquo;
                </p>
              </div>

              <button
                type="button"
                onClick={() => setIsInterviewActive(false)}
                className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-300 hover:text-white shrink-0 pt-0.5 transition-colors cursor-pointer"
              >
                <Edit3 className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Editar</span>
              </button>
            </div>

            {/* 3. RESUMO DE PREMISSAS JÁ DEFINIDAS (ACCORDION SUAVE SE HOUVER) */}
            {answers.length > 0 && (
              <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-2xs space-y-2.5">
                <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                    <span>Premissas Alinhadas ({answers.length} de {questions.length})</span>
                  </span>
                  <span className="text-[11px] text-slate-400 font-normal">
                    Serão consolidadas no relatório v1
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 pt-1">
                  {answers.map((ans, idx) => (
                    <div
                      key={ans.questionId}
                      className="bg-slate-50/70 border border-slate-200/80 rounded-xl p-3 text-xs space-y-1"
                    >
                      <div className="text-[10px] font-bold uppercase tracking-wider text-emerald-700">
                        {idx + 1}. {ans.category}
                      </div>
                      <div className="text-slate-900 font-semibold leading-snug truncate" title={ans.answer}>
                        {ans.answer}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 4. CARD PRINCIPAL DA PERGUNTA ATIVA */}
            {activeQuestion && (
              <div className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-8 shadow-xs space-y-6">
                {/* Header da Pergunta */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <span className="px-2.5 py-1 rounded-lg text-xs font-bold uppercase tracking-wider bg-orange-50 text-[#ea580c] border border-orange-200/70">
                      Pergunta {activeQuestion.stepNumber} de {questions.length} · {activeQuestion.category}
                    </span>
                    <span className="text-xs font-semibold text-slate-400">
                      Etapa {activeQuestion.stepNumber}/4
                    </span>
                  </div>

                  <h3 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight leading-snug">
                    {activeQuestion.question}
                  </h3>

                  {activeQuestion.contextHint && (
                    <div className="rounded-xl bg-amber-50/70 border border-amber-200/70 p-3.5 text-xs text-amber-950 flex items-start gap-2.5 leading-relaxed">
                      <Lightbulb className="h-4 w-4 text-amber-700 shrink-0 mt-0.5" />
                      <div>
                        <strong className="font-semibold text-amber-900">Contexto do Agente: </strong>
                        {activeQuestion.contextHint}
                      </div>
                    </div>
                  )}
                </div>

                {/* Bloco de Escolha: Opções A, B, C */}
                <div className="space-y-3">
                  <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Selecione uma opção recomendada:
                  </div>

                  <div className="space-y-2.5">
                    {activeQuestion.options.map((opt, optIdx) => {
                      const isSelected = !isCustomMode && selectedOptionId === opt.id;
                      const letters = ["A", "B", "C", "D", "E"];
                      const letter = letters[optIdx] || `${optIdx + 1}`;

                      return (
                        <button
                          key={opt.id}
                          type="button"
                          onClick={() => {
                            setIsCustomMode(false);
                            setSelectedOptionId(opt.id);
                          }}
                          className={cn(
                            "w-full text-left p-4 rounded-xl border transition-all flex items-start gap-3.5 cursor-pointer shadow-2xs",
                            isSelected
                              ? "border-[#ea580c] bg-orange-50/40 ring-2 ring-[#ea580c]/30 shadow-xs"
                              : "border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50/60"
                          )}
                        >
                          <div
                            className={cn(
                              "w-7 h-7 rounded-lg text-xs font-bold flex items-center justify-center shrink-0 mt-0.5 transition-colors",
                              isSelected
                                ? "bg-[#ea580c] text-white shadow-2xs"
                                : "bg-slate-100 text-slate-600 border border-slate-200"
                            )}
                          >
                            {letter}
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-bold text-slate-900 leading-snug">
                              {opt.label}
                            </div>
                            {opt.description && (
                              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                                {opt.description}
                              </p>
                            )}
                          </div>

                          {isSelected && (
                            <div className="w-5 h-5 rounded-full bg-[#ea580c] text-white flex items-center justify-center shrink-0 mt-1">
                              <Check className="h-3 w-3" />
                            </div>
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {/* Opção Aberta: Digitar Resposta Própria caso queira */}
                  {activeQuestion.allowCustomWriteIn && (
                    <div
                      className={cn(
                        "rounded-xl border p-4 transition-all space-y-3 mt-4",
                        isCustomMode
                          ? "border-[#ea580c] bg-orange-50/30 ring-2 ring-[#ea580c]/30 shadow-xs"
                          : "border-dashed border-slate-300 bg-slate-50/50 hover:bg-white hover:border-slate-400"
                      )}
                    >
                      <div
                        onClick={() => setIsCustomMode(true)}
                        className="flex items-center justify-between cursor-pointer"
                      >
                        <div className="flex items-center gap-2.5">
                          <div
                            className={cn(
                              "w-7 h-7 rounded-lg text-xs font-bold flex items-center justify-center shrink-0 transition-colors",
                              isCustomMode
                                ? "bg-[#ea580c] text-white"
                                : "bg-white text-slate-600 border border-slate-300"
                            )}
                          >
                            <PenLine className="h-3.5 w-3.5" />
                          </div>
                          <div>
                            <span className="text-xs sm:text-sm font-bold text-slate-900">
                              Escrever minha própria resposta caso queira
                            </span>
                            <p className="text-[11px] text-slate-500">
                              Defina uma diretriz personalizada para o agente modelar
                            </p>
                          </div>
                        </div>

                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 bg-white px-2 py-0.5 rounded border border-slate-200">
                          Resposta Livre
                        </span>
                      </div>

                      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 pt-1">
                        <input
                          type="text"
                          value={customAnswerText}
                          onFocus={() => setIsCustomMode(true)}
                          onChange={(e) => {
                            setIsCustomMode(true);
                            setCustomAnswerText(e.target.value);
                          }}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault();
                              handleConfirmCurrentQuestion();
                            }
                          }}
                          placeholder={
                            activeQuestion.customWriteInPlaceholder ||
                            "Digite aqui sua própria regra ou especificação técnica..."
                          }
                          className="flex-1 rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-[#ea580c] focus:ring-1 focus:ring-[#ea580c]/30 shadow-2xs"
                        />
                        {isCustomMode && customAnswerText.trim() && (
                          <button
                            type="button"
                            onClick={handleConfirmCurrentQuestion}
                            className="px-4 py-2.5 rounded-lg bg-[#ea580c] hover:bg-[#c2410c] text-white text-xs font-bold shrink-0 transition-colors cursor-pointer shadow-2xs"
                          >
                            Usar esta resposta
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Rodapé de Navegação da Pergunta */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-100">
                  <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-start">
                    {currentQuestionIdx > 0 && (
                      <button
                        type="button"
                        onClick={() => {
                          const prevIdx = currentQuestionIdx - 1;
                          setCurrentQuestionIdx(prevIdx);
                          setAnswers(answers.slice(0, prevIdx));
                          setSelectedOptionId(questions[prevIdx]?.options[0]?.id || null);
                          setCustomAnswerText("");
                          setIsCustomMode(false);
                        }}
                        className="px-3.5 py-2 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer"
                      >
                        ← Voltar pergunta
                      </button>
                    )}
                    <span className="text-xs text-slate-400">
                      {currentQuestionIdx + 1 === questions.length
                        ? "Última pergunta antes do relatório v1"
                        : `Restam ${questions.length - (currentQuestionIdx + 1)} pergunta(s)`}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={handleConfirmCurrentQuestion}
                    className="w-full sm:w-auto px-6 py-3 rounded-xl bg-[#ea580c] hover:bg-[#c2410c] text-white text-xs sm:text-sm font-bold flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer"
                  >
                    {currentQuestionIdx + 1 === questions.length ? (
                      <>
                        <Sparkles className="h-4 w-4" />
                        <span>Finalizar & Gerar Simulação (v1)</span>
                      </>
                    ) : (
                      <>
                        <span>Confirmar e Avançar</span>
                        <ArrowRight className="h-4 w-4" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
