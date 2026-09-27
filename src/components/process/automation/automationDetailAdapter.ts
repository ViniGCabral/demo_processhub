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
  | "IntegraÃ§Ãµes"
  | "Rule engines"
  | "AutomaÃ§Ã£o de planilha"
  | "Human";

export const ALL_TECHNOLOGY_CATEGORIES: TechnologyCategory[] = [
  "Agentes",
  "RPA",
  "Workflows",
  "IntegraÃ§Ãµes",
  "Rule engines",
  "AutomaÃ§Ã£o de planilha",
  "Human",
];

export interface LegacyAutomationRow {
  step: string;
  title: string;
  classification: Classification;
  tech: string;
}

/**
 * Mapeamento de metadados visuais para as categorias tecnolÃ³gicas da Camada Digital
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
    case "IntegraÃ§Ãµes":
      return {
        label: "IntegraÃ§Ãµes",
        icon: ArrowLeftRight,
        color: "text-indigo-700 bg-indigo-50 border-indigo-200",
        badgeColor: "bg-indigo-100 text-indigo-800 border-indigo-200",
        iconColor: "text-indigo-600",
        bgLight: "bg-indigo-50/40",
      };
    case "Rule engines":
      return {
        label: "Rule engines",
        icon: Sliders,
        color: "text-rose-700 bg-rose-50 border-rose-200",
        badgeColor: "bg-rose-100 text-rose-800 border-rose-200",
        iconColor: "text-rose-600",
        bgLight: "bg-rose-50/40",
      };
    case "AutomaÃ§Ã£o de planilha":
      return {
        label: "AutomaÃ§Ã£o de planilha",
        icon: FileSpreadsheet,
        color: "text-emerald-700 bg-emerald-50 border-emerald-200",
        badgeColor: "bg-emerald-100 text-emerald-800 border-emerald-200",
        iconColor: "text-emerald-600",
        bgLight: "bg-emerald-50/40",
      };
    case "Human":
    default:
      return {
        label: "Human",
        icon: UserCheck,
        color: "text-teal-700 bg-teal-50 border-teal-200",
        badgeColor: "bg-teal-100 text-teal-800 border-teal-200",
        iconColor: "text-teal-600",
        bgLight: "bg-teal-50/40",
      };
  }
}

/**
 * Infere a categoria tecnolÃ³gica a partir de dados da soluÃ§Ã£o ou do step
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
    return "Human";
  }

  // Coleta nomes e famÃ­lias de tecnologias presentes
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
    combinedText.includes("aprovaÃ§Ã£o") ||
    combinedText.includes("esteira")
  ) {
    return "Workflows";
  }

  // 4. Motores de Regras
  if (
    families.includes("decision_rules") ||
    combinedText.includes("brf+") ||
    combinedText.includes("motor de regras") ||
    combinedText.includes("tabela de decisÃ£o") ||
    combinedText.includes("regras")
  ) {
    return "Rule engines";
  }

  // 5. AutomaÃ§Ã£o de Planilha
  if (
    families.includes("spreadsheet_automation") ||
    families.includes("data_transformation") ||
    combinedText.includes("excel") ||
    combinedText.includes("planilha") ||
    combinedText.includes("vba") ||
    combinedText.includes("office scripts") ||
    combinedText.includes("power query")
  ) {
    return "AutomaÃ§Ã£o de planilha";
  }

  // 6. IntegraÃ§Ãµes
  if (
    families.includes("system_integration") ||
    combinedText.includes("api") ||
    combinedText.includes("integraÃ§Ã£o") ||
    combinedText.includes("bapi") ||
    combinedText.includes("odata") ||
    combinedText.includes("webhook")
  ) {
    return "IntegraÃ§Ãµes";
  }

  // 7. Humano
  if (
    step?.humanInTheLoop?.hasHumanControl ||
    combinedText.includes("manual") ||
    combinedText.includes("Human")
  ) {
    return "Human";
  }

  return "IntegraÃ§Ãµes";
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
 * Agrupa soluÃ§Ãµes e steps de uma macroetapa por categoria tecnolÃ³gica para a Camada Digital
 */
