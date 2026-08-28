// Mock value chain (fallback) and mock opportunities for the
// "Descobrir oportunidades" visual shell.

export interface MockL4 { id: string; name: string; }
export interface MockL3 { id: string; name: string; l4: MockL4[]; }
export interface MockL2 { id: string; name: string; l3: MockL3[]; }
export interface MockL1 { id: string; name: string; l2: MockL2[]; }

export const mockValueChain: MockL1[] = [
  {
    id: "rh", name: "RH",
    l2: [
      { id: "rh-rec", name: "Recrutamento", l3: [
        { id: "rh-rec-tri", name: "Triagem", l4: [
          { id: "rh-rec-tri-cv", name: "Análise de currículos" },
          { id: "rh-rec-tri-pre", name: "Pré-entrevista telefônica" },
        ]},
        { id: "rh-rec-ent", name: "Entrevista", l4: [
          { id: "rh-rec-ent-tec", name: "Entrevista técnica" },
          { id: "rh-rec-ent-cul", name: "Fit cultural" },
        ]},
        { id: "rh-rec-ofe", name: "Oferta", l4: [
          { id: "rh-rec-ofe-prop", name: "Elaboração de proposta" },
          { id: "rh-rec-ofe-neg", name: "Negociação salarial" },
        ]},
      ]},
      { id: "rh-onb", name: "Onboarding", l3: [
        { id: "rh-onb-int", name: "Integração", l4: [
          { id: "rh-onb-int-doc", name: "Documentação admissional" },
          { id: "rh-onb-int-tre", name: "Treinamento inicial" },
        ]},
      ]},
      { id: "rh-fol", name: "Folha de Pagamento", l3: [
        { id: "rh-fol-cal", name: "Cálculo de folha", l4: [
          { id: "rh-fol-cal-base", name: "Apuração de horas" },
          { id: "rh-fol-cal-imp", name: "Cálculo de impostos" },
        ]},
      ]},
    ],
  },
  {
    id: "fin", name: "Financeiro",
    l2: [
      { id: "fin-cp", name: "Contas a Pagar", l3: [
        { id: "fin-cp-rec", name: "Recebimento de notas", l4: [
          { id: "fin-cp-rec-val", name: "Validação fiscal" },
        ]},
        { id: "fin-cp-apr", name: "Aprovação de pagamento", l4: [
          { id: "fin-cp-apr-fluxo", name: "Fluxo de aprovação" },
        ]},
      ]},
      { id: "fin-cr", name: "Contas a Receber", l3: [
        { id: "fin-cr-fat", name: "Faturamento", l4: [] },
        { id: "fin-cr-cob", name: "Cobrança", l4: [] },
      ]},
    ],
  },
  {
    id: "sup", name: "Suprimentos",
    l2: [
      { id: "sup-com", name: "Compras", l3: [
        { id: "sup-com-req", name: "Requisição", l4: [] },
        { id: "sup-com-cot", name: "Cotação", l4: [] },
      ]},
      { id: "sup-for", name: "Fornecedores", l3: [
        { id: "sup-for-hom", name: "Homologação", l4: [] },
      ]},
    ],
  },
];

export type ValueLever =
  | "Eficiência Operacional"
  | "Experiência do Colaborador"
  | "Custo Operacional"
  | "Qualidade & Compliance"
  | "Velocidade de Decisão";

export const VALUE_LEVERS: ValueLever[] = [
  "Eficiência Operacional",
  "Experiência do Colaborador",
  "Custo Operacional",
  "Qualidade & Compliance",
  "Velocidade de Decisão",
];

export interface ValueLeverMeta {
  name: ValueLever;
  description: string;
  kpis: string[];
}

export const VALUE_LEVERS_META: ValueLeverMeta[] = [
  {
    name: "Eficiência Operacional",
    description: "Reduzir tempo, eliminar desperdício e aumentar throughput dos processos",
    kpis: ["Tempo de ciclo", "Throughput", "% Retrabalho"],
  },
  {
    name: "Experiência do Colaborador",
    description: "Melhorar a jornada, autonomia e satisfação de quem executa os processos",
    kpis: ["NPS interno", "Tempo de onboarding", "Taxa de turnover"],
  },
  {
    name: "Custo Operacional",
    description: "Diminuir custo por transação, headcount dedicado e desperdício financeiro",
    kpis: ["Custo por processo", "Headcount dedicado", "Custo por erro"],
  },
  {
    name: "Qualidade & Compliance",
    description: "Aumentar confiabilidade, rastreabilidade e aderência regulatória",
    kpis: ["Taxa de erro", "SLA cumprido", "Índice de auditabilidade"],
  },
  {
    name: "Velocidade de Decisão",
    description: "Acelerar ciclos de aprovação, reporte e tomada de decisão",
    kpis: ["Lead time de aprovação", "Ciclo de reporte", "Tempo de fechamento"],
  },
];

