import { useNavigate } from "react-router-dom";
import {
  Sparkles, Zap, Users, DollarSign, Shield, TrendingUp, AlertTriangle,
  Bookmark, ArrowRight, Lightbulb, Check, CheckCircle, ArrowLeft,
  RefreshCw, Download, LayoutDashboard, BarChart3, Network as NetworkIcon,
  AlertTriangle as AlertIcon, ChevronRight, Flame,
  MessageCircle, UserCheck, Activity, Briefcase, ArrowUp, ArrowDown,
  ShieldCheck, ShieldAlert, Search, List, LayoutGrid, Trash2, ExternalLink, Layers,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import {
  mockOpportunities, mockBenchmarks, mockValueLeverImpacts, mockRisks,
  MockOpportunity, ValueLever, VALUE_LEVERS, ImpactLevel, impactScore, effortScore,
} from "@/data/discoverMockData";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { IndicatorSummary } from "./IndicatorsPanel";
import {
  useOpportunityStore, SavedOpportunitySourceMode,
} from "@/stores/opportunityStore";

interface Props {
  mode: "simulate" | "goal" | "scope";
  title: string;
  subtitle?: string;
  summary: IndicatorSummary;
  goalChip?: string;
  opportunities?: MockOpportunity[];
  sourceMode?: SavedOpportunitySourceMode;
  sourceContext?: string;
  onReset?: () => void;
  onBack?: () => void;
  focusLever?: ValueLever;
}

const LEVER_ICONS: Record<ValueLever, React.ReactNode> = {
  "Eficiência Operacional": <Zap size={16} />,
  "Experiência do Colaborador": <Users size={16} />,
  "Custo Operacional": <DollarSign size={16} />,
  "Qualidade & Compliance": <Shield size={16} />,
  "Velocidade de Decisão": <TrendingUp size={16} />,
};

const MODE_LABEL: Record<Props["mode"], string> = {
  simulate: "Simular Iniciativa",
  goal: "Atingir Objetivo",
  scope: "Explorar Escopo",
};

const NAV_ITEMS = [
  { id: "section-resumo", label: "Resumo", icon: LayoutDashboard },
  { id: "section-alavancas", label: "Alavancas & Benchmarking", icon: Zap },
  { id: "section-oportunidades", label: "Oportunidades", icon: Sparkles },
  { id: "section-correlacoes", label: "Mapa de Correlações", icon: NetworkIcon },
  { id: "section-riscos", label: "Riscos", icon: AlertIcon },
];

function leverWeight(l: ImpactLevel): number {
  return l === "Alto" ? 3 : l === "Médio" ? 2 : l === "Baixo" ? 1 : 0;
}

function buildTransformParams(op: MockOpportunity): string {
  const processName = op.impactedProcesses[0]?.name ?? "";
  return `?${new URLSearchParams({ opportunityId: op.id, processName, context: op.title }).toString()}`;
}

export function UnifiedResults({
  mode, title, subtitle, summary, goalChip,
  opportunities = mockOpportunities,
  sourceMode, sourceContext, onReset, onBack, focusLever,
}: Props) {
  const ops = opportunities;
  const principalLever = focusLever ?? ((Object.entries(mockValueLeverImpacts)
    .sort((a, b) => leverWeight(b[1].level) - leverWeight(a[1].level))[0]?.[0]) as ValueLever);
  const totalProcesses = ops.reduce((acc, o) => acc + o.impactedProcesses.length, 0);

  const [detailOp, setDetailOp] = useState<MockOpportunity | null>(null);
  const [activeSection, setActiveSection] = useState("section-resumo");
  const [activeTab, setActiveTab] = useState<"overview" | "usecases">("overview");
  const [scrollProgress, setScrollProgress] = useState(0); // 0..1
  const contentRef = useRef<HTMLDivElement>(null);

  // Smooth header collapse driven by scroll progress (premium UX)
  useEffect(() => {
    const root = contentRef.current;
    if (!root) return;
    let raf = 0;
    const SCROLL_RANGE = 220; // px over which header collapses
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        const p = Math.min(1, Math.max(0, root.scrollTop / SCROLL_RANGE));
        // ease-out cubic for natural deceleration
        const eased = 1 - Math.pow(1 - p, 3);
        setScrollProgress(eased);
      });
    };
    root.addEventListener("scroll", onScroll, { passive: true });
    return () => { root.removeEventListener("scroll", onScroll); if (raf) cancelAnimationFrame(raf); };
  }, []);

  const HEADER_MAX = 360;
  const HEADER_MIN = 72;
  const headerHeight = HEADER_MAX - (HEADER_MAX - HEADER_MIN) * scrollProgress;

  const effectiveSourceMode: SavedOpportunitySourceMode = sourceMode ?? mode;
  const effectiveSourceContext = sourceContext ?? title;

  const savedCount = useOpportunityStore((s) =>
    s.savedOpportunities.filter((so) => ops.some((o) => o.id === so.originalId)).length
  );

  // Scroll spy
  useEffect(() => {
    const root = contentRef.current;
    if (!root) return;
    const sections = root.querySelectorAll("[id^='section-']");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveSection(entry.target.id);
        });
      },
      { root, rootMargin: "-20% 0px -70% 0px", threshold: 0 }
    );
    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  const scrollTo = (id: string) => {
    const el = contentRef.current?.querySelector(`#${id}`);
    el?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const dateStr = new Date().toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric" });

  return (
    <div style={{
      width: "100vw",
      marginLeft: "calc(50% - 50vw)",
      marginRight: "calc(50% - 50vw)",
      background: "#F4F5F8",
      display: "flex",
      flexDirection: "column",
    }}>
      {/* EXECUTIVE BANNER (action buttons embedded inside) */}
      <ExecutiveBanner
        mode={mode}
        title={title}
        subtitle={subtitle}
        ops={ops}
        principalLever={principalLever}
        totalProcesses={totalProcesses}
        summary={summary}
        date={dateStr}
        goalChip={goalChip}
        progress={scrollProgress}
        height={headerHeight}
        onReset={onReset}
      />

      {/* TABS */}
      <div style={{
        background: "#FFFFFF",
        borderBottom: "1px solid #EAEBEF",
        display: "flex",
        alignItems: "center",
        padding: "0 40px",
        gap: 4,
        flexShrink: 0,
      }}>
        {[
          { id: "overview" as const, label: "Visão Geral", icon: LayoutDashboard },
          { id: "usecases" as const, label: "Casos de Uso", icon: Sparkles },
        ].map((t) => {
          const Icon = t.icon;
          const active = activeTab === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              style={{
                display: "inline-flex", alignItems: "center", gap: 8,
                padding: "14px 18px", border: "none", background: "transparent",
                fontSize: 13, fontWeight: active ? 700 : 500,
                color: active ? "#0C1BA8" : "#6B7280",
                borderBottom: `2px solid ${active ? "#0C1BA8" : "transparent"}`,
                cursor: "pointer", marginBottom: -1,
              }}
            >
              <Icon size={15} /> {t.label}
            </button>
          );
        })}
      </div>

      {/* NAV + CONTENT */}
      <div style={{
        display: "flex",
        height: `calc(100vh - 56px - 49px - ${headerHeight}px)`,
        minHeight: 520,
        overflow: "hidden",
      }}>
        {activeTab === "overview" ? (
          <>
            {/* LEFT NAV */}
            <aside style={{
              width: 220, flexShrink: 0, background: "#FFFFFF",
              borderRight: "1px solid #EAEBEF", padding: "24px 0",
              overflowY: "auto",
            }}>
              <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "1px", color: "#A5A7B0", padding: "0 20px", marginBottom: 8, textTransform: "uppercase" }}>
                Seções
              </div>
              {NAV_ITEMS.map((item) => {
                const Icon = item.icon;
                const active = activeSection === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => scrollTo(item.id)}
                    onMouseEnter={(e) => { if (!active) e.currentTarget.style.background = "#F4F5F8"; }}
                    onMouseLeave={(e) => { if (!active) e.currentTarget.style.background = "transparent"; }}
                    style={{
                      display: "flex", alignItems: "center", gap: 10,
                      padding: "10px 20px", width: "100%", border: "none",
                      background: active ? "#F8F9FF" : "transparent",
                      borderLeft: `3px solid ${active ? "#0C1BA8" : "transparent"}`,
                      cursor: "pointer", transition: "all 0.15s",
                      fontSize: 13, fontWeight: active ? 600 : 500,
                      color: active ? "#0C1BA8" : "#6B7280",
                      textAlign: "left",
                    }}
                  >
                    <Icon size={16} style={{ color: active ? "#0C1BA8" : "#A5A7B0" }} />
                    {item.label}
                  </button>
                );
              })}
              <div style={{ borderTop: "1px solid #F0F1F5", margin: "16px 0", padding: "16px 16px 0" }}>
                <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "1px", color: "#A5A7B0", textTransform: "uppercase", marginBottom: 6 }}>Salvas</div>
                <div style={{ display: "flex", alignItems: "baseline", gap: 6, marginBottom: 8 }}>
                  <span style={{ fontSize: 20, fontWeight: 700, color: "#0C1BA8" }}>{savedCount}</span>
                  <span style={{ fontSize: 11, color: "#6B7280" }}>de {ops.length} oportunidades</span>
                </div>
                <div style={{ height: 4, background: "#EEF0FF", borderRadius: 999, overflow: "hidden" }}>
                  <div style={{ width: `${(savedCount / Math.max(1, ops.length)) * 100}%`, height: "100%", background: "#0C1BA8" }} />
                </div>
              </div>
            </aside>

            {/* CONTENT */}
            <div ref={contentRef} style={{ flex: 1, overflowY: "auto" }}>
              <ResumoSection ops={ops} summary={summary} />
              <AlavancasBenchmarkSection focusLever={principalLever} />
              <OportunidadesSection
                ops={ops}
                sourceMode={effectiveSourceMode}
                sourceContext={effectiveSourceContext}
                onOpenDetails={setDetailOp}
                onSeeMore={() => setActiveTab("usecases")}
              />
              <CorrelacoesSection ops={ops} sourceMode={effectiveSourceMode} sourceContext={effectiveSourceContext} onOpenDetails={setDetailOp} />
              <RiscosSection />
            </div>
          </>
        ) : (
          <UseCasesView
            ops={ops}
            sourceMode={effectiveSourceMode}
            sourceContext={effectiveSourceContext}
            onOpenDetails={setDetailOp}
          />
        )}
      </div>

      <DetailsModal
        op={detailOp}
        onClose={() => setDetailOp(null)}
        sourceMode={effectiveSourceMode}
        sourceContext={effectiveSourceContext}
      />
    </div>
  );
}

const bannerBtn: React.CSSProperties = {
  display: "inline-flex", alignItems: "center", gap: 6,
  fontSize: 12, color: "#FFFFFF",
  background: "rgba(255,255,255,0.10)",
  border: "1px solid rgba(255,255,255,0.22)",
  borderRadius: 8, padding: "5px 11px",
  cursor: "pointer", fontWeight: 500,
};

