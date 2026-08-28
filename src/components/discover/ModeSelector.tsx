import { Sparkles, Target, Wand2, ChevronRight, ListTree, ArrowRight } from "lucide-react";

export type DiscoverMode = "simulate" | "goal" | "scope";

interface Props {
  onSelect: (mode: DiscoverMode) => void;
}

const HERO_GRADIENT =
  "linear-gradient(135deg, #04223D 0%, #0C1BA8 60%, #1428CC 100%)";

export function ModeSelector({ onSelect }: Props) {
  return (
    <section style={{ position: "relative" }}>
      {/* Dark hero band */}
      <div
        style={{
          background: HERO_GRADIENT,
          borderRadius: 20,
          padding: "40px 40px 64px",
          color: "#FFFFFF",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            fontSize: 11, fontWeight: 700, letterSpacing: "1.2px",
            textTransform: "uppercase", color: "rgba(255,255,255,0.55)",
            marginBottom: 12,
          }}
        >
          Descoberta de Oportunidades
        </div>
        <h2 style={{ fontSize: 26, fontWeight: 700, color: "#FFFFFF", margin: 0, letterSpacing: "-0.4px" }}>
          Como você quer começar?
        </h2>
        <p style={{ fontSize: 14, color: "rgba(255,255,255,0.72)", margin: "10px 0 0", maxWidth: 560 }}>
          Escolha o ponto de partida da sua análise. Você pode mudar a qualquer momento.
        </p>
      </div>

      {/* Cards overlap */}
      <div style={{ marginTop: -40, padding: "0 8px", position: "relative" }}>
        <div className="grid gap-5" style={{ gridTemplateColumns: "repeat(2, 1fr)" }}>
          <ModeCard
            icon={<Wand2 size={26} />}
            title="Simular uma melhoria"
            description="Já tenho uma iniciativa e quero entender seus impactos e oportunidades."
            examples={["Implementar IA no atendimento", "Centralizar aprovações em um único sistema"]}
            onClick={() => onSelect("simulate")}
          />
          <ModeCard
            icon={<Target size={26} />}
            title="Definir um objetivo"
            description="Quero atingir um resultado e descobrir quais processos e iniciativas são necessários."
            examples={["Reduzir o tempo de admissão em 30%", "Diminuir custo operacional do financeiro"]}
            onClick={() => onSelect("goal")}
          />
        </div>

        <button
          onClick={() => onSelect("scope")}
          style={{
            marginTop: 16, width: "100%",
            display: "flex", alignItems: "center", gap: 14,
            padding: "18px 22px",
            background: "#FAFBFF",
            border: "1.5px dashed #C7CEFF",
            borderRadius: 12,
            cursor: "pointer", textAlign: "left",
            transition: "all 0.2s cubic-bezier(0.4,0,0.2,1)",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "#EEF0FF";
            e.currentTarget.style.borderColor = "#0C1BA8";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "#FAFBFF";
            e.currentTarget.style.borderColor = "#C7CEFF";
          }}
        >
          <div
            style={{
              width: 32, height: 32, borderRadius: 10,
              background: "#EEF0FF",
              display: "flex", alignItems: "center", justifyContent: "center",
              color: "#0C1BA8", flexShrink: 0,
            }}
          >
            <ListTree size={16} />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 14, fontWeight: 600, color: "#272727" }}>
              Explorar pela cadeia de valor
            </div>
            <div style={{ fontSize: 12.5, color: "#6B7280", marginTop: 2 }}>
              Selecione áreas e processos manualmente para descobrir oportunidades.
            </div>
          </div>
          <ChevronRight size={18} style={{ color: "#0C1BA8" }} />
        </button>
      </div>
    </section>
  );
}

function ModeCard({
  icon, title, description, examples, onClick,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  examples: string[];
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      style={{
        textAlign: "left",
        background: "#FFFFFF",
        border: "1px solid #E8E8EA",
        borderRadius: 16,
        padding: 28,
        cursor: "pointer",
        transition: "all 0.2s cubic-bezier(0.4,0,0.2,1)",
        boxShadow: "0 8px 24px rgba(12,27,168,0.08), 0 2px 8px rgba(0,0,0,0.04)",
        display: "flex", flexDirection: "column", gap: 16,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-4px)";
        e.currentTarget.style.borderColor = "#0C1BA8";
        e.currentTarget.style.boxShadow = "0 12px 32px rgba(12,27,168,0.16), 0 4px 12px rgba(0,0,0,0.05)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.borderColor = "#E8E8EA";
        e.currentTarget.style.boxShadow = "0 8px 24px rgba(12,27,168,0.08), 0 2px 8px rgba(0,0,0,0.04)";
      }}
    >
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
        <div
          style={{
            width: 52, height: 52, borderRadius: 14,
            background: "linear-gradient(135deg, #EEF0FF, #DBEAFE)",
            display: "flex", alignItems: "center", justifyContent: "center",
            color: "#0C1BA8",
          }}
        >
          {icon}
        </div>
        <span style={{
          fontSize: 10, fontWeight: 700, letterSpacing: "1.2px", textTransform: "uppercase",
          color: "#A5A7B0",
        }}>
          Modo
        </span>
      </div>

      <div>
        <h3 style={{ fontSize: 17, fontWeight: 700, color: "#272727", margin: "0 0 6px", letterSpacing: "-0.2px" }}>
          {title}
        </h3>
        <p style={{ fontSize: 13, color: "#6B7280", lineHeight: 1.65, margin: 0 }}>
          {description}
        </p>
      </div>

      <div style={{ borderTop: "1px solid #F0F1F5", paddingTop: 14 }}>
        <div style={{
          fontSize: 10, fontWeight: 700, color: "#A5A7B0",
          textTransform: "uppercase", letterSpacing: "1.2px", marginBottom: 8,
        }}>
          Exemplos
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {examples.map((ex) => (
            <div
              key={ex}
              style={{
                display: "flex", alignItems: "center", justifyContent: "space-between",
                background: "#F4F5F8", borderRadius: 6,
                padding: "7px 10px", fontSize: 12, color: "#374151",
              }}
            >
              <span>{ex}</span>
              <ChevronRight size={12} style={{ color: "#A5A7B0" }} />
            </div>
          ))}
        </div>
      </div>

      <span
        style={{
          marginTop: "auto",
          display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 8,
          background: "linear-gradient(135deg, #0C1BA8, #1E35D4)",
          color: "#FFFFFF", border: "none", borderRadius: 10,
          padding: "11px 16px", fontSize: 14, fontWeight: 600,
          boxShadow: "0 4px 14px rgba(12,27,168,0.30)",
        }}
      >
        Começar agora <ArrowRight size={16} />
      </span>
    </button>
  );
}
