import { useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { AnimatePresence, motion } from "motion/react";
import {
  ChevronRight,
  ArrowLeft,
  Plus,
  MoreHorizontal,
  Pencil,
  Copy,
  Trash2,
  Lightbulb,
  Sparkles,
  Bookmark,
  Layers,
  Info,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  L1Process,
  L2Process,
  L3Process,
  L4Task,
  useValueChainStore,
} from "@/stores/valueChainStore";
import { useValueChainCounts, CumulativeCounts } from "@/hooks/useValueChainCounts";
import { useTaxonomy, TaxonomyLevel } from "@/stores/taxonomyStore";
import { useProcessStore, ProcessData } from "@/stores/processStore";
import { CreateEditL1Modal } from "./modals/CreateEditL1Modal";
import { CreateEditL2Modal } from "./modals/CreateEditL2Modal";
import { CreateEditL3Modal } from "./modals/CreateEditL3Modal";
import { CreateEditL4Modal } from "./modals/CreateEditL4Modal";
import { ProcessActionDialog } from "./modals/ProcessActionDialog";
import { ProcessConnectionMapModal } from "@/components/process/connections/ProcessConnectionMapModal";
import { AIGenerationModal } from "./AIGenerationModal";
import { DetailsSidePanel, DetailsTarget } from "./DetailsSidePanel";
import { ValueChainSummaryBar } from "./ValueChainSummaryBar";
import { L1DetailView } from "./L1DetailView";
import { DomainContextRibbon } from "./DomainContextRibbon";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { ScopeContextSheet, BreadcrumbStep, ChildComponentCard } from "./ScopeContextSheet";
import { OperationalProcessView } from "./OperationalProcessView";
import { mockArchitectureData } from "@/data/architectureContextMock";
import { 
  getBusinessIndicatorsByDomain, 
  findDomainNode, 
  findL2Node, 
  findL3Node, 
  findL4Node, 
  getOperationalProcessDetails, 
  getProcessById, 
  getSystemsByDomain 
} from "@/data/architectureContextUtils";

interface ArchitectureCanvasProps {
  onGenerateAI: (option: "full" | "existing" | "new", targetL1Id?: string, newE2EName?: string) => void;
}

// ============================================================
// Main canvas — root shows Value Chain; clicking any element
// opens its standardized Scope & Context Sheet; clicking an
// operational process opens the dedicated BPMN / SOP operational view.
// ============================================================
export function ArchitectureCanvas({ onGenerateAI }: ArchitectureCanvasProps) {
  const [searchParams, setSearchParams] = useSearchParams();
  const { l1Processes } = useValueChainStore();
  const { language } = useLanguage();
  const pt = language === "PT";
  const { label: lvl, maxLevel, hasLevel } = useTaxonomy();

  const l1Id = searchParams.get("l1") || null;
  const l2Id = searchParams.get("l2") || null;
  const l3Id = searchParams.get("l3") || null;
  const l4Id = searchParams.get("l4") || null;
  const processId = searchParams.get("processId") || null;

  const [selectedProcessForAction, setSelectedProcessForAction] = useState<ProcessData | null>(null);
  const [connectionMapProcess, setConnectionMapProcess] = useState<{ id: string; name: string; domain?: string } | null>(null);

  const setParams = (params: Record<string, string | null>) => {
    const next = new URLSearchParams(searchParams);
    Object.entries(params).forEach(([k, v]) => {
      if (v === null) next.delete(k);
      else next.set(k, v);
    });
    setSearchParams(next, { replace: false });
  };

  const goRoot = () => setParams({ l1: null, l2: null, l3: null, l4: null, processId: null, bu: null });

  // Resolve L1
  const l1 = useMemo(() => {
    if (!l1Id) return null;
    return l1Processes.find((x) => x.id === l1Id) || 
           mockArchitectureData.domainsL1.find((d) => d.id === l1Id || d.name.toLowerCase() === l1Id.toLowerCase()) || 
           null;
  }, [l1Processes, l1Id]);

  const l1DomainName = useMemo(() => {
    if (!l1) return "";
    return "namePT" in l1 ? (pt ? l1.namePT : l1.nameEN) : l1.name;
  }, [l1, pt]);

  const mockDomain = useMemo(() => {
    if (!l1) return null;
    return findDomainNode(mockArchitectureData, l1DomainName) || 
           findDomainNode(mockArchitectureData, l1.id) || 
           null;
  }, [l1, l1DomainName]);

  // Resolve L2
  const l2 = useMemo(() => {
    if (!l2Id) return null;
    if (l1 && "l2Processes" in l1) {
      const found = l1.l2Processes.find((x) => x.id === l2Id);
      if (found) return found;
    }
    const fromMock = findL2Node(mockArchitectureData, l2Id);
    return fromMock?.l2 || null;
  }, [l1, l2Id]);

  const mockL2 = useMemo(() => {
    if (!l2Id) return null;
    const fromMock = findL2Node(mockArchitectureData, l2Id);
    return fromMock?.l2 || null;
  }, [l2Id]);

  // Resolve L3
  const l3 = useMemo(() => {
    if (!l3Id) return null;
    if (l2 && "l3Processes" in l2) {
      const found = l2.l3Processes.find((x) => x.id === l3Id);
      if (found) return found;
    }
    const fromMock = findL3Node(mockArchitectureData, l3Id);
    return fromMock?.l3 || null;
  }, [l2, l3Id]);

  const mockL3 = useMemo(() => {
    if (!l3Id) return null;
    const fromMock = findL3Node(mockArchitectureData, l3Id);
    return fromMock?.l3 || null;
  }, [l3Id]);

  // Resolve L4
  const l4 = useMemo(() => {
    if (!l4Id) return null;
    if (l3 && "l4Tasks" in l3) {
      const found = l3.l4Tasks.find((x) => x.id === l4Id);
      if (found) return found;
    }
    const fromMock = findL4Node(mockArchitectureData, l4Id);
    return fromMock?.l4 || null;
  }, [l3, l4Id]);

  const mockL4 = useMemo(() => {
    if (!l4Id) return null;
    const fromMock = findL4Node(mockArchitectureData, l4Id);
    return fromMock?.l4 || null;
  }, [l4Id]);

  // Resolve Operational Process
  const opProcess = useMemo(() => {
    if (!processId) return null;
    return getOperationalProcessDetails(mockArchitectureData, processId);
  }, [processId]);

  const rootLabel = pt ? "Cadeia de Valor" : "Value Chain";

  // Breadcrumbs com navegação completa por toda a árvore
  const breadcrumbs: BreadcrumbStep[] = useMemo(() => {
    const crumbs: BreadcrumbStep[] = [
      { label: rootLabel, onClick: goRoot }
    ];

    if (l1) {
      crumbs.push({
        label: l1DomainName,
        levelLabel: lvl("l1"),
        onClick: () => setParams({ l1: l1.id, l2: null, l3: null, l4: null, processId: null })
      });
    }
    if (l2) {
      crumbs.push({
        label: l2.name,
        levelLabel: lvl("l2"),
        onClick: () => setParams({ l1: l1?.id || null, l2: l2.id, l3: null, l4: null, processId: null })
      });
    }
    if (l3) {
      crumbs.push({
        label: l3.name,
        levelLabel: lvl("l3"),
        onClick: () => setParams({ l1: l1?.id || null, l2: l2?.id || null, l3: l3.id, l4: null, processId: null })
      });
    }
    if (l4) {
      crumbs.push({
        label: l4.name,
        levelLabel: lvl("l4"),
        onClick: () => setParams({ l1: l1?.id || null, l2: l2?.id || null, l3: l3?.id || null, l4: l4.id, processId: null })
      });
    }
    if (opProcess) {
      crumbs.push({
        label: opProcess.name,
        levelLabel: pt ? "Processo" : "Process",
        onClick: () => {}
      });
    }

    return crumbs;
  }, [l1, l1DomainName, l2, l3, l4, opProcess, pt, lvl]);

  return (
    <div className="w-full">
      <AnimatePresence mode="wait">
        <motion.div
          key={(processId || "") + (l4Id || "") + (l3Id || "") + (l2Id || "") + (l1Id || "root")}
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          transition={{ duration: 0.15, ease: "easeOut" }}
        >
          {/* 1. VISÃO DO PROCESSO OPERACIONAL */}
          {opProcess ? (
            <OperationalProcessView
              processDetail={opProcess}
              breadcrumbs={breadcrumbs}
            />
          ) : l4 ? (
            /* 2. FICHA DE ESCOPO L4 (IMEDIATAMENTE ACIMA DO PROCESSO OPERACIONAL) */
            (() => {
              const processes: ChildComponentCard[] = (mockL4?.processes || []).map((p) => ({
                id: p.id,
                name: p.name,
                description: p.description,
                levelKey: "process",
                levelLabel: pt ? "Processo" : "Process",
                isOperationalProcess: true,
                bpmnAvailable: true,
                statsText: pt ? "BPMN disponível · SOP vinculado" : "BPMN available · SOP linked",
                onClick: () => {
                  console.log("Processo clicado:", p);
                  setSelectedProcessForAction(p as any);
                },
              }));

              if (processes.length === 0) {
                processes.push({
                  id: "proc-qualificar-b2b",
                  name: "Qualificar Oportunidade B2B",
                  description: "BPMN disponível · 5 atividades · 4 sistemas · exceções modeladas.",
                  levelKey: "process",
                  levelLabel: pt ? "Processo" : "Process",
                  isOperationalProcess: true,
                  bpmnAvailable: true,
                  statsText: pt ? "BPMN disponível · SOP-042" : "BPMN available · SOP-042",
                  onClick: () => setSelectedProcessForAction({ id: "proc-qualificar-b2b", name: "Qualificar Oportunidade B2B", description: "BPMN disponível · 5 atividades · 4 sistemas · exceções modeladas." } as any),
                });
                processes.push({
                  id: "proc-requalificar-inativo",
                  name: "Requalificar Oportunidade Inativa",
                  description: "BPMN disponível · 7 atividades · 3 sistemas · 1 exceção.",
                  levelKey: "process",
                  levelLabel: pt ? "Processo" : "Process",
                  isOperationalProcess: true,
                  bpmnAvailable: true,
                  statsText: pt ? "BPMN disponível · SOP-043" : "BPMN available · SOP-043",
                  onClick: () => setSelectedProcessForAction({ id: "proc-requalificar-inativo", name: "Requalificar Oportunidade Inativa", description: "BPMN disponível · 7 atividades · 3 sistemas · 1 exceção." } as any),
                });
              }

              return (
                <ScopeContextSheet
                  id={l4.id}
                  name={l4.name}
                  description={mockL4?.description || ("description" in l4 ? (l4 as any).description : "") || "Unidade arquitetural de execução que agrupa os processos operacionais de avaliação e decisão."}
                  levelKey="l4"
                  code={"code" in l4 ? (l4 as any).code : undefined}
                  breadcrumbs={breadcrumbs}
                  responsible={mockL4?.responsibleDetail || ("responsible" in l4 ? (l4 as any).responsible : undefined) || "Liderança de SDR"}
                  businessUnit={mockL4?.businessUnit || ("businessUnit" in l4 ? (l4 as any).businessUnit : undefined) || "Diretoria Comercial"}
                  dimensioning={mockL4?.dimensioning || { allocatedFte: 1, unit: "FTE", referenceDate: "14 set 2026", validationStatus: "validado" }}
                  lastUpdate={mockL4?.lastUpdate || "14 de Setembro de 2026"}
                  validationPercent={mockL4?.contextValidationPercent || 80}
                  objective={mockL4?.objective || "Assegurar que somente oportunidades com potencial comprovado avancem para o time de vendas."}
                  valueProposition={mockL4?.valueProposition || "Uma decisão de encaminhamento rápida, rastreável e baseada em critérios consistentes."}
                  scopeBoundary={mockL4?.scopeBoundary || "Recebe leads priorizados; interage com SDR, Marketing e Executivos de Conta; entrega encaminhamento qualificado."}
                  stakeholders={mockL4?.stakeholders || "SDR, Executivos de Contas, Marketing, Liderança de Vendas"}
                  centralMapType="leaf_parent"
                  childrenComponents={processes}
                  policies={mockL4?.policies || [
                    { id: "pol-1", name: "Política Comercial Corporativa", type: "Política Interna", version: "Rev. 2026", status: "vigente", complianceStatus: "conforme" },
                    { id: "pol-2", name: "LGPD — Tratamento de Dados Comerciais", type: "Norma Regulatória", version: "v2.1", status: "vigente", complianceStatus: "conforme" }
                  ]}
                  indicators={[
                    { name: "SLA de Primeiro Contato", currentValue: "4h", target: "6h", status: "dentro_da_meta" },
                    { name: "Taxa de Qualificação", currentValue: "42%", target: "48%", status: "atencao" }
                  ]}
                  systems={["CRM Salesforce", "HubSpot", "Apollo.io", "Google Calendar"]}
                  painPoints={[
                    "Motivos de perda preenchidos de forma inconsistente no CRM",
                    "Informações de contexto não chegam ao Executivo de Contas"
                  ]}
                />
              );
            })()
          ) : l3 ? (
            /* 3. FICHA DE ESCOPO L3 */
            (() => {
              const childL4s: ChildComponentCard[] = [];
              const isProc = !hasLevel("l4");

              if ("childrenL4" in l3 && l3.childrenL4) {
                l3.childrenL4.forEach((c) => {
                  childL4s.push({
                    id: c.id,
                    name: c.name,
                    description: c.description || (isProc ? (pt ? "Processo Operacional" : "Operational Process") : (pt ? `${c.processes?.length || 0} processos vinculados` : `${c.processes?.length || 0} processes linked`)),
                    levelKey: isProc ? "process" : "l4",
                    levelLabel: isProc ? (pt ? "Processo" : "Process") : lvl("l4"),
                    isOperationalProcess: isProc,
                    bpmnAvailable: isProc,
                    statsText: isProc ? (pt ? "BPMN disponível · SOP vinculado" : "BPMN available · SOP linked") : (pt ? `${c.processes?.length || 0} processos operacionais` : `${c.processes?.length || 0} operational processes`),
                    onClick: () => {
                      if (isProc) {
                        setSelectedProcessForAction(c as any);
                      } else {
                        setParams({ l1: l1Id, l2: l2Id, l3: l3.id, l4: c.id });
                      }
                    },
                  });
                });
              } else if ("l4Tasks" in l3 && (l3 as any).l4Tasks) {
                (l3 as any).l4Tasks.forEach((t: any) => {
                  childL4s.push({
                    id: t.id,
                    name: t.name,
                    description: t.description,
                    levelKey: isProc ? "process" : "l4",
                    levelLabel: isProc ? (pt ? "Processo" : "Process") : lvl("l4"),
                    isOperationalProcess: isProc,
                    bpmnAvailable: isProc,
                    statsText: isProc ? (pt ? "BPMN disponível · SOP vinculado" : "BPMN available · SOP linked") : lvl("l4"),
                    onClick: () => {
                      if (isProc) {
                        setSelectedProcessForAction(t as any);
                      } else {
                        setParams({ l1: l1Id, l2: l2Id, l3: l3.id, l4: t.id });
                      }
                    },
                  });
                });
              }

              return (
                <ScopeContextSheet
                  id={l3.id}
                  name={l3.name}
                  description={mockL3?.description || ("description" in l3 ? (l3 as any).description : "") || "Avalia aderência, contexto e prontidão do lead para definir o encaminhamento comercial mais adequado."}
                  levelKey="l3"
                  code={"code" in l3 ? (l3 as any).code : undefined}
                  breadcrumbs={breadcrumbs}
                  responsible={mockL3?.responsibleDetail || ("responsible" in l3 ? (l3 as any).responsible : undefined) || "Coordenação de SDR"}
                  businessUnit={mockL3?.businessUnit || ("businessUnit" in l3 ? (l3 as any).businessUnit : undefined) || "Diretoria Comercial"}
                  dimensioning={mockL3?.dimensioning || { allocatedFte: 2, unit: "FTE", referenceDate: "14 set 2026", validationStatus: "validado" }}
                  lastUpdate={mockL3?.lastUpdate || "14 de Setembro de 2026"}
                  validationPercent={mockL3?.contextValidationPercent || 70}
                  objective={mockL3?.objective || "Confirmar aderência ao perfil, necessidade, urgência e autoridade para avançar a oportunidade."}
                  valueProposition={mockL3?.valueProposition || "Dar ao time comercial uma oportunidade contextualizada, com próximo passo claro e dados consistentes."}
                  startCondition={mockL3?.startCondition || "Lead priorizado disponível para contato."}
                  endCondition={mockL3?.endCondition || "Reunião agendada, oportunidade desqualificada ou enviada à nutrição."}
                  scopeBoundary={mockL3?.scopeBoundary}
                  stakeholders={mockL3?.stakeholders || "SDR, Marketing, Executivos de Contas (AE)"}
                  centralMapType="intermediate"
                  childrenComponents={childL4s}
                  explicitRelations={mockL3?.explicitRelations || []}
                  policies={mockL3?.policies || [
                    { id: "pol-1", name: "Política Comercial Corporativa", type: "Política Interna", version: "Rev. 2026", status: "vigente", complianceStatus: "conforme" },
                    { id: "pol-2", name: "Política de Privacidade e LGPD", type: "Norma Regulatória", version: "v2.1", status: "vigente", complianceStatus: "conforme" }
                  ]}
                  indicators={[
                    { name: "Tempo até primeiro contato", currentValue: "4h", target: "6h", status: "dentro_da_meta" },
                    { name: "Taxa de qualificação", currentValue: "42%", target: "48%", status: "atencao" },
                    { name: "Show rate de demonstração", currentValue: "78%", target: "75%", status: "dentro_da_meta" }
                  ]}
                  systems={["CRM Salesforce", "Google Calendar", "HubSpot", "Apollo.io"]}
                  evidences={["Regra BANT confirmada pelo Process Owner", "Integração CRM/agenda observada"]}
                  openQuestions={["Critério de priorização para contas estratégicas fora do expediente comercial"]}
                />
              );
            })()
          ) : l2 ? (
            /* 4. FICHA DE ESCOPO L2 */
            (() => {
              const childL3s: ChildComponentCard[] = [];
              const isProc = !hasLevel("l3");

              if ("childrenL3" in l2 && l2.childrenL3) {
                l2.childrenL3.forEach((c) => {
                  childL3s.push({
                    id: c.id,
                    name: c.name,
                    description: c.description || (isProc ? (pt ? "Processo Operacional" : "Operational Process") : (pt ? `${c.childrenL4?.length || 0} componentes ${lvl("l4")}` : `${c.childrenL4?.length || 0} ${lvl("l4")} components`)),
                    levelKey: isProc ? "process" : "l3",
                    levelLabel: isProc ? (pt ? "Processo" : "Process") : lvl("l3"),
                    isOperationalProcess: isProc,
                    bpmnAvailable: isProc,
                    statsText: isProc ? (pt ? "BPMN disponível · SOP vinculado" : "BPMN available · SOP linked") : (pt ? `${c.childrenL4?.length || 0} ${lvl("l4")}` : `${c.childrenL4?.length || 0} ${lvl("l4")}`),
                    onClick: () => {
                      if (isProc) {
                        setSelectedProcessForAction(c as any);
                      } else {
                        setParams({ l1: l1Id, l2: l2.id, l3: c.id, l4: null });
                      }
                    },
                  });
                });
              } else if ("l3Processes" in l2 && (l2 as any).l3Processes) {
                (l2 as any).l3Processes.forEach((p: any) => {
                  childL3s.push({
                    id: p.id,
                    name: p.name,
                    description: p.description,
                    levelKey: isProc ? "process" : "l3",
                    levelLabel: isProc ? (pt ? "Processo" : "Process") : lvl("l3"),
                    isOperationalProcess: isProc,
                    bpmnAvailable: isProc,
                    statsText: isProc ? (pt ? "BPMN disponível · SOP vinculado" : "BPMN available · SOP linked") : (pt ? `${p.l4Tasks?.length || 0} ${lvl("l4")}` : `${p.l4Tasks?.length || 0} ${lvl("l4")}`),
                    onClick: () => {
                      if (isProc) {
                        setSelectedProcessForAction(p as any);
                      } else {
                        setParams({ l1: l1Id, l2: l2.id, l3: p.id, l4: null });
                      }
                    },
                  });
                });
              }

              return (
                <ScopeContextSheet
                  id={l2.id}
                  name={l2.name}
                  description={mockL2?.description || ("description" in l2 ? (l2 as any).description : "") || "Geração de demanda, prospecção ativa e qualificação de oportunidades comerciais."}
                  levelKey="l2"
                  code={"code" in l2 ? (l2 as any).code : undefined}
                  breadcrumbs={breadcrumbs}
                  responsible={mockL2?.responsibleDetail || ("responsible" in l2 ? (l2 as any).responsible : undefined) || "Gerência de Novos Negócios"}
                  businessUnit={mockL2?.businessUnit || ("businessUnit" in l2 ? (l2 as any).businessUnit : undefined) || "Diretoria Comercial"}
                  dimensioning={mockL2?.dimensioning || { allocatedFte: 3, unit: "FTE", referenceDate: "14 set 2026", validationStatus: "validado" }}
                  lastUpdate={mockL2?.lastUpdate || "14 de Setembro de 2026"}
                  validationPercent={mockL2?.contextValidationPercent || 65}
                  objective={mockL2?.objective || "Transformar sinais de mercado em oportunidades qualificadas, priorizadas e prontas para abordagem."}
                  valueProposition={mockL2?.valueProposition || "Entregar oportunidades com aderência ao perfil ideal, contexto suficiente e velocidade de encaminhamento."}
                  startCondition={mockL2?.startCondition || "Campanha, sinal de intenção, indicação, evento ou lista de contas priorizadas disponível."}
                  endCondition={mockL2?.endCondition || "Oportunidade qualificada encaminhada, descartada com motivo ou direcionada para nutrição."}
                  inputs={mockL2?.inputs || "ICP, listas de contas, dados de enriquecimento, respostas de campanhas."}
                  outputs={mockL2?.outputs || "Lead qualificado, reunião agendada, registro atualizado no CRM."}
                  stakeholders={mockL2?.stakeholders || "SDR, Executivo de Contas e Marketing"}
                  centralMapType="intermediate"
                  childrenComponents={childL3s}
                  explicitRelations={mockL2?.explicitRelations || [
                    { id: "rel-1", sourceProcessId: "Geração e Enriquecimento", targetProcessId: "Qualificação e Agendamento", type: "fornece_entrada_para", description: "Geração e Enriquecimento fornece entrada para Qualificação", validationStatus: "validated", confidence: 92 }
                  ]}
                  policies={mockL2?.policies || [
                    { id: "pol-1", name: "Política Comercial Corporativa", type: "Política Interna", version: "Rev. 2026", status: "vigente", complianceStatus: "conforme" },
                    { id: "pol-2", name: "LGPD — Governança de Dados Comerciais", type: "Norma Regulatória", version: "v2.1", status: "vigente", complianceStatus: "conforme" }
                  ]}
                  indicators={[
                    { name: "SLA de Fechamento", currentValue: "92%", target: "95%", status: "atencao" },
                    { name: "Tempo Médio de Ciclo", currentValue: "18 dias", target: "15 dias", status: "atencao" },
                    { name: "Taxa de Conversão", currentValue: "34%", target: "30%", status: "dentro_da_meta" }
                  ]}
                  systems={["CRM Salesforce", "HubSpot Marketing", "Apollo.io"]}
                  painPoints={[
                    "Dados incompletos na passagem Marketing → SDR",
                    "Priorizações manuais sem critério consolidado",
                    "Oportunidade: enriquecimento e roteamento automatizados"
                  ]}
                />
              );
            })()
          ) : l1 ? (
            /* 5. FICHA DE ESCOPO L1 (DOMÍNIO) */
            (() => {
              const childL2s: ChildComponentCard[] = [];
              if ("childrenL2" in l1 && l1.childrenL2) {
                l1.childrenL2.forEach((c) => {
                  childL2s.push({
                    id: c.id,
                    name: c.name,
                    description: c.description || (pt ? `${c.childrenL3?.length || 0} componentes ${lvl("l3")}` : `${c.childrenL3?.length || 0} ${lvl("l3")} components`),
                    levelKey: "l2",
                    levelLabel: lvl("l2"),
                    statsText: pt ? `${c.childrenL3?.length || 0} ${lvl("l3")}` : `${c.childrenL3?.length || 0} ${lvl("l3")}`,
                    onClick: () => setParams({ l1: l1.id, l2: c.id, l3: null, l4: null }),
                  });
                });
              } else if ("l2Processes" in l1 && (l1 as any).l2Processes) {
                (l1 as any).l2Processes.forEach((p: any) => {
                  childL2s.push({
                    id: p.id,
                    name: p.name,
                    description: p.description,
                    levelKey: "l2",
                    levelLabel: lvl("l2"),
                    statsText: pt ? `${p.l3Processes?.length || 0} ${lvl("l3")}` : `${p.l3Processes?.length || 0} ${lvl("l3")}`,
                    onClick: () => setParams({ l1: l1.id, l2: p.id, l3: null, l4: null }),
                  });
                });
              }

              return (
                <ScopeContextSheet
                  id={l1.id}
                  name={l1DomainName}
                  description={mockDomain?.description || ("description" in l1 ? (l1 as any).description : "") || "Orquestra a geração de receita, da prospecção ao sucesso do cliente."}
                  levelKey="l1"
                  code={"code" in l1 ? (l1 as any).code : undefined}
                  breadcrumbs={breadcrumbs}
                  responsible={mockDomain?.responsibleDetail || ("responsible" in l1 ? (l1 as any).responsible : undefined) || "Mariana Vasconcelos"}
                  businessUnit={mockDomain?.businessUnit || ("businessUnit" in l1 ? (l1 as any).businessUnit : undefined) || "Divisão Corporativa"}
                  dimensioning={mockDomain?.dimensioning || { allocatedFte: 4, unit: "FTE", referenceDate: "14 set 2026", validationStatus: "validado" }}
                  lastUpdate={mockDomain?.lastUpdate || "14 de Setembro de 2026"}
                  validationPercent={mockDomain?.contextValidationPercent || 75}
                  objective={mockDomain?.objective || "Gerar receita sustentável, conectando demanda, conversão e retenção de clientes corporativos."}
                  valueProposition={mockDomain?.valueProposition || "Uma jornada comercial previsível, consultiva e integrada, com experiência consistente."}
                  scopeBoundary={mockDomain?.scopeBoundary || "Da geração e qualificação de oportunidades até a ativação e evolução da base de clientes."}
                  stakeholders={mockDomain?.stakeholders || "Entradas: demanda de mercado, dados de ICP, leads. Saídas: oportunidades qualificadas, contratos, receita."}
                  centralMapType="superior"
                  childrenComponents={childL2s}
                  explicitRelations={mockDomain?.explicitRelations || [
                    { id: "rel-1", sourceProcessId: "Prospecção e Qualificação", targetProcessId: "Negociação e Fechamento", type: "fornece_entrada_para", description: "Prospecção fornece oportunidade qualificada para Negociação", validationStatus: "validated", confidence: 95 },
                    { id: "rel-2", sourceProcessId: "Negociação e Fechamento", targetProcessId: "Pós-Venda e Sucesso", type: "fornece_entrada_para", description: "Negociação fornece contrato e contexto para Pós-Venda", validationStatus: "validated", confidence: 90 }
                  ]}
                  policies={mockDomain?.policies || [
                    { id: "pol-1", name: "Política Comercial Corporativa", type: "Política Interna", version: "Rev. 2026", status: "vigente", complianceStatus: "conforme", reviewDueDate: "Dez/2026", responsible: "Compliance Comercial" },
                    { id: "pol-2", name: "LGPD — Governança de Dados Comerciais", type: "Norma Regulatória", version: "v2.1", status: "vigente", complianceStatus: "conforme", reviewDueDate: "Nov/2026", responsible: "DPO" }
                  ]}
                  indicators={[
                    { name: "SLA de Fechamento", currentValue: "92%", target: "95%", status: "atencao" },
                    { name: "Tempo Médio de Ciclo", currentValue: "18 dias", target: "15 dias", status: "atencao" },
                    { name: "Taxa de Conversão", currentValue: "34%", target: "30%", status: "dentro_da_meta" }
                  ]}
                  systems={["CRM Salesforce", "HubSpot", "Apollo.io", "Google Calendar"]}
                />
              );
            })()
          ) : (
            /* 6. NÍVEL RAIZ — VISÃO ESTRUTURAL DA CADEIA DE VALOR */
            <div className="w-full space-y-4">
              <ValueChainSummaryBar />

              {/* Cadeia de Valor */}
              <L1ValueChainView
                l1Processes={l1Processes}
                onSelectL1={(l1Id2) => setParams({ l1: l1Id2, l2: null, l3: null, l4: null, processId: null })}
                onSelectL2={(l1Id2, l2Id2) => setParams({ l1: l1Id2, l2: l2Id2, l3: null, l4: null, processId: null })}
                onGenerateAI={onGenerateAI}
              />
            </div>
          )}
        </motion.div>
      </AnimatePresence>
      <ProcessActionDialog
        open={!!selectedProcessForAction}
        onOpenChange={(isOpen) => {
          if (!isOpen) setSelectedProcessForAction(null);
        }}
        process={selectedProcessForAction}
        onViewDetail={(procId) => {
          setSelectedProcessForAction(null);
          navigate(`/processes/${procId}`);
        }}
        onViewConnectionMap={(proc) => {
          setSelectedProcessForAction(null);
          setConnectionMapProcess({
            id: proc.id,
            name: proc.name,
            domain: proc.l1 || (l1 ? (language === "PT" ? l1.namePT : l1.nameEN) : (language === "PT" ? mockDomain?.namePT : mockDomain?.nameEN) || "Domain"),
          });
        }}
      />

      {connectionMapProcess && (
        <ProcessConnectionMapModal
          open={!!connectionMapProcess}
          onOpenChange={(isOpen) => {
            if (!isOpen) setConnectionMapProcess(null);
          }}
          initialProcessId={connectionMapProcess.id}
          initialProcessName={connectionMapProcess.name}
          initialDomain={connectionMapProcess.domain}
          onNavigateToProcess={(procId) => {
            setConnectionMapProcess(null);
            navigate(`/processes/${procId}`);
          }}
        />
      )}
    </div>
  );
}


// ============================================================
// Breadcrumb — root + current L1
// ============================================================
function DrilldownBreadcrumb({
  level,
  l1,
  l2,
  onGoRoot,
  onGoL1,
}: {
  level: "l1" | "l1detail" | "l2detail";
  l1: L1Process | null;
  l2?: L2Process | null;
  onGoRoot: () => void;
  onGoL1: () => void;
}) {
  const { language } = useLanguage();
  const rootLabel = language === "PT" ? "Cadeia de Valor" : "Value Chain";
  const getL1Name = (x: L1Process) => (language === "PT" ? x.namePT : x.nameEN);

  return (
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center gap-2 text-sm">
        {level !== "l1" && (
          <button
            onClick={onGoRoot}
            className="flex items-center gap-1 text-[#A5A7B0] hover:text-[#0C1BA8] transition-colors mr-2 pr-2 border-r border-[#A5A7B0]/30"
          >
            <ArrowLeft className="h-4 w-4" />
            {language === "PT" ? "Voltar" : "Back"}
          </button>
        )}
        <button
          onClick={onGoRoot}
          className={cn(
            "transition-colors",
            level === "l1"
              ? "text-[#272727] font-semibold cursor-default"
              : "text-[#A5A7B0] hover:text-[#0C1BA8]"
          )}
        >
          {rootLabel}
        </button>
        {l1 && (
          <>
            <ChevronRight className="h-3.5 w-3.5 text-[#A5A7B0]/60" />
            <span
              className={cn(
                "flex items-center gap-1.5",
                l2 ? "text-[#A5A7B0] hover:text-[#0C1BA8] cursor-pointer" : "text-[#272727] font-semibold cursor-default"
              )}
              onClick={l2 ? onGoL1 : undefined}
            >
              <LevelChip level="L1" />
              <span className="truncate max-w-[220px]">{getL1Name(l1)}</span>
            </span>
          </>
        )}
        {l2 && (
          <>
            <ChevronRight className="h-3.5 w-3.5 text-[#A5A7B0]/60" />
            <span className="flex items-center gap-1.5 text-[#272727] font-semibold">
              <LevelChip level="L2" />
              <span className="truncate max-w-[240px]">{l2.name}</span>
            </span>
          </>
        )}
      </div>

    </div>
  );
}


function LevelChip({ level }: { level: "L1" | "L2" | "L3" | "L4" }) {
  const { label } = useTaxonomy();
  return (
    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-sm bg-[#c9dcf2] text-[#0C1BA8] uppercase tracking-wide">
      {label(level.toLowerCase() as TaxonomyLevel)}
    </span>
  );
}

// ============================================================
// Level Card (shared)
// ============================================================
function LevelCard({
  level,
  title,
  description,
  counts,
  variant = "default",
  onClick,
  actions,
  meta,
}: {
  level: "L1" | "L2" | "L3" | "L4";
  title: string;
  description?: string;
  counts?: CumulativeCounts;
  variant?: "default" | "primary" | "support";
  onClick: () => void;
  actions?: React.ReactNode;
  meta?: React.ReactNode;
}) {
  const { language } = useLanguage();
  const { label: lvl } = useTaxonomy();
  const isPrimary = variant === "primary";

  const bg = isPrimary ? "#0C1BA8" : variant === "support" ? "#c9dcf2" : "#ffffff";
  const border = isPrimary ? "#0C1BA8" : variant === "support" ? "#c9dcf2" : "#A5A7B0";
  const titleColor = isPrimary ? "#ffffff" : "#272727";
  const subColor = isPrimary ? "rgba(255,255,255,0.72)" : "#A5A7B0";

  return (
    <div className="relative group h-full">
      <button
        onClick={onClick}
        className="w-full h-full text-left p-4 rounded-sm border transition-all duration-150 hover:border-[#0C1BA8] hover:shadow-[0_4px_14px_rgba(12,27,168,0.08)] flex flex-col"
        style={{ backgroundColor: bg, borderColor: `${border}${variant === "default" ? "40" : ""}` }}
      >
        <div className="flex items-center gap-1.5 mb-1.5">
          <span
            className="text-[10px] font-bold px-1.5 py-0.5 rounded-sm uppercase tracking-wide"
            style={{
              backgroundColor: isPrimary ? "rgba(255,255,255,0.16)" : "#c9dcf2",
              color: isPrimary ? "#ffffff" : "#0C1BA8",
            }}
          >
            {lvl(level.toLowerCase() as TaxonomyLevel)}
          </span>
          {meta}
        </div>
        <h4 className="font-medium text-sm leading-tight mb-1 line-clamp-2" style={{ color: titleColor }}>
          {title}
        </h4>
        {description && (
          <p className="text-xs line-clamp-2 mb-3" style={{ color: subColor }}>
            {description}
          </p>
        )}

        {counts && (
          <div className="mt-auto pt-2 flex items-center flex-wrap gap-x-2 gap-y-0.5 text-[11px]" style={{ color: subColor }}>
            {counts.l2 > 0 && <span>{counts.l2} {lvl("l2")}</span>}
            {counts.l2 > 0 && (counts.l3 > 0 || counts.l4 > 0 || counts.processes > 0) && <Dot />}
            {counts.l3 > 0 && <span>{counts.l3} {lvl("l3")}</span>}
            {counts.l3 > 0 && (counts.l4 > 0 || counts.processes > 0) && <Dot />}
            {counts.l4 > 0 && <span>{counts.l4} {lvl("l4")}</span>}
            {counts.l4 > 0 && counts.processes >= 0 && <Dot />}
            <span className={cn(counts.processes > 0 && "font-semibold")} style={{ color: counts.processes > 0 ? (isPrimary ? "#fff" : "#0C1BA8") : subColor }}>
              {counts.processes} {language === "PT" ? "processos" : "processes"}
            </span>
          </div>
        )}
      </button>

      {actions && (
        <div
          className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={(e) => e.stopPropagation()}
        >
          {actions}
        </div>
      )}
    </div>
  );
}

function Dot() {
  return <span className="opacity-50">·</span>;
}

// ============================================================
// L1 View — horizontal value chain (Porter-inspired)
// ============================================================
function L1ValueChainView({
  l1Processes,
  onSelectL1,
  onSelectL2,
  onGenerateAI,
}: {
  l1Processes: L1Process[];
  onSelectL1: (l1Id: string) => void;
  onSelectL2: (l1Id: string, l2Id: string) => void;
  onGenerateAI: (option: "full" | "existing" | "new", targetL1Id?: string, newE2EName?: string) => void;
}) {
  const { language } = useLanguage();
  const { addL1, updateL1, deleteL1 } = useValueChainStore();
  const { label: lvl, maxLevel } = useTaxonomy();
  const { l1Counts, l2Counts } = useValueChainCounts();

  // Compact L2 list rendered under each L1 block on the root screen.
  const renderL2List = (l1: L1Process, layout: "row" | "column") => {
    if (l1.l2Processes.length === 0) {
      return (
        <div className="mt-2 text-[11px] text-[#A5A7B0] italic px-1">
          {language === "PT" ? `Sem ${lvl("l2")}` : `No ${lvl("l2")}`}
        </div>
      );
    }
    return (
      <div
        className={cn(
          "mt-2",
          layout === "row"
            ? "grid gap-1.5 [grid-template-columns:repeat(auto-fill,minmax(230px,1fr))]"
            : "flex flex-col gap-1.5"
        )}
      >
        {l1.l2Processes.map((l2) => {
          const c = l2Counts(l2);
          return (
            <button
              key={l2.id}
              onClick={() => onSelectL2(l1.id, l2.id)}
              className="text-left rounded-sm border border-[#DFE5EF] bg-white px-2.5 py-2 transition-all hover:border-[#1327B9] hover:shadow-[0_2px_8px_rgba(19,39,185,0.08)] group"
            >
              <span className="block text-[12px] font-medium leading-snug text-[#272727] break-words group-hover:text-[#1327B9]">
                {l2.name}
              </span>
              <span className="mt-1 flex flex-wrap items-center gap-1.5 text-[10px] text-[#71809A]">
                <span className="inline-block rounded-[2px] bg-[#EFE8FF] px-1 py-[1px] text-[9px] font-bold uppercase tracking-wide leading-none text-[#6633D0]">
                  {lvl("l2")} · {language === "PT" ? "composição" : "composition"}
                </span>
                {c.l3 > 0 && maxLevel >= 3 && <span>{c.l3} {lvl("l3")}</span>}
                {c.l3 > 0 && maxLevel >= 3 && <span className="opacity-60">·</span>}
                <span className={cn(c.processes > 0 && "text-[#1327B9] font-semibold")}>
                  {c.processes} {language === "PT" ? "proc." : "proc."}
                </span>
              </span>
            </button>
          );
        })}
      </div>
    );
  };



  const [showL1Modal, setShowL1Modal] = useState(false);
  const [showAIModal, setShowAIModal] = useState(false);
  const [editingL1, setEditingL1] = useState<L1Process | null>(null);
  const [deletingL1, setDeletingL1] = useState<L1Process | null>(null);
  const [detailsTarget, setDetailsTarget] = useState<DetailsTarget>(null);

  const support = l1Processes.filter((x) => x.category === "SUPPORT");
  const primary = l1Processes.filter((x) => x.category === "PRIMARY");

  const getName = (x: L1Process) => (language === "PT" ? x.namePT : x.nameEN);

  const handleSaveL1 = (data: { nameEN: string; namePT: string; category: "SUPPORT" | "PRIMARY"; description?: string }) => {
    if (editingL1) {
      updateL1(editingL1.id, data);
      toast.success(language === "PT" ? `${lvl("l1")} atualizado` : `${lvl("l1")} updated`);
    } else {
      addL1(data);
      toast.success(language === "PT" ? `${lvl("l1")} criado` : `${lvl("l1")} created`);
    }
  };

  const cardActions = (l1: L1Process, isPrimary: boolean) => (
    <>
      <button
        title={language === "PT" ? "Detalhes" : "Details"}
        onClick={(e) => {
          e.stopPropagation();
          setDetailsTarget({ level: "L1", l1Id: l1.id, itemId: l1.id });
        }}
        className={cn(
          "p-1.5 rounded-sm transition-colors",
          isPrimary ? "hover:bg-white/20 text-white" : "hover:bg-black/10 text-[#272727]"
        )}
      >
        <Info className="h-4 w-4" />
      </button>
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className={cn(
            "p-1.5 rounded-sm transition-colors",
            isPrimary ? "hover:bg-white/20 text-white" : "hover:bg-black/10 text-[#272727]"
          )}
        >
          <MoreHorizontal className="h-4 w-4" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="rounded-sm">
        <DropdownMenuItem
          onClick={() => {
            setEditingL1(l1);
            setShowL1Modal(true);
          }}
        >
          <Pencil className="h-3.5 w-3.5 mr-2" />
          {language === "PT" ? "Editar" : "Edit"}
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => {
            addL1({
              nameEN: `${l1.nameEN} (Copy)`,
              namePT: `${l1.namePT} (Cópia)`,
              category: l1.category,
              description: l1.description,
              domain: l1.domain,
              frequency: l1.frequency,
              responsible: l1.responsible,
              structure: l1.structure,
            });
            toast.success(language === "PT" ? `${lvl("l1")} duplicado` : `${lvl("l1")} duplicated`);
          }}
        >
          <Copy className="h-3.5 w-3.5 mr-2" />
          {language === "PT" ? "Duplicar" : "Duplicate"}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setDeletingL1(l1)} className="text-destructive">
          <Trash2 className="h-3.5 w-3.5 mr-2" />
          {language === "PT" ? "Excluir" : "Delete"}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
    </>
  );

  return (
    <div>
      {/* Header actions */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-[#272727]">
            {language === "PT" ? "Cadeia de Valor" : "Value Chain"}
          </h1>
          <p className="text-sm text-[#A5A7B0] mt-1">
            {language === "PT"
              ? `Explore a arquitetura de processos navegando de ${lvl("l1")} até ${lvl(`l${maxLevel}` as TaxonomyLevel)}`
              : `Explore the process architecture drilling down from ${lvl("l1")} to ${lvl(`l${maxLevel}` as TaxonomyLevel)}`}
          </p>
        </div>

        <div className="flex gap-2">
          <Button
            onClick={() => setShowAIModal(true)}
            variant="outline"
            size="sm"
            className="rounded-sm border-[#A5A7B0]/40 text-[#272727]"
          >
            <Sparkles className="h-4 w-4 mr-2" />
            {language === "PT" ? "Gerar com IA" : "Generate with AI"}
          </Button>
          <Button
            onClick={() => {
              setEditingL1(null);
              setShowL1Modal(true);
            }}
            size="sm"
            className="rounded-sm bg-[#0C1BA8] hover:bg-[#04223D] text-white"
          >
            <Plus className="h-4 w-4 mr-2" />
            {language === "PT" ? "Criar jornada E2E" : "Create E2E Journey"}
          </Button>
        </div>
      </div>

      {/* Support activities — stacked full-width chevrons */}
      <section className="mb-8">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-[11px] font-bold text-[#A5A7B0] uppercase tracking-wider">
            {language === "PT" ? "Domínios de suporte" : "Support Domains"}
          </span>
          <span className="text-[11px] text-[#A5A7B0]/70">
            {support.length} {language === "PT" ? "domínios" : "domains"}
          </span>
        </div>
        {support.length > 0 ? (
          <div className="flex flex-col gap-1.5">
            {support.map((l1) => {
              const notch = 14;
              const clipPath = `polygon(0 0, calc(100% - ${notch}px) 0, 100% 50%, calc(100% - ${notch}px) 100%, 0 100%)`;
              const c = l1Counts(l1);
              return (
                <div key={l1.id} className="w-full">
                  <div className="group relative w-full">
                    <button
                      onClick={() => onSelectL1(l1.id)}
                      className="w-full text-left bg-[#0C1BA8] hover:bg-[#04223D] transition-colors duration-150 flex items-center gap-3 cursor-pointer"
                      style={{
                        clipPath,
                        WebkitClipPath: clipPath,
                        paddingLeft: 14,
                        paddingRight: 32,
                        paddingTop: 8,
                        paddingBottom: 8,
                        minHeight: 52,
                      }}
                    >
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-sm bg-white/20 text-white uppercase tracking-wide shrink-0">
                        {lvl("l1")}
                      </span>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-[13px] leading-tight text-white truncate mb-1">
                          {getName(l1)}
                        </h4>
                        <div className="flex items-center gap-x-2 text-[11px] text-white/75 truncate">
                          {c.l2 > 0 && <span>{c.l2} {lvl("l2")}</span>}
                          {c.processes > 0 && <span className="font-semibold text-white">· {c.processes} proc.</span>}
                          <span className="opacity-60 truncate">
                            {(() => {
                              const md = mockArchitectureData.domainsL1.find(d => d.id === l1.id || d.name === getName(l1));
                              if (!md) return null;
                              const ind = getBusinessIndicatorsByDomain(mockArchitectureData, md.id)[0];
                              const sysCount = md.childrenL2.reduce((acc, l2) => acc + l2.childrenL3.reduce((a, l3) => a + l3.childrenL4.reduce((b, l4) => b + l4.processes.reduce((c, p) => c + p.systemsUsed.length, 0), 0), 0), 0);
                              return ` · ${sysCount} sistemas ${ind ? ` · KPI: ${ind.currentValue}` : ''}`;
                            })()}
                          </span>
                        </div>
                      </div>
                    </button>
                    <div
                      className="absolute top-1.5 opacity-0 group-hover:opacity-100 transition-opacity"
                      style={{ right: notch + 6 }}
                      onClick={(e) => e.stopPropagation()}
                    >
                      {cardActions(l1, true)}
                    </div>
                  </div>
                  <div className="pl-3 pb-1">{renderL2List(l1, "row")}</div>
                </div>

              );
            })}
          </div>
        ) : (
          <EmptyState label={language === "PT" ? "Nenhuma atividade de suporte" : "No support activities"} />
        )}
      </section>

      {/* Primary activities — chained flow */}
      <section>
        <div className="flex items-center gap-2 mb-3">
          <span className="text-[11px] font-bold text-[#A5A7B0] uppercase tracking-wider">
            {language === "PT" ? "Domínios primários" : "Primary Domains"}
          </span>
          <span className="text-[11px] text-[#A5A7B0]/70">
            {primary.length} {language === "PT" ? "domínios" : "domains"}
          </span>
        </div>
        {primary.length > 0 ? (
          <div className="flex items-start overflow-x-auto pb-2">
            {primary.map((l1, idx) => {
              const isFirst = idx === 0;
              const notch = 18;
              const clipPath = isFirst
                ? `polygon(0 0, calc(100% - ${notch}px) 0, 100% 50%, calc(100% - ${notch}px) 100%, 0 100%)`
                : `polygon(0 0, calc(100% - ${notch}px) 0, 100% 50%, calc(100% - ${notch}px) 100%, 0 100%, ${notch}px 50%)`;
              const c = l1Counts(l1);
              return (
                <div
                  key={l1.id}
                  className="flex-1 min-w-[220px]"
                  style={{ marginLeft: isFirst ? 0 : -notch + 2 }}
                >
                  <div className="group relative">
                    <button
                      onClick={() => onSelectL1(l1.id)}
                      className="w-full text-left bg-[#0C1BA8] hover:bg-[#04223D] transition-colors duration-150 flex flex-col justify-center cursor-pointer"
                      style={{
                        clipPath,
                        WebkitClipPath: clipPath,
                        paddingLeft: isFirst ? 20 : 32,
                        paddingRight: 32,
                        paddingTop: 14,
                        paddingBottom: 14,
                        minHeight: 96,
                      }}
                    >
                      <div className="flex items-center gap-1.5 mb-1">
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-sm bg-white/20 text-white uppercase tracking-wide">
                          {lvl("l1")}
                        </span>
                      </div>
                      <h4 className="font-medium text-sm leading-tight text-white truncate">
                        {getName(l1)}
                      </h4>
                      <div className="mt-1 flex flex-col gap-1 text-[11px] text-white/75">
                        <div className="flex items-center gap-x-2 truncate">
                          {c.l2 > 0 && <span>{c.l2} {lvl("l2")}</span>}
                          {c.processes > 0 && <span className="font-semibold text-white">· {c.processes} proc.</span>}
                        </div>
                        <div className="opacity-75 truncate">
                           {(() => {
                              const md = mockArchitectureData.domainsL1.find(d => d.id === l1.id || d.name === getName(l1));
                              if (!md) return null;
                              const ind = getBusinessIndicatorsByDomain(mockArchitectureData, md.id)[0];
                              const sysCount = md.childrenL2.reduce((acc, l2) => acc + l2.childrenL3.reduce((a, l3) => a + l3.childrenL4.reduce((b, l4) => b + l4.processes.reduce((c, p) => c + p.systemsUsed.length, 0), 0), 0), 0);
                              return `${sysCount} sistemas ${ind ? ` · KPI: ${ind.currentValue}` : ''}`;
                            })()}
                        </div>
                      </div>
                    </button>
                    <div
                      className="absolute top-1.5 opacity-0 group-hover:opacity-100 transition-opacity"
                      style={{ right: notch + 6 }}
                      onClick={(e) => e.stopPropagation()}
                    >
                      {cardActions(l1, true)}
                    </div>
                  </div>
                  <div
                    className="pr-3"
                    style={{ paddingLeft: isFirst ? 4 : notch }}
                  >
                    {renderL2List(l1, "column")}
                  </div>
                </div>
              );
            })}
          </div>

        ) : (
          <EmptyState label={language === "PT" ? "Nenhuma atividade primária" : "No primary activities"} />
        )}
      </section>

      {/* Modals */}
      <DetailsSidePanel target={detailsTarget} onClose={() => setDetailsTarget(null)} />
      <CreateEditL1Modal
        open={showL1Modal}
        onOpenChange={setShowL1Modal}
        onSave={handleSaveL1}
        editingL1={editingL1}
      />
      <AIGenerationModal
        open={showAIModal}
        onOpenChange={setShowAIModal}
        existingL1s={l1Processes}
        onGenerate={onGenerateAI}
      />
      <AlertDialog open={!!deletingL1} onOpenChange={() => setDeletingL1(null)}>
        <AlertDialogContent className="rounded-sm">
          <AlertDialogHeader>
            <AlertDialogTitle>
              {language === "PT" ? `Excluir ${lvl("l1")}?` : `Delete ${lvl("l1")}?`}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {deletingL1 && deletingL1.l2Processes.length > 0
                ? language === "PT"
                  ? `Este ${lvl("l1")} possui ${deletingL1.l2Processes.length} ${lvl("l2")}(s). Todos serão removidos.`
                  : `This ${lvl("l1")} has ${deletingL1.l2Processes.length} ${lvl("l2")}(s). All will be removed.`
                : language === "PT"
                ? "Esta ação não pode ser desfeita."
                : "This action cannot be undone."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-sm">
              {language === "PT" ? "Cancelar" : "Cancel"}
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (deletingL1) {
                  deleteL1(deletingL1.id);
                  toast.success(language === "PT" ? `${lvl("l1")} excluído` : `${lvl("l1")} deleted`);
                  setDeletingL1(null);
                }
              }}
              className="rounded-sm bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {language === "PT" ? "Excluir" : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

// ============================================================
// ChevronCard — chevron-arrow shape used for L2/L3/L4 flows
// ============================================================
const CHEVRON_TONES = {
  l2: { bg: "#0C1BA8", hover: "#04223D" },
  l3: { bg: "#3B4CC0", hover: "#2A3AA8" },
  l4: { bg: "#6875D5", hover: "#5561C0" },
} as const;

function ChevronCard({
  index,
  levelLabel,
  title,
  subtitle,
  active = false,
  onClick,
  actions,
  tone,
  minWidth = 180,
  statusDot,
  orientation = "row",
}: {
  index: number;
  levelLabel: "L2" | "L3" | "L4";
  title: string;
  subtitle?: React.ReactNode;
  active?: boolean;
  onClick: () => void;
  actions?: React.ReactNode;
  tone: keyof typeof CHEVRON_TONES;
  minWidth?: number;
  statusDot?: string;
  // "row" = horizontal chain (chevrons interlocking sideways)
  // "stack" = standalone chevron rendered full-width in a vertical stack
  orientation?: "row" | "stack";
}) {
  const { label: lvl } = useTaxonomy();
  const isFirst = index === 0;
  const notch = 16;
  const isStack = orientation === "stack";
  // Stacked chevrons always render as standalone right-pointing arrows.
  const clipPath =
    isStack || isFirst
      ? `polygon(0 0, calc(100% - ${notch}px) 0, 100% 50%, calc(100% - ${notch}px) 100%, 0 100%)`
      : `polygon(0 0, calc(100% - ${notch}px) 0, 100% 50%, calc(100% - ${notch}px) 100%, 0 100%, ${notch}px 50%)`;
  const t = CHEVRON_TONES[tone];

  return (
    <div
      className={cn("group relative", isStack ? "w-full" : "flex-1")}
      style={{
        minWidth: isStack ? undefined : minWidth,
        marginLeft: isStack || isFirst ? 0 : -notch + 2,
      }}
    >
      <button
        onClick={onClick}
        className="w-full h-full text-left flex flex-col justify-center transition-colors"
        style={{
          clipPath,
          WebkitClipPath: clipPath,
          background: active ? t.hover : t.bg,
          paddingLeft: isStack || isFirst ? 18 : 30,
          paddingRight: 30,
          paddingTop: 12,
          paddingBottom: 12,
          minHeight: 78,
        }}
        onMouseEnter={(e) => (e.currentTarget.style.background = t.hover)}
        onMouseLeave={(e) =>
          (e.currentTarget.style.background = active ? t.hover : t.bg)
        }
      >
        <div className="flex items-center gap-1.5 mb-0.5">
          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-sm bg-white/20 text-white uppercase tracking-wide">
            {lvl(levelLabel.toLowerCase() as TaxonomyLevel)}
          </span>
          {statusDot && (
            <span
              className="inline-block w-1.5 h-1.5 rounded-full"
              style={{ background: statusDot }}
            />
          )}
        </div>
        <h4 className="font-medium text-[13px] leading-tight text-white line-clamp-2">
          {title}
        </h4>
        {subtitle && (
          <div className="mt-1 text-[10px] text-white/70 truncate">{subtitle}</div>
        )}
      </button>
      {actions && (
        <div
          className="absolute top-1.5 opacity-0 group-hover:opacity-100 transition-opacity"
          style={{ right: notch + 6 }}
          onClick={(e) => e.stopPropagation()}
        >
          {actions}
        </div>
      )}
    </div>
  );
}

function ChevronRow({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-stretch overflow-x-auto pb-2">{children}</div>
  );
}

// Chevron-shaped container that visually "wraps" child chevrons —
// gives the impression that the expanded level lives inside its parent.
function ChevronContainer({
  tone,
  children,
}: {
  tone: keyof typeof CHEVRON_TONES;
  children: React.ReactNode;
}) {
  const notch = 20;
  const clipPath = `polygon(0 0, calc(100% - ${notch}px) 0, 100% 50%, calc(100% - ${notch}px) 100%, 0 100%, ${notch}px 50%)`;
  const t = CHEVRON_TONES[tone];
  return (
    <div
      className="relative"
      style={{
        clipPath,
        WebkitClipPath: clipPath,
        background: t.bg,
        paddingLeft: notch + 10,
        paddingRight: notch + 10,
        paddingTop: 12,
        paddingBottom: 12,
      }}
    >
      {children}
    </div>
  );
}

// ============================================================
// ============================================================
// ProcessDrilldown — the process list is always the last layer
// ============================================================
function ProcessDrilldown({
  level,
  name,
  onSelectProcess,
}: {
  level: "l3" | "l4";
  name: string;
  onSelectProcess?: (process: ProcessData) => void;
}) {
  const { language } = useLanguage();
  const navigate = useNavigate();
  const processes = useProcessStore((s) => s.processes);
  const list = processes.filter(
    (p) => !p.isTemplate && (level === "l3" ? p.l3 === name : p.l4 === name)
  );

  if (list.length === 0) {
    return (
      <div className="w-full text-center py-3 rounded-sm border border-dashed border-[#A5A7B0]/40 text-[#A5A7B0] text-xs">
        {language === "PT" ? "Nenhum processo cadastrado" : "No process registered"}
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col gap-1.5">
      {list.map((p) => (
        <button
          key={p.id}
          type="button"
          onClick={() => {
            if (onSelectProcess) {
              onSelectProcess(p);
            } else {
              navigate(`/processes/${p.id}`);
            }
          }}
          className="w-full text-left rounded-md border border-[#A5A7B0]/30 bg-white hover:border-[#0C1BA8] hover:bg-slate-50/70 hover:shadow-xs transition-all px-2.5 py-2 group/item cursor-pointer block"
        >
          <div className="flex items-center justify-between gap-1 mb-1">
            <div className="flex items-center gap-1.5">
              <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-[#EEF0FF] text-[#0C1BA8] uppercase tracking-wide">
                {language === "PT" ? "Processo" : "Process"}
              </span>
              <span
                className="inline-block w-1.5 h-1.5 rounded-full shrink-0"
                style={{ background: p.hasDocumentation ? "#22c55e" : "#D1D5DB" }}
                title={p.hasDocumentation ? (language === "PT" ? "Documentado" : "Documented") : (language === "PT" ? "Pendente" : "Pending")}
              />
            </div>
            <span className="text-[10px] text-[#A5A7B0] group-hover/item:text-[#0C1BA8] font-medium transition-colors">
              {language === "PT" ? "Opções" : "Options"} →
            </span>
          </div>
          <div className="text-[12px] font-semibold text-[#272727] group-hover/item:text-[#0C1BA8] leading-tight transition-colors line-clamp-2">
            {p.name}
          </div>
        </button>
      ))}
      {/* Process Action Dialog & Connection Map Modal */}
      <ProcessActionDialog
        open={!!selectedProcessForAction}
        onOpenChange={(isOpen) => {
          if (!isOpen) setSelectedProcessForAction(null);
        }}
        process={selectedProcessForAction}
        onViewDetail={(procId) => {
          setSelectedProcessForAction(null);
          navigate(`/processes/${procId}`);
        }}
        onViewConnectionMap={(proc) => {
          setSelectedProcessForAction(null);
          setConnectionMapProcess({
            id: proc.id,
            name: proc.name,
            domain: proc.l1 || getL1Name(l1 || mockDomain || { namePT: "Domain", nameEN: "Domain" } as any),
          });
        }}
      />

      {connectionMapProcess && (
        <ProcessConnectionMapModal
          open={!!connectionMapProcess}
          onOpenChange={(isOpen) => {
            if (!isOpen) setConnectionMapProcess(null);
          }}
          initialProcessId={connectionMapProcess.id}
          initialProcessName={connectionMapProcess.name}
          initialDomain={connectionMapProcess.domain}
          onNavigateToProcess={(procId) => {
            setConnectionMapProcess(null);
            navigate(`/processes/${procId}`);
          }}
        />
      )}
    </div>
  );
}

// L2 Inline View — L2 → L3 → L4 rendered as chained chevron flows
// ============================================================
function L2DetailView({
  l1,
  l2Id,
}: {
  l1: L1Process;
  l2Id: string;
}) {
  const { language } = useLanguage();
  const navigate = useNavigate();
  const {
    l1Processes,
    addL2,
    deleteL2,
    deleteL3,
    deleteL4,
  } = useValueChainStore();
  const { l2Counts, l3Counts, l4Counts } = useValueChainCounts();
  const { label: lvl, hasLevel, maxLevel } = useTaxonomy();

  const rawL1 = l1Processes.find((x) => x.id === l1.id) || l1;
  const currentL1 = rawL1;
  const currentL2 = currentL1.l2Processes.find((x) => x.id === l2Id) || null;
  const counts = currentL2
    ? l2Counts(currentL2)
    : { l2: 0, l3: 0, l4: 0, processes: 0 };



  // ---- Modals ----
  const [l2Modal, setL2Modal] = useState<{ open: boolean; editing: L2Process | null }>({
    open: false,
    editing: null,
  });
  const [l3Modal, setL3Modal] = useState<{
    open: boolean;
    l2Id: string | null;
    editing: L3Process | null;
  }>({ open: false, l2Id: null, editing: null });
  const [l4Modal, setL4Modal] = useState<{
    open: boolean;
    l2Id: string | null;
    l3Id: string | null;
    editing: L4Task | null;
  }>({ open: false, l2Id: null, l3Id: null, editing: null });

  const [detailsTarget, setDetailsTarget] = useState<DetailsTarget>(null);
  // Leaf drilldown: which L3/L4 has its process list expanded
  const [expandedLeaf, setExpandedLeaf] = useState<Record<string, boolean>>({});
  const toggleLeaf = (id: string) =>
    setExpandedLeaf((prev) => ({ ...prev, [id]: !prev[id] }));

  // Process Click Action & Connection Map Modal states
  const [selectedProcessForAction, setSelectedProcessForAction] = useState<ProcessData | null>(null);
  const [connectionMapProcess, setConnectionMapProcess] = useState<{ id: string; name: string; domain?: string } | null>(null);

  const [deletingL2, setDeletingL2] = useState<L2Process | null>(null);
  const [deletingL3, setDeletingL3] = useState<{ l2Id: string; l3: L3Process } | null>(
    null
  );
  const [deletingL4, setDeletingL4] = useState<{
    l2Id: string;
    l3Id: string;
    l4: L4Task;
  } | null>(null);

  const getL1Name = (x: L1Process) => (language === "PT" ? x.namePT : x.nameEN);

  const mockDomain = useMemo(() => {
    return findDomainNode(mockArchitectureData, getL1Name(currentL1)) || findDomainNode(mockArchitectureData, currentL1.id);
  }, [currentL1, language]);

  const domainProcs = useMemo(() => {
    const procs: ProcessContextData[] = [];
    if (mockDomain) {
      mockDomain.childrenL2.forEach(l2 => l2.childrenL3.forEach(l3 => l3.childrenL4.forEach(l4 => procs.push(...l4.processes))));
    }
    return procs;
  }, [mockDomain]);

  const domainDocPercent = domainProcs.length ? Math.round((domainProcs.filter(p => p.documentationStatus === 'approved').length / domainProcs.length) * 100) : 86;
  const domainCtxPercent = domainProcs.length ? Math.round((domainProcs.filter(p => p.contextValidationStatus === 'validated').length / domainProcs.length) * 100) : 72;
  const domainJourneysCount = useMemo(() => {
    return mockArchitectureData.journeys.filter(j => j.coveredL1.some(d => d.toLowerCase().includes(getL1Name(currentL1).toLowerCase()))).length || 3;
  }, [currentL1, language]);
  const domainSystemsCount = useMemo(() => {
    return getSystemsByDomain(mockArchitectureData, currentL1.id).length || 5;
  }, [currentL1]);
  const domainMainKpi = mockDomain?.mainKpi || "92%";

  const openProcessesForL4 = (l4Name: string) =>
    navigate(`/processes?l4=${encodeURIComponent(l4Name)}`);

  // ---- Action menus ----
  const l2Menu = (l2: L2Process) => (
    <>
      <button
        title={language === "PT" ? "Detalhes" : "Details"}
        onClick={(e) => {
          e.stopPropagation();
          setDetailsTarget({ level: "L2", l1Id: currentL1.id, itemId: l2.id });
        }}
        className="p-1 rounded-sm bg-white/10 hover:bg-white/25 transition-colors text-white"
      >
        <Info className="h-3.5 w-3.5" />
      </button>
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="p-1 rounded-sm bg-white/10 hover:bg-white/25 transition-colors text-white">
          <MoreHorizontal className="h-3.5 w-3.5" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="rounded-sm">
        <DropdownMenuItem onClick={() => setL2Modal({ open: true, editing: l2 })}>
          <Pencil className="h-3.5 w-3.5 mr-2" />
          {language === "PT" ? "Editar" : "Edit"}
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => {
            addL2(currentL1.id, {
              name: `${l2.name} (${language === "PT" ? "Cópia" : "Copy"})`,
              description: l2.description,
              responsible: l2.responsible,
              frequency: l2.frequency,
              structure: l2.structure,
              okr: l2.okr,
            });
            toast.success(language === "PT" ? `${lvl("l2")} duplicado` : `${lvl("l2")} duplicated`);
          }}
        >
          <Copy className="h-3.5 w-3.5 mr-2" />
          {language === "PT" ? "Duplicar" : "Duplicate"}
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() =>
            navigate(
              `/use-cases?level=l2&sourceId=${l2.id}&sourceName=${encodeURIComponent(
                l2.name
              )}&l1Id=${currentL1.id}`
            )
          }
        >
          <Lightbulb className="h-3.5 w-3.5 mr-2" />
          {language === "PT" ? "Casos de Uso" : "Use Cases"}
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => setDeletingL2(l2)}
          className="text-destructive"
        >
          <Trash2 className="h-3.5 w-3.5 mr-2" />
          {language === "PT" ? "Excluir" : "Delete"}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
    </>
  );

  const l3Menu = (l2Id: string, l3: L3Process) => (
    <>
      <button
        title={language === "PT" ? "Detalhes" : "Details"}
        onClick={(e) => {
          e.stopPropagation();
          setDetailsTarget({ level: "L3", l1Id: currentL1.id, l2Id, itemId: l3.id });
        }}
        className="p-1 rounded-sm bg-white/10 hover:bg-white/25 transition-colors text-white"
      >
        <Info className="h-3.5 w-3.5" />
      </button>
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="p-1 rounded-sm bg-white/10 hover:bg-white/25 transition-colors text-white">
          <MoreHorizontal className="h-3.5 w-3.5" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="rounded-sm">
        <DropdownMenuItem onClick={() => setL3Modal({ open: true, l2Id, editing: l3 })}>
          <Pencil className="h-3.5 w-3.5 mr-2" />
          {language === "PT" ? "Editar" : "Edit"}
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() =>
            navigate(
              `/use-cases?level=l3&sourceId=${l3.id}&sourceName=${encodeURIComponent(
                l3.name
              )}&l1Id=${currentL1.id}`
            )
          }
        >
          <Lightbulb className="h-3.5 w-3.5 mr-2" />
          {language === "PT" ? "Casos de Uso" : "Use Cases"}
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => setDeletingL3({ l2Id, l3 })}
          className="text-destructive"
        >
          <Trash2 className="h-3.5 w-3.5 mr-2" />
          {language === "PT" ? "Excluir" : "Delete"}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
    </>
  );

  const l4Menu = (l2Id: string, l3Id: string, l4: L4Task) => (
    <>
      <button
        title={language === "PT" ? "Detalhes" : "Details"}
        onClick={(e) => {
          e.stopPropagation();
          setDetailsTarget({ level: "L4", l1Id: currentL1.id, l2Id, l3Id, itemId: l4.id });
        }}
        className="p-1 rounded-sm bg-white/10 hover:bg-white/25 transition-colors text-white"
      >
        <Info className="h-3.5 w-3.5" />
      </button>
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="p-1 rounded-sm bg-white/10 hover:bg-white/25 transition-colors text-white">
          <MoreHorizontal className="h-3.5 w-3.5" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="rounded-sm">
        <DropdownMenuItem
          onClick={() => setL4Modal({ open: true, l2Id, l3Id, editing: l4 })}
        >
          <Pencil className="h-3.5 w-3.5 mr-2" />
          {language === "PT" ? "Editar" : "Edit"}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => openProcessesForL4(l4.name)}>
          <Layers className="h-3.5 w-3.5 mr-2" />
          {language === "PT" ? "Ver processos" : "View processes"}
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => setDeletingL4({ l2Id, l3Id, l4 })}
          className="text-destructive"
        >
          <Trash2 className="h-3.5 w-3.5 mr-2" />
          {language === "PT" ? "Excluir" : "Delete"}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
    </>
  );

  const rowLabel = (label: string, count: number, action?: React.ReactNode) => (
    <div className="flex items-center justify-between mb-2">
      <div className="text-[11px] font-bold text-[#A5A7B0] uppercase tracking-wider">
        {label}
        <span className="ml-2 text-[#A5A7B0]/70 normal-case font-normal">
          {count}
        </span>
      </div>
      {action}
    </div>
  );

  if (!currentL2) {
    return (
      <EmptyState
        label={
          language === "PT"
            ? `${lvl("l2")} não encontrado`
            : `${lvl("l2")} not found`
        }
      />
    );
  }

  const l3List = currentL2.l3Processes;
  const n3 = l3List.length;
  // Adaptive layout: few L3s spread wide, many L3s fall into a responsive grid.
  const l3GridStyle: React.CSSProperties =
    n3 <= 1
      ? { gridTemplateColumns: "1fr" }
      : n3 === 2
      ? { gridTemplateColumns: "repeat(2, minmax(0, 1fr))" }
      : { gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))" };
  // With few L3 columns each card is wide, so L4s can flow in multiple columns.
  const l4GridStyle: React.CSSProperties =
    n3 <= 2
      ? { gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))" }
      : { gridTemplateColumns: "1fr" };

  return (
    <div>
      {/* Ribbon Compacto do Domínio Superior para Preservar o Contexto */}
      <DomainContextRibbon
        domainName={getL1Name(currentL1)}
        domainCategory={currentL1.category}
        totalProcesses={domainProcs.length || counts.processes}
        docPercent={domainDocPercent}
        contextPercent={domainCtxPercent}
        journeysCount={domainJourneysCount}
        systemsCount={domainSystemsCount}
        mainKpiName={language === "PT" ? "SLA Principal" : "Main SLA"}
        mainKpiValue={domainMainKpi}
        variant="compact"
        subLevelTitle={`${lvl("l2")}: ${currentL2.name}`}
        onNavigateToDomain={() => {
          const params = new URLSearchParams(window.location.search);
          params.set('view', 'chain');
          params.set('l1', currentL1.id);
          params.delete('l2');
          params.delete('l3');
          window.history.pushState(null, '', `?${params.toString()}`);
          window.dispatchEvent(new Event('popstate'));
        }}
      />

      <LevelHeader
        chip="L2"
        title={currentL2.name}
        description={currentL2.description || getL1Name(currentL1)}
        counts={counts}
        actions={
          <>
            <Button
              size="sm"
              variant="outline"
              className="rounded-sm border-[#0C1BA8] text-[#0C1BA8] hover:bg-[#0C1BA8]/5"
              onClick={() => navigate(`/saved-use-cases?l1Id=${currentL1.id}`)}
            >
              <Bookmark className="h-3.5 w-3.5 mr-1.5" />
              {language === "PT" ? "Casos Salvos" : "Saved Cases"}
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="rounded-sm border-[#0C1BA8] text-[#0C1BA8] hover:bg-[#0C1BA8]/5"
              onClick={() =>
                navigate(
                  `/use-cases?level=l2&sourceId=${currentL2.id}&sourceName=${encodeURIComponent(
                    currentL2.name
                  )}&l1Id=${currentL1.id}`
                )
              }
            >
              <Lightbulb className="h-3.5 w-3.5 mr-1.5" />
              {language === "PT" ? "Casos de Uso" : "Use Cases"}
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="rounded-sm border-[#A5A7B0]/40 text-[#272727]"
              onClick={() => setL2Modal({ open: true, editing: currentL2 })}
            >
              <Pencil className="h-3.5 w-3.5 mr-1.5" />
              {language === "PT" ? "Editar" : "Edit"}
            </Button>
            {hasLevel("l3") && (
              <Button
                size="sm"
                className="rounded-sm bg-[#0C1BA8] hover:bg-[#04223D] text-white"
                onClick={() =>
                  setL3Modal({ open: true, l2Id: currentL2.id, editing: null })
                }
              >
                <Plus className="h-4 w-4 mr-1.5" />
                {language === "PT" ? `Adicionar ${lvl("l3")}` : `Add ${lvl("l3")}`}
              </Button>
            )}
          </>
        }
      />

      {n3 === 0 ? (
        <EmptyState
          label={
            language === "PT"
              ? `Nenhum ${lvl("l3")} cadastrado`
              : `No ${lvl("l3")} registered`
          }
          action={
            <Button
              size="sm"
              className="rounded-sm bg-[#0C1BA8] hover:bg-[#04223D] text-white"
              onClick={() =>
                setL3Modal({ open: true, l2Id: currentL2.id, editing: null })
              }
            >
              <Plus className="h-4 w-4 mr-1.5" />
              {language === "PT"
                ? `Criar primeiro ${lvl("l3")}`
                : `Create first ${lvl("l3")}`}
            </Button>
          }
        />
      ) : (
        <>
          {rowLabel(language === "PT" ? `Nível ${lvl("l3")}` : `${lvl("l3")} level`, n3)}
          <div className="grid gap-3 items-start" style={l3GridStyle}>
            {l3List.map((l3) => {
              const c3 = l3Counts(l3);
              return (
                <div
                  key={l3.id}
                  className="rounded-sm border border-[#A5A7B0]/30 bg-white"
                >
                  {/* L3 header */}
                  <div className="group relative flex items-start justify-between gap-2 px-3 py-2.5 bg-[#3B4CC0]">
                    <button
                      onClick={() => !hasLevel("l4") && toggleLeaf(l3.id)}
                      className={`text-left min-w-0 flex-1 ${
                        hasLevel("l4") ? "cursor-default" : "cursor-pointer"
                      }`}
                    >
                      <div className="flex items-center gap-1.5 mb-0.5">
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-sm bg-white/20 text-white uppercase tracking-wide">
                          {lvl("l3")}
                        </span>
                        <span className="text-[10px] text-white/70">
                          {c3.l4 > 0 && maxLevel >= 4 && (
                            <>
                              {c3.l4} {lvl("l4")} ·{" "}
                            </>
                          )}
                          {c3.processes} {language === "PT" ? "proc." : "proc."}
                        </span>
                      </div>
                      <h4 className="text-[13px] font-medium text-white leading-tight">
                        {l3.name}
                      </h4>
                    </button>
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                      {l3Menu(currentL2.id, l3)}
                    </div>
                  </div>

                  {/* L4 list */}
                  {hasLevel("l4") && (
                    <div className="p-2.5">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-bold text-[#A5A7B0] uppercase tracking-wider">
                          {l3.l4Tasks.length} {lvl("l4")}
                        </span>
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-6 px-2 text-[11px] rounded-sm border-[#A5A7B0]/40 text-[#272727]"
                          onClick={() =>
                            setL4Modal({
                              open: true,
                              l2Id: currentL2.id,
                              l3Id: l3.id,
                              editing: null,
                            })
                          }
                        >
                          <Plus className="h-3 w-3 mr-1" />
                          {lvl("l4")}
                        </Button>
                      </div>

                      {l3.l4Tasks.length === 0 ? (
                        <div className="text-center py-3 rounded-sm border border-dashed border-[#A5A7B0]/40 text-[#A5A7B0] text-xs">
                          {language === "PT" ? `Sem ${lvl("l4")}` : `No ${lvl("l4")}`}
                        </div>
                      ) : (
                        <div className="grid gap-1.5" style={l4GridStyle}>
                          {l3.l4Tasks.map((l4) => {
                            const c4 = l4Counts(l4);
                            return (
                              <div
                                key={l4.id}
                                className="group relative rounded-sm border border-[#A5A7B0]/30 bg-[#f9f9f9] hover:border-[#0C1BA8] transition-colors"
                              >
                                <button
                                  onClick={() => toggleLeaf(l4.id)}
                                  className="w-full text-left px-2.5 py-2"
                                >
                                  <div className="flex items-center gap-1.5 mb-0.5">
                                    <span className="text-[9px] font-bold px-1 py-0.5 rounded-sm bg-[#c9dcf2] text-[#0C1BA8] uppercase tracking-wide">
                                      {lvl("l4")}
                                    </span>
                                    <span
                                      className="inline-block w-1.5 h-1.5 rounded-full"
                                      style={{
                                        background:
                                          l4.status === "active"
                                            ? "#22c55e"
                                            : "#f59e0b",
                                      }}
                                    />
                                  </div>
                                  <div className="text-[12px] text-[#272727] leading-tight">
                                    {l4.name}
                                  </div>
                                  <div className="mt-0.5 flex items-center gap-1 text-[10px] text-[#A5A7B0]">
                                    <ChevronRight
                                      className={`h-3 w-3 transition-transform ${
                                        expandedLeaf[l4.id] ? "rotate-90" : ""
                                      }`}
                                    />
                                    {c4.processes}{" "}
                                    {language === "PT" ? "proc." : "proc."}
                                  </div>
                                </button>
                                {expandedLeaf[l4.id] && (
                                  <div className="px-2.5 pb-2.5">
                                    <ProcessDrilldown
                                      level="l4"
                                      name={l4.name}
                                      onSelectProcess={(p) => setSelectedProcessForAction(p)}
                                    />
                                  </div>
                                )}
                                <div className="absolute top-1 right-1 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity [&_button]:!text-[#272727] [&_button]:!bg-transparent hover:[&_button]:!bg-black/5">
                                  {l4Menu(currentL2.id, l3.id, l4)}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Processes are the last layer: shown here when the chain stops at L3 */}
                  {!hasLevel("l4") && (
                    <div className="p-2.5">
                      <button
                        onClick={() => toggleLeaf(l3.id)}
                        className="flex items-center gap-1 mb-2 text-[10px] font-bold text-[#A5A7B0] uppercase tracking-wider hover:text-[#0C1BA8] transition-colors"
                      >
                        <ChevronRight
                          className={`h-3 w-3 transition-transform ${
                            expandedLeaf[l3.id] ? "rotate-90" : ""
                          }`}
                        />
                        {c3.processes} {language === "PT" ? "processos" : "processes"}
                      </button>
                      {expandedLeaf[l3.id] && (
                        <ProcessDrilldown
                          level="l3"
                          name={l3.name}
                          onSelectProcess={(p) => setSelectedProcessForAction(p)}
                        />
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </>
      )}

      {/* Process Action Dialog & Connection Map Modal */}
      <ProcessActionDialog
        open={!!selectedProcessForAction}
        onOpenChange={(isOpen) => {
          if (!isOpen) setSelectedProcessForAction(null);
        }}
        process={selectedProcessForAction}
        onViewDetail={(procId) => {
          setSelectedProcessForAction(null);
          navigate(`/processes/${procId}`);
        }}
        onViewConnectionMap={(proc) => {
          setSelectedProcessForAction(null);
          setConnectionMapProcess({
            id: proc.id,
            name: proc.name,
            domain: proc.l1 || getL1Name(currentL1),
          });
        }}
      />

      {connectionMapProcess && (
        <ProcessConnectionMapModal
          open={!!connectionMapProcess}
          onOpenChange={(isOpen) => {
            if (!isOpen) setConnectionMapProcess(null);
          }}
          initialProcessId={connectionMapProcess.id}
          initialProcessName={connectionMapProcess.name}
          initialDomain={connectionMapProcess.domain}
          onNavigateToProcess={(procId) => {
            setConnectionMapProcess(null);
            navigate(`/processes/${procId}`);
          }}
        />
      )}

      {/* Modals */}
      <DetailsSidePanel target={detailsTarget} onClose={() => setDetailsTarget(null)} />
      <CreateEditL2Modal
        isOpen={l2Modal.open}
        onClose={() => setL2Modal({ open: false, editing: null })}
        l1Id={currentL1.id}
        editingL2={l2Modal.editing}
      />
      {l3Modal.l2Id && (
        <CreateEditL3Modal
          isOpen={l3Modal.open}
          onClose={() => setL3Modal({ open: false, l2Id: null, editing: null })}
          l1Id={currentL1.id}
          l2Id={l3Modal.l2Id}
          editingL3={l3Modal.editing}
        />
      )}
      {l4Modal.l2Id && l4Modal.l3Id && (
        <CreateEditL4Modal
          isOpen={l4Modal.open}
          onClose={() =>
            setL4Modal({ open: false, l2Id: null, l3Id: null, editing: null })
          }
          l1Id={currentL1.id}
          l2Id={l4Modal.l2Id}
          l3Id={l4Modal.l3Id}
          editingL4={l4Modal.editing}
        />
      )}

      {/* Delete dialogs */}
      <AlertDialog open={!!deletingL2} onOpenChange={() => setDeletingL2(null)}>
        <AlertDialogContent className="rounded-sm">
          <AlertDialogHeader>
            <AlertDialogTitle>
              {language === "PT" ? `Excluir ${lvl("l2")}?` : `Delete ${lvl("l2")}?`}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {deletingL2 && deletingL2.l3Processes.length > 0
                ? language === "PT"
                  ? `Este ${lvl("l2")} possui ${deletingL2.l3Processes.length} ${lvl("l3")}(s). Todos serão removidos.`
                  : `This ${lvl("l2")} has ${deletingL2.l3Processes.length} ${lvl("l3")}(s). All will be removed.`
                : language === "PT"
                ? "Esta ação não pode ser desfeita."
                : "This action cannot be undone."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-sm">
              {language === "PT" ? "Cancelar" : "Cancel"}
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (deletingL2) {
                  deleteL2(currentL1.id, deletingL2.id);
                  toast.success(language === "PT" ? `${lvl("l2")} excluído` : `${lvl("l2")} deleted`);



                  setDeletingL2(null);
                }
              }}
              className="rounded-sm bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {language === "PT" ? "Excluir" : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={!!deletingL3} onOpenChange={() => setDeletingL3(null)}>
        <AlertDialogContent className="rounded-sm">
          <AlertDialogHeader>
            <AlertDialogTitle>
              {language === "PT" ? `Excluir ${lvl("l3")}?` : `Delete ${lvl("l3")}?`}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {deletingL3 && deletingL3.l3.l4Tasks.length > 0
                ? language === "PT"
                  ? `Este ${lvl("l3")} possui ${deletingL3.l3.l4Tasks.length} ${lvl("l4")}(s). Todos serão removidos.`
                  : `This ${lvl("l3")} has ${deletingL3.l3.l4Tasks.length} ${lvl("l4")}(s). All will be removed.`
                : language === "PT"
                ? "Esta ação não pode ser desfeita."
                : "This action cannot be undone."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-sm">
              {language === "PT" ? "Cancelar" : "Cancel"}
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (deletingL3) {
                  deleteL3(currentL1.id, deletingL3.l2Id, deletingL3.l3.id);
                  toast.success(language === "PT" ? `${lvl("l3")} excluído` : `${lvl("l3")} deleted`);



                  setDeletingL3(null);
                }
              }}
              className="rounded-sm bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {language === "PT" ? "Excluir" : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={!!deletingL4} onOpenChange={() => setDeletingL4(null)}>
        <AlertDialogContent className="rounded-sm">
          <AlertDialogHeader>
            <AlertDialogTitle>
              {language === "PT" ? `Excluir ${lvl("l4")}?` : `Delete ${lvl("l4")}?`}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {language === "PT"
                ? "Esta ação não pode ser desfeita."
                : "This action cannot be undone."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-sm">
              {language === "PT" ? "Cancelar" : "Cancel"}
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (deletingL4) {
                  deleteL4(
                    currentL1.id,
                    deletingL4.l2Id,
                    deletingL4.l3Id,
                    deletingL4.l4.id
                  );
                  toast.success(language === "PT" ? `${lvl("l4")} excluído` : `${lvl("l4")} deleted`);
                  setDeletingL4(null);
                }
              }}
              className="rounded-sm bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {language === "PT" ? "Excluir" : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

// ============================================================
// Expandable row — used for L2 and L3 (inline accordion)
// ============================================================
function ExpandableRow({
  level,
  title,
  description,
  counts,
  meta,
  open,
  onToggle,
  actions,
  nested = false,
  children,
}: {
  level: "L2" | "L3";
  title: string;
  description?: string;
  counts?: CumulativeCounts;
  meta?: React.ReactNode;
  open: boolean;
  onToggle: () => void;
  actions?: React.ReactNode;
  nested?: boolean;
  children: React.ReactNode;
}) {
  const { language } = useLanguage();
  const { label: lvl } = useTaxonomy();
  return (
    <div
      className={cn(
        "rounded-sm border transition-colors",
        open ? "border-[#0C1BA8]/50" : "border-[#A5A7B0]/40",
        nested ? "bg-[#f9f9f9]" : "bg-white"
      )}
    >
      <button
        onClick={onToggle}
        className="w-full text-left px-4 py-3 flex items-center gap-3"
      >
        <ChevronRight
          className={cn(
            "h-4 w-4 shrink-0 text-[#A5A7B0] transition-transform",
            open && "rotate-90 text-[#0C1BA8]"
          )}
        />
        <div className="flex items-center gap-1.5 shrink-0">
          <LevelChip level={level} />
          {meta}
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-medium text-sm text-[#272727] truncate">{title}</div>
          {description && (
            <div className="text-xs text-[#A5A7B0] truncate">{description}</div>
          )}
        </div>
        {counts && (
          <div className="hidden md:flex items-center flex-wrap gap-x-2 gap-y-0.5 text-[11px] text-[#A5A7B0] shrink-0">
            {counts.l3 > 0 && level === "L2" && <span>{counts.l3} {lvl("l3")}</span>}
            {counts.l3 > 0 && level === "L2" && (counts.l4 > 0 || counts.processes > 0) && <Dot />}
            {counts.l4 > 0 && <span>{counts.l4} {lvl("l4")}</span>}
            {counts.l4 > 0 && counts.processes >= 0 && <Dot />}
            <span className={cn(counts.processes > 0 && "font-semibold text-[#0C1BA8]")}>
              {counts.processes} {language === "PT" ? "processos" : "processes"}
            </span>
          </div>
        )}
        <div onClick={(e) => e.stopPropagation()} className="shrink-0">
          {actions}
        </div>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 pt-1 border-t border-[#A5A7B0]/20">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ============================================================
// Level header (shown at L2+ views)
// ============================================================
function LevelHeader({
  chip,
  title,
  description,
  counts,
  actions,
}: {
  chip: "L1" | "L2" | "L3" | "L4";
  title: string;
  description?: string;
  counts?: CumulativeCounts;
  actions?: React.ReactNode;
}) {
  const { language } = useLanguage();
  const { label: lvl, maxLevel: maxLevelHeader } = useTaxonomy();
  return (
    <div className="mb-6 pb-4 border-b border-[#A5A7B0]/20">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 mb-1.5">
            <LevelChip level={chip} />
            <span className="text-[11px] font-bold text-[#A5A7B0] uppercase tracking-wider">
              {language === "PT" ? "Nível atual" : "Current level"}
            </span>
          </div>
          <h2 className="text-xl font-semibold text-[#272727]">{title}</h2>
          {description && <p className="text-sm text-[#A5A7B0] mt-1">{description}</p>}
          {counts && (
            <div className="mt-2 flex items-center flex-wrap gap-x-3 gap-y-1 text-xs text-[#A5A7B0]">
              {counts.l3 > 0 && chip !== "L3" && maxLevelHeader >= 3 && <span>{counts.l3} {lvl("l3")}</span>}
              {counts.l4 > 0 && maxLevelHeader >= 4 && <span>{counts.l4} {lvl("l4")}</span>}
              <span className="font-semibold text-[#0C1BA8]">
                {counts.processes} {language === "PT" ? "processos" : "processes"}
              </span>
              {chip === "L2" && (
                <>
                  <span className="text-gray-300">·</span>
                  <span className="text-blue-700 font-medium">Doc: 80%</span>
                  <span className="text-gray-300">·</span>
                  <span className="text-emerald-700 font-medium">{language === "PT" ? "Contexto: 65%" : "Context: 65%"}</span>
                  <span className="text-gray-300">·</span>
                  <span className="text-gray-600">3 {language === "PT" ? "sistemas" : "systems"}</span>
                  <span className="text-gray-300">·</span>
                  <span className="text-gray-600">2 {language === "PT" ? "jornadas" : "journeys"}</span>
                  <span className="text-gray-300">·</span>
                  <span className="text-[#0C1BA8] font-bold">SLA: 91%</span>
                </>
              )}
            </div>
          )}
        </div>
        <div className="flex items-center gap-2 shrink-0">{actions}</div>
      </div>
    </div>
  );
}

function EmptyState({ label, action }: { label: string; action?: React.ReactNode }) {
  return (
    <div className="text-center py-14 rounded-sm border border-dashed border-[#A5A7B0]/40 bg-white">
      <Layers className="h-8 w-8 mx-auto mb-3 text-[#A5A7B0]" />
      <p className="text-sm text-[#A5A7B0] mb-3">{label}</p>
      {action}
    </div>
  );
}
