export interface AIDiscoveryInput {
  painPoint: string;
  domain?: string;
  objective?: string;
  sector?: string;
  systems?: string;
  urgency?: string;
  context?: string;
}

export type AIMatchStatus = 
  | 'encontrado_alta' 
  | 'correspondencia_parcial' 
  | 'sugerido_ia' 
  | 'confirmado_usuario' 
  | 'nao_localizado'
  | 'pendente_validacao';

export interface AIJourneyStep {
  id: string;
  order: number;
  stepName: string;
  objective?: string;
  expectedProcess?: string;
  expectedSystems: string[];
  expectedIndicators?: string[];
  domain?: string;
  level?: string;
  
  // Mapeamento na arquitetura
  suggestedProcessId?: string;
  suggestedProcessName?: string;
  matchReason?: string;
  matchConfidence: number;
  matchStatus: AIMatchStatus;
  evidenceUsed?: string;
  
  // Ação e estado escolhido pelo usuário
  userAction?: 'manter' | 'confirmar' | 'substituir' | 'remover' | 'criar_provisorio' | 'sem_vinculo' | 'pendente';
  finalProcessId?: string;
  finalProcessName?: string;
  isProvisional?: boolean;
}

export interface AIJourneySuggestion {
  name: string;
  namePT: string;
  nameEN: string;
  objective: string;
  triggerEvent: string;
  expectedOutcome: string;
  mainDomain: string;
  confidence: number;
  source: string;
  steps: AIJourneyStep[];
}

