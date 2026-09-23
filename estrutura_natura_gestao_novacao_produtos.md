# Especificação de carga — Gestão de Novação de Produtos | Natura

## Objetivo da carga

Subir na aplicação a estrutura de Arquitetura de Processos abaixo, usando a hierarquia configurável da empresa e a ficha padronizada de escopo e contexto.

A carga deve criar os níveis, os relacionamentos de composição, os campos de contexto e os 12 processos operacionais dentro de **Conceituação e Briefing**.

Os conteúdos abaixo devem ser registrados como dados da arquitetura, não como texto de documentação. Cada campo deve ser persistido na entidade correspondente e aparecer na tela de detalhamento do nível ou processo.

---

# 1. Regras de cadastro

## 1.1. Hierarquia

Usar esta estrutura:

```text
L1 Gestão de Novação de Produtos
├── L2 Funil de Produtos
│   ├── L3 Conceituação e Briefing
│   │   ├── L4 Identificar oportunidades para o negócio
│   │   ├── L4 Desenvolver conceito e proposta de valor
│   │   ├── L4 Pesquisar e validar conceito e proposta de valor
│   │   ├── L4 Definir design de produto — Qualidade, DLL e Regulatório
│   │   ├── L4 Desenhar arquitetura de portfólio
│   │   ├── L4 Definir diretrizes de design
│   │   ├── L4 Definir diretrizes de qualidade
│   │   ├── L4 Avaliar impacto ambiental
│   │   ├── L4 Construir o business case (BC)
│   │   ├── L4 Realizar análise financeira
│   │   ├── L4 Criar projeto no sistema e carregar informações estratégicas
│   │   └── L4 Realizar Gate BF — aprovação e passagem para kick-off técnico
│   ├── L3 Prototipagem
│   ├── L3 Validação
│   └── L3 Disponibilização
└── L2 Funil de Tecnologia
    ├── L3 Prospecção e Ideação
    ├── L3 Desenvolvimento de Insumos
    ├── L3 Tecnologias de Ingredientes e Formulações
    ├── L3 Desenvolvimento de Materiais e Embalagens
    ├── L3 Produto Ampliado
    └── L3 Metodologias e Modelos
```

## 1.2. Tipos de objeto

Usar os tipos abaixo nos registros:

| Registro | Tipo de objeto | Comportamento na aplicação |
|---|---|---|
| Gestão de Novação de Produtos | Domínio | Exibe visão estratégica e composição dos dois funis. |
| Funil de Produtos | Agrupamento de valor | Exibe as quatro etapas do funil e seus relacionamentos. |
| Funil de Tecnologia | Agrupamento de capacidades | Exibe as seis frentes tecnológicas. |
| Conceituação e Briefing | Etapa de valor | Exibe a composição dos 12 processos operacionais. |
| Prototipagem, Validação e Disponibilização | Etapa de valor | Exibe o contexto da etapa e pode receber processos posteriormente. |
| Demais itens L3 do Funil de Tecnologia | Capacidade tecnológica | Exibe o contexto da frente e pode receber processos posteriormente. |
| 12 itens dentro de Conceituação e Briefing | Processo operacional | Exibe ficha operacional, fluxo, SOP/BPMN, regras, entradas, saídas e automação. |

## 1.3. Campos obrigatórios para todos os registros

Criar ou preencher estes campos em cada nível:

- Nome;
- Tipo de objeto;
- Nível da cadeia;
- Responsável;
- Unidade de negócio;
- Dimensionamento;
- Objetivo;
- Proposta de valor;
- Fronteira de escopo;
- Entradas e direcionadores;
- Saídas e entregas;
- Destinos e stakeholders;
- Composição;
- Indicadores;
- Sistemas e dados;
- Normativos e políticas vinculadas;
- Dores, riscos e oportunidades;
- Data de revisão;
- Status de documentação;
- Status de contexto.

A **Unidade de negócio** deve ser criada sem valor preenchido nos registros abaixo. Manter o campo disponível para preenchimento posterior, sem inserir texto substituto como “a definir”, “não informado” ou “N/A”.

O **Responsável** deve ser preenchido com o papel ou função responsável indicado em cada registro. Quando houver mais de uma área participante, usar o responsável principal no campo Responsável e registrar as demais áreas em Destinos e stakeholders ou nos relacionamentos do componente.

O **Dimensionamento** deve ser registrado em FTEs alocados. Usar os valores definidos abaixo como dimensionamento inicial. Persistir também a unidade `FTE` e a data de referência da carga como `2026-09-22`.

O **Status de documentação** deve ser `Em estruturação` para os níveis arquiteturais e `Pronto para detalhamento operacional` para os 12 processos L4.

O **Status de contexto** deve ser `Estruturado` para todos os registros desta carga.

---

# 2. L1 — Gestão de Novação de Produtos

## Registro

| Campo | Valor para carga |
|---|---|
| **Nome** | Gestão de Novação de Produtos |
| **Tipo de objeto** | Domínio |
| **Nível** | L1 |
| **Responsável** | Diretoria de Inovação e Desenvolvimento de Produtos |
| **Unidade de negócio** |  |
| **Dimensionamento** | 42 FTEs alocados |
| **Data de referência do dimensionamento** | 22/09/2026 |
| **Objetivo** | Gerenciar a evolução do portfólio de produtos, transformando oportunidades de mercado, necessidades dos consumidores e capacidades tecnológicas em produtos inovadores, viáveis, seguros e disponibilizados para o mercado. |
| **Proposta de valor** | Aumentar a qualidade e a previsibilidade das decisões de inovação, conectando estratégia, consumidores, formulação, materiais, tecnologia, viabilidade financeira, qualidade, requisitos regulatórios e disponibilização do produto. |
| **Fronteira de escopo** | Abrange a gestão dos funis de produtos e de tecnologia, desde a identificação de oportunidades e ideação até as decisões de conceituação, prototipagem, validação e disponibilização. O domínio coordena a passagem entre as etapas e a decisão de continuidade das iniciativas. |
| **Entradas e direcionadores** | Tendências e necessidades de consumidores; estratégia e prioridades de portfólio; oportunidades de mercado; aprendizados de produtos existentes; capacidades de ingredientes, formulações, materiais e embalagens; requisitos de qualidade e regulatórios; restrições de custo, prazo e capacidade; metas de sustentabilidade. |
| **Saídas e entregas** | Conceitos priorizados; briefs aprovados; business cases; projetos autorizados; protótipos e soluções validadas; decisões de gate; produtos disponibilizados; aprendizados e informações estratégicas registrados no sistema. |
| **Destinos e stakeholders** | Consumidores; Marketing e Brand; Consumer Insights; Pesquisa e Desenvolvimento; Qualidade; Assuntos Regulatórios; Suprimentos; Operações industriais; Engenharia; Finanças; Tecnologia; Sustentabilidade; Comercial; fornecedores e parceiros de inovação. |
| **Composição** | L2 Funil de Produtos; L2 Funil de Tecnologia. |
| **Indicadores** | Número de oportunidades de inovação em cada etapa do funil; tempo médio da ideia até a aprovação do projeto; taxa de conversão entre gates; percentual de projetos com brief completo; percentual de projetos com business case aprovado; aderência ao prazo planejado de inovação; percentual de produtos lançados dentro do custo-alvo; receita ou margem associada a produtos lançados; percentual de produtos com requisitos de qualidade, regulatórios e sustentabilidade atendidos; taxa de retrabalho entre etapas. |
| **Sistemas e dados** | Plataforma de gestão do portfólio e projetos; sistema de gestão de inovação ou ideação; ferramentas de pesquisa e insights de consumidores; sistemas de formulação, materiais e especificações; ERP e sistemas financeiros; sistemas de qualidade e assuntos regulatórios; repositórios de documentos e conhecimento; ferramentas de colaboração e aprovação. |
| **Normativos e políticas vinculadas** | Política de inovação e gestão de portfólio; diretrizes de qualidade e segurança de produtos; requisitos de assuntos regulatórios; políticas de sustentabilidade e impacto ambiental; políticas de propriedade intelectual e confidencialidade; diretrizes de aprovação de investimentos e business case; normas de gestão de projetos, gates e documentação. |
| **Dores, riscos e oportunidades** | Falta de rastreabilidade entre oportunidade, conceito, decisão de gate e produto final; informações de diferentes áreas mantidas em sistemas ou documentos desconectados; retrabalho por mudanças tardias em conceito, formulação, embalagem ou requisitos regulatórios; critérios de decisão diferentes entre projetos ou categorias; baixa visibilidade do esforço e da capacidade alocada por iniciativa; necessidade de integrar dados de produto, tecnologia, qualidade, finanças e sustentabilidade; oportunidade de usar IA para consolidar informações, identificar lacunas de briefing e apoiar priorização. |
| **Data de revisão** | 22/09/2026 |
| **Status de documentação** | Em estruturação |
| **Status de contexto** | Estruturado |

## Relações do L1

Criar relações de composição:

```text
Gestão de Novação de Produtos
├── contém → Funil de Produtos
└── contém → Funil de Tecnologia
```

Criar relações de contribuição:

```text
Funil de Tecnologia
└── fornece capacidades e soluções técnicas para → Funil de Produtos
```

