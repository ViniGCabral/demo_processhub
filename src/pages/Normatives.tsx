import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  AlertTriangle,
  Archive,
  ArrowLeft,
  ArrowRight,
  Bot,
  Bell,
  BookOpen,
  CalendarClock,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  CircleGauge,
  Clock3,
  Download,
  Edit3,
  Eye,
  FileClock,
  FileCheck2,
  Files,
  FileText,
  Filter,
  GitCompareArrows,
  History,
  Inbox,
  LayoutDashboard,
  ListFilter,
  MessageSquareText,
  MoreHorizontal,
  Paperclip,
  Plus,
  Printer,
  RefreshCcw,
  Search,
  Send,
  Settings2,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
  UserRound,
  Workflow,
} from "lucide-react";
import { TopBar } from "@/components/layout/TopBar";
import { cn } from "@/lib/utils";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { NormativeSettingsPanel } from "@/components/normatives/NormativeSettingsPanel";
import { NormativeApprovalsPanel } from "@/components/normatives/NormativeApprovalsPanel";
import { NormativeCreationDrawer } from "@/components/normatives/NormativeCreationDrawer";
import { MyNormativesView } from "@/components/normatives/MyNormativesView";
import { NormativeManagementPanel } from "@/components/normatives/NormativeManagementPanel";

interface NormativesProps {
  onLogout: () => void;
}

const actionItems = [
  {
    id: "PRO-0042",
    title: "Gestão de fornecedores",
    action: "Responder ajustes do Jurídico",
    detail: "2 comentários bloqueantes precisam da sua resposta.",
    due: "Vence hoje",
    tone: "danger",
  },
  {
    id: "IT-0187",
    title: "Cadastro de acessos temporários",
    action: "Concluir validação técnica",
    detail: "Revise a nova versão e registre seu parecer.",
    due: "2 dias restantes",
    tone: "warning",
  },
  {
    id: "NOR-0029",
    title: "Gestão de riscos corporativos",
    action: "Revisar classificação sugerida",
    detail: "A IA identificou possível sobreposição com a NOR-0018.",
    due: "5 dias restantes",
    tone: "regular",
  },
];

const trackedItems = [
  { id: "POL-0014", title: "Política de sustentabilidade", stage: "Governança Corporativa", due: "31/08" },
  { id: "PRO-0038", title: "Gestão de contratos", stage: "Aprovação da VP", due: "02/09" },
  { id: "IT-0179", title: "Homologação de fornecedores", stage: "Publicação", due: "04/09" },
];

const menu = [
  { id: "home", label: "Início", icon: LayoutDashboard },
  { id: "library", label: "Biblioteca", icon: BookOpen },
  { id: "demands", label: "Meus Normativos", icon: FileText, count: 3 },
  { id: "approvals", label: "Aprovações", icon: FileCheck2, count: 2 },
  { id: "flow", label: "Gestão e revisões", icon: Workflow },
  { id: "settings", label: "Configurações", icon: Settings2 },
];

export function Normatives({ onLogout }: NormativesProps) {
  const navigate = useNavigate();
  const [active, setActive] = useState("home");
  const [showNewDemand, setShowNewDemand] = useState(false);
  const [selectedDemand, setSelectedDemand] = useState("PRO-0042");

  const openDemand = (id: string) => {
    setSelectedDemand(id);
    setActive("detail");
  };
  const openLibraryDocument = (id: string) => {
    setSelectedDemand(id);
    setActive("library-reader");
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <TopBar onLogout={onLogout} />
      <div className="flex flex-1 min-h-0 normatives-shell">
        <aside className="w-[244px] shrink-0 border-r border-border bg-card min-h-[calc(100vh-56px)] flex flex-col normatives-sidebar">
          <div className="px-4 pt-5 pb-4 border-b border-border">
            <button
              onClick={() => navigate("/")}
              className="flex items-center gap-2 text-[13px] text-muted-foreground hover:text-primary transition-colors mb-5"
            >
              <ArrowLeft className="h-4 w-4" /> Voltar ao início
            </button>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary text-primary-foreground flex items-center justify-center">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div>
                <p className="text-[11px] uppercase tracking-[.08em] text-muted-foreground font-semibold leading-none mb-1">Módulo</p>
                <h1 className="text-[15px] font-semibold leading-tight">Gestão de Normativos</h1>
              </div>
            </div>
          </div>

          <nav className="p-3 space-y-1 flex-1" aria-label="Navegação do módulo">
            {menu.map((item) => (
              <button
                key={item.id}
                onClick={() => setActive(item.id)}
                className={cn(
                  "w-full h-10 px-3 rounded-lg flex items-center gap-3 text-[13px] transition-colors",
                  active === item.id
                    ? "bg-sidebar-accent text-primary font-medium"
                    : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"
                )}
              >
                <item.icon className="h-4 w-4" />
                <span className="flex-1 text-left">{item.label}</span>
                {item.count && (
                  <span className={cn("min-w-5 h-5 px-1 rounded-full text-[11px] flex items-center justify-center", active === item.id ? "bg-primary text-white" : "bg-muted text-muted-foreground")}>{item.count}</span>
                )}
              </button>
            ))}
          </nav>

          <div className="p-4 border-t border-border">
            <div className="rounded-xl bg-[#F7F8FF] border border-[#E3E7FF] p-3">
              <div className="flex items-center gap-2 text-primary text-xs font-semibold mb-1"><ShieldCheck className="h-4 w-4" /> Área de Normativos</div>
              <p className="text-[11px] leading-4 text-muted-foreground">Você tem acesso de gestão e acompanhamento.</p>
            </div>
          </div>
        </aside>

        <main className="flex-1 min-w-0">
          {active === "home" && <NormativesHome onNavigate={setActive} onNew={() => setShowNewDemand(true)} onOpenDemand={openDemand} />}
          {active === "demands" && <MyNormativesView onOpen={openDemand} onNew={() => setShowNewDemand(true)} />}
          {active === "detail" && <DemandDetail id={selectedDemand} onBack={() => setActive("demands")} />}
          {active === "approvals" && <NormativeApprovalsPanel onOpenDemand={openDemand} />}
          {active === "library" && <LibraryView onOpen={openLibraryDocument} />}
          {active === "library-reader" && <LibraryReader id={selectedDemand} onBack={() => setActive("library")} />}
          {active === "flow" && <NormativeManagementPanel onOpen={openDemand} />}
          {active === "settings" && <NormativeSettingsPanel />}
        </main>
      </div>
      <NormativeCreationDrawer open={showNewDemand} onOpenChange={setShowNewDemand} onComplete={() => { setShowNewDemand(false); openDemand("PRO-0043"); }} />
      <style>{`
        @media (max-width: 1120px) {
          .normatives-sidebar { width: 212px !important; }
          .normatives-content { padding-left: 22px !important; padding-right: 22px !important; }
          .normatives-home-grid,
          .normatives-detail-grid,
          .normatives-dashboard-grid { grid-template-columns: minmax(0, 1fr) !important; }
          .normatives-metrics { grid-template-columns: repeat(2, minmax(0, 1fr)) !important; }
          .normatives-document-grid { grid-template-columns: 180px minmax(480px, 1fr) !important; overflow-x: auto; }
          .normatives-document-grid > aside:last-child { display: none; }
        }
        @media (max-width: 760px) {
          .normatives-shell { display: block !important; }
          .normatives-sidebar { width: 100% !important; min-height: auto !important; border-right: 0; border-bottom: 1px solid hsl(var(--border)); }
          .normatives-sidebar nav { display: flex; overflow-x: auto; padding: 10px 12px; }
          .normatives-sidebar nav button { min-width: max-content; width: auto; }
          .normatives-sidebar > div:first-child, .normatives-sidebar > div:last-child { display: none; }
          .normatives-content { padding: 20px !important; }
          .normatives-metrics { grid-template-columns: minmax(0, 1fr) !important; }
        }
      `}</style>
    </div>
  );
}

