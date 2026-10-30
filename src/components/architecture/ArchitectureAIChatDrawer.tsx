import React, { useState, useRef, useEffect, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { AnimatePresence, motion } from "motion/react";
import {
  Sparkles,
  X,
  Send,
  Paperclip,
  FileText,
  CheckCircle2,
  BarChart3,
  Wand2,
  Layers,
  Target,
  Plus,
  ArrowRight,
  Trash2,
  Bot,
  User,
  Upload,
  Building2,
  AlertTriangle,
  TrendingUp,
  Pencil,
  Check,
  ChevronRight,
  Compass,
  ShieldCheck,
  RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  useValueChainStore,
  L1Process,
  L2Process,
  L3Process,
  L4Task,
  generateAIValueChainForCompany,
} from "@/stores/valueChainStore";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTaxonomy } from "@/stores/taxonomyStore";
import { mockArchitectureData } from "@/data/architectureContextMock";
import { anbimaArchitectureL1 } from "@/data/anbimaValueChain";
import {
  findDomainNode,
  findL2Node,
  findL3Node,
  findL4Node,
  getOperationalProcessDetails,
} from "@/data/architectureContextUtils";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const activeArchitectureData = {
  ...mockArchitectureData,
  domainsL1: anbimaArchitectureL1,
};

export interface ChatQuickOption {
  id: string;
  label: string;
  description?: string;
  icon?: "upload" | "benchmark" | "critique" | "edit" | "create" | "navigate" | "apply" | "sparkles";
  variant?: "primary" | "secondary" | "outline" | "success";
  actionType: string;
  payload?: any;
}

export interface CritiqueScorecard {
  targetName: string;
  targetLevel: string;
  overallScore: number;
  benchmarkRef: string;
  dimensions: Array<{
    name: string;
    score: number;
    status: "otimo" | "atencao" | "critico";
  }>;
  strengths: string[];
  gaps: string[];
  recommendations: string[];
}

export interface AppliedChangeBadge {
  title: string;
  fieldsUpdated: string[];
  targetNodeName: string;
  navigateParams?: Record<string, string | null>;
}

export interface ChatMessage {
  id: string;
  sender: "ai" | "user";
  timestamp: string;
  text: string;
  attachments?: Array<{ name: string; size: string; type: string }>;
  options?: ChatQuickOption[];
  critiqueCard?: CritiqueScorecard;
  appliedChange?: AppliedChangeBadge;
  showUploadBox?: boolean;
}

/** Largura (px) do painel docked. A página principal reserva esse espaço para não ficar coberta. */
export const AI_DRAWER_WIDTH = 400;

interface ArchitectureAIChatDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ArchitectureAIChatDrawer({ open: isOpen, onOpenChange: setIsOpen }: ArchitectureAIChatDrawerProps) {
  const [inputValue, setInputValue] = useState("");
  const [pendingAttachments, setPendingAttachments] = useState<
    Array<{ name: string; size: string; type: string }>
  >([]);
  const [isTyping, setIsTyping] = useState(false);
  const [appliedActionIds, setAppliedActionIds] = useState<Record<string, boolean>>({});

  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [searchParams, setSearchParams] = useSearchParams();
  const { language } = useLanguage();
  const pt = language === "PT";
  const { label: lvl } = useTaxonomy();

  const {
    l1Processes,
    addL1,
    updateL1,
    addL2,
    updateL2,
    addL3,
    updateL3,
    addL4,
    updateL4,
    setL1Processes,
    setNodeOverrides,
  } = useValueChainStore();

  // ── Resolve Current Screen Context ──────────────────────────────────
  const l1Id = searchParams.get("l1") || null;
  const l2Id = searchParams.get("l2") || null;
  const l3Id = searchParams.get("l3") || null;
  const l4Id = searchParams.get("l4") || null;
  const processId = searchParams.get("processId") || null;

  const currentContext = useMemo(() => {
    const l1 =
      l1Id
        ? l1Processes.find((x) => x.id === l1Id) ||
          activeArchitectureData.domainsL1.find(
            (d) => d.id === l1Id || d.name.toLowerCase() === l1Id.toLowerCase()
          ) ||
          null
        : null;

    const l1Name = l1 ? ("namePT" in l1 ? (pt ? l1.namePT : l1.nameEN) : l1.name) : "";

    const l2 =
      l2Id
        ? (l1 && "l2Processes" in l1
            ? l1.l2Processes.find((x) => x.id === l2Id)
            : null) ||
          findL2Node(activeArchitectureData, l2Id)?.l2 ||
          null
        : null;

    const l3 =
      l3Id
        ? (l2 && "l3Processes" in l2
            ? l2.l3Processes.find((x) => x.id === l3Id)
            : null) ||
          findL3Node(activeArchitectureData, l3Id)?.l3 ||
          null
        : null;

    const l4 =
      l4Id
        ? (l3 && "l4Tasks" in l3
            ? l3.l4Tasks.find((x) => x.id === l4Id)
            : null) ||
          findL4Node(activeArchitectureData, l4Id)?.l4 ||
          null
        : null;

    const opProc = processId
      ? getOperationalProcessDetails(activeArchitectureData, processId)
      : null;

    if (opProc) {
      return {
        levelKey: "process" as const,
        levelName: pt ? "Processo Operacional" : "Operational Process",
        nodeId: opProc.id,
        nodeName: opProc.name,
        parentL1Id: l1?.id || null,
        parentL2Id: l2?.id || null,
        parentL3Id: l3?.id || null,
        parentL4Id: l4?.id || null,
      };
    }
    if (l4) {
      return {
        levelKey: "l4" as const,
        levelName: lvl("l4"),
        nodeId: l4.id,
        nodeName: l4.name,
        parentL1Id: l1?.id || null,
        parentL2Id: l2?.id || null,
        parentL3Id: l3?.id || null,
        parentL4Id: l4.id,
      };
    }
    if (l3) {
      return {
        levelKey: "l3" as const,
        levelName: lvl("l3"),
        nodeId: l3.id,
        nodeName: l3.name,
        parentL1Id: l1?.id || null,
        parentL2Id: l2?.id || null,
        parentL3Id: l3.id,
        parentL4Id: null,
      };
    }
    if (l2) {
      return {
        levelKey: "l2" as const,
        levelName: lvl("l2"),
        nodeId: l2.id,
        nodeName: l2.name,
        parentL1Id: l1?.id || null,
        parentL2Id: l2.id,
        parentL3Id: null,
        parentL4Id: null,
      };
    }
    if (l1) {
      return {
        levelKey: "l1" as const,
        levelName: lvl("l1"),
        nodeId: l1.id,
        nodeName: l1Name,
        parentL1Id: l1.id,
        parentL2Id: null,
        parentL3Id: null,
        parentL4Id: null,
      };
    }
    return {
      levelKey: "root" as const,
      levelName: pt ? "Cadeia de Valor (Visão Geral)" : "Value Chain (Overview)",
      nodeId: "root",
      nodeName: pt ? "Cadeia de Valor" : "Value Chain",
      parentL1Id: null,
      parentL2Id: null,
      parentL3Id: null,
      parentL4Id: null,
    };
  }, [l1Id, l2Id, l3Id, l4Id, processId, l1Processes, pt, lvl]);

  const navigateToArchitectureNode = (params: Record<string, string | null>) => {
    const next = new URLSearchParams(searchParams);
    Object.entries(params).forEach(([k, v]) => {
      if (v === null) next.delete(k);
      else next.set(k, v);
    });
    setSearchParams(next, { replace: false });
  };

  // ── Initial Welcome Message ─────────────────────────────────────────
  const buildInitialMessages = (): ChatMessage[] => [
    {
      id: "welcome-msg",
      sender: "ai",
      timestamp: "Agora",
      text: pt
        ? `Olá! Eu sou o **Elo IA**, seu guia de preenchimento e arquiteto de processos. Estou acompanhando sua navegação em tempo real e posso criar ou editar domínios, macroprocessos, objetivos, indicadores e escopos em qualquer nível da arquitetura.\n\nEscolha uma das **3 principais funções** abaixo ou digite livremente o que deseja fazer:`
        : `Hello! I am **Elo AI**, your process architecture copilot. Choose one of the **3 main features** below or type what you want to create, edit, or analyze:`,
    },
  ];

