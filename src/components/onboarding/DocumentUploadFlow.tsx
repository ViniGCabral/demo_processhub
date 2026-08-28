import { useState, useRef } from "react";
import { 
  Upload, FileVideo, FileText, Sparkles, Check, 
  Brain, Database, Shield, Workflow, FileCheck, Cpu, BarChart3, Zap, X, Globe, Wand2
} from "lucide-react";
import { Button } from "@/components/ui/button";
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

interface DocumentUploadFlowProps {
  onComplete: () => void;
  onPreMappingComplete?: (data: { name: string; description: string; area: string; systems: string[] }) => void;
  initialName?: string;
  initialDescription?: string;
  initialArea?: string;
  /** "all" shows the 3 options; "premapping-only" only the pre-mapping card; "docs-only" only video + document. */
  mode?: "all" | "premapping-only" | "docs-only";
}

type UploadType = "video" | "document" | "premapping" | null;
type FlowStep = "select" | "upload" | "premapping-form" | "premapping-processing" | "processing" | "complete";

interface ProcessingStep {
  id: number;
  labelPT: string;
  labelEN: string;
  icon: React.ElementType;
  duration: number; // ms
}

const processingSteps: ProcessingStep[] = [
  { id: 1, labelPT: "Analisando arquivo...", labelEN: "Analyzing file...", icon: FileCheck, duration: 1500 },
  { id: 2, labelPT: "Transcrevendo conteúdo...", labelEN: "Transcribing content...", icon: FileText, duration: 2000 },
  { id: 3, labelPT: "Agente IA: Gerando estrutura da POP...", labelEN: "AI Agent: Generating SOP structure...", icon: Brain, duration: 2500 },
  { id: 4, labelPT: "Agente IA: Criando diagrama BPMN...", labelEN: "AI Agent: Creating BPMN diagram...", icon: Workflow, duration: 2000 },
  { id: 5, labelPT: "Agente IA: Analisando potencial de Automação...", labelEN: "AI Agent: Analyzing Automation potential...", icon: Cpu, duration: 1800 },
  { id: 6, labelPT: "Agente IA: Verificando Data Integrity...", labelEN: "AI Agent: Verifying Data Integrity...", icon: Database, duration: 1500 },
  { id: 7, labelPT: "Agente IA: Avaliando Governança e Compliance...", labelEN: "AI Agent: Evaluating Governance & Compliance...", icon: Shield, duration: 1800 },
  { id: 8, labelPT: "Finalizando documentação...", labelEN: "Finalizing documentation...", icon: Zap, duration: 1200 },
];

// Accepted file types
const videoExtensions = ".mp4,.mov,.webm,.avi,.mkv";
const documentExtensions = ".doc,.docx,.pdf,.txt,.rtf";

