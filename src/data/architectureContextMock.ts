import { 
  ArchitectureData, ProcessContextData, ArchNodeL1, ArchNodeL2, ArchNodeL3, ArchNodeL4, 
  JourneyData, BusinessIndicator, ContextIndicator, ProcessRelation, DomainAlert,
  OperationalProcessDetail, ArchitecturePolicyLink, ComponentDimensioning, ComponentResponsible
} from '../types/architectureContextTypes';
import { INITIAL_BUSINESS_INDICATORS } from '@/stores/indicatorStore';
import { naturaL1 } from './naturaArchitectureMock';

// ── 0. INDICADORES REUSÁVEIS DE CONTEXTO E NEGÓCIO ──────────

const indSLAComercial = INITIAL_BUSINESS_INDICATORS[0];
const indTempoCiclo = INITIAL_BUSINESS_INDICATORS[1];
const indVolumeVendas = INITIAL_BUSINESS_INDICATORS[2];
const indConversaoPropostas = INITIAL_BUSINESS_INDICATORS[3];
const indSaving = INITIAL_BUSINESS_INDICATORS[4];
const indRiscoContencioso = INITIAL_BUSINESS_INDICATORS[5];

const indTempoAdmissao: ContextIndicator = {
  id: 'ind-ctx-admissao', type: 'context', name: 'Tempo de Admissão', objective: 'Reduzir o lead time de contratação',
  unit: 'Dias', currentValue: '12', target: '7', trend: 'down', status: 'atencao', valueSource: 'proprio', periodicity: 'Mensal',
  responsible: 'Gerente de RH', source: 'Workday', formula: 'Data Conclusão - Data Início',
  measurementHistory: [
    { date: '2026-04', value: '18' }, { date: '2026-05', value: '16' }, { date: '2026-06', value: '15' },
    { date: '2026-07', value: '14' }, { date: '2026-08', value: '14' }, { date: '2026-09', value: '12' }
  ]
};

const indSLAPagamento: BusinessIndicator = {
  id: 'ind-bus-sla-pag', type: 'business', name: 'SLA de Pagamento no Prazo', objective: 'Garantir pagamento aos fornecedores no vencimento',
  formula: '(Pagamentos no Prazo ÷ Total) × 100', alertBand: '< 95%', periodicity: 'Mensal', scope: 'Financeiro',
  aggregationRule: 'percentual_recalculado', unit: '%', currentValue: '92', target: '98', trend: 'up', status: 'atencao', valueSource: 'proprio',
  responsible: 'Tesouraria', source: 'ERP', category: 'Prazo/SLA', polarity: 'maior_melhor', domainId: 'l1-fin',
  measurementHistory: [
    { date: '2026-04', value: '88' }, { date: '2026-05', value: '89' }, { date: '2026-06', value: '90' },
    { date: '2026-07', value: '91' }, { date: '2026-08', value: '91' }, { date: '2026-09', value: '92' }
  ]
};

// ── 1. PROCESSOS DO DOMÍNIO PRINCIPAL: GESTÃO COMERCIAL (7 PROCESSOS) ──────────

// L2.1: Prospecção e Qualificação
const procInbound: ProcessContextData = {
  id: 'proc-com-inbound', name: 'Captação e Triagem de Leads Inbound', description: 'Recepção, qualificação inicial e atribuição de leads originados de canais digitais.',
  documentationStatus: 'approved', contextValidationStatus: 'validated', responsible: 'Analista de SDR Inbound', area: 'Vendas',
  systemsUsed: [
    { systemName: 'CRM Salesforce', operation: 'escrita', dataObjects: ['Lead', 'Histórico de Interação'], dependencies: [], isManual: false },
    { systemName: 'HubSpot Marketing', operation: 'integração', dataObjects: ['MQL Data'], dependencies: [], isManual: false }
  ],
  dataObjects: [
    { value: 'Registro de Lead', validation: { state: 'confirmado', origin: 'Mapeamento Comercial', confidence: 100, responsible: 'Mariana Vasconcelos', date: '2026-08-10', justification: 'Validado com equipe de SDR' } },
    { value: 'Score de Engajamento', validation: { state: 'confirmado', origin: 'HubSpot AI', confidence: 95, responsible: 'Mariana Vasconcelos', date: '2026-08-10', justification: 'Regra de corte aplicada' } }
  ],
  businessRules: [
    { value: 'SLA de primeiro contato em até 15 minutos úteis', validation: { state: 'confirmado', origin: 'Política Comercial', confidence: 100, responsible: 'Mariana Vasconcelos', date: '2026-08-10', justification: 'Manual de Vendas 2026' } }
  ],
  regulations: [
    { value: 'LGPD - Consentimento de Comunicação Comercial', validation: { state: 'confirmado', origin: 'Jurídico', confidence: 100, responsible: 'Compliance', date: '2026-08-10', justification: 'Opt-in validado' } }
  ],
  painPoints: [], evidences: [{ value: 'Relatório mensal de conversão Inbound', validation: { state: 'confirmado', origin: 'CRM', confidence: 100, responsible: 'Mariana Vasconcelos', date: '2026-08-10', justification: 'Extraído do Salesforce' } }], openQuestions: [],
  businessIndicators: [indSLAComercial], contextIndicators: [], relations: []
};

const procOutbound: ProcessContextData = {
  id: 'proc-com-outbound', name: 'Prospecção Ativa Outbound B2B', description: 'Pesquisa de contas estratégicas (ICP), enriquecimento de dados e cadência de contato ativo.',
  documentationStatus: 'approved', contextValidationStatus: 'validated', responsible: 'Especialista em BDR', area: 'Vendas',
  systemsUsed: [
    { systemName: 'CRM Salesforce', operation: 'escrita', dataObjects: ['Conta Alvo', 'Oportunidade'], dependencies: [], isManual: false },
    { systemName: 'Apollo.io / LinkedIn Sales Nav', operation: 'consulta', dataObjects: ['Dados de Decisores'], dependencies: [], isManual: false }
  ],
  dataObjects: [
    { value: 'Lista de Contas ICP', validation: { state: 'confirmado', origin: 'Inteligência de Mercado', confidence: 100, responsible: 'Mariana Vasconcelos', date: '2026-08-12', justification: 'ICP definido anualmente' } }
  ],
  businessRules: [
    { value: 'Máximo 5 tentativas de contato por canal', validation: { state: 'confirmado', origin: 'Playbook Outbound', confidence: 95, responsible: 'Lucas Nogueira', date: '2026-08-12', justification: 'Evitar marcação de spam' } }
  ],
  regulations: [], painPoints: [], evidences: [], openQuestions: [],
  businessIndicators: [indTempoCiclo], contextIndicators: [], relations: []
};

const procReuniao: ProcessContextData = {
  id: 'proc-com-reuniao', name: 'Qualificação Diagnóstica e Agendamento', description: 'Realização de diagnóstico de dores e agendamento de apresentação técnica com Account Executive.',
  documentationStatus: 'approved', contextValidationStatus: 'validated', responsible: 'SDR Pleno', area: 'Vendas',
  systemsUsed: [
    { systemName: 'CRM Salesforce', operation: 'escrita', dataObjects: ['Oportunidade', 'BANT Data'], dependencies: [], isManual: false },
    { systemName: 'Google Calendar', operation: 'leitura', dataObjects: ['Agenda Executiva'], dependencies: [], isManual: false }
  ],
  dataObjects: [
    { value: 'Resumo BANT (Budget, Authority, Need, Timing)', validation: { state: 'confirmado', origin: 'SDR', confidence: 100, responsible: 'Lucas Nogueira', date: '2026-08-15', justification: 'Pré-requisito para AE' } }
  ],
  businessRules: [
    { value: 'Apenas oportunidades com Need e Authority confirmados geram reunião', validation: { state: 'confirmado', origin: 'Regra de Negócio', confidence: 100, responsible: 'Mariana Vasconcelos', date: '2026-08-15', justification: 'Critério de passagem de bastão' } }
  ],
  regulations: [], painPoints: [], evidences: [], openQuestions: [],
  businessIndicators: [indConversaoPropostas], contextIndicators: [], relations: []
};

