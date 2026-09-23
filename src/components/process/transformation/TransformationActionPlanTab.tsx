import React from 'react';
import { TransformationScenario } from '@/types/processTransformation';
import { Badge } from '@/components/ui/badge';
import { Layers, CheckCircle2, Clock, Calendar, User, ShieldAlert } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TransformationActionPlanTabProps {
  scenario: TransformationScenario;
}

export function TransformationActionPlanTab({ scenario }: TransformationActionPlanTabProps) {
  const { actionPlanWaves } = scenario;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'planned': return 'bg-slate-100 text-slate-700 border-slate-300 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700';
      case 'in_progress': return 'bg-blue-100 text-blue-700 border-blue-300 dark:bg-blue-900/40 dark:text-blue-300 dark:border-blue-800';
      case 'completed': return 'bg-emerald-100 text-emerald-700 border-emerald-300 dark:bg-emerald-900/40 dark:text-emerald-300 dark:border-emerald-800';
      case 'blocked': return 'bg-rose-100 text-rose-700 border-rose-300 dark:bg-rose-900/40 dark:text-rose-300 dark:border-rose-800';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'planned': return 'Planejado';
      case 'in_progress': return 'Em andamento';
      case 'completed': return 'Concluído';
      case 'blocked': return 'Bloqueado';
      default: return status;
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in-50 duration-200 pb-10">
      <div>
        <h2 className="text-lg font-bold text-foreground">Plano de Ação</h2>
        <p className="text-xs text-muted-foreground mt-0.5">Iniciativas de implantação organizadas em ondas iterativas, derivando dos gaps estruturais identificados.</p>
      </div>

      <div className="space-y-6 relative before:absolute before:inset-0 before:ml-[1.125rem] before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-border before:to-transparent">
        {actionPlanWaves.map((wave) => (
          <div key={wave.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
            
            {/* Timeline dot */}
            <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-background bg-primary shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
              <Layers className="h-4 w-4 text-primary-foreground" />
            </div>

            {/* Wave Card */}
            <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-5 rounded-2xl border border-border bg-card shadow-sm transition-all hover:shadow-md">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-base text-primary">{wave.name}</h3>
                <Badge variant="outline" className="text-[10px] font-normal uppercase tracking-wider bg-background">
                  {wave.actions.length} ações
                </Badge>
              </div>

              <div className="space-y-4">
                {wave.actions.map(action => (
                  <div key={action.id} className="p-4 rounded-xl border border-border bg-muted/10 space-y-3 transition-colors hover:bg-muted/20">
                    <div className="flex items-start justify-between gap-3">
                      <p className="text-sm font-bold text-foreground leading-snug">{action.objective}</p>
                      <Badge variant="outline" className={cn("text-[9px] font-medium uppercase shrink-0", getStatusColor(action.status))}>
                        {getStatusLabel(action.status)}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-[11px]">
                      <div>
                        <span className="text-[9px] uppercase font-bold text-muted-foreground block mb-0.5">Benefício</span>
                        <span className="text-emerald-600 dark:text-emerald-400 font-medium line-clamp-2">{action.benefit}</span>
                      </div>
                      <div>
                        <span className="text-[9px] uppercase font-bold text-muted-foreground block mb-0.5">Critério de Sucesso</span>
                        <span className="text-foreground flex items-start gap-1">
                          <CheckCircle2 className="h-3.5 w-3.5 shrink-0 mt-0.5 text-emerald-500" />
                          <span className="line-clamp-2">{action.successCriteria}</span>
                        </span>
                      </div>
                    </div>

                    {/* Gap Resolution Link */}
                    {action.resolvesGapId && (
                      <div className="pt-2 border-t border-border/50 text-[10px] flex items-center gap-1.5 text-amber-600 dark:text-amber-500 font-medium">
                        <ShieldAlert className="h-3.5 w-3.5" />
                        Resolve Gap Fundacional: {action.resolvesGapId}
                      </div>
                    )}

                    <div className="pt-2 flex flex-wrap items-center gap-3 text-[10px] text-muted-foreground">
                      <div className="flex items-center gap-1 bg-background px-1.5 py-0.5 rounded border border-border">
                        <User className="h-3 w-3" /> {action.responsible}
                      </div>
                      <div className="flex items-center gap-1 bg-background px-1.5 py-0.5 rounded border border-border">
                        <Calendar className="h-3 w-3" /> {action.estimatedTimeframe}
                      </div>
                      <div className="flex items-center gap-1 bg-background px-1.5 py-0.5 rounded border border-border">
                        <Clock className="h-3 w-3" /> <span className="uppercase font-bold">{action.effort}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        ))}
      </div>
    </div>
  );
}
