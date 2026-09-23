import React from 'react';
import { X, FileText, Scale, AlertTriangle, CheckCircle2, Clock, ArrowRight, ChevronRight, Link2 } from 'lucide-react';
import { useProcessContextStore } from '@/stores/processContextStore';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import type { ContextSpecData, FunctionalRequirement, BusinessRuleSpec, ContextGap, SpecItemStatus, GapStatus } from '@/types/processContext';

interface ContextSpecDetailDrawerProps {
  specData: ContextSpecData;
}

function getSpecStatusLabel(status: SpecItemStatus): string {
  const labels: Record<SpecItemStatus, string> = {
    draft: 'Rascunho',
    in_validation: 'Em validação',
    confirmed: 'Confirmado',
    pending_gap: 'Pendente de GAP',
    updated: 'Atualizado',
    deprecated: 'Depreciado',
  };
  return labels[status];
}

function getSpecStatusColor(status: SpecItemStatus): string {
  const colors: Record<SpecItemStatus, string> = {
    draft: 'text-gray-600 border-gray-300',
    in_validation: 'text-blue-600 border-blue-300',
    confirmed: 'text-emerald-600 border-emerald-300',
    pending_gap: 'text-amber-600 border-amber-300',
    updated: 'text-sky-600 border-sky-300',
    deprecated: 'text-red-600 border-red-300',
  };
  return colors[status];
}

function getGapStatusLabel(status: GapStatus): string {
  const labels: Record<GapStatus, string> = {
    open: 'Aberto', awaiting_response: 'Aguardando', answered: 'Respondido',
    in_review: 'Em revisão', confirmed: 'Confirmado', rejected: 'Rejeitado',
    not_applicable: 'N/A', reopened: 'Reaberto',
  };
  return labels[status];
}

