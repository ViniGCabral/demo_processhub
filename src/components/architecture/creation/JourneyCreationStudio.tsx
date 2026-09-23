import { useState, useEffect, useMemo } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/contexts/LanguageContext";
import { toast } from "sonner";
import {
  Sparkles,
  ArrowLeft,
  ArrowRight,
  Save,
  CheckCircle2,
  AlertTriangle,
  X,
  Layers,
  FileCheck,
  Send,
  HelpCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";

import type {
  StudioMode,
  StudioStepNumber,
  StudioJourneyMetadata,
  StudioAIInput,
  StudioFlowStep,
} from "./types";
import { JourneyDefinitionStep } from "./JourneyDefinitionStep";
import { JourneyFlowCompositionStep } from "./JourneyFlowCompositionStep";
import { generateMockJourneyFromAI } from "@/data/aiDiscoveryMock";
import { useJourneyStore } from "@/stores/journeyStore";
import { useProcessStore } from "@/stores/processStore";
import { mockArchitectureData } from "@/data/architectureContextMock";
import type { JourneyData, JourneyStepData } from "@/types/architectureContextTypes";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface JourneyCreationStudioProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialMode?: StudioMode;
  onSaveJourney?: (journey: JourneyData) => void;
}

const DEFAULT_METADATA: StudioJourneyMetadata = {
  namePT: "",
  nameEN: "",
  description: "",
  category: "operational",
  status: "draft",
  owner: "",
  triggerEvent: "",
  expectedOutcome: "",
  avgDuration: "",
  slaTarget: "",
};

const DEFAULT_AI_INPUT: StudioAIInput = {
  prompt: "",
  domain: "",
  objective: "",
  systems: "",
};

