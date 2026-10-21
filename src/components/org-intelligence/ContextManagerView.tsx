import { useState, useRef } from "react";
import {
  Upload,
  FileText,
  Scale,
  Target,
  BookOpen,
  CheckCircle2,
  Trash2,
  GitBranch,
  ShieldCheck,
  Sparkles,
  Check,
  X,
  Bot,
  Cog,
  RefreshCw,
  ArrowLeft,
  ArrowRight,
  Globe,
  Layers,
  SlidersHorizontal,
} from "lucide-react";
import { useOrgIntelligenceStore } from "@/stores/orgIntelligenceStore";
import { ContextCategory } from "@/data/orgIntelligenceMockData";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const CATEGORY_META: Record<
  ContextCategory,
  { label: string; badgeClass: string; icon: typeof Scale }
> = {
  estrategico: {
    label: "Planejamento Estratégico & OKRs",
    badgeClass: "bg-blue-50 text-blue-700 border-blue-200",
    icon: Target,
  },
  regulatorio: {
    label: "Normas Regulatórias & Leis",
    badgeClass: "bg-purple-50 text-purple-700 border-purple-200",
    icon: Scale,
  },
  politica: {
    label: "Políticas, Manuais & Governança",
    badgeClass: "bg-amber-50 text-amber-800 border-amber-200",
    icon: ShieldCheck,
  },
  consulta: {
    label: "Estudos Técnicos & Benchmarks",
    badgeClass: "bg-emerald-50 text-emerald-700 border-emerald-200",
    icon: BookOpen,
  },
};

