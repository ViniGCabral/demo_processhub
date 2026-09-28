import { ProcessAutomationDetailData } from "@/types/automationDetailTypes";

export const specialHandlingAutomationData: ProcessAutomationDetailData = {
  processId: "special-handling",
  processName: "Secondary Invoice Processing (P66)",
  sopCode: "P66_L6DTP",
  sopTitle: "Secondary Invoices and Rebill",
  summaryText: "Evaluation dataset for Secondary Invoice Processing and Credit/Debit Rebill. End-to-end evaluation with 31 main operational steps extracted from the SOP.",
  volumetrySummary: "31 main activities identified in the SOP, encompassing intake, SAP GUI routines, VIM, and manual approvals.",
  macroBlocks: [
    {
      id: "intake",
      order: 1,
      name: "Intake",
      description: "receive, collect, extract, and prepare data/documents",
      objective: "receive, collect, extract, and prepare data/documents",
      stepCount: 3,
      contextCards: [
        "Received invoice",
        "Support documents and attachments",
        "Nomination Key",
      ],
    },
    {
      id: "routing",
      order: 2,
      name: "Routing",
      description: "classify, prioritize, and route to the queue or responsible party",
      objective: "classify, prioritize, and route to the queue or responsible party",
      stepCount: 4,
      contextCards: [
        "Trip / Non-Trip → processing type",
        "Vendor / category → specific queue",
        "Company Code, GL, Profit Center → coding",
        "Scheduler / Gina → approval authority",
      ],
    },
    {
      id: "execution",
      order: 3,
      name: "Execution",
      description: "query, update, create, reconcile, or execute transactions",
      objective: "query, update, create, reconcile, or execute transactions",
      stepCount: 20,
      contextCards: [
        "Validate, reconcile, and process invoices",
        "Create or update VBDs and financial documents",
        "Execute entries in corporate systems",
      ],
    },
    {
      id: "exception",
      order: 4,
      name: "Exception",
      description: "handle discrepancies, missing data, ambiguities, blocks, and approvals",
      objective: "handle discrepancies, missing data, ambiguities, blocks, and approvals",
      stepCount: 3,
      contextCards: [
        "Missing document → Analyst / Scheduler",
        "Incorrect material → MDG",
        "Financial discrepancy → Supervisor / Accounting",
        "Revised invoice → Credit correction",
      ],
    },
    {
      id: "codification",
      order: 5,
      name: "Codification",
      description: "preserve evidence, record results, and prepare audit trail",
      objective: "preserve evidence, record results, and prepare audit trail",
      stepCount: 1,
      contextCards: [
        "Invoice processed and posted",
        "VBD created or updated",
        "Credit Memo / Debit Memo issued",
        "Intercompany report and audit trail",
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
      title: "Invoice receipt and manual upload via OAWD",
      description: "Execute manual upload of a Secondary Cost invoice in SAP using the OAWD transaction from the request received in the generic mailbox; confirm that the invoice has been loaded into the VIM Workspace for further processing.",
      classification: "ME",
      classifications: ["ME"],
      macroBlockId: "intake",
      macroBlockName: "Intake",
      capabilityId: "cap-auto",
      capabilityName: "Automation Capability",
      solutionId: "sol-rpa-upload-vim",
      solutionIds: ["sol-rpa-upload-vim"],
      technologyType: "RPA",
      rationale: "The upload follows a stable sequence in mailbox, local file, and OAWD; RPA is a proposal subject to validation of the SAP environment.",
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
        description: "`review_required` — revisão humana permanece necessária para dados, exceções, aprovações e/ou transações financeiras."
      },
      substeps: [
        {
          id: "step_01_1.1",
          sourceRef: "1.1",
          description: "Open the generic mailbox containing the upload request. Confirm that the message includes the support document(s) for the invoice and save the attachment in a location accessible to the user.",
          classification: "MS"
        },
        {
          id: "step_01_1.2",
          sourceRef: "1.2",
          description: "Open the SAP client. Execute the OAWD transaction to enter the VIM workflow Invoice Upload screen.",
          classification: "ME"
        },
        {
          id: "step_01_1.3",
          sourceRef: "1.3",
          description: "Na tela da transação OAWD navegar até a opção de menu P66 Incoming VIM Invoice – HVC Non-PO e, a partir daí, selecionar o sub-menu 'VIM Invoice Upload for NPO Manual'. Selecionar o menu correto no OAWD: No OAWD selecionar 'P66 Incoming VIM Invoice – HVC Non-PO' e o sub-menu 'VIM Invoice Upload for NPO Manual' quando o procedimento padrão de upload for aplicável.",
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
          description: "Na janela de 'Storing for subsequent entry' selecionar a marca de confirmação (green tick) para acionar o processo de upload. Navegar até o local onde o arquivo da fatura foi salvo, selecionar o arquivo e confirmar para completar o upload.",
          classification: "ME"
        },
        {
          id: "step_01_1.5",
          sourceRef: "1.5",
          description: "Após o upload, confirmar que a fatura aparece no VIM Workspace. Se a fatura estiver visível, encerrar este procedimento de upload — estado final: 'Fatura refletida no VIM Workspace' e encaminhar para o processamento (processamento da fatura manual ocorre em seção/processo subsequente).",
          classification: "MS"
        },
      ]
    },
    {
      id: "step_02",
      sourceStep: "2",
      number: "02",
      title: "VIM Workplace Navigation and Use (S/4 VIM) — Access, Visualization and Basic Actions",
      description: "Operational procedure to access VIM Workplace, view index information and images, review and act on invoices (viewing, comments, simulation, reassignment, etc).",
      classification: "ME",
      classifications: ["ME", "MS"],
      macroBlockId: "intake",
      macroBlockName: "Intake",
      capabilityId: "cap-auto",
      capabilityName: "Automation Capability",
      solutionId: "sol-rpa-report",
      solutionIds: ["sol-rpa-report"],
      technologyType: "Workflow",
      rationale: "Workflow pode organizar revisão, comentários, filtros e encaminhamentos; os fluxos exatos de reatribuição ainda precisam ser validados.",
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
        description: "`review_required` — revisão humana permanece necessária para dados, exceções, aprovações e/ou transações financeiras."
      },
      substeps: [
        {
          id: "step_02_2.1",
          sourceRef: "2.1",
          description: "Abrir o sistema SAP e navegar para a transação do VIM Workplace.",
          classification: "ME"
        },
        {
          id: "step_02_2.1.1",
          sourceRef: "2.1.1",
          description: "No SAP, executar a transação /OPT/VTM_WP para abrir o VIM Workplace e aguardar carregamento do índice (inbox).",
          classification: "ME"
        },
        {
          id: "step_02_2.2",
          sourceRef: "2.2",
          description: "Confirmar os campos-chave apresentados no índice do VIM Workplace para identificação rápida das faturas.",
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
          description: "Abrir um line-item do índice para inspecionar a imagem da fatura associada.",
          classification: "ME"
        },
        {
          id: "step_02_2.3.1",
          sourceRef: "2.3.1",
          description: "Na lista (inbox), clicar sobre a linha (line-item) da fatura desejada; confirmar que o painel de imagens/painel de visualização é carregado exibindo a(s) imagem(ns) da fatura.",
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
          description: "No detalhe do documento, revisar a seção de 'Line items' para validar quantidades, valores e demais linhas de custo presentes.",
          classification: "ME"
        },
        {
          id: "step_02_2.5",
          sourceRef: "2.5",
          description: "Visualizar o histórico de processamento da fatura para acompanhar eventos anteriores.",
          classification: "ME"
        },
        {
          id: "step_02_2.5.1",
          sourceRef: "2.5.1",
          description: "No detalhe da fatura, abrir a aba ou área 'Process History' e revisar os registros de ações já executadas (datas, agentes e status apresentados).",
          classification: "ME"
        },
        {
          id: "step_02_2.6",
          sourceRef: "2.6",
          description: "Confirmar que a lista mostra as faturas atribuídas ao agente corrente e identificar desvios (faturas não relacionadas a Secondary cost). Exception — Faturas não relacionadas exibidas por glitch na tabela: Condição: O inbox exibe faturas que não pertencem ao escopo de Secondary cost devido a tabela desorganizada ou erro de filtragem.. Ações: Selecionar as faturas não relacionadas exibidas.; Iniciar a ação de reatribuição para o agente/categoria correta.; Salvar a reatribuição e confirmar que a fatura não pertence mais ao seu inbox após atualização subsequente.. Resultado: 2.6 · Confirmar que a lista mostra as faturas atribuídas ao agente corrente e identificar desvios (faturas não relacionadas a Secondary cost). Unknown — Localização/fluxo exato de reatribuição na interface: Determinar o botão/fluxo exato (nome do botão/menu) para executar a reatribuição de faturas na interface do VIM Workplace, quando aplicável.",
          classification: "ME"
        },
        {
          id: "step_02_2.6.1",
          sourceRef: "2.6.1",
          description: "No topo do inbox, filtrar ou ordenar se necessário para ver apenas as faturas atribuídas ao Current Agent; confirmar que as faturas visíveis correspondem ao escopo de Secondary cost.",
          classification: "MA"
        },
        {
          id: "step_02_2.6.2",
          sourceRef: "2.6.2",
          description: "Quando forem exibidas faturas não relacionadas devido a tabelas desorganizadas ou glitch, selecionar essas faturas e iniciar a reatribuição para o agente correto. Exception — Faturas não relacionadas exibidas por glitch na tabela: Condição: O inbox exibe faturas que não pertencem ao escopo de Secondary cost devido a tabela desorganizada ou erro de filtragem.. Ações: Selecionar as faturas não relacionadas exibidas.; Iniciar a ação de reatribuição para o agente/categoria correta.; Salvar a reatribuição e confirmar que a fatura não pertence mais ao seu inbox após atualização subsequente.. Resultado: 2.6 · Confirmar que a lista mostra as faturas atribuídas ao agente corrente e identificar desvios (faturas não relacionadas a Secondary cost). Unknown — Localização/fluxo exato de reatribuição na interface: Determinar o botão/fluxo exato (nome do botão/menu) para executar a reatribuição de faturas na interface do VIM Workplace, quando aplicável.",
          classification: "ME"
        },
        {
          id: "step_02_2.6.3",
          sourceRef: "2.6.3",
          description: "Observar que faturas reatribuídas sairão do seu inbox e serão transferidas; o documento indica que a transferência/atribuição efetiva para o novo agente ocorrerá na próxima ocasião em que o inbox for atualizado.",
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
          description: "Acionar a opção 'Hide details pane' quando necessário para ajustar a visualização; em seguida, no painel de detalhes, localizar e anotar Reference Number, Contact Details e identificar o tipo de invoice (ex.: Inspection).",
          classification: "ME"
        },
        {
          id: "step_02_2.8",
          sourceRef: "2.8",
          description: "Adicionar ou editar comentários visíveis no VIM para registrar solicitações ou atualizações de status.",
          classification: "MS"
        },
        {
          id: "step_02_2.8.1",
          sourceRef: "2.8.1",
          description: "Clicar em 'Open comment' (ou funcionalidade equivalente) no detalhe da fatura, inserir o texto do comentário que atualiza o 'Current status' ou solicita informações/approvação e salvar a entrada para que fique visível no histórico/process history.",
          classification: "MS"
        },
        {
          id: "step_02_2.9",
          sourceRef: "2.9",
          description: "Conhecer e usar os botões coloridos apresentados no VIM para ações imediatas.",
          classification: "ME"
        },
        {
          id: "step_02_2.9.1",
          sourceRef: "2.9.1",
          description: "Interpretar os botões coloridos: botão verde = opção para voltar; botão amarelo = opção para sair; botão vermelho = opção para cancelar. Usar cada botão conforme o propósito indicado para retornar, sair da tela ou cancelar a ação corrente.",
          classification: "ME"
        },
        {
          id: "step_02_2.10",
          sourceRef: "2.10",
          description: "Visualizar e confirmar os anexos/imagens associados à fatura.",
          classification: "ME"
        },
        {
          id: "step_02_2.10.1",
          sourceRef: "2.10.1",
          description: "Clicar em 'Display Image' no painel da fatura e confirmar que o(s) anexo(s) abre(m) corretamente; verificar se a imagem corresponde à fatura física (valores, fornecedor, datas).",
          classification: "MA"
        },
        {
          id: "step_02_2.11",
          sourceRef: "2.11",
          description: "Executar a simulação das regras configuradas para a fatura e decidir a aplicação conforme resultado da simulação. Control — Simulação de regras obrigatória antes da aplicação: Executar a função 'Simulate rules' e revisar a saída antes de aplicar as regras à fatura.",
          classification: "MS"
        },
        {
          id: "step_02_2.12",
          sourceRef: "2.12",
          description: "Quando apropriado, definir a fatura como obsoleta usando as marcações previstas.",
          classification: "ME"
        },
        {
          id: "step_02_2.12.1",
          sourceRef: "2.12.1",
          description: "No detalhe da fatura, selecionar as caixas/opções aplicáveis para marcar o documento como 'Invalid PO/OLA', 'Legacy Data', 'Duplicate Invoice' ou outras opções de obsoleto conforme o diagnóstico; salvar a alteração para que a marcação conste no registro.",
          classification: "ME"
        },
        {
          id: "step_02_2.13",
          sourceRef: "2.13",
          description: "Avaliar se a fatura é um crédito e aplicar o fluxo adequado quando a geração de VBD negativo não é permitida. Unknown — Procedimento detalhado para conversão de crédito em Non-PO via upload manual: Detalhar os passos de upload manual para converter faturas de crédito em Non-PO (ZEWB/Upload Manual) — campos obrigatórios e ações subsequentes.",
          classification: "MS"
        },
        {
          id: "step_02_2.14",
          sourceRef: "2.14",
          description: "Quando for necessário obter aprovação ou informações adicionais do scheduler, registrar essa solicitação via comentário na fatura.",
          classification: "MS"
        },
        {
          id: "step_02_2.14.1",
          sourceRef: "2.14.1",
          description: "Abrir 'Open comment' ou a funcionalidade de comentários da fatura, inserir mensagem clara solicitando aprovação ou informação extra do scheduler e salvar para que o scheduler visualize e responda.",
          classification: "MS"
        },
      ]
    },
    {
      id: "step_03",
      sourceStep: "3",
      number: "03",
      title: "Manual Non-PO invoice processing and VBD creation (Trip and Non-Trip) Executable procedure to register, code, submit for approval and",
      description: "Executable procedure to register, code, submit for approval and salvar documentação de faturas Non‑PO no sistema. Esta sequência cobre verificação inicial, preenchimento de campos obrigatórios, definição de documento de crédito quando aplicável, definição de bloqueio de pagamento, inserção de GL e Profit Center, atribuições e envio para simulação de regras / fila de aprovação. Termine salvando e anexando documentos de backup quando necessário.",
      classification: "ME",
      classifications: ["ME", "MS"],
      macroBlockId: "execution",
      macroBlockName: "Execution",
      capabilityId: "cap-auto",
      capabilityName: "Automation Capability",
      solutionId: "sol-rpa-upload-vim",
      solutionIds: ["sol-rpa-upload-vim"],
      technologyType: "RPA",
      rationale: "A atividade combina preenchimento repetitivo em VIM com decisões condicionais e dados de apoio; RPA deve ficar limitado aos campos estáveis e manter revisão humana.",
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
        description: "`review_required` — revisão humana permanece necessária para dados, exceções, aprovações e/ou transações financeiras."
      },
      substeps: [
        {
          id: "step_03_3.1",
          sourceRef: "3.1",
          description: "Confirme que a tela de entrada da fatura foi aberta após executar/selecionar o line item e esteja pronta para edição dos campos da fatura.",
          classification: "ME"
        },
        {
          id: "step_03_3.1.1",
          sourceRef: "3.1.1",
          description: "Execute a ação que carrega o line item no formulário de fatura. Aguarde a tela de entrada ser exibida e verifique que campos principais (Vendor, Company Code, Amount, Invoice Date) estejam visíveis para edição.",
          classification: "MS"
        },
        {
          id: "step_03_3.2",
          sourceRef: "3.2",
          description: "Preencher os campos básicos da fatura conforme a cópia da fatura: número do fornecedor, data da fatura, valor e outros campos apresentados no formulário. Garantir que o Company Code já esteja definido conforme a estratégia da fatura.",
          classification: "ME"
        },
        {
          id: "step_03_3.2.1",
          sourceRef: "3.2.1",
          description: "No campo Vendor, digite o número do fornecedor exatamente como consta na fatura.",
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
          description: "Verifique os demais campos disponíveis na tela e atualize conforme a fatura (por exemplo: descrição, referência), mantendo o Company Code conforme estratégia (ver passo de mapeamento de strategy name).",
          classification: "ME"
        },
        {
          id: "step_03_3.3",
          sourceRef: "3.3",
          description: "Abrir a planilha referida e selecionar o Company Code correspondente ao strategy name que aparece na fatura; inserir o Company Code no campo apropriado do formulário. Utilizar planilha de Strategy Valuation para mapeamento de Company Code: Para selecionar o Company Code, consulte a planilha 'Day-5 Strategy Valuation and Profit Center FINAL.xlsx' e insira o Company Code exatamente conforme a linha do strategy name.",
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
          description: "Leia o Company Code associado ao strategy name e insira esse código no campo Company Code do formulário da fatura.",
          classification: "ME"
        },
        {
          id: "step_03_3.4",
          sourceRef: "3.4",
          description: "Atualizar o número da fatura e a data conforme o documento; no campo Requester E-mail inserir o e-mail do Requester — por padrão usar o mesmo e‑mail do Processr quando aplicável. Requester E‑mail não aprovado para inclusão: Condição: Requester E-mail não está autorizado no sistema para ser utilizado no campo Requester. Ações: Usar o Processr E-mail no campo Requester quando apropriado; Solicitar aprovação para incluir o Requester E-mail na lista autorizada. Resultado: 3.4 · Atualizar o número da fatura e a data conforme o documento; no campo Requester E-mail inserir o e-mail do Requester — por padrão usar o mesmo e‑mail do Processr quando aplicável.",
          classification: "MS"
        },
        {
          id: "step_03_3.4.1",
          sourceRef: "3.4.1",
          description: "No campo Invoice Number, insira exatamente o número que consta na fatura física ou eletrônica.",
          classification: "ME"
        },
        {
          id: "step_03_3.4.2",
          sourceRef: "3.4.2",
          description: "No campo Invoice Date, confirme a data e atualize se necessário com a data indicada na fatura.",
          classification: "ME"
        },
        {
          id: "step_03_3.4.3",
          sourceRef: "3.4.3",
          description: "No campo Requester E-mail, insira o e-mail do Requester. Se o Requester não tiver permissão para ser colocado aqui, use o Processr E-mail conforme observado na prática padrão.",
          classification: "ME"
        },
        {
          id: "step_03_3.5",
          sourceRef: "3.5",
          description: "Decida se a fatura deve ser registrada como fatura normal ou como nota de crédito.",
          classification: "ME"
        },
        {
          id: "step_03_3.6",
          sourceRef: "3.6",
          description: "Ao confirmar que é um crédito, altere o tipo de documento para Credit Memo e verifique o estado do campo Payment Block (normalmente creditos assumem bloqueio por padrão). Ajuste conforme política.",
          classification: "ME"
        },
        {
          id: "step_03_3.6.1",
          sourceRef: "3.6.1",
          description: "Altere o tipo de documento para 'Credit Memo' no campo apropriado do formulário.",
          classification: "ME"
        },
        {
          id: "step_03_3.6.2",
          sourceRef: "3.6.2",
          description: "Verifique o campo Payment Block: confirme se está aplicado por padrão para credit memos e ajuste apenas se política permitir.",
          classification: "ME"
        },
        {
          id: "step_03_3.7",
          sourceRef: "3.7",
          description: "Para faturas normais, definir o campo Payment Block como 'free for payment' para permitir processamento de pagamento, conforme instrução operacional. Payment Block deve estar livre para pagamento em faturas normais: Verifique e defina o campo Payment Block como 'free for payment' for invoiras que não sejam credit memos.",
          classification: "ME"
        },
        {
          id: "step_03_3.7.1",
          sourceRef: "3.7.1",
          description: "Localize o campo Payment Block na tela e selecione a opção que libera a fatura para pagamento (free for payment).",
          classification: "ME"
        },
        {
          id: "step_03_3.7.2",
          sourceRef: "3.7.2",
          description: "Confirme visualmente que o Payment Block está definido como livre para pagamento antes de prosseguir.",
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
          description: "Selecione os Payment Terms conforme a fatura (por exemplo, prazo e data de vencimento) e confirme que os valores calculados estão coerentes com o documento.",
          classification: "ME"
        },
        {
          id: "step_03_3.9",
          sourceRef: "3.9",
          description: "Obter o código GL e o Profit Center que serão utilizados para contabilização da fatura; estes dois campos são obrigatórios para non‑PO invoices.",
          classification: "ME"
        },
        {
          id: "step_03_3.9.1",
          sourceRef: "3.9.1",
          description: "Verifique se existe documentação interna (lista padrão de GLs) associada ao tipo de gasto da fatura. Se disponível, selecione o GL apropriado.",
          classification: "ME"
        },
        {
          id: "step_03_3.9.2",
          sourceRef: "3.9.2",
          description: "Se não houver referência interna clara, solicite o GL e Profit Center ao responsável indicado (ver passo de contato).",
          classification: "ME"
        },
        {
          id: "step_03_3.10",
          sourceRef: "3.10",
          description: "Contatar James Carlson para obter o GL account e o Profit Center apropriados quando não estiverem definidos internamente. Solicitar GL/Profit Center a James Carlson: Não existir GL account ou Profit Center claro para a fatura · James Carlson · email",
          classification: "MS"
        },
        {
          id: "step_03_3.10.1",
          sourceRef: "3.10.1",
          description: "Envie e-mail para James Carlson especificando: número da fatura, valor, descrição do gasto e solicitação explícita de GL account e Profit Center.",
          classification: "MS"
        },
        {
          id: "step_03_3.10.2",
          sourceRef: "3.10.2",
          description: "Aguarde a resposta com os códigos GL e Profit Center; após recebimento, registre-os nos campos correspondentes do formulário.",
          classification: "MA"
        },
        {
          id: "step_03_3.11",
          sourceRef: "3.11",
          description: "Inserir o GL code recebido, definir a coluna como Debit (quando aplicável) e atualizar o campo Text com a descrição e mês/ano da fatura para documentação.",
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
          description: "No campo Text, registre a descrição da fatura seguida do mês e ano (ex.: 'Serviços terminaling - Jun 2024'), conforme a documentação da fatura.",
          classification: "ME"
        },
        {
          id: "step_03_3.12",
          sourceRef: "3.12",
          description: "No bloco Assignment, atualizar o vendor number e, se aplicável, definir o Profit Center baseado no fornecedor (ex.: propane -> Mary Maryville Lights; butanes -> heavy). Salvar as alterações no formulário.",
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
          description: "Se o fornecedor corresponder a um dos casos padrão (ex.: propane - Mary Maryville Lights; butanes - heavy), atribua o Profit Center conforme o caso indicado e conforme informação recebida.",
          classification: "MA"
        },
        {
          id: "step_03_3.12.3",
          sourceRef: "3.12.3",
          description: "Salvar as atualizações efetuadas no formulário (pressionar 'Save' / salvar registro).",
          classification: "ME"
        },
        {
          id: "step_03_3.13",
          sourceRef: "3.13",
          description: "Aplicar a função de simulação de regras para efetuar roteamento de aprovação. Marcar que aprovação é requerida quando aplicável; o processo encaminhará inicialmente para a fila do Requestor e depois para o approver seguinte (ex.: Gina).",
          classification: "MS"
        },
        {
          id: "step_03_3.13.1",
          sourceRef: "3.13.1",
          description: "Clique em 'Simulate Rules' (ou função equivalente) para calcular o fluxo de aprovação e revisar o destino (Requestor -> próximo approver).",
          classification: "MS"
        },
        {
          id: "step_03_3.13.2",
          sourceRef: "3.13.2",
          description: "Ative a opção 'Approval required' quando o sistema solicitar, garantindo que a fatura seja roteada conforme regras.",
          classification: "MS"
        },
        {
          id: "step_03_3.14",
          sourceRef: "3.14",
          description: "Acompanhar a chegada da fatura na fila do Requestor; o Requestor deverá aprovar ou recusar. Após aprovação, a fatura seguirá para o próximo aprovador. Confirmar que os documentos de suporte estão anexados para análise do aprovador.",
          classification: "MS"
        },
        {
          id: "step_03_3.14.1",
          sourceRef: "3.14.1",
          description: "Verifique a fila do Requestor para confirmar que a fatura apareceu e aguarde a ação (aprovar/recusar).",
          classification: "MS"
        },
        {
          id: "step_03_3.14.2",
          sourceRef: "3.14.2",
          description: "Se o Requestor aprovar, confirme que o registro foi encaminhado ao próximo aprovador conforme a simulação (por exemplo, Gina). Caso rejeitado, registrar motivo e executar correção necessária.",
          classification: "MS"
        },
        {
          id: "step_03_3.14.3",
          sourceRef: "3.14.3",
          description: "Antes ou durante aprovação, confirme que todos os backups/documentos (PDFs, evidências) estão anexados ao business document.",
          classification: "MS"
        },
        {
          id: "step_03_3.15",
          sourceRef: "3.15",
          description: "Quando aprovações ou documentos de suporte forem recebidos fora do sistema, usar a função 'store business document' para adicionar os arquivos ao registro da fatura.",
          classification: "MS"
        },
        {
          id: "step_03_3.15.1",
          sourceRef: "3.15.1",
          description: "Acesse a função 'Store Business Document' no registro da fatura.",
          classification: "ME"
        },
        {
          id: "step_03_3.15.2",
          sourceRef: "3.15.2",
          description: "Anexe o(s) arquivo(s) recebido(s) externamente (ex.: e‑mail de aprovação, PDF de backup) e confirme o upload.",
          classification: "MS"
        },
        {
          id: "step_03_3.15.3",
          sourceRef: "3.15.3",
          description: "Salvar o registro após anexação para garantir que o documento de suporte fique disponível na fatura.",
          classification: "ME"
        },
      ]
    },
    {
      id: "step_04",
      sourceStep: "4",
      number: "04",
      title: "Manual VBD creation (ZEWB) — fluxos Trip e Non‑Trip Executable procedure para criar VBD manualmente no Custom Trading Expenses Workbench para pro",
      description: "Executable procedure para criar VBD manualmente no Custom Trading Expenses Workbench para processos Trip‑related e Non‑Trip related, incluindo tratamento quando o Scheduler não fornece dados (processamento Non‑PO).",
      classification: "ME",
      classifications: ["ME", "MS"],
      macroBlockId: "execution",
      macroBlockName: "Execution",
      capabilityId: "cap-auto",
      capabilityName: "Automation Capability",
      solutionId: "sol-rpa-upload-vim",
      solutionIds: ["sol-rpa-upload-vim"],
      technologyType: "RPA",
      rationale: "A criação de VBD tem campos e sequências estruturadas, mas depende de dados do Scheduler e de variações Trip/Non-Trip.",
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
        description: "`review_required` — revisão humana permanece necessária para dados, exceções, aprovações e/ou transações financeiras."
      },
      substeps: [
        {
          id: "step_04_4.1",
          sourceRef: "4.1",
          description: "Receba o e-mail/solicitação do Scheduler e identifique quais detalhes foram fornecidos: para Non‑Trip (Plant, Material, Strategy) ou para Trip (Nomination Key / Nom key). Registre os valores exatos recebidos antes de abrir o Workbench.",
          classification: "MS"
        },
        {
          id: "step_04_4.2",
          sourceRef: "4.2",
          description: "Determinar se o VBD será Trip‑related, Non‑Trip related ou se faltam dados do Scheduler.",
          classification: "MS"
        },
        {
          id: "step_04_4.3",
          sourceRef: "4.3",
          description: "Abra o Custom Trading Expenses Workbench, selecione a opção Non‑Trip Related e carregue Plant, Material e Strategy exatamente como recebidos no e‑mail do Scheduler; em seguida, execute para listar itens.",
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
          description: "No formulário de criação de expense selecione Expense Class Group = Z1. Em Expense Class escolha o código que corresponde à natureza do custo (ex.: F28 para terminal/miscellaneous utilities; F00 para inspeção quando aplicável). Expense Class Group obrigatório: Sempre selecionar Expense Class Group = Z1 ao criar expenses manuais para estes processos.",
          classification: "MA"
        },
        {
          id: "step_04_4.3.3",
          sourceRef: "4.3.3",
          description: "Defina Accounting Type conforme a necessidade de exibir estratégia: para Non‑Trip, quando for necessário mostrar Strategy, selecione tipo B (conta de Expense). Regra para Accounting Type: Quando houver Nomination Key use Accounting Type = A (Inventory account). Quando for necessário exibir Strategy (Non‑Trip) use Accounting Type = B (Expense account).",
          classification: "ME"
        },
        {
          id: "step_04_4.3.4",
          sourceRef: "4.3.4",
          description: "Atualize os campos: Posting Category = 3 (accrual); Posting Date = data em que está postando; Transaction Date = data da atividade (se disponível) — caso não haja, use a última data do mês da fatura. Em Partner Details informe o Vendor Number. Em seguida, preencha Net Amount (USD ou moeda da fatura), Document, Reference e Text (usar número da fatura no Reference/Text). Posting Category = 3: Posting Category deve ser selecionada como 3 (accrual) para todas as criações manuais descritas.",
          classification: "ME"
        },
        {
          id: "step_04_4.3.5",
          sourceRef: "4.3.5",
          description: "Clique no ícone Save. Depois de salvar, o Expense DOC list é gravado e um VBD é criado vinculado à fatura. Copie o VBD gerado e anexe‑o à fatura para que fique pronta para processamento posterior. Método de anexação do VBD à fatura não especificado: O procedimento menciona copiar o VBD e anexar à fatura, mas o passo exato (menu/opção) para anexação não está detalhado no documento fonte.",
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
          description: "Após informar o Nom key e clicar Execute, selecione a linha item correspondente (ex.: line 10) e clique em Create Expense para iniciar a criação do expense.",
          classification: "MA"
        },
        {
          id: "step_04_4.4.2",
          sourceRef: "4.4.2",
          description: "No formulário de criação de expense para Trip selecione Expense Class Group = Z1. Escolha a Expense Class conforme a descrição do custo (por exemplo, F00 para inspeção quando aplicável). Expense Class Group obrigatório: Sempre selecionar Expense Class Group = Z1 ao criar expenses manuais para estes processos.",
          classification: "ME"
        },
        {
          id: "step_04_4.4.3",
          sourceRef: "4.4.3",
          description: "Para Trip related selecione Accounting Type = A (conta de Inventory). Configure Posting Category = 3 (accrual). Atualize Posting Date (data de postagem) e Transaction Date (se aplicável). Em Partner Details informe o Vendor Number. Preencha Net Amount (na moeda correta), Document, Reference e Text (usar número da fatura). Posting Category = 3: Posting Category deve ser selecionada como 3 (accrual) para todas as criações manuais descritas. Regra para Accounting Type: Quando houver Nomination Key use Accounting Type = A (Inventory account). Quando for necessário exibir Strategy (Non‑Trip) use Accounting Type = B (Expense account).",
          classification: "ME"
        },
        {
          id: "step_04_4.4.4",
          sourceRef: "4.4.4",
          description: "Após inserir todos os dados clique no ícone Save. O sistema criará o VBD ligado à fatura. Copie o VBD e anexe‑o à fatura para prosseguir com o processamento. Método de anexação do VBD à fatura não especificado: O procedimento menciona copiar o VBD e anexar à fatura, mas o passo exato (menu/opção) para anexação não está detalhado no documento fonte.",
          classification: "ME"
        },
        {
          id: "step_04_4.5",
          sourceRef: "4.5",
          description: "Se o Scheduler não puder fornecer Nomination Key nem Plant/Material/Strategy, processe a fatura como Non‑PO: codifique a transação usando GL e Cost Centre apropriados (conforme política vigente) e avance o documento para o fluxo de aprovação/lançamento sem VBD Trip/Non‑Trip. Exceção: Scheduler não forneceu dados: Condição: Scheduler não forneceu Nom key nem Plant/Material/Strategy. Ações: Process a fatura como Non‑PO usando GL e Cost Centre apropriados.; Inserir codificação específica de acordo com política local de Non‑PO.",
          classification: "MS"
        },
        {
          id: "step_04_4.6",
          sourceRef: "4.6",
          description: "Depois que o VBD for criado e anexado à fatura, efetue o upload do Expense DOC list (quando aplicável). Após o upload concluído, execute 'Apply Rules to Post the Invoice' para que as regras de contabilização sejam aplicadas e a fatura seja preparada para postagem.",
          classification: "ME"
        },
      ]
    },
    {
      id: "step_05",
      sourceStep: "5",
      number: "05",
      title: "Create MDG request para extensão/correção de material Fluxo executável para registrar uma solicitação no MDG quando for detectado que um plant não",
      description: "Fluxo executável para registrar uma solicitação no MDG quando for detectado que um plant não está aplicado a um material (extensão/correção). Inclui confirmação de VBD associado ao invoice antes da solicitação.",
      classification: "MS",
      classifications: ["MS"],
      macroBlockId: "exception",
      macroBlockName: "Exception",
      capabilityId: "cap-auto",
      capabilityName: "Automation Capability",
      solutionId: "sol-wf-routing",
      solutionIds: ["sol-wf-routing"],
      technologyType: "Workflow",
      rationale: "A solicitação MDG trata correção ou extensão de material e depende de validação e aprovação de uma área responsável.",
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
        description: "`decision_required` — revisão humana permanece necessária para dados, exceções, aprovações e/ou transações financeiras."
      },
      substeps: [
        {
          id: "step_05_5.1",
          sourceRef: "5.1",
          description: "Abrir o e-mail recebido que solicita a correção/ extensão do material e localizar a mensagem de erro que indica que o plant não está aplicado ao material. Registrar os dados essenciais (número do material, descrição do erro, número do invoice se presente) para uso na solicitação MDG. Registrar dados do e-mail de solicitação: Capturar número do material, texto do erro e número do invoice (se presente) diretamente do e-mail para uso nas etapas subsequentes.",
          classification: "MS"
        },
        {
          id: "step_05_5.2",
          sourceRef: "5.2",
          description: "Se, antes de criar a solicitação MDG, você salvou a Expense DOC list e foi criado um VBD contra a fatura, copie o identificador do VBD e anexe-o ao invoice para garantir que o invoice esteja pronto para processamento. Local/tela para anexar VBD ao invoice: Copiar o identificador do VBD criado e anexá-lo ao invoice.",
          classification: "MS"
        },
        {
          id: "step_05_5.3",
          sourceRef: "5.3",
          description: "No SAP Fiori, localizar e clicar em MDG Launchpad para abrir a aplicação de gerenciamento de master data. Aguardar o carregamento do Launchpad.",
          classification: "ME"
        },
        {
          id: "step_05_5.4",
          sourceRef: "5.4",
          description: "No MDG Launchpad, clicar na opção 'Change Material' para iniciar o fluxo de alteração do material.",
          classification: "ME"
        },
        {
          id: "step_05_5.5",
          sourceRef: "5.5",
          description: "No campo correspondente, digitar o número do material informado pelo e-mail/erro e pressionar Enter. Verificar que os detalhes do material são exibidos na tela antes de prosseguir.",
          classification: "MA"
        },
        {
          id: "step_05_5.6",
          sourceRef: "5.6",
          description: "Verificar, conforme a mensagem de erro ou solicitação recebida, o tipo de extensão que deve ser aplicada ao material.",
          classification: "MS"
        },
        {
          id: "step_05_5.7",
          sourceRef: "5.7",
          description: "Clicar no botão 'Edit' (Editar) na tela do material e, no menu/ações disponíveis, selecionar a opção 'Extend material'. Confirmar a seleção clicando em 'OK'. Observar que um Change Request ID será gerado automaticamente e exibido na tela.",
          classification: "ME"
        },
        {
          id: "step_05_5.8",
          sourceRef: "5.8",
          description: "Localizar os campos 'Description' e 'Reason' no formulário de alteração. Copiar/registrar a informação do erro conforme recebido no e-mail e colar/entrar nos campos: Description deve refletir a descrição curta do problema; Reason deve indicar a justificativa para a extensão/correção. Preenchimento obrigatório de Description e Reason: Preencher o campo Description com a descrição do problema e o campo Reason com a justificativa, conforme a mensagem de erro.",
          classification: "ME"
        },
        {
          id: "step_05_5.9",
          sourceRef: "5.9",
          description: "Ir até a aba 'Notes' (Notas), clicar em 'New' (Novo) para criar uma nota e inserir os detalhes completos do erro (texto do e-mail, identificadores relevantes, passos que levaram ao erro). Após inserir o texto da nota, clicar em 'OK' para salvar a nota no pedido de mudança. Incluir detalhes completos na aba Notes: Na aba Notes, clicar em New e inserir os detalhes completos do erro e qualquer informação de suporte antes de confirmar com OK.",
          classification: "ME"
        },
        {
          id: "step_05_5.10",
          sourceRef: "5.10",
          description: "Na tela do Change Request, confirmar que todos os campos obrigatórios (Description, Reason) e a nota foram preenchidos. Clicar em 'Submit' (Enviar). Verificar a confirmação de envio exibida pelo sistema (Change Request ID deve estar presente para referência). Registrar o Change Request ID no controle de solicitações.",
          classification: "MS"
        },
        {
          id: "step_05_5.11",
          sourceRef: "5.11",
          description: "Após a submissão, a solicitação é encaminhada à equipe MDG. Registrar que o status atual é 'Solicitação enviada' e aguardar a confirmação por e-mail da equipe MDG informando que a correção/ extensão foi realizada. Prazo de confirmação da equipe MDG: Registrar que a solicitação foi enviada e aguardar a confirmação por e-mail da equipe MDG.",
          classification: "MS"
        },
      ]
    },
    {
      id: "step_06",
      sourceStep: "6",
      number: "06",
      title: "Trading Contract creation (WB21) e Verificação (WB23) Operational procedure para criar um Trading Contract usando WB21 (criação) e verificar via",
      description: "Operational procedure para criar um Trading Contract usando WB21 (criação) e verificar via WB23 (exibição). Inclui preparação de informações, preenchimento de dados organizacionais, atualização da overview, entrada de itens, gravação do contrato e visualização posterior.",
      classification: "ME",
      classifications: ["ME", "MS"],
      macroBlockId: "execution",
      macroBlockName: "Execution",
      capabilityId: "cap-auto",
      capabilityName: "Automation Capability",
      solutionId: "sol-rpa-upload-vim",
      solutionIds: ["sol-rpa-upload-vim"],
      technologyType: "RPA",
      rationale: "A criação do Trading Contract segue campos estruturados, mas depende de anexos, regras organizacionais e conferência no WB23.",
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
        description: "`review_required` — revisão humana permanece necessária para dados, exceções, aprovações e/ou transações financeiras."
      },
      substeps: [
        {
          id: "step_06_6.1",
          sourceRef: "6.1",
          description: "Receber e validar o e‑mail que serve de base para a criação do Trading Contract e confirmar presença dos anexos necessários. Documento e anexo obrigatórios: E‑mail de solicitação deve conter o anexo Excel com o mapeamento Sales Organization por Company Code e/ou indicação explícita de Division. Sem esse anexo não prosseguir para a criação.",
          classification: "MS"
        },
        {
          id: "step_06_6.1.1",
          sourceRef: "6.1.1",
          description: "Abrir o e‑mail recebido que solicita criação do Trading Contract e identificar: o número do fornecedor, material solicitado (se aplicável), estratégia/strategy code, datas de validação/pricing date, moeda, item number e qualquer referência a divisão ou organização de vendas.",
          classification: "MS"
        },
        {
          id: "step_06_6.1.2",
          sourceRef: "6.1.2",
          description: "Confirmar se o e‑mail contém o anexo Excel com o mapeamento Sales Organization por Company Code e quaisquer instruções de classificação de divisão. Se o anexo estiver presente, salvar localmente para consulta durante a entrada de dados.",
          classification: "MS"
        },
        {
          id: "step_06_6.2",
          sourceRef: "6.2",
          description: "Decidir se o anexo Excel com o mapeamento de Sales Organization e classificações de divisão foi recebido e é utilizável.",
          classification: "MS"
        },
        {
          id: "step_06_6.3",
          sourceRef: "6.3",
          description: "Quando o Excel ou indicação de divisão/organization não estiver presente ou não estiver legível, solicitar esclarecimentos antes de prosseguir. Ação quando Excel ausente: Condição: Anexo Excel ausente ou ilegível no e‑mail de solicitação.. Ações: Responder ao solicitante pedindo o anexo Excel com o mapeamento Sales Organization e/ou indicação de Division.; Aguardar retorno antes de iniciar a criação do Trading Contract.. Resultado: 6.1 · Receber e validar o e‑mail que serve de base para a criação do Trading Contract e confirmar presença dos anexos necessários.",
          classification: "MS"
        },
        {
          id: "step_06_6.3.1",
          sourceRef: "6.3.1",
          description: "Responder ao e‑mail do solicitante solicitando o anexo Excel com o mapeamento Sales Organization por Company Code e/ou a indicação explícita da Division a ser usada. Informar que não será iniciado o cadastro sem essas informações.",
          classification: "MS"
        },
        {
          id: "step_06_6.4",
          sourceRef: "6.4",
          description: "Acessar o SAP GUI e entrar no t-code WB21 para iniciar a criação do Trading Contract.",
          classification: "ME"
        },
        {
          id: "step_06_6.4.1",
          sourceRef: "6.4.1",
          description: "No SAP GUI, executar o T‑Code 'WB21'. Aguardar a tela de criação do Trading Contract carregar.",
          classification: "ME"
        },
        {
          id: "step_06_6.4.2",
          sourceRef: "6.4.2",
          description: "Na tela de criação, no campo 'Contract Type' selecionar 'ZN03' (especificado para despesas non‑trip).",
          classification: "ME"
        },
        {
          id: "step_06_6.4.3",
          sourceRef: "6.4.3",
          description: "Clicar no ícone retangular branco indicado para acessar os campos de Organizational Data (dados organizacionais) e preparar para preenchimento dos campos obrigatórios.",
          classification: "ME"
        },
        {
          id: "step_06_6.5",
          sourceRef: "6.5",
          description: "Preencher os campos organizacionais necessários conforme o anexo Excel e as regras conhecidas: Sales Organization, Distribution Channel, Division, Purchasing Organization e Purchasing Group. Preenchimento de Organizational Data: Sales Organization deve ser preenchida conforme o anexo Excel; Distribution Channel = DR; Purchasing Organization = 0111; Purchasing Group = H20. Confirmação da Division: A Division (50 ou 52) deverá ser tomada exclusivamente da indicação no e‑mail ou no Excel. Não decidir por suposição.",
          classification: "MS"
        },
        {
          id: "step_06_6.5.1",
          sourceRef: "6.5.1",
          description: "No campo Sales Organization, inserir o valor identificado no anexo Excel por Company Code. Se o Excel não contiver o mapeamento, não prosseguir e acionar o passo de solicitação de informação.",
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
          description: "Determinar se a Division a ser usada é 50 ou 52 com base nas instruções do solicitante ou do Excel.",
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
          description: "Após preencher os dados organizacionais, clicar na pequena caixa ao lado do ícone Enter (conforme indicado) para confirmar os dados e voltar à tela principal de criação.",
          classification: "ME"
        },
        {
          id: "step_06_6.6",
          sourceRef: "6.6",
          description: "Quando a Division não estiver especificada no e‑mail ou no Excel, solicitar ao solicitante qual Division (50 ou 52) aplicar. Ação quando Division não especificada: Condição: Division (50/52) não especificada no e‑mail nem no Excel.. Ações: Responder ao solicitante solicitando indicação explícita da Division (50 ou 52).; Aguardar a resposta antes de prosseguir com o preenchimento e gravação do contrato.. Resultado: 6.5 · Preencher os campos organizacionais necessários conforme o anexo Excel e as regras conhecidas: Sales Organization, Distribution Channel, Division, Purchasing Organization e Purchasing Group.",
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
          description: "Preencher os campos na aba Overview e demais abas solicitadas: vendor number, validation period, pricing date, currency; inserir itens e salvar o Trading Contract. Campos obrigatórios na Overview: Antes de salvar, verificar presença de Vendor Number, Validation Period, Pricing Date, Currency, Item Number e Strategy Code. Ação quando campos obrigatórios ausentes: Condição: Algum campo obrigatório listado em ctl-mandatory-fields estiver vazio ou inconsistente.. Ações: Não salvar o contrato.; Retornar ao solicitante pedindo as informações faltantes e anotar no registro de solicitação.. Resultado: 6.7 · Preencher os campos na aba Overview e demais abas solicitadas: vendor number, validation period, pricing date, currency; inserir itens e salvar o Trading Contract.",
          classification: "MS"
        },
        {
          id: "step_06_6.7.1",
          sourceRef: "6.7.1",
          description: "Acessar a aba 'Overview' e preencher: Vendor Number (conforme e‑mail), Validation Period, Pricing Date, Currency. Verificar coerência com o pedido.",
          classification: "ME"
        },
        {
          id: "step_06_6.7.2",
          sourceRef: "6.7.2",
          description: "Na área de itens, inserir Item Number, Material (conforme e‑mail), Valuation, Plant, Purchase Date Category e Purchase Requisition. Após inserir os valores, pressionar Enter para validar o item.",
          classification: "ME"
        },
        {
          id: "step_06_6.7.3",
          sourceRef: "6.7.3",
          description: "Abrir a seção 'Customer data' e atualizar o campo Strategy Code conforme indicado no e‑mail ou no anexo Excel.",
          classification: "ME"
        },
        {
          id: "step_06_6.7.4",
          sourceRef: "6.7.4",
          description: "Revisar todos os campos preenchidos; se os campos obrigatórios estiverem completos, clicar em Save para gerar o Trading Contract. Anotar o número do Trading Contract exibido após a gravação.",
          classification: "ME"
        },
        {
          id: "step_06_6.8",
          sourceRef: "6.8",
          description: "Após a criação, usar o T‑Code WB23 para pesquisar e visualizar os detalhes do Trading Contract recém‑criado.",
          classification: "ME"
        },
        {
          id: "step_06_6.8.1",
          sourceRef: "6.8.1",
          description: "No SAP GUI, executar o T‑Code 'WB23 - Trading Contract: Display'.",
          classification: "ME"
        },
        {
          id: "step_06_6.8.2",
          sourceRef: "6.8.2",
          description: "Na tela de exibição, digitar o número do Trading Contract gerado (anotado no passo de gravação) e confirmar para visualizar os detalhes completos do contrato.",
          classification: "ME"
        },
        {
          id: "step_06_6.8.3",
          sourceRef: "6.8.3",
          description: "Verificar que o Profit Centre, Strategy Code, Sales Organization, Distribution Channel (DR), Division, Purchasing Organization (0111) e Purchasing Group (H20) estão corretos conforme solicitação. Registrar qualquer divergência. Verificação final do contrato exibido: Confirmar que Profit Centre, Strategy Code, Sales Organization, Distribution Channel (DR), Division, Purchasing Organization (0111) e Purchasing Group (H20) correspondem ao solicitado.",
          classification: "MA"
        },
      ]
    },
    {
      id: "step_07",
      sourceStep: "7",
      number: "07",
      title: "Invoice Processing Transportation & Terminal — locate VBDs e associar/acertar valores Executar a sequência completa para localizar, filtrar,",
      description: "Executar a sequência completa para localizar, filtrar, extrair documentos VBD (Accrual/Receivable) e associá‑los à fatura de Transportation & Terminal, ajustar valores quando necessário, simular regras e publicar via VIM/ZEWB conforme os dados da fatura.",
      classification: "MS",
      classifications: ["MS", "MA"],
      macroBlockId: "execution",
      macroBlockName: "Execution",
      capabilityId: "cap-auto",
      capabilityName: "Automation Capability",
      solutionId: "sol-ia-matching",
      solutionIds: ["sol-ia-matching"],
      technologyType: "AI / Agent",
      rationale: "A localização e reconciliação de VBDs exige comparar dados de fatura e registros; IA pode apoiar o matching, sempre com revisão humana.",
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
        description: "`review_required` — revisão humana permanece necessária para dados, exceções, aprovações e/ou transações financeiras."
      },
      substeps: [
        {
          id: "step_07_7.1",
          sourceRef: "7.1",
          description: "Confirmar os dados principais da fatura no portal/VIM antes de iniciar a associação de VBDs e abrir o ambiente ZEWB para buscar VBDs. Verificação obrigatória dos campos do cabeçalho: Os campos VENDOR NUMBER, VENDOR NAME, BANK ACCOUNT, BANK NUMBER, REFERENCE NUMBER, DOCUMENT DATE e GROSS AMOUNT devem estar presentes e corresponder à fatura recebida antes de iniciar a associação de VBDs. Acesso ao ZEWB (T-code ZEWB): A navegação para Processing Invoice → ZEWB deve ser realizada e a tela de Accrual/Receivable VBD Docs deve estar acessível antes de inserir parâmetros.",
          classification: "MA"
        },
        {
          id: "step_07_7.1.1",
          sourceRef: "7.1.1",
          description: "No ecrã da fatura (Terminal Invoice) verifique visualmente e confirme que os seguintes campos correspondem ao documento físico/arquivo recebido: VENDOR NUMBER, VENDOR NAME, BANK ACCOUNT, BANK NUMBER, REFERENCE NUMBER, DOCUMENT DATE e GROSS AMOUNT. Se algum campo estiver incorreto, registre a discrepância conforme política local antes de prosseguir.",
          classification: "MA"
        },
        {
          id: "step_07_7.1.2",
          sourceRef: "7.1.2",
          description: "No sistema, abra uma New GUI Window; selecione Processing Invoice → ZEWB (Custom Trading Expenses Workbench) para iniciar a busca/associação de VBDs. Acesso ao ZEWB (T-code ZEWB): A navegação para Processing Invoice → ZEWB deve ser realizada e a tela de Accrual/Receivable VBD Docs deve estar acessível antes de inserir parâmetros.",
          classification: "ME"
        },
        {
          id: "step_07_7.1.3",
          sourceRef: "7.1.3",
          description: "Dentro do ZEWB: selecione o tipo de documento Accrual / Receivable VBD Docs; informe o VBD Vendor Number e o Transaction Date; marque 'X' em Document Settled; e clique em Execute para carregar a lista de VBDs disponíveis.",
          classification: "ME"
        },
        {
          id: "step_07_7.2",
          sourceRef: "7.2",
          description: "A partir do resultado Execute no ZEWB, revisar a lista completa (Whole Number of VBD’s Expenses List) e identificar os registros relativos à planta/plan location indicada na fatura.",
          classification: "ME"
        },
        {
          id: "step_07_7.2.1",
          sourceRef: "7.2.1",
          description: "Percorra a lista retornada pelo Execute e identifique o campo que representa a Plant/Plan Location; localize quais linhas correspondem à planta indicada na fatura.",
          classification: "MA"
        },
        {
          id: "step_07_7.3",
          sourceRef: "7.3",
          description: "Filtrar os resultados por Plant Name e, em seguida, aplicar filtro adicional para localizar a Invoice Name específica extraída da fatura.",
          classification: "ME"
        },
        {
          id: "step_07_7.3.1",
          sourceRef: "7.3.1",
          description: "No grid de resultados do ZEWB selecione a coluna Plant Name; clique em Set Filter e escolha a planta correspondente à fatura.",
          classification: "MA"
        },
        {
          id: "step_07_7.3.2",
          sourceRef: "7.3.2",
          description: "No filtro recém-aberto, insira o valor Invoice Name (conforme a fatura) e selecione a(s) linha(s) que correspondem ao nome da invoice para restringir os registros.",
          classification: "MA"
        },
        {
          id: "step_07_7.4",
          sourceRef: "7.4",
          description: "Filtrar os resultados por Cost Type (ex.: Throughout Fee) e executar a extração dos dados filtrados para planilha Excel para cálculos posteriores.",
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
          description: "Após a execução do filtro, utilize a opção de exportar/download do ZEWB para extrair os dados em formato Excel (Selecting the Excel Format / Downloading the file). Salve o arquivo localmente para análise.",
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
          description: "Abra o arquivo Excel, aplique filtro na coluna Cost Type para 'Throughout Fee'; selecione a coluna Quantity e calcule a soma total (total_Throughout). Em seguida, divida total_Throughout por 42 e registre o resultado para uso na associação ao VBD.",
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
          description: "No Excel filtre por 'Dye Fee', totalize a Quantity, divida por 42 e extraia os Document Numbers que correspondem às linhas filtradas para uso na associação aos VBDs.",
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
          description: "Ainda no arquivo Excel copie os Document Numbers das linhas filtradas (por Throughout/Lubricity/Dye conforme aplicável) para posterior inserção no campo Accrual VBD do ZEWB.",
          classification: "ME"
        },
        {
          id: "step_07_7.7",
          sourceRef: "7.7",
          description: "Totalize a coluna Quantity (se ainda não feito) e consolide a lista de Document Numbers que serão utilizados para puxar os VBDs no ZEWB.",
          classification: "ME"
        },
        {
          id: "step_07_7.7.1",
          sourceRef: "7.7.1",
          description: "No Excel some a coluna Quantity para obter os totais por cost type; confirme os valores que serão comparados com os Net values trazidos dos VBDs.",
          classification: "ME"
        },
        {
          id: "step_07_7.7.2",
          sourceRef: "7.7.2",
          description: "Consolide e copie a lista de Document Numbers (um por linha ou separados conforme formato aceito pelo ZEWB) para uso no próximo passo do ZEWB.",
          classification: "ME"
        },
        {
          id: "step_07_7.8",
          sourceRef: "7.8",
          description: "No ZEWB confirmar se Tax Number e Vendor Number foram auto-populados; em seguida abrir o filtro do Accrual VBD e preparar para inserir os números coletados.",
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
          description: "Clique em Filter no campo Accrual VBD para preparar a inserção dos Document Numbers/paste dos VBDs.",
          classification: "ME"
        },
        {
          id: "step_07_7.9",
          sourceRef: "7.9",
          description: "Colar os VBD numbers no campo de Line Item, executar a carga dos VBDs, somar os Net values e, caso não bata com o valor da fatura, realizar Overwrite e ajustar os valores de cost types (Throughout, Lubricant, Dye) até que o check status fique verde. Validação dos VBDs colados no Line Item: Os Document Numbers colados no campo Line Item devem ser exclusivamente Accrual/Receivable VBDs correspondentes à planta e invoice selecionadas; confirme que cada número corresponde a um registro legítimo retornado pelo ZEWB.",
          classification: "MA"
        },
        {
          id: "step_07_7.9.1",
          sourceRef: "7.9.1",
          description: "No campo Line Item do ZEWB cole a lista de Accrual VBD Document Numbers preparados. Verifique que cada número corresponde a um Accrual/Receivable VBD. Validação dos VBDs colados no Line Item: Os Document Numbers colados no campo Line Item devem ser exclusivamente Accrual/Receivable VBDs correspondentes à planta e invoice selecionadas; confirme que cada número corresponde a um registro legítimo retornado pelo ZEWB.",
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
          description: "Some os Net values exibidos para os VBDs carregados e compare com o Gross/Net da fatura. Se os valores coincidirem, prossiga; se não coincidirem, executar Overwrite conforme passo seguinte.",
          classification: "MA"
        },
        {
          id: "step_07_7.9.4",
          sourceRef: "7.9.4",
          description: "Se os valores não coincidirem: selecione todos os detalhes a serem alterados e clique em Overwrite of VBD’S; altere os valores para os cost types Throughout Fee, Lubricant Fee e Dye Fee conforme necessário para que o total dos VBDs coincida com o valor da fatura. Após cada alteração, confirme a atualização e verifique o Check Status até que fique Green.",
          classification: "ME"
        },
        {
          id: "step_07_7.10",
          sourceRef: "7.10",
          description: "Definir Payment Term manualmente, marcar as Due Dates, revisar Basic Data versus a fatura, acionar Simulate Rules; caso a simulação não apresente erros, postar a transação no portal VIM. Ação ao encontrar erro na Simulação de Regras: Condição: A simulação (Simulate Rules) retorna erro(s) impedindo a postagem.. Ações: Rever campo(s) destacado(s) na aba Basic Data e comparar com os dados da fatura.; Corrigir discrepâncias de valores, contas ou datas diretamente no ZEWB onde permitido.; Retornar para o passo de Overwrite (step-65) se os VBDs ou valores necessitarem de ajuste e reexecutar a carga.. Resultado: 7.9 · Colar os VBD numbers no campo de Line Item, executar a carga dos VBDs, somar os Net values e, caso não bata com o valor da fatura, realizar Overwrite e ajustar os valores de cost types (Throughout, Lubricant, Dye) até que o check status fique verde.",
          classification: "MA"
        },
        {
          id: "step_07_7.10.1",
          sourceRef: "7.10.1",
          description: "No ZEWB selecione a opção de entrada manual de Payment Term e preencha as Due Dates conforme instruções da fatura/política de pagamento.",
          classification: "ME"
        },
        {
          id: "step_07_7.10.2",
          sourceRef: "7.10.2",
          description: "Na aba Basic Data compare todos os campos (valores, contas, centro de custo se aplicável) com os dados da fatura. Clique em Simulate Rules e aguarde o resultado da simulação. Ação ao encontrar erro na Simulação de Regras: Condição: A simulação (Simulate Rules) retorna erro(s) impedindo a postagem.. Ações: Rever campo(s) destacado(s) na aba Basic Data e comparar com os dados da fatura.; Corrigir discrepâncias de valores, contas ou datas diretamente no ZEWB onde permitido.; Retornar para o passo de Overwrite (step-65) se os VBDs ou valores necessitarem de ajuste e reexecutar a carga.. Resultado: 7.9 · Colar os VBD numbers no campo de Line Item, executar a carga dos VBDs, somar os Net values e, caso não bata com o valor da fatura, realizar Overwrite e ajustar os valores de cost types (Throughout, Lubricant, Dye) até que o check status fique verde.",
          classification: "MA"
        },
        {
          id: "step_07_7.10.3",
          sourceRef: "7.10.3",
          description: "Se a simulação indicar que não há erro (status OK), clique para postar a fatura no VIM portal. A postagem finaliza o processamento desta fatura na ferramenta ZEWB/VIM.",
          classification: "ME"
        },
        {
          id: "step_07_7.11",
          sourceRef: "7.11",
          description: "Após a postagem, confirmar que a fatura foi publicada e verificar o line item correspondente no Vendor Portal, acessando o registro via Vendor Account Number.",
          classification: "MA"
        },
        {
          id: "step_07_7.11.1",
          sourceRef: "7.11.1",
          description: "Verifique no ZEWB/VIM que a operação retornou confirmação de postagem (Posted). Registre o ID de documento gerado, se disponível.",
          classification: "ME"
        },
        {
          id: "step_07_7.11.2",
          sourceRef: "7.11.2",
          description: "No Vendor Portal abra a conta do fornecedor (inserir Vendor Account Number) e localize o line item recém-postado para confirmar valores, datas e referências.",
          classification: "ME"
        },
        {
          id: "step_07_7.12",
          sourceRef: "7.12",
          description: "Confirmar que todas as invoices do lote/processo foram postadas. Registrar conclusão do processo para o lote atual e encerrar a sessão ZEWB.",
          classification: "ME"
        },
        {
          id: "step_07_7.12.1",
          sourceRef: "7.12.1",
          description: "Verifique a lista de open invoices no VIM Workplace para confirmar que as faturas tratadas foram movidas para Posted; salve logs ou capturas necessárias e encerre a New GUI Window do ZEWB.",
          classification: "ME"
        },
      ]
    },
    {
      id: "step_08",
      sourceStep: "8",
      number: "08",
      title: "Invoice Process de Pipeline — Tarifa de Pipeline Operational sequence para validar, locate VBDs, reconcile values e apply rules for invoi",
      description: "Operational sequence para validar, locate VBDs, reconcile values e apply rules for invoiras de Pipeline Tariff usando VIM Workplace e buscas relacionadas.",
      classification: "MS",
      classifications: ["MS", "MA"],
      macroBlockId: "execution",
      macroBlockName: "Execution",
      capabilityId: "cap-auto",
      capabilityName: "Automation Capability",
      solutionId: "sol-ia-matching",
      solutionIds: ["sol-ia-matching"],
      technologyType: "AI / Agent",
      rationale: "A reconciliação de tarifa e valores exige análise de correspondência e tolerância; um agente pode priorizar candidatos, não confirmar sozinho a postagem.",
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
        description: "`review_required` — revisão humana permanece necessária para dados, exceções, aprovações e/ou transações financeiras."
      },
      substeps: [
        {
          id: "step_08_8.1",
          sourceRef: "8.1",
          description: "Validar os campos obrigatórios exibidos na ficha da fatura no VIM Workplace antes de avançar. Validação dos campos obrigatórios da fatura: Confirmar presença e correspondência dos campos VENDOR NUMBER, VENDOR NAME, BANK ACCOUNT, BANK NUMBER, REFERENCE NUMBER, DOCUMENT DATE e GROSS AMOUNT antes de qualquer associação de VBD.",
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
          description: "Mudar a visualização para Team View para acessar ações de manipulação de VBD associadas à equipe.",
          classification: "ME"
        },
        {
          id: "step_08_8.2.1",
          sourceRef: "8.2.1",
          description: "No VIM Workplace, clicar em 'Switch view' e selecionar 'Team view'. Confirmar que a tela apresenta campos e botões referentes ao trabalho em equipe (buscas VBD, Overwrite etc.).",
          classification: "ME"
        },
        {
          id: "step_08_8.3",
          sourceRef: "8.3",
          description: "Navegar até Other Data e iniciar a pesquisa por Accrual VBDs relacionados à fatura.",
          classification: "ME"
        },
        {
          id: "step_08_8.3.1",
          sourceRef: "8.3.1",
          description: "Na visualização da fatura (Team view), abrir a aba ou seção 'Other data' onde está a opção 'Search Accrual VBD'.",
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
          description: "Avaliar se a pesquisa por Accrual VBD retornou registros relacionados. Verificar My Tickets em FIORI quando não houver VBDs: Se a busca por Accrual VBD não retornar resultados, pesquisar em FIORI > My Tickets usando External Number (BOL) e/ou Actual Quantity conforme nota do procedimento.",
          classification: "MS"
        },
        {
          id: "step_08_8.6",
          sourceRef: "8.6",
          description: "Se a busca por Accrual VBD não retornar resultados, pesquisar em FIORI > My Tickets usando critérios alternativos indicados. Verificar My Tickets em FIORI quando não houver VBDs: Se a busca por Accrual VBD não retornar resultados, pesquisar em FIORI > My Tickets usando External Number (BOL) e/ou Actual Quantity conforme nota do procedimento.",
          classification: "ME"
        },
        {
          id: "step_08_8.6.1",
          sourceRef: "8.6.1",
          description: "Abrir a aplicação FIORI e selecionar 'My Tickets'.",
          classification: "ME"
        },
        {
          id: "step_08_8.6.2",
          sourceRef: "8.6.2",
          description: "Na tela 'My Tickets' usar os filtros: pesquisar pelo número BOL no campo 'External Number' e/ou pela quantidade no campo 'Actual Quantity'.",
          classification: "ME"
        },
        {
          id: "step_08_8.6.3",
          sourceRef: "8.6.3",
          description: "Se a pesquisa em My Tickets retornar registros que correspondem à fatura (BOL/quantidade), anotar os identificadores VBD pertinentes para posterior associação na tela 'Search Accrual VBD'. Em seguida, voltar para a tela de Accrual VBD da fatura e executar a busca novamente usando os dados localizados.",
          classification: "MA"
        },
        {
          id: "step_08_8.7",
          sourceRef: "8.7",
          description: "Na lista de VBDs retornada escolha o item com a descrição aplicável (por exemplo JET A), comparar o valor do VBD com o valor bruto da fatura e preparar para sobrescrever VBDs se os valores coincidirem.",
          classification: "MA"
        },
        {
          id: "step_08_8.7.1",
          sourceRef: "8.7.1",
          description: "Identificar e selecionar na listagem o VBD cuja descrição corresponda ao produto (ex.: 'JET A').",
          classification: "MA"
        },
        {
          id: "step_08_8.7.2",
          sourceRef: "8.7.2",
          description: "Comparar o valor do VBD selecionado com o campo GROSS AMOUNT da fatura. Confirmar se os dois montantes são idênticos.",
          classification: "MA"
        },
        {
          id: "step_08_8.7.3",
          sourceRef: "8.7.3",
          description: "Se os montantes coincidirem, clicar em 'Overwrite VBD’S' para associar o VBD à fatura conforme a seleção.",
          classification: "ME"
        },
        {
          id: "step_08_8.8",
          sourceRef: "8.8",
          description: "Verificar que, após sobrescrever o(s) VBD(s), o balance entre fatura e VBD é zero e então salvar as alterações. Validação dos campos obrigatórios da fatura: Confirmar presença e correspondência dos campos VENDOR NUMBER, VENDOR NAME, BANK ACCOUNT, BANK NUMBER, REFERENCE NUMBER, DOCUMENT DATE e GROSS AMOUNT antes de qualquer associação de VBD.",
          classification: "MA"
        },
        {
          id: "step_08_8.8.1",
          sourceRef: "8.8.1",
          description: "Na tela de associação, confirmar que a diferença entre o TOTAL do(s) VBD(s) e o GROSS AMOUNT da fatura é ZERO.",
          classification: "ME"
        },
        {
          id: "step_08_8.8.2",
          sourceRef: "8.8.2",
          description: "Se o balance for zero, clicar em 'Save' para persistir a associação VBD ↔ fatura.",
          classification: "ME"
        },
        {
          id: "step_08_8.9",
          sourceRef: "8.9",
          description: "Informar na fatura os campos adicionais requeridos antes da simulação de regras: Reference Number, Vendor Number (se necessário repetir) e Payment Terms.",
          classification: "ME"
        },
        {
          id: "step_08_8.9.1",
          sourceRef: "8.9.1",
          description: "No campo 'Reference Number' da fatura, preencher o valor conforme a documentação/nota fiscal.",
          classification: "ME"
        },
        {
          id: "step_08_8.9.2",
          sourceRef: "8.9.2",
          description: "Confirmar que o 'Vendor Number' está preenchido corretamente; se estiver vazio ou incorreto, inserir o Vendor Number correto.",
          classification: "ME"
        },
        {
          id: "step_08_8.9.3",
          sourceRef: "8.9.3",
          description: "Selecionar ou definir os 'Payment Terms' apropriados conforme política ou conforme indicado na fatura.",
          classification: "ME"
        },
        {
          id: "step_08_8.10",
          sourceRef: "8.10",
          description: "Executar 'Simulate rules' e, somente se não houver erros na simulação, aplicar as regras resultantes. Simulação obrigatória antes de apply rules: Executar 'Simulate rules' e confirmar que não há erros na simulação antes de clicar em 'Apply rules'.",
          classification: "ME"
        },
        {
          id: "step_08_8.10.1",
          sourceRef: "8.10.1",
          description: "Na tela da fatura, clicar em 'Simulate rules' para que o sistema verifique e gere as propostas de contabilização/aplicação de regras.",
          classification: "ME"
        },
        {
          id: "step_08_8.10.2",
          sourceRef: "8.10.2",
          description: "Analisar o painel de resultados da simulação. Confirmar ausência de erros antes de prosseguir para aplicar as regras.",
          classification: "MA"
        },
        {
          id: "step_08_8.10.3",
          sourceRef: "8.10.3",
          description: "Se a simulação não apresentar erros, clicar em 'Apply rules' para aplicar a contabilização e demais tratamentos automáticos.",
          classification: "ME"
        },
      ]
    },
    {
      id: "step_09",
      sourceStep: "9",
      number: "09",
      title: "Process de Débito Gain/Loss (Pipeline Gain/Loss) — Extração NK e criação/associação manual de VBD Executable sequence para validar a fatura Gain/Los",
      description: "Executable sequence para validar a fatura Gain/Loss no VIM, extrair Nomination Key (NK) via SAP Fiori, selecionar o NK adequado (maior quantidade atualizada), criar VBD manual no ZEWB e associar/compensar a fatura via campo de Accrual VBD no VIM até saldo zero.",
      classification: "ME",
      classifications: ["ME", "MS"],
      macroBlockId: "execution",
      macroBlockName: "Execution",
      capabilityId: "cap-auto",
      capabilityName: "Automation Capability",
      solutionId: "sol-rpa-upload-vim",
      solutionIds: ["sol-rpa-upload-vim"],
      technologyType: "RPA",
      rationale: "A extração de NK e criação de VBD têm passos repetitivos, mas a seleção e associação dependem de dados do caso.",
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
        description: "`review_required` — revisão humana permanece necessária para dados, exceções, aprovações e/ou transações financeiras."
      },
      substeps: [
        {
          id: "step_09_9.1",
          sourceRef: "9.1",
          description: "1) Acesse o VIM Workplace e localize a fatura identificada como Gain/Loss pelo campo de descrição. 2) Verifique os campos SAP na fatura: VENDOR NUMBER, VENDOR NAME, BANK ACCOUNT, BANK NUMBER, REFERENCE NUMBER, DOCUMENT DATE e GROSS AMOUNT. 3) Confirme que os valores da fatura batem com os documentos recebidos (anexo ou imagem da fatura). Verificação obrigatória dos campos SAP na fatura: Confirmar VENDOR NUMBER, VENDOR NAME, BANK ACCOUNT, BANK NUMBER, REFERENCE NUMBER, DOCUMENT DATE e GROSS AMOUNT antes de prosseguir com extração de NK e criação de VBD.",
          classification: "ME"
        },
        {
          id: "step_09_9.2",
          sourceRef: "9.2",
          description: "1) Abra a aplicação SAP Fiori apropriada para Nominations. 2) Navegue até a opção 'My Nomination' (ou equivalente na sua Fiori) conforme o layout padrão.",
          classification: "ME"
        },
        {
          id: "step_09_9.3",
          sourceRef: "9.3",
          description: "1) Ao carregar 'My Nomination', confirme que a tela abriu com o layout padrão. 2) Prepare-se para aplicar filtros por sistema de transporte e período de scheduled date (próximo passo).",
          classification: "ME"
        },
        {
          id: "step_09_9.4",
          sourceRef: "9.4",
          description: "1) No painel de filtros, selecione o campo de Transport System e insira o(s) transport system(s) relevantes para a fatura Gain/Loss. 2) Insira a Scheduled Date correspondente ao período da fatura (Invoice period). 3) Clique no botão 'GO' para executar a procura e carregar as linhas de nomination relacionadas ao período e transport system informados.",
          classification: "MA"
        },
        {
          id: "step_09_9.5",
          sourceRef: "9.5",
          description: "1) Abra a opção de Table Personalization na lista de nominations retornada. 2) Selecione as colunas necessárias para análise: Nomination Key, Ticket Status, Actual Quantity, Schedule Type e quaisquer outras colunas de interesse. 3) Confirme (OK) e exporte o resultado para arquivo Excel usando a função de exportação da Fiori.",
          classification: "ME"
        },
        {
          id: "step_09_9.6",
          sourceRef: "9.6",
          description: "1) No Excel exportado (ou na própria Fiori, se preferir), aplique filtro na coluna Ticket Status para manter apenas linhas com status 'actualized'.",
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
          description: "1) Na coluna Actual Quantity, ordene os valores do maior para o menor. 2) Identifique a Nomination Key correspondente à maior Actual Quantity filtrada — este NK será utilizado para alocar o valor da fatura.",
          classification: "MA"
        },
        {
          id: "step_09_9.9",
          sourceRef: "9.9",
          description: "1) Copie ou anote a Nomination Key escolhida (maior Actual Quantity). 2) Abra o SAP T-code ZEWB — Custom Trading Expense Workbench para iniciar a criação manual do VBD (debito).",
          classification: "ME"
        },
        {
          id: "step_09_9.10",
          sourceRef: "9.10",
          description: "1) No ZEWB, no formulário de criação, insira a Nomination Key no campo correspondente e adicione os items da nomination conforme necessário (nomination key items). 2) Selecione a linha apropriada que representa o item a ser debitado e clique em 'Create Expense' para iniciar a criação do lançamento de despesa/VBD.",
          classification: "MA"
        },
        {
          id: "step_09_9.11",
          sourceRef: "9.11",
          description: "1) No formulário de Expense, preencha os campos conforme abaixo: - Expense Class: F25 (Pipeline Gain/Loss) - Account: A (Inventory Account) - Accrual/Type: 3 (Accrual) - Vendor Code: informe o código do fornecedor conforme fatura - Posting Date: data corrente (hoje) - Net Amount: valor líquido tomado da fatura - Reference: referência conforme consta na fatura",
          classification: "ME"
        },
        {
          id: "step_09_9.12",
          sourceRef: "9.12",
          description: "1) Após preencher todos os campos, selecione 'Save' para gerar o documento VBD. 2) Copie o número do documento VBD gerado (document number) para uso posterior na associação no VIM.",
          classification: "ME"
        },
        {
          id: "step_09_9.13",
          sourceRef: "9.13",
          description: "1) No VIM Workplace, abra a seção 'Other Data' e utilize a função 'Search accrual VBD'. 2) Cole o número do documento VBD copiado no campo de busca e execute a pesquisa para identificar a VBD criada e suas linhas associadas.",
          classification: "ME"
        },
        {
          id: "step_09_9.14",
          sourceRef: "9.14",
          description: "1) No painel de resultados da busca Accrual VBD, verifique as linhas exibidas. 2) Selecione a Accrual VBD encontrada e insira o número no campo 'Accrual VBD number' e clique em 'Execute' para carregar os items que podem ser associados à fatura.",
          classification: "ME"
        },
        {
          id: "step_09_9.15",
          sourceRef: "9.15",
          description: "Definir se as linhas da VBD devem ser acrescentadas ou substituídas antes de exibir e salvar a associação.",
          classification: "ME"
        },
        {
          id: "step_09_9.16",
          sourceRef: "9.16",
          description: "1) Clique em 'Append' para acrescentar as linhas da VBD ao conjunto atual apresentado na tela. 2) Revise os line items exibidos após o Append: verifique quantias, contas e taxa de câmbio (se aplicável) para assegurar que os valores a acrescentar correspondem ao valor da fatura. 3) Confirme a seleção local das linhas que serão efetivamente aplicadas contra a fatura. 4) Após revisão, proceda para salvar (próximo passo comum).",
          classification: "MA"
        },
        {
          id: "step_09_9.17",
          sourceRef: "9.17",
          description: "1) Clique em 'Overwrite' para substituir as linhas atualmente apresentadas na tela pelas linhas da VBD selecionada. 2) Revise cuidadosamente as linhas que irão substituir as existentes: confirme contas de compensação, quantias e qualquer diferença que altere o lançamento contábil. 3) Se a substituição for adequada, confirme a intenção de sobrescrever; caso contrário, cancele e retorne à decisão anterior. 4) Após revisão e confirmação, proceda para salvar (próximo passo comum).",
          classification: "ME"
        },
        {
          id: "step_09_9.18",
          sourceRef: "9.18",
          description: "1) Clique em 'Save' para persistir a associação entre a fatura e a VBD (após Append ou Overwrite). 2) Aguarde a confirmação do sistema e verifique a mensagem de sucesso. 3) Confirme que o saldo da fatura ficou zero (balance is zero). 4) Registre o número do VBD associado e quaisquer identificadores de documento de contabilização para rastreio e auditoria.",
          classification: "MS"
        },
      ]
    },
    {
      id: "step_10",
      sourceStep: "10",
      number: "10",
      title: "Process faturas Pipeline Y‑Grade e encargos de transporte: identificação, casamento e criação manual de VBD Executable sequence para identificar a",
      description: "Executable sequence para identificar a fatura Pipeline Y‑Grade ou de transporte no VIM, localizar/obter Nomination Key (NK) via Fiori, reconciliar VBDs com a fatura, criar VBD manual (ZEWB) quando necessário e finalizar o casamento e verificação das regras antes da postagem.",
      classification: "MS",
      classifications: ["MS", "MA"],
      macroBlockId: "execution",
      macroBlockName: "Execution",
      capabilityId: "cap-auto",
      capabilityName: "Automation Capability",
      solutionId: "sol-ia-matching",
      solutionIds: ["sol-ia-matching"],
      technologyType: "AI / Agent",
      rationale: "O casamento de invoices, encargos e VBDs envolve múltiplas fontes e critérios de correspondência; requer validação humana.",
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
        description: "`review_required` — revisão humana permanece necessária para dados, exceções, aprovações e/ou transações financeiras."
      },
      substeps: [
        {
          id: "step_10_10.1",
          sourceRef: "10.1",
          description: "No VIM Workplace, acione o botão \"Simulate rules\" para avaliar o estado do processamento antes de apply rules/postagem. Exceção — Simulate rules (pré-aplicação) sinaliza erro: Condição: Ao acionar 'Simulate rules' qualquer Exception reason apresentar indicação vermelha.. Ações: Limpar a exceção utilizando os procedimentos de clearing de exceções do VIM conforme políticas internas (VIM exception clearing ways).; Corrigir os dados apontados pela exceção (por exemplo, dados do VBD ou campos obrigatórios da fatura) e reaplicar as ações anteriores necessárias.; Após limpeza da exceção, acionar novamente 'Simulate rules' para verificação antes de apply rules.. Resultado: 10.1 · No VIM Workplace, acione o botão \"Simulate rules\" para avaliar o estado do processamento antes de apply rules/postagem.",
          classification: "MS"
        },
        {
          id: "step_10_10.2",
          sourceRef: "10.2",
          description: "Com a fatura aberta no VIM Workplace, confirme os campos SAP essenciais para processamento e casamento com VBD: Controle — validação obrigatória de campos SAP na fatura: Antes de qualquer tentativa de casar VBDs, confirme que os campos VENDOR NUMBER, VENDOR NAME, BANK ACCOUNT, BANK NUMBER, REFERENCE NUMBER, DOCUMENT DATE e GROSS AMOUNT estejam preenchidos e correspondam à documentação da fatura.",
          classification: "MA"
        },
        {
          id: "step_10_10.2.1",
          sourceRef: "10.2.1",
          description: "Verifique explicitamente: VENDOR NUMBER, VENDOR NAME, BANK ACCOUNT, BANK NUMBER, REFERENCE NUMBER, DOCUMENT DATE e GROSS AMOUNT. Registre discrepâncias antes de avançar.",
          classification: "ME"
        },
        {
          id: "step_10_10.3",
          sourceRef: "10.3",
          description: "Abrir o aplicativo Fiori adequado e utilizar a função My Nominations (ou equivalente) para localizar o Nomination Key necessário para criação manual de VBD.",
          classification: "ME"
        },
        {
          id: "step_10_10.3.1",
          sourceRef: "10.3.1",
          description: "No Fiori, pesquisar pelas Nomeações (My Nominations) aplicando filtros conforme disponível para localizar NK que corresponde à fatura.",
          classification: "MA"
        },
        {
          id: "step_10_10.4",
          sourceRef: "10.4",
          description: "No Fiori aplique o filtro do transport system (ex.: Phillips 66) e informe a data programada (scheduled date) do mês correspondente ao período da fatura; executar a pesquisa e, no resultado, selecionar a nomination localizada por Location e escolher o line item apropri (ex.: line item 10) para iniciar o processo de criação do VBD manual.",
          classification: "MA"
        },
        {
          id: "step_10_10.5",
          sourceRef: "10.5",
          description: "Quando a fatura exigir o mesmo procedimento de criação de VBD utilizado no processo Gain/Loss, executar os mesmos passos operacionais (referência interna: passos 13 a 20 do processo Gain/Loss).",
          classification: "ME"
        },
        {
          id: "step_10_10.6",
          sourceRef: "10.6",
          description: "Para faturas classificadas como Transportation (conforme descrição da fatura), abrir a fatura no VIM Workplace e revalidar os dados SAP chave (VENDOR NUMBER, VENDOR NAME, BANK ACCOUNT, BANK NUMBER, REFERENCE NUMBER, DOCUMENT DATE, GROSS AMOUNT) antes da busca por VBDs. Controle — validação obrigatória de campos SAP na fatura: Antes de qualquer tentativa de casar VBDs, confirme que os campos VENDOR NUMBER, VENDOR NAME, BANK ACCOUNT, BANK NUMBER, REFERENCE NUMBER, DOCUMENT DATE e GROSS AMOUNT estejam preenchidos e correspondam à documentação da fatura.",
          classification: "MA"
        },
        {
          id: "step_10_10.7",
          sourceRef: "10.7",
          description: "No VIM, acionar Other data → Search accrual VBD. Informar o período/lift date conforme indicado na fatura (o campo \"period date\" na fatura corresponde ao lift date) e executar a pesquisa para listar VBDs reportados para esse período.",
          classification: "MA"
        },
        {
          id: "step_10_10.8",
          sourceRef: "10.8",
          description: "Com a listagem de VBD aberta, exportar os detalhes (por exemplo, para Excel) para confrontar com os dados da fatura e identificar tickets ou números não casados. Controle — exportar detalhes de VBD para reconciliação: Exportar os detalhes do VBD (incluindo ticket numbers, quantities e location) para uma planilha para confronto com a planilha de tickets da fatura. Preservar os registros exportados para auditoria.",
          classification: "MA"
        },
        {
          id: "step_10_10.9",
          sourceRef: "10.9",
          description: "Quando forem encontrados tickets não casados, abrir o Fiori e usar My Nominations para localizar informações da nomination associada aos tickets não casados para obter NK e demais detalhes necessários para criação do VBD manual.",
          classification: "ME"
        },
        {
          id: "step_10_10.10",
          sourceRef: "10.10",
          description: "Filtrar no Fiori por transport system correspondente e por scheduled date no mês da fatura; executar (Go) e exportar o relatório de nominations para planilha a fim de alinhá-la com a planilha de tickets não casados.",
          classification: "MA"
        },
        {
          id: "step_10_10.11",
          sourceRef: "10.11",
          description: "Alinhar a planilha exportada do Fiori com a planilha de tickets não casados, confrontando Actual Quantity, Location Description e Nomination Number. Se ainda houver tickets sem NK, gerar Dew Ticket em Trade 66 para solicitar ao D2D COE os detalhes dos VBDs não-fired.",
          classification: "MS"
        },
        {
          id: "step_10_10.12",
          sourceRef: "10.12",
          description: "Acessar a transação ZEWB (Custom Trading Expense Workbench) para criar o VBD manualmente. Informar o Nomination Key (NK) e os itens de nomination correspondentes antes de criar a despesa.",
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
          description: "Selecionar o item de nomination identificado e clicar em Create expense. Preencher os campos conforme padrão para Pipeline Tariff/Transportation:",
          classification: "ME"
        },
        {
          id: "step_10_10.13.1",
          sourceRef: "10.13.1",
          description: "Preencher: Expense class = F18 (pipeline tariff), Inventory Account = A, Accrual indicator = 3, Vendor code conforme fatura, Posting date = data atual, Net amount = valor líquido conforme VIM Workplace, Reference = número de referência da fatura.",
          classification: "ME"
        },
        {
          id: "step_10_10.14",
          sourceRef: "10.14",
          description: "Salvar a criação do VBD no ZEWB e copiar o número do documento gerado para uso no casamento da fatura no VIM.",
          classification: "ME"
        },
        {
          id: "step_10_10.15",
          sourceRef: "10.15",
          description: "Retornar ao VIM Workplace → Other data → Search accrual VBD, informar o document number copiado do ZEWB, executar e usar o resultado para casar/associar os line items da fatura.",
          classification: "ME"
        },
        {
          id: "step_10_10.15.1",
          sourceRef: "10.15.1",
          description: "No campo accrual VBD informar o número do documento criado no ZEWB e executar para que o VBD seja exibido para associação com a fatura.",
          classification: "ME"
        },
        {
          id: "step_10_10.16",
          sourceRef: "10.16",
          description: "No VIM, clicar Append/Append VBD para exibir os line items do VBD, salvar a associação; confirmar que o saldo da fatura ficou zero. Em seguida, acionar novamente o botão \"Simulate rules\" e verificar que todas as exceções estejam em estado verde antes de apply rules e prosseguir para postagem. Exceção — Simulate rules após criação/append do VBD: Condição: Após anexar o VBD e salvar, o 'Simulate rules' retornar indicação vermelha em qualquer exceção.. Ações: Executar os procedimentos de clearing de exceções do VIM conforme as práticas documentadas.; Se a exceção estiver relacionada a dados do VBD recém-criado, validar no ZEWB e corrigir os campos (recriar/ajustar VBD se necessário) antes de nova simulação.; Re-simular as regras quando correções realizadas.. Resultado: 10.16 · No VIM, clicar Append/Append VBD para exibir os line items do VBD, salvar a associação; confirmar que o saldo da fatura ficou zero. Em seguida, acionar novamente o botão \"Simulate rules\" e verificar que todas as exceções estejam em estado verde antes de apply rules e prosseguir para postagem.",
          classification: "ME"
        },
      ]
    },
    {
      id: "step_11",
      sourceStep: "11",
      number: "11",
      title: "Invoice Processing de Inspeção — fluxo Auto‑fired VBD Executable sequence para localizar, validar e processar faturas de inspeção que disparam",
      description: "Executable sequence para localizar, validar e processar faturas de inspeção que disparam VBD automaticamente (Auto‑fired VBD) no VIM Workplace (S/4). Inclui verificação de tolerância, sobrescrita/appêndice de VBD, cálculos de linha, simulação de regras e postagem.",
      classification: "SA",
      classifications: ["SA", "MS"],
      macroBlockId: "execution",
      macroBlockName: "Execution",
      capabilityId: "cap-auto",
      capabilityName: "Automation Capability",
      solutionId: "sol-eval-anomaly",
      solutionIds: ["sol-eval-anomaly"],
      technologyType: "Evaluator / Controle",
      rationale: "O fluxo parte de VBD auto-fired, mas exige validação de dados e tratamento de divergências antes da postagem.",
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
        description: "`review_required` — revisão humana permanece necessária para dados, exceções, aprovações e/ou transações financeiras."
      },
      substeps: [
        {
          id: "step_11_11.1",
          sourceRef: "11.1",
          description: "Acessar o sistema SAP e selecionar o ambiente de produção indicado.",
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
          description: "Ao abrir o VIM, alternar a vista para localizar itens da equipe e faturas de inspeção.",
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
          description: "Clicar em 'Switch work view' e selecionar a opção 'Team view' para visualizar itens do time além dos seus diretos.",
          classification: "ME"
        },
        {
          id: "step_11_11.4",
          sourceRef: "11.4",
          description: "Aplicar filtros para isolar faturas de inspeção e abrir a fatura específica para processamento.",
          classification: "ME"
        },
        {
          id: "step_11_11.4.1",
          sourceRef: "11.4.1",
          description: "Usar o filtro disponível na Team View para separar as faturas do tipo inspeção.",
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
          description: "Confirmar correspondência dos principais campos exibidos com os valores da fatura física/arquivo.",
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
          description: "Navegar para a aba 'Other Data' e clicar na aba 'Search VBD' para pesquisar VBDs relacionados à Nomination Key.",
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
          description: "Confirmar que Tax Number e Vendor Number podem ter preenchimento automático; inserir a Nomination Key e clicar em 'Execute (F8)'.",
          classification: "ME"
        },
        {
          id: "step_11_11.6.2",
          sourceRef: "11.6.2",
          description: "Ao executar, observar os VBDs de accrual exibidos para validação posterior.",
          classification: "ME"
        },
        {
          id: "step_11_11.7",
          sourceRef: "11.7",
          description: "Confirmar que o VBD exibido corresponde à fatura (conta do fornecedor, datas, local, status de settle e produto) e avaliar se atende ao limite de tolerância para uso do VBD. Regra de tolerância para uso de VBD: Validar que a diferença entre os valores da invoice e o VBD esteja dentro da tolerância de +/- $5000 antes de aplicar o VBD. Escalar para Scheduler quando excede tolerância: Diferença entre invoice e VBD excede a tolerância de +/- $5000. · Scheduler responsável indicado na invoice (for invoiras crude usar o scheduler fixo: Emmanuella)",
          classification: "MA"
        },
        {
          id: "step_11_11.8",
          sourceRef: "11.8",
          description: "Quando o VBD for válido e dentro da tolerância, atribuir o VBD à fatura.",
          classification: "MA"
        },
        {
          id: "step_11_11.8.1",
          sourceRef: "11.8.1",
          description: "Marcar o VBD retornado na lista para associá‑lo à invoice.",
          classification: "ME"
        },
        {
          id: "step_11_11.8.2",
          sourceRef: "11.8.2",
          description: "Clicar em 'Overwrite VBD' para usar o VBD selecionado. Se for necessário somar VBDs, utilizar 'Append VBDs' para adicionar.",
          classification: "ME"
        },
        {
          id: "step_11_11.9",
          sourceRef: "11.9",
          description: "Modificar valores na aba 'Line Items' conforme necessário, recalcular e salvar para que o saldo passe a zero e o status fique verde.",
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
          description: "Executar 'Recalculate' para aplicar ajustes e então 'Save'. Verificar que o saldo fica zero e o status aparece em verde.",
          classification: "ME"
        },
        {
          id: "step_11_11.10",
          sourceRef: "11.10",
          description: "Configurar a data base (baseline date) e as condições de pagamento (payment term) antes de simular regras.",
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
          description: "Simular as regras para verificar se há erros antes de aplicar as regras e postar a invoice. Tratamento de erro de simulação: Condição: Simulate Rules retorna status vermelho (erros detectados).. Ações: Identificar mensagens de erro apresentadas pela simulação.; Corrigir os dados afetados (p.ex. ajustes em Line Items, VBD selecionado, datas, valores).; Reexecutar 'Simulate Rules' após aplicar as correções.. Resultado: 11.11 · Simular as regras para verificar se há erros antes de aplicar as regras e postar a invoice.",
          classification: "MS"
        },
        {
          id: "step_11_11.12",
          sourceRef: "11.12",
          description: "Clicar em 'Apply Rules' para que a fatura seja postada no sistema após simulação bem‑sucedida.",
          classification: "ME"
        },
        {
          id: "step_11_11.12.1",
          sourceRef: "11.12.1",
          description: "Executar a ação 'Apply Rules' e confirmar que a invoice foi postada (status indicativo do sistema).",
          classification: "ME"
        },
        {
          id: "step_11_11.13",
          sourceRef: "11.13",
          description: "Quando a simulação indicar erros, revisar os detalhes, corrigir e repetir a simulação. Tratamento de erro de simulação: Condição: Simulate Rules retorna status vermelho (erros detectados).. Ações: Identificar mensagens de erro apresentadas pela simulação.; Corrigir os dados afetados (p.ex. ajustes em Line Items, VBD selecionado, datas, valores).; Reexecutar 'Simulate Rules' após aplicar as correções.. Resultado: 11.11 · Simular as regras para verificar se há erros antes de aplicar as regras e postar a invoice.",
          classification: "MS"
        },
        {
          id: "step_11_11.13.1",
          sourceRef: "11.13.1",
          description: "Identificar as mensagens de erro apresentadas pela simulação e corrigir os dados relacionados (p.ex. valores, VBD, datas). Tratamento de erro de simulação: Condição: Simulate Rules retorna status vermelho (erros detectados).. Ações: Identificar mensagens de erro apresentadas pela simulação.; Corrigir os dados afetados (p.ex. ajustes em Line Items, VBD selecionado, datas, valores).; Reexecutar 'Simulate Rules' após aplicar as correções.. Resultado: 11.11 · Simular as regras para verificar se há erros antes de aplicar as regras e postar a invoice.",
          classification: "MS"
        },
        {
          id: "step_11_11.13.2",
          sourceRef: "11.13.2",
          description: "Após aplicar correções, retornar ao passo de simulação (d106_simulate_rules) e executar novamente. Tratamento de erro de simulação: Condição: Simulate Rules retorna status vermelho (erros detectados).. Ações: Identificar mensagens de erro apresentadas pela simulação.; Corrigir os dados afetados (p.ex. ajustes em Line Items, VBD selecionado, datas, valores).; Reexecutar 'Simulate Rules' após aplicar as correções.. Resultado: 11.11 · Simular as regras para verificar se há erros antes de aplicar as regras e postar a invoice.",
          classification: "MS"
        },
      ]
    },
    {
      id: "step_12",
      sourceStep: "12",
      number: "12",
      title: "Invoice Processing de Inspeção — Criação Manual de VBD (Trip e Non-Trip) Operational sequence para criar manualmente um VBD (ZEWB) for invoiras",
      description: "Operational sequence para criar manualmente um VBD (ZEWB) for invoiras de inspeção quando não há auto-fire VBD. Inclui navegação inicial, exibição de nomination, validação contra a cópia da fatura, criação de VBD em modo Trip ou Non‑Trip, retorno ao VIM Workplace para associar o VBD ao invoice e simulação/aplicação de regras para postagem.",
      classification: "ME",
      classifications: ["ME", "MS"],
      macroBlockId: "execution",
      macroBlockName: "Execution",
      capabilityId: "cap-auto",
      capabilityName: "Automation Capability",
      solutionId: "sol-rpa-upload-vim",
      solutionIds: ["sol-rpa-upload-vim"],
      technologyType: "RPA",
      rationale: "A criação manual tem campos estruturados, porém alterna Trip/Non-Trip e depende de dados externos e aprovação.",
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
        description: "`review_required` — revisão humana permanece necessária para dados, exceções, aprovações e/ou transações financeiras."
      },
      substeps: [
        {
          id: "step_12_12.1",
          sourceRef: "12.1",
          description: "No VIM Workplace, clique no botão Enter para carregar a tela atual. Na tela resultante, selecione a aba 'Other data' e clique na opção 'New Page' para abrir a página usada para consulta de nomination.",
          classification: "ME"
        },
        {
          id: "step_12_12.2",
          sourceRef: "12.2",
          description: "Na nova página aberta, execute a transação O4NSN (Display Nomination). Aguarde a exibição da tela de consulta de nomination.",
          classification: "MS"
        },
        {
          id: "step_12_12.3",
          sourceRef: "12.3",
          description: "Digite a Nomination Key conforme consta na cópia da fatura no campo vazio e pressione Enter. Quando a barra de referência 'transport system' for exibida, dê duplo clique nessa barra e selecione a opção 'Secondary Costing Pig View' na visualização de nomination.",
          classification: "ME"
        },
        {
          id: "step_12_12.4",
          sourceRef: "12.4",
          description: "Compare os dados exibidos na tela de Display Nomination com os valores da cópia da fatura para identificar o line item válido a ser usado na criação do VBD. Validação de janela de data do Schedule Date: Confirmar que o 'Schedule Date' do line item está dentro de ±15 dias do 'Job Finish Date' informado na cópia da fatura antes de prosseguir com a criação do VBD.",
          classification: "MA"
        },
        {
          id: "step_12_12.5",
          sourceRef: "12.5",
          description: "Abra uma nova janela SAP e execute a transação ZEWB (Custom Trading Expense Workbench) para iniciar a criação manual do VBD.",
          classification: "ME"
        },
        {
          id: "step_12_12.6",
          sourceRef: "12.6",
          description: "Escolha o modo correto de criação de VBD conforme o tipo de codificação fornecida.",
          classification: "ME"
        },
        {
          id: "step_12_12.7",
          sourceRef: "12.7",
          description: "No ZEWB selecione a opção 'Trip related', insira a Nomination Key e clique no ícone Execute. Aguarde o resultado com os line items disponíveis.",
          classification: "MS"
        },
        {
          id: "step_12_12.8",
          sourceRef: "12.8",
          description: "Após a execução, identifique o line item que bate perfeitamente com a cópia da fatura (Product, Location, Schedule Date). Selecione essa linha e clique em 'Create Expense' para iniciar a entrada dos dados do VBD. Validação de janela de data do Schedule Date: Confirmar que o 'Schedule Date' do line item está dentro de ±15 dias do 'Job Finish Date' informado na cópia da fatura antes de prosseguir com a criação do VBD.",
          classification: "ME"
        },
        {
          id: "step_12_12.9",
          sourceRef: "12.9",
          description: "Preencha os campos obrigatórios do VBD com os valores da cópia da fatura e do line item selecionado. Campos obrigatórios a inserir: 1) Expanse Class group = 'Z1'; 2) Expanse Class = conforme tipo de taxa da fatura; 3) Accounting Type = 'A' (para Trip-related); 4) Posting Category = '3'; 5) Posting Date = data atual; 6) Partner = número do fornecedor; 7) Net amount = valor líquido da fatura; 8) Reference = número da fatura; 9) Document Date = data da fatura. Após preencher, pressione Enter, verifique os valores exibidos e clique em Save.",
          classification: "ME"
        },
        {
          id: "step_12_12.10",
          sourceRef: "12.10",
          description: "Ao salvar, será gerado o documento VBD. Copie o número do documento VBD exibido na tela para uso no VIM Workplace.",
          classification: "ME"
        },
        {
          id: "step_12_12.11",
          sourceRef: "12.11",
          description: "Retorne à janela do VIM Workplace. Na aba 'Other data' acesse a aba 'Search VBD'. Verifique se Tax Number e Vendor Number foram preenchidos automaticamente. Cole o número do documento VBD no campo 'Accrual VBD number' e clique em Execute (F8).",
          classification: "ME"
        },
        {
          id: "step_12_12.12",
          sourceRef: "12.12",
          description: "Na tela de resultados selecione o accrual VBD apropriado. Clique em 'Overwrite VBD' para substituir ou em 'Append VBDs' para adicionar. Em seguida, vá para a aba 'Line Items' e preencha o campo 'Lift date' com a data 'Job Finished' indicada na fatura. Depois acesse a aba 'Accounting' e atualize o 'Baseline Date' e os detalhes de 'Payment Term' relacionados à fatura. Salve as alterações e clique em 'Simulate Rules'.",
          classification: "ME"
        },
        {
          id: "step_12_12.13",
          sourceRef: "12.13",
          description: "Após executar 'Simulate Rules', verifique a tela de status para identificar erros. A simulação indica sucesso quando o status aparece em verde. Ação em caso de Simulate Rules com erros (status vermelho): Condição: Simulate Rules retorna status vermelho indicando erro(s).. Ações: Revisar os campos preenchidos nas abas Line Items e Accounting (baseline date, payment term, valores e referências).; Corrigir os campos identificados e salvar novamente o VBD no ZEWB, se necessário.; Retornar ao passo de execução 'Simulate Rules' após correções.. Escalonamento: Erro persiste após tentativas de correção e nova simulação. · Supervisor de AP. Resultado: 12.12 · Na tela de resultados selecione o accrual VBD apropriado. Clique em 'Overwrite VBD' para substituir ou em 'Append VBDs' para adicionar. Em seguida, vá para a aba 'Line Items' e preencha o campo 'Lift date' com a data 'Job Finished' indicada na fatura. Depois acesse a aba 'Accounting' e atualize o 'Baseline Date' e os detalhes de 'Payment Term' relacionados à fatura. Salve as alterações e clique em 'Simulate Rules'. Escalar problemas de simulação não resolvidos: Solicitante não consegue corrigir erros identificados pela simulação dentro do tempo esperado. · Supervisor de AP",
          classification: "MS"
        },
        {
          id: "step_12_12.14",
          sourceRef: "12.14",
          description: "Se a simulação indicar status satisfatório, clique em 'Apply Rules'. A ação resultará na postagem da fatura no sistema.",
          classification: "ME"
        },
        {
          id: "step_12_12.15",
          sourceRef: "12.15",
          description: "Se o scheduler forneceu Plant, Material e Strategy, no ZEWB selecione a opção 'Non-Trip related'. Insira Plant, Material e Strategy conforme informado pelo scheduler. Preencha os campos obrigatórios do VBD conforme procedimento (Expanse Class group = 'Z1'; Expanse Class conforme tipo; Accounting Type = 'B' para Non-Trip; Posting Category = '3'; Posting Date, Partner, Net amount, Reference, Document Date). Pressione Enter, verifique e clique em Save. Após salvar, copie o número do VBD gerado e retorne ao VIM Workplace para seguir os passos de pesquisa e associação do VBD (retornar ao passo 'step-115').",
          classification: "ME"
        },
      ]
    },
    {
      id: "step_13",
      sourceStep: "13",
      number: "13",
      title: "Roteamento a Scheduler e Processamento Crude Non‑Trip Related Executable sequence para identificar quando encaminhar uma fatura ao scheduler e o proc",
      description: "Executable sequence para identificar quando encaminhar uma fatura ao scheduler e o procedimento completo para processar faturas Crude Non‑Trip (criação de Trading Contract via ZEWB, criação de VBD, sobrescrita e postagem).",
      classification: "MS",
      classifications: ["MS"],
      macroBlockId: "routing",
      macroBlockName: "Routing",
      capabilityId: "cap-auto",
      capabilityName: "Automation Capability",
      solutionId: "sol-wf-routing",
      solutionIds: ["sol-wf-routing"],
      technologyType: "Workflow",
      rationale: "O encaminhamento ao Scheduler depende de critérios de negócio, informação faltante e acompanhamento de retorno.",
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
        description: "`approval_required` — revisão humana permanece necessária para dados, exceções, aprovações e/ou transações financeiras."
      },
      substeps: [
        {
          id: "step_13_13.1",
          sourceRef: "13.1",
          description: "Decidir se a fatura deve ser encaminhada ao scheduler para codificação.",
          classification: "MS"
        },
        {
          id: "step_13_13.2",
          sourceRef: "13.2",
          description: "Acionar a opção que encaminha a fatura para a fila do scheduler.",
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
          description: "Preencher o comentário de solicitação de codificação no popup e salvar para encaminhar ao scheduler. Requisito: usar o formato de comentário destacado: Inserir a solicitação de coding no formato destacado no popup de comentário antes de salvar.",
          classification: "MS"
        },
        {
          id: "step_13_13.3.1",
          sourceRef: "13.3.1",
          description: "No popup de comentário exibido após 'Refer to Scheduler', digite a solicitação de coding seguindo o formato destacado na tela e clique no ícone salvar. Requisito: usar o formato de comentário destacado: Inserir a solicitação de coding no formato destacado no popup de comentário antes de salvar.",
          classification: "MS"
        },
        {
          id: "step_13_13.3.2",
          sourceRef: "13.3.2",
          description: "Clique no ícone de salvar para registrar o comentário e prosseguir com a seleção do scheduler.",
          classification: "ME"
        },
        {
          id: "step_13_13.4",
          sourceRef: "13.4",
          description: "Selecionar o scheduler indicado (conforme contato exibido) e clicar em 'Continue' para enviar a fatura à fila do scheduler selecionado. Scheduler fixo for invoiras Crude: Para faturas de produto Crude, selecionar o scheduler fixo Emmanuella.Ekhaguere@p66.com quando disponível.",
          classification: "ME"
        },
        {
          id: "step_13_13.4.1",
          sourceRef: "13.4.1",
          description: "Na tela que aparece após salvar o comentário, localize o contato do scheduler fornecido na fatura, selecione o ID correspondente e clique em 'Continue'. Scheduler fixo for invoiras Crude: Para faturas de produto Crude, selecionar o scheduler fixo Emmanuella.Ekhaguere@p66.com quando disponível.",
          classification: "MA"
        },
        {
          id: "step_13_13.4.2",
          sourceRef: "13.4.2",
          description: "Após clicar 'Continue', verifique que a fatura foi movida para a fila do scheduler (confirmação visual na tela).",
          classification: "ME"
        },
        {
          id: "step_13_13.5",
          sourceRef: "13.5",
          description: "Para invoices de produto Crude, o roteamento é idêntico porém com scheduler fixo. Use o scheduler fixo especificado quando a fatura for Crude. Scheduler fixo for invoiras Crude: Para faturas de produto Crude, selecionar o scheduler fixo Emmanuella.Ekhaguere@p66.com quando disponível.",
          classification: "ME"
        },
        {
          id: "step_13_13.6",
          sourceRef: "13.6",
          description: "Abrir a fatura no VIM Workplace, clicar em 'Comment' e confirmar que o scheduler aprovou/codificou a fatura antes de prosseguir com criação de Trading Contract / VBD.",
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
          description: "Clique em 'Comment' e verifique o status/aprovação do scheduler exibida no histórico de comentários. Se estiver aprovada, prossiga; se não, aguarde ou reencaminhe conforme necessário.",
          classification: "MS"
        },
        {
          id: "step_13_13.7",
          sourceRef: "13.7",
          description: "Abrir a transação ZEWB, inserir o número do Trading Contract referente à localização (ex.: Ferndale) a partir do arquivo Excel exportado e executar para localizar o contract. Verificação: tratamento de erros após 'Simulate Rules': Confirmar que a simulação de regras não retornou mensagens de erro antes de aplicar a regra.",
          classification: "ME"
        },
        {
          id: "step_13_13.7.1",
          sourceRef: "13.7.1",
          description: "No SAP, acesse o código de transação ZEWB e prepare-se para inserir o Trading Contract number.",
          classification: "ME"
        },
        {
          id: "step_13_13.7.2",
          sourceRef: "13.7.2",
          description: "Digite o número do Trading Contract (obtido do arquivo Excel exportado sob a variante 'JUANID') e clique no ícone 'Execute' para carregar a lista de contracts.",
          classification: "ME"
        },
        {
          id: "step_13_13.7.3",
          sourceRef: "13.7.3",
          description: "Se receber detalhes de local ou produto não existentes, contacte o scheduler responsável para obter o coding adequado antes de criar um novo Trading Contract.",
          classification: "MS"
        },
        {
          id: "step_13_13.8",
          sourceRef: "13.8",
          description: "Na lista retornada pela execução do ZEWB, selecione o item correspondente e acione 'Create Expense' para iniciar a inclusão da despesa (VBD).",
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
          description: "Copiar o número do VBD gerado no ZEWB e, no VIM Workplace, abrir a aba 'Other Data' e selecionar 'Search Accrual VBD' para localizar o VBD no VIM.",
          classification: "ME"
        },
        {
          id: "step_13_13.9.1",
          sourceRef: "13.9.1",
          description: "Após salvar no ZEWB e confirmar que o VBD foi gerado, copie o número do documento VBD exibido.",
          classification: "ME"
        },
        {
          id: "step_13_13.9.2",
          sourceRef: "13.9.2",
          description: "No VIM Workplace, vá para a aba 'Other Data' e clique em 'Search Accrual VBD' para preparar a busca pelo número copiado.",
          classification: "ME"
        },
        {
          id: "step_13_13.10",
          sourceRef: "13.10",
          description: "Na tela de busca de Accrual VBD, cole/insira o número do VBD copiado e clique em 'Execute' para localizar o VBD dentro do VIM.",
          classification: "ME"
        },
        {
          id: "step_13_13.11",
          sourceRef: "13.11",
          description: "Localizado o VBD no VIM, selecionar o VBD e executar a sobrescrita. Em seguida, na aba 'Accounting' inserir Baseline Date e Payment Terms, salvar; usar 'Simulate Rules' para verificar ausência de erros; finalmente clicar em 'Apply Rule' para postar a fatura. Verificação: tratamento de erros após 'Simulate Rules': Confirmar que a simulação de regras não retornou mensagens de erro antes de aplicar a regra.",
          classification: "ME"
        },
        {
          id: "step_13_13.11.1",
          sourceRef: "13.11.1",
          description: "Selecione o VBD retornado na busca e acione a opção 'Overwrite VBD' para associar o VBD à fatura.",
          classification: "ME"
        },
        {
          id: "step_13_13.11.2",
          sourceRef: "13.11.2",
          description: "Abra a aba 'Accounting', preencha o campo 'Baseline Date' e os 'Payment Terms' conforme a fatura e clique em salvar para persistir os dados contábeis.",
          classification: "ME"
        },
        {
          id: "step_13_13.11.3",
          sourceRef: "13.11.3",
          description: "Clique em 'Simulate Rules' e verifique se há mensagens de erro. Se não houver erros, prossiga para aplicar a regra. Verificação: tratamento de erros após 'Simulate Rules': Confirmar que a simulação de regras não retornou mensagens de erro antes de aplicar a regra.",
          classification: "ME"
        },
        {
          id: "step_13_13.11.4",
          sourceRef: "13.11.4",
          description: "Após simulação sem erros, clique em 'Apply Rule' para que a fatura seja postada no sistema.",
          classification: "ME"
        },
      ]
    },
    {
      id: "step_14",
      sourceStep: "14",
      number: "14",
      title: "Process fatura do fornecedor SGS CANADA INC (Non‑PO, codificação fixa) Step-by-step procedure para verificar, classificar, apply rules, direc",
      description: "Step-by-step procedure para verificar, classificar, apply rules, direcionar para aprovação e postar faturas do fornecedor SGS CANADA INC usando VIM Workplace (S/4 VIM) com codificação fixa (G/L, Material, Profit center).",
      classification: "ME",
      classifications: ["ME", "MS"],
      macroBlockId: "execution",
      macroBlockName: "Execution",
      capabilityId: "cap-auto",
      capabilityName: "Automation Capability",
      solutionId: "sol-rules-coding",
      solutionIds: ["sol-rules-coding"],
      technologyType: "Rules Engine",
      rationale: "A codificação fixa do fornecedor é repetitiva e pode ser orientada por regras explícitas, com conferência antes da postagem.",
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
        description: "`review_required` — revisão humana permanece necessária para dados, exceções, aprovações e/ou transações financeiras."
      },
      substeps: [
        {
          id: "step_14_14.1",
          sourceRef: "14.1",
          description: "Abrir a entrada da fatura do fornecedor SGS CANADA INC no VIM Workplace e validar os dados da fatura em relação à cópia física ou PDF.",
          classification: "ME"
        },
        {
          id: "step_14_14.1.1",
          sourceRef: "14.1.1",
          description: "Confirmar que os seguintes campos da fatura correspondem à cópia do documento: número da fatura, data da fatura, valor total, dados bancários (se presentes) e dados do fornecedor. Se houver discrepâncias, suspender processamento e anotar as diferenças na fatura de trabalho.",
          classification: "MA"
        },
        {
          id: "step_14_14.2",
          sourceRef: "14.2",
          description: "No registro da fatura, alterar o tipo de documento para o tipo específico de Non‑PO Manual e salvar o identificador do requisitante. Obrigatoriedade de preencher Requester E‑mail: Preencher o campo Requester E‑mail com o Email ID do usuário processador antes de salvar o tipo de documento.",
          classification: "ME"
        },
        {
          id: "step_14_14.2.1",
          sourceRef: "14.2.1",
          description: "Clicar em Change Doc Type, selecionar a opção 'Non‑PO Invoice – Manual uploads' conforme o tipo de processamento manual requerido para SGS CANADA INC.",
          classification: "ME"
        },
        {
          id: "step_14_14.2.2",
          sourceRef: "14.2.2",
          description: "No campo Requester E-mail inserir o seu e‑mail (Email ID do usuário que processa a fatura) e salvar o registro pressionando Ctrl + S. Obrigatoriedade de preencher Requester E‑mail: Preencher o campo Requester E‑mail com o Email ID do usuário processador antes de salvar o tipo de documento.",
          classification: "ME"
        },
        {
          id: "step_14_14.3",
          sourceRef: "14.3",
          description: "Na aba Line‑Item informar a codificação contábil necessária para SGS CANADA INC (G/L, Material, Valor, Profit center). Codificação fixa obrigatória para SGS CANADA INC: Usar os valores fixos: G/L = 50002900; Material = 2100045; Profit center = 5090000001 ao inserir as linhas para o fornecedor SGS CANADA INC.",
          classification: "ME"
        },
        {
          id: "step_14_14.3.1",
          sourceRef: "14.3.1",
          description: "Preencher os campos de linha com: G/L = 50002900; Material = 2100045; Profit center = 5090000001; e inserir o Amount conforme valor na fatura. Confirmar que os valores inseridos batem com a cópia da fatura antes de salvar. Codificação fixa obrigatória para SGS CANADA INC: Usar os valores fixos: G/L = 50002900; Material = 2100045; Profit center = 5090000001 ao inserir as linhas para o fornecedor SGS CANADA INC.",
          classification: "ME"
        },
        {
          id: "step_14_14.4",
          sourceRef: "14.4",
          description: "Na aba Accounting ajustar a Data Base (Baseline Date) e os Payment Terms conforme os dados da fatura e salvar o registro. Preenchimento obrigatório de Baseline Date e Payment Terms: Na aba Accounting preencher Baseline Date e Payment Terms conforme os dados da fatura antes de salvar.",
          classification: "ME"
        },
        {
          id: "step_14_14.4.1",
          sourceRef: "14.4.1",
          description: "No separador Accounting informar o Baseline Date e os Payment Terms de acordo com a data/condição na fatura. Após preencher, salvar usando Ctrl + S. Preenchimento obrigatório de Baseline Date e Payment Terms: Na aba Accounting preencher Baseline Date e Payment Terms conforme os dados da fatura antes de salvar.",
          classification: "ME"
        },
        {
          id: "step_14_14.5",
          sourceRef: "14.5",
          description: "Executar a opção Simulate Rules e confirmar que os estados retornados estão com sinal verde, exceto o indicador 'Approval required' que pode permanecer pendente conforme o valor.",
          classification: "ME"
        },
        {
          id: "step_14_14.5.1",
          sourceRef: "14.5.1",
          description: "Acionar a função Simulate Rules e aguardar o resultado da simulação.",
          classification: "ME"
        },
        {
          id: "step_14_14.5.2",
          sourceRef: "14.5.2",
          description: "Confirmar que a simulação não apresenta erros (todos os checks com status apropriado). Caso haja mensagens de erro ou bloqueio, consultar o procedimento de resolução especificado (incerteza sobre o fluxo de tratamento — ver unknown relacionado).",
          classification: "ME"
        },
        {
          id: "step_14_14.6",
          sourceRef: "14.6",
          description: "Clicar em Apply Rule para que o sistema aplique as regras de workflow. O destino após Apply Rule depende do valor da fatura (decisão de aprovação).",
          classification: "MS"
        },
        {
          id: "step_14_14.6.1",
          sourceRef: "14.6.1",
          description: "Acionar Apply Rule para iniciar o direcionamento conforme as regras; aguardar confirmação do sistema de que a ação foi aplicada.",
          classification: "ME"
        },
        {
          id: "step_14_14.6.2",
          sourceRef: "14.6.2",
          description: "Decidir o fluxo de aprovação com base no valor total da fatura, conforme as faixas definidas para SGS CANADA INC.",
          classification: "MS"
        },
        {
          id: "step_14_14.7",
          sourceRef: "14.7",
          description: "A fatura entrará na fila do aprovador de primeiro nível (gestor interno). Executar e aprovar conforme a rotina de aprovação padrão.",
          classification: "MS"
        },
        {
          id: "step_14_14.7.1",
          sourceRef: "14.7.1",
          description: "Na fila de primeiro nível localizar a fatura processada, selecionar a linha correspondente e clicar em Execute para abrir a tela de aprovação.",
          classification: "MA"
        },
        {
          id: "step_14_14.7.2",
          sourceRef: "14.7.2",
          description: "Após executar, clicar em Approve para completar a aprovação de primeiro nível. Em seguida seguir para a etapa de inserir e‑mail do supervisor para o próximo nível quando exigido (ver s8).",
          classification: "MS"
        },
        {
          id: "step_14_14.8",
          sourceRef: "14.8",
          description: "Para faturas acima de 25.000 USD processar o primeiro nível e encaminhar explicitamente ao P66 supervisor no campo indicado para aprovação de segundo nível. Escalação para aprovação do P66 supervisor for invoiras > 25.000 USD: Fatura com valor superior a 25.000 USD após Apply Rule e aprovação de primeiro nível. · P66 supervisor",
          classification: "MS"
        },
        {
          id: "step_14_14.8.1",
          sourceRef: "14.8.1",
          description: "Selecionar a fatura na fila de primeiro nível e clicar em Execute para abrir a tela de aprovação; preparar o encaminhamento adicional ao supervisor P66 conforme a política de limites. Escalação para aprovação do P66 supervisor for invoiras > 25.000 USD: Fatura com valor superior a 25.000 USD após Apply Rule e aprovação de primeiro nível. · P66 supervisor",
          classification: "MS"
        },
        {
          id: "step_14_14.8.2",
          sourceRef: "14.8.2",
          description: "Clicar em Approve (primeiro nível) e em seguida inserir o e‑mail do supervisor P66 no campo designado para envio ao próximo nível de aprovação, incluindo notas se necessário (ver s8). Escalação para aprovação do P66 supervisor for invoiras > 25.000 USD: Fatura com valor superior a 25.000 USD após Apply Rule e aprovação de primeiro nível. · P66 supervisor",
          classification: "MS"
        },
        {
          id: "step_14_14.9",
          sourceRef: "14.9",
          description: "Na tela exibida após clicar em Approve na aprovação de primeiro nível, informar o e‑mail do aprovador do próximo nível e, quando solicitado, inserir comentários pertinentes ao encaminhamento. Escalação para aprovação do P66 supervisor for invoiras > 25.000 USD: Fatura com valor superior a 25.000 USD após Apply Rule e aprovação de primeiro nível. · P66 supervisor",
          classification: "MS"
        },
        {
          id: "step_14_14.9.1",
          sourceRef: "14.9.1",
          description: "No campo indicado inserir o e‑mail do aprovador do próximo nível: for invoiras entre 1.000 e 25.000 USD inserir o e‑mail do gestor interno; for invoiras >25.000 USD inserir o e‑mail do P66 supervisor. Inserir comentários concisos no campo Comment se houver instruções específicas, então salvar/confirmar a ação de aprovação. Escalação para aprovação do P66 supervisor for invoiras > 25.000 USD: Fatura com valor superior a 25.000 USD após Apply Rule e aprovação de primeiro nível. · P66 supervisor",
          classification: "MS"
        },
        {
          id: "step_14_14.10",
          sourceRef: "14.10",
          description: "Após a aprovação de todos os níveis exigidos, confirmar que a fatura foi devidamente postada no sistema. Se a fatura foi de faixa abaixo de 1.000 USD, a postagem ocorrerá imediatamente após Apply Rule conforme end_state definido.",
          classification: "MS"
        },
        {
          id: "step_14_14.10.1",
          sourceRef: "14.10.1",
          description: "Confirmar no sistema que a fatura agora tem status Posted (ou equivalente) e arquivar a cópia comprovante no workflow conforme procedimento local.",
          classification: "ME"
        },
      ]
    },
    {
      id: "step_15",
      sourceStep: "15",
      number: "15",
      title: "Intercompany Processing — Exportar dados SAP (FAGLL03H) e preparar relatório WD06 Executar extração de lançamentos intercompany no SAP via FAGLL03H",
      description: "Executar extração de lançamentos intercompany no SAP via FAGLL03H, preparar planilha, filtrar parceiros comerciais, enviar para responsável e executar o processamento WD06 (categoria, pivot, verificação e obsolescência em VIM).",
      classification: "ME",
      classifications: ["ME", "MS"],
      macroBlockId: "codification",
      macroBlockName: "Codification",
      capabilityId: "cap-auto",
      capabilityName: "Automation Capability",
      solutionId: "sol-rpa-report",
      solutionIds: ["sol-rpa-report"],
      technologyType: "RPA / Spreadsheet",
      rationale: "A extração FAGLL03H e preparação do relatório WD06 seguem uma rotina estruturada de exportação e transformação.",
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
        description: "`review_required` — revisão humana permanece necessária para dados, exceções, aprovações e/ou transações financeiras."
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
          description: "Confirmar que Company Code, Ledger e G/L Account estão preenchidos automaticamente conforme variante selecionada posteriormente.",
          classification: "ME"
        },
        {
          id: "step_15_15.2",
          sourceRef: "15.2",
          description: "Obter a variante predefinida e executá-la para popular os parâmetros do relatório.",
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
          description: "Modificar o layout do relatório para o layout de fechamento de mês e executar para obter o formato esperado.",
          classification: "ME"
        },
        {
          id: "step_15_15.3.1",
          sourceRef: "15.3.1",
          description: "Escolher o layout nomeado 'month end close' na lista de layouts disponíveis.",
          classification: "ME"
        },
        {
          id: "step_15_15.3.2",
          sourceRef: "15.3.2",
          description: "Após alterar o layout, executar o relatório pressionando F8.",
          classification: "ME"
        },
        {
          id: "step_15_15.4",
          sourceRef: "15.4",
          description: "Gerar a planilha a partir do resultado do relatório e salvar com nome apropriado antes do pós-processamento. Prazo de execução do relatório intercompany: O relatório intercompany do FAGLL03H normalmente é executado no 4º dia útil; confirmar execução dentro desse prazo. Formato/nomenclatura do arquivo exportado: Confirmar o padrão de nomenclatura do arquivo Excel a ser usado ao salvar a exportação.",
          classification: "ME"
        },
        {
          id: "step_15_15.4.1",
          sourceRef: "15.4.1",
          description: "No resultado do relatório, clicar com o botão direito em qualquer linha e selecionar a opção 'Spreadsheet'.",
          classification: "ME"
        },
        {
          id: "step_15_15.4.2",
          sourceRef: "15.4.2",
          description: "Na caixa de diálogo de exportação, alterar o nome do arquivo Excel conforme necessário e confirmar com Enter. Formato/nomenclatura do arquivo exportado: Confirmar o padrão de nomenclatura do arquivo Excel a ser usado ao salvar a exportação.",
          classification: "ME"
        },
        {
          id: "step_15_15.4.3",
          sourceRef: "15.4.3",
          description: "Confirmar a exportação e salvar a planilha no local de trabalho designado.",
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
          description: "Selecionar todas as linhas resultantes fora dos parceiros 1010 e 1011 e excluí-las do arquivo.",
          classification: "ME"
        },
        {
          id: "step_15_15.6",
          sourceRef: "15.6",
          description: "Encaminhar o arquivo limpo ao responsável designado para que ele realize o processamento WD06 (recebimento na 7ª jornada, categorização e reconciliação). Recebimento de detalhes para WD06: Os detalhes para processamento WD06 devem ser recebidos no 7º dia útil; confirmar a data de recebimento antes de iniciar a categorização.",
          classification: "MA"
        },
        {
          id: "step_15_15.6.1",
          sourceRef: "15.6.1",
          description: "Anexar a planilha ao e-mail ou sistema de transferência utilizado e enviar ao responsável pelo WD06. Recebimento de detalhes para WD06: Os detalhes para processamento WD06 devem ser recebidos no 7º dia útil; confirmar a data de recebimento antes de iniciar a categorização.",
          classification: "ME"
        },
        {
          id: "step_15_15.6.2",
          sourceRef: "15.6.2",
          description: "Informar no envio que os detalhes de intercompany correspondentes ao mês anterior devem ser processados no mês corrente conforme rotina.",
          classification: "MA"
        },
        {
          id: "step_15_15.7",
          sourceRef: "15.7",
          description: "Ao receber o arquivo no 7º dia útil, executar limpeza de colunas e preparar para categorização.",
          classification: "ME"
        },
        {
          id: "step_15_15.7.1",
          sourceRef: "15.7.1",
          description: "Confirmar que o arquivo foi recebido no sétimo dia útil e abrir a planilha recebida.",
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
          description: "Verificar: (a) document number e reference document number são idênticos; (b) company code aparece como fornecedor; (c) identificar que as company codes intercompany principais são 1010, 1011 e DCP (1231); (d) usar coluna 'Text' para ajudar a identificar o tipo de despesa.",
          classification: "ME"
        },
        {
          id: "step_15_15.7.4",
          sourceRef: "15.7.4",
          description: "Aplicar filtro para manter linhas referentes às company codes intercompany conforme necessário (p.ex. 1010, 1011).",
          classification: "ME"
        },
        {
          id: "step_15_15.8",
          sourceRef: "15.8",
          description: "Verificar se a célula da coluna 'Text' está em branco para a linha do documento.",
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
          description: "No SAP, executar o relatório /OPT/VIM_VA2 (VIM Analytics 7.50).",
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
          description: "Anotar o tipo de invoice exibido no resultado do VIM Analytics e retornar à planilha para registrar a categoria.",
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
          description: "Para cada linha, procurar a palavra-chave na coluna Text e atribuir o Invoice Type conforme abaixo: Tariff# → Pipeline Tariff; Barge Service → Terminaling; Truck Rack → Terminaling; Pump over → Terminaling; Gain/Loss → Gain/Loss; Loss Allowance → Loss Allowance.",
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
          description: "Construir uma tabela dinâmica para agrupar e facilitar a identificação de créditos/debitos e os tipos de invoice.",
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
          description: "Adicionar Document Number para rastreamento, Company Code para identificação do vendor; colocar Invoice Type como filtro; agrupar/totalizar valores por moeda conforme necessário.",
          classification: "ME"
        },
        {
          id: "step_15_15.12",
          sourceRef: "15.12",
          description: "Usar os resultados da Pivot para localizar faturas destacadas (crédito/debito em vermelho) no VIM Workplace, obsoletar as que forem identificadas como obsoletas e verificar individualmente faturas do tipo pipeline. Ação técnica para obsoleter faturas no VIM: Confirmar o procedimento/fluxo exato (botão/menu) no VIM Workspace utilizado para marcar faturas como obsoletas.",
          classification: "ME"
        },
        {
          id: "step_15_15.12.1",
          sourceRef: "15.12.1",
          description: "A partir da Pivot, listar os Document Numbers/Reference Numbers que aparecem como crédito/debito destacados (em vermelho) e marcá-los para ação no VIM.",
          classification: "ME"
        },
        {
          id: "step_15_15.12.2",
          sourceRef: "15.12.2",
          description: "No SAP VIM Workspace, ir à coluna 'Reference', aplicar filtro com o Reference Number copiado e localizar a linha correspondente.",
          classification: "MA"
        },
        {
          id: "step_15_15.12.3",
          sourceRef: "15.12.3",
          description: "Dar duplo clique no Reference Number encontrado para abrir os detalhes e confirmar que o Invoice Type registrado é 'pipeline' quando aplicável.",
          classification: "ME"
        },
        {
          id: "step_15_15.12.4",
          sourceRef: "15.12.4",
          description: "Para cada Reference Number marcado como obsoleto, executar a ação de obsolecer no VIM Workspace (obsolecer as faturas que a Pivot indicou como obsoletas). Ação técnica para obsoleter faturas no VIM: Confirmar o procedimento/fluxo exato (botão/menu) no VIM Workspace utilizado para marcar faturas como obsoletas.",
          classification: "ME"
        },
      ]
    },
    {
      id: "step_16",
      sourceStep: "16",
      number: "16",
      title: "Processamento IC Pipeline Tariff / Terminal — ajustar Document Type SEC_SUM, criar/atualizar VBD e disparar incident em ServiceNow Sequência completa",
      description: "Sequência completa para localizar invoices Pipeline/Terminal no VIM Workplace, ajustar Document Type para SEC_SUM, gerar incident em ServiceNow para disparo de VBD automático, obter/confirmar Trading Contract e criar/overwritar VBD manualmente até postar a fatura.",
      classification: "MS",
      classifications: ["MS", "MA"],
      macroBlockId: "exception",
      macroBlockName: "Exception",
      capabilityId: "cap-auto",
      capabilityName: "Automation Capability",
      solutionId: "sol-eval-anomaly",
      solutionIds: ["sol-eval-anomaly"],
      technologyType: "Workflow",
      rationale: "A correção intercompany envolve ajuste de Document Type, VBD e abertura de incidente; requer coordenação e decisão humana.",
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
        description: "`decision_required` — revisão humana permanece necessária para dados, exceções, aprovações e/ou transações financeiras."
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
          description: "Navegue ao VIM Workplace. Modifique os parâmetros do filtro para selecionar invoices do tipo Pipeline Tariff / Terminal conforme os detalhes da fatura a processar (usar os critérios disponíveis no VIM).",
          classification: "ME"
        },
        {
          id: "step_16_16.1.2",
          sourceRef: "16.1.2",
          description: "Com a linha da invoice selecionada, execute-a usando a tecla F8 para carregar o conteúdo completo da invoice na tela (conforme Step11).",
          classification: "ME"
        },
        {
          id: "step_16_16.1.3",
          sourceRef: "16.1.3",
          description: "Verifique e confirme os seguintes campos da invoice contra o documento recebido: invoice number (nº da fatura), invoice date (data da fatura), reference number (número de referência), gross amount (valor bruto) e company code (código da empresa). (conforme Step12).",
          classification: "ME"
        },
        {
          id: "step_16_16.2",
          sourceRef: "16.2",
          description: "Para as invoices de Pipeline Tariff e Terminal, altere o campo Document Type para SEC_SUM e, quando necessário, atualize o Vendor Number conforme informado na invoice (conforme instruções da página 144). Obrigatoriedade: Document Type = SEC_SUM para Pipeline/Terminal: As invoices Pipeline Tariff e Terminal devem ter o campo Document Type alterado para SEC_SUM antes de solicitar o disparo do VBD automático.",
          classification: "MS"
        },
        {
          id: "step_16_16.2.1",
          sourceRef: "16.2.1",
          description: "Localize o campo Document Type na tela da invoice e selecione/insira SEC_SUM para essa invoice. Faça isso para todas as invoices Pipeline/Terminal a serem processadas (página 144).",
          classification: "ME"
        },
        {
          id: "step_16_16.2.2",
          sourceRef: "16.2.2",
          description: "Verifique o Vendor Number exibido. Se necessário, altere o Vendor Number para o valor que consta na invoice para garantir correspondência (página 144).",
          classification: "MA"
        },
        {
          id: "step_16_16.3",
          sourceRef: "16.3",
          description: "Crie um ticket no portal ServiceNow indicando que a invoice foi marcada como SEC_SUM e solicitando o disparo do auto-fire do VBD para essa invoice. Aguarde o fechamento/retorno do ticket antes de prosseguir (conforme Step2 página 144 e Step3 página 144). Gerar incidente em ServiceNow para disparo do auto-fire VBD: Criar ticket no portal ServiceNow solicitando o auto-fire do VBD após alteração do Document Type para SEC_SUM.",
          classification: "MS"
        },
        {
          id: "step_16_16.4",
          sourceRef: "16.4",
          description: "Após o ticket do ServiceNow ser finalizado, inspecione a invoice no VIM para identificar se há line items (linhas) faltando que impeçam o mapeamento do Trading Contract.",
          classification: "MS"
        },
        {
          id: "step_16_16.5",
          sourceRef: "16.5",
          description: "Se houver linhas faltando: localize o trac code/BOL number presente na invoice; utilize o trac code para mapear a localização (mapa/registro) e, a partir disso, identificar qual Trading Contract é aplicável. Prepare e encaminhe a evidência ao time FP&A para que forneça o Trading Contract correspondente (conforme Step3 e Step4 páginas 144-145).",
          classification: "MA"
        },
        {
          id: "step_16_16.6",
          sourceRef: "16.6",
          description: "Quando as linhas estiverem completas (ou após mapear trac code), solicite ao time FP&A o Trading Contract aplicável conforme a descrição da invoice e/ou trac code. O FP&A fornecerá o TC utilizado para o processamento (conforme Step4 página 145).",
          classification: "ME"
        },
        {
          id: "step_16_16.7",
          sourceRef: "16.7",
          description: "Crie o VBD correspondente ao produto indicado na invoice. Clique na opção indicada na tela para criar o VBD (referido como 'Create Expanse' no documento) e, após criação, selecione o ícone de lápis (Pencil) para editar/atualizar informações adicionais antes de salvar (conforme Step5 e Step6 páginas 145-146).",
          classification: "MA"
        },
        {
          id: "step_16_16.7.1",
          sourceRef: "16.7.1",
          description: "Execute a ação de 'Create Expanse' conforme exibido na tela para gerar o rascunho do VBD (página 145).",
          classification: "ME"
        },
        {
          id: "step_16_16.7.2",
          sourceRef: "16.7.2",
          description: "Clique no ícone de lápis para atualizar informações adicionais do VBD. Preencha os campos destacados conforme os dados da invoice (conforme Step6 e Step7 páginas 146). Após inserir os detalhes, use 'Go back' se necessário e salve o VBD.",
          classification: "ME"
        },
        {
          id: "step_16_16.8",
          sourceRef: "16.8",
          description: "Após salvar o VBD, copie o número do VBD exibido no pop-up. Volte ao VIM Workplace, na aba Other data, e selecione a função Search Accrual VBD para procurar pelo VBD usando campos como BOL NUMBER, TRANSACTION DATE, BATCH NUMBER (conforme Step8 e Step9 páginas 147).",
          classification: "ME"
        },
        {
          id: "step_16_16.9",
          sourceRef: "16.9",
          description: "No painel Search Accrual VBD, cole/insira o número do VBD copiado e pressione F8 para executar a busca (conforme Step10 página 148). Quando o VBD for carregado, selecione a opção Overwrite VBD para sobrescrever o VBD existente conforme necessário.",
          classification: "ME"
        },
        {
          id: "step_16_16.10",
          sourceRef: "16.10",
          description: "Após sobrescrever o VBD, pressione Ctrl+S para salvar as alterações. Em seguida, selecione a opção Simulate Rule e verifique que a simulação indique zero erros. Somente após confirmação de zero erros, selecione Apply Rules para executar a postagem da invoice (conforme Step11 página 149). Confirmar simulação sem erros antes de apply rules: Executar Simulate Rule e confirmar que o resultado apresenta zero errors antes de acionar Apply Rules para postar a invoice.",
          classification: "ME"
        },
      ]
    },
    {
      id: "step_17",
      sourceStep: "17",
      number: "17",
      title: "Nomination Key extraction via Fiori — obter NK, aplicar filtros e exportar Executable sequence para localizar Nomination Key no Fiori, aplicar os fi",
      description: "Executable sequence para localizar Nomination Key no Fiori, aplicar os filtros exigidos (plant, transport system e scheduled date), obter resultados, personalizar tabela (colunas necessárias), filtrar ticket status e exportar o arquivo Excel com as colunas selecionadas para uso na criação manual de VBD.",
      classification: "ME",
      classifications: ["ME"],
      macroBlockId: "intake",
      macroBlockName: "Intake",
      capabilityId: "cap-auto",
      capabilityName: "Automation Capability",
      solutionId: "sol-rpa-report",
      solutionIds: ["sol-rpa-report"],
      technologyType: "RPA",
      rationale: "A busca e exportação da Nomination Key no Fiori são repetitivas e baseadas em filtros definidos.",
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
        description: "`review_required` — revisão humana permanece necessária para dados, exceções, aprovações e/ou transações financeiras."
      },
      substeps: [
        {
          id: "step_17_17.1",
          sourceRef: "17.1",
          description: "No ambiente Fiori, localizar e abrir a aplicação Nomination Key para iniciar a extração da Nomination Key que será usada na criação manual do VBD.",
          classification: "ME"
        },
        {
          id: "step_17_17.2",
          sourceRef: "17.2",
          description: "Na tela da aplicação Nomination Key, selecionar a opção 'my nomination' e, em seguida, o modo 'view standard'. Em seguida aplicar filtro pelo plant (nome do plant) conforme consta na fatura referência. Confirmação do plant com a fatura: O valor do campo 'plant' utilizado no filtro deve corresponder exatamente ao plant indicado na fatura referência.",
          classification: "MA"
        },
        {
          id: "step_17_17.3",
          sourceRef: "17.3",
          description: "No painel de filtros, preencher o campo 'transport systems' com o(s) código(s) de transporte relacionados à fatura. Inserir o scheduled date correspondente ao mês de Outubro conforme instruído pela fatura.",
          classification: "MA"
        },
        {
          id: "step_17_17.4",
          sourceRef: "17.4",
          description: "Após configurar todos os filtros (plant, transport systems, scheduled date), clicar no botão 'GO' para executar a pesquisa de nominations que atendam aos filtros aplicados.",
          classification: "ME"
        },
        {
          id: "step_17_17.5",
          sourceRef: "17.5",
          description: "Avaliar se a tabela de resultados possui linhas após a execução da busca. Procedimento em caso de busca sem resultados: Condição: A busca retornou zero linhas após clicar GO. Ações: Verificar se os filtros 'plant' e 'transport systems' foram preenchidos corretamente.; Ampliar o intervalo do scheduled date (incluir mais dias dentro do mês ou datas adjacentes) e reexecutar a busca.; Confirmar se existem valores alternativamente classificados (p.ex., partially actualized) que devam ser considerados.. Resultado: 17.3 · No painel de filtros, preencher o campo 'transport systems' com o(s) código(s) de transporte relacionados à fatura. Inserir o scheduled date correspondente ao mês de Outubro conforme instruído pela fatura.",
          classification: "MA"
        },
        {
          id: "step_17_17.6",
          sourceRef: "17.6",
          description: "Se a busca não retornou resultados, revisar filtros aplicados: confirmar plant, transport systems e scheduled date; ampliar o intervalo de datas (p.ex., incluir dias adicionais em Outubro) e reexecutar a busca (voltar para o passo de aplicação de filtros e clicar GO novamente). Procedimento em caso de busca sem resultados: Condição: A busca retornou zero linhas após clicar GO. Ações: Verificar se os filtros 'plant' e 'transport systems' foram preenchidos corretamente.; Ampliar o intervalo do scheduled date (incluir mais dias dentro do mês ou datas adjacentes) e reexecutar a busca.; Confirmar se existem valores alternativamente classificados (p.ex., partially actualized) que devam ser considerados.. Resultado: 17.3 · No painel de filtros, preencher o campo 'transport systems' com o(s) código(s) de transporte relacionados à fatura. Inserir o scheduled date correspondente ao mês de Outubro conforme instruído pela fatura.",
          classification: "MA"
        },
        {
          id: "step_17_17.7",
          sourceRef: "17.7",
          description: "Com resultados visíveis, abrir a opção de 'table personalization' para selecionar as colunas que serão incluídas no arquivo exportado. Selecionar explicitamente as colunas: 'Nomination Key', 'Ticket Status', 'Actual Quantity' e 'Schedule Type'. Confirmar a aplicação da personalização antes de exportar.",
          classification: "ME"
        },
        {
          id: "step_17_17.8",
          sourceRef: "17.8",
          description: "Na própria tabela de resultados, aplicar filtro no campo 'Ticket Status' para manter apenas os registros com status 'Actualized' (ou 'Partially Actualized' se assim determinado pelo caso). Esta filtragem garante que o arquivo exportado contenha o status desejado.",
          classification: "ME"
        },
        {
          id: "step_17_17.9",
          sourceRef: "17.9",
          description: "Após aplicar a personalização das colunas e o filtro de 'Ticket Status', usar a função de exportação da tabela para gerar o arquivo Excel. Salvar o arquivo no local apropriado conforme política do time. Este arquivo conterá as Nomination Keys e demais colunas selecionadas e deverá ser usado para reservar movimentos e/ou criar manualmente o VBD.",
          classification: "ME"
        },
      ]
    },
    {
      id: "step_18",
      sourceStep: "18",
      number: "18",
      title: "T4 (Transport4) — Conciliação Volume/Entrega e Process de Loss Allowance Executar a conciliação entre valores de fatura e entregas utilizando o Trans",
      description: "Executar a conciliação entre valores de fatura e entregas utilizando o Transport4 (T4) e processar as entradas de Loss Allowance seguindo a sequência abaixo.",
      classification: "MS",
      classifications: ["MS", "MA"],
      macroBlockId: "execution",
      macroBlockName: "Execution",
      capabilityId: "cap-auto",
      capabilityName: "Automation Capability",
      solutionId: "sol-analytics-recon",
      solutionIds: ["sol-analytics-recon"],
      technologyType: "Analytics / Monitoramento",
      rationale: "A conciliação volume/entrega e Loss Allowance compara dados e tolerâncias; analytics pode evidenciar divergências para revisão.",
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
        description: "`review_required` — revisão humana permanece necessária para dados, exceções, aprovações e/ou transações financeiras."
      },
      substeps: [
        {
          id: "step_18_18.1",
          sourceRef: "18.1",
          description: "Acesse o sistema T4 e inicie o fluxo de conciliação de volume/entrega. Efetue login com as credenciais válidas. Credenciais para acesso ao T4: Possuir credenciais de acesso válidas para entrar no sistema T4 antes de iniciar o processo de conciliação.",
          classification: "ME"
        },
        {
          id: "step_18_18.2",
          sourceRef: "18.2",
          description: "Após o login, no menu principal selecione a opção Inventory e, em seguida, escolha a opção P66 Inventory (Phillips 66).",
          classification: "ME"
        },
        {
          id: "step_18_18.3",
          sourceRef: "18.3",
          description: "No formulário de pesquisa do P66 Inventory, preencha os filtros conforme a fatura: - Shipper: selecione Phillips 66 (PHI). - DATE: selecione o mês correspondente à fatura. - Custody pipeline: selecione o pipeline indicado na fatura (ex.: Borger Amarillo pipeline). Clique em Search para carregar os resultados.",
          classification: "MA"
        },
        {
          id: "step_18_18.4",
          sourceRef: "18.4",
          description: "Revise a tela de resultados exibida após a pesquisa e identifique as colunas necessárias (por exemplo: nomination key, ticket status, actual quantity, schedule type).",
          classification: "ME"
        },
        {
          id: "step_18_18.5",
          sourceRef: "18.5",
          description: "Tire um screenshot da tela de resultados do T4 contendo as linhas e colunas usadas para conciliação e salve o arquivo localmente em formato JPG/JPEG. Evidência de tela e anexação: Capturar screenshot da tela de resultados do T4 em JPG/JPEG, salvar localmente e anexar no campo 'VIM Attachment-JPG/JPEG' do registro da fatura.",
          classification: "ME"
        },
        {
          id: "step_18_18.6",
          sourceRef: "18.6",
          description: "Compare os valores de entregas exibidos no T4 com os valores da fatura. Identifique correspondência entre os montantes faturados e os montantes efetivamente entregues.",
          classification: "MA"
        },
        {
          id: "step_18_18.7",
          sourceRef: "18.7",
          description: "No registro da fatura no VIM, abra a seção de anexos e anexe o arquivo JPG/JPEG com o screenshot salvo. Utilize o campo 'VIM Attachment-JPG/JPEG' conforme padrão. Evidência de tela e anexação: Capturar screenshot da tela de resultados do T4 em JPG/JPEG, salvar localmente e anexar no campo 'VIM Attachment-JPG/JPEG' do registro da fatura.",
          classification: "ME"
        },
        {
          id: "step_18_18.8",
          sourceRef: "18.8",
          description: "Abra a planilha commercial charge do intercompany que contém as faturas e informações para processamento de Loss Allowance. Localize a linha da fatura a ser processada.",
          classification: "ME"
        },
        {
          id: "step_18_18.9",
          sourceRef: "18.9",
          description: "No VIM, acesse a área VIM Analytics para localizar as informações relacionadas a Loss Allowance e às faturas do intercompany.",
          classification: "ME"
        },
        {
          id: "step_18_18.10",
          sourceRef: "18.10",
          description: "Em VIM Analytics, localize a coluna Reference. Selecione-a e cole o número da fatura conforme consta na planilha commercial charge.",
          classification: "ME"
        },
        {
          id: "step_18_18.11",
          sourceRef: "18.11",
          description: "Na linha da fatura colada, revise o campo Description para identificar se a fatura corresponde a 'loss allowance' ou outro tipo. Clique no campo de descrição para visualizar detalhes se necessário.",
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
          description: "Na coluna Description da lista VBD, aplique um filtro para isolar registros cujo cost type seja 'Loss Allowance' (por ex.: procurar os termos PLATA, PIPELINE, TPL conforme aplicável).",
          classification: "ME"
        },
        {
          id: "step_18_18.14",
          sourceRef: "18.14",
          description: "Revise os resultados filtrados para identificar linhas de fired pipeline. Se existir item identificado como 'gold loss allowance' e o processo local indicar que não deve ser processado, não selecione-o para continuação.",
          classification: "ME"
        },
        {
          id: "step_18_18.15",
          sourceRef: "18.15",
          description: "Se o processo exigir operação em Fiori (IC gold pl), abra a aplicação Fiori correspondente e navegue para a transação indicada no sistema para o processamento requerido.",
          classification: "MA"
        },
        {
          id: "step_18_18.16",
          sourceRef: "18.16",
          description: "Na exibição de resultados (por exemplo exportação do Fiori), copie a nomination key da segunda linha relevante. Em seguida, abra o registro da fatura e cole a nomination key no campo apropriado da fatura.",
          classification: "ME"
        },
        {
          id: "step_18_18.17",
          sourceRef: "18.17",
          description: "No registro da fatura, clique em Create Expenses e preencha os campos obrigatórios: - Expense class group - Expense class - Accounting type: selecione 'A' - Posting date - Partner Preencha conforme informações da fatura e do processo.",
          classification: "ME"
        },
        {
          id: "step_18_18.18",
          sourceRef: "18.18",
          description: "Copie o Reference number e o Net amount da fatura e insira nos campos correspondentes no formulário de expense. Salve o registro após preencher todos os campos.",
          classification: "MA"
        },
        {
          id: "step_18_18.19",
          sourceRef: "18.19",
          description: "Na aba Other data do registro de fatura/expense, acesse a pesquisa de VBD accrual. Insira o BOL (pode-se usar um BOL aleatório conforme processo) e a nomination key; clique em Execute para recuperar VBD accruals correspondentes.",
          classification: "MA"
        },
        {
          id: "step_18_18.20",
          sourceRef: "18.20",
          description: "Se a linha retornada na pesquisa de accrual VBD for a única relevante e não houver outros itens a serem usados, aplique Override para permitir uso desta única linha no processo.",
          classification: "ME"
        },
        {
          id: "step_18_18.21",
          sourceRef: "18.21",
          description: "No VBD selecionado, verifique se existe a data de lift (lift date) associada. Confirme que a data está correta antes de prosseguir.",
          classification: "ME"
        },
        {
          id: "step_18_18.22",
          sourceRef: "18.22",
          description: "Aplique Simulate Rules (Simulate) para a operação de VBD/expense. Verifique se o sistema sinaliza 'suspected duplicate'. Caso o sistema não apresente suspeitas, prosseguir para upload.",
          classification: "ME"
        },
        {
          id: "step_18_18.23",
          sourceRef: "18.23",
          description: "Faça o upload do arquivo/planilha (exportado do Fiori) que contém todas as linhas destacadas para processamento no ambiente VIM/T4, conforme o passo anterior.",
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
          description: "Depois do upload, atualize/refresh a vista de VIM Analytics para verificar se há suspected invoices. Identifique as linhas marcadas com ATA (se aplicável).",
          classification: "MS"
        },
        {
          id: "step_18_18.26",
          sourceRef: "18.26",
          description: "Ordene/filtre os resultados para localizar somente as opções ATA, PIPELINE e TPL. Para as linhas relevantes (por ex.: Amarillo‑tucumcari‑albuquerque‑loss allowance), copie os registros necessários para processamento posterior.",
          classification: "ME"
        },
        {
          id: "step_18_18.27",
          sourceRef: "18.27",
          description: "Copie o número de VBD necessário dos resultados filtrados e use este VBD na pesquisa de accrual VBD (Search Accrual VBD) para localizar o accrual correspondente.",
          classification: "MA"
        },
        {
          id: "step_18_18.28",
          sourceRef: "18.28",
          description: "No formulário de Accrual VBD, clique no campo Accrual VBD number, cole o número do VBD copiado e clique em Execute para recuperar o registro.",
          classification: "ME"
        },
        {
          id: "step_18_18.29",
          sourceRef: "18.29",
          description: "Se necessário, aplique override nas linhas apresentadas (por ex.: ATA). Utilize a segunda planilha exportada do Fiori para processar os registros adicionais: copie nomination keys, cole nos campos correspondentes, clique em Execute para carregar os dados e retornar às Line Items para salvar as diferenças. Depois, crie expenses adicionais quando existir diferença e salve as alterações.",
          classification: "MA"
        },
        {
          id: "step_18_18.30",
          sourceRef: "18.30",
          description: "Execute Simulate Rules novamente, aplique as regras (Apply Rules) e depois atualize/refresh o VIM Analytics para identificar quaisquer suspected invoices ou alterações de status geradas pelo processamento.",
          classification: "ME"
        },
        {
          id: "step_18_18.31",
          sourceRef: "18.31",
          description: "Monitore o status da fatura processada; se o status mudar para 'Posted' durante o processamento, clique em Refresh no VIM Analytics para confirmar o novo status e encerrar a verificação.",
          classification: "ME"
        },
      ]
    },
    {
      id: "step_19",
      sourceStep: "19",
      number: "19",
      title: "Invoice Processing Gain & Loss — classificação, atribuição de GL/Company/Profit Center e envio para aprovações Executable procedure para iden",
      description: "Executable procedure para identificar, classificar e preparar faturas Gain & Loss no VIM Workplace, preencher os campos obrigatórios (document type, vendor, requester email, GL account, company code e profit center conforme região) e encaminhar para o fluxo de aprovações (duas camadas; envio para Gina na segunda etapa).",
      classification: "MS",
      classifications: ["MS", "MA"],
      macroBlockId: "routing",
      macroBlockName: "Routing",
      capabilityId: "cap-auto",
      capabilityName: "Automation Capability",
      solutionId: "sol-wf-routing",
      solutionIds: ["sol-wf-routing"],
      technologyType: "Workflow",
      rationale: "Classificação, atribuição contábil e aprovação exigem encaminhamento, alçada e validação de múltiplas informações.",
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
        description: "`approval_required` — revisão humana permanece necessária para dados, exceções, aprovações e/ou transações financeiras."
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
          description: "Para cada fatura listada como Gain & Loss, abrir o registro da fatura para edição dos campos necessários descritos nos passos seguintes.",
          classification: "ME"
        },
        {
          id: "step_19_19.2",
          sourceRef: "19.2",
          description: "Atualizar os campos de cabeçalho da fatura diretamente no VIM Workplace conforme os dados apresentados na cópia da fatura.",
          classification: "ME"
        },
        {
          id: "step_19_19.2.1",
          sourceRef: "19.2.1",
          description: "Se a fatura estiver associada ao processamento Gain & Loss, definir o campo 'Document Type' para 'Non-Po Manual' conforme instrução.",
          classification: "ME"
        },
        {
          id: "step_19_19.2.2",
          sourceRef: "19.2.2",
          description: "Atualizar o campo 'Vendor Number' com o número do fornecedor que consta na cópia da fatura.",
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
          description: "Ir para a aba/área de Line Items da fatura para inserir os dados contábeis por linha conforme instruções específicas de GL, Company Code e Profit Center.",
          classification: "ME"
        },
        {
          id: "step_19_19.3.1",
          sourceRef: "19.3.1",
          description: "Localizar a(s) linha(s) que representam o ganho/ perda e selecionar a linha para edição dos campos: GL Account, Company Code e Profit Center.",
          classification: "ME"
        },
        {
          id: "step_19_19.4",
          sourceRef: "19.4",
          description: "Identificar a região aplicável (East Coast, Gulf Coast, Midcontinent, West Coast) com base na descrição da fatura e nos mapas associados. Controle: Aprovação em dois níveis obrigatória: Todas as faturas Gain & Loss devem passar por dois níveis de aprovação antes do sistema postar a fatura.",
          classification: "MS"
        },
        {
          id: "step_19_19.5",
          sourceRef: "19.5",
          description: "Para faturas classificadas como East Coast, preencher os campos GL Account, Company Code e Profit Center na(s) linha(s) da fatura conforme o mapa/regra de região. Controle: Aprovação em dois níveis obrigatória: Todas as faturas Gain & Loss devem passar por dois níveis de aprovação antes do sistema postar a fatura.",
          classification: "MS"
        },
        {
          id: "step_19_19.5.1",
          sourceRef: "19.5.1",
          description: "No campo 'GL Account', inserir o código GL correspondente à natureza do ganho/perda conforme orientação regional (consultar mapa).",
          classification: "MA"
        },
        {
          id: "step_19_19.5.2",
          sourceRef: "19.5.2",
          description: "No campo 'Company Code', inserir o código da companhia indicada na fatura.",
          classification: "ME"
        },
        {
          id: "step_19_19.5.3",
          sourceRef: "19.5.3",
          description: "No campo 'Profit Center', inserir o Profit Center correspondente à East Coast conforme o mapa/regra. Controle: Aprovação em dois níveis obrigatória: Todas as faturas Gain & Loss devem passar por dois níveis de aprovação antes do sistema postar a fatura.",
          classification: "MA"
        },
        {
          id: "step_19_19.6",
          sourceRef: "19.6",
          description: "Para faturas classificadas como Gulf Coast, preencher GL Account, Company Code e Profit Center conforme o mapa/regra regional. Controle: Aprovação em dois níveis obrigatória: Todas as faturas Gain & Loss devem passar por dois níveis de aprovação antes do sistema postar a fatura.",
          classification: "MS"
        },
        {
          id: "step_19_19.6.1",
          sourceRef: "19.6.1",
          description: "Preencher 'GL Account' de acordo com a natureza do débito/crédito na fatura.",
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
          description: "Preencher 'Profit Center' para Gulf Coast conforme mapa/regra. Controle: Aprovação em dois níveis obrigatória: Todas as faturas Gain & Loss devem passar por dois níveis de aprovação antes do sistema postar a fatura.",
          classification: "MS"
        },
        {
          id: "step_19_19.7",
          sourceRef: "19.7",
          description: "Para faturas classificadas como Midcontinent, preencher GL Account, Company Code e Profit Center conforme o mapa/regra regional. Controle: Aprovação em dois níveis obrigatória: Todas as faturas Gain & Loss devem passar por dois níveis de aprovação antes do sistema postar a fatura.",
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
          description: "Preencher 'Profit Center' para Midcontinent conforme mapa/regra. Controle: Aprovação em dois níveis obrigatória: Todas as faturas Gain & Loss devem passar por dois níveis de aprovação antes do sistema postar a fatura.",
          classification: "MS"
        },
        {
          id: "step_19_19.8",
          sourceRef: "19.8",
          description: "Para faturas classificadas como West Coast, preencher GL Account, Company Code e Profit Center conforme o mapa/regra regional. Controle: Aprovação em dois níveis obrigatória: Todas as faturas Gain & Loss devem passar por dois níveis de aprovação antes do sistema postar a fatura.",
          classification: "MS"
        },
        {
          id: "step_19_19.8.1",
          sourceRef: "19.8.1",
          description: "Preencher 'GL Account' conforme o tipo de transação indicado na fatura.",
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
          description: "Preencher 'Profit Center' para West Coast conforme mapa/regra. Controle: Aprovação em dois níveis obrigatória: Todas as faturas Gain & Loss devem passar por dois níveis de aprovação antes do sistema postar a fatura.",
          classification: "MS"
        },
        {
          id: "step_19_19.9",
          sourceRef: "19.9",
          description: "Após preencher cabeçalho e line items, executar a sequência: Salvar → Simular rules → Apply rules para validar as regras automáticas do VIM.",
          classification: "ME"
        },
        {
          id: "step_19_19.9.1",
          sourceRef: "19.9.1",
          description: "Clicar/selecionar 'Save' para persistir as alterações da fatura no VIM.",
          classification: "ME"
        },
        {
          id: "step_19_19.9.2",
          sourceRef: "19.9.2",
          description: "Executar 'Simulate rules' para validar o comportamento das regras configuradas sobre a fatura (simulação pré-aplicação).",
          classification: "ME"
        },
        {
          id: "step_19_19.9.3",
          sourceRef: "19.9.3",
          description: "Executar 'Apply rules' para efetivar as regras que irão definir roteamento e possíveis campos automáticos.",
          classification: "ME"
        },
        {
          id: "step_19_19.10",
          sourceRef: "19.10",
          description: "Após apply rules, registrar sua aprovação na fatura (primeiro nível).",
          classification: "MS"
        },
        {
          id: "step_19_19.10.1",
          sourceRef: "19.10.1",
          description: "No VIM, selecionar a opção para registrar sua aprovação/autoridade na fatura (marcar/selecionar 'approve' ou preencher campo de aprovação conforme a interface disponível).",
          classification: "MS"
        },
        {
          id: "step_19_19.11",
          sourceRef: "19.11",
          description: "Encaminhar a fatura para a aprovação da Gina conforme procedimento: enviar para Gina após ter registrado sua aprovação. Controle: Aprovação em dois níveis obrigatória: Todas as faturas Gain & Loss devem passar por dois níveis de aprovação antes do sistema postar a fatura. Encaminhamento para Gina: Depois de registrar sua aprovação (nível 1), encaminhar a fatura para Gina para o segundo nível de aprovação. · Gina",
          classification: "MS"
        },
        {
          id: "step_19_19.11.1",
          sourceRef: "19.11.1",
          description: "Após registrar sua aprovação, selecionar a ação de encaminhamento/submit que envia a fatura para a aprovação seguinte e/ou colocar Gina como aprovadora responsável conforme o fluxo indicado.",
          classification: "MS"
        },
        {
          id: "step_19_19.12",
          sourceRef: "19.12",
          description: "Observação: todo processo Gain & Loss passa por duas camadas de aprovação. Depois que as aprovações forem concluídas (nível 1 e nível 2 — Gina), a fatura será automaticamente posta pelo sistema conforme o fluxo padrão.",
          classification: "MS"
        },
      ]
    },
    {
      id: "step_20",
      sourceStep: "20",
      number: "20",
      title: "Process 999+ (Analista) — gerar relatório 999, preparar arquivo e submeter para execução em background Executar a rotina 999+ para associar VBDs ao i",
      description: "Executar a rotina 999+ para associar VBDs ao invoice quando o número de VBDs excede o limite exibido em SAP; preparar arquivos, solicitar execução, acompanhar job em background, consolidar resultados e notificar partes interessadas.",
      classification: "ME",
      classifications: ["ME", "MS"],
      macroBlockId: "execution",
      macroBlockName: "Execution",
      capabilityId: "cap-auto",
      capabilityName: "Automation Capability",
      solutionId: "sol-rpa-report",
      solutionIds: ["sol-rpa-report"],
      technologyType: "RPA / Spreadsheet",
      rationale: "A rotina 999+ usa relatório, arquivo e execução em background, com regras relativamente estruturadas.",
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
        description: "`review_required` — revisão humana permanece necessária para dados, exceções, aprovações e/ou transações financeiras."
      },
      substeps: [
        {
          id: "step_20_20.1",
          sourceRef: "20.1",
          description: "Registrar a solicitação enviada pelo analista que pede a execução dos relatórios 999 e que gerará arquivo entregue via e-mail para o processador. Salvar anexo em pasta do sistema: Salvar o arquivo/anexo recebido do analista em uma pasta do sistema para referência e auditoria.",
          classification: "MA"
        },
        {
          id: "step_20_20.1.1",
          sourceRef: "20.1.1",
          description: "Salvar o arquivo/anexo recebido na caixa de correio pessoal em uma pasta do sistema para referência e processamento posterior. Salvar anexo em pasta do sistema: Salvar o arquivo/anexo recebido do analista em uma pasta do sistema para referência e auditoria.",
          classification: "MA"
        },
        {
          id: "step_20_20.1.2",
          sourceRef: "20.1.2",
          description: "Abrir a cópia do invoice e verificar: Vendor Name e Vendor Number, Invoice Number, Invoice Amount, Payment Terms e Due Date; registrar observações no tracker.",
          classification: "ME"
        },
        {
          id: "step_20_20.2",
          sourceRef: "20.2",
          description: "Construir o corpo do e-mail com os campos exigidos para a execução 999 conforme recebido: Vendor no, Company Code, Profit Centre, Invoice No, Document No, GL Account, Invoice Amount; manter rascunho para envio após coleta de demais dados. Formato do e‑mail para solicitação 999: Incluir '999' no assunto seguido de Vendor Name e Invoice/Reference No; enviar 'Para' o Generic Mail ID 'Secondary Post/Clear & Vendor modifications' e colocar em 'Cc' o analista originador.",
          classification: "MA"
        },
        {
          id: "step_20_20.3",
          sourceRef: "20.3",
          description: "Criar ou atualizar um arquivo Excel de controle contendo as informações do invoice e o histórico de ações (coluna Comments) para acompanhamento do processo 999+.",
          classification: "ME"
        },
        {
          id: "step_20_20.4",
          sourceRef: "20.4",
          description: "No SAP, abrir a transação ZEWB (Custom Trading Expense Workbench) e selecionar a opção 'Accrual/Receivable VBD Docs'. Preencher os parâmetros de busca: Vendor Number (conforme e-mail ou vendor list) e Transaction Date (conforme invoice).",
          classification: "ME"
        },
        {
          id: "step_20_20.5",
          sourceRef: "20.5",
          description: "Executar a pesquisa no ZEWB; exportar o resultado para Excel; salvar o arquivo extraído no sistema na mesma pasta usada para os documentos do caso.",
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
          description: "Abrir o arquivo Excel salvo e localizar a coluna com os VBD Numbers; preparar para cópia.",
          classification: "ME"
        },
        {
          id: "step_20_20.6.2",
          sourceRef: "20.6.2",
          description: "Selecionar todas as células que contêm os VBD Numbers e copiar (Colar em coluna A de um arquivo de trabalho se necessário).",
          classification: "ME"
        },
        {
          id: "step_20_20.7",
          sourceRef: "20.7",
          description: "No SAP, executar a transação ZRTR_VIM_999 (ZRTR_VIM_999 – VIM Posting 999) para preparar o posting dos VBDs copiados.",
          classification: "ME"
        },
        {
          id: "step_20_20.8",
          sourceRef: "20.8",
          description: "Na tela ZRTR_VIM_999: acessar o campo 'Accrual VBD Number' (clicar na seta para lista quando houver muitos VBDs), colar todos os VBDs copiados e clicar em Execute. A execução salva a operação e retorna à página anterior.",
          classification: "ME"
        },
        {
          id: "step_20_20.9",
          sourceRef: "20.9",
          description: "Clicar em 'Show Document selection' para visualizar todos os VBDs disponíveis a partir da execução; aguardar a geração completa do relatório.",
          classification: "ME"
        },
        {
          id: "step_20_20.10",
          sourceRef: "20.10",
          description: "Atualizar o rascunho de e-mail com as informações geradas: incluir '999' no assunto juntamente com Vendor Name & Invoice/Reference No; colocar o Generic Mail ID 'Secondary Post/Clear & Vendor modifications' no campo Para e em Cc o analista que originou a solicitação; colar o texto do modelo da região apropriada (ex.: MIDCON) e anexar a cópia do invoice, invoice reference number, net due date e total payout amount. Formato do e‑mail para solicitação 999: Incluir '999' no assunto seguido de Vendor Name e Invoice/Reference No; enviar 'Para' o Generic Mail ID 'Secondary Post/Clear & Vendor modifications' e colocar em 'Cc' o analista originador.",
          classification: "MA"
        },
        {
          id: "step_20_20.11",
          sourceRef: "20.11",
          description: "Comparar o número total de VBDs enviados (ex.: 5996) com os VBDs retornados pela execução (ex.: 5879). Registrar no tracker os VBDs ausentes e possíveis razões (used, cancelled, blocked).",
          classification: "MA"
        },
        {
          id: "step_20_20.12",
          sourceRef: "20.12",
          description: "No menu Program, selecionar 'Execute in Background'; no pop-up de Output Device informar 'LOCL' e clicar em Properties. Definição do Output Device: Informar 'LOCL' no campo Output Device ao executar em background conforme procedimento.",
          classification: "ME"
        },
        {
          id: "step_20_20.12.1",
          sourceRef: "20.12.1",
          description: "Verificar e confirmar as informações na tela de propriedades e confirmar (Tick). Definição do Output Device: Informar 'LOCL' no campo Output Device ao executar em background conforme procedimento.",
          classification: "ME"
        },
        {
          id: "step_20_20.13",
          sourceRef: "20.13",
          description: "Na área 'Output Options' acessar Priority, alterar de 'Medium' para 'High' (Print Priority - High) e confirmar (Tick). Prioridade do job: Alterar a prioridade do job de 'Medium' para 'High' (Print Priority - High) antes de salvar a execução em background.",
          classification: "ME"
        },
        {
          id: "step_20_20.14",
          sourceRef: "20.14",
          description: "Confirmar os parâmetros mostrados; ao clicar no Tick, será mostrado o painel Start time. Selecionar 'Immediate' e salvar para submeter o job em background.",
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
          description: "Marcar no arquivo de controle (tracker) a linha correspondente com o status '999 run'. Anexar ao rascunho de e‑mail o Excel com a lista completa de VBDs que foi recebida do analista (entrada original).",
          classification: "MA"
        },
        {
          id: "step_20_20.15.1",
          sourceRef: "20.15.1",
          description: "Editar a coluna 'Comments' ou 'Status' no tracker para indicar que o job 999 está em execução.",
          classification: "ME"
        },
        {
          id: "step_20_20.15.2",
          sourceRef: "20.15.2",
          description: "Anexar o arquivo Excel contendo os VBDs ao rascunho do e‑mail preparado anteriormente.",
          classification: "ME"
        },
        {
          id: "step_20_20.16",
          sourceRef: "20.16",
          description: "Após submeter o job em background (pode levar horas), abrir a transação FBL1N – Vendor Line items; informar Vendor Code e gerar o relatório.",
          classification: "ME"
        },
        {
          id: "step_20_20.16.1",
          sourceRef: "20.16.1",
          description: "No SAP, executar T.Code 'FBL1N', inserir o Vendor Code e clicar no botão de execução para gerar os line items.",
          classification: "ME"
        },
        {
          id: "step_20_20.17",
          sourceRef: "20.17",
          description: "No resultado do FBL1N acessar Layout e selecionar o layout 'E Block 999' como padrão; garantir que o campo 'Payment Block' esteja disponível e filtrar por 'E' para identificar itens com bloqueio E.",
          classification: "ME"
        },
        {
          id: "step_20_20.18",
          sourceRef: "20.18",
          description: "Acessar a transação ZRTR_VIM_E_FI_SUMRIZ (FI Summarization). Inserir Posting Date (data em que iniciou a execução 999+) e Vendor No; submeter o programa via 'Execute in Background'.",
          classification: "ME"
        },
        {
          id: "step_20_20.19",
          sourceRef: "20.19",
          description: "No pop-up de Output Device inserir 'LOCL', clicar Properties, verificar informações e confirmar; em Output Options alterar Priority para 'High' e confirmar; em Start time escolher 'Immediate' e salvar para execução em background. Definição do Output Device: Informar 'LOCL' no campo Output Device ao executar em background conforme procedimento. Prioridade do job: Alterar a prioridade do job de 'Medium' para 'High' (Print Priority - High) antes de salvar a execução em background.",
          classification: "ME"
        },
        {
          id: "step_20_20.20",
          sourceRef: "20.20",
          description: "Aguardar alguns minutos (normalmente 5–10; para execuções grandes até ~4 horas conforme volume) até que o job finalize; durante esse tempo atualizar o tracker com comentários de progresso.",
          classification: "ME"
        },
        {
          id: "step_20_20.21",
          sourceRef: "20.21",
          description: "Voltar ao workplace SAP, selecionar o layout da ferramenta de Summarization e usar List -> Refresh para carregar o resultado; se apenas parte estiver processada, repetir refresh até completar.",
          classification: "ME"
        },
        {
          id: "step_20_20.22",
          sourceRef: "20.22",
          description: "Confirmar se a Summarization Tool exibiu todos os itens esperados e se o processo foi concluído.",
          classification: "MS"
        },
        {
          id: "step_20_20.23",
          sourceRef: "20.23",
          description: "Comparar o valor total do invoice com o total apresentado pelo Summarization Report; calcular a diferença (ex.: Invoice $98,195.77 menos SAP $97,004.91 = $1,190.86) e registrar o valor adicional em planilha e rascunho de e-mail.",
          classification: "MA"
        },
        {
          id: "step_20_20.24",
          sourceRef: "20.24",
          description: "Do Summarization Report copiar todos os Document Nos gerados; atualizar o rascunho do e‑mail adicionando o 'additional amount' (diferença apurada) e a lista de Document Nos; revisar e enviar o e‑mail ao Generic Mail ID (Secondary Post/Clear & Vendor modifications) com Cc ao analista originador. Formato do e‑mail para solicitação 999: Incluir '999' no assunto seguido de Vendor Name e Invoice/Reference No; enviar 'Para' o Generic Mail ID 'Secondary Post/Clear & Vendor modifications' e colocar em 'Cc' o analista originador.",
          classification: "MA"
        },
        {
          id: "step_20_20.24.1",
          sourceRef: "20.24.1",
          description: "Selecionar e copiar todos os Document Nos apresentados no Summarization Report para inclusão no e‑mail.",
          classification: "ME"
        },
        {
          id: "step_20_20.24.2",
          sourceRef: "20.24.2",
          description: "Adicionar no corpo do e‑mail o valor adicional, a lista de Document Nos e qualquer atualização relevante do tracker; enviar o e‑mail conforme destinatários padronizados. Formato do e‑mail para solicitação 999: Incluir '999' no assunto seguido de Vendor Name e Invoice/Reference No; enviar 'Para' o Generic Mail ID 'Secondary Post/Clear & Vendor modifications' e colocar em 'Cc' o analista originador.",
          classification: "MA"
        },
        {
          id: "step_20_20.25",
          sourceRef: "20.25",
          description: "Aguardar retorno do P66 Team; quando receberem e processarem o pagamento, o time enviará por reply o Document No final consolidado. Verificar a resposta, confirmar os detalhes e marcar no tracker que o pagamento do vendor foi realizado.",
          classification: "ME"
        },
      ]
    },
    {
      id: "step_21",
      sourceStep: "21",
      number: "21",
      title: "Process 999+ (Supervisor) — Postagem, Clear Vendor e Ajustes (F-44 e controle de Due/Baseline Date) Executable sequence para o Supervisor realizar o",
      description: "Executable sequence para o Supervisor realizar o clear vendor via F-44, ajustar lançamentos (charge off), inserir chaves e códigos, confirmar lançamentos e alterar Due Date / Baseline Date conforme dados fornecidos pelo Analyst.",
      classification: "MS",
      classifications: ["MS"],
      macroBlockId: "execution",
      macroBlockName: "Execution",
      capabilityId: "cap-auto",
      capabilityName: "Automation Capability",
      solutionId: "sol-wf-routing",
      solutionIds: ["sol-wf-routing"],
      technologyType: "Workflow",
      rationale: "Postagem, clearing e ajustes financeiros são transações sensíveis e devem manter controle e aprovação humana.",
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
        description: "`review_required` — revisão humana permanece necessária para dados, exceções, aprovações e/ou transações financeiras."
      },
      substeps: [
        {
          id: "step_21_21.1",
          sourceRef: "21.1",
          description: "Abrir a mensagem recebida do Analyst que contém a invoice para upload 999 VBD e extrair os campos obrigatórios: vendor number, document number, company code e indicação de write off (se aplicável). Salvar anexos localmente para referência. Controle: campos obrigatórios no e-mail do Analyst: O e-mail do Analyst deve conter, no corpo ou em anexo, os seguintes campos: Vendor number, Document number, Company code e indicação sobre write off adicional. Sem esses campos não prossiga com F-44.",
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
          description: "Copiar do corpo do e-mail ou do anexo os seguintes campos exatamente como enviados: Vendor number, Document number, Company code e informação sobre write off adicional. Registrar em planilha de controle ou sistema interno usado pelo time.",
          classification: "ME"
        },
        {
          id: "step_21_21.2",
          sourceRef: "21.2",
          description: "Acessar o SAP com credenciais do Supervisor e chamar a transação F-44 (Clear Vendor). Inserir o Account (número de conta/fornecedor) conforme o campo 'vendor number' recebido no e-mail.",
          classification: "ME"
        },
        {
          id: "step_21_21.2.1",
          sourceRef: "21.2.1",
          description: "Efetuar login no SAP e executar a transação digitando F-44 na barra de comandos. Confirmar que a tela de Clear Vendor foi carregada.",
          classification: "ME"
        },
        {
          id: "step_21_21.2.2",
          sourceRef: "21.2.2",
          description: "No campo Account da tela F-44, inserir o vendor/account number exatamente como informado no e-mail e avançar (Enter) para carregar os line items do fornecedor.",
          classification: "ME"
        },
        {
          id: "step_21_21.3",
          sourceRef: "21.3",
          description: "Após carregar os line items do fornecedor, localizar o line item relacionado ao Document number informado e marcar a opção para 'Charge off difference'.",
          classification: "ME"
        },
        {
          id: "step_21_21.3.1",
          sourceRef: "21.3.1",
          description: "Localizar na lista o line item que contém o Document number recebido do Analyst. Selecionar esse line item para edição.",
          classification: "ME"
        },
        {
          id: "step_21_21.3.2",
          sourceRef: "21.3.2",
          description: "Com o line item selecionado, ativar/selecionar a opção 'Charge off difference' para habilitar o lançamento de diferença (charge off).",
          classification: "ME"
        },
        {
          id: "step_21_21.4",
          sourceRef: "21.4",
          description: "Na linha de ajustes após ativar charge off, selecionar a Posting Key necessária e preencher o campo Account com o vendor number conforme instruído. Confirmar com Enter para aplicar os valores provisórios.",
          classification: "ME"
        },
        {
          id: "step_21_21.4.1",
          sourceRef: "21.4.1",
          description: "Escolher a Posting Key apropriada para o tipo de ajuste (conforme instrução interna) no campo Posting Key da linha de ajuste.",
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
          description: "Inserir o Amount de ajuste exatamente conforme informado pelo Analyst. Após preencher, clicar em 'Process open items' para que o sistema calcule o balanço. Exceção: totais não balanceados após 'Process open items': Condição: Após 'Process open items' o NET não está em 0.. Ações: Selecionar novamente 'Charge off difference'.; Revisar e ajustar o Amount inserido e as Posting Keys.; Reexecutar 'Process open items'.. Resultado: 21.3 · Após carregar os line items do fornecedor, localizar o line item relacionado ao Document number informado e marcar a opção para 'Charge off difference'.",
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
          description: "Clicar em 'Process open items' para que o SAP avalie o balanço do lançamento.",
          classification: "ME"
        },
        {
          id: "step_21_21.6",
          sourceRef: "21.6",
          description: "Avaliar o resultado do 'Process open items' para confirmar balanceamento do lançamento. Exceção: totais não balanceados após 'Process open items': Condição: Após 'Process open items' o NET não está em 0.. Ações: Selecionar novamente 'Charge off difference'.; Revisar e ajustar o Amount inserido e as Posting Keys.; Reexecutar 'Process open items'.. Resultado: 21.3 · Após carregar os line items do fornecedor, localizar o line item relacionado ao Document number informado e marcar a opção para 'Charge off difference'.",
          classification: "MS"
        },
        {
          id: "step_21_21.7",
          sourceRef: "21.7",
          description: "Selecionar a Posting Key final conforme necessidade, preencher o Account com o vendor number, inserir o Amount que será ajustado, informar o Tax Code (por exemplo IO se aplicável) e demais campos obrigatórios (ex.: centro de custo/profit center). Controle: tax code e profit center conforme Analyst: O Tax Code (ex.: IO) e o Profit Center devem ser inseridos exatamente como fornecidos pelo Analyst antes de salvar o lançamento.",
          classification: "ME"
        },
        {
          id: "step_21_21.7.1",
          sourceRef: "21.7.1",
          description: "No campo Tax Code informar o código fornecido (ex.: IO) conforme instrução do Analyst.",
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
          description: "Inserir o Profit Center informado pelo Analyst e verificar se o NET do documento passou a 0 após ajustes. Controle: tax code e profit center conforme Analyst: O Tax Code (ex.: IO) e o Profit Center devem ser inseridos exatamente como fornecidos pelo Analyst antes de salvar o lançamento.",
          classification: "MS"
        },
        {
          id: "step_21_21.9",
          sourceRef: "21.9",
          description: "Abrir a transação FBL1N, inserir o vendor/account e executar a exibição. Localizar o documento pelo Document number e confirmar que o total e o status correspondem ao que foi postado.",
          classification: "MA"
        },
        {
          id: "step_21_21.9.1",
          sourceRef: "21.9.1",
          description: "Acessar FBL1N, informar o vendor/account e executar a visualização para listar line items.",
          classification: "ME"
        },
        {
          id: "step_21_21.9.2",
          sourceRef: "21.9.2",
          description: "Localizar o Document number e confirmar que o valor total exibido na listagem é igual ao informado pelo Analyst e que o documento está com status postado.",
          classification: "ME"
        },
        {
          id: "step_21_21.10",
          sourceRef: "21.10",
          description: "Abrir a função Change and Display no documento postado para alterar o Due Date conforme instrução do Analyst e ajustar o Baseline Date para a posting date informada. Validar a regra de prazo indicada pelo Analyst (Baseline Date deve ser anterior em até 14 dias — ver unknown). Salvar as alterações. Incógnita: interpretação exata da regra 'before 14 days' para Baseline Date: A regra indicada na fonte diz: 'the date should be before 14 days for the date to be posted.' A interpretação aplicada deve ser confirmada com o Analyst se houver dúvida sobre qual data comparar (posting date vs. due date) ou se a janela é estritamente '<= 14 dias'.",
          classification: "MA"
        },
        {
          id: "step_21_21.10.1",
          sourceRef: "21.10.1",
          description: "No SAP, abrir o documento em modo Change/Display (Change) que permita edição de Due Date e Baseline Date.",
          classification: "ME"
        },
        {
          id: "step_21_21.10.2",
          sourceRef: "21.10.2",
          description: "Alterar o campo Due Date para o valor informado pelo Analyst. Ajustar o Baseline Date para a posting date indicada pelo Analyst. Salvar as alterações.",
          classification: "ME"
        },
        {
          id: "step_21_21.11",
          sourceRef: "21.11",
          description: "Avaliar se o Baseline Date definido atende à restrição indicada pelo Analyst (ver nota de fonte). Incógnita: interpretação exata da regra 'before 14 days' para Baseline Date: A regra indicada na fonte diz: 'the date should be before 14 days for the date to be posted.' A interpretação aplicada deve ser confirmada com o Analyst se houver dúvida sobre qual data comparar (posting date vs. due date) ou se a janela é estritamente '<= 14 dias'.",
          classification: "MA"
        },
      ]
    },
    {
      id: "step_22",
      sourceStep: "22",
      number: "22",
      title: "DCP Processing Front Range Transportation — extração do Nomination Key (NK) via Fiori e geração/tratamento de VBD para transport system USDCPPFTRG",
      description: "Procedimento para localizar o Nom Key (NK) nas faturas do fornecedor Front Range Pipeline LLC usando SAP Fiori, gerar ou reconciliar o VBD conforme codificação para o transport system USDCPPFTRG, capturar evidências e proceder com o processamento da fatura.",
      classification: "ME",
      classifications: ["ME", "MS"],
      macroBlockId: "execution",
      macroBlockName: "Execution",
      capabilityId: "cap-auto",
      capabilityName: "Automation Capability",
      solutionId: "sol-rpa-upload-vim",
      solutionIds: ["sol-rpa-upload-vim"],
      technologyType: "RPA",
      rationale: "A extração de NK e geração de VBD são estruturadas, mas dependem de informações do caso e conferência de resultado.",
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
        description: "`review_required` — revisão humana permanece necessária para dados, exceções, aprovações e/ou transações financeiras."
      },
      substeps: [
        {
          id: "step_22_22.1",
          sourceRef: "22.1",
          description: "Preparar ambiente e acessar o SAP Fiori para iniciar a localização do Nom Key.",
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
          description: "Abra o SAP Fiori com suas credenciais habituais e navegue para a aplicação de consulta/visualização de invoices/nomination keys disponível no ambiente.",
          classification: "ME"
        },
        {
          id: "step_22_22.2",
          sourceRef: "22.2",
          description: "No filtro/área de pesquisa da aplicação Fiori, informe a data agendada correspondente ao processamento e selecione o transport system USDCPPFTRG para limitar os resultados.",
          classification: "MA"
        },
        {
          id: "step_22_22.2.1",
          sourceRef: "22.2.1",
          description: "Digite a scheduled date (data agendada) exatamente como consta no arquivo ou na notificação do scheduler para filtrar as faturas relacionadas a esse dia.",
          classification: "ME"
        },
        {
          id: "step_22_22.2.2",
          sourceRef: "22.2.2",
          description: "No campo de seleção do sistema de transporte, escolha/insira USDCPPFTRG para restringir a busca às movimentações processadas por esse transport system.",
          classification: "ME"
        },
        {
          id: "step_22_22.3",
          sourceRef: "22.3",
          description: "Aplicar filtro/coluna de origem e localizar o Nomination Key (NK) associado à linha da fatura conforme o campo 'origin'.",
          classification: "ME"
        },
        {
          id: "step_22_22.3.1",
          sourceRef: "22.3.1",
          description: "Use o campo origin/Origem na visualização para limitar os registros àquele ponto de origem indicado na fatura.",
          classification: "ME"
        },
        {
          id: "step_22_22.3.2",
          sourceRef: "22.3.2",
          description: "Revise os resultados filtrados e identifique o campo Nom Key/NK correspondente à linha de invoice. Anote o NK para uso na geração/associação do VBD.",
          classification: "MA"
        },
        {
          id: "step_22_22.4",
          sourceRef: "22.4",
          description: "Capturar screenshot do line-item que contém o Nom Key e demais dados relevantes e enviar ao analista como confirmação da localização do NK. Requisito de evidência do line-item e ajuste: A captura de tela deve mostrar claramente o número da fatura, o line-item, o Nom Key identificado e os valores antes/depois de qualquer ajuste; essas imagens devem ser anexadas à confirmação enviada ao analista.",
          classification: "MA"
        },
        {
          id: "step_22_22.4.1",
          sourceRef: "22.4.1",
          description: "Tire uma captura de tela que inclua, no mínimo, o número da fatura, o line-item, o Nom Key identificado e os campos de origem e valor visíveis. Requisito de evidência do line-item e ajuste: A captura de tela deve mostrar claramente o número da fatura, o line-item, o Nom Key identificado e os valores antes/depois de qualquer ajuste; essas imagens devem ser anexadas à confirmação enviada ao analista.",
          classification: "MA"
        },
        {
          id: "step_22_22.4.2",
          sourceRef: "22.4.2",
          description: "Anexe o screenshot ao e-mail de confirmação ao analista responsável indicando o Nom Key localizado e prossiga após confirmação do analista, conforme instruído.",
          classification: "MA"
        },
        {
          id: "step_22_22.5",
          sourceRef: "22.5",
          description: "Com o Nom Key identificado e a codificação aplicada segundo a origem, gere o VBD necessário para o processamento da fatura ou associe o NK ao VBD já existente. Tratamento de storage invoices com VBD auto‑fired: Se a fatura pertencer a storage invoices (nota de armazenamento), reconheça que o item pode ter VBD auto‑fired; neste caso, valide a presença do VBD auto‑fired antes de gerar VBD manual.",
          classification: "ME"
        },
        {
          id: "step_22_22.5.1",
          sourceRef: "22.5.1",
          description: "Avalie se já existe um VBD auto‑fired para o item; se não existir, proceda para geração do VBD manual conforme a codificação aplicável ao origin/NK. Tratamento de storage invoices com VBD auto‑fired: Se a fatura pertencer a storage invoices (nota de armazenamento), reconheça que o item pode ter VBD auto‑fired; neste caso, valide a presença do VBD auto‑fired antes de gerar VBD manual.",
          classification: "ME"
        },
        {
          id: "step_22_22.5.2",
          sourceRef: "22.5.2",
          description: "Gere o VBD manualmente ou associe o NK ao VBD existente seguindo a codificação (trip/non‑trip ou outra codificação aplicável) indicada na fatura.",
          classification: "ME"
        },
        {
          id: "step_22_22.6",
          sourceRef: "22.6",
          description: "Comparar o valor cobrado na fatura com o valor do VBD associado/gerado e decidir o tratamento segundo a tolerância estabelecida. Procedimento para discrepância fora da tolerância: Quando a diferença entre a fatura e o VBD estiver fora da tolerância estabelecida · Pendente — procedimento de escalonamento não detalhado neste trecho",
          classification: "MA"
        },
        {
          id: "step_22_22.7",
          sourceRef: "22.7",
          description: "Quando a discrepância for considerada dentro da tolerância, ajustar o valor da fatura para coincidir com o valor do VBD e registrar evidência do ajuste.",
          classification: "MA"
        },
        {
          id: "step_22_22.7.1",
          sourceRef: "22.7.1",
          description: "Ajuste o valor da fatura para refletir o valor do VBD conforme permitido pela tolerância. Execute o ajuste utilizando o procedimento de ajuste vigente na interface de processamento de invoices que você usa para este tipo de fatura.",
          classification: "MA"
        },
        {
          id: "step_22_22.7.2",
          sourceRef: "22.7.2",
          description: "Tire screenshot(s) comprovando o valor original, o valor do VBD e o ajuste realizado; anexe estas evidências ao registro/transação da fatura. Requisito de evidência do line-item e ajuste: A captura de tela deve mostrar claramente o número da fatura, o line-item, o Nom Key identificado e os valores antes/depois de qualquer ajuste; essas imagens devem ser anexadas à confirmação enviada ao analista.",
          classification: "MA"
        },
        {
          id: "step_22_22.7.3",
          sourceRef: "22.7.3",
          description: "Envie ao analista responsável as evidências do ajuste e uma breve confirmação de que o ajuste foi aplicado conforme tolerância.",
          classification: "MA"
        },
        {
          id: "step_22_22.8",
          sourceRef: "22.8",
          description: "Após geração/associação do VBD e eventuais ajustes dentro da tolerância, prosseguir com as etapas subsequentes do processamento da fatura segundo o fluxo operacional vigente (classificação, codificação contábil e posterior posting conforme rotina do time).",
          classification: "MA"
        },
      ]
    },
    {
      id: "step_23",
      sourceStep: "23",
      number: "23",
      title: "Complete creation process e emissão de Credit Memo (VA01 → VF01 → VFO3) Executar todo o fluxo de rebill para crédito a partir das informações receb",
      description: "Executar todo o fluxo de rebill para crédito a partir das informações recebidas do scheduler, criando a ordem de crédito (VA01), gerando o documento de faturamento (VF01) e emitindo o output (VFO3). Cada subpasso contém as ações exatas a realizar em tela conforme os campos e popups indicados.",
      classification: "MS",
      classifications: ["MS"],
      macroBlockId: "execution",
      macroBlockName: "Execution",
      capabilityId: "cap-auto",
      capabilityName: "Automation Capability",
      solutionId: "sol-wf-routing",
      solutionIds: ["sol-wf-routing"],
      technologyType: "Workflow",
      rationale: "O rebill de crédito envolve transações encadeadas VA01, VF01 e VFO3 e exige controle humano antes da emissão.",
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
        description: "`review_required` — revisão humana permanece necessária para dados, exceções, aprovações e/ou transações financeiras."
      },
      substeps: [
        {
          id: "step_23_23.1",
          sourceRef: "23.1",
          description: "Localize no e-mail o arquivo Excel enviado pelo scheduler contendo os dados do rebill. Abra e confirme que o arquivo anexo contém as colunas necessárias (ship-to party, billing date, pricing date, material, target quantity, plant, company code, valores/condições). Salve o arquivo localmente para referência durante a criação do credit memo. Tolerância excedida — contactar vendor: Condição: Durante o processamento do rebill for identificada diferença acima da tolerância entre o invoice e os valores/autofired VBDs.. Ações: Contactar o vendor/contraparte para solicitar carta de escalation conforme procedimento do scheduler.",
          classification: "MA"
        },
        {
          id: "step_23_23.2",
          sourceRef: "23.2",
          description: "Acesse o SAP e execute o t-code VA01. Na tela de criação de sales order inicie a criação do documento de crédito conforme o arquivo recebido.",
          classification: "ME"
        },
        {
          id: "step_23_23.3",
          sourceRef: "23.3",
          description: "No campo 'Order Type' insira CR (Credit Memo Creation) e pressione Enter para carregar os parâmetros iniciais do cabeçalho da ordem.",
          classification: "ME"
        },
        {
          id: "step_23_23.4",
          sourceRef: "23.4",
          description: "Transfira os valores do Excel para os campos do VA01: preencher 'Ship to party' com a party indicada, preencher 'Billing date' com a data corrente (usar hoje), preencher 'Pricing date' com a data da atividade, inserir 'Material' conforme planilha, e 'Target Quantity' inserindo a quantidade alvo de uma vez. Após preencher todos os campos do cabeçalho, pressione Enter.",
          classification: "ME"
        },
        {
          id: "step_23_23.5",
          sourceRef: "23.5",
          description: "Ao pressionar Enter um popup solicitará a Company Code. Substitua o exemplo 1010 pelo Company Code correto indicado pela planilha ou pelos procedimentos internos da sua área e confirme.",
          classification: "MS"
        },
        {
          id: "step_23_23.6",
          sourceRef: "23.6",
          description: "Se aparecer um popup de 'Billing period', confirme os valores mostrados conforme o período indicado na planilha. Caso o popup seja limpo automaticamente, reabra o campo correspondente e reinsira o período antes de prosseguir. Reinsira Billing Period se popup for limpo: Se o popup de Billing Period for limpo automaticamente, reabra o campo de Billing Period e reinsira o período antes de prosseguir.",
          classification: "MA"
        },
        {
          id: "step_23_23.7",
          sourceRef: "23.7",
          description: "Após confirmar o Billing Period, verifique que os demais campos do cabeçalho permanecem corretos. Pressione Enter para seguir para as informações de item.",
          classification: "ME"
        },
        {
          id: "step_23_23.8",
          sourceRef: "23.8",
          description: "No bloco de itens, selecione a linha de item referente ao rebill. No menu superior clique 'Go to' → 'Item' → 'Shipping' para abrir os detalhes de envio do item selecionado.",
          classification: "ME"
        },
        {
          id: "step_23_23.9",
          sourceRef: "23.9",
          description: "No campo 'Plant' insira o número do plant recebido do scheduler no Excel e pressione Enter para carregar os dados de planta no item.",
          classification: "ME"
        },
        {
          id: "step_23_23.10",
          sourceRef: "23.10",
          description: "Navegue até a seção do Billing Document e no campo 'Payment Terms' insira N30 (Net 30) conforme instruído. Confirme a alteração.",
          classification: "ME"
        },
        {
          id: "step_23_23.11",
          sourceRef: "23.11",
          description: "Abra as 'Conditions' do item e insira a condition type ZNON, informe o montante (Amount) conforme planilha e selecione a moeda USD. Salve temporariamente antes de sair da tela de condições.",
          classification: "ME"
        },
        {
          id: "step_23_23.12",
          sourceRef: "23.12",
          description: "Aguarde a validação do sistema; identifique o indicador visual de 'green light' que confirma a ativação da conta. Confirme que o crédito de US$10 (conforme exemplo) foi atribuído ao item/cabeçalho. Verificação de ativação de conta e crédito aplicado: Confirme visualmente o indicador 'green light' e verifique que o crédito (ex.: US$10 no exemplo) foi atribuído corretamente no item/cabeçalho.",
          classification: "MS"
        },
        {
          id: "step_23_23.13",
          sourceRef: "23.13",
          description: "Clique em 'Account Assignment' para revisar o Profit Center atribuído. Compare o Profit Center mostrado com o valor indicado no Excel.",
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
          description: "Se o Profit Center estiver diferente do indicado, edite o campo no Account Assignment e substitua pelo Profit Center correto conforme o Excel. Salve a alteração. Após salvar, retorne à decisão 'dec-227-13' para revalidar a correspondência.",
          classification: "MA"
        },
        {
          id: "step_23_23.15",
          sourceRef: "23.15",
          description: "Clique 'Go to' para navegar até a página de overview que apresenta o resumo dos detalhes do credit memo. Confirme que todas as informações do overview refletem as alterações feitas previamente.",
          classification: "ME"
        },
        {
          id: "step_23_23.16",
          sourceRef: "23.16",
          description: "No overview do credit memo revise linhas, quantidades, preços e condições. Verifique cabeçalho e itens para garantir conformidade com o Excel. Quando tudo estiver correto, clique 'Save'.",
          classification: "ME"
        },
        {
          id: "step_23_23.17",
          sourceRef: "23.17",
          description: "Após salvar, aguarde a notificação de criação de Sales Order. Copie o número da Sales Order gerada e registre-o no Excel de controle para uso no passo de faturamento (VF01).",
          classification: "MS"
        },
        {
          id: "step_23_23.18",
          sourceRef: "23.18",
          description: "No SAP execute o t-code VF01 para criar o documento de faturamento a partir da Sales Order gerada. Prepare-se para inserir o número de entrega/ordem conforme disponível.",
          classification: "ME"
        },
        {
          id: "step_23_23.19",
          sourceRef: "23.19",
          description: "No campo apropriado cole o número da Sales Order previamente copiado (ou o número de entrega correspondente) e pressione Enter para que o sistema localize os itens a serem faturados.",
          classification: "MA"
        },
        {
          id: "step_23_23.20",
          sourceRef: "23.20",
          description: "Revise a visão geral de criação do billing document apresentada pelo sistema. Se todos os dados estiverem corretos, clique 'Save' para gerar o documento de faturamento.",
          classification: "ME"
        },
        {
          id: "step_23_23.21",
          sourceRef: "23.21",
          description: "Após salvar, anote o número do Invoice gerado pelo sistema. Atualize o controle do rebill no Excel com o número do invoice para acompanhamento.",
          classification: "ME"
        },
        {
          id: "step_23_23.22",
          sourceRef: "23.22",
          description: "Acesse o t-code VFO3 (Display Billing Document) no SAP para exibir o documento de faturamento recém-criado.",
          classification: "ME"
        },
        {
          id: "step_23_23.23",
          sourceRef: "23.23",
          description: "No campo 'Invoice Number' insira o número do invoice que você registrou no passo anterior e pressione Enter para carregar o billing document na tela.",
          classification: "ME"
        },
        {
          id: "step_23_23.24",
          sourceRef: "23.24",
          description: "Com o billing document carregado, selecione o menu 'Billing document' e escolha a função 'Issue output To' para gerar o output do invoice (impressão/envio conforme configuração do sistema). Confirme a execução da emissão de output e capture evidência (por exemplo, registro do status de output ou número de spool).",
          classification: "ME"
        },
      ]
    },
    {
      id: "step_24",
      sourceStep: "24",
      number: "24",
      title: "Rebill — Process de Debit Memo (ZEWB: criação do VBD, geração de output e envio ao Scheduler) Operational procedure para criar um Debit Memo em ZE",
      description: "Operational procedure para criar um Debit Memo em ZEWB (Custom Trading Expense Workbench), gerar o output (print preview/PDF) e devolver o arquivo ao Scheduler. Executar as etapas na ordem apresentada; usar a seção alternativa se o Scheduler não souber o número do cliente.",
      classification: "MS",
      classifications: ["MS"],
      macroBlockId: "execution",
      macroBlockName: "Execution",
      capabilityId: "cap-auto",
      capabilityName: "Automation Capability",
      solutionId: "sol-wf-routing",
      solutionIds: ["sol-wf-routing"],
      technologyType: "Workflow",
      rationale: "O debit memo depende de VBD, geração de output e comunicação ao Scheduler; workflow ajuda a controlar estados e aprovações.",
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
        description: "`review_required` — revisão humana permanece necessária para dados, exceções, aprovações e/ou transações financeiras."
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
          description: "Enter o número da invoice e, em seguida, selecionar 'Billing document' → 'Issue output To'. Escolher 'ZRD1' e confirmar (Enter) para pré-visualizar.",
          classification: "ME"
        },
        {
          id: "step_24_24.1.3",
          sourceRef: "24.1.3",
          description: "Identificar e salvar o Excel anexado ao e-mail de instrução que contém os valores e referências a serem lançados em ZEWB.",
          classification: "ME"
        },
        {
          id: "step_24_24.2",
          sourceRef: "24.2",
          description: "Entrar no t-code ZEWB para iniciar criação manual do Debit Memo (non-trip).",
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
          description: "Selecionar a opção para entrada de informação 'non-trip related' e abrir o formulário de criação de despesa.",
          classification: "ME"
        },
        {
          id: "step_24_24.3",
          sourceRef: "24.3",
          description: "Localizar o contrato de trading relacionado e iniciar a ação 'Create Expense'.",
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
          description: "Definir a classe de despesa e o tipo contábil para o Debit Memo.",
          classification: "ME"
        },
        {
          id: "step_24_24.4.1",
          sourceRef: "24.4.1",
          description: "No campo de despesas selecionar a opção 'Y01' (Freight).",
          classification: "ME"
        },
        {
          id: "step_24_24.4.2",
          sourceRef: "24.4.2",
          description: "No column 'Accounting Type' selecionar 'C' — Receivable Account.",
          classification: "ME"
        },
        {
          id: "step_24_24.5",
          sourceRef: "24.5",
          description: "Preencher a category de postagem e a data de lançamento conforme política de rebill.",
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
          description: "Preencher a coluna Partner com o número do cliente e informar o valor líquido a ser debitado.",
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
          description: "No campo 'Net Amount' inserir o valor líquido conforme o Excel recebido.",
          classification: "ME"
        },
        {
          id: "step_24_24.7",
          sourceRef: "24.7",
          description: "Preencher campo Reference (opcional) e salvar, gerando o Document Number do Debit Memo. Verificação obrigatória antes de salvar: Confirmar que expense class group = Z3, expense type = Y01 (Freight), Accounting Type = C, Posting Category = 2, Posting Date preenchida, Partner informado e Net Amount corresponde ao Excel recebido. Documento não gerado após salvar: Condição: Após salvar, nenhum Document Number é exibido ou o número não é gerado.. Ações: Reabrir a tela do Expense no ZEWB e confirmar todos os campos obrigatórios estão preenchidos.; Repetir a ação 'Save'.; Se o problema persistir, retornar para 's237_check_and_save' e reexecutar a revisão dos campos.. Resultado: 24.7.2 · Revisar todos os campos preenchidos (expense classgrp, accounting type, posting category, posting date, partner, net amount, reference) e clicar 'Save'.",
          classification: "MA"
        },
        {
          id: "step_24_24.7.1",
          sourceRef: "24.7.1",
          description: "No campo 'Reference' inserir a referência desejada; opcionalmente preencher a coluna 'Text' para aparecer na invoice rebill.",
          classification: "ME"
        },
        {
          id: "step_24_24.7.2",
          sourceRef: "24.7.2",
          description: "Revisar todos os campos preenchidos (expense classgrp, accounting type, posting category, posting date, partner, net amount, reference) e clicar 'Save'. Verificação obrigatória antes de salvar: Confirmar que expense class group = Z3, expense type = Y01 (Freight), Accounting Type = C, Posting Category = 2, Posting Date preenchida, Partner informado e Net Amount corresponde ao Excel recebido.",
          classification: "MA"
        },
        {
          id: "step_24_24.7.3",
          sourceRef: "24.7.3",
          description: "Após o salvamento, copiar o Document Number gerado (exemplo documentado: '6000008830') para referência e registros. Documento não gerado após salvar: Condição: Após salvar, nenhum Document Number é exibido ou o número não é gerado.. Ações: Reabrir a tela do Expense no ZEWB e confirmar todos os campos obrigatórios estão preenchidos.; Repetir a ação 'Save'.; Se o problema persistir, retornar para 's237_check_and_save' e reexecutar a revisão dos campos.. Resultado: 24.7.2 · Revisar todos os campos preenchidos (expense classgrp, accounting type, posting category, posting date, partner, net amount, reference) e clicar 'Save'.",
          classification: "ME"
        },
        {
          id: "step_24_24.7.4",
          sourceRef: "24.7.4",
          description: "Abrir 'Expenses Doc List', filtrar a coluna 'Document' inserindo o número da invoice (Document Number copiado) e pressionar Enter para localizar o documento.",
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
          description: "Verificar as informações do item no 'Document Item Overview' antes de produzir o output.",
          classification: "ME"
        },
        {
          id: "step_24_24.9",
          sourceRef: "24.9",
          description: "No 'Document Item Overview' usar menu Extras → Message para acessar opções de output e visualização da invoice.",
          classification: "ME"
        },
        {
          id: "step_24_24.9.1",
          sourceRef: "24.9.1",
          description: "Clicar 'Extras' → 'Message'.",
          classification: "ME"
        },
        {
          id: "step_24_24.9.2",
          sourceRef: "24.9.2",
          description: "Na tela 'Output and Invoice details' selecionar 'Print Preview' para gerar a visualização do Debit Rebill Invoice.",
          classification: "ME"
        },
        {
          id: "step_24_24.10",
          sourceRef: "24.10",
          description: "Salvar a pré-visualização como PDF/arquivo no computador e enviar o arquivo gerado de volta ao Scheduler conforme procedimento interno. Falha no envio ao Scheduler: Não foi possível enviar o arquivo do Debit Rebill ao Scheduler (por exemplo, endereço não disponível ou envio falhou). · Scheduler",
          classification: "ME"
        },
        {
          id: "step_24_24.10.1",
          sourceRef: "24.10.1",
          description: "Na janela de Print Preview usar a opção 'Save' ou 'Export to PDF' para gravar o Debit Rebill Invoice no diretório local do operador. Verificação obrigatória antes de salvar: Confirmar que expense class group = Z3, expense type = Y01 (Freight), Accounting Type = C, Posting Category = 2, Posting Date preenchida, Partner informado e Net Amount corresponde ao Excel recebido.",
          classification: "MA"
        },
        {
          id: "step_24_24.10.2",
          sourceRef: "24.10.2",
          description: "Enviar o arquivo salvo ao Scheduler conforme o canal combinado (ver Unknowns se o canal não estiver documentado). Registrar o envio. Falha no envio ao Scheduler: Não foi possível enviar o arquivo do Debit Rebill ao Scheduler (por exemplo, endereço não disponível ou envio falhou). · Scheduler",
          classification: "ME"
        },
      ]
    },
    {
      id: "step_25",
      sourceStep: "25",
      number: "25",
      title: "Invoice Process Revisada — Correção por crédito (original processado/impago) Operational sequence para identificar lançamento original, levantar d",
      description: "Operational sequence para identificar lançamento original, levantar dados contábeis, gerar e carregar fatura de crédito ou débito revisada e reconciliar (inclui fluxo para original processado e não pago e direcionamento para alternativa quando original já foi pago).",
      classification: "MS",
      classifications: ["MS", "MA"],
      macroBlockId: "exception",
      macroBlockName: "Exception",
      capabilityId: "cap-auto",
      capabilityName: "Automation Capability",
      solutionId: "sol-eval-anomaly",
      solutionIds: ["sol-eval-anomaly"],
      technologyType: "Workflow",
      rationale: "A correção por crédito trata uma divergência de fatura já processada e exige decisão, rastreabilidade e nova submissão.",
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
        description: "`decision_required` — revisão humana permanece necessária para dados, exceções, aprovações e/ou transações financeiras."
      },
      substeps: [
        {
          id: "step_25_25.1",
          sourceRef: "25.1",
          description: "Abrir a transação FBL1N no SAP para pesquisar lançamentos do fornecedor.",
          classification: "ME"
        },
        {
          id: "step_25_25.2",
          sourceRef: "25.2",
          description: "No ecrã FBL1N, inserir a conta do fornecedor (Vendor account) e executar a pesquisa pressionando F8.",
          classification: "ME"
        },
        {
          id: "step_25_25.3",
          sourceRef: "25.3",
          description: "Verificar se o lançamento original foi apenas processado (contabilizado) ou processado e pago.",
          classification: "MS"
        },
        {
          id: "step_25_25.4",
          sourceRef: "25.4",
          description: "Na lista de resultados do FBL1N localizar a linha correspondente ao lançamento já processado e dar duplo clique sobre ela para abrir o detalhe do documento.",
          classification: "MA"
        },
        {
          id: "step_25_25.5",
          sourceRef: "25.5",
          description: "No ecrã do documento, aceder à aba Environment e selecionar Document Environment → Accounting Documents para visualizar os documentos contábeis relacionados necessários para repostagem (GL, Profit Centre, company code, gross amount).",
          classification: "ME"
        },
        {
          id: "step_25_25.6",
          sourceRef: "25.6",
          description: "Dar duplo clique sobre o documento contábil listado para abrir o detalhe do accounting document e capturar GL account, Profit Centre, company code e gross amount que serão usados no lançamento de correção.",
          classification: "ME"
        },
        {
          id: "step_25_25.7",
          sourceRef: "25.7",
          description: "Verificar no detalhe do documento as contas GL e o Profit Centre exibidos para uso no lançamento de débito/crédito revisado.",
          classification: "ME"
        },
        {
          id: "step_25_25.8",
          sourceRef: "25.8",
          description: "Fazer download do PDF da fatura duplicada (ou cópia digital recebida) e preparar a versão que será enviada para upload como crédito (ou débito) com os valores ajustados e os dados contábeis identificados.",
          classification: "ME"
        },
        {
          id: "step_25_25.9",
          sourceRef: "25.9",
          description: "Abrir OAWD e selecionar a opção VIM Invoice uploads; carregar o arquivo PDF da fatura revisada na fila indicada (referida como SEC_REDPRD no procedimento). Regras de aprovador por faixa de valor: Aplicar regras de aprovação por faixa de valor conforme abaixo antes da postagem:",
          classification: "MS"
        },
        {
          id: "step_25_25.10",
          sourceRef: "25.10",
          description: "Aguardar a criação do arquivo no VIM; após processamento automático, a fatura carregada aparecerá na VIM Workplace.",
          classification: "ME"
        },
        {
          id: "step_25_25.11",
          sourceRef: "25.11",
          description: "No VIM Workplace abrir 'My Inbox' e localizar a fatura recém-carregada; abrir a fatura para executar o processamento.",
          classification: "ME"
        },
        {
          id: "step_25_25.12",
          sourceRef: "25.12",
          description: "Na execução da fatura no VIM/SAP preencher os campos obrigatórios com os dados do PDF: Vendor number, Company code, Transaction/Event, Reference number, Document Date, Gross Amount e demais campos básicos.",
          classification: "ME"
        },
        {
          id: "step_25_25.13",
          sourceRef: "25.13",
          description: "Aceder à aba Accounting da fatura e ativar o bloqueio de pagamento (Manual payment block). Selecionar a opção de bloqueio manual (Manual pmt. block) e indicar o baseline date igual à data corrente de contabilização/postagem. Bloqueio de pagamento manual e baseline date: Na aba Accounting selecionar 'Manual payment block' e informar o baseline date igual à data corrente de contabilização/postagem.",
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
          description: "Executar a simulação das regras de imputação (simulate rule). Caso a simulação apresente indicadores vermelhos deve-se analisar cada item com erro individualmente, inserir comentários relevantes e, se apropriado, usar a opção de bypass (bypass) para prosseguir. Ação quando simulação apresentar indicação vermelha: Condição: Simulação de regras retorna indicador vermelho. Ações: Analisar cada linha com erro individualmente; Inserir comentário explicativo em cada item com erro; Ajustar manualmente GL/Profit Centre ou outros campos conforme necessário; Tentar nova simulação após correções. Resultado: 25.16 · Executar a simulação das regras de imputação (simulate rule). Caso a simulação apresente indicadores vermelhos deve-se analisar cada item com erro individualmente, inserir comentários relevantes e, se apropriado, usar a opção de bypass (bypass) para prosseguir.",
          classification: "MA"
        },
        {
          id: "step_25_25.17",
          sourceRef: "25.17",
          description: "Se a simulação estiver sem erros (indicadores verdes), selecionar 'Apply Rules' para aplicar os lançamentos e enviar a fatura para a etapa de aprovação conforme as regras internas. Regras de aprovador por faixa de valor: Aplicar regras de aprovação por faixa de valor conforme abaixo antes da postagem:",
          classification: "MS"
        },
        {
          id: "step_25_25.18",
          sourceRef: "25.18",
          description: "Após aprovação e postagem automática em SAP, retornar ao FBL1N e localizar os lançamentos de débito e crédito resultantes do processamento para verificação.",
          classification: "MS"
        },
        {
          id: "step_25_25.19",
          sourceRef: "25.19",
          description: "Executar a transação F-44. Preencher os campos obrigatórios (Vendor account, Company code, Document numbers) selecionar os documentos a serem compensados (knock off) e executar a compensação. Após a compensação, reprocessar a invoice revisada utilizando os GL account e Profit Centre obtidos anteriormente.",
          classification: "ME"
        },
      ]
    },
    {
      id: "step_26",
      sourceStep: "26",
      number: "26",
      title: "Process fatura de comissão única — identificar confirmation/deal, localizar VBD e preparar para postagem Step-by-step procedure para localizar o",
      description: "Step-by-step procedure para localizar o anexo da fatura no VIM Workplace, validar dados básicos, localizar/associar Accrual VBD via busca ou via deal (Livelink → Fiori → ZEWB), ajustar valores dentro da tolerância e verificar possível duplicidade antes de encaminhar para a etapa de postagem.",
      classification: "MS",
      classifications: ["MS", "MA"],
      macroBlockId: "execution",
      macroBlockName: "Execution",
      capabilityId: "cap-auto",
      capabilityName: "Automation Capability",
      solutionId: "sol-ia-matching",
      solutionIds: ["sol-ia-matching"],
      technologyType: "AI / Agent",
      rationale: "A identificação de confirmation/deal e matching com VBDs pode ser assistida por IA, mas a decisão de postagem permanece revisável.",
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
        description: "`review_required` — revisão humana permanece necessária para dados, exceções, aprovações e/ou transações financeiras."
      },
      substeps: [
        {
          id: "step_26_26.1",
          sourceRef: "26.1",
          description: "No VIM Workplace abra a fatura selecionada: clique em 'Attachment list', localize o anexo identificado como 'VIM Incoming Invoice', dê duplo clique para abrir a pré‑visualização e, quando pronto para processar, execute (F8).",
          classification: "ME"
        },
        {
          id: "step_26_26.2",
          sourceRef: "26.2",
          description: "No painel da fatura selecione a aba 'Basic data' e confirme que os seguintes campos batem com o documento físico/preview: Invoice Number, Gross Amount, Invoice Date, Vendor Number e Banking Information. Corrija apenas se houver erro de leitura do anexo e documente a divergência.",
          classification: "ME"
        },
        {
          id: "step_26_26.3",
          sourceRef: "26.3",
          description: "Abra a aba 'Other Data' e inicie a busca por Accruals VBD: clique em 'Search Accruals VBD'. Antes de executar a busca, confirme que o campo 'Bill of Lading' está vazio (sem valores selecionados) e que a opção 'Include All VBDs' esteja desmarcada. Bill of Lading em branco e 'Include All VBDs' desmarcado: Antes de executar a busca por Accrual VBD, o campo 'Bill of Lading' deve estar sem valores selecionados e a opção 'Include All VBDs' deve estar desmarcada para retornar os VBDs corretos.",
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
          description: "Na lista retornada selecione 'Choose Layout' para ajustar a visualização conforme necessário e confirme com o tick (marca) para exibir as colunas relevantes (incluindo Broker reference). Observe a coluna Broker reference para localizar o número de confirmation que pode constar na fatura.",
          classification: "ME"
        },
        {
          id: "step_26_26.6",
          sourceRef: "26.6",
          description: "Verificar se o número de confirmation presente na fatura aparece na coluna 'Broker reference' dos VBD listados.",
          classification: "MS"
        },
        {
          id: "step_26_26.7",
          sourceRef: "26.7",
          description: "Abra Livelink e selecione 'Broker confirmations'. Insira o número de Confirmation extraído da fatura no campo de busca e execute a pesquisa. Na lista de resultados localize o item correspondente e dê duplo clique para abrir os detalhes.",
          classification: "MA"
        },
        {
          id: "step_26_26.8",
          sourceRef: "26.8",
          description: "Após pesquisar o confirmation no Livelink, verificar se existe um item que contenha o deal number necessário.",
          classification: "MS"
        },
        {
          id: "step_26_26.9",
          sourceRef: "26.9",
          description: "Abra o anexo ou o registro encontrado no Livelink e copie o deal number exibido. Preserve exatamente o texto do deal number (sem espaços adicionais).",
          classification: "ME"
        },
        {
          id: "step_26_26.10",
          sourceRef: "26.10",
          description: "Abra SAP Fiori e preencha os critérios principais: Trader, Trader Date e Counterparty. Clique 'Go' para listar deals. Confirme que os detalhes do deal (counterparty, volume, shipment date, trader) correspondem à confirmation na fatura antes de selecionar a linha.",
          classification: "MA"
        },
        {
          id: "step_26_26.11",
          sourceRef: "26.11",
          description: "Abra o T‑Code ZEWB (Custom Trading Workbench). Cole o deal number copiado no campo de busca apropriado e execute (F8). Na saída localize o Accrual VBD document associado e copie o número do documento retornado.",
          classification: "ME"
        },
        {
          id: "step_26_26.12",
          sourceRef: "26.12",
          description: "Retorne ao VIM Workplace → Other Data → Search Accruals VBD. Cole o número do documento (Accrual VBD) obtido em ZEWB no campo de busca e execute (F8). Ao localizar o Accrual VBD selecionado, clique em 'Overwrite VBD' para associá‑lo à fatura.",
          classification: "ME"
        },
        {
          id: "step_26_26.13",
          sourceRef: "26.13",
          description: "Abra a aba 'Line item' e compare a Gross Amount da invoice com a Gross Amount do VBD associado. Calcule a diferença (Invoice amount menos VBD amount).",
          classification: "MA"
        },
        {
          id: "step_26_26.14",
          sourceRef: "26.14",
          description: "Aplicar a regra de tolerância registrada para commission invoices. Tolerância de comissão: Limite de tolerância para diferença entre Invoice Gross Amount e VBD Gross Amount é de 2000 USD.",
          classification: "MA"
        },
        {
          id: "step_26_26.15",
          sourceRef: "26.15",
          description: "Atualize o valor do VBD para igualar o Invoice Gross Amount quando a diferença estiver dentro da tolerância. Após ajustar o valor, clique em 'Recalculate vendor Price' e depois em 'Save' para persistir o ajuste.",
          classification: "MA"
        },
        {
          id: "step_26_26.16",
          sourceRef: "26.16",
          description: "Clique em 'Simulate Rules' para apply rules do sistema. Caso seja apresentado o erro 'Suspected Duplicate', trate conforme o procedimento de verificação de duplicidade. Tratamento para 'Suspected Duplicate Error' após simulação de regras: Condição: Ao executar 'Simulate Rules' é exibida a mensagem 'Suspected Duplicate Error'.. Ações: Executar verificação de duplicidade em VIM Analytics (etapa step-264).; Se VIM Analytics indicar múltiplas linhas, marcar a fatura como suspeita de duplicidade e seguir o fluxo de revisão definido pela área (end_state gerado no dec-duplicate-check).",
          classification: "ME"
        },
        {
          id: "step_26_26.17",
          sourceRef: "26.17",
          description: "Abra VIM Analytics, insira o Reference Number da fatura e execute (F8). Analise o resultado: se retornar apenas uma linha, a fatura não é considerada duplicada; se retornar múltiplas linhas, tratá‑se‑á como suspeita de duplicidade.",
          classification: "MA"
        },
        {
          id: "step_26_26.18",
          sourceRef: "26.18",
          description: "Decidir o estado da fatura com base no número de entradas retornadas pelo VIM Analytics.",
          classification: "MS"
        },
      ]
    },
    {
      id: "step_27",
      sourceStep: "27",
      number: "27",
      title: "Commission Process — identificar e reconciliar VBDs para Multi Commission e Crude Commission Operational procedure para identificar, selecionar e",
      description: "Operational procedure para identificar, selecionar e reconciliar VBDs (Accrual VBD) relacionados a faturas de comissão multi e crude dentro do VIM Workplace e acionar próximos passos (postagem ou investigação manual).",
      classification: "MA",
      classifications: ["MA"],
      macroBlockId: "execution",
      macroBlockName: "Execution",
      capabilityId: "cap-auto",
      capabilityName: "Automation Capability",
      solutionId: "sol-ia-matching",
      solutionIds: ["sol-ia-matching"],
      technologyType: "AI / Agent",
      rationale: "A reconciliação de múltiplas comissões exige comparação de referências, datas, quantidades e valores; o agente deve apenas apoiar a análise.",
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
        description: "`review_required` — revisão humana permanece necessária para dados, exceções, aprovações e/ou transações financeiras."
      },
      substeps: [
        {
          id: "step_27_27.1",
          sourceRef: "27.1",
          description: "No VIM Workplace, marque a fatura como não duplicada e salve para postar. Marcar fatura como 'Non Duplicate' e salvar: No campo de comentários do VIM inserir exatamente 'Non Duplicate' e pressionar o botão Save para que a fatura seja postada.",
          classification: "ME"
        },
        {
          id: "step_27_27.2",
          sourceRef: "27.2",
          description: "A partir do menu pop-up do documento no VIM, selecione a lista de anexos e abra o PDF da fatura para exame. Abrir anexo PDF para verificar conteúdo da fatura: Abrir a opção 'VIM Incoming Invoice Email PDF attachment' na 'Attachment list' para visualizar o PDF inteiro antes de proceder à reconciliação.",
          classification: "MA"
        },
        {
          id: "step_27_27.2.1",
          sourceRef: "27.2.1",
          description: "No menu pop-up, clique em 'Attachment list'. Em seguida clique na primeira opção 'VIM Incoming Invoice Email PDF attachment' e abra o PDF para visualizar o documento completo.",
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
          description: "No painel 'Other Data', execute a pesquisa de 'Search Accrual VBD selection' e então execute (F8). Antes de executar, confirme que a(s) caixa(s) relevante(s) estejam desmarcadas conforme instrução. Confirmar caixa desmarcada antes de Executar (F8): Antes de executar a pesquisa de Accrual VBD (F8), confirme que a caixa específica indicada pelo procedimento esteja desmarcada para evitar filtragem indesejada. Caixa a ser desmarcada antes de Executar (F8) — campo não identificado no documento: Condição: Texto instrui 'Ensure that the is unchecked' sem indicar qual caixa/controle.. Ações: Verificar na tela 'Search Accrual VBD selection' qual checkbox está marcado por padrão e que pode filtrar resultados; se incerto, confirmar com um colega com acesso à mesma tela antes de executar.. Resultado: 27.4 · No painel 'Other Data', execute a pesquisa de 'Search Accrual VBD selection' e então execute (F8). Antes de executar, confirme que a(s) caixa(s) relevante(s) estejam desmarcadas conforme instrução.",
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
          description: "Confirme que a caixa indicada na interface (ver callout de unknown se incerto) esteja desmarcada antes de pressionar Executar (F8). Depois, pressione F8 para obter os VBDs. Caixa a ser desmarcada antes de Executar (F8) — campo não identificado no documento: Condição: Texto instrui 'Ensure that the is unchecked' sem indicar qual caixa/controle.. Ações: Verificar na tela 'Search Accrual VBD selection' qual checkbox está marcado por padrão e que pode filtrar resultados; se incerto, confirmar com um colega com acesso à mesma tela antes de executar.. Resultado: 27.4 · No painel 'Other Data', execute a pesquisa de 'Search Accrual VBD selection' e então execute (F8). Antes de executar, confirme que a(s) caixa(s) relevante(s) estejam desmarcadas conforme instrução.",
          classification: "ME"
        },
        {
          id: "step_27_27.5",
          sourceRef: "27.5",
          description: "Na lista de resultados (DP / lista de VBDs), abra o menu 'Choose Layout' e selecione o layout 'Commission' para exibir colunas relevantes. Selecionar layout 'Commission' na escolha de layout: Abrir 'Choose Layout' e selecionar 'Commission' para que colunas relevantes apareçam na lista de VBDs.",
          classification: "ME"
        },
        {
          id: "step_27_27.6",
          sourceRef: "27.6",
          description: "Use a opção de ordenação 'Sort by' para organizar por 'broker reference'. Retorne ao PDF da fatura e identifique os confirmation numbers (6 ou 7 dígitos numéricos) para procurar correspondência na lista de VBDs. Identificação de confirmation number: Considerar confirmation numbers como sequências numéricas de 6 ou 7 dígitos ao buscar correspondência entre PDF e campo 'broker reference'.",
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
          description: "Selecione na lista os Accrual VBDs cujo 'broker reference' corresponde ao confirmation number do PDF. Depois destaque (marque) o confirmation number no PDF da fatura para referência. Ação a ser clicada para não sobrescrever seleções de VBD — instrução incompleta no documento: Condição: Documento diz 'remember to click on so as to not override any previous VBD selections' sem informar qual botão/caixa clicar.. Ações: Ao selecionar VBDs adicionais, observar se existe opção de 'add to selection' ou checkbox de múltipla seleção na interface; se não evidente, não confirmar alterações e consultar colega ou documentação técnica antes de salvar.. Resultado: 27.7 · Selecione na lista os Accrual VBDs cujo 'broker reference' corresponde ao confirmation number do PDF. Depois destaque (marque) o confirmation number no PDF da fatura para referência. Destacar confirmation number no PDF: Após selecionar os VBDs correspondentes, destaque o confirmation number no PDF para manter rastreabilidade entre fatura e VBDs.",
          classification: "MA"
        },
        {
          id: "step_27_27.7.1",
          sourceRef: "27.7.1",
          description: "Clique nas linhas de VBD que correspondem ao confirmation number. Se selecionar VBDs adicionais, siga a orientação do callout relacionado para não sobrescrever seleções anteriores. Ação a ser clicada para não sobrescrever seleções de VBD — instrução incompleta no documento: Condição: Documento diz 'remember to click on so as to not override any previous VBD selections' sem informar qual botão/caixa clicar.. Ações: Ao selecionar VBDs adicionais, observar se existe opção de 'add to selection' ou checkbox de múltipla seleção na interface; se não evidente, não confirmar alterações e consultar colega ou documentação técnica antes de salvar.. Resultado: 27.7 · Selecione na lista os Accrual VBDs cujo 'broker reference' corresponde ao confirmation number do PDF. Depois destaque (marque) o confirmation number no PDF da fatura para referência.",
          classification: "MA"
        },
        {
          id: "step_27_27.7.2",
          sourceRef: "27.7.2",
          description: "No visualizador do PDF, selecione/highlight o confirmation number que corresponde às linhas VBD selecionadas para manter rastreabilidade visual. Destacar confirmation number no PDF: Após selecionar os VBDs correspondentes, destaque o confirmation number no PDF para manter rastreabilidade entre fatura e VBDs.",
          classification: "MA"
        },
        {
          id: "step_27_27.8",
          sourceRef: "27.8",
          description: "Quando não houver correspondência direta entre 'broker reference' e confirmation number, proceda à análise linha a linha do PDF e dos registros VBD para identificar a transação correta ou anomalias. Revisão manual linha a linha quando não houver correspondência automática: Condição: Falha em localizar correspondência automática entre confirmation number e broker reference. Ações: Comparar datas de acordo, quantidades, valores e counterparty entre PDF e VBDs.; Registrar tentativa de correspondência e evidências.; Se necessário, classificar o caso como 'Investigar - Reconciliation not found' e guardar documentação.. Resultado: Caso pendente para investigação",
          classification: "MA"
        },
        {
          id: "step_27_27.8.1",
          sourceRef: "27.8.1",
          description: "Comparar datas de acordo/ trade date, quantidades, counterparty e valores por linha. Documente cada tentativa de correspondência e registre VBDs candidatos. Revisão manual linha a linha quando não houver correspondência automática: Condição: Falha em localizar correspondência automática entre confirmation number e broker reference. Ações: Comparar datas de acordo, quantidades, valores e counterparty entre PDF e VBDs.; Registrar tentativa de correspondência e evidências.; Se necessário, classificar o caso como 'Investigar - Reconciliation not found' e guardar documentação.. Resultado: Caso pendente para investigação",
          classification: "MA"
        },
        {
          id: "step_27_27.8.2",
          sourceRef: "27.8.2",
          description: "Se após análise linha a linha não for possível identificar VBD correspondente, registre o caso para investigação adicional (estado: 'Investigar - Reconciliation not found') e mantenha evidências coletadas. Revisão manual linha a linha quando não houver correspondência automática: Condição: Falha em localizar correspondência automática entre confirmation number e broker reference. Ações: Comparar datas de acordo, quantidades, valores e counterparty entre PDF e VBDs.; Registrar tentativa de correspondência e evidências.; Se necessário, classificar o caso como 'Investigar - Reconciliation not found' e guardar documentação.. Resultado: Caso pendente para investigação",
          classification: "MA"
        },
        {
          id: "step_27_27.9",
          sourceRef: "27.9",
          description: "No VIM Workplace, abra a fatura do tipo 'Crude' em arquivo separado, abra a lista de anexos e visualize o PDF para analisar componentes como trade date / agreement date e identificação do counterparty.",
          classification: "MA"
        },
        {
          id: "step_27_27.9.1",
          sourceRef: "27.9.1",
          description: "Escolha a fatura Crude na lista do VIM e abra-a em um arquivo/visualizador separado clicando no ícone destacado.",
          classification: "ME"
        },
        {
          id: "step_27_27.9.2",
          sourceRef: "27.9.2",
          description: "Do pop-up, selecione 'Attachment list' e clique em 'VIM Incoming Invoice- Email PDF attachment' para inspecionar o documento. Observe que, for invoiras Crude, o 'agreement date' corresponde ao trade date / deal date.",
          classification: "MA"
        },
        {
          id: "step_27_27.9.3",
          sourceRef: "27.9.3",
          description: "Se o counterparty não estiver explicitado no PDF, contacte o broker para esclarecimento antes de proceder com seleção de VBDs (registre comunicação).",
          classification: "MS"
        },
        {
          id: "step_27_27.10",
          sourceRef: "27.10",
          description: "No VIM, vá para a guia 'Other Data', acione 'Search Accrual VBD selection', deixe o campo 'Bill of Lading' completamente em branco (remova entradas) e execute (F8). Manter campo 'Bill of Lading' em branco para Crude: Remova qualquer valor do campo 'Bill of Lading' e certifique-se de que ele esteja completamente em branco antes de executar a pesquisa de Accrual VBDs for invoiras Crude.",
          classification: "ME"
        },
        {
          id: "step_27_27.10.1",
          sourceRef: "27.10.1",
          description: "Apague qualquer valor presente no campo 'Bill of Lading' para garantir que ele permaneça em branco antes de executar a busca. Manter campo 'Bill of Lading' em branco para Crude: Remova qualquer valor do campo 'Bill of Lading' e certifique-se de que ele esteja completamente em branco antes de executar a pesquisa de Accrual VBDs for invoiras Crude.",
          classification: "ME"
        },
        {
          id: "step_27_27.10.2",
          sourceRef: "27.10.2",
          description: "Com o campo 'Bill of Lading' em branco, pressione Executar (F8) para carregar os Accrual VBDs disponíveis para a fatura Crude.",
          classification: "ME"
        },
        {
          id: "step_27_27.11",
          sourceRef: "27.11",
          description: "Abra a lista resultante de VBDs, utilize 'Choose Layout' para selecionar 'Commission', reveja os registros de Accrual VBD (DP document page) e avalie se os 'broker reference' e as datas/anotações indicam necessidade de ação manual. Selecionar layout 'Commission' (Crude): Na lista de VBDs retornada for invoiras Crude, aplicar o layout 'Commission' para visualizar corretamente os campos de Accrual VBD. Tratamento quando houver 'outdated lift dates' ou VBDs manuais: Condição: Identificação de lift dates desatualizados ou ausência de broker reference correspondente (ex.: ausência de PX11).. Ações: Marcar cada item que apresente lift date desatualizado.; Efetuar análise linha a linha para determinar se o VBD foi manualmente criado e se requer reversão.; Documentar evidências (screenshots, notas do PDF) para acompanhamento.. Resultado: Requer revisão manual/possível reversão de VBD — preparar documentação para ação corretiva",
          classification: "MA"
        },
        {
          id: "step_27_27.11.1",
          sourceRef: "27.11.1",
          description: "No menu 'Choose Layout', selecione 'Commission'. A página DP com os registros de Accrual VBDs será exibida para revisão. Selecionar layout 'Commission' (Crude): Na lista de VBDs retornada for invoiras Crude, aplicar o layout 'Commission' para visualizar corretamente os campos de Accrual VBD.",
          classification: "ME"
        },
        {
          id: "step_27_27.11.2",
          sourceRef: "27.11.2",
          description: "Revise se o número apresentado como 'invoice number' na fatura é, na verdade, o confirmation number. Verifique se há broker reference iniciando com 'PX11' — ausência indica que não houve triggers. Observe datas de lift desatualizadas que podem indicar VBDs manuais ou tickets atualizados após pagamento. Tratamento quando houver 'outdated lift dates' ou VBDs manuais: Condição: Identificação de lift dates desatualizados ou ausência de broker reference correspondente (ex.: ausência de PX11).. Ações: Marcar cada item que apresente lift date desatualizado.; Efetuar análise linha a linha para determinar se o VBD foi manualmente criado e se requer reversão.; Documentar evidências (screenshots, notas do PDF) para acompanhamento.. Resultado: Requer revisão manual/possível reversão de VBD — preparar documentação para ação corretiva",
          classification: "MA"
        },
        {
          id: "step_27_27.11.3",
          sourceRef: "27.11.3",
          description: "Se VBDs aparentam ser manuais ou com lift dates posteriores ao pagamento, prepare análise linha a linha; se forem correspondentes, selecione conforme passo de seleção de VBD (retornar ao step-32). Tratamento quando houver 'outdated lift dates' ou VBDs manuais: Condição: Identificação de lift dates desatualizados ou ausência de broker reference correspondente (ex.: ausência de PX11).. Ações: Marcar cada item que apresente lift date desatualizado.; Efetuar análise linha a linha para determinar se o VBD foi manualmente criado e se requer reversão.; Documentar evidências (screenshots, notas do PDF) para acompanhamento.. Resultado: Requer revisão manual/possível reversão de VBD — preparar documentação para ação corretiva",
          classification: "MA"
        },
      ]
    },
    {
      id: "step_28",
      sourceStep: "28",
      number: "28",
      title: "Monthly processing de invoices ICE US Commodity Market — extração, cruzamento com VBDs e postagem Executable procedure para extrair invoices do p",
      description: "Executable procedure para extrair invoices do portal ICE no dia 8 de cada mês, mapear com VBDs no SAP (VIM/VBD/ZEWB/ZEWB) e processar até a postagem da fatura quando aplicável. Cada subpasso contém interações detalhadas necessárias para executar a tarefa conforme as telas e transações indicadas na fonte.",
      classification: "MS",
      classifications: ["MS", "MA"],
      macroBlockId: "execution",
      macroBlockName: "Execution",
      capabilityId: "cap-auto",
      capabilityName: "Automation Capability",
      solutionId: "sol-analytics-recon",
      solutionIds: ["sol-analytics-recon"],
      technologyType: "Analytics / Monitoramento",
      rationale: "O processamento mensal cruza ICE, SAP, LiveLink e planilhas; analytics pode automatizar matching e destacar casos NO ou fora da tolerância.",
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
        description: "`review_required` — revisão humana permanece necessária para dados, exceções, aprovações e/ou transações financeiras."
      },
      substeps: [
        {
          id: "step_28_28.1",
          sourceRef: "28.1",
          description: "Autenticar no portal ICE para obter os detalhes de deals e invoices do mês.",
          classification: "ME"
        },
        {
          id: "step_28_28.1.1",
          sourceRef: "28.1.1",
          description: "Abrir o URL do portal ICE (URL pendente) e inserir as credenciais válidas fornecidas; confirmar login bem-sucedido.",
          classification: "ME"
        },
        {
          id: "step_28_28.2",
          sourceRef: "28.2",
          description: "No dashboard principal do portal ICE selecionar a opção 'Invoices' para acessar o módulo de faturas.",
          classification: "ME"
        },
        {
          id: "step_28_28.2.1",
          sourceRef: "28.2.1",
          description: "Clicar na opção 'Invoices' no menu principal do portal para abrir a lista de invoices.",
          classification: "ME"
        },
        {
          id: "step_28_28.3",
          sourceRef: "28.3",
          description: "Configurar a visualização para o mês inteiro que deseja processar e executar 'Show summary'.",
          classification: "ME"
        },
        {
          id: "step_28_28.3.1",
          sourceRef: "28.3.1",
          description: "Na página de Invoices selecionar a opção 'View an entire Month', escolher o mês alvo e clicar em 'Show summary'.",
          classification: "ME"
        },
        {
          id: "step_28_28.4",
          sourceRef: "28.4",
          description: "Do resumo exibido, localizar a invoice desejada e clicar em 'View invoice' para ver os detalhes do deal que serão exportados.",
          classification: "ME"
        },
        {
          id: "step_28_28.5",
          sourceRef: "28.5",
          description: "No filtro 'Commodity Type' escolher o componente a ser extraído (Physical NGL ou Physical Oil). Para este procedimento focar em Physical NGL conforme o exemplo.",
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
          description: "No Excel exportado remover as colunas que não serão utilizadas no cruzamento (trade time, leg ID, origin ID, Product, hub, Strip, Qty Units, memo, source, clearing user id, USI, Quantity, Authorized traders).",
          classification: "ME"
        },
        {
          id: "step_28_28.7.1",
          sourceRef: "28.7.1",
          description: "Excluir as colunas listadas e manter apenas as colunas necessárias para identificação do deal e do broker reference.",
          classification: "ME"
        },
        {
          id: "step_28_28.8",
          sourceRef: "28.8",
          description: "Criar três colunas adicionais: 'Deal' (Deal ID), 'SAP Match' e 'Status'; identificar que Deal ID iniciando por 992 = Physical NGL e por 994 = Physical OIL.",
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
          description: "No VIM Workplace pesquisar o fornecedor e abrir a invoice cujo processamento será feito (confirme Vendor Name, Invoice number, Invoice date, Invoice amount, Bank remittance e Supply period conforme necessário).",
          classification: "ME"
        },
        {
          id: "step_28_28.10",
          sourceRef: "28.10",
          description: "Na invoice aberta ir até a aba 'Other Data' e selecionar a função 'Search Accrual VBD' para locate VBDs em aberto que possam casar com os deals.",
          classification: "ME"
        },
        {
          id: "step_28_28.11",
          sourceRef: "28.11",
          description: "Executar a pesquisa de Accrual VBD e exportar os resultados. Antes de executar, garantir que o campo 'Bill of Lading' esteja completamente em branco para não filtrar indevidamente os resultados. Campo 'Bill of Lading' deve permanecer em branco antes de executar Search/Append VBD: Garantir que o campo 'Bill of Lading' esteja completamente vazio antes de pressionar Execute (F8) em Search Accrual VBD ou antes de Append VBD no VIM para evitar filtragem ou associação incorreta de VBDs.",
          classification: "ME"
        },
        {
          id: "step_28_28.11.1",
          sourceRef: "28.11.1",
          description: "Verificar o campo 'Bill of Lading' e apagar qualquer conteúdo presente; confirmar vazio.",
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
          description: "Na listagem de VBD aplicar Sort e Filter para isolar linhas com campos em branco conforme a instrução e preparar para exportação.",
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
          description: "No Excel do ICE usar VLOOKUP para comparar Broker Reference/Deal ID com a coluna do Excel exportado do SAP e preencher a coluna 'Status' com 'YES' quando a referência existir no SAP e 'NO' caso contrário.",
          classification: "MA"
        },
        {
          id: "step_28_28.13.1",
          sourceRef: "28.13.1",
          description: "Inserir fórmula VLOOKUP para localizar o Broker Reference no arquivo SAP exportado; popular a coluna 'Status' com 'YES' ou 'NO'.",
          classification: "ME"
        },
        {
          id: "step_28_28.14",
          sourceRef: "28.14",
          description: "Filtrar as linhas com 'Status' = 'YES' no Excel e copiar todos os números de VBD retornados para uso no VIM.",
          classification: "ME"
        },
        {
          id: "step_28_28.15",
          sourceRef: "28.15",
          description: "No VIM Workplace, aba 'Other Data' → 'Search Accrual VBD', colar os números de documento VBD copiados e executar (F8) para carregar esses VBDs na invoice.",
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
          description: "Selecionar todos os VBDs carregados e executar a ação 'Overwrite VBD'; então ir à aba 'Line Item' salvar e verificar o quanto foi considerado para clear e os saldos remanescentes. Limite de tolerância para invoices de comissão: Verificar o valor do Balance em 'Line Item'. O limite de tolerância para invoice de comissão é 2000 dólares; somente proceder com ajuste online quando o saldo estiver dentro desse limite.",
          classification: "MA"
        },
        {
          id: "step_28_28.16.1",
          sourceRef: "28.16.1",
          description: "Clicar em 'Overwrite VBD' para associar os VBDs selecionados à invoice.",
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
          description: "Usar o Deal ID (copiado do arquivo ICE) para consultar no LiveLink e obter o Excel de mapeamento que contém o P66 DEAL ID para VLOOKUP.",
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
          description: "Inspecionar a coluna Deal ID e excluir todas as entradas que começam com '994' quando o foco for Physical NGL; manter apenas os deals 992 relevantes.",
          classification: "ME"
        },
        {
          id: "step_28_28.20",
          sourceRef: "28.20",
          description: "No VIM Workplace → Other Data → Search Accrual VBD colar todos os VBDs atualizados (após VLOOKUP e limpeza) e executar (F8) para recarregar os VBDs.",
          classification: "ME"
        },
        {
          id: "step_28_28.21",
          sourceRef: "28.21",
          description: "Acessar a aba 'Line Item', salvar as alterações; caso o saldo esteja dentro do limite de tolerância de comissão, proceder com o processamento online; caso contrário, ajustar conforme indicado. Limite de tolerância para invoices de comissão: Verificar o valor do Balance em 'Line Item'. O limite de tolerância para invoice de comissão é 2000 dólares; somente proceder com ajuste online quando o saldo estiver dentro desse limite.",
          classification: "MA"
        },
        {
          id: "step_28_28.21.1",
          sourceRef: "28.21.1",
          description: "Clicar em Save na aba Line Item e ler o valor do Balance. Se Balance ≤ limite de tolerância permitir alterações online; caso contrário, identificar diferença.",
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
          description: "Abrir o aplicativo SAP Fiori, colar o Deal number e executar a pesquisa; abrir a linha retornada para inspeção.",
          classification: "ME"
        },
        {
          id: "step_28_28.22.2",
          sourceRef: "28.22.2",
          description: "Copiar todos os Deal numbers válidos encontrados no Fiori para uso em ZEWB.",
          classification: "ME"
        },
        {
          id: "step_28_28.23",
          sourceRef: "28.23",
          description: "No SAP, abrir a transação ZEWB, inserir todos os Deal numbers copiados e executar (F8) para obter os VBDs que dispararam; copiar esses VBDs.",
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
          description: "Copiar todos os números de VBD retornados pela ZEWB (VBDs que 'fired').",
          classification: "ME"
        },
        {
          id: "step_28_28.24",
          sourceRef: "28.24",
          description: "No VIM Workplace → Other Data → Search Accrual VBD colar os VBDs obtidos pela ZEWB, executar e usar a ação 'Append VBD' para anexá-los à invoice; confirmar campo Bill of Lading vazio antes de executar. Campo 'Bill of Lading' deve permanecer em branco antes de executar Search/Append VBD: Garantir que o campo 'Bill of Lading' esteja completamente vazio antes de pressionar Execute (F8) em Search Accrual VBD ou antes de Append VBD no VIM para evitar filtragem ou associação incorreta de VBDs.",
          classification: "ME"
        },
        {
          id: "step_28_28.24.1",
          sourceRef: "28.24.1",
          description: "Colar os VBDs, executar a pesquisa e clicar em 'Append VBD' para vincular os documentos à invoice.",
          classification: "ME"
        },
        {
          id: "step_28_28.25",
          sourceRef: "28.25",
          description: "Ir para Line Item, ajustar manualmente o valor para que o balance fique dentro do limite de tolerância (se aplicável), clicar em 'Recalculate Price' e salvar as alterações. Limite de tolerância para invoices de comissão: Verificar o valor do Balance em 'Line Item'. O limite de tolerância para invoice de comissão é 2000 dólares; somente proceder com ajuste online quando o saldo estiver dentro desse limite.",
          classification: "MA"
        },
        {
          id: "step_28_28.25.1",
          sourceRef: "28.25.1",
          description: "Alterar o balance para zerar ou ficar dentro do limite aceitável; confirmar mudança no campo Balance.",
          classification: "ME"
        },
        {
          id: "step_28_28.25.2",
          sourceRef: "28.25.2",
          description: "Clicar em 'Recalculate Price' e então em Save para aplicar a alteração.",
          classification: "ME"
        },
        {
          id: "step_28_28.26",
          sourceRef: "28.26",
          description: "Clicar em 'Simulate Rules' para encontrar exceções; se surgir 'Suspected Duplicate', copiar o número da invoice e verificar no VIM Analytics; se confirmado não-duplicado proceder com comentário 'Non Duplicate' e salvar para postar. Procedimento em caso de 'Suspected Duplicate' detectado por Simulate Rules: Condição: Botão 'Simulate Rules' retorna exceção 'Suspected Duplicate'.. Ações: Copiar o número da invoice identificado como suspeito.; Ir para VIM Analytics e colar o número, executar pesquisa (F8).; Inspecionar o resultado: se apenas um registro estiver presente considerar não-duplicado; caso exista duplicidade real, seguir procedimento de reversão/contato conforme políticas internas (não documentadas nesta seção).; Se for não-duplicado, no VIM Workplace selecionar 'Non Duplicate', inserir comentário 'Non Duplicate' e salvar para postar.. Resultado: 28.26 · Clicar em 'Simulate Rules' para encontrar exceções; se surgir 'Suspected Duplicate', copiar o número da invoice e verificar no VIM Analytics; se confirmado não-duplicado proceder com comentário 'Non Duplicate' e salvar para postar.",
          classification: "ME"
        },
        {
          id: "step_28_28.26.1",
          sourceRef: "28.26.1",
          description: "Clicar no botão 'Simulate Rules' e identificar eventuais exceções listadas (p.ex. Suspected Duplicate).",
          classification: "ME"
        },
        {
          id: "step_28_28.26.2",
          sourceRef: "28.26.2",
          description: "Copiar o número da invoice e acessar VIM Analytics; colar o número e executar pesquisa para verificar se existe registro duplicado.",
          classification: "MS"
        },
        {
          id: "step_28_28.26.3",
          sourceRef: "28.26.3",
          description: "Se a verificação retornar apenas um line item (não duplicado), no VIM Workplace selecionar Non-Duplicate, inserir comentário 'Non Duplicate' e salvar; a invoice será então postada.",
          classification: "ME"
        },
      ]
    },
    {
      id: "step_29",
      sourceStep: "29",
      number: "29",
      title: "Processamento de faturas Freight & Transportation — HARLEY MARINE (classificação Trip / Non‑Trip e criação de VBD via ZEWB) Step-by-step procedure",
      description: "Step-by-step procedure para validar fatura do fornecedor Harley Marine Financing LLC, solicitar codificação ao scheduler, criar VBD no ZEWB e finalizar o processamento no VIM para codificação Non‑Trip ou Trip conforme fornecido pelo scheduler.",
      classification: "MS",
      classifications: ["MS"],
      macroBlockId: "routing",
      macroBlockName: "Routing",
      capabilityId: "cap-auto",
      capabilityName: "Automation Capability",
      solutionId: "sol-wf-routing",
      solutionIds: ["sol-wf-routing"],
      technologyType: "Workflow",
      rationale: "O fluxo depende da classificação Trip/Non-Trip informada pelo Scheduler e do encaminhamento para aprovação.",
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
        description: "`approval_required` — revisão humana permanece necessária para dados, exceções, aprovações e/ou transações financeiras."
      },
      substeps: [
        {
          id: "step_29_29.1",
          sourceRef: "29.1",
          description: "Abra o VIM Workplace e localize a fatura do fornecedor 'Harley Marine Financing LLC'. Abra o registro da fatura para realizar validações iniciais dos campos. Validação inicial obrigatória no VIM: Confirmar presença e correção dos campos: Vendor Name, Invoice number, Invoice date, Invoice amount, Bank remittance details e Supply period antes de prosseguir.",
          classification: "ME"
        },
        {
          id: "step_29_29.2",
          sourceRef: "29.2",
          description: "Comparar os campos Basic Data no VIM com a cópia original da fatura. Campos a validar: Nome do Vendor, Número da Invoice, Data da Invoice, Valor da Invoice, Dados bancários para remessa (Bank remittance) e Período de fornecimento (Supply period). Se todos os campos conferirem, prosseguir para localizar o scheduler. Conferência detalhada contra a cópia original: Comparar cada campo do Basic Data com a cópia da fatura; registrar qualquer discrepância encontrada.",
          classification: "MA"
        },
        {
          id: "step_29_29.3",
          sourceRef: "29.3",
          description: "No registro da fatura, confirme o campo de descrição (Delivery to) e localize o nome do scheduler indicado. Exemplo do caso: Delivery to - BARGE NATHAN SCHMIDT; Scheduler Name - Gabriel.E.Aguirre. Anote o nome do scheduler para envio do pedido de codificação.",
          classification: "ME"
        },
        {
          id: "step_29_29.4",
          sourceRef: "29.4",
          description: "Enviar ao scheduler indicado uma solicitação de codificação pedindo os detalhes de Trip ou Non‑Trip para esta fatura. Inclua no pedido a referência da invoice (número) e peça explicitamente a indicação 'Trip Related' ou 'Non‑Trip Related' e os códigos necessários para Material, Plant e Strategy conforme política interna.",
          classification: "MS"
        },
        {
          id: "step_29_29.5",
          sourceRef: "29.5",
          description: "Ao receber a resposta do scheduler, registre os dados de codificação recebidos. Confirme se a resposta identifica se a fatura é 'Trip Related' ou 'Non‑Trip Related' e capture os valores de Material, Plant e Strategy fornecidos pelo scheduler.",
          classification: "ME"
        },
        {
          id: "step_29_29.6",
          sourceRef: "29.6",
          description: "Decisão para escolher o fluxo ZEWB apropriado conforme a classificação informada pelo scheduler.",
          classification: "ME"
        },
        {
          id: "step_29_29.7",
          sourceRef: "29.7",
          description: "No SAP S/4, abrir a transação ZEWB (Custom Trading Expense Workbench). Selecionar a opção 'Non‑Trip Related'. Informar os valores de Material, Plant e Strategy exatamente conforme fornecido pelo scheduler e executar (Execute).",
          classification: "ME"
        },
        {
          id: "step_29_29.8",
          sourceRef: "29.8",
          description: "No SAP S/4, abrir a transação ZEWB (Custom Trading Expense Workbench). Selecionar a opção 'Trip Related' (o procedimento indica apenas selecionar esta opção diferente). Informar os valores de Material, Plant e Strategy conforme fornecido pelo scheduler e executar (Execute). Observação: após esta seleção, os passos seguintes são idênticos ao fluxo Non‑Trip.",
          classification: "ME"
        },
        {
          id: "step_29_29.9",
          sourceRef: "29.9",
          description: "Após executar a consulta no ZEWB e exibir a página de resultados, selecione a linha do item correspondente e clique em 'Create Expenses' para iniciar a criação do VBD.",
          classification: "MA"
        },
        {
          id: "step_29_29.10",
          sourceRef: "29.10",
          description: "Atualizar os campos de Expenses class, Accounting type, Posting Category, Posting date, Partner (Vendor code), Amount, Invoice number e Document date. Após preencher, pressionar Enter e salvar. Ao salvar, será gerado o número do documento VBD — copiar e registrar este número. Confirmação de geração e captura do número do VBD: Após salvar o VBD no ZEWB, copiar o número do documento e mantê‑lo disponível para colar no VIM (Other data → Overwrite VBD’s).",
          classification: "ME"
        },
        {
          id: "step_29_29.11",
          sourceRef: "29.11",
          description: "No VIM Workplace, ir à seção 'Other data', colar o número do VBD copiado e selecionar a opção 'Overwrite VBD’s' para associar o VBD recém‑criado à fatura no VIM.",
          classification: "ME"
        },
        {
          id: "step_29_29.12",
          sourceRef: "29.12",
          description: "Acessar a aba 'Accounting' no registro da fatura no VIM, atualizar/confirmar Baseline date, Payment terms e Due date conforme instruções internas e salvar as alterações.",
          classification: "ME"
        },
        {
          id: "step_29_29.13",
          sourceRef: "29.13",
          description: "Na interface do VIM, selecionar 'Simulate Rules' para verificar exceções e, se aplicável, clicar em 'Apply Rules' para processar as regras de negócio. Confirmar mensagem de 'Invoice Successfully Processed' após aplicação das regras. Executar Simulate Rules e Apply Rules no VIM: Clicar em 'Simulate Rules' para identificar exceções e, se apropriado, clicar em 'Apply Rules'. Confirmar que a ação resultou em 'Invoice Successfully Processed'.",
          classification: "ME"
        },
      ]
    },
    {
      id: "step_30",
      sourceStep: "30",
      number: "30",
      title: "Process South Bow / TransCanada Keystone — reconciliação de arquivos, codificação e upload OAWD Step-by-step procedure para localizar e validar a",
      description: "Step-by-step procedure para localizar e validar arquivos, reconcile values em planilha SOB Statement, preparar códigos e efetuar o upload e processamento da fatura SOUTH BOW (USA) LP / Phillips 66 Canada Ltd no S/4 (T-Code OAWD) e execução final no VIM Workplace.",
      classification: "ME",
      classifications: ["ME", "MS"],
      macroBlockId: "execution",
      macroBlockName: "Execution",
      capabilityId: "cap-auto",
      capabilityName: "Automation Capability",
      solutionId: "sol-rpa-upload-vim",
      solutionIds: ["sol-rpa-upload-vim"],
      technologyType: "RPA / Spreadsheet",
      rationale: "A reconciliação South Bow combina arquivos, fórmulas, extração de valores e upload OAWD; requer validação de saldo e integração.",
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
        description: "`review_required` — revisão humana permanece necessária para dados, exceções, aprovações e/ou transações financeiras."
      },
      substeps: [
        {
          id: "step_30_30.1",
          sourceRef: "30.1",
          description: "Acesse o diretório compartilhado informado e confirme que os documentos listados estão presentes antes de iniciar o processamento. Arquivos ausentes — notificar contatos responsáveis: Um ou mais arquivos obrigatórios não estiverem presentes no caminho fonte ou no diretório de processamento. · anika.jindal@p66.com; ameerah.martinez@p66.com · e-mail",
          classification: "ME"
        },
        {
          id: "step_30_30.1.1",
          sourceRef: "30.1.1",
          description: "Abra o caminho S:\\PSX\\Commercial\\ACCOUNTING\\Crude Accounting\\Mid-Con\\Wood River - Keystone\\2025 e verifique a presença dos seguintes arquivos: 1) SOB Invoice Copy; 2) NOB Invoice Copy; 3) SOB Statement Output (Current month); 4) SOB Statement Output (previous month); 5) Keystone Tariff Schedule. Se algum arquivo estiver faltando, envie e-mail conforme CO_MISSING_FILES_ESCALATION.",
          classification: "ME"
        },
        {
          id: "step_30_30.2",
          sourceRef: "30.2",
          description: "Depois de confirmar os arquivos no local fonte, copie todos os arquivos necessários para o diretório de trabalho usado pelo time de processamento. Arquivos ausentes — notificar contatos responsáveis: Um ou mais arquivos obrigatórios não estiverem presentes no caminho fonte ou no diretório de processamento. · anika.jindal@p66.com; ameerah.martinez@p66.com · e-mail Confirmação de cópia para pasta de processamento: Todos os arquivos verificados devem ser copiados para S:\\PSX\\Commercial\\ACCOUNTING\\BILLING\\Secondary Cost \\Victoria and Saravanan\\Crude\\Keystone\\Transcanada Invoice Process\\2025 antes de prosseguir.",
          classification: "ME"
        },
        {
          id: "step_30_30.2.1",
          sourceRef: "30.2.1",
          description: "Copie todos os arquivos verificados para S:\\PSX\\Commercial\\ACCOUNTING\\BILLING\\Secondary Cost \\Victoria and Saravanan\\Crude\\Keystone\\Transcanada Invoice Process\\2025. Confirme que cópias exatas (mesmo nome e data) estão presentes no destino antes de prosseguir.",
          classification: "ME"
        },
        {
          id: "step_30_30.3",
          sourceRef: "30.3",
          description: "Abra o arquivo 'SOB Statement Output (Current month)' e atualize as colunas C1 e C2 conforme instruções.",
          classification: "ME"
        },
        {
          id: "step_30_30.3.1",
          sourceRef: "30.3.1",
          description: "Na aba Invoice Reconciliation do arquivo SOB Statement, insira na Coluna C1 a data do mês da fatura no formato MM/DD/YYYY (ex.: 08/01/2025).",
          classification: "MA"
        },
        {
          id: "step_30_30.3.2",
          sourceRef: "30.3.2",
          description: "Na mesma aba, preencha a Coluna C2 com a taxa USD/CAD conforme detalhado no arquivo 'Keystone Tariff Schedule'. Utilize a taxa aplicável ao período da fatura.",
          classification: "ME"
        },
        {
          id: "step_30_30.4",
          sourceRef: "30.4",
          description: "No arquivo de reconciliação, limpe/remova todas as linhas/entradas aplicadas na Coluna F (destacadas em laranja) referentes a TransCanada Keystone Pipeline LP e Phillips 66 Canada Ltd.",
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
          description: "No(s) arquivo(s) de invoice (SOB Invoice Copy), localize todas as cobranças identificadas como 'Diversion Charges' e some-as. Lance o total apurado na Coluna F6.",
          classification: "ME"
        },
        {
          id: "step_30_30.7",
          sourceRef: "30.7",
          description: "Some todas as 'Variable Charges' do SOB Invoice e adicione o valor do 'Monthly Revenue Commitment'. A partir do total, deduza as 'Deficiency fees' (já registradas em F5) e registre o resultado na Coluna F7.",
          classification: "ME"
        },
        {
          id: "step_30_30.8",
          sourceRef: "30.8",
          description: "Extraia o valor de 'Position Settlement' diretamente da cópia da invoice e registre-o na Coluna F8 do worksheet de reconciliação.",
          classification: "MA"
        },
        {
          id: "step_30_30.9",
          sourceRef: "30.9",
          description: "Localize na cópia da invoice o campo correspondente a 'Add Variable True Up' e insira o valor apurado na Coluna F10 do arquivo de reconciliação.",
          classification: "MA"
        },
        {
          id: "step_30_30.10",
          sourceRef: "30.10",
          description: "Verifique que a soma dos componentes na planilha (F5 a F10 e demais itens aplicáveis) resulte no mesmo total apresentado na SOB Invoice Copy. Objetivo: reconciliação sem diferenças. Reconciliar diferença = Nil obrigatório: A diferença de reconciliação na planilha deve ser zero (Nil) antes de preparar codificação e prosseguir com upload.",
          classification: "MA"
        },
        {
          id: "step_30_30.11",
          sourceRef: "30.11",
          description: "No sheet 'Misc Fees' do 'SOB Statement', extraia as Deficiency fees atribuíveis à Phillips 66 Canada Ltd. Converta o valor para USD dividindo pela taxa em Coluna C2 (USD/CAD) e registre o resultado na Coluna F15.",
          classification: "ME"
        },
        {
          id: "step_30_30.12",
          sourceRef: "30.12",
          description: "Extraia todas as 'Diversion Charges' do NOB Invoice (Phillips 66 Canada Ltd) e registre o total convertido (quando aplicável) na Coluna F16.",
          classification: "ME"
        },
        {
          id: "step_30_30.13",
          sourceRef: "30.13",
          description: "Some todas as 'Variable Charges' do SOB Invoice aplicáveis à Phillips 66 Canada Ltd, acrescente o 'Monthly Revenue Commitment' e deduza as 'Deficiency fees' conforme instruções; lance o resultado na Coluna F17.",
          classification: "ME"
        },
        {
          id: "step_30_30.14",
          sourceRef: "30.14",
          description: "Localize e extraia 'Abandonment Fees' da cópia da invoice (NOB Invoice) e registre o valor na Coluna F18 do worksheet.",
          classification: "ME"
        },
        {
          id: "step_30_30.15",
          sourceRef: "30.15",
          description: "Confirme que o campo de diferença de reconciliação na planilha apresente valor zero (Nil). Se não estiver Nil, pare o processamento e reporte conforme UNQ_RECON_ACTIONS_UNKNOWN. Reconciliar diferença = Nil obrigatório: A diferença de reconciliação na planilha deve ser zero (Nil) antes de preparar codificação e prosseguir com upload.",
          classification: "MA"
        },
        {
          id: "step_30_30.16",
          sourceRef: "30.16",
          description: "Com a reconciliação concluída (diferença Nil), documente os valores e prepare os lançamentos contábeis (GL), centro de lucro e demais campos exigidos para o lançamento da fatura. Registre estes códigos no documento de preparação de invoice. Reconciliar diferença = Nil obrigatório: A diferença de reconciliação na planilha deve ser zero (Nil) antes de preparar codificação e prosseguir com upload.",
          classification: "MA"
        },
        {
          id: "step_30_30.17",
          sourceRef: "30.17",
          description: "No S/4, acesse o T-Code OAWD e efetue o upload manual do arquivo de invoice. Selecione a opção HVC Non PO durante o processo de upload.",
          classification: "ME"
        },
        {
          id: "step_30_30.17.1",
          sourceRef: "30.17.1",
          description: "Durante o fluxo de upload em OAWD, marque/select a opção 'HVC Non PO' para classificar corretamente o tipo de documento a ser criado.",
          classification: "ME"
        },
        {
          id: "step_30_30.18",
          sourceRef: "30.18",
          description: "Acesse VIM Workplace para executar a invoice carregada e atualize os dados básicos conforme instruções.",
          classification: "ME"
        },
        {
          id: "step_30_30.18.1",
          sourceRef: "30.18.1",
          description: "No VIM Workplace, na tela de edição da invoice, faça as seguintes atualizações: Vendor code = 50392116 (South Bow (USA) LP); informe o número da invoice e a data; registre o e-mail do requestor; verifique e confirme os detalhes de remessa bancária (bank remittance). Salve as alterações.",
          classification: "ME"
        },
        {
          id: "step_30_30.19",
          sourceRef: "30.19",
          description: "Na aba Line-Item do registro da invoice no VIM, insira os valores de GL account, material (quando aplicável), montante por linha e profit center conforme os detalhes preparados. Após inserir todos os dados exigidos, salve o documento.",
          classification: "ME"
        },
        {
          id: "step_30_30.20",
          sourceRef: "30.20",
          description: "No campo Baseline/Payment do registro de invoice no VIM ou tela correspondente, atualize a Document date, marque Manual Entry se aplicável e ajuste o Payment term conforme consta na invoice. Salve as alterações.",
          classification: "MA"
        },
        {
          id: "step_30_30.21",
          sourceRef: "30.21",
          description: "Na tela de processamento do VIM Workplace, selecione a opção 'Simulate Rules' e em seguida clique em 'Apply Rules'. Verifique que o resultado apresente indicadores verdes (success). Só prossiga se o status apresentar as luzes verdes. Confirmar estado verde após apply rules: Após 'Simulate Rules' e 'Apply Rules' o status deve mostrar indicadores verdes (confirmando regras aplicadas sem erros).",
          classification: "ME"
        },
      ]
    },
    {
      id: "step_31",
      sourceStep: "31",
      number: "31",
      title: "Invoice submission em S4 para aprovação Trip / Non‑Trip (Freight & Transportation) Procedimento para submeter fatura no S4, categorizando-a como Non-",
      description: "Procedimento para submeter fatura no S4, categorizando-a como Non-PO e encaminhando para aprovação da Gina. Verificar se o fornecedor faz parte da lista de fornecedores Freight & Transportation (38 fornecedores) e informar o método de processamento identificado (Transport system, Auto-fired VBD, Non-PO) na submissão.",
      classification: "ME",
      classifications: ["ME", "MS"],
      macroBlockId: "routing",
      macroBlockName: "Routing",
      capabilityId: "cap-auto",
      capabilityName: "Automation Capability",
      solutionId: "sol-wf-routing",
      solutionIds: ["sol-wf-routing"],
      technologyType: "Workflow",
      rationale: "A submissão para aprovação depende de categorização, lista de fornecedores e encaminhamento controlado no S4.",
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
        description: "`approval_required` — revisão humana permanece necessária para dados, exceções, aprovações e/ou transações financeiras."
      },
      substeps: [
        {
          id: "step_31_31.1",
          sourceRef: "31.1",
          description: "No S4, abrir ou criar o documento de fatura que deve ser submetido para aprovação. Categorizar explicitamente a fatura como 'Non-PO' antes da submissão para aprovação. Classificação obrigatória como Non-PO: A fatura deve estar categorizada como 'Non-PO' no S4 antes de qualquer submissão para aprovação, conforme instrução 'Step 20'.",
          classification: "MS"
        },
        {
          id: "step_31_31.1.1",
          sourceRef: "31.1.1",
          description: "Confirmar que os campos essenciais estão preenchidos no documento em S4: identificação do fornecedor (Vendor ID), valor da fatura, data da fatura e referência da fatura. Não modificar campos não apresentados no documento original sem autorização.",
          classification: "ME"
        },
        {
          id: "step_31_31.1.2",
          sourceRef: "31.1.2",
          description: "Selecionar a categoria / tipo de documento que classifica a fatura como 'Non-PO'. Salvar o registro para que a categoria fique persistida antes de qualquer envio para aprovação. Classificação obrigatória como Non-PO: A fatura deve estar categorizada como 'Non-PO' no S4 antes de qualquer submissão para aprovação, conforme instrução 'Step 20'.",
          classification: "MS"
        },
        {
          id: "step_31_31.2",
          sourceRef: "31.2",
          description: "Confirmar se o Vendor ID da fatura está presente na lista dos 38 fornecedores que possuem tratamento descrito (Transport system, Auto-fired VBD, Non-PO).",
          classification: "MS"
        },
        {
          id: "step_31_31.3",
          sourceRef: "31.3",
          description: "Encaminhar a fatura, já categorizada como Non-PO, para aprovação da Gina no S4, incluindo na submissão a informação do método de processamento do fornecedor conforme listado (Transport system, Auto-fired VBD, Non-PO). Incluir método de processamento ao submeter: Ao submeter para aprovação da Gina, incluir na nota/observação o método de processamento do fornecedor (Transport system, Auto-fired VBD, Non-PO) conforme indicado pela lista de fornecedores.",
          classification: "MS"
        },
        {
          id: "step_31_31.3.1",
          sourceRef: "31.3.1",
          description: "Consultar a lista (quando acessível) e inserir na nota/observação da submissão o método de processamento identificado para o fornecedor: Transport system, Auto-fired VBD ou Non-PO. Caso o método não esteja explícito na lista, registrar 'método não especificado' no campo de observações. Incluir método de processamento ao submeter: Ao submeter para aprovação da Gina, incluir na nota/observação o método de processamento do fornecedor (Transport system, Auto-fired VBD, Non-PO) conforme indicado pela lista de fornecedores.",
          classification: "MS"
        },
        {
          id: "step_31_31.3.2",
          sourceRef: "31.3.2",
          description: "Usar a funcionalidade de submissão/fluxo de aprovação disponível no S4 para direcionar o documento à Gina para revisão e aprovação. Incluir comentário que a fatura é 'Non-PO' e apontar o método de processamento conforme registrado. Incluir método de processamento ao submeter: Ao submeter para aprovação da Gina, incluir na nota/observação o método de processamento do fornecedor (Transport system, Auto-fired VBD, Non-PO) conforme indicado pela lista de fornecedores.",
          classification: "MS"
        },
        {
          id: "step_31_31.3.3",
          sourceRef: "31.3.3",
          description: "Após execução do envio para aprovação, verificar no S4 se há indicação de que o documento foi encaminhado para o aprovador (status de workflow ou registro de envio). Registrar ou salvar qualquer confirmação/ID de workflow no caso de auditoria.",
          classification: "MS"
        },
      ]
    },
  ]
};

export const automationDetailMap: Record<string, ProcessAutomationDetailData> = {
  "special-handling": specialHandlingAutomationData
};