import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft, ChevronRight, ChevronDown, Search, Sparkles, Check,
  Bookmark, X, Eye, Zap, TrendingUp, BarChart3, Loader2, Network,
  Users, DollarSign, Shield, GitBranch,
} from "lucide-react";
import { toast } from "sonner";
import { TopBar } from "@/components/layout/TopBar";
import { useLanguage } from "@/contexts/LanguageContext";
import { useValueChainStore } from "@/stores/valueChainStore";
import {
  mockValueChain, MockL1, MockL2, MockL3, MockL4,
  mockOpportunities, MockOpportunity, impactScore, effortScore,
  quickContextSuggestions, VALUE_LEVERS_META, ValueLever,
} from "@/data/discoverMockData";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ModeSelector, DiscoverMode } from "@/components/discover/ModeSelector";
import { SimulateFlow } from "@/components/discover/SimulateFlow";
import { GoalFlow } from "@/components/discover/GoalFlow";
import { UnifiedResults } from "@/components/discover/UnifiedResults";
import { IndicatorSummary } from "@/components/discover/IndicatorsPanel";

interface DiscoverOpportunitiesProps {
  onLogout: () => void;
}

type Stage = "config" | "enrichment" | "processing" | "results";

const LEVER_ICONS: Record<ValueLever, typeof Zap> = {
  "Eficiência Operacional": Zap,
  "Experiência do Colaborador": Users,
  "Custo Operacional": DollarSign,
  "Qualidade & Compliance": Shield,
  "Velocidade de Decisão": TrendingUp,
};

interface CorrelatedProcess {
  id: string;
  name: string;
  level: "L3" | "L4";
  reason: string;
}

const SYSTEMS_BY_AREA: Record<string, string[]> = {
  RH: ["Workday", "SAP SuccessFactors", "Gupy"],
  Financeiro: ["SAP S/4HANA", "Oracle EBS", "Totvs Protheus"],
  Suprimentos: ["SAP Ariba", "Coupa", "ServiceNow"],
};

function detectCorrelations(selected: SelectedNode[]): CorrelatedProcess[] {
  const areas = new Set(selected.map((s) => s.breadcrumb.split(" > ")[0]));
  const out: CorrelatedProcess[] = [];
  if (areas.has("RH")) {
    out.push({ id: "cor-1", name: "Financeiro > Folha de Pagamento", level: "L3", reason: "Compartilha dados de colaborador e horas." });
    out.push({ id: "cor-2", name: "Suprimentos > Fornecedores > Homologação", level: "L4", reason: "Onboarding e compliance compartilham fluxo." });
  }
  if (areas.has("Financeiro")) {
    out.push({ id: "cor-3", name: "RH > Folha de Pagamento", level: "L3", reason: "Cálculo e desembolso integrados." });
    out.push({ id: "cor-4", name: "Suprimentos > Compras > Aprovação", level: "L4", reason: "Fluxo de alçada compartilhado." });
  }
  if (areas.has("Suprimentos")) {
    out.push({ id: "cor-5", name: "Financeiro > Contas a Pagar > Aprovação de pagamento", level: "L3", reason: "Aprovações em cascata." });
    out.push({ id: "cor-6", name: "RH > Onboarding > Documentação admissional", level: "L4", reason: "Validação de fornecedores PJ usa mesmo template." });
  }
  if (out.length === 0) {
    out.push({ id: "cor-x1", name: "Financeiro > Contas a Pagar > Aprovação de pagamento", level: "L3", reason: "Detectado padrão similar de aprovação." });
    out.push({ id: "cor-x2", name: "RH > Onboarding > Integração", level: "L3", reason: "Mesmo perfil de stakeholders envolvidos." });
  }
  return out;
}

interface SelectedNode {
  level: "L1" | "L2" | "L3" | "L4";
  id: string;
  breadcrumb: string;
  estimatedProcesses: number;
}

const PROCESSING_STEPS = [
  "Analisando processos relacionados",
  "Cruzando dados internos",
  "Comparando com benchmarks",
  "Identificando oportunidades",
];

export function DiscoverOpportunities({ onLogout }: DiscoverOpportunitiesProps) {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const realChain = useValueChainStore((s) => s.l1Processes);

  const [mode, setMode] = useState<DiscoverMode | null>(null);
  const [stage, setStage] = useState<Stage>("config");
  const [search, setSearch] = useState("");
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [selected, setSelected] = useState<SelectedNode[]>([]);
  const [lenses, setLenses] = useState<string[]>(["Eficiência Operacional"]);
  const [includedCorrelated, setIncludedCorrelated] = useState<Set<string>>(new Set());
  const [context, setContext] = useState("");
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set());
  const [discardedIds, setDiscardedIds] = useState<Set<string>>(new Set());
  const [detailOp, setDetailOp] = useState<MockOpportunity | null>(null);
  const [hoverOp, setHoverOp] = useState<MockOpportunity | null>(null);
  const [showingFlowResults, setShowingFlowResults] = useState(false);

  // Build a unified hierarchy: real value chain if any, else mock
  const hierarchy: MockL1[] = useMemo(() => {
    if (realChain && realChain.length > 0) {
      return realChain.map((l1) => ({
        id: l1.id,
        name: language === "PT" ? (l1.namePT || l1.name) : (l1.nameEN || l1.name),
        l2: l1.l2Processes.map((l2) => ({
          id: l2.id, name: l2.name,
          l3: l2.l3Processes.map((l3) => ({
            id: l3.id, name: l3.name,
            l4: l3.l4Tasks.map((l4) => ({ id: l4.id, name: l4.name })),
          })),
        })),
      }));
    }
    return mockValueChain;
  }, [realChain, language]);

  const filteredHierarchy = useMemo(() => {
    if (!search.trim()) return hierarchy;
    const q = search.toLowerCase();
    return hierarchy
      .map((l1) => {
        const l2s = l1.l2
          .map((l2) => {
            const l3s = l2.l3
              .map((l3) => {
                const l4s = l3.l4.filter((l4) => l4.name.toLowerCase().includes(q));
                if (l3.name.toLowerCase().includes(q) || l4s.length > 0) {
                  return { ...l3, l4: l4s.length ? l4s : l3.l4 };
                }
                return null;
              })
              .filter(Boolean) as MockL3[];
            if (l2.name.toLowerCase().includes(q) || l3s.length > 0) {
              return { ...l2, l3: l3s.length ? l3s : l2.l3 };
            }
            return null;
          })
          .filter(Boolean) as MockL2[];
        if (l1.name.toLowerCase().includes(q) || l2s.length > 0) {
          return { ...l1, l2: l2s.length ? l2s : l1.l2 };
        }
        return null;
      })
      .filter(Boolean) as MockL1[];
  }, [hierarchy, search]);

  // Auto-expand when searching
  useEffect(() => {
    if (search.trim()) {
      const next: Record<string, boolean> = {};
      filteredHierarchy.forEach((l1) => {
        next[l1.id] = true;
        l1.l2.forEach((l2) => { next[l2.id] = true; l2.l3.forEach((l3) => { next[l3.id] = true; }); });
      });
      setExpanded(next);
    }
  }, [search, filteredHierarchy]);

  const toggle = (id: string) => setExpanded((p) => ({ ...p, [id]: !p[id] }));

  const countDescendants = (l1?: MockL1, l2?: MockL2, l3?: MockL3, l4?: MockL4): number => {
    if (l4) return 1;
    if (l3) return Math.max(1, l3.l4.length);
    if (l2) return l2.l3.reduce((acc, x) => acc + Math.max(1, x.l4.length), 0);
    if (l1) return l1.l2.reduce((acc, x2) => acc + x2.l3.reduce((acc3, x3) => acc3 + Math.max(1, x3.l4.length), 0), 0);
    return 0;
  };

  // Toggle selection — clicking an already-selected node removes it
  const selectNode = (node: SelectedNode) => setSelected((prev) => {
    if (prev.some((n) => n.id === node.id)) return prev.filter((n) => n.id !== node.id);
    return [...prev, node];
  });
  const removeSelection = (id: string) => setSelected((prev) => prev.filter((n) => n.id !== id));
  const clearSelection = () => setSelected([]);

  // Compute ancestor path (ids) for each selected node — used to highlight
  // both tree (left) and visualization (right). Returns the union of all paths.
  const selectedPathIds = useMemo<string[]>(() => {
    if (selected.length === 0) return [];
    const result = new Set<string>();
    const findPath = (targetId: string): string[] => {
      for (const l1 of hierarchy) {
        if (l1.id === targetId) return [l1.id];
        for (const l2 of l1.l2) {
          if (l2.id === targetId) return [l1.id, l2.id];
          for (const l3 of l2.l3) {
            if (l3.id === targetId) return [l1.id, l2.id, l3.id];
            for (const l4 of l3.l4) {
              if (l4.id === targetId) return [l1.id, l2.id, l3.id, l4.id];
            }
          }
        }
      }
      return [];
    };
    selected.forEach((s) => findPath(s.id).forEach((id) => result.add(id)));
    return Array.from(result);
  }, [selected, hierarchy]);

  // Auto-expand ancestors of the most recently selected node
  useEffect(() => {
    if (selected.length === 0) return;
    const last = selected[selected.length - 1];
    const findPath = (targetId: string): string[] => {
      for (const l1 of hierarchy) {
        if (l1.id === targetId) return [l1.id];
        for (const l2 of l1.l2) {
          if (l2.id === targetId) return [l1.id, l2.id];
          for (const l3 of l2.l3) {
            if (l3.id === targetId) return [l1.id, l2.id, l3.id];
            for (const l4 of l3.l4) {
              if (l4.id === targetId) return [l1.id, l2.id, l3.id, l4.id];
            }
          }
        }
      }
      return [];
    };
    const path = findPath(last.id);
    if (path.length > 1) {
      setExpanded((p) => {
        const next = { ...p };
        path.slice(0, -1).forEach((id) => { next[id] = true; });
        return next;
      });
    }
  }, [selected, hierarchy]);

  const toggleLens = (lens: string) => {
    setLenses((prev) => prev.includes(lens) ? prev.filter((l) => l !== lens) : [...prev, lens]);
  };

  const canGenerate = selected.length > 0 && lenses.length > 0;

  const correlatedProcesses = useMemo(() => detectCorrelations(selected), [selected]);

  const goToEnrichment = () => {
    if (!canGenerate) return;
    // default include all
    setIncludedCorrelated(new Set(correlatedProcesses.map((c) => c.id)));
    setStage("enrichment");
  };

  const startProcessing = () => {
    setStage("processing");
    setTimeout(() => setStage("results"), PROCESSING_STEPS.length * 700 + 400);
  };

  const visibleOpportunities = mockOpportunities.filter((o) => !discardedIds.has(o.id));

  const handleSave = (op: MockOpportunity) => {
    setSavedIds((p) => new Set(p).add(op.id));
    toast.success(language === "PT" ? "Oportunidade salva" : "Opportunity saved", {
      description: op.title,
    });
  };

  const handleDiscard = (op: MockOpportunity) => {
    setDiscardedIds((p) => new Set(p).add(op.id));
    toast(language === "PT" ? "Oportunidade descartada" : "Opportunity discarded");
  };

  const resetAll = () => {
    setStage("config");
    setDiscardedIds(new Set());
    setHoverOp(null);
  };

  const stepIndex: 0 | 1 | 2 = mode === "scope"
    ? (stage === "config" ? 0 : stage === "enrichment" ? 1 : 2)
    : 0;

  const inResults = (mode === "scope" && stage === "results") || showingFlowResults;
  const showWrapper = !((mode === "simulate" || mode === "goal") || (mode === "scope" && stage === "results"));
  return (
    <div style={{ minHeight: "100vh", background: "#F4F5F8", display: "flex", flexDirection: "column" }}>
      <TopBar onLogout={onLogout} />
      <main style={{ flex: 1 }}>
        {!inResults && (
          <Header
            onBack={() => (mode ? setMode(null) : navigate("/org-intelligence-hub"))}
            showSteps={mode === "scope"}
            stepIndex={stepIndex}
          />
        )}
        <div style={showWrapper ? { maxWidth: 1280, margin: "0 auto", padding: "32px 40px 64px" } : undefined}>

          {!mode && <ModeSelector onSelect={setMode} />}

          {mode === "simulate" && <SimulateFlow onBack={() => setMode(null)} onResultsChange={setShowingFlowResults} />}
          {mode === "goal" && <GoalFlow onBack={() => setMode(null)} onResultsChange={setShowingFlowResults} />}

          {mode === "scope" && stage === "config" && (
            <ConfigSection
              hierarchy={filteredHierarchy}
              fullHierarchy={hierarchy}
              expanded={expanded}
              toggle={toggle}
              setExpanded={setExpanded}
              search={search}
              setSearch={setSearch}
              selected={selected}
              selectedPathIds={selectedPathIds}
              selectNode={selectNode}
              removeSelection={removeSelection}
              clearSelection={clearSelection}
              countDescendants={countDescendants}
              lenses={lenses}
              toggleLens={toggleLens}
              context={context}
              setContext={setContext}
              canGenerate={canGenerate}
              onGenerate={goToEnrichment}
            />
          )}

          {mode === "scope" && stage === "enrichment" && (
            <EnrichmentSection
              selected={selected}
              correlated={correlatedProcesses}
              included={includedCorrelated}
              setIncluded={setIncludedCorrelated}
              onConfirm={startProcessing}
              onSkip={startProcessing}
              onBack={() => setStage("config")}
            />
          )}

          {mode === "scope" && stage === "processing" && <ProcessingSection />}

          {mode === "scope" && stage === "results" && (
            <ScopeResults
              opportunities={visibleOpportunities}
              savedIds={savedIds}
              onSave={handleSave}
              onReset={resetAll}
              selectedNames={selected.map((s) => s.breadcrumb.split(" > ").slice(-1)[0])}
            />
          )}
        </div>
      </main>

      <DetailsModal op={detailOp} onClose={() => setDetailOp(null)} onSave={handleSave} saved={detailOp ? savedIds.has(detailOp.id) : false} />
    </div>
  );
}

