import { useMemo, useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  ChevronRight, BarChart3, GitMerge, Layers, AlertTriangle, Clock, TrendingUp,
  ChevronDown, Filter, ArrowUpDown, X, Table2, PieChart as PieIcon, Grid3x3,
  ListChecks, FileText, Workflow, Sparkles, Download, FileDown, Search,
} from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip as RTooltip, ResponsiveContainer, Cell,
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar,
  ScatterChart, Scatter, ZAxis, ReferenceLine, ReferenceArea, CartesianGrid, Label,
  RadialBarChart, RadialBar,
} from "recharts";
import { Cpu, Database, ShieldCheck } from "lucide-react";
import { TopBar } from "@/components/layout/TopBar";
import { BacklogTag } from "@/components/common/BacklogTag";
import { useLanguage } from "@/contexts/LanguageContext";
import { useProcessStore, ProcessData } from "@/stores/processStore";
import { useValueChainStore } from "@/stores/valueChainStore";
import { useTaxonomy } from "@/stores/taxonomyStore";
import { usePrioritized, addPrioritized, removePrioritized } from "@/hooks/usePrioritized";
import { useSavedClusters } from "@/hooks/useSavedClusters";
import { Bookmark, BookmarkCheck, Info } from "lucide-react";

interface ProcessAnalysisProps {
  onLogout: () => void;
}

type TabKey = "executive" | "synergies" | "prioritized";
type SortKey =
  | "priority"
  | "gain"
  | "low_automation"
  | "low_data"
  | "low_compliance";
type ViewMode = "table" | "charts" | "heatmap";

type StatusKey = "critical" | "warning" | "moderate" | "good";
function statusOf(score: number): StatusKey {
  if (score < 45) return "critical";
  if (score < 60) return "warning";
  if (score < 75) return "moderate";
  return "good";
}
const STATUS_META: Record<StatusKey, { color: string; bg: string; labelPT: string; labelEN: string }> = {
  critical: { color: "#DC2626", bg: "#FEE2E2", labelPT: "Crítico", labelEN: "Critical" },
  warning:  { color: "#D97706", bg: "#FEF3C7", labelPT: "Atenção", labelEN: "Warning" },
  moderate: { color: "#0C1BA8", bg: "#EEF0FF", labelPT: "Moderado", labelEN: "Moderate" },
  good:     { color: "#15803D", bg: "#DCFCE7", labelPT: "Bom", labelEN: "Good" },
};

// Mock manual steps count for scatter bubble size
function manualStepsOf(p: ProcessData) {
  const auto = p.automation?.maturity ?? 50;
  return Math.max(1, Math.round((100 - auto) / 8));
}

const C = {
  primary: "#0C1BA8",
  primarySoft: "#EEF0FF",
  text: "#272727",
  muted: "#6B7280",
  border: "#E8E8EA",
  bg: "#F3F4F6",
  white: "#FFFFFF",
  red: "#DC2626",
  redSoft: "#FEE2E2",
  amber: "#D97706",
  amberSoft: "#FEF3C7",
  green: "#15803D",
  greenSoft: "#DCFCE7",
};

const FREQ_MULT: Record<string, number> = {
  diário: 21, diario: 21, daily: 21, contínuo: 21, continuo: 21,
  semanal: 4, weekly: 4,
  quinzenal: 2, biweekly: 2,
  mensal: 1, monthly: 1,
  trimestral: 1 / 3, quarterly: 1 / 3,
  anual: 1 / 12, annual: 1 / 12, yearly: 1 / 12,
  "sob demanda": 1, "on demand": 1,
};

function freqMultiplier(freq?: string) {
  if (!freq) return 1;
  return FREQ_MULT[freq.trim().toLowerCase()] ?? 1;
}

function avg(p: ProcessData) {
  const a = p.automation?.maturity ?? 0;
  const d = p.dataIntegrity?.maturity ?? 0;
  const g = p.governance?.maturity ?? 0;
  return Math.round((a + d + g) / 3);
}

// Composite score per spec:
// (Auto * 0.4) + (Data * 0.25) + (Compliance * 0.25) + (100 - Auto Effort) * 0.1
function compositeScore(p: ProcessData) {
  const a = p.automation?.maturity ?? 0;
  const d = p.dataIntegrity?.maturity ?? 0;
  const g = p.governance?.maturity ?? 0;
  const autoEffort = p.automation?.risk ?? 50; // "risk" here represents effort/difficulty
  return Math.round(a * 0.4 + d * 0.25 + g * 0.25 + (100 - autoEffort) * 0.1);
}

// A process has the 3 generated scores when each pillar maturity is defined.
function hasAllScores(p: ProcessData) {
  return (
    p.automation?.maturity !== undefined &&
    p.dataIntegrity?.maturity !== undefined &&
    p.governance?.maturity !== undefined
  );
}

function monthlyHours(p: ProcessData) {
  const eff = p.executionEffort ?? [];
  const perRun = eff.reduce((s, r) => s + (r.people || 0) * (r.hours || 0), 0);
  return Math.round(perRun * freqMultiplier(p.frequency));
}

export function ProcessAnalysis({ onLogout }: ProcessAnalysisProps) {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const [activeTab, setActiveTab] = useState<TabKey>("executive");

  const tabs: { key: TabKey; label: string; icon: typeof BarChart3 }[] = [
    { key: "executive", label: language === "PT" ? "Visão Executiva" : "Executive View", icon: BarChart3 },
    { key: "prioritized", label: language === "PT" ? "Priorizados & Acompanhamento" : "Prioritized & Tracking", icon: ListChecks },
    { key: "synergies", label: language === "PT" ? "Sinergias & Business Case" : "Synergies & Business Case", icon: GitMerge },
  ];

  const { ids: prioritizedIds } = usePrioritized();

  return (
    <div style={{ minHeight: "100vh", background: C.bg, display: "flex", flexDirection: "column" }}>
      <TopBar onLogout={onLogout} />
      <BacklogTag fixed />
      <main style={{ flex: 1, padding: "32px 40px 64px" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <nav style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: C.muted, marginBottom: 16 }}>
            <button onClick={() => navigate("/")} style={{ background: "none", border: "none", padding: 0, color: C.muted, cursor: "pointer", fontSize: 12 }} className="hover:text-primary">
              Home
            </button>
            <ChevronRight size={12} style={{ color: "#A5A7B0" }} />
            <span style={{ color: C.text, fontWeight: 500 }}>Command Center</span>
          </nav>

          <header style={{ marginBottom: 28 }}>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "1.2px", textTransform: "uppercase", color: C.primary, marginBottom: 8 }}>
              Process Analysis
            </div>
            <h1 style={{ fontSize: 28, fontWeight: 700, color: C.text, margin: 0, letterSpacing: "-0.4px" }}>
              {language === "PT" ? "Análise de Processos" : "Process Analysis"}
            </h1>
            <p style={{ fontSize: 14, color: C.muted, margin: "8px 0 0", maxWidth: 720, lineHeight: 1.6 }}>
              {language === "PT"
                ? "Visão consolidada da performance, sinergias e business case dos processos da organização."
                : "Consolidated view of performance, synergies and business case across organizational processes."}
            </p>
          </header>

          <div style={{ display: "flex", gap: 4, borderBottom: `1px solid ${C.border}`, marginBottom: 24 }}>
            {tabs.map((t) => {
              const active = activeTab === t.key;
              const Icon = t.icon;
              return (
                <button
                  key={t.key}
                  onClick={() => setActiveTab(t.key)}
                  style={{
                    display: "inline-flex", alignItems: "center", gap: 8, padding: "12px 18px",
                    background: "transparent", border: "none",
                    borderBottom: active ? `2px solid ${C.primary}` : "2px solid transparent",
                    marginBottom: -1, color: active ? C.primary : C.muted,
                    fontSize: 14, fontWeight: active ? 600 : 500, cursor: "pointer", transition: "all 0.15s",
                  }}
                >
                  <Icon size={16} />
                  {t.label}
                </button>
              );
            })}
          </div>

          {activeTab === "executive" && <ExecutiveView language={language} />}
          {activeTab === "synergies" && <SynergiesView language={language} />}
          {activeTab === "prioritized" && <PrioritizedView language={language} />}

          {/* Floating prioritized counter — only on Executive */}
          {activeTab === "executive" && prioritizedIds.length > 0 && (
            <button
              onClick={() => setActiveTab("prioritized")}
              style={{
                position: "fixed", bottom: 24, right: 24, zIndex: 50,
                background: C.primary, color: C.white, border: "none",
                borderRadius: 999, padding: "12px 18px",
                display: "inline-flex", alignItems: "center", gap: 10,
                fontSize: 13, fontWeight: 600, cursor: "pointer",
                boxShadow: "0 8px 24px rgba(12,27,168,0.28)",
              }}
            >
              <ListChecks size={16} />
              {prioritizedIds.length} {language === "PT" ? "processos priorizados" : "prioritized processes"}
            </button>
          )}
        </div>
      </main>
    </div>
  );
}

/* =================== EXECUTIVE VIEW =================== */
function ExecutiveView({ language }: { language: string }) {
  const allProcessesRaw = useProcessStore((s) => s.processes);
  const allProcesses = useMemo(() => allProcessesRaw.filter((p: any) => !p.isTemplate), [allProcessesRaw]);
  // Show only processes that completed the transformation pipeline (have all 3 scores)
  const processes = useMemo(() => allProcesses.filter(hasAllScores), [allProcesses]);
  const [selectedPath, setSelectedPath] = useState<string[]>([]); // [l1, l2, l3, l4]
  const [sort, setSort] = useState<SortKey>("priority");
  const [selected, setSelected] = useState<ProcessData | null>(null);

  const filtered = useMemo(() => {
    return processes.filter((p) => {
      if (selectedPath[0] && p.l1 !== selectedPath[0]) return false;
      if (selectedPath[1] && p.l2 !== selectedPath[1]) return false;
      if (selectedPath[2] && p.l3 !== selectedPath[2]) return false;
      if (selectedPath[3] && p.l4 !== selectedPath[3]) return false;
      return true;
    });
  }, [processes, selectedPath]);

  const kpis = useMemo(() => {
    // DEMO: aligned with the simulated "Documentados vs. Total por E2E" gauges
    // (IT 16/18, Operations 18/24, Hire to Retire 8/15, Finance 14/32, Source to Pay 6/28, Sem L1 2/9)
    const DEMO_MAPPED = 64;
    const DEMO_TOTAL = 126;
    const total = DEMO_MAPPED;
    const critical = filtered.filter((p) => compositeScore(p) < 45).length;
    const totalHours = filtered.reduce((s, p) => s + monthlyHours(p), 0);
    const maturityAvg = filtered.length > 0 ? Math.round(filtered.reduce((s, p) => s + avg(p), 0) / filtered.length) : 0;
    return { total, totalUniverse: DEMO_TOTAL, critical, totalHours, maturityAvg };
  }, [filtered]);

  const sorted = useMemo(() => {
    const arr = [...filtered];
    switch (sort) {
      case "priority": return arr.sort((a, b) => compositeScore(a) - compositeScore(b));
      case "gain": return arr.sort((a, b) => monthlyHours(b) - monthlyHours(a));
      case "low_automation": return arr.sort((a, b) => (a.automation?.maturity ?? 0) - (b.automation?.maturity ?? 0));
      case "low_data": return arr.sort((a, b) => (a.dataIntegrity?.maturity ?? 0) - (b.dataIntegrity?.maturity ?? 0));
      case "low_compliance": return arr.sort((a, b) => (a.governance?.maturity ?? 0) - (b.governance?.maturity ?? 0));
    }
  }, [filtered, sort]);

  return (
    <div>
      {/* KPIs */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginBottom: 20 }}>
        <KpiCard
          label={language === "PT" ? "Processos Mapeados" : "Mapped Processes"}
          value={`${kpis.total}/${kpis.totalUniverse}`}
          icon={<Layers size={18} />}
          accent={C.primary}
          accentBg={C.primarySoft}
        />
        <KpiCard
          label={language === "PT" ? "Estado Crítico" : "Critical State"}
          value={kpis.critical.toString()}
          icon={<AlertTriangle size={18} />}
          accent={C.red}
          accentBg={C.redSoft}
        />
        <KpiCard
          label={language === "PT" ? "Maturidade Média Geral" : "Overall Avg. Maturity"}
          value={`${kpis.maturityAvg}%`}
          icon={<TrendingUp size={18} />}
          accent={C.green}
          accentBg={C.greenSoft}
        />
      </div>

      {/* Documentados vs Total por E2E — logo abaixo dos KPIs */}
      <SampleSizeRow processes={allProcesses} allProcesses={allProcesses} language={language} />

      {/* Filter bar */}
      <div
        style={{
          display: "flex", gap: 12, alignItems: "center", padding: "12px 16px",
          background: C.white, border: `1px solid ${C.border}`, borderRadius: 10, marginBottom: 16,
        }}
      >
        <ValueChainTreeFilter selectedPath={selectedPath} onChange={setSelectedPath} language={language} />
        <div style={{ flex: 1 }} />
        <SortDropdown value={sort} onChange={setSort} language={language} />
      </div>

      {/* Section 1 — Overview de Scores */}
      <PillarOverview processes={filtered} language={language} />

      {/* Section 2 — Value Chain Overview */}
      <ValueChainOverview processes={filtered} language={language} />

      {/* Section 4 — Análise Comparativa (com priorização por E2E + tabela linkada) */}
      <ComparativeAnalysis processes={sorted} language={language} onSelect={setSelected} />

      {/* Drill-down drawer */}
      <ProcessDrillDrawer process={selected} onClose={() => setSelected(null)} language={language} />
    </div>
  );
}

/* =================== SECTION 3.5 — MAPPED VS UNMAPPED BY E2E =================== */
function MappedVsUnmappedSection({ allProcesses, language }: { allProcesses: ProcessData[]; language: string }) {
  const data = useMemo(() => {
    const map = new Map<string, { mapped: number; unmapped: number }>();
    allProcesses.forEach((p) => {
      const k = p.l1 || (language === "PT" ? "Sem L1" : "No L1");
      if (!map.has(k)) map.set(k, { mapped: 0, unmapped: 0 });
      const e = map.get(k)!;
      if (hasAllScores(p)) e.mapped += 1;
      else e.unmapped += 1;
    });
    return Array.from(map.entries())
      .map(([name, v]) => ({ name, ...v, total: v.mapped + v.unmapped }))
      .sort((a, b) => b.total - a.total);
  }, [allProcesses, language]);

  if (data.length === 0) return null;

  return (
    <div style={{ marginBottom: 24 }}>
      <ExecSectionTitle title={language === "PT" ? "Mapeados vs. Não Mapeados por E2E" : "Mapped vs. Unmapped by E2E"} />
      <div style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: 10, padding: 18 }}>
        <div style={{ display: "flex", gap: 14, marginBottom: 10, fontSize: 11, color: C.muted }}>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
            <span style={{ width: 10, height: 10, background: C.primary, borderRadius: 2 }} />
            {language === "PT" ? "Mapeados (com 3 notas)" : "Mapped (3 scores)"}
          </span>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
            <span style={{ width: 10, height: 10, background: "#E5E7EB", borderRadius: 2 }} />
            {language === "PT" ? "Não Mapeados / Pendentes" : "Unmapped / Pending"}
          </span>
        </div>
        <div style={{ height: Math.max(180, data.length * 44) }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} layout="vertical" margin={{ top: 8, right: 24, left: 8, bottom: 8 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" horizontal={false} />
              <XAxis type="number" tick={{ fontSize: 10, fill: C.muted }} />
              <YAxis dataKey="name" type="category" tick={{ fontSize: 11, fill: C.text }} width={150} />
              <RTooltip
                contentStyle={{ fontSize: 12, borderRadius: 6 }}
                content={({ active, payload, label }: any) => {
                  if (!active || !payload?.length) return null;
                  const d = payload[0].payload;
                  const pct = d.total > 0 ? Math.round((d.mapped / d.total) * 100) : 0;
                  return (
                    <div style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: 6, padding: "8px 10px", fontSize: 12 }}>
                      <div style={{ fontWeight: 600, marginBottom: 4 }}>{label}</div>
                      <div style={{ color: C.muted }}>{language === "PT" ? "Mapeados" : "Mapped"}: <b style={{ color: C.primary }}>{d.mapped}</b></div>
                      <div style={{ color: C.muted }}>{language === "PT" ? "Não Mapeados" : "Unmapped"}: <b style={{ color: C.text }}>{d.unmapped}</b></div>
                      <div style={{ color: C.muted, marginTop: 4 }}>{language === "PT" ? "Cobertura" : "Coverage"}: <b style={{ color: C.text }}>{pct}%</b></div>
                    </div>
                  );
                }}
              />
              <Bar dataKey="mapped" stackId="a" fill={C.primary} />
              <Bar dataKey="unmapped" stackId="a" fill="#E5E7EB" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

/* =================== SECTION 4 — COMPARATIVE ANALYSIS =================== */
type CompMode = "quadrants" | "ranking" | "heatmap";

