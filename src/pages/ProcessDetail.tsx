import { useState, useMemo, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FileText, GitBranch, ChevronRight, Info, TrendingUp, TrendingDown, Sparkles } from "lucide-react";
import { TopBar } from "@/components/layout/TopBar";
import { ProcessSidebar } from "@/components/layout/ProcessSidebar";
import { POPEditorView } from "@/components/process/POPEditorView";
import { BPMNEditor } from "@/components/process/BPMNEditor";
import { ProcessAttributes } from "@/components/process/ProcessAttributes";
import { ProcessSheet } from "@/components/process/ProcessSheet";
import { ProcessEditForm } from "@/components/process/ProcessEditForm";
import { ProcessAttributesAccordion } from "@/components/process/ProcessAttributesAccordion";
import { DocumentUploadFlow } from "@/components/onboarding/DocumentUploadFlow";
import { PreMappingView, buildMockPreMapping, type PreMappingData } from "@/components/process/PreMappingView";
import { TransformProcesses } from "@/pages/TransformProcesses";
import { ProcessAIChat } from "@/components/process/ProcessAIChat";
import { ToBeOverview } from "@/components/process/tobe/ToBeOverview";
import { ToBeBPMN } from "@/components/process/tobe/ToBeBPMN";
import { ToBeFields, FieldRow } from "@/components/process/tobe/ToBeFields";
import { ToBeUserStories } from "@/components/process/tobe/ToBeUserStories";
import { ToBeIntegrations } from "@/components/process/tobe/ToBeIntegrations";
import { useProcessStore } from "@/stores/processStore";
import { useLanguage } from "@/contexts/LanguageContext";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
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

interface ProcessDetailProps {
  onLogout: () => void;
}
import { DocumentationStatus } from "@/stores/processStore";

// Define the process type for this page
interface LocalProcessData {
  id: string;
  name: string;
  area: string;
  description: string;
  executor: string;
  approver: string;
  frequency: string;
  avgTime: string;
  hasPOP: boolean;
  hasBPMN: boolean;
  hasDocumentation: boolean;
  documentationStatus?: DocumentationStatus;
  isNewlyGenerated?: boolean;
  popVersion?: string;
  popStatus?: string;
  popUpdated?: string;
  bpmnVersion?: string;
  bpmnStatus?: string;
  bpmnUpdated?: string;
  automation: { maturity: number; risk: number };
  dataIntegrity: { maturity: number; risk: number };
  governanceCompliance: { maturity: number; risk: number };
  l1?: string;
  l2?: string;
  l3?: string;
  l4?: string;

  // Extra attributes (optional)
  owner?: string;
  supportTeam?: string;
  adhocMonthly?: string;
  sla?: string;
  createdAt?: string;
  lastReview?: string;
  regulations?: string;
  kpis?: string;
  systems?: string[];
  version?: string;
  docLastReview?: string;
  docNextReview?: string;
  executionEffort?: any[];
}

// Mock process data map with documentation status
const mockProcessesMap: Record<string, LocalProcessData> = {
  "1": {
    id: "1",
    name: "Cotação de Frete Emergencial",
    area: "S2P",
    description: "Processo de cotação e contratação de fretes emergenciais para atender demandas urgentes de transporte de materiais e produtos.",
    executor: "Analista de Logística",
    approver: "Coordenador de Fretes",
    frequency: "Semanal",
    avgTime: "2-3 dias úteis",
    hasPOP: true,
    hasBPMN: true,
    hasDocumentation: true,
    documentationStatus: 'generated',
    popVersion: "2.1",
    popStatus: "Publicado",
    popUpdated: "3 dias",
    bpmnVersion: "1.0",
    bpmnStatus: "Rascunho",
    bpmnUpdated: "1 semana",
    automation: { maturity: 72, risk: 28 },
    dataIntegrity: { maturity: 85, risk: 15 },
    governanceCompliance: { maturity: 68, risk: 42 },
  },
  "2": {
    id: "2",
    name: "Adjust EHS Learning Schedules",
    area: "H2R",
    description: "Adjust expiration dates of EHS learning schedules in Workday Learning",
    executor: "Training Project Specialist",
    approver: "EHS Team",
    frequency: "Monthly",
    avgTime: "1-2 days",
    hasPOP: true,
    hasBPMN: true,
    hasDocumentation: true,
    documentationStatus: 'generated',
    popVersion: "1.2",
    popStatus: "Published",
    popUpdated: "1 week",
    bpmnVersion: "1.0",
    bpmnStatus: "Published",
    bpmnUpdated: "2 weeks",
    automation: { maturity: 65, risk: 35 },
    dataIntegrity: { maturity: 78, risk: 22 },
    governanceCompliance: { maturity: 82, risk: 18 },
  },
  "3": {
    id: "3",
    name: "Novo Processo",
    area: "OTC",
    description: "Processo em fase inicial de documentação",
    executor: "A definir",
    approver: "A definir",
    frequency: "A definir",
    avgTime: "A definir",
    hasPOP: false,
    hasBPMN: false,
    hasDocumentation: false,
    documentationStatus: 'pending',
    automation: { maturity: 0, risk: 0 },
    dataIntegrity: { maturity: 0, risk: 0 },
    governanceCompliance: { maturity: 0, risk: 0 },
  },
};