/* ============================================================================
 * Scope Results — uses unified layout
 * ========================================================================== */
function ScopeResults({
  opportunities, savedIds, onSave, onReset, selectedNames,
}: {
  opportunities: MockOpportunity[];
  savedIds: Set<string>;
  onSave: (op: MockOpportunity) => void;
  onReset: () => void;
  selectedNames: string[];
}) {
  const summary: IndicatorSummary = {
    sentiment: "positivo",
    confidence: 82,
    impact: "Alto",
    scale: `${opportunities.length} oportunidades`,
    areas: Math.max(1, new Set(opportunities.flatMap((o) => o.impactedProcesses.map((p) => p.name.split(" > ")[0]))).size),
    processes: opportunities.reduce((a, o) => a + o.impactedProcesses.length, 0),
    systems: 5,
  };
  const title = selectedNames.length === 0 ? "Análise de oportunidades"
    : selectedNames.length === 1 ? selectedNames[0]
    : `${selectedNames.slice(0, 2).join(", ")}${selectedNames.length > 2 ? ` +${selectedNames.length - 2}` : ""}`;
  return (
    <UnifiedResults
      mode="scope"
      title={title}
      subtitle="Resultados consolidados do escopo selecionado."
      summary={summary}
      opportunities={opportunities}
      sourceContext={title}
      onReset={onReset}
      onBack={onReset}
    />
  );
}

/* ============================================================================
 * Header
 * ========================================================================== */
