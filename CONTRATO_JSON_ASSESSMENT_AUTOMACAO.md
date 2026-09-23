# Contrato JSON para Prompt de I.A. — Assessment de Automação e Soluções Futuras

Este documento define o **contrato formal de dados (JSON Schema e Tipagem TypeScript)** que o modelo de Inteligência Artificial deve gerar para alimentar todas as abas e componentes da tela de **Detalhamento de Automação / Catálogo de Soluções**.

---

## 1. Visão Geral da Estrutura Raiz

O JSON retornado pela I.A. deve ter o seguinte formato raiz:

```json
{
  "processId": "identificador-do-processo",
  "processName": "Nome do Processo Analisado",
  "sopCode": "S2P08",
  "sopTitle": "Nome da SOP / Procedimento Operacional Padrão",
  "summaryText": "Resumo executivo do assessment e horizonte de transformação",
  "volumetrySummary": "Resumo de volumetria, periodicidade e tempos médios",
  "macroBlocks": [ /* Lista de Macroetapas ordenadas */ ],
  "solutions": [ /* Lista de Propostas de Soluções Futuras e Cenários */ ],
  "steps": [ /* Lista de Passos detalhados da SOP */ ]
}
```

---

## 2. Dicionário de Tipos e Enums

### 2.1. Classificação do Passo (`classification`)
| Código | Nome Completo | Descrição |
| :--- | :--- | :--- |
| `ME` | Manual Estruturado | Execução mecânica, regras 100% fixas, sem julgamento humano. |
| `MS` | Manual Semi-Estruturado | Julgamento simples e codificável (árvore de regras: "se X então Y"). |
| `MA` | Manual Analítico | Análise de contexto amplo, interpretação subjetiva humana. |
| `SA` | Semi-Automatizado | Gatilho manual com execução sistêmica em 80%+ do fluxo. |
| `AU` | Automatizado | Execução 100% sistêmica ponta a ponta sem intervenção. |
| `MNA` | Manual Não-Automatizável | Exige presença física, assinatura presencial ou validação legal. |

### 2.2. Perfis de Cenários de Implementação (`profile`)
| Perfil | Label no Frontend | Propósito |
| :--- | :--- | :--- |
| `quick_win` | Quick win | Soluções ágeis, foco incremental (ex: macros, Power Query, scripts locais). |
| `intermediate` | Intermediário | Evolução intermediária (ex: bots RPA assistidos, workflows Microsoft 365). |
| `transformative` | Transformação | Transformação estruturante (ex: integrações nativas via API/BAPI/OData, arquitetura orientada a eventos). |

### 2.3. Níveis de Esforço (`effort.level`)
- `"low"`: Baixo
- `"medium"`: Médio
- `"high"`: Alto
- `"very_high"`: Muito Alto
- `"not_applicable"`: Não aplicável

### 2.4. Famílias Tecnológicas (`family`)
- `spreadsheet_automation` (Excel VBA, Office Scripts)
- `data_transformation` (Power Query, dbt, scripts Python)
- `rpa` (Power Automate Desktop, UiPath, SAP Build Process Automation)
- `workflow` (Power Automate Cloud, Camunda, ServiceNow)
- `system_integration` (APIs REST, OData, SAP BAPI/RFC, Webhooks)
- `decision_rules` (Tabelas de Decisão, BRF+, Drools, Motor de Regras)
- `monitoring` (Dashboards, Alertas Teams/Slack, Grafana)
- `document_management` (SharePoint, SAP ArchiveLink, OpenText)
- `ai_assistance` (LLMs, OCR inteligente, Agentes de IA)
- `other` (Outras tecnologias)

---

## 3. Contrato Detalhado dos Objetos

### 3.1. Macroetapas (`macroBlocks[]`)
Cada macroetapa agrupa logicamente os steps da SOP e as capacidades.

```typescript
interface MacroBlock {
  id: string;          // Ex: "mb-01", "mb-02"
  order: number;       // Sequência numérica (1, 2, 3...)
  name: string;        // Ex: "Entrada e preparação"
  description: string; // Ex: "Preparar parâmetros, documentos e dados."
  objective: string;   // Ex: "Consultar parâmetros, preparar filtros e estruturar dados."
  stepCount: number;   // Quantidade de steps pertencentes a este bloco
}
```

---

### 3.2. Proposta de Solução Futura (`solutions[]`)
Representa cada linha da tabela do **Catálogo de Soluções** e o cabeçalho da gaveta lateral.

