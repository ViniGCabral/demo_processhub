import React, { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  ArrowLeft, ArrowRight, ArrowUp, Check, Workflow, Search, FileText, Brain, BarChart3,
  Sparkles, AlertCircle, TrendingUp, Clock, DollarSign, Target, Lightbulb,
  Plus, X, ChevronRight, ChevronDown, BookOpen, Zap, Users, Activity, CheckCircle2, Edit3,
  RefreshCw, Download, Save, Send, Info, Wand2, FileCheck, AlertTriangle, Shield, Gauge,
  Bookmark, BookmarkCheck,
} from "lucide-react";
import { TopBar } from "@/components/layout/TopBar";
import { useLanguage } from "@/contexts/LanguageContext";
import { mockOpportunities, defaultLenses, VALUE_LEVERS_META } from "@/data/discoverMockData";
import { useProcessStore } from "@/stores/processStore";
import { useValueChainStore } from "@/stores/valueChainStore";
import { useOpportunityStore } from "@/stores/opportunityStore";
import { FileSearch } from "lucide-react";
import { BacklogTag } from "@/components/common/BacklogTag";
import { toast } from "sonner";

interface Props { onLogout?: () => void; embedded?: boolean; initialProcessName?: string; initialContext?: string; initialStep?: StepId; hasFullDocumentation?: boolean; initialArea?: string; initialSystems?: string[]; }

type StepId = "selection" | "diagnosis" | "context" | "analysis" | "businesscase" | "tobe";

const STEPS: { id: StepId; label: string; icon: any }[] = [
  { id: "context", label: "Contexto", icon: BookOpen },
  { id: "analysis", label: "Análise", icon: Brain },
  { id: "tobe", label: "TO-BE", icon: Workflow },
  { id: "businesscase", label: "Business Case", icon: BarChart3 },
];

// ---------- Tokens ----------
const C = {
  primary: "#0C1BA8",
  primaryDeep: "#1E35D4",
  primaryBg: "#EEF0FF",
  primaryBgSoft: "#F8F9FF",
  primaryBorder: "#C7CEFF",
  text: "#272727",
  muted: "#6B7280",
  mutedSoft: "#A5A7B0",
  border: "#E8E8EA",
  borderSoft: "#F0F1F5",
  bg: "#F4F5F8",
  surface: "#FAFBFF",
  white: "#FFFFFF",
  success: "#16A34A",
  successBg: "#F0FDF4",
  successBorder: "#BBF7D0",
  warning: "#F59E0B",
  warningBg: "#FFFDF5",
  warningBorder: "#FEF08A",
  danger: "#B91C1C",
  dangerBg: "#FEF9F9",
  dangerBorder: "#FECACA",
};

const STEP_SUBLABELS: Record<string, string> = {
  selection: "Escolha o processo a transformar",
  diagnosis: "Mapeie o estado atual (AS-IS)",
  context: "Configure alavancas e fontes",
  analysis: "IA identifica gargalos e causas raiz",
  businesscase: "Calcule o ROI da transformação",
  tobe: "Redesenhe e defina o plano de ação",
};

