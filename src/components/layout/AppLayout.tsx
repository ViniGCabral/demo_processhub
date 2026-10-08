import { ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import {
  Home, Share2, Activity, Network, ShieldCheck, Folder, Settings, RefreshCw, ChevronDown, LogOut, Zap
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

interface AppLayoutProps {
  children: ReactNode;
  activeMenu?: string;
  onLogout?: () => void;
}

export function AppLayout({ children, activeMenu = "processos", onLogout }: AppLayoutProps) {
  const navigate = useNavigate();
  const { language, setLanguage } = useLanguage();

  return (
    <div className="min-h-screen bg-[#f8fafc] flex">
      {/* 1. BARRA LATERAL ESQUERDA (NAVIGATION RAIL) */}
      <aside className="w-[72px] shrink-0 bg-white border-r border-[#e5e7eb] flex flex-col justify-between py-4 fixed inset-y-0 left-0 z-30 select-none">
        <div className="flex flex-col items-center gap-4">
          <button
            onClick={() => navigate("/")}
            className={`group flex flex-col items-center justify-center py-1 transition-colors ${activeMenu === "inicio" ? "text-[#ea580c]" : "text-slate-500 hover:text-slate-900"}`}
            title="Início"
          >
            {activeMenu === "inicio" ? (
               <div className="w-12 h-11 rounded-xl border border-[#ea580c] bg-orange-50/40 flex items-center justify-center transition-all">
                 <Home className="h-5 w-5 text-[#ea580c]" />
               </div>
            ) : (
               <div className="w-10 h-9 flex items-center justify-center">
                 <Home className="h-5 w-5 text-slate-500 group-hover:text-slate-900 transition-colors" />
               </div>
            )}
            <span className={`text-[10px] ${activeMenu === "inicio" ? "font-medium text-[#ea580c] mt-1" : "text-slate-500 group-hover:text-slate-900"}`}>Início</span>
          </button>

          {/* Processos */}
          <button
            onClick={() => navigate("/processes")}
            className={`group flex flex-col items-center justify-center py-1 transition-colors ${activeMenu === "processos" ? "text-[#ea580c]" : "text-slate-500 hover:text-slate-900"}`}
            title="Processos"
          >
            {activeMenu === "processos" ? (
               <div className="w-12 h-11 rounded-xl border border-[#ea580c] bg-orange-50/40 flex items-center justify-center transition-all">
                 <Share2 className="h-5 w-5 text-[#ea580c]" />
               </div>
            ) : (
               <div className="w-10 h-9 flex items-center justify-center">
                 <Share2 className="h-5 w-5 text-slate-500 group-hover:text-slate-900 transition-colors" />
               </div>
            )}
            <span className={`text-[10px] ${activeMenu === "processos" ? "font-medium text-[#ea580c] mt-1" : "text-slate-500 group-hover:text-slate-900"}`}>Processos</span>
          </button>

          {/* Análises */}
          <button
            onClick={() => navigate("/process-analysis")}
            className={`group flex flex-col items-center justify-center py-1 transition-colors ${activeMenu === "analises" ? "text-[#ea580c]" : "text-slate-500 hover:text-slate-900"}`}
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
            className={`group flex flex-col items-center justify-center py-1 transition-colors ${activeMenu === "arquitetura" ? "text-[#ea580c]" : "text-slate-500 hover:text-slate-900"}`}
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
            className={`group flex flex-col items-center justify-center py-1 transition-colors ${activeMenu === "normativos" ? "text-[#ea580c]" : "text-slate-500 hover:text-slate-900"}`}
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
      <div className="flex-1 ml-[72px] flex flex-col min-h-screen w-[calc(100%-72px)]">
        {/* 2. CABEÇALHO SUPERIOR */}
        <header className="h-16 bg-white border-b border-[#e5e7eb] px-8 flex items-center justify-between sticky top-0 z-20">
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
                <DropdownMenuItem onClick={() => setLanguage("PT")} className={`text-xs cursor-pointer ${language === "PT" ? "font-semibold text-[#ea580c]" : ""}`}>Português</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setLanguage("EN")} className={`text-xs cursor-pointer ${language === "EN" ? "font-semibold text-[#ea580c]" : ""}`}>English</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

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
                <DropdownMenuItem onClick={() => navigate("/settings")} className="gap-2.5 py-2 cursor-pointer text-xs">
                  <Settings className="h-4 w-4 text-slate-400" />
                  <span>Configurações</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={onLogout} className="gap-2.5 py-2 cursor-pointer text-xs text-red-600 focus:text-red-600">
                  <LogOut className="h-4 w-4" />
                  <span>Sair</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* 3. CONTEÚDO PRINCIPAL */}
        {children}
      </div>
    </div>
  );
}
