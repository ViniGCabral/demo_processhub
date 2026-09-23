import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useLanguage } from "@/contexts/LanguageContext";
import { Sparkles, ArrowRight, ArrowLeft, CheckCircle2, AlertTriangle, FileSearch, ShieldCheck, Map, Settings2 } from "lucide-react";
import { generateMockJourneyFromAI, AIDiscoveryInput, AIJourneySuggestion, AIJourneyStep } from "@/data/aiDiscoveryMock";
import { cn } from "@/lib/utils";
import { useJourneyStore } from "@/stores/journeyStore";

interface JourneyAIDiscoveryWizardProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function JourneyAIDiscoveryWizard({ open, onOpenChange }: JourneyAIDiscoveryWizardProps) {
  const { language } = useLanguage();
  const pt = language === "PT";
  
  const addJourney = useJourneyStore(s => s.addJourney);

  // Wizard Steps: 1 (Input), 2 (Reference), 3 (Map), 4 (Gaps), 5 (Review)
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  // Form State
  const [formData, setFormData] = useState<AIDiscoveryInput>({
    painPoint: "", domain: "", objective: "", sector: "", systems: "", urgency: ""
  });

  // AI Output State
  const [aiJourney, setAiJourney] = useState<AIJourneySuggestion | null>(null);

  const handleGenerate = () => {
    setIsLoading(true);
    // Simulate API delay
    setTimeout(() => {
      const mockResult = generateMockJourneyFromAI(formData);
      setAiJourney(mockResult);
      setIsLoading(false);
      setStep(2);
    }, 1500);
  };

  const updateStepAction = (stepId: string, action: AIJourneyStep['userAction'], finalProcessId?: string) => {
    if (!aiJourney) return;
    const newSteps = aiJourney.steps.map(s => {
      if (s.id === stepId) {
        return { ...s, userAction: action, finalProcessId: finalProcessId || s.suggestedProcessId };
      }
      return s;
    });
    setAiJourney({ ...aiJourney, steps: newSteps });
  };

  const handleSave = (status: 'reference' | 'validating' | 'validated') => {
    if (!aiJourney) return;
    
    // Transform AI journey to actual JourneyData structure
    const newId = `jour-${Date.now()}`;
    const mappedProcessIds = aiJourney.steps
      .map(s => s.finalProcessId)
      .filter(Boolean) as string[];

    const finalSteps = aiJourney.steps.map(s => ({
      id: s.id,
      order: s.order,
      stepName: s.stepName,
      processId: s.finalProcessId,
      systemUsage: { systemName: s.expectedSystems[0] || 'Manual', operation: 'leitura' as any, dataObjects: [], dependencies: [], isManual: false },
      input: 'N/A',
      output: 'N/A',
      integrationStatus: 'ausente' as const
    }));

    addJourney({
      id: newId,
      name: aiJourney.name,
      description: aiJourney.objective,
      objective: aiJourney.objective,
      mainDomain: aiJourney.mainDomain,
      status: status === 'validated' ? 'active' : 'draft',
      participatingProcessIds: [...new Set(mappedProcessIds)],
      steps: finalSteps,
      stepRelations: [],
      coveredL1: [aiJourney.mainDomain],
      coveredL2: [], coveredL3: [], coveredL4: [],
      systemsInvolved: Array.from(new Set(aiJourney.steps.flatMap(s => s.expectedSystems))),
      dataObjectsInvolved: [],
      businessIndicators: [],
      contextIndicators: [],
      gaps: aiJourney.steps.filter(s => s.userAction === 'pendente' || s.userAction === 'criar_provisorio').map(s => `Lacuna de processo na etapa: ${s.stepName}`),
      suggestionConfidence: aiJourney.confidence
    } as any);

    onOpenChange(false);
    // reset state
    setTimeout(() => {
      setStep(1);
      setAiJourney(null);
      setFormData({ painPoint: "", domain: "", objective: "", sector: "", systems: "", urgency: "" });
    }, 300);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px] h-[85vh] p-0 flex flex-col bg-white overflow-hidden">
        
