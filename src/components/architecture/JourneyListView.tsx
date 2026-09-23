import { useState, useMemo } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { mockArchitectureData } from "@/data/architectureContextMock";
import { calculateJourneyCoverage } from "@/data/architectureContextUtils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Plus,
  Search,
  Sparkles,
  Network,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Monitor,
  Target,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import type { JourneyData } from "@/types/architectureContextTypes";
import { useJourneyStore } from "@/stores/journeyStore";

interface JourneyListViewProps {
  onSelectJourney: (journeyId: string) => void;
  onCreateJourney?: () => void;
  onDiscoverAI?: () => void;
}

export function JourneyListView({ onSelectJourney, onCreateJourney, onDiscoverAI }: JourneyListViewProps) {
  const { language } = useLanguage();
  const pt = language === "PT";
  
  const storeJourneys = useJourneyStore((state) => state.journeys);
  const journeys = useMemo(() => {
    return [...mockArchitectureData.journeys];
  }, [storeJourneys]);

  const [search, setSearch] = useState("");
  const [filterDomain, setFilterDomain] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");

  const domains = useMemo(() => {
    const set = new Set<string>();
    journeys.forEach(j => set.add(j.mainDomain));
    return Array.from(set);
  }, [journeys]);

  const filtered = useMemo(() => {
    return journeys.filter((j) => {
      if (filterDomain !== "all" && j.mainDomain !== filterDomain) return false;
      if (filterStatus !== "all" && j.status !== filterStatus) return false;
      if (search) {
        const q = search.toLowerCase();
        return (
          j.name.toLowerCase().includes(q) ||
          j.description.toLowerCase().includes(q) ||
          j.objective.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [journeys, search, filterDomain, filterStatus]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "validated": return "text-green-600 bg-green-50 border-green-200";
      case "validating": return "text-amber-600 bg-amber-50 border-amber-200";
      case "reference": return "text-blue-600 bg-blue-50 border-blue-200";
      default: return "text-gray-600 bg-gray-50 border-gray-200";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "validated": return pt ? "Validada" : "Validated";
      case "validating": return pt ? "Em Validação" : "Validating";
      case "reference": return pt ? "Referência" : "Reference";
      default: return status;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header and Actions */}
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-[#272727]">
            {pt ? "Jornadas de Valor" : "Value Journeys"}
          </h2>
          <p className="text-sm text-[#A5A7B0] mt-1">
            {pt
              ? "As jornadas conectam processos para representar fluxos de ponta a ponta na organização."
              : "Journeys connect processes to represent end-to-end flows in the organization."}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onDiscoverAI}
            className="rounded-sm border-[#A5A7B0]/40 text-[#272727]"
          >
            <Sparkles className="h-4 w-4 mr-2 text-[#0C1BA8]" />
            {pt ? "Descobrir jornada com IA" : "Discover journey with AI"}
          </Button>
          <Button
            size="sm"
            onClick={onCreateJourney}
            className="rounded-sm bg-[#0C1BA8] hover:bg-[#04223D] text-white"
          >
            <Plus className="h-4 w-4 mr-2" />
            {pt ? "Criar jornada" : "Create journey"}
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row items-center gap-3 bg-white p-4 rounded-md border border-[#A5A7B0]/20 shadow-sm">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#A5A7B0]" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={pt ? "Buscar jornadas..." : "Search journeys..."}
            className="pl-9 rounded-sm"
          />
        </div>
        
        <div className="flex gap-3 w-full md:w-auto">
          <Select value={filterDomain} onValueChange={setFilterDomain}>
            <SelectTrigger className="w-[180px] rounded-sm">
              <SelectValue placeholder={pt ? "Domínio Principal" : "Main Domain"} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{pt ? "Todos os domínios" : "All domains"}</SelectItem>
              {domains.map(d => (
                <SelectItem key={d} value={d}>{d}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-[160px] rounded-sm">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{pt ? "Todos os status" : "All statuses"}</SelectItem>
              <SelectItem value="reference">{pt ? "Referência" : "Reference"}</SelectItem>
              <SelectItem value="validating">{pt ? "Em Validação" : "Validating"}</SelectItem>
              <SelectItem value="validated">{pt ? "Validada" : "Validated"}</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Journey List (Wide Cards) */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 rounded-md border border-dashed border-[#A5A7B0]/40 bg-white">
          <Network className="h-10 w-10 mx-auto mb-3 text-[#A5A7B0]/50" />
          <p className="text-sm text-[#A5A7B0]">
            {pt ? "Nenhuma jornada corresponde aos filtros." : "No journeys match the filters."}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((j) => {
            const coverage = calculateJourneyCoverage(mockArchitectureData, j);
            const mainIndicator = j.businessIndicators[0] || j.contextIndicators[0];
            
            return (
              <div 
                key={j.id} 
                className="group relative bg-white border border-[#A5A7B0]/20 rounded-md p-5 hover:border-[#0C1BA8] hover:shadow-md transition-all cursor-pointer"
                onClick={() => onSelectJourney(j.id)}
              >
                <div className="flex flex-col lg:flex-row gap-6">
                  {/* Left Column: Core Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-sm bg-[#c9dcf2] text-[#0C1BA8] uppercase tracking-wide">
                        {j.mainDomain}
                      </span>
                      <span className={cn("text-[10px] font-bold px-2 py-0.5 rounded-sm uppercase tracking-wide border", getStatusColor(j.status))}>
                        {getStatusLabel(j.status)}
                      </span>
                    </div>
                    
                    <h3 className="text-lg font-bold text-[#272727] mb-1 group-hover:text-[#0C1BA8] transition-colors">
                      {j.name}
                    </h3>
                    <p className="text-sm text-[#6B7280] mb-3 line-clamp-2">
                      {j.objective}
                    </p>

                    {/* Coverage Tags */}
                    <div className="flex flex-wrap gap-1.5 mt-auto">
                      <span className="inline-flex items-center gap-1 px-2 py-1 bg-gray-50 border border-gray-100 rounded-sm text-[11px] text-gray-600 font-medium">
                        <Network className="h-3 w-3" />
                        {j.participatingProcessIds.length} {pt ? "Processos" : "Processes"}
                      </span>
                      <span className="inline-flex items-center gap-1 px-2 py-1 bg-gray-50 border border-gray-100 rounded-sm text-[11px] text-gray-600 font-medium">
                        <Monitor className="h-3 w-3" />
                        {j.systemsInvolved.length} {pt ? "Sistemas" : "Systems"}
                      </span>
                      {j.gaps.length > 0 && (
                        <span className="inline-flex items-center gap-1 px-2 py-1 bg-amber-50 border border-amber-100 rounded-sm text-[11px] text-amber-700 font-medium">
                          <AlertTriangle className="h-3 w-3" />
                          {j.gaps.length} {pt ? "Lacunas" : "Gaps"}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Right Column: Stats & Breakdown */}
                  <div className="lg:w-[380px] shrink-0 border-t lg:border-t-0 lg:border-l border-[#A5A7B0]/20 pt-4 lg:pt-0 lg:pl-6 flex flex-col justify-between">
                    
                    {/* Main Indicator */}
                    {mainIndicator ? (
                      <div className="mb-4">
                        <span className="text-[10px] font-bold text-[#A5A7B0] uppercase tracking-wide mb-1 block">
                          {pt ? "Indicador Principal" : "Main Indicator"}
                        </span>
                        <div className="flex items-end gap-2">
                          <span className="text-xl font-bold text-[#272727] leading-none">
                            {mainIndicator.currentValue}
                          </span>
                          <span className="text-xs text-[#6B7280] font-medium mb-0.5">
                            {mainIndicator.name}
                          </span>
                        </div>
                      </div>
                    ) : (
                      <div className="mb-4 text-xs text-[#A5A7B0] italic">
                        {pt ? "Sem indicadores associados" : "No indicators associated"}
                      </div>
                    )}

                    {/* Architecture Coverage Matrix */}
                    <div>
                      <span className="text-[10px] font-bold text-[#A5A7B0] uppercase tracking-wide mb-2 block">
                        {pt ? "Abrangência Arquitetural" : "Architecture Coverage"}
                      </span>
                      <div className="grid grid-cols-4 gap-2">
                        <div className="bg-gray-50 rounded-sm p-1.5 text-center border border-gray-100">
                          <div className="text-xs font-bold text-[#272727]">{coverage.l1.length}</div>
                          <div className="text-[9px] text-[#A5A7B0] uppercase">L1</div>
                        </div>
                        <div className="bg-gray-50 rounded-sm p-1.5 text-center border border-gray-100">
                          <div className="text-xs font-bold text-[#272727]">{coverage.l2.length}</div>
                          <div className="text-[9px] text-[#A5A7B0] uppercase">L2</div>
                        </div>
                        <div className="bg-gray-50 rounded-sm p-1.5 text-center border border-gray-100">
                          <div className="text-xs font-bold text-[#272727]">{coverage.l3.length}</div>
                          <div className="text-[9px] text-[#A5A7B0] uppercase">L3</div>
                        </div>
                        <div className="bg-gray-50 rounded-sm p-1.5 text-center border border-gray-100">
                          <div className="text-xs font-bold text-[#272727]">{coverage.l4.length}</div>
                          <div className="text-[9px] text-[#A5A7B0] uppercase">L4</div>
                        </div>
                      </div>
                    </div>

                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