export const procQualificarB2B: ProcessContextData = {
  id: 'proc-qualificar-b2b',
  name: 'Qualificar Oportunidade B2B',
  description: 'Processo executável: avaliação de aderência a critérios BANT, diagnóstico de contexto comercial e decisão sobre avanço.',
  documentationStatus: 'approved',
  contextValidationStatus: 'validated',
  responsible: 'Coordenação de SDR',
  area: 'Diretoria Comercial',
  systemsUsed: [
    { systemName: 'CRM Salesforce', operation: 'escrita', dataObjects: ['Lead', 'Oportunidade', 'Motivo de Desqualificação'], dependencies: [], isManual: false },
    { systemName: 'HubSpot Marketing', operation: 'leitura', dataObjects: ['Engajamento', 'MQL Data'], dependencies: [], isManual: false },
    { systemName: 'Apollo.io', operation: 'consulta', dataObjects: ['Enriquecimento de Decisores'], dependencies: [], isManual: false },
    { systemName: 'Google Calendar', operation: 'escrita', dataObjects: ['Agenda Executiva'], dependencies: [], isManual: false }
  ],
  dataObjects: [
    { value: 'Critérios BANT', validation: { state: 'confirmado', origin: 'Comercial', confidence: 100, responsible: 'Coordenação de SDR', date: '2026-09-01', justification: 'Playbook Oficial' } }
  ],
  businessRules: [
    { value: 'SLA de primeiro contato de no máximo 4 horas', validation: { state: 'confirmado', origin: 'Diretoria Comercial', confidence: 100, responsible: 'Mariana Vasconcelos', date: '2026-09-01', justification: 'Meta Estratégica' } },
    { value: 'Motivo obrigatório de desqualificação no CRM', validation: { state: 'confirmado', origin: 'Governança Comercial', confidence: 100, responsible: 'Coordenação de SDR', date: '2026-09-01', justification: 'Exigência de auditoria' } }
  ],
  regulations: [
    { value: 'LGPD - Tratamento e Opt-in de Dados Comerciais', validation: { state: 'confirmado', origin: 'Jurídico & DPO', confidence: 100, responsible: 'Compliance', date: '2026-09-01', justification: 'Vigência 2026' } },
    { value: 'Política Comercial Corporativa Rev. 2026', validation: { state: 'confirmado', origin: 'Diretoria', confidence: 100, responsible: 'Mariana Vasconcelos', date: '2026-09-01', justification: 'Aprovada em comitê' } }
  ],
  painPoints: [
    { value: 'Motivos de perda preenchidos de forma inconsistente', validation: { state: 'observado_evidencia', origin: 'Auditoria Interna', confidence: 90, responsible: 'Mariana Vasconcelos', date: '2026-09-01', justification: 'Análise de CRM' } },
    { value: 'Informações de contexto não chegam ao Executivo de Contas', validation: { state: 'declarado_usuario', origin: 'AE', confidence: 85, responsible: 'Lucas Nogueira', date: '2026-09-01', justification: 'Feedback de passagem de bastão' } }
  ],
  evidences: [
    { value: 'Gravação de interação e histórico de alterações no CRM', validation: { state: 'confirmado', origin: 'CRM', confidence: 95, responsible: 'Coordenação de SDR', date: '2026-09-01', justification: 'Logs auditados' } }
  ],
  openQuestions: [
    { value: 'Critério de priorização para contas Enterprise em horários fora do expediente comercial', validation: { state: 'declarado_usuario', origin: 'SDR', confidence: 80, responsible: 'Coordenação de SDR', date: '2026-09-01', justification: 'Em discussão com Diretoria' } }
  ],
  businessIndicators: [indSLAComercial, indConversaoPropostas],
  contextIndicators: [],
  relations: [
    {
      id: 'rel-qualif-fechamento',
      sourceProcessId: 'proc-qualificar-b2b',
      targetProcessId: 'proc-com-proposta',
      type: 'transfere_responsabilidade_para',
      description: 'Handoff da oportunidade qualificada para o Executivo de Contas',
      validationStatus: 'validated',
      confidence: 95
    }
  ]
};

export const procRequalificarInativo: ProcessContextData = {
  id: 'proc-requalificar-inativo',
  name: 'Requalificar Oportunidade Inativa',
  description: 'Reengajamento de contas dormentes após período de maturação ou novo gatilho de mercado.',
  documentationStatus: 'approved',
  contextValidationStatus: 'validated',
  responsible: 'SDR Especialista',
  area: 'Diretoria Comercial',
  systemsUsed: [
    { systemName: 'CRM Salesforce', operation: 'escrita', dataObjects: ['Histórico do Lead'], dependencies: [], isManual: false },
    { systemName: 'Apollo.io', operation: 'consulta', dataObjects: ['Mudança de Cargo / Funding'], dependencies: [], isManual: false }
  ],
  dataObjects: [],
  businessRules: [],
  regulations: [],
  painPoints: [],
  evidences: [],
  openQuestions: [],
  businessIndicators: [],
  contextIndicators: [],
  relations: []
};

// L2.2: Negociação e Fechamento
const procPreco: ProcessContextData = {
  id: 'proc-com-preco', name: 'Precificação e Análise de Margem Comercial', description: 'Cálculo de margem de contribuição, desconto comercial e aprovação de tabela de preços.',
  documentationStatus: 'approved', contextValidationStatus: 'validating', responsible: 'Account Executive Sênior', area: 'Vendas',
  systemsUsed: [
    { systemName: 'Planilhas Comerciais (Excel)', operation: 'cálculo', dataObjects: ['Simulador de Margem'], dependencies: [], isManual: true },
    { systemName: 'ERP Financeiro SAP', operation: 'consulta', dataObjects: ['Custo Padrão'], dependencies: [], isManual: false }
  ],
  dataObjects: [
    { value: 'Simulação de Desconto', validation: { state: 'declarado_usuario', origin: 'Vendas', confidence: 75, responsible: 'Lucas Nogueira', date: '2026-08-18', justification: 'Feito em planilha manual' } }
  ],
  businessRules: [
    { value: 'Descontos acima de 15% requerem alçada da Diretoria Comercial', validation: { state: 'confirmado', origin: 'Alçadas Comerciais', confidence: 100, responsible: 'Mariana Vasconcelos', date: '2026-08-18', justification: 'Política de Alçadas' } }
  ],
  regulations: [
    { value: 'Política Comercial Corporativa', validation: { state: 'confirmado', origin: 'Diretoria', confidence: 100, responsible: 'Mariana Vasconcelos', date: '2026-08-18', justification: 'Versão 2026' } }
  ],
  painPoints: [
    { value: 'Dependência de planilhas locais para cálculo de preços complexos', validation: { state: 'observado_evidencia', origin: 'Auditoria de Processos', confidence: 90, responsible: 'Mariana Vasconcelos', date: '2026-08-18', justification: 'Risco operacional identificado' } }
  ],
  evidences: [], openQuestions: [{ value: 'Quando a precificação será migrada para módulo CPQ integrado no CRM?', validation: { state: 'declarado_usuario', origin: 'TI', confidence: 80, responsible: 'Renata Silveira', date: '2026-08-18', justification: 'Projeto pendente de orçamento' } }],
  businessIndicators: [indVolumeVendas], contextIndicators: [], relations: []
};

const procProposta: ProcessContextData = {
  id: 'proc-com-proposta', name: 'Elaboração e Apresentação de Proposta Comercial', description: 'Geração formal da proposta com escopo, cronograma, condições de pagamento e validação executiva.',
  documentationStatus: 'approved', contextValidationStatus: 'validated', responsible: 'Account Executive', area: 'Vendas',
  systemsUsed: [
    { systemName: 'CRM Salesforce', operation: 'escrita', dataObjects: ['Proposta Comercial', 'Valores'], dependencies: [], isManual: false }
  ],
  dataObjects: [
    { value: 'Proposta Comercial Formatada', validation: { state: 'confirmado', origin: 'CRM', confidence: 100, responsible: 'Lucas Nogueira', date: '2026-08-20', justification: 'Template padrão corporativo' } }
  ],
  businessRules: [
    { value: 'Proposta tem validade legal de 15 dias corridos', validation: { state: 'confirmado', origin: 'Termos e Condições', confidence: 100, responsible: 'Mariana Vasconcelos', date: '2026-08-20', justification: 'Termo padrão' } }
  ],
  regulations: [], painPoints: [], evidences: [], openQuestions: [],
  businessIndicators: [indConversaoPropostas, indSLAComercial], contextIndicators: [], relations: []
};

