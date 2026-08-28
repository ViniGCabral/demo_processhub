import React from "react";
import { Sparkles, Lock, Target, Sparkle, Play, Flag, ArrowRight, ArrowLeft, Workflow, AlertTriangle } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { BacklogTag } from "@/components/common/BacklogTag";

const PRIMARY = "#0C1BA8";

export interface PreMappingData {
  name: string;
  description: string;
  area: string;
  systems: string[];
  objetivo: string;
  proposta: string;
  inicio: string;
  fim: string;
  origem: string;
  destino: string;
  entradas: string[];
  saidas: string[];
  atividades: { name: string; systems: number[] }[];
  dores: string[];
  papeis?: string[];
}

export function buildMockPreMapping(input: { name: string; description: string; area: string; systems: string[] }): PreMappingData {
  const subject = input.name || "Processo";

  if (/produzir\s+origin/i.test(subject)) {
    return {
      ...input,
      systems: ["Word", "E-mail", "Cronograma (Excel)"],
      objetivo: "Produzir conteúdo para os novos cursos da plataforma PROFS.",
      proposta:
        "Garantir a produção do original do curso dentro do cronograma e no padrão editorial definido, entregando conteúdo pronto para revisão.",
      inicio: "Ementa do curso aprovada e cronograma de produção definido",
      fim: "Original produzido e ajustado pelo autor, enviado para revisão de conteúdo",
      origem: "Coordenação PROFS — a partir dos processos 'Planejar cronograma de produção' e 'Elaborar ementa'",
      destino: "Coordenação PROFS — processo 'Revisar conteúdo'",
      entradas: [
        "Planejamento do cronograma (Coordenação PROFS)",
        "Elaboração da Ementa do curso (Coordenação PROFS)",
        "Template parametrizado para a criação do conteúdo (Coordenação PROFS)",
      ],
      saidas: [
        "Original do curso produzido pelo autor",
        "Realização de ajuste final pelo autor",
      ],
      atividades: [
        { name: "Realizar download do template parametrizado", systems: [1, 2] },
        { name: "Produzir original", systems: [1, 2] },
        { name: "Realizar ajustes", systems: [1, 2] },
      ],
      papeis: ["Autor", "Autor", "Autor"],
      dores: [
        "Atrasos na entrega final do conteúdo pelo autor",
        "Orçamento reduzido impacta no trabalho do autor",
      ],
    };
  }

  if (/span\s*[&e]?\s*layer/i.test(subject)) {

    return {
      ...input,
      systems: ["Workday", "Google Sheets", "Google Apresentações"],
      objetivo:
        "Mapear e analisar a estrutura organizacional da Natura com base em Span of Control e Layer, gerando insights para decisões de design, dimensionamento e eficiência da gestão.",
      proposta:
        "Transformar dados da estrutura hierárquica em diagnósticos acionáveis sobre eficiência organizacional, apoiando decisões de redesenho, redução de camadas e otimização da relação gestor-liderado com base em dados.",
      inicio: "Ciclo recorrente trimestral de report",
      fim: "Relatório de Span & Layer validado, aprovado e entregue às lideranças de RH para subsidiar decisão",
      origem:
        "Área de Organizational Design / People Analytics dentro do RH, acionada por demanda da liderança executiva, ciclo de planejamento de força de trabalho ou processo de revisão estrutural",
      destino:
        "CHRO, liderança executiva (C-level e Diretores), HRBPs das áreas e time de Org Design para subsidiar decisões de estrutura organizacional",
      entradas: [
        "Relatório \"Open Filed Positions Master\" (Workday)",
        "Relatório \"Supervisory Organization\" (Workday)",
        "Informações de custos imputado pelo time de custos",
      ],
      saidas: [
        "Relatório de Span of Control por gestor, nível e área",
        "Mapeamento de layers hierárquicos por BU e função",
        "Diagnóstico de desvios vs benchmark com áreas críticas priorizadas",
      ],
      atividades: [
        { name: "Definição de escopo e parâmetros da análise", systems: [] },
        { name: "Extração da estrutura organizacional do Workday", systems: [1] },
        { name: "Tratamento e limpeza dos dados extraídos", systems: [2] },
        { name: "Cálculo do Span of Control por gestor e área", systems: [2] },
        { name: "Construção do relatório e visualizações", systems: [3] },
        { name: "Revisão e aprovação do relatório", systems: [] },
        { name: "Apresentação à liderança e registro de decisões", systems: [3] },
      ],
      dores: [
        "Cruzamento manual de bases sem integração, sujeito a erros de DE/PARA",
        "Dados da base com baixa confiabilidade e qualidade",
        "Análise estática com alto esforço operacional para geração",
        "Análises por área e benchmarking de mercado não dinâmicos",
      ],
    };
  }

  return {
    ...input,
    objetivo: `Estruturar e padronizar o processo "${subject}" garantindo qualidade, rastreabilidade e suporte à tomada de decisão.`,
    proposta: "Transformar atividades dispersas em fluxo consolidado e acionável, acelerando a entrega e reduzindo retrabalho.",
    inicio: "Disparo do processo conforme calendário ou solicitação do cliente interno",
    fim: "Entrega validada e distribuída aos stakeholders",
    origem: "Solicitação do cliente interno ou trigger sistêmico",
    destino: "Lideranças, áreas de negócio e times operacionais",
    entradas: ["Relatórios de sistemas", "Planilhas das áreas", "Base de dados corporativa", "Políticas e regras de negócio"],
    saidas: ["Relatório consolidado", "Análise de desvios", "Registros de auditoria", "Dados publicados em BI"],
    atividades: [
      { name: "Recebimento", systems: [1] },
      { name: "Validação inicial", systems: [2] },
      { name: "Consolidação", systems: [3] },
      { name: "Análise de desvios", systems: [3] },
      { name: "Aprovação", systems: [] },
      { name: "Distribuição", systems: [1] },
    ],
    dores: [
      "Volume alto de informações inconsistentes entre sistemas",
      "Falta de padronização entre áreas",
      "Retrabalho recorrente em consolidação manual",
      "Ausência de trilha de auditoria estruturada",
    ],
  };
}