function ComparativeAnalysis({ processes, language, onSelect }: { processes: ProcessData[]; language: string; onSelect: (p: ProcessData) => void }) {
  const [mode, setMode] = useState<CompMode>("quadrants");
  const opts: { key: CompMode; labelPT: string; labelEN: string; icon: React.ReactNode }[] = [
    { key: "quadrants", labelPT: "Quadrantes", labelEN: "Quadrants", icon: <Grid3x3 size={14} /> },
    { key: "ranking", labelPT: "Ranking", labelEN: "Ranking", icon: <Table2 size={14} /> },
    { key: "heatmap", labelPT: "Heatmap", labelEN: "Heatmap", icon: <PieIcon size={14} /> },
  ];

  return (
    <div style={{ marginTop: 28 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
        <div>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "1.2px", textTransform: "uppercase", color: C.muted, marginBottom: 4 }}>
            {language === "PT" ? "Análise" : "Analysis"}
          </div>
          <h2 style={{ fontSize: 18, fontWeight: 700, color: C.text, margin: 0, letterSpacing: "-0.3px" }}>
            {language === "PT" ? "Análise Comparativa" : "Comparative Analysis"}
          </h2>
        </div>
        <div style={{ display: "inline-flex", background: C.white, border: `1px solid ${C.border}`, borderRadius: 8, padding: 3 }}>
          {opts.map((o) => {
            const active = mode === o.key;
            return (
              <button
                key={o.key}
                onClick={() => setMode(o.key)}
                style={{
                  display: "inline-flex", alignItems: "center", gap: 6, padding: "7px 12px",
                  background: active ? C.primary : "transparent",
                  color: active ? C.white : C.text, border: "none", borderRadius: 6,
                  fontSize: 12.5, fontWeight: active ? 600 : 500, cursor: "pointer",
                }}
              >
                {o.icon}
                {language === "PT" ? o.labelPT : o.labelEN}
              </button>
            );
          })}
        </div>
      </div>

      {mode === "quadrants" && <QuadrantsView processes={processes} language={language} onSelect={onSelect} />}
      {mode === "ranking" && <ProcessTable processes={processes} language={language} onSelect={onSelect} />}
      {mode === "heatmap" && <HeatmapView processes={processes} language={language} onSelect={onSelect} />}
    </div>
  );
}

/* ---- Quadrants (L2 & L3 scatter plots) ---- */
function QuadrantPlot({
  title, subtitle, points, language, selectedName, onSelectGroup,
}: {
  title: string;
  subtitle: string;
  points: { name: string; x: number; y: number; count: number; processes: ProcessData[] }[];
  language: string;
  selectedName?: string | null;
  onSelectGroup: (name: string | null) => void;
}) {
  const labels = language === "PT"
    ? { tl: "PRIORIDADE MÁXIMA", tr: "MONITORAR", bl: "OPORTUNIDADE", br: "EFICIENTE" }
    : { tl: "TOP PRIORITY", tr: "MONITOR", bl: "OPPORTUNITY", br: "EFFICIENT" };

  const data = points.map((p) => ({ ...p, z: p.count }));

  return (
    <div style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: 10, padding: 18 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
        <div>
          <div style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: "1px", textTransform: "uppercase", color: C.primary }}>{title}</div>
          <div style={{ fontSize: 12, color: C.muted, marginTop: 2 }}>{subtitle}</div>
        </div>
        {selectedName && (
          <button
            onClick={() => onSelectGroup(null)}
            style={{ fontSize: 11, padding: "5px 10px", background: C.primarySoft, color: C.primary, border: "none", borderRadius: 6, fontWeight: 600, cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 6 }}
          >
            <X size={11} /> {selectedName}
          </button>
        )}
      </div>
      <div style={{ position: "relative", height: 320 }}>
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart margin={{ top: 16, right: 24, left: 12, bottom: 24 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" />
            <XAxis type="number" dataKey="x" domain={[0, 100]} tick={{ fontSize: 10, fill: C.muted }}>
              <Label value={language === "PT" ? "Maturidade (Low → High)" : "Maturity (Low → High)"} position="insideBottom" offset={-8} style={{ fontSize: 10, fill: C.muted }} />
            </XAxis>
            <YAxis type="number" dataKey="y" domain={[0, 100]} tick={{ fontSize: 10, fill: C.muted }}>
              <Label value={language === "PT" ? "Impacto/Criticidade" : "Impact/Criticality"} angle={-90} position="insideLeft" style={{ fontSize: 10, fill: C.muted }} />
            </YAxis>
            <ZAxis type="number" dataKey="z" range={[80, 600]} />

            {/* Quadrant background colors — clipped inside plot area */}
            <ReferenceArea x1={0} x2={50} y1={50} y2={100} fill="#FCE7F3" fillOpacity={0.55} stroke="none"
              label={{ value: `↖ ${labels.tl}`, position: "insideTopLeft", fill: "#9D174D", fontSize: 9.5, fontWeight: 700 }} />
            <ReferenceArea x1={50} x2={100} y1={50} y2={100} fill="#FEF3C7" fillOpacity={0.55} stroke="none"
              label={{ value: `↗ ${labels.tr}`, position: "insideTopRight", fill: "#92400E", fontSize: 9.5, fontWeight: 700 }} />
            <ReferenceArea x1={0} x2={50} y1={0} y2={50} fill="#FEF9E7" fillOpacity={0.55} stroke="none"
              label={{ value: `↙ ${labels.bl}`, position: "insideBottomLeft", fill: "#854D0E", fontSize: 9.5, fontWeight: 700 }} />
            <ReferenceArea x1={50} x2={100} y1={0} y2={50} fill="#DCFCE7" fillOpacity={0.55} stroke="none"
              label={{ value: `↘ ${labels.br}`, position: "insideBottomRight", fill: "#14532D", fontSize: 9.5, fontWeight: 700 }} />

            <ReferenceLine x={50} stroke="#A5A7B0" strokeDasharray="4 4" />
            <ReferenceLine y={50} stroke="#A5A7B0" strokeDasharray="4 4" />
            <RTooltip
              cursor={{ strokeDasharray: "3 3" }}
              contentStyle={{ fontSize: 12, borderRadius: 6 }}
              content={({ active, payload }: any) => {
                if (!active || !payload?.length) return null;
                const d = payload[0].payload;
                return (
                  <div style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: 6, padding: "8px 10px", fontSize: 12 }}>
                    <div style={{ fontWeight: 600, color: C.text, marginBottom: 4 }}>{d.name}</div>
                    <div style={{ color: C.muted }}>{language === "PT" ? "Score médio" : "Avg score"}: <b style={{ color: C.text }}>{d.x}</b></div>
                    <div style={{ color: C.muted }}>{language === "PT" ? "Impacto" : "Impact"}: <b style={{ color: C.text }}>{d.y}</b></div>
                    <div style={{ color: C.muted }}>{language === "PT" ? "Processos" : "Processes"}: <b style={{ color: C.text }}>{d.count}</b></div>
                    <div style={{ color: C.primary, marginTop: 4, fontSize: 11 }}>
                      {language === "PT" ? "Clique para filtrar a tabela" : "Click to filter the table"}
                    </div>
                  </div>
                );
              }}
            />
            <Scatter
              data={data}
              onClick={(d: any) => {
                if (!d?.name) return;
                onSelectGroup(selectedName === d.name ? null : d.name);
              }}
            >
              {data.map((d, i) => {
                const high = d.y >= 50;
                const low = d.x < 50;
                const fill = high && low ? "#DB2777" : high && !low ? "#D97706" : !high && low ? "#CA8A04" : "#15803D";
                const isSel = selectedName === d.name;
                const dim = !!selectedName && !isSel;
                return (
                  <Cell
                    key={i}
                    fill={fill}
                    fillOpacity={dim ? 0.25 : 0.85}
                    stroke={isSel ? C.text : C.white}
                    strokeWidth={isSel ? 2.5 : 1.5}
                    cursor="pointer"
                  />
                );
              })}
            </Scatter>
          </ScatterChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

function QuadrantsView({ processes, language, onSelect }: { processes: ProcessData[]; language: string; onSelect: (p: ProcessData) => void }) {
  const { label: lvl, maxLevel } = useTaxonomy();
  const hasL3 = maxLevel >= 3;
  const [e2e, setE2e] = useState<string>("__all__");
  const [selL2, setSelL2] = useState<string | null>(null);
  const [selL3, setSelL3] = useState<string | null>(null);

  const e2eOptions = useMemo(() => {
    const set = new Set<string>();
    processes.forEach((p) => p.l1 && set.add(p.l1));
    return Array.from(set).sort();
  }, [processes]);

  useEffect(() => { setSelL2(null); setSelL3(null); }, [e2e]);

  const scoped = useMemo(() => {
    return e2e === "__all__" ? processes : processes.filter((p) => p.l1 === e2e);
  }, [processes, e2e]);

  const buildPoints = (arr: ProcessData[], key: "l2" | "l3") => {
    const groups = new Map<string, ProcessData[]>();
    arr.forEach((p) => {
      const k = (p as any)[key];
      if (!k) return;
      if (!groups.has(k)) groups.set(k, []);
      groups.get(k)!.push(p);
    });
    const points: { name: string; x: number; y: number; count: number; processes: ProcessData[] }[] = [];
    groups.forEach((items, name) => {
      const x = Math.round(items.reduce((s, p) => s + compositeScore(p), 0) / items.length);
      const totalH = items.reduce((s, p) => s + monthlyHours(p), 0);
      const y = Math.max(8, Math.min(100, Math.round((totalH / 200) * 100)));
      points.push({ name, x, y, count: items.length, processes: items });
    });
    return points;
  };

  const l2Points = useMemo(() => buildPoints(scoped, "l2"), [scoped]);
  const l3Points = useMemo(() => buildPoints(scoped, "l3"), [scoped]);

  const tableProcesses = useMemo(() => {
    let arr = scoped;
    if (selL2) arr = arr.filter((p) => p.l2 === selL2);
    if (selL3) arr = arr.filter((p) => p.l3 === selL3);
    return [...arr].sort((a, b) => compositeScore(a) - compositeScore(b));
  }, [scoped, selL2, selL3]);

  if (processes.length === 0) return <EmptyState language={language} />;

  return (
    <div style={{ display: "grid", gap: 16 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 14px", background: C.white, border: `1px solid ${C.border}`, borderRadius: 8 }}>
        <Filter size={14} style={{ color: C.muted }} />
        <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.8px", textTransform: "uppercase", color: C.muted }}>
          {language === "PT" ? "Filtrar matriz por E2E" : "Filter matrix by E2E"}
        </span>
        <select
          value={e2e}
          onChange={(e) => setE2e(e.target.value)}
          style={{ padding: "6px 10px", border: `1px solid ${C.border}`, borderRadius: 6, fontSize: 12.5, color: C.text, background: C.white, cursor: "pointer" }}
        >
          <option value="__all__">{language === "PT" ? "Todos os E2E" : "All E2E"}</option>
          {e2eOptions.map((l1) => <option key={l1} value={l1}>{l1}</option>)}
        </select>
        <div style={{ flex: 1 }} />
        {(selL2 || selL3) && (
          <button
            onClick={() => { setSelL2(null); setSelL3(null); }}
            style={{ fontSize: 11, padding: "5px 10px", background: "transparent", color: C.primary, border: `1px solid ${C.primary}`, borderRadius: 6, fontWeight: 600, cursor: "pointer" }}
          >
            {language === "PT" ? "Limpar seleção" : "Clear selection"}
          </button>
        )}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: hasL3 ? "1fr 1fr" : "1fr", gap: 16 }}>
        <QuadrantPlot
          title={`${lvl("l2")} Value Chain`}
          subtitle={language === "PT" ? `Maturidade vs. Impacto por ${lvl("l2")} — clique para filtrar` : `Maturity vs. Impact per ${lvl("l2")} — click to filter`}
          points={l2Points}
          language={language}
          selectedName={selL2}
          onSelectGroup={(n) => { setSelL2(n); if (n) setSelL3(null); }}
        />
        {hasL3 && (
          <QuadrantPlot
            title={`${lvl("l3")} Value Chain`}
            subtitle={language === "PT" ? `Maturidade vs. Impacto por ${lvl("l3")} — granularidade fina` : `Maturity vs. Impact per ${lvl("l3")} — fine granularity`}
            points={l3Points}
            language={language}
            selectedName={selL3}
            onSelectGroup={(n) => { setSelL3(n); if (n) setSelL2(null); }}
          />
        )}
      </div>

      <div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "1px", textTransform: "uppercase", color: C.text }}>
            {language === "PT" ? "Processos" : "Processes"}
            <span style={{ marginLeft: 8, color: C.muted, fontWeight: 500, textTransform: "none", letterSpacing: 0 }}>
              ({tableProcesses.length}
              {selL2 ? ` · ${lvl("l2")}: ${selL2}` : ""}
              {selL3 ? ` · ${lvl("l3")}: ${selL3}` : ""}
              {e2e !== "__all__" ? ` · E2E: ${e2e}` : ""})
            </span>
          </div>
        </div>
        <ProcessTable processes={tableProcesses} language={language} onSelect={onSelect} showL4 />
      </div>
    </div>
  );
}


/* =================== SECTION 1 — PILLAR OVERVIEW =================== */
function pillarColor(score: number) {
  if (score >= 70) return C.green;
  if (score >= 40) return C.amber;
  return C.red;
}
function pillarBg(score: number) {
  if (score >= 70) return C.greenSoft;
  if (score >= 40) return C.amberSoft;
  return C.redSoft;
}
function fmtScore(n: number) {
  return (Math.round(n * 100) / 100).toFixed(2).replace(".", ",");
}

function PillarCard({
  label, icon, maturity, secondaryLabel, secondaryValue,
}: {
  label: string; icon: React.ReactNode; maturity: number;
  secondaryLabel: string; secondaryValue: number;
}) {
  const color = pillarColor(maturity);
  const bg = pillarBg(maturity);
  return (
    <div style={{
      background: C.white, border: `1px solid ${C.border}`, borderLeft: `4px solid ${color}`,
      borderRadius: 10, padding: 20, position: "relative",
    }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
        <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "1.2px", textTransform: "uppercase", color: C.muted }}>
          {label}
        </div>
        <div style={{ width: 32, height: 32, borderRadius: 8, background: bg, color, display: "flex", alignItems: "center", justifyContent: "center" }}>
          {icon}
        </div>
      </div>
      <div style={{ fontSize: 11, color: C.muted, marginBottom: 4 }}>Maturidade Média</div>
      <div style={{ display: "flex", alignItems: "baseline", gap: 6, marginBottom: 14 }}>
        <span style={{ fontSize: 32, fontWeight: 700, color, letterSpacing: "-0.6px", lineHeight: 1 }}>{fmtScore(maturity)}</span>
        <span style={{ fontSize: 13, color: C.muted, fontWeight: 500 }}>/100</span>
      </div>
      <div style={{ paddingTop: 12, borderTop: `1px solid ${C.border}` }}>
        <div style={{ fontSize: 10.5, color: C.muted, textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: 4 }}>{secondaryLabel}</div>
        <div style={{ fontSize: 18, fontWeight: 600, color: C.text }}>{fmtScore(secondaryValue)}<span style={{ fontSize: 11, color: C.muted, fontWeight: 500 }}> /100</span></div>
      </div>
    </div>
  );
}

function PillarOverview({ processes, language }: { processes: ProcessData[]; language: string }) {
  const stats = useMemo(() => {
    const n = processes.length || 1;
    const sum = (fn: (p: ProcessData) => number) => processes.reduce((s, p) => s + fn(p), 0) / n;
    return {
      autoM: sum((p) => p.automation?.maturity ?? 0),
      autoR: sum((p) => p.automation?.risk ?? 0),
      dataM: sum((p) => p.dataIntegrity?.maturity ?? 0),
      dataR: sum((p) => p.dataIntegrity?.risk ?? 0),
      compM: sum((p) => p.governance?.maturity ?? 0),
      compR: sum((p) => p.governance?.risk ?? 0),
    };
  }, [processes]);

  return (
    <div style={{ marginBottom: 24 }}>
      <ExecSectionTitle title={language === "PT" ? "Overview de Scores" : "Scores Overview"} />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
        <PillarCard
          label={language === "PT" ? "Automação" : "Automation"}
          icon={<Cpu size={18} />}
          maturity={stats.autoM}
          secondaryLabel={language === "PT" ? "Score de Esforço Médio" : "Avg Effort Score"}
          secondaryValue={stats.autoR}
        />
        <PillarCard
          label="Data Integrity"
          icon={<Database size={18} />}
          maturity={stats.dataM}
          secondaryLabel={language === "PT" ? "Risco Médio" : "Avg Risk"}
          secondaryValue={stats.dataR}
        />
        <PillarCard
          label="Compliance"
          icon={<ShieldCheck size={18} />}
          maturity={stats.compM}
          secondaryLabel={language === "PT" ? "Risco Médio" : "Avg Risk"}
          secondaryValue={stats.compR}
        />
      </div>
    </div>
  );
}

function ExecSectionTitle({ title }: { title: string }) {
  return (
    <h2 style={{ fontSize: 13, fontWeight: 700, color: C.text, textTransform: "uppercase", letterSpacing: "1px", margin: "0 0 12px" }}>
      {title}
    </h2>
  );
}

