import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { SOPData, SOPStep } from "@/data/sopMockData";
import { sopDataMap, sopDemoDefault } from "@/data/sopMockData";

export type VariantDivergenceReason =
  | "business_unit"
  | "executor"
  | "country"
  | "channel"
  | "custom";

export type DivergenceCategory =
  | "systems"
  | "business_rules"
  | "calculations"
  | "sequence"
  | "raci"
  | "compliance";

export interface SOPVariantMetrics {
  avgTimeMinutes: number;
  avgTimeLabel: string;
  automationRate: number; // 0-100
  handoffsCount: number;
  soxComplianceScore: number; // 0-100
  reworkRisk: "Baixo" | "Médio" | "Alto";
}

export interface SOPVariant {
  id: string;
  processId: string;
  name: string;
  businessUnit?: string;
  divergenceReason: VariantDivergenceReason;
  divergenceDetail?: string;
  sourceType: "video" | "document";
  sourceFileName?: string;
  transcriptionFileName?: string;
  createdAt: string;
  status: "Draft" | "Published";
  version: string;
  isDefault?: boolean;
  metrics: SOPVariantMetrics;
  sopData: SOPData;
}

export interface VariantUploadInput {
  name: string;
  businessUnit?: string;
  divergenceReason: VariantDivergenceReason;
  divergenceDetail?: string;
  sourceType: "video" | "document";
  sourceFileName?: string;
  transcriptionFileName?: string;
}

export interface DivergencePoint {
  id: string;
  category: DivergenceCategory;
  titlePT: string;
  titleEN: string;
  severity: "high" | "medium" | "low";
  stepNumber: number;
  stepTitlePT: string;
  stepTitleEN: string;
  impactSummaryPT: string;
  impactSummaryEN: string;
  /** Keyed by variant slot index (0, 1, 2...) so any N variants get rich tailored descriptions */
  slotBehaviors: Array<{
    summaryPT: string;
    summaryEN: string;
    highlightTagPT: string;
    highlightTagEN: string;
    status: "standard" | "warning" | "critical" | "best_internal";
  }>;
  benchmark: {
    summaryPT: string;
    summaryEN: string;
    recommendationPT: string;
    recommendationEN: string;
    gainLabelPT: string;
    gainLabelEN: string;
    techPillar: string;
  };
}

interface SOPVariantsStore {
  variantsByProcess: Record<string, SOPVariant[]>;
  activeVariantByProcess: Record<string, string>;
  benchmarkEnabledByProcess: Record<string, boolean>;
  getVariantsForProcess: (processId: string, processName?: string, defaultBU?: string) => SOPVariant[];
  getActiveVariant: (processId: string, processName?: string, defaultBU?: string) => SOPVariant;
  setActiveVariant: (processId: string, variantId: string) => void;
  updateVariantSOP: (processId: string, variantId: string, sopData: SOPData) => void;
  addVariantsFromUpload: (
    processId: string,
    processName: string,
    processArea: string,
    inputs: VariantUploadInput[],
    replaceExisting?: boolean
  ) => SOPVariant[];
  deleteVariant: (processId: string, variantId: string) => void;
  setBenchmarkEnabled: (processId: string, enabled: boolean) => void;
  isBenchmarkEnabled: (processId: string) => boolean;
  seedComparisonDemoVariants: (
    processId: string,
    processName?: string,
    processArea?: string,
    defaultBU?: string
  ) => void;
}