const procContrato: ProcessContextData = {
  id: 'proc-com-contrato', name: 'Formalização e Assinatura Eletrônica de Contrato', description: 'Envio da minuta contratual, validação de procurações e coleta de assinaturas digitais com validade jurídica.',
  documentationStatus: 'approved', contextValidationStatus: 'validated', responsible: 'Especialista em Operações de Vendas (RevOps)', area: 'Vendas',
  systemsUsed: [
    { systemName: 'DocuSign', operation: 'integração', dataObjects: ['Envelope Contratual', 'Assinatura Digital'], dependencies: [], isManual: false },
    { systemName: 'CRM Salesforce', operation: 'escrita', dataObjects: ['Status de Fechamento (Closed-Won)'], dependencies: [], isManual: false }
  ],
  dataObjects: [
    { value: 'Contrato Assinado Digitalmente', validation: { state: 'confirmado', origin: 'DocuSign Certificate', confidence: 100, responsible: 'Mariana Vasconcelos', date: '2026-08-25', justification: 'Certificado ICP-Brasil' } }
  ],
  businessRules: [
    { value: 'Faturamento só pode ser disparado após assinatura completa do contrato', validation: { state: 'confirmado', origin: 'Governança Financeira', confidence: 100, responsible: 'CFO', date: '2026-08-25', justification: 'Mitigação de risco financeiro' } }
  ],
  regulations: [
    { value: 'Política de Assinaturas Eletrônicas e Procurações', validation: { state: 'confirmado', origin: 'Jurídico', confidence: 100, responsible: 'Jurídico', date: '2026-08-25', justification: 'Conformidade legal' } }
  ],
  painPoints: [], evidences: [{ value: 'Certificado de conclusão de assinatura DocuSign', validation: { state: 'confirmado', origin: 'DocuSign', confidence: 100, responsible: 'RevOps', date: '2026-08-25', justification: 'Auditoria fiscal' } }], openQuestions: [],
  businessIndicators: [indVolumeVendas, indTempoCiclo], contextIndicators: [], relations: []
};

// L2.3: Pós-Venda e Sucesso do Cliente
const procKickoff: ProcessContextData = {
  id: 'proc-com-kickoff', name: 'Kickoff e Passagem de Bastão para Customer Success', description: 'Reunião de alinhamento entre equipe comercial, pós-venda e cliente para início da implantação.',
  documentationStatus: 'in_progress', contextValidationStatus: 'unvalidated', responsible: 'Customer Success Manager', area: 'Pós-Venda',
  systemsUsed: [
    { systemName: 'CRM Salesforce', operation: 'leitura', dataObjects: ['Escopo Contratado'], dependencies: [], isManual: false },
    { systemName: 'Slack', operation: 'escrita', dataObjects: ['Canal Compartilhado com Cliente'], dependencies: [], isManual: false }
  ],
  dataObjects: [
    { value: 'Ata de Kickoff', validation: { state: 'declarado_usuario', origin: 'CS', confidence: 70, responsible: 'CS Lead', date: '2026-08-28', justification: 'Registro em elaboração' } }
  ],
  businessRules: [
    { value: 'Kickoff deve ser realizado em até 5 dias úteis após assinatura', validation: { state: 'sugerido_ia', origin: 'Boas Práticas de CS', confidence: 85, responsible: '-', date: '2026-08-28', justification: 'SLA de Onboarding' } }
  ],
  regulations: [], painPoints: [
    { value: 'Falta de documentação padronizada do handover entre Vendas e Implantação', validation: { state: 'confirmado', origin: 'Retrospectiva', confidence: 95, responsible: 'Mariana Vasconcelos', date: '2026-08-28', justification: 'Gargalo recorrente apontado pelos clientes' } }
  ],
  evidences: [], openQuestions: [
    { value: 'Qual ferramenta definitiva de Onboarding será adotada para substituir registros informais?', validation: { state: 'declarado_usuario', origin: 'CS', confidence: 80, responsible: 'Lucas Nogueira', date: '2026-08-28', justification: 'Avaliação de software' } }
  ],
  businessIndicators: [], contextIndicators: [], relations: []
};

// ── 2. PROCESSOS DO CENÁRIO PARCIAL: SUPRIMENTOS (4 PROCESSOS) ──────────

const procSup1: ProcessContextData = {
  id: 'proc-sup-1', name: 'Cotação de Materiais Estratégicos', description: 'Cotação e equalização técnica de fornecedores de insumos.',
  documentationStatus: 'approved', contextValidationStatus: 'validated', responsible: 'Comprador Pleno', area: 'Suprimentos',
  systemsUsed: [{ systemName: 'SAP Ariba', operation: 'escrita', dataObjects: ['Mapa de Cotação'], dependencies: [], isManual: false }],
  dataObjects: [{ value: 'Quadro Comparativo', validation: { state: 'confirmado', origin: 'Suprimentos', confidence: 100, responsible: 'Carlos Mendes', date: '2026-08-01', justification: 'Padrão' } }],
  businessRules: [{ value: 'Mínimo de 3 cotações válidas', validation: { state: 'confirmado', origin: 'Política de Compras', confidence: 100, responsible: 'Carlos Mendes', date: '2026-08-01', justification: 'Auditoria' } }],
  regulations: [], painPoints: [], evidences: [], openQuestions: [],
  businessIndicators: [indSaving], contextIndicators: [], relations: []
};

const procSup2: ProcessContextData = {
  id: 'proc-sup-2', name: 'Negociação e Formalização de Pedido de Compra', description: 'Emissão da Ordem de Compra (PO) e envio ao fornecedor.',
  documentationStatus: 'approved', contextValidationStatus: 'validated', responsible: 'Comprador Sênior', area: 'Suprimentos',
  systemsUsed: [{ systemName: 'SAP Ariba', operation: 'escrita', dataObjects: ['Pedido de Compra'], dependencies: [], isManual: false }],
  dataObjects: [{ value: 'Purchase Order (PO)', validation: { state: 'confirmado', origin: 'SAP', confidence: 100, responsible: 'Carlos Mendes', date: '2026-08-05', justification: 'Oficial' } }],
  businessRules: [], regulations: [], painPoints: [], evidences: [], openQuestions: [],
  businessIndicators: [indSaving], contextIndicators: [], relations: []
};

const procSup3: ProcessContextData = {
  id: 'proc-sup-3', name: 'Qualificação e Homologação de Fornecedores', description: 'Conferência de certidões, balanços e conformidade jurídica.',
  documentationStatus: 'in_progress', contextValidationStatus: 'validating', responsible: 'Analista de Cadastro', area: 'Cadastro',
  systemsUsed: [
    { systemName: 'Portal de Fornecedores', operation: 'escrita', dataObjects: ['Certidões Negativas'], dependencies: [], isManual: false },
    { systemName: 'Serasa Experian', operation: 'consulta', dataObjects: ['Score de Crédito'], dependencies: [], isManual: false }
  ],
  dataObjects: [{ value: 'Dossiê Cadastral', validation: { state: 'em_validacao', origin: 'Cadastro', confidence: 80, responsible: 'Carlos Mendes', date: '2026-08-10', justification: 'Em revisão' } }],
  businessRules: [], regulations: [], painPoints: [{ value: 'Demora na entrega de certidões pelos fornecedores', validation: { state: 'observado_evidencia', origin: 'Mapeamento', confidence: 85, responsible: 'Carlos Mendes', date: '2026-08-10', justification: 'Lead time elevado' } }], evidences: [], openQuestions: [],
  businessIndicators: [], contextIndicators: [], relations: []
};

const procSup4: ProcessContextData = {
  id: 'proc-sup-4', name: 'Auditoria de Desempenho de Fornecedores (SLA)', description: 'Avaliação trimestral de pontualidade de entrega e conformidade de qualidade.',
  documentationStatus: 'pending', contextValidationStatus: 'unvalidated', responsible: 'Analista de Qualidade', area: 'Qualidade',
  systemsUsed: [{ systemName: 'SAP Ariba', operation: 'leitura', dataObjects: ['Histórico de Entregas'], dependencies: [], isManual: false }],
  dataObjects: [], businessRules: [], regulations: [], painPoints: [], evidences: [], openQuestions: [],
  businessIndicators: [], contextIndicators: [], relations: []
};

// ── 3. PROCESSOS DO SUPORTE: JURÍDICO (2 PROCESSOS) ──────────

const procJur1: ProcessContextData = {
  id: 'proc-jur-1', name: 'Defesa e Acompanhamento de Processos Trabalhistas', description: 'Elaboração de contestação, cálculo de contingência e audiências.',
  documentationStatus: 'approved', contextValidationStatus: 'validated', responsible: 'Advogado Trabalhista Pleno', area: 'Jurídico',
  systemsUsed: [{ systemName: 'Projuris', operation: 'escrita', dataObjects: ['Contestação', 'Pauta de Audiência'], dependencies: [], isManual: false }],
  dataObjects: [{ value: 'Peça de Defesa', validation: { state: 'confirmado', origin: 'Projuris', confidence: 100, responsible: 'Jurídico', date: '2026-08-01', justification: 'Padrão' } }],
  businessRules: [{ value: 'Prazo fatal judicial cumprido com antecedência mínima de 48h', validation: { state: 'confirmado', origin: 'Manual Jurídico', confidence: 100, responsible: 'Jurídico', date: '2026-08-01', justification: 'Governança' } }],
  regulations: [{ value: 'Consolidação das Leis do Trabalho (CLT)', validation: { state: 'confirmado', origin: 'Legislação', confidence: 100, responsible: 'Jurídico', date: '2026-08-01', justification: 'Federal' } }], painPoints: [], evidences: [], openQuestions: [],
  businessIndicators: [indRiscoContencioso], contextIndicators: [], relations: []
};

