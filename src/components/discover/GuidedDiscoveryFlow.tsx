import { useState, useEffect, useMemo } from "react";
import {
  Sparkles, ArrowLeft, ArrowRight, Check, Wand2, Target, Zap, Settings,
  Users, DollarSign, Shield, TrendingUp, Building, Clock, Package, Monitor,
  Scale, Cog, Megaphone, RefreshCw,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useValueChainStore } from "@/stores/valueChainStore";
import { IndicatorSummary } from "./IndicatorsPanel";
import { UnifiedResults } from "./UnifiedResults";

/* ====== Types ====== */
type Mode = "simulate" | "goal";

export interface ClarifyQA {
  question: string;
  answer: string;
  placeholder?: string;
}

export interface DiscoveryInput {
  mode: Mode;
  initiative: string;
  objective: string;
  selectedAreas: string[];
  selectedKPIs?: string[];
  valueLever: string;
  timeHorizon: "short" | "medium" | "long";
  clarifications: ClarifyQA[];
}

/* ====== Mock clarifying-questions engine ====== */
function getClarifyingQuestions(text: string, mode: Mode): ClarifyQA[] {
  const t = text.toLowerCase();
  const mk = (q: string, p: string): ClarifyQA => ({ question: q, answer: "", placeholder: p });

  if (t.includes("currícul") || t.includes("curricul") || t.includes("triagem")) {
    return [
      mk("Qual o volume mensal de currículos analisados hoje?", "Ex: ~3.500 currículos/mês"),
      mk("Quais canais alimentam essas candidaturas?", "Ex: LinkedIn, site da empresa, indicações"),
    ];
  }
  if (t.includes("aprovaç") || t.includes("workflow")) {
    return [
      mk("Quantas aprovações em média são processadas por mês?", "Ex: 1.200 aprovações/mês"),
      mk("Quais são os principais gargalos no fluxo atual?", "Ex: aprovação de gestores, falta de visibilidade"),
    ];
  }
  if (t.includes("ocr") || t.includes("documento")) {
    return [
      mk("Que tipos de documentos serão processados?", "Ex: notas fiscais, contratos, formulários"),
      mk("Qual o volume diário e os sistemas de destino?", "Ex: 800/dia, integrar com SAP e GED"),
    ];
  }
  if (t.includes("fechamento") || t.includes("contábil") || t.includes("contabil")) {
    return [
      mk("Quantos dias úteis leva o fechamento mensal hoje?", "Ex: 12 dias úteis"),
      mk("Quais sistemas estão envolvidos no processo?", "Ex: SAP, planilhas Excel, Power BI"),
    ];
  }
  if (t.includes("onboarding") || t.includes("admiss")) {
    return [
      mk("Quantas admissões são realizadas por mês?", "Ex: ~80 admissões/mês"),
      mk("Quais áreas participam do processo?", "Ex: RH, TI, Facilities, gestor direto"),
    ];
  }
  if (t.includes("portal") || t.includes("self-service") || t.includes("self service")) {
    return [
      mk("Quantos colaboradores usariam esse portal?", "Ex: 4.200 colaboradores"),
      mk("Quais são as 3 jornadas mais críticas hoje?", "Ex: férias, reembolso, atualização cadastral"),
    ];
  }
  if (t.includes("compras") || t.includes("supriment")) {
    return [
      mk("Qual o volume mensal de pedidos de compra?", "Ex: 2.500 PCs/mês"),
      mk("Onde está a maior fricção hoje?", "Ex: cotação manual, aprovações lentas"),
    ];
  }
  if (t.includes("atendimento") || t.includes("ia generativa") || t.includes("chatbot")) {
    return [
      mk("Qual o volume de chamados/tickets atendidos hoje?", "Ex: 6.000 tickets/mês"),
      mk("Quais bases de conhecimento devem alimentar a IA?", "Ex: Confluence, manuais internos, FAQs"),
    ];
  }
  if (mode === "goal") {
    return [
      mk("Qual o ponto de partida atual desse indicador?", "Ex: hoje gastamos R$ 1.2M/mês"),
      mk("Quais restrições devemos considerar?", "Ex: orçamento limitado, sem novos headcounts"),
    ];
  }
  // generic fallback
  return [
    mk("Qual o principal problema ou dor que motiva essa iniciativa?", "Ex: alto retrabalho e baixa visibilidade"),
    mk("Qual a frequência ou volume envolvido nesse processo hoje?", "Ex: ~500 ocorrências/mês"),
  ];
}

interface Props {
  mode: Mode;
  onBack: () => void;
  onResultsChange?: (v: boolean) => void;
}

/* ====== Static config ====== */
const SIMULATE_SUGGESTIONS = [
  {
    label: "Automação & IA", icon: Zap, items: [
      "Implementar IA generativa para atendimento interno",
      "Automatizar aprovações com workflow digital",
      "OCR para processamento de documentos",
    ],
  },
  {
    label: "Eficiência de Processo", icon: Settings, items: [
      "Eliminar retrabalho no fechamento mensal",
      "Padronizar o processo de onboarding",
      "Centralizar dados em sistema único",
    ],
  },
  {
    label: "Experiência", icon: Users, items: [
      "Criar portal self-service para colaboradores",
      "Reduzir fricção no processo de compras",
    ],
  },
];

const GOAL_SUGGESTIONS = [
  {
    label: "Redução de Custo", icon: DollarSign, items: [
      "Reduzir custo operacional do financeiro em 15%",
      "Diminuir headcount dedicado a tarefas manuais",
    ],
  },
  {
    label: "Velocidade", icon: Zap, items: [
      "Reduzir tempo de admissão em 30%",
      "Fechar o mês contábil em metade do tempo",
      "Aprovações em no máximo 24 horas",
    ],
  },
  {
    label: "Qualidade", icon: Shield, items: [
      "Zerar erros manuais no faturamento",
      "Aumentar NPS interno em 10 pontos",
      "100% de rastreabilidade nas aprovações",
    ],
  },
];

