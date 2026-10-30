import {
  ProcessAutomationDetailData,
  ProcessStepDetail,
  ProcessStepSubstep,
  MacroBlock,
  SolutionRecommendation,
  Classification,
  EffortLevel,
} from "@/types/automationDetailTypes";
import { automationDetailMap, specialHandlingAutomationData } from "@/data/automationDetailData";
import {
  Bot,
  Sparkles,
  Workflow,
  ArrowLeftRight,
  Sliders,
  FileSpreadsheet,
  UserCheck,
  Cpu,
  Layers,
} from "lucide-react";

export type TechnologyCategory =
  | "Agentes"
  | "RPA"
  | "Workflows"
  | "Integrações"
  | "Motores de regras"
  | "Automação de planilha"
  | "Humano";

export const ALL_TECHNOLOGY_CATEGORIES: TechnologyCategory[] = [
  "Agentes",
  "RPA",
  "Workflows",
  "Integrações",
  "Motores de regras",
  "Automação de planilha",
  "Humano",
];

export interface LegacyAutomationRow {
  step: string;
  title: string;
  classification: Classification;
  tech: string;
}

/**
 * Mapeamento de metadados visuais para as categorias tecnológicas da Camada Digital
 */
export function getCategoryMeta(category: string) {
  switch (category) {
    case "Agentes":
      return {
        label: "Agentes",
        icon: Sparkles,
        color: "text-purple-700 bg-purple-50 border-purple-200",
        badgeColor: "bg-purple-100 text-purple-800 border-purple-200",
        iconColor: "text-purple-600",
        bgLight: "bg-purple-50/40",
      };
    case "RPA":
      return {
        label: "RPA",
        icon: Cpu,
        color: "text-blue-700 bg-blue-50 border-blue-200",
        badgeColor: "bg-blue-100 text-blue-800 border-blue-200",
        iconColor: "text-blue-600",
        bgLight: "bg-blue-50/40",
      };
    case "Workflows":
      return {
        label: "Workflows",
        icon: Workflow,
        color: "text-amber-700 bg-amber-50 border-amber-200",
        badgeColor: "bg-amber-100 text-amber-800 border-amber-200",
        iconColor: "text-amber-600",
        bgLight: "bg-amber-50/40",
      };
    case "Integrações":
      return {
        label: "Integrações",
        icon: ArrowLeftRight,
        color: "text-indigo-700 bg-indigo-50 border-indigo-200",
        badgeColor: "bg-indigo-100 text-indigo-800 border-indigo-200",
        iconColor: "text-indigo-600",
        bgLight: "bg-indigo-50/40",
      };
    case "Motores de regras":
      return {
        label: "Motores de regras",
        icon: Sliders,
        color: "text-rose-700 bg-rose-50 border-rose-200",
        badgeColor: "bg-rose-100 text-rose-800 border-rose-200",
        iconColor: "text-rose-600",
        bgLight: "bg-rose-50/40",
      };
    case "Automação de planilha":
      return {
        label: "Automação de planilha",
        icon: FileSpreadsheet,
        color: "text-emerald-700 bg-emerald-50 border-emerald-200",
        badgeColor: "bg-emerald-100 text-emerald-800 border-emerald-200",
        iconColor: "text-emerald-600",
        bgLight: "bg-emerald-50/40",
      };
    case "Humano":
    default:
      return {
        label: "Humano",
        icon: UserCheck,
        color: "text-teal-700 bg-teal-50 border-teal-200",
        badgeColor: "bg-teal-100 text-teal-800 border-teal-200",
        iconColor: "text-teal-600",
        bgLight: "bg-teal-50/40",
      };
  }
}

/**
 * Infere a categoria tecnológica a partir de dados da solução ou do step
 */
export function inferTechnologyType(
  solution?: Partial<SolutionRecommendation>,
  step?: Partial<ProcessStepDetail>
): TechnologyCategory {
  if (solution?.technologyType) {
    return solution.technologyType as TechnologyCategory;
  }
  if (step?.technologyType) {
    return step.technologyType as TechnologyCategory;
  }

  // Verifica se o step exige julgamento humano estrito
  if (step?.classification === "MNA") {
    return "Humano";
  }

  // Coleta nomes e famílias de tecnologias presentes
  const techStrings: string[] = [];
  const families: string[] = [];

  if (solution?.technologyOptions) {
    solution.technologyOptions.forEach((t) => {
      techStrings.push(t.name.toLowerCase());
      if (t.family) families.push(t.family.toLowerCase());
    });
  }

  if (solution?.implementationPaths) {
    solution.implementationPaths.forEach((path) => {
      path.technologies.forEach((t) => {
        techStrings.push(t.name.toLowerCase());
        if (t.family) families.push(t.family.toLowerCase());
      });
    });
  }

  if (step?.technologyOptions) {
    step.technologyOptions.forEach((t) => {
      techStrings.push(t.name.toLowerCase());
      if (t.family) families.push(t.family.toLowerCase());
    });
  }

  if (step?.technology) {
    techStrings.push(step.technology.toLowerCase());
  }

  const combinedText = [
    solution?.name || "",
    solution?.description || "",
    ...techStrings,
    ...families,
  ]
    .join(" ")
    .toLowerCase();

  // 1. Agentes
  if (
    families.includes("ai_assistance") ||
    combinedText.includes("agente") ||
    combinedText.includes("agent") ||
    combinedText.includes("ia generativa") ||
    combinedText.includes("llm") ||
    combinedText.includes("ia ")
  ) {
    return "Agentes";
  }

  // 2. RPA
  if (
    families.includes("rpa") ||
    combinedText.includes("rpa") ||
    combinedText.includes("uipath") ||
    combinedText.includes("power automate desktop") ||
    combinedText.includes("gui scripting") ||
    combinedText.includes("bot ")
  ) {
    return "RPA";
  }

  // 3. Workflows
  if (
    families.includes("workflow") ||
    combinedText.includes("workflow") ||
    combinedText.includes("bpm") ||
    combinedText.includes("approvals") ||
    combinedText.includes("aprovação") ||
    combinedText.includes("esteira")
  ) {
    return "Workflows";
  }

  // 4. Motores de Regras
  if (
    families.includes("decision_rules") ||
    combinedText.includes("brf+") ||
    combinedText.includes("motor de regras") ||
    combinedText.includes("tabela de decisão") ||
    combinedText.includes("regras")
  ) {
    return "Motores de regras";
  }

  // 5. Automação de Planilha
  if (
    families.includes("spreadsheet_automation") ||
    families.includes("data_transformation") ||
    combinedText.includes("excel") ||
    combinedText.includes("planilha") ||
    combinedText.includes("vba") ||
    combinedText.includes("office scripts") ||
    combinedText.includes("power query")
  ) {
    return "Automação de planilha";
  }

  // 6. Integrações
  if (
    families.includes("system_integration") ||
    combinedText.includes("api") ||
    combinedText.includes("integração") ||
    combinedText.includes("bapi") ||
    combinedText.includes("odata") ||
    combinedText.includes("webhook")
  ) {
    return "Integrações";
  }

  // 7. Humano
  if (
    step?.humanInTheLoop?.hasHumanControl ||
    combinedText.includes("manual") ||
    combinedText.includes("humano")
  ) {
    return "Humano";
  }

  return "Integrações";
}