---

# 3. L2 — Funil de Produtos

## Registro

| Campo | Valor para carga |
|---|---|
| **Nome** | Funil de Produtos |
| **Tipo de objeto** | Agrupamento de valor |
| **Nível** | L2 |
| **Responsável** | Gerência de Inovação de Produtos e Gestão de Portfólio |
| **Unidade de negócio** |  |
| **Dimensionamento** | 24 FTEs alocados |
| **Data de referência do dimensionamento** | 22/09/2026 |
| **Objetivo** | Conduzir oportunidades de produto por etapas estruturadas de conceituação, prototipagem, validação e disponibilização, permitindo decisões progressivas de investimento e continuidade. |
| **Proposta de valor** | Transformar oportunidades em produtos com conceito claro, proposta de valor relevante, viabilidade demonstrada e prontidão para disponibilização. |
| **Fronteira de escopo** | Inicia na identificação ou priorização de uma oportunidade de produto e termina na disponibilização do produto para a etapa operacional ou comercial definida. Inclui o direcionamento do conceito, o desenvolvimento, as validações e as decisões de gate do funil. |
| **Entradas e direcionadores** | Oportunidades de mercado; necessidades de consumidores; estratégia de categoria; insights; briefings; capacidades técnicas; restrições de custo, prazo e sustentabilidade; decisões de portfólio; informações fornecidas pelo Funil de Tecnologia. |
| **Saídas e entregas** | Conceitos e briefs aprovados; protótipos; resultados de validação; business cases; decisões de gate; produto liberado para disponibilização. |
| **Destinos e stakeholders** | Marketing; Consumer Insights; P&D; Tecnologia; Qualidade; Regulatório; Finanças; Operações; Supply; Sustentabilidade; liderança de portfólio; fornecedores e parceiros. |
| **Composição** | L3 Conceituação e Briefing; L3 Prototipagem; L3 Validação; L3 Disponibilização. |
| **Indicadores** | Quantidade de iniciativas por etapa; tempo médio em cada etapa; conversão de iniciativas entre gates; percentual de iniciativas com dados obrigatórios completos; percentual de iniciativas dentro do prazo; número de retornos ou retrabalhos entre etapas; capacidade disponível versus demanda do funil. |
| **Sistemas e dados** | Cadastro de iniciativas e projetos; portfólio de produtos; briefing e business case; dados de consumidores e mercado; documentos técnicos e regulatórios; registros de validação e decisões de gate. |
| **Normativos e políticas vinculadas** | Governança de portfólio; critérios de gate e aprovação; diretrizes de qualidade e segurança; diretrizes regulatórias; sustentabilidade e impacto ambiental; aprovação financeira e de investimento. |
| **Dores, riscos e oportunidades** | Critérios de passagem de etapa pouco explícitos; decisões distribuídas em reuniões, e-mails e documentos; lacunas de informação identificadas somente em etapas avançadas; dependências entre produto e tecnologia não visíveis no funil; falta de visão consolidada de capacidade, prazo, custo e risco; oportunidade de automatizar a verificação de completude antes dos gates. |
| **Data de revisão** | 22/09/2026 |
| **Status de documentação** | Em estruturação |
| **Status de contexto** | Estruturado |

## Composição do L2

Criar os quatro filhos:

1. L3 Conceituação e Briefing;
2. L3 Prototipagem;
3. L3 Validação;
4. L3 Disponibilização.

## Relações entre os L3

Registrar as relações de alto nível abaixo. Elas representam o encadeamento do funil, mas não substituem os fluxos dos processos L4:

```text
Conceituação e Briefing
└── precede → Prototipagem

Prototipagem
└── precede → Validação

Validação
└── precede → Disponibilização

Validação
└── pode retornar para → Conceituação e Briefing

Prototipagem
└── depende de capacidades de → Funil de Tecnologia
```

---

# 4. L2 — Funil de Tecnologia

## Registro

| Campo | Valor para carga |
|---|---|
| **Nome** | Funil de Tecnologia |
| **Tipo de objeto** | Agrupamento de capacidades |
| **Nível** | L2 |
| **Responsável** | Diretoria de Tecnologia e Desenvolvimento Técnico |
| **Unidade de negócio** |  |
| **Dimensionamento** | 31 FTEs alocados |
| **Data de referência do dimensionamento** | 22/09/2026 |
| **Objetivo** | Desenvolver e disponibilizar capacidades, insumos, formulações, materiais, embalagens, produtos ampliados, metodologias e modelos necessários para viabilizar a inovação de produtos. |
| **Proposta de valor** | Converter desafios e oportunidades de produto em soluções técnicas aplicáveis, escaláveis, seguras, sustentáveis e compatíveis com os requisitos do negócio. |
| **Fronteira de escopo** | Abrange a prospecção e ideação tecnológica, desenvolvimento de insumos, ingredientes, formulações, materiais, embalagens, produtos ampliados e metodologias ou modelos. Inclui a entrega de capacidades técnicas para o Funil de Produtos. |
| **Entradas e direcionadores** | Desafios de produto; demandas do Funil de Produtos; tendências científicas e tecnológicas; requisitos de qualidade e regulatório; metas de custo e sustentabilidade; capacidades internas e externas; demandas de escalabilidade industrial. |
| **Saídas e entregas** | Tecnologias; ingredientes; formulações; materiais; embalagens; produtos ampliados; metodologias e modelos prontos para avaliação, prototipagem ou aplicação. |
| **Destinos e stakeholders** | Funil de Produtos; P&D; Qualidade; Regulatório; Engenharia; Operações; Supply; fornecedores; parceiros; centros de pesquisa e manufatura. |
| **Composição** | L3 Prospecção e Ideação; L3 Desenvolvimento de Insumos; L3 Tecnologias de Ingredientes e Formulações; L3 Desenvolvimento de Materiais e Embalagens; L3 Produto Ampliado; L3 Metodologias e Modelos. |
| **Indicadores** | Quantidade de soluções tecnológicas no funil; tempo médio de desenvolvimento; taxa de soluções aplicadas em projetos de produto; percentual de soluções aprovadas tecnicamente; aderência a custo e prazo; percentual de requisitos de qualidade e sustentabilidade atendidos. |
| **Sistemas e dados** | Repositório de pesquisa e tecnologia; sistemas de formulação; sistemas de materiais e embalagens; laboratório e especificações; gestão de projetos; gestão de qualidade; repositório de propriedade intelectual. |
| **Normativos e políticas vinculadas** | Governança de tecnologia; qualidade e segurança de produtos; requisitos regulatórios; sustentabilidade; propriedade intelectual; confidencialidade; gestão de fornecedores e parceiros técnicos. |
| **Dores, riscos e oportunidades** | Dependências técnicas identificadas tarde; informações de laboratório e desenvolvimento distribuídas; dificuldade para reutilizar soluções já desenvolvidas; baixa visibilidade de capacidade técnica; oportunidade de conectar necessidades do Funil de Produtos ao portfólio de soluções tecnológicas. |
| **Data de revisão** | 22/09/2026 |
| **Status de documentação** | Em estruturação |
| **Status de contexto** | Estruturado |

## Composição do L2

Criar os seis filhos:

1. L3 Prospecção e Ideação;
2. L3 Desenvolvimento de Insumos;
3. L3 Tecnologias de Ingredientes e Formulações;
4. L3 Desenvolvimento de Materiais e Embalagens;
5. L3 Produto Ampliado;
6. L3 Metodologias e Modelos.

---

# 5. L3 — Conceituação e Briefing

## Registro

