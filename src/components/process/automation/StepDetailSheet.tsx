import { ProcessStepDetail, SolutionRecommendation } from "@/types/automationDetailTypes";
import {
  Sheet,
  SheetContent,
  SheetTitle,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import {
  getClassificationMeta,
  getEffortBadgeInfo,
  ensureStepSubsteps,
} from "./automationDetailAdapter";
import {
  FileText,
  Layers,
  Cpu,
  Clock,
  ListOrdered,
  Info,
} from "lucide-react";

interface StepDetailSheetProps {
  step: ProcessStepDetail | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  solution?: SolutionRecommendation;
  onSelectRelatedStep?: (stepId: string) => void;
  onOpenSolutionDetail?: (solutionId: string) => void;
}

export function StepDetailSheet({
  step,
  open,
  onOpenChange,
  solution,
}: StepDetailSheetProps) {
  if (!step) return null;

  const effortInfo = getEffortBadgeInfo(step.effort?.level);
  const substeps = ensureStepSubsteps(step);
  
  // Extract objective technology solution
  let techSolution = step.technologyType;
  if (!techSolution && step.classification === "MNA") {
    techSolution = "Humano";
  }

  // Derive classifications
  let classesToRender = step.classifications;
  if (!classesToRender && substeps && substeps.length > 0) {
    const uniqueClasses = new Set<string>();
    substeps.forEach(sub => {
      if (sub.classification) uniqueClasses.add(sub.classification);
    });
    if (uniqueClasses.size > 0) {
      classesToRender = Array.from(uniqueClasses);
    }
  }
  if (!classesToRender || classesToRender.length === 0) {
    classesToRender = [step.classification];
  }
  
  const consolidatedClassificationStr = classesToRender.join(" + ");

  // Justificativa breve
  const rationale = step.rationale || step.aiInterpretation?.classificationRationale || solution?.description || "A natureza da atividade e a lógica de decisão direcionaram a escolha desta solução.";

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-xl w-full overflow-y-auto p-0 flex flex-col bg-background">
        {/* Header bar */}
        <div className="p-6 border-b border-border bg-muted/20 sticky top-0 z-10 backdrop-blur-sm">
          <SheetTitle className="text-xl font-bold text-foreground leading-snug">
            <span className="text-primary font-mono mr-2">Step {step.number || step.id} —</span>
            {step.title}
          </SheetTitle>
        </div>

        {/* Scrollable Content Body */}
        <div className="p-6 space-y-6 flex-1 text-sm">
          
          {/* 3.1 Descrição breve */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              <FileText className="h-4 w-4 text-primary" />
              <span>Descrição breve</span>
            </div>
            <p className="text-foreground leading-relaxed text-sm">
              {step.description || step.title}
            </p>
          </div>

          <div className="h-px bg-border w-full" />

          {/* 3.2 Classificação consolidada */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              <Layers className="h-4 w-4 text-primary" />
              <span>Classificação consolidada</span>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              {classesToRender.map((cls, i) => {
                const meta = getClassificationMeta(cls as string);
                return (
                  <Badge key={i} variant="outline" className={meta.color}>
                    {meta.label} — {meta.full}
                  </Badge>
                );
              })}
              {classesToRender.length > 1 && (
                <span className="text-xs text-muted-foreground font-mono bg-muted px-2 py-0.5 rounded">
                  {consolidatedClassificationStr}
                </span>
              )}
            </div>
          </div>

          <div className="h-px bg-border w-full" />

          {/* 3.3 Solução tecnológica */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              <Cpu className="h-4 w-4 text-primary" />
              <span>Solução tecnológica</span>
            </div>
            <p className="text-foreground font-semibold text-base">
              {techSolution || "Não informada"}
            </p>
          </div>

          <div className="h-px bg-border w-full" />

          {/* 3.4 Justificativa */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              <Info className="h-4 w-4 text-primary" />
              <span>Por que essa solução foi selecionada?</span>
            </div>
            <p className="text-foreground leading-relaxed text-sm">
              {rationale}
            </p>
          </div>

          <div className="h-px bg-border w-full" />

          {/* 3.5 Esforço */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              <Clock className="h-4 w-4 text-primary" />
              <span>Esforço</span>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant="outline" className={effortInfo.color + " text-sm py-1"}>
                {effortInfo.label}
              </Badge>
              {step.effort?.drivers && step.effort.drivers.length > 0 && (
                <span className="text-muted-foreground text-sm">
                  — {step.effort.drivers.join(", ")}.
                </span>
              )}
            </div>
          </div>

          <div className="h-px bg-border w-full" />

          {/* 4. Lista de sub-steps */}
          <div className="space-y-4 pt-2">
            <div className="flex items-center gap-2 text-sm font-bold text-foreground">
              <ListOrdered className="h-5 w-5 text-primary" />
              <span>Sub-steps que compõem este Step</span>
            </div>

            {substeps.length > 0 ? (
              <div className="space-y-3">
                {substeps.map((sub, idx) => {
                  const subCls = sub.classification || step.classification;
                  const meta = getClassificationMeta(subCls as string);
                  return (
                    <div
                      key={sub.id || idx}
                      className="p-3 rounded-lg border border-border bg-slate-50 flex flex-col gap-2 text-sm"
                    >
                      <div className="flex items-start gap-3">
                        <span className="font-mono font-bold text-primary shrink-0">
                          {sub.sourceRef || sub.id} —
                        </span>
                        <div className="flex-1 text-foreground leading-relaxed">
                          {sub.description}
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-xs pl-10">
                        <span className="text-muted-foreground">Classificação:</span>
                        <span className={`font-semibold ${meta.color} bg-transparent border-none p-0`}>
                          {meta.label}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="p-4 rounded-lg border border-border bg-muted/20 text-muted-foreground text-sm">
                Este Step não possui sub-steps detalhados.
              </div>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
