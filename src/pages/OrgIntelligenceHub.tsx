import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Compass, Workflow, BookOpen, ArrowRight, Sparkles, Bookmark, Trash2, Eye,
  ChevronRight, GitBranch, CheckCircle,
} from "lucide-react";
import { TopBar } from "@/components/layout/TopBar";
import { useLanguage } from "@/contexts/LanguageContext";
import { useValueChainStore } from "@/stores/valueChainStore";
import {
  useOpportunityStore, SavedOpportunity, SavedOpportunityStatus,
} from "@/stores/opportunityStore";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ValueLever, ImpactLevel } from "@/data/discoverMockData";

interface OrgIntelligenceHubProps {
  onLogout: () => void;
}

const HERO_GRADIENT =
  "linear-gradient(135deg, #04223D 0%, #0C1BA8 60%, #1428CC 100%)";

export function OrgIntelligenceHub({ onLogout }: OrgIntelligenceHubProps) {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const l1Processes = useValueChainStore((s) => s.l1Processes);
  const saved = useOpportunityStore((s) => s.savedOpportunities);

  const mappedProcesses = l1Processes.reduce(
    (acc, l1) =>
      acc +
      l1.l2Processes.reduce(
        (a2, l2) =>
          a2 + l2.l3Processes.reduce((a3, l3) => a3 + Math.max(1, l3.l4Tasks.length), 0),
        0,
      ),
    0,
  );
  const inTransform = saved.filter((s) => s.status === "em_transformacao" || s.status === "concluida").length;

  return (
    <div style={{ minHeight: "100vh", background: "#F4F5F8", display: "flex", flexDirection: "column" }}>
      <TopBar onLogout={onLogout} />

      <main style={{ flex: 1 }}>
        {/* HERO */}
        <header
          style={{
            background: HERO_GRADIENT,
            padding: "48px 48px 80px",
            color: "#FFFFFF",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div style={{ maxWidth: 1280, margin: "0 auto", position: "relative" }}>
            <div
              style={{
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: "1.2px",
                textTransform: "uppercase",
                color: "rgba(255,255,255,0.55)",
                marginBottom: 14,
              }}
            >
              Org Intelligence
            </div>
            <h1
              style={{
                fontSize: 30,
                fontWeight: 700,
                letterSpacing: "-0.5px",
                color: "#FFFFFF",
                margin: 0,
                lineHeight: 1.15,
              }}
            >
              {language === "PT"
                ? "Transformação de Processos Inteligente"
                : "Intelligent Process Transformation"}
            </h1>
            <p
              style={{
                fontSize: 14,
                color: "rgba(255,255,255,0.72)",
                lineHeight: 1.65,
                margin: "12px 0 28px",
                maxWidth: 720,
              }}
            >
              {language === "PT"
                ? "Identifique oportunidades, estruture casos de uso e redesenhe processos com suporte de inteligência artificial."
                : "Identify opportunities, structure use cases, and redesign processes with AI support."}
            </p>

            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              <StatPill icon={<Sparkles size={14} />} value={saved.length} label={language === "PT" ? "oportunidades salvas" : "saved opportunities"} />
              <StatPill icon={<GitBranch size={14} />} value={mappedProcesses} label={language === "PT" ? "processos mapeados" : "mapped processes"} />
              <StatPill icon={<CheckCircle size={14} />} value={inTransform} label={language === "PT" ? "transformações iniciadas" : "transformations started"} />
            </div>
          </div>
        </header>

        {/* MODULES — overlap hero */}
        <section style={{ maxWidth: 1280, margin: "-40px auto 0", padding: "0 48px", position: "relative" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr 1fr", gap: 20, alignItems: "stretch" }}>
            <PrimaryModuleCard
              title={language === "PT" ? "Descobrir oportunidades" : "Discover opportunities"}
              description={
                language === "PT"
                  ? "Identifique oportunidades de melhoria com base na cadeia de valor, dados internos e benchmarks."
                  : "Identify improvement opportunities based on the value chain, internal data and benchmarks."
              }
              cta={language === "PT" ? "Iniciar análise" : "Start analysis"}
              chips={["Casos de uso", "Correlações", "Benchmarking"]}
              recommendedLabel={language === "PT" ? "Recomendado" : "Recommended"}
              icon={<Compass size={26} />}
              onClick={() => navigate("/org-intelligence-hub/discover")}
            />
            <SecondaryModuleCard
              title={language === "PT" ? "Transformar processos" : "Transform processes"}
              description={
                language === "PT"
                  ? "Aplique uma esteira estruturada para diagnosticar, analisar e redesenhar processos."
                  : "Apply a structured pipeline to diagnose, analyze and redesign processes."
              }
              cta={language === "PT" ? "Acessar esteira" : "Access pipeline"}
              icon={<Workflow size={20} />}
              onClick={() => navigate("/org-intelligence-hub/transform")}
            />
            <SecondaryModuleCard
              title={language === "PT" ? "Base de conhecimento" : "Knowledge base"}
              description={
                language === "PT"
                  ? "Gerencie documentos, políticas e dados que alimentam a inteligência da IA."
                  : "Manage documents, policies and data that fuel the AI intelligence."
              }
              cta={language === "PT" ? "Acessar base" : "Open knowledge base"}
              icon={<BookOpen size={20} />}
              onClick={() => navigate("/settings")}
            />
          </div>
        </section>

        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "48px 48px 64px" }}>
          <SavedOpportunitiesSection language={language} />
        </div>
      </main>
    </div>
  );
}

/* -------- Hero stat pill -------- */
function StatPill({ icon, value, label }: { icon: React.ReactNode; value: number; label: string }) {
  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 8,
        padding: "8px 16px",
        borderRadius: 999,
        background: "rgba(255,255,255,0.12)",
        border: "1px solid rgba(255,255,255,0.2)",
        backdropFilter: "blur(6px)",
        color: "#FFFFFF",
        fontSize: 13,
      }}
    >
      <span style={{ display: "inline-flex", color: "rgba(255,255,255,0.85)" }}>{icon}</span>
      <span style={{ fontWeight: 700 }}>{value}</span>
      <span style={{ color: "rgba(255,255,255,0.7)" }}>{label}</span>
    </div>
  );
}

