import { ProcessStepDetail } from "@/types/automationDetailTypes";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { getClassificationMeta, getEffortBadgeInfo } from "./automationDetailAdapter";

interface MacroBlockStepsTableProps {
  steps: ProcessStepDetail[];
  onSelectStep: (stepId: string) => void;
  selectedStepId?: string;
}

export function MacroBlockStepsTable({
  steps,
  onSelectStep,
  selectedStepId,
}: MacroBlockStepsTableProps) {
  if (steps.length === 0) {
    return (
      <div className="p-8 text-center rounded-xl border border-dashed border-border bg-muted/20">
        <p className="text-sm text-muted-foreground">
          Nenhum step encontrado para esta macroetapa ou filtro aplicado.
        </p>
      </div>
    );
  }

  return (
    <div className="border border-border rounded-xl overflow-hidden bg-card shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-muted/40 border-b border-border text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
            <tr>
              <th className="px-4 py-3 w-32 shrink-0">Macroetapa</th>
              <th className="px-3 py-3 w-16 shrink-0 text-center">Step</th>
              <th className="px-4 py-3 min-w-[280px]">Título do Step</th>
              <th className="px-3 py-3 w-36 shrink-0 text-center">Classificação(ões)</th>
              <th className="px-4 py-3 min-w-[200px]">Solução Tecnológica</th>
              <th className="px-4 py-3 w-32 shrink-0 text-center">Esforço</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {steps.map((step) => {
              const effortInfo = getEffortBadgeInfo(step.effort?.level);
              const isSelected = selectedStepId === step.id;

              // Derive the classifications from the substeps if step.classifications is missing
              let classesToRender = step.classifications;
              if (!classesToRender && step.substeps && step.substeps.length > 0) {
                const uniqueClasses = new Set<string>();
                step.substeps.forEach(sub => {
                  if (sub.classification) uniqueClasses.add(sub.classification);
                });
                if (uniqueClasses.size > 0) {
                  classesToRender = Array.from(uniqueClasses);
                }
              }
              if (!classesToRender || classesToRender.length === 0) {
                classesToRender = [step.classification];
              }

              // Extract the objective technology solution name (e.g., IA / Agente)
              let techSolution = step.technologyType;
              if (!techSolution && step.classification === "MNA") {
                techSolution = "Humano";
              }

              return (
                <tr
                  key={step.id}
                  onClick={() => onSelectStep(step.id)}
                  className={`cursor-pointer transition-colors group ${
                    isSelected
                      ? "bg-primary/5 hover:bg-primary/10"
                      : "hover:bg-muted/40"
                  }`}
                >
                  {/* Macroetapa */}
                  <td className="px-4 py-3 font-medium text-foreground">
                    {step.macroBlockName || "Macroetapa"}
                  </td>

                  {/* Step ID */}
                  <td className="px-3 py-3 font-mono font-bold text-foreground text-xs text-center shrink-0">
                    {step.number || step.id}
                  </td>

                  {/* Título do Step */}
                  <td className="px-4 py-3 text-foreground font-medium break-words leading-relaxed">
                    {step.title}
                  </td>

                  {/* Classificação(ões) */}
                  <td className="px-3 py-3 text-center shrink-0">
                    <TooltipProvider delayDuration={150}>
                      <div className="flex items-center justify-center gap-1 flex-wrap">
                        {classesToRender.map((cls: any, i: number) => {
                          const meta = getClassificationMeta(cls);
                          return (
                            <Tooltip key={i}>
                              <TooltipTrigger asChild>
                                <span
                                  className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold border cursor-help ${meta.color}`}
                                >
                                  {meta.label}
                                </span>
                              </TooltipTrigger>
                              <TooltipContent side="top" className="max-w-xs text-xs space-y-1">
                                <p className="font-bold">
                                  {meta.label} — {meta.full}
                                </p>
                                <p className="opacity-90">{meta.desc}</p>
                              </TooltipContent>
                            </Tooltip>
                          );
                        })}
                      </div>
                    </TooltipProvider>
                  </td>

                  {/* Solução Tecnológica */}
                  <td className="px-4 py-3">
                    <div className="font-medium text-foreground break-words leading-snug">
                      {techSolution || "Não informada"}
                    </div>
                  </td>

                  {/* Esforço */}
                  <td className="px-4 py-3 text-center shrink-0 whitespace-nowrap">
                    {step.effort ? (
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-[11px] font-medium border border-border/60 bg-muted/30">
                        <span>{effortInfo.label}</span>
                      </div>
                    ) : (
                      <span className="text-muted-foreground text-[11px] italic">
                        Não informado
                      </span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <div className="px-4 py-2.5 bg-muted/20 border-t border-border flex items-center justify-between text-[11px] text-muted-foreground">
        <span>Exibindo {steps.length} {steps.length === 1 ? "step" : "steps"}</span>
        <span>Clique em qualquer linha para abrir o dossiê detalhado do step</span>
      </div>
    </div>
  );
}
