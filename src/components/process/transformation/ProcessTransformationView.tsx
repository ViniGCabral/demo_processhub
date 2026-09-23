import React, { useState, useEffect } from 'react';
import { Sparkles, BarChart, FileText, SplitSquareHorizontal, ShieldAlert, CheckSquare, History, ArrowRight, Loader2, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { debtCollectionTransformationScenario } from '@/data/processTransformationMockData';
import { TransformationInputsTab } from './TransformationInputsTab';
import { TransformationExecutiveTab } from './TransformationExecutiveTab';
import { TransformationValueTreeTab } from './TransformationValueTreeTab';
import { TransformationToBeTab } from './TransformationToBeTab';
import { TransformationGapsTab } from './TransformationGapsTab';
import { TransformationActionPlanTab } from './TransformationActionPlanTab';
import { AnalysisStatus } from '@/types/processTransformation';

interface ProcessTransformationViewProps {
  processId: string;
  processName: string;
}

export function ProcessTransformationView({ processId, processName }: ProcessTransformationViewProps) {
  const [activeTab, setActiveTab] = useState('inputs');
  const [scenario, setScenario] = useState(debtCollectionTransformationScenario);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progressStep, setProgressStep] = useState(0);

  const tabs = [
    { id: 'inputs', label: 'Insumos', icon: FileText, disabled: false },
    { id: 'executive', label: 'Análise Executiva', icon: BarChart, disabled: scenario.analysisStatus === 'draft' },
    { id: 'value_tree', label: 'Value Tree', icon: ArrowRight, disabled: scenario.analysisStatus === 'draft' },
    { id: 'tobe', label: 'AS-IS vs TO-BE', icon: SplitSquareHorizontal, disabled: scenario.analysisStatus === 'draft' },
    { id: 'gaps', label: 'Gaps Fundacionais', icon: ShieldAlert, disabled: scenario.analysisStatus === 'draft' },
    { id: 'action_plan', label: 'Plano de Ação', icon: CheckSquare, disabled: scenario.analysisStatus === 'draft' },
    { id: 'versions', label: 'Versões', icon: History, disabled: false },
  ];

  const processingSteps = [
    'Consolidando o contexto do processo AS-IS...',
    'Analisando hipóteses de transformação...',
    'Avaliando políticas e restrições...',
    'Investigando oportunidades outside-in...',
    'Construindo a Value Tree...',
    'Desenhando o cenário TO-BE...',
    'Identificando gaps fundacionais...',
    'Concluído.'
  ];

  const handleExecuteAnalysis = () => {
    setIsProcessing(true);
    setProgressStep(0);
  };

  useEffect(() => {
    if (isProcessing) {
      if (progressStep < processingSteps.length - 1) {
        const timer = setTimeout(() => setProgressStep(p => p + 1), 800);
        return () => clearTimeout(timer);
      } else {
        const timer = setTimeout(() => {
          setIsProcessing(false);
          setScenario(prev => ({ ...prev, analysisStatus: 'completed' }));
          setActiveTab('executive');
        }, 1000);
        return () => clearTimeout(timer);
      }
    }
  }, [isProcessing, progressStep]);

  return (
    <div className="flex flex-col h-full bg-background animate-fade-in relative">
      {/* Simulation Overlay */}
      {isProcessing && (
        <div className="absolute inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center">
          <div className="w-full max-w-md p-6 rounded-2xl border border-border bg-card shadow-2xl space-y-6">
            <div className="flex items-center gap-3 justify-center mb-2">
              <Sparkles className="h-6 w-6 text-violet-600 animate-pulse" />
              <h2 className="text-xl font-bold">Análise em Andamento</h2>
            </div>
            
            <div className="space-y-4">
              {processingSteps.map((step, idx) => (
                <div key={idx} className={cn(
                  "flex items-center gap-3 transition-opacity duration-300",
                  idx > progressStep ? "opacity-0" : "opacity-100"
                )}>
                  {idx < progressStep ? (
                    <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                  ) : idx === progressStep ? (
                    <Loader2 className="h-4 w-4 text-violet-500 animate-spin" />
                  ) : (
                    <div className="h-4 w-4" />
                  )}
                  <span className={cn(
                    "text-sm font-medium",
                    idx < progressStep ? "text-muted-foreground" : idx === progressStep ? "text-foreground" : "text-muted-foreground/30"
                  )}>
                    {step}
                  </span>
                </div>
              ))}
            </div>

            {/* Progress bar */}
            <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
              <div 
                className="h-full bg-violet-500 transition-all duration-300 ease-out"
                style={{ width: `${(progressStep / (processingSteps.length - 1)) * 100}%` }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Transformation Header */}
      <div className="bg-card border-b border-border p-6 flex flex-col gap-4 sticky top-0 z-10 shadow-sm">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-md bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400">
              <Sparkles className="h-4 w-4" />
            </div>
            <h1 className="text-xl font-bold text-foreground tracking-tight">Transformação</h1>
          </div>
          <p className="text-sm text-muted-foreground">
            Cenário atual: <strong className="text-foreground">{scenario.name}</strong> (Base: AS-IS {scenario.baseContextVersion})
          </p>
        </div>

        {/* Internal Navigation Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                if (!tab.disabled) setActiveTab(tab.id);
              }}
              disabled={tab.disabled}
              className={cn(
                "flex items-center gap-2 px-3 py-2 rounded-lg text-[13px] font-medium transition-all whitespace-nowrap",
                activeTab === tab.id
                  ? "bg-foreground text-background shadow-sm"
                  : tab.disabled
                    ? "bg-muted/30 text-muted-foreground/40 cursor-not-allowed border border-transparent"
                    : "bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground border border-transparent hover:border-border"
              )}
            >
              <tab.icon className={cn("h-4 w-4", activeTab === tab.id ? "text-background" : tab.disabled ? "text-muted-foreground/40" : "text-muted-foreground")} />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 p-6 overflow-auto">
        {activeTab === 'inputs' && <TransformationInputsTab scenario={scenario} onExecute={handleExecuteAnalysis} />}
        {activeTab === 'executive' && <TransformationExecutiveTab scenario={scenario} />}
        {activeTab === 'value_tree' && <TransformationValueTreeTab scenario={scenario} />}
        {activeTab === 'tobe' && <TransformationToBeTab scenario={scenario} />}
        {activeTab === 'gaps' && <TransformationGapsTab scenario={scenario} />}
        {activeTab === 'action_plan' && <TransformationActionPlanTab scenario={scenario} />}
        {activeTab === 'versions' && (
          <div className="flex items-center justify-center h-full text-muted-foreground text-sm border-2 border-dashed rounded-xl p-10">
            Histórico de versões do cenário será exibido aqui.
          </div>
        )}
      </div>
    </div>
  );
}