export interface DigitalSolutionItem {
  id: string;
  title: string;
  stepIds: string[];
  techBadge: string;
  solutionId?: string;
  isHuman?: boolean;
  description?: string;
}

export interface DigitalSolutionsGroup {
  category: TechnologyCategory;
  items: DigitalSolutionItem[];
}

/**
 * Agrupa soluções e steps de uma macroetapa por categoria tecnológica para a Camada Digital
 */
export function getMacroBlockDigitalSolutions(
  macroBlock: MacroBlock,
  steps: ProcessStepDetail[],
  solutions: SolutionRecommendation[]
): DigitalSolutionsGroup[] {
  const mbSteps = steps.filter((s) => s.macroBlockId === macroBlock.id);
  const mbStepIdSet = new Set(mbSteps.map((s) => String(s.id)));

  // Identifica soluções que pertencem diretamente a este bloco ou cujos steps intersectam este bloco
  const mbSolutions = solutions.filter(
    (sol) =>
      sol.macroBlockId === macroBlock.id ||
      sol.stepIds.some((id) => mbStepIdSet.has(String(id)))
  );

  const groupMap = new Map<TechnologyCategory, DigitalSolutionItem[]>();

  ALL_TECHNOLOGY_CATEGORIES.forEach((cat) => {
    groupMap.set(cat, []);
  });

  // 1. Processa as soluções mapeadas
  mbSolutions.forEach((sol) => {
    const relevantStepIds = sol.stepIds.filter((id) => mbStepIdSet.has(String(id)));
    const targetStepIds = relevantStepIds.length > 0 ? relevantStepIds : sol.stepIds.slice(0, 3);

    // Identifica quais caminhos/tecnologias a solução possui
    const foundCategories = new Set<TechnologyCategory>();

    if (sol.implementationPaths && sol.implementationPaths.length > 0) {
      sol.implementationPaths.forEach((path) => {
        path.technologies.forEach((tech) => {
          const cat = inferTechnologyType(
            { ...sol, technologyType: undefined },
            { technology: tech.name, technologyOptions: [tech] }
          );
          foundCategories.add(cat);
        });
      });
    } else if (sol.technologyOptions && sol.technologyOptions.length > 0) {
      sol.technologyOptions.forEach((tech) => {
        const cat = inferTechnologyType(
          { ...sol, technologyType: undefined },
          { technology: tech.name, technologyOptions: [tech] }
        );
        foundCategories.add(cat);
      });
    }

    // Se nenhuma categoria específica foi detectada nos caminhos, infere pelo conjunto da solução
    if (foundCategories.size === 0) {
      foundCategories.add(inferTechnologyType(sol));
    }

    // Cria um card para cada categoria tecnológica coberta pela solução
    foundCategories.forEach((cat) => {
      // Encontra a tecnologia mais representativa dessa categoria na solução
      let techName = "Solução tecnológica";
      const allTechs = [
        ...(sol.technologyOptions || []),
        ...(sol.implementationPaths?.flatMap((p) => p.technologies) || []),
      ];
      const matchTech = allTechs.find(
        (t) =>
          inferTechnologyType(undefined, {
            technology: t.name,
            technologyOptions: [t],
          }) === cat
      );

      if (matchTech) {
        techName = matchTech.name;
      } else if (sol.technologyOptions && sol.technologyOptions[0]?.name) {
        techName = sol.technologyOptions[0].name;
      }

      // Nome curto e específico para o card
      const shortTitle = sol.name;

      groupMap.get(cat)?.push({
        id: `${sol.id}-${cat}`,
        title: shortTitle,
        stepIds: targetStepIds,
        techBadge: techName,
        solutionId: sol.id,
        isHuman: false,
        description: sol.description,
      });
    });
  });

  // 2. Processa steps da macroetapa que exigem intervenção humana estrita (MNA ou hasHumanControl sem automação)
  mbSteps.forEach((step) => {
    if (
      step.classification === "MNA" ||
      (!step.solutionId && step.humanInTheLoop?.hasHumanControl)
    ) {
      const alreadyInHuman = groupMap
        .get("Humano")
        ?.some((item) => item.stepIds.includes(step.id));
      if (!alreadyInHuman) {
        groupMap.get("Humano")?.push({
          id: `step-human-${step.id}`,
          title: "Revisão / decisão humana",
          stepIds: [step.id],
          techBadge: step.humanInTheLoop?.summary || "Julgamento do especialista",
          isHuman: true,
          description: step.humanInTheLoop?.details || "Ação requer validação e controle humano.",
        });
      }
    }
  });

  // Converte o mapa para lista ordenada, filtrando categorias vazias
  return ALL_TECHNOLOGY_CATEGORIES.map((category) => ({
    category,
    items: groupMap.get(category) || [],
  })).filter((group) => group.items.length > 0);
}

/**
 * Gera sub-steps estruturados padrão para um step caso não estejam definidos
 */
export function ensureStepSubsteps(step: ProcessStepDetail): ProcessStepSubstep[] {
  if (step.substeps && step.substeps.length > 0) {
    return step.substeps;
  }

  const idPrefix = String(step.id).padStart(2, "0");

  if (step.title.toLowerCase().includes("planilha") || step.title.toLowerCase().includes("variantes")) {
    return [
      { id: `${idPrefix}.1`, description: "Acessar o repositório ou pasta compartilhada da operação." },
      { id: `${idPrefix}.2`, description: "Abrir o arquivo de planilha e selecionar a aba correspondente." },
      { id: `${idPrefix}.3`, description: "Validar parâmetros, formatos de dados e consistência de filtros." },
      { id: `${idPrefix}.4`, description: "Exportar ou consolidar os registros validados para a etapa seguinte." },
    ];
  }

  if (step.title.toLowerCase().includes("f110") || step.title.toLowerCase().includes("sap")) {
    return [
      { id: `${idPrefix}.1`, description: "Acessar o ambiente SAP GUI e chamar o código de transação." },
      { id: `${idPrefix}.2`, description: "Localizar e preencher parâmetros de identificação e data de execução." },
      { id: `${idPrefix}.3`, description: "Configurar opções de log e filtros de partidas em aberto." },
      { id: `${idPrefix}.4`, description: "Salvar a parametrização e verificar mensagens de status no rodapé." },
    ];
  }

  if (step.title.toLowerCase().includes("aprova") || step.title.toLowerCase().includes("gerente")) {
    return [
      { id: `${idPrefix}.1`, description: "Reunir o pacote de evidências, justificativas e valores da solicitação." },
      { id: `${idPrefix}.2`, description: "Encaminhar para a esteira formal de aprovação da alçada competente." },
      { id: `${idPrefix}.3`, description: "Aguardar decisão formal do gestor (Aprovar, Rejeitar ou Solicitar Ajuste)." },
      { id: `${idPrefix}.4`, description: "Registrar a confirmação de liberação na trilha de auditoria." },
    ];
  }

  if (step.title.toLowerCase().includes("bloqueio") || step.title.toLowerCase().includes("partida")) {
    return [
      { id: `${idPrefix}.1`, description: "Consultar a lista de partidas identificadas com bloqueio temporário." },
      { id: `${idPrefix}.2`, description: "Investigar a divergência cadastral ou limite de tolerância financeira." },
      { id: `${idPrefix}.3`, description: "Aplicar a decisão corretiva ou liberar item após esclarecimento." },
      { id: `${idPrefix}.4`, description: "Atualizar status da partida na proposta de pagamento." },
    ];
  }

  return [
    { id: `${idPrefix}.1`, description: `Iniciar a atividade e acessar os insumos necessários (${step.title}).` },
    { id: `${idPrefix}.2`, description: "Consultar registros e checar condições de conformidade operacional." },
    { id: `${idPrefix}.3`, description: "Executar o preenchimento de dados ou processamento transacional." },
    { id: `${idPrefix}.4`, description: "Confirmar a persistência do resultado e arquivar log de controle." },
  ];
}

