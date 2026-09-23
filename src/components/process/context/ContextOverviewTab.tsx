import React from 'react';
import { ClipboardCheck, FileText, Scale, AlertTriangle, ArrowRight, CheckCircle2, Clock, Sparkles } from 'lucide-react';
import { useProcessContextStore } from '@/stores/processContextStore';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import type { ContextSpecData } from '@/types/processContext';

interface ContextOverviewTabProps {
  specData: ContextSpecData;
  processId: string;
}

export function ContextOverviewTab({ specData, processId }: ContextOverviewTabProps) {
  const { setActiveMainTab } = useProcessContextStore();

  const totalGaps = specData.gaps.length;
  const openGaps = specData.gaps.filter((g) => g.status === 'open' || g.status === 'reopened' || g.status === 'awaiting_response').length;
  const confirmedGaps = specData.gaps.filter((g) => g.status === 'confirmed').length;
  const totalRFs = specData.functionalRequirements.length;
  const confirmedRFs = specData.functionalRequirements.filter((rf) => rf.validationStatus === 'confirmed').length;
  const totalRNs = specData.businessRules.length;
  const confirmedRNs = specData.businessRules.filter((rn) => rn.status === 'confirmed').length;

  const totalItems = totalGaps + totalRFs + totalRNs;
  const confirmedItems = confirmedGaps + confirmedRFs + confirmedRNs;
  const validationPercent = totalItems > 0 ? Math.round((confirmedItems / totalItems) * 100) : 0;

  const highImpactGaps = specData.gaps.filter((g) => g.impact === 'high' && g.status !== 'confirmed' && g.status !== 'rejected' && g.status !== 'not_applicable');

  const getStatusMessage = () => {
    if (openGaps === 0) {
      return 'Todas as pendências foram resolvidas. A especificação está pronta para revisão final.';
    }
    if (openGaps === 1) {
      return 'A análise do processo foi concluída. Existe 1 ponto que precisa da sua confirmação antes da finalização da especificação.';
    }
    return `A análise do processo foi concluída. Existem ${openGaps} pontos que precisam da sua confirmação antes da finalização da especificação.`;
  };

  const getStatusBadge = () => {
    if (openGaps === 0) return { label: 'Pronto para revisão', color: 'bg-emerald-500' };
    if (highImpactGaps.length > 0) return { label: 'Ação necessária', color: 'bg-amber-500' };
    return { label: 'Em andamento', color: 'bg-blue-500' };
  };

  const statusBadge = getStatusBadge();

  return (
    <div className="space-y-6 animate-in fade-in-50 duration-300">
      {/* Main Status Banner */}
      <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-5">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-3">
              <span className={cn("w-2.5 h-2.5 rounded-full", statusBadge.color)} />
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                {statusBadge.label}
              </span>
              <Badge variant="outline" className="text-[10px] font-normal ml-1">
                {specData.specification.version}
              </Badge>
            </div>

            <h2 className="text-lg font-bold text-foreground leading-snug mb-2">
              {specData.processName}
            </h2>

            <p className="text-sm text-muted-foreground leading-relaxed max-w-2xl">
              {getStatusMessage()}
            </p>

            {highImpactGaps.length > 0 && (
              <div className="mt-3 flex items-start gap-2 p-3 rounded-xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800">
                <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                <div className="text-xs">
                  <span className="font-semibold text-amber-800 dark:text-amber-300">
                    {highImpactGaps.length} pendência{highImpactGaps.length > 1 ? 's' : ''} de alto impacto
                  </span>
                  <span className="text-amber-700 dark:text-amber-400 ml-1">
                    — {highImpactGaps.length === 1 ? 'afeta' : 'afetam'} diretamente requisitos e regras críticas.
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Progress Ring */}
          <div className="flex flex-col items-center gap-2 shrink-0">
            <div className="relative w-24 h-24">
              <svg className="w-24 h-24 -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="42" stroke="currentColor" strokeWidth="6" fill="none" className="text-muted/40" />
                <circle
                  cx="50" cy="50" r="42"
                  stroke="currentColor" strokeWidth="6" fill="none"
                  strokeDasharray={`${validationPercent * 2.64} ${264 - validationPercent * 2.64}`}
                  strokeLinecap="round"
                  className="text-primary transition-all duration-700"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-xl font-bold text-foreground">{validationPercent}%</span>
                <span className="text-[9px] text-muted-foreground uppercase font-medium">validado</span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-5 pt-4 border-t border-border flex flex-wrap gap-3">
          {openGaps > 0 && (
            <Button
              onClick={() => setActiveMainTab('validation')}
              className="gap-2 text-sm"
              size="sm"
            >
              <ClipboardCheck className="h-4 w-4" />
              Continuar revisão
              <Badge variant="secondary" className="ml-1 bg-white/20 text-white text-[10px]">
                {openGaps}
              </Badge>
              <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          )}
          <Button
            variant="outline"
            size="sm"
            className="gap-2 text-sm"
            onClick={() => setActiveMainTab('specification')}
          >
            <FileText className="h-4 w-4" />
            Ver especificação
            <ArrowRight className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Pendências */}
        <button
          onClick={() => setActiveMainTab('validation')}
          className="rounded-2xl border border-border bg-card p-5 shadow-sm text-left hover:border-primary/40 transition-all group"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-950/40 flex items-center justify-center">
              <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400" />
            </div>
            <ArrowRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
          <div className="text-2xl font-bold text-foreground">{openGaps}</div>
          <div className="text-xs text-muted-foreground mt-0.5">Pendências abertas</div>
          <div className="mt-2 w-full h-1 rounded-full bg-muted overflow-hidden">
            <div
              className="h-full bg-amber-500 transition-all duration-500"
              style={{ width: `${totalGaps > 0 ? ((totalGaps - openGaps) / totalGaps) * 100 : 100}%` }}
            />
          </div>
          <div className="text-[10px] text-muted-foreground mt-1">{confirmedGaps} de {totalGaps} resolvidas</div>
        </button>

        {/* Requisitos Funcionais */}
        <button
          onClick={() => {
            setActiveMainTab('specification');
          }}
          className="rounded-2xl border border-border bg-card p-5 shadow-sm text-left hover:border-primary/40 transition-all group"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-950/40 flex items-center justify-center">
              <FileText className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <ArrowRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
          <div className="text-2xl font-bold text-foreground">{totalRFs}</div>
          <div className="text-xs text-muted-foreground mt-0.5">Requisitos funcionais</div>
          <div className="mt-2 w-full h-1 rounded-full bg-muted overflow-hidden">
            <div
              className="h-full bg-blue-500 transition-all duration-500"
              style={{ width: `${totalRFs > 0 ? (confirmedRFs / totalRFs) * 100 : 0}%` }}
            />
          </div>
          <div className="text-[10px] text-muted-foreground mt-1">{confirmedRFs} de {totalRFs} confirmados</div>
        </button>

        {/* Regras de Negócio */}
        <button
          onClick={() => {
            setActiveMainTab('specification');
          }}
          className="rounded-2xl border border-border bg-card p-5 shadow-sm text-left hover:border-primary/40 transition-all group"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-violet-100 dark:bg-violet-950/40 flex items-center justify-center">
              <Scale className="h-5 w-5 text-violet-600 dark:text-violet-400" />
            </div>
            <ArrowRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
          <div className="text-2xl font-bold text-foreground">{totalRNs}</div>
          <div className="text-xs text-muted-foreground mt-0.5">Regras de negócio</div>
          <div className="mt-2 w-full h-1 rounded-full bg-muted overflow-hidden">
            <div
              className="h-full bg-violet-500 transition-all duration-500"
              style={{ width: `${totalRNs > 0 ? (confirmedRNs / totalRNs) * 100 : 0}%` }}
            />
          </div>
          <div className="text-[10px] text-muted-foreground mt-1">{confirmedRNs} de {totalRNs} confirmadas</div>
        </button>

        {/* Etapas */}
        <button
          onClick={() => {
            setActiveMainTab('specification');
          }}
          className="rounded-2xl border border-border bg-card p-5 shadow-sm text-left hover:border-primary/40 transition-all group"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950/40 flex items-center justify-center">
              <Sparkles className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
            </div>
            <ArrowRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
          <div className="text-2xl font-bold text-foreground">{specData.macroStages.length}</div>
          <div className="text-xs text-muted-foreground mt-0.5">Macroetapas do processo</div>
          <div className="mt-2 flex flex-wrap gap-1">
            {specData.macroStages.map((s) => (
              <Badge key={s.id} variant="outline" className="text-[9px] font-normal h-4">
                0{s.order}. {s.name.split(' ').slice(0, 2).join(' ')}
              </Badge>
            ))}
          </div>
        </button>
      </div>

      {/* Spec Status + Next Steps */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Specification Status */}
        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <h3 className="text-sm font-bold text-foreground">Status da Especificação</h3>
            <Badge
              variant="outline"
              className={cn(
                "text-[10px]",
                specData.specification.status === 'approved' && "text-emerald-600 border-emerald-300",
                specData.specification.status === 'in_validation' && "text-blue-600 border-blue-300",
                specData.specification.status === 'draft' && "text-muted-foreground",
              )}
            >
              {specData.specification.status === 'in_validation' ? 'Em validação' :
               specData.specification.status === 'approved' ? 'Aprovada' :
               specData.specification.status === 'draft' ? 'Rascunho' :
               specData.specification.status}
            </Badge>
          </div>

          <div className="space-y-2 text-xs text-muted-foreground">
            <div className="flex items-center justify-between">
              <span>Versão</span>
              <span className="font-medium text-foreground">{specData.specification.version}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Última atualização</span>
              <span className="font-medium text-foreground">{specData.specification.lastUpdatedAt}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Atualizado por</span>
              <span className="font-medium text-foreground">{specData.specification.lastUpdatedBy}</span>
            </div>
          </div>
        </div>

        {/* What's next */}
        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <h3 className="text-sm font-bold text-foreground mb-3">Próximos passos</h3>
          <div className="space-y-2.5">
            {openGaps > 0 ? (
              <>
                <NextStepItem
                  icon={<ClipboardCheck className="h-4 w-4" />}
                  text={`Resolver ${openGaps} pendência${openGaps > 1 ? 's' : ''} aberta${openGaps > 1 ? 's' : ''}`}
                  status="current"
                  onClick={() => setActiveMainTab('validation')}
                />
                <NextStepItem
                  icon={<FileText className="h-4 w-4" />}
                  text="Revisar requisitos e regras atualizadas"
                  status="pending"
                />
                <NextStepItem
                  icon={<CheckCircle2 className="h-4 w-4" />}
                  text="Aprovar especificação final"
                  status="pending"
                />
              </>
            ) : (
              <>
                <NextStepItem
                  icon={<ClipboardCheck className="h-4 w-4" />}
                  text="Todas as pendências resolvidas"
                  status="done"
                />
                <NextStepItem
                  icon={<FileText className="h-4 w-4" />}
                  text="Revisar requisitos e regras atualizadas"
                  status="current"
                  onClick={() => setActiveMainTab('specification')}
                />
                <NextStepItem
                  icon={<CheckCircle2 className="h-4 w-4" />}
                  text="Aprovar especificação final"
                  status="pending"
                />
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Next Step Item ──
interface NextStepItemProps {
  icon: React.ReactNode;
  text: string;
  status: 'done' | 'current' | 'pending';
  onClick?: () => void;
}

function NextStepItem({ icon, text, status, onClick }: NextStepItemProps) {
  return (
    <button
      onClick={onClick}
      disabled={!onClick}
      className={cn(
        "w-full flex items-center gap-3 p-2.5 rounded-xl text-left text-xs transition-all",
        status === 'current' && "bg-primary/5 border border-primary/20 text-foreground font-medium hover:bg-primary/10",
        status === 'done' && "text-emerald-600 dark:text-emerald-400",
        status === 'pending' && "text-muted-foreground opacity-60",
      )}
    >
      <div className={cn(
        "w-7 h-7 rounded-lg flex items-center justify-center shrink-0",
        status === 'current' && "bg-primary text-primary-foreground",
        status === 'done' && "bg-emerald-100 dark:bg-emerald-950/40 text-emerald-600",
        status === 'pending' && "bg-muted text-muted-foreground",
      )}>
        {status === 'done' ? <CheckCircle2 className="h-4 w-4" /> : icon}
      </div>
      <span>{text}</span>
      {status === 'current' && onClick && <ArrowRight className="h-3.5 w-3.5 ml-auto" />}
    </button>
  );
}
