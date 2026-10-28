import { useState, useRef, useEffect } from "react";
import {
  Sparkles,
  Send,
  PanelRightClose,
  Check,
  X,
  RotateCcw,
  Eye,
  Plus,
  Edit3,
  Trash2,
  GitBranch,
  FileText,
  ArrowRight,
  Wand2,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/contexts/LanguageContext";
import type { SOPStep, SOPSubstep } from "@/stores/sopStore";
import type { BPMNElement, BPMNConnection } from "@/components/bpmn/types";

export interface POPMetadataEditable {
  soxControls: string;
  sla: string;
  frequency: string;
  estimatedTime: string;
  volumetry: string;
  classification: "" | "core" | "support" | "management";
  kpis: string;
  responsible: string;
  approver: string;
  systems: string;
}

export type POPEditProposal =
  | {
      kind: "update-metadata";
      field: keyof POPMetadataEditable | "objective" | "title";
      fieldLabel: string;
      before: string;
      after: string;
    }
  | {
      kind: "update-step-title";
      stepId: string;
      stepNumber: number;
      before: string;
      after: string;
    }
  | {
      kind: "update-substep";
      stepId: string;
      substepId: string;
      before: string;
      after: string;
    }
  | {
      kind: "add-step";
      newStep: SOPStep;
      insertIndex: number;
    }
  | {
      kind: "add-substep";
      stepId: string;
      stepTitle: string;
      newSubstep: SOPSubstep;
    }
  | {
      kind: "remove-step";
      stepId: string;
      stepNumber: number;
      removedStep: SOPStep;
    };

export type BPMNEditProposal =
  | {
      kind: "bpmn-rename-element";
      elementId: string;
      elementType: string;
      beforeLabel: string;
      afterLabel: string;
    }
  | {
      kind: "bpmn-add-element";
      newElementType: "task" | "gateway-exclusive";
      label: string;
      afterElementId: string;
      afterElementLabel: string;
      branchCondition?: string;
      generatedId: string;
    }
  | {
      kind: "bpmn-remove-element";
      elementId: string;
      elementLabel: string;
    };

export type AIEditProposal = POPEditProposal | BPMNEditProposal;

export interface AIChatMessage {
  id: string;
  role: "user" | "ai";
  content: string;
  timestamp: string;
  proposal?: AIEditProposal;
  proposalStatus?: "pending" | "applied" | "discarded";
}

interface DocAIEditSidebarProps {
  mode: "pop" | "bpmn";
  open: boolean;
  onToggle: () => void;
  processName?: string;
  // POP props
  popTitle?: string;
  popObjective?: string;
  popMetadata?: POPMetadataEditable;
  popSteps?: SOPStep[];
  onApplyPOPProposal?: (proposal: POPEditProposal, revert?: boolean) => void;
  onFocusPOPTarget?: (target: { stepId?: string; substepId?: string; metadataField?: string }) => void;
  // BPMN props
  bpmnElements?: BPMNElement[];
  bpmnConnections?: BPMNConnection[];
  bpmnXml?: string;
  onApplyBPMNProposal?: (proposal: BPMNEditProposal, revert?: boolean) => void;
  onFocusBPMNElement?: (elementId: string) => void;
}

let msgCounter = 100;

function nowTime() {
  return new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
}

/**
 * Extracts xml node labels if BPMN is rendered via BpmnIoViewer (XML mode)
 */
export function extractXmlNodes(xml?: string): { id: string; name: string; type: string }[] {
  if (!xml) return [];
  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(xml, "text/xml");
    const result: { id: string; name: string; type: string }[] = [];
    const tags = ["userTask", "task", "sendTask", "receiveTask", "manualTask", "exclusiveGateway", "startEvent", "endEvent"];
    tags.forEach((tag) => {
      const nodes = Array.from(doc.getElementsByTagName(`bpmn:${tag}`));
      nodes.forEach((n) => {
        const id = n.getAttribute("id") || "";
        const name = n.getAttribute("name") || "";
        if (id && name) {
          result.push({ id, name, type: tag });
        }
      });
    });
    return result;
  } catch {
    return [];
  }
}

