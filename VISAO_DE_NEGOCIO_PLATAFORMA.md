# Visão de Negócio da Plataforma ProcessHub (Contextus)

> **Documento Estratégico e Funcional de Negócio**  
> **Público-alvo:** Lideranças empresariais, Diretores, Gerentes de Processos/Operações, Product Owners e Especialistas de Negócio.  
> **Objetivo:** Explicar como a plataforma opera conceitualmente, quais problemas de negócio soluciona e o que as equipes conseguem realizar na prática em cada módulo (com foco em **Arquitetura de Processos** e no **Módulo de Processos**).

---

## 1. Visão Geral e Proposta de Valor

Historicamente, as iniciativas de gestão de processos nas empresas enfrentam dois grandes gargalos:
1. **Documentação morta:** Manuais, POPs e fluxogramas tornam-se obsoletos semanas após serem desenhados, ficando perdidos em pastas de rede ou intranets.
2. **Desconexão entre estratégia e execução:** A alta liderança enxerga a empresa por meio de cadeias de valor e metas financeiras, enquanto as áreas operacionais lidam com regras dispersas, rotinas manuais e sistemas legados sem conexão clara com esses objetivos.

A **ProcessHub (Contextus)** foi desenhada para atuar como o **Gêmeo Digital Operacional da Organização**. A plataforma conecta desde a visão corporativa mais ampla (cadeia de valor macro) até a minúcia operacional da execução diária, o contexto real de trabalho, a saúde dos processos e a prontidão para automação e Inteligência Artificial.

```
       +-------------------------------------------------------------+
       |           MÓDULO DE ARQUITETURA DE PROCESSOS               |
       |  (A Visão Macro: Cadeia de Valor, E2E, Taxonomia L1 -> L4) |
       +------------------------------+------------------------------+
                                      | Conecta objetivos, sistemas,
                                      | dores e FTEs à operação
                                      v
       +-------------------------------------------------------------+
       |                    MÓDULO DE PROCESSOS                      |
       |    - Ficha de Governança & Esforço (FTEs, SLAs, Riscos)     |
       |    - Documentação Viva (POP/SOP com prints e passos)        |
       |    - Modelagem Operacional (BPMN AS-IS e TO-BE)             |
       |    - Mapeamento de Contexto & Evidências Reais (Contextus)  |
       |    - Esteira de Transformação & Jazidas de Valor (TO-BE)    |
       +-------------------------------------------------------------+
```

---

## 2. Módulo de Arquitetura de Processos (A Visão Macro e Estratégica)

### 2.1. O que é sob a ótica de negócio?
O módulo de Arquitetura de Processos é o **"mapa da cidade"** da corporação. Ele organiza e padroniza a forma como a empresa funciona de ponta a ponta, permitindo que a liderança enxergue todos os macroprocessos, entenda as interdependências entre setores e identifique onde estão concentrados os recursos e as dores da operação.

### 2.2. Estrutura e Taxonomia (L1 ao L4)
A plataforma organiza a organização em até quatro níveis taxonômicos (configuráveis de acordo com a maturidade da empresa):

* **Nível 1 (L1) — Cadeias de Valor / Macroprocessos End-to-End (E2E):**
  * **Processos Primários:** Aqueles que tocam diretamente a entrega de valor ao cliente ou o coração operacional do negócio (ex.: *Source to Pay*, *Order to Cash*, *Operações Agroindustriais*, *Logística de Distribuição*).
  * **Processos de Suporte:** Processos que dão sustentação à operação (ex.: *Hire to Retire*, *Gestão Financeira e Contábil*, *TI e Infraestrutura*).
* **Nível 2 (L2) — Processos de Negócio / Grupos de Processos:**
  * Subdivisões lógicas dentro de cada cadeia E2E (ex.: dentro de *Source to Pay*, temos *Gestão de Fretes*, *Compras Diretas*, *Gestão de Fornecedores*).
* **Nível 3 (L3) — Subprocessos / Etapas de Negócio:**
  * Unidades táticas de trabalho onde os objetivos e metas de negócio acontecem (ex.: *Cotação de Frete Emergencial*, *Validação de Fatura*).
* **Nível 4 (L4) — Tarefas e Ações Operacionais:**
  * As atividades elementares executadas pelas equipes na ponta da linha (ex.: *Receber requisição*, *Consultar tabela no SAP*, *Emitir parecer de aprovação*).

### 2.3. O que você consegue fazer no Módulo de Arquitetura?
1. **Navegar de Forma Executiva e Visual (Drill-Down Interativo):**
   * Visualizar a cadeia de valor em blocos modernos e interativos.
   * Clicar em um L1 para inspecionar seus L2s e acessar a visão Mestre-Detalhe dos L3s e L4s com um clique, sem perder o fio condutor da estratégia.
2. **Gerar e Expandir a Cadeia de Valor com Inteligência Artificial:**
   * A plataforma conta com um acelerador por IA capaz de gerar uma proposta inicial de cadeia de valor completa para a sua empresa ou criar novos fluxos E2E com base no setor econômico e porte do negócio.
