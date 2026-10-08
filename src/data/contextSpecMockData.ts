import type { ContextSpecData } from '@/types/processContext';

export const itAmortizationSpecData: ContextSpecData = {
  processId: 'local-seed-0',
  processName: 'Amortização de Despesas Antecipadas de TI',

  specification: {
    status: 'in_validation',
    version: 'v1.1',
    lastUpdatedBy: 'Antigravity AI + Renata Lemos',
    lastUpdatedAt: 'Hoje, às 10:35',
  },

  macroStages: [
    {
      id: 'ms-1',
      order: 1,
      name: 'Receber e Preparar Arquivos',
      description: 'Coleta de notas fiscais, faturas de fornecedores de software/hardware e relatórios mensais de consumo dos portais externos.',
      rfIds: ['RF-001', 'RF-002'],
      rnIds: ['RN-001'],
      gapIds: ['GAP-001'],
      hasHumanDecision: false,
      hasExceptions: false,
    },
    {
      id: 'ms-2',
      order: 2,
      name: 'Relacionar Faturas e Pedidos',
      description: 'Cruzamento dos itens faturados com as Ordens de Compra abertas no SAP e validação da conta contábil de despesa antecipada.',
      rfIds: ['RF-003', 'RF-004'],
      rnIds: ['RN-002', 'RN-003'],
      gapIds: ['GAP-002'],
      hasHumanDecision: true,
      hasExceptions: false,
    },
    {
      id: 'ms-3',
      order: 3,
      name: 'Tratar Exceções e Divergências',
      description: 'Tratamento de divergências de valor, variação cambial em moedas estrangeiras, faturamentos com medição pendente ou contratos em renovação.',
      rfIds: ['RF-005'],
      rnIds: ['RN-004'],
      gapIds: ['GAP-003'],
      hasHumanDecision: true,
      hasExceptions: true,
    },
    {
      id: 'ms-4',
      order: 4,
      name: 'Revisar, Aprovar e Lançar no ERP',
      description: 'Cálculo linear das quotas mensais, conferência final pelo coordenador financeiro e integração do lote contábil no SAP FI.',
      rfIds: ['RF-006', 'RF-007'],
      rnIds: ['RN-005', 'RN-006'],
      gapIds: ['GAP-004'],
      hasHumanDecision: true,
      hasExceptions: false,
    },
  ],

  gaps: [
    {
      id: 'GAP-001',
      title: 'Formato aceito para faturas de fornecedores menores',
      question: 'Quais formatos de arquivo são aceitos para faturas de fornecedores menores que não emitem NF-e eletrônica?',
      explanation: 'Alguns fornecedores menores de TI enviam faturas em PDF simples ou até imagem digitalizada, sem XML padrão SEFAZ. O processo atual trata apenas NF-e (XML) e PDF estruturado.',
      whyNeeded: 'Sem essa definição, faturas de fornecedores menores ficam sem tratamento padronizado e podem ser registradas manualmente sem validação fiscal.',
      impact: 'medium',
      affectedRFIds: ['RF-001'],
      affectedRNIds: ['RN-001'],
      relatedStageId: 'ms-1',
      suggestedResponsible: 'Coordenador Fiscal',
      status: 'open',
      responseOptions: [
        'Aceitar PDF simples com conferência manual do CNPJ',
        'Exigir que todos os fornecedores emitam NF-e',
        'Aceitar PDF com validação automatizada por OCR',
        'Outro',
      ],
      responseHistory: [],
      impactPreview: [
        {
          itemId: 'RF-001',
          itemType: 'rf',
          itemTitle: 'Importar e catalogar faturas',
          fieldChanged: 'Entradas aceitas',
          before: 'Apenas NF-e (XML) e PDF estruturado',
          after: 'NF-e (XML), PDF estruturado e PDF simples com conferência manual do CNPJ',
        },
        {
          itemId: 'RN-001',
          itemType: 'rn',
          itemTitle: 'Validação de formato fiscal',
          fieldChanged: 'Condição',
          before: 'Rejeitar documentos sem XML SEFAZ válido',
          after: 'Rejeitar documentos sem XML SEFAZ válido, exceto PDFs de fornecedores menores previamente cadastrados',
        },
      ],
      updatedAt: 'Hoje, 09:20',
    },
    {
      id: 'GAP-002',
      title: 'Tolerância de divergência entre fatura e PO',
      question: 'Qual é a tolerância percentual aceita entre o valor da fatura e o valor do pedido de compra (PO)?',
      explanation: 'Faturas de serviços de nuvem frequentemente apresentam variações de 1% a 5% em relação ao valor contratado devido a flutuações de câmbio e consumo variável.',
      whyNeeded: 'Essa definição determina quando uma divergência gera bloqueio automático vs. aprovação direta, impactando o tempo de fechamento contábil.',
      impact: 'high',
      affectedRFIds: ['RF-003', 'RF-004'],
      affectedRNIds: ['RN-002'],
      relatedStageId: 'ms-2',
      suggestedResponsible: 'Gerente Financeiro',
      status: 'open',
      responseOptions: [
        'Até 2% — aprovação automática',
        'Até 5% — aprovação automática',
        'Até 2% automática, de 2% a 5% com aprovação do gestor',
        'Sem tolerância — qualquer divergência bloqueia',
        'Outro',
      ],
      responseHistory: [],
      impactPreview: [
        {
          itemId: 'RF-003',
          itemType: 'rf',
          itemTitle: 'Cruzar fatura com pedido de compra',
          fieldChanged: 'Critérios de aceite',
          before: 'Valores devem coincidir exatamente.',
          after: 'Divergências até X% são aceitas automaticamente; acima disso, bloquear para aprovação.',
        },
        {
          itemId: 'RN-002',
          itemType: 'rn',
          itemTitle: 'Regra de conciliação fatura-PO',
          fieldChanged: 'Comportamento esperado',
          before: 'Bloquear toda divergência de valor.',
          after: 'Aplicar tolerância definida antes do bloqueio.',
        },
      ],
      updatedAt: 'Hoje, 09:45',
    },
    {
      id: 'GAP-003',
      title: 'Tratamento de exceção para contratos em renovação',
      question: 'Como tratar faturas referentes a contratos em processo de renovação que ainda não possuem nova PO?',
      explanation: 'Durante a renovação contratual (que pode levar 30-60 dias), fornecedores continuam prestando serviço e emitindo faturas sem PO atualizada.',
      whyNeeded: 'Sem essa definição, faturas legítimas podem ficar retidas por meses, causando atrasos de pagamento e provisões contábeis incorretas.',
      impact: 'high',
      affectedRFIds: ['RF-005'],
      affectedRNIds: ['RN-004'],
      relatedStageId: 'ms-3',
      suggestedResponsible: 'Gestão de Contratos de TI',
      status: 'awaiting_response',
      responseOptions: [
        'Registrar como provisão contábil até nova PO ser emitida',
        'Criar PO temporária com vigência de 90 dias',
        'Bloquear pagamento até regularização',
        'Outro',
      ],
      currentAnswer: 'Registrar como provisão contábil até nova PO ser emitida',
      responseHistory: [
        {
          id: 'resp-001',
          answer: 'Registrar como provisão contábil até nova PO ser emitida',
          respondedBy: 'Carlos Mendes (Gestão de Contratos)',
          respondedAt: 'Hoje, 11:20',
          note: 'Prática já utilizada informalmente, mas precisa ser formalizada.',
        },
      ],
      impactPreview: [
        {
          itemId: 'RF-005',
          itemType: 'rf',
          itemTitle: 'Encaminhar exceções para tratamento',
          fieldChanged: 'Descrição',
          before: 'Encaminhar faturas sem PO correspondente para análise manual.',
          after: 'Faturas sem PO correspondente e com contrato em renovação devem ser registradas como provisão contábil. Demais exceções seguem para análise manual.',
        },
        {
          itemId: 'RN-004',
          itemType: 'rn',
          itemTitle: 'Regra de tratamento de exceções',
          fieldChanged: 'Comportamento esperado',
          before: 'Toda fatura sem PO deve ser retida até regularização.',
          after: 'Faturas com contrato em renovação devem ser provisionadas; demais retidas até regularização.',
        },
      ],
      updatedAt: 'Hoje, 11:20',
    },
    {
      id: 'GAP-004',
      title: 'Alçada de aprovação para lançamentos acima de R$ 50.000',
      question: 'Quem pode aprovar lançamentos de amortização acima de R$ 50.000?',
      explanation: 'A documentação apresenta duas interpretações diferentes: uma indica que o coordenador financeiro aprova qualquer valor; outra menciona necessidade de assinatura da diretoria acima de determinado limite.',
      whyNeeded: 'Essa definição impacta o requisito de encaminhamento e a regra de aprovação, sendo essencial para conformidade SOX.',
      impact: 'high',
      affectedRFIds: ['RF-006', 'RF-007'],
      affectedRNIds: ['RN-005', 'RN-006'],
      relatedStageId: 'ms-4',
      suggestedResponsible: 'Diretoria Financeira',
      status: 'open',
      responseOptions: [
        'Coordenador financeiro aprova qualquer valor',
        'Coordenador até R$ 50.000; acima, diretoria',
        'Coordenador até R$ 50.000; acima, comitê de aprovação',
        'Não existe limite de valor — coordenador aprova tudo',
        'Outro',
      ],
      responseHistory: [],
      impactPreview: [
        {
          itemId: 'RF-006',
          itemType: 'rf',
          itemTitle: 'Encaminhar para aprovação conforme alçada',
          fieldChanged: 'Descrição',
          before: 'Encaminhar lançamento para o perfil autorizado.',
          after: 'Encaminhar lançamentos acima de R$ 50.000 para a diretoria financeira; demais para o coordenador.',
        },
        {
          itemId: 'RN-005',
          itemType: 'rn',
          itemTitle: 'Regra de alçada de aprovação',
          fieldChanged: 'Condição',
          before: 'Aprovação pelo coordenador financeiro.',
          after: 'Lançamentos até R$ 50.000: coordenador; acima: diretoria financeira.',
        },
      ],
      updatedAt: 'Hoje, 08:40',
    },
  ],

  functionalRequirements: [
    {
      id: 'RF-001',
      title: 'Importar e catalogar faturas',
      description: 'O sistema deve permitir a importação de faturas de fornecedores de TI a partir de múltiplas fontes (e-mail, portais de fornecedores, upload manual) e catalogá-las na pasta de competência do mês.',
      objective: 'Centralizar todas as faturas do período em um repositório único e estruturado.',
      relatedStageId: 'ms-1',
      actor: 'Analista de Contas a Pagar',
      inputs: ['Faturas fiscais (NF-e XML, PDF)', 'Relatórios de consumo de portais de nuvem'],
      expectedOutput: 'Repositório mensal de faturas catalogadas com metadados extraídos (CNPJ, valor, competência, fornecedor).',
      exceptions: ['Fatura com CNPJ não cadastrado no sistema', 'Arquivo corrompido ou ilegível'],
      acceptanceCriteria: [
        'Dado um conjunto de faturas válidas, o sistema deve importar e catalogar 100% dos documentos sem perda.',
        'Dado um arquivo com formato não suportado, o sistema deve rejeitar com mensagem clara indicando o formato esperado.',
        'O tempo de processamento por fatura deve ser inferior a 5 segundos.',
      ],
      relatedRNIds: ['RN-001'],
      relatedGapIds: ['GAP-001'],
      validationStatus: 'pending_gap',
      changeHistory: [],
    },
    {
      id: 'RF-002',
      title: 'Extrair dados estruturados das faturas',
      description: 'O sistema deve extrair automaticamente os campos-chave das faturas importadas: CNPJ do fornecedor, número da NF, data de emissão, valor total, itens faturados e competência.',
      objective: 'Eliminar a digitação manual de dados fiscais e reduzir erros de transcrição.',
      relatedStageId: 'ms-1',
      actor: 'Sistema (automático)',
      inputs: ['Fatura importada (XML ou PDF)'],
      expectedOutput: 'Registro estruturado com campos fiscais preenchidos automaticamente.',
      exceptions: ['PDF sem estrutura legível por OCR', 'XML com schema diferente do esperado'],
      acceptanceCriteria: [
        'Para NF-e em XML, 100% dos campos devem ser extraídos corretamente.',
        'Para PDFs estruturados, ao menos 95% dos campos devem ser extraídos sem intervenção.',
      ],
      relatedRNIds: [],
      relatedGapIds: [],
      validationStatus: 'confirmed',
      changeHistory: [],
    },
    {
      id: 'RF-003',
      title: 'Cruzar fatura com pedido de compra (PO)',
      description: 'O sistema deve comparar automaticamente os dados de cada fatura importada com os pedidos de compra (POs) abertos no SAP MM, identificando correspondências e divergências.',
      objective: 'Garantir que toda fatura possui lastro contratual válido antes do lançamento contábil.',
      relatedStageId: 'ms-2',
      actor: 'Sistema (automático) + Analista de Contas a Pagar',
      inputs: ['Dados da fatura extraídos', 'Extrato de POs abertas no SAP MM'],
      expectedOutput: 'Relatório de conciliação indicando: faturas conciliadas, divergências de valor e faturas sem PO correspondente.',
      exceptions: ['PO vencida com fatura em aberto', 'Múltiplas POs para o mesmo fornecedor'],
      acceptanceCriteria: [
        'Dado um conjunto de faturas e POs, o sistema deve identificar 100% das correspondências exatas.',
        'Divergências de valor devem ser sinalizadas com destaque visual e percentual de diferença.',
      ],
      relatedRNIds: ['RN-002'],
      relatedGapIds: ['GAP-002'],
      validationStatus: 'pending_gap',
      changeHistory: [],
    },
    {
      id: 'RF-004',
      title: 'Validar classificação contábil da despesa',
      description: 'O sistema deve verificar se a conta contábil de despesa antecipada associada à fatura/PO está correta conforme o plano de contas vigente.',
      objective: 'Prevenir erros de classificação que impactem o balanço patrimonial e a DRE.',
      relatedStageId: 'ms-2',
      actor: 'Analista Contábil',
      inputs: ['Dados conciliados fatura-PO', 'Plano de contas vigente'],
      expectedOutput: 'Confirmação de classificação ou alerta de reclassificação necessária.',
      exceptions: ['Conta contábil inexistente ou bloqueada', 'Contrato com múltiplas naturezas de despesa'],
      acceptanceCriteria: [
        'Dado uma fatura com conta contábil válida, o sistema deve confirmar sem intervenção.',
        'Dado uma conta bloqueada, o sistema deve impedir o avanço e notificar o analista contábil.',
      ],
      relatedRNIds: ['RN-003'],
      relatedGapIds: [],
      validationStatus: 'confirmed',
      changeHistory: [],
    },
    {
      id: 'RF-005',
      title: 'Encaminhar exceções para tratamento',
      description: 'O sistema deve identificar e encaminhar automaticamente faturas com divergências não resolvidas, valores fora da tolerância ou sem PO correspondente para a fila de exceções.',
      objective: 'Garantir que nenhuma exceção passe despercebida e que cada caso tenha tratamento rastreável.',
      relatedStageId: 'ms-3',
      actor: 'Analista de Contas a Pagar + Gestão de Contratos de TI',
      inputs: ['Faturas com divergência identificada', 'Alertas de consumo variável'],
      expectedOutput: 'Registro de exceção com parecer da Gestão de Contratos e decisão de tratamento.',
      exceptions: ['Contrato cancelado sem aviso prévio', 'Fornecedor sem cadastro atualizado'],
      acceptanceCriteria: [
        'Toda fatura com divergência acima da tolerância deve gerar um registro de exceção em até 1 minuto.',
        'O registro de exceção deve conter: motivo, valor da divergência, ação sugerida e responsável.',
      ],
      relatedRNIds: ['RN-004'],
      relatedGapIds: ['GAP-003'],
      validationStatus: 'pending_gap',
      changeHistory: [],
    },
    {
      id: 'RF-006',
      title: 'Encaminhar para aprovação conforme alçada',
      description: 'O sistema deve encaminhar o lançamento de amortização para o perfil autorizado conforme as regras de alçada definidas, garantindo segregação de funções.',
      objective: 'Garantir conformidade com normas SOX e IFRS de segregação de funções.',
      relatedStageId: 'ms-4',
      actor: 'Sistema (automático) → Coordenador Financeiro / Diretoria',
      inputs: ['Memória de cálculo consolidada', 'Valor total do lançamento'],
      expectedOutput: 'Lançamento aprovado ou devolvido com justificativa.',
      exceptions: ['Aprovador ausente (férias/licença)', 'Lançamento retroativo de período já fechado'],
      acceptanceCriteria: [
        'Lançamentos devem ser encaminhados ao aprovador correto conforme a alçada em até 30 segundos após submissão.',
        'Nenhum lançamento pode ser efetivado sem aprovação registrada.',
      ],
      relatedRNIds: ['RN-005'],
      relatedGapIds: ['GAP-004'],
      validationStatus: 'pending_gap',
      changeHistory: [],
    },
    {
      id: 'RF-007',
      title: 'Registrar lançamento contábil no SAP FI',
      description: 'Após aprovação, o sistema deve gerar e integrar o documento contábil de amortização no módulo SAP FI, com memória de cálculo auditável.',
      objective: 'Concluir o ciclo contábil com lançamento fidedigno e rastreável.',
      relatedStageId: 'ms-4',
      actor: 'Sistema (automático)',
      inputs: ['Lançamento aprovado', 'Dados de cálculo linear de amortização'],
      expectedOutput: 'Documento contábil registrado no SAP FI + protocolo de fechamento.',
      exceptions: ['Período contábil fechado no SAP', 'Erro de integração com módulo FI'],
      acceptanceCriteria: [
        'Dado um lançamento aprovado, o documento contábil deve ser registrado no SAP FI em até 2 minutos.',
        'O protocolo de fechamento deve conter: número do documento, data, valor, conta e responsável pela aprovação.',
      ],
      relatedRNIds: ['RN-006'],
      relatedGapIds: ['GAP-004'],
      validationStatus: 'pending_gap',
      changeHistory: [],
    },
  ],

  businessRules: [
    {
      id: 'RN-001',
      title: 'Validação de formato fiscal',
      statement: 'Toda fatura recebida deve ser validada quanto ao formato fiscal antes de ser catalogada.',
      condition: 'Quando o sistema receber um documento para importação.',
      expectedBehavior: 'Documentos em NF-e (XML) e PDF estruturado são aceitos automaticamente. Documentos em outros formatos são rejeitados com mensagem de erro.',
      exceptions: ['Fornecedores internacionais que emitem Invoice em formato proprietário (tratamento manual)'],
      relatedStageId: 'ms-1',
      relatedRFIds: ['RF-001'],
      relatedGapIds: ['GAP-001'],
      acceptanceCriteria: [
        'Dado um XML válido com schema SEFAZ, o sistema aceita automaticamente.',
        'Dado um PDF sem OCR legível, o sistema rejeita com código de erro "FMT-002".',
      ],
      status: 'pending_gap',
      changeHistory: [],
    },
    {
      id: 'RN-002',
      title: 'Regra de conciliação fatura-PO',
      statement: 'Toda fatura deve ser conciliada com um pedido de compra (PO) antes de avançar para classificação contábil.',
      condition: 'Quando a fatura é processada na etapa de cruzamento.',
      expectedBehavior: 'Bloquear toda divergência de valor entre fatura e PO até definição de tolerância.',
      exceptions: ['Ordens de compra do tipo "Blanket PO" permitem múltiplas faturas parciais'],
      relatedStageId: 'ms-2',
      relatedRFIds: ['RF-003'],
      relatedGapIds: ['GAP-002'],
      acceptanceCriteria: [
        'Dado uma fatura cujo valor coincide exatamente com a PO, o sistema deve conciliar automaticamente.',
        'Dado uma divergência de valor, o sistema deve bloquear e sinalizar para análise.',
      ],
      status: 'pending_gap',
      changeHistory: [],
    },
    {
      id: 'RN-003',
      title: 'Classificação conforme plano de contas',
      statement: 'A conta contábil de despesa antecipada deve seguir o plano de contas vigente na data da competência.',
      condition: 'Quando a classificação contábil é verificada.',
      expectedBehavior: 'O sistema compara a conta informada na PO com o plano de contas vigente e alerta em caso de divergência.',
      exceptions: ['Contas provisórias criadas para novos contratos ainda em fase de regularização'],
      relatedStageId: 'ms-2',
      relatedRFIds: ['RF-004'],
      relatedGapIds: [],
      acceptanceCriteria: [
        'Dado uma conta contábil ativa, o sistema deve aceitar sem alerta.',
        'Dado uma conta bloqueada ou inexistente, o sistema deve impedir o avanço.',
      ],
      status: 'confirmed',
      changeHistory: [],
    },
    {
      id: 'RN-004',
      title: 'Tratamento de exceções — faturas sem PO',
      statement: 'Toda fatura sem PO correspondente deve ser retida e encaminhada para a Gestão de Contratos.',
      condition: 'Quando a conciliação não encontra PO correspondente.',
      expectedBehavior: 'Toda fatura sem PO deve ser retida até regularização.',
      exceptions: ['Serviços de emergência (incidentes críticos) podem ter PO retroativa aprovada em 48h'],
      relatedStageId: 'ms-3',
      relatedRFIds: ['RF-005'],
      relatedGapIds: ['GAP-003'],
      acceptanceCriteria: [
        'Dado uma fatura sem PO, o sistema deve gerar registro de exceção em até 1 minuto.',
        'O registro deve ser visível na fila de exceções da Gestão de Contratos.',
      ],
      status: 'pending_gap',
      changeHistory: [],
    },
    {
      id: 'RN-005',
      title: 'Regra de alçada de aprovação',
      statement: 'A aprovação de lançamentos de amortização deve seguir a alçada definida pela diretoria financeira.',
      condition: 'Quando um lançamento é submetido para aprovação.',
      expectedBehavior: 'Aprovação pelo coordenador financeiro.',
      exceptions: ['Em caso de ausência do aprovador, o substituto formal pode aprovar'],
      relatedStageId: 'ms-4',
      relatedRFIds: ['RF-006'],
      relatedGapIds: ['GAP-004'],
      acceptanceCriteria: [
        'Nenhum lançamento pode ser efetivado sem aprovação registrada.',
        'O sistema deve manter log de todas as aprovações com nome, data e hora.',
      ],
      status: 'pending_gap',
      changeHistory: [],
    },
    {
      id: 'RN-006',
      title: 'Protocolo de fechamento contábil',
      statement: 'Todo lançamento contábil deve gerar um protocolo de fechamento assinado digitalmente.',
      condition: 'Quando o lançamento é registrado no SAP FI.',
      expectedBehavior: 'O sistema gera automaticamente um protocolo contendo: número do documento, valor, contas debitada/creditada, e responsável pela aprovação.',
      exceptions: ['Lançamentos de estorno seguem protocolo simplificado'],
      relatedStageId: 'ms-4',
      relatedRFIds: ['RF-007'],
      relatedGapIds: ['GAP-004'],
      acceptanceCriteria: [
        'O protocolo deve ser gerado em até 5 minutos após o registro no SAP.',
        'O protocolo deve ser armazenado por no mínimo 5 anos conforme legislação vigente.',
      ],
      status: 'pending_gap',
      changeHistory: [],
    },
  ],
};