export function JourneyCreationStudio({
  open,
  onOpenChange,
  initialMode = "manual",
  onSaveJourney,
}: JourneyCreationStudioProps) {
  const { language } = useLanguage();
  const pt = language === "PT";

  const [mode, setMode] = useState<StudioMode>(initialMode);
  const [currentStep, setCurrentStep] = useState<StudioStepNumber>(1);
  const [metadata, setMetadata] = useState<StudioJourneyMetadata>(DEFAULT_METADATA);
  const [aiInput, setAiInput] = useState<StudioAIInput>(DEFAULT_AI_INPUT);
  const [steps, setSteps] = useState<StudioFlowStep[]>([]);
  const [aiConfidence, setAiConfidence] = useState<number>(88);
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);

  // Confirmation dialog for publishing with unlinked/pending steps
  const [showPendingPublishDialog, setShowPendingPublishDialog] = useState(false);

  // Sync mode when modal opens
  useEffect(() => {
    if (open) {
      setMode(initialMode);
      setCurrentStep(1);
      setMetadata(DEFAULT_METADATA);
      setAiInput(DEFAULT_AI_INPUT);
      setSteps([]);
      setIsGeneratingAI(false);
    }
  }, [open, initialMode]);

  const { processes } = useProcessStore();

  // Check how many steps have pending/unmapped issues
  const pendingStepsCount = useMemo(() => {
    return steps.filter(
      (s) => !s.processId || s.aiMatchStatus === "nao_localizado" || s.aiMatchStatus === "correspondencia_parcial"
    ).length;
  }, [steps]);

  // Handler for AI generation trigger from Step 1
  const handleGenerateAI = () => {
    if (!aiInput.prompt.trim()) {
      toast.error(pt ? "Por favor, descreva a jornada desejada." : "Please describe the desired journey.");
      return;
    }

    setIsGeneratingAI(true);
    setTimeout(() => {
      const aiResult = generateMockJourneyFromAI(aiInput.prompt);

      // Update metadata with AI findings
      setMetadata((prev) => ({
        ...prev,
        namePT: aiResult.journeyTitle,
        nameEN: aiResult.journeyTitleEN,
        description: aiResult.description,
        triggerEvent: aiResult.triggerEvent,
        expectedOutcome: aiResult.expectedOutcome,
        avgDuration: aiResult.avgDuration,
        slaTarget: aiResult.slaTarget,
        owner: "Gestão Comercial & Faturamento",
      }));

      setAiConfidence(aiResult.overallConfidence);

      // Map AI steps into StudioFlowStep
      const mappedSteps: StudioFlowStep[] = aiResult.steps.map((st) => ({
        id: st.id,
        order: st.order,
        stepName: st.stepName,
        processId: st.processId,
        processName: st.processName,
        domain: st.domain,
        l2Name: st.l2Name,
        l3Name: st.l3Name,
        l4Name: st.l4Name,
        duration: st.duration,
        input: st.input,
        output: st.output,
        notes: st.notes,
        aiMatchStatus: st.aiMatchStatus,
        aiConfidence: st.aiConfidence,
        aiRationale: st.aiRationale,
        isPendingReview: st.aiMatchStatus !== "confirmado_usuario" && st.aiMatchStatus !== "encontrado_alta",
      }));

      setSteps(mappedSteps);
      setIsGeneratingAI(false);
      setCurrentStep(2);
      toast.success(
        pt
          ? `Fluxo sugerido com ${mappedSteps.length} etapas e ${aiResult.overallConfidence}% de aderência!`
          : `Suggested flow with ${mappedSteps.length} steps and ${aiResult.overallConfidence}% confidence!`
      );
    }, 400);
  };

  // Convert Studio steps into JourneyData format
  const buildJourneyDataObject = (isPublish: boolean): JourneyData => {
    const journeyId = `journey-${Date.now()}`;
    const participatingProcessIds = steps
      .map((s) => s.processId)
      .filter(Boolean) as string[];

    // Extract systems and domains from participating processes
    const coveredDomains = new Set<string>();
    const coveredL1 = new Set<string>();
    const coveredL2 = new Set<string>();
    const coveredL3 = new Set<string>();
    const coveredL4 = new Set<string>();
    const systemsInvolved = new Set<string>();

    participatingProcessIds.forEach((pid) => {
      const p = processes[pid];
      if (p) {
        if (p.domain) {
          coveredDomains.add(p.domain);
          coveredL1.add(p.domain);
        }
        if (p.l2Name) coveredL2.add(p.l2Name);
        if (p.l3Name) coveredL3.add(p.l3Name);
        if (p.l4Name) coveredL4.add(p.l4Name);
        if (p.systems) {
          p.systems.forEach((sys) => systemsInvolved.add(sys.systemName));
        }
      }
    });

    const journeySteps: JourneyStepData[] = steps.map((s, idx) => ({
      id: s.id,
      order: idx + 1,
      processId: s.processId,
      stepName: s.stepName,
      domain: s.domain,
      duration: s.duration || "4h",
      input: s.input,
      output: s.output,
      integrationStatus: s.processId ? "existing" : "missing",
    }));

    const journeyData: JourneyData = {
      id: journeyId,
      name: metadata.namePT || "Nova Jornada Ponta a Ponta",
      description: metadata.description || (pt ? "Jornada de entrega de valor ponta a ponta." : "End-to-end value delivery journey."),
      objective: metadata.expectedOutcome || metadata.description || (pt ? "Garantir entrega de valor fluida." : "Ensure seamless value delivery."),
      triggerEvent: metadata.triggerEvent || (pt ? "Solicitação de cliente" : "Customer request"),
      expectedOutcome: metadata.expectedOutcome || (pt ? "Pedido entregue e faturado" : "Order delivered and billed"),
      mainDomain: steps[0]?.domain || Array.from(coveredDomains)[0] || "Gestão Comercial",
      status: isPublish ? "validated" : "reference",
      owner: metadata.owner || "Liderança de Processos",
      leadTime: metadata.avgDuration || "5 dias",
      totalCost: "R$ 18.500 / ciclo",
      automationRate: 65,
      maturityRate: isPublish ? 90 : 50,
      integrationsCount: systemsInvolved.size,
      participatingProcessIds,
      steps: journeySteps,
      stepRelations: steps.slice(0, -1).map((s, idx) => ({
        sourceStepId: s.id,
        targetStepId: steps[idx + 1].id,
        type: "dispara",
      })),
      coveredL1: Array.from(coveredL1),
      coveredL2: Array.from(coveredL2),
      coveredL3: Array.from(coveredL3),
      coveredL4: Array.from(coveredL4),
      systemsInvolved: Array.from(systemsInvolved),
      dataObjectsInvolved: ["Proposta Comercial", "Contrato Assinado", "Nota Fiscal", "Ordem de Serviço"],
      businessIndicators: [],
      contextIndicators: [],
      gaps: [],
      suggestionConfidence: mode === "ai" ? aiConfidence : undefined,
    };

    return journeyData;
  };

  // Perform the actual save
  const doSave = (isPublish: boolean) => {
    const journeyData = buildJourneyDataObject(isPublish);

    // 1. Sync with mockArchitectureData.journeys (prepends to list)
    const existingIndex = mockArchitectureData.journeys.findIndex((j) => j.id === journeyData.id);
    if (existingIndex >= 0) {
      mockArchitectureData.journeys[existingIndex] = journeyData;
    } else {
      mockArchitectureData.journeys.unshift(journeyData);
    }

    // 2. Sync with useJourneyStore
    useJourneyStore.getState().addJourney({
      id: journeyData.id,
      namePT: metadata.namePT || journeyData.name,
      nameEN: metadata.nameEN || journeyData.name,
      name: journeyData.name,
      description: journeyData.description,
      category: metadata.category,
      status: isPublish ? "published" : "draft",
      owner: journeyData.owner,
      triggerEvent: journeyData.triggerEvent,
      expectedOutcome: journeyData.expectedOutcome,
      avgDuration: metadata.avgDuration,
      slaTarget: metadata.slaTarget,
      steps: steps.map((s, idx) => ({
        id: s.id,
        order: idx + 1,
        stepName: s.stepName,
        processName: s.processName,
        domain: s.domain,
        systemName: s.systemName,
      })),
    });

    toast.success(
      isPublish
        ? (pt ? "Jornada publicada com sucesso!" : "Journey published successfully!")
        : (pt ? "Rascunho da jornada salvo!" : "Journey draft saved!")
    );

    onOpenChange(false);
    onSaveJourney?.(journeyData);
  };

  // User triggers publish
  const handlePublishClick = () => {
    if (steps.length === 0) {
      toast.error(pt ? "Adicione pelo menos uma etapa para publicar." : "Add at least one step to publish.");
      return;
    }

    if (pendingStepsCount > 0) {
      setShowPendingPublishDialog(true);
      return;
    }

    doSave(true);
  };

  // User triggers save draft
  const handleSaveDraftClick = () => {
    if (!metadata.namePT.trim() && !aiInput.prompt.trim()) {
      toast.error(pt ? "Defina ao menos um nome ou descrição para salvar o rascunho." : "Provide at least a name or description to save draft.");
      return;
    }
    doSave(false);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-[96vw] w-[96vw] h-[94vh] p-0 overflow-hidden bg-white border border-[#A5A7B0]/20 flex flex-col shadow-2xl rounded-xl">
          <DialogHeader className="sr-only">
            <DialogTitle>
              {pt ? "Studio de Criação de Jornadas" : "Journey Creation Studio"}
            </DialogTitle>
            <DialogDescription>
              {pt
                ? "Defina o contexto e componha visualmente o fluxo da jornada ponta a ponta."
                : "Define context and visually compose the end-to-end journey flow."}
            </DialogDescription>
          </DialogHeader>

          {/* Top Bar Navigation */}
          <div className="h-16 border-b border-[#A5A7B0]/20 px-6 flex items-center justify-between bg-white shrink-0">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-[#2A6585]/10 flex items-center justify-center text-[#2A6585]">
                  {mode === "ai" ? <Sparkles className="w-4 h-4" /> : <Layers className="w-4 h-4" />}
                </div>
                <div>
                  <h2 className="text-sm font-semibold text-[#0B192C]">
                    {mode === "ai"
                      ? (pt ? "Criação Assistida por IA" : "AI-Assisted Journey Creation")
                      : (pt ? "Criação Manual de Jornada" : "Manual Journey Creation")}
                  </h2>
                  <p className="text-xs text-[#6B7280]">
                    {metadata.namePT || (mode === "ai" ? (pt ? "Nova jornada com IA" : "New AI Journey") : (pt ? "Nova jornada em rascunho" : "New Draft Journey"))}
                  </p>
                </div>
              </div>

              {/* Mode switch pills if on step 1 */}
              {currentStep === 1 && (
                <div className="ml-6 flex items-center bg-[#F4F5F7] p-0.5 rounded-lg border border-[#A5A7B0]/20">
                  <button
                    type="button"
                    onClick={() => setMode("manual")}
                    className={cn(
                      "px-3 py-1 text-xs font-medium rounded-md transition-all",
                      mode === "manual"
                        ? "bg-white text-[#0B192C] shadow-sm"
                        : "text-[#6B7280] hover:text-[#0B192C]"
                    )}
                  >
                    {pt ? "Manual" : "Manual"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setMode("ai")}
                    className={cn(
                      "px-3 py-1 text-xs font-medium rounded-md transition-all flex items-center gap-1.5",
                      mode === "ai"
                        ? "bg-white text-[#2A6585] shadow-sm font-semibold"
                        : "text-[#6B7280] hover:text-[#2A6585]"
                    )}
                  >
                    <Sparkles className="w-3 h-3 text-[#2A6585]" />
                    {pt ? "Com IA" : "With AI"}
                  </button>
                </div>
              )}
            </div>

            {/* Stepper Breadcrumb */}
            <div className="flex items-center gap-3">
              <div
                onClick={() => setCurrentStep(1)}
                className={cn(
                  "flex items-center gap-2 px-3 py-1.5 rounded-md text-xs cursor-pointer transition-all",
                  currentStep === 1
                    ? "bg-[#2A6585]/10 text-[#2A6585] font-semibold"
                    : "text-[#6B7280] hover:bg-slate-100"
                )}
              >
                <div
                  className={cn(
                    "w-5 h-5 rounded-full flex items-center justify-center text-[10px]",
                    currentStep > 1
                      ? "bg-emerald-500 text-white"
                      : currentStep === 1
                      ? "bg-[#2A6585] text-white font-bold"
                      : "bg-slate-200 text-slate-600"
                  )}
                >
                  {currentStep > 1 ? <CheckCircle2 className="w-3.5 h-3.5" /> : "1"}
                </div>
                <span>
                  {mode === "ai"
                    ? (pt ? "1. Descrever Intenção" : "1. Describe Intent")
                    : (pt ? "1. Definir Jornada" : "1. Define Journey")}
                </span>
              </div>

              <div className="w-6 h-px bg-[#A5A7B0]/30" />

              <div
                onClick={() => {
                  if (metadata.namePT || steps.length > 0) setCurrentStep(2);
                }}
                className={cn(
                  "flex items-center gap-2 px-3 py-1.5 rounded-md text-xs transition-all",
                  currentStep === 2
                    ? "bg-[#2A6585]/10 text-[#2A6585] font-semibold cursor-pointer"
                    : metadata.namePT || steps.length > 0
                    ? "text-[#6B7280] hover:bg-slate-100 cursor-pointer"
                    : "text-slate-300 cursor-not-allowed"
                )}
              >
                <div
                  className={cn(
                    "w-5 h-5 rounded-full flex items-center justify-center text-[10px]",
                    currentStep === 2
                      ? "bg-[#2A6585] text-white font-bold"
                      : "bg-slate-200 text-slate-600"
                  )}
                >
                  2
                </div>
                <span>{pt ? "2. Compor e Revisar Fluxo" : "2. Compose & Review Flow"}</span>
                {steps.length > 0 && (
                  <Badge variant="secondary" className="text-[10px] px-1.5 py-0 h-4 bg-slate-100 text-slate-600">
                    {steps.length} {pt ? "etapas" : "steps"}
                  </Badge>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2">
              {currentStep === 2 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentStep(1)}
                  className="h-8 text-xs text-[#0B192C] border-[#A5A7B0]/30"
                >
                  <ArrowLeft className="w-3.5 h-3.5 mr-1" />
                  {pt ? "Voltar à Definição" : "Back to Definition"}
                </Button>
              )}

              <Button
                variant="outline"
                size="sm"
                onClick={handleSaveDraftClick}
                className="h-8 text-xs text-[#0B192C] border-[#A5A7B0]/30 hover:bg-slate-50"
              >
                <Save className="w-3.5 h-3.5 mr-1 text-[#6B7280]" />
                {pt ? "Salvar Rascunho" : "Save Draft"}
              </Button>

              {currentStep === 1 ? (
                mode === "ai" ? (
                  <Button
                    size="sm"
                    onClick={handleGenerateAI}
                    disabled={!aiInput.prompt.trim()}
                    className="h-8 text-xs bg-[#2A6585] hover:bg-[#1E4D65] text-white shadow-sm"
                  >
                    <Sparkles className="w-3.5 h-3.5 mr-1.5" />
                    {pt ? "Gerar Sugestão com IA" : "Generate AI Suggestion"}
                  </Button>
                ) : (
                  <Button
                    size="sm"
                    onClick={() => {
                      if (!metadata.namePT.trim()) {
                        toast.error(pt ? "Informe ao menos o nome da jornada." : "Provide at least the journey name.");
                        return;
                      }
                      setCurrentStep(2);
                    }}
                    disabled={!metadata.namePT.trim()}
                    className="h-8 text-xs bg-[#2A6585] hover:bg-[#1E4D65] text-white shadow-sm"
                  >
                    {pt ? "Avançar para Composição" : "Advance to Composition"}
                    <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                  </Button>
                )
              ) : (
                <Button
                  size="sm"
                  onClick={handlePublishClick}
                  className="h-8 text-xs bg-[#2A6585] hover:bg-[#1E4D65] text-white shadow-sm font-semibold"
                >
                  <Send className="w-3.5 h-3.5 mr-1.5" />
                  {pt ? "Publicar Jornada" : "Publish Journey"}
                </Button>
              )}

              <Button
                variant="ghost"
                size="icon"
                onClick={() => onOpenChange(false)}
                className="h-8 w-8 text-[#6B7280] hover:text-[#0B192C] ml-2"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="flex-1 overflow-hidden">
            {currentStep === 1 ? (
              <JourneyDefinitionStep
                mode={mode}
                onModeChange={setMode}
                metadata={metadata}
                onMetadataChange={setMetadata}
                aiInput={aiInput}
                onAIInputChange={setAiInput}
                onAiInputChange={setAiInput}
                availableProcesses={Object.values(processes)}
                onContinue={() => {
                  if (!metadata.namePT.trim()) {
                    toast.error(pt ? "Informe o nome da jornada." : "Provide journey name.");
                    return;
                  }
                  setCurrentStep(2);
                }}
                onAdvanceToComposition={() => {
                  if (mode === "ai") {
                    handleGenerateAI();
                  } else {
                    if (!metadata.namePT.trim()) {
                      toast.error(pt ? "Informe o nome da jornada." : "Provide journey name.");
                      return;
                    }
                    setCurrentStep(2);
                  }
                }}
                onGenerateAI={handleGenerateAI}
                isGeneratingAI={isGeneratingAI}
              />
            ) : (
              <JourneyFlowCompositionStep
                mode={mode}
                metadata={metadata}
                steps={steps}
                onStepsChange={setSteps}
                availableProcesses={Object.values(processes)}
                aiConfidence={aiConfidence}
                onBackToDefinition={() => setCurrentStep(1)}
                onSaveDraft={handleSaveDraftClick}
                onPublish={handlePublishClick}
              />
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Confirmation Dialog for publishing with unlinked/pending steps */}
      <AlertDialog open={showPendingPublishDialog} onOpenChange={setShowPendingPublishDialog}>
        <AlertDialogContent className="bg-white border border-[#A5A7B0]/30 shadow-xl max-w-md">
          <AlertDialogHeader>
            <div className="w-10 h-10 rounded-full bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600 mb-2">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <AlertDialogTitle className="text-base font-semibold text-[#0B192C]">
              {pt ? "Jornada com etapas pendentes" : "Journey has pending steps"}
            </AlertDialogTitle>
            <AlertDialogDescription className="text-xs text-[#4B5563] leading-relaxed">
              {pt
                ? `Esta jornada possui ${pendingStepsCount} etapa(s) sem processo arquitetural formalmente vinculado ou com correspondência parcial. Você pode publicar agora com essas pendências identificadas ou voltar ao editor para vincular os processos correspondentes.`
                : `This journey has ${pendingStepsCount} step(s) without formally linked architectural processes. You can publish now with pending items noted or return to the editor to link processes.`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-4 gap-2">
            <AlertDialogCancel className="h-8 text-xs border-[#A5A7B0]/30 text-[#0B192C]">
              {pt ? "Voltar para Revisar" : "Back to Review"}
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                setShowPendingPublishDialog(false);
                doSave(true);
              }}
              className="h-8 text-xs bg-amber-600 hover:bg-amber-700 text-white font-medium"
            >
              {pt ? "Publicar com Pendências" : "Publish with Pending"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