3. **Mapear Dados Críticos de Negócio por Processo:**
   * Para cada L3 e L4, registrar e visualizar rapidamente:
     * **Responsável e Unidade de Negócio:** Quem responde pela execução.
     * **Sistemas Utilizados:** Quais ERPs, CRMs, planilhas ou portais são exigidos.
     * **Pontos de Dor (Pain Points):** Gargalos declarados pelas equipes.
     * **Dimensionamento de FTEs:** Quantas pessoas/tempo são consumidos nessa rotina.
     * **Metas e OKRs:** A quais objetivos corporativos o processo está atrelado.
4. **Governança e Flexibilidade de Taxonomia:**
   * Customizar a nomenclatura e profundidade da árvore de processos (L2, L3 ou L4) conforme os padrões de governança adotados pela corporação.
5. **Acesso Direto à Documentação Operacional:**
   * Cada nó da arquitetura liga-se diretamente à ficha técnica detalhada e aos manuais operacionais do processo correspondente.

---

## 3. Módulo de Processos (A Operação, o Contexto Vivo e a Transformação)

Enquanto a Arquitetura dá a visão panorâmica, o **Módulo de Processos** é onde a verdade operacional reside. Ele não se limita a registrar o que a empresa "acha que faz"; ele captura como as tarefas **realmente são executadas**, diagnostica riscos e guia a transformação.

O módulo desdobra-se em seis grandes pilares de negócio:

### 3.1. Ficha do Processo & Governança da Saúde Operacional
* **Dados Mestres:** Registro unificado de dono do processo (*Process Owner*), aprovador, executor direto, equipe de apoio, frequência de execução e tempo médio de ciclo.
* **SLAs e Indicadores de Desempenho (KPIs):** Acordos de nível de serviço esperados e métricas de sucesso vinculadas à rotina.
* **Dimensionamento de Esforço da Equipe (Execution Effort):** Tabela detalhada de postos de trabalho, quantidade de colaboradores envolvidos e horas despendidas mensalmente, permitindo quantificar o custo do processo.
* **Índices de Saúde do Processo (Maturidade vs. Risco):**
  * **Automação:** Quão automatizado é o processo vs. o risco de dependência de rotinas manuais/planilhas.
  * **Integridade de Dados:** Confiabilidade das informações que entram e saem.
  * **Governança & Conformidade:** Nível de controle interno, aderência regulatória e rastreabilidade.

### 3.2. Documentação Viva — Procedimento Operacional Padrão (POP / SOP)
* **Passo a Passo Estruturado:** Construção modular de procedimentos em passos e subpassos claros, com papéis definidos e micro-atributos de controle.
* **Anotador Visual de Evidências (Image Annotator):** Possibilidade de anexar telas dos sistemas reais, destacar botões, campos e notas explicativas diretamente nas imagens, acelerando o treinamento de novas contratações e auditorias.
* **Controle de Ciclo de Vida Documental:** Indicadores visuais de versão vigente, histórico de alterações, data da última revisão e agendamento da próxima auditoria/revisão periódica.

### 3.3. Modelagem de Fluxo (BPMN AS-IS e TO-BE)
* **Visualização de Fluxo Operacional:** Diagramação em notação padrão de mercado (BPMN) organizada por raias de responsabilidade (*swimlanes*).
* **Transparência de Handoffs:** Identificação clara de momentos de transferência de bastão (humano-para-humano, humano-para-sistema ou sistema-para-sistema), onde comumente ocorrem perdas de prazos e ruídos operacionais.

### 3.4. Inteligência de Contexto e Evidências Reais (Contextus)
Este é um dos grandes diferenciais da plataforma: ir além do processo desenhado para entender a **realidade prática**:
* **Natureza da Evidência:** A plataforma categoriza as informações do processo segundo sua confiabilidade:
  * *Observada* (em gravação de tela/vídeo da rotina real);
  * *Declarada* (em entrevistas com os executores);
  * *Inferida* (detectada por IA a partir de artefatos);
  * *Confirmada* (validada formalmente por especialista).
* **Ontologia de Dados e Sistemas:**
  * Mapeamento de quais **Objetos de Dados** circulam no processo (planilhas, notas fiscais, pedidos SAP, relatórios em PDF), com seus mecanismos de transferência (manual, API, e-mail) e cadência de atualização.
  * Mapeamento de **Sistemas e Operações** (operações de leitura, escrita, cálculo ou aprovação).
* **Gestão de Regras de Negócio e Políticas:**
  * Diferenciação entre **Políticas Formais** (normas oficiais da empresa), **Práticas Relatadas** (como a equipe realmente faz) e **Heurísticas de Especialistas** (o "jeitinho" ou critérios informais que apenas os funcionários mais antigos conhecem).
  * Identificação automática de **Gaps de Política** (*Policy Gaps*) e simulação de impactos regulatórios.