/* =================== SECTION 2 — VALUE CHAIN OVERVIEW =================== */
function ValueChainOverview({ processes, language }: { processes: ProcessData[]; language: string }) {
  const groups = useMemo(() => {
    const map = new Map<string, ProcessData[]>();
    processes.forEach((p) => {
      const k = p.l1 || (language === "PT" ? "Sem L1" : "No L1");
      if (!map.has(k)) map.set(k, []);
      map.get(k)!.push(p);
    });
    return Array.from(map.entries()).map(([l1, items]) => {
      const n = items.length;
      const a = items.reduce((s, p) => s + (p.automation?.maturity ?? 0), 0) / n;
      const d = items.reduce((s, p) => s + (p.dataIntegrity?.maturity ?? 0), 0) / n;
      const g = items.reduce((s, p) => s + (p.governance?.maturity ?? 0), 0) / n;
      return { l1, count: n, automation: a, data: d, governance: g };
    });
  }, [processes, language]);

  if (groups.length === 0) return null;

  return (
    <div style={{ marginBottom: 24 }}>
      <ExecSectionTitle title="Value Chain Overview" />
      <div style={{
        display: "grid", gridTemplateColumns: `repeat(${groups.length}, minmax(0, 1fr))`, gap: 10,
      }}>
        {groups.map((g) => (
          <div key={g.l1} style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: 10, padding: "10px 12px", minWidth: 0 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: C.text, textTransform: "uppercase", letterSpacing: "0.6px", marginBottom: 8, paddingBottom: 6, borderBottom: `1px solid ${C.border}`, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
              {g.l1}
            </div>
            <PillarRow label="Gov." score={g.governance} />
            <PillarRow label="Data" score={g.data} />
            <PillarRow label="Auto." score={g.automation} />
          </div>
        ))}
      </div>
    </div>
  );
}

function PillarRow({ label, score }: { label: string; score: number }) {
  const color = pillarColor(score);
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "3px 0" }}>
      <span style={{ width: 7, height: 7, borderRadius: "50%", background: color, flexShrink: 0 }} />
      <span style={{ fontSize: 11.5, color: C.text, flex: 1, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{label}</span>
      <span style={{ fontSize: 12, fontWeight: 700, color }}>{fmtScore(score)}</span>
    </div>
  );
}

/* =================== SECTION 3 — SAMPLE SIZE =================== */
function SampleSizeRow({ processes, allProcesses, language }: {
  processes: ProcessData[]; allProcesses: ProcessData[]; language: string;
}) {
  const groups = useMemo(() => {
    // For each L1 in filtered processes, evaluated = count, expected = total in allProcesses for same L1
    const filteredMap = new Map<string, number>();
    processes.forEach((p) => {
      const k = p.l1 || (language === "PT" ? "Sem L1" : "No L1");
      filteredMap.set(k, (filteredMap.get(k) ?? 0) + 1);
    });
    const expectedMap = new Map<string, number>();
    allProcesses.forEach((p) => {
      const k = p.l1 || (language === "PT" ? "Sem L1" : "No L1");
      expectedMap.set(k, (expectedMap.get(k) ?? 0) + 1);
    });

    // DEMO: simulated (evaluated, total) per E2E to illustrate the gauge color dynamic
    // (green ≥70%, amber 40-69%, red <40%). Overrides real counts for the prototype.
    const demo: Record<string, { evaluated: number; expected: number }> = {
      "IT Services":      { evaluated: 16, expected: 18 }, // 89% green
      "Operations":       { evaluated: 18, expected: 24 }, // 75% green
      "Hire to Retire":   { evaluated: 8,  expected: 15 }, // 53% amber
      "Finance":          { evaluated: 14, expected: 32 }, // 44% amber
      "Source to Pay":    { evaluated: 6,  expected: 28 }, // 21% red
      "Order to Cash":    { evaluated: 15, expected: 22 }, // 68% amber
      "Record to Report": { evaluated: 11, expected: 14 }, // 79% green
      "Sem L1":           { evaluated: 2,  expected: 9 },  // 22% red
      "No L1":            { evaluated: 2,  expected: 9 },
    };
    const fallback = [
      { evaluated: 12, expected: 14 }, // 86% green
      { evaluated: 5,  expected: 12 }, // 42% amber
      { evaluated: 4,  expected: 20 }, // 20% red
      { evaluated: 18, expected: 22 }, // 82% green
      { evaluated: 7,  expected: 16 }, // 44% amber
    ];

    return Array.from(filteredMap.entries()).map(([l1, evaluated], idx) => {
      const sim = demo[l1] ?? fallback[idx % fallback.length];
      return { l1, evaluated: sim.evaluated, expected: sim.expected };
    });
  }, [processes, allProcesses, language]);

  if (groups.length === 0) return null;

  return (
    <div style={{ marginBottom: 24 }}>
      <ExecSectionTitle title={language === "PT" ? "Documentados vs. Total por E2E" : "Documented vs. Total by E2E"} />
      <div style={{
        background: C.white, border: `1px solid ${C.border}`, borderRadius: 10, padding: 18,
        display: "grid", gridTemplateColumns: `repeat(${groups.length}, minmax(0, 1fr))`, gap: 12,
      }}>
        {groups.map((g) => <SampleGauge key={g.l1} {...g} language={language} />)}
      </div>
    </div>
  );
}

function SampleGauge({ l1, evaluated, expected, language }: {
  l1: string; evaluated: number; expected: number; language: string;
}) {
  const pct = expected > 0 ? Math.min(100, Math.round((evaluated / expected) * 100)) : 0;
  const color = pillarColor(pct);
  const data = [{ name: l1, value: pct, fill: color }];
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "8px 4px" }}>
      <div style={{ width: 130, height: 100, position: "relative" }}>
        <ResponsiveContainer width="100%" height="100%">
          <RadialBarChart
            cx="50%" cy="85%" innerRadius="80%" outerRadius="140%"
            barSize={12} data={data} startAngle={180} endAngle={0}
          >
            <PolarAngleAxis type="number" domain={[0, 100]} tick={false} />
            <RadialBar background={{ fill: "#F0F1F5" }} dataKey="value" cornerRadius={6} />
          </RadialBarChart>
        </ResponsiveContainer>
        <div style={{
          position: "absolute", inset: 0, display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "flex-end", paddingBottom: 4, pointerEvents: "none",
        }}>
          <div style={{ fontSize: 18, fontWeight: 700, color, lineHeight: 1 }}>{evaluated}<span style={{ fontSize: 12, color: C.muted, fontWeight: 500 }}>/{expected}</span></div>
          <div style={{ fontSize: 10, color: C.muted, marginTop: 2 }}>{pct}%</div>
        </div>
      </div>
      <div style={{ fontSize: 11.5, fontWeight: 600, color: C.text, marginTop: 6, textAlign: "center", textTransform: "uppercase", letterSpacing: "0.6px", maxWidth: 160, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
        {l1}
      </div>
      <div style={{ fontSize: 10, color: C.muted, marginTop: 2 }}>
        {language === "PT" ? "documentados / total" : "documented / total"}
      </div>
    </div>
  );
}

/* =================== VIEW MODE TOGGLE =================== */
function ViewModeToggle({ value, onChange, language }: { value: ViewMode; onChange: (v: ViewMode) => void; language: string }) {
  const opts: { key: ViewMode; label: string; icon: typeof Table2 }[] = [
    { key: "table", label: language === "PT" ? "Tabela" : "Table", icon: Table2 },
    { key: "charts", label: language === "PT" ? "Gráficos" : "Charts", icon: PieIcon },
    { key: "heatmap", label: "Heatmap", icon: Grid3x3 },
  ];
  return (
    <div style={{ display: "inline-flex", background: C.white, border: `1px solid ${C.border}`, borderRadius: 8, padding: 3, marginBottom: 16 }}>
      {opts.map((o) => {
        const active = value === o.key;
        const Icon = o.icon;
        return (
          <button
            key={o.key}
            onClick={() => onChange(o.key)}
            style={{
              display: "inline-flex", alignItems: "center", gap: 6,
              padding: "7px 14px", fontSize: 13, fontWeight: active ? 600 : 500,
              background: active ? C.primary : "transparent",
              color: active ? C.white : C.muted,
              border: "none", borderRadius: 6, cursor: "pointer", transition: "all 0.15s",
            }}
          >
            <Icon size={14} /> {o.label}
          </button>
        );
      })}
    </div>
  );
}

/* =================== KPI CARD =================== */
function KpiCard({ label, value, icon, accent, accentBg }: {
  label: string; value: string; icon: React.ReactNode; accent: string; accentBg: string;
}) {
  return (
    <div style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: 10, padding: 18, position: "relative" }}>
      <div style={{ position: "absolute", top: 14, right: 14, width: 30, height: 30, borderRadius: 8, background: accentBg, color: accent, display: "flex", alignItems: "center", justifyContent: "center" }}>
        {icon}
      </div>
      <div style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: "1px", textTransform: "uppercase", color: C.muted, marginBottom: 10 }}>
        {label}
      </div>
      <div style={{ fontSize: 28, fontWeight: 700, color: accent, lineHeight: 1.1, letterSpacing: "-0.5px" }}>
        {value}
      </div>
    </div>
  );
}

