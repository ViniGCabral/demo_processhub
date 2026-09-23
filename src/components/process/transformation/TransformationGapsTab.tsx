import React, { useState } from 'react';
import { TransformationScenario, FoundationalGap } from '@/types/processTransformation';
import { Badge } from '@/components/ui/badge';
import { ShieldAlert, AlertTriangle, Info, CheckCircle2, ChevronDown, ChevronRight, User, Link as LinkIcon, Activity } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface TransformationGapsTabProps {
  scenario: TransformationScenario;
}

export function TransformationGapsTab({ scenario }: TransformationGapsTabProps) {
  const { foundationalGaps } = scenario;
  const [expandedGaps, setExpandedGaps] = useState<Set<string>>(new Set());

  const toggleGap = (id: string) => {
    const next = new Set(expandedGaps);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setExpandedGaps(next);
  };

  const getCriticalityIcon = (crit: string) => {
    switch (crit) {
      case 'blocker': return <ShieldAlert className="h-4 w-4 text-rose-500" />;
      case 'critical': return <AlertTriangle className="h-4 w-4 text-amber-500" />;
      case 'relevant': return <Info className="h-4 w-4 text-blue-500" />;
      default: return <Info className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getCriticalityLabel = (crit: string) => {
    switch (crit) {
      case 'blocker': return 'Bloqueador';
      case 'critical': return 'Crítico';
      case 'relevant': return 'Relevante';
      default: return crit;
    }
  };

  const blockersCount = foundationalGaps.filter(g => g.criticality === 'blocker').length;
  const criticalCount = foundationalGaps.filter(g => g.criticality === 'critical').length;
  const relevantCount = foundationalGaps.filter(g => g.criticality === 'relevant').length;

  return (
    <div className="space-y-6 animate-in fade-in-50 duration-200 pb-10">
      
      {/* Summary Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-foreground">Gaps Fundacionais</h2>
          <p className="text-xs text-muted-foreground mt-0.5">Dependências estruturais para viabilização do desenho TO-BE.</p>
        </div>
        
        <div className="flex bg-card border border-border p-1.5 rounded-lg gap-1.5 text-xs">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-rose-50 dark:bg-rose-900/20 text-rose-700 dark:text-rose-400 font-medium">
            <ShieldAlert className="h-3.5 w-3.5" /> {blockersCount} Bloqueadores
          </div>
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 font-medium">
            <AlertTriangle className="h-3.5 w-3.5" /> {criticalCount} Críticos
          </div>
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 font-medium">
            <Info className="h-3.5 w-3.5" /> {relevantCount} Relevantes
          </div>
        </div>
      </div>

      {/* Rich Table Layout */}
      <div className="border border-border rounded-xl bg-card overflow-hidden shadow-sm">
        
        {/* Table Header */}
        <div className="grid grid-cols-12 gap-4 p-4 border-b border-border bg-muted/30 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
          <div className="col-span-5 md:col-span-4 pl-6">Gap Identificado</div>
          <div className="col-span-3 hidden md:block">Criticidade & Tipo</div>
          <div className="col-span-4 md:col-span-3">Iniciativa Afetada</div>
          <div className="col-span-3 md:col-span-2 text-right">Responsável</div>
        </div>

        {/* Table Body */}
        <div className="divide-y divide-border">
          {foundationalGaps.map(gap => {
            const isExpanded = expandedGaps.has(gap.id);
            return (
              <div key={gap.id} className={cn(
                "transition-colors group",
                isExpanded ? "bg-muted/10" : "hover:bg-muted/5",
                gap.criticality === 'blocker' && isExpanded && "bg-rose-50/30 dark:bg-rose-950/10"
              )}>
                {/* Row */}
                <div 
                  className="grid grid-cols-12 gap-4 p-4 items-center cursor-pointer"
                  onClick={() => toggleGap(gap.id)}
                >
                  <div className="col-span-5 md:col-span-4 flex items-center gap-3">
                    <button className="text-muted-foreground hover:text-foreground shrink-0 focus:outline-none">
                      {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                    </button>
                    <div className="flex flex-col gap-0.5">
                      <span className={cn(
                        "font-bold text-sm leading-snug",
                        gap.criticality === 'blocker' ? 'text-rose-700 dark:text-rose-400' : 'text-foreground'
                      )}>{gap.title}</span>
                      <span className="text-[10px] text-muted-foreground font-mono md:hidden">{getCriticalityLabel(gap.criticality)}</span>
                    </div>
                  </div>
                  
                  <div className="col-span-3 hidden md:flex items-center gap-2">
                    {getCriticalityIcon(gap.criticality)}
                    <span className={cn(
                      "text-xs font-medium",
                      gap.criticality === 'blocker' ? 'text-rose-700 dark:text-rose-400' :
                      gap.criticality === 'critical' ? 'text-amber-700 dark:text-amber-400' : 'text-blue-700 dark:text-blue-400'
                    )}>
                      {getCriticalityLabel(gap.criticality)}
                    </span>
                    <Badge variant="outline" className="text-[9px] uppercase font-normal ml-2">{gap.type}</Badge>
                  </div>
                  
                  <div className="col-span-4 md:col-span-3">
                    <div className="flex items-center gap-1.5 text-xs font-medium text-foreground">
                      <Activity className="h-3.5 w-3.5 text-muted-foreground" />
                      <span className="truncate" title={gap.affectedInitiative}>{gap.affectedInitiative}</span>
                    </div>
                  </div>
                  
                  <div className="col-span-3 md:col-span-2 text-right">
                    <div className="flex items-center justify-end gap-1.5 text-xs text-muted-foreground">
                      <User className="h-3.5 w-3.5" />
                      <span className="truncate">{gap.responsible}</span>
                    </div>
                  </div>
                </div>

                {/* Expanded Detail */}
                {isExpanded && (
                  <div className="px-10 pb-5 pt-1 animate-in slide-in-from-top-2 duration-200">
                    <div className={cn(
                      "grid grid-cols-1 md:grid-cols-2 gap-6 p-5 rounded-xl border",
                      gap.criticality === 'blocker' ? "bg-rose-50/50 border-rose-200 dark:bg-rose-950/20 dark:border-rose-900/50" : "bg-card border-border shadow-sm"
                    )}>
                      
                      <div className="space-y-4 text-xs">
                        <div>
                          <span className="text-[10px] font-bold uppercase text-muted-foreground block mb-1">Impacto (Se não resolvido)</span>
                          <p className="text-foreground leading-relaxed">{gap.impactIfNotResolved}</p>
                        </div>
                        {gap.affectedToBeElementId && (
                          <div className="pt-2 border-t border-border/50">
                            <Button variant="outline" size="sm" className="h-7 text-[10px] gap-1.5 bg-background border-border shadow-none hover:bg-muted">
                              <LinkIcon className="h-3 w-3" /> Ver Detalhes no TO-BE ({gap.affectedToBeElementId})
                            </Button>
                          </div>
                        )}
                      </div>
                      
                      <div className="space-y-4 text-xs">
                        <div>
                          <span className="text-[10px] font-bold uppercase text-emerald-600 dark:text-emerald-400 block mb-1">Ação Recomendada</span>
                          <p className="font-medium text-foreground leading-relaxed">{gap.recommendedAction}</p>
                        </div>
                        <div className="flex items-start gap-2 p-2.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/40">
                          <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                          <div>
                            <span className="text-[10px] font-bold uppercase text-emerald-700 dark:text-emerald-400 block mb-0.5">Critério de Conclusão</span>
                            <p className="text-emerald-900 dark:text-emerald-200 font-medium">{gap.completionCriteria}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 pt-2">
                          <span className="text-[10px] font-bold uppercase text-muted-foreground">Esforço Estimado:</span>
                          <Badge variant="outline" className="text-[10px] font-medium h-5 uppercase bg-background">{gap.estimatedEffort}</Badge>
                        </div>
                      </div>

                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
