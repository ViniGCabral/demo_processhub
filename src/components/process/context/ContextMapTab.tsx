import React, { useState } from 'react';
import { Target, Flag, Layers, ArrowRight, Database, Server, HelpCircle, CheckCircle2, ChevronDown, ChevronUp, Sparkles, Filter, GitFork, Scale, Package } from 'lucide-react';
import { useProcessContextStore } from '@/stores/processContextStore';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';
import type { ProcessContextModel, ContextDecision } from '@/types/processContext';

interface ContextMapTabProps {
  context: ProcessContextModel;
}

export function ContextMapTab({ context }: ContextMapTabProps) {
  const { setSelectedItem, stageFilter, setStageFilter, systemFilter, setSystemFilter, setActiveSubTab } = useProcessContextStore();
  const [expandedSections, setExpandedSections] = useState<Record<string, Record<string, boolean>>>({
    'stg-1': { flow: true, data: false, decisions: true, capabilities: false },
    'stg-2': { flow: true, data: false, decisions: true, capabilities: false },
    'stg-3': { flow: true, data: false, decisions: true, capabilities: false },
    'stg-4': { flow: true, data: false, decisions: true, capabilities: false },
  });

  const toggleSection = (stageId: string, section: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [stageId]: {
        ...(prev[stageId] || {}),
        [section]: !(prev[stageId]?.[section]),
      },
    }));
  };

  const isSectionExpanded = (stageId: string, section: string) => {
    return expandedSections[stageId]?.[section] ?? false;
  };

  const filteredStages = context.stages.filter((s) => {
    if (stageFilter !== 'all' && s.id !== stageFilter) return false;
    return true;
  });

  return (
    <div className="space-y-6 animate-in fade-in-50 duration-200">
      {/* Strategic Alignment Banner */}
      <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
          <div className="space-y-1.5">
            <div className="flex items-center gap-1.5 text-primary font-bold text-[11px] tracking-wider uppercase">
              <Target className="h-3.5 w-3.5" />
              <span>Valor Pretendido (Finalidade)</span>
            </div>
            <p className="text-foreground text-xs leading-relaxed font-medium">
              {context.valueProposition}
            </p>
          </div>

          <div className="space-y-1.5 md:border-l md:border-border md:pl-6">
            <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-bold text-[11px] tracking-wider uppercase">
              <Flag className="h-3.5 w-3.5" />
              <span>Resultado Observável Esperado</span>
            </div>
            <p className="text-foreground text-xs leading-relaxed font-medium">
              {context.expectedOutcome}
            </p>
          </div>
        </div>

        {/* Stats & Filters */}
        <div className="mt-4 pt-3.5 border-t border-border flex flex-wrap items-center justify-between gap-4 text-xs">
          <div className="flex flex-wrap items-center gap-3 text-muted-foreground text-[11px]">
            <span><strong className="text-foreground">{context.stages.length}</strong> etapas</span>
            <span><strong className="text-foreground">{context.capabilities.length}</strong> capacidades</span>
            <span><strong className="text-foreground">{context.businessRules?.length || 0}</strong> regras</span>
            <span><strong className="text-foreground">{context.dataObjects.length}</strong> dados</span>
            <span><strong className="text-foreground">{context.systems.length}</strong> sistemas</span>
            {context.tShapedRecommendations.length > 0 && (
              <span className="flex items-center gap-1 text-violet-700 dark:text-violet-300 font-semibold bg-violet-50 dark:bg-violet-950/40 px-2 py-0.5 rounded-full border border-violet-200 dark:border-violet-900">
                <Sparkles className="h-3 w-3" />
                {context.tShapedRecommendations.length} focos T-shaped
              </span>
            )}
          </div>

          <div className="flex items-center gap-2.5">
            <div className="flex items-center gap-1 text-muted-foreground">
              <Filter className="h-3 w-3" />
              <span className="text-[10px] font-semibold uppercase">Filtrar:</span>
            </div>
            <Select value={stageFilter} onValueChange={setStageFilter}>
              <SelectTrigger className="h-7 w-[140px] text-xs">
                <SelectValue placeholder="Etapa" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as etapas</SelectItem>
                {context.stages.map((stg) => (
                  <SelectItem key={stg.id} value={stg.id}>
                    0{stg.order}. {stg.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={systemFilter} onValueChange={setSystemFilter}>
              <SelectTrigger className="h-7 w-[140px] text-xs">
                <SelectValue placeholder="Sistema" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os sistemas</SelectItem>
                {context.systems.map((sys) => (
                  <SelectItem key={sys.id} value={sys.id}>
                    {sys.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {(stageFilter !== 'all' || systemFilter !== 'all') && (
              <Button
                variant="ghost"
                size="sm"
                className="h-7 text-xs text-muted-foreground hover:text-foreground px-2"
                onClick={() => {
                  setStageFilter('all');
                  setSystemFilter('all');
                }}
              >
                Limpar
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-1 text-[11px] text-muted-foreground">
        <div className="flex flex-wrap items-center gap-3">
          <span className="inline-flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            API
          </span>
          <span className="inline-flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-sky-500" />
            Arquivo
          </span>
          <span className="inline-flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-amber-500" />
            Manual
          </span>
          <span className="inline-flex items-center gap-1 text-primary font-medium">
            <GitFork className="h-3 w-3" />
            Decisão
          </span>
        </div>
        <span className="italic">Clique nos nós para inspecionar detalhes.</span>
      </div>

      {/* Stages Board */}
      <div className="overflow-x-auto pb-4">
        <div className="flex gap-5 items-start min-w-[1150px]">
          {filteredStages.map((stage) => {
            const stageActivities = context.activities.filter((a) => a.stageId === stage.id);
            const stageCapabilities = context.capabilities.filter((c) => stage.capabilityIds.includes(c.id));
            const stageTShaped = context.tShapedRecommendations.filter((t) => t.stageId === stage.id);

            const stageDecisions: ContextDecision[] = [];
            stageActivities.forEach((act) => {
              act.decisions.forEach((d) => {
                if (!stageDecisions.some((sd) => sd.id === d.id)) {
                  stageDecisions.push(d);
                }
              });
            });
            if (stage.id === 'stg-4') {
              const finDecision = context.decisions?.find((d) => d.id === 'dec-fin-300');
              if (finDecision && !stageDecisions.some((sd) => sd.id === finDecision.id)) {
                stageDecisions.push(finDecision);
              }
            }

            const stageDataObjects = context.dataObjects.filter((d) =>
              stageActivities.some((a) => a.consumedDataIds.includes(d.id) || a.producedDataIds.includes(d.id))
            );

            return (
              <div
                key={stage.id}
                className="w-[340px] shrink-0 rounded-2xl border border-border bg-card shadow-sm flex flex-col transition-all hover:border-primary/30"
              >
                {/* ===== STAGE HEADER: Prominent identity block ===== */}
                <div
                  className="relative p-4 bg-gradient-to-br from-primary/8 via-card to-card border-b border-border cursor-pointer hover:from-primary/12 transition-all rounded-t-2xl"
                  onClick={() => setSelectedItem({ type: 'stage', id: stage.id })}
                >
                  {/* Order badge */}
                  <div className="flex items-center justify-between gap-2 mb-2.5">
                    <div className="flex items-center gap-2">
                      <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-primary text-primary-foreground text-xs font-bold shadow-sm">
                        0{stage.order}
                      </span>
                      <h3 className="font-bold text-sm text-foreground leading-snug">
                        {stage.name}
                      </h3>
                    </div>
                    <div className="flex items-center gap-1.5">
                      {stage.hasPendingQuestions && (
                        <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" title="Pendências" />
                      )}
                      <Badge variant="secondary" className="text-[9px] font-normal h-4">
                        {stageActivities.length} ativ.
                      </Badge>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-[11px] text-muted-foreground leading-relaxed line-clamp-2">
                    {stage.description}
                  </p>

                  {/* Deliverable highlight */}
                  {stage.externalDeliverables && stage.externalDeliverables.length > 0 && (
                    <div className="mt-2.5 flex items-start gap-1.5 text-[10px]">
                      <Package className="h-3 w-3 text-emerald-600 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider">Entrega:</span>
                        <span className="text-foreground ml-1 font-medium">{stage.externalDeliverables[0]}</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* ===== STAGE BODY: Collapsible sections ===== */}
                <div className="p-3 space-y-1 flex-1">

                  {/* ── Section: Capabilities ── */}
                  <SectionToggle
                    label="Capacidades"
                    count={stageCapabilities.length}
                    icon={<Layers className="h-3 w-3 text-primary" />}
                    isExpanded={isSectionExpanded(stage.id, 'capabilities')}
                    onToggle={() => toggleSection(stage.id, 'capabilities')}
                  />
                  {isSectionExpanded(stage.id, 'capabilities') && (
                    <div className="space-y-1.5 pl-1 pb-2">
                      {stageCapabilities.map((cap) => (
                        <div
                          key={cap.id}
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedItem({ type: 'stage', id: stage.id });
                          }}
                          className="p-2 rounded-lg border border-border/80 bg-muted/15 hover:border-primary/40 cursor-pointer transition-all text-xs"
                        >
                          <div className="flex items-center justify-between font-semibold text-primary">
                            <span className="line-clamp-1">{cap.name}</span>
                            <span className="text-[8px] text-muted-foreground uppercase font-mono">{cap.code}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* ── Section: Decisions (Optional/Discrete) ── */}
                  {stageDecisions.length > 0 && (
                    <>
                      <SectionToggle
                        label="Decisões"
                        count={stageDecisions.length}
                        icon={<GitFork className="h-3 w-3 text-primary" />}
                        isExpanded={isSectionExpanded(stage.id, 'decisions')}
                        onToggle={() => toggleSection(stage.id, 'decisions')}
                        accent
                      />
                      {isSectionExpanded(stage.id, 'decisions') && (
                        <div className="space-y-2 pl-1 pb-2">
                          {stageDecisions.map((dec) => {
                            const linkedRule = context.businessRules?.find(
                              (r) => r.decisionId === dec.id || r.id === dec.associatedBusinessRuleId
                            );

                            return (
                              <div
                                key={dec.id}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedItem({ type: 'decision', id: dec.id });
                                }}
                                className="p-2.5 rounded-xl border border-primary/20 bg-gradient-to-br from-primary/5 to-card hover:border-primary/40 cursor-pointer transition-all space-y-1.5"
                              >
                                <div className="flex items-start justify-between gap-1.5">
                                  <span className="text-[11px] font-bold text-foreground leading-snug line-clamp-2">
                                    {dec.question}
                                  </span>
                                  {dec.authorityThreshold && (
                                    <Badge variant="outline" className="text-[9px] h-4 bg-primary/10 text-primary border-primary/20 shrink-0">
                                      {dec.authorityThreshold}
                                    </Badge>
                                  )}
                                </div>

                                <div className="grid grid-cols-2 gap-1">
                                  {dec.possibleOutcomes.slice(0, 2).map((outcome, oIdx) => (
                                    <div
                                      key={oIdx}
                                      className={cn(
                                        "p-1 rounded text-[10px] font-medium truncate text-center border",
                                        oIdx === 0
                                          ? "bg-emerald-50/80 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800"
                                          : "bg-amber-50/80 text-amber-700 dark:bg-amber-950/30 dark:text-amber-300 border-amber-200 dark:border-amber-800"
                                      )}
                                    >
                                      {outcome}
                                    </div>
                                  ))}
                                </div>

                                {linkedRule && (
                                  <div className="pt-1 border-t border-border/50 flex items-center justify-between text-[10px] text-muted-foreground">
                                    <span className="flex items-center gap-1 font-mono truncate">
                                      <Scale className="h-3 w-3 text-primary shrink-0" />
                                      {linkedRule.code}
                                    </span>
                                    <span className="text-primary font-semibold">&rarr;</span>
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </>
                  )}

                  {/* ── Section: T-Shaped Focus ── */}
                  {stageTShaped.length > 0 && (
                    <div className="p-2.5 rounded-xl border border-violet-300 dark:border-violet-800/60 bg-violet-50/50 dark:bg-violet-950/20 my-1">
                      <div className="flex items-center justify-between gap-1 mb-1">
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-violet-700 dark:text-violet-300">
                          <Sparkles className="h-3 w-3" />
                          Foco T-Shaped
                        </span>
                        <Badge variant="outline" className="text-[8px] h-3.5 text-violet-600 dark:text-violet-300 border-violet-300 dark:border-violet-700 font-normal">
                          Investigar
                        </Badge>
                      </div>
                      {stageTShaped.map((t) => (
                        <p
                          key={t.id}
                          className="text-[11px] font-semibold text-foreground hover:text-violet-700 dark:hover:text-violet-300 transition-colors leading-snug cursor-pointer"
                          onClick={() => setSelectedItem({ type: 't_shaped', id: t.id })}
                        >
                          {t.title}
                        </p>
                      ))}
                    </div>
                  )}

                  {/* ── Section: Operational Flow ── */}
                  <SectionToggle
                    label="Fluxo Operacional"
                    count={stageActivities.length}
                    isExpanded={isSectionExpanded(stage.id, 'flow')}
                    onToggle={() => toggleSection(stage.id, 'flow')}
                  />
                  {isSectionExpanded(stage.id, 'flow') && (
                    <div className="space-y-1.5 pl-1 pb-2">
                      {stageActivities.map((act) => {
                        const actSystems = context.systems.filter((s) => act.systemIds.includes(s.id));

                        return (
                          <div
                            key={act.id}
                            onClick={() => setSelectedItem({ type: 'stage', id: stage.id })}
                            className="p-2 rounded-lg border border-border bg-card hover:border-primary/40 cursor-pointer transition-all space-y-1"
                          >
                            <div className="flex items-start gap-1.5 justify-between">
                              <div>
                                <span className="text-[9px] font-mono text-muted-foreground font-semibold">{act.code}</span>
                                <p className="text-[11px] font-medium text-foreground leading-snug">{act.name}</p>
                              </div>
                              <Badge variant="outline" className="text-[8px] h-3.5 font-normal shrink-0">
                                {act.validationStatus}
                              </Badge>
                            </div>

                            <div className="flex flex-wrap gap-1">
                              {actSystems.map((s) => (
                                <span
                                  key={s.id}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setSelectedItem({ type: 'system', id: s.id });
                                  }}
                                  className="inline-flex items-center gap-0.5 text-[9px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground hover:text-foreground border border-border"
                                >
                                  <Server className="h-2.5 w-2.5 text-primary" />
                                  {s.name}
                                </span>
                              ))}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* ── Section: Data & Files ── */}
                  <SectionToggle
                    label="Dados e Arquivos"
                    count={stageDataObjects.length}
                    icon={<Database className="h-3 w-3 text-primary" />}
                    isExpanded={isSectionExpanded(stage.id, 'data')}
                    onToggle={() => toggleSection(stage.id, 'data')}
                  />
                  {isSectionExpanded(stage.id, 'data') && (
                    <div className="space-y-1 pl-1 pb-2">
                      {stageDataObjects.map((data) => (
                        <div
                          key={data.id}
                          onClick={() => setSelectedItem({ type: 'data', id: data.id })}
                          className="p-1.5 rounded-lg border border-border/80 bg-card hover:border-primary/40 cursor-pointer transition-all flex items-center justify-between text-[11px]"
                        >
                          <div className="flex items-center gap-2 min-w-0">
                            <span className={cn(
                              "w-2 h-2 rounded-full shrink-0",
                              data.transferMechanism === 'direct_api' ? "bg-emerald-500" :
                              data.transferMechanism === 'file_export_import' ? "bg-sky-500" : "bg-amber-500"
                            )} />
                            <span className="truncate font-medium text-foreground">{data.name}</span>
                          </div>
                          <span className="text-[9px] text-muted-foreground shrink-0 pl-1 font-mono">
                            {data.transferMechanism === 'manual' ? 'Manual' :
                             data.transferMechanism === 'direct_api' ? 'API' : 'Arquivo'}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* ──────────────── Reusable Section Toggle Header ──────────────── */
interface SectionToggleProps {
  label: string;
  count: number;
  icon?: React.ReactNode;
  isExpanded: boolean;
  onToggle: () => void;
  accent?: boolean;
}

function SectionToggle({ label, count, icon, isExpanded, onToggle, accent }: SectionToggleProps) {
  return (
    <button
      onClick={onToggle}
      className={cn(
        "w-full flex items-center justify-between px-2 py-1.5 rounded-lg transition-all text-[10px] uppercase font-bold tracking-wider",
        accent
          ? "text-primary hover:bg-primary/5"
          : "text-muted-foreground hover:bg-muted/30"
      )}
    >
      <span className="flex items-center gap-1.5">
        {icon}
        {label}
        <span className="text-[9px] font-normal lowercase">({count})</span>
      </span>
      {isExpanded ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
    </button>
  );
}