export function generateMockJourneyFromAI(input: AIDiscoveryInput): AIJourneySuggestion {
  // Cenário canônico alinhado com o prompt: Order to Cash com 88% de confiança e diferentes estados
  return {
    name: "Order to Cash",
    namePT: "Order to Cash",
    nameEN: "Order to Cash",
    objective: "Acompanhar a entrega de ponta a ponta desde a qualificação da oportunidade comercial até o faturamento e recebimento do pagamento.",
    triggerEvent: "Oportunidade comercial qualificada aprovada",
    expectedOutcome: "Venda formalizada, produto/serviço liberado, fatura emitida e pagamento liquidado",
    mainDomain: input.domain || "Gestão Comercial",
    confidence: 88,
    source: "Arquitetura ProcessHub & Benchmarking de Entregas B2B",
    steps: [
      {
        id: "ai-step-1",
        order: 1,
        stepName: "Qualificar Oportunidade",
        objective: "Avaliar o perfil de compra (BANT) e validar viabilidade da proposta técnica.",
        expectedProcess: "Qualificar Oportunidade",
        domain: "Gestão Comercial",
        level: "L4",
        expectedSystems: ["CRM Salesforce"],
        suggestedProcessId: "proc-qualificar-opp",
        suggestedProcessName: "Qualificar Oportunidade",
        matchReason: "Correspondência exata de nomenclatura e taxonomia no domínio Gestão Comercial.",
        matchConfidence: 96,
        matchStatus: "encontrado_alta",
        evidenceUsed: "Processo cadastrado em L4 na arquitetura com documentação aprovada.",
        userAction: "pendente"
      },
      {
        id: "ai-step-2",
        order: 2,
        stepName: "Receber Requisitos Comerciais",
        objective: "Capturar premissas contratuais e volume demandado pelo cliente.",
        expectedProcess: "Recebimento de Requisitos",
        domain: "Gestão Comercial",
        level: "L4",
        expectedSystems: ["CRM Salesforce", "E-mail"],
        suggestedProcessId: "proc-requisitos-comerciais",
        suggestedProcessName: "Receber Requisitos Comerciais",
        matchReason: "Correspondência semântica com os insumos de entrada de propostas comerciais.",
        matchConfidence: 78,
        matchStatus: "correspondencia_parcial",
        evidenceUsed: "Mapeado como insumo de entrada da oportunidade.",
        userAction: "pendente"
      },
      {
        id: "ai-step-3",
        order: 3,
        stepName: "Precificação e Análise de Margem Comercial",
        objective: "Calcular tabela de preços sob medida e validar margem de contribuição.",
        expectedProcess: "Precificação e Análise de Margem Comercial",
        domain: "Gestão Comercial",
        level: "L4",
        expectedSystems: ["Planilhas Comerciais (Excel)", "CRM Salesforce"],
        suggestedProcessId: "proc-precificacao",
        suggestedProcessName: "Precificação e Análise de Margem Comercial",
        matchReason: "Correspondência exata do processo central da cadeia comercial.",
        matchConfidence: 95,
        matchStatus: "encontrado_alta",
        evidenceUsed: "Processo ativo e documentado na arquitetura.",
        userAction: "pendente"
      },
      {
        id: "ai-step-4",
        order: 4,
        stepName: "Elaborar e Apresentar Proposta Comercial",
        objective: "Montar a minuta executiva de proposta com condições e cronograma.",
        expectedProcess: "Elaborar e Apresentar Proposta Comercial",
        domain: "Gestão Comercial",
        level: "L4",
        expectedSystems: ["CRM Salesforce"],
        suggestedProcessId: "proc-elaborar-proposta",
        suggestedProcessName: "Elaborar e Apresentar Proposta Comercial",
        matchReason: "Correspondência direta com handoff posterior à precificação.",
        matchConfidence: 92,
        matchStatus: "encontrado_alta",
        evidenceUsed: "Processo cadastrado em Negociação e Fechamento.",
        userAction: "pendente"
      },
      {
        id: "ai-step-5",
        order: 5,
        stepName: "Formalização e Assinatura Eletrônica de Contrato",
        objective: "Emitir minuta jurídica e colher assinaturas digitais válidas.",
        expectedProcess: "Formalização e Assinatura Eletrônica de Contrato",
        domain: "Gestão Comercial",
        level: "L4",
        expectedSystems: ["DocuSign", "CRM Salesforce"],
        suggestedProcessId: "proc-contrato",
        suggestedProcessName: "Formalização e Assinatura Eletrônica de Contrato",
        matchReason: "Correspondência exata do fechamento contratual.",
        matchConfidence: 94,
        matchStatus: "encontrado_alta",
        evidenceUsed: "Processo integrado ao DocuSign.",
        userAction: "pendente"
      },
      {
        id: "ai-step-6",
        order: 6,
        stepName: "Faturamento",
        objective: "Emissão de nota fiscal e liberação dos marcos de cobrança.",
        expectedProcess: "Faturamento",
        domain: "Financeiro",
        level: "L4",
        expectedSystems: ["ERP Financeiro SAP"],
        suggestedProcessId: "proc-faturamento",
        suggestedProcessName: "Faturamento",
        matchReason: "Correspondência exata com o módulo de Contas a Receber do Financeiro.",
        matchConfidence: 90,
        matchStatus: "encontrado_alta",
        evidenceUsed: "Processo financeiro padrão da organização.",
        userAction: "pendente"
      },
      {
        id: "ai-step-7",
        order: 7,
        stepName: "Registrar Pagamento",
        objective: "Identificação da liquidação bancária e baixa de duplicatas no contas a receber.",
        expectedProcess: "Baixa de Títulos e Conciliação",
        domain: "Financeiro",
        level: "L4",
        expectedSystems: ["ERP Financeiro SAP", "Portal Bancário"],
        // Demonstrando sugestão da IA que requer revisão/validação do usuário
        suggestedProcessId: "proc-pagamento",
        suggestedProcessName: "Registrar Pagamento",
        matchReason: "Etapa sugerida para completar a entrega de ponta a ponta até a entrada de caixa.",
        matchConfidence: 65,
        matchStatus: "sugerido_ia",
        evidenceUsed: "Inferência a jusante do faturamento baseada no objetivo da jornada.",
        userAction: "pendente"
      }
    ]
  };
}
