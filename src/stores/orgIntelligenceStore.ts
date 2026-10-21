import { create } from "zustand";
import {
  ActiveContextDocument,
  AreaAgentProfile,
  AreaQAChatMessage,
  CommitteeChatMessage,
  INITIAL_ACTIVE_CONTEXT_DOCS,
  INITIAL_AREA_PROFILES,
  INITIAL_PASSIVE_CONTEXT_SOURCES,
  NegotiationDecisionStatus,
  NegotiationRequestItem,
  PassiveContextSource,
  SIMULATION_SCENARIOS,
  SimulationAnalysis,
  SimulationReportVersion,
  SimulationUmbrellaSession,
  SimulatorChatMessage,
  StanceStatus,
  buildCustomSimulationFromPrompt,
  buildNegotiationItemsForAnalysis,
  buildRepresentativeFromAreaProfile,
  generateAreaQAResponse,
} from "@/data/orgIntelligenceMockData";

export type OrgIntelModuleTab =
  | "home"
  | "qa_chat"
  | "new_simulation"
  | "history"
  | "simulator"
  | "committee"
  | "context";

interface OrgIntelligenceState {
  activeModuleTab: OrgIntelModuleTab;
  setActiveModuleTab: (tab: OrgIntelModuleTab) => void;

  // Perfis de Área & Agentes
  areaProfiles: AreaAgentProfile[];
  selectedAreaProfileId: string | null;
  setSelectedAreaProfileId: (areaId: string | null) => void;
  generateAgentForArea: (areaId: string, customPersona?: string) => void;

  // Chat de Dúvidas (Geral ou por Área)
  selectedQAAreaId: "general" | string;
  setSelectedQAAreaId: (areaId: "general" | string) => void;
  qaChatHistories: Record<string, AreaQAChatMessage[]>; // chave: "general" ou area.id
  openQAChat: (areaId: "general" | string, initialQuestion?: string) => void;
  sendQAMessage: (question: string, targetAreaId?: "general" | string) => void;

  // Contexto Passivo e Ativo
  passiveSources: PassiveContextSource[];
  activeDocuments: ActiveContextDocument[];
  togglePassiveSource: (id: PassiveContextSource["id"]) => void;
  toggleActiveDocument: (id: string) => void;
  addActiveDocument: (doc: Omit<ActiveContextDocument, "id" | "uploadedAt">) => void;
  removeActiveDocument: (id: string) => void;

  // Guarda-Chuva de Simulações (Sessões e Versões v1, v2, v3...)
  simulationSessions: SimulationUmbrellaSession[];
  activeSessionId: string;
  isSimulating: boolean;
  simulationLoadingMode: "initial" | "reprocess" | null;
  simulationLoadingSteps: string[];
  pendingSimulationPrompt: { prompt: string; scenarioKey?: string } | null;
  setPendingSimulationPrompt: (pending: { prompt: string; scenarioKey?: string } | null) => void;
  initiateSimulationFlow: (prompt: string, scenarioKey?: string) => void;
  startNewSimulationFromPrompt: (
    promptText: string,
    scenarioKey?: string,
    clarifications?: { question: string; category: string; answer: string }[]
  ) => void;
  openSimulationSession: (sessionId: string, versionNumber?: number, targetTab?: "simulator" | "committee") => void;
  selectSessionVersion: (sessionId: string, versionNumber: number) => void;
  updateNegotiationDecision: (itemId: string, decision: NegotiationDecisionStatus) => void;
  updateDraftProposalText: (newText: string) => void;
  reprocessSimulationFromRoundtable: () => void;

  // Propriedades derivadas / compatibilidade para Simulador e Mesa Redonda
  currentAnalysis: SimulationAnalysis;
  simulatorMessages: SimulatorChatMessage[];
  loadScenario: (scenarioId: string) => void;
  sendSimulatorMessage: (userText: string) => void;
  applyConsensusToSimulation: () => void;

  // Comitê Virtual de Áreas Impactadas (Mesa Redonda Multi-Agentes)
  committeeMessages: CommitteeChatMessage[];
  selectedTargetRepId: "all" | string;
  setSelectedTargetRepId: (repId: "all" | string) => void;
  openCommitteeForArea: (repId?: string) => void;
  sendCommitteeMessage: (userText: string, targetRepId?: "all" | string) => void;
  triggerCommitteeRound: (roundType: "opening" | "clash" | "consensus") => void;
  addAreaToCommittee: (areaId: string) => void;
  removeAreaFromCommittee: (repId: string) => void;
}

const getInitialCommitteeMessages = (scenario: SimulationAnalysis): CommitteeChatMessage[] => {
  const reps = scenario.areasAndCommittee;
  return [
    {
      id: `com-msg-mod-1-${scenario.id}`,
      senderType: "moderator",
      senderName: "Moderador da Mesa Redonda (Org. Intelligence)",
      timestamp: "Sessão Iniciada",
      content: `Bem-vindo à **Mesa Redonda de Negociação**. Convoquei os **${reps.length} agentes representantes** das áreas impactadas pela proposta: **"${scenario.title}"**.\n\nVocê pode conversar com toda a mesa ou com uma área específica, além de **aceitar ou negar as solicitações de cada área** no painel ao lado para editar automaticamente a proposta e **reprocessar um novo relatório de simulação**.`,
    },
    ...reps.map((rep, idx) => ({
      id: `com-msg-open-${rep.id}-${idx}`,
      senderType: "representative" as const,
      representativeId: rep.id,
      senderName: rep.agentName,
      senderRole: rep.agentRole,
      areaBadge: rep.shortArea,
      avatarColor: rep.avatarColor,
      avatarInitials: rep.avatarInitials,
      stanceAtTime: rep.stance,
      timestamp: "Parecer Inicial",
      content: rep.openingStatement,
      highlightBox: {
        type:
          rep.stance === "resistente"
            ? ("objecao" as const)
            : rep.stance === "ressalvas"
              ? ("concessao" as const)
              : ("acordo" as const),
        text: `Solicitação da área (${rep.shortArea}): ${rep.negotiationConditions[0]}`,
      },
    })),
  ];
};

function computeDraftFromNegotiationItems(
  baseDirective: string,
  items: NegotiationRequestItem[]
): string {
  const accepted = items.filter((i) => i.status === "accepted");
  if (accepted.length === 0) {
    return baseDirective;
  }
  const clauses = accepted
    .map((item, idx) => `(${idx + 1} · Acordo ${item.areaShortName}) ${item.clauseAddedToProposal}`)
    .join(" ");
  return `${baseDirective}\n\nCondicionantes Negociadas na Mesa Redonda:\n${clauses}`;
}