export function DocumentUploadFlow({ onComplete, onPreMappingComplete, initialName = "", initialDescription = "", initialArea = "", mode = "all" }: DocumentUploadFlowProps) {
  const { language } = useLanguage();
  const [uploadType, setUploadType] = useState<UploadType>(null);
  const [flowStep, setFlowStep] = useState<FlowStep>("select");
  const [currentProcessingStep, setCurrentProcessingStep] = useState(0);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [transcriptionFile, setTranscriptionFile] = useState<File | null>(null);
  const [stepProgress, setStepProgress] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [isDraggingTranscription, setIsDraggingTranscription] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const transcriptionInputRef = useRef<HTMLInputElement>(null);
  const [contentLanguage, setContentLanguage] = useState<"PT" | "EN">("PT");

  // Pre-mapping form state
  const [pmName, setPmName] = useState(initialName);
  const [pmDescription, setPmDescription] = useState(initialDescription);
  const [pmArea, setPmArea] = useState(initialArea);
  const [pmSystems, setPmSystems] = useState<string[]>([]);
  const [pmSystemDraft, setPmSystemDraft] = useState("");
  const [pmProgress, setPmProgress] = useState(0);

  const handleTypeSelect = (type: UploadType) => {
    setUploadType(type);
    if (type === "premapping") {
      setFlowStep("premapping-form");
    } else {
      setFlowStep("upload");
    }
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

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleClearFile = () => {
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleTranscriptionInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setTranscriptionFile(file);
    }
  };

  const handleTranscriptionDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingTranscription(true);
  };

  const handleTranscriptionDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingTranscription(false);
  };

  const handleTranscriptionDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingTranscription(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      setTranscriptionFile(file);
    }
  };

  const handleClearTranscription = () => {
    setTranscriptionFile(null);
    if (transcriptionInputRef.current) {
      transcriptionInputRef.current.value = "";
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const handleUpload = () => {
    setFlowStep("processing");
    setCurrentProcessingStep(0);
    setStepProgress(0);
    
    // Simulate AI processing with varying delays
    let stepIndex = 0;
    
    const processStep = () => {
      if (stepIndex >= processingSteps.length) {
        setTimeout(() => {
          setFlowStep("complete");
        }, 600);
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
          setTimeout(processStep, 300);
        }
      }, progressInterval);
    };
    
    processStep();
  };

  const handleComplete = () => {
    onComplete();
  };

  const overallProgress = ((currentProcessingStep + (stepProgress / 100)) / processingSteps.length) * 100;

  if (flowStep === "select") {
    return (
      <div className="max-w-4xl mx-auto py-16 px-4 animate-fade-in">
        <div className="text-center mb-12">
          <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-6">
            <Sparkles className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-2xl font-semibold text-foreground mb-3">
            {language === "PT" ? "Criar Documentação do Processo" : "Create Process Documentation"}
          </h1>
          <p className="text-muted-foreground max-w-md mx-auto">
            {language === "PT" 
              ? "Nossa IA irá analisar seu arquivo e gerar automaticamente a POP, diagrama BPMN e análises de maturidade."
              : "Our AI will analyze your file and automatically generate SOP, BPMN diagram and maturity analysis."
            }
          </p>
        </div>

        <div className={cn(
          "grid grid-cols-1 gap-6",
          mode === "all" ? "md:grid-cols-3" : mode === "docs-only" ? "md:grid-cols-2 max-w-2xl mx-auto" : "max-w-md mx-auto"
        )}>
          {mode !== "premapping-only" && (
            <button
              onClick={() => handleTypeSelect("video")}
              className="group bg-card rounded-2xl border border-border/60 p-6 text-left hover:border-primary/40 hover:shadow-lg transition-all"
            >
              <div className="w-12 h-12 rounded-xl bg-muted/80 flex items-center justify-center mb-5 group-hover:bg-primary/10 transition-colors">
                <FileVideo className="h-6 w-6 text-muted-foreground group-hover:text-primary transition-colors" />
              </div>
              <h3 className="font-semibold text-base text-foreground mb-2">
                {language === "PT" ? "Vídeo + Transcrição" : "Video + Transcription"}
              </h3>
              <p className="text-[13px] text-muted-foreground leading-relaxed">
                {language === "PT" 
                  ? "Envie uma gravação do processo e nossa IA irá transcrever e gerar a documentação automaticamente."
                  : "Upload a recording and our AI will transcribe and generate documentation."}
              </p>
            </button>
          )}

          {mode !== "premapping-only" && (
            <button
              onClick={() => handleTypeSelect("document")}
              className="group bg-card rounded-2xl border border-border/60 p-6 text-left hover:border-primary/40 hover:shadow-lg transition-all"
            >
              <div className="w-12 h-12 rounded-xl bg-muted/80 flex items-center justify-center mb-5 group-hover:bg-primary/10 transition-colors">
                <FileText className="h-6 w-6 text-muted-foreground group-hover:text-primary transition-colors" />
              </div>
              <h3 className="font-semibold text-base text-foreground mb-2">
                {language === "PT" ? "Documento POP/Word" : "SOP/Word Document"}
              </h3>
              <p className="text-[13px] text-muted-foreground leading-relaxed">
                {language === "PT"
                  ? "Envie um documento existente (Word, PDF) e nossa IA irá estruturar e criar a documentação."
                  : "Upload an existing document and our AI will structure documentation."}
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
                {language === "PT" ? "Gerar Pré-Mapeamento" : "Generate Pre-Mapping"}
              </h3>
              <p className="text-[13px] text-muted-foreground leading-relaxed">
                {language === "PT"
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
      <div className="max-w-2xl mx-auto py-12 px-4 animate-fade-in">
        <button
          onClick={() => setFlowStep("select")}
          className="text-sm text-muted-foreground hover:text-foreground mb-6 flex items-center gap-2"
        >
          ← {language === "PT" ? "Voltar" : "Back"}
        </button>

        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
            <Wand2 className="h-7 w-7 text-primary" />
          </div>
          <h2 className="text-xl font-semibold text-foreground mb-2">
            {language === "PT" ? "Gerar Pré-Mapeamento" : "Generate Pre-Mapping"}
          </h2>
          <p className="text-sm text-muted-foreground max-w-md mx-auto">
            {language === "PT"
              ? "Confirme os dados do processo e adicione os sistemas envolvidos. A IA gerará um diagrama de escopo preliminar."
              : "Confirm process data and add involved systems. AI will generate a preliminary scope diagram."}
          </p>
        </div>

        <div className="space-y-4 bg-card border border-border/60 rounded-2xl p-6">
          <div>
            <label className="text-[12px] font-medium text-foreground mb-1.5 block">
              {language === "PT" ? "Nome do processo" : "Process name"}
            </label>
            <input
              value={pmName} onChange={(e) => setPmName(e.target.value)}
              className="w-full text-sm border border-border rounded-lg px-3 py-2 bg-background focus:outline-none focus:border-primary"
            />
          </div>
          <div>
            <label className="text-[12px] font-medium text-foreground mb-1.5 block">
              {language === "PT" ? "Descrição" : "Description"}
            </label>
            <textarea
              value={pmDescription} onChange={(e) => setPmDescription(e.target.value)} rows={3}
              className="w-full text-sm border border-border rounded-lg px-3 py-2 bg-background focus:outline-none focus:border-primary resize-none"
            />
          </div>
          <div>
            <label className="text-[12px] font-medium text-foreground mb-1.5 block">
              {language === "PT" ? "Área" : "Area"}
            </label>
            <input
              value={pmArea} onChange={(e) => setPmArea(e.target.value)}
              className="w-full text-sm border border-border rounded-lg px-3 py-2 bg-background focus:outline-none focus:border-primary"
            />
          </div>
          <div>
            <label className="text-[12px] font-medium text-foreground mb-1.5 block">
              {language === "PT" ? "Sistemas utilizados" : "Systems used"} <span className="text-muted-foreground font-normal">({pmSystems.length})</span>
            </label>
            <div className="flex flex-wrap gap-2 mb-2">
              {pmSystems.map((s, i) => (
                <span key={i} className="inline-flex items-center gap-1.5 bg-primary/10 text-primary text-[12px] font-medium px-2.5 py-1 rounded-md">
                  {s}
                  <button onClick={() => setPmSystems(pmSystems.filter((_, j) => j !== i))} className="hover:text-destructive">
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
              placeholder={language === "PT" ? "Digite e pressione Enter (ex: SAP, Excel)" : "Type and press Enter (e.g. SAP, Excel)"}
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
          {language === "PT" ? "Gerar Pré-Mapeamento" : "Generate Pre-Mapping"}
        </Button>
      </div>
    );
  }

  if (flowStep === "premapping-processing") {
    return (
      <div className="max-w-md mx-auto py-24 px-4 animate-fade-in text-center">
        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center mx-auto mb-6 relative">
          <Wand2 className="h-10 w-10 text-primary animate-pulse" />
          <div className="absolute inset-0 rounded-full border-2 border-primary/30 animate-ping" style={{ animationDuration: '2s' }} />
        </div>
        <h2 className="text-lg font-semibold text-foreground mb-2">
          {language === "PT" ? "Gerando pré-mapeamento..." : "Generating pre-mapping..."}
        </h2>
        <p className="text-sm text-muted-foreground mb-6">
          {language === "PT"
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
    const transcriptionFormats = ".txt,.doc,.docx,.pdf";
    const isVideoUpload = uploadType === "video";
    const canProcess = isVideoUpload ? (selectedFile && transcriptionFile) : selectedFile;
    
    return (
      <div className="max-w-2xl mx-auto py-16 px-4 animate-fade-in">
        <button
          onClick={() => {
            setFlowStep("select");
            setSelectedFile(null);
            setTranscriptionFile(null);
          }}
          className="text-sm text-muted-foreground hover:text-foreground mb-8 flex items-center gap-2"
        >
          ← {language === "PT" ? "Voltar" : "Back"}
        </button>

        <div className="text-center mb-10">
          <h2 className="text-xl font-semibold text-foreground mb-2">
            {isVideoUpload 
              ? (language === "PT" ? "Envie seu Vídeo e Transcrição" : "Upload your Video and Transcription")
              : (language === "PT" ? "Envie seu Documento" : "Upload your Document")
            }
          </h2>
          <p className="text-sm text-muted-foreground">
            {isVideoUpload
              ? (language === "PT" ? "Ambos os arquivos são obrigatórios para processar" : "Both files are required to process")
              : (language === "PT" ? "Formatos aceitos: Word, PDF, TXT" : "Accepted formats: Word, PDF, TXT")
            }
          </p>
        </div>

        {/* Hidden file inputs */}
        <input
          ref={fileInputRef}
          type="file"
          accept={acceptedFormats}
          onChange={handleFileInputChange}
          className="hidden"
        />
        {isVideoUpload && (
          <input
            ref={transcriptionInputRef}
            type="file"
            accept={transcriptionFormats}
            onChange={handleTranscriptionInputChange}
            className="hidden"
          />
        )}

        {/* Language Selection */}
        <div className="mb-6">
          <label className="text-sm font-medium text-foreground mb-2 block flex items-center gap-2">
            <Globe className="h-4 w-4 text-muted-foreground" />
            {language === "PT" ? "Idioma do Conteúdo" : "Content Language"}
          </label>
          <Select value={contentLanguage} onValueChange={(value: "PT" | "EN") => setContentLanguage(value)}>
            <SelectTrigger className="w-full max-w-xs bg-card">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="PT">
                <span className="flex items-center gap-2">
                  🇧🇷 {language === "PT" ? "Português" : "Portuguese"}
                </span>
              </SelectItem>
              <SelectItem value="EN">
                <span className="flex items-center gap-2">
                  🇺🇸 {language === "PT" ? "Inglês" : "English"}
                </span>
              </SelectItem>
            </SelectContent>
          </Select>
          <p className="text-xs text-muted-foreground mt-1.5">
            {language === "PT" 
              ? "Selecione o idioma da gravação/transcrição para melhor análise"
              : "Select the recording/transcription language for better analysis"
            }
          </p>
        </div>

        <div className={cn("space-y-6", isVideoUpload && "grid grid-cols-1 md:grid-cols-2 gap-6 space-y-0")}>
          {/* Video/Document Upload Area */}
          <div>
            {isVideoUpload && (
              <label className="text-sm font-medium text-foreground mb-3 block">
                1. {language === "PT" ? "Vídeo do Processo" : "Process Video"}
                <span className="text-xs text-muted-foreground ml-2">(MP4, MOV, WebM, AVI)</span>
              </label>
            )}
            <div 
              onClick={() => fileInputRef.current?.click()}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={cn(
                "border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all",
                isDragging && "border-primary bg-primary/10",
                selectedFile 
                  ? "border-primary bg-primary/5" 
                  : "border-border/60 hover:border-primary/40 hover:bg-muted/30"
              )}
            >
              {selectedFile ? (
                <div className="space-y-3">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto">
                    {isVideoUpload ? (
                      <FileVideo className="h-6 w-6 text-primary" />
                    ) : (
                      <FileText className="h-6 w-6 text-primary" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-foreground text-sm truncate max-w-[200px] mx-auto">{selectedFile.name}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {formatFileSize(selectedFile.size)}
                    </p>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleClearFile();
                    }}
                    className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-destructive transition-colors"
                  >
                    <X className="h-3.5 w-3.5" />
                    {language === "PT" ? "Remover" : "Remove"}
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="w-12 h-12 rounded-xl bg-muted/80 flex items-center justify-center mx-auto">
                    {isVideoUpload ? (
                      <FileVideo className="h-6 w-6 text-muted-foreground" />
                    ) : (
                      <Upload className="h-6 w-6 text-muted-foreground" />
                    )}
                  </div>
                  <div>
                    <p className="text-foreground font-medium text-sm">
                      {language === "PT" 
                        ? "Clique para selecionar"
                        : "Click to select"
                      }
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {language === "PT" 
                        ? "ou arraste e solte"
                        : "or drag and drop"
                      }
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Transcription Upload Area (only for video) */}
          {isVideoUpload && (
            <div>
              <label className="text-sm font-medium text-foreground mb-3 block">
                2. {language === "PT" ? "Transcrição do Vídeo" : "Video Transcription"}
                <span className="text-xs text-muted-foreground ml-2">(TXT, Word, PDF)</span>
              </label>
              <div 
                onClick={() => transcriptionInputRef.current?.click()}
                onDragOver={handleTranscriptionDragOver}
                onDragLeave={handleTranscriptionDragLeave}
                onDrop={handleTranscriptionDrop}
                className={cn(
                  "border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all",
                  isDraggingTranscription && "border-primary bg-primary/10",
                  transcriptionFile 
                    ? "border-primary bg-primary/5" 
                    : "border-border/60 hover:border-primary/40 hover:bg-muted/30"
                )}
              >
                {transcriptionFile ? (
                  <div className="space-y-3">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto">
                      <FileText className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground text-sm truncate max-w-[200px] mx-auto">{transcriptionFile.name}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {formatFileSize(transcriptionFile.size)}
                      </p>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleClearTranscription();
                      }}
                      className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-destructive transition-colors"
                    >
                      <X className="h-3.5 w-3.5" />
                      {language === "PT" ? "Remover" : "Remove"}
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="w-12 h-12 rounded-xl bg-muted/80 flex items-center justify-center mx-auto">
                      <FileText className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="text-foreground font-medium text-sm">
                        {language === "PT" 
                          ? "Clique para selecionar"
                          : "Click to select"
                        }
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {language === "PT" 
                          ? "ou arraste e solte"
                          : "or drag and drop"
                        }
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        <Button
          onClick={handleUpload}
          variant="corporate"
          disabled={!canProcess}
          className="w-full mt-6 h-12"
        >
          <Sparkles className="h-4 w-4 mr-2" />
          {language === "PT" ? "Processar com IA" : "Process with AI"}
        </Button>
      </div>
    );
  }

  if (flowStep === "processing") {
    return (
      <div className="max-w-lg mx-auto py-12 px-4 animate-fade-in">
        <div className="text-center mb-10">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center mx-auto mb-6 relative">
            <Brain className="h-10 w-10 text-primary animate-pulse" />
            <div className="absolute inset-0 rounded-full border-2 border-primary/30 animate-ping" style={{ animationDuration: '2s' }} />
          </div>
          <h2 className="text-xl font-semibold text-foreground mb-2">
            {language === "PT" ? "Agentes de IA Trabalhando" : "AI Agents Working"}
          </h2>
          <p className="text-sm text-muted-foreground max-w-sm mx-auto">
            {language === "PT" 
              ? "Nossos agentes estão analisando e criando sua documentação completa..."
              : "Our agents are analyzing and creating your complete documentation..."
            }
          </p>
        </div>

        {/* Overall Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between text-sm mb-2">
            <span className="text-muted-foreground">
              {language === "PT" ? "Progresso geral" : "Overall progress"}
            </span>
            <span className="text-primary font-medium">{Math.round(overallProgress)}%</span>
          </div>
          <Progress value={overallProgress} className="h-2" />
        </div>

        {/* Processing Steps */}
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
                <div className={cn(
                  "w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-all",
                  isCompleted && "bg-primary text-primary-foreground",
                  isCurrent && "bg-primary/10 text-primary",
                  isPending && "bg-muted text-muted-foreground"
                )}>
                  {isCompleted ? (
                    <Check className="h-5 w-5" />
                  ) : isCurrent ? (
                    <StepIcon className="h-5 w-5 animate-pulse" />
                  ) : (
                    <StepIcon className="h-5 w-5" />
                  )}
                </div>
                
                <div className="flex-1 min-w-0">
                  <span className={cn(
                    "text-sm font-medium block",
                    isCompleted || isCurrent ? "text-foreground" : "text-muted-foreground"
                  )}>
                    {language === "PT" ? step.labelPT : step.labelEN}
                  </span>
                  
                  {isCurrent && (
                    <div className="mt-2">
                      <Progress value={stepProgress} className="h-1" />
                    </div>
                  )}
                </div>
                
                {isCompleted && (
                  <span className="text-xs text-primary font-medium">
                    {language === "PT" ? "Concluído" : "Done"}
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
      <div className="max-w-lg mx-auto py-16 px-4 animate-fade-in text-center">
        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center mx-auto mb-8">
          <Check className="h-10 w-10 text-primary" />
        </div>
        <h2 className="text-2xl font-semibold text-foreground mb-3">
          {language === "PT" ? "Documentação Gerada!" : "Documentation Generated!"}
        </h2>
        <p className="text-muted-foreground mb-4 max-w-sm mx-auto">
          {language === "PT"
            ? "Sua POP e diagrama BPMN foram criados com sucesso e estão salvos como rascunho."
            : "Your SOP and BPMN diagram were successfully created and saved as draft."
          }
        </p>
        
        {/* Generated Items Summary */}
        <div className="bg-card rounded-xl border border-border/60 p-6 mb-8 text-left">
          <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide mb-4">
            {language === "PT" ? "Itens Gerados" : "Generated Items"}
          </h3>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center">
                <FileText className="h-4 w-4 text-amber-500" />
              </div>
              <div>
                <span className="text-sm font-medium text-foreground">{language === "PT" ? "POP" : "SOP"}</span>
                <span className="text-xs text-amber-500 ml-2 px-2 py-0.5 bg-amber-500/10 rounded">
                  {language === "PT" ? "Rascunho" : "Draft"}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center">
                <Workflow className="h-4 w-4 text-amber-500" />
              </div>
              <div>
                <span className="text-sm font-medium text-foreground">BPMN</span>
                <span className="text-xs text-amber-500 ml-2 px-2 py-0.5 bg-amber-500/10 rounded">
                  {language === "PT" ? "Rascunho" : "Draft"}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                <BarChart3 className="h-4 w-4 text-primary" />
              </div>
              <div>
                <span className="text-sm font-medium text-foreground">
                  {language === "PT" ? "Análises de Maturidade" : "Maturity Analysis"}
                </span>
                <span className="text-xs text-primary ml-2">
                  {language === "PT" ? "Automação, Data Integrity, Governança" : "Automation, Data Integrity, Governance"}
                </span>
              </div>
            </div>
          </div>
        </div>
        
        <Button onClick={handleComplete} variant="corporate" size="lg">
          {language === "PT" ? "Ver Documentação" : "View Documentation"}
        </Button>
      </div>
    );
  }

  return null;
}
