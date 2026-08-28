import { Construction } from "lucide-react";

interface BacklogTagProps {
  /** Position the tag fixed in the corner (persists on scroll). Defaults to inline. */
  fixed?: boolean;
  label?: string;
}

/**
 * Visual tag indicating a screen is a prototype / in backlog (not yet in production).
 */
export function BacklogTag({ fixed = false, label = "Backlog" }: BacklogTagProps) {
  return (
    <div
      title="Funcionalidade em backlog — protótipo, ainda não disponível em produção"
      style={{
        ...(fixed
          ? { position: "fixed", top: 14, right: 16, zIndex: 1000 }
          : { display: "inline-flex" }),
        alignItems: "center",
        gap: 7,
        padding: "6px 12px 6px 10px",
        borderRadius: 999,
        background: "linear-gradient(135deg, #FDE68A 0%, #FBBF24 100%)",
        color: "#7C2D12",
        border: "1px solid #F59E0B",
        fontSize: 11,
        fontWeight: 800,
        textTransform: "uppercase",
        letterSpacing: 0.7,
        boxShadow: fixed
          ? "0 4px 12px -2px rgba(245, 158, 11, 0.45), 0 0 0 3px rgba(253, 230, 138, 0.4)"
          : undefined,
        userSelect: "none",
        whiteSpace: "nowrap",
      }}
    >
      <span
        style={{
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          width: 16,
          height: 16,
          borderRadius: 999,
          background: "rgba(255,255,255,0.55)",
        }}
      >
        <Construction size={10} strokeWidth={2.5} />
      </span>
      {label}
    </div>
  );
}