        {/* Header */}
        <div className="bg-[#0C1BA8] p-6 text-white shrink-0">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="h-5 w-5 text-amber-400" />
            <h2 className="text-xl font-bold">{pt ? "Descoberta de Jornada por IA" : "AI Journey Discovery"}</h2>
          </div>
          <p className="text-blue-100 text-sm">{pt ? "Transforme dores operacionais em arquitetura mapeada." : "Transform operational pains into mapped architecture."}</p>
          
          {/* Stepper */}
          <div className="flex items-center gap-2 mt-6 overflow-x-auto pb-2">
            {[1,2,3,4,5].map(i => (
              <div key={i} className="flex items-center gap-2">
                <div className={cn("flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold shrink-0", 
                  step === i ? "bg-amber-400 text-[#0C1BA8]" : step > i ? "bg-blue-400/30 text-blue-100" : "bg-blue-800 text-blue-300"
                )}>
                  {i}
                </div>
                {i < 5 && <div className={cn("w-8 h-px", step > i ? "bg-amber-400" : "bg-blue-800")} />}
              </div>
            ))}
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-6 bg-gray-50/50">
          
          {/* STEP 1: FORMULARIO */}
          {step === 1 && (
            <div className="space-y-6">
              <div className="bg-blue-50 border border-blue-100 p-4 rounded-md flex gap-3 text-blue-800">
                <InfoIcon className="h-5 w-5 shrink-0" />
                <p className="text-sm">
                  {pt ? "Descreva a dor que a operação está sentindo. Nossa IA cruzará essas informações com frameworks de mercado e com a sua arquitetura atual." : "Describe the operational pain. Our AI will cross this with market frameworks and your current architecture."}
                </p>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-[#272727] font-bold">{pt ? "Qual é a dor ou problema principal?" : "What is the main pain point?"}</Label>
                  <Textarea 
                    placeholder="Ex: Quero melhorar o contencioso jurídico. Temos pouca visibilidade dos prazos, informações espalhadas e dificuldade em prever custos." 
                    className="h-24 resize-none bg-white"
                    value={formData.painPoint}
                    onChange={e => setFormData({...formData, painPoint: e.target.value})}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-[#6B7280]">{pt ? "Domínio/Área (Opcional)" : "Domain (Optional)"}</Label>
                    <Input placeholder="Ex: Jurídico" className="bg-white" value={formData.domain} onChange={e => setFormData({...formData, domain: e.target.value})} />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[#6B7280]">{pt ? "Objetivo Desejado" : "Desired Objective"}</Label>
                    <Input placeholder="Ex: Reduzir tempo e custos" className="bg-white" value={formData.objective} onChange={e => setFormData({...formData, objective: e.target.value})} />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[#6B7280]">{pt ? "Setor da Empresa" : "Industry Sector"}</Label>
                    <Input placeholder="Ex: Varejo" className="bg-white" value={formData.sector} onChange={e => setFormData({...formData, sector: e.target.value})} />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[#6B7280]">{pt ? "Sistemas Envolvidos" : "Systems Involved"}</Label>
                    <Input placeholder="Ex: Projuris, SAP" className="bg-white" value={formData.systems} onChange={e => setFormData({...formData, systems: e.target.value})} />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: JORNADA DE REFERENCIA */}
          {step === 2 && aiJourney && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
              <div className="text-center mb-8">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-100 text-amber-800 text-xs font-bold uppercase rounded-full mb-4">
                  <Sparkles className="h-3 w-3" />
                  {pt ? "Jornada Gerada por IA" : "AI Generated Journey"}
                </div>
                <h3 className="text-2xl font-bold text-[#272727]">{aiJourney.name}</h3>
                <p className="text-[#6B7280] max-w-lg mx-auto mt-2">{aiJourney.objective}</p>
                <div className="text-xs text-gray-400 mt-2 flex justify-center items-center gap-1">
                  <ShieldCheck className="h-3 w-3" /> Confiança: {aiJourney.confidence}% | Fonte: {aiJourney.source}
                </div>
              </div>

              <div className="relative border-l-2 border-[#0C1BA8]/20 ml-4 space-y-6">
                {aiJourney.steps.map((s, idx) => (
                  <div key={s.id} className="relative pl-6">
                    <div className="absolute -left-[9px] top-1 h-4 w-4 rounded-full bg-[#0C1BA8] border-2 border-white" />
                    <div className="bg-white p-4 rounded-md border border-gray-100 shadow-sm">
                      <h4 className="font-bold text-[#0C1BA8] mb-1">Etapa {idx + 1}: {s.stepName}</h4>
                      <p className="text-sm text-gray-600 mb-3">{s.objective}</p>
                      
                      <div className="flex flex-wrap gap-2 text-[10px]">
                        <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-sm">
                          Processo esperado: {s.expectedProcess}
                        </span>
                        {s.expectedSystems.map(sys => (
                          <span key={sys} className="px-2 py-1 bg-blue-50 text-blue-700 rounded-sm">
                            {sys}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* STEP 3: MATCHES EXISTENTES */}
          {step === 3 && aiJourney && (
            <div className="space-y-6">
              <p className="text-[#272727] font-medium">
                {pt ? "Cruzamos a jornada sugerida com a sua arquitetura. Veja os processos candidatos:" : "We cross-referenced the suggested journey with your architecture. See candidate processes:"}
              </p>

              <div className="space-y-4">
                {aiJourney.steps.map((s) => (
                  <div key={s.id} className="bg-white border border-gray-200 rounded-md p-4 flex gap-4">
                    <div className="shrink-0 w-1/3 border-r pr-4">
                      <span className="text-[10px] font-bold text-[#A5A7B0] uppercase">{pt ? "Etapa da Jornada" : "Journey Step"}</span>
                      <h4 className="font-semibold text-[#0C1BA8] text-sm mt-1">{s.stepName}</h4>
                    </div>
                    
                    <div className="flex-1">
                      {s.suggestedProcessId ? (
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-bold text-[#272727] flex items-center gap-2">
                              <CheckCircle2 className="h-4 w-4 text-green-600" />
                              {s.suggestedProcessName}
                            </span>
                            <span className="text-xs font-bold text-green-700 bg-green-100 px-2 py-0.5 rounded-sm">
                              {s.matchConfidence}% Match
                            </span>
                          </div>
                          <p className="text-xs text-gray-600 bg-gray-50 p-2 rounded-sm border border-gray-100">
                            {s.matchReason}
                          </p>
                          <div className="pt-2">
                            <Button 
                              size="sm" 
                              variant={s.userAction === 'relacionar_existente' ? 'default' : 'outline'}
                              onClick={() => updateStepAction(s.id, 'relacionar_existente')}
                              className="text-xs h-7"
                            >
                              {s.userAction === 'relacionar_existente' ? '✓ Vinculado' : 'Vincular este processo'}
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 h-full text-amber-600">
                          <AlertTriangle className="h-5 w-5" />
                          <span className="text-sm font-medium">{pt ? "Nenhum processo mapeado localizado." : "No mapped process found."}</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* STEP 4: TRATAR LACUNAS */}
          {step === 4 && aiJourney && (
            <div className="space-y-6">
              <div className="bg-amber-50 border border-amber-200 p-4 rounded-md">
                <h3 className="font-bold text-amber-800 flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5" />
                  {pt ? "Tratamento de Lacunas (Gaps)" : "Gap Handling"}
                </h3>
                <p className="text-sm text-amber-700 mt-1">
                  {pt ? "Identificamos etapas na jornada que não possuem processos mapeados na sua arquitetura." : "We identified steps in the journey with no mapped processes."}
                </p>
              </div>

              <div className="space-y-4">
                {aiJourney.steps.filter(s => !s.suggestedProcessId).map(s => (
                  <div key={s.id} className="bg-white border-l-4 border-l-amber-500 border border-gray-200 rounded-md p-4">
                    <h4 className="font-bold text-[#272727] text-sm mb-1">{s.stepName}</h4>
                    <p className="text-xs text-gray-500 mb-4">Processo ideal sugerido: <span className="font-semibold">{s.expectedProcess}</span></p>
                    
                    <div className="flex gap-2">
                      <Button 
                        size="sm" 
                        variant={s.userAction === 'criar_provisorio' ? 'default' : 'outline'}
                        onClick={() => updateStepAction(s.id, 'criar_provisorio', 'proc-temp')}
                        className="text-xs"
                      >
                        {pt ? "Criar Processo Provisório" : "Create Provisional Process"}
                      </Button>
                      <Button 
                        size="sm" 
                        variant={s.userAction === 'marcar_nao_aplicavel' ? 'default' : 'outline'}
                        onClick={() => updateStepAction(s.id, 'marcar_nao_aplicavel')}
                        className="text-xs"
                      >
                        {pt ? "Não Aplicável" : "Not Applicable"}
                      </Button>
                    </div>
                  </div>
                ))}
                {aiJourney.steps.filter(s => !s.suggestedProcessId).length === 0 && (
                  <p className="text-center text-gray-500">{pt ? "Parabéns, sem lacunas!" : "Congrats, no gaps!"}</p>
                )}
              </div>
            </div>
          )}

          {/* STEP 5: REVISAO E CONFIRMAR */}
          {step === 5 && aiJourney && (
            <div className="space-y-6">
              <h3 className="text-xl font-bold text-[#272727]">{pt ? "Resumo da Nova Jornada" : "New Journey Summary"}</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white border border-gray-200 p-4 rounded-md text-center">
                  <span className="text-3xl font-bold text-[#0C1BA8]">{aiJourney.steps.length}</span>
                  <span className="block text-xs font-bold text-gray-500 uppercase mt-1">Etapas Totais</span>
                </div>
                <div className="bg-white border border-gray-200 p-4 rounded-md text-center">
                  <span className="text-3xl font-bold text-green-600">{aiJourney.steps.filter(s => s.userAction === 'relacionar_existente').length}</span>
                  <span className="block text-xs font-bold text-gray-500 uppercase mt-1">Processos Vinculados</span>
                </div>
                <div className="bg-white border border-gray-200 p-4 rounded-md text-center">
                  <span className="text-3xl font-bold text-amber-600">{aiJourney.steps.filter(s => s.userAction === 'criar_provisorio').length}</span>
                  <span className="block text-xs font-bold text-gray-500 uppercase mt-1">Processos Provisórios</span>
                </div>
                <div className="bg-white border border-gray-200 p-4 rounded-md text-center">
                  <span className="text-3xl font-bold text-gray-500">{aiJourney.steps.filter(s => s.userAction === 'marcar_nao_aplicavel' || s.userAction === 'pendente').length}</span>
                  <span className="block text-xs font-bold text-gray-500 uppercase mt-1">Lacunas Abertas</span>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-100 p-4 rounded-md mt-6">
                <h4 className="font-bold text-blue-800 text-sm mb-2">{pt ? "Próximos Passos Sugeridos pela IA" : "Next Steps Suggested by AI"}</h4>
                <ul className="list-disc pl-5 text-sm text-blue-900 space-y-1">
                  <li>Validar o impacto do Contencioso na área Financeira.</li>
                  <li>Mapear as ferramentas manuais de acompanhamento de prazos.</li>
                </ul>
              </div>
            </div>
          )}

        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-gray-200 bg-white flex justify-between shrink-0">
          <Button variant="ghost" onClick={() => step > 1 ? setStep(step - 1) : onOpenChange(false)}>
            {step === 1 ? (pt ? "Cancelar" : "Cancel") : (pt ? "Voltar" : "Back")}
          </Button>
          
          {step < 5 ? (
            <Button onClick={step === 1 ? handleGenerate : () => setStep(step + 1)} disabled={isLoading} className="bg-[#0C1BA8] hover:bg-[#0C1BA8]/90">
              {isLoading ? (pt ? "Analisando..." : "Analyzing...") : (pt ? "Continuar" : "Continue")} <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          ) : (
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => handleSave('reference')}>
                {pt ? "Salvar como Referência" : "Save as Reference"}
              </Button>
              <Button className="bg-green-600 hover:bg-green-700 text-white" onClick={() => handleSave('validating')}>
                <CheckCircle2 className="mr-2 h-4 w-4" />
                {pt ? "Salvar em Validação" : "Save in Validation"}
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

function InfoIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 24"
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