/* =================== TREE FILTER =================== */
function ValueChainTreeFilter({
  selectedPath, onChange, language,
}: { selectedPath: string[]; onChange: (p: string[]) => void; language: string }) {
  const l1Processes = useValueChainStore((s) => s.l1Processes);
  const processes = useProcessStore((s) => s.processes);
  const [open, setOpen] = useState(false);
  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  const ref = useRef<HTMLDivElement>(null);

  // Build tree from valueChainStore (Architecture module) when available,
  // falling back to whatever L1-L4 the processes themselves declare.
  const tree = useMemo(() => {
    const t: Record<string, Record<string, Record<string, Set<string>>>> = {};
    if (l1Processes && l1Processes.length > 0) {
      l1Processes.forEach((l1) => {
        const l1n = (l1 as any).nameEN || l1.name;
        t[l1n] ??= {};
        l1.l2Processes.forEach((l2) => {
          t[l1n][l2.name] ??= {};
          l2.l3Processes.forEach((l3) => {
            t[l1n][l2.name][l3.name] ??= new Set();
            l3.l4Tasks.forEach((l4) => t[l1n][l2.name][l3.name].add(l4.name));
          });
        });
      });
    }
    // Merge any L1-L4 from existing processes so legacy items are still filterable
    processes.forEach((p) => {
      if (!p.l1) return;
      t[p.l1] ??= {};
      if (!p.l2) return;
      t[p.l1][p.l2] ??= {};
      if (!p.l3) return;
      t[p.l1][p.l2][p.l3] ??= new Set();
      if (p.l4) t[p.l1][p.l2][p.l3].add(p.l4);
    });
    return t;
  }, [l1Processes, processes]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const toggleExpand = (key: string) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      next.has(key) ? next.delete(key) : next.add(key);
      return next;
    });
  };

  const select = (path: string[]) => {
    onChange(path);
    setOpen(false);
  };

  const clear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange([]);
  };

  const breadcrumb = selectedPath.length > 0
    ? selectedPath.join(" › ")
    : (language === "PT" ? "Toda a cadeia de valor" : "Entire value chain");

  return (
    <div ref={ref} style={{ position: "relative", minWidth: 320 }}>
      <button
        onClick={() => setOpen((v) => !v)}
        style={{
          display: "flex", alignItems: "center", gap: 10, width: "100%",
          padding: "9px 12px", background: C.white, border: `1px solid ${C.border}`,
          borderRadius: 8, cursor: "pointer", fontSize: 13, color: C.text, textAlign: "left",
        }}
      >
        <Filter size={14} style={{ color: C.primary, flexShrink: 0 }} />
        <span style={{ flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", color: selectedPath.length > 0 ? C.text : C.muted }}>
          {breadcrumb}
        </span>
        {selectedPath.length > 0 && (
          <X size={14} style={{ color: C.muted }} onClick={clear} />
        )}
        <ChevronDown size={14} style={{ color: C.muted }} />
      </button>

      {open && (
        <div
          style={{
            position: "absolute", top: "calc(100% + 4px)", left: 0, zIndex: 50,
            minWidth: 380, maxHeight: 380, overflowY: "auto",
            background: C.white, border: `1px solid ${C.border}`, borderRadius: 10,
            boxShadow: "0 8px 24px rgba(0,0,0,0.08)", padding: 6,
          }}
        >
          <button
            onClick={() => select([])}
            style={{
              display: "flex", alignItems: "center", width: "100%", padding: "8px 10px",
              background: selectedPath.length === 0 ? C.primarySoft : "transparent",
              border: "none", borderRadius: 6, cursor: "pointer", fontSize: 13,
              color: selectedPath.length === 0 ? C.primary : C.text, fontWeight: 500,
            }}
          >
            {language === "PT" ? "Toda a cadeia de valor" : "Entire value chain"}
          </button>
          {Object.keys(tree).length === 0 && (
            <div style={{ padding: 12, fontSize: 12, color: C.muted }}>
              {language === "PT" ? "Nenhuma cadeia de valor disponível." : "No value chain available."}
            </div>
          )}
          {Object.entries(tree).map(([l1, l2s]) => (
            <TreeNode
              key={l1}
              label={l1}
              level={0}
              isExpanded={expanded.has(l1)}
              onToggle={() => toggleExpand(l1)}
              isSelected={selectedPath.join("/") === l1}
              onSelect={() => select([l1])}
              hasChildren={Object.keys(l2s).length > 0}
            >
              {expanded.has(l1) && Object.entries(l2s).map(([l2, l3s]) => {
                const k2 = `${l1}/${l2}`;
                return (
                  <TreeNode
                    key={k2}
                    label={l2}
                    level={1}
                    isExpanded={expanded.has(k2)}
                    onToggle={() => toggleExpand(k2)}
                    isSelected={selectedPath.join("/") === `${l1}/${l2}`}
                    onSelect={() => select([l1, l2])}
                    hasChildren={Object.keys(l3s).length > 0}
                  >
                    {expanded.has(k2) && Object.entries(l3s).map(([l3, l4Set]) => {
                      const k3 = `${l1}/${l2}/${l3}`;
                      return (
                        <TreeNode
                          key={k3}
                          label={l3}
                          level={2}
                          isExpanded={expanded.has(k3)}
                          onToggle={() => toggleExpand(k3)}
                          isSelected={selectedPath.join("/") === `${l1}/${l2}/${l3}`}
                          onSelect={() => select([l1, l2, l3])}
                          hasChildren={l4Set.size > 0}
                        >
                          {expanded.has(k3) && Array.from(l4Set).map((l4) => (
                            <TreeNode
                              key={`${k3}/${l4}`}
                              label={l4}
                              level={3}
                              isExpanded={false}
                              onToggle={() => {}}
                              isSelected={selectedPath.join("/") === `${l1}/${l2}/${l3}/${l4}`}
                              onSelect={() => select([l1, l2, l3, l4])}
                              hasChildren={false}
                            />
                          ))}
                        </TreeNode>
                      );
                    })}
                  </TreeNode>
                );
              })}
            </TreeNode>
          ))}
        </div>
      )}
    </div>
  );
}

function TreeNode({
  label, level, isExpanded, onToggle, isSelected, onSelect, hasChildren, children,
}: {
  label: string; level: number; isExpanded: boolean; onToggle: () => void;
  isSelected: boolean; onSelect: () => void; hasChildren: boolean; children?: React.ReactNode;
}) {
  return (
    <div>
      <div
        style={{
          display: "flex", alignItems: "center", gap: 4,
          padding: "6px 8px", paddingLeft: 8 + level * 18,
          background: isSelected ? C.primarySoft : "transparent",
          borderRadius: 6, cursor: "pointer",
        }}
        className="hover:bg-[#F3F4F6]"
      >
        {hasChildren ? (
          <button
            onClick={(e) => { e.stopPropagation(); onToggle(); }}
            style={{ background: "none", border: "none", padding: 2, cursor: "pointer", display: "flex" }}
          >
            <ChevronRight size={12} style={{ color: C.muted, transform: isExpanded ? "rotate(90deg)" : "none", transition: "transform 0.15s" }} />
          </button>
        ) : (
          <span style={{ width: 16 }} />
        )}
        <button
          onClick={onSelect}
          style={{
            flex: 1, background: "none", border: "none", textAlign: "left",
            padding: "2px 4px", fontSize: 13, cursor: "pointer",
            color: isSelected ? C.primary : C.text, fontWeight: isSelected ? 600 : 400,
          }}
        >
          {label}
        </button>
      </div>
      {children}
    </div>
  );
}

/* =================== SORT DROPDOWN =================== */
function SortDropdown({ value, onChange, language }: { value: SortKey; onChange: (k: SortKey) => void; language: string }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const opts: { key: SortKey; labelPT: string; labelEN: string }[] = [
    { key: "priority", labelPT: "Prioridade (menor score)", labelEN: "Priority (lowest score)" },
    { key: "gain", labelPT: "Maior ganho potencial", labelEN: "Highest potential gain" },
    { key: "low_automation", labelPT: "Menor maturidade em Automação", labelEN: "Lowest Automation maturity" },
    { key: "low_data", labelPT: "Menor maturidade em Dados", labelEN: "Lowest Data maturity" },
    { key: "low_compliance", labelPT: "Menor maturidade em Compliance", labelEN: "Lowest Compliance maturity" },
  ];
  const current = opts.find((o) => o.key === value)!;

  return (
    <div ref={ref} style={{ position: "relative" }}>
      <button
        onClick={() => setOpen((v) => !v)}
        style={{
          display: "flex", alignItems: "center", gap: 8, padding: "9px 12px",
          background: C.white, border: `1px solid ${C.border}`, borderRadius: 8,
          cursor: "pointer", fontSize: 13, color: C.text, minWidth: 280,
        }}
      >
        <ArrowUpDown size={14} style={{ color: C.primary }} />
        <span style={{ flex: 1, textAlign: "left" }}>{language === "PT" ? current.labelPT : current.labelEN}</span>
        <ChevronDown size={14} style={{ color: C.muted }} />
      </button>
      {open && (
        <div
          style={{
            position: "absolute", top: "calc(100% + 4px)", right: 0, zIndex: 50, minWidth: 300,
            background: C.white, border: `1px solid ${C.border}`, borderRadius: 10,
            boxShadow: "0 8px 24px rgba(0,0,0,0.08)", padding: 6,
          }}
        >
          {opts.map((o) => (
            <button
              key={o.key}
              onClick={() => { onChange(o.key); setOpen(false); }}
              style={{
                display: "block", width: "100%", padding: "8px 10px", textAlign: "left",
                background: o.key === value ? C.primarySoft : "transparent", border: "none",
                borderRadius: 6, cursor: "pointer", fontSize: 13,
                color: o.key === value ? C.primary : C.text, fontWeight: o.key === value ? 600 : 400,
              }}
            >
              {language === "PT" ? o.labelPT : o.labelEN}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/* =================== EMPTY STATE =================== */
function EmptyState({ language }: { language: string }) {
  return (
    <div style={{ background: C.white, border: `1px dashed ${C.border}`, borderRadius: 10, padding: 40, textAlign: "center", color: C.muted, fontSize: 13 }}>
      {language === "PT" ? "Nenhum processo encontrado para os filtros aplicados." : "No processes found for the applied filters."}
    </div>
  );
}

/* =================== MODE 1: TABLE =================== */
function MaturityBar({ value, color }: { value: number; color: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <div style={{ flex: 1, height: 6, background: "#F0F1F5", borderRadius: 3, overflow: "hidden" }}>
        <div style={{ width: `${value}%`, height: "100%", background: color, borderRadius: 3 }} />
      </div>
      <span style={{ fontSize: 12, fontWeight: 600, color: C.text, minWidth: 32, textAlign: "right" }}>{value}%</span>
    </div>
  );
}

function ProcessTable({ processes, language, onSelect, showL4 }: { processes: ProcessData[]; language: string; onSelect?: (p: ProcessData) => void; showL4?: boolean }) {
  const navigate = useNavigate();
  const { has, toggle } = usePrioritized();
  const { label: lvl, maxLevel } = useTaxonomy();
  const hasL3 = maxLevel >= 3;
  const hasL4 = maxLevel >= 4;
  const leafLevel = hasL4 ? "l4" : hasL3 ? "l3" : "l2";
  const [search, setSearch] = useState("");
  const [l1Filter, setL1Filter] = useState<string>("__all__");
  const [l2Filter, setL2Filter] = useState<string>("__all__");
  const [l3Filter, setL3Filter] = useState<string>("__all__");
  const [l4Filter, setL4Filter] = useState<string>("__all__");

  const opts = (key: "l1" | "l2" | "l3" | "l4", base: ProcessData[]) => {
    const set = new Set<string>();
    base.forEach((p) => { const v = (p as any)[key]; if (v) set.add(v); });
    return Array.from(set).sort();
  };

  const afterL1 = useMemo(() => l1Filter === "__all__" ? processes : processes.filter((p) => p.l1 === l1Filter), [processes, l1Filter]);
  const afterL2 = useMemo(() => l2Filter === "__all__" ? afterL1 : afterL1.filter((p) => p.l2 === l2Filter), [afterL1, l2Filter]);
  const afterL3 = useMemo(() => l3Filter === "__all__" ? afterL2 : afterL2.filter((p) => p.l3 === l3Filter), [afterL2, l3Filter]);
  const afterL4 = useMemo(() => {
    if (l4Filter === "__all__") return afterL3;
    if (l4Filter === "__none__") return afterL3.filter((p) => !p.l4);
    return afterL3.filter((p) => p.l4 === l4Filter);
  }, [afterL3, l4Filter]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return afterL4;
    return afterL4.filter((p) =>
      [p.name, p.area, p.l1, p.l2, p.l3, p.l4].some((v) => (v || "").toString().toLowerCase().includes(q))
    );
  }, [afterL4, search]);

  const l1Options = useMemo(() => opts("l1", processes), [processes]);
  const l2Options = useMemo(() => opts("l2", afterL1), [afterL1]);
  const l3Options = useMemo(() => opts("l3", afterL2), [afterL2]);
  const l4Options = useMemo(() => opts("l4", afterL3), [afterL3]);

  const selectedInTable = filtered.filter((p) => has(p.id)).length;

  // Cols: Priorizar | Processo | L4 | Automação | Dados | Compliance | Score | Status
  const cols = "84px 2fr 1fr 1.1fr 1.1fr 1.1fr 0.7fr 0.9fr";

  const selectStyle: React.CSSProperties = {
    padding: "6px 10px", border: `1px solid ${C.border}`, borderRadius: 6, fontSize: 12.5,
    color: C.text, background: C.white, cursor: "pointer", maxWidth: 200,
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      {/* Toolbar */}
      <div style={{ display: "flex", flexDirection: "column", gap: 10, padding: "12px 14px", background: C.white, border: `1px solid ${C.border}`, borderRadius: 8 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, flex: "1 1 240px", minWidth: 200, padding: "6px 10px", border: `1px solid ${C.border}`, borderRadius: 6 }}>
            <Search size={13} style={{ color: C.muted }} />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={language === "PT" ? "Pesquisar processos..." : "Search processes..."}
              style={{ border: "none", outline: "none", fontSize: 12.5, color: C.text, background: "transparent", width: "100%" }}
            />
          </div>
          <div style={{ fontSize: 12, color: C.muted, whiteSpace: "nowrap" }}>
            {language === "PT" ? "Selecionados para priorização" : "Selected for prioritization"}:{" "}
            <b style={{ color: selectedInTable > 0 ? C.primary : C.text }}>{selectedInTable}</b>
            <span style={{ color: C.muted }}> / {filtered.length}</span>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
          <Filter size={13} style={{ color: C.muted }} />
          <select value={l1Filter} onChange={(e) => { setL1Filter(e.target.value); setL2Filter("__all__"); setL3Filter("__all__"); setL4Filter("__all__"); }} style={selectStyle}>
            <option value="__all__">{language === "PT" ? `Todos os ${lvl("l1")}` : `All ${lvl("l1")}`}</option>
            {l1Options.map((v) => <option key={v} value={v}>{v}</option>)}
          </select>
          <select value={l2Filter} onChange={(e) => { setL2Filter(e.target.value); setL3Filter("__all__"); setL4Filter("__all__"); }} style={selectStyle}>
            <option value="__all__">{language === "PT" ? `Todos os ${lvl("l2")}` : `All ${lvl("l2")}`}</option>
            {l2Options.map((v) => <option key={v} value={v}>{v}</option>)}
          </select>
          {hasL3 && (
            <select value={l3Filter} onChange={(e) => { setL3Filter(e.target.value); setL4Filter("__all__"); }} style={selectStyle}>
              <option value="__all__">{language === "PT" ? `Todos os ${lvl("l3")}` : `All ${lvl("l3")}`}</option>
              {l3Options.map((v) => <option key={v} value={v}>{v}</option>)}
            </select>
          )}
          {hasL4 && (
            <select value={l4Filter} onChange={(e) => setL4Filter(e.target.value)} style={selectStyle}>
              <option value="__all__">{language === "PT" ? `Todos os ${lvl("l4")}` : `All ${lvl("l4")}`}</option>
              <option value="__none__">{language === "PT" ? `Sem ${lvl("l4")}` : `No ${lvl("l4")}`}</option>
              {l4Options.map((v) => <option key={v} value={v}>{v}</option>)}
            </select>
          )}
          {(l1Filter !== "__all__" || l2Filter !== "__all__" || l3Filter !== "__all__" || l4Filter !== "__all__" || search) && (
            <button
              onClick={() => { setSearch(""); setL1Filter("__all__"); setL2Filter("__all__"); setL3Filter("__all__"); setL4Filter("__all__"); }}
              style={{ fontSize: 11, padding: "5px 10px", background: "transparent", color: C.primary, border: `1px solid ${C.primary}`, borderRadius: 6, fontWeight: 600, cursor: "pointer" }}
            >
              {language === "PT" ? "Limpar filtros" : "Clear filters"}
            </button>
          )}
        </div>
      </div>

      {filtered.length === 0 ? <EmptyState language={language} /> : (
        <div style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: 10, overflow: "hidden" }}>
          <div style={{ display: "grid", gridTemplateColumns: cols, gap: 12, padding: "12px 18px", background: "#FAFBFF", borderBottom: `1px solid ${C.border}`, fontSize: 10.5, fontWeight: 700, letterSpacing: "1px", textTransform: "uppercase", color: "#A5A7B0" }}>
            <span style={{ fontSize: 9, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }} title={language === "PT" ? "Priorizar" : "Prioritize"}>{language === "PT" ? "Pri." : "Pri."}</span>
            <span>{language === "PT" ? "Processo" : "Process"}</span>
            <span>{lvl(leafLevel as any)}</span>
            <span>{language === "PT" ? "Automação" : "Automation"}</span>
            <span>{language === "PT" ? "Dados" : "Data"}</span>
            <span>Compliance</span>
            <span>{language === "PT" ? "Score" : "Score"}</span>
            <span>Status</span>
          </div>
          {filtered.map((p) => {
            const score = compositeScore(p);
            const st = statusOf(score);
            const meta = STATUS_META[st];
            const checked = has(p.id);
            return (
              <div
                key={p.id}
                onClick={() => onSelect ? onSelect(p) : navigate(`/processes/${p.id}`)}
                style={{
                  display: "grid", gridTemplateColumns: cols, gap: 12, padding: "14px 18px", alignItems: "center",
                  borderBottom: `1px solid #F0F1F5`, cursor: "pointer", fontSize: 13, color: C.text,
                  background: checked ? "rgba(12,27,168,0.04)" : C.white,
                  borderLeft: checked ? `3px solid ${C.primary}` : "3px solid transparent",
                }}
                className="hover:bg-[#FAFBFF]"
              >
                <label
                  onClick={(e) => e.stopPropagation()}
                  style={{ display: "flex", alignItems: "center", gap: 6, cursor: "pointer" }}
                  title={language === "PT" ? "Marcar para enviar à lista de priorização" : "Mark to send to prioritization list"}
                >
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={(e) => { e.stopPropagation(); toggle(p.id); }}
                    style={{ width: 15, height: 15, accentColor: C.primary, cursor: "pointer" }}
                  />
                </label>
                <div>
                  <div style={{ fontWeight: 600 }}>{p.name}</div>
                  <div style={{ fontSize: 11, color: C.muted, marginTop: 2 }}>{p.area}</div>
                </div>
                <div style={{ fontSize: 11.5 }}>
                  {(p as any)[leafLevel]
                    ? <span style={{ background: C.primarySoft, color: C.primary, padding: "2px 8px", borderRadius: 4, fontWeight: 600 }}>{(p as any)[leafLevel]}</span>
                    : <span style={{ color: C.muted }}>—</span>}
                </div>
                <MaturityBar value={p.automation?.maturity ?? 0} color={C.primary} />
                <MaturityBar value={p.dataIntegrity?.maturity ?? 0} color="#0EA5E9" />
                <MaturityBar value={p.governance?.maturity ?? 0} color="#8B5CF6" />
                <div style={{ fontWeight: 700, color: meta.color }}>{score}</div>
                <div>
                  <span style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "3px 10px", background: meta.bg, color: meta.color, borderRadius: 999, fontSize: 11, fontWeight: 600 }}>
                    <span style={{ width: 6, height: 6, borderRadius: "50%", background: meta.color }} />
                    {language === "PT" ? meta.labelPT : meta.labelEN}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

/* =================== MODE 2: CHARTS =================== */
function ChartCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: 10, padding: 18, display: "flex", flexDirection: "column" }}>
      <h3 style={{ fontSize: 13, fontWeight: 600, color: C.text, margin: "0 0 12px" }}>{title}</h3>
      <div style={{ flex: 1, minHeight: 320 }}>{children}</div>
    </div>
  );
}

function ChartsView({ processes, language }: { processes: ProcessData[]; language: string }) {
  const navigate = useNavigate();
  if (processes.length === 0) return <EmptyState language={language} />;

  const ranked = [...processes].sort((a, b) => compositeScore(a) - compositeScore(b)).map((p) => ({
    name: p.name.length > 22 ? p.name.slice(0, 22) + "…" : p.name,
    score: compositeScore(p),
    color: STATUS_META[statusOf(compositeScore(p))].color,
    id: p.id,
  }));

  const radarData = [
    { pillar: language === "PT" ? "Automação" : "Automation", value: Math.round(processes.reduce((s, p) => s + (p.automation?.maturity ?? 0), 0) / processes.length) },
    { pillar: language === "PT" ? "Dados" : "Data", value: Math.round(processes.reduce((s, p) => s + (p.dataIntegrity?.maturity ?? 0), 0) / processes.length) },
    { pillar: "Compliance", value: Math.round(processes.reduce((s, p) => s + (p.governance?.maturity ?? 0), 0) / processes.length) },
  ];

  const scatter = processes.map((p) => ({
    x: compositeScore(p),
    y: monthlyHours(p),
    z: manualStepsOf(p),
    name: p.name,
    fill: STATUS_META[statusOf(compositeScore(p))].color,
    id: p.id,
  }));

  const quadLabels = language === "PT"
    ? { tl: "Alto ganho · Baixa maturidade", tr: "Alto ganho · Alta maturidade", bl: "Baixo ganho · Baixa maturidade", br: "Baixo ganho · Alta maturidade" }
    : { tl: "High gain · Low maturity", tr: "High gain · High maturity", bl: "Low gain · Low maturity", br: "Low gain · High maturity" };

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 }}>
      <ChartCard title={language === "PT" ? "Ranking por Score Composto" : "Ranking by Composite Score"}>
        <ResponsiveContainer width="100%" height={320}>
          <BarChart data={ranked} layout="vertical" margin={{ top: 4, right: 16, left: 4, bottom: 4 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#F0F1F5" horizontal={false} />
            <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 10, fill: C.muted }} />
            <YAxis type="category" dataKey="name" tick={{ fontSize: 10, fill: C.text }} width={110} />
            <RTooltip cursor={{ fill: "#F3F4F6" }} contentStyle={{ fontSize: 12 }} />
            <Bar dataKey="score" radius={[0, 4, 4, 0]} onClick={(d: any) => navigate(`/processes/${d.id}`)}>
              {ranked.map((r, i) => <Cell key={i} fill={r.color} cursor="pointer" />)}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>

      <ChartCard title={language === "PT" ? "Média dos 3 Pilares" : "Average of the 3 Pillars"}>
        <ResponsiveContainer width="100%" height={320}>
          <RadarChart data={radarData}>
            <PolarGrid stroke="#E8E8EA" />
            <PolarAngleAxis dataKey="pillar" tick={{ fontSize: 12, fill: C.text }} />
            <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fontSize: 10, fill: C.muted }} />
            <Radar dataKey="value" stroke={C.primary} fill={C.primary} fillOpacity={0.25} />
            <RTooltip contentStyle={{ fontSize: 12 }} />
          </RadarChart>
        </ResponsiveContainer>
      </ChartCard>

      <ChartCard title={language === "PT" ? "Score × Ganho Potencial" : "Score × Potential Gain"}>
        <ResponsiveContainer width="100%" height={320}>
          <ScatterChart margin={{ top: 16, right: 16, left: 4, bottom: 8 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#F0F1F5" />
            <XAxis type="number" dataKey="x" name="Score" domain={[0, 100]} tick={{ fontSize: 10, fill: C.muted }}>
              <Label value={language === "PT" ? "Score Composto" : "Composite Score"} position="insideBottom" offset={-4} style={{ fontSize: 10, fill: C.muted }} />
            </XAxis>
            <YAxis type="number" dataKey="y" name="h/mês" tick={{ fontSize: 10, fill: C.muted }}>
              <Label value={language === "PT" ? "Ganho (h/mês)" : "Gain (h/mo)"} angle={-90} position="insideLeft" style={{ fontSize: 10, fill: C.muted }} />
            </YAxis>
            <ZAxis type="number" dataKey="z" range={[60, 400]} name={language === "PT" ? "Steps manuais" : "Manual steps"} />
            <ReferenceLine x={50} stroke="#A5A7B0" strokeDasharray="4 4" />
            <ReferenceLine y={(scatter.reduce((s, d) => s + d.y, 0) / Math.max(1, scatter.length))} stroke="#A5A7B0" strokeDasharray="4 4" />
            <RTooltip cursor={{ strokeDasharray: "3 3" }} contentStyle={{ fontSize: 12 }}
              formatter={(v: any, k: any) => [v, k]}
              labelFormatter={() => ""}
            />
            <Scatter data={scatter} onClick={(d: any) => navigate(`/processes/${d.id}`)}>
              {scatter.map((d, i) => <Cell key={i} fill={d.fill} cursor="pointer" />)}
            </Scatter>
          </ScatterChart>
        </ResponsiveContainer>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 4, fontSize: 9.5, color: C.muted, marginTop: 8 }}>
          <span>↖ {quadLabels.tl}</span>
          <span style={{ textAlign: "right" }}>↗ {quadLabels.tr}</span>
          <span>↙ {quadLabels.bl}</span>
          <span style={{ textAlign: "right" }}>↘ {quadLabels.br}</span>
        </div>
      </ChartCard>
    </div>
  );
}

/* =================== MODE 3: HEATMAP =================== */
function heatColor(v: number) {
  if (v < 40) return { bg: "#FEE2E2", fg: "#991B1B" };
  if (v < 60) return { bg: "#FEF3C7", fg: "#92400E" };
  if (v < 75) return { bg: "#DBEAFE", fg: "#1E3A8A" };
  return { bg: "#DCFCE7", fg: "#14532D" };
}

function HeatCell({ value, label }: { value: number; label: string }) {
  const c = heatColor(value);
  return (
    <div title={`${label}: ${value}%`}
      style={{
        background: c.bg, color: c.fg, fontWeight: 700, fontSize: 13,
        padding: "12px 0", textAlign: "center", borderRadius: 6, cursor: "pointer",
        border: "1px solid rgba(0,0,0,0.04)",
      }}
    >
      {value}%
    </div>
  );
}

function HeatmapView({ processes, language, onSelect }: { processes: ProcessData[]; language: string; onSelect?: (p: ProcessData) => void }) {
  const navigate = useNavigate();
  if (processes.length === 0) return <EmptyState language={language} />;
  const cols = "2fr 1fr 1fr 1fr";
  const pillars = [
    language === "PT" ? "Automação" : "Automation",
    language === "PT" ? "Dados" : "Data",
    "Compliance",
  ];
  return (
    <div style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: 10, overflow: "hidden" }}>
      <div style={{ display: "grid", gridTemplateColumns: cols, gap: 10, padding: "12px 18px", background: "#FAFBFF", borderBottom: `1px solid ${C.border}`, fontSize: 10.5, fontWeight: 700, letterSpacing: "1px", textTransform: "uppercase", color: "#A5A7B0" }}>
        <span>{language === "PT" ? "Processo" : "Process"}</span>
        {pillars.map((p) => <span key={p} style={{ textAlign: "center" }}>{p}</span>)}
      </div>
      {processes.map((p) => (
        <div
          key={p.id}
          onClick={() => onSelect ? onSelect(p) : navigate(`/processes/${p.id}`)}
          style={{ display: "grid", gridTemplateColumns: cols, gap: 10, padding: "10px 18px", alignItems: "center", borderBottom: `1px solid #F0F1F5`, cursor: "pointer" }}
          className="hover:bg-[#FAFBFF]"
        >
          <div>
            <div style={{ fontSize: 13, fontWeight: 600, color: C.text }}>{p.name}</div>
            <div style={{ fontSize: 11, color: C.muted, marginTop: 2 }}>{p.area} · {[p.l1, p.l2].filter(Boolean).join(" › ") || "—"}</div>
          </div>
          <HeatCell value={p.automation?.maturity ?? 0} label={p.name + " · " + (language === "PT" ? "Automação" : "Automation")} />
          <HeatCell value={p.dataIntegrity?.maturity ?? 0} label={p.name + " · " + (language === "PT" ? "Dados" : "Data")} />
          <HeatCell value={p.governance?.maturity ?? 0} label={p.name + " · Compliance"} />
        </div>
      ))}
      {/* Legend */}
      <div style={{ display: "flex", gap: 14, padding: "12px 18px", background: "#FAFBFF", borderTop: `1px solid ${C.border}`, fontSize: 11, color: C.muted, alignItems: "center" }}>
        <span style={{ fontWeight: 600 }}>{language === "PT" ? "Legenda:" : "Legend:"}</span>
        {[
          { l: "< 40%", c: heatColor(20) },
          { l: "40–60%", c: heatColor(50) },
          { l: "60–75%", c: heatColor(65) },
          { l: "> 75%", c: heatColor(85) },
        ].map((x) => (
          <span key={x.l} style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
            <span style={{ width: 14, height: 14, background: x.c.bg, borderRadius: 3, border: "1px solid rgba(0,0,0,0.04)" }} />
            {x.l}
          </span>
        ))}
      </div>
    </div>
  );
}

