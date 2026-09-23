import React from 'react';
import { TransformationScenario } from '@/types/processTransformation';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MessageSquare, Plus, FileText, Link, Shield, Save, Play, Search, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

interface TransformationInputsTabProps {
  scenario: TransformationScenario;
  onExecute: () => void;
}

export function TransformationInputsTab({ scenario, onExecute }: TransformationInputsTabProps) {
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'policy': return <Shield className="h-4 w-4 text-amber-500" />;
      case 'external_reference': return <Link className="h-4 w-4 text-blue-500" />;
      default: return <FileText className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getCategoryLabel = (category: string) => {
    const map: Record<string, string> = {
      policy: 'Política',
      external_reference: 'Referência Externa',
      evidence: 'Evidência',
      restriction: 'Restrição',
      norm: 'Norma',
      opportunity: 'Oportunidade',
      tech_requirement: 'Requisito Técnico',
      premise: 'Premissa'
    };
    return map[category] || category;
  };

  return (
    <div className="flex flex-col h-[calc(100vh-160px)] animate-in fade-in-50 duration-200">
      
      <div className="flex-1 overflow-auto pb-32 space-y-8">
        {/* State Summary (AS-IS) */}
        <div className="p-5 rounded-2xl border border-border bg-card shadow-sm">
          <h2 className="text-sm font-bold text-foreground mb-3 flex items-center gap-2">
            Contexto Herdado (AS-IS) <Badge variant="outline" className="text-[9px] uppercase font-normal">{scenario.baseContextVersion}</Badge>
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
            <div>
              <span className="text-muted-foreground block mb-1">Processo</span>
              <span className="font-medium">Cobrança de Clientes Inadimplentes</span>
            </div>
            <div>
              <span className="text-muted-foreground block mb-1">Sistemas Mapeados</span>
              <span className="font-medium">SAP, Excel, Outlook</span>
            </div>
            <div>
              <span className="text-muted-foreground block mb-1">Atividades Mapeadas</span>
              <span className="font-medium">5 Macroetapas, 12 Passos</span>
            </div>
            <div>
              <span className="text-muted-foreground block mb-1">Políticas</span>
              <span className="font-medium">1 Vinculada</span>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-border flex items-center justify-between text-[11px] text-muted-foreground">
            <span>Estas informações serão utilizadas como base para o envisioning do TO-BE.</span>
          </div>
        </div>

        {/* Hipóteses Section (Form) */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-foreground">Hipóteses e Objetivos</h2>
              <p className="text-xs text-muted-foreground mt-0.5">Defina as intenções de transformação para este cenário.</p>
            </div>
            <Button variant="outline" size="sm" className="h-8 gap-1.5 text-xs">
              <Plus className="h-3.5 w-3.5" /> Nova Hipótese
            </Button>
          </div>

          <div className="space-y-4">
            {scenario.hypotheses.map((hyp, index) => (
              <div key={hyp.id} className="p-5 rounded-xl border border-border bg-card shadow-sm space-y-4 relative group">
                <div className="absolute top-4 right-4 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button variant="ghost" size="icon" className="h-6 w-6 text-muted-foreground hover:text-rose-500">
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="h-6 w-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold shrink-0">
                    {index + 1}
                  </div>
                  <Input defaultValue={hyp.text} className="text-sm font-semibold h-9 focus-visible:ring-1" />
                </div>
                
                <div className="pl-9 space-y-4">
                  <div className="space-y-2">
                    <span className="text-[11px] font-bold uppercase text-muted-foreground">Descrição (O que e Por que)</span>
                    <Textarea defaultValue={hyp.description} className="text-[13px] resize-none min-h-[60px] focus-visible:ring-1" />
                  </div>
                  <div className="space-y-2">
                    <span className="text-[11px] font-bold uppercase text-primary">Resultado Esperado (Hipótese de Ganho)</span>
                    <Input defaultValue={hyp.expectedOutcome} className="text-[13px] h-9 focus-visible:ring-1 bg-primary/5 border-primary/20" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Insumos Adicionais Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-foreground">Insumos Adicionais (Outside-in)</h2>
              <p className="text-xs text-muted-foreground mt-0.5">Anexe benchmarks, tecnologias a avaliar ou restrições novas.</p>
            </div>
            <Button variant="outline" size="sm" className="h-8 gap-1.5 text-xs">
              <Plus className="h-3.5 w-3.5" /> Adicionar Insumo
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {scenario.inputs.map(input => (
              <div key={input.id} className="p-4 rounded-xl border border-border bg-card shadow-sm flex gap-3 relative group">
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button variant="ghost" size="icon" className="h-6 w-6 text-muted-foreground hover:text-rose-500">
                    <X className="h-3.5 w-3.5" />
                  </Button>
                </div>
                <div className="mt-1 shrink-0 p-2 rounded-lg bg-muted">
                  {getCategoryIcon(input.category)}
                </div>
                <div className="space-y-1.5 flex-1 min-w-0 pr-6">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-[13px] font-bold text-foreground truncate">{input.title}</h3>
                    <Badge variant="secondary" className="text-[9px] font-normal h-4">
                      {getCategoryLabel(input.category)}
                    </Badge>
                  </div>
                  <p className="text-[11px] text-muted-foreground leading-relaxed line-clamp-2">
                    {input.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Sticky Action Footer */}
      {scenario.analysisStatus === 'draft' && (
        <div className="fixed bottom-0 left-[220px] right-0 p-4 border-t border-border bg-background/80 backdrop-blur-md z-20 shadow-[0_-4px_16px_rgba(0,0,0,0.05)]">
          <div className="max-w-4xl mx-auto flex items-center justify-between">
            <div className="text-[11px] text-muted-foreground flex items-center gap-2">
              <InfoIcon className="h-4 w-4" />
              Você pode editar os insumos antes de disparar a inteligência.
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm" className="gap-2 h-9">
                <Save className="h-4 w-4" />
                Salvar Rascunho
              </Button>
              <Button onClick={onExecute} size="sm" className="gap-2 h-9 bg-violet-600 hover:bg-violet-700 text-white shadow-md">
                <Play className="h-4 w-4" />
                Executar análise de transformação
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function InfoIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M12 16v-4" />
      <path d="M12 8h.01" />
    </svg>
  );
}