const defaultProcess = mockProcessesMap["1"];

export function ProcessDetail({ onLogout }: ProcessDetailProps) {
  const navigate = useNavigate();
  const { id } = useParams();
  const { language } = useLanguage();
  const [activeTab, setActiveTab] = useState("overview");
  const [mode, setMode] = useState<"as-is" | "to-be">("as-is");
  const [toBeGenerated, setToBeGenerated] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [externalFields, setExternalFields] = useState<FieldRow[]>([]);
  let fieldIdCounter = useRef(100);

  const handleAddFieldFromChat = (fieldData: Omit<FieldRow, "id">) => {
    const newField: FieldRow = { ...fieldData, id: `ai-${++fieldIdCounter.current}` };
    setExternalFields(prev => [...prev, newField]);
  };
  
  // Get process from store
  const { processes, updateProcessDocumentation } = useProcessStore();
  const storeProcess = processes.find(p => p.id === id);
  
  // Get process data based on ID (check store first, then mock data)
  // Generate stable demo scores for new processes - use useMemo to keep values consistent
  const demoScores = useMemo(() => ({
    automation: { maturity: Math.floor(Math.random() * 30) + 55, risk: Math.floor(Math.random() * 25) + 20 },
    dataIntegrity: { maturity: Math.floor(Math.random() * 25) + 60, risk: Math.floor(Math.random() * 20) + 15 },
    governanceCompliance: { maturity: Math.floor(Math.random() * 30) + 50, risk: Math.floor(Math.random() * 30) + 25 },
  }), [id]); // Only regenerate when process ID changes

  const initialProcess = useMemo((): LocalProcessData => {
    
    if (storeProcess) {
      // Convert store process to the local format
      // Use demo scores if process doesn't have scores yet
      return {
        id: storeProcess.id,
        name: storeProcess.name,
        area: storeProcess.area,
        description: storeProcess.description,
        executor: storeProcess.executor || "",
        approver: storeProcess.approver || "",
        frequency: storeProcess.frequency || "",
        avgTime: storeProcess.avgTime || "",
        hasPOP: storeProcess.hasDocumentation,
        hasBPMN: storeProcess.hasDocumentation,
        hasDocumentation: storeProcess.hasDocumentation,
        documentationStatus: storeProcess.documentationStatus,
        automation: storeProcess.automation || demoScores.automation,
        dataIntegrity: storeProcess.dataIntegrity || demoScores.dataIntegrity,
        governanceCompliance: storeProcess.governance || demoScores.governanceCompliance,
        l1: storeProcess.l1 || "",
        l2: storeProcess.l2 || "",
        l3: storeProcess.l3 || "",
        l4: storeProcess.l4 || "",

        // Extra attributes
        owner: storeProcess.owner,
        supportTeam: storeProcess.supportTeam,
        adhocMonthly: storeProcess.adhocMonthly,
        sla: storeProcess.sla,
        createdAt: storeProcess.createdAt,
        lastReview: storeProcess.lastReview,
        regulations: storeProcess.regulations,
        kpis: storeProcess.kpis,
        systems: storeProcess.systems,
        version: storeProcess.version,
        docLastReview: storeProcess.docLastReview,
        docNextReview: storeProcess.docNextReview,
        executionEffort: storeProcess.executionEffort,
      };
    }
    return mockProcessesMap[id || "1"] || defaultProcess;
  }, [id, storeProcess]);
  
  const [rawProcess, setProcess] = useState<LocalProcessData>(initialProcess);

  // Override scores for the Span & Layer demo so Overview + Assessment stay in sync
  const process = useMemo<LocalProcessData>(() => {
    const n = rawProcess.name?.toLowerCase() || "";
    if (n.includes("span") && n.includes("layer")) {
      return {
        ...rawProcess,
        automation: { maturity: 0, risk: 41 },
        dataIntegrity: { maturity: 85, risk: 17 },
        governanceCompliance: { maturity: 100, risk: 0 },
      };
    }
    return rawProcess;
  }, [rawProcess]);

  const [showOnboarding, setShowOnboarding] = useState(false);
  const [preMapping, setPreMapping] = useState<PreMappingData | null>(null);

  // Track unsaved changes in attributes page
  const [attributesDirty, setAttributesDirty] = useState(false);
  const [showLeaveDialog, setShowLeaveDialog] = useState(false);
  const [pendingTab, setPendingTab] = useState<string | null>(null);
  const [pendingBack, setPendingBack] = useState(false);

  // Update process state when store changes
  useEffect(() => {
    if (storeProcess) {
      setProcess({
        id: storeProcess.id,
        name: storeProcess.name,
        area: storeProcess.area,
        description: storeProcess.description,
        executor: storeProcess.executor || "",
        approver: storeProcess.approver || "",
        frequency: storeProcess.frequency || "",
        avgTime: storeProcess.avgTime || "",
        hasPOP: storeProcess.hasDocumentation,
        hasBPMN: storeProcess.hasDocumentation,
        hasDocumentation: storeProcess.hasDocumentation,
        documentationStatus: storeProcess.documentationStatus,
        automation: storeProcess.automation || demoScores.automation,
        dataIntegrity: storeProcess.dataIntegrity || demoScores.dataIntegrity,
        governanceCompliance: storeProcess.governance || demoScores.governanceCompliance,
        l1: storeProcess.l1 || "",
        l2: storeProcess.l2 || "",
        l3: storeProcess.l3 || "",
        l4: storeProcess.l4 || "",

        owner: storeProcess.owner,
        supportTeam: storeProcess.supportTeam,
        adhocMonthly: storeProcess.adhocMonthly,
        sla: storeProcess.sla,
        createdAt: storeProcess.createdAt,
        lastReview: storeProcess.lastReview,
        regulations: storeProcess.regulations,
        kpis: storeProcess.kpis,
        systems: storeProcess.systems,
        version: storeProcess.version,
        docLastReview: storeProcess.docLastReview,
        docNextReview: storeProcess.docNextReview,
        executionEffort: storeProcess.executionEffort,
      });
    }
  }, [storeProcess]);

  const handleModeChange = (newMode: "as-is" | "to-be") => {
    setMode(newMode);
    if (newMode === "to-be") {
      setActiveTab(toBeGenerated ? "tobe-bpmn" : "tobe-upload");
    } else {
      setActiveTab("overview");
    }
    setAttributesDirty(false);
  };

  const requestTabChange = (nextTab: string) => {
    if (activeTab === 'process-attributes' && attributesDirty) {
      setPendingTab(nextTab);
      setPendingBack(false);
      setShowLeaveDialog(true);
      return;
    }
    setActiveTab(nextTab);
  };

  const requestBack = () => {
    if (activeTab === 'process-attributes' && attributesDirty) {
      setPendingTab(null);
      setPendingBack(true);
      setShowLeaveDialog(true);
      return;
    }
    navigate('/processes');
  };

  // A visão geral fica sempre disponível: o fluxo de geração só abre quando o usuário pedir.
  useEffect(() => {
    setShowOnboarding(false);
  }, [id]);


  const handleDocumentUploaded = () => {
    // Update store
    if (id && storeProcess) {
      updateProcessDocumentation(id, 'generated');
    }
    
    setProcess({ 
      ...process, 
      hasPOP: true, 
      hasBPMN: true, 
      hasDocumentation: true,
      documentationStatus: 'generated' as const,
      isNewlyGenerated: true,
      popVersion: "1.0",
      popStatus: language === "PT" ? "Rascunho" : "Draft",
      popUpdated: language === "PT" ? "agora" : "now",
      bpmnVersion: "1.0",
      bpmnStatus: language === "PT" ? "Rascunho" : "Draft",
      bpmnUpdated: language === "PT" ? "agora" : "now",
      // Generate mock scores
      automation: { maturity: Math.floor(Math.random() * 30) + 50, risk: Math.floor(Math.random() * 30) + 20 },
      dataIntegrity: { maturity: Math.floor(Math.random() * 30) + 55, risk: Math.floor(Math.random() * 25) + 15 },
      governanceCompliance: { maturity: Math.floor(Math.random() * 30) + 45, risk: Math.floor(Math.random() * 35) + 25 },
    });
    setShowOnboarding(false);
    setActiveTab("overview");
  };

  const handlePreMappingGenerated = (input: { name: string; description: string; area: string; systems: string[] }) => {
    setPreMapping(buildMockPreMapping(input));
    setShowOnboarding(false);
    setActiveTab("pre-mapping");
  };

  const handleStartFullDocumentation = () => {
    setShowOnboarding(true);
  };

  const showChat = mode === "to-be" && toBeGenerated && activeTab !== "tobe-upload";

  const handleToBeGenerated = () => {
    setToBeGenerated(true);
    setActiveTab("tobe-bpmn");
  };

  const renderToBeContent = () => {
    if (!toBeGenerated) {
      return <ToBeOverview onGenerated={handleToBeGenerated} />;
    }
    switch (activeTab) {
      case "tobe-bpmn": return <ToBeBPMN />;
      case "tobe-fields": return <ToBeFields externalFields={externalFields} />;
      case "tobe-user-stories": return <ToBeUserStories />;
      default: return <ToBeBPMN />;
    }
  };

  const renderContent = () => {
    if (mode === "to-be") return renderToBeContent();

    // Show full onboarding (3 options) when on overview without anything yet
    if (showOnboarding && activeTab === "overview") {
      return (
        <DocumentUploadFlow
          onComplete={handleDocumentUploaded}
          onPreMappingComplete={!preMapping ? handlePreMappingGenerated : undefined}
          initialName={process.name}
          initialDescription={process.description}
          initialArea={process.area}
          mode="all"
        />
      );
    }

    // Pre-mapping tab without a generated pre-mapping → show only the pre-mapping option
    if (activeTab === "pre-mapping" && !preMapping) {
      return (
        <DocumentUploadFlow
          onComplete={handleDocumentUploaded}
          onPreMappingComplete={handlePreMappingGenerated}
          initialName={process.name}
          initialDescription={process.description}
          initialArea={process.area}
          mode="premapping-only"
        />
      );
    }

    // POP/BPMN/Assessment without docs → show only docs options (centered)
    if (!process.hasDocumentation && (activeTab === "pop-sop" || activeTab === "bpmn" || activeTab === "assessment")) {
      return (
        <DocumentUploadFlow
          onComplete={handleDocumentUploaded}
          initialName={process.name}
          initialDescription={process.description}
          initialArea={process.area}
          mode="docs-only"
        />
      );
    }

    switch (activeTab) {
      case "pre-mapping":
        return preMapping ? (
          <PreMappingView
            data={preMapping}
            hasDocumentation={process.hasDocumentation}
            onGenerateDocs={handleStartFullDocumentation}
          />
        ) : <ProcessOverview process={process} onNavigate={setActiveTab} onGenerateDocs={handleStartFullDocumentation} />;
      case "pop-sop":
        return <POPEditorView hasPOP={process.hasPOP} processId={id} processName={process.name} isNewlyGenerated={process.isNewlyGenerated} />;
      case "bpmn":
        return (
          <BPMNEditor
            key={`bpmn-${id || "1"}`}
            hasBPMN={process.hasBPMN}
            hasPOP={process.hasPOP}
            isNewlyGenerated={process.isNewlyGenerated}
            processId={id}
            processName={process.name}
          />
        );
      case "assessment": {
        const isSpanLayer = process.name?.toLowerCase().includes("span") && process.name?.toLowerCase().includes("layer");
        return (
          <ProcessAttributes 
            hasPOP={process.hasPOP} 
            processName={process.name}
            automation={isSpanLayer ? { maturity: 0, risk: 41 } : process.automation}
            dataIntegrity={isSpanLayer ? { maturity: 85, risk: 17 } : process.dataIntegrity}
            governance={isSpanLayer ? { maturity: 100, risk: 0 } : process.governanceCompliance}
          />
        );
      }
      case "process-attributes":
        return (
          <ProcessAttributesAccordion 
            process={process} 
            onSave={() => {
              setAttributesDirty(false);
              setActiveTab("overview");
            }} 
            onCancel={() => {
              setAttributesDirty(false);
              setActiveTab("overview");
            }}
            onDirtyChange={setAttributesDirty}
          />
        );
      case "transform-pipeline":
        return (
          <TransformProcesses
            embedded
            initialProcessName={process.name}
            initialContext={process.description}
            initialStep="context"
            hasFullDocumentation={process.hasPOP && process.hasBPMN && process.hasDocumentation}
            initialArea={process.area}
            initialSystems={(process as any).systems || []}
          />
        );
      case "edit":
        return <ProcessEditForm process={process} onSave={() => setActiveTab("overview")} />;
      default:
        return <ProcessOverview process={process} onNavigate={setActiveTab} onGenerateDocs={handleStartFullDocumentation} />;
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <TopBar onLogout={onLogout} />

      <div className="flex-1 flex">
        <ProcessSidebar
          activeTab={activeTab}
          onTabChange={requestTabChange}
          onBack={requestBack}
          processName={process.name}
          hasPOP={process.hasPOP}
          hasBPMN={process.hasBPMN}
          hasAttributes={process.hasDocumentation}
          hasPreMapping={!!preMapping}
          mode={mode}
          onModeChange={handleModeChange}
          toBeGenerated={toBeGenerated}
          onOpenTransformPipeline={() => requestTabChange("transform-pipeline")}
        />

        <main className={cn("flex-1 ml-[220px] overflow-auto", showChat && (chatOpen ? "mr-[320px]" : "mr-12"))}>
          {renderContent()}
        </main>

        {showChat && (
          <ProcessAIChat open={chatOpen} onToggle={() => setChatOpen(o => !o)} onAddField={handleAddFieldFromChat} />
        )}
      </div>

      {/* Leave Attributes Confirmation */}
      <AlertDialog open={showLeaveDialog} onOpenChange={setShowLeaveDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {language === 'PT' ? 'Mudanças não salvas' : 'Unsaved Changes'}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {language === 'PT'
                ? 'Você tem alterações não salvas. Deseja sair e descartar essas alterações?'
                : 'You have unsaved changes. Do you want to leave and discard them?'}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setShowLeaveDialog(false)}>
              {language === 'PT' ? 'Ficar' : 'Stay'}
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                setShowLeaveDialog(false);
                setAttributesDirty(false);
                if (pendingBack) {
                  navigate('/processes');
                  return;
                }
                if (pendingTab) {
                  setActiveTab(pendingTab);
                }
              }}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {language === 'PT' ? 'Descartar e Sair' : 'Discard & Leave'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

interface ProcessOverviewProps {
  process: typeof defaultProcess;
  onNavigate: (tab: string) => void;
  onGenerateDocs?: () => void;
}

function ProcessOverview({ process, onNavigate, onGenerateDocs }: ProcessOverviewProps) {
  const { t, language } = useLanguage();

  const getMaturityLabel = (score: number) => {
    if (language === "PT") {
      if (score >= 80) return "Alta maturidade";
      if (score >= 60) return "Maturidade moderada";
      if (score >= 40) return "Em desenvolvimento";
      return "Estágio inicial";
    }
    if (score >= 80) return "High maturity";
    if (score >= 60) return "Moderate maturity";
    if (score >= 40) return "Developing";
    return "Initial stage";
  };

  // Color based on score - for maturity (higher = better = green)
  const getMaturityColor = (score: number) => {
    if (score >= 70) return "bg-green-500";
    if (score >= 50) return "bg-yellow-500";
    if (score >= 30) return "bg-orange-500";
    return "bg-red-500";
  };

  // Color based on score - for risk (lower = better = green)
  const getRiskColor = (score: number) => {
    if (score <= 25) return "bg-green-500";
    if (score <= 50) return "bg-yellow-500";
    if (score <= 75) return "bg-orange-500";
    return "bg-red-500";
  };

  const getRiskLabel = (score: number) => {
    if (language === "PT") {
      if (score <= 25) return "Baixo risco";
      if (score <= 50) return "Risco moderado";
      if (score <= 75) return "Risco elevado";
      return "Alto risco";
    }
    if (score <= 25) return "Low risk";
    if (score <= 50) return "Moderate risk";
    if (score <= 75) return "Elevated risk";
    return "High risk";
  };

  const pillars = [
    {
      id: "automation",
      name: language === "PT" ? "AUTOMAÇÃO" : "AUTOMATION",
      maturity: process.automation.maturity,
      maturityLabel: getMaturityLabel(process.automation.maturity),
      risk: process.automation.risk,
      riskLabel: getRiskLabel(process.automation.risk),
      description: language === "PT" 
        ? "Avalia o nível de automatização do processo, incluindo uso de sistemas, integrações e redução de intervenções manuais."
        : "Evaluates the level of process automation, including system usage, integrations and reduction of manual interventions.",
    },
    {
      id: "dataIntegrity",
      name: language === "PT" ? "INTEGRIDADE DOS DADOS" : "DATA INTEGRITY",
      maturity: process.dataIntegrity.maturity,
      maturityLabel: getMaturityLabel(process.dataIntegrity.maturity),
      risk: process.dataIntegrity.risk,
      riskLabel: getRiskLabel(process.dataIntegrity.risk),
      description: language === "PT"
        ? "Mede a qualidade, consistência e confiabilidade dos dados ao longo do processo, incluindo validações e rastreabilidade."
        : "Measures data quality, consistency and reliability throughout the process, including validations and traceability.",
    },
    {
      id: "governance",
      name: language === "PT" ? "GOVERNANÇA" : "GOVERNANCE",
      maturity: process.governanceCompliance.maturity,
      maturityLabel: getMaturityLabel(process.governanceCompliance.maturity),
      risk: process.governanceCompliance.risk,
      riskLabel: getRiskLabel(process.governanceCompliance.risk),
      description: language === "PT"
        ? "Analisa conformidade com políticas internas, controles de acesso, segregação de funções e aderência a normas regulatórias."
        : "Analyzes compliance with internal policies, access controls, segregation of duties and adherence to regulatory standards.",
    },
  ];

  const contextItems = [
    { label: "EXECUTOR", value: process.executor },
    { label: language === "PT" ? "APROVADOR" : "APPROVER", value: process.approver },
    { label: language === "PT" ? "FREQUÊNCIA" : "FREQUENCY", value: process.frequency },
    { label: language === "PT" ? "TEMPO MÉDIO" : "AVG TIME", value: process.avgTime },
  ];

  return (
    <div className="p-8 px-10 animate-fade-in">
      {/* Process Header - No card background */}
      <div className="mb-8 relative">
        {/* Area Badge */}
        <span className="inline-flex px-2.5 py-1 bg-muted rounded-md text-[12px] font-medium text-muted-foreground mb-2.5">
          {process.area}
        </span>
        
        {/* Title */}
        <h1 className="text-[22px] font-semibold text-foreground mb-1.5">
          {process.name}
        </h1>
        
        {/* Description */}
        <p className="text-[14px] text-muted-foreground max-w-[600px]">
          {process.description}
        </p>
        
      </div>

      {/* Process Health Section */}
      <div className="bg-card border border-border rounded-2xl py-3 px-6 mb-5">
        <div className="flex items-center gap-2 mb-2.5">

          <h2 className="text-[11px] font-semibold uppercase tracking-[0.5px] text-muted-foreground">
            {language === "PT" ? "SAÚDE DO PROCESSO" : "PROCESS HEALTH"}
          </h2>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-primary/10 rounded-full cursor-help">
                  <Sparkles className="h-3 w-3 text-primary" />
                  <span className="text-[10px] font-medium text-primary">IA</span>
                </span>
              </TooltipTrigger>
              <TooltipContent side="right" className="max-w-[280px]">
                <p className="text-[12px]">
                  {language === "PT" 
                    ? "Estas métricas são geradas automaticamente por Inteligência Artificial com base na análise da documentação do processo."
                    : "These metrics are automatically generated by Artificial Intelligence based on process documentation analysis."}
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        
        {/* Sem documentação: CTA para gerar */}
        {!process.hasDocumentation ? (
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 py-3">
            <div className="max-w-[560px]">
              <p className="text-[13px] font-medium text-foreground mb-0.5">
                {language === "PT"
                  ? "Assessment ainda não disponível"
                  : "Assessment not available yet"}
              </p>
              <p className="text-[12px] text-muted-foreground">
                {language === "PT"
                  ? "As notas de automação, integridade dos dados e governança são calculadas pela IA a partir da documentação. Gere a documentação para liberar POP, BPMN e Assessment."
                  : "Automation, data integrity and governance scores are calculated by AI from the documentation. Generate the documentation to unlock SOP, BPMN and Assessment."}
              </p>
            </div>
            <button
              onClick={onGenerateDocs}
              className="shrink-0 inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-[13px] font-medium hover:opacity-90 transition-opacity"
            >
              <Sparkles className="h-4 w-4" />
              {language === "PT" ? "Gerar documentação" : "Generate documentation"}
            </button>
          </div>
        ) : (
        /* Three-column grid */
        <div className="grid grid-cols-3">

          {pillars.map((pillar, index) => (
            <div
              key={pillar.id}
              className={cn(
                "px-6 first:pl-0 last:pr-0",
                index < pillars.length - 1 && "border-r border-border-light"
              )}
            >
              {/* Pillar Title with Info Icon */}
              <div className="flex items-center gap-2 mb-2">
                <h3 className="text-[11px] font-semibold text-foreground tracking-[0.3px]">
                  {pillar.name}
                </h3>

                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button className="text-muted-foreground hover:text-foreground transition-colors">
                        <Info className="h-3.5 w-3.5" />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent side="top" className="max-w-[260px]">
                      <p className="text-[12px]">{pillar.description}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              
              {/* Maturidade Block */}
              <div className="mb-2.5">
                <div className="flex items-center gap-1.5 mb-0.5">
                  <p className="text-[11px] text-muted-foreground">
                    {language === "PT" ? "Maturidade" : "Maturity"}
                  </p>
                  <TrendingUp className="h-3 w-3 text-emerald-500" />
                  <span className="text-[9px] text-emerald-600 font-medium">
                    {language === "PT" ? "maior = melhor" : "higher = better"}
                  </span>
                </div>
                <div className="flex items-baseline gap-1.5 mb-1">
                  <span className="text-[18px] font-semibold text-foreground tabular-nums leading-none">
                    {pillar.maturity}
                  </span>
                  <span className="text-[11px] text-muted-foreground">/100</span>
                  <span className="text-[10px] text-muted-foreground ml-auto">{pillar.maturityLabel}</span>
                </div>
                <div className="h-1 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${getMaturityColor(pillar.maturity)}`}
                    style={{ width: `${pillar.maturity}%` }}
                  />
                </div>
              </div>
              
              {/* Risco/Esforço Block - Automação usa "Esforço", outros usam "Risco" */}
              <div>
                <div className="flex items-center gap-1.5 mb-0.5">
                  <p className="text-[11px] text-muted-foreground">
                    {pillar.id === "automation" 
                      ? (language === "PT" ? "Esforço" : "Effort")
                      : (language === "PT" ? "Risco" : "Risk")
                    }
                  </p>
                  <TrendingDown className="h-3 w-3 text-red-500" />
                  <span className="text-[9px] text-red-600 font-medium">
                    {language === "PT" ? "maior = pior" : "higher = worse"}
                  </span>
                </div>

                <div className="flex items-baseline gap-1.5 mb-1">
                  <span className="text-[18px] font-semibold text-foreground tabular-nums leading-none">
                    {pillar.risk}
                  </span>
                  <span className="text-[11px] text-muted-foreground">/100</span>
                  <span className="text-[10px] text-muted-foreground ml-auto">{pillar.riskLabel}</span>
                </div>
                <div className="h-1 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${getRiskColor(pillar.risk)}`}
                    style={{ width: `${pillar.risk}%` }}
                  />
                </div>
              </div>

            </div>
          ))}
        </div>
        )}
      </div>


      {/* Process Datasheet */}
      <ProcessSheet process={process} />

    </div>
  );
}
