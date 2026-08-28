import { TrendingUp, TrendingDown, HelpCircle, Activity, Gauge as GaugeIcon, BarChart3 } from "lucide-react";

export interface IndicatorSummary {
  sentiment: "positivo" | "negativo" | "incerto";
  confidence: number; // 0-100
  impact: "Alto" | "Médio" | "Baixo";
  scale: string;
  areas: number;
  processes: number;
  systems: number;
}

export function IndicatorsPanel({ summary }: { summary: IndicatorSummary }) {
  const sentimentMeta = {
    positivo: { color: "#0F766E", bg: "#ECFDF5", border: "#A7F3D0", icon: <TrendingUp size={13} />, label: "Positivo" },
    negativo: { color: "#B91C1C", bg: "#FEF2F2", border: "#FECACA", icon: <TrendingDown size={13} />, label: "Negativo" },
    incerto:  { color: "#92400E", bg: "#FFFBEB", border: "#FDE68A", icon: <HelpCircle size={13} />, label: "Incerto" },
  }[summary.sentiment];

  return (
    <aside
      style={{
        position: "sticky", top: "16px",
        background: "#FFFFFF",
        border: "1px solid #E8E8EA",
        borderRadius: "16px",
        overflow: "hidden",
        display: "flex", flexDirection: "column",
      }}
    >
      {/* Premium dark header band */}
      <div style={{
        background: "linear-gradient(135deg, #04223D 0%, #0C1BA8 100%)",
        padding: "16px 20px",
        display: "flex", alignItems: "center", gap: "10px",
      }}>
        <div style={{
          width: "32px", height: "32px", borderRadius: "10px",
          background: "rgba(255,255,255,0.12)",
          border: "1px solid rgba(255,255,255,0.18)",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <BarChart3 size={15} style={{ color: "#FFFFFF" }} />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: "9.5px", fontWeight: 700, color: "rgba(255,255,255,0.6)", textTransform: "uppercase", letterSpacing: "0.8px" }}>
            Painel da análise
          </div>
          <div style={{ fontSize: "13px", fontWeight: 600, color: "#FFFFFF", marginTop: "2px" }}>
            Indicadores em tempo real
          </div>
        </div>
      </div>

      <div style={{ padding: "20px", display: "flex", flexDirection: "column", gap: "16px" }}>
        <div
          style={{
            display: "inline-flex", alignItems: "center", gap: "6px",
            padding: "6px 12px", borderRadius: "999px",
            background: sentimentMeta.bg, color: sentimentMeta.color,
            border: `1px solid ${sentimentMeta.border}`,
            fontSize: "11.5px", fontWeight: 600, alignSelf: "flex-start",
          }}
        >
          {sentimentMeta.icon} {sentimentMeta.label}
        </div>

        <Gauge label="Confiança" value={summary.confidence} suffix="%" icon={<GaugeIcon size={13} />} />
        <ImpactRow value={summary.impact} />
        <KeyValue label="Escala" value={summary.scale} />

        <div style={{ borderTop: "1px solid #F3F4F6", paddingTop: "14px", display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "8px" }}>
          <Mini label="Áreas" value={summary.areas} />
          <Mini label="Processos" value={summary.processes} />
          <Mini label="Sistemas" value={summary.systems} />
        </div>
      </div>
    </aside>
  );
}

function Gauge({ label, value, suffix, icon }: { label: string; value: number; suffix?: string; icon: React.ReactNode }) {
  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "6px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "11.5px", color: "#6B7280", fontWeight: 500 }}>
          {icon}{label}
        </div>
        <div style={{ fontSize: "13px", fontWeight: 700, color: "#0C1BA8" }}>{value}{suffix}</div>
      </div>
      <div style={{ height: "6px", background: "#F3F4F6", borderRadius: "999px", overflow: "hidden" }}>
        <div style={{ width: `${value}%`, height: "100%", background: "linear-gradient(90deg, #0C1BA8, #1428CC)", borderRadius: "999px", transition: "width 0.4s" }} />
      </div>
    </div>
  );
}

function ImpactRow({ value }: { value: "Alto" | "Médio" | "Baixo" }) {
  const map = { Alto: 3, Médio: 2, Baixo: 1 } as const;
  const v = map[value];
  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "6px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "11.5px", color: "#6B7280", fontWeight: 500 }}>
          <Activity size={13} /> Impacto
        </div>
        <div style={{ fontSize: "13px", fontWeight: 700, color: "#272727" }}>{value}</div>
      </div>
      <div style={{ display: "flex", gap: "4px" }}>
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            style={{
              flex: 1, height: "6px", borderRadius: "999px",
              background: i <= v ? "#0C1BA8" : "#F3F4F6",
            }}
          />
        ))}
      </div>
    </div>
  );
}

function KeyValue({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 12px", background: "#FAFAFC", border: "1px solid #F3F4F6", borderRadius: "10px" }}>
      <span style={{ fontSize: "11.5px", color: "#6B7280", fontWeight: 500 }}>{label}</span>
      <span style={{ fontSize: "12px", color: "#272727", fontWeight: 600, textAlign: "right" }}>{value}</span>
    </div>
  );
}

function Mini({ label, value }: { label: string; value: number }) {
  return (
    <div style={{ textAlign: "center", padding: "10px 4px", background: "#FAFAFC", borderRadius: "10px", border: "1px solid #F3F4F6" }}>
      <div style={{ fontSize: "18px", fontWeight: 700, color: "#0C1BA8", lineHeight: 1 }}>{value}</div>
      <div style={{ fontSize: "9.5px", color: "#6B7280", textTransform: "uppercase", letterSpacing: "0.5px", marginTop: "4px", fontWeight: 600 }}>{label}</div>
    </div>
  );
}