/* -------- Module cards -------- */
function PrimaryModuleCard({
  title, description, cta, chips, recommendedLabel, icon, onClick,
}: {
  title: string; description: string; cta: string; chips: string[];
  recommendedLabel: string; icon: React.ReactNode; onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="group"
      style={{
        textAlign: "left",
        position: "relative",
        background: "#FFFFFF",
        borderRadius: 16,
        border: "1px solid #EAEBEF",
        padding: 32,
        cursor: "pointer",
        transition: "all 0.2s cubic-bezier(0.4,0,0.2,1)",
        boxShadow: "0 8px 32px rgba(12,27,168,0.10), 0 2px 8px rgba(0,0,0,0.04)",
        display: "flex", flexDirection: "column", gap: 18,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-3px)";
        e.currentTarget.style.boxShadow = "0 16px 40px rgba(12,27,168,0.18), 0 4px 12px rgba(0,0,0,0.06)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "0 8px 32px rgba(12,27,168,0.10), 0 2px 8px rgba(0,0,0,0.04)";
      }}
    >
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: "#0C1BA8", borderRadius: "16px 16px 0 0" }} />

      <span
        style={{
          position: "absolute", top: 18, right: 18,
          display: "inline-flex", alignItems: "center", gap: 6,
          background: "#EEF0FF", color: "#0C1BA8",
          fontSize: 10, fontWeight: 700, letterSpacing: "1.2px",
          padding: "5px 10px", borderRadius: 4, textTransform: "uppercase",
        }}
      >
        <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#16A34A" }} className="animate-pulse" />
        {recommendedLabel}
      </span>

      <div
        style={{
          width: 52, height: 52, borderRadius: 14,
          background: "linear-gradient(135deg, #EEF0FF, #DBEAFE)",
          color: "#0C1BA8",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}
      >
        {icon}
      </div>

      <div>
        <h2 style={{ fontSize: 18, fontWeight: 700, color: "#272727", margin: "0 0 8px", letterSpacing: "-0.2px" }}>
          {title}
        </h2>
        <p style={{ fontSize: 14, color: "#6B7280", lineHeight: 1.65, margin: 0 }}>{description}</p>
      </div>

      <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
        {chips.map((c) => (
          <span
            key={c}
            style={{
              fontSize: 11, fontWeight: 600, letterSpacing: "0.4px",
              color: "#374151", background: "#F4F5F8",
              border: "1px solid #E8E8EA", borderRadius: 999,
              padding: "4px 10px",
            }}
          >
            {c}
          </span>
        ))}
      </div>

      <span
        style={{
          marginTop: "auto",
          display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 8,
          background: "linear-gradient(135deg, #0C1BA8, #1E35D4)",
          color: "#FFFFFF", border: "none", borderRadius: 10,
          padding: "12px 16px", fontSize: 14, fontWeight: 600,
          boxShadow: "0 4px 14px rgba(12,27,168,0.30)",
        }}
      >
        {cta} <ArrowRight size={16} />
      </span>
    </button>
  );
}

