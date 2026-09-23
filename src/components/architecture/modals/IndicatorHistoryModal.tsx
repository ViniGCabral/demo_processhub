import React, { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { BusinessIndicator, IndicatorMeasurement } from "@/types/architectureContextTypes";
import { useIndicatorStore } from "@/stores/indicatorStore";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  History, 
  TrendingUp, 
  TrendingDown, 
  Minus, 
  Calendar, 
  AlertCircle, 
  CheckCircle2, 
  Clock, 
  Edit3, 
  Plus, 
  FileText,
  ExternalLink
} from "lucide-react";
import { toast } from "sonner";

interface IndicatorHistoryModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  indicator: BusinessIndicator | null;
  onLogNewMeasurement?: () => void;
}

export function IndicatorHistoryModal({
  open,
  onOpenChange,
  indicator: initialIndicator,
  onLogNewMeasurement,
}: IndicatorHistoryModalProps) {
  const { language } = useLanguage();
  const pt = language === "PT";
  const { editMeasurement, indicators } = useIndicatorStore();

  const indicator = indicators.find((i) => i.id === initialIndicator?.id) || initialIndicator;

  const [editingMeas, setEditingMeas] = useState<IndicatorMeasurement | null>(null);
  const [editValue, setEditValue] = useState("");
  const [editReason, setEditReason] = useState("");
  const [editComment, setEditComment] = useState("");

  if (!indicator) return null;

  const getPeriod = (m?: Partial<IndicatorMeasurement> | null) =>
    (m?.referencePeriod || m?.period || "").trim();

  const measurements = indicator.measurements || [];
  const sortedMeasurements = [...measurements].sort((a, b) =>
    getPeriod(b).localeCompare(getPeriod(a))
  );

  // Determine status color and text
  const getPerformanceBadge = (status: string) => {
    switch (status) {
      case "dentro_da_meta":
        return {
          bg: "bg-emerald-50 text-emerald-700 border-emerald-200",
          text: pt ? "Meta atingida" : "Target reached",
          icon: <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
        };
      case "atencao":
        return {
          bg: "bg-amber-50 text-amber-700 border-amber-200",
          text: pt ? "Atenção" : "Attention",
          icon: <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
        };
      case "fora_da_meta":
        return {
          bg: "bg-rose-50 text-rose-700 border-rose-200",
          text: pt ? "Fora da meta" : "Off target",
          icon: <AlertCircle className="w-3.5 h-3.5 text-rose-600" />
        };
      default:
        return {
          bg: "bg-gray-100 text-gray-700 border-gray-200",
          text: pt ? "Sem dados" : "No data",
          icon: <Minus className="w-3.5 h-3.5 text-gray-500" />
        };
    }
  };

  const getUpdateStatusBadge = (updateStatus?: string) => {
    switch (updateStatus) {
      case "atualizado":
        return {
          bg: "bg-emerald-100/70 text-emerald-800 border-emerald-300",
          text: pt ? "Atualizado" : "Updated"
        };
      case "proximo_vencimento":
        return {
          bg: "bg-amber-100/70 text-amber-800 border-amber-300",
          text: pt ? "Próximo do vencimento" : "Near deadline"
        };
      case "pendente":
        return {
          bg: "bg-amber-100/70 text-amber-800 border-amber-300",
          text: pt ? "Atualização pendente" : "Pending update"
        };
      case "em_atraso":
        return {
          bg: "bg-rose-100/80 text-rose-800 border-rose-300",
          text: pt ? "Em atraso" : "Delayed"
        };
      case "sem_medicao":
      default:
        return {
          bg: "bg-slate-100 text-slate-700 border-slate-300",
          text: pt ? "Sem medição" : "No measurement"
        };
    }
  };

  const perfBadge = getPerformanceBadge(indicator.status);
  const updBadge = getUpdateStatusBadge(indicator.updateStatus);

  // Parse numeric values for chart
  const cleanNum = (strVal: string | number | undefined) => {
    if (typeof strVal === "number") return isNaN(strVal) ? 0 : strVal;
    if (!strVal) return 0;
    const match = strVal.toString().replace(",", ".").match(/[-+]?[0-9]*\.?[0-9]+/);
    return match ? parseFloat(match[0]) : 0;
  };

  const targetNum = cleanNum(indicator.target);
  const chartPoints = [...measurements].sort((a, b) =>
    getPeriod(a).localeCompare(getPeriod(b))
  );

  // Compute SVG chart metrics
  const numValues = chartPoints
    .map((p) => cleanNum(p.measuredValue))
    .filter((n) => !isNaN(n));
  const minVal = numValues.length > 0 ? Math.min(...numValues, targetNum, 0) : 0;
  const maxVal = numValues.length > 0 ? Math.max(...numValues, targetNum, 100) * 1.15 : 100;
  const range = maxVal - minVal || 1;

  const chartW = 720;
  const chartH = 180;
  const padX = 55;
  const padY = 25;

  const getX = (idx: number) => {
    if (chartPoints.length <= 1) return chartW / 2;
    return padX + (idx / (chartPoints.length - 1)) * (chartW - 2 * padX);
  };

  const getY = (val: number) => {
    return chartH - padY - ((val - minVal) / range) * (chartH - 2 * padY);
  };

  const targetY = getY(targetNum);

  const polylinePoints = chartPoints
    .map((p, idx) => `${getX(idx)},${getY(cleanNum(p.measuredValue))}`)
    .join(" ");

  // Handle open correction dialog
  const handleStartEdit = (m: IndicatorMeasurement) => {
    setEditingMeas(m);
    setEditValue(String(m.measuredValue));
    setEditReason(m.correctionReason || "");
    setEditComment(m.comment || "");
  };

  const handleSaveCorrection = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingMeas) return;

    if (!editReason.trim()) {
      toast.error(pt ? "Informe a justificativa/motivo da correção" : "Please provide correction reason");
      return;
    }

    if (editValue === "" || isNaN(Number(editValue.replace(",", ".")))) {
      toast.error(pt ? "Informe um valor numérico válido" : "Please enter a valid numeric value");
      return;
    }

    editMeasurement(indicator.id, editingMeas.id, {
      measuredValue: editValue.trim(),
      correctionReason: editReason.trim(),
      comment: editComment.trim() || undefined,
    });

    toast.success(pt ? "Medição corrigida com sucesso!" : "Measurement corrected successfully!");
    setEditingMeas(null);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[92vh] overflow-y-auto">
        <DialogHeader className="flex flex-row items-center justify-between border-b pb-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <History className="w-5 h-5 text-[#0C1BA8]" />
              <DialogTitle className="text-xl font-bold text-[#272727]">
                {indicator.name}
              </DialogTitle>
            </div>
            <p className="text-xs text-slate-500">
              {indicator.objective || (pt ? "Histórico de medições e governança" : "Measurement history & governance")}
            </p>
          </div>

          {onLogNewMeasurement && indicator.valueSource !== "consolidado" && (
            <Button
              size="sm"
              onClick={() => {
                onOpenChange(false);
                onLogNewMeasurement();
              }}
              className="bg-[#0C1BA8] hover:bg-[#04223D] text-white text-xs flex items-center gap-1.5 shrink-0"
            >
              <Plus className="w-3.5 h-3.5" />
              {pt ? "Lançar Medição" : "Log Measurement"}
            </Button>
          )}
        </DialogHeader>

        {/* Resumo de Métricas no Topo */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2.5 py-2">
          {/* Valor Atual */}
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-2.5">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">
              {pt ? "Valor Atual" : "Current Value"}
            </span>
            <div className="text-lg font-bold text-[#272727] mt-0.5">
              {indicator.currentValue}
              {indicator.unit && !indicator.currentValue.includes(indicator.unit) ? (
                <span className="text-xs font-normal text-slate-500 ml-1">{indicator.unit}</span>
              ) : null}
            </div>
          </div>

          {/* Meta */}
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-2.5">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">
              {pt ? "Meta" : "Target"}
            </span>
            <div className="text-lg font-bold text-[#0C1BA8] mt-0.5">
              {indicator.target}
            </div>
          </div>

          {/* Tendência */}
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-2.5">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">
              {pt ? "Variação" : "Trend"}
            </span>
            <div className="flex items-center gap-1 text-sm font-semibold mt-1">
              {indicator.trend === "up" && (
                <span className="text-emerald-600 flex items-center gap-0.5">
                  <TrendingUp className="w-4 h-4" /> {pt ? "Evolução" : "Up"}
                </span>
              )}
              {indicator.trend === "down" && (
                <span className="text-rose-600 flex items-center gap-0.5">
                  <TrendingDown className="w-4 h-4" /> {pt ? "Queda" : "Down"}
                </span>
              )}
              {indicator.trend === "stable" && (
                <span className="text-slate-600 flex items-center gap-0.5">
                  <Minus className="w-4 h-4" /> {pt ? "Estável" : "Stable"}
                </span>
              )}
            </div>
          </div>

          {/* Status de Desempenho */}
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-2.5">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">
              {pt ? "Desempenho" : "Performance"}
            </span>
            <div className="mt-1">
              <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold border ${perfBadge.bg}`}>
                {perfBadge.icon}
                {perfBadge.text}
              </span>
            </div>
          </div>

          {/* Status de Atualização */}
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-2.5">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">
              {pt ? "Status Atualização" : "Update Status"}
            </span>
            <div className="mt-1">
              <span className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold border ${updBadge.bg}`}>
                {updBadge.text}
              </span>
            </div>
          </div>

          {/* Última Medição */}
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-2.5">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">
              {pt ? "Última Medição" : "Last Entry"}
            </span>
            <div className="text-xs font-semibold text-slate-700 mt-1 flex items-center gap-1">
              <Clock className="w-3 h-3 text-slate-400" />
              {indicator.lastMeasurementPeriod || indicator.lastMeasurementDate || (pt ? "Pendente" : "Pending")}
            </div>
          </div>

          {/* Próxima Medição */}
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-2.5">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">
              {pt ? "Próxima Medição" : "Next Entry"}
            </span>
            <div className="text-xs font-semibold text-slate-700 mt-1 flex items-center gap-1">
              <Calendar className="w-3 h-3 text-slate-400" />
              {indicator.nextExpectedMeasurement || "10/10/2026"}
            </div>
          </div>
        </div>

        {/* Gráfico de Linha da Evolução */}
        <div className="border border-slate-200 rounded-xl p-4 bg-white shadow-sm space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-slate-700 uppercase tracking-wide">
              {pt ? "Evolução Histórica das Medições" : "Measurement History Evolution"}
            </span>
            <div className="flex items-center gap-4 text-[11px]">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-0.5 bg-[#0C1BA8] rounded"></span>
                <span className="text-slate-600">{pt ? "Valor Realizado" : "Measured Value"}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-0.5 bg-rose-500 border-t border-dashed border-rose-500"></span>
                <span className="text-slate-600">{pt ? `Meta (${indicator.target})` : `Target (${indicator.target})`}</span>
              </div>
            </div>
          </div>

          {chartPoints.length === 0 ? (
            <div className="h-40 flex items-center justify-center text-xs text-slate-400">
              {pt ? "Nenhuma medição registrada até o momento." : "No measurements recorded yet."}
            </div>
          ) : (
            <div className="relative overflow-x-auto">
              <svg viewBox={`0 0 ${chartW} ${chartH}`} className="w-full h-44 text-xs select-none">
                {/* Grid horizontal lines */}
                <line x1={padX} y1={padY} x2={chartW - padX} y2={padY} stroke="#f1f5f9" strokeWidth="1" />
                <line x1={padX} y1={chartH / 2} x2={chartW - padX} y2={chartH / 2} stroke="#f1f5f9" strokeWidth="1" />
                <line x1={padX} y1={chartH - padY} x2={chartW - padX} y2={chartH - padY} stroke="#e2e8f0" strokeWidth="1" />

                {/* Target Line (Dashed) */}
                {targetNum > 0 && (
                  <g>
                    <line
                      x1={padX}
                      y1={targetY}
                      x2={chartW - padX}
                      y2={targetY}
                      stroke="#f43f5e"
                      strokeWidth="1.5"
                      strokeDasharray="4,4"
                    />
                    <text x={chartW - padX + 6} y={targetY + 4} fill="#f43f5e" fontSize="10" fontWeight="bold">
                      {indicator.target}
                    </text>
                  </g>
                )}

                {/* Measured Value Polyline */}
                {chartPoints.length > 1 && (
                  <polyline
                    fill="none"
                    stroke="#0C1BA8"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    points={polylinePoints}
                  />
                )}

                {/* Points & Tooltip labels */}
                {chartPoints.map((p, idx) => {
                  const cx = getX(idx);
                  const cy = getY(cleanNum(p.measuredValue));
                  const isLast = idx === chartPoints.length - 1;
                  return (
                    <g key={p.id || idx} className="cursor-pointer group">
                      <circle
                        cx={cx}
                        cy={cy}
                        r={isLast ? 5 : 4}
                        fill={isLast ? "#0C1BA8" : "#ffffff"}
                        stroke="#0C1BA8"
                        strokeWidth="2.5"
                        className="transition-all hover:r-6"
                      />
                      {/* Value label */}
                      <text
                        x={cx}
                        y={cy - 8}
                        textAnchor="middle"
                        fill="#1e293b"
                        fontSize="10"
                        fontWeight="600"
                      >
                        {p.measuredValue}{indicator.unit || ""}
                      </text>
                      {/* Period label on X-axis */}
                      <text
                        x={cx}
                        y={chartH - 6}
                        textAnchor="middle"
                        fill="#64748b"
                        fontSize="10"
                      >
                        {getPeriod(p)}
                      </text>
                    </g>
                  );
                })}
              </svg>
            </div>
          )}
        </div>

        {/* Tabela de Medições com Auditoria e Ação de Correção */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
              <FileText className="w-4 h-4 text-[#0C1BA8]" />
              {pt ? "Registro de Medições e Auditoria" : "Measurement Records & Audit Log"}
            </h4>
            <span className="text-xs text-slate-500">
              {pt ? `${measurements.length} registro(s)` : `${measurements.length} record(s)`}
            </span>
          </div>

          <div className="border border-slate-200 rounded-lg overflow-hidden">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-600 border-b border-slate-200 font-semibold text-[11px]">
                  <th className="py-2.5 px-3">{pt ? "Período" : "Period"}</th>
                  <th className="py-2.5 px-3">{pt ? "Valor Medido" : "Value"}</th>
                  <th className="py-2.5 px-3">{pt ? "Lançamento" : "Logged On"}</th>
                  <th className="py-2.5 px-3">{pt ? "Responsável" : "Logged By"}</th>
                  <th className="py-2.5 px-3">{pt ? "Justificativa / Comentário" : "Comments"}</th>
                  <th className="py-2.5 px-3">{pt ? "Evidência" : "Evidence"}</th>
                  <th className="py-2.5 px-3 text-right">{pt ? "Ação" : "Action"}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {sortedMeasurements.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-6 text-center text-slate-400">
                      {pt ? "Nenhum histórico registrado." : "No records found."}
                    </td>
                  </tr>
                ) : (
                  sortedMeasurements.map((m) => (
                    <tr key={m.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-2.5 px-3 font-semibold text-slate-900">
                        {getPeriod(m)}
                      </td>
                      <td className="py-2.5 px-3 font-bold text-[#0C1BA8]">
                        {m.measuredValue} {indicator.unit || ""}
                        {m.correctedAt && (
                          <span className="block text-[9px] text-amber-700 font-normal">
                            {pt ? `(Corrigido em ${m.correctedAt})` : `(Corrected)`}
                          </span>
                        )}
                      </td>
                      <td className="py-2.5 px-3 text-slate-500 whitespace-nowrap">
                        {m.registeredAt || m.entryDate || "-"}
                      </td>
                      <td className="py-2.5 px-3 whitespace-nowrap text-slate-700">
                        {m.registeredBy || "-"}
                      </td>
                      <td className="py-2.5 px-3 max-w-[220px]">
                        <p className="line-clamp-2 text-slate-600">
                          {m.comment || "-"}
                        </p>
                        {m.correctionReason && (
                          <p className="text-[10px] text-amber-800 bg-amber-50 p-1 rounded mt-1 border border-amber-200">
                            <strong>{pt ? "Motivo correção: " : "Reason: "}</strong>
                            {m.correctionReason}
                          </p>
                        )}
                      </td>
                      <td className="py-2.5 px-3 text-slate-500 max-w-[140px] truncate">
                        {m.evidence ? (
                          <span className="inline-flex items-center gap-1 text-[#0C1BA8] hover:underline cursor-pointer" title={m.evidence}>
                            <ExternalLink className="w-3 h-3 shrink-0" />
                            <span className="truncate">{m.evidence}</span>
                          </span>
                        ) : (
                          "-"
                        )}
                      </td>
                      <td className="py-2.5 px-3 text-right">
                        {indicator.valueSource !== "consolidado" && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleStartEdit(m)}
                            className="h-7 px-2 text-xs text-slate-600 hover:text-[#0C1BA8] hover:bg-blue-50"
                            title={pt ? "Corrigir medição" : "Correct measurement"}
                          >
                            <Edit3 className="w-3.5 h-3.5 mr-1" />
                            {pt ? "Corrigir" : "Edit"}
                          </Button>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal / Dialog de Correção de Medição */}
        {editingMeas && (
          <Dialog open={!!editingMeas} onOpenChange={() => setEditingMeas(null)}>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle className="text-base font-bold text-[#272727] flex items-center gap-2">
                  <Edit3 className="w-4 h-4 text-[#0C1BA8]" />
                  {pt ? `Corrigir Medição (${getPeriod(editingMeas)})` : `Correct Measurement (${getPeriod(editingMeas)})`}
                </DialogTitle>
              </DialogHeader>

              <form onSubmit={handleSaveCorrection} className="space-y-3 py-2">
                <div className="space-y-1">
                  <Label className="text-xs font-semibold text-[#272727]">
                    {pt ? "Valor Corrigido *" : "Corrected Value *"}
                  </Label>
                  <Input
                    type="text"
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-1">
                  <Label className="text-xs font-semibold text-[#272727]">
                    {pt ? "Motivo da Correção (Obrigatório) *" : "Correction Reason (Required) *"}
                  </Label>
                  <Textarea
                    placeholder={pt ? "Ex: Ajuste decorrente de recálculo retroativo de faturas..." : "Explain why this value is being corrected..."}
                    rows={2}
                    value={editReason}
                    onChange={(e) => setEditReason(e.target.value)}
                    required
                  />
                  <span className="text-[10px] text-slate-500">
                    {pt ? "Ficará registrado na trilha de auditoria do indicador." : "Will be saved to audit trail."}
                  </span>
                </div>

                <div className="space-y-1">
                  <Label className="text-xs font-semibold text-[#272727]">
                    {pt ? "Novo Comentário / Observação (Opcional)" : "New Comment (Optional)"}
                  </Label>
                  <Input
                    value={editComment}
                    onChange={(e) => setEditComment(e.target.value)}
                  />
                </div>

                <div className="pt-3 flex justify-end gap-2 border-t">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setEditingMeas(null)}
                  >
                    {pt ? "Cancelar" : "Cancel"}
                  </Button>
                  <Button
                    type="submit"
                    size="sm"
                    className="bg-[#0C1BA8] hover:bg-[#04223D] text-white"
                  >
                    {pt ? "Salvar Correção" : "Save Correction"}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        )}
      </DialogContent>
    </Dialog>
  );
}
