# Output do Step 3 — Framework por Steps

> **Fonte:** SOP “P66_L6DTP_Processamento de Faturas Secundárias e Rebill de Crédito/Débito V.2.0” — versão 1.0, criação 17/09/2026.

> **Finalidade:** dataset em Markdown para alimentar uma visão mockada da nova tela: uma única tabela de Steps e um detalhe expansível por Step.

> **Status:** `needs_validation`. As soluções tecnológicas são propostas futuras; a SOP comprova o trabalho atual, não a disponibilidade de APIs, licenças, permissões ou integrações.

## 1. Resumo da análise

- **Processo:** P66_L6DTP — Processamento de Faturas Secundárias e Rebill de Crédito/Débito.
- **Área/owner:** Contabilidade / Processamento de Custos Secundários; P66 / Analistas de Secondary Cost.
- **Frequência:** Diário.
- **Sistemas observados:** SAP S/4 e VIM, OAWD, ZEWB, Fiori, FBL1N, FBL5H, FAGLL03H, WB21/WB23, MDG Launchpad, VIM Analytics, T4, ICE, LiveLink, BlackLine, Trac 66, Outlook e Excel/planilhas.
- **Cobertura extraída:** 31 Steps principais e 849 registros de procedimento, incluindo decisões e sub-steps.
- **Regra de agrupamento:** cada Step principal aparece uma vez; atividades filhas permanecem dentro de `substeps`.
- **Limitação importante:** a SOP possui muitos procedimentos específicos e campos condicionais; esforço, solução e macroetapa são inferências de análise e devem ser revisados com o dono do processo e arquitetura.

## 2. Contrato do frame preservado

O frame existente deve consumir os cinco `macro_block_id` abaixo sem alteração visual:
| macro_block_id | Nome de exibição | Papel | Steps |
|---|---|---|---:|
| `entrada` | Intake | receber, coletar, extrair e preparar dados/documentos | 3 |
| `roteamento` | Routing | classificar, priorizar e encaminhar para a fila ou responsável | 4 |
| `execucao` | Execution | consultar, atualizar, criar, reconciliar ou executar transações | 20 |
| `excecao` | Exception | tratar divergências, faltas, ambiguidades, bloqueios e aprovações | 3 |
| `codificacao` | Codification | preservar evidências, registrar resultados e preparar trilha de auditoria | 1 |

Camadas transversais do frame permanecem fora deste output de detalhamento: Human-in-the-loop, Digital Agent, Orchestrator Agent, MCP/Integration Layer, Specialist Solutions e Anomaly Detection/Evaluator. Os campos `human_control` e as soluções por Step permitem ligar o detalhe a essas camadas sem recriá-las.

## 3. Tabela única de Steps

| Macroetapa | Step | Título do Step | Classificação(ões) | Solução tecnológica | Esforço |
|---|---:|---|---|---|---|
| Intake | 1 | Recebimento de fatura e upload manual em OAWD Executar o upload manual de uma fatura de Secondary Cost no SAP usando a transação OAWD a partir da soli | ME | RPA | Médio |
| Intake | 2 | Navegação e Uso do VIM Workplace (S/4 VIM) — Acesso, Visualização e Ações Básicas Procedimento operacional para acessar o VIM Workplace, visualizar in | ME + MS | Workflow | Médio |
| Execution | 3 | Processamento manual de fatura Non-PO e criação de VBD (Trip e Non‑Trip) Procedimento executável para registrar, codificar, submeter para aprovação e  | ME + MS | RPA | Alto |
| Execution | 4 | Criação manual de VBD (ZEWB) — fluxos Trip e Non‑Trip Procedimento executável para criar VBD manualmente no Custom Trading Expenses Workbench para pro | ME + MS | RPA | Alto |
| Exception | 5 | Criar solicitação MDG para extensão/correção de material Fluxo executável para registrar uma solicitação no MDG quando for detectado que um plant não  | MS | Workflow | Alto |
| Execution | 6 | Criação de Trading Contract (WB21) e Verificação (WB23) Procedimento operacional para criar um Trading Contract usando WB21 (criação) e verificar via  | ME + MS | RPA | Alto |
| Execution | 7 | Processamento de Faturas Transportation & Terminal — localizar VBDs e associar/acertar valores Executar a sequência completa para localizar, filtrar,  | MS + MA | IA / Agente | Alto |
| Execution | 8 | Processo de Fatura de Pipeline — Tarifa de Pipeline Sequência operacional para validar, localizar VBDs, reconciliar valores e aplicar regras para fatu | MS + MA | IA / Agente | Alto |
| Execution | 9 | Processo de Débito Gain/Loss (Pipeline Gain/Loss) — Extração NK e criação/associação manual de VBD Sequência executável para validar a fatura Gain/Los | ME + MS | RPA | Alto |
| Execution | 10 | Processar faturas Pipeline Y‑Grade e encargos de transporte: identificação, casamento e criação manual de VBD Sequência executável para identificar a  | MS + MA | IA / Agente | Alto |
| Execution | 11 | Processamento de Faturas de Inspeção — fluxo Auto‑fired VBD Sequência executável para localizar, validar e processar faturas de inspeção que disparam  | SA + MS | Evaluator / Controle | Médio |
| Execution | 12 | Processamento de Faturas de Inspeção — Criação Manual de VBD (Trip e Non-Trip) Sequência operacional para criar manualmente um VBD (ZEWB) para faturas | ME + MS | RPA | Alto |
| Routing | 13 | Roteamento a Scheduler e Processamento Crude Non‑Trip Related Sequência executável para identificar quando encaminhar uma fatura ao scheduler e o proc | MS | Workflow | Médio |
| Execution | 14 | Processar fatura do fornecedor SGS CANADA INC (Non‑PO, codificação fixa) Procedimento passo a passo para verificar, classificar, aplicar regras, direc | ME + MS | Motor de regras | Médio |
| Codification | 15 | Processamento Intercompany — Exportar dados SAP (FAGLL03H) e preparar relatório WD06 Executar extração de lançamentos intercompany no SAP via FAGLL03H | ME + MS | RPA / Planilha | Médio |
| Exception | 16 | Processamento IC Pipeline Tariff / Terminal — ajustar Document Type SEC_SUM, criar/atualizar VBD e disparar incident em ServiceNow Sequência completa  | MS + MA | Workflow | Alto |
| Intake | 17 | Extração de Nomination Key via Fiori — obter NK, aplicar filtros e exportar Sequência executável para localizar Nomination Key no Fiori, aplicar os fi | ME | RPA | Médio |
| Execution | 18 | T4 (Transport4) — Conciliação Volume/Entrega e Processo de Loss Allowance Executar a conciliação entre valores de fatura e entregas utilizando o Trans | MS + MA | Analytics / Monitoramento | Alto |
| Routing | 19 | Processamento de Faturas Gain & Loss — classificação, atribuição de GL/Company/Profit Center e envio para aprovações Procedimento executável para iden | MS + MA | Workflow | Alto |
| Execution | 20 | Processo 999+ (Analista) — gerar relatório 999, preparar arquivo e submeter para execução em background Executar a rotina 999+ para associar VBDs ao i | ME + MS | RPA / Planilha | Médio |
| Execution | 21 | Processo 999+ (Supervisor) — Postagem, Clear Vendor e Ajustes (F-44 e controle de Due/Baseline Date) Sequência executável para o Supervisor realizar o | MS | Workflow | Alto |
| Execution | 22 | Processamento DCP Front Range Transportation — extração do Nomination Key (NK) via Fiori e geração/tratamento de VBD para transport system USDCPPFTRG  | ME + MS | RPA | Alto |
| Execution | 23 | Processo completo de criação e emissão de Credit Memo (VA01 → VF01 → VFO3) Executar todo o fluxo de rebill para crédito a partir das informações receb | MS | Workflow | Alto |
| Execution | 24 | Rebill — Processo de Debit Memo (ZEWB: criação do VBD, geração de output e envio ao Scheduler) Procedimento operacional para criar um Debit Memo em ZE | MS | Workflow | Alto |
| Exception | 25 | Processo de Fatura Revisada — Correção por crédito (original processado/impago) Sequência operacional para identificar lançamento original, levantar d | MS + MA | Workflow | Alto |
| Execution | 26 | Processar fatura de comissão única — identificar confirmation/deal, localizar VBD e preparar para postagem Procedimento passo a passo para localizar o | MS + MA | IA / Agente | Alto |
| Execution | 27 | Processo de Comissão — identificar e reconciliar VBDs para Multi Commission e Crude Commission Procedimento operacional para identificar, selecionar e | MA | IA / Agente | Alto |
| Execution | 28 | Processamento mensal de invoices ICE US Commodity Market — extração, cruzamento com VBDs e postagem Procedimento executável para extrair invoices do p | MS + MA | Analytics / Monitoramento | Alto |
| Routing | 29 | Processamento de faturas Freight & Transportation — HARLEY MARINE (classificação Trip / Non‑Trip e criação de VBD via ZEWB) Procedimento passo a passo | MS | Workflow | Alto |
| Execution | 30 | Processo South Bow / TransCanada Keystone — reconciliação de arquivos, codificação e upload OAWD Procedimento passo a passo para localizar e validar a | ME + MS | RPA / Planilha | Alto |
| Routing | 31 | Submissão de fatura em S4 para aprovação Trip / Non‑Trip (Freight & Transportation) Procedimento para submeter fatura no S4, categorizando-a como Non- | ME + MS | Workflow | Médio |

## 4. Detalhamento dos Steps

Cada seção abaixo representa o conteúdo esperado no drawer/painel ao clicar em uma linha da tabela. A descrição e a justificativa são sintéticas; os sub-steps preservam a rastreabilidade da SOP.

### Step 1 — Recebimento de fatura e upload manual em OAWD

- **step_id:** `step_01`
- **macroetapa:** Intake (`entrada`)
- **source_step_ref:** `1`
- **descrição breve:** Executar o upload manual de uma fatura de Secondary Cost no SAP usando a transação OAWD a partir da solicitação recebida no generic mailbox; confirmar que a fatura foi carregada no VIM Workspace para posterior processamento.
- **classificação consolidada:** `ME`
- **solução tecnológica:** `RPA`
- **por que foi selecionada:** O upload segue uma sequência estável em mailbox, arquivo local e OAWD; RPA é uma proposta sujeita à validação do ambiente SAP.
- **esforço:** `Médio` — estimativa relativa baseada na quantidade de sistemas, dependências, transações sensíveis, reconciliações e decisões observadas.
- **human_control:** `review_required` — revisão humana permanece necessária para dados, exceções, aprovações e/ou transações financeiras.
- **evidence_status:** `evidenced` para a atividade atual; `needs_validation` para solução, esforço e viabilidade técnica.
- **sub-steps:** 6 registros preservados da SOP.

| Sub-step | Descrição | Classificação individual |
|---|---|---|
| `1.1` | Abrir o generic mailbox que contém a solicitação de upload. Confirmar que a mensagem inclui o(s) documento(s) de suporte da fatura e salvar o anexo em local acessível para o usuário (por exemplo, pasta de trabalhos do usuário ou rede compartilhada). Documento de suporte obrigatório no e-mail de solicitação: A solicitação de upload deve incluir o(s) documento(s) de suporte da fatura (anexo). | `MS` |
| `1.2` | Abrir o cliente SAP. Executar a transação OAWD para entrar na tela de Upload de Invoice ao workflow VIM. | `ME` |
| `1.3` | Na tela da transação OAWD navegar até a opção de menu P66 Incoming VIM Invoice – HVC Non-PO e, a partir daí, selecionar o sub-menu 'VIM Invoice Upload for NPO Manual'. Selecionar o menu correto no OAWD: No OAWD selecionar 'P66 Incoming VIM Invoice – HVC Non-PO' e o sub-menu 'VIM Invoice Upload for NPO Manual' quando o procedimento padrão de upload for aplicável. | `ME` |
| `1.4` | Quando o pop-up 'Storing for subsequent entry' abrir, efetuar o upload do arquivo salvo contendo a fatura. | `ME` |
| `1.4.1` | Na janela de 'Storing for subsequent entry' selecionar a marca de confirmação (green tick) para acionar o processo de upload. Navegar até o local onde o arquivo da fatura foi salvo, selecionar o arquivo e confirmar para completar o upload. | `ME` |
| `1.5` | Após o upload, confirmar que a fatura aparece no VIM Workspace. Se a fatura estiver visível, encerrar este procedimento de upload — estado final: 'Fatura refletida no VIM Workspace' e encaminhar para o processamento (processamento da fatura manual ocorre em seção/processo subsequente). | `MS` |

### Step 2 — Navegação e Uso do VIM Workplace (S/4 VIM) — Acesso, Visualização e Ações Básicas

- **step_id:** `step_02`
- **macroetapa:** Intake (`entrada`)
- **source_step_ref:** `2`
- **descrição breve:** Procedimento operacional para acessar o VIM Workplace, visualizar informações do índice e imagens, revisar e atuar sobre faturas (visualização, comentários, arquivo de imagem, simulação de regras, marcações de obsoleto, reatribuição e tratamento de Document Type crédito).
- **classificação consolidada:** `ME + MS`
- **solução tecnológica:** `Workflow`
- **por que foi selecionada:** Workflow pode organizar revisão, comentários, filtros e encaminhamentos; os fluxos exatos de reatribuição ainda precisam ser validados.
- **esforço:** `Médio` — estimativa relativa baseada na quantidade de sistemas, dependências, transações sensíveis, reconciliações e decisões observadas.
- **human_control:** `review_required` — revisão humana permanece necessária para dados, exceções, aprovações e/ou transações financeiras.
- **evidence_status:** `evidenced` para a atividade atual; `needs_validation` para solução, esforço e viabilidade técnica.
- **sub-steps:** 30 registros preservados da SOP.

| Sub-step | Descrição | Classificação individual |
|---|---|---|
| `2.1` | Abrir o sistema SAP e navegar para a transação do VIM Workplace. | `ME` |
| `2.1.1` | No SAP, executar a transação /OPT/VTM_WP para abrir o VIM Workplace e aguardar carregamento do índice (inbox). | `ME` |
| `2.2` | Confirmar os campos-chave apresentados no índice do VIM Workplace para identificação rápida das faturas. | `ME` |
| `2.2.1` | Verificar que a lista (inbox) mostra, quando presentes, os seguintes campos: Requisition No, Reference No, Vendor No, Credit Memo, Document Start date, Document End date, Baseline Date, Current Role, Current Agent e Gross Amount. | `ME` |
| `2.3` | Abrir um line-item do índice para inspecionar a imagem da fatura associada. | `ME` |
| `2.3.1` | Na lista (inbox), clicar sobre a linha (line-item) da fatura desejada; confirmar que o painel de imagens/painel de visualização é carregado exibindo a(s) imagem(ns) da fatura. | `ME` |
| `2.4` | Localizar e revisar os dados de line items apresentados para a fatura selecionada. | `ME` |
| `2.4.1` | No detalhe do documento, revisar a seção de 'Line items' para validar quantidades, valores e demais linhas de custo presentes. | `ME` |
| `2.5` | Visualizar o histórico de processamento da fatura para acompanhar eventos anteriores. | `ME` |
| `2.5.1` | No detalhe da fatura, abrir a aba ou área 'Process History' e revisar os registros de ações já executadas (datas, agentes e status apresentados). | `ME` |
| `2.6` | Confirmar que a lista mostra as faturas atribuídas ao agente corrente e identificar desvios (faturas não relacionadas a Secondary cost). Exception — Faturas não relacionadas exibidas por glitch na tabela: Condição: O inbox exibe faturas que não pertencem ao escopo de Secondary cost devido a tabela desorganizada ou erro de filtragem.. Ações: Selecionar as faturas não relacionadas exibidas.; Iniciar a ação de reatribuição para o agente/categoria correta.; Salvar a reatribuição e confirmar que a fatura não pertence mais ao seu inbox após atualização subsequente.. Resultado: 2.6 · Confirmar que a lista mostra as faturas atribuídas ao agente corrente e identificar desvios (faturas não relacionadas a Secondary cost). Unknown — Localização/fluxo exato de reatribuição na interface: Determinar o botão/fluxo exato (nome do botão/menu) para executar a reatribuição de faturas na interface do VIM Workplace, quando aplicável. | `ME` |
| `2.6.1` | No topo do inbox, filtrar ou ordenar se necessário para ver apenas as faturas atribuídas ao Current Agent; confirmar que as faturas visíveis correspondem ao escopo de Secondary cost. | `MA` |
| `2.6.2` | Quando forem exibidas faturas não relacionadas devido a tabelas desorganizadas ou glitch, selecionar essas faturas e iniciar a reatribuição para o agente correto. Exception — Faturas não relacionadas exibidas por glitch na tabela: Condição: O inbox exibe faturas que não pertencem ao escopo de Secondary cost devido a tabela desorganizada ou erro de filtragem.. Ações: Selecionar as faturas não relacionadas exibidas.; Iniciar a ação de reatribuição para o agente/categoria correta.; Salvar a reatribuição e confirmar que a fatura não pertence mais ao seu inbox após atualização subsequente.. Resultado: 2.6 · Confirmar que a lista mostra as faturas atribuídas ao agente corrente e identificar desvios (faturas não relacionadas a Secondary cost). Unknown — Localização/fluxo exato de reatribuição na interface: Determinar o botão/fluxo exato (nome do botão/menu) para executar a reatribuição de faturas na interface do VIM Workplace, quando aplicável. | `ME` |
| `2.6.3` | Observar que faturas reatribuídas sairão do seu inbox e serão transferidas; o documento indica que a transferência/atribuição efetiva para o novo agente ocorrerá na próxima ocasião em que o inbox for atualizado. | `ME` |
| `2.7` | Usar o painel de detalhes para acessar Reference Number, Contact Details e o tipo de fatura (por ex. Inspection). | `ME` |
| `2.7.1` | Acionar a opção 'Hide details pane' quando necessário para ajustar a visualização; em seguida, no painel de detalhes, localizar e anotar Reference Number, Contact Details e identificar o tipo de invoice (ex.: Inspection). | `ME` |
| `2.8` | Adicionar ou editar comentários visíveis no VIM para registrar solicitações ou atualizações de status. | `MS` |
| `2.8.1` | Clicar em 'Open comment' (ou funcionalidade equivalente) no detalhe da fatura, inserir o texto do comentário que atualiza o 'Current status' ou solicita informações/approvação e salvar a entrada para que fique visível no histórico/process history. | `MS` |
| `2.9` | Conhecer e usar os botões coloridos apresentados no VIM para ações imediatas. | `ME` |
| `2.9.1` | Interpretar os botões coloridos: botão verde = opção para voltar; botão amarelo = opção para sair; botão vermelho = opção para cancelar. Usar cada botão conforme o propósito indicado para retornar, sair da tela ou cancelar a ação corrente. | `ME` |
| `2.10` | Visualizar e confirmar os anexos/imagens associados à fatura. | `ME` |
| `2.10.1` | Clicar em 'Display Image' no painel da fatura e confirmar que o(s) anexo(s) abre(m) corretamente; verificar se a imagem corresponde à fatura física (valores, fornecedor, datas). | `MA` |
| `2.11` | Executar a simulação das regras configuradas para a fatura e decidir a aplicação conforme resultado da simulação. Control — Simulação de regras obrigatória antes da aplicação: Executar a função 'Simulate rules' e revisar a saída antes de aplicar as regras à fatura. | `MS` |
| `Decisão` | Decisão: A simulação das regras apresenta erros/alertas que impedem a aplicação? Resultado da execução da função 'Simulate rules' exibindo erros, alertas ou mensagens de falha na interface de simulação. Não — sem erros → 2.12 · Quando apropriado, definir a fatura como obsoleta usando as marcações previstas. Sim — existem erros → Corrigir erros reportados pela simulação antes de aplicar as regras | `MS` |
| `2.12` | Quando apropriado, definir a fatura como obsoleta usando as marcações previstas. | `ME` |
| `2.12.1` | No detalhe da fatura, selecionar as caixas/opções aplicáveis para marcar o documento como 'Invalid PO/OLA', 'Legacy Data', 'Duplicate Invoice' ou outras opções de obsoleto conforme o diagnóstico; salvar a alteração para que a marcação conste no registro. | `ME` |
| `2.13` | Avaliar se a fatura é um crédito e aplicar o fluxo adequado quando a geração de VBD negativo não é permitida. Unknown — Procedimento detalhado para conversão de crédito em Non-PO via upload manual: Detalhar os passos de upload manual para converter faturas de crédito em Non-PO (ZEWB/Upload Manual) — campos obrigatórios e ações subsequentes. | `MS` |
| `Decisão` | Decisão: O Document Type indica que a fatura é um crédito (necessita VBD negativo)? Tipo de documento identificado no detalhe da fatura (Document Type) classificado como crédito ou necessidade de gerar documento vendor negativo. Não — não é crédito → 2.14 · Quando for necessário obter aprovação ou informações adicionais do scheduler, registrar essa solicitação via comentário na fatura. Sim — é crédito / VBD negativo requerido → Converter a fatura em Non-PO via upload manual, pois negative VBDs não podem ser gerados; executar o procedimento de Upload Manual Non-PO. | `MS` |
| `2.14` | Quando for necessário obter aprovação ou informações adicionais do scheduler, registrar essa solicitação via comentário na fatura. | `MS` |
| `2.14.1` | Abrir 'Open comment' ou a funcionalidade de comentários da fatura, inserir mensagem clara solicitando aprovação ou informação extra do scheduler e salvar para que o scheduler visualize e responda. | `MS` |

### Step 3 — Processamento manual de fatura Non-PO e criação de VBD (Trip e Non‑Trip)

- **step_id:** `step_03`
- **macroetapa:** Execution (`execucao`)
- **source_step_ref:** `3`
- **descrição breve:** Procedimento executável para registrar, codificar, submeter para aprovação e salvar documentação de faturas Non‑PO no sistema. Esta sequência cobre verificação inicial, preenchimento de campos obrigatórios, definição de documento de crédito quando aplicável, definição de bloqueio de pagamento, inserção de GL e Profit Center, atribuições e envio para simulação de regras / fila de aprovação. Termine salvando e anexando documentos de backup quando necessário.
- **classificação consolidada:** `ME + MS`
- **solução tecnológica:** `RPA`
- **por que foi selecionada:** A atividade combina preenchimento repetitivo em VIM com decisões condicionais e dados de apoio; RPA deve ficar limitado aos campos estáveis e manter revisão humana.
- **esforço:** `Alto` — estimativa relativa baseada na quantidade de sistemas, dependências, transações sensíveis, reconciliações e decisões observadas.
- **human_control:** `review_required` — revisão humana permanece necessária para dados, exceções, aprovações e/ou transações financeiras.
- **evidence_status:** `evidenced` para a atividade atual; `needs_validation` para solução, esforço e viabilidade técnica.
- **sub-steps:** 50 registros preservados da SOP.

| Sub-step | Descrição | Classificação individual |
|---|---|---|
| `3.1` | Confirme que a tela de entrada da fatura foi aberta após executar/selecionar o line item e esteja pronta para edição dos campos da fatura. | `ME` |
| `3.1.1` | Execute a ação que carrega o line item no formulário de fatura. Aguarde a tela de entrada ser exibida e verifique que campos principais (Vendor, Company Code, Amount, Invoice Date) estejam visíveis para edição. | `MS` |
| `3.2` | Preencher os campos básicos da fatura conforme a cópia da fatura: número do fornecedor, data da fatura, valor e outros campos apresentados no formulário. Garantir que o Company Code já esteja definido conforme a estratégia da fatura. | `ME` |
| `3.2.1` | No campo Vendor, digite o número do fornecedor exatamente como consta na fatura. | `ME` |
| `3.2.2` | No campo Invoice Date, informe a data indicada na fatura. | `ME` |
| `3.2.3` | No campo Amount, insira o valor total conforme a fatura (moeda indicada na fatura). | `ME` |
| `3.2.4` | Verifique os demais campos disponíveis na tela e atualize conforme a fatura (por exemplo: descrição, referência), mantendo o Company Code conforme estratégia (ver passo de mapeamento de strategy name). | `ME` |
| `3.3` | Abrir a planilha referida e selecionar o Company Code correspondente ao strategy name que aparece na fatura; inserir o Company Code no campo apropriado do formulário. Utilizar planilha de Strategy Valuation para mapeamento de Company Code: Para selecionar o Company Code, consulte a planilha 'Day-5 Strategy Valuation and Profit Center FINAL.xlsx' e insira o Company Code exatamente conforme a linha do strategy name. | `MA` |
| `3.3.1` | Abra a planilha 'Day-5 Strategy Valuation and Profit Center FINAL.xlsx' e localize a linha que corresponde ao strategy name informado na fatura. | `MA` |
| `3.3.2` | Leia o Company Code associado ao strategy name e insira esse código no campo Company Code do formulário da fatura. | `ME` |
| `3.4` | Atualizar o número da fatura e a data conforme o documento; no campo Requester E-mail inserir o e-mail do Requester — por padrão usar o mesmo e‑mail do Processor quando aplicável. Requester E‑mail não aprovado para inclusão: Condição: Requester E-mail não está autorizado no sistema para ser utilizado no campo Requester. Ações: Usar o Processor E-mail no campo Requester quando apropriado; Solicitar aprovação para incluir o Requester E-mail na lista autorizada. Resultado: 3.4 · Atualizar o número da fatura e a data conforme o documento; no campo Requester E-mail inserir o e-mail do Requester — por padrão usar o mesmo e‑mail do Processor quando aplicável. | `MS` |
| `3.4.1` | No campo Invoice Number, insira exatamente o número que consta na fatura física ou eletrônica. | `ME` |
| `3.4.2` | No campo Invoice Date, confirme a data e atualize se necessário com a data indicada na fatura. | `ME` |
| `3.4.3` | No campo Requester E-mail, insira o e-mail do Requester. Se o Requester não tiver permissão para ser colocado aqui, use o Processor E-mail conforme observado na prática padrão. | `ME` |
| `3.5` | Decida se a fatura deve ser registrada como fatura normal ou como nota de crédito. | `ME` |
| `Decisão` | Decisão: A fatura é um crédito (valor negativo / nota de crédito) conforme a cópia do documento? Verificar se a fatura indica explicitamente que se trata de crédito/nota de crédito ou se o valor é negativo. Sim - é crédito → 3.6 · Ao confirmar que é um crédito, altere o tipo de documento para Credit Memo e verifique o estado do campo Payment Block (normalmente creditos assumem bloqueio por padrão). Ajuste conforme política. Não - fatura normal → 3.7 · Para faturas normais, definir o campo Payment Block como 'free for payment' para permitir processamento de pagamento, conforme instrução operacional. | `MS` |
| `3.6` | Ao confirmar que é um crédito, altere o tipo de documento para Credit Memo e verifique o estado do campo Payment Block (normalmente creditos assumem bloqueio por padrão). Ajuste conforme política. | `ME` |
| `3.6.1` | Altere o tipo de documento para 'Credit Memo' no campo apropriado do formulário. | `ME` |
| `3.6.2` | Verifique o campo Payment Block: confirme se está aplicado por padrão para credit memos e ajuste apenas se política permitir. | `ME` |
| `3.7` | Para faturas normais, definir o campo Payment Block como 'free for payment' para permitir processamento de pagamento, conforme instrução operacional. Payment Block deve estar livre para pagamento em faturas normais: Verifique e defina o campo Payment Block como 'free for payment' para faturas que não sejam credit memos. | `ME` |
| `3.7.1` | Localize o campo Payment Block na tela e selecione a opção que libera a fatura para pagamento (free for payment). | `ME` |
| `3.7.2` | Confirme visualmente que o Payment Block está definido como livre para pagamento antes de prosseguir. | `ME` |
| `3.8` | Definir a data base (baseline date) e os termos de pagamento conforme indicados na fatura. | `ME` |
| `3.8.1` | Insira o Baseline Date conforme a fatura no campo correspondente. | `MA` |
| `3.8.2` | Selecione os Payment Terms conforme a fatura (por exemplo, prazo e data de vencimento) e confirme que os valores calculados estão coerentes com o documento. | `ME` |
| `3.9` | Obter o código GL e o Profit Center que serão utilizados para contabilização da fatura; estes dois campos são obrigatórios para non‑PO invoices. | `ME` |
| `3.9.1` | Verifique se existe documentação interna (lista padrão de GLs) associada ao tipo de gasto da fatura. Se disponível, selecione o GL apropriado. | `ME` |
| `3.9.2` | Se não houver referência interna clara, solicite o GL e Profit Center ao responsável indicado (ver passo de contato). | `ME` |
| `3.10` | Contatar James Carlson para obter o GL account e o Profit Center apropriados quando não estiverem definidos internamente. Solicitar GL/Profit Center a James Carlson: Não existir GL account ou Profit Center claro para a fatura · James Carlson · email | `MS` |
| `3.10.1` | Envie e-mail para James Carlson especificando: número da fatura, valor, descrição do gasto e solicitação explícita de GL account e Profit Center. | `MS` |
| `3.10.2` | Aguarde a resposta com os códigos GL e Profit Center; após recebimento, registre-os nos campos correspondentes do formulário. | `MA` |
| `3.11` | Inserir o GL code recebido, definir a coluna como Debit (quando aplicável) e atualizar o campo Text com a descrição e mês/ano da fatura para documentação. | `ME` |
| `3.11.1` | No campo GL Account, insira o GL code aprovado. | `MS` |
| `3.11.2` | Defina a coluna Debit/Credit como 'Debit' e insira o valor correspondente conforme a fatura. | `MA` |
| `3.11.3` | No campo Text, registre a descrição da fatura seguida do mês e ano (ex.: 'Serviços terminaling - Jun 2024'), conforme a documentação da fatura. | `ME` |
| `3.12` | No bloco Assignment, atualizar o vendor number e, se aplicável, definir o Profit Center baseado no fornecedor (ex.: propane -> Mary Maryville Lights; butanes -> heavy). Salvar as alterações no formulário. | `ME` |
| `3.12.1` | No campo Assignment, insira/atualize o vendor number conforme a fatura. | `ME` |
| `3.12.2` | Se o fornecedor corresponder a um dos casos padrão (ex.: propane - Mary Maryville Lights; butanes - heavy), atribua o Profit Center conforme o caso indicado e conforme informação recebida. | `MA` |
| `3.12.3` | Salvar as atualizações efetuadas no formulário (pressionar 'Save' / salvar registro). | `ME` |
| `3.13` | Aplicar a função de simulação de regras para efetuar roteamento de aprovação. Marcar que aprovação é requerida quando aplicável; o processo encaminhará inicialmente para a fila do Requestor e depois para o approver seguinte (ex.: Gina). | `MS` |
| `3.13.1` | Clique em 'Simulate Rules' (ou função equivalente) para calcular o fluxo de aprovação e revisar o destino (Requestor -> próximo approver). | `MS` |
| `3.13.2` | Ative a opção 'Approval required' quando o sistema solicitar, garantindo que a fatura seja roteada conforme regras. | `MS` |
| `3.14` | Acompanhar a chegada da fatura na fila do Requestor; o Requestor deverá aprovar ou recusar. Após aprovação, a fatura seguirá para o próximo aprovador. Confirmar que os documentos de suporte estão anexados para análise do aprovador. | `MS` |
| `3.14.1` | Verifique a fila do Requestor para confirmar que a fatura apareceu e aguarde a ação (aprovar/recusar). | `MS` |
| `3.14.2` | Se o Requestor aprovar, confirme que o registro foi encaminhado ao próximo aprovador conforme a simulação (por exemplo, Gina). Caso rejeitado, registrar motivo e executar correção necessária. | `MS` |
| `3.14.3` | Antes ou durante aprovação, confirme que todos os backups/documentos (PDFs, evidências) estão anexados ao business document. | `MS` |
| `3.15` | Quando aprovações ou documentos de suporte forem recebidos fora do sistema, usar a função 'store business document' para adicionar os arquivos ao registro da fatura. | `MS` |
| `3.15.1` | Acesse a função 'Store Business Document' no registro da fatura. | `ME` |
| `3.15.2` | Anexe o(s) arquivo(s) recebido(s) externamente (ex.: e‑mail de aprovação, PDF de backup) e confirme o upload. | `MS` |
| `3.15.3` | Salvar o registro após anexação para garantir que o documento de suporte fique disponível na fatura. | `ME` |

### Step 4 — Criação manual de VBD (ZEWB) — fluxos Trip e Non‑Trip

- **step_id:** `step_04`
- **macroetapa:** Execution (`execucao`)
- **source_step_ref:** `4`
- **descrição breve:** Procedimento executável para criar VBD manualmente no Custom Trading Expenses Workbench para processos Trip‑related e Non‑Trip related, incluindo tratamento quando o Scheduler não fornece dados (processamento Non‑PO).
- **classificação consolidada:** `ME + MS`
- **solução tecnológica:** `RPA`
- **por que foi selecionada:** A criação de VBD tem campos e sequências estruturadas, mas depende de dados do Scheduler e de variações Trip/Non-Trip.
- **esforço:** `Alto` — estimativa relativa baseada na quantidade de sistemas, dependências, transações sensíveis, reconciliações e decisões observadas.
- **human_control:** `review_required` — revisão humana permanece necessária para dados, exceções, aprovações e/ou transações financeiras.
- **evidence_status:** `evidenced` para a atividade atual; `needs_validation` para solução, esforço e viabilidade técnica.
- **sub-steps:** 16 registros preservados da SOP.