function NormativesHome({ onNavigate, onNew, onOpenDemand }: { onNavigate: (id: string) => void; onNew: () => void; onOpenDemand: (id: string) => void }) {
  return (
    <div className="max-w-[1240px] mx-auto px-8 py-7 animate-fade-in normatives-content">
      <header className="flex items-start justify-between gap-6 mb-7">
        <div>
          <p className="text-[13px] text-muted-foreground mb-1">Sexta-feira, 28 de agosto</p>
          <h2 className="text-[26px] font-semibold tracking-tight">Bom dia, Patrícia</h2>
          <p className="text-sm mt-1">Você tem <strong className="text-foreground font-semibold">3 atividades prioritárias</strong> e <strong className="text-red-600 font-semibold">1 prazo vencido</strong>.</p>
        </div>
        <button onClick={onNew} className="h-10 px-4 rounded-lg bg-primary text-white text-sm font-medium flex items-center gap-2 hover:bg-primary/90 shadow-sm">
          <Plus className="h-4 w-4" /> Cadastrar normativo
        </button>
      </header>

      <div className="grid grid-cols-[minmax(0,1.55fr)_minmax(300px,.75fr)] gap-6 normatives-home-grid">
        <section className="space-y-6">
          <div className="bg-card border border-border rounded-xl overflow-hidden">
            <div className="px-5 py-4 border-b border-border flex items-center justify-between">
              <div>
                <h3 className="text-[15px] font-semibold">Requer sua ação</h3>
                <p className="text-xs mt-0.5">Priorizado por prazo, bloqueio e impacto.</p>
              </div>
              <button onClick={() => onNavigate("demands")} className="text-xs text-primary font-medium hover:underline">Ver todas</button>
            </div>
            <div className="divide-y divide-border">
              {actionItems.map((item) => (
                <button key={item.id} onClick={() => onOpenDemand(item.id)} className="w-full px-5 py-4 text-left hover:bg-muted/35 transition-colors group">
                  <div className="flex items-start gap-4">
                    <div className={cn("w-9 h-9 rounded-lg flex items-center justify-center shrink-0", item.tone === "danger" ? "bg-red-50 text-red-600" : item.tone === "warning" ? "bg-amber-50 text-amber-600" : "bg-blue-50 text-primary") }>
                      {item.tone === "danger" ? <AlertTriangle className="h-4 w-4" /> : <Clock3 className="h-4 w-4" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-4 mb-1">
                        <div className="text-[13px] font-semibold text-foreground"><span className="text-muted-foreground font-medium mr-2">{item.id}</span>{item.title}</div>
                        <span className={cn("text-[11px] font-semibold whitespace-nowrap", item.tone === "danger" ? "text-red-600" : item.tone === "warning" ? "text-amber-700" : "text-muted-foreground")}>{item.due}</span>
                      </div>
                      <p className="text-[13px] text-foreground font-medium mb-0.5">{item.action}</p>
                      <p className="text-xs">{item.detail}</p>
                    </div>
                    <ChevronRight className="h-4 w-4 text-muted-foreground mt-3 group-hover:text-primary" />
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="bg-card border border-border rounded-xl overflow-hidden">
            <div className="px-5 py-4 border-b border-border flex items-center justify-between">
              <div><h3 className="text-[15px] font-semibold">Em acompanhamento</h3><p className="text-xs mt-0.5">Normativos seus que estão com outras pessoas.</p></div>
              <button onClick={() => onNavigate("demands")} className="text-xs text-primary font-medium hover:underline">Ver meus normativos</button>
            </div>
            {trackedItems.map((item) => (
              <div key={item.id} className="px-5 py-3.5 border-b last:border-b-0 flex items-center gap-4">
                <div className="w-8 h-8 bg-muted rounded-lg flex items-center justify-center"><FileText className="h-4 w-4 text-muted-foreground" /></div>
                <div className="flex-1"><p className="text-[13px] font-medium text-foreground"><span className="text-muted-foreground mr-2">{item.id}</span>{item.title}</p><p className="text-xs">Agora com: {item.stage}</p></div>
                <span className="text-xs text-muted-foreground">Prazo {item.due}</span>
              </div>
            ))}
          </div>
        </section>

        <aside className="space-y-6">
          <div className="bg-card border border-border rounded-xl p-5">
            <div className="flex items-center justify-between mb-4"><h3 className="text-[15px] font-semibold">Seu resumo</h3><Bell className="h-4 w-4 text-muted-foreground" /></div>
            <div className="grid grid-cols-2 gap-3">
              {[
                ["3", "Pendências", "text-primary", "bg-blue-50"],
                ["7", "Em andamento", "text-slate-700", "bg-slate-50"],
                ["2", "Em risco", "text-amber-700", "bg-amber-50"],
                ["1", "Bloqueada", "text-red-600", "bg-red-50"],
              ].map(([value, label, color, bg]) => (
                <button key={label} onClick={() => onNavigate("demands")} className={cn("rounded-lg p-3 text-left hover:ring-1 hover:ring-primary/20", bg)}>
                  <div className={cn("text-xl font-semibold", color)}>{value}</div><div className="text-[11px] text-muted-foreground mt-0.5">{label}</div>
                </button>
              ))}
            </div>
          </div>

          <div className="bg-[#0B1D48] text-white rounded-xl p-5 relative overflow-hidden">
            <div className="relative z-10">
              <div className="w-9 h-9 bg-white/10 rounded-lg flex items-center justify-center mb-4"><CheckCircle2 className="h-5 w-5" /></div>
              <h3 className="text-base font-semibold text-white mb-1">Base normativa sob controle</h3>
              <p className="text-xs text-white/70 leading-5 mb-4">94% dos normativos estão vigentes e dentro do ciclo de revisão.</p>
              <button onClick={() => onNavigate("flow")} className="text-xs font-semibold flex items-center gap-1.5 hover:gap-2 transition-all">Ver gestão e revisões <ArrowRight className="h-3.5 w-3.5" /></button>
            </div>
            <div className="absolute -right-10 -bottom-14 w-40 h-40 rounded-full border-[28px] border-white/5" />
          </div>

          <div className="bg-card border border-border rounded-xl p-5">
            <h3 className="text-[15px] font-semibold mb-3">Acesso rápido</h3>
            <div className="space-y-1">
              {[
                [BookOpen, "Consultar biblioteca", "library"],
                [Workflow, "Acompanhar gargalos", "flow"],
                [FileCheck2, "Abrir aprovações", "approvals"],
              ].map(([Icon, label, target]) => {
                const QuickIcon = Icon as typeof BookOpen;
                return <button key={label as string} onClick={() => onNavigate(target as string)} className="w-full flex items-center gap-3 px-2 py-2.5 rounded-lg hover:bg-muted/60 text-[13px]"><QuickIcon className="h-4 w-4 text-primary" /><span className="flex-1 text-left">{label as string}</span><ChevronRight className="h-4 w-4 text-muted-foreground" /></button>;
              })}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

const demands = [
  { id: "PRO-0042", title: "Gestão de fornecedores", type: "Procedimento", stage: "Ajustes solicitados", owner: "Patrícia Lima", due: "Hoje", health: "Bloqueada", update: "há 1h" },
  { id: "IT-0187", title: "Cadastro de acessos temporários", type: "Instrução", stage: "Validação técnica", owner: "Você", due: "30/08", health: "Em risco", update: "há 3h" },
  { id: "NOR-0029", title: "Gestão de riscos corporativos", type: "Norma", stage: "Análise de Normativos", owner: "Carlos Silva", due: "02/09", health: "No prazo", update: "ontem" },
  { id: "POL-0014", title: "Política de sustentabilidade", type: "Política", stage: "Governança Corporativa", owner: "Marina Costa", due: "31/08", health: "Em risco", update: "ontem" },
  { id: "PRO-0038", title: "Gestão de contratos", type: "Procedimento", stage: "Aprovação da VP", owner: "Fernanda Reis", due: "02/09", health: "No prazo", update: "há 2 dias" },
  { id: "IT-0179", title: "Homologação de fornecedores", type: "Instrução", stage: "Publicação", owner: "Equipe Normativos", due: "04/09", health: "No prazo", update: "há 3 dias" },
];

function ViewHeader({ eyebrow, title, description, action }: { eyebrow?: string; title: string; description: string; action?: React.ReactNode }) {
  return (
    <header className="flex items-start justify-between gap-5 mb-6">
      <div>{eyebrow && <div className="section-title mb-1.5">{eyebrow}</div>}<h2 className="text-[25px] font-semibold tracking-tight">{title}</h2><p className="text-sm mt-1">{description}</p></div>
      {action}
    </header>
  );
}

function StatusPill({ value }: { value: string }) {
  const style = value === "Bloqueada" || value === "Vencido" ? "bg-red-50 text-red-700 border-red-100" : value === "Em risco" || value.includes("Ajustes") || value.includes("Próximo") ? "bg-amber-50 text-amber-800 border-amber-100" : value === "No prazo" || value === "Vigente" || value === "Aprovado" ? "bg-emerald-50 text-emerald-700 border-emerald-100" : "bg-blue-50 text-blue-700 border-blue-100";
  return <span className={cn("inline-flex items-center px-2 py-1 rounded-md border text-[11px] font-medium whitespace-nowrap", style)}>{value}</span>;
}

function DemandsView({ onOpenDemand, onNew }: { onOpenDemand: (id: string) => void; onNew: () => void }) {
  const [scope, setScope] = useState("Minhas pendências");
  const [query, setQuery] = useState("");
  const filtered = demands.filter((d) => `${d.id} ${d.title} ${d.type}`.toLowerCase().includes(query.toLowerCase()));
  return (
    <div className="max-w-[1240px] mx-auto p-8 animate-fade-in normatives-content">
      <ViewHeader title="Demandas" description="Encontre rapidamente o que precisa de ação e acompanhe cada etapa do processo." action={<button onClick={onNew} className="h-10 px-4 rounded-lg bg-primary text-white text-sm font-medium flex items-center gap-2"><Plus className="h-4 w-4" /> Nova demanda</button>} />
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="px-5 pt-4 border-b border-border">
          <div className="flex gap-6">
            {["Minhas pendências", "Minhas demandas", "Da minha área", "Todas"].map((item) => <button key={item} onClick={() => setScope(item)} className={cn("pb-3 text-[13px] border-b-2 -mb-px", scope === item ? "border-primary text-primary font-medium" : "border-transparent text-muted-foreground hover:text-foreground")}>{item}{item === "Minhas pendências" && <span className="ml-2 bg-primary/10 text-primary px-1.5 py-0.5 rounded-full text-[10px]">3</span>}</button>)}
          </div>
        </div>
        <div className="p-4 flex flex-wrap gap-3 items-center border-b border-border">
          <div className="relative flex-1 min-w-[260px]"><Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" /><input value={query} onChange={(e) => setQuery(e.target.value)} className="w-full h-9 pl-9 pr-3 rounded-lg border border-input bg-background text-sm outline-none focus:ring-2 focus:ring-primary/15 focus:border-primary" placeholder="Buscar por código, título ou tipo..." /></div>
          {["Status", "Tipo", "Área", "Responsável", "Prazo"].map((filter) => <button key={filter} className="h-9 px-3 rounded-lg border border-border bg-card text-xs flex items-center gap-2 hover:bg-muted/50">{filter}<ChevronDown className="h-3.5 w-3.5 text-muted-foreground" /></button>)}
          <button className="h-9 px-3 rounded-lg text-xs flex items-center gap-2 text-muted-foreground hover:bg-muted"><SlidersHorizontal className="h-4 w-4" /> Mais filtros</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead><tr className="bg-surface-subtle text-[11px] uppercase tracking-wide text-muted-foreground"><th className="font-medium px-5 py-3">Normativo</th><th className="font-medium px-4 py-3">Etapa atual</th><th className="font-medium px-4 py-3">Responsável</th><th className="font-medium px-4 py-3">Prazo</th><th className="font-medium px-4 py-3">Condição</th><th className="w-10" /></tr></thead>
            <tbody className="divide-y divide-border">{filtered.map((d) => <tr key={d.id} onClick={() => onOpenDemand(d.id)} className="hover:bg-muted/35 cursor-pointer group"><td className="px-5 py-4"><div className="text-[13px] font-semibold">{d.title}</div><div className="text-[11px] text-muted-foreground mt-1">{d.id} · {d.type} · atualizado {d.update}</div></td><td className="px-4 py-4 text-xs"><StatusPill value={d.stage} /></td><td className="px-4 py-4 text-xs text-muted-foreground">{d.owner}</td><td className={cn("px-4 py-4 text-xs font-medium", d.due === "Hoje" && "text-red-600")}>{d.due}</td><td className="px-4 py-4"><StatusPill value={d.health} /></td><td className="px-3"><ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary" /></td></tr>)}</tbody>
          </table>
        </div>
        <div className="px-5 py-3 border-t border-border text-xs text-muted-foreground">Exibindo {filtered.length} de 35 demandas</div>
      </div>
    </div>
  );
}

function DemandDetail({ id, onBack }: { id: string; onBack: () => void }) {
  const [tab, setTab] = useState("overview");
  const [comment, setComment] = useState("");
  const isNew = id === "PRO-0043";
  return (
    <div className="animate-fade-in">
      <div className="bg-card border-b border-border px-8 pt-3 sticky top-0 z-20 shadow-[0_1px_0_rgba(15,23,42,.04)]">
        <div className="max-w-[1240px] mx-auto">
          <div className="flex items-center justify-between gap-5 mb-3">
            <div className="flex items-center gap-3 min-w-0"><button onClick={onBack} aria-label="Voltar aos meus normativos" className="w-8 h-8 rounded-lg border flex items-center justify-center text-muted-foreground hover:text-primary"><ArrowLeft className="h-4 w-4" /></button><div className="min-w-0"><div className="flex items-center gap-2"><span className="text-[11px] font-semibold text-primary">{id}</span><StatusPill value={isNew ? "Em revisão" : "Ajustes solicitados"} /></div><div className="flex items-baseline gap-2 mt-0.5"><h2 className="text-[18px] font-semibold truncate">{isNew ? "Novo procedimento corporativo" : "Gestão de fornecedores"}</h2><span className="text-[10px] text-muted-foreground whitespace-nowrap">Procedimento · v{isNew ? "0.1" : "1.3"} · Suprimentos</span></div></div></div>
            <div className="flex gap-1.5 shrink-0"><button onClick={()=>setTab("document")} className="h-8 px-3 border border-primary/20 text-primary bg-primary/5 rounded-lg text-[11px] font-medium flex items-center gap-2"><FileClock className="h-3.5 w-3.5" /> Revisar</button><button className="h-8 px-3 border border-border rounded-lg text-[11px] flex items-center gap-2"><RefreshCcw className="h-3.5 w-3.5" /> Renovar validade</button><button className="h-8 px-3 border border-red-100 text-red-600 rounded-lg text-[11px] flex items-center gap-2"><Archive className="h-3.5 w-3.5" /> Revogar</button><button className="h-8 px-3 bg-primary text-white rounded-lg text-[11px] font-medium flex items-center gap-2"><Send className="h-3.5 w-3.5" /> {isNew ? "Enviar" : "Responder ajustes"}</button><button aria-label="Mais ações" className="w-8 h-8 border rounded-lg flex items-center justify-center"><MoreHorizontal className="h-4 w-4" /></button></div>
          </div>
          <div className="flex gap-6">{[["overview","Visão geral"],["document","Documento e anexos"],["approval","Aprovação"]].map(([key,label]) => <button key={key} onClick={() => setTab(key)} className={cn("pb-2.5 text-[12px] border-b-2 -mb-px", tab === key ? "border-primary text-primary font-medium" : "border-transparent text-muted-foreground")}>{label}</button>)}</div>
        </div>
      </div>
      <div className={cn("max-w-[1240px] mx-auto px-8 normatives-content",tab === "document" ? "pt-3 pb-6" : "py-6")}>
        {tab === "overview" && <div className="bg-card border border-border rounded-xl p-5 mb-5">
          <div className="flex items-start justify-between gap-5 mb-5"><div><div className="section-title mb-1">Situação atual</div><div className="text-[15px] font-semibold">{isNew ? "Elaboração da minuta" : "Ajustes pela área gestora"}</div><p className="text-xs mt-1">Responsável: Patrícia Lima · <span className="text-red-600 font-medium">Prazo: hoje, 18h</span></p></div><div className="text-right"><div className="text-xs font-medium">Próximo passo</div><p className="text-xs mt-1">Validação jurídica</p></div></div>
          <div className="flex items-center">{["Cadastro", "Elaboração", "Validação jurídica", "Aprovação", "Publicação"].map((step,index) => <div key={step} className="flex items-center flex-1 last:flex-none"><div className="flex flex-col items-center gap-1.5"><div className={cn("w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-semibold", index < 2 ? "bg-primary text-white" : index === 2 ? "bg-primary/10 text-primary ring-2 ring-primary/20" : "bg-muted text-muted-foreground")}>{index < 2 ? <CheckCircle2 className="h-4 w-4" /> : index+1}</div><span className={cn("text-[10px] whitespace-nowrap", index <= 2 ? "text-foreground font-medium" : "text-muted-foreground")}>{step}</span></div>{index < 4 && <div className={cn("h-px flex-1 mx-2 -mt-5", index < 2 ? "bg-primary" : "bg-border")} />}</div>)}</div>
        </div>}

        {tab === "overview" && <div className="grid grid-cols-[minmax(0,1.5fr)_minmax(300px,.7fr)] gap-5 normatives-detail-grid">
          <div className="space-y-5">
            {!isNew && <div className="bg-red-50 border border-red-100 rounded-xl p-4 flex gap-3"><AlertTriangle className="h-5 w-5 text-red-600 shrink-0" /><div><div className="text-sm font-semibold text-red-800">Processo bloqueado</div><p className="text-xs text-red-700 mt-1">A validação não pode continuar enquanto 2 comentários bloqueantes não forem respondidos.</p><button onClick={() => setTab("document")} className="text-xs text-red-700 font-semibold mt-2 underline">Abrir discussões no documento</button></div></div>}
            <div className="bg-card border border-border rounded-xl p-5"><h3 className="text-sm font-semibold mb-4">Dados principais</h3><div className="grid grid-cols-2 gap-x-8 gap-y-5">{[["Tipo documental","Procedimento (PRO)"],["Área gestora","Suprimentos"],["Processo relacionado","Gestão de fornecedores"],["Responsável pelo conteúdo","Patrícia Lima"],["Vigência prevista","3 anos"],["Nível de acesso","Interno"]].map(([k,v]) => <div key={k}><div className="text-[10px] uppercase tracking-wide text-muted-foreground mb-1">{k}</div><div className="text-[13px] font-medium">{v}</div></div>)}</div><button className="text-xs text-primary font-medium mt-5">Ver todos os dados</button></div>
            <div className="bg-card border border-border rounded-xl p-5"><h3 className="text-sm font-semibold mb-4">Validações e aprovações</h3><div className="space-y-4">{[["Normativos","Aprovado","Carlos Silva","26/08"],["Jurídico",isNew?"Aguardando":"Ajustes solicitados","Ana Martins","Hoje"],["Vice-presidência","Aguardando","—","—"]].map(([area,status,owner,date],index) => <div key={area} className="flex items-center gap-3"><div className={cn("w-7 h-7 rounded-full flex items-center justify-center", index === 0 ? "bg-emerald-50 text-emerald-600" : "bg-muted text-muted-foreground")}>{index === 0 ? <CheckCircle2 className="h-4 w-4" /> : index+1}</div><div className="flex-1"><div className="text-xs font-medium">{area}</div><div className="text-[11px] text-muted-foreground">{owner}</div></div><StatusPill value={status} /><span className="text-[11px] text-muted-foreground w-12 text-right">{date}</span></div>)}</div></div>
          </div>
          <aside className="space-y-5"><div className="bg-[#F7F8FF] border border-[#E3E7FF] rounded-xl p-5"><div className="flex items-center gap-2 text-primary mb-2"><Sparkles className="h-4 w-4" /><span className="text-xs font-semibold">Assistente NormaVita</span></div><p className="text-xs leading-5">A versão atual contém 3 alterações relevantes e não apresenta sobreposição crítica.</p><button onClick={() => setTab("document")} className="text-xs text-primary font-semibold mt-3">Ver análise completa</button></div><div className="bg-card border border-border rounded-xl p-5"><h3 className="text-sm font-semibold mb-3">Atividade recente</h3>{["Ana solicitou 2 ajustes", "Versão 1.3 criada", "Normativos concluiu a análise"].map((x,i)=><div key={x} className="flex gap-3 py-2.5 border-b last:border-0"><div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5"/><div><div className="text-xs">{x}</div><div className="text-[10px] text-muted-foreground">{i===0?"há 1 hora":i===1?"ontem":"26/08"}</div></div></div>)}<button onClick={() => setTab("history")} className="text-xs text-primary font-medium mt-2">Ver histórico completo</button></div></aside>
        </div>}
         {tab === "document" && <DocumentView />}
         {tab === "approval" && <ApprovalView onOpenDocument={()=>setTab("document")} />}
      </div>
    </div>
  );
}

function LifecycleActions({ isDraft, onEdit }: { isDraft: boolean; onEdit: () => void }) {
  const actions = isDraft
    ? [
        {
          title: "Continuar elaboração",
          description: "Edite a minuta, complete os dados e prepare o envio para análise.",
          label: "Abrir documento",
          icon: FileText,
          tone: "primary",
          onClick: onEdit,
        },
      ]
    : [
        {
          title: "Revisar normativo",
          description: "Crie uma nova versão mantendo o vínculo e o histórico da publicação atual.",
          label: "Iniciar revisão",
          icon: FileClock,
          tone: "primary",
          onClick: onEdit,
        },
        {
          title: "Renovar validade",
          description: "Revalide o documento sem alterar seu conteúdo e registre a justificativa.",
          label: "Renovar validade",
          icon: RefreshCcw,
          tone: "neutral",
          onClick: () => undefined,
        },
        {
          title: "Revogar normativo",
          description: "Encerre a vigência após justificativa e aprovação da alçada responsável.",
          label: "Solicitar revogação",
          icon: Archive,
          tone: "danger",
          onClick: () => undefined,
        },
      ];

  return (
    <section className="mb-5" aria-labelledby="lifecycle-actions-title">
      <div className="flex items-end justify-between gap-4 mb-3">
        <div>
          <h3 id="lifecycle-actions-title" className="text-sm font-semibold">Ações do normativo</h3>
          <p className="text-xs text-muted-foreground mt-1">As ações de ciclo de vida ficam vinculadas a este documento e ao seu histórico.</p>
        </div>
      </div>
      <div className={cn("grid gap-3", actions.length === 1 ? "grid-cols-1" : "md:grid-cols-3")}>
        {actions.map((action) => {
          const Icon = action.icon;
          return (
            <article key={action.title} className="bg-card border border-border rounded-xl p-4 flex flex-col min-h-[148px]">
              <div className={cn("w-9 h-9 rounded-lg flex items-center justify-center mb-3", action.tone === "danger" ? "bg-red-50 text-red-600" : action.tone === "primary" ? "bg-primary/10 text-primary" : "bg-muted text-foreground")}>
                <Icon className="h-4 w-4" />
              </div>
              <h4 className="text-sm font-semibold">{action.title}</h4>
              <p className="text-[11px] text-muted-foreground leading-4 mt-1 flex-1">{action.description}</p>
              <button onClick={action.onClick} className={cn("text-xs font-semibold text-left mt-3", action.tone === "danger" ? "text-red-600" : "text-primary")}>{action.label} <span aria-hidden="true">→</span></button>
            </article>
          );
        })}
      </div>
    </section>
  );
}

function ApprovalView({onOpenDocument}:{onOpenDocument:()=>void}){
  const [open,setOpen]=useState(false);
  const [decision,setDecision]=useState<"approve"|"adjust">("approve");
  const [comment,setComment]=useState("");
  const [hasSuggestions,setHasSuggestions]=useState(false);
  const [submitted,setSubmitted]=useState(false);
  const stages=[["Normativos","Júlia Almeida","há 3 dias","done"],["Compliance","Marina Silva","há 2 dias","done"],["Gov. Corporativa","Aline Pacheco","há 1 dia","done"],["Jurídico","Carolina Veloso","há 14h","done"],["DE + CA · externa","Aguardando encaminhamento","Próxima etapa","current"],["Vigente","Publicação automática","—","future"]];
  const opinions=[["JA","Júlia Almeida","Normativos · Analista","Aprovado sem ressalvas","Classificação como Política validada. Sem sobreposição com normativos vigentes; estrutura aderente ao template padrão."],["MS","Marina Silva","Compliance · Analista Sênior","Aprovado com 2 ressalvas","Aprovado mediante inclusão da Resolução ANEEL 964/2021 e alinhamento da periodicidade de revisão."],["AP","Aline Pacheco","Governança Corporativa","Aprovado sem ressalvas","Alinhado às diretrizes corporativas. Documento maduro para deliberação executiva."],["CV","Carolina Veloso","Jurídico · Especialista Sênior","Aprovado sem ressalvas","Texto juridicamente consistente e sem conflitos com legislação corporativa vigente."]];
  return <div className="space-y-4">
    <section className="bg-card rounded-xl p-5"><div className="flex justify-between items-start mb-6"><div><div className="section-title">Cadeia de aprovação · PRO</div><p className="text-[11px] mt-1">4 de 6 estágios concluídos · próximo: encaminhamento externo</p></div><div className="flex gap-2"><button onClick={onOpenDocument} className="h-8 px-3 border rounded-lg text-[10px] flex items-center gap-2"><Edit3 className="h-3.5 w-3.5"/> Sugerir alterações</button><button onClick={()=>setOpen(true)} className="h-8 px-4 bg-primary text-white rounded-lg text-[10px] font-medium flex items-center gap-2"><ShieldCheck className="h-3.5 w-3.5"/> Realizar aprovação</button></div></div><div className="flex items-start">{stages.map(([name,owner,time,status],i)=><div key={name} className="flex items-start flex-1 last:flex-none"><div className="flex flex-col items-center text-center w-[112px]"><div className={cn("w-8 h-8 rounded-full flex items-center justify-center border-2",status==="done"?"bg-emerald-500 border-emerald-500 text-white":status==="current"?"bg-primary border-primary text-white ring-4 ring-primary/10":"bg-card border-border text-muted-foreground")}>{status==="done"?<Check className="h-4 w-4"/>:i+1}</div><div className={cn("text-[10px] font-semibold mt-2",status==="current"&&"text-primary")}>{name}</div><div className="text-[8px] text-muted-foreground mt-0.5 leading-3">{owner}</div><div className="text-[8px] text-muted-foreground">{time}</div>{status==="current"&&<span className="text-[8px] bg-amber-50 text-amber-700 rounded px-1.5 py-0.5 mt-1">Aprovação opcional</span>}</div>{i<stages.length-1&&<div className={cn("h-px flex-1 mt-4 -mx-2",i<4?"bg-emerald-400":"bg-border")}/>}</div>)}</div></section>
    {submitted&&<div className="bg-emerald-50 border border-emerald-100 rounded-xl p-4 flex gap-3"><CheckCircle2 className="h-5 w-5 text-emerald-600"/><div><div className="text-xs font-semibold text-emerald-800">{hasSuggestions?"Aprovado com ressalvas":"Aprovado sem ressalvas"}</div><p className="text-[10px] text-emerald-700 mt-1">O parecer foi registrado na cadeia, nas discussões e no histórico do processo.</p></div></div>}
    <section className="bg-card rounded-xl p-5"><div className="flex items-center justify-between mb-4"><div><div className="section-title">Pareceres recebidos</div><p className="text-[10px] mt-1">4 de 4 alçadas anteriores aprovaram · 1 parecer com ressalvas já endereçado na versão 3.</p></div><StatusPill value="Aprovado"/></div><div className="grid grid-cols-2 gap-3">{opinions.map(([initials,name,role,status,text])=><article key={name} className="border rounded-xl p-4"><div className="flex items-start gap-3"><div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-[9px] font-semibold">{initials}</div><div className="flex-1"><div className="flex justify-between"><div><div className="text-[11px] font-semibold">{name}</div><div className="text-[8px] text-muted-foreground">{role}</div></div><span className="text-[8px] text-muted-foreground">há {name==="Carolina Veloso"?"14 horas":"2 dias"}</span></div><span className={cn("inline-block text-[8px] rounded px-2 py-1 mt-2",status.includes("com 2")?"bg-amber-50 text-amber-700":"bg-emerald-50 text-emerald-700")}>✓ {status}</span><p className="text-[9px] leading-4 mt-2">{text}</p></div></div></article>)}</div></section>
    <section className="bg-card rounded-xl p-5"><div className="flex justify-between mb-4"><div><div className="section-title">Mudanças significativas desde a versão 2</div><p className="text-[10px] mt-1">4 alterações resumidas pela IA para apoiar a decisão.</p></div><button onClick={onOpenDocument} className="text-[10px] text-primary font-medium">Comparar versões</button></div>{[["Classificação A/B/C de criticidade adicionada ao Objetivo e vinculada à matriz vigente.","add"],["Escopo expandido de acesso temporário para prestadores, jovens aprendizes e regimes PJ.","edit"],["Periodicidade de revisão alinhada para semestral nas seções 3.3 e 4.7.","edit"],["Referência à Resolução ANEEL 964/2021 incluída na seção 6.","add"]].map(([text,type])=><div key={text} className="flex gap-3 py-3 border-t first:border-0"><span className={cn("w-6 h-6 rounded-full flex items-center justify-center shrink-0",type==="add"?"bg-emerald-50 text-emerald-600":"bg-blue-50 text-blue-600")}>{type==="add"?"+":"✎"}</span><p className="text-[10px] leading-4"><b>{text.split(" ").slice(0,4).join(" ")}</b>{" "+text.split(" ").slice(4).join(" ")}</p></div>)}</section>
    <Dialog open={open} onOpenChange={setOpen}><DialogContent className="max-w-[520px]"><DialogTitle>Registrar decisão de aprovação</DialogTitle><DialogDescription>Seu parecer será incorporado à cadeia de aprovação e à trilha de auditoria.</DialogDescription><div className="space-y-4 mt-2"><div className="grid grid-cols-2 gap-2"><button onClick={()=>setDecision("approve")} className={cn("border rounded-xl p-3 text-left",decision==="approve"&&"border-primary bg-primary/5")}><div className="text-xs font-semibold">Aprovar</div><div className="text-[9px] text-muted-foreground mt-1">Com ou sem ressalvas</div></button><button onClick={()=>setDecision("adjust")} className={cn("border rounded-xl p-3 text-left",decision==="adjust"&&"border-amber-400 bg-amber-50")}><div className="text-xs font-semibold">Solicitar ajustes</div><div className="text-[9px] text-muted-foreground mt-1">Retorna ao responsável</div></button></div><label className="flex gap-3 border rounded-xl p-3"><input type="checkbox" checked={hasSuggestions} onChange={e=>setHasSuggestions(e.target.checked)} className="mt-0.5"/><span><span className="text-[10px] font-medium block">Registrei sugestões de alteração no documento</span><span className="text-[9px] text-muted-foreground">Ao aprovar, a decisão será classificada automaticamente como “Aprovado com ressalvas”.</span></span></label><label><span className="text-[10px] font-medium block mb-1.5">Comentários e ponderações</span><textarea value={comment} onChange={e=>setComment(e.target.value)} placeholder="Descreva seu parecer ou indique que não há ponderações..." className="w-full min-h-[110px] border rounded-lg p-3 text-xs resize-y"/></label><div className="bg-muted/40 rounded-lg p-3 text-[9px] leading-4">Sugestões feitas no modo de edição não alteram diretamente o texto. Inclusões aparecem em verde, exclusões em vermelho e somente o responsável pelo documento pode aceitá-las.</div><div className="flex justify-end gap-2"><button onClick={()=>setOpen(false)} className="h-9 px-4 border rounded-lg text-xs">Cancelar</button><button onClick={()=>{setSubmitted(true);setOpen(false)}} className={cn("h-9 px-4 text-white rounded-lg text-xs font-medium",decision==="approve"?"bg-primary":"bg-amber-600")}>{decision==="approve"?(hasSuggestions?"Aprovar com ressalvas":"Aprovar sem ressalvas"):"Solicitar ajustes"}</button></div></div></DialogContent></Dialog>
  </div>
}

function DocumentView() {
  const [sideTab, setSideTab] = useState<"ai" | "discussions" | "history">("ai");
  const [editing, setEditing] = useState(false);
  return <div className="bg-[#F4F5F7] overflow-hidden min-h-[760px] -mx-2">
    <div className="grid grid-cols-[164px_minmax(560px,1fr)_310px] gap-2 min-h-[760px] normatives-document-grid">
      <aside className="bg-card p-3 rounded-lg self-start">
        <div className="flex items-center justify-between px-1 mb-3"><span className="text-[11px] font-semibold">Versões</span><button aria-label="Opções de versão"><MoreHorizontal className="h-4 w-4" /></button></div>
        {[["1.3","Atual","Hoje, 10:42"],["1.2","Jurídico","26/08"],["1.1","Normativos","24/08"],["1.0","Original","22/08"]].map(([v,label,date],i)=><button key={v} className={cn("w-full text-left rounded-lg p-3 mb-1 border",i===0?"bg-primary/5 border-primary/20":"border-transparent hover:bg-muted/60")}><div className="flex justify-between"><span className="text-[11px] font-semibold">Versão {v}</span>{i===0&&<span className="text-[8px] bg-primary text-white rounded px-1.5 py-0.5">Atual</span>}</div><div className="text-[9px] text-muted-foreground mt-1">{label} · {date}</div></button>)}
        <button className="w-full h-8 mt-3 border rounded-lg text-[10px] flex items-center justify-center gap-2"><GitCompareArrows className="h-3.5 w-3.5" /> Comparar versões</button>
        <div className="mt-6 border-t pt-4"><div className="text-[10px] font-semibold px-1 mb-2">Navegação</div>{["1. Objetivo","2. Abrangência","3. Responsabilidades","4. Diretrizes","5. Referências"].map((x,i)=><button key={x} className={cn("w-full text-left text-[10px] px-2.5 py-2 rounded-md",i===0?"bg-muted font-medium":"text-muted-foreground hover:bg-muted")}>{x}</button>)}</div>
      </aside>
      <section className="bg-[#F4F5F7] min-w-0">
        <div className="px-5 py-3 bg-card rounded-lg flex justify-between items-center shadow-sm"><div className="flex items-center gap-3"><div className="inline-flex border border-border rounded-lg overflow-hidden"><button onClick={()=>setEditing(false)} className={cn("flex items-center gap-1.5 px-4 py-2 text-[12px] transition-colors",!editing?"bg-primary text-white":"bg-card text-muted-foreground hover:text-foreground")}><Eye className="h-4 w-4"/> Visualizar</button><button onClick={()=>setEditing(true)} className={cn("flex items-center gap-1.5 px-4 py-2 text-[12px] transition-colors",editing?"bg-primary text-white":"bg-card text-muted-foreground hover:text-foreground")}><Edit3 className="h-4 w-4"/> Editar</button></div>{editing&&<span className="text-[9px] bg-amber-50 text-amber-700 rounded-md px-2 py-1">Modo de sugestão · o texto original é preservado</span>}</div><div className="flex items-center gap-2"><button className="flex items-center gap-2 px-3.5 py-2 border border-border rounded-lg text-[12px] hover:bg-muted"><Download className="h-4 w-4"/> Baixar Word</button><button className="flex items-center gap-2 px-3.5 py-2 border border-border rounded-lg text-[12px] hover:bg-muted"><Download className="h-4 w-4"/> Exportar PDF</button><button className="flex items-center gap-2 px-3.5 py-2 border border-border rounded-lg text-[12px] hover:bg-muted"><Printer className="h-4 w-4"/> Imprimir</button><button aria-label="Mais opções do documento" className="w-9 h-9 flex items-center justify-center border border-border rounded-lg text-muted-foreground hover:bg-muted"><MoreHorizontal className="h-4 w-4"/></button></div></div>
        <div className="pt-3 px-2 md:px-3">
          <article contentEditable={editing} suppressContentEditableWarning className={cn("bg-white shadow-sm border max-w-[780px] mx-auto min-h-[900px] px-12 py-11 outline-none",editing&&"ring-2 ring-primary/20 border-primary/30")}><div className="text-[9px] text-primary font-bold tracking-wider mb-9">PRO-0042 · VERSÃO 1.3</div><h1 className="text-[26px] mb-3">Procedimento de Gestão de Fornecedores</h1><p className="text-sm text-muted-foreground mb-9">Diretrizes para seleção, homologação, avaliação e acompanhamento de fornecedores.</p>{["1. Objetivo","2. Abrangência","3. Responsabilidades","4. Diretrizes gerais"].map((h,i)=><div key={h} className="mb-8"><h3 className="text-base font-semibold mb-2">{h}</h3><p className="text-[13px] leading-7">{i===0?"Estabelecer critérios padronizados para assegurar a qualidade, conformidade e rastreabilidade na gestão de fornecedores da organização.":i===1?"Este procedimento aplica-se a todas as áreas que realizam contratação, homologação ou avaliação de fornecedores.":i===2?"A área de Suprimentos é responsável pela condução do processo e pela manutenção das evidências necessárias.":"Todo fornecedor crítico deve passar por homologação prévia e avaliação periódica documentada."}</p>{editing&&i===3&&<div className="mt-2 text-[12px] leading-6"><span className="bg-red-50 text-red-700 line-through px-1">avaliação anual</span><span className="mx-1"> </span><span className="bg-emerald-50 text-emerald-700 underline px-1">avaliação semestral</span><span className="ml-2 text-[9px] text-muted-foreground">Sugestão do aprovador</span></div>}{i===2&&<button onClick={()=>setSideTab("discussions")} className="mt-3 w-full text-left px-3 py-2 bg-amber-50 border-l-2 border-amber-400 text-[11px]">Comentário de Ana Martins: definir a periodicidade e o responsável pelas evidências. <span className="font-semibold">Abrir discussão →</span></button>}</div>)}</article>
          <section className="max-w-[780px] mx-auto mt-5 bg-card border rounded-xl p-5"><div className="flex justify-between items-start mb-4"><div><h3 className="text-sm font-semibold">Anexos do documento</h3><p className="text-[10px] text-muted-foreground mt-1">Evidências e referências vinculadas à versão 1.3.</p></div><button className="h-8 px-3 border rounded-lg text-[10px] flex gap-2 items-center"><Plus className="h-3.5 w-3.5"/> Adicionar anexo</button></div>{[["Matriz_de_responsabilidades.xlsx","124 KB"],["Resolução_ANEEL_964.pdf","2,4 MB"]].map(([name,size])=><div key={name} className="flex items-center gap-3 py-3 border-t"><div className="w-8 h-8 rounded-lg bg-primary/5 text-primary flex items-center justify-center"><Paperclip className="h-4 w-4"/></div><div className="flex-1"><div className="text-[11px] font-medium">{name}</div><div className="text-[9px] text-muted-foreground">{size} · anexado à versão atual</div></div><button className="text-[10px] text-primary">Baixar</button></div>)}</section>
        </div>
      </section>
      <aside className="bg-card min-w-0 rounded-lg self-start max-h-[calc(100vh-210px)] overflow-y-auto">
        <div className="grid grid-cols-3 sticky top-0 bg-card z-10">{[["ai","IA",3],["discussions","Discussões",2],["history","Histórico",6]].map(([key,label,count])=><button key={key as string} onClick={()=>setSideTab(key as typeof sideTab)} className={cn("h-12 text-[10px] border-b-2 flex items-center justify-center gap-1",sideTab===key?"border-primary text-primary font-semibold":"border-transparent text-muted-foreground")}>{label as string}<span className="bg-muted rounded-full px-1.5 py-0.5 text-[8px]">{count as number}</span></button>)}</div>
        <div className="p-4">{sideTab==="ai"&&<AiDocumentSidebar/>}{sideTab==="discussions"&&<DocumentDiscussions/>}{sideTab==="history"&&<DocumentHistory/>}</div>
      </aside>
    </div>
  </div>;
}

function AiDocumentSidebar(){const checks=[["Tipo classificado corretamente",true],["Título objetivo (> 10 caracteres)",true],["Vínculo aos processos corporativos",true],["Estrutura aderente ao template PRO",true],["Escopo de aplicação claro",true],["Responsável técnico definido",true],["Sem sobreposição com normativos vigentes",true],["Referência regulatória completa",false],["Consistência entre seções",false]] as const;return <div><div className="flex items-center gap-2 text-primary mb-4"><Bot className="h-4 w-4"/><span className="text-xs font-semibold">Análise documental</span><span className="ml-auto text-[8px] text-muted-foreground">atualizado há 8 min</span></div><section className="bg-amber-50/60 rounded-lg p-3 mb-3"><div className="text-[8px] uppercase tracking-wide text-muted-foreground font-semibold">Checklist de qualidade</div><div className="flex items-end gap-1 mt-1"><span className="text-2xl font-semibold">7</span><span className="text-[9px] text-muted-foreground mb-1">de 9 itens atendidos</span></div><div className="h-1.5 bg-white rounded-full mt-2"><div className="h-full w-[78%] bg-primary rounded-full"/></div><p className="text-[8px] text-emerald-700 mt-2">2 itens pendentes · sem bloqueio para análise</p></section><section className="rounded-lg bg-muted/30 p-3 mb-3">{checks.map(([label,ok])=><div key={label} className="flex gap-2 py-1"><span className={cn("w-3.5 h-3.5 rounded-full flex items-center justify-center text-[8px] shrink-0 mt-px",ok?"bg-emerald-100 text-emerald-700":"bg-amber-100 text-amber-700")}>{ok?"✓":"!"}</span><div><div className="text-[8px] leading-3.5">{label}</div>{!ok&&<div className="text-[7px] text-amber-700 mt-0.5">{label.startsWith("Referência")?"ANEEL 964/2021 não mencionada":"Itens 3.3 e 4.7 divergem"}</div>}</div></div>)}</section><AnalysisBlock title="Resumo executivo gerado"><p>Procedimento corporativo que estabelece critérios de homologação, avaliação e acompanhamento de fornecedores críticos. Define Suprimentos como área gestora e prevê controles de qualidade e rastreabilidade, mas ainda precisa explicitar a periodicidade das avaliações.</p></AnalysisBlock><AnalysisBlock title="Conformidade regulatória"><div className="space-y-1.5">{[["LGPD","princípios atendidos",true],["NR-10","restrições compatíveis",true],["ANEEL 964/2021","não mencionada",false],["ISO 9001","aderência parcial",true]].map(([name,status,ok])=><div key={name as string} className="flex items-start gap-1.5 text-[8px]"><span className={ok?"text-emerald-600":"text-amber-600"}>{ok?"○":"△"}</span><span><b>{name as string}</b> — {status as string}</span></div>)}</div></AnalysisBlock><AnalysisBlock title="Sobreposição com normativos vigentes"><div className="space-y-2">{[["PRO-0015","Gestão contratual","18%"],["NOR-0018","Gestão de terceiros","12%"]].map(([code,name,score])=><div key={code} className="rounded-md bg-muted/40 p-2 flex gap-2"><span className="text-[7px] font-bold text-primary bg-primary/10 rounded px-1 h-fit">{code.split("-")[0]}</span><div className="flex-1"><div className="text-[8px] font-semibold">{code}</div><div className="text-[7px] text-muted-foreground">{name} · complementar</div></div><span className="text-[8px] font-semibold">{score}</span></div>)}</div></AnalysisBlock><button className="w-full mt-1 h-8 border border-primary text-primary rounded-lg text-[9px] font-medium">Executar nova análise</button><p className="mt-3 text-[7px] leading-3 text-muted-foreground">As sugestões apoiam a análise e não substituem a decisão humana.</p></div>}
function AnalysisBlock({title,children}:{title:string;children:React.ReactNode}){return <section className="rounded-lg bg-muted/30 p-3 mb-3"><div className="text-[8px] font-semibold flex items-center gap-1.5 mb-2"><Sparkles className="h-3 w-3 text-primary"/>{title}</div><div className="text-[8px] leading-3.5 text-muted-foreground">{children}</div></section>}
function DocumentDiscussions(){const [message,setMessage]=useState("");return <div><div className="flex justify-between items-center mb-4"><div><div className="text-xs font-semibold">Discussões</div><div className="text-[9px] text-muted-foreground mt-0.5">2 bloqueantes · versão 1.3</div></div><button className="text-[9px] text-primary">Ver resolvidas</button></div><div className="space-y-3"><div className="bg-amber-50 border border-amber-100 rounded-lg p-3"><div className="text-[10px] font-semibold">Ana Martins · Jurídico</div><p className="text-[10px] leading-4 mt-1">Definir a periodicidade da avaliação e o responsável pelas evidências.</p><div className="text-[8px] text-muted-foreground mt-2">Seção 3 · há 1 hora</div></div><div className="border rounded-lg p-3"><div className="text-[10px] font-semibold">Patrícia Lima</div><p className="text-[10px] leading-4 mt-1">Estou ajustando o item e anexarei a matriz de responsabilidades.</p><div className="text-[8px] text-muted-foreground mt-2">há 12 min</div></div></div><div className="mt-4 border rounded-lg p-2"><textarea value={message} onChange={e=>setMessage(e.target.value)} placeholder="Responder ou mencionar com @..." className="w-full min-h-[70px] text-[10px] resize-none outline-none p-1"/><div className="flex justify-between border-t pt-2"><button aria-label="Anexar arquivo"><Paperclip className="h-3.5 w-3.5"/></button><button className="h-7 px-3 bg-primary text-white rounded-md text-[9px]">Responder</button></div></div></div>}
function DocumentHistory(){return <div><div className="text-xs font-semibold mb-1">Histórico do documento</div><p className="text-[9px] text-muted-foreground mb-4">Alterações, decisões e movimentações.</p>{[["Ana solicitou ajustes","Jurídico · há 1 hora"],["Versão 1.3 criada","Patrícia Lima · ontem"],["Análise da IA atualizada","NormaVita · ontem"],["Normativos aprovou","Carlos Silva · 26/08"],["Versão 1.2 enviada","Patrícia Lima · 25/08"]].map(([event,meta],i)=><div key={event} className="flex gap-3"><div className="flex flex-col items-center"><span className={cn("w-2 h-2 rounded-full mt-1",i===0?"bg-amber-500":"bg-primary")}/>{i<4&&<span className="w-px h-10 bg-border"/>}</div><div><div className="text-[10px] font-medium">{event}</div><div className="text-[8px] text-muted-foreground mt-1">{meta}</div></div></div>)}</div>}

function DiscussionsView({ comment, setComment }: { comment: string; setComment: (v: string) => void }) {
  return <div className="grid grid-cols-[230px_1fr] bg-card border border-border rounded-xl overflow-hidden min-h-[550px]"><aside className="border-r p-4"><div className="text-xs font-semibold mb-3">Filtrar discussões</div>{["Todas as conversas","Abertas","Bloqueantes","Minhas menções","Resolvidas"].map((x,i)=><button key={x} className={cn("w-full flex justify-between rounded-lg px-3 py-2.5 text-xs mb-1",i===0?"bg-primary/5 text-primary font-medium":"text-muted-foreground hover:bg-muted")}><span>{x}</span>{i===1&&<span>2</span>}</button>)}</aside><section className="p-6 max-w-[760px]"><div className="flex justify-between mb-5"><div><h3 className="text-sm font-semibold">Ajustes solicitados pelo Jurídico</h3><p className="text-xs">Vinculado à versão 1.3 · Seção 3</p></div><StatusPill value="Bloqueante" /></div><div className="space-y-4"><div className="flex gap-3"><div className="w-8 h-8 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center text-[10px] font-semibold">AM</div><div className="bg-muted/50 rounded-xl rounded-tl-none p-4 flex-1"><div className="text-xs font-semibold mb-1">Ana Martins <span className="text-muted-foreground font-normal">· Jurídico · há 1h</span></div><p className="text-xs text-foreground leading-5">Precisamos esclarecer a periodicidade da avaliação e indicar a área responsável pelo registro das evidências.</p></div></div><div className="flex gap-3 pl-10"><div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-[10px] font-semibold">PL</div><div className="border border-border rounded-xl rounded-tl-none p-4 flex-1"><div className="text-xs font-semibold mb-1">Patrícia Lima <span className="text-muted-foreground font-normal">· agora</span></div><p className="text-xs text-foreground leading-5">Estou ajustando o item 3 e vou anexar a matriz de responsabilidades.</p></div></div></div><div className="mt-6 border border-border rounded-xl p-3"><textarea value={comment} onChange={(e)=>setComment(e.target.value)} className="w-full min-h-[70px] resize-none text-xs outline-none" placeholder="Escreva uma resposta ou mencione alguém com @..."/><div className="flex justify-between pt-2 border-t"><button className="text-xs text-muted-foreground flex items-center gap-1"><Paperclip className="h-3.5 w-3.5"/> Anexar</button><button className="h-8 px-3 bg-primary text-white rounded-lg text-xs flex items-center gap-2"><Send className="h-3.5 w-3.5"/> Responder</button></div></div></section></div>;
}

function AttachmentsView() {
  return <div className="bg-card border border-border rounded-xl"><div className="p-5 border-b flex justify-between"><div><h3 className="text-sm font-semibold">Anexos e evidências</h3><p className="text-xs mt-1">5 arquivos vinculados à demanda.</p></div><button className="h-9 px-3 bg-primary text-white rounded-lg text-xs flex items-center gap-2"><Paperclip className="h-4 w-4"/> Adicionar anexo</button></div><div className="p-5 grid grid-cols-2 gap-3">{[["Matriz de responsabilidades.xlsx","Evidência","Patrícia Lima"],["Parecer jurídico.pdf","Parecer","Ana Martins"],["Ata do comitê.pdf","Ata","Marina Costa"],["Pesquisa de fornecedores.docx","Documento de apoio","Patrícia Lima"],["E-mail de validação.eml","Comunicação","Carlos Silva"]].map(([name,type,owner])=><div key={name} className="border rounded-xl p-4 flex gap-3 items-center hover:border-primary/30"><div className="w-9 h-9 bg-muted rounded-lg flex items-center justify-center"><Files className="h-4 w-4 text-primary"/></div><div className="flex-1 min-w-0"><div className="text-xs font-medium truncate">{name}</div><div className="text-[10px] text-muted-foreground mt-1">{type} · {owner}</div></div><button><Download className="h-4 w-4 text-muted-foreground"/></button></div>)}</div></div>;
}

function HistoryView() {
  return <div className="bg-card border border-border rounded-xl"><div className="p-5 border-b flex justify-between"><div><h3 className="text-sm font-semibold">Linha do tempo da demanda</h3><p className="text-xs mt-1">Registro completo e auditável de todas as movimentações.</p></div><button className="h-9 px-3 border rounded-lg text-xs flex items-center gap-2"><Download className="h-4 w-4"/> Exportar trilha</button></div><div className="p-6 max-w-[760px]">{[["Hoje, 10:32","Ana Martins solicitou ajustes","2 comentários bloqueantes foram associados à versão 1.3."],["Ontem, 16:18","Versão 1.3 criada por Patrícia Lima","Documento atualizado com as recomendações de Normativos."],["26/08, 14:05","Análise de Normativos concluída","Carlos Silva encaminhou a demanda para validação jurídica."],["22/08, 09:41","Demanda criada","Código PRO-0042 gerado automaticamente."]].map(([date,title,text],i)=><div key={date} className="relative pl-9 pb-7 last:pb-0 before:absolute before:left-[11px] before:top-5 before:bottom-0 before:w-px before:bg-border last:before:hidden"><div className={cn("absolute left-0 top-0 w-6 h-6 rounded-full flex items-center justify-center",i===0?"bg-amber-100 text-amber-700":"bg-primary/10 text-primary")}><History className="h-3 w-3"/></div><div className="text-[10px] text-muted-foreground mb-1">{date}</div><div className="text-xs font-semibold">{title}</div><p className="text-xs mt-1">{text}</p></div>)}</div></div>;
}

function ApprovalsView({ onOpenDemand }: { onOpenDemand: (id: string) => void }) {
  const [selected, setSelected] = useState("PRO-0038");
  return <div className="max-w-[1240px] mx-auto p-8 animate-fade-in"><ViewHeader title="Aprovações" description="Decida com contexto completo, pareceres consolidados e mudanças relevantes."/><div className="grid grid-cols-[390px_1fr] gap-5"><section className="bg-card border rounded-xl overflow-hidden"><div className="p-4 border-b"><div className="relative"><Search className="h-4 w-4 absolute left-3 top-2.5 text-muted-foreground"/><input className="h-9 w-full border rounded-lg pl-9 pr-3 text-xs" placeholder="Buscar aprovação..."/></div></div>{[["PRO-0038","Gestão de contratos","Aprovação da VP","Vence hoje"],["IT-0184","Controle de acessos","Aprovação gerencial","Amanhã"]].map(([id,title,stage,due])=><button key={id} onClick={()=>setSelected(id)} className={cn("w-full p-4 border-b text-left",selected===id?"bg-primary/5 border-l-2 border-l-primary":"hover:bg-muted/40")}><div className="flex justify-between mb-1"><span className="text-[11px] font-semibold text-primary">{id}</span><span className="text-[10px] text-red-600 font-medium">{due}</span></div><div className="text-sm font-semibold mb-1">{title}</div><p className="text-[11px]">{stage}</p></button>)}</section><section className="bg-card border rounded-xl overflow-hidden"><div className="p-6 border-b"><div className="flex justify-between"><div><div className="text-xs text-primary font-semibold mb-1">{selected}</div><h2 className="text-xl font-semibold">{selected==="PRO-0038"?"Gestão de contratos":"Controle de acessos"}</h2><p className="text-xs mt-1">Solicitado por Suprimentos · Versão 2.0</p></div><StatusPill value="Decisão pendente"/></div></div><div className="p-6"><div className="bg-[#F7F8FF] rounded-xl p-5 mb-5"><div className="flex gap-2 text-primary text-xs font-semibold mb-2"><Sparkles className="h-4 w-4"/> Resumo executivo</div><p className="text-xs text-foreground leading-5">A revisão atualiza as alçadas de contratação, inclui critérios ESG e consolida os controles de documentação dos fornecedores.</p><div className="grid grid-cols-3 gap-3 mt-4">{[["8","Alterações"],["2","Pontos de atenção"],["3","Pareceres favoráveis"]].map(([v,k])=><div key={k} className="bg-white rounded-lg p-3"><div className="text-lg font-semibold">{v}</div><div className="text-[10px] text-muted-foreground">{k}</div></div>)}</div></div><h3 className="text-sm font-semibold mb-3">Cadeia de aprovação</h3>{[["Normativos","Aprovado"],["Jurídico","Aprovado"],["Compliance","Aprovado"],["Vice-presidência","Sua decisão"]].map(([area,status],i)=><div key={area} className="flex items-center gap-3 py-2.5 border-b"><div className={cn("w-6 h-6 rounded-full flex items-center justify-center",i<3?"bg-emerald-50 text-emerald-600":"bg-primary text-white")}>{i<3?<CheckCircle2 className="h-3.5 w-3.5"/>:4}</div><span className="text-xs flex-1">{area}</span><StatusPill value={status}/></div>)}<div className="mt-6 flex justify-between"><button onClick={()=>onOpenDemand(selected)} className="h-9 px-3 border rounded-lg text-xs">Abrir documento completo</button><div className="flex gap-2"><button className="h-9 px-4 border border-amber-300 text-amber-800 rounded-lg text-xs font-medium">Solicitar ajustes</button><button className="h-9 px-5 bg-primary text-white rounded-lg text-xs font-medium">Aprovar versão 2.0</button></div></div></div></section></div></div>;
}

function LibraryView({onOpen}:{onOpen:(id:string)=>void}) {
  return <div className="max-w-[1240px] mx-auto p-8 animate-fade-in"><ViewHeader title="Biblioteca de normativos" description="Consulte a fonte oficial, versões vigentes e documentos relacionados."/><div className="bg-[#0B1D48] rounded-2xl p-8 mb-6 text-white"><h3 className="text-xl text-white font-semibold mb-2">Encontre o normativo que precisa</h3><p className="text-sm text-white/65 mb-5">Busque por código, título, área, processo ou conteúdo do documento.</p><div className="relative max-w-[760px]"><Search className="absolute left-4 top-3.5 h-5 w-5 text-muted-foreground"/><input className="w-full h-12 rounded-xl pl-12 pr-4 text-sm text-foreground" placeholder="Ex.: fornecedores, PRO-0042, Suprimentos..."/></div></div><div className="flex gap-3 mb-5"><button className="h-9 px-3 bg-primary text-white rounded-lg text-xs">Vigentes</button>{["Tipo","Área responsável","Processo","Última atualização"].map(x=><button key={x} className="h-9 px-3 border bg-card rounded-lg text-xs flex gap-2 items-center">{x}<ChevronDown className="h-3.5 w-3.5"/></button>)}</div><div className="grid grid-cols-3 gap-4">{[["PRO-0040","Gestão de terceiros","Suprimentos","12/08/2026"],["NOR-0027","Segurança da informação","Tecnologia","04/08/2026"],["POL-0012","Política de integridade","Compliance","18/07/2026"],["IT-0175","Cadastro de fornecedores","Suprimentos","02/07/2026"],["PRO-0036","Gestão de contratos","Jurídico","21/06/2026"],["NOR-0022","Gestão de riscos","Riscos","10/06/2026"]].map(([id,title,area,date])=><button key={id} onClick={()=>onOpen(id)} className="bg-card border rounded-xl p-5 text-left hover:border-primary/40 hover:shadow-sm transition-all"><div className="flex justify-between mb-4"><div className="w-9 h-9 bg-primary/5 rounded-lg flex items-center justify-center"><BookOpen className="h-4 w-4 text-primary"/></div><StatusPill value="Vigente"/></div><div className="text-[11px] text-primary font-semibold mb-1">{id}</div><h3 className="text-sm font-semibold mb-4">{title}</h3><div className="text-[10px] text-muted-foreground">{area} · Atualizado em {date}</div><div className="text-[10px] text-primary font-medium mt-4 flex items-center gap-1">Consultar normativo <ChevronRight className="h-3.5 w-3.5"/></div></button>)}</div></div>;
}

function LibraryReader({id,onBack}:{id:string;onBack:()=>void}){
  const titles:Record<string,string>={"PRO-0040":"Gestão de terceiros","NOR-0027":"Segurança da informação","POL-0012":"Política de integridade","IT-0175":"Cadastro de fornecedores","PRO-0036":"Gestão de contratos","NOR-0022":"Gestão de riscos"};
  const title=titles[id]||"Normativo corporativo";
  const sections=["1. Objetivo","2. Abrangência","3. Diretrizes","4. Responsabilidades","5. Controles e registros","6. Referências"];
  return <div className="animate-fade-in">
    <header className="bg-card border-b px-8 py-4"><div className="max-w-[1240px] mx-auto flex items-center justify-between gap-5"><div className="flex items-center gap-3"><button onClick={onBack} aria-label="Voltar à biblioteca" className="w-9 h-9 border rounded-lg flex items-center justify-center"><ArrowLeft className="h-4 w-4"/></button><div><div className="flex items-center gap-2"><span className="text-[11px] text-primary font-semibold">{id}</span><StatusPill value="Vigente"/></div><h2 className="text-lg font-semibold mt-0.5">{title}</h2><p className="text-[10px] text-muted-foreground mt-0.5">Versão oficial 2.1 · Publicado em 12/08/2026 · Acesso para consulta</p></div></div><button className="h-9 px-4 bg-primary text-white rounded-lg text-xs flex items-center gap-2"><Download className="h-4 w-4"/> Exportar PDF</button></div></header>
    <div className="max-w-[1180px] mx-auto px-8 py-5"><div className="bg-blue-50/60 border border-blue-100 rounded-lg px-4 py-3 mb-4 flex gap-3"><Eye className="h-4 w-4 text-primary shrink-0"/><div><div className="text-[11px] font-semibold">Modo de consulta</div><p className="text-[10px] text-muted-foreground mt-0.5">Esta é a versão oficial publicada. O conteúdo não pode ser alterado nesta visualização.</p></div></div><div className="grid grid-cols-[190px_minmax(520px,1fr)] gap-5 items-start"><aside className="bg-card rounded-xl p-3 sticky top-4"><div className="text-[11px] font-semibold px-2 mb-2">Navegação</div>{sections.map((section,i)=><button key={section} className={cn("w-full px-2.5 py-2 text-left rounded-md text-[10px]",i===0?"bg-primary/5 text-primary font-medium":"text-muted-foreground hover:bg-muted")}>{section}</button>)}<div className="border-t mt-4 pt-4"><button className="w-full px-2.5 py-2 flex items-center justify-between text-[10px]"><span className="flex gap-2 items-center"><Paperclip className="h-3.5 w-3.5"/> Anexos</span><span className="bg-muted rounded-full px-1.5">2</span></button></div></aside><main className="min-w-0"><article className="bg-card border shadow-sm max-w-[820px] mx-auto min-h-[980px] px-14 py-12"><div className="flex justify-between text-[9px] text-primary font-bold tracking-wider mb-10"><span>{id} · VERSÃO 2.1</span><span>USO INTERNO</span></div><h1 className="text-[27px] mb-3">{title}</h1><p className="text-sm text-muted-foreground mb-10">Diretrizes corporativas para assegurar padronização, conformidade e rastreabilidade na execução do processo.</p>{sections.slice(0,5).map((section,i)=><section key={section} className="mb-8"><h3 className="text-base font-semibold mb-2">{section}</h3><p className="text-[13px] leading-7">{i===0?`Estabelecer os princípios e critérios aplicáveis à ${title.toLowerCase()}, garantindo consistência e aderência às diretrizes da organização.`:i===1?"Aplica-se a todos os colaboradores, prestadores de serviço e áreas que participam direta ou indiretamente deste processo.":i===2?"As atividades devem ser realizadas de forma documentada, seguindo as alçadas, prazos e controles estabelecidos neste normativo.":i===3?"A área gestora responde pela atualização do conteúdo, orientação aos envolvidos e manutenção das evidências necessárias.":"Os registros devem ser preservados durante todo o período de vigência e disponibilizados quando solicitados pelas áreas de controle."}</p></section>)}</article><section className="bg-card border rounded-xl max-w-[820px] mx-auto mt-5 p-5"><div className="flex justify-between mb-4"><div><h3 className="text-sm font-semibold">Anexos</h3><p className="text-[10px] text-muted-foreground mt-1">Arquivos oficiais vinculados a esta publicação.</p></div></div>{[["Matriz_de_responsabilidades.pdf","PDF · 860 KB"],["Modelo_de_registro.xlsx","Excel · 124 KB"]].map(([name,meta])=><div key={name} className="flex items-center gap-3 py-3 border-t"><div className="w-8 h-8 rounded-lg bg-primary/5 text-primary flex items-center justify-center"><FileText className="h-4 w-4"/></div><div className="flex-1"><div className="text-[11px] font-medium">{name}</div><div className="text-[9px] text-muted-foreground">{meta}</div></div><button className="h-8 px-3 border rounded-lg text-[10px] flex items-center gap-2"><Download className="h-3.5 w-3.5"/> Baixar</button></div>)}</section></main></div></div>
  </div>
}

function MetricCard({ label, value, detail, tone="default" }: { label: string; value: string; detail: string; tone?: string }) {
  return <div className="bg-card border rounded-xl p-4"><div className="text-[11px] text-muted-foreground mb-2">{label}</div><div className={cn("text-2xl font-semibold",tone==="danger"?"text-red-600":tone==="warning"?"text-amber-600":"text-foreground")}>{value}</div><div className="text-[10px] text-muted-foreground mt-1">{detail}</div></div>;
}

function FlowView({ onOpenDemand }: { onOpenDemand: (id:string)=>void }) {
  const stages = [["Abertura",6,28],["Elaboração",12,55],["Validação",9,42],["Aprovação",5,24],["Publicação",3,15]] as const;
  return <div className="max-w-[1240px] mx-auto p-8 animate-fade-in"><ViewHeader title="Gestão do fluxo" description="Identifique gargalos, intervenha em bloqueios e proteja os SLAs do processo." action={<button className="h-9 px-3 border rounded-lg text-xs flex items-center gap-2"><Download className="h-4 w-4"/> Exportar</button>}/><div className="grid grid-cols-5 gap-3 mb-5"><MetricCard label="Demandas ativas" value="35" detail="+4 neste mês"/><MetricCard label="No prazo" value="84%" detail="Meta: 90%"/><MetricCard label="Em risco" value="7" detail="20% da fila" tone="warning"/><MetricCard label="Atrasadas" value="5" detail="2 críticas" tone="danger"/><MetricCard label="Bloqueadas" value="3" detail="Exigem intervenção" tone="danger"/></div><div className="grid grid-cols-[1.2fr_.8fr] gap-5 mb-5"><div className="bg-card border rounded-xl p-5"><div className="flex justify-between mb-6"><h3 className="text-sm font-semibold">Demandas por etapa</h3><button className="text-xs text-muted-foreground flex gap-1">Últimos 30 dias<ChevronDown className="h-3.5 w-3.5"/></button></div><div className="space-y-4">{stages.map(([label,value,width])=><div key={label} className="grid grid-cols-[100px_1fr_28px] gap-3 items-center"><span className="text-xs text-muted-foreground">{label}</span><div className="h-7 bg-muted rounded-md overflow-hidden"><div style={{width:`${width}%`}} className="h-full bg-primary/80 rounded-md"/></div><span className="text-xs font-semibold">{value}</span></div>)}</div></div><div className="bg-card border rounded-xl p-5"><h3 className="text-sm font-semibold mb-5">Principais gargalos</h3>{[["Validação jurídica","4,8 dias","+1,8 acima do SLA"],["Aprovação da VP","3,2 dias","+0,7 acima do SLA"],["Ajustes da área gestora","2,9 dias","12 devoluções"]].map(([stage,time,reason],i)=><div key={stage} className="flex gap-3 py-3 border-b last:border-0"><div className={cn("w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold",i===0?"bg-red-50 text-red-600":"bg-amber-50 text-amber-700")}>{i+1}</div><div className="flex-1"><div className="text-xs font-medium">{stage}</div><div className="text-[10px] text-muted-foreground">{reason}</div></div><div className="text-xs font-semibold">{time}</div></div>)}</div></div><div className="bg-card border rounded-xl overflow-hidden"><div className="p-5 border-b flex justify-between"><div><h3 className="text-sm font-semibold">Demandas que precisam de intervenção</h3><p className="text-xs mt-1">Ordenadas por criticidade e tempo sem movimentação.</p></div><button className="text-xs text-primary font-medium">Ver todas</button></div>{demands.filter(x=>x.health!=="No prazo").map(d=><button key={d.id} onClick={()=>onOpenDemand(d.id)} className="w-full px-5 py-3.5 border-b last:border-0 flex items-center text-left hover:bg-muted/40"><AlertTriangle className={cn("h-4 w-4 mr-3",d.health==="Bloqueada"?"text-red-600":"text-amber-600")}/><div className="flex-1"><div className="text-xs font-medium">{d.id} · {d.title}</div><div className="text-[10px] text-muted-foreground mt-1">{d.stage} · Responsável: {d.owner}</div></div><StatusPill value={d.health}/><span className="text-xs ml-5 w-16 text-right">{d.due}</span><ChevronRight className="h-4 w-4 text-muted-foreground ml-3"/></button>)}</div></div>;
}

function ValidityView() {
  return <div className="max-w-[1240px] mx-auto p-8 animate-fade-in"><ViewHeader title="Gestão da vigência" description="Antecipe revisões, evite documentos desatualizados e acompanhe a saúde do acervo." action={<button className="h-9 px-3 border rounded-lg text-xs flex items-center gap-2"><RefreshCcw className="h-4 w-4"/> Atualizar dados</button>}/><div className="grid grid-cols-5 gap-3 mb-5"><MetricCard label="Base normativa" value="143" detail="Documentos publicados"/><MetricCard label="Vigentes" value="134" detail="93,7% da base"/><MetricCard label="Próximos do vencimento" value="12" detail="Nos próximos 90 dias" tone="warning"/><MetricCard label="Vencidos" value="4" detail="2 sem revisão" tone="danger"/><MetricCard label="Revisões abertas" value="7" detail="3 em risco"/></div><div className="grid grid-cols-[.8fr_1.2fr] gap-5"><div className="bg-card border rounded-xl p-5"><h3 className="text-sm font-semibold mb-1">Calendário de vencimentos</h3><p className="text-xs mb-5">Distribuição dos próximos 90 dias.</p>{[["Até 30 dias",4,"bg-red-500","33%"],["31 a 60 dias",3,"bg-amber-500","25%"],["61 a 90 dias",5,"bg-blue-500","42%"]].map(([label,value,color,width])=><div key={label as string} className="mb-5"><div className="flex justify-between text-xs mb-2"><span>{label as string}</span><span className="font-semibold">{value as number}</span></div><div className="h-2 bg-muted rounded-full"><div className={cn("h-full rounded-full",color as string)} style={{width:width as string}}/></div></div>)}<div className="border-t pt-4 mt-6"><div className="flex justify-between"><span className="text-xs text-muted-foreground">Saúde do acervo</span><span className="text-xs font-semibold text-emerald-600">Boa</span></div><div className="h-2 bg-muted rounded-full mt-2"><div className="h-full bg-emerald-500 rounded-full w-[94%]"/></div></div></div><div className="bg-card border rounded-xl overflow-hidden"><div className="p-5 border-b"><h3 className="text-sm font-semibold">Prioridades de revisão</h3><p className="text-xs mt-1">Documentos ordenados por vencimento e criticidade.</p></div>{[["NOR-0018","Segurança operacional","Vencido há 12 dias","Sem revisão aberta","Vencido"],["POL-0009","Política anticorrupção","Vence em 8 dias","Revisão em validação","Próximo do vencimento"],["PRO-0026","Gestão de terceiros","Vence em 21 dias","Sem revisão aberta","Próximo do vencimento"],["IT-0142","Acesso a áreas restritas","Vence em 44 dias","Revisão em elaboração","No prazo"]].map(([id,title,due,review,status])=><div key={id} className="p-4 border-b last:border-0 flex items-center"><CalendarClock className="h-4 w-4 text-muted-foreground mr-3"/><div className="flex-1"><div className="text-xs font-medium">{id} · {title}</div><div className="text-[10px] text-muted-foreground mt-1">{due} · {review}</div></div><StatusPill value={status}/><button className="ml-4 h-8 px-3 border rounded-lg text-[11px]">{review==="Sem revisão aberta"?"Iniciar revisão":"Acompanhar"}</button></div>)}</div></div></div>;
}

function SettingsView() {
  const groups = [[FileText,"Tipos e documentos","Tipos, códigos, templates, campos e playbooks","4 tipos ativos"],[Workflow,"Fluxos e alçadas","Roteamento, validadores e níveis de aprovação","4 fluxos publicados"],[Clock3,"Prazos e SLAs","Prazos por etapa, alertas e escalonamentos","2 regras em atenção"],[UserRound,"Pessoas e acessos","Perfis, áreas, responsáveis e delegações","8 perfis"],[Bell,"Notificações","Templates, canais e frequência de follow-up","12 automações"],[Bot,"Inteligência artificial","Critérios de qualidade e validações assistidas","6 análises ativas"],[Archive,"Publicação e ciclo de vida","Vigência, revisão, revogação e arquivamento","7 regras"],[SlidersHorizontal,"Integrações","SharePoint, DocuSign, Aprova e e-mail","3 conectadas"]] as const;
  return <div className="max-w-[1120px] mx-auto p-8 animate-fade-in"><ViewHeader title="Configurações" description="Administre as regras que governam o ciclo de vida dos normativos."/><div className="bg-amber-50 border border-amber-100 rounded-xl p-4 flex gap-3 mb-5"><AlertTriangle className="h-5 w-5 text-amber-700"/><div><div className="text-xs font-semibold text-amber-900">Alterações podem afetar demandas em andamento</div><p className="text-xs text-amber-800 mt-1">O sistema mostrará o impacto antes de publicar qualquer mudança.</p></div></div><div className="grid grid-cols-2 gap-4">{groups.map(([Icon,title,desc,meta])=><button key={title} className="bg-card border rounded-xl p-5 text-left flex gap-4 hover:border-primary/35 hover:shadow-sm"><div className="w-10 h-10 bg-primary/5 text-primary rounded-xl flex items-center justify-center"><Icon className="h-5 w-5"/></div><div className="flex-1"><h3 className="text-sm font-semibold mb-1">{title}</h3><p className="text-xs leading-5">{desc}</p><div className="text-[10px] text-primary font-medium mt-3">{meta}</div></div><ChevronRight className="h-4 w-4 text-muted-foreground mt-1"/></button>)}</div><div className="bg-card border rounded-xl p-5 mt-5 flex items-center"><div className="w-10 h-10 bg-muted rounded-xl flex items-center justify-center"><History className="h-5 w-5 text-muted-foreground"/></div><div className="ml-4 flex-1"><h3 className="text-sm font-semibold">Histórico de configurações</h3><p className="text-xs mt-1">Consulte quem alterou cada regra, quando e qual foi o impacto.</p></div><button className="h-9 px-3 border rounded-lg text-xs">Abrir histórico</button></div></div>;
}

function NewDemandDialog({ open, onOpenChange, onComplete }: { open: boolean; onOpenChange: (v:boolean)=>void; onComplete:()=>void }) {
  const [step,setStep]=useState(1); const [kind,setKind]=useState("create");
  const steps=["Solicitação","Identificação","Responsáveis","Documento","Revisão"];
  return <Dialog open={open} onOpenChange={(v)=>{onOpenChange(v);if(!v)setStep(1)}}><DialogContent className="max-w-[900px] p-0 overflow-hidden rounded-2xl border-0">
    <div className="grid grid-cols-[220px_1fr] min-h-[620px]"><aside className="bg-[#0B1D48] text-white p-6"><div className="text-[10px] uppercase tracking-widest text-white/50 font-semibold mb-2">Nova demanda</div><h2 className="text-lg text-white font-semibold mb-8">Vamos estruturar sua solicitação</h2><div className="space-y-5">{steps.map((label,i)=><div key={label} className="flex gap-3 items-center"><div className={cn("w-7 h-7 rounded-full flex items-center justify-center text-xs",step>i+1?"bg-emerald-500 text-white":step===i+1?"bg-white text-[#0B1D48]":"bg-white/10 text-white/50")}>{step>i+1?<CheckCircle2 className="h-4 w-4"/>:i+1}</div><span className={cn("text-xs",step===i+1?"text-white font-medium":"text-white/55")}>{label}</span></div>)}</div><div className="mt-12 p-3 rounded-lg bg-white/5"><div className="flex gap-2 text-xs font-medium mb-1"><Sparkles className="h-4 w-4"/> Assistente ativo</div><p className="text-[10px] text-white/55 leading-4">Validaremos classificação e sobreposições durante o preenchimento.</p></div></aside><section className="p-8 flex flex-col"><div className="flex-1">
      {step===1&&<div><div className="section-title mb-2">Etapa 1 de 5</div><h2 className="text-xl font-semibold mb-2">O que você precisa fazer?</h2><p className="text-sm mb-6">Escolha a opção que melhor representa sua necessidade.</p><div className="grid grid-cols-2 gap-3">{[["create","Criar novo normativo","Começar um documento do zero."],["review","Revisar existente","Atualizar conteúdo ou regras."],["renew","Renovar sem alterações","Revalidar a versão vigente."],["revoke","Revogar normativo","Encerrar a validade de um documento."]].map(([id,title,desc])=><button key={id} onClick={()=>setKind(id)} className={cn("rounded-xl border p-4 text-left",kind===id?"border-primary bg-primary/5 ring-1 ring-primary/15":"hover:border-primary/30")}><div className="flex justify-between"><div className="w-8 h-8 bg-muted rounded-lg flex items-center justify-center mb-4"><FileClock className="h-4 w-4 text-primary"/></div>{kind===id&&<CheckCircle2 className="h-5 w-5 text-primary"/>}</div><h3 className="text-sm font-semibold mb-1">{title}</h3><p className="text-xs">{desc}</p></button>)}</div></div>}
      {step===2&&<div><div className="section-title mb-2">Etapa 2 de 5</div><h2 className="text-xl font-semibold mb-2">Identifique o normativo</h2><p className="text-sm mb-6">Essas informações definem o template, a vigência e o fluxo.</p><div className="grid grid-cols-2 gap-5"><Field label="Tipo documental" value="Procedimento (PRO)"/><Field label="Título" value="Novo procedimento corporativo"/><Field label="Empresa" value="AXIA Energia"/><Field label="Vice-presidência" value="VP Operações"/><Field label="Área gestora" value="Suprimentos"/><Field label="Processo corporativo" value="Gestão de fornecedores"/></div><div className="mt-5 p-3 bg-blue-50 rounded-lg flex gap-3"><Sparkles className="h-4 w-4 text-primary mt-0.5"/><p className="text-xs text-blue-800">Classificação adequada. Não identificamos sobreposição crítica até o momento.</p></div></div>}
      {step===3&&<div><div className="section-title mb-2">Etapa 3 de 5</div><h2 className="text-xl font-semibold mb-2">Defina os responsáveis</h2><p className="text-sm mb-6">Alguns dados foram preenchidos com base na estrutura organizacional.</p><div className="grid grid-cols-2 gap-5"><Field label="Solicitante" value="Patrícia Lima"/><Field label="Responsável pelo conteúdo" value="Patrícia Lima"/><Field label="Analista de Normativos" value="Carlos Silva"/><Field label="Nível de acesso" value="Interno"/></div><div className="mt-6 border rounded-xl p-4"><div className="text-xs font-semibold mb-3">Fluxo previsto</div><div className="flex items-center text-[11px]">{["Normativos","Jurídico","Vice-presidência","Publicação"].map((x,i)=><div key={x} className="flex items-center flex-1 last:flex-none"><span className="px-3 py-2 bg-muted rounded-lg">{x}</span>{i<3&&<ArrowRight className="h-3.5 w-3.5 mx-2 text-muted-foreground"/>}</div>)}</div></div></div>}
      {step===4&&<div><div className="section-title mb-2">Etapa 4 de 5</div><h2 className="text-xl font-semibold mb-2">Inclua o documento</h2><p className="text-sm mb-6">Use o template recomendado ou importe uma minuta existente.</p><div className="grid grid-cols-2 gap-4"><button className="border-2 border-primary bg-primary/5 rounded-xl p-6 text-left"><FileText className="h-6 w-6 text-primary mb-4"/><h3 className="text-sm font-semibold mb-1">Usar template padrão</h3><p className="text-xs">PRO · Estrutura corporativa atual</p></button><button className="border border-dashed rounded-xl p-6 text-left hover:border-primary"><Download className="h-6 w-6 text-muted-foreground mb-4 rotate-180"/><h3 className="text-sm font-semibold mb-1">Importar uma minuta</h3><p className="text-xs">Word ou PDF · até 20 MB</p></button></div><div className="mt-5 border rounded-xl p-4 flex items-center"><Paperclip className="h-4 w-4 text-primary mr-3"/><div className="flex-1"><div className="text-xs font-medium">Documentos complementares</div><div className="text-[10px] text-muted-foreground">Adicione evidências, pareceres ou referências.</div></div><button className="text-xs text-primary font-medium">Adicionar</button></div></div>}
      {step===5&&<div><div className="section-title mb-2">Etapa 5 de 5</div><h2 className="text-xl font-semibold mb-2">Revise antes de enviar</h2><p className="text-sm mb-6">Confira o fluxo e os dados que serão registrados.</p><div className="border rounded-xl divide-y">{[["Solicitação","Criar novo normativo"],["Identificação","PRO · Novo procedimento corporativo"],["Área gestora","Suprimentos · VP Operações"],["Fluxo","Normativos → Jurídico → Vice-presidência"],["Vigência","3 anos após a publicação"]].map(([k,v])=><div key={k} className="flex px-4 py-3"><span className="text-xs text-muted-foreground w-32">{k}</span><span className="text-xs font-medium">{v}</span></div>)}</div><div className="mt-5 bg-emerald-50 border border-emerald-100 rounded-xl p-4 flex gap-3"><CheckCircle2 className="h-5 w-5 text-emerald-600"/><div><div className="text-xs font-semibold text-emerald-800">Tudo pronto para enviar</div><p className="text-xs text-emerald-700 mt-1">O código PRO-0043 será criado e Carlos Silva receberá a primeira tarefa.</p></div></div></div>}
    </div><div className="pt-6 border-t mt-6 flex justify-between"><button onClick={()=>step===1?onOpenChange(false):setStep(step-1)} className="h-9 px-4 border rounded-lg text-xs">{step===1?"Cancelar":"Voltar"}</button><button onClick={()=>step===5?onComplete():setStep(step+1)} className="h-9 px-5 bg-primary text-white rounded-lg text-xs font-medium flex items-center gap-2">{step===5?"Criar e enviar":"Continuar"}<ArrowRight className="h-4 w-4"/></button></div></section></div>
  </DialogContent></Dialog>;
}

function Field({ label, value }: { label:string; value:string }) {
  return <label><span className="text-xs font-medium block mb-1.5">{label}</span><div className="h-10 border rounded-lg px-3 flex items-center justify-between text-xs bg-card">{value}<ChevronDown className="h-3.5 w-3.5 text-muted-foreground"/></div></label>;
}