* **Matriz de Decisões e Alçadas:** Mapeamento explícito de quem tem autoridade para aprovar, quais critérios objetivos devem ser seguidos e o que fazer em caso de informação faltante.
* **Revisão Guiada & Resolução de Dúvidas (Questions):** A plataforma lista automaticamente pontos obscuros, inconsistências ou lacunas no processo geradas por IA ou consultores, atribuindo perguntas aos responsáveis certos para confirmação.
* **Avaliação de Prontidão (UseCase Readiness):** Medidor de maturidade que informa se o processo já está suficientemente maduro para:
  * Documentação Operacional básica;
  * Redesenho estruturado;
  * Quantificação de ganhos financeiros;
  * Implementação de **Agentes Autônomos de Inteligência Artificial**.

### 3.5. Esteira de Transformação e Redesenho (TO-BE Orientado a Valor)
O módulo de processos inclui um ambiente completo para desenhar o futuro da operação:
* **Identificação de "Jazidas de Valor" (Value Mines):** Reconhece atividades críticas que concentram a maior oportunidade de redução de custos, mitigação de riscos ou aumento de receita.
* **Árvore de Valor (Value Tree):** Conecta os indicadores e dores da ponta da linha aos grandes resultados de negócio almejados pela diretoria executiva.
* **Definição de Níveis de Autonomia (1 a 7):** Permite desenhar o futuro definindo o papel de cada agente:
  * *Nível 1:* Execução 100% humana;
  * *Nível 2-3:* Humano apoiado por copiloto inteligente ou preparação de dados por IA;
  * *Nível 4-5:* IA executando tarefas com supervisão humana ou dentro de limites pré-aprovados de alçada;
  * *Nível 6-7:* Automação e registro determinísticos em sistemas de retaguarda.
* **Mapeamento de Gaps Fundacionais:** Aponta quais impedimentos técnicos (dados sujos, APIs inexistentes, falta de segurança ou políticas desatualizadas) precisam ser resolvidos antes de automatizar.
* **Plano de Ação em Ondas (Action Plan Waves):** Estrutura a implementação da melhoria em etapas ordenadas (Fundamentos, Piloto, Escala), com marcos de esforço, risco e responsáveis.

### 3.6. Assistente de IA Integrado (Process Assistant)
* Suporte em tempo real para colaboradores e gestores consultarem dúvidas sobre a execução do processo via chat em linguagem natural, além de sugerir otimizações de campos e etapas automaticamente.

---

## 4. Quadro Comparativo: O que cada módulo resolve?

| Dimensão de Negócio | Módulo de Arquitetura de Processos | Módulo de Processos (Gestão, Contextus & TO-BE) |
| :--- | :--- | :--- |
| **Pergunta central** | *"Quais são os processos da nossa empresa e como eles se relacionam?"* | *"Como este processo específico funciona hoje, quem faz, quais são os dados/regras e como podemos otimizá-lo?"* |
| **Nível de atuação** | Estratégico e Corporativo (Visão da Cadeia de Valor) | Tático e Operacional (Visão Detalhada da Execução) |
| **Níveis atendidos** | Macroprocessos L1, Processos L2, Subprocessos L3 e Tarefas L4 | Detalhamento profundo do L3/L4 |
| **Principais entregas** | Mapa E2E, cadeias primárias/suporte, taxonomia corporativa, distribuição de FTEs e dores | POP/SOP visual, BPMN, Gêmeo Digital de Contexto, Matriz de Decisão, Ficha de Saúde e Esteira TO-BE |
| **Aporte de IA** | Geração automática de cadeias de valor com base no setor e perfil da empresa | Diagnóstico de ambiguidades, detecção de regras, sugestão de melhorias, chat assistente e prontidão para agentes |
| **Público principal** | Diretoria, Escritório de Processos (BPMO), Transformação Digital e Consultoria | Gerentes de Área, Coordenadores, Analistas de Processos, Auditores e Executores na ponta |

---

## 5. A Jornada Prática do Negócio na Plataforma

Na prática, uma liderança de negócio utiliza a plataforma seguindo um fluxo contínuo de valor:

1. **Construção do Mapa Corporativo (Arquitetura):** A empresa cadastra ou gera com auxílio da IA a sua cadeia de valor primária e de suporte (L1 a L4), obtendo visão imediata do escopo da organização.
2. **Priorização por Gargalos e Esforço:** Através dos dados de FTEs, sistemas e pontos de dor mapeados na arquitetura, a diretoria escolhe os processos mais críticos para atuar.
3. **Mergulho no Processo Selecionado:** Ao abrir o processo, a equipe acessa a Ficha Técnica, verifica o dimensionamento de esforço e revisa o POP (procedimento operacional com telas reais do sistema).
4. **Mapeamento da Verdade Operacional (Contexto):** Levantamento das evidências reais de execução, regras de negócio aplicadas e objetos de dados trafegados, sanando dúvidas com os executores.
5. **Redesenho Orientado a Valor (Esteira de Transformação):** O processo é elevado a um novo patamar (TO-BE), com aplicação de níveis de autonomia para inteligência artificial, superação de gaps técnicos e plano de ação estruturado em ondas.
