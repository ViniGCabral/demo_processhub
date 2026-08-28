import { useState } from "react";
import { BarChart3, Loader2, ChevronDown, ChevronUp, CheckCircle2, ExternalLink, Trash2, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useLanguage } from "@/contexts/LanguageContext";
import { UseCase, useUseCaseStore } from "@/stores/useCaseStore";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

function getStatus(currentState: number, market: number, bestInClass: number) {
  // Lower is better: if current < best → above reference
  // Higher is better: if current > best → above reference
  // We assume higher is better by default; the AI should indicate direction
  if (currentState >= bestInClass) return "above";
  if (currentState >= market) return "in_range";
  return "below";
}

const statusConfig = {
  above: { label: { PT: "Acima da referência", EN: "Above reference" }, color: "text-emerald-600", dot: "bg-emerald-500" },
  in_range: { label: { PT: "Dentro da faixa", EN: "In range" }, color: "text-amber-600", dot: "bg-amber-500" },
  below: { label: { PT: "Abaixo da referência", EN: "Below reference" }, color: "text-red-500", dot: "bg-red-500" },
};

export function BenchmarkingSection({ useCase }: { useCase: UseCase }) {
  const { language } = useLanguage();
  const { updateUseCase } = useUseCaseStore();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentValues, setCurrentValues] = useState<Record<number, string>>({});

  const hasBenchmarking = !!useCase.benchmarking;
  const kpis = (useCase.benchmarking as any[]) || [];

  const handleGenerate = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("generate-benchmarking", {
        body: { use_case_id: useCase.id, title: useCase.title, description: useCase.description, key_indicators: useCase.key_indicators },
      });
      if (error) throw error;
      updateUseCase(useCase.id, { benchmarking: data.benchmarking });
      setIsOpen(true);
      toast.success(language === "PT" ? "Benchmarking gerado!" : "Benchmarking generated!");
    } catch {
      toast.error(language === "PT" ? "Erro ao gerar benchmarking" : "Error generating benchmarking");
    } finally {
      setIsLoading(false);
    }
  };

  const completedCount = kpis.length;

  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden">
      <button
        className="w-full flex items-center justify-between p-5 text-left"
        onClick={() => hasBenchmarking ? setIsOpen(!isOpen) : null}
      >
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-lg bg-blue-100 flex items-center justify-center">
            <BarChart3 className="h-5 w-5 text-blue-700" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">Benchmarking</h3>
            <p className="text-xs text-muted-foreground">{useCase.title}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {!hasBenchmarking ? (
            <Button size="sm" className="gap-1.5 bg-chain hover:bg-chain-dark text-white" onClick={(e) => { e.stopPropagation(); handleGenerate(); }} disabled={isLoading}>
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
              {language === "PT" ? "Gerar Benchmarking" : "Generate Benchmarking"}
            </Button>
          ) : (
            isOpen ? <ChevronUp className="h-5 w-5 text-muted-foreground" /> : <ChevronDown className="h-5 w-5 text-muted-foreground" />
          )}
        </div>
      </button>

      {isOpen && hasBenchmarking && (
        <div className="px-5 pb-5 border-t border-border pt-4 space-y-4">
          {/* Summary bar */}
          <div className="flex items-center justify-between bg-muted/50 rounded-lg p-3">
            <div className="flex items-center gap-6 text-sm">
              <div>
                <span className="text-xs text-muted-foreground">Coverage</span>
                <p className="font-semibold text-foreground">{completedCount} of {completedCount} KPIs</p>
              </div>
              <div className="flex items-center gap-1">
                <span className="text-xs text-muted-foreground">Classification:</span>
                <Badge className="bg-emerald-600 text-white border-0 text-xs">Complete</Badge>
              </div>
            </div>
            <Button size="sm" className="gap-1.5 bg-chain hover:bg-chain-dark text-white">
              <Save className="h-4 w-4" />
              Save Benchmarking
            </Button>
          </div>

          {/* Performance legend */}
          <div className="flex items-center gap-6 text-xs">
            <span className="text-muted-foreground font-medium">Performance:</span>
            <span className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
              <span className="text-emerald-600 font-medium">{language === "PT" ? "Acima da referência" : "Above reference"}</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-amber-500" />
              <span className="text-amber-600 font-medium">{language === "PT" ? "Dentro da faixa" : "In range"}</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-red-500" />
              <span className="text-red-500 font-medium">{language === "PT" ? "Abaixo da referência" : "Below reference"}</span>
            </span>
          </div>

          <Separator />

          {/* KPI cards */}
          <div className="space-y-4">
            {kpis.map((kpi: any, i: number) => {
              const currentVal = parseFloat(currentValues[i] ?? kpi.current_state ?? "0");
              const marketVal = parseFloat(kpi.market_value ?? "0");
              const bestVal = parseFloat(kpi.best_in_class ?? "0");
              const status = getStatus(currentVal, marketVal, bestVal);
              const statusCfg = statusConfig[status];

              return (
                <div key={i} className="border border-border rounded-xl p-5 space-y-4 bg-background">
                  {/* KPI header */}
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0" />
                      <div>
                        <h4 className="font-semibold text-foreground text-sm">{kpi.name}</h4>
                        <p className="text-xs text-muted-foreground">
                          {kpi.category} • {kpi.unit}
                        </p>
                      </div>
                    </div>
                    {kpi.source && (
                      <Badge variant="outline" className="text-[10px] bg-muted/50 border-border gap-1 shrink-0 max-w-[50%] truncate">
                        Source: {kpi.source}
                        <ExternalLink className="h-3 w-3 shrink-0" />
                      </Badge>
                    )}
                  </div>

                  {/* Values row */}
                  <div className="grid grid-cols-4 gap-4">
                    <div>
                      <p className="text-xs font-semibold text-foreground mb-1.5">Current State</p>
                      <Input
                        value={currentValues[i] ?? kpi.current_state ?? ""}
                        onChange={(e) => setCurrentValues({ ...currentValues, [i]: e.target.value })}
                        className="h-10 bg-background text-sm font-medium"
                        placeholder="—"
                      />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-foreground mb-1.5">Market</p>
                      <div className="h-10 rounded-md bg-amber-50 border border-amber-200 flex items-center px-3 text-sm font-medium text-foreground">
                        {kpi.market_value ?? "—"}
                      </div>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-foreground mb-1.5">Best-in-Class</p>
                      <div className="h-10 rounded-md bg-violet-50 border border-violet-200 flex items-center px-3 text-sm font-medium text-foreground">
                        {kpi.best_in_class ?? "—"}
                      </div>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-foreground mb-1.5">Status</p>
                      <div className="h-10 flex items-center gap-2">
                        <span className={cn("h-3 w-3 rounded-full shrink-0", statusCfg.dot)} />
                        <span className={cn("text-sm font-medium", statusCfg.color)}>
                          {statusCfg.label[language]}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Delete icon */}
                  <div className="flex justify-end">
                    <Trash2 className="h-4 w-4 text-muted-foreground hover:text-destructive cursor-pointer" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
