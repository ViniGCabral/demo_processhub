import { BaseIndicator, IndicatorStatus, IndicatorValueSource, IndicatorUpdateStatus } from "@/types/architectureContextTypes";
import { cn } from "@/lib/utils";
import { 
  TrendingUp, 
  TrendingDown, 
  Minus, 
  Info, 
  Pencil, 
  Trash2, 
  History, 
  PlusCircle, 
  AlertCircle,
  Clock
} from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { AreaChart, Area, ResponsiveContainer, Tooltip } from "recharts";

export type IndicatorBadgeOrigin = 'proprio' | 'consolidado' | 'operacional' | 'jornada' | 'contexto';

interface IndicatorCardProps {
  indicator: BaseIndicator;
  aggregationRule?: string;
  originBadge?: IndicatorBadgeOrigin;
  consolidatedInfo?: string;
  scopeLabel?: string;
  onEdit?: () => void;
  onDelete?: () => void;
  onViewHistory?: () => void;
  onLogMeasurement?: () => void;
}

export function IndicatorCard({ 
  indicator, 
  aggregationRule, 
  originBadge,
  consolidatedInfo,
  scopeLabel,
  onEdit, 
  onDelete,
  onViewHistory,
  onLogMeasurement
}: IndicatorCardProps) {
  const { language } = useLanguage();
  const pt = language === "PT";

  const getOriginBadgeConfig = (origin?: IndicatorBadgeOrigin) => {
    switch (origin) {
      case 'proprio':
        return {
          label: pt ? 'Próprio' : 'Own',
          classes: 'bg-indigo-50 text-indigo-700 border-indigo-200'
        };
      case 'consolidado':
        return {
          label: pt ? 'Consolidado' : 'Consolidated',
          classes: 'bg-purple-50 text-purple-700 border-purple-200'
        };
      case 'operacional':
        return {
          label: pt ? 'Operacional' : 'Operational',
          classes: 'bg-emerald-50 text-emerald-700 border-emerald-200'
        };
      case 'jornada':
        return {
          label: pt ? 'Jornada' : 'Journey',
          classes: 'bg-amber-50 text-amber-800 border-amber-200'
        };
      case 'contexto':
        return {
          label: pt ? 'Contexto' : 'Context',
          classes: 'bg-blue-50 text-blue-700 border-blue-200'
        };
      default:
        return null;
    }
  };

  const getStatusColor = (status: IndicatorStatus) => {
    switch (status) {
      case 'dentro_da_meta': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'atencao': return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'critico': 
      case 'fora_da_meta': return 'bg-rose-50 text-rose-700 border-rose-200';
      case 'sem_dados': return 'bg-gray-100 text-gray-700 border-gray-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getStatusLabel = (status: IndicatorStatus) => {
    switch (status) {
      case 'dentro_da_meta': return pt ? 'Meta Atingida' : 'On Target';
      case 'atencao': return pt ? 'Atenção' : 'Warning';
      case 'critico': 
      case 'fora_da_meta': return pt ? 'Fora da Meta' : 'Off Target';
      case 'sem_dados': return pt ? 'Sem Dados' : 'No Data';
      default: return status;
    }
  };

  const getUpdateStatusBadge = (status?: IndicatorUpdateStatus) => {
    switch (status) {
      case "atualizado":
        return {
          label: pt ? "Atualizado" : "Updated",
          classes: "bg-emerald-50 text-emerald-700 border-emerald-200",
        };
      case "proximo_vencimento":
        return {
          label: pt ? "Próx. vencimento" : "Near deadline",
          classes: "bg-amber-50 text-amber-700 border-amber-200",
        };
      case "pendente":
        return {
          label: pt ? "Atualização pendente" : "Pending update",
          classes: "bg-amber-100 text-amber-800 border-amber-300",
        };
      case "em_atraso":
        return {
          label: pt ? "Em atraso" : "Delayed",
          classes: "bg-rose-100 text-rose-800 border-rose-300 font-bold",
        };
      case "sem_medicao":
      default:
        return {
          label: pt ? "Sem medição" : "No measurement",
          classes: "bg-slate-100 text-slate-600 border-slate-200",
        };
    }
  };

  const getSourceLabel = (source: IndicatorValueSource) => {
    switch (source) {
      case 'proprio': return pt ? 'Próprio' : 'Own';
      case 'consolidado': return pt ? 'Consolidado' : 'Consolidated';
      case 'herdado': return pt ? 'Herdado' : 'Inherited';
      case 'estimado': return pt ? 'Estimado' : 'Estimated';
      case 'nao_agregavel': return pt ? 'Não Agregável' : 'Non-aggregable';
      default: return source;
    }
  };

  // Min-max for sparkline normalization using measurements or measurementHistory
  const cleanNum = (strVal: string | number | undefined) => {
    if (typeof strVal === "number") return isNaN(strVal) ? 0 : strVal;
    if (!strVal) return 0;
    const match = strVal.toString().replace(",", ".").match(/[-+]?[0-9]*\.?[0-9]+/);
    return match ? parseFloat(match[0]) : 0;
  };

  const chartData = (indicator.measurements && indicator.measurements.length > 0)
    ? indicator.measurements.map((m, idx) => ({
        name: m.referencePeriod || m.period || `P${idx}`,
        value: cleanNum(m.measuredValue)
      }))
    : (indicator.measurementHistory || []).map((h, idx) => ({
        name: h.date || `P${idx}`,
        value: cleanNum(h.value)
      }));

  const chartPoints = chartData.map(d => d.value);
  const min = chartPoints.length > 0 ? Math.min(...chartPoints, 0) : 0;
  const max = chartPoints.length > 0 ? Math.max(...chartPoints, 100) : 100;
  
  const renderSparkline = () => {
    if (chartData.length === 0) return null;
    
    const strokeColor = indicator.trend === 'up' ? '#10b981' : indicator.trend === 'down' ? '#f43f5e' : '#94a3b8';
    const firstPeriod = chartData[0]?.name;
    const lastPeriod = chartData[chartData.length - 1]?.name;

    return (
      <div className="flex flex-col gap-1 items-end w-[120px]">
        <div className="h-[40px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 5, right: 0, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id={`color-${indicator.id || 'spark'}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={strokeColor} stopOpacity={0.3} />
                  <stop offset="95%" stopColor={strokeColor} stopOpacity={0} />
                </linearGradient>
              </defs>
              <Tooltip 
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="rounded-lg border bg-white px-2 py-1 shadow-sm text-[10px]">
                        <span className="font-semibold text-slate-700">{payload[0].payload.name}</span>: <span className="font-bold text-slate-900">{payload[0].value}</span>
                      </div>
                    )
                  }
                  return null;
                }}
                cursor={{ stroke: '#cbd5e1', strokeWidth: 1, strokeDasharray: '3 3' }}
              />
              <Area 
                type="monotone" 
                dataKey="value" 
                stroke={strokeColor} 
                strokeWidth={2}
                fillOpacity={1} 
                fill={`url(#color-${indicator.id || 'spark'})`} 
                isAnimationActive={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className="flex justify-between w-full text-[8px] text-[#A5A7B0] font-medium mt-0.5 px-1">
          <span>{firstPeriod}</span>
          <span>{lastPeriod}</span>
        </div>
      </div>
    );
  };

  const originConfig = getOriginBadgeConfig(originBadge);
  const updateBadge = getUpdateStatusBadge(indicator.updateStatus);
  const isConsolidated = indicator.valueSource === 'consolidado';

  const formatAggregationRule = (rule?: string) => {
    if (!rule) return null;
    const clean = rule.replace('_', ' ');
    if (clean === 'soma') return pt ? 'Regra: soma' : 'Rule: sum';
    if (clean === 'media ponderada') return pt ? 'Regra: média ponderada' : 'Rule: weighted avg';
    if (clean === 'percentual recalculado') return pt ? 'Regra: percentual recalculado' : 'Rule: recalculated %';
    if (clean === 'maior valor') return pt ? 'Regra: maior valor' : 'Rule: max value';
    return `${pt ? 'Regra:' : 'Rule:'} ${clean}`;
  };

  return (
    <div className="bg-white border border-[#A5A7B0]/25 rounded-lg p-4 shadow-sm flex flex-col justify-between h-full min-h-[255px] hover:border-[#0C1BA8]/40 hover:shadow-md transition-all">
      
      {/* Top badges & Title */}
      <div>
        <div className="flex items-center justify-between gap-1.5 mb-2 flex-wrap">
          <div className="flex items-center gap-1.5 flex-wrap">
            {originConfig ? (
              <span className={cn("text-[9px] font-bold px-2 py-0.5 rounded-sm border uppercase tracking-wider", originConfig.classes)}>
                {originConfig.label}
              </span>
            ) : (
              <span className="text-[9px] font-bold px-2 py-0.5 rounded-sm border uppercase tracking-wider bg-blue-50 text-blue-700 border-blue-100">
                {getSourceLabel(indicator.valueSource)}
              </span>
            )}
            {scopeLabel && (
              <span className="text-[9px] text-[#6B7280] font-medium truncate max-w-[130px]" title={scopeLabel}>
                {scopeLabel}
              </span>
            )}
          </div>

          <div className="flex items-center gap-1">
            {/* Update Status Badge */}
            <span 
              className={cn("text-[9px] font-semibold px-1.5 py-0.5 rounded border tracking-wide", updateBadge.classes)}
              title={pt ? "Status de atualização do indicador" : "Update status"}
            >
              {updateBadge.label}
            </span>

            {/* Performance Status Badge */}
            <span className={cn("text-[9px] font-bold px-1.5 py-0.5 rounded border shrink-0 uppercase tracking-wide", getStatusColor(indicator.status))}>
              {getStatusLabel(indicator.status)}
            </span>
          </div>
        </div>

        <h4 className="font-bold text-[#272727] text-sm leading-tight pr-1 line-clamp-1" title={indicator.name}>
          {indicator.name}
        </h4>
        <p className="text-xs text-[#6B7280] mt-1 mb-2 line-clamp-2" title={indicator.objective}>
          {indicator.objective}
        </p>

        {consolidatedInfo && (
          <div className="mb-2 px-2 py-1 bg-purple-50/70 border border-purple-100 rounded text-[10px] text-purple-800 font-medium flex items-center gap-1">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-purple-500 shrink-0" />
            <span className="truncate">{consolidatedInfo}</span>
          </div>
        )}

        {/* Delay or Pending Notice Box */}
        {(indicator.updateStatus === "em_atraso" || indicator.updateStatus === "pendente") && (
          <div className="mb-2.5 px-2 py-1.5 rounded text-[10px] border flex items-center gap-1.5 bg-amber-50/90 border-amber-200 text-amber-900">
            <Clock className="w-3.5 h-3.5 text-amber-600 shrink-0" />
            <span className="truncate font-medium">
              {indicator.delayNotice || (
                indicator.updateStatus === "em_atraso" 
                  ? (pt ? "Medição do período anterior ainda não registrada" : "Previous period measurement overdue")
                  : (pt ? "Atualização esperada nos próximos dias" : "Update expected soon")
              )}
            </span>
          </div>
        )}
      </div>

      {/* Main Metrics & Sparkline */}
      <div className="flex items-end justify-between mb-3 pb-3 border-b border-gray-100">
        <div>
          <span className="text-[10px] font-bold text-[#A5A7B0] uppercase block mb-1">
            {indicator.periodicity}
          </span>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-bold text-[#272727]">{indicator.currentValue}</span>
            <span className="text-sm font-semibold text-[#6B7280]">{indicator.unit !== 'BRL' && indicator.unit !== '%' ? indicator.unit : ''}</span>
            {indicator.trend === 'up' && <TrendingUp className="h-4 w-4 ml-1 text-emerald-600" />}
            {indicator.trend === 'down' && <TrendingDown className="h-4 w-4 ml-1 text-rose-600" />}
            {indicator.trend === 'stable' && <Minus className="h-4 w-4 ml-1 text-gray-400" />}
          </div>
          <div className="text-[11px] text-[#A5A7B0] font-medium mt-0.5">
            {pt ? "Meta: " : "Target: "} <span className="font-semibold text-slate-700">{indicator.target}</span>
          </div>
        </div>
        <div>
          {renderSparkline()}
        </div>
      </div>

      {/* Action Buttons Row */}
      <div className="flex items-center justify-between gap-1.5 pt-1">
        <div className="flex items-center gap-1.5 flex-1 min-w-0">
          {/* Action 1: Ver Histórico */}
          <Button
            variant="outline"
            size="sm"
            onClick={onViewHistory}
            className="h-7 px-2 text-[11px] font-medium text-slate-700 hover:text-[#0C1BA8] hover:bg-blue-50/70 border-slate-200 flex items-center gap-1 shrink-0"
            title={pt ? "Ver histórico detalhado e evolução" : "View history & evolution"}
          >
            <History className="w-3.5 h-3.5 text-[#0C1BA8]" />
            <span>{pt ? "Histórico" : "History"}</span>
          </Button>

          {/* Action 2: Lançar Medição */}
          {isConsolidated ? (
            <div 
              className="h-7 px-2 text-[10px] text-purple-700 bg-purple-50/70 border border-purple-200 rounded flex items-center gap-1 truncate max-w-[130px] cursor-help"
              title={pt ? "Atualização automática a partir das medições de origem" : "Auto updated from source measurements"}
            >
              <Info className="w-3 h-3 shrink-0" />
              <span className="truncate">{pt ? "Consolidado" : "Consolidated"}</span>
            </div>
          ) : (
            <Button
              size="sm"
              onClick={onLogMeasurement}
              className="h-7 px-2 text-[11px] font-medium bg-[#0C1BA8] hover:bg-[#04223D] text-white flex items-center gap-1 shrink-0"
              title={pt ? "Lançar nova medição periódica" : "Log measurement"}
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>{pt ? "Medição" : "Log"}</span>
            </Button>
          )}
        </div>

        {/* Action 3: Editar Definição e Outras Ações */}
        <div className="flex items-center gap-1 shrink-0">
          {onEdit && (
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => { e.stopPropagation(); onEdit(); }}
              className="h-7 w-7 p-0 text-slate-400 hover:text-[#0C1BA8] hover:bg-slate-100"
              title={pt ? "Editar definição do indicador" : "Edit definition"}
            >
              <Pencil className="h-3.5 w-3.5" />
            </Button>
          )}

          {onDelete && (
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => { e.stopPropagation(); onDelete(); }}
              className="h-7 w-7 p-0 text-slate-400 hover:text-red-600 hover:bg-red-50"
              title={pt ? "Excluir indicador" : "Delete indicator"}
            >
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          )}

          {indicator.formula && (
            <div className="group relative">
              <Info className="h-3.5 w-3.5 text-slate-400 hover:text-[#0C1BA8] cursor-help ml-0.5" />
              <div className="absolute right-0 bottom-full mb-2 hidden group-hover:block w-52 bg-slate-900 text-white text-[10px] p-2 rounded shadow-lg z-30 pointer-events-none">
                <span className="font-bold block mb-1">{pt ? "Fórmula:" : "Formula:"}</span>
                {indicator.formula}
              </div>
            </div>
          )}
        </div>
      </div>

    </div>
  );
}