export function TransformProcesses({ onLogout, embedded = false, initialProcessName, initialContext, initialStep, hasFullDocumentation = true, initialArea, initialSystems }: Props) {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const processes = useProcessStore((s) => s.processes);
  const [searchParams] = useSearchParams();

  const opportunityIdParam = searchParams.get("opportunityId");
  const processNameParam = initialProcessName ?? searchParams.get("processName") ?? "";
  const contextParam = initialContext ?? searchParams.get("context") ?? "";
  const startStepParam = (initialStep as string) ?? searchParams.get("startStep") ?? "";

  const startIdx = STEPS.findIndex((s) => s.id === startStepParam);
  const [currentStep, setCurrentStep] = useState<number>(startIdx >= 0 ? startIdx : 0);

  // Gate (only shown when full documentation is missing)
  const [gateResolved, setGateResolved] = useState<boolean>(hasFullDocumentation);
  const [assessmentUnavailable, setAssessmentUnavailable] = useState<boolean>(!hasFullDocumentation);
  const [gateChoice, setGateChoice] = useState<null | "docs" | "scope">(null);
  const [scopeData, setScopeData] = useState<any>(null);
  const [showNewDocsDialog, setShowNewDocsDialog] = useState<boolean>(false);
  const [hadInitialDocs] = useState<boolean>(hasFullDocumentation);

  useEffect(() => {
    if (!hadInitialDocs && hasFullDocumentation && assessmentUnavailable && gateResolved) {
      setShowNewDocsDialog(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasFullDocumentation]);
  type SelectionType = "saved_opportunity" | "existing_process" | "new_process" | null;
  const [selectionType, setSelectionType] = useState<SelectionType>(null);
  const [selectedOppId, setSelectedOppId] = useState<string | null>(null);
  const [selectedProcessId, setSelectedProcessId] = useState<string | null>(null);
  const [processQuery, setProcessQuery] = useState("");
  const [customProcess, setCustomProcess] = useState<{ name: string; area: string; systems: string[]; description: string }>({
    name: "", area: "", systems: [], description: "",
  });

  // Pre-fill from incoming opportunity / process (deep link)
  useEffect(() => {
    if (opportunityIdParam) {
      const matchOpp = mockOpportunities.find((o) => o.id === opportunityIdParam);
      if (matchOpp) {
        setSelectionType("saved_opportunity");
        setSelectedOppId(matchOpp.id);
        return;
      }
    }
    if (processNameParam) {
      const match = processes.find((p) =>
        p.name.toLowerCase() === processNameParam.toLowerCase()
        || processNameParam.toLowerCase().includes(p.name.toLowerCase())
      );
      if (match) {
        setSelectionType("existing_process");
        setSelectedProcessId(match.id);
      } else {
        setSelectionType("new_process");
        setCustomProcess({
          name: processNameParam.split(" > ").pop() ?? processNameParam,
          area: "",
          systems: [],
          description: contextParam,
        });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [opportunityIdParam, processNameParam]);

  // Context
  const [knowledgeSources, setKnowledgeSources] = useState<string[]>([
    "Política de Compliance v3.2",
    "Manual de SLA do Financeiro",
    "Sistema SAP — Módulo FI",
  ]);
  const [newSource, setNewSource] = useState("");
  const [selectedLenses, setSelectedLenses] = useState<string[]>(["Eficiência Operacional", "Exp. do Colaborador"]);
  const [hypothesis, setHypothesis] = useState("");

  // Analysis
  const [analyzing, setAnalyzing] = useState(false);
  const [analysisDone, setAnalysisDone] = useState(false);

  const selectedOpp = useMemo(
    () => mockOpportunities.find((o) => o.id === selectedOppId),
    [selectedOppId]
  );
  const selectedProcess = useMemo(
    () => processes.find((p) => p.id === selectedProcessId),
    [processes, selectedProcessId]
  );
  const subject = selectedOpp?.title || selectedProcess?.name || customProcess.name || "Processo selecionado";
  const isSpanLayerDemo = (subject || "").toLowerCase().includes("span") && (subject || "").toLowerCase().includes("layer");

  const filteredProcesses = useMemo(() => {
    if (!processQuery.trim()) return processes.slice(0, 8);
    const q = processQuery.toLowerCase();
    return processes.filter((p) => p.name.toLowerCase().includes(q)).slice(0, 12);
  }, [processes, processQuery]);

  const canAdvance = (): boolean => {
    if (currentStep === 0) return selectedLenses.length > 0;
    if (currentStep === 1) return analysisDone;
    return true;
  };

  const next = () => {
    if (!canAdvance()) return;
    if (currentStep === 0 && !analysisDone) {
      setCurrentStep(1);
      runAnalysis();
      return;
    }
    setCurrentStep((s) => Math.min(s + 1, STEPS.length - 1));
  };
  const back = () => setCurrentStep((s) => Math.max(s - 1, 0));

  const runAnalysis = () => {
    setAnalyzing(true);
    setAnalysisDone(false);
    setTimeout(() => {
      setAnalyzing(false);
      setAnalysisDone(true);
    }, 2200);
  };

  // Step transition
  const [entering, setEntering] = useState(false);
  useEffect(() => {
    setEntering(true);
    const t = setTimeout(() => setEntering(false), 250);
    // Reset scroll to top on step change
    window.scrollTo({ top: 0, behavior: "auto" });
    document.querySelectorAll<HTMLElement>("[data-scroll-container]").forEach((el) => {
      el.scrollTop = 0;
    });
    return () => clearTimeout(t);
  }, [currentStep]);

  const isLast = currentStep === STEPS.length - 1;
  const progressPct = Math.round((currentStep / (STEPS.length - 1)) * 100);

  return (
    <div className={embedded ? "flex flex-col" : "min-h-screen flex flex-col"} style={{ background: C.bg, ...(embedded ? { height: "100%" } : {}) }}>
      {!embedded && <TopBar onLogout={onLogout!} />}
      <BacklogTag fixed />

      {/* Action Bar */}
      {!embedded && (
        <div style={{
          height: 48, background: C.white, borderBottom: `1px solid ${C.border}`,
          padding: "0 40px", display: "flex", alignItems: "center", justifyContent: "space-between",
          flexShrink: 0,
        }}>
          <div style={{ display: "flex", alignItems: "center" }}>
            <button
              onClick={() => navigate("/org-intelligence-hub")}
              style={{
                display: "inline-flex", alignItems: "center", gap: 6, fontSize: 13,
                color: C.muted, background: "transparent", border: "none",
                cursor: "pointer", padding: 0,
              }}
            >
              <ArrowLeft size={14} /> Voltar ao Hub
            </button>
            <div style={{ width: 1, height: 16, background: C.border, margin: "0 12px" }} />
            <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13 }}>
              <span style={{ color: C.mutedSoft }}>Org Intelligence</span>
              <ChevronRight size={12} color={C.mutedSoft} />
              <span style={{ color: C.text, fontWeight: 500 }}>Esteira de Transformação</span>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            {(selectedOpp || selectedProcess || customProcess.name) && (
              <div style={{
                display: "inline-flex", alignItems: "center", gap: 6,
                background: C.primaryBg, color: C.primary,
                border: `1px solid ${C.primaryBorder}`, borderRadius: 8,
                padding: "6px 12px", fontSize: 12, fontWeight: 600,
                maxWidth: 320, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
              }}>
                <Sparkles size={12} /> {subject}
              </div>
            )}
            <button style={btnGhost(false)} onClick={() => toast.success("Transformação salva")}>
              <Save size={14} /> Salvar
            </button>
            <button style={btnGhost(false)} onClick={() => toast.success("Relatório exportado")}>
              <Download size={14} /> Exportar
            </button>
          </div>
        </div>
      )}

      {!gateResolved && (
        <TransformGate
          choice={gateChoice}
          setChoice={setGateChoice}
          scopeData={scopeData}
          setScopeData={setScopeData}
          initialName={initialProcessName || ""}
          initialDescription={initialContext || ""}
          initialArea={initialArea || ""}
          initialSystems={initialSystems || []}
          onDocsResolved={() => {
            setAssessmentUnavailable(false);
            setGateResolved(true);
            toast.success("Documentação adicionada — esteira liberada");
          }}
          onScopeResolved={() => {
            setAssessmentUnavailable(true);
            setGateResolved(true);
            toast.success("Diagrama do processo atual confirmado");
          }}
        />
      )}

      {/* New documentation detected dialog */}
      {showNewDocsDialog && (
        <div style={{
          position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)", zIndex: 1000,
          display: "flex", alignItems: "center", justifyContent: "center", padding: 24,
        }}>
          <div style={{
            background: "#fff", borderRadius: 14, maxWidth: 480, width: "100%",
            padding: 24, border: `1px solid ${C.border}`,
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
              <div style={{
                width: 36, height: 36, borderRadius: 10, background: C.primaryBg,
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <FileCheck size={18} color={C.primary} />
              </div>
              <div style={{ fontSize: 15, fontWeight: 700, color: C.text }}>
                Nova documentação identificada
              </div>
            </div>
            <p style={{ fontSize: 13, color: C.muted, lineHeight: 1.6, margin: 0 }}>
              Detectamos que este processo agora possui POP, BPMN e Assessment.
              Deseja reiniciar a esteira a partir dessas informações para obter resultados mais assertivos?
            </p>
            <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, marginTop: 20 }}>
              <button onClick={() => setShowNewDocsDialog(false)} style={btnGhost(false)}>
                Continuar com diagrama atual
              </button>
              <button
                onClick={() => {
                  setShowNewDocsDialog(false);
                  setAssessmentUnavailable(false);
                  setGateResolved(true);
                  setGateChoice(null);
                  setScopeData(null);
                  setCurrentStep(0);
                  setAnalysisDone(false);
                  toast.success("Esteira reiniciada com a documentação completa");
                }}
                style={btnPrimary(false)}
              >
                <RefreshCw size={13} /> Reiniciar com documentação
              </button>
            </div>
          </div>
        </div>
      )}

      {gateResolved && (
      <main className="flex-1" style={{ minHeight: 0, display: "flex", overflow: "hidden" }}>
        <div style={{
          display: "flex", flex: 1, minHeight: 0, width: "100%", background: C.bg,
        }}>
            {/* Step content */}
            <section style={{
              flex: 1, background: C.bg, position: "relative",
              display: "flex", flexDirection: "column", overflow: "hidden",
            }}>
              {/* TOP — Horizontal Progress Bar */}
              <div style={{
                background: C.white, borderBottom: `1px solid ${C.border}`,
                padding: "16px 36px", flexShrink: 0,
              }}>
                <div style={{
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                  marginBottom: 12,
                }}>
                  <div>
                    <div style={{
                      fontSize: 9, textTransform: "uppercase", letterSpacing: 1.2,
                      color: C.mutedSoft, fontWeight: 700,
                    }}>Esteira de Transformação</div>
                    <div style={{ fontSize: 14, fontWeight: 600, color: C.text, marginTop: 2 }}>
                      {selectedOpp?.title || selectedProcess?.name || customProcess.name || "Novo processo"}
                    </div>
                  </div>
                  <div style={{ fontSize: 11, color: C.muted }}>
                    Etapa {currentStep + 1} de {STEPS.length}
                  </div>
                </div>

                <nav style={{ display: "flex", alignItems: "center", gap: 0 }}>
                  {STEPS.map((s, i) => {
                    const done = i < currentStep;
                    const active = i === currentStep;
                    const accessible = i <= currentStep;
                    const Icon = s.icon;
                    return (
                      <React.Fragment key={s.id}>
                        <button
                          onClick={() => accessible && setCurrentStep(i)}
                          disabled={!accessible}
                          style={{
                            display: "flex", alignItems: "center", gap: 8,
                            padding: "8px 12px", background: active ? C.primaryBg : "transparent",
                            border: active ? `1px solid ${C.primaryBorder}` : "1px solid transparent",
                            borderRadius: 8, cursor: accessible ? "pointer" : "not-allowed",
                            transition: "all 0.2s",
                          }}
                        >
                          <div style={{
                            width: 24, height: 24, borderRadius: "50%",
                            display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                            background: active ? C.primary : done ? C.primary : C.borderSoft,
                            color: active || done ? C.white : C.mutedSoft,
                          }}>
                            {done ? <Check size={13} /> : <Icon size={13} />}
                          </div>
                          <div style={{
                            fontSize: 12, fontWeight: active ? 600 : 500,
                            color: active ? C.primary : done ? C.text : C.mutedSoft,
                            whiteSpace: "nowrap",
                          }}>{s.label}</div>
                        </button>
                        {i < STEPS.length - 1 && (
                          <div style={{
                            flex: 1, height: 1, minWidth: 16,
                            background: i < currentStep ? C.primary : C.border,
                          }} />
                        )}
                      </React.Fragment>
                    );
                  })}
                </nav>
              </div>

              <div style={{
                flex: 1, padding: "32px 36px 24px 36px", overflowY: "auto",
                opacity: entering ? 0 : 1,
                transform: entering ? "translateX(10px)" : "translateX(0)",
                transition: "opacity 250ms ease-out, transform 250ms ease-out",
              }}>
                {assessmentUnavailable && (
                  <div style={{
                    marginBottom: 16, padding: "10px 14px",
                    background: C.warningBg, border: `1px solid ${C.warningBorder}`,
                    borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12,
                  }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 0 }}>
                      <AlertCircle size={16} color="#92400E" style={{ flexShrink: 0 }} />
                      <div style={{ fontSize: 12.5, color: "#92400E", lineHeight: 1.5 }}>
                        Esteira em modo simplificado (sem POP/BPMN/Assessment). Para resultados mais assertivos, recomendamos gerar a documentação completa do processo.
                      </div>
                    </div>
                    <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
                      <button
                        onClick={() => {
                          setGateChoice("docs");
                          setGateResolved(false);
                          setScopeData(null);
                        }}
                        style={{ ...btnPrimary(false), background: "#92400E", borderColor: "#92400E" }}
                      >
                        <Sparkles size={13} /> Gerar documentação
                      </button>
                      <button
                        onClick={() => {
                          setGateResolved(false);
                          setGateChoice(null);
                          setScopeData(null);
                          setCurrentStep(0);
                          setAnalysisDone(false);
                          toast.info("Esteira reiniciada");
                        }}
                        style={btnGhost(false)}
                      >
                        <RefreshCw size={13} /> Reiniciar esteira
                      </button>
                    </div>
                  </div>
                )}
                {opportunityIdParam && currentStep === 0 && (
                  <div style={{
                    marginBottom: 20, padding: "12px 16px",
                    background: C.primaryBgSoft, border: `1px solid ${C.primaryBorder}`,
                    borderRadius: 12, display: "flex", alignItems: "center", gap: 10,
                  }}>
                    <Sparkles size={16} color={C.primary} />
                    <span style={{ fontSize: 13, color: C.text }}>
                      Iniciando transformação a partir de oportunidade identificada:{" "}
                      <b style={{ color: C.primary }}>{contextParam || "Oportunidade"}</b>
                    </span>
                  </div>
                )}

                {currentStep === 0 && (
                  <ContextStep
                    sources={knowledgeSources}
                    addSource={(s) => setKnowledgeSources([...knowledgeSources, s])}
                    removeSource={(s) => setKnowledgeSources(knowledgeSources.filter((x) => x !== s))}
                    newSource={newSource}
                    setNewSource={setNewSource}
                    lenses={selectedLenses}
                    toggleLens={(l) =>
                      setSelectedLenses(selectedLenses.includes(l)
                        ? selectedLenses.filter((x) => x !== l)
                        : [...selectedLenses, l])}
                    hypothesis={hypothesis}
                    setHypothesis={setHypothesis}
                  />
                )}
                {currentStep === 1 && (
                  <AnalysisStep analyzing={analyzing} done={analysisDone} retry={runAnalysis} assessmentUnavailable={assessmentUnavailable} processId={selectedProcessId} demo={isSpanLayerDemo} />
                )}
                {currentStep === 2 && <ToBeStep demo={isSpanLayerDemo} />}
                {currentStep === 3 && <BusinessCaseStep processId={selectedProcessId} demo={isSpanLayerDemo} />}
              </div>

              {/* Pinned footer nav */}
              <div style={{
                flexShrink: 0,
                background: C.white,
                borderTop: `1px solid ${C.border}`, padding: "14px 36px",
                display: "flex", justifyContent: "space-between", alignItems: "center",
                boxShadow: "0 -2px 8px rgba(0,0,0,0.04)",
              }}>
                <button onClick={back} disabled={currentStep === 0} style={btnGhost(currentStep === 0)}>
                  <ArrowLeft size={14} /> Voltar
                </button>

                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  {!isLast && (
                    <button onClick={next} disabled={!canAdvance()} style={btnPrimary(!canAdvance())}>
                      {currentStep === 0 ? "Gerar análise" : "Avançar"} <ArrowRight size={14} />
                    </button>
                  )}
                </div>
              </div>
            </section>
          </div>
      </main>
      )}

    </div>
  );
}

// ============= STEP 0 — Selection (redesigned) =============
function SelectionStep({
  selectionType, setSelectionType,
  selectedOppId, setSelectedOppId,
  selectedProcessId, setSelectedProcessId,
  processes, processQuery, setProcessQuery,
  customProcess, setCustomProcess,
}: any) {
  const navigate = useNavigate();
  const allProcesses = useProcessStore((s) => s.processes);
  const l1List = useValueChainStore((s) => s.l1Processes);
  const savedOpps = useOpportunityStore((s) => s.savedOpportunities);

  // Saved opportunities + fallback to mock samples for the demo
  const oppsToShow = useMemo(() => {
    if (savedOpps && savedOpps.length > 0) {
      return savedOpps.map((s) => ({
        id: s.originalId,
        title: s.title,
        impact: s.impact,
        estimatedGain: s.estimatedGain,
        effort: s.effort,
        impactedProcesses: s.impactedProcesses,
      }));
    }
    return mockOpportunities.slice(0, 6).map((o) => ({
      id: o.id, title: o.title, impact: o.impact, estimatedGain: o.estimatedGain,
      effort: o.effort, impactedProcesses: o.impactedProcesses,
    }));
  }, [savedOpps]);

  const cards: { id: "saved_opportunity" | "existing_process" | "new_process"; icon: any; title: string; subtitle: string; recommended?: boolean; examples?: string[]; dashed?: boolean }[] = [
    {
      id: "saved_opportunity", icon: Lightbulb,
      title: "Oportunidade identificada",
      subtitle: "Partir de uma oportunidade já priorizada no módulo de Descoberta",
      recommended: true,
      examples: ["Triagem automática com IA", "Aprovação com fluxo digital"],
    },
    {
      id: "existing_process", icon: FileCheck,
      title: "Processo documentado",
      subtitle: "Escolher da sua biblioteca de processos já mapeados",
    },
    {
      id: "new_process", icon: Plus,
      title: "Novo processo",
      subtitle: "Cadastrar um processo ainda não documentado para iniciar o diagnóstico",
      dashed: true,
    },
  ];

  const reset = () => {
    setSelectionType(null);
    setSelectedOppId(null);
    setSelectedProcessId(null);
    setCustomProcess({ name: "", area: "", systems: [], description: "" });
  };

  const selectedCard = cards.find((c) => c.id === selectionType);

  return (
    <div>
      {/* Context banner */}
      <div style={{
        background: "linear-gradient(135deg, #04223D 0%, #0C1BA8 100%)",
        borderRadius: 16, padding: "28px 32px",
        display: "flex", gap: 24, alignItems: "center",
      }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 10, letterSpacing: 1, textTransform: "uppercase", color: "rgba(255,255,255,0.5)", fontWeight: 600 }}>
            Esteira de Transformação
          </div>
          <h2 style={{ fontSize: 22, fontWeight: 700, color: "#fff", margin: "8px 0 6px" }}>
            Por onde quer começar?
          </h2>
          <p style={{ fontSize: 14, color: "rgba(255,255,255,0.7)", lineHeight: 1.6, margin: 0 }}>
            Selecione uma oportunidade já identificada ou escolha um processo para transformar.
          </p>
        </div>
        <div style={{
          width: 220, background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)",
          borderRadius: 12, padding: 16,
        }}>
          <Sparkles size={16} color="#fff" />
          <div style={{ fontSize: 12, color: "rgba(255,255,255,0.75)", lineHeight: 1.5, marginTop: 8 }}>
            A IA vai cruzar o processo com benchmarks, identificar gargalos e propor o redesenho completo.
          </div>
        </div>
      </div>

      {/* 3 cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginTop: 20 }}>
        {cards.map((c) => {
          const active = selectionType === c.id;
          const Icon = c.icon;
          return (
            <button
              key={c.id}
              onClick={() => { reset(); setSelectionType(c.id); }}
              style={{
                position: "relative", textAlign: "left", padding: 24, borderRadius: 16,
                background: active ? "linear-gradient(180deg, #F8F9FF, #FFFFFF)" : "#fff",
                border: `1.5px ${c.dashed ? "dashed" : "solid"} ${active ? "#0C1BA8" : c.dashed ? "#C7CEFF" : "#E8E8EA"}`,
                boxShadow: active ? "0 0 0 3px rgba(12,27,168,0.08)" : "none",
                cursor: "pointer", transition: "all 0.2s",
                transform: "translateY(0)",
                display: "flex", flexDirection: "column", gap: 12,
              }}
              onMouseEnter={(e) => {
                if (!active) {
                  e.currentTarget.style.transform = "translateY(-3px)";
                  e.currentTarget.style.borderColor = "#A5B4FC";
                  e.currentTarget.style.boxShadow = "0 8px 20px -10px rgba(12,27,168,0.15)";
                }
              }}
              onMouseLeave={(e) => {
                if (!active) {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.borderColor = c.dashed ? "#C7CEFF" : "#E8E8EA";
                  e.currentTarget.style.boxShadow = "none";
                }
              }}
            >
              {active && (
                <div style={{
                  position: "absolute", top: 12, right: 12, width: 22, height: 22, borderRadius: "50%",
                  background: "#0C1BA8", display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  <Check size={13} color="#fff" />
                </div>
              )}
              <div style={{
                width: 40, height: 40, borderRadius: 10, background: "#EEF0FF",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <Icon size={20} color="#0C1BA8" />
              </div>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                  <div style={{ fontSize: 15, fontWeight: 700, color: "#272727" }}>{c.title}</div>
                  {c.recommended && (
                    <span style={{
                      display: "inline-flex", alignItems: "center", gap: 5, fontSize: 9.5, fontWeight: 700,
                      letterSpacing: 0.5, color: "#0F766E",
                    }}>
                      <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#16A34A" }} />
                      RECOMENDADO
                    </span>
                  )}
                </div>
                <div style={{ fontSize: 12.5, color: "#6B7280", lineHeight: 1.5 }}>{c.subtitle}</div>
              </div>
              {c.examples && (
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 4 }}>
                  {c.examples.map((ex) => (
                    <span key={ex} style={{
                      fontSize: 10.5, color: "#6B7280", background: "#F4F5F8",
                      padding: "3px 8px", borderRadius: 999,
                    }}>{ex}</span>
                  ))}
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Selection content panel */}
      {selectionType && (
        <div style={{
          marginTop: 16, background: "#fff", border: "1px solid #E8E8EA",
          borderRadius: 16, padding: 24,
          animation: "slideDown 0.25s ease-out",
        }}>
          {/* Panel header */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18 }}>
            {selectedCard && (
              <span style={{
                display: "inline-flex", alignItems: "center", gap: 8,
                background: "#EEF0FF", color: "#0C1BA8",
                borderRadius: 8, padding: "8px 14px", fontSize: 13, fontWeight: 600,
              }}>
                <selectedCard.icon size={14} />
                {selectedCard.title}
              </span>
            )}
            <button onClick={reset} style={{
              background: "transparent", border: "none", cursor: "pointer",
              color: "#6B7280", fontSize: 12, fontWeight: 500,
            }}>Trocar</button>
          </div>

          {selectionType === "saved_opportunity" && (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              {oppsToShow.map((opp) => {
                const sel = selectedOppId === opp.id;
                return (
                  <button
                    key={opp.id}
                    onClick={() => setSelectedOppId(opp.id)}
                    style={{
                      position: "relative", textAlign: "left", padding: 16, borderRadius: 12,
                      background: sel ? "#F8F9FF" : "#fff",
                      border: `1.5px solid ${sel ? "#0C1BA8" : "#E8E8EA"}`,
                      borderLeft: sel ? "3px solid #0C1BA8" : "1.5px solid #E8E8EA",
                      cursor: "pointer", transition: "all 0.15s",
                      display: "flex", flexDirection: "column", gap: 10,
                    }}
                  >
                    {sel && (
                      <div style={{
                        position: "absolute", top: 10, right: 10, width: 18, height: 18, borderRadius: "50%",
                        background: "#0C1BA8", display: "flex", alignItems: "center", justifyContent: "center",
                      }}>
                        <Check size={11} color="#fff" />
                      </div>
                    )}
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 10 }}>
                      <div style={{ fontSize: 13.5, fontWeight: 700, color: "#272727", paddingRight: 28, lineHeight: 1.35 }}>
                        {opp.title}
                      </div>
                    </div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                      {opp.impactedProcesses.slice(0, 2).map((p: any, i: number) => (
                        <span key={i} style={{
                          display: "inline-flex", alignItems: "center", gap: 4,
                          fontSize: 10, color: "#6B7280",
                        }}>
                          <span style={{
                            background: "#EEF0FF", color: "#0C1BA8", fontWeight: 700,
                            borderRadius: 3, padding: "1px 5px", fontSize: 9,
                          }}>{p.level}</span>
                          {p.name.split(" > ").pop()}
                        </span>
                      ))}
                    </div>
                    <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                      <span style={{
                        background: "#F0FDF4", color: "#0F766E", border: "1px solid #BBF7D0",
                        fontSize: 10.5, fontWeight: 700, borderRadius: 4, padding: "3px 7px",
                      }}>{opp.estimatedGain}</span>
                      <span style={{
                        background: "#F4F5F8", color: "#6B7280", border: "1px solid #E8E8EA",
                        fontSize: 10.5, fontWeight: 600, borderRadius: 4, padding: "3px 7px",
                      }}>Esforço {opp.effort}</span>
                      <span style={{
                        background: `${impactColor(opp.impact)}15`, color: impactColor(opp.impact),
                        fontSize: 10.5, fontWeight: 700, borderRadius: 4, padding: "3px 7px",
                      }}>Impacto {opp.impact}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          )}

          {selectionType === "existing_process" && (
            <div>
              <div style={{
                display: "flex", alignItems: "center", gap: 10, padding: "12px 16px",
                background: "#fff", border: "1px solid #E0E1E8", borderRadius: 10,
              }}>
                <Search size={15} color="#6B7280" />
                <input
                  value={processQuery}
                  onChange={(e) => setProcessQuery(e.target.value)}
                  placeholder="Buscar processo por nome ou área..."
                  style={{ flex: 1, border: "none", outline: "none", fontSize: 13, background: "transparent" }}
                />
              </div>
              <div style={{ marginTop: 12, maxHeight: 320, overflow: "auto", display: "flex", flexDirection: "column", gap: 4 }}>
                {allProcesses.length === 0 ? (
                  <div style={{
                    padding: 32, textAlign: "center", border: "1px dashed #E0E1E8",
                    borderRadius: 10, background: "#FAFBFC",
                  }}>
                    <FileSearch size={28} color="#A5A7B0" style={{ margin: "0 auto 10px" }} />
                    <div style={{ fontSize: 13, fontWeight: 600, color: "#272727" }}>Nenhum processo encontrado</div>
                    <div style={{ fontSize: 12, color: "#6B7280", marginTop: 4 }}>
                      Os processos documentados aparecerão aqui
                    </div>
                    <button onClick={() => navigate("/processes")} style={{
                      marginTop: 12, background: "transparent", border: "none", color: "#0C1BA8",
                      fontSize: 12, fontWeight: 600, cursor: "pointer", textDecoration: "underline",
                    }}>Ir para Processos</button>
                  </div>
                ) : processes.map((p: any) => {
                  const sel = selectedProcessId === p.id;
                  return (
                    <button
                      key={p.id}
                      onClick={() => setSelectedProcessId(p.id)}
                      style={{
                        display: "flex", alignItems: "center", gap: 10,
                        padding: "12px 16px", borderRadius: 8,
                        background: sel ? "#F8F9FF" : "transparent",
                        border: `1px solid ${sel ? "#0C1BA8" : "transparent"}`,
                        cursor: "pointer", transition: "background 0.15s", textAlign: "left",
                      }}
                      onMouseEnter={(e) => { if (!sel) e.currentTarget.style.background = "#F4F5F8"; }}
                      onMouseLeave={(e) => { if (!sel) e.currentTarget.style.background = "transparent"; }}
                    >
                      <div style={{ flex: 1, fontSize: 13, fontWeight: 500, color: "#272727" }}>{p.name}</div>
                      <span style={{
                        fontSize: 10.5, color: "#6B7280", background: "#F4F5F8",
                        padding: "3px 8px", borderRadius: 4,
                      }}>{p.area}</span>
                      <span style={{
                        fontSize: 10, fontWeight: 700, padding: "3px 8px", borderRadius: 999,
                        background: p.hasDocumentation ? "#F0FDF4" : "#FFFBEB",
                        color: p.hasDocumentation ? "#0F766E" : "#92400E",
                        border: `1px solid ${p.hasDocumentation ? "#BBF7D0" : "#FED7AA"}`,
                      }}>{p.hasDocumentation ? "Documentado" : "Sem doc."}</span>
                      {sel && <Check size={15} color="#0C1BA8" />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {selectionType === "new_process" && (
            <NewProcessForm
              data={customProcess}
              onChange={setCustomProcess}
              l1List={l1List}
            />
          )}
        </div>
      )}
      <style>{`
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-8px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}

function NewProcessForm({ data, onChange, l1List }: any) {
  const areaOptions: string[] = (l1List || []).map((l1: any) => l1.namePT || l1.name).filter(Boolean);
  const suggestions = ["SAP", "Excel", "Workday", "ServiceNow"];
  const [sysDraft, setSysDraft] = useState("");

  const addSystem = (s: string) => {
    const v = s.trim();
    if (!v || data.systems.includes(v)) return;
    onChange({ ...data, systems: [...data.systems, v] });
    setSysDraft("");
  };
  const removeSystem = (s: string) => onChange({ ...data, systems: data.systems.filter((x: string) => x !== s) });

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
      <PremiumField label="Nome do processo" required>
        <input
          value={data.name}
          onChange={(e) => onChange({ ...data, name: e.target.value })}
          placeholder="Ex.: Conciliação bancária mensal"
          style={premiumInput}
        />
      </PremiumField>

      <PremiumField label="Área responsável">
        {areaOptions.length > 0 ? (
          <select
            value={data.area}
            onChange={(e) => onChange({ ...data, area: e.target.value })}
            style={{ ...premiumInput, appearance: "auto" }}
          >
            <option value="">Selecione uma área...</option>
            {areaOptions.map((a) => <option key={a} value={a}>{a}</option>)}
          </select>
        ) : (
          <input
            value={data.area}
            onChange={(e) => onChange({ ...data, area: e.target.value })}
            placeholder="Ex.: Financeiro"
            style={premiumInput}
          />
        )}
      </PremiumField>

      <PremiumField label="Sistemas utilizados" sublabel="Pressione Enter para adicionar. Clique em uma sugestão para incluir.">
        <div style={{
          display: "flex", flexWrap: "wrap", gap: 6, padding: 10,
          border: "1px solid #E0E1E8", borderRadius: 10, background: "#fff", minHeight: 46,
        }}>
          {data.systems.map((s: string) => (
            <span key={s} style={{
              display: "inline-flex", alignItems: "center", gap: 4,
              background: "#EEF0FF", color: "#0C1BA8", borderRadius: 6,
              padding: "4px 8px", fontSize: 12, fontWeight: 600,
            }}>
              {s}
              <button onClick={() => removeSystem(s)} style={{
                background: "none", border: "none", cursor: "pointer", display: "flex", color: "#0C1BA8", padding: 0,
              }}><X size={11} /></button>
            </span>
          ))}
          <input
            value={sysDraft}
            onChange={(e) => setSysDraft(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addSystem(sysDraft); } }}
            placeholder={data.systems.length === 0 ? "Digite um sistema e pressione Enter" : ""}
            style={{ flex: 1, minWidth: 140, border: "none", outline: "none", fontSize: 13, background: "transparent" }}
          />
        </div>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginTop: 8 }}>
          {suggestions.filter((s) => !data.systems.includes(s)).map((s) => (
            <button key={s} onClick={() => addSystem(s)} style={{
              fontSize: 11, color: "#6B7280", background: "#F4F5F8",
              border: "1px dashed #E0E1E8", borderRadius: 999, padding: "3px 10px",
              cursor: "pointer",
            }}>+ {s}</button>
          ))}
        </div>
      </PremiumField>

      <PremiumField label="Breve descrição" sublabel="Opcional">
        <textarea
          value={data.description}
          onChange={(e) => onChange({ ...data, description: e.target.value })}
          placeholder="O que o processo faz, com qual frequência, quem executa..."
          rows={3}
          style={{ ...premiumInput, resize: "vertical", fontFamily: "inherit" }}
        />
      </PremiumField>
    </div>
  );
}

const premiumInput: React.CSSProperties = {
  width: "100%", padding: "12px 16px", border: "1px solid #E0E1E8",
  borderRadius: 10, fontSize: 13, outline: "none", background: "#fff",
  transition: "all 0.15s", color: "#272727",
};

function PremiumField({ label, sublabel, required, children }: any) {
  return (
    <div>
      <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#374151", marginBottom: sublabel ? 2 : 6 }}>
        {label}{required && <span style={{ color: "#0C1BA8" }}> *</span>}
      </label>
      {sublabel && <div style={{ fontSize: 11, color: "#A5A7B0", marginBottom: 6 }}>{sublabel}</div>}
      {children}
    </div>
  );
}

// ============= STEP 1 — Diagnosis (redesigned 2-col) =============
function DiagnosisStep({ hasDoc, subject, onValidate }: any) {
  const flow = [
    { name: "Recebimento", role: "Operador", systems: ["Email", "Portal"], time: "5 min" },
    { name: "Validação inicial", role: "Analista", systems: ["ERP"], time: "20 min" },
    { name: "Aprovação", role: "Coordenador", systems: ["BPMS"], time: "1h" },
    { name: "Execução", role: "Operador", systems: ["ERP", "Sistema X"], time: "45 min" },
    { name: "Registro & comunicação", role: "Analista", systems: ["ERP", "Email"], time: "10 min" },
  ];

  const metrics = [
    { icon: Clock, label: "Lead time", value: "2,3 dias", benchmark: "1 dia (P75)", status: "above" as const },
    { icon: DollarSign, label: "Custo médio", value: "R$ 84", benchmark: "R$ 55 (P50)", status: "above" as const },
    { icon: Target, label: "SLA", value: "72%", benchmark: "95% (meta)", status: "above" as const },
    { icon: AlertCircle, label: "Taxa de erro", value: "6,4%", benchmark: "2% (P75)", status: "above" as const },
    { icon: RefreshCw, label: "Retrabalho", value: "18%", benchmark: "10% (P50)", status: "near" as const },
    { icon: Users, label: "Vol. mensal", value: "412", benchmark: "Variável", status: "below" as const },
  ];

  return (
    <div>
      {/* Subject pill — full-width page header */}
      <div style={{
        background: "#EEF0FF", border: "1px solid #C7CEFF", borderRadius: 12,
        padding: "12px 20px", display: "flex", alignItems: "center", gap: 12, marginBottom: 16,
      }}>
        <Sparkles size={16} color="#0C1BA8" />
        <span style={{ fontSize: 12, color: "#6B7280" }}>Diagnosticando:</span>
        <span style={{ fontSize: 13, fontWeight: 600, color: "#0C1BA8", flex: 1 }}>{subject}</span>
        {!hasDoc && (
          <span style={{
            fontSize: 10, fontWeight: 700, letterSpacing: 0.5, textTransform: "uppercase",
            background: "#F0FDF4", color: "#0F766E", border: "1px solid #BBF7D0",
            borderRadius: 999, padding: "3px 10px",
          }}>Pré-mapeamento por IA</span>
        )}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 300px", gap: 20 }}>
        {/* LEFT */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16, minWidth: 0 }}>
          <DiagnosisCard
            icon={Info}
            title="Diagrama de escopo"
            hint="Editável — clique em qualquer campo"
          >
            <ScopeDiagram subject={subject} />
          </DiagnosisCard>

        </div>

        {/* RIGHT */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {/* Metrics */}
          <div style={{ background: "#fff", border: "1px solid #E8E8EA", borderRadius: 16, padding: 20 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14, gap: 6 }}>
              <div style={{ fontSize: 14, fontWeight: 600, color: "#272727" }}>Indicadores</div>
              <span style={{
                fontSize: 9, fontWeight: 700, background: "#EEF0FF", color: "#0C1BA8",
                borderRadius: 999, padding: "3px 7px", whiteSpace: "nowrap",
              }}>Benchmarks</span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {metrics.map((m, i) => {
                const gap = m.status === "above"
                  ? { bg: "#FEF2F2", color: "#B91C1C", label: "↑" }
                  : m.status === "near"
                  ? { bg: "#FFFBEB", color: "#92400E", label: "≈" }
                  : { bg: "#F0FDF4", color: "#0F766E", label: "↓" };
                return (
                  <div key={i} style={{
                    border: "1px solid #E8E8EA", borderRadius: 10, padding: 10,
                  }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
                      <m.icon size={11} color="#A5A7B0" />
                      <span style={{
                        fontSize: 9, color: "#A5A7B0", letterSpacing: 0.5,
                        textTransform: "uppercase", fontWeight: 600, flex: 1,
                      }}>{m.label}</span>
                      <span style={{
                        background: gap.bg, color: gap.color, fontSize: 10, fontWeight: 700,
                        borderRadius: 999, padding: "1px 6px",
                      }}>{gap.label}</span>
                    </div>
                    <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 6 }}>
                      <div style={{ fontSize: 16, fontWeight: 700, color: "#272727", lineHeight: 1.1 }}>{m.value}</div>
                      <div style={{ fontSize: 9, color: "#A5A7B0", textAlign: "right" }}>{m.benchmark}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Validate — single CTA */}
          <div style={{ background: "#fff", border: "1px solid #E8E8EA", borderRadius: 14, padding: 20 }}>
            <div style={{ fontSize: 14, fontWeight: 600, color: "#272727" }}>
              Diagnóstico pronto para avançar?
            </div>
            <div style={{ fontSize: 12, color: "#6B7280", marginTop: 4 }}>
              Revise o diagrama à esquerda e confirme quando estiver correto.
            </div>
            <div style={{ height: 16 }} />
            <button
              onClick={onValidate}
              style={{
                width: "100%", display: "flex", alignItems: "center", gap: 8,
                background: "linear-gradient(135deg, #0C1BA8, #1E35D4)", color: "#fff",
                border: "none", borderRadius: 10, padding: "13px 20px",
                fontSize: 14, fontWeight: 700, cursor: "pointer",
                boxShadow: "0 4px 14px rgba(12,27,168,0.3)",
              }}>
              <CheckCircle2 size={16} />
              <span>Validar diagnóstico e continuar</span>
              <ArrowRight size={16} style={{ marginLeft: "auto" }} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function DiagnosisCard({ icon: Icon, title, hint, badge, children }: any) {
  return (
    <div style={{
      background: "#fff", border: "1px solid #E8E8EA", borderRadius: 16, overflow: "hidden",
    }}>
      <div style={{
        display: "flex", alignItems: "center", gap: 10,
        padding: "16px 20px", borderBottom: "1px solid #F0F1F5",
      }}>
        <div style={{
          width: 32, height: 32, background: "#EEF0FF", borderRadius: 8,
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <Icon size={16} color="#0C1BA8" />
        </div>
        <div style={{ fontSize: 14, fontWeight: 600, color: "#272727", flex: 1 }}>{title}</div>
        {badge && (
          <span style={{
            fontSize: 10, fontWeight: 700, background: "#EEF0FF", color: "#0C1BA8",
            borderRadius: 999, padding: "3px 8px",
          }}>{badge}</span>
        )}
        {hint && <div style={{ fontSize: 11, color: "#A5A7B0", fontStyle: "italic" }}>{hint}</div>}
      </div>
      <div style={{ padding: 20 }}>{children}</div>
    </div>
  );
}

// ============= Scope Diagram (SIPOC-style, fully editable) =============
function ScopeDiagram({ subject }: { subject: string }) {
  const [data, setData] = useState({
    objetivo: `Consolidar, validar e reportar os dados do processo "${subject}" garantindo qualidade, rastreabilidade e suporte à tomada de decisão.`,
    proposta: "Transformar dados dispersos em informação consolidada e acionável para a liderança, acelerando a identificação de desvios e correção de rota.",
    inicio: "Disparo do processo conforme calendário ou solicitação do cliente interno",
    fim: "Entrega validada e distribuída aos stakeholders",
    origem: "Solicitação do cliente interno ou trigger sistêmico calendarizado",
    destino: "Lideranças executivas, áreas de negócio e times operacionais",
    entradas: ["Relatórios extraídos de sistemas", "Planilhas das áreas", "Base de dados corporativa", "Políticas e regras de negócio"],
    saidas: ["Relatório consolidado", "Análise de desvios", "Registros de auditoria", "Dados publicados em BI"],
    atividades: [
      { name: "Recebimento", systems: [1, 2] },
      { name: "Validação inicial", systems: [3] },
      { name: "Consolidação", systems: [4, 5] },
      { name: "Análise de desvios", systems: [5] },
      { name: "Aprovação", systems: [6] },
      { name: "Distribuição", systems: [1, 7] },
    ],
    sistemas: ["SAP", "Workday", "Excel", "Portal Interno", "Power BI", "BPMS", "Email"],
    dores: [
      "Volume alto de informações inconsistentes entre sistemas",
      "Falta de padronização entre áreas",
      "Retrabalho recorrente na consolidação manual",
      "Ausência de trilha de auditoria estruturada",
    ],
  });

  const update = (key: keyof typeof data, value: any) => setData({ ...data, [key]: value });

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      {/* Row 1: Objetivo + Proposta */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
        <BandBlock label="OBJETIVO">
          <EditableText value={data.objetivo} onChange={(v) => update("objetivo", v)} multiline />
        </BandBlock>
        <BandBlock label="PROPOSTA DE VALOR">
          <EditableText value={data.proposta} onChange={(v) => update("proposta", v)} multiline />
        </BandBlock>
      </div>

      {/* Row 2: Eventos */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
        <BandBlock label="EVENTO DE INÍCIO">
          <EditableText value={data.inicio} onChange={(v) => update("inicio", v)} />
        </BandBlock>
        <BandBlock label="EVENTO DE FIM">
          <EditableText value={data.fim} onChange={(v) => update("fim", v)} />
        </BandBlock>
      </div>

      {/* Origem */}
      <BandBlock label="ORIGEM">
        <EditableText value={data.origem} onChange={(v) => update("origem", v)} />
      </BandBlock>

      {/* Entradas */}
      <BandBlock label="ENTRADA DE DADOS">
        <ChipList items={data.entradas} onChange={(v) => update("entradas", v)} placeholder="Adicionar entrada..." />
      </BandBlock>

      {/* Atividades */}
      <BandBlock label="ATIVIDADES" accent="#0F766E">
        <FlowchartView
          items={data.atividades}
          systems={data.sistemas}
          onChange={(v) => update("atividades", v)}
        />
      </BandBlock>

      {/* Destino */}
      <BandBlock label="DESTINO">
        <EditableText value={data.destino} onChange={(v) => update("destino", v)} />
      </BandBlock>

      {/* Saídas */}
      <BandBlock label="SAÍDA DE DADOS">
        <ChipList items={data.saidas} onChange={(v) => update("saidas", v)} placeholder="Adicionar saída..." />
      </BandBlock>

      {/* Row final: Sistemas + Dores */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
        <BandBlock label="SISTEMAS">
          <NumberedChipList items={data.sistemas} onChange={(v) => update("sistemas", v)} placeholder="Adicionar sistema..." />
        </BandBlock>
        <BandBlock label="DORES" accent={C.danger}>
          <ChipList items={data.dores} onChange={(v) => update("dores", v)} placeholder="Adicionar dor..." accent={C.danger} />
        </BandBlock>
      </div>
    </div>
  );
}

function BandBlock({ label, children, accent }: { label: string; children: any; accent?: string }) {
  const color = accent || C.primary;
  return (
    <div style={{
      display: "grid", gridTemplateColumns: "120px 1fr",
      border: `1px solid ${C.border}`, borderRadius: 10, overflow: "hidden",
      background: C.white,
    }}>
      <div style={{
        background: color, color: C.white,
        padding: "10px 12px", fontSize: 10, fontWeight: 700,
        letterSpacing: 0.8, textTransform: "uppercase",
        display: "flex", alignItems: "center",
      }}>{label}</div>
      <div style={{ padding: "10px 14px", display: "flex", alignItems: "center" }}>{children}</div>
    </div>
  );
}

function EditableText({ value, onChange, multiline }: { value: string; onChange: (v: string) => void; multiline?: boolean }) {
  const baseStyle: React.CSSProperties = {
    width: "100%", border: "1px solid transparent", background: "transparent",
    fontSize: 13, color: C.text, lineHeight: 1.5, outline: "none",
    padding: "6px 8px", borderRadius: 4, fontFamily: "inherit",
    transition: "all 0.15s",
  };
  const focus: React.CSSProperties = {
    border: `1px solid ${C.primary}`, background: C.primaryBgSoft,
  };
  const [focused, setFocused] = useState(false);
  const merged = { ...baseStyle, ...(focused ? focus : {}) };
  const handlers = {
    value, onChange: (e: any) => onChange(e.target.value),
    onFocus: () => setFocused(true), onBlur: () => setFocused(false),
    onMouseEnter: (e: any) => { if (!focused) e.currentTarget.style.background = C.primaryBgSoft; },
    onMouseLeave: (e: any) => { if (!focused) e.currentTarget.style.background = "transparent"; },
  };
  return multiline
    ? <textarea {...handlers} rows={2} style={{ ...merged, resize: "vertical" }} />
    : <input {...handlers} style={merged} />;
}

function ChipList({ items, onChange, placeholder, accent }: { items: string[]; onChange: (v: string[]) => void; placeholder: string; accent?: string }) {
  const [draft, setDraft] = useState("");
  const color = accent || C.text;
  const bg = accent ? `${accent}10` : C.bg;
  const border = accent ? `${accent}55` : C.border;
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 6, width: "100%" }}>
      {items.map((it, i) => (
        <EditableChip
          key={i} value={it} bg={bg} color={color} border={border}
          onChange={(v) => {
            const next = [...items];
            if (v.trim()) next[i] = v; else next.splice(i, 1);
            onChange(next);
          }}
          onRemove={() => onChange(items.filter((_, j) => j !== i))}
        />
      ))}
      <input
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && draft.trim()) {
            onChange([...items, draft.trim()]);
            setDraft("");
          }
        }}
        placeholder={placeholder}
        style={{
          flex: "1 1 140px", minWidth: 140, border: `1px dashed ${C.border}`,
          background: "transparent", padding: "6px 10px", borderRadius: 4,
          fontSize: 12, outline: "none", color: C.muted,
        }}
      />
    </div>
  );
}

function EditableChip({ value, onChange, onRemove, bg, color, border }: any) {
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 4,
      background: bg, border: `1px solid ${border}`, borderRadius: 4,
      padding: "4px 8px",
    }}>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{
          border: "none", background: "transparent", outline: "none",
          fontSize: 12, color, fontWeight: 500,
          width: `${Math.max(value.length, 6)}ch`,
        }}
      />
      <button onClick={onRemove} style={{ background: "none", border: "none", cursor: "pointer", color: C.muted, padding: 0, display: "flex" }}>
        <X size={11} />
      </button>
    </span>
  );
}

function NumberedChipList({ items, onChange, placeholder }: { items: string[]; onChange: (v: string[]) => void; placeholder: string }) {
  const [draft, setDraft] = useState("");
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 6, width: "100%" }}>
      {items.map((it, i) => (
        <span key={i} style={{
          display: "inline-flex", alignItems: "center", gap: 6,
          background: C.bg, border: `1px solid ${C.border}`, borderRadius: 4, padding: "4px 8px",
        }}>
          <span style={{
            width: 18, height: 18, borderRadius: "50%", background: C.primary, color: C.white,
            display: "inline-flex", alignItems: "center", justifyContent: "center",
            fontSize: 10, fontWeight: 700,
          }}>{i + 1}</span>
          <input
            value={it}
            onChange={(e) => {
              const next = [...items]; next[i] = e.target.value; onChange(next);
            }}
            style={{
              border: "none", background: "transparent", outline: "none",
              fontSize: 12, color: C.text, fontWeight: 500,
              width: `${Math.max(it.length, 5)}ch`,
            }}
          />
          <button onClick={() => onChange(items.filter((_, j) => j !== i))}
            style={{ background: "none", border: "none", cursor: "pointer", color: C.muted, padding: 0, display: "flex" }}>
            <X size={11} />
          </button>
        </span>
      ))}
      <input
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && draft.trim()) {
            onChange([...items, draft.trim()]); setDraft("");
          }
        }}
        placeholder={placeholder}
        style={{
          flex: "1 1 140px", minWidth: 140, border: `1px dashed ${C.border}`,
          background: "transparent", padding: "6px 10px", borderRadius: 4,
          fontSize: 12, outline: "none", color: C.muted,
        }}
      />
    </div>
  );
}

function FlowchartView({ items, systems, onChange }: { items: { name: string; systems: number[] }[]; systems: string[]; onChange: (v: any) => void }) {
  const ROLES = ["Operador", "Analista", "Analista", "Analista", "Coordenador", "Operador"];
  const isGateway = (name: string) => /valida|aprova/i.test(name);
  const role = (i: number) => ROLES[i] ?? "Operador";

  const Connector = () => (
    <div style={{
      display: "flex", alignItems: "center", flexShrink: 0, paddingTop: 0,
      alignSelf: "center", marginTop: -22,
    }}>
      <div style={{ width: 28, height: 1, background: "#C7CEFF" }} />
      <div style={{
        width: 0, height: 0,
        borderTop: "5px solid transparent", borderBottom: "5px solid transparent",
        borderLeft: "6px solid #0C1BA8",
      }} />
    </div>
  );

  const StartNode = () => (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flexShrink: 0, gap: 6 }}>
      <div style={{
        width: 36, height: 36, borderRadius: "50%",
        background: "#fff", border: "2px solid #0C1BA8",
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#0C1BA8" }} />
      </div>
      <div style={{ fontSize: 9, color: "#A5A7B0", letterSpacing: 0.4, textTransform: "uppercase" }}>Início</div>
    </div>
  );

  const EndNode = () => (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flexShrink: 0, gap: 6 }}>
      <div style={{
        width: 36, height: 36, borderRadius: "50%",
        background: "#0C1BA8", border: "2px solid #0C1BA8",
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        <div style={{ width: 22, height: 22, borderRadius: "50%", border: "2px solid #fff" }} />
      </div>
      <div style={{ fontSize: 9, color: "#A5A7B0", letterSpacing: 0.4, textTransform: "uppercase" }}>Fim</div>
    </div>
  );

  const TaskNode = ({ act, i }: { act: { name: string; systems: number[] }, i: number }) => {
    const [hover, setHover] = useState(false);
    const gateway = isGateway(act.name);
    const baseShape: React.CSSProperties = gateway
      ? {
          width: 60, height: 60, transform: "rotate(45deg)",
          background: "#FEF3C7", border: "1.5px solid #F59E0B", borderRadius: 6,
          display: "flex", alignItems: "center", justifyContent: "center",
        }
      : {
          minWidth: 110, height: 52, borderRadius: 10,
          background: "#fff", border: "1.5px solid #0C1BA8",
          display: "flex", alignItems: "center", justifyContent: "center",
          padding: "0 10px",
        };
    return (
      <div
        onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
        style={{ display: "flex", flexDirection: "column", alignItems: "center", flexShrink: 0, gap: 6, position: "relative" }}>
        <div style={{ position: "relative" }}>
          {/* System badges */}
          <div style={{ position: "absolute", top: -10, left: -4, display: "flex", gap: 2, zIndex: 2 }}>
            {act.systems.map((s) => (
              <span key={s} title={systems[s - 1]} style={{
                width: 16, height: 16, borderRadius: "50%", background: "#0C1BA8", color: "#fff",
                fontSize: 9, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center",
                border: "2px solid #fff",
              }}>{s}</span>
            ))}
          </div>
          <div style={baseShape}>
            <input
              value={act.name}
              onChange={(e) => {
                const next = [...items]; next[i] = { ...next[i], name: e.target.value }; onChange(next);
              }}
              style={{
                border: "none", background: "transparent", outline: "none",
                fontSize: 11, fontWeight: 600, color: "#272727",
                width: `${Math.max(act.name.length, 8)}ch`, textAlign: "center",
                transform: gateway ? "rotate(-45deg)" : "none",
              }}
            />
          </div>
          {hover && (
            <button onClick={() => onChange(items.filter((_, j) => j !== i))}
              style={{
                position: "absolute", top: -8, right: -8, background: "#fff",
                border: "1px solid #E8E8EA", borderRadius: "50%", width: 14, height: 14,
                cursor: "pointer", color: "#6B7280", padding: 0, display: "flex",
                alignItems: "center", justifyContent: "center", zIndex: 3,
              }}>
              <X size={8} />
            </button>
          )}
        </div>
        <span style={{
          fontSize: 9, fontWeight: 500, background: "#F4F5F8", color: "#6B7280",
          borderRadius: 999, padding: "2px 7px", whiteSpace: "nowrap",
        }}>{role(i)}</span>
      </div>
    );
  };

  return (
    <div style={{ width: "100%" }}>
      <div style={{
        display: "flex", alignItems: "flex-start", gap: 0,
        overflowX: "auto", padding: "16px 4px", minHeight: 100,
      }}>
        <StartNode />
        <Connector />
        {items.map((act, i) => (
          <React.Fragment key={i}>
            <TaskNode act={act} i={i} />
            <Connector />
          </React.Fragment>
        ))}
        <EndNode />
      </div>
      <div style={{ display: "flex", justifyContent: "center", marginTop: 4 }}>
        <button
          onClick={() => onChange([...items, { name: "Nova etapa", systems: [] }])}
          style={{
            display: "inline-flex", alignItems: "center", gap: 6,
            background: "transparent", border: "1px dashed #0C1BA8",
            color: "#0C1BA8", fontSize: 12, fontWeight: 600,
            padding: "6px 14px", borderRadius: 8, cursor: "pointer",
          }}>
          <Plus size={12} /> Adicionar etapa
        </button>
      </div>
    </div>
  );
}

// ============= STEP 2 — Context (improved) =============
const LEVER_ICONS: Record<string, any> = {
  "Eficiência Operacional": Zap,
  "Exp. do Colaborador": Users,
  "Exp. do Cliente": Target,
  "Política & Compliance": Shield,
};

const TRANSFORM_LEVERS = [
  { name: "Eficiência Operacional", description: "Reduzir tempo, eliminar desperdício e aumentar throughput dos processos" },
  { name: "Exp. do Colaborador", description: "Melhorar a jornada, autonomia e satisfação de quem executa os processos" },
  { name: "Exp. do Cliente", description: "Elevar a percepção de valor, agilidade e qualidade no atendimento ao cliente" },
  { name: "Política & Compliance", description: "Aumentar confiabilidade, rastreabilidade e aderência regulatória" },
];

function ContextStep({
  sources, addSource, removeSource, newSource, setNewSource,
  lenses, toggleLens, hypothesis, setHypothesis,
}: any) {
  const autoSources = new Set([
    "Política de Compliance v3.2",
    "Manual de SLA do Financeiro",
    "Sistema SAP — Módulo FI",
  ]);
  const relevance = (s: string) => autoSources.has(s) ? "Alta" : "Média";
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <SectionTitle title="Contexto e alavancas de valor" subtitle="A IA usará essas fontes e alavancas para interpretar o processo." />

      {/* Hypothesis (now first) */}
      <div style={cardStyle}>
        <h4 style={subTitleStyle}>Hipótese de transformação</h4>
        <p style={{ fontSize: 12, color: C.muted, margin: "4px 0 12px", lineHeight: 1.5 }}>
          Quanto mais específica a hipótese, mais precisa a análise da IA.{" "}
          <span style={{ color: "#A5A7B0" }}>
            Ex: "Reduzir o tempo do processo em 30% eliminando aprovações manuais e integrando o ERP ao BPMS."
          </span>
        </p>
        <textarea
          value={hypothesis}
          onChange={(e) => setHypothesis(e.target.value)}
          placeholder="Descreva o resultado esperado e a mudança que deve ocorrer no processo..."
          rows={5}
          style={{
            width: "100%", padding: 14, border: `1px solid #E0E1E8`,
            borderRadius: 10, fontSize: 13, outline: "none", resize: "vertical",
            fontFamily: "inherit", lineHeight: 1.6, color: C.text,
          }}
        />
      </div>

      {/* Value Levers (replaces lenses) */}
      <div style={cardStyle}>
        <h4 style={subTitleStyle}>Alavancas de Valor</h4>
        <p style={{ fontSize: 12, color: C.muted, margin: "4px 0 14px" }}>
          Selecione as dimensões de valor que essa transformação deve mover.
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 12 }}>
          {TRANSFORM_LEVERS.map((lever) => {
            const Icon = LEVER_ICONS[lever.name] || Target;
            const active = lenses.includes(lever.name);
            return (
              <button
                key={lever.name}
                onClick={() => toggleLens(lever.name)}
                style={{
                  position: "relative", textAlign: "left", padding: 16,
                  background: active ? "linear-gradient(180deg, #F8F9FF, #FFFFFF)" : "#fff",
                  border: `1.5px solid ${active ? "#0C1BA8" : "#E8E8EA"}`,
                  borderRadius: 12, cursor: "pointer", transition: "all 0.15s",
                  boxShadow: active ? "0 0 0 3px rgba(12,27,168,0.08)" : "none",
                  display: "flex", flexDirection: "column", gap: 8,
                }}
              >
                {active && (
                  <div style={{
                    position: "absolute", top: 10, right: 10, width: 18, height: 18, borderRadius: "50%",
                    background: "#0C1BA8", display: "flex", alignItems: "center", justifyContent: "center",
                  }}>
                    <Check size={11} color="#fff" />
                  </div>
                )}
                <div style={{
                  width: 32, height: 32, borderRadius: 8, background: "#EEF0FF",
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  <Icon size={16} color="#0C1BA8" />
                </div>
                <div style={{ fontSize: 13, fontWeight: 700, color: C.text, paddingRight: 22 }}>{lever.name}</div>
                <div style={{ fontSize: 11.5, color: C.muted, lineHeight: 1.45 }}>{lever.description}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Knowledge */}
      <div style={cardStyle}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
          <h4 style={subTitleStyle}>Base de conhecimento</h4>
          <span style={{ fontSize: 11, color: C.muted }}>{sources.length} fontes</span>
        </div>
        <p style={{ fontSize: 12, color: C.muted, margin: "4px 0 14px" }}>
          Documentos, políticas e sistemas relacionados foram selecionados automaticamente.
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {sources.map((s: string) => {
            const isAuto = autoSources.has(s);
            const rel = relevance(s);
            return (
              <div key={s} style={{
                display: "flex", alignItems: "center", gap: 12, padding: "12px 14px",
                background: "#fff", border: "1px solid #E8E8EA", borderRadius: 10,
              }}>
                <div style={{
                  width: 32, height: 32, background: "#EEF0FF", borderRadius: 8,
                  display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                }}>
                  <FileText size={15} color="#0C1BA8" />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, color: C.text, fontWeight: 600 }}>{s}</div>
                  <div style={{ display: "flex", gap: 6, marginTop: 4 }}>
                    <span style={{
                      fontSize: 10, fontWeight: 600,
                      background: isAuto ? "#EEF0FF" : "#F4F5F8",
                      color: isAuto ? "#0C1BA8" : "#6B7280",
                      borderRadius: 999, padding: "2px 8px",
                    }}>{isAuto ? "Incluído automaticamente" : "Adicionado manualmente"}</span>
                    <span style={{
                      fontSize: 10, fontWeight: 700,
                      background: rel === "Alta" ? "#F0FDF4" : "#FFFBEB",
                      color: rel === "Alta" ? "#0F766E" : "#92400E",
                      border: `1px solid ${rel === "Alta" ? "#BBF7D0" : "#FED7AA"}`,
                      borderRadius: 999, padding: "2px 8px",
                    }}>{rel} relevância</span>
                  </div>
                </div>
                <button onClick={() => removeSource(s)} style={{
                  background: "none", border: "none", cursor: "pointer", color: C.muted,
                  display: "flex",
                }}>
                  <X size={14} />
                </button>
              </div>
            );
          })}
        </div>
        <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
          <input
            value={newSource}
            onChange={(e) => setNewSource(e.target.value)}
            placeholder="Adicionar fonte..."
            style={{
              flex: 1, padding: "10px 12px", border: `1px solid ${C.border}`,
              borderRadius: 8, fontSize: 13, outline: "none",
            }}
          />
          <button
            onClick={() => { if (newSource.trim()) { addSource(newSource.trim()); setNewSource(""); } }}
            style={btnPrimary(false)}
          >
            <Plus size={14} /> Adicionar
          </button>
        </div>
      </div>
    </div>
  );
}

// ============= STEP 3 — Analysis (redesigned) =============
function AnalysisStep({ analyzing, done, retry, assessmentUnavailable, processId, demo }: { analyzing: boolean; done: boolean; retry: () => void; assessmentUnavailable?: boolean; processId?: string | null; demo?: boolean }) {
  if (analyzing) {
    const steps = [
      "Lendo diagnóstico AS-IS",
      "Identificando gargalos e causas raiz",
      "Comparando com benchmarks do setor",
      "Gerando recomendações de redesenho",
    ];
    return (
      <div style={{
        background: "linear-gradient(135deg, #04223D 0%, #0C1BA8 100%)",
        borderRadius: 20, padding: "64px 48px", textAlign: "center", minHeight: 400,
      }}>
        <div style={{
          width: 64, height: 64, background: "rgba(255,255,255,0.15)",
          borderRadius: 16, display: "flex", alignItems: "center", justifyContent: "center",
          margin: "0 auto 20px",
        }}>
          <Brain size={28} color="#fff" className="animate-pulse" />
        </div>
        <div style={{ fontSize: 22, fontWeight: 700, color: "#fff" }}>Analisando o processo...</div>
        <div style={{ fontSize: 14, color: "rgba(255,255,255,0.65)", marginTop: 8 }}>
          Cruzando diagnóstico, benchmarks e contexto. Leva alguns segundos.
        </div>
        <div style={{ maxWidth: 480, margin: "32px auto 0", display: "flex", flexDirection: "column", gap: 10 }}>
          {steps.map((s, i) => (
            <div key={i} style={{
              display: "flex", alignItems: "center", gap: 10, padding: "10px 14px",
              background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.12)",
              borderRadius: 10, animation: `fadeInStep 0.4s ease-out ${i * 0.4}s both`,
            }}>
              <div style={{
                width: 18, height: 18, borderRadius: "50%", background: "rgba(255,255,255,0.2)",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <div style={{
                  width: 8, height: 8, borderRadius: "50%", background: "#fff",
                  animation: "pulseDot 1.4s ease-in-out infinite",
                }} />
              </div>
              <span style={{ fontSize: 13, color: "rgba(255,255,255,0.9)", textAlign: "left" }}>{s}</span>
            </div>
          ))}
        </div>
        <style>{`
          @keyframes fadeInStep { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }
          @keyframes pulseDot { 0%, 100% { opacity: 0.4; } 50% { opacity: 1; } }
        `}</style>
      </div>
    );
  }

  if (!done) {
    return (
      <div style={{ ...cardStyle, padding: 48, textAlign: "center" }}>
        <Brain size={32} color={C.primary} style={{ margin: "0 auto 12px" }} />
        <div style={{ fontSize: 14, color: C.text, marginBottom: 12 }}>Pronto para analisar.</div>
        <button onClick={retry} style={btnPrimary(false)}>
          <Sparkles size={14} /> Iniciar análise
        </button>
      </div>
    );
  }

  return <AnalysisResults assessmentUnavailable={assessmentUnavailable} processId={processId} demo={demo} />;
}

// ============= ANALYSIS RESULTS =============
type PainId = "sla" | "rework" | "audit" | "manual" | "quality" | "effort";

const PAINS: { id: PainId; label: string; metric: string }[] = [
  { id: "sla", label: "SLA não cumprido", metric: "28% dos casos" },
  { id: "rework", label: "Retrabalho elevado", metric: "+18% retrabalho" },
  { id: "audit", label: "Falta de auditoria", metric: "0% rastreável" },
];

const PAIN_COLORS: Record<PainId, string> = {
  sla: "#B91C1C",
  rework: "#F59E0B",
  audit: "#7C3AED",
  manual: "#B91C1C",
  quality: "#F59E0B",
  effort: "#7C3AED",
};

const RELATIONS: { pain: PainId; rootCause: string; opportunity: string }[] = [
  { pain: "sla", rootCause: "Ausência de workflow digital", opportunity: "Workflow digital de aprovação no BPMS" },
  { pain: "sla", rootCause: "Indicadores não monitorados em tempo real", opportunity: "Dashboard operacional em tempo real" },
  { pain: "rework", rootCause: "Critérios de validação não padronizados", opportunity: "Validação automática por regras no ERP" },
  { pain: "audit", rootCause: "Aprovações dispersas em e-mails", opportunity: "Trilha de auditoria nativa no BPMS" },
];

type EffortLevel = "Baixo" | "Médio" | "Alto";
type ImpactLevel = "Baixo" | "Médio" | "Alto" | "Muito Alto";
const EFFORT_NUM: Record<EffortLevel, number> = { Baixo: 0.18, "Médio": 0.5, Alto: 0.82 };
const IMPACT_NUM: Record<ImpactLevel, number> = { Baixo: 0.18, "Médio": 0.5, Alto: 0.82, "Muito Alto": 0.95 };

interface UseCaseRef {
  id: string; title: string; category: string; impact: string;
  impactLevel: ImpactLevel; effort: EffortLevel; description: string; addresses: PainId[];
  benchmarks: { name: string; unit: string; current: string; market: string; best: string }[];
  vendors: { vendor: string; solution: string; type: string; differentials: string; pricing: string }[];
}

const USE_CASES: UseCaseRef[] = [
  { id: "uc1", title: "Workflow digital de aprovação no BPMS", category: "Redesenho", impact: "-65% lead time", impactLevel: "Alto", effort: "Médio", description: "Implementar BPMS com regras de alçada, SLA monitorado e notificações automáticas.", addresses: ["sla", "audit"],
    benchmarks: [
      { name: "Lead time de aprovação", unit: "horas", current: "72", market: "36", best: "12" },
      { name: "% aprovações dentro do SLA", unit: "%", current: "62", market: "85", best: "97" },
    ],
    vendors: [
      { vendor: "Camunda", solution: "Camunda Platform 8", type: "BPMS", differentials: "Engine BPMN nativo, escalável, open core", pricing: "Sob consulta" },
      { vendor: "Pipefy", solution: "Pipefy Enterprise", type: "Low-code BPM", differentials: "Setup rápido, conectores prontos", pricing: "US$ 30/usuário/mês" },
      { vendor: "Bizagi", solution: "Bizagi Automation", type: "BPMS", differentials: "Modelagem visual + automação", pricing: "Sob consulta" },
    ] },
  { id: "uc2", title: "Validação automática por regras no ERP", category: "Automação", impact: "-90% retrabalho", impactLevel: "Alto", effort: "Baixo", description: "Criar regras configuráveis no ERP para validar inputs antes do envio à aprovação.", addresses: ["rework"],
    benchmarks: [
      { name: "Taxa de retrabalho", unit: "%", current: "18", market: "8", best: "2" },
      { name: "Tempo médio de validação", unit: "min", current: "14", market: "6", best: "1" },
    ],
    vendors: [
      { vendor: "SAP", solution: "SAP S/4HANA Validation Rules", type: "ERP nativo", differentials: "Integração total com módulos SAP", pricing: "Incluso na licença" },
      { vendor: "Oracle", solution: "Oracle ERP Cloud", type: "ERP nativo", differentials: "Configuração via business rules", pricing: "Incluso" },
    ] },
  { id: "uc3", title: "Dashboard operacional em tempo real", category: "Analytics", impact: "+40% visibilidade", impactLevel: "Médio", effort: "Baixo", description: "Painel com SLA, filas e exceções consumindo dados do BPMS e ERP.", addresses: ["sla"],
    benchmarks: [
      { name: "Tempo até detectar gargalo", unit: "horas", current: "24", market: "4", best: "0,5" },
    ],
    vendors: [
      { vendor: "Microsoft", solution: "Power BI", type: "BI", differentials: "Conectores nativos, baixo custo", pricing: "US$ 10/usuário/mês" },
      { vendor: "Tableau", solution: "Tableau Cloud", type: "BI", differentials: "Visualizações avançadas", pricing: "US$ 70/usuário/mês" },
    ] },
  { id: "uc4", title: "Integração ERP ↔ BPMS bidirecional", category: "Integração", impact: "-25% custo", impactLevel: "Médio", effort: "Alto", description: "Sincronização de status e dados mestres para eliminar dupla digitação.", addresses: [],
    benchmarks: [
      { name: "Tempo de digitação dupla", unit: "min/tx", current: "8", market: "2", best: "0" },
    ],
    vendors: [
      { vendor: "MuleSoft", solution: "Anypoint Platform", type: "iPaaS", differentials: "Conectores corporativos prontos", pricing: "Sob consulta" },
      { vendor: "Workato", solution: "Workato Enterprise", type: "iPaaS", differentials: "Setup rápido, low-code", pricing: "US$ 10k+/ano" },
    ] },
  { id: "uc5", title: "Trilha de auditoria nativa no BPMS", category: "Compliance", impact: "100% rastreável", impactLevel: "Alto", effort: "Baixo", description: "Registrar quem aprovou, quando e com base em qual evidência — exportável em PDF.", addresses: ["audit"],
    benchmarks: [
      { name: "Cobertura de auditoria", unit: "%", current: "0", market: "70", best: "100" },
    ],
    vendors: [
      { vendor: "Camunda", solution: "Audit Logs nativo", type: "BPMS", differentials: "Logs imutáveis, exportáveis", pricing: "Incluso" },
      { vendor: "Appian", solution: "Appian Audit Trail", type: "BPM", differentials: "Compliance SOX/LGPD", pricing: "Sob consulta" },
    ] },
  { id: "uc6", title: "Assistente de IA para classificação de exceções", category: "IA", impact: "-30% tempo de triagem", impactLevel: "Médio", effort: "Médio", description: "Modelo que sugere categoria e prioridade de cada solicitação.", addresses: [],
    benchmarks: [
      { name: "Tempo médio de triagem", unit: "min", current: "12", market: "5", best: "1" },
    ],
    vendors: [
      { vendor: "OpenAI", solution: "GPT-4o API", type: "LLM", differentials: "Acurácia alta, fine-tuning", pricing: "Pay-per-token" },
      { vendor: "Google", solution: "Vertex AI", type: "ML Platform", differentials: "MLOps integrado", pricing: "Pay-as-you-go" },
    ] },
];

// ============= SPAN & LAYER DEMO DATA =============
const PAINS_SL: { id: PainId; label: string; metric: string }[] = [
  { id: "manual", label: "Processo muito manual", metric: "Todas as etapas dependem de intervenção humana" },
  { id: "quality", label: "Baixa qualidade dos dados", metric: "Base com inconsistências, campos desatualizados e parâmetros sem controle" },
  { id: "effort", label: "Alto esforço e demora na geração", metric: "Ciclo longo com retrabalho recorrente a cada entrega" },
];

const ALL_PAINS = [...PAINS, ...PAINS_SL];

const RELATIONS_SL: { pain: PainId; rootCause: string; opportunity: string }[] = [
  { pain: "manual", rootCause: "Processo consolidado apenas em Excel, sem repositório estruturado", opportunity: "Databricks como repositório central + motor de cálculo" },
  { pain: "quality", rootCause: "Tabelas de parâmetros e mapeamentos mantidos manualmente, sem versionamento", opportunity: "Tabela Delta centralizada de parâmetros e mapeamentos" },
  { pain: "effort", rootCause: "Sem integração automática entre Workday e qualquer sistema analítico", opportunity: "Extração automática Workday → Databricks via API" },
  { pain: "effort", rootCause: "Ausência de workflow estruturado de revisão e aprovação", opportunity: "Workflow digital de aprovação com trilha de auditoria" },
];

const USE_CASES_SL: UseCaseRef[] = [
  { id: "sl1", title: "Extração automática Workday → Databricks via API", category: "Automação", impact: "Elimina cópia manual", impactLevel: "Alto", effort: "Médio", description: "Pipeline que extrai automaticamente os relatórios do Workday e ingere na camada Bronze do Databricks, eliminando a cópia manual para Excel que hoje inicia o ciclo.", addresses: ["manual", "effort"],
    benchmarks: [
      { name: "Tempo de extração", unit: "min", current: "120", market: "10", best: "5" },
      { name: "Frequência de retrabalho", unit: "%", current: "25", market: "8", best: "2" },
    ],
    vendors: [
      { vendor: "Workday", solution: "Workday Reports-as-a-Service", type: "API", differentials: "Endpoints nativos para People Analytics", pricing: "Incluso" },
      { vendor: "Databricks", solution: "Databricks Delta Lake (Bronze)", type: "Lakehouse", differentials: "Ingestão estruturada, Auto Loader", pricing: "Pay-as-you-go" },
    ] },
  { id: "sl2", title: "Motor de cálculo parametrizado de Span & Layer no Databricks", category: "Redesenho", impact: "Substitui macros e fórmulas manuais", impactLevel: "Alto", effort: "Médio", description: "Notebooks Databricks (Silver → Gold) que aplicam os mapeamentos, regras de exclusão e calculam layer por organização e span of control — substituindo macros e fórmulas manuais do Excel.", addresses: ["manual", "effort"],
    benchmarks: [
      { name: "Tempo de cálculo", unit: "min", current: "180", market: "15", best: "3" },
    ],
    vendors: [
      { vendor: "Databricks", solution: "PySpark / Delta", type: "Compute", differentials: "Escala para grandes bases organizacionais", pricing: "Pay-as-you-go" },
      { vendor: "dbt Labs", solution: "dbt Core", type: "Transformação", differentials: "Versionamento e testes nativos", pricing: "Open source" },
    ] },
  { id: "sl3", title: "Dashboard operacional de Span & Layer em tempo real", category: "Analytics", impact: "Disponibilização contínua", impactLevel: "Alto", effort: "Baixo", description: "Painel Power BI conectado ao Databricks (tabela Gold), com visão de span por gestor, layers por BU/área e desvios vs. benchmark — atualizado automaticamente a cada ciclo, sem retrabalho de montagem.", addresses: ["effort"],
    benchmarks: [
      { name: "Tempo até relatório disponível", unit: "horas", current: "6", market: "1", best: "0,1" },
    ],
    vendors: [
      { vendor: "Microsoft", solution: "Power BI", type: "BI", differentials: "Conector nativo Databricks", pricing: "US$ 10/usuário/mês" },
      { vendor: "Databricks", solution: "Databricks SQL", type: "Serving", differentials: "Endpoints SQL otimizados", pricing: "Pay-as-you-go" },
    ] },
  { id: "sl4", title: "Repositório centralizado de mapeamentos e parâmetros organizacionais", category: "Redesenho", impact: "Versionado e auditável", impactLevel: "Médio", effort: "Baixo", description: "Tabela Delta no Databricks com os códigos, parâmetros e regras de mapeamento da estrutura organizacional — versionada e auditável, substituindo a aba manual de Excel que precisa ser refeita a cada ciclo.", addresses: ["quality", "manual"],
    benchmarks: [
      { name: "Inconsistências por ciclo", unit: "qtd", current: "35", market: "5", best: "0" },
    ],
    vendors: [
      { vendor: "Databricks", solution: "Delta table", type: "Lakehouse", differentials: "Time travel, versionamento", pricing: "Incluso" },
    ] },
  { id: "sl5", title: "IA para recomendação de delayering", category: "IA", impact: "Apoio à decisão estrutural", impactLevel: "Muito Alto", effort: "Médio", description: "Aplicar IA para recomendar ajustes de camadas e amplitude de controle com base em carga de trabalho, complexidade e desempenho, priorizando mudanças de menor risco e maior impacto operacional.", addresses: ["effort"],
    benchmarks: [
      { name: "Cenários simulados por ciclo", unit: "qtd", current: "0", market: "5", best: "20" },
    ],
    vendors: [
      { vendor: "Databricks", solution: "Databricks ML / Python", type: "ML Platform", differentials: "MLflow, deploy integrado", pricing: "Pay-as-you-go" },
    ] },
  { id: "sl6", title: "IA para simulação de cenários de estrutura", category: "IA", impact: "Reduz ciclos de redesenho", impactLevel: "Muito Alto", effort: "Médio", description: "Simular cenários de reestruturação (spans, layers, custos e impacto em times) com otimização por restrições, permitindo comparar alternativas antes de aprovar mudanças e reduzir ciclos de redesenho.", addresses: ["effort"],
    benchmarks: [
      { name: "Tempo para avaliar cenário", unit: "dias", current: "10", market: "2", best: "0,5" },
    ],
    vendors: [
      { vendor: "Databricks", solution: "Databricks ML / Python", type: "ML Platform", differentials: "Otimização e simulação em escala", pricing: "Pay-as-you-go" },
    ] },
  { id: "sl7", title: "IA para detecção de posições fantasma", category: "IA", impact: "Eleva confiabilidade da base", impactLevel: "Alto", effort: "Médio", description: "Modelos de detecção de anomalias para identificar posições duplicadas ou inconsistentes no Workday, priorizar correções e reduzir retrabalho de validação, elevando a confiabilidade do Span & Layer.", addresses: ["quality"],
    benchmarks: [
      { name: "Posições inconsistentes detectadas", unit: "%", current: "—", market: "85", best: "98" },
    ],
    vendors: [
      { vendor: "Databricks", solution: "Databricks ML / Workday API", type: "ML Platform", differentials: "Detecção de anomalias em escala", pricing: "Pay-as-you-go" },
    ] },
  { id: "sl8", title: "IA para previsão de capacidade gerencial", category: "IA", impact: "Antecipa risco de sobrecarga", impactLevel: "Alto", effort: "Médio", description: "Modelos preditivos para estimar capacidade de gestão e risco de sobrecarga ao ampliar spans, orientando decisões de treinamento e suporte antes de mudanças estruturais.", addresses: ["quality"],
    benchmarks: [
      { name: "Acurácia da previsão de carga", unit: "%", current: "—", market: "75", best: "92" },
    ],
    vendors: [
      { vendor: "Databricks", solution: "Databricks ML / Python", type: "ML Platform", differentials: "MLOps integrado", pricing: "Pay-as-you-go" },
    ] },
  { id: "sl9", title: "Workflow digital de aprovação e publicação", category: "Compliance", impact: "Trilha de auditoria por ciclo", impactLevel: "Médio", effort: "Médio", description: "Fluxo estruturado de revisão (analista → Head RH → Diretor) com registro de aprovação e publicação automática na pasta designada, com trilha de auditoria por ciclo.", addresses: ["effort", "quality"],
    benchmarks: [
      { name: "Cobertura de auditoria", unit: "%", current: "0", market: "70", best: "100" },
    ],
    vendors: [
      { vendor: "Camunda", solution: "Camunda Platform 8", type: "BPMS", differentials: "Workflow digital com trilha", pricing: "Sob consulta" },
    ] },
];

const HEALTH_DEFAULT = [
  { id: "automation", name: "Automação", maturity: 50, risk: 50, riskLabel: "Esforço", maturityHint: "Em desenvolvimento", riskHint: "Risco moderado" },
  { id: "data", name: "Integridade dos dados", maturity: 65, risk: 35, riskLabel: "Risco", maturityHint: "Maturidade moderada", riskHint: "Risco moderado" },
  { id: "gov", name: "Governança", maturity: 75, risk: 25, riskLabel: "Risco", maturityHint: "Maturidade moderada", riskHint: "Baixo risco" },
];

const HEALTH_SL = [
  { id: "automation", name: "Automação", maturity: 0, risk: 41, riskLabel: "Esforço", maturityHint: "Baixa maturidade", riskHint: "Esforço moderado" },
  { id: "data", name: "Integridade dos dados", maturity: 85, risk: 17, riskLabel: "Risco", maturityHint: "Alta maturidade", riskHint: "Baixo risco" },
  { id: "gov", name: "Governança", maturity: 100, risk: 0, riskLabel: "Risco", maturityHint: "Maturidade plena", riskHint: "Sem risco" },
];

function ProcessHealthCompact({ pillars: pillarsProp }: { pillars?: any[] } = {}) {
  const pillars = pillarsProp ?? HEALTH_DEFAULT;
  const matColor = (s: number) => s >= 70 ? "#10B981" : s >= 50 ? "#F59E0B" : s >= 30 ? "#F97316" : "#EF4444";
  const riskColor = (s: number) => s <= 25 ? "#10B981" : s <= 50 ? "#F59E0B" : s <= 75 ? "#F97316" : "#EF4444";

  return (
    <div style={{
      background: "#fff", border: `1px solid ${C.border}`, borderRadius: 14,
      padding: 16, marginTop: 12,
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
        <Activity size={14} color={C.primary} />
        <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: 0.8, textTransform: "uppercase", color: C.primary }}>
          Saúde do processo
        </span>
        <span style={{ fontSize: 10, color: C.muted }}>· das notas de assessment</span>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)" }}>
        {pillars.map((p, i) => (
          <div key={p.id} style={{
            padding: "0 16px",
            borderRight: i < pillars.length - 1 ? `1px solid ${C.border}` : "none",
          }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: C.text, textTransform: "uppercase", letterSpacing: 0.3, marginBottom: 10 }}>
              {p.name}
            </div>
            <div style={{ marginBottom: 10 }}>
              <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 4 }}>
                <span style={{ fontSize: 10, color: C.muted }}>Maturidade</span>
                <span style={{ fontSize: 10, color: C.muted }}>{p.maturityHint}</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ fontSize: 18, fontWeight: 700, color: C.text, minWidth: 44 }}>
                  {p.maturity}<span style={{ fontSize: 10, color: C.muted, fontWeight: 400 }}>/100</span>
                </span>
                <div style={{ flex: 1, height: 4, background: "#E8E8EA", borderRadius: 2, overflow: "hidden" }}>
                  <div style={{ width: `${p.maturity}%`, height: "100%", background: matColor(p.maturity) }} />
                </div>
              </div>
            </div>
            <div>
              <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 4 }}>
                <span style={{ fontSize: 10, color: C.muted }}>{p.riskLabel}</span>
                <span style={{ fontSize: 10, color: C.muted }}>{p.riskHint}</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ fontSize: 18, fontWeight: 700, color: C.text, minWidth: 44 }}>
                  {p.risk}<span style={{ fontSize: 10, color: C.muted, fontWeight: 400 }}>/100</span>
                </span>
                <div style={{ flex: 1, height: 4, background: "#E8E8EA", borderRadius: 2, overflow: "hidden" }}>
                  <div style={{ width: `${p.risk}%`, height: "100%", background: riskColor(p.risk) }} />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function AnalysisResults({ assessmentUnavailable, processId, demo }: { assessmentUnavailable?: boolean; processId?: string | null; demo?: boolean } = {}) {
  const updateProcess = useProcessStore((s) => s.updateProcess);
  const processes = useProcessStore((s) => s.processes);
  const currentProc = processId ? processes.find((p) => p.id === processId) : undefined;
  const [activePain, setActivePain] = useState<PainId | null>(null);
  const [selected, setSelected] = useState<string[]>(() =>
    (currentProc?.useCases ?? []).map((u) => u.id)
  );
  const [onlyAddressing, setOnlyAddressing] = useState(false);
  const [onlySaved, setOnlySaved] = useState(false);
  const [detailId, setDetailId] = useState<string | null>(null);
  const [showMatrix, setShowMatrix] = useState(false);
  const [extraCases, setExtraCases] = useState<UseCaseRef[]>([]);
  const [generating, setGenerating] = useState(false);
  // editable effort/impact overrides per use-case
  const [overrides, setOverrides] = useState<Record<string, { effort?: EffortLevel; impactLevel?: ImpactLevel }>>({});

  const baseCases = demo ? USE_CASES_SL : USE_CASES;
  const basePains = demo ? PAINS_SL : PAINS;
  const baseRelations = demo ? RELATIONS_SL : RELATIONS;

  const allCases = useMemo(() => [...baseCases, ...extraCases].map((u) => ({
    ...u,
    effort: overrides[u.id]?.effort ?? u.effort,
    impactLevel: overrides[u.id]?.impactLevel ?? u.impactLevel,
  })), [baseCases, extraCases, overrides]);

  // Persist selected use cases to the process whenever the selection changes
  useEffect(() => {
    if (!processId) return;
    const ucs = allCases
      .filter((u) => selected.includes(u.id))
      .map((u) => ({ id: u.id, title: u.title, category: u.category }));
    updateProcess(processId, { useCases: ucs });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selected, processId]);

  const toggleSelect = (id: string) => {
    setSelected((s) => s.includes(id) ? s.filter((x) => x !== id) : [...s, id]);
  };

  const setOverride = (id: string, patch: { effort?: EffortLevel; impactLevel?: ImpactLevel }) => {
    setOverrides((o) => ({ ...o, [id]: { ...o[id], ...patch } }));
  };

  const handleGenerateMore = () => {
    setGenerating(true);
    setTimeout(() => {
      const idx = extraCases.length + 1;
      const samples: UseCaseRef[] = [
        { id: `gen-${Date.now()}-a`, title: "Notificações inteligentes de aprovação pendente", category: "Automação", impact: "-20% atrasos", impactLevel: "Médio", effort: "Baixo", description: "Disparos contextuais via e-mail/Teams quando aprovações se aproximam do SLA.", addresses: ["sla"],
          benchmarks: [{ name: "% aprovações no SLA", unit: "%", current: "62", market: "85", best: "97" }],
          vendors: [{ vendor: "Microsoft", solution: "Power Automate", type: "iPaaS", differentials: "Conectores nativos M365", pricing: "US$ 15/usuário/mês" }] },
        { id: `gen-${Date.now()}-b`, title: "Captura de evidências por OCR", category: "IA", impact: "+90% rastreabilidade", impactLevel: "Alto", effort: "Médio", description: "Anexa e indexa documentos comprobatórios usando OCR + classificação automática.", addresses: ["audit"],
          benchmarks: [{ name: "Cobertura de evidências", unit: "%", current: "10", market: "70", best: "100" }],
          vendors: [{ vendor: "AWS", solution: "Textract", type: "OCR/IA", differentials: "Extração estruturada", pricing: "Pay-per-page" }] },
      ];
      setExtraCases((prev) => [...prev, ...samples.slice(0, idx === 1 ? 2 : 1)]);
      setGenerating(false);
      toast.success("Novos casos de uso gerados");
    }, 900);
  };

  const filteredCases = useMemo(() => {
    let list = allCases;
    if (onlySaved) list = list.filter((u) => selected.includes(u.id));
    if (onlyAddressing) list = list.filter((u) => u.addresses.length > 0);
    if (activePain) list = list.filter((u) => u.addresses.includes(activePain));
    // sort: addressing pains first
    return [...list].sort((a, b) => b.addresses.length - a.addresses.length);
  }, [allCases, activePain, onlyAddressing, onlySaved, selected]);

  const groupedRelations = useMemo(() => {
    return basePains.map((p) => ({
      pain: p,
      items: baseRelations.filter((r) => r.pain === p.id),
    }));
  }, [basePains, baseRelations]);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {/* ============ BLOCK 1 — CURRENT ANALYSIS ============ */}
      <section>
        <SectionHeader
          eyebrow="Bloco 1"
          title="Análise atual do processo"
          subtitle="Síntese executiva e mapa de relação entre dores, causas raiz e oportunidades."
        />

        {/* Executive summary */}
        <div style={{
          background: "#fff", border: `1px solid ${C.border}`, borderLeft: `4px solid ${C.primary}`,
          borderRadius: 14, padding: 20, marginTop: 12,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
            <Sparkles size={14} color={C.primary} />
            <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: 0.8, textTransform: "uppercase", color: C.primary }}>
              Resumo executivo
            </span>
          </div>
          <p style={{ fontSize: 13.5, color: "#374151", lineHeight: 1.7, margin: 0 }}>
            {demo ? (
              <>
                O processo apresenta <strong>3 dores críticas</strong>: alto grau de manualidade em todas as etapas, baixa
                confiabilidade dos dados de entrada e elevado esforço e tempo para geração dos relatórios. O processo é
                consolidado integralmente em Excel, sem repositório estruturado de dados, o que cria dependência de macros
                frágeis, tabelas de parâmetros desatualizadas e retrabalho recorrente.{" "}
                <strong>A implementação do Databricks como repositório central</strong>, com integração à API do Workday, é o
                principal vetor de transformação — endereçando simultaneamente a qualidade dos dados, a automação do cálculo e
                a disponibilização de análises para a liderança.
              </>
            ) : (
              <>
                O processo apresenta <strong>3 dores críticas</strong> concentradas em SLA, retrabalho e auditabilidade.
                A etapa de aprovação responde por <strong>65% do lead time</strong> e a ausência de um workflow digital
                é a causa raiz dominante. Endereçar essa causa destrava simultaneamente <strong>SLA</strong> e <strong>rastreabilidade</strong>,
                enquanto a padronização de critérios reduz <strong>retrabalho em até 90%</strong>.
              </>
            )}
          </p>
          <div style={{ marginTop: 14, display: "flex", gap: 16, flexWrap: "wrap" }}>
            {[
              { label: "Dores", value: basePains.length, color: C.danger },
              { label: "Causas raiz", value: baseRelations.length, color: C.warning },
              { label: "Oportunidades", value: baseCases.length, color: C.primary },
              { label: "Confiança da análise", value: demo ? "78%" : "72%", color: C.success },
            ].map((m) => (
              <div key={m.label} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{ width: 6, height: 6, borderRadius: "50%", background: m.color }} />
                <span style={{ fontSize: 12, color: C.muted }}>{m.label}:</span>
                <span style={{ fontSize: 13, fontWeight: 700, color: C.text }}>{m.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Compact Process Health (from assessment) */}
        {assessmentUnavailable ? (
          <div style={{
            background: "#fff", border: `1px dashed ${C.border}`, borderRadius: 14,
            padding: 16, marginTop: 12, display: "flex", alignItems: "center", gap: 12,
          }}>
            <div style={{
              width: 32, height: 32, borderRadius: 8, background: C.warningBg,
              border: `1px solid ${C.warningBorder}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
            }}>
              <Info size={16} color={C.warning} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: C.text, marginBottom: 2 }}>
                Saúde do processo indisponível
              </div>
              <div style={{ fontSize: 11.5, color: C.muted, lineHeight: 1.5 }}>
                As notas de assessment não estão disponíveis porque ainda não há POP, BPMN e Assessment gerados para este processo.
                Adicione a documentação completa para visualizar as notas de Automação, Integridade dos dados e Governança.
              </div>
            </div>
          </div>
        ) : (
          <ProcessHealthCompact pillars={demo ? HEALTH_SL : HEALTH_DEFAULT} />
        )}

        {/* Pain → Root cause → Opportunity map */}
        <div style={{
          background: "#fff", border: `1px solid ${C.border}`, borderRadius: 14,
          padding: 22, marginTop: 12,
        }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <Target size={15} color={C.primary} />
              <h4 style={{ ...subTitleStyle, margin: 0 }}>Mapa: Dor → Causa raiz → Oportunidade</h4>
            </div>
            <span style={{ fontSize: 11, color: C.muted }}>
              Clique em uma dor para filtrar os casos de uso abaixo
            </span>
          </div>

          {/* Column headers */}
          <div style={{
            display: "grid", gridTemplateColumns: "minmax(220px, 1fr) 24px minmax(260px, 1.2fr) 24px minmax(260px, 1.2fr)",
            gap: 0, marginBottom: 10, alignItems: "center",
          }}>
            {[
              { label: "Dor identificada", icon: <AlertTriangle size={11} />, color: C.danger },
              null,
              { label: "Causa raiz", icon: <Target size={11} />, color: C.warning },
              null,
              { label: "Oportunidade endereçada", icon: <Lightbulb size={11} />, color: C.primary },
            ].map((h, i) => h ? (
              <div key={i} style={{
                display: "inline-flex", alignItems: "center", gap: 6,
                fontSize: 10, fontWeight: 700, letterSpacing: 0.8, textTransform: "uppercase",
                color: h.color,
              }}>
                {h.icon} {h.label}
              </div>
            ) : <div key={i} />)}
          </div>

          {/* Rows */}
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {groupedRelations.map(({ pain, items }) => {
              const isActive = activePain === pain.id;
              const color = PAIN_COLORS[pain.id];
              return (
                <div key={pain.id} style={{
                  display: "grid",
                  gridTemplateColumns: "minmax(220px, 1fr) 24px minmax(260px, 1.2fr) 24px minmax(260px, 1.2fr)",
                  gap: 0, alignItems: "stretch",
                  padding: 10, borderRadius: 12,
                  background: isActive ? `${color}08` : "transparent",
                  border: `1px solid ${isActive ? `${color}40` : "transparent"}`,
                  transition: "all 0.18s",
                }}>
                  {/* Pain card */}
                  <button
                    onClick={() => setActivePain(isActive ? null : pain.id)}
                    style={{
                      position: "relative", overflow: "hidden",
                      display: "flex", flexDirection: "column", justifyContent: "center", gap: 8,
                      background: isActive ? `linear-gradient(135deg, ${color}, ${color}dd)` : "#fff",
                      color: isActive ? "#fff" : C.text,
                      border: `1px solid ${isActive ? color : C.border}`,
                      borderRadius: 10, padding: "14px 14px 14px 18px", cursor: "pointer",
                      textAlign: "left", minHeight: 76,
                    }}
                  >
                    <span style={{
                      position: "absolute", left: 0, top: 0, bottom: 0, width: 4, background: color,
                    }} />
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <span style={{
                        width: 22, height: 22, borderRadius: 6, flexShrink: 0,
                        background: isActive ? "rgba(255,255,255,0.22)" : `${color}15`,
                        color: isActive ? "#fff" : color,
                        display: "inline-flex", alignItems: "center", justifyContent: "center",
                      }}><AlertTriangle size={12} /></span>
                      <span style={{ fontSize: 13.5, fontWeight: 600, lineHeight: 1.25 }}>{pain.label}</span>
                    </div>
                    <span style={{
                      alignSelf: "flex-start",
                      fontSize: 10.5, fontWeight: 700,
                      background: isActive ? "rgba(255,255,255,0.22)" : `${color}12`,
                      color: isActive ? "#fff" : color,
                      borderRadius: 999, padding: "2px 9px",
                    }}>{pain.metric}</span>
                  </button>

                  {/* Connector → */}
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <ChevronRight size={18} color={isActive ? color : C.mutedSoft} strokeWidth={2.5} />
                  </div>

                  {/* Causes column */}
                  <div style={{ display: "flex", flexDirection: "column", gap: 6, justifyContent: "center" }}>
                    {items.map((r, i) => (
                      <div key={i} style={{
                        fontSize: 12.5, color: C.text, padding: "10px 12px",
                        background: "#fff",
                        border: `1px solid ${C.border}`,
                        borderLeft: `3px solid ${C.warning}`,
                        borderRadius: 8,
                        display: "flex", alignItems: "center", gap: 8,
                      }}>
                        <span style={{
                          width: 18, height: 18, borderRadius: "50%", flexShrink: 0,
                          background: `${C.warning}18`, color: C.warning,
                          display: "inline-flex", alignItems: "center", justifyContent: "center",
                          fontSize: 10, fontWeight: 700,
                        }}>{i + 1}</span>
                        <span style={{ lineHeight: 1.35 }}>{r.rootCause}</span>
                      </div>
                    ))}
                  </div>

                  {/* Connector → */}
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <ChevronRight size={18} color={isActive ? color : C.mutedSoft} strokeWidth={2.5} />
                  </div>

                  {/* Opportunities column */}
                  <div style={{ display: "flex", flexDirection: "column", gap: 6, justifyContent: "center" }}>
                    {items.map((r, i) => (
                      <div key={i} style={{
                        fontSize: 12.5, color: C.text, padding: "10px 12px",
                        background: `linear-gradient(90deg, ${C.primary}10, ${C.primary}04)`,
                        border: `1px solid ${C.primaryBorder}`,
                        borderRadius: 8,
                        display: "flex", alignItems: "center", gap: 8, fontWeight: 500,
                      }}>
                        <span style={{
                          width: 20, height: 20, borderRadius: 6, flexShrink: 0,
                          background: C.primary, color: "#fff",
                          display: "inline-flex", alignItems: "center", justifyContent: "center",
                        }}><Lightbulb size={11} /></span>
                        <span style={{ lineHeight: 1.35 }}>{r.opportunity}</span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ============ BLOCK 2 — USE CASES ============ */}
      <section>
        <SectionHeader
          eyebrow="Bloco 2"
          title="Casos de uso de referência"
          subtitle="Selecione os casos que servirão como base para reescrever o processo (TO-BE)."
        />

        {/* Toolbar */}
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          gap: 12, marginTop: 12, marginBottom: 10, flexWrap: "wrap",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
            <span style={{ fontSize: 11, fontWeight: 600, color: C.muted, textTransform: "uppercase", letterSpacing: 0.6 }}>
              Filtrar por dor:
            </span>
            <button
              onClick={() => setActivePain(null)}
              style={{
                fontSize: 11, fontWeight: 600, padding: "4px 10px", borderRadius: 999,
                border: `1px solid ${activePain === null ? C.primary : C.border}`,
                background: activePain === null ? C.primary : "#fff",
                color: activePain === null ? "#fff" : C.text, cursor: "pointer",
              }}
            >Todas</button>
            {basePains.map((p) => {
              const active = activePain === p.id;
              const color = PAIN_COLORS[p.id];
              return (
                <button key={p.id} onClick={() => setActivePain(active ? null : p.id)}
                  style={{
                    fontSize: 11, fontWeight: 600, padding: "4px 10px", borderRadius: 999,
                    border: `1px solid ${active ? color : C.border}`,
                    background: active ? color : "#fff",
                    color: active ? "#fff" : C.text, cursor: "pointer",
                    display: "inline-flex", alignItems: "center", gap: 6,
                  }}>
                  <span style={{ width: 6, height: 6, borderRadius: "50%", background: active ? "#fff" : color }} />
                  {p.label}
                </button>
              );
            })}
            <label style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 11, color: C.muted, cursor: "pointer", marginLeft: 8 }}>
              <input type="checkbox" checked={onlyAddressing} onChange={(e) => setOnlyAddressing(e.target.checked)} />
              Apenas que endereçam dores
            </label>
            <label style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 11, color: C.muted, cursor: "pointer" }}>
              <input type="checkbox" checked={onlySaved} onChange={(e) => setOnlySaved(e.target.checked)} />
              <Bookmark size={11} /> Apenas salvos
            </label>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <button
              onClick={handleGenerateMore}
              disabled={generating}
              style={{
                display: "inline-flex", alignItems: "center", gap: 6,
                fontSize: 12, fontWeight: 600, padding: "6px 12px", borderRadius: 8,
                border: `1px solid ${C.primary}`, background: C.primary, color: "#fff",
                cursor: generating ? "wait" : "pointer", opacity: generating ? 0.7 : 1,
              }}
            >
              {generating ? <RefreshCw size={13} className="animate-spin" /> : <Sparkles size={13} />}
              {generating ? "Gerando..." : "Gerar novos casos"}
            </button>
            <button
              onClick={() => setShowMatrix(true)}
              style={{
                display: "inline-flex", alignItems: "center", gap: 6,
                fontSize: 12, fontWeight: 600, padding: "6px 12px", borderRadius: 8,
                border: `1px solid ${C.primary}`, background: "#fff", color: C.primary,
                cursor: "pointer",
              }}
            >
              <Gauge size={13} /> Matriz de priorização
            </button>
            <div style={{
              fontSize: 12, fontWeight: 600, color: C.primary,
              background: C.primaryBg, border: `1px solid ${C.primaryBorder}`,
              borderRadius: 8, padding: "5px 10px",
            }}>
              {selected.length} selecionado{selected.length === 1 ? "" : "s"} para o TO-BE
            </div>
          </div>
        </div>

        {/* Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(420px, 1fr))", gap: 12 }}>
          {filteredCases.map((u) => {
            const isSelected = selected.includes(u.id);
            const addresses = u.addresses.length > 0;
            const effortPct = u.effort === "Baixo" ? 33 : u.effort === "Médio" ? 66 : 100;
            const impactPct = u.impactLevel === "Baixo" ? 33 : u.impactLevel === "Médio" ? 66 : 100;
            const effortColor = u.effort === "Baixo" ? "#16A34A" : u.effort === "Médio" ? "#F59E0B" : "#EA580C";
            const impactColor = u.impactLevel === "Baixo" ? "#94A3B8" : u.impactLevel === "Médio" ? "#16A34A" : "#059669";
            return (
              <div key={u.id}
                onClick={() => setDetailId(u.id)}
                style={{
                  position: "relative", background: "#fff", cursor: "pointer",
                  border: `1px solid ${isSelected ? C.primary : addresses ? C.primaryBorder : C.border}`,
                  borderRadius: 10, padding: "14px 16px",
                  boxShadow: isSelected ? `0 0 0 2px ${C.primary}20` : "none",
                  transition: "all 0.15s",
                }}>
                {/* Top row: bookmark + title + delete */}
                <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                  <button
                    onClick={(e) => { e.stopPropagation(); toggleSelect(u.id); }}
                    title={isSelected ? "Remover dos selecionados" : "Salvar como referência"}
                    style={{
                      border: "none", background: "transparent", cursor: "pointer",
                      padding: 0, marginTop: 2, color: isSelected ? C.primary : C.mutedSoft,
                    }}
                  >
                    {isSelected
                      ? <BookmarkCheck size={16} fill={C.primary} />
                      : <Bookmark size={16} />}
                  </button>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 14, fontWeight: 600, color: C.text, lineHeight: 1.3 }}>
                      {u.title}
                    </div>
                    <div style={{ marginTop: 6, display: "inline-flex", alignItems: "center", gap: 4 }}>
                      <span style={{
                        fontSize: 10.5, fontWeight: 600,
                        background: C.primaryBg, color: C.primary,
                        border: `1px solid ${C.primaryBorder}`,
                        borderRadius: 4, padding: "2px 6px",
                        display: "inline-flex", alignItems: "center", gap: 3,
                      }}>
                        <Info size={9} /> {u.category}
                      </span>
                    </div>
                  </div>
                  <X size={14} style={{ color: C.mutedSoft, marginTop: 2, flexShrink: 0 }} />
                </div>

                {/* Description */}
                <p style={{ fontSize: 12.5, color: C.muted, lineHeight: 1.5, margin: "10px 0 12px", paddingLeft: 26 }}>
                  {u.description}
                </p>

                {/* Pain tags */}
                {addresses && (
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginBottom: 10, paddingLeft: 26 }}>
                    <span style={{
                      fontSize: 9.5, fontWeight: 700, letterSpacing: 0.4, textTransform: "uppercase",
                      background: C.primary, color: "#fff",
                      borderRadius: 999, padding: "2px 7px",
                      display: "inline-flex", alignItems: "center", gap: 3,
                    }}>
                      <Sparkles size={9} /> Endereça dor
                    </span>
                    {u.addresses.map((aId) => {
                      const p = basePains.find((x) => x.id === aId)!;
                      const color = PAIN_COLORS[aId];
                      return (
                        <span key={aId} style={{
                          fontSize: 10, fontWeight: 600,
                          background: `${color}15`, color, border: `1px solid ${color}30`,
                          borderRadius: 999, padding: "2px 7px",
                        }}>{p.label}</span>
                      );
                    })}
                  </div>
                )}

                {/* Effort + Impact bars */}
                <div style={{ display: "flex", alignItems: "center", gap: 18, paddingLeft: 26, flexWrap: "wrap" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, minWidth: 220 }}>
                    <span style={{ fontSize: 11, color: C.muted, display: "inline-flex", alignItems: "center", gap: 4 }}>
                      <Zap size={11} /> Esforço
                    </span>
                    <div style={{ flex: 1, height: 4, background: C.borderSoft, borderRadius: 999, overflow: "hidden", maxWidth: 130 }}>
                      <div style={{ width: `${effortPct}%`, height: "100%", background: effortColor }} />
                    </div>
                    <span style={{ fontSize: 11, fontWeight: 600, color: C.text }}>{u.effort}</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, minWidth: 220 }}>
                    <span style={{ fontSize: 11, color: C.muted, display: "inline-flex", alignItems: "center", gap: 4 }}>
                      <TrendingUp size={11} /> Impacto
                    </span>
                    <div style={{ flex: 1, height: 4, background: C.borderSoft, borderRadius: 999, overflow: "hidden", maxWidth: 130 }}>
                      <div style={{ width: `${impactPct}%`, height: "100%", background: impactColor }} />
                    </div>
                    <span style={{ fontSize: 11, fontWeight: 600, color: C.text }}>{u.impactLevel}</span>
                  </div>
                </div>

                {/* Source reference */}
                <div style={{ marginTop: 10, paddingLeft: 26, display: "flex", alignItems: "center", gap: 4 }}>
                  <ChevronRight size={11} style={{ color: C.primary }} />
                  <a
                    href="#"
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
                    style={{ fontSize: 11.5, color: C.primary, textDecoration: "none", fontWeight: 500 }}
                  >
                    {u.vendors[0]?.vendor}, {u.vendors[0]?.solution}
                  </a>
                </div>
              </div>
            );
          })}
        </div>

        {filteredCases.length === 0 && (
          <div style={{
            textAlign: "center", padding: 32, color: C.muted, fontSize: 13,
            background: "#fff", border: `1px dashed ${C.border}`, borderRadius: 12,
          }}>
            Nenhum caso de uso corresponde ao filtro selecionado.
          </div>
        )}
      </section>

      {detailId && (
        <UseCaseDetailModal
          useCase={allCases.find((u) => u.id === detailId)!}
          isSelected={selected.includes(detailId)}
          onToggleSelect={() => toggleSelect(detailId)}
          onClose={() => setDetailId(null)}
          onChangeEffort={(eff) => setOverride(detailId, { effort: eff })}
          onChangeImpact={(imp) => setOverride(detailId, { impactLevel: imp })}
        />
      )}
      {showMatrix && (
        <PrioritizationMatrixModal
          useCases={allCases}
          selected={selected}
          onToggleSelect={toggleSelect}
          onOpenDetail={(id) => { setShowMatrix(false); setDetailId(id); }}
          onClose={() => setShowMatrix(false)}
        />
      )}
    </div>
  );
}

// ============= USE CASE DETAIL MODAL (Benchmarking + Screen & Match) =============
function UseCaseDetailModal({
  useCase, isSelected, onToggleSelect, onClose, onChangeEffort, onChangeImpact,
}: {
  useCase: UseCaseRef; isSelected: boolean; onToggleSelect: () => void; onClose: () => void;
  onChangeEffort: (e: EffortLevel) => void;
  onChangeImpact: (i: ImpactLevel) => void;
}) {
  const addresses = useCase.addresses.length > 0;

  // Lock body scroll
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [onClose]);

  const [benchmarkOpen, setBenchmarkOpen] = useState(false);
  const [benchmarkGenerated, setBenchmarkGenerated] = useState(false);
  const [benchmarkLoading, setBenchmarkLoading] = useState(false);

  const [screenOpen, setScreenOpen] = useState(false);
  const [screenGenerated, setScreenGenerated] = useState(false);
  const [screenLoading, setScreenLoading] = useState(false);

  const [currentValues, setCurrentValues] = useState<string[]>(
    useCase.benchmarks.map(() => "")
  );

  const generateBenchmark = () => {
    setBenchmarkLoading(true);
    setTimeout(() => {
      setBenchmarkLoading(false);
      setBenchmarkGenerated(true);
      setBenchmarkOpen(true);
    }, 900);
  };
  const generateScreen = () => {
    setScreenLoading(true);
    setTimeout(() => {
      setScreenLoading(false);
      setScreenGenerated(true);
      setScreenOpen(true);
    }, 900);
  };

  const evaluate = (currentRaw: string, marketRaw: string, bestRaw: string) => {
    const toNum = (s: string) => {
      const n = parseFloat(String(s).replace(",", ".").replace(/[^\d.\-]/g, ""));
      return isNaN(n) ? null : n;
    };
    const c = toNum(currentRaw), m = toNum(marketRaw), b = toNum(bestRaw);
    if (c === null || m === null || b === null) {
      return { label: "Informe um valor", color: C.muted, bg: C.bg, border: C.border };
    }
    const lowerIsBetter = b < m;
    const within = lowerIsBetter ? c <= m && c >= b : c >= m && c <= b;
    const better = lowerIsBetter ? c < b : c > b;
    const worse = lowerIsBetter ? c > m : c < m;
    if (better) return { label: "Acima do best-in-class", color: "#5B21B6", bg: "#F5F3FF", border: "#DDD6FE" };
    if (within) return { label: "Dentro da faixa de mercado", color: "#15803D", bg: "#F0FDF4", border: "#BBF7D0" };
    if (worse) return { label: "Abaixo da faixa de mercado", color: "#B91C1C", bg: "#FEF2F2", border: "#FECACA" };
    return { label: "—", color: C.muted, bg: C.bg, border: C.border };
  };

  const LEVELS: (EffortLevel | ImpactLevel)[] = ["Baixo", "Médio", "Alto"];
  const pillBtn = (active: boolean, color: string) => ({
    fontSize: 11, fontWeight: 600, padding: "3px 9px", borderRadius: 999,
    border: `1px solid ${active ? color : C.border}`,
    background: active ? color : "#fff",
    color: active ? "#fff" : C.text, cursor: "pointer",
  } as React.CSSProperties);

  return createPortal(
    <div onClick={onClose} style={{
      position: "fixed", inset: 0, zIndex: 60, background: "rgba(15,18,40,0.5)",
      display: "grid", placeItems: "center", padding: 24,
      overflow: "auto", overscrollBehavior: "contain", boxSizing: "border-box",
    }}>
      <div onClick={(e) => e.stopPropagation()} style={{
        background: "#fff", borderRadius: 16, width: "min(960px, 100%)",
        maxHeight: "calc(100vh - 48px)", display: "flex", flexDirection: "column",
        border: `1px solid ${C.border}`, overflow: "hidden",
      }}>
        {/* Header */}
        <div style={{ padding: "18px 22px", borderBottom: `1px solid ${C.border}`, display: "flex", alignItems: "flex-start", gap: 12 }}>
          <div style={{
            width: 38, height: 38, borderRadius: 10, flexShrink: 0,
            background: addresses ? C.primary : C.borderSoft,
            color: addresses ? "#fff" : C.muted,
            display: "flex", alignItems: "center", justifyContent: "center",
          }}><Lightbulb size={18} /></div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 0.8, textTransform: "uppercase", color: C.muted }}>
              {useCase.category}
            </div>
            <h3 style={{ fontSize: 17, fontWeight: 700, color: C.text, margin: "2px 0 6px" }}>{useCase.title}</h3>
            <p style={{ fontSize: 12.5, color: C.muted, margin: 0, lineHeight: 1.5 }}>{useCase.description}</p>
            {addresses && (
              <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginTop: 8 }}>
                {useCase.addresses.map((aId) => {
                  const p = ALL_PAINS.find((x) => x.id === aId)!;
                  const color = PAIN_COLORS[aId];
                  return (
                    <span key={aId} style={{
                      fontSize: 10, fontWeight: 600,
                      background: `${color}15`, color, border: `1px solid ${color}30`,
                      borderRadius: 999, padding: "2px 7px",
                      display: "inline-flex", alignItems: "center", gap: 4,
                    }}>
                      <Sparkles size={9} /> Endereça: {p.label}
                    </span>
                  );
                })}
              </div>
            )}
          </div>
          <button onClick={onClose} style={{
            border: "none", background: "transparent", cursor: "pointer",
            color: C.muted, padding: 4,
          }}><X size={18} /></button>
        </div>

        {/* Header KPIs: ganho potencial + esforço/impacto editáveis */}
        <div style={{
          padding: "14px 22px", borderBottom: `1px solid ${C.border}`, background: C.surface,
          display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12,
        }}>
          <div style={{ border: `1px solid ${C.successBorder}`, background: C.successBg, borderRadius: 10, padding: "10px 12px" }}>
            <div style={{ fontSize: 9.5, fontWeight: 700, letterSpacing: 0.6, textTransform: "uppercase", color: C.muted, marginBottom: 4 }}>
              <TrendingUp size={10} style={{ display: "inline", marginRight: 4 }} /> Ganho potencial
            </div>
            <div style={{ fontSize: 15, fontWeight: 700, color: C.success }}>{useCase.impact}</div>
          </div>
          <div style={{ border: `1px solid ${C.border}`, background: "#fff", borderRadius: 10, padding: "10px 12px" }}>
            <div style={{ fontSize: 9.5, fontWeight: 700, letterSpacing: 0.6, textTransform: "uppercase", color: C.muted, marginBottom: 6 }}>
              <Zap size={10} style={{ display: "inline", marginRight: 4 }} /> Esforço
            </div>
            <div style={{ display: "flex", gap: 4 }}>
              {LEVELS.map((l) => (
                <button key={l} onClick={() => onChangeEffort(l as EffortLevel)} style={pillBtn(useCase.effort === l, "#EA580C")}>
                  {l}
                </button>
              ))}
            </div>
          </div>
          <div style={{ border: `1px solid ${C.border}`, background: "#fff", borderRadius: 10, padding: "10px 12px" }}>
            <div style={{ fontSize: 9.5, fontWeight: 700, letterSpacing: 0.6, textTransform: "uppercase", color: C.muted, marginBottom: 6 }}>
              <TrendingUp size={10} style={{ display: "inline", marginRight: 4 }} /> Impacto
            </div>
            <div style={{ display: "flex", gap: 4 }}>
              {LEVELS.map((l) => (
                <button key={l} onClick={() => onChangeImpact(l as ImpactLevel)} style={pillBtn(useCase.impactLevel === l, C.success)}>
                  {l}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Body */}
        <div style={{ overflowY: "auto", padding: 22, display: "flex", flexDirection: "column", gap: 14 }}>
          {/* Benchmarking */}
          <section style={{ border: `1px solid ${C.border}`, borderRadius: 12, overflow: "hidden", background: "#fff" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 16px", gap: 12 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ width: 32, height: 32, borderRadius: 8, background: C.primaryBg, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <BarChart3 size={16} color={C.primary} />
                </div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: C.text }}>Benchmarking</div>
                  <div style={{ fontSize: 11, color: C.muted }}>Compare seus indicadores com mercado e best-in-class</div>
                </div>
              </div>
              {!benchmarkGenerated ? (
                <button onClick={generateBenchmark} disabled={benchmarkLoading} style={{
                  display: "inline-flex", alignItems: "center", gap: 6,
                  fontSize: 12, fontWeight: 600, padding: "7px 12px", borderRadius: 8,
                  background: C.primary, color: "#fff", border: "none", cursor: benchmarkLoading ? "wait" : "pointer",
                  opacity: benchmarkLoading ? 0.7 : 1,
                }}>
                  {benchmarkLoading ? <RefreshCw size={12} className="animate-spin" /> : <Sparkles size={12} />}
                  {benchmarkLoading ? "Gerando..." : "Gerar Benchmarking"}
                </button>
              ) : (
                <button onClick={() => setBenchmarkOpen(!benchmarkOpen)} style={{
                  border: "none", background: "transparent", cursor: "pointer", color: C.muted,
                }}>
                  {benchmarkOpen ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
                </button>
              )}
            </div>
            {benchmarkOpen && benchmarkGenerated && (
              <div style={{ padding: "0 16px 16px", display: "flex", flexDirection: "column", gap: 10, borderTop: `1px solid ${C.borderSoft}` }}>
                <div style={{ fontSize: 11, color: C.muted, marginTop: 12 }}>Informe seu indicador atual para comparar com o mercado</div>
                {useCase.benchmarks.map((b, i) => {
                  const status = evaluate(currentValues[i], b.market, b.best);
                  return (
                    <div key={i} style={{ border: `1px solid ${C.border}`, borderRadius: 10, padding: 12, background: "#fff" }}>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, marginBottom: 8 }}>
                        <div style={{ fontSize: 12.5, fontWeight: 600, color: C.text }}>
                          {b.name} <span style={{ fontWeight: 400, color: C.muted }}>· {b.unit}</span>
                        </div>
                        <span style={{
                          fontSize: 10.5, fontWeight: 700,
                          background: status.bg, color: status.color, border: `1px solid ${status.border}`,
                          borderRadius: 999, padding: "3px 9px",
                        }}>● {status.label}</span>
                      </div>
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
                        <div style={{ background: "#fff", border: `1px solid ${status.border}`, borderRadius: 8, padding: "8px 10px" }}>
                          <div style={{ fontSize: 9.5, fontWeight: 700, letterSpacing: 0.6, textTransform: "uppercase", color: C.muted, marginBottom: 2 }}>
                            Seu indicador (atual)
                          </div>
                          <input
                            value={currentValues[i]}
                            onChange={(e) => {
                              const next = [...currentValues];
                              next[i] = e.target.value;
                              setCurrentValues(next);
                            }}
                            placeholder="—"
                            style={{ width: "100%", border: "none", outline: "none", background: "transparent", padding: 0, fontSize: 16, fontWeight: 700, color: status.color }}
                          />
                        </div>
                        <div style={{ background: "#FFFBEB", border: "1px solid #FDE68A", borderRadius: 8, padding: "8px 10px" }}>
                          <div style={{ fontSize: 9.5, fontWeight: 700, letterSpacing: 0.6, textTransform: "uppercase", color: C.muted }}>Mercado</div>
                          <div style={{ fontSize: 16, fontWeight: 700, color: "#92400E" }}>{b.market}</div>
                        </div>
                        <div style={{ background: "#F5F3FF", border: "1px solid #DDD6FE", borderRadius: 8, padding: "8px 10px" }}>
                          <div style={{ fontSize: 9.5, fontWeight: 700, letterSpacing: 0.6, textTransform: "uppercase", color: C.muted }}>Best-in-class</div>
                          <div style={{ fontSize: 16, fontWeight: 700, color: "#5B21B6" }}>{b.best}</div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </section>

          {/* Screen & Match */}
          <section style={{ border: `1px solid ${C.border}`, borderRadius: 12, overflow: "hidden", background: "#fff" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 16px", gap: 12 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ width: 32, height: 32, borderRadius: 8, background: "#F3E8FF", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Search size={16} color="#7C3AED" />
                </div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: C.text }}>Screen &amp; Match</div>
                  <div style={{ fontSize: 11, color: C.muted }}>Encontre soluções prontas no mercado</div>
                </div>
              </div>
              {!screenGenerated ? (
                <button onClick={generateScreen} disabled={screenLoading} style={{
                  display: "inline-flex", alignItems: "center", gap: 6,
                  fontSize: 12, fontWeight: 600, padding: "7px 12px", borderRadius: 8,
                  background: C.primary, color: "#fff", border: "none", cursor: screenLoading ? "wait" : "pointer",
                  opacity: screenLoading ? 0.7 : 1,
                }}>
                  {screenLoading ? <RefreshCw size={12} className="animate-spin" /> : <Search size={12} />}
                  {screenLoading ? "Buscando..." : "Buscar Soluções"}
                </button>
              ) : (
                <button onClick={() => setScreenOpen(!screenOpen)} style={{
                  border: "none", background: "transparent", cursor: "pointer", color: C.muted,
                }}>
                  {screenOpen ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
                </button>
              )}
            </div>
            {screenOpen && screenGenerated && (
              <div style={{ borderTop: `1px solid ${C.borderSoft}`, overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
                  <thead>
                    <tr style={{ background: C.bg }}>
                      {["Vendor", "Solução", "Tipo", "Diferenciais", "Preço"].map((h) => (
                        <th key={h} style={{
                          textAlign: "left", padding: "8px 10px",
                          fontSize: 10, fontWeight: 700, letterSpacing: 0.6,
                          textTransform: "uppercase", color: C.muted,
                          borderBottom: `1px solid ${C.border}`,
                        }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {useCase.vendors.map((v, i) => (
                      <tr key={i} style={{ borderBottom: i < useCase.vendors.length - 1 ? `1px solid ${C.borderSoft}` : "none" }}>
                        <td style={{ padding: "10px", fontWeight: 600, color: C.text }}>{v.vendor}</td>
                        <td style={{ padding: "10px", color: C.text }}>{v.solution}</td>
                        <td style={{ padding: "10px" }}>
                          <span style={{
                            fontSize: 10, fontWeight: 600, background: C.primaryBg,
                            color: C.primary, border: `1px solid ${C.primaryBorder}`,
                            borderRadius: 999, padding: "2px 7px",
                          }}>{v.type}</span>
                        </td>
                        <td style={{ padding: "10px", color: C.muted, fontSize: 11.5 }}>{v.differentials}</td>
                        <td style={{ padding: "10px", color: C.muted, fontSize: 11.5 }}>{v.pricing}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        </div>

        {/* Footer */}
        <div style={{
          padding: "14px 22px", borderTop: `1px solid ${C.border}`,
          display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 8,
          background: C.surface,
        }}>
          <button onClick={onClose} style={{
            fontSize: 12, fontWeight: 600, padding: "7px 14px", borderRadius: 8,
            border: `1px solid ${C.border}`, background: "#fff", color: C.text, cursor: "pointer",
          }}>Fechar</button>
          <button onClick={onToggleSelect} style={{
            display: "inline-flex", alignItems: "center", gap: 6,
            fontSize: 12, fontWeight: 600, padding: "7px 14px", borderRadius: 8,
            border: `1px solid ${C.primary}`,
            background: isSelected ? "#fff" : C.primary,
            color: isSelected ? C.primary : "#fff", cursor: "pointer",
          }}>
            {isSelected ? <><Check size={13} /> Selecionado para TO-BE</> : <><Plus size={13} /> Usar como referência no TO-BE</>}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}

// ============= PRIORITIZATION MATRIX (Effort × Impact) =============
function PrioritizationMatrixModal({
  useCases, selected, onToggleSelect, onOpenDetail, onClose,
}: {
  useCases: UseCaseRef[];
  selected: string[];
  onToggleSelect: (id: string) => void;
  onOpenDetail: (id: string) => void;
  onClose: () => void;
}) {
  // group overlapping points
  const groups = useMemo(() => {
    const map = new Map<string, UseCaseRef[]>();
    useCases.forEach((u) => {
      const key = `${u.effort}-${u.impactLevel}`;
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(u);
    });
    return Array.from(map.entries()).map(([key, ucs]) => ({
      key,
      x: EFFORT_NUM[ucs[0].effort],
      y: 1 - IMPACT_NUM[ucs[0].impactLevel],
      ucs,
    }));
  }, [useCases]);

  const quadrants = [
    { title: "Quick Wins", desc: "Alto impacto · baixo esforço", bg: "#F0FDF4" },
    { title: "Projetos Estratégicos", desc: "Alto impacto · alto esforço", bg: "#EEF2FF" },
    { title: "Ações Táticas", desc: "Baixo impacto · baixo esforço", bg: "#FFFFFF" },
    { title: "Reconsiderar", desc: "Baixo impacto · alto esforço", bg: "#FEF2F2" },
  ];

  return (
    <div onClick={onClose} style={{
      position: "fixed", inset: 0, zIndex: 60, background: "rgba(15,18,40,0.5)",
      display: "flex", alignItems: "center", justifyContent: "center", padding: 24,
    }}>
      <div onClick={(e) => e.stopPropagation()} style={{
        background: "#fff", borderRadius: 16, width: "min(1200px, 100%)",
        maxHeight: "92vh", display: "flex", flexDirection: "column",
        border: `1px solid ${C.border}`, overflow: "hidden",
      }}>
        <div style={{ padding: "18px 22px", borderBottom: `1px solid ${C.border}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <h3 style={{ fontSize: 17, fontWeight: 700, color: C.text, margin: 0 }}>Matriz Esforço × Impacto</h3>
            <p style={{ fontSize: 12, color: C.muted, margin: "2px 0 0" }}>
              {useCases.length} casos de uso · {selected.length} selecionados
            </p>
          </div>
          <button onClick={onClose} style={{
            border: "none", background: "transparent", cursor: "pointer", color: C.muted,
          }}><X size={18} /></button>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", flex: 1, minHeight: 0 }}>
          {/* Matrix */}
          <div style={{ padding: 24, position: "relative", display: "flex", flexDirection: "column" }}>
            <div style={{ position: "relative", flex: 1, minHeight: 420 }}>
              {/* Y axis label */}
              <div style={{
                position: "absolute", left: -6, top: "50%", transform: "rotate(-90deg) translateX(50%)",
                fontSize: 10, fontWeight: 700, letterSpacing: 0.8, textTransform: "uppercase", color: C.muted,
                transformOrigin: "left top",
              }}>Impacto →</div>
              {/* X axis label */}
              <div style={{
                position: "absolute", bottom: -22, left: "50%", transform: "translateX(-50%)",
                fontSize: 10, fontWeight: 700, letterSpacing: 0.8, textTransform: "uppercase", color: C.muted,
              }}>Esforço →</div>

              {/* Quadrants */}
              <div style={{
                position: "absolute", inset: 0, display: "grid",
                gridTemplateColumns: "1fr 1fr", gridTemplateRows: "1fr 1fr",
                border: `1px solid ${C.border}`, borderRadius: 10, overflow: "hidden",
              }}>
                {quadrants.map((q, i) => (
                  <div key={i} style={{
                    background: q.bg, padding: 12,
                    borderRight: i % 2 === 0 ? `1px solid ${C.border}` : "none",
                    borderBottom: i < 2 ? `1px solid ${C.border}` : "none",
                  }}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: C.text }}>{q.title}</div>
                    <div style={{ fontSize: 10.5, color: C.muted }}>{q.desc}</div>
                  </div>
                ))}
              </div>

              {/* Points */}
              {groups.map((g) => {
                const hasSelected = g.ucs.some((u) => selected.includes(u.id));
                const hasAddressing = g.ucs.some((u) => u.addresses.length > 0);
                const color = hasSelected ? C.primary : hasAddressing ? C.primaryDeep : C.mutedSoft;
                return (
                  <div key={g.key} style={{
                    position: "absolute",
                    left: `${g.x * 100}%`, top: `${g.y * 100}%`,
                    transform: "translate(-50%, -50%)", zIndex: 2,
                  }}>
                    {g.ucs.length === 1 ? (
                      <button
                        onClick={() => onOpenDetail(g.ucs[0].id)}
                        title={g.ucs[0].title}
                        style={{
                          width: 14, height: 14, borderRadius: "50%", background: color,
                          border: `2px solid #fff`, boxShadow: `0 1px 4px rgba(0,0,0,0.15)`,
                          cursor: "pointer",
                        }}
                      />
                    ) : (
                      <div style={{
                        width: 28, height: 28, borderRadius: "50%", background: color,
                        color: "#fff", fontSize: 11, fontWeight: 700,
                        border: `2px solid #fff`, boxShadow: `0 1px 4px rgba(0,0,0,0.15)`,
                        display: "flex", alignItems: "center", justifyContent: "center",
                      }}>+{g.ucs.length}</div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Side list */}
          <div style={{
            borderLeft: `1px solid ${C.border}`, overflowY: "auto",
            display: "flex", flexDirection: "column",
          }}>
            <div style={{ padding: "12px 16px", borderBottom: `1px solid ${C.border}` }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: C.text }}>Casos de uso</div>
              <div style={{ fontSize: 10.5, color: C.muted }}>{useCases.length} itens</div>
            </div>
            {useCases.map((u) => {
              const isSel = selected.includes(u.id);
              const addresses = u.addresses.length > 0;
              return (
                <div key={u.id} style={{
                  padding: "10px 16px", borderBottom: `1px solid ${C.borderSoft}`,
                  display: "flex", gap: 8, cursor: "pointer",
                  background: isSel ? C.primaryBg : "#fff",
                }}
                  onClick={() => onOpenDetail(u.id)}
                >
                  <div style={{
                    width: 8, height: 8, borderRadius: "50%", marginTop: 5, flexShrink: 0,
                    background: isSel ? C.primary : addresses ? C.primaryDeep : C.mutedSoft,
                  }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 12, fontWeight: 600, color: C.text, lineHeight: 1.3 }}>{u.title}</div>
                    <div style={{ fontSize: 10.5, color: C.muted, marginTop: 2 }}>
                      Esforço {u.effort} · Impacto {u.impactLevel}
                    </div>
                    {addresses && (
                      <div style={{ display: "flex", flexWrap: "wrap", gap: 3, marginTop: 4 }}>
                        {u.addresses.map((aId) => {
                          const color = PAIN_COLORS[aId];
                          const p = ALL_PAINS.find((x) => x.id === aId)!;
                          return (
                            <span key={aId} style={{
                              fontSize: 9, fontWeight: 600,
                              background: `${color}15`, color, border: `1px solid ${color}30`,
                              borderRadius: 999, padding: "1px 6px",
                            }}>{p.label}</span>
                          );
                        })}
                      </div>
                    )}
                  </div>
                  <button
                    onClick={(e) => { e.stopPropagation(); onToggleSelect(u.id); }}
                    title={isSel ? "Remover" : "Selecionar"}
                    style={{
                      border: `1px solid ${isSel ? C.primary : C.border}`,
                      background: isSel ? C.primary : "#fff",
                      color: isSel ? "#fff" : C.muted,
                      borderRadius: 6, width: 24, height: 24, flexShrink: 0,
                      cursor: "pointer", display: "inline-flex", alignItems: "center", justifyContent: "center",
                    }}
                  >
                    {isSel ? <Check size={12} /> : <Plus size={12} />}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

function SectionHeader({ eyebrow, title, subtitle }: { eyebrow: string; title: string; subtitle: string }) {
  return (
    <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 12 }}>
      <div>
        <div style={{ fontSize: 9.5, fontWeight: 700, letterSpacing: 1.2, textTransform: "uppercase", color: C.primary }}>
          {eyebrow}
        </div>
        <h3 style={{ fontSize: 18, fontWeight: 700, color: C.text, margin: "4px 0 2px" }}>{title}</h3>
        <p style={{ fontSize: 12.5, color: C.muted, margin: 0 }}>{subtitle}</p>
      </div>
    </div>
  );
}

// ============= STEP 4 — Business Case (redesigned) =============
function BusinessCaseStep({ processId, demo }: { processId?: string | null; demo?: boolean }) {
  const updateProcess = useProcessStore((s) => s.updateProcess);
  const processes = useProcessStore((s) => s.processes);
  const currentProc = processId ? processes.find((p) => p.id === processId) : undefined;

  const [phase, setPhase] = useState<"premises" | "result">("premises");

  // Financial premises
  const [capex, setCapex] = useState(demo ? 320000 : 300000);
  const [opex, setOpex] = useState(demo ? 18000 : 15000);
  const [wacc, setWacc] = useState(15);
  const [horizon, setHorizon] = useState(3);
  const [rampUp, setRampUp] = useState(demo ? 3 : 4);
  const [extraSavingAnnual, setExtraSavingAnnual] = useState(0);

  // Efficiency premises (structured)
  const [eff, setEff] = useState(demo ? {
    volume: 4,          // ciclos/ano
    costHour: 180,
    hoursAsIs: 6,
    hoursToBe: 0.75,
    reworkAsIs: 25,
    reworkToBe: 3,
  } : {
    volume: 412,        // transações/mês
    costHour: 85,       // R$/h
    hoursAsIs: 3.2,     // h por transação AS-IS
    hoursToBe: 1.4,     // h por transação TO-BE
    reworkAsIs: 18,     // % retrabalho atual
    reworkToBe: 5,      // % retrabalho meta
  });

  const [scenario, setScenario] = useState<"base" | "optimistic">("base");
  const [recalc, setRecalc] = useState(false);

  const updateEff = (key: keyof typeof eff, value: number) => {
    setEff({ ...eff, [key]: value });
    setRecalc(true);
    setTimeout(() => setRecalc(false), 500);
  };

  const generateAIEstimate = () => {
    setCapex(Math.round(280000 + Math.random() * 80000));
    setOpex(Math.round(12000 + Math.random() * 8000));
    setEff({
      volume: Math.round(380 + Math.random() * 80),
      costHour: Math.round(80 + Math.random() * 15),
      hoursAsIs: +(2.8 + Math.random() * 0.8).toFixed(1),
      hoursToBe: +(1.0 + Math.random() * 0.6).toFixed(1),
      reworkAsIs: Math.round(15 + Math.random() * 8),
      reworkToBe: Math.round(3 + Math.random() * 4),
    });
    toast.success("Estimativa gerada por IA com base no contexto do processo");
  };

  // ===== Derived calculations =====
  const factor = scenario === "optimistic" ? 1.12 : 1;
  // Effective hours (incluindo retrabalho)
  const effHoursAsIs = eff.hoursAsIs * (1 + eff.reworkAsIs / 100);
  const effHoursToBe = eff.hoursToBe * (1 + eff.reworkToBe / 100);
  // Custo mensal AS-IS / TO-BE em R$
  const costAsIsMonthly = eff.volume * effHoursAsIs * eff.costHour;
  const costToBeMonthly = eff.volume * effHoursToBe * eff.costHour;
  const efficiencySavingMonthly = Math.max(0, (costAsIsMonthly - costToBeMonthly)) * factor;
  const savingMonthly = efficiencySavingMonthly + (extraSavingAnnual / 12);
  const savingAnnual = Math.round(savingMonthly * 12);
  const unitCostAsIs = effHoursAsIs * eff.costHour;
  const unitCostToBe = effHoursToBe * eff.costHour;
  const unitReductionPct = unitCostAsIs > 0 ? Math.round((1 - unitCostToBe / unitCostAsIs) * 100) : 0;

  // Cash flows (monthly) over horizon
  const months = Math.max(12, horizon * 12);
  const monthlyCF = (m: number) => {
    const ramp = Math.min(1, m / Math.max(rampUp, 1));
    return savingMonthly * ramp - opex;
  };
  let cum = -capex;
  const cashSeries: { month: number; value: number }[] = [{ month: 0, value: cum }];
  let paybackMonth: number | null = null;
  for (let m = 1; m <= months; m++) {
    cum += monthlyCF(m);
    cashSeries.push({ month: m, value: cum });
    if (paybackMonth === null && cum >= 0) paybackMonth = m;
  }
  // NPV
  const monthlyRate = Math.pow(1 + wacc / 100, 1 / 12) - 1;
  let npv = -capex;
  for (let m = 1; m <= months; m++) npv += monthlyCF(m) / Math.pow(1 + monthlyRate, m);
  const totalInvest = capex + opex * months;
  const totalSaving = cashSeries[cashSeries.length - 1].value + totalInvest;
  const roi = totalInvest > 0 ? (totalSaving / totalInvest).toFixed(2) : "0";
  const payback = paybackMonth ?? months;

  const baseGain = Math.round(savingAnnual / 1000);
  const baseCost = Math.round(capex / 1000);

  const fmtBRL = (v: number) => v.toLocaleString("pt-BR");

  // ===== PREMISES SCREEN =====
  if (phase === "premises") {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <SectionTitle title="Premissas para o Business Case" subtitle="Informe as premissas financeiras e contextuais que alimentarão o cálculo." />

        {/* Financial Premises */}
        <div style={cardStyle}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
            <h4 style={subTitleStyle}>Premissas Financeiras</h4>
            <button onClick={generateAIEstimate} style={{
              display: "inline-flex", alignItems: "center", gap: 6,
              padding: "8px 14px", borderRadius: 8, fontSize: 12, fontWeight: 600,
              background: C.primaryBg, color: C.primary, border: `1px solid ${C.primaryBorder}`, cursor: "pointer",
            }}>
              <Sparkles size={13} /> Gerar estimativa por IA
            </button>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 }}>
            <PremiseField label="Investimento (CAPEX)" prefix="R$" value={capex} onChange={setCapex} />
            <PremiseField label="Custo Mensal (OPEX)" prefix="R$" value={opex} onChange={setOpex} />
            <PremiseField label="WACC / Taxa de Desconto (%)" value={wacc} onChange={setWacc} />
            <PremiseField label="Horizonte (anos)" value={horizon} onChange={setHorizon} />
            <PremiseField label="Ramp-up (meses)" value={rampUp} onChange={setRampUp} />
            <PremiseField
              label="Saving Anual (outros)"
              prefix="R$"
              value={extraSavingAnnual}
              onChange={setExtraSavingAnnual}
              tooltip="Saving anual proveniente de fontes além da eficiência operacional (ex.: aumento de receita, redução de multas, novos contratos). Se você já preencheu as premissas de eficiência abaixo, pode deixar este campo em branco — ou usá-lo para somar ganhos adicionais ao saving calculado."
            />
          </div>
        </div>

        {/* Efficiency premises (structured) */}
        <div style={cardStyle}>
          <h4 style={subTitleStyle}>Premissas de cálculo para saving por eficiência <span style={{ fontSize: 11, color: C.muted, fontWeight: 500 }}>(opcional)</span></h4>
          <p style={{ fontSize: 12, color: C.muted, margin: "6px 0 14px" }}>
            Ajuste as variáveis operacionais que serão usadas para estimar o saving anual. O ganho é calculado pela diferença de custo entre o cenário AS-IS e TO-BE.
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 }}>
            <PremiseField label="Volume mensal (transações)" value={eff.volume} onChange={(v) => setEff({ ...eff, volume: v })} />
            <PremiseField label="Custo médio por hora" prefix="R$" value={eff.costHour} onChange={(v) => setEff({ ...eff, costHour: v })} />
            <PremiseField label="Horas por transação (AS-IS)" value={eff.hoursAsIs} onChange={(v) => setEff({ ...eff, hoursAsIs: v })} />
            <PremiseField label="Horas por transação (TO-BE)" value={eff.hoursToBe} onChange={(v) => setEff({ ...eff, hoursToBe: v })} />
            <PremiseField label="% retrabalho atual (AS-IS)" value={eff.reworkAsIs} onChange={(v) => setEff({ ...eff, reworkAsIs: v })} />
            <PremiseField label="% retrabalho meta (TO-BE)" value={eff.reworkToBe} onChange={(v) => setEff({ ...eff, reworkToBe: v })} />
          </div>
          <div style={{ marginTop: 14, padding: 12, background: C.primaryBg, borderRadius: 8, fontSize: 12, color: C.text, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8 }}>
            <span><b>Saving anual estimado:</b> R$ {fmtBRL(savingAnnual)}</span>
            <span style={{ color: C.muted }}>Custo unitário: R$ {fmtBRL(Math.round(unitCostAsIs))} → R$ {fmtBRL(Math.round(unitCostToBe))} ({unitReductionPct}%)</span>
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <button onClick={() => setPhase("result")} style={{
            display: "inline-flex", alignItems: "center", gap: 6,
            padding: "12px 20px", borderRadius: 8, fontSize: 13, fontWeight: 700,
            background: C.primary, color: "#fff", border: "none", cursor: "pointer",
          }}>
            <BarChart3 size={14} /> Calcular Business Case
          </button>
        </div>
      </div>
    );
  }

  // ===== RESULT SCREEN =====
  const totalBenefit = totalSaving; // ganhos brutos acumulados ao longo do horizonte
  const netBenefit = totalBenefit - totalInvest;
  const bcr = totalInvest > 0 ? totalBenefit / totalInvest : 0;
  const roiPct = totalInvest > 0 ? Math.round(((totalBenefit - totalInvest) / totalInvest) * 100) : 0;
  const kpis = [
    { icon: TrendingUp, label: "ROI", value: `${roiPct}%`, color: "#0C1BA8" },
    { icon: Clock, label: "Payback", value: `${(payback / 12).toFixed(1)}`, sub: "meses", color: "#0C1BA8" },
    { icon: DollarSign, label: "NPV", value: `R$ ${fmtBRL(Math.round(npv))}`, color: "#0C1BA8" },
    { icon: Activity, label: "Benefit-to-Cost", value: `${bcr.toFixed(2)}x`, color: "#0C1BA8" },
  ];

  const composition = [
    { label: "Redução de retrabalho", pct: 40 },
    { label: "Automação de validações", pct: 30 },
    { label: "Eliminação de tarefas manuais", pct: 20 },
    { label: "Melhoria de SLA", pct: 10 },
  ];

  // Build cash flow chart data — cumulative cash flow in R$k over horizon
  const paybackPoints = cashSeries.map((p) => ({ month: p.month, value: Math.round(p.value / 1000) }));
  const minVal = Math.min(...paybackPoints.map((p) => p.value));
  const maxVal = Math.max(...paybackPoints.map((p) => p.value));
  const range = Math.max(maxVal - minVal, 1);
  const chartW = 720;
  const chartH = 240;
  const padL = 56;
  const padR = 20;
  const padT = 16;
  const padB = 32;
  const innerW = chartW - padL - padR;
  const innerH = chartH - padT - padB;
  const lastMonth = paybackPoints[paybackPoints.length - 1].month;
  const xAt = (m: number) => padL + (m / Math.max(lastMonth, 1)) * innerW;
  const yAt = (v: number) => padT + innerH - ((v - minVal) / range) * innerH;
  const yZero = yAt(0);
  const tickStep = lastMonth <= 24 ? 3 : 6;

  const handleSave = () => {
    if (processId && currentProc) {
      // Persist financial premises by tagging the process — keeps useCases as set in analysis step
      const ucs = currentProc.useCases ?? [];
      updateProcess(processId, { useCases: ucs });
      toast.success("Transformação salva — casos de uso vinculados ao processo");
    } else {
      toast.success("Transformação salva");
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <SectionTitle title="Business case" subtitle="Estimativas baseadas nas premissas informadas e na linha de base atual." />
        <button onClick={() => setPhase("premises")} style={{
          display: "inline-flex", alignItems: "center", gap: 6,
          padding: "8px 14px", borderRadius: 8, fontSize: 12, fontWeight: 600,
          background: "#fff", color: C.text, border: `1px solid ${C.border}`, cursor: "pointer",
        }}>
          <ArrowLeft size={12} /> Editar premissas
        </button>
      </div>

      {/* Premises summary */}
      <div style={{ ...cardStyle, padding: 16 }}>
        <div style={{ fontSize: 11, color: C.muted, textTransform: "uppercase", letterSpacing: 0.6, fontWeight: 600, marginBottom: 10 }}>
          Premissas utilizadas
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: 12 }}>
          {[
            { l: "CAPEX", v: `R$ ${fmtBRL(capex)}` },
            { l: "OPEX/mês", v: `R$ ${fmtBRL(opex)}` },
            { l: "WACC", v: `${wacc}%` },
            { l: "Horizonte", v: `${horizon} anos` },
            { l: "Ramp-up", v: `${rampUp} meses` },
            { l: "Saving anual", v: `R$ ${fmtBRL(savingAnnual)}` },
          ].map((p) => (
            <div key={p.l}>
              <div style={{ fontSize: 10, color: C.muted, fontWeight: 600 }}>{p.l}</div>
              <div style={{ fontSize: 13, color: C.text, fontWeight: 700, marginTop: 2 }}>{p.v}</div>
            </div>
          ))}
        </div>
        <div style={{ marginTop: 12, paddingTop: 12, borderTop: `1px dashed ${C.border}`, display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: 12 }}>
          {[
            { l: "Volume/mês", v: `${fmtBRL(eff.volume)} tx` },
            { l: "Custo/hora", v: `R$ ${fmtBRL(eff.costHour)}` },
            { l: "Horas AS-IS", v: `${eff.hoursAsIs}h` },
            { l: "Horas TO-BE", v: `${eff.hoursToBe}h` },
            { l: "Retrab. AS-IS", v: `${eff.reworkAsIs}%` },
            { l: "Retrab. TO-BE", v: `${eff.reworkToBe}%` },
          ].map((p) => (
            <div key={p.l}>
              <div style={{ fontSize: 10, color: C.muted, fontWeight: 600 }}>{p.l}</div>
              <div style={{ fontSize: 13, color: C.text, fontWeight: 700, marginTop: 2 }}>{p.v}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Scenario toggle */}
      <div style={{ display: "flex", justifyContent: "flex-end", gap: 6 }}>
        {(["base", "optimistic"] as const).map((s) => (
          <button
            key={s}
            onClick={() => { setScenario(s); setRecalc(true); setTimeout(() => setRecalc(false), 500); }}
            style={{
              padding: "6px 14px", borderRadius: 999, fontSize: 12, fontWeight: 600,
              background: scenario === s ? "#0C1BA8" : "#fff",
              color: scenario === s ? "#fff" : C.text,
              border: `1px solid ${scenario === s ? "#0C1BA8" : C.border}`,
              cursor: "pointer", transition: "all 0.15s",
            }}
          >{s === "base" ? "Cenário Base" : "Cenário Otimista"}</button>
        ))}
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

        {/* KPIs */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 12 }}>
          {kpis.map((k) => (
            <div key={k.label} style={{
              background: "#fff", border: "1px solid #E8E8EA", borderTop: `3px solid ${k.color}`,
              borderRadius: 14, padding: 18,
              opacity: recalc ? 0.5 : 1, transition: "opacity 0.3s",
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                <k.icon size={14} color={k.color} />
                <span style={{
                  fontSize: 10, color: "#6B7280", textTransform: "uppercase",
                  letterSpacing: 0.5, fontWeight: 600,
                }}>{k.label}</span>
              </div>
              <div style={{ fontSize: 28, fontWeight: 700, color: "#0F766E", lineHeight: 1.1 }}>{k.value}</div>
              {k.sub && <div style={{ fontSize: 12, color: C.muted, fontWeight: 500, marginTop: 4 }}>{k.sub}</div>}
            </div>
          ))}
        </div>

        {/* Executive Summary */}
        <div style={{ ...cardStyle, background: "linear-gradient(135deg, #ECFDF5 0%, #F0FDFA 100%)", border: "1px solid #BBF7D0" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
            <TrendingUp size={16} color="#0F766E" />
            <h4 style={{ ...subTitleStyle, color: "#0F766E", margin: 0 }}>Resumo Executivo</h4>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px 32px" }}>
            {[
              { l: "Investimento Total", v: `R$ ${fmtBRL(Math.round(totalInvest))}` },
              { l: `Net Benefit (${horizon} anos)`, v: `R$ ${fmtBRL(Math.round(netBenefit))}` },
              { l: "Savings Anual", v: `R$ ${fmtBRL(savingAnnual)}` },
              { l: "Taxa de Desconto", v: `${wacc}%` },
            ].map((r) => (
              <div key={r.l} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingBottom: 8, borderBottom: "1px solid #BBF7D0" }}>
                <span style={{ fontSize: 13, color: "#0F766E", fontWeight: 500 }}>{r.l}</span>
                <span style={{ fontSize: 14, color: C.text, fontWeight: 700 }}>{r.v}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Composition */}
        <div style={cardStyle}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
            <h4 style={subTitleStyle}>Composição do ganho</h4>
            <span style={{ fontSize: 14, fontWeight: 600, color: "#0C1BA8" }}>Total: R$ {fmtBRL(baseGain)}k/ano</span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {composition.map((c) => {
              const abs = Math.round(baseGain * c.pct / 100);
              return (
                <div key={c.label}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 6 }}>
                    <span style={{ color: C.text, fontWeight: 500 }}>{c.label}</span>
                    <span style={{ color: "#0C1BA8", fontWeight: 600, fontSize: 12 }}>R$ {fmtBRL(abs)}k</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{ flex: 1, height: 8, background: "#EEF0FF", borderRadius: 4, overflow: "hidden" }}>
                      <div style={{
                        width: `${c.pct}%`, height: "100%", background: "#0C1BA8",
                        borderRadius: 4, transition: "width 0.6s ease-out",
                      }} />
                    </div>
                    <span style={{ fontSize: 11, color: "#A5A7B0", minWidth: 32, textAlign: "right" }}>{c.pct}%</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Cumulative cash flow / payback chart */}
        <div style={cardStyle}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 6 }}>
            <h4 style={subTitleStyle}>Fluxo de caixa acumulado & Payback</h4>
            <span style={{ fontSize: 12, color: "#0F766E", fontWeight: 600 }}>
              {paybackMonth ? `Payback no mês ${payback}` : "Payback fora do horizonte"}
            </span>
          </div>
          <p style={{ fontSize: 12, color: C.muted, margin: "0 0 12px" }}>
            Investimento inicial (CAPEX) recuperado pelos ganhos mensais ao longo de {horizon} {horizon === 1 ? "ano" : "anos"} — valores em R$ mil.
          </p>
          <svg viewBox={`0 0 ${chartW} ${chartH}`} style={{ width: "100%", height: "auto" }}>
            <defs>
              <linearGradient id="pbPos" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor="#0C1BA8" stopOpacity="0.35" />
                <stop offset="100%" stopColor="#0C1BA8" stopOpacity="0" />
              </linearGradient>
              <linearGradient id="pbNeg" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor="#EF4444" stopOpacity="0" />
                <stop offset="100%" stopColor="#EF4444" stopOpacity="0.25" />
              </linearGradient>
            </defs>
            {[0, 0.25, 0.5, 0.75, 1].map((t) => {
              const y = padT + innerH * t;
              const v = Math.round(maxVal - range * t);
              return (
                <g key={t}>
                  <line x1={padL} x2={chartW - padR} y1={y} y2={y} stroke="#F1F1F4" strokeWidth={1} />
                  <text x={padL - 8} y={y + 3} fontSize="10" fill="#9CA3AF" textAnchor="end">{v}k</text>
                </g>
              );
            })}
            <line x1={padL} x2={chartW - padR} y1={yZero} y2={yZero} stroke="#9CA3AF" strokeWidth={1} strokeDasharray="3 3" />
            <path
              d={`M ${xAt(0)} ${yZero} ${paybackPoints.map((p) => `L ${xAt(p.month)} ${yAt(Math.max(p.value, 0))}`).join(" ")} L ${xAt(lastMonth)} ${yZero} Z`}
              fill="url(#pbPos)"
            />
            <path
              d={`M ${xAt(0)} ${yZero} ${paybackPoints.map((p) => `L ${xAt(p.month)} ${yAt(Math.min(p.value, 0))}`).join(" ")} L ${xAt(lastMonth)} ${yZero} Z`}
              fill="url(#pbNeg)"
            />
            <polyline
              fill="none"
              stroke="#0C1BA8"
              strokeWidth={2.5}
              points={paybackPoints.map((p) => `${xAt(p.month)},${yAt(p.value)}`).join(" ")}
            />
            {paybackMonth && (
              <g>
                <line x1={xAt(payback)} x2={xAt(payback)} y1={padT} y2={padT + innerH} stroke="#0F766E" strokeWidth={1.5} strokeDasharray="4 3" />
                <circle cx={xAt(payback)} cy={yAt(0)} r={5} fill="#0F766E" stroke="#fff" strokeWidth={2} />
                <text x={xAt(payback) + 8} y={padT + 14} fontSize="11" fontWeight={700} fill="#0F766E">Payback (M{payback})</text>
              </g>
            )}
            {paybackPoints.filter((p) => p.month % tickStep === 0).map((p) => (
              <text key={p.month} x={xAt(p.month)} y={chartH - 8} fontSize="10" fill="#9CA3AF" textAnchor="middle">M{p.month}</text>
            ))}
          </svg>
        </div>
      </div>

      {/* COMPLETION CARD */}
      <div style={{
        background: "linear-gradient(135deg, #04223D 0%, #0C1BA8 100%)",
        borderRadius: 16, padding: "28px 32px",
        display: "flex", alignItems: "center", gap: 24, flexWrap: "wrap",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16, flex: 1, minWidth: 280 }}>
          <CheckCircle2 size={32} color="#fff" />
          <div>
            <div style={{ fontSize: 20, fontWeight: 700, color: "#fff" }}>Transformação estruturada</div>
            <div style={{ fontSize: 14, color: "rgba(255,255,255,0.7)", marginTop: 4 }}>
              Análise completa, business case validado e plano de ação definido.
            </div>
          </div>
        </div>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <button onClick={handleSave} style={{
            display: "inline-flex", alignItems: "center", gap: 6,
            padding: "10px 16px", borderRadius: 8, fontSize: 13, fontWeight: 600,
            background: "transparent", color: "#fff",
            border: "1px solid rgba(255,255,255,0.3)", cursor: "pointer",
          }}>
            <Save size={14} /> Salvar
          </button>
          <button onClick={() => toast.success("Relatório exportado")} style={{
            display: "inline-flex", alignItems: "center", gap: 6,
            padding: "10px 16px", borderRadius: 8, fontSize: 13, fontWeight: 600,
            background: "transparent", color: "#fff",
            border: "1px solid rgba(255,255,255,0.3)", cursor: "pointer",
          }}>
            <Download size={14} /> Exportar relatório
          </button>
          <button onClick={() => toast.success("Enviado para stakeholders")} style={{
            display: "inline-flex", alignItems: "center", gap: 6,
            padding: "10px 16px", borderRadius: 8, fontSize: 13, fontWeight: 700,
            background: "#fff", color: "#0C1BA8",
            border: "none", cursor: "pointer",
          }}>
            Enviar para stakeholders <ArrowRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}

function PremiseField({ label, value, onChange, prefix, tooltip }: { label: string; value: number; onChange: (v: number) => void; prefix?: string; tooltip?: string }) {
  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6 }}>
        <label style={{ fontSize: 12, fontWeight: 600, color: "#374151" }}>{label}</label>
        {tooltip && (
          <span title={tooltip} style={{ display: "inline-flex", cursor: "help" }}>
            <Info size={12} color="#A5A7B0" />
          </span>
        )}
      </div>
      <div style={{
        display: "flex", alignItems: "center", border: `1px solid ${C.border}`,
        borderRadius: 8, background: "#F8F9FB", padding: "0 12px",
      }}>
        {prefix && <span style={{ fontSize: 13, color: "#6B7280", marginRight: 6 }}>{prefix}</span>}
        <input
          type="number"
          value={value}
          onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
          style={{
            flex: 1, border: "none", outline: "none", padding: "10px 0",
            fontSize: 13, color: C.text, background: "transparent",
          }}
        />
      </div>
    </div>
  );
}

function AssumptionField({ label, tooltip, value, suffix, prefix, decimal, onChange }: any) {
  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6 }}>
        <label style={{ fontSize: 12, fontWeight: 600, color: "#374151" }}>{label}</label>
        <span title={tooltip} style={{ display: "inline-flex", cursor: "help" }}>
          <Info size={12} color="#A5A7B0" />
        </span>
      </div>
      <div style={{
        display: "flex", alignItems: "center",
        border: "1px solid #E0E1E8", borderRadius: 8, background: "#fff",
        padding: "0 10px",
      }}>
        {prefix && <span style={{ fontSize: 12, color: "#6B7280", marginRight: 4 }}>{prefix}</span>}
        <input
          type="number"
          step={decimal ? "0.1" : "1"}
          value={value}
          onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
          style={{
            flex: 1, border: "none", outline: "none", padding: "8px 0",
            fontSize: 13, color: C.text, background: "transparent", width: 60,
          }}
        />
        <span style={{ fontSize: 11, color: "#A5A7B0", whiteSpace: "nowrap" }}>{suffix}</span>
      </div>
    </div>
  );
}

// ============= STEP 5 — TO-BE (redesigned) =============
function ToBeStep({ demo }: { demo?: boolean } = {}) {
  const compRowsDefault = [
    {
      label: "Solicitação",
      asis: { text: "Via e-mail ou planilha", chip: { label: "Manual / não rastreável", bg: "#FEF3C7", color: "#92400E", border: "#FDE68A" } },
      tobe: { text: "Portal digital com formulário estruturado", chip: { label: "Automatizado", bg: "#F0FDF4", color: "#0F766E", border: "#BBF7D0" } },
    },
    {
      label: "Validação",
      asis: { text: "Manual por analista, sem critérios padronizados", chip: { label: "Retrabalho 18%", bg: "#FEF2F2", color: "#B91C1C", border: "#FECACA" } },
      tobe: { text: "Validação automática por regras no ERP", chip: { label: "Zero retrabalho", bg: "#F0FDF4", color: "#0F766E", border: "#BBF7D0" } },
    },
    {
      label: "Aprovação",
      asis: { text: "Aprovador único, sem alçadas", chip: { label: "65% do lead time", bg: "#FEF2F2", color: "#B91C1C", border: "#FECACA" } },
      tobe: { text: "Aprovação por alçada configurada no BPMS", chip: { label: "SLA garantido", bg: "#F0FDF4", color: "#0F766E", border: "#BBF7D0" } },
    },
    {
      label: "Registro",
      asis: { text: "E-mail + planilha manual", chip: { label: "Sem auditoria", bg: "#FEF2F2", color: "#B91C1C", border: "#FECACA" } },
      tobe: { text: "Registro automático + dashboard em tempo real", chip: { label: "Rastreável", bg: "#F0FDF4", color: "#0F766E", border: "#BBF7D0" } },
    },
  ];

  const compRowsSL = [
    {
      label: "Extração",
      asis: { text: "Manual via Workday + cópia para Excel", chip: { label: "Manual / propenso a erro", bg: "#FEF3C7", color: "#92400E", border: "#FDE68A" } },
      tobe: { text: "API automática → Databricks Bronze", chip: { label: "Automatizado", bg: "#F0FDF4", color: "#0F766E", border: "#BBF7D0" } },
    },
    {
      label: "Preparação",
      asis: { text: "Atualização manual de tabelas de parâmetros e mapeamentos em Excel", chip: { label: "Retrabalho frequente", bg: "#FEF3C7", color: "#92400E", border: "#FDE68A" } },
      tobe: { text: "Repositório Delta centralizado no Databricks (Silver)", chip: { label: "Zero retrabalho", bg: "#F0FDF4", color: "#0F766E", border: "#BBF7D0" } },
    },
    {
      label: "Cálculo",
      asis: { text: "Macros + fórmulas manuais no Excel", chip: { label: "Alto esforço operacional", bg: "#FEF2F2", color: "#B91C1C", border: "#FECACA" } },
      tobe: { text: "Motor parametrizado Databricks Gold (PySpark)", chip: { label: "Automático", bg: "#F0FDF4", color: "#0F766E", border: "#BBF7D0" } },
    },
    {
      label: "Análise & Publicação",
      asis: { text: "Tabelas dinâmicas manuais + montagem de apresentação + envio por e-mail", chip: { label: "Alto esforço / sem auditoria", bg: "#FEF3C7", color: "#92400E", border: "#FDE68A" } },
      tobe: { text: "Consolidação e disponibilização automática de análises e indicadores + aprovação digital", chip: { label: "Rastreável", bg: "#F0FDF4", color: "#0F766E", border: "#BBF7D0" } },
    },
    {
      label: "Análise preditiva",
      asis: { text: "Não realizada — análise estática e retrospectiva", chip: { label: "Sem capacidade preditiva", bg: "#FEF2F2", color: "#B91C1C", border: "#FECACA" } },
      tobe: { text: "IA para detecção de anomalias, simulação de cenários e recomendação de delayering", chip: { label: "Orientado a decisão", bg: "#F0FDF4", color: "#0F766E", border: "#BBF7D0" } },
    },
  ];

  const compRows = demo ? compRowsSL : compRowsDefault;

  const tobeFlowDefault = [
    { name: "Solicitação digital", role: "Solicitante", systems: ["Portal"], time: "2 min", state: "NEW" as const },
    { name: "Validação automática", role: "ERP", systems: ["ERP"], time: "1 min", state: "NEW" as const },
    { name: "Aprovação por alçada", role: "Coordenador", systems: ["BPMS"], time: "30 min", state: "MODIFIED" as const },
    { name: "Execução", role: "Operador", systems: ["ERP"], time: "30 min", state: "UNCHANGED" as const },
    { name: "Registro & dashboard", role: "Sistema", systems: ["ERP", "BI"], time: "Auto", state: "MODIFIED" as const },
  ];

  const tobeFlowSL = [
    { name: "Extração automática Workday", role: "Sistema", systems: ["Workday API"], time: "5 min", state: "NEW" as const },
    { name: "Ingestão Databricks Bronze", role: "Sistema", systems: ["Databricks (Bronze/Silver/Gold)"], time: "2 min", state: "NEW" as const },
    { name: "Parâmetros e mapeamentos (Silver)", role: "Sistema", systems: ["Databricks (Bronze/Silver/Gold)"], time: "2 min", state: "MODIFIED" as const },
    { name: "Cálculo Span & Layer (Gold)", role: "Sistema", systems: ["Databricks (Bronze/Silver/Gold)"], time: "3 min", state: "NEW" as const },
    { name: "Análise preditiva IA", role: "Sistema", systems: ["Databricks ML"], time: "5 min", state: "NEW" as const },
    { name: "Consolidação e disponibilização de análises", role: "Sistema", systems: ["Tableau"], time: "Auto", state: "NEW" as const },
    { name: "Revisão & aprovação", role: "Head RH", systems: ["BPMS"], time: "30 min", state: "MODIFIED" as const },
  ];

  const tobeFlow = demo ? tobeFlowSL : tobeFlowDefault;

  const actionsDefault = [
    { desc: "Implementar workflow digital no BPMS", impact: "Alto", effort: "Médio", lever: "Eficiência Operacional", owner: "TI + BPM", duration: "6 semanas",
      how: "Modelar o fluxo no BPMS, configurar formulário digital, integrar com diretório corporativo para autenticação. Validar com piloto em uma área antes do rollout." },
    { desc: "Configurar regras de alçada e SLA por etapa", impact: "Alto", effort: "Baixo", lever: "Velocidade de Decisão", owner: "PMO", duration: "2 semanas",
      how: "Definir matriz de alçadas com áreas de negócio, configurar SLAs e escalation no BPMS, comunicar e treinar aprovadores." },
    { desc: "Integrar validação fiscal automática", impact: "Médio", effort: "Médio", lever: "Qualidade & Compliance", owner: "TI Fiscal", duration: "4 semanas",
      how: "Mapear regras fiscais aplicáveis, desenvolver serviço de validação consumível por API, conectar ao fluxo no BPMS." },
    { desc: "Criar dashboard operacional em tempo real", impact: "Médio", effort: "Baixo", lever: "Velocidade de Decisão", owner: "BI + Operações", duration: "3 semanas",
      how: "Definir KPIs com a operação, modelar dados no BI, publicar dashboard com filtros por área e período." },
  ];

  const actionsSL = [
    { desc: "Adaptar infra Databricks para ingestão via API do Workday", impact: "Alto", effort: "Médio", lever: "Eficiência Operacional", owner: "TI Workday + Data Engineering", duration: "3 semanas",
      how: "Configurar Auto Loader no Databricks, autenticar contra a Workday Reports-as-a-Service e estabelecer rotina de ingestão na camada Bronze, com monitoramento de falhas e SLA por ciclo." },
    { desc: "Construir motor de cálculo Span & Layer no Databricks", impact: "Alto", effort: "Médio", lever: "Eficiência Operacional", owner: "People Analytics + Data Eng.", duration: "5 semanas",
      how: "Migrar regras de mapeamento e fórmulas atuais do Excel para notebooks PySpark/dbt (Silver → Gold), com testes, versionamento e documentação." },
    { desc: "Criar painel de consolidação e disponibilização de análises (Power BI)", impact: "Alto", effort: "Baixo", lever: "Velocidade de Decisão", owner: "BI + People Analytics", duration: "3 semanas",
      how: "Modelar tabela Gold no Databricks SQL, publicar dataset no Power BI e desenhar dashboards de span por gestor, layers e desvios vs. benchmark." },
    { desc: "Centralizar códigos, parâmetros e mapeamentos como tabela Delta", impact: "Médio", effort: "Baixo", lever: "Qualidade & Compliance", owner: "PMO + Analista Workforce", duration: "2 semanas",
      how: "Migrar a aba manual de Excel para uma tabela Delta versionada, com definição de owners e processo de atualização controlada." },
    { desc: "Implantar modelos de IA preditiva (detecção, simulação, delayering)", impact: "Muito Alto", effort: "Médio", lever: "Análise Preditiva", owner: "Data Science + People Analytics", duration: "8 semanas",
      how: "Desenvolver modelos de detecção de anomalias e otimização para simulação de cenários de estrutura, integrando ao Databricks ML e expondo recomendações no dashboard." },
  ];

  const actions = demo ? actionsSL : actionsDefault;

  const phasesDefault = [
    { label: "Quick wins", time: "0–30 dias", color: "#0F766E", items: ["Configurar alçadas", "Criar dashboard"], gain: "R$ 40k/mês" },
    { label: "Médio prazo", time: "1–3 meses", color: "#F59E0B", items: ["Workflow digital", "Validação fiscal"], gain: "R$ 120k/mês" },
    { label: "Longo prazo", time: "3–6 meses", color: "#0C1BA8", items: ["Integração end-to-end", "Modelo preditivo"], gain: "R$ 200k/mês" },
  ];

  const phasesSL = [
    { label: "Quick wins", time: "0–30 dias", color: "#0F766E", items: ["Centralizar parâmetros no Databricks", "Adaptar conector Workday"], gain: "R$ 35k/mês" },
    { label: "Médio prazo", time: "1–3 meses", color: "#F59E0B", items: ["Motor de cálculo (Silver → Gold)", "Painel de análises e BI"], gain: "R$ 110k/mês" },
    { label: "Longo prazo", time: "3–6 meses", color: "#0C1BA8", items: ["Modelos de IA preditiva", "Workflow aprovação digital"], gain: "R$ 220k/mês" },
  ];

  const phases = demo ? phasesSL : phasesDefault;

  const modifiedCount = tobeFlow.filter((s) => s.state !== "UNCHANGED").length;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <SectionTitle title="TO-BE e plano de ação" subtitle="Comparativo, novo desenho e roadmap de implementação." />

      {/* SECTION A — AS-IS vs TO-BE */}
      <div style={{
        background: "#fff", border: "1px solid #E8E8EA",
        borderRadius: 16, overflow: "hidden",
      }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 60px 1fr", height: 48, alignItems: "center" }}>
          <div style={{
            fontSize: 11, fontWeight: 700, letterSpacing: 0.5, textTransform: "uppercase",
            color: "#6B7280", textAlign: "center",
            background: "#FAFAFA", borderRight: "1px solid #E8E8EA", height: "100%",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>Estado atual (AS-IS)</div>
          <div style={{
            background: "#EEF0FF", height: "100%",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <ArrowRight size={16} color="#0C1BA8" />
          </div>
          <div style={{
            fontSize: 11, fontWeight: 700, letterSpacing: 0.5, textTransform: "uppercase",
            color: "#0C1BA8", textAlign: "center",
            background: "#EEF0FF", height: "100%",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>Novo estado (TO-BE)</div>
        </div>
        {compRows.map((row, i) => (
          <div key={i} style={{
            display: "grid", gridTemplateColumns: "1fr 60px 1fr",
            borderTop: "1px solid #F0F1F5", minHeight: 64, alignItems: "stretch",
          }}>
            <div style={{ padding: "12px 16px", display: "flex", flexDirection: "column", gap: 6, justifyContent: "center" }}>
              <div style={{ fontSize: 10, color: "#A5A7B0", fontWeight: 600, textTransform: "uppercase" }}>{row.label}</div>
              <div style={{ fontSize: 13, color: C.text }}>{row.asis.text}</div>
              <span style={{
                alignSelf: "flex-start",
                fontSize: 10.5, fontWeight: 600, padding: "2px 8px", borderRadius: 999,
                background: row.asis.chip.bg, color: row.asis.chip.color,
                border: `1px solid ${row.asis.chip.border}`,
              }}>{row.asis.chip.label}</span>
            </div>
            <div style={{ background: "#F4F5F8", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <ArrowRight size={14} color="#A5A7B0" />
            </div>
            <div style={{
              padding: "12px 16px", background: "#F8FBF8",
              display: "flex", flexDirection: "column", gap: 6, justifyContent: "center",
            }}>
              <div style={{ fontSize: 10, color: "#A5A7B0", fontWeight: 600, textTransform: "uppercase" }}>{row.label}</div>
              <div style={{ fontSize: 13, color: C.text }}>{row.tobe.text}</div>
              <span style={{
                alignSelf: "flex-start",
                fontSize: 10.5, fontWeight: 600, padding: "2px 8px", borderRadius: 999,
                background: row.tobe.chip.bg, color: row.tobe.chip.color,
                border: `1px solid ${row.tobe.chip.border}`,
              }}>{row.tobe.chip.label}</span>
            </div>
          </div>
        ))}
        {/* Tempo total row */}
        <div style={{
          display: "grid", gridTemplateColumns: "1fr 60px 1fr",
          borderTop: "1px solid #F0F1F5", minHeight: 72, alignItems: "stretch",
          background: "#FAFBFC",
        }}>
          <div style={{ padding: "12px 16px", display: "flex", flexDirection: "column", gap: 4, justifyContent: "center" }}>
            <div style={{ fontSize: 10, color: "#A5A7B0", fontWeight: 600, textTransform: "uppercase" }}>Tempo total</div>
            <div style={{ fontSize: 20, fontWeight: 700, color: "#B91C1C" }}>{demo ? "~6 horas" : "2,3 dias"}</div>
          </div>
          <div style={{ background: "#F4F5F8", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <ArrowRight size={14} color="#A5A7B0" />
          </div>
          <div style={{
            padding: "12px 16px", background: "#F0FDF4",
            display: "flex", alignItems: "center", justifyContent: "space-between",
          }}>
            <div>
              <div style={{ fontSize: 10, color: "#A5A7B0", fontWeight: 600, textTransform: "uppercase" }}>Tempo total</div>
              <div style={{ fontSize: 20, fontWeight: 700, color: "#0F766E" }}>{demo ? "~45 minutos" : "0,8 dias"}</div>
            </div>
            <span style={{
              fontSize: 12, fontWeight: 700, padding: "4px 10px", borderRadius: 999,
              background: "#0F766E", color: "#fff",
            }}>{demo ? "-87%" : "-65%"}</span>
          </div>
        </div>
      </div>

      {/* SECTION B — TO-BE Scope Diagram */}
      <ToBeScopeDiagram tobeFlow={tobeFlow} modifiedCount={modifiedCount} demo={demo} />

      {/* SECTION C — Action plan */}
      <ActionPlanCard actions={actions} />

      {/* SECTION D — Roadmap */}
      <div style={cardStyle}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
          <h4 style={subTitleStyle}>Roadmap de implementação</h4>
          <span style={{ fontSize: 11, color: "#A5A7B0" }}>3 fases · ganho acumulado projetado</span>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
          {phases.map((p) => (
            <div key={p.label} style={{
              padding: 20, border: "1px solid #E8E8EA", borderTop: `3px solid ${p.color}`,
              borderRadius: 12, background: "#fff",
              display: "flex", flexDirection: "column", gap: 10,
            }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: C.text }}>{p.label}</div>
              <span style={{
                alignSelf: "flex-start",
                fontSize: 11, fontWeight: 600, padding: "3px 10px", borderRadius: 999,
                background: `${p.color}15`, color: p.color,
              }}>{p.time}</span>
              <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 4 }}>
                {p.items.map((it, idx) => (
                  <div key={it} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <div style={{
                      width: 18, height: 18, borderRadius: 4,
                      border: `1.5px solid ${p.color}`,
                      background: idx === 0 ? p.color : "transparent",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      flexShrink: 0,
                    }}>
                      {idx === 0 && <Check size={11} color="#fff" />}
                    </div>
                    <span style={{ fontSize: 13, color: "#374151" }}>{it}</span>
                  </div>
                ))}
              </div>
              <div style={{
                marginTop: "auto", paddingTop: 10, borderTop: "1px solid #F0F1F5",
                display: "flex", alignItems: "center", justifyContent: "space-between",
              }}>
                <span style={{ fontSize: 11, color: C.muted }}>Ganho esperado</span>
                <span style={{ fontSize: 13, fontWeight: 700, color: p.color }}>{p.gain}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Gantt chart */}
        <RoadmapGantt actions={actions} />
      </div>
    </div>
  );
}

function ActionPlanCard({ actions }: { actions: any[] }) {
  const [expanded, setExpanded] = useState<number | null>(null);
  const effortColor = (e: string) => e === "Baixo" ? "#0F766E" : e === "Médio" ? "#F59E0B" : "#B91C1C";
  return (
    <div style={cardStyle}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
        <h4 style={subTitleStyle}>Plano de ação</h4>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{
            fontSize: 11, fontWeight: 600, color: "#0C1BA8",
            background: "#EEF0FF", borderRadius: 999, padding: "3px 8px",
          }}>{actions.length} ações</span>
          <span style={{ fontSize: 11, color: "#A5A7B0" }}>Ordenadas por prioridade</span>
        </div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {actions.map((a, i) => {
          const isOpen = expanded === i;
          return (
            <div key={i} style={{
              borderRadius: 10, padding: 16, border: "1px solid #E8E8EA",
              borderLeft: `3px solid ${effortColor(a.effort)}`,
              background: "#fff", display: "flex", flexDirection: "column", gap: 10,
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{
                  width: 24, height: 24, borderRadius: "50%", background: "#0C1BA8", color: "#fff",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 11, fontWeight: 700, flexShrink: 0,
                }}>{i + 1}</div>
                <div style={{ flex: 1, fontSize: 13, fontWeight: 600, color: C.text }}>{a.desc}</div>
                <span style={{
                  fontSize: 10, fontWeight: 700, borderRadius: 999, padding: "3px 8px",
                  background: `${impactColor(a.impact)}15`, color: impactColor(a.impact),
                }}>Impacto {a.impact}</span>
                <span style={{
                  fontSize: 10, fontWeight: 700, borderRadius: 999, padding: "3px 8px",
                  background: `${effortColor(a.effort)}15`, color: effortColor(a.effort),
                }}>Esforço {a.effort}</span>
              </div>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap", paddingLeft: 36 }}>
                <span style={{
                  fontSize: 11, fontWeight: 500,
                  background: "#F4F5F8", color: "#374151", border: "1px solid #E8E8EA",
                  borderRadius: 999, padding: "2px 8px",
                }}>{a.lever}</span>
                <span style={{
                  fontSize: 11, color: "#6B7280",
                  background: "#fff", border: "1px solid #E8E8EA",
                  borderRadius: 999, padding: "2px 8px",
                }}>Responsável: {a.owner}</span>
                <span style={{
                  display: "inline-flex", alignItems: "center", gap: 4,
                  fontSize: 11, color: "#6B7280",
                  background: "#fff", border: "1px solid #E8E8EA",
                  borderRadius: 999, padding: "2px 8px",
                }}>
                  <Clock size={10} /> {a.duration}
                </span>
              </div>
              <button onClick={() => setExpanded(isOpen ? null : i)} style={{
                marginLeft: 36, display: "inline-flex", alignItems: "center", gap: 4,
                background: "transparent", border: "none", cursor: "pointer",
                fontSize: 12, fontWeight: 600, color: "#0C1BA8", padding: 0,
                alignSelf: "flex-start",
              }}>
                <ChevronDown size={13} style={{ transform: isOpen ? "rotate(180deg)" : "none", transition: "transform 0.2s" }} />
                Como implementar
              </button>
              {isOpen && (
                <div style={{
                  marginLeft: 36, padding: "10px 12px",
                  background: "#FAFBFC", borderRadius: 8, border: "1px solid #F0F1F5",
                  fontSize: 12, color: "#6B7280", fontStyle: "italic", lineHeight: 1.6,
                }}>{a.how}</div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ============= Reusable bits =============
function SectionTitle({ title, subtitle, icon: Icon, variant = "primary", right }: { title: string; subtitle?: string; icon?: any; variant?: "primary" | "danger" | "success"; right?: any }) {
  const palette = variant === "danger"
    ? { bg: "#FEF2F2", color: C.danger }
    : variant === "success"
    ? { bg: "#F0FDF4", color: "#0F766E" }
    : { bg: C.primaryBg, color: C.primary };
  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 12,
      paddingBottom: 16, marginBottom: 16, borderBottom: `1px solid ${C.borderSoft}`,
    }}>
      {Icon && (
        <div style={{
          width: 36, height: 36, borderRadius: 10, background: palette.bg,
          display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
        }}>
          <Icon size={16} color={palette.color} />
        </div>
      )}
      <div style={{ flex: 1, minWidth: 0 }}>
        <h3 style={{ fontSize: 15, fontWeight: 600, color: C.text, margin: 0 }}>{title}</h3>
        {subtitle && <p style={{ fontSize: 12, color: C.muted, margin: "2px 0 0" }}>{subtitle}</p>}
      </div>
      {right}
    </div>
  );
}

function ChoiceCard({ icon: Icon, title, subtitle, active, onClick }: any) {
  const [hover, setHover] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        position: "relative", textAlign: "left", padding: 24, borderRadius: 16,
        background: active ? "linear-gradient(180deg, #F8F9FF, #FFFFFF)" : C.white,
        border: `1.5px solid ${active ? C.primary : hover ? "#A5B4FC" : C.border}`,
        cursor: "pointer", transition: "all 0.2s",
        display: "flex", gap: 14, alignItems: "flex-start",
        transform: hover && !active ? "translateY(-3px)" : "translateY(0)",
        boxShadow: active
          ? "0 0 0 3px rgba(12,27,168,0.08)"
          : hover
          ? "0 8px 24px rgba(12,27,168,0.08)"
          : "0 2px 8px rgba(0,0,0,0.04)",
      }}
    >
      {active && (
        <div style={{
          position: "absolute", top: 12, right: 12, width: 16, height: 16, borderRadius: "50%",
          background: C.primary, display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <Check size={10} color="#fff" />
        </div>
      )}
      <div style={{
        width: 48, height: 48, borderRadius: 14,
        background: "linear-gradient(135deg, #EEF0FF, #F8F9FF)",
        display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
      }}>
        <Icon size={20} color={C.primary} />
      </div>
      <div>
        <div style={{ fontSize: 14, fontWeight: 600, color: C.text, marginBottom: 4 }}>{title}</div>
        <div style={{ fontSize: 12, color: C.muted, lineHeight: 1.45 }}>{subtitle}</div>
      </div>
    </button>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div style={{ fontSize: 11, color: C.mutedSoft, fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.6, marginBottom: 4 }}>{label}</div>
      <div style={{ fontSize: 13, color: C.text, lineHeight: 1.5 }}>{value}</div>
    </div>
  );
}

function Metric({ icon: Icon, label, value, trend, trendColor }: any) {
  return (
    <div style={{
      padding: 16, background: C.white, border: `1px solid ${C.border}`,
      borderRadius: 12,
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
        <div style={{
          width: 28, height: 28, borderRadius: 7, background: C.bg,
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <Icon size={13} color={C.muted} />
        </div>
        <div style={{ fontSize: 11, color: C.mutedSoft, fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.5 }}>
          {label}
        </div>
      </div>
      <div style={{ fontSize: 24, fontWeight: 700, color: C.text }}>{value}</div>
      {trend && (
        <div style={{
          marginTop: 8, display: "inline-flex", alignItems: "center", gap: 5,
          padding: "4px 10px", borderRadius: 999, fontSize: 11, fontWeight: 700,
          background: `${trendColor || C.muted}15`, color: trendColor || C.muted,
        }}>
          <span style={{ width: 6, height: 6, borderRadius: "50%", background: trendColor || C.muted }} />
          {trend}
        </div>
      )}
    </div>
  );
}

function KPI({ icon: Icon, label, value, sub }: any) {
  return (
    <div style={cardStyle}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, color: C.muted, fontSize: 12, marginBottom: 10 }}>
        <Icon size={14} color={C.primary} /> {label}
      </div>
      <div style={{ fontSize: 26, fontWeight: 700, color: C.text }}>{value}</div>
      <div style={{ fontSize: 11, color: C.mutedSoft, marginTop: 4 }}>{sub}</div>
    </div>
  );
}

function InsightBlock({ title, icon: Icon, color, items }: any) {
  // Pick card variant from accent color
  const palette = color === C.danger
    ? { bg: C.dangerBg, border: C.dangerBorder, accent: C.danger }
    : color === C.warning
    ? { bg: C.warningBg, border: C.warningBorder, accent: C.warning }
    : color === C.success
    ? { bg: C.successBg, border: C.successBorder, accent: C.success }
    : { bg: C.primaryBgSoft, border: C.primaryBorder, accent: C.primary };
  return (
    <div style={cardStyle}>
      <SectionTitle title={title} icon={Icon} variant={color === C.danger ? "danger" : color === C.success ? "success" : "primary"} />
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {items.map((it: any, i: number) => (
          <div key={i} style={{
            padding: "14px 16px", background: palette.bg,
            border: `1px solid ${palette.border}`, borderLeft: `3px solid ${palette.accent}`,
            borderRadius: 12,
          }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: C.text, marginBottom: 6 }}>{it.label}</div>
            <div style={{ fontSize: 12, color: C.muted, display: "flex", gap: 8, alignItems: "flex-start", lineHeight: 1.5 }}>
              <Info size={12} color={palette.accent} style={{ marginTop: 2, flexShrink: 0 }} />
              <span>{it.why}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function PillToggle({ children, active, onClick }: any) {
  return (
    <button onClick={onClick} style={{
      display: "inline-flex", alignItems: "center", gap: 6, padding: "9px 14px",
      borderRadius: 10, fontSize: 13, fontWeight: 500,
      background: active ? C.primary : C.white,
      color: active ? C.white : C.text,
      border: `1px solid ${active ? C.primary : C.border}`,
      cursor: "pointer", transition: "all 0.15s",
    }}>{children}</button>
  );
}

function Tag({ children, color }: { children: any; color?: string }) {
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", padding: "3px 9px",
      borderRadius: 4, fontSize: 11, fontWeight: 600,
      letterSpacing: 0.4, textTransform: "uppercase",
      background: color ? `${color}15` : C.bg,
      color: color || C.muted, whiteSpace: "nowrap",
    }}>{children}</span>
  );
}

// ===== Style helpers =====
const cardStyle: React.CSSProperties = {
  background: C.white,
  border: `1px solid #EAEBEF`,
  borderRadius: 16,
  padding: "24px 28px",
  boxShadow: "0 1px 4px rgba(12,27,168,0.04), 0 4px 16px rgba(0,0,0,0.03)",
};

const innerCardStyle: React.CSSProperties = {
  background: C.surface,
  border: `1px solid ${C.border}`,
  borderRadius: 12,
  padding: "16px 20px",
};

const subTitleStyle: React.CSSProperties = {
  fontSize: 15, fontWeight: 600, color: C.text, margin: 0,
};

const iconBox = (size: number, bg: string): React.CSSProperties => ({
  width: size, height: size, background: bg, borderRadius: 10,
  display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
});

const btnPrimary = (disabled: boolean): React.CSSProperties => ({
  display: "inline-flex", alignItems: "center", gap: 6,
  padding: "11px 24px", borderRadius: 10, fontSize: 13, fontWeight: 700,
  background: disabled ? C.border : "linear-gradient(135deg, #0C1BA8, #1E35D4)",
  color: disabled ? C.mutedSoft : C.white,
  border: "none", cursor: disabled ? "not-allowed" : "pointer",
  boxShadow: disabled ? "none" : "0 4px 14px rgba(12,27,168,0.35)",
  transition: "all 0.15s",
});

const btnGhost = (disabled: boolean): React.CSSProperties => ({
  display: "inline-flex", alignItems: "center", gap: 6,
  padding: "10px 20px", borderRadius: 10, fontSize: 13, fontWeight: 500,
  background: C.white, color: disabled ? C.mutedSoft : "#374151",
  border: `1px solid ${C.border}`, cursor: disabled ? "not-allowed" : "pointer",
  opacity: disabled ? 0.5 : 1, transition: "all 0.15s",
});

function impactColor(x: string) {
  if (x === "Alto") return C.success;
  if (x === "Médio") return C.warning;
  return C.muted;
}


// ============= TO-BE Scope Diagram =============
function ToBeScopeDiagram({ tobeFlow, modifiedCount, demo }: { tobeFlow: any[]; modifiedCount: number; demo?: boolean }) {
  const allSystems = Array.from(new Set(tobeFlow.flatMap((s) => s.systems)));
  // System is "new" if it doesn't appear in any UNCHANGED activity
  const newSystems = new Set(
    allSystems.filter((s) => !tobeFlow.some((f) => f.state === "UNCHANGED" && f.systems.includes(s)))
  );

  // Soft, clean palette
  const palette = {
    NEW:       { stroke: "#A7B5FF", fill: "#F4F6FF", text: "#1E2C8A", badgeBg: "#E0E6FF", badgeText: "#1E2C8A", label: "Novo" },
    MODIFIED:  { stroke: "#FCD9A8", fill: "#FFF8EC", text: "#8A4B0A", badgeBg: "#FFEFD2", badgeText: "#8A4B0A", label: "Alterado" },
    UNCHANGED: { stroke: "#E2E5EC", fill: "#FAFBFC", text: "#374151", badgeBg: "#EEF0F4", badgeText: "#6B7280", label: "Inalterado" },
  } as const;

  const Connector = () => (
    <div style={{ display: "flex", alignItems: "center", flexShrink: 0, alignSelf: "center", marginTop: -34 }}>
      <div style={{ width: 28, height: 1.5, background: "#D7DAE2" }} />
      <div style={{ width: 0, height: 0, borderTop: "5px solid transparent", borderBottom: "5px solid transparent", borderLeft: "6px solid #B6BAC4" }} />
    </div>
  );

  const Endpoint = ({ end }: { end?: boolean }) => (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flexShrink: 0, gap: 6, paddingTop: 6 }}>
      <div style={{
        width: 32, height: 32, borderRadius: "50%",
        background: end ? "#272727" : "#fff",
        border: end ? "2px solid #272727" : "1.5px solid #9CA3AF",
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        {end && <div style={{ width: 18, height: 18, borderRadius: "50%", border: "1.5px solid #fff" }} />}
      </div>
      <div style={{ fontSize: 9, color: "#9CA3AF", letterSpacing: 0.6, textTransform: "uppercase", fontWeight: 600 }}>{end ? "Fim" : "Início"}</div>
    </div>
  );

  const Band = ({ label, accent, children }: { label: string; accent?: string; children: React.ReactNode }) => {
    const color = accent || "#0C1BA8";
    return (
      <div style={{
        display: "grid", gridTemplateColumns: "120px 1fr",
        border: `1px solid #EAEBEF`, borderRadius: 10, overflow: "hidden", background: "#fff",
      }}>
        <div style={{
          background: color, color: "#fff", padding: "10px 12px",
          fontSize: 10, fontWeight: 700, letterSpacing: 0.8, textTransform: "uppercase",
          display: "flex", alignItems: "center",
        }}>{label}</div>
        <div style={{ padding: "12px 14px", display: "flex", alignItems: "center", fontSize: 13, color: "#272727", lineHeight: 1.5 }}>
          {children}
        </div>
      </div>
    );
  };

  const first = tobeFlow[0];
  const last = tobeFlow[tobeFlow.length - 1];

  return (
    <div style={{ background: "#fff", border: "1px solid #EAEBEF", borderRadius: 16, overflow: "hidden" }}>
      <div style={{
        display: "flex", alignItems: "center", gap: 10,
        padding: "16px 20px", borderBottom: "1px solid #F0F1F5",
      }}>
        <div style={{
          width: 32, height: 32, background: "#F4F6FF", borderRadius: 8,
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <Workflow size={16} color="#0C1BA8" />
        </div>
        <div style={{ fontSize: 14, fontWeight: 600, color: "#272727", flex: 1 }}>Diagrama de escopo TO-BE</div>
        <span style={{
          fontSize: 11, fontWeight: 600, color: "#6B7280",
          background: "#F4F5F8", borderRadius: 999, padding: "3px 10px",
        }}>{tobeFlow.length} etapas</span>
        <span style={{
          display: "inline-flex", alignItems: "center", gap: 4,
          fontSize: 11, fontWeight: 700, color: "#1E2C8A",
          background: "#E0E6FF", borderRadius: 999, padding: "3px 10px",
        }}>
          <Sparkles size={11} /> {modifiedCount} etapas modificadas
        </span>
      </div>

      <div style={{ padding: 20, display: "flex", flexDirection: "column", gap: 10 }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
          <Band label="Objetivo">{demo ? "Mapear e analisar a estrutura organizacional da Natura com base em Span of Control e Layer, gerando insights para decisões de design, dimensionamento e eficiência da gestão." : "Reduzir lead time e eliminar retrabalho com automação ponta-a-ponta."}</Band>
          <Band label="Proposta de valor">{demo ? "Transformar dados da estrutura hierárquica em diagnósticos acionáveis sobre eficiência organizacional, apoiando decisões de redesenho, redução de camadas e otimização da relação gestor-liderado com base em dados." : "Fluxo digital, rastreável, com SLA garantido e visibilidade em tempo real."}</Band>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
          <Band label="Evento de início">{demo ? "Atualização em tempo real a cada alteração registrada no Workday" : (first?.name || "—")}</Band>
          <Band label="Evento de fim">{demo ? "Indicadores atualizados + relatório aprovado + insights preditivos publicados" : (last?.name || "—")}</Band>
        </div>
        <Band label="Origem">{demo ? "Workday (estrutura organizacional, posições e gestores)" : "Solicitante interno via portal digital"}</Band>

        <Band label="Atividades" accent="#0F766E">
          <div style={{ width: "100%" }}>
            <div style={{ display: "flex", alignItems: "flex-start", gap: 0, overflowX: "auto", padding: "26px 6px 12px", minHeight: 140 }}>
              <Endpoint />
              <Connector />
              {tobeFlow.map((act, i) => {
                const p = palette[(act.state || "UNCHANGED") as keyof typeof palette];
                const isStateBadge = act.state === "NEW" || act.state === "MODIFIED";
                return (
                  <React.Fragment key={i}>
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flexShrink: 0, gap: 8, position: "relative", width: 132 }}>
                      <div style={{ position: "relative", width: "100%", display: "flex", justifyContent: "center" }}>
                        {/* State badge */}
                        {isStateBadge && (
                          <span style={{
                            position: "absolute", top: -16, left: "50%", transform: "translateX(-50%)", zIndex: 3,
                            fontSize: 9, fontWeight: 700, letterSpacing: 0.5,
                            background: p.badgeBg, color: p.badgeText,
                            padding: "2px 8px", borderRadius: 999,
                            border: `1px solid ${p.stroke}`,
                            textTransform: "uppercase", whiteSpace: "nowrap",
                          }}>{p.label}</span>
                        )}
                        {/* Activity card — uniform rounded rect for all */}
                        <div style={{
                          width: 124, minHeight: 56, borderRadius: 10,
                          background: p.fill, border: `1.5px solid ${p.stroke}`,
                          display: "flex", alignItems: "center", justifyContent: "center",
                          padding: "8px 10px", textAlign: "center",
                        }}>
                          <span style={{ fontSize: 11.5, fontWeight: 600, color: p.text, lineHeight: 1.25 }}>{act.name}</span>
                        </div>
                      </div>
                      {/* Role chip */}
                      <span style={{ fontSize: 9.5, fontWeight: 600, background: "#F4F5F8", color: "#6B7280", borderRadius: 999, padding: "2px 8px", whiteSpace: "nowrap" }}>
                        {act.role}
                      </span>
                      {/* Time */}
                      <span style={{ fontSize: 9.5, color: "#A5A7B0", fontWeight: 500 }}>{act.time}</span>
                      {/* Systems chips */}
                      <div style={{ display: "flex", gap: 3, flexWrap: "wrap", justifyContent: "center" }}>
                        {act.systems.map((s: string, si: number) => {
                          const isNew = newSystems.has(s);
                          return (
                            <span key={si} title={`${s}${isNew ? " (novo)" : ""}`} style={{
                              display: "inline-flex", alignItems: "center", gap: 3,
                              fontSize: 9, fontWeight: 700,
                              background: isNew ? "#E0E6FF" : "#F4F5F8",
                              color: isNew ? "#1E2C8A" : "#6B7280",
                              border: `1px solid ${isNew ? "#A7B5FF" : "#E2E5EC"}`,
                              borderRadius: 999, padding: "2px 7px",
                            }}>
                              {isNew && <span style={{ width: 5, height: 5, borderRadius: "50%", background: "#0C1BA8" }} />}
                              {s}
                            </span>
                          );
                        })}
                      </div>
                    </div>
                    <Connector />
                  </React.Fragment>
                );
              })}
              <Endpoint end />
            </div>
            {/* Legend */}
            <div style={{ display: "flex", gap: 16, marginTop: 12, flexWrap: "wrap", fontSize: 11, color: "#6B7280", paddingTop: 10, borderTop: "1px dashed #EAEBEF" }}>
              {(["NEW", "MODIFIED", "UNCHANGED"] as const).map((k) => (
                <span key={k} style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                  <span style={{ width: 14, height: 10, background: palette[k].fill, border: `1.5px solid ${palette[k].stroke}`, borderRadius: 3 }} />
                  {palette[k].label}
                </span>
              ))}
              <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                <span style={{ width: 5, height: 5, borderRadius: "50%", background: "#0C1BA8" }} /> Sistema novo
              </span>
            </div>
          </div>
        </Band>

        <Band label="Destino">{demo ? "Liderança de RH e Diretoria com indicadores e cenários disponíveis em dashboard" : "Operação, lideranças e stakeholders com dashboard em tempo real"}</Band>
        <Band label="Sistemas">
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
            {allSystems.map((s) => {
              const isNew = newSystems.has(s);
              return (
                <span key={s} style={{
                  display: "inline-flex", alignItems: "center", gap: 6,
                  background: isNew ? "#F4F6FF" : "#F4F5F8",
                  border: `1px solid ${isNew ? "#A7B5FF" : "#E8E8EA"}`,
                  borderRadius: 6, padding: "4px 10px",
                  fontSize: 12, color: "#272727", fontWeight: 500,
                }}>
                  {isNew && (
                    <span style={{
                      fontSize: 8.5, fontWeight: 800, color: "#1E2C8A", background: "#E0E6FF",
                      border: "1px solid #A7B5FF", borderRadius: 999, padding: "1px 6px",
                      letterSpacing: 0.4, textTransform: "uppercase",
                    }}>Novo</span>
                  )}
                  {s}
                </span>
              );
            })}
          </div>
        </Band>
      </div>
    </div>
  );
}


// ============= Roadmap Gantt =============
function RoadmapGantt({ actions }: { actions: any[] }) {
  // Parse durations like "6 semanas" / "2 semanas" / "3 semanas" → weeks
  const parseWeeks = (d: string) => {
    const m = /(\d+)\s*semana/i.exec(d || "");
    return m ? parseInt(m[1], 10) : 4;
  };
  // Simple dependency model: each action starts after the previous ends, except low-effort short ones run in parallel from week 0
  const items = actions.map((a, i) => ({
    name: a.desc,
    weeks: parseWeeks(a.duration),
    impact: a.impact,
    effort: a.effort,
    owner: a.owner,
    parallel: a.effort === "Baixo",
  }));

  let cursor = 0;
  const rows = items.map((it) => {
    const start = it.parallel ? 0 : cursor;
    const end = start + it.weeks;
    if (!it.parallel) cursor = end;
    return { ...it, start, end };
  });
  const totalWeeks = Math.max(...rows.map((r) => r.end), 12);
  const ticks = Array.from({ length: totalWeeks + 1 }, (_, i) => i);
  const phaseBoundaries = [
    { label: "Quick wins", start: 0, end: 4, color: "#0F766E" },
    { label: "Médio prazo", start: 4, end: 12, color: "#F59E0B" },
    { label: "Longo prazo", start: 12, end: totalWeeks, color: "#0C1BA8" },
  ];
  const effortColor = (e: string) => e === "Baixo" ? "#0F766E" : e === "Médio" ? "#F59E0B" : "#B91C1C";

  return (
    <div style={{ borderTop: "1px solid #F0F1F5", paddingTop: 18 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
        <div>
          <div style={{ fontSize: 13, fontWeight: 600, color: "#272727" }}>Cronograma (Gantt)</div>
          <div style={{ fontSize: 11, color: "#A5A7B0", marginTop: 2 }}>Sequência e dependências entre as ações · escala em semanas</div>
        </div>
        <div style={{ display: "flex", gap: 12, fontSize: 11, color: "#6B7280" }}>
          {phaseBoundaries.map((p) => (
            <span key={p.label} style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
              <span style={{ width: 10, height: 10, borderRadius: 2, background: p.color }} /> {p.label}
            </span>
          ))}
        </div>
      </div>

      <div style={{ border: "1px solid #EAEBEF", borderRadius: 12, overflow: "hidden" }}>
        {/* Header */}
        <div style={{ display: "grid", gridTemplateColumns: "260px 1fr", background: "#FAFBFC", borderBottom: "1px solid #EAEBEF" }}>
          <div style={{ padding: "10px 14px", fontSize: 11, fontWeight: 700, color: "#6B7280", textTransform: "uppercase", letterSpacing: 0.5 }}>Ação</div>
          <div style={{ position: "relative", height: 36 }}>
            {/* Phase bands */}
            {phaseBoundaries.map((p) => (
              <div key={p.label} style={{
                position: "absolute", top: 0, bottom: 0,
                left: `${(p.start / totalWeeks) * 100}%`,
                width: `${((p.end - p.start) / totalWeeks) * 100}%`,
                background: `${p.color}10`, borderLeft: `2px solid ${p.color}55`,
              }} />
            ))}
            {/* Ticks */}
            {ticks.map((t) => (
              <div key={t} style={{
                position: "absolute", top: 0, bottom: 0,
                left: `${(t / totalWeeks) * 100}%`,
                borderLeft: t === 0 ? "none" : "1px dashed #EAEBEF",
                fontSize: 10, color: "#A5A7B0", paddingLeft: 4, paddingTop: 10,
              }}>{t % 2 === 0 ? `S${t}` : ""}</div>
            ))}
          </div>
        </div>

        {/* Rows */}
        {rows.map((r, i) => (
          <div key={i} style={{
            display: "grid", gridTemplateColumns: "260px 1fr",
            borderTop: i === 0 ? "none" : "1px solid #F0F1F5",
            minHeight: 48, alignItems: "center",
          }}>
            <div style={{ padding: "10px 14px", display: "flex", flexDirection: "column", gap: 4 }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: "#272727", lineHeight: 1.3 }}>{r.name}</div>
              <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                <span style={{ fontSize: 10, color: "#6B7280" }}>{r.owner}</span>
                <span style={{ fontSize: 10, color: "#A5A7B0" }}>· {r.weeks}sem</span>
              </div>
            </div>
            <div style={{ position: "relative", height: 48 }}>
              {/* phase backgrounds */}
              {phaseBoundaries.map((p) => (
                <div key={p.label} style={{
                  position: "absolute", top: 0, bottom: 0,
                  left: `${(p.start / totalWeeks) * 100}%`,
                  width: `${((p.end - p.start) / totalWeeks) * 100}%`,
                  background: `${p.color}06`,
                }} />
              ))}
              {/* ticks */}
              {ticks.map((t) => (
                <div key={t} style={{
                  position: "absolute", top: 0, bottom: 0,
                  left: `${(t / totalWeeks) * 100}%`,
                  borderLeft: t === 0 ? "none" : "1px dashed #F0F1F5",
                }} />
              ))}
              {/* dependency line */}
              {!r.parallel && i > 0 && (
                <div style={{
                  position: "absolute",
                  left: `${(rows[i - 1].end / totalWeeks) * 100}%`,
                  top: -2, height: 14,
                  borderLeft: "1.5px dashed #C7CEFF",
                }} />
              )}
              {/* bar */}
              <div title={`${r.name} · semanas ${r.start}–${r.end}`} style={{
                position: "absolute",
                left: `calc(${(r.start / totalWeeks) * 100}% + 2px)`,
                width: `calc(${((r.end - r.start) / totalWeeks) * 100}% - 4px)`,
                top: 12, height: 24,
                background: `linear-gradient(90deg, ${effortColor(r.effort)}, ${effortColor(r.effort)}dd)`,
                borderRadius: 6,
                display: "flex", alignItems: "center", padding: "0 8px",
                color: "#fff", fontSize: 10.5, fontWeight: 700,
                boxShadow: `0 2px 6px ${effortColor(r.effort)}55`,
              }}>
                Impacto {r.impact}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ============= TRANSFORM GATE (when process lacks POP/BPMN/Assessment) =============
import { DocumentUploadFlow } from "@/components/onboarding/DocumentUploadFlow";
import { PreMappingView, buildMockPreMapping } from "@/components/process/PreMappingView";

function TransformGate({
  choice, setChoice, scopeData, setScopeData,
  initialName, initialDescription, initialArea, initialSystems,
  onDocsResolved, onScopeResolved,
}: {
  choice: "docs" | "scope" | null;
  setChoice: (c: "docs" | "scope" | null) => void;
  scopeData: any;
  setScopeData: (d: any) => void;
  initialName: string;
  initialDescription: string;
  initialArea: string;
  initialSystems: string[];
  onDocsResolved: () => void;
  onScopeResolved: () => void;
}) {
  const [form, setForm] = useState({
    name: initialName, description: initialDescription, area: initialArea,
    systems: initialSystems.length ? initialSystems : ["SAP", "Excel", "Email"],
  });
  const [systemInput, setSystemInput] = useState("");
  const [generating, setGenerating] = useState(false);
  const [editingScope, setEditingScope] = useState(false);
  const [scopeDraft, setScopeDraft] = useState<any>(null);

  const generateScope = () => {
    setGenerating(true);
    setTimeout(() => {
      setScopeData(buildMockPreMapping(form));
      setGenerating(false);
    }, 900);
  };

  const openEditScope = () => {
    setScopeDraft(JSON.parse(JSON.stringify(scopeData)));
    setEditingScope(true);
  };
  const saveEditScope = () => {
    setScopeData(scopeDraft);
    setEditingScope(false);
    toast.success("Diagrama atualizado");
  };

  // Choice screen
  if (!choice) {
    return (
      <main className="flex-1" style={{ minHeight: 0, display: "flex", flexDirection: "column", overflow: "auto", background: C.bg, padding: "48px 36px" }}>
        <div style={{ maxWidth: 980, margin: "0 auto", width: "100%" }}>
          <div style={{ textAlign: "center", marginBottom: 32 }}>
            <div style={{
              display: "inline-flex", alignItems: "center", gap: 6,
              padding: "4px 10px", borderRadius: 999, background: C.warningBg,
              border: `1px solid ${C.warningBorder}`, color: "#92400E", fontSize: 11, fontWeight: 600, marginBottom: 12,
            }}>
              <AlertCircle size={12} /> Documentação incompleta
            </div>
            <h1 style={{ fontSize: 24, fontWeight: 700, color: C.text, margin: 0 }}>
              Para iniciar a esteira, escolha um caminho
            </h1>
            <p style={{ fontSize: 14, color: C.muted, marginTop: 8, maxWidth: 620, margin: "8px auto 0" }}>
              Este processo ainda não possui POP, BPMN e Assessment gerados. Você pode adicionar a documentação
              completa ou gerar um diagrama do processo atual rapidamente para seguir com a transformação.
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <button onClick={() => setChoice("docs")} style={gateCard()}>
              <div style={gateIcon(C.primary)}><FileText size={22} color={C.primary} /></div>
              <div style={{ fontSize: 15, fontWeight: 700, color: C.text, marginTop: 14 }}>
                Adicionar documentação
              </div>
              <div style={{ fontSize: 12.5, color: C.muted, marginTop: 8, lineHeight: 1.6 }}>
                Suba um vídeo + transcrição ou um documento POP existente. O sistema gera POP, BPMN e Assessment
                e você segue o fluxo completo da esteira, com saúde do processo.
              </div>
              <div style={{ marginTop: 16, display: "inline-flex", alignItems: "center", gap: 6, color: C.primary, fontSize: 12, fontWeight: 600 }}>
                Escolher este caminho <ArrowRight size={14} />
              </div>
            </button>

            <button onClick={() => setChoice("scope")} style={gateCard()}>
              <div style={gateIcon("#0F766E")}><Workflow size={22} color="#0F766E" /></div>
              <div style={{ fontSize: 15, fontWeight: 700, color: C.text, marginTop: 14 }}>
                Gerar diagrama do processo atual
              </div>
              <div style={{ fontSize: 12.5, color: C.muted, marginTop: 8, lineHeight: 1.6 }}>
                Preencha informações básicas e o sistema sugere um diagrama de escopo editável. Você segue o fluxo
                da esteira normalmente, mas a saúde do processo ficará indisponível.
              </div>
              <div style={{ marginTop: 16, display: "inline-flex", alignItems: "center", gap: 6, color: "#0F766E", fontSize: 12, fontWeight: 600 }}>
                Escolher este caminho <ArrowRight size={14} />
              </div>
            </button>
          </div>
        </div>
      </main>
    );
  }

  // Path A — docs (reuse upload flow)
  if (choice === "docs") {
    return (
      <main className="flex-1" style={{ minHeight: 0, overflow: "auto", background: C.bg }}>
        <div style={{ padding: "16px 36px 0" }}>
          <button onClick={() => setChoice(null)} style={{
            display: "inline-flex", alignItems: "center", gap: 6, fontSize: 12,
            color: C.muted, background: "transparent", border: "none", cursor: "pointer", padding: 0,
          }}>
            <ArrowLeft size={13} /> Voltar à escolha
          </button>
        </div>
        <DocumentUploadFlow
          onComplete={onDocsResolved}
          initialName={form.name}
          initialDescription={form.description}
          initialArea={form.area}
          mode="docs-only"
        />
      </main>
    );
  }

  // Path B — scope diagram
  return (
    <main className="flex-1" style={{ minHeight: 0, overflow: "auto", background: C.bg, padding: "20px 36px 32px" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <button onClick={() => { setChoice(null); setScopeData(null); }} style={{
          display: "inline-flex", alignItems: "center", gap: 6, fontSize: 12,
          color: C.muted, background: "transparent", border: "none", cursor: "pointer", padding: 0, marginBottom: 12,
        }}>
          <ArrowLeft size={13} /> Voltar à escolha
        </button>

        {!scopeData ? (
          <div style={{ background: "#fff", border: `1px solid ${C.border}`, borderRadius: 14, padding: 24 }}>
            <h2 style={{ fontSize: 18, fontWeight: 700, color: C.text, margin: 0 }}>
              Informações do processo atual
            </h2>
            <p style={{ fontSize: 13, color: C.muted, marginTop: 6, marginBottom: 20 }}>
              Preencha os dados básicos. A IA gera um diagrama de escopo sugerido que você poderá editar em seguida.
            </p>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <FieldLite label="Nome do processo">
                <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} style={inputLite()} />
              </FieldLite>
              <FieldLite label="Área responsável">
                <input value={form.area} onChange={(e) => setForm({ ...form, area: e.target.value })} style={inputLite()} />
              </FieldLite>
            </div>
            <div style={{ marginTop: 12 }}>
              <FieldLite label="Descrição / contexto">
                <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
                  rows={3} style={{ ...inputLite(), resize: "vertical", fontFamily: "inherit" }} />
              </FieldLite>
            </div>
            <div style={{ marginTop: 12 }}>
              <FieldLite label="Sistemas envolvidos">
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 8 }}>
                  {form.systems.map((s, i) => (
                    <span key={i} style={{
                      display: "inline-flex", alignItems: "center", gap: 6, background: C.primaryBg,
                      border: `1px solid ${C.primaryBorder}`, color: C.primary, borderRadius: 999,
                      padding: "3px 10px", fontSize: 12, fontWeight: 600,
                    }}>
                      {s}
                      <button onClick={() => setForm({ ...form, systems: form.systems.filter((_, j) => j !== i) })}
                        style={{ background: "transparent", border: "none", cursor: "pointer", color: C.primary, padding: 0, display: "flex" }}>
                        <X size={12} />
                      </button>
                    </span>
                  ))}
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                  <input value={systemInput} onChange={(e) => setSystemInput(e.target.value)}
                    onKeyDown={(e) => { if (e.key === "Enter" && systemInput.trim()) { setForm({ ...form, systems: [...form.systems, systemInput.trim()] }); setSystemInput(""); }}}
                    placeholder="Adicionar sistema (Enter)" style={inputLite()} />
                </div>
              </FieldLite>
            </div>

            <div style={{ marginTop: 20, display: "flex", justifyContent: "flex-end" }}>
              <button onClick={generateScope} disabled={!form.name.trim() || generating} style={btnPrimary(!form.name.trim() || generating)}>
                {generating ? <><RefreshCw size={14} className="animate-spin" /> Gerando...</> : <><Sparkles size={14} /> Gerar diagrama de escopo</>}
              </button>
            </div>
          </div>
        ) : (
          <div>
            <div style={{
              background: C.primaryBgSoft, border: `1px solid ${C.primaryBorder}`, borderRadius: 12,
              padding: "12px 16px", marginBottom: 12, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12,
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <Sparkles size={16} color={C.primary} />
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: C.text }}>
                    Diagrama de escopo sugerido
                  </div>
                  <div style={{ fontSize: 11.5, color: C.muted, marginTop: 2 }}>
                    Revise as informações abaixo. Você pode regenerar ou confirmar para seguir com a esteira.
                  </div>
                </div>
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                {!editingScope ? (
                  <>
                    <button onClick={openEditScope} style={btnGhost(false)}>
                      <Edit3 size={13} /> Editar dados
                    </button>
                    <button onClick={generateScope} style={btnGhost(false)}>
                      <RefreshCw size={13} /> Regenerar
                    </button>
                    <button onClick={onScopeResolved} style={btnPrimary(false)}>
                      <Check size={13} /> Confirmar e seguir
                    </button>
                  </>
                ) : (
                  <>
                    <button onClick={() => setEditingScope(false)} style={btnGhost(false)}>
                      <X size={13} /> Cancelar
                    </button>
                    <button onClick={saveEditScope} style={btnPrimary(false)}>
                      <Check size={13} /> Salvar alterações
                    </button>
                  </>
                )}
              </div>
            </div>
            <div style={{ background: "#fff", border: `1px solid ${C.border}`, borderRadius: 14 }}>
              {editingScope ? (
                <ScopeEditor draft={scopeDraft} setDraft={setScopeDraft} />
              ) : (
                <PreMappingView data={scopeData} hasDocumentation={false} onGenerateDocs={() => setChoice("docs")} hideGenerateDocsCTA />
              )}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

function gateCard(): React.CSSProperties {
  return {
    background: "#fff", border: `1px solid ${C.border}`, borderRadius: 14,
    padding: 24, textAlign: "left", cursor: "pointer", transition: "all 0.2s",
    display: "flex", flexDirection: "column", alignItems: "flex-start",
  };
}
function gateIcon(color: string): React.CSSProperties {
  return {
    width: 44, height: 44, borderRadius: 10, background: `${color}14`,
    border: `1px solid ${color}33`, display: "flex", alignItems: "center", justifyContent: "center",
  };
}
function FieldLite({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label style={{ display: "block", fontSize: 11, fontWeight: 600, color: C.text, marginBottom: 6 }}>{label}</label>
      {children}
    </div>
  );
}
function inputLite(): React.CSSProperties {
  return {
    width: "100%", padding: "9px 12px", border: `1px solid ${C.border}`, borderRadius: 8,
    fontSize: 13, color: C.text, background: "#fff", outline: "none",
  };
}


function ScopeEditor({ draft, setDraft }: { draft: any; setDraft: (d: any) => void }) {
  if (!draft) return null;
  const upd = (k: string, v: any) => setDraft({ ...draft, [k]: v });
  const updArr = (k: string, idx: number, v: string) => {
    const arr = [...draft[k]]; arr[idx] = v; setDraft({ ...draft, [k]: arr });
  };
  const removeArr = (k: string, idx: number) => {
    const arr = [...draft[k]]; arr.splice(idx, 1); setDraft({ ...draft, [k]: arr });
  };
  const addArr = (k: string) => setDraft({ ...draft, [k]: [...draft[k], ""] });
  const updAct = (idx: number, v: string) => {
    const arr = [...draft.atividades]; arr[idx] = { ...arr[idx], name: v }; setDraft({ ...draft, atividades: arr });
  };
  const removeAct = (idx: number) => {
    const arr = [...draft.atividades]; arr.splice(idx, 1); setDraft({ ...draft, atividades: arr });
  };
  const addAct = () => setDraft({ ...draft, atividades: [...draft.atividades, { name: "Nova atividade", systems: [] }] });

  const inp: React.CSSProperties = {
    width: "100%", padding: "8px 10px", border: `1px solid ${C.border}`,
    borderRadius: 8, fontSize: 13, color: C.text, background: "#fff", outline: "none",
  };
  const Section = ({ label, children }: { label: string; children: React.ReactNode }) => (
    <div>
      <div style={{ fontSize: 10, fontWeight: 700, color: C.primary, letterSpacing: 0.6, textTransform: "uppercase", marginBottom: 6 }}>{label}</div>
      {children}
    </div>
  );
  const ListEditor = ({ field }: { field: string }) => (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      {draft[field].map((it: string, i: number) => (
        <div key={i} style={{ display: "flex", gap: 6 }}>
          <input value={it} onChange={(e) => updArr(field, i, e.target.value)} style={inp} />
          <button onClick={() => removeArr(field, i)} style={{ background: "transparent", border: `1px solid ${C.border}`, borderRadius: 8, padding: "0 10px", cursor: "pointer", color: C.muted }}>
            <X size={13} />
          </button>
        </div>
      ))}
      <button onClick={() => addArr(field)} style={{
        alignSelf: "flex-start", display: "inline-flex", alignItems: "center", gap: 6,
        fontSize: 12, color: C.primary, background: "transparent", border: `1px dashed ${C.primaryBorder}`,
        borderRadius: 8, padding: "5px 10px", cursor: "pointer",
      }}>
        <Plus size={12} /> Adicionar
      </button>
    </div>
  );

  return (
    <div className="p-8 px-10" style={{ display: "flex", flexDirection: "column", gap: 18 }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
        <Section label="Objetivo"><textarea value={draft.objetivo} onChange={(e) => upd("objetivo", e.target.value)} rows={2} style={{ ...inp, resize: "vertical", fontFamily: "inherit" }} /></Section>
        <Section label="Proposta de valor"><textarea value={draft.proposta} onChange={(e) => upd("proposta", e.target.value)} rows={2} style={{ ...inp, resize: "vertical", fontFamily: "inherit" }} /></Section>
        <Section label="Evento de início"><input value={draft.inicio} onChange={(e) => upd("inicio", e.target.value)} style={inp} /></Section>
        <Section label="Evento de fim"><input value={draft.fim} onChange={(e) => upd("fim", e.target.value)} style={inp} /></Section>
        <Section label="Origem"><input value={draft.origem} onChange={(e) => upd("origem", e.target.value)} style={inp} /></Section>
        <Section label="Destino"><input value={draft.destino} onChange={(e) => upd("destino", e.target.value)} style={inp} /></Section>
      </div>
      <Section label="Entrada de dados"><ListEditor field="entradas" /></Section>
      <Section label="Atividades">
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {draft.atividades.map((a: any, i: number) => (
            <div key={i} style={{ display: "flex", gap: 6 }}>
              <input value={a.name} onChange={(e) => updAct(i, e.target.value)} style={inp} />
              <button onClick={() => removeAct(i)} style={{ background: "transparent", border: `1px solid ${C.border}`, borderRadius: 8, padding: "0 10px", cursor: "pointer", color: C.muted }}>
                <X size={13} />
              </button>
            </div>
          ))}
          <button onClick={addAct} style={{
            alignSelf: "flex-start", display: "inline-flex", alignItems: "center", gap: 6,
            fontSize: 12, color: C.primary, background: "transparent", border: `1px dashed ${C.primaryBorder}`,
            borderRadius: 8, padding: "5px 10px", cursor: "pointer",
          }}>
            <Plus size={12} /> Adicionar atividade
          </button>
        </div>
      </Section>
      <Section label="Saída de dados"><ListEditor field="saidas" /></Section>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
        <Section label="Sistemas"><ListEditor field="systems" /></Section>
        <Section label="Dores"><ListEditor field="dores" /></Section>
      </div>
    </div>
  );
}

export default TransformProcesses;