| Campo | Valor para carga |
|---|---|
| **Nome** | Conceituação e Briefing |
| **Tipo de objeto** | Etapa de valor |
| **Nível** | L3 |
| **Responsável** | Gerência de Conceituação e Briefing de Produtos |
| **Unidade de negócio** |  |
| **Dimensionamento** | 16 FTEs alocados |
| **Data de referência do dimensionamento** | 22/09/2026 |
| **Objetivo** | Transformar oportunidades em conceitos de produto estruturados, avaliados e documentados, com proposta de valor, diretrizes técnicas, requisitos de qualidade, impactos ambientais, viabilidade financeira e decisão de passagem para desenvolvimento. |
| **Proposta de valor** | Criar clareza e alinhamento antes do investimento em prototipagem, reduzindo ambiguidades, retrabalho e riscos de desenvolver soluções sem aderência ao consumidor, ao negócio ou às restrições técnicas e regulatórias. |
| **Fronteira de escopo** | Inicia com a identificação de uma oportunidade para o negócio e termina com a aprovação do business case e a passagem de Gate BF para o kick-off técnico. Inclui conceito, pesquisa, arquitetura de portfólio, diretrizes de design e qualidade, impacto ambiental, business case, análise financeira e registro do projeto. |
| **Entradas e direcionadores** | Oportunidade de negócio; insights de consumidor; estratégia de categoria; tendências; proposta de valor inicial; diretrizes de design; diretrizes de qualidade; requisitos regulatórios; dados técnicos; premissas financeiras; metas ambientais; capacidades do Funil de Tecnologia. |
| **Saídas e entregas** | Conceito e proposta de valor estruturados; arquitetura de portfólio; diretrizes de design e qualidade; avaliação de impacto ambiental; business case; análise financeira; projeto criado no sistema; informações estratégicas carregadas; decisão de Gate BF; passagem para kick-off técnico. |
| **Destinos e stakeholders** | Negócio; Marketing; Consumer Insights; P&D; Tecnologia; Qualidade; Regulatório; Finanças; Sustentabilidade; Operações; Supply; Gestão de Portfólio; liderança decisora e equipe do kick-off técnico. |
| **Composição** | 12 processos L4 descritos na seção seguinte. |
| **Indicadores** | Tempo total de Conceituação e Briefing; percentual de briefings completos; percentual de conceitos aprovados; taxa de retorno para ajustes; tempo de elaboração do business case; percentual de gates com documentação completa; tempo entre aprovação e kick-off técnico; retrabalho por etapa. |
| **Sistemas e dados** | Sistema de gestão de inovação; portfólio de produtos; repositório de briefs; ferramentas de pesquisa; sistemas de qualidade e regulatório; modelos financeiros; sistema corporativo de projetos; repositório de documentos e aprovações. |
| **Normativos e políticas vinculadas** | Governança de inovação; critérios de Gate BF; política de gestão de portfólio; diretrizes de design; qualidade e segurança de produtos; requisitos regulatórios; sustentabilidade e impacto ambiental; aprovação financeira e investimentos; propriedade intelectual e confidencialidade. |
| **Dores, riscos e oportunidades** | Informações de conceito, qualidade, regulatório, sustentabilidade e finanças distribuídas em fontes diferentes; requisitos críticos identificados tardiamente; retrabalho entre áreas; falta de critérios objetivos para passagem de gate; demora para consolidar o business case; falta de rastreabilidade entre decisão e projeto; oportunidade de usar IA para verificar completude, resumir evidências e apontar conflitos ou lacunas. |
| **Data de revisão** | 22/09/2026 |
| **Status de documentação** | Em estruturação |
| **Status de contexto** | Estruturado |

## Composição do L3

Criar os 12 filhos abaixo como processos L4:

1. Identificar oportunidades para o negócio;
2. Desenvolver conceito e proposta de valor;
3. Pesquisar e validar conceito e proposta de valor;
4. Definir design de produto — Qualidade, DLL e Regulatório;
5. Desenhar arquitetura de portfólio;
6. Definir diretrizes de design;
7. Definir diretrizes de qualidade;
8. Avaliar impacto ambiental;
9. Construir o business case (BC);
10. Realizar análise financeira;
11. Criar projeto no sistema e carregar informações estratégicas;
12. Realizar Gate BF — aprovação e passagem para kick-off técnico.

## Relações entre os processos L4

Criar as relações abaixo no cadastro. A relação entre os L4 deve permitir paralelismo, retorno e decisão alternativa no fluxo operacional:

```text
1 Identificar oportunidades para o negócio
└── precede → 2 Desenvolver conceito e proposta de valor

2 Desenvolver conceito e proposta de valor
└── precede → 3 Pesquisar e validar conceito e proposta de valor

3 Pesquisar e validar conceito e proposta de valor
├── precede → 4 Definir design de produto — Qualidade, DLL e Regulatório
└── pode retornar para → 2 Desenvolver conceito e proposta de valor

4 Definir design de produto — Qualidade, DLL e Regulatório
├── fornece direcionadores para → 6 Definir diretrizes de design
├── fornece direcionadores para → 7 Definir diretrizes de qualidade
└── fornece direcionadores para → 8 Avaliar impacto ambiental

5 Desenhar arquitetura de portfólio
├── recebe entrada de → 3 Pesquisar e validar conceito e proposta de valor
└── fornece direcionadores para → 9 Construir o business case (BC)

6 Definir diretrizes de design
└── fornece entrada para → 9 Construir o business case (BC)

7 Definir diretrizes de qualidade
└── fornece entrada para → 9 Construir o business case (BC)

8 Avaliar impacto ambiental
└── fornece entrada para → 9 Construir o business case (BC)

9 Construir o business case (BC)
└── fornece entrada para → 10 Realizar análise financeira

10 Realizar análise financeira
└── fornece entrada para → 11 Criar projeto no sistema e carregar informações estratégicas

11 Criar projeto no sistema e carregar informações estratégicas
└── fornece pacote de decisão para → 12 Realizar Gate BF — aprovação e passagem para kick-off técnico

12 Realizar Gate BF — aprovação e passagem para kick-off técnico
└── dispara → passagem para o L3 Prototipagem e kick-off técnico
```

As relações 4 → 6, 4 → 7 e 4 → 8 podem ocorrer em paralelo. A aplicação deve exibir esses itens como composição e relações, não como uma sequência linear automática no mapa do L3.

---

# 6. Processos L4 dentro de Conceituação e Briefing

Todos os registros abaixo devem ser criados como `Processo operacional`, filhos de `L3 Conceituação e Briefing`.

Para cada processo, preencher os campos comuns abaixo:

- **Unidade de negócio:** deixar vazio;
- **Dimensionamento:** usar o valor indicado em FTEs;
- **Data de referência do dimensionamento:** 22/09/2026;
- **Data de revisão:** 22/09/2026;
- **Status de documentação:** `Pronto para detalhamento operacional`;
- **Status de contexto:** `Estruturado`;
- **SOP:** criar o campo como `Não cadastrado`;
- **BPMN:** criar o campo como `Não modelado`;
- **Potencial de automação:** preencher conforme a ficha;
- **Normativos e políticas vinculadas:** cadastrar como vínculos estruturados, não como texto único;
- **Sistemas e dados:** cadastrar como lista de sistemas e objetos de dados;
- **Indicadores:** cadastrar como lista de indicadores relacionados ao processo.

## L4.1 — Identificar oportunidades para o negócio

| Campo | Valor para carga |
|---|---|
| **Nome** | Identificar oportunidades para o negócio |
| **Responsável** | Gerência de Inovação e Consumer Insights |
| **Dimensionamento** | 2 FTEs alocados |
| **Objetivo** | Identificar, registrar e priorizar oportunidades de produto relevantes para a estratégia, as necessidades dos consumidores e as tendências de mercado. |
| **Proposta de valor** | Criar um pipeline de oportunidades qualificado, evitando que ideias relevantes se percam ou sejam avaliadas sem contexto estratégico. |
| **Fronteira de escopo** | Inicia na identificação de um sinal, necessidade ou oportunidade e termina com o registro estruturado, a priorização preliminar e o encaminhamento para desenvolvimento do conceito. |
| **Entradas e direcionadores** | Insights de consumidores; tendências; estratégia de categoria; dados de mercado; aprendizados de produtos existentes; oportunidades tecnológicas; demandas de negócio. |
| **Saídas e entregas** | Oportunidade registrada; descrição inicial; necessidade atendida; categoria; público; justificativa; prioridade preliminar; responsável definido. |
| **Destinos e stakeholders** | Inovação; Marketing; Consumer Insights; Gestão de Portfólio; P&D; Tecnologia; liderança de categoria. |
| **Composição** | Atividades de captura, consolidação, análise, priorização e encaminhamento de oportunidades. O detalhamento será feito no BPMN do processo. |
| **Indicadores** | Quantidade de oportunidades identificadas; tempo até registro; percentual de oportunidades priorizadas; taxa de conversão para conceito; percentual de oportunidades sem duplicidade. |
| **Sistemas e dados** | Sistema de gestão de inovação; repositório de insights; portfólio de produtos; dados de mercado; formulário ou canal de captura de oportunidades. |
| **Normativos e políticas vinculadas** | Governança de inovação; priorização de portfólio; propriedade intelectual; confidencialidade de ideias e informações estratégicas. |
| **Dores, riscos e oportunidades** | Oportunidades duplicadas; falta de critério de priorização; ausência de evidência de consumidor; informações dispersas; oportunidade de classificação e sumarização assistidas por IA. |
| **Potencial de automação** | Alto para captura, classificação, deduplicação, sumarização e roteamento inicial; decisão de priorização permanece humana. |
| **Condição de entrada** | Existe um sinal, insight, demanda ou oportunidade potencial de produto. |
| **Condição de saída** | Oportunidade registrada, priorizada preliminarmente e encaminhada para desenvolvimento de conceito. |

## L4.2 — Desenvolver conceito e proposta de valor

