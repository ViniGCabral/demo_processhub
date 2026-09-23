import React, { useState, useMemo } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useIndicatorStore } from "@/stores/indicatorStore";
import { BusinessIndicator } from "@/types/architectureContextTypes";
import { IndicatorCard } from "@/components/architecture/IndicatorCard";
import { CreateEditBusinessIndicatorModal } from "@/components/architecture/modals/CreateEditBusinessIndicatorModal";
import { LogMeasurementModal } from "@/components/architecture/modals/LogMeasurementModal";
import { IndicatorHistoryModal } from "@/components/architecture/modals/IndicatorHistoryModal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Plus, 
  Search, 
  TrendingUp, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  BarChart3,
  Layers,
  Info
} from "lucide-react";
import { toast } from "sonner";

interface ProcessIndicatorsViewProps {
  processId: string;
  processName: string;
  embedded?: boolean;
}

export function ProcessIndicatorsView({
  processId,
  processName,
  embedded = false,
}: ProcessIndicatorsViewProps) {
  const { language } = useLanguage();
  const pt = language === "PT";

  const { indicators, deleteIndicator } = useIndicatorStore();

  const [searchTerm, setSearchTerm] = useState("");
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editingIndicator, setEditingIndicator] = useState<BusinessIndicator | null>(null);
  const [logModalOpen, setLogModalOpen] = useState(false);
  const [selectedIndicatorForLog, setSelectedIndicatorForLog] = useState<BusinessIndicator | null>(null);
  const [historyModalOpen, setHistoryModalOpen] = useState(false);
  const [selectedIndicatorForHistory, setSelectedIndicatorForHistory] = useState<BusinessIndicator | null>(null);

  // Filter indicators for this process
  // Checks either matching processId, or matching processName or scope containing processName
  const processIndicators = useMemo(() => {
    const pName = processName.toLowerCase();
    return indicators.filter((ind) => {
      if (ind.type !== "business") return false;
      const bInd = ind as BusinessIndicator;
      if (bInd.processId && bInd.processId === processId) return true;
      if (bInd.processName && bInd.processName.toLowerCase() === pName) return true;
      if (bInd.scope && bInd.scope.toLowerCase().includes(pName)) return true;
      // Default fallback for demo mock processes: associate sample indicators if none match
      return false;
    });
  }, [indicators, processId, processName]);

  // Fallback demo indicators for Process 1 / default if empty
  const displayIndicators = useMemo(() => {
    if (processIndicators.length > 0) return processIndicators;
    // If no direct link yet in mock, return indicators whose scope includes "Comercial" or generic for demo
    const genericList = indicators.filter(
      (ind) => ind.type === "business" && (ind.scope?.includes("Comercial") || ind.scope?.includes("Processo"))
    );
    return genericList.length > 0 ? genericList : indicators.filter(ind => ind.type === "business").slice(0, 3);
  }, [processIndicators, indicators]);

  // Apply textual search
  const filteredList = useMemo(() => {
    if (!searchTerm.trim()) return displayIndicators;
    const q = searchTerm.toLowerCase();
    return displayIndicators.filter(
      (ind) =>
        ind.name.toLowerCase().includes(q) ||
        ind.objective?.toLowerCase().includes(q) ||
        ind.category?.toLowerCase().includes(q)
    );
  }, [displayIndicators, searchTerm]);

  // Metrics summary
  const summary = useMemo(() => {
    const total = displayIndicators.length;
    const updated = displayIndicators.filter((i) => i.updateStatus === "atualizado").length;
    const delayed = displayIndicators.filter(
      (i) => i.updateStatus === "em_atraso" || i.updateStatus === "pendente"
    ).length;
    const onTarget = displayIndicators.filter((i) => i.status === "dentro_da_meta").length;
    return { total, updated, delayed, onTarget };
  }, [displayIndicators]);

  const handleDelete = (id: string) => {
    deleteIndicator(id);
    toast.success(pt ? "Indicador removido" : "Indicator removed");
  };

  return (
    <div className={embedded ? "space-y-4" : "p-8 px-10 space-y-6 animate-fade-in"}>
      {/* Header and Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-100">
        <div>
          <div className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-[#0C1BA8]" />
            <h2 className="text-xl font-bold text-[#272727]">
              {pt ? "Indicadores de Desempenho do Processo" : "Process Performance Indicators"}
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            {pt
              ? `Acompanhamento de medições periódicas, metas e histórico para "${processName}".`
              : `Tracking periodic measurements, targets, and history for "${processName}".`}
          </p>
        </div>

        <Button
          onClick={() => {
            setEditingIndicator(null);
            setCreateModalOpen(true);
          }}
          className="bg-[#0C1BA8] hover:bg-[#04223D] text-white text-xs h-9 px-3.5 shadow-sm font-semibold flex items-center gap-1.5 shrink-0"
        >
          <Plus className="w-4 h-4" />
          {pt ? "Adicionar indicador de negócio" : "Add business indicator"}
        </Button>
      </div>

      {/* Metric Quick Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-slate-50 border border-slate-200 rounded-lg p-3">
          <span className="text-[10px] font-bold text-slate-400 uppercase block">
            {pt ? "Total de Indicadores" : "Total KPIs"}
          </span>
          <span className="text-xl font-bold text-[#272727] mt-0.5 block">
            {summary.total}
          </span>
          <span className="text-[10px] text-slate-500">
            {pt ? "Vinculados a este processo" : "Linked to this process"}
          </span>
        </div>

        <div className="bg-slate-50 border border-slate-200 rounded-lg p-3">
          <span className="text-[10px] font-bold text-slate-400 uppercase block">
            {pt ? "Atualizados" : "Up to Date"}
          </span>
          <span className="text-xl font-bold text-emerald-700 mt-0.5 block">
            {summary.updated}
          </span>
          <span className="text-[10px] text-slate-500">
            {pt ? "Medição do período vigente" : "Current period logged"}
          </span>
        </div>

        <div className="bg-slate-50 border border-slate-200 rounded-lg p-3">
          <span className="text-[10px] font-bold text-slate-400 uppercase block">
            {pt ? "Pendentes / Em Atraso" : "Pending / Overdue"}
          </span>
          <span className={`text-xl font-bold mt-0.5 block ${summary.delayed > 0 ? "text-amber-600" : "text-slate-700"}`}>
            {summary.delayed}
          </span>
          <span className="text-[10px] text-slate-500">
            {pt ? "Necessitam lançamento" : "Require measurement"}
          </span>
        </div>

        <div className="bg-slate-50 border border-slate-200 rounded-lg p-3">
          <span className="text-[10px] font-bold text-slate-400 uppercase block">
            {pt ? "Meta Atingida" : "On Target"}
          </span>
          <span className="text-xl font-bold text-emerald-700 mt-0.5 block">
            {summary.onTarget}
          </span>
          <span className="text-[10px] text-slate-500">
            {pt ? "Dentro da meta planejada" : "Within planned target"}
          </span>
        </div>
      </div>

      {/* Search Bar */}
      <div className="flex items-center justify-between gap-3 pt-1">
        <div className="relative flex-1 max-w-sm">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <Input
            type="text"
            placeholder={pt ? "Buscar indicador neste processo..." : "Search indicator in this process..."}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="h-8 pl-8 text-xs bg-white border-slate-200"
          />
        </div>

        <span className="text-xs text-slate-500 font-medium">
          {filteredList.length} {pt ? "indicadores encontrados" : "indicators found"}
        </span>
      </div>

      {/* Indicators Grid */}
      {filteredList.length === 0 ? (
        <div className="p-8 text-center bg-slate-50 rounded-lg border border-dashed border-slate-200 text-xs text-slate-500 space-y-2">
          <Info className="h-8 w-8 text-slate-400 mx-auto opacity-70" />
          <p className="font-bold text-slate-700 text-sm">
            {pt ? "Nenhum indicador de negócio encontrado." : "No business indicators found."}
          </p>
          <p className="max-w-md mx-auto text-slate-500">
            {pt
              ? "Defina metas e acompanhe medições periódicas para este processo clicando no botão abaixo."
              : "Set targets and track periodic measurements for this process by clicking below."}
          </p>
          <Button
            onClick={() => {
              setEditingIndicator(null);
              setCreateModalOpen(true);
            }}
            variant="outline"
            className="mt-2 text-xs text-[#0C1BA8] border-[#0C1BA8]/30 hover:bg-[#0C1BA8]/5 font-semibold"
          >
            <Plus className="h-3.5 w-3.5 mr-1" />
            {pt ? "Cadastrar indicador agora" : "Register indicator now"}
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredList.map((indicator) => (
            <div key={indicator.id} className="min-h-[250px]">
              <IndicatorCard
                indicator={indicator}
                aggregationRule={indicator.aggregationRule}
                originBadge="operacional"
                scopeLabel={`${pt ? "Processo: " : "Process: "}${processName}`}
                onEdit={() => {
                  setEditingIndicator(indicator as BusinessIndicator);
                  setCreateModalOpen(true);
                }}
                onDelete={() => handleDelete(indicator.id)}
                onViewHistory={() => {
                  setSelectedIndicatorForHistory(indicator as BusinessIndicator);
                  setHistoryModalOpen(true);
                }}
                onLogMeasurement={() => {
                  setSelectedIndicatorForLog(indicator as BusinessIndicator);
                  setLogModalOpen(true);
                }}
              />
            </div>
          ))}
        </div>
      )}

      {/* Modals */}
      <CreateEditBusinessIndicatorModal
        open={createModalOpen}
        onOpenChange={setCreateModalOpen}
        processId={processId}
        processName={processName}
        initialScope={`${pt ? "Processo: " : "Process: "}${processName}`}
        editingIndicator={editingIndicator}
      />

      <LogMeasurementModal
        open={logModalOpen}
        onOpenChange={setLogModalOpen}
        indicator={selectedIndicatorForLog}
      />

      <IndicatorHistoryModal
        open={historyModalOpen}
        onOpenChange={setHistoryModalOpen}
        indicator={selectedIndicatorForHistory}
        onLogNewMeasurement={() => {
          setSelectedIndicatorForLog(selectedIndicatorForHistory);
          setLogModalOpen(true);
        }}
      />
    </div>
  );
}