> **Importante para os Cenários:**  
> Cada solução pode ter de **1 a 3 caminhos de implementação** (`implementationPaths`), contemplando opcionalmente *Quick win*, *Intermediário* e *Transformação*.  
> Cada cenário **deve preencher obrigatoriamente os 4 campos requeridos na interface**:
> 1. **O que é**: `description`
> 2. **Por que faz sentido**: `whenItMakesSense`
> 3. **Tecnologias candidatas**: `technologies[]`
> 4. **Esforço estimado**: `effort` (nível, confiança e direcionadores)

```typescript
interface SolutionRecommendation {
  id: string;                        // Ex: "sol-01"
  macroBlockId: string;              // Vinculado a macroBlocks[].id (Ex: "mb-01")
  macroBlockName: string;            // Nome redundante para performance (Ex: "Entrada e preparação")
  capabilityId: string;              // Ex: "cap-01"
  capabilityName: string;            // Ex: "Estruturação de dados"
  name: string;                      // Nome da solução futura (Ex: "Automação estruturada de parâmetros")
  description: string;               // Descrição curta da solução
  whySelected: string;               // [OBRIGATÓRIO] RACIONAL DA PROPOSIÇÃO (Por que foi considerada)
  stepIds: string[];                 // Lista de IDs dos steps cobertos (Ex: ["01", "03", "04"])
  status: "future_state_proposal" | "needs_validation" | "technically_validated";
  
  // Lista de até 3 cenários de implementação (Quick win / Intermediário / Transformação)
  implementationPaths: Array<{
    id: string;                      // Ex: "path-01-qw"
    profile: "quick_win" | "intermediate" | "transformative";
    name: string;                    // Título do cenário (Ex: "Manter planilha e automatizar preparação")
    description: string;             // [CAMPO 1]: O que é o cenário e escopo proposto
    whenItMakesSense: string;        // [CAMPO 2]: Por que faz sentido este caminho
    technologies: Array<{            // [CAMPO 3]: Tecnologias candidatas
      name: string;                  // Ex: "Excel VBA / Office Scripts"
      family: string;                // Ex: "spreadsheet_automation"
      roleDescription: string;       // Papel da tecnologia (Ex: "Higieniza campos obrigatórios")
      status: "candidate" | "needs_validation" | "technically_validated";
      limitations?: string[];        // Restrições/atenções (Ex: ["Governança descentralizada"])
    }>;
    effort: {                        // [CAMPO 4]: Esforço estimado do cenário
      level: "low" | "medium" | "high" | "very_high"; // Baixo, Médio, Alto, Muito Alto
      confidence: "low" | "medium" | "high";          // Confiança da estimativa
      drivers?: string[];            // Direcionadores (Ex: ["Macros M365", "Fórmulas Power Query"])
      unknowns?: string[];           // Incertezas a validar (Ex: ["Permissões de execução no tenant"])
    };
    mechanism?: string;              // Opcional: mecanismo de regras (Ex: "Tabela de decisão com BRF+")
    benefits?: string[];             // Benefícios diretos entregues pelo cenário
  }>;
}
```

---

### 3.3. Detalhamento do Passo da SOP (`steps[]`)
Lista detalhada de cada passo analisado do processo.

```typescript
interface ProcessStepDetail {
  id: string;                        // ID único do step (Ex: "01", "02", "1.1")
  sourceStep: string;                // Código original da SOP (Ex: "1.1", "2.1")
  title: string;                     // Ação principal executada no step
  description: string;               // Descrição textual da atividade
  classification: "ME" | "MS" | "MA" | "SA" | "AU" | "MNA"; // Código de automação
  macroBlockId: string;              // Vinculado a macroBlocks[].id
  macroBlockName: string;            // Nome do bloco (Ex: "Entrada e preparação")
  capabilityId?: string;             // Opcional: capacidade associada
  capabilityName?: string;           // Opcional: nome da capacidade
  solutionId?: string;               // ID da solução que endereça este step (Ex: "sol-01")
  solutionName?: string;             // Nome da solução que endereça este step
  evidence?: {
    rawDescription?: string;         // Descrição fática transcrita da SOP
    sourceReference?: string;        // Ex: "SOP S2P08 - Seção 1.1"
    systemsMentioned?: string[];     // Ex: ["SAP GUI", "Excel", "SharePoint"]
    inputs?: string[];               // Entradas do passo (Ex: ["Planilha de Variantes"])
    outputs?: string[];              // Saídas do passo (Ex: ["Arquivo DME gerado"])
  };
  aiInterpretation?: {
    classificationRationale: string; // Por que o modelo atribuiu essa classificação (ME, MS, etc.)
  };
}
```

---

## 4. Exemplo Completo de Resposta JSON da I.A.

O modelo de linguagem deve gerar um output JSON válido equivalente ao exemplo abaixo:

