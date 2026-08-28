import { Badge } from "@/components/ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useLanguage } from "@/contexts/LanguageContext";
import { UseCase, useUseCaseStore } from "@/stores/useCaseStore";
import { TrendingUp, Cpu, BarChart3 } from "lucide-react";

const effortLabels: Record<string, { PT: string; EN: string }> = {
  very_low: { PT: "Muito Baixo", EN: "Very Low" },
  low: { PT: "Baixo", EN: "Low" },
  high: { PT: "Alto", EN: "High" },
  very_high: { PT: "Muito Alto", EN: "Very High" },
};

export function OverviewSection({ useCase }: { useCase: UseCase }) {
  const { language } = useLanguage();
  const { session } = useUseCaseStore();
  const processNames = session?.process_names || [];

  return (
    <div className="bg-card border border-border rounded-xl p-6 space-y-6">
      <div>
        <Badge className="bg-chain-bg text-chain-dark border-0 mb-3">{useCase.category}</Badge>
        <h2 className="text-xl font-semibold text-foreground mb-2">{useCase.title}</h2>
        <p className="text-sm text-muted-foreground">{useCase.description}</p>
      </div>

      {/* Potential Gains */}
      {useCase.potential_gains?.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-emerald-600" />
            {language === "PT" ? "Ganhos Potenciais" : "Potential Gains"}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {useCase.potential_gains.map((gain, i) => (
              <div key={i} className="border-l-2 border-emerald-400 pl-3 py-1">
                <p className="text-sm font-medium text-foreground">{gain.title}</p>
                <p className="text-xs text-muted-foreground">{gain.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Effort, Impact & Impacted Processes */}
      <div className="flex gap-6 items-start">
        <div>
          <p className="text-xs text-muted-foreground mb-1">{language === "PT" ? "Esforço" : "Effort"}</p>
          <Badge variant="outline" className="text-sm">{effortLabels[useCase.effort]?.[language] || useCase.effort}</Badge>
        </div>
        <div>
          <p className="text-xs text-muted-foreground mb-1">{language === "PT" ? "Impacto" : "Impact"}</p>
          <Badge variant="outline" className="text-sm">{effortLabels[useCase.impact]?.[language] || useCase.impact}</Badge>
        </div>
        <div>
          <p className="text-xs text-muted-foreground mb-1">{language === "PT" ? "Processos Impactados" : "Impacted Processes"}</p>
          <Popover>
            <PopoverTrigger asChild>
              <button className="inline-flex items-center justify-center h-6 w-6 rounded-full border-2 border-chain text-chain text-xs font-bold hover:bg-chain hover:text-white transition-colors cursor-pointer">
                {useCase.impacted_processes_count}
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-0" align="start">
              <div className="p-3 border-b border-border">
                <p className="text-sm font-semibold text-foreground">
                  {language === "PT" ? "Processos Impactados" : "Impacted Processes"}
                </p>
              </div>
              <div className="max-h-64 overflow-y-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b border-border bg-muted/50">
                      <th className="text-left p-2 font-semibold text-muted-foreground">#</th>
                      <th className="text-left p-2 font-semibold text-muted-foreground">
                        {language === "PT" ? "Processo" : "Process"}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {processNames.slice(0, useCase.impacted_processes_count).map((name, i) => (
                      <tr key={i} className="border-b border-border last:border-0 hover:bg-muted/30">
                        <td className="p-2 text-muted-foreground">{i + 1}</td>
                        <td className="p-2 text-foreground">{name}</td>
                      </tr>
                    ))}
                    {processNames.length === 0 && (
                      <tr>
                        <td colSpan={2} className="p-3 text-center text-muted-foreground italic">
                          {language === "PT" ? "Nomes não disponíveis" : "Names not available"}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>

      {/* Indicators & Technologies */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {useCase.key_indicators?.length > 0 && (
          <div>
            <h4 className="text-xs font-semibold text-muted-foreground mb-2 flex items-center gap-1">
              <BarChart3 className="h-3 w-3" />
              {language === "PT" ? "Indicadores Impactados" : "Impacted Indicators"}
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {useCase.key_indicators.map((ind, i) => (
                <Badge key={i} variant="secondary" className="text-xs">{ind}</Badge>
              ))}
            </div>
          </div>
        )}
        {useCase.key_technologies?.length > 0 && (
          <div>
            <h4 className="text-xs font-semibold text-muted-foreground mb-2 flex items-center gap-1">
              <Cpu className="h-3 w-3" />
              {language === "PT" ? "Tecnologias" : "Technologies"}
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {useCase.key_technologies.map((tech, i) => (
                <Badge key={i} variant="secondary" className="text-xs">{tech}</Badge>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
