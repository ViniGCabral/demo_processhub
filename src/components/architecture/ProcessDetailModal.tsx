import { useState } from "react";
import { ProcessContextData } from "@/types/architectureContextTypes";
import { useLanguage } from "@/contexts/LanguageContext";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { IndicatorCard } from "./IndicatorCard";
import { ValidationBadge } from "./ValidationBadge";
import { ShieldCheck, TrendingUp, AlertTriangle, GitBranch, ArrowRight, GitFork, Plus, ArrowLeft, CheckCircle2, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { getJourneysByProcess } from "@/data/architectureContextUtils";
import { mockArchitectureData } from "@/data/architectureContextMock";
import { ProcessIndicatorsView } from "@/components/process/ProcessIndicatorsView";
import { useProcessConnectionStore, RELATIONSHIP_LABELS } from "@/stores/processConnectionStore";
import { ProcessConnectionMapModal } from "@/components/process/connections/ProcessConnectionMapModal";
import { CreateEditConnectionModal } from "@/components/process/connections/CreateEditConnectionModal";

interface ProcessDetailModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  process: ProcessContextData | null;
}

export function ProcessDetailModal({ open, onOpenChange, process }: ProcessDetailModalProps) {
  const { language } = useLanguage();
  const pt = language === "PT";

  const [isConnMapOpen, setIsConnMapOpen] = useState(false);
  const [isNewConnOpen, setIsNewConnOpen] = useState(false);
  const [connDirection, setConnDirection] = useState<"predecessor" | "successor">("predecessor");

  const { getPredecessors, getSuccessors } = useProcessConnectionStore();

  if (!process) return null;

  const predecessors = getPredecessors(process.id);
  const successors = getSuccessors(process.id);

  return (
    <>
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-[90vw] sm:max-w-xl md:max-w-2xl lg:max-w-3xl overflow-y-auto sm:rounded-l-2xl border-l-0 p-0 shadow-2xl flex flex-col">
        
        {/* Header */}
        <SheetHeader className="p-6 border-b border-[#A5A7B0]/20 bg-gray-50/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-sm bg-[#c9dcf2] text-[#0C1BA8] uppercase tracking-wide">
                {process.area}
              </span>
              <span className={cn("text-[10px] font-bold px-2 py-0.5 rounded-sm border uppercase tracking-wide", 
                process.documentationStatus === 'approved' ? "bg-green-50 text-green-700 border-green-200" : "bg-amber-50 text-amber-700 border-amber-200")}>
                {process.documentationStatus === 'approved' ? (pt ? 'Docs Aprovados' : 'Docs Approved') : (pt ? 'Pendente' : 'Pending')}
              </span>
            </div>

            {/* Quick action: Mapa de Conexões */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsConnMapOpen(true)}
              className="text-xs h-7 gap-1.5 border-[#0C1BA8]/30 text-[#0C1BA8] hover:bg-[#0C1BA8]/5 font-semibold"
            >
              <GitFork className="w-3.5 h-3.5" />
              {pt ? "Mapa de Conexões" : "Connection Map"}
            </Button>
          </div>

          <SheetTitle className="text-xl md:text-2xl text-[#272727] text-left">{process.name}</SheetTitle>
          <SheetDescription className="text-left text-sm mt-1">{process.description}</SheetDescription>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4 pt-4 border-t border-[#A5A7B0]/20">
             <div>
               <span className="block text-[10px] font-bold text-[#A5A7B0] uppercase">{pt ? "Responsável" : "Owner"}</span>
               <span className="text-sm font-semibold text-[#272727]">{process.responsible || '-'}</span>
             </div>
             <div>
               <span className="block text-[10px] font-bold text-[#A5A7B0] uppercase">{pt ? "Sistemas Core" : "Core Systems"}</span>
               <span className="text-sm font-semibold text-[#272727]">{process.systemsUsed.length}</span>
             </div>
             <div>
               <span className="block text-[10px] font-bold text-[#A5A7B0] uppercase">{pt ? "Conexões Locais" : "Connections"}</span>
               <span className="text-sm font-semibold text-[#272727]">
                 {predecessors.length + successors.length} ({predecessors.length}P / {successors.length}S)
               </span>
             </div>
          </div>
        </SheetHeader>

        {/* Tabs */}
        <div className="p-6 flex-1 bg-white">
          <Tabs defaultValue="context" className="w-full h-full flex flex-col">
            <TabsList className="bg-transparent border-b border-[#A5A7B0]/20 w-full justify-start rounded-none p-0 h-auto space-x-6">
              <TabsTrigger value="context" className="data-[state=active]:border-b-2 data-[state=active]:border-[#0C1BA8] data-[state=active]:shadow-none rounded-none bg-transparent px-2 py-3 text-sm font-semibold text-[#6B7280] data-[state=active]:text-[#0C1BA8] flex items-center gap-2">
                <ShieldCheck className="h-4 w-4" />
                {pt ? "Saúde do Contexto" : "Context Health"}
              </TabsTrigger>
              <TabsTrigger value="business" className="data-[state=active]:border-b-2 data-[state=active]:border-[#0C1BA8] data-[state=active]:shadow-none rounded-none bg-transparent px-2 py-3 text-sm font-semibold text-[#6B7280] data-[state=active]:text-[#0C1BA8] flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                {pt ? "Desempenho do Negócio" : "Business Performance"}
              </TabsTrigger>
              <TabsTrigger value="connections" className="data-[state=active]:border-b-2 data-[state=active]:border-[#0C1BA8] data-[state=active]:shadow-none rounded-none bg-transparent px-2 py-3 text-sm font-semibold text-[#6B7280] data-[state=active]:text-[#0C1BA8] flex items-center gap-2">
                <GitFork className="h-4 w-4" />
                {pt ? "Conexões Locais" : "Connections"} ({predecessors.length + successors.length})
              </TabsTrigger>
              <TabsTrigger value="journeys" className="data-[state=active]:border-b-2 data-[state=active]:border-[#0C1BA8] data-[state=active]:shadow-none rounded-none bg-transparent px-2 py-3 text-sm font-semibold text-[#6B7280] data-[state=active]:text-[#0C1BA8] flex items-center gap-2">
                <GitBranch className="h-4 w-4" />
                {pt ? "Participação em Jornadas" : "Journey Participation"}
              </TabsTrigger>
            </TabsList>

            {/* TAB: Contexto */}
            <TabsContent value="context" className="m-0 mt-6 outline-none space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {process.contextIndicators.length === 0 ? (
                  <div className="col-span-full p-6 text-center border border-dashed border-[#A5A7B0]/40 rounded-md">
                    <p className="text-sm text-[#A5A7B0]">{pt ? "Nenhum indicador de contexto associado." : "No context indicators attached."}</p>
                  </div>
                ) : (
                  process.contextIndicators.map(ind => (
                    <IndicatorCard key={ind.id} indicator={ind} />
                  ))
                )}
              </div>

              {/* Informações Qualitativas do Contexto */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-amber-50/50 border border-amber-100 p-4 rounded-md">
                  <h4 className="font-bold text-amber-800 text-sm mb-3 flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4" />
                    {pt ? "Dores Mapeadas" : "Pain Points"}
                  </h4>
                  {process.painPoints.length > 0 ? (
                    <ul className="pl-1 space-y-2 text-sm text-gray-700">
                      {process.painPoints.map((p, i) => <li key={i}><ValidationBadge item={p} /></li>)}
                    </ul>
                  ) : (
                    <span className="text-sm text-gray-500 italic">{pt ? "Nenhuma dor reportada." : "No pain points reported."}</span>
                  )}
                </div>
                <div className="bg-blue-50/50 border border-blue-100 p-4 rounded-md">
                  <h4 className="font-bold text-blue-800 text-sm mb-3">
                    {pt ? "Regras de Negócio" : "Business Rules"}
                  </h4>
                  {process.businessRules.length > 0 ? (
                    <ul className="pl-1 space-y-2 text-sm text-gray-700">
                      {process.businessRules.map((r, i) => <li key={i}><ValidationBadge item={r} /></li>)}
                    </ul>
                  ) : (
                    <span className="text-sm text-gray-500 italic">{pt ? "Nenhuma regra específica." : "No specific rules."}</span>
                  )}
                </div>
              </div>
            </TabsContent>

            {/* TAB: Negócio */}
            <TabsContent value="business" className="m-0 mt-6 outline-none">
              <ProcessIndicatorsView
                processId={process.id}
                processName={process.name}
                embedded
              />
            </TabsContent>

            {/* TAB: Conexões Locais */}
            <TabsContent value="connections" className="m-0 mt-6 outline-none space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 bg-gray-50 border border-gray-200 rounded-lg">
                <div>
                  <h4 className="text-xs font-bold text-gray-800">
                    {pt ? "Predecessores e Sucessores Imediatos" : "Immediate Predecessors and Successors"}
                  </h4>
                  <p className="text-[11px] text-gray-500">
                    {pt
                      ? "Conexões operacionais e lógicas de handoff cadastradas para este processo."
                      : "Operational and logical handoff connections registered for this process."}
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setIsConnMapOpen(true);
                    }}
                    className="h-7 text-xs gap-1 border-[#0C1BA8]/30 text-[#0C1BA8] hover:bg-[#0C1BA8]/5 font-semibold"
                  >
                    <GitFork className="w-3.5 h-3.5" />
                    {pt ? "Abrir Mapa de Conexões" : "Open Connection Map"}
                  </Button>
                  <Button
                    variant="default"
                    size="sm"
                    onClick={() => {
                      setConnDirection("predecessor");
                      setIsNewConnOpen(true);
                    }}
                    className="h-7 text-xs gap-1 bg-[#0C1BA8] text-white hover:bg-[#04223D]"
                  >
                    <Plus className="w-3 h-3" />
                    {pt ? "Nova Conexão" : "New"}
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Predecessores */}
                <div className="border border-gray-200 rounded-lg p-3.5 bg-white space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-gray-100">
                    <span className="text-xs font-bold text-gray-800 flex items-center gap-1.5 uppercase">
                      <ArrowLeft className="w-3.5 h-3.5 text-blue-600" />
                      {pt ? "Predecessores" : "Predecessors"} ({predecessors.length})
                    </span>
                  </div>

                  {predecessors.length === 0 ? (
                    <p className="text-xs text-gray-400 italic py-2 text-center">
                      {pt ? "Nenhum predecessor cadastrado." : "No predecessor registered."}
                    </p>
                  ) : (
                    <div className="space-y-2">
                      {predecessors.map((c) => {
                        const rel = RELATIONSHIP_LABELS[c.relationshipType] || { pt: c.relationshipType, en: c.relationshipType };
                        return (
                          <div key={c.id} className="p-2.5 rounded border border-gray-100 bg-gray-50/60 space-y-1">
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] font-semibold text-[#0C1BA8] uppercase">
                                {c.sourceDomain}
                              </span>
                              <span
                                className={`text-[9px] px-1.5 py-0.2 rounded font-medium ${
                                  c.validationStatus === "validada"
                                    ? "bg-emerald-50 text-emerald-700"
                                    : "bg-amber-50 text-amber-700"
                                }`}
                              >
                                {c.validationStatus === "validada" ? (pt ? "Validada" : "Validated") : (pt ? "Pendente" : "Pending")}
                              </span>
                            </div>
                            <h5 className="text-xs font-bold text-gray-800">{c.sourceProcessName}</h5>
                            <div className="flex items-center gap-1 text-[10px] text-purple-700 pt-1">
                              <span className="bg-purple-50 px-1.5 py-0.5 rounded font-medium">
                                {pt ? rel.pt : rel.en}
                              </span>
                              {c.transferredObject && (
                                <span className="bg-blue-50 text-blue-700 px-1.5 py-0.5 rounded">
                                  {c.transferredObject}
                                </span>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Sucessores */}
                <div className="border border-gray-200 rounded-lg p-3.5 bg-white space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-gray-100">
                    <span className="text-xs font-bold text-gray-800 flex items-center gap-1.5 uppercase">
                      <ArrowRight className="w-3.5 h-3.5 text-purple-600" />
                      {pt ? "Sucessores" : "Successors"} ({successors.length})
                    </span>
                  </div>

                  {successors.length === 0 ? (
                    <p className="text-xs text-gray-400 italic py-2 text-center">
                      {pt ? "Nenhum sucessor cadastrado." : "No successor registered."}
                    </p>
                  ) : (
                    <div className="space-y-2">
                      {successors.map((c) => {
                        const rel = RELATIONSHIP_LABELS[c.relationshipType] || { pt: c.relationshipType, en: c.relationshipType };
                        return (
                          <div key={c.id} className="p-2.5 rounded border border-gray-100 bg-gray-50/60 space-y-1">
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] font-semibold text-[#0C1BA8] uppercase">
                                {c.targetDomain}
                              </span>
                              <span
                                className={`text-[9px] px-1.5 py-0.2 rounded font-medium ${
                                  c.validationStatus === "validada"
                                    ? "bg-emerald-50 text-emerald-700"
                                    : "bg-amber-50 text-amber-700"
                                }`}
                              >
                                {c.validationStatus === "validada" ? (pt ? "Validada" : "Validated") : (pt ? "Pendente" : "Pending")}
                              </span>
                            </div>
                            <h5 className="text-xs font-bold text-gray-800">{c.targetProcessName}</h5>
                            <div className="flex items-center gap-1 text-[10px] text-purple-700 pt-1">
                              <span className="bg-purple-50 px-1.5 py-0.5 rounded font-medium">
                                {pt ? rel.pt : rel.en}
                              </span>
                              {c.transferredObject && (
                                <span className="bg-blue-50 text-blue-700 px-1.5 py-0.5 rounded">
                                  {c.transferredObject}
                                </span>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>

            {/* TAB: Jornadas */}
            <TabsContent value="journeys" className="m-0 mt-6 outline-none">
              <div className="space-y-4">
                {(() => {
                  const journeys = getJourneysByProcess(mockArchitectureData, process.id);
                  if (journeys.length === 0) {
                    return (
                      <div className="p-6 text-center border border-dashed border-[#A5A7B0]/40 rounded-md">
                        <p className="text-sm text-[#A5A7B0]">{pt ? "Este processo não atua em nenhuma jornada mapeada." : "This process does not act in any mapped journey."}</p>
                      </div>
                    );
                  }
                  
                  return journeys.map(j => {
                    const stepIndex = j.steps.findIndex(s => s.processId === process.id);
                    const currentStep = j.steps[stepIndex];
                    const prevStep = stepIndex > 0 ? j.steps[stepIndex - 1] : null;
                    const nextStep = stepIndex < j.steps.length - 1 ? j.steps[stepIndex + 1] : null;

                    return (
                      <div key={j.id} className="bg-white border border-[#A5A7B0]/30 p-5 rounded-md shadow-sm">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h4 className="font-bold text-[#0C1BA8]">{j.name}</h4>
                            <p className="text-xs text-[#6B7280] mt-1">{j.objective}</p>
                          </div>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-sm bg-blue-50 text-blue-800 uppercase border border-blue-100">
                            Etapa {stepIndex + 1} de {j.steps.length}
                          </span>
                        </div>

                        <div className="bg-gray-50 border border-gray-200 rounded-md p-4 flex items-center justify-between gap-4 mt-4">
                          {/* Anterior */}
                          <div className="flex-1 text-center">
                            <span className="block text-[10px] font-bold text-gray-400 uppercase mb-2">{pt ? "Etapa Anterior" : "Previous Step"}</span>
                            {prevStep ? (
                              <div className="text-xs text-gray-600 bg-white border border-gray-200 p-2 rounded-sm truncate" title={prevStep.stepName}>
                                {prevStep.stepName}
                              </div>
                            ) : (
                              <div className="text-xs text-gray-400 italic bg-gray-100 p-2 rounded-sm">
                                {pt ? "Início da Jornada" : "Journey Start"}
                              </div>
                            )}
                          </div>

                          <ArrowRight className="h-4 w-4 text-gray-300 shrink-0" />

                          {/* Atual */}
                          <div className="flex-1 text-center">
                            <span className="block text-[10px] font-bold text-[#0C1BA8] uppercase mb-2">{pt ? "Neste Processo" : "In this Process"}</span>
                            <div className="text-xs font-bold text-white bg-[#0C1BA8] border border-[#0C1BA8] p-2 rounded-sm truncate shadow-md" title={currentStep?.stepName}>
                              {currentStep?.stepName || process.name}
                            </div>
                          </div>

                          <ArrowRight className="h-4 w-4 text-gray-300 shrink-0" />

                          {/* Próximo */}
                          <div className="flex-1 text-center">
                            <span className="block text-[10px] font-bold text-gray-400 uppercase mb-2">{pt ? "Próxima Etapa" : "Next Step"}</span>
                            {nextStep ? (
                              <div className="text-xs text-gray-600 bg-white border border-gray-200 p-2 rounded-sm truncate" title={nextStep.stepName}>
                                {nextStep.stepName}
                              </div>
                            ) : (
                              <div className="text-xs text-gray-400 italic bg-gray-100 p-2 rounded-sm">
                                {pt ? "Fim da Jornada" : "Journey End"}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  });
                })()}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </SheetContent>
    </Sheet>

    {/* Modais de Conexões */}
    <ProcessConnectionMapModal
      open={isConnMapOpen}
      onOpenChange={setIsConnMapOpen}
      initialProcessId={process.id}
      initialProcessName={process.name}
      initialDomain={process.area}
    />

    <CreateEditConnectionModal
      open={isNewConnOpen}
      onOpenChange={setIsNewConnOpen}
      currentProcessId={process.id}
      currentProcessName={process.name}
      currentDomain={process.area}
      defaultDirection={connDirection}
    />
    </>
  );
}