function buildReprocessedAnalysis(
  baseAnalysis: SimulationAnalysis,
  items: NegotiationRequestItem[],
  draftText: string,
  versionNum: number
): SimulationAnalysis {
  const accepted = items.filter((i) => i.status === "accepted");
  const rejected = items.filter((i) => i.status === "rejected");
  const totalRiskReduction = accepted.reduce((sum, i) => sum + i.riskReductionDelta, 0);
  const newRiskScore = Math.max(22, baseAnalysis.overallRiskScore - totalRiskReduction);

  const acceptedRepIds = new Set(accepted.map((a) => a.repId));
  const rejectedRepIds = new Set(rejected.map((r) => r.repId));

  const updatedAreas = baseAnalysis.areasAndCommittee.map((rep) => {
    if (acceptedRepIds.has(rep.id)) {
      return {
        ...rep,
        stance: "favoravel" as StanceStatus,
        stanceSummary: `Favorável na v${versionNum}: solicitação da área aceita e incorporada na proposta reprocessada.`,
      };
    }
    if (rejectedRepIds.has(rep.id)) {
      return {
        ...rep,
        stance: "resistente" as StanceStatus,
        stanceSummary: `Mantém objeção na v${versionNum}: solicitação da área foi negada na Mesa Redonda.`,
      };
    }
    return rep;
  });

  const jurAccepted = accepted.some((a) => a.repId === "rep-jur" || a.repId === "rep-comp");
  const cxAccepted = accepted.some((a) => a.repId === "rep-cx" || a.repId === "rep-ops");
  const tiAccepted = accepted.some((a) => a.repId === "rep-ti" || a.repId === "rep-sup");

  const updatedPolicies = baseAnalysis.policiesImpacted.map((pol) => {
    if (pol.severity === "bloqueio_legal" && jurAccepted) {
      return {
        ...pol,
        severity: "alinhado" as const,
        conflictExplanation: `Conflito neutralizado na v${versionNum} após incorporação da salvaguarda jurídica/regulatória na diretriz.`,
      };
    }
    if (pol.severity === "conflito_alto" && (tiAccepted || cxAccepted || jurAccepted)) {
      return {
        ...pol,
        severity: "revisao_necessaria" as const,
        conflictExplanation: `Conflito mitigado na v${versionNum} pelas regras de exceção negociadas na Mesa Redonda.`,
      };
    }
    return pol;
  });

  const updatedIndicators = baseAnalysis.indicatorsImpacted.map((ind) => {
    if (ind.direction === "negativo") {
      if (accepted.length >= 3) {
        return {
          ...ind,
          projectedValue: ind.currentValue,
          deltaLabel: `Risco Mitigado na v${versionNum} (Estável)`,
          rationale: `Impacto colateral neutralizado pelas ${accepted.length} salvaguardas aprovadas na Mesa Redonda.`,
        };
      }
      if (accepted.length >= 1) {
        return {
          ...ind,
          deltaLabel: `Impacto Reduzido em 60% na v${versionNum}`,
          rationale: `Mitigação parcial aplicada conforme negociação com ${accepted.map((a) => a.areaShortName).join(", ")}.`,
        };
      }
    }
    return ind;
  });

  return {
    ...baseAnalysis,
    proposedDirectiveToBe: draftText,
    refinedDirectiveToBe: draftText,
    isConsensusApplied: accepted.length > 0,
    overallRiskScore: newRiskScore,
    viabilityStatus:
      newRiskScore <= 35
        ? "Aprovado pelo Comitê (Com Ajustes)"
        : newRiskScore <= 60
          ? "Viável com Condicionantes"
          : "Requer Adequação Regulatória e Técnica",
    executiveSummary: `Relatório Reprocessado (v${versionNum}) após negociação na Mesa Redonda (${accepted.length} solicitações aceitas e ${rejected.length} negadas). O Risco Sistêmico caiu de ${baseAnalysis.overallRiskScore}/100 para ${newRiskScore}/100. ${
      accepted.length > 0
        ? `As salvaguardas acordadas com ${accepted.map((a) => a.areaShortName).join(", ")} destravaram os bloqueios críticos e protegeram os indicadores operacionais, mantendo a captura dos benefícios principais.`
        : "Nenhuma condicionante das áreas foi aceita; os riscos originais permanecem ativos."
    }`,
    policiesImpacted: updatedPolicies,
    indicatorsImpacted: updatedIndicators,
    areasAndCommittee: updatedAreas,
  };
}

// Pré-constrói 2 sessões Guarda-Chuva ricas no histórico para demonstração imediata
const scenarioTelecom = SIMULATION_SCENARIOS["telecom-throttling-d1"];
const telecomNegItems = buildNegotiationItemsForAnalysis(scenarioTelecom);
const telecomNegItemsV2Accepted = telecomNegItems.map((it) => ({
  ...it,
  status: "accepted" as NegotiationDecisionStatus,
}));
const telecomDraftV2 = computeDraftFromNegotiationItems(
  scenarioTelecom.proposedDirectiveToBe,
  telecomNegItemsV2Accepted
);
const scenarioTelecomV2 = buildReprocessedAnalysis(
  scenarioTelecom,
  telecomNegItemsV2Accepted,
  telecomDraftV2,
  2
);

const scenarioProcurement = SIMULATION_SCENARIOS["procurement-alcada-10k"];
const procurementNegItems = buildNegotiationItemsForAnalysis(scenarioProcurement);