// Helper to clone and customize SOPData per variant slot so each variant has genuine step/system/rule differences
function buildVariantSOPData(
  baseSop: SOPData,
  variantIndex: number,
  variantName: string,
  businessUnit: string | undefined,
  processName?: string,
  processArea?: string
): { sopData: SOPData; metrics: SOPVariantMetrics } {
  const titleBase = processName || baseSop.title || "Procedimento Operacional";
  const areaBase = processArea || baseSop.area || "Operações";
  const buSuffix = businessUnit ? ` — ${businessUnit}` : ` — ${variantName}`;

  const clonedSteps: SOPStep[] = JSON.parse(JSON.stringify(baseSop.steps || []));

  const isCadastro =
    baseSop.id === "proc-cadastro-conta-bancaria" ||
    titleBase.toLowerCase().includes("cadastro de conta banc") ||
    titleBase.toLowerCase().includes("conta banc");

  if (isCadastro) {
    const isMexico = variantName.toLowerCase().includes("mex") || variantName.toLowerCase().includes("m\u00e9x") || businessUnit?.toLowerCase().includes("mex") || variantIndex === 1;
    const isArgentina = variantName.toLowerCase().includes("arg") || businessUnit?.toLowerCase().includes("arg") || variantIndex === 2;
    const isBrasil = !isMexico && !isArgentina;

    if (isBrasil) {
      return {
        sopData: {
          ...baseSop,
          id: `${baseSop.id || "proc-cadastro-conta-bancaria"}-var-brasil`,
          title: "Cadastro de conta banc\u00e1ria",
          code: "FIN \u00b7 BR",
          area: "FIN \u00b7 Brasil",
          objective: baseSop.objective || "Cadastrar a institui\u00e7\u00e3o financeira como Banco da Empresa (House Bank), definir a conta corrente espec\u00edfica com seus dados de ag\u00eancia e moeda (Account ID) e vincul\u00e1-la a uma conta do raz\u00e3o cont\u00e1bil (G/L Account).",
          metadata: {
            ...baseSop.metadata,
            objective: "Cadastrar a institui\u00e7\u00e3o financeira como Banco da Empresa (House Bank) e v\u00ednculo com G/L Account para a entidade Brasil.",
            sla: "2 dias",
            frequency: "Sob demanda",
            estimatedTime: "5 a 10 minutos",
            raci: {
              responsible: "Equipe de Cadastro Brasil (Operador SAP)",
              approver: "Master Data Brasil",
              consulted: "Master Data",
              informed: "Master Data",
            },
            systems: ["SAP S/4HANA (Manage Banks)", "E-mail", "Google"],
          },
          steps: JSON.parse(JSON.stringify(baseSop.steps || [])),
        },
        metrics: {
          avgTimeMinutes: 8,
          avgTimeLabel: "8 min",
          automationRate: 35,
          handoffsCount: 2,
          soxComplianceScore: 85,
          reworkRisk: "Baixo",
        },
      };
    }

    if (isMexico) {
      const mxSteps = JSON.parse(JSON.stringify(baseSop.steps || [])).map((s) => {
        if (s.id === "1") {
          return {
            ...s,
            title: "Receber e conferir a solicita\u00e7\u00e3o de cadastro de banco (M\u00e9xico) enviada pela \u00e1rea de Master Data",
            substeps: s.substeps ? s.substeps.map((sub) => {
              if (sub.id === "1.2.2") {
                return { ...sub, description: "Conferir se o e-mail cont\u00e9m banco, c\u00f3digo do banco (Banxico), chave CLABE (18 d\u00edgitos) e RFC da institui\u00e7\u00e3o financeira no M\u00e9xico" };
              }
              return sub;
            }) : undefined,
          };
        }
        if (s.id === "3") {
          return {
            ...s,
            substeps: s.substeps ? s.substeps.map((sub) => {
              if (sub.id === "3.2.2") {
                return { ...sub, description: "Abrir o campo Bank Country em 'mais informa\u00e7\u00f5es' e selecionar o pa\u00eds M\u00e9xico" };
              }
              if (sub.id === "3.2.3") {
                return { ...sub, description: "Informar o c\u00f3digo do pa\u00eds (MX), dar dois cliques no campo e confirmar preenchimento autom\u00e1tico" };
              }
              return sub;
            }) : undefined,
          };
        }
        if (s.id === "5") {
          return {
            ...s,
            title: "Preencher os dados de identifica\u00e7\u00e3o do banco no M\u00e9xico (pa\u00eds MX, chave CLABE, nome e ag\u00eancia/sucursal)",
            substeps: s.substeps ? s.substeps.map((sub) => {
              if (sub.id === "5.1.2") {
                return { ...sub, description: "Selecionar 'M\u00e9xico' como pa\u00eds do banco na transa\u00e7\u00e3o Manage Banks" };
              }
              if (sub.id === "5.2.3") {
                return { ...sub, description: "Conferir a composi\u00e7\u00e3o do Bank Key: c\u00f3digo do banco no SPEI/Banxico (ex.: 012 para BBVA M\u00e9xico, 002 Banamex) e chave CLABE" };
              }
              if (sub.id === "5.3.2") {
                return { ...sub, description: "Fazer a pesquisa oficial no portal Banxico/Google e localizar a raz\u00e3o social (ex.: 'BBVA M\u00e9xico S.A.')" };
              }
              return sub;
            }) : undefined,
          };
        }
        return s;
      });

      return {
        sopData: {
          ...baseSop,
          id: `${baseSop.id || "proc-cadastro-conta-bancaria"}-var-mexico`,
          title: "Cadastro de conta banc\u00e1ria (M\u00e9xico)",
          code: "FIN \u00b7 MX",
          area: "FIN \u00b7 M\u00e9xico",
          objective: "Cadastrar a institui\u00e7\u00e3o financeira como Banco da Empresa (House Bank) para a opera\u00e7\u00e3o M\u00e9xico no SAP, validando a chave CLABE (18 d\u00edgitos) e RFC.",
          metadata: {
            ...baseSop.metadata,
            objective: "Cadastrar a institui\u00e7\u00e3o financeira como Banco da Empresa (House Bank) para a opera\u00e7\u00e3o M\u00e9xico no SAP, validando a chave CLABE (18 d\u00edgitos) e RFC.",
            sla: "2 dias",
            frequency: "Sob demanda",
            estimatedTime: "8 a 12 min",
            raci: {
              responsible: "Equipe de Cadastro M\u00e9xico (Operador SAP)",
              approver: "Master Data M\u00e9xico",
              consulted: "Master Data",
              informed: "Master Data",
            },
            systems: ["SAP S/4HANA (Manage Banks)", "Portal Banxico", "E-mail"],
          },
          steps: mxSteps,
        },
        metrics: {
          avgTimeMinutes: 12,
          avgTimeLabel: "12 min",
          automationRate: 28,
          handoffsCount: 2,
          soxComplianceScore: 82,
          reworkRisk: "Baixo",
        },
      };
    }

    if (isArgentina) {
      const arSteps = JSON.parse(JSON.stringify(baseSop.steps || [])).map((s) => {
        if (s.id === "1") {
          return {
            ...s,
            title: "Receber e conferir a solicita\u00e7\u00e3o de cadastro de banco (Argentina) enviada pela \u00e1rea de Master Data",
            substeps: s.substeps ? s.substeps.map((sub) => {
              if (sub.id === "1.2.2") {
                return { ...sub, description: "Conferir se o e-mail cont\u00e9m banco, c\u00f3digo BCRA, Clave Bancaria Uniforme (CBU de 22 d\u00edgitos) e CUIT da entidade banc\u00e1ria na Argentina" };
              }
              return sub;
            }) : undefined,
          };
        }
        if (s.id === "3") {
          return {
            ...s,
            substeps: s.substeps ? s.substeps.map((sub) => {
              if (sub.id === "3.2.2") {
                return { ...sub, description: "Abrir o campo Bank Country em 'mais informa\u00e7\u00f5es' e selecionar o pa\u00eds Argentina" };
              }
              if (sub.id === "3.2.3") {
                return { ...sub, description: "Informar o c\u00f3digo do pa\u00eds (AR), dar dois cliques no campo e confirmar preenchimento autom\u00e1tico" };
              }
              return sub;
            }) : undefined,
          };
        }
        if (s.id === "5") {
          return {
            ...s,
            title: "Preencher os dados de identifica\u00e7\u00e3o do banco na Argentina (pa\u00eds AR, CBU, nome e sucursal)",
            substeps: s.substeps ? s.substeps.map((sub) => {
              if (sub.id === "5.1.2") {
                return { ...sub, description: "Selecionar 'Argentina' como pa\u00eds do banco na transa\u00e7\u00e3o Manage Banks" };
              }
              if (sub.id === "5.2.3") {
                return { ...sub, description: "Conferir a composi\u00e7\u00e3o do Bank Key: c\u00f3digo do banco no BCRA (ex.: 007 para Banco Galicia, 011 Banco Naci\u00f3n) e valida\u00e7\u00e3o da CBU (22 d\u00edgitos)" };
              }
              if (sub.id === "5.3.2") {
                return { ...sub, description: "Fazer a pesquisa no portal BCRA/Google e localizar a raz\u00e3o social oficial (ex.: 'Banco de Galicia y Buenos Aires S.A.U.')" };
              }
              return sub;
            }) : undefined,
          };
        }
        return s;
      });

      return {
        sopData: {
          ...baseSop,
          id: `${baseSop.id || "proc-cadastro-conta-bancaria"}-var-argentina`,
          title: "Cadastro de conta banc\u00e1ria (Argentina)",
          code: "FIN \u00b7 AR",
          area: "FIN \u00b7 Argentina",
          objective: "Cadastrar a institui\u00e7\u00e3o financeira como Banco da Empresa (House Bank) para a opera\u00e7\u00e3o Argentina no SAP, validando a Clave Bancaria Uniforme (CBU) e CUIT fiscal.",
          metadata: {
            ...baseSop.metadata,
            objective: "Cadastrar a institui\u00e7\u00e3o financeira como Banco da Empresa (House Bank) para a opera\u00e7\u00e3o Argentina no SAP, validando a Clave Bancaria Uniforme (CBU) e CUIT fiscal.",
            sla: "3 dias",
            frequency: "Sob demanda",
            estimatedTime: "10 a 15 min",
            raci: {
              responsible: "Equipe de Cadastro Argentina (Operador SAP)",
              approver: "Master Data / Tesouraria Argentina",
              consulted: "Master Data",
              informed: "Master Data",
            },
            systems: ["SAP S/4HANA (Manage Banks)", "Portal BCRA / AFIP", "E-mail"],
          },
          steps: arSteps,
        },
        metrics: {
          avgTimeMinutes: 15,
          avgTimeLabel: "15 min",
          automationRate: 22,
          handoffsCount: 3,
          soxComplianceScore: 78,
          reworkRisk: "M\u00e9dio",
        },
      };
    }
  }


  if (variantIndex === 0) {
    // Variant 1: Matriz / Padrão (SAP / ERP + Fluxo Estruturado)
    const steps = clonedSteps.map((s, idx) => ({
      ...s,
      executor: s.executor || "Analista Pleno (CSC)",
      system: s.system || (idx === 0 ? "ServiceNow / Portal" : idx === 1 ? "SAP S/4HANA" : "SAP Fiori"),
      automationClass: s.automationClass || (idx % 2 === 0 ? "MS" : "SA"),
      executionTime: s.executionTime || (idx === 0 ? "4 min" : idx === 1 ? "6 min" : "5 min"),
    }));

    return {
      sopData: {
        ...baseSop,
        id: `${baseSop.id || "sop"}-var-1`,
        title: `${titleBase} (${variantName})`,
        code: `${baseSop.code || "POP-01"} · V1`,
        area: businessUnit ? `${areaBase} · ${businessUnit}` : areaBase,
        objective:
          baseSop.objective ||
          `Executar o procedimento de ${titleBase} seguindo as diretrizes operacionais da unidade ${businessUnit || variantName}.`,
        metadata: {
          ...baseSop.metadata,
          objective:
            baseSop.metadata?.objective ||
            baseSop.objective ||
            `Executar o procedimento de ${titleBase} na unidade ${businessUnit || variantName}.`,
          sla: baseSop.metadata?.sla || "4 horas úteis",
          frequency: baseSop.metadata?.frequency || "Diário / Sob demanda",
          estimatedTime: "18 minutos",
          volumetry: "140 execuções/mês",
          classification: baseSop.metadata?.classification || "core",
          soxControls:
            "Aprovação sistêmica via workflow para valores acima de R$ 5.000,00. Log de auditoria anexado automaticamente no ERP.",
          raci: {
            responsible: baseSop.metadata?.raci?.responsible || `Analista Operacional (${businessUnit || variantName})`,
            approver: baseSop.metadata?.raci?.approver || "Coordenador da Unidade",
          },
          systems: ["SAP S/4HANA", "ServiceNow", "Portal Corporativo"],
        },
        steps,
      },
      metrics: {
        avgTimeMinutes: 18,
        avgTimeLabel: "18 min",
        automationRate: 52,
        handoffsCount: 2,
        soxComplianceScore: 88,
        reworkRisk: "Baixo",
      },
    };
  }

  if (variantIndex === 1) {
    // Variant 2: Diverges in Systems (Excel shadow IT + Legacy ERP), Business Rules (100% double approval), and Extra Step
    const steps: SOPStep[] = clonedSteps.map((s, idx) => {
      if (idx === 0) {
        return {
          ...s,
          title: `${s.title} (Recebimento via E-mail & Planilha)`,
          executor: `Analista Júnior (${businessUnit || variantName})`,
          system: "Outlook + Planilha Controle Excel",
          automationClass: "ME",
          executionTime: "9 min",
          substeps: [
            ...(s.substeps || []),
            {
              id: `${s.id}.99`,
              description: `[Específico ${variantName}] Copiar manualmente os dados recebidos por e-mail para a Planilha de Controle Local (.xlsx) e validar CPF/CNPJ ou código manualmente.`,
              isConditional: true,
              conditionalText: `Regra ${variantName}: 100% das solicitações exigem validação prévia em planilha antes de abrir o ERP.`,
            },
          ],
        };
      }
      if (idx === 1) {
        return {
          ...s,
          title: `${s.title} (Cálculo Manual de Rateio/Impostos)`,
          executor: `Analista Financeiro (${businessUnit || variantName})`,
          system: "Calculadora Excel (Macro Local) + ERP Legado",
          automationClass: "ME",
          executionTime: "14 min",
          hasWaitTime: true,
          waitTime: "2h (aguardando validação)",
          hasSystemCustomization: true,
          customizationSystem: "Planilha Excel c/ Macro VBA",
          customizationDescription: `Cálculo realizado fora do sistema oficial na operação ${variantName}, utilizando tabela de alíquotas/margem mantida localmente.`,
          customizationOwner: `Supervisão ${businessUnit || variantName}`,
          customizationStatus: "identified",
          substeps: [
            {
              id: `${s.id}.1`,
              description: `Abrir a planilha ' Calc_Operacional_${(businessUnit || variantName).replace(/\s+/g, "_")}.xlsm' e aplicar a fórmula de rateio por centro de custo local.`,
            },
            ...(s.substeps?.slice(1) || []),
          ],
        };
      }
      return {
        ...s,
        executor: `Supervisor (${businessUnit || variantName})`,
        system: "ERP Local + E-mail",
        automationClass: "MS",
        executionTime: "10 min",
      };
    });

    // Add an extra manual step specific to Variant 2
    steps.push({
      id: String(steps.length + 1),
      title: `Dupla Conferência e Aprovação por E-mail (${variantName})`,
      executor: `Gerente Operacional (${businessUnit || variantName})`,
      system: "Microsoft Outlook",
      automationClass: "ME",
      executionTime: "9 min",
      hasWaitTime: true,
      waitTime: "4h",
      substeps: [
        {
          id: `${steps.length + 1}.1`,
          description: `Enviar print da tela e memória de cálculo em PDF por e-mail para o Gerente da unidade ${businessUnit || variantName} aprovar (independente do valor de alçada).`,
          isConditional: true,
          conditionalText: `Divergência de Alçada: Enquanto a Matriz aprova apenas > R$ 5k no sistema, ${variantName} exige aprovação por e-mail para qualquer valor.`,
        },
        {
          id: `${steps.length + 1}.2`,
          description: "Salvar o e-mail de 'De Acordo' em pasta de rede compartilhada para fins de auditoria interna.",
        },
      ],
    });

    return {
      sopData: {
        ...baseSop,
        id: `${baseSop.id || "sop"}-var-2`,
        title: `${titleBase} (${variantName})`,
        code: `${baseSop.code || "POP-01"} · V2`,
        area: businessUnit ? `${areaBase} · ${businessUnit}` : areaBase,
        objective: `Executar o processo de ${titleBase} adaptado às regras locais e controles manuais da operação ${businessUnit || variantName}.`,
        metadata: {
          ...baseSop.metadata,
          objective: `Executar o processo de ${titleBase} adaptado às regras locais da operação ${businessUnit || variantName}.`,
          sla: "24 horas úteis (impactado por aprovação via e-mail)",
          frequency: "Diário",
          estimatedTime: "42 minutos",
          volumetry: "95 execuções/mês",
          classification: baseSop.metadata?.classification || "core",
          soxControls:
            "Evidência de aprovação coletada manualmente por e-mail e arquivada em diretório de rede (sem trava sistêmica preventiva).",
          raci: {
            responsible: `Analista Júnior / Pleno (${businessUnit || variantName})`,
            approver: `Gerente Operacional (${businessUnit || variantName}) — 100% dos casos`,
          },
          systems: ["ERP Legado", "Planilha Excel (Macro VBA)", "Microsoft Outlook", "Diretório de Rede"],
        },
        steps,
      },
      metrics: {
        avgTimeMinutes: 42,
        avgTimeLabel: "42 min",
        automationRate: 18,
        handoffsCount: 4,
        soxComplianceScore: 54,
        reworkRisk: "Alto",
      },
    };
  }

  // Variant 3+: Agile / Semi-Automated execution with different calculation criteria & fast-track rule
  const steps: SOPStep[] = clonedSteps.slice(0, Math.max(2, clonedSteps.length)).map((s, idx) => {
    if (idx === 0) {
      return {
        ...s,
        title: `${s.title} (Captura via Formulário Padronizado)`,
        executor: `Especialista (${businessUnit || variantName})`,
        system: "Portal Web Integrado + API",
        automationClass: "SA",
        executionTime: "3 min",
        substeps: [
          {
            id: `${s.id}.1`,
            description: `Receber requisição estruturada via Portal Web em ${variantName} com campos obrigatórios pré-validados automaticamente.`,
          },
          ...(s.substeps?.slice(1) || []),
        ],
      };
    }
    if (idx === 1) {
      return {
        ...s,
        title: `${s.title} (Motor de Regra Parametrizado)`,
        executor: `Especialista (${businessUnit || variantName})`,
        system: "SAP S/4HANA + Script Automático",
        automationClass: "AU",
        executionTime: "4 min",
        substeps: [
          {
            id: `${s.id}.1`,
            description: `O cálculo é executado via tabela parametrizada por volume fixo (sem rateio proporcional manual), aplicando aprovação automática até R$ 15.000,00.`,
            isConditional: true,
            conditionalText: `Regra ${variantName}: Fast-track automático para lançamentos até R$ 15k, porém sem conciliação cruzada de impostos retidos.`,
          },
        ],
      };
    }
    return {
      ...s,
      executor: `Especialista (${businessUnit || variantName})`,
      system: "SAP Fiori",
      automationClass: "SA",
      executionTime: "5 min",
    };
  });

  return {
    sopData: {
      ...baseSop,
      id: `${baseSop.id || "sop"}-var-${variantIndex + 1}`,
      title: `${titleBase} (${variantName})`,
      code: `${baseSop.code || "POP-01"} · V${variantIndex + 1}`,
      area: businessUnit ? `${areaBase} · ${businessUnit}` : areaBase,
      objective: `Executar o procedimento de ${titleBase} segundo o fluxo fast-track praticado em ${businessUnit || variantName}.`,
      metadata: {
        ...baseSop.metadata,
        objective: `Executar o procedimento de ${titleBase} segundo o fluxo fast-track praticado em ${businessUnit || variantName}.`,
        sla: "2 horas úteis",
        frequency: "Contínuo / Sob demanda",
        estimatedTime: "12 minutos",
        volumetry: "210 execuções/mês",
        classification: baseSop.metadata?.classification || "core",
        soxControls:
          "Trava automática de alçada até R$ 15.000,00 no portal, porém ausente etapa formal de revisão cruzada de alíquotas.",
        raci: {
          responsible: `Especialista de Operações (${businessUnit || variantName})`,
          approver: "Aprovação Automática (Sistema) / Diretor (> R$ 15k)",
        },
        systems: ["Portal Web Integrado", "SAP S/4HANA", "Power Automate"],
      },
      steps,
    },
    metrics: {
      avgTimeMinutes: 12,
      avgTimeLabel: "12 min",
      automationRate: 74,
      handoffsCount: 1,
      soxComplianceScore: 72,
      reworkRisk: "Médio",
    },
  };
}