export function ContextSpecDetailDrawer({ specData }: ContextSpecDetailDrawerProps) {
  const { selectedSpecItem, isSpecDrawerOpen, closeSpecDrawer, setActiveMainTab, setSelectedSpecItem } = useProcessContextStore();

  if (!isSpecDrawerOpen || !selectedSpecItem) return null;

  const { type, id } = selectedSpecItem;

  let content: React.ReactNode = null;
  let title = '';
  let icon: React.ReactNode = null;

  if (type === 'rf') {
    const rf = specData.functionalRequirements.find((r) => r.id === id);
    if (!rf) return null;
    title = `${rf.id} — ${rf.title}`;
    icon = <FileText className="h-4 w-4 text-blue-500" />;
    const stage = specData.macroStages.find((s) => s.id === rf.relatedStageId);

    content = (
      <div className="space-y-5 text-sm">
        <div className="flex items-center gap-2">
          <Badge variant="outline" className={cn("text-[10px]", getSpecStatusColor(rf.validationStatus))}>
            {getSpecStatusLabel(rf.validationStatus)}
          </Badge>
          {stage && (
            <Badge variant="secondary" className="text-[10px]">
              0{stage.order}. {stage.name}
            </Badge>
          )}
        </div>

        <Section title="Descrição">
          <p className="text-xs text-foreground leading-relaxed">{rf.description}</p>
        </Section>

        <Section title="Objetivo">
          <p className="text-xs text-foreground leading-relaxed">{rf.objective}</p>
        </Section>

        <Section title="Ator / Perfil">
          <p className="text-xs text-foreground">{rf.actor}</p>
        </Section>

        <div className="grid grid-cols-2 gap-3">
          <Section title="Entradas">
            <ul className="list-disc list-inside text-xs text-muted-foreground space-y-0.5">
              {rf.inputs.map((input, i) => <li key={i}>{input}</li>)}
            </ul>
          </Section>
          <Section title="Saída Esperada">
            <p className="text-xs text-muted-foreground">{rf.expectedOutput}</p>
          </Section>
        </div>

        {rf.exceptions.length > 0 && (
          <Section title="Exceções">
            <ul className="list-disc list-inside text-xs text-muted-foreground space-y-0.5">
              {rf.exceptions.map((exc, i) => <li key={i}>{exc}</li>)}
            </ul>
          </Section>
        )}

        {rf.acceptanceCriteria.length > 0 && (
          <Section title="Critérios de Aceite">
            <div className="space-y-1.5">
              {rf.acceptanceCriteria.map((ac, i) => (
                <div key={i} className="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/15 border border-emerald-200 dark:border-emerald-800 text-xs text-foreground">
                  <CheckCircle2 className="h-3 w-3 text-emerald-500 inline mr-1.5" />
                  {ac}
                </div>
              ))}
            </div>
          </Section>
        )}

        <Section title="Relacionamentos">
          <div className="flex flex-wrap gap-1.5">
            {rf.relatedRNIds.map((rnId) => (
              <button
                key={rnId}
                onClick={() => setSelectedSpecItem({ type: 'rn', id: rnId })}
                className="inline-flex items-center gap-1 text-[10px] px-2 py-1 rounded-lg border border-violet-200 bg-violet-50 dark:bg-violet-950/20 text-violet-600 hover:border-violet-400 transition-colors"
              >
                <Scale className="h-2.5 w-2.5" />{rnId}
              </button>
            ))}
            {rf.relatedGapIds.map((gapId) => (
              <button
                key={gapId}
                onClick={() => setSelectedSpecItem({ type: 'gap', id: gapId })}
                className="inline-flex items-center gap-1 text-[10px] px-2 py-1 rounded-lg border border-amber-200 bg-amber-50 dark:bg-amber-950/20 text-amber-600 hover:border-amber-400 transition-colors"
              >
                <AlertTriangle className="h-2.5 w-2.5" />{gapId}
              </button>
            ))}
          </div>
        </Section>

        {rf.changeHistory.length > 0 && (
          <Section title="Histórico de Alterações">
            <ChangeHistoryList history={rf.changeHistory} />
          </Section>
        )}
      </div>
    );
  }

  if (type === 'rn') {
    const rn = specData.businessRules.find((r) => r.id === id);
    if (!rn) return null;
    title = `${rn.id} — ${rn.title}`;
    icon = <Scale className="h-4 w-4 text-violet-500" />;
    const stage = specData.macroStages.find((s) => s.id === rn.relatedStageId);

    content = (
      <div className="space-y-5 text-sm">
        <div className="flex items-center gap-2">
          <Badge variant="outline" className={cn("text-[10px]", getSpecStatusColor(rn.status))}>
            {getSpecStatusLabel(rn.status)}
          </Badge>
          {stage && (
            <Badge variant="secondary" className="text-[10px]">
              0{stage.order}. {stage.name}
            </Badge>
          )}
        </div>

        <Section title="Enunciado">
          <p className="text-xs text-foreground leading-relaxed">{rn.statement}</p>
        </Section>

        <Section title="Condição">
          <p className="text-xs text-foreground leading-relaxed">{rn.condition}</p>
        </Section>

        <Section title="Comportamento Esperado">
          <p className="text-xs text-foreground leading-relaxed">{rn.expectedBehavior}</p>
        </Section>

        {rn.exceptions.length > 0 && (
          <Section title="Exceções">
            <ul className="list-disc list-inside text-xs text-muted-foreground space-y-0.5">
              {rn.exceptions.map((exc, i) => <li key={i}>{exc}</li>)}
            </ul>
          </Section>
        )}

        {rn.acceptanceCriteria.length > 0 && (
          <Section title="Critérios de Aceite">
            <div className="space-y-1.5">
              {rn.acceptanceCriteria.map((ac, i) => (
                <div key={i} className="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/15 border border-emerald-200 dark:border-emerald-800 text-xs text-foreground">
                  <CheckCircle2 className="h-3 w-3 text-emerald-500 inline mr-1.5" />
                  {ac}
                </div>
              ))}
            </div>
          </Section>
        )}

        <Section title="Relacionamentos">
          <div className="flex flex-wrap gap-1.5">
            {rn.relatedRFIds.map((rfId) => (
              <button
                key={rfId}
                onClick={() => setSelectedSpecItem({ type: 'rf', id: rfId })}
                className="inline-flex items-center gap-1 text-[10px] px-2 py-1 rounded-lg border border-blue-200 bg-blue-50 dark:bg-blue-950/20 text-blue-600 hover:border-blue-400 transition-colors"
              >
                <FileText className="h-2.5 w-2.5" />{rfId}
              </button>
            ))}
            {rn.relatedGapIds.map((gapId) => (
              <button
                key={gapId}
                onClick={() => setSelectedSpecItem({ type: 'gap', id: gapId })}
                className="inline-flex items-center gap-1 text-[10px] px-2 py-1 rounded-lg border border-amber-200 bg-amber-50 dark:bg-amber-950/20 text-amber-600 hover:border-amber-400 transition-colors"
              >
                <AlertTriangle className="h-2.5 w-2.5" />{gapId}
              </button>
            ))}
          </div>
        </Section>

        {rn.changeHistory.length > 0 && (
          <Section title="Histórico de Alterações">
            <ChangeHistoryList history={rn.changeHistory} />
          </Section>
        )}
      </div>
    );
  }

  if (type === 'gap') {
    const gap = specData.gaps.find((g) => g.id === id);
    if (!gap) return null;
    title = `${gap.id} — ${gap.title}`;
    icon = <AlertTriangle className="h-4 w-4 text-amber-500" />;

    content = (
      <div className="space-y-5 text-sm">
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-[10px] text-amber-600 border-amber-300">
            {getGapStatusLabel(gap.status)}
          </Badge>
          <Badge variant="outline" className={cn("text-[10px]",
            gap.impact === 'high' ? "text-red-600 border-red-300" :
            gap.impact === 'medium' ? "text-amber-600 border-amber-300" :
            "text-gray-600 border-gray-300"
          )}>
            Impacto {gap.impact === 'high' ? 'Alto' : gap.impact === 'medium' ? 'Médio' : 'Baixo'}
          </Badge>
        </div>

        <Section title="Pergunta">
          <p className="text-xs text-foreground font-medium leading-relaxed">{gap.question}</p>
        </Section>

        <Section title="Explicação">
          <p className="text-xs text-foreground leading-relaxed">{gap.explanation}</p>
        </Section>

        <Section title="Por que é necessário">
          <p className="text-xs text-foreground leading-relaxed">{gap.whyNeeded}</p>
        </Section>

        {gap.currentAnswer && (
          <Section title="Resposta Atual">
            <div className="p-2.5 rounded-lg bg-primary/5 border border-primary/20 text-xs text-foreground">
              {gap.currentAnswer}
            </div>
          </Section>
        )}

        <Section title="Itens Afetados">
          <div className="flex flex-wrap gap-1.5">
            {gap.affectedRFIds.map((rfId) => (
              <button
                key={rfId}
                onClick={() => setSelectedSpecItem({ type: 'rf', id: rfId })}
                className="inline-flex items-center gap-1 text-[10px] px-2 py-1 rounded-lg border border-blue-200 bg-blue-50 dark:bg-blue-950/20 text-blue-600 hover:border-blue-400 transition-colors"
              >
                <FileText className="h-2.5 w-2.5" />{rfId}
              </button>
            ))}
            {gap.affectedRNIds.map((rnId) => (
              <button
                key={rnId}
                onClick={() => setSelectedSpecItem({ type: 'rn', id: rnId })}
                className="inline-flex items-center gap-1 text-[10px] px-2 py-1 rounded-lg border border-violet-200 bg-violet-50 dark:bg-violet-950/20 text-violet-600 hover:border-violet-400 transition-colors"
              >
                <Scale className="h-2.5 w-2.5" />{rnId}
              </button>
            ))}
          </div>
        </Section>

        <Button
          variant="outline"
          size="sm"
          className="text-xs gap-1.5 w-full"
          onClick={() => {
            closeSpecDrawer();
            setActiveMainTab('validation');
          }}
        >
          <ArrowRight className="h-3.5 w-3.5" />
          Abrir na Validação
        </Button>
      </div>
    );
  }

  if (type === 'stage') {
    const stage = specData.macroStages.find((s) => s.id === id);
    if (!stage) return null;
    title = `Etapa 0${stage.order}: ${stage.name}`;
    icon = <ChevronRight className="h-4 w-4 text-primary" />;

    const stageRFs = specData.functionalRequirements.filter((rf) => stage.rfIds.includes(rf.id));
    const stageRNs = specData.businessRules.filter((rn) => stage.rnIds.includes(rn.id));
    const stageGaps = specData.gaps.filter((g) => stage.gapIds.includes(g.id));

    content = (
      <div className="space-y-5 text-sm">
        <Section title="Descrição">
          <p className="text-xs text-foreground leading-relaxed">{stage.description}</p>
        </Section>

        <div className="flex items-center gap-2">
          {stage.hasHumanDecision && (
            <Badge variant="outline" className="text-[10px] text-primary border-primary/30">Decisão humana</Badge>
          )}
          {stage.hasExceptions && (
            <Badge variant="outline" className="text-[10px] text-amber-600 border-amber-300">Exceções</Badge>
          )}
        </div>

        <Section title={`Requisitos Funcionais (${stageRFs.length})`}>
          <div className="space-y-1.5">
            {stageRFs.map((rf) => (
              <button
                key={rf.id}
                onClick={() => setSelectedSpecItem({ type: 'rf', id: rf.id })}
                className="w-full p-2 rounded-lg border border-border hover:border-blue-300 text-left text-xs transition-colors flex items-center gap-2"
              >
                <FileText className="h-3 w-3 text-blue-500 shrink-0" />
                <span className="font-mono text-muted-foreground text-[10px]">{rf.id}</span>
                <span className="text-foreground truncate">{rf.title}</span>
              </button>
            ))}
          </div>
        </Section>

        <Section title={`Regras de Negócio (${stageRNs.length})`}>
          <div className="space-y-1.5">
            {stageRNs.map((rn) => (
              <button
                key={rn.id}
                onClick={() => setSelectedSpecItem({ type: 'rn', id: rn.id })}
                className="w-full p-2 rounded-lg border border-border hover:border-violet-300 text-left text-xs transition-colors flex items-center gap-2"
              >
                <Scale className="h-3 w-3 text-violet-500 shrink-0" />
                <span className="font-mono text-muted-foreground text-[10px]">{rn.id}</span>
                <span className="text-foreground truncate">{rn.title}</span>
              </button>
            ))}
          </div>
        </Section>

        {stageGaps.length > 0 && (
          <Section title={`Pendências (${stageGaps.length})`}>
            <div className="space-y-1.5">
              {stageGaps.map((gap) => (
                <button
                  key={gap.id}
                  onClick={() => setSelectedSpecItem({ type: 'gap', id: gap.id })}
                  className="w-full p-2 rounded-lg border border-amber-200 dark:border-amber-800 hover:border-amber-400 bg-amber-50/50 dark:bg-amber-950/10 text-left text-xs transition-colors flex items-center gap-2"
                >
                  <AlertTriangle className="h-3 w-3 text-amber-500 shrink-0" />
                  <span className="font-mono text-muted-foreground text-[10px]">{gap.id}</span>
                  <span className="text-foreground truncate">{gap.title}</span>
                </button>
              ))}
            </div>
          </Section>
        )}
      </div>
    );
  }

  return (
    <Sheet open={isSpecDrawerOpen} onOpenChange={(open) => { if (!open) closeSpecDrawer(); }}>
      <SheetContent side="right" className="w-[480px] sm:w-[520px] overflow-y-auto">
        <SheetHeader className="pb-4 border-b border-border">
          <div className="flex items-center gap-2">
            {icon}
            <SheetTitle className="text-sm font-bold leading-snug">{title}</SheetTitle>
          </div>
        </SheetHeader>
        <div className="py-5">
          {content}
        </div>
      </SheetContent>
    </Sheet>
  );
}