| Campo | Valor para carga |
|---|---|
| **Nome** | Desenvolver conceito e proposta de valor |
| **Responsável** | Gerência de Inovação de Produtos |
| **Dimensionamento** | 3 FTEs alocados |
| **Objetivo** | Transformar uma oportunidade em um conceito de produto com público, necessidade, benefício, diferenciais e hipótese de valor definidos. |
| **Proposta de valor** | Dar forma à oportunidade e criar uma hipótese clara de valor para consumidores e negócio antes de investir em desenvolvimento. |
| **Fronteira de escopo** | Inicia com a oportunidade priorizada e termina com a primeira versão documentada do conceito e da proposta de valor. |
| **Entradas e direcionadores** | Oportunidade priorizada; insights; estratégia de categoria; tendências; necessidades de consumidor; posicionamento de marca; restrições iniciais. |
| **Saídas e entregas** | Conceito; proposta de valor; público-alvo; necessidade; benefício; diferenciais; hipóteses de produto; premissas e perguntas para validação. |
| **Destinos e stakeholders** | Marketing; Brand; Consumer Insights; P&D; Design; Gestão de Portfólio; Qualidade; Regulatório. |
| **Composição** | Atividades de análise da oportunidade, definição de público, formulação de benefício, diferenciação, elaboração de conceito e consolidação do briefing inicial. |
| **Indicadores** | Tempo de desenvolvimento do conceito; percentual de conceitos com briefing completo; número de ciclos de revisão; retrabalho após validação. |
| **Sistemas e dados** | Sistema de gestão de inovação; repositório de conceitos; portfólio; bases de insights; repositório de briefings. |
| **Normativos e políticas vinculadas** | Diretrizes de marca; governança de inovação; propriedade intelectual; confidencialidade; diretrizes de comunicação de produto. |
| **Dores, riscos e oportunidades** | Conceitos genéricos; baixa diferenciação; desalinhamento entre áreas; briefing incompleto; oportunidade de gerar primeira versão do conceito a partir de evidências estruturadas. |
| **Potencial de automação** | Médio-alto para consolidação de informações, geração de rascunho e verificação de completude; aprovação e decisão de valor permanecem humanas. |
| **Condição de entrada** | Oportunidade priorizada e disponível para desenvolvimento de conceito. |
| **Condição de saída** | Conceito e proposta de valor documentados e encaminhados para pesquisa e validação. |

## L4.3 — Pesquisar e validar conceito e proposta de valor

| Campo | Valor para carga |
|---|---|
| **Nome** | Pesquisar e validar conceito e proposta de valor |
| **Responsável** | Gerência de Consumer Insights |
| **Dimensionamento** | 2 FTEs alocados |
| **Objetivo** | Avaliar se o conceito e a proposta de valor apresentam relevância, entendimento, diferenciação e potencial de aceitação pelo consumidor e pelo mercado. |
| **Proposta de valor** | Reduzir o risco de avançar com conceitos sem evidência suficiente de aderência, desejo ou potencial de mercado. |
| **Fronteira de escopo** | Inicia na definição das perguntas de pesquisa e termina com evidências, aprendizados e recomendação de manter, ajustar, retornar ou interromper o conceito. |
| **Entradas e direcionadores** | Conceito; proposta de valor; hipóteses; público-alvo; objetivos da pesquisa; critérios de decisão; orçamento; prazo. |
| **Saídas e entregas** | Plano de pesquisa; resultado; evidências; aprendizados; avaliação de aderência; recomendação; ajustes requeridos; decisão de encaminhamento. |
| **Destinos e stakeholders** | Inovação; Marketing; Brand; Consumer Insights; Gestão de Portfólio; P&D; Design; liderança decisora. |
| **Composição** | Atividades de definição do desenho de pesquisa, seleção de público, execução, consolidação de evidências, análise e recomendação. |
| **Indicadores** | Tempo de validação; taxa de conceitos aprovados; número de ciclos de ajuste; percentual de conceitos com evidência suficiente; taxa de retorno para conceito. |
| **Sistemas e dados** | Plataforma de pesquisa; repositório de insights; portfólio; base de consumidores; repositório de resultados e evidências. |
| **Normativos e políticas vinculadas** | Política de pesquisa com consumidores; privacidade; proteção de dados; consentimento; confidencialidade; propriedade intelectual. |
| **Dores, riscos e oportunidades** | Pesquisa tardia; evidência insuficiente; decisão baseada apenas em opinião; amostras inadequadas; oportunidade de consolidar evidências e comparar conceitos. |
| **Potencial de automação** | Médio para planejamento, consolidação e análise inicial; interpretação final e decisão permanecem humanas. |
| **Condição de entrada** | Conceito e proposta de valor documentados. |
| **Condição de saída** | Evidências consolidadas e recomendação de avançar, ajustar, retornar ou interromper. |

## L4.4 — Definir design de produto — Qualidade, DLL e Regulatório

| Campo | Valor para carga |
|---|---|
| **Nome** | Definir design de produto — Qualidade, DLL e Regulatório |
| **Responsável** | Gerência de Desenvolvimento de Produtos |
| **Dimensionamento** | 2 FTEs alocados |
| **Objetivo** | Estabelecer as diretrizes iniciais de design, qualidade, DLL e requisitos regulatórios que condicionam o desenvolvimento do produto. |
| **Proposta de valor** | Antecipar requisitos críticos e reduzir alterações tardias, riscos de não conformidade e retrabalho durante o desenvolvimento. |
| **Fronteira de escopo** | Inicia com o conceito aprovado ou em validação e termina com as diretrizes de design, qualidade, DLL e regulatório registradas para orientar as próximas etapas. |
| **Entradas e direcionadores** | Conceito; proposta de valor; requisitos de consumidor; estratégia de marca; padrões de qualidade; requisitos regulatórios; características esperadas do produto. |
| **Saídas e entregas** | Diretrizes de design; requisitos de qualidade; critérios de DLL; requisitos regulatórios; restrições técnicas; pendências críticas registradas. |
| **Destinos e stakeholders** | Design; Qualidade; Regulatório; P&D; Inovação; Marketing; Tecnologia; Operações. |
| **Composição** | Atividades de interpretação do conceito, levantamento de requisitos, consolidação de diretrizes, análise de restrições e registro das decisões. |
| **Indicadores** | Percentual de requisitos definidos; pendências críticas; alterações tardias por requisito não identificado; tempo de consolidação das diretrizes. |
| **Sistemas e dados** | Repositórios técnicos; sistema de qualidade; documentos regulatórios; sistema de especificações; portfólio de produtos. |
| **Normativos e políticas vinculadas** | Qualidade; segurança de produto; regulatório; design; propriedade intelectual; diretrizes de durabilidade e vida útil. |
| **Dores, riscos e oportunidades** | Requisitos descobertos tardiamente; interpretações diferentes entre áreas; siglas e critérios não padronizados; oportunidade de checklist de requisitos e rastreabilidade. |
| **Potencial de automação** | Médio-alto para checklist, identificação de lacunas e rastreabilidade; decisão técnica permanece humana. |
| **Condição de entrada** | Conceito disponível para definição de requisitos técnicos e de design. |
| **Condição de saída** | Diretrizes iniciais registradas e disponíveis para arquitetura de portfólio, design, qualidade, impacto ambiental e desenvolvimento. |

## L4.5 — Desenhar arquitetura de portfólio

| Campo | Valor para carga |
|---|---|
| **Nome** | Desenhar arquitetura de portfólio |
| **Responsável** | Gerência de Gestão de Portfólio |
| **Dimensionamento** | 1 FTE alocado |
| **Objetivo** | Posicionar o conceito na arquitetura de portfólio, considerando categoria, linha, papel estratégico, complementaridades e possíveis conflitos. |
| **Proposta de valor** | Garantir coerência do novo produto com o portfólio existente e orientar decisões de diferenciação, priorização e investimento. |
| **Fronteira de escopo** | Inicia com a análise do conceito em relação ao portfólio existente e termina com o posicionamento, as lacunas, as sobreposições e as recomendações registradas. |
| **Entradas e direcionadores** | Conceito; estratégia de categoria; portfólio existente; dados de mercado; objetivos de negócio; arquitetura de marca; proposta de valor. |
| **Saídas e entregas** | Posicionamento na arquitetura de portfólio; papel do produto; lacunas; sobreposições; riscos de canibalização; recomendações e decisão. |
| **Destinos e stakeholders** | Marketing; Brand; Gestão de Portfólio; Inovação; Finanças; Consumer Insights; liderança de categoria. |
| **Composição** | Atividades de análise do portfólio, comparação de propostas, definição de papel, avaliação de sobreposição e registro do posicionamento. |
| **Indicadores** | Tempo de posicionamento; quantidade de sobreposições identificadas; percentual de projetos alinhados à estratégia de portfólio; número de revisões. |
| **Sistemas e dados** | Portfólio de produtos; dados de mercado; repositório de estratégia; dados de categoria e vendas. |
| **Normativos e políticas vinculadas** | Governança de portfólio; diretrizes de marca; política de inovação; propriedade intelectual e confidencialidade. |
| **Dores, riscos e oportunidades** | Canibalização; duplicidade de proposta; ausência de visão consolidada; dados de portfólio desatualizados; oportunidade de análise de lacunas e similaridade. |
| **Potencial de automação** | Médio para análise comparativa, identificação de similaridade e consolidação; decisão de posicionamento permanece humana. |
| **Condição de entrada** | Conceito e proposta de valor disponíveis para análise de portfólio. |
| **Condição de saída** | Posicionamento do conceito no portfólio definido e registrado. |

## L4.6 — Definir diretrizes de design

