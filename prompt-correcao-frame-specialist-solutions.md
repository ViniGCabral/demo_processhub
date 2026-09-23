# Prompt — Correção pontual do frame e das Specialist Solutions

Você vai corrigir **somente o conteúdo** do frame atual e do bloco `Specialist Solutions`/`Specialized Agents` da tela.

## Regra de segurança — preserve tudo que não foi solicitado

Não altere:

- layout, dimensões, espaçamentos ou estilo visual geral;
- header, menu, breadcrumbs, navegação ou abas;
- as cinco macroetapas e sua ordem visual;
- camadas `Human-in-the-loop`, `Digital Agent`, `Orchestrator Agent`, `MCP / Integration Layer`, `Anomaly Detection / Evaluator`;
- tabela única de Steps;
- drawer/painel de detalhamento dos Steps;
- classificações, esforço, sub-steps e demais dados já corretos;
- nomes de arquivos, contratos ou componentes não relacionados a esta correção.

Não faça redesign. Não crie uma nova tela. Faça apenas um ajuste de dados, mapeamento e apresentação nos pontos descritos abaixo.

---

# 1. Corrigir o conteúdo das macroetapas

Mantenha exatamente esta ordem:

```text
Intake → Routing → Execution → Exception → Codification
```

As macroetapas não devem exibir uma lista de Steps. Os Steps continuam somente na tabela de detalhamento.

Cada macroetapa deve mostrar poucos cards ou frases curtas, específicos do processo analisado.

## Intake

Mover para `Intake` tudo que representa a entrada do processo:

- evento que inicia o caso;
- fatura recebida;
- solicitação recebida;
- mailbox, arquivo ou documento de entrada;
- documentos de suporte;
- Nomination Key ou referência inicial, quando aplicável.

Não colocar em Intake resultados finais, regras de aprovação, exceções ou atividades de execução.

## Routing

Mover para `Routing` tudo que representa regra ou decisão de encaminhamento:

- Trip / Non-Trip;
- fornecedor, categoria ou tipo de documento;
- Company Code, GL ou Profit Center;
- fila, Scheduler, responsável ou alçada;
- regras que determinam o próximo caminho do caso.

Não colocar em Routing a execução operacional ou o resultado final.

## Execution

Mostrar apenas um resumo curto da execução, por exemplo:

```text
Validar, reconciliar e processar faturas.
Criar ou atualizar VBDs e documentos financeiros.
Executar lançamentos nos sistemas corporativos.
```

Não renderizar os Steps individualmente dentro de Execution.

## Exception

Mover para `Exception` tudo que representa divergência, falta de informação, bloqueio ou decisão humana:

- dados ou documentos ausentes;
- divergência de valores ou reconciliação;
- material incorreto ou inexistente;
- falha de integração ou processamento;
- correção intercompany;
- aprovação, recusa, devolução ou escalonamento.

Mostrar também os responsáveis reais identificados no processo, como Analista, Scheduler, Supervisor, Contabilidade, MDG ou área solicitante.

Formato recomendado:

```text
Documento ausente → Analista / Scheduler
Material incorreto → MDG
Divergência financeira → Supervisor / Contabilidade
```

## Codification

Mover para `Codification` os resultados e evidências finais:

- fatura processada;
- VBD criado ou atualizado;
- lançamento financeiro realizado;
- Credit Memo ou Debit Memo emitido;
- relatório ou arquivo final gerado;
- evidência, histórico ou trilha de auditoria preservados.

Codification representa a saída/resultato final do processo. Não deve conter entradas ou regras de roteamento.

---

# 2. Corrigir Specialist Solutions / Specialized Agents

O bloco deve mostrar soluções específicas do processo, e não apenas famílias genéricas.

Não exibir somente:

```text
RPA
Workflow
IA
Agente especialista
```

Esses termos podem aparecer como **tipo tecnológico**, mas cada item precisa ter um nome específico e uma finalidade operacional clara.

Cada solução deve conter:

```text
Tipo tecnológico
Nome específico da solução
Descrição curta do que ela faz
Steps atendidos
Status de validação
```

