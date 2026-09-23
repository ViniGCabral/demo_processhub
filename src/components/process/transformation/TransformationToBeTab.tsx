import React, { useState } from 'react';
import { TransformationScenario, ToBeActivity } from '@/types/processTransformation';
import { Badge } from '@/components/ui/badge';
import { BrainCircuit, Server, User, GitBranch, Shield, Sparkles, Box, Database, ShieldCheck, ShieldAlert, ArrowRight, CornerDownRight, Layers, Columns, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface TransformationToBeTabProps {
  scenario: TransformationScenario;
}

export function TransformationToBeTab({ scenario }: TransformationToBeTabProps) {
  const { toBeActivities } = scenario;
  const [selectedActivity, setSelectedActivity] = useState<ToBeActivity | null>(null);
  const [viewMode, setViewMode] = useState<'comparison' | 'swimlanes'>('swimlanes');

  const getSwimlaneIcon = (swimlane: string) => {
    switch (swimlane) {
      case 'client': return <User className="h-3.5 w-3.5 text-slate-500" />;
      case 'person': return <User className="h-3.5 w-3.5 text-blue-500" />;
      case 'agent': return <BrainCircuit className="h-3.5 w-3.5 text-violet-500" />;
      case 'system': return <Server className="h-3.5 w-3.5 text-indigo-500" />;
      case 'integration': return <GitBranch className="h-3.5 w-3.5 text-fuchsia-500" />;
      case 'control': return <Shield className="h-3.5 w-3.5 text-amber-500" />;
      default: return <Box className="h-3.5 w-3.5 text-muted-foreground" />;
    }
  };

  const getSwimlaneLabel = (swimlane: string) => {
    const labels: Record<string, string> = {
      client: 'Cliente', person: 'Pessoa', agent: 'IA/Copiloto', system: 'Sistema', integration: 'Integração', control: 'Controle'
    };
    return labels[swimlane] || swimlane;
  };

  const swimlanesOrder = ['client', 'person', 'agent', 'system', 'integration', 'control'];
  const swimlaneStyles = {
    client: { color: 'text-slate-500', bg: 'bg-slate-50 dark:bg-slate-900/20', border: 'border-slate-200 dark:border-slate-800' },
    person: { color: 'text-blue-500', bg: 'bg-blue-50/50 dark:bg-blue-900/10', border: 'border-blue-200 dark:border-blue-900/40' },
    agent: { color: 'text-violet-600 dark:text-violet-400', bg: 'bg-violet-50/80 dark:bg-violet-900/20', border: 'border-violet-200 dark:border-violet-800' },
    system: { color: 'text-indigo-500', bg: 'bg-indigo-50/50 dark:bg-indigo-900/10', border: 'border-indigo-200 dark:border-indigo-900/40' },
    integration: { color: 'text-fuchsia-500', bg: 'bg-fuchsia-50/50 dark:bg-fuchsia-900/10', border: 'border-fuchsia-200 dark:border-fuchsia-900/40' },
    control: { color: 'text-amber-500', bg: 'bg-amber-50/50 dark:bg-amber-900/10', border: 'border-amber-200 dark:border-amber-900/40' },
  };

  const getAutonomyLabel = (level: number) => {
    const labels = {
      1: 'Humano executa',
      2: 'Copiloto recomenda',
      3: 'Agente prepara',
      4: 'Agente aprovação',
      5: 'Autonomia limites',
      6: 'Determinística',
      7: 'Sistema registra'
    };
    return labels[level as keyof typeof labels] || 'Desconhecido';
  };

  return (
    <div className="flex h-full gap-6 animate-in fade-in-50 duration-200 pb-10">
      
      {/* Main Flow Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-4">
          <div>
            <h2 className="text-lg font-bold text-foreground">Desenho Operacional (TO-BE)</h2>
            <p className="text-xs text-muted-foreground mt-0.5">Explore o fluxo contínuo ou compare com o processo original (AS-IS).</p>
          </div>
          
          <div className="flex bg-muted p-1 rounded-lg">
            <Button 
              variant={viewMode === 'swimlanes' ? 'default' : 'ghost'} 
              size="sm" 
              className="h-8 text-xs px-3 shadow-none gap-2"
              onClick={() => setViewMode('swimlanes')}
            >
              <Layers className="h-3.5 w-3.5" /> Fluxo Contínuo
            </Button>
            <Button 
              variant={viewMode === 'comparison' ? 'default' : 'ghost'} 
              size="sm" 
              className="h-8 text-xs px-3 shadow-none gap-2"
              onClick={() => setViewMode('comparison')}
            >
              <Columns className="h-3.5 w-3.5" /> Comparativo
            </Button>
          </div>
        </div>

        <div className="flex-1 overflow-auto rounded-xl border border-border bg-background p-6">
          
          {viewMode === 'comparison' ? (
            /* COMPARISON VIEW */
            <div className="min-w-[700px] max-w-4xl mx-auto">
              <div className="grid grid-cols-[1fr_60px_1.2fr] gap-4 mb-6">
                <div className="font-bold text-sm text-muted-foreground pb-2 border-b border-border">Processo AS-IS (Atual)</div>
                <div></div>
                <div className="font-bold text-sm text-primary pb-2 border-b border-border">Cenário TO-BE (Futuro)</div>
              </div>

              <div className="space-y-6">
                {toBeActivities.map((act, index) => (
                  <div key={act.id} className="grid grid-cols-[1fr_60px_1.2fr] gap-4 items-start relative">
                    {index < toBeActivities.length - 1 && (
                      <div className="absolute left-1/2 bottom-[-24px] w-px h-6 bg-border -translate-x-1/2 z-0" />
                    )}

                    <div className="p-4 rounded-xl border border-dashed border-border bg-muted/20 text-muted-foreground flex flex-col justify-center min-h-[90px] relative z-10">
                      {act.statusChange === 'new' ? (
                        <span className="text-xs italic text-center w-full">Atividade Inexistente</span>
                      ) : (
                        <>
                          <span className="text-[10px] uppercase font-bold text-muted-foreground/50 mb-1">Passo {index + 1}</span>
                          <h4 className="text-[13px] font-medium leading-snug">{act.originalActivityId || 'Atividade Original'}</h4>
                        </>
                      )}
                    </div>

                    <div className="flex items-center justify-center h-full min-h-[90px] relative z-10">
                      <ArrowRight className={cn("h-5 w-5", act.statusChange === 'new' ? "text-emerald-300" : act.statusChange === 'modified' ? "text-blue-300" : "text-muted-foreground/30")} />
                    </div>

                    <div 
                      className={cn(
                        "p-4 rounded-xl border shadow-sm transition-all cursor-pointer hover:border-primary/50 relative z-10 flex flex-col min-h-[90px]",
                        act.isHighValueMine ? "border-violet-300 dark:border-violet-700/80 shadow-violet-100 dark:shadow-none bg-white dark:bg-card ring-1 ring-violet-500/20" : "bg-card border-border",
                        selectedActivity?.id === act.id && "ring-2 ring-primary ring-offset-1 ring-offset-background",
                        act.swimlane === 'agent' && "bg-violet-50/30 dark:bg-violet-900/10 border-violet-200 dark:border-violet-800"
                      )}
                      onClick={() => setSelectedActivity(act)}
                    >
                      <div className="absolute -top-2.5 -right-2.5">
                        <Badge className={cn("text-[9px] uppercase shadow-sm h-5", 
                          act.statusChange === 'new' ? 'bg-emerald-100 text-emerald-700' :
                          act.statusChange === 'modified' ? 'bg-blue-100 text-blue-700' : 'bg-rose-100 text-rose-700'
                        )}>
                          {act.statusChange === 'new' ? 'Novo' : act.statusChange === 'modified' ? 'Transformado' : 'Removido'}
                        </Badge>
                      </div>

                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-muted text-[10px] font-medium text-foreground">
                          {getSwimlaneIcon(act.swimlane)}
                          {getSwimlaneLabel(act.swimlane)}
                        </div>
                      </div>

                      <h3 className="font-bold text-[13px] text-foreground leading-snug mb-1">{act.name}</h3>
                      
                      {act.isHighValueMine && (
                        <div className="flex items-center gap-1.5 text-violet-600 dark:text-violet-400 mt-1.5 mb-1.5">
                          <Sparkles className="h-3 w-3 shrink-0" />
                          <span className="text-[9px] font-bold uppercase tracking-wider">Jazida de Valor (Analytics)</span>
                        </div>
                      )}

                      <div className="mt-auto pt-3 flex flex-wrap gap-1.5 items-center justify-between">
                        <div className="text-[10px] text-muted-foreground flex items-center gap-1">
                          Autonomia: <strong className="text-foreground">{getAutonomyLabel(act.autonomyLevel)}</strong>
                        </div>
                        <Badge variant="outline" className="text-[9px] font-normal h-4 border-transparent text-muted-foreground">
                          Detalhes &rarr;
                        </Badge>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            /* SWIMLANES VIEW */
            <div className="space-y-4 min-w-[900px] pb-4">
              {swimlanesOrder.map(lane => {
                const laneActivities = toBeActivities.filter(a => a.swimlane === lane);
                if (laneActivities.length === 0) return null;
                const style = swimlaneStyles[lane as keyof typeof swimlaneStyles];
                const isAgent = lane === 'agent';

                return (
                  <div key={lane} className={cn("flex rounded-xl overflow-hidden border shadow-sm transition-colors", style.bg, style.border)}>
                    <div className={cn(
                      "w-12 shrink-0 flex flex-col items-center py-4 relative border-r",
                      isAgent ? "border-violet-200 dark:border-violet-800 bg-violet-100/50 dark:bg-violet-900/40" : "border-border bg-background/50"
                    )}>
                      <div className="-rotate-90 whitespace-nowrap text-[10px] font-bold uppercase tracking-widest absolute top-1/2 -translate-y-1/2 flex items-center gap-2">
                        <span className={style.color}>{getSwimlaneLabel(lane)}</span>
                      </div>
                      <div className={cn("absolute top-4", style.color)}>{getSwimlaneIcon(lane)}</div>
                    </div>
                    
                    <div className="flex-1 p-4 flex items-center gap-6 overflow-x-auto">
                      {laneActivities.map((act, index) => (
                        <React.Fragment key={act.id}>
                          <div 
                            className={cn(
                              "relative w-[280px] p-4 rounded-xl border shadow-sm shrink-0 transition-all cursor-pointer flex flex-col justify-between",
                              act.isHighValueMine ? "border-violet-300 dark:border-violet-700/80 shadow-violet-100 dark:shadow-none bg-white dark:bg-card" : "bg-card border-border",
                              selectedActivity?.id === act.id && "ring-2 ring-primary ring-offset-1 ring-offset-background",
                              isAgent && !act.isHighValueMine && "border-violet-200 dark:border-violet-800"
                            )} 
                            onClick={() => setSelectedActivity(act)}
                          >
                            <div>
                              <div className="flex items-start justify-between mb-2">
                                <Badge variant="outline" className="text-[9px] font-mono bg-muted/50 border-transparent text-muted-foreground px-1.5 h-4">
                                  {act.code}
                                </Badge>
                                {act.statusChange !== 'unchanged' && (
                                  <Badge className={cn("text-[9px] uppercase shadow-none h-4 px-1.5", 
                                    act.statusChange === 'new' ? 'bg-emerald-100 text-emerald-700' :
                                    act.statusChange === 'modified' ? 'bg-blue-100 text-blue-700' : 'bg-rose-100 text-rose-700'
                                  )}>
                                    {act.statusChange === 'new' ? 'Novo' : act.statusChange === 'modified' ? 'Modificado' : 'Removido'}
                                  </Badge>
                                )}
                              </div>

                              <h3 className="font-bold text-sm text-foreground leading-snug mb-1">{act.name}</h3>
                              
                              {act.isHighValueMine && (
                                <div className="flex items-center gap-1.5 text-violet-600 dark:text-violet-400 mt-2 p-1.5 rounded-lg bg-violet-50 dark:bg-violet-950/40 border border-violet-100 dark:border-violet-900/50">
                                  <Sparkles className="h-3 w-3 shrink-0" />
                                  <span className="text-[9px] font-bold uppercase tracking-wider">Jazida de Valor</span>
                                </div>
                              )}
                            </div>

                            <div className="mt-4 pt-3 border-t border-border/50 flex flex-wrap gap-1.5 items-center">
                              <Badge variant="outline" className="text-[9px] font-normal h-4 bg-background">
                                <strong className="mr-1">{act.autonomyLevel}:</strong> {getAutonomyLabel(act.autonomyLevel)}
                              </Badge>
                            </div>
                          </div>

                          {index < laneActivities.length - 1 && (
                            <ChevronRight className="h-5 w-5 text-muted-foreground/30 shrink-0" />
                          )}
                        </React.Fragment>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Side Panel for Activity Details */}
      <div className={cn(
        "w-[360px] shrink-0 bg-card border border-border rounded-2xl shadow-sm flex flex-col transition-all duration-300 overflow-hidden",
        selectedActivity ? "translate-x-0 opacity-100" : "translate-x-[120%] opacity-0 hidden"
      )}>
        {selectedActivity && (
          <>
            <div className="p-5 border-b border-border bg-muted/10 flex items-start justify-between">
              <div className="pr-4">
                <Badge variant="outline" className="text-[9px] font-normal mb-1.5 bg-background shadow-sm">{selectedActivity.code}</Badge>
                <h3 className="font-bold text-sm text-foreground leading-snug">{selectedActivity.name}</h3>
                <p className="text-[11px] text-muted-foreground mt-1.5 line-clamp-3 leading-relaxed">{selectedActivity.objective}</p>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setSelectedActivity(null)} className="h-6 w-6 shrink-0 text-muted-foreground hover:text-foreground">
                <Box className="h-4 w-4" />
              </Button>
            </div>

            <div className="flex-1 overflow-auto p-5 space-y-6 text-xs">
              
              <div className="space-y-2 text-[12px] leading-relaxed text-foreground">
                <span className="text-[10px] uppercase font-bold text-muted-foreground block mb-1">Como vai funcionar?</span>
                <p className="border-l-2 border-primary/50 pl-3">
                  {selectedActivity.swimlane === 'agent' 
                    ? `O Agente IA assumirá a execução desta etapa atuando no nível "${getAutonomyLabel(selectedActivity.autonomyLevel)}". Ele coletará os dados de entrada automaticamente, aplicará o modelo analítico e recomendará a ação ótima. O especialista humano intervirá apenas se a recomendação ferir as alçadas ou regras pré-configuradas.`
                    : selectedActivity.swimlane === 'system'
                    ? `O Sistema Core executará esta etapa via automação determinística ("${getAutonomyLabel(selectedActivity.autonomyLevel)}"). Não haverá intervenção humana na tabulação ou disparo, dependendo estritamente dos parâmetros configurados.`
                    : `Esta etapa permanecerá sob responsabilidade de um Humano, atuando no nível "${getAutonomyLabel(selectedActivity.autonomyLevel)}". O especialista focará em avaliar exceções, tratar ambiguidades ou aprovar as recomendações geradas pelos estágios anteriores, agregando valor onde a máquina não tem autonomia.`
                  }
                </p>
              </div>

              {selectedActivity.isHighValueMine && selectedActivity.valueMineDetails && (
                <div className="p-4 rounded-xl border border-violet-200 bg-violet-50 dark:bg-violet-950/20 dark:border-violet-900/50 space-y-3 relative overflow-hidden shadow-sm">
                  <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
                    <Sparkles className="h-16 w-16 text-violet-600" />
                  </div>
                  <div className="flex items-center gap-1.5 text-violet-700 dark:text-violet-400 font-bold text-[10px] uppercase">
                    <Sparkles className="h-3.5 w-3.5" /> Oportunidade (Jazida de Valor)
                  </div>
                  <p className="text-[11px] text-violet-950 dark:text-violet-100 font-medium leading-relaxed relative z-10">{selectedActivity.valueMineDetails.reason}</p>
                </div>
              )}

              {selectedActivity.needsAnalytics && selectedActivity.modelRequirement && (
                <div className="p-4 rounded-xl border border-blue-200 bg-blue-50 dark:bg-blue-950/20 dark:border-blue-900/50 space-y-3 relative shadow-sm">
                  <div className="flex items-center gap-1.5 text-blue-700 dark:text-blue-400 font-bold text-[10px] uppercase">
                    <BrainCircuit className="h-3.5 w-3.5" /> Motor de Inteligência (IA)
                  </div>
                  <div className="space-y-2.5 text-[11px] text-blue-950 dark:text-blue-100">
                    <div>
                      <span className="font-bold text-blue-800 dark:text-blue-300 block mb-0.5">Modelo Algorítmico:</span>
                      {selectedActivity.modelRequirement.name} <br/> <span className="opacity-80">({selectedActivity.modelRequirement.possibleModelType})</span>
                    </div>
                    <div>
                      <span className="font-bold text-blue-800 dark:text-blue-300 block mb-0.5">Pergunta Analítica Central:</span>
                      <span className="italic">"{selectedActivity.modelRequirement.questionAnswered}"</span>
                    </div>
                  </div>
                </div>
              )}

              <div className="space-y-4 pt-4 border-t border-border">
                {selectedActivity.requiredData.length > 0 && (
                  <div>
                    <span className="text-[10px] uppercase font-bold text-muted-foreground block mb-1.5 flex items-center gap-1.5"><Database className="h-3 w-3" /> Dados Ingeridos</span>
                    <div className="flex flex-wrap gap-1.5">
                      {selectedActivity.requiredData.map((d, i) => (
                        <Badge key={i} variant="outline" className="text-[10px] font-normal h-5 bg-background">{d}</Badge>
                      ))}
                    </div>
                  </div>
                )}
                
                {selectedActivity.ruleIds.length > 0 && (
                  <div>
                    <span className="text-[10px] uppercase font-bold text-muted-foreground block mb-1.5 flex items-center gap-1.5"><ShieldCheck className="h-3 w-3" /> Políticas & Regras Respeitadas</span>
                    <ul className="space-y-1.5">
                      {selectedActivity.ruleIds.map((r, i) => (
                        <li key={i} className="text-[11px] flex items-center gap-1.5 font-medium text-foreground">
                          <CornerDownRight className="h-3 w-3 text-primary" /> {r}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                
                {(selectedActivity.controls.length > 0 || selectedActivity.exceptions.length > 0) && (
                  <div className="p-3 rounded-lg bg-rose-50/50 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-900/50">
                    <span className="text-[10px] uppercase font-bold text-rose-600 dark:text-rose-400 block mb-2 flex items-center gap-1.5"><ShieldAlert className="h-3 w-3" /> Controles & Tratamento de Risco</span>
                    <ul className="space-y-1.5">
                      {selectedActivity.controls.map((c, i) => <li key={`c-${i}`} className="text-[11px] text-rose-900 dark:text-rose-200 font-medium leading-snug">&bull; {c}</li>)}
                      {selectedActivity.exceptions.map((e, i) => <li key={`e-${i}`} className="text-[11px] text-rose-600 dark:text-rose-400 font-bold leading-snug">&bull; Exceção: {e}</li>)}
                    </ul>
                  </div>
                )}
              </div>

            </div>
          </>
        )}
      </div>

    </div>
  );
}