export function ContextManagerView() {
  const {
    areaProfiles,
    selectedAreaProfileId,
    setSelectedAreaProfileId,
    generateAgentForArea,
    setActiveModuleTab,
    passiveSources,
    activeDocuments,
    togglePassiveSource,
    toggleActiveDocument,
    addActiveDocument,
    removeActiveDocument,
  } = useOrgIntelligenceStore();

  // Quando selectedAreaProfileId for null, exibe a Visão Macro & Transversal
  const selectedArea = selectedAreaProfileId
    ? areaProfiles.find((a) => a.id === selectedAreaProfileId) || null
    : null;

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [generatingAreaId, setGeneratingAreaId] = useState<string | null>(null);
  const [customPersonaInput, setCustomPersonaInput] = useState("");

  // Campos do modal de novo documento (Transversal ou por Área)
  const [newTitle, setNewTitle] = useState("");
  const [newCategory, setNewCategory] = useState<ContextCategory>("estrategico");
  const [newSourceOrg, setNewSourceOrg] = useState("");
  const [newFileName, setNewFileName] = useState("");
  const [newFileSize, setNewFileSize] = useState("1.8 MB");
  const [newSummary, setNewSummary] = useState("");
  const [newRulesText, setNewRulesText] = useState("");
  const [targetUploadScope, setTargetUploadScope] = useState<string>("transversal");

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleOpenUploadModal = (defaultScope?: string) => {
    const scope = defaultScope || selectedArea?.id || "transversal";
    setTargetUploadScope(scope);
    if (scope === "transversal") {
      setNewCategory("estrategico");
    } else {
      setNewCategory("politica");
    }
    setIsAddModalOpen(true);
  };

  const handleFileUploadChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setNewFileName(file.name);
    const sizeMB = (file.size / (1024 * 1024)).toFixed(2);
    setNewFileSize(`${Math.max(0.1, parseFloat(sizeMB))} MB`);
    if (!newTitle) {
      setNewTitle(file.name.replace(/\.[^/.]+$/, "").replace(/[_-]/g, " "));
    }
    toast.info(`Arquivo "${file.name}" selecionado para indexação!`);
  };

  const handleCreateDocument = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) {
      toast.error("Informe um título para a documentação.");
      return;
    }

    const isTransversal = targetUploadScope === "transversal";
    const targetAreaObj = isTransversal
      ? null
      : areaProfiles.find((a) => a.id === targetUploadScope) || areaProfiles[0];

    const rulesArray = newRulesText
      .split("\n")
      .map((r) => r.trim())
      .filter(Boolean);

    const ext = newFileName.split(".").pop()?.toUpperCase();
    const fileType =
      ext === "DOCX" || ext === "XLSX" || ext === "TXT" ? ext : "PDF";

    addActiveDocument({
      title: newTitle.trim(),
      category: newCategory,
      sourceOrg:
        newSourceOrg.trim() ||
        (isTransversal
          ? "Corporativo / Estratégia Global"
          : targetAreaObj!.shortArea),
      fileName:
        newFileName ||
        `${newTitle.trim().toLowerCase().replace(/\s+/g, "_")}.pdf`,
      fileType,
      fileSize: newFileSize,
      enabled: true,
      areaId: isTransversal ? "transversal" : targetAreaObj!.id,
      summary:
        newSummary.trim() ||
        (isTransversal
          ? "Documentação transversal corporativa aplicável a todas as áreas e simulações da empresa."
          : `Documentação vigente vinculada ao perfil de ${targetAreaObj!.shortArea}.`),
      extractedRules:
        rulesArray.length > 0
          ? rulesArray
          : [
              isTransversal
                ? `Diretriz corporativa transversal extraída de "${newTitle.trim()}".`
                : `Diretriz setorial extraída de "${newTitle.trim()}" ativa no agente de ${targetAreaObj!.shortArea}.`,
            ],
      relatedAreas: isTransversal
        ? ["Todas as Áreas (Transversal)"]
        : [targetAreaObj!.shortArea],
    });

    toast.success(
      isTransversal
        ? "Documentação transversal adicionada à base corporativa!"
        : `Nova documentação adicionada ao perfil de ${targetAreaObj!.shortArea}!`
    );
    setNewTitle("");
    setNewSourceOrg("");
    setNewFileName("");
    setNewSummary("");
    setNewRulesText("");
    setIsAddModalOpen(false);
  };

  const handleGenerateOrUpdateAgent = (areaId: string, customPersona?: string) => {
    setGeneratingAreaId(areaId);
    setTimeout(() => {
      generateAgentForArea(areaId, customPersona);
      setGeneratingAreaId(null);
      setCustomPersonaInput("");
      const area = areaProfiles.find((a) => a.id === areaId);
      toast.success(
        `Agente Especialista de ${area?.shortArea} gerado e sincronizado com sucesso!`
      );
    }, 800);
  };

  // Documentos Transversais (Escopo Corporativo / Sem vínculo exclusivo a uma área)
  const transversalDocuments = activeDocuments.filter(
    (d) => d.areaId === "transversal" || !d.areaId
  );

  // Documentos da Área Selecionada
  const areaSpecificDocuments = selectedArea
    ? activeDocuments.filter(
        (d) =>
          d.areaId === selectedArea.id ||
          (d.areaId !== "transversal" &&
            d.relatedAreas.includes(selectedArea.shortArea))
      )
    : [];

  const activeAgentsCount = areaProfiles.filter((a) => a.hasAgentGenerated).length;
  const activeDocsCount = activeDocuments.filter((d) => d.enabled).length;

  return (
    <div className="min-h-[calc(100vh-64px)] bg-[#f8fafc] py-8 px-6 sm:px-10">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* =====================================================================
            1. CABEÇALHO CLEAN & SELETOR DE ESCOPO (VISÃO MACRO vs. POR ÁREA)
        ===================================================================== */}
        <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-7 shadow-2xs space-y-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="space-y-1.5 max-w-2xl">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setActiveModuleTab("home")}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-xs font-semibold text-slate-700 transition-colors cursor-pointer"
                >
                  <ArrowLeft className="h-3.5 w-3.5" />
                  <span>Voltar ao Início</span>
                </button>
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  {activeAgentsCount}/{areaProfiles.length} agentes ativos · {activeDocsCount} docs vigentes
                </span>
              </div>

              <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight pt-1">
                Configurações de Agentes & Base de Contexto
              </h1>
              <p className="text-sm text-slate-500 leading-relaxed">
                Gerencie documentações transversais da empresa (como Planejamento Estratégico) ou acesse o perfil de cada área para gerar agentes especialistas e controlar suas bases vigentes.
              </p>
            </div>

            <button
              type="button"
              onClick={() =>
                handleOpenUploadModal(selectedArea ? selectedArea.id : "transversal")
              }
              className="px-4 py-2.5 rounded-xl bg-[#ea580c] hover:bg-[#c2410c] text-white text-xs font-bold flex items-center gap-2 shadow-xs transition-all cursor-pointer shrink-0"
            >
              <Upload className="h-4 w-4" />
              <span>
                {selectedArea
                  ? `Subir Documento em ${selectedArea.shortArea}`
                  : "Subir Nova Documentação"}
              </span>
            </button>
          </div>

          {/* Barra de Navegação: Visão Geral (Macro) + Pílulas de Cada Área */}
          <div className="flex items-center gap-2 overflow-x-auto pt-2 border-t border-slate-100 pb-1">
            <button
              type="button"
              onClick={() => setSelectedAreaProfileId(null)}
              className={cn(
                "px-4 py-2.5 rounded-xl border text-xs font-bold flex items-center gap-2 shrink-0 transition-all cursor-pointer",
                selectedArea === null
                  ? "bg-slate-900 text-white border-slate-900 shadow-2xs"
                  : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-white hover:border-slate-300"
              )}
            >
              <Globe className="h-4 w-4 text-emerald-400" />
              <span>Visão Macro & Transversal</span>
            </button>

            <div className="h-5 w-px bg-slate-200 mx-1 shrink-0" />

            {areaProfiles.map((area) => {
              const isSelected = selectedArea?.id === area.id;
              return (
                <button
                  key={area.id}
                  type="button"
                  onClick={() => setSelectedAreaProfileId(area.id)}
                  className={cn(
                    "px-3.5 py-2.5 rounded-xl border text-xs font-semibold flex items-center gap-2 shrink-0 transition-all cursor-pointer",
                    isSelected
                      ? "bg-slate-900 text-white border-slate-900 shadow-2xs"
                      : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50 hover:border-slate-300"
                  )}
                >
                  <span
                    className="w-5 h-5 rounded-md text-white font-bold text-[9px] flex items-center justify-center shrink-0"
                    style={{ backgroundColor: area.avatarColor }}
                  >
                    {area.avatarInitials}
                  </span>
                  <span>{area.shortArea}</span>
                  <span
                    className={cn(
                      "w-2 h-2 rounded-full shrink-0",
                      area.hasAgentGenerated ? "bg-emerald-500" : "bg-amber-400"
                    )}
                    title={
                      area.hasAgentGenerated
                        ? "Agente Especialista Ativo"
                        : "Agente Pendente de Geração"
                    }
                  />
                </button>
              );
            })}
          </div>
        </div>

        {/* =====================================================================
            2A. VISÃO MACRO & TRANSVERSAL (QUANDO NENHUMA ÁREA ESTÁ SELECIONADA)
        ===================================================================== */}
        {selectedArea === null ? (
          <div className="space-y-8">
            {/* BLOCO 1: DOCUMENTAÇÕES TRANSVERSAIS / CORPORATIVAS (SEM VÍNCULO A UMA ÚNICA ÁREA) */}
            <section className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-7 shadow-2xs space-y-5">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-blue-50 text-blue-700 border border-blue-200">
                      Escopo Corporativo / Transversal
                    </span>
                    <span className="text-xs text-slate-400 font-medium">
                      Aplicável a toda a empresa
                    </span>
                  </div>
                  <h2 className="text-lg font-bold text-slate-900">
                    Documentações Transversais & Planejamento Estratégico
                  </h2>
                  <p className="text-xs text-slate-500">
                    Documentos que não pertencem a uma área isolada (como Planejamento Estratégico, OKRs Globais e Diretrizes Corporativas) e orientam todas as simulações.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => handleOpenUploadModal("transversal")}
                  className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold flex items-center gap-2 transition-colors cursor-pointer"
                >
                  <Upload className="h-3.5 w-3.5" />
                  <span>Subir Documento Transversal</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {transversalDocuments.map((doc) => {
                  const cat = CATEGORY_META[doc.category];
                  const CatIcon = cat.icon;
                  return (
                    <div
                      key={doc.id}
                      className={cn(
                        "rounded-2xl border p-5 transition-all flex flex-col justify-between gap-4",
                        doc.enabled
                          ? "bg-slate-50/50 border-slate-200/90"
                          : "bg-slate-50/30 border-slate-200/50 opacity-60"
                      )}
                    >
                      <div className="space-y-3">
                        <div className="flex items-start justify-between gap-3">
                          <span
                            className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${cat.badgeClass}`}
                          >
                            <CatIcon className="h-3 w-3" />
                            <span>{cat.label}</span>
                          </span>

                          <div className="flex items-center gap-1.5">
                            <button
                              type="button"
                              onClick={() => toggleActiveDocument(doc.id)}
                              className={cn(
                                "px-2.5 py-1 rounded-lg text-[10px] font-bold border transition-colors cursor-pointer",
                                doc.enabled
                                  ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                  : "bg-slate-100 text-slate-500 border-slate-200"
                              )}
                            >
                              {doc.enabled ? "Vigente" : "Inativo"}
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                removeActiveDocument(doc.id);
                                toast.info("Documento transversal removido.");
                              }}
                              className="p-1 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                              title="Remover documento"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </div>

                        <div>
                          <h3 className="text-sm font-bold text-slate-900 leading-snug">
                            {doc.title}
                          </h3>
                          <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                            {doc.summary}
                          </p>
                        </div>

                        {doc.extractedRules.length > 0 && (
                          <div className="rounded-xl bg-white border border-slate-200/80 p-3 space-y-1.5">
                            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                              Diretrizes Globais Extraídas
                            </div>
                            {doc.extractedRules.slice(0, 2).map((rule, rIdx) => (
                              <div
                                key={rIdx}
                                className="flex items-start gap-1.5 text-[11px] text-slate-700"
                              >
                                <Check className="h-3 w-3 text-emerald-600 shrink-0 mt-0.5" />
                                <span className="line-clamp-2">{rule}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      <div className="pt-3 border-t border-slate-200/60 flex items-center justify-between text-[11px] text-slate-400">
                        <span>
                          {doc.fileType} · {doc.fileSize} · {doc.sourceOrg}
                        </span>
                        <span className="font-semibold text-blue-600">
                          Escopo: Toda a Empresa
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* BLOCO 2: GRID DE PERFIS E AGENTES POR ÁREA */}
            <section className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2 px-1">
                <div>
                  <h2 className="text-lg font-bold text-slate-900">
                    Agentes Especialistas & Contexto por Área
                  </h2>
                  <p className="text-xs text-slate-500">
                    Gere agentes para as áreas que ainda não possuem ou clique em uma área para gerenciar suas documentações específicas.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {areaProfiles.map((area) => {
                  const areaDocsCount = activeDocuments.filter(
                    (d) =>
                      d.enabled &&
                      (d.areaId === area.id ||
                        (d.areaId !== "transversal" &&
                          d.relatedAreas.includes(area.shortArea)))
                  ).length;
                  const isGeneratingThis = generatingAreaId === area.id;

                  return (
                    <div
                      key={area.id}
                      className="bg-white rounded-2xl border border-slate-200/90 hover:border-slate-300 p-5 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between gap-5"
                    >
                      <div className="space-y-4">
                        {/* Topo do Card da Área */}
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-center gap-3 min-w-0">
                            <div
                              className="w-11 h-11 rounded-xl text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-2xs"
                              style={{ backgroundColor: area.avatarColor }}
                            >
                              {area.avatarInitials}
                            </div>
                            <div className="min-w-0">
                              <h3 className="text-sm font-bold text-slate-900 truncate">
                                {area.shortArea}
                              </h3>
                              <p className="text-[11px] text-slate-500 truncate">
                                {area.hasAgentGenerated
                                  ? area.agentName
                                  : "Sem agente gerado"}
                              </p>
                            </div>
                          </div>

                          <span
                            className={cn(
                              "px-2.5 py-0.5 rounded-full text-[10px] font-bold border shrink-0",
                              area.hasAgentGenerated
                                ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                : "bg-amber-50 text-amber-800 border-amber-200"
                            )}
                          >
                            {area.hasAgentGenerated ? "Agente Ativo" : "Pendente"}
                          </span>
                        </div>

                        <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                          {area.description}
                        </p>

                        {/* Métricas de Contexto da Área */}
                        <div className="grid grid-cols-3 gap-2 pt-1">
                          <div className="rounded-xl bg-slate-50 border border-slate-100 p-2.5 text-center">
                            <div className="text-sm font-bold text-slate-900">
                              {area.mappedProcesses.length}
                            </div>
                            <div className="text-[10px] text-slate-500">Processos</div>
                          </div>
                          <div className="rounded-xl bg-slate-50 border border-slate-100 p-2.5 text-center">
                            <div className="text-sm font-bold text-slate-900">
                              {area.businessRules.length}
                            </div>
                            <div className="text-[10px] text-slate-500">Regras</div>
                          </div>
                          <div className="rounded-xl bg-slate-50 border border-slate-100 p-2.5 text-center">
                            <div className="text-sm font-bold text-emerald-700">
                              {areaDocsCount}
                            </div>
                            <div className="text-[10px] text-slate-500">Docs Área</div>
                          </div>
                        </div>
                      </div>

                      {/* Ações do Card da Área (Sem botão de Tirar Dúvidas) */}
                      <div className="pt-3 border-t border-slate-100 flex items-center gap-2">
                        {!area.hasAgentGenerated ? (
                          <>
                            <button
                              type="button"
                              disabled={isGeneratingThis}
                              onClick={() => handleGenerateOrUpdateAgent(area.id)}
                              className="flex-1 py-2 px-3 rounded-xl bg-[#ea580c] hover:bg-[#c2410c] disabled:opacity-50 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
                            >
                              {isGeneratingThis ? (
                                <>
                                  <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                                  <span>Gerando...</span>
                                </>
                              ) : (
                                <>
                                  <Sparkles className="h-3.5 w-3.5" />
                                  <span>Gerar Agente</span>
                                </>
                              )}
                            </button>
                            <button
                              type="button"
                              onClick={() => setSelectedAreaProfileId(area.id)}
                              className="py-2 px-3 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-semibold text-slate-700 transition-colors cursor-pointer"
                            >
                              Ver Área
                            </button>
                          </>
                        ) : (
                          <button
                            type="button"
                            onClick={() => setSelectedAreaProfileId(area.id)}
                            className="w-full py-2 px-3 rounded-xl bg-slate-50 hover:bg-slate-900 text-slate-700 hover:text-white border border-slate-200/90 hover:border-slate-900 text-xs font-bold flex items-center justify-between transition-all cursor-pointer group"
                          >
                            <span>Configurar Agente & Documentos</span>
                            <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* BLOCO 3: CONECTORES PASSIVOS DA PLATAFORMA (RESUMO COMPACTO) */}
            <section className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-2xs space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    Fontes Estruturadas da Plataforma (Contexto Passivo)
                  </h3>
                  <p className="text-xs text-slate-500">
                    Bases de processos, regras, indicadores e matriz RACI conectadas nativamente aos agentes.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
                {passiveSources.map((src) => (
                  <button
                    key={src.id}
                    type="button"
                    onClick={() => togglePassiveSource(src.id)}
                    className={cn(
                      "text-left p-3.5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between gap-3",
                      src.enabled
                        ? "bg-slate-50/70 border-slate-200/90 hover:border-slate-300"
                        : "bg-slate-50/30 border-slate-200/50 opacity-55"
                    )}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-500" />
                      <span
                        className={cn(
                          "px-2 py-0.5 rounded text-[10px] font-bold",
                          src.enabled
                            ? "bg-emerald-50 text-emerald-700"
                            : "bg-slate-200 text-slate-600"
                        )}
                      >
                        {src.enabled ? "Sincronizado" : "Pausado"}
                      </span>
                    </div>
                    <div className="text-xs font-bold text-slate-900 leading-snug">
                      {src.title}
                    </div>
                  </button>
                ))}
              </div>
            </section>
          </div>
        ) : (
          /* ===================================================================
              2B. VISÃO DETALHADA DE UMA ÁREA ESPECÍFICA
          =================================================================== */
          <div className="space-y-6">
            {/* Barra de Retorno para Visão Macro + Resumo da Área */}
            <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-2xs flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-4 min-w-0">
                <div
                  className="w-14 h-14 rounded-2xl text-white font-bold text-base flex items-center justify-center shrink-0 shadow-sm"
                  style={{ backgroundColor: selectedArea.avatarColor }}
                >
                  {selectedArea.avatarInitials}
                </div>
                <div className="space-y-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <button
                      type="button"
                      onClick={() => setSelectedAreaProfileId(null)}
                      className="text-xs font-semibold text-slate-500 hover:text-slate-900 flex items-center gap-1 cursor-pointer"
                    >
                      <ArrowLeft className="h-3 w-3" />
                      <span>Visão Macro</span>
                    </button>
                    <span className="text-slate-300">/</span>
                    <span
                      className={cn(
                        "px-2.5 py-0.5 rounded-full text-[10px] font-bold border",
                        selectedArea.hasAgentGenerated
                          ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                          : "bg-amber-50 text-amber-800 border-amber-200"
                      )}
                    >
                      {selectedArea.hasAgentGenerated
                        ? "Agente Especialista Ativo"
                        : "Agente Pendente de Geração"}
                    </span>
                  </div>
                  <h2 className="text-lg font-bold text-slate-900 truncate">
                    {selectedArea.areaName}
                  </h2>
                  <p className="text-xs text-slate-500">{selectedArea.description}</p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => handleOpenUploadModal(selectedArea.id)}
                className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-[#ea580c] text-white text-xs font-bold flex items-center gap-2 transition-colors cursor-pointer shrink-0"
              >
                <Upload className="h-3.5 w-3.5" />
                <span>Subir Documento para {selectedArea.shortArea}</span>
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* COLUNA ESQUERDA (5 cols): AGENTE DA ÁREA & BASE PROCESSUAL */}
              <div className="lg:col-span-5 space-y-6">
                {/* Card de Configuração do Agente */}
                <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-2xs space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                      Agente Especialista da Área
                    </span>
                    <Bot className="h-4 w-4 text-slate-400" />
                  </div>

                  {selectedArea.hasAgentGenerated ? (
                    <div className="space-y-4">
                      <div className="rounded-2xl bg-slate-50 border border-slate-200/80 p-4 space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="text-sm font-bold text-slate-900">
                            {selectedArea.agentName}
                          </div>
                          <span className="text-[10px] text-emerald-700 font-semibold">
                            Sincronizado: {selectedArea.lastTrainedAt}
                          </span>
                        </div>
                        <div className="text-xs text-slate-500 font-medium">
                          {selectedArea.agentRole}
                        </div>
                        <p className="text-xs text-slate-600 leading-relaxed pt-1 border-t border-slate-200/60">
                          {selectedArea.agentPersona}
                        </p>
                      </div>

                      <div className="space-y-2">
                        <label className="block text-[11px] font-semibold text-slate-600">
                          Recalibrar diretriz ou foco do agente (opcional):
                        </label>
                        <textarea
                          rows={2}
                          value={customPersonaInput}
                          onChange={(e) => setCustomPersonaInput(e.target.value)}
                          placeholder={`Ex: Priorizar conformidade estrita na análise de documentos de ${selectedArea.shortArea}...`}
                          className="w-full rounded-xl border border-slate-200 p-3 text-xs text-slate-800 focus:outline-none focus:border-slate-400"
                        />
                        <button
                          type="button"
                          disabled={generatingAreaId === selectedArea.id}
                          onClick={() =>
                            handleGenerateOrUpdateAgent(
                              selectedArea.id,
                              customPersonaInput
                            )
                          }
                          className="w-full py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer"
                        >
                          <RefreshCw
                            className={cn(
                              "h-3.5 w-3.5",
                              generatingAreaId === selectedArea.id && "animate-spin"
                            )}
                          />
                          <span>
                            {generatingAreaId === selectedArea.id
                              ? "Sincronizando Agente..."
                              : "Atualizar & Ressincronizar Agente"}
                          </span>
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="rounded-2xl bg-amber-50/50 border border-amber-200 p-5 space-y-4">
                      <div className="space-y-1">
                        <h3 className="text-sm font-bold text-slate-900">
                          Esta área ainda não possui agente gerado
                        </h3>
                        <p className="text-xs text-slate-600 leading-relaxed">
                          Gere o agente especialista (<strong>{selectedArea.agentName}</strong>) para que ele indexe os{" "}
                          {selectedArea.mappedProcesses.length} processos,{" "}
                          {selectedArea.businessRules.length} regras de negócio e as documentações de{" "}
                          {selectedArea.shortArea}.
                        </p>
                      </div>

                      <textarea
                        rows={2}
                        value={customPersonaInput}
                        onChange={(e) => setCustomPersonaInput(e.target.value)}
                        placeholder="Instruções adicionais de comportamento para este agente (opcional)..."
                        className="w-full rounded-xl bg-white border border-amber-200 p-3 text-xs text-slate-800 focus:outline-none"
                      />

                      <button
                        type="button"
                        disabled={generatingAreaId === selectedArea.id}
                        onClick={() =>
                          handleGenerateOrUpdateAgent(
                            selectedArea.id,
                            customPersonaInput
                          )
                        }
                        className="w-full py-2.5 px-4 rounded-xl bg-[#ea580c] hover:bg-[#c2410c] text-white text-xs font-bold flex items-center justify-center gap-2 shadow-sm transition-colors cursor-pointer"
                      >
                        <Sparkles className="h-4 w-4" />
                        <span>
                          {generatingAreaId === selectedArea.id
                            ? "Gerando Agente..."
                            : `Gerar Agente de ${selectedArea.shortArea}`}
                        </span>
                      </button>
                    </div>
                  )}
                </div>

                {/* Processos e Regras Mapeados na Área */}
                <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-2xs space-y-4">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    Processos & Regras Vinculados à Área
                  </div>

                  <div className="space-y-2">
                    {selectedArea.mappedProcesses.map((proc) => (
                      <div
                        key={proc.code}
                        className="rounded-xl bg-slate-50 border border-slate-100 p-3 flex items-center justify-between gap-2 text-xs"
                      >
                        <div>
                          <span className="font-bold text-slate-900">
                            {proc.code}
                          </span>{" "}
                          <span className="text-slate-600">· {proc.name}</span>
                        </div>
                        <span className="px-2 py-0.5 rounded bg-white border border-slate-200 text-[10px] font-semibold text-slate-500 shrink-0">
                          {proc.level}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="pt-2 border-t border-slate-100 space-y-2">
                    {selectedArea.businessRules.map((rn) => (
                      <div
                        key={rn.code}
                        className="rounded-xl bg-slate-50/70 border border-slate-100 p-3 text-xs space-y-0.5"
                      >
                        <div className="font-bold text-[#ea580c]">{rn.code}</div>
                        <div className="text-slate-600 leading-relaxed">
                          {rn.summary}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* COLUNA DIREITA (7 cols): DOCUMENTAÇÕES ESPECÍFICAS DA ÁREA */}
              <div className="lg:col-span-7 space-y-4">
                <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-2xs space-y-5">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <h3 className="text-base font-bold text-slate-900">
                        Documentações Vigentes de {selectedArea.shortArea}
                      </h3>
                      <p className="text-xs text-slate-500">
                        Arquivos, políticas e normas exclusivos desta área (além dos{" "}
                        {transversalDocuments.filter((d) => d.enabled).length} documentos transversais globais).
                      </p>
                    </div>

                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-700">
                      {areaSpecificDocuments.length} documento(s)
                    </span>
                  </div>

                  {areaSpecificDocuments.length === 0 ? (
                    <div className="rounded-2xl border border-dashed border-slate-200 p-8 text-center space-y-3">
                      <FileText className="h-7 w-7 text-slate-300 mx-auto" />
                      <div className="space-y-1">
                        <div className="text-sm font-bold text-slate-700">
                          Nenhuma documentação exclusiva cadastrada nesta área
                        </div>
                        <p className="text-xs text-slate-400">
                          Suba manuais, políticas ou regulamentos específicos de{" "}
                          {selectedArea.shortArea}.
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleOpenUploadModal(selectedArea.id)}
                        className="px-4 py-2 rounded-xl bg-[#ea580c] text-white text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer"
                      >
                        <Upload className="h-3.5 w-3.5" />
                        <span>Subir Primeiro Documento</span>
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-3.5">
                      {areaSpecificDocuments.map((doc) => {
                        const cat = CATEGORY_META[doc.category];
                        const CatIcon = cat.icon;
                        return (
                          <div
                            key={doc.id}
                            className={cn(
                              "rounded-2xl border p-5 transition-all space-y-3",
                              doc.enabled
                                ? "bg-slate-50/40 border-slate-200"
                                : "bg-slate-50/20 border-slate-200/50 opacity-60"
                            )}
                          >
                            <div className="flex flex-wrap items-start justify-between gap-2">
                              <span
                                className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${cat.badgeClass}`}
                              >
                                <CatIcon className="h-3 w-3" />
                                <span>{cat.label}</span>
                              </span>

                              <div className="flex items-center gap-1.5">
                                <button
                                  type="button"
                                  onClick={() => toggleActiveDocument(doc.id)}
                                  className={cn(
                                    "px-2.5 py-1 rounded-lg text-[10px] font-bold border cursor-pointer",
                                    doc.enabled
                                      ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                      : "bg-slate-100 text-slate-500 border-slate-200"
                                  )}
                                >
                                  {doc.enabled ? "Vigente" : "Pausado"}
                                </button>
                                <button
                                  type="button"
                                  onClick={() => {
                                    removeActiveDocument(doc.id);
                                    toast.info("Documento removido da área.");
                                  }}
                                  className="p-1 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 cursor-pointer"
                                >
                                  <Trash2 className="h-3.5 w-3.5" />
                                </button>
                              </div>
                            </div>

                            <div>
                              <h4 className="text-sm font-bold text-slate-900">
                                {doc.title}
                              </h4>
                              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                                {doc.summary}
                              </p>
                            </div>

                            {doc.extractedRules.length > 0 && (
                              <div className="rounded-xl bg-white border border-slate-200/80 p-3 space-y-1.5">
                                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                                  Regras Indexadas no Agente
                                </div>
                                {doc.extractedRules.map((rule, rIdx) => (
                                  <div
                                    key={rIdx}
                                    className="flex items-start gap-1.5 text-[11px] text-slate-700"
                                  >
                                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0 mt-0.5" />
                                    <span>{rule}</span>
                                  </div>
                                ))}
                              </div>
                            )}

                            <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between text-[11px] text-slate-400">
                              <span>
                                {doc.fileName} ({doc.fileSize})
                              </span>
                              <span>Atualizado em {doc.uploadedAt}</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* =====================================================================
          MODAL: SUBIR NOVA DOCUMENTAÇÃO (TRANSVERSAL OU VINCULADA A UMA ÁREA)
      ===================================================================== */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="max-w-xl w-full bg-white rounded-3xl border border-slate-200 p-6 sm:p-7 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between">
              <div>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-orange-50 text-[#ea580c]">
                  Base de Conhecimento & Contexto
                </span>
                <h3 className="text-lg font-bold text-slate-900 mt-1">
                  Subir Nova Documentação
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="w-8 h-8 rounded-lg hover:bg-slate-100 flex items-center justify-center text-slate-500 cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleCreateDocument} className="space-y-4">
              {/* Seleção de Escopo: Transversal vs Área Específica */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700">
                  Escopo da Documentação (Geral/Transversal ou por Área)
                </label>
                <select
                  value={targetUploadScope}
                  onChange={(e) => setTargetUploadScope(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3.5 py-2.5 text-xs font-semibold text-slate-800 focus:outline-none focus:bg-white focus:border-[#ea580c]"
                >
                  <option value="transversal">
                    🌐 Transversal / Corporativo (Toda a Empresa — ex: Planejamento Estratégico)
                  </option>
                  {areaProfiles.map((area) => (
                    <option key={area.id} value={area.id}>
                      🏢 Área Específica: {area.shortArea} ({area.agentName})
                    </option>
                  ))}
                </select>
              </div>

              {/* Upload de Arquivo */}
              <div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.docx,.xlsx,.txt"
                  onChange={handleFileUploadChange}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full rounded-2xl border-2 border-dashed border-slate-300 hover:border-[#ea580c] bg-slate-50/60 hover:bg-orange-50/20 p-4 text-center transition-colors cursor-pointer space-y-1"
                >
                  <Upload className="h-5 w-5 text-[#ea580c] mx-auto" />
                  <div className="text-xs font-bold text-slate-700">
                    {newFileName
                      ? `Arquivo selecionado: ${newFileName} (${newFileSize})`
                      : "Clique para selecionar um arquivo (PDF, DOCX, XLSX)"}
                  </div>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-slate-700">
                    Título do Documento
                  </label>
                  <input
                    type="text"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="Ex: Planejamento Estratégico 2027"
                    className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-[#ea580c]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-slate-700">
                    Categoria
                  </label>
                  <select
                    value={newCategory}
                    onChange={(e) =>
                      setNewCategory(e.target.value as ContextCategory)
                    }
                    className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-[#ea580c]"
                  >
                    <option value="estrategico">
                      Planejamento Estratégico & OKRs
                    </option>
                    <option value="politica">
                      Políticas, Manuais & Governança
                    </option>
                    <option value="regulatorio">
                      Normas Regulatórias & Leis
                    </option>
                    <option value="consulta">
                      Estudos Técnicos & Benchmarks
                    </option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-semibold text-slate-700">
                  Resumo / Objetivo do Documento
                </label>
                <textarea
                  rows={2}
                  value={newSummary}
                  onChange={(e) => setNewSummary(e.target.value)}
                  placeholder="Descreva brevemente o conteúdo deste documento..."
                  className="w-full rounded-xl border border-slate-300 p-3 text-xs text-slate-800 focus:outline-none focus:border-[#ea580c]"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-semibold text-slate-700">
                  Diretrizes ou Regras Extraídas (1 por linha, opcional)
                </label>
                <textarea
                  rows={2}
                  value={newRulesText}
                  onChange={(e) => setNewRulesText(e.target.value)}
                  placeholder="Ex: Meta de redução de churn em 15% no ano..."
                  className="w-full rounded-xl border border-slate-300 p-3 text-xs text-slate-800 focus:outline-none focus:border-[#ea580c]"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#ea580c] hover:bg-[#c2410c] text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                >
                  <Check className="h-3.5 w-3.5" />
                  <span>Salvar Documentação</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