| Sub-step | Descrição | Classificação individual |
|---|---|---|
| `4.1` | Receba o e-mail/solicitação do Scheduler e identifique quais detalhes foram fornecidos: para Non‑Trip (Plant, Material, Strategy) ou para Trip (Nomination Key / Nom key). Registre os valores exatos recebidos antes de abrir o Workbench. | `MS` |
| `4.2` | Determinar se o VBD será Trip‑related, Non‑Trip related ou se faltam dados do Scheduler. | `MS` |
| `Decisão` | Decisão: O Scheduler forneceu uma Nomination Key? Verificar presença explícita de um Nomination Key no corpo do e-mail/solicitação (campo de comentários) ou fornecimento dos três campos Plant, Material e Strategy. Trip related (Nom key presente) → 4.4 · Abra o Custom Trading Expenses Workbench, selecione Trip related e, na aba de Nomination/Comments, insira o Nomination Key fornecido pelo Scheduler; clique em Execute para trazer as linhas associadas. Non‑Trip related (Plant/Material/Strategy fornecidos) → 4.3 · Abra o Custom Trading Expenses Workbench, selecione a opção Non‑Trip Related e carregue Plant, Material e Strategy exatamente como recebidos no e‑mail do Scheduler; em seguida, execute para listar itens. Dados insuficientes (nenhum Nom key nem todos Plant/Material/Strategy) → 4.5 · Se o Scheduler não puder fornecer Nomination Key nem Plant/Material/Strategy, processe a fatura como Non‑PO: codifique a transação usando GL e Cost Centre apropriados (conforme política vigente) e avance o documento para o fluxo de aprovação/lançamento sem VBD Trip/Non‑Trip. | `MS` |
| `4.3` | Abra o Custom Trading Expenses Workbench, selecione a opção Non‑Trip Related e carregue Plant, Material e Strategy exatamente como recebidos no e‑mail do Scheduler; em seguida, execute para listar itens. | `ME` |
| `4.3.1` | Clique em Execute para gerar a listagem com base em Plant, Material e Strategy. Na tela resultante selecione a(s) linha(s) relevantes e clique em Create Expenses. | `ME` |
| `4.3.2` | No formulário de criação de expense selecione Expense Class Group = Z1. Em Expense Class escolha o código que corresponde à natureza do custo (ex.: F28 para terminal/miscellaneous utilities; F00 para inspeção quando aplicável). Expense Class Group obrigatório: Sempre selecionar Expense Class Group = Z1 ao criar expenses manuais para estes processos. | `MA` |
| `4.3.3` | Defina Accounting Type conforme a necessidade de exibir estratégia: para Non‑Trip, quando for necessário mostrar Strategy, selecione tipo B (conta de Expense). Regra para Accounting Type: Quando houver Nomination Key use Accounting Type = A (Inventory account). Quando for necessário exibir Strategy (Non‑Trip) use Accounting Type = B (Expense account). | `ME` |
| `4.3.4` | Atualize os campos: Posting Category = 3 (accrual); Posting Date = data em que está postando; Transaction Date = data da atividade (se disponível) — caso não haja, use a última data do mês da fatura. Em Partner Details informe o Vendor Number. Em seguida, preencha Net Amount (USD ou moeda da fatura), Document, Reference e Text (usar número da fatura no Reference/Text). Posting Category = 3: Posting Category deve ser selecionada como 3 (accrual) para todas as criações manuais descritas. | `ME` |
| `4.3.5` | Clique no ícone Save. Depois de salvar, o Expense DOC list é gravado e um VBD é criado vinculado à fatura. Copie o VBD gerado e anexe‑o à fatura para que fique pronta para processamento posterior. Método de anexação do VBD à fatura não especificado: O procedimento menciona copiar o VBD e anexar à fatura, mas o passo exato (menu/opção) para anexação não está detalhado no documento fonte. | `ME` |
| `4.4` | Abra o Custom Trading Expenses Workbench, selecione Trip related e, na aba de Nomination/Comments, insira o Nomination Key fornecido pelo Scheduler; clique em Execute para trazer as linhas associadas. | `ME` |
| `4.4.1` | Após informar o Nom key e clicar Execute, selecione a linha item correspondente (ex.: line 10) e clique em Create Expense para iniciar a criação do expense. | `MA` |
| `4.4.2` | No formulário de criação de expense para Trip selecione Expense Class Group = Z1. Escolha a Expense Class conforme a descrição do custo (por exemplo, F00 para inspeção quando aplicável). Expense Class Group obrigatório: Sempre selecionar Expense Class Group = Z1 ao criar expenses manuais para estes processos. | `ME` |
| `4.4.3` | Para Trip related selecione Accounting Type = A (conta de Inventory). Configure Posting Category = 3 (accrual). Atualize Posting Date (data de postagem) e Transaction Date (se aplicável). Em Partner Details informe o Vendor Number. Preencha Net Amount (na moeda correta), Document, Reference e Text (usar número da fatura). Posting Category = 3: Posting Category deve ser selecionada como 3 (accrual) para todas as criações manuais descritas. Regra para Accounting Type: Quando houver Nomination Key use Accounting Type = A (Inventory account). Quando for necessário exibir Strategy (Non‑Trip) use Accounting Type = B (Expense account). | `ME` |
| `4.4.4` | Após inserir todos os dados clique no ícone Save. O sistema criará o VBD ligado à fatura. Copie o VBD e anexe‑o à fatura para prosseguir com o processamento. Método de anexação do VBD à fatura não especificado: O procedimento menciona copiar o VBD e anexar à fatura, mas o passo exato (menu/opção) para anexação não está detalhado no documento fonte. | `ME` |
| `4.5` | Se o Scheduler não puder fornecer Nomination Key nem Plant/Material/Strategy, processe a fatura como Non‑PO: codifique a transação usando GL e Cost Centre apropriados (conforme política vigente) e avance o documento para o fluxo de aprovação/lançamento sem VBD Trip/Non‑Trip. Exceção: Scheduler não forneceu dados: Condição: Scheduler não forneceu Nom key nem Plant/Material/Strategy. Ações: Processar a fatura como Non‑PO usando GL e Cost Centre apropriados.; Inserir codificação específica de acordo com política local de Non‑PO. | `MS` |
| `4.6` | Depois que o VBD for criado e anexado à fatura, efetue o upload do Expense DOC list (quando aplicável). Após o upload concluído, execute 'Apply Rules to Post the Invoice' para que as regras de contabilização sejam aplicadas e a fatura seja preparada para postagem. | `ME` |

### Step 5 — Criar solicitação MDG para extensão/correção de material

- **step_id:** `step_05`
- **macroetapa:** Exception (`excecao`)
- **source_step_ref:** `5`
- **descrição breve:** Fluxo executável para registrar uma solicitação no MDG quando for detectado que um plant não está aplicado a um material (extensão/correção). Inclui confirmação de VBD associado ao invoice antes da solicitação.
- **classificação consolidada:** `MS`
- **solução tecnológica:** `Workflow`
- **por que foi selecionada:** A solicitação MDG trata correção ou extensão de material e depende de validação e aprovação de uma área responsável.
- **esforço:** `Alto` — estimativa relativa baseada na quantidade de sistemas, dependências, transações sensíveis, reconciliações e decisões observadas.
- **human_control:** `decision_required` — revisão humana permanece necessária para dados, exceções, aprovações e/ou transações financeiras.
- **evidence_status:** `evidenced` para a atividade atual; `needs_validation` para solução, esforço e viabilidade técnica.
- **sub-steps:** 12 registros preservados da SOP.

| Sub-step | Descrição | Classificação individual |
|---|---|---|
| `5.1` | Abrir o e-mail recebido que solicita a correção/ extensão do material e localizar a mensagem de erro que indica que o plant não está aplicado ao material. Registrar os dados essenciais (número do material, descrição do erro, número do invoice se presente) para uso na solicitação MDG. Registrar dados do e-mail de solicitação: Capturar número do material, texto do erro e número do invoice (se presente) diretamente do e-mail para uso nas etapas subsequentes. | `MS` |
| `5.2` | Se, antes de criar a solicitação MDG, você salvou a Expense DOC list e foi criado um VBD contra a fatura, copie o identificador do VBD e anexe-o ao invoice para garantir que o invoice esteja pronto para processamento. Local/tela para anexar VBD ao invoice: Copiar o identificador do VBD criado e anexá-lo ao invoice. | `MS` |
| `5.3` | No SAP Fiori, localizar e clicar em MDG Launchpad para abrir a aplicação de gerenciamento de master data. Aguardar o carregamento do Launchpad. | `ME` |
| `5.4` | No MDG Launchpad, clicar na opção 'Change Material' para iniciar o fluxo de alteração do material. | `ME` |
| `5.5` | No campo correspondente, digitar o número do material informado pelo e-mail/erro e pressionar Enter. Verificar que os detalhes do material são exibidos na tela antes de prosseguir. | `MA` |
| `5.6` | Verificar, conforme a mensagem de erro ou solicitação recebida, o tipo de extensão que deve ser aplicada ao material. | `MS` |
| `Decisão` | Decisão: O tipo de extensão indicado na mensagem/solicitação é 'US Non-Crude'? Avaliar o texto da mensagem de erro ou da solicitação por e-mail quanto à indicação explícita de 'US Non-Crude'. Sim → 5.7 · Clicar no botão 'Edit' (Editar) na tela do material e, no menu/ações disponíveis, selecionar a opção 'Extend material'. Confirmar a seleção clicando em 'OK'. Observar que um Change Request ID será gerado automaticamente e exibido na tela. Não → Encaminhar para o processo MDG apropriado para outro tipo de alteração (não US Non‑Crude). | `MS` |
| `5.7` | Clicar no botão 'Edit' (Editar) na tela do material e, no menu/ações disponíveis, selecionar a opção 'Extend material'. Confirmar a seleção clicando em 'OK'. Observar que um Change Request ID será gerado automaticamente e exibido na tela. | `ME` |
| `5.8` | Localizar os campos 'Description' e 'Reason' no formulário de alteração. Copiar/registrar a informação do erro conforme recebido no e-mail e colar/entrar nos campos: Description deve refletir a descrição curta do problema; Reason deve indicar a justificativa para a extensão/correção. Preenchimento obrigatório de Description e Reason: Preencher o campo Description com a descrição do problema e o campo Reason com a justificativa, conforme a mensagem de erro. | `ME` |
| `5.9` | Ir até a aba 'Notes' (Notas), clicar em 'New' (Novo) para criar uma nota e inserir os detalhes completos do erro (texto do e-mail, identificadores relevantes, passos que levaram ao erro). Após inserir o texto da nota, clicar em 'OK' para salvar a nota no pedido de mudança. Incluir detalhes completos na aba Notes: Na aba Notes, clicar em New e inserir os detalhes completos do erro e qualquer informação de suporte antes de confirmar com OK. | `ME` |
| `5.10` | Na tela do Change Request, confirmar que todos os campos obrigatórios (Description, Reason) e a nota foram preenchidos. Clicar em 'Submit' (Enviar). Verificar a confirmação de envio exibida pelo sistema (Change Request ID deve estar presente para referência). Registrar o Change Request ID no controle de solicitações. | `MS` |
| `5.11` | Após a submissão, a solicitação é encaminhada à equipe MDG. Registrar que o status atual é 'Solicitação enviada' e aguardar a confirmação por e-mail da equipe MDG informando que a correção/ extensão foi realizada. Prazo de confirmação da equipe MDG: Registrar que a solicitação foi enviada e aguardar a confirmação por e-mail da equipe MDG. | `MS` |

### Step 6 — Criação de Trading Contract (WB21) e Verificação (WB23)

- **step_id:** `step_06`
- **macroetapa:** Execution (`execucao`)
- **source_step_ref:** `6`
- **descrição breve:** Procedimento operacional para criar um Trading Contract usando WB21 (criação) e verificar via WB23 (exibição). Inclui preparação de informações, preenchimento de dados organizacionais, atualização da overview, entrada de itens, gravação do contrato e visualização posterior.
- **classificação consolidada:** `ME + MS`
- **solução tecnológica:** `RPA`
- **por que foi selecionada:** A criação do Trading Contract segue campos estruturados, mas depende de anexos, regras organizacionais e conferência no WB23.
- **esforço:** `Alto` — estimativa relativa baseada na quantidade de sistemas, dependências, transações sensíveis, reconciliações e decisões observadas.
- **human_control:** `review_required` — revisão humana permanece necessária para dados, exceções, aprovações e/ou transações financeiras.
- **evidence_status:** `evidenced` para a atividade atual; `needs_validation` para solução, esforço e viabilidade técnica.
- **sub-steps:** 29 registros preservados da SOP.

| Sub-step | Descrição | Classificação individual |
|---|---|---|
| `6.1` | Receber e validar o e‑mail que serve de base para a criação do Trading Contract e confirmar presença dos anexos necessários. Documento e anexo obrigatórios: E‑mail de solicitação deve conter o anexo Excel com o mapeamento Sales Organization por Company Code e/ou indicação explícita de Division. Sem esse anexo não prosseguir para a criação. | `MS` |
| `6.1.1` | Abrir o e‑mail recebido que solicita criação do Trading Contract e identificar: o número do fornecedor, material solicitado (se aplicável), estratégia/strategy code, datas de validação/pricing date, moeda, item number e qualquer referência a divisão ou organização de vendas. | `MS` |
| `6.1.2` | Confirmar se o e‑mail contém o anexo Excel com o mapeamento Sales Organization por Company Code e quaisquer instruções de classificação de divisão. Se o anexo estiver presente, salvar localmente para consulta durante a entrada de dados. | `MS` |
| `6.2` | Decidir se o anexo Excel com o mapeamento de Sales Organization e classificações de divisão foi recebido e é utilizável. | `MS` |
| `Decisão` | Decisão: O e‑mail contém o anexo Excel com o mapeamento de Sales Organization por Company Code e/ou a indicação da divisão? Anexo Excel está presente no e‑mail e contém colunas claras com Company Code → Sales Organization ou campo explícito 'Division' para o item solicitado. Sim — Excel presente e legível → 6.4 · Acessar o SAP GUI e entrar no t-code WB21 para iniciar a criação do Trading Contract. Não — Excel ausente ou não legível → 6.3 · Quando o Excel ou indicação de divisão/organization não estiver presente ou não estiver legível, solicitar esclarecimentos antes de prosseguir. | `MS` |
| `6.3` | Quando o Excel ou indicação de divisão/organization não estiver presente ou não estiver legível, solicitar esclarecimentos antes de prosseguir. Ação quando Excel ausente: Condição: Anexo Excel ausente ou ilegível no e‑mail de solicitação.. Ações: Responder ao solicitante pedindo o anexo Excel com o mapeamento Sales Organization e/ou indicação de Division.; Aguardar retorno antes de iniciar a criação do Trading Contract.. Resultado: 6.1 · Receber e validar o e‑mail que serve de base para a criação do Trading Contract e confirmar presença dos anexos necessários. | `MS` |
| `6.3.1` | Responder ao e‑mail do solicitante solicitando o anexo Excel com o mapeamento Sales Organization por Company Code e/ou a indicação explícita da Division a ser usada. Informar que não será iniciado o cadastro sem essas informações. | `MS` |
| `6.4` | Acessar o SAP GUI e entrar no t-code WB21 para iniciar a criação do Trading Contract. | `ME` |
| `6.4.1` | No SAP GUI, executar o T‑Code 'WB21'. Aguardar a tela de criação do Trading Contract carregar. | `ME` |
| `6.4.2` | Na tela de criação, no campo 'Contract Type' selecionar 'ZN03' (especificado para despesas non‑trip). | `ME` |
| `6.4.3` | Clicar no ícone retangular branco indicado para acessar os campos de Organizational Data (dados organizacionais) e preparar para preenchimento dos campos obrigatórios. | `ME` |
| `6.5` | Preencher os campos organizacionais necessários conforme o anexo Excel e as regras conhecidas: Sales Organization, Distribution Channel, Division, Purchasing Organization e Purchasing Group. Preenchimento de Organizational Data: Sales Organization deve ser preenchida conforme o anexo Excel; Distribution Channel = DR; Purchasing Organization = 0111; Purchasing Group = H20. Confirmação da Division: A Division (50 ou 52) deverá ser tomada exclusivamente da indicação no e‑mail ou no Excel. Não decidir por suposição. | `MS` |
| `6.5.1` | No campo Sales Organization, inserir o valor identificado no anexo Excel por Company Code. Se o Excel não contiver o mapeamento, não prosseguir e acionar o passo de solicitação de informação. | `MS` |
| `6.5.2` | Definir Distribution Channel como 'DR' (sempre). | `ME` |
| `6.5.3` | Determinar se a Division a ser usada é 50 ou 52 com base nas instruções do solicitante ou do Excel. | `MS` |
| `Decisão` | Decisão: O solicitante/Excel especifica qual Division (50 ou 52) usar para este contrato? Há um valor explícito 'Division' no e‑mail ou no anexo Excel para o item solicitado. Sim — Division especificada no e‑mail/Excel → 6.7 · Preencher os campos na aba Overview e demais abas solicitadas: vendor number, validation period, pricing date, currency; inserir itens e salvar o Trading Contract. Não — Division não especificada → 6.6 · Quando a Division não estiver especificada no e‑mail ou no Excel, solicitar ao solicitante qual Division (50 ou 52) aplicar. | `MS` |
| `6.5.4` | Definir Purchasing Organization = '0111' e Purchasing Group = 'H20'. | `ME` |
| `6.5.5` | Após preencher os dados organizacionais, clicar na pequena caixa ao lado do ícone Enter (conforme indicado) para confirmar os dados e voltar à tela principal de criação. | `ME` |
| `6.6` | Quando a Division não estiver especificada no e‑mail ou no Excel, solicitar ao solicitante qual Division (50 ou 52) aplicar. Ação quando Division não especificada: Condição: Division (50/52) não especificada no e‑mail nem no Excel.. Ações: Responder ao solicitante solicitando indicação explícita da Division (50 ou 52).; Aguardar a resposta antes de prosseguir com o preenchimento e gravação do contrato.. Resultado: 6.5 · Preencher os campos organizacionais necessários conforme o anexo Excel e as regras conhecidas: Sales Organization, Distribution Channel, Division, Purchasing Organization e Purchasing Group. | `MS` |
| `6.6.1` | Responder ao solicitante pedindo que informe explicitamente se a Division deve ser 50 ou 52 para o item/contrato. Aguardar resposta antes de prosseguir. | `MS` |
| `6.7` | Preencher os campos na aba Overview e demais abas solicitadas: vendor number, validation period, pricing date, currency; inserir itens e salvar o Trading Contract. Campos obrigatórios na Overview: Antes de salvar, verificar presença de Vendor Number, Validation Period, Pricing Date, Currency, Item Number e Strategy Code. Ação quando campos obrigatórios ausentes: Condição: Algum campo obrigatório listado em ctl-mandatory-fields estiver vazio ou inconsistente.. Ações: Não salvar o contrato.; Retornar ao solicitante pedindo as informações faltantes e anotar no registro de solicitação.. Resultado: 6.7 · Preencher os campos na aba Overview e demais abas solicitadas: vendor number, validation period, pricing date, currency; inserir itens e salvar o Trading Contract. | `MS` |
| `6.7.1` | Acessar a aba 'Overview' e preencher: Vendor Number (conforme e‑mail), Validation Period, Pricing Date, Currency. Verificar coerência com o pedido. | `ME` |
| `6.7.2` | Na área de itens, inserir Item Number, Material (conforme e‑mail), Valuation, Plant, Purchase Date Category e Purchase Requisition. Após inserir os valores, pressionar Enter para validar o item. | `ME` |
| `6.7.3` | Abrir a seção 'Customer data' e atualizar o campo Strategy Code conforme indicado no e‑mail ou no anexo Excel. | `ME` |
| `6.7.4` | Revisar todos os campos preenchidos; se os campos obrigatórios estiverem completos, clicar em Save para gerar o Trading Contract. Anotar o número do Trading Contract exibido após a gravação. | `ME` |
| `6.8` | Após a criação, usar o T‑Code WB23 para pesquisar e visualizar os detalhes do Trading Contract recém‑criado. | `ME` |
| `6.8.1` | No SAP GUI, executar o T‑Code 'WB23 - Trading Contract: Display'. | `ME` |
| `6.8.2` | Na tela de exibição, digitar o número do Trading Contract gerado (anotado no passo de gravação) e confirmar para visualizar os detalhes completos do contrato. | `ME` |
| `6.8.3` | Verificar que o Profit Centre, Strategy Code, Sales Organization, Distribution Channel (DR), Division, Purchasing Organization (0111) e Purchasing Group (H20) estão corretos conforme solicitação. Registrar qualquer divergência. Verificação final do contrato exibido: Confirmar que Profit Centre, Strategy Code, Sales Organization, Distribution Channel (DR), Division, Purchasing Organization (0111) e Purchasing Group (H20) correspondem ao solicitado. | `MA` |

### Step 7 — Processamento de Faturas Transportation & Terminal — localizar VBDs e associar/acertar valores

- **step_id:** `step_07`
- **macroetapa:** Execution (`execucao`)
- **source_step_ref:** `7`
- **descrição breve:** Executar a sequência completa para localizar, filtrar, extrair documentos VBD (Accrual/Receivable) e associá‑los à fatura de Transportation & Terminal, ajustar valores quando necessário, simular regras e publicar via VIM/ZEWB conforme os dados da fatura.
- **classificação consolidada:** `MS + MA`
- **solução tecnológica:** `IA / Agente`
- **por que foi selecionada:** A localização e reconciliação de VBDs exige comparar dados de fatura e registros; IA pode apoiar o matching, sempre com revisão humana.
- **esforço:** `Alto` — estimativa relativa baseada na quantidade de sistemas, dependências, transações sensíveis, reconciliações e decisões observadas.
- **human_control:** `review_required` — revisão humana permanece necessária para dados, exceções, aprovações e/ou transações financeiras.
- **evidence_status:** `evidenced` para a atividade atual; `needs_validation` para solução, esforço e viabilidade técnica.
- **sub-steps:** 38 registros preservados da SOP.

| Sub-step | Descrição | Classificação individual |
|---|---|---|
| `7.1` | Confirmar os dados principais da fatura no portal/VIM antes de iniciar a associação de VBDs e abrir o ambiente ZEWB para buscar VBDs. Verificação obrigatória dos campos do cabeçalho: Os campos VENDOR NUMBER, VENDOR NAME, BANK ACCOUNT, BANK NUMBER, REFERENCE NUMBER, DOCUMENT DATE e GROSS AMOUNT devem estar presentes e corresponder à fatura recebida antes de iniciar a associação de VBDs. Acesso ao ZEWB (T-code ZEWB): A navegação para Processing Invoice → ZEWB deve ser realizada e a tela de Accrual/Receivable VBD Docs deve estar acessível antes de inserir parâmetros. | `MA` |
| `7.1.1` | No ecrã da fatura (Terminal Invoice) verifique visualmente e confirme que os seguintes campos correspondem ao documento físico/arquivo recebido: VENDOR NUMBER, VENDOR NAME, BANK ACCOUNT, BANK NUMBER, REFERENCE NUMBER, DOCUMENT DATE e GROSS AMOUNT. Se algum campo estiver incorreto, registre a discrepância conforme política local antes de prosseguir. | `MA` |
| `7.1.2` | No sistema, abra uma New GUI Window; selecione Processing Invoice → ZEWB (Custom Trading Expenses Workbench) para iniciar a busca/associação de VBDs. Acesso ao ZEWB (T-code ZEWB): A navegação para Processing Invoice → ZEWB deve ser realizada e a tela de Accrual/Receivable VBD Docs deve estar acessível antes de inserir parâmetros. | `ME` |
| `7.1.3` | Dentro do ZEWB: selecione o tipo de documento Accrual / Receivable VBD Docs; informe o VBD Vendor Number e o Transaction Date; marque 'X' em Document Settled; e clique em Execute para carregar a lista de VBDs disponíveis. | `ME` |
| `7.2` | A partir do resultado Execute no ZEWB, revisar a lista completa (Whole Number of VBD’s Expenses List) e identificar os registros relativos à planta/plan location indicada na fatura. | `ME` |
| `7.2.1` | Percorra a lista retornada pelo Execute e identifique o campo que representa a Plant/Plan Location; localize quais linhas correspondem à planta indicada na fatura. | `MA` |
| `7.3` | Filtrar os resultados por Plant Name e, em seguida, aplicar filtro adicional para localizar a Invoice Name específica extraída da fatura. | `ME` |
| `7.3.1` | No grid de resultados do ZEWB selecione a coluna Plant Name; clique em Set Filter e escolha a planta correspondente à fatura. | `MA` |
| `7.3.2` | No filtro recém-aberto, insira o valor Invoice Name (conforme a fatura) e selecione a(s) linha(s) que correspondem ao nome da invoice para restringir os registros. | `MA` |
| `7.4` | Filtrar os resultados por Cost Type (ex.: Throughout Fee) e executar a extração dos dados filtrados para planilha Excel para cálculos posteriores. | `ME` |
| `7.4.1` | No ZEWB selecione a coluna Cost Type; aplique o filtro e escolha o cost type relevante (por exemplo, 'Throughout Fee'). Clique em Execute para atualizar o grid com o filtro aplicado. | `ME` |
| `7.4.2` | Após a execução do filtro, utilize a opção de exportar/download do ZEWB para extrair os dados em formato Excel (Selecting the Excel Format / Downloading the file). Salve o arquivo localmente para análise. | `ME` |
| `7.5` | No arquivo Excel exportado, aplicar filtros por Cost Type e calcular a quantidade total para cada tipo de fee, dividindo o total por 42 conforme procedimento descrito. | `ME` |
| `7.5.1` | Abra o arquivo Excel, aplique filtro na coluna Cost Type para 'Throughout Fee'; selecione a coluna Quantity e calcule a soma total (total_Throughout). Em seguida, divida total_Throughout por 42 e registre o resultado para uso na associação ao VBD. | `ME` |
| `7.5.2` | No mesmo arquivo Excel, altere o filtro para 'Lubricity Fee'; some a coluna Quantity (total_Lubricity) e divida por 42. Registre o resultado. | `ME` |
| `7.6` | No Excel filtre por 'Dye Fee', totalize a Quantity, divida por 42 e extraia os Document Numbers que correspondem às linhas filtradas para uso na associação aos VBDs. | `MA` |
| `7.6.1` | Aplique filtro em Cost Type = 'Dye Fee', selecione a coluna Quantity e calcule a soma. Divida o total por 42 e registre o valor. | `ME` |
| `7.6.2` | Ainda no arquivo Excel copie os Document Numbers das linhas filtradas (por Throughout/Lubricity/Dye conforme aplicável) para posterior inserção no campo Accrual VBD do ZEWB. | `ME` |
| `7.7` | Totalize a coluna Quantity (se ainda não feito) e consolide a lista de Document Numbers que serão utilizados para puxar os VBDs no ZEWB. | `ME` |
| `7.7.1` | No Excel some a coluna Quantity para obter os totais por cost type; confirme os valores que serão comparados com os Net values trazidos dos VBDs. | `ME` |
| `7.7.2` | Consolide e copie a lista de Document Numbers (um por linha ou separados conforme formato aceito pelo ZEWB) para uso no próximo passo do ZEWB. | `ME` |
| `7.8` | No ZEWB confirmar se Tax Number e Vendor Number foram auto-populados; em seguida abrir o filtro do Accrual VBD e preparar para inserir os números coletados. | `MS` |
| `7.8.1` | Verifique que os campos Tax Number e Vendor Number foram preenchidos automaticamente pelo sistema. Se estiverem vazios, registre e corrija com os valores da fatura antes de prosseguir. | `ME` |
| `7.8.2` | Clique em Filter no campo Accrual VBD para preparar a inserção dos Document Numbers/paste dos VBDs. | `ME` |
| `7.9` | Colar os VBD numbers no campo de Line Item, executar a carga dos VBDs, somar os Net values e, caso não bata com o valor da fatura, realizar Overwrite e ajustar os valores de cost types (Throughout, Lubricant, Dye) até que o check status fique verde. Validação dos VBDs colados no Line Item: Os Document Numbers colados no campo Line Item devem ser exclusivamente Accrual/Receivable VBDs correspondentes à planta e invoice selecionadas; confirme que cada número corresponde a um registro legítimo retornado pelo ZEWB. | `MA` |
| `7.9.1` | No campo Line Item do ZEWB cole a lista de Accrual VBD Document Numbers preparados. Verifique que cada número corresponde a um Accrual/Receivable VBD. Validação dos VBDs colados no Line Item: Os Document Numbers colados no campo Line Item devem ser exclusivamente Accrual/Receivable VBDs correspondentes à planta e invoice selecionadas; confirme que cada número corresponde a um registro legítimo retornado pelo ZEWB. | `MA` |
| `7.9.2` | Clique em Execute para carregar os VBDs nas linhas; aguarde o retorno e verifique os Net values consolidados no resumo. | `MS` |
| `7.9.3` | Some os Net values exibidos para os VBDs carregados e compare com o Gross/Net da fatura. Se os valores coincidirem, prossiga; se não coincidirem, executar Overwrite conforme passo seguinte. | `MA` |
| `7.9.4` | Se os valores não coincidirem: selecione todos os detalhes a serem alterados e clique em Overwrite of VBD’S; altere os valores para os cost types Throughout Fee, Lubricant Fee e Dye Fee conforme necessário para que o total dos VBDs coincida com o valor da fatura. Após cada alteração, confirme a atualização e verifique o Check Status até que fique Green. | `ME` |
| `7.10` | Definir Payment Term manualmente, marcar as Due Dates, revisar Basic Data versus a fatura, acionar Simulate Rules; caso a simulação não apresente erros, postar a transação no portal VIM. Ação ao encontrar erro na Simulação de Regras: Condição: A simulação (Simulate Rules) retorna erro(s) impedindo a postagem.. Ações: Rever campo(s) destacado(s) na aba Basic Data e comparar com os dados da fatura.; Corrigir discrepâncias de valores, contas ou datas diretamente no ZEWB onde permitido.; Retornar para o passo de Overwrite (step-65) se os VBDs ou valores necessitarem de ajuste e reexecutar a carga.. Resultado: 7.9 · Colar os VBD numbers no campo de Line Item, executar a carga dos VBDs, somar os Net values e, caso não bata com o valor da fatura, realizar Overwrite e ajustar os valores de cost types (Throughout, Lubricant, Dye) até que o check status fique verde. | `MA` |
| `7.10.1` | No ZEWB selecione a opção de entrada manual de Payment Term e preencha as Due Dates conforme instruções da fatura/política de pagamento. | `ME` |
| `7.10.2` | Na aba Basic Data compare todos os campos (valores, contas, centro de custo se aplicável) com os dados da fatura. Clique em Simulate Rules e aguarde o resultado da simulação. Ação ao encontrar erro na Simulação de Regras: Condição: A simulação (Simulate Rules) retorna erro(s) impedindo a postagem.. Ações: Rever campo(s) destacado(s) na aba Basic Data e comparar com os dados da fatura.; Corrigir discrepâncias de valores, contas ou datas diretamente no ZEWB onde permitido.; Retornar para o passo de Overwrite (step-65) se os VBDs ou valores necessitarem de ajuste e reexecutar a carga.. Resultado: 7.9 · Colar os VBD numbers no campo de Line Item, executar a carga dos VBDs, somar os Net values e, caso não bata com o valor da fatura, realizar Overwrite e ajustar os valores de cost types (Throughout, Lubricant, Dye) até que o check status fique verde. | `MA` |
| `7.10.3` | Se a simulação indicar que não há erro (status OK), clique para postar a fatura no VIM portal. A postagem finaliza o processamento desta fatura na ferramenta ZEWB/VIM. | `ME` |
| `7.11` | Após a postagem, confirmar que a fatura foi publicada e verificar o line item correspondente no Vendor Portal, acessando o registro via Vendor Account Number. | `MA` |
| `7.11.1` | Verifique no ZEWB/VIM que a operação retornou confirmação de postagem (Posted). Registre o ID de documento gerado, se disponível. | `ME` |
| `7.11.2` | No Vendor Portal abra a conta do fornecedor (inserir Vendor Account Number) e localize o line item recém-postado para confirmar valores, datas e referências. | `ME` |
| `7.12` | Confirmar que todas as invoices do lote/processo foram postadas. Registrar conclusão do processo para o lote atual e encerrar a sessão ZEWB. | `ME` |
| `7.12.1` | Verifique a lista de open invoices no VIM Workplace para confirmar que as faturas tratadas foram movidas para Posted; salve logs ou capturas necessárias e encerre a New GUI Window do ZEWB. | `ME` |

### Step 8 — Processo de Fatura de Pipeline — Tarifa de Pipeline

- **step_id:** `step_08`
- **macroetapa:** Execution (`execucao`)
- **source_step_ref:** `8`
- **descrição breve:** Sequência operacional para validar, localizar VBDs, reconciliar valores e aplicar regras para faturas de Pipeline Tariff usando VIM Workplace e buscas relacionadas.
- **classificação consolidada:** `MS + MA`
- **solução tecnológica:** `IA / Agente`
- **por que foi selecionada:** A reconciliação de tarifa e valores exige análise de correspondência e tolerância; um agente pode priorizar candidatos, não confirmar sozinho a postagem.
- **esforço:** `Alto` — estimativa relativa baseada na quantidade de sistemas, dependências, transações sensíveis, reconciliações e decisões observadas.
- **human_control:** `review_required` — revisão humana permanece necessária para dados, exceções, aprovações e/ou transações financeiras.
- **evidence_status:** `evidenced` para a atividade atual; `needs_validation` para solução, esforço e viabilidade técnica.
- **sub-steps:** 31 registros preservados da SOP.