function buildDefaultSeededVariants(
  processId: string,
  processName?: string,
  defaultBU?: string
): SOPVariant[] {
  const isSpan = processName?.toLowerCase().includes("span") && processName?.toLowerCase().includes("layer");
  const isCadastro =
    processId === "proc-cadastro-conta-bancaria" ||
    processName?.toLowerCase().includes("cadastro de conta banc") ||
    processName?.toLowerCase().includes("conta banc");
  const lookupId = isSpan ? "span-layer" : (isCadastro ? "proc-cadastro-conta-bancaria" : processId);
  const baseSop = sopDataMap[lookupId] || sopDemoDefault;

  if (isCadastro) {
    const vBrasil = buildVariantSOPData(baseSop, 0, "Brasil", "Brasil", processName, baseSop.area);
    const vMexico = buildVariantSOPData(baseSop, 1, "M\u00e9xico", "M\u00e9xico", processName, baseSop.area);
    const vArgentina = buildVariantSOPData(baseSop, 2, "Argentina", "Argentina", processName, baseSop.area);

    return [
      {
        id: `${processId}-var-brasil`,
        processId,
        name: "Brasil",
        businessUnit: "Brasil",
        divergenceReason: "business_unit",
        divergenceDetail: "Opera\u00e7\u00e3o Brasil \u00b7 C\u00f3digo BACEN & Ag\u00eancia",
        sourceType: "document",
        sourceFileName: "POP_Cadastro_Conta_Bancaria_Brasil.docx",
        createdAt: "20 Out, 2026",
        status: "Published",
        version: "1.0",
        isDefault: true,
        metrics: vBrasil.metrics,
        sopData: vBrasil.sopData,
      },
      {
        id: `${processId}-var-mexico`,
        processId,
        name: "M\u00e9xico",
        businessUnit: "M\u00e9xico",
        divergenceReason: "business_unit",
        divergenceDetail: "Opera\u00e7\u00e3o M\u00e9xico \u00b7 Chave CLABE (18 d\u00edgitos) & RFC",
        sourceType: "document",
        sourceFileName: "POP_Cadastro_Conta_Bancaria_Mexico.docx",
        createdAt: "20 Out, 2026",
        status: "Draft",
        version: "1.0",
        metrics: vMexico.metrics,
        sopData: vMexico.sopData,
      },
      {
        id: `${processId}-var-argentina`,
        processId,
        name: "Argentina",
        businessUnit: "Argentina",
        divergenceReason: "business_unit",
        divergenceDetail: "Opera\u00e7\u00e3o Argentina \u00b7 Chave CBU (22 d\u00edgitos) & CUIT",
        sourceType: "document",
        sourceFileName: "POP_Cadastro_Conta_Bancaria_Argentina.docx",
        createdAt: "20 Out, 2026",
        status: "Draft",
        version: "1.0",
        metrics: vArgentina.metrics,
        sopData: vArgentina.sopData,
      },
    ];
  }

  const bu1 = defaultBU || "SOMOS/Saber";
  const bu2 = bu1 === "Red Ballon" ? "SOMOS/Saber" : "Red Ballon";
  const bu3 = bu1 === "PROFS" ? "Red Ballon" : "PROFS";

  const v1 = buildVariantSOPData(baseSop, 0, `${bu1} (Padrão)`, bu1, processName, baseSop.area);
  const v2 = buildVariantSOPData(baseSop, 1, bu2, bu2, processName, baseSop.area);
  const v3 = buildVariantSOPData(baseSop, 2, bu3, bu3, processName, baseSop.area);

  return [
    {
      id: `${processId}-var-1`,
      processId,
      name: `${bu1} (Padrão)`,
      businessUnit: bu1,
      divergenceReason: "business_unit",
      divergenceDetail: "Unidade de Negócio Matriz / Corporativo",
      sourceType: "video",
      sourceFileName: `Gravacao_${bu1.replace(/[^a-zA-Z0-9]/g, "_")}.mp4`,
      transcriptionFileName: `Transcricao_${bu1.replace(/[^a-zA-Z0-9]/g, "_")}.txt`,
      createdAt: "15 Out, 2026",
      status: "Published",
      version: "1.0",
      isDefault: true,
      metrics: v1.metrics,
      sopData: v1.sopData,
    },
    {
      id: `${processId}-var-2`,
      processId,
      name: bu2,
      businessUnit: bu2,
      divergenceReason: "business_unit",
      divergenceDetail: "Unidade de Negócio com ERP Legado + Planilha",
      sourceType: "video",
      sourceFileName: `Gravacao_${bu2.replace(/[^a-zA-Z0-9]/g, "_")}.mp4`,
      transcriptionFileName: `Transcricao_${bu2.replace(/[^a-zA-Z0-9]/g, "_")}.txt`,
      createdAt: "16 Out, 2026",
      status: "Draft",
      version: "1.0",
      metrics: v2.metrics,
      sopData: v2.sopData,
    },
    {
      id: `${processId}-var-3`,
      processId,
      name: bu3,
      businessUnit: bu3,
      divergenceReason: "business_unit",
      divergenceDetail: "Unidade de Negócio com Fluxo Fast-Track",
      sourceType: "video",
      sourceFileName: `Gravacao_${bu3.replace(/[^a-zA-Z0-9]/g, "_")}.mp4`,
      transcriptionFileName: `Transcricao_${bu3.replace(/[^a-zA-Z0-9]/g, "_")}.txt`,
      createdAt: "17 Out, 2026",
      status: "Draft",
      version: "1.0",
      metrics: v3.metrics,
      sopData: v3.sopData,
    },
  ];
}

