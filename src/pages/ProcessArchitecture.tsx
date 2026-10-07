import { useState } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import {
  ChevronLeft, Layers, Network, Home, Share2, Activity,
  ShieldCheck, Folder, Settings, RefreshCw, ChevronDown, LogOut, Zap
} from "lucide-react";
import contextusLogo from "@/assets/contextus-logo.png";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useLanguage } from "@/contexts/LanguageContext";
import { ValueChainOnboarding } from "@/components/architecture/ValueChainOnboarding";
import { ArchitectureCanvas } from "@/components/architecture/ArchitectureCanvas";
import { ArchitectureHeader } from "@/components/architecture/ArchitectureHeader";
import {
  useValueChainStore,
  generateAIValueChainForCompany,
} from "@/stores/valueChainStore";
import { useJourneyStore } from "@/stores/journeyStore";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface ProcessArchitectureProps {
  onLogout?: () => void;
  isClientDemo?: boolean;
}

export function ProcessArchitecture({ onLogout, isClientDemo }: ProcessArchitectureProps) {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { language, setLanguage } = useLanguage();
  const pt = language === "PT";
  const { l1Processes, isFirstAccess, setFirstAccessComplete, setL1Processes } =
    useValueChainStore();

  const handleCreateFromScratch = () => {
    setFirstAccessComplete();
    toast.success(
      pt
        ? "Comece a criar sua cadeia de valor!"
        : "Start creating your value chain!"
    );
  };

  const handleGenerateWithAI = (companyName: string) => {
    const generatedProcesses = generateAIValueChainForCompany(companyName);
    setL1Processes(generatedProcesses);
    toast.success(
      pt
        ? `Cadeia de valor gerada para "${companyName}"!`
        : `Value chain generated for "${companyName}"!`
    );
  };

  const handleAIGeneration = (
    option: "full" | "existing" | "new",
    targetL1Id?: string,
    newE2EName?: string
  ) => {
    const { addL1, updateL1 } = useValueChainStore.getState();

    if (option === "full") {
      const generatedProcesses = generateAIValueChainForCompany("Company");
      setL1Processes(generatedProcesses);
      toast.success(
        pt
          ? "Cadeia de valor completa gerada!"
          : "Full value chain generated!"
      );
    } else if (option === "existing" && targetL1Id) {
      const existingL1 = l1Processes.find((l1) => l1.id === targetL1Id);
      if (existingL1) {
        const sampleL2s = [
          { id: `l2-${Date.now()}-1`, name: "Process Planning", l3Processes: [] },
          { id: `l2-${Date.now()}-2`, name: "Execution & Control", l3Processes: [] },
          { id: `l2-${Date.now()}-3`, name: "Review & Improvement", l3Processes: [] },
        ];
        updateL1(targetL1Id, { l2Processes: sampleL2s });
        toast.success(
          pt ? "E2E regenerado com sucesso!" : "E2E regenerated!"
        );
      }
    } else if (option === "new" && newE2EName) {
      const sampleL2s = [
        { id: `l2-${Date.now()}-1`, name: `${newE2EName} - Planning`, l3Processes: [] },
        { id: `l2-${Date.now()}-2`, name: `${newE2EName} - Execution`, l3Processes: [] },
        { id: `l2-${Date.now()}-3`, name: `${newE2EName} - Control`, l3Processes: [] },
      ];
      addL1({
        nameEN: newE2EName,
        namePT: newE2EName,
        category: "PRIMARY",
        description: `AI-generated E2E: ${newE2EName}`,
      });
      const newL1 = useValueChainStore
        .getState()
        .l1Processes.find((l1) => l1.nameEN === newE2EName);
      if (newL1) updateL1(newL1.id, { l2Processes: sampleL2s });
      toast.success(
        pt
          ? `Novo E2E "${newE2EName}" criado!`
          : `New E2E "${newE2EName}" created!`
      );
    }
  };

  const showOnboarding = isFirstAccess && l1Processes.length === 0;

  // Exibir header global apenas na tela inicial de arquitetura (ocultando em subtelas de L1, L2, L3, L4, processo ou detalhe de jornada)
  const isSubScreen = Boolean(
    searchParams.get("l1") ||
    searchParams.get("l2") ||
    searchParams.get("l3") ||
    searchParams.get("l4") ||
    searchParams.get("processId")
  );
  const showHeader = !showOnboarding && !isSubScreen;

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      {/* 1. BARRA LATERAL ESQUERDA (NAVIGATION RAIL) */}
      <aside className="w-[72px] shrink-0 bg-white border-r border-[#e5e7eb] flex flex-col justify-between py-4 fixed inset-y-0 left-0 z-30 select-none">
        <div className="flex flex-col items-center gap-4">
          {/* Início */}
          <button
            onClick={() => navigate("/")}
            className="group flex flex-col items-center justify-center py-1 text-slate-500 hover:text-slate-900 transition-colors"
            title="Início"
          >
            <div className="w-10 h-9 flex items-center justify-center">
              <Home className="h-5 w-5 text-slate-500 group-hover:text-slate-900 transition-colors" />
            </div>
            <span className="text-[10px] text-slate-500 group-hover:text-slate-900">Início</span>
          </button>

          {/* Processos */}
          <button
            onClick={() => navigate("/processes")}
            className="group flex flex-col items-center justify-center py-1 text-slate-500 hover:text-slate-900 transition-colors"
            title="Processos"
          >
            <div className="w-10 h-9 flex items-center justify-center">
              <Share2 className="h-5 w-5 text-slate-500 group-hover:text-slate-900 transition-colors" />
            </div>
            <span className="text-[10px] text-slate-500 group-hover:text-slate-900">Processos</span>
          </button>

          {/* Análises */}
          <button
            onClick={() => navigate("/process-analysis")}
            className="group flex flex-col items-center justify-center py-1 text-slate-500 hover:text-slate-900 transition-colors"
            title="Análises"
          >
            <div className="w-10 h-9 flex items-center justify-center">
              <Activity className="h-5 w-5 text-slate-500 group-hover:text-slate-900 transition-colors" />
            </div>
            <span className="text-[10px] text-slate-500 group-hover:text-slate-900">Análises</span>
          </button>

          {/* Arquitetura (Ativo) */}
          <button
            onClick={() => navigate("/architecture")}
            className="group flex flex-col items-center justify-center"
            title="Arquitetura"
          >
            <div className="w-12 h-11 rounded-xl border border-[#ea580c] bg-orange-50/40 flex items-center justify-center transition-all group-hover:bg-orange-50">
              <Network className="h-5 w-5 text-[#ea580c]" />
            </div>
            <span className="text-[10px] font-medium text-[#ea580c] mt-1">Arquitetura</span>
          </button>

          {/* Normativos */}
          <button
            onClick={() => navigate("/normatives")}
            className="group flex flex-col items-center justify-center py-1 text-slate-500 hover:text-slate-900 transition-colors"
            title="Normativos"
          >
            <div className="w-10 h-9 flex items-center justify-center">
              <ShieldCheck className="h-5 w-5 text-slate-500 group-hover:text-slate-900 transition-colors" />
            </div>
            <span className="text-[10px] text-slate-500 group-hover:text-slate-900">Normativos</span>
          </button>

          {/* Pastas ONEDRIVE */}
          <button
            onClick={() => { }}
            className="group flex flex-col items-center justify-center py-1 text-slate-400 hover:text-slate-700 transition-colors"
            title="Pastas ONEDRIVE"
          >
            <div className="w-10 h-9 flex items-center justify-center">
              <Folder className="h-5 w-5 text-slate-400 group-hover:text-slate-700 transition-colors" />
            </div>
            <span className="text-[9px] text-slate-400 leading-none">Pastas</span>
            <span className="text-[8px] font-bold text-[#ea580c] leading-tight tracking-tighter">ONEDRIVE</span>
          </button>
        </div>

        {/* Ajustes no rodapé da barra lateral */}
        <div className="flex flex-col items-center">
          <button
            onClick={() => navigate("/settings")}
            className="group flex flex-col items-center justify-center py-1 text-slate-500 hover:text-slate-900 transition-colors"
            title="Ajustes"
          >
            <div className="w-10 h-9 flex items-center justify-center">
              <Settings className="h-5 w-5 text-slate-500 group-hover:text-slate-900 transition-colors" />
            </div>
            <span className="text-[10px] text-slate-500 group-hover:text-slate-900">Ajustes</span>
          </button>
        </div>
      </aside>

      {/* ÁREA PRINCIPAL COM HEADER E CONTEÚDO */}
      <div className="ml-[72px] flex flex-col min-h-screen w-[calc(100%-72px)]">
        {/* CABEÇALHO SUPERIOR */}
        <header className="h-16 bg-white border-b border-[#e5e7eb] px-8 flex items-center justify-between sticky top-0 z-20">
          {/* Esquerda: Logo + Base de Conhecimento + Idioma */}
          <div className="flex items-center gap-6">
            <div className="flex flex-col">
              <img
                src={contextusLogo}
                alt="Contextus"
                className="h-6 w-auto cursor-pointer"
                onClick={() => navigate("/")}
              />
              <span className="text-[9px] font-medium text-slate-400 tracking-wider">v1.0.21</span>
            </div>

            <button
              onClick={() => navigate("/academy")}
              className="hidden sm:flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3.5 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors shadow-2xs"
            >
              <span>Base de Conhecimento</span>
              <RefreshCw className="h-3 w-3 text-slate-400" />
            </button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors shadow-2xs">
                  <span>{language === "PT" ? "Português" : "English"}</span>
                  <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-32 bg-white">
                <DropdownMenuItem
                  onClick={() => setLanguage("PT")}
                  className={`text-xs cursor-pointer ${language === "PT" ? "font-semibold text-[#ea580c]" : ""}`}
                >
                  Português
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setLanguage("EN")}
                  className={`text-xs cursor-pointer ${language === "EN" ? "font-semibold text-[#ea580c]" : ""}`}
                >
                  English
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Direita: Token Badge + Perfil Jesse Feitosa */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5 bg-[#fff7ed] border border-[#ffedd5] text-[#ea580c] rounded-full px-3.5 py-1 text-xs font-semibold shadow-2xs">
              <Zap className="h-3.5 w-3.5 fill-[#ea580c]" />
              <span>73,7</span>
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-3 rounded-full hover:bg-slate-50 p-1 pr-2 transition-colors focus:outline-none">
                  <div className="w-8 h-8 rounded-full overflow-hidden shrink-0 border border-slate-200 shadow-2xs">
                    <svg className="w-full h-full" viewBox="0 0 36 36">
                      <polygon points="0,0 18,0 18,18 0,18" fill="#06b6d4" />
                      <polygon points="18,0 36,0 36,18 18,18" fill="#f43f5e" />
                      <polygon points="0,18 18,18 18,36 0,36" fill="#f59e0b" />
                      <polygon points="18,18 36,18 36,36 18,36" fill="#8b5cf6" />
                      <polygon points="9,9 27,9 27,27 9,27" fill="#ec4899" opacity="0.65" />
                      <polygon points="0,9 18,27 36,9" fill="#3b82f6" opacity="0.5" />
                    </svg>
                  </div>
                  <div className="text-left hidden md:block">
                    <div className="text-xs font-semibold text-slate-800 leading-tight">Jesse Feitosa</div>
                    <div className="text-[11px] text-slate-400 leading-tight">jesse.feitosa@elogroup.com.br</div>
                  </div>
                  <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 bg-white border border-slate-200 shadow-lg">
                <div className="px-3 py-2 border-b border-slate-100">
                  <p className="text-xs font-semibold text-slate-800">Jesse Feitosa</p>
                  <p className="text-[11px] text-slate-400">jesse.feitosa@elogroup.com.br</p>
                </div>
                <DropdownMenuItem onClick={() => navigate("/settings")} className="gap-2.5 py-2 cursor-pointer text-xs">
                  <Settings className="h-4 w-4 text-slate-400" />
                  <span>Configurações</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={onLogout} className="gap-2.5 py-2 cursor-pointer text-xs text-red-600 focus:text-red-600">
                  <LogOut className="h-4 w-4" />
                  <span>Sair da conta</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* ── BREADCRUMBS ──────────────────────────────────────────── */}
        <div className="px-8 pt-6 flex items-center text-xs text-[#A5A7B0]">
          <Link to="/" className="flex items-center hover:text-[#F97316] transition-colors gap-1 font-medium bg-white border border-slate-200 px-2 py-1.5 rounded-md shadow-sm">
            <ChevronLeft className="h-3 w-3" />
          </Link>
          <span className="mx-3 text-slate-300">|</span>
          <Link to="/" className="hover:text-slate-600 transition-colors">Início</Link>
          <span className="mx-2">/</span>
          <span className="font-semibold text-slate-700">Arquitetura de Processos</span>
        </div>

        <main className="flex-1 px-8 pb-8 pt-4">
          <div className="w-full mx-auto">
            {/* ── View Toggle & Header (apenas na tela inicial de arquitetura) ────────────────── */}
            {showHeader && (
              <ArchitectureHeader
                isClientDemo={isClientDemo}
                onImportBpmn={() => toast.info(pt ? "Funcionalidade de importação BPMN em breve." : "BPMN import coming soon.")}
                onGenerateAI={() => handleAIGeneration("full")}
                onCreate={() => toast.info(pt ? "Modal de criação L1" : "L1 creation modal")}
              />
            )}

            {/* ── Content ──────────────────────────────────────────── */}
            {showOnboarding ? (
              <ValueChainOnboarding
                onCreateFromScratch={handleCreateFromScratch}
                onGenerateWithAI={handleGenerateWithAI}
              />
            ) : (
              <ArchitectureCanvas onGenerateAI={handleAIGeneration} />
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
