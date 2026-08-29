import { FormEvent, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  FileText,
  Loader2,
  Send,
  Sparkles,
} from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useProcessStore } from "@/stores/processStore";
import { BorderBeam } from "@/components/ui/border-beam";

type AssistantAnswer = {
  answerPT: string;
  answerEN: string;
  step: string;
  substep: string;
  sectionPT: string;
  sectionEN: string;
  highlight: string;
};

const answers: Array<{ terms: string[]; result: AssistantAnswer }> = [
  {
    terms: ["500", "distância", "distancia", "quilômetros", "quilometros", "distance"],
    result: {
      answerPT: "Quando a distância entre a origem e o destino for superior a 500 km, utilize a calculadora de frete lotação. Antes de seguir, confirme origem e destino no simulador para aplicar a regra corretamente.",
      answerEN: "When the distance between origin and destination is over 500 km, use the full-truckload freight calculator. Confirm origin and destination in the simulator before proceeding.",
      step: "2",
      substep: "2.4",
      sectionPT: "Cálculo do Frete",
      sectionEN: "Freight calculation",
      highlight: "superior a 500km",
    },
  },
  {
    terms: ["aprova", "gerente", "prazo", "nenhuma modalidade", "approve", "manager", "deadline"],
    result: {
      answerPT: "Se nenhuma modalidade atender ao prazo solicitado, o caso deve ser escalado ao gerente da área para aprovação do frete emergencial premium.",
      answerEN: "If no freight option meets the requested deadline, escalate the case to the area manager for premium emergency freight approval.",
      step: "3",
      substep: "3.4",
      sectionPT: "Comparação e Seleção de Modalidade",
      sectionEN: "Freight option comparison",
      highlight: "escalar para o gerente",
    },
  },
  {
    terms: ["email", "e-mail", "transportadora", "carrier"],
    result: {
      answerPT: "No campo E-mail, inclua todas as transportadoras que devem receber a solicitação de cotação e separe os endereços por vírgula.",
      answerEN: "In the E-mail field, add every carrier that should receive the quotation request and separate the addresses with commas.",
      step: "1",
      substep: "1.6",
      sectionPT: "Análise Inicial e Configuração do Chamado",
      sectionEN: "Initial analysis and ticket setup",
      highlight: "Separar os e-mails por vírgula",
    },
  },
  {
    terms: ["informações", "informacoes", "dados", "chamado", "origem", "destino", "information", "ticket"],
    result: {
      answerPT: "Verifique se o chamado contém origem, destino, tipo de carga e urgência. Também confirme data de coleta, data de entrega e se o tipo está identificado como frete emergencial.",
      answerEN: "Check that the ticket includes origin, destination, cargo type and urgency. Also confirm collection date, delivery date and that the request is marked as emergency freight.",
      step: "1",
      substep: "1.3",
      sectionPT: "Análise Inicial e Configuração do Chamado",
      sectionEN: "Initial analysis and ticket setup",
      highlight: "origem, destino, tipo de carga, urgência",
    },
  },
  {
    terms: ["econômica", "economica", "modalidade", "selecionar", "escolher", "cheapest", "option"],
    result: {
      answerPT: "Selecione a modalidade mais econômica que ainda cumpra o prazo solicitado pelo cliente. O comparativo deve considerar as opções fracionado, lotação e emergencial.",
      answerEN: "Select the most economical freight option that still meets the customer's deadline, comparing partial load, full truckload and emergency freight.",
      step: "3",
      substep: "3.3",
      sectionPT: "Comparação e Seleção de Modalidade",
      sectionEN: "Freight option comparison",
      highlight: "modalidade mais econômica",
    },
  },
];

const fallback = answers[3].result;

const suggestionsPT = [
  "O que fazer quando a distância for maior que 500 km?",
  "Quem aprova quando nenhuma modalidade atende ao prazo?",
  "Quais dados devo conferir no chamado?",
];

const suggestionsEN = [
  "What should I do when the distance is over 500 km?",
  "Who approves when no option meets the deadline?",
  "Which ticket details should I check?",
];

