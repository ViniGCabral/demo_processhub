import { useState } from "react";
import { TrendingUp, Shield, Database, FileText, AlertTriangle, CheckCircle2, XCircle, AlertCircle, Sparkles, ChevronRight, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/contexts/LanguageContext";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

// ==== Details mocks per pillar (currently focused on Span & Layer demo) ====
type Classification = "ME" | "MS" | "MA" | "SA" | "AU" | "MNA";

const classificationStyle: Record<Classification, string> = {
  ME: "bg-red-100 text-red-700",
  MS: "bg-amber-100 text-amber-700",
  MA: "bg-amber-100 text-amber-700",
  SA: "bg-blue-100 text-blue-700",
  AU: "bg-emerald-100 text-emerald-700",
  MNA: "bg-slate-200 text-slate-700",
};

type SecurityLevel = "SAFE" | "LOW" | "MEDIUM" | "HIGH";

const securityStyle: Record<SecurityLevel, string> = {
  SAFE: "bg-emerald-100 text-emerald-700",
  LOW: "bg-amber-50 text-amber-700",
  MEDIUM: "bg-orange-100 text-orange-700",
  HIGH: "bg-red-100 text-red-700",
};

const classificationInfo: Record<Classification, { pt: { label: string; def: string; ex: string }; en: { label: string; def: string; ex: string } }> = {
  ME: {
    pt: { label: "Manual Estruturado", def: "Execução 100% humana em tarefas puramente mecânicas e baseadas em regras fixas. Zero julgamento envolvido.", ex: "Digitar dados de formulário, clicar em 'Próximo', copiar valores entre telas, preencher campos obrigatórios." },
    en: { label: "Structured Manual", def: "100% human execution of purely mechanical, rule-based tasks. Zero judgment involved.", ex: "Typing form data, clicking 'Next', copying values between screens, filling required fields." },
  },
  MS: {
    pt: { label: "Manual Semi-Estruturado", def: "Execução humana com julgamento simples e codificável em regras (se X então Y). Contexto limitado.", ex: "Escolher categoria de despesa entre 5 opções, validar formato de CPF, selecionar fornecedor padrão." },
    en: { label: "Semi-Structured Manual", def: "Human execution with simple, rule-codifiable judgment (if X then Y). Limited context.", ex: "Choosing expense category from 5 options, validating tax-ID format, selecting default vendor." },
  },
  MA: {
    pt: { label: "Manual Analítico", def: "Análise humana complexa, interpretação de contexto amplo, raciocínio causal.", ex: "Avaliar viabilidade de crédito, interpretar desvio de padrão em relatório financeiro, redigir parecer jurídico." },
    en: { label: "Analytical Manual", def: "Complex human analysis, broad context interpretation, causal reasoning.", ex: "Assessing credit feasibility, interpreting deviations in financial reports, drafting legal opinions." },
  },
  SA: {
    pt: { label: "Semi-Automatizado", def: "Humano aciona; sistema executa 80%+ do trabalho. Gatilho manual + execução automática.", ex: "Clicar em 'Gerar Relatório' que executa macro, acionar RPA via botão, iniciar processamento batch manualmente." },
    en: { label: "Semi-Automated", def: "Human triggers; system executes 80%+ of the work. Manual trigger + automatic execution.", ex: "Clicking 'Generate Report' that runs a macro, triggering RPA via button, starting a batch job manually." },
  },
  AU: {
    pt: { label: "Automatizado", def: "Sistema executa SEM qualquer gatilho humano. Processos agendados ou orientados a eventos.", ex: "Job noturno de conciliação, envio automático de e-mail ao atingir threshold, atualização de dashboard em tempo real." },
    en: { label: "Automated", def: "System executes WITHOUT any human trigger. Scheduled or event-driven processes.", ex: "Nightly reconciliation jobs, automatic email on threshold, real-time dashboard updates." },
  },
  MNA: {
    pt: { label: "Manual Não-Automatizável", def: "Impossível automatizar por exigir presença física, julgamento ético/legal ou interação relacional humana.", ex: "Assinar contrato presencialmente, negociação estratégica com cliente, validação biométrica, depoimento em audiência." },
    en: { label: "Non-Automatable Manual", def: "Impossible to automate due to physical presence, ethical/legal judgment, or human relational interaction.", ex: "Signing contracts in person, strategic negotiation, biometric validation, courtroom testimony." },
  },
};

interface AutomationStepRow { step: string; title: string; classification: Classification; tech: string; }
interface DataSourceRow { step: string; title: string; sourceType: string; direction: "IN" | "OUT"; security: SecurityLevel; }
interface RedflagRow { step: string; title: string; flag: string; }
interface GovernanceGap { area: string; description: string; severity: "CRÍTICO" | "ALTO" | "BAIXO" | "CRITICAL" | "HIGH" | "LOW"; }

function getPillarDetails(language: "PT" | "EN", _spanLayer: boolean) {
  // Mocked details shown for every process (demo)
  const isPT = language === "PT";
  const automation: AutomationStepRow[] = [
    { step: "1.1.1", title: isPT ? "Abrir relatório 'Open and Filled Positions Master' no Workday" : "Open 'Open and Filled Positions Master' report in Workday", classification: "ME", tech: "RPA" },
    { step: "1.1.2", title: isPT ? "Aplicar filtro região LATAM / Brasil" : "Apply LATAM / Brazil region filter", classification: "MS", tech: isPT ? "Integração via API" : "API integration" },
    { step: "1.1.3", title: isPT ? "Incluir posições cobertas ou vagas até data de corte" : "Include filled/open positions up to cut-off date", classification: "MS", tech: isPT ? "Agendamento automático" : "Job scheduling" },
    { step: "1.2",   title: isPT ? "Extrair 'Supervisory Organization (Solid Line)'" : "Extract 'Supervisory Organization (Solid Line)'", classification: "ME", tech: isPT ? "RPA + Integração via API" : "RPA + API integration" },
    { step: "2.1.1", title: isPT ? "Exportar cada relatório em Excel" : "Export each report to Excel", classification: "ME", tech: "RPA" },
    { step: "2.1.2", title: isPT ? "Aguardar conclusão do download" : "Wait for download completion", classification: "MNA", tech: "—" },
    { step: "2.1.3", title: isPT ? "Mover arquivos para Google Drive e abrir no Sheets" : "Move files to Google Drive and open in Sheets", classification: "MS", tech: isPT ? "Workflow automatizado" : "Automated workflow" },
    { step: "3.1.1", title: isPT ? "Localizar ID da organização supervisora" : "Locate supervisory organization ID", classification: "MA", tech: "IA" },
    { step: "3.1.2", title: isPT ? "Quantificar níveis hierárquicos (layers)" : "Quantify hierarchical layers", classification: "ME", tech: isPT ? "Script / lógica automatizada" : "Script / automated logic" },
    { step: "4.1.1", title: isPT ? "Contar liderados diretos por manager" : "Count direct reports per manager", classification: "ME", tech: isPT ? "Script / lógica automatizada" : "Script / automated logic" },
    { step: "4.1.2", title: isPT ? "Aplicar filtro de público administrativo" : "Apply administrative population filter", classification: "MS", tech: isPT ? "Regra de negócio automatizada" : "Automated business rule" },
    { step: "4.1.3", title: isPT ? "Calcular média de span do público analisado" : "Calculate average span for analyzed population", classification: "SA", tech: isPT ? "BI / Analytics" : "BI / Analytics" },
  ];


  const dataSources: DataSourceRow[] = [
    { step: "1.1", title: isPT ? "Extração 'Open and Filled Positions Master'" : "Extract 'Open and Filled Positions Master'", sourceType: isPT ? "Workday (Banco de dados / Relatório)" : "Workday (Database / Report)", direction: "IN", security: "SAFE" },
    { step: "1.2", title: isPT ? "Extração 'Supervisory Organization'" : "Extract 'Supervisory Organization'", sourceType: isPT ? "Workday (Banco de dados / Relatório)" : "Workday (Database / Report)", direction: "IN", security: "SAFE" },
    { step: "2.1.1", title: isPT ? "Exportação de relatórios" : "Report export", sourceType: isPT ? "Arquivo Estruturado (Excel)" : "Structured file (Excel)", direction: "OUT", security: "MEDIUM" },
    { step: "2.1.3", title: isPT ? "Base consolidada de trabalho" : "Consolidated working base", sourceType: isPT ? "Excel / Google Sheets" : "Excel / Google Sheets", direction: "IN", security: "MEDIUM" },
    { step: "3.1.1", title: isPT ? "Custos por banda (Finanças)" : "Cost per band (Finance)", sourceType: isPT ? "E-mail + Entrada manual" : "Email + Manual entry", direction: "IN", security: "HIGH" },
    { step: "4.1.3", title: isPT ? "Entrega às lideranças" : "Delivery to leadership", sourceType: isPT ? "Google Apresentações" : "Google Slides", direction: "OUT", security: "LOW" },
  ];

  const redflags: RedflagRow[] = [
    { step: "2.1.1", title: isPT ? "Exportação manual dos relatórios" : "Manual report export", flag: isPT ? "Transferência manual" : "Manual transfer" },
    { step: "2.1.3", title: isPT ? "Consolidação em Google Sheets" : "Consolidation in Google Sheets", flag: isPT ? "Dependência de Excel/Sheets" : "Excel/Sheets dependency" },
    { step: "3.1.1", title: isPT ? "Recebimento de custos por banda" : "Receiving cost per band data", flag: isPT ? "Entrada por e-mail" : "Email input" },
    { step: "3.1.2", title: isPT ? "Quantificação de layers" : "Layer quantification", flag: isPT ? "Cópia manual entre planilhas" : "Manual copy between sheets" },
    { step: "4.1.1", title: isPT ? "Contagem de liderados diretos" : "Direct reports count", flag: isPT ? "Validação manual" : "Manual validation" },
    { step: "4.1.3", title: isPT ? "Cálculo da média de span" : "Average span calculation", flag: isPT ? "Criticidade alta — insumo para decisão de liderança" : "High criticality — input for leadership decision" },
  ];

  const governance: GovernanceGap[] = [
    { area: isPT ? "Segregação de funções" : "Segregation of duties", description: isPT ? "Mesmo analista extrai, transforma e valida os dados antes da entrega." : "Same analyst extracts, transforms and validates the data before delivery.", severity: isPT ? "ALTO" : "HIGH" },
    { area: isPT ? "Validador formal" : "Formal validator", description: isPT ? "Não há aprovação formal por HRBP/BP sênior antes da apresentação às lideranças." : "No formal HRBP/senior BP approval before presenting to leadership.", severity: isPT ? "ALTO" : "HIGH" },
    { area: isPT ? "Evidência formal" : "Formal evidence", description: isPT ? "Ausência de trilha versionada das bases utilizadas em cada ciclo." : "No versioned audit trail of the base data used in each cycle.", severity: isPT ? "BAIXO" : "LOW" },
    { area: isPT ? "Controle de acesso" : "Access control", description: isPT ? "Planilhas compartilhadas em pasta ampla do Drive sem controle granular por perfil." : "Sheets shared in a broad Drive folder without granular role-based control.", severity: isPT ? "BAIXO" : "LOW" },
  ];

  return { automation, dataSources, redflags, governance };
}

function DetailsToggle({ open, onToggle, labelOpen, labelClosed }: { open: boolean; onToggle: () => void; labelOpen: string; labelClosed: string; }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
    >
      {open ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
      {open ? labelOpen : labelClosed}
    </button>
  );
}

interface ProcessAttributesProps {
  hasPOP: boolean;
  automation?: { maturity: number; risk: number };
  dataIntegrity?: { maturity: number; risk: number };
  governance?: { maturity: number; risk: number };
  processName?: string;
}

const isSpanLayerDemo = (name?: string) => {
  if (!name) return false;
  const n = name.toLowerCase();
  return n.includes("span") && n.includes("layer");
};

// Mock data - estrutura para backend
// Scores will be overridden by props if provided
// Automação: Nota 1 = Maturidade, Nota 2 = Esforço
// Data Integrity: Nota 1 = Maturidade, Nota 2 = Risco
// Governança: Nota 1 = Maturidade, Nota 2 = Risco
const getAttributesData = (
  language: "PT" | "EN",
  automationScores?: { maturity: number; risk: number },
  dataIntegrityScores?: { maturity: number; risk: number },
  governanceScores?: { maturity: number; risk: number },
  spanLayer = false,
) => ({
  automation: spanLayer ? {
    scoreMaturity: automationScores?.maturity ?? 0,
    scoreEffort: automationScores?.risk ?? 41,
    totalSteps: 32,
    manualSteps: 32,
    automatableSteps: 30,
    effortPerStep: 0, // not used; overrides below
    currentEffortOverride: 6.5,
    potentialGainOverride: 4.1,
    insight: language === "PT"
      ? "O processo possui 63% de potencial de automação ajustado com score de maturidade 0, indicando oportunidade significativa de melhoria. Automatizar os 22 passos ME/MS poderia recuperar aproximadamente 4,1 horas por mês, reduzindo o esforço atual de 6,5 para 2,4 horas mensais."
      : "The process has 63% adjusted automation potential with maturity score 0, indicating significant improvement opportunity. Automating the 22 ME/MS steps could recover approximately 4.1 hours per month, reducing current effort from 6.5 to 2.4 hours monthly.",
  } : {
    scoreMaturity: automationScores?.maturity ?? 30,
    scoreEffort: automationScores?.risk ?? 70,
    totalSteps: 25,
    manualSteps: 18,
    automatableSteps: 12,
    effortPerStep: 3.5,
    insight: language === "PT" 
      ? "Processo com baixa automação. Foco em automatizar os 12 steps manuais identificados como automatizáveis."
      : "Process with low automation. Focus on automating the 12 manual steps identified as automatable."
  },
  dataIntegrity: spanLayer ? {
    scoreMaturity: dataIntegrityScores?.maturity ?? 85,
    scoreRisk: dataIntegrityScores?.risk ?? 17,
    redFlags: language === "PT" ? [
      "Manual data transformation",
      "Manual validation",
    ] : [
      "Manual data transformation",
      "Manual validation",
    ],
    unsafeSources: [
      { name: language === "PT" ? "Dados de custos por banda do Time de Finanças" : "Band cost data from Finance Team", points: 2, level: language === "PT" ? "Médio" : "Medium" },
    ],
    insight: language === "PT"
      ? "Processo com baixo risco de integridade (pontuação de risco: 17, maturidade: 85), mas com dependência de validações manuais e transformações manuais de dados. Implementar validações automáticas no Workday e padronizar os formatos de exportação eliminaria os principais pontos de risco identificados."
      : "Process with low integrity risk (risk score: 17, maturity: 85), but dependent on manual validations and manual data transformations. Implementing automatic validations in Workday and standardizing export formats would eliminate the main risk points identified.",
  } : {
    scoreMaturity: dataIntegrityScores?.maturity ?? 75,
    scoreRisk: dataIntegrityScores?.risk ?? 25,
    redFlags: language === "PT" ? [
      "Validação manual de datas",
      "Entrada via planilha Excel"
    ] : [
      "Manual date validation",
      "Input via Excel spreadsheet"
    ],
    unsafeSources: [
      { name: "Email", points: 2, level: language === "PT" ? "Médio" : "Medium" },
      { name: "Excel", points: 1, level: language === "PT" ? "Baixo" : "Low" }
    ],
    insight: language === "PT" 
      ? "Boa integridade de dados. Considerar automação de validações para reduzir erros manuais."
      : "Good data integrity. Consider automating validations to reduce manual errors."
  },
  governance: spanLayer ? {
    scoreMaturity: governanceScores?.maturity ?? 100,
    scoreRisk: governanceScores?.risk ?? 0,
    risks: language === "PT" ? [
      { text: "Fluxo de aprovação bem documentado", severity: "BAIXO" },
      { text: "Segregação de funções adequada", severity: "BAIXO" },
      { text: "Evidência formal adequada em vigor", severity: "BAIXO" },
    ] : [
      { text: "Well-documented approval flow", severity: "LOW" },
      { text: "Adequate segregation of duties", severity: "LOW" },
      { text: "Adequate formal evidence in place", severity: "LOW" },
    ],
    insight: language === "PT"
      ? "A maturidade de governança está excelente em 100% com risco operacional nulo. O processo apresenta controles adequados em todos os pilares de governança, mantendo a conformidade necessária para análises organizacionais."
      : "Governance maturity is excellent at 100% with zero operational risk. The process has adequate controls in all governance pillars, maintaining the compliance required for organizational analysis.",
  } : {
    scoreMaturity: governanceScores?.maturity ?? 85,
    scoreRisk: governanceScores?.risk ?? 15,
    risks: language === "PT" ? [
      { text: "Processo bem documentado", severity: "BAIXO" },
      { text: "Segregação de funções adequada", severity: "BAIXO" }
    ] : [
      { text: "Well documented process", severity: "LOW" },
      { text: "Adequate segregation of duties", severity: "LOW" }
    ],
    insight: language === "PT" 
      ? "Governança sólida. Manter documentação atualizada e revisar periodicamente."
      : "Solid governance. Keep documentation updated and review periodically."
  }
});

// For MATURITY: Higher is better (green = high, red = low)
function getMaturityColor(score: number) {
  if (score >= 70) return "text-emerald-500";
  if (score >= 40) return "text-amber-500";
  return "text-red-500";
}

function getMaturityBgColor(score: number) {
  if (score >= 70) return "bg-emerald-500";
  if (score >= 40) return "bg-amber-500";
  return "bg-red-500";
}

// For RISK/EFFORT: Higher is worse (red = high, green = low)
function getRiskColor(score: number) {
  if (score >= 70) return "text-red-500";
  if (score >= 40) return "text-amber-500";
  return "text-emerald-500";
}

function getRiskBgColor(score: number) {
  if (score >= 70) return "bg-red-500";
  if (score >= 40) return "bg-amber-500";
  return "bg-emerald-500";
}

function getSeverityColor(severity: string) {
  switch (severity) {
    case "CRÍTICO":
    case "CRITICAL":
      return "text-red-500";
    case "ALTO":
    case "HIGH":
      return "text-amber-500";
    case "BAIXO":
    case "LOW":
      return "text-emerald-500";
    default:
      return "text-muted-foreground";
  }
}

function getSeverityIcon(severity: string) {
  switch (severity) {
    case "CRÍTICO":
    case "CRITICAL":
      return XCircle;
    case "ALTO":
    case "HIGH":
      return AlertTriangle;
    case "BAIXO":
    case "LOW":
      return CheckCircle2;
    default:
      return AlertCircle;
  }
}

function getSeverityBgClass(severity: string) {
  switch (severity) {
    case "CRÍTICO":
    case "CRITICAL":
      return "bg-red-100 text-red-700";
    case "ALTO":
    case "HIGH":
      return "bg-amber-100 text-amber-700";
    case "BAIXO":
    case "LOW":
      return "bg-emerald-100 text-emerald-700";
    default:
      return "bg-muted text-muted-foreground";
  }
}

function MaturityProgressBar({ value, className }: { value: number; className?: string }) {
  return (
    <div className={cn("h-2 bg-muted rounded-full overflow-hidden relative", className)}>
      <div 
        className={cn("h-full rounded-full transition-all", getMaturityBgColor(value))}
        style={{ width: `${value}%` }}
      />
    </div>
  );
}

function RiskProgressBar({ value, className }: { value: number; className?: string }) {
  return (
    <div className={cn("h-2 bg-muted rounded-full overflow-hidden relative", className)}>
      <div 
        className={cn("h-full rounded-full transition-all", getRiskBgColor(value))}
        style={{ width: `${value}%` }}
      />
    </div>
  );
}

interface ScoreDisplayProps {
  label: string;
  value: number;
  hint: string;
  legendLow: string;
  legendMedium: string;
  legendHigh: string;
}

function MaturityScoreDisplay({ label, value, hint, legendLow, legendMedium, legendHigh }: ScoreDisplayProps) {
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">{label}:</span>
          <span className="text-xs text-muted-foreground/70">({hint})</span>
        </div>
        <span className={cn("text-sm font-medium", getMaturityColor(value))}>
          {value}%
        </span>
      </div>
      <div className="flex items-center gap-2">
        <MaturityProgressBar value={value} className="flex-1" />
        <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
          <span className="text-red-500">●</span>
          <span>{legendLow}</span>
          <span className="text-amber-500 ml-1">●</span>
          <span>{legendMedium}</span>
          <span className="text-emerald-500 ml-1">●</span>
          <span>{legendHigh}</span>
        </div>
      </div>
    </div>
  );
}

