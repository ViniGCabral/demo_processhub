import React, { useEffect } from 'react';
import { Eye, ClipboardCheck, FileText, Sparkles } from 'lucide-react';
import { useProcessContextStore, type ContextMainTab } from '@/stores/processContextStore';
import { ContextOverviewTab } from './ContextOverviewTab';
import { ContextValidationTab } from './ContextValidationTab';
import { ContextSpecificationTab } from './ContextSpecificationTab';
import { ContextSpecDetailDrawer } from './ContextSpecDetailDrawer';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface ProcessContextViewProps {
  processId: string;
  processName?: string;
  onNavigateTab?: (tab: string) => void;
}

export function ProcessContextView({ processId, processName, onNavigateTab }: ProcessContextViewProps) {
  const {
    initializeContext,
    specDataByProcessId,
    activeMainTab,
    setActiveMainTab,
    currentProcessId,
  } = useProcessContextStore();

  useEffect(() => {
    initializeContext(processId, processName);
  }, [processId, processName, initializeContext]);

  const specData = specDataByProcessId[processId] || specDataByProcessId['local-seed-0'];

  if (!specData) {
    return (
      <div className="p-10 text-center text-muted-foreground">
        Carregando contexto do processo...
      </div>
    );
  }

  const openGaps = specData.gaps.filter(
    (g) => g.status === 'open' || g.status === 'reopened' || g.status === 'awaiting_response'
  ).length;

  const mainTabs: Array<{
    id: ContextMainTab;
    label: string;
    icon: React.ElementType;
    badge?: string;
    badgeColor?: string;
  }> = [
    {
      id: 'overview',
      label: 'Visão Geral',
      icon: Eye,
    },
    {
      id: 'validation',
      label: 'Validação',
      icon: ClipboardCheck,
      badge: openGaps > 0 ? `${openGaps}` : undefined,
      badgeColor: 'amber',
    },
    {
      id: 'specification',
      label: 'Especificação',
      icon: FileText,
    },
  ];

  return (
    <div className="p-8 px-10 max-w-[1550px] mx-auto space-y-6 animate-fade-in relative">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="inline-flex px-2 py-0.5 bg-primary/10 rounded-md text-[11px] font-semibold text-primary">
              Contexto
            </span>
            <Badge variant="outline" className="text-[11px] font-normal">
              {specData.specification.version}
            </Badge>
            <Badge
              variant="outline"
              className={cn(
                "text-[10px]",
                specData.specification.status === 'in_validation' && "text-blue-600 border-blue-300",
                specData.specification.status === 'approved' && "text-emerald-600 border-emerald-300",
                specData.specification.status === 'draft' && "text-muted-foreground",
              )}
            >
              {specData.specification.status === 'in_validation' ? 'Em validação' :
               specData.specification.status === 'approved' ? 'Aprovada' :
               specData.specification.status === 'draft' ? 'Rascunho' :
               specData.specification.status}
            </Badge>
          </div>

          <h1 className="text-xl font-bold text-foreground tracking-tight">
            {specData.processName}
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5 max-w-2xl">
            Ambiente de revisão e validação da especificação funcional. Revise pendências, consulte requisitos e navegue pelo processo.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <div className="px-3.5 py-2 rounded-xl border border-border bg-card shadow-sm text-xs">
            <span className="text-muted-foreground">Atualizado </span>
            <span className="text-foreground font-medium">{specData.specification.lastUpdatedAt}</span>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <div className="flex flex-wrap items-center gap-2 border-b border-border pb-2">
        {mainTabs.map((tab) => {
          const isActive = activeMainTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveMainTab(tab.id)}
              className={cn(
                "flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-medium transition-all",
                isActive
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
              )}
            >
              <tab.icon className="h-4 w-4 shrink-0" />
              <span>{tab.label}</span>
              {tab.badge && (
                <span
                  className={cn(
                    "min-w-4 h-4 px-1 rounded-full text-[10px] font-bold flex items-center justify-center",
                    isActive
                      ? "bg-white text-primary"
                      : "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300"
                  )}
                >
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Active Tab Content */}
      <div className="min-h-[580px]">
        {activeMainTab === 'overview' && (
          <ContextOverviewTab specData={specData} processId={processId} />
        )}
        {activeMainTab === 'validation' && (
          <ContextValidationTab specData={specData} processId={processId} />
        )}
        {activeMainTab === 'specification' && (
          <ContextSpecificationTab specData={specData} processId={processId} />
        )}
      </div>

      {/* Persistent Detail Drawer */}
      <ContextSpecDetailDrawer specData={specData} />
    </div>
  );
}