export function ProcessAssistant() {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const processes = useProcessStore((state) => state.processes);
  const [question, setQuestion] = useState("");
  const [submittedQuestion, setSubmittedQuestion] = useState("");
  const [answer, setAnswer] = useState<AssistantAnswer | null>(null);
  const [loading, setLoading] = useState(false);
  const responseRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout>>();

  const freightProcess = processes.find((process) =>
    process.name.toLowerCase().includes("cotação de frete")
  );
  const processId = freightProcess?.id || "1";

  useEffect(() => () => timerRef.current && clearTimeout(timerRef.current), []);

  const ask = (value: string) => {
    const cleanQuestion = value.trim();
    if (!cleanQuestion || loading) return;

    const normalized = cleanQuestion.toLocaleLowerCase(language === "PT" ? "pt-BR" : "en-US");
    const match = answers.find(({ terms }) => terms.some((term) => normalized.includes(term)));
    setSubmittedQuestion(cleanQuestion);
    setAnswer(null);
    setLoading(true);

    timerRef.current = setTimeout(() => {
      setAnswer(match?.result || fallback);
      setLoading(false);
      requestAnimationFrame(() => responseRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" }));
    }, 650);
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    ask(question);
  };

  const openSource = () => {
    if (!answer) return;
    const params = new URLSearchParams({
      tab: "pop-sop",
      step: answer.step,
      substep: answer.substep,
      highlight: answer.highlight,
    });
    navigate(`/processes/${processId}?${params.toString()}`);
  };

  const suggestions = language === "PT" ? suggestionsPT : suggestionsEN;

  return (
    <section className="h-full min-w-0" aria-labelledby="process-assistant-title">
      <BorderBeam
        size="md"
        colorVariant="colorful"
        theme="light"
        duration={4.5}
        strength={0.72}
        borderRadius={16}
        className="h-full rounded-2xl"
      >
      <div className="h-full overflow-hidden rounded-2xl border border-[#d9def3] bg-white shadow-[0_10px_30px_rgba(12,27,168,0.07)]">
        <div className="relative overflow-hidden bg-[#0b1a8f] px-5 py-5 text-white sm:px-6">
          <div className="absolute -right-12 -top-24 h-52 w-52 rounded-full bg-[#6375ff]/25 blur-2xl" />
          <div className="relative flex items-start gap-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/12 ring-1 ring-white/20">
              <Sparkles className="h-5 w-5" aria-hidden="true" />
            </div>
            <div>
              <div className="mb-1 flex items-center gap-2">
                <span className="rounded-full bg-emerald-400/15 px-2 py-0.5 text-[11px] font-semibold text-emerald-200 ring-1 ring-emerald-300/25">
                  {language === "PT" ? "Assistente online" : "Assistant online"}
                </span>
              </div>
              <h2 id="process-assistant-title" className="text-[22px] font-semibold tracking-tight text-white">
                {language === "PT" ? "Como posso ajudar com seus processos?" : "How can I help with your processes?"}
              </h2>
              <p className="mt-1 max-w-2xl text-[13px] leading-5 text-blue-100">
                {language === "PT"
                  ? "Pergunte em linguagem natural. Eu consulto as documentações da plataforma e mostro exatamente de onde veio a resposta."
                  : "Ask in natural language. I check the platform documentation and show exactly where the answer came from."}
              </p>
            </div>
          </div>
        </div>

        <div className="px-5 py-5 sm:px-6">
          <form onSubmit={handleSubmit} className="relative">
            <label htmlFor="process-question" className="sr-only">
              {language === "PT" ? "Pergunte sobre um processo" : "Ask about a process"}
            </label>
            <textarea
              id="process-question"
              value={question}
              onChange={(event) => setQuestion(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter" && !event.shiftKey) {
                  event.preventDefault();
                  ask(question);
                }
              }}
              rows={2}
              placeholder={language === "PT" ? "Ex.: O que faço quando a distância do frete passa de 500 km?" : "E.g. What do I do when the freight distance is over 500 km?"}
              className="min-h-[72px] w-full resize-none rounded-xl border border-[#dfe2ea] bg-[#fbfbfd] px-4 py-3.5 pr-14 text-[15px] text-[#272727] outline-none transition placeholder:text-[#9296a3] focus:border-[#2638c4] focus:bg-white focus:ring-4 focus:ring-[#0c1ba8]/[0.07]"
            />
            <button
              type="submit"
              disabled={!question.trim() || loading}
              aria-label={language === "PT" ? "Enviar pergunta" : "Send question"}
              className="absolute bottom-3 right-3 flex h-10 w-10 items-center justify-center rounded-lg bg-[#0c1ba8] text-white transition hover:bg-[#081578] disabled:cursor-not-allowed disabled:bg-[#c8cad4]"
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            </button>
          </form>

          {!submittedQuestion && (
            <div className="mt-4 flex flex-wrap items-center gap-2">
              <span className="mr-1 text-xs font-medium text-[#7b7f8d]">
                {language === "PT" ? "Experimente perguntar:" : "Try asking:"}
              </span>
              {suggestions.map((suggestion) => (
                <button
                  key={suggestion}
                  onClick={() => {
                    setQuestion(suggestion);
                    ask(suggestion);
                  }}
                  className="rounded-full border border-[#e2e4eb] bg-white px-3 py-1.5 text-xs text-[#515563] transition hover:border-[#aeb6ed] hover:bg-[#f6f7ff] hover:text-[#0c1ba8]"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          )}

          {submittedQuestion && (
            <div ref={responseRef} className="mt-5 border-t border-[#eceef3] pt-5" aria-live="polite">
              <div className="mb-4 flex justify-end">
                <div className="max-w-[86%] rounded-2xl rounded-br-md bg-[#f0f1f5] px-4 py-2.5 text-sm text-[#3e414a]">
                  {submittedQuestion}
                </div>
              </div>

              {loading ? (
                <div className="flex items-center gap-3 text-sm text-[#777b88]">
                  <Loader2 className="h-4 w-4 animate-spin text-[#0c1ba8]" />
                  {language === "PT" ? "Consultando as SOPs disponíveis…" : "Checking available SOPs…"}
                </div>
              ) : answer ? (
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#eef0ff] text-[#0c1ba8]">
                    <Sparkles className="h-4 w-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="mb-2 flex items-center gap-2 text-xs font-medium text-[#5f6470]">
                      <span>ProcessHub AI</span>
                      <span aria-hidden="true">•</span>
                      <span className="inline-flex items-center gap-1 text-emerald-700">
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        {language === "PT" ? "Baseado na documentação" : "Based on documentation"}
                      </span>
                    </div>
                    <p className="text-[15px] leading-6 text-[#30323a]">
                      {language === "PT" ? answer.answerPT : answer.answerEN}
                    </p>

                    <div className="mt-4 flex flex-col gap-3 rounded-xl border border-[#dfe3f4] bg-[#f8f9ff] p-3.5 sm:flex-row sm:items-center sm:justify-between">
                      <div className="flex min-w-0 items-start gap-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white text-[#0c1ba8] shadow-sm ring-1 ring-[#e2e5f2]">
                          <FileText className="h-4 w-4" />
                        </div>
                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                            <span className="text-xs font-semibold text-[#0c1ba8]">
                              {language === "PT" ? "Fonte consultada" : "Source checked"}
                            </span>
                            <span className="rounded bg-white px-1.5 py-0.5 text-[10px] font-semibold text-[#636775] ring-1 ring-[#e2e4eb]">SOP v3.0</span>
                          </div>
                          <p className="truncate text-sm font-medium text-[#343741]">Cotação de Frete Emergencial</p>
                          <p className="text-xs text-[#747886]">
                            {language === "PT" ? `Etapa ${answer.step} · ${answer.sectionPT} · Item ${answer.substep}` : `Step ${answer.step} · ${answer.sectionEN} · Item ${answer.substep}`}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={openSource}
                        className="inline-flex shrink-0 items-center justify-center gap-2 rounded-lg bg-white px-3.5 py-2 text-xs font-semibold text-[#0c1ba8] shadow-sm ring-1 ring-[#cfd5f3] transition hover:bg-[#eef0ff]"
                      >
                        <BookOpen className="h-4 w-4" />
                        {language === "PT" ? "Ver trecho na SOP" : "View SOP section"}
                        <ArrowRight className="h-3.5 w-3.5" />
                      </button>
                    </div>

                    <button
                      onClick={() => {
                        setSubmittedQuestion("");
                        setAnswer(null);
                        setQuestion("");
                      }}
                      className="mt-3 text-xs font-medium text-[#777b88] hover:text-[#0c1ba8]"
                    >
                      {language === "PT" ? "Fazer outra pergunta" : "Ask another question"}
                    </button>
                  </div>
                </div>
              ) : null}
            </div>
          )}
        </div>
      </div>
      </BorderBeam>
    </section>
  );
}