function SecondaryModuleCard({
  title, description, cta, icon, onClick,
}: {
  title: string; description: string; cta: string; icon: React.ReactNode; onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      style={{
        textAlign: "left",
        background: "#FFFFFF", borderRadius: 16,
        border: "1px solid #E8E8EA", padding: 28,
        cursor: "pointer",
        boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
        display: "flex", flexDirection: "column", gap: 14,
        transition: "all 0.2s cubic-bezier(0.4,0,0.2,1)",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-2px)";
        e.currentTarget.style.borderColor = "#0C1BA8";
        e.currentTarget.style.boxShadow = "0 8px 24px rgba(12,27,168,0.10)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.borderColor = "#E8E8EA";
        e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.04)";
      }}
    >
      <div
        style={{
          width: 40, height: 40, borderRadius: 10,
          background: "#EEF0FF", color: "#0C1BA8",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}
      >
        {icon}
      </div>
      <div style={{ flex: 1 }}>
        <h3 style={{ fontSize: 17, fontWeight: 600, color: "#272727", margin: "0 0 6px" }}>{title}</h3>
        <p style={{ fontSize: 13, color: "#6B7280", lineHeight: 1.6, margin: 0 }}>{description}</p>
      </div>
      <span
        style={{
          display: "inline-flex", alignItems: "center", gap: 6,
          fontSize: 13, fontWeight: 600, color: "#0C1BA8",
        }}
      >
        {cta} <ChevronRight size={14} />
      </span>
    </button>
  );
}

/* ============================================================================
 * Saved Opportunities backlog
 * ========================================================================== */
const STATUS_META: Record<SavedOpportunityStatus, { label: string; bg: string; color: string; dot: string }> = {
  backlog: { label: "Backlog", bg: "#F3F4F6", color: "#374151", dot: "#9CA3AF" },
  em_transformacao: { label: "Em transformação", bg: "#EEF0FF", color: "#0C1BA8", dot: "#0C1BA8" },
  concluida: { label: "Concluída", bg: "#ECFDF5", color: "#0F766E", dot: "#16A34A" },
};

const SOURCE_LABELS: Record<SavedOpportunity["sourceMode"], string> = {
  simulate: "Simular melhoria",
  goal: "Definir objetivo",
  scope: "Escopo da cadeia",
};

