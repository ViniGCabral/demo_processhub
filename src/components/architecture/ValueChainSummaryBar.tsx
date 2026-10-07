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
    mockArchitectureData.domainsL1?.forEach(l1 => {
      l1.childrenL2?.forEach(l2 => {
        l2.childrenL3?.forEach(l3 => {
          l3.childrenL4?.forEach(l4 => {
            l4.processes?.forEach(p => p.systemsUsed?.forEach(s => allSystems.add(s.systemName)));
          });
        });
      });
    });

    // Total business indicators
    const allIndicators = new Set<string>();
    mockArchitectureData.domainsL1?.forEach(l1 => {
      getBusinessIndicatorsByDomain(mockArchitectureData, l1.id)?.forEach(i => allIndicators.add(i.id));
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
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
      <div className="bg-white border border-[#A5A7B0]/20 rounded-xl p-5 shadow-sm">
        <div className="flex items-start justify-between mb-3">
          <span className="text-[13px] font-semibold text-[#4D5A72]">
            {pt ? "Processos" : "Processes"}
          </span>
          <div className="text-[#F97316] bg-[#FFF3ED] p-1.5 rounded-lg">
            <Boxes className="h-4 w-4" />
          </div>
        </div>
        <div className="text-3xl font-bold text-[#1E293B] tracking-tight">{metrics.totalProcesses}</div>
        <div className="text-[11px] text-[#A5A7B0] mt-1">
          {pt ? "10 em domínios primários" : "10 in primary domains"}
        </div>
      </div>

      <div className="bg-white border border-[#A5A7B0]/20 rounded-xl p-5 shadow-sm">
        <div className="flex items-start justify-between mb-3">
          <span className="text-[13px] font-semibold text-[#4D5A72]">
            {pt ? "Com documentação" : "Documented"}
          </span>
          <div className="text-[#F97316] bg-[#FFF3ED] p-1.5 rounded-lg">
            <FileText className="h-4 w-4" />
          </div>
        </div>
        <div className="text-3xl font-bold text-[#1E293B] tracking-tight">{metrics.docCoverage}%</div>
        <div className="text-[11px] text-[#A5A7B0] mt-1">
          {pt ? "15 processos documentados" : "15 documented processes"}
        </div>
      </div>

      <div className="bg-white border border-[#A5A7B0]/20 rounded-xl p-5 shadow-sm">
        <div className="flex items-start justify-between mb-3">
          <span className="text-[13px] font-semibold text-[#4D5A72]">
            {pt ? "Contexto validado" : "Validated Context"}
          </span>
          <div className="text-[#F97316] bg-[#FFF3ED] p-1.5 rounded-lg">
            <CheckCircle2 className="h-4 w-4" />
          </div>
        </div>
        <div className="text-3xl font-bold text-[#1E293B] tracking-tight">{metrics.valCoverage}%</div>
        <div className="text-[11px] text-[#A5A7B0] mt-1">
          {pt ? "14 contextos revisados" : "14 reviewed contexts"}
        </div>
      </div>

      <div className="bg-white border border-[#A5A7B0]/20 rounded-xl p-5 shadow-sm">
        <div className="flex items-start justify-between mb-3">
          <span className="text-[13px] font-semibold text-[#4D5A72]">
            {pt ? "Jornadas relacionadas" : "Related Journeys"}
          </span>
          <div className="text-[#F97316] bg-[#FFF3ED] p-1.5 rounded-lg">
            <Route className="h-4 w-4" />
          </div>
        </div>
        <div className="text-3xl font-bold text-[#1E293B] tracking-tight">{metrics.relatedJourneys}</div>
        <div className="text-[11px] text-[#A5A7B0] mt-1">
          {pt ? "Conectadas à cadeia" : "Connected to the chain"}
        </div>
      </div>

      <div className="bg-white border border-[#A5A7B0]/20 rounded-xl p-5 shadow-sm">
        <div className="flex items-start justify-between mb-3">
          <span className="text-[13px] font-semibold text-[#4D5A72]">
            {pt ? "Sistemas utilizados" : "Systems Identified"}
          </span>
          <div className="text-[#F97316] bg-[#FFF3ED] p-1.5 rounded-lg">
            <Monitor className="h-4 w-4" />
          </div>
        </div>
        <div className="text-3xl font-bold text-[#1E293B] tracking-tight">{metrics.totalSystems}</div>
        <div className="text-[11px] text-[#A5A7B0] mt-1">
          {pt ? "Mapeados na arquitetura" : "Mapped in the architecture"}
        </div>
      </div>

      <div className="bg-white border border-[#A5A7B0]/20 rounded-xl p-5 shadow-sm">
        <div className="flex items-start justify-between mb-3">
          <span className="text-[13px] font-semibold text-[#4D5A72]">
            {pt ? "KPIs ativos" : "Active KPIs"}
          </span>
          <div className="text-[#F97316] bg-[#FFF3ED] p-1.5 rounded-lg">
            <TrendingUp className="h-4 w-4" />
          </div>
        </div>
        <div className="text-3xl font-bold text-[#1E293B] tracking-tight">{metrics.totalIndicators}</div>
        <div className="text-[11px] text-[#A5A7B0] mt-1">
          {pt ? "Com medição vigente" : "With active measurement"}
        </div>
      </div>
    </div>
  );
}