/**
 * 5 Macroetapas Canônicas Mandatórias
 */
export const CANONICAL_MACROBLOCKS: MacroBlock[] = [
  {
    id: "intake",
    order: 1,
    number: "01",
    name: "Intake",
    description: "Solicitações recebidas, arquivos, dados brutos. Preparação do caso e validação de completude.",
    objective: "Consolidar dados, extrair relatórios e estruturar parâmetros de entrada com validações prévias.",
    stepCount: 2,
    inputs: "Arquivos de demanda, relatórios brutos da SOP e parâmetros operacionais",
    outputs: "Dados consolidados, parâmetros higienizados e lotes de trabalho prontos",
    supportingAgents: ["Agente classificador de demanda", "Agente de preparação de insumos"],
    stepIds: ["01", "02"],
    solutionIds: ["solution-01", "solution-02"],
  },
  {
    id: "routing",
    order: 2,
    number: "02",
    name: "Routing",
    description: "Classificação, prioridade, mapa de risco, separação por banda e políticas de encaminhamento.",
    objective: "Distribuir solicitações e transferir arquivos para as instâncias de processamento adequadas.",
    stepCount: 1,
    inputs: "Lotes de trabalho e arquivos normalizados",
    outputs: "Casos encaminhados para a fila de execução com pastas e acessos sincronizados",
    supportingAgents: ["Agente de roteamento", "Agente de distribuição de filas"],
    stepIds: ["03"],
    solutionIds: ["solution-03"],
  },
  {
    id: "execution",
    order: 3,
    number: "03",
    name: "Execution",
    description: "Consultas, cálculos, atualizações, lançamentos e execução em sistemas. Resultado operacional.",
    objective: "Processar transformações, aplicar regras de negócio e realizar lançamentos nos sistemas corporativos.",
    stepCount: 3,
    inputs: "Casos triados, dados estruturados e parâmetros validados",
    outputs: "Cálculos concluídos, cadastros atualizados e transações persistidas",
    supportingAgents: ["Agente de execução operacional", "Agente de checagem de regras"],
    stepIds: ["04", "05", "06"],
    solutionIds: ["solution-04", "solution-04b", "solution-05"],
  },
  {
    id: "exception",
    order: 4,
    number: "04",
    name: "Exception",
    description: "Divergências, casos fora da regra, alçadas de aprovação, devolução ou escalonamento.",
    objective: "Isolar anomalias, gerenciar aprovações gerenciais e registrar intervenções especializadas.",
    stepCount: 1,
    inputs: "Casos divergentes, discrepâncias de valores e transações com pendência",
    outputs: "Decisões de exceção tomadas, correções aplicadas e liberações autorizadas",
    supportingAgents: ["Agente de triagem de exceções", "Agente de conciliação"],
    stepIds: ["07"],
    solutionIds: ["solution-06"],
  },
  {
    id: "codification",
    order: 5,
    number: "05",
    name: "Codification",
    description: "Evidências, logs, histórico, relatórios. Atualização de política, regra ou orientação.",
    objective: "Armazenar trilha de auditoria completa, publicar métricas gerenciais e encerrar o ciclo operacional.",
    stepCount: 1,
    inputs: "Transações concluídas, logs de execução e decisões de exceção",
    outputs: "Dossiê de auditoria arquivado, relatórios de BI publicados e status final notificado",
    supportingAgents: ["Agente de registro de evidências", "Agente de auditoria contínua"],
    stepIds: ["08"],
    solutionIds: ["solution-07"],
  },
];

/**
 * Catálogo Canônico de Soluções Tecnológicas de Demonstração
 */