export type ImpactLevel = "Alto" | "Médio" | "Baixo" | "Não impactado";
export type ProcessAction = "Redesenhar" | "Automatizar" | "Integrar" | "Padronizar" | "Eliminar";
export type Complexity = "Baixa" | "Média" | "Alta";

export interface ImpactedProcess {
  name: string;
  level: "L3" | "L4";
  action: ProcessAction;
  complexity: Complexity;
  improvement: string; // e.g. "+35%"
}

export interface MockOpportunity {
  id: string;
  title: string;
  description: string;
  tags: string[];
  impact: "Alto" | "Médio" | "Baixo";
  effort: "Alto" | "Médio" | "Baixo";
  estimatedGain: string;
  impactedProcesses: ImpactedProcess[];
  why: string;
  potentialGains: string[];
  suggestedDirection: string;
  valueLeverImpacts: Record<ValueLever, ImpactLevel>;
  benchmarkReference: string;
  suggestedUseCase: string;
}

// Position helpers for the matrix
export const impactScore: Record<MockOpportunity["impact"], number> = {
  Alto: 0.85, Médio: 0.55, Baixo: 0.25,
};
export const effortScore: Record<MockOpportunity["effort"], number> = {
  Baixo: 0.25, Médio: 0.55, Alto: 0.85,
};

