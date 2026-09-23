import { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  Plus, X, Sparkles, BrainCircuit, CheckCircle2,
  TrendingUp, Cpu, Target, AlertCircle, Wand2, ArrowRight, Bookmark, BookmarkCheck, Library
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useUseCaseStore } from "@/stores/useUseCaseStore";

interface UseCaseMock {
  id: string;
  title: string;
  description: string;
  effort: "low" | "medium" | "high";
  impact: "incremental" | "relevant" | "transformative";
  technologies: string[];
}

interface GapsDetailModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  nodeName: string;
  initialGaps?: string[];
}

export function GapsDetailModal({ open, onOpenChange, nodeName, initialGaps = [] }: GapsDetailModalProps) {
  const { language } = useLanguage();
  const pt = language === "PT";

  const [gaps, setGaps] = useState<string[]>(
    initialGaps.length > 0 ? initialGaps : [
      "Informações de contexto perdidas ou incompletas",
      "Trabalho manual repetitivo na transcrição de dados",
    ]
  );
  const [newGap, setNewGap] = useState("");
  const [selectedGaps, setSelectedGaps] = useState<string[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [generatedCases, setGeneratedCases] = useState<UseCaseMock[]>([]);
  const [activeTab, setActiveTab] = useState<"gestao" | "casos_uso" | "salvos">("gestao");
  const { savedCases, saveUseCase, removeUseCase, isSaved } = useUseCaseStore();

  const handleAddGap = () => {
    if (newGap.trim()) {
      setGaps([...gaps, newGap.trim()]);
      setNewGap("");
    }
  };

  const handleRemoveGap = (index: number) => {
    const gapToRemove = gaps[index];
    setGaps(gaps.filter((_, i) => i !== index));
    setSelectedGaps(selectedGaps.filter(g => g !== gapToRemove));
  };

  const toggleGapSelection = (gap: string) => {
    setSelectedGaps(prev =>
      prev.includes(gap) ? prev.filter(g => g !== gap) : [...prev, gap]
    );
  };

  const handleGenerateUseCases = () => {
    if (selectedGaps.length === 0) return;
    setIsProcessing(true);
    setGeneratedCases([]);

    setTimeout(() => {
      setIsProcessing(false);
      setGeneratedCases([
        {
          id: "uc1",
          title: "Agente Copilot de Preenchimento Contextual",
          description: "Assistente baseado em IA generativa que lê transcrições e pré-preenche automaticamente os campos do processo no sistema, eliminando retrabalho manual.",
          effort: "low",
          impact: "incremental",
          technologies: ["Agente AI", "Integração CRM", "LLM"],
        },
        {
          id: "uc2",
          title: "Validação Automatizada de Qualidade",
          description: "Motor de regras inteligente que bloqueia avanço de itens sem contexto mínimo obrigatório, alertando o responsável e sugerindo ações corretivas.",
          effort: "medium",
          impact: "relevant",
          technologies: ["Motor de Regras", "RPA", "Notificações"],
        },
        {
          id: "uc3",
          title: "Dashboard de Gaps e Ações Prioritárias",
          description: "Painel integrado que consolida todos os gaps mapeados, priorizando por impacto e esforço, com geração automática de plano de ação.",
          effort: "high",
          impact: "transformative",
          technologies: ["Analytics", "BI", "Automação"],
        },
      ]);
    }, 2200);
  };

  const effortColors: Record<string, string> = {
    low: "bg-[#E3FAEF] text-[#008B5C] border-[#B7EDD3]",
    medium: "bg-[#FFF2D2] text-[#B97100] border-[#F5D98A]",
    high: "bg-[#FEE2E2] text-[#E2484E] border-[#FBBCBC]",
  };
  const effortLabels: Record<string, string> = {
    low: pt ? "Baixo Esforço" : "Low Effort",
    medium: pt ? "Médio Esforço" : "Medium Effort",
    high: pt ? "Alto Esforço" : "High Effort",
  };
  const impactColors: Record<string, string> = {
    incremental: "bg-[#E2F0FF] text-[#0055B3] border-[#B3D4FF]",
    relevant: "bg-[#F0E6FF] text-[#6B21A8] border-[#D4B8FF]",
    transformative: "bg-[#15233B] text-white border-[#15233B]",
  };
  const impactLabels: Record<string, string> = {
    incremental: pt ? "Impacto Incremental" : "Incremental",
    relevant: pt ? "Impacto Relevante" : "Relevant",
    transformative: pt ? "Transformacional" : "Transformative",
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="sm:max-w-[700px] w-[90vw] bg-white p-0 gap-0 overflow-hidden flex flex-col h-full">
        {/* Header */}
        <SheetHeader className="px-6 py-4 border-b border-[#DFE5EF] bg-gradient-to-r from-[#F8FAFF] to-white shrink-0">
          <SheetTitle className="text-base font-bold text-[#15233B] flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#1327b9]/10 flex items-center justify-center shrink-0">
              <Target className="h-4 w-4 text-[#1327b9]" />
            </div>
            <span>{pt ? "Gaps e Oportunidades" : "Gaps & Opportunities"}</span>
            <span className="text-[#8A96A9] font-normal">·</span>
            <span className="text-[#4D5A72] font-medium text-sm truncate">{nodeName}</span>
          </SheetTitle>
        </SheetHeader>

        {/* Custom Tabs */}
        <div className="flex border-b border-[#DFE5EF] bg-white shrink-0 px-6">
          <button
            type="button"
            onClick={() => setActiveTab("gestao")}
            className={cn(
              "flex items-center gap-1.5 py-3 px-1 text-sm font-medium border-b-2 -mb-px transition-colors mr-6",
              activeTab === "gestao"
                ? "border-[#1327b9] text-[#1327b9]"
                : "border-transparent text-[#71809A] hover:text-[#15233B]"
            )}
          >
            <AlertCircle className="h-3.5 w-3.5" />
            {pt ? "Gestão de Gaps" : "Gaps Management"}
            {gaps.length > 0 && (
              <span className={cn(
                "ml-1 text-[10px] font-bold px-1.5 py-0.5 rounded-full",
                activeTab === "gestao" ? "bg-[#1327b9] text-white" : "bg-[#F0F3F8] text-[#71809A]"
              )}>
                {gaps.length}
              </span>
            )}
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("casos_uso")}
            className={cn(
              "flex items-center gap-1.5 py-3 px-1 text-sm font-medium border-b-2 -mb-px transition-colors",
              activeTab === "casos_uso"
                ? "border-[#1327b9] text-[#1327b9]"
                : "border-transparent text-[#71809A] hover:text-[#15233B]"
            )}
          >
            <Sparkles className="h-3.5 w-3.5" />
            {pt ? "Casos de Uso" : "Use Cases"}
            {generatedCases.length > 0 && (
              <span className={cn(
                "ml-1 text-[10px] font-bold px-1.5 py-0.5 rounded-full",
                activeTab === "casos_uso" ? "bg-[#1327b9] text-white" : "bg-[#F0F3F8] text-[#71809A]"
              )}>
                {generatedCases.length}
              </span>
            )}
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("salvos")}
            className={cn(
              "flex items-center gap-1.5 py-3 px-1 text-sm font-medium border-b-2 -mb-px transition-colors ml-4",
              activeTab === "salvos"
                ? "border-[#1327b9] text-[#1327b9]"
                : "border-transparent text-[#71809A] hover:text-[#15233B]"
            )}
          >
            <Library className="h-3.5 w-3.5" />
            {pt ? "Salvos" : "Saved"}
            {savedCases.length > 0 && (
              <span className={cn(
                "ml-1 text-[10px] font-bold px-1.5 py-0.5 rounded-full",
                activeTab === "salvos" ? "bg-[#1327b9] text-white" : "bg-[#F0F3F8] text-[#71809A]"
              )}>
                {savedCases.length}
              </span>
            )}
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto bg-[#F8FAFC]">

          {/* ── ABA: GESTÃO DE GAPS ── */}
          {activeTab === "gestao" && (
            <div className="p-6 space-y-4">
              <div className="bg-white border border-[#DFE5EF] rounded-xl p-4 shadow-sm">
                <p className="text-xs font-semibold text-[#71809A] uppercase tracking-wider mb-3">
                  {pt ? "Adicionar novo gap, dor ou limitação" : "Add new gap, pain point or limitation"}
                </p>
                <div className="flex gap-2">
                  <Input
                    value={newGap}
                    onChange={(e) => setNewGap(e.target.value)}
                    placeholder={pt ? "Ex: Falta de visibilidade sobre status em tempo real..." : "E.g.: Lack of real-time status visibility..."}
                    className="flex-1 h-9 text-sm border-[#DFE5EF] focus:border-[#1327b9]"
                    onKeyDown={(e) => { if (e.key === "Enter") handleAddGap(); }}
                  />
                  <Button
                    type="button"
                    onClick={handleAddGap}
                    disabled={!newGap.trim()}
                    size="sm"
                    className="h-9 bg-[#1327b9] hover:bg-[#0C1BA8] text-white px-4"
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    {pt ? "Adicionar" : "Add"}
                  </Button>
                </div>
              </div>

              {gaps.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-14 text-center">
                  <div className="w-12 h-12 rounded-full bg-[#E3FAEF] flex items-center justify-center mb-3">
                    <CheckCircle2 className="h-6 w-6 text-[#008B5C]" />
                  </div>
                  <p className="text-sm font-semibold text-[#15233B]">
                    {pt ? "Nenhum gap mapeado" : "No gaps mapped"}
                  </p>
                  <p className="text-xs text-[#8A96A9] mt-1">
                    {pt ? "Este componente da arquitetura está bem definido!" : "This architecture component is well defined!"}
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-xs font-semibold text-[#71809A] uppercase tracking-wider">
                      {gaps.length} {pt ? "gaps mapeados" : "gaps mapped"}
                    </p>
                    <button
                      type="button"
                      onClick={() => setActiveTab("casos_uso")}
                      className="text-xs text-[#1327b9] font-medium flex items-center gap-1 hover:underline"
                    >
                      {pt ? "Gerar casos de uso" : "Generate use cases"}
                      <ArrowRight className="h-3 w-3" />
                    </button>
                  </div>
                  {gaps.map((gap, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-3 bg-white border border-[#DFE5EF] px-4 py-3 rounded-lg group hover:border-[#E2484E]/40 transition-colors"
                    >
                      <span className="h-2 w-2 rounded-full bg-[#E2484E] mt-1.5 shrink-0" />
                      <span className="flex-1 text-sm text-[#34445F] leading-snug">{gap}</span>
                      <button
                        type="button"
                        className="opacity-0 group-hover:opacity-100 transition-opacity text-[#A5A7B0] hover:text-[#E2484E] p-0.5 rounded"
                        onClick={() => handleRemoveGap(idx)}
                        title={pt ? "Remover" : "Remove"}
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ── ABA: CASOS DE USO ── */}
          {activeTab === "casos_uso" && (
            <div className="p-6 space-y-4">
              {/* Painel de seleção */}
              <div className="bg-white border border-[#DFE5EF] rounded-xl overflow-hidden shadow-sm">
                <div className="flex items-center justify-between px-5 py-3 border-b border-[#DFE5EF] bg-[#F8FAFF]">
                  <div className="flex items-center gap-2">
                    <Wand2 className="h-4 w-4 text-[#1327b9]" />
                    <h3 className="text-sm font-bold text-[#15233B]">
                      {pt ? "Gerador de Iniciativas com IA" : "AI Initiative Generator"}
                    </h3>
                  </div>
                  <div className="flex items-center gap-3">
                    {selectedGaps.length > 0 && (
                      <span className="text-[11px] text-[#1327b9] font-semibold">
                        {selectedGaps.length} {pt ? "selecionado(s)" : "selected"}
                      </span>
                    )}
                    <button type="button" onClick={() => setSelectedGaps([...gaps])} className="text-[11px] text-[#71809A] hover:text-[#1327b9] font-medium transition-colors">
                      {pt ? "Todos" : "All"}
                    </button>
                    {selectedGaps.length > 0 && (
                      <button type="button" onClick={() => setSelectedGaps([])} className="text-[11px] text-[#71809A] hover:text-[#E2484E] font-medium transition-colors">
                        {pt ? "Limpar" : "Clear"}
                      </button>
                    )}
                  </div>
                </div>

                <div className="px-5 py-4">
                  <p className="text-xs text-[#71809A] mb-3 leading-relaxed">
                    {pt
                      ? "Selecione os gaps que deseja resolver. O agente de IA cruzará com o contexto do processo para sugerir iniciativas."
                      : "Select the gaps you want to solve. The AI agent will cross-reference with process context to suggest initiatives."}
                  </p>

                  {gaps.length === 0 ? (
                    <div className="py-6 text-center">
                      <p className="text-sm text-[#8A96A9]">
                        {pt ? "Nenhum gap disponível. Adicione gaps na aba anterior." : "No gaps available. Add gaps in the previous tab."}
                      </p>
                      <button
                        type="button"
                        onClick={() => setActiveTab("gestao")}
                        className="mt-2 text-sm text-[#1327b9] font-medium hover:underline"
                      >
                        {pt ? "← Ir para Gestão de Gaps" : "← Go to Gaps Management"}
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-1.5 max-h-[180px] overflow-y-auto pr-1">
                      {gaps.map((gap, idx) => (
                        <label
                          key={idx}
                          className="flex items-start gap-2.5 cursor-pointer hover:bg-[#F8FAFF] px-2 py-2 rounded-lg transition-colors"
                        >
                          <Checkbox
                            checked={selectedGaps.includes(gap)}
                            onCheckedChange={() => toggleGapSelection(gap)}
                            className="mt-0.5 border-[#C0CAD8] data-[state=checked]:bg-[#1327b9] data-[state=checked]:border-[#1327b9]"
                          />
                          <span className="text-sm text-[#34445F] leading-snug select-none">{gap}</span>
                        </label>
                      ))}
                    </div>
                  )}

                  <div className="flex justify-between items-center pt-3 mt-3 border-t border-[#DFE5EF]">
                    <span className="text-xs text-[#8A96A9]">
                      {selectedGaps.length === 0
                        ? (pt ? "Selecione ao menos 1 gap" : "Select at least 1 gap")
                        : (pt ? `${selectedGaps.length} gap(s) selecionado(s)` : `${selectedGaps.length} gap(s) selected`)}
                    </span>
                    <Button
                      type="button"
                      onClick={handleGenerateUseCases}
                      disabled={selectedGaps.length === 0 || isProcessing}
                      size="sm"
                      className="bg-[#1327b9] hover:bg-[#0C1BA8] text-white h-8 text-xs px-4 disabled:opacity-50"
                    >
                      {isProcessing ? (
                        <>
                          <BrainCircuit className="h-3.5 w-3.5 mr-1.5 animate-pulse" />
                          {pt ? "Processando..." : "Processing..."}
                        </>
                      ) : (
                        <>
                          <Sparkles className="h-3.5 w-3.5 mr-1.5" />
                          {pt ? "Gerar Casos de Uso" : "Generate Use Cases"}
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </div>

              {/* Loading state */}
              {isProcessing && (
                <div className="flex flex-col items-center justify-center py-12 bg-white rounded-xl border border-[#DFE5EF]">
                  <div className="w-14 h-14 rounded-full bg-[#1327b9]/10 flex items-center justify-center mb-4 animate-pulse">
                    <BrainCircuit className="h-7 w-7 text-[#1327b9]" />
                  </div>
                  <p className="text-sm font-semibold text-[#15233B]">
                    {pt ? "Analisando gaps e contexto..." : "Analyzing gaps and context..."}
                  </p>
                  <p className="text-xs text-[#8A96A9] mt-1">
                    {pt ? "Cruzando com tecnologias e padrões de mercado" : "Cross-referencing technologies and market patterns"}
                  </p>
                </div>
              )}

              {/* Generated use cases */}
              {!isProcessing && generatedCases.length > 0 && (
                <div className="space-y-3 animate-in fade-in slide-in-from-bottom-3 duration-400">
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-[#1327b9]" />
                    <h4 className="text-sm font-bold text-[#15233B]">
                      {pt ? "Casos de Uso Sugeridos" : "Suggested Use Cases"}
                    </h4>
                    <span className="text-xs text-[#8A96A9]">
                      — {generatedCases.length} {pt ? "iniciativas" : "initiatives"}
                    </span>
                  </div>

                  {generatedCases.map((uc) => (
                    <div
                      key={uc.id}
                      className="group bg-white border border-[#DFE5EF] rounded-xl p-5 shadow-sm hover:border-[#1327b9]/30 hover:shadow-md transition-all relative overflow-hidden"
                    >
                      <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-[#1327b9] to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <h5 className="font-bold text-[#15233B] text-sm leading-snug pr-8">{uc.title}</h5>
                        <div className="flex gap-1.5 shrink-0 flex-wrap justify-end">
                          <span className={cn("text-[9px] font-bold px-2 py-0.5 rounded border uppercase tracking-wide", effortColors[uc.effort])}>
                            {effortLabels[uc.effort]}
                          </span>
                          <span className={cn("text-[9px] font-bold px-2 py-0.5 rounded border uppercase tracking-wide flex items-center gap-1", impactColors[uc.impact])}>
                            <TrendingUp className="h-2.5 w-2.5" />
                            {impactLabels[uc.impact]}
                          </span>
                        </div>
                      </div>

                      {/* Save Button */}
                      <button
                        onClick={() => isSaved(uc.id) ? removeUseCase(uc.id) : saveUseCase(uc, nodeName)}
                        className={cn(
                          "absolute top-4 right-4 p-1.5 rounded-full transition-colors duration-200",
                          isSaved(uc.id) 
                            ? "bg-[#E3FAEF] text-[#008B5C] hover:bg-[#B7EDD3]" 
                            : "bg-gray-100 text-gray-400 hover:bg-gray-200 hover:text-gray-600 opacity-0 group-hover:opacity-100"
                        )}
                        title={isSaved(uc.id) ? (pt ? "Remover dos salvos" : "Remove from saved") : (pt ? "Salvar caso de uso" : "Save use case")}
                      >
                        {isSaved(uc.id) ? <BookmarkCheck className="h-4 w-4" /> : <Bookmark className="h-4 w-4" />}
                      </button>
                      <p className="text-xs text-[#4D5A72] leading-relaxed mb-3">{uc.description}</p>
                      <div className="flex flex-wrap gap-1.5">
                        {uc.technologies.map((tech, idx) => (
                          <span key={idx} className="inline-flex items-center gap-1 text-[10px] bg-[#F0F3F8] border border-[#DFE5EF] text-[#4D5A72] px-2 py-0.5 rounded font-medium">
                            <Cpu className="h-2.5 w-2.5 text-[#1327b9]" />
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ── ABA: SALVOS ── */}
          {activeTab === "salvos" && (
            <div className="p-6 space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <Library className="h-4 w-4 text-[#1327b9]" />
                <h3 className="text-sm font-bold text-[#15233B]">
                  {pt ? "Casos de Uso Salvos" : "Saved Use Cases"}
                </h3>
              </div>

              {savedCases.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 bg-white border border-dashed border-[#DFE5EF] rounded-xl text-center">
                  <div className="w-12 h-12 rounded-full bg-[#F0F3F8] flex items-center justify-center mb-3">
                    <Bookmark className="h-6 w-6 text-[#8A96A9]" />
                  </div>
                  <p className="text-sm font-semibold text-[#15233B]">
                    {pt ? "Nenhum caso de uso salvo" : "No saved use cases"}
                  </p>
                  <p className="text-xs text-[#8A96A9] mt-1 max-w-[250px] mx-auto">
                    {pt ? "Gere iniciativas na aba 'Casos de Uso' e salve as melhores para consultar aqui depois." : "Generate initiatives in the 'Use Cases' tab and save the best ones to consult here later."}
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-4"
                    onClick={() => setActiveTab("casos_uso")}
                  >
                    {pt ? "Ir para Casos de Uso" : "Go to Use Cases"}
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  {savedCases.map((uc) => (
                    <div
                      key={uc.id}
                      className="group bg-white border border-[#DFE5EF] rounded-xl p-5 shadow-sm relative overflow-hidden"
                    >
                      <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-[#1327b9] to-transparent" />
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <div>
                          <h5 className="font-bold text-[#15233B] text-sm leading-snug pr-8">{uc.title}</h5>
                          <span className="text-[10px] text-[#71809A] font-medium block mt-0.5">
                            {pt ? "Referente ao nó:" : "Regarding node:"} <strong className="text-[#15233B]">{uc.nodeName}</strong>
                          </span>
                        </div>
                        <div className="flex gap-1.5 shrink-0 flex-wrap justify-end mt-1">
                          <span className={cn("text-[9px] font-bold px-2 py-0.5 rounded border uppercase tracking-wide", effortColors[uc.effort])}>
                            {effortLabels[uc.effort]}
                          </span>
                          <span className={cn("text-[9px] font-bold px-2 py-0.5 rounded border uppercase tracking-wide flex items-center gap-1", impactColors[uc.impact])}>
                            <TrendingUp className="h-2.5 w-2.5" />
                            {impactLabels[uc.impact]}
                          </span>
                        </div>
                      </div>
                      
                      <button
                        onClick={() => removeUseCase(uc.id)}
                        className="absolute top-4 right-4 p-1.5 rounded-full bg-[#E3FAEF] text-[#008B5C] hover:bg-[#B7EDD3] transition-colors duration-200"
                        title={pt ? "Remover dos salvos" : "Remove from saved"}
                      >
                        <BookmarkCheck className="h-4 w-4" />
                      </button>

                      <p className="text-xs text-[#4D5A72] leading-relaxed mb-3 mt-2">{uc.description}</p>
                      <div className="flex flex-wrap gap-1.5">
                        {uc.technologies.map((tech, idx) => (
                          <span key={idx} className="inline-flex items-center gap-1 text-[10px] bg-[#F0F3F8] border border-[#DFE5EF] text-[#4D5A72] px-2 py-0.5 rounded font-medium">
                            <Cpu className="h-2.5 w-2.5 text-[#1327b9]" />
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

      </SheetContent>
    </Sheet>
  );
}