| Sub-step | Descrição | Classificação individual |
|---|---|---|
| `8.1` | Validar os campos obrigatórios exibidos na ficha da fatura no VIM Workplace antes de avançar. Validação dos campos obrigatórios da fatura: Confirmar presença e correspondência dos campos VENDOR NUMBER, VENDOR NAME, BANK ACCOUNT, BANK NUMBER, REFERENCE NUMBER, DOCUMENT DATE e GROSS AMOUNT antes de qualquer associação de VBD. | `MA` |
| `8.1.1` | Verifique e anote os seguintes campos na fatura: VENDOR NUMBER, VENDOR NAME, BANK ACCOUNT, BANK NUMBER. | `ME` |
| `8.1.2` | Verifique e anote os seguintes campos na fatura: REFERENCE NUMBER, DOCUMENT DATE, GROSS AMOUNT. | `ME` |
| `8.2` | Mudar a visualização para Team View para acessar ações de manipulação de VBD associadas à equipe. | `ME` |
| `8.2.1` | No VIM Workplace, clicar em 'Switch view' e selecionar 'Team view'. Confirmar que a tela apresenta campos e botões referentes ao trabalho em equipe (buscas VBD, Overwrite etc.). | `ME` |
| `8.3` | Navegar até Other Data e iniciar a pesquisa por Accrual VBDs relacionados à fatura. | `ME` |
| `8.3.1` | Na visualização da fatura (Team view), abrir a aba ou seção 'Other data' onde está a opção 'Search Accrual VBD'. | `ME` |
| `8.4` | Inserir Vendor Number na tela de busca de Accrual VBD e executar a pesquisa. | `ME` |
| `8.4.1` | No campo 'Vendor Number' da tela 'Search Accrual VBD', digitar o VENDOR NUMBER exatamente como aparece na fatura. | `ME` |
| `8.4.2` | Clicar em 'Execute' ou 'Search' para iniciar a busca de Accrual VBDs para o fornecedor informado. | `ME` |
| `8.5` | Avaliar se a pesquisa por Accrual VBD retornou registros relacionados. Verificar My Tickets em FIORI quando não houver VBDs: Se a busca por Accrual VBD não retornar resultados, pesquisar em FIORI > My Tickets usando External Number (BOL) e/ou Actual Quantity conforme nota do procedimento. | `MS` |
| `Decisão` | Decisão: A pesquisa em 'Search Accrual VBD' retornou pelo menos um VBD aplicável à fatura? Existência de um ou mais VBDs listados após execução da busca por Vendor Number em 'Search Accrual VBD'. Sim — VBDs listados → 8.7 · Na lista de VBDs retornada escolha o item com a descrição aplicável (por exemplo JET A), comparar o valor do VBD com o valor bruto da fatura e preparar para sobrescrever VBDs se os valores coincidirem. Não — nenhum VBD retornado → 8.6 · Se a busca por Accrual VBD não retornar resultados, pesquisar em FIORI > My Tickets usando critérios alternativos indicados. | `MS` |
| `8.6` | Se a busca por Accrual VBD não retornar resultados, pesquisar em FIORI > My Tickets usando critérios alternativos indicados. Verificar My Tickets em FIORI quando não houver VBDs: Se a busca por Accrual VBD não retornar resultados, pesquisar em FIORI > My Tickets usando External Number (BOL) e/ou Actual Quantity conforme nota do procedimento. | `ME` |
| `8.6.1` | Abrir a aplicação FIORI e selecionar 'My Tickets'. | `ME` |
| `8.6.2` | Na tela 'My Tickets' usar os filtros: pesquisar pelo número BOL no campo 'External Number' e/ou pela quantidade no campo 'Actual Quantity'. | `ME` |
| `8.6.3` | Se a pesquisa em My Tickets retornar registros que correspondem à fatura (BOL/quantidade), anotar os identificadores VBD pertinentes para posterior associação na tela 'Search Accrual VBD'. Em seguida, voltar para a tela de Accrual VBD da fatura e executar a busca novamente usando os dados localizados. | `MA` |
| `8.7` | Na lista de VBDs retornada escolha o item com a descrição aplicável (por exemplo JET A), comparar o valor do VBD com o valor bruto da fatura e preparar para sobrescrever VBDs se os valores coincidirem. | `MA` |
| `8.7.1` | Identificar e selecionar na listagem o VBD cuja descrição corresponda ao produto (ex.: 'JET A'). | `MA` |
| `8.7.2` | Comparar o valor do VBD selecionado com o campo GROSS AMOUNT da fatura. Confirmar se os dois montantes são idênticos. | `MA` |
| `8.7.3` | Se os montantes coincidirem, clicar em 'Overwrite VBD’S' para associar o VBD à fatura conforme a seleção. | `ME` |
| `8.8` | Verificar que, após sobrescrever o(s) VBD(s), o balance entre fatura e VBD é zero e então salvar as alterações. Validação dos campos obrigatórios da fatura: Confirmar presença e correspondência dos campos VENDOR NUMBER, VENDOR NAME, BANK ACCOUNT, BANK NUMBER, REFERENCE NUMBER, DOCUMENT DATE e GROSS AMOUNT antes de qualquer associação de VBD. | `MA` |
| `8.8.1` | Na tela de associação, confirmar que a diferença entre o TOTAL do(s) VBD(s) e o GROSS AMOUNT da fatura é ZERO. | `ME` |
| `8.8.2` | Se o balance for zero, clicar em 'Save' para persistir a associação VBD ↔ fatura. | `ME` |
| `8.9` | Informar na fatura os campos adicionais requeridos antes da simulação de regras: Reference Number, Vendor Number (se necessário repetir) e Payment Terms. | `ME` |
| `8.9.1` | No campo 'Reference Number' da fatura, preencher o valor conforme a documentação/nota fiscal. | `ME` |
| `8.9.2` | Confirmar que o 'Vendor Number' está preenchido corretamente; se estiver vazio ou incorreto, inserir o Vendor Number correto. | `ME` |
| `8.9.3` | Selecionar ou definir os 'Payment Terms' apropriados conforme política ou conforme indicado na fatura. | `ME` |
| `8.10` | Executar 'Simulate rules' e, somente se não houver erros na simulação, aplicar as regras resultantes. Simulação obrigatória antes de aplicar regras: Executar 'Simulate rules' e confirmar que não há erros na simulação antes de clicar em 'Apply rules'. | `ME` |
| `8.10.1` | Na tela da fatura, clicar em 'Simulate rules' para que o sistema verifique e gere as propostas de contabilização/aplicação de regras. | `ME` |
| `8.10.2` | Analisar o painel de resultados da simulação. Confirmar ausência de erros antes de prosseguir para aplicar as regras. | `MA` |
| `8.10.3` | Se a simulação não apresentar erros, clicar em 'Apply rules' para aplicar a contabilização e demais tratamentos automáticos. | `ME` |

### Step 9 — Processo de Débito Gain/Loss (Pipeline Gain/Loss) — Extração NK e criação/associação manual de VBD

- **step_id:** `step_09`
- **macroetapa:** Execution (`execucao`)
- **source_step_ref:** `9`
- **descrição breve:** Sequência executável para validar a fatura Gain/Loss no VIM, extrair Nomination Key (NK) via SAP Fiori, selecionar o NK adequado (maior quantidade atualizada), criar VBD manual no ZEWB e associar/compensar a fatura via campo de Accrual VBD no VIM até saldo zero.
- **classificação consolidada:** `ME + MS`
- **solução tecnológica:** `RPA`
- **por que foi selecionada:** A extração de NK e criação de VBD têm passos repetitivos, mas a seleção e associação dependem de dados do caso.
- **esforço:** `Alto` — estimativa relativa baseada na quantidade de sistemas, dependências, transações sensíveis, reconciliações e decisões observadas.
- **human_control:** `review_required` — revisão humana permanece necessária para dados, exceções, aprovações e/ou transações financeiras.
- **evidence_status:** `evidenced` para a atividade atual; `needs_validation` para solução, esforço e viabilidade técnica.
- **sub-steps:** 19 registros preservados da SOP.

| Sub-step | Descrição | Classificação individual |
|---|---|---|
| `9.1` | 1) Acesse o VIM Workplace e localize a fatura identificada como Gain/Loss pelo campo de descrição. 2) Verifique os campos SAP na fatura: VENDOR NUMBER, VENDOR NAME, BANK ACCOUNT, BANK NUMBER, REFERENCE NUMBER, DOCUMENT DATE e GROSS AMOUNT. 3) Confirme que os valores da fatura batem com os documentos recebidos (anexo ou imagem da fatura). Verificação obrigatória dos campos SAP na fatura: Confirmar VENDOR NUMBER, VENDOR NAME, BANK ACCOUNT, BANK NUMBER, REFERENCE NUMBER, DOCUMENT DATE e GROSS AMOUNT antes de prosseguir com extração de NK e criação de VBD. | `ME` |
| `9.2` | 1) Abra a aplicação SAP Fiori apropriada para Nominations. 2) Navegue até a opção 'My Nomination' (ou equivalente na sua Fiori) conforme o layout padrão. | `ME` |
| `9.3` | 1) Ao carregar 'My Nomination', confirme que a tela abriu com o layout padrão. 2) Prepare-se para aplicar filtros por sistema de transporte e período de scheduled date (próximo passo). | `ME` |
| `9.4` | 1) No painel de filtros, selecione o campo de Transport System e insira o(s) transport system(s) relevantes para a fatura Gain/Loss. 2) Insira a Scheduled Date correspondente ao período da fatura (Invoice period). 3) Clique no botão 'GO' para executar a procura e carregar as linhas de nomination relacionadas ao período e transport system informados. | `MA` |
| `9.5` | 1) Abra a opção de Table Personalization na lista de nominations retornada. 2) Selecione as colunas necessárias para análise: Nomination Key, Ticket Status, Actual Quantity, Schedule Type e quaisquer outras colunas de interesse. 3) Confirme (OK) e exporte o resultado para arquivo Excel usando a função de exportação da Fiori. | `ME` |
| `9.6` | 1) No Excel exportado (ou na própria Fiori, se preferir), aplique filtro na coluna Ticket Status para manter apenas linhas com status 'actualized'. | `ME` |
| `9.7` | 1) Aplique filtro na coluna Schedule Type para manter apenas os tipos que iniciam com 'D' (indicados como 'D*' no procedimento). | `ME` |
| `9.8` | 1) Na coluna Actual Quantity, ordene os valores do maior para o menor. 2) Identifique a Nomination Key correspondente à maior Actual Quantity filtrada — este NK será utilizado para alocar o valor da fatura. | `MA` |
| `9.9` | 1) Copie ou anote a Nomination Key escolhida (maior Actual Quantity). 2) Abra o SAP T-code ZEWB — Custom Trading Expense Workbench para iniciar a criação manual do VBD (debito). | `ME` |
| `9.10` | 1) No ZEWB, no formulário de criação, insira a Nomination Key no campo correspondente e adicione os items da nomination conforme necessário (nomination key items). 2) Selecione a linha apropriada que representa o item a ser debitado e clique em 'Create Expense' para iniciar a criação do lançamento de despesa/VBD. | `MA` |
| `9.11` | 1) No formulário de Expense, preencha os campos conforme abaixo: - Expense Class: F25 (Pipeline Gain/Loss) - Account: A (Inventory Account) - Accrual/Type: 3 (Accrual) - Vendor Code: informe o código do fornecedor conforme fatura - Posting Date: data corrente (hoje) - Net Amount: valor líquido tomado da fatura - Reference: referência conforme consta na fatura | `ME` |
| `9.12` | 1) Após preencher todos os campos, selecione 'Save' para gerar o documento VBD. 2) Copie o número do documento VBD gerado (document number) para uso posterior na associação no VIM. | `ME` |
| `9.13` | 1) No VIM Workplace, abra a seção 'Other Data' e utilize a função 'Search accrual VBD'. 2) Cole o número do documento VBD copiado no campo de busca e execute a pesquisa para identificar a VBD criada e suas linhas associadas. | `ME` |
| `9.14` | 1) No painel de resultados da busca Accrual VBD, verifique as linhas exibidas. 2) Selecione a Accrual VBD encontrada e insira o número no campo 'Accrual VBD number' e clique em 'Execute' para carregar os items que podem ser associados à fatura. | `ME` |
| `9.15` | Definir se as linhas da VBD devem ser acrescentadas ou substituídas antes de exibir e salvar a associação. | `ME` |
| `Decisão` | Decisão: Devo usar 'Append' ou 'Overwrite' para as linhas da VBD? Escolha conforme a VBD selecionada e a necessidade de manter linhas existentes versus substituí‑las Append → 9.16 · 1) Clique em 'Append' para acrescentar as linhas da VBD ao conjunto atual apresentado na tela. 2) Revise os line items exibidos após o Append: verifique quantias, contas e taxa de câmbio (se aplicável) para assegurar que os valores a acrescentar correspondem ao valor da fatura. 3) Confirme a seleção local das linhas que serão efetivamente aplicadas contra a fatura. 4) Após revisão, proceda para salvar (próximo passo comum). Overwrite → 9.17 · 1) Clique em 'Overwrite' para substituir as linhas atualmente apresentadas na tela pelas linhas da VBD selecionada. 2) Revise cuidadosamente as linhas que irão substituir as existentes: confirme contas de compensação, quantias e qualquer diferença que altere o lançamento contábil. 3) Se a substituição for adequada, confirme a intenção de sobrescrever; caso contrário, cancele e retorne à decisão anterior. 4) Após revisão e confirmação, proceda para salvar (próximo passo comum). | `MS` |
| `9.16` | 1) Clique em 'Append' para acrescentar as linhas da VBD ao conjunto atual apresentado na tela. 2) Revise os line items exibidos após o Append: verifique quantias, contas e taxa de câmbio (se aplicável) para assegurar que os valores a acrescentar correspondem ao valor da fatura. 3) Confirme a seleção local das linhas que serão efetivamente aplicadas contra a fatura. 4) Após revisão, proceda para salvar (próximo passo comum). | `MA` |
| `9.17` | 1) Clique em 'Overwrite' para substituir as linhas atualmente apresentadas na tela pelas linhas da VBD selecionada. 2) Revise cuidadosamente as linhas que irão substituir as existentes: confirme contas de compensação, quantias e qualquer diferença que altere o lançamento contábil. 3) Se a substituição for adequada, confirme a intenção de sobrescrever; caso contrário, cancele e retorne à decisão anterior. 4) Após revisão e confirmação, proceda para salvar (próximo passo comum). | `ME` |
| `9.18` | 1) Clique em 'Save' para persistir a associação entre a fatura e a VBD (após Append ou Overwrite). 2) Aguarde a confirmação do sistema e verifique a mensagem de sucesso. 3) Confirme que o saldo da fatura ficou zero (balance is zero). 4) Registre o número do VBD associado e quaisquer identificadores de documento de contabilização para rastreio e auditoria. | `MS` |

### Step 10 — Processar faturas Pipeline Y‑Grade e encargos de transporte: identificação, casamento e criação manual de VBD

- **step_id:** `step_10`
- **macroetapa:** Execution (`execucao`)
- **source_step_ref:** `10`
- **descrição breve:** Sequência executável para identificar a fatura Pipeline Y‑Grade ou de transporte no VIM, localizar/obter Nomination Key (NK) via Fiori, reconciliar VBDs com a fatura, criar VBD manual (ZEWB) quando necessário e finalizar o casamento e verificação das regras antes da postagem.
- **classificação consolidada:** `MS + MA`
- **solução tecnológica:** `IA / Agente`
- **por que foi selecionada:** O casamento de invoices, encargos e VBDs envolve múltiplas fontes e critérios de correspondência; requer validação humana.
- **esforço:** `Alto` — estimativa relativa baseada na quantidade de sistemas, dependências, transações sensíveis, reconciliações e decisões observadas.
- **human_control:** `review_required` — revisão humana permanece necessária para dados, exceções, aprovações e/ou transações financeiras.
- **evidence_status:** `evidenced` para a atividade atual; `needs_validation` para solução, esforço e viabilidade técnica.
- **sub-steps:** 22 registros preservados da SOP.

| Sub-step | Descrição | Classificação individual |
|---|---|---|
| `10.1` | No VIM Workplace, acione o botão "Simulate rules" para avaliar o estado do processamento antes de aplicar regras/postagem. Exceção — Simulate rules (pré-aplicação) sinaliza erro: Condição: Ao acionar 'Simulate rules' qualquer Exception reason apresentar indicação vermelha.. Ações: Limpar a exceção utilizando os procedimentos de clearing de exceções do VIM conforme políticas internas (VIM exception clearing ways).; Corrigir os dados apontados pela exceção (por exemplo, dados do VBD ou campos obrigatórios da fatura) e reaplicar as ações anteriores necessárias.; Após limpeza da exceção, acionar novamente 'Simulate rules' para verificação antes de aplicar regras.. Resultado: 10.1 · No VIM Workplace, acione o botão "Simulate rules" para avaliar o estado do processamento antes de aplicar regras/postagem. | `MS` |
| `10.2` | Com a fatura aberta no VIM Workplace, confirme os campos SAP essenciais para processamento e casamento com VBD: Controle — validação obrigatória de campos SAP na fatura: Antes de qualquer tentativa de casar VBDs, confirme que os campos VENDOR NUMBER, VENDOR NAME, BANK ACCOUNT, BANK NUMBER, REFERENCE NUMBER, DOCUMENT DATE e GROSS AMOUNT estejam preenchidos e correspondam à documentação da fatura. | `MA` |
| `10.2.1` | Verifique explicitamente: VENDOR NUMBER, VENDOR NAME, BANK ACCOUNT, BANK NUMBER, REFERENCE NUMBER, DOCUMENT DATE e GROSS AMOUNT. Registre discrepâncias antes de avançar. | `ME` |
| `10.3` | Abrir o aplicativo Fiori adequado e utilizar a função My Nominations (ou equivalente) para localizar o Nomination Key necessário para criação manual de VBD. | `ME` |
| `10.3.1` | No Fiori, pesquisar pelas Nomeações (My Nominations) aplicando filtros conforme disponível para localizar NK que corresponde à fatura. | `MA` |
| `10.4` | No Fiori aplique o filtro do transport system (ex.: Phillips 66) e informe a data programada (scheduled date) do mês correspondente ao período da fatura; executar a pesquisa e, no resultado, selecionar a nomination localizada por Location e escolher o line item apropri (ex.: line item 10) para iniciar o processo de criação do VBD manual. | `MA` |
| `10.5` | Quando a fatura exigir o mesmo procedimento de criação de VBD utilizado no processo Gain/Loss, executar os mesmos passos operacionais (referência interna: passos 13 a 20 do processo Gain/Loss). | `ME` |
| `10.6` | Para faturas classificadas como Transportation (conforme descrição da fatura), abrir a fatura no VIM Workplace e revalidar os dados SAP chave (VENDOR NUMBER, VENDOR NAME, BANK ACCOUNT, BANK NUMBER, REFERENCE NUMBER, DOCUMENT DATE, GROSS AMOUNT) antes da busca por VBDs. Controle — validação obrigatória de campos SAP na fatura: Antes de qualquer tentativa de casar VBDs, confirme que os campos VENDOR NUMBER, VENDOR NAME, BANK ACCOUNT, BANK NUMBER, REFERENCE NUMBER, DOCUMENT DATE e GROSS AMOUNT estejam preenchidos e correspondam à documentação da fatura. | `MA` |
| `10.7` | No VIM, acionar Other data → Search accrual VBD. Informar o período/lift date conforme indicado na fatura (o campo "period date" na fatura corresponde ao lift date) e executar a pesquisa para listar VBDs reportados para esse período. | `MA` |
| `10.8` | Com a listagem de VBD aberta, exportar os detalhes (por exemplo, para Excel) para confrontar com os dados da fatura e identificar tickets ou números não casados. Controle — exportar detalhes de VBD para reconciliação: Exportar os detalhes do VBD (incluindo ticket numbers, quantities e location) para uma planilha para confronto com a planilha de tickets da fatura. Preservar os registros exportados para auditoria. | `MA` |
| `10.9` | Quando forem encontrados tickets não casados, abrir o Fiori e usar My Nominations para localizar informações da nomination associada aos tickets não casados para obter NK e demais detalhes necessários para criação do VBD manual. | `ME` |
| `10.10` | Filtrar no Fiori por transport system correspondente e por scheduled date no mês da fatura; executar (Go) e exportar o relatório de nominations para planilha a fim de alinhá-la com a planilha de tickets não casados. | `MA` |
| `10.11` | Alinhar a planilha exportada do Fiori com a planilha de tickets não casados, confrontando Actual Quantity, Location Description e Nomination Number. Se ainda houver tickets sem NK, gerar Dew Ticket em Trade 66 para solicitar ao D2D COE os detalhes dos VBDs não-fired. | `MS` |
| `Decisão` | Decisão: D2D COE aprovou / retornou os detalhes do VBD (unfired VBD) solicitados no Dew Ticket? Presença de aprovação/retorno explícito do D2D COE com os detalhes necessários para criar o VBD Aprovado — D2D COE retornou detalhes → 10.12 · Acessar a transação ZEWB (Custom Trading Expense Workbench) para criar o VBD manualmente. Informar o Nomination Key (NK) e os itens de nomination correspondentes antes de criar a despesa. Não aprovado — sem retorno/sem detalhes suficientes → invoice_on_hold_waiting_D2D_COE | `MS` |
| `10.12` | Acessar a transação ZEWB (Custom Trading Expense Workbench) para criar o VBD manualmente. Informar o Nomination Key (NK) e os itens de nomination correspondentes antes de criar a despesa. | `MA` |
| `10.12.1` | No ZEWB, inserir o Nomination Key identificado e incluir os nomination items que representam os tickets a serem cobrados. | `ME` |
| `10.13` | Selecionar o item de nomination identificado e clicar em Create expense. Preencher os campos conforme padrão para Pipeline Tariff/Transportation: | `ME` |
| `10.13.1` | Preencher: Expense class = F18 (pipeline tariff), Inventory Account = A, Accrual indicator = 3, Vendor code conforme fatura, Posting date = data atual, Net amount = valor líquido conforme VIM Workplace, Reference = número de referência da fatura. | `ME` |
| `10.14` | Salvar a criação do VBD no ZEWB e copiar o número do documento gerado para uso no casamento da fatura no VIM. | `ME` |
| `10.15` | Retornar ao VIM Workplace → Other data → Search accrual VBD, informar o document number copiado do ZEWB, executar e usar o resultado para casar/associar os line items da fatura. | `ME` |
| `10.15.1` | No campo accrual VBD informar o número do documento criado no ZEWB e executar para que o VBD seja exibido para associação com a fatura. | `ME` |
| `10.16` | No VIM, clicar Append/Append VBD para exibir os line items do VBD, salvar a associação; confirmar que o saldo da fatura ficou zero. Em seguida, acionar novamente o botão "Simulate rules" e verificar que todas as exceções estejam em estado verde antes de aplicar regras e prosseguir para postagem. Exceção — Simulate rules após criação/append do VBD: Condição: Após anexar o VBD e salvar, o 'Simulate rules' retornar indicação vermelha em qualquer exceção.. Ações: Executar os procedimentos de clearing de exceções do VIM conforme as práticas documentadas.; Se a exceção estiver relacionada a dados do VBD recém-criado, validar no ZEWB e corrigir os campos (recriar/ajustar VBD se necessário) antes de nova simulação.; Re-simular as regras quando correções realizadas.. Resultado: 10.16 · No VIM, clicar Append/Append VBD para exibir os line items do VBD, salvar a associação; confirmar que o saldo da fatura ficou zero. Em seguida, acionar novamente o botão "Simulate rules" e verificar que todas as exceções estejam em estado verde antes de aplicar regras e prosseguir para postagem. | `ME` |

### Step 11 — Processamento de Faturas de Inspeção — fluxo Auto‑fired VBD

- **step_id:** `step_11`
- **macroetapa:** Execution (`execucao`)
- **source_step_ref:** `11`
- **descrição breve:** Sequência executável para localizar, validar e processar faturas de inspeção que disparam VBD automaticamente (Auto‑fired VBD) no VIM Workplace (S/4). Inclui verificação de tolerância, sobrescrita/appêndice de VBD, cálculos de linha, simulação de regras e postagem.
- **classificação consolidada:** `SA + MS`
- **solução tecnológica:** `Evaluator / Controle`
- **por que foi selecionada:** O fluxo parte de VBD auto-fired, mas exige validação de dados e tratamento de divergências antes da postagem.
- **esforço:** `Médio` — estimativa relativa baseada na quantidade de sistemas, dependências, transações sensíveis, reconciliações e decisões observadas.
- **human_control:** `review_required` — revisão humana permanece necessária para dados, exceções, aprovações e/ou transações financeiras.
- **evidence_status:** `evidenced` para a atividade atual; `needs_validation` para solução, esforço e viabilidade técnica.
- **sub-steps:** 34 registros preservados da SOP.

| Sub-step | Descrição | Classificação individual |
|---|---|---|
| `11.1` | Acessar o sistema SAP e selecionar o ambiente de produção indicado. | `ME` |
| `11.1.1` | No portal SAP, selecione S/4 Production conforme a entrada AE66 S4 Prod (PS1). | `ME` |
| `11.2` | Entrar no VIM Workplace para processamento de faturas. | `ME` |
| `11.2.1` | No SAP, abra o VIM workspace, clique em 'Processing Invoice' e execute o T-Code /OPT/VIM_WR_VIM Workplace. | `ME` |
| `11.3` | Ao abrir o VIM, alternar a vista para localizar itens da equipe e faturas de inspeção. | `ME` |
| `11.3.1` | Verifique que a tela com a listagem de diversos invoices foi exibida. | `ME` |
| `11.3.2` | Clicar em 'Switch work view' e selecionar a opção 'Team view' para visualizar itens do time além dos seus diretos. | `ME` |
| `11.4` | Aplicar filtros para isolar faturas de inspeção e abrir a fatura específica para processamento. | `ME` |
| `11.4.1` | Usar o filtro disponível na Team View para separar as faturas do tipo inspeção. | `ME` |
| `11.4.2` | Selecionar a invoice filtrada (ex.: CAMIN CARGO CONTROL, INC) e clicar em 'Execute' para abrir os detalhes. | `ME` |
| `11.5` | Confirmar correspondência dos principais campos exibidos com os valores da fatura física/arquivo. | `MA` |
| `11.5.1` | Indexar e conferir Vendor Number, Vendor Name, Bank Account, Bank Number, Reference Number, Document Date e Gross Amount com os valores na fatura. | `ME` |
| `11.5.2` | Identificar a Nomination Key presente na invoice a ser usada para localizar VBD. | `ME` |
| `11.5.3` | Navegar para a aba 'Other Data' e clicar na aba 'Search VBD' para pesquisar VBDs relacionados à Nomination Key. | `ME` |
| `11.6` | Executar a pesquisa do VBD a partir da Nomination Key informada na fatura. | `ME` |
| `11.6.1` | Confirmar que Tax Number e Vendor Number podem ter preenchimento automático; inserir a Nomination Key e clicar em 'Execute (F8)'. | `ME` |
| `11.6.2` | Ao executar, observar os VBDs de accrual exibidos para validação posterior. | `ME` |
| `11.7` | Confirmar que o VBD exibido corresponde à fatura (conta do fornecedor, datas, local, status de settle e produto) e avaliar se atende ao limite de tolerância para uso do VBD. Regra de tolerância para uso de VBD: Validar que a diferença entre os valores da invoice e o VBD esteja dentro da tolerância de +/- $5000 antes de aplicar o VBD. Escalar para Scheduler quando excede tolerância: Diferença entre invoice e VBD excede a tolerância de +/- $5000. · Scheduler responsável indicado na invoice (para faturas crude usar o scheduler fixo: Emmanuella) | `MA` |
| `Decisão` | Decisão: O VBD retornado corresponde à invoice e a diferença está dentro do limite de tolerância? Verificar vendor account, transaction date, location details, settle status, product details e diferença de valor dentro de +/- $5000. Dentro da tolerância → 11.8 · Quando o VBD for válido e dentro da tolerância, atribuir o VBD à fatura. Excede a tolerância → await_scheduler_resolution | `MS` |
| `11.8` | Quando o VBD for válido e dentro da tolerância, atribuir o VBD à fatura. | `MA` |
| `11.8.1` | Marcar o VBD retornado na lista para associá‑lo à invoice. | `ME` |
| `11.8.2` | Clicar em 'Overwrite VBD' para usar o VBD selecionado. Se for necessário somar VBDs, utilizar 'Append VBDs' para adicionar. | `ME` |
| `11.9` | Modificar valores na aba 'Line Items' conforme necessário, recalcular e salvar para que o saldo passe a zero e o status fique verde. | `ME` |
| `11.9.1` | Na aba 'Line Items', alterar o Invoice Amount conforme a necessidade do casamento com o VBD. | `ME` |
| `11.9.2` | Executar 'Recalculate' para aplicar ajustes e então 'Save'. Verificar que o saldo fica zero e o status aparece em verde. | `ME` |
| `11.10` | Configurar a data base (baseline date) e as condições de pagamento (payment term) antes de simular regras. | `ME` |
| `11.10.1` | Abrir a aba 'Accounting', inserir/ajustar o baseline date e o payment term conforme a invoice. | `ME` |
| `11.11` | Simular as regras para verificar se há erros antes de aplicar as regras e postar a invoice. Tratamento de erro de simulação: Condição: Simulate Rules retorna status vermelho (erros detectados).. Ações: Identificar mensagens de erro apresentadas pela simulação.; Corrigir os dados afetados (p.ex. ajustes em Line Items, VBD selecionado, datas, valores).; Reexecutar 'Simulate Rules' após aplicar as correções.. Resultado: 11.11 · Simular as regras para verificar se há erros antes de aplicar as regras e postar a invoice. | `MS` |
| `Decisão` | Decisão: A simulação de regras retornou sem erros (status verde)? Executar 'Simulate Rules' e observar o indicador de status (verde = sem erros, vermelho = erro(s) a corrigir). Status verde → 11.12 · Clicar em 'Apply Rules' para que a fatura seja postada no sistema após simulação bem‑sucedida. Status vermelho → 11.13 · Quando a simulação indicar erros, revisar os detalhes, corrigir e repetir a simulação. | `MS` |
| `11.12` | Clicar em 'Apply Rules' para que a fatura seja postada no sistema após simulação bem‑sucedida. | `ME` |
| `11.12.1` | Executar a ação 'Apply Rules' e confirmar que a invoice foi postada (status indicativo do sistema). | `ME` |
| `11.13` | Quando a simulação indicar erros, revisar os detalhes, corrigir e repetir a simulação. Tratamento de erro de simulação: Condição: Simulate Rules retorna status vermelho (erros detectados).. Ações: Identificar mensagens de erro apresentadas pela simulação.; Corrigir os dados afetados (p.ex. ajustes em Line Items, VBD selecionado, datas, valores).; Reexecutar 'Simulate Rules' após aplicar as correções.. Resultado: 11.11 · Simular as regras para verificar se há erros antes de aplicar as regras e postar a invoice. | `MS` |
| `11.13.1` | Identificar as mensagens de erro apresentadas pela simulação e corrigir os dados relacionados (p.ex. valores, VBD, datas). Tratamento de erro de simulação: Condição: Simulate Rules retorna status vermelho (erros detectados).. Ações: Identificar mensagens de erro apresentadas pela simulação.; Corrigir os dados afetados (p.ex. ajustes em Line Items, VBD selecionado, datas, valores).; Reexecutar 'Simulate Rules' após aplicar as correções.. Resultado: 11.11 · Simular as regras para verificar se há erros antes de aplicar as regras e postar a invoice. | `MS` |
| `11.13.2` | Após aplicar correções, retornar ao passo de simulação (d106_simulate_rules) e executar novamente. Tratamento de erro de simulação: Condição: Simulate Rules retorna status vermelho (erros detectados).. Ações: Identificar mensagens de erro apresentadas pela simulação.; Corrigir os dados afetados (p.ex. ajustes em Line Items, VBD selecionado, datas, valores).; Reexecutar 'Simulate Rules' após aplicar as correções.. Resultado: 11.11 · Simular as regras para verificar se há erros antes de aplicar as regras e postar a invoice. | `MS` |

### Step 12 — Processamento de Faturas de Inspeção — Criação Manual de VBD (Trip e Non-Trip)

- **step_id:** `step_12`
- **macroetapa:** Execution (`execucao`)
- **source_step_ref:** `12`
- **descrição breve:** Sequência operacional para criar manualmente um VBD (ZEWB) para faturas de inspeção quando não há auto-fire VBD. Inclui navegação inicial, exibição de nomination, validação contra a cópia da fatura, criação de VBD em modo Trip ou Non‑Trip, retorno ao VIM Workplace para associar o VBD ao invoice e simulação/aplicação de regras para postagem.
- **classificação consolidada:** `ME + MS`
- **solução tecnológica:** `RPA`
- **por que foi selecionada:** A criação manual tem campos estruturados, porém alterna Trip/Non-Trip e depende de dados externos e aprovação.
- **esforço:** `Alto` — estimativa relativa baseada na quantidade de sistemas, dependências, transações sensíveis, reconciliações e decisões observadas.
- **human_control:** `review_required` — revisão humana permanece necessária para dados, exceções, aprovações e/ou transações financeiras.
- **evidence_status:** `evidenced` para a atividade atual; `needs_validation` para solução, esforço e viabilidade técnica.
- **sub-steps:** 18 registros preservados da SOP.

