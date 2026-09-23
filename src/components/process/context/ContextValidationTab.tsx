import React, { useState, useMemo } from 'react';
import { AlertTriangle, CheckCircle2, Clock, HelpCircle, ArrowRight, Edit3, Send, X, FileText, Scale, ChevronDown, ChevronUp, RotateCcw, Ban, MessageSquare, Filter } from 'lucide-react';
import { useProcessContextStore } from '@/stores/processContextStore';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';
import type { ContextSpecData, ContextGap, GapStatus } from '@/types/processContext';
import { useToast } from '@/components/ui/use-toast';

interface ContextValidationTabProps {
  specData: ContextSpecData;
  processId: string;
}

const impactOrder = { high: 0, medium: 1, low: 2 };
const statusOrder: Record<GapStatus, number> = {
  open: 0,
  reopened: 1,
  awaiting_response: 2,
  answered: 3,
  in_review: 4,
  confirmed: 5,
  rejected: 6,
  not_applicable: 7,
};

function getStatusLabel(status: GapStatus): string {
  const labels: Record<GapStatus, string> = {
    open: 'Aberto',
    awaiting_response: 'Aguardando resposta',
    answered: 'Respondido',
    in_review: 'Em revisão',
    confirmed: 'Confirmado',
    rejected: 'Rejeitado',
    not_applicable: 'Não se aplica',
    reopened: 'Reaberto',
  };
  return labels[status];
}

function getStatusColor(status: GapStatus): string {
  const colors: Record<GapStatus, string> = {
    open: 'text-amber-600 border-amber-300 bg-amber-50 dark:bg-amber-950/20',
    reopened: 'text-orange-600 border-orange-300 bg-orange-50 dark:bg-orange-950/20',
    awaiting_response: 'text-blue-600 border-blue-300 bg-blue-50 dark:bg-blue-950/20',
    answered: 'text-sky-600 border-sky-300 bg-sky-50 dark:bg-sky-950/20',
    in_review: 'text-violet-600 border-violet-300 bg-violet-50 dark:bg-violet-950/20',
    confirmed: 'text-emerald-600 border-emerald-300 bg-emerald-50 dark:bg-emerald-950/20',
    rejected: 'text-red-600 border-red-300 bg-red-50 dark:bg-red-950/20',
    not_applicable: 'text-gray-500 border-gray-300 bg-gray-50 dark:bg-gray-800/20',
  };
  return colors[status];
}

function getImpactBadge(impact: 'high' | 'medium' | 'low') {
  if (impact === 'high') return <Badge variant="outline" className="text-[9px] h-4 text-red-600 border-red-300 bg-red-50 dark:bg-red-950/20">Alto</Badge>;
  if (impact === 'medium') return <Badge variant="outline" className="text-[9px] h-4 text-amber-600 border-amber-300 bg-amber-50 dark:bg-amber-950/20">Médio</Badge>;
  return <Badge variant="outline" className="text-[9px] h-4 text-gray-600 border-gray-300">Baixo</Badge>;
}