/* =================== PROCESS DRILL-DOWN DRAWER =================== */
function gaugeColor(v: number) {
  if (v >= 70) return "#15803D";
  if (v >= 40) return "#EA580C";
  return "#DC2626";
}

function SemiGauge({ value, label }: { value: number; label: string }) {
  const v = Math.max(0, Math.min(100, value));
  const color = gaugeColor(v);
  const cx = 60, cy = 60, r = 48;
  const startAngle = Math.PI;
  const endAngle = Math.PI - (Math.PI * v) / 100;
  const x1 = cx + r * Math.cos(startAngle);
  const y1 = cy + r * Math.sin(startAngle);
  const x2 = cx + r * Math.cos(endAngle);
  const y2 = cy + r * Math.sin(endAngle);
  const bgX2 = cx + r * Math.cos(0);
  const bgY2 = cy + r * Math.sin(0);
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flex: 1 }}>
      <svg width={120} height={74} viewBox="0 0 120 74">
        <path d={`M ${x1} ${y1} A ${r} ${r} 0 0 1 ${bgX2} ${bgY2}`} stroke="#F0F1F5" strokeWidth={10} fill="none" strokeLinecap="round" />
        {v > 0 && (
          <path d={`M ${x1} ${y1} A ${r} ${r} 0 0 1 ${x2} ${y2}`} stroke={color} strokeWidth={10} fill="none" strokeLinecap="round" />
        )}
        <text x={60} y={56} textAnchor="middle" fontSize={20} fontWeight={700} fill={color}>{Math.round(v)}</text>
      </svg>
      <div style={{ fontSize: 10.5, color: C.muted, textTransform: "uppercase", letterSpacing: "0.8px", fontWeight: 600 }}>{label}</div>
    </div>
  );
}

function PillarDrillCard({
  title, icon, m, m2, m2Label, items,
}: {
  title: string; icon: React.ReactNode; m: number; m2: number; m2Label: string;
  items: { label: string; value: React.ReactNode }[];
}) {
  return (
    <div style={{ background: C.white, border: `1px solid ${C.border}`, borderLeft: `4px solid ${gaugeColor(m)}`, borderRadius: 10, padding: 16, display: "flex", flexDirection: "column", gap: 14 }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ width: 28, height: 28, borderRadius: 6, background: C.primarySoft, color: C.primary, display: "flex", alignItems: "center", justifyContent: "center" }}>{icon}</div>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "1px", textTransform: "uppercase", color: C.text }}>{title}</div>
        </div>
        <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 18, fontWeight: 700, color: gaugeColor(m), lineHeight: 1 }}>{m}</div>
            <div style={{ fontSize: 9, color: C.muted, textTransform: "uppercase", letterSpacing: "0.6px", fontWeight: 600, marginTop: 3 }}>Maturidade</div>
          </div>
          <div style={{ width: 1, height: 28, background: C.border }} />
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 18, fontWeight: 700, color: C.text, lineHeight: 1 }}>{m2}</div>
            <div style={{ fontSize: 9, color: C.muted, textTransform: "uppercase", letterSpacing: "0.6px", fontWeight: 600, marginTop: 3 }}>{m2Label}</div>
          </div>
        </div>
      </div>
      {/* Items list */}
      <div style={{ display: "flex", flexDirection: "column", gap: 8, paddingTop: 12, borderTop: `1px solid ${C.border}` }}>
        {items.map((it, i) => (
          <div key={i} style={{ display: "flex", flexDirection: "column", gap: 4, fontSize: 12 }}>
            <span style={{ color: C.muted, textTransform: "uppercase", letterSpacing: "0.6px", fontWeight: 600, fontSize: 10 }}>{it.label}</span>
            <span style={{ color: C.text, fontWeight: 500 }}>{it.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function addToPrioritized(p: ProcessData) {
  addPrioritized(p.id);
}

function ProcessDrillDrawer({ process, onClose, language }: { process: ProcessData | null; onClose: () => void; language: string }) {
  const navigate = useNavigate();
  const open = !!process;

  const totalSteps = process ? Math.max(6, Math.round(20 - (process.automation?.maturity ?? 50) / 10)) : 0;
  const manualSteps = process ? Math.round(totalSteps * (1 - (process.automation?.maturity ?? 50) / 100)) : 0;
  const autoCandidates = process ? Math.max(0, totalSteps - manualSteps - 1) : 0;

  const govGap = language === "PT"
    ? ["Política de aprovação não documentada", "Trilha de auditoria parcial", "Segregação de funções incompleta"]
    : ["Approval policy undocumented", "Partial audit trail", "Incomplete segregation of duties"];
  const sox = language === "PT" ? "Controle SOX 404 não coberto" : "SOX 404 control not covered";
  const dataRisks = language === "PT"
    ? ["Edição manual em planilhas", "Conciliação fora de sistema", "Cópia entre fontes sem validação"]
    : ["Manual spreadsheet editing", "Off-system reconciliation", "Cross-source copy without validation"];
  const inputs = process?.systems?.length ? process.systems : ["SAP S/4HANA", "Excel", "E-mail"];

  return (
    <>
      {open && (
        <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(15,23,42,0.45)", zIndex: 60 }} />
      )}
      <aside
        style={{
          position: "fixed", top: 0, right: 0, bottom: 0, width: 720, maxWidth: "92vw",
          background: "#FAFBFF", borderLeft: `1px solid ${C.border}`, zIndex: 61,
          transform: open ? "translateX(0)" : "translateX(100%)", transition: "transform 0.25s ease",
          display: "flex", flexDirection: "column",
        }}
      >
        {process && (
          <>
            <div style={{ padding: "20px 24px", borderBottom: `1px solid ${C.border}`, background: C.white, display: "flex", alignItems: "flex-start", gap: 12 }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "1.2px", textTransform: "uppercase", color: C.primary, marginBottom: 6 }}>
                  {language === "PT" ? "Processo Selecionado" : "Selected Process"}
                </div>
                <h2 style={{ fontSize: 22, fontWeight: 700, color: C.text, margin: 0, letterSpacing: "-0.3px", lineHeight: 1.25 }}>
                  {process.name}
                </h2>
                <div style={{ fontSize: 12, color: C.muted, marginTop: 6 }}>
                  {process.area} · {[process.l1, process.l2].filter(Boolean).join(" › ") || "—"}
                </div>
              </div>
              <button
                onClick={onClose}
                aria-label="Close"
                style={{ background: "transparent", border: "none", padding: 6, cursor: "pointer", color: C.muted, borderRadius: 6 }}
                className="hover:bg-[#F0F1F5]"
              >
                <X size={18} />
              </button>
            </div>

            <div style={{ flex: 1, overflowY: "auto", padding: 20, display: "flex", flexDirection: "column", gap: 16 }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 12 }}>
                <PillarDrillCard
                  title={language === "PT" ? "Automação" : "Automation"}
                  icon={<Cpu size={14} />}
                  m={process.automation?.maturity ?? 0}
                  m2={process.automation?.risk ?? 0}
                  m2Label={language === "PT" ? "Esforço" : "Effort"}
                  items={[
                    { label: language === "PT" ? "Frequência" : "Frequency", value: process.frequency || "—" },
                    { label: language === "PT" ? "Steps" : "Steps", value: totalSteps },
                    { label: language === "PT" ? "Manuais" : "Manual", value: manualSteps },
                    { label: language === "PT" ? "Automatizáveis" : "Automatable", value: autoCandidates },
                  ]}
                />
                <PillarDrillCard
                  title="Compliance"
                  icon={<ShieldCheck size={14} />}
                  m={process.governance?.maturity ?? 0}
                  m2={process.governance?.risk ?? 0}
                  m2Label={language === "PT" ? "Risco" : "Risk"}
                  items={[
                    { label: "Gaps", value: (
                      <ul style={{ margin: 0, paddingLeft: 14, textAlign: "left" }}>
                        {govGap.map((g, i) => <li key={i} style={{ marginBottom: 2 }}>{g}</li>)}
                      </ul>
                    ) },
                    { label: "SOX", value: <span style={{ color: "#DC2626", fontWeight: 600 }}>{sox}</span> },
                  ]}
                />
                <PillarDrillCard
                  title="Data Integrity"
                  icon={<Database size={14} />}
                  m={process.dataIntegrity?.maturity ?? 0}
                  m2={process.dataIntegrity?.risk ?? 0}
                  m2Label={language === "PT" ? "Risco" : "Risk"}
                  items={[
                    { label: language === "PT" ? "Riscos" : "Risks", value: (
                      <ul style={{ margin: 0, paddingLeft: 14, textAlign: "left" }}>
                        {dataRisks.map((g, i) => <li key={i} style={{ marginBottom: 2 }}>{g}</li>)}
                      </ul>
                    ) },
                    { label: language === "PT" ? "Fontes" : "Inputs", value: (
                      <div style={{ display: "flex", flexWrap: "wrap", gap: 4, justifyContent: "flex-end" }}>
                        {inputs.map((s, i) => (
                          <span key={i} style={{ background: C.primarySoft, color: C.primary, fontSize: 10, padding: "2px 7px", borderRadius: 4, fontWeight: 600 }}>{s}</span>
                        ))}
                      </div>
                    ) },
                  ]}
                />
              </div>

              <div style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: 10, padding: "14px 18px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <div style={{ fontSize: 10.5, color: C.muted, textTransform: "uppercase", letterSpacing: "0.8px", fontWeight: 600 }}>
                    {language === "PT" ? "Score Composto" : "Composite Score"}
                  </div>
                  <div style={{ fontSize: 24, fontWeight: 700, color: gaugeColor(compositeScore(process)), letterSpacing: "-0.4px" }}>
                    {compositeScore(process)}<span style={{ fontSize: 13, color: C.muted, fontWeight: 500 }}> /100</span>
                  </div>
                </div>
              </div>
            </div>

            <div style={{ padding: "14px 20px", borderTop: `1px solid ${C.border}`, background: C.white, display: "flex", gap: 10, justifyContent: "flex-end" }}>
              <button
                onClick={() => navigate(`/processes/${process.id}`)}
                style={{ padding: "9px 16px", border: `1px solid ${C.border}`, background: C.white, color: C.text, borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: "pointer" }}
                className="hover:bg-[#F3F4F6]"
              >
                {language === "PT" ? "Ver processo completo" : "View full process"}
              </button>
              <button
                onClick={() => { addToPrioritized(process); onClose(); }}
                style={{ padding: "9px 16px", border: "none", background: C.primary, color: C.white, borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: "pointer" }}
              >
                {language === "PT" ? "Adicionar à lista de priorizados" : "Add to prioritized list"}
              </button>
            </div>
          </>
        )}
      </aside>
    </>
  );
}

type DemoUseCase = { id: string; title: string; category: string };

const CATEGORY_COLORS: Record<string, string> = {
  "Automação": "#0C1BA8",
  "Automation": "#0C1BA8",
  "Dados": "#0EA5E9",
  "Data": "#0EA5E9",
  "Compliance": "#8B5CF6",
  "IA": "#D97706",
  "AI": "#D97706",
  "Redesenho": "#EA580C",
  "Processo": "#EA580C",
  "Sistemas": "#0891B2",
};

interface Cluster {
  id: string;
  categories: string[];
  useCases: DemoUseCase[];
  processes: ProcessData[];
  aggregateGain: number;
}

function buildClusters(processes: ProcessData[]): Cluster[] {
  // Map use case title -> set of process ids (uses ONLY user-saved use cases)
  const map = new Map<string, { uc: DemoUseCase; pset: Set<string> }>();
  processes.forEach((p) => {
    (p.useCases ?? []).forEach((u) => {
      if (!u?.title) return;
      if (!map.has(u.title)) {
        map.set(u.title, { uc: { id: u.id, title: u.title, category: u.category || "—" }, pset: new Set() });
      }
      map.get(u.title)!.pset.add(p.id);
    });
  });

  // Group by category, keep only those touching ≥2 processes
  const byCat = new Map<string, { ucs: DemoUseCase[]; pset: Set<string> }>();
  map.forEach(({ uc, pset }) => {
    if (pset.size < 2) return;
    if (!byCat.has(uc.category)) byCat.set(uc.category, { ucs: [], pset: new Set() });
    const bucket = byCat.get(uc.category)!;
    bucket.ucs.push(uc);
    pset.forEach((pid) => bucket.pset.add(pid));
  });

  // One cluster per use case (solution), grouping the processes that share it
  const clusters: Cluster[] = [];
  let i = 1;
  map.forEach(({ uc, pset }) => {
    if (pset.size < 2) return;
    const procs = processes.filter((p) => pset.has(p.id));
    const baseGain = procs.reduce((s, p) => s + monthlyHours(p), 0);
    clusters.push({
      id: `uc-cluster-${i++}-${uc.id}`,
      categories: [uc.category],
      useCases: [uc],
      processes: procs,
      aggregateGain: Math.round(baseGain * 1.15),
    });
  });

  return clusters.sort((a, b) => b.aggregateGain - a.aggregateGain);
}

/* =================== MOCK CLUSTERS (demo fallback) =================== */
function buildMockClusters(language: string): Cluster[] {
  const PT = language === "PT";
  const mk = (
    id: string,
    name: string,
    area: string,
    l1: string,
    l2: string,
    a: number,
    d: number,
    g: number,
    freq: string,
    effortHours: number,
    systems: string[],
  ): ProcessData => ({
    id,
    name,
    area,
    description: "",
    hasDocumentation: true,
    l1, l2,
    automation: { maturity: a, risk: 100 - a },
    dataIntegrity: { maturity: d, risk: 100 - d },
    governance: { maturity: g, risk: 100 - g },
    frequency: freq,
    systems,
    executionEffort: [{ id: "m1", positionId: "p1", name: "Analista", people: 1, hours: effortHours }],
  });

  // Cluster 1 — Automação
  const c1Procs = [
    mk("mock-c1-1", PT ? "Aprovação de Compras" : "Purchase Approval", "S2P", "Source to Pay", "Compras", 38, 65, 70, "diário", 6, ["SAP", "Power Automate"]),
    mk("mock-c1-2", PT ? "Cotação de Frete Emergencial" : "Emergency Freight Quote", "S2P", "Source to Pay", "Logística", 42, 60, 68, "semanal", 8, ["SAP", "TMS Oracle"]),
    mk("mock-c1-3", PT ? "Onboarding de Fornecedores" : "Supplier Onboarding", "S2P", "Source to Pay", "Fornecedores", 35, 55, 72, "semanal", 12, ["Coupa", "SAP"]),
  ];
  const c1Ucs: DemoUseCase[] = [
    { id: "muc-c1-a", title: PT ? "Workflow digital no BPMS" : "Digital workflow in BPMS", category: "Automação" },
    { id: "muc-c1-b", title: PT ? "RPA para coleta de dados" : "RPA for data capture", category: "Automação" },
  ];

  // Cluster 2 — Dados
  const c2Procs = [
    mk("mock-c2-1", PT ? "Conciliação Contábil" : "Account Reconciliation", "R2R", "Record to Report", "Contabilidade", 55, 38, 75, "mensal", 24, ["Blackline", "SAP"]),
    mk("mock-c2-2", PT ? "Fechamento Mensal" : "Monthly Close", "R2R", "Record to Report", "Fechamento", 60, 42, 78, "mensal", 36, ["SAP", "Power BI"]),
    mk("mock-c2-3", PT ? "Reporte Regulatório" : "Regulatory Reporting", "R2R", "Record to Report", "Regulatório", 50, 35, 82, "trimestral", 48, ["SAP", "Tableau"]),
    mk("mock-c2-4", PT ? "Análise de Margem" : "Margin Analysis", "R2R", "Record to Report", "FP&A", 58, 40, 70, "mensal", 20, ["Anaplan", "Power BI"]),
  ];
  const c2Ucs: DemoUseCase[] = [
    { id: "muc-c2-a", title: PT ? "Master Data Management" : "Master Data Management", category: "Dados" },
    { id: "muc-c2-b", title: PT ? "Data Quality Hub" : "Data Quality Hub", category: "Dados" },
    { id: "muc-c2-c", title: PT ? "Catálogo de dados unificado" : "Unified data catalog", category: "Dados" },
  ];

  // Cluster 3 — Compliance
  const c3Procs = [
    mk("mock-c3-1", PT ? "Aprovação de Despesas" : "Expense Approval", "P2P", "Procure to Pay", "Despesas", 48, 62, 40, "diário", 4, ["Concur", "SAP"]),
    mk("mock-c3-2", PT ? "Auditoria de Pagamentos" : "Payment Audit", "P2P", "Procure to Pay", "Auditoria", 52, 58, 35, "semanal", 10, ["SAP", "Power BI"]),
  ];
  const c3Ucs: DemoUseCase[] = [
    { id: "muc-c3-a", title: PT ? "Trilha de Auditoria Automatizada" : "Automated Audit Trail", category: "Compliance" },
    { id: "muc-c3-b", title: PT ? "Compliance Monitor em tempo real" : "Real-time Compliance Monitor", category: "Compliance" },
  ];

  // Build one cluster per use case (solution)
  const groups: { ucs: DemoUseCase[]; procs: ProcessData[]; cat: string }[] = [
    ...c1Ucs.map((u) => ({ ucs: [u], procs: c1Procs, cat: "Automação" })),
    ...c2Ucs.map((u) => ({ ucs: [u], procs: c2Procs, cat: "Dados" })),
    ...c3Ucs.map((u) => ({ ucs: [u], procs: c3Procs, cat: "Compliance" })),
  ];

  const clusters: Cluster[] = groups.map((g, idx) => ({
    id: `mock-uc-${idx + 1}-${g.ucs[0].id}`,
    categories: [g.cat],
    useCases: g.ucs,
    processes: g.procs,
    aggregateGain: 0,
  }));

  return clusters.map((c) => ({
    ...c,
    aggregateGain: Math.round(c.processes.reduce((s, p) => s + monthlyHours(p), 0) * 1.15),
  })).sort((a, b) => b.aggregateGain - a.aggregateGain);
}

function SynergiesView({ language }: { language: string }) {
  const allProcesses = useProcessStore((s) => s.processes);
  // Only processes with at least one saved use case participate in synergies
  const processes = useMemo(
    () => allProcesses.filter((p) => (p.useCases ?? []).length > 0),
    [allProcesses]
  );
  const realClusters = useMemo(() => buildClusters(processes), [processes]);
  const mockClusters = useMemo(() => buildMockClusters(language), [language]);
  const isDemo = realClusters.length === 0;
  const baseClusters = isDemo ? mockClusters : realClusters;
  const { has: isClusterSaved } = useSavedClusters();
  const clusters = useMemo(() => {
    const saved = baseClusters.filter((c) => isClusterSaved(c.id));
    const rest = baseClusters.filter((c) => !isClusterSaved(c.id));
    return [...saved, ...rest];
  }, [baseClusters, isClusterSaved]);
  const procsWithSynergy = new Set<string>();
  clusters.forEach((c) => c.processes.forEach((p) => procsWithSynergy.add(p.id)));

  return (
    <div>
      {/* KPIs */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 16, marginBottom: 20 }}>
        <KpiCard
          label={language === "PT" ? "Soluções Identificadas" : "Identified Solutions"}
          value={clusters.length.toString()}
          icon={<GitMerge size={18} />}
          accent={C.primary}
          accentBg={C.primarySoft}
        />
        <KpiCard
          label={language === "PT" ? "Processos com Sinergia" : "Processes in Synergy"}
          value={procsWithSynergy.size.toString()}
          icon={<Layers size={18} />}
          accent={C.green}
          accentBg={C.greenSoft}
        />
      </div>

      {/* Explanation banner */}
      <div style={{
        display: "flex", alignItems: "flex-start", gap: 10,
        background: "#F0F9FF", border: `1px solid #BAE6FD`,
        color: "#0C4A6E", borderRadius: 10, padding: "12px 14px",
        fontSize: 12.5, marginBottom: 12, lineHeight: 1.5,
      }}>
        <Info size={16} style={{ flexShrink: 0, marginTop: 1 }} />
        <span>
          {language === "PT"
            ? <><strong>Como funcionam as soluções:</strong> cada card representa uma solução (caso de uso) recorrente que impacta mais de um processo, revelando oportunidades de implementação conjunta. Cada solução conecta a tecnologia/abordagem (à esquerda) aos processos beneficiados (à direita), permitindo um Business Case integrado com ganho de escala.</>
            : <><strong>How solutions work:</strong> each card represents a recurring solution (use case) that impacts more than one process, revealing joint-implementation opportunities. Each solution connects the technology/approach (left) to the benefiting processes (right), enabling an integrated Business Case with scale gains.</>}
        </span>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {clusters.map((c, idx) => (
          <ClusterCard key={c.id} cluster={c} index={idx + 1} language={language} />
        ))}
      </div>
    </div>
  );
}

function ClusterCard({ cluster, index, language }: { cluster: Cluster; index: number; language: string }) {
  const [open, setOpen] = useState(false);
  const [bcOpen, setBcOpen] = useState(false);
  const [activeUc, setActiveUc] = useState<DemoUseCase | null>(null);
  const navigate = useNavigate();
  const { has: isClusterSaved, toggle: toggleCluster } = useSavedClusters();
  const saved = isClusterSaved(cluster.id);
  const accent = CATEGORY_COLORS[cluster.categories[0]] ?? C.primary;

  return (
    <div style={{
      background: saved ? "#FFFBEB" : C.white,
      border: saved ? `1.5px solid ${C.amber}` : `1px solid ${C.border}`,
      borderRadius: 10, overflow: "hidden",
      boxShadow: saved ? `0 0 0 3px ${C.amber}1A` : "none",
      transition: "all 0.15s",
    }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: 16, padding: "16px 20px" }}>
        <div style={{ width: 36, height: 36, borderRadius: 8, background: accent + "1A", color: accent, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 14 }}>
          #{index}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
            <span style={{ fontSize: 14, fontWeight: 600, color: C.text }}>
              #{index} · {cluster.useCases[0]?.title ?? cluster.categories.join(" + ")}
            </span>
            {saved && (
              <span style={{
                fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 999,
                background: C.amber, color: C.white, letterSpacing: "0.5px",
              }}>
                {language === "PT" ? "SALVO" : "SAVED"}
              </span>
            )}
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
            <span style={{
              fontSize: 11, fontWeight: 600, padding: "3px 8px", borderRadius: 999,
              background: accent + "14", color: accent, border: `1px solid ${accent}33`,
            }}>
              {cluster.useCases[0]?.category}
            </span>
          </div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontSize: 11, color: C.muted, fontWeight: 500 }}>
            {cluster.processes.length} {language === "PT" ? "processos" : "processes"}
          </div>
          <div style={{ fontSize: 10, color: C.muted, marginTop: 4 }}>
            {language === "PT" ? "+15% bônus de sinergia" : "+15% synergy bonus"}
          </div>
        </div>
        <button
          onClick={() => toggleCluster(cluster.id)}
          title={saved ? (language === "PT" ? "Remover dos salvos" : "Unsave") : (language === "PT" ? "Salvar cluster" : "Save cluster")}
          style={{
            display: "inline-flex", alignItems: "center", gap: 4, padding: "8px 10px",
            background: saved ? C.amber : "transparent", color: saved ? C.white : C.amber,
            border: `1px solid ${C.amber}`, borderRadius: 8, cursor: "pointer", fontSize: 12, fontWeight: 600,
          }}
        >
          {saved ? <BookmarkCheck size={14} /> : <Bookmark size={14} />}
          {saved ? (language === "PT" ? "Salvo" : "Saved") : (language === "PT" ? "Salvar" : "Save")}
        </button>
        <button
          onClick={() => setOpen((v) => !v)}
          style={{
            display: "inline-flex", alignItems: "center", gap: 4, padding: "8px 12px",
            background: open ? C.primary : "transparent", color: open ? C.white : C.primary,
            border: `1px solid ${C.primary}`, borderRadius: 8, cursor: "pointer", fontSize: 12, fontWeight: 600,
          }}
        >
          {open ? (language === "PT" ? "Fechar" : "Close") : (language === "PT" ? "Expandir" : "Expand")}
          <ChevronDown size={14} style={{ transform: open ? "rotate(180deg)" : "none", transition: "transform 0.15s" }} />
        </button>
      </div>

      {open && (
        <div style={{ borderTop: `1px solid ${C.border}`, padding: 20, background: "#FAFBFF" }}>
          <ConnectionDiagram cluster={cluster} accent={accent} language={language} onUseCaseClick={setActiveUc} />

          <div style={{ marginTop: 20, marginBottom: 14, fontSize: 11, fontWeight: 700, letterSpacing: "1px", textTransform: "uppercase", color: C.muted }}>
            {language === "PT" ? "Processos no cluster" : "Processes in cluster"}
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 12 }}>
            {cluster.processes.map((p) => (
              <ProcessMiniCard key={p.id} process={p} onClick={() => navigate(`/processes/${p.id}`)} language={language} />
            ))}
          </div>

          <div style={{ marginTop: 20, display: "flex", justifyContent: "flex-end" }}>
            <button
              onClick={() => setBcOpen(true)}
              style={{
                display: "inline-flex", alignItems: "center", gap: 8,
                background: C.primary, color: C.white, border: "none",
                padding: "10px 18px", borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: "pointer",
              }}
            >
              {language === "PT" ? "Gerar Business Case Integrado" : "Generate Integrated Business Case"}
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      )}

      {bcOpen && <BusinessCaseModal cluster={cluster} onClose={() => setBcOpen(false)} language={language} />}
      {activeUc && <UseCaseDetailModal useCase={activeUc} cluster={cluster} onClose={() => setActiveUc(null)} language={language} />}
    </div>
  );
}