| Sub-step | Descrição | Classificação individual |
|---|---|---|
| `12.1` | No VIM Workplace, clique no botão Enter para carregar a tela atual. Na tela resultante, selecione a aba 'Other data' e clique na opção 'New Page' para abrir a página usada para consulta de nomination. | `ME` |
| `12.2` | Na nova página aberta, execute a transação O4NSN (Display Nomination). Aguarde a exibição da tela de consulta de nomination. | `MS` |
| `12.3` | Digite a Nomination Key conforme consta na cópia da fatura no campo vazio e pressione Enter. Quando a barra de referência 'transport system' for exibida, dê duplo clique nessa barra e selecione a opção 'Secondary Costing Pig View' na visualização de nomination. | `ME` |
| `12.4` | Compare os dados exibidos na tela de Display Nomination com os valores da cópia da fatura para identificar o line item válido a ser usado na criação do VBD. Validação de janela de data do Schedule Date: Confirmar que o 'Schedule Date' do line item está dentro de ±15 dias do 'Job Finish Date' informado na cópia da fatura antes de prosseguir com a criação do VBD. | `MA` |
| `Decisão` | Decisão: Os campos Product, Location e Schedule Date do line item selecionado correspondem à cópia da fatura? Product e Location idênticos; Schedule Date dentro de ±15 dias do 'Job Finish Date' informado na cópia da fatura. Corresponde → 12.5 · Abra uma nova janela SAP e execute a transação ZEWB (Custom Trading Expense Workbench) para iniciar a criação manual do VBD. Não corresponde / data fora da janela ±15 dias → routed_to_scheduler_for_approval | `MS` |
| `12.5` | Abra uma nova janela SAP e execute a transação ZEWB (Custom Trading Expense Workbench) para iniciar a criação manual do VBD. | `ME` |
| `12.6` | Escolha o modo correto de criação de VBD conforme o tipo de codificação fornecida. | `ME` |
| `Decisão` | Decisão: A codificação fornecida indica que o VBD é Trip-related (Nomination Key) ou Non-Trip-related (Plant, Material, Strategy)? Se a codificação relevante for uma Nomination Key use Trip-related; se for Plant+Material+Strategy use Non-Trip-related. Trip-related (Nomination Key presente) → 12.7 · No ZEWB selecione a opção 'Trip related', insira a Nomination Key e clique no ícone Execute. Aguarde o resultado com os line items disponíveis. Non-Trip-related (Plant/Material/Strategy fornecidos) → 12.15 · Se o scheduler forneceu Plant, Material e Strategy, no ZEWB selecione a opção 'Non-Trip related'. Insira Plant, Material e Strategy conforme informado pelo scheduler. Preencha os campos obrigatórios do VBD conforme procedimento (Expanse Class group = 'Z1'; Expanse Class conforme tipo; Accounting Type = 'B' para Non-Trip; Posting Category = '3'; Posting Date, Partner, Net amount, Reference, Document Date). Pressione Enter, verifique e clique em Save. Após salvar, copie o número do VBD gerado e retorne ao VIM Workplace para seguir os passos de pesquisa e associação do VBD (retornar ao passo 'step-115'). | `MS` |
| `12.7` | No ZEWB selecione a opção 'Trip related', insira a Nomination Key e clique no ícone Execute. Aguarde o resultado com os line items disponíveis. | `MS` |
| `12.8` | Após a execução, identifique o line item que bate perfeitamente com a cópia da fatura (Product, Location, Schedule Date). Selecione essa linha e clique em 'Create Expense' para iniciar a entrada dos dados do VBD. Validação de janela de data do Schedule Date: Confirmar que o 'Schedule Date' do line item está dentro de ±15 dias do 'Job Finish Date' informado na cópia da fatura antes de prosseguir com a criação do VBD. | `ME` |
| `12.9` | Preencha os campos obrigatórios do VBD com os valores da cópia da fatura e do line item selecionado. Campos obrigatórios a inserir: 1) Expanse Class group = 'Z1'; 2) Expanse Class = conforme tipo de taxa da fatura; 3) Accounting Type = 'A' (para Trip-related); 4) Posting Category = '3'; 5) Posting Date = data atual; 6) Partner = número do fornecedor; 7) Net amount = valor líquido da fatura; 8) Reference = número da fatura; 9) Document Date = data da fatura. Após preencher, pressione Enter, verifique os valores exibidos e clique em Save. | `ME` |
| `12.10` | Ao salvar, será gerado o documento VBD. Copie o número do documento VBD exibido na tela para uso no VIM Workplace. | `ME` |
| `12.11` | Retorne à janela do VIM Workplace. Na aba 'Other data' acesse a aba 'Search VBD'. Verifique se Tax Number e Vendor Number foram preenchidos automaticamente. Cole o número do documento VBD no campo 'Accrual VBD number' e clique em Execute (F8). | `ME` |
| `12.12` | Na tela de resultados selecione o accrual VBD apropriado. Clique em 'Overwrite VBD' para substituir ou em 'Append VBDs' para adicionar. Em seguida, vá para a aba 'Line Items' e preencha o campo 'Lift date' com a data 'Job Finished' indicada na fatura. Depois acesse a aba 'Accounting' e atualize o 'Baseline Date' e os detalhes de 'Payment Term' relacionados à fatura. Salve as alterações e clique em 'Simulate Rules'. | `ME` |
| `12.13` | Após executar 'Simulate Rules', verifique a tela de status para identificar erros. A simulação indica sucesso quando o status aparece em verde. Ação em caso de Simulate Rules com erros (status vermelho): Condição: Simulate Rules retorna status vermelho indicando erro(s).. Ações: Revisar os campos preenchidos nas abas Line Items e Accounting (baseline date, payment term, valores e referências).; Corrigir os campos identificados e salvar novamente o VBD no ZEWB, se necessário.; Retornar ao passo de execução 'Simulate Rules' após correções.. Escalonamento: Erro persiste após tentativas de correção e nova simulação. · Supervisor de AP. Resultado: 12.12 · Na tela de resultados selecione o accrual VBD apropriado. Clique em 'Overwrite VBD' para substituir ou em 'Append VBDs' para adicionar. Em seguida, vá para a aba 'Line Items' e preencha o campo 'Lift date' com a data 'Job Finished' indicada na fatura. Depois acesse a aba 'Accounting' e atualize o 'Baseline Date' e os detalhes de 'Payment Term' relacionados à fatura. Salve as alterações e clique em 'Simulate Rules'. Escalar problemas de simulação não resolvidos: Solicitante não consegue corrigir erros identificados pela simulação dentro do tempo esperado. · Supervisor de AP | `MS` |
| `Decisão` | Decisão: O resultado da simulação está sem erros (status verde)? Status exibido em verde significa sem erros; vermelho indica erro(s) que requerem correção. Status verde (sem erros) → 12.14 · Se a simulação indicar status satisfatório, clique em 'Apply Rules'. A ação resultará na postagem da fatura no sistema. Status vermelho (erros detectados) → 12.12 · Na tela de resultados selecione o accrual VBD apropriado. Clique em 'Overwrite VBD' para substituir ou em 'Append VBDs' para adicionar. Em seguida, vá para a aba 'Line Items' e preencha o campo 'Lift date' com a data 'Job Finished' indicada na fatura. Depois acesse a aba 'Accounting' e atualize o 'Baseline Date' e os detalhes de 'Payment Term' relacionados à fatura. Salve as alterações e clique em 'Simulate Rules'. | `MS` |
| `12.14` | Se a simulação indicar status satisfatório, clique em 'Apply Rules'. A ação resultará na postagem da fatura no sistema. | `ME` |
| `12.15` | Se o scheduler forneceu Plant, Material e Strategy, no ZEWB selecione a opção 'Non-Trip related'. Insira Plant, Material e Strategy conforme informado pelo scheduler. Preencha os campos obrigatórios do VBD conforme procedimento (Expanse Class group = 'Z1'; Expanse Class conforme tipo; Accounting Type = 'B' para Non-Trip; Posting Category = '3'; Posting Date, Partner, Net amount, Reference, Document Date). Pressione Enter, verifique e clique em Save. Após salvar, copie o número do VBD gerado e retorne ao VIM Workplace para seguir os passos de pesquisa e associação do VBD (retornar ao passo 'step-115'). | `ME` |

### Step 13 — Roteamento a Scheduler e Processamento Crude Non‑Trip Related

- **step_id:** `step_13`
- **macroetapa:** Routing (`roteamento`)
- **source_step_ref:** `13`
- **descrição breve:** Sequência executável para identificar quando encaminhar uma fatura ao scheduler e o procedimento completo para processar faturas Crude Non‑Trip (criação de Trading Contract via ZEWB, criação de VBD, sobrescrita e postagem).
- **classificação consolidada:** `MS`
- **solução tecnológica:** `Workflow`
- **por que foi selecionada:** O encaminhamento ao Scheduler depende de critérios de negócio, informação faltante e acompanhamento de retorno.
- **esforço:** `Médio` — estimativa relativa baseada na quantidade de sistemas, dependências, transações sensíveis, reconciliações e decisões observadas.
- **human_control:** `approval_required` — revisão humana permanece necessária para dados, exceções, aprovações e/ou transações financeiras.
- **evidence_status:** `evidenced` para a atividade atual; `needs_validation` para solução, esforço e viabilidade técnica.
- **sub-steps:** 30 registros preservados da SOP.

| Sub-step | Descrição | Classificação individual |
|---|---|---|
| `13.1` | Decidir se a fatura deve ser encaminhada ao scheduler para codificação. | `MS` |
| `Decisão` | Decisão: A fatura possui Nomination Key (NK) exibida e os dados (local, produto, data de schedule) conferem com a nomination exibida? Compare a presença do NK e os campos local, produto e data de schedule entre a cópia da fatura e a nomination mostrada no VIM/nomination. Sem NK ou há discrepâncias — encaminhar ao scheduler → 13.2 · Acionar a opção que encaminha a fatura para a fila do scheduler. NK presente e sem discrepâncias — seguir processo trip-related (passos 13–23 do documento) → Encaminhar para o fluxo trip-related do documento (seguir passos 13 a 23). Este é um handoff para a sequência trip-related documentada. | `MS` |
| `13.2` | Acionar a opção que encaminha a fatura para a fila do scheduler. | `MS` |
| `13.2.1` | Na tela da fatura no VIM Workplace, clique em 'Refer to Scheduler' para iniciar o encaminhamento. | `MS` |
| `13.3` | Preencher o comentário de solicitação de codificação no popup e salvar para encaminhar ao scheduler. Requisito: usar o formato de comentário destacado: Inserir a solicitação de coding no formato destacado no popup de comentário antes de salvar. | `MS` |
| `13.3.1` | No popup de comentário exibido após 'Refer to Scheduler', digite a solicitação de coding seguindo o formato destacado na tela e clique no ícone salvar. Requisito: usar o formato de comentário destacado: Inserir a solicitação de coding no formato destacado no popup de comentário antes de salvar. | `MS` |
| `13.3.2` | Clique no ícone de salvar para registrar o comentário e prosseguir com a seleção do scheduler. | `ME` |
| `13.4` | Selecionar o scheduler indicado (conforme contato exibido) e clicar em 'Continue' para enviar a fatura à fila do scheduler selecionado. Scheduler fixo para faturas Crude: Para faturas de produto Crude, selecionar o scheduler fixo Emmanuella.Ekhaguere@p66.com quando disponível. | `ME` |
| `13.4.1` | Na tela que aparece após salvar o comentário, localize o contato do scheduler fornecido na fatura, selecione o ID correspondente e clique em 'Continue'. Scheduler fixo para faturas Crude: Para faturas de produto Crude, selecionar o scheduler fixo Emmanuella.Ekhaguere@p66.com quando disponível. | `MA` |
| `13.4.2` | Após clicar 'Continue', verifique que a fatura foi movida para a fila do scheduler (confirmação visual na tela). | `ME` |
| `13.5` | Para invoices de produto Crude, o roteamento é idêntico porém com scheduler fixo. Use o scheduler fixo especificado quando a fatura for Crude. Scheduler fixo para faturas Crude: Para faturas de produto Crude, selecionar o scheduler fixo Emmanuella.Ekhaguere@p66.com quando disponível. | `ME` |
| `13.6` | Abrir a fatura no VIM Workplace, clicar em 'Comment' e confirmar que o scheduler aprovou/codificou a fatura antes de prosseguir com criação de Trading Contract / VBD. | `ME` |
| `13.6.1` | Navegue ao VIM Workplace e abra a fatura a ser processada. | `ME` |
| `13.6.2` | Clique em 'Comment' e verifique o status/aprovação do scheduler exibida no histórico de comentários. Se estiver aprovada, prossiga; se não, aguarde ou reencaminhe conforme necessário. | `MS` |
| `13.7` | Abrir a transação ZEWB, inserir o número do Trading Contract referente à localização (ex.: Ferndale) a partir do arquivo Excel exportado e executar para localizar o contract. Verificação: tratamento de erros após 'Simulate Rules': Confirmar que a simulação de regras não retornou mensagens de erro antes de aplicar a regra. | `ME` |
| `13.7.1` | No SAP, acesse o código de transação ZEWB e prepare-se para inserir o Trading Contract number. | `ME` |
| `13.7.2` | Digite o número do Trading Contract (obtido do arquivo Excel exportado sob a variante 'JUANID') e clique no ícone 'Execute' para carregar a lista de contracts. | `ME` |
| `13.7.3` | Se receber detalhes de local ou produto não existentes, contacte o scheduler responsável para obter o coding adequado antes de criar um novo Trading Contract. | `MS` |
| `13.8` | Na lista retornada pela execução do ZEWB, selecione o item correspondente e acione 'Create Expense' para iniciar a inclusão da despesa (VBD). | `MA` |
| `13.8.1` | Marque a linha do Trading Contract que corresponde ao job location e clique em 'Create Expense'. | `MA` |
| `13.8.2` | Preencha os campos: Expense class group, Expense Group, Accounting Type, Posting Categories, Posting Date, Partner, Net Amount, Reference Number e Text. Pressione Enter e salve o registro para gerar o VBD. | `ME` |
| `13.9` | Copiar o número do VBD gerado no ZEWB e, no VIM Workplace, abrir a aba 'Other Data' e selecionar 'Search Accrual VBD' para localizar o VBD no VIM. | `ME` |
| `13.9.1` | Após salvar no ZEWB e confirmar que o VBD foi gerado, copie o número do documento VBD exibido. | `ME` |
| `13.9.2` | No VIM Workplace, vá para a aba 'Other Data' e clique em 'Search Accrual VBD' para preparar a busca pelo número copiado. | `ME` |
| `13.10` | Na tela de busca de Accrual VBD, cole/insira o número do VBD copiado e clique em 'Execute' para localizar o VBD dentro do VIM. | `ME` |
| `13.11` | Localizado o VBD no VIM, selecionar o VBD e executar a sobrescrita. Em seguida, na aba 'Accounting' inserir Baseline Date e Payment Terms, salvar; usar 'Simulate Rules' para verificar ausência de erros; finalmente clicar em 'Apply Rule' para postar a fatura. Verificação: tratamento de erros após 'Simulate Rules': Confirmar que a simulação de regras não retornou mensagens de erro antes de aplicar a regra. | `ME` |
| `13.11.1` | Selecione o VBD retornado na busca e acione a opção 'Overwrite VBD' para associar o VBD à fatura. | `ME` |
| `13.11.2` | Abra a aba 'Accounting', preencha o campo 'Baseline Date' e os 'Payment Terms' conforme a fatura e clique em salvar para persistir os dados contábeis. | `ME` |
| `13.11.3` | Clique em 'Simulate Rules' e verifique se há mensagens de erro. Se não houver erros, prossiga para aplicar a regra. Verificação: tratamento de erros após 'Simulate Rules': Confirmar que a simulação de regras não retornou mensagens de erro antes de aplicar a regra. | `ME` |
| `13.11.4` | Após simulação sem erros, clique em 'Apply Rule' para que a fatura seja postada no sistema. | `ME` |

### Step 14 — Processar fatura do fornecedor SGS CANADA INC (Non‑PO, codificação fixa)

- **step_id:** `step_14`
- **macroetapa:** Execution (`execucao`)
- **source_step_ref:** `14`
- **descrição breve:** Procedimento passo a passo para verificar, classificar, aplicar regras, direcionar para aprovação e postar faturas do fornecedor SGS CANADA INC usando VIM Workplace (S/4 VIM) com codificação fixa (G/L, Material, Profit center).
- **classificação consolidada:** `ME + MS`
- **solução tecnológica:** `Motor de regras`
- **por que foi selecionada:** A codificação fixa do fornecedor é repetitiva e pode ser orientada por regras explícitas, com conferência antes da postagem.
- **esforço:** `Médio` — estimativa relativa baseada na quantidade de sistemas, dependências, transações sensíveis, reconciliações e decisões observadas.
- **human_control:** `review_required` — revisão humana permanece necessária para dados, exceções, aprovações e/ou transações financeiras.
- **evidence_status:** `evidenced` para a atividade atual; `needs_validation` para solução, esforço e viabilidade técnica.
- **sub-steps:** 26 registros preservados da SOP.

| Sub-step | Descrição | Classificação individual |
|---|---|---|
| `14.1` | Abrir a entrada da fatura do fornecedor SGS CANADA INC no VIM Workplace e validar os dados da fatura em relação à cópia física ou PDF. | `ME` |
| `14.1.1` | Confirmar que os seguintes campos da fatura correspondem à cópia do documento: número da fatura, data da fatura, valor total, dados bancários (se presentes) e dados do fornecedor. Se houver discrepâncias, suspender processamento e anotar as diferenças na fatura de trabalho. | `MA` |
| `14.2` | No registro da fatura, alterar o tipo de documento para o tipo específico de Non‑PO Manual e salvar o identificador do requisitante. Obrigatoriedade de preencher Requester E‑mail: Preencher o campo Requester E‑mail com o Email ID do usuário processador antes de salvar o tipo de documento. | `ME` |
| `14.2.1` | Clicar em Change Doc Type, selecionar a opção 'Non‑PO Invoice – Manual uploads' conforme o tipo de processamento manual requerido para SGS CANADA INC. | `ME` |
| `14.2.2` | No campo Requester E-mail inserir o seu e‑mail (Email ID do usuário que processa a fatura) e salvar o registro pressionando Ctrl + S. Obrigatoriedade de preencher Requester E‑mail: Preencher o campo Requester E‑mail com o Email ID do usuário processador antes de salvar o tipo de documento. | `ME` |
| `14.3` | Na aba Line‑Item informar a codificação contábil necessária para SGS CANADA INC (G/L, Material, Valor, Profit center). Codificação fixa obrigatória para SGS CANADA INC: Usar os valores fixos: G/L = 50002900; Material = 2100045; Profit center = 5090000001 ao inserir as linhas para o fornecedor SGS CANADA INC. | `ME` |
| `14.3.1` | Preencher os campos de linha com: G/L = 50002900; Material = 2100045; Profit center = 5090000001; e inserir o Amount conforme valor na fatura. Confirmar que os valores inseridos batem com a cópia da fatura antes de salvar. Codificação fixa obrigatória para SGS CANADA INC: Usar os valores fixos: G/L = 50002900; Material = 2100045; Profit center = 5090000001 ao inserir as linhas para o fornecedor SGS CANADA INC. | `ME` |
| `14.4` | Na aba Accounting ajustar a Data Base (Baseline Date) e os Payment Terms conforme os dados da fatura e salvar o registro. Preenchimento obrigatório de Baseline Date e Payment Terms: Na aba Accounting preencher Baseline Date e Payment Terms conforme os dados da fatura antes de salvar. | `ME` |
| `14.4.1` | No separador Accounting informar o Baseline Date e os Payment Terms de acordo com a data/condição na fatura. Após preencher, salvar usando Ctrl + S. Preenchimento obrigatório de Baseline Date e Payment Terms: Na aba Accounting preencher Baseline Date e Payment Terms conforme os dados da fatura antes de salvar. | `ME` |
| `14.5` | Executar a opção Simulate Rules e confirmar que os estados retornados estão com sinal verde, exceto o indicador 'Approval required' que pode permanecer pendente conforme o valor. | `ME` |
| `14.5.1` | Acionar a função Simulate Rules e aguardar o resultado da simulação. | `ME` |
| `14.5.2` | Confirmar que a simulação não apresenta erros (todos os checks com status apropriado). Caso haja mensagens de erro ou bloqueio, consultar o procedimento de resolução especificado (incerteza sobre o fluxo de tratamento — ver unknown relacionado). | `ME` |
| `14.6` | Clicar em Apply Rule para que o sistema aplique as regras de workflow. O destino após Apply Rule depende do valor da fatura (decisão de aprovação). | `MS` |
| `14.6.1` | Acionar Apply Rule para iniciar o direcionamento conforme as regras; aguardar confirmação do sistema de que a ação foi aplicada. | `ME` |
| `14.6.2` | Decidir o fluxo de aprovação com base no valor total da fatura, conforme as faixas definidas para SGS CANADA INC. | `MS` |
| `Decisão` | Decisão: Qual é a faixa de valor total da fatura? Comparar o valor total da fatura com os limites: < 1.000 USD; entre 1.000 USD e 25.000 USD; > 25.000 USD. Valor abaixo de 1.000 USD — postar automaticamente → A fatura será postada automaticamente após Apply Rule (sem exigência de aprovação adicional). Valor entre 1.000 USD e 25.000 USD — requer aprovação do gestor interno → 14.7 · A fatura entrará na fila do aprovador de primeiro nível (gestor interno). Executar e aprovar conforme a rotina de aprovação padrão. Valor acima de 25.000 USD — requer aprovação do supervisor P66 (supervisor sí­nico) → 14.8 · Para faturas acima de 25.000 USD processar o primeiro nível e encaminhar explicitamente ao P66 supervisor no campo indicado para aprovação de segundo nível. | `MS` |
| `14.7` | A fatura entrará na fila do aprovador de primeiro nível (gestor interno). Executar e aprovar conforme a rotina de aprovação padrão. | `MS` |
| `14.7.1` | Na fila de primeiro nível localizar a fatura processada, selecionar a linha correspondente e clicar em Execute para abrir a tela de aprovação. | `MA` |
| `14.7.2` | Após executar, clicar em Approve para completar a aprovação de primeiro nível. Em seguida seguir para a etapa de inserir e‑mail do supervisor para o próximo nível quando exigido (ver s8). | `MS` |
| `14.8` | Para faturas acima de 25.000 USD processar o primeiro nível e encaminhar explicitamente ao P66 supervisor no campo indicado para aprovação de segundo nível. Escalação para aprovação do P66 supervisor para faturas > 25.000 USD: Fatura com valor superior a 25.000 USD após Apply Rule e aprovação de primeiro nível. · P66 supervisor | `MS` |
| `14.8.1` | Selecionar a fatura na fila de primeiro nível e clicar em Execute para abrir a tela de aprovação; preparar o encaminhamento adicional ao supervisor P66 conforme a política de limites. Escalação para aprovação do P66 supervisor para faturas > 25.000 USD: Fatura com valor superior a 25.000 USD após Apply Rule e aprovação de primeiro nível. · P66 supervisor | `MS` |
| `14.8.2` | Clicar em Approve (primeiro nível) e em seguida inserir o e‑mail do supervisor P66 no campo designado para envio ao próximo nível de aprovação, incluindo notas se necessário (ver s8). Escalação para aprovação do P66 supervisor para faturas > 25.000 USD: Fatura com valor superior a 25.000 USD após Apply Rule e aprovação de primeiro nível. · P66 supervisor | `MS` |
| `14.9` | Na tela exibida após clicar em Approve na aprovação de primeiro nível, informar o e‑mail do aprovador do próximo nível e, quando solicitado, inserir comentários pertinentes ao encaminhamento. Escalação para aprovação do P66 supervisor para faturas > 25.000 USD: Fatura com valor superior a 25.000 USD após Apply Rule e aprovação de primeiro nível. · P66 supervisor | `MS` |
| `14.9.1` | No campo indicado inserir o e‑mail do aprovador do próximo nível: para faturas entre 1.000 e 25.000 USD inserir o e‑mail do gestor interno; para faturas >25.000 USD inserir o e‑mail do P66 supervisor. Inserir comentários concisos no campo Comment se houver instruções específicas, então salvar/confirmar a ação de aprovação. Escalação para aprovação do P66 supervisor para faturas > 25.000 USD: Fatura com valor superior a 25.000 USD após Apply Rule e aprovação de primeiro nível. · P66 supervisor | `MS` |
| `14.10` | Após a aprovação de todos os níveis exigidos, confirmar que a fatura foi devidamente postada no sistema. Se a fatura foi de faixa abaixo de 1.000 USD, a postagem ocorrerá imediatamente após Apply Rule conforme end_state definido. | `MS` |
| `14.10.1` | Confirmar no sistema que a fatura agora tem status Posted (ou equivalente) e arquivar a cópia comprovante no workflow conforme procedimento local. | `ME` |

### Step 15 — Processamento Intercompany — Exportar dados SAP (FAGLL03H) e preparar relatório WD06

- **step_id:** `step_15`
- **macroetapa:** Codification (`codificacao`)
- **source_step_ref:** `15`
- **descrição breve:** Executar extração de lançamentos intercompany no SAP via FAGLL03H, preparar planilha, filtrar parceiros comerciais, enviar para responsável e executar o processamento WD06 (categoria, pivot, verificação e obsolescência em VIM).
- **classificação consolidada:** `ME + MS`
- **solução tecnológica:** `RPA / Planilha`
- **por que foi selecionada:** A extração FAGLL03H e preparação do relatório WD06 seguem uma rotina estruturada de exportação e transformação.
- **esforço:** `Médio` — estimativa relativa baseada na quantidade de sistemas, dependências, transações sensíveis, reconciliações e decisões observadas.
- **human_control:** `review_required` — revisão humana permanece necessária para dados, exceções, aprovações e/ou transações financeiras.
- **evidence_status:** `evidenced` para a atividade atual; `needs_validation` para solução, esforço e viabilidade técnica.
- **sub-steps:** 42 registros preservados da SOP.

| Sub-step | Descrição | Classificação individual |
|---|---|---|
| `15.1` | No SAP, iniciar o T-Code FAGLL03H - G/L Line-Item Browser para extrair movimentos intercompany. | `ME` |
| `15.1.1` | No campo de comando do SAP, inserir 'FAGLL03H' e confirmar para abrir o G/L Line-Item Browser. | `ME` |
| `15.1.2` | Confirmar que Company Code, Ledger e G/L Account estão preenchidos automaticamente conforme variante selecionada posteriormente. | `ME` |
| `15.2` | Obter a variante predefinida e executá-la para popular os parâmetros do relatório. | `ME` |
| `15.2.1` | Pressionar Shift+F5 (Get Variant) para exibir variantes salvas. | `ME` |
| `15.2.2` | Selecionar a variante identificada como 'P AND T'. | `ME` |
| `15.2.3` | Executar a variante pressionando F8 (Execute). | `ME` |
| `15.3` | Modificar o layout do relatório para o layout de fechamento de mês e executar para obter o formato esperado. | `ME` |
| `15.3.1` | Escolher o layout nomeado 'month end close' na lista de layouts disponíveis. | `ME` |
| `15.3.2` | Após alterar o layout, executar o relatório pressionando F8. | `ME` |
| `15.4` | Gerar a planilha a partir do resultado do relatório e salvar com nome apropriado antes do pós-processamento. Prazo de execução do relatório intercompany: O relatório intercompany do FAGLL03H normalmente é executado no 4º dia útil; confirmar execução dentro desse prazo. Formato/nomenclatura do arquivo exportado: Confirmar o padrão de nomenclatura do arquivo Excel a ser usado ao salvar a exportação. | `ME` |
| `15.4.1` | No resultado do relatório, clicar com o botão direito em qualquer linha e selecionar a opção 'Spreadsheet'. | `ME` |
| `15.4.2` | Na caixa de diálogo de exportação, alterar o nome do arquivo Excel conforme necessário e confirmar com Enter. Formato/nomenclatura do arquivo exportado: Confirmar o padrão de nomenclatura do arquivo Excel a ser usado ao salvar a exportação. | `ME` |
| `15.4.3` | Confirmar a exportação e salvar a planilha no local de trabalho designado. | `ME` |
| `15.5` | No arquivo exportado, filtrar a coluna de 'trading partner' para manter apenas os parceiros 1010 e 1011 e remover as demais linhas. Company codes intercompany: Garantir que os company codes intercompany principais (1010, 1011 e 1231/DCP) estejam corretamente identificados; durante o filtro manter 1010 e 1011 conforme procedimento. | `ME` |
| `15.5.1` | Aplicar filtro na coluna 'trading partner' e selecionar os valores '1010' e '1011'. | `ME` |
| `15.5.2` | Selecionar todas as linhas resultantes fora dos parceiros 1010 e 1011 e excluí-las do arquivo. | `ME` |
| `15.6` | Encaminhar o arquivo limpo ao responsável designado para que ele realize o processamento WD06 (recebimento na 7ª jornada, categorização e reconciliação). Recebimento de detalhes para WD06: Os detalhes para processamento WD06 devem ser recebidos no 7º dia útil; confirmar a data de recebimento antes de iniciar a categorização. | `MA` |
| `15.6.1` | Anexar a planilha ao e-mail ou sistema de transferência utilizado e enviar ao responsável pelo WD06. Recebimento de detalhes para WD06: Os detalhes para processamento WD06 devem ser recebidos no 7º dia útil; confirmar a data de recebimento antes de iniciar a categorização. | `ME` |
| `15.6.2` | Informar no envio que os detalhes de intercompany correspondentes ao mês anterior devem ser processados no mês corrente conforme rotina. | `MA` |
| `15.7` | Ao receber o arquivo no 7º dia útil, executar limpeza de colunas e preparar para categorização. | `ME` |
| `15.7.1` | Confirmar que o arquivo foi recebido no sétimo dia útil e abrir a planilha recebida. | `ME` |
| `15.7.2` | Excluir do arquivo as colunas especificadas: Document Header Text, Reverse, Reversal Document, Doc Date. | `ME` |
| `15.7.3` | Verificar: (a) document number e reference document number são idênticos; (b) company code aparece como fornecedor; (c) identificar que as company codes intercompany principais são 1010, 1011 e DCP (1231); (d) usar coluna 'Text' para ajudar a identificar o tipo de despesa. | `ME` |
| `15.7.4` | Aplicar filtro para manter linhas referentes às company codes intercompany conforme necessário (p.ex. 1010, 1011). | `ME` |
| `15.8` | Verificar se a célula da coluna 'Text' está em branco para a linha do documento. | `MS` |
| `Decisão` | Decisão: A coluna 'Text' do documento está em branco (sem conteúdo) para a linha processada? Campo 'Text' vazio (nenhum caractere não-espacial presente). Sim - Texto vazio → 15.9 · Quando a coluna Text estiver vazia, copiar o Reference Number e pesquisar no VIM Analytics para recuperar a categoria do invoice. Não - Texto preenchido → 15.10 · Preencher a coluna 'Invoice Type' na planilha com base nas palavras-chave encontradas na coluna Text conforme mapeamento definido. | `MS` |
| `15.9` | Quando a coluna Text estiver vazia, copiar o Reference Number e pesquisar no VIM Analytics para recuperar a categoria do invoice. | `ME` |
| `15.9.1` | No SAP, executar o relatório /OPT/VIM_VA2 (VIM Analytics 7.50). | `ME` |
| `15.9.2` | Colar o Reference Number copiado da planilha no campo correspondente e executar (F8). | `MA` |
| `15.9.3` | Anotar o tipo de invoice exibido no resultado do VIM Analytics e retornar à planilha para registrar a categoria. | `ME` |
| `15.10` | Preencher a coluna 'Invoice Type' na planilha com base nas palavras-chave encontradas na coluna Text conforme mapeamento definido. | `ME` |
| `15.10.1` | Para cada linha, procurar a palavra-chave na coluna Text e atribuir o Invoice Type conforme abaixo: Tariff# → Pipeline Tariff; Barge Service → Terminaling; Truck Rack → Terminaling; Pump over → Terminaling; Gain/Loss → Gain/Loss; Loss Allowance → Loss Allowance. | `ME` |
| `15.10.2` | Preencher ou atualizar a coluna 'Invoice Type' com o valor identificado para cada linha. | `ME` |
| `15.11` | Construir uma tabela dinâmica para agrupar e facilitar a identificação de créditos/debitos e os tipos de invoice. | `ME` |
| `15.11.1` | Inserir uma nova Pivot Table em uma nova worksheet e confirmar (clicar New Worksheet e OK). | `ME` |
| `15.11.2` | Adicionar Document Number para rastreamento, Company Code para identificação do vendor; colocar Invoice Type como filtro; agrupar/totalizar valores por moeda conforme necessário. | `ME` |
| `15.12` | Usar os resultados da Pivot para localizar faturas destacadas (crédito/debito em vermelho) no VIM Workplace, obsoletar as que forem identificadas como obsoletas e verificar individualmente faturas do tipo pipeline. Ação técnica para obsoleter faturas no VIM: Confirmar o procedimento/fluxo exato (botão/menu) no VIM Workspace utilizado para marcar faturas como obsoletas. | `ME` |
| `15.12.1` | A partir da Pivot, listar os Document Numbers/Reference Numbers que aparecem como crédito/debito destacados (em vermelho) e marcá-los para ação no VIM. | `ME` |
| `15.12.2` | No SAP VIM Workspace, ir à coluna 'Reference', aplicar filtro com o Reference Number copiado e localizar a linha correspondente. | `MA` |
| `15.12.3` | Dar duplo clique no Reference Number encontrado para abrir os detalhes e confirmar que o Invoice Type registrado é 'pipeline' quando aplicável. | `ME` |
| `15.12.4` | Para cada Reference Number marcado como obsoleto, executar a ação de obsolecer no VIM Workspace (obsolecer as faturas que a Pivot indicou como obsoletas). Ação técnica para obsoleter faturas no VIM: Confirmar o procedimento/fluxo exato (botão/menu) no VIM Workspace utilizado para marcar faturas como obsoletas. | `ME` |

### Step 16 — Processamento IC Pipeline Tariff / Terminal — ajustar Document Type SEC_SUM, criar/atualizar VBD e disparar incident em ServiceNow

- **step_id:** `step_16`
- **macroetapa:** Exception (`excecao`)
- **source_step_ref:** `16`
- **descrição breve:** Sequência completa para localizar invoices Pipeline/Terminal no VIM Workplace, ajustar Document Type para SEC_SUM, gerar incident em ServiceNow para disparo de VBD automático, obter/confirmar Trading Contract e criar/overwritar VBD manualmente até postar a fatura.
- **classificação consolidada:** `MS + MA`
- **solução tecnológica:** `Workflow`
- **por que foi selecionada:** A correção intercompany envolve ajuste de Document Type, VBD e abertura de incidente; requer coordenação e decisão humana.
- **esforço:** `Alto` — estimativa relativa baseada na quantidade de sistemas, dependências, transações sensíveis, reconciliações e decisões observadas.
- **human_control:** `decision_required` — revisão humana permanece necessária para dados, exceções, aprovações e/ou transações financeiras.
- **evidence_status:** `evidenced` para a atividade atual; `needs_validation` para solução, esforço e viabilidade técnica.
- **sub-steps:** 18 registros preservados da SOP.

