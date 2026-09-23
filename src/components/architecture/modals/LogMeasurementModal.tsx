import React, { useState, useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { BusinessIndicator, IndicatorMeasurement } from "@/types/architectureContextTypes";
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
import { AlertTriangle, CheckCircle2, FileText, Info } from "lucide-react";
import { toast } from "sonner";

interface LogMeasurementModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  indicator: BusinessIndicator | null;
}

export function LogMeasurementModal({
  open,
  onOpenChange,
  indicator,
}: LogMeasurementModalProps) {
  const { language } = useLanguage();
  const pt = language === "PT";
  const { logMeasurement } = useIndicatorStore();

  const [period, setPeriod] = useState("");
  const [measuredValue, setMeasuredValue] = useState("");
  const [entryDate, setEntryDate] = useState("");
  const [registeredBy, setRegisteredBy] = useState("");
  const [comment, setComment] = useState("");
  const [evidence, setEvidence] = useState("");
  const [confirmReplace, setConfirmReplace] = useState(false);

  // Initialize or set default period based on indicator periodicity
  useEffect(() => {
    if (indicator && open) {
      const today = new Date();
      const yyyy = today.getFullYear();
      const mm = String(today.getMonth() + 1).padStart(2, "0");
      const dd = String(today.getDate()).padStart(2, "0");
      setEntryDate(`${yyyy}-${mm}-${dd}`);
      setRegisteredBy(indicator.responsible || "Analista de Processos");
      setEvidence("");
      setComment("");
      setMeasuredValue("");
      setConfirmReplace(false);

      if (indicator.periodicity === "Mensal") {
        setPeriod(`${yyyy}-${mm}`);
      } else if (indicator.periodicity === "Diário") {
        setPeriod(`${yyyy}-${mm}-${dd}`);
      } else if (indicator.periodicity === "Semanal") {
        setPeriod(`Semana 38/${yyyy}`);
      } else if (indicator.periodicity === "Trimestral") {
        const q = Math.ceil((today.getMonth() + 1) / 3);
        setPeriod(`${q}T/${yyyy}`);
      } else if (indicator.periodicity === "Anual") {
        setPeriod(`${yyyy}`);
      } else {
        setPeriod(`${yyyy}-${mm}`);
      }
    }
  }, [indicator, open]);

  if (!indicator) return null;

  const existingMeasurement = indicator.measurements?.find(
    (m) => (m.referencePeriod || m.period) === period.trim()
  );
  const isDuplicate = !!existingMeasurement;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!period.trim()) {
      toast.error(pt ? "Informe o período de referência" : "Please specify reference period");
      return;
    }

    if (measuredValue === "" || isNaN(Number(measuredValue.replace(",", ".")))) {
      toast.error(pt ? "Informe um valor numérico válido para a medição" : "Please enter a valid numeric value");
      return;
    }

    if (isDuplicate && !confirmReplace) {
      toast.error(pt ? "Confirme a substituição da medição existente para este período" : "Please confirm replacing the existing measurement");
      return;
    }

    logMeasurement(indicator.id, {
      referencePeriod: period.trim(),
      period: period.trim(),
      measuredValue: measuredValue.trim(),
      registeredAt: entryDate || new Date().toISOString().split("T")[0],
      entryDate: entryDate || new Date().toISOString().split("T")[0],
      registeredBy: registeredBy.trim() || "Usuário do Sistema",
      comment: comment.trim() || undefined,
      evidence: evidence.trim() || undefined,
    });

    toast.success(
      pt
        ? isDuplicate
          ? `Medição de ${period} atualizada com sucesso!`
          : `Medição de ${period} registrada com sucesso!`
        : `Measurement for ${period} logged successfully!`
    );
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold text-[#272727] flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-[#0C1BA8]" />
            {pt ? "Lançar Medição de Indicador" : "Log Indicator Measurement"}
          </DialogTitle>
        </DialogHeader>

        {/* Resumo do indicador */}
        <div className="bg-slate-50 border border-slate-200/80 rounded-lg p-3 space-y-1.5 text-xs">
          <div className="flex justify-between items-start">
            <span className="font-semibold text-sm text-[#272727]">{indicator.name}</span>
            <span className="bg-blue-100 text-[#0C1BA8] font-medium px-2 py-0.5 rounded text-[11px]">
              {indicator.category || "Indicador"}
            </span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 text-slate-600">
            <div>
              <span className="block text-[10px] uppercase font-bold text-slate-400">
                {pt ? "Meta" : "Target"}
              </span>
              <span className="font-semibold text-slate-800">{indicator.target}</span>
            </div>
            <div>
              <span className="block text-[10px] uppercase font-bold text-slate-400">
                {pt ? "Unidade" : "Unit"}
              </span>
              <span className="font-semibold text-slate-800">{indicator.unit || "-"}</span>
            </div>
            <div>
              <span className="block text-[10px] uppercase font-bold text-slate-400">
                {pt ? "Periodicidade" : "Periodicity"}
              </span>
              <span className="font-semibold text-slate-800">{indicator.periodicity}</span>
            </div>
            <div>
              <span className="block text-[10px] uppercase font-bold text-slate-400">
                {pt ? "Polaridade" : "Polarity"}
              </span>
              <span className="font-semibold text-slate-800">
                {indicator.polarity === "menor_melhor" ? "↓ Menor melhor" : "↑ Maior melhor"}
              </span>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 py-2">
          {/* Período e Valor Realizado */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-[#272727]">
                {pt ? "Período de Referência *" : "Reference Period *"}
              </Label>
              {indicator.periodicity === "Mensal" ? (
                <Input
                  type="month"
                  value={period}
                  onChange={(e) => {
                    setPeriod(e.target.value);
                    setConfirmReplace(false);
                  }}
                  required
                />
              ) : indicator.periodicity === "Diário" ? (
                <Input
                  type="date"
                  value={period}
                  onChange={(e) => {
                    setPeriod(e.target.value);
                    setConfirmReplace(false);
                  }}
                  required
                />
              ) : (
                <Input
                  placeholder={pt ? "Ex: 2026-09 ou 3T/2026" : "e.g. 2026-09"}
                  value={period}
                  onChange={(e) => {
                    setPeriod(e.target.value);
                    setConfirmReplace(false);
                  }}
                  required
                />
              )}
              <span className="text-[10px] text-slate-500">
                {pt ? "Formato: " : "Format: "}
                {indicator.periodicity === "Mensal" ? "AAAA-MM (ex: 2026-09)" : indicator.periodicity}
              </span>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-[#272727]">
                {pt ? `Valor Realizado / Medido (${indicator.unit || ""}) *` : `Measured Value (${indicator.unit || ""}) *`}
              </Label>
              <Input
                type="text"
                placeholder={pt ? "Ex: 92 ou 14.5" : "e.g. 92"}
                value={measuredValue}
                onChange={(e) => setMeasuredValue(e.target.value)}
                required
              />
              <span className="text-[10px] text-slate-500">
                {pt ? `Meta estabelecida: ${indicator.target}` : `Target: ${indicator.target}`}
              </span>
            </div>
          </div>

          {/* Alerta de duplicidade */}
          {isDuplicate && (
            <div className="bg-amber-50 border border-amber-300 rounded-md p-3 text-amber-900 text-xs space-y-2">
              <div className="flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold">
                    {pt ? "Atenção: Já existe medição cadastrada para este período!" : "Warning: A measurement already exists for this period!"}
                  </p>
                  <p className="text-[11px] text-amber-800 mt-0.5">
                    {pt 
                      ? `Valor atual do período (${period}): ${existingMeasurement.measuredValue} ${indicator.unit || ""}. Registrado por ${existingMeasurement.registeredBy} em ${existingMeasurement.entryDate}.`
                      : `Current value for (${period}): ${existingMeasurement.measuredValue}. Registered by ${existingMeasurement.registeredBy}.`}
                  </p>
                </div>
              </div>
              <label className="flex items-center gap-2 cursor-pointer font-medium text-amber-950 pt-1">
                <input
                  type="checkbox"
                  checked={confirmReplace}
                  onChange={(e) => setConfirmReplace(e.target.checked)}
                  className="rounded text-[#0C1BA8] focus:ring-[#0C1BA8]"
                />
                <span>{pt ? "Desejo sobrescrever a medição deste período com o novo valor" : "I confirm replacing this period's measurement"}</span>
              </label>
            </div>
          )}

          {/* Data de lançamento e Responsável */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-[#272727]">
                {pt ? "Data do Lançamento" : "Entry Date"}
              </Label>
              <Input
                type="date"
                value={entryDate}
                onChange={(e) => setEntryDate(e.target.value)}
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-[#272727]">
                {pt ? "Responsável pelo Lançamento" : "Logged By"}
              </Label>
              <Input
                placeholder="Ex: Carlos Mendes"
                value={registeredBy}
                onChange={(e) => setRegisteredBy(e.target.value)}
              />
            </div>
          </div>

          {/* Comentário / Justificativa */}
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold text-[#272727]">
              {pt ? "Comentário / Justificativa do Resultado" : "Comments / Result Justification"}
            </Label>
            <Textarea
              placeholder={pt ? "Explique o contexto do resultado, fatores atípicos, planos de ação para recuperação caso abaixo da meta..." : "Explain factors affecting the result, corrective actions..."}
              rows={2}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
          </div>

          {/* Evidência / Anexo */}
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold text-[#272727]">
              {pt ? "Link ou Referência de Evidência (opcional)" : "Evidence Reference / Link (optional)"}
            </Label>
            <Input
              placeholder={pt ? "Ex: Relatório mensal CRM ref #84920 ou link da planilha" : "e.g. CRM report #84920 or link"}
              value={evidence}
              onChange={(e) => setEvidence(e.target.value)}
            />
          </div>

          <DialogFooter className="pt-3 border-t border-gray-100 flex justify-end gap-2">
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
              {pt ? "Salvar Medição" : "Save Measurement"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
