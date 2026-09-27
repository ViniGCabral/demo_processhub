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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ArrowLeft,
  Download,
  Search,
  Sparkles,
  X,
  FileText,
  Filter,
} from "lucide-react";

interface AutomationDetailViewProps {
  data: ProcessAutomationDetailData;
  onBackToAssessment: () => void;
}

const EFFORT_WEIGHTS: Record<string, number> = {
  low: 1,
  medium: 2,
  high: 3,
  very_high: 4,
  not_applicable: 0,
};

export function AutomationDetailView({
  data,
  onBackToAssessment,
}: AutomationDetailViewProps) {
  // Busca e Filtros
  const [searchTerm, setSearchTerm] = useState("");
  const [filterTechnology, setFilterTechnology] = useState<string>("all");
  const [filterEffort, setFilterEffort] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("default");
  const [expandEvidence, setExpandEvidence] = useState(false);

  // Modais e Drawers
  const [activeStepId, setActiveStepId] = useState<string | null>(null);
  const [activeSolutionId, setActiveSolutionId] = useState<string | null>(null);

  // Lista única de tecnologias disponíveis nos steps para o filtro
  const availableTechnologies = useMemo(() => {
    const set = new Set<string>();
    data.steps.forEach((s) => {
      const tech = s.technologyType || (s.classification === "MNA" ? "Humano" : null);
      if (tech) set.add(tech);
    });
    return Array.from(set).sort();
  }, [data.steps]);

  // Steps filtrados por busca, tecnologia e esforço, e ordenados
  const filteredSteps = useMemo(() => {
    let result = data.steps.filter((step) => {
      // Filtro de tecnologia
      if (filterTechnology !== "all") {
        const stepTech = step.technologyType || (step.classification === "MNA" ? "Humano" : "");
        if (stepTech.toLowerCase() !== filterTechnology.toLowerCase()) {
          return false;
        }
      }

      // Filtro de esforço
      if (filterEffort !== "all") {
        const stepEffort = step.effort?.level || "not_applicable";
        if (stepEffort !== filterEffort) {
          return false;
        }
      }

      // Filtro de busca textual
      if (searchTerm.trim()) {
        const term = searchTerm.toLowerCase();
        const matchTitle = step.title.toLowerCase().includes(term);
        const matchId = String(step.number || step.id).toLowerCase().includes(term);
        const matchSol = (step.solutionName || "").toLowerCase().includes(term);
        const matchTech = (step.technologyType || step.technology || "").toLowerCase().includes(term) ||
          (step.technologyOptions || []).some((t) => t.name.toLowerCase().includes(term));
        const matchClassification = (step.classification || "").toLowerCase().includes(term) ||
          (step.classifications || []).some((c) => String(c).toLowerCase().includes(term));
        if (!matchTitle && !matchId && !matchSol && !matchTech && !matchClassification) {
          return false;
        }
      }

      return true;
    });

    // Ordenação
    if (sortBy === "effort_asc") {
      result = [...result].sort((a, b) => {
        const wA = EFFORT_WEIGHTS[a.effort?.level || "not_applicable"] ?? 0;
        const wB = EFFORT_WEIGHTS[b.effort?.level || "not_applicable"] ?? 0;
        return wA - wB;
      });
    } else if (sortBy === "effort_desc") {
      result = [...result].sort((a, b) => {
        const wA = EFFORT_WEIGHTS[a.effort?.level || "not_applicable"] ?? 0;
        const wB = EFFORT_WEIGHTS[b.effort?.level || "not_applicable"] ?? 0;
        return wB - wA;
      });
    } else if (sortBy === "title") {
      result = [...result].sort((a, b) => a.title.localeCompare(b.title));
    }

    return result;
  }, [data.steps, searchTerm, filterTechnology, filterEffort, sortBy]);

  const hasActiveFilters = searchTerm !== "" || filterTechnology !== "all" || filterEffort !== "all" || sortBy !== "default";

  const handleResetFilters = () => {
    setSearchTerm("");
    setFilterTechnology("all");
    setFilterEffort("all");
    setSortBy("default");
  };

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
      "Solução Tecnológica",
      "Esforço"
    ];
    const rows = filteredSteps.map((s) => [
      `"${s.number || s.id}"`,
      `"${s.title.replace(/"/g, '""')}"`,
      `"${s.classification}"`,
      `"${s.technologyType || s.solutionName || "Não informado"}"`,
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
              "Conecte cada step à sua solução tecnológica correspondente."}
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
              Digital Agents Layer · Steps operacionais normalizados
            </span>
          </div>
        )}

        {/* Framework do Processo: Agentic Framework */}
        <div className="bg-white border border-border rounded-2xl p-6 shadow-xs space-y-4">
          <div>
            <h2 className="text-base font-bold text-foreground">Framework do processo</h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              {data.volumetrySummary ||
                `${data.steps.length} atividades da SOP normalizadas em agentes e soluções tecnológicas.`}
            </p>
          </div>

          {/* Cards Clicáveis de Macroetapas */}
          <AgenticFrameworkStrip
            macroBlocks={data.macroBlocks}
            selectedBlockId={null}
            onSelectBlock={() => {}}
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
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-border pb-4">
            <div className="flex items-center gap-3">
              <h3 className="text-base font-bold text-foreground">
                Detalhamento dos steps
              </h3>
              <Badge variant="secondary" className="text-xs font-semibold px-2.5 py-1">
                {filteredSteps.length} {filteredSteps.length === 1 ? "step" : "steps"}
              </Badge>
            </div>

            {/* Barra de Pesquisa e Filtros */}
            <div className="flex flex-wrap items-center gap-2.5">
              {/* Busca Textual */}
              <div className="relative w-64 sm:w-72">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                <Input
                  placeholder="Buscar step, tecnologia..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8 pr-7 text-xs h-9 bg-white"
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm("")}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>

              {/* Filtro por Solução Tecnológica */}
              <div className="w-44">
                <Select value={filterTechnology} onValueChange={setFilterTechnology}>
                  <SelectTrigger className="h-9 text-xs bg-white">
                    <SelectValue placeholder="Solução tecnológica" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all" className="text-xs">Todas as soluções</SelectItem>
                    {availableTechnologies.map((tech) => (
                      <SelectItem key={tech} value={tech} className="text-xs">
                        {tech}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Filtro por Esforço */}
              <div className="w-36">
                <Select value={filterEffort} onValueChange={setFilterEffort}>
                  <SelectTrigger className="h-9 text-xs bg-white">
                    <SelectValue placeholder="Esforço" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all" className="text-xs">Todos os esforços</SelectItem>
                    <SelectItem value="low" className="text-xs">Baixo</SelectItem>
                    <SelectItem value="medium" className="text-xs">Médio</SelectItem>
                    <SelectItem value="high" className="text-xs">Alto</SelectItem>
                    <SelectItem value="very_high" className="text-xs">Muito Alto</SelectItem>
                    <SelectItem value="not_applicable" className="text-xs">Não aplicável</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Ordenação */}
              <div className="w-40">
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="h-9 text-xs bg-white">
                    <SelectValue placeholder="Ordenar por" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="default" className="text-xs">Ordem padrão (Step)</SelectItem>
                    <SelectItem value="effort_asc" className="text-xs">Esforço: Menor → Maior</SelectItem>
                    <SelectItem value="effort_desc" className="text-xs">Esforço: Maior → Menor</SelectItem>
                    <SelectItem value="title" className="text-xs">Título (A-Z)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Botão Limpar Filtros */}
              {hasActiveFilters && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleResetFilters}
                  className="text-xs h-9 px-2 text-muted-foreground hover:text-foreground"
                >
                  <X className="h-3.5 w-3.5 mr-1" />
                  Limpar
                </Button>
              )}
            </div>
          </div>

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