const procJur2: ProcessContextData = {
  id: 'proc-jur-2', name: 'Mediação e Celebração de Acordos Judiciais', description: 'Negociação com sindicatos ou partes adversas para mitigação de custos processuais.',
  documentationStatus: 'approved', contextValidationStatus: 'validated', responsible: 'Advogado Sênior', area: 'Jurídico',
  systemsUsed: [{ systemName: 'Projuris', operation: 'escrita', dataObjects: ['Termo de Acordo'], dependencies: [], isManual: false }],
  dataObjects: [{ value: 'Minuta de Transação Judicial', validation: { state: 'confirmado', origin: 'Projuris', confidence: 100, responsible: 'Jurídico', date: '2026-08-05', justification: 'Formal' } }],
  businessRules: [], regulations: [], painPoints: [], evidences: [], openQuestions: [],
  businessIndicators: [indRiscoContencioso], contextIndicators: [], relations: []
};

// ── 4. PROCESSOS DO SUPORTE: RH E FINANCEIRO ──────────

const procRH1: ProcessContextData = {
  id: 'proc-rh-1', name: 'Recrutamento e Seleção de Talentos', description: 'Abertura de vagas, triagem de currículos e entrevistas comportamentais.',
  documentationStatus: 'approved', contextValidationStatus: 'validated', responsible: 'Analista de Recrutamento', area: 'RH',
  systemsUsed: [{ systemName: 'Gupy', operation: 'escrita', dataObjects: ['Candidato', 'Ranking de Fit'], dependencies: [], isManual: false }],
  dataObjects: [{ value: 'Ficha de Entrevista', validation: { state: 'confirmado', origin: 'RH', confidence: 100, responsible: 'RH', date: '2026-08-01', justification: 'Padrão' } }],
  businessRules: [], regulations: [], painPoints: [], evidences: [], openQuestions: [],
  businessIndicators: [], contextIndicators: [indTempoAdmissao], relations: []
};

const procRH2: ProcessContextData = {
  id: 'proc-rh-2', name: 'Admissão e Onboarding de Colaboradores', description: 'Coleta de documentos admissionais, exame admissional e integração corporativa.',
  documentationStatus: 'approved', contextValidationStatus: 'validated', responsible: 'Analista de DP', area: 'RH',
  systemsUsed: [
    { systemName: 'Workday', operation: 'escrita', dataObjects: ['Cadastro de Funcionário'], dependencies: [], isManual: false },
    { systemName: 'ServiceNow', operation: 'integração', dataObjects: ['Solicitação de Acessos de TI'], dependencies: [], isManual: false }
  ],
  dataObjects: [{ value: 'Ficha de Registro e Termos', validation: { state: 'confirmado', origin: 'DP', confidence: 100, responsible: 'RH', date: '2026-08-05', justification: 'eSocial' } }],
  businessRules: [], regulations: [], painPoints: [], evidences: [], openQuestions: [],
  businessIndicators: [], contextIndicators: [indTempoAdmissao], relations: []
};

const procFin1: ProcessContextData = {
  id: 'proc-fin-1', name: 'Liquidação e Pagamento a Fornecedores', description: 'Conciliação de nota fiscal com pedido, agendamento de remessa bancária e baixa contábil.',
  documentationStatus: 'approved', contextValidationStatus: 'validated', responsible: 'Analista Financeiro', area: 'Financeiro',
  systemsUsed: [
    { systemName: 'ERP Financeiro SAP', operation: 'escrita', dataObjects: ['Título a Pagar', 'Comprovante Bancário'], dependencies: [], isManual: false }
  ],
  dataObjects: [{ value: 'Ordem de Pagamento', validation: { state: 'confirmado', origin: 'ERP', confidence: 100, responsible: 'Financeiro', date: '2026-08-01', justification: 'Automático' } }],
  businessRules: [{ value: 'Pagamentos acima de R$ 50k requerem dupla assinatura bancária', validation: { state: 'confirmado', origin: 'Tesouraria', confidence: 100, responsible: 'Financeiro', date: '2026-08-01', justification: 'Segurança' } }],
  regulations: [], painPoints: [], evidences: [], openQuestions: [],
  businessIndicators: [indSLAPagamento], contextIndicators: [], relations: []
};


// ── 5. ESTRUTURA ARQUITETURAL HIERÁRQUICA (L1 → L2 → L3 → L4) ──────────