export function ContextValidationTab({ specData, processId }: ContextValidationTabProps) {
  const { respondToGap, confirmGapUpdate, rejectGapUpdate, setGapStatus } = useProcessContextStore();
  const { toast } = useToast();

  const [activeGapId, setActiveGapId] = useState<string | null>(specData.gaps[0]?.id || null);
  const [editingAnswer, setEditingAnswer] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [showImpact, setShowImpact] = useState(false);
  const [impactFilter, setImpactFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  // Sort by impact (high first) then by status (open first)
  const sortedGaps = useMemo(() => {
    let filtered = [...specData.gaps];
    if (impactFilter !== 'all') {
      filtered = filtered.filter((g) => g.impact === impactFilter);
    }
    if (statusFilter !== 'all') {
      filtered = filtered.filter((g) => g.status === statusFilter);
    }
    return filtered.sort((a, b) => {
      const impactDiff = impactOrder[a.impact] - impactOrder[b.impact];
      if (impactDiff !== 0) return impactDiff;
      return statusOrder[a.status] - statusOrder[b.status];
    });
  }, [specData.gaps, impactFilter, statusFilter]);

  const activeGap = specData.gaps.find((g) => g.id === activeGapId) || specData.gaps[0];

  const openCount = specData.gaps.filter((g) => g.status === 'open' || g.status === 'reopened' || g.status === 'awaiting_response').length;
  const resolvedCount = specData.gaps.filter((g) => g.status === 'confirmed').length;

  const handleSelectGap = (gap: ContextGap) => {
    setActiveGapId(gap.id);
    setEditingAnswer(gap.currentAnswer || '');
    setIsEditing(false);
    setShowImpact(false);
  };

  const handleSelectOption = (option: string) => {
    setEditingAnswer(option);
    respondToGap(processId, activeGap.id, option);
    setShowImpact(true);
    toast({ title: 'Resposta salva', description: 'Verifique o impacto da sua resposta abaixo.' });
  };

  const handleSaveAnswer = () => {
    if (!editingAnswer.trim()) return;
    respondToGap(processId, activeGap.id, editingAnswer);
    setIsEditing(false);
    setShowImpact(true);
    toast({ title: 'Resposta salva', description: 'Verifique o impacto da sua resposta abaixo.' });
  };

  const handleConfirm = () => {
    confirmGapUpdate(processId, activeGap.id);
    setShowImpact(false);
    toast({ title: 'Atualização confirmada', description: 'Os requisitos e regras foram atualizados com base na sua resposta.' });
  };

  const handleReject = () => {
    rejectGapUpdate(processId, activeGap.id);
    setShowImpact(false);
    toast({ title: 'Proposta rejeitada', description: 'A alteração não foi aplicada.' });
  };

  const handleDontKnow = () => {
    setGapStatus(processId, activeGap.id, 'awaiting_response');
    toast({ title: 'Marcado como desconhecido', description: 'Será necessário identificar quem pode responder.' });
  };

  const handleNotApplicable = () => {
    setGapStatus(processId, activeGap.id, 'not_applicable');
    toast({ title: 'Marcado como não aplicável' });
  };

  const getStageNameForGap = (stageId: string) => {
    const stage = specData.macroStages.find((s) => s.id === stageId);
    return stage ? `0${stage.order}. ${stage.name}` : stageId;
  };

  if (specData.gaps.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center animate-in fade-in-50">
        <CheckCircle2 className="h-12 w-12 text-emerald-500 mb-4" />
        <h3 className="text-lg font-bold text-foreground mb-1">Nenhuma pendência identificada</h3>
        <p className="text-sm text-muted-foreground max-w-md">
          A análise do processo não identificou dúvidas ou lacunas que precisem da sua confirmação.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-5 animate-in fade-in-50 duration-200">
      {/* Top Bar */}
      <div className="rounded-2xl border border-border bg-card p-5 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-foreground tracking-tight mb-0.5">
            Validação de Pendências
          </h2>
          <p className="text-xs text-muted-foreground">
            Revise e responda as dúvidas identificadas pela análise do processo. Pendências de alto impacto aparecem primeiro.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <div className="flex items-center gap-2 text-xs">
            <Filter className="h-3.5 w-3.5 text-muted-foreground" />
            <Select value={impactFilter} onValueChange={setImpactFilter}>
              <SelectTrigger className="h-7 w-[110px] text-xs">
                <SelectValue placeholder="Impacto" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="high">Alto</SelectItem>
                <SelectItem value="medium">Médio</SelectItem>
                <SelectItem value="low">Baixo</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="h-7 w-[130px] text-xs">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="open">Aberto</SelectItem>
                <SelectItem value="awaiting_response">Aguardando</SelectItem>
                <SelectItem value="answered">Respondido</SelectItem>
                <SelectItem value="confirmed">Confirmado</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="px-3 py-1.5 rounded-xl border border-border bg-muted/30 text-xs">
            <span className="text-muted-foreground">{resolvedCount}/{specData.gaps.length}</span>
            <span className="text-emerald-600 font-semibold ml-1">resolvidas</span>
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Left: Gap List */}
        <div className="lg:col-span-4 space-y-2">
          <span className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground px-1 block">
            Pendências ({sortedGaps.length})
          </span>

          <div className="space-y-2 max-h-[620px] overflow-y-auto pr-1">
            {sortedGaps.map((gap) => {
              const isSelected = gap.id === activeGap?.id;
              return (
                <div
                  key={gap.id}
                  onClick={() => handleSelectGap(gap)}
                  className={cn(
                    "p-3.5 rounded-xl border transition-all cursor-pointer text-left",
                    isSelected
                      ? "border-primary bg-primary/5 shadow-sm ring-1 ring-primary/20"
                      : "border-border bg-card hover:border-primary/40"
                  )}
                >
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-mono font-bold text-muted-foreground">{gap.id}</span>
                      {getImpactBadge(gap.impact)}
                    </div>
                    <Badge variant="outline" className={cn("text-[9px] h-4 font-normal", getStatusColor(gap.status))}>
                      {getStatusLabel(gap.status)}
                    </Badge>
                  </div>

                  <p className="text-xs font-semibold text-foreground leading-snug line-clamp-2">
                    {gap.title}
                  </p>

                  <div className="mt-2 pt-1.5 border-t border-border/40 flex items-center justify-between text-[10px] text-muted-foreground">
                    <span className="truncate max-w-[160px]">Resp: {gap.suggestedResponsible}</span>
                    <span className="text-primary font-semibold flex items-center gap-0.5">
                      Abrir &rarr;
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Active GAP Workspace */}
        {activeGap && (
          <div className="lg:col-span-8 rounded-2xl border border-border bg-card p-6 shadow-sm space-y-5">
            {/* Header */}
            <div>
              <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-muted-foreground">{activeGap.id}</span>
                  {getImpactBadge(activeGap.impact)}
                  <Badge variant="outline" className={cn("text-[10px] font-normal", getStatusColor(activeGap.status))}>
                    {getStatusLabel(activeGap.status)}
                  </Badge>
                </div>
                <span className="text-[10px] text-muted-foreground">
                  Atualizado: {activeGap.updatedAt}
                </span>
              </div>

              <h2 className="text-base font-bold text-foreground leading-snug mb-1">
                {activeGap.question}
              </h2>

              <p className="text-xs text-muted-foreground leading-relaxed">
                {activeGap.explanation}
              </p>
            </div>

            {/* Context Boxes */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="p-3 rounded-xl border border-border bg-muted/20 space-y-1">
                <span className="text-[10px] uppercase font-bold text-muted-foreground block">
                  Por que é necessário
                </span>
                <p className="text-[11px] text-foreground leading-relaxed">
                  {activeGap.whyNeeded}
                </p>
              </div>

              <div className="p-3 rounded-xl border border-border bg-muted/20 space-y-1.5">
                <span className="text-[10px] uppercase font-bold text-muted-foreground block">
                  Itens afetados
                </span>
                <div className="flex flex-wrap gap-1">
                  {activeGap.affectedRFIds.map((rfId) => (
                    <Badge key={rfId} variant="outline" className="text-[9px] h-4 text-blue-600 border-blue-300">
                      <FileText className="h-2.5 w-2.5 mr-0.5" />{rfId}
                    </Badge>
                  ))}
                  {activeGap.affectedRNIds.map((rnId) => (
                    <Badge key={rnId} variant="outline" className="text-[9px] h-4 text-violet-600 border-violet-300">
                      <Scale className="h-2.5 w-2.5 mr-0.5" />{rnId}
                    </Badge>
                  ))}
                </div>
                <div className="text-[10px] text-muted-foreground">
                  Etapa: <strong className="text-foreground">{getStageNameForGap(activeGap.relatedStageId)}</strong>
                </div>
                <div className="text-[10px] text-muted-foreground">
                  Responsável: <strong className="text-foreground">{activeGap.suggestedResponsible}</strong>
                </div>
              </div>
            </div>

            {/* Response Area */}
            {activeGap.status !== 'confirmed' && activeGap.status !== 'not_applicable' && (
              <div className="space-y-3 pt-2 border-t border-border">
                {/* Response Options */}
                {activeGap.responseOptions && activeGap.status !== 'answered' && (
                  <div className="space-y-1.5">
                    <span className="text-[10px] uppercase font-bold text-muted-foreground block">
                      Selecione uma opção:
                    </span>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-1.5">
                      {activeGap.responseOptions.map((opt, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleSelectOption(opt)}
                          className={cn(
                            "p-2.5 rounded-xl border text-left text-xs leading-snug transition-all",
                            activeGap.currentAnswer === opt
                              ? "border-primary bg-primary/10 text-foreground font-medium"
                              : "border-border bg-card hover:border-primary/40 hover:bg-primary/5 text-foreground"
                          )}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Free text */}
                <div>
                  {isEditing ? (
                    <div className="space-y-2">
                      <Textarea
                        value={editingAnswer}
                        onChange={(e) => setEditingAnswer(e.target.value)}
                        rows={3}
                        className="text-xs leading-relaxed"
                        placeholder="Escreva sua resposta..."
                      />
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="sm" onClick={() => setIsEditing(false)} className="text-xs h-7">
                          Cancelar
                        </Button>
                        <Button size="sm" onClick={handleSaveAnswer} className="text-xs h-7 gap-1">
                          <Send className="h-3 w-3" />
                          Salvar Resposta
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setIsEditing(true);
                          setEditingAnswer(activeGap.currentAnswer || '');
                        }}
                        className="text-xs h-7 gap-1"
                      >
                        <Edit3 className="h-3 w-3" />
                        {activeGap.currentAnswer ? 'Editar resposta' : 'Resposta livre'}
                      </Button>
                    </div>
                  )}
                </div>

                {/* Current answer display */}
                {activeGap.currentAnswer && !isEditing && (
                  <div className="p-3 rounded-xl border border-primary/20 bg-primary/5 space-y-1">
                    <span className="text-[10px] uppercase font-bold text-primary block">Resposta atual</span>
                    <p className="text-xs text-foreground font-medium leading-relaxed">
                      {activeGap.currentAnswer}
                    </p>
                    {activeGap.responseHistory.length > 0 && (
                      <div className="text-[10px] text-muted-foreground mt-1">
                        Respondido por: {activeGap.responseHistory[activeGap.responseHistory.length - 1].respondedBy}
                        {' — '}
                        {activeGap.responseHistory[activeGap.responseHistory.length - 1].respondedAt}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Impact Preview */}
            {(showImpact || activeGap.status === 'answered' || activeGap.status === 'awaiting_response') && activeGap.impactPreview && activeGap.impactPreview.length > 0 && activeGap.status !== 'confirmed' && (
              <div className="space-y-3 pt-3 border-t border-border">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-amber-500" />
                  <span className="text-xs font-bold text-foreground">
                    A resposta impactará {activeGap.impactPreview.length} {activeGap.impactPreview.length === 1 ? 'item' : 'itens'}
                  </span>
                </div>

                <div className="space-y-2">
                  {activeGap.impactPreview.map((preview) => (
                    <div key={preview.itemId} className="p-3 rounded-xl border border-border bg-muted/10 space-y-2">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className={cn("text-[9px] h-4",
                          preview.itemType === 'rf' ? "text-blue-600 border-blue-300" : "text-violet-600 border-violet-300"
                        )}>
                          {preview.itemId}
                        </Badge>
                        <span className="text-xs font-medium text-foreground">{preview.itemTitle}</span>
                      </div>
                      <div className="text-[10px] text-muted-foreground">
                        Campo: <strong>{preview.fieldChanged}</strong>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-[11px]">
                        <div className="p-2 rounded-lg bg-red-50 dark:bg-red-950/10 border border-red-200 dark:border-red-900">
                          <span className="text-[9px] uppercase font-bold text-red-600 block mb-0.5">Antes</span>
                          <span className="text-red-800 dark:text-red-300">{preview.before}</span>
                        </div>
                        <div className="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/10 border border-emerald-200 dark:border-emerald-900">
                          <span className="text-[9px] uppercase font-bold text-emerald-600 block mb-0.5">Depois</span>
                          <span className="text-emerald-800 dark:text-emerald-300">{preview.after}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    className="gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs h-8"
                    onClick={handleConfirm}
                  >
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    Confirmar atualização
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-xs h-8 gap-1"
                    onClick={handleReject}
                  >
                    <X className="h-3.5 w-3.5" />
                    Rejeitar proposta
                  </Button>
                </div>
              </div>
            )}

            {/* Confirmed State */}
            {activeGap.status === 'confirmed' && (
              <div className="p-4 rounded-xl border border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/20 flex items-center gap-3">
                <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
                <div>
                  <span className="text-sm font-semibold text-emerald-800 dark:text-emerald-300">
                    Pendência confirmada
                  </span>
                  <p className="text-xs text-emerald-700 dark:text-emerald-400">
                    Os requisitos e regras foram atualizados. Resposta: "{activeGap.currentAnswer}"
                  </p>
                </div>
              </div>
            )}

            {/* Action Bar */}
            {activeGap.status !== 'confirmed' && activeGap.status !== 'not_applicable' && (
              <div className="pt-3 border-t border-border flex flex-wrap items-center gap-2">
                <Button variant="outline" size="sm" onClick={handleDontKnow} className="text-xs h-7 gap-1">
                  <HelpCircle className="h-3 w-3" />
                  Não sei responder
                </Button>
                <Button variant="outline" size="sm" onClick={handleNotApplicable} className="text-xs h-7 gap-1">
                  <Ban className="h-3 w-3" />
                  Não se aplica
                </Button>
              </div>
            )}

            {/* Response History */}
            {activeGap.responseHistory.length > 0 && (
              <div className="pt-3 border-t border-border">
                <button
                  onClick={() => setShowImpact(!showImpact)}
                  className="text-[10px] uppercase font-bold text-muted-foreground flex items-center gap-1 mb-2 hover:text-foreground"
                >
                  <Clock className="h-3 w-3" />
                  Histórico ({activeGap.responseHistory.length})
                </button>
                <div className="space-y-1.5">
                  {activeGap.responseHistory.map((resp) => (
                    <div key={resp.id} className="text-[11px] text-muted-foreground p-2 rounded-lg bg-muted/20 border border-border/50">
                      <span className="font-medium text-foreground">{resp.respondedBy}</span>
                      <span className="mx-1">—</span>
                      <span>{resp.respondedAt}</span>
                      <p className="mt-0.5 text-foreground">{resp.answer}</p>
                      {resp.note && <p className="mt-0.5 italic">{resp.note}</p>}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