export const cadastroContaBancariaSpecData: ContextSpecData = {
  processId: 'proc-cadastro-conta-bancaria',
  processName: 'Cadastro de Conta Bancária',

  specification: {
    status: 'in_validation',
    version: 'v1.0',
    lastUpdatedBy: 'Master Data / FIN',
    lastUpdatedAt: 'Hoje, às 10:35',
  },

  macroStages: [
    {
      id: 'ms-1',
      order: 1,
      name: 'Receber e Conferir Solicitação',
      description: 'Receber o e-mail do Master Data e validar os dados obrigatórios',
      rfIds: ["RF-001", "RF-002", "RF-003"],
      rnIds: ["RN-001"],
      gapIds: ["GAP-003", "GAP-005", "GAP-007"],
      hasHumanDecision: true,
      hasExceptions: true,
    },
    {
      id: 'ms-2',
      order: 2,
      name: 'Consultar Banco no SAP',
      description: 'Pesquisar o Bank Key na transação Manage Banks',
      rfIds: ["RF-004"],
      rnIds: ["RN-002"],
      gapIds: [],
      hasHumanDecision: false,
      hasExceptions: false,
    },
    {
      id: 'ms-3',
      order: 3,
      name: 'Cadastrar Banco no SAP',
      description: 'Preencher os campos conforme as regras e salvar',
      rfIds: ["RF-006", "RF-007", "RF-008"],
      rnIds: ["RN-003", "RN-004", "RN-005", "RN-006", "RN-007", "RN-008", "RN-009"],
      gapIds: ["GAP-001", "GAP-002", "GAP-004"],
      hasHumanDecision: true,
      hasExceptions: true,
    },
    {
      id: 'ms-4',
      order: 4,
      name: 'Responder Solicitante',
      description: 'Retornar ao Master Data com evidência (print)',
      rfIds: ["RF-005", "RF-009"],
      rnIds: ["RN-010"],
      gapIds: ["GAP-006", "GAP-008"],
      hasHumanDecision: false,
      hasExceptions: false,
    }
  ],

  gaps: [
    {
        "id": "GAP-001",
        "title": "Escopo do processo: banco ou conta da empresa?",
        "question": "O processo deve cobrir apenas o cadastro do banco/agência (Bank Key) ou também o House Bank, a conta corrente (Account ID) e o vínculo com a conta do razão (G/L)?",
        "explanation": "O objetivo do POP cita House Bank, Account ID e G/L Account, mas o procedimento descreve apenas a criação do Bank Key na transação Manage Banks.",
        "whyNeeded": "Define o escopo da automação. Incluir House Bank e G/L adiciona etapas, campos e possivelmente aprovação contábil.",
        "impact": "high",
        "affectedRFIds": [
            "RF-007"
        ],
        "affectedRNIds": [
            "RN-004"
        ],
        "relatedStageId": "ms-3",
        "suggestedResponsible": "Coordenação Financeira (FIN)",
        "status": "open",
        "responseOptions": [
            "Apenas cadastro do banco/agência (Bank Key)",
            "Bank Key + House Bank + Account ID",
            "Bank Key + House Bank + Account ID + vínculo G/L",
            "Outro",
            "Resposta livre",
            "Não sei responder",
            "Não se aplica"
        ],
        "responseHistory": [],
        "impactPreview": [],
        "updatedAt": "Hoje, 09:20"
    },
    {
        "id": "GAP-002",
        "title": "Composição do Bank Key",
        "question": "O Bank Key é composto por código do banco + agência ou por código do banco + número da conta?",
        "explanation": "O passo 5.2.3 indica código do banco + agência (ex.: 033 + agência). O passo 8.3.3 indica código do banco + número da conta usada nos pagamentos.",
        "whyNeeded": "O Bank Key é a chave de busca de duplicidade e de criação. Uma regra errada gera cadastros duplicados ou buscas sem resultado.",
        "impact": "high",
        "affectedRFIds": [
            "RF-004",
            "RF-007"
        ],
        "affectedRNIds": [
            "RN-004"
        ],
        "relatedStageId": "ms-3",
        "suggestedResponsible": "Equipe de Cadastro (Operador SAP)",
        "status": "open",
        "responseOptions": [
            "Código do banco (3 dígitos) + agência",
            "Código do banco (3 dígitos) + número da conta",
            "Usar exatamente o valor enviado pelo Master Data, sem montar",
            "Outro",
            "Resposta livre",
            "Não sei responder",
            "Não se aplica"
        ],
        "responseHistory": [],
        "impactPreview": [],
        "updatedAt": "Hoje, 09:20"
    },
    {
        "id": "GAP-003",
        "title": "Tratamento de solicitação incompleta",
        "question": "O que fazer quando o e-mail não traz banco, código do banco ou agência?",
        "explanation": "O POP lista banco, código, agência e endereço como entradas obrigatórias, mas não define a ação quando faltam. Além disso, o endereço é tratado como opcional no cadastro.",
        "whyNeeded": "Sem essa regra, o sistema não sabe se devolve, completa por busca pública ou segue parcialmente.",
        "impact": "high",
        "affectedRFIds": [
            "RF-003"
        ],
        "affectedRNIds": [
            "RN-001"
        ],
        "relatedStageId": "ms-1",
        "suggestedResponsible": "Master Data",
        "status": "open",
        "responseOptions": [
            "Devolver ao solicitante pedindo os dados faltantes e pausar o caso",
            "Completar automaticamente via fonte pública (código e nome) e devolver só se faltar agência",
            "Encaminhar para tratamento manual do operador",
            "Outro",
            "Resposta livre",
            "Não sei responder",
            "Não se aplica"
        ],
        "responseHistory": [],
        "impactPreview": [],
        "updatedAt": "Hoje, 09:20"
    },
    {
        "id": "GAP-004",
        "title": "Conteúdo do campo Bank Branch",
        "question": "O campo Bank Branch deve receber o número da agência ou o número da conta?",
        "explanation": "Durante a demonstração, a explicação oscilou entre agência e conta. O passo 8.3.1 cita agência (ex.: 1893).",
        "whyNeeded": "Define o mapeamento do dado de entrada para o campo SAP.",
        "impact": "medium",
        "affectedRFIds": [
            "RF-007"
        ],
        "affectedRNIds": [],
        "relatedStageId": "ms-3",
        "suggestedResponsible": "Equipe de Cadastro (Operador SAP)",
        "status": "awaiting_response",
        "responseOptions": [
            "Número da agência",
            "Número da agência com dígito verificador",
            "Número da conta",
            "Outro",
            "Resposta livre",
            "Não sei responder",
            "Não se aplica"
        ],
        "responseHistory": [],
        "impactPreview": [],
        "updatedAt": "Hoje, 09:20"
    },
    {
        "id": "GAP-005",
        "title": "Bancos fora do Brasil",
        "question": "Como tratar uma solicitação de banco de outro país?",
        "explanation": "A executora nunca recebeu esse tipo de solicitação e supõe que outras localidades fazem o próprio cadastro. A regra não foi confirmada.",
        "whyNeeded": "Define a regra de elegibilidade e o uso do campo Swift.",
        "impact": "medium",
        "affectedRFIds": [
            "RF-003"
        ],
        "affectedRNIds": [
            "RN-003"
        ],
        "relatedStageId": "ms-1",
        "suggestedResponsible": "Coordenação Financeira (FIN)",
        "status": "open",
        "responseOptions": [
            "Rejeitar e orientar o solicitante a procurar a localidade responsável",
            "Encaminhar automaticamente para a localidade responsável",
            "Cadastrar preenchendo o Swift",
            "Outro",
            "Resposta livre",
            "Não sei responder",
            "Não se aplica"
        ],
        "responseHistory": [],
        "impactPreview": [],
        "updatedAt": "Hoje, 09:20"
    },
    {
        "id": "GAP-006",
        "title": "Quantidade de usuários da conta na resposta",
        "question": "De onde vem a \"quantidade de usuários que já utilizam essa conta\" informada quando o banco já está cadastrado?",
        "explanation": "O passo A1.2 pede essa informação na resposta, mas não indica a origem no SAP.",
        "whyNeeded": "Sem a fonte do dado, o sistema não consegue montar a resposta completa.",
        "impact": "medium",
        "affectedRFIds": [
            "RF-005"
        ],
        "affectedRNIds": [],
        "relatedStageId": "ms-4",
        "suggestedResponsible": "Equipe de Cadastro (Operador SAP)",
        "status": "open",
        "responseOptions": [
            "Consulta de parceiros/fornecedores vinculados ao Bank Key no SAP",
            "Informação dispensável — remover da resposta",
            "Outro",
            "Resposta livre",
            "Não sei responder",
            "Não se aplica"
        ],
        "responseHistory": [],
        "impactPreview": [],
        "updatedAt": "Hoje, 09:20"
    },
    {
        "id": "GAP-007",
        "title": "SLA oficial de atendimento",
        "question": "Qual é o SLA oficial para atender à solicitação?",
        "explanation": "A executora mencionou 2 dias, sem certeza. Na prática, a execução leva menos de 10 minutos.",
        "whyNeeded": "Define alertas de vencimento e o indicador de desempenho do processo.",
        "impact": "low",
        "affectedRFIds": [
            "RF-001"
        ],
        "affectedRNIds": [],
        "relatedStageId": "ms-1",
        "suggestedResponsible": "Coordenação Financeira (FIN)",
        "status": "open",
        "responseOptions": [
            "2 dias úteis",
            "1 dia útil",
            "Mesmo dia (até 4 horas úteis)",
            "Outro",
            "Resposta livre",
            "Não sei responder",
            "Não se aplica"
        ],
        "responseHistory": [],
        "impactPreview": [],
        "updatedAt": "Hoje, 09:20"
    },
    {
        "id": "GAP-008",
        "title": "Modelo padrão das respostas por e-mail",
        "question": "Existe um texto padrão para as respostas \"banco já cadastrado\", \"banco criado\" e \"banco criado sem endereço\"?",
        "explanation": "O POP não define o conteúdo das respostas nem onde fica registrada a observação de ausência de endereço.",
        "whyNeeded": "Padroniza a comunicação gerada automaticamente.",
        "impact": "low",
        "affectedRFIds": [
            "RF-005",
            "RF-009"
        ],
        "affectedRNIds": [
            "RN-010"
        ],
        "relatedStageId": "ms-4",
        "suggestedResponsible": "Master Data",
        "status": "open",
        "responseOptions": [
            "Usar um modelo sugerido pelo sistema",
            "Usar um modelo enviado pela área",
            "Outro",
            "Resposta livre",
            "Não sei responder",
            "Não se aplica"
        ],
        "responseHistory": [],
        "impactPreview": [],
        "updatedAt": "Hoje, 09:20"
    }
],
  functionalRequirements: [
    {
        "id": "RF-001",
        "title": "Receber e registrar solicitação de cadastro",
        "description": "O sistema deve monitorar a caixa de entrada de solicitações, identificar e-mails de cadastro de banco enviados pelo Master Data e registrar cada solicitação com data e hora de recebimento.",
        "objective": "Garantir rastreabilidade e controle de prazo de todas as solicitações.",
        "relatedStageId": "ms-1",
        "actor": "Master Data (solicitante)",
        "inputs": [
            "E-mail de solicitação",
            "Anexos (print de cheque ou extrato), quando houver"
        ],
        "expectedOutput": "Solicitação registrada com ID, solicitante, data e hora e status \"Recebida\".",
        "exceptions": [
            "E-mail fora do padrão ou sem relação com cadastro de banco"
        ],
        "acceptanceCriteria": [
            "Dado um e-mail de solicitação válido, o sistema registra a solicitação em até 5 minutos após o recebimento.",
            "Dado um e-mail não relacionado ao processo, o sistema não abre solicitação."
        ],
        "relatedRNIds": [
            "RN-001"
        ],
        "relatedGapIds": [
            "GAP-007"
        ],
        "validationStatus": "pending_gap",
        "changeHistory": []
    },
    {
        "id": "RF-002",
        "title": "Extrair dados da solicitação",
        "description": "O sistema deve extrair do corpo e dos anexos do e-mail: nome do banco, código do banco (Bank Number), agência, Bank Key e endereço do banco.",
        "objective": "Estruturar os dados necessários para a consulta e o cadastro no SAP.",
        "relatedStageId": "ms-1",
        "actor": "Sistema",
        "inputs": [
            "Corpo do e-mail",
            "Anexos de apoio (cheque ou extrato)"
        ],
        "expectedOutput": "Registro estruturado com os campos extraídos e o nível de confiança de cada um.",
        "exceptions": [
            "Anexo ilegível",
            "Divergência entre o corpo do e-mail e o anexo"
        ],
        "acceptanceCriteria": [
            "Dado um e-mail com todos os dados, o sistema extrai 100% dos campos obrigatórios.",
            "Dada uma divergência entre o e-mail e o anexo, o sistema sinaliza a divergência para revisão."
        ],
        "relatedRNIds": [
            "RN-001",
            "RN-005"
        ],
        "relatedGapIds": [],
        "validationStatus": "confirmed",
        "changeHistory": []
    },
    {
        "id": "RF-003",
        "title": "Validar completude e elegibilidade da solicitação",
        "description": "O sistema deve verificar se a solicitação contém os dados obrigatórios e se o banco é brasileiro antes de seguir para a consulta no SAP.",
        "objective": "Evitar cadastros incompletos ou fora do escopo.",
        "relatedStageId": "ms-1",
        "actor": "Sistema",
        "inputs": [
            "Dados extraídos (RF-002)"
        ],
        "expectedOutput": "Solicitação classificada como \"Apta\", \"Incompleta\" ou \"Fora do escopo\".",
        "exceptions": [
            "Dados obrigatórios ausentes",
            "Banco estrangeiro"
        ],
        "acceptanceCriteria": [
            "Dada uma solicitação sem agência, o sistema classifica como \"Incompleta\" e não segue para cadastro.",
            "Dada uma solicitação sem endereço, o sistema classifica como \"Apta\" (endereço não bloqueia)."
        ],
        "relatedRNIds": [
            "RN-001",
            "RN-003"
        ],
        "relatedGapIds": [
            "GAP-003",
            "GAP-005"
        ],
        "validationStatus": "pending_gap",
        "changeHistory": []
    },
    {
        "id": "RF-004",
        "title": "Consultar Bank Key no SAP",
        "description": "O sistema deve pesquisar o Bank Key informado na transação Manage Banks e identificar se o banco já está cadastrado.",
        "objective": "Evitar cadastros duplicados.",
        "relatedStageId": "ms-2",
        "actor": "Sistema (integração SAP)",
        "inputs": [
            "Bank Key da solicitação"
        ],
        "expectedOutput": "Resultado \"Já cadastrado\" (com os dados do registro) ou \"Não localizado\".",
        "exceptions": [
            "SAP indisponível"
        ],
        "acceptanceCriteria": [
            "Dado um Bank Key existente, o sistema retorna \"Já cadastrado\" e os dados do registro.",
            "Dado um Bank Key inexistente, o sistema retorna \"Não localizado\" e segue para o RF-006."
        ],
        "relatedRNIds": [
            "RN-002",
            "RN-004"
        ],
        "relatedGapIds": [
            "GAP-002"
        ],
        "validationStatus": "pending_gap",
        "changeHistory": []
    },
    {
        "id": "RF-005",
        "title": "Responder solicitação de banco já cadastrado",
        "description": "Quando o Bank Key já existir, o sistema deve responder ao solicitante informando o cadastro existente, anexando a evidência da tela do SAP e a quantidade de usuários que utilizam a conta.",
        "objective": "Encerrar rapidamente as solicitações já atendidas, que são a maioria dos casos.",
        "relatedStageId": "ms-4",
        "actor": "Sistema → Master Data",
        "inputs": [
            "Resultado da consulta (RF-004)",
            "Print da tela do SAP"
        ],
        "expectedOutput": "E-mail de resposta enviado e solicitação encerrada como \"Já cadastrado\".",
        "exceptions": [
            "Falha ao gerar a evidência"
        ],
        "acceptanceCriteria": [
            "Dado um banco já cadastrado, o sistema envia a resposta com o print anexado e encerra a solicitação."
        ],
        "relatedRNIds": [
            "RN-010"
        ],
        "relatedGapIds": [
            "GAP-006",
            "GAP-008"
        ],
        "validationStatus": "pending_gap",
        "changeHistory": []
    },
    {
        "id": "RF-006",
        "title": "Obter razão social e código do banco",
        "description": "O sistema deve obter a razão social e o código do banco a partir do documento enviado pelo solicitante ou, se não houver, de uma fonte pública de referência.",
        "objective": "Garantir que o cadastro use o nome oficial do banco, e não o nome comercial.",
        "relatedStageId": "ms-3",
        "actor": "Sistema",
        "inputs": [
            "Nome e código informados",
            "Anexo de apoio",
            "Fonte pública de bancos"
        ],
        "expectedOutput": "Razão social e código do banco com 3 dígitos.",
        "exceptions": [
            "Banco não encontrado na fonte pública (ex.: cooperativa de crédito)"
        ],
        "acceptanceCriteria": [
            "Dado \"Santander\", o sistema retorna \"Banco Santander SA\" e o código 033.",
            "Dado um anexo com o nome do banco, o sistema prioriza o nome do documento."
        ],
        "relatedRNIds": [
            "RN-005",
            "RN-006"
        ],
        "relatedGapIds": [],
        "validationStatus": "confirmed",
        "changeHistory": []
    },
    {
        "id": "RF-007",
        "title": "Preencher cadastro do banco no SAP",
        "description": "O sistema deve acionar \"Create\" na transação Manage Banks e preencher os campos conforme as regras de negócio: Bank Country, Bank Key, Bank Name, Bank Branch, Bank Category, Bank Number e endereço.",
        "objective": "Criar o cadastro padronizado do banco no SAP.",
        "relatedStageId": "ms-3",
        "actor": "Sistema (integração SAP)",
        "inputs": [
            "Dados validados (RF-003)",
            "Razão social e código (RF-006)"
        ],
        "expectedOutput": "Formulário de cadastro preenchido e pronto para gravação.",
        "exceptions": [
            "Endereço maior que 35 caracteres",
            "Endereço não informado"
        ],
        "acceptanceCriteria": [
            "Dada uma solicitação apta, todos os campos obrigatórios são preenchidos conforme as RN-003 a RN-009.",
            "Os campos Swift, Bank Group e Intraday permanecem em branco."
        ],
        "relatedRNIds": [
            "RN-003",
            "RN-004",
            "RN-005",
            "RN-006",
            "RN-007",
            "RN-008",
            "RN-009"
        ],
        "relatedGapIds": [
            "GAP-001",
            "GAP-002",
            "GAP-004"
        ],
        "validationStatus": "pending_gap",
        "changeHistory": []
    },
    {
        "id": "RF-008",
        "title": "Gravar cadastro e tratar duplicidade",
        "description": "O sistema deve salvar o cadastro no SAP e tratar o alerta de banco já existente, caso seja exibido no momento da gravação.",
        "objective": "Garantir que o cadastro foi efetivado ou corretamente identificado como duplicado.",
        "relatedStageId": "ms-3",
        "actor": "Sistema (integração SAP)",
        "inputs": [
            "Formulário preenchido (RF-007)"
        ],
        "expectedOutput": "Cadastro gravado com sucesso ou caso redirecionado para o RF-005.",
        "exceptions": [
            "SAP exibe alerta de banco já existente",
            "Erro de gravação"
        ],
        "acceptanceCriteria": [
            "Dada uma gravação bem-sucedida, o sistema captura a tela final do cadastro.",
            "Dado um alerta de banco existente, o sistema não cria um novo registro e segue para o RF-005."
        ],
        "relatedRNIds": [
            "RN-002"
        ],
        "relatedGapIds": [],
        "validationStatus": "confirmed",
        "changeHistory": []
    },
    {
        "id": "RF-009",
        "title": "Responder solicitante com evidência do cadastro",
        "description": "O sistema deve responder ao e-mail do solicitante com o print da tela final e os dados do banco cadastrado, incluindo a observação \"banco cadastrado sem informações de endereço\" quando aplicável.",
        "objective": "Fechar o ciclo com o Master Data e deixar evidência do cadastro.",
        "relatedStageId": "ms-4",
        "actor": "Sistema → Master Data",
        "inputs": [
            "Print da tela final (RF-008)",
            "Dados do cadastro"
        ],
        "expectedOutput": "E-mail de confirmação enviado e solicitação encerrada como \"Cadastrado\".",
        "exceptions": [
            "Falha no envio do e-mail"
        ],
        "acceptanceCriteria": [
            "Dado um cadastro sem endereço, a resposta contém a observação de ausência de endereço.",
            "Toda resposta contém o print anexado."
        ],
        "relatedRNIds": [
            "RN-009",
            "RN-010"
        ],
        "relatedGapIds": [
            "GAP-008"
        ],
        "validationStatus": "pending_gap",
        "changeHistory": []
    }
],
  businessRules: [
    {
        "id": "RN-001",
        "title": "Dados obrigatórios da solicitação",
        "statement": "Toda solicitação deve conter banco, código do banco e agência para seguir para o cadastro.",
        "condition": "Quando o sistema receber uma solicitação de cadastro.",
        "expectedBehavior": "Solicitações completas seguem para consulta. Solicitações incompletas são tratadas conforme a definição do GAP-003.",
        "exceptions": [
            "Endereço do banco: esperado, mas não bloqueia o cadastro (RN-009)",
            "Print de cheque ou extrato: opcional, usado apenas como apoio"
        ],
        "relatedStageId": "ms-1",
        "relatedRFIds": [
            "RF-002",
            "RF-003"
        ],
        "relatedGapIds": [
            "GAP-003"
        ],
        "acceptanceCriteria": [
            "Dada uma solicitação sem código do banco, o sistema não segue para cadastro."
        ],
        "status": "pending_gap",
        "changeHistory": []
    },
    {
        "id": "RN-002",
        "title": "Consulta prévia obrigatória",
        "statement": "Nenhum banco pode ser criado sem antes consultar o Bank Key na transação Manage Banks.",
        "condition": "Antes de qualquer criação de cadastro.",
        "expectedBehavior": "Se o Bank Key existir, o caso segue para a resposta \"já cadastrado\". Se não existir, segue para a criação.",
        "exceptions": [
            "Alerta de duplicidade na gravação, tratado no RF-008"
        ],
        "relatedStageId": "ms-2",
        "relatedRFIds": [
            "RF-004",
            "RF-008"
        ],
        "relatedGapIds": [],
        "acceptanceCriteria": [
            "Nenhuma criação ocorre sem registro de consulta prévia."
        ],
        "status": "confirmed",
        "changeHistory": []
    },
    {
        "id": "RN-003",
        "title": "País do banco",
        "statement": "O campo Bank Country deve ser sempre preenchido com BR (Brasil).",
        "condition": "Em todo cadastro de banco.",
        "expectedBehavior": "O sistema preenche BR automaticamente. Bancos estrangeiros são tratados conforme o GAP-005.",
        "exceptions": [
            "Solicitação de banco estrangeiro"
        ],
        "relatedStageId": "ms-3",
        "relatedRFIds": [
            "RF-003",
            "RF-007"
        ],
        "relatedGapIds": [
            "GAP-005"
        ],
        "acceptanceCriteria": [
            "Todo cadastro criado possui Bank Country = BR."
        ],
        "status": "pending_gap",
        "changeHistory": []
    },
    {
        "id": "RN-004",
        "title": "Composição do Bank Key",
        "statement": "O Bank Key deve começar com o código do banco (3 dígitos), seguido da agência ou da conta, conforme a definição do GAP-002.",
        "condition": "Na consulta e na criação do cadastro.",
        "expectedBehavior": "O sistema valida se o Bank Key informado segue a composição padrão antes de consultar ou criar.",
        "exceptions": [
            "Bank Key enviado fora do padrão"
        ],
        "relatedStageId": "ms-3",
        "relatedRFIds": [
            "RF-004",
            "RF-007"
        ],
        "relatedGapIds": [
            "GAP-001",
            "GAP-002"
        ],
        "acceptanceCriteria": [
            "Dado o Santander, agência 1893, o Bank Key começa com 033."
        ],
        "status": "pending_gap",
        "changeHistory": []
    },
    {
        "id": "RN-005",
        "title": "Nome do banco pela razão social",
        "statement": "O Bank Name deve conter a razão social do banco, e não o nome comercial.",
        "condition": "No preenchimento do campo Bank Name.",
        "expectedBehavior": "Se houver documento de apoio, o sistema usa o nome exatamente como consta nele. Caso contrário, usa a razão social da fonte pública.",
        "exceptions": [
            "Cooperativas de crédito: usar o nome do documento enviado"
        ],
        "relatedStageId": "ms-3",
        "relatedRFIds": [
            "RF-002",
            "RF-006",
            "RF-007"
        ],
        "relatedGapIds": [],
        "acceptanceCriteria": [
            "\"Santander\" nunca é gravado sozinho; o cadastro recebe \"Banco Santander SA\"."
        ],
        "status": "confirmed",
        "changeHistory": []
    },
    {
        "id": "RN-006",
        "title": "Código do banco com 3 dígitos",
        "statement": "O Bank Number deve ter sempre 3 dígitos, completados com zeros à esquerda.",
        "condition": "No preenchimento do Bank Number e na composição do Bank Key.",
        "expectedBehavior": "O sistema normaliza o código automaticamente (33 → 033; 1 → 001).",
        "exceptions": [],
        "relatedStageId": "ms-3",
        "relatedRFIds": [
            "RF-006",
            "RF-007"
        ],
        "relatedGapIds": [],
        "acceptanceCriteria": [
            "Dado o código 33, o sistema grava 033.",
            "Dado o código 133 (Cresol), o sistema grava 133."
        ],
        "status": "confirmed",
        "changeHistory": []
    },
    {
        "id": "RN-007",
        "title": "Categoria do banco",
        "statement": "O campo Bank Category deve ser sempre \"Standard Bank\", sem exceção.",
        "condition": "Em todo cadastro de banco.",
        "expectedBehavior": "O sistema preenche o valor fixo, sem edição.",
        "exceptions": [],
        "relatedStageId": "ms-3",
        "relatedRFIds": [
            "RF-007"
        ],
        "relatedGapIds": [],
        "acceptanceCriteria": [
            "Todo cadastro criado possui Bank Category = Standard Bank."
        ],
        "status": "confirmed",
        "changeHistory": []
    },
    {
        "id": "RN-008",
        "title": "Campos que não devem ser preenchidos",
        "statement": "Os campos Swift, Bank Group e Intraday devem permanecer em branco.",
        "condition": "Em todo cadastro de banco nacional.",
        "expectedBehavior": "O sistema não preenche esses campos. O Swift é usado apenas para transferências a bancos no exterior.",
        "exceptions": [
            "Banco estrangeiro (ver GAP-005)"
        ],
        "relatedStageId": "ms-3",
        "relatedRFIds": [
            "RF-007"
        ],
        "relatedGapIds": [],
        "acceptanceCriteria": [
            "Nenhum cadastro nacional é gravado com Swift, Bank Group ou Intraday preenchidos."
        ],
        "status": "confirmed",
        "changeHistory": []
    },
    {
        "id": "RN-009",
        "title": "Endereço do banco",
        "statement": "O endereço é opcional. Quando informado, o campo de rua deve conter rua/avenida, número e bairro em até 35 caracteres.",
        "condition": "No preenchimento dos campos de endereço (cidade, região/estado e rua).",
        "expectedBehavior": "Com endereço, o sistema preenche cidade, região e rua, abreviando se necessário. Sem endereço, cadastra sem esses campos e registra a observação para a resposta.",
        "exceptions": [
            "Endereço que não cabe em 35 caracteres, mesmo abreviado: encaminhar para revisão"
        ],
        "relatedStageId": "ms-3",
        "relatedRFIds": [
            "RF-007",
            "RF-009"
        ],
        "relatedGapIds": [],
        "acceptanceCriteria": [
            "Nenhum campo de rua é gravado com mais de 35 caracteres.",
            "Dado um cadastro sem endereço, a resposta contém a observação correspondente."
        ],
        "status": "confirmed",
        "changeHistory": []
    },
    {
        "id": "RN-010",
        "title": "Evidência obrigatória na resposta",
        "statement": "Toda resposta ao solicitante deve conter o print da tela do SAP com os dados do banco.",
        "condition": "No encerramento da solicitação (banco já cadastrado ou criado).",
        "expectedBehavior": "O sistema anexa a evidência e usa o modelo de resposta definido no GAP-008.",
        "exceptions": [
            "Falha na captura da tela: reter o envio e sinalizar o caso"
        ],
        "relatedStageId": "ms-4",
        "relatedRFIds": [
            "RF-005",
            "RF-009"
        ],
        "relatedGapIds": [
            "GAP-008"
        ],
        "acceptanceCriteria": [
            "Nenhuma solicitação é encerrada sem evidência anexada."
        ],
        "status": "pending_gap",
        "changeHistory": []
    }
]
};


export function getContextSpecData(processId: string, processName?: string): ContextSpecData {
  if (processId === 'proc-cadastro-conta-bancaria') {
    return {
      ...cadastroContaBancariaSpecData,
      processId,
      processName: processName || cadastroContaBancariaSpecData.processName,
    };
  }

  if (processId === 'local-seed-0' || processId === 'demo' || !processId) {
    return {
      ...itAmortizationSpecData,
      processId: processId || 'local-seed-0',
      processName: processName || itAmortizationSpecData.processName,
    };
  }

  return {
    ...itAmortizationSpecData,
    processId,
    processName: processName || 'Processo Operacional',
  };
}