export const mockOpportunities: MockOpportunity[] = [
  {
    id: "op-1",
    title: "Triagem automática de currículos com IA",
    description: "Análise inicial de currículos é manual e consome ~3h por vaga. Modelo de IA pode pré-ranquear candidatos.",
    tags: ["Eficiência", "Automação", "IA"],
    impact: "Alto", effort: "Baixo",
    estimatedGain: "-65% tempo de triagem",
    impactedProcesses: [
      { name: "RH > Recrutamento > Triagem", level: "L3", action: "Automatizar", complexity: "Média", improvement: "+65%" },
      { name: "RH > Recrutamento > Triagem > Análise de currículos", level: "L4", action: "Automatizar", complexity: "Baixa", improvement: "+70%" },
    ],
    why: "Processo identificado com alto volume manual e baixa variabilidade — perfil ideal para automação assistida por IA. Benchmark de mercado mostra reduções de 60–70% no tempo médio.",
    potentialGains: ["Redução de 65% no tempo de triagem", "Padronização da avaliação inicial", "Liberação de 20h/semana do time de RH"],
    suggestedDirection: "Implementar pipeline de scoring com LLM + revisão humana nos top 20%.",
    valueLeverImpacts: {
      "Eficiência Operacional": "Alto",
      "Experiência do Colaborador": "Médio",
      "Custo Operacional": "Médio",
      "Qualidade & Compliance": "Médio",
      "Velocidade de Decisão": "Alto",
    },
    benchmarkReference: "Empresas do setor reportam 60-70% de redução no tempo de triagem com soluções de IA assistida (Fonte: Gartner HR Tech 2024).",
    suggestedUseCase: "Pipeline de scoring com LLM integrado ao ATS, ranqueando candidatos em 4 níveis e gerando justificativa estruturada para revisão humana.",
  },
  {
    id: "op-2",
    title: "Aprovação de pagamentos com fluxo digital",
    description: "Aprovações por e-mail geram retrabalho e atrasam SLA em até 4 dias.",
    tags: ["Eficiência", "Processo", "Compliance"],
    impact: "Alto", effort: "Médio",
    estimatedGain: "-40% tempo de ciclo",
    impactedProcesses: [
      { name: "Financeiro > Contas a Pagar > Aprovação de pagamento", level: "L3", action: "Redesenhar", complexity: "Média", improvement: "+40%" },
      { name: "Financeiro > Contas a Pagar > Aprovação de pagamento > Fluxo de aprovação", level: "L4", action: "Automatizar", complexity: "Baixa", improvement: "+55%" },
    ],
    why: "SLA atual está 2.3x acima do benchmark. Falta de trilha de auditoria gera risco de compliance.",
    potentialGains: ["Redução de 4 para 1 dia no ciclo", "Trilha de auditoria completa", "Visibilidade em tempo real"],
    suggestedDirection: "Workflow no BPMS com regras por alçada e notificações automáticas.",
    valueLeverImpacts: {
      "Eficiência Operacional": "Alto",
      "Experiência do Colaborador": "Baixo",
      "Custo Operacional": "Médio",
      "Qualidade & Compliance": "Alto",
      "Velocidade de Decisão": "Alto",
    },
    benchmarkReference: "Empresas que digitalizam aprovação financeira reduzem ciclo em 40-55% e elevam compliance em 80% (Fonte: APQC Process Benchmarks 2024).",
    suggestedUseCase: "Workflow no BPMS com regras por alçada, notificações via Teams/email e trilha de auditoria persistida em Lake.",
  },
  {
    id: "op-3",
    title: "OCR para validação fiscal de notas",
    description: "Validação manual de notas fiscais com erros de digitação frequentes.",
    tags: ["Qualidade", "Automação"],
    impact: "Médio", effort: "Baixo",
    estimatedGain: "-50% erros",
    impactedProcesses: [
      { name: "Financeiro > Contas a Pagar > Recebimento de notas > Validação fiscal", level: "L4", action: "Automatizar", complexity: "Baixa", improvement: "+50%" },
    ],
    why: "Volume alto e regras determinísticas. OCR + validação automática elimina retrabalho.",
    potentialGains: ["50% menos erros", "Processamento 4x mais rápido"],
    suggestedDirection: "OCR com validação cruzada contra SEFAZ.",
    valueLeverImpacts: {
      "Eficiência Operacional": "Alto",
      "Experiência do Colaborador": "Baixo",
      "Custo Operacional": "Médio",
      "Qualidade & Compliance": "Alto",
      "Velocidade de Decisão": "Médio",
    },
    benchmarkReference: "OCR + RPA em validação fiscal entrega 50-60% de redução em retrabalho (Fonte: EY Process Survey 2024).",
    suggestedUseCase: "OCR + validação cruzada contra SEFAZ; exceções vão para fila humana com priorização por valor.",
  },
  {
    id: "op-4",
    title: "Padronização do fit cultural",
    description: "Avaliação de fit cultural varia entre entrevistadores, gerando inconsistência.",
    tags: ["Qualidade", "Experiência"],
    impact: "Médio", effort: "Médio",
    estimatedGain: "+30% consistência",
    impactedProcesses: [
      { name: "RH > Recrutamento > Entrevista > Fit cultural", level: "L4", action: "Padronizar", complexity: "Baixa", improvement: "+30%" },
    ],
    why: "Variância alta entre entrevistadores indica falta de critérios objetivos.",
    potentialGains: ["Maior consistência nas decisões", "Redução de turnover precoce"],
    suggestedDirection: "Rubrica estruturada + treinamento de calibração.",
    valueLeverImpacts: {
      "Eficiência Operacional": "Baixo",
      "Experiência do Colaborador": "Alto",
      "Custo Operacional": "Baixo",
      "Qualidade & Compliance": "Alto",
      "Velocidade de Decisão": "Médio",
    },
    benchmarkReference: "Entrevistas estruturadas reduzem turnover precoce em 25-35% (Fonte: McKinsey Talent 2024).",
    suggestedUseCase: "Rubrica de avaliação estruturada com 6 dimensões e calibração trimestral entre entrevistadores.",
  },
  {
    id: "op-5",
    title: "Self-service de documentação admissional",
    description: "Coleta de documentos admissionais via e-mail é lenta e propensa a perdas.",
    tags: ["Experiência", "Eficiência"],
    impact: "Alto", effort: "Baixo",
    estimatedGain: "-70% tempo de coleta",
    impactedProcesses: [
      { name: "RH > Onboarding > Integração > Documentação admissional", level: "L4", action: "Automatizar", complexity: "Baixa", improvement: "+70%" },
    ],
    why: "Processo padronizado com input do próprio colaborador — candidato perfeito para self-service.",
    potentialGains: ["Coleta em 1 dia vs 5 dias", "Zero perda de documentos"],
    suggestedDirection: "Portal do novo colaborador com checklist e upload guiado.",
    valueLeverImpacts: {
      "Eficiência Operacional": "Alto",
      "Experiência do Colaborador": "Alto",
      "Custo Operacional": "Médio",
      "Qualidade & Compliance": "Médio",
      "Velocidade de Decisão": "Médio",
    },
    benchmarkReference: "Portais self-service reduzem tempo de admissão em 60-75% (Fonte: Gartner HR 2024).",
    suggestedUseCase: "Portal do colaborador com checklist dinâmico, upload guiado e validação automática.",
  },
  {
    id: "op-6",
    title: "Cobrança preditiva por risco de inadimplência",
    description: "Cobrança hoje é reativa; modelo preditivo permite ação antecipada.",
    tags: ["IA", "Custo"],
    impact: "Alto", effort: "Alto",
    estimatedGain: "-15% inadimplência",
    impactedProcesses: [
      { name: "Financeiro > Contas a Receber > Cobrança", level: "L3", action: "Redesenhar", complexity: "Alta", improvement: "+15%" },
    ],
    why: "Dados históricos suficientes para modelo de scoring de risco.",
    potentialGains: ["Redução de inadimplência", "Priorização inteligente da carteira"],
    suggestedDirection: "Modelo ML com score diário e gatilhos de ação.",
    valueLeverImpacts: {
      "Eficiência Operacional": "Médio",
      "Experiência do Colaborador": "Não impactado",
      "Custo Operacional": "Alto",
      "Qualidade & Compliance": "Médio",
      "Velocidade de Decisão": "Alto",
    },
    benchmarkReference: "Modelos preditivos de cobrança reduzem inadimplência em 12-18% (Fonte: McKinsey Risk 2024).",
    suggestedUseCase: "Modelo ML com score diário de risco e playbook de ações por faixa (auto-régua, contato humano).",
  },
  {
    id: "op-7",
    title: "Negociação salarial com benchmarks de mercado",
    description: "Propostas geradas sem dados consistentes de mercado, gerando desalinhamento.",
    tags: ["Qualidade", "Experiência"],
    impact: "Médio", effort: "Médio",
    estimatedGain: "+20% taxa de aceite",
    impactedProcesses: [
      { name: "RH > Recrutamento > Oferta > Negociação salarial", level: "L4", action: "Integrar", complexity: "Média", improvement: "+20%" },
    ],
    why: "Falta de dados objetivos aumenta retrabalho e ofertas recusadas.",
    potentialGains: ["Maior taxa de aceite", "Equidade salarial"],
    suggestedDirection: "Integração com fontes de mercado + faixa por nível.",
    valueLeverImpacts: {
      "Eficiência Operacional": "Médio",
      "Experiência do Colaborador": "Alto",
      "Custo Operacional": "Médio",
      "Qualidade & Compliance": "Médio",
      "Velocidade de Decisão": "Médio",
    },
    benchmarkReference: "Empresas com benchmarks salariais ativos elevam taxa de aceite em 15-25% (Fonte: Mercer Global 2024).",
    suggestedUseCase: "Integração com fontes de mercado (Mercer, Robert Half) e faixa salarial sugerida por nível e localidade.",
  },
  {
    id: "op-8",
    title: "Apuração de horas integrada ao ponto",
    description: "Conferência manual entre ponto e folha consome dias e gera divergências.",
    tags: ["Automação", "Eficiência"],
    impact: "Médio", effort: "Baixo",
    estimatedGain: "-80% tempo de apuração",
    impactedProcesses: [
      { name: "RH > Folha de Pagamento > Cálculo de folha > Apuração de horas", level: "L4", action: "Integrar", complexity: "Baixa", improvement: "+80%" },
    ],
    why: "Integração de sistemas elimina 90% do trabalho manual.",
    potentialGains: ["Apuração automática", "Zero divergência por digitação"],
    suggestedDirection: "ETL ponto → folha com validações de exceção.",
    valueLeverImpacts: {
      "Eficiência Operacional": "Alto",
      "Experiência do Colaborador": "Médio",
      "Custo Operacional": "Médio",
      "Qualidade & Compliance": "Alto",
      "Velocidade de Decisão": "Médio",
    },
    benchmarkReference: "Integração ponto-folha reduz tempo de apuração em 75-85% (Fonte: APQC HR Benchmarks 2024).",
    suggestedUseCase: "ETL diário entre sistema de ponto e folha com regras de exceção e dashboard de divergências.",
  },
];