| Sub-step | Descrição | Classificação individual |
|---|---|---|
| `16.1` | No VIM Workplace, aplique filtros para localizar a invoice de Pipeline Tariff / Terminal correspondente e execute a linha para carregar os detalhes. | `MA` |
| `16.1.1` | Navegue ao VIM Workplace. Modifique os parâmetros do filtro para selecionar invoices do tipo Pipeline Tariff / Terminal conforme os detalhes da fatura a processar (usar os critérios disponíveis no VIM). | `ME` |
| `16.1.2` | Com a linha da invoice selecionada, execute-a usando a tecla F8 para carregar o conteúdo completo da invoice na tela (conforme Step11). | `ME` |
| `16.1.3` | Verifique e confirme os seguintes campos da invoice contra o documento recebido: invoice number (nº da fatura), invoice date (data da fatura), reference number (número de referência), gross amount (valor bruto) e company code (código da empresa). (conforme Step12). | `ME` |
| `16.2` | Para as invoices de Pipeline Tariff e Terminal, altere o campo Document Type para SEC_SUM e, quando necessário, atualize o Vendor Number conforme informado na invoice (conforme instruções da página 144). Obrigatoriedade: Document Type = SEC_SUM para Pipeline/Terminal: As invoices Pipeline Tariff e Terminal devem ter o campo Document Type alterado para SEC_SUM antes de solicitar o disparo do VBD automático. | `MS` |
| `16.2.1` | Localize o campo Document Type na tela da invoice e selecione/insira SEC_SUM para essa invoice. Faça isso para todas as invoices Pipeline/Terminal a serem processadas (página 144). | `ME` |
| `16.2.2` | Verifique o Vendor Number exibido. Se necessário, altere o Vendor Number para o valor que consta na invoice para garantir correspondência (página 144). | `MA` |
| `16.3` | Crie um ticket no portal ServiceNow indicando que a invoice foi marcada como SEC_SUM e solicitando o disparo do auto-fire do VBD para essa invoice. Aguarde o fechamento/retorno do ticket antes de prosseguir (conforme Step2 página 144 e Step3 página 144). Gerar incidente em ServiceNow para disparo do auto-fire VBD: Criar ticket no portal ServiceNow solicitando o auto-fire do VBD após alteração do Document Type para SEC_SUM. | `MS` |
| `16.4` | Após o ticket do ServiceNow ser finalizado, inspecione a invoice no VIM para identificar se há line items (linhas) faltando que impeçam o mapeamento do Trading Contract. | `MS` |
| `Decisão` | Decisão: Existem line items faltantes na invoice que impedem identificar o trading contract? Presença/ausência de todas as linhas de cobrança esperadas na invoice conforme o documento recebido; se alguma linha mencionada na invoice original não estiver presente na listagem carregada no VIM, considerar 'Sim'. Sim — há linhas faltando → 16.5 · Se houver linhas faltando: localize o trac code/BOL number presente na invoice; utilize o trac code para mapear a localização (mapa/registro) e, a partir disso, identificar qual Trading Contract é aplicável. Prepare e encaminhe a evidência ao time FP&A para que forneça o Trading Contract correspondente (conforme Step3 e Step4 páginas 144-145). Não — todas as linhas presentes → 16.6 · Quando as linhas estiverem completas (ou após mapear trac code), solicite ao time FP&A o Trading Contract aplicável conforme a descrição da invoice e/ou trac code. O FP&A fornecerá o TC utilizado para o processamento (conforme Step4 página 145). | `MS` |
| `16.5` | Se houver linhas faltando: localize o trac code/BOL number presente na invoice; utilize o trac code para mapear a localização (mapa/registro) e, a partir disso, identificar qual Trading Contract é aplicável. Prepare e encaminhe a evidência ao time FP&A para que forneça o Trading Contract correspondente (conforme Step3 e Step4 páginas 144-145). | `MA` |
| `16.6` | Quando as linhas estiverem completas (ou após mapear trac code), solicite ao time FP&A o Trading Contract aplicável conforme a descrição da invoice e/ou trac code. O FP&A fornecerá o TC utilizado para o processamento (conforme Step4 página 145). | `ME` |
| `16.7` | Crie o VBD correspondente ao produto indicado na invoice. Clique na opção indicada na tela para criar o VBD (referido como 'Create Expanse' no documento) e, após criação, selecione o ícone de lápis (Pencil) para editar/atualizar informações adicionais antes de salvar (conforme Step5 e Step6 páginas 145-146). | `MA` |
| `16.7.1` | Execute a ação de 'Create Expanse' conforme exibido na tela para gerar o rascunho do VBD (página 145). | `ME` |
| `16.7.2` | Clique no ícone de lápis para atualizar informações adicionais do VBD. Preencha os campos destacados conforme os dados da invoice (conforme Step6 e Step7 páginas 146). Após inserir os detalhes, use 'Go back' se necessário e salve o VBD. | `ME` |
| `16.8` | Após salvar o VBD, copie o número do VBD exibido no pop-up. Volte ao VIM Workplace, na aba Other data, e selecione a função Search Accrual VBD para procurar pelo VBD usando campos como BOL NUMBER, TRANSACTION DATE, BATCH NUMBER (conforme Step8 e Step9 páginas 147). | `ME` |
| `16.9` | No painel Search Accrual VBD, cole/insira o número do VBD copiado e pressione F8 para executar a busca (conforme Step10 página 148). Quando o VBD for carregado, selecione a opção Overwrite VBD para sobrescrever o VBD existente conforme necessário. | `ME` |
| `16.10` | Após sobrescrever o VBD, pressione Ctrl+S para salvar as alterações. Em seguida, selecione a opção Simulate Rule e verifique que a simulação indique zero erros. Somente após confirmação de zero erros, selecione Apply Rules para executar a postagem da invoice (conforme Step11 página 149). Confirmar simulação sem erros antes de aplicar regras: Executar Simulate Rule e confirmar que o resultado apresenta zero errors antes de acionar Apply Rules para postar a invoice. | `ME` |

### Step 17 — Extração de Nomination Key via Fiori — obter NK, aplicar filtros e exportar

- **step_id:** `step_17`
- **macroetapa:** Intake (`entrada`)
- **source_step_ref:** `17`
- **descrição breve:** Sequência executável para localizar Nomination Key no Fiori, aplicar os filtros exigidos (plant, transport system e scheduled date), obter resultados, personalizar tabela (colunas necessárias), filtrar ticket status e exportar o arquivo Excel com as colunas selecionadas para uso na criação manual de VBD.
- **classificação consolidada:** `ME`
- **solução tecnológica:** `RPA`
- **por que foi selecionada:** A busca e exportação da Nomination Key no Fiori são repetitivas e baseadas em filtros definidos.
- **esforço:** `Médio` — estimativa relativa baseada na quantidade de sistemas, dependências, transações sensíveis, reconciliações e decisões observadas.
- **human_control:** `review_required` — revisão humana permanece necessária para dados, exceções, aprovações e/ou transações financeiras.
- **evidence_status:** `evidenced` para a atividade atual; `needs_validation` para solução, esforço e viabilidade técnica.
- **sub-steps:** 10 registros preservados da SOP.

| Sub-step | Descrição | Classificação individual |
|---|---|---|
| `17.1` | No ambiente Fiori, localizar e abrir a aplicação Nomination Key para iniciar a extração da Nomination Key que será usada na criação manual do VBD. | `ME` |
| `17.2` | Na tela da aplicação Nomination Key, selecionar a opção 'my nomination' e, em seguida, o modo 'view standard'. Em seguida aplicar filtro pelo plant (nome do plant) conforme consta na fatura referência. Confirmação do plant com a fatura: O valor do campo 'plant' utilizado no filtro deve corresponder exatamente ao plant indicado na fatura referência. | `MA` |
| `17.3` | No painel de filtros, preencher o campo 'transport systems' com o(s) código(s) de transporte relacionados à fatura. Inserir o scheduled date correspondente ao mês de Outubro conforme instruído pela fatura. | `MA` |
| `17.4` | Após configurar todos os filtros (plant, transport systems, scheduled date), clicar no botão 'GO' para executar a pesquisa de nominations que atendam aos filtros aplicados. | `ME` |
| `17.5` | Avaliar se a tabela de resultados possui linhas após a execução da busca. Procedimento em caso de busca sem resultados: Condição: A busca retornou zero linhas após clicar GO. Ações: Verificar se os filtros 'plant' e 'transport systems' foram preenchidos corretamente.; Ampliar o intervalo do scheduled date (incluir mais dias dentro do mês ou datas adjacentes) e reexecutar a busca.; Confirmar se existem valores alternativamente classificados (p.ex., partially actualized) que devam ser considerados.. Resultado: 17.3 · No painel de filtros, preencher o campo 'transport systems' com o(s) código(s) de transporte relacionados à fatura. Inserir o scheduled date correspondente ao mês de Outubro conforme instruído pela fatura. | `MA` |
| `Decisão` | Decisão: A pesquisa retornou ao menos uma linha (resultados) na tabela? Tabela de resultados com >= 1 linhas visíveis após clicar GO Sim - há resultados → 17.7 · Com resultados visíveis, abrir a opção de 'table personalization' para selecionar as colunas que serão incluídas no arquivo exportado. Selecionar explicitamente as colunas: 'Nomination Key', 'Ticket Status', 'Actual Quantity' e 'Schedule Type'. Confirmar a aplicação da personalização antes de exportar. Não - sem resultados → 17.6 · Se a busca não retornou resultados, revisar filtros aplicados: confirmar plant, transport systems e scheduled date; ampliar o intervalo de datas (p.ex., incluir dias adicionais em Outubro) e reexecutar a busca (voltar para o passo de aplicação de filtros e clicar GO novamente). | `MS` |
| `17.6` | Se a busca não retornou resultados, revisar filtros aplicados: confirmar plant, transport systems e scheduled date; ampliar o intervalo de datas (p.ex., incluir dias adicionais em Outubro) e reexecutar a busca (voltar para o passo de aplicação de filtros e clicar GO novamente). Procedimento em caso de busca sem resultados: Condição: A busca retornou zero linhas após clicar GO. Ações: Verificar se os filtros 'plant' e 'transport systems' foram preenchidos corretamente.; Ampliar o intervalo do scheduled date (incluir mais dias dentro do mês ou datas adjacentes) e reexecutar a busca.; Confirmar se existem valores alternativamente classificados (p.ex., partially actualized) que devam ser considerados.. Resultado: 17.3 · No painel de filtros, preencher o campo 'transport systems' com o(s) código(s) de transporte relacionados à fatura. Inserir o scheduled date correspondente ao mês de Outubro conforme instruído pela fatura. | `MA` |
| `17.7` | Com resultados visíveis, abrir a opção de 'table personalization' para selecionar as colunas que serão incluídas no arquivo exportado. Selecionar explicitamente as colunas: 'Nomination Key', 'Ticket Status', 'Actual Quantity' e 'Schedule Type'. Confirmar a aplicação da personalização antes de exportar. | `ME` |
| `17.8` | Na própria tabela de resultados, aplicar filtro no campo 'Ticket Status' para manter apenas os registros com status 'Actualized' (ou 'Partially Actualized' se assim determinado pelo caso). Esta filtragem garante que o arquivo exportado contenha o status desejado. | `ME` |
| `17.9` | Após aplicar a personalização das colunas e o filtro de 'Ticket Status', usar a função de exportação da tabela para gerar o arquivo Excel. Salvar o arquivo no local apropriado conforme política do time. Este arquivo conterá as Nomination Keys e demais colunas selecionadas e deverá ser usado para reservar movimentos e/ou criar manualmente o VBD. | `ME` |

### Step 18 — T4 (Transport4) — Conciliação Volume/Entrega e Processo de Loss Allowance

- **step_id:** `step_18`
- **macroetapa:** Execution (`execucao`)
- **source_step_ref:** `18`
- **descrição breve:** Executar a conciliação entre valores de fatura e entregas utilizando o Transport4 (T4) e processar as entradas de Loss Allowance seguindo a sequência abaixo.
- **classificação consolidada:** `MS + MA`
- **solução tecnológica:** `Analytics / Monitoramento`
- **por que foi selecionada:** A conciliação volume/entrega e Loss Allowance compara dados e tolerâncias; analytics pode evidenciar divergências para revisão.
- **esforço:** `Alto` — estimativa relativa baseada na quantidade de sistemas, dependências, transações sensíveis, reconciliações e decisões observadas.
- **human_control:** `review_required` — revisão humana permanece necessária para dados, exceções, aprovações e/ou transações financeiras.
- **evidence_status:** `evidenced` para a atividade atual; `needs_validation` para solução, esforço e viabilidade técnica.
- **sub-steps:** 31 registros preservados da SOP.

| Sub-step | Descrição | Classificação individual |
|---|---|---|
| `18.1` | Acesse o sistema T4 e inicie o fluxo de conciliação de volume/entrega. Efetue login com as credenciais válidas. Credenciais para acesso ao T4: Possuir credenciais de acesso válidas para entrar no sistema T4 antes de iniciar o processo de conciliação. | `ME` |
| `18.2` | Após o login, no menu principal selecione a opção Inventory e, em seguida, escolha a opção P66 Inventory (Phillips 66). | `ME` |
| `18.3` | No formulário de pesquisa do P66 Inventory, preencha os filtros conforme a fatura: - Shipper: selecione Phillips 66 (PHI). - DATE: selecione o mês correspondente à fatura. - Custody pipeline: selecione o pipeline indicado na fatura (ex.: Borger Amarillo pipeline). Clique em Search para carregar os resultados. | `MA` |
| `18.4` | Revise a tela de resultados exibida após a pesquisa e identifique as colunas necessárias (por exemplo: nomination key, ticket status, actual quantity, schedule type). | `ME` |
| `18.5` | Tire um screenshot da tela de resultados do T4 contendo as linhas e colunas usadas para conciliação e salve o arquivo localmente em formato JPG/JPEG. Evidência de tela e anexação: Capturar screenshot da tela de resultados do T4 em JPG/JPEG, salvar localmente e anexar no campo 'VIM Attachment-JPG/JPEG' do registro da fatura. | `ME` |
| `18.6` | Compare os valores de entregas exibidos no T4 com os valores da fatura. Identifique correspondência entre os montantes faturados e os montantes efetivamente entregues. | `MA` |
| `18.7` | No registro da fatura no VIM, abra a seção de anexos e anexe o arquivo JPG/JPEG com o screenshot salvo. Utilize o campo 'VIM Attachment-JPG/JPEG' conforme padrão. Evidência de tela e anexação: Capturar screenshot da tela de resultados do T4 em JPG/JPEG, salvar localmente e anexar no campo 'VIM Attachment-JPG/JPEG' do registro da fatura. | `ME` |
| `18.8` | Abra a planilha commercial charge do intercompany que contém as faturas e informações para processamento de Loss Allowance. Localize a linha da fatura a ser processada. | `ME` |
| `18.9` | No VIM, acesse a área VIM Analytics para localizar as informações relacionadas a Loss Allowance e às faturas do intercompany. | `ME` |
| `18.10` | Em VIM Analytics, localize a coluna Reference. Selecione-a e cole o número da fatura conforme consta na planilha commercial charge. | `ME` |
| `18.11` | Na linha da fatura colada, revise o campo Description para identificar se a fatura corresponde a 'loss allowance' ou outro tipo. Clique no campo de descrição para visualizar detalhes se necessário. | `MA` |
| `18.12` | Abra a lista VBD e aplique filtros: - Vendor: filtre pelo fornecedor indicado (ex.: IS1062). - Invoice type: filtre pelo tipo identificado (ex.: loss allowance). Confirme que a lista exibe somente os registros relevantes. | `ME` |
| `18.13` | Na coluna Description da lista VBD, aplique um filtro para isolar registros cujo cost type seja 'Loss Allowance' (por ex.: procurar os termos PLATA, PIPELINE, TPL conforme aplicável). | `ME` |
| `18.14` | Revise os resultados filtrados para identificar linhas de fired pipeline. Se existir item identificado como 'gold loss allowance' e o processo local indicar que não deve ser processado, não selecione-o para continuação. | `ME` |
| `18.15` | Se o processo exigir operação em Fiori (IC gold pl), abra a aplicação Fiori correspondente e navegue para a transação indicada no sistema para o processamento requerido. | `MA` |
| `18.16` | Na exibição de resultados (por exemplo exportação do Fiori), copie a nomination key da segunda linha relevante. Em seguida, abra o registro da fatura e cole a nomination key no campo apropriado da fatura. | `ME` |
| `18.17` | No registro da fatura, clique em Create Expenses e preencha os campos obrigatórios: - Expense class group - Expense class - Accounting type: selecione 'A' - Posting date - Partner Preencha conforme informações da fatura e do processo. | `ME` |
| `18.18` | Copie o Reference number e o Net amount da fatura e insira nos campos correspondentes no formulário de expense. Salve o registro após preencher todos os campos. | `MA` |
| `18.19` | Na aba Other data do registro de fatura/expense, acesse a pesquisa de VBD accrual. Insira o BOL (pode-se usar um BOL aleatório conforme processo) e a nomination key; clique em Execute para recuperar VBD accruals correspondentes. | `MA` |
| `18.20` | Se a linha retornada na pesquisa de accrual VBD for a única relevante e não houver outros itens a serem usados, aplique Override para permitir uso desta única linha no processo. | `ME` |
| `18.21` | No VBD selecionado, verifique se existe a data de lift (lift date) associada. Confirme que a data está correta antes de prosseguir. | `ME` |
| `18.22` | Aplique Simulate Rules (Simulate) para a operação de VBD/expense. Verifique se o sistema sinaliza 'suspected duplicate'. Caso o sistema não apresente suspeitas, prosseguir para upload. | `ME` |
| `18.23` | Faça o upload do arquivo/planilha (exportado do Fiori) que contém todas as linhas destacadas para processamento no ambiente VIM/T4, conforme o passo anterior. | `ME` |
| `18.24` | No campo apropriado do registro, insira ou carregue o valor proveniente do T4 (T4 amount) que representa o montante de entrega a ser conciliado com a fatura. | `ME` |
| `18.25` | Depois do upload, atualize/refresh a vista de VIM Analytics para verificar se há suspected invoices. Identifique as linhas marcadas com ATA (se aplicável). | `MS` |
| `18.26` | Ordene/filtre os resultados para localizar somente as opções ATA, PIPELINE e TPL. Para as linhas relevantes (por ex.: Amarillo‑tucumcari‑albuquerque‑loss allowance), copie os registros necessários para processamento posterior. | `ME` |
| `18.27` | Copie o número de VBD necessário dos resultados filtrados e use este VBD na pesquisa de accrual VBD (Search Accrual VBD) para localizar o accrual correspondente. | `MA` |
| `18.28` | No formulário de Accrual VBD, clique no campo Accrual VBD number, cole o número do VBD copiado e clique em Execute para recuperar o registro. | `ME` |
| `18.29` | Se necessário, aplique override nas linhas apresentadas (por ex.: ATA). Utilize a segunda planilha exportada do Fiori para processar os registros adicionais: copie nomination keys, cole nos campos correspondentes, clique em Execute para carregar os dados e retornar às Line Items para salvar as diferenças. Depois, crie expenses adicionais quando existir diferença e salve as alterações. | `MA` |
| `18.30` | Execute Simulate Rules novamente, aplique as regras (Apply Rules) e depois atualize/refresh o VIM Analytics para identificar quaisquer suspected invoices ou alterações de status geradas pelo processamento. | `ME` |
| `18.31` | Monitore o status da fatura processada; se o status mudar para 'Posted' durante o processamento, clique em Refresh no VIM Analytics para confirmar o novo status e encerrar a verificação. | `ME` |

### Step 19 — Processamento de Faturas Gain & Loss — classificação, atribuição de GL/Company/Profit Center e envio para aprovações

- **step_id:** `step_19`
- **macroetapa:** Routing (`roteamento`)
- **source_step_ref:** `19`
- **descrição breve:** Procedimento executável para identificar, classificar e preparar faturas Gain & Loss no VIM Workplace, preencher os campos obrigatórios (document type, vendor, requester email, GL account, company code e profit center conforme região) e encaminhar para o fluxo de aprovações (duas camadas; envio para Gina na segunda etapa).
- **classificação consolidada:** `MS + MA`
- **solução tecnológica:** `Workflow`
- **por que foi selecionada:** Classificação, atribuição contábil e aprovação exigem encaminhamento, alçada e validação de múltiplas informações.
- **esforço:** `Alto` — estimativa relativa baseada na quantidade de sistemas, dependências, transações sensíveis, reconciliações e decisões observadas.
- **human_control:** `approval_required` — revisão humana permanece necessária para dados, exceções, aprovações e/ou transações financeiras.
- **evidence_status:** `evidenced` para a atividade atual; `needs_validation` para solução, esforço e viabilidade técnica.
- **sub-steps:** 36 registros preservados da SOP.

| Sub-step | Descrição | Classificação individual |
|---|---|---|
| `19.1` | Abrir o VIM Workplace e filtrar/ordenar as faturas para identificar as faturas classificadas como Gain & Loss. | `ME` |
| `19.1.1` | No VIM Workplace, aplicar filtro ou ordenar por: Document Type, Invoice Description e/ou Tag que identifique 'Gain & Loss' para trazer somente as faturas deste escopo. | `ME` |
| `19.1.2` | Para cada fatura listada como Gain & Loss, abrir o registro da fatura para edição dos campos necessários descritos nos passos seguintes. | `ME` |
| `19.2` | Atualizar os campos de cabeçalho da fatura diretamente no VIM Workplace conforme os dados apresentados na cópia da fatura. | `ME` |
| `19.2.1` | Se a fatura estiver associada ao processamento Gain & Loss, definir o campo 'Document Type' para 'Non-Po Manual' conforme instrução. | `ME` |
| `19.2.2` | Atualizar o campo 'Vendor Number' com o número do fornecedor que consta na cópia da fatura. | `ME` |
| `19.2.3` | Preencher o campo 'Requester Email' com o e-mail do solicitante constante na fatura. | `MS` |
| `19.3` | Ir para a aba/área de Line Items da fatura para inserir os dados contábeis por linha conforme instruções específicas de GL, Company Code e Profit Center. | `ME` |
| `19.3.1` | Localizar a(s) linha(s) que representam o ganho/ perda e selecionar a linha para edição dos campos: GL Account, Company Code e Profit Center. | `ME` |
| `19.4` | Identificar a região aplicável (East Coast, Gulf Coast, Midcontinent, West Coast) com base na descrição da fatura e nos mapas associados. Controle: Aprovação em dois níveis obrigatória: Todas as faturas Gain & Loss devem passar por dois níveis de aprovação antes do sistema postar a fatura. | `MS` |
| `Decisão` | Decisão: Qual região é indicada pela descrição da fatura? Analisar o campo 'Invoice description' e comparar com o mapa de regiões fornecido na documentação/na própria fatura. East Coast → 19.5 · Para faturas classificadas como East Coast, preencher os campos GL Account, Company Code e Profit Center na(s) linha(s) da fatura conforme o mapa/regra de região. Gulf Coast → 19.6 · Para faturas classificadas como Gulf Coast, preencher GL Account, Company Code e Profit Center conforme o mapa/regra regional. Midcontinent → 19.7 · Para faturas classificadas como Midcontinent, preencher GL Account, Company Code e Profit Center conforme o mapa/regra regional. West Coast → 19.8 · Para faturas classificadas como West Coast, preencher GL Account, Company Code e Profit Center conforme o mapa/regra regional. | `MS` |
| `19.5` | Para faturas classificadas como East Coast, preencher os campos GL Account, Company Code e Profit Center na(s) linha(s) da fatura conforme o mapa/regra de região. Controle: Aprovação em dois níveis obrigatória: Todas as faturas Gain & Loss devem passar por dois níveis de aprovação antes do sistema postar a fatura. | `MS` |
| `19.5.1` | No campo 'GL Account', inserir o código GL correspondente à natureza do ganho/perda conforme orientação regional (consultar mapa). | `MA` |
| `19.5.2` | No campo 'Company Code', inserir o código da companhia indicada na fatura. | `ME` |
| `19.5.3` | No campo 'Profit Center', inserir o Profit Center correspondente à East Coast conforme o mapa/regra. Controle: Aprovação em dois níveis obrigatória: Todas as faturas Gain & Loss devem passar por dois níveis de aprovação antes do sistema postar a fatura. | `MA` |
| `19.6` | Para faturas classificadas como Gulf Coast, preencher GL Account, Company Code e Profit Center conforme o mapa/regra regional. Controle: Aprovação em dois níveis obrigatória: Todas as faturas Gain & Loss devem passar por dois níveis de aprovação antes do sistema postar a fatura. | `MS` |
| `19.6.1` | Preencher 'GL Account' de acordo com a natureza do débito/crédito na fatura. | `ME` |
| `19.6.2` | Preencher 'Company Code' conforme indicado na fatura. | `ME` |
| `19.6.3` | Preencher 'Profit Center' para Gulf Coast conforme mapa/regra. Controle: Aprovação em dois níveis obrigatória: Todas as faturas Gain & Loss devem passar por dois níveis de aprovação antes do sistema postar a fatura. | `MS` |
| `19.7` | Para faturas classificadas como Midcontinent, preencher GL Account, Company Code e Profit Center conforme o mapa/regra regional. Controle: Aprovação em dois níveis obrigatória: Todas as faturas Gain & Loss devem passar por dois níveis de aprovação antes do sistema postar a fatura. | `MS` |
| `19.7.1` | Preencher 'GL Account' conforme a natureza do ganho/perda. | `ME` |
| `19.7.2` | Preencher 'Company Code' conforme a fatura. | `ME` |
| `19.7.3` | Preencher 'Profit Center' para Midcontinent conforme mapa/regra. Controle: Aprovação em dois níveis obrigatória: Todas as faturas Gain & Loss devem passar por dois níveis de aprovação antes do sistema postar a fatura. | `MS` |
| `19.8` | Para faturas classificadas como West Coast, preencher GL Account, Company Code e Profit Center conforme o mapa/regra regional. Controle: Aprovação em dois níveis obrigatória: Todas as faturas Gain & Loss devem passar por dois níveis de aprovação antes do sistema postar a fatura. | `MS` |
| `19.8.1` | Preencher 'GL Account' conforme o tipo de transação indicado na fatura. | `ME` |
| `19.8.2` | Preencher 'Company Code' conforme a fatura. | `ME` |
| `19.8.3` | Preencher 'Profit Center' para West Coast conforme mapa/regra. Controle: Aprovação em dois níveis obrigatória: Todas as faturas Gain & Loss devem passar por dois níveis de aprovação antes do sistema postar a fatura. | `MS` |
| `19.9` | Após preencher cabeçalho e line items, executar a sequência: Salvar → Simular rules → Apply rules para validar as regras automáticas do VIM. | `ME` |
| `19.9.1` | Clicar/selecionar 'Save' para persistir as alterações da fatura no VIM. | `ME` |
| `19.9.2` | Executar 'Simulate rules' para validar o comportamento das regras configuradas sobre a fatura (simulação pré-aplicação). | `ME` |
| `19.9.3` | Executar 'Apply rules' para efetivar as regras que irão definir roteamento e possíveis campos automáticos. | `ME` |
| `19.10` | Após aplicar regras, registrar sua aprovação na fatura (primeiro nível). | `MS` |
| `19.10.1` | No VIM, selecionar a opção para registrar sua aprovação/autoridade na fatura (marcar/selecionar 'approve' ou preencher campo de aprovação conforme a interface disponível). | `MS` |
| `19.11` | Encaminhar a fatura para a aprovação da Gina conforme procedimento: enviar para Gina após ter registrado sua aprovação. Controle: Aprovação em dois níveis obrigatória: Todas as faturas Gain & Loss devem passar por dois níveis de aprovação antes do sistema postar a fatura. Encaminhamento para Gina: Depois de registrar sua aprovação (nível 1), encaminhar a fatura para Gina para o segundo nível de aprovação. · Gina | `MS` |
| `19.11.1` | Após registrar sua aprovação, selecionar a ação de encaminhamento/submit que envia a fatura para a aprovação seguinte e/ou colocar Gina como aprovadora responsável conforme o fluxo indicado. | `MS` |
| `19.12` | Observação: todo processo Gain & Loss passa por duas camadas de aprovação. Depois que as aprovações forem concluídas (nível 1 e nível 2 — Gina), a fatura será automaticamente posta pelo sistema conforme o fluxo padrão. | `MS` |

### Step 20 — Processo 999+ (Analista) — gerar relatório 999, preparar arquivo e submeter para execução em background

- **step_id:** `step_20`
- **macroetapa:** Execution (`execucao`)
- **source_step_ref:** `20`
- **descrição breve:** Executar a rotina 999+ para associar VBDs ao invoice quando o número de VBDs excede o limite exibido em SAP; preparar arquivos, solicitar execução, acompanhar job em background, consolidar resultados e notificar partes interessadas.
- **classificação consolidada:** `ME + MS`
- **solução tecnológica:** `RPA / Planilha`
- **por que foi selecionada:** A rotina 999+ usa relatório, arquivo e execução em background, com regras relativamente estruturadas.
- **esforço:** `Médio` — estimativa relativa baseada na quantidade de sistemas, dependências, transações sensíveis, reconciliações e decisões observadas.
- **human_control:** `review_required` — revisão humana permanece necessária para dados, exceções, aprovações e/ou transações financeiras.
- **evidence_status:** `evidenced` para a atividade atual; `needs_validation` para solução, esforço e viabilidade técnica.
- **sub-steps:** 37 registros preservados da SOP.

| Sub-step | Descrição | Classificação individual |
|---|---|---|
| `20.1` | Registrar a solicitação enviada pelo analista que pede a execução dos relatórios 999 e que gerará arquivo entregue via e-mail para o processador. Salvar anexo em pasta do sistema: Salvar o arquivo/anexo recebido do analista em uma pasta do sistema para referência e auditoria. | `MA` |
| `20.1.1` | Salvar o arquivo/anexo recebido na caixa de correio pessoal em uma pasta do sistema para referência e processamento posterior. Salvar anexo em pasta do sistema: Salvar o arquivo/anexo recebido do analista em uma pasta do sistema para referência e auditoria. | `MA` |
| `20.1.2` | Abrir a cópia do invoice e verificar: Vendor Name e Vendor Number, Invoice Number, Invoice Amount, Payment Terms e Due Date; registrar observações no tracker. | `ME` |
| `20.2` | Construir o corpo do e-mail com os campos exigidos para a execução 999 conforme recebido: Vendor no, Company Code, Profit Centre, Invoice No, Document No, GL Account, Invoice Amount; manter rascunho para envio após coleta de demais dados. Formato do e‑mail para solicitação 999: Incluir '999' no assunto seguido de Vendor Name e Invoice/Reference No; enviar 'Para' o Generic Mail ID 'Secondary Post/Clear & Vendor modifications' e colocar em 'Cc' o analista originador. | `MA` |
| `20.3` | Criar ou atualizar um arquivo Excel de controle contendo as informações do invoice e o histórico de ações (coluna Comments) para acompanhamento do processo 999+. | `ME` |
| `20.4` | No SAP, abrir a transação ZEWB (Custom Trading Expense Workbench) e selecionar a opção 'Accrual/Receivable VBD Docs'. Preencher os parâmetros de busca: Vendor Number (conforme e-mail ou vendor list) e Transaction Date (conforme invoice). | `ME` |
| `20.5` | Executar a pesquisa no ZEWB; exportar o resultado para Excel; salvar o arquivo extraído no sistema na mesma pasta usada para os documentos do caso. | `ME` |
| `20.6` | Abrir o arquivo Excel recebido do analista (passo inicial) e copiar todos os VBD Numbers (itens 5999-line items) para uso no passo seguinte. | `MA` |
| `20.6.1` | Abrir o arquivo Excel salvo e localizar a coluna com os VBD Numbers; preparar para cópia. | `ME` |
| `20.6.2` | Selecionar todas as células que contêm os VBD Numbers e copiar (Colar em coluna A de um arquivo de trabalho se necessário). | `ME` |
| `20.7` | No SAP, executar a transação ZRTR_VIM_999 (ZRTR_VIM_999 – VIM Posting 999) para preparar o posting dos VBDs copiados. | `ME` |
| `20.8` | Na tela ZRTR_VIM_999: acessar o campo 'Accrual VBD Number' (clicar na seta para lista quando houver muitos VBDs), colar todos os VBDs copiados e clicar em Execute. A execução salva a operação e retorna à página anterior. | `ME` |
| `20.9` | Clicar em 'Show Document selection' para visualizar todos os VBDs disponíveis a partir da execução; aguardar a geração completa do relatório. | `ME` |
| `20.10` | Atualizar o rascunho de e-mail com as informações geradas: incluir '999' no assunto juntamente com Vendor Name & Invoice/Reference No; colocar o Generic Mail ID 'Secondary Post/Clear & Vendor modifications' no campo Para e em Cc o analista que originou a solicitação; colar o texto do modelo da região apropriada (ex.: MIDCON) e anexar a cópia do invoice, invoice reference number, net due date e total payout amount. Formato do e‑mail para solicitação 999: Incluir '999' no assunto seguido de Vendor Name e Invoice/Reference No; enviar 'Para' o Generic Mail ID 'Secondary Post/Clear & Vendor modifications' e colocar em 'Cc' o analista originador. | `MA` |
| `20.11` | Comparar o número total de VBDs enviados (ex.: 5996) com os VBDs retornados pela execução (ex.: 5879). Registrar no tracker os VBDs ausentes e possíveis razões (used, cancelled, blocked). | `MA` |
| `20.12` | No menu Program, selecionar 'Execute in Background'; no pop-up de Output Device informar 'LOCL' e clicar em Properties. Definição do Output Device: Informar 'LOCL' no campo Output Device ao executar em background conforme procedimento. | `ME` |
| `20.12.1` | Verificar e confirmar as informações na tela de propriedades e confirmar (Tick). Definição do Output Device: Informar 'LOCL' no campo Output Device ao executar em background conforme procedimento. | `ME` |
| `20.13` | Na área 'Output Options' acessar Priority, alterar de 'Medium' para 'High' (Print Priority - High) e confirmar (Tick). Prioridade do job: Alterar a prioridade do job de 'Medium' para 'High' (Print Priority - High) antes de salvar a execução em background. | `ME` |
| `20.14` | Confirmar os parâmetros mostrados; ao clicar no Tick, será mostrado o painel Start time. Selecionar 'Immediate' e salvar para submeter o job em background. | `ME` |
| `20.14.1` | Na tela Start time escolher 'Immediate' e clicar em Save para que o processamento inicie em background. | `ME` |
| `20.15` | Marcar no arquivo de controle (tracker) a linha correspondente com o status '999 run'. Anexar ao rascunho de e‑mail o Excel com a lista completa de VBDs que foi recebida do analista (entrada original). | `MA` |
| `20.15.1` | Editar a coluna 'Comments' ou 'Status' no tracker para indicar que o job 999 está em execução. | `ME` |
| `20.15.2` | Anexar o arquivo Excel contendo os VBDs ao rascunho do e‑mail preparado anteriormente. | `ME` |
| `20.16` | Após submeter o job em background (pode levar horas), abrir a transação FBL1N – Vendor Line items; informar Vendor Code e gerar o relatório. | `ME` |
| `20.16.1` | No SAP, executar T.Code 'FBL1N', inserir o Vendor Code e clicar no botão de execução para gerar os line items. | `ME` |
| `20.17` | No resultado do FBL1N acessar Layout e selecionar o layout 'E Block 999' como padrão; garantir que o campo 'Payment Block' esteja disponível e filtrar por 'E' para identificar itens com bloqueio E. | `ME` |
| `20.18` | Acessar a transação ZRTR_VIM_E_FI_SUMRIZ (FI Summarization). Inserir Posting Date (data em que iniciou a execução 999+) e Vendor No; submeter o programa via 'Execute in Background'. | `ME` |
| `20.19` | No pop-up de Output Device inserir 'LOCL', clicar Properties, verificar informações e confirmar; em Output Options alterar Priority para 'High' e confirmar; em Start time escolher 'Immediate' e salvar para execução em background. Definição do Output Device: Informar 'LOCL' no campo Output Device ao executar em background conforme procedimento. Prioridade do job: Alterar a prioridade do job de 'Medium' para 'High' (Print Priority - High) antes de salvar a execução em background. | `ME` |
| `20.20` | Aguardar alguns minutos (normalmente 5–10; para execuções grandes até ~4 horas conforme volume) até que o job finalize; durante esse tempo atualizar o tracker com comentários de progresso. | `ME` |
| `20.21` | Voltar ao workplace SAP, selecionar o layout da ferramenta de Summarization e usar List -> Refresh para carregar o resultado; se apenas parte estiver processada, repetir refresh até completar. | `ME` |
| `20.22` | Confirmar se a Summarization Tool exibiu todos os itens esperados e se o processo foi concluído. | `MS` |
| `Decisão` | Decisão: A sumarização exibiu todos os VBDs esperados e relatório está completo? A Summarization Tool, após Refresh, mostra todas as linhas VBD correspondentes e não indica processamento pendente. Sim — sumarização completa → 20.23 · Comparar o valor total do invoice com o total apresentado pelo Summarization Report; calcular a diferença (ex.: Invoice $98,195.77 menos SAP $97,004.91 = $1,190.86) e registrar o valor adicional em planilha e rascunho de e-mail. Não — ainda incompleta → 20.20 · Aguardar alguns minutos (normalmente 5–10; para execuções grandes até ~4 horas conforme volume) até que o job finalize; durante esse tempo atualizar o tracker com comentários de progresso. | `MS` |
| `20.23` | Comparar o valor total do invoice com o total apresentado pelo Summarization Report; calcular a diferença (ex.: Invoice $98,195.77 menos SAP $97,004.91 = $1,190.86) e registrar o valor adicional em planilha e rascunho de e-mail. | `MA` |
| `20.24` | Do Summarization Report copiar todos os Document Nos gerados; atualizar o rascunho do e‑mail adicionando o 'additional amount' (diferença apurada) e a lista de Document Nos; revisar e enviar o e‑mail ao Generic Mail ID (Secondary Post/Clear & Vendor modifications) com Cc ao analista originador. Formato do e‑mail para solicitação 999: Incluir '999' no assunto seguido de Vendor Name e Invoice/Reference No; enviar 'Para' o Generic Mail ID 'Secondary Post/Clear & Vendor modifications' e colocar em 'Cc' o analista originador. | `MA` |
| `20.24.1` | Selecionar e copiar todos os Document Nos apresentados no Summarization Report para inclusão no e‑mail. | `ME` |
| `20.24.2` | Adicionar no corpo do e‑mail o valor adicional, a lista de Document Nos e qualquer atualização relevante do tracker; enviar o e‑mail conforme destinatários padronizados. Formato do e‑mail para solicitação 999: Incluir '999' no assunto seguido de Vendor Name e Invoice/Reference No; enviar 'Para' o Generic Mail ID 'Secondary Post/Clear & Vendor modifications' e colocar em 'Cc' o analista originador. | `MA` |
| `20.25` | Aguardar retorno do P66 Team; quando receberem e processarem o pagamento, o time enviará por reply o Document No final consolidado. Verificar a resposta, confirmar os detalhes e marcar no tracker que o pagamento do vendor foi realizado. | `ME` |