Exemplos de nomes adequados:

```text
RPA — Upload e preenchimento de faturas no SAP/VIM
Workflow — Roteamento de aprovações e retorno do Scheduler
IA / Agente — Matching entre fatura, VBD e Nomination Key
Evaluator — Detecção de duplicidade e valores fora de tolerância
Motor de regras — Codificação por fornecedor e tipo de fatura
Analytics — Reconciliação de valores, entregas e tolerâncias
RPA / Planilha — Consolidação de relatórios e arquivos de apoio
```

A descrição deve ter uma ou duas frases curtas e responder:

> O que esta solução faz no processo?

Não invente nomes de produtos, fornecedores, APIs, licenças ou integrações que não estejam no output ou na SOP.

## Regras de consolidação

- Consolidar soluções equivalentes.
- Não misturar soluções diferentes apenas porque têm o mesmo tipo tecnológico.
- Se a mesma família tecnológica tiver finalidades muito diferentes, criar itens separados por finalidade.
- Não perder nenhuma solução vinculada a um Step.
- Cada solução deve ter um `solution_id` estável.
- Cada Step deve apontar para uma solução por `solution_id`.
- Mostrar a quantidade ou lista de Steps atendidos quando houver espaço.
- Usar `needs_validation` quando a SOP não comprovar a viabilidade técnica.

Modelo mínimo:

```javascript
{
  "solution_id": "solution_invoice_upload_vim",
  "technology_type": "rpa",
  "technology_solution": "RPA",
  "solution_name": "Upload e preenchimento de faturas no SAP/VIM",
  "short_description": "Automatiza o upload e o preenchimento de campos estruturados.",
  "step_ids": ["step_01", "step_03"],
  "status": "needs_validation"
}
```

---

# 3. Fonte dos dados e fallback seguro

Use nesta ordem:

1. o output atualizado da SOP;
2. os dados atuais do frontend;
3. o conteúdo da própria SOP, se ela estiver disponível.

Antes de criar dados novos, verifique se já existem no output:

- `trigger_inputs`;
- `business_rules`;
- `execution_summary`;
- `exception_owners`;
- `outputs`;
- `solution_recommendations`;
- `solution_id`, `solution_name`, `short_description` e `step_ids`.

Se os campos existirem, apenas faça o adapter de apresentação e corrija o mapeamento.

Se algum campo não existir, derive-o somente de evidências existentes em `step_mapping` e `substeps`. Não invente conteúdo específico. Se não houver evidência suficiente, exiba `needs_validation` ou uma nota de dado ausente.

Não rerode a análise da SOP nem altere o prompt produtor, a menos que algum campo essencial não possa ser obtido pelo output atual ou por derivação rastreável.

---

# 4. Critérios de aceite

A correção estará concluída quando:

1. O frame continuar com as cinco macroetapas na ordem original.
2. Intake mostrar entradas concretas do processo.
3. Routing mostrar regras e critérios de encaminhamento.
4. Execution mostrar apenas um resumo curto da execução.
5. Exception mostrar tipos de exceção e responsáveis.
6. Codification mostrar resultados e evidências finais.
7. Nenhuma macroetapa exibir uma lista de Steps.
8. Specialist Solutions mostrar nomes específicos, descrições curtas, tipo tecnológico e Steps atendidos.
9. Soluções equivalentes estiverem consolidadas sem perda de cobertura.
10. Cada Step continuar vinculado à sua solução por `solution_id`.
11. A tabela única de Steps e o detalhe dos Steps permanecerem inalterados.
12. Nenhuma informação, tecnologia, integração, licença ou produto tiver sido inventado.
13. O status `needs_validation` aparecer onde a evidência técnica não existir.
14. O visual geral da tela permanecer igual, com alteração somente do conteúdo solicitado.

Ao concluir, informe objetivamente:

- quais campos foram reutilizados do output;
- quais conteúdos foram apenas remapeados no adapter;
- quais soluções foram consolidadas ou renomeadas;
- quais pontos permanecem `needs_validation`;
- quais arquivos/componentes foram alterados.
