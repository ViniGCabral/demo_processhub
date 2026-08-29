import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, BarChart3, Clock3, FileText, GraduationCap, Layers3, Network, ScrollText, Star } from "lucide-react";
import { TopBar } from "@/components/layout/TopBar";
import { ProcessAssistant } from "@/components/dashboard/ProcessAssistant";
import { useLanguage } from "@/contexts/LanguageContext";
import { useProcessStore } from "@/stores/processStore";

interface DashboardProps { onLogout: () => void; }

const recentProcessNames = ["Cotação de Frete Emergencial", "Incident Management", "IT Prepaid Amortization Process"];

export function Dashboard({ onLogout }: DashboardProps) {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const processes = useProcessStore((state) => state.processes);

  const recentProcesses = useMemo(() => {
    const selected = recentProcessNames
      .map((name) => processes.find((process) => process.name === name))
      .filter((process): process is NonNullable<typeof process> => Boolean(process));
    return selected.length > 0 ? selected : processes.slice(0, 3);
  }, [processes]);

  const favoriteProcesses = useMemo(() => {
    const favorites = processes.filter((process) => process.isFavorite).slice(0, 3);
    return favorites.length > 0 ? favorites : processes.slice(0, 3);
  }, [processes]);

  const modules = [
    { title: language === "PT" ? "Processos" : "Processes", description: language === "PT" ? "Documente, consulte e mantenha POPs, SOPs e fluxos BPMN em um só lugar." : "Document, browse and maintain SOPs and BPMN flows in one place.", icon: Layers3, path: "/processes", meta: language === "PT" ? `${processes.length || 12} processos` : `${processes.length || 12} processes` },
    { title: language === "PT" ? "Arquitetura de Processos" : "Process Architecture", description: language === "PT" ? "Entenda como áreas, cadeias de valor e processos se conectam." : "Understand how areas, value chains and processes connect.", icon: Network, path: "/architecture", meta: language === "PT" ? "Visão corporativa" : "Enterprise view" },
    { title: language === "PT" ? "Gestão de Normativos" : "Policy Management", description: language === "PT" ? "Crie, revise e acompanhe o ciclo de vida dos normativos corporativos." : "Create, review and track the lifecycle of corporate policies.", icon: ScrollText, path: "/normatives", meta: language === "PT" ? "7 normativos ativos" : "7 active policies" },
    { title: language === "PT" ? "Academia de Processos" : "Process Academy", description: language === "PT" ? "Transforme a documentação em trilhas, guias e avaliações." : "Turn documentation into learning paths, guides and assessments.", icon: GraduationCap, path: "/academy", meta: language === "PT" ? "1 trilha em andamento" : "1 path in progress" },
    { title: language === "PT" ? "Análise de Processos" : "Process Analysis", description: language === "PT" ? "Acompanhe desempenho, maturidade, riscos e oportunidades de melhoria." : "Track performance, maturity, risks and improvement opportunities.", icon: BarChart3, path: "/process-analysis", meta: language === "PT" ? "Visão consolidada" : "Consolidated view" },
  ];

  return (
    <div className="min-h-screen bg-[#f6f7fa]">
      <TopBar onLogout={onLogout} />

      <main className="mx-auto w-full max-w-[1240px] px-5 py-8 sm:px-8 lg:px-10 lg:py-10">
        <header className="mb-8">
          <div>
            <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.12em] text-[#777c8b]">
              <span>{language === "PT" ? "Início" : "Home"}</span>
              <span className="h-1 w-1 rounded-full bg-[#b9bdc8]" />
              <span className="font-medium normal-case tracking-normal text-[#9195a1]">
                {new Intl.DateTimeFormat(language === "PT" ? "pt-BR" : "en-US", { weekday: "long", day: "numeric", month: "long" }).format(new Date())}
              </span>
            </div>
            <h1 className="text-[30px] font-semibold tracking-[-0.025em] text-[#22242b] sm:text-[34px]">{language === "PT" ? "Olá, Vini" : "Hello, Vini"}</h1>
            <p className="mt-1 text-[15px] text-[#686d79]">{language === "PT" ? "Encontre informações, retome seu trabalho ou acesse um módulo." : "Find information, resume your work or open a module."}</p>
          </div>
        </header>

        <div className="grid items-stretch gap-6 lg:grid-cols-[minmax(0,1fr)_350px]">
          <ProcessAssistant />

          <aside className="h-full rounded-2xl border border-[#e2e4ea] bg-white p-5 shadow-[0_8px_24px_rgba(21,29,61,0.04)]" aria-labelledby="modules-title">
            <div className="mb-4 flex items-center justify-between">
              <div><h2 id="modules-title" className="text-base font-semibold text-[#282b33]">{language === "PT" ? "Módulos" : "Modules"}</h2><p className="mt-0.5 text-xs text-[#858995]">{language === "PT" ? "Navegue pela plataforma" : "Navigate the platform"}</p></div>
              <Layers3 className="h-4 w-4 text-[#7b84c9]" />
            </div>
            <nav className="space-y-1" aria-label={language === "PT" ? "Módulos da plataforma" : "Platform modules"}>
              {modules.map((module, index) => (
                <button key={module.path} onClick={() => navigate(module.path)} className={`group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition focus:outline-none focus:ring-2 focus:ring-[#0c1ba8]/20 ${index === 0 ? "bg-[#f0f2ff] hover:bg-[#e7eaff]" : "hover:bg-[#f6f7f9]"}`}>
                  <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${index === 0 ? "bg-[#0c1ba8] text-white" : "bg-[#f0f1f4] text-[#555b69] group-hover:bg-white"}`}><module.icon className="h-4 w-4" /></span>
                  <span className="min-w-0 flex-1"><span className="block truncate text-sm font-semibold text-[#353842]">{module.title}</span><span className="block truncate text-xs text-[#858995]">{module.meta}</span></span>
                  <ArrowRight className="h-4 w-4 text-[#a7aab4] transition group-hover:translate-x-0.5 group-hover:text-[#0c1ba8]" />
                </button>
              ))}
            </nav>
          </aside>
        </div>

        <div className="mt-6 grid items-stretch gap-5 lg:grid-cols-2">
          <section className="h-full rounded-xl border border-[#e3e5ea] bg-white px-4 py-4" aria-labelledby="recent-title">
            <div className="mb-2.5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock3 className="h-4 w-4 text-[#7c8190]" />
                <h2 id="recent-title" className="text-sm font-semibold text-[#343741]">{language === "PT" ? "Continue de onde parou" : "Continue where you left off"}</h2>
              </div>
              <button onClick={() => navigate("/processes")} className="text-xs font-semibold text-[#0c1ba8] hover:text-[#081578]">{language === "PT" ? "Ver todos" : "View all"}</button>
            </div>
            <div className="divide-y divide-[#eef0f3]">
              {recentProcesses.map((process, index) => (
                <button key={process.id} onClick={() => navigate(`/processes/${process.id}`)} className="group flex w-full min-w-0 items-center gap-3 py-2.5 text-left focus:outline-none">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#f1f2f7] text-[#4853a4]"><FileText className="h-3.5 w-3.5" /></span>
                  <span className="min-w-0 flex-1"><span className="block truncate text-[13px] font-medium text-[#42454e] group-hover:text-[#0c1ba8]">{process.name}</span><span className="block text-[11px] text-[#969aa5]">{process.area} · {index === 0 ? (language === "PT" ? "há 2 horas" : "2 hours ago") : index === 1 ? (language === "PT" ? "ontem" : "yesterday") : (language === "PT" ? "há 3 dias" : "3 days ago")}</span></span>
                  <ArrowRight className="h-3.5 w-3.5 text-[#bdc0c8] group-hover:text-[#0c1ba8]" />
                </button>
              ))}
            </div>
          </section>

          <section className="h-full rounded-xl border border-[#e3e5ea] bg-white px-4 py-4" aria-labelledby="favorites-title">
            <div className="mb-2.5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Star className="h-4 w-4 fill-[#fbbf24] text-[#e7a915]" />
                <h2 id="favorites-title" className="text-sm font-semibold text-[#343741]">{language === "PT" ? "Favoritos" : "Favorites"}</h2>
              </div>
              <button onClick={() => navigate("/processes")} className="text-xs font-semibold text-[#0c1ba8] hover:text-[#081578]">{language === "PT" ? "Gerenciar" : "Manage"}</button>
            </div>
            <div className="divide-y divide-[#eef0f3]">
              {favoriteProcesses.map((process) => (
                <button key={process.id} onClick={() => navigate(`/processes/${process.id}`)} className="group flex w-full min-w-0 items-center gap-3 py-2.5 text-left focus:outline-none">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#fff8e5] text-[#d89c0d]"><Star className="h-3.5 w-3.5 fill-current" /></span>
                  <span className="min-w-0 flex-1"><span className="block truncate text-[13px] font-medium text-[#42454e] group-hover:text-[#0c1ba8]">{process.name}</span><span className="block text-[11px] text-[#969aa5]">{process.area} · {process.hasDocumentation ? "SOP" : "BPMN"}</span></span>
                  <ArrowRight className="h-3.5 w-3.5 text-[#bdc0c8] group-hover:text-[#0c1ba8]" />
                </button>
              ))}
            </div>
          </section>
        </div>

        <footer className="mt-10 flex flex-col gap-2 border-t border-[#e1e3e8] py-5 text-xs text-[#9296a1] sm:flex-row sm:items-center sm:justify-between">
          <span>ProcessHub · {language === "PT" ? "Gestão inteligente de processos" : "Intelligent process management"}</span>
          <button onClick={() => navigate("/settings")} className="text-left font-medium hover:text-[#0c1ba8]">{language === "PT" ? "Configurações da plataforma" : "Platform settings"}</button>
        </footer>
      </main>
    </div>
  );
}