  const [messages, setMessages] = useState<ChatMessage[]>(buildInitialMessages);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen, isTyping]);

  const nowStr = () =>
    new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });

  const appendMessage = (msg: Omit<ChatMessage, "id" | "timestamp">) => {
    const fullMsg: ChatMessage = {
      ...msg,
      id: `msg-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      timestamp: nowStr(),
    };
    setMessages((prev) => [...prev, fullMsg]);
    return fullMsg.id;
  };

  const simulateAIResponse = (fn: () => void, delay = 550) => {
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      fn();
    }, delay);
  };

  // ── Core Feature 1: Gerar Cadeia de Valor utilizando IA ─────────────
  const triggerFeatureGenerate = () => {
    appendMessage({
      sender: "user",
      text: "Quero gerar a Cadeia de Valor utilizando IA",
    });

    simulateAIResponse(() => {
      appendMessage({
        sender: "ai",
        text:
          `Perfeito! Posso estruturar uma **Cadeia de Valor completa** ou criar **Domínios e Macroprocessos já preenchidos** (com objetivo, proposta de valor, fronteira de escopo, entradas/saídas e indicadores).\n\nComo você prefere gerar?`,
        options: [
          {
            id: "gen-by-docs",
            label: "Subir documentos de referência",
            description:
              "Envie manuais, planejamento estratégico, organograma ou normativos para extrair domínios e macroprocessos preenchidos",
            icon: "upload",
            variant: "primary",
            actionType: "ASK_UPLOAD_DOCS",
          },
          {
            id: "gen-by-benchmark",
            label: "Gerar apenas com referência de mercado",
            description:
              "Utilizar benchmarks setoriais (APQC, ANBIMA, Agroindústria, SaaS, Varejo) sem precisar de documentos",
            icon: "benchmark",
            variant: "secondary",
            actionType: "ASK_BENCHMARK_SECTOR",
          },
        ],
      });
    });
  };

  // ── Core Feature 2: Criticar Cadeia de Valor ────────────────────────
  const triggerFeatureCritique = () => {
    appendMessage({
      sender: "user",
      text: "Quero criticar e avaliar a Cadeia de Valor",
    });

    simulateAIResponse(() => {
      const domainOptions: ChatQuickOption[] = [];

      // Se o usuário já está em um nível específico, destaca esse nível primeiro
      if (currentContext.levelKey !== "root") {
        domainOptions.push({
          id: `crit-current-${currentContext.nodeId}`,
          label: `Avaliar nível atual: ${currentContext.levelName} "${currentContext.nodeName}"`,
          description: "Análise de aderência a benchmark, completude de campos e oportunidades de melhoria",
          icon: "critique",
          variant: "primary",
          actionType: "RUN_CRITIQUE",
          payload: {
            scope: currentContext.levelKey,
            targetId: currentContext.nodeId,
            targetName: currentContext.nodeName,
            levelName: currentContext.levelName,
          },
        });
      }

      // Opção da cadeia completa
      domainOptions.push({
        id: "crit-full-chain",
        label: `Avaliar Cadeia de Valor Completa (${l1Processes.length} Domínios)`,
        description: "Visão executiva de cobertura ponta a ponta, equilíbrio Primários vs. Suporte e lacunas",
        icon: "critique",
        variant: currentContext.levelKey === "root" ? "primary" : "secondary",
        actionType: "RUN_CRITIQUE",
        payload: {
          scope: "root",
          targetId: "root",
          targetName: "Cadeia de Valor Corporativa",
          levelName: "Cadeia de Valor",
        },
      });

      // Primeiros domínios reais da loja para escolha direta
      l1Processes.slice(0, 4).forEach((d) => {
        const dName = pt ? d.namePT : d.nameEN;
        domainOptions.push({
          id: `crit-l1-${d.id}`,
          label: `Domínio: ${dName} (${d.l2Processes.length} macroprocessos)`,
          icon: "critique",
          variant: "outline",
          actionType: "RUN_CRITIQUE",
          payload: {
            scope: "l1",
            targetId: d.id,
            targetName: dName,
            levelName: lvl("l1"),
          },
        });
      });

      appendMessage({
        sender: "ai",
        text:
          `Com certeza! Vou fazer uma análise crítica comparando sua arquitetura com **benchmarks de mercado (APQC / Referências Setoriais)**, avaliando cobertura de processos, clareza de objetivos, fronteiras de escopo e indicadores.\n\n**Qual Domínio, Macroprocesso ou Processo você quer que eu julgue?** *(Você pode selecionar abaixo ou digitar o nome no chat)*`,
        options: domainOptions,
      });
    });
  };

  // ── Core Feature 3: Guia de Preenchimento & Edições Contextuais ─────
  const triggerFeatureGuideEdit = () => {
    appendMessage({
      sender: "user",
      text: `Me ajude a criar ou editar campos (${currentContext.levelName}: ${currentContext.nodeName})`,
    });

    simulateAIResponse(() => {
      if (currentContext.levelKey === "root") {
        appendMessage({
          sender: "ai",
          text:
            `Você está na **tela inicial da Cadeia de Valor**. A partir daqui, posso criar novos Domínios e Macroprocessos já preenchidos (inclusive subindo documentos), ou editar qualquer campo dos domínios existentes.\n\nO que você gostaria de fazer agora?`,
          options: [
            {
              id: "guide-create-domain-doc",
              label: "Subir documento e criar Domínio + Macroprocessos preenchidos",
              description: "Extraio objetivos, escopo, entradas/saídas e processos automaticamente",
              icon: "upload",
              variant: "primary",
              actionType: "ASK_UPLOAD_DOCS",
            },
            {
              id: "guide-create-domain-ai",
              label: "Criar novo Domínio + Macroprocessos de Dados, IA & Inovação",
              description: "Cria o domínio na cadeia com 3 macroprocessos e ficha de contexto completa",
              icon: "create",
              variant: "secondary",
              actionType: "CREATE_SAMPLE_DOMAIN_FULL",
              payload: {
                domainName: "Dados, Inteligência Analítica e Inovação",
                category: "SUPPORT",
              },
            },
            {
              id: "guide-enrich-all-l1",
              label: "Enriquecer Objetivos e Indicadores dos Domínios atuais",
              description: "Preenche objetivos estratégicos, propostas de valor e KPIs nos domínios da cadeia",
              icon: "edit",
              variant: "outline",
              actionType: "ENRICH_ALL_DOMAINS",
            },
          ],
        });
      } else {
        appendMessage({
          sender: "ai",
          text:
            `Estou conectado ao **${currentContext.levelName}: "${currentContext.nodeName}"**. Posso criar ou editar qualquer campo desta tela em tempo real — ou você pode digitar pedidos como *"Cria para mim um objetivo..."*, *"Adiciona indicadores de SLA"* ou *"Cria um novo macroprocesso/processo aqui"*.\n\nEscolha uma edição rápida para aplicar agora ou digite seu comando:`,
          options: [
            {
              id: `edit-obj-${currentContext.nodeId}`,
              label: `Criar/Refinar Objetivo e Proposta de Valor de "${currentContext.nodeName}"`,
              description: "Redige objetivo orientado a resultado e proposta de valor executiva",
              icon: "edit",
              variant: "primary",
              actionType: "APPLY_FIELD_EDIT",
              payload: {
                fieldGroup: "objective_and_value",
                nodeId: currentContext.nodeId,
                nodeName: currentContext.nodeName,
                levelKey: currentContext.levelKey,
              },
            },
            {
              id: `edit-scope-${currentContext.nodeId}`,
              label: `Preencher Fronteira de Escopo, Entradas, Stakeholders e Saídas`,
              description: "Estrutura fornecedores, insumos, entregas e limites claros de atuação",
              icon: "edit",
              variant: "secondary",
              actionType: "APPLY_FIELD_EDIT",
              payload: {
                fieldGroup: "scope_io",
                nodeId: currentContext.nodeId,
                nodeName: currentContext.nodeName,
                levelKey: currentContext.levelKey,
              },
            },
            {
              id: `edit-kpi-${currentContext.nodeId}`,
              label: `Gerar Indicadores (KPIs), Sistemas e Pontos de Dor`,
              description: "Adiciona métricas de SLA, eficiência, qualidade e sistemas vinculados",
              icon: "edit",
              variant: "outline",
              actionType: "APPLY_FIELD_EDIT",
              payload: {
                fieldGroup: "kpis_and_systems",
                nodeId: currentContext.nodeId,
                nodeName: currentContext.nodeName,
                levelKey: currentContext.levelKey,
              },
            },
            ...(currentContext.levelKey === "l1" ||
            currentContext.levelKey === "l2" ||
            currentContext.levelKey === "l3"
              ? [
                  {
                    id: `add-child-${currentContext.nodeId}`,
                    label: `Criar novo subcomponente filho preenchido neste ${currentContext.levelName}`,
                    description: "Adiciona automaticamente na estrutura com escopo detalhado",
                    icon: "create" as const,
                    variant: "outline" as const,
                    actionType: "ADD_CHILD_TO_CURRENT",
                    payload: {
                      nodeId: currentContext.nodeId,
                      nodeName: currentContext.nodeName,
                      levelKey: currentContext.levelKey,
                    },
                  },
                ]
              : []),
          ],
        });
      }
    });
  };

  // ── Helper: Generate Domain + Macroprocesses from Documents or Topic ─
  const executeGenerateDomainFromDocsOrTopic = (
    docNames: string[],
    customTopic?: string,
    mode: "domain" | "full_chain" = "domain"
  ) => {
    if (mode === "full_chain") {
      const generated = generateAIValueChainForCompany(
        customTopic || (docNames.length > 0 ? docNames[0].replace(/\.[^/.]+$/, "") : "Referência de Mercado")
      );
      setL1Processes(generated);
      // Enrich first domain override as well
      if (generated[0]) {
        setNodeOverrides(generated[0].id, {
          objective:
            "Assegurar o alinhamento estratégico e a execução integrada dos macroprocessos ponta a ponta com alta eficiência operacional.",
          valueProposition:
            "Arquitetura orientada a valor, com handoffs claros, SLAs monitorados e governança corporativa.",
          scopeBoundary:
            "Compreende desde o planejamento e captação de demanda até a entrega final e retenção de valor.",
          inputs: "Diretrizes estratégicas, sinais de mercado, demandas de clientes e políticas.",
          outputs: "Produtos/serviços entregues, receita recorrente, indicadores de performance.",
          stakeholders: "Diretoria Executiva, Clientes, Operações, Comercial e TI.",
          validationPercent: 95,
        });
      }

      toast.success(
        pt
          ? "Cadeia de Valor gerada e preenchida pelo Elo IA!"
          : "Value Chain generated by Elo AI!"
      );

      appendMessage({
        sender: "ai",
        text:
          docNames.length > 0
            ? `Analisei os documentos **${docNames.join(", ")}** e gerei a **Cadeia de Valor completa** com **${generated.length} Domínios (Primários e de Suporte)**, além de seus respectivos Macroprocessos (L2), Processos (L3) e Subprocessos (L4)!`
            : `Gerei a **Cadeia de Valor completa** baseada no benchmark **${customTopic || "Melhores Práticas de Mercado"}**, estruturando **${generated.length} Domínios** com Macroprocessos (L2), Processos (L3) e Subprocessos (L4)!`,
        appliedChange: {
          title: "Cadeia de Valor Gerada com IA",
          targetNodeName: `${generated.length} Domínios e ${generated.reduce((acc, d) => acc + d.l2Processes.length, 0)} Macroprocessos`,
          fieldsUpdated: [
            "Domínios Primários e Suporte (L1)",
            "Macroprocessos (L2)",
            "Processos (L3) e Subprocessos (L4)",
            "Objetivos e Escopo",
          ],
          navigateParams: { l1: null, l2: null, l3: null, l4: null, processId: null },
        },
      });
      return;
    }

    // Create a rich Domain + Macroprocesses filled from documents / prompt
    const topicTitle =
      customTopic ||
      (docNames.length > 0
        ? "Governança de Dados, IA e Excelência Operacional"
        : "Gestão de Experiência do Cliente & Jornada Digital");

    const newL1Id = `l1-ai-${Date.now().toString(36)}`;
    const l2AId = `l2-ai-${Date.now().toString(36)}-1`;
    const l2BId = `l2-ai-${Date.now().toString(36)}-2`;
    const l2CId = `l2-ai-${Date.now().toString(36)}-3`;

    const newDomain: L1Process = {
      id: newL1Id,
      name: topicTitle,
      namePT: topicTitle,
      nameEN: topicTitle,
      category: topicTitle.toLowerCase().includes("governança") || topicTitle.toLowerCase().includes("dados") ? "SUPPORT" : "PRIMARY",
      description:
        docNames.length > 0
          ? `Domínio estruturado via Elo IA a partir de ${docNames.join(", ")}, orquestrando políticas, fluxos e entregas de alto impacto.`
          : `Domínio estruturado via Elo IA com base em benchmark setorial, conectando ponta a ponta os macroprocessos críticos.`,
      responsible: "Diretoria de Transformação & Operações",
      businessUnit: "Corporativo / Holding",
      code: `DOM-${l1Processes.length + 1}`,
      systems: "SAP S/4HANA, Salesforce CRM, Snowflake Data Cloud, ServiceNow",
      ftes: "18 FTE",
      l2Processes: [
        {
          id: l2AId,
          name: "Planejamento, Estratégia e Direcionamento",
          description: "Define diretrizes, prioriza portfólio de demandas e estabelece metas de nível de serviço (SLAs).",
          responsible: "Gerência de Planejamento e Governança",
          businessUnit: "Corporativo",
          systems: "Power BI, Jira Align, SAP",
          l3Processes: [
            {
              id: `l3-${Date.now()}-1`,
              name: "Definição de Diretrizes e Priorização de Demandas",
              description: "Avaliação de impacto, capacidade e alinhamento estratégico.",
              status: "active",
              l4Tasks: [
                { id: `l4-${Date.now()}-1`, name: "Capturar e classificar demandas estratégicas", status: "active" },
                { id: `l4-${Date.now()}-2`, name: "Priorizar backlog executivo e aprovar SLAs", status: "active" },
              ],
            },
            {
              id: `l3-${Date.now()}-2`,
              name: "Monitoramento de Metas e Riscos Operacionais",
              description: "Acompanhamento contínuo de OKRs e mitigação de desvios.",
              status: "active",
              l4Tasks: [
                { id: `l4-${Date.now()}-3`, name: "Consolidar indicadores executivos", status: "active" },
              ],
            },
          ],
        },
        {
          id: l2BId,
          name: "Execução Integrada e Entrega de Valor",
          description: "Orquestra o fluxo operacional ponta a ponta com automação, controle de qualidade e rastreabilidade.",
          responsible: "Gerência de Operações Core",
          businessUnit: "Operações",
          systems: "ServiceNow, Salesforce, Plataforma Core",
          l3Processes: [
            {
              id: `l3-${Date.now()}-3`,
              name: "Processamento, Qualificação e Execução",
              description: "Execução padronizada conforme regras de negócio e conformidade.",
              status: "active",
              l4Tasks: [
                { id: `l4-${Date.now()}-4`, name: "Validar requisitos e insumos de entrada", status: "active" },
                { id: `l4-${Date.now()}-5`, name: "Executar processamento e registrar evidências", status: "active" },
              ],
            },
          ],
        },
        {
          id: l2CId,
          name: "Monitoramento Contínuo, Qualidade e Melhoria",
          description: "Audita conformidade, analisa causas-raiz de desvios e implementa ciclos de melhoria contínua.",
          responsible: "Coordenação de Excelência de Processos",
          businessUnit: "Qualidade & Compliance",
          systems: "Celonis Process Mining, Power BI",
          l3Processes: [
            {
              id: `l3-${Date.now()}-4`,
              name: "Análise de Performance e Melhoria Contínua",
              description: "Identificação de gargalos e automação de rotinas críticas.",
              status: "active",
              l4Tasks: [
                { id: `l4-${Date.now()}-6`, name: "Realizar diagnóstico de desvios de SLA", status: "active" },
              ],
            },
          ],
        },
      ],
    };

    // Save to store
    setL1Processes([...l1Processes, newDomain]);

    // Populate rich ScopeContextSheet overrides for the new L1 and its L2s
    setNodeOverrides(newL1Id, {
      name: topicTitle,
      description: newDomain.description,
      objective: `Garantir a excelência ponta a ponta em ${topicTitle}, maximizando eficiência operacional, conformidade regulatória e geração de valor mensurável para o negócio.`,
      valueProposition: `Processos padronizados, integrados e auditáveis, reduzindo o tempo de ciclo em até 30% e oferecendo visibilidade em tempo real para tomada de decisão.`,
      scopeBoundary: `Inicia na captação e priorização de demandas/diretrizes estratégicas e conclui na entrega validada com monitoramento de indicadores de nível de serviço (SLA/KPIs).`,
      inputs: `Diretrizes estratégicas corporativas, documentos normativos (${docNames.length > 0 ? docNames.join(", ") : "Benchmark APQC"}), solicitações de áreas de negócio e dados transacionais.`,
      outputs: `Entregas operacionais homologadas, painéis de indicadores atualizados, trilhas de auditoria e planos de melhoria contínua.`,
      stakeholders: `Diretoria Executiva, Unidades de Negócio, Clientes Internos/Externos, Tecnologia da Informação, Riscos & Compliance.`,
      responsible: "Diretoria de Transformação & Operações",
      businessUnit: "Corporativo / Holding",
      validationPercent: 96,
      systems: ["SAP S/4HANA", "Salesforce CRM", "ServiceNow", "Power BI", "Snowflake"],
      indicators: [
        { name: "Índice de Cumprimento de SLA", currentValue: "94%", target: "96%", status: "dentro_da_meta" },
        { name: "Lead Time Ponta a Ponta", currentValue: "3,2 dias", target: "3,0 dias", status: "atencao" },
        { name: "Índice de Automação de Fluxo", currentValue: "68%", target: "75%", status: "dentro_da_meta" },
      ],
    });

    setNodeOverrides(l2AId, {
      objective: "Alinhar a capacidade operacional às prioridades estratégicas do negócio com previsibilidade.",
      valueProposition: "Portfólio priorizado com critérios claros de valor, risco e esforço.",
      startCondition: "Demanda estratégica ou ciclo de planejamento iniciado.",
      endCondition: "Plano operacional, metas e SLAs aprovados e comunicados.",
      inputs: "OKRs corporativos, demandas das unidades de negócio, restrições orçamentárias.",
      outputs: "Roadmap priorizado, metas de SLA definidas e alocação de capacidade.",
      stakeholders: "Diretoria, Gerentes de Negócio, PMO e Líderes de Processo.",
      validationPercent: 92,
    });

    setNodeOverrides(l2BId, {
      objective: "Executar as entregas de forma ágil, padronizada e sem retrabalho entre as áreas.",
      valueProposition: "Fluxo enxuto com handoffs automatizados e alta confiabilidade na primeira entrega (FTY).",
      startCondition: "Demanda qualificada e liberada para execução.",
      endCondition: "Entrega concluída, validada pelo destinatário e registrada no sistema.",
      inputs: "Solicitação qualificada, regras de negócio, dados cadastrais e insumos.",
      outputs: "Produto/serviço processado, confirmação de entrega e log de conformidade.",
      stakeholders: "Equipes de Operações, Clientes, Suporte Técnico e Qualidade.",
      validationPercent: 94,
    });

    setNodeOverrides(l2CId, {
      objective: "Assegurar a estabilidade operacional e capturar ganhos contínuos de produtividade.",
      valueProposition: "Identificação proativa de gargalos e evolução contínua da maturidade do processo.",
      startCondition: "Ciclo de medição encerrado ou alerta de desvio de SLA.",
      endCondition: "Plano de ação corretiva/melhoria implantado e padronizado.",
      inputs: "Logs de execução, indicadores de SLA, pesquisas de satisfação e auditorias.",
      outputs: "Relatórios de performance, causas-raiz tratadas e atualização de normativos.",
      stakeholders: "Escritório de Processos (BPM), Liderança Executiva, Auditoria e Operações.",
      validationPercent: 90,
    });

    toast.success(`Domínio "${topicTitle}" e 3 Macroprocessos criados e preenchidos!`);

    appendMessage({
      sender: "ai",
      text:
        docNames.length > 0
          ? `**Pronto!** Extraí a estrutura dos documentos **${docNames.join(", ")}** e criei na sua Cadeia de Valor o domínio **"${topicTitle}"** juntamente com **3 Macroprocessos (L2)** e **4 Processos (L3)** totalmente preenchidos (Objetivo, Proposta de Valor, Fronteira de Escopo, Entradas, Saídas, Sistemas e Indicadores).\n\nVocê pode clicar no botão abaixo para abrir a ficha completa desse domínio agora mesmo:`
          : `**Pronto!** Criei o domínio **"${topicTitle}"** e seus **3 Macroprocessos (L2)** já preenchidos com **Objetivo, Proposta de Valor, Fronteira de Escopo, Entradas, Saídas, Stakeholders e Indicadores** baseados em boas práticas de mercado!`,
      appliedChange: {
        title: `Domínio + 3 Macroprocessos Criados: "${topicTitle}"`,
        targetNodeName: topicTitle,
        fieldsUpdated: [
          "Domínio (L1) + 3 Macroprocessos (L2) + Processos (L3/L4)",
          "Objetivo & Proposta de Valor",
          "Fronteira de Escopo, Entradas e Saídas",
          "Indicadores (KPIs), Sistemas e Governança",
        ],
        navigateParams: { l1: newL1Id, l2: null, l3: null, l4: null, processId: null },
      },
    });
  };

  // ── Helper: Run Analytical Critique ─────────────────────────────────
  const executeCritique = (targetId: string, targetName: string, levelName: string, scope: string) => {
    const isRoot = scope === "root";
    const score = isRoot ? 81 : 76;

    const scorecard: CritiqueScorecard = {
      targetName,
      targetLevel: levelName,
      overallScore: score,
      benchmarkRef: "APQC PCF v7.4 & Benchmark Setorial EloGroup",
      dimensions: [
        { name: "Alinhamento & Decomposição (MECE)", score: isRoot ? 86 : 84, status: "otimo" },
        { name: "Clareza de Objetivo & Proposta de Valor", score: 78, status: "atencao" },
        { name: "Handoffs, Entradas/Saídas e Fronteira", score: 71, status: "atencao" },
        { name: "Cobertura de Indicadores (SLAs/KPIs)", score: 69, status: "critico" },
      ],
      strengths: isRoot
        ? [
            `Boa separação entre Domínios Primários (Core/Finalísticos) e Domínios de Suporte/Gestão (${l1Processes.length} domínios mapeados).`,
            "Nomenclatura executiva clara nos macroprocessos principais, facilitando leitura pela alta liderança.",
            "Cobertura consistente das etapas centrais de geração de demanda, execução e controles corporativos.",
          ]
        : [
            `O ${levelName} "${targetName}" possui papel bem posicionado dentro da árvore hierárquica da cadeia.`,
            "Boa conexão lógica com os componentes filhos e clareza na responsabilidade organizacional.",
            "Sistemas estruturantes e políticas normativas principais já estão mapeados no contexto.",
          ],
      gaps: isRoot
        ? [
            "Ausência de um macroprocesso explícito de 'Gestão de Dados, Analytics & Automação' conectado aos domínios finalísticos.",
            "Alguns domínios possuem descrições curtas sem explicitar a fronteira de início/fim (handoff entre Comercial e Operações).",
            "Faltam indicadores de resultado ponta a ponta (ex.: Lead Time E2E, Nível de Serviço Consolidado e Custo por Transação).",
          ]
        : [
            `O Objetivo atual de "${targetName}" descreve a atividade, mas pode explicitar melhor o resultado mensurável esperado (padrão Benchmark).`,
            "As Entradas e Saídas precisam detalhar os critérios de aceite (Qualidade na Fonte / Definition of Ready) para reduzir retrabalho.",
            "Faltam indicadores balanceados combinando Eficiência (Tempo/Custo) e Qualidade/Conversão na ficha deste nível.",
          ],
      recommendations: isRoot
        ? [
            "Padronizar Objetivos, Proposta de Valor e Fronteiras de Escopo dos Domínios L1 com foco em entregáveis mensuráveis.",
            "Adicionar um Domínio ou Macroprocesso transversal de Inteligência Analítica / Excelência Operacional.",
            "Vincular metas de SLA e indicadores de ciclo aos domínios críticos da cadeia.",
          ]
        : [
            `Reescrever o Objetivo e a Proposta de Valor de "${targetName}" com foco em impacto executivo e SLA.`,
            "Detalhar formalmente as Entradas, Saídas, Fronteira de Escopo e Stakeholders com critérios claros de passagem (handoff).",
            "Incluir 3 indicadores de benchmark (Lead Time, Taxa de Qualidade/Sucesso no 1º Giro e Cumprimento de SLA).",
          ],
    };

    const actionNodeId = isRoot ? (l1Processes[0]?.id || "root") : targetId;

    appendMessage({
      sender: "ai",
      text: `Concluí o diagnóstico analítico de **${levelName}: "${targetName}"** em comparação com o benchmark de mercado. Veja abaixo os pontos fortes, gaps identificados e as melhorias prontas para aplicação com 1 clique:`,
      critiqueCard: scorecard,
      options: isRoot
        ? [
            {
              id: `fix-crit-root-all-${Date.now()}`,
              label: "Aplicar melhorias sugeridas nos Domínios da Cadeia",
              description: "Refina objetivos, fronteiras de escopo e adiciona indicadores de benchmark",
              icon: "apply",
              variant: "primary",
              actionType: "ENRICH_ALL_DOMAINS",
            },
            {
              id: `fix-crit-add-domain-${Date.now()}`,
              label: "Criar Domínio sugerido: Dados, Analytics & Excelência",
              description: "Adiciona o domínio faltante apontado no benchmark com 3 macroprocessos",
              icon: "create",
              variant: "secondary",
              actionType: "CREATE_SAMPLE_DOMAIN_FULL",
              payload: {
                domainName: "Dados, Analytics & Excelência Operacional",
                category: "SUPPORT",
              },
            },
          ]
        : [
            {
              id: `fix-crit-node-${actionNodeId}-${Date.now()}`,
              label: `Aplicar todas as melhorias recomendadas em "${targetName}"`,
              description: "Atualiza Objetivo, Proposta de Valor, Escopo, Entradas/Saídas e Indicadores agora",
              icon: "apply",
              variant: "primary",
              actionType: "APPLY_FIELD_EDIT",
              payload: {
                fieldGroup: "all_benchmark_fixes",
                nodeId: actionNodeId,
                nodeName: targetName,
                levelKey: scope,
              },
            },
            {
              id: `fix-crit-child-${actionNodeId}-${Date.now()}`,
              label: `Adicionar componente filho de Governança & Monitoramento em "${targetName}"`,
              description: "Fecha o gap de controle contínuo apontado na análise de benchmark",
              icon: "create",
              variant: "secondary",
              actionType: "ADD_CHILD_TO_CURRENT",
              payload: {
                nodeId: actionNodeId,
                nodeName: targetName,
                levelKey: scope,
              },
            },
          ],
    });
  };

  // ── Helper: Apply Field Edits to a Specific Node ────────────────────
  const executeFieldEdit = (
    nodeId: string,
    nodeName: string,
    fieldGroup: "objective_and_value" | "scope_io" | "kpis_and_systems" | "all_benchmark_fixes",
    customText?: string
  ) => {
    const updates: Record<string, any> = {};
    const fieldsUpdatedLabels: string[] = [];

    if (
      fieldGroup === "objective_and_value" ||
      fieldGroup === "all_benchmark_fixes"
    ) {
      updates.objective =
        customText ||
        `Assegurar a execução de excelência em ${nodeName}, garantindo previsibilidade operacional, conformidade normativa, redução do tempo de ciclo e máxima geração de valor para os clientes e áreas parceiras.`;
      updates.valueProposition = `Fluxo integrado, rastreável e orientado a dados para ${nodeName}, com acordos de nível de serviço (SLAs) claros, eliminação de retrabalho nos handoffs e experiência consultiva ponta a ponta.`;
      updates.description = `Componente arquitetural estruturado segundo boas práticas de mercado (Elo IA), responsável por orquestrar ${nodeName} com alta eficiência e governança.`;
      fieldsUpdatedLabels.push("Objetivo", "Proposta de Valor", "Descrição Executiva");
    }

    if (fieldGroup === "scope_io" || fieldGroup === "all_benchmark_fixes") {
      updates.scopeBoundary = `Compreende desde a recepção e validação dos direcionadores e insumos de entrada em ${nodeName}, passando pelo processamento, qualificação e controle de qualidade, até a entrega formal homologada para o próximo elo da cadeia.`;
      updates.startCondition = `Demanda, gatilho transacional ou insumo qualificado recebido e validado conforme critérios de entrada (Definition of Ready).`;
      updates.endCondition = `Entrega concluída, validada conforme padrões de qualidade, registrada no sistema estruturante e disponibilizada ao processo seguinte.`;
      updates.inputs = `Solicitações e demandas qualificadas, diretrizes e políticas corporativas, dados cadastrais/transacionais validados e parâmetros de SLA.`;
      updates.outputs = `Entrega operacional homologada, registros atualizados nos sistemas core, indicadores de desempenho apurados e notificações de handoff.`;
      updates.stakeholders = `Liderança Executiva, Gestor do Processo (Process Owner), Equipe de Execução, Clientes Internos/Externos, TI e Compliance.`;
      fieldsUpdatedLabels.push(
        "Fronteira de Escopo",
        "Condições de Início e Término",
        "Entradas e Direcionadores",
        "Saídas e Entregas",
        "Stakeholders"
      );
    }

    if (
      fieldGroup === "kpis_and_systems" ||
      fieldGroup === "all_benchmark_fixes"
    ) {
      updates.indicators = [
        {
          name: "Índice de Cumprimento de SLA",
          currentValue: "94,5%",
          target: "96,0%",
          status: "dentro_da_meta",
        },
        {
          name: "Tempo Médio de Ciclo (Lead Time)",
          currentValue: "2,4 dias",
          target: "2,0 dias",
          status: "atencao",
        },
        {
          name: "Qualidade no Primeiro Giro (First Time Right)",
          currentValue: "91,0%",
          target: "90,0%",
          status: "dentro_da_meta",
        },
        {
          name: "Índice de Automação e Digitalização",
          currentValue: "76%",
          target: "80%",
          status: "dentro_da_meta",
        },
      ];
      updates.systems = [
        "SAP S/4HANA",
        "Salesforce CRM",
        "ServiceNow Workflow",
        "Power BI Analytics",
      ];
      updates.painPoints = [
        "Oportunidade de automatizar validação de dados na passagem entre áreas (handoff)",
        "Padronização de motivos de exceção para análise preditiva",
      ];
      fieldsUpdatedLabels.push("Indicadores (KPIs)", "Sistemas", "Pontos de Melhoria");
    }

    updates.validationPercent = 96;

    // Persist in nodeOverrides (works for all L1, L2, L3, L4 & mock nodes!)
    setNodeOverrides(nodeId, updates);

    // Also update description in l1Processes tree if present
    if (updates.description) {
      updateL1(nodeId, { description: updates.description });
      if (currentContext.parentL1Id) {
        updateL2(currentContext.parentL1Id, nodeId, { description: updates.description });
      }
      if (currentContext.parentL1Id && currentContext.parentL2Id) {
        updateL3(currentContext.parentL1Id, currentContext.parentL2Id, nodeId, {
          description: updates.description,
        });
      }
    }

    toast.success(`Campos de "${nodeName}" atualizados com sucesso pelo Elo IA!`);

    appendMessage({
      sender: "ai",
      text: `Atualizei imediatamente os campos de **"${nodeName}"** na sua arquitetura!\n\n${
        updates.objective
          ? `**Novo Objetivo aplicado:**\n> *"${updates.objective}"*\n\n`
          : ""
      }${
        updates.valueProposition
          ? `**Nova Proposta de Valor aplicada:**\n> *"${updates.valueProposition}"*\n\n`
          : ""
      }As alterações já estão visíveis ao vivo na ficha ao lado.`,
      appliedChange: {
        title: `Edição Aplicada em "${nodeName}"`,
        targetNodeName: nodeName,
        fieldsUpdated: fieldsUpdatedLabels,
      },
    });
  };

  // ── Helper: Add Child Component to Current Node ─────────────────────
  const executeAddChildToNode = (
    nodeId: string,
    nodeName: string,
    levelKey: string,
    customChildName?: string
  ) => {
    const childName =
      customChildName ||
      (levelKey === "l1"
        ? "Governança, Monitoramento de SLAs e Melhoria Contínua"
        : levelKey === "l2"
        ? "Qualificação Automatizada e Controle de Qualidade"
        : "Validação de Critérios de Aceite e Handoff");

    if (levelKey === "l1") {
      addL2(nodeId, {
        name: childName,
        description:
          "Macroprocesso criado pelo Elo IA com foco em governança, acompanhamento de indicadores e melhoria contínua.",
        responsible: "Gerência de Excelência Operacional",
        businessUnit: "Corporativo",
      });
    } else if (levelKey === "l2" && currentContext.parentL1Id) {
      addL3(currentContext.parentL1Id, nodeId, {
        name: childName,
        description:
          "Processo estruturado pelo Elo IA para garantir qualidade na fonte, cumprimento de SLA e rastreabilidade.",
        status: "active",
      });
    } else if (
      levelKey === "l3" &&
      currentContext.parentL1Id &&
      currentContext.parentL2Id
    ) {
      addL4(currentContext.parentL1Id, currentContext.parentL2Id, nodeId, {
        name: childName,
        description: "Subprocesso adicionado pelo Elo IA com regras de validação padronizadas.",
        status: "active",
      });
    } else if (l1Processes[0]) {
      addL2(l1Processes[0].id, {
        name: childName,
        description: "Macroprocesso criado via Elo IA.",
      });
    }

    toast.success(`Novo componente "${childName}" criado em "${nodeName}"!`);

    appendMessage({
      sender: "ai",
      text: `Criei e vinculei o novo componente **"${childName}"** dentro de **"${nodeName}"** já com descrição executiva, responsável e governança configurados!`,
      appliedChange: {
        title: `Novo Componente Criado em "${nodeName}"`,
        targetNodeName: childName,
        fieldsUpdated: ["Estrutura da Árvore", "Descrição & Escopo", "Responsável"],
      },
    });
  };

  // ── Handle Option Button Clicks inside Chat ─────────────────────────
  const handleOptionClick = (opt: ChatQuickOption) => {
    setAppliedActionIds((prev) => ({ ...prev, [opt.id]: true }));

    if (opt.actionType === "ASK_UPLOAD_DOCS") {
      appendMessage({
        sender: "user",
        text: opt.label,
      });
      simulateAIResponse(() => {
        appendMessage({
          sender: "ai",
          text:
            `Ótimo! Anexe abaixo seus **documentos de referência** (PDF, DOCX, XLSX, PPTX — como Planejamento Estratégico, Manual de Processos, Organograma ou Normativos) ou clique em um dos documentos de demonstração.\n\nA partir deles, posso **gerar um Domínio + Macroprocessos preenchidos** ou **estruturar a Cadeia de Valor inteira**:`,
          showUploadBox: true,
        });
      });
      return;
    }

    if (opt.actionType === "ASK_BENCHMARK_SECTOR") {
      appendMessage({
        sender: "user",
        text: opt.label,
      });
      simulateAIResponse(() => {
        appendMessage({
          sender: "ai",
          text:
            `Perfeito! Selecione abaixo a **referência de mercado (Benchmark)** que deseja utilizar ou digite no chat o setor/domínio específico da sua empresa:`,
          options: [
            {
              id: "bench-fin",
              label: "Mercado Financeiro, Investimentos & ANBIMA (Cadeia Completa)",
              description: "Estrutura domínios primários e de suporte com melhores práticas do setor financeiro",
              icon: "benchmark",
              variant: "primary",
              actionType: "GENERATE_FROM_BENCHMARK",
              payload: { sector: "Instituição Financeira & Mercado de Capitais", mode: "full_chain" },
            },
            {
              id: "bench-domain-cx",
              label: "Gerar Domínio + Macroprocessos: Experiência do Cliente & Pós-Venda",
              description: "Cria na cadeia atual um novo Domínio Primário com 3 Macroprocessos e KPIs preenchidos",
              icon: "create",
              variant: "secondary",
              actionType: "GENERATE_FROM_BENCHMARK",
              payload: {
                sector: "Gestão de Experiência do Cliente e Sucesso (CX)",
                mode: "domain",
              },
            },
            {
              id: "bench-domain-esg",
              label: "Gerar Domínio + Macroprocessos: Sustentabilidade (ESG) & Riscos",
              description: "Cria na cadeia atual um Domínio com Macroprocessos de Governança, Riscos e ESG",
              icon: "create",
              variant: "outline",
              actionType: "GENERATE_FROM_BENCHMARK",
              payload: {
                sector: "Governança Corporativa, Riscos Integrados e ESG",
                mode: "domain",
              },
            },
            {
              id: "bench-agro",
              label: "Agroindústria, Energia & Manufatura (Cadeia Completa APQC)",
              description: "Gera cadeia E2E completa com Originação, Operações Industriais, Logística e Suporte",
              icon: "benchmark",
              variant: "outline",
              actionType: "GENERATE_FROM_BENCHMARK",
              payload: { sector: "Agroindústria & Energia Integrada", mode: "full_chain" },
            },
          ],
        });
      });
      return;
    }

    if (opt.actionType === "GENERATE_FROM_BENCHMARK") {
      appendMessage({
        sender: "user",
        text: opt.label,
      });
      simulateAIResponse(() => {
        executeGenerateDomainFromDocsOrTopic(
          [],
          opt.payload?.sector,
          opt.payload?.mode || "domain"
        );
      });
      return;
    }

    if (opt.actionType === "RUN_CRITIQUE") {
      appendMessage({
        sender: "user",
        text: opt.label,
      });
      simulateAIResponse(() => {
        executeCritique(
          opt.payload.targetId,
          opt.payload.targetName,
          opt.payload.levelName,
          opt.payload.scope
        );
      }, 650);
      return;
    }

    if (opt.actionType === "APPLY_FIELD_EDIT") {
      appendMessage({
        sender: "user",
        text: opt.label,
      });
      simulateAIResponse(() => {
        executeFieldEdit(
          opt.payload.nodeId,
          opt.payload.nodeName,
          opt.payload.fieldGroup
        );
      });
      return;
    }

    if (opt.actionType === "ADD_CHILD_TO_CURRENT") {
      appendMessage({
        sender: "user",
        text: opt.label,
      });
      simulateAIResponse(() => {
        executeAddChildToNode(
          opt.payload.nodeId,
          opt.payload.nodeName,
          opt.payload.levelKey
        );
      });
      return;
    }

    if (opt.actionType === "CREATE_SAMPLE_DOMAIN_FULL") {
      appendMessage({
        sender: "user",
        text: opt.label,
      });
      simulateAIResponse(() => {
        executeGenerateDomainFromDocsOrTopic(
          [],
          opt.payload?.domainName || "Dados, Inteligência Analítica e Inovação",
          "domain"
        );
      });
      return;
    }

    if (opt.actionType === "ENRICH_ALL_DOMAINS") {
      appendMessage({
        sender: "user",
        text: opt.label,
      });
      simulateAIResponse(() => {
        l1Processes.forEach((d) => {
          const dName = pt ? d.namePT : d.nameEN;
          setNodeOverrides(d.id, {
            objective: `Orquestrar os macroprocessos de ${dName} com excelência operacional, previsibilidade de entrega e alinhamento aos objetivos estratégicos da organização.`,
            valueProposition: `Visão integrada ponta a ponta em ${dName}, com acordos de nível de serviço (SLAs) monitorados, governança clara e eficiência de recursos.`,
            scopeBoundary: `Compreende todas as etapas de planejamento, execução, controle e melhoria contínua referentes a ${dName}.`,
            validationPercent: 95,
          });
        });
        toast.success("Objetivos, propostas de valor e escopos de todos os domínios atualizados!");
        appendMessage({
          sender: "ai",
          text: `Padronizei e enriqueci os **Objetivos Estratégicos, Propostas de Valor e Fronteiras de Escopo** de todos os **${l1Processes.length} Domínios** da sua Cadeia de Valor segundo o padrão de benchmark executivo!`,
          appliedChange: {
            title: `${l1Processes.length} Domínios Enriquecidos com Benchmark`,
            targetNodeName: "Todos os Domínios (L1)",
            fieldsUpdated: ["Objetivo Estratégico", "Proposta de Valor", "Fronteira de Escopo"],
          },
        });
      });
      return;
    }
  };

  // ── Handle File Selection ───────────────────────────────────────────
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const uploaded = Array.from(files).map((f) => ({
      name: f.name,
      size: `${Math.max(12, Math.round(f.size / 1024))} KB`,
      type: f.name.split(".").pop()?.toUpperCase() || "DOC",
    }));

    setPendingAttachments((prev) => [...prev, ...uploaded]);
    e.target.value = "";
  };

  // ── Handle Free-Text / Attachment Submission ────────────────────────
  const handleSendMessage = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputValue.trim() && pendingAttachments.length === 0) return;

    const userText = inputValue.trim();
    const attachedDocs = [...pendingAttachments];
    setInputValue("");
    setPendingAttachments([]);

    appendMessage({
      sender: "user",
      text:
        userText ||
        `Enviei ${attachedDocs.length} documento(s) de referência para estruturar a arquitetura.`,
      attachments: attachedDocs.length > 0 ? attachedDocs : undefined,
    });

    const lower = userText.toLowerCase();

    simulateAIResponse(() => {
      // 1. If user uploaded documents
      if (attachedDocs.length > 0) {
        const docNames = attachedDocs.map((d) => d.name);
        // Check if user specified a domain name in the text
        let extractedTopic: string | undefined;
        const matchQuoted = userText.match(/["“]([^"”]+)["”]/);
        if (matchQuoted) {
          extractedTopic = matchQuoted[1];
        } else if (lower.includes("domínio de ") || lower.includes("dominio de ")) {
          const idx = lower.indexOf("dominio de ") !== -1 ? lower.indexOf("dominio de ") : lower.indexOf("domínio de ");
          extractedTopic = userText.slice(idx + 11).trim();
        }

        const isFullChainRequest =
          lower.includes("cadeia inteira") ||
          lower.includes("cadeia completa") ||
          lower.includes("toda a cadeia");

        executeGenerateDomainFromDocsOrTopic(
          docNames,
          extractedTopic,
          isFullChainRequest ? "full_chain" : "domain"
        );
        return;
      }

      // 2. If user asks to critique / evaluate / benchmark
      if (
        lower.includes("critic") ||
        lower.includes("avali") ||
        lower.includes("julg") ||
        lower.includes("benchmark") ||
        lower.includes("aderente") ||
        lower.includes("melhoria") ||
        lower.includes("analis") ||
        lower.includes("ponto")
      ) {
        // Check if user mentioned a specific domain from l1Processes
        const matchedDomain = l1Processes.find(
          (d) =>
            lower.includes(d.namePT.toLowerCase()) ||
            lower.includes(d.nameEN.toLowerCase())
        );

        if (matchedDomain) {
          executeCritique(
            matchedDomain.id,
            pt ? matchedDomain.namePT : matchedDomain.nameEN,
            lvl("l1"),
            "l1"
          );
        } else {
          executeCritique(
            currentContext.nodeId,
            currentContext.nodeName,
            currentContext.levelName,
            currentContext.levelKey
          );
        }
        return;
      }

      // 3. If user asks to create a new Domain or Macroprocess
      if (
        (lower.includes("cria") ||
          lower.includes("criar") ||
          lower.includes("gere") ||
          lower.includes("gerar") ||
          lower.includes("adicion") ||
          lower.includes("novo")) &&
        (lower.includes("domínio") ||
          lower.includes("dominio") ||
          lower.includes("macroprocesso") ||
          lower.includes("cadeia"))
      ) {
        if (lower.includes("cadeia")) {
          executeGenerateDomainFromDocsOrTopic([], "Referência Setorial Corporativa", "full_chain");
          return;
        }

        // Extract name if provided
        let customName = "Gestão de Operações Digitais & Inteligência";
        const afterDe = userText.match(/(?:dom[ií]nio|macroprocesso)\s+(?:de|para|sobre)\s+(.+)/i);
        if (afterDe && afterDe[1]) {
          customName = afterDe[1].replace(/[.!?]+$/, "").trim();
          customName = customName.charAt(0).toUpperCase() + customName.slice(1);
        }

        if (lower.includes("macroprocesso") && currentContext.levelKey !== "root") {
          executeAddChildToNode(
            currentContext.parentL1Id || currentContext.nodeId,
            currentContext.nodeName,
            "l1",
            customName
          );
        } else {
          executeGenerateDomainFromDocsOrTopic([], customName, "domain");
        }
        return;
      }

      // 4. If user asks to create/edit an Objective, Value Proposition, Inputs/Outputs, KPIs, or Responsible
      if (
        lower.includes("objetivo") ||
        lower.includes("proposta de valor") ||
        lower.includes("escopo") ||
        lower.includes("entrada") ||
        lower.includes("saída") ||
        lower.includes("saida") ||
        lower.includes("indicador") ||
        lower.includes("kpi") ||
        lower.includes("sla") ||
        lower.includes("edita") ||
        lower.includes("altera") ||
        lower.includes("preench") ||
        lower.includes("cria para mim")
      ) {
        const targetNodeId =
          currentContext.levelKey === "root"
            ? l1Processes[0]?.id || "root"
            : currentContext.nodeId;
        const targetNodeName =
          currentContext.levelKey === "root"
            ? (l1Processes[0] ? (pt ? l1Processes[0].namePT : l1Processes[0].nameEN) : "Cadeia de Valor")
            : currentContext.nodeName;

        if (
          lower.includes("entrada") ||
          lower.includes("saída") ||
          lower.includes("saida") ||
          lower.includes("escopo") ||
          lower.includes("fronteira") ||
          lower.includes("stakeholder")
        ) {
          executeFieldEdit(targetNodeId, targetNodeName, "scope_io");
        } else if (
          lower.includes("indicador") ||
          lower.includes("kpi") ||
          lower.includes("sla") ||
          lower.includes("sistema")
        ) {
          executeFieldEdit(targetNodeId, targetNodeName, "kpis_and_systems");
        } else {
          // Objective & Value Proposition (most common: "cria para mim um objetivo")
          const customObj =
            userText.includes(":")
              ? userText.split(":").slice(1).join(":").trim()
              : undefined;
          executeFieldEdit(targetNodeId, targetNodeName, "objective_and_value", customObj);
        }
        return;
      }

      // 5. Default contextual intelligent response offering immediate actions
      appendMessage({
        sender: "ai",
        text: `Entendi seu pedido para **${currentContext.levelName}: "${currentContext.nodeName}"**! Posso executar essa ação imediatamente na arquitetura. Escolha abaixo como deseja aplicar ou detalhe o campo específico:`,
        options: [
          {
            id: `fallback-obj-${Date.now()}`,
            label: `Atualizar Objetivo, Proposta de Valor e Escopo de "${currentContext.nodeName}"`,
            icon: "edit",
            variant: "primary",
            actionType: "APPLY_FIELD_EDIT",
            payload: {
              fieldGroup: "all_benchmark_fixes",
              nodeId:
                currentContext.levelKey === "root"
                  ? l1Processes[0]?.id || "root"
                  : currentContext.nodeId,
              nodeName:
                currentContext.levelKey === "root"
                  ? l1Processes[0]?.namePT || "Domínio Principal"
                  : currentContext.nodeName,
              levelKey: currentContext.levelKey,
            },
          },
          {
            id: `fallback-crit-${Date.now()}`,
            label: `Fazer análise crítica de Benchmark em "${currentContext.nodeName}"`,
            icon: "critique",
            variant: "secondary",
            actionType: "RUN_CRITIQUE",
            payload: {
              scope: currentContext.levelKey,
              targetId: currentContext.nodeId,
              targetName: currentContext.nodeName,
              levelName: currentContext.levelName,
            },
          },
          {
            id: `fallback-gen-${Date.now()}`,
            label: `Criar novo Domínio e Macroprocessos preenchidos`,
            icon: "create",
            variant: "outline",
            actionType: "ASK_UPLOAD_DOCS",
          },
        ],
      });
    }, 550);
  };

  return (
    <>
      {/* ── Hidden File Input for Document Uploads ──────────────────── */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.csv,.bpmn"
        className="hidden"
        onChange={handleFileChange}
      />

      {/* ── 1. BOTÃO FLUTUANTE (canto inferior direito) ─── */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            key="elo-ai-fab"
            type="button"
            onClick={() => setIsOpen(true)}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.15 }}
            aria-label="Abrir Elo IA, assistente da arquitetura"
            title="Elo IA — assistente da arquitetura"
            className="fixed bottom-6 right-6 z-40 inline-flex items-center gap-2.5 h-11 pl-1.5 pr-4 rounded-full bg-white border border-slate-200 text-slate-800 shadow-md hover:shadow-lg hover:border-[#ea580c]/50 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#ea580c]/40 transition-shadow duration-150 cursor-pointer"
          >
            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-[#ea580c] text-white">
              <Sparkles className="h-4 w-4" />
            </span>
            <span className="text-sm font-semibold tracking-tight">Elo IA</span>
          </motion.button>
        )}
      </AnimatePresence>

      {/* ── 2. PAINEL LATERAL DIREITO (docked, sem overlay: a tela principal permanece visível e interativa) ── */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.aside
              key="elo-ai-panel"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              style={{ width: AI_DRAWER_WIDTH }}
              className="fixed inset-y-0 right-0 z-40 max-w-full bg-white border-l border-slate-200 flex flex-col"
              aria-label="Elo IA"
            >
              {/* Cabeçalho */}
              <div className="px-4 pt-4 pb-3 shrink-0 border-b border-slate-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-8 h-8 rounded-lg bg-orange-50 border border-orange-100 text-[#ea580c] flex items-center justify-center shrink-0">
                      <Sparkles className="h-4 w-4" />
                    </div>
                    <div className="min-w-0">
                      <h2 className="text-sm font-semibold text-slate-900 leading-tight">Elo IA</h2>
                      <p className="text-[11px] text-slate-500 leading-tight">Guia de preenchimento da arquitetura</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-0.5">
                    <button
                      onClick={() => setMessages(buildInitialMessages())}
                      className="p-2 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
                      title="Reiniciar conversa"
                      aria-label="Reiniciar conversa"
                    >
                      <RefreshCw className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => setIsOpen(false)}
                      className="p-2 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
                      title="Fechar"
                      aria-label="Fechar Elo IA"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {/* Contexto atual */}
                <div className="mt-3 flex items-center gap-2 text-xs min-w-0">
                  <span className="shrink-0 text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded bg-slate-100 text-slate-600">
                    {currentContext.levelName}
                  </span>
                  <span className="text-slate-700 font-medium truncate">{currentContext.nodeName}</span>
                </div>
              </div>

              {/* 3 principais funções */}
              <div className="px-4 py-3 shrink-0 border-b border-slate-200">
                <span className="block text-[10px] font-semibold uppercase tracking-wider text-slate-400 mb-2">
                  O que posso fazer
                </span>
                <div className="flex flex-col gap-1.5">
                  {[
                    { icon: Wand2, title: "Gerar cadeia de valor", desc: "A partir de documentos ou de benchmark de mercado", onClick: triggerFeatureGenerate },
                    { icon: BarChart3, title: "Criticar cadeia de valor", desc: "Aderência ao mercado, gaps e melhorias", onClick: triggerFeatureCritique },
                    { icon: Pencil, title: "Criar e editar campos", desc: "Preencher o nível atual com o guia da IA", onClick: triggerFeatureGuideEdit },
                  ].map(({ icon: Icon, title, desc, onClick }) => (
                    <button
                      key={title}
                      type="button"
                      onClick={onClick}
                      className="group flex items-center gap-3 px-3 py-2 rounded-lg border border-slate-200 bg-white hover:border-[#ea580c]/50 hover:bg-orange-50/40 text-left transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#ea580c]/30"
                    >
                      <span className="w-7 h-7 rounded-md bg-slate-100 text-slate-600 group-hover:bg-orange-100 group-hover:text-[#ea580c] flex items-center justify-center shrink-0 transition-colors">
                        <Icon className="h-3.5 w-3.5" />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block text-xs font-semibold text-slate-800 leading-tight">{title}</span>
                        <span className="block text-[11px] text-slate-500 leading-tight mt-0.5 truncate">{desc}</span>
                      </span>
                      <ChevronRight className="h-3.5 w-3.5 text-slate-300 group-hover:text-[#ea580c] shrink-0" />
                    </button>
                  ))}
                </div>
              </div>

              {/* ── CHAT MESSAGES FEED ───────────────────────────────── */}
              <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 bg-slate-50">
                {messages.map((msg) => {
                  const isAI = msg.sender === "ai";
                  return (
                    <div
                      key={msg.id}
                      className={cn(
                        "flex items-start gap-2.5",
                        isAI ? "justify-start" : "justify-end"
                      )}
                    >
                      {isAI && (
                        <div className="w-7 h-7 rounded-lg bg-orange-50 border border-orange-100 text-[#ea580c] flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
                          <Bot className="h-4 w-4" />
                        </div>
                      )}

                      <div
                        className={cn(
                          "max-w-[88%] rounded-2xl px-4 py-3 text-xs leading-relaxed shadow-xs",
                          isAI
                            ? "bg-white border border-slate-200 text-slate-700 rounded-tl-sm"
                            : "bg-slate-800 text-white rounded-tr-sm"
                        )}
                      >
                        {/* Attachments inside message */}
                        {msg.attachments && msg.attachments.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 mb-2">
                            {msg.attachments.map((att, idx) => (
                              <div
                                key={idx}
                                className={cn(
                                  "flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-medium",
                                  isAI
                                    ? "bg-slate-100 text-slate-700"
                                    : "bg-white/20 text-white"
                                )}
                              >
                                <FileText className="h-3.5 w-3.5 shrink-0" />
                                <span className="truncate max-w-[180px]">
                                  {att.name}
                                </span>
                                <span className="opacity-75 text-[10px]">
                                  ({att.size})
                                </span>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Formatted Text */}
                        <div className="whitespace-pre-line">
                          {msg.text.split("**").map((part, index) =>
                            index % 2 === 1 ? (
                              <strong
                                key={index}
                                className={
                                  isAI ? "font-bold text-slate-900" : "font-bold text-white"
                                }
                              >
                                {part}
                              </strong>
                            ) : (
                              <span key={index}>{part}</span>
                            )
                          )}
                        </div>

                        {/* Interactive Upload Box inside Chat (Feature 1 Document Flow) */}
                        {msg.showUploadBox && (
                          <div className="mt-3 p-3.5 rounded-xl border-2 border-dashed border-orange-200 bg-orange-50/40">
                            <div className="flex flex-col items-center text-center">
                              <div className="w-9 h-9 rounded-full bg-orange-100 text-[#ea580c] flex items-center justify-center mb-2">
                                <Upload className="h-4 w-4" />
                              </div>
                              <p className="text-xs font-bold text-slate-800">
                                Selecione documentos do seu computador
                              </p>
                              <p className="text-[11px] text-slate-500 mt-0.5 mb-3">
                                PDF, Word, Excel, BPMN ou Normativos para extrair Domínios e Macroprocessos
                              </p>
                              <Button
                                type="button"
                                size="sm"
                                onClick={() => fileInputRef.current?.click()}
                                className="bg-[#ea580c] hover:bg-[#c2410c] text-white text-xs h-8 px-3.5 w-full mb-2.5"
                              >
                                <Paperclip className="h-3.5 w-3.5 mr-1.5" />
                                Escolher arquivos do computador...
                              </Button>

                              {/* Quick Sample Documents for instant 1-click testing */}
                              <div className="w-full pt-2.5 border-t border-orange-200/60 text-left">
                                <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                                  Ou teste agora com um documento de exemplo:
                                </span>
                                <div className="flex flex-col gap-1.5">
                                  <button
                                    type="button"
                                    onClick={() => {
                                      appendMessage({
                                        sender: "user",
                                        text: "Gerar Domínio e Macroprocessos preenchidos com base neste documento",
                                        attachments: [
                                          {
                                            name: "Planejamento_Estrategico_e_Processos_2026.pdf",
                                            size: "1.4 MB",
                                            type: "PDF",
                                          },
                                        ],
                                      });
                                      simulateAIResponse(() => {
                                        executeGenerateDomainFromDocsOrTopic(
                                          ["Planejamento_Estrategico_e_Processos_2026.pdf"],
                                          "Governança de Dados, IA e Excelência Operacional",
                                          "domain"
                                        );
                                      });
                                    }}
                                    className="flex items-center justify-between px-2.5 py-1.5 rounded-lg bg-white border border-slate-200 hover:border-[#ea580c] text-[11px] font-medium text-slate-700 hover:text-[#ea580c] transition-colors cursor-pointer"
                                  >
                                    <span className="flex items-center gap-1.5 truncate">
                                      <FileText className="h-3.5 w-3.5 text-[#ea580c] shrink-0" />
                                      <span className="truncate">
                                        Planejamento_Estrategico_2026.pdf (Gerar Domínio + L2)
                                      </span>
                                    </span>
                                    <ArrowRight className="h-3 w-3 shrink-0 ml-1" />
                                  </button>

                                  <button
                                    type="button"
                                    onClick={() => {
                                      appendMessage({
                                        sender: "user",
                                        text: "Gerar Cadeia de Valor completa com base no Manual Organizacional",
                                        attachments: [
                                          {
                                            name: "Manual_Arquitetura_Cadeia_de_Valor.docx",
                                            size: "890 KB",
                                            type: "DOCX",
                                          },
                                        ],
                                      });
                                      simulateAIResponse(() => {
                                        executeGenerateDomainFromDocsOrTopic(
                                          ["Manual_Arquitetura_Cadeia_de_Valor.docx"],
                                          "Manual Corporativo",
                                          "full_chain"
                                        );
                                      });
                                    }}
                                    className="flex items-center justify-between px-2.5 py-1.5 rounded-lg bg-white border border-slate-200 hover:border-[#ea580c] text-[11px] font-medium text-slate-700 hover:text-[#ea580c] transition-colors cursor-pointer"
                                  >
                                    <span className="flex items-center gap-1.5 truncate">
                                      <FileText className="h-3.5 w-3.5 text-blue-600 shrink-0" />
                                      <span className="truncate">
                                        Manual_Arquitetura_Cadeia.docx (Gerar Cadeia Completa)
                                      </span>
                                    </span>
                                    <ArrowRight className="h-3 w-3 shrink-0 ml-1" />
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Analytical Critique Scorecard (Feature 2) */}
                        {msg.critiqueCard && (
                          <div className="mt-3 rounded-xl border border-slate-200 bg-slate-50/70 overflow-hidden">
                            {/* Header with Score */}
                            <div className="bg-slate-900 text-white px-3.5 py-3 flex items-center justify-between">
                              <div>
                                <span className="text-[10px] font-bold uppercase tracking-wider text-orange-400 block">
                                  Diagnóstico de Benchmark · {msg.critiqueCard.targetLevel}
                                </span>
                                <h4 className="text-xs font-bold text-white truncate max-w-[230px]">
                                  {msg.critiqueCard.targetName}
                                </h4>
                                <span className="text-[10px] text-slate-400">
                                  Ref: {msg.critiqueCard.benchmarkRef}
                                </span>
                              </div>
                              <div className="flex flex-col items-end">
                                <div className="flex items-baseline gap-0.5 bg-orange-500/20 border border-orange-400/40 px-2.5 py-1 rounded-lg">
                                  <span className="text-lg font-extrabold text-orange-400">
                                    {msg.critiqueCard.overallScore}
                                  </span>
                                  <span className="text-[10px] text-orange-200">/100</span>
                                </div>
                                <span className="text-[9px] text-slate-300 mt-0.5">
                                  Aderência ao Mercado
                                </span>
                              </div>
                            </div>

                            {/* Dimensions Bars */}
                            <div className="p-3 space-y-2 border-b border-slate-200 bg-white">
                              {msg.critiqueCard.dimensions.map((dim, i) => (
                                <div key={i}>
                                  <div className="flex justify-between text-[11px] mb-0.5">
                                    <span className="font-medium text-slate-700">
                                      {dim.name}
                                    </span>
                                    <span
                                      className={cn(
                                        "font-bold",
                                        dim.status === "otimo"
                                          ? "text-emerald-600"
                                          : dim.status === "atencao"
                                          ? "text-amber-600"
                                          : "text-red-600"
                                      )}
                                    >
                                      {dim.score}%
                                    </span>
                                  </div>
                                  <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                    <div
                                      className={cn(
                                        "h-full rounded-full",
                                        dim.status === "otimo"
                                          ? "bg-emerald-500"
                                          : dim.status === "atencao"
                                          ? "bg-amber-500"
                                          : "bg-red-500"
                                      )}
                                      style={{ width: `${dim.score}%` }}
                                    />
                                  </div>
                                </div>
                              ))}
                            </div>

                            {/* Strengths */}
                            <div className="p-3 border-b border-slate-200 bg-emerald-50/30">
                              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 flex items-center gap-1 mb-1.5">
                                <CheckCircle2 className="h-3.5 w-3.5" />
                                Pontos Fortes e Aderência
                              </span>
                              <ul className="space-y-1">
                                {msg.critiqueCard.strengths.map((s, i) => (
                                  <li
                                    key={i}
                                    className="text-[11px] text-slate-700 flex items-start gap-1.5"
                                  >
                                    <span className="text-emerald-600 font-bold">•</span>
                                    <span>{s}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>

                            {/* Gaps / Points to Improve */}
                            <div className="p-3 border-b border-slate-200 bg-amber-50/40">
                              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800 flex items-center gap-1 mb-1.5">
                                <AlertTriangle className="h-3.5 w-3.5 text-amber-600" />
                                Gaps em Relação ao Benchmark
                              </span>
                              <ul className="space-y-1">
                                {msg.critiqueCard.gaps.map((g, i) => (
                                  <li
                                    key={i}
                                    className="text-[11px] text-slate-700 flex items-start gap-1.5"
                                  >
                                    <span className="text-amber-600 font-bold">•</span>
                                    <span>{g}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>

                            {/* Recommendations */}
                            <div className="p-3 bg-white">
                              <span className="text-[10px] font-bold uppercase tracking-wider text-[#ea580c] flex items-center gap-1 mb-1.5">
                                <TrendingUp className="h-3.5 w-3.5" />
                                Ajustes Recomendados pela IA
                              </span>
                              <ul className="space-y-1">
                                {msg.critiqueCard.recommendations.map((r, i) => (
                                  <li
                                    key={i}
                                    className="text-[11px] text-slate-700 flex items-start gap-1.5"
                                  >
                                    <span className="text-[#ea580c] font-bold">
                                      {i + 1}.
                                    </span>
                                    <span>{r}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        )}

                        {/* Applied Change Confirmation Card */}
                        {msg.appliedChange && (
                          <div className="mt-3 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-slate-800">
                            <div className="flex items-center gap-2 mb-1.5">
                              <div className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0">
                                <Check className="h-3 w-3" />
                              </div>
                              <span className="text-xs font-bold text-emerald-900">
                                {msg.appliedChange.title}
                              </span>
                            </div>
                            <div className="flex flex-wrap gap-1 mt-1.5">
                              {msg.appliedChange.fieldsUpdated.map((f, idx) => (
                                <span
                                  key={idx}
                                  className="text-[10px] font-semibold bg-white border border-emerald-200 text-emerald-800 px-2 py-0.5 rounded-md"
                                >
                                  {f}
                                </span>
                              ))}
                            </div>
                            {msg.appliedChange.navigateParams && (
                              <Button
                                type="button"
                                size="sm"
                                onClick={() =>
                                  navigateToArchitectureNode(
                                    msg.appliedChange!.navigateParams!
                                  )
                                }
                                className="mt-2.5 w-full h-8 text-xs bg-emerald-700 hover:bg-emerald-800 text-white"
                              >
                                Abrir "{msg.appliedChange.targetNodeName}" na tela
                                <ArrowRight className="h-3.5 w-3.5 ml-1.5" />
                              </Button>
                            )}
                          </div>
                        )}

                        {/* Quick Action Option Buttons */}
                        {msg.options && msg.options.length > 0 && (
                          <div className="mt-3 flex flex-col gap-1.5">
                            {msg.options.map((opt) => {
                              const isApplied = appliedActionIds[opt.id];
                              return (
                                <button
                                  key={opt.id}
                                  onClick={() => handleOptionClick(opt)}
                                  className={cn(
                                    "w-full text-left px-3 py-2.5 rounded-xl border transition-all flex items-start justify-between gap-2 cursor-pointer",
                                    opt.variant === "primary"
                                      ? "bg-orange-50/80 border-orange-300 hover:bg-orange-100/70 text-slate-900"
                                      : opt.variant === "secondary"
                                      ? "bg-slate-50 border-slate-200 hover:border-orange-300 hover:bg-orange-50/30 text-slate-800"
                                      : "bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-700"
                                  )}
                                >
                                  <div className="min-w-0 flex-1">
                                    <div className="text-xs font-semibold leading-snug flex items-center gap-1.5">
                                      <span>{opt.label}</span>
                                      {isApplied && (
                                        <span className="text-[9px] font-bold bg-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded">
                                          Aplicado
                                        </span>
                                      )}
                                    </div>
                                    {opt.description && (
                                      <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">
                                        {opt.description}
                                      </p>
                                    )}
                                  </div>
                                  <ChevronRight className="h-4 w-4 text-slate-400 shrink-0 mt-0.5" />
                                </button>
                              );
                            })}
                          </div>
                        )}

                        <span
                          className={cn(
                            "block text-[10px] mt-1.5 text-right",
                            isAI ? "text-slate-400" : "text-slate-300"
                          )}
                        >
                          {msg.timestamp}
                        </span>
                      </div>

                      {!isAI && (
                        <div className="w-7 h-7 rounded-lg bg-slate-800 text-white flex items-center justify-center shrink-0 mt-0.5">
                          <User className="h-3.5 w-3.5" />
                        </div>
                      )}
                    </div>
                  );
                })}

                {/* Typing Indicator */}
                {isTyping && (
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-orange-50 border border-orange-100 text-[#ea580c] flex items-center justify-center shrink-0">
                      <Bot className="h-4 w-4" />
                    </div>
                    <div className="bg-white border border-slate-200 rounded-2xl px-4 py-2.5 flex items-center gap-1.5 shadow-2xs">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#ea580c] animate-bounce" />
                      <span className="w-1.5 h-1.5 rounded-full bg-[#ea580c] animate-bounce [animation-delay:150ms]" />
                      <span className="w-1.5 h-1.5 rounded-full bg-[#ea580c] animate-bounce [animation-delay:300ms]" />
                      <span className="text-[11px] text-slate-500 ml-1">
                        Elo IA está analisando a arquitetura...
                      </span>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* ── CONTEXTUAL QUICK PROMPTS ABOVE INPUT ─────────────── */}
              <div className="bg-white border-t border-slate-100 px-4 py-2 flex items-center gap-1.5 overflow-x-auto no-scrollbar shrink-0">
                <button
                  type="button"
                  onClick={() => {
                    setInputValue(
                      `Cria para mim um objetivo e proposta de valor para ${currentContext.nodeName}`
                    );
                  }}
                  className="shrink-0 text-[11px] font-medium px-2.5 py-1 rounded-full bg-orange-50 text-[#ea580c] border border-orange-200 hover:bg-orange-100 transition-colors cursor-pointer"
                >
                  "Cria para mim um objetivo..."
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setInputValue(
                      `Critique ${currentContext.nodeName} em relação a benchmark de mercado`
                    );
                  }}
                  className="shrink-0 text-[11px] font-medium px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors cursor-pointer"
                >
                  "Está aderente ao benchmark?"
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setInputValue(
                      `Preencha entradas, saídas e indicadores de ${currentContext.nodeName}`
                    );
                  }}
                  className="shrink-0 text-[11px] font-medium px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors cursor-pointer"
                >
                  "Preencher entradas, saídas e KPIs"
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setInputValue(
                      "Crie um domínio de Transformação Digital com macroprocessos preenchidos"
                    );
                  }}
                  className="shrink-0 text-[11px] font-medium px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors cursor-pointer"
                >
                  "Criar domínio + macroprocessos"
                </button>
              </div>

              {/* ── PENDING ATTACHMENTS BAR ──────────────────────────── */}
              {pendingAttachments.length > 0 && (
                <div className="px-4 py-2 bg-orange-50/70 border-t border-orange-200 flex items-center justify-between gap-2 shrink-0">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {pendingAttachments.map((att, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center gap-1.5 bg-white border border-orange-200 text-slate-700 px-2.5 py-1 rounded-lg text-[11px] font-medium shadow-2xs"
                      >
                        <FileText className="h-3 w-3 text-[#ea580c]" />
                        <span className="truncate max-w-[160px]">{att.name}</span>
                        <button
                          type="button"
                          onClick={() =>
                            setPendingAttachments((prev) =>
                              prev.filter((_, i) => i !== idx)
                            )
                          }
                          className="text-slate-400 hover:text-red-500"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* ── CHAT INPUT FOOTER ────────────────────────────────── */}
              <form
                onSubmit={handleSendMessage}
                className="p-3.5 bg-white border-t border-slate-200 flex items-end gap-2 shrink-0"
              >
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-10 h-10 rounded-xl border border-slate-200 text-slate-500 hover:text-[#ea580c] hover:border-orange-200 hover:bg-orange-50/40 flex items-center justify-center shrink-0 transition-colors cursor-pointer"
                  title="Subir documentos de referência (PDF, Word, Excel, BPMN)"
                >
                  <Paperclip className="h-4 w-4" />
                </button>

                <div className="flex-1 relative">
                  <textarea
                    rows={1}
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage();
                      }
                    }}
                    placeholder={
                      pt
                        ? `Peça para criar domínios, editar "${currentContext.nodeName}" ou criticar...`
                        : "Ask Elo AI to generate, critique, or edit..."
                    }
                    className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50 focus:bg-white px-3.5 py-2.5 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#ea580c]/25 focus:border-[#ea580c] max-h-28"
                  />
                </div>

                <Button
                  type="submit"
                  disabled={!inputValue.trim() && pendingAttachments.length === 0}
                  className="h-10 w-10 rounded-xl bg-[#ea580c] hover:bg-[#c2410c] text-white p-0 shrink-0 shadow-sm disabled:opacity-40"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </form>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