const INITIAL_UMBRELLA_SESSIONS: SimulationUmbrellaSession[] = [
  {
    id: "session-telecom-d1",
    title: scenarioTelecom.title,
    initialPrompt: scenarioTelecom.userDirectivePrompt,
    domainTag: scenarioTelecom.domainTag,
    createdAt: "18/10/2026 às 14:10",
    updatedAt: "18/10/2026 às 15:05",
    activeVersionNumber: 1,
    versions: [
      {
        versionNumber: 1,
        versionLabel: "v1 · Relatório Inicial",
        createdAt: "18/10/2026 às 14:10",
        authorNote: "Análise inicial gerada pelo agente a partir da solicitação de mudança de D+5 para D+1.",
        acceptedConditionsCount: 0,
        rejectedConditionsCount: 0,
        analysis: scenarioTelecom,
      },
      {
        versionNumber: 2,
        versionLabel: "v2 · Pós-Mesa Redonda (Consenso)",
        createdAt: "18/10/2026 às 15:05",
        authorNote: "Relatório reprocessado após aceitar condições de Jurídico (Anatel 632), TI (Janela CNAB 48h), CX (Bom Pagador) e Financeiro (Pix D+1).",
        acceptedConditionsCount: 4,
        rejectedConditionsCount: 0,
        analysis: scenarioTelecomV2,
      },
    ],
    negotiationItems: telecomNegItems,
    draftProposalText: scenarioTelecom.proposedDirectiveToBe,
    committeeMessages: getInitialCommitteeMessages(scenarioTelecom),
  },
  {
    id: "session-procurement-10k",
    title: scenarioProcurement.title,
    initialPrompt: scenarioProcurement.userDirectivePrompt,
    domainTag: scenarioProcurement.domainTag,
    createdAt: "17/10/2026 às 16:30",
    updatedAt: "17/10/2026 às 16:30",
    activeVersionNumber: 1,
    versions: [
      {
        versionNumber: 1,
        versionLabel: "v1 · Relatório Inicial",
        createdAt: "17/10/2026 às 16:30",
        authorNote: "Análise inicial do impacto de reduzir a alçada gerencial de R$ 50k para R$ 10k.",
        acceptedConditionsCount: 0,
        rejectedConditionsCount: 0,
        analysis: scenarioProcurement,
      },
    ],
    negotiationItems: procurementNegItems,
    draftProposalText: scenarioProcurement.proposedDirectiveToBe,
    committeeMessages: getInitialCommitteeMessages(scenarioProcurement),
  },
];

const INITIAL_QA_HISTORIES: Record<string, AreaQAChatMessage[]> = {
  general: [
    {
      id: "qa-welcome-general",
      sender: "agent",
      timestamp: "Agora",
      agentName: "Orquestrador Org. Intelligence",
      agentRole: "Roteador Inteligente Multi-Áreas",
      avatarColor: "#0f172a",
      avatarInitials: "OI",
      content:
        "Olá! Este é o **Chat Geral de Dúvidas Corporativas**. Você pode fazer qualquer pergunta sobre processos, regras de negócio, políticas ou SLAs da empresa sem precisar saber de qual área é.\n\nEu identifico automaticamente a área responsável, aciono o **Agente Especialista daquela diretoria** e trago a resposta com base nas documentações vigentes!",
    },
  ],
};

