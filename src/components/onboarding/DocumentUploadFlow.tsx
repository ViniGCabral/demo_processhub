import { useState, useRef, useEffect } from "react";
import {
  Upload,
  FileVideo,
  FileText,
  Sparkles,
  Check,
  Brain,
  Database,
  Shield,
  Workflow,
  FileCheck,
  Cpu,
  Zap,
  X,
  Globe,
  Wand2,
  Plus,
  Building2,
  Users,
  GitCompare,
  Trash2,
  Layers,
  Scale,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/contexts/LanguageContext";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useBusinessUnitStore } from "@/stores/businessUnitStore";
import {
  useSopVariantsStore,
  type VariantDivergenceReason,
  type VariantUploadInput,
} from "@/stores/sopVariantsStore";

interface DocumentUploadFlowProps {
  onComplete: (options?: { openComparison?: boolean }) => void;
  onPreMappingComplete?: (data: {
    name: string;
    description: string;
    area: string;
    systems: string[];
  }) => void;
  processId?: string;
  initialName?: string;
  initialDescription?: string;
  initialArea?: string;
  initialBusinessUnit?: string;
  /** "all" shows the 3 options; "premapping-only" only the pre-mapping card; "docs-only" only video + document; "add-variant" appends variants to an already documented process. */
  mode?: "all" | "premapping-only" | "docs-only" | "add-variant";
}

type UploadType = "video" | "document" | "premapping" | null;
type FlowStep =
  | "select"
  | "upload"
  | "premapping-form"
  | "premapping-processing"
  | "processing"
  | "complete";

interface ProcessingStep {
  id: number;
  labelPT: string;
  labelEN: string;
  icon: React.ElementType;
  duration: number; // ms
}

const processingSteps: ProcessingStep[] = [
  { id: 1, labelPT: "Analisando arquivo...", labelEN: "Analyzing file...", icon: FileCheck, duration: 1100 },
  { id: 2, labelPT: "Agente IA: Transcrevendo áudio do vídeo...", labelEN: "AI Agent: Transcribing video audio...", icon: Brain, duration: 1400 },
  { id: 3, labelPT: "Agente IA: Gerando estrutura da POP...", labelEN: "AI Agent: Generating SOP structure...", icon: Brain, duration: 1700 },
  { id: 4, labelPT: "Agente IA: Criando diagrama BPMN...", labelEN: "AI Agent: Creating BPMN diagram...", icon: Workflow, duration: 1300 },
  { id: 5, labelPT: "Agente IA: Analisando potencial de Automação...", labelEN: "AI Agent: Analyzing Automation potential...", icon: Cpu, duration: 1200 },
  { id: 6, labelPT: "Agente IA: Verificando Data Integrity...", labelEN: "AI Agent: Verifying Data Integrity...", icon: Database, duration: 1100 },
  { id: 7, labelPT: "Agente IA: Avaliando Governança e Compliance...", labelEN: "AI Agent: Evaluating Governance & Compliance...", icon: Shield, duration: 1200 },
  { id: 8, labelPT: "Finalizando documentação...", labelEN: "Finalizing documentation...", icon: Zap, duration: 900 },
];

const videoExtensions = ".mp4,.mov,.webm,.avi,.mkv";
const documentExtensions = ".doc,.docx,.pdf,.txt,.rtf";
const transcriptionFormats = ".txt,.doc,.docx,.pdf";

interface VariantDraftSlot {
  id: string;
  name: string;
  nameManuallyEdited: boolean;
  isDifferentBU: boolean;
  businessUnit: string;
  divergenceReason: VariantDivergenceReason;
  divergenceDetail: string;
  selectedFile: File | null;
  transcriptionFile: File | null;
}

export function DocumentUploadFlow({
  onComplete,
  onPreMappingComplete,
  processId = "1",
  initialName = "",
  initialDescription = "",
  initialArea = "",
  initialBusinessUnit = "",
  mode = "all",
}: DocumentUploadFlowProps) {
  const { language } = useLanguage();
  const pt = language === "PT";
  const { units, addUnit } = useBusinessUnitStore();
  const addVariantsFromUpload = useSopVariantsStore((s) => s.addVariantsFromUpload);

  const defaultBU = initialBusinessUnit || units[0] || "SOMOS/Saber";

  const [uploadType, setUploadType] = useState<UploadType>(
    mode === "add-variant" ? "video" : null
  );
  const [flowStep, setFlowStep] = useState<FlowStep>(
    mode === "add-variant" ? "upload" : "select"
  );
  const [contentLanguage, setContentLanguage] = useState<"PT" | "EN">("PT");

  // Multi-variant slots state (starts with 1 slot by default)
  const [variantSlots, setVariantSlots] = useState<VariantDraftSlot[]>(() => [
    {
      id: "slot-1",
      name: mode === "add-variant" ? "" : defaultBU,
      nameManuallyEdited: false,
      isDifferentBU: mode === "add-variant",
      businessUnit: defaultBU,
      divergenceReason: "business_unit",
      divergenceDetail: "",
      selectedFile: null,
      transcriptionFile: null,
    },
  ]);

  // Inline creation of a new Business Unit inside any slot
  const [addingBUForSlotId, setAddingBUForSlotId] = useState<string | null>(null);
  const [newBUName, setNewBUName] = useState("");

  // Hidden file input refs keyed by slot ID
  const fileInputRefs = useRef<Record<string, HTMLInputElement | null>>({});
  const transcriptionInputRefs = useRef<Record<string, HTMLInputElement | null>>({});

  // Parallel processing state per slot
  const [slotProgressMap, setSlotProgressMap] = useState<
    Record<string, { stepIndex: number; stepProgress: number; done: boolean }>
  >({});
  const [consolidationProgress, setConsolidationProgress] = useState(0);
  const [isConsolidating, setIsConsolidating] = useState(false);

  // Single-stream processing state (kept for 1 slot visual compatibility)
  const [currentProcessingStep, setCurrentProcessingStep] = useState(0);
  const [stepProgress, setStepProgress] = useState(0);

  // Pre-mapping form state
  const [pmName, setPmName] = useState(initialName);
  const [pmDescription, setPmDescription] = useState(initialDescription);
  const [pmArea, setPmArea] = useState(initialArea);
  const [pmSystems, setPmSystems] = useState<string[]>([]);
  const [pmSystemDraft, setPmSystemDraft] = useState("");
  const [pmProgress, setPmProgress] = useState(0);

  useEffect(() => {
    if (initialBusinessUnit && variantSlots.length === 1 && !variantSlots[0].nameManuallyEdited && mode !== "add-variant") {
      setVariantSlots((prev) => [
        {
          ...prev[0],
          businessUnit: initialBusinessUnit,
          name: initialBusinessUnit,
        },
      ]);
    }
  }, [initialBusinessUnit]);

  const handleTypeSelect = (type: UploadType) => {
    setUploadType(type);
    if (type === "premapping") {
      setFlowStep("premapping-form");
    } else {
      setFlowStep("upload");
    }
  };

  const handleAddVariantSlot = () => {
    setVariantSlots((prev) => {
      const nextIndex = prev.length + 1;
      // Pick a different BU from store as smart default suggestion if available
      const usedBUs = new Set(prev.map((s) => s.businessUnit));
      const suggestedBU = units.find((u) => !usedBUs.has(u)) || units[nextIndex % units.length] || defaultBU;
      const isDiffBU = suggestedBU !== prev[0]?.businessUnit;

      return [
        ...prev,
        {
          id: `slot-${Date.now()}-${nextIndex}`,
          name: isDiffBU ? suggestedBU : `Execução #${nextIndex}`,
          nameManuallyEdited: false,
          isDifferentBU: isDiffBU,
          businessUnit: suggestedBU,
          divergenceReason: isDiffBU ? "business_unit" : "executor",
          divergenceDetail: isDiffBU
            ? pt
              ? "Unidade de Negócio diferente"
              : "Different Business Unit"
            : pt
              ? "Executado por pessoa / equipe diferente"
              : "Executed by different person / team",
          selectedFile: null,
          transcriptionFile: null,
        },
      ];
    });
  };

  const handleRemoveVariantSlot = (slotId: string) => {
    setVariantSlots((prev) => (prev.length <= 1 ? prev : prev.filter((s) => s.id !== slotId)));
  };

  const updateSlot = (slotId: string, patch: Partial<VariantDraftSlot>) => {
    setVariantSlots((prev) =>
      prev.map((slot, idx) => {
        if (slot.id !== slotId) return slot;
        const updated = { ...slot, ...patch };

        // Auto-suggest the variant name if the user changed BU or divergenceReason and hasn't typed a manual name
        if (!updated.nameManuallyEdited) {
          if (patch.businessUnit !== undefined || patch.divergenceReason !== undefined || patch.isDifferentBU !== undefined) {
            if (updated.divergenceReason === "business_unit" && updated.businessUnit) {
              updated.name = updated.businessUnit;
            } else if (updated.divergenceReason === "executor") {
              updated.name = idx === 0 ? "Execução - Analista Sênior" : `Execução - Analista #${idx + 1}`;
            } else if (updated.divergenceReason === "country") {
              updated.name = idx === 0 ? "Operação Brasil" : idx === 1 ? "Operação México" : `Operação País #${idx + 1}`;
            } else if (updated.divergenceReason === "channel") {
              updated.name = idx === 0 ? "Canal Direto / Matriz" : `Canal / Turno #${idx + 1}`;
            }
          }
        }
        return updated;
      })
    );
  };

  const handleCreateNewBUForSlot = (slotId: string) => {
    const clean = newBUName.trim();
    if (!clean) return;
    addUnit(clean);
    updateSlot(slotId, {
      businessUnit: clean,
      isDifferentBU: true,
      divergenceReason: "business_unit",
    });
    setNewBUName("");
    setAddingBUForSlotId(null);
  };

  const handleFillDemoFiles = () => {
    const isVideo = uploadType === "video";
    setVariantSlots((prev) =>
      prev.map((slot, idx) => {
        const safeLabel = (slot.name || slot.businessUnit || `Variante_${idx + 1}`).replace(/[^a-zA-Z0-9_-]/g, "_");
        const mockMainFile = new File(
          ["mock-process-recording-content"],
          isVideo ? `Gravacao_Cadastro_Conta_${safeLabel}.mp4` : `POP_Cadastro_Conta_${safeLabel}.docx`,
          { type: isVideo ? "video/mp4" : "application/vnd.openxmlformats-officedocument.wordprocessingml.document" }
        );
        const mockTransFile = isVideo
          ? new File(["mock-transcription-content"], `Transcricao_${safeLabel}.txt`, { type: "text/plain" })
          : null;
        return {
          ...slot,
          selectedFile: slot.selectedFile || mockMainFile,
          transcriptionFile: isVideo ? slot.transcriptionFile || mockTransFile : null,
        };
      })
    );
  };

  const handleGeneratePreMapping = () => {
    setFlowStep("premapping-processing");
    setPmProgress(0);
    const t = setInterval(() => {
      setPmProgress((p) => {
        const next = p + 4 + Math.random() * 6;
        if (next >= 100) {
          clearInterval(t);
          setTimeout(() => {
            onPreMappingComplete?.({
              name: pmName.trim(),
              description: pmDescription.trim(),
              area: pmArea.trim(),
              systems: pmSystems,
            });
          }, 400);
          return 100;
        }
        return next;
      });
    }, 120);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const saveGeneratedVariantsToStore = () => {
    const inputs: VariantUploadInput[] = variantSlots.map((slot, idx) => ({
      name: slot.name.trim() || slot.businessUnit || `Procedimento #${idx + 1}`,
      businessUnit: slot.businessUnit || defaultBU,
      divergenceReason: slot.divergenceReason,
      divergenceDetail: slot.divergenceDetail,
      sourceType: uploadType === "document" ? "document" : "video",
      sourceFileName: slot.selectedFile?.name,
      transcriptionFileName: slot.transcriptionFile?.name,
    }));

    addVariantsFromUpload(
      processId,
      initialName || "Processo Operacional",
      initialArea || "Operações",
      inputs,
      mode !== "add-variant" // replace seed variants if this is the initial onboarding upload
    );
  };

  const handleUpload = () => {
    setFlowStep("processing");

    if (variantSlots.length === 1) {
      // Classic single stream
      setCurrentProcessingStep(0);
      setStepProgress(0);
      let stepIndex = 0;

      const processStep = () => {
        if (stepIndex >= processingSteps.length) {
          saveGeneratedVariantsToStore();
          setTimeout(() => {
            setFlowStep("complete");
          }, 500);
          return;
        }

        setCurrentProcessingStep(stepIndex);
        setStepProgress(0);

        const stepDuration = processingSteps[stepIndex].duration;
        const progressInterval = 50;
        const progressIncrement = (progressInterval / stepDuration) * 100;

        let currentProgress = 0;
        const progressTimer = setInterval(() => {
          currentProgress += progressIncrement;
          setStepProgress(Math.min(currentProgress, 100));

          if (currentProgress >= 100) {
            clearInterval(progressTimer);
            stepIndex++;
            setTimeout(processStep, 200);
          }
        }, progressInterval);
      };

      processStep();
      return;
    }

    // Parallel processing for 2+ variants!
    const initialMap: Record<string, { stepIndex: number; stepProgress: number; done: boolean }> = {};
    variantSlots.forEach((slot) => {
      initialMap[slot.id] = { stepIndex: 0, stepProgress: 0, done: false };
    });
    setSlotProgressMap(initialMap);
    setIsConsolidating(false);
    setConsolidationProgress(0);

    let completedCount = 0;
    const totalSlots = variantSlots.length;

    variantSlots.forEach((slot, slotIdx) => {
      // Slight speed multiplier per lane so parallel streams look organic and realistic
      const speedFactor = 0.65 + (slotIdx % 3) * 0.12;
      let stepIndex = 0;

      const runSlotStep = () => {
        if (stepIndex >= processingSteps.length) {
          setSlotProgressMap((prev) => ({
            ...prev,
            [slot.id]: { stepIndex: processingSteps.length - 1, stepProgress: 100, done: true },
          }));
          completedCount++;

          if (completedCount >= totalSlots) {
            // Start cross-variant comparison & benchmark consolidation step
            setIsConsolidating(true);
            let consProg = 0;
            const consTimer = setInterval(() => {
              consProg += 8;
              setConsolidationProgress(Math.min(consProg, 100));
              if (consProg >= 100) {
                clearInterval(consTimer);
                saveGeneratedVariantsToStore();
                setTimeout(() => {
                  setFlowStep("complete");
                }, 450);
              }
            }, 90);
          }
          return;
        }

        setSlotProgressMap((prev) => ({
          ...prev,
          [slot.id]: { stepIndex, stepProgress: 0, done: false },
        }));

        const stepDuration = processingSteps[stepIndex].duration * speedFactor;
        const progressInterval = 50;
        const progressIncrement = (progressInterval / stepDuration) * 100;
        let currentProgress = 0;

        const timer = setInterval(() => {
          currentProgress += progressIncrement;
          setSlotProgressMap((prev) => ({
            ...prev,
            [slot.id]: {
              stepIndex,
              stepProgress: Math.min(currentProgress, 100),
              done: false,
            },
          }));

          if (currentProgress >= 100) {
            clearInterval(timer);
            stepIndex++;
            setTimeout(runSlotStep, 120);
          }
        }, progressInterval);
      };

      runSlotStep();
    });
  };

  const overallProgress =
    variantSlots.length === 1
      ? ((currentProcessingStep + stepProgress / 100) / processingSteps.length) * 100
      : (() => {
          const sum = variantSlots.reduce((acc, slot) => {
            const st = slotProgressMap[slot.id];
            if (!st) return acc;
            if (st.done) return acc + 100;
            return acc + ((st.stepIndex + st.stepProgress / 100) / processingSteps.length) * 100;
          }, 0);
          const lanesAvg = sum / variantSlots.length;
          return isConsolidating ? 85 + (consolidationProgress / 100) * 15 : lanesAvg * 0.85;
        })();

  if (flowStep === "select") {
    return (
      <div key="flow-select" className="max-w-4xl mx-auto py-12 px-4 animate-fade-in">
        <button
          onClick={() => window.history.back()}
          className="text-sm text-muted-foreground hover:text-foreground mb-6 flex items-center gap-2 transition-colors"
        >
          ← {pt ? "Voltar para Lista de Processos" : "Back to Process List"}
        </button>
        <div className="text-center mb-12">
          <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-6">
            <Sparkles className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-2xl font-semibold text-foreground mb-3">
            {pt ? "Criar Documentação do Processo" : "Create Process Documentation"}
          </h1>
          <p className="text-muted-foreground max-w-lg mx-auto">
            {pt
              ? "Envie um único arquivo ou múltiplos vídeos/documentos em paralelo para gerar POPs comparativos entre Unidades de Negócio, países ou executores."
              : "Upload a single file or multiple videos/documents in parallel to generate comparative SOPs across Business Units, countries, or executors."}
          </p>
        </div>

        <div
          className={cn(
            "grid grid-cols-1 gap-6",
            mode === "all"
              ? "md:grid-cols-3"
              : mode === "docs-only"
                ? "md:grid-cols-2 max-w-2xl mx-auto"
                : "max-w-md mx-auto"
          )}
        >
          {mode !== "premapping-only" && (
            <button
              onClick={() => handleTypeSelect("video")}
              className="group bg-card rounded-2xl border border-border/60 p-6 text-left hover:border-primary/40 hover:shadow-lg transition-all relative"
            >
              <span className="absolute top-3 right-3 text-[9px] font-bold text-emerald-700 bg-emerald-500/10 px-2 py-0.5 rounded-full uppercase tracking-wide">
                {pt ? "Suporta Multi-POP" : "Multi-SOP Ready"}
              </span>
              <div className="w-12 h-12 rounded-xl bg-muted/80 flex items-center justify-center mb-5 group-hover:bg-primary/10 transition-colors">
                <FileVideo className="h-6 w-6 text-muted-foreground group-hover:text-primary transition-colors" />
              </div>
              <h3 className="font-semibold text-base text-foreground mb-2">
                {pt ? "Vídeo + Transcrição" : "Video + Transcription"}
              </h3>
              <p className="text-[13px] text-muted-foreground leading-relaxed">
                {pt
                  ? "Envie uma ou mais gravações do processo para gerar POPs AS-IS e comparar como diferentes unidades ou pessoas executam."
                  : "Upload one or more recordings to generate AS-IS SOPs and compare how different units or people execute."}
              </p>
            </button>
          )}

          {mode !== "premapping-only" && (
            <button
              onClick={() => handleTypeSelect("document")}
              className="group bg-card rounded-2xl border border-border/60 p-6 text-left hover:border-primary/40 hover:shadow-lg transition-all relative"
            >
              <span className="absolute top-3 right-3 text-[9px] font-bold text-emerald-700 bg-emerald-500/10 px-2 py-0.5 rounded-full uppercase tracking-wide">
                {pt ? "Suporta Multi-POP" : "Multi-SOP Ready"}
              </span>
              <div className="w-12 h-12 rounded-xl bg-muted/80 flex items-center justify-center mb-5 group-hover:bg-primary/10 transition-colors">
                <FileText className="h-6 w-6 text-muted-foreground group-hover:text-primary transition-colors" />
              </div>
              <h3 className="font-semibold text-base text-foreground mb-2">
                {pt ? "Documento POP/Word" : "SOP/Word Document"}
              </h3>
              <p className="text-[13px] text-muted-foreground leading-relaxed">
                {pt
                  ? "Envie um ou mais documentos existentes (Word, PDF) para estruturar e comparar procedimentos."
                  : "Upload one or more existing documents to structure and compare procedures."}
              </p>
            </button>
          )}

          {mode !== "docs-only" && onPreMappingComplete && (
            <button
              onClick={() => handleTypeSelect("premapping")}
              className="group bg-card rounded-2xl border border-primary/30 p-6 text-left hover:border-primary hover:shadow-lg transition-all relative"
            >
              <span className="absolute top-3 right-3 text-[9px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full uppercase tracking-wide">
                Benchmark
              </span>
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-5 group-hover:bg-primary/20 transition-colors">
                <Wand2 className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold text-base text-foreground mb-2">
                {pt ? "Gerar Pré-Mapeamento" : "Generate Pre-Mapping"}
              </h3>
              <p className="text-[13px] text-muted-foreground leading-relaxed">
                {pt
                  ? "Sem arquivos: informe contexto e sistemas e a IA gera um diagrama de escopo preliminar."
                  : "No files: provide context and systems and AI generates a preliminary scope diagram."}
              </p>
            </button>
          )}
        </div>
      </div>
    );
  }

  if (flowStep === "premapping-form") {
    const canGenerate = pmName.trim() && pmSystems.length > 0;
    return (
      <div key="flow-premapping-form" className="max-w-2xl mx-auto py-12 px-4 animate-fade-in">
        <button
          onClick={() => setFlowStep("select")}
          className="text-sm text-muted-foreground hover:text-foreground mb-6 flex items-center gap-2"
        >
          ← {pt ? "Voltar" : "Back"}
        </button>

        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
            <Wand2 className="h-7 w-7 text-primary" />
          </div>
          <h2 className="text-xl font-semibold text-foreground mb-2">
            {pt ? "Gerar Pré-Mapeamento" : "Generate Pre-Mapping"}
          </h2>
          <p className="text-sm text-muted-foreground max-w-md mx-auto">
            {pt
              ? "Confirme os dados do processo e adicione os sistemas envolvidos. A IA gerará um diagrama de escopo preliminar."
              : "Confirm process data and add involved systems. AI will generate a preliminary scope diagram."}
          </p>
        </div>

        <div className="space-y-4 bg-card border border-border/60 rounded-2xl p-6">
          <div>
            <label className="text-[12px] font-medium text-foreground mb-1.5 block">
              {pt ? "Nome do processo" : "Process name"}
            </label>
            <input
              value={pmName}
              onChange={(e) => setPmName(e.target.value)}
              className="w-full text-sm border border-border rounded-lg px-3 py-2 bg-background focus:outline-none focus:border-primary"
            />
          </div>
          <div>
            <label className="text-[12px] font-medium text-foreground mb-1.5 block">
              {pt ? "Descrição" : "Description"}
            </label>
            <textarea
              value={pmDescription}
              onChange={(e) => setPmDescription(e.target.value)}
              rows={3}
              className="w-full text-sm border border-border rounded-lg px-3 py-2 bg-background focus:outline-none focus:border-primary resize-none"
            />
          </div>
          <div>
            <label className="text-[12px] font-medium text-foreground mb-1.5 block">
              {pt ? "Área" : "Area"}
            </label>
            <input
              value={pmArea}
              onChange={(e) => setPmArea(e.target.value)}
              className="w-full text-sm border border-border rounded-lg px-3 py-2 bg-background focus:outline-none focus:border-primary"
            />
          </div>
          <div>
            <label className="text-[12px] font-medium text-foreground mb-1.5 block">
              {pt ? "Sistemas utilizados" : "Systems used"}{" "}
              <span className="text-muted-foreground font-normal">({pmSystems.length})</span>
            </label>
            <div className="flex flex-wrap gap-2 mb-2">
              {pmSystems.map((s, i) => (
                <span
                  key={i}
                  className="inline-flex items-center gap-1.5 bg-primary/10 text-primary text-[12px] font-medium px-2.5 py-1 rounded-md"
                >
                  {s}
                  <button
                    onClick={() => setPmSystems(pmSystems.filter((_, j) => j !== i))}
                    className="hover:text-destructive"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}
            </div>
            <input
              value={pmSystemDraft}
              onChange={(e) => setPmSystemDraft(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && pmSystemDraft.trim()) {
                  e.preventDefault();
                  setPmSystems([...pmSystems, pmSystemDraft.trim()]);
                  setPmSystemDraft("");
                }
              }}
              placeholder={
                pt
                  ? "Digite e pressione Enter (ex: SAP, Excel)"
                  : "Type and press Enter (e.g. SAP, Excel)"
              }
              className="w-full text-sm border border-dashed border-border rounded-lg px-3 py-2 bg-background focus:outline-none focus:border-primary"
            />
          </div>
        </div>

        <Button
          onClick={handleGeneratePreMapping}
          variant="corporate"
          disabled={!canGenerate}
          className="w-full mt-6 h-12"
        >
          <Sparkles className="h-4 w-4 mr-2" />
          {pt ? "Gerar Pré-Mapeamento" : "Generate Pre-Mapping"}
        </Button>
      </div>
    );
  }

  if (flowStep === "premapping-processing") {
    return (
      <div key="flow-premapping-processing" className="max-w-md mx-auto py-24 px-4 animate-fade-in text-center">
        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center mx-auto mb-6 relative">
          <Wand2 className="h-10 w-10 text-primary animate-pulse" />
          <div
            className="absolute inset-0 rounded-full border-2 border-primary/30 animate-ping"
            style={{ animationDuration: "2s" }}
          />
        </div>
        <h2 className="text-lg font-semibold text-foreground mb-2">
          {pt ? "Gerando pré-mapeamento..." : "Generating pre-mapping..."}
        </h2>
        <p className="text-sm text-muted-foreground mb-6">
          {pt
            ? "Estruturando objetivos, atividades, entradas e saídas com base no contexto."
            : "Structuring objectives, activities, inputs and outputs from context."}
        </p>
        <Progress value={pmProgress} className="h-2" />
        <p className="text-xs text-muted-foreground mt-2">{Math.round(pmProgress)}%</p>
      </div>
    );
  }

  if (flowStep === "upload") {
    const acceptedFormats = uploadType === "video" ? videoExtensions : documentExtensions;
    const isVideoUpload = uploadType === "video";
    const isMulti = variantSlots.length > 1 || mode === "add-variant";

    // Validate all slots have required file and name
    const canProcess = variantSlots.every((slot) => {
      return Boolean(slot.selectedFile) && Boolean(slot.name.trim() || slot.businessUnit);
    });

    const someFilesMissing = variantSlots.some((slot) => !slot.selectedFile);

    return (
      <div key="flow-upload" className="max-w-4xl mx-auto py-10 px-4 animate-fade-in">
        {mode !== "add-variant" && (
          <button
            onClick={() => {
              setFlowStep("select");
            }}
            className="text-sm text-muted-foreground hover:text-foreground mb-6 flex items-center gap-2"
          >
            ← {pt ? "Voltar" : "Back"}
          </button>
        )}

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h2 className="text-xl font-semibold text-foreground">
                {mode === "add-variant"
                  ? pt
                    ? "Adicionar Nova Variante de POP para Comparação"
                    : "Add New SOP Variant for Comparison"
                  : isVideoUpload
                    ? pt
                      ? "Envie seu Vídeo e Transcrição"
                      : "Upload your Video and Transcription"
                    : pt
                      ? "Envie seu Documento"
                      : "Upload your Document"}
              </h2>
              {variantSlots.length > 1 && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-primary/10 text-primary">
                  <GitCompare className="h-3.5 w-3.5" />
                  {variantSlots.length} {pt ? "procedimentos em paralelo" : "parallel procedures"}
                </span>
              )}
            </div>
            <p className="text-sm text-muted-foreground">
              {pt
                ? "Por padrão você pode enviar 1 procedimento, ou adicionar mais gravações/documentos para comparar Unidades de Negócio, países ou executores."
                : "By default you can upload 1 procedure, or add more recordings/documents to compare Business Units, countries, or executors."}
            </p>
          </div>

          {/* Language & Demo Helper */}
          <div className="flex items-center gap-2.5 shrink-0">
            <Select
              value={contentLanguage}
              onValueChange={(value: "PT" | "EN") => setContentLanguage(value)}
            >
              <SelectTrigger className="w-[150px] h-9 bg-card text-xs">
                <Globe className="h-3.5 w-3.5 text-muted-foreground mr-1.5" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="PT">🇧🇷 {pt ? "Português" : "Portuguese"}</SelectItem>
                <SelectItem value="EN">🇺🇸 {pt ? "Inglês" : "English"}</SelectItem>
              </SelectContent>
            </Select>

            {someFilesMissing && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleFillDemoFiles}
                className="h-9 text-xs gap-1.5 border-primary/30 text-primary hover:bg-primary/5"
              >
                <Sparkles className="h-3.5 w-3.5" />
                {pt ? "Preencher arquivos demo" : "Fill demo files"}
              </Button>
            )}
          </div>
        </div>

        {/* Variant Upload Cards */}
        <div className="space-y-5">
          {variantSlots.map((slot, index) => {
            const isPrimary = index === 0 && mode !== "add-variant";
            return (
              <div
                key={slot.id}
                className={cn(
                  "bg-card rounded-2xl border p-6 transition-all",
                  isMulti ? "border-border shadow-sm" : "border-border/60"
                )}
              >
                {/* Card Top Header: Slot badge + Metadata fields (Unidade de Negócio & Nome Identificador) */}
                <div className="flex items-center justify-between gap-3 mb-4 pb-3 border-b border-border/60">
                  <div className="flex items-center gap-2.5">
                    <span className="w-7 h-7 rounded-lg bg-primary/10 text-primary font-bold text-xs flex items-center justify-center">
                      #{index + 1}
                    </span>
                    <div>
                      <h3 className="text-sm font-semibold text-foreground">
                        {isPrimary
                          ? pt
                            ? "Procedimento Base / Referência"
                            : "Base / Reference Procedure"
                          : pt
                            ? `Procedimento Comparativo #${index + 1}`
                            : `Comparative Procedure #${index + 1}`}
                      </h3>
                      <p className="text-[11px] text-muted-foreground">
                        {isPrimary
                          ? pt
                            ? "Identifique a unidade de negócio e envie os arquivos deste procedimento"
                            : "Identify the business unit and upload files for this procedure"
                          : pt
                            ? "Informe se pertence a outra unidade de negócio ou outra forma de execução"
                            : "Specify if it belongs to another business unit or execution variant"}
                      </p>
                    </div>
                  </div>

                  {variantSlots.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveVariantSlot(slot.id)}
                      className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-destructive px-2 py-1 rounded-md hover:bg-destructive/10 transition-colors"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      {pt ? "Remover" : "Remove"}
                    </button>
                  )}
                </div>

                {/* Divergence Context, Business Unit & Variant Name Row */}
                <div className="space-y-4 mb-5 bg-muted/25 p-4 rounded-xl border border-border/50">
                  {/* Two clickable options: Unidade de Negócio vs Pessoa Executora Diferente */}
                  <div className="grid grid-cols-2 gap-2.5">
                    <button
                      type="button"
                      onClick={() =>
                        updateSlot(slot.id, {
                          divergenceReason: "business_unit",
                          isDifferentBU: true,
                        })
                      }
                      className={cn(
                        "flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg border text-xs font-medium transition-all",
                        slot.divergenceReason === "business_unit"
                          ? "border-primary bg-primary/10 text-primary font-semibold shadow-sm"
                          : "border-border bg-background text-muted-foreground hover:text-foreground hover:bg-muted/50"
                      )}
                    >
                      <Building2 className="h-3.5 w-3.5 shrink-0" />
                      {pt ? "Unidade de Negócio" : "Business Unit"}
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        updateSlot(slot.id, {
                          divergenceReason: "executor",
                          isDifferentBU: false,
                        })
                      }
                      className={cn(
                        "flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg border text-xs font-medium transition-all",
                        slot.divergenceReason === "executor"
                          ? "border-primary bg-primary/10 text-primary font-semibold shadow-sm"
                          : "border-border bg-background text-muted-foreground hover:text-foreground hover:bg-muted/50"
                      )}
                    >
                      <Users className="h-3.5 w-3.5 shrink-0" />
                      {pt ? "Pessoa Executora Diferente" : "Different Executor"}
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                  {/* 2. Unidade de Negócio */}
                  <div>
                    <label className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground mb-1.5 flex items-center gap-1.5">
                      <Building2 className="h-3.5 w-3.5 text-primary" />
                      {pt ? "Unidade de Negócio" : "Business Unit"}
                    </label>
                    {addingBUForSlotId === slot.id ? (
                      <div className="flex items-center gap-1.5">
                        <Input
                          value={newBUName}
                          onChange={(e) => setNewBUName(e.target.value)}
                          placeholder={pt ? "Nome da unidade..." : "Unit name..."}
                          className="h-9 text-xs bg-background"
                          autoFocus
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault();
                              handleCreateNewBUForSlot(slot.id);
                            }
                          }}
                        />
                        <Button
                          type="button"
                          size="sm"
                          className="h-9 px-2.5 text-xs"
                          onClick={() => handleCreateNewBUForSlot(slot.id)}
                        >
                          OK
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="h-9 px-2 text-xs"
                          onClick={() => setAddingBUForSlotId(null)}
                        >
                          <X className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    ) : (
                      <Select
                        value={slot.businessUnit}
                        onValueChange={(val) => {
                          if (val === "__new__") {
                            setAddingBUForSlotId(slot.id);
                            setNewBUName("");
                            return;
                          }
                          updateSlot(slot.id, { businessUnit: val });
                        }}
                      >
                        <SelectTrigger className="h-9 bg-background text-xs">
                          <SelectValue placeholder={pt ? "Selecione a BU" : "Select BU"} />
                        </SelectTrigger>
                        <SelectContent>
                          {units.map((u) => (
                            <SelectItem key={u} value={u}>
                              {u}
                            </SelectItem>
                          ))}
                          <SelectItem value="__new__" className="text-primary font-medium">
                            + {pt ? "Nova unidade de negócio..." : "New business unit..."}
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  </div>

                  {/* 3. Nome Identificador do POP (auto-sugerido pela BU ou customizável) */}
                  <div>
                    <label className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground mb-1.5 flex items-center gap-1.5">
                      <Users className="h-3.5 w-3.5 text-primary" />
                      {pt ? "Nome Identificador do POP *" : "SOP Variant Name *"}
                    </label>
                    <Input
                      value={slot.name}
                      onChange={(e) =>
                        updateSlot(slot.id, {
                          name: e.target.value,
                          nameManuallyEdited: true,
                        })
                      }
                      placeholder={
                        slot.divergenceReason === "business_unit"
                          ? slot.businessUnit || (pt ? "Ex: Red Ballon" : "E.g., Red Ballon")
                          : pt
                            ? "Ex: Execução - Analista Sênior"
                            : "E.g., Senior Analyst Execution"
                      }
                      className="h-9 text-xs bg-background"
                    />
                  </div>
                  </div>
                </div>

                {/* Hidden File Inputs for this Slot */}
                <input
                  ref={(el) => {
                    fileInputRefs.current[slot.id] = el;
                  }}
                  type="file"
                  accept={acceptedFormats}
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) updateSlot(slot.id, { selectedFile: file });
                  }}
                  className="hidden"
                />
                {isVideoUpload && (
                  <input
                    ref={(el) => {
                      transcriptionInputRefs.current[slot.id] = el;
                    }}
                    type="file"
                    accept={transcriptionFormats}
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) updateSlot(slot.id, { transcriptionFile: file });
                    }}
                    className="hidden"
                  />
                )}

                {/* Upload Dropzone (Campo Único) */}
                <div>
                  <label className="text-xs font-semibold text-foreground mb-2 block">
                    {isVideoUpload
                      ? (pt ? "Vídeo do Processo" : "Process Video")
                      : (pt ? "Documento do Processo" : "Process Document")}
                    <span className="text-[11px] font-normal text-muted-foreground ml-1.5">
                      {isVideoUpload ? "(MP4, MOV, WebM, MKV)" : "(Word, PDF, TXT)"}
                    </span>
                  </label>
                  <div
                    onClick={() => fileInputRefs.current[slot.id]?.click()}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) => {
                      e.preventDefault();
                      const file = e.dataTransfer.files?.[0];
                      if (file) updateSlot(slot.id, { selectedFile: file });
                    }}
                    className={cn(
                      "border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all",
                      slot.selectedFile
                        ? "border-primary bg-primary/5 shadow-sm"
                        : "border-border/60 hover:border-primary/40 hover:bg-muted/30"
                    )}
                  >
                    {slot.selectedFile ? (
                      <div className="flex items-center justify-between gap-3 text-left">
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-11 h-11 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                            {isVideoUpload ? (
                              <FileVideo className="h-6 w-6 text-primary" />
                            ) : (
                              <FileText className="h-6 w-6 text-primary" />
                            )}
                          </div>
                          <div className="min-w-0">
                            <p className="font-semibold text-foreground text-sm truncate">
                              {slot.selectedFile.name}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {formatFileSize(slot.selectedFile.size)}
                            </p>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            updateSlot(slot.id, { selectedFile: null });
                          }}
                          className="p-1.5 text-muted-foreground hover:text-destructive rounded-md transition-colors"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ) : (
                      <div className="py-4 space-y-2">
                        <div className="w-12 h-12 rounded-xl bg-muted/80 flex items-center justify-center mx-auto">
                          {isVideoUpload ? (
                            <FileVideo className="h-6 w-6 text-muted-foreground" />
                          ) : (
                            <Upload className="h-6 w-6 text-muted-foreground" />
                          )}
                        </div>
                        <p className="text-sm font-semibold text-foreground">
                          {isVideoUpload
                            ? (pt ? "Clique para selecionar o vídeo ou arraste aqui" : "Click to select video or drag here")
                            : (pt ? "Clique para selecionar o documento ou arraste aqui" : "Click to select document or drag here")}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {isVideoUpload
                            ? (pt ? "A IA processa e transcreve o áudio do vídeo automaticamente" : "AI automatically processes and transcribes video audio")
                            : (pt ? "Formatos aceitos: Word (.docx, .doc) ou PDF" : "Accepted formats: Word (.docx, .doc) or PDF")}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Add Another Procedure Variant Button */}
        <button
          type="button"
          onClick={handleAddVariantSlot}
          className="w-full mt-4 py-3.5 px-4 rounded-xl border-2 border-dashed border-primary/30 bg-primary/5 hover:bg-primary/10 hover:border-primary/50 text-primary transition-all flex items-center justify-center gap-2 text-sm font-medium"
        >
          <Plus className="h-4 w-4" />
          {pt
            ? "Adicionar outro procedimento para comparação (Unidade de Negócio, País ou Executor)"
            : "Add another procedure for comparison (Business Unit, Country or Executor)"}
        </button>

        {/* Submit Action */}
        <Button
          onClick={handleUpload}
          variant="corporate"
          disabled={!canProcess}
          className="w-full mt-6 h-12 text-sm font-semibold"
        >
          <Sparkles className="h-4 w-4 mr-2" />
          {variantSlots.length > 1
            ? pt
              ? `Processar ${variantSlots.length} Procedimentos em Paralelo com IA`
              : `Process ${variantSlots.length} Procedures in Parallel with AI`
            : pt
              ? "Processar com IA"
              : "Process with AI"}
        </Button>
      </div>
    );
  }

  if (flowStep === "processing") {
    // Parallel Processing View when 2+ variants are uploaded
    if (variantSlots.length > 1) {
      return (
        <div key="flow-processing-multi" className="max-w-5xl mx-auto py-12 px-4 animate-fade-in">
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center mx-auto mb-4 relative">
              <Brain className="h-8 w-8 text-primary animate-pulse" />
              <div
                className="absolute inset-0 rounded-full border-2 border-primary/30 animate-ping"
                style={{ animationDuration: "2s" }}
              />
            </div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold mb-2">
              <Zap className="h-3.5 w-3.5" />
              {pt
                ? `Execução Paralela • ${variantSlots.length} Pipelines Ativos`
                : `Parallel Execution • ${variantSlots.length} Active Pipelines`}
            </div>
            <h2 className="text-xl font-semibold text-foreground mb-1">
              {pt
                ? "Agentes de IA Processando Procedimentos Simultaneamente"
                : "AI Agents Processing Procedures Simultaneously"}
            </h2>
            <p className="text-sm text-muted-foreground max-w-xl mx-auto">
              {pt
                ? "Extraindo POPs AS-IS de cada vídeo/documento em paralelo e mapeando divergências operacionais entre as variantes..."
                : "Extracting AS-IS SOPs from each file in parallel and mapping operational divergences across variants..."}
            </p>
          </div>

          {/* Overall Progress */}
          <div className="max-w-xl mx-auto mb-8 bg-card border border-border rounded-xl p-4">
            <div className="flex items-center justify-between text-xs font-medium mb-2">
              <span className="text-muted-foreground">
                {pt ? "Progresso Consolidado Multi-POP" : "Consolidated Multi-SOP Progress"}
              </span>
              <span className="text-primary font-semibold">{Math.round(overallProgress)}%</span>
            </div>
            <Progress value={overallProgress} className="h-2" />
          </div>

          {/* Parallel Lanes Grid */}
          <div
            className={cn(
              "grid grid-cols-1 gap-4 mb-6",
              variantSlots.length === 2 ? "md:grid-cols-2" : "md:grid-cols-3"
            )}
          >
            {variantSlots.map((slot, idx) => {
              const st = slotProgressMap[slot.id] || { stepIndex: 0, stepProgress: 0, done: false };
              const lanePct = st.done
                ? 100
                : Math.round(((st.stepIndex + st.stepProgress / 100) / processingSteps.length) * 100);
              const activeStepObj = processingSteps[Math.min(st.stepIndex, processingSteps.length - 1)];
              const ActiveIcon = activeStepObj.icon;

              return (
                <div
                  key={slot.id}
                  className={cn(
                    "bg-card rounded-2xl border p-5 transition-all",
                    st.done ? "border-emerald-500/40 bg-emerald-500/[0.02]" : "border-primary/30 shadow-sm"
                  )}
                >
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div>
                      <div className="flex items-center gap-1.5 mb-1">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-primary/10 text-primary">
                          POP #{idx + 1}
                        </span>
                        {slot.businessUnit && (
                          <span className="text-[10px] font-medium px-2 py-0.5 rounded bg-muted text-muted-foreground flex items-center gap-1">
                            <Building2 className="h-2.5 w-2.5" />
                            {slot.businessUnit}
                          </span>
                        )}
                      </div>
                      <h4 className="font-semibold text-sm text-foreground">{slot.name}</h4>
                    </div>
                    <span
                      className={cn(
                        "text-xs font-bold",
                        st.done ? "text-emerald-600" : "text-primary"
                      )}
                    >
                      {lanePct}%
                    </span>
                  </div>

                  <Progress value={lanePct} className="h-1.5 mb-4" />

                  {/* Current Step in this Lane */}
                  <div className="space-y-2">
                    {processingSteps.map((step, sIdx) => {
                      const isDone = st.done || sIdx < st.stepIndex;
                      const isCurr = !st.done && sIdx === st.stepIndex;
                      const IconComp = step.icon;
                      return (
                        <div
                          key={step.id}
                          className={cn(
                            "flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg text-xs transition-all",
                            isDone && "text-emerald-700 bg-emerald-500/5",
                            isCurr && "bg-primary/10 text-primary font-medium",
                            !isDone && !isCurr && "opacity-35 text-muted-foreground"
                          )}
                        >
                          {isDone ? (
                            <Check className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                          ) : (
                            <IconComp className={cn("h-3.5 w-3.5 shrink-0", isCurr && "animate-pulse")} />
                          )}
                          <span className="truncate">{pt ? step.labelPT : step.labelEN}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Final Cross-Comparison & Benchmark Step */}
          <div
            className={cn(
              "rounded-2xl border p-4 flex items-center gap-4 transition-all",
              isConsolidating
                ? "bg-primary/5 border-primary/40 shadow-sm"
                : "bg-card border-border/60 opacity-50"
            )}
          >
            <div className="w-10 h-10 rounded-xl bg-primary/15 text-primary flex items-center justify-center shrink-0">
              <Scale className={cn("h-5 w-5", isConsolidating && "animate-pulse")} />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-semibold text-foreground">
                  {pt
                    ? "Agente Analítico IA: Cruzando procedimentos, identificando divergências e gerando Benchmark de Mercado..."
                    : "AI Analytical Agent: Cross-comparing procedures, identifying divergences and generating Market Benchmark..."}
                </span>
                <span className="text-xs font-bold text-primary">{consolidationProgress}%</span>
              </div>
              <Progress value={consolidationProgress} className="h-1.5" />
            </div>
          </div>
        </div>
      );
    }

    // Single variant processing view
    return (
      <div key="flow-processing-single" className="max-w-lg mx-auto py-12 px-4 animate-fade-in">
        <div className="text-center mb-10">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center mx-auto mb-6 relative">
            <Brain className="h-10 w-10 text-primary animate-pulse" />
            <div
              className="absolute inset-0 rounded-full border-2 border-primary/30 animate-ping"
              style={{ animationDuration: "2s" }}
            />
          </div>
          <h2 className="text-xl font-semibold text-foreground mb-2">
            {pt ? "Agentes de IA Trabalhando" : "AI Agents Working"}
          </h2>
          <p className="text-sm text-muted-foreground max-w-sm mx-auto">
            {pt
              ? "Nossos agentes estão analisando e criando sua documentação completa..."
              : "Our agents are analyzing and creating your complete documentation..."}
          </p>
        </div>

        <div className="mb-8">
          <div className="flex items-center justify-between text-sm mb-2">
            <span className="text-muted-foreground">
              {pt ? "Progresso geral" : "Overall progress"}
            </span>
            <span className="text-primary font-medium">{Math.round(overallProgress)}%</span>
          </div>
          <Progress value={overallProgress} className="h-2" />
        </div>

        <div className="space-y-2">
          {processingSteps.map((step, index) => {
            const StepIcon = step.icon;
            const isCompleted = index < currentProcessingStep;
            const isCurrent = index === currentProcessingStep;
            const isPending = index > currentProcessingStep;

            return (
              <div
                key={step.id}
                className={cn(
                  "flex items-center gap-4 p-4 rounded-xl transition-all duration-300",
                  isCompleted && "bg-primary/5",
                  isCurrent && "bg-card border border-primary/30 shadow-sm",
                  isPending && "opacity-40"
                )}
              >
                <div
                  className={cn(
                    "w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-all",
                    isCompleted && "bg-primary text-primary-foreground",
                    isCurrent && "bg-primary/10 text-primary",
                    isPending && "bg-muted text-muted-foreground"
                  )}
                >
                  {isCompleted ? (
                    <Check className="h-5 w-5" />
                  ) : isCurrent ? (
                    <StepIcon className="h-5 w-5 animate-pulse" />
                  ) : (
                    <StepIcon className="h-5 w-5" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <span
                    className={cn(
                      "text-sm font-medium block",
                      isCompleted || isCurrent ? "text-foreground" : "text-muted-foreground"
                    )}
                  >
                    {pt ? step.labelPT : step.labelEN}
                  </span>

                  {isCurrent && (
                    <div className="mt-2">
                      <Progress value={stepProgress} className="h-1" />
                    </div>
                  )}
                </div>

                {isCompleted && (
                  <span className="text-xs text-primary font-medium">
                    {pt ? "Concluído" : "Done"}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  if (flowStep === "complete") {
    return (
      <div key="flow-complete" className="max-w-xl mx-auto py-14 px-4 animate-fade-in text-center">
        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center mx-auto mb-6">
          <Check className="h-10 w-10 text-primary" />
        </div>
        <h2 className="text-2xl font-semibold text-foreground mb-2">
          {variantSlots.length > 1
            ? pt
              ? `${variantSlots.length} POPs e Análise Comparativa Gerados!`
              : `${variantSlots.length} SOPs & Comparative Analysis Generated!`
            : pt
              ? "Documentação Gerada!"
              : "Documentation Generated!"}
        </h2>
        <p className="text-muted-foreground mb-6 max-w-md mx-auto text-sm">
          {variantSlots.length > 1
            ? pt
              ? "Os procedimentos foram processados em paralelo. Você já pode alternar entre as versões AS-IS ou acessar o Comparativo & Benchmark."
              : "Procedures were processed in parallel. You can now switch between AS-IS versions or open the Comparison & Benchmark view."
            : pt
              ? "Sua POP e diagrama BPMN foram criados com sucesso e estão salvos como rascunho."
              : "Your SOP and BPMN diagram were successfully created and saved as draft."}
        </p>

        {/* Generated Items Summary */}
        <div className="bg-card rounded-2xl border border-border/60 p-6 mb-8 text-left space-y-4">
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
            {pt ? "Procedimentos Mapeados" : "Mapped Procedures"}
          </h3>

          <div className="space-y-2.5">
            {variantSlots.map((slot, idx) => (
              <div
                key={slot.id}
                className="flex items-center justify-between p-3 rounded-xl bg-muted/40 border border-border/50"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-bold text-xs">
                    #{idx + 1}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-foreground">{slot.name}</span>
                      {slot.businessUnit && (
                        <span className="text-[11px] px-2 py-0.5 rounded bg-card border border-border text-muted-foreground">
                          {slot.businessUnit}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {slot.selectedFile?.name || "POP Estruturado (Rascunho v1.0)"}
                    </p>
                  </div>
                </div>
                <span className="text-xs font-medium text-emerald-600 bg-emerald-500/10 px-2.5 py-1 rounded-full">
                  {pt ? "Pronto" : "Ready"}
                </span>
              </div>
            ))}
          </div>

          {variantSlots.length > 1 && (
            <div className="pt-3 border-t border-border flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-violet-500/10 flex items-center justify-center">
                <Scale className="h-4 w-4 text-violet-600" />
              </div>
              <div>
                <span className="text-sm font-medium text-foreground">
                  {pt ? "Comparativo Multi-POP & Benchmark IA" : "Multi-SOP Comparison & AI Benchmark"}
                </span>
                <span className="text-xs text-violet-600 ml-2 px-2 py-0.5 bg-violet-500/10 rounded">
                  {pt ? "6 divergências mapeadas" : "6 divergences mapped"}
                </span>
              </div>
            </div>
          )}
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3">
          <Button
            onClick={() => onComplete({ openComparison: false })}
            variant={variantSlots.length > 1 ? "outline" : "corporate"}
            className="w-full h-12"
          >
            <FileText className="h-4 w-4 mr-2" />
            {pt ? "Visualizar POPs (AS-IS)" : "View SOPs (AS-IS)"}
          </Button>

          {variantSlots.length > 1 && (
            <Button
              onClick={() => onComplete({ openComparison: true })}
              variant="corporate"
              className="w-full h-12"
            >
              <Scale className="h-4 w-4 mr-2" />
              {pt ? "Abrir Comparativo & Benchmark" : "Open Comparison & Benchmark"}
            </Button>
          )}
        </div>
      </div>
    );
  }

  return null;
}