export const CANONICAL_DEMO_SOLUTIONS: SolutionRecommendation[] = [
  {
    id: "sol-rpa-upload-vim",
    macroBlockId: "execution",
    macroBlockName: "Execution",
    capabilityId: "cap-rpa-upload",
    capabilityName: "Automação de interface SAP",
    name: "Upload e preenchimento de faturas no SAP/VIM",
    description: "Automatiza o upload de faturas via OAWD, preenchimento de campos estruturados no VIM e criação de VBDs no ZEWB para fluxos Trip e Non-Trip.",
    stepIds: ["step_01", "step_03", "step_04", "step_09", "step_12", "step_22", "step_30"],
    technologyType: "RPA",
    technologyOptions: [
      { name: "RPA para SAP GUI / VIM", family: "rpa", role: "primary", roleDescription: "Automatiza navegação, upload e preenchimento em SAP GUI e VIM Workplace", status: "needs_validation" },
    ],
    effort: { level: "high", score: 65, confidence: "medium", drivers: ["Múltiplas transações SAP", "Campos condicionais"], unknowns: ["Permissões SAP"] },
    humanInTheLoop: { hasHumanControl: true, description: "Revisão obrigatória antes de postagem.", level: "partial" },
    impact: { level: "transformative", rationale: "Elimina digitação manual em 7 steps de alto volume." },
    status: "needs_validation",
  },
  {
    id: "sol-wf-routing",
    macroBlockId: "routing",
    macroBlockName: "Routing",
    capabilityId: "cap-wf-routing",
    capabilityName: "Roteamento e aprovações",
    name: "Roteamento de aprovações e retorno do Scheduler",
    description: "Orquestra o encaminhamento de faturas por tipo (Trip/Non-Trip), fornecedor e alçada, incluindo fluxo de aprovação com Scheduler e Gina.",
    stepIds: ["step_05", "step_13", "step_19", "step_21", "step_23", "step_24", "step_29", "step_31"],
    technologyType: "Workflow",
    technologyOptions: [
      { name: "Workflow de aprovação", family: "workflow", role: "primary", roleDescription: "Gerencia filas, escalonamentos e retornos de aprovação", status: "needs_validation" },
    ],
    effort: { level: "high", score: 60, confidence: "medium", drivers: ["Múltiplas alçadas", "Regras condicionais"], unknowns: ["Integração com S4 approval flow"] },
    humanInTheLoop: { hasHumanControl: true, description: "Aprovação humana obrigatória em alçadas definidas.", level: "yes" },
    impact: { level: "relevant", rationale: "Reduz tempo de roteamento e elimina encaminhamentos manuais." },
    status: "needs_validation",
  },
  {
    id: "sol-ia-matching",
    macroBlockId: "execution",
    macroBlockName: "Execution",
    capabilityId: "cap-ia-matching",
    capabilityName: "Matching inteligente",
    name: "Matching entre fatura, VBD e Nomination Key",
    description: "Agente que localiza, associa e reconcilia VBDs com faturas usando Nomination Key, Deal e dados de transporte.",
    stepIds: ["step_07", "step_08", "step_10", "step_26", "step_27"],
    technologyType: "IA / Agente",
    technologyOptions: [
      { name: "Agente de matching especialista", family: "ai_assistance", role: "primary", roleDescription: "Localiza e associa VBDs a faturas por múltiplos critérios", status: "needs_validation" },
    ],
    effort: { level: "high", score: 70, confidence: "low", drivers: ["Lógica de matching complexa", "Múltiplos sistemas"], unknowns: ["Acesso a APIs Fiori"] },
    humanInTheLoop: { hasHumanControl: true, description: "Validação humana do match antes de postagem.", level: "partial" },
    impact: { level: "transformative", rationale: "Automatiza a etapa mais demorada: localizar e reconciliar VBDs." },
    status: "needs_validation",
  },
  {
    id: "sol-eval-anomaly",
    macroBlockId: "exception",
    macroBlockName: "Exception",
    capabilityId: "cap-eval-anomaly",
    capabilityName: "Detecção de anomalias",
    name: "Detecção de duplicidade e valores fora de tolerância",
    description: "Avalia faturas quanto a duplicidade, valores fora de tolerância, materiais incorretos e divergências de Document Type.",
    stepIds: ["step_11", "step_16", "step_25"],
    technologyType: "Evaluator",
    technologyOptions: [
      { name: "Evaluator / Controle de anomalias", family: "monitoring", role: "primary", roleDescription: "Detecta duplicidades, tolerâncias excedidas e inconsistências", status: "needs_validation" },
    ],
    effort: { level: "medium", score: 45, confidence: "medium", drivers: ["Regras de tolerância existentes"], unknowns: ["Acesso a histórico de faturas"] },
    humanInTheLoop: { hasHumanControl: true, description: "Exceções sempre requerem decisão humana.", level: "yes" },
    impact: { level: "relevant", rationale: "Reduz risco de postagem incorreta e retrabalho." },
    status: "needs_validation",
  },
  {
    id: "sol-rules-coding",
    macroBlockId: "execution",
    macroBlockName: "Execution",
    capabilityId: "cap-rules-coding",
    capabilityName: "Codificação automatizada",
    name: "Codificação por fornecedor e tipo de fatura",
    description: "Motor de regras que aplica codificação fixa (G/L, Material, Profit Center) por fornecedor e tipo de documento.",
    stepIds: ["step_14"],
    technologyType: "Motor de regras",
    technologyOptions: [
      { name: "Motor de regras de codificação", family: "decision_rules", role: "primary", roleDescription: "Aplica codificação fixa por fornecedor", status: "needs_validation" },
    ],
    effort: { level: "low", score: 20, confidence: "high", drivers: ["Codificação fixa e estável"], unknowns: [] },
    humanInTheLoop: { hasHumanControl: false, description: "Codificação determinística.", level: "no" },
    impact: { level: "relevant", rationale: "Elimina erro humano na codificação contábil." },
    status: "needs_validation",
  },
  {
    id: "sol-analytics-recon",
    macroBlockId: "execution",
    macroBlockName: "Execution",
    capabilityId: "cap-analytics-recon",
    capabilityName: "Reconciliação analítica",
    name: "Reconciliação de valores, entregas e tolerâncias",
    description: "Consolida dados de múltiplas fontes (T4, ICE, SAP) para reconciliar volumes, valores e entregas.",
    stepIds: ["step_18", "step_28"],
    technologyType: "Analytics",
    technologyOptions: [
      { name: "Analytics de reconciliação", family: "monitoring", role: "primary", roleDescription: "Cruza dados de fatura com entregas e identifica divergências", status: "needs_validation" },
    ],
    effort: { level: "high", score: 55, confidence: "medium", drivers: ["Múltiplas fontes de dados"], unknowns: ["Acesso a T4 e ICE via API"] },
    humanInTheLoop: { hasHumanControl: true, description: "Validação humana dos resultados de reconciliação.", level: "partial" },
    impact: { level: "transformative", rationale: "Automatiza cruzamento de dados que hoje leva horas." },
    status: "needs_validation",
  },
  {
    id: "sol-rpa-report",
    macroBlockId: "codification",
    macroBlockName: "Codification",
    capabilityId: "cap-rpa-report",
    capabilityName: "Consolidação e relatórios",
    name: "Consolidação de relatórios e arquivos de apoio",
    description: "Automatiza extração de dados (FAGLL03H, VIM), preparação de planilhas, exportação de Nomination Keys e geração de relatórios intercompany.",
    stepIds: ["step_02", "step_15", "step_17", "step_20"],
    technologyType: "RPA / Planilha",
    technologyOptions: [
      { name: "RPA + Automação de planilha", family: "rpa", role: "primary", roleDescription: "Extrai dados SAP, prepara planilhas e gera relatórios padronizados", status: "needs_validation" },
    ],
    effort: { level: "medium", score: 35, confidence: "high", drivers: ["Extração periódica", "Formatação padronizada"], unknowns: [] },
    humanInTheLoop: { hasHumanControl: false, description: "Geração automática de relatórios.", level: "no" },
    impact: { level: "relevant", rationale: "Elimina preparação manual de relatórios recorrentes." },
    status: "needs_validation",
  },
];


/**
 * 8 Steps Canônicos de Demonstração (com sub-steps e vinculação completa)
 */