export function getMacroBlockDigitalSolutions(
  macroBlock: MacroBlock,
  steps: ProcessStepDetail[],
  solutions: SolutionRecommendation[]
): DigitalSolutionsGroup[] {
  const mbSteps = steps.filter((s) => s.macroBlockId === macroBlock.id);
  const mbStepIdSet = new Set(mbSteps.map((s) => String(s.id)));

  // Identifica soluÃ§Ãµes que pertencem diretamente a este bloco ou cujos steps intersectam este bloco
  const mbSolutions = solutions.filter(
    (sol) =>
      sol.macroBlockId === macroBlock.id ||
      sol.stepIds.some((id) => mbStepIdSet.has(String(id)))
  );

  const groupMap = new Map<TechnologyCategory, DigitalSolutionItem[]>();

  ALL_TECHNOLOGY_CATEGORIES.forEach((cat) => {
    groupMap.set(cat, []);
  });

  // 1. Processa as soluÃ§Ãµes mapeadas
  mbSolutions.forEach((sol) => {
    const relevantStepIds = sol.stepIds.filter((id) => mbStepIdSet.has(String(id)));
    const targetStepIds = relevantStepIds.length > 0 ? relevantStepIds : sol.stepIds.slice(0, 3);

    // Identifica quais caminhos/tecnologias a soluÃ§Ã£o possui
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

    // Se nenhuma categoria especÃ­fica foi detectada nos caminhos, infere pelo conjunto da soluÃ§Ã£o
    if (foundCategories.size === 0) {
      foundCategories.add(inferTechnologyType(sol));
    }

    // Cria um card para cada categoria tecnolÃ³gica coberta pela soluÃ§Ã£o
    foundCategories.forEach((cat) => {
      // Encontra a tecnologia mais representativa dessa categoria na soluÃ§Ã£o
      let techName = "SoluÃ§Ã£o tecnolÃ³gica";
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

      // Nome curto e especÃ­fico para o card
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

  // 2. Processa steps da macroetapa que exigem intervenÃ§Ã£o humana estrita (MNA ou hasHumanControl sem automaÃ§Ã£o)
  mbSteps.forEach((step) => {
    if (
      step.classification === "MNA" ||
      (!step.solutionId && step.humanInTheLoop?.hasHumanControl)
    ) {
      const alreadyInHuman = groupMap
        .get("Human")
        ?.some((item) => item.stepIds.includes(step.id));
      if (!alreadyInHuman) {
        groupMap.get("Human")?.push({
          id: `step-human-${step.id}`,
          title: "RevisÃ£o / decisÃ£o humana",
          stepIds: [step.id],
          techBadge: step.humanInTheLoop?.summary || "Julgamento do especialista",
          isHuman: true,
          description: step.humanInTheLoop?.details || "AÃ§Ã£o requer validaÃ§Ã£o e controle humano.",
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
 * Gera sub-steps estruturados padrÃ£o para um step caso nÃ£o estejam definidos
 */
export function ensureStepSubsteps(step: ProcessStepDetail): ProcessStepSubstep[] {
  if (step.substeps && step.substeps.length > 0) {
    return step.substeps;
  }

  const idPrefix = String(step.id).padStart(2, "0");

  if (step.title.toLowerCase().includes("planilha") || step.title.toLowerCase().includes("variantes")) {
    return [
      { id: `${idPrefix}.1`, description: "Acessar o repositÃ³rio ou pasta compartilhada da operaÃ§Ã£o." },
      { id: `${idPrefix}.2`, description: "Abrir o arquivo de planilha e selecionar a aba correspondente." },
      { id: `${idPrefix}.3`, description: "Validar parÃ¢metros, formatos de dados e consistÃªncia de filtros." },
      { id: `${idPrefix}.4`, description: "Exportar ou consolidar os registros validados para a etapa seguinte." },
    ];
  }

  if (step.title.toLowerCase().includes("f110") || step.title.toLowerCase().includes("sap")) {
    return [
      { id: `${idPrefix}.1`, description: "Acessar o ambiente SAP GUI e chamar o cÃ³digo de transaÃ§Ã£o." },
      { id: `${idPrefix}.2`, description: "Localizar e preencher parÃ¢metros de identificaÃ§Ã£o e data de execuÃ§Ã£o." },
      { id: `${idPrefix}.3`, description: "Configurar opÃ§Ãµes de log e filtros de partidas em aberto." },
      { id: `${idPrefix}.4`, description: "Salvar a parametrizaÃ§Ã£o e verificar mensagens de status no rodapÃ©." },
    ];
  }

  if (step.title.toLowerCase().includes("aprova") || step.title.toLowerCase().includes("gerente")) {
    return [
      { id: `${idPrefix}.1`, description: "Reunir o pacote de evidÃªncias, justificativas e valores da solicitaÃ§Ã£o." },
      { id: `${idPrefix}.2`, description: "Encaminhar para a esteira formal de aprovaÃ§Ã£o da alÃ§ada competente." },
      { id: `${idPrefix}.3`, description: "Aguardar decisÃ£o formal do gestor (Aprovar, Rejeitar ou Solicitar Ajuste)." },
      { id: `${idPrefix}.4`, description: "Registrar a confirmaÃ§Ã£o de liberaÃ§Ã£o na trilha de auditoria." },
    ];
  }

  if (step.title.toLowerCase().includes("bloqueio") || step.title.toLowerCase().includes("partida")) {
    return [
      { id: `${idPrefix}.1`, description: "Consultar a lista de partidas identificadas com bloqueio temporÃ¡rio." },
      { id: `${idPrefix}.2`, description: "Investigar a divergÃªncia cadastral ou limite de tolerÃ¢ncia financeira." },
      { id: `${idPrefix}.3`, description: "Aplicar a decisÃ£o corretiva ou liberar item apÃ³s esclarecimento." },
      { id: `${idPrefix}.4`, description: "Atualizar status da partida na proposta de pagamento." },
    ];
  }

  return [
    { id: `${idPrefix}.1`, description: `Iniciar a atividade e acessar os insumos necessÃ¡rios (${step.title}).` },
    { id: `${idPrefix}.2`, description: "Consultar registros e checar condiÃ§Ãµes de conformidade operacional." },
    { id: `${idPrefix}.3`, description: "Executar o preenchimento de dados ou processamento transacional." },
    { id: `${idPrefix}.4`, description: "Confirmar a persistÃªncia do resultado e arquivar log de controle." },
  ];
}

/**
 * 5 Macroetapas CanÃ´nicas MandatÃ³rias
 */
export const CANONICAL_MACROBLOCKS: MacroBlock[] = [
  {
    id: "intake",
    order: 1,
    number: "01",
    name: "Intake",
    description: "SolicitaÃ§Ãµes recebidas, arquivos, dados brutos. PreparaÃ§Ã£o do caso e validaÃ§Ã£o de completude.",
    objective: "Consolidar dados, extrair relatÃ³rios e estruturar parÃ¢metros de entrada com validaÃ§Ãµes prÃ©vias.",
    stepCount: 2,
    inputs: "Arquivos de demanda, relatÃ³rios brutos da SOP e parÃ¢metros operacionais",
    outputs: "Dados consolidados, parÃ¢metros higienizados e lotes de trabalho prontos",
    supportingAgents: ["Agente classificador de demanda", "Agente de preparaÃ§Ã£o de insumos"],
    stepIds: ["01", "02"],
    solutionIds: ["solution-01", "solution-02"],
  },
  {
    id: "routing",
    order: 2,
    number: "02",
    name: "Routing",
    description: "ClassificaÃ§Ã£o, prioridade, mapa de risco, separaÃ§Ã£o por banda e polÃ­ticas de encaminhamento.",
    objective: "Distribuir solicitaÃ§Ãµes e transferir arquivos para as instÃ¢ncias de processamento adequadas.",
    stepCount: 1,
    inputs: "Lotes de trabalho e arquivos normalizados",
    outputs: "Casos encaminhados para a fila de execuÃ§Ã£o com pastas e acessos sincronizados",
    supportingAgents: ["Agente de roteamento", "Agente de distribuiÃ§Ã£o de filas"],
    stepIds: ["03"],
    solutionIds: ["solution-03"],
  },
  {
    id: "execution",
    order: 3,
    number: "03",
    name: "Execution",
    description: "Consultas, cÃ¡lculos, atualizaÃ§Ãµes, lanÃ§amentos e execuÃ§Ã£o em sistemas. Resultado operacional.",
    objective: "Processar transformaÃ§Ãµes, aplicar regras de negÃ³cio e realizar lanÃ§amentos nos sistemas corporativos.",
    stepCount: 3,
    inputs: "Casos triados, dados estruturados e parÃ¢metros validados",
    outputs: "CÃ¡lculos concluÃ­dos, cadastros atualizados e transaÃ§Ãµes persistidas",
    supportingAgents: ["Agente de execuÃ§Ã£o operacional", "Agente de checagem de regras"],
    stepIds: ["04", "05", "06"],
    solutionIds: ["solution-04", "solution-04b", "solution-05"],
  },
  {
    id: "exception",
    order: 4,
    number: "04",
    name: "Exception",
    description: "DivergÃªncias, casos fora da regra, alÃ§adas de aprovaÃ§Ã£o, devoluÃ§Ã£o ou escalonamento.",
    objective: "Isolar anomalias, gerenciar aprovaÃ§Ãµes gerenciais e registrar intervenÃ§Ãµes especializadas.",
    stepCount: 1,
    inputs: "Casos divergentes, discrepÃ¢ncias de valores e transaÃ§Ãµes com pendÃªncia",
    outputs: "DecisÃµes de exceÃ§Ã£o tomadas, correÃ§Ãµes aplicadas e liberaÃ§Ãµes autorizadas",
    supportingAgents: ["Agente de triagem de exceÃ§Ãµes", "Agente de conciliaÃ§Ã£o"],
    stepIds: ["07"],
    solutionIds: ["solution-06"],
  },
  {
    id: "codification",
    order: 5,
    number: "05",
    name: "Codification",
    description: "EvidÃªncias, logs, histÃ³rico, relatÃ³rios. AtualizaÃ§Ã£o de polÃ­tica, regra ou orientaÃ§Ã£o.",
    objective: "Armazenar trilha de auditoria completa, publicar mÃ©tricas gerenciais e encerrar o ciclo operacional.",
    stepCount: 1,
    inputs: "TransaÃ§Ãµes concluÃ­das, logs de execuÃ§Ã£o e decisÃµes de exceÃ§Ã£o",
    outputs: "DossiÃª de auditoria arquivado, relatÃ³rios de BI publicados e status final notificado",
    supportingAgents: ["Agente de registro de evidÃªncias", "Agente de auditoria contÃ­nua"],
    stepIds: ["08"],
    solutionIds: ["solution-07"],
  },
];

/**
 * CatÃ¡logo CanÃ´nico de SoluÃ§Ãµes TecnolÃ³gicas de DemonstraÃ§Ã£o
 */
export const CANONICAL_DEMO_SOLUTIONS: SolutionRecommendation[] = [
  {
    id: "sol-rpa-upload-vim",
    macroBlockId: "execution",
    macroBlockName: "Execution",
    capabilityId: "cap-rpa-upload",
    capabilityName: "AutomaÃ§Ã£o de interface SAP",
    name: "Upload e preenchimento de faturas no SAP/VIM",
    description: "Automatiza o upload de faturas via OAWD, preenchimento de campos estruturados no VIM e criaÃ§Ã£o de VBDs no ZEWB para fluxos Trip e Non-Trip.",
    stepIds: ["step_01", "step_03", "step_04", "step_09", "step_12", "step_22", "step_30"],
    technologyType: "RPA",
    technologyOptions: [
      { name: "RPA para SAP GUI / VIM", family: "rpa", role: "primary", roleDescription: "Automatiza navegaÃ§Ã£o, upload e preenchimento em SAP GUI e VIM Workplace", status: "needs_validation" },
    ],
    effort: { level: "high", score: 65, confidence: "medium", drivers: ["MÃºltiplas transaÃ§Ãµes SAP", "Campos condicionais"], unknowns: ["PermissÃµes SAP"] },
    humanInTheLoop: { hasHumanControl: true, description: "RevisÃ£o obrigatÃ³ria antes de postagem.", level: "partial" },
    impact: { level: "transformative", rationale: "Elimina digitaÃ§Ã£o manual em 7 steps de alto volume." },
    status: "needs_validation",
  },
  {
    id: "sol-wf-routing",
    macroBlockId: "routing",
    macroBlockName: "Routing",
    capabilityId: "cap-wf-routing",
    capabilityName: "Roteamento e aprovaÃ§Ãµes",
    name: "Roteamento de aprovaÃ§Ãµes e retorno do Scheduler",
    description: "Orquestra o encaminhamento de faturas por tipo (Trip/Non-Trip), fornecedor e alÃ§ada, incluindo fluxo de aprovaÃ§Ã£o com Scheduler e Gina.",
    stepIds: ["step_05", "step_13", "step_19", "step_21", "step_23", "step_24", "step_29", "step_31"],
    technologyType: "Workflow",
    technologyOptions: [
      { name: "Workflow de aprovaÃ§Ã£o", family: "workflow", role: "primary", roleDescription: "Gerencia filas, escalonamentos e retornos de aprovaÃ§Ã£o", status: "needs_validation" },
    ],
    effort: { level: "high", score: 60, confidence: "medium", drivers: ["MÃºltiplas alÃ§adas", "Regras condicionais"], unknowns: ["IntegraÃ§Ã£o com S4 approval flow"] },
    humanInTheLoop: { hasHumanControl: true, description: "AprovaÃ§Ã£o humana obrigatÃ³ria em alÃ§adas definidas.", level: "yes" },
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
      { name: "Agente de matching especialista", family: "ai_assistance", role: "primary", roleDescription: "Localiza e associa VBDs a faturas por mÃºltiplos critÃ©rios", status: "needs_validation" },
    ],
    effort: { level: "high", score: 70, confidence: "low", drivers: ["LÃ³gica de matching complexa", "MÃºltiplos sistemas"], unknowns: ["Acesso a APIs Fiori"] },
    humanInTheLoop: { hasHumanControl: true, description: "ValidaÃ§Ã£o humana do match antes de postagem.", level: "partial" },
    impact: { level: "transformative", rationale: "Automatiza a etapa mais demorada: localizar e reconciliar VBDs." },
    status: "needs_validation",
  },
  {
    id: "sol-eval-anomaly",
    macroBlockId: "exception",
    macroBlockName: "Exception",
    capabilityId: "cap-eval-anomaly",
    capabilityName: "DetecÃ§Ã£o de anomalias",
    name: "DetecÃ§Ã£o de duplicidade e valores fora de tolerÃ¢ncia",
    description: "Avalia faturas quanto a duplicidade, valores fora de tolerÃ¢ncia, materiais incorretos e divergÃªncias de Document Type.",
    stepIds: ["step_11", "step_16", "step_25"],
    technologyType: "Evaluator",
    technologyOptions: [
      { name: "Evaluator / Controle de anomalias", family: "monitoring", role: "primary", roleDescription: "Detecta duplicidades, tolerÃ¢ncias excedidas e inconsistÃªncias", status: "needs_validation" },
    ],
    effort: { level: "medium", score: 45, confidence: "medium", drivers: ["Regras de tolerÃ¢ncia existentes"], unknowns: ["Acesso a histÃ³rico de faturas"] },
    humanInTheLoop: { hasHumanControl: true, description: "ExceÃ§Ãµes sempre requerem decisÃ£o humana.", level: "yes" },
    impact: { level: "relevant", rationale: "Reduz risco de postagem incorreta e retrabalho." },
    status: "needs_validation",
  },
  {
    id: "sol-rules-coding",
    macroBlockId: "execution",
    macroBlockName: "Execution",
    capabilityId: "cap-rules-coding",
    capabilityName: "CodificaÃ§Ã£o automatizada",
    name: "CodificaÃ§Ã£o por fornecedor e tipo de fatura",
    description: "Motor de regras que aplica codificaÃ§Ã£o fixa (G/L, Material, Profit Center) por fornecedor e tipo de documento.",
    stepIds: ["step_14"],
    technologyType: "Motor de regras",
    technologyOptions: [
      { name: "Motor de regras de codificaÃ§Ã£o", family: "decision_rules", role: "primary", roleDescription: "Aplica codificaÃ§Ã£o fixa por fornecedor", status: "needs_validation" },
    ],
    effort: { level: "low", score: 20, confidence: "high", drivers: ["CodificaÃ§Ã£o fixa e estÃ¡vel"], unknowns: [] },
    humanInTheLoop: { hasHumanControl: false, description: "CodificaÃ§Ã£o determinÃ­stica.", level: "no" },
    impact: { level: "relevant", rationale: "Elimina erro humano na codificaÃ§Ã£o contÃ¡bil." },
    status: "needs_validation",
  },
  {
    id: "sol-analytics-recon",
    macroBlockId: "execution",
    macroBlockName: "Execution",
    capabilityId: "cap-analytics-recon",
    capabilityName: "ReconciliaÃ§Ã£o analÃ­tica",
    name: "ReconciliaÃ§Ã£o de valores, entregas e tolerÃ¢ncias",
    description: "Consolida dados de mÃºltiplas fontes (T4, ICE, SAP) para reconciliar volumes, valores e entregas.",
    stepIds: ["step_18", "step_28"],
    technologyType: "Analytics",
    technologyOptions: [
      { name: "Analytics de reconciliaÃ§Ã£o", family: "monitoring", role: "primary", roleDescription: "Cruza dados de fatura com entregas e identifica divergÃªncias", status: "needs_validation" },
    ],
    effort: { level: "high", score: 55, confidence: "medium", drivers: ["MÃºltiplas fontes de dados"], unknowns: ["Acesso a T4 e ICE via API"] },
    humanInTheLoop: { hasHumanControl: true, description: "ValidaÃ§Ã£o humana dos resultados de reconciliaÃ§Ã£o.", level: "partial" },
    impact: { level: "transformative", rationale: "Automatiza cruzamento de dados que hoje leva horas." },
    status: "needs_validation",
  },
  {
    id: "sol-rpa-report",
    macroBlockId: "codification",
    macroBlockName: "Codification",
    capabilityId: "cap-rpa-report",
    capabilityName: "ConsolidaÃ§Ã£o e relatÃ³rios",
    name: "ConsolidaÃ§Ã£o de relatÃ³rios e arquivos de apoio",
    description: "Automatiza extraÃ§Ã£o de dados (FAGLL03H, VIM), preparaÃ§Ã£o de planilhas, exportaÃ§Ã£o de Nomination Keys e geraÃ§Ã£o de relatÃ³rios intercompany.",
    stepIds: ["step_02", "step_15", "step_17", "step_20"],
    technologyType: "RPA / Planilha",
    technologyOptions: [
      { name: "RPA + AutomaÃ§Ã£o de planilha", family: "rpa", role: "primary", roleDescription: "Extrai dados SAP, prepara planilhas e gera relatÃ³rios padronizados", status: "needs_validation" },
    ],
    effort: { level: "medium", score: 35, confidence: "high", drivers: ["ExtraÃ§Ã£o periÃ³dica", "FormataÃ§Ã£o padronizada"], unknowns: [] },
    humanInTheLoop: { hasHumanControl: false, description: "GeraÃ§Ã£o automÃ¡tica de relatÃ³rios.", level: "no" },
    impact: { level: "relevant", rationale: "Elimina preparaÃ§Ã£o manual de relatÃ³rios recorrentes." },
    status: "needs_validation",
  },
];


/**
 * 8 Steps CanÃ´nicos de DemonstraÃ§Ã£o (com sub-steps e vinculaÃ§Ã£o completa)
 */
export const CANONICAL_DEMO_STEPS: ProcessStepDetail[] = [
  {
    id: "01",
    number: "01",
    sourceRef: "1.1",
    macroBlockId: "intake",
    macroBlockName: "Intake",
    title: "Preparar o relatÃ³rio de posiÃ§Ãµes e filtros regionais",
    description: "Acessar o sistema de origem (Workday), aplicar filtros geogrÃ¡ficos de jurisdiÃ§Ã£o e consolidar posiÃ§Ãµes ativas ou em aberto.",
    classification: "ME",
    substeps: [
      { id: "01.1", sourceRef: "1.1.1", description: "Abrir o relatÃ³rio 'Open and Filled Positions Master' no Workday." },
      { id: "01.2", sourceRef: "1.1.2", description: "Aplicar filtro de regiÃ£o LATAM / Brasil no formulÃ¡rio de extraÃ§Ã£o." },
      { id: "01.3", sourceRef: "1.1.3", description: "Incluir posiÃ§Ãµes cobertas ou vagas atÃ© a data de corte do perÃ­odo." },
    ],
    solutionId: "solution-01",
    solutionIds: ["solution-01"],
    solutionName: "PreparaÃ§Ã£o automatizada do relatÃ³rio",
    technologyType: "RPA",
    technology: "RPA para interface de sistema",
    technologyOptions: [
      { name: "UiPath / Power Automate", role: "primary", rationale: "Automatiza navegaÃ§Ã£o e extraÃ§Ã£o de parÃ¢metros no Workday" },
      { name: "AutomaÃ§Ã£o de planilha", role: "alternative", rationale: "Padroniza e filtra abas da planilha" },
    ],
    effort: { level: "medium", score: 35, confidence: "high", drivers: ["AutomaÃ§Ã£o de interface de usuÃ¡rio", "ExtraÃ§Ã£o periÃ³dica"], unknowns: [] },
    humanInTheLoop: {
      hasHumanControl: true,
      summary: "RevisÃ£o pontual de filtros antes da execuÃ§Ã£o",
      details: "Especialista valida o corte temporal quando ocorrem mudanÃ§as de polÃ­tica corporativa.",
    },
    humanControl: {
      required: true,
      description: "RevisÃ£o dos filtros antes da execuÃ§Ã£o pelo operador.",
    },
    evidence: {
      sourceReference: "SOP SeÃ§Ã£o 1.1",
      rawDescription: "Abertura e filtragem do relatÃ³rio Open and Filled Positions Master.",
    },
    aiInterpretation: {
      classificationRationale: "Passo de extraÃ§Ã£o estruturada de dados com alto potencial de substituiÃ§Ã£o por RPA de interface.",
      workPatternIdentified: "ExtraÃ§Ã£o sistemÃ¡tica e filtragem em ERP/HRIS.",
    },
  },
  {
    id: "02",
    number: "02",
    sourceRef: "1.2",
    macroBlockId: "intake",
    macroBlockName: "Intake",
    title: "Extrair estrutura da organizaÃ§Ã£o supervisora",
    description: "Buscar dados da hierarquia organizacional e linhas de reporte formal (Solid Line) diretamente na base corporativa.",
    classification: "ME",
    substeps: [
      { id: "02.1", sourceRef: "1.2.1", description: "Consultar a entidade organizacional no catÃ¡logo corporativo." },
      { id: "02.2", sourceRef: "1.2.2", description: "Extrair o mapeamento 'Supervisory Organization (Solid Line)' via serviÃ§o de dados." },
    ],
    solutionId: "solution-02",
    solutionIds: ["solution-02"],
    solutionName: "Busca de dados no sistema de origem via conector",
    technologyType: "IntegraÃ§Ãµes",
    technology: "API REST / Python ETL",
    technologyOptions: [
      { name: "Workday REST API + Python", role: "primary", rationale: "Conector nativo que extrai dados em tempo real sem interaÃ§Ã£o em tela" },
    ],
    effort: { level: "low", score: 20, confidence: "high", drivers: ["Endpoint padronizado de consulta"], unknowns: [] },
    humanInTheLoop: {
      hasHumanControl: false,
      summary: "Processamento automatizado sem bloqueio",
    },
    humanControl: {
      required: false,
      description: "Consulta automÃ¡tica sem intervenÃ§Ã£o manual.",
    },
    evidence: {
      sourceReference: "SOP SeÃ§Ã£o 1.2",
      rawDescription: "ExtraÃ§Ã£o da Supervisory Organization (Solid Line).",
    },
  },
  {
    id: "03",
    number: "03",
    sourceRef: "2.1",
    macroBlockId: "routing",
    macroBlockName: "Routing",
    title: "Exportar e transferir relatÃ³rios para repositÃ³rio compartilhado",
    description: "Exportar os dados consolidados em formato estruturado, validar integridade e sincronizar no Google Drive / Sheets para distribuiÃ§Ã£o.",
    classification: "MS",
    substeps: [
      { id: "03.1", sourceRef: "2.1.1", description: "Gerar arquivo estruturado Excel com lote de registros." },
      { id: "03.2", sourceRef: "2.1.2", description: "Aguardar conclusÃ£o do download e checar integridade do arquivo." },
      { id: "03.3", sourceRef: "2.1.3", description: "Mover arquivos para pasta segura no Google Drive e disponibilizar no Google Sheets." },
    ],
    solutionId: "solution-03",
    solutionIds: ["solution-03"],
    solutionName: "Workflow de transferÃªncia e sincronizaÃ§Ã£o de pastas",
    technologyType: "Workflows",
    technology: "Power Automate Cloud / Drive API",
    technologyOptions: [
      { name: "Power Automate Cloud", role: "primary", rationale: "Gatilha movimentaÃ§Ã£o automÃ¡tica e define permissÃµes" },
    ],
    effort: { level: "low", score: 15, confidence: "high", drivers: ["Conectores prontos de nuvem"], unknowns: [] },
    humanInTheLoop: {
      hasHumanControl: false,
      summary: "ExecuÃ§Ã£o orientada a eventos sem aÃ§Ã£o manual",
    },
    humanControl: {
      required: false,
      description: "Fluxo 100% automÃ¡tico baseado em eventos.",
    },
    evidence: {
      sourceReference: "SOP SeÃ§Ã£o 2.1",
      rawDescription: "ExportaÃ§Ã£o em Excel e cÃ³pia para repositÃ³rio do Google Drive.",
    },
  },
  {
    id: "04",
    number: "04",
    sourceRef: "3.1",
    macroBlockId: "execution",
    macroBlockName: "Execution",
    title: "Localizar identificadores e quantificar nÃ­veis hierÃ¡rquicos",
    description: "Identificar IDs de organizaÃ§Ãµes supervisoras e calcular os nÃ­veis de camadas (layers) na cadeia de lideranÃ§a.",
    classification: "ME",
    substeps: [
      { id: "04.1", sourceRef: "3.1.1", description: "Localizar ID da organizaÃ§Ã£o supervisora na tabela mestre." },
      { id: "04.2", sourceRef: "3.1.2", description: "Quantificar nÃ­veis hierÃ¡rquicos (layers) a partir da Ã¡rvore de reporte." },
    ],
    solutionId: "solution-04",
    solutionIds: ["solution-04"],
    solutionName: "Agente de conferÃªncia hierÃ¡rquica e cÃ¡lculo de layers",
    technologyType: "Agentes",
    technology: "Agente LLM / Script Especialista",
    technologyOptions: [
      { name: "Agente IA Especialista + Script Python", role: "primary", rationale: "Identifica anomalias em grafos hierÃ¡rquicos e calcula profundidade das camadas" },
    ],
    effort: { level: "medium", score: 40, confidence: "high", drivers: ["Processamento analÃ­tico de grafos"], unknowns: [] },
    humanInTheLoop: {
      hasHumanControl: false,
      summary: "Regras matemÃ¡ticas determinÃ­sticas calculadas automaticamente",
    },
    humanControl: {
      required: false,
      description: "CÃ¡lculo matemÃ¡tico e anÃ¡lise autÃ´noma.",
    },
    evidence: {
      sourceReference: "SOP SeÃ§Ã£o 3.1",
      rawDescription: "LocalizaÃ§Ã£o de ID e quantificaÃ§Ã£o de layers.",
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
      { id: "05.2", sourceRef: "4.1.1b", description: "Sinalizar gestores com subordinaÃ§Ã£o nula ou acima do limite teto." },
    ],
    solutionId: "solution-04b",
    solutionIds: ["solution-04b"],
    solutionName: "Preenchimento e consolidaÃ§Ã£o automatizada",
    technologyType: "RPA",
    technology: "RPA / Script Python",
    technologyOptions: [
      { name: "Script Python / Bot RPA", role: "primary", rationale: "Varre os registros e persiste contagem em segundos" },
    ],
    effort: { level: "low", score: 20, confidence: "high", drivers: ["CÃ¡lculo vetorial direto"], unknowns: [] },
    humanInTheLoop: {
      hasHumanControl: false,
      summary: "ExecuÃ§Ã£o automatizada",
    },
    humanControl: {
      required: false,
      description: "ExecuÃ§Ã£o mecÃ¢nica automatizada.",
    },
    evidence: {
      sourceReference: "SOP SeÃ§Ã£o 4.1.1",
      rawDescription: "Contagem de subordinados diretos por gestor.",
    },
  },
  {
    id: "06",
    number: "06",
    sourceRef: "4.1.2",
    macroBlockId: "execution",
    macroBlockName: "Execution",
    title: "Aplicar regras de elegibilidade do pÃºblico administrativo",
    description: "Aplicar tabelas de decisÃ£o e critÃ©rios de exclusÃ£o/inclusÃ£o de pÃºblicos para cÃ¡lculo de span.",
    classification: "MS",
    substeps: [
      { id: "06.1", sourceRef: "4.1.2a", description: "Aplicar tabela de regras para elegibilidade do pÃºblico administrativo." },
      { id: "06.2", sourceRef: "4.1.2b", description: "Excluir cargos de diretoria estatuÃ¡ria e aprendizes conforme critÃ©rios." },
    ],
    solutionId: "solution-05",
    solutionIds: ["solution-05"],
    solutionName: "Motor de regras de elegibilidade e span",
    technologyType: "Rule engines",
    technology: "Decision Table Engine / Business Rules",
    technologyOptions: [
      { name: "Motor de Regras de NegÃ³cio", role: "primary", rationale: "Centraliza polÃ­ticas salariais e de estrutura sem cÃ³digo hardcoded" },
    ],
    effort: { level: "low", score: 20, confidence: "high", drivers: ["Mecanismo declarativo de regras"], unknowns: [] },
    humanInTheLoop: {
      hasHumanControl: false,
      summary: "Motor avalia as condiÃ§Ãµes automaticamente",
    },
    humanControl: {
      required: false,
      description: "O motor processa e classifica conforme polÃ­ticas vigentes.",
    },
    evidence: {
      sourceReference: "SOP SeÃ§Ã£o 4.1.2",
      rawDescription: "AplicaÃ§Ã£o de filtros de elegibilidade para pÃºblico administrativo.",
    },
  },
  {
    id: "07",
    number: "07",
    sourceRef: "4.1.3",
    macroBlockId: "exception",
    macroBlockName: "Exception",
    title: "Tratar divergÃªncias, anomalias e exceÃ§Ãµes organizacionais",
    description: "Submeter casos ambÃ­guos, inconsistÃªncias cadastrais e lÃ­deres com span fora de padrÃ£o para validaÃ§Ã£o do especialista.",
    classification: "MNA",
    substeps: [
      { id: "07.1", sourceRef: "4.1.3a", description: "Isolar registros com dados conflitantes ou pendÃªncia de custos." },
      { id: "07.2", sourceRef: "4.1.3b", description: "Submeter para anÃ¡lise e deliberaÃ§Ã£o do HRBP responsÃ¡vel." },
      { id: "07.3", sourceRef: "4.1.3c", description: "Registrar parecer de justificativa no prontuÃ¡rio do processo." },
    ],
    solutionId: "solution-06",
    solutionIds: ["solution-06"],
    solutionName: "Cockpit de tratamento de exceÃ§Ãµes e deliberaÃ§Ã£o humana",
    technologyType: "Human",
    technology: "Human-in-the-loop Cockpit / Power Apps",
    technologyOptions: [
      { name: "Cockpit HITL com Workflow de AprovaÃ§Ãµes", role: "primary", rationale: "Interface simplificada para deliberaÃ§Ã£o do especialista com histÃ³rico" },
    ],
    effort: { level: "low", score: 20, confidence: "high", drivers: ["Tela de aprovaÃ§Ã£o com formulÃ¡rio padrÃ£o"], unknowns: [] },
    humanInTheLoop: {
      hasHumanControl: true,
      summary: "DecisÃ£o humana indispensÃ¡vel para desvios de governanÃ§a",
      mandatoryApproval: true,
      details: "AprovaÃ§Ã£o obrigatÃ³ria de gestor para exceÃ§Ãµes que fogem Ã s regras paramÃ©tricas.",
    },
    humanControl: {
      required: true,
      description: "DecisÃ£o humana indispensÃ¡vel para casos ambÃ­guos e validaÃ§Ã£o de desvios.",
    },
    evidence: {
      sourceReference: "SOP SeÃ§Ã£o 4.1.3",
      rawDescription: "DeliberaÃ§Ã£o sobre lÃ­deres com span atÃ­pico ou divergÃªncias de custos.",
    },
  },
  {
    id: "08",
    number: "08",
    sourceRef: "5.1",
    macroBlockId: "codification",
    macroBlockName: "Codification",
    title: "Consolidar indicadores finais e registrar evidÃªncia de auditoria",
    description: "Gerar dashboard gerencial com mÃ©dias de span, publicar relatÃ³rios e arquivar trilha auditÃ¡vel de conformidade.",
    classification: "SA",
    substeps: [
      { id: "08.1", sourceRef: "5.1.1", description: "Consolidar mÃ©tricas finais e alimentar painÃ©is de BI." },
      { id: "08.2", sourceRef: "5.1.2", description: "Gerar hash da base de dados e arquivar pacote de conformidade para auditoria." },
    ],
    solutionId: "solution-07",
    solutionIds: ["solution-07"],
    solutionName: "PublicaÃ§Ã£o automatizada de BI e trilha de auditoria",
    technologyType: "Workflows",
    technology: "Power BI Service / Azure Blob Storage",
    technologyOptions: [
      { name: "Power BI Refresh + Storage seguro", role: "primary", rationale: "Atualiza dashboards executivos e preserva evidÃªncias imutÃ¡veis" },
    ],
    effort: { level: "low", score: 15, confidence: "high", drivers: ["Cargas automÃ¡ticas agendadas"], unknowns: [] },
    humanInTheLoop: {
      hasHumanControl: false,
      summary: "PublicaÃ§Ã£o e arquivamento automÃ¡ticos",
    },
    humanControl: {
      required: false,
      description: "PublicaÃ§Ã£o e arquivamento automÃ¡ticos sem intervenÃ§Ã£o manual.",
    },
    evidence: {
      sourceReference: "SOP SeÃ§Ã£o 5.1",
      rawDescription: "CÃ¡lculo de mÃ©dia geral de span e publicaÃ§Ã£o executiva.",
    },
  },
];

/**
 * Extrai o identificador do step principal a partir de um cÃ³digo de sub-step.
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
 * Agrupa atividades brutas / sub-steps da SOP em Steps Principais compreensÃ­veis.
 * Conforme item 6 do prompt:
 * Step principal
 * â””â”€â”€ Sub-steps
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
    if (act.tech && act.tech !== "â€”") group.techs.push(act.tech);

    // Adiciona o sub-step estruturado
    const subId = `${mainRef}.${group.substeps.length + 1}`;
    group.substeps.push({
      id: subId,
      sourceRef: rawRef,
      description: act.title || act.description || `Microatividade ${subId}`,
    });
  });

  const groupedEntries = Array.from(groupMap.values());

  // Mapeia para os steps da demonstraÃ§Ã£o estruturados
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

    // Determina classificaÃ§Ã£o principal (se houver ME, prevalece ME)
    let classification: Classification = canonicalFallback.classification;
    if (group.classifications.includes("ME")) classification = "ME";
    else if (group.classifications.includes("MS")) classification = "MS";
    else if (group.classifications.includes("MNA")) classification = "MNA";
    else if (group.classifications[0]) classification = group.classifications[0];

    // Determina soluÃ§Ã£o vinculada
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
        sourceReference: `SOP SeÃ§Ã£o ${group.sourceRef}`,
        rawDescription: group.rawTitles.join(" Â· "),
      },
      aiInterpretation: canonicalFallback.aiInterpretation,
    };
  });

  // Garante pelo menos 8 steps para a demonstraÃ§Ã£o completa das 5 macroetapas
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
 * Retorna dados detalhados de automaÃ§Ã£o para um processo com enriquecimento completo.
 * Garante SEMPRE cinco macroetapas (Entrada -> Roteamento -> ExecuÃ§Ã£o -> ExceÃ§Ã£o -> CodificaÃ§Ã£o)
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
    label: "AprovaÃ§Ã£o de exceÃ§Ãµes",
    macroBlockIds: ["exception"]
  },
  {
    id: "human-02",
    label: "ValidaÃ§Ã£o de resultado",
    macroBlockIds: ["exception", "codification"]
  },
  {
    id: "human-03",
    label: "DecisÃ£o sobre casos ambÃ­guos",
    macroBlockIds: ["exception"]
  },
  {
    id: "human-04",
    label: "RevisÃ£o antes de aÃ§Ã£o sensÃ­vel",
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

  // 1. Verifica se existe dataset prÃ©-mapeado rico com 5 macroblocos
  if (
    processId &&
    automationDetailMap[processId] &&
    automationDetailMap[processId].macroBlocks.length === 5
  ) {
    const data = automationDetailMap[processId];
    result = processName ? { ...data, processName } : { ...data };
  } else {
    // Para esta demonstraÃ§Ã£o de framework agÃªntico, forÃ§amos o uso do novo dataset (P66_L6DTP)
    result = { 
      ...specialHandlingAutomationData,
      solutions: specialHandlingAutomationData.solutions?.length ? specialHandlingAutomationData.solutions : CANONICAL_DEMO_SOLUTIONS.map((s) => ({ ...s })),
      digitalLayers: specialHandlingAutomationData.digitalLayers || DIGITAL_LAYERS_DEMO,
      humanControls: specialHandlingAutomationData.humanControls?.length ? specialHandlingAutomationData.humanControls : HUMAN_CONTROLS_DEMO,
    };
    isDemo = true;
  }

  result.isDemoMode = isDemo || result.isDemoMode;

  // 5. Enriquecimento de insumos e saÃ­das padrÃ£o para os 5 macroblocos canÃ´nicos
  const defaultMacroMeta: Record<
    number,
    { inputs: string; outputs: string; supportingAgents: string[] }
  > = {
    1: {
      inputs: "Pedido, anexos, solicitante e assunto",
      outputs: "Caso registrado com dados mÃ­nimos e pendÃªncias sinalizadas",
      supportingAgents: ["Agente classificador de demanda", "Agente de preparaÃ§Ã£o de insumos"],
    },
    2: {
      inputs: "Caso estruturado, categoria, prioridade e risco",
      outputs: "Fila, responsÃ¡vel e contexto do handoff definidos",
      supportingAgents: ["Agente classificador de demanda", "Agente de roteamento"],
    },
    3: {
      inputs: "Caso aprovado, dados preparados e aÃ§Ã£o definida",
      outputs: "TransaÃ§Ã£o executada e resultado retornado para controle",
      supportingAgents: ["Agente especialista de execuÃ§Ã£o", "Agente assistente de sistema"],
    },
    4: {
      inputs: "Resultado, erro, divergÃªncia e evidÃªncias disponÃ­veis",
      outputs: "ExceÃ§Ã£o classificada, proposta de tratamento e escalonamento",
      supportingAgents: ["Agente de triagem de exceÃ§Ãµes", "Agente de conciliaÃ§Ã£o"],
    },
    5: {
      inputs: "Documentos, decisÃ£o, resultado e histÃ³rico do caso",
      outputs: "Trilha auditÃ¡vel, comunicaÃ§Ã£o e precedente reutilizÃ¡vel",
      supportingAgents: ["Agente de registro de evidÃªncias", "Agente de aprendizado de exceÃ§Ãµes"],
    },
  };

  result.macroBlocks = result.macroBlocks.map((mb, idx) => {
    const meta = defaultMacroMeta[mb.order || idx + 1] || {
      inputs: "Insumos da etapa",
      outputs: "EntregÃ¡veis validados",
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

  // 7. Enriquecimento das soluÃ§Ãµes com technologyType inferido
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
 * UtilitÃ¡rios de renderizaÃ§Ã£o de esforÃ§o e badges
 */
export function getEffortBadgeInfo(level?: EffortLevel) {
  switch (level) {
    case "very_high":
      return { label: "Very High", dots: 5, color: "text-red-700 bg-red-50 border-red-200" };
    case "high":
      return { label: "High", dots: 4, color: "text-amber-700 bg-amber-50 border-amber-200" };
    case "medium":
      return { label: "MÃ©dio", dots: 3, color: "text-yellow-700 bg-yellow-50 border-yellow-200" };
    case "low":
      return { label: "Low", dots: 2, color: "text-emerald-700 bg-emerald-50 border-emerald-200" };
    case "not_applicable":
      return { label: "NÃ£o aplicÃ¡vel", dots: 0, color: "text-slate-600 bg-slate-100 border-slate-200" };
    default:
      return { label: "NÃ£o informado", dots: 0, color: "text-muted-foreground bg-muted border-border" };
  }
}

export function getClassificationMeta(classification: Classification) {
  const meta: Record<Classification, { label: string; full: string; color: string; desc: string }> = {
    ME: { label: "ME", full: "Manual Estruturado", color: "bg-red-100 text-red-700 border-red-200", desc: "ExecuÃ§Ã£o mecÃ¢nica, regras 100% fixas, sem julgamento." },
    MS: { label: "MS", full: "Manual Semi-Estruturado", color: "bg-amber-100 text-amber-800 border-amber-200", desc: "ExecuÃ§Ã£o com julgamento simples e codificÃ¡vel (se X entÃ£o Y)." },
    MA: { label: "MA", full: "Manual AnalÃ­tico", color: "bg-orange-100 text-orange-800 border-orange-200", desc: "InterpretaÃ§Ã£o de contexto amplo, raciocÃ­nio e anÃ¡lise humana." },
    SA: { label: "SA", full: "Semi-Automatizado", color: "bg-blue-100 text-blue-700 border-blue-200", desc: "Gatilho manual + execuÃ§Ã£o sistÃªmica em 80%+ do trabalho." },
    AU: { label: "AU", full: "Automatizado", color: "bg-emerald-100 text-emerald-700 border-emerald-200", desc: "ExecuÃ§Ã£o 100% sistÃªmica sem necessidade de gatilho humano." },
    MNA: { label: "MNA", full: "Manual NÃ£o-AutomatizÃ¡vel", color: "bg-slate-200 text-slate-800 border-slate-300", desc: "Exige presenÃ§a fÃ­sica, julgamento Ã©tico/legal ou relacional." },
  };
  return meta[classification] || { label: classification, full: classification, color: "bg-muted text-foreground border-border", desc: "" };
}

export function getImpactBadgeInfo(level?: import("@/types/automationDetailTypes").ImpactLevel) {
  switch (level) {
    case "transformative":
      return { label: "Transformative", color: "bg-purple-100 text-purple-800 border-purple-200" };
    case "relevant":
      return { label: "Relevant", color: "bg-indigo-100 text-indigo-800 border-indigo-200" };
    case "Incremental":
      return { label: "Incremental", color: "bg-blue-100 text-blue-800 border-blue-200" };
    case "not_assessed":
    default:
      return { label: "NÃ£o avaliado", color: "bg-slate-100 text-slate-700 border-slate-200" };
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
        label: "IntermediÃ¡rio",
        fullLabel: "EvoluÃ§Ã£o intermediÃ¡ria",
        color: "bg-blue-50 text-blue-700 border-blue-200",
        indicatorColor: "bg-blue-500",
      };
    case "transformative":
      return {
        label: "TransformaÃ§Ã£o",
        fullLabel: "TransformaÃ§Ã£o futura",
        color: "bg-purple-50 text-purple-700 border-purple-200",
        indicatorColor: "bg-purple-500",
      };
    default:
      return {
        label: "NÃ£o categorizado",
        fullLabel: "NÃ£o categorizado",
        color: "bg-slate-50 text-slate-700 border-slate-200",
        indicatorColor: "bg-slate-400",
      };
  }
}

export function getStatusBadgeInfo(status?: import("@/types/automationDetailTypes").SolutionStatus) {
  switch (status) {
    case "future_state_proposal":
      return { label: "Future proposal", color: "bg-blue-100 text-blue-800 border-blue-200" };
    case "needs_validation":
      return { label: "Requer validaÃ§Ã£o", color: "bg-amber-100 text-amber-800 border-amber-200" };
    case "technically_validated":
      return { label: "Technically validated", color: "bg-emerald-100 text-emerald-800 border-emerald-200" };
    case "insufficient_data":
      return { label: "Insufficient data", color: "bg-slate-100 text-slate-700 border-slate-200" };
    default:
      return { label: "Em anÃ¡lise", color: "bg-slate-100 text-slate-700 border-slate-200" };
  }
}

export function calculateCatalogKPIs(solutions: SolutionRecommendation[], steps: ProcessStepDetail[] = []) {
  const totalSolutions = solutions.length;

  const techTypeSet = new Set<string>();
  solutions.forEach((s) => {
    if (s.technologyType) techTypeSet.add(s.technologyType);
  });
  if (steps.some((st) => st.classification === "MNA" || st.humanInTheLoop?.hasHumanControl)) {
    techTypeSet.add("Human");
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