export const useOrgIntelligenceStore = create<OrgIntelligenceState>((set, get) => ({
  activeModuleTab: "home",
  setActiveModuleTab: (tab) => set({ activeModuleTab: tab }),

  // Perfis de Área & Agentes
  areaProfiles: INITIAL_AREA_PROFILES,
  selectedAreaProfileId: null,
  setSelectedAreaProfileId: (areaId) => set({ selectedAreaProfileId: areaId }),

  generateAgentForArea: (areaId, customPersona) => {
    const nowStr = new Date().toLocaleDateString("pt-BR") + " às " + new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
    set((state) => ({
      areaProfiles: state.areaProfiles.map((area) =>
        area.id === areaId
          ? {
              ...area,
              hasAgentGenerated: true,
              lastTrainedAt: nowStr,
              agentPersona: customPersona?.trim() ? customPersona.trim() : area.agentPersona,
            }
          : area
      ),
    }));
  },

  // Chat de Dúvidas (Geral ou por Área)
  selectedQAAreaId: "general",
  setSelectedQAAreaId: (areaId) => set({ selectedQAAreaId: areaId }),
  qaChatHistories: INITIAL_QA_HISTORIES,

  openQAChat: (areaId, initialQuestion) => {
    set({
      activeModuleTab: "qa_chat",
      selectedQAAreaId: areaId,
    });
    if (initialQuestion && initialQuestion.trim()) {
      get().sendQAMessage(initialQuestion.trim(), areaId);
    }
  },

  sendQAMessage: (question, targetAreaId) => {
    const trimmed = question.trim();
    if (!trimmed) return;

    const effectiveAreaId = targetAreaId || get().selectedQAAreaId;
    const timeStr = new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });

    const userMsg: AreaQAChatMessage = {
      id: `qa-user-${Date.now()}`,
      sender: "user",
      timestamp: timeStr,
      content: trimmed,
    };

    const replyData = generateAreaQAResponse(trimmed, effectiveAreaId, get().areaProfiles);
    const agentMsg: AreaQAChatMessage = {
      ...replyData,
      id: `qa-agent-${Date.now() + 1}`,
      timestamp: timeStr,
    };

    set((state) => {
      const existing = state.qaChatHistories[effectiveAreaId] || [];
      return {
        qaChatHistories: {
          ...state.qaChatHistories,
          [effectiveAreaId]: [...existing, userMsg, agentMsg],
        },
      };
    });
  },

  // Contexto Passivo e Ativo
  passiveSources: INITIAL_PASSIVE_CONTEXT_SOURCES,
  activeDocuments: INITIAL_ACTIVE_CONTEXT_DOCS,

  togglePassiveSource: (id) =>
    set((state) => ({
      passiveSources: state.passiveSources.map((s) =>
        s.id === id ? { ...s, enabled: !s.enabled } : s
      ),
    })),

  toggleActiveDocument: (id) =>
    set((state) => ({
      activeDocuments: state.activeDocuments.map((d) =>
        d.id === id ? { ...d, enabled: !d.enabled } : d
      ),
    })),

  addActiveDocument: (docInput) =>
    set((state) => {
      const now = new Date();
      const formattedDate = now.toLocaleDateString("pt-BR");
      const newDoc: ActiveContextDocument = {
        ...docInput,
        id: `doc-custom-${Date.now()}`,
        uploadedAt: formattedDate,
      };
      return {
        activeDocuments: [newDoc, ...state.activeDocuments],
      };
    }),

  removeActiveDocument: (id) =>
    set((state) => ({
      activeDocuments: state.activeDocuments.filter((d) => d.id !== id),
    })),

  // Guarda-Chuva de Simulações
  simulationSessions: INITIAL_UMBRELLA_SESSIONS,
  activeSessionId: INITIAL_UMBRELLA_SESSIONS[0].id,
  isSimulating: false,
  simulationLoadingMode: null,
  simulationLoadingSteps: [],
  pendingSimulationPrompt: null,

  setPendingSimulationPrompt: (pending) => set({ pendingSimulationPrompt: pending }),

  initiateSimulationFlow: (prompt, scenarioKey) => {
    set({
      pendingSimulationPrompt: { prompt: prompt.trim(), scenarioKey },
      activeModuleTab: "new_simulation",
    });
  },

  startNewSimulationFromPrompt: (promptText, scenarioKey, clarifications) => {
    const trimmed = promptText.trim();
    if (!trimmed && !scenarioKey) return;

    const rawBaseAnalysis = scenarioKey
      ? SIMULATION_SCENARIOS[scenarioKey] || buildCustomSimulationFromPrompt(trimmed, get().activeDocuments)
      : buildCustomSimulationFromPrompt(trimmed, get().activeDocuments);

    const hasClarifications = clarifications && clarifications.length > 0;
    const clarificationsSummaryText = hasClarifications
      ? clarifications.map((c, idx) => `${idx + 1}. ${c.category}: ${c.answer}`).join(" | ")
      : "";

    const baseAnalysis: SimulationAnalysis = hasClarifications
      ? {
          ...rawBaseAnalysis,
          proposedDirectiveToBe: `${rawBaseAnalysis.proposedDirectiveToBe}\n\nParâmetros Definidos no Entendimento com o Agente:\n${clarifications
            .map((c) => `• ${c.category}: ${c.answer}`)
            .join("\n")}`,
          reasoningSteps: [
            `Consolidando ${clarifications.length} respostas de refinamento coletadas na entrevista inicial do Agente...`,
            ...rawBaseAnalysis.reasoningSteps,
          ],
        }
      : rawBaseAnalysis;

    const nowStr =
      new Date().toLocaleDateString("pt-BR") +
      " às " +
      new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });

    const negItems = buildNegotiationItemsForAnalysis(baseAnalysis);
    const committeeMsgs = getInitialCommitteeMessages(baseAnalysis);

    const newSessionId = `session-${Date.now()}`;
    const newSession: SimulationUmbrellaSession = {
      id: newSessionId,
      title: baseAnalysis.title,
      initialPrompt: trimmed || baseAnalysis.userDirectivePrompt,
      domainTag: baseAnalysis.domainTag,
      createdAt: nowStr,
      updatedAt: nowStr,
      activeVersionNumber: 1,
      versions: [
        {
          versionNumber: 1,
          versionLabel: "v1 · Relatório Inicial",
          createdAt: nowStr,
          authorNote: hasClarifications
            ? `Análise v1 gerada após alinhamento de ${clarifications.length} parâmetros com o agente (${clarificationsSummaryText}).`
            : "Análise inicial gerada pelo agente a partir da demanda submetida.",
          acceptedConditionsCount: 0,
          rejectedConditionsCount: 0,
          analysis: baseAnalysis,
        },
      ],
      negotiationItems: negItems,
      draftProposalText: baseAnalysis.proposedDirectiveToBe,
      committeeMessages: committeeMsgs,
    };

    set((state) => ({
      activeModuleTab: "simulator",
      isSimulating: true,
      simulationLoadingMode: "initial",
      simulationLoadingSteps: baseAnalysis.reasoningSteps,
      simulationSessions: [newSession, ...state.simulationSessions],
      activeSessionId: newSessionId,
      currentAnalysis: baseAnalysis,
      committeeMessages: committeeMsgs,
      selectedTargetRepId: "all",
    }));

    setTimeout(() => {
      set({
        isSimulating: false,
        simulationLoadingMode: null,
      });
    }, 3700);
  },

  openSimulationSession: (sessionId, versionNumber, targetTab = "simulator") => {
    const session = get().simulationSessions.find((s) => s.id === sessionId);
    if (!session) return;

    const targetVerNum = versionNumber || session.activeVersionNumber;
    const versionObj =
      session.versions.find((v) => v.versionNumber === targetVerNum) ||
      session.versions[session.versions.length - 1];

    set((state) => ({
      activeSessionId: sessionId,
      activeModuleTab: targetTab,
      currentAnalysis: versionObj.analysis,
      committeeMessages: session.committeeMessages,
      selectedTargetRepId: "all",
      simulationSessions: state.simulationSessions.map((s) =>
        s.id === sessionId ? { ...s, activeVersionNumber: versionObj.versionNumber } : s
      ),
    }));
  },

  selectSessionVersion: (sessionId, versionNumber) => {
    const session = get().simulationSessions.find((s) => s.id === sessionId);
    if (!session) return;
    const versionObj = session.versions.find((v) => v.versionNumber === versionNumber);
    if (!versionObj) return;

    set((state) => ({
      activeSessionId: sessionId,
      currentAnalysis: versionObj.analysis,
      simulationSessions: state.simulationSessions.map((s) =>
        s.id === sessionId ? { ...s, activeVersionNumber: versionNumber } : s
      ),
    }));
  },

  updateNegotiationDecision: (itemId, decision) => {
    const activeId = get().activeSessionId;
    const timeStr = new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });

    set((state) => {
      const session = state.simulationSessions.find((s) => s.id === activeId);
      if (!session) return state;

      const updatedItems = session.negotiationItems.map((it) =>
        it.id === itemId ? { ...it, status: decision } : it
      );

      const targetItem = session.negotiationItems.find((it) => it.id === itemId);
      const baseDirective = session.versions[0]?.analysis.proposedDirectiveToBe || session.draftProposalText;
      const newDraft = computeDraftFromNegotiationItems(baseDirective, updatedItems);

      // Atualiza postura da área correspondente
      const newStance: StanceStatus =
        decision === "accepted"
          ? "favoravel"
          : decision === "rejected"
            ? "resistente"
            : "ressalvas";

      const updatedAnalysis: SimulationAnalysis = {
        ...state.currentAnalysis,
        areasAndCommittee: state.currentAnalysis.areasAndCommittee.map((rep) =>
          targetItem && rep.id === targetItem.repId ? { ...rep, stance: newStance } : rep
        ),
      };

      // Adiciona mensagem automática no feed da Mesa Redonda registrando a decisão
      let newCommitteeMsgs = session.committeeMessages;
      if (targetItem && (decision === "accepted" || decision === "rejected")) {
        const decisionMsg: CommitteeChatMessage = {
          id: `com-dec-${Date.now()}`,
          senderType: "representative",
          representativeId: targetItem.repId,
          senderName: targetItem.agentName,
          areaBadge: targetItem.areaShortName,
          avatarColor: targetItem.avatarColor,
          avatarInitials: targetItem.avatarInitials,
          stanceAtTime: newStance,
          timestamp: timeStr,
          content:
            decision === "accepted"
              ? `Perfeito! Com a inclusão da condição **"${targetItem.title}"** na proposta editada, o **${targetItem.areaShortName}** retira a ressalva e passa a apoiar a mudança!`
              : `Registramos que a condição **"${targetItem.title}"** foi negada na proposta. O **${targetItem.areaShortName}** mantém alerta de risco sobre esse ponto no reprocessamento.`,
          highlightBox: {
            type: decision === "accepted" ? "acordo" : "objecao",
            text:
              decision === "accepted"
                ? `Solicitação ACEITA e adicionada ao rascunho da proposta (${targetItem.areaShortName}).`
                : `Solicitação NEGADA pelo usuário (${targetItem.areaShortName}).`,
          },
        };
        newCommitteeMsgs = [...session.committeeMessages, decisionMsg];
      }

      return {
        currentAnalysis: updatedAnalysis,
        committeeMessages: newCommitteeMsgs,
        simulationSessions: state.simulationSessions.map((s) =>
          s.id === activeId
            ? {
                ...s,
                negotiationItems: updatedItems,
                draftProposalText: newDraft,
                committeeMessages: newCommitteeMsgs,
              }
            : s
        ),
      };
    });
  },

  updateDraftProposalText: (newText) => {
    const activeId = get().activeSessionId;
    set((state) => ({
      simulationSessions: state.simulationSessions.map((s) =>
        s.id === activeId ? { ...s, draftProposalText: newText } : s
      ),
    }));
  },

  reprocessSimulationFromRoundtable: () => {
    const state = get();
    const session = state.simulationSessions.find((s) => s.id === state.activeSessionId);
    if (!session) return;

    const baseAnalysis = session.versions[0].analysis;
    const nextVersionNumber = session.versions.length + 1;
    const acceptedCount = session.negotiationItems.filter((i) => i.status === "accepted").length;
    const rejectedCount = session.negotiationItems.filter((i) => i.status === "rejected").length;

    const newAnalysis = buildReprocessedAnalysis(
      baseAnalysis,
      session.negotiationItems,
      session.draftProposalText,
      nextVersionNumber
    );

    const nowStr =
      new Date().toLocaleDateString("pt-BR") +
      " às " +
      new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });

    const newVersion: SimulationReportVersion = {
      versionNumber: nextVersionNumber,
      versionLabel: `v${nextVersionNumber} · Pós-Mesa Redonda (${acceptedCount} acordo${acceptedCount === 1 ? "" : "s"})`,
      createdAt: nowStr,
      authorNote: `Relatório reprocessado com ${acceptedCount} condicionante(s) aceita(s) e ${rejectedCount} negada(s) na Mesa Redonda.`,
      acceptedConditionsCount: acceptedCount,
      rejectedConditionsCount: rejectedCount,
      analysis: newAnalysis,
    };

    const reprocessSteps = [
      `Lendo nova proposta calibrada e ${acceptedCount} acordos firmados na Mesa Redonda...`,
      "Reavaliando bloqueios em Políticas Internas e Normas Regulatórias (Contexto Ativo & Passivo)...",
      "Recalculando projeções de Indicadores Positivos vs. Negativos e Score de Risco Sistêmico...",
      `Gerando Relatório Consolidado v${nextVersionNumber} abaixo do guarda-chuva da simulação...`,
    ];

    const comMsg: CommitteeChatMessage = {
      id: `com-reproc-${Date.now()}`,
      senderType: "moderator",
      senderName: "Moderador da Mesa Redonda",
      timestamp: "Simulação Reprocessada",
      content: `🔄 **Relatório v${nextVersionNumber} Gerado com Sucesso!** Os impactos foram recalculados com base na proposta negociada (Risco Sistêmico atualizado para **${newAnalysis.overallRiskScore}/100**).`,
    };

    set((prev) => ({
      activeModuleTab: "simulator",
      isSimulating: true,
      simulationLoadingMode: "reprocess",
      simulationLoadingSteps: reprocessSteps,
      currentAnalysis: newAnalysis,
      committeeMessages: [...session.committeeMessages, comMsg],
      simulationSessions: prev.simulationSessions.map((s) =>
        s.id === session.id
          ? {
              ...s,
              updatedAt: nowStr,
              activeVersionNumber: nextVersionNumber,
              versions: [...s.versions, newVersion],
              committeeMessages: [...s.committeeMessages, comMsg],
            }
          : s
      ),
    }));

    setTimeout(() => {
      set({
        isSimulating: false,
        simulationLoadingMode: null,
      });
    }, 3700);
  },

  currentAnalysis: INITIAL_UMBRELLA_SESSIONS[0].versions[0].analysis,
  simulatorMessages: [],

  loadScenario: (scenarioId) => {
    // Se já existir uma sessão para este cenário, abre ela; caso contrário cria
    const existing = get().simulationSessions.find((s) => s.versions[0]?.analysis.id === scenarioId);
    if (existing) {
      get().openSimulationSession(existing.id, 1, "simulator");
      return;
    }
    const scenario = SIMULATION_SCENARIOS[scenarioId] || SIMULATION_SCENARIOS["telecom-throttling-d1"];
    get().startNewSimulationFromPrompt(scenario.userDirectivePrompt, scenarioId);
  },

  sendSimulatorMessage: (userText) => {
    get().startNewSimulationFromPrompt(userText);
  },

  applyConsensusToSimulation: () => {
    const state = get();
    const session = state.simulationSessions.find((s) => s.id === state.activeSessionId);
    if (!session) return;

    // Marca todas as condições como aceitas e reprocessa
    const allAccepted = session.negotiationItems.map((it) => ({
      ...it,
      status: "accepted" as NegotiationDecisionStatus,
    }));
    const baseDirective = session.versions[0]?.analysis.proposedDirectiveToBe || session.draftProposalText;
    const newDraft = computeDraftFromNegotiationItems(baseDirective, allAccepted);

    set((prev) => ({
      simulationSessions: prev.simulationSessions.map((s) =>
        s.id === session.id
          ? {
              ...s,
              negotiationItems: allAccepted,
              draftProposalText: newDraft,
            }
          : s
      ),
    }));

    get().reprocessSimulationFromRoundtable();
  },

  committeeMessages: INITIAL_UMBRELLA_SESSIONS[0].committeeMessages,
  selectedTargetRepId: "all",
  setSelectedTargetRepId: (repId) => set({ selectedTargetRepId: repId }),

  openCommitteeForArea: (repId) => {
    set({
      activeModuleTab: "committee",
      selectedTargetRepId: repId || "all",
    });
  },

  sendCommitteeMessage: (userText, targetRepId) => {
    const trimmed = userText.trim();
    if (!trimmed) return;

    const current = get().currentAnalysis;
    const reps = current.areasAndCommittee;
    const effectiveTarget = targetRepId || get().selectedTargetRepId;
    const timeStr = new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
    const activeId = get().activeSessionId;

    const userMsg: CommitteeChatMessage = {
      id: `com-user-${Date.now()}`,
      senderType: "user",
      senderName: "Você (Estrategista / Proponente)",
      timestamp: timeStr,
      content: trimmed,
    };

    const lower = trimmed.toLowerCase();
    const mentionsAcceptOrCompromise =
      lower.includes("boleto") ||
      lower.includes("48h") ||
      lower.includes("aviso") ||
      lower.includes("whatsapp") ||
      lower.includes("pix") ||
      lower.includes("bom pagador") ||
      lower.includes("score") ||
      lower.includes("acordo") ||
      lower.includes("3 dias") ||
      lower.includes("2 dias") ||
      lower.includes("aceitam") ||
      lower.includes("concordam") ||
      lower.includes("consenso") ||
      lower.includes("spot") ||
      lower.includes("contrato");

    if (effectiveTarget !== "all") {
      const rep = reps.find((r) => r.id === effectiveTarget) || reps[0];
      const newStance: StanceStatus = mentionsAcceptOrCompromise ? "favoravel" : rep.stance;

      let responseContent = "";
      if (rep.id === "rep-jur") {
        responseContent = mentionsAcceptOrCompromise
          ? `Se garantirmos a notificação formal prévia e usarmos apenas um alerta interativo (com QR Code Pix) nos primeiros dias sem degradar a velocidade contratada antes do prazo do Art. 91 da Resolução 632 da Anatel, **o Jurídico retira o veto**! Já atualizei a minuta da proposta com essa salvaguarda.`
          : `Pela ótica do **${rep.shortArea}**, minha principal trava continua sendo o Art. 90 e 91 da Resolução Anatel 632/2014. Reduzir a banda em D+1 sem o prazo legal de 15 dias pós-notificação gera autuação certa. Aceite nossa condição ao lado para transformarmos a ação de D+1 em alerta digital interativo.`;
      } else if (rep.id === "rep-cx") {
        responseContent = mentionsAcceptOrCompromise
          ? `Com a isenção dos clientes de Bom Histórico e o aviso claro via WhatsApp/App com botão de Pix e Desbloqueio em Confiança, evitamos a enxurrada de 13 mil ligações no Suporte Técnico. **CX passa a apoiar a mudança!**`
          : `Olhando por **${rep.shortArea}**, quando a velocidade cai em D+1 sem aviso, o cliente acha que a fibra está com defeito e liga para o Call Center. Para eu aprovar, aceite a condição de poupar clientes Bom Pagador nos primeiros 5 dias e enviar alerta com Pix 1-clique.`;
      } else if (rep.id === "rep-ti") {
        responseContent = mentionsAcceptOrCompromise
          ? `Perfeito! Respeitando a janela de 48h úteis para compensação dos arquivos CNAB de boletos e usando eventos via Webhook Pix sem derrubar as sessões PPPoE no Radius, **TI e Engenharia de Redes dão sinal verde técnico**!`
          : `Pela **${rep.shortArea}**, 38% dos boletos pagos no vencimento só baixam no ERP em D+1 à tarde ou D+2. Para Pix e Cartão atuamos em tempo real, mas para boleto precisamos aguardar D+3 útil.`;
      } else {
        responseContent = mentionsAcceptOrCompromise
          ? `Excelente! Esse formato preserva a nossa meta de antecipar mais de R$ 12 milhões no fluxo de caixa e estimula a migração para o Pix, sem gerar atrito desnecessário. **De acordo por ${rep.shortArea}!**`
          : `Por **${rep.shortArea}**, nosso objetivo é capturar eficiência rápida. Estou aberto a flexibilizar a regra para casos de exceção, desde que mantenhamos o gatilho principal ativo.`;
      }

      const repReply: CommitteeChatMessage = {
        id: `com-rep-${Date.now() + 1}`,
        senderType: "representative",
        representativeId: rep.id,
        senderName: rep.agentName,
        senderRole: rep.agentRole,
        areaBadge: rep.shortArea,
        avatarColor: rep.avatarColor,
        avatarInitials: rep.avatarInitials,
        stanceAtTime: newStance,
        timestamp: timeStr,
        content: responseContent,
        highlightBox: mentionsAcceptOrCompromise
          ? {
              type: "acordo",
              text: `${rep.shortArea} atualizou posição para FAVORÁVEL e incorporou o ajuste na proposta.`,
            }
          : {
              type: "concessao",
              text: `Solicitação pendente: ${rep.negotiationConditions[0]}`,
            },
      };

      set((state) => {
        const session = state.simulationSessions.find((s) => s.id === activeId);
        const updatedItems = session
          ? session.negotiationItems.map((it) =>
              mentionsAcceptOrCompromise && it.repId === rep.id
                ? { ...it, status: "accepted" as NegotiationDecisionStatus }
                : it
            )
          : [];
        const newDraft = session
          ? computeDraftFromNegotiationItems(
              session.versions[0]?.analysis.proposedDirectiveToBe || session.draftProposalText,
              updatedItems
            )
          : "";
        const newMsgs = [...state.committeeMessages, userMsg, repReply];

        return {
          committeeMessages: newMsgs,
          currentAnalysis: mentionsAcceptOrCompromise
            ? {
                ...state.currentAnalysis,
                areasAndCommittee: state.currentAnalysis.areasAndCommittee.map((r) =>
                  r.id === rep.id ? { ...r, stance: "favoravel" } : r
                ),
              }
            : state.currentAnalysis,
          simulationSessions: state.simulationSessions.map((s) =>
            s.id === activeId
              ? {
                  ...s,
                  negotiationItems: updatedItems,
                  draftProposalText: mentionsAcceptOrCompromise ? newDraft : s.draftProposalText,
                  committeeMessages: newMsgs,
                }
              : s
          ),
        };
      });
      return;
    }

    // Conversa com TODA A MESA ("all")
    const replies: CommitteeChatMessage[] = reps.map((rep, idx) => {
      const updatedStance: StanceStatus = mentionsAcceptOrCompromise ? "favoravel" : rep.stance;
      let text = "";

      if (idx === 0) {
        text = mentionsAcceptOrCompromise
          ? `Concordo com a linha proposta por você. Incorporando esse ajuste na proposta, já capturamos 85% do resultado que **${rep.shortArea}** precisa.`
          : `Analisando seu ponto ("${trimmed}"), para **${rep.shortArea}** o essencial é não mantermos a inércia atual. Podemos calibrar as exceções com as demais áreas.`;
      } else if (idx === 1) {
        text = mentionsAcceptOrCompromise
          ? `Para **${rep.shortArea}**, essa proposta resolve nossa maior preocupação! Retiro minha objeção e aprovo a atualização da diretriz.`
          : `Complementando ${reps[0].shortArea}: nós apoiamos a meta, mas precisamos que nossa salvaguarda operacional seja aceita no painel ao lado para evitar impacto severo na ponta.`;
      } else if (idx === 2) {
        text = mentionsAcceptOrCompromise
          ? `Por **${rep.shortArea}**, com esse ajuste ficamos 100% aderentes às normas vigentes. Aprovado para reprocessamento!`
          : `Reforço para a mesa: precisamos respeitar as travas normativas e sistêmicas listadas nas nossas condições antes de homologar.`;
      } else {
        text = mentionsAcceptOrCompromise
          ? `Pela **${rep.shortArea}**, respeitando essa condição técnica eliminamos os falsos-positivos. Temos viabilidade técnica imediata!`
          : `Do lado de **${rep.shortArea}**, concordo com as ressalvas: basta aceitarmos as condições técnicas na proposta ao lado e reprocessarmos a simulação.`;
      }

      return {
        id: `com-round-${Date.now()}-${idx}`,
        senderType: "representative",
        representativeId: rep.id,
        senderName: rep.agentName,
        senderRole: rep.agentRole,
        areaBadge: rep.shortArea,
        avatarColor: rep.avatarColor,
        avatarInitials: rep.avatarInitials,
        stanceAtTime: updatedStance,
        timestamp: timeStr,
        replyToArea: idx > 0 ? reps[0].shortArea : undefined,
        content: text,
        highlightBox: mentionsAcceptOrCompromise
          ? {
              type: "acordo",
              text: `${rep.shortArea}: De acordo com a proposta calibrada.`,
            }
          : undefined,
      };
    });

    set((state) => {
      const session = state.simulationSessions.find((s) => s.id === activeId);
      const updatedItems = session
        ? session.negotiationItems.map((it) =>
            mentionsAcceptOrCompromise ? { ...it, status: "accepted" as NegotiationDecisionStatus } : it
          )
        : [];
      const newDraft = session
        ? computeDraftFromNegotiationItems(
            session.versions[0]?.analysis.proposedDirectiveToBe || session.draftProposalText,
            updatedItems
          )
        : "";
      const newMsgs = [...state.committeeMessages, userMsg, ...replies];

      return {
        committeeMessages: newMsgs,
        currentAnalysis: mentionsAcceptOrCompromise
          ? {
              ...state.currentAnalysis,
              areasAndCommittee: state.currentAnalysis.areasAndCommittee.map((r) => ({
                ...r,
                stance: "favoravel",
              })),
            }
          : state.currentAnalysis,
        simulationSessions: state.simulationSessions.map((s) =>
          s.id === activeId
            ? {
                ...s,
                negotiationItems: updatedItems,
                draftProposalText: mentionsAcceptOrCompromise ? newDraft : s.draftProposalText,
                committeeMessages: newMsgs,
              }
            : s
        ),
      };
    });
  },

  triggerCommitteeRound: (roundType) => {
    const current = get().currentAnalysis;
    const reps = current.areasAndCommittee;
    const activeId = get().activeSessionId;
    const timeStr = new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });

    if (roundType === "clash") {
      const clashMessages: CommitteeChatMessage[] = [
        {
          id: `com-clash-mod-${Date.now()}`,
          senderType: "moderator",
          senderName: "Moderador da Mesa Redonda",
          timestamp: timeStr,
          content:
            "🔥 **Rodada de Debate Cruzado Iniciada:** Colocando em discussão o trade-off direto entre as áreas favoráveis e as áreas com ressalvas/vetos.",
        },
        {
          id: `com-clash-1-${Date.now()}`,
          senderType: "representative",
          representativeId: reps[0].id,
          senderName: reps[0].agentName,
          senderRole: reps[0].agentRole,
          areaBadge: reps[0].shortArea,
          avatarColor: reps[0].avatarColor,
          avatarInitials: reps[0].avatarInitials,
          stanceAtTime: reps[0].stance,
          timestamp: timeStr,
          content: `Pessoal, entendo as restrições de **${reps[2]?.shortArea}** e de **${reps[1]?.shortArea}**, mas precisamos capturar o ganho financeiro/operacional desta mudança. Quais condições vocês propõem para destravarmos a proposta hoje?`,
        },
        {
          id: `com-clash-2-${Date.now()}`,
          senderType: "representative",
          representativeId: reps[2]?.id || reps[1].id,
          senderName: reps[2]?.agentName || reps[1].agentName,
          senderRole: reps[2]?.agentRole || reps[1].agentRole,
          areaBadge: reps[2]?.shortArea || reps[1].shortArea,
          avatarColor: reps[2]?.avatarColor || reps[1].avatarColor,
          avatarInitials: reps[2]?.avatarInitials || reps[1].avatarInitials,
          stanceAtTime: reps[2]?.stance || "resistente",
          replyToArea: reps[0].shortArea,
          timestamp: timeStr,
          content: `Nossa proposta é objetiva: se aceitarem as condicionantes que listamos no painel da Mesa Redonda, eliminamos o risco regulatório e operacional sem perder a tração do resultado esperado por ${reps[0].shortArea}!`,
          highlightBox: {
            type: "concessao",
            text: "Convergência identificada: aceite as condições das áreas ao lado e clique em 'Reprocessar Simulação'.",
          },
        },
      ];

      set((state) => {
        const newMsgs = [...state.committeeMessages, ...clashMessages];
        return {
          committeeMessages: newMsgs,
          simulationSessions: state.simulationSessions.map((s) =>
            s.id === activeId ? { ...s, committeeMessages: newMsgs } : s
          ),
        };
      });
      return;
    }

    if (roundType === "consensus") {
      const consensus = current.recommendedConsensusProposal;
      const consensusMsg: CommitteeChatMessage = {
        id: `com-cons-round-${Date.now()}`,
        senderType: "moderator",
        senderName: "Síntese de Consenso da Mesa Redonda",
        timestamp: timeStr,
        content: `🤝 **Proposta de Consenso Construída pelas ${reps.length} Áreas:**\n\n**${consensus.title}**\n\n> *"${consensus.adjustedDirectiveText}"*\n\nTodas as solicitações das áreas foram marcadas como **Aceitas** no rascunho da proposta. Clique em **"Reprocessar Simulação"** para gerar o novo relatório!`,
      };

      set((state) => {
        const session = state.simulationSessions.find((s) => s.id === activeId);
        const allAccepted = session
          ? session.negotiationItems.map((it) => ({ ...it, status: "accepted" as NegotiationDecisionStatus }))
          : [];
        const newDraft = session
          ? computeDraftFromNegotiationItems(
              session.versions[0]?.analysis.proposedDirectiveToBe || session.draftProposalText,
              allAccepted
            )
          : consensus.adjustedDirectiveText;
        const newMsgs = [...state.committeeMessages, consensusMsg];

        return {
          committeeMessages: newMsgs,
          currentAnalysis: {
            ...state.currentAnalysis,
            areasAndCommittee: state.currentAnalysis.areasAndCommittee.map((r) => ({
              ...r,
              stance: "favoravel",
            })),
          },
          simulationSessions: state.simulationSessions.map((s) =>
            s.id === activeId
              ? {
                  ...s,
                  negotiationItems: allAccepted,
                  draftProposalText: newDraft,
                  committeeMessages: newMsgs,
                }
              : s
          ),
        };
      });
    }
  },

  addAreaToCommittee: (areaId) => {
    const state = get();
    const areaProfile = state.areaProfiles.find((a) => a.id === areaId);
    if (!areaProfile) return;

    const alreadyInCommittee = state.currentAnalysis.areasAndCommittee.some(
      (rep) => rep.areaId === areaId || rep.shortArea === areaProfile.shortArea
    );
    if (alreadyInCommittee) return;

    const { representative, negotiationItem } = buildRepresentativeFromAreaProfile(
      areaProfile,
      state.currentAnalysis.title
    );

    const timeStr = new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
    const activeId = state.activeSessionId;

    const joinModMsg: CommitteeChatMessage = {
      id: `com-join-mod-${Date.now()}`,
      senderType: "moderator",
      senderName: "Moderador da Mesa Redonda",
      timestamp: timeStr,
      content: `➕ **Nova área convocada para a Mesa Redonda:** O agente **${representative.agentName}** (**${representative.shortArea}**) ingressou na discussão e adicionou suas condicionantes operacionais ao painel de deliberação.`,
    };

    const joinRepMsg: CommitteeChatMessage = {
      id: `com-join-rep-${Date.now() + 1}`,
      senderType: "representative",
      representativeId: representative.id,
      senderName: representative.agentName,
      senderRole: representative.agentRole,
      areaBadge: representative.shortArea,
      avatarColor: representative.avatarColor,
      avatarInitials: representative.avatarInitials,
      stanceAtTime: representative.stance,
      timestamp: "Ingressou na Mesa",
      content: representative.openingStatement,
      highlightBox: {
        type: representative.stance === "resistente" ? "objecao" : "concessao",
        text: `Nova solicitação incluída (${representative.shortArea}): ${negotiationItem.title}`,
      },
    };

    set((prev) => {
      const updatedAreas = [...prev.currentAnalysis.areasAndCommittee, representative];
      const updatedAnalysis: SimulationAnalysis = {
        ...prev.currentAnalysis,
        areasAndCommittee: updatedAreas,
      };
      const newMsgs = [...prev.committeeMessages, joinModMsg, joinRepMsg];

      return {
        currentAnalysis: updatedAnalysis,
        committeeMessages: newMsgs,
        selectedTargetRepId: representative.id,
        simulationSessions: prev.simulationSessions.map((s) => {
          if (s.id !== activeId) return s;
          const updatedNegotiationItems = [...s.negotiationItems, negotiationItem];
          return {
            ...s,
            negotiationItems: updatedNegotiationItems,
            committeeMessages: newMsgs,
            versions: s.versions.map((v) =>
              v.versionNumber === s.activeVersionNumber
                ? { ...v, analysis: updatedAnalysis }
                : v
            ),
          };
        }),
      };
    });
  },

  removeAreaFromCommittee: (repId) => {
    const state = get();
    if (state.currentAnalysis.areasAndCommittee.length <= 1) return;

    const removedRep = state.currentAnalysis.areasAndCommittee.find((r) => r.id === repId);
    if (!removedRep) return;

    const timeStr = new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
    const activeId = state.activeSessionId;

    const leaveModMsg: CommitteeChatMessage = {
      id: `com-leave-mod-${Date.now()}`,
      senderType: "moderator",
      senderName: "Moderador da Mesa Redonda",
      timestamp: timeStr,
      content: `➖ **Área removida da discussão:** A diretoria de **${removedRep.shortArea}** (${removedRep.agentName}) foi retirada da Mesa Redonda e suas condicionantes foram desvinculadas da minuta.`,
    };

    set((prev) => {
      const updatedAreas = prev.currentAnalysis.areasAndCommittee.filter((r) => r.id !== repId);
      const updatedAnalysis: SimulationAnalysis = {
        ...prev.currentAnalysis,
        areasAndCommittee: updatedAreas,
      };
      const newMsgs = [...prev.committeeMessages, leaveModMsg];
      const newTarget = prev.selectedTargetRepId === repId ? "all" : prev.selectedTargetRepId;

      return {
        currentAnalysis: updatedAnalysis,
        committeeMessages: newMsgs,
        selectedTargetRepId: newTarget,
        simulationSessions: prev.simulationSessions.map((s) => {
          if (s.id !== activeId) return s;
          const updatedNegotiationItems = s.negotiationItems.filter((it) => it.repId !== repId);
          const baseDirective = s.versions[0]?.analysis.proposedDirectiveToBe || s.draftProposalText;
          const newDraft = computeDraftFromNegotiationItems(baseDirective, updatedNegotiationItems);
          return {
            ...s,
            negotiationItems: updatedNegotiationItems,
            draftProposalText: newDraft,
            committeeMessages: newMsgs,
            versions: s.versions.map((v) =>
              v.versionNumber === s.activeVersionNumber
                ? { ...v, analysis: updatedAnalysis }
                : v
            ),
          };
        }),
      };
    });
  },
}));