```json
{
  "processId": "pagamentos-especiais",
  "processName": "Processamento de Pagamentos Especiais (NA)",
  "sopCode": "SOP-FIN-008",
  "sopTitle": "Execução de Pagamentos Manuais e Tratamento de Exceções",
  "summaryText": "Mapeamento das oportunidades de automação para o ciclo financeiro de pagamentos especiais.",
  "volumetrySummary": "27 atividades na SOP, executadas 2 vezes por semana, tempo médio de 40 minutos por ciclo.",
  "macroBlocks": [
    {
      "id": "mb-01",
      "order": 1,
      "name": "Entrada e preparação",
      "description": "Preparar parâmetros, documentos e dados.",
      "objective": "Consultar parâmetros, preparar filtros e estruturar os dados que suportam a proposta de pagamento.",
      "stepCount": 2
    },
    {
      "id": "mb-02",
      "order": 2,
      "name": "Execução operacional",
      "description": "Executar simulações, consultas e baixa no ERP.",
      "objective": "Interagir com o ERP para simular partidas em aberto e disparar lotes de pagamento.",
      "stepCount": 1
    }
  ],
  "solutions": [
    {
      "id": "sol-01",
      "macroBlockId": "mb-01",
      "macroBlockName": "Entrada e preparação",
      "capabilityId": "cap-01",
      "capabilityName": "Estruturação de dados",
      "name": "Automação estruturada de parâmetros e preparação de planilha",
      "description": "Valida parâmetros, padroniza filtros e sinaliza divergências antes do carregamento.",
      "whySelected": "A solução foi sugerida porque os steps mapeados apresentam preenchimento manual repetitivo de parâmetros, risco de duplicidade de identificadores e cópia mecânica de colunas entre planilha compartilhada e SAP.",
      "stepIds": ["01", "02"],
      "status": "future_state_proposal",
      "implementationPaths": [
        {
          "id": "path-01-qw",
          "profile": "quick_win",
          "name": "Manter a planilha e automatizar a preparação",
          "description": "Automatiza a limpeza de dados, formatação de campos e validação de regras diretamente na planilha por meio de scripts integrados.",
          "whenItMakesSense": "Quando a equipe desejar uma solução de rápida implantação (2 a 4 semanas) mantendo a planilha como ponto de entrada inicial sem alterações no ERP.",
          "technologies": [
            {
              "name": "Excel VBA / Office Scripts",
              "family": "spreadsheet_automation",
              "roleDescription": "Executa macros para formatação, validação de campos obrigatórios e geração automática do código identificador.",
              "status": "candidate",
              "limitations": ["Governança de código descentralizada", "Dependência da estrutura de colunas fixa"]
            },
            {
              "name": "Power Query",
              "family": "data_transformation",
              "roleDescription": "Higieniza, remove caracteres inválidos e valida duplicidade de chaves entre abas.",
              "status": "candidate",
              "limitations": ["Não dispara ações transacionais diretas no ERP"]
            }
          ],
          "effort": {
            "level": "low",
            "confidence": "high",
            "drivers": ["Scripts locais em M365", "Fórmulas de higienização nativas"],
            "unknowns": ["Permissões de execução de scripts corporativos no tenant"]
          }
        },
        {
          "id": "path-01-int",
          "profile": "intermediate",
          "name": "Orquestração assistida via Power Automate e RPA",
          "description": "Robô assistido lê a planilha validada na pasta de rede e realiza a digitação guiada dos parâmetros diretamente nas telas do ERP.",
          "whenItMakesSense": "Quando a equipe necessita eliminar a digitação manual repetitiva no SAP, mas não dispõe de orçamento ou prazo imediato para APIs de integração.",
          "technologies": [
            {
              "name": "Power Automate Desktop",
              "family": "rpa",
              "roleDescription": "Automação de interface de usuário (UI) para input sequencial de campos na transação F110.",
              "status": "candidate",
              "limitations": ["Sensível a alterações de layout de tela ou resolução gráfica"]
            }
          ],
          "effort": {
            "level": "medium",
            "confidence": "medium",
            "drivers": ["Mapeamento de telas no SAP GUI", "Tratamento de exceções de conexão"],
            "unknowns": ["Habilitação de SAP GUI Scripting em ambiente produtivo"]
          }
        },
        {
          "id": "path-01-transf",
          "profile": "transformative",
          "name": "Substituição da planilha por integração estruturada via API/BAPI",
          "description": "Substitui a manipulação de planilhas por formulário web corporativo conectado diretamente às BAPIs transacionais do SAP.",
          "whenItMakesSense": "Quando a organização busca governança total, auditoria em tempo real e eliminação definitiva de arquivos intermediários.",
          "technologies": [
            {
              "name": "SAP BAPI / OData Services",
              "family": "system_integration",
              "roleDescription": "Chamadas nativas para inserção segura e atômica de lotes de pagamento.",
              "status": "candidate",
              "limitations": ["Requer esforço de desenvolvimento ABAP/BASIS e homologação rigorosa"]
            }
          ],
          "effort": {
            "level": "high",
            "confidence": "high",
            "drivers": ["Desenvolvimento de conectores transacionais", "Testes de segregação de funções (SoD)"],
            "unknowns": ["Janelas de release no ambiente ERP central"]
          }
        }
      ]
    }
  ],
  "steps": [
    {
      "id": "01",
      "sourceStep": "1.1",
      "title": "Abrir a planilha de variantes de pagamento nas abas US e CA.",
      "description": "A analista acessa a pasta compartilhada da Tesouraria e abre a planilha de variantes, conferindo os parâmetros da data corrente.",
      "classification": "ME",
      "macroBlockId": "mb-01",
      "macroBlockName": "Entrada e preparação",
      "capabilityId": "cap-01",
      "capabilityName": "Estruturação de dados",
      "solutionId": "sol-01",
      "solutionName": "Automação estruturada de parâmetros e preparação de planilha",
      "evidence": {
        "rawDescription": "Navega até a pasta compartilhada no SharePoint e abre o arquivo Excel selecionando as abas US_Special e CA_Special.",
        "sourceReference": "SOP-FIN-008, item 1.1",
        "systemsMentioned": ["Excel", "SharePoint"],
        "inputs": ["Planilha de Variantes (.xlsx)"],
        "outputs": ["Abas de parâmetros abertas"]
      },
      "aiInterpretation": {
        "classificationRationale": "Classificado como ME (Manual Estruturado): atividade mecânica repetitiva com critérios e diretórios padronizados sem exigência de julgamento discricionário."
      }
    },
    {
      "id": "02",
      "sourceStep": "1.2",
      "title": "Copiar parâmetros de Run Date e Identification para a transação.",
      "description": "Copia a data do dia e os prefixos identificadores para registrar o lote.",
      "classification": "ME",
      "macroBlockId": "mb-01",
      "macroBlockName": "Entrada e preparação",
      "capabilityId": "cap-01",
      "capabilityName": "Estruturação de dados",
      "solutionId": "sol-01",
      "solutionName": "Automação estruturada de parâmetros e preparação de planilha",
      "evidence": {
        "rawDescription": "Preenche os campos de execução a partir dos valores tabulados na planilha.",
        "sourceReference": "SOP-FIN-008, item 1.2",
        "systemsMentioned": ["Excel", "SAP GUI"],
        "inputs": ["Data do dia", "Código identificador"],
        "outputs": ["Campos preenchidos"]
      },
      "aiInterpretation": {
        "classificationRationale": "Classificado como ME (Manual Estruturado): cópia determinística de dados ponto a ponto."
      }
    }
  ]
}
```