const AREA_ICONS: Record<string, LucideIcon> = {
  RH: Users, Financeiro: DollarSign, Suprimentos: Package, TI: Monitor,
  Jurídico: Scale, Operações: Cog, Marketing: Megaphone,
};
const FALLBACK_AREAS = ["RH", "Financeiro", "Suprimentos", "TI", "Jurídico", "Operações", "Marketing"];

interface LeverDef {
  name: string;
  description: string;
  kpis: string[];
  icon: LucideIcon;
  iconColor: string;
  gradient: string;
  accent: string;
}

const LEVERS: LeverDef[] = [
  { name: "Eficiência Operacional", description: "Reduzir tempo de execução, gargalos e desperdícios.", kpis: ["Tempo de ciclo", "Throughput", "% Retrabalho"], icon: Zap, iconColor: "#0C1BA8", gradient: "linear-gradient(135deg, #EEF0FF, #DBEAFE)", accent: "#0C1BA8" },
  { name: "Experiência do Colaborador", description: "Reduzir fricção e elevar o engajamento dos times.", kpis: ["eNPS", "Turnover", "Satisfação"], icon: Users, iconColor: "#7C3AED", gradient: "linear-gradient(135deg, #F5F3FF, #EDE9FE)", accent: "#7C3AED" },
  { name: "Custo Operacional", description: "Otimizar gastos diretos e indiretos do processo.", kpis: ["Custo unitário", "OPEX", "FTE"], icon: DollarSign, iconColor: "#0F766E", gradient: "linear-gradient(135deg, #F0FDF4, #DCFCE7)", accent: "#0F766E" },
  { name: "Qualidade & Compliance", description: "Reduzir erros, retrabalho e riscos regulatórios.", kpis: ["Taxa de erro", "Conformidade", "Auditoria"], icon: Shield, iconColor: "#B45309", gradient: "linear-gradient(135deg, #FFFBEB, #FEF3C7)", accent: "#B45309" },
  { name: "Velocidade de Decisão", description: "Acelerar análises, aprovações e ações executivas.", kpis: ["Lead time decisão", "SLA", "Time-to-action"], icon: TrendingUp, iconColor: "#BE185D", gradient: "linear-gradient(135deg, #FFF1F2, #FFE4E6)", accent: "#BE185D" },
];

const HORIZONS = [
  { id: "short" as const, label: "Curto prazo", range: "0-3 meses", icon: Zap, desc: "Ações rápidas com esforço baixo" },
  { id: "medium" as const, label: "Médio prazo", range: "3-12 meses", icon: Target, desc: "Projetos estruturados" },
  { id: "long" as const, label: "Longo prazo", range: "+12 meses", icon: TrendingUp, desc: "Transformações profundas" },
];

const KPIS = [
  { name: "Tempo de ciclo", category: "Tempo", color: "#0C1BA8" },
  { name: "Lead time", category: "Tempo", color: "#0C1BA8" },
  { name: "Tempo de aprovação", category: "Tempo", color: "#0C1BA8" },
  { name: "SLA cumprido", category: "Tempo", color: "#0C1BA8" },
  { name: "Custo por transação", category: "Custo", color: "#0F766E" },
  { name: "Custo por colaborador", category: "Custo", color: "#0F766E" },
  { name: "% desperdício", category: "Custo", color: "#0F766E" },
  { name: "Taxa de erro", category: "Qualidade", color: "#B45309" },
  { name: "% retrabalho", category: "Qualidade", color: "#B45309" },
  { name: "Índice de conformidade", category: "Qualidade", color: "#B45309" },
  { name: "NPS interno", category: "Satisfação", color: "#7C3AED" },
  { name: "Taxa de turnover", category: "Satisfação", color: "#7C3AED" },
];