export const defaultLenses = [
  "Eficiência",
  "Custo",
  "Experiência",
  "Qualidade",
  "Risco / Compliance",
  "ESG",
];

export const quickContextSuggestions = ["Reduzir tempo", "Automatizar", "Reduzir custo"];

/* ============================================================================
 * Unified result mocks (shared by Simulate / Goal / Scope modes)
 * ========================================================================== */

export interface MockBenchmark {
  metric: string;
  marketP50: string;
  marketP75: string;
  currentEstimate: string;
  gap: "Abaixo da média" | "Na média" | "Acima da média";
  source: string;
}

export const mockBenchmarks: MockBenchmark[] = [
  {
    metric: "Tempo médio de ciclo (dias)",
    marketP50: "3,2 dias",
    marketP75: "1,8 dias",
    currentEstimate: "4,6 dias",
    gap: "Abaixo da média",
    source: "Fonte: APQC Process Survey 2024",
  },
  {
    metric: "Custo por transação",
    marketP50: "R$ 14,80",
    marketP75: "R$ 9,20",
    currentEstimate: "R$ 17,40",
    gap: "Abaixo da média",
    source: "Fonte: Gartner Cost Benchmarks 2024",
  },
  {
    metric: "Taxa de retrabalho (%)",
    marketP50: "8%",
    marketP75: "4%",
    currentEstimate: "9,2%",
    gap: "Na média",
    source: "Fonte: McKinsey Operations 2024",
  },
  {
    metric: "SLA cumprido (%)",
    marketP50: "88%",
    marketP75: "94%",
    currentEstimate: "82%",
    gap: "Abaixo da média",
    source: "Fonte: EY Process Survey 2024",
  },
  {
    metric: "Automação de tarefas (%)",
    marketP50: "42%",
    marketP75: "65%",
    currentEstimate: "28%",
    gap: "Abaixo da média",
    source: "Fonte: Deloitte Automation Index 2024",
  },
];

