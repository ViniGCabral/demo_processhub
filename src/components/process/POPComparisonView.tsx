import { useState, useMemo } from "react";
import {
  Sparkles,
  Building2,
  User,
  CheckCircle2,
  ArrowRight,
  Layers,
  Server,
  ShieldCheck,
  SlidersHorizontal,
  Play,
  FileInput,
  Cog,
  FileOutput,
  Users,
  Plus,
  Loader2,
  Check,
  AlertCircle,
  Scale,
  Calculator,
  Workflow,
  Lock,
  ExternalLink,
  Download,
  GitMerge,
  CheckCheck,
  Filter,
  Map as MapIcon,
  ChevronDown,
  ArrowUp,
  MousePointerClick,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { useLanguage } from "@/contexts/LanguageContext";
import { useToast } from "@/hooks/use-toast";
import {
  useSopVariantsStore,
  type SOPVariant,
} from "@/stores/sopVariantsStore";
import { cn } from "@/lib/utils";

interface POPComparisonViewProps {
  processId: string;
  processName?: string;
  processArea?: string;
  defaultBusinessUnit?: string;
  onSwitchToAsIsVariant: (variantId: string) => void;
  onOpenAddVariantModal: () => void;
}

interface FrameworkDimensionRow {
  id: string;
  label: string;
  sublabel?: string;
  icon?: React.ComponentType<{ className?: string }>;
  isEqualAcrossVariants: boolean;
  convergenceNote: string;
  getVariantContent: (variant: SOPVariant, index: number) => {
    headline: string;
    detail: string;
    tag?: string;
    isDivergentFromBase?: boolean;
  };
  benchmarkContent: {
    headline: string;
    detail: string;
    tag: string;
  };
}

interface FrameworkMacroBlock {
  id: "trigger" | "inputs" | "execution" | "outputs" | "downstream";
  stepNumber: string;
  title: string;
  subtitle: string;
  icon: React.ComponentType<{ className?: string }>;
  overallStatus: "equal" | "partial" | "divergent";
  statusLabel: string;
  summary: string;
  dimensions: FrameworkDimensionRow[];
}

export function POPComparisonView({
  processId,
  processName = "Processo",
  processArea = "Operações",
  defaultBusinessUnit,
  onSwitchToAsIsVariant,
  onOpenAddVariantModal,
}: POPComparisonViewProps) {
  const { language } = useLanguage();
  const isEN = language === "EN";

  const {
    getVariantsForProcess,
    isBenchmarkEnabled,
    setBenchmarkEnabled,
    seedComparisonDemoVariants,
  } = useSopVariantsStore();

  const variants = useMemo(() => {
    return getVariantsForProcess(processId, processName, defaultBusinessUnit) || [];
  }, [getVariantsForProcess, processId, processName, defaultBusinessUnit]);

  const benchmarkEnabledByProcess = useSopVariantsStore((s) => s.benchmarkEnabledByProcess);
  const benchmarkEnabled = benchmarkEnabledByProcess?.[processId] ?? true;

  // Selected variant IDs for comparison
  const [selectedVariantIds, setSelectedVariantIds] = useState<string[]>(() =>
    variants.map((v) => v.id)
  );

  const { toast } = useToast();

  // Whether the user has triggered the AI comparison generation
  const [hasGeneratedComparison, setHasGeneratedComparison] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeBlockFilter, setActiveBlockFilter] = useState<string>("all");
  const [onlyDivergences, setOnlyDivergences] = useState(false);

  // Keep selectedVariantIds synced if new variants are added
  const validSelectedIds = useMemo(() => {
    const valid = selectedVariantIds.filter((id) =>
      variants.some((v) => v.id === id)
    );
    if (valid.length === 0 && variants.length > 0) {
      return variants.map((v) => v.id);
    }
    return valid;
  }, [selectedVariantIds, variants]);

  const comparedVariants = useMemo(
    () => variants.filter((v) => validSelectedIds.includes(v.id)),
    [variants, validSelectedIds]
  );

  const toggleVariantSelection = (id: string) => {
    setSelectedVariantIds((prev) => {
      const current = prev.filter((item) => variants.some((v) => v.id === item));
      if (current.includes(id)) {
        if (current.length <= 2) return current; // Keep at least 2 selected when possible
        return current.filter((item) => item !== id);
      }
      return [...current, id];
    });
  };

  const handleSeedDemoVariants = () => {
    seedComparisonDemoVariants(
      processId,
      processName,
      processArea,
      defaultBusinessUnit
    );
    const updated = useSopVariantsStore
      .getState()
      .getVariantsForProcess(processId, processName, defaultBusinessUnit);
    setSelectedVariantIds(updated.map((v) => v.id));
  };

  const handleTriggerComparison = () => {
    if (comparedVariants.length < 2) return;
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      setHasGeneratedComparison(true);
    }, 950);
  };

  // Standardization Score (0-100%)
  const standardizationScore = useMemo(() => {
    if (comparedVariants.length <= 1) return 100;
    const baseScore = 64;
    const penaltyPerExtra = (comparedVariants.length - 2) * 5;
    return Math.max(42, Math.min(88, baseScore - penaltyPerExtra));
  }, [comparedVariants.length]);

  // Build the 5 Sequential Macro Blocks of the Process Framework
  const macroBlocks: FrameworkMacroBlock[] = useMemo(() => {
    return [
      {
        id: "trigger",
        stepNumber: "01",
        title: isEN ? "Start Trigger" : "Gatilho de Início",
        subtitle: isEN
          ? "Event that initiates the process and channel of origin"
          : "Evento gerador do processo e canal de acionamento inicial",
        icon: Play,
        overallStatus: "divergent",
        statusLabel: isEN ? "Divergent across POPs" : "Divergente entre POPs",
        summary: isEN
          ? "The business motivation is the same (receipt of fiscal document/request), but the entry trigger varies between automated portal ingestion, shared inbox monitoring, and manual filing."
          : "O fato gerador de negócio é o mesmo (recebimento da solicitação/documento fiscal), porém a forma de acionamento varia entre captura via portal/mensageria e triagem manual de caixa de e-mail.",
        dimensions: [
          {
            id: "trigger-event",
            label: isEN ? "Initiating Event & Reception Channel" : "Evento Inicial e Canal de Acionamento",
            sublabel: isEN ? "How the demand arrives to the executor" : "Como a demanda chega para início do procedimento",
            isEqualAcrossVariants: false,
            convergenceNote: isEN
              ? "Diverges in reception channel and trigger automation"
              : "Diverge no canal de entrada e no nível de automação do disparo",
            getVariantContent: (v, idx) => {
              const step1 = v.sopData?.steps?.[0];
              const sys = step1?.system || (step1 as any)?.systems?.[0] || "Portal / E-mail";
              if (idx === 0) {
                return {
                  headline: "Recebimento via Monitor Fiscal / Portal EDI",
                  detail: `Disparo automático na fila de trabalho (${sys}) assim que o XML/documento é recepcionado, com leitura diária da fila pelo analista.`,
                  tag: "Fila Sistêmica",
                  isDivergentFromBase: false,
                };
              }
              if (idx === 1) {
                return {
                  headline: "Triagem Manual de Caixa de E-mail Compartilhada",
                  detail: `Início depende de verificação periódica de e-mails e download manual de anexos PDF antes do cadastro no sistema (${sys}).`,
                  tag: "Acionamento Manual",
                  isDivergentFromBase: true,
                };
              }
              return {
                headline: "Abertura via Formulário / Chamado Local",
                detail: `Solicitante abre requisição manual anexando documentação comprobatória para fila regional (${sys}).`,
                tag: "Requisição Local",
                isDivergentFromBase: true,
              };
            },
            benchmarkContent: {
              headline: "Ingestão Omnichannel Event-Driven (Webhook / API)",
              detail:
                "Captura centralizada e automática via API/EDI e OCR sem intervenção humana na triagem, instanciando a ordem de serviço automaticamente.",
              tag: "Zero-Touch Trigger",
            },
          },
        ],
      },
      {
        id: "inputs",
        stepNumber: "02",
        title: isEN ? "Inputs" : "Inputs (Entradas)",
        subtitle: isEN
          ? "Mandatory data, documents, and prerequisites"
          : "Insumos, documentos obrigatórios e pré-requisitos de entrada",
        icon: FileInput,
        overallStatus: "partial",
        statusLabel: isEN ? "Partially Convergent" : "Parcialmente Igual",
        summary: isEN
          ? "Mandatory fiscal and contractual data are identical across all POPs, while file formats and auxiliary control spreadsheets differ."
          : "Os dados obrigatórios de negócio (CNPJ, Pedido de Compra, Nota Fiscal) são iguais em todos os POPs, mas o formato do insumo e o uso de planilhas auxiliares divergem.",
        dimensions: [
          {
            id: "inputs-core",
            label: isEN ? "Mandatory Business Data" : "Dados Obrigatórios de Negócio",
            sublabel: isEN ? "Core information required to execute" : "Informações essenciais exigidas para processar",
            isEqualAcrossVariants: true,
            convergenceNote: isEN
              ? "Equal across all compared POPs"
              : "Igual em todos os POPs comparados",
            getVariantContent: () => ({
              headline: "Mesma base documental exigida",
              detail:
                "Nota Fiscal / Fatura comercial, número do Pedido de Compra (PO), identificação do fornecedor/parceiro e centro de custo.",
              tag: "Igual",
              isDivergentFromBase: false,
            }),
            benchmarkContent: {
              headline: "Payload Padronizado com Validação de Schema na Entrada",
              detail:
                "Rejeição automática na borda caso falte número de PO ou dados fiscais estruturados antes de alocar fila humana.",
              tag: "Schema Validation",
            },
          },
          {
            id: "inputs-format",
            label: isEN ? "Input Format & Auxiliary Sources" : "Formato dos Insumos e Fontes Auxiliares",
            sublabel: isEN ? "Structured vs unstructured inputs" : "Estruturação dos arquivos e controles paralelos",
            isEqualAcrossVariants: false,
            convergenceNote: isEN
              ? "Diverges between structured XML and unstructured PDF/Spreadsheets"
              : "Diverge entre arquivo estruturado (XML) e PDF / planilhas locais",
            getVariantContent: (v, idx) => {
              if (idx === 0) {
                return {
                  headline: "XML Estruturado + Base de Pedidos no ERP",
                  detail:
                    "Insumos lidos diretamente da base transacional e repositório eletrônico, sem necessidade de redigitação de itens.",
                  tag: "Estruturado",
                  isDivergentFromBase: false,
                };
              }
              if (idx === 1) {
                return {
                  headline: "PDF Digitalizado + Planilha Auxiliar de De-Para",
                  detail:
                    "Exige consulta a planilha local em rede/Excel para converter códigos de serviço e alíquotas antes do lançamento.",
                  tag: "Planilha Paralela",
                  isDivergentFromBase: true,
                };
              }
              return {
                headline: "Fatura Comercial Internacional (Invoice) + Tabela Câmbio",
                detail:
                  "Recebe documento em layout livre e consulta tabela externa de cotação cambial e impostos retidos.",
                tag: "Layout Livre",
                isDivergentFromBase: true,
              };
            },
            benchmarkContent: {
              headline: "100% Digital Estruturado + MDM Centralizado",
              detail:
                "Eliminação de planilhas de de-para locais através de catálogo mestre (Master Data) integrado ao motor de entrada.",
              tag: "Single Source of Truth",
            },
          },
        ],
      },
      {
        id: "execution",
        stepNumber: "03",
        title: isEN ? "Execution" : "Execução",
        subtitle: isEN
          ? "Operational flow, Business Rules, and Calculations & Criteria"
          : "Etapas operacionais, Regras de Negócio e Cálculos & Critérios",
        icon: Cog,
        overallStatus: "divergent",
        statusLabel: isEN ? "Critical Divergences" : "Principais Divergências",
        summary: isEN
          ? "Core operational divergences are concentrated here: operational step sequence, tolerance business rules, and tax/financial calculation criteria."
          : "Concentra as principais diferenças operacionais entre os procedimentos: forma de conferência das etapas, regras de negócio aplicadas e memória de cálculo/critérios.",
        dimensions: [
          {
            id: "exec-flow",
            label: isEN ? "Operational Flow & Step Sequence" : "Fluxo de Execução e Sequência de Etapas",
            sublabel: isEN ? "How steps are executed day-to-day" : "Encadeamento das atividades e conciliação",
            icon: Workflow,
            isEqualAcrossVariants: false,
            convergenceNote: isEN
              ? "Diverges in step sequence and manual verification effort"
              : "Diverge na sequência de conferência e nível de intervenção manual",
            getVariantContent: (v, idx) => {
              const stepCount = v.sopData?.steps?.length || 0;
              if (idx === 0) {
                return {
                  headline: `Conferência Assistida no ERP (${stepCount} etapas mapeadas)`,
                  detail:
                    "Realiza batimento entre Ordem de Compra, Recebimento Físico e Nota Fiscal dentro do próprio ERP, atuando manualmente apenas quando há bloqueio.",
                  tag: "Fluxo Padrão",
                  isDivergentFromBase: false,
                };
              }
              if (idx === 1) {
                return {
                  headline: `Conferência Visual Item a Item (${stepCount} etapas mapeadas)`,
                  detail:
                    "Executor confere manualmente linha a linha da nota contra o pedido em duas telas abertas antes de registrar o pré-documento.",
                  tag: "Dupla Digitação",
                  isDivergentFromBase: true,
                };
              }
              return {
                headline: `Fluxo com Etapa Adicional de Validação Fiscal Local (${stepCount} etapas)`,
                detail:
                  "Inclui etapa intermediária de revisão cadastral e classificação manual de natureza de operação antes da contabilização.",
                tag: "Etapa Extra",
                isDivergentFromBase: true,
              };
            },
            benchmarkContent: {
              headline: "3-Way Match Automatizado (Touchless Processing)",
              detail:
                "Conciliação automática de Pedido x Recebimento x Fatura; o analista atua exclusivamente na fila de exceções reais (>85% straight-through).",
              tag: "Touchless Execution",
            },
          },
          {
            id: "exec-business-rules",
            label: isEN ? "Business Rules" : "Regras de Negócio",
            sublabel: isEN
              ? "Exception handling, blocking rules, and operational conditions"
              : "Critérios de bloqueio, tratamento de divergências e exceções",
            icon: Scale,
            isEqualAcrossVariants: false,
            convergenceNote: isEN
              ? "Diverges in exception handling and blocking rules"
              : "Diverge no tratamento de divergências de preço/quantidade e bloqueio",
            getVariantContent: (v, idx) => {
              if (idx === 0) {
                return {
                  headline: "Bloqueio Sistêmico Automático + Workflow para Compras",
                  detail:
                    "Qualquer divergência fora da margem parametrizada bloqueia o título no ERP e aciona automaticamente o comprador responsável para ajuste do PO.",
                  tag: "Regra Sistêmica",
                  isDivergentFromBase: false,
                };
              }
              if (idx === 1) {
                return {
                  headline: "Tratativa Informal por E-mail / Mensagem antes do Registro",
                  detail:
                    "Documentos com divergência ficam represados na caixa do executor aguardando retorno por e-mail do solicitante, sem registro de SLA no sistema.",
                  tag: "Sem Rastreabilidade",
                  isDivergentFromBase: true,
                };
              }
              return {
                headline: "Estorno e Devolução Imediata ao Fornecedor",
                detail:
                  "Regra local determina recusa integral do documento em qualquer divergência cadastral ou de valor, exigindo reemissão.",
                tag: "Recusa Integral",
                isDivergentFromBase: true,
              };
            },
            benchmarkContent: {
              headline: "Motor de Regras Centralizado (BRMS) com Resolução Assistida",
              detail:
                "Regras de negócio unificadas com roteamento inteligente de disputas e aplicação automática de carta de correção/ajuste quando elegível.",
              tag: "Motor BRMS",
            },
          },
          {
            id: "exec-calculations",
            label: isEN ? "Calculations & Quantitative Criteria" : "Cálculos e Critérios",
            sublabel: isEN
              ? "Formulas, tax withholdings, tolerances, and financial criteria"
              : "Fórmulas, retenções de impostos, faixas de tolerância e rateios",
            icon: Calculator,
            isEqualAcrossVariants: false,
            convergenceNote: isEN
              ? "Diverges in tolerance thresholds and tax calculation method"
              : "Diverge nas faixas de tolerância financeira e apuração de retenções",
            getVariantContent: (v, idx) => {
              if (idx === 0) {
                return {
                  headline: "Tolerância Parametrizada (Até 2% ou R$ 100) + Impostos via Motor Fiscal",
                  detail:
                    "Cálculo de retenções (IRRF, CSRF, ISS, INSS) derivado automaticamente da matriz tributária do cadastro do item e fornecedor.",
                  tag: "Cálculo Automático",
                  isDivergentFromBase: false,
                };
              }
              if (idx === 1) {
                return {
                  headline: "Tolerância Zero + Cálculo Manual de Retenção em Planilha",
                  detail:
                    "Executor calcula base de retenção e alíquotas manualmente em planilha de apoio e edita os campos de imposto na tela de lançamento.",
                  tag: "Cálculo Manual (Risco Fiscal)",
                  isDivergentFromBase: true,
                };
              }
              return {
                headline: "Tolerância de 5% + Conversão Cambial PTAX Fechamento D-1",
                detail:
                  "Aplica critério regional de variação cambial e gross-up de impostos sobre remessas conforme parametrização local.",
                tag: "Critério Regional",
                isDivergentFromBase: true,
              };
            },
            benchmarkContent: {
              headline: "Tax Engine Integrado + Tolerância Dinâmica por Risco/Categoria",
              detail:
                "Zero edição manual de alíquotas; motor fiscal atualiza regras tributárias em tempo real e aplica tolerância estatística parametrizada.",
              tag: "100% Precisão Fiscal",
            },
          },
        ],
      },
      {
        id: "outputs",
        stepNumber: "04",
        title: isEN ? "Outputs" : "Outputs (Saídas)",
        subtitle: isEN
          ? "Deliverables, accounting postings, and generated records"
          : "Entregas geradas, lançamentos contábeis/financeiros e artefatos finais",
        icon: FileOutput,
        overallStatus: "partial",
        statusLabel: isEN ? "Same Core Output, Different Artifacts" : "Entrega Core Igual, Registro Diferente",
        summary: isEN
          ? "All POPs generate the posted accounting/financial document ready for payment, but differ in how supporting evidence is archived."
          : "Todos os POPs resultam no título escriturado e liberado para programação financeira, mas divergem na geração de comprovantes e arquivamento de evidências.",
        dimensions: [
          {
            id: "outputs-main",
            label: isEN ? "Primary Process Output" : "Entrega Principal do Processo",
            sublabel: isEN ? "Final accounting and financial posting" : "Resultado transacional gerado ao final da execução",
            isEqualAcrossVariants: true,
            convergenceNote: isEN
              ? "Equal transactional output across all POPs"
              : "Igual em todos os POPs (Documento escriturado e título financeiro gerado)",
            getVariantContent: () => ({
              headline: "Documento Escriturado + Título liberado no Contas a Pagar",
              detail:
                "Lançamento contábil e fiscal efetivado com partida em aberto agendada para a data de vencimento.",
              tag: "Igual",
              isDivergentFromBase: false,
            }),
            benchmarkContent: {
              headline: "Lançamento Contábil Instantâneo + Trilha de Auditoria Imutável",
              detail:
                "Geração simultânea do lançamento contábil, fiscal e financeiro com hash de auditoria completo.",
              tag: "Real-Time Posting",
            },
          },
          {
            id: "outputs-evidence",
            label: isEN ? "Evidence Archiving & Notifications" : "Arquivamento de Evidências e Comunicação",
            sublabel: isEN ? "How supporting docs are stored" : "Guarda documental e aviso de conclusão",
            isEqualAcrossVariants: false,
            convergenceNote: isEN
              ? "Diverges between DMS indexing and local network folders"
              : "Diverge entre indexação automática no GED e salvamento em pasta de rede",
            getVariantContent: (v, idx) => {
              if (idx === 0) {
                return {
                  headline: "Anexo Indexado Diretamente no Registro do ERP",
                  detail:
                    "XML e espelho da nota ficam vinculados ao número do documento contábil para consulta direta.",
                  tag: "Vinculado ao ERP",
                  isDivergentFromBase: false,
                };
              }
              if (idx === 1) {
                return {
                  headline: "Salvamento Manual de PDF em Diretório de Rede / SharePoint",
                  detail:
                    "Executor renomeia o arquivo PDF manualmente e salva em pasta do mês, atualizando planilha de controle.",
                  tag: "Arquivo Manual",
                  isDivergentFromBase: true,
                };
              }
              return {
                headline: "Dossiê Digital Consolidado para Fechamento Mensal",
                detail:
                  "Gera pacote com fatura, comprovante de aprovação e memória cambial em repositório documental da unidade.",
                tag: "Dossiê Regional",
                isDivergentFromBase: true,
              };
            },
            benchmarkContent: {
              headline: "Indexação Automática em GED com Link Bidirecional no ERP",
              detail:
                "Arquivamento legal automatizado com busca indexada e notificação ativa no portal do fornecedor.",
              tag: "GED Integrado",
            },
          },
        ],
      },
      {
        id: "downstream",
        stepNumber: "05",
        title: isEN ? "Downstream Areas" : "Áreas Fins",
        subtitle: isEN
          ? "Areas that receive and consume the outputs of this process"
          : "Áreas clientes que recebem e consomem os outputs gerados pelo processo",
        icon: Users,
        overallStatus: "equal",
        statusLabel: isEN ? "Convergent" : "Igual / Convergente",
        summary: isEN
          ? "Downstream consuming areas (Treasury/Accounts Payable, Tax, and Accounting) are consistent across variants, with minor differences only in how exceptions return to Procurement."
          : "As áreas fins consumidoras da entrega (Tesouraria / Contas a Pagar, Fiscal e Contabilidade) são convergentes entre as variantes, variando apenas a interface de retorno com Compras.",
        dimensions: [
          {
            id: "downstream-areas",
            label: isEN ? "Receiving Areas & Handoff Interface" : "Áreas Recebedoras e Interface de Passagem",
            sublabel: isEN ? "Internal customer areas impacted" : "Áreas internas que dão sequência à cadeia de valor",
            isEqualAcrossVariants: true,
            convergenceNote: isEN
              ? "Same downstream areas (Accounts Payable, Tax, Controlling)"
              : "Mesmas áreas fins atendidas (Contas a Pagar / Tesouraria, Fiscal e Contabilidade)",
            getVariantContent: (v, idx) => {
              if (idx === 0) {
                return {
                  headline: "Contas a Pagar (Tesouraria), Fiscal e Contabilidade",
                  detail:
                    "Consumo direto via fila integrada no ERP para borderô de pagamento e apuração fiscal mensal.",
                  tag: "Igual (Integrado)",
                  isDivergentFromBase: false,
                };
              }
              if (idx === 1) {
                return {
                  headline: "Contas a Pagar (Tesouraria), Fiscal e Contabilidade",
                  detail:
                    "Mesmas áreas destinatárias, porém recebem aviso complementar por e-mail/planilha para lotes urgentes.",
                  tag: "Igual (Com Aviso Manual)",
                  isDivergentFromBase: false,
                };
              }
              return {
                headline: "Tesouraria Regional, Tax Compliance e Controladoria",
                detail:
                  "Atende as mesmas funções corporativas na estrutura da unidade de negócio correspondente.",
                tag: "Igual (Estrutura Local)",
                isDivergentFromBase: false,
              };
            },
            benchmarkContent: {
              headline: "Integração Contínua com Tesouraria, Tax e Portal do Fornecedor",
              detail:
                "Visibilidade ponta a ponta em tempo real para Tesouraria (previsão de caixa) e Fiscal (fechamento contínuo) sem handoffs manuais.",
              tag: "Zero-Handoff",
            },
          },
        ],
      },
    ];
  }, [isEN]);

  // Transversal Blocks (Sistemas & Ferramentas + Políticas, Governança e Compliance)
  const transversalBlocks = useMemo(() => {
    return [
      {
        id: "systems-transversal",
        title: isEN
          ? "Systems & Tools (Transversal)"
          : "Sistemas e Ferramentas (Transversal)",
        subtitle: isEN
          ? "Technological stack, integrations, and auxiliary tools used across all process stages"
          : "Ecossistema de sistemas, integrações e ferramentas de apoio utilizadas transversalmente ao longo do processo",
        icon: Server,
        statusLabel: isEN ? "Fragmented Stack" : "Divergência Tecnológica",
        rows: [
          {
            id: "sys-core",
            label: isEN ? "Core Transactional System (ERP)" : "Sistema Transacional Principal (ERP)",
            isEqual: false,
            note: isEN ? "Different transactions/modules used" : "Diferença no módulo/transação e grau de integração",
            getVariant: (v: SOPVariant, idx: number) => {
              const allSys = Array.from(
                new Set(
                  (v.sopData?.steps || [])
                    .map((s) => s.system || (s as any)?.systems?.[0])
                    .filter(Boolean)
                )
              );
              const primarySys = allSys.length > 0 ? allSys.slice(0, 3).join(", ") : "SAP ERP";
              if (idx === 0) {
                return {
                  title: primarySys,
                  desc: "Uso nativo das transações integradas de logística/financeiro (MIRO / FB60) com validação automática de pedido.",
                  badge: "Integrado",
                };
              }
              if (idx === 1) {
                return {
                  title: `${primarySys} + Digitação Manual`,
                  desc: "Uso do ERP apenas como repositório final de lançamento, sem integração ativa com a etapa de recepção documental.",
                  badge: "Subutilizado",
                };
              }
              return {
                title: primarySys,
                desc: "Instância parametrizada para regras da unidade local com conector fiscal específico.",
                badge: "Instância Local",
              };
            },
            benchmark: {
              title: "ERP Core Unificado + Camada de Orquestração / API",
              desc: "Execução 100% via API/BAPI padronizada em instância única global, eliminando digitação manual em telas transacionais.",
              badge: "Arquitetura Alvo",
            },
          },
          {
            id: "sys-support",
            label: isEN ? "Capture, OCR & Support Tools" : "Ferramentas de Captura, Mensageria e Apoio",
            isEqual: false,
            note: isEN ? "High reliance on spreadsheets/email in secondary variants" : "Uso de planilhas paralelas e e-mail em parte das variantes",
            getVariant: (_v: SOPVariant, idx: number) => {
              if (idx === 0) {
                return {
                  title: "Monitor Fiscal Eletrônico + Workflow Interno",
                  desc: "Captura automática de XML e mensageria estruturada para desvios.",
                  badge: "Sistêmico",
                };
              }
              if (idx === 1) {
                return {
                  title: "Microsoft Outlook + Excel (Planilha de Controle Local)",
                  desc: "Dependência de caixa de entrada compartilhada e planilhas descentralizadas para controle de fila e cálculo.",
                  badge: "Shadow IT / Planilhas",
                };
              }
              return {
                title: "Portal Web de Fornecedores + Repositório SharePoint",
                desc: "Upload pelo parceiro comercial em portal web com guarda documental em biblioteca de documentos.",
                badge: "Portal Web",
              };
            },
            benchmark: {
              title: "IDP (Intelligent Document Processing / OCR IA) + Process Mining",
              desc: "Extração cognitiva de documentos não estruturados e monitoramento contínuo de SLA sem planilhas paralelas.",
              badge: "Best-in-Class",
            },
          },
        ],
      },
      {
        id: "governance-transversal",
        title: isEN
          ? "Policies, Governance & Compliance (Transversal)"
          : "Políticas, Governança e Compliance (Transversal)",
        subtitle: isEN
          ? "Approval demands, actors involved across variants, segregation of duties, and policy adherence"
          : "Exigência de alçadas de aprovação, atores envolvidos em cada procedimento, segregação de funções e aderência a políticas",
        icon: ShieldCheck,
        statusLabel: isEN ? "Asymmetric Governance" : "Divergência de Alçadas e Atores",
        rows: [
          {
            id: "gov-approvals",
            label: isEN ? "Approval & Authorization Demands" : "Demanda de Aprovação e Alçadas",
            isEqual: false,
            note: isEN
              ? "One procedure enforces formal system approval while another allows direct posting"
              : "Diferença crítica: exigência de aprovação formal vs. liberação direta",
            getVariant: (_v: SOPVariant, idx: number) => {
              if (idx === 0) {
                return {
                  title: "Exige Aprovação Sistêmica por Alçada Financeira",
                  desc: "Nenhum documento fora da tolerância ou sem pedido pré-aprovado é liberado sem assinatura eletrônica do gestor no workflow.",
                  badge: "Alçada Sistêmica",
                };
              }
              if (idx === 1) {
                return {
                  title: "Aprovação por E-mail / Sem Trava de Alçada no Sistema",
                  desc: "Permite que o próprio executor libere o lançamento mediante 'de acordo' recebido por e-mail, sem trava sistêmica de alçada.",
                  badge: "Risco de Controle",
                };
              }
              return {
                title: "Dupla Aprovação (Gestor da Área + Controller da Unidade)",
                desc: "Política local exige validação adicional da controladoria para qualquer lançamento acima do limite operacional.",
                badge: "Dupla Alçada",
              };
            },
            benchmark: {
              title: "Matriz de Alçadas Digital (SoD) + Aprovação Mobile Auditável",
              desc: "Segregação de funções (SoD) estrita no ERP: aprovação automática para PO match perfeito e alçada digital obrigatória para exceções.",
              badge: "Compliance SoX 100%",
            },
          },
          {
            id: "gov-actors",
            label: isEN ? "Actors & Roles Involved" : "Atores Envolvidos e Responsabilidades",
            isEqual: false,
            note: isEN
              ? "Different roles participate in validation and exception handling"
              : "Atores diferentes participam da conferência e resolução de pendências",
            getVariant: (_v: SOPVariant, idx: number) => {
              if (idx === 0) {
                return {
                  title: "Analista CSC + Comprador (Apenas em Exceções)",
                  desc: "Papéis claramente segregados: CSC executa o processamento padrão e Compras atua apenas quando acionado via workflow.",
                  badge: "2 Atores",
                };
              }
              if (idx === 1) {
                return {
                  title: "Analista Operacional + Solicitante da Área + Supervisor",
                  desc: "Envolve o solicitante da área fim na conferência manual e o supervisor imediato para revisão de planilhas.",
                  badge: "3 Atores (Maior Handoff)",
                };
              }
              return {
                title: "Analista Local + Especialista Fiscal + Controller Regional",
                desc: "Participação obrigatória de especialista fiscal local antes da liberação para o financeiro.",
                badge: "3 Atores Especializados",
              };
            },
            benchmark: {
              title: "Agente de IA / RPA (Execução) + Analista de Exceções (Governança)",
              desc: "Operação rotineira executada por automação; atuação humana restrita à análise de desvios complexos e gestão da política.",
              badge: "Human-in-the-Loop",
            },
          },
          {
            id: "gov-policies",
            label: isEN ? "Internal Policies & Audit Trail" : "Políticas Internas, SLA e Rastreabilidade",
            isEqual: false,
            note: isEN
              ? "Differences in cutoff policy and audit trail completeness"
              : "Diferenças em política de corte (cutoff) e guarda de trilha de auditoria",
            getVariant: (_v: SOPVariant, idx: number) => {
              if (idx === 0) {
                return {
                  title: "Política Corporativa de Cutoff (Dia 25) + Log no ERP",
                  desc: "Segue janela corporativa de fechamento contábil com registro de timestamp de todas as etapas.",
                  badge: "Aderente à Política",
                };
              }
              if (idx === 1) {
                return {
                  title: "Recebimento Contínuo sem Trava de Cutoff",
                  desc: "Aceita documentos fora da janela padrão mediante solicitação de urgência, gerando reclassificações no mês seguinte.",
                  badge: "Desvio de Política",
                };
              }
              return {
                title: "Política Local de Fechamento + Retenção Documental Estendida",
                desc: "Segue calendário fiscal local com exigência de checklist assinado para auditoria externa.",
                badge: "Política Regional",
              };
            },
            benchmark: {
              title: "Compliance Contínuo (Continuous Controls Monitoring)",
              desc: "Travas preventivas de política direto no sistema (janela fiscal, fornecedor homologado e contrato vigente) com auditoria 100% digital.",
              badge: "Zero Desvio",
            },
          },
        ],
      },
    ];
  }, [isEN]);

  const visibleMacroBlocks = useMemo(() => {
    if (activeBlockFilter === "all") return macroBlocks;
    return macroBlocks.filter((b) => b.id === activeBlockFilter);
  }, [macroBlocks, activeBlockFilter]);

  const { totalDimensionsCount, divergentDimensionsCount } = useMemo(() => {
    let total = 0;
    let divergent = 0;
    macroBlocks.forEach((b) => {
      b.dimensions.forEach((d) => {
        total++;
        if (!d.isEqualAcrossVariants) divergent++;
      });
    });
    return {
      totalDimensionsCount: total,
      divergentDimensionsCount: divergent,
    };
  }, [macroBlocks]);

  const handleExportReport = () => {
    toast({
      title: isEN ? "Export Generated" : "Matriz Exportada com Sucesso",
      description: isEN
        ? "The executive comparative report with all divergences has been generated."
        : "O relatório comparativo executivo de divergências e aderência foi gerado para exportação.",
    });
  };

  const handleHarmonizeProcedure = () => {
    toast({
      title: isEN ? "Harmonization Initiated" : "Harmonização de Procedimentos",
      description: isEN
        ? `Consolidation recommendation dispatched to the Governance Board. Standard baseline: ${comparedVariants[0]?.name || "Base POP"}.`
        : `Recomendação de unificação enviada ao comitê de governança. Procedimento de referência padrão: ${comparedVariants[0]?.name || "POP Principal"}.`,
    });
  };

  const showTransversalBlocks =
    activeBlockFilter === "all" || activeBlockFilter === "transversal";

  const scrollToFrameworkOverview = () => {
    document
      .getElementById("pop-framework-overview")
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  // ============================================================================
  // STEP 1: INITIAL CTA / CONFIGURATION SCREEN (Before Generating Comparison)
  // ============================================================================
  if (!hasGeneratedComparison) {
    return (
      <div key="pop-comparison-setup" className="max-w-4xl mx-auto py-6 px-4 space-y-6">
        <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
          {/* Header */}
          <div className="p-6 sm:p-8 border-b border-slate-100 bg-slate-50/60">
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div className="space-y-1.5 max-w-2xl">
                <div className="inline-flex items-center gap-2 text-xs font-medium text-slate-600 bg-white border border-slate-200 px-2.5 py-1 rounded-md shadow-2xs">
                  <Sparkles className="h-3.5 w-3.5 text-primary" />
                  <span>
                    {isEN
                      ? "AI Multi-POP Comparative Analysis"
                      : "Análise Comparativa Multi-POP por IA"}
                  </span>
                </div>
                <h2 className="text-xl font-semibold text-slate-900 tracking-tight">
                  {isEN
                    ? "Configure Process Comparison"
                    : "Gerar Comparativo de Procedimentos (POP)"}
                </h2>
                <p className="text-sm text-slate-600 leading-relaxed">
                  {isEN
                    ? "Select the mapped POP variants you want to compare side-by-side. The AI will structure the analysis across the end-to-end process framework (Trigger, Inputs, Execution, Outputs, Downstream Areas) plus Systems and Governance."
                    : "Selecione quais procedimentos mapeados (POPs) deseja comparar. A IA irá processar os documentos selecionados e estruturar as convergências e divergências em um framework ponta a ponta (Gatilho, Inputs, Execução, Outputs, Áreas Fins, Sistemas e Governança)."}
                </p>
              </div>
            </div>
          </div>

          {/* Selection Body */}
          <div className="p-6 sm:p-8 space-y-6">
            {/* Variants Selection List */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-semibold text-slate-900">
                    {isEN
                      ? "1. Select POPs to compare (minimum 2)"
                      : "1. Selecione os POPs que deseja comparar (mínimo de 2)"}
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {variants.length === 1
                      ? isEN
                        ? "Currently only 1 POP is registered. Add or simulate variants to enable comparison."
                        : "Atualmente há apenas 1 POP cadastrado neste processo. Adicione uma nova variante ou carregue variantes de demonstração para comparar."
                      : isEN
                      ? `${comparedVariants.length} of ${variants.length} procedures selected for analysis`
                      : `${comparedVariants.length} de ${variants.length} procedimentos selecionados para o comparativo`}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {variants.length < 3 && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleSeedDemoVariants}
                      className="h-8 text-xs gap-1.5 border-slate-200 text-slate-700 hover:bg-slate-50"
                    >
                      <Layers className="h-3.5 w-3.5 text-slate-500" />
                      {isEN
                        ? "Load 3 Demo Variants"
                        : "Carregar 3 Variantes Demo"}
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={onOpenAddVariantModal}
                    className="h-8 text-xs gap-1.5"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    {isEN ? "Upload New Variant" : "Subir Nova Variante"}
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-1">
                {variants.map((variant, idx) => {
                  const isSelected = validSelectedIds.includes(variant.id);
                  const isBU = variant.divergenceReason !== "executor";
                  return (
                    <button
                      key={variant.id}
                      type="button"
                      onClick={() => toggleVariantSelection(variant.id)}
                      className={cn(
                        "group text-left p-4 rounded-lg border transition-all flex flex-col justify-between gap-3",
                        isSelected
                          ? "border-slate-900 bg-slate-900/[0.02] ring-1 ring-slate-900"
                          : "border-slate-200 bg-white hover:border-slate-300"
                      )}
                    >
                      <div className="space-y-2 w-full">
                        <div className="flex items-center justify-between gap-2">
                          <span className="inline-flex items-center gap-1.5 text-[11px] font-medium text-slate-500">
                            {isBU ? (
                              <Building2 className="h-3.5 w-3.5 text-slate-400" />
                            ) : (
                              <User className="h-3.5 w-3.5 text-slate-400" />
                            )}
                            {isBU
                              ? isEN
                                ? "Business Unit"
                                : "Unidade de Negócio"
                              : isEN
                              ? "Executor"
                              : "Pessoa Executora"}
                          </span>
                          <div
                            className={cn(
                              "h-4 w-4 rounded flex items-center justify-center border transition-colors",
                              isSelected
                                ? "bg-slate-900 border-slate-900 text-white"
                                : "border-slate-300 bg-white"
                            )}
                          >
                            {isSelected && <Check className="h-3 w-3" />}
                          </div>
                        </div>

                        <div>
                          <div className="font-semibold text-sm text-slate-900 line-clamp-1">
                            {variant.name}
                          </div>
                          <div className="text-xs text-slate-500 mt-0.5 line-clamp-1">
                            {variant.businessUnit ||
                              variant.divergenceDetail ||
                              `Variante #${idx + 1}`}
                          </div>
                        </div>
                      </div>

                      <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500 w-full">
                        <span>{variant.sopData?.steps?.length || 0} etapas</span>
                        <span>{variant.version || "1.0"}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Market Benchmark Toggle */}
            <div className="pt-2 border-t border-slate-100">
              <div className="flex items-center justify-between p-4 rounded-lg border border-slate-200 bg-slate-50/50">
                <div className="space-y-0.5 pr-4">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-slate-900">
                      {isEN
                        ? "2. Include Market Benchmark in Comparison"
                        : "2. Incluir Benchmark de Mercado no Comparativo"}
                    </span>
                    <Badge
                      variant="outline"
                      className="text-[10px] font-medium bg-white border-slate-200 text-slate-600"
                    >
                      {isEN ? "Optional" : "Opcional"}
                    </Badge>
                  </div>
                  <p className="text-xs text-slate-500">
                    {isEN
                      ? "Generates a reference column with market best practices (Best-in-Class) alongside your internal POPs."
                      : "Adiciona uma visão de referência (melhores práticas de mercado) ao lado dos procedimentos internos em cada etapa do framework."}
                  </p>
                </div>
                <Switch
                  checked={benchmarkEnabled}
                  onCheckedChange={(checked) =>
                    setBenchmarkEnabled(processId, checked)
                  }
                />
              </div>
            </div>

            {/* Primary CTA */}
            <div className="pt-2 flex items-center justify-between gap-4 flex-wrap">
              <div className="text-xs text-slate-500">
                {comparedVariants.length < 2 ? (
                  <span className="text-amber-700 font-medium flex items-center gap-1.5">
                    <AlertCircle className="h-3.5 w-3.5" />
                    {isEN
                      ? "Select or add at least 2 POP variants to generate the comparison."
                      : "Selecione ou adicione pelo menos 2 variantes de POP para gerar o comparativo."}
                  </span>
                ) : (
                  <span>
                    {isEN
                      ? `Ready to compare ${comparedVariants.length} POPs${
                          benchmarkEnabled ? " + Market Benchmark" : ""
                        }.`
                      : `Pronto para comparar ${comparedVariants.length} POPs${
                          benchmarkEnabled ? " + Benchmark de Mercado" : ""
                        }.`}
                  </span>
                )}
              </div>

              <Button
                size="lg"
                disabled={comparedVariants.length < 2 || isGenerating}
                onClick={handleTriggerComparison}
                className="gap-2 bg-slate-900 hover:bg-slate-800 text-white px-6"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    {isEN
                      ? "Analyzing POPs & Generating Framework..."
                      : "Analisando POPs e Gerando Comparativo..."}
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4" />
                    {isEN ? "Generate Comparison" : "Gerar Comparativo"}
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ============================================================================
  // STEP 2: GENERATED EXECUTIVE COMPARISON & END-TO-END FRAMEWORK
  // ============================================================================
  return (
    <div key="pop-comparison-result" className="space-y-6 pb-12">
      {/* Top Action & Configuration Bar */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-2xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3 flex-wrap">
          <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">
            {isEN ? "Compared POPs:" : "POPs Comparados:"}
          </span>
          <div className="flex items-center gap-1.5 flex-wrap">
            {comparedVariants.map((v, idx) => (
              <div
                key={v.id}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-slate-100 text-slate-800 border border-slate-200/80"
              >
                <span className="text-[10px] font-semibold text-slate-500">
                  POP {idx + 1}
                </span>
                <span className="text-slate-300">|</span>
                <span>{v.name}</span>
                <button
                  type="button"
                  onClick={() => onSwitchToAsIsVariant(v.id)}
                  title={isEN ? "Open AS-IS POP" : "Abrir POP AS-IS"}
                  className="text-slate-400 hover:text-slate-700 ml-0.5"
                >
                  <ExternalLink className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setOnlyDivergences((prev) => !prev)}
            className={cn(
              "flex items-center gap-2 text-xs font-medium px-3 py-1.5 rounded-lg border transition-all select-none cursor-pointer",
              onlyDivergences
                ? "bg-amber-50 text-amber-900 border-amber-300 ring-1 ring-amber-300"
                : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
            )}
          >
            <Filter className={cn("h-3.5 w-3.5", onlyDivergences ? "text-amber-700" : "text-slate-500")} />
            <span>{isEN ? "Divergences Only" : "Apenas Divergências"}</span>
            <span
              className={cn(
                "text-[10px] font-semibold px-1.5 py-0.5 rounded-full leading-none",
                onlyDivergences
                  ? "bg-amber-200/80 text-amber-900"
                  : "bg-slate-200 text-slate-600"
              )}
            >
              {divergentDimensionsCount}
            </span>
          </button>

          <label className="flex items-center gap-2 text-xs font-medium text-slate-700 cursor-pointer select-none bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200">
            <Switch
              checked={benchmarkEnabled}
              onCheckedChange={(checked) =>
                setBenchmarkEnabled(processId, checked)
              }
            />
            <span>
              {isEN ? "Market Benchmark" : "Benchmark de Mercado"}
            </span>
          </label>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setHasGeneratedComparison(false)}
            className="h-8 text-xs gap-1.5 border-slate-200 text-slate-700"
          >
            <SlidersHorizontal className="h-3.5 w-3.5" />
            {isEN ? "Change POPs / Regenerate" : "Selecionar POPs / Regerar"}
          </Button>
        </div>
      </div>

      {/* Executive Summary + Standardization Index (Only) */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-2xs">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          <div className="lg:col-span-9 space-y-2.5">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                {isEN ? "Executive Summary" : "Resumo Executivo"}
              </span>
              <span className="text-slate-300">•</span>
              <span className="text-xs text-slate-500">
                {processName} ({comparedVariants.length}{" "}
                {isEN ? "procedures analyzed" : "procedimentos analisados"})
              </span>
            </div>
            <h3 className="text-base font-semibold text-slate-900 leading-snug">
              {isEN
                ? "The procedures share the same business objective, mandatory inputs, and downstream areas, but diverge significantly in Execution (business rules & calculations), Systems usage, and Governance."
                : "Os procedimentos compartilham o mesmo objetivo final, dados obrigatórios de entrada e áreas fins atendidas, porém apresentam divergências relevantes na Execução (regras de negócio e cálculos), no uso de Sistemas e na Governança de aprovações."}
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              {isEN
                ? `While "${comparedVariants[0]?.name}" operates with systemic validation inside the ERP and formal approval workflows, "${
                    comparedVariants[1]?.name || "the secondary variant"
                  }" relies on email triage, auxiliary spreadsheets for tax/tolerance calculations, and informal email approvals.`
                : `Enquanto "${
                    comparedVariants[0]?.name
                  }" opera com validação assistida no ERP, motor fiscal parametrizado e alçada de aprovação sistêmica, "${
                    comparedVariants[1]?.name || "a segunda variante"
                  }" depende de triagem manual por e-mail, planilhas paralelas para cálculo de retenções e liberações sem trava sistêmica de alçada.`}
            </p>
          </div>

          {/* Only Standardization Index Card */}
          <div className="lg:col-span-3 lg:border-l lg:border-slate-100 lg:pl-6 flex flex-col justify-center">
            <div className="p-4 rounded-lg bg-slate-50 border border-slate-200/80 space-y-2">
              <div className="text-xs font-medium text-slate-500">
                {isEN ? "Standardization Index" : "Índice de Padronização"}
              </div>
              <div className="flex items-baseline justify-between">
                <span className="text-3xl font-bold text-slate-900 tracking-tight">
                  {standardizationScore}%
                </span>
                <span className="text-xs font-medium text-slate-600 bg-white px-2 py-0.5 rounded border border-slate-200">
                  {standardizationScore >= 75
                    ? isEN
                      ? "High"
                      : "Alto"
                    : isEN
                    ? "Moderate"
                    : "Moderado"}
                </span>
              </div>
              <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-slate-800 rounded-full transition-all"
                  style={{ width: `${standardizationScore}%` }}
                />
              </div>
              <p className="text-[11px] text-slate-500 leading-tight pt-0.5">
                {isEN
                  ? "Convergence across inputs, outputs, and downstream areas; main gaps in execution and governance."
                  : "Convergência em inputs e áreas fins; principais desvios concentrados em execução e governança."}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ===================================================================
          FRAMEWORK OVERVIEW (Visão Geral) — Gatilho -> Inputs -> Execução -> Outputs -> Áreas Fins + Transversais
          Acts as the "map" of the comparison; everything below is its detail.
         =================================================================== */}
      <div
        id="pop-framework-overview"
        className="scroll-mt-4 rounded-2xl border border-slate-900/90 bg-white shadow-md ring-4 ring-slate-900/[0.04] overflow-hidden"
      >
        {/* Header band */}
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-start gap-3">
            <div className="h-10 w-10 rounded-lg bg-white/10 border border-white/10 flex items-center justify-center shrink-0">
              <MapIcon className="h-5 w-5 text-white" />
            </div>
            <div className="space-y-0.5">
              <span className="inline-flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-300">
                {isEN ? "Overview" : "Visão Geral"}
              </span>
              <h3 className="text-base font-semibold text-white leading-tight">
                {isEN
                  ? "End-to-End Process Comparison Framework"
                  : "Framework Comparativo do Processo (Visão Ponta a Ponta)"}
              </h3>
              <p className="text-xs text-slate-300 max-w-2xl">
                {isEN
                  ? "Consolidated reading of the process. Each macro-block and transversal layer below is detailed in the sections that follow."
                  : "Leitura consolidada do processo. Cada macrobloco e camada transversal deste mapa é detalhado nas seções abaixo."}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-5">
            <div className="hidden md:flex items-center gap-5 text-right">
              <div>
                <div className="text-lg font-bold leading-none">{macroBlocks.length}</div>
                <div className="text-[10px] uppercase tracking-wider text-slate-400 mt-1">
                  {isEN ? "Macro-blocks" : "Macroblocos"}
                </div>
              </div>
              <div className="h-8 w-px bg-white/15" />
              <div>
                <div className="text-lg font-bold leading-none">{transversalBlocks.length}</div>
                <div className="text-[10px] uppercase tracking-wider text-slate-400 mt-1">
                  {isEN ? "Layers" : "Camadas"}
                </div>
              </div>
              <div className="h-8 w-px bg-white/15" />
              <div>
                <div className="text-lg font-bold leading-none">
                  {divergentDimensionsCount}
                  <span className="text-slate-400 font-medium text-sm">/{totalDimensionsCount}</span>
                </div>
                <div className="text-[10px] uppercase tracking-wider text-slate-400 mt-1">
                  {isEN ? "Divergent dims." : "Dimensões divergentes"}
                </div>
              </div>
            </div>
            {activeBlockFilter !== "all" && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setActiveBlockFilter("all")}
                className="h-7 text-xs text-white bg-white/10 hover:bg-white/20 hover:text-white"
              >
                {isEN ? "Show Full Framework" : "Mostrar Framework Completo"}
              </Button>
            )}
          </div>
        </div>

        <div className="p-6 space-y-5 bg-gradient-to-b from-slate-50/80 to-white">
          {/* Sequential flow label */}
          <div className="flex items-center gap-3">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <ArrowRight className="h-3 w-3" />
              {isEN ? "Sequential process flow" : "Fluxo sequencial do processo"}
            </span>
            <div className="h-px flex-1 bg-slate-200" />
          </div>

          {/* 5 Sequential Blocks Diagram */}
          <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
            {macroBlocks.map((block, index) => {
              const Icon = block.icon;
              const isSelected = activeBlockFilter === block.id;
              const isDimmed = activeBlockFilter !== "all" && !isSelected;
              const divergentCount = block.dimensions.filter(
                (d) => !d.isEqualAcrossVariants
              ).length;
              return (
                <button
                  key={block.id}
                  type="button"
                  onClick={() =>
                    setActiveBlockFilter(
                      activeBlockFilter === block.id ? "all" : block.id
                    )
                  }
                  className={cn(
                    "relative text-left p-4 rounded-xl border-2 transition-all flex flex-col gap-3 min-h-[124px]",
                    isSelected
                      ? "border-slate-900 bg-slate-900 text-white shadow-md"
                      : "border-slate-200 bg-white hover:border-slate-400 hover:shadow-sm text-slate-900",
                    isDimmed && "opacity-55"
                  )}
                >
                  {/* Status accent bar */}
                  <span
                    className={cn(
                      "absolute left-4 right-4 top-0 h-1 rounded-b-full",
                      block.overallStatus === "equal"
                        ? "bg-emerald-500"
                        : block.overallStatus === "partial"
                        ? "bg-slate-400"
                        : "bg-amber-500"
                    )}
                  />
                  <div className="flex items-center justify-between gap-1.5">
                    <span
                      className={cn(
                        "text-[11px] font-bold tracking-wider",
                        isSelected ? "text-slate-300" : "text-slate-400"
                      )}
                    >
                      {block.stepNumber}
                    </span>
                    <span
                      className={cn(
                        "text-[10px] font-medium px-1.5 py-0.5 rounded",
                        isSelected
                          ? "bg-white/15 text-white"
                          : block.overallStatus === "equal"
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-200/60"
                          : block.overallStatus === "partial"
                          ? "bg-slate-100 text-slate-700 border border-slate-200"
                          : "bg-amber-50/80 text-amber-800 border border-amber-200/60"
                      )}
                    >
                      {block.overallStatus === "equal"
                        ? isEN
                          ? "Equal"
                          : "Igual"
                        : block.overallStatus === "partial"
                        ? isEN
                          ? "Partial"
                          : "Parcial"
                        : isEN
                        ? "Divergent"
                        : "Divergente"}
                    </span>
                  </div>

                  <div className="flex items-center gap-2.5">
                    <div
                      className={cn(
                        "h-8 w-8 rounded-lg flex items-center justify-center shrink-0",
                        isSelected ? "bg-white/10" : "bg-slate-100"
                      )}
                    >
                      <Icon
                        className={cn(
                          "h-4 w-4",
                          isSelected ? "text-white" : "text-slate-700"
                        )}
                      />
                    </div>
                    <span className="text-sm font-semibold leading-tight">
                      {block.title}
                    </span>
                  </div>

                  <div
                    className={cn(
                      "mt-auto pt-2 border-t text-[10px] font-medium",
                      isSelected
                        ? "border-white/15 text-slate-300"
                        : "border-slate-100 text-slate-500"
                    )}
                  >
                    {block.dimensions.length}{" "}
                    {isEN
                      ? block.dimensions.length === 1 ? "dimension" : "dimensions"
                      : block.dimensions.length === 1 ? "dimensão" : "dimensões"}
                    {divergentCount > 0 && (
                      <>
                        {" · "}
                        <span className={isSelected ? "text-amber-300" : "text-amber-700"}>
                          {divergentCount}{" "}
                          {isEN
                            ? divergentCount === 1 ? "divergent" : "divergent"
                            : divergentCount === 1 ? "divergente" : "divergentes"}
                        </span>
                      </>
                    )}
                  </div>

                  {index < macroBlocks.length - 1 && (
                    <div className="hidden sm:flex absolute -right-[15px] top-1/2 -translate-y-1/2 z-10 h-5 w-5 rounded-full bg-slate-900 items-center justify-center text-white shadow-sm">
                      <ArrowRight className="h-3 w-3" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {/* Transversal layers label */}
          <div className="flex items-center gap-3 pt-1">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <Layers className="h-3 w-3" />
              {isEN
                ? "Transversal layers — span all stages"
                : "Camadas transversais — atravessam todas as etapas"}
            </span>
            <div className="h-px flex-1 bg-slate-200" />
          </div>

          {/* 2 Transversal Bars (full width, stacked like layers under the flow) */}
          <div className="space-y-2">
            {transversalBlocks.map((tb) => {
              const Icon = tb.icon;
              const isSelected = activeBlockFilter === "transversal";
              const isDimmed = activeBlockFilter !== "all" && !isSelected;
              const divergentRows = tb.rows.filter((r) => !r.isEqual).length;
              return (
                <button
                  key={tb.id}
                  type="button"
                  onClick={() =>
                    setActiveBlockFilter(
                      activeBlockFilter === "transversal" ? "all" : "transversal"
                    )
                  }
                  className={cn(
                    "w-full flex items-center justify-between gap-3 px-4 py-2.5 rounded-xl border-2 border-dashed text-left transition-all",
                    isSelected
                      ? "border-slate-900 border-solid bg-slate-900 text-white"
                      : "border-slate-300 bg-slate-50 hover:bg-slate-100 hover:border-slate-400 text-slate-800",
                    isDimmed && "opacity-55"
                  )}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <Icon
                      className={cn(
                        "h-4 w-4 shrink-0",
                        isSelected ? "text-white" : "text-slate-600"
                      )}
                    />
                    <span className="text-xs font-semibold truncate">{tb.title}</span>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span
                      className={cn(
                        "hidden sm:inline text-[10px] font-medium",
                        isSelected ? "text-slate-300" : "text-slate-500"
                      )}
                    >
                      {tb.rows.length} {isEN ? "dimensions" : "dimensões"}
                      {divergentRows > 0 && ` · ${divergentRows} ${isEN ? "divergent" : divergentRows === 1 ? "divergente" : "divergentes"}`}
                    </span>
                    <span
                      className={cn(
                        "text-[10px] font-medium px-2 py-0.5 rounded",
                        isSelected
                          ? "bg-white/15 text-white"
                          : "bg-amber-50/80 text-amber-800 border border-amber-200/60"
                      )}
                    >
                      {tb.statusLabel}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Footer: legend + interaction hint */}
        <div className="px-6 py-2.5 border-t border-slate-200 bg-white flex items-center justify-between gap-3 flex-wrap text-[11px] text-slate-500">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              {isEN ? "Equal" : "Igual"}
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-slate-400" />
              {isEN ? "Partial" : "Parcial"}
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-amber-500" />
              {isEN ? "Divergent" : "Divergente"}
            </span>
          </div>
          <span className="flex items-center gap-1.5">
            <MousePointerClick className="h-3.5 w-3.5" />
            {isEN
              ? "Click a block to focus its detail below"
              : "Clique em um bloco para focar o detalhamento abaixo"}
          </span>
        </div>
      </div>

      {/* Bridge: Overview -> Detail */}
      <div className="flex flex-col items-center -my-2" aria-hidden="true">
        <div className="h-4 w-px bg-slate-300" />
        <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-slate-600 shadow-2xs">
          <ChevronDown className="h-3.5 w-3.5" />
          {activeBlockFilter === "all"
            ? isEN
              ? "Framework detail by macro-block"
              : "Detalhamento do framework por macrobloco"
            : isEN
            ? "Detail of the selected block"
            : "Detalhamento do bloco selecionado"}
        </div>
        <div className="h-4 w-px bg-slate-300" />
      </div>

      {/* Framework Detail Rail (visually nested under the overview) */}
      <div className="relative pl-4 sm:pl-6 ml-1 sm:ml-3 border-l-2 border-slate-200 space-y-5">

      {/* Sequential Macro Blocks Detail Cards */}
      <div className="space-y-5">
        {visibleMacroBlocks.map((block) => {
          const BlockIcon = block.icon;
          return (
            <div
              key={block.id}
              id={`pop-block-${block.id}`}
              className="bg-white border border-slate-200 rounded-xl shadow-2xs overflow-hidden scroll-mt-4"
            >
              {/* Macro Block Header */}
              <div className="px-6 py-4 bg-slate-50/70 border-b border-slate-200 flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-lg bg-slate-900 text-white flex items-center justify-center text-xs font-semibold">
                    {block.stepNumber}
                  </div>
                  <div>
                    <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 mb-0.5">
                      {isEN
                        ? `Macro-block ${block.stepNumber} of ${String(macroBlocks.length).padStart(2, "0")} · Detail`
                        : `Macrobloco ${block.stepNumber} de ${String(macroBlocks.length).padStart(2, "0")} · Detalhamento`}
                    </div>
                    <div className="flex items-center gap-2.5">
                      <BlockIcon className="h-4 w-4 text-slate-700" />
                      <h4 className="text-sm font-semibold text-slate-900">
                        {block.title}
                      </h4>
                      <span
                        className={cn(
                          "text-[11px] font-medium px-2 py-0.5 rounded border",
                          block.overallStatus === "equal"
                            ? "bg-emerald-50/70 text-emerald-800 border-emerald-200"
                            : block.overallStatus === "partial"
                            ? "bg-slate-100 text-slate-700 border-slate-200"
                            : "bg-amber-50/70 text-amber-900 border-amber-200"
                        )}
                      >
                        {block.statusLabel}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {block.subtitle}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={scrollToFrameworkOverview}
                  className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-500 hover:text-slate-900 transition-colors"
                >
                  <ArrowUp className="h-3 w-3" />
                  {isEN ? "Back to overview" : "Voltar à visão geral"}
                </button>
              </div>

              {/* Synthesis Note */}
              <div className="px-6 py-3 bg-white border-b border-slate-100 text-xs text-slate-600">
                <span className="font-semibold text-slate-800 mr-1.5">
                  {isEN ? "Synthesis:" : "Síntese:"}
                </span>
                {block.summary}
              </div>

              {/* Dimensions Table / Grid inside the Macro Block */}
              <div className="divide-y divide-slate-200">
                {(() => {
                  const activeDimensions = onlyDivergences
                    ? block.dimensions.filter((d) => !d.isEqualAcrossVariants)
                    : block.dimensions;

                  if (activeDimensions.length === 0) {
                    return (
                      <div className="p-6 text-center text-xs text-slate-500 bg-slate-50/40">
                        <div className="inline-flex items-center gap-1.5 text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-md border border-emerald-200/60 font-medium">
                          <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                          <span>
                            {isEN
                              ? "All dimensions in this block are 100% convergent across selected POPs."
                              : "Todas as dimensões deste macrobloco são 100% convergentes entre os POPs selecionados."}
                          </span>
                        </div>
                      </div>
                    );
                  }

                  return activeDimensions.map((dim) => {
                    const DimIcon = dim.icon;
                    return (
                      <div key={dim.id} className="p-6 space-y-4">
                        {/* Dimension Subheader */}
                        <div className="flex items-center justify-between gap-4 flex-wrap">
                          <div className="flex items-center gap-2">
                            {DimIcon && (
                              <DimIcon className="h-4 w-4 text-slate-600" />
                            )}
                            <span className="text-sm font-semibold text-slate-900">
                              {dim.label}
                            </span>
                            {dim.sublabel && (
                              <span className="text-xs text-slate-400">
                                — {dim.sublabel}
                              </span>
                            )}
                          </div>

                          <div
                            className={cn(
                              "inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-0.5 rounded-md border",
                              dim.isEqualAcrossVariants
                                ? "border-emerald-200 bg-emerald-50/70 text-emerald-800"
                                : "border-amber-200 bg-amber-50/80 text-amber-900"
                            )}
                          >
                            {dim.isEqualAcrossVariants ? (
                              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                            ) : (
                              <AlertCircle className="h-3.5 w-3.5 text-amber-600" />
                            )}
                            <span>{dim.convergenceNote}</span>
                          </div>
                        </div>

                        {/* Side-by-Side Columns for Each Compared Variant (+ Optional Benchmark) */}
                        <div
                          className={cn(
                            "grid grid-cols-1 gap-3",
                            comparedVariants.length +
                              (benchmarkEnabled ? 1 : 0) ===
                              2
                              ? "md:grid-cols-2"
                              : comparedVariants.length +
                                  (benchmarkEnabled ? 1 : 0) ===
                                3
                              ? "md:grid-cols-3"
                              : "md:grid-cols-2 lg:grid-cols-4"
                          )}
                        >
                          {comparedVariants.map((variant, vIdx) => {
                            const content = dim.getVariantContent(variant, vIdx);
                            const isDivergent =
                              !dim.isEqualAcrossVariants &&
                              content.isDivergentFromBase;

                            return (
                              <div
                                key={variant.id}
                                className={cn(
                                  "p-4 rounded-lg border flex flex-col justify-between gap-3 transition-colors",
                                  dim.isEqualAcrossVariants
                                    ? "bg-slate-50/50 border-slate-200/80"
                                    : isDivergent
                                    ? "bg-amber-50/20 border-l-4 border-l-amber-500 border-t-amber-200 border-r-amber-200 border-b-amber-200 shadow-2xs"
                                    : "bg-white border-slate-200 shadow-2xs"
                                )}
                              >
                                <div className="space-y-2">
                                  <div className="flex items-center justify-between gap-2 pb-1.5 border-b border-slate-100">
                                    <div className="flex items-center gap-1.5 min-w-0">
                                      <span className="text-[10px] font-semibold text-slate-400 uppercase">
                                        POP {vIdx + 1}
                                      </span>
                                      <span className="text-slate-300">·</span>
                                      <span className="text-xs font-semibold text-slate-800 truncate">
                                        {variant.name}
                                      </span>
                                    </div>
                                    {content.tag && (
                                      <span
                                        className={cn(
                                          "text-[10px] font-medium px-2 py-0.5 rounded shrink-0",
                                          dim.isEqualAcrossVariants
                                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200/60"
                                            : isDivergent
                                            ? "bg-amber-100/90 text-amber-900 border border-amber-300 font-semibold"
                                            : "bg-slate-100 text-slate-700 border border-slate-200"
                                        )}
                                      >
                                        {content.tag}
                                      </span>
                                    )}
                                  </div>

                                  <div className="text-xs font-semibold text-slate-900 leading-snug">
                                    {content.headline}
                                  </div>
                                  <p className="text-xs text-slate-600 leading-relaxed">
                                    {content.detail}
                                  </p>
                                </div>

                                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
                                  <span className="text-slate-400 truncate max-w-[120px]">
                                    {variant.businessUnit || "Corporativo"}
                                  </span>
                                  {dim.isEqualAcrossVariants ? (
                                    <span className="text-emerald-700 font-medium inline-flex items-center gap-1">
                                      <Check className="h-3 w-3" />
                                      {isEN ? "Aligned" : "Alinhado"}
                                    </span>
                                  ) : isDivergent ? (
                                    <span className="text-amber-800 font-semibold inline-flex items-center gap-1">
                                      <AlertCircle className="h-3 w-3" />
                                      {isEN ? "Divergent" : "Divergente"}
                                    </span>
                                  ) : (
                                    <span className="text-slate-500 font-medium">
                                      {isEN ? "Baseline" : "Referência"}
                                    </span>
                                  )}
                                </div>
                              </div>
                            );
                          })}

                          {/* Benchmark Column */}
                          {benchmarkEnabled && (
                            <div className="p-4 rounded-lg border border-slate-800 bg-slate-900 text-white flex flex-col justify-between gap-3">
                              <div className="space-y-2">
                                <div className="flex items-center justify-between gap-2 pb-1.5 border-b border-slate-800">
                                  <span className="text-xs font-semibold text-slate-200 flex items-center gap-1.5">
                                    <Sparkles className="h-3 w-3 text-slate-300" />
                                    {isEN
                                      ? "Market Benchmark"
                                      : "Benchmark de Mercado"}
                                  </span>
                                  <span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-white/10 text-slate-200">
                                    {dim.benchmarkContent.tag}
                                  </span>
                                </div>

                                <div className="text-xs font-semibold text-white leading-snug">
                                  {dim.benchmarkContent.headline}
                                </div>
                                <p className="text-xs text-slate-300 leading-relaxed">
                                  {dim.benchmarkContent.detail}
                                </p>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  });
                })()}
              </div>
            </div>
          );
        })}
      </div>

      {/* Transversal Layers Section (Sistemas & Ferramentas + Políticas, Governança e Compliance) */}
      {showTransversalBlocks && (
        <div id="pop-block-transversal" className="pt-4 space-y-5 scroll-mt-4">
          <div className="flex items-center gap-3">
            <div className="h-px flex-1 bg-slate-200" />
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <Layers className="h-3.5 w-3.5" />
              {isEN
                ? "Detail · Transversal Layers Across the Entire Process"
                : "Detalhamento · Camadas Transversais ao Processo"}
            </span>
            <div className="h-px flex-1 bg-slate-200" />
          </div>

          {transversalBlocks.map((tBlock) => {
            const TIcon = tBlock.icon;
            return (
              <div
                key={tBlock.id}
                className="bg-white border border-slate-200 rounded-xl shadow-2xs overflow-hidden"
              >
                <div className="px-6 py-4 bg-slate-900 text-white flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-lg bg-white/10 flex items-center justify-center">
                      <TIcon className="h-4 w-4 text-white" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2.5">
                        <h4 className="text-sm font-semibold text-white">
                          {tBlock.title}
                        </h4>
                        <span className="text-[10px] font-medium px-2 py-0.5 rounded bg-white/15 text-slate-200">
                          {tBlock.statusLabel}
                        </span>
                      </div>
                      <p className="text-xs text-slate-300 mt-0.5">
                        {tBlock.subtitle}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="divide-y divide-slate-200">
                  {(() => {
                    const activeRows = onlyDivergences
                      ? tBlock.rows.filter((r) => !r.isEqual)
                      : tBlock.rows;

                    if (activeRows.length === 0) {
                      return (
                        <div className="p-6 text-center text-xs text-slate-500 bg-slate-50/40">
                          <div className="inline-flex items-center gap-1.5 text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-md border border-emerald-200/60 font-medium">
                            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                            <span>
                              {isEN
                                ? "All dimensions in this layer are aligned across selected POPs."
                                : "Todas as dimensões desta camada estão alinhadas entre os POPs selecionados."}
                            </span>
                          </div>
                        </div>
                      );
                    }

                    return activeRows.map((row) => (
                      <div key={row.id} className="p-6 space-y-4">
                        <div className="flex items-center justify-between gap-4 flex-wrap">
                          <div className="flex items-center gap-2">
                            <Lock className="h-3.5 w-3.5 text-slate-500" />
                            <span className="text-sm font-semibold text-slate-900">
                              {row.label}
                            </span>
                          </div>
                          <span
                            className={cn(
                              "text-xs font-medium px-2.5 py-0.5 rounded border",
                              row.isEqual
                                ? "bg-emerald-50 text-emerald-700 border-emerald-200/60"
                                : "bg-amber-50 text-amber-900 border-amber-200/80"
                            )}
                          >
                            {row.note}
                          </span>
                        </div>

                        <div
                          className={cn(
                            "grid grid-cols-1 gap-3",
                            comparedVariants.length +
                              (benchmarkEnabled ? 1 : 0) ===
                              2
                              ? "md:grid-cols-2"
                              : comparedVariants.length +
                                  (benchmarkEnabled ? 1 : 0) ===
                                3
                              ? "md:grid-cols-3"
                              : "md:grid-cols-2 lg:grid-cols-4"
                          )}
                        >
                          {comparedVariants.map((variant, vIdx) => {
                            const item = row.getVariant(variant, vIdx);
                            const isDivergent = !row.isEqual && vIdx > 0;
                            return (
                              <div
                                key={variant.id}
                                className={cn(
                                  "p-4 rounded-lg border space-y-2 transition-colors",
                                  row.isEqual
                                    ? "bg-slate-50/50 border-slate-200/80"
                                    : isDivergent
                                    ? "bg-amber-50/20 border-l-4 border-l-amber-500 border-t-amber-200 border-r-amber-200 border-b-amber-200 shadow-2xs"
                                    : "bg-white border-slate-200 shadow-2xs"
                                )}
                              >
                                <div className="flex items-center justify-between gap-2 pb-1.5 border-b border-slate-100">
                                  <div className="flex items-center gap-1.5 min-w-0">
                                    <span className="text-[10px] font-semibold text-slate-400 uppercase">
                                      POP {vIdx + 1}
                                    </span>
                                    <span className="text-slate-300">·</span>
                                    <span className="text-xs font-semibold text-slate-800 truncate">
                                      {variant.name}
                                    </span>
                                  </div>
                                  <span
                                    className={cn(
                                      "text-[10px] font-medium px-1.5 py-0.5 rounded shrink-0",
                                      row.isEqual
                                        ? "bg-emerald-50 text-emerald-700 border border-emerald-200/60"
                                        : isDivergent
                                        ? "bg-amber-100/90 text-amber-900 border border-amber-300 font-semibold"
                                        : "bg-slate-100 text-slate-700 border border-slate-200"
                                    )}
                                  >
                                    {item.badge}
                                  </span>
                                </div>
                                <div className="text-xs font-semibold text-slate-900">
                                  {item.title}
                                </div>
                                <p className="text-xs text-slate-600 leading-relaxed">
                                  {item.desc}
                                </p>
                              </div>
                            );
                          })}

                          {benchmarkEnabled && (
                            <div className="p-4 rounded-lg border border-slate-800 bg-slate-900 text-white space-y-2">
                              <div className="flex items-center justify-between gap-2 pb-1.5 border-b border-slate-800">
                                <span className="text-xs font-semibold text-slate-200 flex items-center gap-1.5">
                                  <Sparkles className="h-3 w-3 text-slate-300" />
                                  {isEN
                                    ? "Market Benchmark"
                                    : "Benchmark de Mercado"}
                                </span>
                                <span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-white/10 text-slate-200">
                                  {row.benchmark.badge}
                                </span>
                              </div>
                              <div className="text-xs font-semibold text-white">
                                {row.benchmark.title}
                              </div>
                              <p className="text-xs text-slate-300 leading-relaxed">
                                {row.benchmark.desc}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    ));
                  })()}
                </div>
              </div>
            );
          })}
        </div>
      )}
      </div>
      {/* End of Framework Detail Rail */}

      {/* Executive Harmonization & Decision Action Bar */}
      <div className="bg-slate-900 text-white rounded-xl p-6 shadow-sm border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-1.5 max-w-2xl text-center md:text-left">
          <div className="inline-flex items-center gap-2 text-xs font-medium text-slate-300 bg-white/10 px-2.5 py-0.5 rounded-md">
            <GitMerge className="h-3.5 w-3.5 text-slate-300" />
            <span>{isEN ? "Operational Harmonization" : "Harmonização Operacional"}</span>
          </div>
          <h4 className="text-base font-semibold text-white">
            {isEN
              ? "Ready to converge divergent procedures into a standardized Standard Operating Procedure?"
              : "Deseja consolidar as melhores práticas em um Procedimento Padrão Unificado?"}
          </h4>
          <p className="text-xs text-slate-300 leading-relaxed">
            {isEN
              ? `Harmonizing the ${divergentDimensionsCount} divergent dimensions identified (especially in Business Rules and Approvals) can raise process standardization to 92%+, mitigating operational rework.`
              : `Padronizar as ${divergentDimensionsCount} dimensões com desvios identificados (especialmente em Regras de Negócio, Cálculo e Alçadas) elevará o índice de padronização para mais de 90%, mitigando retrabalho e riscos fiscais.`}
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0 flex-wrap justify-center">
          <Button
            variant="outline"
            size="sm"
            onClick={handleExportReport}
            className="h-9 text-xs gap-2 bg-transparent text-white border-slate-700 hover:bg-slate-800 hover:text-white"
          >
            <Download className="h-3.5 w-3.5" />
            {isEN ? "Export Matrix (PDF/Excel)" : "Exportar Matriz Comparativa"}
          </Button>

          <Button
            size="sm"
            onClick={handleHarmonizeProcedure}
            className="h-9 text-xs gap-2 bg-white text-slate-900 hover:bg-slate-100 font-semibold px-4"
          >
            <CheckCheck className="h-3.5 w-3.5" />
            {isEN ? "Establish Standard POP" : "Definir POP Padrão da Cia"}
          </Button>
        </div>
      </div>
    </div>
  );
}