function Header({ onBack, showSteps, stepIndex }: { onBack: () => void; showSteps: boolean; stepIndex: 0 | 1 | 2 }) {
  const STEPS = ["Escopo", "Alavancas", "Contexto"];
  return (
    <div
      style={{
        background: "linear-gradient(135deg, #04223D 0%, #0C1BA8 100%)",
        padding: "0 40px",
        height: 88,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        color: "#FFFFFF",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
        <button
          onClick={onBack}
          style={{
            display: "inline-flex", alignItems: "center", gap: 6,
            fontSize: 13, color: "rgba(255,255,255,0.85)",
            background: "rgba(255,255,255,0.10)", border: "1px solid rgba(255,255,255,0.18)",
            backdropFilter: "blur(4px)", borderRadius: 10,
            cursor: "pointer", padding: "8px 14px", fontWeight: 500,
          }}
        >
          <ArrowLeft size={14} /> Voltar
        </button>
        <div>
          <div style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: "1.2px", textTransform: "uppercase", color: "rgba(255,255,255,0.55)" }}>
            Org Intelligence
          </div>
          <h1 style={{ fontSize: 18, fontWeight: 700, color: "#FFFFFF", margin: "2px 0 0", letterSpacing: "-0.2px" }}>
            Descobrir oportunidades
          </h1>
        </div>
      </div>

      {showSteps && (
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          {STEPS.map((label, i) => {
            const active = i === stepIndex;
            const done = i < stepIndex;
            return (
              <div key={label} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span
                  style={{
                    display: "inline-flex", alignItems: "center", justifyContent: "center",
                    width: 22, height: 22, borderRadius: "50%",
                    background: done ? "#16A34A" : active ? "#FFFFFF" : "rgba(255,255,255,0.18)",
                    color: done ? "#FFFFFF" : active ? "#0C1BA8" : "rgba(255,255,255,0.7)",
                    fontSize: 11, fontWeight: 700,
                  }}
                >
                  {done ? <Check size={12} /> : i + 1}
                </span>
                <span style={{
                  fontSize: 12, fontWeight: 600,
                  color: active ? "#FFFFFF" : "rgba(255,255,255,0.6)",
                }}>
                  {label}
                </span>
                {i < STEPS.length - 1 && (
                  <span style={{ width: 18, height: 1, background: "rgba(255,255,255,0.25)" }} />
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

/* ============================================================================
 * Configuration
 * ========================================================================== */
interface ConfigProps {
  hierarchy: MockL1[];
  fullHierarchy: MockL1[];
  expanded: Record<string, boolean>;
  toggle: (id: string) => void;
  setExpanded: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
  search: string;
  setSearch: (v: string) => void;
  selected: SelectedNode[];
  selectedPathIds: string[];
  selectNode: (n: SelectedNode) => void;
  removeSelection: (id: string) => void;
  clearSelection: () => void;
  countDescendants: (l1?: MockL1, l2?: MockL2, l3?: MockL3, l4?: MockL4) => number;
  lenses: string[];
  toggleLens: (l: string) => void;
  context: string;
  setContext: (v: string) => void;
  canGenerate: boolean;
  onGenerate: () => void;
}

function ConfigSection(p: ConfigProps) {
  // AI suggestion based on context keywords
  const suggestedLens = useMemo(() => {
    const t = p.context.toLowerCase();
    if (!t.trim()) return null;
    const s: string[] = [];
    if (t.includes("tempo") || t.includes("rápido") || t.includes("rapido")) s.push("Eficiência");
    if (t.includes("custo")) s.push("Custo");
    if (t.includes("automat")) s.push("Eficiência");
    if (t.includes("experiência") || t.includes("cliente") || t.includes("colaborador")) s.push("Experiência");
    if (t.includes("erro") || t.includes("qualidade")) s.push("Qualidade");
    return s.filter((x) => !p.lenses.includes(x));
  }, [p.context, p.lenses]);

  const processCount = p.selected.reduce((acc, n) => acc + n.estimatedProcesses, 0);
  const ctaLabel = p.selected.length > 0
    ? `Gerar oportunidades para ${processCount} processo${processCount === 1 ? "" : "s"}`
    : "Gerar oportunidades";

  return (
    <div
      className="grid gap-6"
      style={{ gridTemplateColumns: "minmax(0, 3fr) minmax(0, 2fr)", alignItems: "start" }}
    >
      {/* ============== LEFT COLUMN — Configuration container ============== */}
      <div
        style={{
          background: "#F4F5F8",
          border: "1px solid #E8E8EA",
          borderRadius: "16px",
          padding: "20px",
          display: "flex", flexDirection: "column", gap: "16px",
        }}
      >
        {/* STEP 1 — Escopo */}
        <StepBlock
          number={1}
          title="Escopo"
          subtitle="Selecione qualquer nível (L1 a L4). Um nível pai inclui todos os filhos."
        >
          <div style={{ position: "relative", marginBottom: "12px" }}>
            <Search size={16} style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "#A5A7B0" }} />
            <input
              type="text"
              value={p.search}
              onChange={(e) => p.setSearch(e.target.value)}
              placeholder="Buscar por área ou processo..."
              style={{
                width: "100%", border: "1px solid #E8E8EA", borderRadius: "10px",
                padding: "10px 12px 10px 36px", fontSize: "14px", outline: "none",
                background: "#FFFFFF",
              }}
            />
          </div>

          <div
            style={{
              border: "1px solid #E8E8EA", borderRadius: "10px",
              background: "#FFFFFF", maxHeight: "300px", overflowY: "auto",
            }}
          >
            {p.hierarchy.length === 0 ? (
              <div style={{ padding: "24px", textAlign: "center", fontSize: "13px", color: "#A5A7B0" }}>
                Nenhum item encontrado.
              </div>
            ) : (
              p.hierarchy.map((l1) => (
                <TreeNode
                  key={l1.id}
                  node={{ ...l1, kind: "L1" }}
                  expanded={p.expanded}
                  toggle={p.toggle}
                  selectedIds={p.selected.map((s) => s.id)}
                  pathIds={p.selectedPathIds}
                  onSelect={(node) => {
                    p.selectNode({
                      level: node.level, id: node.id,
                      breadcrumb: node.breadcrumb,
                      estimatedProcesses: node.estimated,
                    });
                  }}
                  breadcrumb={l1.name}
                  count={p.countDescendants(l1)}
                />
              ))
            )}
          </div>

          {/* Selection chips (multi) */}
          <div style={{ marginTop: "12px", minHeight: "32px", display: "flex", flexWrap: "wrap", gap: "6px", alignItems: "center" }}>
            {p.selected.length > 0 ? (
              <>
                {p.selected.map((sel) => (
                  <div
                    key={sel.id}
                    style={{
                      display: "inline-flex", alignItems: "center", gap: "8px",
                      background: "#EEF0FF", border: "1px solid #C7CEFF",
                      borderRadius: "999px", padding: "5px 5px 5px 10px",
                      fontSize: "12.5px", color: "#0C1BA8", fontWeight: 500,
                      transition: "all 0.2s",
                      maxWidth: "100%",
                    }}
                  >
                    <span style={{
                      fontSize: "9.5px", fontWeight: 700,
                      background: "#0C1BA8", color: "#FFFFFF",
                      padding: "2px 5px", borderRadius: "3px",
                    }}>
                      {sel.level}
                    </span>
                    <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: "260px" }}>
                      {sel.breadcrumb}
                    </span>
                    <button
                      onClick={() => p.removeSelection(sel.id)}
                      aria-label={`Remover ${sel.breadcrumb}`}
                      style={{
                        width: "18px", height: "18px",
                        display: "inline-flex", alignItems: "center", justifyContent: "center",
                        background: "#FFFFFF", border: "none", borderRadius: "50%",
                        color: "#0C1BA8", cursor: "pointer", flexShrink: 0,
                      }}
                    >
                      <X size={11} />
                    </button>
                  </div>
                ))}
                {p.selected.length > 1 && (
                  <button
                    onClick={p.clearSelection}
                    style={{
                      fontSize: "12px", color: "#6B7280",
                      background: "none", border: "none",
                      padding: "4px 8px", cursor: "pointer",
                      textDecoration: "underline",
                    }}
                  >
                    Limpar tudo
                  </button>
                )}
              </>
            ) : (
              <span style={{ fontSize: "13px", color: "#A5A7B0" }}>Nenhuma seleção ainda. Você pode escolher múltiplos escopos.</span>
            )}
          </div>
        </StepBlock>

        {/* STEP 2 — Alavancas de Valor */}
        <StepBlock
          number={2}
          title="Alavancas de Valor"
          subtitle="Selecione as dimensões estratégicas que você quer mover com essa análise."
        >
          <div className="grid gap-3" style={{ gridTemplateColumns: "repeat(2, minmax(0, 1fr))" }}>
            {VALUE_LEVERS_META.map((meta) => {
              const Icon = LEVER_ICONS[meta.name];
              const active = p.lenses.includes(meta.name);
              return (
                <button
                  key={meta.name}
                  onClick={() => p.toggleLens(meta.name)}
                  style={{
                    textAlign: "left",
                    background: active ? "#EEF0FF" : "#FFFFFF",
                    border: `1px solid ${active ? "#0C1BA8" : "#E8E8EA"}`,
                    borderRadius: "12px",
                    padding: "14px",
                    cursor: "pointer",
                    display: "flex", flexDirection: "column", gap: "8px",
                    transition: "all 0.15s",
                    position: "relative",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <div style={{
                      width: "32px", height: "32px", borderRadius: "8px",
                      background: active ? "#0C1BA8" : "#F4F5F8",
                      color: active ? "#FFFFFF" : "#0C1BA8",
                      display: "flex", alignItems: "center", justifyContent: "center",
                    }}>
                      <Icon size={16} />
                    </div>
                    <span style={{ fontSize: "13.5px", fontWeight: 600, color: "#272727", flex: 1 }}>
                      {meta.name}
                    </span>
                    {active && (
                      <div style={{
                        width: "20px", height: "20px", borderRadius: "50%",
                        background: "#0C1BA8", color: "#FFFFFF",
                        display: "flex", alignItems: "center", justifyContent: "center",
                      }}>
                        <Check size={12} />
                      </div>
                    )}
                  </div>
                  <p style={{ fontSize: "12px", color: "#6B7280", margin: 0, lineHeight: 1.45 }}>
                    {meta.description}
                  </p>
                  <div style={{ fontSize: "11px", color: "#A5A7B0", marginTop: "2px" }}>
                    {meta.kpis.join(" · ")}
                  </div>
                </button>
              );
            })}
          </div>
        </StepBlock>
        <StepBlock
          number={3}
          title="Contexto adicional"
          subtitle="Opcional. Quanto mais contexto, melhores os resultados."
        >
          <textarea
            value={p.context}
            onChange={(e) => p.setContext(e.target.value)}
            placeholder="Ex: reduzir tempo de aprovação, automatizar tarefas manuais..."
            rows={3}
            style={{
              width: "100%", border: "1px solid #E8E8EA", borderRadius: "10px",
              padding: "12px", fontSize: "14px", outline: "none",
              resize: "vertical", fontFamily: "inherit", background: "#FFFFFF",
            }}
          />

          <div style={{ display: "flex", gap: "8px", marginTop: "10px", flexWrap: "wrap" }}>
            {quickContextSuggestions.map((s) => (
              <button
                key={s}
                onClick={() => p.setContext(p.context ? `${p.context} ${s.toLowerCase()}` : s)}
                className="hover:bg-[#E8E8EA]"
                style={{
                  background: "#F3F4F6", color: "#6B7280",
                  border: "none", borderRadius: "999px",
                  padding: "6px 12px", fontSize: "12px", cursor: "pointer",
                }}
              >
                + {s}
              </button>
            ))}
          </div>

          {suggestedLens && suggestedLens.length > 0 && (
            <div
              style={{
                marginTop: "12px", padding: "10px 12px",
                background: "#F0F9FF", border: "1px solid #BAE6FD",
                borderRadius: "10px", fontSize: "13px", color: "#075985",
                display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap",
              }}
            >
              <Sparkles size={14} />
              <span>Isso parece relacionado a {suggestedLens.join(" e ")}.</span>
              <button
                onClick={() => suggestedLens.forEach(p.toggleLens)}
                style={{ marginLeft: "auto", background: "#0C1BA8", color: "#FFFFFF", border: "none", borderRadius: "6px", padding: "4px 10px", fontSize: "12px", cursor: "pointer", fontWeight: 500 }}
              >
                Adicionar
              </button>
            </div>
          )}
        </StepBlock>

        {/* Sticky CTA footer */}
        <div
          style={{
            position: "sticky", bottom: "16px", zIndex: 5,
            marginTop: "4px",
            background: "#FFFFFF",
            border: "1px solid #E8E8EA",
            borderRadius: "12px",
            padding: "12px 16px",
            display: "flex", alignItems: "center", justifyContent: "space-between",
            gap: "12px", flexWrap: "wrap",
            boxShadow: "0 4px 12px -6px rgba(12, 27, 168, 0.08)",
          }}
        >
          <div style={{ fontSize: "12px", color: "#6B7280" }}>
            {p.selected.length > 0
              ? <>{p.selected.length} escopo{p.selected.length === 1 ? "" : "s"} · {p.lenses.length} alavanca{p.lenses.length === 1 ? "" : "s"}</>
              : "Selecione ao menos um escopo para continuar"}
          </div>
          <button
            disabled={!p.canGenerate}
            onClick={p.onGenerate}
            style={{
              display: "inline-flex", alignItems: "center", gap: "8px",
              background: p.canGenerate ? "#0C1BA8" : "#E8E8EA",
              color: p.canGenerate ? "#FFFFFF" : "#A5A7B0",
              border: "none", borderRadius: "10px",
              padding: "12px 22px", fontSize: "14px", fontWeight: 600,
              cursor: p.canGenerate ? "pointer" : "not-allowed",
              transition: "all 0.15s",
            }}
          >
            <Sparkles size={16} /> {ctaLabel}
          </button>
        </div>
      </div>

      {/* ============== RIGHT COLUMN — Live analysis brief ============== */}
      <AnalysisBriefCard
        hierarchy={p.fullHierarchy}
        selected={p.selected}
        selectedPathIds={p.selectedPathIds}
        lenses={p.lenses}
        context={p.context}
        canGenerate={p.canGenerate}
      />
    </div>
  );
}

/* ============================================================================
 * Step block (numbered)
 * ========================================================================== */
function StepBlock({
  number, title, subtitle, children,
}: { number: number; title: string; subtitle?: string; children: React.ReactNode }) {
  return (
    <section
      style={{
        background: "#FFFFFF", border: "1px solid #E8E8EA",
        borderRadius: "12px", padding: "20px",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: subtitle ? "4px" : "14px" }}>
        <div
          style={{
            width: "24px", height: "24px",
            background: "#EEF0FF", color: "#0C1BA8",
            borderRadius: "6px",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "12px", fontWeight: 700,
          }}
        >
          {number}
        </div>
        <h2 style={{ fontSize: "15px", fontWeight: 600, color: "#272727", margin: 0 }}>
          {title}
        </h2>
      </div>
      {subtitle && (
        <p style={{ fontSize: "12.5px", color: "#6B7280", margin: 0, marginBottom: "14px", paddingLeft: "34px" }}>
          {subtitle}
        </p>
      )}
      {children}
    </section>
  );
}

/* ============================================================================
 * Analysis Brief Card (right panel — live preview that fills as user inputs)
 * ========================================================================== */
function AnalysisBriefCard({
  hierarchy, selected, lenses, context, canGenerate,
}: {
  hierarchy: MockL1[];
  selected: SelectedNode[];
  selectedPathIds: string[];
  lenses: string[];
  context: string;
  canGenerate: boolean;
}) {
  // Resolve full ancestor trail (objects) for ANY selected node
  const trailFor = (targetId: string): { level: SelectedNode["level"]; name: string }[] => {
    for (const l1 of hierarchy) {
      if (l1.id === targetId) return [{ level: "L1", name: l1.name }];
      for (const l2 of l1.l2) {
        if (l2.id === targetId) return [{ level: "L1", name: l1.name }, { level: "L2", name: l2.name }];
        for (const l3 of l2.l3) {
          if (l3.id === targetId) return [
            { level: "L1", name: l1.name }, { level: "L2", name: l2.name }, { level: "L3", name: l3.name },
          ];
          for (const l4 of l3.l4) {
            if (l4.id === targetId) return [
              { level: "L1", name: l1.name }, { level: "L2", name: l2.name },
              { level: "L3", name: l3.name }, { level: "L4", name: l4.name },
            ];
          }
        }
      }
    }
    return [];
  };

  const totalProcesses = selected.reduce((acc, n) => acc + n.estimatedProcesses, 0);
  const filledSteps = [
    selected.length > 0,
    lenses.length > 0,
    context.trim().length > 0,
  ];
  const completion = Math.round((filledSteps.filter(Boolean).length / 3) * 100);

  const heroTitle =
    selected.length === 0
      ? "Sua análise aparecerá aqui"
      : selected.length === 1
        ? selected[0].breadcrumb.split(" > ").slice(-1)[0]
        : `${selected.length} escopos selecionados`;

  return (
    <aside
      style={{
        position: "sticky", top: "16px",
        width: "100%",
        borderRadius: "16px",
        background: "linear-gradient(180deg, #FFFFFF 0%, #FAFAFC 100%)",
        border: "1px solid #E8E8EA",
        overflow: "hidden",
        display: "flex", flexDirection: "column",
        height: "calc(100vh - 32px)",
      }}
    >
      {/* Header — branded gradient */}
      <div
        style={{
          background: "linear-gradient(135deg, #0C1BA8 0%, #2A3FE6 100%)",
          padding: "24px 26px",
          color: "#FFFFFF",
          position: "relative",
          overflow: "hidden",
          flexShrink: 0,
        }}
      >
        {/* Decorative orb */}
        <div
          style={{
            position: "absolute", top: "-40px", right: "-30px",
            width: "160px", height: "160px",
            background: "radial-gradient(circle, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0) 70%)",
            borderRadius: "50%", pointerEvents: "none",
          }}
        />

        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "10px", position: "relative" }}>
          <div
            style={{
              width: "26px", height: "26px",
              background: "rgba(255,255,255,0.22)",
              borderRadius: "7px",
              display: "flex", alignItems: "center", justifyContent: "center",
              backdropFilter: "blur(4px)",
              color: "#FFFFFF",
            }}
          >
            <Sparkles size={14} />
          </div>
          <span style={{ fontSize: "10.5px", fontWeight: 600, letterSpacing: "1px", textTransform: "uppercase", color: "#FFFFFF" }}>
            Ficha de análise
          </span>
        </div>

        <h3 style={{
          fontSize: "18px", fontWeight: 600, margin: 0, marginBottom: "16px",
          lineHeight: 1.3, color: "#FFFFFF", position: "relative",
        }}>
          {heroTitle}
        </h3>

        {/* Mini-stats */}
        <div style={{ display: "flex", gap: "20px", fontSize: "12px", position: "relative" }}>
          <BriefStat
            value={selected.length > 0 ? `${totalProcesses}` : "—"}
            label="processos"
          />
          <BriefStat
            value={selected.length > 0 ? `${selected.length}` : "—"}
            label={`escopo${selected.length === 1 ? "" : "s"}`}
          />
          <BriefStat
            value={lenses.length > 0 ? `${lenses.length}` : "—"}
            label={`alavanca${lenses.length === 1 ? "" : "s"}`}
          />
          <BriefStat
            value={`${completion}%`}
            label="completo"
          />
        </div>
      </div>

      {/* Body */}
      <div style={{
        padding: "24px 26px", display: "flex", flexDirection: "column", gap: "24px",
        overflowY: "auto", flex: 1,
      }}>
        {/* Section 1 — Escopo (multi) */}
        <BriefSection number={1} title="Escopo" filled={selected.length > 0}>
          {selected.length > 0 ? (
            <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              {selected.map((sel, sIdx) => {
                const trail = trailFor(sel.id);
                return (
                  <div
                    key={sel.id}
                    style={{
                      background: "#FFFFFF",
                      border: "1px solid #E8E8EA",
                      borderLeft: "3px solid #0C1BA8",
                      borderRadius: "8px",
                      padding: "12px 14px",
                      animation: "fade-in 0.25s ease-out",
                    }}
                  >
                    <div style={{
                      display: "flex", alignItems: "center", justifyContent: "space-between",
                      marginBottom: trail.length > 0 ? "10px" : 0,
                    }}>
                      <span style={{ fontSize: "11px", color: "#A5A7B0", fontWeight: 600 }}>
                        Escopo {sIdx + 1}
                      </span>
                      <span style={{
                        fontSize: "11px", color: "#0C1BA8", fontWeight: 600,
                        background: "#EEF0FF", padding: "2px 8px", borderRadius: "4px",
                      }}>
                        {sel.estimatedProcesses} processo{sel.estimatedProcesses === 1 ? "" : "s"}
                      </span>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                      {trail.map((node, idx) => {
                        const isLast = idx === trail.length - 1;
                        return (
                          <div
                            key={`${sel.id}-${idx}`}
                            style={{
                              display: "flex", alignItems: "center", gap: "10px",
                              paddingLeft: `${idx * 12}px`,
                            }}
                          >
                            <div style={{
                              width: "8px", height: "8px",
                              borderRadius: "50%",
                              background: isLast ? "#0C1BA8" : "#C7CEFF",
                              boxShadow: isLast ? "0 0 0 2px #EEF0FF" : "none",
                              flexShrink: 0,
                            }} />
                            <span style={{
                              fontSize: "9px", fontWeight: 700, letterSpacing: "0.3px",
                              padding: "1px 5px", borderRadius: "3px",
                              background: isLast ? "#0C1BA8" : "#F3F4F6",
                              color: isLast ? "#FFFFFF" : "#6B7280",
                              minWidth: "22px", textAlign: "center",
                            }}>
                              {node.level}
                            </span>
                            <span style={{
                              fontSize: "13px",
                              color: isLast ? "#0C1BA8" : "#6B7280",
                              fontWeight: isLast ? 600 : 400,
                              overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                            }}>
                              {node.name}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <EmptyHint text="Selecione um ou mais níveis da cadeia de valor" />
          )}
        </BriefSection>

        {/* Section 2 — Alavancas de Valor */}
        <BriefSection number={2} title="Alavancas de Valor" filled={lenses.length > 0}>
          {lenses.length > 0 ? (
            <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
              {lenses.map((lens) => (
                <span
                  key={lens}
                  style={{
                    display: "inline-flex", alignItems: "center", gap: "5px",
                    background: "#EEF0FF", color: "#0C1BA8",
                    border: "1px solid #C7CEFF",
                    borderRadius: "999px",
                    padding: "5px 11px",
                    fontSize: "12.5px", fontWeight: 500,
                    animation: "fade-in 0.25s ease-out",
                  }}
                >
                  <Check size={10} /> {lens}
                </span>
              ))}
            </div>
          ) : (
            <EmptyHint text="Escolha pelo menos uma alavanca" />
          )}
        </BriefSection>

        {/* Section 3 — Contexto */}
        <BriefSection number={3} title="Contexto adicional" filled={context.trim().length > 0} optional>
          {context.trim().length > 0 ? (
            <div
              style={{
                background: "#F9F9F9",
                border: "1px solid #E8E8EA",
                borderRadius: "8px",
                padding: "12px 14px",
                fontSize: "13px", color: "#374151",
                lineHeight: 1.55,
                fontStyle: "italic",
                animation: "fade-in 0.25s ease-out",
              }}
            >
              "{context}"
            </div>
          ) : (
            <EmptyHint text="Sem contexto adicional" muted />
          )}
        </BriefSection>

        {/* Footer status */}
        <div
          style={{
            marginTop: "auto",
            paddingTop: "16px",
            borderTop: "1px dashed #E8E8EA",
            display: "flex", alignItems: "center", gap: "12px",
          }}
        >
          <div
            style={{
              width: "36px", height: "36px",
              borderRadius: "50%",
              background: canGenerate ? "#EEF0FF" : "#F3F4F6",
              color: canGenerate ? "#0C1BA8" : "#A5A7B0",
              display: "flex", alignItems: "center", justifyContent: "center",
              flexShrink: 0,
              transition: "all 0.3s",
            }}
          >
            {canGenerate ? <Check size={18} /> : <Loader2 size={14} />}
          </div>
          <div>
            <div style={{ fontSize: "13px", fontWeight: 600, color: canGenerate ? "#0C1BA8" : "#374151" }}>
              {canGenerate ? "Pronto para gerar" : "Aguardando preenchimento"}
            </div>
            <div style={{ fontSize: "12px", color: "#A5A7B0" }}>
              {canGenerate
                ? "Clique em \"Gerar oportunidades\" para continuar"
                : selected.length === 0
                  ? "Falta definir o escopo"
                  : "Falta selecionar uma alavanca"}
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}

function BriefStat({ value, label }: { value: string; label: string }) {
  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <span style={{ fontSize: "20px", fontWeight: 600, lineHeight: 1, fontVariantNumeric: "tabular-nums" }}>
        {value}
      </span>
      <span style={{ fontSize: "10.5px", opacity: 0.85, marginTop: "2px", textTransform: "lowercase" }}>
        {label}
      </span>
    </div>
  );
}

function BriefSection({
  number, title, filled, optional, children,
}: { number: number; title: string; filled: boolean; optional?: boolean; children: React.ReactNode }) {
  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "10px" }}>
        <div
          style={{
            width: "20px", height: "20px",
            borderRadius: "5px",
            background: filled ? "#0C1BA8" : "#F3F4F6",
            color: filled ? "#FFFFFF" : "#A5A7B0",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "10.5px", fontWeight: 700,
            transition: "background 0.25s, color 0.25s",
          }}
        >
          {filled ? <Check size={11} /> : number}
        </div>
        <span style={{
          fontSize: "11px", fontWeight: 600, letterSpacing: "0.6px",
          textTransform: "uppercase",
          color: filled ? "#272727" : "#A5A7B0",
        }}>
          {title}
        </span>
        {optional && (
          <span style={{
            fontSize: "9.5px", color: "#A5A7B0",
            background: "#F3F4F6", padding: "1px 6px", borderRadius: "3px",
            fontWeight: 500,
          }}>
            opcional
          </span>
        )}
      </div>
      <div style={{ paddingLeft: "28px" }}>
        {children}
      </div>
    </div>
  );
}

function EmptyHint({ text, muted }: { text: string; muted?: boolean }) {
  return (
    <div
      style={{
        fontSize: "12.5px",
        color: muted ? "#C5C7CD" : "#A5A7B0",
        fontStyle: "italic",
        padding: "8px 0",
      }}
    >
      {text}
    </div>
  );
}

/* ============================================================================
 * Tree node
 * ========================================================================== */
interface TreeNodeProps {
  node: any; // L1+kind / L2+kind etc
  expanded: Record<string, boolean>;
  toggle: (id: string) => void;
  selectedIds?: string[];
  pathIds?: string[];
  onSelect: (n: { level: SelectedNode["level"]; id: string; breadcrumb: string; estimated: number }) => void;
  breadcrumb: string;
  count: number;
  depth?: number;
}

function TreeNode({ node, expanded, toggle, selectedIds = [], pathIds = [], onSelect, breadcrumb, count, depth = 0 }: TreeNodeProps) {
  const children: any[] | undefined = node.l2 || node.l3 || node.l4;
  const isOpen = expanded[node.id];
  const hasChildren = !!children && children.length > 0;
  const isSelected = selectedIds.includes(node.id);
  const inPath = !isSelected && pathIds.includes(node.id);
  const level: SelectedNode["level"] =
    node.l2 ? "L1" : node.l3 ? "L2" : node.l4 ? "L3" : "L4";

  return (
    <div>
      <div
        style={{
          display: "flex", alignItems: "center", gap: "6px",
          padding: "8px 12px",
          paddingLeft: `${12 + depth * 18}px`,
          background: isSelected ? "#EEF0FF" : inPath ? "#F4F5F8" : "transparent",
          borderLeft: isSelected ? "3px solid #0C1BA8" : inPath ? "3px solid #C7CEFF" : "3px solid transparent",
          cursor: "pointer", fontSize: "13px",
          transition: "background 0.2s, border-color 0.2s",
        }}
        className={isSelected || inPath ? "" : "hover:bg-[#F9F9F9]"}
        onClick={() => onSelect({ level, id: node.id, breadcrumb, estimated: count })}
      >
        {hasChildren ? (
          <button
            onClick={(e) => { e.stopPropagation(); toggle(node.id); }}
            style={{ background: "none", border: "none", padding: 0, display: "flex", cursor: "pointer", color: "#6B7280" }}
          >
            {isOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
          </button>
        ) : (
          <span style={{ width: "14px" }} />
        )}
        <span style={{
          fontSize: "10px", fontWeight: 600,
          color: isSelected ? "#FFFFFF" : inPath ? "#0C1BA8" : "#A5A7B0",
          background: isSelected ? "#0C1BA8" : inPath ? "#FFFFFF" : "#F3F4F6",
          padding: "2px 6px", borderRadius: "4px",
          minWidth: "26px", textAlign: "center",
        }}>
          {level}
        </span>
        <span style={{ color: isSelected ? "#0C1BA8" : "#272727", fontWeight: isSelected || inPath ? 600 : 400 }}>
          {node.name}
        </span>
      </div>

      {isOpen && hasChildren && children!.map((child) => {
        const childCount =
          child.l3 ? child.l3.reduce((acc: number, x: any) => acc + Math.max(1, (x.l4 || []).length), 0)
          : child.l4 ? Math.max(1, child.l4.length)
          : 1;
        return (
          <TreeNode
            key={child.id}
            node={child}
            expanded={expanded}
            toggle={toggle}
            selectedIds={selectedIds}
            pathIds={pathIds}
            onSelect={onSelect}
            breadcrumb={`${breadcrumb} > ${child.name}`}
            count={childCount}
            depth={depth + 1}
          />
        );
      })}
    </div>
  );
}

/* ============================================================================
 * Block wrapper
 * ========================================================================== */
function Block({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) {
  return (
    <section
      style={{
        background: "#FFFFFF", border: "1px solid #E8E8EA",
        borderRadius: "14px", padding: "24px",
      }}
    >
      <h2 style={{ fontSize: "16px", fontWeight: 600, color: "#272727", margin: 0, marginBottom: subtitle ? "4px" : "16px" }}>
        {title}
      </h2>
      {subtitle && (
        <p style={{ fontSize: "13px", color: "#6B7280", margin: 0, marginBottom: "16px" }}>{subtitle}</p>
      )}
      {children}
    </section>
  );
}

/* ============================================================================
 * Processing
 * ========================================================================== */
function ProcessingSection() {
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    const t = setInterval(() => {
      setActiveStep((s) => (s < PROCESSING_STEPS.length - 1 ? s + 1 : s));
    }, 700);
    return () => clearInterval(t);
  }, []);

  return (
    <section
      style={{
        background: "linear-gradient(135deg, #04223D 0%, #0C1BA8 100%)",
        borderRadius: 20,
        padding: "64px 48px",
        minHeight: 400,
        display: "flex", flexDirection: "column", alignItems: "center",
        color: "#FFFFFF",
        boxShadow: "0 12px 40px rgba(12,27,168,0.18)",
      }}
    >
      <div
        style={{
          width: 64, height: 64,
          background: "rgba(255,255,255,0.15)", border: "1px solid rgba(255,255,255,0.2)",
          backdropFilter: "blur(6px)",
          borderRadius: 16, display: "flex", alignItems: "center", justifyContent: "center",
          marginBottom: 24,
        }}
      >
        <Sparkles size={28} style={{ color: "#FFFFFF" }} className="animate-pulse" />
      </div>
      <h2 style={{ fontSize: 22, fontWeight: 700, color: "#FFFFFF", margin: 0, marginBottom: 8, letterSpacing: "-0.3px" }}>
        Analisando sua cadeia de valor
      </h2>
      <p style={{ fontSize: 14, color: "rgba(255,255,255,0.65)", marginBottom: 36 }}>
        Isso leva apenas alguns segundos.
      </p>

      <div style={{ width: "100%", maxWidth: 480, display: "flex", flexDirection: "column", gap: 10 }}>
        {PROCESSING_STEPS.map((label, i) => {
          const done = i < activeStep;
          const active = i === activeStep;
          return (
            <div
              key={label}
              style={{
                display: "flex", alignItems: "center", gap: 14,
                padding: "14px 18px",
                background: active ? "rgba(255,255,255,0.10)" : "transparent",
                border: `1px solid ${active ? "rgba(255,255,255,0.22)" : "rgba(255,255,255,0.08)"}`,
                borderRadius: 10,
                transition: "all 0.3s",
              }}
            >
              <div
                style={{
                  width: 24, height: 24, borderRadius: "50%",
                  background: done || active ? "#FFFFFF" : "transparent",
                  border: `1px solid ${done || active ? "#FFFFFF" : "rgba(255,255,255,0.25)"}`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                {done ? (
                  <Check size={14} style={{ color: "#16A34A" }} />
                ) : active ? (
                  <Loader2 size={12} className="animate-spin" style={{ color: "#0C1BA8" }} />
                ) : null}
              </div>
              <span
                style={{
                  fontSize: 14,
                  color: done ? "rgba(255,255,255,0.55)" : active ? "#FFFFFF" : "rgba(255,255,255,0.35)",
                  fontWeight: active ? 600 : 400,
                  textDecoration: done ? "line-through" : "none",
                }}
              >
                {label}
              </span>
            </div>
          );
        })}
      </div>
    </section>
  );
}

/* ============================================================================
 * Results
 * ========================================================================== */
function ResultsSection({
  opportunities, savedIds, onSave, onDiscard, onDetails, hoverOp, setHoverOp, onReset,
}: {
  opportunities: MockOpportunity[];
  savedIds: Set<string>;
  onSave: (op: MockOpportunity) => void;
  onDiscard: (op: MockOpportunity) => void;
  onDetails: (op: MockOpportunity) => void;
  hoverOp: MockOpportunity | null;
  setHoverOp: (op: MockOpportunity | null) => void;
  onReset: () => void;
}) {
  if (opportunities.length === 0) {
    return (
      <section
        style={{
          background: "#FFFFFF", border: "1px solid #E8E8EA",
          borderRadius: "14px", padding: "48px 32px", textAlign: "center",
        }}
      >
        <div style={{
          width: "56px", height: "56px", background: "#F3F4F6",
          borderRadius: "14px", display: "inline-flex", alignItems: "center", justifyContent: "center",
          marginBottom: "16px",
        }}>
          <Search size={24} style={{ color: "#A5A7B0" }} />
        </div>
        <h2 style={{ fontSize: "18px", fontWeight: 600, color: "#272727", marginBottom: "8px" }}>
          Não encontramos oportunidades relevantes com esse filtro
        </h2>
        <p style={{ fontSize: "14px", color: "#6B7280", marginBottom: "20px" }}>
          Tente ampliar o escopo ou ajustar suas lentes.
        </p>
        <button
          onClick={onReset}
          style={{
            background: "#0C1BA8", color: "#FFFFFF", border: "none",
            borderRadius: "10px", padding: "10px 18px", fontSize: "14px",
            fontWeight: 500, cursor: "pointer",
          }}
        >
          Tentar nova análise
        </button>
      </section>
    );
  }

  const highImpact = opportunities.filter((o) => o.impact === "Alto").length;
  const tagCounts: Record<string, number> = {};
  opportunities.forEach((o) => o.tags.forEach((t) => { tagCounts[t] = (tagCounts[t] || 0) + 1; }));
  const principalTag = Object.entries(tagCounts).sort((a, b) => b[1] - a[1])[0]?.[0] ?? "Eficiência";

  return (
    <div className="grid gap-6" style={{ gridTemplateColumns: "1fr" }}>
      {/* Summary */}
      <section
        style={{
          background: "#FFFFFF", border: "1px solid #E8E8EA",
          borderRadius: "14px", padding: "20px 24px",
          display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px",
        }}
      >
        <SummaryStat icon={<TrendingUp size={18} />} label="Oportunidades encontradas" value={`${opportunities.length}`} />
        <SummaryStat icon={<Zap size={18} />} label="Potencial estimado" value="-25% tempo médio" />
        <SummaryStat icon={<BarChart3 size={18} />} label="Principal impacto" value={principalTag} />
      </section>

      {/* Matrix */}
      <section
        style={{
          background: "#FFFFFF", border: "1px solid #E8E8EA",
          borderRadius: "14px", padding: "24px",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "16px" }}>
          <h2 style={{ fontSize: "16px", fontWeight: 600, color: "#272727", margin: 0 }}>
            Matriz de Priorização
          </h2>
          <button
            onClick={onReset}
            className="hover:text-primary"
            style={{
              background: "none", border: "none", padding: 0, cursor: "pointer",
              fontSize: "13px", color: "#6B7280",
            }}
          >
            Nova análise
          </button>
        </div>
        <PrioritizationMatrix
          opportunities={opportunities}
          hoverOp={hoverOp}
          setHoverOp={setHoverOp}
          onClick={onDetails}
        />
      </section>

      {/* Cards list */}
      <section>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "12px" }}>
          <h2 style={{ fontSize: "16px", fontWeight: 600, color: "#272727", margin: 0 }}>
            Oportunidades ({opportunities.length})
          </h2>
          <span style={{ fontSize: "12px", color: "#6B7280" }}>
            {savedIds.size} salva{savedIds.size === 1 ? "" : "s"} • {highImpact} de alto impacto
          </span>
        </div>
        <div className="grid gap-4" style={{ gridTemplateColumns: "repeat(2, 1fr)" }}>
          {opportunities.map((op) => (
            <OpportunityCard
              key={op.id}
              op={op}
              saved={savedIds.has(op.id)}
              onSave={() => onSave(op)}
              onDiscard={() => onDiscard(op)}
              onDetails={() => onDetails(op)}
              highlighted={hoverOp?.id === op.id}
            />
          ))}
        </div>
      </section>
    </div>
  );
}

function SummaryStat({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
      <div style={{
        width: "40px", height: "40px", background: "#EEF0FF",
        borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center",
        color: "#0C1BA8", flexShrink: 0,
      }}>
        {icon}
      </div>
      <div>
        <div style={{ fontSize: "12px", color: "#6B7280", marginBottom: "2px" }}>{label}</div>
        <div style={{ fontSize: "16px", fontWeight: 600, color: "#272727" }}>{value}</div>
      </div>
    </div>
  );
}

/* ============================================================================
 * Prioritization matrix (custom SVG-like with absolute positioning)
 * ========================================================================== */
function PrioritizationMatrix({
  opportunities, hoverOp, setHoverOp, onClick,
}: {
  opportunities: MockOpportunity[];
  hoverOp: MockOpportunity | null;
  setHoverOp: (op: MockOpportunity | null) => void;
  onClick: (op: MockOpportunity) => void;
}) {
  const W = 100; // %
  const H = 360; // px

  return (
    <div style={{ display: "grid", gridTemplateColumns: "32px 1fr", gridTemplateRows: `${H}px 32px`, gap: "0" }}>
      {/* Y-axis label */}
      <div style={{
        gridRow: 1, gridColumn: 1,
        display: "flex", alignItems: "center", justifyContent: "center",
        writingMode: "vertical-rl", transform: "rotate(180deg)",
        fontSize: "11px", color: "#6B7280", fontWeight: 500, letterSpacing: "0.5px",
        textTransform: "uppercase",
      }}>
        Impacto →
      </div>

      {/* Plot area */}
      <div
        style={{
          gridRow: 1, gridColumn: 2,
          position: "relative", height: `${H}px`, width: `${W}%`,
          background: "linear-gradient(to top right, #F9F9F9 0%, #F9F9F9 50%, #FFFFFF 100%)",
          border: "1px solid #E8E8EA", borderRadius: "10px", overflow: "hidden",
        }}
      >
        {/* Quadrant lines */}
        <div style={{ position: "absolute", left: "50%", top: 0, bottom: 0, width: "1px", background: "#E8E8EA" }} />
        <div style={{ position: "absolute", top: "50%", left: 0, right: 0, height: "1px", background: "#E8E8EA" }} />

        {/* Quadrant labels */}
        <QuadrantLabel x="6px" y="10px" text="Quick wins" subtle="Alto impacto / Baixo esforço" highlight />
        <QuadrantLabel right="10px" y="10px" text="Grandes apostas" subtle="Alto impacto / Alto esforço" />
        <QuadrantLabel x="6px" bottom="10px" text="Tarefas rápidas" subtle="Baixo impacto / Baixo esforço" />
        <QuadrantLabel right="10px" bottom="10px" text="Reavaliar" subtle="Baixo impacto / Alto esforço" />

        {/* Points */}
        {opportunities.map((op, i) => {
          const x = effortScore[op.effort] * 100;
          const y = (1 - impactScore[op.impact]) * 100;
          const active = hoverOp?.id === op.id;
          // simple jitter to avoid overlap
          const jitterX = ((i * 37) % 11) - 5;
          const jitterY = ((i * 53) % 11) - 5;
          return (
            <button
              key={op.id}
              onMouseEnter={() => setHoverOp(op)}
              onMouseLeave={() => setHoverOp(null)}
              onClick={() => onClick(op)}
              style={{
                position: "absolute",
                left: `calc(${x}% + ${jitterX}px)`,
                top: `calc(${y}% + ${jitterY}px)`,
                transform: "translate(-50%, -50%)",
                width: active ? "20px" : "14px",
                height: active ? "20px" : "14px",
                borderRadius: "50%",
                background: "#0C1BA8",
                border: active ? "3px solid #FFFFFF" : "2px solid #FFFFFF",
                boxShadow: active ? "0 0 0 2px #0C1BA8" : "none",
                cursor: "pointer",
                padding: 0,
                transition: "all 0.15s",
                zIndex: active ? 10 : 1,
              }}
              aria-label={op.title}
            />
          );
        })}

        {/* Tooltip */}
        {hoverOp && (
          <div
            style={{
              position: "absolute",
              left: `calc(${effortScore[hoverOp.effort] * 100}% + 16px)`,
              top: `calc(${(1 - impactScore[hoverOp.impact]) * 100}% - 8px)`,
              background: "#272727", color: "#FFFFFF",
              padding: "8px 12px", borderRadius: "8px",
              fontSize: "12px", maxWidth: "240px", zIndex: 20, pointerEvents: "none",
            }}
          >
            <div style={{ fontWeight: 600, marginBottom: "4px" }}>{hoverOp.title}</div>
            <div style={{ opacity: 0.8 }}>Impacto: {hoverOp.impact} · Esforço: {hoverOp.effort}</div>
          </div>
        )}
      </div>

      {/* Bottom-left corner spacer */}
      <div style={{ gridRow: 2, gridColumn: 1 }} />
      {/* X-axis label */}
      <div style={{
        gridRow: 2, gridColumn: 2,
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: "11px", color: "#6B7280", fontWeight: 500, letterSpacing: "0.5px",
        textTransform: "uppercase",
      }}>
        Esforço →
      </div>
    </div>
  );
}

function QuadrantLabel({ text, subtle, x, y, right, bottom, highlight }: {
  text: string; subtle: string; x?: string; y?: string; right?: string; bottom?: string; highlight?: boolean;
}) {
  return (
    <div
      style={{
        position: "absolute",
        left: x, top: y, right, bottom,
        fontSize: "10px",
        color: highlight ? "#0C1BA8" : "#A5A7B0",
        fontWeight: 600, letterSpacing: "0.3px",
        textAlign: right ? "right" : "left",
        maxWidth: "140px", lineHeight: 1.3,
      }}
    >
      <div style={{ textTransform: "uppercase" }}>{text}</div>
      <div style={{ fontSize: "9px", fontWeight: 400, color: "#A5A7B0" }}>{subtle}</div>
    </div>
  );
}

/* ============================================================================
 * Opportunity card
 * ========================================================================== */
function OpportunityCard({
  op, saved, onSave, onDiscard, onDetails, highlighted,
}: {
  op: MockOpportunity;
  saved: boolean;
  onSave: () => void;
  onDiscard: () => void;
  onDetails: () => void;
  highlighted: boolean;
}) {
  const visibleProcesses = op.impactedProcesses.slice(0, 2);
  const remaining = op.impactedProcesses.length - visibleProcesses.length;

  return (
    <article
      style={{
        background: "#FFFFFF",
        border: `1px solid ${highlighted ? "#0C1BA8" : "#E8E8EA"}`,
        borderRadius: "14px", padding: "20px",
        display: "flex", flexDirection: "column", gap: "14px",
        transition: "border-color 0.15s",
      }}
    >
      <div>
        <h3 style={{ fontSize: "15px", fontWeight: 600, color: "#272727", margin: 0, marginBottom: "6px" }}>
          {op.title}
        </h3>
        <p style={{ fontSize: "13px", color: "#6B7280", margin: 0, lineHeight: 1.5 }}>
          {op.description}
        </p>
      </div>

      <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
        {op.tags.map((t) => (
          <span key={t} style={{
            fontSize: "11px", color: "#6B7280", background: "#F3F4F6",
            padding: "3px 8px", borderRadius: "4px", fontWeight: 500,
          }}>
            {t}
          </span>
        ))}
      </div>

      <div style={{
        background: "#F9F9F9", border: "1px solid #E8E8EA",
        borderRadius: "8px", padding: "10px 12px",
      }}>
        <div style={{ fontSize: "10px", fontWeight: 600, color: "#A5A7B0", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "6px" }}>
          Processos impactados
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
          {visibleProcesses.map((p) => (
            <div key={p.name} style={{ fontSize: "12px", color: "#272727", display: "flex", alignItems: "center", gap: "6px" }}>
              <span style={{
                fontSize: "9px", fontWeight: 600, color: "#0C1BA8",
                background: "#EEF0FF", padding: "1px 5px", borderRadius: "3px",
              }}>{p.level}</span>
              <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{p.name}</span>
            </div>
          ))}
          {remaining > 0 && (
            <div style={{ fontSize: "12px", color: "#6B7280" }}>+{remaining} processo{remaining > 1 ? "s" : ""}</div>
          )}
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "8px" }}>
        <Metric label="Impacto" value={op.impact} tone={op.impact === "Alto" ? "primary" : "neutral"} />
        <Metric label="Esforço" value={op.effort} tone={op.effort === "Baixo" ? "primary" : "neutral"} />
        <Metric label="Ganho" value={op.estimatedGain} tone="primary" />
      </div>

      <div style={{ display: "flex", gap: "8px", alignItems: "center", marginTop: "auto" }}>
        <button
          onClick={onSave}
          disabled={saved}
          style={{
            display: "inline-flex", alignItems: "center", gap: "6px",
            background: saved ? "#EEF0FF" : "#0C1BA8",
            color: saved ? "#0C1BA8" : "#FFFFFF",
            border: "none", borderRadius: "8px",
            padding: "8px 14px", fontSize: "13px", fontWeight: 500,
            cursor: saved ? "default" : "pointer", flex: 1, justifyContent: "center",
          }}
        >
          {saved ? <Check size={14} /> : <Bookmark size={14} />}
          {saved ? "Salva" : "Salvar"}
        </button>
        <button
          onClick={onDetails}
          className="hover:bg-[#F3F4F6]"
          style={{
            display: "inline-flex", alignItems: "center", gap: "6px",
            background: "#FFFFFF", color: "#374151",
            border: "1px solid #E8E8EA", borderRadius: "8px",
            padding: "8px 14px", fontSize: "13px", fontWeight: 500, cursor: "pointer",
          }}
        >
          <Eye size={14} /> Detalhes
        </button>
        <button
          onClick={onDiscard}
          className="hover:bg-[#F3F4F6]"
          aria-label="Descartar"
          style={{
            background: "#FFFFFF", color: "#A5A7B0",
            border: "1px solid #E8E8EA", borderRadius: "8px",
            padding: "8px", cursor: "pointer", display: "flex",
          }}
        >
          <X size={14} />
        </button>
      </div>
    </article>
  );
}

function Metric({ label, value, tone }: { label: string; value: string; tone: "primary" | "neutral" }) {
  return (
    <div style={{
      background: tone === "primary" ? "#EEF0FF" : "#F9F9F9",
      border: `1px solid ${tone === "primary" ? "#C7CEFF" : "#E8E8EA"}`,
      borderRadius: "8px", padding: "8px 10px",
    }}>
      <div style={{ fontSize: "10px", color: "#6B7280", textTransform: "uppercase", letterSpacing: "0.3px", marginBottom: "2px" }}>
        {label}
      </div>
      <div style={{ fontSize: "13px", fontWeight: 600, color: tone === "primary" ? "#0C1BA8" : "#272727" }}>
        {value}
      </div>
    </div>
  );
}

/* ============================================================================
 * Details modal
 * ========================================================================== */
function DetailsModal({
  op, onClose, onSave, saved,
}: {
  op: MockOpportunity | null;
  onClose: () => void;
  onSave: (op: MockOpportunity) => void;
  saved: boolean;
}) {
  return (
    <Dialog open={!!op} onOpenChange={(o) => !o && onClose()}>
      <DialogContent style={{ maxWidth: "640px" }}>
        {op && (
          <>
            <DialogHeader>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginBottom: "8px" }}>
                {op.tags.map((t) => (
                  <span key={t} style={{
                    fontSize: "11px", color: "#6B7280", background: "#F3F4F6",
                    padding: "3px 8px", borderRadius: "4px", fontWeight: 500,
                  }}>
                    {t}
                  </span>
                ))}
              </div>
              <DialogTitle style={{ fontSize: "20px", fontWeight: 600, color: "#272727" }}>
                {op.title}
              </DialogTitle>
            </DialogHeader>

            <div style={{ display: "flex", flexDirection: "column", gap: "20px", marginTop: "8px" }}>
              <Section title="Descrição">
                <p style={{ fontSize: "14px", color: "#374151", lineHeight: 1.6, margin: 0 }}>{op.description}</p>
              </Section>

              <Section title="Por que isso foi identificado">
                <div style={{ display: "flex", gap: "10px", padding: "12px", background: "#F0F9FF", border: "1px solid #BAE6FD", borderRadius: "8px" }}>
                  <Sparkles size={16} style={{ color: "#0369A1", flexShrink: 0, marginTop: "2px" }} />
                  <p style={{ fontSize: "13px", color: "#075985", lineHeight: 1.6, margin: 0 }}>{op.why}</p>
                </div>
              </Section>

              <Section title="Processos relacionados">
                <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                  {op.impactedProcesses.map((p) => (
                    <div key={p.name} style={{
                      display: "flex", alignItems: "center", gap: "8px",
                      padding: "8px 10px", background: "#F9F9F9",
                      border: "1px solid #E8E8EA", borderRadius: "6px",
                      fontSize: "13px",
                    }}>
                      <span style={{
                        fontSize: "10px", fontWeight: 600, color: "#0C1BA8",
                        background: "#EEF0FF", padding: "2px 6px", borderRadius: "3px",
                      }}>{p.level}</span>
                      <span style={{ color: "#272727" }}>{p.name}</span>
                    </div>
                  ))}
                </div>
              </Section>

              <Section title="Ganhos potenciais">
                <ul style={{ margin: 0, paddingLeft: "18px", color: "#374151", fontSize: "13px", lineHeight: 1.7 }}>
                  {op.potentialGains.map((g) => <li key={g}>{g}</li>)}
                </ul>
              </Section>

              <Section title="Direcionamento sugerido">
                <p style={{ fontSize: "13px", color: "#374151", lineHeight: 1.6, margin: 0 }}>{op.suggestedDirection}</p>
              </Section>

              <div style={{ display: "flex", gap: "8px", justifyContent: "flex-end", borderTop: "1px solid #E8E8EA", paddingTop: "16px" }}>
                <button
                  onClick={onClose}
                  className="hover:bg-[#F3F4F6]"
                  style={{ background: "#FFFFFF", color: "#374151", border: "1px solid #E8E8EA", borderRadius: "8px", padding: "9px 16px", fontSize: "13px", fontWeight: 500, cursor: "pointer" }}
                >
                  Fechar
                </button>
                <button
                  onClick={() => onSave(op)}
                  disabled={saved}
                  style={{
                    display: "inline-flex", alignItems: "center", gap: "6px",
                    background: saved ? "#EEF0FF" : "#0C1BA8",
                    color: saved ? "#0C1BA8" : "#FFFFFF",
                    border: "none", borderRadius: "8px",
                    padding: "9px 16px", fontSize: "13px", fontWeight: 500,
                    cursor: saved ? "default" : "pointer",
                  }}
                >
                  {saved ? <Check size={14} /> : <Bookmark size={14} />}
                  {saved ? "Salva no backlog" : "Salvar no backlog"}
                </button>
              </div>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <div style={{
        fontSize: "11px", fontWeight: 600, color: "#A5A7B0",
        letterSpacing: "0.5px", textTransform: "uppercase", marginBottom: "8px",
      }}>
        {title}
      </div>
      {children}
    </div>
  );
}

export default DiscoverOpportunities;

/* ============================================================================
 * Enrichment Section — mock AI correlation discovery before processing
 * ========================================================================== */
function EnrichmentSection({
  selected, correlated, included, setIncluded, onConfirm, onSkip, onBack,
}: {
  selected: SelectedNode[];
  correlated: CorrelatedProcess[];
  included: Set<string>;
  setIncluded: React.Dispatch<React.SetStateAction<Set<string>>>;
  onConfirm: () => void;
  onSkip: () => void;
  onBack: () => void;
}) {
  const areas = Array.from(new Set(selected.map((s) => s.breadcrumb.split(" > ")[0])));
  const correlatedAreas = Array.from(new Set(correlated.map((c) => c.name.split(" > ")[0])));
  const allAreas = Array.from(new Set([...areas, ...correlatedAreas]));
  const systems = Array.from(new Set(allAreas.flatMap((a) => SYSTEMS_BY_AREA[a] || [])));
  const includedCount = correlated.filter((c) => included.has(c.id)).length;
  const totalProcesses = selected.reduce((acc, n) => acc + n.estimatedProcesses, 0) + includedCount;

  const toggle = (id: string) => setIncluded((prev) => {
    const next = new Set(prev);
    if (next.has(id)) next.delete(id); else next.add(id);
    return next;
  });

  return (
    <div>
      <button onClick={onBack} className="hover:text-primary" style={{ background: "none", border: "none", cursor: "pointer", fontSize: "13px", color: "#6B7280", display: "inline-flex", alignItems: "center", gap: "4px", padding: 0, marginBottom: "16px" }}>
        <ArrowLeft size={14} /> Voltar à configuração
      </button>

      <div style={{ marginBottom: "20px", display: "flex", alignItems: "center", gap: "12px" }}>
        <div style={{ width: "40px", height: "40px", background: "#EEF0FF", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <GitBranch size={20} style={{ color: "#0C1BA8" }} />
        </div>
        <div>
          <h2 style={{ fontSize: "20px", fontWeight: 600, color: "#272727", margin: 0 }}>
            A IA identificou correlações na sua cadeia de valor
          </h2>
          <p style={{ fontSize: "13px", color: "#6B7280", margin: "2px 0 0 0" }}>
            Revise o que foi detectado antes de gerar as oportunidades.
          </p>
        </div>
      </div>

      <div className="grid gap-6" style={{ gridTemplateColumns: "minmax(0, 3fr) minmax(0, 2fr)", alignItems: "start" }}>
        <section style={{ background: "#FFFFFF", border: "1px solid #E8E8EA", borderRadius: "16px", padding: "20px 24px" }}>
          <h3 style={{ fontSize: "15px", fontWeight: 600, color: "#272727", margin: "0 0 14px 0" }}>
            Processos correlacionados detectados
          </h3>

          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {selected.map((s) => (
              <ProcessRow key={s.id} level={s.level === "L1" || s.level === "L2" ? "L3" : s.level as "L3" | "L4"} name={s.breadcrumb} status="scope" />
            ))}
            {correlated.map((c) => (
              <ProcessRow
                key={c.id}
                level={c.level}
                name={c.name}
                status="correlated"
                reason={c.reason}
                included={included.has(c.id)}
                onToggle={() => toggle(c.id)}
              />
            ))}
          </div>

          <div style={{ marginTop: "14px", padding: "12px 14px", background: "#F0F9FF", border: "1px solid #BAE6FD", borderRadius: "10px", fontSize: "12.5px", color: "#075985", display: "flex", alignItems: "center", gap: "8px" }}>
            <Sparkles size={14} />
            A IA detectou {correlated.length} processos adicionais correlacionados ao seu escopo. Incluí-los melhora a qualidade das oportunidades geradas.
          </div>
        </section>

        <aside style={{ position: "sticky", top: "16px", background: "#FFFFFF", border: "1px solid #E8E8EA", borderRadius: "16px", padding: "20px", display: "flex", flexDirection: "column", gap: "16px" }}>
          <h3 style={{ fontSize: "14px", fontWeight: 600, color: "#272727", margin: 0 }}>Escopo expandido</h3>

          <div style={{ background: "#EEF0FF", border: "1px solid #C7CEFF", borderRadius: "10px", padding: "12px 14px" }}>
            <div style={{ fontSize: "11px", color: "#0C1BA8", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "4px" }}>Total de processos</div>
            <div style={{ fontSize: "22px", fontWeight: 700, color: "#0C1BA8" }}>{totalProcesses}</div>
          </div>

          <div>
            <div style={{ fontSize: "11px", color: "#A5A7B0", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "8px" }}>Áreas envolvidas</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
              {allAreas.map((a) => (
                <span key={a} style={{ fontSize: "12px", color: "#0C1BA8", background: "#EEF0FF", border: "1px solid #C7CEFF", padding: "4px 10px", borderRadius: "999px", fontWeight: 500 }}>{a}</span>
              ))}
            </div>
          </div>

          <div>
            <div style={{ fontSize: "11px", color: "#A5A7B0", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "8px" }}>Sistemas possivelmente impactados</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
              {systems.map((s) => (
                <span key={s} style={{ fontSize: "11.5px", color: "#374151", background: "#F4F5F8", border: "1px solid #E8E8EA", padding: "4px 10px", borderRadius: "6px", fontWeight: 500 }}>{s}</span>
              ))}
            </div>
          </div>

          <div style={{ marginTop: "auto", paddingTop: "12px", borderTop: "1px dashed #E8E8EA", display: "flex", flexDirection: "column", gap: "8px" }}>
            <button onClick={onConfirm} style={{ background: "#0C1BA8", color: "#FFFFFF", border: "none", borderRadius: "10px", padding: "12px 18px", fontSize: "14px", fontWeight: 600, cursor: "pointer", display: "inline-flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
              <Sparkles size={14} /> Confirmar e gerar
            </button>
            <button onClick={onSkip} style={{ background: "none", border: "none", color: "#6B7280", fontSize: "12.5px", cursor: "pointer", textDecoration: "underline" }}>
              Pular esta etapa
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
}

function ProcessRow({
  level, name, status, reason, included, onToggle,
}: {
  level: "L3" | "L4";
  name: string;
  status: "scope" | "correlated";
  reason?: string;
  included?: boolean;
  onToggle?: () => void;
}) {
  const isCorrelated = status === "correlated";
  return (
    <div style={{
      display: "flex", alignItems: "center", gap: "10px",
      padding: "10px 12px", borderRadius: "8px",
      border: `1px solid ${isCorrelated ? "#FDE68A" : "#C7CEFF"}`,
      background: isCorrelated ? "#FFFBEB" : "#EEF0FF",
    }}>
      <span style={{ fontSize: "10px", fontWeight: 700, background: isCorrelated ? "#92400E" : "#0C1BA8", color: "#FFFFFF", padding: "2px 6px", borderRadius: "4px" }}>{level}</span>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: "13px", color: "#272727", fontWeight: 500 }}>{name}</div>
        {reason && <div style={{ fontSize: "11.5px", color: "#92400E", marginTop: "2px" }}>{reason}</div>}
      </div>
      <span style={{ fontSize: "10.5px", fontWeight: 700, padding: "3px 8px", borderRadius: "999px", background: isCorrelated ? "#FEF3C7" : "#FFFFFF", color: isCorrelated ? "#92400E" : "#0C1BA8", border: `1px solid ${isCorrelated ? "#FDE68A" : "#C7CEFF"}` }}>
        {isCorrelated ? "Correlacionado — fora do escopo" : "No escopo selecionado"}
      </span>
      {isCorrelated && (
        <label style={{ display: "inline-flex", alignItems: "center", gap: "6px", fontSize: "11.5px", color: "#374151", cursor: "pointer" }}>
          <input type="checkbox" checked={!!included} onChange={onToggle} style={{ accentColor: "#0C1BA8" }} />
          Incluir
        </label>
      )}
    </div>
  );
}
