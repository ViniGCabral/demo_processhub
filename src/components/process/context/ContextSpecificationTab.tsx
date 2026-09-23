import React, { useState, useMemo } from 'react';
import { FileText, Scale, AlertTriangle, Search, Filter, Map, List, ChevronDown, ChevronRight, CheckCircle2, Clock, ArrowDown, User, GitFork, ShieldAlert } from 'lucide-react';
import { useProcessContextStore } from '@/stores/processContextStore';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';
import type { ContextSpecData, FunctionalRequirement, BusinessRuleSpec, SpecItemStatus, GapStatus } from '@/types/processContext';

interface ContextSpecificationTabProps {
  specData: ContextSpecData;
  processId: string;
}

function getStatusLabel(status: SpecItemStatus): string {
  const labels: Record<SpecItemStatus, string> = {
    draft: 'Rascunho', in_validation: 'Em validação', confirmed: 'Confirmado',
    pending_gap: 'Pendente de GAP', updated: 'Atualizado', deprecated: 'Depreciado',
  };
  return labels[status];
}

function getStatusColor(status: SpecItemStatus): string {
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

export function ContextSpecificationTab({ specData, processId }: ContextSpecificationTabProps) {
  const {
    specSubView, setSpecSubView,
    specViewMode, setSpecViewMode,
    setSelectedSpecItem,
    specFilters, setSpecFilters, resetSpecFilters,
  } = useProcessContextStore();

  const [expandedStages, setExpandedStages] = useState<Record<string, boolean>>(
    Object.fromEntries(specData.macroStages.map((s) => [s.id, true]))
  );
  const [mapFilter, setMapFilter] = useState<'all' | 'gaps' | 'rules' | 'decisions'>('all');

  // ── Filtered Lists ──
  const filteredRFs = useMemo(() => {
    return specData.functionalRequirements.filter((rf) => {
      if (specFilters.search) {
        const term = specFilters.search.toLowerCase();
        if (!rf.id.toLowerCase().includes(term) && !rf.title.toLowerCase().includes(term) && !rf.description.toLowerCase().includes(term)) return false;
      }
      if (specFilters.stageId !== 'all' && rf.relatedStageId !== specFilters.stageId) return false;
      if (specFilters.status !== 'all' && rf.validationStatus !== specFilters.status) return false;
      if (specFilters.hasGap === 'yes' && rf.relatedGapIds.length === 0) return false;
      if (specFilters.hasGap === 'no' && rf.relatedGapIds.length > 0) return false;
      return true;
    });
  }, [specData.functionalRequirements, specFilters]);

  const filteredRNs = useMemo(() => {
    return specData.businessRules.filter((rn) => {
      if (specFilters.search) {
        const term = specFilters.search.toLowerCase();
        if (!rn.id.toLowerCase().includes(term) && !rn.title.toLowerCase().includes(term) && !rn.statement.toLowerCase().includes(term)) return false;
      }
      if (specFilters.stageId !== 'all' && rn.relatedStageId !== specFilters.stageId) return false;
      if (specFilters.status !== 'all' && rn.status !== specFilters.status) return false;
      if (specFilters.hasGap === 'yes' && rn.relatedGapIds.length === 0) return false;
      if (specFilters.hasGap === 'no' && rn.relatedGapIds.length > 0) return false;
      return true;
    });
  }, [specData.businessRules, specFilters]);

  const filteredGaps = useMemo(() => {
    return specData.gaps.filter((g) => {
      if (specFilters.search) {
        const term = specFilters.search.toLowerCase();
        if (!g.id.toLowerCase().includes(term) && !g.title.toLowerCase().includes(term)) return false;
      }
      if (specFilters.stageId !== 'all' && g.relatedStageId !== specFilters.stageId) return false;
      if (specFilters.status !== 'all' && g.status !== specFilters.status) return false;
      return true;
    });
  }, [specData.gaps, specFilters]);

  const toggleStage = (stageId: string) => {
    setExpandedStages((prev) => ({ ...prev, [stageId]: !prev[stageId] }));
  };

  const hasActiveFilters = specFilters.search || specFilters.stageId !== 'all' || specFilters.status !== 'all' || specFilters.hasGap !== 'all';

  return (
    <div className="space-y-5 animate-in fade-in-50 duration-200">
      {/* Top Bar */}
      <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h2 className="text-base font-bold text-foreground tracking-tight mb-0.5">
              Especificação Funcional
            </h2>
            <p className="text-xs text-muted-foreground">
              Consulte requisitos, regras e o mapa do processo. {specData.specification.version} — {specData.specification.status === 'in_validation' ? 'Em validação' : specData.specification.status}
            </p>
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center rounded-xl bg-muted/60 p-1 border border-border shrink-0">
            <button
              onClick={() => setSpecViewMode('list')}
              className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors",
                specViewMode === 'list' ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
              )}
            >
              <List className="h-3.5 w-3.5" />
              Lista
            </button>
            <button
              onClick={() => setSpecViewMode('map')}
              className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors",
                specViewMode === 'map' ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Map className="h-3.5 w-3.5" />
              Mapa
            </button>
          </div>
        </div>

        {/* Filters (for list view) */}
        {specViewMode === 'list' && (
          <div className="mt-4 pt-3 border-t border-border flex flex-wrap items-center gap-3">
            <div className="relative flex-1 min-w-[200px] max-w-[320px]">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
              <Input
                placeholder="Buscar por ID, título ou descrição..."
                value={specFilters.search}
                onChange={(e) => setSpecFilters({ search: e.target.value })}
                className="pl-8 h-8 text-xs"
              />
            </div>

            {/* Sub-view tabs */}
            <div className="flex items-center rounded-lg bg-muted/50 p-0.5 border border-border">
              {([
                { key: 'requirements', label: 'Requisitos', icon: FileText, count: filteredRFs.length },
                { key: 'rules', label: 'Regras', icon: Scale, count: filteredRNs.length },
                { key: 'gaps', label: 'Pendências', icon: AlertTriangle, count: filteredGaps.length },
              ] as const).map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setSpecSubView(tab.key)}
                  className={cn(
                    "flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors",
                    specSubView === tab.key ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  <tab.icon className="h-3 w-3" />
                  {tab.label}
                  <span className="text-[9px] ml-0.5 opacity-70">({tab.count})</span>
                </button>
              ))}
            </div>

            <Select value={specFilters.stageId} onValueChange={(v) => setSpecFilters({ stageId: v })}>
              <SelectTrigger className="h-7 w-[140px] text-xs">
                <SelectValue placeholder="Etapa" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as etapas</SelectItem>
                {specData.macroStages.map((s) => (
                  <SelectItem key={s.id} value={s.id}>0{s.order}. {s.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={specFilters.status} onValueChange={(v) => setSpecFilters({ status: v })}>
              <SelectTrigger className="h-7 w-[130px] text-xs">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="confirmed">Confirmado</SelectItem>
                <SelectItem value="pending_gap">Pendente de GAP</SelectItem>
                <SelectItem value="draft">Rascunho</SelectItem>
                <SelectItem value="updated">Atualizado</SelectItem>
              </SelectContent>
            </Select>

            <Select value={specFilters.hasGap} onValueChange={(v) => setSpecFilters({ hasGap: v })}>
              <SelectTrigger className="h-7 w-[120px] text-xs">
                <SelectValue placeholder="Pendência" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="yes">Com GAP</SelectItem>
                <SelectItem value="no">Sem GAP</SelectItem>
              </SelectContent>
            </Select>

            {hasActiveFilters && (
              <Button variant="ghost" size="sm" onClick={resetSpecFilters} className="text-xs h-7">
                Limpar filtros
              </Button>
            )}
          </div>
        )}

        {/* Map Filters */}
        {specViewMode === 'map' && (
          <div className="mt-4 pt-3 border-t border-border flex items-center gap-2">
            <Filter className="h-3.5 w-3.5 text-muted-foreground" />
            <span className="text-[10px] font-bold uppercase text-muted-foreground">Destacar:</span>
            {([
              { key: 'all', label: 'Tudo' },
              { key: 'gaps', label: 'Pendências' },
              { key: 'rules', label: 'Regras' },
              { key: 'decisions', label: 'Decisões humanas' },
            ] as const).map((f) => (
              <button
                key={f.key}
                onClick={() => setMapFilter(f.key)}
                className={cn(
                  "px-2.5 py-1 rounded-lg text-[11px] font-medium transition-colors border",
                  mapFilter === f.key ? "bg-primary text-primary-foreground border-primary" : "border-border text-muted-foreground hover:text-foreground hover:border-primary/40"
                )}
              >
                {f.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* ═══════════════ LIST VIEW ═══════════════ */}
      {specViewMode === 'list' && (
        <div className="space-y-2">
          {specSubView === 'requirements' && (
            <>
              {filteredRFs.length === 0 ? (
                <EmptyState text="Nenhum requisito funcional encontrado" />
              ) : (
                filteredRFs.map((rf) => (
                  <SpecItemCard
                    key={rf.id}
                    id={rf.id}
                    title={rf.title}
                    description={rf.description}
                    status={rf.validationStatus}
                    stageId={rf.relatedStageId}
                    gapIds={rf.relatedGapIds}
                    icon={<FileText className="h-4 w-4 text-blue-500" />}
                    specData={specData}
                    onClick={() => setSelectedSpecItem({ type: 'rf', id: rf.id })}
                  />
                ))
              )}
            </>
          )}

          {specSubView === 'rules' && (
            <>
              {filteredRNs.length === 0 ? (
                <EmptyState text="Nenhuma regra de negócio encontrada" />
              ) : (
                filteredRNs.map((rn) => (
                  <SpecItemCard
                    key={rn.id}
                    id={rn.id}
                    title={rn.title}
                    description={rn.statement}
                    status={rn.status}
                    stageId={rn.relatedStageId}
                    gapIds={rn.relatedGapIds}
                    icon={<Scale className="h-4 w-4 text-violet-500" />}
                    specData={specData}
                    onClick={() => setSelectedSpecItem({ type: 'rn', id: rn.id })}
                  />
                ))
              )}
            </>
          )}

          {specSubView === 'gaps' && (
            <>
              {filteredGaps.length === 0 ? (
                <EmptyState text="Nenhuma pendência encontrada" />
              ) : (
                filteredGaps.map((gap) => (
                  <SpecItemCard
                    key={gap.id}
                    id={gap.id}
                    title={gap.title}
                    description={gap.question}
                    status={gap.status === 'confirmed' ? 'confirmed' : gap.status === 'open' || gap.status === 'reopened' ? 'pending_gap' : 'in_validation'}
                    stageId={gap.relatedStageId}
                    gapIds={[]}
                    icon={<AlertTriangle className="h-4 w-4 text-amber-500" />}
                    specData={specData}
                    onClick={() => setSelectedSpecItem({ type: 'gap', id: gap.id })}
                    impactBadge={gap.impact}
                  />
                ))
              )}
            </>
          )}
        </div>
      )}

      {/* ═══════════════ MAP VIEW ═══════════════ */}
      {specViewMode === 'map' && (
        <div className="flex flex-col items-center gap-0 pb-8">
          {specData.macroStages.map((stage, idx) => {
            const isExpanded = expandedStages[stage.id] ?? true;
            const stageRFs = specData.functionalRequirements.filter((rf) => stage.rfIds.includes(rf.id));
            const stageRNs = specData.businessRules.filter((rn) => stage.rnIds.includes(rn.id));
            const stageGaps = specData.gaps.filter((g) => stage.gapIds.includes(g.id));
            const openGapsCount = stageGaps.filter((g) => g.status === 'open' || g.status === 'reopened').length;

            const showRFs = mapFilter === 'all' || mapFilter === 'gaps';
            const showRNs = mapFilter === 'all' || mapFilter === 'rules';
            const showGaps = mapFilter === 'all' || mapFilter === 'gaps';
            const showDecision = mapFilter === 'all' || mapFilter === 'decisions';

            return (
              <React.Fragment key={stage.id}>
                {/* Stage Card */}
                <div className={cn(
                  "w-full max-w-[600px] rounded-2xl border bg-card shadow-sm transition-all",
                  openGapsCount > 0 ? "border-amber-300 dark:border-amber-700" : "border-border",
                )}>
                  {/* Stage Header */}
                  <button
                    onClick={() => toggleStage(stage.id)}
                    className="w-full p-4 flex items-center justify-between gap-3 text-left hover:bg-muted/30 transition-colors rounded-t-2xl"
                  >
                    <div className="flex items-center gap-3">
                      <span className="flex items-center justify-center w-8 h-8 rounded-xl bg-primary text-primary-foreground text-sm font-bold shadow-sm">
                        0{stage.order}
                      </span>
                      <div>
                        <h3 className="text-sm font-bold text-foreground">{stage.name}</h3>
                        <p className="text-[11px] text-muted-foreground line-clamp-1">{stage.description}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {stage.hasHumanDecision && showDecision && (
                        <GitFork className="h-4 w-4 text-primary" title="Decisão humana" />
                      )}
                      {stage.hasExceptions && (
                        <ShieldAlert className="h-4 w-4 text-amber-500" title="Exceções" />
                      )}
                      {openGapsCount > 0 && (
                        <Badge variant="outline" className="text-[9px] h-4 text-amber-600 border-amber-300 bg-amber-50 dark:bg-amber-950/20">
                          {openGapsCount} pendência{openGapsCount > 1 ? 's' : ''}
                        </Badge>
                      )}
                      <Badge variant="secondary" className="text-[9px] h-4">
                        {stageRFs.length} RF · {stageRNs.length} RN
                      </Badge>
                      {isExpanded ? <ChevronDown className="h-4 w-4 text-muted-foreground" /> : <ChevronRight className="h-4 w-4 text-muted-foreground" />}
                    </div>
                  </button>

                  {/* Stage Content */}
                  {isExpanded && (
                    <div className="px-4 pb-4 space-y-2 border-t border-border pt-3">
                      {showRFs && stageRFs.map((rf) => (
                        <button
                          key={rf.id}
                          onClick={() => setSelectedSpecItem({ type: 'rf', id: rf.id })}
                          className="w-full p-2.5 rounded-xl border border-border hover:border-blue-300 bg-card text-left text-xs transition-all flex items-center gap-2.5"
                        >
                          <FileText className="h-3.5 w-3.5 text-blue-500 shrink-0" />
                          <span className="font-mono text-[10px] text-muted-foreground shrink-0">{rf.id}</span>
                          <span className="text-foreground flex-1 truncate">{rf.title}</span>
                          <Badge variant="outline" className={cn("text-[8px] h-3.5 shrink-0", getStatusColor(rf.validationStatus))}>
                            {getStatusLabel(rf.validationStatus)}
                          </Badge>
                        </button>
                      ))}

                      {showRNs && stageRNs.map((rn) => (
                        <button
                          key={rn.id}
                          onClick={() => setSelectedSpecItem({ type: 'rn', id: rn.id })}
                          className="w-full p-2.5 rounded-xl border border-border hover:border-violet-300 bg-card text-left text-xs transition-all flex items-center gap-2.5"
                        >
                          <Scale className="h-3.5 w-3.5 text-violet-500 shrink-0" />
                          <span className="font-mono text-[10px] text-muted-foreground shrink-0">{rn.id}</span>
                          <span className="text-foreground flex-1 truncate">{rn.title}</span>
                          <Badge variant="outline" className={cn("text-[8px] h-3.5 shrink-0", getStatusColor(rn.status))}>
                            {getStatusLabel(rn.status)}
                          </Badge>
                        </button>
                      ))}

                      {showGaps && stageGaps.map((gap) => (
                        <button
                          key={gap.id}
                          onClick={() => setSelectedSpecItem({ type: 'gap', id: gap.id })}
                          className={cn(
                            "w-full p-2.5 rounded-xl border text-left text-xs transition-all flex items-center gap-2.5",
                            gap.status === 'confirmed'
                              ? "border-emerald-200 dark:border-emerald-800 bg-emerald-50/50 dark:bg-emerald-950/10 hover:border-emerald-400"
                              : "border-amber-200 dark:border-amber-800 bg-amber-50/50 dark:bg-amber-950/10 hover:border-amber-400"
                          )}
                        >
                          <AlertTriangle className={cn("h-3.5 w-3.5 shrink-0", gap.status === 'confirmed' ? "text-emerald-500" : "text-amber-500")} />
                          <span className="font-mono text-[10px] text-muted-foreground shrink-0">{gap.id}</span>
                          <span className="text-foreground flex-1 truncate">{gap.title}</span>
                          <Badge variant="outline" className={cn("text-[8px] h-3.5 shrink-0",
                            gap.status === 'confirmed' ? "text-emerald-600 border-emerald-300" : "text-amber-600 border-amber-300"
                          )}>
                            {gap.status === 'confirmed' ? 'Confirmado' : gap.status === 'open' ? 'Aberto' : gap.status}
                          </Badge>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Arrow connector */}
                {idx < specData.macroStages.length - 1 && (
                  <div className="flex flex-col items-center py-1">
                    <div className="w-px h-6 bg-border" />
                    <ArrowDown className="h-4 w-4 text-muted-foreground" />
                    <div className="w-px h-2 bg-border" />
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ── Spec Item Card ──
interface SpecItemCardProps {
  id: string;
  title: string;
  description: string;
  status: SpecItemStatus;
  stageId: string;
  gapIds: string[];
  icon: React.ReactNode;
  specData: ContextSpecData;
  onClick: () => void;
  impactBadge?: 'high' | 'medium' | 'low';
}

function SpecItemCard({ id, title, description, status, stageId, gapIds, icon, specData, onClick, impactBadge }: SpecItemCardProps) {
  const stage = specData.macroStages.find((s) => s.id === stageId);

  return (
    <button
      onClick={onClick}
      className="w-full p-4 rounded-xl border border-border bg-card hover:border-primary/40 text-left transition-all shadow-sm hover:shadow-md"
    >
      <div className="flex items-start gap-3">
        <div className="mt-0.5 shrink-0">{icon}</div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-mono font-bold text-muted-foreground">{id}</span>
            <Badge variant="outline" className={cn("text-[9px] h-4 font-normal", getStatusColor(status))}>
              {getStatusLabel(status)}
            </Badge>
            {impactBadge && (
              <Badge variant="outline" className={cn("text-[9px] h-4",
                impactBadge === 'high' ? "text-red-600 border-red-300" :
                impactBadge === 'medium' ? "text-amber-600 border-amber-300" :
                "text-gray-600 border-gray-300"
              )}>
                {impactBadge === 'high' ? 'Alto' : impactBadge === 'medium' ? 'Médio' : 'Baixo'}
              </Badge>
            )}
          </div>
          <h3 className="text-xs font-semibold text-foreground mb-0.5">{title}</h3>
          <p className="text-[11px] text-muted-foreground line-clamp-2 leading-relaxed">{description}</p>
          <div className="mt-2 flex items-center gap-2 text-[10px] text-muted-foreground">
            {stage && <span>Etapa: 0{stage.order}. {stage.name}</span>}
            {gapIds.length > 0 && (
              <span className="inline-flex items-center gap-0.5 text-amber-600">
                <AlertTriangle className="h-2.5 w-2.5" />
                {gapIds.length} GAP{gapIds.length > 1 ? 's' : ''}
              </span>
            )}
          </div>
        </div>
      </div>
    </button>
  );
}

// ── Empty State ──
function EmptyState({ text }: { text: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <Search className="h-8 w-8 text-muted-foreground/40 mb-3" />
      <p className="text-sm text-muted-foreground">{text}</p>
      <p className="text-xs text-muted-foreground/60 mt-1">Tente ajustar os filtros de busca.</p>
    </div>
  );
}