| Campo | Valor para carga |
|---|---|
| **Nome** | Definir diretrizes de design |
| **Responsável** | Gerência de Design e Marca |
| **Dimensionamento** | 1 FTE alocado |
| **Objetivo** | Traduzir o conceito em diretrizes de design, estética, experiência e expressão de produto ou embalagem aplicáveis ao desenvolvimento. |
| **Proposta de valor** | Assegurar coerência entre a proposta de valor, a expressão da marca e a experiência esperada pelo consumidor. |
| **Fronteira de escopo** | Inicia com as premissas de conceito e marca e termina com a entrega das diretrizes iniciais para desenvolvimento e avaliação. |
| **Entradas e direcionadores** | Conceito; proposta de valor; arquitetura de portfólio; estratégia de marca; requisitos de consumidor; diretrizes de design de produto. |
| **Saídas e entregas** | Diretrizes de design; referências; critérios de avaliação; requisitos de experiência; orientações visuais e de embalagem. |
| **Destinos e stakeholders** | Design; Brand; Marketing; P&D; Desenvolvimento de Embalagens; Inovação; Qualidade; Regulatório. |
| **Composição** | Atividades de interpretação do conceito, definição de referências, elaboração de diretrizes, revisão interdisciplinar e aprovação. |
| **Indicadores** | Tempo de definição; pendências de design; retrabalho por desalinhamento; percentual de diretrizes aprovadas na primeira rodada. |
| **Sistemas e dados** | Repositório de design; gestão documental; portfólio; biblioteca de marca; sistemas de especificação de embalagem. |
| **Normativos e políticas vinculadas** | Brand book; diretrizes de design; propriedade intelectual; confidencialidade; políticas de embalagem e comunicação. |
| **Dores, riscos e oportunidades** | Diretrizes subjetivas; desalinhamento entre design e desenvolvimento; retrabalho de embalagem; oportunidade de biblioteca de padrões e critérios de aprovação. |
| **Potencial de automação** | Médio para organização de referências, checklist e comparação; decisão criativa permanece humana. |
| **Condição de entrada** | Conceito, proposta de valor e posicionamento de portfólio disponíveis. |
| **Condição de saída** | Diretrizes de design registradas e encaminhadas para desenvolvimento. |

## L4.7 — Definir diretrizes de qualidade

| Campo | Valor para carga |
|---|---|
| **Nome** | Definir diretrizes de qualidade |
| **Responsável** | Gerência de Qualidade e Segurança de Produtos |
| **Dimensionamento** | 1 FTE alocado |
| **Objetivo** | Definir requisitos e critérios de qualidade que o produto deverá atender ao longo do desenvolvimento e da disponibilização. |
| **Proposta de valor** | Antecipar critérios de qualidade e reduzir riscos de não conformidade, retrabalho e falhas no lançamento. |
| **Fronteira de escopo** | Inicia com a interpretação do conceito e dos requisitos aplicáveis e termina com a formalização das diretrizes de qualidade para desenvolvimento e validação. |
| **Entradas e direcionadores** | Conceito; categoria; requisitos regulatórios; padrões internos; riscos; expectativas de consumidor; características de produto; diretrizes de design. |
| **Saídas e entregas** | Critérios de qualidade; requisitos de teste; parâmetros críticos; requisitos de segurança; pendências registradas. |
| **Destinos e stakeholders** | Qualidade; P&D; Regulatório; Inovação; Operações; Supply; Design; Desenvolvimento de Materiais e Formulações. |
| **Composição** | Atividades de levantamento de requisitos, análise de riscos, definição de critérios, revisão com áreas e registro de diretrizes. |
| **Indicadores** | Percentual de requisitos definidos; pendências críticas; não conformidades identificadas em fases posteriores; tempo de definição. |
| **Sistemas e dados** | Sistema de qualidade; especificações; repositório técnico; gestão de riscos; documentos regulatórios. |
| **Normativos e políticas vinculadas** | Sistemas de gestão da qualidade; segurança de produto; requisitos regulatórios; normas técnicas aplicáveis; políticas internas de qualidade. |
| **Dores, riscos e oportunidades** | Requisitos incompletos; critérios não rastreados até a validação; divergência entre áreas; oportunidade de matriz de requisitos e evidências. |
| **Potencial de automação** | Médio-alto para checklist, rastreabilidade e identificação de requisitos ausentes; aprovação técnica permanece humana. |
| **Condição de entrada** | Conceito e requisitos iniciais disponíveis. |
| **Condição de saída** | Diretrizes de qualidade registradas e vinculadas ao conceito. |

## L4.8 — Avaliar impacto ambiental

| Campo | Valor para carga |
|---|---|
| **Nome** | Avaliar impacto ambiental |
| **Responsável** | Gerência de Sustentabilidade e Inovação |
| **Dimensionamento** | 1 FTE alocado |
| **Objetivo** | Avaliar impactos ambientais e oportunidades de melhoria associados ao conceito, materiais, formulação, embalagem e ciclo de vida do produto. |
| **Proposta de valor** | Incorporar sustentabilidade à decisão de inovação desde o início, reduzindo impactos e evitando mudanças tardias. |
| **Fronteira de escopo** | Inicia com a definição do objeto e dos critérios de avaliação e termina com a avaliação de impacto, as recomendações e os requisitos ambientais registrados. |
| **Entradas e direcionadores** | Conceito; materiais; formulação; embalagem; volume; cadeia de valor; metas ambientais; políticas de sustentabilidade; requisitos de mercado. |
| **Saídas e entregas** | Avaliação de impacto; oportunidades de redução; restrições; recomendações; requisitos ambientais; decisão sobre adequações necessárias. |
| **Destinos e stakeholders** | Sustentabilidade; P&D; Design; Embalagens; Qualidade; Regulatório; Operações; Supply; Inovação; Marketing. |
| **Composição** | Atividades de definição de escopo, coleta de dados, avaliação de impacto, identificação de oportunidades e registro de recomendações. |
| **Indicadores** | Impacto ambiental estimado; percentual de requisitos ambientais atendidos; oportunidades de redução de impacto; tempo de avaliação; pendências ambientais críticas. |
| **Sistemas e dados** | Ferramentas de avaliação ambiental; dados de materiais; especificações de embalagem; repositório de sustentabilidade; portfólio. |
| **Normativos e políticas vinculadas** | Políticas de sustentabilidade; requisitos ambientais; diretrizes de materiais e embalagens; compromissos públicos de sustentabilidade; requisitos regulatórios ambientais. |
| **Dores, riscos e oportunidades** | Dados incompletos de materiais; avaliação tardia de impacto; dificuldade de comparar alternativas; oportunidade de indicadores ambientais incorporados ao business case. |
| **Potencial de automação** | Médio para coleta, cálculo preliminar e comparação de alternativas; interpretação e decisão permanecem humanas. |
| **Condição de entrada** | Conceito e alternativas de materiais, formulação ou embalagem disponíveis para avaliação. |
| **Condição de saída** | Impacto ambiental e requisitos de melhoria registrados para decisão. |

## L4.9 — Construir o business case (BC)

| Campo | Valor para carga |
|---|---|
| **Nome** | Construir o business case (BC) |
| **Responsável** | Gerência de Gestão de Portfólio e Finanças de Negócio |
| **Dimensionamento** | 2 FTEs alocados |
| **Objetivo** | Consolidar a justificativa estratégica, operacional e financeira para decidir sobre a continuidade da iniciativa. |
| **Proposta de valor** | Tornar explícitos benefícios, custos, riscos, premissas e dependências antes da alocação de recursos de desenvolvimento. |
| **Fronteira de escopo** | Inicia com a consolidação das informações do conceito e termina com o business case completo, revisado e encaminhado para análise financeira e decisão. |
| **Entradas e direcionadores** | Conceito; proposta de valor; arquitetura de portfólio; diretrizes técnicas; impacto ambiental; estimativas de custo; prazo; retorno; riscos; capacidade; premissas de mercado. |
| **Saídas e entregas** | Business case; premissas; cenários; benefícios; custos; riscos; dependências; recomendação; decisão requerida. |
| **Destinos e stakeholders** | Gestão de Portfólio; Marketing; Inovação; Finanças; P&D; Operações; Supply; Sustentabilidade; liderança decisora. |
| **Composição** | Atividades de consolidação de premissas, estruturação de benefícios, estimativas, cenários, riscos, recomendação e revisão interdisciplinar. |
| **Indicadores** | Tempo de elaboração; percentual aprovado; número de revisões; completude do business case; aderência das premissas posteriores. |
| **Sistemas e dados** | Sistema de portfólio; finanças; repositórios de projeto; dados de mercado; modelos de business case; documentos técnicos. |
| **Normativos e políticas vinculadas** | Política de investimentos; governança de portfólio; aprovação financeira; gestão documental; alçadas de decisão. |
| **Dores, riscos e oportunidades** | Premissas não rastreáveis; números divergentes; baixa comparabilidade entre iniciativas; revisões manuais; oportunidade de modelo padronizado e preenchimento assistido. |
| **Potencial de automação** | Médio para consolidar dados, verificar completude e gerar cenários preliminares; recomendação e aprovação permanecem humanas. |
| **Condição de entrada** | Conceito e avaliações técnicas, ambientais e de portfólio disponíveis. |
| **Condição de saída** | Business case completo e encaminhado para análise financeira. |

## L4.10 — Realizar análise financeira

