import { useState, useMemo } from "react";
import {
  ProcessAutomationDetailData,
  ProcessStepDetail,
  SolutionRecommendation,
} from "@/types/automationDetailTypes";
import { AgenticFrameworkStrip } from "./AgenticFrameworkStrip";
import { MacroBlockStepsTable } from "./MacroBlockStepsTable";
import { StepDetailSheet } from "./StepDetailSheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  Download,
  Search,
  Sparkles,
  X,
  FileText,
} from "lucide-react";

interface AutomationDetailViewProps {
  data: ProcessAutomationDetailData;
  onBackToAssessment: () => void;
}

export function AutomationDetailView({
  data,
  onBackToAssessment,
}: AutomationDetailViewProps) {
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(
    data.macroBlocks.length > 0 ? data.macroBlocks[0].id : null
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [expandEvidence, setExpandEvidence] = useState(false);

  // Modais e Drawers
  const [activeStepId, setActiveStepId] = useState<string | null>(null);
  const [activeSolutionId, setActiveSolutionId] = useState<string | null>(null);

  // Macroetapa atualmente selecionada
  const activeMacroBlock = useMemo(() => {
    if (!selectedBlockId) return null;
    return data.macroBlocks.find((b) => b.id === selectedBlockId) || null;
  }, [data.macroBlocks, selectedBlockId]);

  // Steps filtrados pela macroetapa e pela busca global
  const filteredSteps = useMemo(() => {
    return data.steps.filter((step) => {
      // Filtro de macroetapa (se houver macroetapa selecionada)
      if (selectedBlockId && step.macroBlockId !== selectedBlockId) {
        return false;
      }

      // Filtro de busca textual
      if (searchTerm.trim()) {
        const term = searchTerm.toLowerCase();
        const matchTitle = step.title.toLowerCase().includes(term);
        const matchId = String(step.id).toLowerCase().includes(term);
        const matchSol = (step.solutionName || "").toLowerCase().includes(term);
        const matchTech = (step.technology || "").toLowerCase().includes(term) ||
          (step.technologyOptions || []).some((t) => t.name.toLowerCase().includes(term));
        if (!matchTitle && !matchId && !matchSol && !matchTech) {
          return false;
        }
      }

      return true;
    });
  }, [data.steps, selectedBlockId, searchTerm]);

  // Objeto completo do step selecionado para o Drawer
  const activeStep = useMemo(() => {
    if (!activeStepId) return null;
    return data.steps.find((s) => s.id === activeStepId) || null;
  }, [data.steps, activeStepId]);

  // Solução vinculada ao step selecionado
  const stepSolution = useMemo(() => {
    if (!activeStep?.solutionId) return undefined;
    return data.solutions.find((s) => s.id === activeStep.solutionId);
  }, [data.solutions, activeStep]);

  // Objeto completo da solução selecionada para o Dialog
  const activeSolution = useMemo(() => {
    if (!activeSolutionId) return null;
    return data.solutions.find((s) => s.id === activeSolutionId) || null;
  }, [data.solutions, activeSolutionId]);

  // Função de exportação para CSV
  const handleExportCSV = () => {
    const headers = [
      "Step",
      "Título do Step",
      "Classificação",
      "Macroetapa",
      "Solução Tecnológica",
      "Esforço"
    ];
    const rows = data.steps.map((s) => [
      `"${s.id}"`,
      `"${s.title.replace(/"/g, '""')}"`,
      `"${s.classification}"`,
      `"${s.macroBlockName || ""}"`,
      `"${s.solutionName || "Não informado"}"`,
      `"${s.effort?.level || "Não informado"}"`,
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `detalhamento_automacao_${data.sopCode || "processo"}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-slate-50/60 pb-16">
      {/* Top Header Navigation & Breadcrumbs */}
      <div className="bg-white border-b border-border py-4 px-6 sticky top-0 z-20 shadow-xs">
        <div className="max-w-[1680px] mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <button
              onClick={onBackToAssessment}
              className="hover:text-primary font-medium flex items-center gap-1.5 transition-colors group"
            >
              <ArrowLeft className="h-3.5 w-3.5 group-hover:-translate-x-0.5 transition-transform" />
              Assessments
            </button>
            <span>/</span>
            <span className="text-foreground font-medium">{data.processName}</span>
            <span>/</span>
            <span className="text-primary font-bold">Detalhamento</span>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={onBackToAssessment}
              className="text-xs h-8 gap-1.5"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Voltar à avaliação
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={handleExportCSV}
              className="text-xs h-8 gap-1.5"
            >
              <Download className="h-3.5 w-3.5" />
              Exportar
            </Button>

            <Button
              variant={expandEvidence ? "default" : "outline"}
              size="sm"
              onClick={() => setExpandEvidence((v) => !v)}
              className="text-xs h-8 gap-1.5"
            >
              <FileText className="h-3.5 w-3.5" />
              {expandEvidence ? "Recolher evidências" : "Expandir evidências"}
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-[1680px] mx-auto px-6 pt-6 space-y-6">
        {/* Main Title Banner */}
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-primary">
            <span>ASSESSMENT DE AUTOMAÇÃO + IA</span>
            <span>·</span>
            <span>SOP {data.sopCode || "S2P08"}</span>
          </div>

          <h1 className="text-2xl font-extrabold text-foreground tracking-tight">
            {data.processName}
          </h1>

          <p className="text-xs text-muted-foreground max-w-4xl leading-relaxed">
            {data.summaryText ||
              "Conecte cada step à sua macroetapa e solução tecnológica correspondente."}
          </p>
        </div>

        {/* Aviso técnico discreto do modo demonstração */}
        {data.isDemoMode && (
          <div className="rounded-lg border border-amber-200/90 bg-amber-50/75 px-3.5 py-2 flex items-center justify-between text-xs text-amber-900 shadow-2xs">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-amber-600 shrink-0" />
              <span>
                <strong>Modo demonstração:</strong> dados de soluções temporários para validação visual.
              </span>
            </div>
            <span className="text-[10px] text-amber-700/80 font-medium">
              Framework de 5 macroetapas · Steps operacionais normalizados
            </span>
          </div>
        )}

        {/* Framework do Processo: Agentic Framework */}
        <div className="bg-white border border-border rounded-2xl p-6 shadow-xs space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="text-base font-bold text-foreground">Framework do processo</h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                {data.volumetrySummary ||
                  `${data.steps.length} atividades da SOP. Clique em um bloco para filtrar os steps e as soluções relacionadas.`}
              </p>
            </div>

            {/* Busca Rápida */}
            <div className="flex items-center gap-2">
              <div className="relative w-80 sm:w-96">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar step, solução ou tecnologia"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 pr-8 text-xs h-9 bg-muted/20"
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm("")}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>
              {searchTerm && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSearchTerm("")}
                  className="text-xs h-9 px-2 text-muted-foreground"
                >
                  Limpar
                </Button>
              )}
            </div>
          </div>

          {/* Cards Clicáveis de Macroetapas */}
          <AgenticFrameworkStrip
            macroBlocks={data.macroBlocks}
            selectedBlockId={selectedBlockId}
            onSelectBlock={setSelectedBlockId}
            totalStepsCount={data.steps.length}
            steps={data.steps}
            solutions={data.solutions}
            digitalLayers={data.digitalLayers}
            humanControls={data.humanControls}
            onOpenSolutionDetail={setActiveSolutionId}
            onSelectStep={setActiveStepId}
          />
        </div>

        {/* Área de Detalhamento - Tabela Única de Steps */}
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <h3 className="text-base font-bold text-foreground">
              {activeMacroBlock ? `Detalhamento: ${activeMacroBlock.name}` : "Detalhamento de todos os steps"}
            </h3>
            {activeMacroBlock && (
              <Badge variant="secondary" className="text-xs font-semibold px-2.5 py-1">
                {filteredSteps.length} {filteredSteps.length === 1 ? "step" : "steps"}
              </Badge>
            )}
          </div>

          {activeMacroBlock?.objective && (
            <div className="text-xs text-foreground/85 bg-slate-50 border border-slate-200/60 rounded-lg p-3">
              <strong className="text-foreground font-semibold">Objetivo do bloco:</strong>{" "}
              {activeMacroBlock.objective}
            </div>
          )}

          {/* Tabela de Steps (Largura Total) */}
          <MacroBlockStepsTable
            steps={filteredSteps}
            onSelectStep={(stepId) => setActiveStepId(stepId)}
            selectedStepId={activeStepId || undefined}
          />
        </div>
      </div>

      {/* Drawer de Detalhamento do Step (Bloco 4) */}
      <StepDetailSheet
        step={activeStep}
        open={!!activeStepId}
        onOpenChange={(open) => {
          if (!open) setActiveStepId(null);
        }}
        solution={stepSolution}
        onSelectRelatedStep={(otherStepId) => setActiveStepId(otherStepId)}
        onOpenSolutionDetail={(solId) => setActiveSolutionId(solId)}
      />
    </div>
  );
}