export const DIVERGENCE_POINTS: DivergencePoint[] = [
  {
    id: "div-sys-1",
    category: "systems",
    titlePT: "Ecossistema de Sistemas e Uso de Planilhas Paralelas (Shadow IT)",
    titleEN: "System Ecosystem & Shadow IT Spreadsheets",
    severity: "high",
    stepNumber: 1,
    stepTitlePT: "Recepção, Triagem e Registro Inicial",
    stepTitleEN: "Reception, Triage & Initial Registration",
    impactSummaryPT:
      "Enquanto uma execução opera de ponta a ponta no ERP/Portal integrado, outra depende de digitação manual em planilha Excel com macros locais (.xlsm), gerando risco de quebra de fórmula e retrabalho.",
    impactSummaryEN:
      "While one execution operates end-to-end in the integrated ERP/Portal, another relies on manual entry in local macro spreadsheets (.xlsm), creating formula breakage risk and rework.",
    slotBehaviors: [
      {
        summaryPT: "Utiliza ServiceNow + SAP S/4HANA com integração nativa de cadastro, sem planilhas intermediárias.",
        summaryEN: "Uses ServiceNow + SAP S/4HANA with native master data integration, no intermediate spreadsheets.",
        highlightTagPT: "ERP Integrado",
        highlightTagEN: "Integrated ERP",
        status: "standard",
      },
      {
        summaryPT: "Recebe demanda via Outlook e redigita manualmente em Planilha Excel (Macro VBA) antes de lançar no ERP Legado.",
        summaryEN: "Receives request via Outlook and manually retypes into Excel Spreadsheet (VBA Macro) before Legacy ERP entry.",
        highlightTagPT: "Shadow IT (Excel + E-mail)",
        highlightTagEN: "Shadow IT (Excel + Email)",
        status: "critical",
      },
      {
        summaryPT: "Captura estruturada via Portal Web com validação automática de campos obrigatórios via API + Power Automate.",
        summaryEN: "Structured capture via Web Portal with automatic mandatory field validation via API + Power Automate.",
        highlightTagPT: "Portal Web + API",
        highlightTagEN: "Web Portal + API",
        status: "best_internal",
      },
    ],
    benchmark: {
      summaryPT: "Intake 100% digital via Portal Único / API com validação em tempo real no ERP central e eliminação total de planilhas locais.",
      summaryEN: "100% digital intake via Unified Portal / API with real-time validation in central ERP and zero local spreadsheets.",
      recommendationPT: "Adotar o intake via Portal Web da 3ª variante integrado ao workflow SAP S/4HANA da 1ª variante, descontinuando a planilha VBA.",
      recommendationEN: "Adopt the Web Portal intake from Variant 3 integrated into Variant 1's SAP S/4HANA workflow, retiring the VBA spreadsheet.",
      gainLabelPT: "-14 min/execução e 0% erro de digitação",
      gainLabelEN: "-14 min/execution & 0% typing error",
      techPillar: "Intake Unificado & Zero Shadow IT",
    },
  },
  {
    id: "div-rule-1",
    category: "business_rules",
    titlePT: "Política de Alçadas de Aprovação e Limites de Exceção",
    titleEN: "Approval Threshold Policy & Exception Limits",
    severity: "high",
    stepNumber: 3,
    stepTitlePT: "Validação de Alçada e Aprovação Gerencial",
    stepTitleEN: "Threshold Validation & Managerial Approval",
    impactSummaryPT:
      "Divergência crítica nos critérios de aprovação: uma execução exige aprovação manual para 100% dos casos (gargalo de +18h no SLA), enquanto outras aplicam cortes de R$ 5k e R$ 15k.",
    impactSummaryEN:
      "Critical divergence in approval criteria: one execution requires manual approval for 100% of cases (+18h SLA bottleneck), while others apply R$ 5k and R$ 15k thresholds.",
    slotBehaviors: [
      {
        summaryPT: "Regra escalonada no sistema: aprovação automática até R$ 5.000,00; acima disso, exige aprovação do Coordenador via workflow.",
        summaryEN: "Tiered system rule: auto-approval up to R$ 5,000; above requires Coordinator workflow approval.",
        highlightTagPT: "Alçada > R$ 5 mil",
        highlightTagEN: "Threshold > R$ 5k",
        status: "standard",
      },
      {
        summaryPT: "100% das execuções exigem aprovação formal do Gerente por e-mail (mesmo lançamentos de baixo valor e recorrentes).",
        summaryEN: "100% of executions require formal Manager approval via email (even low-value recurring items).",
        highlightTagPT: "100% Aprovação Manual",
        highlightTagEN: "100% Manual Approval",
        status: "critical",
      },
      {
        summaryPT: "Fast-track automático até R$ 15.000,00 direto no sistema; alçada de Diretoria apenas para exceções acima do teto.",
        summaryEN: "Automatic fast-track up to R$ 15,000 in system; Director approval only for exceptions above cap.",
        highlightTagPT: "Fast-Track < R$ 15 mil",
        highlightTagEN: "Fast-Track < R$ 15k",
        status: "warning",
      },
    ],
    benchmark: {
      summaryPT: "Aprovação baseada em Risco e Tolerância (Touchless até R$ 10k quando dentro do orçamento/contrato + alerta apenas para desvios > 5%).",
      summaryEN: "Risk & Tolerance-based approval (Touchless up to R$ 10k when within budget/contract + human review only for >5% variance).",
      recommendationPT: "Unificar a régua de alçada corporativa em R$ 10.000 com validação automática contra pedido/orçamento no ERP.",
      recommendationEN: "Unify corporate approval threshold at R$ 10,000 with automated PO/budget matching in ERP.",
      gainLabelPT: "Redução de 78% no tempo de espera (Wait Time)",
      gainLabelEN: "78% reduction in approval Wait Time",
      techPillar: "Exception-Based Workflow (Touchless)",
    },
  },
  {
    id: "div-calc-1",
    category: "calculations",
    titlePT: "Fórmula de Cálculo, Critério de Rateio e Impostos",
    titleEN: "Calculation Formula, Allocation Criteria & Taxes",
    severity: "high",
    stepNumber: 2,
    stepTitlePT: "Apuração de Valores, Rateio e Parametrização Contábil",
    stepTitleEN: "Value Calculation, Cost Allocation & Accounting Setup",
    impactSummaryPT:
      "As unidades calculam o mesmo indicador/valor com lógicas distintas (rateio proporcional automático vs. cálculo manual por headcount em planilha vs. tabela fixa sem retenção), gerando distorções contábeis na consolidação.",
    impactSummaryEN:
      "Units calculate the same metric using different logic (automated proportional allocation vs. manual headcount Excel formula vs. flat table), causing consolidation discrepancies.",
    slotBehaviors: [
      {
        summaryPT: "Cálculo parametrizado no SAP utilizando chave de rateio contábil padrão e tabela fiscal centralizada.",
        summaryEN: "Parameterized calculation in SAP using standard accounting allocation key and centralized tax table.",
        highlightTagPT: "Cálculo SAP Padrão",
        highlightTagEN: "Standard SAP Calc",
        status: "best_internal",
      },
      {
        summaryPT: "Fórmula PROCV + Macro manual em planilha local baseada em headcount mensal digitado pelo analista.",
        summaryEN: "VLOOKUP + manual Macro in local spreadsheet based on monthly headcount typed by analyst.",
        highlightTagPT: "Fórmula Manual (PROCV)",
        highlightTagEN: "Manual Formula (VLOOKUP)",
        status: "critical",
      },
      {
        summaryPT: "Aplica taxa única simplificada por faixa de volume, sem deduzir impostos retidos na etapa preliminar.",
        summaryEN: "Applies simplified flat rate by volume tier, without deducting withholding taxes in preliminary step.",
        highlightTagPT: "Taxa Fixa Simplificada",
        highlightTagEN: "Simplified Flat Rate",
        status: "warning",
      },
    ],
    benchmark: {
      summaryPT: "Motor de regras centralizado no ERP (BRF+ / Tax Engine) com atualização automática de alíquotas e chaves de rateio dinâmicas.",
      summaryEN: "Centralized ERP rule engine (BRF+ / Tax Engine) with automatic tax rate updates and dynamic allocation keys.",
      recommendationPT: "Padronizar o motor de cálculo contábil da 1ª variante para todas as unidades, parametrizando exceções regionais direto no SAP.",
      recommendationEN: "Standardize Variant 1's SAP calculation engine across all units, parameterizing regional exceptions directly in SAP.",
      gainLabelPT: "100% integridade contábil entre BUs",
      gainLabelEN: "100% accounting integrity across BUs",
      techPillar: "Centralized Rule & Tax Engine",
    },
  },
  {
    id: "div-seq-1",
    category: "sequence",
    titlePT: "Sequenciamento e Etapas Extras de Conferência Manual",
    titleEN: "Sequencing & Extra Manual Verification Steps",
    severity: "medium",
    stepNumber: 4,
    stepTitlePT: "Conferência Cruzada e Efetivação do Lançamento",
    stepTitleEN: "Cross-Check & Posting Execution",
    impactSummaryPT:
      "Existência de etapas não padronizadas: a 2ª variante executa 2 etapas extras de conferência manual e envio de prints que aumentam o tempo total de 18 min para 42 min (+133%).",
    impactSummaryEN:
      "Non-standardized steps: Variant 2 performs 2 extra manual check and screenshot-email steps that increase lead time from 18 min to 42 min (+133%).",
    slotBehaviors: [
      {
        summaryPT: "Fluxo linear em 3 etapas com validação preventiva no preenchimento e contabilização direta.",
        summaryEN: "Linear 3-step flow with preventive input validation and direct posting.",
        highlightTagPT: "Fluxo Enxuto",
        highlightTagEN: "Lean Flow",
        status: "standard",
      },
      {
        summaryPT: "Adiciona etapa extra de tiragem de prints de tela, geração de PDF e salvamento manual em pasta de rede.",
        summaryEN: "Adds extra step for taking screenshots, generating PDF, and manually saving to network folder.",
        highlightTagPT: "+2 Etapas de Retrabalho",
        highlightTagEN: "+2 Rework Steps",
        status: "critical",
      },
      {
        summaryPT: "Fluxo comprimido em etapas rápidas, porém pula a etapa de conciliação pós-lançamento.",
        summaryEN: "Compressed fast steps, but skips post-posting reconciliation check.",
        highlightTagPT: "Etapa Omitida",
        highlightTagEN: "Skipped Step",
        status: "warning",
      },
    ],
    benchmark: {
      summaryPT: "Sequência enxuta (Straight-Through Processing) com validação preventiva no input e log automático de auditoria sem necessidade de prints manuais.",
      summaryEN: "Lean sequence (Straight-Through Processing) with preventive input validation and automated audit logging without manual screenshots.",
      recommendationPT: "Eliminar a etapa de prints por e-mail da 2ª variante e incorporar o check automático pós-lançamento na 3ª variante.",
      recommendationEN: "Eliminate manual screenshot emails in Variant 2 and embed automated post-posting check into Variant 3.",
      gainLabelPT: "-35% etapas manuais",
      gainLabelEN: "-35% manual steps",
      techPillar: "Straight-Through Processing (STP)",
    },
  },
  {
    id: "div-raci-1",
    category: "raci",
    titlePT: "Segregação de Funções (RACI) e Nível Sênior Alocado",
    titleEN: "Segregation of Duties (RACI) & Seniority Allocation",
    severity: "medium",
    stepNumber: 1,
    stepTitlePT: "Papéis de Execução e Handoffs entre Áreas",
    stepTitleEN: "Execution Roles & Cross-Area Handoffs",
    impactSummaryPT:
      "Desbalanceamento de alocação: atividades transacionais estão sendo executadas por Especialistas/Supervisores em algumas frentes, enquanto outra possui 4 handoffs entre áreas.",
    impactSummaryEN:
      "Allocation imbalance: transactional tasks are executed by Specialists/Supervisores in some units, while another has 4 cross-team handoffs.",
    slotBehaviors: [
      {
        summaryPT: "Executado por Analista Pleno no CSC com 2 handoffs claros (Operação → Aprovador).",
        summaryEN: "Executed by Mid-level Analyst in SSC with 2 clear handoffs (Operations → Approver).",
        highlightTagPT: "2 Handoffs (CSC)",
        highlightTagEN: "2 Handoffs (SSC)",
        status: "best_internal",
      },
      {
        summaryPT: "Passa por 4 pessoas diferentes (Analista Jr → Analista Fin → Supervisor → Gerente), gerando fila de espera.",
        summaryEN: "Passes through 4 different roles (Jr Analyst → Fin Analyst → Supervisor → Manager), creating queues.",
        highlightTagPT: "4 Handoffs (Fragmentado)",
        highlightTagEN: "4 Handoffs (Fragmented)",
        status: "critical",
      },
      {
        summaryPT: "Concentrado em Especialista Sênior (custo hora elevado para atividade operacional padrão).",
        summaryEN: "Concentrated on Senior Specialist (high hourly cost for standard operational task).",
        highlightTagPT: "Sobrequalificação (Sênior)",
        highlightTagEN: "Overqualified Role",
        status: "warning",
      },
    ],
    benchmark: {
      summaryPT: "Execução assistida por automação (Bot + Analista CSC nos casos de exceção), com no máximo 1 handoff para desvios fora da política.",
      summaryEN: "Automation-assisted execution (Bot + SSC Analyst for exceptions), with max 1 handoff for out-of-policy deviations.",
      recommendationPT: "Centralizar a execução padrão em nível Pleno/CSC assistido por automação, liberando Especialistas e Gerentes de tarefas transacionais.",
      recommendationEN: "Centralize standard execution in SSC assisted by automation, freeing Specialists and Managers from transactional work.",
      gainLabelPT: "-40% custo de FTE operacional",
      gainLabelEN: "-40% operational FTE cost",
      techPillar: "Optimal RACI & SSC Centralization",
    },
  },
  {
    id: "div-comp-1",
    category: "compliance",
    titlePT: "Rastreabilidade de Auditoria e Controles SoX",
    titleEN: "Audit Traceability & SoX Controls",
    severity: "medium",
    stepNumber: 3,
    stepTitlePT: "Guarda de Evidências e Conformidade Normativa",
    stepTitleEN: "Evidence Retention & Regulatory Compliance",
    impactSummaryPT:
      "A guarda de evidências em pasta de rede/e-mail e a ausência de trava preventiva na 2ª e 3ª variantes expõem o processo a apontamentos de auditoria interna (SoX).",
    impactSummaryEN:
      "Storing evidence in network folders/email and lacking preventive system locks in Variants 2 and 3 expose the process to SoX audit findings.",
    slotBehaviors: [
      {
        summaryPT: "Trilha de auditoria imutável registrada dentro do SAP com timestamp, usuário aprovador e anexo obrigatório.",
        summaryEN: "Immutable audit trail logged inside SAP with timestamp, approving user, and mandatory attachment.",
        highlightTagPT: "SoX Compliant (88%)",
        highlightTagEN: "SoX Compliant (88%)",
        status: "best_internal",
      },
      {
        summaryPT: "Evidências em e-mail (.msg) salvas manualmente em diretório compartilhado, sujeitas a perda ou edição.",
        summaryEN: "Email (.msg) evidence saved manually in shared drive, prone to loss or retroactive editing.",
        highlightTagPT: "Risco SoX Alto (54%)",
        highlightTagEN: "High SoX Risk (54%)",
        status: "critical",
      },
      {
        summaryPT: "Log de portal registrado, mas sem bloqueio sistêmico de segregação de funções (mesmo usuário pode criar e liberar).",
        summaryEN: "Portal log recorded, but lacks Segregation of Duties lock (same user can create and release).",
        highlightTagPT: "Ressalva SoD (72%)",
        highlightTagEN: "SoD Warning (72%)",
        status: "warning",
      },
    ],
    benchmark: {
      summaryPT: "100% de rastreabilidade digital (Audit Trail) com trava preventiva de Segregação de Funções (SoD) e conciliação contínua por IA.",
      summaryEN: "100% digital Audit Trail with preventive Segregation of Duties (SoD) lock and continuous AI reconciliation.",
      recommendationPT: "Replicar a trava SoX sistêmica da 1ª variante com validação obrigatória de Segregação de Funções no ERP.",
      recommendationEN: "Replicate Variant 1's systemic SoX lock with mandatory Segregation of Duties enforcement in ERP.",
      gainLabelPT: "100% conformidade SoX / Zero ressalvas",
      gainLabelEN: "100% SoX compliance / Zero audit gaps",
      techPillar: "Automated SoX & SoD Governance",
    },
  },
];