export const CANONICAL_DEMO_STEPS: ProcessStepDetail[] = [
  {
    id: "01",
    number: "01",
    sourceRef: "1.1",
    macroBlockId: "intake",
    macroBlockName: "Intake",
    title: "Preparar o relatório de posições e filtros regionais",
    description: "Acessar o sistema de origem (Workday), aplicar filtros geográficos de jurisdição e consolidar posições ativas ou em aberto.",
    classification: "ME",
    substeps: [
      { id: "01.1", sourceRef: "1.1.1", description: "Abrir o relatório 'Open and Filled Positions Master' no Workday." },
      { id: "01.2", sourceRef: "1.1.2", description: "Aplicar filtro de região LATAM / Brasil no formulário de extração." },
      { id: "01.3", sourceRef: "1.1.3", description: "Incluir posições cobertas ou vagas até a data de corte do período." },
    ],
    solutionId: "solution-01",
    solutionIds: ["solution-01"],
    solutionName: "Preparação automatizada do relatório",
    technologyType: "RPA",
    technology: "RPA para interface de sistema",
    technologyOptions: [
      { name: "UiPath / Power Automate", role: "primary", rationale: "Automatiza navegação e extração de parâmetros no Workday" },
      { name: "Automação de planilha", role: "alternative", rationale: "Padroniza e filtra abas da planilha" },
    ],
    effort: { level: "medium", score: 35, confidence: "high", drivers: ["Automação de interface de usuário", "Extração periódica"], unknowns: [] },
    humanInTheLoop: {
      hasHumanControl: true,
      summary: "Revisão pontual de filtros antes da execução",
      details: "Especialista valida o corte temporal quando ocorrem mudanças de política corporativa.",
    },
    humanControl: {
      required: true,
      description: "Revisão dos filtros antes da execução pelo operador.",
    },
    evidence: {
      sourceReference: "SOP Seção 1.1",
      rawDescription: "Abertura e filtragem do relatório Open and Filled Positions Master.",
    },
    aiInterpretation: {
      classificationRationale: "Passo de extração estruturada de dados com alto potencial de substituição por RPA de interface.",
      workPatternIdentified: "Extração sistemática e filtragem em ERP/HRIS.",
    },
  },
  {
    id: "02",
    number: "02",
    sourceRef: "1.2",
    macroBlockId: "intake",
    macroBlockName: "Intake",
    title: "Extrair estrutura da organização supervisora",
    description: "Buscar dados da hierarquia organizacional e linhas de reporte formal (Solid Line) diretamente na base corporativa.",
    classification: "ME",
    substeps: [
      { id: "02.1", sourceRef: "1.2.1", description: "Consultar a entidade organizacional no catálogo corporativo." },
      { id: "02.2", sourceRef: "1.2.2", description: "Extrair o mapeamento 'Supervisory Organization (Solid Line)' via serviço de dados." },
    ],
    solutionId: "solution-02",
    solutionIds: ["solution-02"],
    solutionName: "Busca de dados no sistema de origem via conector",
    technologyType: "Integrações",
    technology: "API REST / Python ETL",
    technologyOptions: [
      { name: "Workday REST API + Python", role: "primary", rationale: "Conector nativo que extrai dados em tempo real sem interação em tela" },
    ],
    effort: { level: "low", score: 20, confidence: "high", drivers: ["Endpoint padronizado de consulta"], unknowns: [] },
    humanInTheLoop: {
      hasHumanControl: false,
      summary: "Processamento automatizado sem bloqueio",
    },
    humanControl: {
      required: false,
      description: "Consulta automática sem intervenção manual.",
    },
    evidence: {
      sourceReference: "SOP Seção 1.2",
      rawDescription: "Extração da Supervisory Organization (Solid Line).",
    },
  },
  {
    id: "03",
    number: "03",
    sourceRef: "2.1",
    macroBlockId: "routing",
    macroBlockName: "Routing",
    title: "Exportar e transferir relatórios para repositório compartilhado",
    description: "Exportar os dados consolidados em formato estruturado, validar integridade e sincronizar no Google Drive / Sheets para distribuição.",
    classification: "MS",
    substeps: [
      { id: "03.1", sourceRef: "2.1.1", description: "Gerar arquivo estruturado Excel com lote de registros." },
      { id: "03.2", sourceRef: "2.1.2", description: "Aguardar conclusão do download e checar integridade do arquivo." },
      { id: "03.3", sourceRef: "2.1.3", description: "Mover arquivos para pasta segura no Google Drive e disponibilizar no Google Sheets." },
    ],
    solutionId: "solution-03",
    solutionIds: ["solution-03"],
    solutionName: "Workflow de transferência e sincronização de pastas",
    technologyType: "Workflows",
    technology: "Power Automate Cloud / Drive API",
    technologyOptions: [
      { name: "Power Automate Cloud", role: "primary", rationale: "Gatilha movimentação automática e define permissões" },
    ],
    effort: { level: "low", score: 15, confidence: "high", drivers: ["Conectores prontos de nuvem"], unknowns: [] },
    humanInTheLoop: {
      hasHumanControl: false,
      summary: "Execução orientada a eventos sem ação manual",
    },
    humanControl: {
      required: false,
      description: "Fluxo 100% automático baseado em eventos.",
    },
    evidence: {
      sourceReference: "SOP Seção 2.1",
      rawDescription: "Exportação em Excel e cópia para repositório do Google Drive.",
    },
  },
  {
    id: "04",
    number: "04",
    sourceRef: "3.1",
    macroBlockId: "execution",
    macroBlockName: "Execution",
    title: "Localizar identificadores e quantificar níveis hierárquicos",
    description: "Identificar IDs de organizações supervisoras e calcular os níveis de camadas (layers) na cadeia de liderança.",
    classification: "ME",
    substeps: [
      { id: "04.1", sourceRef: "3.1.1", description: "Localizar ID da organização supervisora na tabela mestre." },
      { id: "04.2", sourceRef: "3.1.2", description: "Quantificar níveis hierárquicos (layers) a partir da árvore de reporte." },
    ],
    solutionId: "solution-04",
    solutionIds: ["solution-04"],
    solutionName: "Agente de conferência hierárquica e cálculo de layers",
    technologyType: "Agentes",
    technology: "Agente LLM / Script Especialista",
    technologyOptions: [
      { name: "Agente IA Especialista + Script Python", role: "primary", rationale: "Identifica anomalias em grafos hierárquicos e calcula profundidade das camadas" },
    ],
    effort: { level: "medium", score: 40, confidence: "high", drivers: ["Processamento analítico de grafos"], unknowns: [] },
    humanInTheLoop: {
      hasHumanControl: false,
      summary: "Regras matemáticas determinísticas calculadas automaticamente",
    },
    humanControl: {
      required: false,
      description: "Cálculo matemático e análise autônoma.",
    },
    evidence: {
      sourceReference: "SOP Seção 3.1",
      rawDescription: "Localização de ID e quantificação de layers.",
    },
  },
  {
    id: "05",
    number: "05",
    sourceRef: "4.1.1",
    macroBlockId: "execution",
    macroBlockName: "Execution",
    title: "Contar liderados diretos por gestor",
    description: "Processar a volumetria de liderados imediatos sob cada gestor e registrar contagem consolidada.",
    classification: "ME",
    substeps: [
      { id: "05.1", sourceRef: "4.1.1a", description: "Agrupar empregados por ID do gestor imediato." },
      { id: "05.2", sourceRef: "4.1.1b", description: "Sinalizar gestores com subordinação nula ou acima do limite teto." },
    ],
    solutionId: "solution-04b",
    solutionIds: ["solution-04b"],
    solutionName: "Preenchimento e consolidação automatizada",
    technologyType: "RPA",
    technology: "RPA / Script Python",
    technologyOptions: [
      { name: "Script Python / Bot RPA", role: "primary", rationale: "Varre os registros e persiste contagem em segundos" },
    ],
    effort: { level: "low", score: 20, confidence: "high", drivers: ["Cálculo vetorial direto"], unknowns: [] },
    humanInTheLoop: {
      hasHumanControl: false,
      summary: "Execução automatizada",
    },
    humanControl: {
      required: false,
      description: "Execução mecânica automatizada.",
    },
    evidence: {
      sourceReference: "SOP Seção 4.1.1",
      rawDescription: "Contagem de subordinados diretos por gestor.",
    },
  },
  {
    id: "06",
    number: "06",
    sourceRef: "4.1.2",
    macroBlockId: "execution",
    macroBlockName: "Execution",
    title: "Aplicar regras de elegibilidade do público administrativo",
    description: "Aplicar tabelas de decisão e critérios de exclusão/inclusão de públicos para cálculo de span.",
    classification: "MS",
    substeps: [
      { id: "06.1", sourceRef: "4.1.2a", description: "Aplicar tabela de regras para elegibilidade do público administrativo." },
      { id: "06.2", sourceRef: "4.1.2b", description: "Excluir cargos de diretoria estatuária e aprendizes conforme critérios." },
    ],
    solutionId: "solution-05",
    solutionIds: ["solution-05"],
    solutionName: "Motor de regras de elegibilidade e span",
    technologyType: "Motores de regras",
    technology: "Decision Table Engine / Business Rules",
    technologyOptions: [
      { name: "Motor de Regras de Negócio", role: "primary", rationale: "Centraliza políticas salariais e de estrutura sem código hardcoded" },
    ],
    effort: { level: "low", score: 20, confidence: "high", drivers: ["Mecanismo declarativo de regras"], unknowns: [] },
    humanInTheLoop: {
      hasHumanControl: false,
      summary: "Motor avalia as condições automaticamente",
    },
    humanControl: {
      required: false,
      description: "O motor processa e classifica conforme políticas vigentes.",
    },
    evidence: {
      sourceReference: "SOP Seção 4.1.2",
      rawDescription: "Aplicação de filtros de elegibilidade para público administrativo.",
    },
  },
  {
    id: "07",
    number: "07",
    sourceRef: "4.1.3",
    macroBlockId: "exception",
    macroBlockName: "Exception",
    title: "Tratar divergências, anomalias e exceções organizacionais",
    description: "Submeter casos ambíguos, inconsistências cadastrais e líderes com span fora de padrão para validação do especialista.",
    classification: "MNA",
    substeps: [
      { id: "07.1", sourceRef: "4.1.3a", description: "Isolar registros com dados conflitantes ou pendência de custos." },
      { id: "07.2", sourceRef: "4.1.3b", description: "Submeter para análise e deliberação do HRBP responsável." },
      { id: "07.3", sourceRef: "4.1.3c", description: "Registrar parecer de justificativa no prontuário do processo." },
    ],
    solutionId: "solution-06",
    solutionIds: ["solution-06"],
    solutionName: "Cockpit de tratamento de exceções e deliberação humana",
    technologyType: "Humano",
    technology: "Human-in-the-loop Cockpit / Power Apps",
    technologyOptions: [
      { name: "Cockpit HITL com Workflow de Aprovações", role: "primary", rationale: "Interface simplificada para deliberação do especialista com histórico" },
    ],
    effort: { level: "low", score: 20, confidence: "high", drivers: ["Tela de aprovação com formulário padrão"], unknowns: [] },
    humanInTheLoop: {
      hasHumanControl: true,
      summary: "Decisão humana indispensável para desvios de governança",
      mandatoryApproval: true,
      details: "Aprovação obrigatória de gestor para exceções que fogem às regras paramétricas.",
    },
    humanControl: {
      required: true,
      description: "Decisão humana indispensável para casos ambíguos e validação de desvios.",
    },
    evidence: {
      sourceReference: "SOP Seção 4.1.3",
      rawDescription: "Deliberação sobre líderes com span atípico ou divergências de custos.",
    },
  },
  {
    id: "08",
    number: "08",
    sourceRef: "5.1",
    macroBlockId: "codification",
    macroBlockName: "Codification",
    title: "Consolidar indicadores finais e registrar evidência de auditoria",
    description: "Gerar dashboard gerencial com médias de span, publicar relatórios e arquivar trilha auditável de conformidade.",
    classification: "SA",
    substeps: [
      { id: "08.1", sourceRef: "5.1.1", description: "Consolidar métricas finais e alimentar painéis de BI." },
      { id: "08.2", sourceRef: "5.1.2", description: "Gerar hash da base de dados e arquivar pacote de conformidade para auditoria." },
    ],
    solutionId: "solution-07",
    solutionIds: ["solution-07"],
    solutionName: "Publicação automatizada de BI e trilha de auditoria",
    technologyType: "Workflows",
    technology: "Power BI Service / Azure Blob Storage",
    technologyOptions: [
      { name: "Power BI Refresh + Storage seguro", role: "primary", rationale: "Atualiza dashboards executivos e preserva evidências imutáveis" },
    ],
    effort: { level: "low", score: 15, confidence: "high", drivers: ["Cargas automáticas agendadas"], unknowns: [] },
    humanInTheLoop: {
      hasHumanControl: false,
      summary: "Publicação e arquivamento automáticos",
    },
    humanControl: {
      required: false,
      description: "Publicação e arquivamento automáticos sem intervenção manual.",
    },
    evidence: {
      sourceReference: "SOP Seção 5.1",
      rawDescription: "Cálculo de média geral de span e publicação executiva.",
    },
  },
];