function SavedOpportunitiesSection({ language }: { language: string }) {
  const navigate = useNavigate();
  const saved = useOpportunityStore((s) => s.savedOpportunities);
  const remove = useOpportunityStore((s) => s.removeOpportunity);
  const [detail, setDetail] = useState<SavedOpportunity | null>(null);

  const startTransform = (op: SavedOpportunity) => {
    const params = new URLSearchParams({
      opportunityId: op.originalId,
      processName: op.impactedProcesses[0]?.name ?? "",
      context: op.title,
    });
    navigate(`/org-intelligence-hub/transform?${params.toString()}`);
  };

  return (
    <section>
      <div style={{ marginBottom: 18 }}>
        <h2 style={{ fontSize: 18, fontWeight: 600, color: "#272727", margin: 0 }}>
          {language === "PT" ? "Pipeline de Oportunidades" : "Opportunity Pipeline"}
        </h2>
        <p style={{ fontSize: 13, color: "#6B7280", margin: "4px 0 0" }}>
          {language === "PT"
            ? "Oportunidades identificadas e seu status de transformação."
            : "Identified opportunities and their transformation status."}
        </p>
      </div>

      {saved.length === 0 ? (
        <div
          style={{
            background: "#FFFFFF", border: "1px solid #EAEBEF", borderRadius: 16,
            padding: "48px 24px", display: "flex", flexDirection: "column",
            alignItems: "center", textAlign: "center", gap: 12,
            boxShadow: "0 1px 4px rgba(12,27,168,0.04), 0 4px 16px rgba(0,0,0,0.03)",
          }}
        >
          <div style={{
            width: 52, height: 52, borderRadius: 14,
            background: "linear-gradient(135deg, #EEF0FF, #DBEAFE)",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <Bookmark size={22} style={{ color: "#0C1BA8" }} />
          </div>
          <h3 style={{ fontSize: 15, fontWeight: 600, color: "#272727", margin: 0 }}>
            Nenhuma oportunidade salva ainda
          </h3>
          <p style={{ fontSize: 13, color: "#6B7280", margin: 0, maxWidth: 420 }}>
            Comece descobrindo oportunidades na sua cadeia de valor.
          </p>
          <button
            onClick={() => navigate("/org-intelligence-hub/discover")}
            style={{
              marginTop: 6, display: "inline-flex", alignItems: "center", gap: 6,
              background: "linear-gradient(135deg, #0C1BA8, #1E35D4)",
              color: "#FFFFFF", border: "none", borderRadius: 10,
              padding: "10px 18px", fontSize: 13, fontWeight: 600, cursor: "pointer",
              boxShadow: "0 4px 14px rgba(12,27,168,0.30)",
            }}
          >
            <Sparkles size={14} /> Descobrir oportunidades
          </button>
        </div>
      ) : (
        <div
          style={{
            background: "#FFFFFF", border: "1px solid #EAEBEF", borderRadius: 16,
            overflow: "hidden",
            boxShadow: "0 1px 4px rgba(12,27,168,0.04), 0 4px 16px rgba(0,0,0,0.03)",
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "2.4fr 1fr 1.2fr 0.9fr 1fr",
              padding: "14px 24px", background: "#FAFBFF",
              borderBottom: "1px solid #EAEBEF",
              fontSize: 10.5, fontWeight: 700, letterSpacing: "1px",
              textTransform: "uppercase", color: "#A5A7B0",
            }}
          >
            <span>Oportunidade</span><span>Origem</span><span>Alavanca</span><span>Status</span><span style={{ textAlign: "right" }}>Ações</span>
          </div>
          {saved.map((op) => (
            <SavedRow
              key={op.uid}
              op={op}
              onDetails={() => setDetail(op)}
              onTransform={() => startTransform(op)}
              onRemove={() => remove(op.uid)}
            />
          ))}
        </div>
      )}

      <SavedDetailModal op={detail} onClose={() => setDetail(null)} onTransform={startTransform} />
    </section>
  );
}

function SavedRow({
  op, onDetails, onTransform, onRemove,
}: {
  op: SavedOpportunity;
  onDetails: () => void;
  onTransform: () => void;
  onRemove: () => void;
}) {
  const status = STATUS_META[op.status];
  const activeLevers = (Object.entries(op.valueLeverImpacts) as [ValueLever, ImpactLevel][])
    .filter(([, l]) => l === "Alto" || l === "Médio")
    .slice(0, 2)
    .map(([k]) => k);

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "2.4fr 1fr 1.2fr 0.9fr 1fr",
        padding: "16px 24px", alignItems: "center", gap: 12,
        borderBottom: "1px solid #F0F1F5",
        transition: "background 0.2s",
      }}
      onMouseEnter={(e) => (e.currentTarget.style.background = "#FAFBFF")}
      onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
    >
      <div style={{ minWidth: 0 }}>
        <div style={{ fontSize: 14, fontWeight: 600, color: "#272727", marginBottom: 3 }}>{op.title}</div>
        <div style={{ fontSize: 12, color: "#6B7280", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
          {op.description}
        </div>
      </div>
      <span
        style={{
          fontSize: 11, fontWeight: 600, color: "#374151",
          background: "#F4F5F8", padding: "3px 10px", borderRadius: 4,
          textTransform: "uppercase", letterSpacing: "0.5px",
          justifySelf: "start",
        }}
      >
        {SOURCE_LABELS[op.sourceMode]}
      </span>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
        {activeLevers.map((l) => (
          <span key={l} style={{
            fontSize: 10.5, color: "#0C1BA8", background: "#EEF0FF",
            border: "1px solid #C7CEFF", padding: "2px 7px", borderRadius: 999, fontWeight: 600,
          }}>
            {l.split(" ")[0]}
          </span>
        ))}
      </div>
      <span
        style={{
          display: "inline-flex", alignItems: "center", gap: 6,
          fontSize: 11, fontWeight: 700, padding: "4px 10px",
          borderRadius: 999, background: status.bg, color: status.color,
          textTransform: "uppercase", letterSpacing: "0.5px",
          justifySelf: "start",
        }}
      >
        <span style={{ width: 6, height: 6, borderRadius: "50%", background: status.dot }} />
        {status.label}
      </span>
      <div style={{ display: "flex", gap: 6, justifyContent: "flex-end" }}>
        <IconButton onClick={onDetails} aria="Ver detalhes"><Eye size={14} /></IconButton>
        <button onClick={onTransform} style={{
          display: "inline-flex", alignItems: "center", gap: 4, fontSize: 12,
          padding: "7px 12px", border: "none", borderRadius: 8,
          background: "linear-gradient(135deg, #0C1BA8, #1E35D4)",
          color: "#FFFFFF", cursor: "pointer", fontWeight: 600,
          boxShadow: "0 2px 6px rgba(12,27,168,0.22)",
        }}>
          Iniciar <ArrowRight size={12} />
        </button>
        <IconButton onClick={onRemove} aria="Remover"><Trash2 size={13} /></IconButton>
      </div>
    </div>
  );
}

function IconButton({ onClick, children, aria }: { onClick: () => void; children: React.ReactNode; aria: string }) {
  return (
    <button onClick={onClick} aria-label={aria} style={{
      display: "inline-flex", alignItems: "center", justifyContent: "center",
      width: 30, height: 30, border: "1px solid #E8E8EA", borderRadius: 8,
      background: "#FFFFFF", color: "#6B7280", cursor: "pointer",
      transition: "all 0.2s",
    }}
      onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#0C1BA8"; e.currentTarget.style.color = "#0C1BA8"; }}
      onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#E8E8EA"; e.currentTarget.style.color = "#6B7280"; }}
    >
      {children}
    </button>
  );
}

function SavedDetailModal({
  op, onClose, onTransform,
}: {
  op: SavedOpportunity | null;
  onClose: () => void;
  onTransform: (op: SavedOpportunity) => void;
}) {
  if (!op) {
    return (
      <Dialog open={false} onOpenChange={onClose}>
        <DialogContent />
      </Dialog>
    );
  }
  return (
    <Dialog open={!!op} onOpenChange={(o) => !o && onClose()}>
      <DialogContent style={{ maxWidth: 640, padding: 0, overflow: "hidden", borderRadius: 20 }}>
        <div style={{ background: HERO_GRADIENT, padding: "28px 32px", color: "#FFFFFF" }}>
          <DialogHeader>
            <DialogTitle style={{ fontSize: 22, fontWeight: 700, color: "#FFFFFF", letterSpacing: "-0.3px" }}>
              {op.title}
            </DialogTitle>
          </DialogHeader>
          <p style={{ fontSize: 13.5, color: "rgba(255,255,255,0.78)", lineHeight: 1.6, margin: "10px 0 0" }}>
            {op.description}
          </p>
        </div>
        <div style={{ padding: "24px 32px", display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10 }}>
            <Stat label="Impacto" value={op.impact} />
            <Stat label="Esforço" value={op.effort} />
            <Stat label="Ganho" value={op.estimatedGain} />
          </div>
          <div>
            <SectionLabel>Processos relacionados</SectionLabel>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {op.impactedProcesses.map((p) => (
                <div key={p.name} style={{
                  display: "flex", alignItems: "center", gap: 8,
                  padding: "8px 10px", background: "#FAFBFF", border: "1px solid #E8E8EA",
                  borderRadius: 8, fontSize: 12.5,
                }}>
                  <span style={{
                    fontSize: 10, fontWeight: 700, color: "#FFFFFF",
                    background: "#0C1BA8", padding: "2px 6px", borderRadius: 3,
                    fontFamily: "ui-monospace, monospace",
                  }}>{p.level}</span>
                  <span style={{ color: "#272727" }}>{p.name}</span>
                </div>
              ))}
            </div>
          </div>
          <div>
            <SectionLabel>Use case sugerido</SectionLabel>
            <div style={{ padding: 14, background: "linear-gradient(135deg, #EEF0FF, #DBEAFE)", border: "1px solid #C7CEFF", borderRadius: 12 }}>
              <p style={{ fontSize: 13, color: "#1E40AF", margin: 0, lineHeight: 1.6 }}>{op.suggestedUseCase}</p>
            </div>
          </div>
        </div>
        <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", borderTop: "1px solid #E8E8EA", padding: "20px 32px" }}>
          <button onClick={onClose} style={{ background: "none", color: "#6B7280", border: "none", padding: "8px 12px", fontSize: 13, cursor: "pointer", fontWeight: 500 }}>
            Fechar
          </button>
          <button onClick={() => onTransform(op)} style={{
            display: "inline-flex", alignItems: "center", gap: 6,
            background: "linear-gradient(135deg, #0C1BA8, #1E35D4)",
            color: "#FFFFFF", border: "none", borderRadius: 10,
            padding: "10px 18px", fontSize: 13.5, fontWeight: 600, cursor: "pointer",
            boxShadow: "0 4px 14px rgba(12,27,168,0.30)",
          }}>
            Iniciar transformação <ArrowRight size={14} />
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div style={{
      background: "#FAFBFF", border: "1px solid #E8E8EA", borderRadius: 10,
      padding: "10px 12px", textAlign: "center",
      borderLeft: "3px solid #0C1BA8",
    }}>
      <div style={{ fontSize: 10, color: "#A5A7B0", textTransform: "uppercase", letterSpacing: "1px", fontWeight: 700 }}>{label}</div>
      <div style={{ fontSize: 14, fontWeight: 700, color: "#0C1BA8", marginTop: 4 }}>{value}</div>
    </div>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ fontSize: 10.5, fontWeight: 700, color: "#A5A7B0", letterSpacing: "1.2px", textTransform: "uppercase", marginBottom: 8 }}>
      {children}
    </div>
  );
}

export default OrgIntelligenceHub;
