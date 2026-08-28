import { useMemo } from "react";
import {
  Target,
  Sparkle,
  Building2,
  Network,
  ArrowLeftRight,
  Users,
  CalendarClock,
  Gauge,
  UserSquare2,
  Flag,
  StickyNote,
  Database,
  MonitorSmartphone,
  AlertCircle,
  Play,
  Workflow,
  User,
  ChevronRight,
} from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { buildMockPreMapping } from "@/components/process/PreMappingView";
import { useTaxonomy } from "@/stores/taxonomyStore";

interface SheetProcess {
  name: string;
  area: string;
  description: string;
  executor?: string;
  approver?: string;
  frequency?: string;
  avgTime?: string;
  owner?: string;
  systems?: string[];
  kpis?: string;
  l1?: string;
  l2?: string;
  l3?: string;
  l4?: string;
}

const isSpanLayer = (name: string) => /span\s*[&e]?\s*layer/i.test(name || "");

const ROLES = ["Analista", "Analista", "Analista", "Analista", "Coordenador", "Analista", "Coordenador"];

export function ProcessSheet({ process }: { process: SheetProcess }) {
  const { language } = useLanguage();
  const pt = language === "PT";
  const { label: lvl, hasLevel } = useTaxonomy();

  const scope = useMemo(
    () =>
      buildMockPreMapping({
        name: process.name,
        description: process.description,
        area: process.area,
        systems: process.systems || [],
      }),
    [process.name, process.description, process.area, process.systems]
  );

  const demo = isSpanLayer(process.name);
  const isProduzirOriginais = /produzir\s+origin/i.test(process.name || "");

  const extra = isProduzirOriginais
    ? {
        bu: "Somos",
        l1: process.l1 || "Editorial",
        l2: process.l2 || "Jornada de Construção do Produto",
        l3: process.l3 || "Planejar ciclo de produção de conteúdo",
        predecessor: "Elaborar ementa",
        successor: "Revisar conteúdo",
        management: "Coordenação PROFS",
        frequency: process.frequency || "Semanal",
        complexity: pt ? "Skill-Based · Alto grau de manualização" : "Skill-Based · Highly manual",
        fte: "0,05 FTE",
        okr: pt
          ? "Core — PV2: Ser uma fábrica de conteúdo de ensino e aprendizagem"
          : "Core — PV2: Be a teaching and learning content factory",
        notes: pt
          ? "Execução centralizada na Coordenação PROFS, com baixo suporte de soluções analíticas. As datas do cronograma de produção são consultadas em planilha Excel e sustentam as decisões de início e prazo de entrega do conteúdo."
          : "Execution centralized in the PROFS Coordination, with low analytical support. Production schedule dates are tracked in an Excel spreadsheet and drive start and delivery deadline decisions.",
      }
    : demo

    ? {
        bu: "Corporate Functions — People & Organization",
        l1: process.l1 || "Gestão de Pessoas (H2R)",
        l2: process.l2 || "Organizational Design",
        l3: process.l3 || "Análise de Estrutura Organizacional",
        predecessor: "Atualização da estrutura organizacional no Workday",
        successor: "Planejamento de Força de Trabalho",
        management: "Gerência de People Analytics & Org Design",
        frequency: process.frequency || "Trimestral",
        complexity: pt ? "Alta" : "High",
        fte: "1,8 FTE",
        okr: pt
          ? "Reduzir camadas hierárquicas médias de 7 para 5 e elevar o span médio de gestão para 6 liderados até o fim do ciclo"
          : "Reduce average hierarchy layers from 7 to 5 and raise average management span to 6 direct reports by end of cycle",
        notes: pt
          ? "Processo altamente dependente de tratamento manual de bases do Workday. Priorizado na esteira de transformação para automação e dashboard dinâmico."
          : "Highly dependent on manual handling of Workday data. Prioritized in the transformation pipeline for automation and a dynamic dashboard.",
      }
    : {
        bu: process.area || "—",
        l1: process.l1 || "—",
        l2: process.l2 || "—",
        l3: process.l3 || "—",
        predecessor: "—",
        successor: "—",
        management: process.owner || "—",
        frequency: process.frequency || "—",
        complexity: pt ? "Média" : "Medium",
        fte: "—",
        okr: "—",
        notes: "—",
      };

  const fields: { icon: typeof Target; label: string; value: string }[] = [
    { icon: Building2, label: "Business Unit", value: extra.bu },
    { icon: UserSquare2, label: pt ? "Gerência dona" : "Owning management", value: extra.management },
    { icon: CalendarClock, label: pt ? "Frequência" : "Frequency", value: extra.frequency },
    { icon: Gauge, label: pt ? "Complexidade" : "Complexity", value: extra.complexity },
    { icon: Users, label: "Head Count (FTE)", value: extra.fte },
    { icon: ArrowLeftRight, label: pt ? "Processo predecessor" : "Predecessor process", value: extra.predecessor },
    { icon: Flag, label: pt ? "Processo sucessor" : "Successor process", value: extra.successor },
    {
      icon: Network,
      label: pt ? "Alocação na arquitetura" : "Architecture allocation",
      value: [
        `${lvl("l1")} · ${extra.l1}`,
        hasLevel("l2") ? `${lvl("l2")} · ${extra.l2}` : null,
        hasLevel("l3") ? `${lvl("l3")} · ${extra.l3}` : null,
      ]
        .filter(Boolean)
        .join("\n"),
    },
  ];

  const listCard = (
    Icon: typeof Target,
    title: string,
    items: string[],
    dotClass: string
  ) => (
    <div className="bg-card border border-border rounded-xl p-5">
      <div className="flex items-center gap-2 mb-3">
        <Icon className="h-4 w-4 text-primary" />
        <h3 className="text-[13px] font-semibold text-foreground">{title}</h3>
      </div>
      <ul className="space-y-2">
        {items.map((it, i) => (
          <li key={i} className="flex gap-2 text-[13px] text-muted-foreground leading-relaxed">
            <span className={`mt-[6px] h-1.5 w-1.5 rounded-full shrink-0 ${dotClass}`} />
            <span>{it}</span>
          </li>
        ))}
        {items.length === 0 && <li className="text-[13px] text-muted-foreground italic">—</li>}
      </ul>
    </div>
  );

  return (
    <div className="space-y-5">
      {/* Section title */}
      <div className="flex items-center gap-2">
        <h2 className="text-[11px] font-semibold uppercase tracking-[0.5px] text-muted-foreground">
          {pt ? "FICHA DO PROCESSO" : "PROCESS DATASHEET"}
        </h2>
      </div>

      {/* Objetivo / Proposta de valor / Início / Fim */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[
          { icon: Target, label: pt ? "Objetivo" : "Objective", value: scope.objetivo },
          { icon: Sparkle, label: pt ? "Proposta de valor" : "Value proposition", value: scope.proposta },
        ].map((c) => {
          const Icon = c.icon;
          return (
            <div key={c.label} className="bg-card border border-border rounded-xl p-5">
              <div className="flex items-center gap-2 mb-2">
                <Icon className="h-4 w-4 text-primary" />
                <h3 className="text-[12px] font-semibold text-foreground">{c.label}</h3>
              </div>
              <p className="text-[13px] text-muted-foreground leading-relaxed">{c.value}</p>
            </div>
          );
        })}
      </div>

      {/* Structured fields grid */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 divide-border">
          {fields.map((f) => {
            const Icon = f.icon;
            return (
              <div
                key={f.label}
                className="p-5 border-border sm:border-b sm:border-r last:border-r-0 lg:[&:nth-child(4n)]:border-r-0 lg:[&:nth-child(n+5)]:border-b-0"
              >
                <div className="flex items-center gap-1.5 mb-1.5">
                  <Icon className="h-3.5 w-3.5 text-muted-foreground" />
                  <p className="text-[10px] uppercase tracking-[0.5px] text-muted-foreground">{f.label}</p>
                </div>
                <p className="text-[13px] font-medium text-foreground whitespace-pre-line leading-relaxed">
                  {f.value}
                </p>
              </div>
            );
          })}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 border-t border-border">
          <div className="p-5 md:border-r border-border">
            <div className="flex items-center gap-1.5 mb-1.5">
              <Target className="h-3.5 w-3.5 text-muted-foreground" />
              <p className="text-[10px] uppercase tracking-[0.5px] text-muted-foreground">
                {pt ? "OKR associado" : "Associated OKR"}
              </p>
            </div>
            <p className="text-[13px] text-foreground leading-relaxed">{extra.okr}</p>
          </div>
          <div className="p-5 border-t md:border-t-0 border-border">
            <div className="flex items-center gap-1.5 mb-1.5">
              <StickyNote className="h-3.5 w-3.5 text-muted-foreground" />
              <p className="text-[10px] uppercase tracking-[0.5px] text-muted-foreground">
                {pt ? "Observações gerais" : "General notes"}
              </p>
            </div>
            <p className="text-[13px] text-foreground leading-relaxed">{extra.notes}</p>
          </div>
        </div>
      </div>

      {/* Process flow */}
      <div className="bg-card border border-border rounded-xl p-6">
        <div className="flex items-start gap-3 mb-5">
          <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
            <Workflow className="h-4 w-4 text-primary" />
          </div>
          <div>
            <h3 className="text-[15px] font-semibold text-foreground">
              {pt ? "Fluxo do processo" : "Process flow"}
            </h3>
            <p className="text-[12px] text-muted-foreground">
              {pt
                ? "Sequência visual do processo, conectando eventos, dados e atividades."
                : "Visual sequence of the process, connecting events, data and activities."}
            </p>
          </div>
        </div>

        <div className="bg-surface-subtle border border-border rounded-xl p-4">
          <div className="flex items-stretch gap-3 overflow-x-auto pb-2">
            {/* Start event */}
            <div className="shrink-0 w-[200px] bg-card border border-border rounded-xl p-4 flex flex-col items-center justify-center text-center">
              <div className="h-10 w-10 rounded-full border-2 border-primary/40 flex items-center justify-center mb-3">
                <Play className="h-4 w-4 text-primary" />
              </div>
              <p className="text-[9px] font-bold uppercase tracking-[0.6px] text-primary mb-1.5">
                {pt ? "Evento de início" : "Start event"}
              </p>
              <p className="text-[13px] font-semibold text-foreground leading-snug">{scope.inicio}</p>
            </div>

            <div className="flex items-center shrink-0">
              <ChevronRight className="h-4 w-4 text-muted-foreground/50" />
            </div>

            {/* Source */}
            <div className="shrink-0 w-[220px] bg-card border border-border rounded-xl p-4">
              <div className="flex items-center gap-2 mb-3">
                <Building2 className="h-4 w-4 text-primary" />
                <h4 className="text-[13px] font-semibold text-foreground">
                  {pt ? "Origem" : "Source"}
                </h4>
              </div>
              <p className="text-[12px] text-muted-foreground leading-snug">{scope.origem}</p>
            </div>

            <div className="flex items-center shrink-0">
              <ChevronRight className="h-4 w-4 text-muted-foreground/50" />
            </div>

            {/* Data input card */}
            <div className="shrink-0 w-[230px] bg-card border border-border rounded-xl p-4">
              <div className="flex items-center gap-2 mb-3">
                <Database className="h-4 w-4 text-primary" />
                <h4 className="text-[13px] font-semibold text-foreground">
                  {pt ? "Entrada de dados" : "Data input"}
                </h4>
              </div>
              <ul className="space-y-1.5">
                {scope.entradas.map((e, i) => (
                  <li key={i} className="flex gap-2 text-[12px] text-muted-foreground leading-snug">
                    <span className="mt-[6px] h-1 w-1 rounded-full bg-primary shrink-0" />
                    <span>{e}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex items-center shrink-0">
              <ChevronRight className="h-4 w-4 text-muted-foreground/50" />
            </div>

            {/* Steps */}
            {scope.atividades.map((act, i) => (
              <div key={i} className="flex items-stretch shrink-0">
                <div className="w-[240px] bg-emerald-50/60 border border-emerald-200 rounded-xl p-4 flex flex-col">
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="h-6 w-6 rounded-full bg-emerald-600 text-white text-[11px] font-bold flex items-center justify-center shrink-0">
                      {i + 1}
                    </span>
                    <span className="text-[9px] font-bold uppercase tracking-[0.6px] text-emerald-700">
                      {pt ? "Etapa" : "Step"}
                    </span>
                  </div>
                  <p className="text-[13px] font-semibold text-foreground leading-snug mb-2">
                    {act.name}
                  </p>
                  <div className="mt-auto pt-2 border-t border-emerald-200/70 space-y-1.5">
                    <div className="flex items-center gap-1.5 text-[12px] text-muted-foreground">
                      <User className="h-3.5 w-3.5 shrink-0" />
                      <span>{scope.papeis?.[i] ?? ROLES[i] ?? "Analista"}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-[12px] text-muted-foreground">
                      <MonitorSmartphone className="h-3.5 w-3.5 shrink-0" />
                      <span>
                        {act.systems.length > 0
                          ? act.systems.map((s) => scope.systems[s - 1] ?? `Sistema ${s}`).join(", ")
                          : pt
                          ? "Sem sistema informado"
                          : "No system informed"}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center px-1.5">
                  <ChevronRight className="h-4 w-4 text-muted-foreground/50" />
                </div>
              </div>
            ))}

            {/* Outputs */}
            <div className="shrink-0 w-[230px] bg-card border border-border rounded-xl p-4">
              <div className="flex items-center gap-2 mb-3">
                <Flag className="h-4 w-4 text-emerald-600" />
                <h4 className="text-[13px] font-semibold text-foreground">
                  {pt ? "Saídas do processo" : "Process outputs"}
                </h4>
              </div>
              <ul className="space-y-1.5">
                {scope.saidas.map((o, i) => (
                  <li key={i} className="flex gap-2 text-[12px] text-muted-foreground leading-snug">
                    <span className="mt-[6px] h-1 w-1 rounded-full bg-emerald-500 shrink-0" />
                    <span>{o}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex items-center shrink-0">
              <ChevronRight className="h-4 w-4 text-muted-foreground/50" />
            </div>

            {/* Destination */}
            <div className="shrink-0 w-[220px] bg-card border border-border rounded-xl p-4">
              <div className="flex items-center gap-2 mb-3">
                <Users className="h-4 w-4 text-primary" />
                <h4 className="text-[13px] font-semibold text-foreground">
                  {pt ? "Destino" : "Destination"}
                </h4>
              </div>
              <p className="text-[12px] text-muted-foreground leading-snug">{scope.destino}</p>
            </div>

            <div className="flex items-center shrink-0">
              <ChevronRight className="h-4 w-4 text-muted-foreground/50" />
            </div>

            {/* End event */}
            <div className="shrink-0 w-[200px] bg-card border-2 border-emerald-300 rounded-xl p-4 flex flex-col items-center justify-center text-center">
              <div className="h-10 w-10 rounded-full border-2 border-emerald-400 flex items-center justify-center mb-3">
                <Flag className="h-4 w-4 text-emerald-600" />
              </div>
              <p className="text-[9px] font-bold uppercase tracking-[0.6px] text-emerald-700 mb-1.5">
                {pt ? "Evento de fim" : "End event"}
              </p>
              <p className="text-[13px] font-semibold text-foreground leading-snug">{scope.fim}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Outputs / Systems / Pains */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {listCard(MonitorSmartphone, pt ? "Sistemas utilizados" : "Systems used", scope.systems, "bg-primary")}
        {listCard(AlertCircle, pt ? "Dores" : "Pain points", scope.dores, "bg-red-500")}
      </div>
    </div>
  );
}
