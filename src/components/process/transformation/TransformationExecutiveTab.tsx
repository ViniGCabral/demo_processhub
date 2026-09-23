import React from 'react';
import { TransformationScenario } from '@/types/processTransformation';
import { Badge } from '@/components/ui/badge';
import { Info, AlertTriangle, CheckCircle2, Server, Compass, ShieldAlert, Target, ShieldCheck, LineChart, TrendingUp, DollarSign, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TransformationExecutiveTabProps {
  scenario: TransformationScenario;
}

export function TransformationExecutiveTab({ scenario }: TransformationExecutiveTabProps) {
  const { executiveSummary, underutilizationAlerts } = scenario;

  return (
    <div className="space-y-6 animate-in fade-in-50 duration-200 pb-10">
      
      {/* Header Info */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border pb-4">
        <div className="flex items-center gap-6 text-xs">
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <span className="font-bold">AS-IS Base:</span> {scenario.baseContextVersion}
          </div>
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <span className="font-bold">Analisado em:</span> Hoje, 10:46
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-muted-foreground">Confiança da Recomendação:</span>
          <Badge variant="outline" className={cn(
            "text-[10px] uppercase font-bold",
            executiveSummary.recommendation.confidenceLevel.toLowerCase() === 'alto' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
            executiveSummary.recommendation.confidenceLevel.toLowerCase().includes('médio') ? 'bg-amber-50 text-amber-700 border-amber-200' :
            'bg-rose-50 text-rose-700 border-rose-200'
          )}>
            {executiveSummary.recommendation.confidenceLevel}
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        
        {/* Left Column: Diagnosis & Recommendation */}
        <div className="xl:col-span-2 space-y-6">
          {/* Recommendation Card */}
          <div className="rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-700 p-6 text-white shadow-md relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
              <Target className="w-48 h-48" />
            </div>
            
            <div className="relative z-10 space-y-4">
              <div className="flex items-center gap-2 text-violet-200">
                <Target className="h-5 w-5" />
                <h2 className="text-sm font-bold uppercase tracking-wider">Recomendação Executiva</h2>
              </div>
              
              <p className="text-lg font-medium leading-relaxed max-w-3xl">
                {executiveSummary.recommendation.recommendedChange}
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 mt-2 border-t border-white/20">
                <div>
                  <span className="block text-[10px] uppercase font-bold text-violet-200 mb-1">Benefício Principal</span>
                  <p className="text-sm font-medium">{executiveSummary.recommendation.obtainableBenefits}</p>
                </div>
                <div>
                  <span className="block text-[10px] uppercase font-bold text-amber-300 mb-1">Decisão Necessária</span>
                  <p className="text-sm font-bold text-amber-200">{executiveSummary.recommendation.executiveDecisionNeeded}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Diagnosis Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase text-muted-foreground flex items-center gap-1.5">
                <Compass className="h-4 w-4" /> Problema Central
              </h3>
              <p className="text-[13px] text-foreground leading-relaxed">
                {executiveSummary.recommendation.centralProblem}
              </p>
              <div className="pt-2">
                <span className="block text-[10px] font-bold uppercase text-muted-foreground mb-1.5">Gargalos Principais</span>
                <ul className="space-y-1.5">
                  {executiveSummary.currentSituationDetails.bottlenecks.map((b, i) => (
                    <li key={i} className="text-xs text-foreground flex items-start gap-1.5">
                      <span className="w-1 h-1 rounded-full bg-muted-foreground mt-1.5 shrink-0" />
                      <span className="leading-snug">{b}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase text-muted-foreground flex items-center gap-1.5">
                <AlertTriangle className="h-4 w-4" /> Riscos Iminentes
              </h3>
              <ul className="space-y-2">
                {executiveSummary.currentSituationDetails.risks.map((r, i) => (
                  <li key={i} className="p-2.5 rounded-lg bg-rose-50/50 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-900/50 text-xs text-rose-700 dark:text-rose-400 font-medium leading-snug">
                    {r}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Right Column: Value Opportunities */}
        <div className="space-y-4">
          <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2 border-b border-border pb-2">
            <TrendingUp className="h-4 w-4" /> Oportunidades de Valor
          </h2>
          
          <div className="space-y-3">
            {executiveSummary.valueOpportunities.map(opp => (
              <div key={opp.id} className="p-4 rounded-xl border border-border bg-card shadow-sm transition-all hover:shadow-md group">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] uppercase font-bold text-emerald-600 dark:text-emerald-400">{opp.dimension}</span>
                  <Badge variant="outline" className={cn("text-[9px] uppercase border-transparent bg-muted/50")}>
                    Confiança {opp.confidence === 'high' ? 'Alta' : opp.confidence === 'medium' ? 'Média' : 'Baixa'}
                  </Badge>
                </div>
                
                <h3 className="font-bold text-sm text-foreground leading-snug mb-3">{opp.valueLever}</h3>
                
                <div className="flex items-center gap-3 bg-muted/30 p-2.5 rounded-lg">
                  <div className="flex-1">
                    <span className="text-[9px] uppercase font-bold text-muted-foreground block mb-0.5">De (AS-IS)</span>
                    <span className={cn("text-[11px] leading-tight block", opp.baseline.includes('Não estimado') ? 'text-amber-600/80 italic' : 'text-foreground font-medium')}>
                      {opp.baseline}
                    </span>
                  </div>
                  <TrendingUp className="h-4 w-4 text-emerald-500 shrink-0 opacity-50 group-hover:opacity-100 transition-opacity" />
                  <div className="flex-1 text-right">
                    <span className="text-[9px] uppercase font-bold text-emerald-600 block mb-0.5">Para (Meta)</span>
                    <span className="text-[11px] font-bold text-foreground leading-tight block">{opp.target}</span>
                  </div>
                </div>
                
                <div className="mt-3 text-[9px] text-muted-foreground">
                  <strong>Indicador:</strong> {opp.indicator}
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      <hr className="border-border" />

      {/* Bottom Section: Adherence & Tech Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Adherence Compact List */}
        <div className="space-y-4">
          <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2 border-b border-border pb-2">
            <ShieldCheck className="h-4 w-4" /> Aderência e Governança
          </h2>
          <div className="space-y-4">
            {executiveSummary.adherenceAndGovernance.policiesMet.length > 0 && (
              <div>
                <span className="text-[11px] font-bold text-emerald-600 flex items-center gap-1.5 mb-1.5">
                  <CheckCircle2 className="h-3 w-3" /> Políticas Atendidas
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {executiveSummary.adherenceAndGovernance.policiesMet.map((p, i) => (
                    <Badge key={i} variant="outline" className="text-[10px] font-normal bg-background">{p}</Badge>
                  ))}
                </div>
              </div>
            )}
            
            {executiveSummary.adherenceAndGovernance.missingControls.length > 0 && (
              <div>
                <span className="text-[11px] font-bold text-rose-500 flex items-center gap-1.5 mb-1.5">
                  <ShieldAlert className="h-3 w-3" /> Controles Ausentes (Risco)
                </span>
                <ul className="space-y-1">
                  {executiveSummary.adherenceAndGovernance.missingControls.map((p, i) => (
                    <li key={i} className="text-[11px] text-muted-foreground">&bull; {p}</li>
                  ))}
                </ul>
              </div>
            )}

            {executiveSummary.adherenceAndGovernance.decisionsWithoutExplicitCriteria.length > 0 && (
              <div>
                <span className="text-[11px] font-bold text-amber-600 flex items-center gap-1.5 mb-1.5">
                  <Info className="h-3 w-3" /> Decisões Ad-Hoc
                </span>
                <ul className="space-y-1">
                  {executiveSummary.adherenceAndGovernance.decisionsWithoutExplicitCriteria.map((p, i) => (
                    <li key={i} className="text-[11px] text-muted-foreground">&bull; {p}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* Tech Underutilization Compact */}
        <div className="space-y-4">
          <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2 border-b border-border pb-2">
            <Server className="h-4 w-4" /> Oportunidades Tecnológicas Identificadas
          </h2>
          <div className="space-y-3">
            {underutilizationAlerts.map(alert => (
              <div key={alert.id} className="p-3.5 rounded-xl border border-amber-200/60 dark:border-amber-900/40 bg-amber-50/30 dark:bg-amber-950/10 flex gap-3">
                <div className="mt-0.5">
                  <Server className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                </div>
                <div className="flex-1 space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="text-xs font-bold text-foreground leading-snug">{alert.featureIdentified}</h3>
                    {alert.needsConfirmation && (
                      <Badge variant="outline" className="text-[9px] uppercase border-amber-300 text-amber-700 bg-amber-100/50 shrink-0 py-0 h-4">
                        A Confirmar
                      </Badge>
                    )}
                  </div>
                  <p className="text-[11px] text-muted-foreground leading-relaxed">
                    <strong className="text-foreground">Aplicação:</strong> {alert.potentialApplication}
                  </p>
                  <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
                    Benefício: {alert.potentialBenefit}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