/**
 * Extrai o identificador do step principal a partir de um código de sub-step.
 * Ex: "1.1.1" -> "1.1", "2.1.3" -> "2.1", "4.1.2" -> "4.1"
 */
export function getMainStepReference(sourceRef?: string): string {
  if (!sourceRef) return "1.1";
  const clean = String(sourceRef).trim();
  const parts = clean.split(".");
  if (parts.length >= 2) {
    return `${parts[0]}.${parts[1]}`;
  }
  return parts[0];
}

/**
 * Agrupa atividades brutas / sub-steps da SOP em Steps Principais compreensíveis.
 * Conforme item 6 do prompt:
 * Step principal
 * └── Sub-steps
 */
export function buildMainSteps(rawActivities: (LegacyAutomationRow | any)[]): ProcessStepDetail[] {
  if (!rawActivities || rawActivities.length === 0) {
    return CANONICAL_DEMO_STEPS;
  }

  // Agrupa sub-steps pela chave do step principal (ex: "1.1", "1.2", "2.1", etc.)
  const groupMap = new Map<
    string,
    {
      sourceRef: string;
      rawTitles: string[];
      classifications: Classification[];
      techs: string[];
      substeps: ProcessStepSubstep[];
    }
  >();

  rawActivities.forEach((act) => {
    const rawRef = act.step || act.sourceRef || "";
    const mainRef = getMainStepReference(rawRef);

    if (!groupMap.has(mainRef)) {
      groupMap.set(mainRef, {
        sourceRef: mainRef,
        rawTitles: [],
        classifications: [],
        techs: [],
        substeps: [],
      });
    }

    const group = groupMap.get(mainRef)!;
    group.rawTitles.push(act.title || act.description || "");
    if (act.classification) group.classifications.push(act.classification);
    if (act.tech && act.tech !== "—") group.techs.push(act.tech);

    // Adiciona o sub-step estruturado
    const subId = `${mainRef}.${group.substeps.length + 1}`;
    group.substeps.push({
      id: subId,
      sourceRef: rawRef,
      description: act.title || act.description || `Microatividade ${subId}`,
    });
  });

  const groupedEntries = Array.from(groupMap.values());

  // Mapeia para os steps da demonstração estruturados
  const builtSteps: ProcessStepDetail[] = groupedEntries.map((group, index) => {
    const stepNumber = String(index + 1).padStart(2, "0");
    const canonicalFallback = CANONICAL_DEMO_STEPS[index % CANONICAL_DEMO_STEPS.length];

    // Determina a macroetapa de acordo com a ordem do step
    let macroBlockId = "entrada";
    if (index === 0 || index === 1) macroBlockId = "entrada";
    else if (index === 2) macroBlockId = "roteamento";
    else if (index >= 3 && index <= 5) macroBlockId = "execucao";
    else if (index === 6) macroBlockId = "excecao";
    else macroBlockId = "codificacao";

    const macroBlock = CANONICAL_MACROBLOCKS.find((m) => m.id === macroBlockId);

    // Determina classificação principal (se houver ME, prevalece ME)
    let classification: Classification = canonicalFallback.classification;
    if (group.classifications.includes("ME")) classification = "ME";
    else if (group.classifications.includes("MS")) classification = "MS";
    else if (group.classifications.includes("MNA")) classification = "MNA";
    else if (group.classifications[0]) classification = group.classifications[0];

    // Determina solução vinculada
    const matchingSol =
      CANONICAL_DEMO_SOLUTIONS.find((s) => s.macroBlockId === macroBlockId) ||
      canonicalFallback;

    return {
      id: stepNumber,
      number: stepNumber,
      sourceRef: group.sourceRef,
      title: canonicalFallback.title,
      description: canonicalFallback.description,
      classification,
      macroBlockId,
      macroBlockName: macroBlock?.name || canonicalFallback.macroBlockName,
      substeps: group.substeps.length > 0 ? group.substeps : canonicalFallback.substeps,
      solutionId: matchingSol.id,
      solutionIds: [matchingSol.id],
      solutionName: matchingSol.name,
      technologyType: matchingSol.technologyType,
      technology: canonicalFallback.technology,
      technologyOptions: canonicalFallback.technologyOptions,
      effort: canonicalFallback.effort,
      humanInTheLoop: canonicalFallback.humanInTheLoop,
      humanControl: canonicalFallback.humanControl,
      evidence: {
        sourceReference: `SOP Seção ${group.sourceRef}`,
        rawDescription: group.rawTitles.join(" · "),
      },
      aiInterpretation: canonicalFallback.aiInterpretation,
    };
  });

  // Garante pelo menos 8 steps para a demonstração completa das 5 macroetapas
  if (builtSteps.length < 8) {
    const remaining = CANONICAL_DEMO_STEPS.slice(builtSteps.length);
    remaining.forEach((rem, idx) => {
      const stepNumber = String(builtSteps.length + idx + 1).padStart(2, "0");
      builtSteps.push({
        ...rem,
        id: stepNumber,
        number: stepNumber,
      });
    });
  }

  return builtSteps;
}