| Campo | Valor para carga |
|---|---|
| **Nome** | Realizar análise financeira |
| **Responsável** | Gerência de Finanças de Negócio e Controladoria |
| **Dimensionamento** | 1 FTE alocado |
| **Objetivo** | Avaliar a viabilidade financeira da iniciativa, considerando investimentos, custos, receitas, margem, cenários e riscos. |
| **Proposta de valor** | Apoiar decisões de priorização com uma visão financeira consistente, comparável e rastreável. |
| **Fronteira de escopo** | Inicia com a disponibilização das premissas financeiras e termina com a análise, os cenários, a recomendação e as pendências financeiras registradas. |
| **Entradas e direcionadores** | Business case; custos de desenvolvimento; custos de materiais e produção; preço; volume; margem; investimentos; cenários; premissas de mercado; cronograma. |
| **Saídas e entregas** | Análise financeira; cenários; premissas; sensibilidade; recomendação; pendências; aprovação ou necessidade de ajuste financeiro. |
| **Destinos e stakeholders** | Finanças; Controladoria; Gestão de Portfólio; Inovação; Marketing; Operações; Supply; liderança decisora. |
| **Composição** | Atividades de validação de premissas, construção de cenários, análise de retorno, avaliação de sensibilidade, revisão e emissão de recomendação. |
| **Indicadores** | Tempo de análise; percentual de análises concluídas no prazo; desvio entre estimativa e realizado; quantidade de revisões; percentual de iniciativas dentro do retorno-alvo. |
| **Sistemas e dados** | ERP; planejamento financeiro; modelos financeiros; portfólio; dados de custos, preço, volume e margem. |
| **Normativos e políticas vinculadas** | Política financeira; alçadas de aprovação; governança de investimentos; critérios de retorno; controles de planejamento financeiro. |
| **Dores, riscos e oportunidades** | Dados incompletos; premissas não alinhadas; revisões tardias; baixa integração entre modelos e sistema; oportunidade de padronizar premissas e cenários. |
| **Potencial de automação** | Médio para coleta, cálculo e análise de cenários; aprovação e decisão financeira permanecem humanas. |
| **Condição de entrada** | Business case e premissas financeiras disponíveis. |
| **Condição de saída** | Análise financeira concluída e recomendação registrada. |

## L4.11 — Criar projeto no sistema e carregar informações estratégicas

| Campo | Valor para carga |
|---|---|
| **Nome** | Criar projeto no sistema e carregar informações estratégicas |
| **Responsável** | PMO de Inovação e Gestão de Portfólio |
| **Dimensionamento** | 1 FTE alocado |
| **Objetivo** | Criar o registro oficial do projeto e garantir que suas informações estratégicas estejam disponíveis para governança e acompanhamento. |
| **Proposta de valor** | Assegurar rastreabilidade, visibilidade e continuidade das informações entre decisão, execução e gates. |
| **Fronteira de escopo** | Inicia com a decisão de registrar a iniciativa e termina com a criação do projeto, a carga mínima de dados, a vinculação dos documentos e a disponibilização para as áreas responsáveis. |
| **Entradas e direcionadores** | Conceito; business case; análise financeira; responsáveis; cronograma preliminar; categoria; gate; informações estratégicas; documentos de suporte. |
| **Saídas e entregas** | Projeto criado; dados carregados; responsáveis definidos; documentação vinculada; status inicial registrado; projeto disponível para acompanhamento. |
| **Destinos e stakeholders** | PMO; Gestão de Portfólio; Inovação; líder do projeto; Finanças; Marketing; P&D; Qualidade; Regulatório; Operações. |
| **Composição** | Atividades de conferência do pacote; criação do registro; carga de dados; vinculação de documentos; definição de responsáveis; conferência de completude; publicação. |
| **Indicadores** | Tempo de criação; percentual de registros completos; erros ou retrabalho de cadastro; projetos sem responsável; percentual de documentos vinculados. |
| **Sistemas e dados** | Sistema corporativo de projetos e portfólio; repositório de documentos; cadastro de usuários; dados de projeto, categoria, business case e gate. |
| **Normativos e políticas vinculadas** | Governança de projetos; gestão documental; controle de acesso; qualidade de dados; gestão de portfólio. |
| **Dores, riscos e oportunidades** | Cadastro duplicado; informações incompletas; divergência entre documentos e sistema; falta de padrão de preenchimento; oportunidade de validação automática de campos obrigatórios. |
| **Potencial de automação** | Alto para criação, cópia de dados, vinculação documental, validação de completude e notificações; responsabilidade pela informação permanece humana. |
| **Condição de entrada** | Pacote de decisão aprovado para registro no sistema. |
| **Condição de saída** | Projeto criado, completo, documentado e disponível para governança. |

## L4.12 — Realizar Gate BF — aprovação e passagem para kick-off técnico

| Campo | Valor para carga |
|---|---|
| **Nome** | Realizar Gate BF — aprovação e passagem para kick-off técnico |
| **Responsável** | Comitê de Governança de Inovação e Gestão de Portfólio |
| **Dimensionamento** | 1 FTE equivalente por iniciativa, considerando preparação, participação e registro do gate |
| **Objetivo** | Avaliar a completude, atratividade, viabilidade e riscos da iniciativa e decidir sua aprovação, retorno, condicionamento ou interrupção. |
| **Proposta de valor** | Garantir que os recursos de desenvolvimento sejam direcionados a iniciativas alinhadas, viáveis e suficientemente preparadas para o kick-off técnico. |
| **Fronteira de escopo** | Inicia com a preparação do pacote de decisão e termina com o registro da decisão, o encaminhamento para kick-off técnico ou o tratamento da decisão alternativa. |
| **Entradas e direcionadores** | Conceito; proposta de valor; pesquisa; arquitetura de portfólio; diretrizes de design e qualidade; impacto ambiental; business case; análise financeira; informações estratégicas do projeto; critérios do gate. |
| **Saídas e entregas** | Aprovação; reprovação; retorno para ajustes; aprovação condicionada; decisão registrada; responsáveis e condições definidos; passagem de gate; kick-off técnico acionado. |
| **Destinos e stakeholders** | Comitê de Governança; Gestão de Portfólio; Inovação; Marketing; P&D; Tecnologia; Qualidade; Regulatório; Finanças; Sustentabilidade; Operações; líder do projeto; equipe do kick-off técnico. |
| **Composição** | Atividades de preparação do pacote, verificação de completude, apresentação, avaliação de critérios, decisão, registro da ata, comunicação e encaminhamento. |
| **Indicadores** | Tempo de decisão; taxa de aprovação; taxa de retorno; percentual de gates com documentação completa; tempo entre aprovação e kick-off; percentual de decisões condicionadas. |
| **Sistemas e dados** | Sistema de portfólio e projetos; repositório de documentos; registros de aprovação; agenda e colaboração; histórico de decisões. |
| **Normativos e políticas vinculadas** | Governança de gates; alçadas de aprovação; gestão de portfólio; política de investimentos; gestão documental; regras de registro de decisão. |
| **Dores, riscos e oportunidades** | Critérios subjetivos; material incompleto; decisões sem rastreabilidade; participantes sem informação prévia; atraso entre aprovação e kick-off; oportunidade de checklist digital, pontuação de prontidão e ata assistida por IA. |
| **Potencial de automação** | Médio-alto para checklist, consolidação do pacote, cálculo de prontidão, registro e comunicação; decisão de aprovação permanece humana. |
| **Condição de entrada** | Pacote de decisão completo e projeto registrado no sistema. |
| **Condição de saída** | Decisão do Gate BF registrada e iniciativa aprovada, devolvida, condicionada ou encerrada; quando aprovada, kick-off técnico acionado. |
| **Resultado de gate** | Aprovar; aprovar com condições; retornar para ajustes; reprovar; encerrar iniciativa. |

---

# 7. L3 do Funil de Produtos sem processos detalhados nesta carga

Criar os registros abaixo como filhos de `L2 Funil de Produtos`. Preencher os campos com a estrutura indicada e deixar a composição operacional vazia até a próxima carga de processos.

## L3 — Prototipagem

| Campo | Valor para carga |
|---|---|
| **Nome** | Prototipagem |
| **Tipo de objeto** | Etapa de valor |
| **Nível** | L3 |
| **Responsável** | Gerência de Desenvolvimento e Prototipagem |
| **Unidade de negócio** |  |
| **Dimensionamento** | 10 FTEs alocados |
| **Objetivo** | Transformar conceitos aprovados em protótipos de produto, formulação, material ou embalagem para avaliação técnica e de experiência. |
| **Proposta de valor** | Tornar o conceito tangível e testável, reduzindo incertezas antes da validação final e da disponibilização. |
| **Fronteira de escopo** | Inicia após a aprovação do conceito e do Gate BF e termina com protótipos documentados e prontos para validação. |
| **Entradas e direcionadores** | Conceito aprovado; briefing; diretrizes de design e qualidade; soluções do Funil de Tecnologia; requisitos regulatórios; critérios de avaliação. |
| **Saídas e entregas** | Protótipo; formulação; material; embalagem; especificações iniciais; resultados de testes preliminares; pendências técnicas. |
| **Destinos e stakeholders** | Validação; P&D; Qualidade; Regulatório; Design; Operações; Supply; Marketing; Gestão de Portfólio. |
| **Composição** | Ainda não detalhada nesta carga. |
| **Indicadores** | Tempo de prototipagem; número de ciclos; taxa de protótipos aprovados; retrabalho; aderência a custo e prazo. |
| **Sistemas e dados** | Sistemas de formulação, materiais, especificações, laboratório, qualidade e gestão de projetos. |
| **Normativos e políticas vinculadas** | Qualidade; segurança de produto; regulatório; propriedade intelectual; gestão de laboratório. |
| **Dores, riscos e oportunidades** | Ciclos excessivos; disponibilidade limitada de capacidade técnica; requisitos não incorporados; oportunidade de reutilização de soluções tecnológicas. |

