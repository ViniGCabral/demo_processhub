import React, { useState } from 'react';
import { Scale, FileText, GitFork, AlertTriangle, ShieldCheck, Search, ArrowRight, Clock, ChevronDown, ChevronUp, CheckCircle2, BookOpen, Layers, Link2, ExternalLink, Eye, EyeOff, Filter } from 'lucide-react';
import { useProcessContextStore } from '@/stores/processContextStore';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import type { ProcessContextModel, BusinessRule, ContextPolicy } from '@/types/processContext';

interface RulesPoliciesTabProps {
  context: ProcessContextModel;
}

export function RulesPoliciesTab({ context }: RulesPoliciesTabProps) {
  const { setSelectedItem } = useProcessContextStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [onlyPolicyGaps, setOnlyPolicyGaps] = useState(false);
  const [expandedRules, setExpandedRules] = useState<Record<string, boolean>>({});
  const [linkingRuleId, setLinkingRuleId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'cards' | 'relational'>('cards');

  const policies = context.policies || [];
  const rules = context.businessRules || [];

  // Filtered rules
  const filteredRules = rules.filter((r) => {
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      const matches =
        r.code.toLowerCase().includes(term) ||
        r.name.toLowerCase().includes(term) ||
        r.description.toLowerCase().includes(term) ||
        r.conditionExpression.toLowerCase().includes(term);
      if (!matches) return false;
    }
    if (statusFilter !== 'all' && r.status !== statusFilter) return false;
    if (onlyPolicyGaps && !r.hasPolicyGap) return false;
    return true;
  });

  const policyGapsCount = rules.filter((r) => r.hasPolicyGap).length;

  const toggleRuleExpanded = (ruleId: string) => {
    setExpandedRules((prev) => ({ ...prev, [ruleId]: !prev[ruleId] }));
  };

  const getLinkedPolicy = (rule: BusinessRule): ContextPolicy | undefined => {
    if (!rule.policyId) return undefined;
    return policies.find((p) => p.id === rule.policyId);
  };

  const getLinkedDecision = (rule: BusinessRule) => {
    return context.decisions?.find((d) => d.id === rule.decisionId);
  };

  const getLinkedActivities = (rule: BusinessRule) => {
    return context.activities?.filter((a) => rule.activityIds.includes(a.id)) || [];
  };

  const statusLabels: Record<string, { label: string; color: string }> = {
    active: { label: 'Ativa', color: 'text-emerald-700 border-emerald-300 bg-emerald-50 dark:text-emerald-300 dark:border-emerald-800 dark:bg-emerald-950/30' },
    in_validation: { label: 'Em Validação', color: 'text-amber-700 border-amber-300 bg-amber-50 dark:text-amber-300 dark:border-amber-800 dark:bg-amber-950/30' },
    suggested: { label: 'Sugerida', color: 'text-blue-700 border-blue-300 bg-blue-50 dark:text-blue-300 dark:border-blue-800 dark:bg-blue-950/30' },
    suspended: { label: 'Suspensa', color: 'text-rose-700 border-rose-300 bg-rose-50 dark:text-rose-300 dark:border-rose-800 dark:bg-rose-950/30' },
    expired: { label: 'Expirada', color: 'text-gray-600 border-gray-300 bg-gray-50 dark:text-gray-400 dark:border-gray-700 dark:bg-gray-900/30' },
    superseded: { label: 'Substituída', color: 'text-gray-600 border-gray-300 bg-gray-50 dark:text-gray-400 dark:border-gray-700 dark:bg-gray-900/30' },
  };

  return (
    <div className="space-y-5 animate-in fade-in-50 duration-200">
      {/* Unified Header */}
      <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="p-2.5 rounded-xl bg-primary/10 text-primary">
              <Scale className="h-5 w-5" />
            </span>
            <div>
              <h2 className="text-lg font-semibold text-foreground tracking-tight">
                Regras de Negócio e Políticas
              </h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                Repositório integrado de regras operacionais e suas políticas normativas vinculadas.
              </p>
            </div>
          </div>

          {/* Stats Pills */}
          <div className="flex flex-wrap items-center gap-2.5 text-xs">
            <div className="px-3 py-1.5 rounded-lg bg-muted/40 border border-border flex items-center gap-2">
              <BookOpen className="h-3.5 w-3.5 text-primary" />
              <span><strong>{policies.length}</strong> Políticas</span>
            </div>
            <div className="px-3 py-1.5 rounded-lg bg-muted/40 border border-border flex items-center gap-2">
              <Scale className="h-3.5 w-3.5 text-emerald-600" />
              <span><strong>{rules.length}</strong> Regras</span>
            </div>
            {policyGapsCount > 0 && (
              <button
                onClick={() => setOnlyPolicyGaps((prev) => !prev)}
                className={cn(
                  "px-3 py-1.5 rounded-lg border flex items-center gap-1.5 font-medium transition-all",
                  onlyPolicyGaps
                    ? "bg-amber-100 dark:bg-amber-950/60 border-amber-400 dark:border-amber-700 text-amber-800 dark:text-amber-300"
                    : "bg-amber-50/60 dark:bg-amber-950/30 border-amber-300 dark:border-amber-800 text-amber-700 dark:text-amber-400 hover:border-amber-400"
                )}
              >
                <AlertTriangle className="h-3 w-3" />
                <span>{policyGapsCount} sem política</span>
              </button>
            )}
          </div>
        </div>

        {/* Filter Bar */}
        <div className="mt-4 pt-3.5 border-t border-border flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 flex-1 min-w-[200px]">
            <Search className="h-4 w-4 text-muted-foreground shrink-0" />
            <Input
              placeholder="Buscar por código, nome ou condição..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="h-8 text-xs max-w-sm"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2 text-xs">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="h-8 w-[140px] text-xs">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os Status</SelectItem>
                <SelectItem value="active">Ativa</SelectItem>
                <SelectItem value="in_validation">Em Validação</SelectItem>
                <SelectItem value="suggested">Sugerida</SelectItem>
              </SelectContent>
            </Select>

            {/* View Toggle */}
            <div className="flex items-center rounded-lg bg-muted/50 p-0.5 border border-border">
              <button
                onClick={() => setViewMode('cards')}
                className={cn(
                  "px-2.5 py-1 rounded-md text-[11px] font-medium transition-all",
                  viewMode === 'cards' ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                )}
              >
                Cards
              </button>
              <button
                onClick={() => setViewMode('relational')}
                className={cn(
                  "px-2.5 py-1 rounded-md text-[11px] font-medium transition-all",
                  viewMode === 'relational' ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                )}
              >
                Relacional
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* UNIFIED VIEW: Cards Mode */}
      {viewMode === 'cards' && (
        <div className="space-y-3">
          {filteredRules.map((rule) => {
            const linkedPolicy = getLinkedPolicy(rule);
            const linkedDecision = getLinkedDecision(rule);
            const linkedActivities = getLinkedActivities(rule);
            const isExpanded = !!expandedRules[rule.id];
            const statusInfo = statusLabels[rule.status] || statusLabels.active;

            return (
              <div
                key={rule.id}
                className={cn(
                  "rounded-2xl border bg-card transition-all overflow-hidden",
                  rule.hasPolicyGap
                    ? "border-amber-300/80 dark:border-amber-800/60"
                    : "border-border hover:border-primary/30"
                )}
              >
                {/* Rule Main Row */}
                <div className="p-5">
                  <div className="flex items-start gap-4">
                    {/* Left: Rule Core Info */}
                    <div className="flex-1 min-w-0 space-y-2.5">
                      {/* Title Line */}
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-mono text-xs font-bold text-primary">{rule.code}</span>
                        <Badge variant="outline" className={cn("text-[10px] h-4 font-normal", statusInfo.color)}>
                          {statusInfo.label}
                        </Badge>
                        {rule.hasPolicyGap && (
                          <Badge variant="outline" className="text-[10px] h-4 text-amber-700 dark:text-amber-300 border-amber-300 dark:border-amber-700 bg-amber-50/60 dark:bg-amber-950/30 gap-1 font-medium">
                            <AlertTriangle className="h-2.5 w-2.5" />
                            Sem Política Formal
                          </Badge>
                        )}
                      </div>

                      <h3
                        className="font-semibold text-sm text-foreground leading-snug cursor-pointer hover:text-primary transition-colors"
                        onClick={() => setSelectedItem({ type: 'rule', id: rule.id })}
                      >
                        {rule.name}
                      </h3>

                      <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
                        {rule.description}
                      </p>

                      {/* Condition & Authority in compact row */}
                      <div className="flex flex-wrap items-center gap-3 text-[11px]">
                        <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md bg-muted/50 border border-border/80 font-mono text-foreground">
                          <span className="text-[9px] uppercase font-bold text-muted-foreground tracking-wider">SE</span>
                          {rule.conditionExpression}
                        </span>
                        <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md bg-muted/50 border border-border/80 text-foreground">
                          <span className="text-[9px] uppercase font-bold text-muted-foreground tracking-wider">Alçada</span>
                          {rule.authorityLimits}
                        </span>
                      </div>
                    </div>

                    {/* Right: Policy Card (Linked or Empty) */}
                    <div className="w-[220px] shrink-0">
                      {linkedPolicy ? (
                        <div
                          onClick={() => setSelectedItem({ type: 'policy', id: linkedPolicy.id })}
                          className="p-3 rounded-xl border border-primary/20 bg-primary/5 hover:border-primary/40 cursor-pointer transition-all space-y-1.5"
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-[9px] uppercase font-bold text-primary tracking-wider">Política Vinculada</span>
                            <BookOpen className="h-3 w-3 text-primary/60" />
                          </div>
                          <p className="text-[11px] font-bold text-foreground leading-snug line-clamp-2">
                            {linkedPolicy.title}
                          </p>
                          <div className="flex items-center justify-between text-[10px] text-muted-foreground">
                            <span className="font-mono">{linkedPolicy.code} {linkedPolicy.version}</span>
                            <Badge variant="secondary" className="text-[9px] h-3.5 font-normal">
                              {linkedPolicy.status === 'active' ? 'Vigente' : linkedPolicy.status}
                            </Badge>
                          </div>
                          {rule.evidenceSection && (
                            <p className="text-[10px] text-muted-foreground truncate pt-0.5 border-t border-primary/10">
                              {rule.evidenceSection}
                            </p>
                          )}
                        </div>
                      ) : (
                        <div className="p-3 rounded-xl border border-dashed border-amber-300 dark:border-amber-700/60 bg-amber-50/30 dark:bg-amber-950/20 space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-[9px] uppercase font-bold text-amber-600 dark:text-amber-400 tracking-wider">Política</span>
                            <AlertTriangle className="h-3 w-3 text-amber-500" />
                          </div>
                          <p className="text-[11px] text-amber-700 dark:text-amber-400 italic">
                            Nenhuma política formal identificada
                          </p>

                          <Popover open={linkingRuleId === rule.id} onOpenChange={(open) => setLinkingRuleId(open ? rule.id : null)}>
                            <PopoverTrigger asChild>
                              <button className="w-full text-[10px] font-medium text-primary hover:text-primary/80 flex items-center justify-center gap-1 py-1 rounded-md border border-primary/20 hover:bg-primary/5 transition-all">
                                <Link2 className="h-3 w-3" />
                                Vincular Política
                              </button>
                            </PopoverTrigger>
                            <PopoverContent className="w-64 p-2" align="end">
                              <div className="space-y-1.5">
                                <p className="text-xs font-semibold text-foreground px-1">Selecione a política:</p>
                                {policies.map((p) => (
                                  <button
                                    key={p.id}
                                    onClick={() => {
                                      // In a real app, this would update the rule's policyId
                                      setLinkingRuleId(null);
                                    }}
                                    className="w-full text-left p-2 rounded-lg border border-border hover:border-primary/50 hover:bg-primary/5 transition-all text-xs space-y-0.5"
                                  >
                                    <span className="font-mono text-[10px] text-primary font-bold">{p.code} {p.version}</span>
                                    <p className="font-medium text-foreground leading-snug line-clamp-1">{p.title}</p>
                                  </button>
                                ))}
                                <div className="pt-1 border-t border-border">
                                  <button className="w-full text-[11px] text-muted-foreground hover:text-foreground p-1.5 rounded-md hover:bg-muted transition-all text-center">
                                    + Cadastrar nova política
                                  </button>
                                </div>
                              </div>
                            </PopoverContent>
                          </Popover>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Bottom meta row */}
                  <div className="mt-3 pt-2.5 border-t border-border/50 flex flex-wrap items-center justify-between gap-2 text-[11px] text-muted-foreground">
                    <div className="flex flex-wrap items-center gap-3">
                      <span>Resp: <strong className="text-foreground">{rule.responsibleRole}</strong></span>
                      <span>Vigência: {rule.effectiveDate}</span>
                      {rule.dependentAgents.length > 0 && (
                        <span className="text-violet-600 dark:text-violet-400 font-medium">
                          {rule.dependentAgents.length} agente(s) dependente(s)
                        </span>
                      )}
                    </div>

                    <button
                      onClick={() => toggleRuleExpanded(rule.id)}
                      className="text-primary hover:underline flex items-center gap-0.5 font-medium"
                    >
                      {isExpanded ? 'Recolher' : 'Ver conexões'}
                      {isExpanded ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
                    </button>
                  </div>
                </div>

                {/* Expanded: Relational connections */}
                {isExpanded && (
                  <div className="border-t border-border bg-muted/10 p-4 space-y-3">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      {/* Decision */}
                      {linkedDecision && (
                        <div
                          onClick={() => setSelectedItem({ type: 'decision', id: linkedDecision.id })}
                          className="p-3 rounded-xl border border-border bg-card hover:border-primary/40 cursor-pointer transition-all space-y-1.5"
                        >
                          <div className="flex items-center gap-1.5 text-[10px] uppercase font-bold text-muted-foreground">
                            <GitFork className="h-3 w-3 text-primary" />
                            Decisão Vinculada
                          </div>
                          <p className="text-xs font-semibold text-foreground leading-snug line-clamp-2">
                            {linkedDecision.question}
                          </p>
                          {linkedDecision.authorityThreshold && (
                            <Badge variant="outline" className="text-[9px] h-4 text-primary border-primary/30 font-normal">
                              Limite: {linkedDecision.authorityThreshold}
                            </Badge>
                          )}
                          <div className="grid grid-cols-2 gap-1 pt-1">
                            {linkedDecision.possibleOutcomes.slice(0, 2).map((outcome, oIdx) => (
                              <div
                                key={oIdx}
                                className={cn(
                                  "p-1 rounded text-[9px] font-medium text-center truncate border",
                                  oIdx === 0
                                    ? "bg-emerald-50/80 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800"
                                    : "bg-amber-50/80 text-amber-700 dark:bg-amber-950/30 dark:text-amber-300 border-amber-200 dark:border-amber-800"
                                )}
                              >
                                {outcome}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Activities */}
                      <div className="p-3 rounded-xl border border-border bg-card space-y-1.5">
                        <div className="text-[10px] uppercase font-bold text-muted-foreground">
                          Atividades Impactadas ({linkedActivities.length})
                        </div>
                        <div className="space-y-1">
                          {linkedActivities.map((act) => (
                            <div
                              key={act.id}
                              onClick={() => setSelectedItem({ type: 'activity', id: act.id })}
                              className="flex items-center gap-2 text-xs p-1.5 rounded-lg hover:bg-muted/30 cursor-pointer transition-all"
                            >
                              <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                              <span className="font-mono text-[10px] text-muted-foreground">{act.code}</span>
                              <span className="font-medium text-foreground truncate">{act.name}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Exceptions & Extras */}
                      <div className="p-3 rounded-xl border border-border bg-card space-y-1.5">
                        <div className="text-[10px] uppercase font-bold text-muted-foreground">
                          Exceções e Tratamentos
                        </div>
                        {rule.exceptions && rule.exceptions.length > 0 ? (
                          <ul className="space-y-1 text-xs">
                            {rule.exceptions.map((exc, i) => (
                              <li key={i} className="flex items-start gap-1.5 text-muted-foreground">
                                <span className="text-amber-500 font-bold mt-0.5">!</span>
                                <span className="leading-relaxed">{exc}</span>
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <p className="text-xs text-muted-foreground italic">Sem exceções registradas.</p>
                        )}
                        <div className="pt-1.5 border-t border-border/50 text-[10px] text-muted-foreground">
                          <span className="font-medium">Dado ausente:</span> {rule.missingDataTreatment}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}

          {filteredRules.length === 0 && (
            <div className="p-10 text-center text-muted-foreground text-sm rounded-2xl border border-dashed border-border">
              Nenhuma regra encontrada com os filtros aplicados.
            </div>
          )}
        </div>
      )}

      {/* UNIFIED VIEW: Relational Mode */}
      {viewMode === 'relational' && (
        <div className="space-y-4">
          {/* Column Headers */}
          <div className="grid grid-cols-4 gap-3 text-[10px] font-bold text-muted-foreground uppercase tracking-wider text-center">
            <div className="p-2 rounded-lg bg-muted/30 border border-border">Política Normativa</div>
            <div className="p-2 rounded-lg bg-muted/30 border border-border">Regra de Negócio</div>
            <div className="p-2 rounded-lg bg-muted/30 border border-border">Decisão (Bifurcação)</div>
            <div className="p-2 rounded-lg bg-muted/30 border border-border">Atividade Operacional</div>
          </div>

          {/* Relational Rows */}
          {filteredRules.map((rule) => {
            const linkedPolicy = getLinkedPolicy(rule);
            const linkedDecision = getLinkedDecision(rule);
            const linkedActivities = getLinkedActivities(rule);
            const statusInfo = statusLabels[rule.status] || statusLabels.active;

            return (
              <div
                key={rule.id}
                className={cn(
                  "grid grid-cols-4 gap-3 items-stretch",
                  rule.hasPolicyGap && "opacity-95"
                )}
              >
                {/* Col 1: Policy */}
                {linkedPolicy ? (
                  <div
                    onClick={() => setSelectedItem({ type: 'policy', id: linkedPolicy.id })}
                    className="p-3.5 rounded-xl border border-primary/20 bg-primary/5 hover:border-primary/40 cursor-pointer transition-all flex flex-col justify-between"
                  >
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono font-bold text-primary">{linkedPolicy.code} {linkedPolicy.version}</span>
                        <Badge variant="secondary" className="text-[9px] h-3.5">Governa</Badge>
                      </div>
                      <p className="text-[11px] font-bold text-foreground leading-snug line-clamp-2">
                        {linkedPolicy.title}
                      </p>
                    </div>
                    <div className="pt-2 mt-2 border-t border-primary/10 text-[10px] text-muted-foreground truncate">
                      {linkedPolicy.sourceDocument.split(' (')[0]}
                    </div>
                  </div>
                ) : (
                  <div className="p-3.5 rounded-xl border border-dashed border-amber-300 dark:border-amber-700/60 bg-amber-50/20 dark:bg-amber-950/15 flex flex-col items-center justify-center text-center space-y-1.5">
                    <AlertTriangle className="h-4 w-4 text-amber-500" />
                    <p className="text-[10px] text-amber-600 dark:text-amber-400 font-medium italic">
                      Sem política formal
                    </p>
                    <button
                      onClick={() => setLinkingRuleId(rule.id)}
                      className="text-[10px] font-medium text-primary hover:underline flex items-center gap-0.5"
                    >
                      <Link2 className="h-2.5 w-2.5" />
                      Vincular
                    </button>
                  </div>
                )}

                {/* Col 2: Rule */}
                <div
                  onClick={() => setSelectedItem({ type: 'rule', id: rule.id })}
                  className="p-3.5 rounded-xl border border-border bg-card hover:border-primary/40 cursor-pointer transition-all flex flex-col justify-between shadow-sm"
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono font-bold text-muted-foreground">{rule.code}</span>
                      <Badge variant="outline" className={cn("text-[9px] h-3.5 font-normal", statusInfo.color)}>
                        {statusInfo.label}
                      </Badge>
                    </div>
                    <p className="text-[11px] font-bold text-foreground leading-snug line-clamp-2">
                      {rule.name}
                    </p>
                    <div className="p-1.5 rounded bg-muted/40 font-mono text-[10px] text-primary font-semibold truncate">
                      {rule.conditionExpression}
                    </div>
                  </div>
                  <div className="pt-2 mt-2 border-t border-border text-[10px] text-muted-foreground flex items-center justify-between">
                    <span>{rule.authorityLimits}</span>
                    <span className="text-primary font-semibold">&rarr;</span>
                  </div>
                </div>

                {/* Col 3: Decision */}
                {linkedDecision ? (
                  <div
                    onClick={() => setSelectedItem({ type: 'decision', id: linkedDecision.id })}
                    className="p-3.5 rounded-xl border border-border bg-card hover:border-primary/40 cursor-pointer transition-all flex flex-col justify-between shadow-sm"
                  >
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] uppercase font-bold text-muted-foreground">Bifurcação</span>
                        <GitFork className="h-3 w-3 text-primary" />
                      </div>
                      <p className="text-[11px] font-bold text-foreground leading-snug line-clamp-2">
                        {linkedDecision.question}
                      </p>
                      <div className="space-y-1">
                        {linkedDecision.possibleOutcomes.slice(0, 2).map((outcome, oIdx) => (
                          <div
                            key={oIdx}
                            className={cn(
                              "p-1 rounded text-[10px] font-medium border",
                              oIdx === 0
                                ? "bg-emerald-50/80 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800"
                                : "bg-amber-50/80 text-amber-700 dark:bg-amber-950/30 dark:text-amber-300 border-amber-200 dark:border-amber-800"
                            )}
                          >
                            {outcome}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="p-3.5 rounded-xl border border-dashed border-border bg-muted/10 flex items-center justify-center text-[10px] text-muted-foreground italic">
                    Sem decisão vinculada
                  </div>
                )}

                {/* Col 4: Activities */}
                <div className="p-3.5 rounded-xl border border-border bg-muted/10 flex flex-col justify-between">
                  <div className="space-y-1.5">
                    <span className="text-[10px] uppercase font-bold text-muted-foreground block">
                      Atividade(s) ({linkedActivities.length})
                    </span>
                    {linkedActivities.slice(0, 2).map((act) => (
                      <div
                        key={act.id}
                        onClick={() => setSelectedItem({ type: 'activity', id: act.id })}
                        className="p-1.5 rounded-lg border border-border bg-card hover:border-primary/40 cursor-pointer transition-all text-[11px]"
                      >
                        <span className="font-mono text-[9px] text-muted-foreground">{act.code}</span>
                        <p className="font-medium text-foreground leading-snug line-clamp-1">{act.name}</p>
                      </div>
                    ))}
                  </div>
                  <div className="pt-2 mt-2 border-t border-border/50 text-[10px] text-muted-foreground">
                    Resp: {rule.responsibleRole}
                  </div>
                </div>
              </div>
            );
          })}

          {filteredRules.length === 0 && (
            <div className="p-10 text-center text-muted-foreground text-sm rounded-2xl border border-dashed border-border">
              Nenhuma regra encontrada com os filtros aplicados.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
