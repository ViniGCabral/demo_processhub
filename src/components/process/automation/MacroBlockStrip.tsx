import { useState } from "react";
import {
  MacroBlock,
  ProcessStepDetail,
  SolutionRecommendation,
} from "@/types/automationDetailTypes";
import {
  getCategoryMeta,
  getMacroBlockDigitalSolutions,
} from "./automationDetailAdapter";
import { cn } from "@/lib/utils";
import {
  FileDown,
  GitFork,
  PlayCircle,
  ShieldAlert,
  FileCheck2,
  Layers,
  ArrowRight,
  Sparkles,
  ChevronRight,
} from "lucide-react";

interface MacroBlockStripProps {
  macroBlocks: MacroBlock[];
  selectedBlockId: string | null;
  onSelectBlock: (id: string | null) => void;
  totalStepsCount?: number;
  steps?: ProcessStepDetail[];
  solutions?: SolutionRecommendation[];
  onOpenSolutionDetail?: (solutionId: string) => void;
  onSelectStep?: (stepId: string) => void;
}

const macroBlockIcons: Record<string, typeof FileDown> = {
  "1": FileDown,
  "2": GitFork,
  "3": PlayCircle,
  "4": ShieldAlert,
  "5": FileCheck2,
};

export function MacroBlockStrip({
  macroBlocks,
  selectedBlockId,
  onSelectBlock,
  totalStepsCount,
  steps = [],
  solutions = [],
  onOpenSolutionDetail,
  onSelectStep,
}: MacroBlockStripProps) {
  return (
    <div className="space-y-6">
      {/* 1. Human-in-the-loop Layer Banner */}
      <div className="rounded-xl border border-slate-200/90 bg-gradient-to-r from-slate-50 via-teal-50/40 to-slate-50 p-3 shadow-2xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-2.5">
          <div className="flex items-center gap-2.5">
            <span className="inline-flex items-center justify-center px-2 py-0.5 rounded-md bg-teal-100 text-teal-800 font-bold text-[11px] uppercase tracking-wider border border-teal-200">
              HITL
            </span>
            <div>
              <div className="flex items-center gap-1.5">
                <h4 className="text-xs font-bold text-foreground">
                  Human-in-the-loop layer
                </h4>
                <span className="text-[11px] text-muted-foreground font-medium">
                  ↕ controles, aprovações e decisões humanas ↕
                </span>
              </div>
              <p className="text-[10px] text-muted-foreground">
                Pontos de intervenção indispensáveis onde o julgamento e governança humana permanecem necessários
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[11px] px-2.5 py-1 rounded-full bg-white border border-slate-200 text-slate-700 font-medium flex items-center gap-1.5 shadow-2xs">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" />
              Aprovação de exceções
            </span>
            <span className="text-[11px] px-2.5 py-1 rounded-full bg-white border border-slate-200 text-slate-700 font-medium flex items-center gap-1.5 shadow-2xs">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
              Validação de resultado
            </span>
            <span className="text-[11px] px-2.5 py-1 rounded-full bg-white border border-slate-200 text-slate-700 font-medium flex items-center gap-1.5 shadow-2xs">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0" />
              Decisão sobre casos ambíguos
            </span>
            <span className="text-[11px] px-2.5 py-1 rounded-full bg-white border border-slate-200 text-slate-700 font-medium flex items-center gap-1.5 shadow-2xs">
              <span className="w-1.5 h-1.5 rounded-full bg-purple-500 shrink-0" />
              Revisão antes de ação sensível
            </span>
          </div>
        </div>
      </div>

      {/* 2. Macroetapas do Processo (5 blocos em fluxo) */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Layers className="h-4 w-4 text-primary" />
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Macroetapas do Processo
            </span>
          </div>
          {selectedBlockId && (
            <button
              onClick={() => onSelectBlock(null)}
              className="text-xs text-primary hover:underline font-medium flex items-center gap-1"
            >
              Ver todas as macroetapas ({totalStepsCount || 0} steps)
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
          {macroBlocks.map((block, index) => {
            const isSelected = selectedBlockId === block.id;
            const orderNum = String(block.order || index + 1).padStart(2, "0");
            const IconComponent = macroBlockIcons[String(block.order || index + 1)] || Layers;
            const mbSteps = steps.filter((s) => s.macroBlockId === block.id);
            const digitalGroups = getMacroBlockDigitalSolutions(block, steps, solutions);

            return (
              <button
                key={block.id}
                onClick={() => onSelectBlock(isSelected ? null : block.id)}
                className={cn(
                  "relative text-left p-4 rounded-xl border transition-all duration-200 flex flex-col justify-between group",
                  isSelected
                    ? "bg-white border-primary shadow-sm ring-2 ring-primary/20"
                    : "bg-card border-border hover:border-border/80 hover:bg-muted/20"
                )}
              >
                {/* Header: Número de ordem e contagem de steps */}
                <div className="flex items-center justify-between w-full mb-2.5">
                  <span
                    className={cn(
                      "text-xs font-mono font-bold px-1.5 py-0.5 rounded",
                      isSelected
                        ? "bg-primary/10 text-primary"
                        : "bg-muted text-muted-foreground"
                    )}
                  >
                    {orderNum}
                  </span>
                  <span
                    className={cn(
                      "text-[10px] font-medium px-2 py-0.5 rounded-full border",
                      isSelected
                        ? "bg-primary/10 text-primary border-primary/20"
                        : "bg-muted/60 text-muted-foreground border-border"
                    )}
                  >
                    {block.stepCount} steps
                  </span>
                </div>

                {/* Ícone e Nome */}
                <div className="mb-2">
                  <div
                    className={cn(
                      "w-7 h-7 rounded-lg flex items-center justify-center mb-2 transition-colors",
                      isSelected
                        ? "bg-primary/10 text-primary"
                        : "bg-muted text-muted-foreground group-hover:text-foreground"
                    )}
                  >
                    <IconComponent className="h-3.5 w-3.5" />
                  </div>
                  <h4
                    className={cn(
                      "text-xs font-bold leading-snug break-words min-h-[2rem] flex items-center",
                      isSelected ? "text-primary font-bold" : "text-foreground"
                    )}
                  >
                    {block.name}
                  </h4>
                </div>

                {/* Descrição resumida */}
                {block.description && (
                  <p className="text-[11px] text-muted-foreground leading-relaxed mb-2.5 line-clamp-2">
                    {block.description}
                  </p>
                )}

                {/* Entra e Sai */}
                <div className="space-y-1 pt-2 border-t border-border/60 text-[10px] w-full">
                  {block.inputs && (
                    <div className="leading-tight text-muted-foreground line-clamp-1">
                      <strong className="text-foreground/90 font-semibold">Entra:</strong>{" "}
                      {block.inputs}
                    </div>
                  )}
                  {block.outputs && (
                    <div className="leading-tight text-muted-foreground line-clamp-1">
                      <strong className="text-foreground/90 font-semibold">Sai:</strong>{" "}
                      {block.outputs}
                    </div>
                  )}
                </div>

                {/* Badge inferior de resumo */}
                <div className="mt-3 pt-2 border-t border-border/50 flex items-center justify-between w-full text-[10px]">
                  <span className="font-semibold text-primary">
                    {block.stepCount} steps · {digitalGroups.length} tipos
                  </span>
                  <ChevronRight
                    className={cn(
                      "h-3.5 w-3.5 transition-transform",
                      isSelected ? "text-primary rotate-90" : "text-muted-foreground/50 group-hover:translate-x-0.5"
                    )}
                  />
                </div>

                {/* Indicador ativo */}
                {isSelected && (
                  <div className="absolute bottom-0 left-3 right-3 h-[3px] bg-primary rounded-t-full" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Digital Solutions Layer Banner */}
      <div className="flex flex-col items-center justify-center pt-2">
        <div className="w-full bg-slate-100/80 border border-slate-200/80 rounded-xl py-2 px-4 text-center">
          <span className="text-xs font-bold text-foreground">
            Digital solutions layer
          </span>{" "}
          <span className="text-xs text-muted-foreground">
            · soluções agrupadas por tipo tecnológico dentro de cada macroetapa
          </span>
        </div>
      </div>

      {/* 4. Camada de Soluções Digitais em 5 Colunas */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-3 items-start">
        {macroBlocks.map((block) => {
          const isSelected = selectedBlockId === block.id;
          const digitalGroups = getMacroBlockDigitalSolutions(block, steps, solutions);

          return (
            <div
              key={`digital-col-${block.id}`}
              className={cn(
                "rounded-xl border p-3.5 space-y-3 transition-all min-h-[320px] flex flex-col justify-between",
                isSelected
                  ? "bg-white border-primary/50 shadow-sm ring-1 ring-primary/20"
                  : "bg-slate-50/40 border-border/70 hover:border-border"
              )}
            >
              <div className="space-y-3">
                {/* Cabeçalho da Coluna */}
                <div className="pb-2 border-b border-border/60 text-center">
                  <h5 className="text-xs font-bold text-foreground truncate">
                    {block.name}
                  </h5>
                  <p className="text-[10px] text-muted-foreground mt-0.5">
                    {block.stepCount} Steps · {digitalGroups.length} {digitalGroups.length === 1 ? "tipo" : "tipos"}
                  </p>
                </div>

                {/* Caixas Agrupadas por Categoria Tecnológica */}
                {digitalGroups.length === 0 ? (
                  <div className="p-4 text-center text-[11px] text-muted-foreground italic rounded-lg border border-dashed border-border/60 bg-white">
                    Nenhuma solução mapeada para esta etapa.
                  </div>
                ) : (
                  <div className="space-y-2.5">
                    {digitalGroups.map((group) => {
                      const meta = getCategoryMeta(group.category);
                      const IconComp = meta.icon;

                      return (
                        <div
                          key={`${block.id}-${group.category}`}
                          className="rounded-lg border border-border/80 bg-white p-2.5 shadow-2xs space-y-2 hover:border-border transition-colors"
                        >
                          {/* Cabeçalho da Caixa de Categoria */}
                          <div className="flex items-center justify-between gap-1 border-b border-border/40 pb-1.5">
                            <div className="flex items-center gap-1.5 min-w-0">
                              <span
                                className={cn(
                                  "w-5 h-5 rounded flex items-center justify-center shrink-0",
                                  meta.badgeColor
                                )}
                              >
                                <IconComp className="h-3 w-3" />
                              </span>
                              <span className="text-xs font-bold text-foreground truncate">
                                {meta.label}
                              </span>
                            </div>
                            <span className="text-[10px] text-muted-foreground shrink-0 font-medium">
                              {group.items.length}{" "}
                              {group.items.length === 1 ? "solução" : "soluções"}
                            </span>
                          </div>

                          {/* Lista de Soluções dentro da Categoria */}
                          <div className="space-y-1.5 pt-0.5">
                            {group.items.map((item) => (
                              <div
                                key={item.id}
                                className="p-1.5 rounded-md bg-slate-50/70 border border-slate-200/50 hover:border-primary/40 hover:bg-white transition-all space-y-0.5 group/item"
                              >
                                <button
                                  type="button"
                                  onClick={() =>
                                    item.solutionId && onOpenSolutionDetail?.(item.solutionId)
                                  }
                                  className="text-left w-full font-semibold text-[11px] text-foreground group-hover/item:text-primary transition-colors leading-snug line-clamp-2"
                                >
                                  {item.title}
                                </button>
                                <div className="flex items-center gap-1 text-[10px] text-muted-foreground flex-wrap">
                                  {item.stepIds.map((stepId) => (
                                    <button
                                      key={stepId}
                                      type="button"
                                      onClick={() => onSelectStep?.(stepId)}
                                      className="font-mono text-primary font-bold hover:underline"
                                    >
                                      Step {stepId}
                                    </button>
                                  ))}
                                  <span>·</span>
                                  <span className="truncate max-w-[130px]" title={item.techBadge}>
                                    {item.techBadge}
                                  </span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Rodapé da Coluna: Apoio na etapa */}
              {block.supportingAgents && block.supportingAgents.length > 0 && (
                <div className="mt-3 pt-2 border-t border-border/50 text-[10px] text-muted-foreground/80 leading-relaxed bg-muted/20 rounded p-2 border border-border/40">
                  <span className="font-semibold text-foreground">Apoio na etapa:</span>{" "}
                  {block.supportingAgents.join(" · ")}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