/* =================== BUSINESS CASE MODAL =================== */
/* =================== USE CASE DETAIL MODAL =================== */
function UseCaseDetailModal({ useCase, cluster, onClose, language }: { useCase: DemoUseCase; cluster: Cluster; onClose: () => void; language: string }) {
  const accent = CATEGORY_COLORS[useCase.category] ?? C.primary;
  const impactedProcesses = cluster.processes;

  // Mock-style enrichment to mirror the esteira detail screen
  const description = language === "PT"
    ? `${useCase.title} aplicado de forma transversal aos processos do cluster, padronizando execução, reduzindo retrabalho e capturando ganhos de escala via reuso de componentes.`
    : `${useCase.title} applied transversally across cluster processes, standardizing execution, reducing rework and capturing scale gains through component reuse.`;

  const potentialGains = language === "PT" ? [
    { title: "Redução de tempo de execução", description: "Automação de etapas manuais repetitivas em todos os processos do cluster." },
    { title: "Aumento de aderência (compliance)", description: "Trilhas e validações padronizadas em todas as instâncias." },
    { title: "Ganho de escala", description: "Reuso da mesma solução em múltiplos processos com baixo custo marginal." },
  ] : [
    { title: "Execution time reduction", description: "Automating repetitive manual steps across all cluster processes." },
    { title: "Compliance adherence", description: "Standardized trails and validations across all instances." },
    { title: "Scale gain", description: "Reuse of the same solution across multiple processes at low marginal cost." },
  ];

  const indicators = ["SLA", "Lead Time", "Touch Time", "First Pass Yield", language === "PT" ? "Aderência" : "Adherence"];
  const technologies = Array.from(new Set(cluster.processes.flatMap((p) => p.systems ?? []))).slice(0, 5);
  if (technologies.length === 0) technologies.push("Power Automate", "SAP", "Azure AI");

  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(15,23,42,0.55)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 110, padding: 20, backdropFilter: "blur(2px)" }}>
      <div onClick={(e) => e.stopPropagation()} style={{ background: C.white, borderRadius: 14, width: "100%", maxWidth: 720, maxHeight: "90vh", overflowY: "auto" }}>
        {/* Header */}
        <div style={{ padding: "22px 24px", borderBottom: `1px solid ${C.border}`, display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12 }}>
          <div style={{ flex: 1 }}>
            <span style={{ fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 999, background: accent + "1A", color: accent, border: `1px solid ${accent}44` }}>
              {useCase.category}
            </span>
            <h2 style={{ fontSize: 20, fontWeight: 700, color: C.text, margin: "10px 0 6px" }}>{useCase.title}</h2>
            <p style={{ fontSize: 13, color: C.muted, margin: 0, lineHeight: 1.5 }}>{description}</p>
          </div>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: C.muted, padding: 4 }}>
            <X size={20} />
          </button>
        </div>

        <div style={{ padding: 24, display: "flex", flexDirection: "column", gap: 22 }}>
          {/* Potential gains */}
          <section>
            <SectionTitle>{language === "PT" ? "Ganhos Potenciais" : "Potential Gains"}</SectionTitle>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              {potentialGains.map((g, i) => (
                <div key={i} style={{ borderLeft: `3px solid ${C.green}`, paddingLeft: 10 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: C.text }}>{g.title}</div>
                  <div style={{ fontSize: 11.5, color: C.muted, marginTop: 2 }}>{g.description}</div>
                </div>
              ))}
            </div>
          </section>

          {/* Effort & Impact */}
          <section style={{ display: "flex", gap: 24 }}>
            <div>
              <Subtle>{language === "PT" ? "Esforço" : "Effort"}</Subtle>
              <Badge bg="#F3F4F6" color={C.text} border="#E8E8EA">{language === "PT" ? "Médio" : "Medium"}</Badge>
            </div>
            <div>
              <Subtle>{language === "PT" ? "Impacto" : "Impact"}</Subtle>
              <Badge bg="#F3F4F6" color={C.text} border="#E8E8EA">{language === "PT" ? "Alto" : "High"}</Badge>
            </div>
            <div>
              <Subtle>{language === "PT" ? "Processos Impactados" : "Impacted Processes"}</Subtle>
              <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", height: 24, minWidth: 24, padding: "0 8px", borderRadius: 999, border: `2px solid ${accent}`, color: accent, fontSize: 12, fontWeight: 700 }}>
                {impactedProcesses.length}
              </span>
            </div>
          </section>

          {/* Impacted Processes list */}
          <section>
            <SectionTitle>{language === "PT" ? "Processos Impactados (no cluster)" : "Impacted Processes (in cluster)"}</SectionTitle>
            <div style={{ border: `1px solid ${C.border}`, borderRadius: 8, overflow: "hidden" }}>
              {impactedProcesses.map((p, i) => (
                <div key={p.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 12px", borderTop: i === 0 ? "none" : `1px solid ${C.border}`, background: i % 2 === 0 ? C.white : "#FAFBFF" }}>
                  <span style={{ fontSize: 11, color: C.muted, width: 18 }}>{i + 1}</span>
                  <span style={{ fontSize: 13, color: C.text, fontWeight: 500, flex: 1 }}>{p.name}</span>
                  <span style={{ fontSize: 11, color: C.muted }}>{p.area}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Indicators & Technologies */}
          <section style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <div>
              <SectionTitle>{language === "PT" ? "Indicadores Impactados" : "Impacted Indicators"}</SectionTitle>
              <BadgeRow>
                {indicators.map((x) => <Badge key={x} bg="#F3F4F6" color={C.text} border="#E8E8EA">{x}</Badge>)}
              </BadgeRow>
            </div>
            <div>
              <SectionTitle>{language === "PT" ? "Tecnologias" : "Technologies"}</SectionTitle>
              <BadgeRow>
                {technologies.map((x) => <Badge key={x} bg="#1F2937" color="#FFFFFF" border="#1F2937">{x}</Badge>)}
              </BadgeRow>
            </div>
          </section>
        </div>

        <div style={{ padding: "14px 24px", borderTop: `1px solid ${C.border}`, display: "flex", justifyContent: "flex-end", background: "#FAFBFF" }}>
          <button onClick={onClose} style={{ padding: "9px 16px", background: C.primary, color: C.white, border: "none", borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
            {language === "PT" ? "Fechar" : "Close"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* =================== INTEGRATED BUSINESS CASE MODAL (esteira-style) =================== */
function BusinessCaseModal({ cluster, onClose, language }: { cluster: Cluster; onClose: () => void; language: string }) {
  // Auto-suggested premises based on cluster size
  const monthlyHrs = cluster.aggregateGain;
  const yearlyHrs = monthlyHrs * 12;
  const suggestedAnnualSaving = yearlyHrs * 85;
  const suggestedCapex = Math.round(suggestedAnnualSaving * 0.6);
  const suggestedOpexMonthly = Math.round((suggestedAnnualSaving * 0.1) / 12);

  const [premises, setPremises] = useState({
    capex: String(suggestedCapex),
    opex_monthly: String(suggestedOpexMonthly),
    wacc: "10",
    horizon_years: "5",
    ramp_up_months: "3",
    annual_saving: String(suggestedAnnualSaving),
  });
  const [calculated, setCalculated] = useState(false);
  const stack = Array.from(new Set(cluster.processes.flatMap((p) => p.systems ?? [])));

  const result = useMemo(() => {
    const capex = parseFloat(premises.capex) || 0;
    const opexMonthly = parseFloat(premises.opex_monthly) || 0;
    const wacc = (parseFloat(premises.wacc) || 10) / 100;
    const horizon = parseInt(premises.horizon_years) || 5;
    const rampUp = parseInt(premises.ramp_up_months) || 0;
    const annualSaving = parseFloat(premises.annual_saving) || 0;
    const totalOpex = opexMonthly * 12 * horizon;
    const totalInvestment = capex + totalOpex;
    let npv = -capex;
    for (let year = 1; year <= horizon; year++) {
      const netCF = annualSaving - opexMonthly * 12;
      const adj = year === 1 && rampUp > 0 ? netCF * ((12 - rampUp) / 12) : netCF;
      npv += adj / Math.pow(1 + wacc, year);
    }
    const totalBenefit = annualSaving * horizon;
    const roi = totalInvestment > 0 ? ((totalBenefit - totalInvestment) / totalInvestment) * 100 : 0;
    const monthlyNet = annualSaving / 12 - opexMonthly;
    const payback = monthlyNet > 0 ? capex / monthlyNet : horizon * 12;
    const btc = totalInvestment > 0 ? totalBenefit / totalInvestment : 0;
    return {
      roi: Math.round(roi * 10) / 10,
      payback: Math.round(payback * 10) / 10,
      npv: Math.round(npv),
      btc: Math.round(btc * 100) / 100,
      totalInvestment: Math.round(totalInvestment),
      netBenefit: Math.round(totalBenefit - totalInvestment),
      annualSavings: Math.round(annualSaving),
    };
  }, [premises]);

  const updateField = (k: keyof typeof premises, v: string) => setPremises((p) => ({ ...p, [k]: v }));
  const fmt = (n: number) => `R$ ${Math.abs(n).toLocaleString("pt-BR")}${n < 0 ? " (-)" : ""}`;

  const fields: { key: keyof typeof premises; label: string }[] = [
    { key: "capex", label: language === "PT" ? "Investimento (CAPEX)" : "Investment (CAPEX)" },
    { key: "opex_monthly", label: language === "PT" ? "Custo Mensal (OPEX)" : "Monthly Cost (OPEX)" },
    { key: "wacc", label: language === "PT" ? "WACC / Taxa Desconto (%)" : "WACC / Discount Rate (%)" },
    { key: "horizon_years", label: language === "PT" ? "Horizonte (anos)" : "Horizon (years)" },
    { key: "ramp_up_months", label: "Ramp-up (months)" },
    { key: "annual_saving", label: language === "PT" ? "Economia Anual Estimada" : "Estimated Annual Saving" },
  ];

  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(15,23,42,0.55)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100, padding: 20, backdropFilter: "blur(2px)" }}>
      <div onClick={(e) => e.stopPropagation()} style={{ background: C.white, borderRadius: 14, width: "100%", maxWidth: 880, maxHeight: "92vh", overflowY: "auto" }}>
        {/* Header */}
        <div style={{ padding: "22px 24px", borderBottom: `1px solid ${C.border}`, display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12 }}>
          <div>
            <h2 style={{ fontSize: 18, fontWeight: 700, color: C.text, margin: 0 }}>
              {language === "PT" ? "Business Case Integrado" : "Integrated Business Case"}
            </h2>
            <p style={{ fontSize: 12, color: C.muted, margin: "6px 0 0" }}>
              {cluster.processes.length} {language === "PT" ? "processos" : "processes"} · {cluster.useCases.length} {language === "PT" ? "casos de uso" : "use cases"} · {cluster.categories.join(" + ")}
            </p>
          </div>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: C.muted, padding: 4 }}>
            <X size={20} />
          </button>
        </div>

        <div style={{ padding: 24, display: "flex", flexDirection: "column", gap: 22 }}>
          {/* COMPOSITION — explicit list of processes & use cases composing this BC */}
          <section style={{ background: "#FAFBFF", border: `1px solid ${C.border}`, borderRadius: 10, padding: 16 }}>
            <SectionTitle>{language === "PT" ? "Composição do Business Case" : "Business Case Composition"}</SectionTitle>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              <div>
                <Subtle>{language === "PT" ? "Casos de uso" : "Use cases"} ({cluster.useCases.length})</Subtle>
                <BadgeRow>
                  {cluster.useCases.map((u) => {
                    const c = CATEGORY_COLORS[u.category] ?? C.primary;
                    return <Badge key={u.id} bg={c + "1A"} color={c} border={c + "44"}>{u.title}</Badge>;
                  })}
                </BadgeRow>
              </div>
              <div>
                <Subtle>{language === "PT" ? "Processos envolvidos" : "Involved processes"} ({cluster.processes.length})</Subtle>
                <BadgeRow>
                  {cluster.processes.map((p) => (
                    <Badge key={p.id} bg="#F3F4F6" color={C.text} border="#E8E8EA">{p.name}</Badge>
                  ))}
                </BadgeRow>
              </div>
            </div>
            {stack.length > 0 && (
              <div style={{ marginTop: 14 }}>
                <Subtle>{language === "PT" ? "Stack tecnológico unificado" : "Unified tech stack"}</Subtle>
                <BadgeRow>
                  {stack.map((s) => <Badge key={s} bg="#1F2937" color="#FFFFFF" border="#1F2937">{s}</Badge>)}
                </BadgeRow>
              </div>
            )}
          </section>

          {/* PREMISES */}
          <section style={{ border: `1px solid ${C.border}`, borderRadius: 10, padding: 16 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
              <SectionTitle>{language === "PT" ? "Premissas Financeiras" : "Financial Premises"}</SectionTitle>
              <span style={{ fontSize: 11, color: C.green, fontWeight: 600, display: "inline-flex", alignItems: "center", gap: 4 }}>
                <Sparkles size={12} /> {language === "PT" ? "Estimativas pré-preenchidas" : "Pre-filled estimates"}
              </span>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
              {fields.map((f) => (
                <div key={f.key}>
                  <div style={{ fontSize: 11, fontWeight: 600, color: C.primary, marginBottom: 4 }}>{f.label}</div>
                  <input
                    type="number"
                    value={premises[f.key]}
                    onChange={(e) => updateField(f.key, e.target.value)}
                    style={{ width: "100%", padding: "8px 10px", border: `1px solid ${C.border}`, borderRadius: 6, fontSize: 13, color: C.text, outline: "none" }}
                  />
                </div>
              ))}
            </div>
            <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 12 }}>
              <button onClick={() => setCalculated(true)} style={{ padding: "9px 16px", background: C.primary, color: C.white, border: "none", borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
                {language === "PT" ? "Calcular Business Case" : "Calculate Business Case"}
              </button>
            </div>
          </section>

          {/* RESULTS */}
          {calculated && (
            <>
              <section>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12 }}>
                  <div style={{ borderLeft: `4px solid ${C.primary}`, background: C.white, border: `1px solid ${C.border}`, borderRadius: 10, padding: 14 }}>
                    <div style={{ fontSize: 11, color: C.muted, fontWeight: 600 }}>ROI</div>
                    <div style={{ fontSize: 22, fontWeight: 700, color: result.roi >= 0 ? C.green : "#DC2626", marginTop: 6 }}>{result.roi}%</div>
                  </div>
                  <div style={{ borderLeft: `4px solid ${C.primary}`, background: C.white, border: `1px solid ${C.border}`, borderRadius: 10, padding: 14 }}>
                    <div style={{ fontSize: 11, color: C.muted, fontWeight: 600 }}>Payback</div>
                    <div style={{ fontSize: 22, fontWeight: 700, color: C.text, marginTop: 6 }}>{result.payback}</div>
                    <div style={{ fontSize: 11, color: C.muted }}>{language === "PT" ? "meses" : "months"}</div>
                  </div>
                  <div style={{ borderLeft: `4px solid ${C.primary}`, background: C.white, border: `1px solid ${C.border}`, borderRadius: 10, padding: 14 }}>
                    <div style={{ fontSize: 11, color: C.muted, fontWeight: 600 }}>NPV</div>
                    <div style={{ fontSize: 18, fontWeight: 700, color: result.npv >= 0 ? C.green : "#DC2626", marginTop: 6 }}>{fmt(result.npv)}</div>
                  </div>
                  <div style={{ borderLeft: `4px solid ${C.primary}`, background: C.white, border: `1px solid ${C.border}`, borderRadius: 10, padding: 14 }}>
                    <div style={{ fontSize: 11, color: C.muted, fontWeight: 600 }}>Benefit-to-Cost</div>
                    <div style={{ fontSize: 22, fontWeight: 700, color: result.btc >= 1 ? C.green : "#DC2626", marginTop: 6 }}>{result.btc}x</div>
                  </div>
                </div>
              </section>

              <section style={{ borderLeft: `4px solid ${C.green}`, background: C.white, border: `1px solid ${C.border}`, borderRadius: 10, padding: 16 }}>
                <h4 style={{ fontSize: 13, fontWeight: 700, color: C.text, margin: "0 0 12px", display: "flex", alignItems: "center", gap: 6 }}>
                  <TrendingUp size={14} style={{ color: C.green }} /> Executive Summary
                </h4>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, fontSize: 13 }}>
                  <div>
                    <div style={{ color: C.primary, fontSize: 11, fontWeight: 600 }}>Total Investment</div>
                    <div style={{ fontWeight: 700, color: C.text }}>{fmt(result.totalInvestment)}</div>
                  </div>
                  <div>
                    <div style={{ color: C.primary, fontSize: 11, fontWeight: 600 }}>
                      Net Benefit ({premises.horizon_years} {language === "PT" ? "anos" : "years"})
                    </div>
                    <div style={{ fontWeight: 700, color: C.text }}>{fmt(result.netBenefit)}</div>
                  </div>
                  <div>
                    <div style={{ color: C.primary, fontSize: 11, fontWeight: 600 }}>Annual Savings</div>
                    <div style={{ fontWeight: 700, color: C.text }}>{fmt(result.annualSavings)}</div>
                  </div>
                  <div>
                    <div style={{ color: C.primary, fontSize: 11, fontWeight: 600 }}>Discount Rate</div>
                    <div style={{ fontWeight: 700, color: C.text }}>{premises.wacc}%</div>
                  </div>
                </div>
              </section>
            </>
          )}
        </div>

        <div style={{ padding: "14px 24px", borderTop: `1px solid ${C.border}`, display: "flex", justifyContent: "flex-end", gap: 10, background: "#FAFBFF" }}>
          <button onClick={() => alert(language === "PT" ? "Exportação de PDF em breve." : "PDF export coming soon.")} style={{ padding: "9px 16px", background: C.white, color: C.primary, border: `1px solid ${C.primary}`, borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
            {language === "PT" ? "Exportar PDF" : "Export PDF"}
          </button>
          <button onClick={() => { alert(language === "PT" ? "Business Case salvo." : "Business Case saved."); onClose(); }} style={{ padding: "9px 16px", background: C.primary, color: C.white, border: "none", borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
            {language === "PT" ? "Salvar Business Case" : "Save Business Case"}
          </button>
        </div>
      </div>
    </div>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h3 style={{ fontSize: 11, fontWeight: 700, letterSpacing: "1px", textTransform: "uppercase", color: C.muted, margin: "0 0 12px" }}>
      {children}
    </h3>
  );
}
function Subtle({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return <div style={{ fontSize: 11, fontWeight: 600, color: C.muted, marginBottom: 6, ...style }}>{children}</div>;
}
function BadgeRow({ children }: { children: React.ReactNode }) {
  return <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>{children}</div>;
}
function Badge({ children, bg, color, border }: { children: React.ReactNode; bg: string; color: string; border: string }) {
  return (
    <span style={{
      fontSize: 11, fontWeight: 600, padding: "4px 10px", borderRadius: 999,
      background: bg, color, border: `1px solid ${border}`,
    }}>
      {children}
    </span>
  );
}
function ProjectionCard({ label, value, accent, footer }: { label: string; value: string; accent: string; footer?: React.ReactNode }) {
  return (
    <div style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: 10, padding: 14 }}>
      <div style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: "1px", textTransform: "uppercase", color: C.muted, marginBottom: 8 }}>
        {label}
      </div>
      <div style={{ fontSize: 22, fontWeight: 700, color: accent, lineHeight: 1.1, letterSpacing: "-0.4px" }}>
        {value}
      </div>
      {footer && <div style={{ marginTop: 6, fontSize: 11 }}>{footer}</div>}
    </div>
  );
}
function ReturnCard({ label, value, bg }: { label: string; value: string; bg: string }) {
  return (
    <div style={{ background: bg, color: "#FFFFFF", borderRadius: 10, padding: 18 }}>
      <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "1px", textTransform: "uppercase", opacity: 0.85, marginBottom: 8 }}>
        {label}
      </div>
      <div style={{ fontSize: 28, fontWeight: 700, lineHeight: 1, letterSpacing: "-0.5px" }}>
        {value}
      </div>
    </div>
  );
}