## L3 — Validação

| Campo | Valor para carga |
|---|---|
| **Nome** | Validação |
| **Tipo de objeto** | Etapa de valor |
| **Nível** | L3 |
| **Responsável** | Gerência de Validação e Qualidade de Produtos |
| **Unidade de negócio** |  |
| **Dimensionamento** | 8 FTEs alocados |
| **Objetivo** | Confirmar que o protótipo atende aos requisitos de consumidor, desempenho, qualidade, segurança, regulatório e viabilidade definidos. |
| **Proposta de valor** | Reduzir riscos técnicos, regulatórios e de mercado antes da decisão de disponibilização. |
| **Fronteira de escopo** | Inicia com o protótipo e os critérios de validação definidos e termina com a aprovação, retorno para ajustes ou interrupção da iniciativa. |
| **Entradas e direcionadores** | Protótipo; especificações; critérios de qualidade; requisitos regulatórios; resultados de pesquisa; metas de desempenho; critérios de sustentabilidade. |
| **Saídas e entregas** | Resultados de testes; evidências; aprovação técnica; pendências; recomendações; decisão de validação; autorização ou retorno. |
| **Destinos e stakeholders** | Disponibilização; Qualidade; Regulatório; P&D; Operações; Supply; Marketing; Gestão de Portfólio; liderança decisora. |
| **Composição** | Ainda não detalhada nesta carga. |
| **Indicadores** | Taxa de aprovação; tempo de validação; número de não conformidades; ciclos de retrabalho; percentual de requisitos atendidos. |
| **Sistemas e dados** | Sistema de qualidade; laboratório; especificações; testes; regulatório; gestão de projetos e documentos. |
| **Normativos e políticas vinculadas** | Qualidade; segurança de produto; regulatório; testes; sustentabilidade; requisitos de mercado. |
| **Dores, riscos e oportunidades** | Testes tardios; critérios incompletos; evidências dispersas; atraso por não conformidade; oportunidade de rastreabilidade requisito-evidência. |

## L3 — Disponibilização

| Campo | Valor para carga |
|---|---|
| **Nome** | Disponibilização |
| **Tipo de objeto** | Etapa de valor |
| **Nível** | L3 |
| **Responsável** | Gerência de Implementação e Disponibilização de Produtos |
| **Unidade de negócio** |  |
| **Dimensionamento** | 9 FTEs alocados |
| **Objetivo** | Preparar e encaminhar o produto validado para disponibilização, assegurando prontidão operacional, documental, regulatória e comercial. |
| **Proposta de valor** | Transformar um produto validado em uma entrega pronta para execução, abastecimento, comunicação e entrada no mercado. |
| **Fronteira de escopo** | Inicia com a aprovação da validação e termina com a disponibilização do produto e a transferência para as áreas responsáveis pela operação e comercialização. |
| **Entradas e direcionadores** | Produto validado; especificações finais; aprovações; plano de disponibilização; requisitos de produção; supply; regulatório; qualidade; materiais de comunicação. |
| **Saídas e entregas** | Produto disponibilizado; documentação final; dados mestres; plano de operação; transferência de responsabilidade; registros de lançamento. |
| **Destinos e stakeholders** | Operações; Supply; Comercial; Marketing; Qualidade; Regulatório; Finanças; atendimento; canais de venda; consumidores. |
| **Composição** | Ainda não detalhada nesta carga. |
| **Indicadores** | Aderência ao prazo de disponibilização; percentual de prontidão; pendências na transferência; tempo entre validação e disponibilização; incidentes de lançamento. |
| **Sistemas e dados** | ERP; gestão de portfólio; dados mestres; qualidade; regulatório; supply; documentos de lançamento. |
| **Normativos e políticas vinculadas** | Qualidade; regulatório; gestão de dados mestres; lançamento de produtos; comunicação e sustentabilidade. |
| **Dores, riscos e oportunidades** | Dependências tardias; dados mestres incompletos; desalinhamento entre áreas; atraso de produção ou supply; oportunidade de checklist integrado de prontidão. |

---

# 8. L3 do Funil de Tecnologia

Criar os registros abaixo como filhos de `L2 Funil de Tecnologia`. Eles devem utilizar a mesma ficha padronizada e permanecer disponíveis para receber processos em uma carga posterior.

## L3 — Prospecção e Ideação

- **Responsável:** Gerência de Tecnologia e Inovação Técnica.
- **Unidade de negócio:** deixar vazio.
- **Dimensionamento:** 5 FTEs alocados.
- **Objetivo:** Identificar tendências, necessidades e oportunidades tecnológicas que possam viabilizar novos produtos ou melhorar produtos existentes.
- **Proposta de valor:** Ampliar o repertório tecnológico e antecipar soluções para desafios de produto.
- **Fronteira de escopo:** Da identificação de uma tendência ou oportunidade técnica até a priorização para investigação ou desenvolvimento.
- **Entradas e direcionadores:** Desafios do Funil de Produtos; tendências científicas; demandas de consumidor; patentes; fornecedores; centros de pesquisa; metas de sustentabilidade.
- **Saídas e entregas:** Oportunidades tecnológicas; hipóteses; propostas de investigação; parceiros e tecnologias priorizados.
- **Destinos e stakeholders:** Funil de Produtos; P&D; Qualidade; Regulatório; parceiros; fornecedores e centros de pesquisa.
- **Composição:** A detalhar posteriormente.
- **Indicadores:** Oportunidades identificadas; tempo de triagem; taxa de conversão para desenvolvimento; soluções aplicadas em produtos.
- **Sistemas e dados:** Repositório de pesquisa; gestão de inovação; patentes; fornecedores; portfólio tecnológico.
- **Normativos e políticas vinculadas:** Pesquisa; propriedade intelectual; confidencialidade; parcerias e fornecedores.
- **Dores, riscos e oportunidades:** Baixa visibilidade do repertório tecnológico; duplicidade de pesquisas; oportunidade de busca semântica e conexão com desafios de produto.

## L3 — Desenvolvimento de Insumos

- **Responsável:** Gerência de Desenvolvimento de Insumos.
- **Unidade de negócio:** deixar vazio.
- **Dimensionamento:** 6 FTEs alocados.
- **Objetivo:** Desenvolver e qualificar insumos necessários para atender aos requisitos de novos produtos.
- **Proposta de valor:** Disponibilizar insumos adequados em qualidade, custo, segurança, sustentabilidade e capacidade de fornecimento.
- **Fronteira de escopo:** Da demanda técnica pelo insumo até a solução desenvolvida, documentada e encaminhada para prototipagem ou validação.
- **Entradas e direcionadores:** Requisitos de produto; especificações; fornecedores; matérias-primas; metas de custo e sustentabilidade; critérios de qualidade.
- **Saídas e entregas:** Insumo desenvolvido; especificação; amostra; resultados de testes; fornecedor ou fonte; pendências técnicas.
- **Destinos e stakeholders:** Funil de Produtos; P&D; Qualidade; Supply; Compras; Operações; Regulatório.
- **Composição:** A detalhar posteriormente.
- **Indicadores:** Tempo de desenvolvimento; taxa de aprovação; custo-alvo; disponibilidade; requisitos atendidos.
- **Sistemas e dados:** Especificações; qualidade; fornecedores; laboratório; portfólio tecnológico.
- **Normativos e políticas vinculadas:** Qualidade; segurança; regulatório; compras; sustentabilidade; fornecedores.
- **Dores, riscos e oportunidades:** Dependência de fornecedor; falta de amostras; requisitos tardios; oportunidade de reutilização de insumos já qualificados.

## L3 — Tecnologias de Ingredientes e Formulações

- **Responsável:** Gerência de Desenvolvimento de Ingredientes e Formulações.
- **Unidade de negócio:** deixar vazio.
- **Dimensionamento:** 7 FTEs alocados.
- **Objetivo:** Desenvolver ingredientes, formulações e soluções técnicas compatíveis com o conceito e os requisitos do produto.
- **Proposta de valor:** Viabilizar desempenho, sensorial, segurança, custo e diferenciação tecnológica do produto.
- **Fronteira de escopo:** Da definição do desafio de formulação até a solução técnica documentada e disponível para prototipagem ou validação.
- **Entradas e direcionadores:** Conceito; requisitos de desempenho; ingredientes; especificações; diretrizes de qualidade; requisitos regulatórios; metas de custo e sustentabilidade.
- **Saídas e entregas:** Formulação; ingrediente; protótipo técnico; especificação; resultados de teste; requisitos e restrições.
- **Destinos e stakeholders:** Funil de Produtos; P&D; Qualidade; Regulatório; Operações; Supply; fornecedores.
- **Composição:** A detalhar posteriormente.
- **Indicadores:** Ciclos de formulação; tempo de desenvolvimento; taxa de aprovação; aderência a custo; requisitos atendidos.
- **Sistemas e dados:** Sistema de formulação; laboratório; especificações; qualidade; regulatório; gestão de projetos.
- **Normativos e políticas vinculadas:** Qualidade; segurança de produto; regulatório; propriedade intelectual; gestão de laboratório.
- **Dores, riscos e oportunidades:** Muitos ciclos de ajuste; dados de ensaio dispersos; baixa reutilização de formulações; oportunidade de base técnica pesquisável.