// ── Reusable Section ──
function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h4 className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground mb-1.5">{title}</h4>
      {children}
    </div>
  );
}

// ── Change History ──
function ChangeHistoryList({ history }: { history: Array<{ id: string; date: string; author: string; fieldChanged: string; previousValue: string; newValue: string; originGapId?: string }> }) {
  return (
    <div className="space-y-2">
      {history.map((ch) => (
        <div key={ch.id} className="p-2.5 rounded-lg border border-border bg-muted/10 text-[11px] space-y-1">
          <div className="flex items-center justify-between text-muted-foreground">
            <span>{ch.author} — {ch.date}</span>
            {ch.originGapId && (
              <Badge variant="outline" className="text-[9px] h-3.5 text-amber-600 border-amber-300">
                {ch.originGapId}
              </Badge>
            )}
          </div>
          <div className="text-foreground">
            <strong>{ch.fieldChanged}:</strong>
          </div>
          <div className="grid grid-cols-2 gap-1.5">
            <div className="p-1.5 rounded bg-red-50 dark:bg-red-950/10 text-red-700 dark:text-red-300 text-[10px]">
              <span className="font-bold">Antes: </span>{ch.previousValue}
            </div>
            <div className="p-1.5 rounded bg-emerald-50 dark:bg-emerald-950/10 text-emerald-700 dark:text-emerald-300 text-[10px]">
              <span className="font-bold">Depois: </span>{ch.newValue}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
