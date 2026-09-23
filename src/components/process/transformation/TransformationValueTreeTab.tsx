import React, { useState } from 'react';
import { TransformationScenario, ValueTreeNode } from '@/types/processTransformation';
import { Badge } from '@/components/ui/badge';
import { ArrowDown, CheckCircle, Database, Target, Play, Lightbulb, Server, BarChart2, Info, ArrowRight, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface TransformationValueTreeTabProps {
  scenario: TransformationScenario;
}

export function TransformationValueTreeTab({ scenario }: TransformationValueTreeTabProps) {
  const { valueTreeNodes } = scenario;
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);

  const getTypeStyle = (type: string) => {
    switch (type) {
      case 'business_result': return { icon: Target, bg: 'bg-emerald-100 dark:bg-emerald-900/30', border: 'border-emerald-300 dark:border-emerald-800', text: 'text-emerald-800 dark:text-emerald-300', label: 'Resultado de Negócio' };
      case 'value_dimension': return { icon: BarChart2, bg: 'bg-emerald-50 dark:bg-emerald-950/20', border: 'border-emerald-200 dark:border-emerald-900/50', text: 'text-emerald-700 dark:text-emerald-400', label: 'Dimensão de Valor' };
      case 'value_lever': return { icon: Lightbulb, bg: 'bg-blue-100 dark:bg-blue-900/30', border: 'border-blue-300 dark:border-blue-800', text: 'text-blue-800 dark:text-blue-300', label: 'Alavanca de Valor' };
      case 'capability': return { icon: Database, bg: 'bg-blue-50 dark:bg-blue-950/20', border: 'border-blue-200 dark:border-blue-900/50', text: 'text-blue-700 dark:text-blue-400', label: 'Capacidade Necessária' };
      case 'action': return { icon: Play, bg: 'bg-violet-100 dark:bg-violet-900/30', border: 'border-violet-300 dark:border-violet-800', text: 'text-violet-800 dark:text-violet-300', label: 'Ação / Iniciativa' };
      case 'technology': return { icon: Server, bg: 'bg-violet-50 dark:bg-violet-950/20', border: 'border-violet-200 dark:border-violet-900/50', text: 'text-violet-700 dark:text-violet-400', label: 'Tecnologia / Sistema' };
      case 'indicator': return { icon: CheckCircle, bg: 'bg-slate-100 dark:bg-slate-800', border: 'border-slate-300 dark:border-slate-700', text: 'text-slate-700 dark:text-slate-300', label: 'Indicador de Sucesso' };
      default: return { icon: Target, bg: 'bg-card', border: 'border-border', text: 'text-foreground', label: type };
    }
  };

  const selectedNode = selectedNodeId ? valueTreeNodes.find(n => n.id === selectedNodeId) : null;
  const rootNodes = valueTreeNodes.filter(n => !valueTreeNodes.some(p => p.childrenIds.includes(n.id)));

  // Recursive render
  const renderNode = (nodeId: string, level: number = 0) => {
    const node = valueTreeNodes.find(n => n.id === nodeId);
    if (!node) return null;

    const style = getTypeStyle(node.type);
    const Icon = style.icon;
    const isSelected = selectedNodeId === node.id;

    return (
      <div key={node.id} className="relative flex flex-col items-center">
        {level > 0 && (
          <div className="flex flex-col items-center mb-2">
            <div className="w-[1px] h-4 bg-border"></div>
            <ArrowDown className="h-3 w-3 text-muted-foreground -mt-1 z-10" />
          </div>
        )}
        
        <button
          onClick={() => setSelectedNodeId(node.id)}
          className={cn(
            "w-[280px] rounded-xl border p-3 text-center transition-all hover:shadow-md cursor-pointer relative",
            style.bg, style.border,
            isSelected && "ring-2 ring-primary ring-offset-1 ring-offset-background shadow-md scale-[1.02]"
          )}
        >
          <div className="flex items-center justify-center gap-1.5 mb-1.5">
            <Icon className={cn("h-3.5 w-3.5", style.text)} />
            <span className={cn("text-[9px] uppercase font-bold tracking-wider", style.text)}>
              {style.label}
            </span>
          </div>
          <h3 className="text-[12px] font-bold text-foreground leading-snug">
            {node.description}
          </h3>
        </button>

        {node.childrenIds.length > 0 && (
          <div className="flex justify-center gap-4 mt-2">
            {node.childrenIds.map(childId => renderNode(childId, level + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="h-full flex flex-col animate-in fade-in-50 duration-200">
      <div className="mb-4">
        <h2 className="text-lg font-bold text-foreground">Value Tree</h2>
        <p className="text-xs text-muted-foreground mt-0.5">Clique em um nó para visualizar os detalhes, alavancas e dependências.</p>
      </div>

      <div className="flex-1 flex gap-6 overflow-hidden min-h-[500px]">
        {/* Main Tree Area */}
        <div className="flex-1 bg-muted/10 rounded-2xl border border-border overflow-auto p-8 flex justify-center items-start">
          <div className="min-w-fit flex flex-col items-center">
            {rootNodes.map(node => renderNode(node.id))}
          </div>
        </div>

        {/* Side Panel for Details */}
        <div className={cn(
          "w-80 shrink-0 bg-card border border-border rounded-2xl shadow-sm flex flex-col transition-all duration-300",
          selectedNodeId ? "translate-x-0 opacity-100" : "translate-x-full opacity-0 hidden"
        )}>
          {selectedNode && (() => {
            const style = getTypeStyle(selectedNode.type);
            const Icon = style.icon;
            return (
              <>
                <div className="p-4 border-b border-border flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-1.5 mb-2">
                      <Icon className={cn("h-4 w-4", style.text)} />
                      <span className={cn("text-[10px] uppercase font-bold tracking-wider", style.text)}>
                        {style.label}
                      </span>
                    </div>
                    <h3 className="font-bold text-sm text-foreground">{selectedNode.description}</h3>
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => setSelectedNodeId(null)} className="h-6 w-6 -mr-1">
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                
                <div className="p-4 flex-1 overflow-auto space-y-5 text-[11px]">
                  
                  {/* Atributos Básicos */}
                  {(selectedNode.baseline || selectedNode.target) && (
                    <div className="grid grid-cols-2 gap-3">
                      {selectedNode.baseline && (
                        <div>
                          <span className="text-[9px] uppercase font-bold text-muted-foreground block mb-0.5">Baseline (AS-IS)</span>
                          <span className="font-medium">{selectedNode.baseline}</span>
                        </div>
                      )}
                      {selectedNode.target && (
                        <div>
                          <span className="text-[9px] uppercase font-bold text-emerald-600 block mb-0.5">Meta / Target</span>
                          <span className="font-medium">{selectedNode.target}</span>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Ligações cruzadas */}
                  {selectedNode.relatedActivityId && (
                    <div className="p-3 rounded-lg bg-violet-50/50 border border-violet-100 dark:bg-violet-950/20 dark:border-violet-900/30">
                      <span className="text-[9px] uppercase font-bold text-violet-600 dark:text-violet-400 block mb-1">Atividade Relacionada (TO-BE)</span>
                      <div className="font-medium text-foreground flex items-center gap-1">
                        <ArrowRight className="h-3 w-3 text-violet-500" /> {selectedNode.relatedActivityId}
                      </div>
                    </div>
                  )}

                  {selectedNode.dependencies && selectedNode.dependencies.length > 0 && (
                    <div className="space-y-1.5">
                      <span className="text-[10px] uppercase font-bold text-rose-600 dark:text-rose-400 block">Dependências (Gaps)</span>
                      <ul className="space-y-1">
                        {selectedNode.dependencies.map(d => (
                          <li key={d} className="flex items-center gap-1">
                            <Info className="h-3 w-3 text-rose-500" /> {d}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {selectedNode.requiredDataIds && selectedNode.requiredDataIds.length > 0 && (
                    <div className="space-y-1.5">
                      <span className="text-[10px] uppercase font-bold text-muted-foreground block">Dados Necessários</span>
                      <ul className="space-y-1 text-muted-foreground">
                        {selectedNode.requiredDataIds.map(d => (
                          <li key={d}>&bull; {d}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Esforço e Impacto */}
                  {(selectedNode.effort || selectedNode.impact) && (
                    <div className="pt-4 border-t border-border flex flex-wrap gap-2">
                      {selectedNode.impact && (
                        <Badge variant="outline" className="text-[9px] font-normal uppercase h-5 bg-background">
                          Impacto: <strong className="ml-1 capitalize">{selectedNode.impact}</strong>
                        </Badge>
                      )}
                      {selectedNode.effort && (
                        <Badge variant="outline" className="text-[9px] font-normal uppercase h-5 bg-background">
                          Esforço: <strong className="ml-1 capitalize">{selectedNode.effort}</strong>
                        </Badge>
                      )}
                    </div>
                  )}

                </div>
              </>
            );
          })()}
        </div>
      </div>
    </div>
  );
}
