import React, { useMemo } from "react";
import {
  MacroBlock,
  ProcessStepDetail,
  SolutionRecommendation,
  ProcessDigitalLayers,
  HumanControlItem,
} from "@/types/automationDetailTypes";
import { cn } from "@/lib/utils";
import { ArrowRight } from "lucide-react";

/** Color palette for each technology type box */
const TECH_TYPE_STYLES: Record<string, { bg: string; border: string; text: string; badge: string; badgeBorder: string; badgeText: string }> = {
  rpa:                  { bg: "bg-blue-50",    border: "border-blue-200",   text: "text-blue-900",   badge: "bg-blue-100",   badgeBorder: "border-blue-200",   badgeText: "text-blue-800" },
  workflow:             { bg: "bg-emerald-50", border: "border-emerald-200",text: "text-emerald-900",badge: "bg-emerald-100",badgeBorder: "border-emerald-200",badgeText: "text-emerald-800" },
  agentes:              { bg: "bg-violet-50",  border: "border-violet-200", text: "text-violet-900", badge: "bg-violet-100", badgeBorder: "border-violet-200", badgeText: "text-violet-800" },
  "ia / agente":        { bg: "bg-violet-50",  border: "border-violet-200", text: "text-violet-900", badge: "bg-violet-100", badgeBorder: "border-violet-200", badgeText: "text-violet-800" },
  "motor de regras":    { bg: "bg-amber-50",   border: "border-amber-200",  text: "text-amber-900",  badge: "bg-amber-100",  badgeBorder: "border-amber-200",  badgeText: "text-amber-800" },
  "motores de regras":  { bg: "bg-amber-50",   border: "border-amber-200",  text: "text-amber-900",  badge: "bg-amber-100",  badgeBorder: "border-amber-200",  badgeText: "text-amber-800" },
  analytics:            { bg: "bg-cyan-50",    border: "border-cyan-200",   text: "text-cyan-900",   badge: "bg-cyan-100",   badgeBorder: "border-cyan-200",   badgeText: "text-cyan-800" },
  integrações:          { bg: "bg-indigo-50",  border: "border-indigo-200", text: "text-indigo-900", badge: "bg-indigo-100", badgeBorder: "border-indigo-200", badgeText: "text-indigo-800" },
  "automação de planilha": { bg: "bg-lime-50", border: "border-lime-200",  text: "text-lime-900",  badge: "bg-lime-100",  badgeBorder: "border-lime-200",  badgeText: "text-lime-800" },
};

function getTechStyle(techType: string) {
  const key = techType.toLowerCase().trim();
  return TECH_TYPE_STYLES[key] || {
    bg: "bg-slate-50",
    border: "border-slate-200",
    text: "text-slate-800",
    badge: "bg-slate-100",
    badgeBorder: "border-slate-200",
    badgeText: "text-slate-700",
  };
}

interface AgenticFrameworkStripProps {
  macroBlocks: MacroBlock[];
  selectedBlockId: string | null;
  onSelectBlock: (id: string | null) => void;
  totalStepsCount?: number;
  steps?: ProcessStepDetail[];
  solutions?: SolutionRecommendation[];
  digitalLayers?: ProcessDigitalLayers;
  humanControls?: HumanControlItem[];
  onOpenSolutionDetail?: (solutionId: string) => void;
  onSelectStep?: (stepId: string) => void;
}