export function DocAIEditSidebar({
  mode,
  open,
  onToggle,
  processName,
  popTitle = "",
  popObjective = "",
  popMetadata,
  popSteps = [],
  onApplyPOPProposal,
  onFocusPOPTarget,
  bpmnElements = [],
  bpmnXml,
  onApplyBPMNProposal,
  onFocusBPMNElement,
}: DocAIEditSidebarProps) {
  const { language } = useLanguage();
  const isPT = language === "PT";
  const [showSuggestions, setShowSuggestions] = useState(true);

  const initialGreeting =
    mode === "pop"
      ? isPT
        ? `Olá! Sou seu **Copiloto de Edição do POP**. Posso criar, detalhar ou remover etapas e subpassos, além de atualizar **SLA**, **Objetivo**, **Controles SoX** e demais atributos.\n\nToda alteração é exibida antes em um preview **Antes → Depois** para você aprovar.`
        : `Hi! I'm your **SOP Edit Copilot**. I can add, detail, or remove steps and substeps, or update **SLA**, **Objective**, **SoX Controls**, and other metadata.\n\nEvery change is shown in a **Before → After** preview for your approval.`
      : isPT
        ? `Olá! Sou seu **Copiloto de Fluxo BPMN**. Posso adicionar novas tarefas, incluir **gateways de decisão**, renomear etapas ou remover atividades diretamente no diagrama.\n\nVocê verá um preview **Antes → Depois** antes de aplicar qualquer mudança.`
        : `Hi! I'm your **BPMN Flow Copilot**. I can add new tasks, insert **decision gateways**, rename steps, or remove activities directly on the diagram.\n\nYou'll see a **Before → After** preview before applying any change.`;

  const [messages, setMessages] = useState<AIChatMessage[]>([
    {
      id: "welcome",
      role: "ai",
      content: initialGreeting,
      timestamp: nowTime(),
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  // Contextual quick suggestions
  const firstStepTitle = popSteps[0]?.title || "Preparação e extração";
  const firstSubstepId = popSteps[0]?.substeps?.[1]?.id || popSteps[0]?.substeps?.[0]?.id || "1.1";

  const xmlNodes = extractXmlNodes(bpmnXml);
  const sampleTaskName =
    xmlNodes.find((n) => n.type.includes("Task"))?.name ||
    bpmnElements.find((e) => e.type.includes("task"))?.label ||
    "Consultar Bank Key no SAP";

  const quickPrompts =
    mode === "pop"
      ? isPT
        ? [
            "Alterar SLA para envio em até 3 dias úteis e confirmação em 24h",
            `Detalhar o subpasso ${firstSubstepId} com validação obrigatória de campos`,
            "Adicionar etapa de Validação e Aprovação com Business Partners",
            "Atualizar Controles SoX exigindo dupla alçada e log de auditoria",
            "Alterar objetivo para incluir conformidade regulatória e redução de retrabalho",
          ]
        : [
            "Change SLA to 3 business days delivery and 24h confirmation",
            `Detail substep ${firstSubstepId} with mandatory field validation`,
            "Add step for Validation and Sign-off with Business Partners",
            "Update SoX Controls requiring dual approval and audit trail",
          ]
      : isPT
        ? [
            `Adicionar tarefa "Validar Alçada e Compliance" após "${sampleTaskName}"`,
            `Incluir gateway de decisão "Documentação completa?" após a primeira tarefa`,
            `Renomear "${sampleTaskName}" para "${sampleTaskName} (Automático via API)"`,
            `Adicionar tarefa "Notificar Gestor no Teams" antes do encerramento`,
          ]
        : [
            `Add task "Validate Compliance & Approval" after "${sampleTaskName}"`,
            `Insert decision gateway "Documentation complete?" after first task`,
            `Rename "${sampleTaskName}" to "${sampleTaskName} (Automated)"`,
          ];

  const buildPOPProposal = (prompt: string): { reply: string; proposal: POPEditProposal } => {
    const lower = prompt.toLowerCase();

    // 1. Check SLA
    if (/\bsla\b|prazo de atendimento|tempo de resposta/i.test(lower)) {
      const before = popMetadata?.sla || "Não definido";
      const extracted = prompt.replace(/^(?:alterar|mudar|atualizar|definir|set|change|update)\s+(?:o\s+)?sla\s+(?:para|como|to)?\s*/i, "").trim();
      const after =
        extracted && extracted.length > 4 && extracted.toLowerCase() !== prompt.toLowerCase()
          ? extracted.charAt(0).toUpperCase() + extracted.slice(1)
          : "Envio das bases solicitadas em até 3 dias úteis; confirmação de recebimento em 24 horas.";
      return {
        reply: isPT
          ? "Preparei a atualização do **SLA** nas informações gerais do POP. Confira como ficará:"
          : "I prepared the **SLA** update in the general information section. Check the preview below:",
        proposal: {
          kind: "update-metadata",
          field: "sla",
          fieldLabel: "SLA",
          before,
          after,
        },
      };
    }

    // 2. Check SoX Controls
    if (/\bsox\b|controle|política|compliance|alçada|auditoria/i.test(lower) && !/adicionar etapa|novo passo|nova etapa/i.test(lower)) {
      const before = popMetadata?.soxControls || "Não definido";
      const extracted = prompt
        .replace(/^(?:alterar|mudar|atualizar|definir|incluir)\s+(?:os\s+)?(?:controles?\s+sox(?:\s+e\s+políticas)?)\s*(?:para|com|exigindo|:)?\s*/i, "")
        .trim();
      const after =
        extracted && extracted.length > 12 && extracted.toLowerCase() !== prompt.toLowerCase()
          ? `Dupla alçada obrigatória no workflow (${extracted}). Log de auditoria imutável anexado automaticamente ao ERP.`
          : "Aprovação sistêmica em dupla alçada para desvios de estrutura. Registro obrigatório de trilha de auditoria (SoX Control ID #HR-04) anexado no ERP.";
      return {
        reply: isPT
          ? "Elaborei a revisão dos **Controles SoX e Políticas** com foco em rastreabilidade e governança:"
          : "I drafted the updated **SoX Controls & Policies** focusing on governance and auditability:",
        proposal: {
          kind: "update-metadata",
          field: "soxControls",
          fieldLabel: isPT ? "Controles SoX e Políticas" : "SoX Controls & Policies",
          before,
          after,
        },
      };
    }

    // 3. Check Objective
    if (/\bobjetivo\b|\bobjective\b/i.test(lower)) {
      const before = popObjective || "Não definido";
      const suffixMatch = prompt.match(/(?:incluir|adicionar|para)\s+(.+)$/i);
      const after = suffixMatch?.[1]
        ? `${before.replace(/\.$/, "")}, garantindo ${suffixMatch[1].trim().replace(/\.$/, "")}.`
        : `${before.replace(/\.$/, "")}, assegurando padronização operacional, conformidade regulatória e redução de retrabalho entre as áreas.`;
      return {
        reply: isPT
          ? "Aqui está a proposta de refinamento do **Objetivo** do procedimento:"
          : "Here is the proposed refinement for the procedure **Objective**:",
        proposal: {
          kind: "update-metadata",
          field: "objective",
          fieldLabel: isPT ? "Objetivo" : "Objective",
          before,
          after,
        },
      };
    }

    // 4. Check Frequency / Volumetry / Systems / KPIs
    if (/\bfrequ[êe]ncia\b/i.test(lower)) {
      const before = popMetadata?.frequency || "Não definido";
      const extracted = prompt.replace(/.*frequ[êe]ncia\s*(?:para|como|:)?\s*/i, "").trim();
      return {
        reply: "Preparei a alteração da **Frequência** de execução do POP:",
        proposal: {
          kind: "update-metadata",
          field: "frequency",
          fieldLabel: "Frequência",
          before,
          after: extracted || "Mensal (fechamento no 5º dia útil) e Ad Hoc sob demanda",
        },
      };
    }

    if (/\bvolumetria\b/i.test(lower)) {
      const before = popMetadata?.volumetry || "Não definido";
      const extracted = prompt.replace(/.*volumetria\s*(?:para|como|:)?\s*/i, "").trim();
      return {
        reply: "Preparei a atualização da **Volumetria** do processo:",
        proposal: {
          kind: "update-metadata",
          field: "volumetry",
          fieldLabel: "Volumetria",
          before,
          after: extracted || "220 execuções/mês (~10 por dia útil)",
        },
      };
    }

    if (/\bkpi\b|\bindicador/i.test(lower)) {
      const before = popMetadata?.kpis || "Não definido";
      const extracted = prompt.replace(/.*(?:kpis?|indicadores?)\s*(?:para|incluindo|com|:)?\s*/i, "").trim();
      return {
        reply: "Preparei a atualização dos **KPIs Vinculados** ao POP:",
        proposal: {
          kind: "update-metadata",
          field: "kpis",
          fieldLabel: "KPIs Vinculados",
          before,
          after: before !== "Não definido" ? `${before}; ${extracted || "Índice de Conformidade SLA (%)"}` : extracted || "Índice de Conformidade SLA (%); Tempo Médio de Ciclo",
        },
      };
    }

    // 5. Check Remove Step
    if (/\b(remover|excluir|deletar|apagar|remove|delete)\b/i.test(lower)) {
      const numMatch = prompt.match(/(?:etapa|passo|step)\s*(\d+)/i);
      const stepIdx = numMatch ? Math.max(0, Math.min(popSteps.length - 1, parseInt(numMatch[1], 10) - 1)) : popSteps.length - 1;
      const targetStep = popSteps[stepIdx] || popSteps[popSteps.length - 1];
      if (targetStep) {
        return {
          reply: isPT
            ? `Identifiquei a solicitação de remoção da **Etapa ${stepIdx + 1} (${targetStep.title})**. Confirme abaixo se deseja removê-la:`
            : `I identified the request to remove **Step ${stepIdx + 1} (${targetStep.title})**. Confirm below if you want to remove it:`,
          proposal: {
            kind: "remove-step",
            stepId: targetStep.id,
            stepNumber: stepIdx + 1,
            removedStep: targetStep,
          },
        };
      }
    }

    // 6. Check Substep reference (e.g., "1.2", "2.1", "subpasso")
    const substepMatch = prompt.match(/\b(\d+\.\d+)\b/);
    if (substepMatch || /\bsubpasso\b|\bsubetapa\b|\bsubstep\b/i.test(lower)) {
      const targetSubId = substepMatch?.[1] || firstSubstepId;
      let foundStep: SOPStep | undefined;
      let foundSub: SOPSubstep | undefined;

      for (const s of popSteps) {
        const sub = s.substeps?.find((sb) => sb.id === targetSubId);
        if (sub) {
          foundStep = s;
          foundSub = sub;
          break;
        }
      }

      if (!foundStep && popSteps[0]) {
        foundStep = popSteps[0];
        foundSub = popSteps[0].substeps?.[0];
      }

      if (foundStep && foundSub && !/\b(adicionar|incluir|criar|novo)\s+(?:um\s+)?(?:subpasso|subetapa)/i.test(lower)) {
        const cleanInstruction = prompt
          .replace(/^(?:detalhar|editar|alterar|atualizar|reescrever|melhorar)\s+(?:o\s+)?(?:subpasso|subetapa|item|passo)?\s*\d*(?:\.\d+)?\s*(?:para|com|incluindo|:)?\s*/i, "")
          .trim();

        const afterText =
          cleanInstruction && cleanInstruction.length > 6 && cleanInstruction.toLowerCase() !== prompt.toLowerCase()
            ? `${foundSub.description.replace(/\.$/, "")}. Critério complementar: ${cleanInstruction.charAt(0).toUpperCase() + cleanInstruction.slice(1).replace(/\.$/, "")}.`
            : `${foundSub.description.replace(/\.$/, "")}, conferindo obrigatoriamente a integridade dos filtros de data de corte, centro de custo e status ativo antes da exportação.`;

        return {
          reply: isPT
            ? `Preparei o detalhamento do **Subpasso ${foundSub.id}** na etapa **"${foundStep.title}"**:`
            : `I prepared the updated text for **Substep ${foundSub.id}** in step **"${foundStep.title}"**:`,
          proposal: {
            kind: "update-substep",
            stepId: foundStep.id,
            substepId: foundSub.id,
            before: foundSub.description,
            after: afterText,
          },
        };
      }

      if (foundStep) {
        const stepIdx = popSteps.findIndex((s) => s.id === foundStep!.id) + 1;
        const nextSubNum = (foundStep.substeps?.length || 0) + 1;
        const desc = prompt
          .replace(/^(?:adicionar|incluir|criar|inserir)\s+(?:um\s+)?(?:novo\s+)?(?:subpasso|subetapa|substep)(?:\s+na\s+etapa\s+\d+)?\s*(?:para|com|de|:)?\s*/i, "")
          .trim();
        return {
          reply: isPT
            ? `Proponho incluir o novo **Subpasso ${stepIdx}.${nextSubNum}** dentro da etapa **"${foundStep.title}"**:`
            : `I propose adding the new **Substep ${stepIdx}.${nextSubNum}** inside step **"${foundStep.title}"**:`,
          proposal: {
            kind: "add-substep",
            stepId: foundStep.id,
            stepTitle: foundStep.title,
            newSubstep: {
              id: `${stepIdx}.${nextSubNum}`,
              description:
                desc && desc.length > 5
                  ? desc.charAt(0).toUpperCase() + desc.slice(1)
                  : "Conferir log de validação automática e salvar evidência na pasta compartilhada da área.",
            },
          },
        };
      }
    }

    // 7. Check Edit specific Step Title (e.g. "renomear etapa 2 para ...", "editar passo 1")
    const stepEditMatch = prompt.match(/(?:editar|alterar|renomear|atualizar)\s+(?:a\s+|o\s+)?(?:etapa|passo|step)\s*(\d+)/i);
    if (stepEditMatch) {
      const idx = Math.max(0, Math.min(popSteps.length - 1, parseInt(stepEditMatch[1], 10) - 1));
      const targetStep = popSteps[idx];
      if (targetStep) {
        const afterPart = prompt.replace(/.*?(?:etapa|passo|step)\s*\d+\s*(?:para|como|:)?\s*/i, "").trim();
        const afterTitle =
          afterPart && afterPart.length > 3
            ? afterPart.charAt(0).toUpperCase() + afterPart.slice(1)
            : `${targetStep.title} e Validação de Qualidade`;
        return {
          reply: isPT
            ? `Preparei a alteração do título da **Etapa ${idx + 1}**:`
            : `I prepared the title update for **Step ${idx + 1}**:`,
          proposal: {
            kind: "update-step-title",
            stepId: targetStep.id,
            stepNumber: idx + 1,
            before: targetStep.title,
            after: afterTitle,
          },
        };
      }
    }

    // 8. Default / Add New Step to POP
    const stepNumber = popSteps.length + 1;
    const rawTopic = prompt
      .replace(/^(?:adicionar|incluir|criar|inserir|add|create)\s+(?:uma\s+|um\s+)?(?:nova\s+|novo\s+)?(?:etapa|passo|step)\s*(?:de|para|sobre|chamada|chamado|:)?\s*/i, "")
      .trim();

    const stepTitle =
      rawTopic && rawTopic.length > 3
        ? rawTopic.charAt(0).toUpperCase() + rawTopic.slice(1).replace(/\.$/, "")
        : "Validação e Aprovação com Business Partners";

    const newStep: SOPStep = {
      id: `ai-step-${Date.now()}`,
      title: stepTitle,
      executor: popMetadata?.responsible?.split(";")[0]?.trim() || "Analista Responsável",
      system: popMetadata?.systems?.split(",")[0]?.trim() || "Workday / Google Sheets",
      automationClass: "MS",
      executionTime: "25 min",
      substeps: [
        {
          id: `${stepNumber}.1`,
          description: `Consolidar os resultados preliminares de "${stepTitle}" e verificar consistência com as regras de negócio vigentes.`,
        },
        {
          id: `${stepNumber}.2`,
          description: `Submeter a prévia para revisão da liderança/área envolvida e registrar o aceite formal para rastreabilidade.`,
        },
      ],
    };

    return {
      reply: isPT
        ? `Criei uma proposta para adicionar a **Etapa ${stepNumber}: ${stepTitle}** com subpassos estruturados e microatributos preenchidos:`
        : `I created a proposal to add **Step ${stepNumber}: ${stepTitle}** with structured substeps and micro-attributes:`,
      proposal: {
        kind: "add-step",
        newStep,
        insertIndex: popSteps.length,
      },
    };
  };

  const buildBPMNProposal = (prompt: string): { reply: string; proposal: BPMNEditProposal } => {
    const lower = prompt.toLowerCase();
    const availableNodes =
      xmlNodes.length > 0
        ? xmlNodes.map((n) => ({ id: n.id, label: n.name, type: n.type }))
        : bpmnElements
            .filter((e) => e.label)
            .map((e) => ({ id: e.id, label: e.label, type: e.type }));

    const firstTask =
      availableNodes.find((n) => n.type.toLowerCase().includes("task")) ||
      availableNodes[0] || { id: "act_consultar", label: "Consultar Bank Key no SAP", type: "userTask" };

    // 1. Check Remove Element
    if (/\b(remover|excluir|deletar|apagar|remove|delete)\b/i.test(lower)) {
      const matched =
        availableNodes.find((n) => lower.includes(n.label.toLowerCase())) ||
        availableNodes[availableNodes.length - 1] ||
        firstTask;
      return {
        reply: isPT
          ? `Preparei a remoção do elemento **"${matched.label}"** reconectando o fluxo automaticamente:`
          : `I prepared the removal of element **"${matched.label}"** while reconnecting the sequence flow automatically:`,
        proposal: {
          kind: "bpmn-remove-element",
          elementId: matched.id,
          elementLabel: matched.label,
        },
      };
    }

    // 2. Check Rename Element
    if (/\b(renomear|alterar nome|mudar nome|rename)\b/i.test(lower)) {
      const quoted = prompt.match(/["“”']([^"“”']+)["“”']/g)?.map((s) => s.slice(1, -1)) || [];
      let targetNode = availableNodes.find((n) => lower.includes(n.label.toLowerCase()));
      if (!targetNode && quoted[0]) {
        targetNode = availableNodes.find((n) => n.label.toLowerCase().includes(quoted[0].toLowerCase()));
      }
      if (!targetNode) targetNode = firstTask;

      const afterMatch = prompt.match(/(?:para|como|to)\s+["“”']?([^"“”'\n]+)["“”']?$/i);
      const afterLabel =
        quoted[1] ||
        (afterMatch?.[1] ? afterMatch[1].trim() : `${targetNode.label} (Validado via IA)`);

      return {
        reply: isPT
          ? `Preparei a alteração de nomenclatura da etapa no diagrama BPMN:`
          : `I prepared the label update for the step in the BPMN diagram:`,
        proposal: {
          kind: "bpmn-rename-element",
          elementId: targetNode.id,
          elementType: targetNode.type,
          beforeLabel: targetNode.label,
          afterLabel,
        },
      };
    }

    // 3. Check Gateway / Decision addition
    const isGateway = /\b(gateway|decis[ãa]o|condi[çc][ãa]o|losango|se\s|aprova[çc][ãa]o\?)\b/i.test(lower) || prompt.includes("?");
    const quoted = prompt.match(/["“”']([^"“”']+)["“”']/g)?.map((s) => s.slice(1, -1)) || [];

    // Find reference element ("após X" / "antes de X")
    let refNode = firstTask;
    for (const node of availableNodes) {
      if (lower.includes(node.label.toLowerCase())) {
        refNode = node;
        break;
      }
    }
    if (/antes do encerramento|antes do fim|final/i.test(lower)) {
      const taskNodes = availableNodes.filter((n) => n.type.toLowerCase().includes("task"));
      if (taskNodes.length > 0) {
        refNode = taskNodes[taskNodes.length - 1];
      }
    }

    if (isGateway) {
      const gwLabel =
        quoted[0] ||
        prompt
          .replace(/^(?:incluir|adicionar|criar|inserir)\s+(?:um\s+)?(?:gateway(?:\s+de\s+decis[ãa]o)?|decis[ãa]o)\s*/i, "")
          .replace(/\s*(?:após|depois|antes).*$/i, "")
          .trim() ||
        "Documentação completa?";

      return {
        reply: isPT
          ? `Preparei a inclusão de um **Gateway Exclusivo (XOR)** logo após **"${refNode.label}"** no fluxo BPMN:`
          : `I prepared the insertion of an **Exclusive Gateway (XOR)** right after **"${refNode.label}"** in the BPMN flow:`,
        proposal: {
          kind: "bpmn-add-element",
          newElementType: "gateway-exclusive",
          label: gwLabel.endsWith("?") ? gwLabel : `${gwLabel}?`,
          afterElementId: refNode.id,
          afterElementLabel: refNode.label,
          branchCondition: "Sim / Não",
          generatedId: `gw_ai_${Date.now().toString().slice(-4)}`,
        },
      };
    }

    // 4. Default: Add Task in BPMN
    const cleanedTaskName =
      quoted[0] ||
      prompt
        .replace(/^(?:adicionar|incluir|criar|inserir)\s+(?:uma\s+|um\s+)?(?:nova\s+|novo\s+)?(?:tarefa|etapa|atividade|caixa|task)\s*(?:de|para|chamada)?\s*/i, "")
        .replace(/\s*(?:após|depois|antes).*$/i, "")
        .trim() ||
      "Validar Alçada e Compliance";

    return {
      reply: isPT
        ? `Preparei a adição da nova tarefa **"${cleanedTaskName}"** conectada após **"${refNode.label}"** no fluxo BPMN:`
        : `I prepared the addition of the new task **"${cleanedTaskName}"** connected after **"${refNode.label}"** in the BPMN flow:`,
      proposal: {
        kind: "bpmn-add-element",
        newElementType: "task",
        label: cleanedTaskName.charAt(0).toUpperCase() + cleanedTaskName.slice(1),
        afterElementId: refNode.id,
        afterElementLabel: refNode.label,
        generatedId: `act_ai_${Date.now().toString().slice(-4)}`,
      },
    };
  };

  const handleSendPrompt = (customText?: string) => {
    const text = (customText ?? inputValue).trim();
    if (!text || isTyping) return;

    const userMsg: AIChatMessage = {
      id: `msg-${++msgCounter}`,
      role: "user",
      content: text,
      timestamp: nowTime(),
    };
    setMessages((prev) => [...prev, userMsg]);
    if (!customText) setInputValue("");
    setIsTyping(true);

    setTimeout(() => {
      setIsTyping(false);
      if (mode === "pop") {
        const { reply, proposal } = buildPOPProposal(text);
        const aiMsg: AIChatMessage = {
          id: `msg-${++msgCounter}`,
          role: "ai",
          content: reply,
          timestamp: nowTime(),
          proposal,
          proposalStatus: "pending",
        };
        setMessages((prev) => [...prev, aiMsg]);
        // Automatically preview/locate target in POP
        triggerLocateProposal(proposal);
      } else {
        const { reply, proposal } = buildBPMNProposal(text);
        const aiMsg: AIChatMessage = {
          id: `msg-${++msgCounter}`,
          role: "ai",
          content: reply,
          timestamp: nowTime(),
          proposal,
          proposalStatus: "pending",
        };
        setMessages((prev) => [...prev, aiMsg]);
        triggerLocateProposal(proposal);
      }
    }, 650);
  };

  const triggerLocateProposal = (proposal: AIEditProposal) => {
    if (proposal.kind === "update-metadata") {
      onFocusPOPTarget?.({ metadataField: proposal.field });
    } else if (proposal.kind === "update-step-title" || proposal.kind === "remove-step") {
      onFocusPOPTarget?.({ stepId: proposal.stepId });
    } else if (proposal.kind === "update-substep") {
      onFocusPOPTarget?.({ stepId: proposal.stepId, substepId: proposal.substepId });
    } else if (proposal.kind === "add-substep") {
      onFocusPOPTarget?.({ stepId: proposal.stepId });
    } else if (proposal.kind === "add-step") {
      const lastStep = popSteps[popSteps.length - 1];
      onFocusPOPTarget?.({ stepId: lastStep?.id || "__header__" });
    } else if (proposal.kind === "bpmn-rename-element" || proposal.kind === "bpmn-remove-element") {
      onFocusBPMNElement?.(proposal.elementId);
    } else if (proposal.kind === "bpmn-add-element") {
      onFocusBPMNElement?.(proposal.afterElementId);
    }
  };

  const handleApply = (msgId: string) => {
    const targetMsg = messages.find((m) => m.id === msgId);
    if (!targetMsg?.proposal) return;

    const p = targetMsg.proposal;
    if (p.kind.startsWith("bpmn-")) {
      onApplyBPMNProposal?.(p as BPMNEditProposal, false);
    } else {
      onApplyPOPProposal?.(p as POPEditProposal, false);
    }

    setMessages((prev) =>
      prev.map((m) => (m.id === msgId ? { ...m, proposalStatus: "applied" } : m))
    );
  };

  const handleRevert = (msgId: string) => {
    const targetMsg = messages.find((m) => m.id === msgId);
    if (!targetMsg?.proposal) return;

    const p = targetMsg.proposal;
    if (p.kind.startsWith("bpmn-")) {
      onApplyBPMNProposal?.(p as BPMNEditProposal, true);
    } else {
      onApplyPOPProposal?.(p as POPEditProposal, true);
    }

    setMessages((prev) =>
      prev.map((m) => (m.id === msgId ? { ...m, proposalStatus: "pending" } : m))
    );
  };

  const handleDiscard = (msgId: string) => {
    setMessages((prev) =>
      prev.map((m) => (m.id === msgId ? { ...m, proposalStatus: "discarded" } : m))
    );
  };

  const renderMarkdownText = (text: string) => {
    const parts = text.split(/(\*\*[^*]+\*\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        return (
          <strong key={i} className="font-semibold text-foreground">
            {part.slice(2, -2)}
          </strong>
        );
      }
      return <span key={i}>{part}</span>;
    });
  };

  const renderProposalCard = (msg: AIChatMessage) => {
    const p = msg.proposal;
    if (!p) return null;
    const status = msg.proposalStatus || "pending";

    let badgeLabel = "";
    let badgeClass = "bg-primary/10 text-primary border-primary/20";
    let targetTitle = "";
    let beforeContent: string | null = null;
    let afterContent: string | null = null;
    let extraMeta: string | null = null;

    if (p.kind === "update-metadata") {
      badgeLabel = isPT ? "Edição de Atributo" : "Metadata Edit";
      targetTitle = p.fieldLabel;
      beforeContent = p.before;
      afterContent = p.after;
    } else if (p.kind === "update-step-title") {
      badgeLabel = isPT ? "Renomear Etapa" : "Rename Step";
      targetTitle = `${isPT ? "Etapa" : "Step"} ${p.stepNumber}`;
      beforeContent = p.before;
      afterContent = p.after;
    } else if (p.kind === "update-substep") {
      badgeLabel = isPT ? "Edição de Subpasso" : "Substep Edit";
      targetTitle = `${isPT ? "Subpasso" : "Substep"} ${p.substepId}`;
      beforeContent = p.before;
      afterContent = p.after;
    } else if (p.kind === "add-step") {
      badgeLabel = isPT ? "Nova Etapa POP" : "New SOP Step";
      badgeClass = "bg-emerald-500/10 text-emerald-700 border-emerald-500/20";
      targetTitle = `${ p.insertIndex + 1 }. ${p.newStep.title}`;
      afterContent = (p.newStep.substeps || [])
        .map((s) => `${s.id} — ${s.description}`)
        .join("\n");
      extraMeta = `${p.newStep.executor || "Analista"} • ${p.newStep.system || "Sistema"} • ${p.newStep.executionTime || "20 min"}`;
    } else if (p.kind === "add-substep") {
      badgeLabel = isPT ? "Novo Subpasso" : "New Substep";
      badgeClass = "bg-emerald-500/10 text-emerald-700 border-emerald-500/20";
      targetTitle = `${p.newSubstep.id} (${p.stepTitle})`;
      afterContent = p.newSubstep.description;
    } else if (p.kind === "remove-step") {
      badgeLabel = isPT ? "Remover Etapa" : "Remove Step";
      badgeClass = "bg-rose-500/10 text-rose-700 border-rose-500/20";
      targetTitle = `${isPT ? "Etapa" : "Step"} ${p.stepNumber}: ${p.removedStep.title}`;
      beforeContent = `${p.removedStep.title} (${p.removedStep.substeps?.length || 0} subpassos)`;
    } else if (p.kind === "bpmn-rename-element") {
      badgeLabel = isPT ? "Renomear no BPMN" : "Rename in BPMN";
      targetTitle = p.beforeLabel;
      beforeContent = p.beforeLabel;
      afterContent = p.afterLabel;
    } else if (p.kind === "bpmn-add-element") {
      const isGw = p.newElementType === "gateway-exclusive";
      badgeLabel = isGw
        ? isPT
          ? "Novo Gateway BPMN"
          : "New BPMN Gateway"
        : isPT
          ? "Nova Tarefa BPMN"
          : "New BPMN Task";
      badgeClass = "bg-emerald-500/10 text-emerald-700 border-emerald-500/20";
      targetTitle = p.label;
      afterContent = isGw
        ? `Gateway de decisão "${p.label}" inserido após "${p.afterElementLabel}"`
        : `Tarefa "${p.label}" conectada no fluxo após "${p.afterElementLabel}"`;
    } else if (p.kind === "bpmn-remove-element") {
      badgeLabel = isPT ? "Remover do BPMN" : "Remove from BPMN";
      badgeClass = "bg-rose-500/10 text-rose-700 border-rose-500/20";
      targetTitle = p.elementLabel;
      beforeContent = p.elementLabel;
    }

    return (
      <div
        className={cn(
          "mt-2.5 rounded-xl border bg-card overflow-hidden shadow-sm transition-all",
          status === "applied"
            ? "border-emerald-500/40 ring-1 ring-emerald-500/20"
            : status === "discarded"
              ? "border-border opacity-60"
              : "border-primary/30"
        )}
      >
        {/* Card Header */}
        <div className="px-3 py-2 bg-muted/40 border-b border-border flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 min-w-0">
            <span className={cn("text-[10px] font-semibold px-2 py-0.5 rounded-full border shrink-0", badgeClass)}>
              {badgeLabel}
            </span>
            <span className="text-[12px] font-semibold text-foreground truncate" title={targetTitle}>
              {targetTitle}
            </span>
          </div>
          <button
            type="button"
            onClick={() => triggerLocateProposal(p)}
            className="inline-flex items-center gap-1 text-[11px] text-primary hover:underline shrink-0"
            title={isPT ? "Destacar local no documento/fluxo" : "Highlight in document/flow"}
          >
            <Eye className="h-3 w-3" />
            {isPT ? "Localizar" : "Locate"}
          </button>
        </div>

        {/* Diff Body */}
        <div className="p-3 space-y-2 text-[12px]">
          {beforeContent && (
            <div className="rounded-lg bg-rose-50/80 border border-rose-200/70 p-2.5">
              <div className="text-[10px] font-bold uppercase tracking-wider text-rose-700 mb-0.5">
                {isPT ? "Antes" : "Before"}
              </div>
              <p className="text-rose-950/80 line-through leading-relaxed whitespace-pre-line">
                {beforeContent}
              </p>
            </div>
          )}

          {afterContent && (
            <div className="rounded-lg bg-emerald-50/80 border border-emerald-200/70 p-2.5">
              <div className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 mb-0.5">
                {beforeContent ? (isPT ? "Depois" : "After") : isPT ? "Conteúdo Proposto" : "Proposed Content"}
              </div>
              <p className="text-emerald-950 leading-relaxed whitespace-pre-line font-medium">
                {afterContent}
              </p>
              {extraMeta && (
                <div className="mt-1.5 pt-1.5 border-t border-emerald-200/60 text-[11px] text-emerald-800 flex items-center gap-1.5">
                  <Sparkles className="h-3 w-3 shrink-0" />
                  <span>{extraMeta}</span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Card Footer Actions */}
        <div className="px-3 py-2 bg-muted/20 border-t border-border flex items-center justify-between gap-2">
          {status === "pending" && (
            <>
              <button
                type="button"
                onClick={() => handleDiscard(msg.id)}
                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[12px] font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              >
                <X className="h-3.5 w-3.5" />
                {isPT ? "Descartar" : "Discard"}
              </button>
              <button
                type="button"
                onClick={() => handleApply(msg.id)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-semibold bg-primary text-primary-foreground hover:opacity-90 transition-opacity shadow-sm"
              >
                <Check className="h-3.5 w-3.5" />
                {isPT ? "Aplicar alteração" : "Apply change"}
              </button>
            </>
          )}

          {status === "applied" && (
            <>
              <span className="inline-flex items-center gap-1.5 text-[12px] font-semibold text-emerald-700">
                <Check className="h-3.5 w-3.5" />
                {isPT ? "Alteração aplicada" : "Change applied"}
              </span>
              <button
                type="button"
                onClick={() => handleRevert(msg.id)}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11.5px] font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              >
                <RotateCcw className="h-3 w-3" />
                {isPT ? "Desfazer" : "Undo"}
              </button>
            </>
          )}

          {status === "discarded" && (
            <>
              <span className="text-[11.5px] text-muted-foreground">
                {isPT ? "Proposta descartada" : "Proposal discarded"}
              </span>
              <button
                type="button"
                onClick={() => handleApply(msg.id)}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11.5px] font-medium text-primary hover:bg-primary/10 transition-colors"
              >
                <Check className="h-3 w-3" />
                {isPT ? "Aplicar mesmo assim" : "Apply anyway"}
              </button>
            </>
          )}
        </div>
      </div>
    );
  };

  if (!open) {
    return (
      <div className="w-12 shrink-0 border-l border-border bg-card flex flex-col items-center py-3 gap-3 z-20">
        <button
          type="button"
          onClick={onToggle}
          className="h-9 w-9 rounded-xl bg-primary/10 hover:bg-primary/20 text-primary flex items-center justify-center transition-all shadow-sm group"
          title={isPT ? "Abrir Copiloto de Edição IA" : "Open AI Edit Copilot"}
        >
          <Sparkles className="h-4 w-4 group-hover:scale-110 transition-transform" />
        </button>
        <span
          onClick={onToggle}
          className="cursor-pointer select-none text-[10px] font-semibold tracking-wider uppercase text-muted-foreground hover:text-primary transition-colors [writing-mode:vertical-rl] rotate-180 mt-2"
        >
          {isPT ? "Editar com IA" : "Edit with AI"}
        </span>
      </div>
    );
  }

  return (
    <aside className="w-[380px] shrink-0 border-l border-border bg-card flex flex-col h-full z-20 animate-fade-in shadow-[-4px_0_16px_rgba(0,0,0,0.04)]">
      {/* Header */}
      <div className="px-4 py-3 border-b border-border flex items-center justify-between gap-2 bg-gradient-to-r from-primary/5 via-primary/[0.02] to-transparent">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="h-8 w-8 rounded-xl bg-primary text-primary-foreground flex items-center justify-center shrink-0 shadow-sm">
            <Sparkles className="h-4 w-4" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="font-semibold text-[13.5px] text-foreground truncate">
                {isPT ? "Copiloto de Edição IA" : "AI Edit Copilot"}
              </span>
              <Badge variant="secondary" className="text-[10px] px-1.5 py-0 h-4 bg-primary/10 text-primary border-0">
                {mode === "pop" ? "POP" : "BPMN"}
              </Badge>
            </div>
            <p className="text-[11px] text-muted-foreground truncate">
              {processName || (mode === "pop" ? "Procedimento Operacional" : "Diagrama de Fluxo")}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onToggle}
          className="h-8 w-8 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors shrink-0"
          title={isPT ? "Recolher painel" : "Collapse panel"}
        >
          <PanelRightClose className="h-4 w-4" />
        </button>
      </div>

      {/* Quick Suggestions Bar */}
      <div className="border-b border-border bg-muted/20 px-3.5 py-2.5">
        <button
          type="button"
          onClick={() => setShowSuggestions((s) => !s)}
          className="w-full flex items-center justify-between text-[11px] font-semibold uppercase tracking-wider text-muted-foreground hover:text-foreground transition-colors"
        >
          <span className="flex items-center gap-1.5">
            <Wand2 className="h-3 w-3 text-primary" />
            {isPT ? "Sugestões de edição rápida" : "Quick edit suggestions"}
          </span>
          {showSuggestions ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
        </button>

        {showSuggestions && (
          <div className="mt-2 flex flex-wrap gap-1.5 max-h-[115px] overflow-y-auto pr-0.5">
            {quickPrompts.map((prompt, idx) => (
              <button
                key={idx}
                type="button"
                disabled={isTyping}
                onClick={() => handleSendPrompt(prompt)}
                className="text-left text-[11.5px] leading-snug px-2.5 py-1.5 rounded-lg bg-card border border-border hover:border-primary/40 hover:bg-primary/5 text-foreground transition-all line-clamp-2 disabled:opacity-50"
              >
                {prompt}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Messages Feed */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 bg-muted/10">
        {messages.map((msg) =>
          msg.role === "ai" ? (
            <div key={msg.id} className="flex gap-2.5 items-start">
              <div className="h-6 w-6 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                <Sparkles className="h-3.5 w-3.5 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="bg-card border border-border rounded-2xl rounded-tl-sm px-3.5 py-2.5 text-[13px] text-foreground leading-relaxed whitespace-pre-line shadow-sm">
                  {renderMarkdownText(msg.content)}
                </div>
                {renderProposalCard(msg)}
                <span className="text-[10px] text-muted-foreground mt-1 block pl-1">{msg.timestamp}</span>
              </div>
            </div>
          ) : (
            <div key={msg.id} className="flex flex-col items-end">
              <div className="bg-primary text-primary-foreground rounded-2xl rounded-tr-sm px-3.5 py-2.5 text-[13px] leading-relaxed max-w-[88%] shadow-sm">
                {msg.content}
              </div>
              <span className="text-[10px] text-muted-foreground mt-1 pr-1">{msg.timestamp}</span>
            </div>
          )
        )}

        {isTyping && (
          <div className="flex gap-2.5 items-start">
            <div className="h-6 w-6 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
              <Sparkles className="h-3.5 w-3.5 text-primary animate-pulse" />
            </div>
            <div className="bg-card border border-border rounded-2xl rounded-tl-sm px-4 py-3 flex gap-1.5 items-center shadow-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-primary/60 animate-bounce [animation-delay:0ms]" />
              <span className="w-1.5 h-1.5 rounded-full bg-primary/60 animate-bounce [animation-delay:150ms]" />
              <span className="w-1.5 h-1.5 rounded-full bg-primary/60 animate-bounce [animation-delay:300ms]" />
            </div>
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="p-3 border-t border-border bg-card">
        <div className="flex gap-2">
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSendPrompt();
              }
            }}
            placeholder={
              mode === "pop"
                ? isPT
                  ? "Peça uma edição no POP (ex: alterar SLA, criar etapa...)"
                  : "Ask to edit the SOP (e.g., change SLA, add step...)"
                : isPT
                  ? "Peça uma edição no BPMN (ex: adicionar tarefa, gateway...)"
                  : "Ask to edit BPMN (e.g., add task, gateway...)"
            }
            className="text-[13px] h-9 bg-muted/30"
            disabled={isTyping}
          />
          <Button
            size="sm"
            className="h-9 px-3 shrink-0"
            onClick={() => handleSendPrompt()}
            disabled={isTyping || !inputValue.trim()}
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
        <p className="text-[10.5px] text-muted-foreground mt-1.5 text-center">
          {isPT
            ? "A IA sempre solicita sua confirmação antes de alterar o documento."
            : "AI always asks for confirmation before modifying the document."}
        </p>
      </div>
    </aside>
  );
}