/**
 * Retorna dados detalhados de automação para um processo com enriquecimento completo.
 * Garante SEMPRE cinco macroetapas (Entrada -> Roteamento -> Execução -> Exceção -> Codificação)
 * e Steps principais como unidade de trabalho, com sub-steps subordinados.
 */

export const DIGITAL_LAYERS_DEMO = {
  orchestrator: {
    id: "orchestrator-01",
    name: "Orchestrator Agent",
    transversal: true,
    startMacroBlockId: "intake"
  },
  integrationLayer: {
    id: "integration-layer-01",
    name: "MCP / Integration Layer",
    transversal: true,
    technologyTypes: ["api", "mcp", "rpa", "connector"]
  },
  anomalyDetection: {
    id: "anomaly-01",
    name: "Anomaly Detection / Evaluator",
    transversal: true,
    afterMacroBlockIds: ["execution"],
    exceptionMacroBlockId: "exception",
    codificationMacroBlockId: "codification"
  }
};

export const HUMAN_CONTROLS_DEMO = [
  {
    id: "human-01",
    label: "Aprovação de exceções",
    macroBlockIds: ["exception"]
  },
  {
    id: "human-02",
    label: "Validação de resultado",
    macroBlockIds: ["exception", "codification"]
  },
  {
    id: "human-03",
    label: "Decisão sobre casos ambíguos",
    macroBlockIds: ["exception"]
  },
  {
    id: "human-04",
    label: "Revisão antes de ação sensível",
    macroBlockIds: ["execution"]
  }
];

export function getProcessAutomationDetail(
  processId?: string,
  processName?: string,
  legacySteps?: LegacyAutomationRow[]
): ProcessAutomationDetailData {
  let result: ProcessAutomationDetailData;
  let isDemo = false;

  // 1. Verifica se existe dataset pré-mapeado rico com 5 macroblocos
  if (
    processId &&
    automationDetailMap[processId] &&
    automationDetailMap[processId].macroBlocks.length === 5
  ) {
    const data = automationDetailMap[processId];
    result = processName ? { ...data, processName } : { ...data };
  } else {
    // Para esta demonstração de framework agêntico, forçamos o uso do novo dataset (P66_L6DTP)
    result = { 
      ...specialHandlingAutomationData,
      solutions: specialHandlingAutomationData.solutions?.length ? specialHandlingAutomationData.solutions : CANONICAL_DEMO_SOLUTIONS.map((s) => ({ ...s })),
      digitalLayers: specialHandlingAutomationData.digitalLayers || DIGITAL_LAYERS_DEMO,
      humanControls: specialHandlingAutomationData.humanControls?.length ? specialHandlingAutomationData.humanControls : HUMAN_CONTROLS_DEMO,
    };
    isDemo = true;
  }

  result.isDemoMode = isDemo || result.isDemoMode;

  // 5. Enriquecimento de insumos e saídas padrão para os 5 macroblocos canônicos
  const defaultMacroMeta: Record<
    number,
    { inputs: string; outputs: string; supportingAgents: string[] }
  > = {
    1: {
      inputs: "Pedido, anexos, solicitante e assunto",
      outputs: "Caso registrado com dados mínimos e pendências sinalizadas",
      supportingAgents: ["Agente classificador de demanda", "Agente de preparação de insumos"],
    },
    2: {
      inputs: "Caso estruturado, categoria, prioridade e risco",
      outputs: "Fila, responsável e contexto do handoff definidos",
      supportingAgents: ["Agente classificador de demanda", "Agente de roteamento"],
    },
    3: {
      inputs: "Caso aprovado, dados preparados e ação definida",
      outputs: "Transação executada e resultado retornado para controle",
      supportingAgents: ["Agente especialista de execução", "Agente assistente de sistema"],
    },
    4: {
      inputs: "Resultado, erro, divergência e evidências disponíveis",
      outputs: "Exceção classificada, proposta de tratamento e escalonamento",
      supportingAgents: ["Agente de triagem de exceções", "Agente de conciliação"],
    },
    5: {
      inputs: "Documentos, decisão, resultado e histórico do caso",
      outputs: "Trilha auditável, comunicação e precedente reutilizável",
      supportingAgents: ["Agente de registro de evidências", "Agente de aprendizado de exceções"],
    },
  };

  result.macroBlocks = result.macroBlocks.map((mb, idx) => {
    const meta = defaultMacroMeta[mb.order || idx + 1] || {
      inputs: "Insumos da etapa",
      outputs: "Entregáveis validados",
      supportingAgents: ["Agente assistente de processos"],
    };
    return {
      ...mb,
      inputs: mb.inputs || meta.inputs,
      outputs: mb.outputs || meta.outputs,
      supportingAgents: mb.supportingAgents || meta.supportingAgents,
    };
  });

  // 6. Enriquecimento dos steps com sub-steps estruturados, technologyType e solutionIds
  result.steps = result.steps.map((step) => {
    const substeps = ensureStepSubsteps(step);
    const sol = result.solutions.find((s) => s.id === step.solutionId);
    const techType = step.technologyType || inferTechnologyType(sol, step);
    const solutionIds = step.solutionIds && step.solutionIds.length > 0 ? step.solutionIds : (step.solutionId ? [step.solutionId] : []);

    return {
      ...step,
      substeps,
      technologyType: techType,
      solutionIds,
      solutionName: step.solutionName || sol?.name,
    };
  });

  // 7. Enriquecimento das soluções com technologyType inferido
  result.solutions = result.solutions.map((sol) => {
    const techType = sol.technologyType || inferTechnologyType(sol);
    return {
      ...sol,
      technologyType: techType,
    };
  });

  // 8. Sincroniza a contagem real de steps de cada macroetapa
  const countMap = new Map<string, number>();
  result.steps.forEach((s) => {
    countMap.set(s.macroBlockId, (countMap.get(s.macroBlockId) || 0) + 1);
  });

  result.macroBlocks = result.macroBlocks.map((mb) => ({
    ...mb,
    stepCount: countMap.get(mb.id) || 0,
  }));

  return result;
}