/* ======== Executive Banner ======== */
function ExecutiveBanner({
  mode, title, subtitle, ops, principalLever, totalProcesses, summary, date, goalChip, progress, height, onReset, onBack,
}: {
  mode: Props["mode"]; title: string; subtitle?: string; ops: MockOpportunity[];
  principalLever: ValueLever; totalProcesses: number; summary: IndicatorSummary;
  date: string; goalChip?: string; progress: number; height: number;
  onReset?: () => void; onBack?: () => void;
}) {
  const sentimentMeta = {
    positivo: { color: "#86EFAC", bg: "rgba(22,163,74,0.2)", label: "Positivo" },
    negativo: { color: "#FCA5A5", bg: "rgba(185,28,28,0.2)", label: "Negativo" },
    incerto:  { color: "#FCD34D", bg: "rgba(245,158,11,0.2)", label: "Incerto"  },
  }[summary.sentiment];

  // Interpolated values
  const expandedOpacity = Math.max(0, 1 - progress * 1.4); // fade out faster than collapse
  const compactOpacity = Math.max(0, (progress - 0.55) / 0.45); // fade in toward end
  const showCompact = progress > 0.55;

  return (
    <section style={{
      background: "linear-gradient(135deg, #04223D 0%, #0C1BA8 55%, #1428CC 100%)",
      color: "#FFFFFF",
      height,
      position: "sticky",
      top: 0,
      zIndex: 5,
      overflow: "hidden",
      display: "flex",
      flexDirection: "column",
      willChange: "height",
    }}>
      {/* COMPACT layer (absolute, fades in at end) */}
      {showCompact && (
        <div style={{
          position: "absolute", inset: 0, padding: "0 40px",
          display: "flex", alignItems: "center", gap: 20,
          opacity: compactOpacity, pointerEvents: compactOpacity > 0.5 ? "auto" : "none",
        }}>
          <span style={{
            background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.2)",
            borderRadius: 999, padding: "3px 10px", fontSize: 9, fontWeight: 700,
            color: "#FFF", textTransform: "uppercase", letterSpacing: "0.8px", flexShrink: 0,
          }}>{MODE_LABEL[mode]}</span>
          <h1 style={{
            fontSize: 15, fontWeight: 600, margin: 0, color: "#FFF",
            whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
            flex: 1, minWidth: 0,
          }}>{title}</h1>
          <div style={{ display: "flex", alignItems: "center", gap: 18, flexShrink: 0 }}>
            <CompactStat label="Oport." value={`${ops.length}`} />
            <CompactStat label="Processos" value={`${totalProcesses}`} />
            <CompactStat label="Ganho" value="R$ 1,8M/ano" />
            <div style={{ width: 1, height: 28, background: "rgba(255,255,255,0.15)" }} />
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ fontSize: 18, fontWeight: 700, color: "#FFF" }}>{summary.confidence}%</div>
              <span style={{
                display: "inline-flex", alignItems: "center", gap: 5,
                background: sentimentMeta.bg, color: sentimentMeta.color,
                padding: "2px 8px", borderRadius: 999, fontSize: 10, fontWeight: 700,
              }}>
                <span style={{ width: 5, height: 5, borderRadius: "50%", background: sentimentMeta.color }} />
                {sentimentMeta.label}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* EXPANDED layer (fades & translates out) */}
      <div style={{
        opacity: expandedOpacity,
        transform: `translateY(${-progress * 24}px)`,
        padding: "36px 40px 0 40px",
        pointerEvents: expandedOpacity > 0.5 ? "auto" : "none",
        flex: 1,
        display: "flex",
        flexDirection: "column",
      }}>
        <div style={{ display: "flex", gap: 32, flex: 1 }}>
          <div style={{ flex: 1, paddingBottom: 24 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
              {onBack && (
                <button onClick={onBack} style={{
                  display: "inline-flex", alignItems: "center", gap: 6,
                  fontSize: 12, color: "rgba(255,255,255,0.85)",
                  background: "rgba(255,255,255,0.10)", border: "1px solid rgba(255,255,255,0.18)",
                  borderRadius: 8, padding: "5px 11px", cursor: "pointer", fontWeight: 500,
                }}>
                  <ArrowLeft size={13} /> Trocar modo
                </button>
              )}
              <span style={{
                background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.2)",
                borderRadius: 999, padding: "4px 12px", fontSize: 10, fontWeight: 700,
                color: "#FFF", textTransform: "uppercase", letterSpacing: "0.8px",
              }}>{MODE_LABEL[mode]}</span>
              <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ fontSize: 11, color: "rgba(255,255,255,0.55)", marginRight: 8 }}>
                  Análise gerada em {date}
                </span>
                {onReset && (
                  <button onClick={onReset} style={bannerBtn}>
                    <RefreshCw size={12} /> Nova análise
                  </button>
                )}
                <button onClick={() => toast("Exportação em preparação")} style={bannerBtn}>
                  <Download size={12} /> Exportar
                </button>
                <button
                  onClick={() => toast.success("Análise salva")}
                  style={{ ...bannerBtn, background: "#FFF", color: "#0C1BA8", borderColor: "#FFF" }}
                >
                  <Bookmark size={12} /> Salvar tudo
                </button>
              </div>
            </div>
            <h1 style={{ fontSize: 26, fontWeight: 700, lineHeight: 1.3, maxWidth: 560, margin: "10px 0 0", color: "#FFF" }}>
              {title}
            </h1>
            {goalChip && (
              <div style={{
                marginTop: 12, display: "inline-flex", alignItems: "center", gap: 8,
                background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)",
                borderRadius: 8, padding: "6px 12px", fontSize: 12, color: "rgba(255,255,255,0.85)",
              }}>
                Objetivo: <b style={{ color: "#FFF" }}>{goalChip}</b>
              </div>
            )}
            <div style={{
              marginTop: 14, maxWidth: 620,
              background: "rgba(255,255,255,0.09)",
              border: "1px solid rgba(255,255,255,0.18)",
              borderLeft: "3px solid #86EFAC",
              borderRadius: 10, padding: "12px 16px",
              backdropFilter: "blur(6px)",
            }}>
              <div style={{
                fontSize: 9, fontWeight: 700, letterSpacing: "1.2px",
                color: "rgba(255,255,255,0.6)", textTransform: "uppercase", marginBottom: 6,
              }}>Síntese executiva</div>
              <p style={{ fontSize: 13.5, color: "#FFF", lineHeight: 1.6, margin: 0, fontWeight: 500 }}>
                {subtitle ?? `Análise focada em ${principalLever} consolidou ${ops.length} oportunidades com ${summary.confidence}% de confiança. Iniciativas se reforçam e habilitam ganho composto de R$ 1,8M/ano, com payback de 4 a 8 meses.`}
              </p>
            </div>
          </div>
          <div style={{ width: 280, flexShrink: 0, paddingBottom: 24 }}>
            <div style={{
              background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)",
              borderRadius: 14, padding: 20, backdropFilter: "blur(8px)",
            }}>
              <div style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: "0.8px", color: "rgba(255,255,255,0.5)", fontWeight: 700 }}>
                Confiança da Análise
              </div>
              <div style={{ fontSize: 52, fontWeight: 700, color: "#FFF", lineHeight: 1.1, margin: "6px 0 10px" }}>
                {summary.confidence}%
              </div>
              <div style={{ height: 6, background: "rgba(255,255,255,0.15)", borderRadius: 999, overflow: "hidden", marginBottom: 12 }}>
                <div style={{ width: `${summary.confidence}%`, height: "100%", background: "#FFF" }} />
              </div>
              <span style={{
                display: "inline-flex", alignItems: "center", gap: 6,
                background: sentimentMeta.bg, color: sentimentMeta.color,
                padding: "4px 10px", borderRadius: 999, fontSize: 11, fontWeight: 700,
              }}>
                <span style={{ width: 6, height: 6, borderRadius: "50%", background: sentimentMeta.color, animation: "pulse 2s infinite" }} />
                {sentimentMeta.label}
              </span>
              <div style={{ display: "flex", gap: 16, marginTop: 14, fontSize: 11, color: "rgba(255,255,255,0.6)" }}>
                <span><b style={{ color: "#FFF" }}>{summary.areas}</b> áreas</span>
                <span><b style={{ color: "#FFF" }}>{summary.processes}</b> processos</span>
                <span><b style={{ color: "#FFF" }}>{summary.systems}</b> sistemas</span>
              </div>
            </div>
          </div>
        </div>

        <div style={{
          marginLeft: -40, marginRight: -40,
          background: "rgba(0,0,0,0.2)", borderTop: "1px solid rgba(255,255,255,0.1)",
          padding: "0 40px", height: 60, display: "flex", alignItems: "center",
        }}>
          <Stat label="Oportunidades" value={`${ops.length}`} />
          <StatDivider />
          <Stat label="Alavanca Principal" value={principalLever} icon={LEVER_ICONS[principalLever]} small />
          <StatDivider />
          <Stat label="Processos a Ajustar" value={`${totalProcesses}`} />
          <StatDivider />
          <Stat label="Ganho Potencial" value="R$ 1,8M / ano" />
        </div>
      </div>
    </section>
  );
}

function Stat({ label, value, icon, small }: { label: string; value: string; icon?: React.ReactNode; small?: boolean }) {
  return (
    <div style={{ padding: "0 32px", display: "flex", flexDirection: "column", gap: 2 }}>
      <div style={{ fontSize: small ? 14 : 22, fontWeight: small ? 600 : 700, color: "#FFF", display: "flex", alignItems: "center", gap: 8 }}>
        {icon} {value}
      </div>
      <div style={{ fontSize: 10, fontWeight: 600, color: "rgba(255,255,255,0.5)", textTransform: "uppercase", letterSpacing: "0.5px" }}>
        {label}
      </div>
    </div>
  );
}
function CompactStat({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", lineHeight: 1.1 }}>
      <span style={{ fontSize: 13, fontWeight: 700, color: "#FFF" }}>{value}</span>
      <span style={{ fontSize: 9, fontWeight: 600, color: "rgba(255,255,255,0.55)", textTransform: "uppercase", letterSpacing: "0.5px" }}>{label}</span>
    </div>
  );
}
function StatDivider() {
  return <div style={{ width: 1, height: 36, background: "rgba(255,255,255,0.1)" }} />;
}