export const mockArchitectureData: ArchitectureData = {
  domainsL1: [
    // ══════════════════════════════════════════════════════════
    // CENÁRIO 1: DOMÍNIO PRINCIPAL COMPLETO — GESTÃO COMERCIAL
    // ══════════════════════════════════════════════════════════
    {
      id: 'l1-gestao-comercial',
      name: 'Gestão Comercial',
      domain: 'Primário',
      category: 'PRIMARY',
      description: 'Orquestra a geração de receita, da prospecção ao sucesso do cliente.',
      objective: 'Gerar receita sustentável, conectando demanda, conversão e retenção de clientes corporativos.',
      valueProposition: 'Uma jornada comercial previsível, consultiva e integrada, com experiência consistente para clientes e áreas internas.',
      scopeBoundary: 'Da geração e qualificação de oportunidades até a ativação e evolução da base de clientes.',
      stakeholders: 'Entradas: demanda de mercado, dados de ICP, leads, estratégia comercial. Saídas: oportunidades qualificadas, contratos, receita, cliente ativado e insights de mercado.',
      responsible: 'Mariana Vasconcelos',
      responsibleDetail: {
        name: 'Mariana Vasconcelos',
        role: 'Process Owner',
        title: 'Diretora Comercial'
      },
      businessUnit: 'Divisão Corporativa',
      dimensioning: {
        allocatedFte: 42,
        unit: 'FTs',
        referenceDate: '14 set 2026',
        validationStatus: 'validado'
      },
      lastUpdate: '14 de Setembro de 2026',
      criticality: 'Crítica',
      mainKpi: 'SLA Comercial: 92% (Meta: 95%)',
      documentationStatus: 'approved',
      contextValidationPercent: 75,
      policies: [
        {
          id: 'pol-1',
          name: 'Política Comercial Corporativa',
          type: 'Política Interna',
          version: 'Rev. 2026',
          status: 'vigente',
          complianceStatus: 'conforme',
          reviewDueDate: 'Dez/2026',
          responsible: 'Compliance Comercial'
        },
        {
          id: 'pol-2',
          name: 'LGPD — Governança de Dados Comerciais',
          type: 'Norma Regulatória',
          version: 'v2.1',
          status: 'vigente',
          complianceStatus: 'conforme',
          reviewDueDate: 'Nov/2026',
          responsible: 'DPO / Jurídico'
        }
      ],
      explicitRelations: [
        {
          id: 'rel-l1-1',
          sourceProcessId: 'l2-prospeccao',
          targetProcessId: 'l2-negociacao',
          type: 'fornece_entrada_para',
          description: 'Prospecção fornece oportunidade qualificada para Negociação',
          validationStatus: 'validated',
          confidence: 95
        },
        {
          id: 'rel-l1-2',
          sourceProcessId: 'l2-negociacao',
          targetProcessId: 'l2-pos-venda',
          type: 'fornece_entrada_para',
          description: 'Negociação fornece contrato e contexto para Pós-Venda',
          validationStatus: 'validated',
          confidence: 90
        }
      ],
      childrenL2: [
        {
          id: 'l2-prospeccao',
          name: 'Prospecção e Qualificação',
          description: 'Geração de demanda, prospecção ativa e qualificação de oportunidades comerciais.',
          objective: 'Transformar sinais de mercado em oportunidades qualificadas, priorizadas e prontas para abordagem comercial.',
          valueProposition: 'Entregar oportunidades com aderência ao perfil ideal, contexto suficiente e velocidade de encaminhamento.',
          startCondition: 'Campanha, sinal de intenção, indicação, evento ou lista de contas priorizadas disponível para tratamento.',
          endCondition: 'Oportunidade qualificada encaminhada, descartada com motivo ou direcionada para nutrição.',
          inputs: 'ICP, listas de contas, dados de enriquecimento, respostas de campanhas.',
          outputs: 'Lead qualificado, reunião agendada, registro atualizado no CRM.',
          stakeholders: 'SDR, Executivo de Contas e Marketing.',
          responsible: 'Gerência de Novos Negócios',
          responsibleDetail: {
            name: 'Gerência de Novos Negócios',
            role: 'Dono do Macroprocesso',
            title: 'Gerente Comercial'
          },
          businessUnit: 'Diretoria Comercial',
          dimensioning: {
            allocatedFte: 18,
            unit: 'FTs',
            referenceDate: '14 set 2026',
            validationStatus: 'validado'
          },
          lastUpdate: '14 de Setembro de 2026',
          documentationStatus: 'approved',
          contextValidationPercent: 65,
          policies: [
            {
              id: 'pol-l2-1',
              name: 'Política Comercial Corporativa',
              type: 'Política Interna',
              version: 'Rev. 2026',
              status: 'vigente',
              complianceStatus: 'conforme'
            },
            {
              id: 'pol-l2-2',
              name: 'LGPD — Governança de Dados Comerciais',
              type: 'Norma Regulatória',
              version: 'v2.1',
              status: 'vigente',
              complianceStatus: 'conforme'
            }
          ],
          explicitRelations: [
            {
              id: 'rel-l2-1',
              sourceProcessId: 'l3-geracao-leads',
              targetProcessId: 'l3-qualificacao-sdr',
              type: 'fornece_entrada_para',
              description: 'Geração e Enriquecimento fornece entrada para Qualificação',
              validationStatus: 'validated',
              confidence: 92
            },
            {
              id: 'rel-l2-2',
              sourceProcessId: 'l3-qualificacao-sdr',
              targetProcessId: 'l3-nutricao',
              type: 'e_alternativa_a',
              description: 'Nutrição e Reativação é uma rota alternativa, não uma etapa obrigatória',
              validationStatus: 'validated',
              confidence: 85
            }
          ],
          childrenL3: [
            {
              id: 'l3-geracao-leads',
              name: 'Geração e Enriquecimento de Leads',
              description: 'Produz lead com dados mínimos para priorização e inteligência de prospecção.',
              objective: 'Mapear e enriquecer contas com fit no Perfil de Cliente Ideal (ICP).',
              valueProposition: 'Garantir dados qualificados e enriquecidos antes do contato comercial.',
              responsible: 'Inteligência de Mercado',
              businessUnit: 'Diretoria Comercial',
              dimensioning: {
                allocatedFte: 6,
                unit: 'FTs',
                referenceDate: '14 set 2026',
                validationStatus: 'validado'
              },
              childrenL4: [
                { id: 'l4-inbound', name: 'Captação e Triagem Inbound', processes: [procInbound] },
                { id: 'l4-outbound', name: 'Prospecção Ativa Outbound', processes: [procOutbound] }
              ]
            },
            {
              id: 'l3-qualificacao-sdr',
              name: 'Qualificação e Agendamento',
              description: 'Avalia aderência, contexto e prontidão do lead para definir o encaminhamento comercial mais adequado.',
              objective: 'Confirmar aderência ao perfil, necessidade, urgência e autoridade para avançar a oportunidade de modo confiável.',
              valueProposition: 'Dar ao time comercial uma oportunidade contextualizada, com próximo passo claro e dados consistentes.',
              startCondition: 'Lead priorizado disponível para contato.',
              endCondition: 'Reunião agendada, oportunidade desqualificada ou enviada à nutrição.',
              scopeBoundary: 'Da primeira tentativa de contato até o agendamento de apresentação técnica.',
              stakeholders: 'SDR, Marketing, Executivos de Contas (AE).',
              responsible: 'Coordenação de SDR',
              responsibleDetail: {
                name: 'Coordenação de SDR',
                role: 'Responsável Operacional',
                title: 'Coordenador Comercial de Vendas'
              },
              businessUnit: 'Diretoria Comercial',
              dimensioning: {
                allocatedFte: 12,
                unit: 'FTs',
                referenceDate: '14 set 2026',
                validationStatus: 'validado'
              },
              lastUpdate: '14 de Setembro de 2026',
              documentationStatus: 'approved',
              contextValidationPercent: 70,
              policies: [
                {
                  id: 'pol-l3-1',
                  name: 'Política Comercial Corporativa',
                  type: 'Política Interna',
                  version: 'Rev. 2026',
                  status: 'vigente',
                  complianceStatus: 'conforme'
                },
                {
                  id: 'pol-l3-2',
                  name: 'Política de Privacidade e LGPD',
                  type: 'Norma Regulatória',
                  version: 'v2.1',
                  status: 'vigente',
                  complianceStatus: 'conforme'
                }
              ],
              explicitRelations: [
                {
                  id: 'rel-l3-1',
                  sourceProcessId: 'l4-qualificacao-op',
                  targetProcessId: 'l4-reunioes',
                  type: 'fornece_entrada_para',
                  description: 'Qualificação de oportunidade fornece agenda confirmada para agendamento',
                  validationStatus: 'validated',
                  confidence: 90
                }
              ],
              childrenL4: [
                {
                  id: 'l4-qualificacao-op',
                  name: 'Qualificação de Oportunidade',
                  description: 'Unidade arquitetural que agrupa os processos operacionais de avaliação e decisão sobre avanço comercial.',
                  objective: 'Assegurar que somente oportunidades com potencial comprovado avancem para o time de vendas.',
                  valueProposition: 'Uma decisão de encaminhamento rápida, rastreável e baseada em critérios consistentes.',
                  scopeBoundary: 'Recebe leads priorizados; interage com SDR, Marketing e Executivos de Conta; entrega encaminhamento qualificado.',
                  responsible: 'Liderança de SDR',
                  responsibleDetail: {
                    name: 'Liderança de SDR',
                    role: 'Líder de Equipe',
                    title: 'Team Leader SDR'
                  },
                  businessUnit: 'Diretoria Comercial',
                  dimensioning: {
                    allocatedFte: 8,
                    unit: 'FTs',
                    referenceDate: '14 set 2026',
                    validationStatus: 'validado'
                  },
                  documentationStatus: 'approved',
                  contextValidationPercent: 80,
                  policies: [
                    {
                      id: 'pol-l4-1',
                      name: 'Política Comercial Corporativa',
                      type: 'Política Interna',
                      version: 'Rev. 2026',
                      status: 'vigente',
                      complianceStatus: 'conforme'
                    },
                    {
                      id: 'pol-l4-2',
                      name: 'LGPD — Tratamento de Dados Comerciais',
                      type: 'Norma Regulatória',
                      version: 'v2.1',
                      status: 'vigente',
                      complianceStatus: 'conforme'
                    }
                  ],
                  processes: [procQualificarB2B, procRequalificarInativo]
                },
                {
                  id: 'l4-reunioes',
                  name: 'Agendamento de Demonstrações',
                  description: 'Recorte para coordenação, confirmação e handoff de agenda.',
                  objective: 'Maximizar o show-rate de reuniões comerciais agendadas com os executivos.',
                  valueProposition: 'Garantir confirmação e alinhamento prévio antes da demonstração.',
                  responsible: 'Coordenação de SDR',
                  businessUnit: 'Diretoria Comercial',
                  dimensioning: {
                    allocatedFte: 4,
                    unit: 'FTs',
                    referenceDate: '14 set 2026',
                    validationStatus: 'validado'
                  },
                  processes: [procReuniao]
                }
              ]
            }
          ]
        },
        {
          id: 'l2-negociacao',
          name: 'Negociação e Fechamento',
          childrenL3: [
            {
              id: 'l3-proposta',
              name: 'Elaboração de Propostas e Precificação',
              childrenL4: [
                { id: 'l4-calc-preco', name: 'Precificação e Margem Comercial', processes: [procPreco] },
                { id: 'l4-envio-prop', name: 'Envio e Apresentação de Proposta', processes: [procProposta] }
              ]
            },
            {
              id: 'l3-fechamento',
              name: 'Formalização Contratual',
              childrenL4: [
                { id: 'l4-contrato-com', name: 'Assinatura Digital de Contrato', processes: [procContrato] },
                { id: 'l4-onboarding-pass', name: 'Passagem de Bastão Comercial', processes: [] }
              ]
            }
          ]
        },
        {
          id: 'l2-pos-venda',
          name: 'Pós-Venda e Sucesso do Cliente',
          childrenL3: [
            {
              id: 'l3-onboarding-cs',
              name: 'Ativação e Adoção Inicial',
              childrenL4: [
                { id: 'l4-kickoff', name: 'Kickoff e Adoção do Cliente', processes: [procKickoff] },
                { id: 'l4-treinamento', name: 'Treinamento de Usuários-Chave', processes: [] }
              ]
            },
            {
              id: 'l3-expansao',
              name: 'Gestão de Renovação e Expansão',
              childrenL4: [
                { id: 'l4-renovacao', name: 'Renovação Contratual de Clientes', processes: [] }
              ]
            }
          ]
        }
      ]
    },

    // ══════════════════════════════════════════════════════════
    // CENÁRIO 2: DOMÍNIO PARCIALMENTE PREENCHIDO — SUPRIMENTOS
    // ══════════════════════════════════════════════════════════
    {
      id: 'l1-suprimentos',
      name: 'Suprimentos e Logística',
      domain: 'Primário',
      category: 'PRIMARY',
      responsible: 'Carlos Eduardo Mendes — Diretor de Operações',
      businessUnit: 'Divisão de Suprimentos',
      lastUpdate: '08 de Setembro de 2026',
      criticality: 'Alta',
      mainKpi: 'Saving de Compras: R$ 1.2M (Meta: R$ 2.0M)',
      childrenL2: [
        {
          id: 'l2-compras',
          name: 'Gestão de Compras',
          childrenL3: [
            {
              id: 'l3-comp-estrat',
              name: 'Compras Estratégicas',
              childrenL4: [
                { id: 'l4-cotacao-estrat', name: 'Cotação de Materiais Estratégicos', processes: [procSup1] },
                { id: 'l4-negociacao-po', name: 'Negociação e Pedido de Compra', processes: [procSup2] }
              ]
            }
          ]
        },
        {
          id: 'l2-fornecedores',
          name: 'Gestão de Fornecedores',
          childrenL3: [
            {
              id: 'l3-homologacao',
              name: 'Homologação e Cadastro',
              childrenL4: [
                { id: 'l4-qualif-forn', name: 'Qualificação e Homologação', processes: [procSup3] }
              ]
            },
            {
              id: 'l3-avaliacao-sla',
              name: 'Monitoramento de Desempenho',
              childrenL4: [
                { id: 'l4-auditoria-forn', name: 'Auditoria de Desempenho de Fornecedores', processes: [procSup4] },
                { id: 'l4-planos-acao', name: 'Planos de Ação e Melhoria Contínua', processes: [] }
              ]
            }
          ]
        }
      ]
    },

    // ══════════════════════════════════════════════════════════
    // CENÁRIO 3: DOMÍNIO EM ESTRUTURAÇÃO / BAIXA COBERTURA — TI
    // ══════════════════════════════════════════════════════════
    {
      id: 'l1-ti',
      name: 'Tecnologia da Informação',
      domain: 'Suporte',
      category: 'SUPPORT',
      responsible: 'Renata Silveira — Gerente de TI',
      businessUnit: 'Serviços Corporativos',
      lastUpdate: '01 de Agosto de 2026',
      criticality: 'Média',
      mainKpi: 'Sem indicadores mapeados',
      childrenL2: [
        {
          id: 'l2-ti-infra',
          name: 'Infraestrutura e Redes',
          childrenL3: [
            {
              id: 'l3-ti-cloud',
              name: 'Gestão de Nuvem e Servidores',
              childrenL4: [
                { id: 'l4-ti-provisioning', name: 'Provisionamento de Recursos Cloud', processes: [] }
              ]
            }
          ]
        },
        {
          id: 'l2-ti-sistemas',
          name: 'Sistemas Corporativos',
          childrenL3: [
            {
              id: 'l3-ti-sustentacao',
              name: 'Sustentação e Suporte N3',
              childrenL4: [
                { id: 'l4-ti-chamados', name: 'Atendimento a Incidentes Críticos', processes: [] }
              ]
            }
          ]
        }
      ]
    },

    // ══════════════════════════════════════════════════════════
    // DOMÍNIOS SUPORTE COMPLEMENTARES
    // ══════════════════════════════════════════════════════════
    {
      id: 'l1-juridico',
      name: 'Jurídico',
      domain: 'Suporte',
      category: 'SUPPORT',
      responsible: 'Dr. Roberto Meireles — Diretor Jurídico',
      businessUnit: 'Corporativo',
      lastUpdate: '10 de Setembro de 2026',
      criticality: 'Alta',
      mainKpi: 'Risco Trabalhista: R$ 35M',
      childrenL2: [
        {
          id: 'l2-contencioso',
          name: 'Contencioso e Consultivo',
          childrenL3: [
            {
              id: 'l3-trab-civel',
              name: 'Trabalhista e Cível',
              childrenL4: [
                { id: 'l4-trab', name: 'Defesa Trabalhista', processes: [procJur1] },
                { id: 'l4-acordos', name: 'Mediação de Acordos', processes: [procJur2] }
              ]
            }
          ]
        }
      ]
    },
    {
      id: 'l1-rh',
      name: 'Recursos Humanos',
      domain: 'Suporte',
      category: 'SUPPORT',
      responsible: 'Beatriz Fontes — Diretora de RH',
      businessUnit: 'Gente e Gestão',
      lastUpdate: '05 de Setembro de 2026',
      criticality: 'Média',
      mainKpi: 'Tempo de Admissão: 12 dias',
      childrenL2: [
        {
          id: 'l2-ta',
          name: 'Aquisição de Talentos',
          childrenL3: [
            {
              id: 'l3-rs',
              name: 'Recrutamento e Seleção',
              childrenL4: [
                { id: 'l4-atracao', name: 'Atração e Seleção', processes: [procRH1] }
              ]
            }
          ]
        },
        {
          id: 'l2-admp',
          name: 'Administração de Pessoal',
          childrenL3: [
            {
              id: 'l3-admissao',
              name: 'Admissão e Integração',
              childrenL4: [
                { id: 'l4-onboarding-rh', name: 'Admissão e Onboarding', processes: [procRH2] }
              ]
            }
          ]
        }
      ]
    },
    {
      id: 'l1-fin',
      name: 'Financeiro',
      domain: 'Suporte',
      category: 'SUPPORT',
      responsible: 'Arthur Antunes — Gerente Financeiro',
      businessUnit: 'Finanças e Controladoria',
      lastUpdate: '11 de Setembro de 2026',
      criticality: 'Alta',
      mainKpi: 'SLA de Pagamento: 92%',
      childrenL2: [
        {
          id: 'l2-cap',
          name: 'Contas a Pagar e Tesouraria',
          childrenL3: [
            {
              id: 'l3-pagforn',
              name: 'Pagamento a Fornecedores',
              childrenL4: [
                { id: 'l4-liquidacao', name: 'Liquidação Financeira', processes: [procFin1] }
              ]
            }
          ]
        }
      ]
    },
    naturaL1
  ],

  // ── 6. JORNADAS DE VALOR ──────────
  journeys: [
    {
      id: 'jour-o2c',
      name: 'Order to Cash (Comercial, Jurídico e Faturamento)',
      description: 'Jornada ponta a ponta desde a geração da oportunidade comercial até a liquidação contábil.',
      objective: 'Acelerar o ciclo de vendas e faturamento garantindo conformidade contratual',
      triggerEvent: 'Identificação de nova oportunidade qualificada ou solicitação formal de proposta pelo cliente B2B',
      expectedOutcome: 'Contrato assinado digitalmente, serviços liberados e primeira fatura emitida com baixa contábil',
      owner: 'Mariana Vasconcelos (Head Comercial) & Roberto Meireles (Head Jurídico)',
      leadTime: '14 dias úteis',
      totalCost: 'R$ 4.250 / ciclo',
      automationRate: 68,
      maturityRate: 85,
      integrationsCount: 4,
      mainDomain: 'Gestão Comercial',
      status: 'validated',
      domainRoles: { 
        'Gestão Comercial': 'principal', 
        'Jurídico': 'participante',
        'Financeiro': 'suporte' 
      },
      participatingProcessIds: [
        procOutbound.id,
        procPreco.id,
        procProposta.id,
        procContrato.id,
        procFin1.id
      ],
      steps: [
        { id: 'step-o2c-1', order: 1, processId: procOutbound.id, stepName: procOutbound.name, domain: 'Gestão Comercial', duration: '3 dias', systemUsage: { systemName: 'CRM Salesforce', operation: 'leitura', dataObjects: ['Conta Alvo'], dependencies: [], isManual: false }, input: 'Lead Qualificado', output: 'Oportunidade Aberta', integrationStatus: 'existing' },
        { id: 'step-o2c-2', order: 2, processId: procPreco.id, stepName: procPreco.name, domain: 'Gestão Comercial', duration: '2 dias', systemUsage: { systemName: 'Planilhas Comerciais (Excel)', operation: 'cálculo', dataObjects: ['Simulação de Margem'], dependencies: [], isManual: true }, input: 'Lista de Itens', output: 'Preço Validado', integrationStatus: 'missing' },
        { id: 'step-o2c-3', order: 3, processId: procProposta.id, stepName: procProposta.name, domain: 'Gestão Comercial', duration: '2 dias', systemUsage: { systemName: 'CRM Salesforce', operation: 'escrita', dataObjects: ['Proposta Comercial'], dependencies: [], isManual: false }, input: 'Preço Validado', output: 'Proposta Aceita', integrationStatus: 'existing' },
        { id: 'step-o2c-4', order: 4, processId: procContrato.id, stepName: procContrato.name, domain: 'Jurídico', duration: '4 dias', systemUsage: { systemName: 'DocuSign', operation: 'escrita', dataObjects: ['Contrato Digital'], dependencies: [], isManual: false }, input: 'Minuta Padrão', output: 'Contrato Assinado', integrationStatus: 'existing' },
        { id: 'step-o2c-5', order: 5, processId: procFin1.id, stepName: procFin1.name, domain: 'Financeiro', duration: '3 dias', systemUsage: { systemName: 'ERP Financeiro SAP', operation: 'escrita', dataObjects: ['Ordem de Faturamento'], dependencies: [], isManual: false }, input: 'Contrato Assinado', output: 'Fatura Emitida', integrationStatus: 'existing' }
      ],
      stepRelations: [
        { sourceStepId: 'step-o2c-1', targetStepId: 'step-o2c-2', type: 'fornece_entrada_para' },
        { sourceStepId: 'step-o2c-2', targetStepId: 'step-o2c-3', type: 'fornece_entrada_para' },
        { sourceStepId: 'step-o2c-3', targetStepId: 'step-o2c-4', type: 'fornece_entrada_para' },
        { sourceStepId: 'step-o2c-4', targetStepId: 'step-o2c-5', type: 'fornece_entrada_para' }
      ],
      coveredL1: ['Gestão Comercial', 'Jurídico', 'Financeiro'],
      coveredL2: ['Prospecção e Qualificação', 'Negociação e Fechamento', 'Contas a Pagar e Tesouraria'],
      coveredL3: ['Geração e Enriquecimento de Leads', 'Elaboração de Propostas e Precificação', 'Formalização Contratual', 'Pagamento a Fornecedores'],
      coveredL4: ['Prospecção Ativa Outbound', 'Precificação e Margem Comercial', 'Envio e Apresentação de Proposta', 'Assinatura Digital de Contrato', 'Liquidação Financeira'],
      systemsInvolved: ['CRM Salesforce', 'Planilhas Comerciais (Excel)', 'DocuSign', 'ERP Financeiro SAP'],
      dataObjectsInvolved: ['Oportunidade', 'Proposta Comercial', 'Contrato Digital', 'Ordem de Faturamento'],
      businessIndicators: [indSLAComercial, indVolumeVendas],
      contextIndicators: [],
      gaps: [
        { value: 'Dependência de planilha manual para cálculo de margem antes do envio da proposta', validation: { state: 'confirmado', origin: 'Mapeamento Comercial', confidence: 100, responsible: 'Mariana Vasconcelos', date: '2026-08-20', justification: 'Registrado no processo de Precificação' } },
        { value: 'Ausência de webhook direto entre DocuSign e ERP Financeiro para criação automática da fatura', validation: { state: 'declarado_usuario', origin: 'Mapeamento Financeiro', confidence: 90, responsible: 'Roberto Meireles', date: '2026-08-25', justification: 'Registrado no processo de Formalização' } }
      ],
      suggestionConfidence: 94
    },
    {
      id: 'jour-prospeccao-b2b',
      name: 'Prospecção B2B Estratégica',
      description: 'Do levantamento de contas ideais até o diagnóstico consultivo e apresentação técnica.',
      objective: 'Elevar a taxa de conversão do topo do funil de vendas corporativas',
      mainDomain: 'Gestão Comercial',
      status: 'validated',
      domainRoles: { 
        'Gestão Comercial': 'principal'
      },
      participatingProcessIds: [
        procInbound.id,
        procOutbound.id,
        procReuniao.id
      ],
      steps: [
        { id: 'step-pb2b-1', order: 1, processId: procInbound.id, stepName: procInbound.name, systemUsage: { systemName: 'HubSpot Marketing', operation: 'leitura', dataObjects: ['MQL Data'], dependencies: [], isManual: false }, input: 'Visita ao Site', output: 'Lead Triado', integrationStatus: 'existing' },
        { id: 'step-pb2b-2', order: 2, processId: procOutbound.id, stepName: procOutbound.name, systemUsage: { systemName: 'Apollo.io / LinkedIn Sales Nav', operation: 'consulta', dataObjects: ['Perfil de Decisor'], dependencies: [], isManual: false }, input: 'Conta ICP', output: 'Contato Mapeado', integrationStatus: 'existing' },
        { id: 'step-pb2b-3', order: 3, processId: procReuniao.id, stepName: procReuniao.name, systemUsage: { systemName: 'CRM Salesforce', operation: 'escrita', dataObjects: ['BANT Data'], dependencies: [], isManual: false }, input: 'Contato Mapeado', output: 'Reunião Confirmada', integrationStatus: 'existing' }
      ],
      stepRelations: [
        { sourceStepId: 'step-pb2b-1', targetStepId: 'step-pb2b-3', type: 'fornece_entrada_para' },
        { sourceStepId: 'step-pb2b-2', targetStepId: 'step-pb2b-3', type: 'fornece_entrada_para' }
      ],
      coveredL1: ['Gestão Comercial'],
      coveredL2: ['Prospecção e Qualificação'],
      coveredL3: ['Geração e Enriquecimento de Leads', 'Qualificação e Agendamento (SDR)'],
      coveredL4: ['Captação e Triagem Inbound', 'Prospecção Ativa Outbound', 'Agendamento de Demonstrações'],
      systemsInvolved: ['CRM Salesforce', 'HubSpot Marketing', 'Apollo.io / LinkedIn Sales Nav', 'Google Calendar'],
      dataObjectsInvolved: ['Lead', 'MQL Data', 'BANT Data'],
      businessIndicators: [indConversaoPropostas, indTempoCiclo],
      contextIndicators: [],
      gaps: [],
      suggestionConfidence: 90
    },
    {
      id: 'jour-onboarding-cliente',
      name: 'Onboarding e Ativação de Clientes',
      description: 'Da assinatura comercial à ativação das equipes operacionais e início de uso da plataforma.',
      objective: 'Garantir primeiro valor (Time-to-Value) em menos de 15 dias',
      mainDomain: 'Gestão Comercial',
      status: 'validating',
      domainRoles: { 
        'Gestão Comercial': 'principal',
        'Tecnologia da Informação': 'suporte'
      },
      participatingProcessIds: [
        procContrato.id,
        procKickoff.id
      ],
      steps: [
        { id: 'step-onb-1', order: 1, processId: procContrato.id, stepName: procContrato.name, systemUsage: { systemName: 'DocuSign', operation: 'escrita', dataObjects: ['Contrato Digital'], dependencies: [], isManual: false }, input: 'Minuta Aceita', output: 'Contrato Formalizado', integrationStatus: 'existing' },
        { id: 'step-onb-2', order: 2, processId: procKickoff.id, stepName: procKickoff.name, systemUsage: { systemName: 'Slack', operation: 'escrita', dataObjects: ['Canal do Cliente'], dependencies: [], isManual: false }, input: 'Contrato Formalizado', output: 'Kickoff Realizado', integrationStatus: 'existing' }
      ],
      stepRelations: [
        { sourceStepId: 'step-onb-1', targetStepId: 'step-onb-2', type: 'fornece_entrada_para' }
      ],
      coveredL1: ['Gestão Comercial'],
      coveredL2: ['Negociação e Fechamento', 'Pós-Venda e Sucesso do Cliente'],
      coveredL3: ['Formalização Contratual', 'Ativação e Adoção Inicial'],
      coveredL4: ['Assinatura Digital de Contrato', 'Kickoff e Adoção do Cliente'],
      systemsInvolved: ['DocuSign', 'CRM Salesforce', 'Slack'],
      dataObjectsInvolved: ['Contrato Digital', 'Ata de Kickoff'],
      businessIndicators: [indSLAComercial],
      contextIndicators: [],
      gaps: [
        { value: 'Falta integração entre DocuSign e ferramenta de gestão de projetos de implantação', validation: { state: 'declarado_usuario', origin: 'CS', confidence: 85, responsible: 'Lucas Nogueira', date: '2026-08-28', justification: 'Disparo ainda manual' } }
      ],
      suggestionConfidence: 82
    },

    // Jornadas de Suprimentos e RH
    {
      id: 'jour-sup-fornecedor',
      name: 'Contratação e Homologação de Fornecedor',
      description: 'Do cadastro inicial à aprovação de crédito e emissão de pedido de compras.',
      objective: 'Reduzir o tempo de homologação e mitigar risco financeiro',
      mainDomain: 'Suprimentos e Logística',
      status: 'validated',
      domainRoles: { 
        'Suprimentos e Logística': 'principal', 
        'Jurídico': 'suporte' 
      },
      participatingProcessIds: [
        procSup3.id,
        procSup1.id,
        procSup2.id
      ],
      steps: [
        { id: 'step-sup-1', order: 1, processId: procSup3.id, stepName: procSup3.name, systemUsage: { systemName: 'Portal de Fornecedores', operation: 'escrita', dataObjects: ['Certidões Negativas'], dependencies: [], isManual: false }, input: 'Dados Cadastrais', output: 'Fornecedor Aprovado', integrationStatus: 'existing' },
        { id: 'step-sup-2', order: 2, processId: procSup1.id, stepName: procSup1.name, systemUsage: { systemName: 'SAP Ariba', operation: 'escrita', dataObjects: ['Mapa de Cotação'], dependencies: [], isManual: false }, input: 'Requisição de Compras', output: 'Proposta Vencedora', integrationStatus: 'existing' },
        { id: 'step-sup-3', order: 3, processId: procSup2.id, stepName: procSup2.name, systemUsage: { systemName: 'SAP Ariba', operation: 'escrita', dataObjects: ['Pedido de Compra'], dependencies: [], isManual: false }, input: 'Proposta Vencedora', output: 'PO Emitida', integrationStatus: 'existing' }
      ],
      stepRelations: [
        { sourceStepId: 'step-sup-1', targetStepId: 'step-sup-2', type: 'fornece_entrada_para' },
        { sourceStepId: 'step-sup-2', targetStepId: 'step-sup-3', type: 'fornece_entrada_para' }
      ],
      coveredL1: ['Suprimentos e Logística'],
      coveredL2: ['Gestão de Compras', 'Gestão de Fornecedores'],
      coveredL3: ['Compras Estratégicas', 'Homologação e Cadastro'],
      coveredL4: ['Cotação de Materiais Estratégicos', 'Negociação e Pedido de Compra', 'Qualificação e Homologação'],
      systemsInvolved: ['Portal de Fornecedores', 'Serasa Experian', 'SAP Ariba'],
      dataObjectsInvolved: ['Certidões Negativas', 'Mapa de Cotação', 'Purchase Order (PO)'],
      businessIndicators: [indSaving],
      contextIndicators: [],
      gaps: [],
      suggestionConfidence: 91
    },
    {
      id: 'jour-admissao-colab',
      name: 'Atração e Admissão de Colaboradores',
      description: 'Do anúncio da vaga até o primeiro dia de trabalho com acessos habilitados.',
      objective: 'Prover uma experiência fluida para o novo funcionário',
      mainDomain: 'Recursos Humanos',
      status: 'validated',
      domainRoles: { 
        'Recursos Humanos': 'principal',
        'Tecnologia da Informação': 'suporte'
      },
      participatingProcessIds: [
        procRH1.id,
        procRH2.id
      ],
      steps: [
        { id: 'step-rh-1', order: 1, processId: procRH1.id, stepName: procRH1.name, systemUsage: { systemName: 'Gupy', operation: 'escrita', dataObjects: ['Candidato'], dependencies: [], isManual: false }, input: 'Vaga Aprovada', output: 'Candidato Selecionado', integrationStatus: 'existing' },
        { id: 'step-rh-2', order: 2, processId: procRH2.id, stepName: procRH2.name, systemUsage: { systemName: 'Workday', operation: 'escrita', dataObjects: ['Cadastro de Funcionário'], dependencies: [], isManual: false }, input: 'Candidato Selecionado', output: 'Colaborador Ativo', integrationStatus: 'existing' }
      ],
      stepRelations: [
        { sourceStepId: 'step-rh-1', targetStepId: 'step-rh-2', type: 'fornece_entrada_para' }
      ],
      coveredL1: ['Recursos Humanos'],
      coveredL2: ['Aquisição de Talentos', 'Administração de Pessoal'],
      coveredL3: ['Recrutamento e Seleção', 'Admissão e Integração'],
      coveredL4: ['Atração e Seleção', 'Admissão e Onboarding'],
      systemsInvolved: ['Gupy', 'Workday', 'ServiceNow'],
      dataObjectsInvolved: ['Candidato', 'Ficha de Registro e Termos'],
      businessIndicators: [],
      contextIndicators: [indTempoAdmissao],
      gaps: [],
      suggestionConfidence: 89
    }
  ]
};