export const useSopVariantsStore = create<SOPVariantsStore>()(
  persist(
    (set, get) => ({
      variantsByProcess: {},
      activeVariantByProcess: {},
      benchmarkEnabledByProcess: {},

      getVariantsForProcess: (processId, processName, defaultBU) => {
        const existing = get().variantsByProcess[processId];
        if (existing && existing.length > 0) {
          return existing;
        }
        return buildDefaultSeededVariants(processId, processName, defaultBU);
      },

      getActiveVariant: (processId, processName, defaultBU) => {
        const variants = get().getVariantsForProcess(processId, processName, defaultBU);
        const activeId = get().activeVariantByProcess[processId];
        return variants.find((v) => v.id === activeId) || variants[0];
      },

      setActiveVariant: (processId, variantId) =>
        set((state) => ({
          activeVariantByProcess: {
            ...state.activeVariantByProcess,
            [processId]: variantId,
          },
        })),

      updateVariantSOP: (processId, variantId, sopData) =>
        set((state) => {
          const currentList =
            state.variantsByProcess[processId] || buildDefaultSeededVariants(processId, sopData.title);
          const updated = currentList.map((v) =>
            v.id === variantId ? { ...v, sopData } : v
          );
          return {
            variantsByProcess: {
              ...state.variantsByProcess,
              [processId]: updated,
            },
          };
        }),

      addVariantsFromUpload: (
        processId,
        processName,
        processArea,
        inputs,
        replaceExisting = false
      ) => {
        const isSpan =
          processName?.toLowerCase().includes("span") &&
          processName?.toLowerCase().includes("layer");
        const isCadastro =
          processId === "proc-cadastro-conta-bancaria" ||
          processName?.toLowerCase().includes("cadastro de conta banc") ||
          processName?.toLowerCase().includes("conta banc");
        const lookupId = isSpan ? "span-layer" : (isCadastro ? "proc-cadastro-conta-bancaria" : processId);
        const baseSop = sopDataMap[lookupId] || sopDemoDefault;

        const existingList = replaceExisting
          ? []
          : get().variantsByProcess[processId] || [];

        const today = new Date().toLocaleDateString("pt-BR", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        });

        const newVariants: SOPVariant[] = inputs.map((input, idx) => {
          const slotIndex = existingList.length + idx;
          const cleanName =
            input.name.trim() ||
            input.businessUnit ||
            `Procedimento #${slotIndex + 1}`;
          const generated = buildVariantSOPData(
            baseSop,
            slotIndex % 3,
            cleanName,
            input.businessUnit,
            processName,
            processArea
          );

          return {
            id: `${processId}-var-${Date.now()}-${idx + 1}`,
            processId,
            name: cleanName,
            businessUnit: input.businessUnit || undefined,
            divergenceReason: input.divergenceReason,
            divergenceDetail: input.divergenceDetail,
            sourceType: input.sourceType,
            sourceFileName: input.sourceFileName,
            transcriptionFileName: input.transcriptionFileName,
            createdAt: today,
            status: "Draft",
            version: "1.0",
            isDefault: existingList.length === 0 && idx === 0,
            metrics: generated.metrics,
            sopData: generated.sopData,
          };
        });

        const combined = [...existingList, ...newVariants];

        set((state) => ({
          variantsByProcess: {
            ...state.variantsByProcess,
            [processId]: combined,
          },
          activeVariantByProcess: {
            ...state.activeVariantByProcess,
            [processId]: newVariants[0]?.id || combined[0]?.id || "",
          },
          benchmarkEnabledByProcess: {
            ...state.benchmarkEnabledByProcess,
            [processId]: true,
          },
        }));

        return combined;
      },

      deleteVariant: (processId, variantId) =>
        set((state) => {
          const current = state.variantsByProcess[processId] || [];
          if (current.length <= 1) return state;
          const filtered = current.filter((v) => v.id !== variantId);
          const currentActive = state.activeVariantByProcess[processId];
          return {
            variantsByProcess: {
              ...state.variantsByProcess,
              [processId]: filtered,
            },
            activeVariantByProcess: {
              ...state.activeVariantByProcess,
              [processId]:
                currentActive === variantId ? filtered[0]?.id || "" : currentActive,
            },
          };
        }),

      setBenchmarkEnabled: (processId, enabled) =>
        set((state) => ({
          benchmarkEnabledByProcess: {
            ...state.benchmarkEnabledByProcess,
            [processId]: enabled,
          },
        })),

      isBenchmarkEnabled: (processId) => {
        const val = get().benchmarkEnabledByProcess[processId];
        return val !== undefined ? val : true;
      },

      seedComparisonDemoVariants: (processId, processName, processArea, defaultBU) => {
        const seeded = buildDefaultSeededVariants(processId, processName, defaultBU);
        set((state) => ({
          variantsByProcess: {
            ...state.variantsByProcess,
            [processId]: seeded,
          },
          activeVariantByProcess: {
            ...state.activeVariantByProcess,
            [processId]: seeded[0]?.id || "",
          },
          benchmarkEnabledByProcess: {
            ...state.benchmarkEnabledByProcess,
            [processId]: true,
          },
        }));
      },
    }),
    {
      name: "processhub-sop-variants-storage",
      version: 1,
    }
  )
);