/**
 * Utilitários de renderização de esforço e badges
 */
export function getEffortBadgeInfo(level?: EffortLevel) {
  switch (level) {
    case "very_high":
      return { label: "Muito Alto", dots: 5, color: "text-red-700 bg-red-50 border-red-200" };
    case "high":
      return { label: "Alto", dots: 4, color: "text-amber-700 bg-amber-50 border-amber-200" };
    case "medium":
      return { label: "Médio", dots: 3, color: "text-yellow-700 bg-yellow-50 border-yellow-200" };
    case "low":
      return { label: "Baixo", dots: 2, color: "text-emerald-700 bg-emerald-50 border-emerald-200" };
    case "not_applicable":
      return { label: "Não aplicável", dots: 0, color: "text-slate-600 bg-slate-100 border-slate-200" };
    default:
      return { label: "Não informado", dots: 0, color: "text-muted-foreground bg-muted border-border" };
  }
}

export function getClassificationMeta(classification: Classification) {
  const meta: Record<Classification, { label: string; full: string; color: string; desc: string }> = {
    ME: { label: "ME", full: "Manual Estruturado", color: "bg-red-100 text-red-700 border-red-200", desc: "Execução mecânica, regras 100% fixas, sem julgamento." },
    MS: { label: "MS", full: "Manual Semi-Estruturado", color: "bg-amber-100 text-amber-800 border-amber-200", desc: "Execução com julgamento simples e codificável (se X então Y)." },
    MA: { label: "MA", full: "Manual Analítico", color: "bg-orange-100 text-orange-800 border-orange-200", desc: "Interpretação de contexto amplo, raciocínio e análise humana." },
    SA: { label: "SA", full: "Semi-Automatizado", color: "bg-blue-100 text-blue-700 border-blue-200", desc: "Gatilho manual + execução sistêmica em 80%+ do trabalho." },
    AU: { label: "AU", full: "Automatizado", color: "bg-emerald-100 text-emerald-700 border-emerald-200", desc: "Execução 100% sistêmica sem necessidade de gatilho humano." },
    MNA: { label: "MNA", full: "Manual Não-Automatizável", color: "bg-slate-200 text-slate-800 border-slate-300", desc: "Exige presença física, julgamento ético/legal ou relacional." },
  };
  return meta[classification] || { label: classification, full: classification, color: "bg-muted text-foreground border-border", desc: "" };
}

export function getImpactBadgeInfo(level?: import("@/types/automationDetailTypes").ImpactLevel) {
  switch (level) {
    case "transformative":
      return { label: "Transformador", color: "bg-purple-100 text-purple-800 border-purple-200" };
    case "relevant":
      return { label: "Relevante", color: "bg-indigo-100 text-indigo-800 border-indigo-200" };
    case "incremental":
      return { label: "Incremental", color: "bg-blue-100 text-blue-800 border-blue-200" };
    case "not_assessed":
    default:
      return { label: "Não avaliado", color: "bg-slate-100 text-slate-700 border-slate-200" };
  }
}

export function getProfileBadgeInfo(profile?: import("@/types/automationDetailTypes").ImplementationProfile) {
  switch (profile) {
    case "quick_win":
      return {
        label: "Quick win",
        fullLabel: "Quick win (incremental)",
        color: "bg-emerald-50 text-emerald-700 border-emerald-200",
        indicatorColor: "bg-emerald-500",
      };
    case "intermediate":
      return {
        label: "Intermediário",
        fullLabel: "Evolução intermediária",
        color: "bg-blue-50 text-blue-700 border-blue-200",
        indicatorColor: "bg-blue-500",
      };
    case "transformative":
      return {
        label: "Transformação",
        fullLabel: "Transformação futura",
        color: "bg-purple-50 text-purple-700 border-purple-200",
        indicatorColor: "bg-purple-500",
      };
    default:
      return {
        label: "Não categorizado",
        fullLabel: "Não categorizado",
        color: "bg-slate-50 text-slate-700 border-slate-200",
        indicatorColor: "bg-slate-400",
      };
  }
}

export function getStatusBadgeInfo(status?: import("@/types/automationDetailTypes").SolutionStatus) {
  switch (status) {
    case "future_state_proposal":
      return { label: "Proposta futura", color: "bg-blue-100 text-blue-800 border-blue-200" };
    case "needs_validation":
      return { label: "Requer validação", color: "bg-amber-100 text-amber-800 border-amber-200" };
    case "technically_validated":
      return { label: "Validado tecnicamente", color: "bg-emerald-100 text-emerald-800 border-emerald-200" };
    case "insufficient_data":
      return { label: "Dados insuficientes", color: "bg-slate-100 text-slate-700 border-slate-200" };
    default:
      return { label: "Em análise", color: "bg-slate-100 text-slate-700 border-slate-200" };
  }
}

export function calculateCatalogKPIs(solutions: SolutionRecommendation[], steps: ProcessStepDetail[] = []) {
  const totalSolutions = solutions.length;

  const techTypeSet = new Set<string>();
  solutions.forEach((s) => {
    if (s.technologyType) techTypeSet.add(s.technologyType);
  });
  if (steps.some((st) => st.classification === "MNA" || st.humanInTheLoop?.hasHumanControl)) {
    techTypeSet.add("Humano");
  }
  const totalTechnologyTypes = techTypeSet.size;

  const techSet = new Set<string>();
  solutions.forEach((s) => {
    if (s.implementationPaths && s.implementationPaths.length > 0) {
      s.implementationPaths.forEach((path) => {
        path.technologies.forEach((t) => techSet.add(t.name.trim()));
      });
    } else if (s.technologyOptions && s.technologyOptions.length > 0) {
      s.technologyOptions.forEach((t) => techSet.add(t.name.trim()));
    }
  });
  const totalCandidateTechnologies = techSet.size;

  const stepSet = new Set<string>();
  solutions.forEach((s) => {
    s.stepIds.forEach((id) => stepSet.add(String(id)));
  });
  const totalAddressedSteps = stepSet.size;

  const totalHumanInTheLoop = solutions.filter(
    (s) => s.humanInTheLoop?.hasHumanControl
  ).length;

  const capabilitySet = new Set<string>();
  solutions.forEach((s) => {
    if (s.capabilityName) capabilitySet.add(s.capabilityName.trim());
  });
  const totalCapabilities = capabilitySet.size;

  return {
    totalSolutions,
    totalCapabilities,
    totalTechnologyTypes,
    totalCandidateTechnologies,
    totalAddressedSteps,
    totalHumanInTheLoop,
  };
}