interface Props {
  data: PreMappingData;
  hasDocumentation: boolean;
  onGenerateDocs: () => void;
  hideGenerateDocsCTA?: boolean;
}

const ROLES = ["Analista", "Analista", "Analista", "Analista", "Coordenador", "Analista", "Coordenador"];

export function PreMappingView({ data, hasDocumentation, onGenerateDocs, hideGenerateDocsCTA }: Props) {
  const { language } = useLanguage();
  return (
    <div className="p-8 px-10 animate-fade-in bg-slate-50/50">
      {/* Header */}
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-primary/10 rounded-full">
              <Sparkles className="h-3 w-3 text-primary" />
              <span className="text-[10px] font-medium text-primary">{language === "PT" ? "Pré-Mapeamento IA" : "AI Pre-Mapping"}</span>
            </span>
            <span className="inline-flex items-center gap-1 text-[11px] text-muted-foreground">
              <Lock className="h-3 w-3" /> {language === "PT" ? "Somente leitura" : "Read-only"}
            </span>
            <BacklogTag />
          </div>
          <h1 className="text-[20px] font-semibold text-foreground">
            {language === "PT" ? "Diagrama de escopo" : "Scope Diagram"}
          </h1>
          <p className="text-[13px] text-muted-foreground mt-1 max-w-[640px]">
            {language === "PT"
              ? "Visão preliminar do processo gerada a partir das informações cadastradas. Para destravar POP, BPMN e Assessment, gere a documentação completa."
              : "Preliminary process view generated from registered information. To unlock SOP, BPMN, and Assessment, generate the full documentation."}
          </p>
        </div>
        {!hasDocumentation && !hideGenerateDocsCTA && (
          <button
            onClick={onGenerateDocs}
            className="shrink-0 inline-flex items-center gap-2 text-[12px] text-primary hover:bg-primary/5 px-3 py-2 rounded-lg border border-primary/30 transition-colors"
          >
            <Sparkles className="h-3.5 w-3.5" />
            {language === "PT" ? "Gerar documentação completa" : "Generate full documentation"}
          </button>
        )}
      </div>

      <div className="space-y-4">
        {/* Top Row: Strategic Context (4 field cards) */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3">
          <FieldCard icon={<Target className="h-3 w-3" />} label={language === "PT" ? "Objetivo" : "Objective"}>
            {data.objetivo}
          </FieldCard>
          <FieldCard icon={<Sparkle className="h-3 w-3" />} label={language === "PT" ? "Proposta de valor" : "Value proposition"}>
            {data.proposta}
          </FieldCard>
          <FieldCard icon={<Play className="h-3 w-3" />} label={language === "PT" ? "Evento de início" : "Start event"}>
            {data.inicio}
          </FieldCard>
          <FieldCard icon={<Flag className="h-3 w-3" />} label={language === "PT" ? "Evento de fim" : "End event"}>
            {data.fim}
          </FieldCard>
        </div>

        {/* Middle Block: Operational Flow */}
        <div className="bg-white border border-slate-200 rounded-sm p-6 space-y-7">
          <FlowRow
            icon={<ArrowRight className="w-3 h-3" style={{ color: PRIMARY }} />}
            label={language === "PT" ? "Origem" : "Source"}
          >
            <span className="inline-block px-3 py-1.5 bg-slate-50 border border-dashed border-slate-300 rounded-sm text-xs text-slate-600">
              {data.origem}
            </span>
          </FlowRow>

          <FlowRow
            icon={<ArrowRight className="w-3 h-3" style={{ color: PRIMARY }} />}
            label={language === "PT" ? "Entrada de dados" : "Data input"}
          >
            <div className="flex flex-wrap gap-2">
              {data.entradas.map((e, i) => (
                <span key={i} className="px-3 py-1.5 bg-blue-50 border border-blue-100 rounded-sm text-xs font-medium italic" style={{ color: PRIMARY }}>
                  {e}
                </span>
              ))}
            </div>
          </FlowRow>

          <FlowRow
            icon={<Workflow className="w-3 h-3" style={{ color: PRIMARY }} />}
            label={language === "PT" ? "Processos / Atividades" : "Process / Activities"}
            alignTop
          >
            <ActivityFlow items={data.atividades} systems={data.systems} papeis={data.papeis} />
          </FlowRow>

          <FlowRow
            icon={<ArrowLeft className="w-3 h-3" style={{ color: PRIMARY }} />}
            label={language === "PT" ? "Saída de dados" : "Data output"}
          >
            <div className="flex flex-wrap gap-2">
              {data.saidas.map((s, i) => (
                <span key={i} className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-sm text-xs text-slate-600">
                  {s}
                </span>
              ))}
            </div>
          </FlowRow>

          <FlowRow
            icon={<ArrowLeft className="w-3 h-3" style={{ color: PRIMARY }} />}
            label={language === "PT" ? "Destino" : "Destination"}
          >
            <span className="inline-block px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-sm text-xs text-slate-600">
              {data.destino}
            </span>
          </FlowRow>
        </div>

        {/* Bottom Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Panel title={language === "PT" ? "Sistemas" : "Systems"} count={data.systems.length}>
            <div className="flex flex-wrap gap-2">
              {data.systems.map((s, i) => (
                <span key={i} className="inline-flex items-center gap-2 px-2.5 py-1 bg-slate-50 border border-slate-200 rounded text-[11px] text-slate-700 font-medium">
                  <span
                    className="w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-bold text-white"
                    style={{ background: PRIMARY }}
                  >
                    {i + 1}
                  </span>
                  {s}
                </span>
              ))}
              {data.systems.length === 0 && <span className="text-xs text-slate-400 italic">—</span>}
            </div>
          </Panel>

          <Panel title={language === "PT" ? "Dores" : "Pain points"} count={data.dores.length} dark>
            <div className="flex flex-wrap gap-2">
              {data.dores.map((d, i) => (
                <span key={i} className="inline-flex items-start gap-1.5 px-2 py-1 bg-red-50 text-red-700 border border-red-100 rounded text-[10px] font-medium">
                  <AlertTriangle className="w-2.5 h-2.5 mt-0.5 shrink-0" />
                  {d}
                </span>
              ))}
              {data.dores.length === 0 && <span className="text-xs text-slate-400 italic">—</span>}
            </div>
          </Panel>
        </div>
      </div>
    </div>
  );
}

function FieldCard({ icon, label, children }: { icon: React.ReactNode; label: string; children: React.ReactNode }) {
  return (
    <div className="bg-white border border-slate-200 rounded-sm overflow-hidden flex flex-col transition-shadow hover:shadow-[0_1px_0_0_rgba(12,27,168,0.15)]">
      <div className="px-3 py-1.5 flex items-center gap-2" style={{ background: PRIMARY }}>
        <span className="text-white/90">{icon}</span>
        <span className="text-[10px] font-bold text-white uppercase tracking-wider">{label}</span>
      </div>
      <div className="p-3 text-xs text-slate-600 leading-relaxed min-h-[84px]">{children}</div>
    </div>
  );
}

function FlowRow({ icon, label, children, alignTop }: { icon: React.ReactNode; label: string; children: React.ReactNode; alignTop?: boolean }) {
  return (
    <div className={`grid grid-cols-[120px_1fr] gap-4 ${alignTop ? "items-start" : "items-center"}`}>
      <div className={`text-[10px] font-bold text-slate-400 uppercase tracking-tight flex items-center gap-2 ${alignTop ? "pt-14" : ""}`}>
        {icon}
        <span>{label}</span>
      </div>
      <div>{children}</div>
    </div>
  );
}

function ActivityFlow({ items, systems, papeis }: { items: { name: string; systems: number[] }[]; systems: string[]; papeis?: string[] }) {
  return (
    <div className="flex items-start gap-2 overflow-x-auto pb-2">
      {items.map((act, i) => {
        const isLast = i === items.length - 1;
        return (
          <React.Fragment key={i}>
            <div className="flex-shrink-0 w-44">
              <div className="text-[9px] text-slate-400 mb-1.5 text-center font-medium uppercase tracking-wide">
                {papeis?.[i] ?? ROLES[i] ?? "Analista"}
              </div>
              <div
                className={`relative p-3 rounded-sm h-20 flex flex-col justify-center items-center text-center ${
                  isLast ? "bg-white border" : "text-white"
                }`}
                style={isLast ? { borderColor: PRIMARY, color: PRIMARY, borderWidth: 1.5 } : { background: PRIMARY }}
              >
                <span className={`absolute top-1 left-2 text-[10px] ${isLast ? "opacity-60" : "opacity-50"}`}>
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className={`text-[11px] leading-tight px-1 ${isLast ? "font-bold uppercase" : "font-semibold"}`}>
                  {act.name}
                </span>
              </div>
              <div className="mt-2 flex flex-wrap justify-center gap-1">
                {act.systems.length > 0 ? (
                  act.systems.map((s) => (
                    <span
                      key={s}
                      className="px-2 py-0.5 bg-slate-100 text-[9px] text-slate-600 rounded-full border border-slate-200"
                      title={systems[s - 1]}
                    >
                      {systems[s - 1] ?? `Sistema ${s}`}
                    </span>
                  ))
                ) : (
                  <span className="px-2 py-0.5 text-[9px] text-slate-300 italic">—</span>
                )}
              </div>
            </div>
            {!isLast && (
              <svg className="w-4 h-4 text-slate-300 flex-shrink-0 mt-11" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
              </svg>
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}

function Panel({ title, count, children, className, dark }: { title: string; count?: number; children: React.ReactNode; className?: string; dark?: boolean }) {
  return (
    <div className={`bg-white border border-slate-200 rounded-sm overflow-hidden ${className ?? ""}`}>
      <div
        className="px-3 py-2 flex justify-between items-center"
        style={{ background: dark ? "#0f172a" : PRIMARY }}
      >
        <span className="text-[10px] font-bold text-white uppercase tracking-wider">{title}</span>
        {typeof count === "number" && (
          <span className={`px-1.5 py-0.5 text-[9px] text-white rounded ${dark ? "bg-slate-700" : "bg-white/15"}`}>
            {String(count).padStart(2, "0")} {count === 1 ? "item" : "itens"}
          </span>
        )}
      </div>
      <div className="p-4">{children}</div>
    </div>
  );
}
