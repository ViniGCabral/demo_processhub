import { useMemo } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { mockArchitectureData } from "@/data/architectureContextMock";
import { 
  getArchitectureCoverageIndicators, 
  getBusinessIndicatorsByDomain 
} from "@/data/architectureContextUtils";
import { 
  FileText, CheckCircle2, Monitor, Route, TrendingUp, Boxes 
} from "lucide-react";

export function ValueChainSummaryBar() {
  const { language } = useLanguage();
  const pt = language === "PT";

  const metrics = useMemo(() => {
    const coverage = getArchitectureCoverageIndicators(mockArchitectureData);
    
    // Total systems across all L1s
    const allSystems = new Set<string>();
    mockArchitectureData.domainsL1.forEach(l1 => {
      l1.childrenL2.forEach(l2 => {
        l2.childrenL3.forEach(l3 => {
          l3.childrenL4.forEach(l4 => {
            l4.processes.forEach(p => p.systemsUsed.forEach(s => allSystems.add(s.systemName)));
          });
        });
      });
    });

    // Total business indicators
    const allIndicators = new Set<string>();
    mockArchitectureData.domainsL1.forEach(l1 => {
      getBusinessIndicatorsByDomain(mockArchitectureData, l1.id).forEach(i => allIndicators.add(i.id));
    });

    return {
      totalProcesses: coverage.totalProcesses,
      docCoverage: Math.round(coverage.docCoveragePercent),
      valCoverage: Math.round(coverage.validationCoveragePercent),
      totalSystems: allSystems.size,
      totalIndicators: allIndicators.size,
      relatedJourneys: mockArchitectureData.journeys.length,
    };
  }, []);

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
      <div className="bg-white border border-[#A5A7B0]/20 rounded-md p-4 flex flex-col justify-between">
        <div className="flex items-center gap-2 text-[#A5A7B0] mb-2">
          <Boxes className="h-4 w-4" />
          <span className="text-xs font-semibold uppercase tracking-wide">
            {pt ? "Processos" : "Processes"}
          </span>
        </div>
        <div className="text-2xl font-bold text-[#272727]">{metrics.totalProcesses}</div>
      </div>

      <div className="bg-white border border-[#A5A7B0]/20 rounded-md p-4 flex flex-col justify-between">
        <div className="flex items-center gap-2 text-[#A5A7B0] mb-2">
          <FileText className="h-4 w-4" />
          <span className="text-xs font-semibold uppercase tracking-wide">
            {pt ? "Com Documentação" : "Documented"}
          </span>
        </div>
        <div className="flex items-end gap-2">
          <div className="text-2xl font-bold text-[#272727]">{metrics.docCoverage}%</div>
        </div>
      </div>

      <div className="bg-white border border-[#A5A7B0]/20 rounded-md p-4 flex flex-col justify-between">
        <div className="flex items-center gap-2 text-[#A5A7B0] mb-2">
          <CheckCircle2 className="h-4 w-4" />
          <span className="text-xs font-semibold uppercase tracking-wide">
            {pt ? "Contexto Validado" : "Validated Context"}
          </span>
        </div>
        <div className="flex items-end gap-2">
          <div className="text-2xl font-bold text-[#272727]">{metrics.valCoverage}%</div>
        </div>
      </div>

      <div className="bg-white border border-[#A5A7B0]/20 rounded-md p-4 flex flex-col justify-between">
        <div className="flex items-center gap-2 text-[#A5A7B0] mb-2">
          <Route className="h-4 w-4" />
          <span className="text-xs font-semibold uppercase tracking-wide">
            {pt ? "Jornadas Relacionadas" : "Related Journeys"}
          </span>
        </div>
        <div className="text-2xl font-bold text-[#272727]">{metrics.relatedJourneys}</div>
      </div>

      <div className="bg-white border border-[#A5A7B0]/20 rounded-md p-4 flex flex-col justify-between">
        <div className="flex items-center gap-2 text-[#A5A7B0] mb-2">
          <Monitor className="h-4 w-4" />
          <span className="text-xs font-semibold uppercase tracking-wide">
            {pt ? "Sistemas Utilizados" : "Systems Identified"}
          </span>
        </div>
        <div className="text-2xl font-bold text-[#272727]">{metrics.totalSystems}</div>
      </div>

      <div className="bg-white border border-[#A5A7B0]/20 rounded-md p-4 flex flex-col justify-between">
        <div className="flex items-center gap-2 text-[#A5A7B0] mb-2">
          <TrendingUp className="h-4 w-4" />
          <span className="text-xs font-semibold uppercase tracking-wide">
            {pt ? "KPIs Ativos" : "Active KPIs"}
          </span>
        </div>
        <div className="text-2xl font-bold text-[#272727]">{metrics.totalIndicators}</div>
      </div>
    </div>
  );
}