// ── 7. DETALHES DE PROCESSOS OPERACIONAIS (BPMN, SOP, AUTOMAÇÃO) ──

export const mockOperationalProcessDetails: Record<string, OperationalProcessDetail> = {
  'proc-qualificar-b2b': {
    id: 'proc-qualificar-b2b',
    name: 'Qualificar Oportunidade B2B',
    description: 'Processo executável: aqui a lógica de execução, as decisões, exceções e automações são explicitamente modeladas.',
    code: 'SOP-042',
    sopCode: 'SOP-042',
    sopVersion: 'versão 3.2',
    responsible: {
      name: 'Coordenação de SDR',
      role: 'Responsável Operacional',
      title: 'Coordenador Comercial de Vendas B2B'
    },
    businessUnit: 'Diretoria Comercial',
    dimensioning: {
      allocatedFte: 5,
      unit: 'FTs',
      referenceDate: '01 out 2026',
      validationStatus: 'validado'
    },
    validationConfidence: 82,
    revisionDate: '01 out 2026',
    flowSteps: [
      { id: 'step-1', name: '1. Receber lead priorizado', type: 'event_start', description: 'Evento inicial · HubSpot → CRM', system: 'HubSpot Marketing', status: 'good' },
      { id: 'step-2', name: '2. Validar dados mínimos', type: 'activity', description: 'Atividade · consulta CRM e Apollo.io', system: 'CRM Salesforce', status: 'normal' },
      { id: 'step-gw-1', name: 'ICP e dados elegíveis?', type: 'gateway_exclusive', description: 'Gateway exclusivo de elegibilidade BANT' },
      { id: 'step-3', name: '3. Contatar e registrar descoberta', type: 'activity', description: 'Atividade humana · SLA 4h · chamada diagnóstica', system: 'Google Calendar / CRM', sla: 'SLA 4h', status: 'risk' },
      { id: 'step-4', name: '4. Definir encaminhamento', type: 'activity', description: 'Handoff / agenda / nutrição de lead', system: 'CRM Salesforce', status: 'good' },
      { id: 'step-5', name: '5. Oportunidade Encaminhada', type: 'event_end', description: 'Evento final: reunião agendada na agenda do AE' }
    ],
    exceptionsNote: 'Exceção modelada: se os dados estiverem incompletos, o processo retorna para enriquecimento; se o lead não apresentar aderência, é encerrado com motivo obrigatório. Essas relações são evidência operacional, não inferência da cadeia.',
    handoffsNote: 'Handoff explícito: oportunidade com BANT validado transfere responsabilidade formal para o Executivo de Contas.',
    automationReadiness: [
      {
        title: 'Enriquecimento automático',
        score: 88,
        description: 'Dados externos de ICP + atualização instantânea de CRM.',
        recommendation: 'Workflow / Agente Autônomo'
      },
      {
        title: 'Triagem de elegibilidade',
        score: 72,
        description: 'Aplicação de regras de ICP e completude cadastral.',
        recommendation: 'Motor de Regras de Negócio (BRMS)'
      },
      {
        title: 'Resumo de descoberta',
        score: 54,
        description: 'Informações não estruturadas de interações e diagnóstico.',
        recommendation: 'Copiloto com validação humana'
      }
    ],
    objective: 'Decidir e registrar o próximo encaminhamento da oportunidade com dados suficientes para continuidade comercial.',
    outcome: 'Oportunidade contextualizada, reunião agendada na agenda do AE ou descarte com motivo estruturado.',
    trigger: 'Lead priorizado recebido de canais de marketing, eventos ou prospecção ativa.',
    closingCriteria: 'Reunião criada no Google Calendar + CRM atualizado, nutrição acionada ou desqualificação registrada com motivo obrigatório.',
    systemsUsed: ['HubSpot Marketing', 'CRM Salesforce', 'Apollo.io', 'Google Calendar'],
    dataObjects: ['Lead', 'Conta', 'Contato', 'Oportunidade BANT', 'Motivo de Desqualificação', 'Evento de Agenda'],
    policies: [
      {
        id: 'pol-com-1',
        name: 'Política Comercial Corporativa',
        type: 'Política Interna',
        version: 'Rev. 2026',
        status: 'vigente',
        complianceStatus: 'conforme',
        reviewDueDate: 'Dez/2026',
        responsible: 'Compliance Comercial'
      },
      {
        id: 'pol-lgpd-1',
        name: 'Política de Privacidade e LGPD',
        type: 'Norma Regulatória',
        version: 'v2.1',
        status: 'vigente',
        complianceStatus: 'conforme',
        reviewDueDate: 'Nov/2026',
        responsible: 'DPO / Jurídico'
      }
    ],
    evidence: ['Gravação de interação de descoberta', 'Histórico de alterações no Salesforce', 'Relatório de aderência BANT']
  }
};