function ConnectionDiagram({ cluster, accent, language, onUseCaseClick }: { cluster: Cluster; accent: string; language: string; onUseCaseClick?: (uc: DemoUseCase) => void }) {
  const ucs = cluster.useCases;
  const procs = cluster.processes;
  const rowH = 44;
  const height = Math.max(ucs.length, procs.length) * rowH + 20;
  const width = 720;
  const leftX = 16;
  const rightX = width - 16;
  const colW = 240;

  // y positions
  const ucY = (i: number) => 24 + i * rowH;
  const pY = (i: number) => 24 + i * rowH;

  // edges: connect each uc to processes that have it (all do, by definition of cluster grouping)
  return (
    <div style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: 8, padding: 12, overflow: "auto" }}>
      <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "1px", textTransform: "uppercase", color: C.muted, marginBottom: 8 }}>
        {language === "PT" ? "Conexões do cluster" : "Cluster connections"}
      </div>
      <svg width={width} height={height} style={{ display: "block" }}>
        {/* edges */}
        {ucs.map((u, i) =>
          procs.map((p, j) => (
            <path
              key={`${u.id}-${p.id}`}
              d={`M ${leftX + colW} ${ucY(i)} C ${(leftX + colW + rightX - colW) / 2} ${ucY(i)}, ${(leftX + colW + rightX - colW) / 2} ${pY(j)}, ${rightX - colW} ${pY(j)}`}
              stroke={accent} strokeOpacity={0.35} strokeWidth={1.5} fill="none"
            />
          )),
        )}
        {/* uc nodes */}
        {ucs.map((u, i) => (
          <g key={u.id} onClick={() => onUseCaseClick?.(u)} style={{ cursor: onUseCaseClick ? "pointer" : "default" }}>
            <rect x={leftX} y={ucY(i) - 14} width={colW} height={28} rx={6}
              fill={accent + "1A"} stroke={accent + "55"} />
            <text x={leftX + 12} y={ucY(i) + 4} fontSize="11" fontWeight={600} fill={accent}>
              {u.title.length > 28 ? u.title.slice(0, 28) + "…" : u.title}
            </text>
          </g>
        ))}
        {/* process nodes */}
        {procs.map((p, j) => (
          <g key={p.id}>
            <rect x={rightX - colW} y={pY(j) - 14} width={colW} height={28} rx={6}
              fill="#FFFFFF" stroke={C.border} />
            <text x={rightX - colW + 12} y={pY(j) + 4} fontSize="11" fontWeight={600} fill={C.text}>
              {p.name.length > 28 ? p.name.slice(0, 28) + "…" : p.name}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
}

function ProcessMiniCard({ process, onClick, language }: { process: ProcessData; onClick: () => void; language: string }) {
  const a = process.automation?.maturity ?? 0;
  const d = process.dataIntegrity?.maturity ?? 0;
  const g = process.governance?.maturity ?? 0;
  return (
    <div
      onClick={onClick}
      style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: 8, padding: 14, cursor: "pointer" }}
      className="hover:border-primary"
    >
      <div style={{ fontSize: 13, fontWeight: 600, color: C.text, marginBottom: 4, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
        {process.name}
      </div>
      <div style={{ fontSize: 11, color: C.muted, marginBottom: 10 }}>{process.area}</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 10 }}>
        <MiniBar label={language === "PT" ? "Auto." : "Auto."} value={a} color={C.primary} />
        <MiniBar label={language === "PT" ? "Dados" : "Data"} value={d} color="#0EA5E9" />
        <MiniBar label="Comp." value={g} color="#8B5CF6" />
      </div>
    </div>
  );
}