### Step 21 — Processo 999+ (Supervisor) — Postagem, Clear Vendor e Ajustes (F-44 e controle de Due/Baseline Date)

- **step_id:** `step_21`
- **macroetapa:** Execution (`execucao`)
- **source_step_ref:** `21`
- **descrição breve:** Sequência executável para o Supervisor realizar o clear vendor via F-44, ajustar lançamentos (charge off), inserir chaves e códigos, confirmar lançamentos e alterar Due Date / Baseline Date conforme dados fornecidos pelo Analyst.
- **classificação consolidada:** `MS`
- **solução tecnológica:** `Workflow`
- **por que foi selecionada:** Postagem, clearing e ajustes financeiros são transações sensíveis e devem manter controle e aprovação humana.
- **esforço:** `Alto` — estimativa relativa baseada na quantidade de sistemas, dependências, transações sensíveis, reconciliações e decisões observadas.
- **human_control:** `review_required` — revisão humana permanece necessária para dados, exceções, aprovações e/ou transações financeiras.
- **evidence_status:** `evidenced` para a atividade atual; `needs_validation` para solução, esforço e viabilidade técnica.
- **sub-steps:** 30 registros preservados da SOP.

| Sub-step | Descrição | Classificação individual |
|---|---|---|
| `21.1` | Abrir a mensagem recebida do Analyst que contém a invoice para upload 999 VBD e extrair os campos obrigatórios: vendor number, document number, company code e indicação de write off (se aplicável). Salvar anexos localmente para referência. Controle: campos obrigatórios no e-mail do Analyst: O e-mail do Analyst deve conter, no corpo ou em anexo, os seguintes campos: Vendor number, Document number, Company code e indicação sobre write off adicional. Sem esses campos não prossiga com F-44. | `ME` |
| `21.1.1` | Abrir o e-mail do Analyst, salvar o anexo da invoice em pasta de trabalho local e confirmar que o anexo corresponde ao documento referenciado na mensagem. | `MA` |
| `21.1.2` | Copiar do corpo do e-mail ou do anexo os seguintes campos exatamente como enviados: Vendor number, Document number, Company code e informação sobre write off adicional. Registrar em planilha de controle ou sistema interno usado pelo time. | `ME` |
| `21.2` | Acessar o SAP com credenciais do Supervisor e chamar a transação F-44 (Clear Vendor). Inserir o Account (número de conta/fornecedor) conforme o campo 'vendor number' recebido no e-mail. | `ME` |
| `21.2.1` | Efetuar login no SAP e executar a transação digitando F-44 na barra de comandos. Confirmar que a tela de Clear Vendor foi carregada. | `ME` |
| `21.2.2` | No campo Account da tela F-44, inserir o vendor/account number exatamente como informado no e-mail e avançar (Enter) para carregar os line items do fornecedor. | `ME` |
| `21.3` | Após carregar os line items do fornecedor, localizar o line item relacionado ao Document number informado e marcar a opção para 'Charge off difference'. | `ME` |
| `21.3.1` | Localizar na lista o line item que contém o Document number recebido do Analyst. Selecionar esse line item para edição. | `ME` |
| `21.3.2` | Com o line item selecionado, ativar/selecionar a opção 'Charge off difference' para habilitar o lançamento de diferença (charge off). | `ME` |
| `21.4` | Na linha de ajustes após ativar charge off, selecionar a Posting Key necessária e preencher o campo Account com o vendor number conforme instruído. Confirmar com Enter para aplicar os valores provisórios. | `ME` |
| `21.4.1` | Escolher a Posting Key apropriada para o tipo de ajuste (conforme instrução interna) no campo Posting Key da linha de ajuste. | `ME` |
| `21.4.2` | No campo Account da linha de ajuste, inserir o Vendor number fornecido e pressionar Enter para validar a entrada. | `ME` |
| `21.5` | Inserir o Amount de ajuste exatamente conforme informado pelo Analyst. Após preencher, clicar em 'Process open items' para que o sistema calcule o balanço. Exceção: totais não balanceados após 'Process open items': Condição: Após 'Process open items' o NET não está em 0.. Ações: Selecionar novamente 'Charge off difference'.; Revisar e ajustar o Amount inserido e as Posting Keys.; Reexecutar 'Process open items'.. Resultado: 21.3 · Após carregar os line items do fornecedor, localizar o line item relacionado ao Document number informado e marcar a opção para 'Charge off difference'. | `ME` |
| `21.5.1` | Inserir no campo Amount o valor do ajuste informado no e-mail do Analyst. | `ME` |
| `21.5.2` | Clicar em 'Process open items' para que o SAP avalie o balanço do lançamento. | `ME` |
| `21.6` | Avaliar o resultado do 'Process open items' para confirmar balanceamento do lançamento. Exceção: totais não balanceados após 'Process open items': Condição: Após 'Process open items' o NET não está em 0.. Ações: Selecionar novamente 'Charge off difference'.; Revisar e ajustar o Amount inserido e as Posting Keys.; Reexecutar 'Process open items'.. Resultado: 21.3 · Após carregar os line items do fornecedor, localizar o line item relacionado ao Document number informado e marcar a opção para 'Charge off difference'. | `MS` |
| `Decisão` | Decisão: Os totais apresentados estão balanceados (NET = 0)? O campo NET ou Total do documento exibido após processar open items deve ser igual a 0 (zero). Sim — prosseguir para inserir posting keys e tax code → 21.7 · Selecionar a Posting Key final conforme necessidade, preencher o Account com o vendor number, inserir o Amount que será ajustado, informar o Tax Code (por exemplo IO se aplicável) e demais campos obrigatórios (ex.: centro de custo/profit center). Não — ajustar usando 'Charge off difference' e reprocessar → 21.3 · Após carregar os line items do fornecedor, localizar o line item relacionado ao Document number informado e marcar a opção para 'Charge off difference'. | `MS` |
| `21.7` | Selecionar a Posting Key final conforme necessidade, preencher o Account com o vendor number, inserir o Amount que será ajustado, informar o Tax Code (por exemplo IO se aplicável) e demais campos obrigatórios (ex.: centro de custo/profit center). Controle: tax code e profit center conforme Analyst: O Tax Code (ex.: IO) e o Profit Center devem ser inseridos exatamente como fornecidos pelo Analyst antes de salvar o lançamento. | `ME` |
| `21.7.1` | No campo Tax Code informar o código fornecido (ex.: IO) conforme instrução do Analyst. | `ME` |
| `21.7.2` | Revisar posting key, vendor number, amount e tax code; pressionar Enter para aplicar. | `ME` |
| `21.8` | Inserir o Profit Center informado pelo Analyst e verificar se o NET do documento passou a 0 após ajustes. Controle: tax code e profit center conforme Analyst: O Tax Code (ex.: IO) e o Profit Center devem ser inseridos exatamente como fornecidos pelo Analyst antes de salvar o lançamento. | `MS` |
| `Decisão` | Decisão: O NET do documento está igual a 0 após inserção do Profit Center? Campo NET exibido no cabeçalho/total do documento deve ser 0 (zero) após o lançamento do Profit Center. Sim — continuar para verificação em FBL1N → 21.9 · Abrir a transação FBL1N, inserir o vendor/account e executar a exibição. Localizar o documento pelo Document number e confirmar que o total e o status correspondem ao que foi postado. Não — retornar para ajustar posting keys / amounts → 21.7 · Selecionar a Posting Key final conforme necessidade, preencher o Account com o vendor number, inserir o Amount que será ajustado, informar o Tax Code (por exemplo IO se aplicável) e demais campos obrigatórios (ex.: centro de custo/profit center). | `MS` |
| `21.9` | Abrir a transação FBL1N, inserir o vendor/account e executar a exibição. Localizar o documento pelo Document number e confirmar que o total e o status correspondem ao que foi postado. | `MA` |
| `21.9.1` | Acessar FBL1N, informar o vendor/account e executar a visualização para listar line items. | `ME` |
| `21.9.2` | Localizar o Document number e confirmar que o valor total exibido na listagem é igual ao informado pelo Analyst e que o documento está com status postado. | `ME` |
| `21.10` | Abrir a função Change and Display no documento postado para alterar o Due Date conforme instrução do Analyst e ajustar o Baseline Date para a posting date informada. Validar a regra de prazo indicada pelo Analyst (Baseline Date deve ser anterior em até 14 dias — ver unknown). Salvar as alterações. Incógnita: interpretação exata da regra 'before 14 days' para Baseline Date: A regra indicada na fonte diz: 'the date should be before 14 days for the date to be posted.' A interpretação aplicada deve ser confirmada com o Analyst se houver dúvida sobre qual data comparar (posting date vs. due date) ou se a janela é estritamente '<= 14 dias'. | `MA` |
| `21.10.1` | No SAP, abrir o documento em modo Change/Display (Change) que permita edição de Due Date e Baseline Date. | `ME` |
| `21.10.2` | Alterar o campo Due Date para o valor informado pelo Analyst. Ajustar o Baseline Date para a posting date indicada pelo Analyst. Salvar as alterações. | `ME` |
| `21.11` | Avaliar se o Baseline Date definido atende à restrição indicada pelo Analyst (ver nota de fonte). Incógnita: interpretação exata da regra 'before 14 days' para Baseline Date: A regra indicada na fonte diz: 'the date should be before 14 days for the date to be posted.' A interpretação aplicada deve ser confirmada com o Analyst se houver dúvida sobre qual data comparar (posting date vs. due date) ou se a janela é estritamente '<= 14 dias'. | `MA` |
| `Decisão` | Decisão: O Baseline Date ajustado está dentro da janela exigida (anterior em até 14 dias à posting date conforme instrução)? Comparar Baseline Date ajustado com a posting date fornecida pelo Analyst; a diferença não deve exceder 14 dias conforme informação disponível no e-mail do Analyst. Sim — salvar e concluir handoff para Analyst → Posting e clear do fornecedor concluídos; alterações de Due/Baseline salvas; enviar confirmação ao Analyst para verificação e marcação de pagamento. Não — ajustar Baseline Date conforme instrução e repetir verificação → 21.10 · Abrir a função Change and Display no documento postado para alterar o Due Date conforme instrução do Analyst e ajustar o Baseline Date para a posting date informada. Validar a regra de prazo indicada pelo Analyst (Baseline Date deve ser anterior em até 14 dias — ver unknown). Salvar as alterações. | `MS` |

### Step 22 — Processamento DCP Front Range Transportation — extração do Nomination Key (NK) via Fiori e geração/tratamento de VBD para transport system USDCPPFTRG

- **step_id:** `step_22`
- **macroetapa:** Execution (`execucao`)
- **source_step_ref:** `22`
- **descrição breve:** Procedimento para localizar o Nom Key (NK) nas faturas do fornecedor Front Range Pipeline LLC usando SAP Fiori, gerar ou reconciliar o VBD conforme codificação para o transport system USDCPPFTRG, capturar evidências e proceder com o processamento da fatura.
- **classificação consolidada:** `ME + MS`
- **solução tecnológica:** `RPA`
- **por que foi selecionada:** A extração de NK e geração de VBD são estruturadas, mas dependem de informações do caso e conferência de resultado.
- **esforço:** `Alto` — estimativa relativa baseada na quantidade de sistemas, dependências, transações sensíveis, reconciliações e decisões observadas.
- **human_control:** `review_required` — revisão humana permanece necessária para dados, exceções, aprovações e/ou transações financeiras.
- **evidence_status:** `evidenced` para a atividade atual; `needs_validation` para solução, esforço e viabilidade técnica.
- **sub-steps:** 22 registros preservados da SOP.

| Sub-step | Descrição | Classificação individual |
|---|---|---|
| `22.1` | Preparar ambiente e acessar o SAP Fiori para iniciar a localização do Nom Key. | `ME` |
| `22.1.1` | Confirme que a fatura a ser processada pertence a Front Range Pipeline LLC e que o caso refere-se ao transport system USDCPPFTRG antes de prosseguir. | `ME` |
| `22.1.2` | Abra o SAP Fiori com suas credenciais habituais e navegue para a aplicação de consulta/visualização de invoices/nomination keys disponível no ambiente. | `ME` |
| `22.2` | No filtro/área de pesquisa da aplicação Fiori, informe a data agendada correspondente ao processamento e selecione o transport system USDCPPFTRG para limitar os resultados. | `MA` |
| `22.2.1` | Digite a scheduled date (data agendada) exatamente como consta no arquivo ou na notificação do scheduler para filtrar as faturas relacionadas a esse dia. | `ME` |
| `22.2.2` | No campo de seleção do sistema de transporte, escolha/insira USDCPPFTRG para restringir a busca às movimentações processadas por esse transport system. | `ME` |
| `22.3` | Aplicar filtro/coluna de origem e localizar o Nomination Key (NK) associado à linha da fatura conforme o campo 'origin'. | `ME` |
| `22.3.1` | Use o campo origin/Origem na visualização para limitar os registros àquele ponto de origem indicado na fatura. | `ME` |
| `22.3.2` | Revise os resultados filtrados e identifique o campo Nom Key/NK correspondente à linha de invoice. Anote o NK para uso na geração/associação do VBD. | `MA` |
| `22.4` | Capturar screenshot do line-item que contém o Nom Key e demais dados relevantes e enviar ao analista como confirmação da localização do NK. Requisito de evidência do line-item e ajuste: A captura de tela deve mostrar claramente o número da fatura, o line-item, o Nom Key identificado e os valores antes/depois de qualquer ajuste; essas imagens devem ser anexadas à confirmação enviada ao analista. | `MA` |
| `22.4.1` | Tire uma captura de tela que inclua, no mínimo, o número da fatura, o line-item, o Nom Key identificado e os campos de origem e valor visíveis. Requisito de evidência do line-item e ajuste: A captura de tela deve mostrar claramente o número da fatura, o line-item, o Nom Key identificado e os valores antes/depois de qualquer ajuste; essas imagens devem ser anexadas à confirmação enviada ao analista. | `MA` |
| `22.4.2` | Anexe o screenshot ao e-mail de confirmação ao analista responsável indicando o Nom Key localizado e prossiga após confirmação do analista, conforme instruído. | `MA` |
| `22.5` | Com o Nom Key identificado e a codificação aplicada segundo a origem, gere o VBD necessário para o processamento da fatura ou associe o NK ao VBD já existente. Tratamento de storage invoices com VBD auto‑fired: Se a fatura pertencer a storage invoices (nota de armazenamento), reconheça que o item pode ter VBD auto‑fired; neste caso, valide a presença do VBD auto‑fired antes de gerar VBD manual. | `ME` |
| `22.5.1` | Avalie se já existe um VBD auto‑fired para o item; se não existir, proceda para geração do VBD manual conforme a codificação aplicável ao origin/NK. Tratamento de storage invoices com VBD auto‑fired: Se a fatura pertencer a storage invoices (nota de armazenamento), reconheça que o item pode ter VBD auto‑fired; neste caso, valide a presença do VBD auto‑fired antes de gerar VBD manual. | `ME` |
| `22.5.2` | Gere o VBD manualmente ou associe o NK ao VBD existente seguindo a codificação (trip/non‑trip ou outra codificação aplicável) indicada na fatura. | `ME` |
| `22.6` | Comparar o valor cobrado na fatura com o valor do VBD associado/gerado e decidir o tratamento segundo a tolerância estabelecida. Procedimento para discrepância fora da tolerância: Quando a diferença entre a fatura e o VBD estiver fora da tolerância estabelecida · Pendente — procedimento de escalonamento não detalhado neste trecho | `MA` |
| `Decisão` | Decisão: A diferença entre o valor da fatura e o valor do VBD está dentro da tolerância estabelecida? Comparar a discrepância observada com a 'tolerância estabelecida' aplicável ao tipo de movimentação (valor/documentação), conforme definida no procedimento operacional para Front Range (tolerância documentada internamente). Sim — dentro da tolerância → 22.7 · Quando a discrepância for considerada dentro da tolerância, ajustar o valor da fatura para coincidir com o valor do VBD e registrar evidência do ajuste. Não — fora da tolerância → Informações pendentes | `MS` |
| `22.7` | Quando a discrepância for considerada dentro da tolerância, ajustar o valor da fatura para coincidir com o valor do VBD e registrar evidência do ajuste. | `MA` |
| `22.7.1` | Ajuste o valor da fatura para refletir o valor do VBD conforme permitido pela tolerância. Execute o ajuste utilizando o procedimento de ajuste vigente na interface de processamento de invoices que você usa para este tipo de fatura. | `MA` |
| `22.7.2` | Tire screenshot(s) comprovando o valor original, o valor do VBD e o ajuste realizado; anexe estas evidências ao registro/transação da fatura. Requisito de evidência do line-item e ajuste: A captura de tela deve mostrar claramente o número da fatura, o line-item, o Nom Key identificado e os valores antes/depois de qualquer ajuste; essas imagens devem ser anexadas à confirmação enviada ao analista. | `MA` |
| `22.7.3` | Envie ao analista responsável as evidências do ajuste e uma breve confirmação de que o ajuste foi aplicado conforme tolerância. | `MA` |
| `22.8` | Após geração/associação do VBD e eventuais ajustes dentro da tolerância, prosseguir com as etapas subsequentes do processamento da fatura segundo o fluxo operacional vigente (classificação, codificação contábil e posterior posting conforme rotina do time). | `MA` |

### Step 23 — Processo completo de criação e emissão de Credit Memo (VA01 → VF01 → VFO3)

- **step_id:** `step_23`
- **macroetapa:** Execution (`execucao`)
- **source_step_ref:** `23`
- **descrição breve:** Executar todo o fluxo de rebill para crédito a partir das informações recebidas do scheduler, criando a ordem de crédito (VA01), gerando o documento de faturamento (VF01) e emitindo o output (VFO3). Cada subpasso contém as ações exatas a realizar em tela conforme os campos e popups indicados.
- **classificação consolidada:** `MS`
- **solução tecnológica:** `Workflow`
- **por que foi selecionada:** O rebill de crédito envolve transações encadeadas VA01, VF01 e VFO3 e exige controle humano antes da emissão.
- **esforço:** `Alto` — estimativa relativa baseada na quantidade de sistemas, dependências, transações sensíveis, reconciliações e decisões observadas.
- **human_control:** `review_required` — revisão humana permanece necessária para dados, exceções, aprovações e/ou transações financeiras.
- **evidence_status:** `evidenced` para a atividade atual; `needs_validation` para solução, esforço e viabilidade técnica.
- **sub-steps:** 26 registros preservados da SOP.

| Sub-step | Descrição | Classificação individual |
|---|---|---|
| `23.1` | Localize no e-mail o arquivo Excel enviado pelo scheduler contendo os dados do rebill. Abra e confirme que o arquivo anexo contém as colunas necessárias (ship-to party, billing date, pricing date, material, target quantity, plant, company code, valores/condições). Salve o arquivo localmente para referência durante a criação do credit memo. Tolerância excedida — contactar vendor: Condição: Durante o processamento do rebill for identificada diferença acima da tolerância entre o invoice e os valores/autofired VBDs.. Ações: Contactar o vendor/contraparte para solicitar carta de escalation conforme procedimento do scheduler. | `MA` |
| `23.2` | Acesse o SAP e execute o t-code VA01. Na tela de criação de sales order inicie a criação do documento de crédito conforme o arquivo recebido. | `ME` |
| `23.3` | No campo 'Order Type' insira CR (Credit Memo Creation) e pressione Enter para carregar os parâmetros iniciais do cabeçalho da ordem. | `ME` |
| `23.4` | Transfira os valores do Excel para os campos do VA01: preencher 'Ship to party' com a party indicada, preencher 'Billing date' com a data corrente (usar hoje), preencher 'Pricing date' com a data da atividade, inserir 'Material' conforme planilha, e 'Target Quantity' inserindo a quantidade alvo de uma vez. Após preencher todos os campos do cabeçalho, pressione Enter. | `ME` |
| `23.5` | Ao pressionar Enter um popup solicitará a Company Code. Substitua o exemplo 1010 pelo Company Code correto indicado pela planilha ou pelos procedimentos internos da sua área e confirme. | `MS` |
| `23.6` | Se aparecer um popup de 'Billing period', confirme os valores mostrados conforme o período indicado na planilha. Caso o popup seja limpo automaticamente, reabra o campo correspondente e reinsira o período antes de prosseguir. Reinsira Billing Period se popup for limpo: Se o popup de Billing Period for limpo automaticamente, reabra o campo de Billing Period e reinsira o período antes de prosseguir. | `MA` |
| `23.7` | Após confirmar o Billing Period, verifique que os demais campos do cabeçalho permanecem corretos. Pressione Enter para seguir para as informações de item. | `ME` |
| `23.8` | No bloco de itens, selecione a linha de item referente ao rebill. No menu superior clique 'Go to' → 'Item' → 'Shipping' para abrir os detalhes de envio do item selecionado. | `ME` |
| `23.9` | No campo 'Plant' insira o número do plant recebido do scheduler no Excel e pressione Enter para carregar os dados de planta no item. | `ME` |
| `23.10` | Navegue até a seção do Billing Document e no campo 'Payment Terms' insira N30 (Net 30) conforme instruído. Confirme a alteração. | `ME` |
| `23.11` | Abra as 'Conditions' do item e insira a condition type ZNON, informe o montante (Amount) conforme planilha e selecione a moeda USD. Salve temporariamente antes de sair da tela de condições. | `ME` |
| `23.12` | Aguarde a validação do sistema; identifique o indicador visual de 'green light' que confirma a ativação da conta. Confirme que o crédito de US$10 (conforme exemplo) foi atribuído ao item/cabeçalho. Verificação de ativação de conta e crédito aplicado: Confirme visualmente o indicador 'green light' e verifique que o crédito (ex.: US$10 no exemplo) foi atribuído corretamente no item/cabeçalho. | `MS` |
| `23.13` | Clique em 'Account Assignment' para revisar o Profit Center atribuído. Compare o Profit Center mostrado com o valor indicado no Excel. | `MA` |
| `23.13.1` | Verifique se o Profit Center exibido na tela de Account Assignment corresponde exatamente ao valor registrado na planilha do scheduler. | `MA` |
| `Decisão` | Decisão: O Profit Center exibido confere com o Profit Center indicado no Excel do scheduler? Comparação direta do código do Profit Center mostrado na tela com o código presente na planilha do scheduler. Sim — corresponde → 23.15 · Clique 'Go to' para navegar até a página de overview que apresenta o resumo dos detalhes do credit memo. Confirme que todas as informações do overview refletem as alterações feitas previamente. Não — não corresponde → 23.14 · Se o Profit Center estiver diferente do indicado, edite o campo no Account Assignment e substitua pelo Profit Center correto conforme o Excel. Salve a alteração. Após salvar, retorne à decisão 'dec-227-13' para revalidar a correspondência. | `MS` |
| `23.14` | Se o Profit Center estiver diferente do indicado, edite o campo no Account Assignment e substitua pelo Profit Center correto conforme o Excel. Salve a alteração. Após salvar, retorne à decisão 'dec-227-13' para revalidar a correspondência. | `MA` |
| `23.15` | Clique 'Go to' para navegar até a página de overview que apresenta o resumo dos detalhes do credit memo. Confirme que todas as informações do overview refletem as alterações feitas previamente. | `ME` |
| `23.16` | No overview do credit memo revise linhas, quantidades, preços e condições. Verifique cabeçalho e itens para garantir conformidade com o Excel. Quando tudo estiver correto, clique 'Save'. | `ME` |
| `23.17` | Após salvar, aguarde a notificação de criação de Sales Order. Copie o número da Sales Order gerada e registre-o no Excel de controle para uso no passo de faturamento (VF01). | `MS` |
| `23.18` | No SAP execute o t-code VF01 para criar o documento de faturamento a partir da Sales Order gerada. Prepare-se para inserir o número de entrega/ordem conforme disponível. | `ME` |
| `23.19` | No campo apropriado cole o número da Sales Order previamente copiado (ou o número de entrega correspondente) e pressione Enter para que o sistema localize os itens a serem faturados. | `MA` |
| `23.20` | Revise a visão geral de criação do billing document apresentada pelo sistema. Se todos os dados estiverem corretos, clique 'Save' para gerar o documento de faturamento. | `ME` |
| `23.21` | Após salvar, anote o número do Invoice gerado pelo sistema. Atualize o controle do rebill no Excel com o número do invoice para acompanhamento. | `ME` |
| `23.22` | Acesse o t-code VFO3 (Display Billing Document) no SAP para exibir o documento de faturamento recém-criado. | `ME` |
| `23.23` | No campo 'Invoice Number' insira o número do invoice que você registrou no passo anterior e pressione Enter para carregar o billing document na tela. | `ME` |
| `23.24` | Com o billing document carregado, selecione o menu 'Billing document' e escolha a função 'Issue output To' para gerar o output do invoice (impressão/envio conforme configuração do sistema). Confirme a execução da emissão de output e capture evidência (por exemplo, registro do status de output ou número de spool). | `ME` |

### Step 24 — Rebill — Processo de Debit Memo (ZEWB: criação do VBD, geração de output e envio ao Scheduler)

- **step_id:** `step_24`
- **macroetapa:** Execution (`execucao`)
- **source_step_ref:** `24`
- **descrição breve:** Procedimento operacional para criar um Debit Memo em ZEWB (Custom Trading Expense Workbench), gerar o output (print preview/PDF) e devolver o arquivo ao Scheduler. Executar as etapas na ordem apresentada; usar a seção alternativa se o Scheduler não souber o número do cliente.
- **classificação consolidada:** `MS`
- **solução tecnológica:** `Workflow`
- **por que foi selecionada:** O debit memo depende de VBD, geração de output e comunicação ao Scheduler; workflow ajuda a controlar estados e aprovações.
- **esforço:** `Alto` — estimativa relativa baseada na quantidade de sistemas, dependências, transações sensíveis, reconciliações e decisões observadas.
- **human_control:** `review_required` — revisão humana permanece necessária para dados, exceções, aprovações e/ou transações financeiras.
- **evidence_status:** `evidenced` para a atividade atual; `needs_validation` para solução, esforço e viabilidade técnica.
- **sub-steps:** 33 registros preservados da SOP.

| Sub-step | Descrição | Classificação individual |
|---|---|---|
| `24.1` | Se for um rebill originado por fatura existente, preview do Billing Document para confirmar o tipo antes de iniciar ZEWB. | `ME` |
| `24.1.1` | Abrir T-code VFO3 (Display Billing Document). | `ME` |
| `24.1.2` | Enter o número da invoice e, em seguida, selecionar 'Billing document' → 'Issue output To'. Escolher 'ZRD1' e confirmar (Enter) para pré-visualizar. | `ME` |
| `24.1.3` | Identificar e salvar o Excel anexado ao e-mail de instrução que contém os valores e referências a serem lançados em ZEWB. | `ME` |
| `24.2` | Entrar no t-code ZEWB para iniciar criação manual do Debit Memo (non-trip). | `ME` |
| `24.2.1` | Executar o T-code 'ZEWB' no SAP GUI/Fiori para abrir o Custom Trading Expense Workbench. | `ME` |
| `24.2.2` | Selecionar a opção para entrada de informação 'non-trip related' e abrir o formulário de criação de despesa. | `ME` |
| `24.3` | Localizar o contrato de trading relacionado e iniciar a ação 'Create Expense'. | `ME` |
| `24.3.1` | No Trading Contract List clicar em 'Create Expense' para abrir a tela de nova despesa. | `ME` |
| `24.3.2` | No campo 'Expenses class group' preencher 'Z3' e selecionar o receivable correspondente (Z3 receivables). | `MA` |
| `24.4` | Definir a classe de despesa e o tipo contábil para o Debit Memo. | `ME` |
| `24.4.1` | No campo de despesas selecionar a opção 'Y01' (Freight). | `ME` |
| `24.4.2` | No column 'Accounting Type' selecionar 'C' — Receivable Account. | `ME` |
| `24.5` | Preencher a category de postagem e a data de lançamento conforme política de rebill. | `ME` |
| `24.5.1` | No campo 'Posting Category' selecionar o valor '2'. | `ME` |
| `24.5.2` | No campo 'Posting Date' inserir a data corrente (current date). | `ME` |
| `24.6` | Preencher a coluna Partner com o número do cliente e informar o valor líquido a ser debitado. | `ME` |
| `24.6.1` | No campo 'Partner' inserir o Customer Number. Exemplo documentado: '10098763'. | `ME` |
| `24.6.2` | No campo 'Net Amount' inserir o valor líquido conforme o Excel recebido. | `ME` |
| `24.7` | Preencher campo Reference (opcional) e salvar, gerando o Document Number do Debit Memo. Verificação obrigatória antes de salvar: Confirmar que expense class group = Z3, expense type = Y01 (Freight), Accounting Type = C, Posting Category = 2, Posting Date preenchida, Partner informado e Net Amount corresponde ao Excel recebido. Documento não gerado após salvar: Condição: Após salvar, nenhum Document Number é exibido ou o número não é gerado.. Ações: Reabrir a tela do Expense no ZEWB e confirmar todos os campos obrigatórios estão preenchidos.; Repetir a ação 'Save'.; Se o problema persistir, retornar para 's237_check_and_save' e reexecutar a revisão dos campos.. Resultado: 24.7.2 · Revisar todos os campos preenchidos (expense classgrp, accounting type, posting category, posting date, partner, net amount, reference) e clicar 'Save'. | `MA` |
| `24.7.1` | No campo 'Reference' inserir a referência desejada; opcionalmente preencher a coluna 'Text' para aparecer na invoice rebill. | `ME` |
| `24.7.2` | Revisar todos os campos preenchidos (expense classgrp, accounting type, posting category, posting date, partner, net amount, reference) e clicar 'Save'. Verificação obrigatória antes de salvar: Confirmar que expense class group = Z3, expense type = Y01 (Freight), Accounting Type = C, Posting Category = 2, Posting Date preenchida, Partner informado e Net Amount corresponde ao Excel recebido. | `MA` |
| `24.7.3` | Após o salvamento, copiar o Document Number gerado (exemplo documentado: '6000008830') para referência e registros. Documento não gerado após salvar: Condição: Após salvar, nenhum Document Number é exibido ou o número não é gerado.. Ações: Reabrir a tela do Expense no ZEWB e confirmar todos os campos obrigatórios estão preenchidos.; Repetir a ação 'Save'.; Se o problema persistir, retornar para 's237_check_and_save' e reexecutar a revisão dos campos.. Resultado: 24.7.2 · Revisar todos os campos preenchidos (expense classgrp, accounting type, posting category, posting date, partner, net amount, reference) e clicar 'Save'. | `ME` |
| `24.7.4` | Abrir 'Expenses Doc List', filtrar a coluna 'Document' inserindo o número da invoice (Document Number copiado) e pressionar Enter para localizar o documento. | `ME` |
| `24.8` | Selecionar o Document Number encontrado para abrir a tela de item overview do Billing Document. | `ME` |
| `24.8.1` | Clicar sobre o Document Number listado para abrir 'Billing Document Item Overview'. | `ME` |
| `24.8.2` | Verificar as informações do item no 'Document Item Overview' antes de produzir o output. | `ME` |
| `24.9` | No 'Document Item Overview' usar menu Extras → Message para acessar opções de output e visualização da invoice. | `ME` |
| `24.9.1` | Clicar 'Extras' → 'Message'. | `ME` |
| `24.9.2` | Na tela 'Output and Invoice details' selecionar 'Print Preview' para gerar a visualização do Debit Rebill Invoice. | `ME` |
| `24.10` | Salvar a pré-visualização como PDF/arquivo no computador e enviar o arquivo gerado de volta ao Scheduler conforme procedimento interno. Falha no envio ao Scheduler: Não foi possível enviar o arquivo do Debit Rebill ao Scheduler (por exemplo, endereço não disponível ou envio falhou). · Scheduler | `ME` |
| `24.10.1` | Na janela de Print Preview usar a opção 'Save' ou 'Export to PDF' para gravar o Debit Rebill Invoice no diretório local do operador. Verificação obrigatória antes de salvar: Confirmar que expense class group = Z3, expense type = Y01 (Freight), Accounting Type = C, Posting Category = 2, Posting Date preenchida, Partner informado e Net Amount corresponde ao Excel recebido. | `MA` |
| `24.10.2` | Enviar o arquivo salvo ao Scheduler conforme o canal combinado (ver Unknowns se o canal não estiver documentado). Registrar o envio. Falha no envio ao Scheduler: Não foi possível enviar o arquivo do Debit Rebill ao Scheduler (por exemplo, endereço não disponível ou envio falhou). · Scheduler | `ME` |