export function AgenticFrameworkStrip({
  macroBlocks,
  selectedBlockId,
  onSelectBlock,
  totalStepsCount,
  steps = [],
  solutions = [],
  digitalLayers,
  humanControls = [],
  onOpenSolutionDetail,
  onSelectStep,
}: AgenticFrameworkStripProps) {
  /**
   * Group steps by technologyType to generate one box per solution type.
   * Ignores steps with no technologyType or those classified as purely human ("Humano", "MNA").
   */
  const stepsByTechType = useMemo(() => {
    const map = new Map<string, ProcessStepDetail[]>();
    for (const step of steps) {
      const tech = step.technologyType;
      if (!tech || tech.toLowerCase() === "humano") continue;
      const existing = map.get(tech) || [];
      existing.push(step);
      map.set(tech, existing);
    }
    // Sort by number of steps descending so the largest group appears first
    return Array.from(map.entries()).sort((a, b) => b[1].length - a[1].length);
  }, [steps]);

  return (
    <div className="relative w-full border-2 border-dashed border-[#8A96A9]/40 rounded-2xl p-4 sm:p-6 bg-slate-50/30 overflow-hidden">
      <div className="absolute top-2 left-3 text-[10px] font-bold text-[#8A96A9] uppercase tracking-wider bg-transparent">
        The agentic flow
      </div>
      <div className="absolute top-2 right-3 text-[10px] italic text-[#8A96A9] bg-transparent">
        Looping engineer: the next case starts smarter and cheaper
      </div>

      <div className="w-full flex flex-col gap-4 sm:gap-6 mt-6">
        {/* 1. Human-in-the-loop Layer */}
        <div className="relative flex items-center justify-center bg-slate-100 rounded-lg p-3 border border-slate-200">
          <div className="absolute left-4 right-4 flex justify-between items-center z-0 pointer-events-none opacity-20">
            <div className="w-full h-px bg-slate-400" />
            <ArrowRight className="h-4 w-4 text-slate-400 ml-1 shrink-0" />
          </div>
          <div className="z-10 bg-slate-100 px-4 text-sm font-semibold text-slate-700 flex flex-col items-center">
            Human-in-the-loop layer
            <div className="flex items-center gap-2 mt-2 flex-wrap justify-center">
              {humanControls.map((hc, idx) => (
                <span key={idx} className="text-[9px] sm:text-[10px] px-2 py-1 bg-white border border-slate-200 rounded-full shadow-2xs font-medium text-slate-600 truncate max-w-full">
                  {hc.label}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* 2. Digital Agent Layer */}
        <div className="bg-slate-100 rounded-xl p-4 border border-slate-200 mt-2 relative">
          <div className="absolute -top-3 bg-slate-100 px-2 left-1/2 -translate-x-1/2 text-xs font-bold text-slate-600">
            Digital agents layer
          </div>

          <div className="flex flex-col gap-3 pt-3">
            {/* Transversal Bars (Orchestrator and MCP) */}
            <div className="flex flex-col gap-2 w-full">
              <div className="w-full bg-white border border-blue-200 rounded-lg p-2.5 flex items-center justify-center shadow-xs">
                <span className="font-bold text-xs text-blue-800">{digitalLayers?.orchestrator?.name || "Orchestrator Agent"}</span>
                <span className="hidden xl:inline-block ml-2 bg-blue-50 text-blue-700 text-[9px] sm:text-[10px] font-medium px-2 py-0.5 rounded-full border border-blue-100 truncate">
                  Orquestrador Transversal
                </span>
              </div>
              <div className="w-full bg-white border border-indigo-200 rounded-lg p-2.5 flex items-center justify-center shadow-xs">
                <span className="font-bold text-xs text-indigo-800">{digitalLayers?.integrationLayer?.name || "MCP / Integration Layer"}</span>
                <span className="hidden xl:inline-block ml-2 bg-indigo-50 text-indigo-700 text-[9px] sm:text-[10px] font-medium px-2 py-0.5 rounded-full border border-indigo-100 truncate">
                  Integração Transversal
                </span>
              </div>
            </div>

            {/* Dynamic boxes — one per technology type */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3 mt-1 w-full">
              {stepsByTechType.map(([techType, techSteps]) => {
                const style = getTechStyle(techType);
                return (
                  <div
                    key={techType}
                    className={cn(
                      "border rounded-xl p-2.5 sm:p-3 flex flex-col min-w-0",
                      style.border,
                      "bg-white"
                    )}
                  >
                    <h5 className={cn("font-bold text-xs mb-2 text-center", style.text)}>
                      {techType}
                    </h5>
                    <div className="flex flex-col gap-1.5 w-full min-w-0">
                      {techSteps.map((step) => (
                        <button
                          key={step.id}
                          onClick={() => onSelectStep?.(step.id)}
                          className={cn(
                            "text-[9px] sm:text-[10px] font-medium px-2 py-1.5 rounded-md border text-left hover:opacity-80 transition-colors w-full flex items-start gap-1.5 min-w-0",
                            style.bg,
                            style.border,
                            style.text
                          )}
                        >
                          <span className="truncate">{step.title}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                );
              })}

              {stepsByTechType.length === 0 && (
                <div className="col-span-full text-center text-xs text-muted-foreground py-4">
                  Nenhuma solução tecnológica identificada nos steps.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
