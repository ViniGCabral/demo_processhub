import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  Star,
  ChevronDown,
  ChevronRight,
  ArrowRight,
  FileText,
  Home,
  Activity,
  Network,
  ShieldCheck,
  Settings,
  Folder,
  Share2,
  RefreshCw,
  LogOut,
  Zap,
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
import { useProcessStore } from "@/stores/processStore";

interface DashboardProps {
  onLogout: () => void;
}

interface RecentProcessItem {
  id: string;
  name: string;
  category: "FIN" | "H2R";
  timeAgo: string;
  targetId?: string;
}

export function Dashboard({ onLogout }: DashboardProps) {
  const navigate = useNavigate();
  const { language, setLanguage } = useLanguage();
  const processes = useProcessStore((state) => state.processes);

  const [searchQuery, setSearchQuery] = useState("");
  const [recentSearchQuery, setRecentSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<"Todos" | "FIN" | "H2R">("Todos");

  // Itens acessados recentemente conforme especificado no print de referência
  const initialRecentItems: RecentProcessItem[] = [
    {
      id: "rec-1",
      name: "Registor de conta bancária no SAP",
      category: "FIN",
      timeAgo: "Há 14 minutos",
      targetId: "demo-span-layer",
    },
    {
      id: "rec-2",
      name: "Teste",
      category: "FIN",
      timeAgo: "Há 19 minutos",
      targetId: "demo-span-layer",
    },
    {
      id: "rec-3",
      name: "Job Req Creation",
      category: "H2R",
      timeAgo: "Há 53 minutos",
      targetId: "demo-span-layer",
    },
    {
      id: "rec-4",
      name: "Job Req Creation (1)",
      category: "H2R",
      timeAgo: "Há 1 hora",
      targetId: "demo-span-layer",
    },
    {
      id: "rec-5",
      name: "Teste P66 Doc",
      category: "FIN",
      timeAgo: "Há 1 hora",
      targetId: "demo-span-layer",
    },
  ];

  // Filtra itens recentes por busca e categoria
  const filteredRecentItems = useMemo(() => {
    return initialRecentItems.filter((item) => {
      const matchesCategory =
        selectedCategory === "Todos" || item.category === selectedCategory;
      const matchesSearch =
        recentSearchQuery.trim() === "" ||
        item.name.toLowerCase().includes(recentSearchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, recentSearchQuery]);

  // Chips de sugestão abaixo da barra de busca principal
  const quickSearchSuggestions = [
    "Registor de conta bancária no SAP",
    "Teste",
    "Job Req Creation",
    "Job Req Creation (1)",
  ];

  const handleSelectRecent = (item: RecentProcessItem) => {
    const found = processes.find(
      (p) =>
        p.id === item.targetId ||
        p.name.toLowerCase() === item.name.toLowerCase()
    );
    if (found) {
      navigate(`/processes/${found.id}`);
    } else {
      navigate(`/processes/${item.targetId || "demo-span-layer"}`);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] flex">
      {/* 1. BARRA LATERAL ESQUERDA (NAVIGATION RAIL) */}
      <aside className="w-[72px] shrink-0 bg-white border-r border-[#e5e7eb] flex flex-col justify-between py-4 fixed inset-y-0 left-0 z-30 select-none">
        <div className="flex flex-col items-center gap-4">
          {/* Início (Ativo com borda laranja e destaque) */}
          <button
            onClick={() => navigate("/")}
            className="group flex flex-col items-center justify-center"
            title="Início"
          >
            <div className="w-12 h-11 rounded-xl border border-[#ea580c] bg-orange-50/40 flex items-center justify-center transition-all group-hover:bg-orange-50">
              <Home className="h-5 w-5 text-[#ea580c]" />
            </div>
            <span className="text-[10px] font-medium text-[#ea580c] mt-1">Início</span>
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

          {/* Arquitetura */}
          <button
            onClick={() => navigate("/architecture")}
            className="group flex flex-col items-center justify-center py-1 text-slate-500 hover:text-slate-900 transition-colors"
            title="Arquitetura"
          >
            <div className="w-10 h-9 flex items-center justify-center">
              <Network className="h-5 w-5 text-slate-500 group-hover:text-slate-900 transition-colors" />
            </div>
            <span className="text-[10px] text-slate-500 group-hover:text-slate-900">Arquitetura</span>
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
            onClick={() => {}}
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
      <div className="flex-1 ml-[72px] flex flex-col min-h-screen">
        {/* 2. CABEÇALHO SUPERIOR */}
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
            {/* Badge de Tokens: 73,7 */}
            <div className="flex items-center gap-1.5 bg-[#fff7ed] border border-[#ffedd5] text-[#ea580c] rounded-full px-3.5 py-1 text-xs font-semibold shadow-2xs">
              <Zap className="h-3.5 w-3.5 fill-[#ea580c]" />
              <span>73,7</span>
            </div>

            {/* Menu do Usuário: Vinicius Cabral */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-3 rounded-full hover:bg-slate-50 p-1 pr-2 transition-colors focus:outline-none">
                  {/* Avatar Geométrico Colorido */}
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
                    <div className="text-xs font-semibold text-slate-800 leading-tight">
                      Vinicius Cabral
                    </div>
                    <div className="text-[11px] text-slate-400 leading-tight">
                      vinicius.cabral@elogroup.com.br
                    </div>
                  </div>

                  <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 bg-white border border-slate-200 shadow-lg">
                <div className="px-3 py-2 border-b border-slate-100">
                  <p className="text-xs font-semibold text-slate-800">Vinicius Cabral</p>
                  <p className="text-[11px] text-slate-400">vinicius.cabral@elogroup.com.br</p>
                </div>
                <DropdownMenuItem
                  onClick={() => navigate("/settings")}
                  className="gap-2.5 py-2 cursor-pointer text-xs"
                >
                  <Settings className="h-4 w-4 text-slate-400" />
                  <span>Configurações</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={onLogout}
                  className="gap-2.5 py-2 cursor-pointer text-xs text-red-600 focus:text-red-600"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Sair</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* 3. CONTEÚDO PRINCIPAL */}
        <main className="flex-1 max-w-[1340px] w-full mx-auto px-6 py-8 sm:px-10 lg:py-10">
          {/* BARRA DE BUSCA CENTRAL COM CHIPS */}
          <div className="max-w-3xl mx-auto mb-10">
            <div className="relative">
              <Search className="h-4 w-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar processos, documentos, módulos e configurações..."
                className="w-full rounded-2xl border border-slate-200 bg-white py-3.5 pl-11 pr-16 text-sm text-slate-800 placeholder:text-slate-400 shadow-2xs focus:border-[#ea580c] focus:outline-none focus:ring-2 focus:ring-[#ea580c]/15 transition-all"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 rounded border border-slate-200 bg-slate-50 px-2 py-0.5 text-[11px] font-medium text-slate-400">
                ⌘ K
              </span>
            </div>

            {/* Chips de Sugestão */}
            <div className="flex flex-wrap items-center justify-center gap-2 mt-3.5">
              {quickSearchSuggestions.map((suggestion) => (
                <button
                  key={suggestion}
                  onClick={() => {
                    setSearchQuery(suggestion);
                    setRecentSearchQuery(suggestion);
                  }}
                  className="rounded-full border border-slate-200 bg-white px-3.5 py-1 text-xs text-slate-600 hover:bg-slate-50 hover:border-slate-300 transition-colors shadow-2xs"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>

          {/* 4. GRID DE 4 CARDS EM DESTAQUE */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
            {/* Card 1: Processos */}
            <div
              onClick={() => navigate("/processes")}
              className="group rounded-2xl border border-slate-200 bg-white p-4 shadow-2xs hover:shadow-md hover:border-orange-200 transition-all cursor-pointer flex flex-col justify-between"
            >
              <div>
                {/* Banner Ondulado Laranja/Pêssego */}
                <div className="relative h-20 w-full overflow-hidden rounded-xl bg-gradient-to-r from-[#ffedd5] via-[#fdecd5] to-[#fed7aa]/50 p-3.5">
                  <svg
                    className="pointer-events-none absolute inset-0 h-full w-full opacity-35"
                    viewBox="0 0 300 80"
                    preserveAspectRatio="none"
                    fill="none"
                  >
                    <path
                      d="M0 25 C70 5 130 45 200 20 C250 5 280 30 300 25 L300 80 L0 80 Z"
                      fill="#ea580c"
                      fillOpacity="0.18"
                    />
                    <path
                      d="M0 45 C60 25 140 60 210 35 C260 15 285 45 300 40 L300 80 L0 80 Z"
                      fill="#ea580c"
                      fillOpacity="0.12"
                    />
                  </svg>
                  {/* Ícone de Nós Conectados */}
                  <div className="relative z-10">
                    <Share2 className="h-6 w-6 text-[#ea580c]" strokeWidth={2.2} />
                  </div>
                </div>

                <h3 className="text-base font-semibold text-slate-800 group-hover:text-[#ea580c] transition-colors mt-4">
                  Processos
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed mt-1.5 mb-6">
                  Registre, documente e gerencie seus processos organizacionais com POP/SOP e BPMN
                </p>
              </div>

              <div className="flex items-center justify-between text-xs font-semibold text-[#ea580c] pt-2">
                <span>10 processos</span>
                <ArrowRight className="h-4 w-4 text-[#ea580c] transition-transform group-hover:translate-x-1" />
              </div>
            </div>

            {/* Card 2: Análise de Processos */}
            <div
              onClick={() => navigate("/process-analysis")}
              className="group rounded-2xl border border-slate-200 bg-white p-4 shadow-2xs hover:shadow-md hover:border-orange-200 transition-all cursor-pointer flex flex-col justify-between"
            >
              <div>
                {/* Banner Ondulado Laranja/Pêssego */}
                <div className="relative h-20 w-full overflow-hidden rounded-xl bg-gradient-to-r from-[#ffedd5] via-[#fdecd5] to-[#fed7aa]/50 p-3.5">
                  <svg
                    className="pointer-events-none absolute inset-0 h-full w-full opacity-35"
                    viewBox="0 0 300 80"
                    preserveAspectRatio="none"
                    fill="none"
                  >
                    <path
                      d="M0 25 C70 5 130 45 200 20 C250 5 280 30 300 25 L300 80 L0 80 Z"
                      fill="#ea580c"
                      fillOpacity="0.18"
                    />
                    <path
                      d="M0 45 C60 25 140 60 210 35 C260 15 285 45 300 40 L300 80 L0 80 Z"
                      fill="#ea580c"
                      fillOpacity="0.12"
                    />
                  </svg>
                  {/* Ícone de Pulso / Atividade */}
                  <div className="relative z-10">
                    <Activity className="h-6 w-6 text-[#ea580c]" strokeWidth={2.2} />
                  </div>
                </div>

                <h3 className="text-base font-semibold text-slate-800 group-hover:text-[#ea580c] transition-colors mt-4">
                  Análise de Processos
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed mt-1.5 mb-6">
                  Analise performance, identifique gargalos e otimize operações
                </p>
              </div>

              <div className="flex items-center justify-end text-xs font-semibold text-[#ea580c] pt-2">
                <ArrowRight className="h-4 w-4 text-[#ea580c] transition-transform group-hover:translate-x-1" />
              </div>
            </div>

            {/* Card 3: Arquitetura de Processos */}
            <div
              onClick={() => navigate("/architecture")}
              className="group rounded-2xl border border-slate-200 bg-white p-4 shadow-2xs hover:shadow-md hover:border-orange-200 transition-all cursor-pointer flex flex-col justify-between"
            >
              <div>
                {/* Banner Ondulado Laranja/Pêssego */}
                <div className="relative h-20 w-full overflow-hidden rounded-xl bg-gradient-to-r from-[#ffedd5] via-[#fdecd5] to-[#fed7aa]/50 p-3.5">
                  <svg
                    className="pointer-events-none absolute inset-0 h-full w-full opacity-35"
                    viewBox="0 0 300 80"
                    preserveAspectRatio="none"
                    fill="none"
                  >
                    <path
                      d="M0 25 C70 5 130 45 200 20 C250 5 280 30 300 25 L300 80 L0 80 Z"
                      fill="#ea580c"
                      fillOpacity="0.18"
                    />
                    <path
                      d="M0 45 C60 25 140 60 210 35 C260 15 285 45 300 40 L300 80 L0 80 Z"
                      fill="#ea580c"
                      fillOpacity="0.12"
                    />
                  </svg>
                  {/* Ícone de Hierarquia / Arquitetura */}
                  <div className="relative z-10">
                    <Network className="h-6 w-6 text-[#ea580c]" strokeWidth={2.2} />
                  </div>
                </div>

                <h3 className="text-base font-semibold text-slate-800 group-hover:text-[#ea580c] transition-colors mt-4">
                  Arquitetura de Processos
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed mt-1.5 mb-6">
                  Desenhe e visualize a arquitetura corporativa e cadeias de valor
                </p>
              </div>

              <div className="flex items-center justify-end text-xs font-semibold text-[#ea580c] pt-2">
                <ArrowRight className="h-4 w-4 text-[#ea580c] transition-transform group-hover:translate-x-1" />
              </div>
            </div>

            {/* Card 4: Gestão de Normativos */}
            <div
              onClick={() => navigate("/normatives")}
              className="group rounded-2xl border border-slate-200 bg-white p-4 shadow-2xs hover:shadow-md hover:border-orange-200 transition-all cursor-pointer flex flex-col justify-between"
            >
              <div>
                {/* Banner Ondulado Laranja/Pêssego */}
                <div className="relative h-20 w-full overflow-hidden rounded-xl bg-gradient-to-r from-[#ffedd5] via-[#fdecd5] to-[#fed7aa]/50 p-3.5">
                  <svg
                    className="pointer-events-none absolute inset-0 h-full w-full opacity-35"
                    viewBox="0 0 300 80"
                    preserveAspectRatio="none"
                    fill="none"
                  >
                    <path
                      d="M0 25 C70 5 130 45 200 20 C250 5 280 30 300 25 L300 80 L0 80 Z"
                      fill="#ea580c"
                      fillOpacity="0.18"
                    />
                    <path
                      d="M0 45 C60 25 140 60 210 35 C260 15 285 45 300 40 L300 80 L0 80 Z"
                      fill="#ea580c"
                      fillOpacity="0.12"
                    />
                  </svg>
                  {/* Ícone de Crachá / Documento Normativo */}
                  <div className="relative z-10">
                    <ShieldCheck className="h-6 w-6 text-[#ea580c]" strokeWidth={2.2} />
                  </div>
                </div>

                <h3 className="text-base font-semibold text-slate-800 group-hover:text-[#ea580c] transition-colors mt-4">
                  Gestão de Normativos
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed mt-1.5 mb-6">
                  Elabore, revise, aprove e consulte os documentos normativos da empresa.
                </p>
              </div>

              <div className="flex items-center justify-between text-xs font-semibold text-[#ea580c] pt-2">
                <span>Acessar módulo</span>
                <ArrowRight className="h-4 w-4 text-[#ea580c] transition-transform group-hover:translate-x-1" />
              </div>
            </div>
          </div>

          {/* 5. SEÇÃO INFERIOR EM DUAS COLUNAS: FAVORITOS E ACESSADOS RECENTEMENTE */}
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.4fr] gap-6 items-stretch pb-12">
            {/* Coluna Esquerda: Favoritos */}
            <div className="flex flex-col">
              <div className="flex items-center justify-between mb-3 px-1">
                <h2 className="text-base font-semibold text-slate-800">Favoritos</h2>
                <button
                  onClick={() => navigate("/processes")}
                  className="text-xs font-semibold text-[#ea580c] hover:underline flex items-center gap-1"
                >
                  <span>Gerenciar</span>
                  <span>→</span>
                </button>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-8 flex flex-col items-center justify-center text-center flex-1 min-h-[360px] shadow-2xs">
                <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center mb-3 text-slate-400">
                  <Star className="h-6 w-6 text-slate-400" strokeWidth={1.5} />
                </div>
                <h4 className="text-sm font-semibold text-slate-700">
                  Você ainda não tem processos favoritos
                </h4>
                <p className="text-xs text-slate-400 mt-1 mb-5 max-w-xs">
                  Adicione processos aos favoritos para acessá-los rapidamente
                </p>
                <button
                  onClick={() => navigate("/processes")}
                  className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors shadow-2xs"
                >
                  Explorar processos
                </button>
              </div>
            </div>

            {/* Coluna Direita: Acessados recentemente */}
            <div className="flex flex-col">
              <div className="flex items-center justify-between mb-3 px-1">
                <h2 className="text-base font-semibold text-slate-800">Acessados recentemente</h2>
                <button
                  onClick={() => navigate("/processes")}
                  className="text-xs font-semibold text-[#ea580c] hover:underline flex items-center gap-1"
                >
                  <span>Ver histórico</span>
                  <span>→</span>
                </button>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-2xs flex-1 min-h-[360px] flex flex-col justify-between">
                <div>
                  {/* Barra de Filtros Interna */}
                  <div className="flex items-center gap-3 mb-3">
                    <div className="relative flex-1">
                      <input
                        type="text"
                        value={recentSearchQuery}
                        onChange={(e) => setRecentSearchQuery(e.target.value)}
                        placeholder="Buscar processos..."
                        className="w-full rounded-xl border border-slate-200 bg-slate-50/60 px-3.5 py-1.5 text-xs text-slate-800 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:border-[#ea580c]/50 transition-all"
                      />
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      {(["Todos", "FIN", "H2R"] as const).map((cat) => (
                        <button
                          key={cat}
                          onClick={() => setSelectedCategory(cat)}
                          className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                            selectedCategory === cat
                              ? "bg-slate-900 text-white"
                              : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                          }`}
                        >
                          {cat}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Lista de Processos Recentes */}
                  <div className="space-y-1">
                    {filteredRecentItems.map((item) => (
                      <div
                        key={item.id}
                        onClick={() => handleSelectRecent(item)}
                        className="group flex items-center justify-between p-2 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          {/* Ícone de Documento em Fundo Pêssego/Laranja Suave */}
                          <div className="w-7 h-7 rounded-lg bg-[#fff7ed] flex items-center justify-center shrink-0 text-[#ea580c]">
                            <FileText className="h-4 w-4" strokeWidth={1.8} />
                          </div>

                          {/* Estrela de Favoritar */}
                          <Star className="h-4 w-4 text-slate-300 hover:text-amber-400 shrink-0 transition-colors" />

                          {/* Nome do Processo */}
                          <span className="text-xs font-medium text-slate-800 group-hover:text-[#ea580c] transition-colors truncate">
                            {item.name}
                          </span>

                          {/* Badge de Categoria (FIN ou H2R) */}
                          <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 font-mono shrink-0">
                            {item.category}
                          </span>
                        </div>

                        <div className="flex items-center gap-2 shrink-0 ml-2">
                          <span className="text-[11px] text-slate-400">{item.timeAgo}</span>
                          <ChevronRight className="h-3.5 w-3.5 text-slate-300 group-hover:text-slate-500 transition-colors" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="text-[11px] text-slate-400 text-center pt-2 border-t border-slate-100">
                  Mostrando {filteredRecentItems.length} processos recentes
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* 6. BOTÃO FLUTUANTE DE AÇÃO (FAB) NO CANTO INFERIOR DIREITO */}
      <button
        onClick={() => navigate("/org-intelligence-hub")}
        className="fixed bottom-6 right-6 z-40 w-12 h-12 rounded-full bg-[#ea580c] hover:bg-[#c2410c] text-white shadow-lg shadow-orange-500/25 flex items-center justify-center transition-all hover:scale-105 active:scale-95 focus:outline-none"
        title="Assistente Contextus"
        aria-label="Assistente Contextus"
      >
        <svg
          className="h-6 w-6 text-white"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2" />
          <path d="M12 20v2" />
          <path d="m4.93 4.93 1.41 1.41" />
          <path d="m17.66 17.66 1.41 1.41" />
          <path d="M2 12h2" />
          <path d="M20 12h2" />
          <path d="m6.34 17.66-1.41 1.41" />
          <path d="m19.07 4.93-1.41 1.41" />
        </svg>
      </button>
    </div>
  );
}