### Step 25 — Processo de Fatura Revisada — Correção por crédito (original processado/impago)

- **step_id:** `step_25`
- **macroetapa:** Exception (`excecao`)
- **source_step_ref:** `25`
- **descrição breve:** Sequência operacional para identificar lançamento original, levantar dados contábeis, gerar e carregar fatura de crédito ou débito revisada e reconciliar (inclui fluxo para original processado e não pago e direcionamento para alternativa quando original já foi pago).
- **classificação consolidada:** `MS + MA`
- **solução tecnológica:** `Workflow`
- **por que foi selecionada:** A correção por crédito trata uma divergência de fatura já processada e exige decisão, rastreabilidade e nova submissão.
- **esforço:** `Alto` — estimativa relativa baseada na quantidade de sistemas, dependências, transações sensíveis, reconciliações e decisões observadas.
- **human_control:** `decision_required` — revisão humana permanece necessária para dados, exceções, aprovações e/ou transações financeiras.
- **evidence_status:** `evidenced` para a atividade atual; `needs_validation` para solução, esforço e viabilidade técnica.
- **sub-steps:** 20 registros preservados da SOP.

| Sub-step | Descrição | Classificação individual |
|---|---|---|
| `25.1` | Abrir a transação FBL1N no SAP para pesquisar lançamentos do fornecedor. | `ME` |
| `25.2` | No ecrã FBL1N, inserir a conta do fornecedor (Vendor account) e executar a pesquisa pressionando F8. | `ME` |
| `25.3` | Verificar se o lançamento original foi apenas processado (contabilizado) ou processado e pago. | `MS` |
| `Decisão` | Decisão: O lançamento original foi processado e pago? Conferir no resultado do FBL1N se o documento original já possui liquidação/pagamento (coluna de clearing/payment) ou se permanece sem clearing. Processado mas não pago → 25.4 · Na lista de resultados do FBL1N localizar a linha correspondente ao lançamento já processado e dar duplo clique sobre ela para abrir o detalhe do documento. Processado e pago → A6 · Fluxo alternativo: original processado e já pago — solicitar crédito/débito e processar fatura revisada Fluxo alternativo: original processado e já pago — solicitar crédito/débito e processar fatura revisada Quando, pela verificação no FBL1N, o lançamento original consta como já liquidad o/pago. ↳ A6.1 Escolher um dos métodos disponíveis para localizar o GL e o Profit Centre: pesquisa em erplookup (https://erplookup.phillips66.net) ou consulta na Strategy sheet; alternativa usar faturas passadas como referência. ↳ A6.2 Acessar o site erplookup.phillips66.net, selecionar GL account lookup, abrir Show/Hide search e inserir parte da descrição de charges (ex.: 'Terminal') no campo S4 GL account description; executar a pesquisa e anotar o GL sugerido. ↳ A6.3 Abrir a Strategy sheet interna e localizar o Profit Centre aplicável ao tipo de cobrança; anotar o Profit Centre identificado para o lançamento. ↳ A6.4 Preparar e enviar e-mail ao aprovador apropriado incluindo: cópia da fatura original, cópia da fatura revisada (crédito ou débito), identificação do GL e Profit Centre e justificativa do ajuste. Aguardar aprovação antes de prosseguir com o upload. ↳ A6.5 Após receber a aprovação por e-mail, abrir OAWD e carregar o PDF da fatura revisada na fila VIM Invoice uploads indicada (procedimento refere SEC_RFDPRD para revised/credit upload). Regras de aprovador por faixa de valor: Aplicar regras de aprovação por faixa de valor conforme abaixo antes da postagem: ↳ A6.6 No VIM Workplace localizar a fatura carregada, executar a fatura (Execute), preencher os campos obrigatórios e processar a fatura de crédito conforme o passo a passo padrão (aplicar regras, aprovação e posterior contabilização). Resultado: Fatura revisada (crédito/débito) carregada e processada no VIM com aprovação; pronta para contabilização e conciliação. | `MS` |
| `25.4` | Na lista de resultados do FBL1N localizar a linha correspondente ao lançamento já processado e dar duplo clique sobre ela para abrir o detalhe do documento. | `MA` |
| `25.5` | No ecrã do documento, aceder à aba Environment e selecionar Document Environment → Accounting Documents para visualizar os documentos contábeis relacionados necessários para repostagem (GL, Profit Centre, company code, gross amount). | `ME` |
| `25.6` | Dar duplo clique sobre o documento contábil listado para abrir o detalhe do accounting document e capturar GL account, Profit Centre, company code e gross amount que serão usados no lançamento de correção. | `ME` |
| `25.7` | Verificar no detalhe do documento as contas GL e o Profit Centre exibidos para uso no lançamento de débito/crédito revisado. | `ME` |
| `25.8` | Fazer download do PDF da fatura duplicada (ou cópia digital recebida) e preparar a versão que será enviada para upload como crédito (ou débito) com os valores ajustados e os dados contábeis identificados. | `ME` |
| `25.9` | Abrir OAWD e selecionar a opção VIM Invoice uploads; carregar o arquivo PDF da fatura revisada na fila indicada (referida como SEC_REDPRD no procedimento). Regras de aprovador por faixa de valor: Aplicar regras de aprovação por faixa de valor conforme abaixo antes da postagem: | `MS` |
| `25.10` | Aguardar a criação do arquivo no VIM; após processamento automático, a fatura carregada aparecerá na VIM Workplace. | `ME` |
| `25.11` | No VIM Workplace abrir 'My Inbox' e localizar a fatura recém-carregada; abrir a fatura para executar o processamento. | `ME` |
| `25.12` | Na execução da fatura no VIM/SAP preencher os campos obrigatórios com os dados do PDF: Vendor number, Company code, Transaction/Event, Reference number, Document Date, Gross Amount e demais campos básicos. | `ME` |
| `25.13` | Aceder à aba Accounting da fatura e ativar o bloqueio de pagamento (Manual payment block). Selecionar a opção de bloqueio manual (Manual pmt. block) e indicar o baseline date igual à data corrente de contabilização/postagem. Bloqueio de pagamento manual e baseline date: Na aba Accounting selecionar 'Manual payment block' e informar o baseline date igual à data corrente de contabilização/postagem. | `ME` |
| `25.14` | Alterar o Document Type para 'Non-PO Manual' e inserir o e-mail do requester (requester mail id) no campo apropriado da fatura. | `ME` |
| `25.15` | Na linha de itens da fatura preencher as contas GL e o Profit Centre previamente identificados (ver passos a6). | `ME` |
| `25.16` | Executar a simulação das regras de imputação (simulate rule). Caso a simulação apresente indicadores vermelhos deve-se analisar cada item com erro individualmente, inserir comentários relevantes e, se apropriado, usar a opção de bypass (bypass) para prosseguir. Ação quando simulação apresentar indicação vermelha: Condição: Simulação de regras retorna indicador vermelho. Ações: Analisar cada linha com erro individualmente; Inserir comentário explicativo em cada item com erro; Ajustar manualmente GL/Profit Centre ou outros campos conforme necessário; Tentar nova simulação após correções. Resultado: 25.16 · Executar a simulação das regras de imputação (simulate rule). Caso a simulação apresente indicadores vermelhos deve-se analisar cada item com erro individualmente, inserir comentários relevantes e, se apropriado, usar a opção de bypass (bypass) para prosseguir. | `MA` |
| `25.17` | Se a simulação estiver sem erros (indicadores verdes), selecionar 'Apply Rules' para aplicar os lançamentos e enviar a fatura para a etapa de aprovação conforme as regras internas. Regras de aprovador por faixa de valor: Aplicar regras de aprovação por faixa de valor conforme abaixo antes da postagem: | `MS` |
| `25.18` | Após aprovação e postagem automática em SAP, retornar ao FBL1N e localizar os lançamentos de débito e crédito resultantes do processamento para verificação. | `MS` |
| `25.19` | Executar a transação F-44. Preencher os campos obrigatórios (Vendor account, Company code, Document numbers) selecionar os documentos a serem compensados (knock off) e executar a compensação. Após a compensação, reprocessar a invoice revisada utilizando os GL account e Profit Centre obtidos anteriormente. | `ME` |

### Step 26 — Processar fatura de comissão única — identificar confirmation/deal, localizar VBD e preparar para postagem

- **step_id:** `step_26`
- **macroetapa:** Execution (`execucao`)
- **source_step_ref:** `26`
- **descrição breve:** Procedimento passo a passo para localizar o anexo da fatura no VIM Workplace, validar dados básicos, localizar/associar Accrual VBD via busca ou via deal (Livelink → Fiori → ZEWB), ajustar valores dentro da tolerância e verificar possível duplicidade antes de encaminhar para a etapa de postagem.
- **classificação consolidada:** `MS + MA`
- **solução tecnológica:** `IA / Agente`
- **por que foi selecionada:** A identificação de confirmation/deal e matching com VBDs pode ser assistida por IA, mas a decisão de postagem permanece revisável.
- **esforço:** `Alto` — estimativa relativa baseada na quantidade de sistemas, dependências, transações sensíveis, reconciliações e decisões observadas.
- **human_control:** `review_required` — revisão humana permanece necessária para dados, exceções, aprovações e/ou transações financeiras.
- **evidence_status:** `evidenced` para a atividade atual; `needs_validation` para solução, esforço e viabilidade técnica.
- **sub-steps:** 22 registros preservados da SOP.

| Sub-step | Descrição | Classificação individual |
|---|---|---|
| `26.1` | No VIM Workplace abra a fatura selecionada: clique em 'Attachment list', localize o anexo identificado como 'VIM Incoming Invoice', dê duplo clique para abrir a pré‑visualização e, quando pronto para processar, execute (F8). | `ME` |
| `26.2` | No painel da fatura selecione a aba 'Basic data' e confirme que os seguintes campos batem com o documento físico/preview: Invoice Number, Gross Amount, Invoice Date, Vendor Number e Banking Information. Corrija apenas se houver erro de leitura do anexo e documente a divergência. | `ME` |
| `26.3` | Abra a aba 'Other Data' e inicie a busca por Accruals VBD: clique em 'Search Accruals VBD'. Antes de executar a busca, confirme que o campo 'Bill of Lading' está vazio (sem valores selecionados) e que a opção 'Include All VBDs' esteja desmarcada. Bill of Lading em branco e 'Include All VBDs' desmarcado: Antes de executar a busca por Accrual VBD, o campo 'Bill of Lading' deve estar sem valores selecionados e a opção 'Include All VBDs' deve estar desmarcada para retornar os VBDs corretos. | `ME` |
| `26.4` | Com os filtros definidos (Bill of Lading em branco e 'Include All VBDs' desmarcado) clique em Execute (F8) para listar Accruals Open VBDs. | `ME` |
| `26.5` | Na lista retornada selecione 'Choose Layout' para ajustar a visualização conforme necessário e confirme com o tick (marca) para exibir as colunas relevantes (incluindo Broker reference). Observe a coluna Broker reference para localizar o número de confirmation que pode constar na fatura. | `ME` |
| `26.6` | Verificar se o número de confirmation presente na fatura aparece na coluna 'Broker reference' dos VBD listados. | `MS` |
| `Decisão` | Decisão: O número de confirmation da fatura aparece na coluna 'Broker reference' na lista de Open VBD? Presença exata do número de confirmation na coluna 'Broker reference' em pelo menos um VBD exibido. Sim — confirmation presente → 26.12 · Retorne ao VIM Workplace → Other Data → Search Accruals VBD. Cole o número do documento (Accrual VBD) obtido em ZEWB no campo de busca e execute (F8). Ao localizar o Accrual VBD selecionado, clique em 'Overwrite VBD' para associá‑lo à fatura. Não — confirmation não presente → 26.7 · Abra Livelink e selecione 'Broker confirmations'. Insira o número de Confirmation extraído da fatura no campo de busca e execute a pesquisa. Na lista de resultados localize o item correspondente e dê duplo clique para abrir os detalhes. | `MS` |
| `26.7` | Abra Livelink e selecione 'Broker confirmations'. Insira o número de Confirmation extraído da fatura no campo de busca e execute a pesquisa. Na lista de resultados localize o item correspondente e dê duplo clique para abrir os detalhes. | `MA` |
| `26.8` | Após pesquisar o confirmation no Livelink, verificar se existe um item que contenha o deal number necessário. | `MS` |
| `Decisão` | Decisão: Livelink apresenta o deal number/attachment com o deal associado ao confirmation? Listagem no Livelink contendo o deal number (ou anexo com deal) referente ao confirmation pesquisado. Sim — deal disponível no Livelink → 26.9 · Abra o anexo ou o registro encontrado no Livelink e copie o deal number exibido. Preserve exatamente o texto do deal number (sem espaços adicionais). Não — usar SAP Fiori para localizar o deal → 26.10 · Abra SAP Fiori e preencha os critérios principais: Trader, Trader Date e Counterparty. Clique 'Go' para listar deals. Confirme que os detalhes do deal (counterparty, volume, shipment date, trader) correspondem à confirmation na fatura antes de selecionar a linha. | `MS` |
| `26.9` | Abra o anexo ou o registro encontrado no Livelink e copie o deal number exibido. Preserve exatamente o texto do deal number (sem espaços adicionais). | `ME` |
| `26.10` | Abra SAP Fiori e preencha os critérios principais: Trader, Trader Date e Counterparty. Clique 'Go' para listar deals. Confirme que os detalhes do deal (counterparty, volume, shipment date, trader) correspondem à confirmation na fatura antes de selecionar a linha. | `MA` |
| `26.11` | Abra o T‑Code ZEWB (Custom Trading Workbench). Cole o deal number copiado no campo de busca apropriado e execute (F8). Na saída localize o Accrual VBD document associado e copie o número do documento retornado. | `ME` |
| `26.12` | Retorne ao VIM Workplace → Other Data → Search Accruals VBD. Cole o número do documento (Accrual VBD) obtido em ZEWB no campo de busca e execute (F8). Ao localizar o Accrual VBD selecionado, clique em 'Overwrite VBD' para associá‑lo à fatura. | `ME` |
| `26.13` | Abra a aba 'Line item' e compare a Gross Amount da invoice com a Gross Amount do VBD associado. Calcule a diferença (Invoice amount menos VBD amount). | `MA` |
| `26.14` | Aplicar a regra de tolerância registrada para commission invoices. Tolerância de comissão: Limite de tolerância para diferença entre Invoice Gross Amount e VBD Gross Amount é de 2000 USD. | `MA` |
| `Decisão` | Decisão: A diferença absoluta (\|Invoice Gross Amount − VBD Gross Amount\|) é menor ou igual a 2000 dólares? Diferença absoluta ≤ 2000 USD (limite de tolerância definido no processo). Dentro da tolerância (≤ 2000 USD) → 26.15 · Atualize o valor do VBD para igualar o Invoice Gross Amount quando a diferença estiver dentro da tolerância. Após ajustar o valor, clique em 'Recalculate vendor Price' e depois em 'Save' para persistir o ajuste. Fora da tolerância (> 2000 USD) → tolerance_exceeded_review_required | `MS` |
| `26.15` | Atualize o valor do VBD para igualar o Invoice Gross Amount quando a diferença estiver dentro da tolerância. Após ajustar o valor, clique em 'Recalculate vendor Price' e depois em 'Save' para persistir o ajuste. | `MA` |
| `26.16` | Clique em 'Simulate Rules' para aplicar regras do sistema. Caso seja apresentado o erro 'Suspected Duplicate', trate conforme o procedimento de verificação de duplicidade. Tratamento para 'Suspected Duplicate Error' após simulação de regras: Condição: Ao executar 'Simulate Rules' é exibida a mensagem 'Suspected Duplicate Error'.. Ações: Executar verificação de duplicidade em VIM Analytics (etapa step-264).; Se VIM Analytics indicar múltiplas linhas, marcar a fatura como suspeita de duplicidade e seguir o fluxo de revisão definido pela área (end_state gerado no dec-duplicate-check). | `ME` |
| `26.17` | Abra VIM Analytics, insira o Reference Number da fatura e execute (F8). Analise o resultado: se retornar apenas uma linha, a fatura não é considerada duplicada; se retornar múltiplas linhas, tratá‑se‑á como suspeita de duplicidade. | `MA` |
| `26.18` | Decidir o estado da fatura com base no número de entradas retornadas pelo VIM Analytics. | `MS` |
| `Decisão` | Decisão: O VIM Analytics retornou mais de uma linha para o mesmo reference number? Mais de uma linha correspondente indica possível duplicidade. Não é duplicada — 1 linha apenas → invoice_not_duplicate_ready_for_posting Suspeita de duplicidade — múltiplas linhas → invoice_flagged_suspected_duplicate_requires_review | `MS` |

### Step 27 — Processo de Comissão — identificar e reconciliar VBDs para Multi Commission e Crude Commission

- **step_id:** `step_27`
- **macroetapa:** Execution (`execucao`)
- **source_step_ref:** `27`
- **descrição breve:** Procedimento operacional para identificar, selecionar e reconciliar VBDs (Accrual VBD) relacionados a faturas de comissão multi e crude dentro do VIM Workplace e acionar próximos passos (postagem ou investigação manual).
- **classificação consolidada:** `MA`
- **solução tecnológica:** `IA / Agente`
- **por que foi selecionada:** A reconciliação de múltiplas comissões exige comparação de referências, datas, quantidades e valores; o agente deve apenas apoiar a análise.
- **esforço:** `Alto` — estimativa relativa baseada na quantidade de sistemas, dependências, transações sensíveis, reconciliações e decisões observadas.
- **human_control:** `review_required` — revisão humana permanece necessária para dados, exceções, aprovações e/ou transações financeiras.
- **evidence_status:** `evidenced` para a atividade atual; `needs_validation` para solução, esforço e viabilidade técnica.
- **sub-steps:** 28 registros preservados da SOP.

| Sub-step | Descrição | Classificação individual |
|---|---|---|
| `27.1` | No VIM Workplace, marque a fatura como não duplicada e salve para postar. Marcar fatura como 'Non Duplicate' e salvar: No campo de comentários do VIM inserir exatamente 'Non Duplicate' e pressionar o botão Save para que a fatura seja postada. | `ME` |
| `27.2` | A partir do menu pop-up do documento no VIM, selecione a lista de anexos e abra o PDF da fatura para exame. Abrir anexo PDF para verificar conteúdo da fatura: Abrir a opção 'VIM Incoming Invoice Email PDF attachment' na 'Attachment list' para visualizar o PDF inteiro antes de proceder à reconciliação. | `MA` |
| `27.2.1` | No menu pop-up, clique em 'Attachment list'. Em seguida clique na primeira opção 'VIM Incoming Invoice Email PDF attachment' e abra o PDF para visualizar o documento completo. | `ME` |
| `27.3` | Com o PDF aberto, verifique os line items exibidos. Retorne ao fluxo do VIM e selecione a guia 'Other Data' para iniciar busca de Accrual VBDs. | `ME` |
| `27.4` | No painel 'Other Data', execute a pesquisa de 'Search Accrual VBD selection' e então execute (F8). Antes de executar, confirme que a(s) caixa(s) relevante(s) estejam desmarcadas conforme instrução. Confirmar caixa desmarcada antes de Executar (F8): Antes de executar a pesquisa de Accrual VBD (F8), confirme que a caixa específica indicada pelo procedimento esteja desmarcada para evitar filtragem indesejada. Caixa a ser desmarcada antes de Executar (F8) — campo não identificado no documento: Condição: Texto instrui 'Ensure that the is unchecked' sem indicar qual caixa/controle.. Ações: Verificar na tela 'Search Accrual VBD selection' qual checkbox está marcado por padrão e que pode filtrar resultados; se incerto, confirmar com um colega com acesso à mesma tela antes de executar.. Resultado: 27.4 · No painel 'Other Data', execute a pesquisa de 'Search Accrual VBD selection' e então execute (F8). Antes de executar, confirme que a(s) caixa(s) relevante(s) estejam desmarcadas conforme instrução. | `ME` |
| `27.4.1` | Clique em 'Search Accrual VBD selection'. Verifique os filtros aplicados e, quando pronto, pressione Executar (F8). | `ME` |
| `27.4.2` | Confirme que a caixa indicada na interface (ver callout de unknown se incerto) esteja desmarcada antes de pressionar Executar (F8). Depois, pressione F8 para obter os VBDs. Caixa a ser desmarcada antes de Executar (F8) — campo não identificado no documento: Condição: Texto instrui 'Ensure that the is unchecked' sem indicar qual caixa/controle.. Ações: Verificar na tela 'Search Accrual VBD selection' qual checkbox está marcado por padrão e que pode filtrar resultados; se incerto, confirmar com um colega com acesso à mesma tela antes de executar.. Resultado: 27.4 · No painel 'Other Data', execute a pesquisa de 'Search Accrual VBD selection' e então execute (F8). Antes de executar, confirme que a(s) caixa(s) relevante(s) estejam desmarcadas conforme instrução. | `ME` |
| `27.5` | Na lista de resultados (DP / lista de VBDs), abra o menu 'Choose Layout' e selecione o layout 'Commission' para exibir colunas relevantes. Selecionar layout 'Commission' na escolha de layout: Abrir 'Choose Layout' e selecionar 'Commission' para que colunas relevantes apareçam na lista de VBDs. | `ME` |
| `27.6` | Use a opção de ordenação 'Sort by' para organizar por 'broker reference'. Retorne ao PDF da fatura e identifique os confirmation numbers (6 ou 7 dígitos numéricos) para procurar correspondência na lista de VBDs. Identificação de confirmation number: Considerar confirmation numbers como sequências numéricas de 6 ou 7 dígitos ao buscar correspondência entre PDF e campo 'broker reference'. | `MA` |
| `27.6.1` | Verificar se na lista de VBDs existem linhas cujo 'broker reference' corresponde exatamente ao confirmation number identificado no PDF. | `MA` |
| `Decisão` | Decisão: Os valores em 'broker reference' dos VBDs coincidem com o confirmation number do PDF? Correspondência exata do número de confirmação (sequência numérica de 6 ou 7 dígitos) entre o PDF da fatura e o campo 'broker reference' do VBD. Sim — há correspondência → 27.7 · Selecione na lista os Accrual VBDs cujo 'broker reference' corresponde ao confirmation number do PDF. Depois destaque (marque) o confirmation number no PDF da fatura para referência. Não — não há correspondência → 27.8 · Quando não houver correspondência direta entre 'broker reference' e confirmation number, proceda à análise linha a linha do PDF e dos registros VBD para identificar a transação correta ou anomalias. | `MS` |
| `27.7` | Selecione na lista os Accrual VBDs cujo 'broker reference' corresponde ao confirmation number do PDF. Depois destaque (marque) o confirmation number no PDF da fatura para referência. Ação a ser clicada para não sobrescrever seleções de VBD — instrução incompleta no documento: Condição: Documento diz 'remember to click on so as to not override any previous VBD selections' sem informar qual botão/caixa clicar.. Ações: Ao selecionar VBDs adicionais, observar se existe opção de 'add to selection' ou checkbox de múltipla seleção na interface; se não evidente, não confirmar alterações e consultar colega ou documentação técnica antes de salvar.. Resultado: 27.7 · Selecione na lista os Accrual VBDs cujo 'broker reference' corresponde ao confirmation number do PDF. Depois destaque (marque) o confirmation number no PDF da fatura para referência. Destacar confirmation number no PDF: Após selecionar os VBDs correspondentes, destaque o confirmation number no PDF para manter rastreabilidade entre fatura e VBDs. | `MA` |
| `27.7.1` | Clique nas linhas de VBD que correspondem ao confirmation number. Se selecionar VBDs adicionais, siga a orientação do callout relacionado para não sobrescrever seleções anteriores. Ação a ser clicada para não sobrescrever seleções de VBD — instrução incompleta no documento: Condição: Documento diz 'remember to click on so as to not override any previous VBD selections' sem informar qual botão/caixa clicar.. Ações: Ao selecionar VBDs adicionais, observar se existe opção de 'add to selection' ou checkbox de múltipla seleção na interface; se não evidente, não confirmar alterações e consultar colega ou documentação técnica antes de salvar.. Resultado: 27.7 · Selecione na lista os Accrual VBDs cujo 'broker reference' corresponde ao confirmation number do PDF. Depois destaque (marque) o confirmation number no PDF da fatura para referência. | `MA` |
| `27.7.2` | No visualizador do PDF, selecione/highlight o confirmation number que corresponde às linhas VBD selecionadas para manter rastreabilidade visual. Destacar confirmation number no PDF: Após selecionar os VBDs correspondentes, destaque o confirmation number no PDF para manter rastreabilidade entre fatura e VBDs. | `MA` |
| `27.8` | Quando não houver correspondência direta entre 'broker reference' e confirmation number, proceda à análise linha a linha do PDF e dos registros VBD para identificar a transação correta ou anomalias. Revisão manual linha a linha quando não houver correspondência automática: Condição: Falha em localizar correspondência automática entre confirmation number e broker reference. Ações: Comparar datas de acordo, quantidades, valores e counterparty entre PDF e VBDs.; Registrar tentativa de correspondência e evidências.; Se necessário, classificar o caso como 'Investigar - Reconciliation not found' e guardar documentação.. Resultado: Caso pendente para investigação | `MA` |
| `27.8.1` | Comparar datas de acordo/ trade date, quantidades, counterparty e valores por linha. Documente cada tentativa de correspondência e registre VBDs candidatos. Revisão manual linha a linha quando não houver correspondência automática: Condição: Falha em localizar correspondência automática entre confirmation number e broker reference. Ações: Comparar datas de acordo, quantidades, valores e counterparty entre PDF e VBDs.; Registrar tentativa de correspondência e evidências.; Se necessário, classificar o caso como 'Investigar - Reconciliation not found' e guardar documentação.. Resultado: Caso pendente para investigação | `MA` |
| `27.8.2` | Se após análise linha a linha não for possível identificar VBD correspondente, registre o caso para investigação adicional (estado: 'Investigar - Reconciliation not found') e mantenha evidências coletadas. Revisão manual linha a linha quando não houver correspondência automática: Condição: Falha em localizar correspondência automática entre confirmation number e broker reference. Ações: Comparar datas de acordo, quantidades, valores e counterparty entre PDF e VBDs.; Registrar tentativa de correspondência e evidências.; Se necessário, classificar o caso como 'Investigar - Reconciliation not found' e guardar documentação.. Resultado: Caso pendente para investigação | `MA` |
| `27.9` | No VIM Workplace, abra a fatura do tipo 'Crude' em arquivo separado, abra a lista de anexos e visualize o PDF para analisar componentes como trade date / agreement date e identificação do counterparty. | `MA` |
| `27.9.1` | Escolha a fatura Crude na lista do VIM e abra-a em um arquivo/visualizador separado clicando no ícone destacado. | `ME` |
| `27.9.2` | Do pop-up, selecione 'Attachment list' e clique em 'VIM Incoming Invoice- Email PDF attachment' para inspecionar o documento. Observe que, para faturas Crude, o 'agreement date' corresponde ao trade date / deal date. | `MA` |
| `27.9.3` | Se o counterparty não estiver explicitado no PDF, contacte o broker para esclarecimento antes de proceder com seleção de VBDs (registre comunicação). | `MS` |
| `27.10` | No VIM, vá para a guia 'Other Data', acione 'Search Accrual VBD selection', deixe o campo 'Bill of Lading' completamente em branco (remova entradas) e execute (F8). Manter campo 'Bill of Lading' em branco para Crude: Remova qualquer valor do campo 'Bill of Lading' e certifique-se de que ele esteja completamente em branco antes de executar a pesquisa de Accrual VBDs para faturas Crude. | `ME` |
| `27.10.1` | Apague qualquer valor presente no campo 'Bill of Lading' para garantir que ele permaneça em branco antes de executar a busca. Manter campo 'Bill of Lading' em branco para Crude: Remova qualquer valor do campo 'Bill of Lading' e certifique-se de que ele esteja completamente em branco antes de executar a pesquisa de Accrual VBDs para faturas Crude. | `ME` |
| `27.10.2` | Com o campo 'Bill of Lading' em branco, pressione Executar (F8) para carregar os Accrual VBDs disponíveis para a fatura Crude. | `ME` |
| `27.11` | Abra a lista resultante de VBDs, utilize 'Choose Layout' para selecionar 'Commission', reveja os registros de Accrual VBD (DP document page) e avalie se os 'broker reference' e as datas/anotações indicam necessidade de ação manual. Selecionar layout 'Commission' (Crude): Na lista de VBDs retornada para faturas Crude, aplicar o layout 'Commission' para visualizar corretamente os campos de Accrual VBD. Tratamento quando houver 'outdated lift dates' ou VBDs manuais: Condição: Identificação de lift dates desatualizados ou ausência de broker reference correspondente (ex.: ausência de PX11).. Ações: Marcar cada item que apresente lift date desatualizado.; Efetuar análise linha a linha para determinar se o VBD foi manualmente criado e se requer reversão.; Documentar evidências (screenshots, notas do PDF) para acompanhamento.. Resultado: Requer revisão manual/possível reversão de VBD — preparar documentação para ação corretiva | `MA` |
| `27.11.1` | No menu 'Choose Layout', selecione 'Commission'. A página DP com os registros de Accrual VBDs será exibida para revisão. Selecionar layout 'Commission' (Crude): Na lista de VBDs retornada para faturas Crude, aplicar o layout 'Commission' para visualizar corretamente os campos de Accrual VBD. | `ME` |
| `27.11.2` | Revise se o número apresentado como 'invoice number' na fatura é, na verdade, o confirmation number. Verifique se há broker reference iniciando com 'PX11' — ausência indica que não houve triggers. Observe datas de lift desatualizadas que podem indicar VBDs manuais ou tickets atualizados após pagamento. Tratamento quando houver 'outdated lift dates' ou VBDs manuais: Condição: Identificação de lift dates desatualizados ou ausência de broker reference correspondente (ex.: ausência de PX11).. Ações: Marcar cada item que apresente lift date desatualizado.; Efetuar análise linha a linha para determinar se o VBD foi manualmente criado e se requer reversão.; Documentar evidências (screenshots, notas do PDF) para acompanhamento.. Resultado: Requer revisão manual/possível reversão de VBD — preparar documentação para ação corretiva | `MA` |
| `27.11.3` | Se VBDs aparentam ser manuais ou com lift dates posteriores ao pagamento, prepare análise linha a linha; se forem correspondentes, selecione conforme passo de seleção de VBD (retornar ao step-32). Tratamento quando houver 'outdated lift dates' ou VBDs manuais: Condição: Identificação de lift dates desatualizados ou ausência de broker reference correspondente (ex.: ausência de PX11).. Ações: Marcar cada item que apresente lift date desatualizado.; Efetuar análise linha a linha para determinar se o VBD foi manualmente criado e se requer reversão.; Documentar evidências (screenshots, notas do PDF) para acompanhamento.. Resultado: Requer revisão manual/possível reversão de VBD — preparar documentação para ação corretiva | `MA` |

### Step 28 — Processamento mensal de invoices ICE US Commodity Market — extração, cruzamento com VBDs e postagem

- **step_id:** `step_28`
- **macroetapa:** Execution (`execucao`)
- **source_step_ref:** `28`
- **descrição breve:** Procedimento executável para extrair invoices do portal ICE no dia 8 de cada mês, mapear com VBDs no SAP (VIM/VBD/ZEWB/ZEWB) e processar até a postagem da fatura quando aplicável. Cada subpasso contém interações detalhadas necessárias para executar a tarefa conforme as telas e transações indicadas na fonte.
- **classificação consolidada:** `MS + MA`
- **solução tecnológica:** `Analytics / Monitoramento`
- **por que foi selecionada:** O processamento mensal cruza ICE, SAP, LiveLink e planilhas; analytics pode automatizar matching e destacar casos NO ou fora da tolerância.
- **esforço:** `Alto` — estimativa relativa baseada na quantidade de sistemas, dependências, transações sensíveis, reconciliações e decisões observadas.
- **human_control:** `review_required` — revisão humana permanece necessária para dados, exceções, aprovações e/ou transações financeiras.
- **evidence_status:** `evidenced` para a atividade atual; `needs_validation` para solução, esforço e viabilidade técnica.
- **sub-steps:** 52 registros preservados da SOP.

| Sub-step | Descrição | Classificação individual |
|---|---|---|
| `28.1` | Autenticar no portal ICE para obter os detalhes de deals e invoices do mês. | `ME` |
| `28.1.1` | Abrir o URL do portal ICE (URL pendente) e inserir as credenciais válidas fornecidas; confirmar login bem-sucedido. | `ME` |
| `28.2` | No dashboard principal do portal ICE selecionar a opção 'Invoices' para acessar o módulo de faturas. | `ME` |
| `28.2.1` | Clicar na opção 'Invoices' no menu principal do portal para abrir a lista de invoices. | `ME` |
| `28.3` | Configurar a visualização para o mês inteiro que deseja processar e executar 'Show summary'. | `ME` |
| `28.3.1` | Na página de Invoices selecionar a opção 'View an entire Month', escolher o mês alvo e clicar em 'Show summary'. | `ME` |
| `28.4` | Do resumo exibido, localizar a invoice desejada e clicar em 'View invoice' para ver os detalhes do deal que serão exportados. | `ME` |
| `28.5` | No filtro 'Commodity Type' escolher o componente a ser extraído (Physical NGL ou Physical Oil). Para este procedimento focar em Physical NGL conforme o exemplo. | `ME` |
| `28.6` | Exportar os registros exibidos na tela do ICE para um arquivo Excel para posterior cruzamento com VBDs. | `ME` |
| `28.6.1` | Clicar em 'Export to Excel' (ou equivalente) na tela de deals e salvar o arquivo exportado localmente. | `ME` |
| `28.7` | No Excel exportado remover as colunas que não serão utilizadas no cruzamento (trade time, leg ID, origin ID, Product, hub, Strip, Qty Units, memo, source, clearing user id, USI, Quantity, Authorized traders). | `ME` |
| `28.7.1` | Excluir as colunas listadas e manter apenas as colunas necessárias para identificação do deal e do broker reference. | `ME` |
| `28.8` | Criar três colunas adicionais: 'Deal' (Deal ID), 'SAP Match' e 'Status'; identificar que Deal ID iniciando por 992 = Physical NGL e por 994 = Physical OIL. | `ME` |
| `28.9` | No SAP VIM Workplace localizar o fornecedor/invoice correspondente e abrir o registro de invoice a ser processado (ex.: acessar a fatura 'Physical NGL Invoice'). | `MA` |
| `28.9.1` | No VIM Workplace pesquisar o fornecedor e abrir a invoice cujo processamento será feito (confirme Vendor Name, Invoice number, Invoice date, Invoice amount, Bank remittance e Supply period conforme necessário). | `ME` |
| `28.10` | Na invoice aberta ir até a aba 'Other Data' e selecionar a função 'Search Accrual VBD' para localizar VBDs em aberto que possam casar com os deals. | `ME` |
| `28.11` | Executar a pesquisa de Accrual VBD e exportar os resultados. Antes de executar, garantir que o campo 'Bill of Lading' esteja completamente em branco para não filtrar indevidamente os resultados. Campo 'Bill of Lading' deve permanecer em branco antes de executar Search/Append VBD: Garantir que o campo 'Bill of Lading' esteja completamente vazio antes de pressionar Execute (F8) em Search Accrual VBD ou antes de Append VBD no VIM para evitar filtragem ou associação incorreta de VBDs. | `ME` |
| `28.11.1` | Verificar o campo 'Bill of Lading' e apagar qualquer conteúdo presente; confirmar vazio. | `ME` |
| `28.11.2` | Pressionar Execute (F8) para listar todos os VBDs abertos do vendor. | `ME` |
| `28.12` | Incluir ambos os tipos (Physical NGL e OIL) nos resultados, aplicar Sort e Filter para linhas com campos em branco quando indicado e exportar o resultado para arquivo; fornecer nome e local de salvamento. | `ME` |
| `28.12.1` | Na listagem de VBD aplicar Sort e Filter para isolar linhas com campos em branco conforme a instrução e preparar para exportação. | `ME` |
| `28.12.2` | Clicar em Export (ou equivalente) e, na janela de arquivo, definir local e nome do arquivo; clicar Save. | `ME` |
| `28.13` | No Excel do ICE usar VLOOKUP para comparar Broker Reference/Deal ID com a coluna do Excel exportado do SAP e preencher a coluna 'Status' com 'YES' quando a referência existir no SAP e 'NO' caso contrário. | `MA` |
| `28.13.1` | Inserir fórmula VLOOKUP para localizar o Broker Reference no arquivo SAP exportado; popular a coluna 'Status' com 'YES' ou 'NO'. | `ME` |
| `28.14` | Filtrar as linhas com 'Status' = 'YES' no Excel e copiar todos os números de VBD retornados para uso no VIM. | `ME` |
| `28.15` | No VIM Workplace, aba 'Other Data' → 'Search Accrual VBD', colar os números de documento VBD copiados e executar (F8) para carregar esses VBDs na invoice. | `ME` |
| `28.15.1` | Colar os VBDs no campo apropriado e pressionar Execute (F8) para recuperar os VBDs na tela. | `ME` |
| `28.16` | Selecionar todos os VBDs carregados e executar a ação 'Overwrite VBD'; então ir à aba 'Line Item' salvar e verificar o quanto foi considerado para clear e os saldos remanescentes. Limite de tolerância para invoices de comissão: Verificar o valor do Balance em 'Line Item'. O limite de tolerância para invoice de comissão é 2000 dólares; somente proceder com ajuste online quando o saldo estiver dentro desse limite. | `MA` |
| `28.16.1` | Clicar em 'Overwrite VBD' para associar os VBDs selecionados à invoice. | `ME` |
| `28.16.2` | Ir para a aba 'Line Item', clicar em Save e observar os valores de clear e balance exibidos. | `ME` |
| `28.17` | Usar o Deal ID (copiado do arquivo ICE) para consultar no LiveLink e obter o Excel de mapeamento que contém o P66 DEAL ID para VLOOKUP. | `ME` |
| `28.17.1` | No LiveLink inserir o Deal ID e executar a busca; baixar o arquivo Excel retornado (p.ex. 'ICE-OCTOBER-2023'). | `ME` |
| `28.18` | Abrir o arquivo de LiveLink e usar a coluna 'P66 DEAL ID' como chave no VLOOKUP; depois selecionar todos os dados e aplicar 'Sort' por Deal ID. | `ME` |
| `28.19` | Inspecionar a coluna Deal ID e excluir todas as entradas que começam com '994' quando o foco for Physical NGL; manter apenas os deals 992 relevantes. | `ME` |
| `28.20` | No VIM Workplace → Other Data → Search Accrual VBD colar todos os VBDs atualizados (após VLOOKUP e limpeza) e executar (F8) para recarregar os VBDs. | `ME` |
| `28.21` | Acessar a aba 'Line Item', salvar as alterações; caso o saldo esteja dentro do limite de tolerância de comissão, proceder com o processamento online; caso contrário, ajustar conforme indicado. Limite de tolerância para invoices de comissão: Verificar o valor do Balance em 'Line Item'. O limite de tolerância para invoice de comissão é 2000 dólares; somente proceder com ajuste online quando o saldo estiver dentro desse limite. | `MA` |
| `28.21.1` | Clicar em Save na aba Line Item e ler o valor do Balance. Se Balance ≤ limite de tolerância permitir alterações online; caso contrário, identificar diferença. | `MA` |
| `28.22` | No arquivo ICE filtrar as linhas com 'Status' = 'NO', copiar os Deal numbers e, no SAP Fiori, pesquisar cada Deal para verificar se existe uma linha item associada. | `MS` |
| `28.22.1` | Abrir o aplicativo SAP Fiori, colar o Deal number e executar a pesquisa; abrir a linha retornada para inspeção. | `ME` |
| `28.22.2` | Copiar todos os Deal numbers válidos encontrados no Fiori para uso em ZEWB. | `ME` |
| `28.23` | No SAP, abrir a transação ZEWB, inserir todos os Deal numbers copiados e executar (F8) para obter os VBDs que dispararam; copiar esses VBDs. | `ME` |
| `28.23.1` | Na ZEWB colar os Deal numbers no campo apropriado e pressionar Execute (F8). | `ME` |
| `28.23.2` | Copiar todos os números de VBD retornados pela ZEWB (VBDs que 'fired'). | `ME` |
| `28.24` | No VIM Workplace → Other Data → Search Accrual VBD colar os VBDs obtidos pela ZEWB, executar e usar a ação 'Append VBD' para anexá-los à invoice; confirmar campo Bill of Lading vazio antes de executar. Campo 'Bill of Lading' deve permanecer em branco antes de executar Search/Append VBD: Garantir que o campo 'Bill of Lading' esteja completamente vazio antes de pressionar Execute (F8) em Search Accrual VBD ou antes de Append VBD no VIM para evitar filtragem ou associação incorreta de VBDs. | `ME` |
| `28.24.1` | Colar os VBDs, executar a pesquisa e clicar em 'Append VBD' para vincular os documentos à invoice. | `ME` |
| `28.25` | Ir para Line Item, ajustar manualmente o valor para que o balance fique dentro do limite de tolerância (se aplicável), clicar em 'Recalculate Price' e salvar as alterações. Limite de tolerância para invoices de comissão: Verificar o valor do Balance em 'Line Item'. O limite de tolerância para invoice de comissão é 2000 dólares; somente proceder com ajuste online quando o saldo estiver dentro desse limite. | `MA` |
| `28.25.1` | Alterar o balance para zerar ou ficar dentro do limite aceitável; confirmar mudança no campo Balance. | `ME` |
| `28.25.2` | Clicar em 'Recalculate Price' e então em Save para aplicar a alteração. | `ME` |
| `28.26` | Clicar em 'Simulate Rules' para encontrar exceções; se surgir 'Suspected Duplicate', copiar o número da invoice e verificar no VIM Analytics; se confirmado não-duplicado proceder com comentário 'Non Duplicate' e salvar para postar. Procedimento em caso de 'Suspected Duplicate' detectado por Simulate Rules: Condição: Botão 'Simulate Rules' retorna exceção 'Suspected Duplicate'.. Ações: Copiar o número da invoice identificado como suspeito.; Ir para VIM Analytics e colar o número, executar pesquisa (F8).; Inspecionar o resultado: se apenas um registro estiver presente considerar não-duplicado; caso exista duplicidade real, seguir procedimento de reversão/contato conforme políticas internas (não documentadas nesta seção).; Se for não-duplicado, no VIM Workplace selecionar 'Non Duplicate', inserir comentário 'Non Duplicate' e salvar para postar.. Resultado: 28.26 · Clicar em 'Simulate Rules' para encontrar exceções; se surgir 'Suspected Duplicate', copiar o número da invoice e verificar no VIM Analytics; se confirmado não-duplicado proceder com comentário 'Non Duplicate' e salvar para postar. | `ME` |
| `28.26.1` | Clicar no botão 'Simulate Rules' e identificar eventuais exceções listadas (p.ex. Suspected Duplicate). | `ME` |
| `28.26.2` | Copiar o número da invoice e acessar VIM Analytics; colar o número e executar pesquisa para verificar se existe registro duplicado. | `MS` |
| `28.26.3` | Se a verificação retornar apenas um line item (não duplicado), no VIM Workplace selecionar Non-Duplicate, inserir comentário 'Non Duplicate' e salvar; a invoice será então postada. | `ME` |

### Step 29 — Processamento de faturas Freight & Transportation — HARLEY MARINE (classificação Trip / Non‑Trip e criação de VBD via ZEWB)

- **step_id:** `step_29`
- **macroetapa:** Routing (`roteamento`)
- **source_step_ref:** `29`
- **descrição breve:** Procedimento passo a passo para validar fatura do fornecedor Harley Marine Financing LLC, solicitar codificação ao scheduler, criar VBD no ZEWB e finalizar o processamento no VIM para codificação Non‑Trip ou Trip conforme fornecido pelo scheduler.
- **classificação consolidada:** `MS`
- **solução tecnológica:** `Workflow`
- **por que foi selecionada:** O fluxo depende da classificação Trip/Non-Trip informada pelo Scheduler e do encaminhamento para aprovação.
- **esforço:** `Alto` — estimativa relativa baseada na quantidade de sistemas, dependências, transações sensíveis, reconciliações e decisões observadas.
- **human_control:** `approval_required` — revisão humana permanece necessária para dados, exceções, aprovações e/ou transações financeiras.
- **evidence_status:** `evidenced` para a atividade atual; `needs_validation` para solução, esforço e viabilidade técnica.
- **sub-steps:** 14 registros preservados da SOP.

| Sub-step | Descrição | Classificação individual |
|---|---|---|
| `29.1` | Abra o VIM Workplace e localize a fatura do fornecedor 'Harley Marine Financing LLC'. Abra o registro da fatura para realizar validações iniciais dos campos. Validação inicial obrigatória no VIM: Confirmar presença e correção dos campos: Vendor Name, Invoice number, Invoice date, Invoice amount, Bank remittance details e Supply period antes de prosseguir. | `ME` |
| `29.2` | Comparar os campos Basic Data no VIM com a cópia original da fatura. Campos a validar: Nome do Vendor, Número da Invoice, Data da Invoice, Valor da Invoice, Dados bancários para remessa (Bank remittance) e Período de fornecimento (Supply period). Se todos os campos conferirem, prosseguir para localizar o scheduler. Conferência detalhada contra a cópia original: Comparar cada campo do Basic Data com a cópia da fatura; registrar qualquer discrepância encontrada. | `MA` |
| `29.3` | No registro da fatura, confirme o campo de descrição (Delivery to) e localize o nome do scheduler indicado. Exemplo do caso: Delivery to - BARGE NATHAN SCHMIDT; Scheduler Name - Gabriel.E.Aguirre. Anote o nome do scheduler para envio do pedido de codificação. | `ME` |
| `29.4` | Enviar ao scheduler indicado uma solicitação de codificação pedindo os detalhes de Trip ou Non‑Trip para esta fatura. Inclua no pedido a referência da invoice (número) e peça explicitamente a indicação 'Trip Related' ou 'Non‑Trip Related' e os códigos necessários para Material, Plant e Strategy conforme política interna. | `MS` |
| `29.5` | Ao receber a resposta do scheduler, registre os dados de codificação recebidos. Confirme se a resposta identifica se a fatura é 'Trip Related' ou 'Non‑Trip Related' e capture os valores de Material, Plant e Strategy fornecidos pelo scheduler. | `ME` |
| `29.6` | Decisão para escolher o fluxo ZEWB apropriado conforme a classificação informada pelo scheduler. | `ME` |
| `Decisão` | Decisão: A codificação fornecida pelo scheduler identifica a fatura como 'Trip Related' ou 'Non‑Trip Related'? O texto ou campo enviado pelo scheduler contém explicitamente o indicador 'Trip'/'Trip Related' ou 'Non‑Trip'/'Non‑Trip Related'. Non‑Trip → 29.7 · No SAP S/4, abrir a transação ZEWB (Custom Trading Expense Workbench). Selecionar a opção 'Non‑Trip Related'. Informar os valores de Material, Plant e Strategy exatamente conforme fornecido pelo scheduler e executar (Execute). Trip → 29.8 · No SAP S/4, abrir a transação ZEWB (Custom Trading Expense Workbench). Selecionar a opção 'Trip Related' (o procedimento indica apenas selecionar esta opção diferente). Informar os valores de Material, Plant e Strategy conforme fornecido pelo scheduler e executar (Execute). Observação: após esta seleção, os passos seguintes são idênticos ao fluxo Non‑Trip. | `MS` |
| `29.7` | No SAP S/4, abrir a transação ZEWB (Custom Trading Expense Workbench). Selecionar a opção 'Non‑Trip Related'. Informar os valores de Material, Plant e Strategy exatamente conforme fornecido pelo scheduler e executar (Execute). | `ME` |
| `29.8` | No SAP S/4, abrir a transação ZEWB (Custom Trading Expense Workbench). Selecionar a opção 'Trip Related' (o procedimento indica apenas selecionar esta opção diferente). Informar os valores de Material, Plant e Strategy conforme fornecido pelo scheduler e executar (Execute). Observação: após esta seleção, os passos seguintes são idênticos ao fluxo Non‑Trip. | `ME` |
| `29.9` | Após executar a consulta no ZEWB e exibir a página de resultados, selecione a linha do item correspondente e clique em 'Create Expenses' para iniciar a criação do VBD. | `MA` |
| `29.10` | Atualizar os campos de Expenses class, Accounting type, Posting Category, Posting date, Partner (Vendor code), Amount, Invoice number e Document date. Após preencher, pressionar Enter e salvar. Ao salvar, será gerado o número do documento VBD — copiar e registrar este número. Confirmação de geração e captura do número do VBD: Após salvar o VBD no ZEWB, copiar o número do documento e mantê‑lo disponível para colar no VIM (Other data → Overwrite VBD’s). | `ME` |
| `29.11` | No VIM Workplace, ir à seção 'Other data', colar o número do VBD copiado e selecionar a opção 'Overwrite VBD’s' para associar o VBD recém‑criado à fatura no VIM. | `ME` |
| `29.12` | Acessar a aba 'Accounting' no registro da fatura no VIM, atualizar/confirmar Baseline date, Payment terms e Due date conforme instruções internas e salvar as alterações. | `ME` |
| `29.13` | Na interface do VIM, selecionar 'Simulate Rules' para verificar exceções e, se aplicável, clicar em 'Apply Rules' para processar as regras de negócio. Confirmar mensagem de 'Invoice Successfully Processed' após aplicação das regras. Executar Simulate Rules e Apply Rules no VIM: Clicar em 'Simulate Rules' para identificar exceções e, se apropriado, clicar em 'Apply Rules'. Confirmar que a ação resultou em 'Invoice Successfully Processed'. | `ME` |

### Step 30 — Processo South Bow / TransCanada Keystone — reconciliação de arquivos, codificação e upload OAWD

- **step_id:** `step_30`
- **macroetapa:** Execution (`execucao`)
- **source_step_ref:** `30`
- **descrição breve:** Procedimento passo a passo para localizar e validar arquivos, reconciliar valores em planilha SOB Statement, preparar códigos e efetuar o upload e processamento da fatura SOUTH BOW (USA) LP / Phillips 66 Canada Ltd no S/4 (T-Code OAWD) e execução final no VIM Workplace.
- **classificação consolidada:** `ME + MS`
- **solução tecnológica:** `RPA / Planilha`
- **por que foi selecionada:** A reconciliação South Bow combina arquivos, fórmulas, extração de valores e upload OAWD; requer validação de saldo e integração.
- **esforço:** `Alto` — estimativa relativa baseada na quantidade de sistemas, dependências, transações sensíveis, reconciliações e decisões observadas.
- **human_control:** `review_required` — revisão humana permanece necessária para dados, exceções, aprovações e/ou transações financeiras.
- **evidence_status:** `evidenced` para a atividade atual; `needs_validation` para solução, esforço e viabilidade técnica.
- **sub-steps:** 27 registros preservados da SOP.

| Sub-step | Descrição | Classificação individual |
|---|---|---|
| `30.1` | Acesse o diretório compartilhado informado e confirme que os documentos listados estão presentes antes de iniciar o processamento. Arquivos ausentes — notificar contatos responsáveis: Um ou mais arquivos obrigatórios não estiverem presentes no caminho fonte ou no diretório de processamento. · anika.jindal@p66.com; ameerah.martinez@p66.com · e-mail | `ME` |
| `30.1.1` | Abra o caminho S:\PSX\Commercial\ACCOUNTING\Crude Accounting\Mid-Con\Wood River - Keystone\2025 e verifique a presença dos seguintes arquivos: 1) SOB Invoice Copy; 2) NOB Invoice Copy; 3) SOB Statement Output (Current month); 4) SOB Statement Output (previous month); 5) Keystone Tariff Schedule. Se algum arquivo estiver faltando, envie e-mail conforme CO_MISSING_FILES_ESCALATION. | `ME` |
| `30.2` | Depois de confirmar os arquivos no local fonte, copie todos os arquivos necessários para o diretório de trabalho usado pelo time de processamento. Arquivos ausentes — notificar contatos responsáveis: Um ou mais arquivos obrigatórios não estiverem presentes no caminho fonte ou no diretório de processamento. · anika.jindal@p66.com; ameerah.martinez@p66.com · e-mail Confirmação de cópia para pasta de processamento: Todos os arquivos verificados devem ser copiados para S:\PSX\Commercial\ACCOUNTING\BILLING\Secondary Cost \Victoria and Saravanan\Crude\Keystone\Transcanada Invoice Process\2025 antes de prosseguir. | `ME` |
| `30.2.1` | Copie todos os arquivos verificados para S:\PSX\Commercial\ACCOUNTING\BILLING\Secondary Cost \Victoria and Saravanan\Crude\Keystone\Transcanada Invoice Process\2025. Confirme que cópias exatas (mesmo nome e data) estão presentes no destino antes de prosseguir. | `ME` |
| `30.3` | Abra o arquivo 'SOB Statement Output (Current month)' e atualize as colunas C1 e C2 conforme instruções. | `ME` |
| `30.3.1` | Na aba Invoice Reconciliation do arquivo SOB Statement, insira na Coluna C1 a data do mês da fatura no formato MM/DD/YYYY (ex.: 08/01/2025). | `MA` |
| `30.3.2` | Na mesma aba, preencha a Coluna C2 com a taxa USD/CAD conforme detalhado no arquivo 'Keystone Tariff Schedule'. Utilize a taxa aplicável ao período da fatura. | `ME` |
| `30.4` | No arquivo de reconciliação, limpe/remova todas as linhas/entradas aplicadas na Coluna F (destacadas em laranja) referentes a TransCanada Keystone Pipeline LP e Phillips 66 Canada Ltd. | `MA` |
| `30.5` | Extraia as 'Deficiency fees' do sheet 'Misc Fees' dentro do arquivo 'SOB Statement' e registre o valor na Coluna F5 do Invoice Reconciliation (South Bow). | `MA` |
| `30.6` | No(s) arquivo(s) de invoice (SOB Invoice Copy), localize todas as cobranças identificadas como 'Diversion Charges' e some-as. Lance o total apurado na Coluna F6. | `ME` |
| `30.7` | Some todas as 'Variable Charges' do SOB Invoice e adicione o valor do 'Monthly Revenue Commitment'. A partir do total, deduza as 'Deficiency fees' (já registradas em F5) e registre o resultado na Coluna F7. | `ME` |
| `30.8` | Extraia o valor de 'Position Settlement' diretamente da cópia da invoice e registre-o na Coluna F8 do worksheet de reconciliação. | `MA` |
| `30.9` | Localize na cópia da invoice o campo correspondente a 'Add Variable True Up' e insira o valor apurado na Coluna F10 do arquivo de reconciliação. | `MA` |
| `30.10` | Verifique que a soma dos componentes na planilha (F5 a F10 e demais itens aplicáveis) resulte no mesmo total apresentado na SOB Invoice Copy. Objetivo: reconciliação sem diferenças. Reconciliar diferença = Nil obrigatório: A diferença de reconciliação na planilha deve ser zero (Nil) antes de preparar codificação e prosseguir com upload. | `MA` |
| `30.11` | No sheet 'Misc Fees' do 'SOB Statement', extraia as Deficiency fees atribuíveis à Phillips 66 Canada Ltd. Converta o valor para USD dividindo pela taxa em Coluna C2 (USD/CAD) e registre o resultado na Coluna F15. | `ME` |
| `30.12` | Extraia todas as 'Diversion Charges' do NOB Invoice (Phillips 66 Canada Ltd) e registre o total convertido (quando aplicável) na Coluna F16. | `ME` |
| `30.13` | Some todas as 'Variable Charges' do SOB Invoice aplicáveis à Phillips 66 Canada Ltd, acrescente o 'Monthly Revenue Commitment' e deduza as 'Deficiency fees' conforme instruções; lance o resultado na Coluna F17. | `ME` |
| `30.14` | Localize e extraia 'Abandonment Fees' da cópia da invoice (NOB Invoice) e registre o valor na Coluna F18 do worksheet. | `ME` |
| `30.15` | Confirme que o campo de diferença de reconciliação na planilha apresente valor zero (Nil). Se não estiver Nil, pare o processamento e reporte conforme UNQ_RECON_ACTIONS_UNKNOWN. Reconciliar diferença = Nil obrigatório: A diferença de reconciliação na planilha deve ser zero (Nil) antes de preparar codificação e prosseguir com upload. | `MA` |
| `30.16` | Com a reconciliação concluída (diferença Nil), documente os valores e prepare os lançamentos contábeis (GL), centro de lucro e demais campos exigidos para o lançamento da fatura. Registre estes códigos no documento de preparação de invoice. Reconciliar diferença = Nil obrigatório: A diferença de reconciliação na planilha deve ser zero (Nil) antes de preparar codificação e prosseguir com upload. | `MA` |
| `30.17` | No S/4, acesse o T-Code OAWD e efetue o upload manual do arquivo de invoice. Selecione a opção HVC Non PO durante o processo de upload. | `ME` |
| `30.17.1` | Durante o fluxo de upload em OAWD, marque/select a opção 'HVC Non PO' para classificar corretamente o tipo de documento a ser criado. | `ME` |
| `30.18` | Acesse VIM Workplace para executar a invoice carregada e atualize os dados básicos conforme instruções. | `ME` |
| `30.18.1` | No VIM Workplace, na tela de edição da invoice, faça as seguintes atualizações: Vendor code = 50392116 (South Bow (USA) LP); informe o número da invoice e a data; registre o e-mail do requestor; verifique e confirme os detalhes de remessa bancária (bank remittance). Salve as alterações. | `ME` |
| `30.19` | Na aba Line-Item do registro da invoice no VIM, insira os valores de GL account, material (quando aplicável), montante por linha e profit center conforme os detalhes preparados. Após inserir todos os dados exigidos, salve o documento. | `ME` |
| `30.20` | No campo Baseline/Payment do registro de invoice no VIM ou tela correspondente, atualize a Document date, marque Manual Entry se aplicável e ajuste o Payment term conforme consta na invoice. Salve as alterações. | `MA` |
| `30.21` | Na tela de processamento do VIM Workplace, selecione a opção 'Simulate Rules' e em seguida clique em 'Apply Rules'. Verifique que o resultado apresente indicadores verdes (success). Só prossiga se o status apresentar as luzes verdes. Confirmar estado verde após aplicar regras: Após 'Simulate Rules' e 'Apply Rules' o status deve mostrar indicadores verdes (confirmando regras aplicadas sem erros). | `ME` |