export interface ValueLeverDetail {
  level: ImpactLevel;
  rationale: string;
  kpis: { name: string; before: string; after: string }[];
}

export const mockValueLeverImpacts: Record<ValueLever, ValueLeverDetail> = {
  "Eficiência Operacional": {
    level: "Alto",
    rationale: "Volume manual elevado e baixa variabilidade nos passos críticos.",
    kpis: [
      { name: "Tempo de ciclo", before: "4,6 dias", after: "1,9 dias" },
      { name: "Throughput diário", before: "120", after: "210" },
      { name: "% retrabalho", before: "9,2%", after: "3,8%" },
    ],
  },
  "Experiência do Colaborador": {
    level: "Médio",
    rationale: "Reduz fricção em jornadas internas, mas requer acompanhamento de adoção.",
    kpis: [
      { name: "NPS interno", before: "32", after: "48" },
      { name: "Tempo de onboarding", before: "9 dias", after: "4 dias" },
      { name: "Taxa de turnover", before: "14%", after: "11%" },
    ],
  },
  "Custo Operacional": {
    level: "Alto",
    rationale: "Automação reduz headcount dedicado a tarefas repetitivas.",
    kpis: [
      { name: "Custo por transação", before: "R$ 17,40", after: "R$ 9,80" },
      { name: "Headcount dedicado", before: "12 FTE", after: "7 FTE" },
      { name: "Custo por processo", before: "R$ 38k/mês", after: "R$ 22k/mês" },
    ],
  },
  "Qualidade & Compliance": {
    level: "Alto",
    rationale: "Padronização e trilha de auditoria fortalecem controles internos.",
    kpis: [
      { name: "Taxa de erro", before: "6,1%", after: "2,3%" },
      { name: "SLA cumprido", before: "82%", after: "94%" },
      { name: "Auditabilidade", before: "Parcial", after: "Completa" },
    ],
  },
  "Velocidade de Decisão": {
    level: "Médio",
    rationale: "Visibilidade em tempo real reduz lead time de aprovações.",
    kpis: [
      { name: "Lead time de aprovação", before: "3,2 dias", after: "0,9 dias" },
      { name: "Tempo de fechamento", before: "8 dias", after: "5 dias" },
      { name: "Ciclo de reporte", before: "Mensal", after: "Semanal" },
    ],
  },
};

export interface MockRisk {
  title: string;
  severity: "Alto" | "Médio" | "Baixo";
  description: string;
  mitigation: string;
}

export const mockRisks: MockRisk[] = [
  {
    title: "Resistência à mudança",
    severity: "Médio",
    description: "Equipes acostumadas com fluxo manual podem resistir à nova ferramenta.",
    mitigation: "Engajar lideranças desde a fase piloto e estruturar plano de change management.",
  },
  {
    title: "Integração com sistemas legados",
    severity: "Alto",
    description: "ERP atual possui APIs limitadas, exigindo middleware ou customização.",
    mitigation: "Mapear contratos de integração antes do início e planejar camada intermediária.",
  },
  {
    title: "Capacidade do time de TI",
    severity: "Médio",
    description: "Demanda concorre com outras iniciativas estratégicas em backlog.",
    mitigation: "Reservar squad dedicada e alinhar priorização com PMO.",
  },
  {
    title: "Conflito de prazos com outras iniciativas",
    severity: "Baixo",
    description: "Implementação coincide com fechamento fiscal e revisão orçamentária.",
    mitigation: "Definir cutover fora dos picos e congelar mudanças nos períodos críticos.",
  },
];