function RiskScoreDisplay({ label, value, hint, legendLow, legendMedium, legendHigh }: ScoreDisplayProps) {
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">{label}:</span>
          <span className="text-xs text-muted-foreground/70">({hint})</span>
        </div>
        <span className={cn("text-sm font-medium", getRiskColor(value))}>
          {value}%
        </span>
      </div>
      <div className="flex items-center gap-2">
        <RiskProgressBar value={value} className="flex-1" />
        <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
          <span className="text-emerald-500">●</span>
          <span>{legendLow}</span>
          <span className="text-amber-500 ml-1">●</span>
          <span>{legendMedium}</span>
          <span className="text-red-500 ml-1">●</span>
          <span>{legendHigh}</span>
        </div>
      </div>
    </div>
  );
}

export function ProcessAttributes({ hasPOP, automation: automationScores, dataIntegrity: dataIntegrityScores, governance: governanceScores, processName }: ProcessAttributesProps) {
  const { language, t } = useLanguage();

  if (!hasPOP) {
    return (
      <div className="max-w-xl mx-auto py-16 animate-fade-in">
        <div className="text-center">
          <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-4">
            <FileText className="h-8 w-8 text-muted-foreground" />
          </div>
          <h2 className="text-xl font-semibold text-foreground mb-2">{t.popRequired}</h2>
          <p className="text-muted-foreground mb-6">
            {t.popRequiredDescription}
          </p>
          <p className="text-sm text-muted-foreground">
            {t.goToPopSection}
          </p>
        </div>
      </div>
    );
  }

  const spanLayer = isSpanLayerDemo(processName);
  const attributesData = getAttributesData(language, automationScores, dataIntegrityScores, governanceScores, spanLayer);
  const { automation, dataIntegrity, governance } = attributesData;
  const pillarDetails = getPillarDetails(language, spanLayer);
  const [showAutoDetails, setShowAutoDetails] = useState(false);
  const [showDataDetails, setShowDataDetails] = useState(false);
  const [showGovDetails, setShowGovDetails] = useState(false);
  const isPT = language === "PT";
  const L = {
    seeDetails: isPT ? "Abrir detalhamento" : "Open details",
    hideDetails: isPT ? "Ocultar detalhamento" : "Hide details",
    colStep: isPT ? "Step" : "Step",
    colStepDesc: isPT ? "Descrição" : "Description",
    colClass: isPT ? "Classificação" : "Classification",
    colTech: isPT ? "Tecnologia indicada" : "Suggested technology",
    colSource: isPT ? "Fonte / Tipo" : "Source / Type",
    colDirection: isPT ? "Direção" : "Direction",
    colFlag: "Red flag",
    colArea: isPT ? "Área" : "Area",
    colGap: isPT ? "Descrição do gap" : "Gap description",
    dataSourcesTitle: isPT ? "Steps com fontes de dados (entrada / saída)" : "Steps with data sources (input / output)",
    redflagsTitle: isPT ? "Steps com red flags na manipulação de dados" : "Steps with red flags in data handling",
    gapsTitle: isPT ? "Gaps de governança identificados" : "Identified governance gaps",
    input: isPT ? "Entrada" : "Input",
    output: isPT ? "Saída" : "Output",
    colSecurity: isPT ? "Classificação de Segurança" : "Security Classification",
    secSafe: isPT ? "Segura (não listada)" : "Safe (not listed)",
    secLow: isPT ? "Risco Baixo" : "Low Risk",
    secMedium: isPT ? "Risco Médio" : "Medium Risk",
    secHigh: isPT ? "Risco Alto" : "High Risk",
  };
  const securityLabel = (s: SecurityLevel) => s === "SAFE" ? L.secSafe : s === "LOW" ? L.secLow : s === "MEDIUM" ? L.secMedium : L.secHigh;
  
  // Calculate potential gains based on automatable steps (with overrides for demo)
  const potentialGainHours = (automation as any).potentialGainOverride ?? automation.automatableSteps * automation.effortPerStep;
  const currentEffort = (automation as any).currentEffortOverride ?? automation.manualSteps * automation.effortPerStep;

  return (
    <div className="max-w-4xl mx-auto animate-fade-in">
      {/* Header with AI indicator */}
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-foreground mb-2">{t.processAssessment}</h1>
        <p className="text-muted-foreground mb-3">
          {t.assessmentDescription}
        </p>
        <div className="inline-flex items-center gap-2 bg-gradient-to-r from-violet-50 to-blue-50 border border-violet-200 rounded-full px-4 py-2">
          <Sparkles className="h-4 w-4 text-violet-500" />
          <span className="text-sm text-violet-700 font-medium">{t.aiGeneratedAssessment}</span>
        </div>
      </div>

      {/* Section 1: Automação */}
      <div className="bg-card border border-border rounded-lg p-6 mb-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <TrendingUp className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">{t.automation}</h3>
            <p className="text-sm text-muted-foreground">{t.automationDescription}</p>
          </div>
        </div>

        <div className="space-y-5 mb-6">
          <MaturityScoreDisplay 
            label={t.maturityScoreLabel}
            value={automation.scoreMaturity} 
            hint={t.higherBetter}
            legendLow={t.legendLow}
            legendMedium={t.legendMedium}
            legendHigh={t.legendHigh}
          />
          <RiskScoreDisplay 
            label={t.effortScoreLabel}
            value={automation.scoreEffort} 
            hint={t.higherWorse}
            legendLow={t.legendLow}
            legendMedium={t.legendMedium}
            legendHigh={t.legendHigh}
          />
        </div>

        <div className="flex items-center gap-2 mb-6">
          {/* Card 1: Total de Steps */}
          <div className="flex-1 bg-muted/50 rounded-lg p-4">
            <div className="text-sm text-muted-foreground mb-1">{t.totalSteps}</div>
            <div className="text-2xl font-semibold text-foreground">{automation.totalSteps}</div>
          </div>
          
          {/* Arrow 1 */}
          <div className="flex items-center justify-center w-8 shrink-0">
            <ChevronRight className="h-6 w-6 text-muted-foreground/50" />
          </div>
          
          {/* Card 2: Steps Manuais */}
          <div className="flex-1 bg-muted/50 rounded-lg p-4">
            <div className="text-sm text-muted-foreground mb-1">{t.manualSteps}</div>
            <div className="text-2xl font-semibold text-foreground">
              {automation.manualSteps} <span className="text-sm text-muted-foreground">({Math.round((automation.manualSteps / automation.totalSteps) * 100)}%)</span>
            </div>
          </div>
          
          {/* Arrow 2 */}
          <div className="flex items-center justify-center w-8 shrink-0">
            <ChevronRight className="h-6 w-6 text-muted-foreground/50" />
          </div>
          
          {/* Card 3: Possíveis de Automatizar */}
          <div className="flex-1 bg-amber-50 border border-amber-200 rounded-lg p-4">
            <div className="text-sm text-amber-700 mb-1">{t.automatable}</div>
            <div className="text-2xl font-semibold text-amber-600">
              {automation.automatableSteps} <span className="text-sm text-amber-500">({Math.round((automation.automatableSteps / automation.manualSteps) * 100)}% {t.ofManual})</span>
            </div>
          </div>
        </div>

        <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4 mb-4">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
            <span className="text-sm font-medium text-emerald-700">{t.potentialGain} ({t.automatingSteps} {automation.automatableSteps} steps)</span>
          </div>
          <div className="text-lg font-semibold text-emerald-700">
            {potentialGainHours.toFixed(1)}h/{language === "PT" ? "mês" : "month"} ({Math.round((potentialGainHours / currentEffort) * 100)}% {t.reduction})
          </div>
          <div className="text-xs text-emerald-600 mt-1">
            {t.currentEffortManual}: {currentEffort.toFixed(1)}h/{language === "PT" ? "mês" : "month"} → {t.afterAutomation}: {(currentEffort - potentialGainHours).toFixed(1)}h/{language === "PT" ? "mês" : "month"}
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="text-sm font-medium text-blue-800 mb-1">💡 {t.insightLabel}</div>
          <div className="text-sm text-blue-700">{automation.insight}</div>
        </div>

        {pillarDetails && (
          <>
            <DetailsToggle
              open={showAutoDetails}
              onToggle={() => setShowAutoDetails((v) => !v)}
              labelOpen={L.hideDetails}
              labelClosed={L.seeDetails}
            />
            {showAutoDetails && (
              <div className="mt-4 border border-border rounded-lg overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-muted/50 text-left text-xs uppercase text-muted-foreground">
                    <tr>
                      <th className="px-3 py-2 w-16">{L.colStep}</th>
                      <th className="px-3 py-2">{L.colStepDesc}</th>
                      <th className="px-3 py-2 w-32">{L.colClass}</th>
                      <th className="px-3 py-2 w-64">{L.colTech}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pillarDetails.automation.map((row) => (
                      <tr key={row.step} className="border-t border-border">
                        <td className="px-3 py-2 font-mono text-xs text-muted-foreground">{row.step}</td>
                        <td className="px-3 py-2 text-foreground">{row.title}</td>
                        <td className="px-3 py-2">
                          <TooltipProvider delayDuration={100}>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <button type="button" className={cn("inline-block text-xs font-medium px-2 py-0.5 rounded cursor-help", classificationStyle[row.classification])}>
                                  {row.classification}
                                </button>
                              </TooltipTrigger>
                              <TooltipContent side="top" className="max-w-xs">
                                <div className="text-xs font-semibold mb-1">
                                  {row.classification} — {classificationInfo[row.classification][isPT ? "pt" : "en"].label}
                                </div>
                                <div className="text-xs mb-1.5 opacity-90">
                                  {classificationInfo[row.classification][isPT ? "pt" : "en"].def}
                                </div>
                                <div className="text-[11px] italic opacity-80">
                                  {isPT ? "Ex.: " : "e.g.: "}{classificationInfo[row.classification][isPT ? "pt" : "en"].ex}
                                </div>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </td>
                        <td className="px-3 py-2 text-muted-foreground">{row.tech}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className="px-3 py-2 text-[11px] text-muted-foreground bg-muted/30 border-t border-border">
                  ME = {isPT ? "Manual Esforçado" : "Manual Effortful"} · MS = {isPT ? "Manual Simples" : "Manual Simple"} · MA = {isPT ? "Manual Assistido" : "Manual Assisted"} · SA = {isPT ? "Semi-Automatizado" : "Semi-Automated"} · AU = {isPT ? "Automatizado" : "Automated"} · MNA = {isPT ? "Manual Não Automatizável" : "Manual Not Automatable"}
                </div>
              </div>
            )}
          </>
        )}
      </div>


      {/* Section 2: Integridade de Dados */}
      <div className="bg-card border border-border rounded-lg p-6 mb-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <Database className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">{t.dataIntegrity}</h3>
            <p className="text-sm text-muted-foreground">{t.dataIntegrityDescription}</p>
          </div>
        </div>

        <div className="space-y-5 mb-6">
          <MaturityScoreDisplay 
            label={t.maturityScoreLabel}
            value={dataIntegrity.scoreMaturity} 
            hint={t.higherBetter}
            legendLow={t.legendLow}
            legendMedium={t.legendMedium}
            legendHigh={t.legendHigh}
          />
          <RiskScoreDisplay 
            label={t.riskScoreLabel}
            value={dataIntegrity.scoreRisk} 
            hint={t.higherWorse}
            legendLow={t.legendLow}
            legendMedium={t.legendMedium}
            legendHigh={t.legendHigh}
          />
        </div>

        <div className="mb-6">
          <h4 className="text-sm font-medium text-foreground mb-3 flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-amber-500" />
            {t.redFlags}
          </h4>
          <div className="space-y-2">
            {dataIntegrity.redFlags.map((flag, idx) => (
              <div key={idx} className="flex items-center gap-3 bg-amber-50 rounded-lg p-3">
                <AlertTriangle className="h-4 w-4 text-amber-500 shrink-0" />
                <span className="text-sm text-amber-800">{flag}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="mb-6">
          <h4 className="text-sm font-medium text-foreground mb-3">{t.unsafeSources}</h4>
          <div className="space-y-2">
            {dataIntegrity.unsafeSources.map((source, idx) => (
              <div key={idx} className="flex items-center justify-between bg-muted/50 rounded-lg p-3">
                <div className="flex items-center gap-3">
                  {source.level === t.high ? (
                    <XCircle className="h-4 w-4 text-red-500" />
                  ) : (
                    <AlertTriangle className="h-4 w-4 text-amber-500" />
                  )}
                  <span className="text-sm text-foreground">{source.name}</span>
                  <span className="text-xs text-muted-foreground">({source.points} {t.points})</span>
                </div>
                <span className={cn(
                  "text-xs font-medium px-2 py-1 rounded",
                  source.level === t.high && "bg-red-100 text-red-700",
                  source.level === t.medium && "bg-amber-100 text-amber-700"
                )}>
                  {source.level}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="text-sm font-medium text-blue-800 mb-1">💡 {t.insightLabel}</div>
          <div className="text-sm text-blue-700">{dataIntegrity.insight}</div>
        </div>

        {pillarDetails && (
          <>
            <DetailsToggle
              open={showDataDetails}
              onToggle={() => setShowDataDetails((v) => !v)}
              labelOpen={L.hideDetails}
              labelClosed={L.seeDetails}
            />
            {showDataDetails && (
              <div className="mt-4 space-y-4">
                <div className="border border-border rounded-lg overflow-hidden">
                  <div className="px-3 py-2 bg-muted/50 text-xs font-medium uppercase text-muted-foreground">
                    {L.dataSourcesTitle}
                  </div>
                  <table className="w-full text-sm">
                    <thead className="bg-muted/30 text-left text-xs uppercase text-muted-foreground">
                      <tr>
                        <th className="px-3 py-2 w-16">{L.colStep}</th>
                        <th className="px-3 py-2">{L.colStepDesc}</th>
                        <th className="px-3 py-2 w-56">{L.colSource}</th>
                        <th className="px-3 py-2 w-24">{L.colDirection}</th>
                        <th className="px-3 py-2 w-48">{L.colSecurity}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {pillarDetails.dataSources.map((row) => (
                        <tr key={row.step + row.title} className="border-t border-border">
                          <td className="px-3 py-2 font-mono text-xs text-muted-foreground">{row.step}</td>
                          <td className="px-3 py-2 text-foreground">{row.title}</td>
                          <td className="px-3 py-2 text-muted-foreground">{row.sourceType}</td>
                          <td className="px-3 py-2">
                            <span className={cn("inline-block text-xs font-medium px-2 py-0.5 rounded", row.direction === "IN" ? "bg-blue-100 text-blue-700" : "bg-purple-100 text-purple-700")}>
                              {row.direction === "IN" ? L.input : L.output}
                            </span>
                          </td>
                          <td className="px-3 py-2">
                            <span className={cn("inline-block text-xs font-medium px-2 py-0.5 rounded", securityStyle[row.security])}>
                              {securityLabel(row.security)}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="border border-border rounded-lg overflow-hidden">
                  <div className="px-3 py-2 bg-muted/50 text-xs font-medium uppercase text-muted-foreground">
                    {L.redflagsTitle}
                  </div>
                  <table className="w-full text-sm">
                    <thead className="bg-muted/30 text-left text-xs uppercase text-muted-foreground">
                      <tr>
                        <th className="px-3 py-2 w-16">{L.colStep}</th>
                        <th className="px-3 py-2">{L.colStepDesc}</th>
                        <th className="px-3 py-2 w-64">{L.colFlag}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {pillarDetails.redflags.map((row) => (
                        <tr key={row.step + row.flag} className="border-t border-border">
                          <td className="px-3 py-2 font-mono text-xs text-muted-foreground">{row.step}</td>
                          <td className="px-3 py-2 text-foreground">{row.title}</td>
                          <td className="px-3 py-2">
                            <span className="inline-flex items-center gap-1.5 text-xs font-medium px-2 py-0.5 rounded bg-amber-100 text-amber-700">
                              <AlertTriangle className="h-3 w-3" />
                              {row.flag}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </>
        )}
      </div>


      {/* Section 3: Governança e Compliance */}
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <Shield className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">{t.governanceCompliance}</h3>
            <p className="text-sm text-muted-foreground">{t.governanceDescription}</p>
          </div>
        </div>

        <div className="space-y-5 mb-6">
          <MaturityScoreDisplay 
            label={t.maturityScoreLabel}
            value={governance.scoreMaturity} 
            hint={t.higherBetter}
            legendLow={t.legendLow}
            legendMedium={t.legendMedium}
            legendHigh={t.legendHigh}
          />
          <RiskScoreDisplay 
            label={t.riskScoreLabel}
            value={governance.scoreRisk} 
            hint={t.higherWorse}
            legendLow={t.legendLow}
            legendMedium={t.legendMedium}
            legendHigh={t.legendHigh}
          />
        </div>

        <div className="mb-6">
          <h4 className="text-sm font-medium text-foreground mb-3">{t.riskPoints}</h4>
          <div className="space-y-2">
            {governance.risks.map((risk, idx) => {
              const Icon = getSeverityIcon(risk.severity);
              return (
                <div key={idx} className="flex items-center justify-between bg-muted/50 rounded-lg p-3">
                  <div className="flex items-center gap-3">
                    <Icon className={cn("h-4 w-4", getSeverityColor(risk.severity))} />
                    <span className="text-sm text-foreground">{risk.text}</span>
                  </div>
                  <span className={cn(
                    "text-xs font-medium px-2 py-1 rounded",
                    getSeverityBgClass(risk.severity)
                  )}>
                    {risk.severity}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="text-sm font-medium text-blue-800 mb-1">💡 {t.insightLabel}</div>
          <div className="text-sm text-blue-700">{governance.insight}</div>
        </div>

        {pillarDetails && (
          <>
            <DetailsToggle
              open={showGovDetails}
              onToggle={() => setShowGovDetails((v) => !v)}
              labelOpen={L.hideDetails}
              labelClosed={L.seeDetails}
            />
            {showGovDetails && (
              <div className="mt-4 border border-border rounded-lg overflow-hidden">
                <div className="px-3 py-2 bg-muted/50 text-xs font-medium uppercase text-muted-foreground">
                  {L.gapsTitle}
                </div>
                <table className="w-full text-sm">
                  <thead className="bg-muted/30 text-left text-xs uppercase text-muted-foreground">
                    <tr>
                      <th className="px-3 py-2 w-56">{L.colArea}</th>
                      <th className="px-3 py-2">{L.colGap}</th>
                      <th className="px-3 py-2 w-28">{isPT ? "Severidade" : "Severity"}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pillarDetails.governance.map((row, idx) => {
                      const Icon = getSeverityIcon(row.severity);
                      return (
                        <tr key={idx} className="border-t border-border">
                          <td className="px-3 py-2 font-medium text-foreground">
                            <span className="inline-flex items-center gap-2">
                              <Icon className={cn("h-4 w-4", getSeverityColor(row.severity))} />
                              {row.area}
                            </span>
                          </td>
                          <td className="px-3 py-2 text-muted-foreground">{row.description}</td>
                          <td className="px-3 py-2">
                            <span className={cn("inline-block text-xs font-medium px-2 py-0.5 rounded", getSeverityBgClass(row.severity))}>
                              {row.severity}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}
      </div>

    </div>
  );
}