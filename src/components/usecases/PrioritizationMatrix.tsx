import { useState, useMemo } from "react";
import { X, Bookmark, BookmarkCheck, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { UseCase } from "@/stores/useCaseStore";
import { cn } from "@/lib/utils";

interface PrioritizationMatrixProps {
  useCases: UseCase[];
  savedIds: Set<string>;
  onClose: () => void;
  onToggleSave: (uc: UseCase, e: React.MouseEvent) => void;
}

type Quadrant = "quick_wins" | "strategic" | "tactical" | "reconsider";

const effortLabels: Record<string, Record<string, string>> = {
  very_low: { PT: "Muito Baixo", EN: "Very Low" },
  low: { PT: "Baixo", EN: "Low" },
  high: { PT: "Alto", EN: "High" },
  very_high: { PT: "Muito Alto", EN: "Very High" },
};

const impactLabels: Record<string, Record<string, string>> = {
  very_low: { PT: "Muito Baixo", EN: "Very Low" },
  low: { PT: "Baixo", EN: "Low" },
  high: { PT: "Alto", EN: "High" },
  very_high: { PT: "Muito Alto", EN: "Very High" },
};

function getQuadrant(uc: UseCase): Quadrant {
  const highEffort = uc.effort === "high" || uc.effort === "very_high";
  const highImpact = uc.impact === "high" || uc.impact === "very_high";
  if (!highEffort && highImpact) return "quick_wins";
  if (highEffort && highImpact) return "strategic";
  if (!highEffort && !highImpact) return "tactical";
  return "reconsider";
}

// Map effort/impact to a 0-1 position
function toPosition(value: string): number {
  switch (value) {
    case "very_low": return 0.15;
    case "low": return 0.35;
    case "high": return 0.65;
    case "very_high": return 0.85;
    default: return 0.5;
  }
}

export function PrioritizationMatrix({ useCases, savedIds, onClose, onToggleSave }: PrioritizationMatrixProps) {
  const { language } = useLanguage();
  const [filter, setFilter] = useState<"all" | "saved" | "not_saved" | Quadrant>("all");

  const savedCount = useCases.filter((uc) => savedIds.has(uc.id)).length;
  const notSavedCount = useCases.length - savedCount;

  const filtered = useMemo(() => {
    return useCases.filter((uc) => {
      if (filter === "saved") return savedIds.has(uc.id);
      if (filter === "not_saved") return !savedIds.has(uc.id);
      if (filter === "quick_wins" || filter === "strategic" || filter === "tactical" || filter === "reconsider") {
        return getQuadrant(uc) === filter;
      }
      return true;
    });
  }, [useCases, savedIds, filter]);

  // Group overlapping points
  const points = useMemo(() => {
    const map = new Map<string, UseCase[]>();
    filtered.forEach((uc) => {
      const key = `${uc.effort}-${uc.impact}`;
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(uc);
    });
    return Array.from(map.entries()).map(([key, ucs]) => {
      const x = toPosition(ucs[0].effort);
      const y = 1 - toPosition(ucs[0].impact); // invert Y: high impact at top
      return { key, x, y, useCases: ucs };
    });
  }, [filtered]);

  const quadrantLabels = {
    quick_wins: { title: "Quick Wins", desc: language === "PT" ? "Alto impacto, baixo esforço" : "High impact, low effort" },
    strategic: { title: language === "PT" ? "Projetos Estratégicos" : "Strategic Projects", desc: language === "PT" ? "Alto impacto, alto esforço" : "High impact, high effort" },
    tactical: { title: language === "PT" ? "Ações Táticas" : "Tactical Actions", desc: language === "PT" ? "Baixo impacto, baixo esforço" : "Low impact, low effort" },
    reconsider: { title: language === "PT" ? "Reconsiderar" : "Reconsider", desc: language === "PT" ? "Baixo impacto, alto esforço" : "Low impact, high effort" },
  };

  const filterButtons: { key: typeof filter; label: string; icon?: any }[] = [
    { key: "all", label: "All" },
    { key: "saved", label: language === "PT" ? "Salvos" : "Saved" },
    { key: "not_saved", label: language === "PT" ? "Não salvos" : "Not saved" },
    { key: "quick_wins", label: "Quick Wins" },
    { key: "strategic", label: language === "PT" ? "Estratégicos" : "Strategic Projects" },
    { key: "tactical", label: language === "PT" ? "Ações Táticas" : "Tactical Actions" },
    { key: "reconsider", label: language === "PT" ? "Reconsiderar" : "Reconsider" },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-sm border border-[#A5A7B0]/30 w-[95vw] max-w-[1200px] max-h-[90vh] flex flex-col shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#A5A7B0]/20">
          <div>
            <h2 className="text-lg font-semibold text-[#272727]">
              {language === "PT" ? "Matriz de Esforço vs Impacto" : "Effort vs Impact Matrix"}
            </h2>
            <p className="text-sm text-[#A5A7B0]">
              {useCases.length} {language === "PT" ? "casos de uso" : "use cases"} ({savedCount} {language === "PT" ? "salvos" : "saved"} · {notSavedCount} {language === "PT" ? "não salvos" : "not saved"})
            </p>
          </div>
          <button onClick={onClose} className="h-8 w-8 flex items-center justify-center rounded-sm hover:bg-[#A5A7B0]/10 text-[#A5A7B0]">
            <X size={20} />
          </button>
        </div>

        {/* Filter bar */}
        <div className="flex items-center gap-2 px-6 py-3 border-b border-[#A5A7B0]/10 flex-wrap">
          <Filter size={16} className="text-[#A5A7B0] shrink-0" />
          {filterButtons.map((fb) => (
            <button
              key={fb.key}
              onClick={() => setFilter(fb.key)}
              className={cn(
                "px-3 py-1.5 rounded-full text-xs font-medium border transition-colors",
                filter === fb.key
                  ? "border-[#0C1BA8] text-[#0C1BA8] bg-[#0C1BA8]/5"
                  : "border-[#A5A7B0]/30 text-[#272727] hover:border-[#A5A7B0]/60"
              )}
            >
              {fb.key === "saved" && <Bookmark className="h-3 w-3 inline mr-1" />}
              {fb.key === "not_saved" && <BookmarkCheck className="h-3 w-3 inline mr-1" />}
              {fb.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex flex-1 min-h-0 overflow-hidden">
          {/* Matrix */}
          <div className="flex-1 p-6 flex flex-col">
            <div className="flex-1 relative min-h-[400px]">
              {/* Axis labels */}
              <div className="absolute left-0 top-0 bottom-8 w-6 flex items-center justify-center">
                <span className="text-[10px] text-[#A5A7B0] -rotate-90 whitespace-nowrap tracking-wider">
                  {language === "PT" ? "Impacto →" : "Impact →"}
                </span>
              </div>
              <div className="absolute left-6 bottom-0 right-0 h-6 flex items-center justify-center">
                <span className="text-[10px] text-[#A5A7B0] tracking-wider">
                  {language === "PT" ? "Esforço →" : "Effort →"}
                </span>
              </div>

              {/* Low/High labels */}
              <span className="absolute left-8 bottom-0 text-[9px] text-[#A5A7B0]">Low</span>
              <span className="absolute right-0 bottom-0 text-[9px] text-[#A5A7B0]">High</span>
              <span className="absolute left-0 top-0 text-[9px] text-[#A5A7B0]">High</span>
              <span className="absolute left-0 bottom-8 text-[9px] text-[#A5A7B0]">Low</span>

              {/* Quadrants */}
              <div className="absolute left-7 top-0 right-0 bottom-7 grid grid-cols-2 grid-rows-2">
                {/* Quick Wins - top-left */}
                <div className="border-r border-b border-[#A5A7B0]/20 bg-[#f0fdf4]/50 p-3">
                  <p className="text-xs font-semibold text-[#272727]">{quadrantLabels.quick_wins.title}</p>
                  <p className="text-[10px] text-[#A5A7B0]">{quadrantLabels.quick_wins.desc}</p>
                </div>
                {/* Strategic - top-right */}
                <div className="border-b border-[#A5A7B0]/20 bg-[#eef2ff]/60 p-3">
                  <p className="text-xs font-semibold text-[#272727]">{quadrantLabels.strategic.title}</p>
                  <p className="text-[10px] text-[#A5A7B0]">{quadrantLabels.strategic.desc}</p>
                </div>
                {/* Tactical - bottom-left */}
                <div className="border-r border-[#A5A7B0]/20 bg-white p-3">
                  <p className="text-xs font-semibold text-[#272727]">{quadrantLabels.tactical.title}</p>
                  <p className="text-[10px] text-[#A5A7B0]">{quadrantLabels.tactical.desc}</p>
                </div>
                {/* Reconsider - bottom-right */}
                <div className="bg-[#fef2f2]/50 p-3">
                  <p className="text-xs font-semibold text-[#272727]">{quadrantLabels.reconsider.title}</p>
                  <p className="text-[10px] text-[#A5A7B0]">{quadrantLabels.reconsider.desc}</p>
                </div>
              </div>

              {/* Points */}
              {points.map((pt) => (
                <div
                  key={pt.key}
                  className="absolute z-10"
                  style={{
                    left: `calc(28px + ${pt.x * 100}% * (1 - 35px / 100%))`,
                    top: `calc(${pt.y * 100}% * (1 - 28px / 100%))`,
                    transform: "translate(-50%, -50%)",
                  }}
                >
                  {pt.useCases.length === 1 ? (
                    <div
                      className="w-3 h-3 rounded-full bg-[#A5A7B0]/60 hover:bg-[#0C1BA8] transition-colors cursor-pointer"
                      title={pt.useCases[0].title}
                    />
                  ) : (
                    <div className="w-7 h-7 rounded-full bg-[#A5A7B0]/40 hover:bg-[#0C1BA8]/70 flex items-center justify-center text-[10px] font-bold text-white cursor-pointer transition-colors">
                      +{pt.useCases.length}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Right side list */}
          <div className="w-[280px] border-l border-[#A5A7B0]/20 flex flex-col">
            <div className="px-4 py-3 border-b border-[#A5A7B0]/10">
              <p className="text-sm font-semibold text-[#272727]">
                {language === "PT" ? "Casos de Uso" : "Use Cases"}
              </p>
              <p className="text-[11px] text-[#A5A7B0]">{filtered.length} {language === "PT" ? "itens" : "items"}</p>
            </div>
            <div className="flex-1 overflow-y-auto">
              {filtered.map((uc) => (
                <div
                  key={uc.id}
                  className="px-4 py-3 border-b border-[#A5A7B0]/10 hover:bg-[#f9f9f9] transition-colors"
                >
                  <div className="flex items-start gap-2">
                    <button onClick={(e) => onToggleSave(uc, e)} className="mt-0.5 shrink-0">
                      {savedIds.has(uc.id) ? (
                        <BookmarkCheck className="h-3.5 w-3.5 text-[#0C1BA8] fill-[#0C1BA8]" />
                      ) : (
                        <Bookmark className="h-3.5 w-3.5 text-[#A5A7B0] hover:text-[#0C1BA8]" />
                      )}
                    </button>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-medium text-[#272727] leading-snug">{uc.title}</p>
                      <p className="text-[10px] text-[#A5A7B0] mt-0.5">
                        {effortLabels[uc.effort]?.[language] || uc.effort} {language === "PT" ? "esforço" : "effort"} · {impactLabels[uc.impact]?.[language] || uc.impact} {language === "PT" ? "impacto" : "impact"}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
