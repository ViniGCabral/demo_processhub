import { useState } from "react";
import { FileText, Activity, Layers, Network } from "lucide-react";

interface Tab { key: string; label: string; icon: React.ReactNode; node: React.ReactNode; }

interface Props {
  summarySection: React.ReactNode;
  indicatorsSection: React.ReactNode;
  dimensionsSection: React.ReactNode;
  relationsSection: React.ReactNode;
  extraSections?: { label: string; node: React.ReactNode }[];
}

export function ResultsTabs({ summarySection, indicatorsSection, dimensionsSection, relationsSection, extraSections = [] }: Props) {
  const baseTabs: Tab[] = [
    { key: "resumo", label: "Resumo", icon: <FileText size={14} />, node: summarySection },
    { key: "indicadores", label: "Indicadores", icon: <Activity size={14} />, node: indicatorsSection },
    { key: "dimensoes", label: "Dimensões", icon: <Layers size={14} />, node: dimensionsSection },
    { key: "relacoes", label: "Mapa de relações", icon: <Network size={14} />, node: relationsSection },
  ];
  const tabs = [
    ...baseTabs,
    ...extraSections.map((s, i) => ({ key: `extra-${i}`, label: s.label, icon: <Layers size={14} />, node: s.node })),
  ];
  const [active, setActive] = useState(tabs[0].key);
  const current = tabs.find((t) => t.key === active) || tabs[0];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <div
        style={{
          display: "flex", gap: "4px", padding: "4px",
          background: "#F4F5F8", border: "1px solid #E8E8EA",
          borderRadius: "12px", overflowX: "auto",
        }}
      >
        {tabs.map((t) => {
          const isActive = active === t.key;
          return (
            <button
              key={t.key}
              onClick={() => setActive(t.key)}
              style={{
                display: "inline-flex", alignItems: "center", gap: "6px",
                padding: "8px 14px", borderRadius: "8px",
                background: isActive ? "#FFFFFF" : "transparent",
                border: "none", cursor: "pointer",
                fontSize: "13px", fontWeight: 600,
                color: isActive ? "#0C1BA8" : "#6B7280",
                boxShadow: isActive ? "0 1px 3px rgba(0,0,0,0.05)" : "none",
                whiteSpace: "nowrap",
              }}
            >
              {t.icon}{t.label}
            </button>
          );
        })}
      </div>
      <div>{current.node}</div>
    </div>
  );
}