/* ======== Section: Resumo ======== */
function ResumoSection({ ops, summary }: { ops: MockOpportunity[]; summary: IndicatorSummary }) {
  const insights = [
    `${ops.length} oportunidades identificadas com payback médio de 6 meses.`,
    "Concentração em automação e padronização de processos transacionais.",
    "Quick wins representam 40% do ganho potencial total estimado.",
  ];
  return (
    <section id="section-resumo" style={{ padding: "32px 40px 0" }}>
      <div style={resultCard}>
        <Eyebrow>Destaques da análise</Eyebrow>
        <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 12 }}>
          {insights.map((t, i) => (
            <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
              <CheckCircle size={16} style={{ color: "#0C1BA8", flexShrink: 0, marginTop: 2 }} />
              <span style={{ fontSize: 13, color: "#374151", lineHeight: 1.5 }}>{t}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ======== Indicator Cluster Impact (radar + narrative) ======== */
type ClusterId = "voc" | "voe" | "ops" | "biz";
type ClusterEffect = "positivo" | "negativo";
type ClusterSize = "Pequeno" | "Médio" | "Grande";
type ClusterConfidence = "Alta" | "Média" | "Baixa";

interface ClusterDef {
  id: ClusterId;
  label: string;
  icon: React.ReactNode;
  score: number; // 0-5 for radar
  effect: ClusterEffect;
  size: ClusterSize;
  confidence: ClusterConfidence;
  summary: string;
  indicators: { name: string; trend: "up" | "down" | "neutral" }[];
  benefits: string[];
  risks: string[];
}

const CLUSTERS: ClusterDef[] = [
  {
    id: "voc",
    label: "Voice of Customer",
    icon: <MessageCircle size={14} />,
    score: 4.2,
    effect: "positivo",
    size: "Grande",
    confidence: "Alta",
    summary:
      "Upgrade de velocidade gratuito eleva a percepção de valor, mas a execução da migração em massa apresenta riscos para a satisfação. Aumentar a velocidade mínima para 400MB sem custo adicional é uma iniciativa com alto potencial de impacto positivo na percepção de qualidade e valor pelo cliente. Essa melhoria tangível no serviço deve fortalecer o relacionamento e a lealdade.",
    indicators: [
      { name: "IQP (Índice de Qualidade Percebida)", trend: "up" },
      { name: "NPS Ookla / Speedtest", trend: "up" },
      { name: "Contact Rate", trend: "down" },
      { name: "NPS Relacional (próprio)", trend: "up" },
      { name: "Churn Rate (Voluntário)", trend: "down" },
      { name: "NPS Transacional", trend: "neutral" },
      { name: "IR (Índice de Reclamações Anatel)", trend: "down" },
    ],
    benefits: [
      "Aumento da percepção de qualidade e valor, fortalecendo a satisfação geral do cliente com o serviço de banda larga.",
      "Redução do Churn Voluntário e aumento da retenção de clientes, que passam a ter um serviço mais competitivo pelo mesmo preço.",
    ],
    risks: [
      "Aumento no volume de contatos (Contact Rate) e reclamações em canais críticos (Anatel, Procon) devido a possíveis falhas técnicas durante a migração em massa.",
      "Queda no NPS Transacional para os clientes que enfrentarem problemas e precisarem contatar o suporte técnico, gerando experiência de esforço e frustração.",
      "Percepção negativa da marca caso a comunicação sobre a mudança seja falha, fazendo o cliente não perceber o benefício ou sentir que a mudança foi mal executada.",
    ],
  },
  {
    id: "voe",
    label: "Voice of Employee",
    icon: <UserCheck size={14} />,
    score: 3.4,
    effect: "positivo",
    size: "Médio",
    confidence: "Média",
    summary:
      "A automação de tarefas repetitivas reduz o atrito operacional do time de atendimento e provisionamento. eNPS projetado sobe ~12 pontos. O ganho pleno depende de gestão da mudança ativa e de capacitação nas áreas mais expostas à nova jornada digital.",
    indicators: [
      { name: "eNPS (Employee NPS)", trend: "up" },
      { name: "Turnover voluntário", trend: "down" },
      { name: "Tempo médio em tarefas manuais", trend: "down" },
      { name: "Índice de retrabalho", trend: "down" },
      { name: "Satisfação com ferramentas internas", trend: "up" },
    ],
    benefits: [
      "Redução de tarefas repetitivas libera o time para atividades de maior valor agregado.",
      "Maior clareza de processo reduz fricção entre áreas e melhora a percepção de suporte interno.",
    ],
    risks: [
      "Resistência à mudança em times mais antigos, exigindo plano estruturado de change management.",
      "Curva de aprendizado inicial pode causar queda temporária de produtividade.",
    ],
  },
  {
    id: "ops",
    label: "Métricas Operacionais",
    icon: <Activity size={14} />,
    score: 4.6,
    effect: "positivo",
    size: "Grande",
    confidence: "Alta",
    summary:
      "Forte impacto em throughput e SLA. Espera-se redução de 35–50% no tempo de ciclo dos processos transacionais e queda significativa de erros operacionais. A trilha de auditoria fortalecida mitiga 3 riscos críticos identificados.",
    indicators: [
      { name: "Tempo de ciclo (lead time)", trend: "down" },
      { name: "SLA de provisionamento", trend: "up" },
      { name: "Taxa de erro operacional", trend: "down" },
      { name: "Throughput de chamados/dia", trend: "up" },
      { name: "Backlog de pendências", trend: "down" },
    ],
    benefits: [
      "Aceleração do throughput de processos transacionais com payback médio estimado em 6 meses.",
      "Redução estrutural de erros operacionais e melhoria de auditabilidade ponta a ponta.",
    ],
    risks: [
      "Dependência de integrações com sistemas legados pode atrasar o ramp-up esperado.",
      "Picos sazonais de volume podem exigir reescala da infraestrutura no curto prazo.",
    ],
  },
  {
    id: "biz",
    label: "Métricas de Negócio",
    icon: <Briefcase size={14} />,
    score: 4.0,
    effect: "positivo",
    size: "Grande",
    confidence: "Média",
    summary:
      "R$ 1,8M/ano destraváveis em ganhos compostos de eficiência e retenção. 60% do valor concentrado em 3 oportunidades de alto impacto e baixo esforço — quick wins claros para o primeiro ciclo de transformação.",
    indicators: [
      { name: "Receita média por cliente (ARPU)", trend: "up" },
      { name: "Custo por transação", trend: "down" },
      { name: "Margem operacional", trend: "up" },
      { name: "CAC (Custo de Aquisição)", trend: "neutral" },
      { name: "LTV", trend: "up" },
    ],
    benefits: [
      "Destrava R$ 1,8M/ano via automação e otimização de fluxos transacionais.",
      "Melhora a competitividade da oferta, reforçando o posicionamento e o ARPU médio.",
    ],
    risks: [
      "Dependência de adoção plena para captura do valor projetado no business case.",
      "Risco regulatório residual caso a comunicação ao cliente final não seja precisa.",
    ],
  },
];

const EFFECT_TAG: Record<ClusterEffect, { bg: string; color: string; icon: React.ReactNode; label: string }> = {
  positivo: { bg: "#ECFDF5", color: "#0F766E", icon: <ArrowUp size={12} />, label: "Positivo" },
  negativo: { bg: "#FEF2F2", color: "#B91C1C", icon: <ArrowDown size={12} />, label: "Negativo" },
};

function clusterFromLever(l: ValueLever): ClusterId {
  if (l === "Experiência do Colaborador") return "voe";
  if (l === "Custo Operacional" || l === "Eficiência Operacional") return "ops";
  if (l === "Qualidade & Compliance") return "voc";
  return "biz";
}

function ClusterRadar({ data, selectedIdx, onSelect }: {
  data: ClusterDef[]; selectedIdx: number; onSelect: (i: number) => void;
}) {
  const SIZE = 240;
  const cx = SIZE / 2;
  const cy = SIZE / 2;
  const radius = 78;
  const N = data.length;
  const angle = (i: number) => -Math.PI / 2 + (i * 2 * Math.PI) / N;
  const point = (i: number, value: number) => {
    const r = (value / 5) * radius;
    return [cx + r * Math.cos(angle(i)), cy + r * Math.sin(angle(i))] as const;
  };
  const polygon = data.map((d, i) => point(i, d.score).join(",")).join(" ");
  const rings = [1, 2, 3, 4, 5];
  return (
    <svg viewBox={`0 0 ${SIZE} ${SIZE}`} width="100%" height={SIZE} style={{ maxWidth: 280 }}>
      {rings.map((r) => {
        const pts = data.map((_, i) => point(i, r).join(",")).join(" ");
        return <polygon key={r} points={pts} fill="none" stroke="#E8E8EA" strokeWidth={1} />;
      })}
      {data.map((_, i) => {
        const [x, y] = point(i, 5);
        return <line key={i} x1={cx} y1={cy} x2={x} y2={y} stroke="#E8E8EA" strokeWidth={1} />;
      })}
      <polygon points={polygon} fill="#0C1BA8" fillOpacity={0.18} stroke="#0C1BA8" strokeWidth={2} />
      {data.map((d, i) => {
        const [x, y] = point(i, d.score);
        const isSel = i === selectedIdx;
        return (
          <circle key={d.id} cx={x} cy={y} r={isSel ? 6 : 3.5}
            fill={isSel ? "#FFB020" : "#0C1BA8"} stroke="#FFF" strokeWidth={isSel ? 2 : 1.2}
            style={{ cursor: "pointer" }} onClick={() => onSelect(i)} />
        );
      })}
      {data.map((d, i) => {
        const [x, y] = point(i, 5.4);
        const anchor = Math.abs(x - cx) < 4 ? "middle" : x > cx ? "start" : "end";
        const lines = d.label.split(" ");
        const isSel = i === selectedIdx;
        return (
          <g key={`lbl-${d.id}`} style={{ cursor: "pointer" }} onClick={() => onSelect(i)}>
            <text x={x} y={y} textAnchor={anchor} fontSize={9.5} fontWeight={isSel ? 700 : 600} fill={isSel ? "#0C1BA8" : "#374151"}>
              {lines.map((ln, idx) => <tspan key={idx} x={x} dy={idx === 0 ? 0 : 10}>{ln}</tspan>)}
            </text>
            <text x={x} y={y + lines.length * 10 + 2} textAnchor={anchor} fontSize={9} fontWeight={700} fill="#0C1BA8">
              {d.score.toFixed(1)}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

function trendIcon(t: "up" | "down" | "neutral") {
  if (t === "up") return <span style={{ color: "#0F766E", fontSize: 11 }}>▲</span>;
  if (t === "down") return <span style={{ color: "#B91C1C", fontSize: 11 }}>▼</span>;
  return <span style={{ color: "#6B7280", fontSize: 11 }}>▬</span>;
}

function MetaPill({ label, value, color }: { label: string; value: React.ReactNode; color?: string }) {
  return (
    <div style={{
      flex: 1, background: "#FFF", border: "1px solid #EEF0FF", borderRadius: 8,
      padding: "8px 10px", minWidth: 0,
    }}>
      <div style={{ fontSize: 9, fontWeight: 700, color: "#6B7280", textTransform: "uppercase", letterSpacing: "0.5px" }}>{label}</div>
      <div style={{ fontSize: 13, fontWeight: 700, color: color ?? "#272727", display: "inline-flex", alignItems: "center", gap: 4 }}>{value}</div>
    </div>
  );
}

function LeverRadarChart({ focusLever }: { focusLever: ValueLever }) {
  const initialIdx = Math.max(0, CLUSTERS.findIndex((c) => c.id === clusterFromLever(focusLever)));
  const [selectedIdx, setSelectedIdx] = useState<number>(initialIdx);
  useEffect(() => {
    setSelectedIdx(Math.max(0, CLUSTERS.findIndex((c) => c.id === clusterFromLever(focusLever))));
  }, [focusLever]);

  const cluster = CLUSTERS[selectedIdx];
  const effect = EFFECT_TAG[cluster.effect];

  return (
    <div style={{ ...resultCard, padding: "20px 24px" }}>
      <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 4 }}>
        <h4 style={{ fontSize: 13, fontWeight: 600, color: "#272727", margin: 0 }}>Impacto por cluster de indicadores</h4>
        <span style={{ fontSize: 11, color: "#6B7280" }}>Escala 0–5</span>
      </div>
      <p style={{ fontSize: 12, color: "#6B7280", lineHeight: 1.55, margin: "4px 0 14px" }}>
        Compare o impacto da transformação em cada cluster de indicadores. Selecione um cluster para ver o detalhamento executivo.
      </p>

      <div style={{ display: "grid", gridTemplateColumns: "260px 1fr", gap: 20, alignItems: "stretch" }}>
        {/* Radar (smaller) */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "flex-start", gap: 10 }}>
          <ClusterRadar data={CLUSTERS} selectedIdx={selectedIdx} onSelect={setSelectedIdx} />
          <div style={{ display: "flex", flexDirection: "column", gap: 4, width: "100%" }}>
            {CLUSTERS.map((c, i) => {
              const isSel = i === selectedIdx;
              return (
                <button key={c.id} onClick={() => setSelectedIdx(i)} style={{
                  display: "flex", alignItems: "center", gap: 8, fontSize: 11, fontWeight: 600,
                  padding: "6px 10px", borderRadius: 8,
                  border: `1px solid ${isSel ? "#0C1BA8" : "#E8E8EA"}`,
                  background: isSel ? "#0C1BA8" : "#FFF",
                  color: isSel ? "#FFF" : "#374151", cursor: "pointer",
                }}>
                  <span style={{ display: "inline-flex", color: isSel ? "#FFF" : "#0C1BA8" }}>{c.icon}</span>
                  <span style={{ flex: 1, textAlign: "left" }}>{c.label}</span>
                  <span style={{ fontSize: 10, fontWeight: 700, opacity: 0.85 }}>{c.score.toFixed(1)}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Cluster detail */}
        <div style={{
          background: "linear-gradient(135deg, #FAFBFF 0%, #F4F6FF 100%)",
          border: "1px solid #E8EAFB", borderLeft: "3px solid #0C1BA8",
          borderRadius: 12, padding: "16px 18px",
          display: "flex", flexDirection: "column", gap: 14, minWidth: 0,
        }}>
          {/* Header */}
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{
              width: 30, height: 30, borderRadius: 8, background: "#0C1BA8",
              color: "#FFF", display: "inline-flex", alignItems: "center", justifyContent: "center",
            }}>{cluster.icon}</span>
            <div style={{ minWidth: 0, flex: 1 }}>
              <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.6px", color: "#0C1BA8", textTransform: "uppercase" }}>Cluster de indicadores</div>
              <div style={{ fontSize: 14, fontWeight: 700, color: "#272727" }}>{cluster.label}</div>
            </div>
          </div>

          {/* Effect / Size / Confidence */}
          <div style={{ display: "flex", gap: 8 }}>
            <MetaPill label="Efeito" value={<><span style={{ color: effect.color, display: "inline-flex" }}>{effect.icon}</span>{effect.label}</>} />
            <MetaPill label="Tamanho" value={<>{cluster.size === "Grande" ? "●●●" : cluster.size === "Médio" ? "●●○" : "●○○"} {cluster.size}</>} />
            <MetaPill label="Confiança" value={cluster.confidence} />
          </div>

          {/* Resumo */}
          <div>
            <div style={{ fontSize: 9, fontWeight: 700, color: "#6B7280", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 4 }}>Resumo executivo</div>
            <p style={{ fontSize: 12.5, color: "#374151", lineHeight: 1.6, margin: 0 }}>{cluster.summary}</p>
          </div>

          {/* Indicadores impactados */}
          <div style={{ background: "#FFF", border: "1px solid #EEF0FF", borderRadius: 10, padding: "12px 14px" }}>
            <div style={{ fontSize: 9, fontWeight: 700, color: "#6B7280", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 8, display: "inline-flex", alignItems: "center", gap: 6 }}>
              <BarChart3 size={11} /> Indicadores impactados
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 6 }}>
              {cluster.indicators.map((ind) => (
                <div key={ind.name} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12, color: "#272727" }}>
                  {trendIcon(ind.trend)}
                  <span>{ind.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Benefícios x Riscos */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            <div style={{ background: "#FFF", border: "1px solid #DCFCE7", borderRadius: 10, padding: "12px 14px" }}>
              <div style={{ fontSize: 9, fontWeight: 700, color: "#0F766E", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 8, display: "inline-flex", alignItems: "center", gap: 6 }}>
                <ShieldCheck size={11} /> Benefícios
              </div>
              <ul style={{ margin: 0, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 8 }}>
                {cluster.benefits.map((b, i) => (
                  <li key={i} style={{ display: "flex", gap: 8, fontSize: 12, color: "#374151", lineHeight: 1.5 }}>
                    <span style={{ color: "#0F766E", flexShrink: 0 }}>▲</span>
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div style={{ background: "#FFF", border: "1px solid #FECACA", borderRadius: 10, padding: "12px 14px" }}>
              <div style={{ fontSize: 9, fontWeight: 700, color: "#B91C1C", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 8, display: "inline-flex", alignItems: "center", gap: 6 }}>
                <ShieldAlert size={11} /> Riscos
              </div>
              <ul style={{ margin: 0, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 8 }}>
                {cluster.risks.map((r, i) => (
                  <li key={i} style={{ display: "flex", gap: 8, fontSize: 12, color: "#374151", lineHeight: 1.5 }}>
                    <span style={{ color: "#B91C1C", flexShrink: 0 }}>▼</span>
                    <span>{r}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ======== Combined: Alavancas (full) + Benchmarking (below) ======== */
function AlavancasBenchmarkSection({ focusLever }: { focusLever: ValueLever }) {
  return (
    <section id="section-alavancas" style={{ padding: "32px 40px 0" }}>
      <SectionHeader title="Impacto nas Alavancas & Benchmarking" subtitle="Visão comparativa entre alavancas com leitura executiva, e comparativo de mercado." />
      <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        <LeverRadarChart focusLever={focusLever} />
        <BenchmarkSection embedded />
      </div>
    </section>
  );
}

/* ======== Section: Benchmarking ======== */
function BenchmarkSection({ embedded = false }: { embedded?: boolean }) {
  const [userValues, setUserValues] = useState<Record<string, string>>({});

  // Parse first numeric value from a string (e.g. "R$ 14,80", "8%", "3,2 dias")
  const parseNum = (s: string): number | null => {
    if (!s) return null;
    const m = s.replace(/\./g, "").match(/-?\d+(?:,\d+)?/);
    return m ? parseFloat(m[0].replace(",", ".")) : null;
  };

  // For each metric: lower-is-better unless metric mentions SLA / Automação / cumprido
  const isHigherBetter = (metric: string) =>
    /sla|automa|cumprid|nps|satisfa/i.test(metric);

  const getPosition = (metric: string, userVal: string, p50: string, p75: string) => {
    const u = parseNum(userVal);
    const v50 = parseNum(p50);
    const v75 = parseNum(p75);
    if (u == null || v50 == null || v75 == null) return null;
    const higher = isHigherBetter(metric);
    if (higher) {
      if (u >= v75) return "Acima da média" as const;
      if (u >= v50) return "Na média" as const;
      return "Abaixo da média" as const;
    } else {
      if (u <= v75) return "Acima da média" as const;
      if (u <= v50) return "Na média" as const;
      return "Abaixo da média" as const;
    }
  };

  const positionMeta = (g: string | null) =>
    g === "Abaixo da média" ? { bg: "#FEF2F2", color: "#B91C1C", label: "Abaixo da média" } :
    g === "Acima da média" ? { bg: "#ECFDF5", color: "#0F766E", label: "Acima da média" } :
    g === "Na média" ? { bg: "#FFFBEB", color: "#92400E", label: "Na média" } :
    { bg: "#F4F5F8", color: "#6B7280", label: "Informe seu valor" };

  return (
    <section id={embedded ? undefined : "section-benchmark"} style={embedded ? { height: "100%" } : { padding: "32px 40px 0" }}>
      {!embedded && <SectionHeader title="Benchmarking de Mercado" subtitle="Informe seus indicadores e o sistema compara com referências de mercado." />}
      <div style={{ ...resultCard, borderTop: "3px solid #0C1BA8", height: embedded ? "100%" : undefined }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
          <div>
            <h3 style={{ fontSize: 15, fontWeight: 600, color: "#272727", margin: 0 }}>Comparativo de mercado</h3>
            <p style={{ fontSize: 12, color: "#6B7280", margin: "2px 0 0" }}>Edite os campos da coluna "Seu valor" para gerar a comparação automaticamente.</p>
          </div>
          <div style={{ display: "flex", gap: 6 }}>
            {["Gartner", "APQC", "McKinsey"].map((s) => (
              <span key={s} style={{ fontSize: 10, color: "#6B7280", background: "#F4F5F8", borderRadius: 4, padding: "3px 8px" }}>{s}</span>
            ))}
          </div>
        </div>
        <div style={{ width: "100%", borderRadius: 8, overflow: "hidden", border: "1px solid #F0F1F5" }}>
          <div style={{
            display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1.2fr 1.4fr",
            background: "#FAFAFA", borderBottom: "1px solid #E8E8EA",
            fontSize: 11, textTransform: "uppercase", color: "#6B7280", letterSpacing: "0.5px",
          }}>
            {["Métrica", "Mercado P50", "Mercado P75", "Seu valor", "Posição"].map((h) => (
              <div key={h} style={{ padding: "10px 16px", fontWeight: 600 }}>{h}</div>
            ))}
          </div>
          {mockBenchmarks.map((b, i) => {
            const userVal = userValues[b.metric] ?? b.currentEstimate;
            const pos = getPosition(b.metric, userVal, b.marketP50, b.marketP75);
            const m = positionMeta(pos);
            return (
              <div key={b.metric} style={{
                display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1.2fr 1.4fr",
                background: i % 2 === 0 ? "#FFF" : "#FAFBFF", borderBottom: "1px solid #F0F1F5",
                alignItems: "center", fontSize: 13,
              }}>
                <div style={{ padding: "12px 16px", color: "#272727", fontWeight: 500 }}>{b.metric}</div>
                <div style={{ padding: "12px 16px", color: "#6B7280" }}>{b.marketP50}</div>
                <div style={{ padding: "12px 16px", color: "#6B7280" }}>{b.marketP75}</div>
                <div style={{ padding: "8px 12px" }}>
                  <input
                    value={userVal}
                    onChange={(e) => setUserValues((v) => ({ ...v, [b.metric]: e.target.value }))}
                    placeholder="Insira seu valor"
                    style={{
                      width: "100%", padding: "6px 10px", fontSize: 13, fontWeight: 600,
                      color: "#272727", background: "#FFF",
                      border: "1px solid #D5D8E0", borderRadius: 6, outline: "none",
                    }}
                    onFocus={(e) => { e.currentTarget.style.borderColor = "#0C1BA8"; }}
                    onBlur={(e) => { e.currentTarget.style.borderColor = "#D5D8E0"; }}
                  />
                </div>
                <div style={{ padding: "12px 16px" }}>
                  <span style={{
                    display: "inline-flex", alignItems: "center", gap: 6,
                    background: m.bg, color: m.color, padding: "3px 10px", borderRadius: 999,
                    fontSize: 11, fontWeight: 700,
                  }}>
                    <span style={{ width: 6, height: 6, borderRadius: "50%", background: m.color }} />
                    {m.label}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
        <div style={{
          marginTop: 20, padding: "18px 22px",
          background: "linear-gradient(135deg, #EEF0FF, #DBEAFE)",
          border: "1px solid #C7CEFF", borderRadius: 12,
          display: "flex", gap: 12,
        }}>
          <Sparkles size={18} style={{ color: "#0C1BA8", flexShrink: 0, marginTop: 2 }} />
          <div>
            <p style={{ fontSize: 14, color: "#1E40AF", lineHeight: 1.65, margin: 0 }}>
              Empresas no quartil superior operam <b>43% mais rápido</b> e com <b>38% menos custo</b>. As oportunidades identificadas podem colocar a organização nesse patamar em 6 meses.
            </p>
            <div style={{ fontSize: 11, color: "#6B7280", fontStyle: "italic", marginTop: 6 }}>
              Fonte: APQC Process Survey 2024 + Gartner Cost Benchmarks 2024
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ======== Section: Top Oportunidades (compact) ======== */
function OportunidadesSection({
  ops, sourceMode, sourceContext, onOpenDetails, onSeeMore,
}: {
  ops: MockOpportunity[]; sourceMode: SavedOpportunitySourceMode;
  sourceContext: string; onOpenDetails: (op: MockOpportunity) => void;
  onSeeMore: () => void;
}) {
  const top = useMemo(() => {
    return [...ops]
      .sort((a, b) =>
        (impactScore[b.impact] - impactScore[a.impact]) ||
        (effortScore[a.effort] - effortScore[b.effort])
      )
      .slice(0, 3);
  }, [ops]);

  return (
    <section id="section-oportunidades" style={{ padding: "32px 40px 0" }}>
      <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: 16, gap: 12 }}>
        <div>
          <h3 style={{ fontSize: 18, fontWeight: 600, color: "#272727", margin: 0 }}>Top oportunidades de alto impacto</h3>
          <p style={{ fontSize: 13, color: "#6B7280", margin: "2px 0 0" }}>
            As 3 iniciativas mais relevantes da análise. Veja todas na aba Casos de Uso.
          </p>
        </div>
        <button
          onClick={onSeeMore}
          style={{
            display: "inline-flex", alignItems: "center", gap: 6,
            background: "#FFF", border: "1px solid #C7CEFF", color: "#0C1BA8",
            borderRadius: 8, padding: "8px 14px",
            fontSize: 12, fontWeight: 600, cursor: "pointer", flexShrink: 0,
          }}
        >
          Ver todas ({ops.length}) <ArrowRight size={13} />
        </button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: 14 }}>
        {top.map((op) => (
          <CompactOpportunityCard
            key={op.id} op={op}
            sourceMode={sourceMode} sourceContext={sourceContext}
            onOpenDetails={() => onOpenDetails(op)}
          />
        ))}
      </div>
    </section>
  );
}

function CompactOpportunityCard({
  op, sourceMode, sourceContext, onOpenDetails,
}: {
  op: MockOpportunity; sourceMode: SavedOpportunitySourceMode;
  sourceContext: string; onOpenDetails: () => void;
}) {
  const saveOpportunity = useOpportunityStore((s) => s.saveOpportunity);
  const isOpportunitySaved = useOpportunityStore((s) => s.isOpportunitySaved);
  const saved = isOpportunitySaved(op.id);

  const impactTone = op.impact === "Alto" ? "#0C1BA8" : op.impact === "Médio" ? "#7A45D6" : "#6B7280";
  const effortTone = op.effort === "Baixo" ? "#16A34A" : op.effort === "Médio" ? "#D97706" : "#B91C1C";

  return (
    <article
      onClick={onOpenDetails}
      style={{
        borderRadius: 10, padding: "14px 16px", background: "#FFF",
        border: "1px solid #EAEBEF", display: "flex", flexDirection: "column", gap: 10,
        cursor: "pointer", transition: "border-color 0.15s",
      }}
      onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#0C1BA8"; }}
      onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#EAEBEF"; }}
    >
      <div style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
        <h4 style={{ flex: 1, fontSize: 13.5, fontWeight: 600, color: "#1A1A1F", margin: 0, lineHeight: 1.35 }}>{op.title}</h4>
        <button
          onClick={(e) => {
            e.stopPropagation();
            if (saved) return;
            saveOpportunity({ op, sourceMode, sourceContext });
            toast.success("Salvo no backlog", { description: op.title });
          }}
          title={saved ? "Salvo" : "Salvar"}
          style={{
            background: "transparent", border: "none", padding: 2,
            color: saved ? "#0C1BA8" : "#A5A7B0", cursor: saved ? "default" : "pointer",
          }}
        >
          <Bookmark size={14} fill={saved ? "#0C1BA8" : "none"} />
        </button>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 12, fontSize: 11 }}>
        <span style={{ display: "inline-flex", alignItems: "center", gap: 4, color: "#6B7280" }}>
          <span style={{ width: 6, height: 6, borderRadius: "50%", background: impactTone }} />
          Impacto <b style={{ color: "#272727", fontWeight: 600 }}>{op.impact}</b>
        </span>
        <span style={{ display: "inline-flex", alignItems: "center", gap: 4, color: "#6B7280" }}>
          <span style={{ width: 6, height: 6, borderRadius: "50%", background: effortTone }} />
          Esforço <b style={{ color: "#272727", fontWeight: 600 }}>{op.effort}</b>
        </span>
      </div>

      <div style={{
        background: "#F8F9FF", borderLeft: "3px solid #0C1BA8",
        padding: "6px 10px", borderRadius: 4,
      }}>
        <div style={{ fontSize: 9, fontWeight: 700, color: "#6B7280", textTransform: "uppercase", letterSpacing: "0.5px" }}>Ganho estimado</div>
        <div style={{ fontSize: 13, fontWeight: 700, color: "#0C1BA8" }}>{op.estimatedGain}</div>
      </div>
    </article>
  );
}

function BigMatrix({
  ops, activeOpId, onActiveOpChange, onOpenDetails,
}: {
  ops: MockOpportunity[];
  activeOpId?: string | null;
  onActiveOpChange?: (id: string | null) => void;
  onOpenDetails?: (op: MockOpportunity) => void;
}) {
  const H = 400;
  return (
    <div style={{ display: "grid", gridTemplateColumns: "32px 1fr", gridTemplateRows: `${H}px 28px`, gap: 0 }}>
      <div style={{ gridRow: 1, gridColumn: 1, display: "flex", alignItems: "center", justifyContent: "center", writingMode: "vertical-rl", transform: "rotate(180deg)", fontSize: 11, color: "#6B7280", fontWeight: 600, letterSpacing: "0.5px", textTransform: "uppercase" }}>
        Impacto →
      </div>
      <div style={{ gridRow: 1, gridColumn: 2, position: "relative", height: H, background: "linear-gradient(to top right, #F9F9F9, #FFFFFF)", border: "1px solid #E8E8EA", borderRadius: 10 }}>
        <div style={{ position: "absolute", left: "50%", top: 0, bottom: 0, width: 1, background: "#E8E8EA" }} />
        <div style={{ position: "absolute", top: "50%", left: 0, right: 0, height: 1, background: "#E8E8EA" }} />
        {ops.map((op, i) => {
          const x = effortScore[op.effort] * 100;
          const y = (1 - impactScore[op.impact]) * 100;
          const jx = ((i * 37) % 11) - 5;
          const jy = ((i * 53) % 11) - 5;
          const isActive = activeOpId === op.id;
          const dimmed = !!activeOpId && !isActive;
          return (
            <div
              key={op.id}
              title={op.title}
              onMouseEnter={() => onActiveOpChange?.(op.id)}
              onMouseLeave={() => onActiveOpChange?.(null)}
              onClick={() => onOpenDetails?.(op)}
              style={{
                position: "absolute", left: `calc(${x}% + ${jx}px)`, top: `calc(${y}% + ${jy}px)`,
                transform: `translate(-50%, -50%) scale(${isActive ? 1.25 : 1})`,
                width: 28, height: 28, borderRadius: "50%", background: "#0C1BA8",
                border: `3px solid ${isActive ? "#FBBF24" : "#FFF"}`,
                boxShadow: isActive
                  ? "0 0 0 4px rgba(251,191,36,0.35), 0 4px 14px rgba(12,27,168,0.45)"
                  : "0 2px 8px rgba(12,27,168,0.3)",
                color: "#FFF", fontSize: 12, fontWeight: 700,
                display: "flex", alignItems: "center", justifyContent: "center",
                opacity: dimmed ? 0.3 : 1,
                cursor: "pointer",
                transition: "transform 180ms ease, opacity 180ms ease, box-shadow 180ms ease",
                zIndex: isActive ? 5 : 1,
              }}
            >{i + 1}</div>
          );
        })}
      </div>
      <div style={{ gridRow: 2, gridColumn: 1 }} />
      <div style={{ gridRow: 2, gridColumn: 2, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, color: "#6B7280", fontWeight: 600, letterSpacing: "0.5px", textTransform: "uppercase" }}>
        Esforço →
      </div>
    </div>
  );
}

function OpportunityCard({
  op, sourceMode, sourceContext, onOpenDetails,
}: {
  op: MockOpportunity; sourceMode: SavedOpportunitySourceMode;
  sourceContext: string; onOpenDetails: () => void;
}) {
  const navigate = useNavigate();
  const saveOpportunity = useOpportunityStore((s) => s.saveOpportunity);
  const isOpportunitySaved = useOpportunityStore((s) => s.isOpportunitySaved);
  const setStatus = useOpportunityStore((s) => s.setStatus);
  const getByOriginalId = useOpportunityStore((s) => s.getByOriginalId);
  const saved = isOpportunitySaved(op.id);
  const activeLevers = (Object.entries(op.valueLeverImpacts) as [ValueLever, ImpactLevel][])
    .filter(([, l]) => l === "Alto" || l === "Médio").map(([k]) => k).slice(0, 3);

  const handleSave = () => {
    if (saved) return;
    saveOpportunity({ op, sourceMode, sourceContext });
    toast.success("Oportunidade salva no backlog", { description: op.title });
  };
  const handleStartTransform = () => {
    const existing = getByOriginalId(op.id) ?? saveOpportunity({ op, sourceMode, sourceContext });
    setStatus(existing.uid, "em_transformacao");
    navigate(`/org-intelligence-hub/transform${buildTransformParams(op)}`);
  };

  const impactTone = op.impact === "Alto" ? "#0C1BA8" : op.impact === "Médio" ? "#7A45D6" : "#6B7280";
  const effortTone = op.effort === "Baixo" ? "#16A34A" : op.effort === "Médio" ? "#D97706" : "#B91C1C";

  return (
    <article style={{
      borderRadius: 12, padding: 18, background: "#FFF",
      border: "1px solid #EAEBEF", display: "flex", flexDirection: "column", gap: 14,
      transition: "border-color 0.15s, transform 0.15s",
    }}
      onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#0C1BA8"; }}
      onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#EAEBEF"; }}
    >
      {/* Header: title + lever pills */}
      <div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginBottom: 8 }}>
          {activeLevers.slice(0, 2).map((l) => (
            <span key={l} style={{
              fontSize: 9, fontWeight: 600, letterSpacing: "0.4px",
              color: "#0C1BA8", background: "#EEF0FF",
              padding: "2px 7px", borderRadius: 4, textTransform: "uppercase",
            }}>{l}</span>
          ))}
          {activeLevers.length > 2 && (
            <span style={{ fontSize: 9, fontWeight: 600, color: "#6B7280", padding: "2px 4px" }}>
              +{activeLevers.length - 2}
            </span>
          )}
        </div>
        <h3 style={{ fontSize: 14, fontWeight: 600, color: "#1A1A1F", margin: 0, lineHeight: 1.35 }}>{op.title}</h3>
        <p style={{
          fontSize: 12, color: "#6B7280", margin: "6px 0 0", lineHeight: 1.5,
          display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden",
        }}>{op.description}</p>
      </div>

      {/* Inline metrics — minimal */}
      <div style={{ display: "flex", alignItems: "center", gap: 14, fontSize: 11 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
          <span style={{ width: 6, height: 6, borderRadius: "50%", background: impactTone }} />
          <span style={{ color: "#6B7280" }}>Impacto</span>
          <span style={{ fontWeight: 600, color: "#272727" }}>{op.impact}</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
          <span style={{ width: 6, height: 6, borderRadius: "50%", background: effortTone }} />
          <span style={{ color: "#6B7280" }}>Esforço</span>
          <span style={{ fontWeight: 600, color: "#272727" }}>{op.effort}</span>
        </div>
      </div>

      {/* Highlight gain */}
      <div style={{
        background: "linear-gradient(90deg, #F8F9FF 0%, #FFF 100%)",
        borderLeft: "3px solid #0C1BA8",
        padding: "8px 12px", borderRadius: 4,
      }}>
        <div style={{ fontSize: 9, fontWeight: 700, color: "#6B7280", textTransform: "uppercase", letterSpacing: "0.5px" }}>Ganho estimado</div>
        <div style={{ fontSize: 14, fontWeight: 700, color: "#0C1BA8", marginTop: 1 }}>{op.estimatedGain}</div>
      </div>

      {/* Footer actions */}
      <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: "auto" }}>
        <button onClick={handleSave} disabled={saved} title={saved ? "Salvo" : "Salvar"} style={{
          display: "inline-flex", alignItems: "center", justifyContent: "center",
          width: 30, height: 30, padding: 0, borderRadius: 6,
          background: saved ? "#EEF0FF" : "#FFF",
          color: saved ? "#0C1BA8" : "#6B7280",
          border: "1px solid #E8E8EA", cursor: saved ? "default" : "pointer",
        }}>
          <Bookmark size={13} fill={saved ? "#0C1BA8" : "none"} />
        </button>
        <button onClick={onOpenDetails} style={{
          fontSize: 12, padding: "6px 12px", borderRadius: 6,
          background: "#FFF", color: "#374151",
          border: "1px solid #E8E8EA", cursor: "pointer", fontWeight: 500,
        }}>Detalhes</button>
        <button onClick={handleStartTransform} style={{
          marginLeft: "auto", display: "inline-flex", alignItems: "center", gap: 5,
          fontSize: 12, padding: "6px 12px", border: "none", borderRadius: 6,
          background: "#0C1BA8", color: "#FFF", cursor: "pointer", fontWeight: 600,
        }}>
          Transformar <ArrowRight size={12} />
        </button>
      </div>
    </article>
  );
}

const cardBtn = (active: boolean): React.CSSProperties => ({
  display: "inline-flex", alignItems: "center", gap: 4,
  fontSize: 11, padding: "5px 10px", borderRadius: 6,
  background: active ? "#EEF0FF" : "#FFF",
  color: active ? "#0C1BA8" : "#374151",
  border: "1px solid #E8E8EA", cursor: active ? "default" : "pointer", fontWeight: 500,
});

function Mini({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ background: "#F9F9F9", border: "1px solid #F3F4F6", borderRadius: 6, padding: "6px 8px", textAlign: "center" }}>
      <div style={{ fontSize: 9, color: "#6B7280", textTransform: "uppercase", letterSpacing: "0.4px", fontWeight: 600 }}>{label}</div>
      <div style={{ fontSize: 11, fontWeight: 700, color: "#0C1BA8", marginTop: 2 }}>{value}</div>
    </div>
  );
}

/* ======== Section: Correlações ======== */
function CorrelacoesSection({
  ops, sourceMode, sourceContext, onOpenDetails,
}: {
  ops: MockOpportunity[];
  sourceMode: SavedOpportunitySourceMode;
  sourceContext: string;
  onOpenDetails: (op: MockOpportunity) => void;
}) {
  const allLevers = (Object.entries(mockValueLeverImpacts) as [ValueLever, { level: ImpactLevel }][])
    .filter(([, d]) => d.level !== "Não impactado").map(([k]) => k);

  // Shared opportunity highlight between Map and Matrix
  const [activeOpId, setActiveOpId] = useState<string | null>(null);

  return (
    <section id="section-correlacoes" style={{ padding: "32px 40px 0" }}>
      <SectionHeader title="Mapa de Correlações & Priorização" subtitle="Como oportunidades se conectam aos processos e onde priorizá-las." />
      <div style={{ display: "grid", gridTemplateColumns: "3fr 2fr", gap: 20 }}>
        <div style={{ ...resultCard, padding: 0, overflow: "hidden" }}>
          <CorrelationMap
            levers={allLevers}
            ops={ops}
            sourceMode={sourceMode}
            sourceContext={sourceContext}
            activeOpId={activeOpId}
            onActiveOpChange={setActiveOpId}
            onOpenDetails={onOpenDetails}
          />
        </div>

        <div style={{ ...resultCard, padding: "24px 28px" }}>
          <h4 style={{ fontSize: 13, fontWeight: 600, color: "#272727", margin: "0 0 16px" }}>Matriz de Priorização (Impacto × Esforço)</h4>
          <BigMatrix
            ops={ops}
            activeOpId={activeOpId}
            onActiveOpChange={setActiveOpId}
            onOpenDetails={onOpenDetails}
          />
          <div style={{ display: "flex", gap: 8, marginTop: 16, flexWrap: "wrap" }}>
            {[
              { label: "Quick wins", desc: "Alto impacto / Baixo esforço", highlight: true },
              { label: "Grandes apostas", desc: null, highlight: false },
              { label: "Tarefas rápidas", desc: null, highlight: false },
              { label: "Reavaliar", desc: null, highlight: false },
            ].map((q) => (
              <span key={q.label} style={{
                display: "inline-flex", alignItems: "center", gap: 6,
                fontSize: 11, padding: "3px 10px", borderRadius: 999,
                border: `1px solid ${q.highlight ? "#C7CEFF" : "#E8E8EA"}`,
                background: q.highlight ? "#EEF0FF" : "transparent",
                color: q.highlight ? "#0C1BA8" : "#6B7280",
                fontWeight: q.highlight ? 600 : 500,
              }}>
                <span style={{ width: 7, height: 7, borderRadius: "50%", background: q.highlight ? "#0C1BA8" : "#A5A7B0" }} />
                {q.label}{q.desc && <span style={{ color: "#6B7280", fontWeight: 500 }}> — {q.desc}</span>}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ======== Correlation Map (SVG) ======== */
function CorrelationMap({
  levers, ops, sourceMode, sourceContext,
  activeOpId, onActiveOpChange, onOpenDetails,
}: {
  levers: ValueLever[];
  ops: MockOpportunity[];
  sourceMode: SavedOpportunitySourceMode;
  sourceContext: string;
  activeOpId?: string | null;
  onActiveOpChange?: (id: string | null) => void;
  onOpenDetails?: (op: MockOpportunity) => void;
}) {
  const saveOpportunity = useOpportunityStore((s) => s.saveOpportunity);
  const isOpportunitySaved = useOpportunityStore((s) => s.isOpportunitySaved);

  // Selection (click-to-pin) and hover (transient)
  type Sel =
    | { kind: "op"; id: string }
    | { kind: "lever"; id: ValueLever }
    | { kind: "l3"; id: string }
    | { kind: "l4"; id: string }
    | null;
  const [selected, setSelected] = useState<Sel>(null);
  const [hover, setHover] = useState<Sel>(null);
  // External activeOpId (e.g. from matrix) takes precedence as focus when set
  const externalFocus: Sel = activeOpId ? { kind: "op", id: activeOpId } : null;
  const focus = hover ?? externalFocus ?? selected;

  const toggle = (s: Exclude<Sel, null>) =>
    setSelected((prev) =>
      prev && prev.kind === s.kind && prev.id === s.id ? null : s
    );

  // Build L3 / L4 columns from impactedProcesses
  // L3 keys are the "first 3 parts joined". L4 entries use full path.
  const l3OfPath = (full: string) => full.split(" > ").slice(0, 3).join(" > ");
  const shortName = (full: string) => full.split(" > ").slice(-1)[0];

  const l3Set = new Set<string>();
  const l4Set = new Set<string>();
  // op -> { l3s: Set, l4s: Set }
  const opLinks: Record<string, { l3: Set<string>; l4: Set<string> }> = {};
  // l3 -> Set<l4>
  const l3Children: Record<string, Set<string>> = {};

  ops.forEach((o) => {
    opLinks[o.id] = { l3: new Set(), l4: new Set() };
    o.impactedProcesses.forEach((p) => {
      if (p.level === "L3") {
        l3Set.add(p.name);
        opLinks[o.id].l3.add(p.name);
      } else {
        const parent = l3OfPath(p.name);
        l3Set.add(parent);
        l4Set.add(p.name);
        opLinks[o.id].l3.add(parent);
        opLinks[o.id].l4.add(p.name);
        if (!l3Children[parent]) l3Children[parent] = new Set();
        l3Children[parent].add(p.name);
      }
    });
  });

  const l3Names = Array.from(l3Set);
  const l4Names = Array.from(l4Set);

  // Layout constants — narrower because container is now smaller
  const COL_X = { lever: 90, op: 320, l3: 540, l4: 740 };
  const NODE_W = { lever: 150, op: 180, l3: 150, l4: 150 };
  const ROW_H_LEVER = 42;
  const ROW_H_OP = 50;
  const ROW_H_PROC = 34;
  const PAD_TOP = 24;

  const leverY: Record<string, number> = {};
  levers.forEach((l, i) => { leverY[l] = PAD_TOP + i * ROW_H_LEVER + ROW_H_LEVER / 2; });
  const opY: Record<string, number> = {};
  ops.forEach((o, i) => { opY[o.id] = PAD_TOP + i * ROW_H_OP + ROW_H_OP / 2; });
  const l3Y: Record<string, number> = {};
  l3Names.forEach((p, i) => { l3Y[p] = PAD_TOP + i * ROW_H_PROC + ROW_H_PROC / 2; });
  const l4Y: Record<string, number> = {};
  l4Names.forEach((p, i) => { l4Y[p] = PAD_TOP + i * ROW_H_PROC + ROW_H_PROC / 2; });

  const height = Math.max(
    PAD_TOP + levers.length * ROW_H_LEVER,
    PAD_TOP + ops.length * ROW_H_OP,
    PAD_TOP + l3Names.length * ROW_H_PROC,
    PAD_TOP + l4Names.length * ROW_H_PROC,
  ) + 30;
  const width = 840;

  // Levers active for an opportunity
  const opLevers = (o: MockOpportunity): ValueLever[] =>
    (Object.entries(o.valueLeverImpacts) as [ValueLever, ImpactLevel][])
      .filter(([, l]) => l === "Alto" || l === "Médio")
      .map(([k]) => k);

  // Determine if an item is highlighted given current focus (hover or selected)
  const isOpFocused = (id: string): boolean => {
    if (!focus) return true;
    if (focus.kind === "op") return focus.id === id;
    const o = ops.find((x) => x.id === id);
    if (!o) return false;
    if (focus.kind === "lever") return opLevers(o).includes(focus.id);
    if (focus.kind === "l3") return opLinks[id]?.l3.has(focus.id);
    if (focus.kind === "l4") return opLinks[id]?.l4.has(focus.id);
    return true;
  };
  const isLeverFocused = (l: ValueLever): boolean => {
    if (!focus) return true;
    if (focus.kind === "lever") return focus.id === l;
    if (focus.kind === "op") return opLevers(ops.find((o) => o.id === focus.id)!).includes(l);
    if (focus.kind === "l3" || focus.kind === "l4") {
      return ops.some((o) =>
        opLevers(o).includes(l) &&
        (focus.kind === "l3" ? opLinks[o.id].l3.has(focus.id) : opLinks[o.id].l4.has(focus.id))
      );
    }
    return true;
  };
  const isL3Focused = (id: string): boolean => {
    if (!focus) return true;
    if (focus.kind === "l3") return focus.id === id;
    if (focus.kind === "l4") return l3OfPath(focus.id) === id;
    if (focus.kind === "op") return opLinks[focus.id]?.l3.has(id);
    if (focus.kind === "lever") {
      return ops.some((o) => opLevers(o).includes(focus.id) && opLinks[o.id].l3.has(id));
    }
    return true;
  };
  const isL4Focused = (id: string): boolean => {
    if (!focus) return true;
    if (focus.kind === "l4") return focus.id === id;
    if (focus.kind === "l3") return l3OfPath(id) === focus.id;
    if (focus.kind === "op") return opLinks[focus.id]?.l4.has(id);
    if (focus.kind === "lever") {
      return ops.some((o) => opLevers(o).includes(focus.id) && opLinks[o.id].l4.has(id));
    }
    return true;
  };

  // Edge highlighted if both endpoints focused
  const edgeOn = (a: boolean, b: boolean) => a && b;

  // Bezier path between two points (horizontal)
  const path = (x1: number, y1: number, x2: number, y2: number) => {
    const mx = (x1 + x2) / 2;
    return `M ${x1} ${y1} C ${mx} ${y1}, ${mx} ${y2}, ${x2} ${y2}`;
  };

  const stroke = (active: boolean) => ({
    stroke: active ? "#0C1BA8" : "#D5D8E0",
    strokeWidth: active ? 1.6 : 1,
    opacity: active ? 0.75 : 0.22,
  });

  return (
    <div style={{ padding: "20px 24px", background: "#FAFBFF" }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", padding: "0 0 14px", fontSize: 10, fontWeight: 700, color: "#6B7280", textTransform: "uppercase", letterSpacing: "0.6px" }}>
        <span>Alavancas</span>
        <span style={{ textAlign: "center" }}>Oportunidades</span>
        <span style={{ textAlign: "center" }}>L3</span>
        <span style={{ textAlign: "right" }}>L4</span>
      </div>
      <div style={{ overflowX: "auto" }}>
        <svg viewBox={`0 0 ${width} ${height}`} width="100%" height={height} style={{ display: "block" }}>
          {/* Lines: lever -> op */}
          {ops.map((o) =>
            opLevers(o).map((lev) => {
              const active = edgeOn(isLeverFocused(lev), isOpFocused(o.id));
              return (
                <path key={`l-${o.id}-${lev}`}
                  d={path(COL_X.lever + NODE_W.lever / 2, leverY[lev], COL_X.op - NODE_W.op / 2, opY[o.id])}
                  fill="none" {...stroke(active)} />
              );
            })
          )}

          {/* Lines: op -> L3 */}
          {ops.map((o) =>
            Array.from(opLinks[o.id].l3).map((p) => {
              const active = edgeOn(isOpFocused(o.id), isL3Focused(p));
              return (
                <path key={`ol3-${o.id}-${p}`}
                  d={path(COL_X.op + NODE_W.op / 2, opY[o.id], COL_X.l3 - NODE_W.l3 / 2, l3Y[p])}
                  fill="none" {...stroke(active)} />
              );
            })
          )}

          {/* Lines: L3 -> L4 (parent->child) */}
          {Object.entries(l3Children).flatMap(([l3, set]) =>
            Array.from(set).map((l4) => {
              const active = edgeOn(isL3Focused(l3), isL4Focused(l4));
              return (
                <path key={`l3l4-${l3}-${l4}`}
                  d={path(COL_X.l3 + NODE_W.l3 / 2, l3Y[l3], COL_X.l4 - NODE_W.l4 / 2, l4Y[l4])}
                  fill="none" {...stroke(active)} />
              );
            })
          )}

          {/* Lever nodes */}
          {levers.map((l) => {
            const active = isLeverFocused(l);
            const isSel = selected?.kind === "lever" && selected.id === l;
            return (
              <g key={l}
                onMouseEnter={() => setHover({ kind: "lever", id: l })}
                onMouseLeave={() => setHover(null)}
                onClick={() => toggle({ kind: "lever", id: l })}
                style={{ cursor: "pointer" }}>
                <rect x={COL_X.lever - NODE_W.lever / 2} y={leverY[l] - 15}
                  width={NODE_W.lever} height={30} rx={15}
                  fill={active ? "#EEF0FF" : "#F4F5F8"}
                  stroke={isSel ? "#0C1BA8" : active ? "#0C1BA8" : "#E8E8EA"}
                  strokeWidth={isSel ? 2 : 1}
                  opacity={active ? 1 : 0.5} />
                <text x={COL_X.lever} y={leverY[l] + 4} textAnchor="middle"
                  fontSize="11" fontWeight="600"
                  fill={active ? "#0C1BA8" : "#6B7280"}>
                  {l.length > 22 ? l.slice(0, 20) + "…" : l}
                </text>
              </g>
            );
          })}

          {/* Opportunity nodes */}
          {ops.map((o, i) => {
            const saved = isOpportunitySaved(o.id);
            const active = isOpFocused(o.id);
            const isSel = selected?.kind === "op" && selected.id === o.id;
            return (
              <g key={o.id}
                onMouseEnter={() => { setHover({ kind: "op", id: o.id }); onActiveOpChange?.(o.id); }}
                onMouseLeave={() => { setHover(null); onActiveOpChange?.(null); }}
                onClick={() => onOpenDetails?.(o)}
                style={{ cursor: "pointer" }}>
                <rect x={COL_X.op - NODE_W.op / 2} y={opY[o.id] - 18}
                  width={NODE_W.op} height={36} rx={8}
                  fill="#FFF"
                  stroke={isSel ? "#0C1BA8" : active ? "#0C1BA8" : "#E8E8EA"}
                  strokeWidth={isSel ? 2 : active ? 1.6 : 1}
                  opacity={active ? 1 : 0.55} />
                <circle cx={COL_X.op - NODE_W.op / 2 + 14} cy={opY[o.id]} r={10} fill="#0C1BA8" />
                <text x={COL_X.op - NODE_W.op / 2 + 14} y={opY[o.id] + 4} textAnchor="middle"
                  fontSize="10" fontWeight="700" fill="#FFF">{i + 1}</text>
                <text x={COL_X.op - NODE_W.op / 2 + 30} y={opY[o.id] + 4}
                  fontSize="10.5" fontWeight="500" fill="#272727">
                  {o.title.length > 22 ? o.title.slice(0, 20) + "…" : o.title}
                </text>
                {/* Save button */}
                <g onClick={(e) => {
                    e.stopPropagation();
                    if (saved) return;
                    saveOpportunity({ op: o, sourceMode, sourceContext });
                    toast.success("Oportunidade salva no backlog", { description: o.title });
                  }}
                  style={{ cursor: saved ? "default" : "pointer" }}>
                  <rect x={COL_X.op + NODE_W.op / 2 - 22} y={opY[o.id] - 9} width={20} height={18} rx={4}
                    fill={saved ? "#EEF0FF" : "#FFF"}
                    stroke={saved ? "#0C1BA8" : "#E8E8EA"} />
                  <text x={COL_X.op + NODE_W.op / 2 - 12} y={opY[o.id] + 5} textAnchor="middle"
                    fontSize="11" fontWeight="700" fill={saved ? "#0C1BA8" : "#6B7280"}>
                    {saved ? "✓" : "+"}
                  </text>
                </g>
              </g>
            );
          })}

          {/* L3 nodes */}
          {l3Names.map((p) => {
            const active = isL3Focused(p);
            const isSel = selected?.kind === "l3" && selected.id === p;
            return (
              <g key={p}
                onMouseEnter={() => setHover({ kind: "l3", id: p })}
                onMouseLeave={() => setHover(null)}
                onClick={() => toggle({ kind: "l3", id: p })}
                style={{ cursor: "pointer" }}>
                <rect x={COL_X.l3 - NODE_W.l3 / 2} y={l3Y[p] - 12}
                  width={NODE_W.l3} height={24} rx={6}
                  fill="#FFF"
                  stroke={isSel ? "#0C1BA8" : active ? "#0C1BA8" : "#E8E8EA"}
                  strokeWidth={isSel ? 2 : active ? 1.4 : 1}
                  opacity={active ? 1 : 0.5} />
                <rect x={COL_X.l3 - NODE_W.l3 / 2 + 6} y={l3Y[p] - 7} width={18} height={14} rx={3} fill="#0C1BA8" />
                <text x={COL_X.l3 - NODE_W.l3 / 2 + 15} y={l3Y[p] + 3} textAnchor="middle"
                  fontSize="9" fontWeight="700" fill="#FFF">L3</text>
                <text x={COL_X.l3 - NODE_W.l3 / 2 + 28} y={l3Y[p] + 4}
                  fontSize="10" fill="#272727">
                  {(() => { const s = shortName(p); return s.length > 18 ? s.slice(0, 16) + "…" : s; })()}
                </text>
              </g>
            );
          })}

          {/* L4 nodes */}
          {l4Names.map((p) => {
            const active = isL4Focused(p);
            const isSel = selected?.kind === "l4" && selected.id === p;
            return (
              <g key={p}
                onMouseEnter={() => setHover({ kind: "l4", id: p })}
                onMouseLeave={() => setHover(null)}
                onClick={() => toggle({ kind: "l4", id: p })}
                style={{ cursor: "pointer" }}>
                <rect x={COL_X.l4 - NODE_W.l4 / 2} y={l4Y[p] - 12}
                  width={NODE_W.l4} height={24} rx={6}
                  fill="#FFF"
                  stroke={isSel ? "#0C1BA8" : active ? "#0C1BA8" : "#E8E8EA"}
                  strokeWidth={isSel ? 2 : active ? 1.4 : 1}
                  opacity={active ? 1 : 0.5} />
                <rect x={COL_X.l4 - NODE_W.l4 / 2 + 6} y={l4Y[p] - 7} width={18} height={14} rx={3} fill="#7C3AED" />
                <text x={COL_X.l4 - NODE_W.l4 / 2 + 15} y={l4Y[p] + 3} textAnchor="middle"
                  fontSize="9" fontWeight="700" fill="#FFF">L4</text>
                <text x={COL_X.l4 - NODE_W.l4 / 2 + 28} y={l4Y[p] + 4}
                  fontSize="10" fill="#272727">
                  {(() => { const s = shortName(p); return s.length > 18 ? s.slice(0, 16) + "…" : s; })()}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
      <div style={{ display: "flex", gap: 14, marginTop: 12, padding: "10px 12px", background: "#FFF", border: "1px solid #EEF0FF", borderRadius: 8, fontSize: 11, color: "#6B7280", flexWrap: "wrap" }}>
        <span><b style={{ color: "#0C1BA8" }}>Dica:</b> clique em uma caixa para fixar o destaque, ou passe o mouse para visualização rápida.</span>
        {selected && (
          <button onClick={() => setSelected(null)} style={{ background: "#EEF0FF", color: "#0C1BA8", border: "1px solid #C7CEFF", borderRadius: 6, padding: "2px 10px", fontSize: 11, fontWeight: 600, cursor: "pointer" }}>
            Limpar seleção
          </button>
        )}
        <span style={{ marginLeft: "auto" }}>Clique em <b style={{ color: "#0C1BA8" }}>+</b> para salvar a oportunidade no backlog.</span>
      </div>
    </div>
  );
}



/* ======== Section: Riscos ======== */
function RiscosSection() {
  const sevColor = (s: string) => s === "Alto" ? "#B91C1C" : s === "Médio" ? "#F59E0B" : "#0C1BA8";
  const sevBg = (s: string) => s === "Alto" ? { bg: "#FEF2F2", color: "#B91C1C" } : s === "Médio" ? { bg: "#FFFBEB", color: "#92400E" } : { bg: "#EEF0FF", color: "#0C1BA8" };
  const categories = ["Gestão da Mudança", "Integração", "Capacidade", "Prazo"];

  // Position risks in 2x2 matrix
  const matrixPos = (i: number, sev: string) => {
    if (sev === "Alto") return { row: 0, col: 1 }; // high prob, high impact
    if (sev === "Médio") return { row: i % 2 === 0 ? 0 : 1, col: i % 2 === 0 ? 0 : 1 };
    return { row: 1, col: 0 };
  };

  return (
    <section id="section-riscos" style={{ padding: "32px 40px 48px" }}>
      <SectionHeader title="Riscos e Dependências" subtitle="Pontos de atenção para a execução." />
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {mockRisks.map((r, i) => {
            const sev = sevBg(r.severity);
            return (
              <div key={r.title} style={{
                borderRadius: 12, padding: "18px 20px", background: "#FFF",
                border: "1px solid #E8E8EA", borderLeft: `3px solid ${sevColor(r.severity)}`,
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ width: 22, height: 22, borderRadius: "50%", background: sevColor(r.severity), color: "#FFF", fontSize: 11, fontWeight: 700, display: "inline-flex", alignItems: "center", justifyContent: "center" }}>{i + 1}</span>
                  <h4 style={{ fontSize: 14, fontWeight: 600, color: "#272727", margin: 0, flex: 1 }}>{r.title}</h4>
                  <span style={{
                    display: "inline-flex", alignItems: "center", gap: 5,
                    fontSize: 10.5, fontWeight: 700, color: sev.color, background: sev.bg,
                    padding: "3px 9px", borderRadius: 999, textTransform: "uppercase",
                  }}>
                    <span style={{ width: 6, height: 6, borderRadius: "50%", background: sev.color }} />
                    {r.severity}
                  </span>
                </div>
                <div style={{ marginTop: 6, display: "inline-block", fontSize: 11, color: "#6B7280", background: "#F4F5F8", padding: "2px 8px", borderRadius: 999 }}>
                  {categories[i % categories.length]}
                </div>
                <p style={{ fontSize: 13, color: "#6B7280", margin: "8px 0 0", lineHeight: 1.6 }}>{r.description}</p>
                <div style={{
                  display: "flex", gap: 8, marginTop: 12, padding: "10px 12px",
                  background: "#F8FBFF", border: "1px solid #DBEAFE", borderRadius: 8,
                }}>
                  <Shield size={14} style={{ color: "#0C1BA8", flexShrink: 0, marginTop: 2 }} />
                  <span style={{ fontSize: 12, color: "#1E40AF" }}>
                    <b>Mitigação:</b> {r.mitigation}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Matrix */}
        <div style={resultCard}>
          <h4 style={{ fontSize: 13, fontWeight: 600, color: "#272727", margin: "0 0 14px" }}>Matriz Probabilidade × Impacto</h4>
          <div style={{ display: "grid", gridTemplateColumns: "16px 1fr 1fr", gridTemplateRows: "1fr 1fr 16px", gap: 6, height: 320 }}>
            <div style={{ gridRow: "1 / 3", gridColumn: 1, writingMode: "vertical-rl", transform: "rotate(180deg)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 700, color: "#6B7280", textTransform: "uppercase", letterSpacing: "0.5px" }}>
              Probabilidade →
            </div>
            {[
              { row: 0, col: 0, label: "Monitorar", bg: "#FAFAFA" },
              { row: 0, col: 1, label: "Ação Imediata", bg: "#FEF2F2" },
              { row: 1, col: 0, label: "Aceitar", bg: "#FAFAFA" },
              { row: 1, col: 1, label: "Mitigar", bg: "#FFFBEB" },
            ].map((q) => {
              const risksHere = mockRisks
                .map((r, i) => ({ r, i, pos: matrixPos(i, r.severity) }))
                .filter(({ pos }) => pos.row === q.row && pos.col === q.col);
              return (
                <div key={q.label} style={{
                  gridRow: q.row + 1, gridColumn: q.col + 2,
                  background: q.bg, border: "1px solid #E8E8EA", borderRadius: 8,
                  padding: 10, position: "relative",
                }}>
                  <div style={{ fontSize: 10, fontWeight: 700, color: "#6B7280", textTransform: "uppercase", letterSpacing: "0.5px" }}>{q.label}</div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 8 }}>
                    {risksHere.map(({ r, i }) => (
                      <span key={i} title={r.title} style={{
                        width: 24, height: 24, borderRadius: "50%",
                        background: sevColor(r.severity), color: "#FFF",
                        fontSize: 11, fontWeight: 700,
                        display: "inline-flex", alignItems: "center", justifyContent: "center",
                      }}>{i + 1}</span>
                    ))}
                  </div>
                </div>
              );
            })}
            <div style={{ gridRow: 3, gridColumn: "2 / 4", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 700, color: "#6B7280", textTransform: "uppercase", letterSpacing: "0.5px" }}>
              Impacto →
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ======== Shared ======== */
const resultCard: React.CSSProperties = {
  borderRadius: 16, padding: 28, background: "#FFF", border: "1px solid #E8E8EA",
};

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ fontSize: 10, fontWeight: 700, color: "#A5A7B0", letterSpacing: "1px", textTransform: "uppercase" }}>
      {children}
    </div>
  );
}

function SectionHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div style={{ marginBottom: 20 }}>
      <h3 style={{ fontSize: 18, fontWeight: 600, color: "#272727", margin: 0 }}>{title}</h3>
      {subtitle && <p style={{ fontSize: 13, color: "#6B7280", margin: "2px 0 0" }}>{subtitle}</p>}
    </div>
  );
}

/* ======== Details Modal ======== */
const IMPACT_COLORS: Record<ImpactLevel, { bg: string; color: string; border: string }> = {
  Alto: { bg: "#EEF0FF", color: "#0C1BA8", border: "#C7CEFF" },
  Médio: { bg: "#FFFBEB", color: "#92400E", border: "#FDE68A" },
  Baixo: { bg: "#F3F4F6", color: "#6B7280", border: "#E8E8EA" },
  "Não impactado": { bg: "#FAFAFA", color: "#A5A7B0", border: "#F3F4F6" },
};

function DetailsModal({
  op, onClose, sourceMode, sourceContext,
}: {
  op: MockOpportunity | null;
  onClose: () => void;
  sourceMode: SavedOpportunitySourceMode;
  sourceContext: string;
}) {
  const navigate = useNavigate();
  const saveOpportunity = useOpportunityStore((s) => s.saveOpportunity);
  const isOpportunitySaved = useOpportunityStore((s) => s.isOpportunitySaved);
  const setStatus = useOpportunityStore((s) => s.setStatus);
  const getByOriginalId = useOpportunityStore((s) => s.getByOriginalId);

  if (!op) {
    return <Dialog open={false} onOpenChange={onClose}><DialogContent /></Dialog>;
  }

  const saved = isOpportunitySaved(op.id);
  const handleSave = () => {
    if (saved) return;
    saveOpportunity({ op, sourceMode, sourceContext });
    toast.success("Oportunidade salva no backlog", { description: op.title });
  };
  const handleStartTransform = () => {
    const existing = getByOriginalId(op.id) ?? saveOpportunity({ op, sourceMode, sourceContext });
    setStatus(existing.uid, "em_transformacao");
    onClose();
    navigate(`/org-intelligence-hub/transform${buildTransformParams(op)}`);
  };
  const opRisks = mockRisks.slice(0, 2);
  const activeLevers = (Object.entries(op.valueLeverImpacts) as [ValueLever, ImpactLevel][])
    .filter(([, l]) => l !== "Não impactado");

  return (
    <Dialog open={!!op} onOpenChange={(o) => !o && onClose()}>
      <DialogContent style={{ maxWidth: 780, maxHeight: "88vh", overflowY: "auto" }}>
        <DialogHeader>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 8 }}>
            {op.tags.map((t) => (
              <span key={t} style={{ fontSize: 11, color: "#6B7280", background: "#F3F4F6", padding: "3px 8px", borderRadius: 4, fontWeight: 500 }}>{t}</span>
            ))}
          </div>
          <DialogTitle style={{ fontSize: 20, fontWeight: 600, color: "#272727" }}>{op.title}</DialogTitle>
        </DialogHeader>
        <div style={{ display: "flex", flexDirection: "column", gap: 20, marginTop: 8 }}>
          <ModalSection title="Descrição">
            <p style={{ fontSize: 14, color: "#374151", lineHeight: 1.6, margin: 0 }}>{op.description}</p>
          </ModalSection>
          <ModalSection title="Alavancas de Valor impactadas">
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {activeLevers.map(([lever, level]) => {
                const c = IMPACT_COLORS[level];
                return (
                  <div key={lever} style={{ flex: "1 1 220px", border: `1px solid ${c.border}`, background: "#FFF", borderRadius: 10, padding: "10px 12px", display: "flex", alignItems: "center", gap: 6 }}>
                    <span style={{ width: 22, height: 22, borderRadius: 6, background: c.bg, color: c.color, display: "inline-flex", alignItems: "center", justifyContent: "center" }}>{LEVER_ICONS[lever]}</span>
                    <span style={{ fontSize: 12.5, fontWeight: 600, color: "#272727", flex: 1 }}>{lever}</span>
                    <span style={{ fontSize: 10, fontWeight: 700, color: c.color, background: c.bg, padding: "2px 7px", borderRadius: 999, textTransform: "uppercase" }}>{level}</span>
                  </div>
                );
              })}
            </div>
          </ModalSection>
          <ModalSection title="Por que isso foi identificado">
            <div style={{ display: "flex", gap: 10, padding: 12, background: "#F0F9FF", border: "1px solid #BAE6FD", borderRadius: 8 }}>
              <Sparkles size={16} style={{ color: "#0369A1", flexShrink: 0, marginTop: 2 }} />
              <p style={{ fontSize: 13, color: "#075985", lineHeight: 1.6, margin: 0 }}>{op.why}</p>
            </div>
          </ModalSection>
          <ModalSection title="Use case sugerido">
            <div style={{ display: "flex", gap: 10, padding: 14, background: "#EEF0FF", border: "1px solid #C7CEFF", borderRadius: 10 }}>
              <Lightbulb size={18} style={{ color: "#0C1BA8", flexShrink: 0, marginTop: 2 }} />
              <p style={{ fontSize: 13, color: "#272727", lineHeight: 1.6, margin: 0 }}>{op.suggestedUseCase}</p>
            </div>
          </ModalSection>
          <ModalSection title="Processos relacionados">
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {op.impactedProcesses.map((p) => (
                <div key={p.name} style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 10px", background: "#F9F9F9", border: "1px solid #E8E8EA", borderRadius: 6, fontSize: 13 }}>
                  <span style={{ fontSize: 10, fontWeight: 700, color: "#0C1BA8", background: "#EEF0FF", padding: "2px 6px", borderRadius: 3 }}>{p.level}</span>
                  <span style={{ color: "#272727", flex: 1 }}>{p.name}</span>
                  <span style={{ fontSize: 10.5, fontWeight: 700, color: "#FFF", background: "#0C1BA8", padding: "2px 8px", borderRadius: 999 }}>{p.action}</span>
                </div>
              ))}
            </div>
          </ModalSection>
          <ModalSection title="Ganhos potenciais">
            <ul style={{ margin: 0, paddingLeft: 18, color: "#374151", fontSize: 13, lineHeight: 1.7 }}>
              {op.potentialGains.map((g) => <li key={g}>{g}</li>)}
            </ul>
          </ModalSection>
          <ModalSection title="Riscos específicos">
            <div className="grid gap-3" style={{ gridTemplateColumns: "repeat(2, 1fr)" }}>
              {opRisks.map((r) => (
                <div key={r.title} style={{ border: "1px solid #E8E8EA", borderRadius: 10, padding: 12 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6 }}>
                    <AlertTriangle size={14} style={{ color: "#F59E0B" }} />
                    <span style={{ fontSize: 13, fontWeight: 600, color: "#272727" }}>{r.title}</span>
                  </div>
                  <p style={{ fontSize: 12, color: "#6B7280", margin: 0, lineHeight: 1.5 }}>{r.description}</p>
                </div>
              ))}
            </div>
          </ModalSection>
          <div style={{ display: "flex", gap: 8, justifyContent: "flex-end", borderTop: "1px solid #E8E8EA", paddingTop: 16 }}>
            <button onClick={onClose} style={{ background: "#FFF", color: "#374151", border: "1px solid #E8E8EA", borderRadius: 8, padding: "9px 16px", fontSize: 13, fontWeight: 500, cursor: "pointer" }}>
              Fechar
            </button>
            <button onClick={handleSave} disabled={saved} style={{ display: "inline-flex", alignItems: "center", gap: 6, background: saved ? "#EEF0FF" : "#FFF", color: "#0C1BA8", border: "1px solid #C7CEFF", borderRadius: 8, padding: "9px 16px", fontSize: 13, fontWeight: 500, cursor: saved ? "default" : "pointer" }}>
              {saved ? <Check size={14} /> : <Bookmark size={14} />}
              {saved ? "Salva no backlog" : "Salvar no backlog"}
            </button>
            <button onClick={handleStartTransform} style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "#0C1BA8", color: "#FFF", border: "none", borderRadius: 8, padding: "9px 16px", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
              Iniciar transformação <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function ModalSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <div style={{ fontSize: 11, fontWeight: 600, color: "#A5A7B0", letterSpacing: "0.5px", textTransform: "uppercase", marginBottom: 8 }}>
        {title}
      </div>
      {children}
    </div>
  );
}

/* ======== USE CASES VIEW (tab) ======== */
function UseCasesView({
  ops, sourceMode, sourceContext, onOpenDetails,
}: {
  ops: MockOpportunity[];
  sourceMode: SavedOpportunitySourceMode;
  sourceContext: string;
  onOpenDetails: (op: MockOpportunity) => void;
}) {
  const navigate = useNavigate();
  const isOpportunitySaved = useOpportunityStore((s) => s.isOpportunitySaved);
  const saveOpportunity = useOpportunityStore((s) => s.saveOpportunity);
  const removeOpportunity = useOpportunityStore((s) => s.removeOpportunity);
  const getByOriginalId = useOpportunityStore((s) => s.getByOriginalId);

  const [search, setSearch] = useState("");
  const [activeTags, setActiveTags] = useState<string[]>([]);
  const [view, setView] = useState<"list" | "grid">("list");
  const [sortBy, setSortBy] = useState<"default" | "impact" | "effort">("default");

  // Discover all unique tags across opportunities (for the filters block)
  const allTags = useMemo(() => {
    const set = new Set<string>();
    ops.forEach((o) => o.tags.forEach((t) => set.add(t)));
    return Array.from(set);
  }, [ops]);

  const toggleTag = (t: string) =>
    setActiveTags((prev) => prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]);

  const filtered = useMemo(() => {
    let arr = ops;
    if (search.trim()) {
      const q = search.toLowerCase();
      arr = arr.filter((o) =>
        o.title.toLowerCase().includes(q) ||
        o.description.toLowerCase().includes(q)
      );
    }
    if (activeTags.length > 0) {
      arr = arr.filter((o) => activeTags.every((t) => o.tags.includes(t)));
    }
    if (sortBy === "impact") {
      arr = [...arr].sort((a, b) => impactScore[b.impact] - impactScore[a.impact]);
    } else if (sortBy === "effort") {
      arr = [...arr].sort((a, b) => effortScore[a.effort] - effortScore[b.effort]);
    }
    return arr;
  }, [ops, search, activeTags, sortBy]);

  const saved = filtered.filter((o) => isOpportunitySaved(o.id));
  const others = filtered.filter((o) => !isOpportunitySaved(o.id));

  const handleRemoveSaved = (op: MockOpportunity) => {
    const ex = getByOriginalId(op.id);
    if (ex) {
      removeOpportunity(ex.uid);
      toast("Caso de uso removido dos salvos");
    }
  };

  return (
    <>
      {/* SIDEBAR */}
      <aside style={{
        width: 260, flexShrink: 0, background: "#FFFFFF",
        borderRight: "1px solid #EAEBEF", padding: "20px",
        overflowY: "auto", display: "flex", flexDirection: "column", gap: 18,
      }}>
        {/* Search */}
        <div style={{ position: "relative" }}>
          <Search size={14} style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: "#A5A7B0" }} />
          <input
            placeholder="Buscar..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              width: "100%", padding: "8px 10px 8px 30px",
              border: "1px solid #E8E8EA", borderRadius: 8, fontSize: 13,
              background: "#FAFAFA", outline: "none",
            }}
          />
        </div>

        {/* Filters */}
        <div>
          <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "1px", color: "#A5A7B0", textTransform: "uppercase", marginBottom: 10 }}>
            Filtros
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
            {allTags.map((t) => {
              const on = activeTags.includes(t);
              return (
                <button key={t} onClick={() => toggleTag(t)} style={{
                  display: "inline-flex", alignItems: "center", gap: 4,
                  fontSize: 11, fontWeight: 500, padding: "4px 10px",
                  borderRadius: 999,
                  border: `1px solid ${on ? "#0C1BA8" : "#E8E8EA"}`,
                  background: on ? "#EEF0FF" : "#FFF",
                  color: on ? "#0C1BA8" : "#6B7280",
                  cursor: "pointer",
                }}>
                  <Layers size={10} /> {t}
                </button>
              );
            })}
          </div>
        </div>

        {/* Prioritization Matrix CTA */}
        <button
          onClick={() => toast("Abrindo Matriz de Priorização...")}
          style={{
            display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 8,
            background: "#0C1BA8", color: "#FFF", border: "none",
            borderRadius: 10, padding: "12px 14px", fontSize: 13, fontWeight: 600,
            cursor: "pointer",
          }}
        >
          <LayoutGrid size={14} /> Matriz de Priorização
        </button>

        {/* View / Sort */}
        <div>
          <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "1px", color: "#A5A7B0", textTransform: "uppercase", marginBottom: 8, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span>Visualização</span>
            <div style={{ display: "inline-flex", border: "1px solid #E8E8EA", borderRadius: 6, overflow: "hidden" }}>
              <button onClick={() => setView("list")} style={{ padding: "4px 8px", border: "none", background: view === "list" ? "#EEF0FF" : "#FFF", color: view === "list" ? "#0C1BA8" : "#6B7280", cursor: "pointer" }}>
                <List size={12} />
              </button>
              <button onClick={() => setView("grid")} style={{ padding: "4px 8px", border: "none", background: view === "grid" ? "#EEF0FF" : "#FFF", color: view === "grid" ? "#0C1BA8" : "#6B7280", cursor: "pointer" }}>
                <LayoutGrid size={12} />
              </button>
            </div>
          </div>
        </div>
        <div>
          <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "1px", color: "#A5A7B0", textTransform: "uppercase", marginBottom: 6 }}>Ordenar por</div>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            style={{
              width: "100%", padding: "8px 10px", border: "1px solid #E8E8EA",
              borderRadius: 8, fontSize: 12, background: "#FFF", color: "#272727",
              outline: "none", cursor: "pointer",
            }}
          >
            <option value="default">Padrão</option>
            <option value="impact">Maior impacto</option>
            <option value="effort">Menor esforço</option>
          </select>
        </div>
      </aside>

      {/* MAIN */}
      <div style={{ flex: 1, overflowY: "auto", padding: "28px 36px" }}>
        <div style={{ marginBottom: 18 }}>
          <h2 style={{ fontSize: 22, fontWeight: 700, color: "#1A1A1F", margin: 0 }}>Casos de Uso</h2>
          <p style={{ fontSize: 13, color: "#6B7280", margin: "4px 0 0" }}>
            {filtered.length} casos de uso encontrados
          </p>
        </div>

        {/* Salvos */}
        {saved.length > 0 && (
          <div style={{ marginBottom: 28 }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 8, fontSize: 13, fontWeight: 600, color: "#0C1BA8", marginBottom: 12 }}>
              <Bookmark size={14} fill="#0C1BA8" /> Salvos ({saved.length})
            </div>
            <div style={view === "grid"
              ? { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(360px, 1fr))", gap: 14 }
              : { display: "flex", flexDirection: "column", gap: 12 }}>
              {saved.map((op) => (
                <UseCaseRow
                  key={op.id} op={op} saved
                  onOpen={() => onOpenDetails(op)}
                  onRemove={() => handleRemoveSaved(op)}
                />
              ))}
            </div>
          </div>
        )}

        {/* Outros */}
        {others.length > 0 && (
          <div>
            {saved.length > 0 && (
              <div style={{ display: "inline-flex", alignItems: "center", gap: 8, fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 12 }}>
                <Sparkles size={14} /> Sugestões ({others.length})
              </div>
            )}
            <div style={view === "grid"
              ? { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(360px, 1fr))", gap: 14 }
              : { display: "flex", flexDirection: "column", gap: 12 }}>
              {others.map((op) => (
                <UseCaseRow
                  key={op.id} op={op}
                  onOpen={() => onOpenDetails(op)}
                  onSave={() => {
                    saveOpportunity({ op, sourceMode, sourceContext });
                    toast.success("Caso de uso salvo no backlog", { description: op.title });
                  }}
                />
              ))}
            </div>
          </div>
        )}

        {filtered.length === 0 && (
          <div style={{ textAlign: "center", padding: "48px 20px", color: "#6B7280", fontSize: 13 }}>
            Nenhum caso de uso encontrado para os filtros aplicados.
          </div>
        )}
      </div>
    </>
  );
}

function UseCaseRow({
  op, saved, onOpen, onSave, onRemove,
}: {
  op: MockOpportunity;
  saved?: boolean;
  onOpen: () => void;
  onSave?: () => void;
  onRemove?: () => void;
}) {
  const impactTone = op.impact === "Alto" ? { color: "#16A34A", label: "Alto", w: 75 }
    : op.impact === "Médio" ? { color: "#16A34A", label: "Médio", w: 55 }
    : { color: "#16A34A", label: "Baixo", w: 30 };
  const effortTone = op.effort === "Alto" ? { color: "#EA580C", label: "Muito Alto", w: 85 }
    : op.effort === "Médio" ? { color: "#EA580C", label: "Alto", w: 60 }
    : { color: "#16A34A", label: "Baixo", w: 30 };

  // Mock primary tag (mirroring "IA" in reference)
  const primaryTag = op.tags.find((t) => /ia|automa/i.test(t)) ?? op.tags[0] ?? "Caso";

  return (
    <article
      onClick={onOpen}
      style={{
        background: "#FFF", border: "1px solid #EAEBEF",
        borderRadius: 12, padding: "18px 20px",
        display: "flex", flexDirection: "column", gap: 10,
        cursor: "pointer", transition: "border-color 0.15s, box-shadow 0.15s",
      }}
      onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#0C1BA8"; }}
      onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#EAEBEF"; }}
    >
      {/* Top: title + actions */}
      <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
        <Bookmark size={16} fill={saved ? "#0C1BA8" : "none"} style={{ color: saved ? "#0C1BA8" : "#A5A7B0", flexShrink: 0, marginTop: 2 }} />
        <h3 style={{ flex: 1, fontSize: 15, fontWeight: 600, color: "#1A1A1F", margin: 0, lineHeight: 1.4 }}>{op.title}</h3>
        {saved ? (
          <button
            onClick={(e) => { e.stopPropagation(); onRemove?.(); }}
            title="Remover dos salvos"
            style={{ background: "transparent", border: "none", color: "#A5A7B0", cursor: "pointer", padding: 4 }}
          >
            <Trash2 size={15} />
          </button>
        ) : (
          <button
            onClick={(e) => { e.stopPropagation(); onSave?.(); }}
            title="Salvar"
            style={{ background: "transparent", border: "none", color: "#A5A7B0", cursor: "pointer", padding: 4 }}
          >
            <Bookmark size={15} />
          </button>
        )}
      </div>

      {/* Tag pill */}
      <div>
        <span style={{
          display: "inline-flex", alignItems: "center", gap: 4,
          fontSize: 11, fontWeight: 600, color: "#0C1BA8",
          background: "#EEF0FF", border: "1px solid #C7CEFF",
          padding: "3px 10px", borderRadius: 999,
        }}>
          <Sparkles size={10} /> {primaryTag}
        </span>
      </div>

      {/* Description */}
      <p style={{ fontSize: 13, color: "#6B7280", margin: 0, lineHeight: 1.55 }}>
        {op.description}
      </p>

      {/* Bars: Esforço & Impacto */}
      <div style={{ display: "flex", gap: 24, alignItems: "center", flexWrap: "wrap", marginTop: 4 }}>
        <BarMetric icon={<Zap size={11} />} label="Esforço" value={effortTone.label} barColor={effortTone.color} pct={effortTone.w} />
        <BarMetric icon={<Activity size={11} />} label="Impacto" value={impactTone.label} barColor={impactTone.color} pct={impactTone.w} />
      </div>

      {/* Source reference */}
      <div style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 12, color: "#0C1BA8", marginTop: 2 }}>
        <ExternalLink size={12} />
        <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
          {op.benchmarkReference.split("(Fonte:")[1]?.replace(")", "").trim() || op.benchmarkReference}
        </span>
      </div>
    </article>
  );
}

function BarMetric({ icon, label, value, barColor, pct }: {
  icon: React.ReactNode; label: string; value: string; barColor: string; pct: number;
}) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, minWidth: 220, flex: 1 }}>
      <span style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: 11, color: "#6B7280", fontWeight: 500, minWidth: 56 }}>
        {icon} {label}
      </span>
      <div style={{ flex: 1, height: 6, background: "#F0F1F5", borderRadius: 999, overflow: "hidden", minWidth: 80 }}>
        <div style={{ width: `${pct}%`, height: "100%", background: barColor, borderRadius: 999 }} />
      </div>
      <span style={{ fontSize: 11, fontWeight: 600, color: "#374151", minWidth: 60, textAlign: "right" }}>{value}</span>
    </div>
  );
}
