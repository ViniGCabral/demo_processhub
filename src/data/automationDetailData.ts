import { ProcessAutomationDetailData } from "@/types/automationDetailTypes";

export const specialHandlingAutomationData: ProcessAutomationDetailData = {
  processId: "special-handling",
  processName: "Processamento de Faturas Secundárias (P66)",
  sopCode: "P66_L6DTP",
  sopTitle: "Faturas Secundárias e Rebill",
  summaryText: "Dataset de avaliação do Processamento de Faturas Secundárias e Rebill de Crédito/Débito. Avaliação ponta a ponta com 31 passos operacionais principais extraídos da SOP.",
  volumetrySummary: "31 atividades principais identificadas na SOP, englobando intake, rotinas de SAP GUI, VIM e aprovações manuais.",
  macroBlocks: [
    {
      id: "intake",
      order: 1,
      name: "Intake",
      description: "receber, coletar, extrair e preparar dados/documentos",
      objective: "receber, coletar, extrair e preparar dados/documentos",
      stepCount: 3,
      contextCards: [
        "Fatura recebida",
        "Documentos de suporte e anexos",
        "Nomination Key",
      ],
    },
    {
      id: "routing",
      order: 2,
      name: "Routing",
      description: "classificar, priorizar e encaminhar para a fila ou responsável",
      objective: "classificar, priorizar e encaminhar para a fila ou responsável",
      stepCount: 4,
      contextCards: [
        "Trip / Non-Trip → tipo de processamento",
        "Fornecedor / categoria → fila específica",
        "Company Code, GL, Profit Center → codificação",
        "Scheduler / Gina → alçada de aprovação",
      ],
    },
    {
      id: "execution",
      order: 3,
      name: "Execution",
      description: "consultar, atualizar, criar, reconciliar ou executar transações",
      objective: "consultar, atualizar, criar, reconciliar ou executar transações",
      stepCount: 20,
      contextCards: [
        "Validar, reconciliar e processar faturas",
        "Criar ou atualizar VBDs e documentos financeiros",
        "Executar lançamentos nos sistemas corporativos",
      ],
    },
    {
      id: "exception",
      order: 4,
      name: "Exception",
      description: "tratar divergências, faltas, ambiguidades, bloqueios e aprovações",
      objective: "tratar divergências, faltas, ambiguidades, bloqueios e aprovações",
      stepCount: 3,
      contextCards: [
        "Documento ausente → Analista / Scheduler",
        "Material incorreto → MDG",
        "Divergência financeira → Supervisor / Contabilidade",
        "Fatura revisada → Correção por crédito",
      ],
    },
    {
      id: "codification",
      order: 5,
      name: "Codification",
      description: "preservar evidências, registrar resultados e preparar trilha de auditoria",
      objective: "preservar evidências, registrar resultados e preparar trilha de auditoria",
      stepCount: 1,
      contextCards: [
        "Fatura processada e postada",
        "VBD criado ou atualizado",
        "Credit Memo / Debit Memo emitido",
        "Relatório intercompany e trilha de auditoria",
      ],
    },
  ],
  solutions: [
  ],
  steps: [
    {
      id: "step_01",
      sourceStep: "1",
      number: "01",
      title: "Recebimento de fatura e upload manual em OAWD Executar o upload manual de uma fatura de Secondary Cost no SAP usando a transa\u00e7\u00e3o OAWD a partir da soli",
      description: "Executar o upload manual de uma fatura de Secondary Cost no SAP usando a transa\u00e7\u00e3o OAWD a partir da solicita\u00e7\u00e3o recebida no generic mailbox; confirmar que a fatura foi carregada no VIM Workspace para posterior processamento.",
      classification: "ME",
      classifications: ["ME"],
      macroBlockId: "intake",
      macroBlockName: "Intake",
      capabilityId: "cap-auto",
      capabilityName: "Capability Automática",
      solutionId: "sol-rpa-upload-vim",
      solutionIds: ["sol-rpa-upload-vim"],
      technologyType: "RPA",
      rationale: "O upload segue uma sequ\u00eancia est\u00e1vel em mailbox, arquivo local e OAWD; RPA \u00e9 uma proposta sujeita \u00e0 valida\u00e7\u00e3o do ambiente SAP.",
      effort: {
        level: "medium",
        score: 50,
        confidence: "medium",
        drivers: [],
        unknowns: []
      },
      humanInTheLoop: {
        hasHumanControl: true,
        level: "partial",
        description: "`review_required` \u2014 revis\u00e3o humana permanece necess\u00e1ria para dados, exce\u00e7\u00f5es, aprova\u00e7\u00f5es e/ou transa\u00e7\u00f5es financeiras."
      },
      substeps: [
        {
          id: "step_01_1.1",
          sourceRef: "1.1",
          description: "Abrir o generic mailbox que cont\u00e9m a solicita\u00e7\u00e3o de upload. Confirmar que a mensagem inclui o(s) documento(s) de suporte da fatura e salvar o anexo em local acess\u00edvel para o usu\u00e1rio (por exemplo, pasta de trabalhos do usu\u00e1rio ou rede compartilhada). Documento de suporte obrigat\u00f3rio no e-mail de solicita\u00e7\u00e3o: A solicita\u00e7\u00e3o de upload deve incluir o(s) documento(s) de suporte da fatura (anexo).",
          classification: "MS"
        },
        {
          id: "step_01_1.2",
          sourceRef: "1.2",
          description: "Abrir o cliente SAP. Executar a transa\u00e7\u00e3o OAWD para entrar na tela de Upload de Invoice ao workflow VIM.",
          classification: "ME"
        },
        {
          id: "step_01_1.3",
          sourceRef: "1.3",
          description: "Na tela da transa\u00e7\u00e3o OAWD navegar at\u00e9 a op\u00e7\u00e3o de menu P66 Incoming VIM Invoice \u2013 HVC Non-PO e, a partir da\u00ed, selecionar o sub-menu 'VIM Invoice Upload for NPO Manual'. Selecionar o menu correto no OAWD: No OAWD selecionar 'P66 Incoming VIM Invoice \u2013 HVC Non-PO' e o sub-menu 'VIM Invoice Upload for NPO Manual' quando o procedimento padr\u00e3o de upload for aplic\u00e1vel.",
          classification: "ME"
        },
        {
          id: "step_01_1.4",
          sourceRef: "1.4",
          description: "Quando o pop-up 'Storing for subsequent entry' abrir, efetuar o upload do arquivo salvo contendo a fatura.",
          classification: "ME"
        },
        {
          id: "step_01_1.4.1",
          sourceRef: "1.4.1",
          description: "Na janela de 'Storing for subsequent entry' selecionar a marca de confirma\u00e7\u00e3o (green tick) para acionar o processo de upload. Navegar at\u00e9 o local onde o arquivo da fatura foi salvo, selecionar o arquivo e confirmar para completar o upload.",
          classification: "ME"
        },
        {
          id: "step_01_1.5",
          sourceRef: "1.5",
          description: "Ap\u00f3s o upload, confirmar que a fatura aparece no VIM Workspace. Se a fatura estiver vis\u00edvel, encerrar este procedimento de upload \u2014 estado final: 'Fatura refletida no VIM Workspace' e encaminhar para o processamento (processamento da fatura manual ocorre em se\u00e7\u00e3o/processo subsequente).",
          classification: "MS"
        },
      ]
    },
    {
      id: "step_02",
      sourceStep: "2",
      number: "02",
      title: "Navega\u00e7\u00e3o e Uso do VIM Workplace (S/4 VIM) \u2014 Acesso, Visualiza\u00e7\u00e3o e A\u00e7\u00f5es B\u00e1sicas Procedimento operacional para acessar o VIM Workplace, visualizar in",
      description: "Procedimento operacional para acessar o VIM Workplace, visualizar informa\u00e7\u00f5es do \u00edndice e imagens, revisar e atuar sobre faturas (visualiza\u00e7\u00e3o, coment\u00e1rios, arquivo de imagem, simula\u00e7\u00e3o de regras, marca\u00e7\u00f5es de obsoleto, reatribui\u00e7\u00e3o e tratamento de Document Type cr\u00e9dito).",
      classification: "ME",
      classifications: ["ME", "MS"],
      macroBlockId: "intake",
      macroBlockName: "Intake",
      capabilityId: "cap-auto",
      capabilityName: "Capability Automática",
      solutionId: "sol-rpa-report",
      solutionIds: ["sol-rpa-report"],
      technologyType: "Workflow",
      rationale: "Workflow pode organizar revis\u00e3o, coment\u00e1rios, filtros e encaminhamentos; os fluxos exatos de reatribui\u00e7\u00e3o ainda precisam ser validados.",
      effort: {
        level: "medium",
        score: 50,
        confidence: "medium",
        drivers: [],
        unknowns: []
      },
      humanInTheLoop: {
        hasHumanControl: true,
        level: "partial",
        description: "`review_required` \u2014 revis\u00e3o humana permanece necess\u00e1ria para dados, exce\u00e7\u00f5es, aprova\u00e7\u00f5es e/ou transa\u00e7\u00f5es financeiras."
      },
      substeps: [
        {
          id: "step_02_2.1",
          sourceRef: "2.1",
          description: "Abrir o sistema SAP e navegar para a transa\u00e7\u00e3o do VIM Workplace.",
          classification: "ME"
        },
        {
          id: "step_02_2.1.1",
          sourceRef: "2.1.1",
          description: "No SAP, executar a transa\u00e7\u00e3o /OPT/VTM_WP para abrir o VIM Workplace e aguardar carregamento do \u00edndice (inbox).",
          classification: "ME"
        },
        {
          id: "step_02_2.2",
          sourceRef: "2.2",
          description: "Confirmar os campos-chave apresentados no \u00edndice do VIM Workplace para identifica\u00e7\u00e3o r\u00e1pida das faturas.",
          classification: "ME"
        },
        {
          id: "step_02_2.2.1",
          sourceRef: "2.2.1",
          description: "Verificar que a lista (inbox) mostra, quando presentes, os seguintes campos: Requisition No, Reference No, Vendor No, Credit Memo, Document Start date, Document End date, Baseline Date, Current Role, Current Agent e Gross Amount.",
          classification: "ME"
        },
        {
          id: "step_02_2.3",
          sourceRef: "2.3",
          description: "Abrir um line-item do \u00edndice para inspecionar a imagem da fatura associada.",
          classification: "ME"
        },
        {
          id: "step_02_2.3.1",
          sourceRef: "2.3.1",
          description: "Na lista (inbox), clicar sobre a linha (line-item) da fatura desejada; confirmar que o painel de imagens/painel de visualiza\u00e7\u00e3o \u00e9 carregado exibindo a(s) imagem(ns) da fatura.",
          classification: "ME"
        },
        {
          id: "step_02_2.4",
          sourceRef: "2.4",
          description: "Localizar e revisar os dados de line items apresentados para a fatura selecionada.",
          classification: "ME"
        },
        {
          id: "step_02_2.4.1",
          sourceRef: "2.4.1",
          description: "No detalhe do documento, revisar a se\u00e7\u00e3o de 'Line items' para validar quantidades, valores e demais linhas de custo presentes.",
          classification: "ME"
        },
        {
          id: "step_02_2.5",
          sourceRef: "2.5",
          description: "Visualizar o hist\u00f3rico de processamento da fatura para acompanhar eventos anteriores.",
          classification: "ME"
        },
        {
          id: "step_02_2.5.1",
          sourceRef: "2.5.1",
          description: "No detalhe da fatura, abrir a aba ou \u00e1rea 'Process History' e revisar os registros de a\u00e7\u00f5es j\u00e1 executadas (datas, agentes e status apresentados).",
          classification: "ME"
        },
        {
          id: "step_02_2.6",
          sourceRef: "2.6",
          description: "Confirmar que a lista mostra as faturas atribu\u00eddas ao agente corrente e identificar desvios (faturas n\u00e3o relacionadas a Secondary cost). Exception \u2014 Faturas n\u00e3o relacionadas exibidas por glitch na tabela: Condi\u00e7\u00e3o: O inbox exibe faturas que n\u00e3o pertencem ao escopo de Secondary cost devido a tabela desorganizada ou erro de filtragem.. A\u00e7\u00f5es: Selecionar as faturas n\u00e3o relacionadas exibidas.; Iniciar a a\u00e7\u00e3o de reatribui\u00e7\u00e3o para o agente/categoria correta.; Salvar a reatribui\u00e7\u00e3o e confirmar que a fatura n\u00e3o pertence mais ao seu inbox ap\u00f3s atualiza\u00e7\u00e3o subsequente.. Resultado: 2.6 \u00b7 Confirmar que a lista mostra as faturas atribu\u00eddas ao agente corrente e identificar desvios (faturas n\u00e3o relacionadas a Secondary cost). Unknown \u2014 Localiza\u00e7\u00e3o/fluxo exato de reatribui\u00e7\u00e3o na interface: Determinar o bot\u00e3o/fluxo exato (nome do bot\u00e3o/menu) para executar a reatribui\u00e7\u00e3o de faturas na interface do VIM Workplace, quando aplic\u00e1vel.",
          classification: "ME"
        },
        {
          id: "step_02_2.6.1",
          sourceRef: "2.6.1",
          description: "No topo do inbox, filtrar ou ordenar se necess\u00e1rio para ver apenas as faturas atribu\u00eddas ao Current Agent; confirmar que as faturas vis\u00edveis correspondem ao escopo de Secondary cost.",
          classification: "MA"
        },
        {
          id: "step_02_2.6.2",
          sourceRef: "2.6.2",
          description: "Quando forem exibidas faturas n\u00e3o relacionadas devido a tabelas desorganizadas ou glitch, selecionar essas faturas e iniciar a reatribui\u00e7\u00e3o para o agente correto. Exception \u2014 Faturas n\u00e3o relacionadas exibidas por glitch na tabela: Condi\u00e7\u00e3o: O inbox exibe faturas que n\u00e3o pertencem ao escopo de Secondary cost devido a tabela desorganizada ou erro de filtragem.. A\u00e7\u00f5es: Selecionar as faturas n\u00e3o relacionadas exibidas.; Iniciar a a\u00e7\u00e3o de reatribui\u00e7\u00e3o para o agente/categoria correta.; Salvar a reatribui\u00e7\u00e3o e confirmar que a fatura n\u00e3o pertence mais ao seu inbox ap\u00f3s atualiza\u00e7\u00e3o subsequente.. Resultado: 2.6 \u00b7 Confirmar que a lista mostra as faturas atribu\u00eddas ao agente corrente e identificar desvios (faturas n\u00e3o relacionadas a Secondary cost). Unknown \u2014 Localiza\u00e7\u00e3o/fluxo exato de reatribui\u00e7\u00e3o na interface: Determinar o bot\u00e3o/fluxo exato (nome do bot\u00e3o/menu) para executar a reatribui\u00e7\u00e3o de faturas na interface do VIM Workplace, quando aplic\u00e1vel.",
          classification: "ME"
        },
        {
          id: "step_02_2.6.3",
          sourceRef: "2.6.3",
          description: "Observar que faturas reatribu\u00eddas sair\u00e3o do seu inbox e ser\u00e3o transferidas; o documento indica que a transfer\u00eancia/atribui\u00e7\u00e3o efetiva para o novo agente ocorrer\u00e1 na pr\u00f3xima ocasi\u00e3o em que o inbox for atualizado.",
          classification: "ME"
        },
        {
          id: "step_02_2.7",
          sourceRef: "2.7",
          description: "Usar o painel de detalhes para acessar Reference Number, Contact Details e o tipo de fatura (por ex. Inspection).",
          classification: "ME"
        },
        {
          id: "step_02_2.7.1",
          sourceRef: "2.7.1",
          description: "Acionar a op\u00e7\u00e3o 'Hide details pane' quando necess\u00e1rio para ajustar a visualiza\u00e7\u00e3o; em seguida, no painel de detalhes, localizar e anotar Reference Number, Contact Details e identificar o tipo de invoice (ex.: Inspection).",
          classification: "ME"
        },
        {
          id: "step_02_2.8",
          sourceRef: "2.8",
          description: "Adicionar ou editar coment\u00e1rios vis\u00edveis no VIM para registrar solicita\u00e7\u00f5es ou atualiza\u00e7\u00f5es de status.",
          classification: "MS"
        },
        {
          id: "step_02_2.8.1",
          sourceRef: "2.8.1",
          description: "Clicar em 'Open comment' (ou funcionalidade equivalente) no detalhe da fatura, inserir o texto do coment\u00e1rio que atualiza o 'Current status' ou solicita informa\u00e7\u00f5es/approva\u00e7\u00e3o e salvar a entrada para que fique vis\u00edvel no hist\u00f3rico/process history.",
          classification: "MS"
        },
        {
          id: "step_02_2.9",
          sourceRef: "2.9",
          description: "Conhecer e usar os bot\u00f5es coloridos apresentados no VIM para a\u00e7\u00f5es imediatas.",
          classification: "ME"
        },
        {
          id: "step_02_2.9.1",
          sourceRef: "2.9.1",
          description: "Interpretar os bot\u00f5es coloridos: bot\u00e3o verde = op\u00e7\u00e3o para voltar; bot\u00e3o amarelo = op\u00e7\u00e3o para sair; bot\u00e3o vermelho = op\u00e7\u00e3o para cancelar. Usar cada bot\u00e3o conforme o prop\u00f3sito indicado para retornar, sair da tela ou cancelar a a\u00e7\u00e3o corrente.",
          classification: "ME"
        },
        {
          id: "step_02_2.10",
          sourceRef: "2.10",
          description: "Visualizar e confirmar os anexos/imagens associados \u00e0 fatura.",
          classification: "ME"
        },
        {
          id: "step_02_2.10.1",
          sourceRef: "2.10.1",
          description: "Clicar em 'Display Image' no painel da fatura e confirmar que o(s) anexo(s) abre(m) corretamente; verificar se a imagem corresponde \u00e0 fatura f\u00edsica (valores, fornecedor, datas).",
          classification: "MA"
        },
        {
          id: "step_02_2.11",
          sourceRef: "2.11",
          description: "Executar a simula\u00e7\u00e3o das regras configuradas para a fatura e decidir a aplica\u00e7\u00e3o conforme resultado da simula\u00e7\u00e3o. Control \u2014 Simula\u00e7\u00e3o de regras obrigat\u00f3ria antes da aplica\u00e7\u00e3o: Executar a fun\u00e7\u00e3o 'Simulate rules' e revisar a sa\u00edda antes de aplicar as regras \u00e0 fatura.",
          classification: "MS"
        },
        {
          id: "step_02_2.12",
          sourceRef: "2.12",
          description: "Quando apropriado, definir a fatura como obsoleta usando as marca\u00e7\u00f5es previstas.",
          classification: "ME"
        },
        {
          id: "step_02_2.12.1",
          sourceRef: "2.12.1",
          description: "No detalhe da fatura, selecionar as caixas/op\u00e7\u00f5es aplic\u00e1veis para marcar o documento como 'Invalid PO/OLA', 'Legacy Data', 'Duplicate Invoice' ou outras op\u00e7\u00f5es de obsoleto conforme o diagn\u00f3stico; salvar a altera\u00e7\u00e3o para que a marca\u00e7\u00e3o conste no registro.",
          classification: "ME"
        },
        {
          id: "step_02_2.13",
          sourceRef: "2.13",
          description: "Avaliar se a fatura \u00e9 um cr\u00e9dito e aplicar o fluxo adequado quando a gera\u00e7\u00e3o de VBD negativo n\u00e3o \u00e9 permitida. Unknown \u2014 Procedimento detalhado para convers\u00e3o de cr\u00e9dito em Non-PO via upload manual: Detalhar os passos de upload manual para converter faturas de cr\u00e9dito em Non-PO (ZEWB/Upload Manual) \u2014 campos obrigat\u00f3rios e a\u00e7\u00f5es subsequentes.",
          classification: "MS"
        },
        {
          id: "step_02_2.14",
          sourceRef: "2.14",
          description: "Quando for necess\u00e1rio obter aprova\u00e7\u00e3o ou informa\u00e7\u00f5es adicionais do scheduler, registrar essa solicita\u00e7\u00e3o via coment\u00e1rio na fatura.",
          classification: "MS"
        },
        {
          id: "step_02_2.14.1",
          sourceRef: "2.14.1",
          description: "Abrir 'Open comment' ou a funcionalidade de coment\u00e1rios da fatura, inserir mensagem clara solicitando aprova\u00e7\u00e3o ou informa\u00e7\u00e3o extra do scheduler e salvar para que o scheduler visualize e responda.",
          classification: "MS"
        },
      ]
    },
    {
      id: "step_03",
      sourceStep: "3",
      number: "03",
      title: "Processamento manual de fatura Non-PO e cria\u00e7\u00e3o de VBD (Trip e Non\u2011Trip) Procedimento execut\u00e1vel para registrar, codificar, submeter para aprova\u00e7\u00e3o e",
      description: "Procedimento execut\u00e1vel para registrar, codificar, submeter para aprova\u00e7\u00e3o e salvar documenta\u00e7\u00e3o de faturas Non\u2011PO no sistema. Esta sequ\u00eancia cobre verifica\u00e7\u00e3o inicial, preenchimento de campos obrigat\u00f3rios, defini\u00e7\u00e3o de documento de cr\u00e9dito quando aplic\u00e1vel, defini\u00e7\u00e3o de bloqueio de pagamento, inser\u00e7\u00e3o de GL e Profit Center, atribui\u00e7\u00f5es e envio para simula\u00e7\u00e3o de regras / fila de aprova\u00e7\u00e3o. Termine salvando e anexando documentos de backup quando necess\u00e1rio.",
      classification: "ME",
      classifications: ["ME", "MS"],
      macroBlockId: "execution",
      macroBlockName: "Execution",
      capabilityId: "cap-auto",
      capabilityName: "Capability Automática",
      solutionId: "sol-rpa-upload-vim",
      solutionIds: ["sol-rpa-upload-vim"],
      technologyType: "RPA",
      rationale: "A atividade combina preenchimento repetitivo em VIM com decis\u00f5es condicionais e dados de apoio; RPA deve ficar limitado aos campos est\u00e1veis e manter revis\u00e3o humana.",
      effort: {
        level: "high",
        score: 50,
        confidence: "medium",
        drivers: [],
        unknowns: []
      },
      humanInTheLoop: {
        hasHumanControl: true,
        level: "partial",
        description: "`review_required` \u2014 revis\u00e3o humana permanece necess\u00e1ria para dados, exce\u00e7\u00f5es, aprova\u00e7\u00f5es e/ou transa\u00e7\u00f5es financeiras."
      },
      substeps: [
        {
          id: "step_03_3.1",
          sourceRef: "3.1",
          description: "Confirme que a tela de entrada da fatura foi aberta ap\u00f3s executar/selecionar o line item e esteja pronta para edi\u00e7\u00e3o dos campos da fatura.",
          classification: "ME"
        },
        {
          id: "step_03_3.1.1",
          sourceRef: "3.1.1",
          description: "Execute a a\u00e7\u00e3o que carrega o line item no formul\u00e1rio de fatura. Aguarde a tela de entrada ser exibida e verifique que campos principais (Vendor, Company Code, Amount, Invoice Date) estejam vis\u00edveis para edi\u00e7\u00e3o.",
          classification: "MS"
        },
        {
          id: "step_03_3.2",
          sourceRef: "3.2",
          description: "Preencher os campos b\u00e1sicos da fatura conforme a c\u00f3pia da fatura: n\u00famero do fornecedor, data da fatura, valor e outros campos apresentados no formul\u00e1rio. Garantir que o Company Code j\u00e1 esteja definido conforme a estrat\u00e9gia da fatura.",
          classification: "ME"
        },
        {
          id: "step_03_3.2.1",
          sourceRef: "3.2.1",
          description: "No campo Vendor, digite o n\u00famero do fornecedor exatamente como consta na fatura.",
          classification: "ME"
        },
        {
          id: "step_03_3.2.2",
          sourceRef: "3.2.2",
          description: "No campo Invoice Date, informe a data indicada na fatura.",
          classification: "ME"
        },
        {
          id: "step_03_3.2.3",
          sourceRef: "3.2.3",
          description: "No campo Amount, insira o valor total conforme a fatura (moeda indicada na fatura).",
          classification: "ME"
        },
        {
          id: "step_03_3.2.4",
          sourceRef: "3.2.4",
          description: "Verifique os demais campos dispon\u00edveis na tela e atualize conforme a fatura (por exemplo: descri\u00e7\u00e3o, refer\u00eancia), mantendo o Company Code conforme estrat\u00e9gia (ver passo de mapeamento de strategy name).",
          classification: "ME"
        },
        {
          id: "step_03_3.3",
          sourceRef: "3.3",
          description: "Abrir a planilha referida e selecionar o Company Code correspondente ao strategy name que aparece na fatura; inserir o Company Code no campo apropriado do formul\u00e1rio. Utilizar planilha de Strategy Valuation para mapeamento de Company Code: Para selecionar o Company Code, consulte a planilha 'Day-5 Strategy Valuation and Profit Center FINAL.xlsx' e insira o Company Code exatamente conforme a linha do strategy name.",
          classification: "MA"
        },
        {
          id: "step_03_3.3.1",
          sourceRef: "3.3.1",
          description: "Abra a planilha 'Day-5 Strategy Valuation and Profit Center FINAL.xlsx' e localize a linha que corresponde ao strategy name informado na fatura.",
          classification: "MA"
        },
        {
          id: "step_03_3.3.2",
          sourceRef: "3.3.2",
          description: "Leia o Company Code associado ao strategy name e insira esse c\u00f3digo no campo Company Code do formul\u00e1rio da fatura.",
          classification: "ME"
        },
        {
          id: "step_03_3.4",
          sourceRef: "3.4",
          description: "Atualizar o n\u00famero da fatura e a data conforme o documento; no campo Requester E-mail inserir o e-mail do Requester \u2014 por padr\u00e3o usar o mesmo e\u2011mail do Processor quando aplic\u00e1vel. Requester E\u2011mail n\u00e3o aprovado para inclus\u00e3o: Condi\u00e7\u00e3o: Requester E-mail n\u00e3o est\u00e1 autorizado no sistema para ser utilizado no campo Requester. A\u00e7\u00f5es: Usar o Processor E-mail no campo Requester quando apropriado; Solicitar aprova\u00e7\u00e3o para incluir o Requester E-mail na lista autorizada. Resultado: 3.4 \u00b7 Atualizar o n\u00famero da fatura e a data conforme o documento; no campo Requester E-mail inserir o e-mail do Requester \u2014 por padr\u00e3o usar o mesmo e\u2011mail do Processor quando aplic\u00e1vel.",
          classification: "MS"
        },
        {
          id: "step_03_3.4.1",
          sourceRef: "3.4.1",
          description: "No campo Invoice Number, insira exatamente o n\u00famero que consta na fatura f\u00edsica ou eletr\u00f4nica.",
          classification: "ME"
        },
        {
          id: "step_03_3.4.2",
          sourceRef: "3.4.2",
          description: "No campo Invoice Date, confirme a data e atualize se necess\u00e1rio com a data indicada na fatura.",
          classification: "ME"
        },
        {
          id: "step_03_3.4.3",
          sourceRef: "3.4.3",
          description: "No campo Requester E-mail, insira o e-mail do Requester. Se o Requester n\u00e3o tiver permiss\u00e3o para ser colocado aqui, use o Processor E-mail conforme observado na pr\u00e1tica padr\u00e3o.",
          classification: "ME"
        },
        {
          id: "step_03_3.5",
          sourceRef: "3.5",
          description: "Decida se a fatura deve ser registrada como fatura normal ou como nota de cr\u00e9dito.",
          classification: "ME"
        },
        {
          id: "step_03_3.6",
          sourceRef: "3.6",
          description: "Ao confirmar que \u00e9 um cr\u00e9dito, altere o tipo de documento para Credit Memo e verifique o estado do campo Payment Block (normalmente creditos assumem bloqueio por padr\u00e3o). Ajuste conforme pol\u00edtica.",
          classification: "ME"
        },
        {
          id: "step_03_3.6.1",
          sourceRef: "3.6.1",
          description: "Altere o tipo de documento para 'Credit Memo' no campo apropriado do formul\u00e1rio.",
          classification: "ME"
        },
        {
          id: "step_03_3.6.2",
          sourceRef: "3.6.2",
          description: "Verifique o campo Payment Block: confirme se est\u00e1 aplicado por padr\u00e3o para credit memos e ajuste apenas se pol\u00edtica permitir.",
          classification: "ME"
        },
        {
          id: "step_03_3.7",
          sourceRef: "3.7",
          description: "Para faturas normais, definir o campo Payment Block como 'free for payment' para permitir processamento de pagamento, conforme instru\u00e7\u00e3o operacional. Payment Block deve estar livre para pagamento em faturas normais: Verifique e defina o campo Payment Block como 'free for payment' para faturas que n\u00e3o sejam credit memos.",
          classification: "ME"
        },
        {
          id: "step_03_3.7.1",
          sourceRef: "3.7.1",
          description: "Localize o campo Payment Block na tela e selecione a op\u00e7\u00e3o que libera a fatura para pagamento (free for payment).",
          classification: "ME"
        },
        {
          id: "step_03_3.7.2",
          sourceRef: "3.7.2",
          description: "Confirme visualmente que o Payment Block est\u00e1 definido como livre para pagamento antes de prosseguir.",
          classification: "ME"
        },
        {
          id: "step_03_3.8",
          sourceRef: "3.8",
          description: "Definir a data base (baseline date) e os termos de pagamento conforme indicados na fatura.",
          classification: "ME"
        },
        {
          id: "step_03_3.8.1",
          sourceRef: "3.8.1",
          description: "Insira o Baseline Date conforme a fatura no campo correspondente.",
          classification: "MA"
        },
        {
          id: "step_03_3.8.2",
          sourceRef: "3.8.2",
          description: "Selecione os Payment Terms conforme a fatura (por exemplo, prazo e data de vencimento) e confirme que os valores calculados est\u00e3o coerentes com o documento.",
          classification: "ME"
        },
        {
          id: "step_03_3.9",
          sourceRef: "3.9",
          description: "Obter o c\u00f3digo GL e o Profit Center que ser\u00e3o utilizados para contabiliza\u00e7\u00e3o da fatura; estes dois campos s\u00e3o obrigat\u00f3rios para non\u2011PO invoices.",
          classification: "ME"
        },
        {
          id: "step_03_3.9.1",
          sourceRef: "3.9.1",
          description: "Verifique se existe documenta\u00e7\u00e3o interna (lista padr\u00e3o de GLs) associada ao tipo de gasto da fatura. Se dispon\u00edvel, selecione o GL apropriado.",
          classification: "ME"
        },
        {
          id: "step_03_3.9.2",
          sourceRef: "3.9.2",
          description: "Se n\u00e3o houver refer\u00eancia interna clara, solicite o GL e Profit Center ao respons\u00e1vel indicado (ver passo de contato).",
          classification: "ME"
        },
        {
          id: "step_03_3.10",
          sourceRef: "3.10",
          description: "Contatar James Carlson para obter o GL account e o Profit Center apropriados quando n\u00e3o estiverem definidos internamente. Solicitar GL/Profit Center a James Carlson: N\u00e3o existir GL account ou Profit Center claro para a fatura \u00b7 James Carlson \u00b7 email",
          classification: "MS"
        },
        {
          id: "step_03_3.10.1",
          sourceRef: "3.10.1",
          description: "Envie e-mail para James Carlson especificando: n\u00famero da fatura, valor, descri\u00e7\u00e3o do gasto e solicita\u00e7\u00e3o expl\u00edcita de GL account e Profit Center.",
          classification: "MS"
        },
        {
          id: "step_03_3.10.2",
          sourceRef: "3.10.2",
          description: "Aguarde a resposta com os c\u00f3digos GL e Profit Center; ap\u00f3s recebimento, registre-os nos campos correspondentes do formul\u00e1rio.",
          classification: "MA"
        },
        {
          id: "step_03_3.11",
          sourceRef: "3.11",
          description: "Inserir o GL code recebido, definir a coluna como Debit (quando aplic\u00e1vel) e atualizar o campo Text com a descri\u00e7\u00e3o e m\u00eas/ano da fatura para documenta\u00e7\u00e3o.",
          classification: "ME"
        },
        {
          id: "step_03_3.11.1",
          sourceRef: "3.11.1",
          description: "No campo GL Account, insira o GL code aprovado.",
          classification: "MS"
        },
        {
          id: "step_03_3.11.2",
          sourceRef: "3.11.2",
          description: "Defina a coluna Debit/Credit como 'Debit' e insira o valor correspondente conforme a fatura.",
          classification: "MA"
        },
        {
          id: "step_03_3.11.3",
          sourceRef: "3.11.3",
          description: "No campo Text, registre a descri\u00e7\u00e3o da fatura seguida do m\u00eas e ano (ex.: 'Servi\u00e7os terminaling - Jun 2024'), conforme a documenta\u00e7\u00e3o da fatura.",
          classification: "ME"
        },
        {
          id: "step_03_3.12",
          sourceRef: "3.12",
          description: "No bloco Assignment, atualizar o vendor number e, se aplic\u00e1vel, definir o Profit Center baseado no fornecedor (ex.: propane -> Mary Maryville Lights; butanes -> heavy). Salvar as altera\u00e7\u00f5es no formul\u00e1rio.",
          classification: "ME"
        },
        {
          id: "step_03_3.12.1",
          sourceRef: "3.12.1",
          description: "No campo Assignment, insira/atualize o vendor number conforme a fatura.",
          classification: "ME"
        },
        {
          id: "step_03_3.12.2",
          sourceRef: "3.12.2",
          description: "Se o fornecedor corresponder a um dos casos padr\u00e3o (ex.: propane - Mary Maryville Lights; butanes - heavy), atribua o Profit Center conforme o caso indicado e conforme informa\u00e7\u00e3o recebida.",
          classification: "MA"
        },
        {
          id: "step_03_3.12.3",
          sourceRef: "3.12.3",
          description: "Salvar as atualiza\u00e7\u00f5es efetuadas no formul\u00e1rio (pressionar 'Save' / salvar registro).",
          classification: "ME"
        },
        {
          id: "step_03_3.13",
          sourceRef: "3.13",
          description: "Aplicar a fun\u00e7\u00e3o de simula\u00e7\u00e3o de regras para efetuar roteamento de aprova\u00e7\u00e3o. Marcar que aprova\u00e7\u00e3o \u00e9 requerida quando aplic\u00e1vel; o processo encaminhar\u00e1 inicialmente para a fila do Requestor e depois para o approver seguinte (ex.: Gina).",
          classification: "MS"
        },
        {
          id: "step_03_3.13.1",
          sourceRef: "3.13.1",
          description: "Clique em 'Simulate Rules' (ou fun\u00e7\u00e3o equivalente) para calcular o fluxo de aprova\u00e7\u00e3o e revisar o destino (Requestor -> pr\u00f3ximo approver).",
          classification: "MS"
        },
        {
          id: "step_03_3.13.2",
          sourceRef: "3.13.2",
          description: "Ative a op\u00e7\u00e3o 'Approval required' quando o sistema solicitar, garantindo que a fatura seja roteada conforme regras.",
          classification: "MS"
        },
        {
          id: "step_03_3.14",
          sourceRef: "3.14",
          description: "Acompanhar a chegada da fatura na fila do Requestor; o Requestor dever\u00e1 aprovar ou recusar. Ap\u00f3s aprova\u00e7\u00e3o, a fatura seguir\u00e1 para o pr\u00f3ximo aprovador. Confirmar que os documentos de suporte est\u00e3o anexados para an\u00e1lise do aprovador.",
          classification: "MS"
        },
        {
          id: "step_03_3.14.1",
          sourceRef: "3.14.1",
          description: "Verifique a fila do Requestor para confirmar que a fatura apareceu e aguarde a a\u00e7\u00e3o (aprovar/recusar).",
          classification: "MS"
        },
        {
          id: "step_03_3.14.2",
          sourceRef: "3.14.2",
          description: "Se o Requestor aprovar, confirme que o registro foi encaminhado ao pr\u00f3ximo aprovador conforme a simula\u00e7\u00e3o (por exemplo, Gina). Caso rejeitado, registrar motivo e executar corre\u00e7\u00e3o necess\u00e1ria.",
          classification: "MS"
        },
        {
          id: "step_03_3.14.3",
          sourceRef: "3.14.3",
          description: "Antes ou durante aprova\u00e7\u00e3o, confirme que todos os backups/documentos (PDFs, evid\u00eancias) est\u00e3o anexados ao business document.",
          classification: "MS"
        },
        {
          id: "step_03_3.15",
          sourceRef: "3.15",
          description: "Quando aprova\u00e7\u00f5es ou documentos de suporte forem recebidos fora do sistema, usar a fun\u00e7\u00e3o 'store business document' para adicionar os arquivos ao registro da fatura.",
          classification: "MS"
        },
        {
          id: "step_03_3.15.1",
          sourceRef: "3.15.1",
          description: "Acesse a fun\u00e7\u00e3o 'Store Business Document' no registro da fatura.",
          classification: "ME"
        },
        {
          id: "step_03_3.15.2",
          sourceRef: "3.15.2",
          description: "Anexe o(s) arquivo(s) recebido(s) externamente (ex.: e\u2011mail de aprova\u00e7\u00e3o, PDF de backup) e confirme o upload.",
          classification: "MS"
        },
        {
          id: "step_03_3.15.3",
          sourceRef: "3.15.3",
          description: "Salvar o registro ap\u00f3s anexa\u00e7\u00e3o para garantir que o documento de suporte fique dispon\u00edvel na fatura.",
          classification: "ME"
        },
      ]
    },
    {
      id: "step_04",
      sourceStep: "4",
      number: "04",
      title: "Cria\u00e7\u00e3o manual de VBD (ZEWB) \u2014 fluxos Trip e Non\u2011Trip Procedimento execut\u00e1vel para criar VBD manualmente no Custom Trading Expenses Workbench para pro",
      description: "Procedimento execut\u00e1vel para criar VBD manualmente no Custom Trading Expenses Workbench para processos Trip\u2011related e Non\u2011Trip related, incluindo tratamento quando o Scheduler n\u00e3o fornece dados (processamento Non\u2011PO).",
      classification: "ME",
      classifications: ["ME", "MS"],
      macroBlockId: "execution",
      macroBlockName: "Execution",
      capabilityId: "cap-auto",
      capabilityName: "Capability Automática",
      solutionId: "sol-rpa-upload-vim",
      solutionIds: ["sol-rpa-upload-vim"],
      technologyType: "RPA",
      rationale: "A cria\u00e7\u00e3o de VBD tem campos e sequ\u00eancias estruturadas, mas depende de dados do Scheduler e de varia\u00e7\u00f5es Trip/Non-Trip.",
      effort: {
        level: "high",
        score: 50,
        confidence: "medium",
        drivers: [],
        unknowns: []
      },
      humanInTheLoop: {
        hasHumanControl: true,
        level: "partial",
        description: "`review_required` \u2014 revis\u00e3o humana permanece necess\u00e1ria para dados, exce\u00e7\u00f5es, aprova\u00e7\u00f5es e/ou transa\u00e7\u00f5es financeiras."
      },
      substeps: [
        {
          id: "step_04_4.1",
          sourceRef: "4.1",
          description: "Receba o e-mail/solicita\u00e7\u00e3o do Scheduler e identifique quais detalhes foram fornecidos: para Non\u2011Trip (Plant, Material, Strategy) ou para Trip (Nomination Key / Nom key). Registre os valores exatos recebidos antes de abrir o Workbench.",
          classification: "MS"
        },
        {
          id: "step_04_4.2",
          sourceRef: "4.2",
          description: "Determinar se o VBD ser\u00e1 Trip\u2011related, Non\u2011Trip related ou se faltam dados do Scheduler.",
          classification: "MS"
        },
        {
          id: "step_04_4.3",
          sourceRef: "4.3",
          description: "Abra o Custom Trading Expenses Workbench, selecione a op\u00e7\u00e3o Non\u2011Trip Related e carregue Plant, Material e Strategy exatamente como recebidos no e\u2011mail do Scheduler; em seguida, execute para listar itens.",
          classification: "ME"
        },
        {
          id: "step_04_4.3.1",
          sourceRef: "4.3.1",
          description: "Clique em Execute para gerar a listagem com base em Plant, Material e Strategy. Na tela resultante selecione a(s) linha(s) relevantes e clique em Create Expenses.",
          classification: "ME"
        },
        {
          id: "step_04_4.3.2",
          sourceRef: "4.3.2",
          description: "No formul\u00e1rio de cria\u00e7\u00e3o de expense selecione Expense Class Group = Z1. Em Expense Class escolha o c\u00f3digo que corresponde \u00e0 natureza do custo (ex.: F28 para terminal/miscellaneous utilities; F00 para inspe\u00e7\u00e3o quando aplic\u00e1vel). Expense Class Group obrigat\u00f3rio: Sempre selecionar Expense Class Group = Z1 ao criar expenses manuais para estes processos.",
          classification: "MA"
        },
        {
          id: "step_04_4.3.3",
          sourceRef: "4.3.3",
          description: "Defina Accounting Type conforme a necessidade de exibir estrat\u00e9gia: para Non\u2011Trip, quando for necess\u00e1rio mostrar Strategy, selecione tipo B (conta de Expense). Regra para Accounting Type: Quando houver Nomination Key use Accounting Type = A (Inventory account). Quando for necess\u00e1rio exibir Strategy (Non\u2011Trip) use Accounting Type = B (Expense account).",
          classification: "ME"
        },
        {
          id: "step_04_4.3.4",
          sourceRef: "4.3.4",
          description: "Atualize os campos: Posting Category = 3 (accrual); Posting Date = data em que est\u00e1 postando; Transaction Date = data da atividade (se dispon\u00edvel) \u2014 caso n\u00e3o haja, use a \u00faltima data do m\u00eas da fatura. Em Partner Details informe o Vendor Number. Em seguida, preencha Net Amount (USD ou moeda da fatura), Document, Reference e Text (usar n\u00famero da fatura no Reference/Text). Posting Category = 3: Posting Category deve ser selecionada como 3 (accrual) para todas as cria\u00e7\u00f5es manuais descritas.",
          classification: "ME"
        },
        {
          id: "step_04_4.3.5",
          sourceRef: "4.3.5",
          description: "Clique no \u00edcone Save. Depois de salvar, o Expense DOC list \u00e9 gravado e um VBD \u00e9 criado vinculado \u00e0 fatura. Copie o VBD gerado e anexe\u2011o \u00e0 fatura para que fique pronta para processamento posterior. M\u00e9todo de anexa\u00e7\u00e3o do VBD \u00e0 fatura n\u00e3o especificado: O procedimento menciona copiar o VBD e anexar \u00e0 fatura, mas o passo exato (menu/op\u00e7\u00e3o) para anexa\u00e7\u00e3o n\u00e3o est\u00e1 detalhado no documento fonte.",
          classification: "ME"
        },
        {
          id: "step_04_4.4",
          sourceRef: "4.4",
          description: "Abra o Custom Trading Expenses Workbench, selecione Trip related e, na aba de Nomination/Comments, insira o Nomination Key fornecido pelo Scheduler; clique em Execute para trazer as linhas associadas.",
          classification: "ME"
        },
        {
          id: "step_04_4.4.1",
          sourceRef: "4.4.1",
          description: "Ap\u00f3s informar o Nom key e clicar Execute, selecione a linha item correspondente (ex.: line 10) e clique em Create Expense para iniciar a cria\u00e7\u00e3o do expense.",
          classification: "MA"
        },
        {
          id: "step_04_4.4.2",
          sourceRef: "4.4.2",
          description: "No formul\u00e1rio de cria\u00e7\u00e3o de expense para Trip selecione Expense Class Group = Z1. Escolha a Expense Class conforme a descri\u00e7\u00e3o do custo (por exemplo, F00 para inspe\u00e7\u00e3o quando aplic\u00e1vel). Expense Class Group obrigat\u00f3rio: Sempre selecionar Expense Class Group = Z1 ao criar expenses manuais para estes processos.",
          classification: "ME"
        },
        {
          id: "step_04_4.4.3",
          sourceRef: "4.4.3",
          description: "Para Trip related selecione Accounting Type = A (conta de Inventory). Configure Posting Category = 3 (accrual). Atualize Posting Date (data de postagem) e Transaction Date (se aplic\u00e1vel). Em Partner Details informe o Vendor Number. Preencha Net Amount (na moeda correta), Document, Reference e Text (usar n\u00famero da fatura). Posting Category = 3: Posting Category deve ser selecionada como 3 (accrual) para todas as cria\u00e7\u00f5es manuais descritas. Regra para Accounting Type: Quando houver Nomination Key use Accounting Type = A (Inventory account). Quando for necess\u00e1rio exibir Strategy (Non\u2011Trip) use Accounting Type = B (Expense account).",
          classification: "ME"
        },
        {
          id: "step_04_4.4.4",
          sourceRef: "4.4.4",
          description: "Ap\u00f3s inserir todos os dados clique no \u00edcone Save. O sistema criar\u00e1 o VBD ligado \u00e0 fatura. Copie o VBD e anexe\u2011o \u00e0 fatura para prosseguir com o processamento. M\u00e9todo de anexa\u00e7\u00e3o do VBD \u00e0 fatura n\u00e3o especificado: O procedimento menciona copiar o VBD e anexar \u00e0 fatura, mas o passo exato (menu/op\u00e7\u00e3o) para anexa\u00e7\u00e3o n\u00e3o est\u00e1 detalhado no documento fonte.",
          classification: "ME"
        },
        {
          id: "step_04_4.5",
          sourceRef: "4.5",
          description: "Se o Scheduler n\u00e3o puder fornecer Nomination Key nem Plant/Material/Strategy, processe a fatura como Non\u2011PO: codifique a transa\u00e7\u00e3o usando GL e Cost Centre apropriados (conforme pol\u00edtica vigente) e avance o documento para o fluxo de aprova\u00e7\u00e3o/lan\u00e7amento sem VBD Trip/Non\u2011Trip. Exce\u00e7\u00e3o: Scheduler n\u00e3o forneceu dados: Condi\u00e7\u00e3o: Scheduler n\u00e3o forneceu Nom key nem Plant/Material/Strategy. A\u00e7\u00f5es: Processar a fatura como Non\u2011PO usando GL e Cost Centre apropriados.; Inserir codifica\u00e7\u00e3o espec\u00edfica de acordo com pol\u00edtica local de Non\u2011PO.",
          classification: "MS"
        },
        {
          id: "step_04_4.6",
          sourceRef: "4.6",
          description: "Depois que o VBD for criado e anexado \u00e0 fatura, efetue o upload do Expense DOC list (quando aplic\u00e1vel). Ap\u00f3s o upload conclu\u00eddo, execute 'Apply Rules to Post the Invoice' para que as regras de contabiliza\u00e7\u00e3o sejam aplicadas e a fatura seja preparada para postagem.",
          classification: "ME"
        },
      ]
    },
    {
      id: "step_05",
      sourceStep: "5",
      number: "05",
      title: "Criar solicita\u00e7\u00e3o MDG para extens\u00e3o/corre\u00e7\u00e3o de material Fluxo execut\u00e1vel para registrar uma solicita\u00e7\u00e3o no MDG quando for detectado que um plant n\u00e3o",
      description: "Fluxo execut\u00e1vel para registrar uma solicita\u00e7\u00e3o no MDG quando for detectado que um plant n\u00e3o est\u00e1 aplicado a um material (extens\u00e3o/corre\u00e7\u00e3o). Inclui confirma\u00e7\u00e3o de VBD associado ao invoice antes da solicita\u00e7\u00e3o.",
      classification: "MS",
      classifications: ["MS"],
      macroBlockId: "exception",
      macroBlockName: "Exception",
      capabilityId: "cap-auto",
      capabilityName: "Capability Automática",
      solutionId: "sol-wf-routing",
      solutionIds: ["sol-wf-routing"],
      technologyType: "Workflow",
      rationale: "A solicita\u00e7\u00e3o MDG trata corre\u00e7\u00e3o ou extens\u00e3o de material e depende de valida\u00e7\u00e3o e aprova\u00e7\u00e3o de uma \u00e1rea respons\u00e1vel.",
      effort: {
        level: "high",
        score: 50,
        confidence: "medium",
        drivers: [],
        unknowns: []
      },
      humanInTheLoop: {
        hasHumanControl: true,
        level: "partial",
        description: "`decision_required` \u2014 revis\u00e3o humana permanece necess\u00e1ria para dados, exce\u00e7\u00f5es, aprova\u00e7\u00f5es e/ou transa\u00e7\u00f5es financeiras."
      },
      substeps: [
        {
          id: "step_05_5.1",
          sourceRef: "5.1",
          description: "Abrir o e-mail recebido que solicita a corre\u00e7\u00e3o/ extens\u00e3o do material e localizar a mensagem de erro que indica que o plant n\u00e3o est\u00e1 aplicado ao material. Registrar os dados essenciais (n\u00famero do material, descri\u00e7\u00e3o do erro, n\u00famero do invoice se presente) para uso na solicita\u00e7\u00e3o MDG. Registrar dados do e-mail de solicita\u00e7\u00e3o: Capturar n\u00famero do material, texto do erro e n\u00famero do invoice (se presente) diretamente do e-mail para uso nas etapas subsequentes.",
          classification: "MS"
        },
        {
          id: "step_05_5.2",
          sourceRef: "5.2",
          description: "Se, antes de criar a solicita\u00e7\u00e3o MDG, voc\u00ea salvou a Expense DOC list e foi criado um VBD contra a fatura, copie o identificador do VBD e anexe-o ao invoice para garantir que o invoice esteja pronto para processamento. Local/tela para anexar VBD ao invoice: Copiar o identificador do VBD criado e anex\u00e1-lo ao invoice.",
          classification: "MS"
        },
        {
          id: "step_05_5.3",
          sourceRef: "5.3",
          description: "No SAP Fiori, localizar e clicar em MDG Launchpad para abrir a aplica\u00e7\u00e3o de gerenciamento de master data. Aguardar o carregamento do Launchpad.",
          classification: "ME"
        },
        {
          id: "step_05_5.4",
          sourceRef: "5.4",
          description: "No MDG Launchpad, clicar na op\u00e7\u00e3o 'Change Material' para iniciar o fluxo de altera\u00e7\u00e3o do material.",
          classification: "ME"
        },
        {
          id: "step_05_5.5",
          sourceRef: "5.5",
          description: "No campo correspondente, digitar o n\u00famero do material informado pelo e-mail/erro e pressionar Enter. Verificar que os detalhes do material s\u00e3o exibidos na tela antes de prosseguir.",
          classification: "MA"
        },
        {
          id: "step_05_5.6",
          sourceRef: "5.6",
          description: "Verificar, conforme a mensagem de erro ou solicita\u00e7\u00e3o recebida, o tipo de extens\u00e3o que deve ser aplicada ao material.",
          classification: "MS"
        },
        {
          id: "step_05_5.7",
          sourceRef: "5.7",
          description: "Clicar no bot\u00e3o 'Edit' (Editar) na tela do material e, no menu/a\u00e7\u00f5es dispon\u00edveis, selecionar a op\u00e7\u00e3o 'Extend material'. Confirmar a sele\u00e7\u00e3o clicando em 'OK'. Observar que um Change Request ID ser\u00e1 gerado automaticamente e exibido na tela.",
          classification: "ME"
        },
        {
          id: "step_05_5.8",
          sourceRef: "5.8",
          description: "Localizar os campos 'Description' e 'Reason' no formul\u00e1rio de altera\u00e7\u00e3o. Copiar/registrar a informa\u00e7\u00e3o do erro conforme recebido no e-mail e colar/entrar nos campos: Description deve refletir a descri\u00e7\u00e3o curta do problema; Reason deve indicar a justificativa para a extens\u00e3o/corre\u00e7\u00e3o. Preenchimento obrigat\u00f3rio de Description e Reason: Preencher o campo Description com a descri\u00e7\u00e3o do problema e o campo Reason com a justificativa, conforme a mensagem de erro.",
          classification: "ME"
        },
        {
          id: "step_05_5.9",
          sourceRef: "5.9",
          description: "Ir at\u00e9 a aba 'Notes' (Notas), clicar em 'New' (Novo) para criar uma nota e inserir os detalhes completos do erro (texto do e-mail, identificadores relevantes, passos que levaram ao erro). Ap\u00f3s inserir o texto da nota, clicar em 'OK' para salvar a nota no pedido de mudan\u00e7a. Incluir detalhes completos na aba Notes: Na aba Notes, clicar em New e inserir os detalhes completos do erro e qualquer informa\u00e7\u00e3o de suporte antes de confirmar com OK.",
          classification: "ME"
        },
        {
          id: "step_05_5.10",
          sourceRef: "5.10",
          description: "Na tela do Change Request, confirmar que todos os campos obrigat\u00f3rios (Description, Reason) e a nota foram preenchidos. Clicar em 'Submit' (Enviar). Verificar a confirma\u00e7\u00e3o de envio exibida pelo sistema (Change Request ID deve estar presente para refer\u00eancia). Registrar o Change Request ID no controle de solicita\u00e7\u00f5es.",
          classification: "MS"
        },
        {
          id: "step_05_5.11",
          sourceRef: "5.11",
          description: "Ap\u00f3s a submiss\u00e3o, a solicita\u00e7\u00e3o \u00e9 encaminhada \u00e0 equipe MDG. Registrar que o status atual \u00e9 'Solicita\u00e7\u00e3o enviada' e aguardar a confirma\u00e7\u00e3o por e-mail da equipe MDG informando que a corre\u00e7\u00e3o/ extens\u00e3o foi realizada. Prazo de confirma\u00e7\u00e3o da equipe MDG: Registrar que a solicita\u00e7\u00e3o foi enviada e aguardar a confirma\u00e7\u00e3o por e-mail da equipe MDG.",
          classification: "MS"
        },
      ]
    },
    {
      id: "step_06",
      sourceStep: "6",
      number: "06",
      title: "Cria\u00e7\u00e3o de Trading Contract (WB21) e Verifica\u00e7\u00e3o (WB23) Procedimento operacional para criar um Trading Contract usando WB21 (cria\u00e7\u00e3o) e verificar via",
      description: "Procedimento operacional para criar um Trading Contract usando WB21 (cria\u00e7\u00e3o) e verificar via WB23 (exibi\u00e7\u00e3o). Inclui prepara\u00e7\u00e3o de informa\u00e7\u00f5es, preenchimento de dados organizacionais, atualiza\u00e7\u00e3o da overview, entrada de itens, grava\u00e7\u00e3o do contrato e visualiza\u00e7\u00e3o posterior.",
      classification: "ME",
      classifications: ["ME", "MS"],
      macroBlockId: "execution",
      macroBlockName: "Execution",
      capabilityId: "cap-auto",
      capabilityName: "Capability Automática",
      solutionId: "sol-rpa-upload-vim",
      solutionIds: ["sol-rpa-upload-vim"],
      technologyType: "RPA",
      rationale: "A cria\u00e7\u00e3o do Trading Contract segue campos estruturados, mas depende de anexos, regras organizacionais e confer\u00eancia no WB23.",
      effort: {
        level: "high",
        score: 50,
        confidence: "medium",
        drivers: [],
        unknowns: []
      },
      humanInTheLoop: {
        hasHumanControl: true,
        level: "partial",
        description: "`review_required` \u2014 revis\u00e3o humana permanece necess\u00e1ria para dados, exce\u00e7\u00f5es, aprova\u00e7\u00f5es e/ou transa\u00e7\u00f5es financeiras."
      },
      substeps: [
        {
          id: "step_06_6.1",
          sourceRef: "6.1",
          description: "Receber e validar o e\u2011mail que serve de base para a cria\u00e7\u00e3o do Trading Contract e confirmar presen\u00e7a dos anexos necess\u00e1rios. Documento e anexo obrigat\u00f3rios: E\u2011mail de solicita\u00e7\u00e3o deve conter o anexo Excel com o mapeamento Sales Organization por Company Code e/ou indica\u00e7\u00e3o expl\u00edcita de Division. Sem esse anexo n\u00e3o prosseguir para a cria\u00e7\u00e3o.",
          classification: "MS"
        },
        {
          id: "step_06_6.1.1",
          sourceRef: "6.1.1",
          description: "Abrir o e\u2011mail recebido que solicita cria\u00e7\u00e3o do Trading Contract e identificar: o n\u00famero do fornecedor, material solicitado (se aplic\u00e1vel), estrat\u00e9gia/strategy code, datas de valida\u00e7\u00e3o/pricing date, moeda, item number e qualquer refer\u00eancia a divis\u00e3o ou organiza\u00e7\u00e3o de vendas.",
          classification: "MS"
        },
        {
          id: "step_06_6.1.2",
          sourceRef: "6.1.2",
          description: "Confirmar se o e\u2011mail cont\u00e9m o anexo Excel com o mapeamento Sales Organization por Company Code e quaisquer instru\u00e7\u00f5es de classifica\u00e7\u00e3o de divis\u00e3o. Se o anexo estiver presente, salvar localmente para consulta durante a entrada de dados.",
          classification: "MS"
        },
        {
          id: "step_06_6.2",
          sourceRef: "6.2",
          description: "Decidir se o anexo Excel com o mapeamento de Sales Organization e classifica\u00e7\u00f5es de divis\u00e3o foi recebido e \u00e9 utiliz\u00e1vel.",
          classification: "MS"
        },
        {
          id: "step_06_6.3",
          sourceRef: "6.3",
          description: "Quando o Excel ou indica\u00e7\u00e3o de divis\u00e3o/organization n\u00e3o estiver presente ou n\u00e3o estiver leg\u00edvel, solicitar esclarecimentos antes de prosseguir. A\u00e7\u00e3o quando Excel ausente: Condi\u00e7\u00e3o: Anexo Excel ausente ou ileg\u00edvel no e\u2011mail de solicita\u00e7\u00e3o.. A\u00e7\u00f5es: Responder ao solicitante pedindo o anexo Excel com o mapeamento Sales Organization e/ou indica\u00e7\u00e3o de Division.; Aguardar retorno antes de iniciar a cria\u00e7\u00e3o do Trading Contract.. Resultado: 6.1 \u00b7 Receber e validar o e\u2011mail que serve de base para a cria\u00e7\u00e3o do Trading Contract e confirmar presen\u00e7a dos anexos necess\u00e1rios.",
          classification: "MS"
        },
        {
          id: "step_06_6.3.1",
          sourceRef: "6.3.1",
          description: "Responder ao e\u2011mail do solicitante solicitando o anexo Excel com o mapeamento Sales Organization por Company Code e/ou a indica\u00e7\u00e3o expl\u00edcita da Division a ser usada. Informar que n\u00e3o ser\u00e1 iniciado o cadastro sem essas informa\u00e7\u00f5es.",
          classification: "MS"
        },
        {
          id: "step_06_6.4",
          sourceRef: "6.4",
          description: "Acessar o SAP GUI e entrar no t-code WB21 para iniciar a cria\u00e7\u00e3o do Trading Contract.",
          classification: "ME"
        },
        {
          id: "step_06_6.4.1",
          sourceRef: "6.4.1",
          description: "No SAP GUI, executar o T\u2011Code 'WB21'. Aguardar a tela de cria\u00e7\u00e3o do Trading Contract carregar.",
          classification: "ME"
        },
        {
          id: "step_06_6.4.2",
          sourceRef: "6.4.2",
          description: "Na tela de cria\u00e7\u00e3o, no campo 'Contract Type' selecionar 'ZN03' (especificado para despesas non\u2011trip).",
          classification: "ME"
        },
        {
          id: "step_06_6.4.3",
          sourceRef: "6.4.3",
          description: "Clicar no \u00edcone retangular branco indicado para acessar os campos de Organizational Data (dados organizacionais) e preparar para preenchimento dos campos obrigat\u00f3rios.",
          classification: "ME"
        },
        {
          id: "step_06_6.5",
          sourceRef: "6.5",
          description: "Preencher os campos organizacionais necess\u00e1rios conforme o anexo Excel e as regras conhecidas: Sales Organization, Distribution Channel, Division, Purchasing Organization e Purchasing Group. Preenchimento de Organizational Data: Sales Organization deve ser preenchida conforme o anexo Excel; Distribution Channel = DR; Purchasing Organization = 0111; Purchasing Group = H20. Confirma\u00e7\u00e3o da Division: A Division (50 ou 52) dever\u00e1 ser tomada exclusivamente da indica\u00e7\u00e3o no e\u2011mail ou no Excel. N\u00e3o decidir por suposi\u00e7\u00e3o.",
          classification: "MS"
        },
        {
          id: "step_06_6.5.1",
          sourceRef: "6.5.1",
          description: "No campo Sales Organization, inserir o valor identificado no anexo Excel por Company Code. Se o Excel n\u00e3o contiver o mapeamento, n\u00e3o prosseguir e acionar o passo de solicita\u00e7\u00e3o de informa\u00e7\u00e3o.",
          classification: "MS"
        },
        {
          id: "step_06_6.5.2",
          sourceRef: "6.5.2",
          description: "Definir Distribution Channel como 'DR' (sempre).",
          classification: "ME"
        },
        {
          id: "step_06_6.5.3",
          sourceRef: "6.5.3",
          description: "Determinar se a Division a ser usada \u00e9 50 ou 52 com base nas instru\u00e7\u00f5es do solicitante ou do Excel.",
          classification: "MS"
        },
        {
          id: "step_06_6.5.4",
          sourceRef: "6.5.4",
          description: "Definir Purchasing Organization = '0111' e Purchasing Group = 'H20'.",
          classification: "ME"
        },
        {
          id: "step_06_6.5.5",
          sourceRef: "6.5.5",
          description: "Ap\u00f3s preencher os dados organizacionais, clicar na pequena caixa ao lado do \u00edcone Enter (conforme indicado) para confirmar os dados e voltar \u00e0 tela principal de cria\u00e7\u00e3o.",
          classification: "ME"
        },
        {
          id: "step_06_6.6",
          sourceRef: "6.6",
          description: "Quando a Division n\u00e3o estiver especificada no e\u2011mail ou no Excel, solicitar ao solicitante qual Division (50 ou 52) aplicar. A\u00e7\u00e3o quando Division n\u00e3o especificada: Condi\u00e7\u00e3o: Division (50/52) n\u00e3o especificada no e\u2011mail nem no Excel.. A\u00e7\u00f5es: Responder ao solicitante solicitando indica\u00e7\u00e3o expl\u00edcita da Division (50 ou 52).; Aguardar a resposta antes de prosseguir com o preenchimento e grava\u00e7\u00e3o do contrato.. Resultado: 6.5 \u00b7 Preencher os campos organizacionais necess\u00e1rios conforme o anexo Excel e as regras conhecidas: Sales Organization, Distribution Channel, Division, Purchasing Organization e Purchasing Group.",
          classification: "MS"
        },
        {
          id: "step_06_6.6.1",
          sourceRef: "6.6.1",
          description: "Responder ao solicitante pedindo que informe explicitamente se a Division deve ser 50 ou 52 para o item/contrato. Aguardar resposta antes de prosseguir.",
          classification: "MS"
        },
        {
          id: "step_06_6.7",
          sourceRef: "6.7",
          description: "Preencher os campos na aba Overview e demais abas solicitadas: vendor number, validation period, pricing date, currency; inserir itens e salvar o Trading Contract. Campos obrigat\u00f3rios na Overview: Antes de salvar, verificar presen\u00e7a de Vendor Number, Validation Period, Pricing Date, Currency, Item Number e Strategy Code. A\u00e7\u00e3o quando campos obrigat\u00f3rios ausentes: Condi\u00e7\u00e3o: Algum campo obrigat\u00f3rio listado em ctl-mandatory-fields estiver vazio ou inconsistente.. A\u00e7\u00f5es: N\u00e3o salvar o contrato.; Retornar ao solicitante pedindo as informa\u00e7\u00f5es faltantes e anotar no registro de solicita\u00e7\u00e3o.. Resultado: 6.7 \u00b7 Preencher os campos na aba Overview e demais abas solicitadas: vendor number, validation period, pricing date, currency; inserir itens e salvar o Trading Contract.",
          classification: "MS"
        },
        {
          id: "step_06_6.7.1",
          sourceRef: "6.7.1",
          description: "Acessar a aba 'Overview' e preencher: Vendor Number (conforme e\u2011mail), Validation Period, Pricing Date, Currency. Verificar coer\u00eancia com o pedido.",
          classification: "ME"
        },
        {
          id: "step_06_6.7.2",
          sourceRef: "6.7.2",
          description: "Na \u00e1rea de itens, inserir Item Number, Material (conforme e\u2011mail), Valuation, Plant, Purchase Date Category e Purchase Requisition. Ap\u00f3s inserir os valores, pressionar Enter para validar o item.",
          classification: "ME"
        },
        {
          id: "step_06_6.7.3",
          sourceRef: "6.7.3",
          description: "Abrir a se\u00e7\u00e3o 'Customer data' e atualizar o campo Strategy Code conforme indicado no e\u2011mail ou no anexo Excel.",
          classification: "ME"
        },
        {
          id: "step_06_6.7.4",
          sourceRef: "6.7.4",
          description: "Revisar todos os campos preenchidos; se os campos obrigat\u00f3rios estiverem completos, clicar em Save para gerar o Trading Contract. Anotar o n\u00famero do Trading Contract exibido ap\u00f3s a grava\u00e7\u00e3o.",
          classification: "ME"
        },
        {
          id: "step_06_6.8",
          sourceRef: "6.8",
          description: "Ap\u00f3s a cria\u00e7\u00e3o, usar o T\u2011Code WB23 para pesquisar e visualizar os detalhes do Trading Contract rec\u00e9m\u2011criado.",
          classification: "ME"
        },
        {
          id: "step_06_6.8.1",
          sourceRef: "6.8.1",
          description: "No SAP GUI, executar o T\u2011Code 'WB23 - Trading Contract: Display'.",
          classification: "ME"
        },
        {
          id: "step_06_6.8.2",
          sourceRef: "6.8.2",
          description: "Na tela de exibi\u00e7\u00e3o, digitar o n\u00famero do Trading Contract gerado (anotado no passo de grava\u00e7\u00e3o) e confirmar para visualizar os detalhes completos do contrato.",
          classification: "ME"
        },
        {
          id: "step_06_6.8.3",
          sourceRef: "6.8.3",
          description: "Verificar que o Profit Centre, Strategy Code, Sales Organization, Distribution Channel (DR), Division, Purchasing Organization (0111) e Purchasing Group (H20) est\u00e3o corretos conforme solicita\u00e7\u00e3o. Registrar qualquer diverg\u00eancia. Verifica\u00e7\u00e3o final do contrato exibido: Confirmar que Profit Centre, Strategy Code, Sales Organization, Distribution Channel (DR), Division, Purchasing Organization (0111) e Purchasing Group (H20) correspondem ao solicitado.",
          classification: "MA"
        },
      ]
    },
    {
      id: "step_07",
      sourceStep: "7",
      number: "07",
      title: "Processamento de Faturas Transportation & Terminal \u2014 localizar VBDs e associar/acertar valores Executar a sequ\u00eancia completa para localizar, filtrar,",
      description: "Executar a sequ\u00eancia completa para localizar, filtrar, extrair documentos VBD (Accrual/Receivable) e associ\u00e1\u2011los \u00e0 fatura de Transportation & Terminal, ajustar valores quando necess\u00e1rio, simular regras e publicar via VIM/ZEWB conforme os dados da fatura.",
      classification: "MS",
      classifications: ["MS", "MA"],
      macroBlockId: "execution",
      macroBlockName: "Execution",
      capabilityId: "cap-auto",
      capabilityName: "Capability Automática",
      solutionId: "sol-ia-matching",
      solutionIds: ["sol-ia-matching"],
      technologyType: "IA / Agente",
      rationale: "A localiza\u00e7\u00e3o e reconcilia\u00e7\u00e3o de VBDs exige comparar dados de fatura e registros; IA pode apoiar o matching, sempre com revis\u00e3o humana.",
      effort: {
        level: "high",
        score: 50,
        confidence: "medium",
        drivers: [],
        unknowns: []
      },
      humanInTheLoop: {
        hasHumanControl: true,
        level: "partial",
        description: "`review_required` \u2014 revis\u00e3o humana permanece necess\u00e1ria para dados, exce\u00e7\u00f5es, aprova\u00e7\u00f5es e/ou transa\u00e7\u00f5es financeiras."
      },
      substeps: [
        {
          id: "step_07_7.1",
          sourceRef: "7.1",
          description: "Confirmar os dados principais da fatura no portal/VIM antes de iniciar a associa\u00e7\u00e3o de VBDs e abrir o ambiente ZEWB para buscar VBDs. Verifica\u00e7\u00e3o obrigat\u00f3ria dos campos do cabe\u00e7alho: Os campos VENDOR NUMBER, VENDOR NAME, BANK ACCOUNT, BANK NUMBER, REFERENCE NUMBER, DOCUMENT DATE e GROSS AMOUNT devem estar presentes e corresponder \u00e0 fatura recebida antes de iniciar a associa\u00e7\u00e3o de VBDs. Acesso ao ZEWB (T-code ZEWB): A navega\u00e7\u00e3o para Processing Invoice \u2192 ZEWB deve ser realizada e a tela de Accrual/Receivable VBD Docs deve estar acess\u00edvel antes de inserir par\u00e2metros.",
          classification: "MA"
        },
        {
          id: "step_07_7.1.1",
          sourceRef: "7.1.1",
          description: "No ecr\u00e3 da fatura (Terminal Invoice) verifique visualmente e confirme que os seguintes campos correspondem ao documento f\u00edsico/arquivo recebido: VENDOR NUMBER, VENDOR NAME, BANK ACCOUNT, BANK NUMBER, REFERENCE NUMBER, DOCUMENT DATE e GROSS AMOUNT. Se algum campo estiver incorreto, registre a discrep\u00e2ncia conforme pol\u00edtica local antes de prosseguir.",
          classification: "MA"
        },
        {
          id: "step_07_7.1.2",
          sourceRef: "7.1.2",
          description: "No sistema, abra uma New GUI Window; selecione Processing Invoice \u2192 ZEWB (Custom Trading Expenses Workbench) para iniciar a busca/associa\u00e7\u00e3o de VBDs. Acesso ao ZEWB (T-code ZEWB): A navega\u00e7\u00e3o para Processing Invoice \u2192 ZEWB deve ser realizada e a tela de Accrual/Receivable VBD Docs deve estar acess\u00edvel antes de inserir par\u00e2metros.",
          classification: "ME"
        },
        {
          id: "step_07_7.1.3",
          sourceRef: "7.1.3",
          description: "Dentro do ZEWB: selecione o tipo de documento Accrual / Receivable VBD Docs; informe o VBD Vendor Number e o Transaction Date; marque 'X' em Document Settled; e clique em Execute para carregar a lista de VBDs dispon\u00edveis.",
          classification: "ME"
        },
        {
          id: "step_07_7.2",
          sourceRef: "7.2",
          description: "A partir do resultado Execute no ZEWB, revisar a lista completa (Whole Number of VBD\u2019s Expenses List) e identificar os registros relativos \u00e0 planta/plan location indicada na fatura.",
          classification: "ME"
        },
        {
          id: "step_07_7.2.1",
          sourceRef: "7.2.1",
          description: "Percorra a lista retornada pelo Execute e identifique o campo que representa a Plant/Plan Location; localize quais linhas correspondem \u00e0 planta indicada na fatura.",
          classification: "MA"
        },
        {
          id: "step_07_7.3",
          sourceRef: "7.3",
          description: "Filtrar os resultados por Plant Name e, em seguida, aplicar filtro adicional para localizar a Invoice Name espec\u00edfica extra\u00edda da fatura.",
          classification: "ME"
        },
        {
          id: "step_07_7.3.1",
          sourceRef: "7.3.1",
          description: "No grid de resultados do ZEWB selecione a coluna Plant Name; clique em Set Filter e escolha a planta correspondente \u00e0 fatura.",
          classification: "MA"
        },
        {
          id: "step_07_7.3.2",
          sourceRef: "7.3.2",
          description: "No filtro rec\u00e9m-aberto, insira o valor Invoice Name (conforme a fatura) e selecione a(s) linha(s) que correspondem ao nome da invoice para restringir os registros.",
          classification: "MA"
        },
        {
          id: "step_07_7.4",
          sourceRef: "7.4",
          description: "Filtrar os resultados por Cost Type (ex.: Throughout Fee) e executar a extra\u00e7\u00e3o dos dados filtrados para planilha Excel para c\u00e1lculos posteriores.",
          classification: "ME"
        },
        {
          id: "step_07_7.4.1",
          sourceRef: "7.4.1",
          description: "No ZEWB selecione a coluna Cost Type; aplique o filtro e escolha o cost type relevante (por exemplo, 'Throughout Fee'). Clique em Execute para atualizar o grid com o filtro aplicado.",
          classification: "ME"
        },
        {
          id: "step_07_7.4.2",
          sourceRef: "7.4.2",
          description: "Ap\u00f3s a execu\u00e7\u00e3o do filtro, utilize a op\u00e7\u00e3o de exportar/download do ZEWB para extrair os dados em formato Excel (Selecting the Excel Format / Downloading the file). Salve o arquivo localmente para an\u00e1lise.",
          classification: "ME"
        },
        {
          id: "step_07_7.5",
          sourceRef: "7.5",
          description: "No arquivo Excel exportado, aplicar filtros por Cost Type e calcular a quantidade total para cada tipo de fee, dividindo o total por 42 conforme procedimento descrito.",
          classification: "ME"
        },
        {
          id: "step_07_7.5.1",
          sourceRef: "7.5.1",
          description: "Abra o arquivo Excel, aplique filtro na coluna Cost Type para 'Throughout Fee'; selecione a coluna Quantity e calcule a soma total (total_Throughout). Em seguida, divida total_Throughout por 42 e registre o resultado para uso na associa\u00e7\u00e3o ao VBD.",
          classification: "ME"
        },
        {
          id: "step_07_7.5.2",
          sourceRef: "7.5.2",
          description: "No mesmo arquivo Excel, altere o filtro para 'Lubricity Fee'; some a coluna Quantity (total_Lubricity) e divida por 42. Registre o resultado.",
          classification: "ME"
        },
        {
          id: "step_07_7.6",
          sourceRef: "7.6",
          description: "No Excel filtre por 'Dye Fee', totalize a Quantity, divida por 42 e extraia os Document Numbers que correspondem \u00e0s linhas filtradas para uso na associa\u00e7\u00e3o aos VBDs.",
          classification: "MA"
        },
        {
          id: "step_07_7.6.1",
          sourceRef: "7.6.1",
          description: "Aplique filtro em Cost Type = 'Dye Fee', selecione a coluna Quantity e calcule a soma. Divida o total por 42 e registre o valor.",
          classification: "ME"
        },
        {
          id: "step_07_7.6.2",
          sourceRef: "7.6.2",
          description: "Ainda no arquivo Excel copie os Document Numbers das linhas filtradas (por Throughout/Lubricity/Dye conforme aplic\u00e1vel) para posterior inser\u00e7\u00e3o no campo Accrual VBD do ZEWB.",
          classification: "ME"
        },
        {
          id: "step_07_7.7",
          sourceRef: "7.7",
          description: "Totalize a coluna Quantity (se ainda n\u00e3o feito) e consolide a lista de Document Numbers que ser\u00e3o utilizados para puxar os VBDs no ZEWB.",
          classification: "ME"
        },
        {
          id: "step_07_7.7.1",
          sourceRef: "7.7.1",
          description: "No Excel some a coluna Quantity para obter os totais por cost type; confirme os valores que ser\u00e3o comparados com os Net values trazidos dos VBDs.",
          classification: "ME"
        },
        {
          id: "step_07_7.7.2",
          sourceRef: "7.7.2",
          description: "Consolide e copie a lista de Document Numbers (um por linha ou separados conforme formato aceito pelo ZEWB) para uso no pr\u00f3ximo passo do ZEWB.",
          classification: "ME"
        },
        {
          id: "step_07_7.8",
          sourceRef: "7.8",
          description: "No ZEWB confirmar se Tax Number e Vendor Number foram auto-populados; em seguida abrir o filtro do Accrual VBD e preparar para inserir os n\u00fameros coletados.",
          classification: "MS"
        },
        {
          id: "step_07_7.8.1",
          sourceRef: "7.8.1",
          description: "Verifique que os campos Tax Number e Vendor Number foram preenchidos automaticamente pelo sistema. Se estiverem vazios, registre e corrija com os valores da fatura antes de prosseguir.",
          classification: "ME"
        },
        {
          id: "step_07_7.8.2",
          sourceRef: "7.8.2",
          description: "Clique em Filter no campo Accrual VBD para preparar a inser\u00e7\u00e3o dos Document Numbers/paste dos VBDs.",
          classification: "ME"
        },
        {
          id: "step_07_7.9",
          sourceRef: "7.9",
          description: "Colar os VBD numbers no campo de Line Item, executar a carga dos VBDs, somar os Net values e, caso n\u00e3o bata com o valor da fatura, realizar Overwrite e ajustar os valores de cost types (Throughout, Lubricant, Dye) at\u00e9 que o check status fique verde. Valida\u00e7\u00e3o dos VBDs colados no Line Item: Os Document Numbers colados no campo Line Item devem ser exclusivamente Accrual/Receivable VBDs correspondentes \u00e0 planta e invoice selecionadas; confirme que cada n\u00famero corresponde a um registro leg\u00edtimo retornado pelo ZEWB.",
          classification: "MA"
        },
        {
          id: "step_07_7.9.1",
          sourceRef: "7.9.1",
          description: "No campo Line Item do ZEWB cole a lista de Accrual VBD Document Numbers preparados. Verifique que cada n\u00famero corresponde a um Accrual/Receivable VBD. Valida\u00e7\u00e3o dos VBDs colados no Line Item: Os Document Numbers colados no campo Line Item devem ser exclusivamente Accrual/Receivable VBDs correspondentes \u00e0 planta e invoice selecionadas; confirme que cada n\u00famero corresponde a um registro leg\u00edtimo retornado pelo ZEWB.",
          classification: "MA"
        },
        {
          id: "step_07_7.9.2",
          sourceRef: "7.9.2",
          description: "Clique em Execute para carregar os VBDs nas linhas; aguarde o retorno e verifique os Net values consolidados no resumo.",
          classification: "MS"
        },
        {
          id: "step_07_7.9.3",
          sourceRef: "7.9.3",
          description: "Some os Net values exibidos para os VBDs carregados e compare com o Gross/Net da fatura. Se os valores coincidirem, prossiga; se n\u00e3o coincidirem, executar Overwrite conforme passo seguinte.",
          classification: "MA"
        },
        {
          id: "step_07_7.9.4",
          sourceRef: "7.9.4",
          description: "Se os valores n\u00e3o coincidirem: selecione todos os detalhes a serem alterados e clique em Overwrite of VBD\u2019S; altere os valores para os cost types Throughout Fee, Lubricant Fee e Dye Fee conforme necess\u00e1rio para que o total dos VBDs coincida com o valor da fatura. Ap\u00f3s cada altera\u00e7\u00e3o, confirme a atualiza\u00e7\u00e3o e verifique o Check Status at\u00e9 que fique Green.",
          classification: "ME"
        },
        {
          id: "step_07_7.10",
          sourceRef: "7.10",
          description: "Definir Payment Term manualmente, marcar as Due Dates, revisar Basic Data versus a fatura, acionar Simulate Rules; caso a simula\u00e7\u00e3o n\u00e3o apresente erros, postar a transa\u00e7\u00e3o no portal VIM. A\u00e7\u00e3o ao encontrar erro na Simula\u00e7\u00e3o de Regras: Condi\u00e7\u00e3o: A simula\u00e7\u00e3o (Simulate Rules) retorna erro(s) impedindo a postagem.. A\u00e7\u00f5es: Rever campo(s) destacado(s) na aba Basic Data e comparar com os dados da fatura.; Corrigir discrep\u00e2ncias de valores, contas ou datas diretamente no ZEWB onde permitido.; Retornar para o passo de Overwrite (step-65) se os VBDs ou valores necessitarem de ajuste e reexecutar a carga.. Resultado: 7.9 \u00b7 Colar os VBD numbers no campo de Line Item, executar a carga dos VBDs, somar os Net values e, caso n\u00e3o bata com o valor da fatura, realizar Overwrite e ajustar os valores de cost types (Throughout, Lubricant, Dye) at\u00e9 que o check status fique verde.",
          classification: "MA"
        },
        {
          id: "step_07_7.10.1",
          sourceRef: "7.10.1",
          description: "No ZEWB selecione a op\u00e7\u00e3o de entrada manual de Payment Term e preencha as Due Dates conforme instru\u00e7\u00f5es da fatura/pol\u00edtica de pagamento.",
          classification: "ME"
        },
        {
          id: "step_07_7.10.2",
          sourceRef: "7.10.2",
          description: "Na aba Basic Data compare todos os campos (valores, contas, centro de custo se aplic\u00e1vel) com os dados da fatura. Clique em Simulate Rules e aguarde o resultado da simula\u00e7\u00e3o. A\u00e7\u00e3o ao encontrar erro na Simula\u00e7\u00e3o de Regras: Condi\u00e7\u00e3o: A simula\u00e7\u00e3o (Simulate Rules) retorna erro(s) impedindo a postagem.. A\u00e7\u00f5es: Rever campo(s) destacado(s) na aba Basic Data e comparar com os dados da fatura.; Corrigir discrep\u00e2ncias de valores, contas ou datas diretamente no ZEWB onde permitido.; Retornar para o passo de Overwrite (step-65) se os VBDs ou valores necessitarem de ajuste e reexecutar a carga.. Resultado: 7.9 \u00b7 Colar os VBD numbers no campo de Line Item, executar a carga dos VBDs, somar os Net values e, caso n\u00e3o bata com o valor da fatura, realizar Overwrite e ajustar os valores de cost types (Throughout, Lubricant, Dye) at\u00e9 que o check status fique verde.",
          classification: "MA"
        },
        {
          id: "step_07_7.10.3",
          sourceRef: "7.10.3",
          description: "Se a simula\u00e7\u00e3o indicar que n\u00e3o h\u00e1 erro (status OK), clique para postar a fatura no VIM portal. A postagem finaliza o processamento desta fatura na ferramenta ZEWB/VIM.",
          classification: "ME"
        },
        {
          id: "step_07_7.11",
          sourceRef: "7.11",
          description: "Ap\u00f3s a postagem, confirmar que a fatura foi publicada e verificar o line item correspondente no Vendor Portal, acessando o registro via Vendor Account Number.",
          classification: "MA"
        },
        {
          id: "step_07_7.11.1",
          sourceRef: "7.11.1",
          description: "Verifique no ZEWB/VIM que a opera\u00e7\u00e3o retornou confirma\u00e7\u00e3o de postagem (Posted). Registre o ID de documento gerado, se dispon\u00edvel.",
          classification: "ME"
        },
        {
          id: "step_07_7.11.2",
          sourceRef: "7.11.2",
          description: "No Vendor Portal abra a conta do fornecedor (inserir Vendor Account Number) e localize o line item rec\u00e9m-postado para confirmar valores, datas e refer\u00eancias.",
          classification: "ME"
        },
        {
          id: "step_07_7.12",
          sourceRef: "7.12",
          description: "Confirmar que todas as invoices do lote/processo foram postadas. Registrar conclus\u00e3o do processo para o lote atual e encerrar a sess\u00e3o ZEWB.",
          classification: "ME"
        },
        {
          id: "step_07_7.12.1",
          sourceRef: "7.12.1",
          description: "Verifique a lista de open invoices no VIM Workplace para confirmar que as faturas tratadas foram movidas para Posted; salve logs ou capturas necess\u00e1rias e encerre a New GUI Window do ZEWB.",
          classification: "ME"
        },
      ]
    },
    {
      id: "step_08",
      sourceStep: "8",
      number: "08",
      title: "Processo de Fatura de Pipeline \u2014 Tarifa de Pipeline Sequ\u00eancia operacional para validar, localizar VBDs, reconciliar valores e aplicar regras para fatu",
      description: "Sequ\u00eancia operacional para validar, localizar VBDs, reconciliar valores e aplicar regras para faturas de Pipeline Tariff usando VIM Workplace e buscas relacionadas.",
      classification: "MS",
      classifications: ["MS", "MA"],
      macroBlockId: "execution",
      macroBlockName: "Execution",
      capabilityId: "cap-auto",
      capabilityName: "Capability Automática",
      solutionId: "sol-ia-matching",
      solutionIds: ["sol-ia-matching"],
      technologyType: "IA / Agente",
      rationale: "A reconcilia\u00e7\u00e3o de tarifa e valores exige an\u00e1lise de correspond\u00eancia e toler\u00e2ncia; um agente pode priorizar candidatos, n\u00e3o confirmar sozinho a postagem.",
      effort: {
        level: "high",
        score: 50,
        confidence: "medium",
        drivers: [],
        unknowns: []
      },
      humanInTheLoop: {
        hasHumanControl: true,
        level: "partial",
        description: "`review_required` \u2014 revis\u00e3o humana permanece necess\u00e1ria para dados, exce\u00e7\u00f5es, aprova\u00e7\u00f5es e/ou transa\u00e7\u00f5es financeiras."
      },
      substeps: [
        {
          id: "step_08_8.1",
          sourceRef: "8.1",
          description: "Validar os campos obrigat\u00f3rios exibidos na ficha da fatura no VIM Workplace antes de avan\u00e7ar. Valida\u00e7\u00e3o dos campos obrigat\u00f3rios da fatura: Confirmar presen\u00e7a e correspond\u00eancia dos campos VENDOR NUMBER, VENDOR NAME, BANK ACCOUNT, BANK NUMBER, REFERENCE NUMBER, DOCUMENT DATE e GROSS AMOUNT antes de qualquer associa\u00e7\u00e3o de VBD.",
          classification: "MA"
        },
        {
          id: "step_08_8.1.1",
          sourceRef: "8.1.1",
          description: "Verifique e anote os seguintes campos na fatura: VENDOR NUMBER, VENDOR NAME, BANK ACCOUNT, BANK NUMBER.",
          classification: "ME"
        },
        {
          id: "step_08_8.1.2",
          sourceRef: "8.1.2",
          description: "Verifique e anote os seguintes campos na fatura: REFERENCE NUMBER, DOCUMENT DATE, GROSS AMOUNT.",
          classification: "ME"
        },
        {
          id: "step_08_8.2",
          sourceRef: "8.2",
          description: "Mudar a visualiza\u00e7\u00e3o para Team View para acessar a\u00e7\u00f5es de manipula\u00e7\u00e3o de VBD associadas \u00e0 equipe.",
          classification: "ME"
        },
        {
          id: "step_08_8.2.1",
          sourceRef: "8.2.1",
          description: "No VIM Workplace, clicar em 'Switch view' e selecionar 'Team view'. Confirmar que a tela apresenta campos e bot\u00f5es referentes ao trabalho em equipe (buscas VBD, Overwrite etc.).",
          classification: "ME"
        },
        {
          id: "step_08_8.3",
          sourceRef: "8.3",
          description: "Navegar at\u00e9 Other Data e iniciar a pesquisa por Accrual VBDs relacionados \u00e0 fatura.",
          classification: "ME"
        },
        {
          id: "step_08_8.3.1",
          sourceRef: "8.3.1",
          description: "Na visualiza\u00e7\u00e3o da fatura (Team view), abrir a aba ou se\u00e7\u00e3o 'Other data' onde est\u00e1 a op\u00e7\u00e3o 'Search Accrual VBD'.",
          classification: "ME"
        },
        {
          id: "step_08_8.4",
          sourceRef: "8.4",
          description: "Inserir Vendor Number na tela de busca de Accrual VBD e executar a pesquisa.",
          classification: "ME"
        },
        {
          id: "step_08_8.4.1",
          sourceRef: "8.4.1",
          description: "No campo 'Vendor Number' da tela 'Search Accrual VBD', digitar o VENDOR NUMBER exatamente como aparece na fatura.",
          classification: "ME"
        },
        {
          id: "step_08_8.4.2",
          sourceRef: "8.4.2",
          description: "Clicar em 'Execute' ou 'Search' para iniciar a busca de Accrual VBDs para o fornecedor informado.",
          classification: "ME"
        },
        {
          id: "step_08_8.5",
          sourceRef: "8.5",
          description: "Avaliar se a pesquisa por Accrual VBD retornou registros relacionados. Verificar My Tickets em FIORI quando n\u00e3o houver VBDs: Se a busca por Accrual VBD n\u00e3o retornar resultados, pesquisar em FIORI > My Tickets usando External Number (BOL) e/ou Actual Quantity conforme nota do procedimento.",
          classification: "MS"
        },
        {
          id: "step_08_8.6",
          sourceRef: "8.6",
          description: "Se a busca por Accrual VBD n\u00e3o retornar resultados, pesquisar em FIORI > My Tickets usando crit\u00e9rios alternativos indicados. Verificar My Tickets em FIORI quando n\u00e3o houver VBDs: Se a busca por Accrual VBD n\u00e3o retornar resultados, pesquisar em FIORI > My Tickets usando External Number (BOL) e/ou Actual Quantity conforme nota do procedimento.",
          classification: "ME"
        },
        {
          id: "step_08_8.6.1",
          sourceRef: "8.6.1",
          description: "Abrir a aplica\u00e7\u00e3o FIORI e selecionar 'My Tickets'.",
          classification: "ME"
        },
        {
          id: "step_08_8.6.2",
          sourceRef: "8.6.2",
          description: "Na tela 'My Tickets' usar os filtros: pesquisar pelo n\u00famero BOL no campo 'External Number' e/ou pela quantidade no campo 'Actual Quantity'.",
          classification: "ME"
        },
        {
          id: "step_08_8.6.3",
          sourceRef: "8.6.3",
          description: "Se a pesquisa em My Tickets retornar registros que correspondem \u00e0 fatura (BOL/quantidade), anotar os identificadores VBD pertinentes para posterior associa\u00e7\u00e3o na tela 'Search Accrual VBD'. Em seguida, voltar para a tela de Accrual VBD da fatura e executar a busca novamente usando os dados localizados.",
          classification: "MA"
        },
        {
          id: "step_08_8.7",
          sourceRef: "8.7",
          description: "Na lista de VBDs retornada escolha o item com a descri\u00e7\u00e3o aplic\u00e1vel (por exemplo JET A), comparar o valor do VBD com o valor bruto da fatura e preparar para sobrescrever VBDs se os valores coincidirem.",
          classification: "MA"
        },
        {
          id: "step_08_8.7.1",
          sourceRef: "8.7.1",
          description: "Identificar e selecionar na listagem o VBD cuja descri\u00e7\u00e3o corresponda ao produto (ex.: 'JET A').",
          classification: "MA"
        },
        {
          id: "step_08_8.7.2",
          sourceRef: "8.7.2",
          description: "Comparar o valor do VBD selecionado com o campo GROSS AMOUNT da fatura. Confirmar se os dois montantes s\u00e3o id\u00eanticos.",
          classification: "MA"
        },
        {
          id: "step_08_8.7.3",
          sourceRef: "8.7.3",
          description: "Se os montantes coincidirem, clicar em 'Overwrite VBD\u2019S' para associar o VBD \u00e0 fatura conforme a sele\u00e7\u00e3o.",
          classification: "ME"
        },
        {
          id: "step_08_8.8",
          sourceRef: "8.8",
          description: "Verificar que, ap\u00f3s sobrescrever o(s) VBD(s), o balance entre fatura e VBD \u00e9 zero e ent\u00e3o salvar as altera\u00e7\u00f5es. Valida\u00e7\u00e3o dos campos obrigat\u00f3rios da fatura: Confirmar presen\u00e7a e correspond\u00eancia dos campos VENDOR NUMBER, VENDOR NAME, BANK ACCOUNT, BANK NUMBER, REFERENCE NUMBER, DOCUMENT DATE e GROSS AMOUNT antes de qualquer associa\u00e7\u00e3o de VBD.",
          classification: "MA"
        },
        {
          id: "step_08_8.8.1",
          sourceRef: "8.8.1",
          description: "Na tela de associa\u00e7\u00e3o, confirmar que a diferen\u00e7a entre o TOTAL do(s) VBD(s) e o GROSS AMOUNT da fatura \u00e9 ZERO.",
          classification: "ME"
        },
        {
          id: "step_08_8.8.2",
          sourceRef: "8.8.2",
          description: "Se o balance for zero, clicar em 'Save' para persistir a associa\u00e7\u00e3o VBD \u2194 fatura.",
          classification: "ME"
        },
        {
          id: "step_08_8.9",
          sourceRef: "8.9",
          description: "Informar na fatura os campos adicionais requeridos antes da simula\u00e7\u00e3o de regras: Reference Number, Vendor Number (se necess\u00e1rio repetir) e Payment Terms.",
          classification: "ME"
        },
        {
          id: "step_08_8.9.1",
          sourceRef: "8.9.1",
          description: "No campo 'Reference Number' da fatura, preencher o valor conforme a documenta\u00e7\u00e3o/nota fiscal.",
          classification: "ME"
        },
        {
          id: "step_08_8.9.2",
          sourceRef: "8.9.2",
          description: "Confirmar que o 'Vendor Number' est\u00e1 preenchido corretamente; se estiver vazio ou incorreto, inserir o Vendor Number correto.",
          classification: "ME"
        },
        {
          id: "step_08_8.9.3",
          sourceRef: "8.9.3",
          description: "Selecionar ou definir os 'Payment Terms' apropriados conforme pol\u00edtica ou conforme indicado na fatura.",
          classification: "ME"
        },
        {
          id: "step_08_8.10",
          sourceRef: "8.10",
          description: "Executar 'Simulate rules' e, somente se n\u00e3o houver erros na simula\u00e7\u00e3o, aplicar as regras resultantes. Simula\u00e7\u00e3o obrigat\u00f3ria antes de aplicar regras: Executar 'Simulate rules' e confirmar que n\u00e3o h\u00e1 erros na simula\u00e7\u00e3o antes de clicar em 'Apply rules'.",
          classification: "ME"
        },
        {
          id: "step_08_8.10.1",
          sourceRef: "8.10.1",
          description: "Na tela da fatura, clicar em 'Simulate rules' para que o sistema verifique e gere as propostas de contabiliza\u00e7\u00e3o/aplica\u00e7\u00e3o de regras.",
          classification: "ME"
        },
        {
          id: "step_08_8.10.2",
          sourceRef: "8.10.2",
          description: "Analisar o painel de resultados da simula\u00e7\u00e3o. Confirmar aus\u00eancia de erros antes de prosseguir para aplicar as regras.",
          classification: "MA"
        },
        {
          id: "step_08_8.10.3",
          sourceRef: "8.10.3",
          description: "Se a simula\u00e7\u00e3o n\u00e3o apresentar erros, clicar em 'Apply rules' para aplicar a contabiliza\u00e7\u00e3o e demais tratamentos autom\u00e1ticos.",
          classification: "ME"
        },
      ]
    },
    {
      id: "step_09",
      sourceStep: "9",
      number: "09",
      title: "Processo de D\u00e9bito Gain/Loss (Pipeline Gain/Loss) \u2014 Extra\u00e7\u00e3o NK e cria\u00e7\u00e3o/associa\u00e7\u00e3o manual de VBD Sequ\u00eancia execut\u00e1vel para validar a fatura Gain/Los",
      description: "Sequ\u00eancia execut\u00e1vel para validar a fatura Gain/Loss no VIM, extrair Nomination Key (NK) via SAP Fiori, selecionar o NK adequado (maior quantidade atualizada), criar VBD manual no ZEWB e associar/compensar a fatura via campo de Accrual VBD no VIM at\u00e9 saldo zero.",
      classification: "ME",
      classifications: ["ME", "MS"],
      macroBlockId: "execution",
      macroBlockName: "Execution",
      capabilityId: "cap-auto",
      capabilityName: "Capability Automática",
      solutionId: "sol-rpa-upload-vim",
      solutionIds: ["sol-rpa-upload-vim"],
      technologyType: "RPA",
      rationale: "A extra\u00e7\u00e3o de NK e cria\u00e7\u00e3o de VBD t\u00eam passos repetitivos, mas a sele\u00e7\u00e3o e associa\u00e7\u00e3o dependem de dados do caso.",
      effort: {
        level: "high",
        score: 50,
        confidence: "medium",
        drivers: [],
        unknowns: []
      },
      humanInTheLoop: {
        hasHumanControl: true,
        level: "partial",
        description: "`review_required` \u2014 revis\u00e3o humana permanece necess\u00e1ria para dados, exce\u00e7\u00f5es, aprova\u00e7\u00f5es e/ou transa\u00e7\u00f5es financeiras."
      },
      substeps: [
        {
          id: "step_09_9.1",
          sourceRef: "9.1",
          description: "1) Acesse o VIM Workplace e localize a fatura identificada como Gain/Loss pelo campo de descri\u00e7\u00e3o. 2) Verifique os campos SAP na fatura: VENDOR NUMBER, VENDOR NAME, BANK ACCOUNT, BANK NUMBER, REFERENCE NUMBER, DOCUMENT DATE e GROSS AMOUNT. 3) Confirme que os valores da fatura batem com os documentos recebidos (anexo ou imagem da fatura). Verifica\u00e7\u00e3o obrigat\u00f3ria dos campos SAP na fatura: Confirmar VENDOR NUMBER, VENDOR NAME, BANK ACCOUNT, BANK NUMBER, REFERENCE NUMBER, DOCUMENT DATE e GROSS AMOUNT antes de prosseguir com extra\u00e7\u00e3o de NK e cria\u00e7\u00e3o de VBD.",
          classification: "ME"
        },
        {
          id: "step_09_9.2",
          sourceRef: "9.2",
          description: "1) Abra a aplica\u00e7\u00e3o SAP Fiori apropriada para Nominations. 2) Navegue at\u00e9 a op\u00e7\u00e3o 'My Nomination' (ou equivalente na sua Fiori) conforme o layout padr\u00e3o.",
          classification: "ME"
        },
        {
          id: "step_09_9.3",
          sourceRef: "9.3",
          description: "1) Ao carregar 'My Nomination', confirme que a tela abriu com o layout padr\u00e3o. 2) Prepare-se para aplicar filtros por sistema de transporte e per\u00edodo de scheduled date (pr\u00f3ximo passo).",
          classification: "ME"
        },
        {
          id: "step_09_9.4",
          sourceRef: "9.4",
          description: "1) No painel de filtros, selecione o campo de Transport System e insira o(s) transport system(s) relevantes para a fatura Gain/Loss. 2) Insira a Scheduled Date correspondente ao per\u00edodo da fatura (Invoice period). 3) Clique no bot\u00e3o 'GO' para executar a procura e carregar as linhas de nomination relacionadas ao per\u00edodo e transport system informados.",
          classification: "MA"
        },
        {
          id: "step_09_9.5",
          sourceRef: "9.5",
          description: "1) Abra a op\u00e7\u00e3o de Table Personalization na lista de nominations retornada. 2) Selecione as colunas necess\u00e1rias para an\u00e1lise: Nomination Key, Ticket Status, Actual Quantity, Schedule Type e quaisquer outras colunas de interesse. 3) Confirme (OK) e exporte o resultado para arquivo Excel usando a fun\u00e7\u00e3o de exporta\u00e7\u00e3o da Fiori.",
          classification: "ME"
        },
        {
          id: "step_09_9.6",
          sourceRef: "9.6",
          description: "1) No Excel exportado (ou na pr\u00f3pria Fiori, se preferir), aplique filtro na coluna Ticket Status para manter apenas linhas com status 'actualized'.",
          classification: "ME"
        },
        {
          id: "step_09_9.7",
          sourceRef: "9.7",
          description: "1) Aplique filtro na coluna Schedule Type para manter apenas os tipos que iniciam com 'D' (indicados como 'D*' no procedimento).",
          classification: "ME"
        },
        {
          id: "step_09_9.8",
          sourceRef: "9.8",
          description: "1) Na coluna Actual Quantity, ordene os valores do maior para o menor. 2) Identifique a Nomination Key correspondente \u00e0 maior Actual Quantity filtrada \u2014 este NK ser\u00e1 utilizado para alocar o valor da fatura.",
          classification: "MA"
        },
        {
          id: "step_09_9.9",
          sourceRef: "9.9",
          description: "1) Copie ou anote a Nomination Key escolhida (maior Actual Quantity). 2) Abra o SAP T-code ZEWB \u2014 Custom Trading Expense Workbench para iniciar a cria\u00e7\u00e3o manual do VBD (debito).",
          classification: "ME"
        },
        {
          id: "step_09_9.10",
          sourceRef: "9.10",
          description: "1) No ZEWB, no formul\u00e1rio de cria\u00e7\u00e3o, insira a Nomination Key no campo correspondente e adicione os items da nomination conforme necess\u00e1rio (nomination key items). 2) Selecione a linha apropriada que representa o item a ser debitado e clique em 'Create Expense' para iniciar a cria\u00e7\u00e3o do lan\u00e7amento de despesa/VBD.",
          classification: "MA"
        },
        {
          id: "step_09_9.11",
          sourceRef: "9.11",
          description: "1) No formul\u00e1rio de Expense, preencha os campos conforme abaixo: - Expense Class: F25 (Pipeline Gain/Loss) - Account: A (Inventory Account) - Accrual/Type: 3 (Accrual) - Vendor Code: informe o c\u00f3digo do fornecedor conforme fatura - Posting Date: data corrente (hoje) - Net Amount: valor l\u00edquido tomado da fatura - Reference: refer\u00eancia conforme consta na fatura",
          classification: "ME"
        },
        {
          id: "step_09_9.12",
          sourceRef: "9.12",
          description: "1) Ap\u00f3s preencher todos os campos, selecione 'Save' para gerar o documento VBD. 2) Copie o n\u00famero do documento VBD gerado (document number) para uso posterior na associa\u00e7\u00e3o no VIM.",
          classification: "ME"
        },
        {
          id: "step_09_9.13",
          sourceRef: "9.13",
          description: "1) No VIM Workplace, abra a se\u00e7\u00e3o 'Other Data' e utilize a fun\u00e7\u00e3o 'Search accrual VBD'. 2) Cole o n\u00famero do documento VBD copiado no campo de busca e execute a pesquisa para identificar a VBD criada e suas linhas associadas.",
          classification: "ME"
        },
        {
          id: "step_09_9.14",
          sourceRef: "9.14",
          description: "1) No painel de resultados da busca Accrual VBD, verifique as linhas exibidas. 2) Selecione a Accrual VBD encontrada e insira o n\u00famero no campo 'Accrual VBD number' e clique em 'Execute' para carregar os items que podem ser associados \u00e0 fatura.",
          classification: "ME"
        },
        {
          id: "step_09_9.15",
          sourceRef: "9.15",
          description: "Definir se as linhas da VBD devem ser acrescentadas ou substitu\u00eddas antes de exibir e salvar a associa\u00e7\u00e3o.",
          classification: "ME"
        },
        {
          id: "step_09_9.16",
          sourceRef: "9.16",
          description: "1) Clique em 'Append' para acrescentar as linhas da VBD ao conjunto atual apresentado na tela. 2) Revise os line items exibidos ap\u00f3s o Append: verifique quantias, contas e taxa de c\u00e2mbio (se aplic\u00e1vel) para assegurar que os valores a acrescentar correspondem ao valor da fatura. 3) Confirme a sele\u00e7\u00e3o local das linhas que ser\u00e3o efetivamente aplicadas contra a fatura. 4) Ap\u00f3s revis\u00e3o, proceda para salvar (pr\u00f3ximo passo comum).",
          classification: "MA"
        },
        {
          id: "step_09_9.17",
          sourceRef: "9.17",
          description: "1) Clique em 'Overwrite' para substituir as linhas atualmente apresentadas na tela pelas linhas da VBD selecionada. 2) Revise cuidadosamente as linhas que ir\u00e3o substituir as existentes: confirme contas de compensa\u00e7\u00e3o, quantias e qualquer diferen\u00e7a que altere o lan\u00e7amento cont\u00e1bil. 3) Se a substitui\u00e7\u00e3o for adequada, confirme a inten\u00e7\u00e3o de sobrescrever; caso contr\u00e1rio, cancele e retorne \u00e0 decis\u00e3o anterior. 4) Ap\u00f3s revis\u00e3o e confirma\u00e7\u00e3o, proceda para salvar (pr\u00f3ximo passo comum).",
          classification: "ME"
        },
        {
          id: "step_09_9.18",
          sourceRef: "9.18",
          description: "1) Clique em 'Save' para persistir a associa\u00e7\u00e3o entre a fatura e a VBD (ap\u00f3s Append ou Overwrite). 2) Aguarde a confirma\u00e7\u00e3o do sistema e verifique a mensagem de sucesso. 3) Confirme que o saldo da fatura ficou zero (balance is zero). 4) Registre o n\u00famero do VBD associado e quaisquer identificadores de documento de contabiliza\u00e7\u00e3o para rastreio e auditoria.",
          classification: "MS"
        },
      ]
    },
    {
      id: "step_10",
      sourceStep: "10",
      number: "10",
      title: "Processar faturas Pipeline Y\u2011Grade e encargos de transporte: identifica\u00e7\u00e3o, casamento e cria\u00e7\u00e3o manual de VBD Sequ\u00eancia execut\u00e1vel para identificar a",
      description: "Sequ\u00eancia execut\u00e1vel para identificar a fatura Pipeline Y\u2011Grade ou de transporte no VIM, localizar/obter Nomination Key (NK) via Fiori, reconciliar VBDs com a fatura, criar VBD manual (ZEWB) quando necess\u00e1rio e finalizar o casamento e verifica\u00e7\u00e3o das regras antes da postagem.",
      classification: "MS",
      classifications: ["MS", "MA"],
      macroBlockId: "execution",
      macroBlockName: "Execution",
      capabilityId: "cap-auto",
      capabilityName: "Capability Automática",
      solutionId: "sol-ia-matching",
      solutionIds: ["sol-ia-matching"],
      technologyType: "IA / Agente",
      rationale: "O casamento de invoices, encargos e VBDs envolve m\u00faltiplas fontes e crit\u00e9rios de correspond\u00eancia; requer valida\u00e7\u00e3o humana.",
      effort: {
        level: "high",
        score: 50,
        confidence: "medium",
        drivers: [],
        unknowns: []
      },
      humanInTheLoop: {
        hasHumanControl: true,
        level: "partial",
        description: "`review_required` \u2014 revis\u00e3o humana permanece necess\u00e1ria para dados, exce\u00e7\u00f5es, aprova\u00e7\u00f5es e/ou transa\u00e7\u00f5es financeiras."
      },
      substeps: [
        {
          id: "step_10_10.1",
          sourceRef: "10.1",
          description: "No VIM Workplace, acione o bot\u00e3o \"Simulate rules\" para avaliar o estado do processamento antes de aplicar regras/postagem. Exce\u00e7\u00e3o \u2014 Simulate rules (pr\u00e9-aplica\u00e7\u00e3o) sinaliza erro: Condi\u00e7\u00e3o: Ao acionar 'Simulate rules' qualquer Exception reason apresentar indica\u00e7\u00e3o vermelha.. A\u00e7\u00f5es: Limpar a exce\u00e7\u00e3o utilizando os procedimentos de clearing de exce\u00e7\u00f5es do VIM conforme pol\u00edticas internas (VIM exception clearing ways).; Corrigir os dados apontados pela exce\u00e7\u00e3o (por exemplo, dados do VBD ou campos obrigat\u00f3rios da fatura) e reaplicar as a\u00e7\u00f5es anteriores necess\u00e1rias.; Ap\u00f3s limpeza da exce\u00e7\u00e3o, acionar novamente 'Simulate rules' para verifica\u00e7\u00e3o antes de aplicar regras.. Resultado: 10.1 \u00b7 No VIM Workplace, acione o bot\u00e3o \"Simulate rules\" para avaliar o estado do processamento antes de aplicar regras/postagem.",
          classification: "MS"
        },
        {
          id: "step_10_10.2",
          sourceRef: "10.2",
          description: "Com a fatura aberta no VIM Workplace, confirme os campos SAP essenciais para processamento e casamento com VBD: Controle \u2014 valida\u00e7\u00e3o obrigat\u00f3ria de campos SAP na fatura: Antes de qualquer tentativa de casar VBDs, confirme que os campos VENDOR NUMBER, VENDOR NAME, BANK ACCOUNT, BANK NUMBER, REFERENCE NUMBER, DOCUMENT DATE e GROSS AMOUNT estejam preenchidos e correspondam \u00e0 documenta\u00e7\u00e3o da fatura.",
          classification: "MA"
        },
        {
          id: "step_10_10.2.1",
          sourceRef: "10.2.1",
          description: "Verifique explicitamente: VENDOR NUMBER, VENDOR NAME, BANK ACCOUNT, BANK NUMBER, REFERENCE NUMBER, DOCUMENT DATE e GROSS AMOUNT. Registre discrep\u00e2ncias antes de avan\u00e7ar.",
          classification: "ME"
        },
        {
          id: "step_10_10.3",
          sourceRef: "10.3",
          description: "Abrir o aplicativo Fiori adequado e utilizar a fun\u00e7\u00e3o My Nominations (ou equivalente) para localizar o Nomination Key necess\u00e1rio para cria\u00e7\u00e3o manual de VBD.",
          classification: "ME"
        },
        {
          id: "step_10_10.3.1",
          sourceRef: "10.3.1",
          description: "No Fiori, pesquisar pelas Nomea\u00e7\u00f5es (My Nominations) aplicando filtros conforme dispon\u00edvel para localizar NK que corresponde \u00e0 fatura.",
          classification: "MA"
        },
        {
          id: "step_10_10.4",
          sourceRef: "10.4",
          description: "No Fiori aplique o filtro do transport system (ex.: Phillips 66) e informe a data programada (scheduled date) do m\u00eas correspondente ao per\u00edodo da fatura; executar a pesquisa e, no resultado, selecionar a nomination localizada por Location e escolher o line item apropri (ex.: line item 10) para iniciar o processo de cria\u00e7\u00e3o do VBD manual.",
          classification: "MA"
        },
        {
          id: "step_10_10.5",
          sourceRef: "10.5",
          description: "Quando a fatura exigir o mesmo procedimento de cria\u00e7\u00e3o de VBD utilizado no processo Gain/Loss, executar os mesmos passos operacionais (refer\u00eancia interna: passos 13 a 20 do processo Gain/Loss).",
          classification: "ME"
        },
        {
          id: "step_10_10.6",
          sourceRef: "10.6",
          description: "Para faturas classificadas como Transportation (conforme descri\u00e7\u00e3o da fatura), abrir a fatura no VIM Workplace e revalidar os dados SAP chave (VENDOR NUMBER, VENDOR NAME, BANK ACCOUNT, BANK NUMBER, REFERENCE NUMBER, DOCUMENT DATE, GROSS AMOUNT) antes da busca por VBDs. Controle \u2014 valida\u00e7\u00e3o obrigat\u00f3ria de campos SAP na fatura: Antes de qualquer tentativa de casar VBDs, confirme que os campos VENDOR NUMBER, VENDOR NAME, BANK ACCOUNT, BANK NUMBER, REFERENCE NUMBER, DOCUMENT DATE e GROSS AMOUNT estejam preenchidos e correspondam \u00e0 documenta\u00e7\u00e3o da fatura.",
          classification: "MA"
        },
        {
          id: "step_10_10.7",
          sourceRef: "10.7",
          description: "No VIM, acionar Other data \u2192 Search accrual VBD. Informar o per\u00edodo/lift date conforme indicado na fatura (o campo \"period date\" na fatura corresponde ao lift date) e executar a pesquisa para listar VBDs reportados para esse per\u00edodo.",
          classification: "MA"
        },
        {
          id: "step_10_10.8",
          sourceRef: "10.8",
          description: "Com a listagem de VBD aberta, exportar os detalhes (por exemplo, para Excel) para confrontar com os dados da fatura e identificar tickets ou n\u00fameros n\u00e3o casados. Controle \u2014 exportar detalhes de VBD para reconcilia\u00e7\u00e3o: Exportar os detalhes do VBD (incluindo ticket numbers, quantities e location) para uma planilha para confronto com a planilha de tickets da fatura. Preservar os registros exportados para auditoria.",
          classification: "MA"
        },
        {
          id: "step_10_10.9",
          sourceRef: "10.9",
          description: "Quando forem encontrados tickets n\u00e3o casados, abrir o Fiori e usar My Nominations para localizar informa\u00e7\u00f5es da nomination associada aos tickets n\u00e3o casados para obter NK e demais detalhes necess\u00e1rios para cria\u00e7\u00e3o do VBD manual.",
          classification: "ME"
        },
        {
          id: "step_10_10.10",
          sourceRef: "10.10",
          description: "Filtrar no Fiori por transport system correspondente e por scheduled date no m\u00eas da fatura; executar (Go) e exportar o relat\u00f3rio de nominations para planilha a fim de alinh\u00e1-la com a planilha de tickets n\u00e3o casados.",
          classification: "MA"
        },
        {
          id: "step_10_10.11",
          sourceRef: "10.11",
          description: "Alinhar a planilha exportada do Fiori com a planilha de tickets n\u00e3o casados, confrontando Actual Quantity, Location Description e Nomination Number. Se ainda houver tickets sem NK, gerar Dew Ticket em Trade 66 para solicitar ao D2D COE os detalhes dos VBDs n\u00e3o-fired.",
          classification: "MS"
        },
        {
          id: "step_10_10.12",
          sourceRef: "10.12",
          description: "Acessar a transa\u00e7\u00e3o ZEWB (Custom Trading Expense Workbench) para criar o VBD manualmente. Informar o Nomination Key (NK) e os itens de nomination correspondentes antes de criar a despesa.",
          classification: "MA"
        },
        {
          id: "step_10_10.12.1",
          sourceRef: "10.12.1",
          description: "No ZEWB, inserir o Nomination Key identificado e incluir os nomination items que representam os tickets a serem cobrados.",
          classification: "ME"
        },
        {
          id: "step_10_10.13",
          sourceRef: "10.13",
          description: "Selecionar o item de nomination identificado e clicar em Create expense. Preencher os campos conforme padr\u00e3o para Pipeline Tariff/Transportation:",
          classification: "ME"
        },
        {
          id: "step_10_10.13.1",
          sourceRef: "10.13.1",
          description: "Preencher: Expense class = F18 (pipeline tariff), Inventory Account = A, Accrual indicator = 3, Vendor code conforme fatura, Posting date = data atual, Net amount = valor l\u00edquido conforme VIM Workplace, Reference = n\u00famero de refer\u00eancia da fatura.",
          classification: "ME"
        },
        {
          id: "step_10_10.14",
          sourceRef: "10.14",
          description: "Salvar a cria\u00e7\u00e3o do VBD no ZEWB e copiar o n\u00famero do documento gerado para uso no casamento da fatura no VIM.",
          classification: "ME"
        },
        {
          id: "step_10_10.15",
          sourceRef: "10.15",
          description: "Retornar ao VIM Workplace \u2192 Other data \u2192 Search accrual VBD, informar o document number copiado do ZEWB, executar e usar o resultado para casar/associar os line items da fatura.",
          classification: "ME"
        },
        {
          id: "step_10_10.15.1",
          sourceRef: "10.15.1",
          description: "No campo accrual VBD informar o n\u00famero do documento criado no ZEWB e executar para que o VBD seja exibido para associa\u00e7\u00e3o com a fatura.",
          classification: "ME"
        },
        {
          id: "step_10_10.16",
          sourceRef: "10.16",
          description: "No VIM, clicar Append/Append VBD para exibir os line items do VBD, salvar a associa\u00e7\u00e3o; confirmar que o saldo da fatura ficou zero. Em seguida, acionar novamente o bot\u00e3o \"Simulate rules\" e verificar que todas as exce\u00e7\u00f5es estejam em estado verde antes de aplicar regras e prosseguir para postagem. Exce\u00e7\u00e3o \u2014 Simulate rules ap\u00f3s cria\u00e7\u00e3o/append do VBD: Condi\u00e7\u00e3o: Ap\u00f3s anexar o VBD e salvar, o 'Simulate rules' retornar indica\u00e7\u00e3o vermelha em qualquer exce\u00e7\u00e3o.. A\u00e7\u00f5es: Executar os procedimentos de clearing de exce\u00e7\u00f5es do VIM conforme as pr\u00e1ticas documentadas.; Se a exce\u00e7\u00e3o estiver relacionada a dados do VBD rec\u00e9m-criado, validar no ZEWB e corrigir os campos (recriar/ajustar VBD se necess\u00e1rio) antes de nova simula\u00e7\u00e3o.; Re-simular as regras quando corre\u00e7\u00f5es realizadas.. Resultado: 10.16 \u00b7 No VIM, clicar Append/Append VBD para exibir os line items do VBD, salvar a associa\u00e7\u00e3o; confirmar que o saldo da fatura ficou zero. Em seguida, acionar novamente o bot\u00e3o \"Simulate rules\" e verificar que todas as exce\u00e7\u00f5es estejam em estado verde antes de aplicar regras e prosseguir para postagem.",
          classification: "ME"
        },
      ]
    },
    {
      id: "step_11",
      sourceStep: "11",
      number: "11",
      title: "Processamento de Faturas de Inspe\u00e7\u00e3o \u2014 fluxo Auto\u2011fired VBD Sequ\u00eancia execut\u00e1vel para localizar, validar e processar faturas de inspe\u00e7\u00e3o que disparam",
      description: "Sequ\u00eancia execut\u00e1vel para localizar, validar e processar faturas de inspe\u00e7\u00e3o que disparam VBD automaticamente (Auto\u2011fired VBD) no VIM Workplace (S/4). Inclui verifica\u00e7\u00e3o de toler\u00e2ncia, sobrescrita/app\u00eandice de VBD, c\u00e1lculos de linha, simula\u00e7\u00e3o de regras e postagem.",
      classification: "SA",
      classifications: ["SA", "MS"],
      macroBlockId: "execution",
      macroBlockName: "Execution",
      capabilityId: "cap-auto",
      capabilityName: "Capability Automática",
      solutionId: "sol-eval-anomaly",
      solutionIds: ["sol-eval-anomaly"],
      technologyType: "Evaluator / Controle",
      rationale: "O fluxo parte de VBD auto-fired, mas exige valida\u00e7\u00e3o de dados e tratamento de diverg\u00eancias antes da postagem.",
      effort: {
        level: "medium",
        score: 50,
        confidence: "medium",
        drivers: [],
        unknowns: []
      },
      humanInTheLoop: {
        hasHumanControl: true,
        level: "partial",
        description: "`review_required` \u2014 revis\u00e3o humana permanece necess\u00e1ria para dados, exce\u00e7\u00f5es, aprova\u00e7\u00f5es e/ou transa\u00e7\u00f5es financeiras."
      },
      substeps: [
        {
          id: "step_11_11.1",
          sourceRef: "11.1",
          description: "Acessar o sistema SAP e selecionar o ambiente de produ\u00e7\u00e3o indicado.",
          classification: "ME"
        },
        {
          id: "step_11_11.1.1",
          sourceRef: "11.1.1",
          description: "No portal SAP, selecione S/4 Production conforme a entrada AE66 S4 Prod (PS1).",
          classification: "ME"
        },
        {
          id: "step_11_11.2",
          sourceRef: "11.2",
          description: "Entrar no VIM Workplace para processamento de faturas.",
          classification: "ME"
        },
        {
          id: "step_11_11.2.1",
          sourceRef: "11.2.1",
          description: "No SAP, abra o VIM workspace, clique em 'Processing Invoice' e execute o T-Code /OPT/VIM_WR_VIM Workplace.",
          classification: "ME"
        },
        {
          id: "step_11_11.3",
          sourceRef: "11.3",
          description: "Ao abrir o VIM, alternar a vista para localizar itens da equipe e faturas de inspe\u00e7\u00e3o.",
          classification: "ME"
        },
        {
          id: "step_11_11.3.1",
          sourceRef: "11.3.1",
          description: "Verifique que a tela com a listagem de diversos invoices foi exibida.",
          classification: "ME"
        },
        {
          id: "step_11_11.3.2",
          sourceRef: "11.3.2",
          description: "Clicar em 'Switch work view' e selecionar a op\u00e7\u00e3o 'Team view' para visualizar itens do time al\u00e9m dos seus diretos.",
          classification: "ME"
        },
        {
          id: "step_11_11.4",
          sourceRef: "11.4",
          description: "Aplicar filtros para isolar faturas de inspe\u00e7\u00e3o e abrir a fatura espec\u00edfica para processamento.",
          classification: "ME"
        },
        {
          id: "step_11_11.4.1",
          sourceRef: "11.4.1",
          description: "Usar o filtro dispon\u00edvel na Team View para separar as faturas do tipo inspe\u00e7\u00e3o.",
          classification: "ME"
        },
        {
          id: "step_11_11.4.2",
          sourceRef: "11.4.2",
          description: "Selecionar a invoice filtrada (ex.: CAMIN CARGO CONTROL, INC) e clicar em 'Execute' para abrir os detalhes.",
          classification: "ME"
        },
        {
          id: "step_11_11.5",
          sourceRef: "11.5",
          description: "Confirmar correspond\u00eancia dos principais campos exibidos com os valores da fatura f\u00edsica/arquivo.",
          classification: "MA"
        },
        {
          id: "step_11_11.5.1",
          sourceRef: "11.5.1",
          description: "Indexar e conferir Vendor Number, Vendor Name, Bank Account, Bank Number, Reference Number, Document Date e Gross Amount com os valores na fatura.",
          classification: "ME"
        },
        {
          id: "step_11_11.5.2",
          sourceRef: "11.5.2",
          description: "Identificar a Nomination Key presente na invoice a ser usada para localizar VBD.",
          classification: "ME"
        },
        {
          id: "step_11_11.5.3",
          sourceRef: "11.5.3",
          description: "Navegar para a aba 'Other Data' e clicar na aba 'Search VBD' para pesquisar VBDs relacionados \u00e0 Nomination Key.",
          classification: "ME"
        },
        {
          id: "step_11_11.6",
          sourceRef: "11.6",
          description: "Executar a pesquisa do VBD a partir da Nomination Key informada na fatura.",
          classification: "ME"
        },
        {
          id: "step_11_11.6.1",
          sourceRef: "11.6.1",
          description: "Confirmar que Tax Number e Vendor Number podem ter preenchimento autom\u00e1tico; inserir a Nomination Key e clicar em 'Execute (F8)'.",
          classification: "ME"
        },
        {
          id: "step_11_11.6.2",
          sourceRef: "11.6.2",
          description: "Ao executar, observar os VBDs de accrual exibidos para valida\u00e7\u00e3o posterior.",
          classification: "ME"
        },
        {
          id: "step_11_11.7",
          sourceRef: "11.7",
          description: "Confirmar que o VBD exibido corresponde \u00e0 fatura (conta do fornecedor, datas, local, status de settle e produto) e avaliar se atende ao limite de toler\u00e2ncia para uso do VBD. Regra de toler\u00e2ncia para uso de VBD: Validar que a diferen\u00e7a entre os valores da invoice e o VBD esteja dentro da toler\u00e2ncia de +/- $5000 antes de aplicar o VBD. Escalar para Scheduler quando excede toler\u00e2ncia: Diferen\u00e7a entre invoice e VBD excede a toler\u00e2ncia de +/- $5000. \u00b7 Scheduler respons\u00e1vel indicado na invoice (para faturas crude usar o scheduler fixo: Emmanuella)",
          classification: "MA"
        },
        {
          id: "step_11_11.8",
          sourceRef: "11.8",
          description: "Quando o VBD for v\u00e1lido e dentro da toler\u00e2ncia, atribuir o VBD \u00e0 fatura.",
          classification: "MA"
        },
        {
          id: "step_11_11.8.1",
          sourceRef: "11.8.1",
          description: "Marcar o VBD retornado na lista para associ\u00e1\u2011lo \u00e0 invoice.",
          classification: "ME"
        },
        {
          id: "step_11_11.8.2",
          sourceRef: "11.8.2",
          description: "Clicar em 'Overwrite VBD' para usar o VBD selecionado. Se for necess\u00e1rio somar VBDs, utilizar 'Append VBDs' para adicionar.",
          classification: "ME"
        },
        {
          id: "step_11_11.9",
          sourceRef: "11.9",
          description: "Modificar valores na aba 'Line Items' conforme necess\u00e1rio, recalcular e salvar para que o saldo passe a zero e o status fique verde.",
          classification: "ME"
        },
        {
          id: "step_11_11.9.1",
          sourceRef: "11.9.1",
          description: "Na aba 'Line Items', alterar o Invoice Amount conforme a necessidade do casamento com o VBD.",
          classification: "ME"
        },
        {
          id: "step_11_11.9.2",
          sourceRef: "11.9.2",
          description: "Executar 'Recalculate' para aplicar ajustes e ent\u00e3o 'Save'. Verificar que o saldo fica zero e o status aparece em verde.",
          classification: "ME"
        },
        {
          id: "step_11_11.10",
          sourceRef: "11.10",
          description: "Configurar a data base (baseline date) e as condi\u00e7\u00f5es de pagamento (payment term) antes de simular regras.",
          classification: "ME"
        },
        {
          id: "step_11_11.10.1",
          sourceRef: "11.10.1",
          description: "Abrir a aba 'Accounting', inserir/ajustar o baseline date e o payment term conforme a invoice.",
          classification: "ME"
        },
        {
          id: "step_11_11.11",
          sourceRef: "11.11",
          description: "Simular as regras para verificar se h\u00e1 erros antes de aplicar as regras e postar a invoice. Tratamento de erro de simula\u00e7\u00e3o: Condi\u00e7\u00e3o: Simulate Rules retorna status vermelho (erros detectados).. A\u00e7\u00f5es: Identificar mensagens de erro apresentadas pela simula\u00e7\u00e3o.; Corrigir os dados afetados (p.ex. ajustes em Line Items, VBD selecionado, datas, valores).; Reexecutar 'Simulate Rules' ap\u00f3s aplicar as corre\u00e7\u00f5es.. Resultado: 11.11 \u00b7 Simular as regras para verificar se h\u00e1 erros antes de aplicar as regras e postar a invoice.",
          classification: "MS"
        },
        {
          id: "step_11_11.12",
          sourceRef: "11.12",
          description: "Clicar em 'Apply Rules' para que a fatura seja postada no sistema ap\u00f3s simula\u00e7\u00e3o bem\u2011sucedida.",
          classification: "ME"
        },
        {
          id: "step_11_11.12.1",
          sourceRef: "11.12.1",
          description: "Executar a a\u00e7\u00e3o 'Apply Rules' e confirmar que a invoice foi postada (status indicativo do sistema).",
          classification: "ME"
        },
        {
          id: "step_11_11.13",
          sourceRef: "11.13",
          description: "Quando a simula\u00e7\u00e3o indicar erros, revisar os detalhes, corrigir e repetir a simula\u00e7\u00e3o. Tratamento de erro de simula\u00e7\u00e3o: Condi\u00e7\u00e3o: Simulate Rules retorna status vermelho (erros detectados).. A\u00e7\u00f5es: Identificar mensagens de erro apresentadas pela simula\u00e7\u00e3o.; Corrigir os dados afetados (p.ex. ajustes em Line Items, VBD selecionado, datas, valores).; Reexecutar 'Simulate Rules' ap\u00f3s aplicar as corre\u00e7\u00f5es.. Resultado: 11.11 \u00b7 Simular as regras para verificar se h\u00e1 erros antes de aplicar as regras e postar a invoice.",
          classification: "MS"
        },
        {
          id: "step_11_11.13.1",
          sourceRef: "11.13.1",
          description: "Identificar as mensagens de erro apresentadas pela simula\u00e7\u00e3o e corrigir os dados relacionados (p.ex. valores, VBD, datas). Tratamento de erro de simula\u00e7\u00e3o: Condi\u00e7\u00e3o: Simulate Rules retorna status vermelho (erros detectados).. A\u00e7\u00f5es: Identificar mensagens de erro apresentadas pela simula\u00e7\u00e3o.; Corrigir os dados afetados (p.ex. ajustes em Line Items, VBD selecionado, datas, valores).; Reexecutar 'Simulate Rules' ap\u00f3s aplicar as corre\u00e7\u00f5es.. Resultado: 11.11 \u00b7 Simular as regras para verificar se h\u00e1 erros antes de aplicar as regras e postar a invoice.",
          classification: "MS"
        },
        {
          id: "step_11_11.13.2",
          sourceRef: "11.13.2",
          description: "Ap\u00f3s aplicar corre\u00e7\u00f5es, retornar ao passo de simula\u00e7\u00e3o (d106_simulate_rules) e executar novamente. Tratamento de erro de simula\u00e7\u00e3o: Condi\u00e7\u00e3o: Simulate Rules retorna status vermelho (erros detectados).. A\u00e7\u00f5es: Identificar mensagens de erro apresentadas pela simula\u00e7\u00e3o.; Corrigir os dados afetados (p.ex. ajustes em Line Items, VBD selecionado, datas, valores).; Reexecutar 'Simulate Rules' ap\u00f3s aplicar as corre\u00e7\u00f5es.. Resultado: 11.11 \u00b7 Simular as regras para verificar se h\u00e1 erros antes de aplicar as regras e postar a invoice.",
          classification: "MS"
        },
      ]
    },
    {
      id: "step_12",
      sourceStep: "12",
      number: "12",
      title: "Processamento de Faturas de Inspe\u00e7\u00e3o \u2014 Cria\u00e7\u00e3o Manual de VBD (Trip e Non-Trip) Sequ\u00eancia operacional para criar manualmente um VBD (ZEWB) para faturas",
      description: "Sequ\u00eancia operacional para criar manualmente um VBD (ZEWB) para faturas de inspe\u00e7\u00e3o quando n\u00e3o h\u00e1 auto-fire VBD. Inclui navega\u00e7\u00e3o inicial, exibi\u00e7\u00e3o de nomination, valida\u00e7\u00e3o contra a c\u00f3pia da fatura, cria\u00e7\u00e3o de VBD em modo Trip ou Non\u2011Trip, retorno ao VIM Workplace para associar o VBD ao invoice e simula\u00e7\u00e3o/aplica\u00e7\u00e3o de regras para postagem.",
      classification: "ME",
      classifications: ["ME", "MS"],
      macroBlockId: "execution",
      macroBlockName: "Execution",
      capabilityId: "cap-auto",
      capabilityName: "Capability Automática",
      solutionId: "sol-rpa-upload-vim",
      solutionIds: ["sol-rpa-upload-vim"],
      technologyType: "RPA",
      rationale: "A cria\u00e7\u00e3o manual tem campos estruturados, por\u00e9m alterna Trip/Non-Trip e depende de dados externos e aprova\u00e7\u00e3o.",
      effort: {
        level: "high",
        score: 50,
        confidence: "medium",
        drivers: [],
        unknowns: []
      },
      humanInTheLoop: {
        hasHumanControl: true,
        level: "partial",
        description: "`review_required` \u2014 revis\u00e3o humana permanece necess\u00e1ria para dados, exce\u00e7\u00f5es, aprova\u00e7\u00f5es e/ou transa\u00e7\u00f5es financeiras."
      },
      substeps: [
        {
          id: "step_12_12.1",
          sourceRef: "12.1",
          description: "No VIM Workplace, clique no bot\u00e3o Enter para carregar a tela atual. Na tela resultante, selecione a aba 'Other data' e clique na op\u00e7\u00e3o 'New Page' para abrir a p\u00e1gina usada para consulta de nomination.",
          classification: "ME"
        },
        {
          id: "step_12_12.2",
          sourceRef: "12.2",
          description: "Na nova p\u00e1gina aberta, execute a transa\u00e7\u00e3o O4NSN (Display Nomination). Aguarde a exibi\u00e7\u00e3o da tela de consulta de nomination.",
          classification: "MS"
        },
        {
          id: "step_12_12.3",
          sourceRef: "12.3",
          description: "Digite a Nomination Key conforme consta na c\u00f3pia da fatura no campo vazio e pressione Enter. Quando a barra de refer\u00eancia 'transport system' for exibida, d\u00ea duplo clique nessa barra e selecione a op\u00e7\u00e3o 'Secondary Costing Pig View' na visualiza\u00e7\u00e3o de nomination.",
          classification: "ME"
        },
        {
          id: "step_12_12.4",
          sourceRef: "12.4",
          description: "Compare os dados exibidos na tela de Display Nomination com os valores da c\u00f3pia da fatura para identificar o line item v\u00e1lido a ser usado na cria\u00e7\u00e3o do VBD. Valida\u00e7\u00e3o de janela de data do Schedule Date: Confirmar que o 'Schedule Date' do line item est\u00e1 dentro de \u00b115 dias do 'Job Finish Date' informado na c\u00f3pia da fatura antes de prosseguir com a cria\u00e7\u00e3o do VBD.",
          classification: "MA"
        },
        {
          id: "step_12_12.5",
          sourceRef: "12.5",
          description: "Abra uma nova janela SAP e execute a transa\u00e7\u00e3o ZEWB (Custom Trading Expense Workbench) para iniciar a cria\u00e7\u00e3o manual do VBD.",
          classification: "ME"
        },
        {
          id: "step_12_12.6",
          sourceRef: "12.6",
          description: "Escolha o modo correto de cria\u00e7\u00e3o de VBD conforme o tipo de codifica\u00e7\u00e3o fornecida.",
          classification: "ME"
        },
        {
          id: "step_12_12.7",
          sourceRef: "12.7",
          description: "No ZEWB selecione a op\u00e7\u00e3o 'Trip related', insira a Nomination Key e clique no \u00edcone Execute. Aguarde o resultado com os line items dispon\u00edveis.",
          classification: "MS"
        },
        {
          id: "step_12_12.8",
          sourceRef: "12.8",
          description: "Ap\u00f3s a execu\u00e7\u00e3o, identifique o line item que bate perfeitamente com a c\u00f3pia da fatura (Product, Location, Schedule Date). Selecione essa linha e clique em 'Create Expense' para iniciar a entrada dos dados do VBD. Valida\u00e7\u00e3o de janela de data do Schedule Date: Confirmar que o 'Schedule Date' do line item est\u00e1 dentro de \u00b115 dias do 'Job Finish Date' informado na c\u00f3pia da fatura antes de prosseguir com a cria\u00e7\u00e3o do VBD.",
          classification: "ME"
        },
        {
          id: "step_12_12.9",
          sourceRef: "12.9",
          description: "Preencha os campos obrigat\u00f3rios do VBD com os valores da c\u00f3pia da fatura e do line item selecionado. Campos obrigat\u00f3rios a inserir: 1) Expanse Class group = 'Z1'; 2) Expanse Class = conforme tipo de taxa da fatura; 3) Accounting Type = 'A' (para Trip-related); 4) Posting Category = '3'; 5) Posting Date = data atual; 6) Partner = n\u00famero do fornecedor; 7) Net amount = valor l\u00edquido da fatura; 8) Reference = n\u00famero da fatura; 9) Document Date = data da fatura. Ap\u00f3s preencher, pressione Enter, verifique os valores exibidos e clique em Save.",
          classification: "ME"
        },
        {
          id: "step_12_12.10",
          sourceRef: "12.10",
          description: "Ao salvar, ser\u00e1 gerado o documento VBD. Copie o n\u00famero do documento VBD exibido na tela para uso no VIM Workplace.",
          classification: "ME"
        },
        {
          id: "step_12_12.11",
          sourceRef: "12.11",
          description: "Retorne \u00e0 janela do VIM Workplace. Na aba 'Other data' acesse a aba 'Search VBD'. Verifique se Tax Number e Vendor Number foram preenchidos automaticamente. Cole o n\u00famero do documento VBD no campo 'Accrual VBD number' e clique em Execute (F8).",
          classification: "ME"
        },
        {
          id: "step_12_12.12",
          sourceRef: "12.12",
          description: "Na tela de resultados selecione o accrual VBD apropriado. Clique em 'Overwrite VBD' para substituir ou em 'Append VBDs' para adicionar. Em seguida, v\u00e1 para a aba 'Line Items' e preencha o campo 'Lift date' com a data 'Job Finished' indicada na fatura. Depois acesse a aba 'Accounting' e atualize o 'Baseline Date' e os detalhes de 'Payment Term' relacionados \u00e0 fatura. Salve as altera\u00e7\u00f5es e clique em 'Simulate Rules'.",
          classification: "ME"
        },
        {
          id: "step_12_12.13",
          sourceRef: "12.13",
          description: "Ap\u00f3s executar 'Simulate Rules', verifique a tela de status para identificar erros. A simula\u00e7\u00e3o indica sucesso quando o status aparece em verde. A\u00e7\u00e3o em caso de Simulate Rules com erros (status vermelho): Condi\u00e7\u00e3o: Simulate Rules retorna status vermelho indicando erro(s).. A\u00e7\u00f5es: Revisar os campos preenchidos nas abas Line Items e Accounting (baseline date, payment term, valores e refer\u00eancias).; Corrigir os campos identificados e salvar novamente o VBD no ZEWB, se necess\u00e1rio.; Retornar ao passo de execu\u00e7\u00e3o 'Simulate Rules' ap\u00f3s corre\u00e7\u00f5es.. Escalonamento: Erro persiste ap\u00f3s tentativas de corre\u00e7\u00e3o e nova simula\u00e7\u00e3o. \u00b7 Supervisor de AP. Resultado: 12.12 \u00b7 Na tela de resultados selecione o accrual VBD apropriado. Clique em 'Overwrite VBD' para substituir ou em 'Append VBDs' para adicionar. Em seguida, v\u00e1 para a aba 'Line Items' e preencha o campo 'Lift date' com a data 'Job Finished' indicada na fatura. Depois acesse a aba 'Accounting' e atualize o 'Baseline Date' e os detalhes de 'Payment Term' relacionados \u00e0 fatura. Salve as altera\u00e7\u00f5es e clique em 'Simulate Rules'. Escalar problemas de simula\u00e7\u00e3o n\u00e3o resolvidos: Solicitante n\u00e3o consegue corrigir erros identificados pela simula\u00e7\u00e3o dentro do tempo esperado. \u00b7 Supervisor de AP",
          classification: "MS"
        },
        {
          id: "step_12_12.14",
          sourceRef: "12.14",
          description: "Se a simula\u00e7\u00e3o indicar status satisfat\u00f3rio, clique em 'Apply Rules'. A a\u00e7\u00e3o resultar\u00e1 na postagem da fatura no sistema.",
          classification: "ME"
        },
        {
          id: "step_12_12.15",
          sourceRef: "12.15",
          description: "Se o scheduler forneceu Plant, Material e Strategy, no ZEWB selecione a op\u00e7\u00e3o 'Non-Trip related'. Insira Plant, Material e Strategy conforme informado pelo scheduler. Preencha os campos obrigat\u00f3rios do VBD conforme procedimento (Expanse Class group = 'Z1'; Expanse Class conforme tipo; Accounting Type = 'B' para Non-Trip; Posting Category = '3'; Posting Date, Partner, Net amount, Reference, Document Date). Pressione Enter, verifique e clique em Save. Ap\u00f3s salvar, copie o n\u00famero do VBD gerado e retorne ao VIM Workplace para seguir os passos de pesquisa e associa\u00e7\u00e3o do VBD (retornar ao passo 'step-115').",
          classification: "ME"
        },
      ]
    },
    {
      id: "step_13",
      sourceStep: "13",
      number: "13",
      title: "Roteamento a Scheduler e Processamento Crude Non\u2011Trip Related Sequ\u00eancia execut\u00e1vel para identificar quando encaminhar uma fatura ao scheduler e o proc",
      description: "Sequ\u00eancia execut\u00e1vel para identificar quando encaminhar uma fatura ao scheduler e o procedimento completo para processar faturas Crude Non\u2011Trip (cria\u00e7\u00e3o de Trading Contract via ZEWB, cria\u00e7\u00e3o de VBD, sobrescrita e postagem).",
      classification: "MS",
      classifications: ["MS"],
      macroBlockId: "routing",
      macroBlockName: "Routing",
      capabilityId: "cap-auto",
      capabilityName: "Capability Automática",
      solutionId: "sol-wf-routing",
      solutionIds: ["sol-wf-routing"],
      technologyType: "Workflow",
      rationale: "O encaminhamento ao Scheduler depende de crit\u00e9rios de neg\u00f3cio, informa\u00e7\u00e3o faltante e acompanhamento de retorno.",
      effort: {
        level: "medium",
        score: 50,
        confidence: "medium",
        drivers: [],
        unknowns: []
      },
      humanInTheLoop: {
        hasHumanControl: true,
        level: "partial",
        description: "`approval_required` \u2014 revis\u00e3o humana permanece necess\u00e1ria para dados, exce\u00e7\u00f5es, aprova\u00e7\u00f5es e/ou transa\u00e7\u00f5es financeiras."
      },
      substeps: [
        {
          id: "step_13_13.1",
          sourceRef: "13.1",
          description: "Decidir se a fatura deve ser encaminhada ao scheduler para codifica\u00e7\u00e3o.",
          classification: "MS"
        },
        {
          id: "step_13_13.2",
          sourceRef: "13.2",
          description: "Acionar a op\u00e7\u00e3o que encaminha a fatura para a fila do scheduler.",
          classification: "MS"
        },
        {
          id: "step_13_13.2.1",
          sourceRef: "13.2.1",
          description: "Na tela da fatura no VIM Workplace, clique em 'Refer to Scheduler' para iniciar o encaminhamento.",
          classification: "MS"
        },
        {
          id: "step_13_13.3",
          sourceRef: "13.3",
          description: "Preencher o coment\u00e1rio de solicita\u00e7\u00e3o de codifica\u00e7\u00e3o no popup e salvar para encaminhar ao scheduler. Requisito: usar o formato de coment\u00e1rio destacado: Inserir a solicita\u00e7\u00e3o de coding no formato destacado no popup de coment\u00e1rio antes de salvar.",
          classification: "MS"
        },
        {
          id: "step_13_13.3.1",
          sourceRef: "13.3.1",
          description: "No popup de coment\u00e1rio exibido ap\u00f3s 'Refer to Scheduler', digite a solicita\u00e7\u00e3o de coding seguindo o formato destacado na tela e clique no \u00edcone salvar. Requisito: usar o formato de coment\u00e1rio destacado: Inserir a solicita\u00e7\u00e3o de coding no formato destacado no popup de coment\u00e1rio antes de salvar.",
          classification: "MS"
        },
        {
          id: "step_13_13.3.2",
          sourceRef: "13.3.2",
          description: "Clique no \u00edcone de salvar para registrar o coment\u00e1rio e prosseguir com a sele\u00e7\u00e3o do scheduler.",
          classification: "ME"
        },
        {
          id: "step_13_13.4",
          sourceRef: "13.4",
          description: "Selecionar o scheduler indicado (conforme contato exibido) e clicar em 'Continue' para enviar a fatura \u00e0 fila do scheduler selecionado. Scheduler fixo para faturas Crude: Para faturas de produto Crude, selecionar o scheduler fixo Emmanuella.Ekhaguere@p66.com quando dispon\u00edvel.",
          classification: "ME"
        },
        {
          id: "step_13_13.4.1",
          sourceRef: "13.4.1",
          description: "Na tela que aparece ap\u00f3s salvar o coment\u00e1rio, localize o contato do scheduler fornecido na fatura, selecione o ID correspondente e clique em 'Continue'. Scheduler fixo para faturas Crude: Para faturas de produto Crude, selecionar o scheduler fixo Emmanuella.Ekhaguere@p66.com quando dispon\u00edvel.",
          classification: "MA"
        },
        {
          id: "step_13_13.4.2",
          sourceRef: "13.4.2",
          description: "Ap\u00f3s clicar 'Continue', verifique que a fatura foi movida para a fila do scheduler (confirma\u00e7\u00e3o visual na tela).",
          classification: "ME"
        },
        {
          id: "step_13_13.5",
          sourceRef: "13.5",
          description: "Para invoices de produto Crude, o roteamento \u00e9 id\u00eantico por\u00e9m com scheduler fixo. Use o scheduler fixo especificado quando a fatura for Crude. Scheduler fixo para faturas Crude: Para faturas de produto Crude, selecionar o scheduler fixo Emmanuella.Ekhaguere@p66.com quando dispon\u00edvel.",
          classification: "ME"
        },
        {
          id: "step_13_13.6",
          sourceRef: "13.6",
          description: "Abrir a fatura no VIM Workplace, clicar em 'Comment' e confirmar que o scheduler aprovou/codificou a fatura antes de prosseguir com cria\u00e7\u00e3o de Trading Contract / VBD.",
          classification: "ME"
        },
        {
          id: "step_13_13.6.1",
          sourceRef: "13.6.1",
          description: "Navegue ao VIM Workplace e abra a fatura a ser processada.",
          classification: "ME"
        },
        {
          id: "step_13_13.6.2",
          sourceRef: "13.6.2",
          description: "Clique em 'Comment' e verifique o status/aprova\u00e7\u00e3o do scheduler exibida no hist\u00f3rico de coment\u00e1rios. Se estiver aprovada, prossiga; se n\u00e3o, aguarde ou reencaminhe conforme necess\u00e1rio.",
          classification: "MS"
        },
        {
          id: "step_13_13.7",
          sourceRef: "13.7",
          description: "Abrir a transa\u00e7\u00e3o ZEWB, inserir o n\u00famero do Trading Contract referente \u00e0 localiza\u00e7\u00e3o (ex.: Ferndale) a partir do arquivo Excel exportado e executar para localizar o contract. Verifica\u00e7\u00e3o: tratamento de erros ap\u00f3s 'Simulate Rules': Confirmar que a simula\u00e7\u00e3o de regras n\u00e3o retornou mensagens de erro antes de aplicar a regra.",
          classification: "ME"
        },
        {
          id: "step_13_13.7.1",
          sourceRef: "13.7.1",
          description: "No SAP, acesse o c\u00f3digo de transa\u00e7\u00e3o ZEWB e prepare-se para inserir o Trading Contract number.",
          classification: "ME"
        },
        {
          id: "step_13_13.7.2",
          sourceRef: "13.7.2",
          description: "Digite o n\u00famero do Trading Contract (obtido do arquivo Excel exportado sob a variante 'JUANID') e clique no \u00edcone 'Execute' para carregar a lista de contracts.",
          classification: "ME"
        },
        {
          id: "step_13_13.7.3",
          sourceRef: "13.7.3",
          description: "Se receber detalhes de local ou produto n\u00e3o existentes, contacte o scheduler respons\u00e1vel para obter o coding adequado antes de criar um novo Trading Contract.",
          classification: "MS"
        },
        {
          id: "step_13_13.8",
          sourceRef: "13.8",
          description: "Na lista retornada pela execu\u00e7\u00e3o do ZEWB, selecione o item correspondente e acione 'Create Expense' para iniciar a inclus\u00e3o da despesa (VBD).",
          classification: "MA"
        },
        {
          id: "step_13_13.8.1",
          sourceRef: "13.8.1",
          description: "Marque a linha do Trading Contract que corresponde ao job location e clique em 'Create Expense'.",
          classification: "MA"
        },
        {
          id: "step_13_13.8.2",
          sourceRef: "13.8.2",
          description: "Preencha os campos: Expense class group, Expense Group, Accounting Type, Posting Categories, Posting Date, Partner, Net Amount, Reference Number e Text. Pressione Enter e salve o registro para gerar o VBD.",
          classification: "ME"
        },
        {
          id: "step_13_13.9",
          sourceRef: "13.9",
          description: "Copiar o n\u00famero do VBD gerado no ZEWB e, no VIM Workplace, abrir a aba 'Other Data' e selecionar 'Search Accrual VBD' para localizar o VBD no VIM.",
          classification: "ME"
        },
        {
          id: "step_13_13.9.1",
          sourceRef: "13.9.1",
          description: "Ap\u00f3s salvar no ZEWB e confirmar que o VBD foi gerado, copie o n\u00famero do documento VBD exibido.",
          classification: "ME"
        },
        {
          id: "step_13_13.9.2",
          sourceRef: "13.9.2",
          description: "No VIM Workplace, v\u00e1 para a aba 'Other Data' e clique em 'Search Accrual VBD' para preparar a busca pelo n\u00famero copiado.",
          classification: "ME"
        },
        {
          id: "step_13_13.10",
          sourceRef: "13.10",
          description: "Na tela de busca de Accrual VBD, cole/insira o n\u00famero do VBD copiado e clique em 'Execute' para localizar o VBD dentro do VIM.",
          classification: "ME"
        },
        {
          id: "step_13_13.11",
          sourceRef: "13.11",
          description: "Localizado o VBD no VIM, selecionar o VBD e executar a sobrescrita. Em seguida, na aba 'Accounting' inserir Baseline Date e Payment Terms, salvar; usar 'Simulate Rules' para verificar aus\u00eancia de erros; finalmente clicar em 'Apply Rule' para postar a fatura. Verifica\u00e7\u00e3o: tratamento de erros ap\u00f3s 'Simulate Rules': Confirmar que a simula\u00e7\u00e3o de regras n\u00e3o retornou mensagens de erro antes de aplicar a regra.",
          classification: "ME"
        },
        {
          id: "step_13_13.11.1",
          sourceRef: "13.11.1",
          description: "Selecione o VBD retornado na busca e acione a op\u00e7\u00e3o 'Overwrite VBD' para associar o VBD \u00e0 fatura.",
          classification: "ME"
        },
        {
          id: "step_13_13.11.2",
          sourceRef: "13.11.2",
          description: "Abra a aba 'Accounting', preencha o campo 'Baseline Date' e os 'Payment Terms' conforme a fatura e clique em salvar para persistir os dados cont\u00e1beis.",
          classification: "ME"
        },
        {
          id: "step_13_13.11.3",
          sourceRef: "13.11.3",
          description: "Clique em 'Simulate Rules' e verifique se h\u00e1 mensagens de erro. Se n\u00e3o houver erros, prossiga para aplicar a regra. Verifica\u00e7\u00e3o: tratamento de erros ap\u00f3s 'Simulate Rules': Confirmar que a simula\u00e7\u00e3o de regras n\u00e3o retornou mensagens de erro antes de aplicar a regra.",
          classification: "ME"
        },
        {
          id: "step_13_13.11.4",
          sourceRef: "13.11.4",
          description: "Ap\u00f3s simula\u00e7\u00e3o sem erros, clique em 'Apply Rule' para que a fatura seja postada no sistema.",
          classification: "ME"
        },
      ]
    },
    {
      id: "step_14",
      sourceStep: "14",
      number: "14",
      title: "Processar fatura do fornecedor SGS CANADA INC (Non\u2011PO, codifica\u00e7\u00e3o fixa) Procedimento passo a passo para verificar, classificar, aplicar regras, direc",
      description: "Procedimento passo a passo para verificar, classificar, aplicar regras, direcionar para aprova\u00e7\u00e3o e postar faturas do fornecedor SGS CANADA INC usando VIM Workplace (S/4 VIM) com codifica\u00e7\u00e3o fixa (G/L, Material, Profit center).",
      classification: "ME",
      classifications: ["ME", "MS"],
      macroBlockId: "execution",
      macroBlockName: "Execution",
      capabilityId: "cap-auto",
      capabilityName: "Capability Automática",
      solutionId: "sol-rules-coding",
      solutionIds: ["sol-rules-coding"],
      technologyType: "Motor de regras",
      rationale: "A codifica\u00e7\u00e3o fixa do fornecedor \u00e9 repetitiva e pode ser orientada por regras expl\u00edcitas, com confer\u00eancia antes da postagem.",
      effort: {
        level: "medium",
        score: 50,
        confidence: "medium",
        drivers: [],
        unknowns: []
      },
      humanInTheLoop: {
        hasHumanControl: true,
        level: "partial",
        description: "`review_required` \u2014 revis\u00e3o humana permanece necess\u00e1ria para dados, exce\u00e7\u00f5es, aprova\u00e7\u00f5es e/ou transa\u00e7\u00f5es financeiras."
      },
      substeps: [
        {
          id: "step_14_14.1",
          sourceRef: "14.1",
          description: "Abrir a entrada da fatura do fornecedor SGS CANADA INC no VIM Workplace e validar os dados da fatura em rela\u00e7\u00e3o \u00e0 c\u00f3pia f\u00edsica ou PDF.",
          classification: "ME"
        },
        {
          id: "step_14_14.1.1",
          sourceRef: "14.1.1",
          description: "Confirmar que os seguintes campos da fatura correspondem \u00e0 c\u00f3pia do documento: n\u00famero da fatura, data da fatura, valor total, dados banc\u00e1rios (se presentes) e dados do fornecedor. Se houver discrep\u00e2ncias, suspender processamento e anotar as diferen\u00e7as na fatura de trabalho.",
          classification: "MA"
        },
        {
          id: "step_14_14.2",
          sourceRef: "14.2",
          description: "No registro da fatura, alterar o tipo de documento para o tipo espec\u00edfico de Non\u2011PO Manual e salvar o identificador do requisitante. Obrigatoriedade de preencher Requester E\u2011mail: Preencher o campo Requester E\u2011mail com o Email ID do usu\u00e1rio processador antes de salvar o tipo de documento.",
          classification: "ME"
        },
        {
          id: "step_14_14.2.1",
          sourceRef: "14.2.1",
          description: "Clicar em Change Doc Type, selecionar a op\u00e7\u00e3o 'Non\u2011PO Invoice \u2013 Manual uploads' conforme o tipo de processamento manual requerido para SGS CANADA INC.",
          classification: "ME"
        },
        {
          id: "step_14_14.2.2",
          sourceRef: "14.2.2",
          description: "No campo Requester E-mail inserir o seu e\u2011mail (Email ID do usu\u00e1rio que processa a fatura) e salvar o registro pressionando Ctrl + S. Obrigatoriedade de preencher Requester E\u2011mail: Preencher o campo Requester E\u2011mail com o Email ID do usu\u00e1rio processador antes de salvar o tipo de documento.",
          classification: "ME"
        },
        {
          id: "step_14_14.3",
          sourceRef: "14.3",
          description: "Na aba Line\u2011Item informar a codifica\u00e7\u00e3o cont\u00e1bil necess\u00e1ria para SGS CANADA INC (G/L, Material, Valor, Profit center). Codifica\u00e7\u00e3o fixa obrigat\u00f3ria para SGS CANADA INC: Usar os valores fixos: G/L = 50002900; Material = 2100045; Profit center = 5090000001 ao inserir as linhas para o fornecedor SGS CANADA INC.",
          classification: "ME"
        },
        {
          id: "step_14_14.3.1",
          sourceRef: "14.3.1",
          description: "Preencher os campos de linha com: G/L = 50002900; Material = 2100045; Profit center = 5090000001; e inserir o Amount conforme valor na fatura. Confirmar que os valores inseridos batem com a c\u00f3pia da fatura antes de salvar. Codifica\u00e7\u00e3o fixa obrigat\u00f3ria para SGS CANADA INC: Usar os valores fixos: G/L = 50002900; Material = 2100045; Profit center = 5090000001 ao inserir as linhas para o fornecedor SGS CANADA INC.",
          classification: "ME"
        },
        {
          id: "step_14_14.4",
          sourceRef: "14.4",
          description: "Na aba Accounting ajustar a Data Base (Baseline Date) e os Payment Terms conforme os dados da fatura e salvar o registro. Preenchimento obrigat\u00f3rio de Baseline Date e Payment Terms: Na aba Accounting preencher Baseline Date e Payment Terms conforme os dados da fatura antes de salvar.",
          classification: "ME"
        },
        {
          id: "step_14_14.4.1",
          sourceRef: "14.4.1",
          description: "No separador Accounting informar o Baseline Date e os Payment Terms de acordo com a data/condi\u00e7\u00e3o na fatura. Ap\u00f3s preencher, salvar usando Ctrl + S. Preenchimento obrigat\u00f3rio de Baseline Date e Payment Terms: Na aba Accounting preencher Baseline Date e Payment Terms conforme os dados da fatura antes de salvar.",
          classification: "ME"
        },
        {
          id: "step_14_14.5",
          sourceRef: "14.5",
          description: "Executar a op\u00e7\u00e3o Simulate Rules e confirmar que os estados retornados est\u00e3o com sinal verde, exceto o indicador 'Approval required' que pode permanecer pendente conforme o valor.",
          classification: "ME"
        },
        {
          id: "step_14_14.5.1",
          sourceRef: "14.5.1",
          description: "Acionar a fun\u00e7\u00e3o Simulate Rules e aguardar o resultado da simula\u00e7\u00e3o.",
          classification: "ME"
        },
        {
          id: "step_14_14.5.2",
          sourceRef: "14.5.2",
          description: "Confirmar que a simula\u00e7\u00e3o n\u00e3o apresenta erros (todos os checks com status apropriado). Caso haja mensagens de erro ou bloqueio, consultar o procedimento de resolu\u00e7\u00e3o especificado (incerteza sobre o fluxo de tratamento \u2014 ver unknown relacionado).",
          classification: "ME"
        },
        {
          id: "step_14_14.6",
          sourceRef: "14.6",
          description: "Clicar em Apply Rule para que o sistema aplique as regras de workflow. O destino ap\u00f3s Apply Rule depende do valor da fatura (decis\u00e3o de aprova\u00e7\u00e3o).",
          classification: "MS"
        },
        {
          id: "step_14_14.6.1",
          sourceRef: "14.6.1",
          description: "Acionar Apply Rule para iniciar o direcionamento conforme as regras; aguardar confirma\u00e7\u00e3o do sistema de que a a\u00e7\u00e3o foi aplicada.",
          classification: "ME"
        },
        {
          id: "step_14_14.6.2",
          sourceRef: "14.6.2",
          description: "Decidir o fluxo de aprova\u00e7\u00e3o com base no valor total da fatura, conforme as faixas definidas para SGS CANADA INC.",
          classification: "MS"
        },
        {
          id: "step_14_14.7",
          sourceRef: "14.7",
          description: "A fatura entrar\u00e1 na fila do aprovador de primeiro n\u00edvel (gestor interno). Executar e aprovar conforme a rotina de aprova\u00e7\u00e3o padr\u00e3o.",
          classification: "MS"
        },
        {
          id: "step_14_14.7.1",
          sourceRef: "14.7.1",
          description: "Na fila de primeiro n\u00edvel localizar a fatura processada, selecionar a linha correspondente e clicar em Execute para abrir a tela de aprova\u00e7\u00e3o.",
          classification: "MA"
        },
        {
          id: "step_14_14.7.2",
          sourceRef: "14.7.2",
          description: "Ap\u00f3s executar, clicar em Approve para completar a aprova\u00e7\u00e3o de primeiro n\u00edvel. Em seguida seguir para a etapa de inserir e\u2011mail do supervisor para o pr\u00f3ximo n\u00edvel quando exigido (ver s8).",
          classification: "MS"
        },
        {
          id: "step_14_14.8",
          sourceRef: "14.8",
          description: "Para faturas acima de 25.000 USD processar o primeiro n\u00edvel e encaminhar explicitamente ao P66 supervisor no campo indicado para aprova\u00e7\u00e3o de segundo n\u00edvel. Escala\u00e7\u00e3o para aprova\u00e7\u00e3o do P66 supervisor para faturas > 25.000 USD: Fatura com valor superior a 25.000 USD ap\u00f3s Apply Rule e aprova\u00e7\u00e3o de primeiro n\u00edvel. \u00b7 P66 supervisor",
          classification: "MS"
        },
        {
          id: "step_14_14.8.1",
          sourceRef: "14.8.1",
          description: "Selecionar a fatura na fila de primeiro n\u00edvel e clicar em Execute para abrir a tela de aprova\u00e7\u00e3o; preparar o encaminhamento adicional ao supervisor P66 conforme a pol\u00edtica de limites. Escala\u00e7\u00e3o para aprova\u00e7\u00e3o do P66 supervisor para faturas > 25.000 USD: Fatura com valor superior a 25.000 USD ap\u00f3s Apply Rule e aprova\u00e7\u00e3o de primeiro n\u00edvel. \u00b7 P66 supervisor",
          classification: "MS"
        },
        {
          id: "step_14_14.8.2",
          sourceRef: "14.8.2",
          description: "Clicar em Approve (primeiro n\u00edvel) e em seguida inserir o e\u2011mail do supervisor P66 no campo designado para envio ao pr\u00f3ximo n\u00edvel de aprova\u00e7\u00e3o, incluindo notas se necess\u00e1rio (ver s8). Escala\u00e7\u00e3o para aprova\u00e7\u00e3o do P66 supervisor para faturas > 25.000 USD: Fatura com valor superior a 25.000 USD ap\u00f3s Apply Rule e aprova\u00e7\u00e3o de primeiro n\u00edvel. \u00b7 P66 supervisor",
          classification: "MS"
        },
        {
          id: "step_14_14.9",
          sourceRef: "14.9",
          description: "Na tela exibida ap\u00f3s clicar em Approve na aprova\u00e7\u00e3o de primeiro n\u00edvel, informar o e\u2011mail do aprovador do pr\u00f3ximo n\u00edvel e, quando solicitado, inserir coment\u00e1rios pertinentes ao encaminhamento. Escala\u00e7\u00e3o para aprova\u00e7\u00e3o do P66 supervisor para faturas > 25.000 USD: Fatura com valor superior a 25.000 USD ap\u00f3s Apply Rule e aprova\u00e7\u00e3o de primeiro n\u00edvel. \u00b7 P66 supervisor",
          classification: "MS"
        },
        {
          id: "step_14_14.9.1",
          sourceRef: "14.9.1",
          description: "No campo indicado inserir o e\u2011mail do aprovador do pr\u00f3ximo n\u00edvel: para faturas entre 1.000 e 25.000 USD inserir o e\u2011mail do gestor interno; para faturas >25.000 USD inserir o e\u2011mail do P66 supervisor. Inserir coment\u00e1rios concisos no campo Comment se houver instru\u00e7\u00f5es espec\u00edficas, ent\u00e3o salvar/confirmar a a\u00e7\u00e3o de aprova\u00e7\u00e3o. Escala\u00e7\u00e3o para aprova\u00e7\u00e3o do P66 supervisor para faturas > 25.000 USD: Fatura com valor superior a 25.000 USD ap\u00f3s Apply Rule e aprova\u00e7\u00e3o de primeiro n\u00edvel. \u00b7 P66 supervisor",
          classification: "MS"
        },
        {
          id: "step_14_14.10",
          sourceRef: "14.10",
          description: "Ap\u00f3s a aprova\u00e7\u00e3o de todos os n\u00edveis exigidos, confirmar que a fatura foi devidamente postada no sistema. Se a fatura foi de faixa abaixo de 1.000 USD, a postagem ocorrer\u00e1 imediatamente ap\u00f3s Apply Rule conforme end_state definido.",
          classification: "MS"
        },
        {
          id: "step_14_14.10.1",
          sourceRef: "14.10.1",
          description: "Confirmar no sistema que a fatura agora tem status Posted (ou equivalente) e arquivar a c\u00f3pia comprovante no workflow conforme procedimento local.",
          classification: "ME"
        },
      ]
    },
    {
      id: "step_15",
      sourceStep: "15",
      number: "15",
      title: "Processamento Intercompany \u2014 Exportar dados SAP (FAGLL03H) e preparar relat\u00f3rio WD06 Executar extra\u00e7\u00e3o de lan\u00e7amentos intercompany no SAP via FAGLL03H",
      description: "Executar extra\u00e7\u00e3o de lan\u00e7amentos intercompany no SAP via FAGLL03H, preparar planilha, filtrar parceiros comerciais, enviar para respons\u00e1vel e executar o processamento WD06 (categoria, pivot, verifica\u00e7\u00e3o e obsolesc\u00eancia em VIM).",
      classification: "ME",
      classifications: ["ME", "MS"],
      macroBlockId: "codification",
      macroBlockName: "Codification",
      capabilityId: "cap-auto",
      capabilityName: "Capability Automática",
      solutionId: "sol-rpa-report",
      solutionIds: ["sol-rpa-report"],
      technologyType: "RPA / Planilha",
      rationale: "A extra\u00e7\u00e3o FAGLL03H e prepara\u00e7\u00e3o do relat\u00f3rio WD06 seguem uma rotina estruturada de exporta\u00e7\u00e3o e transforma\u00e7\u00e3o.",
      effort: {
        level: "medium",
        score: 50,
        confidence: "medium",
        drivers: [],
        unknowns: []
      },
      humanInTheLoop: {
        hasHumanControl: true,
        level: "partial",
        description: "`review_required` \u2014 revis\u00e3o humana permanece necess\u00e1ria para dados, exce\u00e7\u00f5es, aprova\u00e7\u00f5es e/ou transa\u00e7\u00f5es financeiras."
      },
      substeps: [
        {
          id: "step_15_15.1",
          sourceRef: "15.1",
          description: "No SAP, iniciar o T-Code FAGLL03H - G/L Line-Item Browser para extrair movimentos intercompany.",
          classification: "ME"
        },
        {
          id: "step_15_15.1.1",
          sourceRef: "15.1.1",
          description: "No campo de comando do SAP, inserir 'FAGLL03H' e confirmar para abrir o G/L Line-Item Browser.",
          classification: "ME"
        },
        {
          id: "step_15_15.1.2",
          sourceRef: "15.1.2",
          description: "Confirmar que Company Code, Ledger e G/L Account est\u00e3o preenchidos automaticamente conforme variante selecionada posteriormente.",
          classification: "ME"
        },
        {
          id: "step_15_15.2",
          sourceRef: "15.2",
          description: "Obter a variante predefinida e execut\u00e1-la para popular os par\u00e2metros do relat\u00f3rio.",
          classification: "ME"
        },
        {
          id: "step_15_15.2.1",
          sourceRef: "15.2.1",
          description: "Pressionar Shift+F5 (Get Variant) para exibir variantes salvas.",
          classification: "ME"
        },
        {
          id: "step_15_15.2.2",
          sourceRef: "15.2.2",
          description: "Selecionar a variante identificada como 'P AND T'.",
          classification: "ME"
        },
        {
          id: "step_15_15.2.3",
          sourceRef: "15.2.3",
          description: "Executar a variante pressionando F8 (Execute).",
          classification: "ME"
        },
        {
          id: "step_15_15.3",
          sourceRef: "15.3",
          description: "Modificar o layout do relat\u00f3rio para o layout de fechamento de m\u00eas e executar para obter o formato esperado.",
          classification: "ME"
        },
        {
          id: "step_15_15.3.1",
          sourceRef: "15.3.1",
          description: "Escolher o layout nomeado 'month end close' na lista de layouts dispon\u00edveis.",
          classification: "ME"
        },
        {
          id: "step_15_15.3.2",
          sourceRef: "15.3.2",
          description: "Ap\u00f3s alterar o layout, executar o relat\u00f3rio pressionando F8.",
          classification: "ME"
        },
        {
          id: "step_15_15.4",
          sourceRef: "15.4",
          description: "Gerar a planilha a partir do resultado do relat\u00f3rio e salvar com nome apropriado antes do p\u00f3s-processamento. Prazo de execu\u00e7\u00e3o do relat\u00f3rio intercompany: O relat\u00f3rio intercompany do FAGLL03H normalmente \u00e9 executado no 4\u00ba dia \u00fatil; confirmar execu\u00e7\u00e3o dentro desse prazo. Formato/nomenclatura do arquivo exportado: Confirmar o padr\u00e3o de nomenclatura do arquivo Excel a ser usado ao salvar a exporta\u00e7\u00e3o.",
          classification: "ME"
        },
        {
          id: "step_15_15.4.1",
          sourceRef: "15.4.1",
          description: "No resultado do relat\u00f3rio, clicar com o bot\u00e3o direito em qualquer linha e selecionar a op\u00e7\u00e3o 'Spreadsheet'.",
          classification: "ME"
        },
        {
          id: "step_15_15.4.2",
          sourceRef: "15.4.2",
          description: "Na caixa de di\u00e1logo de exporta\u00e7\u00e3o, alterar o nome do arquivo Excel conforme necess\u00e1rio e confirmar com Enter. Formato/nomenclatura do arquivo exportado: Confirmar o padr\u00e3o de nomenclatura do arquivo Excel a ser usado ao salvar a exporta\u00e7\u00e3o.",
          classification: "ME"
        },
        {
          id: "step_15_15.4.3",
          sourceRef: "15.4.3",
          description: "Confirmar a exporta\u00e7\u00e3o e salvar a planilha no local de trabalho designado.",
          classification: "ME"
        },
        {
          id: "step_15_15.5",
          sourceRef: "15.5",
          description: "No arquivo exportado, filtrar a coluna de 'trading partner' para manter apenas os parceiros 1010 e 1011 e remover as demais linhas. Company codes intercompany: Garantir que os company codes intercompany principais (1010, 1011 e 1231/DCP) estejam corretamente identificados; durante o filtro manter 1010 e 1011 conforme procedimento.",
          classification: "ME"
        },
        {
          id: "step_15_15.5.1",
          sourceRef: "15.5.1",
          description: "Aplicar filtro na coluna 'trading partner' e selecionar os valores '1010' e '1011'.",
          classification: "ME"
        },
        {
          id: "step_15_15.5.2",
          sourceRef: "15.5.2",
          description: "Selecionar todas as linhas resultantes fora dos parceiros 1010 e 1011 e exclu\u00ed-las do arquivo.",
          classification: "ME"
        },
        {
          id: "step_15_15.6",
          sourceRef: "15.6",
          description: "Encaminhar o arquivo limpo ao respons\u00e1vel designado para que ele realize o processamento WD06 (recebimento na 7\u00aa jornada, categoriza\u00e7\u00e3o e reconcilia\u00e7\u00e3o). Recebimento de detalhes para WD06: Os detalhes para processamento WD06 devem ser recebidos no 7\u00ba dia \u00fatil; confirmar a data de recebimento antes de iniciar a categoriza\u00e7\u00e3o.",
          classification: "MA"
        },
        {
          id: "step_15_15.6.1",
          sourceRef: "15.6.1",
          description: "Anexar a planilha ao e-mail ou sistema de transfer\u00eancia utilizado e enviar ao respons\u00e1vel pelo WD06. Recebimento de detalhes para WD06: Os detalhes para processamento WD06 devem ser recebidos no 7\u00ba dia \u00fatil; confirmar a data de recebimento antes de iniciar a categoriza\u00e7\u00e3o.",
          classification: "ME"
        },
        {
          id: "step_15_15.6.2",
          sourceRef: "15.6.2",
          description: "Informar no envio que os detalhes de intercompany correspondentes ao m\u00eas anterior devem ser processados no m\u00eas corrente conforme rotina.",
          classification: "MA"
        },
        {
          id: "step_15_15.7",
          sourceRef: "15.7",
          description: "Ao receber o arquivo no 7\u00ba dia \u00fatil, executar limpeza de colunas e preparar para categoriza\u00e7\u00e3o.",
          classification: "ME"
        },
        {
          id: "step_15_15.7.1",
          sourceRef: "15.7.1",
          description: "Confirmar que o arquivo foi recebido no s\u00e9timo dia \u00fatil e abrir a planilha recebida.",
          classification: "ME"
        },
        {
          id: "step_15_15.7.2",
          sourceRef: "15.7.2",
          description: "Excluir do arquivo as colunas especificadas: Document Header Text, Reverse, Reversal Document, Doc Date.",
          classification: "ME"
        },
        {
          id: "step_15_15.7.3",
          sourceRef: "15.7.3",
          description: "Verificar: (a) document number e reference document number s\u00e3o id\u00eanticos; (b) company code aparece como fornecedor; (c) identificar que as company codes intercompany principais s\u00e3o 1010, 1011 e DCP (1231); (d) usar coluna 'Text' para ajudar a identificar o tipo de despesa.",
          classification: "ME"
        },
        {
          id: "step_15_15.7.4",
          sourceRef: "15.7.4",
          description: "Aplicar filtro para manter linhas referentes \u00e0s company codes intercompany conforme necess\u00e1rio (p.ex. 1010, 1011).",
          classification: "ME"
        },
        {
          id: "step_15_15.8",
          sourceRef: "15.8",
          description: "Verificar se a c\u00e9lula da coluna 'Text' est\u00e1 em branco para a linha do documento.",
          classification: "MS"
        },
        {
          id: "step_15_15.9",
          sourceRef: "15.9",
          description: "Quando a coluna Text estiver vazia, copiar o Reference Number e pesquisar no VIM Analytics para recuperar a categoria do invoice.",
          classification: "ME"
        },
        {
          id: "step_15_15.9.1",
          sourceRef: "15.9.1",
          description: "No SAP, executar o relat\u00f3rio /OPT/VIM_VA2 (VIM Analytics 7.50).",
          classification: "ME"
        },
        {
          id: "step_15_15.9.2",
          sourceRef: "15.9.2",
          description: "Colar o Reference Number copiado da planilha no campo correspondente e executar (F8).",
          classification: "MA"
        },
        {
          id: "step_15_15.9.3",
          sourceRef: "15.9.3",
          description: "Anotar o tipo de invoice exibido no resultado do VIM Analytics e retornar \u00e0 planilha para registrar a categoria.",
          classification: "ME"
        },
        {
          id: "step_15_15.10",
          sourceRef: "15.10",
          description: "Preencher a coluna 'Invoice Type' na planilha com base nas palavras-chave encontradas na coluna Text conforme mapeamento definido.",
          classification: "ME"
        },
        {
          id: "step_15_15.10.1",
          sourceRef: "15.10.1",
          description: "Para cada linha, procurar a palavra-chave na coluna Text e atribuir o Invoice Type conforme abaixo: Tariff# \u2192 Pipeline Tariff; Barge Service \u2192 Terminaling; Truck Rack \u2192 Terminaling; Pump over \u2192 Terminaling; Gain/Loss \u2192 Gain/Loss; Loss Allowance \u2192 Loss Allowance.",
          classification: "ME"
        },
        {
          id: "step_15_15.10.2",
          sourceRef: "15.10.2",
          description: "Preencher ou atualizar a coluna 'Invoice Type' com o valor identificado para cada linha.",
          classification: "ME"
        },
        {
          id: "step_15_15.11",
          sourceRef: "15.11",
          description: "Construir uma tabela din\u00e2mica para agrupar e facilitar a identifica\u00e7\u00e3o de cr\u00e9ditos/debitos e os tipos de invoice.",
          classification: "ME"
        },
        {
          id: "step_15_15.11.1",
          sourceRef: "15.11.1",
          description: "Inserir uma nova Pivot Table em uma nova worksheet e confirmar (clicar New Worksheet e OK).",
          classification: "ME"
        },
        {
          id: "step_15_15.11.2",
          sourceRef: "15.11.2",
          description: "Adicionar Document Number para rastreamento, Company Code para identifica\u00e7\u00e3o do vendor; colocar Invoice Type como filtro; agrupar/totalizar valores por moeda conforme necess\u00e1rio.",
          classification: "ME"
        },
        {
          id: "step_15_15.12",
          sourceRef: "15.12",
          description: "Usar os resultados da Pivot para localizar faturas destacadas (cr\u00e9dito/debito em vermelho) no VIM Workplace, obsoletar as que forem identificadas como obsoletas e verificar individualmente faturas do tipo pipeline. A\u00e7\u00e3o t\u00e9cnica para obsoleter faturas no VIM: Confirmar o procedimento/fluxo exato (bot\u00e3o/menu) no VIM Workspace utilizado para marcar faturas como obsoletas.",
          classification: "ME"
        },
        {
          id: "step_15_15.12.1",
          sourceRef: "15.12.1",
          description: "A partir da Pivot, listar os Document Numbers/Reference Numbers que aparecem como cr\u00e9dito/debito destacados (em vermelho) e marc\u00e1-los para a\u00e7\u00e3o no VIM.",
          classification: "ME"
        },
        {
          id: "step_15_15.12.2",
          sourceRef: "15.12.2",
          description: "No SAP VIM Workspace, ir \u00e0 coluna 'Reference', aplicar filtro com o Reference Number copiado e localizar a linha correspondente.",
          classification: "MA"
        },
        {
          id: "step_15_15.12.3",
          sourceRef: "15.12.3",
          description: "Dar duplo clique no Reference Number encontrado para abrir os detalhes e confirmar que o Invoice Type registrado \u00e9 'pipeline' quando aplic\u00e1vel.",
          classification: "ME"
        },
        {
          id: "step_15_15.12.4",
          sourceRef: "15.12.4",
          description: "Para cada Reference Number marcado como obsoleto, executar a a\u00e7\u00e3o de obsolecer no VIM Workspace (obsolecer as faturas que a Pivot indicou como obsoletas). A\u00e7\u00e3o t\u00e9cnica para obsoleter faturas no VIM: Confirmar o procedimento/fluxo exato (bot\u00e3o/menu) no VIM Workspace utilizado para marcar faturas como obsoletas.",
          classification: "ME"
        },
      ]
    },
    {
      id: "step_16",
      sourceStep: "16",
      number: "16",
      title: "Processamento IC Pipeline Tariff / Terminal \u2014 ajustar Document Type SEC_SUM, criar/atualizar VBD e disparar incident em ServiceNow Sequ\u00eancia completa",
      description: "Sequ\u00eancia completa para localizar invoices Pipeline/Terminal no VIM Workplace, ajustar Document Type para SEC_SUM, gerar incident em ServiceNow para disparo de VBD autom\u00e1tico, obter/confirmar Trading Contract e criar/overwritar VBD manualmente at\u00e9 postar a fatura.",
      classification: "MS",
      classifications: ["MS", "MA"],
      macroBlockId: "exception",
      macroBlockName: "Exception",
      capabilityId: "cap-auto",
      capabilityName: "Capability Automática",
      solutionId: "sol-eval-anomaly",
      solutionIds: ["sol-eval-anomaly"],
      technologyType: "Workflow",
      rationale: "A corre\u00e7\u00e3o intercompany envolve ajuste de Document Type, VBD e abertura de incidente; requer coordena\u00e7\u00e3o e decis\u00e3o humana.",
      effort: {
        level: "high",
        score: 50,
        confidence: "medium",
        drivers: [],
        unknowns: []
      },
      humanInTheLoop: {
        hasHumanControl: true,
        level: "partial",
        description: "`decision_required` \u2014 revis\u00e3o humana permanece necess\u00e1ria para dados, exce\u00e7\u00f5es, aprova\u00e7\u00f5es e/ou transa\u00e7\u00f5es financeiras."
      },
      substeps: [
        {
          id: "step_16_16.1",
          sourceRef: "16.1",
          description: "No VIM Workplace, aplique filtros para localizar a invoice de Pipeline Tariff / Terminal correspondente e execute a linha para carregar os detalhes.",
          classification: "MA"
        },
        {
          id: "step_16_16.1.1",
          sourceRef: "16.1.1",
          description: "Navegue ao VIM Workplace. Modifique os par\u00e2metros do filtro para selecionar invoices do tipo Pipeline Tariff / Terminal conforme os detalhes da fatura a processar (usar os crit\u00e9rios dispon\u00edveis no VIM).",
          classification: "ME"
        },
        {
          id: "step_16_16.1.2",
          sourceRef: "16.1.2",
          description: "Com a linha da invoice selecionada, execute-a usando a tecla F8 para carregar o conte\u00fado completo da invoice na tela (conforme Step11).",
          classification: "ME"
        },
        {
          id: "step_16_16.1.3",
          sourceRef: "16.1.3",
          description: "Verifique e confirme os seguintes campos da invoice contra o documento recebido: invoice number (n\u00ba da fatura), invoice date (data da fatura), reference number (n\u00famero de refer\u00eancia), gross amount (valor bruto) e company code (c\u00f3digo da empresa). (conforme Step12).",
          classification: "ME"
        },
        {
          id: "step_16_16.2",
          sourceRef: "16.2",
          description: "Para as invoices de Pipeline Tariff e Terminal, altere o campo Document Type para SEC_SUM e, quando necess\u00e1rio, atualize o Vendor Number conforme informado na invoice (conforme instru\u00e7\u00f5es da p\u00e1gina 144). Obrigatoriedade: Document Type = SEC_SUM para Pipeline/Terminal: As invoices Pipeline Tariff e Terminal devem ter o campo Document Type alterado para SEC_SUM antes de solicitar o disparo do VBD autom\u00e1tico.",
          classification: "MS"
        },
        {
          id: "step_16_16.2.1",
          sourceRef: "16.2.1",
          description: "Localize o campo Document Type na tela da invoice e selecione/insira SEC_SUM para essa invoice. Fa\u00e7a isso para todas as invoices Pipeline/Terminal a serem processadas (p\u00e1gina 144).",
          classification: "ME"
        },
        {
          id: "step_16_16.2.2",
          sourceRef: "16.2.2",
          description: "Verifique o Vendor Number exibido. Se necess\u00e1rio, altere o Vendor Number para o valor que consta na invoice para garantir correspond\u00eancia (p\u00e1gina 144).",
          classification: "MA"
        },
        {
          id: "step_16_16.3",
          sourceRef: "16.3",
          description: "Crie um ticket no portal ServiceNow indicando que a invoice foi marcada como SEC_SUM e solicitando o disparo do auto-fire do VBD para essa invoice. Aguarde o fechamento/retorno do ticket antes de prosseguir (conforme Step2 p\u00e1gina 144 e Step3 p\u00e1gina 144). Gerar incidente em ServiceNow para disparo do auto-fire VBD: Criar ticket no portal ServiceNow solicitando o auto-fire do VBD ap\u00f3s altera\u00e7\u00e3o do Document Type para SEC_SUM.",
          classification: "MS"
        },
        {
          id: "step_16_16.4",
          sourceRef: "16.4",
          description: "Ap\u00f3s o ticket do ServiceNow ser finalizado, inspecione a invoice no VIM para identificar se h\u00e1 line items (linhas) faltando que impe\u00e7am o mapeamento do Trading Contract.",
          classification: "MS"
        },
        {
          id: "step_16_16.5",
          sourceRef: "16.5",
          description: "Se houver linhas faltando: localize o trac code/BOL number presente na invoice; utilize o trac code para mapear a localiza\u00e7\u00e3o (mapa/registro) e, a partir disso, identificar qual Trading Contract \u00e9 aplic\u00e1vel. Prepare e encaminhe a evid\u00eancia ao time FP&A para que forne\u00e7a o Trading Contract correspondente (conforme Step3 e Step4 p\u00e1ginas 144-145).",
          classification: "MA"
        },
        {
          id: "step_16_16.6",
          sourceRef: "16.6",
          description: "Quando as linhas estiverem completas (ou ap\u00f3s mapear trac code), solicite ao time FP&A o Trading Contract aplic\u00e1vel conforme a descri\u00e7\u00e3o da invoice e/ou trac code. O FP&A fornecer\u00e1 o TC utilizado para o processamento (conforme Step4 p\u00e1gina 145).",
          classification: "ME"
        },
        {
          id: "step_16_16.7",
          sourceRef: "16.7",
          description: "Crie o VBD correspondente ao produto indicado na invoice. Clique na op\u00e7\u00e3o indicada na tela para criar o VBD (referido como 'Create Expanse' no documento) e, ap\u00f3s cria\u00e7\u00e3o, selecione o \u00edcone de l\u00e1pis (Pencil) para editar/atualizar informa\u00e7\u00f5es adicionais antes de salvar (conforme Step5 e Step6 p\u00e1ginas 145-146).",
          classification: "MA"
        },
        {
          id: "step_16_16.7.1",
          sourceRef: "16.7.1",
          description: "Execute a a\u00e7\u00e3o de 'Create Expanse' conforme exibido na tela para gerar o rascunho do VBD (p\u00e1gina 145).",
          classification: "ME"
        },
        {
          id: "step_16_16.7.2",
          sourceRef: "16.7.2",
          description: "Clique no \u00edcone de l\u00e1pis para atualizar informa\u00e7\u00f5es adicionais do VBD. Preencha os campos destacados conforme os dados da invoice (conforme Step6 e Step7 p\u00e1ginas 146). Ap\u00f3s inserir os detalhes, use 'Go back' se necess\u00e1rio e salve o VBD.",
          classification: "ME"
        },
        {
          id: "step_16_16.8",
          sourceRef: "16.8",
          description: "Ap\u00f3s salvar o VBD, copie o n\u00famero do VBD exibido no pop-up. Volte ao VIM Workplace, na aba Other data, e selecione a fun\u00e7\u00e3o Search Accrual VBD para procurar pelo VBD usando campos como BOL NUMBER, TRANSACTION DATE, BATCH NUMBER (conforme Step8 e Step9 p\u00e1ginas 147).",
          classification: "ME"
        },
        {
          id: "step_16_16.9",
          sourceRef: "16.9",
          description: "No painel Search Accrual VBD, cole/insira o n\u00famero do VBD copiado e pressione F8 para executar a busca (conforme Step10 p\u00e1gina 148). Quando o VBD for carregado, selecione a op\u00e7\u00e3o Overwrite VBD para sobrescrever o VBD existente conforme necess\u00e1rio.",
          classification: "ME"
        },
        {
          id: "step_16_16.10",
          sourceRef: "16.10",
          description: "Ap\u00f3s sobrescrever o VBD, pressione Ctrl+S para salvar as altera\u00e7\u00f5es. Em seguida, selecione a op\u00e7\u00e3o Simulate Rule e verifique que a simula\u00e7\u00e3o indique zero erros. Somente ap\u00f3s confirma\u00e7\u00e3o de zero erros, selecione Apply Rules para executar a postagem da invoice (conforme Step11 p\u00e1gina 149). Confirmar simula\u00e7\u00e3o sem erros antes de aplicar regras: Executar Simulate Rule e confirmar que o resultado apresenta zero errors antes de acionar Apply Rules para postar a invoice.",
          classification: "ME"
        },
      ]
    },
    {
      id: "step_17",
      sourceStep: "17",
      number: "17",
      title: "Extra\u00e7\u00e3o de Nomination Key via Fiori \u2014 obter NK, aplicar filtros e exportar Sequ\u00eancia execut\u00e1vel para localizar Nomination Key no Fiori, aplicar os fi",
      description: "Sequ\u00eancia execut\u00e1vel para localizar Nomination Key no Fiori, aplicar os filtros exigidos (plant, transport system e scheduled date), obter resultados, personalizar tabela (colunas necess\u00e1rias), filtrar ticket status e exportar o arquivo Excel com as colunas selecionadas para uso na cria\u00e7\u00e3o manual de VBD.",
      classification: "ME",
      classifications: ["ME"],
      macroBlockId: "intake",
      macroBlockName: "Intake",
      capabilityId: "cap-auto",
      capabilityName: "Capability Automática",
      solutionId: "sol-rpa-report",
      solutionIds: ["sol-rpa-report"],
      technologyType: "RPA",
      rationale: "A busca e exporta\u00e7\u00e3o da Nomination Key no Fiori s\u00e3o repetitivas e baseadas em filtros definidos.",
      effort: {
        level: "medium",
        score: 50,
        confidence: "medium",
        drivers: [],
        unknowns: []
      },
      humanInTheLoop: {
        hasHumanControl: true,
        level: "partial",
        description: "`review_required` \u2014 revis\u00e3o humana permanece necess\u00e1ria para dados, exce\u00e7\u00f5es, aprova\u00e7\u00f5es e/ou transa\u00e7\u00f5es financeiras."
      },
      substeps: [
        {
          id: "step_17_17.1",
          sourceRef: "17.1",
          description: "No ambiente Fiori, localizar e abrir a aplica\u00e7\u00e3o Nomination Key para iniciar a extra\u00e7\u00e3o da Nomination Key que ser\u00e1 usada na cria\u00e7\u00e3o manual do VBD.",
          classification: "ME"
        },
        {
          id: "step_17_17.2",
          sourceRef: "17.2",
          description: "Na tela da aplica\u00e7\u00e3o Nomination Key, selecionar a op\u00e7\u00e3o 'my nomination' e, em seguida, o modo 'view standard'. Em seguida aplicar filtro pelo plant (nome do plant) conforme consta na fatura refer\u00eancia. Confirma\u00e7\u00e3o do plant com a fatura: O valor do campo 'plant' utilizado no filtro deve corresponder exatamente ao plant indicado na fatura refer\u00eancia.",
          classification: "MA"
        },
        {
          id: "step_17_17.3",
          sourceRef: "17.3",
          description: "No painel de filtros, preencher o campo 'transport systems' com o(s) c\u00f3digo(s) de transporte relacionados \u00e0 fatura. Inserir o scheduled date correspondente ao m\u00eas de Outubro conforme instru\u00eddo pela fatura.",
          classification: "MA"
        },
        {
          id: "step_17_17.4",
          sourceRef: "17.4",
          description: "Ap\u00f3s configurar todos os filtros (plant, transport systems, scheduled date), clicar no bot\u00e3o 'GO' para executar a pesquisa de nominations que atendam aos filtros aplicados.",
          classification: "ME"
        },
        {
          id: "step_17_17.5",
          sourceRef: "17.5",
          description: "Avaliar se a tabela de resultados possui linhas ap\u00f3s a execu\u00e7\u00e3o da busca. Procedimento em caso de busca sem resultados: Condi\u00e7\u00e3o: A busca retornou zero linhas ap\u00f3s clicar GO. A\u00e7\u00f5es: Verificar se os filtros 'plant' e 'transport systems' foram preenchidos corretamente.; Ampliar o intervalo do scheduled date (incluir mais dias dentro do m\u00eas ou datas adjacentes) e reexecutar a busca.; Confirmar se existem valores alternativamente classificados (p.ex., partially actualized) que devam ser considerados.. Resultado: 17.3 \u00b7 No painel de filtros, preencher o campo 'transport systems' com o(s) c\u00f3digo(s) de transporte relacionados \u00e0 fatura. Inserir o scheduled date correspondente ao m\u00eas de Outubro conforme instru\u00eddo pela fatura.",
          classification: "MA"
        },
        {
          id: "step_17_17.6",
          sourceRef: "17.6",
          description: "Se a busca n\u00e3o retornou resultados, revisar filtros aplicados: confirmar plant, transport systems e scheduled date; ampliar o intervalo de datas (p.ex., incluir dias adicionais em Outubro) e reexecutar a busca (voltar para o passo de aplica\u00e7\u00e3o de filtros e clicar GO novamente). Procedimento em caso de busca sem resultados: Condi\u00e7\u00e3o: A busca retornou zero linhas ap\u00f3s clicar GO. A\u00e7\u00f5es: Verificar se os filtros 'plant' e 'transport systems' foram preenchidos corretamente.; Ampliar o intervalo do scheduled date (incluir mais dias dentro do m\u00eas ou datas adjacentes) e reexecutar a busca.; Confirmar se existem valores alternativamente classificados (p.ex., partially actualized) que devam ser considerados.. Resultado: 17.3 \u00b7 No painel de filtros, preencher o campo 'transport systems' com o(s) c\u00f3digo(s) de transporte relacionados \u00e0 fatura. Inserir o scheduled date correspondente ao m\u00eas de Outubro conforme instru\u00eddo pela fatura.",
          classification: "MA"
        },
        {
          id: "step_17_17.7",
          sourceRef: "17.7",
          description: "Com resultados vis\u00edveis, abrir a op\u00e7\u00e3o de 'table personalization' para selecionar as colunas que ser\u00e3o inclu\u00eddas no arquivo exportado. Selecionar explicitamente as colunas: 'Nomination Key', 'Ticket Status', 'Actual Quantity' e 'Schedule Type'. Confirmar a aplica\u00e7\u00e3o da personaliza\u00e7\u00e3o antes de exportar.",
          classification: "ME"
        },
        {
          id: "step_17_17.8",
          sourceRef: "17.8",
          description: "Na pr\u00f3pria tabela de resultados, aplicar filtro no campo 'Ticket Status' para manter apenas os registros com status 'Actualized' (ou 'Partially Actualized' se assim determinado pelo caso). Esta filtragem garante que o arquivo exportado contenha o status desejado.",
          classification: "ME"
        },
        {
          id: "step_17_17.9",
          sourceRef: "17.9",
          description: "Ap\u00f3s aplicar a personaliza\u00e7\u00e3o das colunas e o filtro de 'Ticket Status', usar a fun\u00e7\u00e3o de exporta\u00e7\u00e3o da tabela para gerar o arquivo Excel. Salvar o arquivo no local apropriado conforme pol\u00edtica do time. Este arquivo conter\u00e1 as Nomination Keys e demais colunas selecionadas e dever\u00e1 ser usado para reservar movimentos e/ou criar manualmente o VBD.",
          classification: "ME"
        },
      ]
    },
    {
      id: "step_18",
      sourceStep: "18",
      number: "18",
      title: "T4 (Transport4) \u2014 Concilia\u00e7\u00e3o Volume/Entrega e Processo de Loss Allowance Executar a concilia\u00e7\u00e3o entre valores de fatura e entregas utilizando o Trans",
      description: "Executar a concilia\u00e7\u00e3o entre valores de fatura e entregas utilizando o Transport4 (T4) e processar as entradas de Loss Allowance seguindo a sequ\u00eancia abaixo.",
      classification: "MS",
      classifications: ["MS", "MA"],
      macroBlockId: "execution",
      macroBlockName: "Execution",
      capabilityId: "cap-auto",
      capabilityName: "Capability Automática",
      solutionId: "sol-analytics-recon",
      solutionIds: ["sol-analytics-recon"],
      technologyType: "Analytics / Monitoramento",
      rationale: "A concilia\u00e7\u00e3o volume/entrega e Loss Allowance compara dados e toler\u00e2ncias; analytics pode evidenciar diverg\u00eancias para revis\u00e3o.",
      effort: {
        level: "high",
        score: 50,
        confidence: "medium",
        drivers: [],
        unknowns: []
      },
      humanInTheLoop: {
        hasHumanControl: true,
        level: "partial",
        description: "`review_required` \u2014 revis\u00e3o humana permanece necess\u00e1ria para dados, exce\u00e7\u00f5es, aprova\u00e7\u00f5es e/ou transa\u00e7\u00f5es financeiras."
      },
      substeps: [
        {
          id: "step_18_18.1",
          sourceRef: "18.1",
          description: "Acesse o sistema T4 e inicie o fluxo de concilia\u00e7\u00e3o de volume/entrega. Efetue login com as credenciais v\u00e1lidas. Credenciais para acesso ao T4: Possuir credenciais de acesso v\u00e1lidas para entrar no sistema T4 antes de iniciar o processo de concilia\u00e7\u00e3o.",
          classification: "ME"
        },
        {
          id: "step_18_18.2",
          sourceRef: "18.2",
          description: "Ap\u00f3s o login, no menu principal selecione a op\u00e7\u00e3o Inventory e, em seguida, escolha a op\u00e7\u00e3o P66 Inventory (Phillips 66).",
          classification: "ME"
        },
        {
          id: "step_18_18.3",
          sourceRef: "18.3",
          description: "No formul\u00e1rio de pesquisa do P66 Inventory, preencha os filtros conforme a fatura: - Shipper: selecione Phillips 66 (PHI). - DATE: selecione o m\u00eas correspondente \u00e0 fatura. - Custody pipeline: selecione o pipeline indicado na fatura (ex.: Borger Amarillo pipeline). Clique em Search para carregar os resultados.",
          classification: "MA"
        },
        {
          id: "step_18_18.4",
          sourceRef: "18.4",
          description: "Revise a tela de resultados exibida ap\u00f3s a pesquisa e identifique as colunas necess\u00e1rias (por exemplo: nomination key, ticket status, actual quantity, schedule type).",
          classification: "ME"
        },
        {
          id: "step_18_18.5",
          sourceRef: "18.5",
          description: "Tire um screenshot da tela de resultados do T4 contendo as linhas e colunas usadas para concilia\u00e7\u00e3o e salve o arquivo localmente em formato JPG/JPEG. Evid\u00eancia de tela e anexa\u00e7\u00e3o: Capturar screenshot da tela de resultados do T4 em JPG/JPEG, salvar localmente e anexar no campo 'VIM Attachment-JPG/JPEG' do registro da fatura.",
          classification: "ME"
        },
        {
          id: "step_18_18.6",
          sourceRef: "18.6",
          description: "Compare os valores de entregas exibidos no T4 com os valores da fatura. Identifique correspond\u00eancia entre os montantes faturados e os montantes efetivamente entregues.",
          classification: "MA"
        },
        {
          id: "step_18_18.7",
          sourceRef: "18.7",
          description: "No registro da fatura no VIM, abra a se\u00e7\u00e3o de anexos e anexe o arquivo JPG/JPEG com o screenshot salvo. Utilize o campo 'VIM Attachment-JPG/JPEG' conforme padr\u00e3o. Evid\u00eancia de tela e anexa\u00e7\u00e3o: Capturar screenshot da tela de resultados do T4 em JPG/JPEG, salvar localmente e anexar no campo 'VIM Attachment-JPG/JPEG' do registro da fatura.",
          classification: "ME"
        },
        {
          id: "step_18_18.8",
          sourceRef: "18.8",
          description: "Abra a planilha commercial charge do intercompany que cont\u00e9m as faturas e informa\u00e7\u00f5es para processamento de Loss Allowance. Localize a linha da fatura a ser processada.",
          classification: "ME"
        },
        {
          id: "step_18_18.9",
          sourceRef: "18.9",
          description: "No VIM, acesse a \u00e1rea VIM Analytics para localizar as informa\u00e7\u00f5es relacionadas a Loss Allowance e \u00e0s faturas do intercompany.",
          classification: "ME"
        },
        {
          id: "step_18_18.10",
          sourceRef: "18.10",
          description: "Em VIM Analytics, localize a coluna Reference. Selecione-a e cole o n\u00famero da fatura conforme consta na planilha commercial charge.",
          classification: "ME"
        },
        {
          id: "step_18_18.11",
          sourceRef: "18.11",
          description: "Na linha da fatura colada, revise o campo Description para identificar se a fatura corresponde a 'loss allowance' ou outro tipo. Clique no campo de descri\u00e7\u00e3o para visualizar detalhes se necess\u00e1rio.",
          classification: "MA"
        },
        {
          id: "step_18_18.12",
          sourceRef: "18.12",
          description: "Abra a lista VBD e aplique filtros: - Vendor: filtre pelo fornecedor indicado (ex.: IS1062). - Invoice type: filtre pelo tipo identificado (ex.: loss allowance). Confirme que a lista exibe somente os registros relevantes.",
          classification: "ME"
        },
        {
          id: "step_18_18.13",
          sourceRef: "18.13",
          description: "Na coluna Description da lista VBD, aplique um filtro para isolar registros cujo cost type seja 'Loss Allowance' (por ex.: procurar os termos PLATA, PIPELINE, TPL conforme aplic\u00e1vel).",
          classification: "ME"
        },
        {
          id: "step_18_18.14",
          sourceRef: "18.14",
          description: "Revise os resultados filtrados para identificar linhas de fired pipeline. Se existir item identificado como 'gold loss allowance' e o processo local indicar que n\u00e3o deve ser processado, n\u00e3o selecione-o para continua\u00e7\u00e3o.",
          classification: "ME"
        },
        {
          id: "step_18_18.15",
          sourceRef: "18.15",
          description: "Se o processo exigir opera\u00e7\u00e3o em Fiori (IC gold pl), abra a aplica\u00e7\u00e3o Fiori correspondente e navegue para a transa\u00e7\u00e3o indicada no sistema para o processamento requerido.",
          classification: "MA"
        },
        {
          id: "step_18_18.16",
          sourceRef: "18.16",
          description: "Na exibi\u00e7\u00e3o de resultados (por exemplo exporta\u00e7\u00e3o do Fiori), copie a nomination key da segunda linha relevante. Em seguida, abra o registro da fatura e cole a nomination key no campo apropriado da fatura.",
          classification: "ME"
        },
        {
          id: "step_18_18.17",
          sourceRef: "18.17",
          description: "No registro da fatura, clique em Create Expenses e preencha os campos obrigat\u00f3rios: - Expense class group - Expense class - Accounting type: selecione 'A' - Posting date - Partner Preencha conforme informa\u00e7\u00f5es da fatura e do processo.",
          classification: "ME"
        },
        {
          id: "step_18_18.18",
          sourceRef: "18.18",
          description: "Copie o Reference number e o Net amount da fatura e insira nos campos correspondentes no formul\u00e1rio de expense. Salve o registro ap\u00f3s preencher todos os campos.",
          classification: "MA"
        },
        {
          id: "step_18_18.19",
          sourceRef: "18.19",
          description: "Na aba Other data do registro de fatura/expense, acesse a pesquisa de VBD accrual. Insira o BOL (pode-se usar um BOL aleat\u00f3rio conforme processo) e a nomination key; clique em Execute para recuperar VBD accruals correspondentes.",
          classification: "MA"
        },
        {
          id: "step_18_18.20",
          sourceRef: "18.20",
          description: "Se a linha retornada na pesquisa de accrual VBD for a \u00fanica relevante e n\u00e3o houver outros itens a serem usados, aplique Override para permitir uso desta \u00fanica linha no processo.",
          classification: "ME"
        },
        {
          id: "step_18_18.21",
          sourceRef: "18.21",
          description: "No VBD selecionado, verifique se existe a data de lift (lift date) associada. Confirme que a data est\u00e1 correta antes de prosseguir.",
          classification: "ME"
        },
        {
          id: "step_18_18.22",
          sourceRef: "18.22",
          description: "Aplique Simulate Rules (Simulate) para a opera\u00e7\u00e3o de VBD/expense. Verifique se o sistema sinaliza 'suspected duplicate'. Caso o sistema n\u00e3o apresente suspeitas, prosseguir para upload.",
          classification: "ME"
        },
        {
          id: "step_18_18.23",
          sourceRef: "18.23",
          description: "Fa\u00e7a o upload do arquivo/planilha (exportado do Fiori) que cont\u00e9m todas as linhas destacadas para processamento no ambiente VIM/T4, conforme o passo anterior.",
          classification: "ME"
        },
        {
          id: "step_18_18.24",
          sourceRef: "18.24",
          description: "No campo apropriado do registro, insira ou carregue o valor proveniente do T4 (T4 amount) que representa o montante de entrega a ser conciliado com a fatura.",
          classification: "ME"
        },
        {
          id: "step_18_18.25",
          sourceRef: "18.25",
          description: "Depois do upload, atualize/refresh a vista de VIM Analytics para verificar se h\u00e1 suspected invoices. Identifique as linhas marcadas com ATA (se aplic\u00e1vel).",
          classification: "MS"
        },
        {
          id: "step_18_18.26",
          sourceRef: "18.26",
          description: "Ordene/filtre os resultados para localizar somente as op\u00e7\u00f5es ATA, PIPELINE e TPL. Para as linhas relevantes (por ex.: Amarillo\u2011tucumcari\u2011albuquerque\u2011loss allowance), copie os registros necess\u00e1rios para processamento posterior.",
          classification: "ME"
        },
        {
          id: "step_18_18.27",
          sourceRef: "18.27",
          description: "Copie o n\u00famero de VBD necess\u00e1rio dos resultados filtrados e use este VBD na pesquisa de accrual VBD (Search Accrual VBD) para localizar o accrual correspondente.",
          classification: "MA"
        },
        {
          id: "step_18_18.28",
          sourceRef: "18.28",
          description: "No formul\u00e1rio de Accrual VBD, clique no campo Accrual VBD number, cole o n\u00famero do VBD copiado e clique em Execute para recuperar o registro.",
          classification: "ME"
        },
        {
          id: "step_18_18.29",
          sourceRef: "18.29",
          description: "Se necess\u00e1rio, aplique override nas linhas apresentadas (por ex.: ATA). Utilize a segunda planilha exportada do Fiori para processar os registros adicionais: copie nomination keys, cole nos campos correspondentes, clique em Execute para carregar os dados e retornar \u00e0s Line Items para salvar as diferen\u00e7as. Depois, crie expenses adicionais quando existir diferen\u00e7a e salve as altera\u00e7\u00f5es.",
          classification: "MA"
        },
        {
          id: "step_18_18.30",
          sourceRef: "18.30",
          description: "Execute Simulate Rules novamente, aplique as regras (Apply Rules) e depois atualize/refresh o VIM Analytics para identificar quaisquer suspected invoices ou altera\u00e7\u00f5es de status geradas pelo processamento.",
          classification: "ME"
        },
        {
          id: "step_18_18.31",
          sourceRef: "18.31",
          description: "Monitore o status da fatura processada; se o status mudar para 'Posted' durante o processamento, clique em Refresh no VIM Analytics para confirmar o novo status e encerrar a verifica\u00e7\u00e3o.",
          classification: "ME"
        },
      ]
    },
    {
      id: "step_19",
      sourceStep: "19",
      number: "19",
      title: "Processamento de Faturas Gain & Loss \u2014 classifica\u00e7\u00e3o, atribui\u00e7\u00e3o de GL/Company/Profit Center e envio para aprova\u00e7\u00f5es Procedimento execut\u00e1vel para iden",
      description: "Procedimento execut\u00e1vel para identificar, classificar e preparar faturas Gain & Loss no VIM Workplace, preencher os campos obrigat\u00f3rios (document type, vendor, requester email, GL account, company code e profit center conforme regi\u00e3o) e encaminhar para o fluxo de aprova\u00e7\u00f5es (duas camadas; envio para Gina na segunda etapa).",
      classification: "MS",
      classifications: ["MS", "MA"],
      macroBlockId: "routing",
      macroBlockName: "Routing",
      capabilityId: "cap-auto",
      capabilityName: "Capability Automática",
      solutionId: "sol-wf-routing",
      solutionIds: ["sol-wf-routing"],
      technologyType: "Workflow",
      rationale: "Classifica\u00e7\u00e3o, atribui\u00e7\u00e3o cont\u00e1bil e aprova\u00e7\u00e3o exigem encaminhamento, al\u00e7ada e valida\u00e7\u00e3o de m\u00faltiplas informa\u00e7\u00f5es.",
      effort: {
        level: "high",
        score: 50,
        confidence: "medium",
        drivers: [],
        unknowns: []
      },
      humanInTheLoop: {
        hasHumanControl: true,
        level: "partial",
        description: "`approval_required` \u2014 revis\u00e3o humana permanece necess\u00e1ria para dados, exce\u00e7\u00f5es, aprova\u00e7\u00f5es e/ou transa\u00e7\u00f5es financeiras."
      },
      substeps: [
        {
          id: "step_19_19.1",
          sourceRef: "19.1",
          description: "Abrir o VIM Workplace e filtrar/ordenar as faturas para identificar as faturas classificadas como Gain & Loss.",
          classification: "ME"
        },
        {
          id: "step_19_19.1.1",
          sourceRef: "19.1.1",
          description: "No VIM Workplace, aplicar filtro ou ordenar por: Document Type, Invoice Description e/ou Tag que identifique 'Gain & Loss' para trazer somente as faturas deste escopo.",
          classification: "ME"
        },
        {
          id: "step_19_19.1.2",
          sourceRef: "19.1.2",
          description: "Para cada fatura listada como Gain & Loss, abrir o registro da fatura para edi\u00e7\u00e3o dos campos necess\u00e1rios descritos nos passos seguintes.",
          classification: "ME"
        },
        {
          id: "step_19_19.2",
          sourceRef: "19.2",
          description: "Atualizar os campos de cabe\u00e7alho da fatura diretamente no VIM Workplace conforme os dados apresentados na c\u00f3pia da fatura.",
          classification: "ME"
        },
        {
          id: "step_19_19.2.1",
          sourceRef: "19.2.1",
          description: "Se a fatura estiver associada ao processamento Gain & Loss, definir o campo 'Document Type' para 'Non-Po Manual' conforme instru\u00e7\u00e3o.",
          classification: "ME"
        },
        {
          id: "step_19_19.2.2",
          sourceRef: "19.2.2",
          description: "Atualizar o campo 'Vendor Number' com o n\u00famero do fornecedor que consta na c\u00f3pia da fatura.",
          classification: "ME"
        },
        {
          id: "step_19_19.2.3",
          sourceRef: "19.2.3",
          description: "Preencher o campo 'Requester Email' com o e-mail do solicitante constante na fatura.",
          classification: "MS"
        },
        {
          id: "step_19_19.3",
          sourceRef: "19.3",
          description: "Ir para a aba/\u00e1rea de Line Items da fatura para inserir os dados cont\u00e1beis por linha conforme instru\u00e7\u00f5es espec\u00edficas de GL, Company Code e Profit Center.",
          classification: "ME"
        },
        {
          id: "step_19_19.3.1",
          sourceRef: "19.3.1",
          description: "Localizar a(s) linha(s) que representam o ganho/ perda e selecionar a linha para edi\u00e7\u00e3o dos campos: GL Account, Company Code e Profit Center.",
          classification: "ME"
        },
        {
          id: "step_19_19.4",
          sourceRef: "19.4",
          description: "Identificar a regi\u00e3o aplic\u00e1vel (East Coast, Gulf Coast, Midcontinent, West Coast) com base na descri\u00e7\u00e3o da fatura e nos mapas associados. Controle: Aprova\u00e7\u00e3o em dois n\u00edveis obrigat\u00f3ria: Todas as faturas Gain & Loss devem passar por dois n\u00edveis de aprova\u00e7\u00e3o antes do sistema postar a fatura.",
          classification: "MS"
        },
        {
          id: "step_19_19.5",
          sourceRef: "19.5",
          description: "Para faturas classificadas como East Coast, preencher os campos GL Account, Company Code e Profit Center na(s) linha(s) da fatura conforme o mapa/regra de regi\u00e3o. Controle: Aprova\u00e7\u00e3o em dois n\u00edveis obrigat\u00f3ria: Todas as faturas Gain & Loss devem passar por dois n\u00edveis de aprova\u00e7\u00e3o antes do sistema postar a fatura.",
          classification: "MS"
        },
        {
          id: "step_19_19.5.1",
          sourceRef: "19.5.1",
          description: "No campo 'GL Account', inserir o c\u00f3digo GL correspondente \u00e0 natureza do ganho/perda conforme orienta\u00e7\u00e3o regional (consultar mapa).",
          classification: "MA"
        },
        {
          id: "step_19_19.5.2",
          sourceRef: "19.5.2",
          description: "No campo 'Company Code', inserir o c\u00f3digo da companhia indicada na fatura.",
          classification: "ME"
        },
        {
          id: "step_19_19.5.3",
          sourceRef: "19.5.3",
          description: "No campo 'Profit Center', inserir o Profit Center correspondente \u00e0 East Coast conforme o mapa/regra. Controle: Aprova\u00e7\u00e3o em dois n\u00edveis obrigat\u00f3ria: Todas as faturas Gain & Loss devem passar por dois n\u00edveis de aprova\u00e7\u00e3o antes do sistema postar a fatura.",
          classification: "MA"
        },
        {
          id: "step_19_19.6",
          sourceRef: "19.6",
          description: "Para faturas classificadas como Gulf Coast, preencher GL Account, Company Code e Profit Center conforme o mapa/regra regional. Controle: Aprova\u00e7\u00e3o em dois n\u00edveis obrigat\u00f3ria: Todas as faturas Gain & Loss devem passar por dois n\u00edveis de aprova\u00e7\u00e3o antes do sistema postar a fatura.",
          classification: "MS"
        },
        {
          id: "step_19_19.6.1",
          sourceRef: "19.6.1",
          description: "Preencher 'GL Account' de acordo com a natureza do d\u00e9bito/cr\u00e9dito na fatura.",
          classification: "ME"
        },
        {
          id: "step_19_19.6.2",
          sourceRef: "19.6.2",
          description: "Preencher 'Company Code' conforme indicado na fatura.",
          classification: "ME"
        },
        {
          id: "step_19_19.6.3",
          sourceRef: "19.6.3",
          description: "Preencher 'Profit Center' para Gulf Coast conforme mapa/regra. Controle: Aprova\u00e7\u00e3o em dois n\u00edveis obrigat\u00f3ria: Todas as faturas Gain & Loss devem passar por dois n\u00edveis de aprova\u00e7\u00e3o antes do sistema postar a fatura.",
          classification: "MS"
        },
        {
          id: "step_19_19.7",
          sourceRef: "19.7",
          description: "Para faturas classificadas como Midcontinent, preencher GL Account, Company Code e Profit Center conforme o mapa/regra regional. Controle: Aprova\u00e7\u00e3o em dois n\u00edveis obrigat\u00f3ria: Todas as faturas Gain & Loss devem passar por dois n\u00edveis de aprova\u00e7\u00e3o antes do sistema postar a fatura.",
          classification: "MS"
        },
        {
          id: "step_19_19.7.1",
          sourceRef: "19.7.1",
          description: "Preencher 'GL Account' conforme a natureza do ganho/perda.",
          classification: "ME"
        },
        {
          id: "step_19_19.7.2",
          sourceRef: "19.7.2",
          description: "Preencher 'Company Code' conforme a fatura.",
          classification: "ME"
        },
        {
          id: "step_19_19.7.3",
          sourceRef: "19.7.3",
          description: "Preencher 'Profit Center' para Midcontinent conforme mapa/regra. Controle: Aprova\u00e7\u00e3o em dois n\u00edveis obrigat\u00f3ria: Todas as faturas Gain & Loss devem passar por dois n\u00edveis de aprova\u00e7\u00e3o antes do sistema postar a fatura.",
          classification: "MS"
        },
        {
          id: "step_19_19.8",
          sourceRef: "19.8",
          description: "Para faturas classificadas como West Coast, preencher GL Account, Company Code e Profit Center conforme o mapa/regra regional. Controle: Aprova\u00e7\u00e3o em dois n\u00edveis obrigat\u00f3ria: Todas as faturas Gain & Loss devem passar por dois n\u00edveis de aprova\u00e7\u00e3o antes do sistema postar a fatura.",
          classification: "MS"
        },
        {
          id: "step_19_19.8.1",
          sourceRef: "19.8.1",
          description: "Preencher 'GL Account' conforme o tipo de transa\u00e7\u00e3o indicado na fatura.",
          classification: "ME"
        },
        {
          id: "step_19_19.8.2",
          sourceRef: "19.8.2",
          description: "Preencher 'Company Code' conforme a fatura.",
          classification: "ME"
        },
        {
          id: "step_19_19.8.3",
          sourceRef: "19.8.3",
          description: "Preencher 'Profit Center' para West Coast conforme mapa/regra. Controle: Aprova\u00e7\u00e3o em dois n\u00edveis obrigat\u00f3ria: Todas as faturas Gain & Loss devem passar por dois n\u00edveis de aprova\u00e7\u00e3o antes do sistema postar a fatura.",
          classification: "MS"
        },
        {
          id: "step_19_19.9",
          sourceRef: "19.9",
          description: "Ap\u00f3s preencher cabe\u00e7alho e line items, executar a sequ\u00eancia: Salvar \u2192 Simular rules \u2192 Apply rules para validar as regras autom\u00e1ticas do VIM.",
          classification: "ME"
        },
        {
          id: "step_19_19.9.1",
          sourceRef: "19.9.1",
          description: "Clicar/selecionar 'Save' para persistir as altera\u00e7\u00f5es da fatura no VIM.",
          classification: "ME"
        },
        {
          id: "step_19_19.9.2",
          sourceRef: "19.9.2",
          description: "Executar 'Simulate rules' para validar o comportamento das regras configuradas sobre a fatura (simula\u00e7\u00e3o pr\u00e9-aplica\u00e7\u00e3o).",
          classification: "ME"
        },
        {
          id: "step_19_19.9.3",
          sourceRef: "19.9.3",
          description: "Executar 'Apply rules' para efetivar as regras que ir\u00e3o definir roteamento e poss\u00edveis campos autom\u00e1ticos.",
          classification: "ME"
        },
        {
          id: "step_19_19.10",
          sourceRef: "19.10",
          description: "Ap\u00f3s aplicar regras, registrar sua aprova\u00e7\u00e3o na fatura (primeiro n\u00edvel).",
          classification: "MS"
        },
        {
          id: "step_19_19.10.1",
          sourceRef: "19.10.1",
          description: "No VIM, selecionar a op\u00e7\u00e3o para registrar sua aprova\u00e7\u00e3o/autoridade na fatura (marcar/selecionar 'approve' ou preencher campo de aprova\u00e7\u00e3o conforme a interface dispon\u00edvel).",
          classification: "MS"
        },
        {
          id: "step_19_19.11",
          sourceRef: "19.11",
          description: "Encaminhar a fatura para a aprova\u00e7\u00e3o da Gina conforme procedimento: enviar para Gina ap\u00f3s ter registrado sua aprova\u00e7\u00e3o. Controle: Aprova\u00e7\u00e3o em dois n\u00edveis obrigat\u00f3ria: Todas as faturas Gain & Loss devem passar por dois n\u00edveis de aprova\u00e7\u00e3o antes do sistema postar a fatura. Encaminhamento para Gina: Depois de registrar sua aprova\u00e7\u00e3o (n\u00edvel 1), encaminhar a fatura para Gina para o segundo n\u00edvel de aprova\u00e7\u00e3o. \u00b7 Gina",
          classification: "MS"
        },
        {
          id: "step_19_19.11.1",
          sourceRef: "19.11.1",
          description: "Ap\u00f3s registrar sua aprova\u00e7\u00e3o, selecionar a a\u00e7\u00e3o de encaminhamento/submit que envia a fatura para a aprova\u00e7\u00e3o seguinte e/ou colocar Gina como aprovadora respons\u00e1vel conforme o fluxo indicado.",
          classification: "MS"
        },
        {
          id: "step_19_19.12",
          sourceRef: "19.12",
          description: "Observa\u00e7\u00e3o: todo processo Gain & Loss passa por duas camadas de aprova\u00e7\u00e3o. Depois que as aprova\u00e7\u00f5es forem conclu\u00eddas (n\u00edvel 1 e n\u00edvel 2 \u2014 Gina), a fatura ser\u00e1 automaticamente posta pelo sistema conforme o fluxo padr\u00e3o.",
          classification: "MS"
        },
      ]
    },
    {
      id: "step_20",
      sourceStep: "20",
      number: "20",
      title: "Processo 999+ (Analista) \u2014 gerar relat\u00f3rio 999, preparar arquivo e submeter para execu\u00e7\u00e3o em background Executar a rotina 999+ para associar VBDs ao i",
      description: "Executar a rotina 999+ para associar VBDs ao invoice quando o n\u00famero de VBDs excede o limite exibido em SAP; preparar arquivos, solicitar execu\u00e7\u00e3o, acompanhar job em background, consolidar resultados e notificar partes interessadas.",
      classification: "ME",
      classifications: ["ME", "MS"],
      macroBlockId: "execution",
      macroBlockName: "Execution",
      capabilityId: "cap-auto",
      capabilityName: "Capability Automática",
      solutionId: "sol-rpa-report",
      solutionIds: ["sol-rpa-report"],
      technologyType: "RPA / Planilha",
      rationale: "A rotina 999+ usa relat\u00f3rio, arquivo e execu\u00e7\u00e3o em background, com regras relativamente estruturadas.",
      effort: {
        level: "medium",
        score: 50,
        confidence: "medium",
        drivers: [],
        unknowns: []
      },
      humanInTheLoop: {
        hasHumanControl: true,
        level: "partial",
        description: "`review_required` \u2014 revis\u00e3o humana permanece necess\u00e1ria para dados, exce\u00e7\u00f5es, aprova\u00e7\u00f5es e/ou transa\u00e7\u00f5es financeiras."
      },
      substeps: [
        {
          id: "step_20_20.1",
          sourceRef: "20.1",
          description: "Registrar a solicita\u00e7\u00e3o enviada pelo analista que pede a execu\u00e7\u00e3o dos relat\u00f3rios 999 e que gerar\u00e1 arquivo entregue via e-mail para o processador. Salvar anexo em pasta do sistema: Salvar o arquivo/anexo recebido do analista em uma pasta do sistema para refer\u00eancia e auditoria.",
          classification: "MA"
        },
        {
          id: "step_20_20.1.1",
          sourceRef: "20.1.1",
          description: "Salvar o arquivo/anexo recebido na caixa de correio pessoal em uma pasta do sistema para refer\u00eancia e processamento posterior. Salvar anexo em pasta do sistema: Salvar o arquivo/anexo recebido do analista em uma pasta do sistema para refer\u00eancia e auditoria.",
          classification: "MA"
        },
        {
          id: "step_20_20.1.2",
          sourceRef: "20.1.2",
          description: "Abrir a c\u00f3pia do invoice e verificar: Vendor Name e Vendor Number, Invoice Number, Invoice Amount, Payment Terms e Due Date; registrar observa\u00e7\u00f5es no tracker.",
          classification: "ME"
        },
        {
          id: "step_20_20.2",
          sourceRef: "20.2",
          description: "Construir o corpo do e-mail com os campos exigidos para a execu\u00e7\u00e3o 999 conforme recebido: Vendor no, Company Code, Profit Centre, Invoice No, Document No, GL Account, Invoice Amount; manter rascunho para envio ap\u00f3s coleta de demais dados. Formato do e\u2011mail para solicita\u00e7\u00e3o 999: Incluir '999' no assunto seguido de Vendor Name e Invoice/Reference No; enviar 'Para' o Generic Mail ID 'Secondary Post/Clear & Vendor modifications' e colocar em 'Cc' o analista originador.",
          classification: "MA"
        },
        {
          id: "step_20_20.3",
          sourceRef: "20.3",
          description: "Criar ou atualizar um arquivo Excel de controle contendo as informa\u00e7\u00f5es do invoice e o hist\u00f3rico de a\u00e7\u00f5es (coluna Comments) para acompanhamento do processo 999+.",
          classification: "ME"
        },
        {
          id: "step_20_20.4",
          sourceRef: "20.4",
          description: "No SAP, abrir a transa\u00e7\u00e3o ZEWB (Custom Trading Expense Workbench) e selecionar a op\u00e7\u00e3o 'Accrual/Receivable VBD Docs'. Preencher os par\u00e2metros de busca: Vendor Number (conforme e-mail ou vendor list) e Transaction Date (conforme invoice).",
          classification: "ME"
        },
        {
          id: "step_20_20.5",
          sourceRef: "20.5",
          description: "Executar a pesquisa no ZEWB; exportar o resultado para Excel; salvar o arquivo extra\u00eddo no sistema na mesma pasta usada para os documentos do caso.",
          classification: "ME"
        },
        {
          id: "step_20_20.6",
          sourceRef: "20.6",
          description: "Abrir o arquivo Excel recebido do analista (passo inicial) e copiar todos os VBD Numbers (itens 5999-line items) para uso no passo seguinte.",
          classification: "MA"
        },
        {
          id: "step_20_20.6.1",
          sourceRef: "20.6.1",
          description: "Abrir o arquivo Excel salvo e localizar a coluna com os VBD Numbers; preparar para c\u00f3pia.",
          classification: "ME"
        },
        {
          id: "step_20_20.6.2",
          sourceRef: "20.6.2",
          description: "Selecionar todas as c\u00e9lulas que cont\u00eam os VBD Numbers e copiar (Colar em coluna A de um arquivo de trabalho se necess\u00e1rio).",
          classification: "ME"
        },
        {
          id: "step_20_20.7",
          sourceRef: "20.7",
          description: "No SAP, executar a transa\u00e7\u00e3o ZRTR_VIM_999 (ZRTR_VIM_999 \u2013 VIM Posting 999) para preparar o posting dos VBDs copiados.",
          classification: "ME"
        },
        {
          id: "step_20_20.8",
          sourceRef: "20.8",
          description: "Na tela ZRTR_VIM_999: acessar o campo 'Accrual VBD Number' (clicar na seta para lista quando houver muitos VBDs), colar todos os VBDs copiados e clicar em Execute. A execu\u00e7\u00e3o salva a opera\u00e7\u00e3o e retorna \u00e0 p\u00e1gina anterior.",
          classification: "ME"
        },
        {
          id: "step_20_20.9",
          sourceRef: "20.9",
          description: "Clicar em 'Show Document selection' para visualizar todos os VBDs dispon\u00edveis a partir da execu\u00e7\u00e3o; aguardar a gera\u00e7\u00e3o completa do relat\u00f3rio.",
          classification: "ME"
        },
        {
          id: "step_20_20.10",
          sourceRef: "20.10",
          description: "Atualizar o rascunho de e-mail com as informa\u00e7\u00f5es geradas: incluir '999' no assunto juntamente com Vendor Name & Invoice/Reference No; colocar o Generic Mail ID 'Secondary Post/Clear & Vendor modifications' no campo Para e em Cc o analista que originou a solicita\u00e7\u00e3o; colar o texto do modelo da regi\u00e3o apropriada (ex.: MIDCON) e anexar a c\u00f3pia do invoice, invoice reference number, net due date e total payout amount. Formato do e\u2011mail para solicita\u00e7\u00e3o 999: Incluir '999' no assunto seguido de Vendor Name e Invoice/Reference No; enviar 'Para' o Generic Mail ID 'Secondary Post/Clear & Vendor modifications' e colocar em 'Cc' o analista originador.",
          classification: "MA"
        },
        {
          id: "step_20_20.11",
          sourceRef: "20.11",
          description: "Comparar o n\u00famero total de VBDs enviados (ex.: 5996) com os VBDs retornados pela execu\u00e7\u00e3o (ex.: 5879). Registrar no tracker os VBDs ausentes e poss\u00edveis raz\u00f5es (used, cancelled, blocked).",
          classification: "MA"
        },
        {
          id: "step_20_20.12",
          sourceRef: "20.12",
          description: "No menu Program, selecionar 'Execute in Background'; no pop-up de Output Device informar 'LOCL' e clicar em Properties. Defini\u00e7\u00e3o do Output Device: Informar 'LOCL' no campo Output Device ao executar em background conforme procedimento.",
          classification: "ME"
        },
        {
          id: "step_20_20.12.1",
          sourceRef: "20.12.1",
          description: "Verificar e confirmar as informa\u00e7\u00f5es na tela de propriedades e confirmar (Tick). Defini\u00e7\u00e3o do Output Device: Informar 'LOCL' no campo Output Device ao executar em background conforme procedimento.",
          classification: "ME"
        },
        {
          id: "step_20_20.13",
          sourceRef: "20.13",
          description: "Na \u00e1rea 'Output Options' acessar Priority, alterar de 'Medium' para 'High' (Print Priority - High) e confirmar (Tick). Prioridade do job: Alterar a prioridade do job de 'Medium' para 'High' (Print Priority - High) antes de salvar a execu\u00e7\u00e3o em background.",
          classification: "ME"
        },
        {
          id: "step_20_20.14",
          sourceRef: "20.14",
          description: "Confirmar os par\u00e2metros mostrados; ao clicar no Tick, ser\u00e1 mostrado o painel Start time. Selecionar 'Immediate' e salvar para submeter o job em background.",
          classification: "ME"
        },
        {
          id: "step_20_20.14.1",
          sourceRef: "20.14.1",
          description: "Na tela Start time escolher 'Immediate' e clicar em Save para que o processamento inicie em background.",
          classification: "ME"
        },
        {
          id: "step_20_20.15",
          sourceRef: "20.15",
          description: "Marcar no arquivo de controle (tracker) a linha correspondente com o status '999 run'. Anexar ao rascunho de e\u2011mail o Excel com a lista completa de VBDs que foi recebida do analista (entrada original).",
          classification: "MA"
        },
        {
          id: "step_20_20.15.1",
          sourceRef: "20.15.1",
          description: "Editar a coluna 'Comments' ou 'Status' no tracker para indicar que o job 999 est\u00e1 em execu\u00e7\u00e3o.",
          classification: "ME"
        },
        {
          id: "step_20_20.15.2",
          sourceRef: "20.15.2",
          description: "Anexar o arquivo Excel contendo os VBDs ao rascunho do e\u2011mail preparado anteriormente.",
          classification: "ME"
        },
        {
          id: "step_20_20.16",
          sourceRef: "20.16",
          description: "Ap\u00f3s submeter o job em background (pode levar horas), abrir a transa\u00e7\u00e3o FBL1N \u2013 Vendor Line items; informar Vendor Code e gerar o relat\u00f3rio.",
          classification: "ME"
        },
        {
          id: "step_20_20.16.1",
          sourceRef: "20.16.1",
          description: "No SAP, executar T.Code 'FBL1N', inserir o Vendor Code e clicar no bot\u00e3o de execu\u00e7\u00e3o para gerar os line items.",
          classification: "ME"
        },
        {
          id: "step_20_20.17",
          sourceRef: "20.17",
          description: "No resultado do FBL1N acessar Layout e selecionar o layout 'E Block 999' como padr\u00e3o; garantir que o campo 'Payment Block' esteja dispon\u00edvel e filtrar por 'E' para identificar itens com bloqueio E.",
          classification: "ME"
        },
        {
          id: "step_20_20.18",
          sourceRef: "20.18",
          description: "Acessar a transa\u00e7\u00e3o ZRTR_VIM_E_FI_SUMRIZ (FI Summarization). Inserir Posting Date (data em que iniciou a execu\u00e7\u00e3o 999+) e Vendor No; submeter o programa via 'Execute in Background'.",
          classification: "ME"
        },
        {
          id: "step_20_20.19",
          sourceRef: "20.19",
          description: "No pop-up de Output Device inserir 'LOCL', clicar Properties, verificar informa\u00e7\u00f5es e confirmar; em Output Options alterar Priority para 'High' e confirmar; em Start time escolher 'Immediate' e salvar para execu\u00e7\u00e3o em background. Defini\u00e7\u00e3o do Output Device: Informar 'LOCL' no campo Output Device ao executar em background conforme procedimento. Prioridade do job: Alterar a prioridade do job de 'Medium' para 'High' (Print Priority - High) antes de salvar a execu\u00e7\u00e3o em background.",
          classification: "ME"
        },
        {
          id: "step_20_20.20",
          sourceRef: "20.20",
          description: "Aguardar alguns minutos (normalmente 5\u201310; para execu\u00e7\u00f5es grandes at\u00e9 ~4 horas conforme volume) at\u00e9 que o job finalize; durante esse tempo atualizar o tracker com coment\u00e1rios de progresso.",
          classification: "ME"
        },
        {
          id: "step_20_20.21",
          sourceRef: "20.21",
          description: "Voltar ao workplace SAP, selecionar o layout da ferramenta de Summarization e usar List -> Refresh para carregar o resultado; se apenas parte estiver processada, repetir refresh at\u00e9 completar.",
          classification: "ME"
        },
        {
          id: "step_20_20.22",
          sourceRef: "20.22",
          description: "Confirmar se a Summarization Tool exibiu todos os itens esperados e se o processo foi conclu\u00eddo.",
          classification: "MS"
        },
        {
          id: "step_20_20.23",
          sourceRef: "20.23",
          description: "Comparar o valor total do invoice com o total apresentado pelo Summarization Report; calcular a diferen\u00e7a (ex.: Invoice $98,195.77 menos SAP $97,004.91 = $1,190.86) e registrar o valor adicional em planilha e rascunho de e-mail.",
          classification: "MA"
        },
        {
          id: "step_20_20.24",
          sourceRef: "20.24",
          description: "Do Summarization Report copiar todos os Document Nos gerados; atualizar o rascunho do e\u2011mail adicionando o 'additional amount' (diferen\u00e7a apurada) e a lista de Document Nos; revisar e enviar o e\u2011mail ao Generic Mail ID (Secondary Post/Clear & Vendor modifications) com Cc ao analista originador. Formato do e\u2011mail para solicita\u00e7\u00e3o 999: Incluir '999' no assunto seguido de Vendor Name e Invoice/Reference No; enviar 'Para' o Generic Mail ID 'Secondary Post/Clear & Vendor modifications' e colocar em 'Cc' o analista originador.",
          classification: "MA"
        },
        {
          id: "step_20_20.24.1",
          sourceRef: "20.24.1",
          description: "Selecionar e copiar todos os Document Nos apresentados no Summarization Report para inclus\u00e3o no e\u2011mail.",
          classification: "ME"
        },
        {
          id: "step_20_20.24.2",
          sourceRef: "20.24.2",
          description: "Adicionar no corpo do e\u2011mail o valor adicional, a lista de Document Nos e qualquer atualiza\u00e7\u00e3o relevante do tracker; enviar o e\u2011mail conforme destinat\u00e1rios padronizados. Formato do e\u2011mail para solicita\u00e7\u00e3o 999: Incluir '999' no assunto seguido de Vendor Name e Invoice/Reference No; enviar 'Para' o Generic Mail ID 'Secondary Post/Clear & Vendor modifications' e colocar em 'Cc' o analista originador.",
          classification: "MA"
        },
        {
          id: "step_20_20.25",
          sourceRef: "20.25",
          description: "Aguardar retorno do P66 Team; quando receberem e processarem o pagamento, o time enviar\u00e1 por reply o Document No final consolidado. Verificar a resposta, confirmar os detalhes e marcar no tracker que o pagamento do vendor foi realizado.",
          classification: "ME"
        },
      ]
    },
    {
      id: "step_21",
      sourceStep: "21",
      number: "21",
      title: "Processo 999+ (Supervisor) \u2014 Postagem, Clear Vendor e Ajustes (F-44 e controle de Due/Baseline Date) Sequ\u00eancia execut\u00e1vel para o Supervisor realizar o",
      description: "Sequ\u00eancia execut\u00e1vel para o Supervisor realizar o clear vendor via F-44, ajustar lan\u00e7amentos (charge off), inserir chaves e c\u00f3digos, confirmar lan\u00e7amentos e alterar Due Date / Baseline Date conforme dados fornecidos pelo Analyst.",
      classification: "MS",
      classifications: ["MS"],
      macroBlockId: "execution",
      macroBlockName: "Execution",
      capabilityId: "cap-auto",
      capabilityName: "Capability Automática",
      solutionId: "sol-wf-routing",
      solutionIds: ["sol-wf-routing"],
      technologyType: "Workflow",
      rationale: "Postagem, clearing e ajustes financeiros s\u00e3o transa\u00e7\u00f5es sens\u00edveis e devem manter controle e aprova\u00e7\u00e3o humana.",
      effort: {
        level: "high",
        score: 50,
        confidence: "medium",
        drivers: [],
        unknowns: []
      },
      humanInTheLoop: {
        hasHumanControl: true,
        level: "partial",
        description: "`review_required` \u2014 revis\u00e3o humana permanece necess\u00e1ria para dados, exce\u00e7\u00f5es, aprova\u00e7\u00f5es e/ou transa\u00e7\u00f5es financeiras."
      },
      substeps: [
        {
          id: "step_21_21.1",
          sourceRef: "21.1",
          description: "Abrir a mensagem recebida do Analyst que cont\u00e9m a invoice para upload 999 VBD e extrair os campos obrigat\u00f3rios: vendor number, document number, company code e indica\u00e7\u00e3o de write off (se aplic\u00e1vel). Salvar anexos localmente para refer\u00eancia. Controle: campos obrigat\u00f3rios no e-mail do Analyst: O e-mail do Analyst deve conter, no corpo ou em anexo, os seguintes campos: Vendor number, Document number, Company code e indica\u00e7\u00e3o sobre write off adicional. Sem esses campos n\u00e3o prossiga com F-44.",
          classification: "ME"
        },
        {
          id: "step_21_21.1.1",
          sourceRef: "21.1.1",
          description: "Abrir o e-mail do Analyst, salvar o anexo da invoice em pasta de trabalho local e confirmar que o anexo corresponde ao documento referenciado na mensagem.",
          classification: "MA"
        },
        {
          id: "step_21_21.1.2",
          sourceRef: "21.1.2",
          description: "Copiar do corpo do e-mail ou do anexo os seguintes campos exatamente como enviados: Vendor number, Document number, Company code e informa\u00e7\u00e3o sobre write off adicional. Registrar em planilha de controle ou sistema interno usado pelo time.",
          classification: "ME"
        },
        {
          id: "step_21_21.2",
          sourceRef: "21.2",
          description: "Acessar o SAP com credenciais do Supervisor e chamar a transa\u00e7\u00e3o F-44 (Clear Vendor). Inserir o Account (n\u00famero de conta/fornecedor) conforme o campo 'vendor number' recebido no e-mail.",
          classification: "ME"
        },
        {
          id: "step_21_21.2.1",
          sourceRef: "21.2.1",
          description: "Efetuar login no SAP e executar a transa\u00e7\u00e3o digitando F-44 na barra de comandos. Confirmar que a tela de Clear Vendor foi carregada.",
          classification: "ME"
        },
        {
          id: "step_21_21.2.2",
          sourceRef: "21.2.2",
          description: "No campo Account da tela F-44, inserir o vendor/account number exatamente como informado no e-mail e avan\u00e7ar (Enter) para carregar os line items do fornecedor.",
          classification: "ME"
        },
        {
          id: "step_21_21.3",
          sourceRef: "21.3",
          description: "Ap\u00f3s carregar os line items do fornecedor, localizar o line item relacionado ao Document number informado e marcar a op\u00e7\u00e3o para 'Charge off difference'.",
          classification: "ME"
        },
        {
          id: "step_21_21.3.1",
          sourceRef: "21.3.1",
          description: "Localizar na lista o line item que cont\u00e9m o Document number recebido do Analyst. Selecionar esse line item para edi\u00e7\u00e3o.",
          classification: "ME"
        },
        {
          id: "step_21_21.3.2",
          sourceRef: "21.3.2",
          description: "Com o line item selecionado, ativar/selecionar a op\u00e7\u00e3o 'Charge off difference' para habilitar o lan\u00e7amento de diferen\u00e7a (charge off).",
          classification: "ME"
        },
        {
          id: "step_21_21.4",
          sourceRef: "21.4",
          description: "Na linha de ajustes ap\u00f3s ativar charge off, selecionar a Posting Key necess\u00e1ria e preencher o campo Account com o vendor number conforme instru\u00eddo. Confirmar com Enter para aplicar os valores provis\u00f3rios.",
          classification: "ME"
        },
        {
          id: "step_21_21.4.1",
          sourceRef: "21.4.1",
          description: "Escolher a Posting Key apropriada para o tipo de ajuste (conforme instru\u00e7\u00e3o interna) no campo Posting Key da linha de ajuste.",
          classification: "ME"
        },
        {
          id: "step_21_21.4.2",
          sourceRef: "21.4.2",
          description: "No campo Account da linha de ajuste, inserir o Vendor number fornecido e pressionar Enter para validar a entrada.",
          classification: "ME"
        },
        {
          id: "step_21_21.5",
          sourceRef: "21.5",
          description: "Inserir o Amount de ajuste exatamente conforme informado pelo Analyst. Ap\u00f3s preencher, clicar em 'Process open items' para que o sistema calcule o balan\u00e7o. Exce\u00e7\u00e3o: totais n\u00e3o balanceados ap\u00f3s 'Process open items': Condi\u00e7\u00e3o: Ap\u00f3s 'Process open items' o NET n\u00e3o est\u00e1 em 0.. A\u00e7\u00f5es: Selecionar novamente 'Charge off difference'.; Revisar e ajustar o Amount inserido e as Posting Keys.; Reexecutar 'Process open items'.. Resultado: 21.3 \u00b7 Ap\u00f3s carregar os line items do fornecedor, localizar o line item relacionado ao Document number informado e marcar a op\u00e7\u00e3o para 'Charge off difference'.",
          classification: "ME"
        },
        {
          id: "step_21_21.5.1",
          sourceRef: "21.5.1",
          description: "Inserir no campo Amount o valor do ajuste informado no e-mail do Analyst.",
          classification: "ME"
        },
        {
          id: "step_21_21.5.2",
          sourceRef: "21.5.2",
          description: "Clicar em 'Process open items' para que o SAP avalie o balan\u00e7o do lan\u00e7amento.",
          classification: "ME"
        },
        {
          id: "step_21_21.6",
          sourceRef: "21.6",
          description: "Avaliar o resultado do 'Process open items' para confirmar balanceamento do lan\u00e7amento. Exce\u00e7\u00e3o: totais n\u00e3o balanceados ap\u00f3s 'Process open items': Condi\u00e7\u00e3o: Ap\u00f3s 'Process open items' o NET n\u00e3o est\u00e1 em 0.. A\u00e7\u00f5es: Selecionar novamente 'Charge off difference'.; Revisar e ajustar o Amount inserido e as Posting Keys.; Reexecutar 'Process open items'.. Resultado: 21.3 \u00b7 Ap\u00f3s carregar os line items do fornecedor, localizar o line item relacionado ao Document number informado e marcar a op\u00e7\u00e3o para 'Charge off difference'.",
          classification: "MS"
        },
        {
          id: "step_21_21.7",
          sourceRef: "21.7",
          description: "Selecionar a Posting Key final conforme necessidade, preencher o Account com o vendor number, inserir o Amount que ser\u00e1 ajustado, informar o Tax Code (por exemplo IO se aplic\u00e1vel) e demais campos obrigat\u00f3rios (ex.: centro de custo/profit center). Controle: tax code e profit center conforme Analyst: O Tax Code (ex.: IO) e o Profit Center devem ser inseridos exatamente como fornecidos pelo Analyst antes de salvar o lan\u00e7amento.",
          classification: "ME"
        },
        {
          id: "step_21_21.7.1",
          sourceRef: "21.7.1",
          description: "No campo Tax Code informar o c\u00f3digo fornecido (ex.: IO) conforme instru\u00e7\u00e3o do Analyst.",
          classification: "ME"
        },
        {
          id: "step_21_21.7.2",
          sourceRef: "21.7.2",
          description: "Revisar posting key, vendor number, amount e tax code; pressionar Enter para aplicar.",
          classification: "ME"
        },
        {
          id: "step_21_21.8",
          sourceRef: "21.8",
          description: "Inserir o Profit Center informado pelo Analyst e verificar se o NET do documento passou a 0 ap\u00f3s ajustes. Controle: tax code e profit center conforme Analyst: O Tax Code (ex.: IO) e o Profit Center devem ser inseridos exatamente como fornecidos pelo Analyst antes de salvar o lan\u00e7amento.",
          classification: "MS"
        },
        {
          id: "step_21_21.9",
          sourceRef: "21.9",
          description: "Abrir a transa\u00e7\u00e3o FBL1N, inserir o vendor/account e executar a exibi\u00e7\u00e3o. Localizar o documento pelo Document number e confirmar que o total e o status correspondem ao que foi postado.",
          classification: "MA"
        },
        {
          id: "step_21_21.9.1",
          sourceRef: "21.9.1",
          description: "Acessar FBL1N, informar o vendor/account e executar a visualiza\u00e7\u00e3o para listar line items.",
          classification: "ME"
        },
        {
          id: "step_21_21.9.2",
          sourceRef: "21.9.2",
          description: "Localizar o Document number e confirmar que o valor total exibido na listagem \u00e9 igual ao informado pelo Analyst e que o documento est\u00e1 com status postado.",
          classification: "ME"
        },
        {
          id: "step_21_21.10",
          sourceRef: "21.10",
          description: "Abrir a fun\u00e7\u00e3o Change and Display no documento postado para alterar o Due Date conforme instru\u00e7\u00e3o do Analyst e ajustar o Baseline Date para a posting date informada. Validar a regra de prazo indicada pelo Analyst (Baseline Date deve ser anterior em at\u00e9 14 dias \u2014 ver unknown). Salvar as altera\u00e7\u00f5es. Inc\u00f3gnita: interpreta\u00e7\u00e3o exata da regra 'before 14 days' para Baseline Date: A regra indicada na fonte diz: 'the date should be before 14 days for the date to be posted.' A interpreta\u00e7\u00e3o aplicada deve ser confirmada com o Analyst se houver d\u00favida sobre qual data comparar (posting date vs. due date) ou se a janela \u00e9 estritamente '<= 14 dias'.",
          classification: "MA"
        },
        {
          id: "step_21_21.10.1",
          sourceRef: "21.10.1",
          description: "No SAP, abrir o documento em modo Change/Display (Change) que permita edi\u00e7\u00e3o de Due Date e Baseline Date.",
          classification: "ME"
        },
        {
          id: "step_21_21.10.2",
          sourceRef: "21.10.2",
          description: "Alterar o campo Due Date para o valor informado pelo Analyst. Ajustar o Baseline Date para a posting date indicada pelo Analyst. Salvar as altera\u00e7\u00f5es.",
          classification: "ME"
        },
        {
          id: "step_21_21.11",
          sourceRef: "21.11",
          description: "Avaliar se o Baseline Date definido atende \u00e0 restri\u00e7\u00e3o indicada pelo Analyst (ver nota de fonte). Inc\u00f3gnita: interpreta\u00e7\u00e3o exata da regra 'before 14 days' para Baseline Date: A regra indicada na fonte diz: 'the date should be before 14 days for the date to be posted.' A interpreta\u00e7\u00e3o aplicada deve ser confirmada com o Analyst se houver d\u00favida sobre qual data comparar (posting date vs. due date) ou se a janela \u00e9 estritamente '<= 14 dias'.",
          classification: "MA"
        },
      ]
    },
    {
      id: "step_22",
      sourceStep: "22",
      number: "22",
      title: "Processamento DCP Front Range Transportation \u2014 extra\u00e7\u00e3o do Nomination Key (NK) via Fiori e gera\u00e7\u00e3o/tratamento de VBD para transport system USDCPPFTRG",
      description: "Procedimento para localizar o Nom Key (NK) nas faturas do fornecedor Front Range Pipeline LLC usando SAP Fiori, gerar ou reconciliar o VBD conforme codifica\u00e7\u00e3o para o transport system USDCPPFTRG, capturar evid\u00eancias e proceder com o processamento da fatura.",
      classification: "ME",
      classifications: ["ME", "MS"],
      macroBlockId: "execution",
      macroBlockName: "Execution",
      capabilityId: "cap-auto",
      capabilityName: "Capability Automática",
      solutionId: "sol-rpa-upload-vim",
      solutionIds: ["sol-rpa-upload-vim"],
      technologyType: "RPA",
      rationale: "A extra\u00e7\u00e3o de NK e gera\u00e7\u00e3o de VBD s\u00e3o estruturadas, mas dependem de informa\u00e7\u00f5es do caso e confer\u00eancia de resultado.",
      effort: {
        level: "high",
        score: 50,
        confidence: "medium",
        drivers: [],
        unknowns: []
      },
      humanInTheLoop: {
        hasHumanControl: true,
        level: "partial",
        description: "`review_required` \u2014 revis\u00e3o humana permanece necess\u00e1ria para dados, exce\u00e7\u00f5es, aprova\u00e7\u00f5es e/ou transa\u00e7\u00f5es financeiras."
      },
      substeps: [
        {
          id: "step_22_22.1",
          sourceRef: "22.1",
          description: "Preparar ambiente e acessar o SAP Fiori para iniciar a localiza\u00e7\u00e3o do Nom Key.",
          classification: "ME"
        },
        {
          id: "step_22_22.1.1",
          sourceRef: "22.1.1",
          description: "Confirme que a fatura a ser processada pertence a Front Range Pipeline LLC e que o caso refere-se ao transport system USDCPPFTRG antes de prosseguir.",
          classification: "ME"
        },
        {
          id: "step_22_22.1.2",
          sourceRef: "22.1.2",
          description: "Abra o SAP Fiori com suas credenciais habituais e navegue para a aplica\u00e7\u00e3o de consulta/visualiza\u00e7\u00e3o de invoices/nomination keys dispon\u00edvel no ambiente.",
          classification: "ME"
        },
        {
          id: "step_22_22.2",
          sourceRef: "22.2",
          description: "No filtro/\u00e1rea de pesquisa da aplica\u00e7\u00e3o Fiori, informe a data agendada correspondente ao processamento e selecione o transport system USDCPPFTRG para limitar os resultados.",
          classification: "MA"
        },
        {
          id: "step_22_22.2.1",
          sourceRef: "22.2.1",
          description: "Digite a scheduled date (data agendada) exatamente como consta no arquivo ou na notifica\u00e7\u00e3o do scheduler para filtrar as faturas relacionadas a esse dia.",
          classification: "ME"
        },
        {
          id: "step_22_22.2.2",
          sourceRef: "22.2.2",
          description: "No campo de sele\u00e7\u00e3o do sistema de transporte, escolha/insira USDCPPFTRG para restringir a busca \u00e0s movimenta\u00e7\u00f5es processadas por esse transport system.",
          classification: "ME"
        },
        {
          id: "step_22_22.3",
          sourceRef: "22.3",
          description: "Aplicar filtro/coluna de origem e localizar o Nomination Key (NK) associado \u00e0 linha da fatura conforme o campo 'origin'.",
          classification: "ME"
        },
        {
          id: "step_22_22.3.1",
          sourceRef: "22.3.1",
          description: "Use o campo origin/Origem na visualiza\u00e7\u00e3o para limitar os registros \u00e0quele ponto de origem indicado na fatura.",
          classification: "ME"
        },
        {
          id: "step_22_22.3.2",
          sourceRef: "22.3.2",
          description: "Revise os resultados filtrados e identifique o campo Nom Key/NK correspondente \u00e0 linha de invoice. Anote o NK para uso na gera\u00e7\u00e3o/associa\u00e7\u00e3o do VBD.",
          classification: "MA"
        },
        {
          id: "step_22_22.4",
          sourceRef: "22.4",
          description: "Capturar screenshot do line-item que cont\u00e9m o Nom Key e demais dados relevantes e enviar ao analista como confirma\u00e7\u00e3o da localiza\u00e7\u00e3o do NK. Requisito de evid\u00eancia do line-item e ajuste: A captura de tela deve mostrar claramente o n\u00famero da fatura, o line-item, o Nom Key identificado e os valores antes/depois de qualquer ajuste; essas imagens devem ser anexadas \u00e0 confirma\u00e7\u00e3o enviada ao analista.",
          classification: "MA"
        },
        {
          id: "step_22_22.4.1",
          sourceRef: "22.4.1",
          description: "Tire uma captura de tela que inclua, no m\u00ednimo, o n\u00famero da fatura, o line-item, o Nom Key identificado e os campos de origem e valor vis\u00edveis. Requisito de evid\u00eancia do line-item e ajuste: A captura de tela deve mostrar claramente o n\u00famero da fatura, o line-item, o Nom Key identificado e os valores antes/depois de qualquer ajuste; essas imagens devem ser anexadas \u00e0 confirma\u00e7\u00e3o enviada ao analista.",
          classification: "MA"
        },
        {
          id: "step_22_22.4.2",
          sourceRef: "22.4.2",
          description: "Anexe o screenshot ao e-mail de confirma\u00e7\u00e3o ao analista respons\u00e1vel indicando o Nom Key localizado e prossiga ap\u00f3s confirma\u00e7\u00e3o do analista, conforme instru\u00eddo.",
          classification: "MA"
        },
        {
          id: "step_22_22.5",
          sourceRef: "22.5",
          description: "Com o Nom Key identificado e a codifica\u00e7\u00e3o aplicada segundo a origem, gere o VBD necess\u00e1rio para o processamento da fatura ou associe o NK ao VBD j\u00e1 existente. Tratamento de storage invoices com VBD auto\u2011fired: Se a fatura pertencer a storage invoices (nota de armazenamento), reconhe\u00e7a que o item pode ter VBD auto\u2011fired; neste caso, valide a presen\u00e7a do VBD auto\u2011fired antes de gerar VBD manual.",
          classification: "ME"
        },
        {
          id: "step_22_22.5.1",
          sourceRef: "22.5.1",
          description: "Avalie se j\u00e1 existe um VBD auto\u2011fired para o item; se n\u00e3o existir, proceda para gera\u00e7\u00e3o do VBD manual conforme a codifica\u00e7\u00e3o aplic\u00e1vel ao origin/NK. Tratamento de storage invoices com VBD auto\u2011fired: Se a fatura pertencer a storage invoices (nota de armazenamento), reconhe\u00e7a que o item pode ter VBD auto\u2011fired; neste caso, valide a presen\u00e7a do VBD auto\u2011fired antes de gerar VBD manual.",
          classification: "ME"
        },
        {
          id: "step_22_22.5.2",
          sourceRef: "22.5.2",
          description: "Gere o VBD manualmente ou associe o NK ao VBD existente seguindo a codifica\u00e7\u00e3o (trip/non\u2011trip ou outra codifica\u00e7\u00e3o aplic\u00e1vel) indicada na fatura.",
          classification: "ME"
        },
        {
          id: "step_22_22.6",
          sourceRef: "22.6",
          description: "Comparar o valor cobrado na fatura com o valor do VBD associado/gerado e decidir o tratamento segundo a toler\u00e2ncia estabelecida. Procedimento para discrep\u00e2ncia fora da toler\u00e2ncia: Quando a diferen\u00e7a entre a fatura e o VBD estiver fora da toler\u00e2ncia estabelecida \u00b7 Pendente \u2014 procedimento de escalonamento n\u00e3o detalhado neste trecho",
          classification: "MA"
        },
        {
          id: "step_22_22.7",
          sourceRef: "22.7",
          description: "Quando a discrep\u00e2ncia for considerada dentro da toler\u00e2ncia, ajustar o valor da fatura para coincidir com o valor do VBD e registrar evid\u00eancia do ajuste.",
          classification: "MA"
        },
        {
          id: "step_22_22.7.1",
          sourceRef: "22.7.1",
          description: "Ajuste o valor da fatura para refletir o valor do VBD conforme permitido pela toler\u00e2ncia. Execute o ajuste utilizando o procedimento de ajuste vigente na interface de processamento de invoices que voc\u00ea usa para este tipo de fatura.",
          classification: "MA"
        },
        {
          id: "step_22_22.7.2",
          sourceRef: "22.7.2",
          description: "Tire screenshot(s) comprovando o valor original, o valor do VBD e o ajuste realizado; anexe estas evid\u00eancias ao registro/transa\u00e7\u00e3o da fatura. Requisito de evid\u00eancia do line-item e ajuste: A captura de tela deve mostrar claramente o n\u00famero da fatura, o line-item, o Nom Key identificado e os valores antes/depois de qualquer ajuste; essas imagens devem ser anexadas \u00e0 confirma\u00e7\u00e3o enviada ao analista.",
          classification: "MA"
        },
        {
          id: "step_22_22.7.3",
          sourceRef: "22.7.3",
          description: "Envie ao analista respons\u00e1vel as evid\u00eancias do ajuste e uma breve confirma\u00e7\u00e3o de que o ajuste foi aplicado conforme toler\u00e2ncia.",
          classification: "MA"
        },
        {
          id: "step_22_22.8",
          sourceRef: "22.8",
          description: "Ap\u00f3s gera\u00e7\u00e3o/associa\u00e7\u00e3o do VBD e eventuais ajustes dentro da toler\u00e2ncia, prosseguir com as etapas subsequentes do processamento da fatura segundo o fluxo operacional vigente (classifica\u00e7\u00e3o, codifica\u00e7\u00e3o cont\u00e1bil e posterior posting conforme rotina do time).",
          classification: "MA"
        },
      ]
    },
    {
      id: "step_23",
      sourceStep: "23",
      number: "23",
      title: "Processo completo de cria\u00e7\u00e3o e emiss\u00e3o de Credit Memo (VA01 \u2192 VF01 \u2192 VFO3) Executar todo o fluxo de rebill para cr\u00e9dito a partir das informa\u00e7\u00f5es receb",
      description: "Executar todo o fluxo de rebill para cr\u00e9dito a partir das informa\u00e7\u00f5es recebidas do scheduler, criando a ordem de cr\u00e9dito (VA01), gerando o documento de faturamento (VF01) e emitindo o output (VFO3). Cada subpasso cont\u00e9m as a\u00e7\u00f5es exatas a realizar em tela conforme os campos e popups indicados.",
      classification: "MS",
      classifications: ["MS"],
      macroBlockId: "execution",
      macroBlockName: "Execution",
      capabilityId: "cap-auto",
      capabilityName: "Capability Automática",
      solutionId: "sol-wf-routing",
      solutionIds: ["sol-wf-routing"],
      technologyType: "Workflow",
      rationale: "O rebill de cr\u00e9dito envolve transa\u00e7\u00f5es encadeadas VA01, VF01 e VFO3 e exige controle humano antes da emiss\u00e3o.",
      effort: {
        level: "high",
        score: 50,
        confidence: "medium",
        drivers: [],
        unknowns: []
      },
      humanInTheLoop: {
        hasHumanControl: true,
        level: "partial",
        description: "`review_required` \u2014 revis\u00e3o humana permanece necess\u00e1ria para dados, exce\u00e7\u00f5es, aprova\u00e7\u00f5es e/ou transa\u00e7\u00f5es financeiras."
      },
      substeps: [
        {
          id: "step_23_23.1",
          sourceRef: "23.1",
          description: "Localize no e-mail o arquivo Excel enviado pelo scheduler contendo os dados do rebill. Abra e confirme que o arquivo anexo cont\u00e9m as colunas necess\u00e1rias (ship-to party, billing date, pricing date, material, target quantity, plant, company code, valores/condi\u00e7\u00f5es). Salve o arquivo localmente para refer\u00eancia durante a cria\u00e7\u00e3o do credit memo. Toler\u00e2ncia excedida \u2014 contactar vendor: Condi\u00e7\u00e3o: Durante o processamento do rebill for identificada diferen\u00e7a acima da toler\u00e2ncia entre o invoice e os valores/autofired VBDs.. A\u00e7\u00f5es: Contactar o vendor/contraparte para solicitar carta de escalation conforme procedimento do scheduler.",
          classification: "MA"
        },
        {
          id: "step_23_23.2",
          sourceRef: "23.2",
          description: "Acesse o SAP e execute o t-code VA01. Na tela de cria\u00e7\u00e3o de sales order inicie a cria\u00e7\u00e3o do documento de cr\u00e9dito conforme o arquivo recebido.",
          classification: "ME"
        },
        {
          id: "step_23_23.3",
          sourceRef: "23.3",
          description: "No campo 'Order Type' insira CR (Credit Memo Creation) e pressione Enter para carregar os par\u00e2metros iniciais do cabe\u00e7alho da ordem.",
          classification: "ME"
        },
        {
          id: "step_23_23.4",
          sourceRef: "23.4",
          description: "Transfira os valores do Excel para os campos do VA01: preencher 'Ship to party' com a party indicada, preencher 'Billing date' com a data corrente (usar hoje), preencher 'Pricing date' com a data da atividade, inserir 'Material' conforme planilha, e 'Target Quantity' inserindo a quantidade alvo de uma vez. Ap\u00f3s preencher todos os campos do cabe\u00e7alho, pressione Enter.",
          classification: "ME"
        },
        {
          id: "step_23_23.5",
          sourceRef: "23.5",
          description: "Ao pressionar Enter um popup solicitar\u00e1 a Company Code. Substitua o exemplo 1010 pelo Company Code correto indicado pela planilha ou pelos procedimentos internos da sua \u00e1rea e confirme.",
          classification: "MS"
        },
        {
          id: "step_23_23.6",
          sourceRef: "23.6",
          description: "Se aparecer um popup de 'Billing period', confirme os valores mostrados conforme o per\u00edodo indicado na planilha. Caso o popup seja limpo automaticamente, reabra o campo correspondente e reinsira o per\u00edodo antes de prosseguir. Reinsira Billing Period se popup for limpo: Se o popup de Billing Period for limpo automaticamente, reabra o campo de Billing Period e reinsira o per\u00edodo antes de prosseguir.",
          classification: "MA"
        },
        {
          id: "step_23_23.7",
          sourceRef: "23.7",
          description: "Ap\u00f3s confirmar o Billing Period, verifique que os demais campos do cabe\u00e7alho permanecem corretos. Pressione Enter para seguir para as informa\u00e7\u00f5es de item.",
          classification: "ME"
        },
        {
          id: "step_23_23.8",
          sourceRef: "23.8",
          description: "No bloco de itens, selecione a linha de item referente ao rebill. No menu superior clique 'Go to' \u2192 'Item' \u2192 'Shipping' para abrir os detalhes de envio do item selecionado.",
          classification: "ME"
        },
        {
          id: "step_23_23.9",
          sourceRef: "23.9",
          description: "No campo 'Plant' insira o n\u00famero do plant recebido do scheduler no Excel e pressione Enter para carregar os dados de planta no item.",
          classification: "ME"
        },
        {
          id: "step_23_23.10",
          sourceRef: "23.10",
          description: "Navegue at\u00e9 a se\u00e7\u00e3o do Billing Document e no campo 'Payment Terms' insira N30 (Net 30) conforme instru\u00eddo. Confirme a altera\u00e7\u00e3o.",
          classification: "ME"
        },
        {
          id: "step_23_23.11",
          sourceRef: "23.11",
          description: "Abra as 'Conditions' do item e insira a condition type ZNON, informe o montante (Amount) conforme planilha e selecione a moeda USD. Salve temporariamente antes de sair da tela de condi\u00e7\u00f5es.",
          classification: "ME"
        },
        {
          id: "step_23_23.12",
          sourceRef: "23.12",
          description: "Aguarde a valida\u00e7\u00e3o do sistema; identifique o indicador visual de 'green light' que confirma a ativa\u00e7\u00e3o da conta. Confirme que o cr\u00e9dito de US$10 (conforme exemplo) foi atribu\u00eddo ao item/cabe\u00e7alho. Verifica\u00e7\u00e3o de ativa\u00e7\u00e3o de conta e cr\u00e9dito aplicado: Confirme visualmente o indicador 'green light' e verifique que o cr\u00e9dito (ex.: US$10 no exemplo) foi atribu\u00eddo corretamente no item/cabe\u00e7alho.",
          classification: "MS"
        },
        {
          id: "step_23_23.13",
          sourceRef: "23.13",
          description: "Clique em 'Account Assignment' para revisar o Profit Center atribu\u00eddo. Compare o Profit Center mostrado com o valor indicado no Excel.",
          classification: "MA"
        },
        {
          id: "step_23_23.13.1",
          sourceRef: "23.13.1",
          description: "Verifique se o Profit Center exibido na tela de Account Assignment corresponde exatamente ao valor registrado na planilha do scheduler.",
          classification: "MA"
        },
        {
          id: "step_23_23.14",
          sourceRef: "23.14",
          description: "Se o Profit Center estiver diferente do indicado, edite o campo no Account Assignment e substitua pelo Profit Center correto conforme o Excel. Salve a altera\u00e7\u00e3o. Ap\u00f3s salvar, retorne \u00e0 decis\u00e3o 'dec-227-13' para revalidar a correspond\u00eancia.",
          classification: "MA"
        },
        {
          id: "step_23_23.15",
          sourceRef: "23.15",
          description: "Clique 'Go to' para navegar at\u00e9 a p\u00e1gina de overview que apresenta o resumo dos detalhes do credit memo. Confirme que todas as informa\u00e7\u00f5es do overview refletem as altera\u00e7\u00f5es feitas previamente.",
          classification: "ME"
        },
        {
          id: "step_23_23.16",
          sourceRef: "23.16",
          description: "No overview do credit memo revise linhas, quantidades, pre\u00e7os e condi\u00e7\u00f5es. Verifique cabe\u00e7alho e itens para garantir conformidade com o Excel. Quando tudo estiver correto, clique 'Save'.",
          classification: "ME"
        },
        {
          id: "step_23_23.17",
          sourceRef: "23.17",
          description: "Ap\u00f3s salvar, aguarde a notifica\u00e7\u00e3o de cria\u00e7\u00e3o de Sales Order. Copie o n\u00famero da Sales Order gerada e registre-o no Excel de controle para uso no passo de faturamento (VF01).",
          classification: "MS"
        },
        {
          id: "step_23_23.18",
          sourceRef: "23.18",
          description: "No SAP execute o t-code VF01 para criar o documento de faturamento a partir da Sales Order gerada. Prepare-se para inserir o n\u00famero de entrega/ordem conforme dispon\u00edvel.",
          classification: "ME"
        },
        {
          id: "step_23_23.19",
          sourceRef: "23.19",
          description: "No campo apropriado cole o n\u00famero da Sales Order previamente copiado (ou o n\u00famero de entrega correspondente) e pressione Enter para que o sistema localize os itens a serem faturados.",
          classification: "MA"
        },
        {
          id: "step_23_23.20",
          sourceRef: "23.20",
          description: "Revise a vis\u00e3o geral de cria\u00e7\u00e3o do billing document apresentada pelo sistema. Se todos os dados estiverem corretos, clique 'Save' para gerar o documento de faturamento.",
          classification: "ME"
        },
        {
          id: "step_23_23.21",
          sourceRef: "23.21",
          description: "Ap\u00f3s salvar, anote o n\u00famero do Invoice gerado pelo sistema. Atualize o controle do rebill no Excel com o n\u00famero do invoice para acompanhamento.",
          classification: "ME"
        },
        {
          id: "step_23_23.22",
          sourceRef: "23.22",
          description: "Acesse o t-code VFO3 (Display Billing Document) no SAP para exibir o documento de faturamento rec\u00e9m-criado.",
          classification: "ME"
        },
        {
          id: "step_23_23.23",
          sourceRef: "23.23",
          description: "No campo 'Invoice Number' insira o n\u00famero do invoice que voc\u00ea registrou no passo anterior e pressione Enter para carregar o billing document na tela.",
          classification: "ME"
        },
        {
          id: "step_23_23.24",
          sourceRef: "23.24",
          description: "Com o billing document carregado, selecione o menu 'Billing document' e escolha a fun\u00e7\u00e3o 'Issue output To' para gerar o output do invoice (impress\u00e3o/envio conforme configura\u00e7\u00e3o do sistema). Confirme a execu\u00e7\u00e3o da emiss\u00e3o de output e capture evid\u00eancia (por exemplo, registro do status de output ou n\u00famero de spool).",
          classification: "ME"
        },
      ]
    },
    {
      id: "step_24",
      sourceStep: "24",
      number: "24",
      title: "Rebill \u2014 Processo de Debit Memo (ZEWB: cria\u00e7\u00e3o do VBD, gera\u00e7\u00e3o de output e envio ao Scheduler) Procedimento operacional para criar um Debit Memo em ZE",
      description: "Procedimento operacional para criar um Debit Memo em ZEWB (Custom Trading Expense Workbench), gerar o output (print preview/PDF) e devolver o arquivo ao Scheduler. Executar as etapas na ordem apresentada; usar a se\u00e7\u00e3o alternativa se o Scheduler n\u00e3o souber o n\u00famero do cliente.",
      classification: "MS",
      classifications: ["MS"],
      macroBlockId: "execution",
      macroBlockName: "Execution",
      capabilityId: "cap-auto",
      capabilityName: "Capability Automática",
      solutionId: "sol-wf-routing",
      solutionIds: ["sol-wf-routing"],
      technologyType: "Workflow",
      rationale: "O debit memo depende de VBD, gera\u00e7\u00e3o de output e comunica\u00e7\u00e3o ao Scheduler; workflow ajuda a controlar estados e aprova\u00e7\u00f5es.",
      effort: {
        level: "high",
        score: 50,
        confidence: "medium",
        drivers: [],
        unknowns: []
      },
      humanInTheLoop: {
        hasHumanControl: true,
        level: "partial",
        description: "`review_required` \u2014 revis\u00e3o humana permanece necess\u00e1ria para dados, exce\u00e7\u00f5es, aprova\u00e7\u00f5es e/ou transa\u00e7\u00f5es financeiras."
      },
      substeps: [
        {
          id: "step_24_24.1",
          sourceRef: "24.1",
          description: "Se for um rebill originado por fatura existente, preview do Billing Document para confirmar o tipo antes de iniciar ZEWB.",
          classification: "ME"
        },
        {
          id: "step_24_24.1.1",
          sourceRef: "24.1.1",
          description: "Abrir T-code VFO3 (Display Billing Document).",
          classification: "ME"
        },
        {
          id: "step_24_24.1.2",
          sourceRef: "24.1.2",
          description: "Enter o n\u00famero da invoice e, em seguida, selecionar 'Billing document' \u2192 'Issue output To'. Escolher 'ZRD1' e confirmar (Enter) para pr\u00e9-visualizar.",
          classification: "ME"
        },
        {
          id: "step_24_24.1.3",
          sourceRef: "24.1.3",
          description: "Identificar e salvar o Excel anexado ao e-mail de instru\u00e7\u00e3o que cont\u00e9m os valores e refer\u00eancias a serem lan\u00e7ados em ZEWB.",
          classification: "ME"
        },
        {
          id: "step_24_24.2",
          sourceRef: "24.2",
          description: "Entrar no t-code ZEWB para iniciar cria\u00e7\u00e3o manual do Debit Memo (non-trip).",
          classification: "ME"
        },
        {
          id: "step_24_24.2.1",
          sourceRef: "24.2.1",
          description: "Executar o T-code 'ZEWB' no SAP GUI/Fiori para abrir o Custom Trading Expense Workbench.",
          classification: "ME"
        },
        {
          id: "step_24_24.2.2",
          sourceRef: "24.2.2",
          description: "Selecionar a op\u00e7\u00e3o para entrada de informa\u00e7\u00e3o 'non-trip related' e abrir o formul\u00e1rio de cria\u00e7\u00e3o de despesa.",
          classification: "ME"
        },
        {
          id: "step_24_24.3",
          sourceRef: "24.3",
          description: "Localizar o contrato de trading relacionado e iniciar a a\u00e7\u00e3o 'Create Expense'.",
          classification: "ME"
        },
        {
          id: "step_24_24.3.1",
          sourceRef: "24.3.1",
          description: "No Trading Contract List clicar em 'Create Expense' para abrir a tela de nova despesa.",
          classification: "ME"
        },
        {
          id: "step_24_24.3.2",
          sourceRef: "24.3.2",
          description: "No campo 'Expenses class group' preencher 'Z3' e selecionar o receivable correspondente (Z3 receivables).",
          classification: "MA"
        },
        {
          id: "step_24_24.4",
          sourceRef: "24.4",
          description: "Definir a classe de despesa e o tipo cont\u00e1bil para o Debit Memo.",
          classification: "ME"
        },
        {
          id: "step_24_24.4.1",
          sourceRef: "24.4.1",
          description: "No campo de despesas selecionar a op\u00e7\u00e3o 'Y01' (Freight).",
          classification: "ME"
        },
        {
          id: "step_24_24.4.2",
          sourceRef: "24.4.2",
          description: "No column 'Accounting Type' selecionar 'C' \u2014 Receivable Account.",
          classification: "ME"
        },
        {
          id: "step_24_24.5",
          sourceRef: "24.5",
          description: "Preencher a category de postagem e a data de lan\u00e7amento conforme pol\u00edtica de rebill.",
          classification: "ME"
        },
        {
          id: "step_24_24.5.1",
          sourceRef: "24.5.1",
          description: "No campo 'Posting Category' selecionar o valor '2'.",
          classification: "ME"
        },
        {
          id: "step_24_24.5.2",
          sourceRef: "24.5.2",
          description: "No campo 'Posting Date' inserir a data corrente (current date).",
          classification: "ME"
        },
        {
          id: "step_24_24.6",
          sourceRef: "24.6",
          description: "Preencher a coluna Partner com o n\u00famero do cliente e informar o valor l\u00edquido a ser debitado.",
          classification: "ME"
        },
        {
          id: "step_24_24.6.1",
          sourceRef: "24.6.1",
          description: "No campo 'Partner' inserir o Customer Number. Exemplo documentado: '10098763'.",
          classification: "ME"
        },
        {
          id: "step_24_24.6.2",
          sourceRef: "24.6.2",
          description: "No campo 'Net Amount' inserir o valor l\u00edquido conforme o Excel recebido.",
          classification: "ME"
        },
        {
          id: "step_24_24.7",
          sourceRef: "24.7",
          description: "Preencher campo Reference (opcional) e salvar, gerando o Document Number do Debit Memo. Verifica\u00e7\u00e3o obrigat\u00f3ria antes de salvar: Confirmar que expense class group = Z3, expense type = Y01 (Freight), Accounting Type = C, Posting Category = 2, Posting Date preenchida, Partner informado e Net Amount corresponde ao Excel recebido. Documento n\u00e3o gerado ap\u00f3s salvar: Condi\u00e7\u00e3o: Ap\u00f3s salvar, nenhum Document Number \u00e9 exibido ou o n\u00famero n\u00e3o \u00e9 gerado.. A\u00e7\u00f5es: Reabrir a tela do Expense no ZEWB e confirmar todos os campos obrigat\u00f3rios est\u00e3o preenchidos.; Repetir a a\u00e7\u00e3o 'Save'.; Se o problema persistir, retornar para 's237_check_and_save' e reexecutar a revis\u00e3o dos campos.. Resultado: 24.7.2 \u00b7 Revisar todos os campos preenchidos (expense classgrp, accounting type, posting category, posting date, partner, net amount, reference) e clicar 'Save'.",
          classification: "MA"
        },
        {
          id: "step_24_24.7.1",
          sourceRef: "24.7.1",
          description: "No campo 'Reference' inserir a refer\u00eancia desejada; opcionalmente preencher a coluna 'Text' para aparecer na invoice rebill.",
          classification: "ME"
        },
        {
          id: "step_24_24.7.2",
          sourceRef: "24.7.2",
          description: "Revisar todos os campos preenchidos (expense classgrp, accounting type, posting category, posting date, partner, net amount, reference) e clicar 'Save'. Verifica\u00e7\u00e3o obrigat\u00f3ria antes de salvar: Confirmar que expense class group = Z3, expense type = Y01 (Freight), Accounting Type = C, Posting Category = 2, Posting Date preenchida, Partner informado e Net Amount corresponde ao Excel recebido.",
          classification: "MA"
        },
        {
          id: "step_24_24.7.3",
          sourceRef: "24.7.3",
          description: "Ap\u00f3s o salvamento, copiar o Document Number gerado (exemplo documentado: '6000008830') para refer\u00eancia e registros. Documento n\u00e3o gerado ap\u00f3s salvar: Condi\u00e7\u00e3o: Ap\u00f3s salvar, nenhum Document Number \u00e9 exibido ou o n\u00famero n\u00e3o \u00e9 gerado.. A\u00e7\u00f5es: Reabrir a tela do Expense no ZEWB e confirmar todos os campos obrigat\u00f3rios est\u00e3o preenchidos.; Repetir a a\u00e7\u00e3o 'Save'.; Se o problema persistir, retornar para 's237_check_and_save' e reexecutar a revis\u00e3o dos campos.. Resultado: 24.7.2 \u00b7 Revisar todos os campos preenchidos (expense classgrp, accounting type, posting category, posting date, partner, net amount, reference) e clicar 'Save'.",
          classification: "ME"
        },
        {
          id: "step_24_24.7.4",
          sourceRef: "24.7.4",
          description: "Abrir 'Expenses Doc List', filtrar a coluna 'Document' inserindo o n\u00famero da invoice (Document Number copiado) e pressionar Enter para localizar o documento.",
          classification: "ME"
        },
        {
          id: "step_24_24.8",
          sourceRef: "24.8",
          description: "Selecionar o Document Number encontrado para abrir a tela de item overview do Billing Document.",
          classification: "ME"
        },
        {
          id: "step_24_24.8.1",
          sourceRef: "24.8.1",
          description: "Clicar sobre o Document Number listado para abrir 'Billing Document Item Overview'.",
          classification: "ME"
        },
        {
          id: "step_24_24.8.2",
          sourceRef: "24.8.2",
          description: "Verificar as informa\u00e7\u00f5es do item no 'Document Item Overview' antes de produzir o output.",
          classification: "ME"
        },
        {
          id: "step_24_24.9",
          sourceRef: "24.9",
          description: "No 'Document Item Overview' usar menu Extras \u2192 Message para acessar op\u00e7\u00f5es de output e visualiza\u00e7\u00e3o da invoice.",
          classification: "ME"
        },
        {
          id: "step_24_24.9.1",
          sourceRef: "24.9.1",
          description: "Clicar 'Extras' \u2192 'Message'.",
          classification: "ME"
        },
        {
          id: "step_24_24.9.2",
          sourceRef: "24.9.2",
          description: "Na tela 'Output and Invoice details' selecionar 'Print Preview' para gerar a visualiza\u00e7\u00e3o do Debit Rebill Invoice.",
          classification: "ME"
        },
        {
          id: "step_24_24.10",
          sourceRef: "24.10",
          description: "Salvar a pr\u00e9-visualiza\u00e7\u00e3o como PDF/arquivo no computador e enviar o arquivo gerado de volta ao Scheduler conforme procedimento interno. Falha no envio ao Scheduler: N\u00e3o foi poss\u00edvel enviar o arquivo do Debit Rebill ao Scheduler (por exemplo, endere\u00e7o n\u00e3o dispon\u00edvel ou envio falhou). \u00b7 Scheduler",
          classification: "ME"
        },
        {
          id: "step_24_24.10.1",
          sourceRef: "24.10.1",
          description: "Na janela de Print Preview usar a op\u00e7\u00e3o 'Save' ou 'Export to PDF' para gravar o Debit Rebill Invoice no diret\u00f3rio local do operador. Verifica\u00e7\u00e3o obrigat\u00f3ria antes de salvar: Confirmar que expense class group = Z3, expense type = Y01 (Freight), Accounting Type = C, Posting Category = 2, Posting Date preenchida, Partner informado e Net Amount corresponde ao Excel recebido.",
          classification: "MA"
        },
        {
          id: "step_24_24.10.2",
          sourceRef: "24.10.2",
          description: "Enviar o arquivo salvo ao Scheduler conforme o canal combinado (ver Unknowns se o canal n\u00e3o estiver documentado). Registrar o envio. Falha no envio ao Scheduler: N\u00e3o foi poss\u00edvel enviar o arquivo do Debit Rebill ao Scheduler (por exemplo, endere\u00e7o n\u00e3o dispon\u00edvel ou envio falhou). \u00b7 Scheduler",
          classification: "ME"
        },
      ]
    },
    {
      id: "step_25",
      sourceStep: "25",
      number: "25",
      title: "Processo de Fatura Revisada \u2014 Corre\u00e7\u00e3o por cr\u00e9dito (original processado/impago) Sequ\u00eancia operacional para identificar lan\u00e7amento original, levantar d",
      description: "Sequ\u00eancia operacional para identificar lan\u00e7amento original, levantar dados cont\u00e1beis, gerar e carregar fatura de cr\u00e9dito ou d\u00e9bito revisada e reconciliar (inclui fluxo para original processado e n\u00e3o pago e direcionamento para alternativa quando original j\u00e1 foi pago).",
      classification: "MS",
      classifications: ["MS", "MA"],
      macroBlockId: "exception",
      macroBlockName: "Exception",
      capabilityId: "cap-auto",
      capabilityName: "Capability Automática",
      solutionId: "sol-eval-anomaly",
      solutionIds: ["sol-eval-anomaly"],
      technologyType: "Workflow",
      rationale: "A corre\u00e7\u00e3o por cr\u00e9dito trata uma diverg\u00eancia de fatura j\u00e1 processada e exige decis\u00e3o, rastreabilidade e nova submiss\u00e3o.",
      effort: {
        level: "high",
        score: 50,
        confidence: "medium",
        drivers: [],
        unknowns: []
      },
      humanInTheLoop: {
        hasHumanControl: true,
        level: "partial",
        description: "`decision_required` \u2014 revis\u00e3o humana permanece necess\u00e1ria para dados, exce\u00e7\u00f5es, aprova\u00e7\u00f5es e/ou transa\u00e7\u00f5es financeiras."
      },
      substeps: [
        {
          id: "step_25_25.1",
          sourceRef: "25.1",
          description: "Abrir a transa\u00e7\u00e3o FBL1N no SAP para pesquisar lan\u00e7amentos do fornecedor.",
          classification: "ME"
        },
        {
          id: "step_25_25.2",
          sourceRef: "25.2",
          description: "No ecr\u00e3 FBL1N, inserir a conta do fornecedor (Vendor account) e executar a pesquisa pressionando F8.",
          classification: "ME"
        },
        {
          id: "step_25_25.3",
          sourceRef: "25.3",
          description: "Verificar se o lan\u00e7amento original foi apenas processado (contabilizado) ou processado e pago.",
          classification: "MS"
        },
        {
          id: "step_25_25.4",
          sourceRef: "25.4",
          description: "Na lista de resultados do FBL1N localizar a linha correspondente ao lan\u00e7amento j\u00e1 processado e dar duplo clique sobre ela para abrir o detalhe do documento.",
          classification: "MA"
        },
        {
          id: "step_25_25.5",
          sourceRef: "25.5",
          description: "No ecr\u00e3 do documento, aceder \u00e0 aba Environment e selecionar Document Environment \u2192 Accounting Documents para visualizar os documentos cont\u00e1beis relacionados necess\u00e1rios para repostagem (GL, Profit Centre, company code, gross amount).",
          classification: "ME"
        },
        {
          id: "step_25_25.6",
          sourceRef: "25.6",
          description: "Dar duplo clique sobre o documento cont\u00e1bil listado para abrir o detalhe do accounting document e capturar GL account, Profit Centre, company code e gross amount que ser\u00e3o usados no lan\u00e7amento de corre\u00e7\u00e3o.",
          classification: "ME"
        },
        {
          id: "step_25_25.7",
          sourceRef: "25.7",
          description: "Verificar no detalhe do documento as contas GL e o Profit Centre exibidos para uso no lan\u00e7amento de d\u00e9bito/cr\u00e9dito revisado.",
          classification: "ME"
        },
        {
          id: "step_25_25.8",
          sourceRef: "25.8",
          description: "Fazer download do PDF da fatura duplicada (ou c\u00f3pia digital recebida) e preparar a vers\u00e3o que ser\u00e1 enviada para upload como cr\u00e9dito (ou d\u00e9bito) com os valores ajustados e os dados cont\u00e1beis identificados.",
          classification: "ME"
        },
        {
          id: "step_25_25.9",
          sourceRef: "25.9",
          description: "Abrir OAWD e selecionar a op\u00e7\u00e3o VIM Invoice uploads; carregar o arquivo PDF da fatura revisada na fila indicada (referida como SEC_REDPRD no procedimento). Regras de aprovador por faixa de valor: Aplicar regras de aprova\u00e7\u00e3o por faixa de valor conforme abaixo antes da postagem:",
          classification: "MS"
        },
        {
          id: "step_25_25.10",
          sourceRef: "25.10",
          description: "Aguardar a cria\u00e7\u00e3o do arquivo no VIM; ap\u00f3s processamento autom\u00e1tico, a fatura carregada aparecer\u00e1 na VIM Workplace.",
          classification: "ME"
        },
        {
          id: "step_25_25.11",
          sourceRef: "25.11",
          description: "No VIM Workplace abrir 'My Inbox' e localizar a fatura rec\u00e9m-carregada; abrir a fatura para executar o processamento.",
          classification: "ME"
        },
        {
          id: "step_25_25.12",
          sourceRef: "25.12",
          description: "Na execu\u00e7\u00e3o da fatura no VIM/SAP preencher os campos obrigat\u00f3rios com os dados do PDF: Vendor number, Company code, Transaction/Event, Reference number, Document Date, Gross Amount e demais campos b\u00e1sicos.",
          classification: "ME"
        },
        {
          id: "step_25_25.13",
          sourceRef: "25.13",
          description: "Aceder \u00e0 aba Accounting da fatura e ativar o bloqueio de pagamento (Manual payment block). Selecionar a op\u00e7\u00e3o de bloqueio manual (Manual pmt. block) e indicar o baseline date igual \u00e0 data corrente de contabiliza\u00e7\u00e3o/postagem. Bloqueio de pagamento manual e baseline date: Na aba Accounting selecionar 'Manual payment block' e informar o baseline date igual \u00e0 data corrente de contabiliza\u00e7\u00e3o/postagem.",
          classification: "ME"
        },
        {
          id: "step_25_25.14",
          sourceRef: "25.14",
          description: "Alterar o Document Type para 'Non-PO Manual' e inserir o e-mail do requester (requester mail id) no campo apropriado da fatura.",
          classification: "ME"
        },
        {
          id: "step_25_25.15",
          sourceRef: "25.15",
          description: "Na linha de itens da fatura preencher as contas GL e o Profit Centre previamente identificados (ver passos a6).",
          classification: "ME"
        },
        {
          id: "step_25_25.16",
          sourceRef: "25.16",
          description: "Executar a simula\u00e7\u00e3o das regras de imputa\u00e7\u00e3o (simulate rule). Caso a simula\u00e7\u00e3o apresente indicadores vermelhos deve-se analisar cada item com erro individualmente, inserir coment\u00e1rios relevantes e, se apropriado, usar a op\u00e7\u00e3o de bypass (bypass) para prosseguir. A\u00e7\u00e3o quando simula\u00e7\u00e3o apresentar indica\u00e7\u00e3o vermelha: Condi\u00e7\u00e3o: Simula\u00e7\u00e3o de regras retorna indicador vermelho. A\u00e7\u00f5es: Analisar cada linha com erro individualmente; Inserir coment\u00e1rio explicativo em cada item com erro; Ajustar manualmente GL/Profit Centre ou outros campos conforme necess\u00e1rio; Tentar nova simula\u00e7\u00e3o ap\u00f3s corre\u00e7\u00f5es. Resultado: 25.16 \u00b7 Executar a simula\u00e7\u00e3o das regras de imputa\u00e7\u00e3o (simulate rule). Caso a simula\u00e7\u00e3o apresente indicadores vermelhos deve-se analisar cada item com erro individualmente, inserir coment\u00e1rios relevantes e, se apropriado, usar a op\u00e7\u00e3o de bypass (bypass) para prosseguir.",
          classification: "MA"
        },
        {
          id: "step_25_25.17",
          sourceRef: "25.17",
          description: "Se a simula\u00e7\u00e3o estiver sem erros (indicadores verdes), selecionar 'Apply Rules' para aplicar os lan\u00e7amentos e enviar a fatura para a etapa de aprova\u00e7\u00e3o conforme as regras internas. Regras de aprovador por faixa de valor: Aplicar regras de aprova\u00e7\u00e3o por faixa de valor conforme abaixo antes da postagem:",
          classification: "MS"
        },
        {
          id: "step_25_25.18",
          sourceRef: "25.18",
          description: "Ap\u00f3s aprova\u00e7\u00e3o e postagem autom\u00e1tica em SAP, retornar ao FBL1N e localizar os lan\u00e7amentos de d\u00e9bito e cr\u00e9dito resultantes do processamento para verifica\u00e7\u00e3o.",
          classification: "MS"
        },
        {
          id: "step_25_25.19",
          sourceRef: "25.19",
          description: "Executar a transa\u00e7\u00e3o F-44. Preencher os campos obrigat\u00f3rios (Vendor account, Company code, Document numbers) selecionar os documentos a serem compensados (knock off) e executar a compensa\u00e7\u00e3o. Ap\u00f3s a compensa\u00e7\u00e3o, reprocessar a invoice revisada utilizando os GL account e Profit Centre obtidos anteriormente.",
          classification: "ME"
        },
      ]
    },
    {
      id: "step_26",
      sourceStep: "26",
      number: "26",
      title: "Processar fatura de comiss\u00e3o \u00fanica \u2014 identificar confirmation/deal, localizar VBD e preparar para postagem Procedimento passo a passo para localizar o",
      description: "Procedimento passo a passo para localizar o anexo da fatura no VIM Workplace, validar dados b\u00e1sicos, localizar/associar Accrual VBD via busca ou via deal (Livelink \u2192 Fiori \u2192 ZEWB), ajustar valores dentro da toler\u00e2ncia e verificar poss\u00edvel duplicidade antes de encaminhar para a etapa de postagem.",
      classification: "MS",
      classifications: ["MS", "MA"],
      macroBlockId: "execution",
      macroBlockName: "Execution",
      capabilityId: "cap-auto",
      capabilityName: "Capability Automática",
      solutionId: "sol-ia-matching",
      solutionIds: ["sol-ia-matching"],
      technologyType: "IA / Agente",
      rationale: "A identifica\u00e7\u00e3o de confirmation/deal e matching com VBDs pode ser assistida por IA, mas a decis\u00e3o de postagem permanece revis\u00e1vel.",
      effort: {
        level: "high",
        score: 50,
        confidence: "medium",
        drivers: [],
        unknowns: []
      },
      humanInTheLoop: {
        hasHumanControl: true,
        level: "partial",
        description: "`review_required` \u2014 revis\u00e3o humana permanece necess\u00e1ria para dados, exce\u00e7\u00f5es, aprova\u00e7\u00f5es e/ou transa\u00e7\u00f5es financeiras."
      },
      substeps: [
        {
          id: "step_26_26.1",
          sourceRef: "26.1",
          description: "No VIM Workplace abra a fatura selecionada: clique em 'Attachment list', localize o anexo identificado como 'VIM Incoming Invoice', d\u00ea duplo clique para abrir a pr\u00e9\u2011visualiza\u00e7\u00e3o e, quando pronto para processar, execute (F8).",
          classification: "ME"
        },
        {
          id: "step_26_26.2",
          sourceRef: "26.2",
          description: "No painel da fatura selecione a aba 'Basic data' e confirme que os seguintes campos batem com o documento f\u00edsico/preview: Invoice Number, Gross Amount, Invoice Date, Vendor Number e Banking Information. Corrija apenas se houver erro de leitura do anexo e documente a diverg\u00eancia.",
          classification: "ME"
        },
        {
          id: "step_26_26.3",
          sourceRef: "26.3",
          description: "Abra a aba 'Other Data' e inicie a busca por Accruals VBD: clique em 'Search Accruals VBD'. Antes de executar a busca, confirme que o campo 'Bill of Lading' est\u00e1 vazio (sem valores selecionados) e que a op\u00e7\u00e3o 'Include All VBDs' esteja desmarcada. Bill of Lading em branco e 'Include All VBDs' desmarcado: Antes de executar a busca por Accrual VBD, o campo 'Bill of Lading' deve estar sem valores selecionados e a op\u00e7\u00e3o 'Include All VBDs' deve estar desmarcada para retornar os VBDs corretos.",
          classification: "ME"
        },
        {
          id: "step_26_26.4",
          sourceRef: "26.4",
          description: "Com os filtros definidos (Bill of Lading em branco e 'Include All VBDs' desmarcado) clique em Execute (F8) para listar Accruals Open VBDs.",
          classification: "ME"
        },
        {
          id: "step_26_26.5",
          sourceRef: "26.5",
          description: "Na lista retornada selecione 'Choose Layout' para ajustar a visualiza\u00e7\u00e3o conforme necess\u00e1rio e confirme com o tick (marca) para exibir as colunas relevantes (incluindo Broker reference). Observe a coluna Broker reference para localizar o n\u00famero de confirmation que pode constar na fatura.",
          classification: "ME"
        },
        {
          id: "step_26_26.6",
          sourceRef: "26.6",
          description: "Verificar se o n\u00famero de confirmation presente na fatura aparece na coluna 'Broker reference' dos VBD listados.",
          classification: "MS"
        },
        {
          id: "step_26_26.7",
          sourceRef: "26.7",
          description: "Abra Livelink e selecione 'Broker confirmations'. Insira o n\u00famero de Confirmation extra\u00eddo da fatura no campo de busca e execute a pesquisa. Na lista de resultados localize o item correspondente e d\u00ea duplo clique para abrir os detalhes.",
          classification: "MA"
        },
        {
          id: "step_26_26.8",
          sourceRef: "26.8",
          description: "Ap\u00f3s pesquisar o confirmation no Livelink, verificar se existe um item que contenha o deal number necess\u00e1rio.",
          classification: "MS"
        },
        {
          id: "step_26_26.9",
          sourceRef: "26.9",
          description: "Abra o anexo ou o registro encontrado no Livelink e copie o deal number exibido. Preserve exatamente o texto do deal number (sem espa\u00e7os adicionais).",
          classification: "ME"
        },
        {
          id: "step_26_26.10",
          sourceRef: "26.10",
          description: "Abra SAP Fiori e preencha os crit\u00e9rios principais: Trader, Trader Date e Counterparty. Clique 'Go' para listar deals. Confirme que os detalhes do deal (counterparty, volume, shipment date, trader) correspondem \u00e0 confirmation na fatura antes de selecionar a linha.",
          classification: "MA"
        },
        {
          id: "step_26_26.11",
          sourceRef: "26.11",
          description: "Abra o T\u2011Code ZEWB (Custom Trading Workbench). Cole o deal number copiado no campo de busca apropriado e execute (F8). Na sa\u00edda localize o Accrual VBD document associado e copie o n\u00famero do documento retornado.",
          classification: "ME"
        },
        {
          id: "step_26_26.12",
          sourceRef: "26.12",
          description: "Retorne ao VIM Workplace \u2192 Other Data \u2192 Search Accruals VBD. Cole o n\u00famero do documento (Accrual VBD) obtido em ZEWB no campo de busca e execute (F8). Ao localizar o Accrual VBD selecionado, clique em 'Overwrite VBD' para associ\u00e1\u2011lo \u00e0 fatura.",
          classification: "ME"
        },
        {
          id: "step_26_26.13",
          sourceRef: "26.13",
          description: "Abra a aba 'Line item' e compare a Gross Amount da invoice com a Gross Amount do VBD associado. Calcule a diferen\u00e7a (Invoice amount menos VBD amount).",
          classification: "MA"
        },
        {
          id: "step_26_26.14",
          sourceRef: "26.14",
          description: "Aplicar a regra de toler\u00e2ncia registrada para commission invoices. Toler\u00e2ncia de comiss\u00e3o: Limite de toler\u00e2ncia para diferen\u00e7a entre Invoice Gross Amount e VBD Gross Amount \u00e9 de 2000 USD.",
          classification: "MA"
        },
        {
          id: "step_26_26.15",
          sourceRef: "26.15",
          description: "Atualize o valor do VBD para igualar o Invoice Gross Amount quando a diferen\u00e7a estiver dentro da toler\u00e2ncia. Ap\u00f3s ajustar o valor, clique em 'Recalculate vendor Price' e depois em 'Save' para persistir o ajuste.",
          classification: "MA"
        },
        {
          id: "step_26_26.16",
          sourceRef: "26.16",
          description: "Clique em 'Simulate Rules' para aplicar regras do sistema. Caso seja apresentado o erro 'Suspected Duplicate', trate conforme o procedimento de verifica\u00e7\u00e3o de duplicidade. Tratamento para 'Suspected Duplicate Error' ap\u00f3s simula\u00e7\u00e3o de regras: Condi\u00e7\u00e3o: Ao executar 'Simulate Rules' \u00e9 exibida a mensagem 'Suspected Duplicate Error'.. A\u00e7\u00f5es: Executar verifica\u00e7\u00e3o de duplicidade em VIM Analytics (etapa step-264).; Se VIM Analytics indicar m\u00faltiplas linhas, marcar a fatura como suspeita de duplicidade e seguir o fluxo de revis\u00e3o definido pela \u00e1rea (end_state gerado no dec-duplicate-check).",
          classification: "ME"
        },
        {
          id: "step_26_26.17",
          sourceRef: "26.17",
          description: "Abra VIM Analytics, insira o Reference Number da fatura e execute (F8). Analise o resultado: se retornar apenas uma linha, a fatura n\u00e3o \u00e9 considerada duplicada; se retornar m\u00faltiplas linhas, trat\u00e1\u2011se\u2011\u00e1 como suspeita de duplicidade.",
          classification: "MA"
        },
        {
          id: "step_26_26.18",
          sourceRef: "26.18",
          description: "Decidir o estado da fatura com base no n\u00famero de entradas retornadas pelo VIM Analytics.",
          classification: "MS"
        },
      ]
    },
    {
      id: "step_27",
      sourceStep: "27",
      number: "27",
      title: "Processo de Comiss\u00e3o \u2014 identificar e reconciliar VBDs para Multi Commission e Crude Commission Procedimento operacional para identificar, selecionar e",
      description: "Procedimento operacional para identificar, selecionar e reconciliar VBDs (Accrual VBD) relacionados a faturas de comiss\u00e3o multi e crude dentro do VIM Workplace e acionar pr\u00f3ximos passos (postagem ou investiga\u00e7\u00e3o manual).",
      classification: "MA",
      classifications: ["MA"],
      macroBlockId: "execution",
      macroBlockName: "Execution",
      capabilityId: "cap-auto",
      capabilityName: "Capability Automática",
      solutionId: "sol-ia-matching",
      solutionIds: ["sol-ia-matching"],
      technologyType: "IA / Agente",
      rationale: "A reconcilia\u00e7\u00e3o de m\u00faltiplas comiss\u00f5es exige compara\u00e7\u00e3o de refer\u00eancias, datas, quantidades e valores; o agente deve apenas apoiar a an\u00e1lise.",
      effort: {
        level: "high",
        score: 50,
        confidence: "medium",
        drivers: [],
        unknowns: []
      },
      humanInTheLoop: {
        hasHumanControl: true,
        level: "partial",
        description: "`review_required` \u2014 revis\u00e3o humana permanece necess\u00e1ria para dados, exce\u00e7\u00f5es, aprova\u00e7\u00f5es e/ou transa\u00e7\u00f5es financeiras."
      },
      substeps: [
        {
          id: "step_27_27.1",
          sourceRef: "27.1",
          description: "No VIM Workplace, marque a fatura como n\u00e3o duplicada e salve para postar. Marcar fatura como 'Non Duplicate' e salvar: No campo de coment\u00e1rios do VIM inserir exatamente 'Non Duplicate' e pressionar o bot\u00e3o Save para que a fatura seja postada.",
          classification: "ME"
        },
        {
          id: "step_27_27.2",
          sourceRef: "27.2",
          description: "A partir do menu pop-up do documento no VIM, selecione a lista de anexos e abra o PDF da fatura para exame. Abrir anexo PDF para verificar conte\u00fado da fatura: Abrir a op\u00e7\u00e3o 'VIM Incoming Invoice Email PDF attachment' na 'Attachment list' para visualizar o PDF inteiro antes de proceder \u00e0 reconcilia\u00e7\u00e3o.",
          classification: "MA"
        },
        {
          id: "step_27_27.2.1",
          sourceRef: "27.2.1",
          description: "No menu pop-up, clique em 'Attachment list'. Em seguida clique na primeira op\u00e7\u00e3o 'VIM Incoming Invoice Email PDF attachment' e abra o PDF para visualizar o documento completo.",
          classification: "ME"
        },
        {
          id: "step_27_27.3",
          sourceRef: "27.3",
          description: "Com o PDF aberto, verifique os line items exibidos. Retorne ao fluxo do VIM e selecione a guia 'Other Data' para iniciar busca de Accrual VBDs.",
          classification: "ME"
        },
        {
          id: "step_27_27.4",
          sourceRef: "27.4",
          description: "No painel 'Other Data', execute a pesquisa de 'Search Accrual VBD selection' e ent\u00e3o execute (F8). Antes de executar, confirme que a(s) caixa(s) relevante(s) estejam desmarcadas conforme instru\u00e7\u00e3o. Confirmar caixa desmarcada antes de Executar (F8): Antes de executar a pesquisa de Accrual VBD (F8), confirme que a caixa espec\u00edfica indicada pelo procedimento esteja desmarcada para evitar filtragem indesejada. Caixa a ser desmarcada antes de Executar (F8) \u2014 campo n\u00e3o identificado no documento: Condi\u00e7\u00e3o: Texto instrui 'Ensure that the is unchecked' sem indicar qual caixa/controle.. A\u00e7\u00f5es: Verificar na tela 'Search Accrual VBD selection' qual checkbox est\u00e1 marcado por padr\u00e3o e que pode filtrar resultados; se incerto, confirmar com um colega com acesso \u00e0 mesma tela antes de executar.. Resultado: 27.4 \u00b7 No painel 'Other Data', execute a pesquisa de 'Search Accrual VBD selection' e ent\u00e3o execute (F8). Antes de executar, confirme que a(s) caixa(s) relevante(s) estejam desmarcadas conforme instru\u00e7\u00e3o.",
          classification: "ME"
        },
        {
          id: "step_27_27.4.1",
          sourceRef: "27.4.1",
          description: "Clique em 'Search Accrual VBD selection'. Verifique os filtros aplicados e, quando pronto, pressione Executar (F8).",
          classification: "ME"
        },
        {
          id: "step_27_27.4.2",
          sourceRef: "27.4.2",
          description: "Confirme que a caixa indicada na interface (ver callout de unknown se incerto) esteja desmarcada antes de pressionar Executar (F8). Depois, pressione F8 para obter os VBDs. Caixa a ser desmarcada antes de Executar (F8) \u2014 campo n\u00e3o identificado no documento: Condi\u00e7\u00e3o: Texto instrui 'Ensure that the is unchecked' sem indicar qual caixa/controle.. A\u00e7\u00f5es: Verificar na tela 'Search Accrual VBD selection' qual checkbox est\u00e1 marcado por padr\u00e3o e que pode filtrar resultados; se incerto, confirmar com um colega com acesso \u00e0 mesma tela antes de executar.. Resultado: 27.4 \u00b7 No painel 'Other Data', execute a pesquisa de 'Search Accrual VBD selection' e ent\u00e3o execute (F8). Antes de executar, confirme que a(s) caixa(s) relevante(s) estejam desmarcadas conforme instru\u00e7\u00e3o.",
          classification: "ME"
        },
        {
          id: "step_27_27.5",
          sourceRef: "27.5",
          description: "Na lista de resultados (DP / lista de VBDs), abra o menu 'Choose Layout' e selecione o layout 'Commission' para exibir colunas relevantes. Selecionar layout 'Commission' na escolha de layout: Abrir 'Choose Layout' e selecionar 'Commission' para que colunas relevantes apare\u00e7am na lista de VBDs.",
          classification: "ME"
        },
        {
          id: "step_27_27.6",
          sourceRef: "27.6",
          description: "Use a op\u00e7\u00e3o de ordena\u00e7\u00e3o 'Sort by' para organizar por 'broker reference'. Retorne ao PDF da fatura e identifique os confirmation numbers (6 ou 7 d\u00edgitos num\u00e9ricos) para procurar correspond\u00eancia na lista de VBDs. Identifica\u00e7\u00e3o de confirmation number: Considerar confirmation numbers como sequ\u00eancias num\u00e9ricas de 6 ou 7 d\u00edgitos ao buscar correspond\u00eancia entre PDF e campo 'broker reference'.",
          classification: "MA"
        },
        {
          id: "step_27_27.6.1",
          sourceRef: "27.6.1",
          description: "Verificar se na lista de VBDs existem linhas cujo 'broker reference' corresponde exatamente ao confirmation number identificado no PDF.",
          classification: "MA"
        },
        {
          id: "step_27_27.7",
          sourceRef: "27.7",
          description: "Selecione na lista os Accrual VBDs cujo 'broker reference' corresponde ao confirmation number do PDF. Depois destaque (marque) o confirmation number no PDF da fatura para refer\u00eancia. A\u00e7\u00e3o a ser clicada para n\u00e3o sobrescrever sele\u00e7\u00f5es de VBD \u2014 instru\u00e7\u00e3o incompleta no documento: Condi\u00e7\u00e3o: Documento diz 'remember to click on so as to not override any previous VBD selections' sem informar qual bot\u00e3o/caixa clicar.. A\u00e7\u00f5es: Ao selecionar VBDs adicionais, observar se existe op\u00e7\u00e3o de 'add to selection' ou checkbox de m\u00faltipla sele\u00e7\u00e3o na interface; se n\u00e3o evidente, n\u00e3o confirmar altera\u00e7\u00f5es e consultar colega ou documenta\u00e7\u00e3o t\u00e9cnica antes de salvar.. Resultado: 27.7 \u00b7 Selecione na lista os Accrual VBDs cujo 'broker reference' corresponde ao confirmation number do PDF. Depois destaque (marque) o confirmation number no PDF da fatura para refer\u00eancia. Destacar confirmation number no PDF: Ap\u00f3s selecionar os VBDs correspondentes, destaque o confirmation number no PDF para manter rastreabilidade entre fatura e VBDs.",
          classification: "MA"
        },
        {
          id: "step_27_27.7.1",
          sourceRef: "27.7.1",
          description: "Clique nas linhas de VBD que correspondem ao confirmation number. Se selecionar VBDs adicionais, siga a orienta\u00e7\u00e3o do callout relacionado para n\u00e3o sobrescrever sele\u00e7\u00f5es anteriores. A\u00e7\u00e3o a ser clicada para n\u00e3o sobrescrever sele\u00e7\u00f5es de VBD \u2014 instru\u00e7\u00e3o incompleta no documento: Condi\u00e7\u00e3o: Documento diz 'remember to click on so as to not override any previous VBD selections' sem informar qual bot\u00e3o/caixa clicar.. A\u00e7\u00f5es: Ao selecionar VBDs adicionais, observar se existe op\u00e7\u00e3o de 'add to selection' ou checkbox de m\u00faltipla sele\u00e7\u00e3o na interface; se n\u00e3o evidente, n\u00e3o confirmar altera\u00e7\u00f5es e consultar colega ou documenta\u00e7\u00e3o t\u00e9cnica antes de salvar.. Resultado: 27.7 \u00b7 Selecione na lista os Accrual VBDs cujo 'broker reference' corresponde ao confirmation number do PDF. Depois destaque (marque) o confirmation number no PDF da fatura para refer\u00eancia.",
          classification: "MA"
        },
        {
          id: "step_27_27.7.2",
          sourceRef: "27.7.2",
          description: "No visualizador do PDF, selecione/highlight o confirmation number que corresponde \u00e0s linhas VBD selecionadas para manter rastreabilidade visual. Destacar confirmation number no PDF: Ap\u00f3s selecionar os VBDs correspondentes, destaque o confirmation number no PDF para manter rastreabilidade entre fatura e VBDs.",
          classification: "MA"
        },
        {
          id: "step_27_27.8",
          sourceRef: "27.8",
          description: "Quando n\u00e3o houver correspond\u00eancia direta entre 'broker reference' e confirmation number, proceda \u00e0 an\u00e1lise linha a linha do PDF e dos registros VBD para identificar a transa\u00e7\u00e3o correta ou anomalias. Revis\u00e3o manual linha a linha quando n\u00e3o houver correspond\u00eancia autom\u00e1tica: Condi\u00e7\u00e3o: Falha em localizar correspond\u00eancia autom\u00e1tica entre confirmation number e broker reference. A\u00e7\u00f5es: Comparar datas de acordo, quantidades, valores e counterparty entre PDF e VBDs.; Registrar tentativa de correspond\u00eancia e evid\u00eancias.; Se necess\u00e1rio, classificar o caso como 'Investigar - Reconciliation not found' e guardar documenta\u00e7\u00e3o.. Resultado: Caso pendente para investiga\u00e7\u00e3o",
          classification: "MA"
        },
        {
          id: "step_27_27.8.1",
          sourceRef: "27.8.1",
          description: "Comparar datas de acordo/ trade date, quantidades, counterparty e valores por linha. Documente cada tentativa de correspond\u00eancia e registre VBDs candidatos. Revis\u00e3o manual linha a linha quando n\u00e3o houver correspond\u00eancia autom\u00e1tica: Condi\u00e7\u00e3o: Falha em localizar correspond\u00eancia autom\u00e1tica entre confirmation number e broker reference. A\u00e7\u00f5es: Comparar datas de acordo, quantidades, valores e counterparty entre PDF e VBDs.; Registrar tentativa de correspond\u00eancia e evid\u00eancias.; Se necess\u00e1rio, classificar o caso como 'Investigar - Reconciliation not found' e guardar documenta\u00e7\u00e3o.. Resultado: Caso pendente para investiga\u00e7\u00e3o",
          classification: "MA"
        },
        {
          id: "step_27_27.8.2",
          sourceRef: "27.8.2",
          description: "Se ap\u00f3s an\u00e1lise linha a linha n\u00e3o for poss\u00edvel identificar VBD correspondente, registre o caso para investiga\u00e7\u00e3o adicional (estado: 'Investigar - Reconciliation not found') e mantenha evid\u00eancias coletadas. Revis\u00e3o manual linha a linha quando n\u00e3o houver correspond\u00eancia autom\u00e1tica: Condi\u00e7\u00e3o: Falha em localizar correspond\u00eancia autom\u00e1tica entre confirmation number e broker reference. A\u00e7\u00f5es: Comparar datas de acordo, quantidades, valores e counterparty entre PDF e VBDs.; Registrar tentativa de correspond\u00eancia e evid\u00eancias.; Se necess\u00e1rio, classificar o caso como 'Investigar - Reconciliation not found' e guardar documenta\u00e7\u00e3o.. Resultado: Caso pendente para investiga\u00e7\u00e3o",
          classification: "MA"
        },
        {
          id: "step_27_27.9",
          sourceRef: "27.9",
          description: "No VIM Workplace, abra a fatura do tipo 'Crude' em arquivo separado, abra a lista de anexos e visualize o PDF para analisar componentes como trade date / agreement date e identifica\u00e7\u00e3o do counterparty.",
          classification: "MA"
        },
        {
          id: "step_27_27.9.1",
          sourceRef: "27.9.1",
          description: "Escolha a fatura Crude na lista do VIM e abra-a em um arquivo/visualizador separado clicando no \u00edcone destacado.",
          classification: "ME"
        },
        {
          id: "step_27_27.9.2",
          sourceRef: "27.9.2",
          description: "Do pop-up, selecione 'Attachment list' e clique em 'VIM Incoming Invoice- Email PDF attachment' para inspecionar o documento. Observe que, para faturas Crude, o 'agreement date' corresponde ao trade date / deal date.",
          classification: "MA"
        },
        {
          id: "step_27_27.9.3",
          sourceRef: "27.9.3",
          description: "Se o counterparty n\u00e3o estiver explicitado no PDF, contacte o broker para esclarecimento antes de proceder com sele\u00e7\u00e3o de VBDs (registre comunica\u00e7\u00e3o).",
          classification: "MS"
        },
        {
          id: "step_27_27.10",
          sourceRef: "27.10",
          description: "No VIM, v\u00e1 para a guia 'Other Data', acione 'Search Accrual VBD selection', deixe o campo 'Bill of Lading' completamente em branco (remova entradas) e execute (F8). Manter campo 'Bill of Lading' em branco para Crude: Remova qualquer valor do campo 'Bill of Lading' e certifique-se de que ele esteja completamente em branco antes de executar a pesquisa de Accrual VBDs para faturas Crude.",
          classification: "ME"
        },
        {
          id: "step_27_27.10.1",
          sourceRef: "27.10.1",
          description: "Apague qualquer valor presente no campo 'Bill of Lading' para garantir que ele permane\u00e7a em branco antes de executar a busca. Manter campo 'Bill of Lading' em branco para Crude: Remova qualquer valor do campo 'Bill of Lading' e certifique-se de que ele esteja completamente em branco antes de executar a pesquisa de Accrual VBDs para faturas Crude.",
          classification: "ME"
        },
        {
          id: "step_27_27.10.2",
          sourceRef: "27.10.2",
          description: "Com o campo 'Bill of Lading' em branco, pressione Executar (F8) para carregar os Accrual VBDs dispon\u00edveis para a fatura Crude.",
          classification: "ME"
        },
        {
          id: "step_27_27.11",
          sourceRef: "27.11",
          description: "Abra a lista resultante de VBDs, utilize 'Choose Layout' para selecionar 'Commission', reveja os registros de Accrual VBD (DP document page) e avalie se os 'broker reference' e as datas/anota\u00e7\u00f5es indicam necessidade de a\u00e7\u00e3o manual. Selecionar layout 'Commission' (Crude): Na lista de VBDs retornada para faturas Crude, aplicar o layout 'Commission' para visualizar corretamente os campos de Accrual VBD. Tratamento quando houver 'outdated lift dates' ou VBDs manuais: Condi\u00e7\u00e3o: Identifica\u00e7\u00e3o de lift dates desatualizados ou aus\u00eancia de broker reference correspondente (ex.: aus\u00eancia de PX11).. A\u00e7\u00f5es: Marcar cada item que apresente lift date desatualizado.; Efetuar an\u00e1lise linha a linha para determinar se o VBD foi manualmente criado e se requer revers\u00e3o.; Documentar evid\u00eancias (screenshots, notas do PDF) para acompanhamento.. Resultado: Requer revis\u00e3o manual/poss\u00edvel revers\u00e3o de VBD \u2014 preparar documenta\u00e7\u00e3o para a\u00e7\u00e3o corretiva",
          classification: "MA"
        },
        {
          id: "step_27_27.11.1",
          sourceRef: "27.11.1",
          description: "No menu 'Choose Layout', selecione 'Commission'. A p\u00e1gina DP com os registros de Accrual VBDs ser\u00e1 exibida para revis\u00e3o. Selecionar layout 'Commission' (Crude): Na lista de VBDs retornada para faturas Crude, aplicar o layout 'Commission' para visualizar corretamente os campos de Accrual VBD.",
          classification: "ME"
        },
        {
          id: "step_27_27.11.2",
          sourceRef: "27.11.2",
          description: "Revise se o n\u00famero apresentado como 'invoice number' na fatura \u00e9, na verdade, o confirmation number. Verifique se h\u00e1 broker reference iniciando com 'PX11' \u2014 aus\u00eancia indica que n\u00e3o houve triggers. Observe datas de lift desatualizadas que podem indicar VBDs manuais ou tickets atualizados ap\u00f3s pagamento. Tratamento quando houver 'outdated lift dates' ou VBDs manuais: Condi\u00e7\u00e3o: Identifica\u00e7\u00e3o de lift dates desatualizados ou aus\u00eancia de broker reference correspondente (ex.: aus\u00eancia de PX11).. A\u00e7\u00f5es: Marcar cada item que apresente lift date desatualizado.; Efetuar an\u00e1lise linha a linha para determinar se o VBD foi manualmente criado e se requer revers\u00e3o.; Documentar evid\u00eancias (screenshots, notas do PDF) para acompanhamento.. Resultado: Requer revis\u00e3o manual/poss\u00edvel revers\u00e3o de VBD \u2014 preparar documenta\u00e7\u00e3o para a\u00e7\u00e3o corretiva",
          classification: "MA"
        },
        {
          id: "step_27_27.11.3",
          sourceRef: "27.11.3",
          description: "Se VBDs aparentam ser manuais ou com lift dates posteriores ao pagamento, prepare an\u00e1lise linha a linha; se forem correspondentes, selecione conforme passo de sele\u00e7\u00e3o de VBD (retornar ao step-32). Tratamento quando houver 'outdated lift dates' ou VBDs manuais: Condi\u00e7\u00e3o: Identifica\u00e7\u00e3o de lift dates desatualizados ou aus\u00eancia de broker reference correspondente (ex.: aus\u00eancia de PX11).. A\u00e7\u00f5es: Marcar cada item que apresente lift date desatualizado.; Efetuar an\u00e1lise linha a linha para determinar se o VBD foi manualmente criado e se requer revers\u00e3o.; Documentar evid\u00eancias (screenshots, notas do PDF) para acompanhamento.. Resultado: Requer revis\u00e3o manual/poss\u00edvel revers\u00e3o de VBD \u2014 preparar documenta\u00e7\u00e3o para a\u00e7\u00e3o corretiva",
          classification: "MA"
        },
      ]
    },
    {
      id: "step_28",
      sourceStep: "28",
      number: "28",
      title: "Processamento mensal de invoices ICE US Commodity Market \u2014 extra\u00e7\u00e3o, cruzamento com VBDs e postagem Procedimento execut\u00e1vel para extrair invoices do p",
      description: "Procedimento execut\u00e1vel para extrair invoices do portal ICE no dia 8 de cada m\u00eas, mapear com VBDs no SAP (VIM/VBD/ZEWB/ZEWB) e processar at\u00e9 a postagem da fatura quando aplic\u00e1vel. Cada subpasso cont\u00e9m intera\u00e7\u00f5es detalhadas necess\u00e1rias para executar a tarefa conforme as telas e transa\u00e7\u00f5es indicadas na fonte.",
      classification: "MS",
      classifications: ["MS", "MA"],
      macroBlockId: "execution",
      macroBlockName: "Execution",
      capabilityId: "cap-auto",
      capabilityName: "Capability Automática",
      solutionId: "sol-analytics-recon",
      solutionIds: ["sol-analytics-recon"],
      technologyType: "Analytics / Monitoramento",
      rationale: "O processamento mensal cruza ICE, SAP, LiveLink e planilhas; analytics pode automatizar matching e destacar casos NO ou fora da toler\u00e2ncia.",
      effort: {
        level: "high",
        score: 50,
        confidence: "medium",
        drivers: [],
        unknowns: []
      },
      humanInTheLoop: {
        hasHumanControl: true,
        level: "partial",
        description: "`review_required` \u2014 revis\u00e3o humana permanece necess\u00e1ria para dados, exce\u00e7\u00f5es, aprova\u00e7\u00f5es e/ou transa\u00e7\u00f5es financeiras."
      },
      substeps: [
        {
          id: "step_28_28.1",
          sourceRef: "28.1",
          description: "Autenticar no portal ICE para obter os detalhes de deals e invoices do m\u00eas.",
          classification: "ME"
        },
        {
          id: "step_28_28.1.1",
          sourceRef: "28.1.1",
          description: "Abrir o URL do portal ICE (URL pendente) e inserir as credenciais v\u00e1lidas fornecidas; confirmar login bem-sucedido.",
          classification: "ME"
        },
        {
          id: "step_28_28.2",
          sourceRef: "28.2",
          description: "No dashboard principal do portal ICE selecionar a op\u00e7\u00e3o 'Invoices' para acessar o m\u00f3dulo de faturas.",
          classification: "ME"
        },
        {
          id: "step_28_28.2.1",
          sourceRef: "28.2.1",
          description: "Clicar na op\u00e7\u00e3o 'Invoices' no menu principal do portal para abrir a lista de invoices.",
          classification: "ME"
        },
        {
          id: "step_28_28.3",
          sourceRef: "28.3",
          description: "Configurar a visualiza\u00e7\u00e3o para o m\u00eas inteiro que deseja processar e executar 'Show summary'.",
          classification: "ME"
        },
        {
          id: "step_28_28.3.1",
          sourceRef: "28.3.1",
          description: "Na p\u00e1gina de Invoices selecionar a op\u00e7\u00e3o 'View an entire Month', escolher o m\u00eas alvo e clicar em 'Show summary'.",
          classification: "ME"
        },
        {
          id: "step_28_28.4",
          sourceRef: "28.4",
          description: "Do resumo exibido, localizar a invoice desejada e clicar em 'View invoice' para ver os detalhes do deal que ser\u00e3o exportados.",
          classification: "ME"
        },
        {
          id: "step_28_28.5",
          sourceRef: "28.5",
          description: "No filtro 'Commodity Type' escolher o componente a ser extra\u00eddo (Physical NGL ou Physical Oil). Para este procedimento focar em Physical NGL conforme o exemplo.",
          classification: "ME"
        },
        {
          id: "step_28_28.6",
          sourceRef: "28.6",
          description: "Exportar os registros exibidos na tela do ICE para um arquivo Excel para posterior cruzamento com VBDs.",
          classification: "ME"
        },
        {
          id: "step_28_28.6.1",
          sourceRef: "28.6.1",
          description: "Clicar em 'Export to Excel' (ou equivalente) na tela de deals e salvar o arquivo exportado localmente.",
          classification: "ME"
        },
        {
          id: "step_28_28.7",
          sourceRef: "28.7",
          description: "No Excel exportado remover as colunas que n\u00e3o ser\u00e3o utilizadas no cruzamento (trade time, leg ID, origin ID, Product, hub, Strip, Qty Units, memo, source, clearing user id, USI, Quantity, Authorized traders).",
          classification: "ME"
        },
        {
          id: "step_28_28.7.1",
          sourceRef: "28.7.1",
          description: "Excluir as colunas listadas e manter apenas as colunas necess\u00e1rias para identifica\u00e7\u00e3o do deal e do broker reference.",
          classification: "ME"
        },
        {
          id: "step_28_28.8",
          sourceRef: "28.8",
          description: "Criar tr\u00eas colunas adicionais: 'Deal' (Deal ID), 'SAP Match' e 'Status'; identificar que Deal ID iniciando por 992 = Physical NGL e por 994 = Physical OIL.",
          classification: "ME"
        },
        {
          id: "step_28_28.9",
          sourceRef: "28.9",
          description: "No SAP VIM Workplace localizar o fornecedor/invoice correspondente e abrir o registro de invoice a ser processado (ex.: acessar a fatura 'Physical NGL Invoice').",
          classification: "MA"
        },
        {
          id: "step_28_28.9.1",
          sourceRef: "28.9.1",
          description: "No VIM Workplace pesquisar o fornecedor e abrir a invoice cujo processamento ser\u00e1 feito (confirme Vendor Name, Invoice number, Invoice date, Invoice amount, Bank remittance e Supply period conforme necess\u00e1rio).",
          classification: "ME"
        },
        {
          id: "step_28_28.10",
          sourceRef: "28.10",
          description: "Na invoice aberta ir at\u00e9 a aba 'Other Data' e selecionar a fun\u00e7\u00e3o 'Search Accrual VBD' para localizar VBDs em aberto que possam casar com os deals.",
          classification: "ME"
        },
        {
          id: "step_28_28.11",
          sourceRef: "28.11",
          description: "Executar a pesquisa de Accrual VBD e exportar os resultados. Antes de executar, garantir que o campo 'Bill of Lading' esteja completamente em branco para n\u00e3o filtrar indevidamente os resultados. Campo 'Bill of Lading' deve permanecer em branco antes de executar Search/Append VBD: Garantir que o campo 'Bill of Lading' esteja completamente vazio antes de pressionar Execute (F8) em Search Accrual VBD ou antes de Append VBD no VIM para evitar filtragem ou associa\u00e7\u00e3o incorreta de VBDs.",
          classification: "ME"
        },
        {
          id: "step_28_28.11.1",
          sourceRef: "28.11.1",
          description: "Verificar o campo 'Bill of Lading' e apagar qualquer conte\u00fado presente; confirmar vazio.",
          classification: "ME"
        },
        {
          id: "step_28_28.11.2",
          sourceRef: "28.11.2",
          description: "Pressionar Execute (F8) para listar todos os VBDs abertos do vendor.",
          classification: "ME"
        },
        {
          id: "step_28_28.12",
          sourceRef: "28.12",
          description: "Incluir ambos os tipos (Physical NGL e OIL) nos resultados, aplicar Sort e Filter para linhas com campos em branco quando indicado e exportar o resultado para arquivo; fornecer nome e local de salvamento.",
          classification: "ME"
        },
        {
          id: "step_28_28.12.1",
          sourceRef: "28.12.1",
          description: "Na listagem de VBD aplicar Sort e Filter para isolar linhas com campos em branco conforme a instru\u00e7\u00e3o e preparar para exporta\u00e7\u00e3o.",
          classification: "ME"
        },
        {
          id: "step_28_28.12.2",
          sourceRef: "28.12.2",
          description: "Clicar em Export (ou equivalente) e, na janela de arquivo, definir local e nome do arquivo; clicar Save.",
          classification: "ME"
        },
        {
          id: "step_28_28.13",
          sourceRef: "28.13",
          description: "No Excel do ICE usar VLOOKUP para comparar Broker Reference/Deal ID com a coluna do Excel exportado do SAP e preencher a coluna 'Status' com 'YES' quando a refer\u00eancia existir no SAP e 'NO' caso contr\u00e1rio.",
          classification: "MA"
        },
        {
          id: "step_28_28.13.1",
          sourceRef: "28.13.1",
          description: "Inserir f\u00f3rmula VLOOKUP para localizar o Broker Reference no arquivo SAP exportado; popular a coluna 'Status' com 'YES' ou 'NO'.",
          classification: "ME"
        },
        {
          id: "step_28_28.14",
          sourceRef: "28.14",
          description: "Filtrar as linhas com 'Status' = 'YES' no Excel e copiar todos os n\u00fameros de VBD retornados para uso no VIM.",
          classification: "ME"
        },
        {
          id: "step_28_28.15",
          sourceRef: "28.15",
          description: "No VIM Workplace, aba 'Other Data' \u2192 'Search Accrual VBD', colar os n\u00fameros de documento VBD copiados e executar (F8) para carregar esses VBDs na invoice.",
          classification: "ME"
        },
        {
          id: "step_28_28.15.1",
          sourceRef: "28.15.1",
          description: "Colar os VBDs no campo apropriado e pressionar Execute (F8) para recuperar os VBDs na tela.",
          classification: "ME"
        },
        {
          id: "step_28_28.16",
          sourceRef: "28.16",
          description: "Selecionar todos os VBDs carregados e executar a a\u00e7\u00e3o 'Overwrite VBD'; ent\u00e3o ir \u00e0 aba 'Line Item' salvar e verificar o quanto foi considerado para clear e os saldos remanescentes. Limite de toler\u00e2ncia para invoices de comiss\u00e3o: Verificar o valor do Balance em 'Line Item'. O limite de toler\u00e2ncia para invoice de comiss\u00e3o \u00e9 2000 d\u00f3lares; somente proceder com ajuste online quando o saldo estiver dentro desse limite.",
          classification: "MA"
        },
        {
          id: "step_28_28.16.1",
          sourceRef: "28.16.1",
          description: "Clicar em 'Overwrite VBD' para associar os VBDs selecionados \u00e0 invoice.",
          classification: "ME"
        },
        {
          id: "step_28_28.16.2",
          sourceRef: "28.16.2",
          description: "Ir para a aba 'Line Item', clicar em Save e observar os valores de clear e balance exibidos.",
          classification: "ME"
        },
        {
          id: "step_28_28.17",
          sourceRef: "28.17",
          description: "Usar o Deal ID (copiado do arquivo ICE) para consultar no LiveLink e obter o Excel de mapeamento que cont\u00e9m o P66 DEAL ID para VLOOKUP.",
          classification: "ME"
        },
        {
          id: "step_28_28.17.1",
          sourceRef: "28.17.1",
          description: "No LiveLink inserir o Deal ID e executar a busca; baixar o arquivo Excel retornado (p.ex. 'ICE-OCTOBER-2023').",
          classification: "ME"
        },
        {
          id: "step_28_28.18",
          sourceRef: "28.18",
          description: "Abrir o arquivo de LiveLink e usar a coluna 'P66 DEAL ID' como chave no VLOOKUP; depois selecionar todos os dados e aplicar 'Sort' por Deal ID.",
          classification: "ME"
        },
        {
          id: "step_28_28.19",
          sourceRef: "28.19",
          description: "Inspecionar a coluna Deal ID e excluir todas as entradas que come\u00e7am com '994' quando o foco for Physical NGL; manter apenas os deals 992 relevantes.",
          classification: "ME"
        },
        {
          id: "step_28_28.20",
          sourceRef: "28.20",
          description: "No VIM Workplace \u2192 Other Data \u2192 Search Accrual VBD colar todos os VBDs atualizados (ap\u00f3s VLOOKUP e limpeza) e executar (F8) para recarregar os VBDs.",
          classification: "ME"
        },
        {
          id: "step_28_28.21",
          sourceRef: "28.21",
          description: "Acessar a aba 'Line Item', salvar as altera\u00e7\u00f5es; caso o saldo esteja dentro do limite de toler\u00e2ncia de comiss\u00e3o, proceder com o processamento online; caso contr\u00e1rio, ajustar conforme indicado. Limite de toler\u00e2ncia para invoices de comiss\u00e3o: Verificar o valor do Balance em 'Line Item'. O limite de toler\u00e2ncia para invoice de comiss\u00e3o \u00e9 2000 d\u00f3lares; somente proceder com ajuste online quando o saldo estiver dentro desse limite.",
          classification: "MA"
        },
        {
          id: "step_28_28.21.1",
          sourceRef: "28.21.1",
          description: "Clicar em Save na aba Line Item e ler o valor do Balance. Se Balance \u2264 limite de toler\u00e2ncia permitir altera\u00e7\u00f5es online; caso contr\u00e1rio, identificar diferen\u00e7a.",
          classification: "MA"
        },
        {
          id: "step_28_28.22",
          sourceRef: "28.22",
          description: "No arquivo ICE filtrar as linhas com 'Status' = 'NO', copiar os Deal numbers e, no SAP Fiori, pesquisar cada Deal para verificar se existe uma linha item associada.",
          classification: "MS"
        },
        {
          id: "step_28_28.22.1",
          sourceRef: "28.22.1",
          description: "Abrir o aplicativo SAP Fiori, colar o Deal number e executar a pesquisa; abrir a linha retornada para inspe\u00e7\u00e3o.",
          classification: "ME"
        },
        {
          id: "step_28_28.22.2",
          sourceRef: "28.22.2",
          description: "Copiar todos os Deal numbers v\u00e1lidos encontrados no Fiori para uso em ZEWB.",
          classification: "ME"
        },
        {
          id: "step_28_28.23",
          sourceRef: "28.23",
          description: "No SAP, abrir a transa\u00e7\u00e3o ZEWB, inserir todos os Deal numbers copiados e executar (F8) para obter os VBDs que dispararam; copiar esses VBDs.",
          classification: "ME"
        },
        {
          id: "step_28_28.23.1",
          sourceRef: "28.23.1",
          description: "Na ZEWB colar os Deal numbers no campo apropriado e pressionar Execute (F8).",
          classification: "ME"
        },
        {
          id: "step_28_28.23.2",
          sourceRef: "28.23.2",
          description: "Copiar todos os n\u00fameros de VBD retornados pela ZEWB (VBDs que 'fired').",
          classification: "ME"
        },
        {
          id: "step_28_28.24",
          sourceRef: "28.24",
          description: "No VIM Workplace \u2192 Other Data \u2192 Search Accrual VBD colar os VBDs obtidos pela ZEWB, executar e usar a a\u00e7\u00e3o 'Append VBD' para anex\u00e1-los \u00e0 invoice; confirmar campo Bill of Lading vazio antes de executar. Campo 'Bill of Lading' deve permanecer em branco antes de executar Search/Append VBD: Garantir que o campo 'Bill of Lading' esteja completamente vazio antes de pressionar Execute (F8) em Search Accrual VBD ou antes de Append VBD no VIM para evitar filtragem ou associa\u00e7\u00e3o incorreta de VBDs.",
          classification: "ME"
        },
        {
          id: "step_28_28.24.1",
          sourceRef: "28.24.1",
          description: "Colar os VBDs, executar a pesquisa e clicar em 'Append VBD' para vincular os documentos \u00e0 invoice.",
          classification: "ME"
        },
        {
          id: "step_28_28.25",
          sourceRef: "28.25",
          description: "Ir para Line Item, ajustar manualmente o valor para que o balance fique dentro do limite de toler\u00e2ncia (se aplic\u00e1vel), clicar em 'Recalculate Price' e salvar as altera\u00e7\u00f5es. Limite de toler\u00e2ncia para invoices de comiss\u00e3o: Verificar o valor do Balance em 'Line Item'. O limite de toler\u00e2ncia para invoice de comiss\u00e3o \u00e9 2000 d\u00f3lares; somente proceder com ajuste online quando o saldo estiver dentro desse limite.",
          classification: "MA"
        },
        {
          id: "step_28_28.25.1",
          sourceRef: "28.25.1",
          description: "Alterar o balance para zerar ou ficar dentro do limite aceit\u00e1vel; confirmar mudan\u00e7a no campo Balance.",
          classification: "ME"
        },
        {
          id: "step_28_28.25.2",
          sourceRef: "28.25.2",
          description: "Clicar em 'Recalculate Price' e ent\u00e3o em Save para aplicar a altera\u00e7\u00e3o.",
          classification: "ME"
        },
        {
          id: "step_28_28.26",
          sourceRef: "28.26",
          description: "Clicar em 'Simulate Rules' para encontrar exce\u00e7\u00f5es; se surgir 'Suspected Duplicate', copiar o n\u00famero da invoice e verificar no VIM Analytics; se confirmado n\u00e3o-duplicado proceder com coment\u00e1rio 'Non Duplicate' e salvar para postar. Procedimento em caso de 'Suspected Duplicate' detectado por Simulate Rules: Condi\u00e7\u00e3o: Bot\u00e3o 'Simulate Rules' retorna exce\u00e7\u00e3o 'Suspected Duplicate'.. A\u00e7\u00f5es: Copiar o n\u00famero da invoice identificado como suspeito.; Ir para VIM Analytics e colar o n\u00famero, executar pesquisa (F8).; Inspecionar o resultado: se apenas um registro estiver presente considerar n\u00e3o-duplicado; caso exista duplicidade real, seguir procedimento de revers\u00e3o/contato conforme pol\u00edticas internas (n\u00e3o documentadas nesta se\u00e7\u00e3o).; Se for n\u00e3o-duplicado, no VIM Workplace selecionar 'Non Duplicate', inserir coment\u00e1rio 'Non Duplicate' e salvar para postar.. Resultado: 28.26 \u00b7 Clicar em 'Simulate Rules' para encontrar exce\u00e7\u00f5es; se surgir 'Suspected Duplicate', copiar o n\u00famero da invoice e verificar no VIM Analytics; se confirmado n\u00e3o-duplicado proceder com coment\u00e1rio 'Non Duplicate' e salvar para postar.",
          classification: "ME"
        },
        {
          id: "step_28_28.26.1",
          sourceRef: "28.26.1",
          description: "Clicar no bot\u00e3o 'Simulate Rules' e identificar eventuais exce\u00e7\u00f5es listadas (p.ex. Suspected Duplicate).",
          classification: "ME"
        },
        {
          id: "step_28_28.26.2",
          sourceRef: "28.26.2",
          description: "Copiar o n\u00famero da invoice e acessar VIM Analytics; colar o n\u00famero e executar pesquisa para verificar se existe registro duplicado.",
          classification: "MS"
        },
        {
          id: "step_28_28.26.3",
          sourceRef: "28.26.3",
          description: "Se a verifica\u00e7\u00e3o retornar apenas um line item (n\u00e3o duplicado), no VIM Workplace selecionar Non-Duplicate, inserir coment\u00e1rio 'Non Duplicate' e salvar; a invoice ser\u00e1 ent\u00e3o postada.",
          classification: "ME"
        },
      ]
    },
    {
      id: "step_29",
      sourceStep: "29",
      number: "29",
      title: "Processamento de faturas Freight & Transportation \u2014 HARLEY MARINE (classifica\u00e7\u00e3o Trip / Non\u2011Trip e cria\u00e7\u00e3o de VBD via ZEWB) Procedimento passo a passo",
      description: "Procedimento passo a passo para validar fatura do fornecedor Harley Marine Financing LLC, solicitar codifica\u00e7\u00e3o ao scheduler, criar VBD no ZEWB e finalizar o processamento no VIM para codifica\u00e7\u00e3o Non\u2011Trip ou Trip conforme fornecido pelo scheduler.",
      classification: "MS",
      classifications: ["MS"],
      macroBlockId: "routing",
      macroBlockName: "Routing",
      capabilityId: "cap-auto",
      capabilityName: "Capability Automática",
      solutionId: "sol-wf-routing",
      solutionIds: ["sol-wf-routing"],
      technologyType: "Workflow",
      rationale: "O fluxo depende da classifica\u00e7\u00e3o Trip/Non-Trip informada pelo Scheduler e do encaminhamento para aprova\u00e7\u00e3o.",
      effort: {
        level: "high",
        score: 50,
        confidence: "medium",
        drivers: [],
        unknowns: []
      },
      humanInTheLoop: {
        hasHumanControl: true,
        level: "partial",
        description: "`approval_required` \u2014 revis\u00e3o humana permanece necess\u00e1ria para dados, exce\u00e7\u00f5es, aprova\u00e7\u00f5es e/ou transa\u00e7\u00f5es financeiras."
      },
      substeps: [
        {
          id: "step_29_29.1",
          sourceRef: "29.1",
          description: "Abra o VIM Workplace e localize a fatura do fornecedor 'Harley Marine Financing LLC'. Abra o registro da fatura para realizar valida\u00e7\u00f5es iniciais dos campos. Valida\u00e7\u00e3o inicial obrigat\u00f3ria no VIM: Confirmar presen\u00e7a e corre\u00e7\u00e3o dos campos: Vendor Name, Invoice number, Invoice date, Invoice amount, Bank remittance details e Supply period antes de prosseguir.",
          classification: "ME"
        },
        {
          id: "step_29_29.2",
          sourceRef: "29.2",
          description: "Comparar os campos Basic Data no VIM com a c\u00f3pia original da fatura. Campos a validar: Nome do Vendor, N\u00famero da Invoice, Data da Invoice, Valor da Invoice, Dados banc\u00e1rios para remessa (Bank remittance) e Per\u00edodo de fornecimento (Supply period). Se todos os campos conferirem, prosseguir para localizar o scheduler. Confer\u00eancia detalhada contra a c\u00f3pia original: Comparar cada campo do Basic Data com a c\u00f3pia da fatura; registrar qualquer discrep\u00e2ncia encontrada.",
          classification: "MA"
        },
        {
          id: "step_29_29.3",
          sourceRef: "29.3",
          description: "No registro da fatura, confirme o campo de descri\u00e7\u00e3o (Delivery to) e localize o nome do scheduler indicado. Exemplo do caso: Delivery to - BARGE NATHAN SCHMIDT; Scheduler Name - Gabriel.E.Aguirre. Anote o nome do scheduler para envio do pedido de codifica\u00e7\u00e3o.",
          classification: "ME"
        },
        {
          id: "step_29_29.4",
          sourceRef: "29.4",
          description: "Enviar ao scheduler indicado uma solicita\u00e7\u00e3o de codifica\u00e7\u00e3o pedindo os detalhes de Trip ou Non\u2011Trip para esta fatura. Inclua no pedido a refer\u00eancia da invoice (n\u00famero) e pe\u00e7a explicitamente a indica\u00e7\u00e3o 'Trip Related' ou 'Non\u2011Trip Related' e os c\u00f3digos necess\u00e1rios para Material, Plant e Strategy conforme pol\u00edtica interna.",
          classification: "MS"
        },
        {
          id: "step_29_29.5",
          sourceRef: "29.5",
          description: "Ao receber a resposta do scheduler, registre os dados de codifica\u00e7\u00e3o recebidos. Confirme se a resposta identifica se a fatura \u00e9 'Trip Related' ou 'Non\u2011Trip Related' e capture os valores de Material, Plant e Strategy fornecidos pelo scheduler.",
          classification: "ME"
        },
        {
          id: "step_29_29.6",
          sourceRef: "29.6",
          description: "Decis\u00e3o para escolher o fluxo ZEWB apropriado conforme a classifica\u00e7\u00e3o informada pelo scheduler.",
          classification: "ME"
        },
        {
          id: "step_29_29.7",
          sourceRef: "29.7",
          description: "No SAP S/4, abrir a transa\u00e7\u00e3o ZEWB (Custom Trading Expense Workbench). Selecionar a op\u00e7\u00e3o 'Non\u2011Trip Related'. Informar os valores de Material, Plant e Strategy exatamente conforme fornecido pelo scheduler e executar (Execute).",
          classification: "ME"
        },
        {
          id: "step_29_29.8",
          sourceRef: "29.8",
          description: "No SAP S/4, abrir a transa\u00e7\u00e3o ZEWB (Custom Trading Expense Workbench). Selecionar a op\u00e7\u00e3o 'Trip Related' (o procedimento indica apenas selecionar esta op\u00e7\u00e3o diferente). Informar os valores de Material, Plant e Strategy conforme fornecido pelo scheduler e executar (Execute). Observa\u00e7\u00e3o: ap\u00f3s esta sele\u00e7\u00e3o, os passos seguintes s\u00e3o id\u00eanticos ao fluxo Non\u2011Trip.",
          classification: "ME"
        },
        {
          id: "step_29_29.9",
          sourceRef: "29.9",
          description: "Ap\u00f3s executar a consulta no ZEWB e exibir a p\u00e1gina de resultados, selecione a linha do item correspondente e clique em 'Create Expenses' para iniciar a cria\u00e7\u00e3o do VBD.",
          classification: "MA"
        },
        {
          id: "step_29_29.10",
          sourceRef: "29.10",
          description: "Atualizar os campos de Expenses class, Accounting type, Posting Category, Posting date, Partner (Vendor code), Amount, Invoice number e Document date. Ap\u00f3s preencher, pressionar Enter e salvar. Ao salvar, ser\u00e1 gerado o n\u00famero do documento VBD \u2014 copiar e registrar este n\u00famero. Confirma\u00e7\u00e3o de gera\u00e7\u00e3o e captura do n\u00famero do VBD: Ap\u00f3s salvar o VBD no ZEWB, copiar o n\u00famero do documento e mant\u00ea\u2011lo dispon\u00edvel para colar no VIM (Other data \u2192 Overwrite VBD\u2019s).",
          classification: "ME"
        },
        {
          id: "step_29_29.11",
          sourceRef: "29.11",
          description: "No VIM Workplace, ir \u00e0 se\u00e7\u00e3o 'Other data', colar o n\u00famero do VBD copiado e selecionar a op\u00e7\u00e3o 'Overwrite VBD\u2019s' para associar o VBD rec\u00e9m\u2011criado \u00e0 fatura no VIM.",
          classification: "ME"
        },
        {
          id: "step_29_29.12",
          sourceRef: "29.12",
          description: "Acessar a aba 'Accounting' no registro da fatura no VIM, atualizar/confirmar Baseline date, Payment terms e Due date conforme instru\u00e7\u00f5es internas e salvar as altera\u00e7\u00f5es.",
          classification: "ME"
        },
        {
          id: "step_29_29.13",
          sourceRef: "29.13",
          description: "Na interface do VIM, selecionar 'Simulate Rules' para verificar exce\u00e7\u00f5es e, se aplic\u00e1vel, clicar em 'Apply Rules' para processar as regras de neg\u00f3cio. Confirmar mensagem de 'Invoice Successfully Processed' ap\u00f3s aplica\u00e7\u00e3o das regras. Executar Simulate Rules e Apply Rules no VIM: Clicar em 'Simulate Rules' para identificar exce\u00e7\u00f5es e, se apropriado, clicar em 'Apply Rules'. Confirmar que a a\u00e7\u00e3o resultou em 'Invoice Successfully Processed'.",
          classification: "ME"
        },
      ]
    },
    {
      id: "step_30",
      sourceStep: "30",
      number: "30",
      title: "Processo South Bow / TransCanada Keystone \u2014 reconcilia\u00e7\u00e3o de arquivos, codifica\u00e7\u00e3o e upload OAWD Procedimento passo a passo para localizar e validar a",
      description: "Procedimento passo a passo para localizar e validar arquivos, reconciliar valores em planilha SOB Statement, preparar c\u00f3digos e efetuar o upload e processamento da fatura SOUTH BOW (USA) LP / Phillips 66 Canada Ltd no S/4 (T-Code OAWD) e execu\u00e7\u00e3o final no VIM Workplace.",
      classification: "ME",
      classifications: ["ME", "MS"],
      macroBlockId: "execution",
      macroBlockName: "Execution",
      capabilityId: "cap-auto",
      capabilityName: "Capability Automática",
      solutionId: "sol-rpa-upload-vim",
      solutionIds: ["sol-rpa-upload-vim"],
      technologyType: "RPA / Planilha",
      rationale: "A reconcilia\u00e7\u00e3o South Bow combina arquivos, f\u00f3rmulas, extra\u00e7\u00e3o de valores e upload OAWD; requer valida\u00e7\u00e3o de saldo e integra\u00e7\u00e3o.",
      effort: {
        level: "high",
        score: 50,
        confidence: "medium",
        drivers: [],
        unknowns: []
      },
      humanInTheLoop: {
        hasHumanControl: true,
        level: "partial",
        description: "`review_required` \u2014 revis\u00e3o humana permanece necess\u00e1ria para dados, exce\u00e7\u00f5es, aprova\u00e7\u00f5es e/ou transa\u00e7\u00f5es financeiras."
      },
      substeps: [
        {
          id: "step_30_30.1",
          sourceRef: "30.1",
          description: "Acesse o diret\u00f3rio compartilhado informado e confirme que os documentos listados est\u00e3o presentes antes de iniciar o processamento. Arquivos ausentes \u2014 notificar contatos respons\u00e1veis: Um ou mais arquivos obrigat\u00f3rios n\u00e3o estiverem presentes no caminho fonte ou no diret\u00f3rio de processamento. \u00b7 anika.jindal@p66.com; ameerah.martinez@p66.com \u00b7 e-mail",
          classification: "ME"
        },
        {
          id: "step_30_30.1.1",
          sourceRef: "30.1.1",
          description: "Abra o caminho S:\\PSX\\Commercial\\ACCOUNTING\\Crude Accounting\\Mid-Con\\Wood River - Keystone\\2025 e verifique a presen\u00e7a dos seguintes arquivos: 1) SOB Invoice Copy; 2) NOB Invoice Copy; 3) SOB Statement Output (Current month); 4) SOB Statement Output (previous month); 5) Keystone Tariff Schedule. Se algum arquivo estiver faltando, envie e-mail conforme CO_MISSING_FILES_ESCALATION.",
          classification: "ME"
        },
        {
          id: "step_30_30.2",
          sourceRef: "30.2",
          description: "Depois de confirmar os arquivos no local fonte, copie todos os arquivos necess\u00e1rios para o diret\u00f3rio de trabalho usado pelo time de processamento. Arquivos ausentes \u2014 notificar contatos respons\u00e1veis: Um ou mais arquivos obrigat\u00f3rios n\u00e3o estiverem presentes no caminho fonte ou no diret\u00f3rio de processamento. \u00b7 anika.jindal@p66.com; ameerah.martinez@p66.com \u00b7 e-mail Confirma\u00e7\u00e3o de c\u00f3pia para pasta de processamento: Todos os arquivos verificados devem ser copiados para S:\\PSX\\Commercial\\ACCOUNTING\\BILLING\\Secondary Cost \\Victoria and Saravanan\\Crude\\Keystone\\Transcanada Invoice Process\\2025 antes de prosseguir.",
          classification: "ME"
        },
        {
          id: "step_30_30.2.1",
          sourceRef: "30.2.1",
          description: "Copie todos os arquivos verificados para S:\\PSX\\Commercial\\ACCOUNTING\\BILLING\\Secondary Cost \\Victoria and Saravanan\\Crude\\Keystone\\Transcanada Invoice Process\\2025. Confirme que c\u00f3pias exatas (mesmo nome e data) est\u00e3o presentes no destino antes de prosseguir.",
          classification: "ME"
        },
        {
          id: "step_30_30.3",
          sourceRef: "30.3",
          description: "Abra o arquivo 'SOB Statement Output (Current month)' e atualize as colunas C1 e C2 conforme instru\u00e7\u00f5es.",
          classification: "ME"
        },
        {
          id: "step_30_30.3.1",
          sourceRef: "30.3.1",
          description: "Na aba Invoice Reconciliation do arquivo SOB Statement, insira na Coluna C1 a data do m\u00eas da fatura no formato MM/DD/YYYY (ex.: 08/01/2025).",
          classification: "MA"
        },
        {
          id: "step_30_30.3.2",
          sourceRef: "30.3.2",
          description: "Na mesma aba, preencha a Coluna C2 com a taxa USD/CAD conforme detalhado no arquivo 'Keystone Tariff Schedule'. Utilize a taxa aplic\u00e1vel ao per\u00edodo da fatura.",
          classification: "ME"
        },
        {
          id: "step_30_30.4",
          sourceRef: "30.4",
          description: "No arquivo de reconcilia\u00e7\u00e3o, limpe/remova todas as linhas/entradas aplicadas na Coluna F (destacadas em laranja) referentes a TransCanada Keystone Pipeline LP e Phillips 66 Canada Ltd.",
          classification: "MA"
        },
        {
          id: "step_30_30.5",
          sourceRef: "30.5",
          description: "Extraia as 'Deficiency fees' do sheet 'Misc Fees' dentro do arquivo 'SOB Statement' e registre o valor na Coluna F5 do Invoice Reconciliation (South Bow).",
          classification: "MA"
        },
        {
          id: "step_30_30.6",
          sourceRef: "30.6",
          description: "No(s) arquivo(s) de invoice (SOB Invoice Copy), localize todas as cobran\u00e7as identificadas como 'Diversion Charges' e some-as. Lance o total apurado na Coluna F6.",
          classification: "ME"
        },
        {
          id: "step_30_30.7",
          sourceRef: "30.7",
          description: "Some todas as 'Variable Charges' do SOB Invoice e adicione o valor do 'Monthly Revenue Commitment'. A partir do total, deduza as 'Deficiency fees' (j\u00e1 registradas em F5) e registre o resultado na Coluna F7.",
          classification: "ME"
        },
        {
          id: "step_30_30.8",
          sourceRef: "30.8",
          description: "Extraia o valor de 'Position Settlement' diretamente da c\u00f3pia da invoice e registre-o na Coluna F8 do worksheet de reconcilia\u00e7\u00e3o.",
          classification: "MA"
        },
        {
          id: "step_30_30.9",
          sourceRef: "30.9",
          description: "Localize na c\u00f3pia da invoice o campo correspondente a 'Add Variable True Up' e insira o valor apurado na Coluna F10 do arquivo de reconcilia\u00e7\u00e3o.",
          classification: "MA"
        },
        {
          id: "step_30_30.10",
          sourceRef: "30.10",
          description: "Verifique que a soma dos componentes na planilha (F5 a F10 e demais itens aplic\u00e1veis) resulte no mesmo total apresentado na SOB Invoice Copy. Objetivo: reconcilia\u00e7\u00e3o sem diferen\u00e7as. Reconciliar diferen\u00e7a = Nil obrigat\u00f3rio: A diferen\u00e7a de reconcilia\u00e7\u00e3o na planilha deve ser zero (Nil) antes de preparar codifica\u00e7\u00e3o e prosseguir com upload.",
          classification: "MA"
        },
        {
          id: "step_30_30.11",
          sourceRef: "30.11",
          description: "No sheet 'Misc Fees' do 'SOB Statement', extraia as Deficiency fees atribu\u00edveis \u00e0 Phillips 66 Canada Ltd. Converta o valor para USD dividindo pela taxa em Coluna C2 (USD/CAD) e registre o resultado na Coluna F15.",
          classification: "ME"
        },
        {
          id: "step_30_30.12",
          sourceRef: "30.12",
          description: "Extraia todas as 'Diversion Charges' do NOB Invoice (Phillips 66 Canada Ltd) e registre o total convertido (quando aplic\u00e1vel) na Coluna F16.",
          classification: "ME"
        },
        {
          id: "step_30_30.13",
          sourceRef: "30.13",
          description: "Some todas as 'Variable Charges' do SOB Invoice aplic\u00e1veis \u00e0 Phillips 66 Canada Ltd, acrescente o 'Monthly Revenue Commitment' e deduza as 'Deficiency fees' conforme instru\u00e7\u00f5es; lance o resultado na Coluna F17.",
          classification: "ME"
        },
        {
          id: "step_30_30.14",
          sourceRef: "30.14",
          description: "Localize e extraia 'Abandonment Fees' da c\u00f3pia da invoice (NOB Invoice) e registre o valor na Coluna F18 do worksheet.",
          classification: "ME"
        },
        {
          id: "step_30_30.15",
          sourceRef: "30.15",
          description: "Confirme que o campo de diferen\u00e7a de reconcilia\u00e7\u00e3o na planilha apresente valor zero (Nil). Se n\u00e3o estiver Nil, pare o processamento e reporte conforme UNQ_RECON_ACTIONS_UNKNOWN. Reconciliar diferen\u00e7a = Nil obrigat\u00f3rio: A diferen\u00e7a de reconcilia\u00e7\u00e3o na planilha deve ser zero (Nil) antes de preparar codifica\u00e7\u00e3o e prosseguir com upload.",
          classification: "MA"
        },
        {
          id: "step_30_30.16",
          sourceRef: "30.16",
          description: "Com a reconcilia\u00e7\u00e3o conclu\u00edda (diferen\u00e7a Nil), documente os valores e prepare os lan\u00e7amentos cont\u00e1beis (GL), centro de lucro e demais campos exigidos para o lan\u00e7amento da fatura. Registre estes c\u00f3digos no documento de prepara\u00e7\u00e3o de invoice. Reconciliar diferen\u00e7a = Nil obrigat\u00f3rio: A diferen\u00e7a de reconcilia\u00e7\u00e3o na planilha deve ser zero (Nil) antes de preparar codifica\u00e7\u00e3o e prosseguir com upload.",
          classification: "MA"
        },
        {
          id: "step_30_30.17",
          sourceRef: "30.17",
          description: "No S/4, acesse o T-Code OAWD e efetue o upload manual do arquivo de invoice. Selecione a op\u00e7\u00e3o HVC Non PO durante o processo de upload.",
          classification: "ME"
        },
        {
          id: "step_30_30.17.1",
          sourceRef: "30.17.1",
          description: "Durante o fluxo de upload em OAWD, marque/select a op\u00e7\u00e3o 'HVC Non PO' para classificar corretamente o tipo de documento a ser criado.",
          classification: "ME"
        },
        {
          id: "step_30_30.18",
          sourceRef: "30.18",
          description: "Acesse VIM Workplace para executar a invoice carregada e atualize os dados b\u00e1sicos conforme instru\u00e7\u00f5es.",
          classification: "ME"
        },
        {
          id: "step_30_30.18.1",
          sourceRef: "30.18.1",
          description: "No VIM Workplace, na tela de edi\u00e7\u00e3o da invoice, fa\u00e7a as seguintes atualiza\u00e7\u00f5es: Vendor code = 50392116 (South Bow (USA) LP); informe o n\u00famero da invoice e a data; registre o e-mail do requestor; verifique e confirme os detalhes de remessa banc\u00e1ria (bank remittance). Salve as altera\u00e7\u00f5es.",
          classification: "ME"
        },
        {
          id: "step_30_30.19",
          sourceRef: "30.19",
          description: "Na aba Line-Item do registro da invoice no VIM, insira os valores de GL account, material (quando aplic\u00e1vel), montante por linha e profit center conforme os detalhes preparados. Ap\u00f3s inserir todos os dados exigidos, salve o documento.",
          classification: "ME"
        },
        {
          id: "step_30_30.20",
          sourceRef: "30.20",
          description: "No campo Baseline/Payment do registro de invoice no VIM ou tela correspondente, atualize a Document date, marque Manual Entry se aplic\u00e1vel e ajuste o Payment term conforme consta na invoice. Salve as altera\u00e7\u00f5es.",
          classification: "MA"
        },
        {
          id: "step_30_30.21",
          sourceRef: "30.21",
          description: "Na tela de processamento do VIM Workplace, selecione a op\u00e7\u00e3o 'Simulate Rules' e em seguida clique em 'Apply Rules'. Verifique que o resultado apresente indicadores verdes (success). S\u00f3 prossiga se o status apresentar as luzes verdes. Confirmar estado verde ap\u00f3s aplicar regras: Ap\u00f3s 'Simulate Rules' e 'Apply Rules' o status deve mostrar indicadores verdes (confirmando regras aplicadas sem erros).",
          classification: "ME"
        },
      ]
    },
    {
      id: "step_31",
      sourceStep: "31",
      number: "31",
      title: "Submiss\u00e3o de fatura em S4 para aprova\u00e7\u00e3o Trip / Non\u2011Trip (Freight & Transportation) Procedimento para submeter fatura no S4, categorizando-a como Non-",
      description: "Procedimento para submeter fatura no S4, categorizando-a como Non-PO e encaminhando para aprova\u00e7\u00e3o da Gina. Verificar se o fornecedor faz parte da lista de fornecedores Freight & Transportation (38 fornecedores) e informar o m\u00e9todo de processamento identificado (Transport system, Auto-fired VBD, Non-PO) na submiss\u00e3o.",
      classification: "ME",
      classifications: ["ME", "MS"],
      macroBlockId: "routing",
      macroBlockName: "Routing",
      capabilityId: "cap-auto",
      capabilityName: "Capability Automática",
      solutionId: "sol-wf-routing",
      solutionIds: ["sol-wf-routing"],
      technologyType: "Workflow",
      rationale: "A submiss\u00e3o para aprova\u00e7\u00e3o depende de categoriza\u00e7\u00e3o, lista de fornecedores e encaminhamento controlado no S4.",
      effort: {
        level: "medium",
        score: 50,
        confidence: "medium",
        drivers: [],
        unknowns: []
      },
      humanInTheLoop: {
        hasHumanControl: true,
        level: "partial",
        description: "`approval_required` \u2014 revis\u00e3o humana permanece necess\u00e1ria para dados, exce\u00e7\u00f5es, aprova\u00e7\u00f5es e/ou transa\u00e7\u00f5es financeiras."
      },
      substeps: [
        {
          id: "step_31_31.1",
          sourceRef: "31.1",
          description: "No S4, abrir ou criar o documento de fatura que deve ser submetido para aprova\u00e7\u00e3o. Categorizar explicitamente a fatura como 'Non-PO' antes da submiss\u00e3o para aprova\u00e7\u00e3o. Classifica\u00e7\u00e3o obrigat\u00f3ria como Non-PO: A fatura deve estar categorizada como 'Non-PO' no S4 antes de qualquer submiss\u00e3o para aprova\u00e7\u00e3o, conforme instru\u00e7\u00e3o 'Step 20'.",
          classification: "MS"
        },
        {
          id: "step_31_31.1.1",
          sourceRef: "31.1.1",
          description: "Confirmar que os campos essenciais est\u00e3o preenchidos no documento em S4: identifica\u00e7\u00e3o do fornecedor (Vendor ID), valor da fatura, data da fatura e refer\u00eancia da fatura. N\u00e3o modificar campos n\u00e3o apresentados no documento original sem autoriza\u00e7\u00e3o.",
          classification: "ME"
        },
        {
          id: "step_31_31.1.2",
          sourceRef: "31.1.2",
          description: "Selecionar a categoria / tipo de documento que classifica a fatura como 'Non-PO'. Salvar o registro para que a categoria fique persistida antes de qualquer envio para aprova\u00e7\u00e3o. Classifica\u00e7\u00e3o obrigat\u00f3ria como Non-PO: A fatura deve estar categorizada como 'Non-PO' no S4 antes de qualquer submiss\u00e3o para aprova\u00e7\u00e3o, conforme instru\u00e7\u00e3o 'Step 20'.",
          classification: "MS"
        },
        {
          id: "step_31_31.2",
          sourceRef: "31.2",
          description: "Confirmar se o Vendor ID da fatura est\u00e1 presente na lista dos 38 fornecedores que possuem tratamento descrito (Transport system, Auto-fired VBD, Non-PO).",
          classification: "MS"
        },
        {
          id: "step_31_31.3",
          sourceRef: "31.3",
          description: "Encaminhar a fatura, j\u00e1 categorizada como Non-PO, para aprova\u00e7\u00e3o da Gina no S4, incluindo na submiss\u00e3o a informa\u00e7\u00e3o do m\u00e9todo de processamento do fornecedor conforme listado (Transport system, Auto-fired VBD, Non-PO). Incluir m\u00e9todo de processamento ao submeter: Ao submeter para aprova\u00e7\u00e3o da Gina, incluir na nota/observa\u00e7\u00e3o o m\u00e9todo de processamento do fornecedor (Transport system, Auto-fired VBD, Non-PO) conforme indicado pela lista de fornecedores.",
          classification: "MS"
        },
        {
          id: "step_31_31.3.1",
          sourceRef: "31.3.1",
          description: "Consultar a lista (quando acess\u00edvel) e inserir na nota/observa\u00e7\u00e3o da submiss\u00e3o o m\u00e9todo de processamento identificado para o fornecedor: Transport system, Auto-fired VBD ou Non-PO. Caso o m\u00e9todo n\u00e3o esteja expl\u00edcito na lista, registrar 'm\u00e9todo n\u00e3o especificado' no campo de observa\u00e7\u00f5es. Incluir m\u00e9todo de processamento ao submeter: Ao submeter para aprova\u00e7\u00e3o da Gina, incluir na nota/observa\u00e7\u00e3o o m\u00e9todo de processamento do fornecedor (Transport system, Auto-fired VBD, Non-PO) conforme indicado pela lista de fornecedores.",
          classification: "MS"
        },
        {
          id: "step_31_31.3.2",
          sourceRef: "31.3.2",
          description: "Usar a funcionalidade de submiss\u00e3o/fluxo de aprova\u00e7\u00e3o dispon\u00edvel no S4 para direcionar o documento \u00e0 Gina para revis\u00e3o e aprova\u00e7\u00e3o. Incluir coment\u00e1rio que a fatura \u00e9 'Non-PO' e apontar o m\u00e9todo de processamento conforme registrado. Incluir m\u00e9todo de processamento ao submeter: Ao submeter para aprova\u00e7\u00e3o da Gina, incluir na nota/observa\u00e7\u00e3o o m\u00e9todo de processamento do fornecedor (Transport system, Auto-fired VBD, Non-PO) conforme indicado pela lista de fornecedores.",
          classification: "MS"
        },
        {
          id: "step_31_31.3.3",
          sourceRef: "31.3.3",
          description: "Ap\u00f3s execu\u00e7\u00e3o do envio para aprova\u00e7\u00e3o, verificar no S4 se h\u00e1 indica\u00e7\u00e3o de que o documento foi encaminhado para o aprovador (status de workflow ou registro de envio). Registrar ou salvar qualquer confirma\u00e7\u00e3o/ID de workflow no caso de auditoria.",
          classification: "MS"
        },
      ]
    },
  ]
};

export const automationDetailMap: Record<string, ProcessAutomationDetailData> = {
  "special-handling": specialHandlingAutomationData
};