function MiniBar({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11 }}>
      <span style={{ width: 36, color: C.muted }}>{label}</span>
      <div style={{ flex: 1, height: 5, background: "#F0F1F5", borderRadius: 3, overflow: "hidden" }}>
        <div style={{ width: `${value}%`, height: "100%", background: color }} />
      </div>
      <span style={{ width: 28, textAlign: "right", color: C.text, fontWeight: 600 }}>{value}%</span>
    </div>
  );
}

/* =================== TAB 3: PRIORITIZED & TRACKING =================== */
function hasPipelineRun(p: ProcessData) {
  return Array.isArray(p.useCases) && p.useCases.length > 0;
}

function PrioritizedKpi({ label, value, sub, color, bg, icon }: {
  label: string; value: string | number; sub?: string; color: string; bg: string; icon: React.ReactNode;
}) {
  return (
    <div style={{ background: C.white, border: `1px solid ${C.border}`, borderLeft: `4px solid ${color}`, borderRadius: 10, padding: 18, display: "flex", flexDirection: "column", gap: 8 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: "1px", textTransform: "uppercase", color: C.muted }}>{label}</span>
        <span style={{ width: 30, height: 30, borderRadius: 7, background: bg, color, display: "flex", alignItems: "center", justifyContent: "center" }}>{icon}</span>
      </div>
      <div style={{ fontSize: 30, fontWeight: 700, color, letterSpacing: "-0.6px", lineHeight: 1 }}>{value}</div>
      {sub && <div style={{ fontSize: 11, color: C.muted }}>{sub}</div>}
    </div>
  );
}

function PrioritizedView({ language }: { language: string }) {
  const navigate = useNavigate();
  const allProcesses = useProcessStore((s) => s.processes);
  const { ids, remove } = usePrioritized();
  const { label: lvl } = useTaxonomy();
  const [esteiraFilter, setEsteiraFilter] = useState<"all" | "done" | "pending">("all");
  const fullList = useMemo(() => {
    return ids
      .map((id) => allProcesses.find((p) => p.id === id))
      .filter(Boolean) as ProcessData[];
  }, [ids, allProcesses]);
  const list = useMemo(() => {
    if (esteiraFilter === "done") return fullList.filter((p) => hasPipelineRun(p));
    if (esteiraFilter === "pending") return fullList.filter((p) => !hasPipelineRun(p));
    return fullList;
  }, [fullList, esteiraFilter]);

  const total = fullList.length;
  const withDoc = fullList.filter((p) => p.hasDocumentation).length;
  const inPipeline = fullList.filter((p) => hasPipelineRun(p)).length;
  const pendingPipeline = fullList.filter((p) => !hasPipelineRun(p)).length;
  const noAction = fullList.filter((p) => !p.hasDocumentation && !hasPipelineRun(p)).length;
  const pct = (n: number) => total > 0 ? Math.round((n / total) * 100) : 0;

  // Progress segments — split by esteira (since all priorizados devem ter doc)
  const segments = [
    { key: "pipeline", label: language === "PT" ? "Já passaram pela esteira" : "Pipeline completed", count: inPipeline, color: "#8B5CF6" },
    { key: "pending", label: language === "PT" ? "Pendente de esteira" : "Pipeline pending", count: pendingPipeline, color: "#D97706" },
  ];
  const segTotal = Math.max(1, segments.reduce((s, x) => s + x.count, 0));

  const exportExcel = async () => {
    const XLSX = await import("xlsx");
    const rows = list.map((p, i) => ({
      "#": i + 1,
      Processo: p.name,
      L1: p.l1 || "",
      L2: p.l2 || "",
      Score: compositeScore(p),
      "Ganho (h/mês)": monthlyHours(p),
      Documentação: p.hasDocumentation ? `POP v${p.version || "1.0"}` : "—",
      Esteira: hasPipelineRun(p) ? `${(p.useCases ?? []).length} casos de uso` : "Pendente",
      Status: STATUS_META[statusOf(compositeScore(p))][language === "PT" ? "labelPT" : "labelEN"],
    }));
    const ws = XLSX.utils.json_to_sheet(rows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Priorizados");
    XLSX.writeFile(wb, `priorizados-${new Date().toISOString().slice(0, 10)}.xlsx`);
  };

  const exportPdf = async () => {
    const { default: jsPDF } = await import("jspdf");
    const doc = new jsPDF({ unit: "pt", format: "a4" });
    const W = doc.internal.pageSize.getWidth();
    let y = 50;
    doc.setFontSize(18); doc.setFont("helvetica", "bold");
    doc.text(language === "PT" ? "Relatório Executivo — Priorizados" : "Executive Report — Prioritized", 40, y);
    y += 22;
    doc.setFontSize(10); doc.setFont("helvetica", "normal"); doc.setTextColor(100);
    doc.text(new Date().toLocaleString("pt-BR"), 40, y); y += 24;
    doc.setTextColor(0); doc.setFontSize(11); doc.setFont("helvetica", "bold");
    doc.text(`Total: ${total}`, 40, y);
    doc.text(`Com Doc: ${withDoc} (${pct(withDoc)}%)`, 160, y);
    doc.text(`Esteira: ${inPipeline} (${pct(inPipeline)}%)`, 320, y);
    doc.text(`Sem Ação: ${noAction} (${pct(noAction)}%)`, 460, y);
    y += 26;
    doc.setFont("helvetica", "bold"); doc.setFontSize(10);
    doc.text("#", 40, y); doc.text("Processo", 60, y); doc.text(`${lvl("l1")}/${lvl("l2")}`, 250, y);
    doc.text("Score", 380, y); doc.text("Doc", 420, y); doc.text("Esteira", 470, y);
    y += 6; doc.setLineWidth(0.5); doc.line(40, y, W - 40, y); y += 14;
    doc.setFont("helvetica", "normal");
    list.forEach((p, i) => {
      if (y > 780) { doc.addPage(); y = 50; }
      doc.text(String(i + 1), 40, y);
      doc.text((p.name || "").slice(0, 38), 60, y);
      doc.text([p.l1, p.l2].filter(Boolean).join(" › ").slice(0, 24), 250, y);
      doc.text(String(compositeScore(p)), 380, y);
      doc.text(p.hasDocumentation ? "Sim" : "—", 420, y);
      doc.text(hasPipelineRun(p) ? `${(p.useCases ?? []).length}` : "—", 470, y);
      y += 16;
    });
    doc.save(`relatorio-priorizados-${new Date().toISOString().slice(0, 10)}.pdf`);
  };

  if (total === 0) {
    return (
      <div style={{ background: C.white, border: `1px dashed ${C.border}`, borderRadius: 10, padding: 60, textAlign: "center" }}>
        <ListChecks size={32} style={{ color: C.muted, marginBottom: 12 }} />
        <h3 style={{ fontSize: 16, fontWeight: 700, color: C.text, margin: 0, marginBottom: 6 }}>
          {language === "PT" ? "Nenhum processo priorizado ainda" : "No prioritized processes yet"}
        </h3>
        <p style={{ fontSize: 13, color: C.muted, margin: 0, maxWidth: 480, marginInline: "auto", lineHeight: 1.6 }}>
          {language === "PT"
            ? "Adicione processos pela checkbox da tabela de ranking ou pelo botão no drawer de drill-down da Visão Executiva."
            : "Add processes via the ranking table checkbox or the drill-down drawer button in the Executive View."}
        </p>
      </div>
    );
  }

  return (
    <div>
      {/* KPIs */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 18 }}>
        <PrioritizedKpi
          label={language === "PT" ? "Total Priorizados" : "Total Prioritized"}
          value={total} color={C.primary} bg={C.primarySoft} icon={<ListChecks size={16} />}
        />
        <PrioritizedKpi
          label={language === "PT" ? "Com Documentação" : "With Documentation"}
          value={withDoc} sub={`${pct(withDoc)}% ${language === "PT" ? "do total" : "of total"}`}
          color="#15803D" bg="#DCFCE7" icon={<FileText size={16} />}
        />
        <PrioritizedKpi
          label={language === "PT" ? "Na Esteira de Transformação" : "In Transformation Pipeline"}
          value={inPipeline} sub={`${pct(inPipeline)}% ${language === "PT" ? "do total" : "of total"}`}
          color="#8B5CF6" bg="#EDE9FE" icon={<Workflow size={16} />}
        />
        <PrioritizedKpi
          label={language === "PT" ? "Sem Ação Definida" : "No Action Defined"}
          value={noAction} color="#D97706" bg="#FEF3C7" icon={<AlertTriangle size={16} />}
        />
      </div>

      {/* Progress bar */}
      <div style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: 10, padding: 18, marginBottom: 18 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
          <h3 style={{ fontSize: 13, fontWeight: 700, color: C.text, margin: 0, letterSpacing: "-0.2px" }}>
            {language === "PT" ? "Distribuição da Carteira" : "Portfolio Distribution"}
          </h3>
          <span style={{ fontSize: 11, color: C.muted }}>{total} {language === "PT" ? "priorizados" : "prioritized"}</span>
        </div>
        <div style={{ display: "flex", height: 28, borderRadius: 6, overflow: "hidden", border: `1px solid ${C.border}` }}>
          {segments.map((s) => {
            const w = (s.count / segTotal) * 100;
            if (w <= 0) return null;
            return (
              <div key={s.key} style={{
                width: `${w}%`, background: s.color, color: C.white,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 11, fontWeight: 700,
              }} title={`${s.label}: ${s.count}`}>
                {Math.round(w)}%
              </div>
            );
          })}
        </div>
        <div style={{ display: "flex", gap: 16, marginTop: 10, fontSize: 11, color: C.muted, flexWrap: "wrap" }}>
          {segments.map((s) => (
            <span key={s.key} style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
              <span style={{ width: 10, height: 10, background: s.color, borderRadius: 2 }} />
              {s.label} ({s.count})
            </span>
          ))}
        </div>
      </div>

      {/* Segmentation tabs — by esteira status */}
      <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
        {([
          { key: "all", label: language === "PT" ? `Todos (${fullList.length})` : `All (${fullList.length})` },
          { key: "done", label: language === "PT" ? `Já passaram pela esteira (${inPipeline})` : `Pipeline completed (${inPipeline})` },
          { key: "pending", label: language === "PT" ? `Pendente de esteira (${pendingPipeline})` : `Pipeline pending (${pendingPipeline})` },
        ] as const).map((opt) => {
          const active = esteiraFilter === opt.key;
          return (
            <button key={opt.key} onClick={() => setEsteiraFilter(opt.key)} style={{
              padding: "8px 14px", borderRadius: 8, fontSize: 12.5, fontWeight: 600, cursor: "pointer",
              background: active ? C.primary : C.white, color: active ? C.white : C.text,
              border: `1px solid ${active ? C.primary : C.border}`,
            }}>{opt.label}</button>
          );
        })}
      </div>

      {/* Table */}
      <div style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: 10, overflow: "hidden" }}>
        <div style={{
          display: "grid", gridTemplateColumns: "40px 2fr 1.4fr 70px 1.3fr 1.3fr 1.2fr 32px",
          gap: 12, padding: "12px 18px", background: "#FAFBFF", borderBottom: `1px solid ${C.border}`,
          fontSize: 10.5, fontWeight: 700, letterSpacing: "1px", textTransform: "uppercase", color: "#A5A7B0",
        }}>
          <span>#</span>
          <span>{language === "PT" ? "Processo" : "Process"}</span>
          <span>{language === "PT" ? "Cadeia de Valor" : "Value Chain"}</span>
          <span>Score</span>
          <span>{language === "PT" ? "Documentação" : "Documentation"}</span>
          <span>{language === "PT" ? "Esteira" : "Pipeline"}</span>
          <span>{language === "PT" ? "Ação" : "Action"}</span>
          <span></span>
        </div>
        {list.map((p, i) => {
          const score = compositeScore(p);
          const meta = STATUS_META[statusOf(score)];
          const ran = hasPipelineRun(p);
          const ucCount = (p.useCases ?? []).length;
          return (
            <div key={p.id} style={{
              display: "grid", gridTemplateColumns: "40px 2fr 1.4fr 70px 1.3fr 1.3fr 1.2fr 32px",
              gap: 12, padding: "14px 18px", alignItems: "center",
              borderBottom: `1px solid #F0F1F5`, fontSize: 13, color: C.text,
            }}>
              <span style={{ fontSize: 12, fontWeight: 700, color: C.muted }}>{i + 1}</span>
              <div onClick={() => navigate(`/processes/${p.id}`)} style={{ cursor: "pointer" }}>
                <div style={{ fontWeight: 600 }}>{p.name}</div>
                <div style={{ fontSize: 11, color: C.muted, marginTop: 2 }}>{p.area}</div>
              </div>
              <div style={{ fontSize: 11, color: C.muted }}>{[p.l1, p.l2].filter(Boolean).join(" › ") || "—"}</div>
              <div style={{ fontWeight: 700, color: meta.color }}>{score}</div>
              {/* Doc badge */}
              <div>
                {p.hasDocumentation ? (
                  <button onClick={() => navigate(`/processes/${p.id}`)} style={{
                    display: "inline-flex", alignItems: "center", gap: 6, padding: "4px 10px",
                    background: "#DCFCE7", color: "#15803D", border: "none", borderRadius: 999,
                    fontSize: 11, fontWeight: 600, cursor: "pointer",
                  }}>
                    <FileText size={11} /> POP v{p.version || "1.0"}
                  </button>
                ) : (
                  <span style={{
                    display: "inline-flex", alignItems: "center", gap: 6, padding: "4px 10px",
                    background: "#F3F4F6", color: C.muted, borderRadius: 999, fontSize: 11, fontWeight: 600,
                  }}>{language === "PT" ? "Sem doc." : "No doc."}</span>
                )}
              </div>
              {/* Pipeline badge */}
              <div>
                {ran ? (
                  <span style={{
                    display: "inline-flex", alignItems: "center", gap: 6, padding: "4px 10px",
                    background: "#EDE9FE", color: "#6D28D9", borderRadius: 999, fontSize: 11, fontWeight: 600,
                  }}>
                    <Sparkles size={11} /> {ucCount} {language === "PT" ? "oport." : "opps."}
                  </span>
                ) : (
                  <span style={{
                    display: "inline-flex", alignItems: "center", gap: 6, padding: "4px 10px",
                    background: "#FEF3C7", color: "#92400E", borderRadius: 999, fontSize: 11, fontWeight: 600,
                  }}>{language === "PT" ? "Pendente" : "Pending"}</span>
                )}
              </div>
              {/* Action */}
              <div>
                {ran ? (
                  <button onClick={() => navigate(`/saved-use-cases`)} style={{
                    padding: "6px 12px", background: C.primarySoft, color: C.primary, border: "none",
                    borderRadius: 6, fontSize: 12, fontWeight: 600, cursor: "pointer",
                  }}>{language === "PT" ? "Ver Oportunidades" : "View Opportunities"}</button>
                ) : (
                  <button onClick={() => navigate(`/org-intelligence-hub/transform`)} style={{
                    padding: "6px 12px", background: C.primary, color: C.white, border: "none",
                    borderRadius: 6, fontSize: 12, fontWeight: 600, cursor: "pointer",
                  }}>{language === "PT" ? "Iniciar Esteira" : "Start Pipeline"}</button>
                )}
              </div>
              <button
                onClick={() => remove(p.id)} aria-label="Remove"
                style={{ background: "transparent", border: "none", color: C.muted, cursor: "pointer", padding: 4 }}
                className="hover:text-[#DC2626]"
              ><X size={14} /></button>
            </div>
          );
        })}

        {/* Footer */}
        <div style={{ padding: "14px 18px", background: "#FAFBFF", borderTop: `1px solid ${C.border}`, display: "flex", gap: 10, justifyContent: "flex-end" }}>
          <button onClick={exportExcel} style={{
            display: "inline-flex", alignItems: "center", gap: 8, padding: "9px 14px",
            background: C.white, color: C.text, border: `1px solid ${C.border}`, borderRadius: 8,
            fontSize: 12.5, fontWeight: 600, cursor: "pointer",
          }}>
            <Download size={14} /> {language === "PT" ? "Exportar lista (Excel)" : "Export list (Excel)"}
          </button>
          <button onClick={exportPdf} style={{
            display: "inline-flex", alignItems: "center", gap: 8, padding: "9px 14px",
            background: C.primary, color: C.white, border: "none", borderRadius: 8,
            fontSize: 12.5, fontWeight: 600, cursor: "pointer",
          }}>
            <FileDown size={14} /> {language === "PT" ? "Gerar relatório (PDF)" : "Generate report (PDF)"}
          </button>
        </div>
      </div>
    </div>
  );
}