/* ====== Component ====== */
export function GuidedDiscoveryFlow({ mode, onBack, onResultsChange }: Props) {
  const realChain = useValueChainStore((s) => s.l1Processes);
  const areas = useMemo(() => {
    if (realChain && realChain.length > 0) return realChain.map((l1) => ({ id: l1.id, name: l1.name, sub: `${l1.l2Processes?.length ?? 0} sub-áreas` }));
    return FALLBACK_AREAS.map((name) => ({ id: name, name, sub: "Mock" }));
  }, [realChain]);

  const totalSteps = mode === "simulate" ? 4 : 4;

  const [stepIdx, setStepIdx] = useState(0);
  const [direction, setDirection] = useState<"forward" | "back">("forward");
  const [input, setInput] = useState<DiscoveryInput>({
    mode, initiative: "", objective: "", selectedAreas: [],
    selectedKPIs: [], valueLever: "", timeHorizon: "medium",
    clarifications: [],
  });
  const [generated, setGenerated] = useState(false);

  // animation reset
  const [animKey, setAnimKey] = useState(0);
  useEffect(() => { setAnimKey((k) => k + 1); }, [stepIdx]);

  useEffect(() => { onResultsChange?.(generated); }, [generated, onResultsChange]);
  useEffect(() => () => { onResultsChange?.(false); }, [onResultsChange]);

  const goNext = () => { setDirection("forward"); setStepIdx((i) => Math.min(i + 1, totalSteps - 1)); };
  const goBack = () => { setDirection("back"); setStepIdx((i) => Math.max(i - 1, 0)); };
  const goTo = (i: number) => { setDirection(i > stepIdx ? "forward" : "back"); setStepIdx(i); };

  if (generated) {
    return <ResultsView input={input} onReset={() => { setGenerated(false); setStepIdx(0); }} onBack={onBack} />;
  }

  const modeMeta = mode === "simulate"
    ? { label: "Simular melhoria", icon: Wand2 }
    : { label: "Definir objetivo", icon: Target };

  const isLast = stepIdx === totalSteps - 1;
  const canContinue = validateStep(mode, stepIdx, input);

  const onContinue = () => {
    if (isLast) { setGenerated(true); return; }
    goNext();
  };

  return (
    <div style={{ padding: "48px 40px 80px", background: "#F4F5F8", minHeight: "calc(100vh - 64px)" }}>
      <div style={{ maxWidth: "760px", margin: "0 auto" }}>
        {/* Progress header */}
        <ProgressHeader
          mode={modeMeta}
          current={stepIdx}
          total={totalSteps}
          onBack={onBack}
          onStepClick={goTo}
        />

        {/* Card with animation */}
        <div
          key={animKey}
          style={{
            background: "#FFFFFF",
            border: "1px solid #E8E8EA",
            borderRadius: "20px",
            padding: "48px 52px",
            boxShadow: "0 4px 24px rgba(12,27,168,0.07), 0 1px 4px rgba(0,0,0,0.04)",
            animation: direction === "forward"
              ? "stepInForward 250ms ease-out"
              : "stepInBack 250ms ease-out",
          }}
        >
          {renderStep(mode, stepIdx, input, setInput, goTo)}

          {/* Navigation */}
          <div style={{
            marginTop: "28px", paddingTop: "28px",
            borderTop: "1px solid #F0F1F5",
            display: "flex", alignItems: "center", justifyContent: "space-between", gap: "12px",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
              {stepIdx > 0 && (
                <button onClick={goBack} style={navSecondary}>
                  <ArrowLeft size={14} /> Voltar
                </button>
              )}
              {isOptionalStep(mode, stepIdx) && (
                <button
                  onClick={() => { /* default already medium for horizon */ goNext(); }}
                  style={{ background: "none", border: "none", cursor: "pointer", fontSize: "12px", color: "#A5A7B0", padding: 0 }}
                >
                  Pular esta etapa
                </button>
              )}
            </div>
            <button
              disabled={!canContinue}
              onClick={onContinue}
              style={{
                display: "inline-flex", alignItems: "center", gap: "8px",
                background: canContinue
                  ? (isLast ? "linear-gradient(135deg, #04223D, #0C1BA8, #1428CC)" : "linear-gradient(135deg, #0C1BA8, #1E35D4)")
                  : "#E8E8EA",
                color: canContinue ? "#FFFFFF" : "#A5A7B0",
                border: "none", borderRadius: "10px",
                padding: isLast ? "14px 32px" : "12px 28px",
                fontSize: isLast ? "15px" : "14px", fontWeight: 700,
                cursor: canContinue ? "pointer" : "not-allowed",
                boxShadow: canContinue
                  ? (isLast ? "0 6px 20px rgba(12,27,168,0.4)" : "0 4px 14px rgba(12,27,168,0.35)")
                  : "none",
              }}
            >
              {isLast && <Sparkles size={15} />}
              {isLast ? "Gerar análise completa" : "Continuar"}
              <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes stepInForward {
          from { opacity: 0; transform: translateX(20px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        @keyframes stepInBack {
          from { opacity: 0; transform: translateX(-20px); }
          to   { opacity: 1; transform: translateX(0); }
        }
      `}</style>
    </div>
  );
}

const navSecondary: React.CSSProperties = {
  background: "none", border: "none", cursor: "pointer", padding: 0,
  fontSize: "13px", color: "#6B7280", display: "inline-flex", alignItems: "center", gap: "4px",
};

/* ====== Validation & step helpers ====== */
function validateStep(mode: Mode, idx: number, input: DiscoveryInput): boolean {
  const clarifyOk = input.clarifications.length === 0
    || input.clarifications.every((c) => c.answer.trim().length > 0);
  if (mode === "simulate") {
    if (idx === 0) return input.initiative.trim().length > 0 && clarifyOk;
    if (idx === 1) return !!input.valueLever;
    if (idx === 2) return !!input.timeHorizon;
    if (idx === 3) return true;
  } else {
    if (idx === 0) return input.objective.trim().length > 0 && clarifyOk;
    if (idx === 1) return (input.selectedKPIs?.length ?? 0) > 0;
    if (idx === 2) return !!input.timeHorizon;
    if (idx === 3) return true;
  }
  return false;
}

function isOptionalStep(mode: Mode, idx: number): boolean {
  if (mode === "simulate") return idx === 2;
  if (mode === "goal") return idx === 2;
  return false;
}

/* ====== Progress header ====== */
function ProgressHeader({
  mode, current, total, onBack, onStepClick,
}: {
  mode: { label: string; icon: LucideIcon };
  current: number; total: number;
  onBack: () => void; onStepClick: (i: number) => void;
}) {
  const Icon = mode.icon;
  return (
    <div style={{
      display: "flex", alignItems: "center", justifyContent: "space-between",
      marginBottom: "20px", gap: "16px",
    }}>
      {/* Left: back link + chip */}
      <div style={{ display: "flex", alignItems: "center", gap: "12px", minWidth: "200px" }}>
        <button onClick={onBack} style={navSecondary}>
          <ArrowLeft size={14} /> Trocar modo
        </button>
        <span style={{
          display: "inline-flex", alignItems: "center", gap: "6px",
          background: "#EEF0FF", color: "#0C1BA8",
          borderRadius: "999px", padding: "6px 14px",
          fontSize: "13px", fontWeight: 600,
        }}>
          <Icon size={13} color="#0C1BA8" /> {mode.label}
        </span>
      </div>

      {/* Center: dots */}
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: "0" }}>
        {Array.from({ length: total }).map((_, i) => {
          const completed = i < current;
          const active = i === current;
          return (
            <div key={i} style={{ display: "flex", alignItems: "center" }}>
              <button
                onClick={() => i <= current && onStepClick(i)}
                style={{
                  width: "10px", height: "10px", borderRadius: "50%",
                  background: completed || active ? "#0C1BA8" : "#E8E8EA",
                  border: "none",
                  cursor: i <= current ? "pointer" : "default",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  padding: 0,
                }}
              >
                {completed && <Check size={7} color="#FFFFFF" strokeWidth={4} />}
              </button>
              {i < total - 1 && (
                <div style={{
                  width: "32px", height: "1px",
                  background: i < current ? "#0C1BA8" : "#E8E8EA",
                }} />
              )}
            </div>
          );
        })}
      </div>

      {/* Right */}
      <div style={{ minWidth: "200px", textAlign: "right", fontSize: "12px", color: "#A5A7B0" }}>
        Etapa {current + 1} de {total}
      </div>
    </div>
  );
}

/* ====== Step renderer ====== */
function renderStep(
  mode: Mode, idx: number,
  input: DiscoveryInput,
  setInput: React.Dispatch<React.SetStateAction<DiscoveryInput>>,
  goTo: (i: number) => void,
) {
  if (mode === "simulate") {
    if (idx === 0) return <StepText
      question="O que você quer melhorar?"
      hint="Descreva em uma frase a iniciativa ou melhoria que você tem em mente. Não precisa ser perfeito — vamos refinar juntos."
      placeholder="Ex: Automatizar a triagem de currículos no RH"
      value={input.initiative}
      onChange={(v) => setInput({ ...input, initiative: v })}
      clarifications={input.clarifications}
      setClarifications={(qs) => setInput({ ...input, clarifications: qs })}
      mode="simulate"
    />;
    if (idx === 1) return <StepLever
      selected={input.valueLever}
      onSelect={(name) => setInput({ ...input, valueLever: name })}
    />;
    if (idx === 2) return <StepHorizon
      selected={input.timeHorizon}
      onSelect={(id) => setInput({ ...input, timeHorizon: id })}
    />;
    if (idx === 3) return <StepReview mode="simulate" input={input} goTo={goTo} />;
  } else {
    if (idx === 0) return <StepText
      question="Qual resultado de negócio você quer atingir?"
      hint="Descreva o objetivo em termos mensuráveis se possível. Ex: 'Reduzir em 30% o tempo de admissão' ou 'Eliminar erros manuais no faturamento'."
      placeholder="Ex: Reduzir em 30% o tempo de fechamento do mês no financeiro"
      value={input.objective}
      onChange={(v) => setInput({ ...input, objective: v })}
      clarifications={input.clarifications}
      setClarifications={(qs) => setInput({ ...input, clarifications: qs })}
      mode="goal"
    />;
    if (idx === 1) return <StepKPIs
      selected={input.selectedKPIs ?? []}
      onToggle={(name) => {
        const sel = input.selectedKPIs ?? [];
        setInput({
          ...input,
          selectedKPIs: sel.includes(name) ? sel.filter((k) => k !== name) : [...sel, name],
        });
      }}
    />;
    if (idx === 2) return <StepHorizon
      selected={input.timeHorizon}
      onSelect={(id) => setInput({ ...input, timeHorizon: id })}
    />;
    if (idx === 3) return <StepReview mode="goal" input={input} goTo={goTo} />;
  }
  return null;
}

/* ====== Shared AI message zone ====== */
function AIMessage({ question, hint }: { question: string; hint?: string }) {
  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "24px" }}>
        <div style={{
          width: "32px", height: "32px", borderRadius: "50%",
          background: "linear-gradient(135deg, #0C1BA8, #1E35D4)",
          display: "flex", alignItems: "center", justifyContent: "center",
          boxShadow: "0 2px 8px rgba(12,27,168,0.25)",
        }}>
          <Sparkles size={14} color="#FFFFFF" />
        </div>
        <span style={{ fontSize: "10.5px", fontWeight: 700, letterSpacing: "0.8px", textTransform: "uppercase", color: "#0C1BA8" }}>
          Assistente IA
        </span>
      </div>
      <h2 style={{ fontSize: "20px", fontWeight: 600, color: "#272727", margin: 0, lineHeight: 1.4 }}>
        {question}
      </h2>
      {hint && (
        <p style={{ fontSize: "13px", color: "#6B7280", margin: "12px 0 0 0", lineHeight: 1.6 }}>
          {hint}
        </p>
      )}
    </div>
  );
}

function ResponseZone({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ marginTop: "28px", paddingTop: "28px", borderTop: "1px dashed #F0F1F5" }}>
      {children}
    </div>
  );
}

/* ====== Step: Text input + clarifying chat ====== */
function StepText({
  question, hint, placeholder, value, onChange,
  clarifications, setClarifications, mode,
}: {
  question: string; hint: string; placeholder: string;
  value: string; onChange: (v: string) => void;
  clarifications: ClarifyQA[];
  setClarifications: (qs: ClarifyQA[]) => void;
  mode: Mode;
}) {
  const [focus, setFocus] = useState(false);
  const [submitted, setSubmitted] = useState(value.trim().length > 0 && clarifications.length > 0);
  const max = 200;

  const handleSubmit = () => {
    if (value.trim().length === 0) return;
    const qs = getClarifyingQuestions(value, mode);
    setClarifications(qs);
    setSubmitted(true);
  };

  // Auto-submit (debounced) so we don't need a separate "Enviar para IA" button —
  // the bottom "Continuar" becomes the single action.
  useEffect(() => {
    if (submitted) return;
    if (value.trim().length === 0) return;
    const t = setTimeout(() => handleSubmit(), 700);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, submitted]);

  const handleEdit = () => {
    setSubmitted(false);
    setClarifications([]);
  };

  return (
    <div>
      <AIMessage question={question} hint={hint} />
      <ResponseZone>
        {!submitted ? (
          <>
            <div style={{ position: "relative" }}>
              <input
                value={value}
                onChange={(e) => onChange(e.target.value.slice(0, max))}
                onFocus={() => setFocus(true)}
                onBlur={() => setFocus(false)}
                onKeyDown={(e) => { if (e.key === "Enter" && value.trim()) handleSubmit(); }}
                placeholder={placeholder}
                style={{
                  width: "100%", border: `2px solid ${focus ? "#0C1BA8" : "#E8E8EA"}`,
                  borderRadius: "12px", padding: "16px 20px",
                  fontSize: "16px", lineHeight: 1.5, outline: "none",
                  boxShadow: focus ? "0 0 0 3px rgba(12,27,168,0.08)" : "none",
                  transition: "all 150ms",
                }}
              />
              <div style={{ position: "absolute", right: "16px", bottom: "-22px", fontSize: "12px", color: "#A5A7B0" }}>
                {value.length}/{max}
              </div>
            </div>
          </>

        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            {/* User message bubble */}
            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <div style={{
                maxWidth: "80%", background: "#EEF0FF", color: "#0C1BA8",
                border: "1px solid #C7CEFF", borderRadius: "14px 14px 4px 14px",
                padding: "12px 16px", fontSize: "14px", lineHeight: 1.5, fontWeight: 500,
              }}>
                {value}
              </div>
            </div>
            <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "-12px" }}>
              <button onClick={handleEdit} style={{
                background: "none", border: "none", cursor: "pointer",
                fontSize: "11.5px", color: "#0C1BA8", fontWeight: 600, padding: 0,
              }}>
                Editar resposta
              </button>
            </div>

            {/* AI clarifying intro */}
            <div style={{
              display: "flex", gap: "10px", alignItems: "flex-start",
              background: "#F8F9FF", border: "1px solid #E8E8EA",
              borderRadius: "12px", padding: "14px 16px",
            }}>
              <div style={{
                width: "28px", height: "28px", borderRadius: "50%",
                background: "linear-gradient(135deg, #0C1BA8, #1E35D4)",
                display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
              }}>
                <Sparkles size={12} color="#FFFFFF" />
              </div>
              <p style={{ fontSize: "13.5px", color: "#374151", margin: 0, lineHeight: 1.55 }}>
                Para refinar a análise, preciso entender alguns detalhes específicos do seu caso.
                Responda às perguntas abaixo:
              </p>
            </div>

            {/* Clarifying questions */}
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              {clarifications.map((c, i) => (
                <div key={i}>
                  <label style={{
                    display: "block", fontSize: "13px", fontWeight: 600,
                    color: "#272727", marginBottom: "8px", lineHeight: 1.45,
                  }}>
                    <span style={{ color: "#0C1BA8", marginRight: "6px" }}>{i + 1}.</span>
                    {c.question}
                  </label>
                  <input
                    value={c.answer}
                    onChange={(e) => {
                      const next = [...clarifications];
                      next[i] = { ...c, answer: e.target.value };
                      setClarifications(next);
                    }}
                    placeholder={c.placeholder}
                    style={{
                      width: "100%", border: "1.5px solid #E8E8EA",
                      borderRadius: "10px", padding: "12px 14px",
                      fontSize: "14px", outline: "none", transition: "all 150ms",
                    }}
                    onFocus={(e) => { e.currentTarget.style.borderColor = "#0C1BA8"; e.currentTarget.style.boxShadow = "0 0 0 3px rgba(12,27,168,0.08)"; }}
                    onBlur={(e) => { e.currentTarget.style.borderColor = "#E8E8EA"; e.currentTarget.style.boxShadow = "none"; }}
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </ResponseZone>
    </div>
  );
}

/* ====== Step: Areas ====== */
function StepAreas({ question, hint, selected, onToggle }: {
  question: string; hint: string;
  areas: unknown[];
  selected: string[]; onToggle: (name: string) => void;
}) {
  const realChain = useValueChainStore((s) => s.l1Processes);
  const list = useMemo(() => {
    if (realChain && realChain.length > 0) {
      return realChain.map((l1) => ({
        name: l1.name,
        sub: `${l1.l2Processes?.length ?? 0} sub-áreas`,
      }));
    }
    return FALLBACK_AREAS.map((name) => ({ name, sub: "Mock" }));
  }, [realChain]);

  return (
    <div>
      <AIMessage question={question} hint={hint} />
      <ResponseZone>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "12px" }}>
          {list.map((a) => {
            const Icon = AREA_ICONS[a.name] ?? Building;
            const isSel = selected.includes(a.name);
            return (
              <button
                key={a.name}
                onClick={() => onToggle(a.name)}
                style={{
                  position: "relative", textAlign: "left",
                  padding: "16px 18px", borderRadius: "12px",
                  border: `1.5px solid ${isSel ? "#0C1BA8" : "#E8E8EA"}`,
                  background: isSel ? "#F8F9FF" : "#FFFFFF",
                  cursor: "pointer", display: "flex", alignItems: "center", gap: "12px",
                  transition: "all 150ms",
                }}
                onMouseEnter={(e) => {
                  if (!isSel) {
                    e.currentTarget.style.borderColor = "#A5B4FC";
                    e.currentTarget.style.background = "#FAFBFF";
                    e.currentTarget.style.transform = "translateY(-2px)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isSel) {
                    e.currentTarget.style.borderColor = "#E8E8EA";
                    e.currentTarget.style.background = "#FFFFFF";
                    e.currentTarget.style.transform = "translateY(0)";
                  }
                }}
              >
                <div style={{
                  width: "36px", height: "36px", borderRadius: "10px",
                  background: "#EEF0FF", display: "flex", alignItems: "center", justifyContent: "center",
                  flexShrink: 0,
                }}>
                  <Icon size={16} color="#0C1BA8" />
                </div>
                <div style={{ minWidth: 0, flex: 1 }}>
                  <div style={{ fontSize: "14px", fontWeight: 600, color: "#272727", lineHeight: 1.2 }}>{a.name}</div>
                  <div style={{ fontSize: "12px", color: "#A5A7B0", marginTop: "2px" }}>{a.sub}</div>
                </div>
                {isSel && (
                  <div style={{
                    position: "absolute", top: "8px", right: "8px",
                    width: "16px", height: "16px", borderRadius: "50%",
                    background: "#0C1BA8", display: "flex", alignItems: "center", justifyContent: "center",
                  }}>
                    <Check size={10} color="#FFFFFF" strokeWidth={3} />
                  </div>
                )}
              </button>
            );
          })}
        </div>
        {selected.length > 0 && (
          <div style={{ marginTop: "16px", fontSize: "13px", color: "#0C1BA8", fontWeight: 600 }}>
            {selected.length} área{selected.length > 1 ? "s" : ""} selecionada{selected.length > 1 ? "s" : ""}
          </div>
        )}
      </ResponseZone>
    </div>
  );
}

/* ====== Step: Lever ====== */
function StepLever({ selected, onSelect }: { selected: string; onSelect: (n: string) => void }) {
  return (
    <div>
      <AIMessage
        question="Qual o principal resultado que você espera com essa melhoria?"
        hint="Isso define a alavanca estratégica da análise. A IA usará isso para priorizar oportunidades e selecionar benchmarks relevantes."
      />
      <ResponseZone>
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {LEVERS.map((l) => {
            const Icon = l.icon;
            const isSel = selected === l.name;
            return (
              <button
                key={l.name}
                onClick={() => onSelect(l.name)}
                style={{
                  textAlign: "left",
                  padding: "18px 20px", borderRadius: "12px",
                  border: `1.5px solid ${isSel ? l.accent : "#E8E8EA"}`,
                  background: isSel ? `${l.accent}08` : "#FFFFFF",
                  cursor: "pointer", display: "flex", alignItems: "center", gap: "16px",
                  transition: "all 150ms",
                }}
              >
                <div style={{
                  width: "40px", height: "40px", borderRadius: "10px",
                  background: l.gradient, display: "flex", alignItems: "center", justifyContent: "center",
                  flexShrink: 0,
                }}>
                  <Icon size={18} color={l.iconColor} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: "14px", fontWeight: 600, color: "#272727" }}>{l.name}</div>
                  <div style={{ fontSize: "12px", color: "#6B7280", lineHeight: 1.5, marginTop: "2px" }}>{l.description}</div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginTop: "10px" }}>
                    {l.kpis.map((k) => (
                      <span key={k} style={{
                        fontSize: "10px", padding: "3px 8px", borderRadius: "999px",
                        background: isSel ? `${l.accent}15` : "#F4F5F8",
                        color: isSel ? l.accent : "#A5A7B0",
                        fontWeight: 500,
                      }}>{k}</span>
                    ))}
                  </div>
                </div>
                <div style={{
                  width: "20px", height: "20px", borderRadius: "50%",
                  border: `2px solid ${isSel ? l.accent : "#E8E8EA"}`,
                  background: isSel ? l.accent : "transparent",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  flexShrink: 0,
                }}>
                  {isSel && <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#FFFFFF" }} />}
                </div>
              </button>
            );
          })}
        </div>
      </ResponseZone>
    </div>
  );
}

/* ====== Step: Horizon ====== */
function StepHorizon({ selected, onSelect }: { selected: DiscoveryInput["timeHorizon"]; onSelect: (id: DiscoveryInput["timeHorizon"]) => void }) {
  return (
    <div>
      <AIMessage
        question="Em quanto tempo essa mudança precisa acontecer?"
        hint="Isso impacta a viabilidade das oportunidades sugeridas e o nível de esforço aceitável para cada uma."
      />
      <ResponseZone>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "12px" }}>
          {HORIZONS.map((h) => {
            const Icon = h.icon;
            const isSel = selected === h.id;
            return (
              <button
                key={h.id}
                onClick={() => onSelect(h.id)}
                style={{
                  position: "relative", textAlign: "center",
                  padding: "24px 20px", borderRadius: "14px",
                  border: `1.5px solid ${isSel ? "#0C1BA8" : "#E8E8EA"}`,
                  background: isSel ? "linear-gradient(180deg, #F8F9FF, #FFFFFF)" : "#FFFFFF",
                  cursor: "pointer", transition: "all 150ms",
                  boxShadow: isSel ? "0 0 0 3px rgba(12,27,168,0.08)" : "none",
                }}
                onMouseEnter={(e) => {
                  if (!isSel) {
                    e.currentTarget.style.borderColor = "#A5B4FC";
                    e.currentTarget.style.transform = "translateY(-3px)";
                    e.currentTarget.style.boxShadow = "0 4px 12px rgba(12,27,168,0.08)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isSel) {
                    e.currentTarget.style.borderColor = "#E8E8EA";
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "none";
                  }
                }}
              >
                <div style={{
                  width: "44px", height: "44px", borderRadius: "12px",
                  background: "#EEF0FF", display: "flex", alignItems: "center", justifyContent: "center",
                  margin: "0 auto",
                }}>
                  <Icon size={20} color="#0C1BA8" />
                </div>
                <div style={{ fontSize: "14px", fontWeight: 700, color: "#272727", marginTop: "12px" }}>{h.label}</div>
                <div style={{ fontSize: "11px", color: "#A5A7B0", textTransform: "uppercase", letterSpacing: "0.5px", marginTop: "4px" }}>{h.range}</div>
                <div style={{ fontSize: "12px", color: "#6B7280", marginTop: "6px", lineHeight: 1.5 }}>{h.desc}</div>
                {isSel && (
                  <div style={{
                    position: "absolute", top: "8px", right: "8px",
                    width: "18px", height: "18px", borderRadius: "50%",
                    background: "#0C1BA8", display: "flex", alignItems: "center", justifyContent: "center",
                  }}>
                    <Check size={11} color="#FFFFFF" strokeWidth={3} />
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </ResponseZone>
    </div>
  );
}

/* ====== Step: KPIs (goal mode) ====== */
function StepKPIs({ selected, onToggle }: { selected: string[]; onToggle: (n: string) => void }) {
  const grouped = useMemo(() => {
    const map: Record<string, typeof KPIS> = {};
    for (const k of KPIS) {
      if (!map[k.category]) map[k.category] = [];
      map[k.category].push(k);
    }
    return map;
  }, []);

  return (
    <div>
      <AIMessage
        question="Como você saberia que atingiu esse objetivo?"
        hint="Selecione os indicadores que melhor representam o sucesso. Isso ajuda a IA a focar nas oportunidades certas."
      />
      <ResponseZone>
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          {Object.entries(grouped).map(([cat, items]) => (
            <div key={cat}>
              <div style={{ fontSize: "11.5px", fontWeight: 600, color: "#6B7280", marginBottom: "10px" }}>{cat}</div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "8px" }}>
                {items.map((k) => {
                  const isSel = selected.includes(k.name);
                  return (
                    <button
                      key={k.name}
                      onClick={() => onToggle(k.name)}
                      style={{
                        display: "flex", alignItems: "center", gap: "10px",
                        padding: "10px 14px", borderRadius: "8px",
                        border: `1.5px solid ${isSel ? "#0C1BA8" : "#E8E8EA"}`,
                        background: isSel ? "#EEF0FF" : "#FFFFFF",
                        color: isSel ? "#0C1BA8" : "#374151",
                        fontSize: "13px", fontWeight: 500, cursor: "pointer",
                        textAlign: "left", transition: "all 120ms",
                      }}
                    >
                      <span style={{
                        width: "6px", height: "6px", borderRadius: "50%",
                        background: isSel ? "#0C1BA8" : k.color, flexShrink: 0,
                      }} />
                      {k.name}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
        {selected.length > 0 && (
          <div style={{ marginTop: "16px", fontSize: "13px", color: "#0C1BA8", fontWeight: 600 }}>
            {selected.length} indicador{selected.length > 1 ? "es" : ""} selecionado{selected.length > 1 ? "s" : ""}
          </div>
        )}
      </ResponseZone>
    </div>
  );
}

/* ====== Step: Review ====== */
function StepReview({ mode, input, goTo }: { mode: Mode; input: DiscoveryInput; goTo: (i: number) => void }) {
  const lever = LEVERS.find((l) => l.name === input.valueLever);
  const horizon = HORIZONS.find((h) => h.id === input.timeHorizon);
  const headline = mode === "simulate" ? input.initiative : input.objective;
  const leverName = lever?.name ?? "Eficiência Operacional";
  const areasText = "as áreas que a IA identificar como impactadas";

  return (
    <div>
      <AIMessage
        question="Tudo certo! Revise sua análise antes de gerar."
        hint="A IA vai cruzar essas informações com sua cadeia de valor e gerar oportunidades, casos de uso e processos a transformar."
      />
      <ResponseZone>
        <div style={{ display: "flex", flexDirection: "column", gap: "0", border: "1px solid #F0F1F5", borderRadius: "12px", overflow: "hidden" }}>
          <ReviewRow
            icon={Wand2} iconColor="#0C1BA8"
            label={mode === "simulate" ? "Iniciativa" : "Objetivo"}
            valueNode={<span style={{ fontStyle: "italic", color: "#0C1BA8" }}>"{headline || "—"}"</span>}
            onEdit={() => goTo(0)}
          />
          {mode === "simulate" ? (
            <ReviewRow
              icon={Building} iconColor="#0C1BA8"
              label="Áreas envolvidas"
              valueNode={
                <span style={{ display: "inline-flex", alignItems: "center", gap: "6px", color: "#6B7280", fontStyle: "italic" }}>
                  <Sparkles size={12} color="#0C1BA8" />
                  Identificadas automaticamente pela IA
                </span>
              }
              onEdit={() => goTo(0)}
            />
          ) : (
            <ReviewRow
              icon={Target} iconColor="#0C1BA8"
              label="Indicadores de sucesso"
              valueNode={
                <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                  {(input.selectedKPIs ?? []).length > 0 ? (input.selectedKPIs ?? []).map((k) => (
                    <span key={k} style={{
                      background: "#EEF0FF", color: "#0C1BA8",
                      padding: "3px 9px", borderRadius: "999px", fontSize: "12px", fontWeight: 600,
                    }}>{k}</span>
                  )) : <span style={{ color: "#A5A7B0" }}>—</span>}
                </div>
              }
              onEdit={() => goTo(1)}
            />
          )}
          {input.clarifications.length > 0 && (
            <ReviewRow
              icon={Sparkles} iconColor="#0C1BA8"
              label="Detalhes adicionais"
              valueNode={
                <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                  {input.clarifications.map((c, i) => (
                    <div key={i} style={{ fontSize: "13px", color: "#374151", lineHeight: 1.5 }}>
                      <span style={{ color: "#A5A7B0" }}>{c.question}</span>
                      <br />
                      <span style={{ fontWeight: 600, color: "#272727" }}>{c.answer || "—"}</span>
                    </div>
                  ))}
                </div>
              }
              onEdit={() => goTo(0)}
            />
          )}
          {mode === "simulate" && lever && (
            <ReviewRow
              icon={lever.icon} iconColor={lever.iconColor}
              label="Alavanca principal"
              valueNode={
                <div>
                  <div style={{ fontSize: "14px", fontWeight: 600, color: "#272727" }}>{lever.name}</div>
                  <div style={{ fontSize: "12px", color: "#6B7280" }}>{lever.description}</div>
                </div>
              }
              onEdit={() => goTo(1)}
            />
          )}
          <ReviewRow
            icon={Clock} iconColor="#0C1BA8"
            label="Horizonte"
            valueNode={<span style={{ fontWeight: 600, color: "#272727" }}>{horizon?.label} · <span style={{ color: "#6B7280", fontWeight: 400 }}>{horizon?.range}</span></span>}
            onEdit={() => goTo(mode === "simulate" ? 3 : 2)}
            isLast
          />
        </div>

        <div style={{
          marginTop: "20px",
          background: "linear-gradient(135deg, #EEF0FF, #DBEAFE)",
          border: "1px solid #C7CEFF", borderRadius: "12px",
          padding: "16px 18px", display: "flex", alignItems: "flex-start", gap: "12px",
        }}>
          <Sparkles size={16} color="#0C1BA8" style={{ flexShrink: 0, marginTop: "2px" }} />
          <p style={{ fontSize: "14px", color: "#1E40AF", lineHeight: 1.65, margin: 0 }}>
            A análise vai identificar oportunidades de <b>{leverName}</b>, correlacionar processos em <b>{areasText}</b> e comparar com benchmarks do setor.
          </p>
        </div>
      </ResponseZone>
    </div>
  );
}

function ReviewRow({ icon: Icon, iconColor, label, valueNode, onEdit, isLast }: {
  icon: LucideIcon;
  iconColor: string;
  label: string;
  valueNode: React.ReactNode;
  onEdit: () => void;
  isLast?: boolean;
}) {
  return (
    <div style={{
      display: "flex", alignItems: "center", gap: "12px",
      padding: "14px 16px",
      borderBottom: isLast ? "none" : "1px solid #F0F1F5",
      background: "#FFFFFF",
    }}>
      <div style={{
        width: "28px", height: "28px", borderRadius: "8px",
        background: "#EEF0FF", display: "flex", alignItems: "center", justifyContent: "center",
        flexShrink: 0,
      }}>
        <Icon size={14} color={iconColor} />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: "10.5px", color: "#A5A7B0", textTransform: "uppercase", letterSpacing: "0.6px", fontWeight: 600, marginBottom: "3px" }}>{label}</div>
        <div style={{ fontSize: "14px", color: "#272727" }}>{valueNode}</div>
      </div>
      <button onClick={onEdit} style={{
        background: "none", border: "none", cursor: "pointer",
        fontSize: "12px", color: "#0C1BA8", fontWeight: 600, padding: "4px 8px",
      }}>
        Editar
      </button>
    </div>
  );
}

/* ====== Results ====== */
function ResultsView({ input, onReset, onBack }: { input: DiscoveryInput; onReset: () => void; onBack: () => void }) {
  const summary: IndicatorSummary = {
    sentiment: "positivo",
    confidence: input.mode === "simulate" ? 78 : 72,
    impact: "Alto",
    scale: input.selectedAreas.length > 0
      ? `${input.selectedAreas.length} área(s) impactada(s)`
      : "Toda a operação",
    areas: Math.max(input.selectedAreas.length, 3),
    processes: 9,
    systems: 5,
  };
  const title = input.mode === "simulate" ? input.initiative : input.objective;
  const leverName = input.valueLever || "Eficiência Operacional";
  const leverNarratives: Record<string, string> = {
    "Eficiência Operacional": `Análise focada em Eficiência Operacional revelou ganhos de produtividade via automação e padronização. Estimamos redução de 35–50% no tempo de ciclo dos processos transacionais, com payback médio de 6 meses e R$ 1,8M/ano em ganho recorrente.`,
    "Experiência do Colaborador": `Sob a ótica de Experiência do Colaborador, identificamos atritos em jornadas-chave (admissão, aprovações, suporte). As iniciativas reduzem retrabalho em 40% e elevam o eNPS projetado em 12 pontos, com tração rápida em quick wins.`,
    "Custo Operacional": `Olhando para Custo Operacional, mapeamos R$ 1,8M/ano de ganho potencial concentrado em automação de tarefas manuais e renegociação de fluxos. 60% do ganho vem de 3 oportunidades de alto impacto e baixo esforço.`,
    "Qualidade & Compliance": `Na ótica de Qualidade & Compliance, as oportunidades reduzem erros operacionais em 50% e fortalecem trilhas de auditoria. Mitigam riscos críticos identificados em 3 áreas, com payback estimado entre 4 e 8 meses.`,
    "Velocidade de Decisão": `Focando em Velocidade de Decisão, as iniciativas encurtam ciclos de aprovação e disponibilizam dados em tempo real. Projetamos redução de 60% no lead-time decisório dos fluxos críticos da operação.`,
  };
  const subtitle = input.mode === "simulate"
    ? leverNarratives[leverName] ?? leverNarratives["Eficiência Operacional"]
    : `Para atingir "${title}", a análise priorizou alavanca de ${leverName}. Foram identificadas iniciativas coesas que se reforçam, com ganho composto estimado de R$ 1,8M/ano e payback entre 4 e 8 meses.`;

  return (
    <UnifiedResults
      mode={input.mode}
      title={title}
      subtitle={subtitle}
      summary={summary}
      goalChip={input.mode === "goal" ? title : undefined}
      sourceContext={title}
      onReset={onReset}
      onBack={onBack}
      focusLever={leverName as any}
    />
  );
}