## L3 — Desenvolvimento de Materiais e Embalagens

- **Responsável:** Gerência de Desenvolvimento de Materiais e Embalagens.
- **Unidade de negócio:** deixar vazio.
- **Dimensionamento:** 6 FTEs alocados.
- **Objetivo:** Desenvolver materiais e embalagens que atendam a design, funcionalidade, proteção, custo, qualidade e sustentabilidade.
- **Proposta de valor:** Entregar soluções de embalagem e materiais viáveis, desejáveis, seguras e compatíveis com a operação.
- **Fronteira de escopo:** Da definição da necessidade de material ou embalagem até a solução especificada e encaminhada para prototipagem, validação ou produção.
- **Entradas e direcionadores:** Conceito; diretrizes de design; requisitos de proteção; materiais; metas ambientais; custos; fornecedores; requisitos de operação e supply.
- **Saídas e entregas:** Material; embalagem; especificação; protótipo; testes; fornecedor; avaliação ambiental; restrições técnicas.
- **Destinos e stakeholders:** Funil de Produtos; Design; Qualidade; Sustentabilidade; Supply; Compras; Operações; Regulatório.
- **Composição:** A detalhar posteriormente.
- **Indicadores:** Tempo de desenvolvimento; ciclos de protótipo; aderência a custo; requisitos ambientais atendidos; não conformidades.
- **Sistemas e dados:** Especificações; materiais; embalagem; qualidade; fornecedores; sustentabilidade; gestão documental.
- **Normativos e políticas vinculadas:** Embalagens; qualidade; regulatório; sustentabilidade; propriedade intelectual; fornecedores.
- **Dores, riscos e oportunidades:** Alterações tardias; dependência de fornecedor; dados incompletos de materiais; oportunidade de avaliação ambiental desde o conceito.

## L3 — Produto Ampliado

- **Responsável:** Gerência de Inovação e Soluções de Produto.
- **Unidade de negócio:** deixar vazio.
- **Dimensionamento:** 3 FTEs alocados.
- **Objetivo:** Desenvolver extensões, complementos, experiências ou soluções ampliadas que aumentem o valor entregue pelo produto.
- **Proposta de valor:** Criar diferenciação além do produto principal e ampliar a experiência e a relevância para o consumidor.
- **Fronteira de escopo:** Da definição da oportunidade de ampliação até a solução estruturada e encaminhada para avaliação de produto.
- **Entradas e direcionadores:** Conceito; necessidades de consumidor; estratégia de marca; dados de uso; oportunidades de serviço ou experiência; tecnologias disponíveis.
- **Saídas e entregas:** Conceito de produto ampliado; experiência; serviço; complemento; modelo de operação; requisitos de validação.
- **Destinos e stakeholders:** Marketing; Brand; Consumer Insights; Funil de Produtos; Tecnologia; Operações; canais e parceiros.
- **Composição:** A detalhar posteriormente.
- **Indicadores:** Oportunidades identificadas; aderência ao conceito; potencial de adoção; tempo de desenvolvimento; valor incremental estimado.
- **Sistemas e dados:** Portfólio; pesquisa; gestão de inovação; dados de consumidor; gestão de parceiros.
- **Normativos e políticas vinculadas:** Marca; experiência do consumidor; privacidade; propriedade intelectual; parceiros e canais.
- **Dores, riscos e oportunidades:** Conceito de produto ampliado pouco definido; dependências com operação e parceiros; oportunidade de combinar produto, serviço e experiência.

## L3 — Metodologias e Modelos

- **Responsável:** Gerência de Métodos e Excelência em Inovação.
- **Unidade de negócio:** deixar vazio.
- **Dimensionamento:** 4 FTEs alocados.
- **Objetivo:** Desenvolver, organizar e disponibilizar metodologias, modelos, padrões e ferramentas para apoiar a inovação e o desenvolvimento de produtos.
- **Proposta de valor:** Aumentar a consistência, a velocidade e a qualidade da execução das iniciativas de inovação.
- **Fronteira de escopo:** Da identificação de uma necessidade metodológica até a criação, teste, publicação e manutenção do método ou modelo.
- **Entradas e direcionadores:** Dores do funil; aprendizados de projetos; padrões corporativos; requisitos de governança; necessidades de análise e decisão.
- **Saídas e entregas:** Método; modelo; template; checklist; padrão; treinamento; ferramenta de apoio; atualização de processo.
- **Destinos e stakeholders:** Funil de Produtos; Funil de Tecnologia; PMO; P&D; Qualidade; Marketing; liderança; times de projeto.
- **Composição:** A detalhar posteriormente.
- **Indicadores:** Adoção de métodos; tempo de atualização; percentual de projetos utilizando padrões; redução de retrabalho; satisfação dos usuários.
- **Sistemas e dados:** Repositório de conhecimento; templates; gestão de projetos; colaboração; indicadores de inovação.
- **Normativos e políticas vinculadas:** Governança de inovação; gestão documental; padrões corporativos; qualidade; gestão do conhecimento.
- **Dores, riscos e oportunidades:** Métodos diferentes entre áreas; baixa adoção; modelos desatualizados; oportunidade de biblioteca única e assistente de método.

---

# 9. Padrão de apresentação na tela

Ao abrir qualquer registro L1, L2 ou L3, apresentar a ficha com estes blocos, nesta ordem:

1. **Cabeçalho**
   - Nome;
   - nível;
   - tipo de objeto;
   - responsável;
   - unidade de negócio vazia;
   - dimensionamento em FTEs;
   - data de revisão;
   - documentação;
   - contexto.

2. **Objetivo e proposta de valor**
   - Objetivo;
   - proposta de valor.

3. **Fronteira de escopo**
   - texto de fronteira do registro.

4. **Entradas e saídas**
   - entradas e direcionadores;
   - saídas e entregas;
   - destinos e stakeholders.

5. **Composição**
   - filhos do registro;
   - quantidade de filhos;
   - processos vinculados;
   - relações explícitas.

6. **Indicadores e desempenho**
   - lista de indicadores;
   - valores iniciais, quando disponíveis;
   - periodicidade e meta como campos preparados para preenchimento.

7. **Sistemas e dados**
   - lista de sistemas;
   - objetos de dados;
   - sistemas críticos;
   - integrações e dependências.

8. **Normativos e políticas**
   - cartões ou lista de vínculos;
   - nome;
   - tipo;
   - versão;
   - status;
   - próxima revisão.

9. **Dores, riscos e oportunidades**
   - lista de pontos de atenção;
   - risco;
   - oportunidade de melhoria;
   - potencial de automação.

Ao abrir um registro L4, manter o mesmo cabeçalho e acrescentar:

- condição de entrada;
- condição de saída;
- SOP;
- BPMN;
- composição operacional;
- regras de negócio;
- exceções;
- handoffs;
- dados manipulados;
- sistemas por etapa;
- potencial de automação;
- resultado de gate, quando aplicável.

---

# 10. Resultado esperado da carga

Ao concluir a carga, a navegação deve funcionar assim:

```text
Arquitetura de Processos
  → Gestão de Novação de Produtos
    → Funil de Produtos
      → Conceituação e Briefing
        → Identificar oportunidades para o negócio
        → Desenvolver conceito e proposta de valor
        → Pesquisar e validar conceito e proposta de valor
        → Definir design de produto — Qualidade, DLL e Regulatório
        → Desenhar arquitetura de portfólio
        → Definir diretrizes de design
        → Definir diretrizes de qualidade
        → Avaliar impacto ambiental
        → Construir o business case (BC)
        → Realizar análise financeira
        → Criar projeto no sistema e carregar informações estratégicas
        → Realizar Gate BF — aprovação e passagem para kick-off técnico
```

Também deve funcionar:

```text
Gestão de Novação de Produtos
  → Funil de Tecnologia
    → Prospecção e Ideação
    → Desenvolvimento de Insumos
    → Tecnologias de Ingredientes e Formulações
    → Desenvolvimento de Materiais e Embalagens
    → Produto Ampliado
    → Metodologias e Modelos
```

Os registros de **Prototipagem**, **Validação** e **Disponibilização** devem existir como L3 no Funil de Produtos, mesmo sem processos L4 detalhados nesta carga, para que a cadeia de valor fique completa.

O resultado deve preservar a separação entre:

```text
L1/L2/L3 → contexto, composição, relações e governança da arquitetura
L4       → processo operacional, SOP, BPMN, regras, atividades, exceções e automação
```
