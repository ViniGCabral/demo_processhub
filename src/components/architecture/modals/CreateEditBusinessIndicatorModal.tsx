import React, { useState, useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { 
  BusinessIndicator, 
  BusinessIndicatorCategory, 
  IndicatorPolarity 
} from "@/types/architectureContextTypes";
import { useIndicatorStore } from "@/stores/indicatorStore";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

interface CreateEditBusinessIndicatorModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  domainName?: string;
  domainId?: string;
  processId?: string;
  processName?: string;
  initialScope?: string;
  editingIndicator?: BusinessIndicator | null;
}

const CATEGORIES: BusinessIndicatorCategory[] = [
  "Eficiência",
  "Qualidade",
  "Prazo/SLA",
  "Volume",
  "Custo",
  "Satisfação",
  "Risco",
  "Resultado"
];

const PERIODICITIES = ["Diário", "Semanal", "Mensal", "Trimestral", "Anual"];

export function CreateEditBusinessIndicatorModal({
  open,
  onOpenChange,
  domainName = "Gestão Comercial",
  domainId = "l1-gestao-comercial",
  processId,
  processName,
  initialScope,
  editingIndicator,
}: CreateEditBusinessIndicatorModalProps) {
  const { language } = useLanguage();
  const pt = language === "PT";
  const { addIndicator, updateIndicator } = useIndicatorStore();

  const [name, setName] = useState("");
  const [objective, setObjective] = useState("");
  const [category, setCategory] = useState<BusinessIndicatorCategory>("Prazo/SLA");
  const [formula, setFormula] = useState("");
  const [unit, setUnit] = useState("%");
  const [target, setTarget] = useState("");
  const [alertBand, setAlertBand] = useState("< 90%");
  const [periodicity, setPeriodicity] = useState("Mensal");
  const [responsible, setResponsible] = useState("");
  const [source, setSource] = useState("CRM Salesforce");
  const [dataSourceType, setDataSourceType] = useState<"manual" | "spreadsheet" | "system_api">("manual");
  const [scope, setScope] = useState(initialScope || processName || domainName);
  const [polarity, setPolarity] = useState<IndicatorPolarity>("maior_melhor");
  const [aggregationRule, setAggregationRule] = useState<
    "soma" | "percentual_recalculado" | "media_ponderada" | "maior_valor" | "nao_agregavel"
  >("percentual_recalculado");
  const [trackingStartDate, setTrackingStartDate] = useState("2026-01-01");
  const [updateDeadlineDays, setUpdateDeadlineDays] = useState(10);
  const [notes, setNotes] = useState("");

  useEffect(() => {
    if (editingIndicator) {
      setName(editingIndicator.name);
      setObjective(editingIndicator.objective);
      setCategory(editingIndicator.category || "Prazo/SLA");
      setFormula(editingIndicator.formula || "");
      setUnit(editingIndicator.unit || "%");
      setTarget(editingIndicator.target);
      setAlertBand(editingIndicator.alertBand || "");
      setPeriodicity(editingIndicator.periodicity || "Mensal");
      setResponsible(editingIndicator.responsible);
      setSource(editingIndicator.source);
      setDataSourceType(editingIndicator.dataSourceType || "manual");
      setScope(editingIndicator.scope || domainName);
      setPolarity(editingIndicator.polarity || "maior_melhor");
      setAggregationRule(editingIndicator.aggregationRule || "percentual_recalculado");
      setTrackingStartDate(editingIndicator.trackingStartDate || "2026-01-01");
      setUpdateDeadlineDays(editingIndicator.updateDeadlineDays ?? 10);
      setNotes(editingIndicator.notes || "");
    } else {
      setName("");
      setObjective("");
      setCategory("Prazo/SLA");
      setFormula("");
      setUnit("%");
      setTarget("");
      setAlertBand("< 90%");
      setPeriodicity("Mensal");
      setResponsible("");
      setSource("Manual / Operacional");
      setDataSourceType("manual");
      setScope(initialScope || processName || domainName);
      setPolarity("maior_melhor");
      setAggregationRule("percentual_recalculado");
      setTrackingStartDate("2026-01-01");
      setUpdateDeadlineDays(10);
      setNotes("");
    }
  }, [editingIndicator, domainName, processName, initialScope, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error(pt ? "Por favor informe o nome do indicador" : "Please provide an indicator name");
      return;
    }

    if (!target.trim()) {
      toast.error(pt ? "Por favor informe a meta do indicador" : "Please provide a target for the indicator");
      return;
    }

    const indicatorData: Omit<BusinessIndicator, "id"> = {
      type: "business",
      name: name.trim(),
      objective: objective.trim() || (pt ? "Monitoramento operacional" : "Operational monitoring"),
      category,
      formula: formula.trim(),
      unit: unit.trim(),
      currentValue: editingIndicator?.currentValue || "Sem dados",
      target: target.trim(),
      alertBand: alertBand.trim(),
      periodicity,
      responsible: responsible.trim() || (pt ? "Líder de Processos" : "Process Owner"),
      source: source.trim() || (pt ? "Lançamento Manual" : "Manual Entry"),
      dataSourceType,
      scope: scope.trim() || domainName,
      polarity,
      aggregationRule,
      domainId: domainId || "l1-gestao-comercial",
      processId: processId || editingIndicator?.processId,
      processName: processName || editingIndicator?.processName,
      trend: editingIndicator?.trend || "stable",
      status: editingIndicator?.status || "sem_dados",
      updateStatus: editingIndicator?.updateStatus || "sem_medicao",
      valueSource: editingIndicator?.valueSource || "proprio",
      measurements: editingIndicator?.measurements || [],
      measurementHistory: editingIndicator?.measurementHistory || [],
      trackingStartDate,
      updateDeadlineDays,
      notes: notes.trim()
    };

    if (editingIndicator) {
      updateIndicator(editingIndicator.id, indicatorData);
      toast.success(pt ? "Definição do indicador atualizada" : "Indicator definition updated");
    } else {
      addIndicator(indicatorData);
      toast.success(pt ? "Indicador cadastrado com sucesso. Agora lance a primeira medição!" : "Indicator created successfully. You can now log the first measurement!");
    }

    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-[#272727]">
            {editingIndicator 
              ? (pt ? "Editar Indicador de Negócio" : "Edit Business Indicator")
              : (pt ? "Adicionar Indicador de Negócio" : "Add Business Indicator")}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-2">
          {/* Nome e Categoria */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2 space-y-1.5">
              <Label className="text-xs font-semibold text-[#272727]">
                {pt ? "Nome do Indicador *" : "Indicator Name *"}
              </Label>
              <Input
                placeholder={pt ? "Ex: Percentual de SLA cumprido" : "e.g. SLA Fulfillment Rate"}
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-[#272727]">
                {pt ? "Tipo / Categoria" : "Type / Category"}
              </Label>
              <Select value={category} onValueChange={(val: BusinessIndicatorCategory) => setCategory(val)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Objetivo */}
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold text-[#272727]">
              {pt ? "Objetivo Estratégico ou Operacional" : "Objective"}
            </Label>
            <Textarea
              placeholder={pt ? "Acompanhar o cumprimento dos prazos acordados do lead ao fechamento..." : "Track SLA from lead to close..."}
              rows={2}
              value={objective}
              onChange={(e) => setObjective(e.target.value)}
            />
          </div>

          {/* Fórmula */}
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold text-[#272727]">
              {pt ? "Fórmula de Cálculo" : "Calculation Formula"}
            </Label>
            <Input
              placeholder={pt ? "Ex: (Casos concluídos no prazo ÷ Total de casos) × 100" : "e.g. (Completed in time / Total) * 100"}
              value={formula}
              onChange={(e) => setFormula(e.target.value)}
            />
          </div>

          {/* Nota informativa de governança */}
          <div className="bg-blue-50/60 border border-blue-200/60 rounded-md p-2.5 text-xs text-[#0C1BA8] flex items-center gap-2">
            <span className="font-semibold">{pt ? "Atenção:" : "Note:"}</span>
            <span>
              {pt 
                ? "O valor atual e o status de desempenho são derivados diretamente dos lançamentos periódicos de medição."
                : "The current value and performance status are calculated from periodic measurement entries."}
            </span>
          </div>

          {/* Meta, Unidade e Faixa de Alerta */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-[#272727]">
                {pt ? "Meta de Desempenho *" : "Performance Target *"}
              </Label>
              <Input
                placeholder="Ex: 95% ou 15 dias"
                value={target}
                onChange={(e) => setTarget(e.target.value)}
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-[#272727]">
                {pt ? "Unidade de Medida" : "Unit of Measure"}
              </Label>
              <Input
                placeholder="Ex: %, dias, R$, un"
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-[#272727]">
                {pt ? "Faixa de Alerta / Tolerância" : "Alert / Tolerance Band"}
              </Label>
              <Input
                placeholder="Ex: < 90% ou ±5%"
                value={alertBand}
                onChange={(e) => setAlertBand(e.target.value)}
              />
            </div>
          </div>

          {/* Periodicidade, Polaridade e Regra de Agregação */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-[#272727]">
                {pt ? "Periodicidade" : "Periodicity"}
              </Label>
              <Select value={periodicity} onValueChange={setPeriodicity}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {PERIODICITIES.map((p) => (
                    <SelectItem key={p} value={p}>
                      {p}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-[#272727]">
                {pt ? "Polaridade" : "Polarity"}
              </Label>
              <Select 
                value={polarity} 
                onValueChange={(val: IndicatorPolarity) => setPolarity(val)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="maior_melhor">
                    {pt ? "Maior é melhor (↑)" : "Higher is better (↑)"}
                  </SelectItem>
                  <SelectItem value="menor_melhor">
                    {pt ? "Menor é melhor (↓)" : "Lower is better (↓)"}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-[#272727]">
                {pt ? "Regra de Agregação" : "Aggregation Rule"}
              </Label>
              <Select 
                value={aggregationRule} 
                onValueChange={(val: any) => setAggregationRule(val)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="percentual_recalculado">
                    {pt ? "Percentual Recalculado (SLA)" : "Recalculated %"}
                  </SelectItem>
                  <SelectItem value="media_ponderada">
                    {pt ? "Média Ponderada (Tempo)" : "Weighted Average"}
                  </SelectItem>
                  <SelectItem value="soma">
                    {pt ? "Soma (Volume/Custo)" : "Sum (Volume)"}
                  </SelectItem>
                  <SelectItem value="maior_valor">
                    {pt ? "Maior Valor (Pior Risco)" : "Maximum Value"}
                  </SelectItem>
                  <SelectItem value="nao_agregavel">
                    {pt ? "Não Agregável" : "Non-aggregable"}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Responsável, Tipo de Fonte e Fonte */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-[#272727]">
                {pt ? "Responsável pelo Indicador" : "Responsible Owner"}
              </Label>
              <Input
                placeholder="Ex: Gerente Comercial"
                value={responsible}
                onChange={(e) => setResponsible(e.target.value)}
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-[#272727]">
                {pt ? "Tipo de Fonte de Dados" : "Data Source Type"}
              </Label>
              <Select 
                value={dataSourceType} 
                onValueChange={(val: any) => setDataSourceType(val)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="manual">
                    {pt ? "Atualização manual" : "Manual update"}
                  </SelectItem>
                  <SelectItem value="spreadsheet">
                    {pt ? "Planilha (Excel / Google Sheets)" : "Spreadsheet"}
                  </SelectItem>
                  <SelectItem value="system_api">
                    {pt ? "Sistema / API externa" : "System / External API"}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-[#272727]">
                {pt ? "Origem / Sistema da Fonte" : "Source System"}
              </Label>
              <Input
                placeholder="Ex: CRM Salesforce, SAP, etc."
                value={source}
                onChange={(e) => setSource(e.target.value)}
              />
            </div>
          </div>

          {/* Escopo, Início de Acompanhamento e Prazo Limite */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-[#272727]">
                {pt ? "Escopo / Abrangência" : "Scope"}
              </Label>
              <Input
                placeholder={domainName}
                value={scope}
                onChange={(e) => setScope(e.target.value)}
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-[#272727]">
                {pt ? "Início de Acompanhamento" : "Tracking Start Date"}
              </Label>
              <Input
                type="date"
                value={trackingStartDate}
                onChange={(e) => setTrackingStartDate(e.target.value)}
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-[#272727]">
                {pt ? "Prazo Limite (dias úteis pós-período)" : "Update Deadline (days)"}
              </Label>
              <Input
                type="number"
                min={1}
                max={60}
                value={updateDeadlineDays}
                onChange={(e) => setUpdateDeadlineDays(Number(e.target.value))}
              />
            </div>
          </div>

          {/* Observações */}
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold text-[#272727]">
              {pt ? "Observações ou Instruções de Medição" : "Notes / Measurement Instructions"}
            </Label>
            <Textarea
              placeholder={pt ? "Orientações para o responsável pelo lançamento..." : "Instructions for measurement logging..."}
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>

          <DialogFooter className="pt-4 border-t border-gray-100 flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              {pt ? "Cancelar" : "Cancel"}
            </Button>
            <Button
              type="submit"
              className="bg-[#0C1BA8] hover:bg-[#04223D] text-white"
            >
              {editingIndicator 
                ? (pt ? "Salvar Alterações" : "Save Changes") 
                : (pt ? "Adicionar Indicador" : "Add Indicator")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