### Step 31 — Submissão de fatura em S4 para aprovação Trip / Non‑Trip (Freight & Transportation)

- **step_id:** `step_31`
- **macroetapa:** Routing (`roteamento`)
- **source_step_ref:** `31`
- **descrição breve:** Procedimento para submeter fatura no S4, categorizando-a como Non-PO e encaminhando para aprovação da Gina. Verificar se o fornecedor faz parte da lista de fornecedores Freight & Transportation (38 fornecedores) e informar o método de processamento identificado (Transport system, Auto-fired VBD, Non-PO) na submissão.
- **classificação consolidada:** `ME + MS`
- **solução tecnológica:** `Workflow`
- **por que foi selecionada:** A submissão para aprovação depende de categorização, lista de fornecedores e encaminhamento controlado no S4.
- **esforço:** `Médio` — estimativa relativa baseada na quantidade de sistemas, dependências, transações sensíveis, reconciliações e decisões observadas.
- **human_control:** `approval_required` — revisão humana permanece necessária para dados, exceções, aprovações e/ou transações financeiras.
- **evidence_status:** `evidenced` para a atividade atual; `needs_validation` para solução, esforço e viabilidade técnica.
- **sub-steps:** 9 registros preservados da SOP.

| Sub-step | Descrição | Classificação individual |
|---|---|---|
| `31.1` | No S4, abrir ou criar o documento de fatura que deve ser submetido para aprovação. Categorizar explicitamente a fatura como 'Non-PO' antes da submissão para aprovação. Classificação obrigatória como Non-PO: A fatura deve estar categorizada como 'Non-PO' no S4 antes de qualquer submissão para aprovação, conforme instrução 'Step 20'. | `MS` |
| `31.1.1` | Confirmar que os campos essenciais estão preenchidos no documento em S4: identificação do fornecedor (Vendor ID), valor da fatura, data da fatura e referência da fatura. Não modificar campos não apresentados no documento original sem autorização. | `ME` |
| `31.1.2` | Selecionar a categoria / tipo de documento que classifica a fatura como 'Non-PO'. Salvar o registro para que a categoria fique persistida antes de qualquer envio para aprovação. Classificação obrigatória como Non-PO: A fatura deve estar categorizada como 'Non-PO' no S4 antes de qualquer submissão para aprovação, conforme instrução 'Step 20'. | `MS` |
| `31.2` | Confirmar se o Vendor ID da fatura está presente na lista dos 38 fornecedores que possuem tratamento descrito (Transport system, Auto-fired VBD, Non-PO). | `MS` |
| `Decisão` | Decisão: O Vendor ID da fatura está presente na lista dos 38 fornecedores Freight & Transportation? Comparar o Vendor ID do documento com a 'lista dos 38 fornecedores Freight & Transportation (Fornecedores aprovados)'. Sim — fornecedor listado → 31.3 · Encaminhar a fatura, já categorizada como Non-PO, para aprovação da Gina no S4, incluindo na submissão a informação do método de processamento do fornecedor conforme listado (Transport system, Auto-fired VBD, Non-PO). Não — fornecedor não listado → A7 · Fornecedor não listado — Encaminhar ao scheduler para aprovação Fornecedor não listado — Encaminhar ao scheduler para aprovação Quando, na verificação, o fornecedor não constar na lista dos 38 fornecedores Freight & Transportation. ↳ A7.1 Preparar um pedido formal de aprovação ao scheduler contendo: identificação do fornecedor (Vendor ID), cópia da fatura, valor, data, e nota informando que o fornecedor não está presente na lista de 38 fornecedores. Enviar a solicitação ao scheduler e aguardar retorno de aprovação antes de proceder com a postagem. ↳ A7.1.1 Incluir na solicitação ao scheduler o motivo pelo qual o fornecedor deve ser aprovado (ex.: novo fornecedor para Freight & Transportation ou exceção temporária) e anexar evidências relevantes. ↳ A7.1.2 Registrar a solicitação de aprovação e permanecer em aguardo do retorno do scheduler. Não prosseguir com a postagem enquanto não houver autorização clara do scheduler. Resultado: pendente_aprovacao_scheduler | `MS` |
| `31.3` | Encaminhar a fatura, já categorizada como Non-PO, para aprovação da Gina no S4, incluindo na submissão a informação do método de processamento do fornecedor conforme listado (Transport system, Auto-fired VBD, Non-PO). Incluir método de processamento ao submeter: Ao submeter para aprovação da Gina, incluir na nota/observação o método de processamento do fornecedor (Transport system, Auto-fired VBD, Non-PO) conforme indicado pela lista de fornecedores. | `MS` |
| `31.3.1` | Consultar a lista (quando acessível) e inserir na nota/observação da submissão o método de processamento identificado para o fornecedor: Transport system, Auto-fired VBD ou Non-PO. Caso o método não esteja explícito na lista, registrar 'método não especificado' no campo de observações. Incluir método de processamento ao submeter: Ao submeter para aprovação da Gina, incluir na nota/observação o método de processamento do fornecedor (Transport system, Auto-fired VBD, Non-PO) conforme indicado pela lista de fornecedores. | `MS` |
| `31.3.2` | Usar a funcionalidade de submissão/fluxo de aprovação disponível no S4 para direcionar o documento à Gina para revisão e aprovação. Incluir comentário que a fatura é 'Non-PO' e apontar o método de processamento conforme registrado. Incluir método de processamento ao submeter: Ao submeter para aprovação da Gina, incluir na nota/observação o método de processamento do fornecedor (Transport system, Auto-fired VBD, Non-PO) conforme indicado pela lista de fornecedores. | `MS` |
| `31.3.3` | Após execução do envio para aprovação, verificar no S4 se há indicação de que o documento foi encaminhado para o aprovador (status de workflow ou registro de envio). Registrar ou salvar qualquer confirmação/ID de workflow no caso de auditoria. | `MS` |

## 5. Catálogo interno de soluções referenciadas

Este bloco não é uma segunda aba. Serve apenas para o mock resolver o rótulo da solução e sua família técnica.

| technology_solution | solution_family | Uso no processo | Status |
|---|---|---|---|
| RPA | `rpa` | rotinas repetitivas em OAWD, VIM, Fiori, ZEWB e exportações estruturadas | `needs_validation` |
| Workflow | `human_in_the_loop_workflow` | encaminhamento, aprovação, retorno do Scheduler e controle de estados | `needs_validation` |
| IA / Agente | `specialist_ai_assistant` | matching, reconciliação e interpretação contextual como apoio, nunca postagem autônoma | `needs_validation` |
| Evaluator / Controle | `evaluator_and_confidence_control` | validação de VBD auto-fired, duplicidade, tolerância e divergências | `needs_validation` |
| Motor de regras | `business_rules_engine` | codificação fixa, critérios explícitos e validações repetitivas | `needs_validation` |
| Analytics / Monitoramento | `analytics_and_monitoring` | cruzamentos ICE/SAP/LiveLink, reconciliação e detecção de fora de tolerância | `needs_validation` |
| RPA / Planilha | `structured_form_or_spreadsheet_automation` | transformações estruturadas, fórmulas, VLOOKUP e relatórios | `needs_validation` |

## 6. Notas de qualidade e validação

- **Rastreabilidade:** os 31 Steps principais foram derivados dos códigos inteiros da tabela “8. Procedimento”; os 849 registros foram mantidos como sub-steps, decisões ou exceções dentro do Step correspondente.
- **Classificação:** classificações individuais são heurísticas baseadas no tipo de trabalho descrito. `ME` cobre execução estruturada; `MS` cobre julgamento, decisão, encaminhamento ou regra codificável; `MA` cobre reconciliação/análise complexa; `SA` cobre execução parcialmente sistêmica.
- **Não automatizável:** a saída não presume AU/MNA apenas por haver interface ou decisão. Aprovações, exceções e transações financeiras continuam com controle humano.
- **Esforço:** não é prazo, custo, ROI ou economia. É uma priorização relativa e deve ser calibrada com arquitetura, segurança, volume, qualidade de dados e permissões SAP.
- **Pontos que exigem validação:** URLs e acessos ICE, fluxos exatos de reatribuição, upload manual de crédito Non-PO, licenças/integrações disponíveis, regras de tolerância, listas de fornecedores e procedimentos de clearing de exceções.
- **Dados ausentes:** a SOP informa frequência diária, mas não informa tempo estimado do processo nem SLA preenchido; nenhum valor foi inventado.

## 7. Checklist para a visão mockada

- [ ] Renderizar uma única tabela com as seis colunas: Macroetapa, Step, Título do Step, Classificação(ões), Solução tecnológica e Esforço.
- [ ] Ao clicar em uma linha, abrir o detalhe com título, descrição breve, classificação consolidada, solução, justificativa, esforço e sub-steps.
- [ ] Mostrar a classificação individual de cada sub-step, incluindo as linhas “Decisão”.
- [ ] Manter o frame de macroetapas e as camadas digitais sem alteração.
- [ ] Mostrar `needs_validation` nos pontos em que a SOP não comprova viabilidade técnica.
- [ ] Não criar aba separada de catálogo de soluções nem usar agrupamento principal por capacidade.
- [ ] A interface não deve usar a capacidade como agrupador principal.
