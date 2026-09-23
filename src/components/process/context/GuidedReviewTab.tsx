import React, { useState } from 'react';
import { HelpCircle, CheckCircle2, AlertCircle, Clock, UserCheck, MessageSquare, ArrowRight, ShieldCheck, Edit3, CornerDownRight, Sparkles, Send, Check } from 'lucide-react';
import { useProcessContextStore } from '@/stores/processContextStore';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import type { ProcessContextModel, ContextQuestion } from '@/types/processContext';

interface GuidedReviewTabProps {
  context: ProcessContextModel;
}

export function GuidedReviewTab({ context }: GuidedReviewTabProps) {
  const { answerQuestion, confirmQuestion, currentProcessId } = useProcessContextStore();
  const processId = currentProcessId || context.processId;

  const [activeQuestionId, setActiveQuestionId] = useState<string | null>(context.questions[0]?.id || null);
  const [editingAnswer, setEditingAnswer] = useState<string>('');
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [delegateDialogOpen, setDelegateDialogOpen] = useState<boolean>(false);
  const [delegateEmail, setDelegateEmail] = useState<string>('');

  const activeQuestion = context.questions.find((q) => q.id === activeQuestionId) || context.questions[0];

  const handleSelectQuestion = (q: ContextQuestion) => {
    setActiveQuestionId(q.id);
    setEditingAnswer(q.currentAnswer || q.suggestedAnswer || '');
    setIsEditing(false);
  };

  const handleConfirmDirect = (q: ContextQuestion) => {
    confirmQuestion(processId, q.id, 'Você (Responsável Técnico)');
  };

  const handleSaveAnswer = (q: ContextQuestion) => {
    answerQuestion(processId, q.id, {
      status: 'awaiting_validation',
      answer: editingAnswer,
    });
    setIsEditing(false);
  };

  const handleDontKnow = (q: ContextQuestion) => {
    answerQuestion(processId, q.id, {
      status: 'unknown',
      note: 'Usuário indicou que não possui a informação no momento.',
    });
  };

  const handleDefer = (q: ContextQuestion) => {
    answerQuestion(processId, q.id, {
      status: 'deferred',
      note: 'Adiado para revisão posterior.',
    });
  };

  const handleDelegateSubmit = () => {
    if (activeQuestion && delegateEmail) {
      answerQuestion(processId, activeQuestion.id, {
        status: 'pending',
        delegatedTo: delegateEmail,
        note: `Atribuído para resolução por ${delegateEmail}`,
      });
      setDelegateDialogOpen(false);
      setDelegateEmail('');
    }
  };

  const resolvedQuestions = context.questions.filter(
    (q) => q.status === 'confirmed' || q.status === 'answered' || q.status === 'awaiting_validation'
  );

  return (
    <div className="space-y-6 animate-in fade-in-50 duration-200">
      {/* Overview Banner: Clean and Airy */}
      <div className="rounded-2xl border border-border bg-card p-5 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h2 className="text-base font-bold text-foreground tracking-tight">
              Revisão Guiada do Conhecimento Operacional
            </h2>
            <Badge variant="outline" className="text-[11px] font-normal">
              {resolvedQuestions.length} de {context.questions.length} confirmadas
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground max-w-xl">
            Valide hipóteses e incertezas levantadas pela IA a partir de vídeos e procedimentos.
          </p>
        </div>

        {/* Progress meter */}
        <div className="w-full md:w-48 p-2.5 rounded-xl bg-muted/30 border border-border flex flex-col gap-1 shrink-0">
          <div className="flex justify-between text-xs font-semibold">
            <span className="text-muted-foreground text-[11px]">Progresso</span>
            <span className="text-primary">
              {Math.round((resolvedQuestions.length / context.questions.length) * 100)}%
            </span>
          </div>
          <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-primary transition-all duration-300"
              style={{ width: `${(resolvedQuestions.length / context.questions.length) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Main Grid: Questions List & Active Question Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: List of Questions */}
        <div className="lg:col-span-4 space-y-2.5">
          <span className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground px-1 block">
            Fila de Incertezas Priorizadas ({context.questions.length})
          </span>

          <div className="space-y-2">
            {context.questions.map((q) => {
              const isSelected = q.id === activeQuestion?.id;
              const isConfirmed = q.status === 'confirmed';

              return (
                <div
                  key={q.id}
                  onClick={() => handleSelectQuestion(q)}
                  className={cn(
                    "p-3 rounded-xl border transition-all cursor-pointer text-left",
                    isSelected
                      ? "border-primary bg-primary/5 shadow-sm ring-1 ring-primary/20"
                      : "border-border bg-card hover:border-primary/40"
                  )}
                >
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="text-[10px] uppercase font-bold tracking-wide text-muted-foreground truncate max-w-[180px]">
                      {q.targetName}
                    </span>
                    <Badge
                      variant={isConfirmed ? "default" : "outline"}
                      className={cn(
                        "text-[9px] font-normal h-4",
                        isConfirmed ? "bg-emerald-600 text-white border-transparent" :
                        q.status === 'awaiting_validation' ? "text-blue-600 border-blue-300" :
                        "text-amber-600 border-amber-300"
                      )}
                    >
                      {isConfirmed ? "Confirmado" :
                       q.status === 'awaiting_validation' ? "Em Validação" :
                       q.status === 'unknown' ? "Desconhecido" : "Pendente"}
                    </Badge>
                  </div>

                  <p className="text-xs font-semibold text-foreground leading-snug line-clamp-2">
                    {q.questionText}
                  </p>

                  <div className="mt-2 pt-1.5 border-t border-border/40 flex items-center justify-between text-[10px] text-muted-foreground">
                    <span className="truncate max-w-[150px]">Resp: {q.probableResponsible}</span>
                    <span className="text-primary font-semibold flex items-center gap-0.5">
                      Abrir &rarr;
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Detailed Working Card */}
        {activeQuestion && (
          <div className="lg:col-span-8 rounded-2xl border border-border bg-card p-6 shadow-sm space-y-5">
            {/* Header */}
            <div>
              <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                <Badge variant="secondary" className="text-[10px] font-medium">
                  {activeQuestion.targetName}
                </Badge>
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <span>Responsável provável:</span>
                  <strong className="text-foreground font-semibold">{activeQuestion.probableResponsible}</strong>
                </div>
              </div>

              <h2 className="text-base font-bold text-foreground leading-snug">
                {activeQuestion.questionText}
              </h2>
            </div>

            {/* Context Box & Evidence Snippet */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl border border-border bg-muted/20 space-y-1">
                <span className="text-[10px] uppercase font-bold text-muted-foreground block">
                  Origem do Entendimento
                </span>
                <p className="text-muted-foreground leading-relaxed text-[11px]">
                  {activeQuestion.sourceContext}
                </p>
              </div>

              <div className="p-3 rounded-xl border border-primary/20 bg-primary/5 space-y-1">
                <span className="text-[10px] uppercase font-bold text-primary flex items-center gap-1">
                  <Sparkles className="h-3 w-3" />
                  O que a IA compreendeu
                </span>
                <p className="text-foreground leading-relaxed font-medium text-[11px]">
                  {activeQuestion.aiUnderstanding}
                </p>
              </div>
            </div>

            {/* Why this question matters */}
            <div className="text-xs space-y-1 p-3 rounded-xl border border-border/70 bg-card">
              <span className="text-[10px] uppercase font-bold text-muted-foreground block">
                Por que importa:
              </span>
              <p className="text-foreground text-[11px] leading-relaxed">
                {activeQuestion.rationaleWhyItMatters}
              </p>
              <div className="flex flex-wrap items-center gap-1 pt-1">
                <span className="text-[10px] text-muted-foreground">Casos de uso impactados:</span>
                {activeQuestion.impactOnUseCases.map((uc, idx) => (
                  <Badge key={idx} variant="outline" className="text-[9px] font-normal h-4">
                    {uc}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Suggested or Current Answer Area */}
            <div className="space-y-2.5 pt-2 border-t border-border">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-foreground">
                  Resposta ou Sugestão
                </span>
                {!isEditing && activeQuestion.status !== 'confirmed' && (
                  <button
                    onClick={() => {
                      setIsEditing(true);
                      setEditingAnswer(activeQuestion.currentAnswer || activeQuestion.suggestedAnswer || '');
                    }}
                    className="text-xs text-primary hover:underline flex items-center gap-1 font-medium"
                  >
                    <Edit3 className="h-3 w-3" />
                    Editar resposta
                  </button>
                )}
              </div>

              {isEditing ? (
                <div className="space-y-2.5">
                  <Textarea
                    value={editingAnswer}
                    onChange={(e) => setEditingAnswer(e.target.value)}
                    rows={3}
                    className="text-xs leading-relaxed"
                    placeholder="Escreva a resposta correta para a operação..."
                  />
                  <div className="flex justify-end gap-2">
                    <Button variant="ghost" size="sm" onClick={() => setIsEditing(false)}>
                      Cancelar
                    </Button>
                    <Button size="sm" onClick={() => handleSaveAnswer(activeQuestion)}>
                      Salvar Resposta
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="p-3.5 rounded-xl border border-border bg-muted/15 space-y-1.5">
                  <p className="text-xs text-foreground font-medium leading-relaxed">
                    {activeQuestion.currentAnswer || activeQuestion.suggestedAnswer || "Nenhuma resposta cadastrada ainda."}
                  </p>

                  {activeQuestion.validatedBy && (
                    <div className="flex items-center gap-1.5 text-[11px] text-emerald-600 dark:text-emerald-400 pt-1 font-medium">
                      <ShieldCheck className="h-3.5 w-3.5" />
                      <span>Validado por: {activeQuestion.validatedBy} ({activeQuestion.validatedAt})</span>
                    </div>
                  )}

                  {activeQuestion.delegatedTo && (
                    <div className="flex items-center gap-1.5 text-[11px] text-primary pt-1">
                      <UserCheck className="h-3.5 w-3.5" />
                      <span>Atribuído a: {activeQuestion.delegatedTo}</span>
                    </div>
                  )}
                </div>
              )}

              {/* Multiple choice suggestions if available */}
              {activeQuestion.suggestedResponseOptions && activeQuestion.status !== 'confirmed' && (
                <div className="space-y-1 pt-1">
                  <span className="text-[10px] text-muted-foreground block font-medium uppercase">
                    Ou clique em uma opção apurada:
                  </span>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-1.5">
                    {activeQuestion.suggestedResponseOptions.map((opt, idx) => (
                      <button
                        key={idx}
                        onClick={() => {
                          setEditingAnswer(opt);
                          answerQuestion(processId, activeQuestion.id, {
                            status: 'awaiting_validation',
                            answer: opt,
                          });
                        }}
                        className="p-2 rounded-lg border border-border hover:border-primary text-left text-xs bg-card hover:bg-primary/5 transition-colors leading-snug"
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Action Bar */}
            <div className="pt-3 border-t border-border flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-1.5">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDontKnow(activeQuestion)}
                  className="text-xs h-8"
                >
                  Não sei responder
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDefer(activeQuestion)}
                  className="text-xs h-8"
                >
                  Responder depois
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setDelegateDialogOpen(true)}
                  className="text-xs h-8"
                >
                  Indicar quem sabe
                </Button>
              </div>

              <div className="flex items-center gap-2">
                {activeQuestion.status !== 'confirmed' ? (
                  <Button
                    size="sm"
                    className="gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white h-8 text-xs"
                    onClick={() => handleConfirmDirect(activeQuestion)}
                  >
                    <Check className="h-3.5 w-3.5" />
                    Confirmar e Validar
                  </Button>
                ) : (
                  <Badge variant="outline" className="text-emerald-600 border-emerald-300 gap-1 py-1 px-2.5 text-xs">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    Confirmada
                  </Badge>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Delegate Dialog */}
      <Dialog open={delegateDialogOpen} onOpenChange={setDelegateDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Indicar Responsável pelo Esclarecimento</DialogTitle>
            <DialogDescription>
              Informe o e-mail ou nome da pessoa responsável por validar esta regra ou dado.
            </DialogDescription>
          </DialogHeader>
          <div className="py-3">
            <Input
              placeholder="ex: especialista.fiscal@empresa.com.br"
              value={delegateEmail}
              onChange={(e) => setDelegateEmail(e.target.value)}
              className="text-xs"
            />
          </div>
          <DialogFooter>
            <Button variant="ghost" size="sm" onClick={() => setDelegateDialogOpen(false)}>
              Cancelar
            </Button>
            <Button size="sm" onClick={handleDelegateSubmit}>
              Atribuir Questão
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
