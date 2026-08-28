import { useEffect, useMemo, useState } from "react";
import { Search, X, ListTree, History, ChevronRight, ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/contexts/LanguageContext";
import { plainTextLabel } from "@/lib/sopSearchHighlight";
import type { SOPStep } from "@/stores/sopStore";

export interface OutlineMatch {
  stepId: string;
  count: number;
}

interface SOPOutlinePanelProps {
  steps: SOPStep[];
  activeStepId?: string;
  onSelectStep: (stepId: string) => void;
  onSelectSubstep?: (stepId: string, substepId: string) => void;
  search: string;
  onSearchChange: (value: string) => void;
  matches: Record<string, number>;
  totalHits?: number;
  currentHit?: number;
  onNextHit?: () => void;
  onPrevHit?: () => void;
  versionsSlot: React.ReactNode;
}

export function SOPOutlinePanel({
  steps,
  activeStepId,
  onSelectStep,
  onSelectSubstep,
  search,
  onSearchChange,
  matches,
  totalHits = 0,
  currentHit = 0,
  onNextHit,
  onPrevHit,
  versionsSlot,
}: SOPOutlinePanelProps) {
  const { language } = useLanguage();
  const [tab, setTab] = useState<"outline" | "versions">("outline");
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  const isSearching = search.trim().length > 0;

  // Auto-expand steps with matches while searching
  useEffect(() => {
    if (!isSearching) return;
    setExpanded((prev) => {
      const next = { ...prev };
      steps.forEach((s) => {
        if ((matches[s.id] || 0) > 0) next[s.id] = true;
      });
      return next;
    });
  }, [search, isSearching, matches, steps]);

  // Keep the active step visible in the tree
  useEffect(() => {
    if (activeStepId && activeStepId !== "__header__") {
      setExpanded((prev) => (prev[activeStepId] ? prev : { ...prev, [activeStepId]: true }));
    }
  }, [activeStepId]);

  const visibleSteps = useMemo(
    () => (isSearching ? steps.filter((s) => (matches[s.id] || 0) > 0) : steps),
    [isSearching, steps, matches]
  );

  const toggle = (stepId: string) =>
    setExpanded((prev) => ({ ...prev, [stepId]: !prev[stepId] }));

  return (
    <div className="w-[248px] shrink-0 bg-versions border-r border-border h-full flex flex-col">
      {/* Tabs */}
      <div className="p-3 pb-0">
        <div className="inline-flex w-full p-0.5 bg-muted rounded-lg">
          <button
            onClick={() => setTab("outline")}
            className={cn(
              "flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-md text-[12px] font-medium transition-colors",
              tab === "outline"
                ? "bg-card text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <ListTree className="h-3.5 w-3.5" />
            {language === "PT" ? "Seções" : "Sections"}
          </button>
          <button
            onClick={() => setTab("versions")}
            className={cn(
              "flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-md text-[12px] font-medium transition-colors",
              tab === "versions"
                ? "bg-card text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <History className="h-3.5 w-3.5" />
            {language === "PT" ? "Versões" : "Versions"}
          </button>
        </div>
      </div>

      {tab === "outline" ? (
        <div className="flex-1 flex flex-col min-h-0">
          {/* Search */}
          <div className="p-3">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
              <input
                value={search}
                onChange={(e) => onSearchChange(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    if (e.shiftKey) onPrevHit?.();
                    else onNextHit?.();
                  }
                  if (e.key === "Escape") onSearchChange("");
                }}
                placeholder={language === "PT" ? "Buscar no documento" : "Search document"}
                className="w-full h-8 pl-8 pr-7 bg-card border border-border rounded-md text-[12.5px] text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/40"
              />
              {isSearching && (
                <button
                  onClick={() => onSearchChange("")}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>

            {/* Hit navigation (Google Docs style) */}
            {isSearching && (
              <div className="mt-2 flex items-center justify-between gap-2 bg-card border border-border rounded-md px-2 py-1">
                <span className="text-[11px] text-muted-foreground tabular-nums">
                  {totalHits === 0
                    ? language === "PT"
                      ? "Nenhuma ocorrência"
                      : "No matches"
                    : `${currentHit + 1} / ${totalHits}`}
                </span>
                <div className="flex items-center gap-0.5">
                  <button
                    onClick={onPrevHit}
                    disabled={totalHits === 0}
                    title={language === "PT" ? "Anterior (Shift+Enter)" : "Previous (Shift+Enter)"}
                    className="p-1 rounded hover:bg-muted disabled:opacity-40 text-muted-foreground hover:text-foreground"
                  >
                    <ChevronUp className="h-3.5 w-3.5" />
                  </button>
                  <button
                    onClick={onNextHit}
                    disabled={totalHits === 0}
                    title={language === "PT" ? "Próxima (Enter)" : "Next (Enter)"}
                    className="p-1 rounded hover:bg-muted disabled:opacity-40 text-muted-foreground hover:text-foreground"
                  >
                    <ChevronDown className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Outline list */}
          <nav className="flex-1 overflow-y-auto px-2 pb-4">
            <button
              onClick={() => onSelectStep("__header__")}
              className={cn(
                "w-full text-left px-2.5 py-2 rounded-md text-[12.5px] transition-colors mb-1",
                activeStepId === "__header__"
                  ? "bg-sidebar-accent text-primary font-medium"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
              )}
            >
              {language === "PT" ? "Informações gerais" : "General information"}
            </button>

            <p className="px-2.5 pt-2 pb-1.5 text-[10.5px] font-semibold uppercase tracking-[0.5px] text-muted-foreground">
              {language === "PT" ? "Procedimento" : "Procedure"}
            </p>

            <div className="space-y-0.5">
              {visibleSteps.map((step) => {
                const originalIndex = steps.findIndex((s) => s.id === step.id);
                const count = matches[step.id] || 0;
                const substeps = step.substeps || [];
                const isOpen = !!expanded[step.id];
                const isActive = activeStepId === step.id;

                return (
                  <div key={step.id}>
                    <div
                      className={cn(
                        "group flex items-start gap-1 rounded-md transition-colors",
                        isActive
                          ? "bg-sidebar-accent text-primary"
                          : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
                      )}
                    >
                      <button
                        onClick={() => toggle(step.id)}
                        disabled={substeps.length === 0}
                        className={cn(
                          "mt-[7px] ml-1 p-0.5 rounded shrink-0 transition-transform",
                          substeps.length === 0 && "opacity-0 pointer-events-none",
                          isOpen && "rotate-90"
                        )}
                        aria-label={isOpen ? "Collapse" : "Expand"}
                      >
                        <ChevronRight className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() => onSelectStep(step.id)}
                        className="flex-1 flex items-start gap-2 pr-2 py-2 text-left"
                      >
                        <span
                          className={cn(
                            "mt-[1px] w-[18px] h-[18px] shrink-0 rounded flex items-center justify-center text-[10.5px] font-semibold",
                            isActive
                              ? "bg-primary text-primary-foreground"
                              : "bg-muted text-muted-foreground group-hover:bg-border"
                          )}
                        >
                          {originalIndex + 1}
                        </span>
                        <span className="flex-1 text-[12.5px] leading-[1.35] line-clamp-2">
                          {step.title}
                        </span>
                        {isSearching && count > 0 && (
                          <span className="shrink-0 text-[10.5px] font-medium text-primary bg-primary/10 rounded px-1.5 py-0.5">
                            {count}
                          </span>
                        )}
                      </button>
                    </div>

                    {/* Sub-steps */}
                    {isOpen && substeps.length > 0 && (
                      <div className="ml-[26px] mt-0.5 mb-1 pl-2 border-l border-border space-y-0.5">
                        {substeps.map((sub, subIndex) => (
                          <button
                            key={sub.id}
                            onClick={() => onSelectSubstep?.(step.id, sub.id)}
                            className="w-full flex items-start gap-1.5 px-2 py-1.5 rounded-md text-left text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors"
                          >
                            <span className="text-[10.5px] font-medium tabular-nums shrink-0 mt-[1px] opacity-70">
                              {originalIndex + 1}.{subIndex + 1}
                            </span>
                            <span className="flex-1 text-[11.5px] leading-[1.35] line-clamp-2">
                              {plainTextLabel(sub.description) ||
                                (language === "PT" ? "Sub-etapa" : "Sub-step")}
                            </span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
              {isSearching && visibleSteps.length === 0 && (
                <p className="px-2.5 py-3 text-[12px] text-muted-foreground">
                  {language === "PT" ? "Nenhum resultado." : "No results."}
                </p>
              )}
            </div>
          </nav>
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto p-3">{versionsSlot}</div>
      )}
    </div>
  );
}
