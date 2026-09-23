import React, { useState } from "react";
import {
  MacroBlock,
  ProcessStepDetail,
  SolutionRecommendation,
  ProcessDigitalLayers,
  HumanControlItem,
} from "@/types/automationDetailTypes";
import { cn } from "@/lib/utils";
import { ArrowRight } from "lucide-react";

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
  // Ensure we have exactly 5 canonical blocks for the layout
  const canonicalIds = ["intake", "routing", "execution", "exception", "codification"];
  const orderedBlocks = canonicalIds
    .map(id => macroBlocks.find(mb => mb.id === id))
    .filter(Boolean) as MacroBlock[];

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

        {/* 2. Process Layer (5 Macroblocks) */}
        <div className="flex items-stretch justify-between gap-1 relative">
          {orderedBlocks.map((block, index) => {
            const isSelected = selectedBlockId === block.id;
            return (
              <React.Fragment key={block.id}>
                <div className="relative flex-1 flex flex-col min-w-0">
                  <button
                    onClick={() => onSelectBlock(isSelected ? null : block.id)}
                    className={cn(
                      "flex-1 flex flex-col justify-start items-center p-2 sm:p-3 text-center rounded-xl border transition-all z-10 w-full overflow-hidden",
                      isSelected
                        ? "bg-white border-primary shadow-sm ring-2 ring-primary/20"
                        : "bg-white border-transparent hover:border-slate-300 shadow-2xs"
                    )}
                  >
                    <h4 className="font-bold text-xs sm:text-sm text-[#15233B] mb-1 truncate w-full">{block.name}</h4>
                    <p className="text-[9px] sm:text-[10px] text-slate-500 mb-3 min-h-[30px] line-clamp-2 leading-tight w-full break-words">
                      {block.description}
                    </p>
                    
                    {/* Contextual cards (not steps) */}
                    <div className="w-full flex flex-col gap-1 min-w-0">
                      {(block.contextCards || []).map((card, cardIdx) => (
                        <div key={cardIdx} className="bg-slate-50 text-slate-600 text-[8px] sm:text-[9px] px-1.5 sm:px-2 py-1 rounded truncate w-full text-left font-medium border border-slate-100">
                          {card}
                        </div>
                      ))}
                    </div>
                  </button>
                </div>
                {/* Arrow to next */}
                {index < orderedBlocks.length - 1 && (
                  <div className="flex items-center justify-center shrink-0 w-5">
                    <ArrowRight className="h-5 w-5 text-slate-300 stroke-[1.5]" />
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>

        {/* 3. Digital Agent Layer */}
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
                <span className="font-bold text-xs text-indigo-800">{digitalLayers?.integrationLayer?.name || "Integração de Sistemas / MCP"}</span>
                <span className="hidden xl:inline-block ml-2 bg-indigo-50 text-indigo-700 text-[9px] sm:text-[10px] font-medium px-2 py-0.5 rounded-full border border-indigo-100 truncate">
                  Integração Transversal
                </span>
              </div>
            </div>

            {/* Specialist Solutions, Evaluator, Codification */}
            <div className="flex items-stretch gap-2 sm:gap-4 mt-1 w-full min-w-0">
              {/* Specialist Solutions */}
              <div className="flex-[2] border border-slate-300 bg-white rounded-xl p-2 sm:p-3 relative flex flex-col min-w-0">
                <h5 className="font-bold text-xs text-slate-800 mb-2 text-center">Specialist Solutions</h5>
                
                <div className="flex flex-col gap-1.5 w-full min-w-0">
                  {solutions.filter(s => s.macroBlockId !== "exception" && s.macroBlockId !== "codification").slice(0, 7).map((sol, idx) => (
                    <button
                      key={idx}
                      onClick={() => onOpenSolutionDetail?.(sol.id)}
                      className="bg-slate-50 text-slate-800 text-[9px] sm:text-[10px] font-medium px-2 py-1.5 rounded-md border border-slate-200 text-left hover:bg-slate-100 transition-colors w-full flex items-center gap-1.5 min-w-0"
                    >
                      <span className="shrink-0 bg-blue-50 text-blue-700 text-[7px] sm:text-[8px] font-bold px-1.5 py-0.5 rounded border border-blue-100 uppercase tracking-wide">
                        {sol.technologyType || "—"}
                      </span>
                      <span className="truncate">{sol.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Evaluator */}
              <div className="flex-1 flex flex-col min-w-0">
                <div className="border border-slate-300 bg-white rounded-xl p-2 sm:p-3 h-full flex flex-col items-center justify-start text-center min-w-0">
                  <h5 className="font-bold text-[10px] sm:text-xs text-slate-800 mb-2 truncate w-full">{digitalLayers?.anomalyDetection?.name || "Evaluator Agent"}</h5>
                  <div className="flex flex-col gap-1.5 w-full min-w-0">
                    {solutions.filter(s => s.macroBlockId === "exception").slice(0, 2).map((sol, idx) => (
                      <div key={idx} className="bg-rose-50 text-rose-800 text-[8px] sm:text-[9px] font-medium px-2 py-1 rounded-md border border-rose-100 w-full text-center truncate">
                        {sol.name}
                      </div>
                    ))}
                    {solutions.filter(s => s.macroBlockId === "exception").length === 0 && (
                      <div className="bg-rose-50 text-rose-800 text-[8px] sm:text-[9px] font-medium px-2 py-1 rounded-md border border-rose-100 w-full text-center truncate">
                        Detector de Anomalia
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Codification / RPA */}
              <div className="flex-1 flex flex-col min-w-0">
                <div className="border border-slate-300 bg-white rounded-xl p-2 sm:p-3 h-full flex flex-col items-center justify-start text-center min-w-0">
                  <h5 className="font-bold text-[10px] sm:text-xs text-slate-800 mb-2 truncate w-full">Codification / RPA</h5>
                  <div className="flex flex-col gap-1.5 w-full min-w-0">
                    {solutions.filter(s => s.macroBlockId === "codification").slice(0, 2).map((sol, idx) => (
                      <div key={idx} className="bg-teal-50 text-teal-800 text-[8px] sm:text-[9px] font-medium px-2 py-1 rounded-md border border-teal-100 w-full text-center truncate">
                        {sol.name}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