---

## 5. Diretrizes para o System Prompt da I.A.

Para garantir que o modelo gere a saída perfeitamente compatível, adicione as seguintes instruções no System Prompt:

1. **Racional da Proposição Obrigatório (`whySelected`)**:  
   Explique claramente *por que a solução foi considerada* com base nas evidências observadas na SOP (dores manuais, transferências mecânicas de dados, riscos operacionais).
2. **Até 3 Cenários por Solução (`implementationPaths`)**:  
   Sempre que aplicável, formule os três horizontes de maturidade tecnológica:
   - `quick_win`: Automação rápida de baixo atrito (planilhas, scripts, macros).
   - `intermediate`: Automação assistida ou intermediária (RPA, workflows M365).
   - `transformative`: Solução definitiva integrada (APIs, BAPIs, ERP nativo).
3. **Quatro Campos Estruturados nos Cenários**:  
   Para cada cenário em `implementationPaths`, preencha impreterivelmente:
   - `description` (**O que é**)
   - `whenItMakesSense` (**Por que faz sentido**)
   - `technologies` (**Tecnologias candidatas**, com nome e papel funcional)
   - `effort` (**Esforço estimado**, com `level`, `confidence` e `drivers`)
4. **Vínculo Bidirecional**:  
   Todo `id` presente em `solution.stepIds` deve corresponder a um step na lista `steps[]` cujo `solutionId` aponte para a solução correspondente.
5. **Classificação Rigorosa dos Steps**:  
   Utilize unicamente os códigos formais: `ME`, `MS`, `MA`, `SA`, `AU` ou `MNA`.
