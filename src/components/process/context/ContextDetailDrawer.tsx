import React from 'react';
import { X, ExternalLink, ShieldCheck, AlertCircle, FileText, Database, Server, CheckCircle2, HelpCircle, Layers, ArrowRight, Video, FileCheck, UserCheck, MessageSquare } from 'lucide-react';
import { useProcessContextStore } from '@/stores/processContextStore';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import type { ProcessContextModel } from '@/types/processContext';

interface ContextDetailDrawerProps {
  context: ProcessContextModel;
}

export function ContextDetailDrawer({ context }: ContextDetailDrawerProps) {
  const { selectedItem, isDrawerOpen, closeDrawer, setActiveSubTab } = useProcessContextStore();

  if (!isDrawerOpen || !selectedItem) return null;

  const { type, id } = selectedItem;

  // Resolve item based on type
  let content: React.ReactNode = null;
  let title = '';
  let badgeLabel = '';
  let badgeVariant: 'default' | 'outline' | 'secondary' | 'destructive' = 'outline';

  if (type === 'stage') {
    const stage = context.stages.find((s) => s.id === id);
    if (!stage) return null;
    title = `Macroetapa 0${stage.order}: ${stage.name}`;
    badgeLabel = 'Macroetapa';
    const stageActivities = context.activities.filter((a) => a.stageId === stage.id);
    const stageCapabilities = context.capabilities.filter((c) => stage.capabilityIds.includes(c.id));

    content = (
      <div className="space-y-5 text-sm">
        <div>
          <h4 className="text-xs uppercase tracking-wider font-semibold text-muted-foreground mb-1">Propósito da Etapa</h4>
          <p className="text-foreground leading-relaxed">{stage.description}</p>
        </div>

        <div>
          <h4 className="text-xs uppercase tracking-wider font-semibold text-muted-foreground mb-2">Capacidades Realizadas</h4>
          <div className="space-y-2">
            {stageCapabilities.map((cap) => (
              <div key={cap.id} className="p-2.5 rounded-lg border border-border bg-muted/30">
                <div className="flex items-center justify-between font-medium text-xs text-primary mb-1">
                  <span>{cap.code} — {cap.name}</span>
                  <Badge variant="outline" className="text-[10px] uppercase font-normal">{cap.maturityLevel}</Badge>
                </div>
                <p className="text-xs text-muted-foreground">{cap.description}</p>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h4 className="text-xs uppercase tracking-wider font-semibold text-muted-foreground mb-2">Atividades Componentes ({stageActivities.length})</h4>
          <div className="space-y-1.5">
            {stageActivities.map((act) => (
              <div key={act.id} className="flex items-start gap-2 p-2 rounded-md hover:bg-muted/50 border border-transparent hover:border-border transition-colors">
                <span className="text-[11px] font-mono text-muted-foreground pt-0.5">{act.code}</span>
                <div className="flex-1">
                  <p className="text-xs font-medium text-foreground">{act.name}</p>
                  <p className="text-[11px] text-muted-foreground">{act.executorRole}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {stage.externalInputs && stage.externalInputs.length > 0 && (
          <div>
            <h4 className="text-xs uppercase tracking-wider font-semibold text-muted-foreground mb-1.5">Entradas Externas</h4>
            <ul className="list-disc list-inside space-y-1 text-xs text-muted-foreground">
              {stage.externalInputs.map((input, idx) => (
                <li key={idx}>{input}</li>
              ))}
            </ul>
          </div>
        )}

        {stage.externalDeliverables && stage.externalDeliverables.length > 0 && (
          <div>
            <h4 className="text-xs uppercase tracking-wider font-semibold text-muted-foreground mb-1.5">Entregáveis / Saídas</h4>
            <ul className="list-disc list-inside space-y-1 text-xs text-muted-foreground">
              {stage.externalDeliverables.map((out, idx) => (
                <li key={idx} className="text-foreground">{out}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    );
  } else if (type === 'data') {
    const data = context.dataObjects.find((d) => d.id === id);
    if (!data) return null;
    title = data.name;
    badgeLabel = 'Objeto de Dado';
    const evidence = context.evidences.find((e) => e.id === data.evidenceId);

    content = (
      <div className="space-y-5 text-sm">
        <div>
          <h4 className="text-xs uppercase tracking-wider font-semibold text-muted-foreground mb-1">Significado de Negócio</h4>
          <p className="text-foreground leading-relaxed">{data.businessMeaning}</p>
        </div>

        <div className="grid grid-cols-2 gap-2 p-3 rounded-lg bg-muted/40 border border-border text-xs">
          <div>
            <span className="text-muted-foreground block text-[10px] uppercase font-semibold">Formato / Coleção</span>
            <span className="font-medium text-foreground">{data.collectionOrFormat}</span>
          </div>
          <div>
            <span className="text-muted-foreground block text-[10px] uppercase font-semibold">Tipo de Transferência</span>
            <span className={cn(
              "inline-block px-1.5 py-0.5 rounded text-[11px] font-medium mt-0.5",
              data.transferMechanism === 'manual' ? "bg-amber-100 text-amber-800 dark:bg-amber-950/50 dark:text-amber-300" :
              data.transferMechanism === 'direct_api' ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300" :
              "bg-sky-100 text-sky-800 dark:bg-sky-950/50 dark:text-sky-300"
            )}>
              {data.transferMechanism === 'manual' ? 'Manual (Intervenção Humana)' :
               data.transferMechanism === 'file_export_import' ? 'Arquivo Exportado / Importado' :
               data.transferMechanism === 'direct_api' ? 'Integração Direta (API)' : 'Desconhecido'}
            </span>
          </div>
        </div>

        {data.transferDetails && (
          <div>
            <h4 className="text-xs uppercase tracking-wider font-semibold text-muted-foreground mb-1">Como a Transferência Ocorre</h4>
            <p className="text-xs text-muted-foreground bg-card p-2.5 rounded border border-border">{data.transferDetails}</p>
          </div>
        )}

        <div>
          <h4 className="text-xs uppercase tracking-wider font-semibold text-muted-foreground mb-2">Campos Essenciais ({data.essentialFields.length})</h4>
          <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
            {data.essentialFields.map((field, idx) => (
              <div key={idx} className="p-2 rounded border border-border bg-card flex items-start justify-between text-xs">
                <div>
                  <span className="font-mono font-semibold text-foreground">{field.name}</span>
                  <p className="text-[11px] text-muted-foreground mt-0.5">{field.description}</p>
                </div>
                {field.isKeyIdentifier && (
                  <Badge variant="secondary" className="text-[9px] h-4">Chave</Badge>
                )}
              </div>
            ))}
          </div>
        </div>

        {evidence && (
          <div className="p-3 rounded-lg border border-primary/20 bg-primary/5 space-y-1">
            <div className="flex items-center gap-1.5 text-primary text-xs font-semibold">
              <ShieldCheck className="h-4 w-4" />
              <span>Evidência Vinculada</span>
            </div>
            <p className="text-xs font-medium text-foreground">{evidence.sourceTitle}</p>
            <p className="text-[11px] text-muted-foreground font-mono">{evidence.sourceReference}</p>
          </div>
        )}
      </div>
    );
  } else if (type === 'system') {
    const system = context.systems.find((s) => s.id === id);
    if (!system) return null;
    title = system.name;
    badgeLabel = 'Sistema / Canal';

    content = (
      <div className="space-y-5 text-sm">
        <div>
          <h4 className="text-xs uppercase tracking-wider font-semibold text-muted-foreground mb-1">Finalidade Operacional</h4>
          <p className="text-foreground leading-relaxed">{system.purpose}</p>
        </div>

        {system.moduleOrInterface && (
          <div className="text-xs p-2.5 rounded bg-muted/40 border border-border">
            <span className="text-muted-foreground block text-[10px] uppercase font-semibold mb-0.5">Interface / Módulo Identificado</span>
            <span className="font-mono text-foreground font-medium">{system.moduleOrInterface}</span>
          </div>
        )}

        <div>
          <h4 className="text-xs uppercase tracking-wider font-semibold text-muted-foreground mb-2">Operações Realizadas ({system.operations.length})</h4>
          <div className="space-y-1.5">
            {system.operations.map((op, idx) => (
              <div key={idx} className="p-2 rounded border border-border bg-card flex items-start justify-between text-xs">
                <div>
                  <span className="font-medium text-foreground">{op.name}</span>
                  <p className="text-[11px] text-muted-foreground mt-0.5">{op.description}</p>
                </div>
                <Badge variant="outline" className="text-[10px] uppercase font-normal">{op.operationType}</Badge>
              </div>
            ))}
          </div>
        </div>

        {system.limitations && system.limitations.length > 0 && (
          <div>
            <h4 className="text-xs uppercase tracking-wider font-semibold text-amber-600 dark:text-amber-400 mb-1.5">Gargalos & Limitações Conhecidas</h4>
            <ul className="list-disc list-inside space-y-1 text-xs text-muted-foreground">
              {system.limitations.map((lim, idx) => (
                <li key={idx}>{lim}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    );
  } else if (type === 't_shaped') {
    const focus = context.tShapedRecommendations.find((t) => t.id === id);
    if (!focus) return null;
    title = focus.title;
    badgeLabel = 'Recomendação T-Shaped';
    badgeVariant = 'secondary';

    content = (
      <div className="space-y-5 text-sm">
        <div className="p-3 rounded-lg bg-violet-50 dark:bg-violet-950/30 border border-violet-200 dark:border-violet-900 text-xs">
          <span className="text-violet-700 dark:text-violet-300 font-semibold block uppercase tracking-wider text-[10px] mb-1">Contribuição ao Resultado</span>
          <p className="text-foreground leading-relaxed font-medium">{focus.expectedContribution}</p>
        </div>

        <div>
          <h4 className="text-xs uppercase tracking-wider font-semibold text-muted-foreground mb-1">Por que Aprofundar Este Ponto? (Justificativa)</h4>
          <p className="text-foreground text-xs leading-relaxed bg-card p-3 rounded border border-border">{focus.investigationRationale}</p>
        </div>

        <div>
          <h4 className="text-xs uppercase tracking-wider font-semibold text-muted-foreground mb-1.5">Evidências que Sustentam o Foco</h4>
          <ul className="space-y-1.5 text-xs text-muted-foreground">
            {focus.availableEvidences.map((ev, idx) => (
              <li key={idx} className="flex items-start gap-2 p-2 rounded bg-muted/40 border border-border">
                <FileCheck className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                <span>{ev}</span>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-xs uppercase tracking-wider font-semibold text-amber-600 dark:text-amber-400 mb-1.5">Incertezas Conhecidas</h4>
          <ul className="list-disc list-inside space-y-1 text-xs text-muted-foreground">
            {focus.uncertainties.map((unc, idx) => (
              <li key={idx}>{unc}</li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-xs uppercase tracking-wider font-semibold text-primary mb-1.5">Perguntas a Investigar</h4>
          <div className="space-y-1.5">
            {focus.investigativeQuestions.map((q, idx) => (
              <div key={idx} className="p-2.5 rounded bg-primary/5 border border-primary/20 text-xs text-foreground flex items-start gap-2">
                <HelpCircle className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                <span>{q}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="pt-2">
          <Button
            size="sm"
            className="w-full gap-2"
            onClick={() => {
              closeDrawer();
              setActiveSubTab('review');
            }}
          >
            <MessageSquare className="h-4 w-4" />
            Abrir Questões Relacionadas na Revisão Guiada
          </Button>
        </div>
      </div>
    );
  } else if (type === 'decision') {
    const fromList = context.decisions?.find((d) => d.id === id);
    const act = context.activities.find((a) => a.decisions.some((d) => d.id === id));
    const decision = fromList || act?.decisions.find((d) => d.id === id);
    if (!decision) return null;
    title = decision.title;
    badgeLabel = 'Decisão Crítica (Bifurcação)';

    content = (
      <div className="space-y-5 text-sm">
        <div>
          <h4 className="text-xs uppercase tracking-wider font-semibold text-muted-foreground mb-1">Pergunta da Decisão</h4>
          <p className="text-foreground font-medium bg-muted/40 p-2.5 rounded border border-border">{decision.question}</p>
        </div>

        {decision.authorityThreshold && (
          <div className="p-3 rounded-lg bg-primary/5 border border-primary/20 text-xs">
            <span className="text-[10px] uppercase font-bold text-primary block mb-0.5">Alçada / Limite de Corte</span>
            <span className="font-semibold text-foreground">{decision.authorityThreshold}</span>
            {decision.policyReference && (
              <span className="text-muted-foreground block text-[11px] mt-0.5">Governada por: {decision.policyReference}</span>
            )}
          </div>
        )}

        <div>
          <h4 className="text-xs uppercase tracking-wider font-semibold text-muted-foreground mb-1.5">Caminhos / Desdobramentos Possíveis</h4>
          <div className="space-y-1.5">
            {decision.possibleOutcomes.map((outcome, idx) => (
              <div key={idx} className="p-2 rounded bg-card border border-border text-xs font-medium text-foreground flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                <span>{outcome}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="p-2.5 rounded border border-border bg-card">
            <span className="text-[10px] uppercase font-semibold text-muted-foreground block mb-0.5">Responsável</span>
            <span className="font-medium text-foreground">{decision.responsibleRole}</span>
          </div>
          <div className="p-2.5 rounded border border-border bg-card">
            <span className="text-[10px] uppercase font-semibold text-muted-foreground block mb-0.5">Status</span>
            <Badge variant="outline" className="text-[10px] font-normal uppercase">{decision.status}</Badge>
          </div>
        </div>

        <div>
          <h4 className="text-xs uppercase tracking-wider font-semibold text-muted-foreground mb-1">Tratamento de Informação Ausente</h4>
          <p className="text-xs text-muted-foreground p-2 rounded bg-muted/30 border border-border">{decision.handlingMissingInfo}</p>
        </div>
      </div>
    );
  } else if (type === 'rule') {
    const rule = context.businessRules?.find((r) => r.code === id || r.id === id);
    if (!rule) return null;
    title = `${rule.code}: ${rule.name}`;
    badgeLabel = 'Regra de Negócio';
    badgeVariant = rule.hasPolicyGap ? 'secondary' : 'outline';

    content = (
      <div className="space-y-5 text-sm">
        <div>
          <h4 className="text-xs uppercase tracking-wider font-semibold text-muted-foreground mb-1">Descrição Operacional</h4>
          <p className="text-foreground leading-relaxed">{rule.description}</p>
        </div>

        {rule.hasPolicyGap ? (
          <div className="p-3 rounded-lg bg-amber-50 dark:bg-amber-950/30 border border-amber-300 dark:border-amber-800 text-xs">
            <div className="flex items-center gap-1.5 font-bold text-amber-900 dark:text-amber-200 mb-1">
              <AlertCircle className="h-4 w-4 text-amber-600" />
              <span>Risco de Governança: Sem Política Formal</span>
            </div>
            <p className="text-amber-800 dark:text-amber-300 text-[11px] leading-relaxed">
              Esta regra é observada na prática operacional cotidiana, mas não possui sustentação em manual normativo corporativo.
            </p>
          </div>
        ) : (
          <div className="p-3 rounded-lg bg-muted/30 border border-border text-xs space-y-1">
            <span className="text-[10px] uppercase font-bold text-muted-foreground block">Política de Origem</span>
            <p className="font-semibold text-foreground">{rule.policyTitle}</p>
            <p className="text-[11px] text-muted-foreground font-mono">{rule.evidenceSection}</p>
          </div>
        )}

        <div className="p-3 rounded-xl bg-card border border-border space-y-2 text-xs">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-bold text-muted-foreground">Condição de Disparo:</span>
            <span className="font-mono text-primary font-bold">{rule.conditionExpression}</span>
          </div>
          <div className="pt-2 border-t border-border/60 flex items-center justify-between">
            <span className="text-[10px] uppercase font-bold text-muted-foreground">Alçada / Limite:</span>
            <span className="font-medium text-foreground">{rule.authorityLimits}</span>
          </div>
        </div>

        {rule.exceptions && rule.exceptions.length > 0 && (
          <div>
            <h4 className="text-xs uppercase tracking-wider font-semibold text-violet-700 dark:text-violet-300 mb-1">Tratamento de Exceções</h4>
            <ul className="space-y-1 text-xs text-muted-foreground">
              {rule.exceptions.map((exc, idx) => (
                <li key={idx} className="p-2 rounded bg-violet-50/50 dark:bg-violet-950/20 border border-violet-200 dark:border-violet-900 text-foreground">
                  {exc}
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="space-y-1 text-xs">
          <span className="text-[10px] uppercase font-bold text-muted-foreground block">Tratamento de Dados Incompletos:</span>
          <p className="p-2 rounded bg-muted/20 border border-border text-muted-foreground">{rule.missingDataTreatment}</p>
        </div>

        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="p-2 rounded border border-border bg-card">
            <span className="text-[10px] uppercase font-semibold text-muted-foreground block mb-0.5">Responsável</span>
            <span className="font-medium text-foreground">{rule.responsibleRole}</span>
          </div>
          <div className="p-2 rounded border border-border bg-card">
            <span className="text-[10px] uppercase font-semibold text-muted-foreground block mb-0.5">Vigência</span>
            <span className="font-medium text-foreground">{rule.effectiveDate}</span>
          </div>
        </div>
      </div>
    );
  } else if (type === 'policy') {
    const policy = context.policies?.find((p) => p.id === id || p.code === id);
    if (!policy) return null;
    title = `${policy.code}: ${policy.title}`;
    badgeLabel = 'Política Normativa';

    content = (
      <div className="space-y-5 text-sm">
        <div>
          <h4 className="text-xs uppercase tracking-wider font-semibold text-muted-foreground mb-1">Resumo Executivo</h4>
          <p className="text-foreground leading-relaxed">{policy.summary}</p>
        </div>

        <div className="p-3 rounded-xl bg-muted/40 border border-border text-xs space-y-2">
          <div className="flex justify-between">
            <span className="text-muted-foreground font-medium">Versão Atual:</span>
            <span className="font-bold text-foreground">{policy.version}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground font-medium">Data de Vigência:</span>
            <span className="font-medium text-foreground">{policy.effectiveDate}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground font-medium">Responsável Normativo:</span>
            <span className="font-medium text-foreground">{policy.responsibleRole}</span>
          </div>
        </div>

        <div>
          <h4 className="text-xs uppercase tracking-wider font-semibold text-muted-foreground mb-1">Documento Original de Evidência</h4>
          <div className="p-2.5 rounded-lg border border-primary/20 bg-primary/5 text-xs text-primary flex items-center gap-2">
            <FileText className="h-4 w-4 shrink-0" />
            <span className="truncate font-mono">{policy.sourceDocument}</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <aside className="fixed right-0 top-14 bottom-0 w-[420px] max-w-[95vw] bg-card border-l border-border shadow-2xl z-30 flex flex-col animate-in slide-in-from-right duration-200">
      <div className="p-4 border-b border-border flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Badge variant={badgeVariant} className="text-[11px] font-medium">
            {badgeLabel}
          </Badge>
        </div>
        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={closeDrawer}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      <div className="p-5 overflow-y-auto flex-1 space-y-4">
        <h3 className="text-lg font-semibold text-foreground leading-snug">{title}</h3>
        <Separator />
        {content}
      </div>
    </aside>
  );
}
